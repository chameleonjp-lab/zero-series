import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog as productionCatalog } from '../src/catalog.js';
import { createRankingAdapter, RankingError, scopeKey } from '../src/ranking/adapter.js';
import { createRankingStore, FRESH_MS, STALE_MS } from '../src/ranking/store.js';
import { retryDelay } from '../src/ranking/requests.js';

// Fictional records and an injected reader only. No fixture has an endpoint.
const score = { unit: '点', scale: 1, decimals: 0, order: 'desc' };
const row = (rank = 1, displayName = 'テスト飛行士', bestValue = 100) => ({ rank, displayName, bestValue });

function fixtureCatalog() {
  return [
    ['faitofuraito', ['normal', 'easy']],
    ['kaisen', ['standard']],
    ['senryou', ['standard']],
  ].map(([id, modes]) => ({
    id,
    ranking: {
      enabled: true, displayState: 'ready', defaultMode: modes[0],
      modes: modes.map(mode => ({
        id: mode, label: mode, gameSlug: `${id}_${mode}`,
        rulesVersion: 'fixture-rules-1', contractVersion: 'fixture-contract-1', score: { ...score },
        verification: { valid: true, readOnly: true, scopeIsolation: true, aggregation: 'registered_name_best' },
      })),
    },
  }));
}

function response(request, rows = [row()], extra = {}) {
  const { limit, ...scope } = request;
  assert.equal(limit, 5);
  return { scope, rows, score: { ...score }, ...extra };
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

async function settle() {
  // Drain the adapter, queue, store, and subscriber continuations.
  for (let step = 0; step < 30; step += 1) await Promise.resolve();
}

function fakeClock() {
  let elapsed = 0;
  let wall = Date.parse('2026-10-05T04:00:00Z');
  let serial = 0;
  const timers = new Map();
  return {
    now: () => wall,
    setTimer: (callback, delay) => {
      const id = ++serial;
      timers.set(id, { at: elapsed + delay, callback });
      return id;
    },
    clearTimer: id => timers.delete(id),
    setWall: value => { wall = value; },
    rewind: amount => { wall -= amount; },
    async advance(amount) {
      await settle();
      const goal = elapsed + amount;
      while (true) {
        const next = [...timers.entries()].filter(([, timer]) => timer.at <= goal)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        const [id, timer] = next;
        wall += timer.at - elapsed;
        elapsed = timer.at;
        timers.delete(id);
        timer.callback();
        await settle();
      }
      wall += goal - elapsed;
      elapsed = goal;
      await settle();
    },
    count: () => timers.size,
  };
}

function storeFor(t, read, options = {}) {
  const clock = fakeClock();
  const store = createRankingStore({ catalog: fixtureCatalog(), read, ...clock, ...options });
  t.after(() => store.destroy());
  return { store, clock };
}

test('production scopes stay disconnected, including games without confirmed modes', async t => {
  let reads = 0;
  const store = createRankingStore({ catalog: productionCatalog, read: () => { reads += 1; } });
  t.after(() => store.destroy());
  for (const game of productionCatalog) {
    const state = await store.load(game.id);
    assert.equal(state.state, 'not_connected');
    assert.deepEqual(state.rows, []);
    assert.equal(state.fetchedAt, null);
    if (!game.ranking.modes.length) {
      assert.equal(state.mode, null);
      assert.equal(state.rulesVersion, null);
    }
  }
  const states = [];
  store.subscribe('faitofuraito', state => states.push(state));
  await store.select('faitofuraito', 'easy');
  assert.equal(states.at(-1).mode, 'easy');
  assert.equal(states.at(-1).state, 'not_connected');
  assert.equal(reads, 0);
});

test('adapter requires the allowlist, verified contract and injected reader', async () => {
  let reads = 0;
  const catalog = fixtureCatalog();
  const adapter = createRankingAdapter({ catalog, read: request => { reads += 1; return response(request); } });
  await assert.rejects(adapter.request('seme', 'normal'), { code: 'invalid_scope' });
  await assert.rejects(adapter.request('faitofuraito', 'unknown'), { code: 'invalid_scope' });
  catalog[0].ranking.modes[0].verification.scopeIsolation = false;
  await assert.rejects(adapter.request('faitofuraito', 'normal'), { code: 'not_connected' });
  assert.equal(reads, 0);
  const noReader = createRankingAdapter({ catalog: fixtureCatalog() });
  assert.equal(noReader.describe('faitofuraito', 'normal').availableState, 'not_connected');
});

test('adapter preserves 0/1/4/5 rows, server ties and name order, while removing raw fields', async () => {
  const rows = [row(1, '同名', 100), row(1, 'あお', 100), row(3, '同名', 90), row(4, 'ぜっと', 80), row(4, 'えー', 80)];
  for (const length of [0, 1, 4, 5]) {
    const adapter = createRankingAdapter({ catalog: fixtureCatalog(), read: request => response(request,
      rows.slice(0, length).map(item => ({ ...item, normalized_name: 'private', play_count: 99 })),
      { updated_at: 'not-a-snapshot', fetchedAt: 0 },
    ) });
    const result = await adapter.request('faitofuraito', 'normal');
    assert.equal(result.state, length ? 'ready' : 'empty');
    assert.deepEqual(result.rows, rows.slice(0, length));
    assert.equal(result.sourceUpdatedAt, null);
    assert.equal('fetchedAt' in result, false);
    assert.equal('normalized_name' in (result.rows[0] ?? {}), false);
  }
});

test('scope mismatches reject other games, modes, rule versions and contract versions', async () => {
  for (const [key, value] of [['gameSlug', 'senryou_standard'], ['mode', 'easy'], ['rulesVersion', 'old'], ['contractVersion', 'old']]) {
    const adapter = createRankingAdapter({ catalog: fixtureCatalog(), read: request => {
      const result = response(request);
      result.scope[key] = value;
      return result;
    } });
    await assert.rejects(adapter.request('faitofuraito', 'normal'), { code: 'invalid_scope' });
  }
  assert.notEqual(scopeKey({ gameSlug: 'a:b', mode: 'c', rulesVersion: 'd', contractVersion: 'e' }),
    scopeKey({ gameSlug: 'a', mode: 'b:c', rulesVersion: 'd', contractVersion: 'e' }));
});

test('adapter rejects excessive, duplicate, misordered and malformed rows instead of hiding violations', async () => {
  const cases = [
    Array.from({ length: 6 }, (_, index) => row(index + 1, `架空${index}`)),
    [row(), row()], [row(3), row(1, '別名')], [row(0)], [row(1.5)], [row(Infinity)],
    [row(1, '架空', NaN)], [row(1, '架空', Infinity)], [row(1, '架空', '100')],
    [row(1, 'x'.repeat(81))], [row(1, '')], [row(1, ' \t')], [row(1, '名前\n偽装')], [row(1, '名前\u202e偽装')],
    [{ rank: 1, displayName: 123, bestValue: 1 }],
  ];
  for (const rows of cases) {
    const adapter = createRankingAdapter({ catalog: fixtureCatalog(), read: request => response(request, rows) });
    await assert.rejects(adapter.request('faitofuraito', 'normal'), { code: 'invalid_response' });
  }
  for (const extra of [{ state: 'ready' }, { state: 'bogus' }, { score: { ...score, unit: '秒' } }, { sourceUpdatedAt: 'unknown' }]) {
    const adapter = createRankingAdapter({ catalog: fixtureCatalog(), read: request => response(request, [], extra) });
    await assert.rejects(adapter.request('faitofuraito', 'normal'), { code: 'invalid_response' });
  }
  const catalog = fixtureCatalog();
  catalog[0].ranking.modes[0].score.scale = Number.MIN_VALUE;
  const adapter = createRankingAdapter({ catalog, read: request => response(request, [row()], { score: { ...score, scale: Number.MIN_VALUE } }) });
  await assert.rejects(adapter.request('faitofuraito', 'normal'), { code: 'invalid_response' });
});

test('HTML in a name remains text, with no grouping by display name', async () => {
  const rows = [row(1, '<script>window.fixture=1</script>'), row(2, '同名', 90), row(3, '同名', 80)];
  const adapter = createRankingAdapter({ catalog: fixtureCatalog(), read: request => response(request, rows) });
  assert.deepEqual((await adapter.request('faitofuraito', 'normal')).rows, rows);
});

test('ascending time scores preserve raw values and verified unit, scale and rounding', async () => {
  const catalog = fixtureCatalog();
  const timing = { unit: '秒', scale: 1_000, decimals: 2, order: 'asc' };
  catalog[0].ranking.modes[0].score = timing;
  const rows = [row(1, '速い架空', 1_234), row(2, '次の架空', 2_000)];
  const adapter = createRankingAdapter({ catalog, read: request => response(request, rows, { score: timing }) });
  const result = await adapter.request('faitofuraito', 'normal');
  assert.deepEqual(result.rows, rows);
  assert.deepEqual(result.score, timing);
  assert.equal((result.rows[0].bestValue / result.score.scale).toFixed(result.score.decimals), '1.23');
});

test('same-scope in-flight loads share one promise and fresh memory result', async t => {
  const pending = deferred();
  let reads = 0;
  let request;
  const { store } = storeFor(t, req => { reads += 1; request = req; return pending.promise; });
  const first = store.load('faitofuraito');
  const second = store.load('faitofuraito');
  assert.equal(first, second);
  await settle();
  assert.equal(reads, 1);
  pending.resolve(response(request));
  assert.equal((await first).state, 'ready');
  assert.equal((await store.load('faitofuraito')).state, 'ready');
  assert.equal(reads, 1);
});

test('maximum two active attempts keep one card failure local', async t => {
  const pending = [];
  let active = 0;
  let maximum = 0;
  const { store } = storeFor(t, (request, { signal }) => {
    active += 1;
    maximum = Math.max(maximum, active);
    const hold = deferred();
    let finished = false;
    const finish = () => { if (!finished) { finished = true; active -= 1; } };
    signal.addEventListener('abort', finish, { once: true });
    hold.promise.finally(finish).catch(() => {});
    pending.push({ request, ...hold });
    return hold.promise;
  });
  const first = store.load('faitofuraito');
  const second = store.load('kaisen');
  const third = store.load('senryou');
  await settle();
  assert.equal(pending.length, 2);
  pending[0].reject(new RankingError('http', { status: 403 }));
  await settle();
  assert.equal(pending.length, 3);
  pending[1].resolve(response(pending[1].request));
  pending[2].resolve(response(pending[2].request));
  assert.equal((await first).state, 'error');
  assert.equal((await second).state, 'ready');
  assert.equal((await third).state, 'ready');
  assert.equal(maximum, 2);
});

test('a faulty subscriber cannot turn valid responses into errors or stop other cards', async t => {
  const { store } = storeFor(t, request => response(request));
  const states = [];
  store.subscribe('faitofuraito', () => { throw new Error('fixture renderer failure'); });
  store.subscribe('kaisen', state => states.push(state.state));
  assert.equal((await store.load('faitofuraito')).state, 'ready');
  assert.equal((await store.load('kaisen')).state, 'ready');
  assert.equal(states.at(-1), 'ready');
});

test('8 second timeout and exactly one transient retry end even when the reader ignores abort', async t => {
  let reads = 0;
  const { store, clock } = storeFor(t, () => { reads += 1; return new Promise(() => {}); });
  const result = store.load('faitofuraito');
  await clock.advance(8_000);
  assert.equal(reads, 1);
  assert.equal(store.getState('faitofuraito').state, 'loading');
  await clock.advance(250);
  assert.equal(reads, 2);
  await clock.advance(8_000);
  const state = await result;
  assert.equal(state.state, 'error');
  assert.equal(state.errorCode, 'timeout');
  assert.deepEqual(state.rows, []);
  assert.equal(clock.count(), 0);
});

test('429 Retry-After is respected and a successful retry clears the failure', async t => {
  let reads = 0;
  const { store, clock } = storeFor(t, request => {
    reads += 1;
    if (reads === 1) throw new RankingError('http', { status: 429, retryAfter: '3' });
    return response(request);
  });
  const result = store.load('faitofuraito');
  await clock.advance(2_999);
  assert.equal(reads, 1);
  await clock.advance(1);
  assert.equal(reads, 2);
  assert.equal((await result).state, 'ready');
  assert.equal(store.getState('faitofuraito').errorCode, null);
  assert.equal(retryDelay('Mon, 05 Oct 2026 04:00:05 GMT', Date.parse('2026-10-05T04:00:00Z')), 5_000);
  assert.equal(retryDelay('9'.repeat(400), 0), 250);
  assert.equal(retryDelay(Infinity, 0), 250);
});

test('authentication, invalid scope and malformed JSON are not retried', async t => {
  for (const error of [new RankingError('http', { status: 400 }), new RankingError('http', { status: 401 }),
    new RankingError('http', { status: 403 }), new RankingError('invalid_scope'), new SyntaxError('fixture malformed')]) {
    let reads = 0;
    const { store } = storeFor(t, () => { reads += 1; throw error; });
    assert.equal((await store.load('faitofuraito')).state, 'error');
    assert.equal(reads, 1);
  }
});

test('cache automatically becomes stale at 5 minutes and hides rows after 30 without polling', async t => {
  let reads = 0;
  const { store, clock } = storeFor(t, request => { reads += 1; return response(request); });
  const states = [];
  store.subscribe('faitofuraito', state => states.push(state.state));
  const fetched = (await store.load('faitofuraito')).fetchedAt;
  await clock.advance(FRESH_MS - 1);
  assert.equal(store.getState('faitofuraito').state, 'ready');
  await clock.advance(1);
  assert.equal(states.at(-1), 'stale');
  assert.equal(store.getState('faitofuraito').fetchedAt, fetched);
  await clock.advance(STALE_MS - FRESH_MS);
  assert.equal(store.getState('faitofuraito').state, 'stale');
  await clock.advance(1);
  assert.equal(states.at(-1), 'error');
  assert.deepEqual(store.getState('faitofuraito').rows, []);
  assert.equal(reads, 1);
});

test('tab-return refresh applies expiration and source time stays separate from fetch time', async t => {
  const sourceUpdatedAt = '2026-10-01T00:00:00Z';
  const { store, clock } = storeFor(t, request => response(request, [row()], { sourceUpdatedAt }));
  const ready = await store.load('faitofuraito');
  assert.equal(ready.fetchedAt, clock.now());
  assert.equal(ready.sourceUpdatedAt, sourceUpdatedAt);
  clock.setWall(clock.now() + STALE_MS + 1);
  store.refresh();
  assert.equal(store.getState('faitofuraito').state, 'error');
  assert.equal(store.getState('faitofuraito').fetchedAt, null);
});

test('backwards and invalid clocks never promote old rows back to fresh', async t => {
  const { store, clock } = storeFor(t, request => response(request));
  await store.load('faitofuraito');
  clock.rewind(60_000);
  store.refresh();
  assert.equal(store.getState('faitofuraito').state, 'stale');
  await clock.advance(60_000);
  assert.equal(store.getState('faitofuraito').state, 'stale');
  await clock.advance(STALE_MS - FRESH_MS + 1);
  assert.deepEqual(store.getState('faitofuraito').rows, []);
  const other = storeFor(t, request => response(request));
  await other.store.load('faitofuraito');
  other.clock.setWall(NaN);
  other.store.refresh();
  assert.equal(other.store.getState('faitofuraito').state, 'error');
  assert.deepEqual(other.store.getState('faitofuraito').rows, []);
});

test('a failed refresh uses only its validated same-scope cache, with loading then stale', async t => {
  let reads = 0;
  const { store, clock } = storeFor(t, request => {
    reads += 1;
    if (reads > 1) throw new RankingError('http', { status: 503 });
    return response(request);
  });
  const original = await store.load('faitofuraito');
  await clock.advance(2_000);
  const pending = store.retry('faitofuraito');
  assert.equal(store.getState('faitofuraito').state, 'loading');
  assert.deepEqual(store.getState('faitofuraito').rows, original.rows);
  await clock.advance(250);
  const stale = await pending;
  assert.equal(stale.state, 'stale');
  assert.equal(stale.fetchedAt, original.fetchedAt);
  assert.equal(reads, 3);
});

test('invalid response, scope mismatch and lost permissions invalidate even fresh cache', async t => {
  for (const kind of ['scope', 'malformed', 'permission']) {
    let reads = 0;
    const { store, clock } = storeFor(t, request => {
      reads += 1;
      if (reads === 1) return response(request);
      if (kind === 'permission') throw new RankingError('http', { status: 403 });
      if (kind === 'malformed') return response(request, [row(0)]);
      return response(request, [row()], { scope: { ...request, mode: 'easy' } });
    });
    await store.load('faitofuraito');
    await clock.advance(2_000);
    const state = await store.retry('faitofuraito');
    assert.equal(state.state, 'error');
    assert.deepEqual(state.rows, []);
    assert.equal(reads, 2);
  }
});

test('mode change aborts and discards late old responses; mode caches never cross', async t => {
  const pending = [];
  const { store } = storeFor(t, (request, { signal }) => {
    const hold = deferred();
    pending.push({ request, signal, ...hold });
    return hold.promise;
  });
  const normal = store.load('faitofuraito');
  await settle();
  const easy = store.select('faitofuraito', 'easy');
  await settle();
  assert.equal(pending[0].signal.aborted, true);
  assert.deepEqual(store.getState('faitofuraito').rows, []);
  pending[1].resolve(response(pending[1].request, [row(1, 'イージー架空', 20)]));
  await easy;
  pending[0].resolve(response(pending[0].request, [row(1, '旧ノーマル架空', 500)]));
  await normal;
  assert.equal(store.getState('faitofuraito').mode, 'easy');
  assert.equal(store.getState('faitofuraito').rows[0].displayName, 'イージー架空');
  const nextNormal = store.select('faitofuraito', 'normal');
  await settle();
  assert.equal(pending.length, 3);
  assert.deepEqual(store.getState('faitofuraito').rows, []);
  pending[2].resolve(response(pending[2].request, [row(1, '新ノーマル架空', 300)]));
  await nextNormal;
  await store.select('faitofuraito', 'easy');
  assert.equal(pending.length, 3);
  assert.equal(store.getState('faitofuraito').rows[0].displayName, 'イージー架空');
});

test('mode change cancels a queued transient retry from the previous scope', async t => {
  const modes = [];
  const { store, clock } = storeFor(t, request => {
    modes.push(request.mode);
    if (request.mode === 'normal') throw new RankingError('http', { status: 429, retryAfter: '3' });
    return response(request, [row(1, 'イージー架空')]);
  });
  const normal = store.load('faitofuraito');
  await settle();
  await store.select('faitofuraito', 'easy');
  await clock.advance(3_000);
  await normal;
  assert.deepEqual(modes, ['normal', 'easy']);
  assert.equal(store.getState('faitofuraito').mode, 'easy');
});

test('manual retries are shared while loading and limited to one start per 2 seconds', async t => {
  let reads = 0;
  const { store, clock } = storeFor(t, () => { reads += 1; throw new RankingError('http', { status: 403 }); });
  await store.load('faitofuraito');
  assert.equal(store.getState('faitofuraito').retryDisabled, true);
  await store.retry('faitofuraito');
  assert.equal(reads, 1);
  await clock.advance(1_999);
  await store.retry('faitofuraito');
  assert.equal(reads, 1);
  await clock.advance(1);
  assert.equal(store.getState('faitofuraito').retryDisabled, false);
  const first = store.retry('faitofuraito');
  assert.equal(first, store.retry('faitofuraito'));
  await first;
  assert.equal(reads, 2);
});

test('all-modes stop and disconnect hide cached rows and reject late responses', async t => {
  for (const policy of ['stop', 'disconnect']) {
    let pending;
    let lastRequest;
    let reads = 0;
    const { store, clock } = storeFor(t, request => {
      reads += 1;
      if (reads <= 2) return response(request, [row(1, request.mode)]);
      lastRequest = request;
      pending = deferred();
      return pending.promise;
    });
    await store.load('faitofuraito');
    await store.select('faitofuraito', 'easy');
    await clock.advance(2_000);
    const inFlight = store.retry('faitofuraito');
    await settle();
    store[policy]('faitofuraito');
    pending.resolve(response(lastRequest));
    await inFlight;
    for (const mode of ['normal', 'easy']) {
      const state = await store.select('faitofuraito', mode);
      assert.equal(state.state, policy === 'stop' ? 'stopped' : 'not_connected');
      assert.deepEqual(state.rows, []);
    }
    assert.equal(reads, 3);
  }
  const emptyModes = structuredClone(productionCatalog);
  const store = createRankingStore({ catalog: emptyModes });
  t.after(() => store.destroy());
  assert.equal(store.stop('kaisen').state, 'stopped');
});

test('stopping one mode keeps another mode available and removes a queued request', async t => {
  const pending = [];
  const { store } = storeFor(t, request => {
    const hold = deferred();
    pending.push({ request, ...hold });
    return hold.promise;
  });
  const normal = store.load('faitofuraito');
  const kaisen = store.load('kaisen');
  const queued = store.load('senryou');
  await settle();
  assert.equal(pending.length, 2);
  store.stop('senryou');
  store.stop('faitofuraito', 'normal');
  await normal;
  await queued;
  const easy = store.select('faitofuraito', 'easy');
  await settle();
  assert.equal(pending.length, 3);
  assert.equal(pending[2].request.mode, 'easy');
  pending[1].resolve(response(pending[1].request));
  pending[2].resolve(response(pending[2].request));
  assert.equal((await kaisen).state, 'ready');
  assert.equal((await easy).state, 'ready');
  assert.equal((await store.select('faitofuraito', 'normal')).state, 'stopped');
  assert.equal(store.getState('senryou').state, 'stopped');
});

test('only a verified source stop signal may stop a scope, and it overrides stale cache', async t => {
  let reads = 0;
  const catalog = fixtureCatalog();
  catalog[0].ranking.modes[0].verification.stopSignal = true;
  const { store, clock } = storeFor(t, request => {
    reads += 1;
    return reads === 1 ? response(request) : response(request, [], { state: 'stopped' });
  }, { catalog });
  await store.load('faitofuraito');
  await clock.advance(FRESH_MS);
  assert.equal((await store.load('faitofuraito')).state, 'stopped');
  assert.deepEqual(store.getState('faitofuraito').rows, []);
  await store.load('faitofuraito');
  assert.equal(reads, 2);
  const adapter = createRankingAdapter({ catalog: fixtureCatalog(), read: request => response(request, [], { state: 'stopped' }) });
  await assert.rejects(adapter.request('faitofuraito', 'normal'), { code: 'invalid_contract' });
});

test('contract version changes and revoked verification discard cache and in-flight work', async t => {
  const catalog = fixtureCatalog();
  let pending;
  let request;
  let reads = 0;
  const { store, clock } = storeFor(t, req => {
    reads += 1;
    if (reads === 1) return response(req);
    request = req;
    pending = deferred();
    return pending.promise;
  }, { catalog });
  await store.load('faitofuraito');
  catalog[0].ranking.modes[0].contractVersion = 'fixture-contract-2';
  store.refresh();
  assert.deepEqual(store.getState('faitofuraito').rows, []);
  await clock.advance(2_000);
  const current = store.load('faitofuraito');
  await settle();
  catalog[0].ranking.modes[0].verification.valid = false;
  store.refresh();
  pending.resolve(response(request));
  await current;
  assert.equal(store.getState('faitofuraito').state, 'not_connected');
  assert.deepEqual(store.getState('faitofuraito').rows, []);
});

test('destroy cancels waiting work and timers and suppresses future subscriber changes', async t => {
  let reads = 0;
  const { store, clock } = storeFor(t, request => { reads += 1; return response(request); });
  let notifications = 0;
  store.subscribe('faitofuraito', () => { notifications += 1; });
  await store.load('faitofuraito');
  store.destroy();
  const before = notifications;
  await clock.advance(STALE_MS + 1);
  await store.load('faitofuraito');
  assert.equal(clock.count(), 0);
  assert.equal(notifications, before);
  assert.equal(reads, 1);
  const delayed = storeFor(t, () => {
    reads += 1;
    throw new RankingError('http', { status: 429, retryAfter: '3' });
  });
  const waiting = delayed.store.load('faitofuraito');
  await settle();
  delayed.store.destroy();
  await delayed.clock.advance(3_000);
  await waiting;
  assert.equal(delayed.clock.count(), 0);
  assert.equal(reads, 2);
});
