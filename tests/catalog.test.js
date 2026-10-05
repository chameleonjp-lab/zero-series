import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,validateCatalog,getPlayableUrl} from '../src/catalog.js';

test('fixed eight-source allowlist and live-disabled production policy',()=>{
  assert.equal(validateCatalog(),true);
  assert.equal(catalog.filter(game=>getPlayableUrl(game)).length,4);
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

test('only the four byte-verified public games have playable entries',()=>{
  assert.deepEqual(catalog.filter(game=>getPlayableUrl(game)).map(game=>game.id),['kaisen','faitofuraito','gekichin','uchiotose']);
  const entry=catalog.find(game=>game.id==='uchiotose');
  assert.equal(entry.publicationEvidence.currentMainProductBytesMatch,true);
  assert.notEqual(entry.sourceCommit,entry.publicationEvidence.deployedCommit);
  assert.equal(Object.keys(entry.publicationEvidence.artifactHashes).length,4);
  const unverified=structuredClone(entry);unverified.publicationEvidence.verified=false;
  assert.equal(getPlayableUrl(unverified),null);
});

test('Gekichin publication is bound to the verified main, exact URL and four product hashes',()=>{
  const entry=catalog.find(game=>game.id==='gekichin');
  const sha='ad0d62b7968fd40f4d502f07c5bc4671d44973b9';
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
  assert.equal(entry.publicationEvidence.manifestSha256,'4fcda149b42d3dd6b1dc49f361d1cf2be9c5c739cddcedfd7b25e7b770966ce9');
  assert.deepEqual(entry.publicationEvidence.deploymentRecord,{
    kind:'github_actions',runId:37353314366,headCommit:sha,conclusion:'success',completedRecordAt:'2026-10-05T18:19:37Z'
  });
  assert.ok(entry.publicationEvidence.unknown.some(value=>value.includes('Cloud WebGL')));
  assert.ok(entry.publicationEvidence.unknown.some(value=>value.includes('Physical iPhone')));
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
