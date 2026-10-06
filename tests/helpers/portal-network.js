// A11: this disconnected portal may load only its known static documents/assets.
// Keep this list explicit: a new file or endpoint under src/ is not permission.
const staticAssets = new Map([
  ['src/styles.css', 'stylesheet'],
  ['src/portal.js', 'script'],
  ['src/catalog.js', 'script'],
  ['src/ranking/adapter.js', 'script'],
  ['src/ranking/requests.js', 'script'],
  ['src/ranking/store.js', 'script'],
  ['src/ranking/view.js', 'script'],
]);

export function createPortalRequestPolicy(baseURL) {
  const base = new URL('./', baseURL);
  if (!['http:', 'https:'].includes(base.protocol)) throw new Error('HTTP(S) portal base required');
  const documents = new Set([base.pathname, new URL('index.html', base).pathname]);
  const assets = new Map([...staticAssets].map(([path, type]) => [new URL(path, base).pathname, type]));
  return ({url: value, method, resourceType}) => {
    let url;
    try { url = new URL(value); } catch { return false; }
    if (method !== 'GET' || url.origin !== base.origin || url.username || url.password) return false;
    if (resourceType === 'document') return documents.has(url.pathname) && !url.search;
    // The build pins module/CSS imports to a full Git SHA; fixture imports are unversioned.
    return assets.has(url.pathname) && assets.get(url.pathname) === resourceType &&
      (url.search === '' || /^\?v=[0-9a-f]{40}$/.test(url.search));
  };
}

export async function installPortalNetworkGuard(context, baseURL) {
  const isAllowed = createPortalRequestPolicy(baseURL);
  const blocked = [];
  await context.route('**/*', async route => {
    const request = route.request();
    const record = {url: request.url(), method: request.method(), resourceType: request.resourceType()};
    if (!isAllowed(record)) {
      blocked.push(record);
      return route.abort('blockedbyclient');
    }
    // continue() can follow a redirect without re-entering the route handler.
    // Fetch only the approved URL, then fulfill it without following any redirect.
    const response = await route.fetch({maxRedirects: 0});
    if (response.status() >= 300 && response.status() < 400) {
      blocked.push({...record, reason: 'redirect', status: response.status()});
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
