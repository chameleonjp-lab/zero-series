import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,readdir,rm,mkdir,cp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,relative} from 'node:path';
import {createHash} from 'node:crypto';
import {catalog,validateCatalog} from '../src/catalog.js';
import {buildPortal} from '../scripts/build.mjs';

const revision='a'.repeat(40);
const temporary=async t=>{const path=await mkdtemp(join(tmpdir(),'zero-build-'));t.after(()=>rm(path,{recursive:true,force:true}));return path;};

test('every distributed file and screenshot is hashed; source and image cache versions agree', async t=>{
  const outputDir=await temporary(t);
  const result=await buildPortal({revision,outputDir});
  assert.equal(result.imageCount,5);assert.deepEqual(result.rankingConnected,[]);
  const manifest=JSON.parse(await readFile(join(outputDir,'deployment.json'),'utf8'));
  const files=(await readdir(outputDir,{recursive:true,withFileTypes:true})).filter(entry=>entry.isFile()&&entry.name!=='deployment.json').map(entry=>relative(resolve(outputDir),resolve(entry.parentPath,entry.name))).sort();
  assert.deepEqual(Object.keys(manifest.assetHashes).sort(),files);
  assert.ok(files.every(path=>!/(docs|tests|node_modules|\.git)/.test(path)));
  for(const file of files) assert.equal(createHash('sha256').update(await readFile(join(outputDir,file))).digest('hex'),manifest.assetHashes[file],file);
  const html=await readFile(join(outputDir,'index.html'),'utf8');
  assert.ok(html.includes(`name="source-revision" content="${revision}"`));
  assert.equal((html.match(/data-thumbnail /g)||[]).length,5);
  assert.equal((html.match(/loading="eager"/g)||[]).length,1);
  assert.equal((html.match(/loading="lazy"/g)||[]).length,4);
  for(const game of catalog.filter(game=>game.thumbnail)) for(const image of game.thumbnail.variants) assert.ok(html.includes(`${image.src}?v=${image.sha256}`));
  assert.equal(manifest.images.length,5);assert.equal(manifest.imageStatus,'public_title_screenshots');
  const module=await readFile(join(outputDir,'src/portal.js'),'utf8');
  assert.ok(module.includes(`./ranking/reader.js?v=${revision}`));
});

test('corrupted image bytes fail before replacing an existing build', async t=>{
  const root=await temporary(t),outputDir=join(root,'dist');
  await mkdir(join(root,'docs/evidence'),{recursive:true});
  await mkdir(join(root,'assets/screenshots'),{recursive:true});
  await mkdir(outputDir);await writeFile(join(outputDir,'sentinel'),'existing build');
  await cp('docs/evidence/images-current.json',join(root,'docs/evidence/images-current.json'));
  await cp('docs/evidence/current-games.json',join(root,'docs/evidence/current-games.json'));
  const image=catalog[0].thumbnail.variants[0];
  const bytes=await readFile(image.src);bytes[bytes.length-1]^=1;
  await writeFile(join(root,image.src),bytes);
  await assert.rejects(buildPortal({revision,outputDir,assetRoot:root}),/Image bytes mismatch/);
  assert.equal(await readFile(join(outputDir,'sentinel'),'utf8'),'existing build');
});

test('missing evidence, wrong source, wrong dimensions and false ranking activation cannot build', async t=>{
  const outputDir=await temporary(t);
  for(const mutate of [
    game=>game.thumbnail.evidence.deployedCommit='b'.repeat(40),
    game=>game.thumbnail.variants[0].width=641,
    game=>game.thumbnail.evidence.rights='',
    game=>game.thumbnail.variants[0].src='https://example.invalid/picture.webp',
    game=>game.ranking.enabled=true,
    game=>{game.ranking.enabled=true;game.ranking.displayState='ready';game.ranking.modes=[{id:'normal',gameSlug:'kaisen_normal',rulesVersion:'claimed-v1',contractVersion:'claimed',verification:{valid:true,readOnly:true,scopeIsolation:true}}];game.ranking.defaultMode='normal';},
  ]){
    const entries=structuredClone(catalog);mutate(entries[0]);
    assert.throws(()=>validateCatalog(entries));
    await assert.rejects(buildPortal({entries,revision,outputDir}));
  }
  const entries=structuredClone(catalog);entries[0].thumbnail.variants[0].sha256='c'.repeat(64);
  await assert.rejects(buildPortal({entries,revision,outputDir}),/Image evidence mismatch/);
  const invalidPublication=structuredClone(catalog);invalidPublication[0].publicationEvidence.manifestSha256='d'.repeat(64);
  await assert.rejects(buildPortal({entries:invalidPublication,revision,outputDir}),/Publication evidence mismatch/);
});
