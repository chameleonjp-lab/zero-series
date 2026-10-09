import {mkdir, rm, cp, writeFile, readdir, readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {resolve,relative} from 'node:path';
import {pathToFileURL} from 'node:url';
import {catalog, validateCatalog, getPlayableUrl, validateThumbnail} from '../src/catalog.js';
import {createProductionReader, validateRankingConnection} from '../src/ranking/reader.js';

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sha256 = value => createHash('sha256').update(value).digest('hex');
const states = {published:'公開中', preparing:'準備中', unverified:'公開状況確認中'};
const imageUrl = image => `./${image.src}?v=${image.sha256}`;

/** Read dimensions from a WebP container, without a native image dependency. */
export function webpDimensions(bytes) {
  if (bytes.toString('ascii',0,4) !== 'RIFF' || bytes.toString('ascii',8,12) !== 'WEBP') throw new Error('Expected a WebP image');
  for (let offset=12; offset+8<=bytes.length;) {
    const type=bytes.toString('ascii',offset,offset+4), size=bytes.readUInt32LE(offset+4), start=offset+8;
    if (start+size>bytes.length) throw new Error('Truncated WebP image');
    if (type==='VP8X' && size>=10) return {width:bytes.readUIntLE(start+4,3)+1,height:bytes.readUIntLE(start+7,3)+1};
    if (type==='VP8 ' && size>=10 && bytes.toString('hex',start+3,start+6)==='9d012a') {
      return {width:bytes.readUInt16LE(start+6)&0x3fff,height:bytes.readUInt16LE(start+8)&0x3fff};
    }
    if (type==='VP8L' && size>=5 && bytes[start]===0x2f) {
      const dimensions=bytes.readUInt32LE(start+1);
      return {width:(dimensions&0x3fff)+1,height:((dimensions>>>14)&0x3fff)+1};
    }
    offset=start+size+(size%2);
  }
  throw new Error('WebP dimensions missing');
}

function thumbnailHtml(game,index) {
  const image=game.thumbnail;
  if (!image) return '<figure class="thumbnail" data-image-state="preparing"><span data-image-fallback>画像準備中</span></figure>';
  const primary=image.variants.find(item=>item.width===640);
  return `<figure class="thumbnail" data-image-state="pending"><picture><img data-thumbnail src="${escape(imageUrl(primary))}" srcset="${escape(image.variants.map(item=>`${imageUrl(item)} ${item.width}w`).join(', '))}" sizes="(hover: none), (pointer: coarse) calc(100vw - 32px), (min-width: 1200px) 366px, (min-width: 768px) calc((100vw - 56px) / 2), calc(100vw - 32px)" width="${primary.width}" height="${primary.height}" alt="${escape(image.alt)}" loading="${index===0?'eager':'lazy'}" decoding="async"${index===0?' fetchpriority="high"':''}></picture><span data-image-fallback hidden>画像を読み込めません</span><figcaption class="image-caption">${escape(image.caption)}</figcaption></figure>`;
}

export async function buildPortal({entries=catalog,revision,outputDir='dist',assetRoot='.'}={}) {
  validateCatalog(entries);
  if (!/^[0-9a-f]{40}$/.test(revision ?? '')) throw new Error('Full revision SHA required');
  // Flags and client labels cannot establish live access. The browser and build
  // use the same independently verified, fixed production transport bindings.
  createProductionReader({catalog:entries});
  const publication=JSON.parse(await readFile(resolve(assetRoot,'docs/evidence/current-games.json'),'utf8'));
  const images=[];
  for (const game of entries) {
    const proof=publication.games?.find(item=>item.id===game.id);
    if(!proof || ['sourceCommit','releaseState','playUrl','description'].some(key=>proof[key]!==game[key])
      || ['deployedCommit','deployedBranchCommit','manifestSha256','checkedAt','artifactHashes','deploymentRecord'].some(key=>JSON.stringify(proof.publicationEvidence[key])!==JSON.stringify(game.publicationEvidence[key])))throw new Error(`Publication evidence mismatch: ${game.id}`);
    if (!validateRankingConnection(game)) throw new Error(`Unverified ranking: ${game.id}`);
    if (game.playUrl && getPlayableUrl(game)!==game.playUrl) throw new Error(`Unverified play URL: ${game.id}`);
    if (!game.thumbnail) continue;
    validateThumbnail(game);
    const evidence=JSON.parse(await readFile(resolve(assetRoot,game.thumbnail.evidence.evidenceFile),'utf8'));
    const item=evidence.items?.find(item=>item.gameId===game.id);
    if (!item || item.sourceCommit!==game.thumbnail.evidence.sourceCommit
      || item.deployedCommit!==game.thumbnail.evidence.deployedCommit
      || item.capturedAt!==game.thumbnail.evidence.capturedAt) throw new Error(`Image provenance mismatch: ${game.id}`);
    for (const variant of game.thumbnail.variants) {
      const proof=item.outputs?.find(output=>output.src===variant.src);
      if (!proof || proof.sha256!==variant.sha256 || proof.width!==variant.width || proof.height!==variant.height) throw new Error(`Image evidence mismatch: ${variant.src}`);
      const bytes=await readFile(resolve(assetRoot,variant.src)),dimensions=webpDimensions(bytes);
      if (sha256(bytes)!==variant.sha256 || dimensions.width!==variant.width || dimensions.height!==variant.height) throw new Error(`Image bytes mismatch: ${variant.src}`);
      images.push(variant);
    }
  }
  const cards=entries.map((game,index)=>`<article class="card" id="${escape(game.id)}" data-game="${escape(game.id)}" aria-labelledby="title-${escape(game.id)}">
${thumbnailHtml(game,index)}
<div class="card-body"><p class="card-index">${String(index+1).padStart(2,'0')} / ZERO SERIES</p><h2 id="title-${escape(game.id)}">${escape(game.title)}</h2><p class="description">${escape(game.description)}</p>
<div class="entry"><p class="release ${escape(game.releaseState)}">${states[game.releaseState]}</p>${getPlayableUrl(game)?`<a class="action" href="${escape(game.playUrl)}">${escape(game.title)}を遊ぶ</a>`:`<p class="unavailable">${game.releaseState==='preparing'?'プレイ入口は準備中です':'プレイ入口を確認しています'}</p>`}</div>
<section class="ranking" aria-labelledby="ranking-${escape(game.id)}"><h3 id="ranking-${escape(game.id)}">上位5名</h3><p class="ranking-note">登録名ごとのベスト。同率を含め最大5名を表示。</p>${game.ranking.modes.length>1?`<label class="mode-control">モード<select data-mode aria-label="${escape(game.title)}のランキングモード">${game.ranking.modes.map(mode=>`<option value="${escape(mode.id)}"${mode.id===game.ranking.defaultMode?' selected':''}>${escape(mode.label)}</option>`).join('')}</select></label>`:''}<p class="scope" data-scope>${game.ranking.modes.length?escape(game.ranking.modes.find(mode=>mode.id===game.ranking.defaultMode)?.label||'モード確認中'):'モード確認中'} / ${game.ranking.enabled?'ルール版 '+escape(game.ranking.modes.find(mode=>mode.id===game.ranking.defaultMode)?.rulesVersion):'ルール版未確認'}</p><p class="ranking-state" data-ranking-status role="status">${game.ranking.displayState==='stopped'?'ランキング表示停止中':game.ranking.enabled?'ランキングを読み込み中':'ランキング未接続'}</p><div data-ranking-results></div><p class="ranking-time" data-ranking-time hidden></p><button class="retry" data-retry type="button" hidden>再試行</button></section></div></article>`).join('\n');
  await rm(outputDir,{recursive:true,force:true});await mkdir(outputDir,{recursive:true});
  await cp(resolve(assetRoot,'src'),resolve(outputDir,'src'),{recursive:true});
  for (const variant of images) {
    await mkdir(resolve(outputDir,'assets/screenshots'),{recursive:true});
    await cp(resolve(assetRoot,variant.src),resolve(outputDir,variant.src));
  }
  const modules=(await readdir(resolve(outputDir,'src'),{recursive:true})).filter(path=>path.endsWith('.js'));
  for (const path of modules) {
    const file=resolve(outputDir,'src',path),source=await readFile(file,'utf8');
    await writeFile(file,source.replace(/(from\s+['"])(\.[^'"]+\.js)(['"])/g,`$1$2?v=${revision}$3`));
  }
  await writeFile(resolve(outputDir,'index.html'),`<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="description" content="ゼロ シリーズのブラウザゲーム8作品。空戦、都市防衛、占領戦など、各作品の紹介とプレイ入口。"><meta name="source-revision" content="${revision}"><title>ゼロ シリーズ</title><link rel="stylesheet" href="./src/styles.css?v=${revision}"><script type="module" src="./src/portal.js?v=${revision}"></script></head>
<body><a class="skip" href="#games">作品一覧へ移動</a><main class="shell"><header><p class="eyebrow">BROWSER GAMES / ZERO SERIES</p><h1>ゼロ シリーズ</h1><p class="intro">空へ、海へ、まだ見ぬ戦場へ。<br>ブラウザから始まる、8つの作品。</p></header><noscript><p class="noscript">JavaScriptが無効でも作品紹介と確認済みのプレイ入口をご利用いただけます。ランキングの取得にはJavaScriptが必要です。</p></noscript><div class="catalog" id="games" tabindex="-1">${cards}</div><footer><p>画像は各作品の公開版から撮影したタイトル画面です。準備中の作品も順次ご案内します。ランキングは接続確認が完了した作品から表示します。</p><p class="build">公開ソース版: ${revision}</p></footer></main></body></html>\n`);
  await writeFile(resolve(outputDir,'.nojekyll'),'');
  const paths=(await readdir(outputDir,{recursive:true,withFileTypes:true})).filter(entry=>entry.isFile()).map(entry=>relative(resolve(outputDir),resolve(entry.parentPath,entry.name))).sort(),assetHashes={};
  if(paths.some(path=>path!=='index.html'&&path!=='.nojekyll'&&!/^src\/[a-z/]+\.(js|css)$/.test(path)&&!images.some(image=>image.src===path)))throw new Error('Unexpected distributed asset');
  for (const path of paths) assetHashes[path]=sha256(await readFile(resolve(outputDir,path)));
  const rankingConnected=entries.filter(game=>game.ranking.enabled && game.ranking.displayState==='ready').flatMap(game=>game.ranking.modes.map(mode=>({gameId:game.id,mode:mode.id,gameSlug:mode.gameSlug,rulesVersion:mode.rulesVersion,contractVersion:mode.contractVersion})));
  const imageRecords=entries.filter(game=>game.thumbnail).map(game=>({gameId:game.id,version:game.thumbnail.version,kind:game.thumbnail.kind,sourceCommit:game.thumbnail.evidence.sourceCommit,deployedCommit:game.thumbnail.evidence.deployedCommit,assets:game.thumbnail.variants.map(({src,sha256})=>({src,sha256}))}));
  await writeFile(resolve(outputDir,'deployment.json'),JSON.stringify({schemaVersion:2,sourceRevision:revision,rankingConnected,imageStatus:images.length?'public_title_screenshots':'placeholder',images:imageRecords,assetHashes,hashScope:'Every distributed file except deployment.json itself'},null,2)+'\n');
  return {revision,assetCount:paths.length,imageCount:imageRecords.length,rankingConnected};
}

if (import.meta.url===pathToFileURL(resolve(process.argv[1] ?? '')).href) {
  const revision=process.env.SOURCE_SHA||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  const result=await buildPortal({revision});
  console.log(`Built eight cards, ${result.imageCount} screenshots at ${revision}`);
}
