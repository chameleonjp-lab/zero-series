import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog as productionCatalog } from '../src/catalog.js';
import { createRankingAdapter, RankingError } from '../src/ranking/adapter.js';
import {
  createProductionReader,
  createTestOnlyRankingReader,
  RANKING_LIMIT,
  RANKING_RPC_NAME,
  RANKING_RPC_URL,
  validateRankingConnection,
} from '../src/ranking/reader.js';

const score = { unit: '点', scale: 1, decimals: 0, order: 'desc' };
const scope = {
  gameSlug: 'faitofuraito_normal',
  mode: 'normal',
  rulesVersion: 'fixture-rules-1',
  contractVersion: 'fixture-contract-1',
  limit: RANKING_LIMIT,
};

function fixtureBinding(overrides = {}) {
  return {
    testOnly: true,
    gameId: 'faitofuraito',
    mode: 'normal',
    gameSlug: 'faitofuraito_normal',
    rulesVersion: scope.rulesVersion,
    contractVersion: scope.contractVersion,
    endpoint: RANKING_RPC_URL,
    rpcName: RANKING_RPC_NAME,
    method: 'POST',
    args: { p_game_slug: 'faitofuraito_normal', p_limit: 5 },
    score: { ...score },
    evidenceRef: 'test-fixture',
    ...overrides,
  };
}

function jsonResponse(payload, { status = 200, retryAfter = null } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: name => name.toLowerCase() === 'retry-after' ? retryAfter : null },
    json: async () => payload,
  };
}

function testCatalog() {
  return [{
    id: 'faitofuraito',
    ranking: {
      enabled: true,
      displayState: 'ready',
      defaultMode: 'normal',
      modes: [{
        id: 'normal',
        label: 'ノーマル',
        gameSlug: scope.gameSlug,
        rulesVersion: scope.rulesVersion,
        contractVersion: scope.contractVersion,
        score: { ...score },
        verification: {
          valid: true,
          readOnly: true,
          scopeIsolation: true,
          aggregation: 'registered_name_best',
        },
      }],
    },
  }];
}

test('production reader keeps every current ranking disconnected and performs no fetch', async () => {
  let calls = 0;
  const read = createProductionReader({
    catalog: productionCatalog,
    fetchImpl: async () => { calls += 1; throw new Error('must not fetch'); },
  });
  const ff = productionCatalog.find(game => game.id === 'faitofuraito');
  assert.equal(validateRankingConnection(ff), true);
  await assert.rejects(read({
    gameSlug: 'faitofuraito_normal', mode: 'normal', rulesVersion: null,
    contractVersion: null, limit: 5,
  }), { code: 'not_connected' });
  assert.equal(calls, 0);
});

test('catalog flags and caller-supplied transport values cannot create a production binding', () => {
  const active = testCatalog()[0];
  assert.equal(validateRankingConnection(active), false);
  assert.throws(() => createProductionReader({ catalog: [active] }), { code: 'invalid_contract' });
  assert.throws(() => createProductionReader({ catalog: productionCatalog, endpoint: 'https://attacker.invalid/rpc' }), /cannot be overridden/);
  assert.throws(() => createProductionReader({ catalog: productionCatalog, bindings: [fixtureBinding()] }), /cannot be overridden/);
});

test('test-only reader uses one fixed RPC and sends only the two verified arguments', async () => {
  const calls = [];
  const fakeFetch = async function (url, init) {
    calls.push({ receiver: this, url, init });
    return jsonResponse([{
      rank_no: 1,
      display_name: '架空の飛行士',
      first_score: 80,
      best_score: 120,
      play_count: 3,
      updated_at: '2026-10-01T00:00:00Z',
      normalized_name: 'private-fixture',
    }]);
  };
  const read = createTestOnlyRankingReader({ fixtureBindings: [fixtureBinding()], fetchImpl: fakeFetch });
  const adapter = createRankingAdapter({ catalog: testCatalog(), read });
  const result = await adapter.request('faitofuraito', 'normal');

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, RANKING_RPC_URL);
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].receiver, globalThis);
  assert.equal(calls[0].init.redirect, 'error');
  assert.equal(calls[0].init.credentials, 'omit');
  assert.equal(calls[0].init.cache, 'no-store');
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    p_game_slug: 'faitofuraito_normal',
    p_limit: 5,
  });
  assert.deepEqual(Object.keys(JSON.parse(calls[0].init.body)).sort(), ['p_game_slug', 'p_limit']);
  assert.equal(calls[0].init.headers.apikey, 'sb_publishable_test_fixture');
  assert.equal('Authorization' in calls[0].init.headers, false);
  assert.deepEqual(result.rows, [{ rank: 1, displayName: '架空の飛行士', bestValue: 120 }]);
  assert.equal('normalized_name' in result.rows[0], false);
  assert.equal('play_count' in result.rows[0], false);
  assert.equal('updated_at' in result.rows[0], false);
  assert.equal(result.sourceUpdatedAt, null);
});

test('reader accepts only the two FF candidate scopes and a fixed limit', async () => {
  let calls = 0;
  const read = createTestOnlyRankingReader({
    fixtureBindings: [fixtureBinding()],
    fetchImpl: async () => { calls += 1; return jsonResponse([]); },
  });
  await assert.rejects(read({ ...scope, gameSlug: 'kaisen_standard' }), { code: 'invalid_scope' });
  await assert.rejects(read({ ...scope, mode: 'easy', gameSlug: 'faitofuraito_easy' }), { code: 'not_connected' });
  await assert.rejects(read({ ...scope, rulesVersion: null }), { code: 'not_connected' });
  await assert.rejects(read({ ...scope, limit: 6 }), { code: 'invalid_scope' });
  assert.equal(calls, 0);
});

test('legacy anon key is accepted for read access and is never required when the production allowlist is empty', async () => {
  const anonKey = 'header.eyJyb2xlIjoiYW5vbiJ9.signature';
  let headers;
  const read = createTestOnlyRankingReader({
    fixtureBindings: [fixtureBinding()],
    publicApiKey: anonKey,
    fetchImpl: async (_url, init) => { headers = init.headers; return jsonResponse([]); },
  });
  await read(scope);
  assert.equal(headers.apikey, anonKey);
  assert.equal(headers.Authorization, `Bearer ${anonKey}`);

  assert.equal(typeof createProductionReader({ catalog: productionCatalog }), 'function');
  assert.throws(() => createProductionReader({ catalog: productionCatalog, publicApiKey: 'sb_secret_do_not_use' }), /publishable or anon key/);
  assert.throws(() => createTestOnlyRankingReader({
    fixtureBindings: [fixtureBinding()],
    publicApiKey: 'sb_secret_do_not_use',
    fetchImpl: async () => jsonResponse([]),
  }), /publishable or anon key/);
});

test('HTTP errors preserve only status and Retry-After, while malformed payloads are rejected', async () => {
  const limited = createTestOnlyRankingReader({
    fixtureBindings: [fixtureBinding()],
    fetchImpl: async () => jsonResponse({ private: 'ignored' }, { status: 429, retryAfter: '3' }),
  });
  await assert.rejects(limited(scope), error => error instanceof RankingError
    && error.code === 'http' && error.status === 429 && error.retryAfter === '3');

  for (const payload of [null, {}, Array.from({ length: 6 }, () => ({ rank_no: 1, display_name: 'x', best_score: 1 })),
    [{ rank_no: 1, display_name: 'x', best_score: '1' }]]) {
    const malformed = createTestOnlyRankingReader({
      fixtureBindings: [fixtureBinding()],
      fetchImpl: async () => jsonResponse(payload),
    });
    await assert.rejects(malformed(scope), { code: 'invalid_response' });
  }
});

test('test-only bindings still reject another title and arbitrary RPC targets', () => {
  assert.throws(() => createTestOnlyRankingReader({
    fixtureBindings: [fixtureBinding({ gameId: 'kaisen' })],
    fetchImpl: async () => jsonResponse([]),
  }), /validated test-only binding/);
  assert.throws(() => createTestOnlyRankingReader({
    fixtureBindings: [fixtureBinding({ endpoint: 'https://attacker.invalid/rpc' })],
    fetchImpl: async () => jsonResponse([]),
  }), /validated test-only binding/);
  assert.throws(() => createTestOnlyRankingReader({ fixtureBindings: [fixtureBinding()] }), /mocked fetch/);
});
