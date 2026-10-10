import {readFileSync} from 'node:fs';
import {test as baseTest,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {installPortalNetworkGuard} from '../helpers/portal-network.js';

const imageManifest=JSON.parse(readFileSync(new URL('../../docs/evidence/images-current.json',import.meta.url),'utf8'));
const imageItems=imageManifest.items;
const imageVariants=item=>item?.srcset??item?.outputs??[];
if(!Array.isArray(imageItems)||!imageItems.some(item=>imageVariants(item).length))throw new Error('Screenshot evidence manifest has no approved image outputs');
const imageAssets=imageItems.flatMap(item=>imageVariants(item).map(output=>({src:output.src,sha256:output.sha256})));
const portalBase=()=>new URL('./',process.env.BASE_URL||'http://127.0.0.1:4173/').href;
const imageURL=(output)=>new URL(`${output.src}?v=${output.sha256}`,portalBase()).href;

const test=baseTest.extend({
  portalNetworkOptions:[{imageAssets,fixtureResponses:new Map()},{option:true}],
  portalNetworkAudit:[async({context,portalNetworkOptions},use)=>{
    const requests=[];
    const blocked=await installPortalNetworkGuard(context,portalBase(),{...portalNetworkOptions,onRequest:record=>requests.push(record)});
    await use({requests,blocked});
    expect(blocked).toEqual([]);
  },{auto:true}],
});

// Service-worker traffic must not bypass the A11 request interception.
test.use({serviceWorkers:'block'});

test('8 static cards, unavailable states and local-only ranking',async({page,context,portalNetworkAudit})=>{
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('./');
  await expect(page).toHaveTitle('ゼロ シリーズ');
  await expect(page.locator('h1')).toHaveText('ゼロ シリーズ');
  await expect(page.locator('article.card')).toHaveCount(8);
  await expect(page.locator('#uchiotose a.action')).toHaveAttribute('href','https://chameleonjp-lab.github.io/uchiotose/');
  await expect(page.locator('#machimamore .release')).toHaveText('公開中');
  await expect(page.locator('#machimamore .description')).toHaveText('街20区画を守り、味方戦闘機と50機の敵UFOを迎撃する都市防衛ゲーム。イージーとノーマルで挑戦できます。');
  await expect(page.locator('#machimamore a.action')).toHaveText('マチマモレを遊ぶ');
  await expect(page.locator('#machimamore a.action')).toHaveAttribute('href','https://chameleonjp-lab.github.io/machimamore/');
  await expect(page.locator('#machimamore .unavailable')).toHaveCount(0);
  await expect(page.locator('#machimamore [data-ranking-status]')).toHaveText('ランキング未接続');
  await expect(page.locator('#gekichin .release')).toHaveText('公開中');
  await expect(page.locator('#gekichin .description')).toHaveText('超大型母艦の100基の砲台を、僚機と破壊するタイム・スコアアタック。イージーとノーマルで挑戦できます。');
  await expect(page.locator('#gekichin a.action')).toHaveText('ゲキチンを遊ぶ');
  await expect(page.locator('#gekichin a.action')).toHaveAttribute('href','https://chameleonjp-lab.github.io/gekichin/');
  await expect(page.locator('#gekichin .unavailable')).toHaveCount(0);
  await expect(page.locator('#gekichin [data-ranking-status]')).toHaveText('ランキング未接続');
  await expect(page.locator('#senryou a.action')).toHaveAttribute('href','https://chameleonjp-lab.github.io/senryou/');
  await expect(page.locator('#fantasia a.action')).toHaveAttribute('href','https://chameleonjp-lab.github.io/fantasia/');
  await expect(page.locator('#nusumidase a.action')).toHaveCount(0);
  await expect(page.locator('a.action')).toHaveCount(7);
  await expect(page.locator('[data-ranking-status]')).toHaveText(Array(8).fill('ランキング未接続'));
  await page.locator('[data-mode]').selectOption('easy');
  await expect(page.locator('#faitofuraito [data-scope]')).toContainText('イージー');
  await expect(page.locator('#faitofuraito [data-ranking-status]')).toHaveText('ランキング未接続');
  await expect(page.locator('iframe,audio,canvas')).toHaveCount(0);
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
  expect(errors).toEqual([]);
  expect(portalNetworkAudit.requests.some(request=>request.method==='POST'||/\/rest\/v1\/rpc\//.test(request.url))).toBe(false);
});

const screenshotItem=imageItems.find(item=>item.id==='kaisen'&&imageVariants(item).length>0)||imageItems.find(item=>imageVariants(item).length>0);
const imageFailureOptions=(status,body)=>({
  imageAssets,
  fixtureResponses:new Map(imageVariants(screenshotItem).map(output=>[imageURL(output),{status,contentType:'image/webp',body}])),
});

test('approved screenshots load, keep the reserved 16:9 figure, and handle cached completion',async({page,portalNetworkAudit})=>{
  const item=screenshotItem;
  await page.goto('./');
  const figure=page.locator(`#${item.id} figure.thumbnail`);
  const image=figure.locator('picture > img[data-thumbnail]');
  const fallback=figure.locator('span[data-image-fallback]');
  await expect(image).toBeVisible();
  await expect.poll(()=>image.evaluate(element=>element.complete&&element.naturalWidth>0)).toBe(true);
  await expect(fallback).toBeHidden();
  await expect(figure.locator('figcaption.image-caption')).toHaveText(item.caption);
  const details=await image.evaluate(element=>({
    alt:element.alt,
    srcset:element.getAttribute('srcset'),
    currentSrc:element.currentSrc,
    loading:element.loading,
    decoding:element.decoding,
    width:element.getBoundingClientRect().width,
    height:element.getBoundingClientRect().height,
  }));
  expect(details.alt).toBe(item.alt);
  expect(details.srcset).toBeTruthy();
  for(const output of imageVariants(item))expect(details.srcset).toContain(`${output.src}?v=${output.sha256}`);
  expect(imageVariants(item).map(imageURL)).toContain(details.currentSrc);
  expect(details.loading).toBe(item.id==='kaisen'?'eager':'lazy');
  expect(details.decoding).toBe('async');
  expect(Math.abs(details.width/details.height-16/9)).toBeLessThan(.02);

  // Re-run the enhancer after the real image has completed, exercising the
  // complete-image path used when a browser cache wins before listeners attach.
  await page.evaluate(async id=>{
    const {enhanceImages}=await import(new URL('./src/media.js',location.href).href);
    const figure=document.querySelector(`#${id} figure.thumbnail`);
    const image=figure.querySelector('img[data-thumbnail]');
    if(!image.complete||!image.naturalWidth)throw new Error('Expected the approved image to be complete before listener attachment');
    enhanceImages(figure);
    await image.decode();
  },item.id);
  await expect(page.locator(`#${item.id} figure.thumbnail`)).toHaveAttribute('data-image-state','ready');
  const cachedImage=page.locator(`#${item.id} img[data-thumbnail]`);
  await expect.poll(()=>cachedImage.evaluate(element=>element.complete&&element.naturalWidth>0)).toBe(true);
  await expect(page.locator(`#${item.id} [data-image-fallback]`)).toBeHidden();
  expect(portalNetworkAudit.blocked).toEqual([]);
});

test.describe('thumbnail 404 handling',()=>{
  test.use({portalNetworkOptions:imageFailureOptions(404,'')});
  test('shows an honest unavailable message without losing the image frame',async({page,portalNetworkAudit})=>{
    await page.goto('./');
    const figure=page.locator(`#${screenshotItem.id} figure.thumbnail`);
    const image=figure.locator('img[data-thumbnail]');
    const fallback=figure.locator('span[data-image-fallback]');
    await expect.poll(()=>image.evaluate(element=>element.complete&&element.naturalWidth===0)).toBe(true);
    await expect(fallback).toBeVisible();
    await expect(fallback).toHaveText('画像を読み込めません');
    const box=await fallback.boundingBox();
    expect(Math.abs(box.width/box.height-16/9)).toBeLessThan(.02);
    expect(portalNetworkAudit.blocked).toEqual([]);
  });
});

test.describe('thumbnail decode failure handling',()=>{
  test.use({portalNetworkOptions:imageFailureOptions(200,'not a valid WebP image')});
  test('falls back when an approved image URL returns undecodable bytes',async({page,portalNetworkAudit})=>{
    await page.goto('./');
    const image=page.locator(`#${screenshotItem.id} img[data-thumbnail]`);
    const fallback=page.locator(`#${screenshotItem.id} span[data-image-fallback]`);
    await expect.poll(()=>image.evaluate(element=>element.complete&&element.naturalWidth===0)).toBe(true);
    await expect(fallback).toBeVisible();
    await expect(fallback).toHaveText('画像を読み込めません');
    expect(portalNetworkAudit.blocked).toEqual([]);
  });
});

for(const width of [320,375,390,430,768,1280,1440])test(`layout ${width}px, zoom and long text`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('./');
  await page.evaluate(()=>{document.querySelector('h2').textContent+='長い作品名'.repeat(15);document.querySelector('.description').textContent+='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(10);document.documentElement.style.fontSize='200%';});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const element of await page.locator('a.action,select').all()){const box=await element.boundingBox();expect(box.height).toBeGreaterThanOrEqual(44);}
});

test('touch landscape keeps one column',async({browser})=>{
  const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true,serviceWorkers:'block'});const page=await context.newPage();const blocked=await installPortalNetworkGuard(context,portalBase(),{imageAssets});await page.goto(portalBase());
  const grid=await page.locator('.catalog').evaluate(e=>getComputedStyle(e).gridTemplateColumns);expect(grid.split(' ').length).toBe(1);expect(blocked).toEqual([]);await context.close();
});

test('static content survives disabled JS and keyboard navigation',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,serviceWorkers:'block'});const page=await context.newPage();const blocked=await installPortalNetworkGuard(context,portalBase(),{imageAssets});await page.goto(portalBase());
  await expect(page.locator('#machimamore a.action')).toHaveAttribute('href','https://chameleonjp-lab.github.io/machimamore/');
  await expect(page.locator('#machimamore .release')).toHaveText('公開中');
  await expect(page.locator('#gekichin a.action')).toHaveAttribute('href','https://chameleonjp-lab.github.io/gekichin/');
  await expect(page.locator('#gekichin .release')).toHaveText('公開中');
  await expect(page.locator('article')).toHaveCount(8);await expect(page.locator('noscript')).toBeVisible();await page.keyboard.press('Tab');await expect(page.locator('.skip')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#games')).toBeFocused();expect(blocked).toEqual([]);await context.close();
});

test('ranking fixture renders ties as text and distinguishes stopped and empty',async({page})=>{
  await page.goto('./');
  await page.evaluate(async()=>{
    const {renderRanking}=await import(new URL('./src/ranking/view.js',location.href).href);
    const card=document.querySelector('#faitofuraito');
    const state={state:'ready',mode:'normal',modeLabel:'ノーマル',rulesVersion:'fixture-v1',fetchedAt:Date.now(),retryDisabled:false,score:{unit:'点',scale:1,decimals:0},rows:[{rank:1,displayName:'<img src=x onerror="window.fixtureXss=true">',bestValue:100},{rank:1,displayName:'架空登録名乙',bestValue:100},{rank:3,displayName:'架空登録名丙',bestValue:90}]};
    renderRanking(card,{title:'ファイトフライト'},state);
  });
  await expect(page.locator('#faitofuraito tbody tr')).toHaveCount(3);
  await expect(page.locator('#faitofuraito tbody td:first-child')).toHaveText(['1','1','3']);
  await expect(page.locator('#faitofuraito tbody img')).toHaveCount(0);
  expect(await page.evaluate(()=>window.fixtureXss)).toBeUndefined();
  await page.evaluate(async()=>{const {renderRanking}=await import(new URL('./src/ranking/view.js',location.href).href);renderRanking(document.querySelector('#faitofuraito'),{title:'ファイトフライト'},{state:'stopped',mode:'normal',modeLabel:'ノーマル',rulesVersion:'fixture-v1',rows:[],fetchedAt:null,retryDisabled:false});});
  await expect(page.locator('#faitofuraito [data-ranking-status]')).toHaveText('ランキング表示停止中');
  await expect(page.locator('#faitofuraito table')).toHaveCount(0);
  await page.evaluate(async()=>{const {renderRanking}=await import(new URL('./src/ranking/view.js',location.href).href);renderRanking(document.querySelector('#faitofuraito'),{title:'ファイトフライト'},{state:'empty',mode:'easy',modeLabel:'イージー',rulesVersion:'fixture-v1',rows:[],fetchedAt:Date.now(),retryDisabled:false});});
  await expect(page.locator('#faitofuraito [data-ranking-status]')).toHaveText('まだランキング登録がありません');
  await expect(page.locator('#kaisen [data-ranking-status]')).toHaveText('ランキング未接続');
  await page.evaluate(async()=>{const {renderRanking}=await import(new URL('./src/ranking/view.js',location.href).href);renderRanking(document.querySelector('#faitofuraito'),{title:'ファイトフライト'},{state:'stale',mode:'easy',modeLabel:'イージー',rulesVersion:'fixture-v1',rows:[],fetchedAt:Date.now(),retryDisabled:false,errorCode:'network'});});
  await expect(page.locator('#faitofuraito [data-ranking-status]')).toContainText('更新に失敗しました');
  await expect(page.locator('#faitofuraito [data-retry]')).toBeVisible();
});

test('injected ranking fixture covers 0/1/4/5/6 rows and long names and scores at 200%',async({page})=>{
  await page.setViewportSize({width:320,height:900});
  await page.goto('./');
  const result=await page.evaluate(async()=>{
    const [{createRankingAdapter},{renderRanking}]=await Promise.all([
      import(new URL('./src/ranking/adapter.js',location.href).href),
      import(new URL('./src/ranking/view.js',location.href).href),
    ]);
    const score={unit:'点',scale:1,decimals:0,order:'desc'};
    const fixtureGame={id:'browser_fixture',title:'テスト専用の架空作品',ranking:{
      enabled:true,displayState:'ready',defaultMode:'normal',modes:[{
        id:'normal',label:'テスト用ノーマル',gameSlug:'browser_fixture_normal',
        rulesVersion:'fixture-rules-v1',contractVersion:'fixture-contract-v1',score,
        verification:{valid:true,readOnly:true,scopeIsolation:true,aggregation:'registered_name_best'},
      }],
    }};
    let activeRows=[];
    const adapter=createRankingAdapter({catalog:[fixtureGame],read:async request=>{
      const {limit,...scope}=request;
      return {scope,score,rows:activeRows};
    }});
    const card=document.querySelector('#faitofuraito');
    const makeRows=count=>Array.from({length:count},(_,index)=>({
      rank:[1,1,3,4,5,5][index],
      displayName:index===4?'長い連続登録名ABC123'.repeat(5):`架空のテスト登録名${index+1}`,
      bestValue:index===4?Number.MAX_VALUE:100-index,
    }));
    const observations=[];
    for(const count of [0,1,4,5]){
      activeRows=makeRows(count);
      const state=await adapter.request('browser_fixture','normal');
      renderRanking(card,fixtureGame,{...state,fetchedAt:Date.now(),retryDisabled:false});
      observations.push({input:count,state:state.state,rowCount:card.querySelectorAll('tbody tr').length,
        ranks:[...card.querySelectorAll('tbody tr td:first-child')].map(cell=>cell.textContent)});
    }
    document.documentElement.style.fontSize='200%';
    const fiveRows=[...card.querySelectorAll('tbody tr')].map(row=>[...row.cells].map(cell=>cell.textContent));
    const overflow=document.documentElement.scrollWidth>innerWidth;
    activeRows=makeRows(6);
    let sixthCode=null;
    try{await adapter.request('browser_fixture','normal');}catch(error){sixthCode=error.code;}
    renderRanking(card,fixtureGame,{state:'error',mode:'normal',modeLabel:'テスト用ノーマル',rulesVersion:'fixture-rules-v1',rows:[],fetchedAt:null,retryDisabled:false});
    return {observations,fiveRows,overflow,sixthCode,finalRows:card.querySelectorAll('tbody tr').length,
      finalStatus:card.querySelector('[data-ranking-status]').textContent};
  });
  expect(result.observations.map(item=>[item.input,item.state,item.rowCount])).toEqual([
    [0,'empty',0],[1,'ready',1],[4,'ready',4],[5,'ready',5],
  ]);
  expect(result.observations.at(-1).ranks).toEqual(['1','1','3','4','5']);
  expect(result.fiveRows.at(-1)[1]).toBe('長い連続登録名ABC123'.repeat(5));
  expect(result.fiveRows.at(-1)[2].length).toBeGreaterThan(300);
  expect(result.overflow).toBe(false);
  expect(result.sixthCode).toBe('invalid_response');
  expect(result.finalRows).toBe(0);
  expect(result.finalStatus).toBe('ランキングを取得できません');
});

test('fixture mode and rules scopes reject a late old response and discard version changes',async({page})=>{
  await page.goto('./');
  const result=await page.evaluate(async()=>{
    const [{createRankingAdapter},{createRankingStore},{renderRanking}]=await Promise.all([
      import(new URL('./src/ranking/adapter.js',location.href).href),
      import(new URL('./src/ranking/store.js',location.href).href),
      import(new URL('./src/ranking/view.js',location.href).href),
    ]);
    const score={unit:'点',scale:1,decimals:0,order:'desc'};
    const makeMode=(id,slug,version)=>({id,label:id==='normal'?'fixture normal':'fixture easy',gameSlug:slug,
      rulesVersion:version,contractVersion:'fixture-contract-v1',score,
      verification:{valid:true,readOnly:true,scopeIsolation:true,aggregation:'registered_name_best'}});
    const fixtureGame={id:'browser_fixture',title:'テスト専用の架空作品',ranking:{
      enabled:true,displayState:'ready',defaultMode:'normal',modes:[
        makeMode('normal','browser_fixture_normal','fixture-rules-normal-v1'),
        makeMode('easy','browser_fixture_easy','fixture-rules-easy-v1'),
      ],
    }};
    let resolveNormal;
    let normalScope=null;
    const normalResponse=new Promise(resolve=>{resolveNormal=resolve;});
    const reader=async request=>{
      const {limit,...scope}=request;
      if(request.mode==='normal'){
        normalScope=scope;
        return normalResponse;
      }
      return {scope,score,rows:[{rank:1,displayName:`${request.mode}:${request.rulesVersion}`,bestValue:55}]};
    };
    const adapter=createRankingAdapter({catalog:[fixtureGame],read:reader});
    const store=createRankingStore({adapter});
    const card=document.querySelector('#faitofuraito');
    store.subscribe('browser_fixture',state=>renderRanking(card,fixtureGame,state));
    const normalPending=store.load('browser_fixture');
    for(let index=0;index<30&&!normalScope;index++)await Promise.resolve();
    const easyPending=store.select('browser_fixture','easy');
    await easyPending;
    const firstEasy=store.getState('browser_fixture');
    resolveNormal({scope:normalScope,score,rows:[{rank:1,displayName:'late normal v1 must not replace easy',bestValue:99}]});
    await normalPending;
    const afterOldResponse=store.getState('browser_fixture');
    fixtureGame.ranking.modes[1].rulesVersion='fixture-rules-easy-v2';
    store.refresh();
    const afterVersionChange=store.getState('browser_fixture');
    const newVersion=await adapter.request('browser_fixture','easy');
    renderRanking(card,fixtureGame,{...newVersion,fetchedAt:Date.now(),retryDisabled:false});
    const result={
      firstEasy:{mode:firstEasy.mode,rulesVersion:firstEasy.rulesVersion,rows:firstEasy.rows.map(row=>row.displayName)},
      afterOldResponse:{mode:afterOldResponse.mode,rulesVersion:afterOldResponse.rulesVersion,rows:afterOldResponse.rows.map(row=>row.displayName)},
      afterVersionChange:{state:afterVersionChange.state,rulesVersion:afterVersionChange.rulesVersion,rows:afterVersionChange.rows.length},
      newVersion:{rulesVersion:newVersion.rulesVersion,row:card.querySelector('tbody tr td:nth-child(2)')?.textContent},
      selector:card.querySelector('[data-mode]')?.value,
    };
    store.destroy();
    return result;
  });
  expect(result.firstEasy).toEqual({mode:'easy',rulesVersion:'fixture-rules-easy-v1',rows:['easy:fixture-rules-easy-v1']});
  expect(result.afterOldResponse).toEqual(result.firstEasy);
  expect(result.afterVersionChange).toEqual({state:'loading',rulesVersion:'fixture-rules-easy-v2',rows:0});
  expect(result.newVersion).toEqual({rulesVersion:'fixture-rules-easy-v2',row:'easy:fixture-rules-easy-v2'});
  expect(result.selector).toBe('easy');
});

test('persisted pageshow retains selection and scroll without a document reload',async({page,portalNetworkAudit})=>{
  const documents=[];
  page.on('request',request=>{if(request.resourceType()==='document')documents.push(request.url());});
  await page.addInitScript(()=>{
    window.__portalLifecycle=[];
    addEventListener('pagehide',event=>window.__portalLifecycle.push(['pagehide',event.persisted]));
    addEventListener('pageshow',event=>window.__portalLifecycle.push(['pageshow',event.persisted]));
  });
  await page.goto('./');
  await page.locator('[data-mode]').selectOption('easy');
  await page.locator('#nusumidase').scrollIntoViewIfNeeded();
  const before=await page.evaluate(()=>({mode:document.querySelector('[data-mode]').value,scrollY,docs:window.__portalLifecycle.slice()}));
  await page.evaluate(()=>{
    for(const type of ['pagehide','pageshow']){
      const event=new Event(type);Object.defineProperty(event,'persisted',{value:true});window.dispatchEvent(event);
    }
  });
  const after=await page.evaluate(()=>({mode:document.querySelector('[data-mode]').value,scrollY,docs:window.__portalLifecycle.slice()}));
  expect(before.mode).toBe('easy');
  expect(before.scrollY).toBeGreaterThan(0);
  expect(after.mode).toBe(before.mode);
  expect(after.scrollY).toBe(before.scrollY);
  expect(after.docs.slice(-2)).toEqual([['pagehide',true],['pageshow',true]]);
  expect(documents).toHaveLength(1);
  await page.evaluate(()=>{
    for(const type of ['pagehide','pageshow']){
      const event=new Event(type);Object.defineProperty(event,'persisted',{value:false});window.dispatchEvent(event);
    }
  });
  expect(await page.evaluate(()=>window.__portalLifecycle.slice(-2))).toEqual([['pagehide',false],['pageshow',false]]);
  expect(documents).toHaveLength(1);
  expect(portalNetworkAudit.requests.some(request=>request.method==='POST'||/\/rest\/v1\/rpc\//.test(request.url))).toBe(false);
});

test('history back reports actual BFCache restoration when available',async({page,portalNetworkAudit})=>{
  const documents=[];
  page.on('request',request=>{if(request.resourceType()==='document')documents.push(request.url());});
  await page.addInitScript(()=>{
    window.__portalLifecycle=[];
    addEventListener('pagehide',event=>window.__portalLifecycle.push(['pagehide',event.persisted]));
    addEventListener('pageshow',event=>window.__portalLifecycle.push(['pageshow',event.persisted]));
  });
  await page.goto('./');
  await page.locator('[data-mode]').selectOption('easy');
  await page.locator('#nusumidase').scrollIntoViewIfNeeded();
  const originalScroll=await page.evaluate(()=>scrollY);
  await page.goto('about:blank');
  await page.goBack();
  await expect(page.locator('h1')).toHaveText('ゼロ シリーズ');
  const state=await page.evaluate(()=>({
    restored:window.__portalLifecycle.some(([type,persisted])=>type==='pageshow'&&persisted),
    mode:document.querySelector('[data-mode]')?.value,
    scrollY,
  }));
  if(state.restored){
    expect(state.mode).toBe('easy');
    expect(state.scrollY).toBe(originalScroll);
    expect(documents).toHaveLength(1);
  }
  expect(portalNetworkAudit.requests.some(request=>request.method==='POST'||/\/rest\/v1\/rpc\//.test(request.url))).toBe(false);
});

test('accessible structure, colors, labels and names',async({page})=>{
  await page.goto('./');
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
});

test('offline keeps static cards and confirmed links',async({page,context})=>{
  await page.goto('./');await context.setOffline(true);
  await expect(page.locator('#machimamore a.action')).toHaveAttribute('href','https://chameleonjp-lab.github.io/machimamore/');
  await expect(page.locator('#machimamore .release')).toHaveText('公開中');
  await expect(page.locator('#gekichin a.action')).toHaveAttribute('href','https://chameleonjp-lab.github.io/gekichin/');
  await expect(page.locator('#gekichin .release')).toHaveText('公開中');
  await page.locator('[data-mode]').selectOption('easy');
  await expect(page.locator('#faitofuraito [data-scope]')).toContainText('イージー');
  await expect(page.locator('article')).toHaveCount(8);
  await expect(page.locator('#senryou a.action')).toHaveAttribute('href','https://chameleonjp-lab.github.io/senryou/');
  await expect(page.locator('#fantasia a.action')).toHaveAttribute('href','https://chameleonjp-lab.github.io/fantasia/');
  await expect(page.locator('#nusumidase a.action')).toHaveCount(0);
  await expect(page.locator('a.action')).toHaveCount(7);
  await expect(page.locator('[data-ranking-status]')).toHaveText(Array(8).fill('ランキング未接続'));
});

test('desktop columns follow width',async({page})=>{
  for(const [width,count] of [[768,2],[1280,3]]){
    await page.setViewportSize({width,height:900});await page.goto('./');
    const grid=await page.locator('.catalog').evaluate(e=>getComputedStyle(e).gridTemplateColumns);
    expect(grid.split(' ').length).toBe(count);
  }
});
