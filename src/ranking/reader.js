import { RankingError } from './adapter.js';

export const RANKING_RPC_URL = 'https://mlpnjgezrnhdxsxolyzj.supabase.co/rest/v1/rpc/get_best_score_ranking';
export const RANKING_RPC_NAME = 'get_best_score_ranking';
export const RANKING_LIMIT = 5;

// These two slugs are candidates from the current FF manifest. A candidate is
// not a production binding: the live backend currently has no rule-version
// isolation proof, so the production table intentionally remains empty.
const CANDIDATE_SCOPES = Object.freeze([
  Object.freeze({ gameId: 'faitofuraito', mode: 'normal', gameSlug: 'faitofuraito_normal' }),
  Object.freeze({ gameId: 'faitofuraito', mode: 'easy', gameSlug: 'faitofuraito_easy' }),
]);

// Add a binding only after its backend version-isolation evidence is reviewed.
// Each entry must pin the scope, target, RPC arguments, score shape and evidence.
const PRODUCTION_BINDINGS = Object.freeze([]);

const VALID_STATUSES = new Set(['not_connected', 'stopped']);
const TRANSPORT_OVERRIDE_KEYS = ['url', 'endpoint', 'rpc', 'rpcName', 'args', 'bindings', 'approvedScopes'];

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function candidateFor(scope) {
  return CANDIDATE_SCOPES.find(candidate => candidate.mode === scope?.mode
    && candidate.gameSlug === scope?.gameSlug
    && (scope.gameId === undefined || scope.gameId === candidate.gameId)) ?? null;
}

function sameScope(binding, scope) {
  return binding.gameSlug === scope.gameSlug
    && binding.mode === scope.mode
    && binding.rulesVersion === scope.rulesVersion
    && binding.contractVersion === scope.contractVersion;
}

function sameScore(a, b) {
  return isRecord(a) && isRecord(b)
    && ['unit', 'scale', 'decimals', 'order'].every(key => a[key] === b[key]);
}

function validScore(score) {
  return isRecord(score) && typeof score.unit === 'string' && score.unit.length > 0
    && Number.isFinite(score.scale) && score.scale > 0
    && Number.isInteger(score.decimals) && score.decimals >= 0 && score.decimals <= 6
    && (score.order === 'asc' || score.order === 'desc');
}

function exactRpcArgs(args, gameSlug) {
  if (!isRecord(args)) return false;
  const keys = Object.keys(args).sort();
  return keys.length === 2 && keys[0] === 'p_game_slug' && keys[1] === 'p_limit'
    && args.p_game_slug === gameSlug && args.p_limit === RANKING_LIMIT;
}

function productionBindingFor(game, mode) {
  return PRODUCTION_BINDINGS.find(binding => binding.gameId === game?.id
    && binding.mode === mode?.id
    && binding.gameSlug === mode?.gameSlug
    && binding.rulesVersion === mode?.rulesVersion
    && binding.contractVersion === mode?.contractVersion) ?? null;
}

function bindingMatchesCatalog(game, mode, binding) {
  if (!binding || !candidateFor({ mode: mode?.id, gameSlug: mode?.gameSlug })
    || binding.endpoint !== RANKING_RPC_URL || binding.rpcName !== RANKING_RPC_NAME
    || binding.method !== 'POST' || !exactRpcArgs(binding.args, binding.gameSlug)
    || !validScore(binding.score) || !binding.evidenceRef
    || !isRecord(binding.versionIsolationEvidence) || !binding.versionIsolationEvidence.evidenceRef) return false;
  const verification = mode?.verification;
  return binding.gameId === game.id
    && verification?.valid === true
    && verification?.readOnly === true
    && verification?.scopeIsolation === true
    && verification?.aggregation === 'registered_name_best'
    && verification?.bindingId === binding.id
    && verification?.rulesVersionIsolationEvidenceRef === binding.versionIsolationEvidence.evidenceRef
    && validText(mode.rulesVersion)
    && validText(mode.contractVersion)
    && sameScore(mode.score, binding.score);
}

function validText(value) {
  return typeof value === 'string' && value.length > 0 && value.trim() === value;
}

/**
 * Returns true for an explicitly disabled catalog entry or an entry backed by
 * a fixed production binding. A catalog verification flag alone cannot open
 * the transport; a matching source binding with evidence is required.
 */
export function validateRankingConnection(game) {
  if (!isRecord(game)) return false;
  const ranking = game.ranking;
  if (ranking === undefined || ranking === null) return true;
  if (!isRecord(ranking)) return false;
  if (ranking.enabled === false && VALID_STATUSES.has(ranking.displayState)) return true;
  if (ranking.enabled !== true || ranking.displayState !== 'ready'
    || !Array.isArray(ranking.modes) || ranking.modes.length === 0) return false;
  return ranking.modes.every(mode => bindingMatchesCatalog(game, mode, productionBindingFor(game, mode)));
}

function legacyAnonRole(apiKey) {
  const pieces = apiKey.split('.');
  if (pieces.length !== 3 || typeof globalThis.atob !== 'function') return false;
  try {
    let encoded = pieces[1].replace(/-/g, '+').replace(/_/g, '/');
    encoded += '='.repeat((4 - encoded.length % 4) % 4);
    const payload = JSON.parse(globalThis.atob(encoded));
    return payload?.role === 'anon';
  } catch {
    return false;
  }
}

function publicKeyKind(apiKey) {
  if (typeof apiKey !== 'string' || apiKey.length === 0) return null;
  if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(apiKey)) return 'publishable';
  if (apiKey.startsWith('sb_secret_')) return null;
  return legacyAnonRole(apiKey) ? 'legacy-anon' : null;
}

function validateBinding(binding, { testOnly = false } = {}) {
  if (!isRecord(binding) || !candidateFor(binding)) return false;
  if (binding.gameId !== 'faitofuraito') return false;
  if (!validText(binding.rulesVersion) || !validText(binding.contractVersion)
    || binding.endpoint !== RANKING_RPC_URL || binding.rpcName !== RANKING_RPC_NAME
    || binding.method !== 'POST' || !exactRpcArgs(binding.args, binding.gameSlug)
    || !validScore(binding.score)) return false;
  if (testOnly) {
    return binding.testOnly === true && binding.evidenceRef === 'test-fixture';
  }
  return typeof binding.evidenceRef === 'string' && binding.evidenceRef.length > 0
    && isRecord(binding.versionIsolationEvidence)
    && typeof binding.versionIsolationEvidence.evidenceRef === 'string'
    && binding.versionIsolationEvidence.evidenceRef.length > 0;
}

function createHttpReader({ bindings, publicApiKey, fetchImpl, testOnly = false }) {
  const keyKind = publicKeyKind(publicApiKey);
  if (bindings.length && !keyKind) throw new TypeError('A Supabase publishable or anon key is required');
  if (bindings.length && typeof fetchImpl !== 'function') throw new TypeError('Fetch is required for a bound ranking scope');
  const fixedBindings = bindings.map(binding => Object.freeze({
    ...binding,
    args: Object.freeze({ ...binding.args }),
    score: Object.freeze({ ...binding.score }),
    ...(binding.versionIsolationEvidence
      ? { versionIsolationEvidence: Object.freeze({ ...binding.versionIsolationEvidence }) } : {}),
  }));

  return async function read(scope, { signal } = {}) {
    const candidate = candidateFor(scope);
    if (!candidate) throw new RankingError('invalid_scope');
    if (!validText(scope.rulesVersion) || !validText(scope.contractVersion)) {
      throw new RankingError('not_connected');
    }
    if (scope.limit !== RANKING_LIMIT) throw new RankingError('invalid_scope');
    const binding = fixedBindings.find(item => sameScope(item, scope));
    if (!binding) throw new RankingError('not_connected');
    if (!validateBinding(binding, { testOnly })) {
      throw new RankingError('invalid_contract');
    }
    if (signal?.aborted) throw new RankingError('aborted');

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      apikey: publicApiKey,
    };
    if (keyKind === 'legacy-anon') headers.Authorization = `Bearer ${publicApiKey}`;
    const response = await fetchImpl.call(globalThis, RANKING_RPC_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(binding.args),
      signal,
      redirect: 'error',
      credentials: 'omit',
      cache: 'no-store',
    });
    if (!response?.ok) {
      throw new RankingError('http', {
        status: Number.isInteger(response?.status) ? response.status : null,
        retryAfter: response?.headers?.get?.('Retry-After') ?? null,
      });
    }

    let payload;
    try {
      payload = await response.json();
    } catch {
      throw new RankingError('invalid_response');
    }
    if (!Array.isArray(payload) || payload.length > RANKING_LIMIT) {
      throw new RankingError('invalid_response');
    }
    const rows = payload.map(row => {
      if (!isRecord(row) || !Number.isSafeInteger(row.rank_no) || row.rank_no < 1
        || typeof row.display_name !== 'string' || !Number.isSafeInteger(row.best_score)) {
        throw new RankingError('invalid_response');
      }
      // Do not pass play counts, per-player timestamps, normalized names, or
      // other backend columns to the UI.
      return Object.freeze({ rank: row.rank_no, displayName: row.display_name, bestValue: row.best_score });
    });
    const responseScope = {
      gameSlug: binding.gameSlug,
      mode: binding.mode,
      rulesVersion: binding.rulesVersion,
      contractVersion: binding.contractVersion,
    };
    return {
      scope: responseScope,
      score: binding.score,
      state: rows.length ? 'ready' : 'empty',
      rows: Object.freeze(rows),
    };
  };
}

/** Build's production reader. Its binding table is fixed in this module. */
export function createProductionReader({ catalog, publicApiKey = null, fetchImpl = globalThis.fetch, ...options } = {}) {
  if (TRANSPORT_OVERRIDE_KEYS.some(key => Object.hasOwn(options, key))) {
    throw new TypeError('The production ranking transport cannot be overridden');
  }
  if (!Array.isArray(catalog)) throw new TypeError('A production ranking catalog is required');
  if (publicApiKey !== null && !publicKeyKind(publicApiKey)) {
    throw new TypeError('Only a Supabase publishable or anon key may be used');
  }
  for (const game of catalog) {
    const active = game?.ranking?.enabled === true || game?.ranking?.displayState === 'ready';
    if (active && !validateRankingConnection(game)) {
      throw new RankingError('invalid_contract');
    }
  }
  const activeBindings = PRODUCTION_BINDINGS.filter(binding => {
    const game = catalog.find(candidate => candidate?.id === binding.gameId);
    const mode = game?.ranking?.modes?.find(candidate => candidate?.id === binding.mode);
    return game?.ranking?.enabled === true && game?.ranking?.displayState === 'ready'
      && bindingMatchesCatalog(game, mode, binding);
  });
  return createHttpReader({ bindings: activeBindings, publicApiKey, fetchImpl });
}

/**
 * Test-only transport seam. Requires an explicitly marked fixture registry and
 * a mocked fetch, so test bindings can never be selected by production code.
 */
export function createTestOnlyRankingReader({ fixtureBindings, publicApiKey = 'sb_publishable_test_fixture', fetchImpl } = {}) {
  if (typeof fetchImpl !== 'function' || fetchImpl === globalThis.fetch) {
    throw new TypeError('A mocked fetch is required for a test-only reader');
  }
  if (!Array.isArray(fixtureBindings) || !fixtureBindings.length
    || fixtureBindings.some(binding => !validateBinding(binding, { testOnly: true }))) {
    throw new TypeError('A validated test-only binding fixture is required');
  }
  return createHttpReader({ bindings: fixtureBindings, publicApiKey, fetchImpl, testOnly: true });
}
