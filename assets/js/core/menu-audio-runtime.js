// MapPatch 5.15.2ce — single menu and record audio owner
(function(){
  'use strict';
  window.ProjectCurseManagedAudio=true;

  const structure=window.ProjectCurseStructure||{};
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const ready=(fn)=>document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',fn,{once:true})
    : fn();
  const screens=new Set((structure.screens||[]).map(s=>s.id));
  const files=structure.audio?.effects||{};
  const defs={
    mount:{file:files.mount||'pc5152h_record_mount_clear.wav',volume:.52,cooldown:720},
    projector:{file:files.projector||'pc5152p_internal_projector_vhs_step.wav',volume:.38,cooldown:180},
    denied:{file:files.denied||'pc5152f_low_denied_oldpc.wav',volume:.58,cooldown:420},
    boot:{file:files.boot||'pc5152f_boot_access_oldpc.wav',volume:.42,cooldown:1600}
  };
  const state={mode:'BOOT',gesture:false,page:'',drawer:null,cueAt:Object.create(null),pool:Object.create(null),ambient:null,fade:0,queued:false};

  function prefix(){
    const path=location.pathname||'';
    if(path.includes('/docs/')) return '../../';
    if(path.includes('/archive/')) return '../';
    return '';
  }
  function enabled(){
    try{return localStorage.getItem('pc_audio_legacy2003_fixed')!=='off';}catch(_e){return true;}
  }
  function activePage(){return q('.content-page.active[id]')?.id||'';}
  function setDrawerOpen(open){
    open=!!open;
    document.body.classList.toggle('pc584-main-drawer-open',open);
    document.body.classList.toggle('pc5152be-drawer-open',open);
    qa('.pc5152an-menu,.pc584-main-drawer-toggle').forEach(button=>{
      button.textContent=open?'×':'☰';
      button.setAttribute('aria-expanded',open?'true':'false');
      button.setAttribute('aria-label',open?'사이드 메뉴 닫기':'사이드 메뉴 열기');
    });
    qa('.pc5152ar-drawer-backdrop,.pc584-drawer-backdrop').forEach(backdrop=>{
      backdrop.setAttribute('aria-hidden',open?'false':'true');
      backdrop.style.pointerEvents=open?'auto':'none';
    });
    const sidebar=q('.legacy-sidebar');
    if(sidebar){
      sidebar.setAttribute('aria-hidden',open?'false':'true');
      if(open) sidebar.removeAttribute('inert');
      else sidebar.setAttribute('inert','');
    }
    try{localStorage.setItem('pc-main-drawer-open',open?'open':'closed');}catch(_e){}
  }
  function sealDrawerClosed(){
    setDrawerOpen(false);
  }
  function commitScreen(target,{replace=true,closeDrawer=true}={}){
    const pages=qa('.content-page[id]');
    if(!pages.length) return false;
    if(target==='faction-relation') target='faction-info';
    if(target==='region-map'||target==='zone-map') target='history';
    if(!screens.has(target)||!pages.some(page=>page.id===target)) target='terminal-home';
    pages.forEach(page=>{
      const active=page.id===target;
      page.classList.toggle('active',active);
      page.style.pointerEvents=active?'auto':'none';
      if(active){
        page.removeAttribute('inert');
        page.removeAttribute('aria-hidden');
      }else{
        page.setAttribute('inert','');
        page.setAttribute('aria-hidden','true');
      }
    });
    qa('.side-menu a[data-target]').forEach(link=>link.classList.toggle('active',link.dataset.target===target));
    const content=q('.legacy-content');
    if(content) content.scrollTop=0;
    if(closeDrawer){
      sealDrawerClosed();
      // Retired routers used to update the same classes later in the event.
      // Reassert the canonical closed state after the current dispatch too.
      queueMicrotask(sealDrawerClosed);
      requestAnimationFrame(sealDrawerClosed);
    }
    if(replace){try{history.replaceState(null,'','#'+target);}catch(_e){}}
    document.body.dataset.pc5152cnRoute=target;
    document.dispatchEvent(new CustomEvent('projectcurse:screen-committed',{detail:{target}}));
    return true;
  }
  function installInitialRoute(){
    const returningToArchive=new URLSearchParams(location.search).get('return')==='archive';
    // A full terminal boot always begins at the idle terminal. Hash fragments
    // left by an earlier local-file session must not reopen the last screen.
    const target=returningToArchive?'archive-entry':'terminal-home';
    commitScreen(target,{replace:true,closeDrawer:true});
    document.body.dataset.pc5152cnInitialRoute=target;
  }
  function visibleRecord(){
    const viewer=q('#archiveRecordViewer');
    if(!viewer || viewer.hidden) return false;
    return qa('.record-detail[data-record]',viewer).some(el=>!el.hidden && (el.classList.contains('active')||el.offsetParent!==null));
  }
  function recordMode(){
    const body=document.body;
    if(!body) return false;
    return visibleRecord() || [
      'pc5152h-sequence-open','pc5152i-sequence-intro-playing','pc5152q-immortality-sequence',
      'pc5152h-cult-source-sequence','pc5133-case-file-open'
    ].some(name=>body.classList.contains(name));
  }
  function derive(){
    if(document.hidden) return 'HIDDEN';
    if(recordMode()) return 'RECORD';
    return screens.has(activePage()) ? 'MENU' : 'SILENT';
  }

  function ensureAmbient(){
    const bus=window.ProjectCurseAudio;
    let ambient=state.ambient || bus?.audio?.ambient;
    const asset=structure.audio?.ambient||'pc5152am_menu_old_computer.mp3';
    if(!ambient || !String(ambient.src||'').includes(asset)) ambient=new Audio(prefix()+'assets/audio/'+asset);
    ambient.loop=true;
    ambient.preload='metadata';
    state.ambient=ambient;
    if(bus?.audio) bus.audio.ambient=ambient;
    return ambient;
  }
  function cancelFade(){state.fade++;}
  function fadeAmbient(target,duration,pause){
    const ambient=ensureAmbient();
    if(!ambient) return;
    target=Math.max(0,Math.min(.12,target));
    if(target>0 && (!state.gesture || !enabled() || document.hidden)) target=0;
    if(target>0 && ambient.paused){
      try{ambient.volume=0;ambient.play().catch(()=>{});}catch(_e){}
    }
    const token=++state.fade;
    const start=Number(ambient.volume)||0;
    const at=performance.now();
    function step(now){
      if(token!==state.fade) return;
      const p=Math.min(1,(now-at)/Math.max(1,duration));
      const eased=1-Math.pow(1-p,3);
      try{ambient.volume=start+(target-start)*eased;}catch(_e){}
      if(p<1){requestAnimationFrame(step);return;}
      if(pause || target===0){try{ambient.pause();ambient.volume=0;}catch(_e){}}
    }
    requestAnimationFrame(step);
  }

  function effect(name){
    const def=defs[name]; if(!def) return null;
    const pool=state.pool[name]||(state.pool[name]=[]);
    let audio=pool.find(item=>item.paused||item.ended);
    if(!audio){audio=new Audio(prefix()+'assets/audio/'+def.file);audio.preload='auto';pool.push(audio);if(pool.length>2)pool.shift();}
    return audio;
  }
  function play(name,key=name,cooldown){
    if(!enabled()) return;
    const def=defs[name]; if(!def) return;
    const now=performance.now(), wait=Number.isFinite(cooldown)?cooldown:def.cooldown;
    if(state.cueAt[key] && now-state.cueAt[key]<wait) return;
    state.cueAt[key]=now;
    const audio=effect(name); if(!audio) return;
    try{audio.muted=false;audio.volume=def.volume;audio.currentTime=0;audio.play().catch(()=>{});}catch(_e){}
  }

  function managedCue(name,cooldown){
    const cue=String(name||'');
    if(['menu','drawer','command','marker'].includes(cue)) return;
    if(cue==='boot') return play('boot','boot',Math.max(cooldown||0,1600));
    if(['denied','alert'].includes(cue)) return play('denied','denied',Math.max(cooldown||0,420));
    if(['open','load','video','radio','restricted'].includes(cue)) return play('mount','record-mount',Math.max(cooldown||0,720));
    if(cue==='page') return play('projector','record-page',Math.max(cooldown||0,180));
    const native=window.ProjectCurseAudio?.__pc5152ceNativePlayCue;
    if(typeof native==='function') return native(cue,cooldown);
  }
  function installBus(){
    const bus=window.ProjectCurseAudio; if(!bus) return;
    if(!bus.__pc5152ceNativePlayCue && typeof bus.playCue==='function') bus.__pc5152ceNativePlayCue=bus.playCue.bind(bus);
    bus.playCue=managedCue;
    bus.startAmbient=()=>{state.gesture=true;sync();};
    bus.stopMenuAmbient=()=>fadeAmbient(0,360,true);
    bus.syncAudioState=sync;
    bus.menuAudioManager={sync,state:report,play};
    Object.entries(bus.audio||{}).forEach(([key,audio])=>{
      if(key==='ambient'||!audio) return;
      try{audio.muted=true;}catch(_e){}
    });
  }
  function syncDrawer(){
    const open=document.body?.classList.contains('pc584-main-drawer-open')||false;
    state.drawer=open;
  }
  function sync(){
    if(!document.body) return;
    installBus();
    syncDrawer();
    const page=activePage();
    state.page=page;
    const next=derive();
    state.mode=next;
    document.body.dataset.pc5152ceAudioState=next.toLowerCase();
    if(next==='MENU') fadeAmbient(.10,650,false);
    else fadeAmbient(0,next==='HIDDEN'?120:420,true);
  }
  function queue(delay=0){
    if(delay){setTimeout(sync,delay);return;}
    if(state.queued) return;
    state.queued=true;
    queueMicrotask(()=>{state.queued=false;sync();});
  }
  function report(){
    const ambient=ensureAmbient();
    return {name:'menuAudio',patch:'5.15.2ce',mode:state.mode,page:activePage(),gesture:state.gesture,paused:ambient?.paused??true,volume:Number(ambient?.volume||0),source:ambient?.src||null};
  }

  let lastMenuRouteAt=0;
  let lastMenuRouteTarget='';
  let lastDrawerPressAt=0;
  function routeFromMenuPress(event){
    const link=event.target?.closest?.('.side-menu a[data-target]');
    if(!link) return false;
    const target=link.dataset.target||'terminal-home';
    const now=performance.now();
    if(target!==lastMenuRouteTarget||now-lastMenuRouteAt>500){
      lastMenuRouteTarget=target;
      lastMenuRouteAt=now;
      commitScreen(target,{replace:true,closeDrawer:true});
      queue();
    }
    // Capture at Window, before the retired document-level routers can leave
    // the new screen inert. Keep the later click available to page modules.
    event.stopPropagation();
    if(event.stopImmediatePropagation) event.stopImmediatePropagation();
    return true;
  }
  function drawerFromMenuPress(event){
    const toggle=event.target?.closest?.('.pc5152an-menu,.pc584-main-drawer-toggle');
    const backdrop=event.target?.closest?.('.pc5152ar-drawer-backdrop,.pc584-drawer-backdrop');
    if(!toggle&&!backdrop) return false;
    const now=performance.now();
    if(now-lastDrawerPressAt>500){
      lastDrawerPressAt=now;
      if(backdrop) sealDrawerClosed();
      else setDrawerOpen(!document.body.classList.contains('pc584-main-drawer-open'));
      queue();
    }
    if(event.cancelable) event.preventDefault();
    event.stopPropagation();
    if(event.stopImmediatePropagation) event.stopImmediatePropagation();
    return true;
  }

  ready(()=>{
    document.body.classList.add('pc5152ce-managed-audio');
    document.body.classList.add('pc5152cp-site-shell');
    installInitialRoute();
    installBus();
    window.addEventListener('touchstart',event=>{
      state.gesture=true;
      routeFromMenuPress(event);
    },{capture:true,passive:true});
    window.addEventListener('pointerdown',event=>{
      state.gesture=true;
      if(routeFromMenuPress(event)) return;
      if(drawerFromMenuPress(event)) return;
      const target=event.target;
      if(!target?.closest){queue();return;}
      if(target.closest('#archiveListWrap .doc-card[data-access="sealed"],#archiveListWrap [aria-disabled="true"]')) play('denied','denied',420);
      else if(target.closest('.open-record,[data-open-record],[data-pc5152ca-open]')) play('mount','record-mount',720);
      else if(target.closest('.page-tab,.sub-tab,[data-seq-next]')) play('projector','record-page',180);
      queue();[80,380,900].forEach(queue);
    },true);
    window.addEventListener('click',event=>{
      state.gesture=true;
      if(routeFromMenuPress(event)) return;
      drawerFromMenuPress(event);
    },true);
    window.addEventListener('keydown',()=>{state.gesture=true;queue();},true);
    ['hashchange','pageshow','resize','orientationchange'].forEach(name=>window.addEventListener(name,()=>queue(100),{passive:true}));
    document.addEventListener('visibilitychange',sync,{passive:true});
    try{new MutationObserver(()=>queue()).observe(document.body,{attributes:true,attributeFilter:['class']});}catch(_e){}
    const viewer=q('#archiveRecordViewer');
    if(viewer){try{new MutationObserver(()=>queue()).observe(viewer,{attributes:true,attributeFilter:['hidden','class'],childList:true,subtree:true});}catch(_e){}}
    sync();
    window.ProjectCurseRuntimeModules=window.ProjectCurseRuntimeModules||{};
    window.showPage=target=>commitScreen(target,{replace:true,closeDrawer:true});
    window.ProjectCurseShell=Object.freeze({navigate:window.showPage,setDrawerOpen,closeDrawer:sealDrawerClosed,activePage});
    window.ProjectCurseRuntimeModules.menuAudio={owner:'assets/js/core/menu-audio-runtime.js',sync,check:report};
  });
})();
