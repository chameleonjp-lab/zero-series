import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,validateCatalog,getPlayableUrl} from '../src/catalog.js';

test('fixed eight-source allowlist and live-disabled production policy',()=>{
  assert.equal(validateCatalog(),true);
  assert.equal(catalog.filter(game=>getPlayableUrl(game)).length,7);
  assert.equal(catalog.filter(game=>game.thumbnail).length,2);
  assert.ok(catalog.every(game=>game.ranking.enabled===false));
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

test('only the seven byte-verified public games have playable entries',()=>{
  assert.deepEqual(catalog.filter(game=>getPlayableUrl(game)).map(game=>game.id),['kaisen','faitofuraito','machimamore','gekichin','uchiotose','senryou','fantasia']);
  const entry=catalog.find(game=>game.id==='uchiotose');
  assert.equal(entry.publicationEvidence.currentMainProductBytesMatch,true);
  assert.equal(entry.sourceCommit,entry.publicationEvidence.deployedCommit);
  assert.equal(entry.publicationEvidence.deployedSourceProductBytesMatch,true);
  assert.equal(Object.keys(entry.publicationEvidence.artifactHashes).length,4);
  const unverified=structuredClone(entry);unverified.publicationEvidence.verified=false;
  assert.equal(getPlayableUrl(unverified),null);
});

test('Gekichin current publication binds exact product bytes and source',()=>{
  const entry=catalog.find(game=>game.id==='gekichin');
  const evidence=entry.publicationEvidence;
  const source='cd9431c53d64543c0d49e562dea9ea03d22a609c';
  const url='https://chameleonjp-lab.github.io/gekichin/';
  assert.equal(entry.releaseState,'published');
  assert.equal(getPlayableUrl(entry),url);
  assert.equal(evidence.officialUrl,url);
  assert.equal(entry.sourceCommit,source);
  assert.equal(entry.sourceRoot,`https://github.com/chameleonjp-lab/gekichin/tree/${source}`);
  assert.equal(evidence.deployedCommit,source);
  assert.equal(evidence.sourceIsLatestMain,true);
  assert.equal(evidence.currentMainProductBytesMatch,true);
  assert.equal(evidence.deployedSourceProductBytesMatch,true);
  assert.equal(evidence.allProductHashesMatch,true);
  assert.equal(evidence.productFileCount,4);
  assert.deepEqual(evidence.artifactHashes,{
  "assets/index-BKPe2TDn.css": "29b85fd6c6e25fedbc8591d2d6863d176d820425956827dd761d63ba2aaa408c",
  "assets/index-BcgCHwIl.js": "e8a421537de54698483df7f19ef15ab9845a844e0f2adebb4352b1b0a3da144c",
  "index.html": "f974e38224508984d9886da0f1b0ac2584c8996ab2baeb7f4a82156c67e72735",
  "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
});
  assert.equal(evidence.manifestSha256,'06c9fdcd566e6a620ca9d6847712b0d3a91ae99550cb3b91a740c55caa683dc4');
  assert.equal(evidence.manifestFile,'deployment.json');
  assert.equal(evidence.deploymentManifest.commit,source);
  assert.equal(evidence.deployedArtifactBytesMatch,null);
  assert.ok(evidence.method.some(value=>value.includes('production build')));
  assert.equal(evidence.deploymentRecord.kind,'github_actions');
  assert.equal(evidence.deploymentRecord.runId,38019866234);
  assert.equal(evidence.deploymentRecord.headCommit,'cd9431c53d64543c0d49e562dea9ea03d22a609c');
  assert.equal(evidence.deploymentRecord.conclusion,'success');
  assert.equal(evidence.deploymentRecord.deployJobConclusion,'success');
  assert.equal(evidence.deploymentRecord.completedRecordAt,'2026-10-10T03:16:42Z');
  assert.ok(evidence.unknown.some(value=>value.includes('live gameplay')));
  assert.ok(evidence.unknown.some(value=>value.includes('physical iPhone')&&value.includes('GPU')));
  assert.ok(evidence.unknown.some(value=>value.includes('full gameplay/release acceptance is not claimed')));
  assert.equal(entry.thumbnail,null);
  assert.deepEqual(entry.ranking,{enabled:false,displayState:'not_connected',defaultMode:null,modes:[]});
  assert.equal(entry.description,'超大型母艦の100基の砲台を、僚機と破壊するタイム・スコアアタック。イージーとノーマルで挑戦できます。');
  assert.doesNotMatch(entry.description,/予定|プロトタイプ|未実装|完成|受入済み/);
});

test('Uchiotose current publication separates source and Pages branch commits',()=>{
  const entry=catalog.find(game=>game.id==='uchiotose');
  const evidence=entry.publicationEvidence;
  const source='0d00ef31a44786e23a0e93aae2bda6d78c15ccdf';
  const url='https://chameleonjp-lab.github.io/uchiotose/';
  assert.equal(entry.releaseState,'published');
  assert.equal(getPlayableUrl(entry),url);
  assert.equal(evidence.officialUrl,url);
  assert.equal(entry.sourceCommit,source);
  assert.equal(entry.sourceRoot,`https://github.com/chameleonjp-lab/uchiotose/tree/${source}`);
  assert.equal(evidence.deployedCommit,source);
  assert.equal(evidence.sourceIsLatestMain,true);
  assert.equal(evidence.currentMainProductBytesMatch,true);
  assert.equal(evidence.deployedSourceProductBytesMatch,true);
  assert.equal(evidence.allProductHashesMatch,true);
  assert.equal(evidence.productFileCount,4);
  assert.deepEqual(evidence.artifactHashes,{
  "assets/index-BF7Y2cGw.js": "3338ca7bc302878339bf5471aca43eecc24d2c204d6604cea7949d23bf3261c7",
  "assets/index-CM_NdGef.css": "da43ec868b2376e44fca82231ce10e744bf4435d158bdfc3698576a6aca177b7",
  "index.html": "41d29d4e9dfb63b2a218c965334b014581a3f746f68d3404f9663cb29a16acd4",
  "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
});
  assert.equal(evidence.manifestSha256,'6850bb50df1efdb3e95c4806b654cdd92c24606ead961ce4346b86b9b6ae2d5f');
  assert.equal(evidence.manifestFile,'deployment.json');
  assert.equal(evidence.deploymentManifest.commit,source);
  assert.equal(evidence.deployedArtifactBytesMatch,null);
  assert.ok(evidence.method.some(value=>value.includes('production build')));
  assert.equal(evidence.deploymentRecord.kind,'github_pages_branch');
  assert.equal(evidence.deploymentRecord.runId,38018823568);
  assert.equal(evidence.deploymentRecord.headCommit,'df1827e37d962d14cb75ca8038d0c6bf36c9435b');
  assert.equal(evidence.deploymentRecord.conclusion,'success');
  assert.equal(evidence.deploymentRecord.deployJobConclusion,'success');
  assert.equal(evidence.deploymentRecord.completedRecordAt,'2026-10-10T02:57:27Z');
  assert.ok(evidence.unknown.some(value=>value.includes('live gameplay')));
  assert.ok(evidence.unknown.some(value=>value.includes('physical iPhone')&&value.includes('GPU')));
  assert.ok(evidence.unknown.some(value=>value.includes('full gameplay/release acceptance is not claimed')));
  assert.equal(entry.thumbnail,null);
  assert.deepEqual(entry.ranking,{enabled:false,displayState:'not_connected',defaultMode:null,modes:[]});
  assert.equal(evidence.deployedBranchCommit,'df1827e37d962d14cb75ca8038d0c6bf36c9435b');
  assert.notEqual(source,evidence.deployedBranchCommit);
  assert.equal(evidence.deployedBranchBytesMatch,true);
  assert.equal(Object.hasOwn(evidence,'releaseManifest'),false);
  assert.equal(Object.hasOwn(evidence,'unpublishedReviewFix'),false);
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


test('Machimamore current publication separates product bytes from source-manifest timestamp',()=>{
  const entry=catalog.find(game=>game.id==='machimamore');
  const evidence=entry.publicationEvidence;
  const source='cb7d698a50abb8bbb53b00c2e0071fc7cfc28b70';
  const url='https://chameleonjp-lab.github.io/machimamore/';
  assert.equal(entry.releaseState,'published');
  assert.equal(getPlayableUrl(entry),url);
  assert.equal(evidence.officialUrl,url);
  assert.equal(entry.sourceCommit,source);
  assert.equal(entry.sourceRoot,`https://github.com/chameleonjp-lab/machimamore/tree/${source}`);
  assert.equal(evidence.deployedCommit,source);
  assert.equal(evidence.sourceIsLatestMain,true);
  assert.equal(evidence.currentMainProductBytesMatch,true);
  assert.equal(evidence.deployedSourceProductBytesMatch,true);
  assert.equal(evidence.allProductHashesMatch,true);
  assert.equal(evidence.productFileCount,5);
  assert.deepEqual(evidence.artifactHashes,{
  "artifact-manifest.json": "648231e89c25af736346da4822afbc16ebc7e718c8382c4d3e208bd0396413ee",
  "assets/index-HVHVUVZ-.css": "9be6cdcdbbbe9a9774071aee82eb7052022eec3af68b6385e949ce77d28ba824",
  "assets/index-oETSqCgi.js": "071fd026445754c1fee42701dbef2be15d23b4acbe7f05972173bb482aaa0570",
  "index.html": "b4ca6aa64aed0c1e5edf71f51ecf092cf0403de88852108a9b8cd18f9a94275b",
  "third-party-notices.txt": "8b378ebe60e2fe500158cb0ac71cb5e8b7d92953c2abcc63a0eb90499653b5bc"
});
  assert.equal(evidence.manifestSha256,'dc9853c72a3d76f5eea9c16f4a983b6e9aef0eb093ed0d500e91a21113d6eaf5');
  assert.equal(evidence.manifestFile,'deployment.json');
  assert.equal(evidence.deploymentManifest.commit,source);
  assert.equal(evidence.deployedArtifactBytesMatch,null);
  assert.ok(evidence.method.some(value=>value.includes('production build')));
  assert.equal(evidence.deploymentRecord.kind,'github_actions');
  assert.equal(evidence.deploymentRecord.runId,38019861713);
  assert.equal(evidence.deploymentRecord.headCommit,'cb7d698a50abb8bbb53b00c2e0071fc7cfc28b70');
  assert.equal(evidence.deploymentRecord.conclusion,'success');
  assert.equal(evidence.deploymentRecord.deployJobConclusion,'success');
  assert.equal(evidence.deploymentRecord.completedRecordAt,'2026-10-10T03:16:34Z');
  assert.ok(evidence.unknown.some(value=>value.includes('live gameplay')));
  assert.ok(evidence.unknown.some(value=>value.includes('physical iPhone')&&value.includes('GPU')));
  assert.ok(evidence.unknown.some(value=>value.includes('full gameplay/release acceptance is not claimed')));
  assert.equal(entry.thumbnail,null);
  assert.deepEqual(entry.ranking,{enabled:false,displayState:'not_connected',defaultMode:null,modes:[]});
  assert.equal(entry.description,'街20区画を守り、味方戦闘機と50機の敵UFOを迎撃する都市防衛ゲーム。イージーとノーマルで挑戦できます。');
  assert.doesNotMatch(entry.description,/予定|準備段階|未実装|完成|受入済み|レバー/);
  assert.equal(evidence.sourceContentDigest,'37ef1ac1631b2fd306896fb81bd5cd6b4387b752927a646569996e71b8e78fe5');
  assert.equal(evidence.sourceManifestSha256,'671aa8565a0dc5f473b2c28e8a9f3d09164b4e60e9269218736f815160606d24');
  assert.equal(evidence.deploymentManifestMatchesIndependentBuild,null);
  assert.match(evidence.manifestVariance,/generation timestamp.*not reconstructed/);
  assert.equal(evidence.sourceValidation.sourceInputFileCount,95);
  assert.equal(evidence.sourceValidation.matchesPublicDeploymentDigest,true);
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
