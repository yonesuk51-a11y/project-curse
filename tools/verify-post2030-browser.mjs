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

async function openHistory(viewport,label){
  const context=await browser.newContext({viewport});
  const page=await context.newPage();
  const errors=[];
  const requests=[];
  page.on('pageerror',error=>errors.push(`page: ${error.message}`));
  page.on('console',message=>{if(message.type()==='error') errors.push(`console: ${message.text()}`);});
  page.on('request',request=>requests.push(request.url()));
  await page.goto(baseUrl,{waitUntil:'networkidle'});
  await page.waitForSelector('#app.ready',{timeout:12000});
  check(`${label}:build`,await page.evaluate(()=>window.ProjectCurseBuild?.version)==='5.44.0');
  await page.evaluate(()=>window.ProjectCurseShell.navigate('history',{historyMode:'replace'}));
  await page.waitForFunction(()=>document.body.dataset.route==='history');
  await page.waitForSelector('[data-history-era-filter="aftermath"]');
  check(`${label}:no-initial-errors`,errors.length===0,errors.join(' | '));
  return {context,page,errors,requests};
}

const expectedTitles=[
  '분기 기록 봉인',
  '세 번의 종 협약',
  '내륙 등대 31호 응답',
  '우시노다 중앙호출명 소실',
  '북부 제6차 차단선 재설정',
  '삼야 무응답'
];

const desktop=await openHistory({width:1440,height:1000},'desktop');
const desktopOverview=await desktop.page.evaluate(()=>({
  range:document.querySelector('.pc-world-history-range')?.textContent?.trim(),
  total:document.querySelector('[data-history-total]')?.textContent?.trim(),
  eras:document.querySelector('[data-history-era-total]')?.textContent?.trim(),
  filters:document.querySelectorAll('[data-history-era-filter]').length,
  viewport:innerWidth,
  document:document.documentElement.scrollWidth,
  telemetry:[...document.querySelectorAll('#history>.pc-channel-identity dl>div')].map(node=>[node.querySelector('dt')?.textContent.trim(),node.querySelector('dd')?.textContent.trim()])
}));
check('desktop:range-2042',desktopOverview.range==='1975–2042 / ACTIVE ARCHIVE',JSON.stringify(desktopOverview));
check('desktop:forty-three-records',desktopOverview.total==='43',JSON.stringify(desktopOverview));
check('desktop:nine-eras',desktopOverview.eras==='9'&&desktopOverview.filters===10,JSON.stringify(desktopOverview));
check('desktop:current-channel-telemetry',desktopOverview.telemetry.flat().join('|')==='SPAN|1975–2042|INDEX|43 RECORDS|EVENTS|9',JSON.stringify(desktopOverview));
check('desktop:no-index-overflow',desktopOverview.document<=desktopOverview.viewport,JSON.stringify(desktopOverview));

await desktop.page.locator('[data-history-era-filter="aftermath"]').click();
await desktop.page.waitForSelector('[data-history-era-group="aftermath"]');
const aftermathIndex=await desktop.page.evaluate(()=>({
  status:document.querySelector('[data-history-filter-status]')?.textContent?.trim(),
  title:document.querySelector('[data-history-era-group="aftermath"] .pc-world-history-era-head b')?.textContent?.trim(),
  records:[...document.querySelectorAll('[data-history-era-group="aftermath"] [data-history-record]')].map(node=>({
    id:node.dataset.historyRecord,
    title:node.querySelector('strong')?.textContent?.trim(),
    document:node.querySelector('.pc-world-history-document-badge')?.textContent?.trim()
  }))
}));
check('desktop:aftermath-filter',aftermathIndex.status==='6개 사건 표시'&&aftermathIndex.title==='분기 기록과 장거리 무응답',JSON.stringify(aftermathIndex));
check('desktop:six-aftermath-records',aftermathIndex.records.length===6&&aftermathIndex.records.map(record=>record.title).join('|')===expectedTitles.join('|'),JSON.stringify(aftermathIndex));
check('desktop:varied-document-voices',new Set(aftermathIndex.records.map(record=>record.document)).size>=4,JSON.stringify(aftermathIndex));

await desktop.page.locator('[data-history-record="2042-10-31-three-night-silence"]').click();
await desktop.page.waitForSelector('.pc-world-history-detail:not([hidden])');
const detail=await desktop.page.evaluate(()=>({
  title:document.querySelector('[data-history-record-title]')?.textContent?.trim(),
  era:document.querySelector('[data-history-record-era]')?.textContent?.trim(),
  evidence:document.querySelector('[data-history-record-evidence]')?.textContent?.trim(),
  document:document.querySelector('[data-history-record-document]')?.textContent?.trim(),
  author:document.querySelector('[data-history-record-author]')?.textContent?.trim(),
  fragments:document.querySelectorAll('[data-history-record-body] .pc-world-history-fragment').length,
  links:[...document.querySelectorAll('[data-history-record-links] button')].map(node=>node.textContent.trim()),
  viewport:innerWidth,
  documentWidth:document.documentElement.scrollWidth
}));
check('desktop:latest-detail',detail.title==='삼야 무응답'&&detail.era==='09 / 분기 기록과 장거리 무응답'&&detail.evidence==='현장 관측',JSON.stringify(detail));
check('desktop:authored-detail',detail.document?.includes('상충 기록')&&detail.author?.includes('대륙간 신호합동실')&&detail.fragments===4,JSON.stringify(detail));
check('desktop:direct-crosslinks',detail.links.includes('U.A.C 분석')&&detail.links.includes('S.I.D 분석')&&detail.links.includes('Great_Black_Forest_Region 기록')&&detail.links.includes('Dead_Zone_Pilgrimage 기록'),JSON.stringify(detail));
check('desktop:no-detail-overflow',detail.documentWidth<=detail.viewport,JSON.stringify(detail));
check('desktop:no-generated-core-audio-requests',!desktop.requests.some(url=>url.includes('/assets/audio/core/')),desktop.requests.filter(url=>url.includes('/assets/audio/')).join(' | '));
const desktopShot=join(tmpdir(),'project-curse-5.44.0-aftermath-desktop.png');
await desktop.page.screenshot({path:desktopShot,fullPage:false});
check('desktop:no-final-errors',desktop.errors.length===0,desktop.errors.join(' | '));
await desktop.context.close();

const mobile=await openHistory({width:390,height:844},'mobile');
await mobile.page.locator('[data-history-era-filter="aftermath"]').click();
await mobile.page.locator('[data-history-record="2042-10-31-three-night-silence"]').click();
await mobile.page.waitForSelector('.pc-world-history-detail:not([hidden])');
await mobile.page.waitForTimeout(900);
const mobileLayout=await mobile.page.evaluate(()=>({
  viewport:innerWidth,
  document:document.documentElement.scrollWidth,
  shell:document.querySelector('.uac-shell-content')?.scrollWidth,
  title:document.querySelector('[data-history-record-title]')?.textContent?.trim(),
  links:document.querySelectorAll('[data-history-record-links] button').length,
  fragments:document.querySelectorAll('[data-history-record-body] .pc-world-history-fragment').length
}));
check('mobile:latest-detail',mobileLayout.title==='삼야 무응답'&&mobileLayout.links===4&&mobileLayout.fragments===4,JSON.stringify(mobileLayout));
check('mobile:no-horizontal-overflow',mobileLayout.document<=mobileLayout.viewport&&mobileLayout.shell<=mobileLayout.viewport,JSON.stringify(mobileLayout));
check('mobile:no-generated-core-audio-requests',!mobile.requests.some(url=>url.includes('/assets/audio/core/')),mobile.requests.filter(url=>url.includes('/assets/audio/')).join(' | '));
const mobileShot=join(tmpdir(),'project-curse-5.44.0-aftermath-mobile.png');
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
