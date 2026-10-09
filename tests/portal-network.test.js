import test from 'node:test';
import assert from 'node:assert/strict';
import {createPortalRequestPolicy, installPortalNetworkGuard} from './helpers/portal-network.js';

const base = 'http://127.0.0.1:4173/';
const revision = 'e6faebdde4938248a61070ed62683efc3ea6c387';
const request = (path, method = 'GET', resourceType = 'script', root = base) =>
  ({url: new URL(path, root).href, method, resourceType});
const assets = [
  ['src/styles.css', 'stylesheet'],
  ['src/portal.js', 'script'],
  ['src/catalog.js', 'script'],
  ['src/media.js', 'script'],
  ['src/ranking/adapter.js', 'script'],
  ['src/ranking/reader.js', 'script'],
  ['src/ranking/requests.js', 'script'],
  ['src/ranking/store.js', 'script'],
  ['src/ranking/view.js', 'script'],
];

test('static GET documents and every known module/CSS pass at root and Pages subpath', () => {
  for (const root of [base, 'https://chameleonjp-lab.github.io/zero-series/']) {
    const allowed = createPortalRequestPolicy(root);
    for (const path of ['./', 'index.html']) assert.equal(allowed(request(path, 'GET', 'document', root)), true);
    for (const [path, type] of assets) {
      assert.equal(allowed(request(path, 'GET', type, root)), true, path);
      assert.equal(allowed(request(`${path}?v=${revision}`, 'GET', type, root)), true, `${path} revision`);
    }
  }
});

const screenshotAssets = [
  {src: 'assets/screenshots/kaisen-a1b2c3d4e5f6-640.webp', sha256: '1'.repeat(64)},
  {src: 'assets/screenshots/kaisen-a1b2c3d4e5f6-960.webp', sha256: '2'.repeat(64)},
];

test('only exact manifest screenshot paths and derivative SHA queries are allowed as image GETs', () => {
  for (const root of [base, 'https://chameleonjp-lab.github.io/zero-series/']) {
    const allowed = createPortalRequestPolicy(root, {imageAssets: screenshotAssets});
    for (const asset of screenshotAssets) {
      const versioned = `${asset.src}?v=${asset.sha256}`;
      assert.equal(allowed(request(versioned, 'GET', 'image', root)), true, versioned);
      assert.equal(allowed(request(versioned, 'GET', 'script', root)), false, `${asset.src} wrong type`);
      assert.equal(allowed(request(`${asset.src}?v=${revision}`, 'GET', 'image', root)), false, `${asset.src} source revision`);
      assert.equal(allowed(request(`${asset.src}?v=${asset.sha256}&resume=1`, 'GET', 'image', root)), false, `${asset.src} extra query`);
      assert.equal(allowed(request(asset.src, 'GET', 'image', root)), false, `${asset.src} unversioned`);
      assert.equal(allowed(request(versioned, 'POST', 'image', root)), false, `${asset.src} method`);
    }
    assert.equal(allowed(request('assets/screenshots/kaisen-other.webp', 'GET', 'image', root)), false);
    assert.equal(allowed(request('assets/anything.webp', 'GET', 'image', root)), false);
  }
  assert.throws(() => createPortalRequestPolicy(base, {imageAssets: [{src: '../private.webp', sha256: '0'.repeat(64)}]}), /outside/);
  assert.throws(() => createPortalRequestPolicy(base, {imageAssets: [{src: '/assets/screenshots/kaisen.webp', sha256: '0'.repeat(64)}]}), /relative/);
  assert.throws(() => createPortalRequestPolicy(base, {imageAssets: [{src: 'assets/screenshots/kaisen.webp', sha256: 'not-a-sha'}]}), /SHA-256/);
});

const anonKey = `header.${Buffer.from(JSON.stringify({role: 'anon'})).toString('base64url')}.signature`;
const readerHeaders = {
  'content-type': 'application/json',
  accept: 'application/json',
  apikey: anonKey,
};
const readerRequest = (slug, overrides = {}) => ({
  url: 'https://mlpnjgezrnhdxsxolyzj.supabase.co/rest/v1/rpc/get_best_score_ranking',
  method: 'POST',
  resourceType: 'fetch',
  headers: readerHeaders,
  postData: JSON.stringify({p_game_slug: slug, p_limit: 5}),
  ...overrides,
});

test('only the exact known read-only ranking RPC and arguments pass', () => {
  const bindings = [
    {gameId: 'faitofuraito', gameSlug: 'faitofuraito_normal', mode: 'normal', rulesVersion: 'fixture-rules-v1', contractVersion: 'fixture-contract-v1'},
    {gameId: 'faitofuraito', gameSlug: 'faitofuraito_easy', mode: 'easy', rulesVersion: 'fixture-rules-v1', contractVersion: 'fixture-contract-v1'},
  ];
  assert.equal(createPortalRequestPolicy(base)(readerRequest('faitofuraito_normal')), false,
    'there is no production reader binding while the live rules version is unverified');
  const allowed = createPortalRequestPolicy(base, {readerBindings: bindings});
  for (const slug of ['faitofuraito_normal', 'faitofuraito_easy']) assert.equal(allowed(readerRequest(slug)), true, slug);
  const withMatchingLegacyBearer = readerRequest('faitofuraito_normal', {
    headers: {...readerHeaders, authorization: `Bearer ${anonKey}`},
  });
  assert.equal(allowed(withMatchingLegacyBearer), true);
  const publishableHeaders = {...readerHeaders, apikey: 'sb_publishable_fixture_public_key'};
  delete publishableHeaders.authorization;
  assert.equal(allowed(readerRequest('faitofuraito_normal', {headers: publishableHeaders})), true);
  assert.equal(allowed(readerRequest('faitofuraito_normal', {headers: {'content-type':'application/json',accept:'application/json'}})), true,
    'the transport may omit its optional public API key');
  const rejected = [
    readerRequest('kaisen'),
    readerRequest('faitofuraito_normal', {postData: JSON.stringify({p_game_slug: 'faitofuraito_normal', p_limit: 6})}),
    readerRequest('faitofuraito_normal', {postData: JSON.stringify({p_game_slug: 'faitofuraito_normal', p_limit: 5, p_mode: 'normal'})}),
    readerRequest('faitofuraito_normal', {postData: JSON.stringify({p_game_slug: 'faitofuraito_normal', p_limit: 5, p_rules_version: 'fixture-v1'})}),
    readerRequest('faitofuraito_normal', {url: 'https://mlpnjgezrnhdxsxolyzj.supabase.co/rest/v1/rpc/submit_score'}),
    readerRequest('faitofuraito_normal', {url: 'https://mlpnjgezrnhdxsxolyzj.supabase.co/rest/v1/rpc/get_best_score_ranking?select=*'}),
    readerRequest('faitofuraito_normal', {url: 'https://other.invalid/rest/v1/rpc/get_best_score_ranking'}),
    readerRequest('faitofuraito_normal', {resourceType: 'script'}),
    readerRequest('faitofuraito_normal', {method: 'GET'}),
    readerRequest('faitofuraito_normal', {headers: {...readerHeaders, 'content-type': 'text/plain'}}),
    readerRequest('faitofuraito_normal', {headers: {...readerHeaders, authorization: 'Bearer unrelated'}}),
    readerRequest('faitofuraito_normal', {headers: {...readerHeaders, apikey: `header.${Buffer.from(JSON.stringify({role: 'service_role'})).toString('base64url')}.signature`}}),
    readerRequest('faitofuraito_normal', {headers: {...readerHeaders, apikey: `header.${Buffer.from(JSON.stringify({role: 'authenticated'})).toString('base64url')}.signature`}}),
    readerRequest('faitofuraito_normal', {headers: {...readerHeaders, apikey: 'sb_publishable_'}}),
    readerRequest('faitofuraito_normal', {headers: {...readerHeaders, apikey: 'sb_publishable_valid', authorization: 'Bearer sb_publishable_valid'}}),
    readerRequest('faitofuraito_normal', {postData: '{not json'}),
  ];
  for (const record of rejected) assert.equal(allowed(record), false, JSON.stringify(record));
  assert.throws(() => createPortalRequestPolicy(base, {readerBindings:[
    {gameId:'faitofuraito',gameSlug:'faitofuraito_normal',mode:'easy',rulesVersion:'fixture-rules-v1',contractVersion:'fixture-contract-v1'},
  ]}), /exact verified/);
});

const forbidden = [
  request('src/ranking/submit', 'POST', 'fetch'),
  request('src/ranking/resume', 'POST', 'fetch'),
  request('src/ranking/start', 'GET', 'fetch'),
  request('src/ranking/submit', 'GET', 'script'),
  request('src/new-module.js'),
  request('api/session', 'GET', 'fetch'),
  request('resume', 'GET', 'document'),
  request('src/portal.js', 'POST', 'script'),
  request('./', 'POST', 'document'),
  request('src/portal.js', 'GET', 'fetch'),
  request('src/portal.js', 'GET', 'xhr'),
  request('src/portal.js', 'GET', 'eventsource'),
  request('src/portal.js', 'GET', 'document'),
  request('src/styles.css', 'GET', 'script'),
  request('src/portal.js?v=invalid'),
  request(`src/portal.js?v=${revision}&resume=1`),
  request('src/portal.js?submit=1'),
  request('./?resume=1', 'GET', 'document'),
  request('src/%70ortal.js'),
  request('/src/portal.js', 'GET', 'script', 'http://localhost:4173/'),
  request('https://example.invalid/src/portal.js'),
  request('ws://127.0.0.1:4173/src/portal.js', 'GET', 'websocket'),
  request('http://user:pass@127.0.0.1:4173/src/portal.js'),
  readerRequest('faitofuraito_normal'),
  {url: 'not a URL', method: 'GET', resourceType: 'script'},
  {url: new URL('unknown', base).href, method: 'GET', resourceType: undefined},
];

test('negative fixtures reject state changes, arbitrary paths, APIs and wrong origins/types/queries', () => {
  const allowed = createPortalRequestPolicy(base);
  for (const record of forbidden) assert.equal(allowed(record), false, JSON.stringify(record));
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']) {
    assert.equal(allowed(request('src/portal.js', method)), false, method);
  }
  const pagesPolicy = createPortalRequestPolicy('https://chameleonjp-lab.github.io/zero-series/');
  assert.equal(pagesPolicy(request('https://chameleonjp-lab.github.io/src/portal.js')), false);
  assert.equal(pagesPolicy(request('https://chameleonjp-lab.github.io/other/', 'GET', 'document')), false);
});

test('HTTP guard reads method and aborts forbidden fixtures before fetch; static reads cannot follow redirects', async () => {
  let httpHandler;
  const patterns = [];
  const blocked = await installPortalNetworkGuard({
    route: async (pattern, handler) => { patterns.push(pattern); httpHandler = handler; },
    routeWebSocket: async (pattern) => { patterns.push(pattern); },
  }, base);
  assert.deepEqual(patterns, ['**/*', '**/*']);
  for (const record of [request('./', 'GET', 'document'), request(`src/portal.js?v=${revision}`), ...forbidden]) {
    const calls = [];
    const response = {status: () => 200};
    await httpHandler({
      request: () => ({
        url: () => record.url,
        method: () => { calls.push('method'); return record.method; },
        resourceType: () => record.resourceType,
      }),
      continue: async () => { throw new Error('Unsafe redirect-following continuation'); },
      fetch: async options => { assert.deepEqual(options, {maxRedirects: 0}); calls.push('fetch'); return response; },
      fulfill: async options => { assert.deepEqual(options, {response}); calls.push('fulfill'); },
      abort: async reason => calls.push(`abort:${reason}`),
    });
    assert.deepEqual(calls, forbidden.includes(record) ? ['method', 'abort:blockedbyclient'] : ['method', 'fetch', 'fulfill']);
  }
  assert.deepEqual(blocked, forbidden.map(({url,method,resourceType})=>({url,method,resourceType})));
});

test('guard forwards only a candidate read call with an explicit fixture scope binding', async () => {
  let httpHandler;
  const blocked = await installPortalNetworkGuard({
    route: async (_pattern, handler) => { httpHandler = handler; },
    routeWebSocket: async () => {},
  }, base, {readerBindings:[
    {gameId:'faitofuraito',gameSlug:'faitofuraito_normal',mode:'normal',rulesVersion:'fixture-rules-v1',contractVersion:'fixture-contract-v1'},
  ]});
  const accepted=readerRequest('faitofuraito_normal');
  const calls=[];
  await httpHandler({
    request:()=>({
      url:()=>accepted.url,method:()=>accepted.method,resourceType:()=>accepted.resourceType,
      postData:()=>accepted.postData,headers:()=>accepted.headers,
    }),
    fetch:async options=>{assert.deepEqual(options,{maxRedirects:0});calls.push('fetch');return {status:()=>200};},
    fulfill:async({response})=>{assert.equal(response.status(),200);calls.push('fulfill');},
    abort:async reason=>calls.push(`abort:${reason}`),
  });
  assert.deepEqual(calls,['fetch','fulfill']);
  assert.deepEqual(blocked,[]);
});

test('redirect fixtures abort without following a Location or fulfilling the redirect', async () => {
  let httpHandler;
  const blocked = await installPortalNetworkGuard({
    route: async (_pattern, handler) => { httpHandler = handler; },
    routeWebSocket: async () => {},
  }, base);
  const record = request('src/portal.js');
  const statuses = [300, 301, 302, 303, 304, 307, 308];
  for (const status of statuses) {
    const calls = [];
    await httpHandler({
      request: () => ({url: () => record.url, method: () => record.method, resourceType: () => record.resourceType}),
      fetch: async options => {
        assert.deepEqual(options, {maxRedirects: 0});
        calls.push('fetch');
        return {status: () => status, headers: () => ({location: 'https://example.invalid/ranking/resume'})};
      },
      abort: async reason => calls.push(`abort:${reason}`),
      continue: async () => { throw new Error('Redirect would leave the guard'); },
      fulfill: async () => { throw new Error('Browser would follow the redirect'); },
    });
    assert.deepEqual(calls, ['fetch', 'abort:blockedbyclient']);
  }
  assert.deepEqual(blocked, statuses.map(status => ({...record, reason: 'redirect', status})));
});

test('WebSocket guard closes local and external fixtures without connecting to a server', async () => {
  let socketHandler;
  const blocked = await installPortalNetworkGuard({
    route: async () => {},
    routeWebSocket: async (_pattern, handler) => { socketHandler = handler; },
  }, base);
  const urls = ['ws://127.0.0.1:4173/src/ranking/resume', 'wss://example.invalid/ranking'];
  for (const url of urls) {
    const calls = [];
    await socketHandler({
      url: () => url,
      close: async options => calls.push(['close', options.code]),
      connectToServer: () => { throw new Error('Unexpected WebSocket transmission'); },
    });
    assert.deepEqual(calls, [['close', 1008]]);
  }
  assert.deepEqual(blocked, urls.map(url => ({url, method: 'WEBSOCKET', resourceType: 'websocket'})));
});
