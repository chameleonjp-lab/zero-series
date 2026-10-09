import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {chromium,webkit} from 'playwright';
import {installPortalNetworkGuard,createPortalRequestPolicy} from '../tests/helpers/portal-network.js';

const root=resolve('dist'),out=resolve(process.env.EVIDENCE_DIR||'test-results/candidate');
await mkdir(out,{recursive:true});
const manifest=JSON.parse(await readFile(resolve(root,'deployment.json'),'utf8'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const files=(await readdir(root,{recursive:true,withFileTypes:true})).filter(entry=>entry.isFile()&&entry.name!=='deployment.json').map(entry=>relative(root,resolve(entry.parentPath,entry.name))).sort();
if(JSON.stringify(files)!==JSON.stringify(Object.keys(manifest.assetHashes).sort()))throw new Error('Incomplete deployment hash inventory');
let gzipBytes=0,imageBytes=0;
for(const path of files){
  const bytes=await readFile(resolve(root,path));
  if(hash(bytes)!==manifest.assetHashes[path])throw new Error(`Asset hash mismatch: ${path}`);
  if(/\.(html|css|js)$/.test(path))gzipBytes+=gzipSync(bytes).length;
  if(path.endsWith('.webp'))imageBytes+=bytes.length;
}
const imageAssets=manifest.images.flatMap(image=>image.assets);
const allowed=new Set([...files,'deployment.json']);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.json':'application/json'};
const server=createServer(async(req,res)=>{
  const path=new URL(req.url,'http://127.0.0.1').pathname.slice(1)||'index.html';
  if(req.method!=='GET'||!allowed.has(path)){res.writeHead(404);res.end();return;}
  try{const bytes=await readFile(resolve(root,path));res.writeHead(200,{'Content-Type':types[path.match(/\.[a-z]+$/)?.[0]]||'text/plain','Cache-Control':'no-store','Content-Length':bytes.length});res.end(bytes);}
  catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}/`;
const report={measuredAt:new Date().toISOString(),sourceRevision:manifest.sourceRevision,physicalDevice:false,gzipBytes,imageBytes,assetCount:files.length,rankingConnected:manifest.rankingConnected,visuals:[]};
try{
  for(const [name,type] of [['chromium',chromium],['webkit',webkit]]){
    const browser=await type.launch(name==='webkit'&&process.env.WEBKIT_EXECUTABLE_PATH?{executablePath:process.env.WEBKIT_EXECUTABLE_PATH}:{});
    try{
      for(const [view,viewport,touch] of [['mobile',{width:390,height:844},true],['desktop',{width:1280,height:900},false]]){
        const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:1,locale:'ja-JP',serviceWorkers:'block',reducedMotion:'reduce'});
        try{
          const requests=[],errors=[];
          let blocked;
          if(name==='chromium'&&view==='mobile'){
            // Real browser traffic is needed for CDP throughput/latency. This
            // local server serves only fixed files and never emits redirects.
            // Unknown destinations/methods and all sockets are still blocked.
            blocked=[];
            const permitted=createPortalRequestPolicy(base,{imageAssets});
            await context.route('**/*',async route=>{
              const request=route.request(),record={url:request.url(),method:request.method(),resourceType:request.resourceType()};
              requests.push(record);
              if(!permitted(record)){blocked.push(record);return route.abort('blockedbyclient');}
              return route.continue();
            });
            await context.routeWebSocket('**/*',async socket=>{blocked.push({method:'WEBSOCKET'});await socket.close({code:1008,reason:'Static portal only'});});
          }else blocked=await installPortalNetworkGuard(context,base,{imageAssets,onRequest:request=>requests.push(request)});
          const page=await context.newPage();page.on('pageerror',error=>errors.push(error.name));
          let transferBytes=0;
          if(name==='chromium'&&view==='mobile'){
            const session=await context.newCDPSession(page);
            await session.send('Network.enable');await session.send('Network.setCacheDisabled',{cacheDisabled:true});
            await session.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});
            await session.send('Emulation.setCPUThrottlingRate',{rate:4});
            session.on('Network.loadingFinished',event=>transferBytes+=event.encodedDataLength);
            await page.addInitScript(()=>{
              window.__metrics={lcp:0,cls:0};
              new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__metrics.lcp=entry.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
              new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__metrics.cls+=entry.value;}).observe({type:'layout-shift',buffered:true});
            });
          }
          await page.goto(base);await page.locator('#kaisen [data-image-state="ready"]').waitFor();
          if(name==='chromium'&&view==='mobile'){
            await page.waitForTimeout(1000);
            report.performance={browser:browser.version(),viewport:'390x844 touch emulation',network:'150ms latency, 1.6Mbps download, 750Kbps upload, cache disabled',cpu:'4x slowdown',...await page.evaluate(()=>window.__metrics),transferBytes,requests:requests.length,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)};
          }
          // Full-page captures need the lower, intentionally lazy images too.
          for(const image of await page.locator('[data-thumbnail]').all()){await image.scrollIntoViewIfNeeded();}
          await page.locator('[data-image-state="ready"]').nth(4).waitFor();
          await page.evaluate(()=>scrollTo(0,0));
          const filename=`portal-${name}-${view}.png`;
          await page.screenshot({path:resolve(out,filename),fullPage:true});
          if(blocked.length||errors.length)throw new Error(`Candidate traffic or runtime failure: ${name}/${view}`);
          report.visuals.push({filename,browser:name,version:browser.version(),viewport,sourceRevision:await page.locator('meta[name="source-revision"]').getAttribute('content'),imageCount:await page.locator('[data-image-state="ready"]').count(),blockedRequests:blocked.length,pageErrors:errors.length,sha256:hash(await readFile(resolve(out,filename)))});
        }finally{await context.close();}
      }
    }finally{await browser.close();}
  }
  report.budgets={gzipBytes:{limit:150000,actual:gzipBytes},initialBytes:{limit:500000,actual:report.performance.transferBytes},imagesBytes:{limit:1000000,actual:imageBytes},lcpMs:{limit:2500,actual:report.performance.lcp},cls:{limit:0.1,actual:report.performance.cls}};
  report.budgetPassed=Object.values(report.budgets).every(item=>item.actual<=item.limit)&&report.performance.lcp>0&&!report.performance.overflow;
  await writeFile(resolve(out,'candidate.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({sourceRevision:report.sourceRevision,gzipBytes,imageBytes,...report.performance,budgetPassed:report.budgetPassed,visuals:report.visuals.length}));
  if(!report.budgetPassed)throw new Error('Candidate performance budget failed; inspect candidate.json');
}finally{await new Promise(resolve=>server.close(resolve));}
