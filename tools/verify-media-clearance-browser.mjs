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

async function openAudit(viewport,label){
  const context=await browser.newContext({viewport});
  const page=await context.newPage();
  const errors=[];
  const requests=[];
  page.on('pageerror',error=>errors.push(`page: ${error.message}`));
  page.on('console',message=>{if(message.type()==='error') errors.push(`console: ${message.text()}`);});
  page.on('request',request=>requests.push(request.url()));
  await page.goto(baseUrl,{waitUntil:'networkidle'});
  await page.waitForSelector('#app.ready',{timeout:12000});
  await page.evaluate(()=>sessionStorage.removeItem('project_curse_media_clearance_v1'));
  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#app.ready',{timeout:12000});
  await page.evaluate(()=>window.ProjectCurseShell.navigate('media-audit',{historyMode:'replace'}));
  await page.waitForFunction(()=>document.body.dataset.route==='media-audit');
  await page.waitForSelector('[data-media-clearance-owner]');
  await page.waitForTimeout(120);
  requests.length=0;
  check(`${label}:build`,await page.evaluate(()=>window.ProjectCurseBuild?.version)==='5.48.0');
  check(`${label}:no-initial-errors`,errors.length===0,errors.join(' | '));
  return {context,page,errors,requests};
}

const desktop=await openAudit({width:1440,height:1000},'desktop');
const dataState=await desktop.page.evaluate(()=>(
  {
    registered:window.ProjectCurseMediaProvenance?.stats?.registered,
    review:window.ProjectCurseMediaProvenance?.stats?.review,
    managed:window.ProjectCurseMediaProvenance?.stats?.managed,
    priority:window.ProjectCurseMediaProvenance?.priorityQueue?.length,
    priorityAudio:window.ProjectCurseMediaProvenance?.stats?.priorityAudio,
    priorityVideo:window.ProjectCurseMediaProvenance?.stats?.priorityVideo,
    exposure:window.ProjectCurseMediaProvenance?.stats?.referenceExposure,
    ranks:window.ProjectCurseMediaProvenance?.priorityQueue?.map(item=>item.rank).join('|')
  }
));
check('desktop:data-ledger',dataState.registered===174&&dataState.review===150&&dataState.managed===24,JSON.stringify(dataState));
check('desktop:priority-thirty',dataState.priority===30&&dataState.priorityAudio===23&&dataState.priorityVideo===7&&dataState.ranks.startsWith('1|2|3')&&dataState.ranks.endsWith('|30'),JSON.stringify(dataState));
check('desktop:reference-boundary',dataState.exposure===0,JSON.stringify(dataState));

const initial=await desktop.page.evaluate(()=>(
  {
    rows:document.querySelectorAll('[data-media-path]').length,
    selected:document.querySelector('[data-media-path].is-selected')?.dataset.mediaPath,
    detail:document.querySelector('[data-media-detail] h3')?.textContent,
    columns:getComputedStyle(document.querySelector('.pc-media-clearance-workspace')).gridTemplateColumns,
    images:document.querySelectorAll('#media-audit img').length,
    audio:document.querySelectorAll('#media-audit audio').length,
    video:document.querySelectorAll('#media-audit video').length,
    overflow:document.documentElement.scrollWidth-innerWidth
  }
));
check('desktop:priority-render',initial.rows===30&&initial.selected?.includes('assets/audio/')&&Boolean(initial.detail),JSON.stringify(initial));
check('desktop:two-column-workspace',initial.columns.split(' ').length===2,JSON.stringify(initial));
check('desktop:no-media-preview',initial.images===0&&initial.audio===0&&initial.video===0,JSON.stringify(initial));
check('desktop:no-overflow',initial.overflow<=0,JSON.stringify(initial));

await desktop.page.locator('[data-media-search]').fill('pc5152am_menu_old_computer');
check('desktop:priority-search',await desktop.page.locator('[data-media-path]').count()===1);
await desktop.page.locator('[data-media-scope="all"]').click();
await desktop.page.locator('[data-media-search]').fill('');
check('desktop:all-assets',await desktop.page.locator('[data-media-path]').count()===174);
await desktop.page.locator('[data-media-kind="image"]').click();
check('desktop:image-filter',await desktop.page.locator('[data-media-path]').count()===144);
await desktop.page.locator('[data-media-kind="all"]').click();
await desktop.page.locator('[data-media-release="review"]').click();
check('desktop:review-filter',await desktop.page.locator('[data-media-path]').count()===150);
await desktop.page.locator('[data-media-release="managed"]').click();
check('desktop:managed-filter',await desktop.page.locator('[data-media-path]').count()===24);

await desktop.page.locator('[data-media-scope="reference"]').click();
const reference=await desktop.page.evaluate(()=>(
  {
    cards:document.querySelectorAll('.pc-media-reference-list article').length,
    copy:document.querySelector('[data-media-detail]')?.textContent.replace(/\s+/g,' ').trim(),
    result:document.querySelector('[data-media-result]')?.textContent
  }
));
check('desktop:three-reference-only',reference.cards===3&&reference.result.includes('공개 노출 0건'),JSON.stringify(reference));
check('desktop:reference-not-previewed',reference.copy.includes('공개 자산이 아닙니다')&&reference.copy.includes('내부 파일은 열람하거나 미리보기로 표시하지 않는다'),JSON.stringify(reference));

await desktop.page.locator('[data-media-scope="priority"]').click();
const rows=desktop.page.locator('[data-media-path]');
await rows.first().focus();
await desktop.page.keyboard.press('ArrowDown');
check('desktop:keyboard-row-navigation',await desktop.page.evaluate(()=>document.activeElement?.dataset.mediaPath===document.querySelectorAll('[data-media-path]')[1]?.dataset.mediaPath));
await desktop.page.locator('[data-media-search]').fill('vhs_transition');
await desktop.page.reload({waitUntil:'networkidle'});
await desktop.page.waitForSelector('#app.ready',{timeout:12000});
await desktop.page.evaluate(()=>window.ProjectCurseShell.navigate('media-audit',{historyMode:'replace'}));
await desktop.page.waitForFunction(()=>document.body.dataset.route==='media-audit');
desktop.requests.length=0;
const restored=await desktop.page.evaluate(()=>(
  {
    scope:document.querySelector('[data-media-scope].is-active')?.dataset.mediaScope,
    query:document.querySelector('[data-media-search]')?.value,
    rows:document.querySelectorAll('[data-media-path]').length
  }
));
check('desktop:session-restored',restored.scope==='priority'&&restored.query==='vhs_transition'&&restored.rows===1,JSON.stringify(restored));
await desktop.page.locator('[data-media-search]').focus();
await desktop.page.keyboard.press('Escape');
check('desktop:escape-clears-search',await desktop.page.evaluate(()=>document.querySelector('[data-media-search]')?.value===''&&document.querySelectorAll('[data-media-path]').length===30));
const desktopAuditMedia=desktop.requests.filter(url=>/\/(?:assets\/audio|assets\/video|assets\/resources)\//.test(url)&&!url.endsWith('/assets/audio/pc5152am_menu_old_computer.mp3'));
check('desktop:no-audit-media-requests',desktopAuditMedia.length===0,desktopAuditMedia.join(' | '));
check('desktop:no-errors',desktop.errors.length===0,desktop.errors.join(' | '));
const desktopShot=join(tmpdir(),'project-curse-5.48.0-media-clearance-desktop.png');
await desktop.page.screenshot({path:desktopShot,fullPage:false});
await desktop.context.close();

const mobile=await openAudit({width:390,height:844},'mobile');
const mobileLayout=await mobile.page.evaluate(()=>(
  {
    columns:getComputedStyle(document.querySelector('.pc-media-clearance-workspace')).gridTemplateColumns,
    width:document.documentElement.scrollWidth,
    viewport:innerWidth,
    rows:document.querySelectorAll('[data-media-path]').length,
    rowHeight:document.querySelector('[data-media-path]')?.getBoundingClientRect().height,
    listHeight:document.querySelector('[data-media-list]')?.getBoundingClientRect().height
  }
));
check('mobile:single-column-workspace',mobileLayout.columns.split(' ').length===1&&mobileLayout.rows===30,JSON.stringify(mobileLayout));
check('mobile:touch-readable-list',mobileLayout.rowHeight>=54&&mobileLayout.listHeight>300,JSON.stringify(mobileLayout));
check('mobile:no-overflow',mobileLayout.width<=mobileLayout.viewport,JSON.stringify(mobileLayout));
const mobileTopShot=join(tmpdir(),'project-curse-5.48.0-media-clearance-mobile-top.png');
await mobile.page.screenshot({path:mobileTopShot,fullPage:false});
await mobile.page.locator('[data-media-scope="all"]').click();
await mobile.page.locator('[data-media-kind="video"]').click();
check('mobile:video-filter-seven',await mobile.page.locator('[data-media-path]').count()===7);
await mobile.page.locator('[data-media-path]').first().click();
check('mobile:detail-selected',await mobile.page.evaluate(()=>Boolean(document.querySelector('[data-media-detail] h3')?.textContent)&&document.querySelector('[data-media-path].is-selected')?.getAttribute('aria-current')!=='false'));
await mobile.page.evaluate(()=>window.ProjectCurseMediaClearanceRuntime.open('assets/audio/pc5152am_menu_old_computer.mp3'));
await mobile.page.waitForFunction(()=>document.querySelector('[data-media-path].is-selected')?.dataset.mediaPath==='assets/audio/pc5152am_menu_old_computer.mp3');
check('mobile:runtime-direct-open',await mobile.page.evaluate(()=>document.querySelector('[data-media-detail] h3')?.textContent==='pc5152am_menu_old_computer.mp3'));
const mobileAuditMedia=mobile.requests.filter(url=>/\/(?:assets\/audio|assets\/video|assets\/resources)\//.test(url)&&!url.endsWith('/assets/audio/pc5152am_menu_old_computer.mp3'));
check('mobile:no-audit-media-requests',mobileAuditMedia.length===0,mobileAuditMedia.join(' | '));
const mobileShot=join(tmpdir(),'project-curse-5.48.0-media-clearance-mobile.png');
await mobile.page.screenshot({path:mobileShot,fullPage:false});
check('mobile:no-errors',mobile.errors.length===0,mobile.errors.join(' | '));
await mobile.context.close();

await browser.close();
results.forEach(result=>console.log(`${result.pass?'PASS':'FAIL'}  ${result.name}${result.detail?`  ${result.detail}`:''}`));
const failed=results.filter(result=>!result.pass);
console.log(`\n${results.length-failed.length}/${results.length} browser checks passed`);
console.log(`DESKTOP_SCREENSHOT ${desktopShot}`);
console.log(`MOBILE_TOP_SCREENSHOT ${mobileTopShot}`);
console.log(`MOBILE_SCREENSHOT ${mobileShot}`);
if(failed.length) process.exitCode=1;
