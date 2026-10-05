export const RANKING_LIMIT = 5;
const ERROR_CODES = new Set(['network', 'timeout', 'http', 'aborted', 'invalid_scope', 'invalid_response',
  'invalid_contract', 'invalid_clock', 'not_connected', 'stopped']);

// No transport is installed by default. A future approved read contract must
// provide a reader; this module never discovers endpoints or writes scores.
export class RankingError extends Error {
  constructor(code, { status = null, retryAfter = null } = {}) {
    code = ERROR_CODES.has(code) ? code : 'network';
    super(code);
    this.name = 'RankingError';
    this.code = code;
    this.status = status;
    this.retryAfter = retryAfter;
    this.transient = code === 'network' || code === 'timeout'
      || (code === 'http' && (status === 408 || status === 429 || status >= 500 && status <= 599));
    this.invalidatesCache = ['invalid_scope', 'invalid_response', 'invalid_contract'].includes(code)
      || code === 'http' && [400, 401, 403, 404, 410].includes(status);
  }
}

export function normalizeRankingError(error) {
  if (error instanceof RankingError) return error;
  if (error?.name === 'AbortError') return new RankingError('aborted');
  if (error instanceof SyntaxError) return new RankingError('invalid_response');
  if (Number.isInteger(error?.status)) {
    return new RankingError('http', { status: error.status, retryAfter: error.retryAfter });
  }
  // Do not retain response bodies, player identifiers, or transport messages.
  return new RankingError('network');
}

export function scopeKey(scope) {
  return JSON.stringify([scope.gameSlug, scope.mode, scope.rulesVersion, scope.contractVersion]);
}

const validText = value => typeof value === 'string' && value.length > 0 && value.length <= 128;
const validScore = score => score && validText(score.unit) && Number.isFinite(score.scale) && score.scale > 0
  && Number.isInteger(score.decimals) && score.decimals >= 0 && score.decimals <= 6
  && ['asc', 'desc'].includes(score.order);
const sameScore = (a, b) => validScore(a) && ['unit', 'scale', 'decimals', 'order'].every(key => a[key] === b[key]);

/** Normalize only the public ranking fields; never pass raw records to the UI. */
export function createRankingAdapter({ catalog, read } = {}) {
  if (!Array.isArray(catalog)) throw new TypeError('A catalog allowlist is required');
  if (catalog.some(game => !game || !validText(game.id))) throw new TypeError('Invalid catalog ID');
  const games = new Map(catalog.map(game => [game.id, game]));
  if (games.size !== catalog.length) throw new TypeError('Duplicate catalog ID');
  for (const game of catalog) {
    const modes = game.ranking?.modes ?? [];
    if (!Array.isArray(modes) || modes.some(mode => !mode || !validText(mode.id))
      || new Set(modes.map(mode => mode.id)).size !== modes.length) throw new TypeError('Invalid catalog modes');
  }

  function describe(gameId, modeId) {
    const game = games.get(gameId);
    if (!game) throw new RankingError('invalid_scope');
    const ranking = game.ranking ?? {};
    const modes = Array.isArray(ranking.modes) ? ranking.modes : [];
    const selected = modeId === undefined ? ranking.defaultMode ?? modes[0]?.id ?? null : modeId;
    const mode = modes.find(item => item.id === selected);
    if (selected !== null && !mode) throw new RankingError('invalid_scope');
    const scope = mode && {
      gameSlug: mode.gameSlug,
      mode: mode.id,
      rulesVersion: mode.rulesVersion,
      contractVersion: mode.contractVersion,
    };
    const verification = mode?.verification;
    const verified = scope && Object.values(scope).every(validText) && validScore(mode.score)
      && verification?.valid === true && verification.readOnly === true
      && verification.scopeIsolation === true && verification.aggregation === 'registered_name_best';
    const availableState = ranking.displayState === 'stopped' ? 'stopped'
      : ranking.enabled !== true || !verified || typeof read !== 'function' ? 'not_connected' : null;
    return {
      gameId,
      mode: mode?.id ?? null,
      modeLabel: mode?.label ?? null,
      rulesVersion: mode?.rulesVersion ?? null,
      score: mode && validScore(mode.score) ? {
        unit: mode.score.unit, scale: mode.score.scale, decimals: mode.score.decimals, order: mode.score.order,
      } : null,
      scope,
      key: scope ? scopeKey(scope) : null,
      availableState,
      sourceStopVerified: verification?.stopSignal === true,
    };
  }

  async function request(gameId, modeId, { signal } = {}) {
    const descriptor = describe(gameId, modeId);
    if (descriptor.availableState) throw new RankingError(descriptor.availableState);
    if (signal?.aborted) throw new RankingError('aborted');
    let response;
    try {
      response = await read({ ...descriptor.scope, limit: RANKING_LIMIT }, { signal });
    } catch (error) {
      throw normalizeRankingError(error);
    }
    if (signal?.aborted) throw new RankingError('aborted');
    const current = describe(gameId, modeId);
    if (current.key !== descriptor.key || current.availableState || !sameScore(current.score, descriptor.score)) {
      throw new RankingError('invalid_contract');
    }
    if (!response || !response.scope || scopeKey(response.scope) !== descriptor.key) {
      throw new RankingError('invalid_scope');
    }
    if (response.state === 'stopped') {
      if (!descriptor.sourceStopVerified) throw new RankingError('invalid_contract');
      return { ...descriptor, state: 'stopped', rows: [], sourceUpdatedAt: null };
    }
    if (!sameScore(response.score, descriptor.score) || !Array.isArray(response.rows)
      || response.rows.length > RANKING_LIMIT
      || response.state !== undefined && !['ready', 'empty'].includes(response.state)
      || response.state === 'ready' && response.rows.length === 0
      || response.state === 'empty' && response.rows.length !== 0) {
      throw new RankingError('invalid_response');
    }
    const seen = new Set();
    let previousRank = 0;
    const rows = response.rows.map(row => {
      if (!row || !Number.isSafeInteger(row.rank) || row.rank < 1
        || row.rank < previousRank
        || typeof row.displayName !== 'string' || row.displayName.length === 0 || row.displayName.length > 160
        || [...row.displayName].length > 80 || !row.displayName.trim()
        || /[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(row.displayName)
        || !Number.isFinite(row.bestValue) || !Number.isFinite(row.bestValue / descriptor.score.scale)) {
        throw new RankingError('invalid_response');
      }
      const publicRow = { rank: row.rank, displayName: row.displayName, bestValue: row.bestValue };
      const identity = JSON.stringify(publicRow);
      if (seen.has(identity)) throw new RankingError('invalid_response');
      seen.add(identity);
      previousRank = row.rank;
      return Object.freeze(publicRow);
    });
    // Names and ties remain in the returned order. Display names are not IDs.
    let sourceUpdatedAt = null;
    if (response.sourceUpdatedAt !== undefined && response.sourceUpdatedAt !== null) {
      if (typeof response.sourceUpdatedAt !== 'string' || !Number.isFinite(Date.parse(response.sourceUpdatedAt))) {
        throw new RankingError('invalid_response');
      }
      sourceUpdatedAt = response.sourceUpdatedAt;
    }
    return { ...descriptor, state: rows.length ? 'ready' : 'empty', rows: Object.freeze(rows), sourceUpdatedAt };
  }

  function modesFor(gameId) {
    if (!games.has(gameId)) throw new RankingError('invalid_scope');
    return (games.get(gameId).ranking?.modes ?? []).map(mode => mode.id);
  }

  return { describe, request, modesFor, gameIds: [...games.keys()] };
}
