#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

const baseUrl=process.env.PC_SITE_URL||'http://127.0.0.1:4173/?boot=skip';
const modulePath=process.env.PC_PLAYWRIGHT_MODULE;
const executablePath=[process.env.PC_CHROME_PATH,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].filter(Boolean).find(existsSync);
if(!modulePath||!existsSync(modulePath)) throw new Error('Set PC_PLAYWRIGHT_MODULE to the absolute path of Playwright index.mjs.');
if(!executablePath) throw new Error('Chrome or Edge executable was not found.');

const {chromium}=await import(pathToFileURL(modulePath).href);
const browser=await chromium.launch({headless:true,executablePath});
const results=[];
const check=(name,pass,detail='')=>results.push({name,pass:Boolean(pass),detail});

async function openSite(viewport,label){
  const context=await browser.newContext({viewport});
  const page=await context.newPage();
  const errors=[];
  const requests=[];
  page.on('pageerror',error=>errors.push(`page: ${error.message}`));
  page.on('console',message=>{if(message.type()==='error') errors.push(`console: ${message.text()}`);});
  page.on('request',request=>requests.push(request.url()));
  await page.goto(baseUrl,{waitUntil:'networkidle'});
  await page.waitForSelector('#app.ready',{timeout:12000});
  await page.evaluate(()=>{
    sessionStorage.removeItem('project_curse_channel_density_v1');
    sessionStorage.removeItem('project_curse_map_session_v1');
  });
  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#app.ready',{timeout:12000});
  check(`${label}:build`,await page.evaluate(()=>window.ProjectCurseBuild?.version)==='5.48.1');
  return {context,page,errors,requests};
}

async function goToMap(target,label){
  await target.page.evaluate(()=>window.ProjectCurseShell.navigate('map-room',{historyMode:'replace'}));
  await target.page.waitForFunction(()=>document.body.dataset.route==='map-room');
  await target.page.waitForSelector('#map-room>.pc-channel-identity');
  const first=await target.page.evaluate(()=>{
    const page=document.getElementById('map-room');
    const header=page.querySelector(':scope>.pc-channel-identity');
    return {compact:page.classList.contains('pc-channel-compact'),height:header.getBoundingClientRect().height,expanded:header.querySelector('[data-channel-density-toggle]').getAttribute('aria-expanded')};
  });
  check(`${label}:initial-expanded`,!first.compact&&first.expanded==='true',JSON.stringify(first));
  await target.page.waitForTimeout(2050);
  const compact=await target.page.evaluate(()=>{
    const page=document.getElementById('map-room');
    const header=page.querySelector(':scope>.pc-channel-identity');
    return {compact:page.classList.contains('pc-channel-compact'),height:header.getBoundingClientRect().height,expanded:header.querySelector('[data-channel-density-toggle]').getAttribute('aria-expanded')};
  });
  check(`${label}:automatic-compact`,compact.compact&&compact.expanded==='false'&&compact.height<first.height*.65,JSON.stringify({first,compact}));
  return {first,compact};
}

const desktop=await openSite({width:1440,height:1000},'desktop');
await goToMap(desktop,'desktop');
await desktop.page.locator('#map-room [data-channel-density-toggle]').click();
await desktop.page.waitForTimeout(650);
const manualExpanded=await desktop.page.evaluate(()=>({
  expanded:document.querySelector('#map-room [data-channel-density-toggle]')?.getAttribute('aria-expanded'),
  height:document.querySelector('#map-room>.pc-channel-identity')?.getBoundingClientRect().height
}));
check('desktop:manual-expand',manualExpanded.expanded==='true'&&manualExpanded.height>100,JSON.stringify(manualExpanded));

await desktop.page.evaluate(()=>window.ProjectCurseShell.navigate('history',{historyMode:'replace'}));
await desktop.page.waitForFunction(()=>document.body.dataset.route==='history');
await desktop.page.evaluate(()=>window.ProjectCurseWorldHistoryRuntime.open('2042-10-31-three-night-silence'));
await desktop.page.waitForSelector('.pc-world-history-detail:not([hidden])');
const reverseLink=desktop.page.locator('[data-history-map-synchrony="three-night-silence"]');
check('desktop:history-reverse-link',await reverseLink.count()===1&&(await reverseLink.innerText()).includes('10개 신호'));
await reverseLink.click();
await desktop.page.waitForFunction(()=>document.body.dataset.route==='map-room');
await desktop.page.waitForSelector('[data-map-synchrony-point]');
const handoff=await desktop.page.evaluate(()=>({
  region:window.ProjectCurseMapRoomRuntime.getState().region,
  selected:window.ProjectCurseMapRoomRuntime.getState().synchronyPoint,
  layer:window.ProjectCurseMapRoomRuntime.getState().layers.synchrony,
  points:document.querySelectorAll('[data-map-synchrony-point]').length,
  expanded:document.querySelector('#map-room [data-channel-density-toggle]')?.getAttribute('aria-expanded')
}));
check('desktop:history-map-handoff',handoff.region==='world'&&!handoff.selected&&handoff.layer&&handoff.points===10,JSON.stringify(handoff));
check('desktop:manual-density-persists',handoff.expanded==='true',JSON.stringify(handoff));

await desktop.page.locator('[data-map-region="southamerica"]').click();
await desktop.page.locator('[data-map-synchrony-point="gbf-bell-03"]').click();
await desktop.page.reload({waitUntil:'networkidle'});
await desktop.page.waitForSelector('[data-map-synchrony-point="gbf-bell-03"].is-selected');
const restored=await desktop.page.evaluate(()=>({
  route:document.body.dataset.route,
  region:window.ProjectCurseMapRoomRuntime.getState().region,
  selected:window.ProjectCurseMapRoomRuntime.getState().synchronyPoint,
  points:document.querySelectorAll('[data-map-synchrony-point]').length,
  expanded:document.querySelector('#map-room [data-channel-density-toggle]')?.getAttribute('aria-expanded'),
  overflow:document.documentElement.scrollWidth-innerWidth
}));
check('desktop:map-session-restored',restored.route==='map-room'&&restored.region==='southamerica'&&restored.selected==='gbf-bell-03'&&restored.points===6,JSON.stringify(restored));
check('desktop:no-overflow',restored.overflow<=0,JSON.stringify(restored));
check('desktop:no-new-core-audio',!desktop.requests.some(url=>url.includes('/assets/audio/core/')));
const desktopShot=join(tmpdir(),'project-curse-5.48.1-history-map-density-desktop.png');
await desktop.page.screenshot({path:desktopShot,fullPage:false});
check('desktop:no-errors',desktop.errors.length===0,desktop.errors.join(' | '));
await desktop.context.close();

const mobile=await openSite({width:390,height:844},'mobile');
const mobileDensity=await goToMap(mobile,'mobile');
const mobileState=await mobile.page.evaluate(()=>({
  viewport:innerWidth,
  documentWidth:document.documentElement.scrollWidth,
  headerText:document.querySelector('#map-room>.pc-channel-identity')?.innerText.replace(/\s+/g,' ').trim(),
  title:document.querySelector('#map-room>.pc-channel-identity [data-screen-heading]')?.textContent.trim(),
  metricDisplay:getComputedStyle(document.querySelector('#map-room>.pc-channel-identity>dl')).display
}));
check('mobile:compact-working-height',mobileDensity.compact.height<70,JSON.stringify(mobileDensity));
check('mobile:compact-priority',mobileState.title==='상황 관제'&&mobileState.metricDisplay==='none',JSON.stringify(mobileState));
check('mobile:no-overflow',mobileState.documentWidth<=mobileState.viewport,JSON.stringify(mobileState));
check('mobile:no-new-core-audio',!mobile.requests.some(url=>url.includes('/assets/audio/core/')));
const mobileShot=join(tmpdir(),'project-curse-5.48.1-history-map-density-mobile.png');
await mobile.page.screenshot({path:mobileShot,fullPage:false});
check('mobile:no-errors',mobile.errors.length===0,mobile.errors.join(' | '));
await mobile.context.close();

await browser.close();
results.forEach(result=>console.log(`${result.pass?'PASS':'FAIL'}  ${result.name}${result.detail?`  ${result.detail}`:''}`));
const failed=results.filter(result=>!result.pass);
console.log(`\n${results.length-failed.length}/${results.length} browser checks passed`);
console.log(`DESKTOP_SCREENSHOT ${desktopShot}`);
console.log(`MOBILE_SCREENSHOT ${mobileShot}`);
if(failed.length) process.exitCode=1;
