import test from 'node:test';
import assert from 'node:assert/strict';
import {createRankingStore, FRESH_MS, STALE_MS} from '../src/ranking/store.js';

// Fictional, injected transport; these tests never contact a ranking backend.
const score = {unit:'点',scale:1,decimals:0,order:'desc'};
const fixtureCatalog = () => [{id:'faitofuraito',ranking:{enabled:true,displayState:'ready',defaultMode:'normal',modes:['normal','easy'].map(id => ({
  id,label:id,gameSlug:`fixture_${id}`,rulesVersion:'fixture-v1',contractVersion:'fixture-read-v1',score,
  verification:{valid:true,readOnly:true,scopeIsolation:true,aggregation:'registered_name_best'},
}))}}];
const response = ({limit,...scope}, value = 100) => ({scope,score,rows:[{rank:1,displayName:'架空の確認名',bestValue:value}]});
const settle = async () => {for(let i=0;i<30;i++) await Promise.resolve();};

test('persisted return preserves selected mode and rechecks cache age without another read', async t => {
  let now=Date.parse('2026-10-09T15:00:00Z'), reads=0;
  const store=createRankingStore({catalog:fixtureCatalog(),now:()=>now,read:request=>{reads++;return response(request);}});
  t.after(()=>store.destroy());
  await store.select('faitofuraito','easy');
  store.suspend();
  assert.equal(store.getState('faitofuraito').retryDisabled,true);
  now+=FRESH_MS+1;
  store.resume();
  assert.equal(store.getState('faitofuraito').mode,'easy');
  assert.equal(store.getState('faitofuraito').state,'stale');
  assert.equal(store.getState('faitofuraito').rows.length,1);
  assert.equal(reads,1);
  store.suspend();now+=STALE_MS;store.resume();
  assert.equal(store.getState('faitofuraito').rows.length,0);
  assert.equal(store.getState('faitofuraito').state,'error');
  assert.equal(reads,1);
});

test('suspension aborts traffic, resumes the selected mode and discards the old response', async t => {
  const pending=[];
  const store=createRankingStore({catalog:fixtureCatalog(),read:(request,{signal})=>new Promise(resolve=>pending.push({request,signal,resolve}))});
  t.after(()=>store.destroy());
  const old=store.load('faitofuraito');await settle();
  assert.equal(pending.length,1);
  store.suspend();assert.equal(pending[0].signal.aborted,true);
  await store.select('faitofuraito','easy');
  store.resume();await settle();
  assert.equal(pending.length,2);
  assert.equal(pending[1].request.mode,'easy');
  pending[1].resolve(response(pending[1].request,42));await settle();
  pending[0].resolve(response(pending[0].request,999));await old;await settle();
  const state=store.getState('faitofuraito');
  assert.equal(state.mode,'easy');assert.equal(state.state,'ready');
  assert.equal(state.rows[0].bestValue,42);
});

test('stop and destruction take priority over a persisted return', async () => {
  let reads=0;
  const store=createRankingStore({catalog:fixtureCatalog(),read:request=>{reads++;return response(request);}});
  await store.load('faitofuraito');
  store.suspend();store.stop('faitofuraito');store.resume();
  assert.equal(store.getState('faitofuraito').state,'stopped');
  assert.deepEqual(store.getState('faitofuraito').rows,[]);
  store.destroy();store.resume();await store.load('faitofuraito');
  assert.equal(reads,1);
});
