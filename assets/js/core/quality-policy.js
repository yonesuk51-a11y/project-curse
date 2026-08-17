// Project Curse 5.32.0 — shared connection, device and recovery quality policy.
(function(root){
  'use strict';

  const STORAGE_KEY='project_curse_preferences_v1';
  const tiers=['offline','constrained','balanced','full'];
  const rootElement=document.documentElement;
  const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection||null;
  let preference=readPreference();
  let state=null;
  let banner=null;
  let dismissed=false;

  function readPreference(){
    try{
      const stored=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
      return ['auto','data','high'].includes(stored?.quality)?stored.quality:'auto';
    }catch(_error){return 'auto';}
  }

  function number(value){return Number.isFinite(Number(value))?Number(value):null;}
  function signals(){
    return {
      online:navigator.onLine!==false,
      saveData:Boolean(connection?.saveData),
      effectiveType:String(connection?.effectiveType||'unknown'),
      downlink:number(connection?.downlink),
      rtt:number(connection?.rtt),
      memory:number(navigator.deviceMemory),
      cores:number(navigator.hardwareConcurrency)
    };
  }

  function automaticTier(current){
    if(!current.online) return {tier:'offline',score:99,reason:'NETWORK OFFLINE'};
    let score=0;const reasons=[];
    if(current.saveData){score+=5;reasons.push('DATA SAVER');}
    if(/^(slow-2g|2g)$/.test(current.effectiveType)){score+=5;reasons.push(current.effectiveType.toUpperCase());}
    else if(current.effectiveType==='3g'){score+=3;reasons.push('3G LINK');}
    if(current.rtt!==null&&current.rtt>=700){score+=2;reasons.push('HIGH LATENCY');}
    if(current.downlink!==null&&current.downlink>0&&current.downlink<=1){score+=2;reasons.push('LOW BANDWIDTH');}
    if(current.memory!==null&&current.memory<=2){score+=3;reasons.push('LOW MEMORY');}
    else if(current.memory!==null&&current.memory<=4){score+=1;reasons.push('MID MEMORY');}
    if(current.cores!==null&&current.cores<=2){score+=2;reasons.push('LOW CPU');}
    else if(current.cores!==null&&current.cores<=4){score+=1;reasons.push('MID CPU');}
    return {tier:score>=5?'constrained':score>=2?'balanced':'full',score,reason:reasons.join(' / ')||'LINK NOMINAL'};
  }

  function resolve(){
    const current=signals();const automatic=automaticTier(current);
    if(!current.online) return {...current,...automatic,preference};
    if(preference==='data') return {...current,tier:'constrained',score:automatic.score,reason:'MANUAL DATA SAVER',preference};
    if(preference==='high') return {...current,tier:'full',score:automatic.score,reason:'MANUAL HIGH QUALITY',preference};
    return {...current,...automatic,preference};
  }

  function allows(feature){
    const tier=state?.tier||resolve().tier;
    const rank=tiers.indexOf(tier);
    const minimum={ambient:2,routeWarmup:2,videoPreload:2,originalOnDemand:1,animatedNoise:2}[feature]??1;
    return rank>=minimum;
  }

  function ensureBanner(){
    if(banner||!document.body) return banner;
    banner=document.createElement('aside');
    banner.className='pc-connection-recovery';
    banner.hidden=true;
    banner.setAttribute('role','status');
    banner.setAttribute('aria-live','polite');
    banner.innerHTML='<i aria-hidden="true"></i><div><small>PC-04 / CONNECTION RECOVERY</small><strong data-pc-connection-title>로컬 신호 확인 중</strong><p data-pc-connection-copy>현재 문서와 저장된 기록은 계속 열람할 수 있다.</p></div><span data-pc-connection-state>STANDBY</span><button type="button" data-pc-connection-retry>연결 재확인</button><button type="button" data-pc-connection-dismiss aria-label="연결 알림 닫기">×</button>';
    banner.addEventListener('click',event=>{
      if(event.target.closest('[data-pc-connection-retry]')){
        dismissed=false;evaluate('manual-retry');
        root.ProjectCurseMedia?.retryFailed?.();
      }
      if(event.target.closest('[data-pc-connection-dismiss]')){dismissed=true;renderBanner();}
    });
    document.body.appendChild(banner);return banner;
  }

  function renderBanner(){
    ensureBanner();if(!banner||!state) return;
    const offline=state.tier==='offline';
    banner.hidden=!offline||dismissed;
    banner.classList.toggle('is-visible',offline&&!dismissed);
    const title=banner.querySelector('[data-pc-connection-title]');
    const copy=banner.querySelector('[data-pc-connection-copy]');
    const label=banner.querySelector('[data-pc-connection-state]');
    if(title) title.textContent=offline?'외부 연결이 끊겼다':'외부 연결이 복구됐다';
    if(copy) copy.textContent=offline?'이미 열린 기록과 로컬 저장 진행은 유지된다. 연결 후 재확인을 실행하라.':'새 시각 자료를 다시 요청할 수 있다.';
    if(label) label.textContent=offline?'OFFLINE / CACHE':'LINK RESTORED';
  }

  function evaluate(source='runtime'){
    const previous=state?.tier||null;state=resolve();
    rootElement.dataset.pcQuality=state.tier;
    rootElement.dataset.pcQualityPreference=preference;
    rootElement.dataset.pcNetwork=state.online?'online':'offline';
    if(state.online) dismissed=false;
    renderBanner();
    document.dispatchEvent(new CustomEvent('projectcurse:quality-change',{detail:{...state,source,previous}}));
    return getState();
  }

  function setPreference(value){
    if(!['auto','data','high'].includes(value)) return false;
    if(value===preference) return true;
    preference=value;evaluate('preference');return true;
  }

  function getState(){return Object.freeze({...state});}
  function getDiagnostics(){return Object.freeze({...getState(),allows:{ambient:allows('ambient'),routeWarmup:allows('routeWarmup'),videoPreload:allows('videoPreload')}});}

  const ready=()=>{ensureBanner();evaluate('ready');};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
  root.addEventListener('online',()=>evaluate('online'));
  root.addEventListener('offline',()=>evaluate('offline'));
  connection?.addEventListener?.('change',()=>evaluate('connection'));
  document.addEventListener('projectcurse:preferences-change',event=>{
    const next=event.detail?.quality;
    if(['auto','data','high'].includes(next)&&next!==preference) setPreference(next);
  });

  state=resolve();
  rootElement.dataset.pcQuality=state.tier;
  rootElement.dataset.pcQualityPreference=preference;
  rootElement.dataset.pcNetwork=state.online?'online':'offline';
  root.ProjectCurseQuality=Object.freeze({version:'1.0.0',getState,getDiagnostics,allows,setPreference,refresh:()=>evaluate('manual')});
})(window);
