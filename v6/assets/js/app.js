import {V6_BUILD} from './data.js';

const ROUTES=Object.freeze({
  briefing:{label:'상황 브리핑',code:'SESSION 00',load:()=>import('./routes/briefing.js')},
  world:{label:'세계 구조',code:'WORLD 01',load:()=>import('./routes/world.js')},
  map:{label:'세계 관제',code:'MAP 02',load:()=>import('./routes/map.js')},
  archive:{label:'보호 기록',code:'ARCHIVE 03',load:()=>import('./routes/archive.js')},
  marks:{label:'세력 표식',code:'MARKS 04',load:()=>import('./routes/marks.js')}
});

const state={route:'briefing',detail:'',booted:false,transitioning:false,pending:null};
const reduceMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const wait=ms=>new Promise(resolve=>window.setTimeout(resolve,ms));
const safeDecode=value=>{try{return decodeURIComponent(value||'');}catch{return String(value||'');}};
const sessionGet=key=>{try{return sessionStorage.getItem(key);}catch{return null;}};
const sessionSet=(key,value)=>{try{sessionStorage.setItem(key,value);}catch{/* storage may be unavailable */}};

function routeFromHash(){
  const parts=location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
  const route=ROUTES[parts[0]]?parts[0]:'briefing';
  return {route,detail:parts.slice(1).join('/')};
}

function setBootProgress(value){
  const boot=document.getElementById('pcV6Boot');
  const safe=Math.max(0,Math.min(100,Math.round(value)));
  boot?.querySelector('[data-boot-progress]')?.style.setProperty('--boot-progress',`${safe}%`);
  const percent=boot?.querySelector('[data-boot-percent]');
  if(percent) percent.textContent=`${String(safe).padStart(3,'0')}%`;
  boot?.querySelector('[data-boot-meter]')?.setAttribute('aria-valuenow',String(safe));
  const stageIndex=safe<24?0:safe<51?1:safe<78?2:3;
  boot?.querySelectorAll('[data-boot-stage]').forEach((stage,index)=>{
    stage.classList.toggle('is-active',index===stageIndex&&safe<100);
    stage.classList.toggle('is-complete',index<stageIndex||safe===100);
    const status=stage.querySelector('em');
    if(status) status.textContent=index<stageIndex||safe===100?'DONE':index===stageIndex?'READ':'WAIT';
  });
}

async function runBoot(){
  const boot=document.getElementById('pcV6Boot');
  const shell=document.getElementById('pcV6Shell');
  const skip=boot?.querySelector('[data-boot-skip]');
  const contentSkip=document.querySelector('[data-v6-content-skip]');
  const seen=sessionGet('pc_v6_preview_boot_seen')==='1';
  const forced=new URLSearchParams(location.search).get('boot')==='full';
  const duration=reduceMotion()?180:(seen&&!forced?2600:6200);
  let finished=false;
  const complete=()=>{
    if(finished) return;
    finished=true;
    setBootProgress(100);
    sessionSet('pc_v6_preview_boot_seen','1');
    window.setTimeout(()=>{
      boot?.classList.add('is-complete');
      shell.hidden=false;
      requestAnimationFrame(()=>shell.classList.add('is-ready'));
      state.booted=true;
      document.getElementById('pcV6View')?.focus({preventScroll:true});
    },reduceMotion()?0:280);
  };
  skip?.addEventListener('click',complete,{once:true});
  contentSkip?.addEventListener('click',event=>{
    event.preventDefault();
    complete();
    window.setTimeout(()=>document.getElementById('pcV6View')?.focus({preventScroll:false}),reduceMotion()?0:320);
  });
  if(skip){
    skip.hidden=duration<1000;
    window.setTimeout(()=>{skip.disabled=false;},Math.min(1800,duration));
  }
  const started=performance.now();
  while(!finished){
    const elapsed=performance.now()-started;
    const ratio=Math.min(1,elapsed/duration);
    setBootProgress(2+ratio*96);
    if(ratio>=1){complete();break;}
    await wait(80);
  }
}

async function renderRoute(route,{instant=false,detail=''}={}){
  if(state.transitioning){
    state.pending={route,instant,detail};
    return;
  }
  const target=ROUTES[route]||ROUTES.briefing;
  const view=document.getElementById('pcV6View');
  const cover=document.querySelector('.pc-v6-route-cover');
  state.transitioning=true;
  const animated=!instant&&!reduceMotion();
  let failed=false;
  try{
    if(animated){
      cover?.querySelector('[data-route-cover-code]')?.replaceChildren(document.createTextNode(target.code));
      cover?.querySelector('[data-route-cover-title]')?.replaceChildren(document.createTextNode(target.label));
      cover?.classList.add('is-visible');
      await wait(320);
    }
    const module=await target.load();
    view.innerHTML=module.render();
    module.mount?.(view,{navigate,detail});
    state.route=route;
    state.detail=detail;
    document.documentElement.dataset.pcV6Route=route;
    document.title=`${target.label} — Project Curse 6.0`;
    const routeStatus=document.getElementById('pcV6RouteStatus');
    if(routeStatus) routeStatus.textContent=`${target.label} 기록 채널을 열었습니다.`;
    document.querySelectorAll('[data-route]').forEach(link=>{
      const active=link.dataset.route===route;
      link.classList.toggle('is-active',active);
      if(active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
    });
    view.scrollTop=0;
  }catch(error){
    failed=true;
    console.error(`[Project Curse V6] ${target.label} route failed`,error);
    view.innerHTML=`<section class="pc-v6-route-error" aria-labelledby="pcV6RouteErrorTitle"><span>CHANNEL LOAD FAILURE</span><h1 id="pcV6RouteErrorTitle">${target.label} 채널을 열지 못했습니다.</h1><p>현재 주소나 모듈 상태가 손상되었습니다. 보호 원문과 기존 공개판은 변경되지 않았습니다.</p><a href="#/briefing">상황 브리핑으로 복귀</a></section>`;
    const routeStatus=document.getElementById('pcV6RouteStatus');
    if(routeStatus) routeStatus.textContent=`${target.label} 채널을 열지 못했습니다.`;
  }finally{
    if(animated){
      cover?.classList.add('is-revealing');
      await wait(failed?180:420);
    }
    cover?.classList.remove('is-visible','is-revealing');
    state.transitioning=false;
    if(state.booted) view.focus({preventScroll:true});
    const pending=state.pending;
    state.pending=null;
    if(pending) await renderRoute(pending.route,{instant:pending.instant,detail:pending.detail});
  }
}

function navigate(route,detail=''){
  const safe=ROUTES[route]?route:'briefing';
  const hash=`#/${safe}${detail?`/${encodeURIComponent(detail)}`:''}`;
  if(location.hash===hash) renderRoute(safe,{detail}); else location.hash=hash;
}

window.addEventListener('hashchange',()=>{
  const next=routeFromHash();
  renderRoute(next.route,{detail:safeDecode(next.detail)});
});
window.addEventListener('DOMContentLoaded',async()=>{
  console.info(`[Project Curse ${V6_BUILD.version}] ${V6_BUILD.label} / ${V6_BUILD.canonState}`);
  if(!location.hash) history.replaceState(null,'','#/briefing');
  const first=routeFromHash();
  await renderRoute(first.route,{instant:true,detail:safeDecode(first.detail)});
  await runBoot();
});
