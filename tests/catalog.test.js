import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,validateCatalog,getPlayableUrl} from '../src/catalog.js';

test('fixed eight-source allowlist and live-disabled production policy',()=>{
  assert.equal(validateCatalog(),true);
  assert.equal(catalog.filter(game=>getPlayableUrl(game)).length,5);
  assert.ok(catalog.every(game=>game.thumbnail===null&&game.ranking.enabled===false));
});
test('unsafe URLs, unverified publications and incorrect source roots are refused',()=>{
  for(const url of ['javascript:alert(1)','data:text/html,hi','https://evil.test/kaisen/','https://chameleonjp-lab.github.io/kaisen/?redirect=x','https://chameleonjp-lab.github.io/faitofuraito/']){
    const copy=structuredClone(catalog);copy[0].playUrl=url;assert.equal(getPlayableUrl(copy[0]),null);assert.throws(()=>validateCatalog(copy));
  }
  for(const change of [entry=>entry.publicationEvidence.verified=false,entry=>entry.sourceRoot='https://example.test/',entry=>entry.releaseState='unverified',entry=>entry.publicationEvidence.deployedCommit=null]){
    const copy=structuredClone(catalog);change(copy[0]);assert.throws(()=>validateCatalog(copy));
  }
});
test('wrong counts, ordering, unknown game and activation fail build validation',()=>{
  assert.throws(()=>validateCatalog(catalog.slice(0,7)));
  assert.throws(()=>validateCatalog([...catalog].reverse()));
  const copy=structuredClone(catalog);copy[0].id='seme';assert.throws(()=>validateCatalog(copy));
  const active=structuredClone(catalog);active[0].ranking.enabled=true;assert.throws(()=>validateCatalog(active));
});

test('only the five byte-verified public games have playable entries',()=>{
  assert.deepEqual(catalog.filter(game=>getPlayableUrl(game)).map(game=>game.id),['kaisen','faitofuraito','machimamore','gekichin','uchiotose']);
  const entry=catalog.find(game=>game.id==='uchiotose');
  assert.equal(entry.publicationEvidence.currentMainProductBytesMatch,true);
  assert.equal(entry.sourceCommit,entry.publicationEvidence.deployedCommit);
  assert.equal(Object.keys(entry.publicationEvidence.artifactHashes).length,6);
  const unverified=structuredClone(entry);unverified.publicationEvidence.verified=false;
  assert.equal(getPlayableUrl(unverified),null);
});

test('Gekichin publication is bound to the verified main, exact URL and four product hashes',()=>{
  const entry=catalog.find(game=>game.id==='gekichin');
  const sha='5504f3785ca783a694b2c5fedd39987ad6ef4349';
  const url='https://chameleonjp-lab.github.io/gekichin/';
  assert.equal(entry.releaseState,'published');
  assert.equal(getPlayableUrl(entry),url);
  assert.equal(entry.publicationEvidence.officialUrl,url);
  assert.equal(entry.sourceCommit,sha);
  assert.equal(entry.sourceRoot,`https://github.com/chameleonjp-lab/gekichin/tree/${sha}`);
  assert.equal(entry.publicationEvidence.deployedCommit,sha);
  assert.equal(entry.publicationEvidence.currentMainProductBytesMatch,true);
  assert.equal(entry.description,'超大型母艦の100基の砲台を、僚機と破壊するタイム・スコアアタック。イージーとノーマルで挑戦できます。');
  assert.doesNotMatch(entry.description,/予定|プロトタイプ|未実装|完成|受入済み/);
  assert.deepEqual(entry.publicationEvidence.artifactHashes,{
    'assets/index-BufJBCcE.css':'d89927dcc6ca023fc4eb27a7d824215101184aeac9f2505e117eb80b76bb89bf',
    'assets/index-Ca9XU86d.js':'75a38d906ca0775e2a1b7322366f3dfeb97a00edfd817ca00efc6f356f34cb9c',
    'index.html':'1856e5b784410ffd8af94e7c8610f9def8ed0bc3f157062c28a7dd80c9b09b6a',
    'third-party-notices.txt':'97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f'
  });
  assert.equal(entry.publicationEvidence.manifestSha256,'bc0bcd6507275a37244084cfb63d37a4de4427db6d0e21f9e805fb10703d640c');
  assert.equal(entry.publicationEvidence.deployedArtifactBytesMatch,true);
  assert.ok(entry.publicationEvidence.method.some(value=>value.includes('only the deployment manifest changed')));
  assert.deepEqual(entry.publicationEvidence.deploymentRecord,{
    kind:'github_actions',runId:37436127535,headCommit:sha,conclusion:'success',completedRecordAt:'2026-10-06T08:40:38Z'
  });
  assert.ok(entry.publicationEvidence.unknown.some(value=>value.includes('Cloud WebGL')));
  assert.ok(entry.publicationEvidence.unknown.some(value=>value.includes('Physical iPhone')));
  assert.deepEqual(entry.ranking,{enabled:false,displayState:'not_connected',defaultMode:null,modes:[]});
});

test('Uchiotose published correction separates source, Pages commit and all six verified files',()=>{
  const entry=catalog.find(game=>game.id==='uchiotose');
  const evidence=entry.publicationEvidence;
  const source='2a7e815c70baf9dc65721fc938909b6ab083f074';
  const pages='1307117008dc72f9031a8c345b6ac077fc8ff30b';
  const url='https://chameleonjp-lab.github.io/uchiotose/';
  assert.equal(entry.releaseState,'published');
  assert.equal(getPlayableUrl(entry),url);
  assert.equal(evidence.officialUrl,url);
  assert.equal(entry.sourceCommit,source);
  assert.equal(entry.sourceRoot,`https://github.com/chameleonjp-lab/uchiotose/tree/${source}`);
  assert.equal(evidence.deployedCommit,source);
  assert.equal(evidence.deployedBranchCommit,pages);
  assert.notEqual(source,pages);
  assert.equal(evidence.currentMainProductBytesMatch,true);
  assert.equal(evidence.deployedArtifactBytesMatch,true);
  assert.deepEqual(evidence.artifactHashes,{
    '.nojekyll':'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'assets/index-6rKQhKs9.js':'43c37845c5c40f00a614d813d5f68dad97d5d73ef46161725494bd19702cc639',
    'assets/index-jjlx_KNJ.css':'2dfeffc8772c95dc1673934db5bf8048ddde79d6e3a541dbf81dcaf3b36d1382',
    'index.html':'57062efb52f8ce0a2f3784b0a5f3de25a309c28b85061749b39501a5622b9b3e',
    'release.json':'912aa5163fc46ab06aa80387c475ca1abef960c72f27ef0a49f43a3fc4180cb7',
    'third-party-notices.txt':'97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f'
  });
  assert.equal(evidence.manifestSha256,evidence.artifactHashes['release.json']);
  assert.deepEqual(evidence.releaseManifest,{commit:source,rulesVersion:'uchiotose-1',ranking:false});
  assert.deepEqual(evidence.deploymentRecord,{
    kind:'github_pages_branch',runId:37439104263,headCommit:pages,conclusion:'success',completedRecordAt:'2026-10-06T08:53:21Z'
  });
  assert.equal(evidence.publishedReviewFix,'https://github.com/chameleonjp-lab/uchiotose/pull/8');
  assert.equal(Object.hasOwn(evidence,'unpublishedReviewFix'),false);
  assert.doesNotMatch(JSON.stringify(evidence),/not merged or deployed|earlier source commit/);
  assert.ok(evidence.unknown.some(value=>value.includes('Cloud WebGL')));
  assert.ok(evidence.unknown.some(value=>value.includes('WebKit')&&value.includes('not full game rendering')));
  assert.ok(evidence.unknown.some(value=>value.includes('Physical iPhone')&&value.includes('GPU')));
  assert.deepEqual(entry.ranking,{enabled:false,displayState:'not_connected',defaultMode:null,modes:[]});
});

test('Gekichin refuses incorrect URLs and missing publication proof',()=>{
  for(const change of [
    entry=>entry.playUrl='https://chameleonjp-lab.github.io/gekichin/?redirect=x',
    entry=>entry.playUrl='https://chameleonjp-lab.github.io/kaisen/',
    entry=>entry.publicationEvidence.officialUrl='https://example.test/gekichin/',
    entry=>entry.publicationEvidence.verified=false,
    entry=>entry.publicationEvidence.deployedCommit=null,
    entry=>entry.releaseState='preparing'
  ]){
    const copy=structuredClone(catalog);const entry=copy.find(game=>game.id==='gekichin');change(entry);
    assert.equal(getPlayableUrl(entry),null);assert.throws(()=>validateCatalog(copy));
  }
});


test('Machimamore publication separates exact product bytes from run-specific provenance',()=>{
  const entry=catalog.find(game=>game.id==='machimamore');
  const sha='1d27a697ea62dbfa676e1e78968c164552459ec5';
  const url='https://chameleonjp-lab.github.io/machimamore/';
  assert.equal(entry.releaseState,'published');
  assert.equal(getPlayableUrl(entry),url);
  assert.equal(entry.publicationEvidence.officialUrl,url);
  assert.equal(entry.sourceCommit,sha);
  assert.equal(entry.sourceRoot,`https://github.com/chameleonjp-lab/machimamore/tree/${sha}`);
  assert.equal(entry.publicationEvidence.deployedCommit,sha);
  assert.equal(entry.description,'街20区画を守り、味方戦闘機と50機の敵UFOを迎撃する都市防衛ゲーム。イージーとノーマルで挑戦できます。');
  assert.doesNotMatch(entry.description,/予定|準備段階|未実装|完成|受入済み|レバー/);
  assert.deepEqual(entry.publicationEvidence.artifactHashes,{
    'artifact-manifest.json':'57742db53f439b2641c8c4b6f8eab3cf3264d9217cce217002531d58f3111589',
    'assets/index-BAyulP5k.css':'52bee58f42cf2b7d73afc93ba89df8a27f15cd117f74a857c8d852c602516d65',
    'assets/index-CX-kywWz.js':'9d04640ab8527e2b90fae88da3a455d7ca1da658eb0b20d21da04e1202dcceb0',
    'index.html':'dae5e25fd272dcf1115e7af756565e940271db243102c5af9a4f2ab6a0947d79',
    'third-party-notices.txt':'8b378ebe60e2fe500158cb0ac71cb5e8b7d92953c2abcc63a0eb90499653b5bc'
  });
  assert.equal(entry.publicationEvidence.manifestSha256,'ab92295564225afb5fe84a8b4c9596f3537ed3efdf5df43cd309e0d3d8626d8a');
  assert.equal(entry.publicationEvidence.sourceContentDigest,'f5cf45e8fc5907fcd8113596c8fb14d6d1e461e34f428547ae5fb9610bd41043');
  assert.equal(entry.publicationEvidence.sourceManifestSha256,'c9ef9cd15a779cf1e0a5715ef39d39e3efdc367d8f12f5d07857ac4d8831725b');
  assert.equal(entry.publicationEvidence.currentMainProductBytesMatch,true);
  assert.equal(entry.publicationEvidence.deployedArtifactBytesMatch,true);
  assert.equal(entry.publicationEvidence.deploymentManifestMatchesIndependentBuild,false);
  assert.match(entry.publicationEvidence.manifestVariance,/generatedAt.*sourceManifestSha256.*81 source inputs/);
  assert.deepEqual(entry.publicationEvidence.deploymentRecord,{
    kind:'github_actions',runId:37394426765,headCommit:sha,conclusion:'success',completedRecordAt:'2026-10-06T00:37:50Z'
  });
  assert.ok(entry.publicationEvidence.unknown.some(value=>value.includes('Cloud WebGL')));
  assert.ok(entry.publicationEvidence.unknown.some(value=>value.includes('Physical iPhone')));
  assert.ok(entry.publicationEvidence.unknown.some(value=>value.includes('speed-lever')));
  assert.deepEqual(entry.ranking,{enabled:false,displayState:'not_connected',defaultMode:null,modes:[]});
});

test('Machimamore refuses incorrect URLs and missing publication proof',()=>{
  for(const change of [
    entry=>entry.playUrl='https://chameleonjp-lab.github.io/machimamore/?redirect=x',
    entry=>entry.playUrl='https://chameleonjp-lab.github.io/machimamore/#play',
    entry=>entry.playUrl='https://chameleonjp-lab.github.io/kaisen/',
    entry=>entry.publicationEvidence.officialUrl='https://example.test/machimamore/',
    entry=>entry.publicationEvidence.verified=false,
    entry=>entry.publicationEvidence.deployedCommit=null,
    entry=>entry.releaseState='preparing'
  ]){
    const copy=structuredClone(catalog);const entry=copy.find(game=>game.id==='machimamore');change(entry);
    assert.equal(getPlayableUrl(entry),null);assert.throws(()=>validateCatalog(copy));
  }
});
