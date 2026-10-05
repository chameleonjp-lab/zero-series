import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,validateCatalog,getPlayableUrl} from '../src/catalog.js';

test('fixed eight-source allowlist and live-disabled production policy',()=>{
  assert.equal(validateCatalog(),true);
  assert.equal(catalog.filter(game=>getPlayableUrl(game)).length,3);
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

test('only the three byte-verified public games have playable entries',()=>{
  assert.deepEqual(catalog.filter(game=>getPlayableUrl(game)).map(game=>game.id),['kaisen','faitofuraito','uchiotose']);
  const entry=catalog.find(game=>game.id==='uchiotose');
  assert.equal(entry.publicationEvidence.currentMainProductBytesMatch,true);
  assert.notEqual(entry.sourceCommit,entry.publicationEvidence.deployedCommit);
  assert.equal(Object.keys(entry.publicationEvidence.artifactHashes).length,4);
  const unverified=structuredClone(entry);unverified.publicationEvidence.verified=false;
  assert.equal(getPlayableUrl(unverified),null);
});
