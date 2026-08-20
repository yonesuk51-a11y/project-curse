#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

const baseUrl=process.env.PC_SITE_URL||'http://127.0.0.1:4173/?boot=skip';
const modulePath=process.env.PC_PLAYWRIGHT_MODULE;
const chromeCandidates=[process.env.PC_CHROME_PATH,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].filter(Boolean);
const executablePath=chromeCandidates.find(existsSync);
if(!modulePath||!existsSync(modulePath)) throw new Error('Set PC_PLAYWRIGHT_MODULE to the absolute path of Playwright index.mjs.');
if(!executablePath) throw new Error('Chrome or Edge executable was not found.');
const {chromium}=await import(pathToFileURL(modulePath).href);
const browser=await chromium.launch({headless:true,executablePath,args:['--autoplay-policy=no-user-gesture-required']});
const results=[];
const check=(name,pass,detail='')=>{results.push({name,pass:Boolean(pass),detail});};

async function boot(viewport,label){
  const context=await browser.newContext({viewport});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(`page: ${error.message}`));
  page.on('console',message=>{if(message.type()==='error') errors.push(`console: ${message.text()}`);});
  await page.goto(baseUrl,{waitUntil:'networkidle'});
  await page.waitForSelector('#app.ready',{timeout:10000});
  check(`${label}:build`,await page.evaluate(()=>window.ProjectCurseBuild?.version)==='5.43.0');
  check(`${label}:no-initial-errors`,errors.length===0,errors.join(' | '));
  return {context,page,errors};
}

const desktop=await boot({width:1440,height:1000},'desktop');
await desktop.page.locator('.pc-preference-trigger').click();
await desktop.page.waitForSelector('.pc-preference-panel.is-open');
check('desktop:dialog-visible',await desktop.page.locator('.pc-preference-dialog').isVisible());
await desktop.page.locator('.pc-sound-lab>summary').click();
check('desktop:twelve-previews',await desktop.page.locator('[data-pc-sound-preview]').count()===12);
check('desktop:five-mixers',await desktop.page.locator('[data-pc-audio-bus]').count()===5);
const profileText=await desktop.page.locator('[data-pc-sound-profile]').textContent();
check('desktop:terminal-profile',profileText?.includes('CRT RELAY'),profileText||'');
const master=desktop.page.locator('[data-pc-audio-bus="master"]');
await master.fill('73');
const mixState=await desktop.page.evaluate(()=>({control:window.ProjectCurseAudioControl?.getState?.().master,stored:JSON.parse(localStorage.getItem('project_curse_preferences_v1')||'{}')?.audioVolumes?.master}));
check('desktop:mixer-runtime',Math.abs(mixState.control-.73)<.001,JSON.stringify(mixState));
check('desktop:mixer-persistence',Math.abs(mixState.stored-.73)<.001,JSON.stringify(mixState));
await desktop.page.locator('[data-pc-sound-preview="menu.select"]').click();
await desktop.page.waitForTimeout(180);
const previewState=await desktop.page.evaluate(()=>window.ProjectCurseAudioControl?.getDiagnostics?.());
check('desktop:preview-semantic',previewState?.lastPlayed==='preview'&&previewState?.lastSound==='menu.select'&&!previewState?.blocked,JSON.stringify(previewState));
const sharedNodeState=await desktop.page.evaluate(()=>{
  window.ProjectCurseAudioControl.play('record.page');
  window.ProjectCurseAudioControl.play('menu.select');
  return window.ProjectCurseAudioControl.getDiagnostics();
});
check('desktop:shared-cue-bus-cleanup',sharedNodeState.activeBuses.length===1&&sharedNodeState.activeBuses[0]==='interface',JSON.stringify(sharedNodeState));
const decoded=await desktop.page.evaluate(async()=>{
  const context=new AudioContext();
  const rows=[];
  for(const [id,item] of Object.entries(window.ProjectCurseAudioManifest.sounds)){
    const response=await fetch(item.src);
    const audio=await context.decodeAudioData(await response.arrayBuffer());
    const data=audio.getChannelData(0);
    let peak=0,energy=0;
    for(let index=0;index<data.length;index++){const value=Math.abs(data[index]);peak=Math.max(peak,value);energy+=value*value;}
    rows.push({id,channels:audio.numberOfChannels,sampleRate:audio.sampleRate,duration:audio.duration,peak,rms:Math.sqrt(energy/data.length)});
  }
  await context.close();
  return rows;
});
check('desktop:decode-all',decoded.length===12&&decoded.every(row=>row.channels===1&&row.sampleRate===48000&&row.duration>.08&&row.peak>.6&&row.peak<.8&&row.rms>.015),JSON.stringify(decoded));
await desktop.page.locator('[data-pc-preferences-close]').last().click();
await desktop.page.waitForSelector('.pc-preference-panel',{state:'hidden'});
await desktop.page.evaluate(()=>window.ProjectCurseShell.navigate('map-room',{historyMode:'replace'}));
await desktop.page.waitForFunction(()=>document.body.dataset.route==='map-room'&&window.ProjectCurseAudioControl?.getDiagnostics?.().profile==='map-room');
const routeAudio=await desktop.page.evaluate(()=>window.ProjectCurseAudioControl.getDiagnostics());
check('desktop:route-identity',routeAudio.identity==='GRID PULSE',JSON.stringify(routeAudio));
const desktopOverflow=await desktop.page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
check('desktop:no-horizontal-overflow',desktopOverflow.document<=desktopOverflow.viewport,JSON.stringify(desktopOverflow));
const desktopShot=join(tmpdir(),'project-curse-5.43-sound-lab-desktop.png');
await desktop.page.locator('.pc-preference-trigger').click();
if(!await desktop.page.locator('.pc-sound-lab').evaluate(node=>node.open)) await desktop.page.locator('.pc-sound-lab>summary').click();
await desktop.page.waitForTimeout(260);
await desktop.page.screenshot({path:desktopShot,fullPage:false});
check('desktop:no-final-errors',desktop.errors.length===0,desktop.errors.join(' | '));
await desktop.context.close();

const mobile=await boot({width:390,height:844},'mobile');
await mobile.page.locator('.uac-shell-switch').click();
await mobile.page.locator('.pc-mobile-preference-link').click();
await mobile.page.locator('.pc-sound-lab>summary').click();
const mobileLayout=await mobile.page.evaluate(()=>{
  const dialog=document.querySelector('.pc-preference-dialog');
  const grid=document.querySelector('.pc-sound-grid');
  return {viewport:innerWidth,document:document.documentElement.scrollWidth,dialog:dialog?.scrollWidth,columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,previews:document.querySelectorAll('[data-pc-sound-preview]').length};
});
check('mobile:two-column-lab',mobileLayout.columns===2&&mobileLayout.previews===12,JSON.stringify(mobileLayout));
check('mobile:no-horizontal-overflow',mobileLayout.document<=mobileLayout.viewport&&mobileLayout.dialog<=mobileLayout.viewport,JSON.stringify(mobileLayout));
await mobile.page.locator('[data-pc-sound-preview="access.denied"]').focus();
await mobile.page.keyboard.press('Enter');
await mobile.page.waitForTimeout(180);
const mobilePreview=await mobile.page.evaluate(()=>window.ProjectCurseAudioControl?.getDiagnostics?.());
check('mobile:keyboard-preview',mobilePreview?.lastSound==='access.denied'&&!mobilePreview?.blocked,JSON.stringify(mobilePreview));
const mobileShot=join(tmpdir(),'project-curse-5.43-sound-lab-mobile.png');
await mobile.page.waitForTimeout(260);
await mobile.page.screenshot({path:mobileShot,fullPage:false});
check('mobile:no-final-errors',mobile.errors.length===0,mobile.errors.join(' | '));
await mobile.context.close();
await browser.close();

results.forEach(result=>console.log(`${result.pass?'PASS':'FAIL'}  ${result.name}${result.detail?`  ${result.detail}`:''}`));
const failed=results.filter(result=>!result.pass);
console.log(`\n${results.length-failed.length}/${results.length} browser checks passed`);
console.log(`DESKTOP_SCREENSHOT ${desktopShot}`);
console.log(`MOBILE_SCREENSHOT ${mobileShot}`);
if(failed.length) process.exitCode=1;
