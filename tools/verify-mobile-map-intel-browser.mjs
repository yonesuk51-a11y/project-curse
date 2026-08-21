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
  check(`${label}:build`,await page.evaluate(()=>window.ProjectCurseBuild?.version)==='5.47.0');
  return {context,page,errors,requests};
}

const desktop=await openSite({width:1440,height:1000},'desktop');
await desktop.page.evaluate(()=>window.ProjectCurseShell.navigate('history',{historyMode:'replace'}));
await desktop.page.waitForFunction(()=>document.body.dataset.route==='history');
await desktop.page.evaluate(()=>window.ProjectCurseWorldHistoryRuntime.open('1975-09-12-amarion'));
await desktop.page.waitForSelector('.pc-world-history-detail:not([hidden])');
const amarion=await desktop.page.evaluate(()=>({
  title:document.querySelector('[data-history-record-title]')?.textContent.trim(),
  mapLinks:document.querySelectorAll('[data-history-map-incident]').length,
  operations:document.querySelectorAll('[data-history-map-operation]').length,
  linked:[...document.querySelectorAll('[data-history-record-links] button')].map(button=>button.textContent.trim())
}));
check('desktop:unmapped-amarion-hidden',amarion.title==='아마리온 설립'&&amarion.mapLinks===0&&amarion.operations===0,JSON.stringify(amarion));

await desktop.page.evaluate(()=>window.ProjectCurseWorldHistoryRuntime.open('1989-08-23-tokyo'));
await desktop.page.waitForFunction(()=>document.querySelector('[data-history-record-title]')?.textContent.trim()==='도쿄 지부 기록');
const tokyoLink=desktop.page.locator('[data-history-map-incident="evt-tokyo-record"]');
check('desktop:mapped-tokyo-visible',await tokyoLink.count()===1&&(await tokyoLink.innerText()).includes('위치'));
await tokyoLink.click();
await desktop.page.waitForFunction(()=>document.body.dataset.route==='map-room');
await desktop.page.waitForSelector('[data-map-marker="tokyo"].is-selected');
const desktopMap=await desktop.page.evaluate(()=>({
  region:window.ProjectCurseMapRoomRuntime.getState().region,
  marker:window.ProjectCurseMapRoomRuntime.getState().marker,
  collapsed:window.ProjectCurseMapRoomRuntime.getState().intelCollapsed,
  toggleDisplay:getComputedStyle(document.querySelector('.pc-map-intel-toggle')).display,
  bodyDisplay:getComputedStyle(document.querySelector('.pc-map-intel-body')).display,
  overflow:document.documentElement.scrollWidth-innerWidth
}));
check('desktop:mapped-handoff-selects-marker',desktopMap.region==='eastasia'&&desktopMap.marker==='tokyo'&&!desktopMap.collapsed,JSON.stringify(desktopMap));
check('desktop:intel-always-visible',desktopMap.toggleDisplay==='none'&&desktopMap.bodyDisplay==='contents',JSON.stringify(desktopMap));
check('desktop:no-overflow',desktopMap.overflow<=0,JSON.stringify(desktopMap));
check('desktop:no-errors',desktop.errors.length===0,desktop.errors.join(' | '));
await desktop.context.close();

const mobile=await openSite({width:390,height:844},'mobile');
await mobile.page.evaluate(()=>window.ProjectCurseShell.navigate('map-room',{historyMode:'replace'}));
await mobile.page.waitForFunction(()=>document.body.dataset.route==='map-room');
await mobile.page.waitForSelector('.pc-map-intel-toggle');
const initial=await mobile.page.evaluate(()=>{
  const panel=document.querySelector('.pc-map-intel-panel');
  const toggle=panel.querySelector('[data-map-intel-toggle]');
  const body=panel.querySelector('.pc-map-intel-body');
  return {collapsed:panel.classList.contains('is-collapsed'),expanded:toggle.getAttribute('aria-expanded'),label:toggle.getAttribute('aria-label'),controls:toggle.getAttribute('aria-controls'),bodyId:body.id,bodyDisplay:getComputedStyle(body).display,height:panel.getBoundingClientRect().height};
});
check('mobile:overview-starts-collapsed',initial.collapsed&&initial.expanded==='false'&&initial.label==='지도 선택 정보 펼치기'&&initial.controls===initial.bodyId&&initial.bodyDisplay==='none'&&initial.height<70,JSON.stringify(initial));

await mobile.page.locator('[data-map-intel-toggle]').click();
await mobile.page.waitForTimeout(180);
const expanded=await mobile.page.evaluate(()=>{
  const panel=document.querySelector('.pc-map-intel-panel');
  return {collapsed:panel.classList.contains('is-collapsed'),expanded:panel.querySelector('[data-map-intel-toggle]').getAttribute('aria-expanded'),bodyDisplay:getComputedStyle(panel.querySelector('.pc-map-intel-body')).display,height:panel.getBoundingClientRect().height};
});
check('mobile:manual-expand',!expanded.collapsed&&expanded.expanded==='true'&&expanded.bodyDisplay==='block'&&expanded.height>initial.height+80,JSON.stringify(expanded));

await mobile.page.reload({waitUntil:'networkidle'});
await mobile.page.waitForSelector('.pc-map-intel-toggle[aria-expanded="true"]');
check('mobile:expand-persists',await mobile.page.locator('.pc-map-intel-panel:not(.is-collapsed)').count()===1);
await mobile.page.locator('[data-map-intel-toggle]').click();
await mobile.page.locator('[data-map-marker="east-overview"]').click();
await mobile.page.waitForSelector('.pc-map-intel-toggle[aria-expanded="true"]');
const markerOpen=await mobile.page.evaluate(()=>({title:document.querySelector('.pc-map-intel-toggle b')?.textContent.trim(),selected:document.querySelector('[data-map-marker].is-selected')?.getAttribute('data-map-marker'),bodyDisplay:getComputedStyle(document.querySelector('.pc-map-intel-body')).display}));
check('mobile:marker-auto-expands',markerOpen.title==='동아시아 감시권'&&markerOpen.selected==='east-overview'&&markerOpen.bodyDisplay==='block',JSON.stringify(markerOpen));

await mobile.page.locator('[data-map-mode="detail"]').click();
await mobile.page.waitForSelector('.pc-map-detail-intel.is-collapsed');
check('mobile:detail-overview-collapsed',await mobile.page.locator('.pc-map-detail-intel [data-map-intel-toggle][aria-expanded="false"]').count()===1);
await mobile.page.locator('[data-map-detail-site]').first().click();
await mobile.page.waitForSelector('.pc-map-detail-intel:not(.is-collapsed)');
check('mobile:detail-site-auto-expands',await mobile.page.locator('.pc-map-detail-intel [data-map-intel-toggle][aria-expanded="true"]').count()===1);

await mobile.page.locator('[data-map-mode="operation"]').click();
await mobile.page.waitForSelector('.pc-map-operation-intel.is-collapsed');
check('mobile:operation-overview-collapsed',await mobile.page.locator('.pc-map-operation-intel [data-map-intel-toggle][aria-expanded="false"]').count()===1);
await mobile.page.locator('[data-map-step="1"]').click();
await mobile.page.waitForSelector('.pc-map-operation-intel:not(.is-collapsed)');
const finalMobile=await mobile.page.evaluate(()=>({
  expanded:document.querySelector('.pc-map-operation-intel [data-map-intel-toggle]')?.getAttribute('aria-expanded'),
  title:document.querySelector('.pc-map-operation-intel [data-map-intel-toggle] b')?.textContent.trim(),
  viewport:innerWidth,
  documentWidth:document.documentElement.scrollWidth
}));
check('mobile:operation-step-auto-expands',finalMobile.expanded==='true'&&finalMobile.title?.includes('T-'),JSON.stringify(finalMobile));
check('mobile:no-overflow',finalMobile.documentWidth<=finalMobile.viewport,JSON.stringify(finalMobile));
check('mobile:no-new-core-audio',!mobile.requests.some(url=>url.includes('/assets/audio/core/')));
const mobileShot=join(tmpdir(),'project-curse-5.47.0-mobile-map-intel.png');
await mobile.page.screenshot({path:mobileShot,fullPage:false});
check('mobile:no-errors',mobile.errors.length===0,mobile.errors.join(' | '));
await mobile.context.close();

await browser.close();
results.forEach(result=>console.log(`${result.pass?'PASS':'FAIL'}  ${result.name}${result.detail?`  ${result.detail}`:''}`));
const failed=results.filter(result=>!result.pass);
console.log(`\n${results.length-failed.length}/${results.length} browser checks passed`);
console.log(`MOBILE_SCREENSHOT ${mobileShot}`);
if(failed.length) process.exitCode=1;
