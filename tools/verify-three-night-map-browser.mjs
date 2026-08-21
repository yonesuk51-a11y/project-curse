#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

const baseUrl=process.env.PC_SITE_URL||'http://127.0.0.1:4173/?boot=skip';
const modulePath=process.env.PC_PLAYWRIGHT_MODULE;
const browserCandidates=[
  process.env.PC_CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
].filter(Boolean);
const executablePath=browserCandidates.find(existsSync);
if(!modulePath||!existsSync(modulePath)) throw new Error('Set PC_PLAYWRIGHT_MODULE to the absolute path of Playwright index.mjs.');
if(!executablePath) throw new Error('Chrome or Edge executable was not found.');

const {chromium}=await import(pathToFileURL(modulePath).href);
const browser=await chromium.launch({headless:true,executablePath});
const results=[];
const check=(name,pass,detail='')=>results.push({name,pass:Boolean(pass),detail});

async function openMap(viewport,label){
  const context=await browser.newContext({viewport});
  const page=await context.newPage();
  const errors=[];
  const requests=[];
  page.on('pageerror',error=>errors.push(`page: ${error.message}`));
  page.on('console',message=>{if(message.type()==='error') errors.push(`console: ${message.text()}`);});
  page.on('request',request=>requests.push(request.url()));
  await page.goto(baseUrl,{waitUntil:'networkidle'});
  await page.waitForSelector('#app.ready',{timeout:12000});
  check(`${label}:build`,await page.evaluate(()=>window.ProjectCurseBuild?.version)==='5.48.1');
  await page.evaluate(()=>window.ProjectCurseShell.navigate('map-room',{historyMode:'replace'}));
  await page.waitForFunction(()=>document.body.dataset.route==='map-room');
  await page.waitForSelector('[data-synchrony-event="three-night-silence"]');
  check(`${label}:no-initial-errors`,errors.length===0,errors.join(' | '));
  return {context,page,errors,requests};
}

const desktop=await openMap({width:1440,height:1000},'desktop');
const world=await desktop.page.evaluate(()=>(
  {
    points:document.querySelectorAll('[data-map-synchrony-point]').length,
    castles:document.querySelectorAll('.pc-map-synchrony-point--castle').length,
    checkpoints:document.querySelectorAll('.pc-map-synchrony-point--checkpoint').length,
    connectingShapes:document.querySelectorAll('.pc-map-synchrony polyline,.pc-map-synchrony path,.pc-map-synchrony line').length,
    sidebarControl:document.querySelector('.pc-map-layers [data-map-layer="synchrony"]')?.textContent.replace(/\s+/g,' ').trim(),
    mobileDisplay:getComputedStyle(document.querySelector('.pc-map-mobile-layerbar')).display,
    runtime:typeof window.ProjectCurseMapRoomRuntime?.showSynchrony,
    viewport:innerWidth,
    documentWidth:document.documentElement.scrollWidth
  }
));
check('desktop:ten-isolated-points',world.points===10&&world.castles===6&&world.checkpoints===4,JSON.stringify(world));
check('desktop:no-connecting-shapes',world.connectingShapes===0,JSON.stringify(world));
check('desktop:layer-control',world.sidebarControl==='2042 동시 무응답10'&&world.mobileDisplay==='none',JSON.stringify(world));
check('desktop:runtime-api',world.runtime==='function',JSON.stringify(world));
check('desktop:no-world-overflow',world.documentWidth<=world.viewport,JSON.stringify(world));

await desktop.page.locator('[data-map-synchrony-point="gbf-bell-03"]').click();
await desktop.page.waitForSelector('[data-map-synchrony-point="gbf-bell-03"].is-selected');
const gbfIntel=await desktop.page.evaluate(()=>(
  {
    title:document.querySelector('.pc-map-intel h3')?.textContent.trim(),
    lead:document.querySelector('.pc-map-intel-body>p')?.textContent.replace(/\s+/g,' ').trim(),
    facts:[...document.querySelectorAll('.pc-map-intel .pc-map-facts>div')].map(node=>node.textContent.replace(/\s+/g,' ').trim()),
    boundary:document.querySelector('.pc-map-synchrony-boundary')?.textContent.replace(/\s+/g,' ').trim(),
    summary:document.querySelector('.pc-map-synchrony-summary')?.textContent.replace(/\s+/g,' ').trim(),
    historyAction:document.querySelector('[data-map-open-history="2042-10-31-three-night-silence"]')?.textContent.trim()
  }
));
check('desktop:gbf-signal-intel',gbfIntel.title==='삼야 무응답'&&gbfIntel.lead.includes('성채 종 장부 03')&&gbfIntel.facts.some(line=>line.includes('DZ-RETURN-04')),JSON.stringify(gbfIntel));
check('desktop:canon-boundary-visible',gbfIntel.boundary?.includes('NO ROUTE / NO GEOGRAPHIC LINK')&&gbfIntel.boundary.includes('통로·항로·지리적 연결'),JSON.stringify(gbfIntel));
check('desktop:event-summary-visible',gbfIntel.summary?.includes('06GBF CASTLES')&&gbfIntel.summary.includes('04DZ CHECKPOINTS')&&gbfIntel.historyAction==='세계 기록에서 삼야 무응답 열기',JSON.stringify(gbfIntel));

await desktop.page.locator('[data-map-open-history="2042-10-31-three-night-silence"]').click();
await desktop.page.waitForFunction(()=>document.body.dataset.route==='history');
await desktop.page.waitForSelector('.pc-world-history-detail:not([hidden])');
const linkedHistory=await desktop.page.evaluate(()=>(
  {
    title:document.querySelector('[data-history-record-title]')?.textContent.trim(),
    evidence:document.querySelector('[data-history-record-evidence]')?.textContent.trim()
  }
));
check('desktop:history-crosslink',linkedHistory.title==='삼야 무응답'&&linkedHistory.evidence==='현장 관측',JSON.stringify(linkedHistory));

await desktop.page.evaluate(async()=>{
  window.ProjectCurseMapRoomRuntime.showSynchrony('three-night-silence','dz-check-c');
  await window.ProjectCurseShell.navigate('map-room',{historyMode:'replace'});
});
await desktop.page.waitForFunction(()=>document.body.dataset.route==='map-room');
await desktop.page.waitForSelector('[data-map-synchrony-point="dz-check-c"].is-selected');
const deadZone=await desktop.page.evaluate(()=>(
  {
    region:window.ProjectCurseMapRoomRuntime.getState().region,
    points:document.querySelectorAll('[data-map-synchrony-point]').length,
    selected:document.querySelector('[data-map-synchrony-point].is-selected')?.dataset.mapSynchronyPoint,
    callsign:[...document.querySelectorAll('.pc-map-facts dd')].map(node=>node.textContent.trim()).find(text=>text.startsWith('GBF-'))
  }
));
check('desktop:deadzone-four-filter',deadZone.region==='northamerica'&&deadZone.points===4&&deadZone.selected==='dz-check-c'&&deadZone.callsign==='GBF-BELL-06',JSON.stringify(deadZone));

await desktop.page.locator('.pc-map-layers [data-map-layer="synchrony"]').click();
check('desktop:layer-off',await desktop.page.locator('[data-map-synchrony-point]').count()===0);
await desktop.page.locator('.pc-map-layers [data-map-layer="synchrony"]').click();
check('desktop:layer-on',await desktop.page.locator('[data-map-synchrony-point]').count()===4);
await desktop.page.locator('[data-map-region="southamerica"]').click();
check('desktop:gbf-six-filter',await desktop.page.locator('[data-map-synchrony-point]').count()===6);
await desktop.page.locator('[data-map-synchrony-point="gbf-bell-03"]').click();
await desktop.page.waitForSelector('[data-map-synchrony-point="gbf-bell-03"].is-selected');
check('desktop:no-generated-core-audio-requests',!desktop.requests.some(url=>url.includes('/assets/audio/core/')),desktop.requests.filter(url=>url.includes('/assets/audio/')).join(' | '));
const desktopShot=join(tmpdir(),'project-curse-5.48.1-synchrony-map-desktop.png');
await desktop.page.screenshot({path:desktopShot,fullPage:false});
check('desktop:no-final-errors',desktop.errors.length===0,desktop.errors.join(' | '));
await desktop.context.close();

const mobile=await openMap({width:390,height:844},'mobile');
const mobileInitial=await mobile.page.evaluate(()=>(
  {
    points:document.querySelectorAll('[data-map-synchrony-point]').length,
    barDisplay:getComputedStyle(document.querySelector('.pc-map-mobile-layerbar')).display,
    buttons:document.querySelectorAll('.pc-map-mobile-layerbar [data-map-layer]').length,
    synchronyLabel:document.querySelector('.pc-map-mobile-synchrony')?.textContent.replace(/\s+/g,' ').trim(),
    sidebarDisplay:getComputedStyle(document.querySelector('.pc-map-layers')).display,
    viewport:innerWidth,
    documentWidth:document.documentElement.scrollWidth
  }
));
check('mobile:ten-world-points',mobileInitial.points===10,JSON.stringify(mobileInitial));
check('mobile:layerbar-visible',mobileInitial.barDisplay==='flex'&&mobileInitial.buttons===5&&mobileInitial.synchronyLabel==='2042 신호 10'&&mobileInitial.sidebarDisplay==='none',JSON.stringify(mobileInitial));
check('mobile:no-world-overflow',mobileInitial.documentWidth<=mobileInitial.viewport,JSON.stringify(mobileInitial));

await mobile.page.locator('.pc-map-mobile-synchrony').click();
check('mobile:layer-off',await mobile.page.locator('[data-map-synchrony-point]').count()===0);
await mobile.page.locator('.pc-map-mobile-synchrony').click();
check('mobile:layer-on',await mobile.page.locator('[data-map-synchrony-point]').count()===10);
await mobile.page.locator('[data-map-synchrony-point="dz-check-a"]').click();
await mobile.page.waitForSelector('[data-map-synchrony-point="dz-check-a"].is-selected');
const mobileIntel=await mobile.page.evaluate(()=>(
  {
    title:document.querySelector('.pc-map-intel h3')?.textContent.trim(),
    boundary:document.querySelector('.pc-map-synchrony-boundary')?.textContent.replace(/\s+/g,' ').trim(),
    viewport:innerWidth,
    documentWidth:document.documentElement.scrollWidth,
    shellWidth:document.querySelector('.uac-shell-content')?.scrollWidth
  }
));
check('mobile:signal-intel',mobileIntel.title==='삼야 무응답'&&mobileIntel.boundary?.includes('NO ROUTE / NO GEOGRAPHIC LINK'),JSON.stringify(mobileIntel));
check('mobile:no-detail-overflow',mobileIntel.documentWidth<=mobileIntel.viewport&&mobileIntel.shellWidth<=mobileIntel.viewport,JSON.stringify(mobileIntel));
check('mobile:no-generated-core-audio-requests',!mobile.requests.some(url=>url.includes('/assets/audio/core/')),mobile.requests.filter(url=>url.includes('/assets/audio/')).join(' | '));
await mobile.page.locator('.pc-map-intel').scrollIntoViewIfNeeded();
const mobileShot=join(tmpdir(),'project-curse-5.48.1-synchrony-map-mobile.png');
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
