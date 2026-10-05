import {mkdir,rm,cp,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readdir,readFile} from 'node:fs/promises';
import {catalog,validateCatalog} from '../src/catalog.js';
validateCatalog();
const escape = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const expected=['kaisen','faitofuraito','machimamore','gekichin','uchiotose','senryou','fantasia','nusumidase'];
if(JSON.stringify(catalog.map(g=>g.id))!==JSON.stringify(expected))throw new Error('Catalog order/allowlist mismatch');
const states={published:'公開中',preparing:'準備中',unverified:'公開状況確認中'};
for(const game of catalog){
  if(!states[game.releaseState])throw new Error('Unknown release state');
  if(game.ranking.enabled)throw new Error('Live ranking requires a separately verified production adapter');
  if(game.playUrl){const url=new URL(game.playUrl);if(game.releaseState!=='published'||url.protocol!=='https:'||url.origin!=='https://chameleonjp-lab.github.io'||url.pathname!==`/${game.id}/`||url.search||url.hash)throw new Error('Unverified play URL');}
  if(game.releaseState==='published'&&!game.playUrl)throw new Error('Published game lacks URL');
}
const revision=process.env.SOURCE_SHA||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(!/^[0-9a-f]{40}$/.test(revision))throw new Error('Full revision SHA required');
const cards=catalog.map((game,index)=>`<article class="card" id="${escape(game.id)}" data-game="${escape(game.id)}" aria-labelledby="title-${escape(game.id)}">
<div class="thumbnail" role="img" aria-label="画像準備中"><span>画像準備中</span></div>
<div class="card-body"><p class="card-index">${String(index+1).padStart(2,'0')} / ZERO SERIES</p><h2 id="title-${escape(game.id)}">${escape(game.title)}</h2><p class="description">${escape(game.description)}</p>
<div class="entry"><p class="release ${escape(game.releaseState)}">${states[game.releaseState]}</p>${game.playUrl?`<a class="action" href="${escape(game.playUrl)}">${escape(game.title)}を遊ぶ</a>`:`<p class="unavailable">${game.releaseState==='preparing'?'プレイ入口は準備中です':'プレイ入口を確認しています'}</p>`}</div>
<section class="ranking" aria-labelledby="ranking-${escape(game.id)}"><h3 id="ranking-${escape(game.id)}">上位5名</h3><p class="ranking-note">登録名ごとのベスト。同率を含め最大5名を表示。</p>${game.ranking.modes.length>1?`<label class="mode-control">モード<select data-mode aria-label="${escape(game.title)}のランキングモード">${game.ranking.modes.map(mode=>`<option value="${escape(mode.id)}"${mode.id===game.ranking.defaultMode?' selected':''}>${escape(mode.label)}</option>`).join('')}</select></label>`:''}<p class="scope" data-scope>${game.ranking.modes.length?escape(game.ranking.modes.find(m=>m.id===game.ranking.defaultMode)?.label||'モード確認中'):'モード確認中'} / ルール版未確認</p><p class="ranking-state" data-ranking-status role="status">ランキング未接続</p><div data-ranking-results></div><p class="ranking-time" data-ranking-time hidden></p><button class="retry" data-retry type="button" hidden>再試行</button></section></div></article>`).join('\n');
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});await cp('src','dist/src',{recursive:true});
const assetPaths=(await readdir('dist/src',{recursive:true})).filter(path=>/\.(js|css)$/.test(path));
for(const path of assetPaths.filter(path=>path.endsWith('.js'))){
  const file=`dist/src/${path}`;
  const source=await readFile(file,'utf8');
  await writeFile(file,source.replace(/(from\s+['"])(\.[^'"]+\.js)(['"])/g,`$1$2?v=${revision}$3`));
}
await writeFile('dist/index.html',`<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="description" content="ゼロ シリーズのブラウザゲーム8作品。空戦、都市防衛、占領戦など、各作品の紹介とプレイ入口。"><meta name="source-revision" content="${revision}"><title>ゼロ シリーズ</title><link rel="stylesheet" href="./src/styles.css?v=${revision}"><script type="module" src="./src/portal.js?v=${revision}"></script></head>
<body><a class="skip" href="#games">作品一覧へ移動</a><main class="shell"><header><p class="eyebrow">BROWSER GAMES / ZERO SERIES</p><h1>ゼロ シリーズ</h1><p class="intro">空へ、海へ、まだ見ぬ戦場へ。<br>ブラウザから始まる、8つの作品。</p></header><noscript><p class="noscript">JavaScriptが無効でも作品紹介と公開済みのプレイ入口をご利用いただけます。</p></noscript><div class="catalog" id="games" tabindex="-1">${cards}</div><footer><p>作品ごとの公開状態をご案内しています。画像は準備中です。ランキングは接続確認が完了した作品から表示します。</p><p class="build">公開ソース版: ${revision}</p></footer></main></body></html>\n`);
await writeFile('dist/.nojekyll','');
const assetHashes={};
for(const path of ['index.html',...assetPaths.map(path=>`src/${path}`)])assetHashes[path]=createHash('sha256').update(await readFile(`dist/${path}`)).digest('hex');
await writeFile('dist/deployment.json',JSON.stringify({sourceRevision:revision,rankingConnected:[],imageStatus:'placeholder',assetHashes},null,2)+'\n');
console.log(`Built eight cards at ${revision}`);
