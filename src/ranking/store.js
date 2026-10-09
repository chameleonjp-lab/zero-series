import { RankingError, createRankingAdapter, normalizeRankingError } from './adapter.js';
import { createRequestRunner } from './requests.js';

export const FRESH_MS = 5 * 60_000;
export const STALE_MS = 30 * 60_000;
export const MANUAL_RETRY_MS = 2_000;

const descriptorStamp = descriptor => JSON.stringify([descriptor.key, descriptor.score, descriptor.availableState]);

/** Page-local state. There is no storage, polling, endpoint discovery, or logging. */
export function createRankingStore({ adapter, catalog, read, now = Date.now, setTimer = setTimeout, clearTimer = clearTimeout } = {}) {
  adapter ??= createRankingAdapter({ catalog, read });
  const runner = createRequestRunner({ now, setTimer, clearTimer });
  const cache = new Map();
  const requests = new Map();
  const sourceStops = new Set();
  const cards = new Map();
  let highWater = -Infinity;
  let destroyed = false;
  let suspended = false;

  for (const gameId of adapter.gameIds) {
    const descriptor = adapter.describe(gameId);
    cards.set(gameId, {
      gameId, mode: descriptor.mode, descriptor, stamp: descriptorStamp(descriptor), generation: 0,
      request: null, error: null, policies: new Map(), listeners: new Set(), cooldownTimer: null,
    });
  }

  function cardFor(gameId) {
    const card = cards.get(gameId);
    if (!card) throw new RankingError('invalid_scope');
    return card;
  }

  function dropCache(key) {
    const entry = cache.get(key);
    if (entry) clearTimer(entry.timer);
    cache.delete(key);
  }

  function cancelRequest(record) {
    if (!record) return;
    record.invalid = true;
    record.controller.abort(new RankingError('aborted'));
    if (requests.get(record.key) === record) requests.delete(record.key);
  }

  function detach(card) {
    if (!card.request) return;
    const record = card.request.record;
    record.owners.delete(card);
    card.request = null;
    if (!record.owners.size) cancelRequest(record);
  }

  function invalidate(key) {
    dropCache(key);
    const record = requests.get(key);
    cancelRequest(record);
    if (record) {
      for (const card of record.owners) {
        card.generation += 1;
        card.request = null;
      }
      record.owners.clear();
    }
  }

  function availability(card) {
    return card.policies.get(card.mode) ?? card.descriptor.availableState
      ?? (sourceStops.has(card.descriptor.key) ? 'stopped' : null);
  }

  function clock() {
    const wall = now();
    const valid = Number.isFinite(wall) && wall >= 0;
    const backwards = valid && wall < highWater;
    if (valid) highWater = Math.max(highWater, wall);
    for (const [key, entry] of cache) {
      if (!valid) {
        dropCache(key);
        for (const card of cards.values()) if (card.descriptor.key === key) card.error = 'invalid_clock';
        continue;
      }
      entry.age = Math.max(entry.age, highWater - entry.fetchedAt, backwards ? FRESH_MS : 0);
      if (entry.age > STALE_MS) {
        dropCache(key);
        for (const card of cards.values()) if (card.descriptor.key === key) card.error = 'cache_expired';
      }
    }
    return { wall, valid, backwards };
  }

  function scheduleCache(key, entry) {
    if (suspended || destroyed) return;
    const target = entry.age < FRESH_MS ? FRESH_MS : STALE_MS + 1;
    if (entry.timer !== null && entry.target === target) return;
    clearTimer(entry.timer);
    entry.target = target;
    entry.timer = setTimer(() => {
      entry.timer = null;
      // Elapsed timer time also advances age if the wall clock went backwards.
      entry.age = Math.max(entry.age, target);
      refresh();
    }, Math.max(0, target - entry.age));
  }

  function reconcile() {
    const time = clock();
    for (const card of cards.values()) {
      let descriptor;
      try {
        descriptor = adapter.describe(card.gameId, card.mode);
      } catch (error) {
        descriptor = { ...card.descriptor, availableState: 'not_connected' };
      }
      const stamp = descriptorStamp(descriptor);
      if (stamp !== card.stamp) {
        const previousKey = card.descriptor.key;
        card.generation += 1;
        detach(card);
        invalidate(previousKey);
        card.error = null;
        card.stamp = stamp;
      }
      card.descriptor = descriptor;
      if (availability(card)) invalidate(descriptor.key);
    }
    for (const [key, entry] of cache) scheduleCache(key, entry);
    return time;
  }

  function snapshot(card) {
    const descriptor = card.descriptor;
    const unavailable = availability(card);
    const entry = unavailable ? null : cache.get(descriptor.key);
    const pending = card.request !== null;
    let state = unavailable;
    if (!state) {
      state = pending ? 'loading' : card.error ? entry ? 'stale' : 'error'
        : entry ? entry.age < FRESH_MS ? entry.result.state : 'stale' : 'loading';
    }
    return Object.freeze({
      gameId: card.gameId,
      mode: descriptor.mode,
      modeLabel: descriptor.modeLabel,
      rulesVersion: descriptor.rulesVersion,
      state,
      rows: entry?.result.rows ?? Object.freeze([]),
      fetchedAt: entry?.fetchedAt ?? null,
      sourceUpdatedAt: entry?.result.sourceUpdatedAt ?? null,
      score: descriptor.score,
      errorCode: unavailable ? null : card.error,
      retryDisabled: Boolean(unavailable || pending || card.cooldownTimer !== null || destroyed || suspended),
    });
  }

  function emit(card) {
    const value = snapshot(card);
    for (const listener of card.listeners) notify(listener, value);
  }

  function notify(listener, value) {
    // A rendering failure must not become a transport failure or stop other cards.
    try { listener(value); } catch { /* Preserve the independently rendered cards. */ }
  }

  function refresh() {
    if (destroyed || suspended) return;
    reconcile();
    for (const card of cards.values()) emit(card);
  }

  function getState(gameId) {
    reconcile();
    return snapshot(cardFor(gameId));
  }

  function cooldown(card) {
    clearTimer(card.cooldownTimer);
    card.cooldownTimer = setTimer(() => {
      card.cooldownTimer = null;
      refresh();
    }, MANUAL_RETRY_MS);
  }

  function start(card, force) {
    reconcile();
    if (destroyed || suspended || availability(card)) {
      emit(card);
      return Promise.resolve(snapshot(card));
    }
    if (card.request) return card.request.promise;
    const key = card.descriptor.key;
    const entry = cache.get(key);
    if (!force && entry && entry.age < FRESH_MS && !card.error) {
      emit(card);
      return Promise.resolve(snapshot(card));
    }
    cooldown(card);
    card.error = null;
    let record = requests.get(key);
    if (!record) {
      const descriptor = card.descriptor;
      record = { key, controller: new AbortController(), owners: new Set(), invalid: false, promise: null };
      requests.set(key, record);
      record.promise = runner.run(
        signal => adapter.request(card.gameId, descriptor.mode, { signal }), record.controller.signal,
      ).then(result => {
        const time = reconcile();
        if (record.invalid || record.controller.signal.aborted) return null;
        if (result.key !== key) throw new RankingError('invalid_scope');
        if (result.state === 'stopped') {
          sourceStops.add(key);
          dropCache(key);
          return result;
        }
        if (!time.valid) throw new RankingError('invalid_clock');
        dropCache(key);
        const saved = { result, fetchedAt: time.wall, age: time.backwards ? FRESH_MS : 0, timer: null, target: null };
        cache.set(key, saved);
        scheduleCache(key, saved);
        return result;
      }).catch(error => {
        const failure = normalizeRankingError(error);
        if (!record.invalid && !record.controller.signal.aborted) {
          if (failure.invalidatesCache) {
            dropCache(key);
            for (const current of cards.values()) if (current.descriptor.key === key) current.error = failure.code;
          }
          for (const owner of record.owners) owner.error = failure.code;
        }
        return null;
      }).finally(() => {
        if (requests.get(key) === record) requests.delete(key);
      });
    }
    record.owners.add(card);
    const generation = card.generation;
    const promise = record.promise.then(() => {
      if (!destroyed && card.generation === generation && card.request?.record === record) {
        card.request = null;
        record.owners.delete(card);
        reconcile();
        emit(card);
      }
      return snapshot(card);
    });
    card.request = { record, promise };
    emit(card);
    return promise;
  }

  function load(gameId) {
    return start(cardFor(gameId), false);
  }

  function retry(gameId) {
    const card = cardFor(gameId);
    reconcile();
    if (card.request) return card.request.promise;
    if (card.cooldownTimer !== null || availability(card)) return Promise.resolve(snapshot(card));
    return start(card, true);
  }

  function select(gameId, modeId) {
    const card = cardFor(gameId);
    const descriptor = adapter.describe(gameId, modeId);
    if (card.mode !== descriptor.mode) {
      card.generation += 1;
      detach(card);
      card.mode = descriptor.mode;
      card.descriptor = descriptor;
      card.stamp = descriptorStamp(descriptor);
      card.error = null;
    }
    return start(card, false);
  }

  function setPolicy(gameId, modeId, policy) {
    const card = cardFor(gameId);
    const modes = modeId === undefined ? adapter.modesFor(gameId) : [modeId];
    if (!modes.length) modes.push(null);
    for (const mode of modes) {
      const descriptor = adapter.describe(gameId, mode);
      card.policies.set(mode, policy);
      invalidate(descriptor.key);
    }
    card.error = null;
    refresh();
    return snapshot(card);
  }

  function subscribe(gameId, listener) {
    const card = cardFor(gameId);
    card.listeners.add(listener);
    notify(listener, getState(gameId));
    return () => card.listeners.delete(listener);
  }

  // A persisted page must keep its selected modes and valid memory cache.
  // Cancel traffic while hidden, then resume only interrupted requests.
  function suspend() {
    if (destroyed || suspended) return;
    suspended = true;
    for (const card of cards.values()) {
      card.interrupted = card.request !== null;
      card.generation += 1;
      detach(card);
      clearTimer(card.cooldownTimer);
      card.cooldownTimer = null;
    }
    for (const entry of cache.values()) {
      clearTimer(entry.timer);
      entry.timer = null;
      entry.target = null;
    }
  }

  function resume() {
    if (destroyed || !suspended) return;
    suspended = false;
    refresh();
    for (const card of cards.values()) {
      const interrupted = card.interrupted;
      card.interrupted = false;
      if (interrupted) void start(card, false);
    }
  }

  function destroy() {
    destroyed = true;
    for (const card of cards.values()) {
      detach(card);
      clearTimer(card.cooldownTimer);
      card.cooldownTimer = null;
      card.listeners.clear();
    }
    for (const key of cache.keys()) dropCache(key);
    for (const record of requests.values()) cancelRequest(record);
  }

  return {
    getState, load, select, retry, refresh, subscribe, suspend, resume, destroy,
    stop: (gameId, modeId) => setPolicy(gameId, modeId, 'stopped'),
    disconnect: (gameId, modeId) => setPolicy(gameId, modeId, 'not_connected'),
  };
}
