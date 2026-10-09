import {createHash} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';

// Read only. Run after the user has merged the reviewed portal candidate.
const sha=process.env.SOURCE_SHA,runId=process.env.PAGES_RUN_ID;
if(!/^[0-9a-f]{40}$/.test(sha||'')||!/^\d+$/.test(runId||''))throw new Error('SOURCE_SHA and successful PAGES_RUN_ID are required');
const base='https://chameleonjp-lab.github.io/zero-series/';
const endpoint=`https://api.github.com/repos/chameleonjp-lab/zero-series/actions/runs/${runId}`;
const get=async(url,cache='no-store')=>{
  const response=await fetch(url,{method:'GET',cache,redirect:'error',credentials:'omit',signal:AbortSignal.timeout(8000),headers:cache==='no-store'?{'Cache-Control':'no-cache'}:{}});
  if(!response.ok)throw new Error(`Read failed: ${response.status} ${new URL(url).pathname}`);
  return Buffer.from(await response.arrayBuffer());
};
const run=JSON.parse(await get(endpoint));
if(run.head_sha!==sha||run.head_branch!=='main'||run.status!=='completed'||run.conclusion!=='success'||run.path!=='.github/workflows/pages.yml')throw new Error('Pages workflow does not match the published main revision');
const jobs=JSON.parse(await get(`${endpoint}/jobs?per_page=100`));
if(!jobs.jobs?.some(job=>job.name==='deploy'&&job.conclusion==='success'))throw new Error('Successful deploy job missing');
const reports=[];
for(const cache of ['no-store','default']){
  const manifest=JSON.parse(await get(base+'deployment.json',cache));
  if(manifest.sourceRevision!==sha||manifest.schemaVersion!==2)throw new Error('Deployment revision/schema mismatch');
  const paths=Object.keys(manifest.assetHashes||{}).sort();
  const staticFiles=['.nojekyll','index.html','src/catalog.js','src/media.js','src/portal.js','src/ranking/adapter.js','src/ranking/reader.js','src/ranking/requests.js','src/ranking/store.js','src/ranking/view.js','src/styles.css'];
  const images=manifest.images?.flatMap(image=>image.assets.map(asset=>asset.src))||[];
  if(images.some(path=>!/^assets\/screenshots\/(kaisen|faitofuraito|machimamore|gekichin|uchiotose|senryou|fantasia|nusumidase)-[0-9a-f]{12}-(640|960)\.webp$/.test(path)))throw new Error('Unapproved image path');
  if(JSON.stringify(paths)!==JSON.stringify([...staticFiles,...images].sort()))throw new Error('Deployment file inventory mismatch');
  let html='';
  for(const path of paths){
    const bytes=await get(base+path,cache),digest=createHash('sha256').update(bytes).digest('hex');
    if(digest!==manifest.assetHashes[path])throw new Error(`Public asset hash mismatch: ${path}`);
    if(path==='index.html')html=bytes.toString('utf8');
  }
  if(!html.includes(`name="source-revision" content="${sha}"`)||(html.match(/data-game="/g)||[]).length!==8)throw new Error('Public HTML revision/card mismatch');
  reports.push({requestCacheHint:cache,sourceRevision:manifest.sourceRevision,assetCount:paths.length,allAssetHashesMatched:true,rankingConnected:manifest.rankingConnected,imageStatus:manifest.imageStatus});
}
const result={checkedAt:new Date().toISOString(),url:base,sourceRevision:sha,pagesRunId:Number(runId),runUrl:run.html_url,deployCompletedAt:jobs.jobs.find(job=>job.name==='deploy').completed_at,reports,method:'TLS GET with two request cache hints and redirects forbidden; Node fetch has no browser cache. No game navigation, ranking requests or writes',browserWarmCacheVerified:false};
const output=resolve(process.env.PUBLICATION_EVIDENCE||'test-results/publication.json');
await mkdir(dirname(output),{recursive:true});await writeFile(output,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
