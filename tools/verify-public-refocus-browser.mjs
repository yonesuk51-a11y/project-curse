#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

const siteUrl=process.env.PC_SITE_URL||'http://127.0.0.1:4173/';
const modulePath=process.env.PC_PLAYWRIGHT_MODULE;
const executablePath=[process.env.PC_CHROME_PATH,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].filter(Boolean).find(existsSync);
if(!modulePath||!existsSync(modulePath)) throw new Error('Set PC_PLAYWRIGHT_MODULE to the absolute path of Playwright index.mjs.');
if(!executablePath) throw new Error('Chrome or Edge executable was not found.');

const {chromium}=await import(pathToFileURL(modulePath).href);
const browser=await chromium.launch({headless:true,executablePath});
const results=[];
const check=(name,pass,detail='')=>results.push({name,pass:Boolean(pass),detail});

function publicUrl(fragment=''){
  const url=new URL(siteUrl);
  url.searchParams.set('boot','skip');
  url.hash=fragment;
  return url.href;
}

async function openPublic(viewport,label,fragment=''){
  const context=await browser.newContext({viewport});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(`page: ${error.message}`));
  page.on('console',message=>{if(message.type()==='error') errors.push(`console: ${message.text()}`);});
  await page.goto(publicUrl(fragment),{waitUntil:'networkidle'});
  await page.waitForSelector('#app.ready',{timeout:12000});
  check(`${label}:build`,await page.evaluate(()=>window.ProjectCurseBuild?.version)==='5.49.0');
  check(`${label}:no-initial-errors`,errors.length===0,errors.join(' | '));
  return {context,page,errors};
}

const desktop=await openPublic({width:1440,height:1000},'desktop');
const home=await desktop.page.evaluate(()=>(
  {
    route:document.body.dataset.route,
    title:document.querySelector('#terminal-home h1')?.textContent.trim(),
    genre:document.querySelector('.pc5152ca1-home-title>span')?.textContent.trim(),
    entries:Array.from(document.querySelectorAll('.pc-terminal-entry-routes>a')).map(node=>node.querySelector('b')?.textContent.trim()),
    publicNav:Array.from(document.querySelectorAll('#uacQuickNav [data-uac-route]')).map(node=>node.dataset.uacRoute),
    auditNav:document.querySelectorAll('[data-uac-route="media-audit"]').length,
    interfaceAudio:document.documentElement.dataset.pcInterfaceAudio,
    ambient:document.documentElement.dataset.pcAmbient,
    audio:window.ProjectCurseAudioControl?.getState?.(),
    width:document.documentElement.scrollWidth,
    viewport:innerWidth
  }
));
check('desktop:genre-first-home',home.route==='terminal-home'&&home.title==='금기를 무기로 삼은 세계'&&home.genre?.includes('DARK FANTASY'),JSON.stringify(home));
check('desktop:three-entry-routes',home.entries.join('|')==='세계를 이해한다|대표 기록을 본다|전장에 진입한다',JSON.stringify(home.entries));
check('desktop:five-public-channels',home.publicNav.join('|')==='terminal-home|map-room|history|faction-info|archive-entry'&&home.auditNav===0,JSON.stringify(home.publicNav));
check('desktop:minimal-audio-default',home.interfaceAudio==='minimal'&&home.ambient==='off'&&home.audio?.ambient===0&&home.audio?.interface===0.34,JSON.stringify({interfaceAudio:home.interfaceAudio,ambient:home.ambient,audio:home.audio}));
check('desktop:no-overflow',home.width<=home.viewport,JSON.stringify({width:home.width,viewport:home.viewport}));

const transitionStart=Date.now();
await desktop.page.evaluate(()=>window.ProjectCurseShell.navigate('history',{historyMode:'replace'}));
await desktop.page.waitForFunction(()=>document.body.dataset.route==='history');
const transitionMs=Date.now()-transitionStart;
check('desktop:authored-transition-duration',transitionMs>=350&&transitionMs<=1400,`${transitionMs}ms`);
await desktop.page.evaluate(()=>window.ProjectCurseShell.navigate('terminal-home',{historyMode:'replace'}));
await desktop.page.waitForFunction(()=>document.body.dataset.route==='terminal-home');
const desktopShot=join(tmpdir(),'project-curse-5.49.0-public-home-desktop.png');
await desktop.page.screenshot({path:desktopShot,fullPage:false});
check('desktop:no-final-errors',desktop.errors.length===0,desktop.errors.join(' | '));
await desktop.context.close();

const legacyAudit=await openPublic({width:1280,height:900},'public-audit-boundary','media-audit');
const boundary=await legacyAudit.page.evaluate(()=>(
  {
    route:document.body.dataset.route,
    runtime:window.ProjectCurseMediaClearanceRuntime?.available,
    visible:!document.getElementById('media-audit')?.hasAttribute('inert')
  }
));
check('public-audit-boundary:redirect-home',boundary.route==='terminal-home'&&boundary.runtime===false&&boundary.visible===false,JSON.stringify(boundary));
await legacyAudit.context.close();

const mobile=await openPublic({width:390,height:844},'mobile');
const mobileState=await mobile.page.evaluate(()=>(
  {
    route:document.body.dataset.route,
    entries:document.querySelectorAll('.pc-terminal-entry-routes>a').length,
    columns:getComputedStyle(document.querySelector('.pc-terminal-entry-routes')).gridTemplateColumns,
    width:document.documentElement.scrollWidth,
    viewport:innerWidth
  }
));
check('mobile:single-column-entry',mobileState.entries===3&&!mobileState.columns.includes(' '),JSON.stringify(mobileState));
check('mobile:no-overflow',mobileState.width<=mobileState.viewport,JSON.stringify(mobileState));
const mobileShot=join(tmpdir(),'project-curse-5.49.0-public-home-mobile.png');
await mobile.page.screenshot({path:mobileShot,fullPage:false});
check('mobile:no-final-errors',mobile.errors.length===0,mobile.errors.join(' | '));
await mobile.context.close();

const coldContext=await browser.newContext({viewport:{width:1280,height:900}});
const coldPage=await coldContext.newPage();
const coldUrl=new URL(siteUrl);coldUrl.searchParams.set('cold','5.49');coldUrl.hash='';
const coldStart=Date.now();
await coldPage.goto(coldUrl.href,{waitUntil:'domcontentloaded'});
await coldPage.waitForSelector('#app.ready',{timeout:9000});
const coldMs=Date.now()-coldStart;
check('cold:readable-not-excessive',coldMs>=3400&&coldMs<=5200,`${coldMs}ms`);
await coldContext.close();

await browser.close();
results.forEach(result=>console.log(`${result.pass?'PASS':'FAIL'}  ${result.name}${result.detail?`  ${result.detail}`:''}`));
const failed=results.filter(result=>!result.pass);
console.log(`\n${results.length-failed.length}/${results.length} browser checks passed`);
console.log(`DESKTOP_SCREENSHOT ${desktopShot}`);
console.log(`MOBILE_SCREENSHOT ${mobileShot}`);
if(failed.length) process.exitCode=1;
