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
const urlForHash=hash=>{const target=new URL(baseUrl);target.hash=hash;return target.href;};

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
  check(`${label}:build`,await page.evaluate(()=>window.ProjectCurseBuild?.version)==='5.54.0');
  return {context,page,errors,requests};
}

async function openDeepLink(viewport,label,hash){
  const context=await browser.newContext({viewport});
  const page=await context.newPage();
  const errors=[];
  const requests=[];
  page.on('pageerror',error=>errors.push(`page: ${error.message}`));
  page.on('console',message=>{if(message.type()==='error') errors.push(`console: ${message.text()}`);});
  page.on('request',request=>requests.push(request.url()));
  await page.goto(urlForHash(hash),{waitUntil:'networkidle'});
  await page.waitForSelector('#app.ready',{timeout:12000});
  check(`${label}:build`,await page.evaluate(()=>window.ProjectCurseBuild?.version)==='5.54.0');
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
  hash:location.hash,
  collapsed:window.ProjectCurseMapRoomRuntime.getState().intelCollapsed,
  toggleDisplay:getComputedStyle(document.querySelector('.pc-map-intel-toggle')).display,
  bodyDisplay:getComputedStyle(document.querySelector('.pc-map-intel-body')).display,
  overflow:document.documentElement.scrollWidth-innerWidth
}));
check('desktop:mapped-handoff-selects-marker',desktopMap.region==='eastasia'&&desktopMap.marker==='tokyo'&&!desktopMap.collapsed&&desktopMap.hash==='#map-room/region/eastasia/marker/tokyo',JSON.stringify(desktopMap));
check('desktop:intel-always-visible',desktopMap.toggleDisplay==='none'&&desktopMap.bodyDisplay==='contents',JSON.stringify(desktopMap));
check('desktop:no-overflow',desktopMap.overflow<=0,JSON.stringify(desktopMap));
check('desktop:no-errors',desktop.errors.length===0,desktop.errors.join(' | '));
await desktop.context.close();

const mobile=await openSite({width:390,height:844},'mobile');
await mobile.page.evaluate(()=>window.ProjectCurseShell.navigate('map-room',{historyMode:'replace'}));
await mobile.page.waitForFunction(()=>document.body.dataset.route==='map-room');
await mobile.page.locator('[data-map-theater="world"]').click();
await mobile.page.waitForSelector('.pc-map-intel-toggle');
const initial=await mobile.page.evaluate(()=>{
  const panel=document.querySelector('.pc-map-intel-panel');
  const toggle=panel.querySelector('[data-map-intel-toggle]');
  const body=panel.querySelector('.pc-map-intel-body');
  return {hash:location.hash,collapsed:panel.classList.contains('is-collapsed'),expanded:toggle.getAttribute('aria-expanded'),label:toggle.getAttribute('aria-label'),controls:toggle.getAttribute('aria-controls'),bodyId:body.id,bodyDisplay:getComputedStyle(body).display,height:panel.getBoundingClientRect().height};
});
check('mobile:overview-starts-collapsed',initial.collapsed&&initial.expanded==='false'&&initial.label==='지도 선택 정보 펼치기'&&initial.controls===initial.bodyId&&initial.bodyDisplay==='none'&&initial.height<70,JSON.stringify(initial));
check('mobile:world-location-hash',initial.hash==='#map-room/region/world',initial.hash);

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
const markerOpen=await mobile.page.evaluate(()=>({hash:location.hash,title:document.querySelector('.pc-map-intel-toggle b')?.textContent.trim(),selected:document.querySelector('[data-map-marker].is-selected')?.getAttribute('data-map-marker'),bodyDisplay:getComputedStyle(document.querySelector('.pc-map-intel-body')).display}));
check('mobile:marker-auto-expands',markerOpen.title==='동아시아 감시권'&&markerOpen.selected==='east-overview'&&markerOpen.bodyDisplay==='block'&&markerOpen.hash==='#map-room/region/world/marker/east-overview',JSON.stringify(markerOpen));

await mobile.page.locator('[data-map-mode="detail"]').click();
await mobile.page.waitForSelector('.pc-map-detail-intel.is-collapsed');
check('mobile:detail-overview-collapsed',await mobile.page.locator('.pc-map-detail-intel [data-map-intel-toggle][aria-expanded="false"]').count()===1);
const detailDirectory=await mobile.page.evaluate(()=>(
  {
    briefDisplay:getComputedStyle(document.querySelector('.pc-map-mobile-brief-entry')).display,
    directoryDisplay:getComputedStyle(document.querySelector('.pc-map-mobile-site-index')).display,
    buttons:[...document.querySelectorAll('.pc-map-mobile-site')].map(button=>button.getBoundingClientRect().height),
    hash:location.hash,
    viewport:innerWidth,
    documentWidth:document.documentElement.scrollWidth
  }
));
check('mobile:detail-brief-entry-visible',detailDirectory.briefDisplay!=='none',JSON.stringify(detailDirectory));
check('mobile:detail-directory-visible',detailDirectory.directoryDisplay!=='none'&&detailDirectory.buttons.length===9&&detailDirectory.buttons.every(height=>height>=44),JSON.stringify(detailDirectory));
check('mobile:detail-directory-no-overflow',detailDirectory.documentWidth<=detailDirectory.viewport,JSON.stringify(detailDirectory));
check('mobile:detail-location-hash',detailDirectory.hash==='#map-room/detail/eastasia-northern-front',detailDirectory.hash);
const detailDirectoryShot=join(tmpdir(),'project-curse-5.54.0-mobile-detail-directory.png');
await mobile.page.locator('.pc-map-mobile-site-index').screenshot({path:detailDirectoryShot});
const detailBriefShot=join(tmpdir(),'project-curse-5.54.0-mobile-detail-brief.png');
await mobile.page.locator('.pc-map-mobile-brief-entry').screenshot({path:detailBriefShot});
await mobile.page.locator('[data-map-detail-brief]').click();
await mobile.page.waitForSelector('.pc-map-detail-intel:not(.is-collapsed)');
const briefOpen=await mobile.page.evaluate(()=>(
  {
    selected:window.ProjectCurseMapRoomRuntime.getState().detailSite,
    hash:location.hash,
    expanded:document.querySelector('.pc-map-detail-intel [data-map-intel-toggle]')?.getAttribute('aria-expanded'),
    visualHeight:document.querySelector('.pc-map-visual-brief')?.getBoundingClientRect().height||0,
    signalHeight:document.querySelector('.pc-map-signal-brief')?.getBoundingClientRect().height||0,
    focused:document.activeElement?.hasAttribute('data-map-detail-intel-heading')||false
 }
));
check('mobile:brief-entry-opens-intel',briefOpen.selected==='north-distributed-nodes'&&briefOpen.hash==='#map-room/detail/eastasia-northern-front/north-distributed-nodes'&&briefOpen.expanded==='true'&&briefOpen.visualHeight>0&&briefOpen.signalHeight>0&&briefOpen.focused,JSON.stringify(briefOpen));
await mobile.page.locator('.pc-map-mobile-site').first().click();
await mobile.page.waitForSelector('.pc-map-detail-intel:not(.is-collapsed)');
const siteOpen=await mobile.page.evaluate(()=>(
  {
    selected:window.ProjectCurseMapRoomRuntime.getState().detailSite,
    hash:location.hash,
    expanded:document.querySelector('.pc-map-detail-intel [data-map-intel-toggle]')?.getAttribute('aria-expanded'),
    focused:document.activeElement?.hasAttribute('data-map-detail-intel-heading')||false
 }
));
check('mobile:detail-site-auto-expands',siteOpen.selected==='north-tokyo-branch'&&siteOpen.hash==='#map-room/detail/eastasia-northern-front/north-tokyo-branch'&&siteOpen.expanded==='true'&&siteOpen.focused,JSON.stringify(siteOpen));

await mobile.page.evaluate(()=>history.back());
await mobile.page.waitForFunction(()=>window.ProjectCurseMapRoomRuntime.getState().detailSite==='north-distributed-nodes');
const backState=await mobile.page.evaluate(()=>({site:window.ProjectCurseMapRoomRuntime.getState().detailSite,hash:location.hash}));
check('mobile:history-back-restores-map-site',backState.site==='north-distributed-nodes'&&backState.hash==='#map-room/detail/eastasia-northern-front/north-distributed-nodes',JSON.stringify(backState));
await mobile.page.evaluate(()=>history.forward());
await mobile.page.waitForFunction(()=>window.ProjectCurseMapRoomRuntime.getState().detailSite==='north-tokyo-branch');
const forwardState=await mobile.page.evaluate(()=>({site:window.ProjectCurseMapRoomRuntime.getState().detailSite,hash:location.hash}));
check('mobile:history-forward-restores-map-site',forwardState.site==='north-tokyo-branch'&&forwardState.hash==='#map-room/detail/eastasia-northern-front/north-tokyo-branch',JSON.stringify(forwardState));

await mobile.page.locator('[data-map-detail].is-active').focus();
await mobile.page.keyboard.press('End');
await mobile.page.waitForFunction(()=>window.ProjectCurseMapRoomRuntime.getState().detail==='deadzone-silent-interior');
const tabEnd=await mobile.page.evaluate(()=>({
  detail:window.ProjectCurseMapRoomRuntime.getState().detail,
  focused:document.activeElement?.dataset.mapDetail,
  hash:location.hash,
  indexes:[...document.querySelectorAll('[data-map-detail]')].map(tab=>({id:tab.dataset.mapDetail,index:tab.tabIndex,active:tab.classList.contains('is-active')}))
}));
check('mobile:detail-tabs-end-key',tabEnd.detail==='deadzone-silent-interior'&&tabEnd.focused==='deadzone-silent-interior'&&tabEnd.hash==='#map-room/detail/deadzone-silent-interior',JSON.stringify(tabEnd));
check('mobile:detail-tabs-roving-index',tabEnd.indexes.filter(tab=>tab.index===0).length===1&&tabEnd.indexes.every(tab=>tab.active?tab.index===0:tab.index===-1),JSON.stringify(tabEnd.indexes));
await mobile.page.keyboard.press('Home');
await mobile.page.waitForFunction(()=>window.ProjectCurseMapRoomRuntime.getState().detail==='eastasia-northern-front');
const tabHome=await mobile.page.evaluate(()=>({detail:window.ProjectCurseMapRoomRuntime.getState().detail,focused:document.activeElement?.dataset.mapDetail,hash:location.hash}));
check('mobile:detail-tabs-home-key',tabHome.detail==='eastasia-northern-front'&&tabHome.focused==='eastasia-northern-front'&&tabHome.hash==='#map-room/detail/eastasia-northern-front',JSON.stringify(tabHome));
const shareControl=await mobile.page.evaluate(()=>({
  count:document.querySelectorAll('[data-map-copy-link]').length,
  visible:getComputedStyle(document.querySelector('[data-map-copy-link]')).display!=='none',
  share:window.ProjectCurseMapRoomRuntime.getShareUrl(),
  current:location.href
}));
check('mobile:share-link-control',shareControl.count===1&&shareControl.visible&&shareControl.share===shareControl.current,JSON.stringify(shareControl));

await mobile.page.locator('[data-map-mode="operation"]').click();
await mobile.page.waitForSelector('.pc-map-operation-intel.is-collapsed');
check('mobile:operation-overview-collapsed',await mobile.page.locator('.pc-map-operation-intel [data-map-intel-toggle][aria-expanded="false"]').count()===1);
await mobile.page.locator('[data-map-step="1"]').click();
await mobile.page.waitForSelector('.pc-map-operation-intel:not(.is-collapsed)');
const finalMobile=await mobile.page.evaluate(()=>({
  operation:window.ProjectCurseMapRoomRuntime.getState().operation,
  hash:location.hash,
  expanded:document.querySelector('.pc-map-operation-intel [data-map-intel-toggle]')?.getAttribute('aria-expanded'),
  title:document.querySelector('.pc-map-operation-intel [data-map-intel-toggle] b')?.textContent.trim(),
  viewport:innerWidth,
  documentWidth:document.documentElement.scrollWidth
}));
check('mobile:operation-step-auto-expands',finalMobile.expanded==='true'&&finalMobile.title?.includes('T-')&&finalMobile.hash===`#map-room/operation/${finalMobile.operation}`,JSON.stringify(finalMobile));
check('mobile:no-overflow',finalMobile.documentWidth<=finalMobile.viewport,JSON.stringify(finalMobile));
check('mobile:no-new-core-audio',!mobile.requests.some(url=>url.includes('/assets/audio/core/')));
const mobileShot=join(tmpdir(),'project-curse-5.54.0-mobile-map-intel.png');
await mobile.page.screenshot({path:mobileShot,fullPage:false});
check('mobile:no-errors',mobile.errors.length===0,mobile.errors.join(' | '));
await mobile.context.close();

const deepLink=await openDeepLink({width:390,height:844},'deep-link','map-room/detail/gbf-western-marches/gbf-unlit-fortress');
await deepLink.page.waitForFunction(()=>document.body.dataset.route==='map-room'&&window.ProjectCurseMapRoomRuntime?.getState().detailSite==='gbf-unlit-fortress');
const deepLinkState=await deepLink.page.evaluate(()=>({
  mode:window.ProjectCurseMapRoomRuntime.getState().mode,
  detail:window.ProjectCurseMapRoomRuntime.getState().detail,
  site:window.ProjectCurseMapRoomRuntime.getState().detailSite,
  hash:location.hash,
  visualHeight:document.querySelector('.pc-map-visual-brief')?.getBoundingClientRect().height||0,
  signalHeight:document.querySelector('.pc-map-signal-brief')?.getBoundingClientRect().height||0,
  visualLoaded:Boolean(document.querySelector('.pc-map-visual-brief img')?.complete&&document.querySelector('.pc-map-visual-brief img')?.naturalWidth),
  recoveredLabel:document.querySelector('.pc-map-visual-brief')?.textContent.includes('해석 재구성')||false,
  overflow:document.documentElement.scrollWidth-innerWidth
}));
check('deep-link:gbf-site-restored',deepLinkState.mode==='detail'&&deepLinkState.detail==='gbf-western-marches'&&deepLinkState.site==='gbf-unlit-fortress'&&deepLinkState.hash==='#map-room/detail/gbf-western-marches/gbf-unlit-fortress',JSON.stringify(deepLinkState));
check('deep-link:gbf-recovered-briefing-visible',deepLinkState.visualHeight>0&&deepLinkState.signalHeight>0&&deepLinkState.visualLoaded&&deepLinkState.recoveredLabel,JSON.stringify(deepLinkState));
check('deep-link:no-mobile-overflow',deepLinkState.overflow<=0,JSON.stringify(deepLinkState));
const deepLinkShot=join(tmpdir(),'project-curse-5.54.0-mobile-gbf-deep-link.png');
await deepLink.page.locator('.pc-map-detail-intel').screenshot({path:deepLinkShot});
await deepLink.page.goto(urlForHash('map-room/region/southamerica'),{waitUntil:'networkidle'});
await deepLink.page.waitForFunction(()=>document.body.dataset.route==='map-room'&&window.ProjectCurseMapRoomRuntime?.getState().region==='southamerica');
const directRegion=await deepLink.page.evaluate(()=>({mode:window.ProjectCurseMapRoomRuntime.getState().mode,region:window.ProjectCurseMapRoomRuntime.getState().region,hash:location.hash}));
check('deep-link:region-restored',directRegion.mode==='region'&&directRegion.region==='southamerica'&&directRegion.hash==='#map-room/region/southamerica',JSON.stringify(directRegion));
await deepLink.page.evaluate(()=>{location.hash='map-room/detail/not-a-real-sector';});
await deepLink.page.waitForFunction(()=>location.hash==='#map-room'&&window.ProjectCurseMapRoomRuntime?.getState().mode==='landing');
check('deep-link:invalid-location-canonicalized',await deepLink.page.evaluate(()=>location.hash==='#map-room'&&window.ProjectCurseMapRoomRuntime.getState().mode==='landing'));
check('deep-link:no-errors',deepLink.errors.length===0,deepLink.errors.join(' | '));
await deepLink.context.close();

await browser.close();
results.forEach(result=>console.log(`${result.pass?'PASS':'FAIL'}  ${result.name}${result.detail?`  ${result.detail}`:''}`));
const failed=results.filter(result=>!result.pass);
console.log(`\n${results.length-failed.length}/${results.length} browser checks passed`);
console.log(`MOBILE_DETAIL_SCREENSHOT ${detailDirectoryShot}`);
console.log(`MOBILE_BRIEF_SCREENSHOT ${detailBriefShot}`);
console.log(`MOBILE_SCREENSHOT ${mobileShot}`);
console.log(`MOBILE_GBF_DEEP_SCREENSHOT ${deepLinkShot}`);
if(failed.length) process.exitCode=1;
