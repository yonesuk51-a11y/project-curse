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
  await page.evaluate(()=>{sessionStorage.removeItem('project_curse_map_session_v1');});
  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#app.ready',{timeout:12000});
  await page.evaluate(()=>window.ProjectCurseShell.navigate('map-room',{historyMode:'replace'}));
  await page.waitForFunction(()=>document.body.dataset.route==='map-room');
  check(`${label}:build`,await page.evaluate(()=>window.ProjectCurseBuild?.version)==='5.48.1');
  check(`${label}:no-initial-errors`,errors.length===0,errors.join(' | '));
  return {context,page,errors,requests};
}

const desktop=await openMap({width:1440,height:1000},'desktop');
const indexData=await desktop.page.evaluate(()=>({
  total:window.ProjectCurseMapSignalIndex?.items?.length,
  categories:Object.fromEntries(['event','site','operation','synchrony','withheld'].map(category=>[category,window.ProjectCurseMapSignalIndex.items.filter(item=>item.category===category).length])),
  withheld:window.ProjectCurseMapSignalIndex.items.filter(item=>item.mapStatus==='withheld').map(item=>item.target.id),
  independent:window.ProjectCurseMapSignalIndex.items.filter(item=>item.mapStatus==='independent').length
}));
check('desktop:derived-twenty-nine',indexData.total===29&&JSON.stringify(indexData.categories)==='{"event":8,"site":5,"operation":5,"synchrony":10,"withheld":1}',JSON.stringify(indexData));
check('desktop:canon-boundaries',indexData.withheld.join('|')==='evt-amarion-foundation'&&indexData.independent===10,JSON.stringify(indexData));

await desktop.page.locator('[data-map-index-toggle]').click();
await desktop.page.waitForSelector('.pc-map-signal-index.is-open');
const desktopOpen=await desktop.page.evaluate(()=>(
  {
    expanded:document.querySelector('[data-map-index-toggle]')?.getAttribute('aria-expanded'),
    modal:document.querySelector('.pc-map-signal-index')?.getAttribute('aria-modal'),
    contacts:document.querySelectorAll('[data-map-index-item]').length,
    columns:getComputedStyle(document.querySelector('.pc-map-index-results')).gridTemplateColumns,
    overflow:document.documentElement.scrollWidth-innerWidth
  }
));
check('desktop:index-opens',desktopOpen.expanded==='true'&&desktopOpen.modal==='false'&&desktopOpen.contacts===29,JSON.stringify(desktopOpen));
check('desktop:three-column-index',desktopOpen.columns.split(' ').length===3,JSON.stringify(desktopOpen));

await desktop.page.locator('[data-map-index-search]').fill('아마리온');
await desktop.page.waitForFunction(()=>document.querySelector('[data-map-index-count]')?.textContent.startsWith('1개'));
await desktop.page.locator('[data-map-index-item="withheld:evt-amarion-foundation"]').click();
const withheld=await desktop.page.evaluate(()=>(
  {
    open:document.querySelector('.pc-map-signal-index')?.classList.contains('is-open'),
    selected:document.querySelector('[data-map-index-item][aria-current="true"]')?.dataset.mapIndexItem,
    region:document.querySelector('[data-map-region][aria-selected="true"]')?.dataset.mapRegion,
    marker:document.querySelector('[data-map-marker].is-selected')?.dataset.mapMarker||null,
    point:document.querySelector('[data-map-synchrony-point].is-selected')?.dataset.mapSynchronyPoint||null,
    actions:document.querySelectorAll('.pc-map-index-item--withheld .pc-map-index-item-actions button').length,
    note:document.querySelector('.pc-map-index-withheld-note')?.textContent.trim()
  }
));
check('desktop:withheld-stays-unmapped',withheld.open&&withheld.selected==='withheld:evt-amarion-foundation'&&withheld.region==='northamerica'&&!withheld.marker&&!withheld.point,JSON.stringify(withheld));
check('desktop:withheld-crosslinks',withheld.actions===4&&withheld.note.includes('사건을 부정하지 않는다'),JSON.stringify(withheld));

await desktop.page.locator('[data-map-index-clear]').click();
await desktop.page.locator('[data-map-index-filter="operation"]').click();
check('desktop:operation-filter',await desktop.page.locator('[data-map-index-item^="operation:"]').count()===5);
await desktop.page.locator('[data-map-index-item="operation:op-immortality"]').click();
const operation=await desktop.page.evaluate(()=>(
  {
    open:document.querySelector('.pc-map-signal-index')?.classList.contains('is-open'),
    tab:document.querySelector('[data-map-mode][aria-selected="true"]')?.dataset.mapMode,
    operation:document.querySelector('[data-map-operation][aria-selected="true"]')?.dataset.mapOperation,
    intel:document.querySelector('.pc-map-operation-intel h3')?.textContent.replace(/\s+/g,' ').trim()
  }
));
check('desktop:operation-handoff',operation.open&&operation.tab==='operation'&&operation.operation==='op-immortality'&&operation.intel?.includes('유닛2 도착'),JSON.stringify(operation));
await desktop.page.keyboard.press('Escape');
check('desktop:escape-restores-toggle',await desktop.page.evaluate(()=>!document.querySelector('.pc-map-signal-index')?.classList.contains('is-open')&&document.activeElement?.matches('[data-map-index-toggle]')));
check('desktop:no-overflow',desktopOpen.overflow<=0,JSON.stringify(desktopOpen));
check('desktop:no-new-core-audio',!desktop.requests.some(url=>url.includes('/assets/audio/core/')));
check('desktop:no-errors',desktop.errors.length===0,desktop.errors.join(' | '));
await desktop.context.close();

const mobile=await openMap({width:390,height:844},'mobile');
await mobile.page.locator('[data-map-index-toggle]').click();
await mobile.page.waitForSelector('.pc-map-signal-index.is-open');
const mobileOpen=await mobile.page.evaluate(() => {
  const sheet=document.querySelector('.pc-map-signal-index');
  const filters=document.querySelector('.pc-map-index-filters');
  const firstFilter=filters?.querySelector('button');
  const rect=sheet?.getBoundingClientRect();
  return {
    modal:sheet?.getAttribute('aria-modal'),
    focused:document.activeElement?.matches('[data-map-index-search]'),
    height:rect?.height,
    top:rect?.top,
    filterHeight:filters?.getBoundingClientRect().height,
    filterButtonHeight:firstFilter?.getBoundingClientRect().height,
    scrim:getComputedStyle(document.querySelector('.pc-map-index-scrim')).visibility,
    viewport:innerWidth,
    documentWidth:document.documentElement.scrollWidth
  };
});
check('mobile:bottom-sheet',mobileOpen.modal==='true'&&mobileOpen.focused&&mobileOpen.height>560&&mobileOpen.top>180&&mobileOpen.scrim==='visible',JSON.stringify(mobileOpen));
check('mobile:filters-not-crushed',mobileOpen.filterHeight>=40&&mobileOpen.filterButtonHeight>=32,JSON.stringify(mobileOpen));

await mobile.page.locator('[data-map-index-filter="synchrony"]').click();
check('mobile:ten-independent-observations',await mobile.page.locator('[data-map-index-item^="synchrony:"]').count()===10);
await mobile.page.locator('[data-map-index-item="synchrony:gbf-bell-03"]').click();
const mobileHandoff=await mobile.page.evaluate(()=>(
  {
    open:document.querySelector('.pc-map-signal-index')?.classList.contains('is-open'),
    region:document.querySelector('[data-map-region][aria-selected="true"]')?.dataset.mapRegion,
    point:document.querySelector('[data-map-synchrony-point].is-selected')?.dataset.mapSynchronyPoint,
    intel:document.querySelector('[data-map-intel-toggle]')?.getAttribute('aria-expanded')
  }
));
check('mobile:synchrony-handoff-closes-sheet',!mobileHandoff.open&&mobileHandoff.region==='southamerica'&&mobileHandoff.point==='gbf-bell-03'&&mobileHandoff.intel==='true',JSON.stringify(mobileHandoff));

await mobile.page.locator('[data-map-index-toggle]').click();
await mobile.page.locator('[data-map-index-filter="all"]').click();
await mobile.page.locator('[data-map-index-search]').fill('아마리온');
await mobile.page.locator('[data-map-index-item="withheld:evt-amarion-foundation"]').click();
const mobileWithheld=await mobile.page.evaluate(()=>(
  {
    open:document.querySelector('.pc-map-signal-index')?.classList.contains('is-open'),
    region:document.querySelector('[data-map-region][aria-selected="true"]')?.dataset.mapRegion,
    marker:document.querySelector('[data-map-marker].is-selected')?.dataset.mapMarker||null,
    point:document.querySelector('[data-map-synchrony-point].is-selected')?.dataset.mapSynchronyPoint||null,
    query:document.querySelector('[data-map-index-search]')?.value
  }
));
check('mobile:withheld-clears-stale-selection',mobileWithheld.open&&mobileWithheld.region==='northamerica'&&!mobileWithheld.marker&&!mobileWithheld.point&&mobileWithheld.query==='아마리온',JSON.stringify(mobileWithheld));

await mobile.page.reload({waitUntil:'networkidle'});
await mobile.page.waitForSelector('#app.ready',{timeout:12000});
await mobile.page.evaluate(()=>window.ProjectCurseShell.navigate('map-room',{historyMode:'replace'}));
await mobile.page.waitForFunction(()=>document.body.dataset.route==='map-room');
const restored=await mobile.page.evaluate(()=>(
  {
    open:document.querySelector('.pc-map-signal-index')?.classList.contains('is-open'),
    query:document.querySelector('[data-map-index-search]')?.value,
    selected:document.querySelector('[data-map-index-item][aria-current="true"]')?.dataset.mapIndexItem,
    width:document.documentElement.scrollWidth
  }
));
check('mobile:index-session-restored',restored.open&&restored.query==='아마리온'&&restored.selected==='withheld:evt-amarion-foundation',JSON.stringify(restored));
await mobile.page.keyboard.press('Escape');
check('mobile:escape-and-focus',await mobile.page.evaluate(()=>!document.querySelector('.pc-map-signal-index')?.classList.contains('is-open')&&document.activeElement?.matches('[data-map-index-toggle]')));
check('mobile:no-overflow',restored.width<=390,JSON.stringify(restored));
check('mobile:no-new-core-audio',!mobile.requests.some(url=>url.includes('/assets/audio/core/')));
const mobileShot=join(tmpdir(),'project-curse-5.48.1-signal-index-mobile.png');
await mobile.page.screenshot({path:mobileShot,fullPage:false});
check('mobile:no-errors',mobile.errors.length===0,mobile.errors.join(' | '));
await mobile.context.close();

await browser.close();
results.forEach(result=>console.log(`${result.pass?'PASS':'FAIL'}  ${result.name}${result.detail?`  ${result.detail}`:''}`));
const failed=results.filter(result=>!result.pass);
console.log(`\n${results.length-failed.length}/${results.length} browser checks passed`);
console.log(`MOBILE_SCREENSHOT ${mobileShot}`);
if(failed.length) process.exitCode=1;
