import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '/workspace/kaisen/node_modules/playwright/index.mjs';

// Standalone, read-only observer: actual UI/CDP touch, live RAF, no fake clock,
// state setters, renderer changes, world injection, or safety-pause recovery.
const [baseline, candidate, output] = process.argv.slice(2);
assert(baseline && candidate && output, 'baseline candidate output paths required');
const args = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];
const viewport = { width: 402, height: 874 }, origin = { x: 150, y: 520 };
const facts = { generatedAt: new Date().toISOString(), environment: { node: process.version, platform: process.platform,
  arch: process.arch, viewport, deviceScaleFactor: 1, args, headless: true },
  method: '3 repeats per mode/scene/revision; fresh default-seed UI launch; fixed real touch commands; 3-second live window; app frameIntervals p50/p95 nearest-rank; 250ms read-only pose/target probes. No physical-device claim or optimization attribution.',
  commands: { ship: [{turn:0,climb:-.25,ticks:60},{turn:0,climb:0,ticks:12}],
    sea: [{turn:-1,climb:0,ticks:120},{turn:0,climb:0,ticks:12}] }, runs: [] };
const git = (cwd, ...argv) => execFileSync('git', ['-C', cwd, ...argv], { encoding:'utf8' }).trim();
const revisions = [['before', baseline, 4181], ['after', candidate, 4182]].map(([label,cwd,port]) => {
  // Baseline has only a local node_modules symlink to the candidate's installed
  // dependencies. Exclude that exact path, retaining all other clean checks.
  assert.equal(git(cwd,'status','--porcelain','--','.',':(exclude)node_modules'),'','measurement requires clean source');
  return {label,cwd,port,commit:git(cwd,'rev-parse','HEAD'),tree:git(cwd,'rev-parse','HEAD^{tree}'),lockBlob:git(cwd,'rev-parse','HEAD:package-lock.json')};
});
assert.equal(revisions[0].lockBlob,revisions[1].lockBlob,'baseline/current dependency lockfiles differ');
await mkdir(output,{recursive:true});
const browser = await chromium.launch({args}); facts.environment.browser=browser.version();
try {
  for (const revision of revisions) {
    const { label,cwd,port }=revision;
    const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port',String(port),'--strictPort'],{cwd,stdio:'pipe',detached:true});
    let serverOutput='';server.stdout.on('data',b=>serverOutput+=b);server.stderr.on('data',b=>serverOutput+=b);
    try {
      let ready=false;for(let n=0;n<100;n++){try{if((await fetch(`http://127.0.0.1:${port}`)).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
      assert(ready,`${label} server not ready: ${serverOutput}`);
      for(const mode of ['easy','normal']) for(const scene of ['ship','sea']) for(let repeat=1;repeat<=3;repeat++) {
        const run={revision,mode,scene,repeat,status:'in_progress',inputs:[],errors:[],consoleErrors:[]};facts.runs.push(run);
        const page=await browser.newPage({viewport,hasTouch:true,isMobile:true,deviceScaleFactor:1});
        page.on('pageerror',error=>run.errors.push(error.message));page.on('console',message=>{if(message.type()==='error')run.consoleErrors.push(message.text());});
        let cdp;
        try {
          await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.fulfill({status:200,contentType:'application/json',body:'[]'}));
          await page.goto(`http://127.0.0.1:${port}`);await page.locator('#start').waitFor({state:'visible'});
          await page.waitForFunction(()=>!document.querySelector('#start').disabled);
          await page.locator(`input[value="${mode}"]`).check();await page.locator('#start').tap();
          run.seed=await page.evaluate(()=>window.__kaisenReadState('audit').seed);
          cdp=await page.context().newCDPSession(page);
          await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...origin,id:1}]});
          for(const command of facts.commands[scene]) {
            const r=Math.hypot(command.turn,command.climb),scale=r?36*(.08+.92*r)/r:0;
            await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:origin.x+command.turn*scale,y:origin.y-command.climb*scale,id:1}]});
            const start=await page.evaluate(command=>new Promise((resolve,reject)=>{const begun=performance.now();function poll(){const s=window.__kaisenReadState('input');if(s.phase!=='playing')return reject(Error('setup paused'));if(Math.abs(s.controlsInput.turn-command.turn)<1e-5&&Math.abs(s.controlsInput.climb-command.climb)<1e-5)return resolve(s.tick);if(performance.now()-begun>5000)return reject(Error('command not accepted'));requestAnimationFrame(poll);}poll();}),command);
            await page.waitForFunction(target=>{const s=window.__kaisenReadState('clock');return s.phase!=='playing'||s.tick>=target;},start+command.ticks,{polling:'raf',timeout:15000});
            run.inputs.push({...command,acceptedTick:start,end:await page.evaluate(()=>window.__kaisenReadState('input'))});
          }
          run.window=await page.evaluate(async({mode,scene,aspect})=>{
            const {Vector3,Quaternion}=await import('/node_modules/three/build/three.module.js');
            const {projectFlightTarget}=await import('/src/flight-view.ts');
            const probes=[];const snapshot=()=>{
              const s=window.__kaisenReadState(false);const player={...s.player,position:new Vector3(s.player.position.x,s.player.position.y,s.player.position.z),quaternion:new Quaternion().fromArray(s.player.quaternion)};
              const targets=[...s.enemies,...s.ships].filter(t=>t.health>0).map(t=>({id:t.id,kind:t.kind,...projectFlightTarget(player,new Vector3(t.position.x,t.position.y+(t.kind==='ship'?t.height*.4:0),t.position.z),aspect,mode)}));
              return {at:performance.now(),phase:s.phase,tick:s.tick,elapsed:s.elapsed,player:{position:s.player.position,quaternion:s.player.quaternion,pitch:s.player.pitch,speed:s.player.speed},camera:s.render.presentation,queue:s.render.queue,shots:s.stats.shots,pauseReasons:s.pauseReasons,visible:targets.filter(t=>t.visible),inCircle:targets.filter(t=>t.inCircle)};
            };
            const start=window.__kaisenReadState(),begun=performance.now();
            return await new Promise(resolve=>{let last=-Infinity;function poll(){const now=performance.now(),clock=window.__kaisenReadState('clock');if(now-last>=250||clock.phase!=='playing'){probes.push(snapshot());last=now;}if(clock.phase!=='playing'||now-begun>=3000){const end=window.__kaisenReadState();const intervals=end.frameIntervals.slice(start.frameIntervals.length);resolve({durationMs:now-begun,startTick:start.tick,endTick:end.tick,intervals,probes,phase:end.phase,pauseReasons:end.pauseReasons,renderStatus:end.renderStatus});return;}requestAnimationFrame(poll);}poll();});
          },{mode,scene,aspect:viewport.width/viewport.height});
          const w=run.window;
          assert.equal(w.phase,'playing','safety interruption invalidates timing window');
          assert(w.intervals.length>=12,'insufficient frame observations');
          assert(w.probes.every(p=>scene==='sea'?p.visible.length===0:p.visible.some(t=>t.kind==='ship')),'requested sea/ship scene not present throughout probes');
          const sorted=[...w.intervals].sort((a,b)=>a-b),percentile=p=>sorted[Math.max(0,Math.ceil(sorted.length*p)-1)];
          const forward=([x,y,z,w])=>[-2*(x*z+w*y),2*(w*x-y*z),2*(x*x+y*y)-1];
          const angle=(a,b)=>{const u=forward(a),v=forward(b),cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];return Math.atan2(Math.hypot(...cross),u.reduce((sum,x,i)=>sum+x*v[i],0))*180/Math.PI;};
          const first=w.probes[0],last=w.probes.at(-1);
          run.summary={count:sorted.length,p50Ms:percentile(.5),p95Ms:percentile(.95),minMs:sorted[0],maxMs:sorted.at(-1),
            playerDirectionChangeDeg:angle(first.player.quaternion,last.player.quaternion),cameraDirectionChangeDeg:angle(first.camera.cameraQuaternion,last.camera.cameraQuaternion)};
          run.status='measured';
        } catch(error) {run.status='blocked';run.error=error.message;try{run.failureState=await page.evaluate(()=>window.__kaisenReadState());await page.screenshot({path:`${output}/${label}-${mode}-${scene}-${repeat}-blocked.png`});}catch{}}
        finally {if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]}).catch(()=>{});await page.close();await writeFile(`${output}/results.json`,JSON.stringify(facts,null,2));}
        console.log(JSON.stringify({label,mode,scene,repeat,status:run.status,summary:run.summary,error:run.error}));
      }
    } finally {try{process.kill(-server.pid,'SIGTERM');}catch{server.kill();}}
  }
} finally {await browser.close();await writeFile(`${output}/results.json`,JSON.stringify(facts,null,2));}
if(facts.runs.some(r=>r.status!=='measured'))process.exitCode=1;
