import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('8 static cards, unavailable states and local-only ranking',async({page})=>{
  const errors=[];const external=[];
  page.on('pageerror',e=>errors.push(e.message));
  const base=new URL(process.env.BASE_URL||'http://127.0.0.1:4173/');
  const sourcePrefix=new URL('./src/',base).pathname;
  page.on('request',request=>{const url=new URL(request.url());if(url.origin!==base.origin||request.resourceType()!=='document'&&!url.pathname.startsWith(sourcePrefix))external.push(request.url());});
  await page.goto('./');
  await expect(page).toHaveTitle('ゼロ シリーズ');
  await expect(page.locator('h1')).toHaveText('ゼロ シリーズ');
  await expect(page.locator('article.card')).toHaveCount(8);
  await expect(page.locator('#uchiotose a.action')).toHaveAttribute('href','https://chameleonjp-lab.github.io/uchiotose/');
  await expect(page.locator('#gekichin .release')).toHaveText('公開中');
  await expect(page.locator('#gekichin .description')).toHaveText('超大型母艦の100基の砲台を、僚機と破壊するタイム・スコアアタック。イージーとノーマルで挑戦できます。');
  await expect(page.locator('#gekichin a.action')).toHaveText('ゲキチンを遊ぶ');
  await expect(page.locator('#gekichin a.action')).toHaveAttribute('href','https://chameleonjp-lab.github.io/gekichin/');
  await expect(page.locator('#gekichin .unavailable')).toHaveCount(0);
  await expect(page.locator('#gekichin [data-ranking-status]')).toHaveText('ランキング未接続');
  await expect(page.locator('a.action')).toHaveCount(4);
  await expect(page.locator('[data-ranking-status]')).toHaveText(Array(8).fill('ランキング未接続'));
  await page.locator('[data-mode]').selectOption('easy');
  await expect(page.locator('#faitofuraito [data-scope]')).toContainText('イージー');
  await expect(page.locator('#faitofuraito [data-ranking-status]')).toHaveText('ランキング未接続');
  expect(errors).toEqual([]);expect(external).toEqual([]);
  await expect(page.locator('iframe,audio,canvas')).toHaveCount(0);
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
});

for(const width of [320,375,390,430,768,1280,1440])test(`layout ${width}px, zoom and long text`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('./');
  await page.evaluate(()=>{document.querySelector('h2').textContent+='長い作品名'.repeat(15);document.querySelector('.description').textContent+='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(10);document.documentElement.style.fontSize='200%';});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const element of await page.locator('a.action,select').all()){const box=await element.boundingBox();expect(box.height).toBeGreaterThanOrEqual(44);}
});

test('touch landscape keeps one column',async({browser})=>{
  const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true});const page=await context.newPage();await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/');
  const grid=await page.locator('.catalog').evaluate(e=>getComputedStyle(e).gridTemplateColumns);expect(grid.split(' ').length).toBe(1);await context.close();
});

test('static content survives disabled JS and keyboard navigation',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/');
  await expect(page.locator('#gekichin a.action')).toHaveAttribute('href','https://chameleonjp-lab.github.io/gekichin/');
  await expect(page.locator('#gekichin .release')).toHaveText('公開中');
  await expect(page.locator('article')).toHaveCount(8);await expect(page.locator('noscript')).toBeVisible();await page.keyboard.press('Tab');await expect(page.locator('.skip')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#games')).toBeFocused();await context.close();
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

test('accessible structure, colors, labels and names',async({page})=>{
  await page.goto('./');
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
});

test('offline keeps static cards and confirmed links',async({page,context})=>{
  await page.goto('./');await context.setOffline(true);
  await expect(page.locator('#gekichin a.action')).toHaveAttribute('href','https://chameleonjp-lab.github.io/gekichin/');
  await expect(page.locator('#gekichin .release')).toHaveText('公開中');
  await page.locator('[data-mode]').selectOption('easy');
  await expect(page.locator('#faitofuraito [data-scope]')).toContainText('イージー');
  await expect(page.locator('article')).toHaveCount(8);
  await expect(page.locator('a.action')).toHaveCount(4);
  await expect(page.locator('[data-ranking-status]')).toHaveText(Array(8).fill('ランキング未接続'));
});

test('desktop columns follow width',async({page})=>{
  for(const [width,count] of [[768,2],[1280,3]]){
    await page.setViewportSize({width,height:900});await page.goto('./');
    const grid=await page.locator('.catalog').evaluate(e=>getComputedStyle(e).gridTemplateColumns);
    expect(grid.split(' ').length).toBe(count);
  }
});
