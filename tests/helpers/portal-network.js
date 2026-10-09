// A11: the portal may load only known static files, manifest-listed screenshots,
// and the one explicitly read-only RPC contract below. Keep this list explicit.
const staticAssets = new Map([
  ['src/styles.css', 'stylesheet'],
  ['src/portal.js', 'script'],
  ['src/catalog.js', 'script'],
  ['src/media.js', 'script'],
  ['src/ranking/adapter.js', 'script'],
  ['src/ranking/reader.js', 'script'],
  ['src/ranking/requests.js', 'script'],
  ['src/ranking/store.js', 'script'],
  ['src/ranking/view.js', 'script'],
]);

const rankingEndpoint = new URL('https://mlpnjgezrnhdxsxolyzj.supabase.co/rest/v1/rpc/get_best_score_ranking');
const rankingSlugs = new Set(['faitofuraito_normal', 'faitofuraito_easy']);

function normalizedHeaders(input) {
  if (!input || typeof input !== 'object') return null;
  return Object.fromEntries(Object.entries(input).map(([name, value]) => [name.toLowerCase(), String(value)]));
}

function hasPublicAnonKey(headers) {
  const apiKey = headers.apikey;
  const authorization = headers.authorization;
  if (apiKey === undefined) return authorization === undefined;
  if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(apiKey)) return authorization === undefined;
  const pieces = apiKey.split('.');
  if (pieces.length !== 3) return false;
  try {
    const payload = JSON.parse(Buffer.from(pieces[1], 'base64url').toString('utf8'));
    return payload.role === 'anon' && (authorization === undefined || authorization === `Bearer ${apiKey}`);
  } catch {
    return false;
  }
}

function isRankingReadCall(url, {method, resourceType, postData, headers}, readerSlugs) {
  if (method !== 'POST' || resourceType !== 'fetch'
    || url.origin !== rankingEndpoint.origin || url.pathname !== rankingEndpoint.pathname
    || url.search || url.hash || url.username || url.password) return false;
  const requestHeaders = normalizedHeaders(headers);
  if (!requestHeaders || !/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(requestHeaders['content-type'] || '')
    || !/^application\/json(?:\s*[,;]|$)/i.test(requestHeaders.accept || '')
    || !hasPublicAnonKey(requestHeaders)) return false;
  let body;
  try { body = JSON.parse(postData); } catch { return false; }
  if (!body || Array.isArray(body) || typeof body !== 'object') return false;
  const keys = Object.keys(body).sort();
  return keys.length === 2 && keys[0] === 'p_game_slug' && keys[1] === 'p_limit'
    && readerSlugs.has(body.p_game_slug) && body.p_limit === 5;
}

export function createPortalRequestPolicy(baseURL, {imageAssets = [], readerBindings = []} = {}) {
  const base = new URL('./', baseURL);
  if (!['http:', 'https:'].includes(base.protocol)) throw new Error('HTTP(S) portal base required');
  const documents = new Set([base.pathname, new URL('index.html', base).pathname]);
  const assets = new Map([...staticAssets].map(([path, type]) => [new URL(path, base).pathname, type]));
  const images = new Map(imageAssets.map(asset => {
    const path = asset?.src;
    const sha256 = asset?.sha256;
    if (typeof path !== 'string' || path.startsWith('/') || path.includes('\\') || path.includes('?') || path.includes('#')) {
      throw new TypeError('Screenshot paths must be exact relative manifest paths');
    }
    if (typeof sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(sha256)) throw new TypeError('Screenshot SHA-256 is required');
    const resolved = new URL(path, base);
    if (resolved.origin !== base.origin || !resolved.pathname.startsWith(`${base.pathname}assets/screenshots/`)
      || !/^assets\/screenshots\/[a-z0-9-]+\.webp$/.test(resolved.pathname.slice(base.pathname.length))) {
      throw new TypeError('Screenshot path is outside the approved manifest directory');
    }
    return [resolved.pathname, sha256];
  }));
  const readerSlugs = new Set(readerBindings.map(binding => {
    if (!binding || binding.gameId !== 'faitofuraito' || !rankingSlugs.has(binding.gameSlug) || !['normal', 'easy'].includes(binding.mode)
      || typeof binding.rulesVersion !== 'string' || !binding.rulesVersion.trim()
      || typeof binding.contractVersion !== 'string' || !binding.contractVersion.trim()
      || binding.gameSlug !== `faitofuraito_${binding.mode}`) {
      throw new TypeError('Reader bindings require an exact verified gameSlug/mode/rulesVersion mapping');
    }
    return binding.gameSlug;
  }));
  return record => {
    let url;
    try { url = new URL(record?.url); } catch { return false; }
    if (url.username || url.password || url.hash) return false;
    if (isRankingReadCall(url, record || {}, readerSlugs)) return true;
    if (url.origin !== base.origin) return false;
    if (record?.method !== 'GET') return false;
    if (record.resourceType === 'document') return documents.has(url.pathname) && !url.search;
    if (record.resourceType === 'image') return images.get(url.pathname) === url.searchParams.get('v')
      && url.search === `?v=${images.get(url.pathname)}`;
    return assets.has(url.pathname) && assets.get(url.pathname) === record.resourceType &&
      (url.search === '' || /^\?v=[0-9a-f]{40}$/.test(url.search));
  };
}

export async function installPortalNetworkGuard(context, baseURL, {
  imageAssets = [],
  readerBindings = [],
  fixtureResponses = new Map(),
  onRequest = () => {},
} = {}) {
  const isAllowed = createPortalRequestPolicy(baseURL, {imageAssets, readerBindings});
  const base = new URL('./', baseURL);
  const blocked = [];
  await context.route('**/*', async route => {
    const request = route.request();
    const record = {
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
    };
    if (record.method === 'POST') {
      record.postData = request.postData?.() ?? null;
      record.headers = request.headers?.() ?? null;
    }
    onRequest({...record, postData: undefined, headers: undefined});
    if (!isAllowed(record)) {
      blocked.push({url: record.url, method: record.method, resourceType: record.resourceType});
      return route.abort('blockedbyclient');
    }
    const url = new URL(record.url);
    const fixture = url.origin === base.origin ? fixtureResponses.get(url.href) : undefined;
    if (fixture) return route.fulfill(fixture);
    // fetch() does not follow redirects; a redirect is rejected below.
    const response = await route.fetch({maxRedirects: 0});
    if (response.status() >= 300 && response.status() < 400) {
      blocked.push({url: record.url, method: record.method, resourceType: record.resourceType,
        reason: 'redirect', status: response.status()});
      return route.abort('blockedbyclient');
    }
    return route.fulfill({response});
  });
  await context.routeWebSocket('**/*', async socket => {
    blocked.push({url: socket.url(), method: 'WEBSOCKET', resourceType: 'websocket'});
    // Do not call connectToServer: the handshake and frames must never leave the test.
    await socket.close({code: 1008, reason: 'Portal static-only acceptance guard'});
  });
  return blocked;
}
