// Project Curse 5.32.0 — permanent terminal shell, route and channel handoff owner.
(function(){
  'use strict';

  const ready=(callback)=>document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',callback,{once:true})
    : callback();

  ready(function(){
    const content=document.querySelector('.uac-shell-content');
    const homeControl=document.querySelector('.uac-shell-home[data-uac-route="terminal-home"]');
    const shellBar=document.querySelector('.uac-shell-bar');
    const switchControl=document.querySelector('.uac-shell-switch');
    const currentLabel=document.querySelector('[data-uac-current-label]');
    const pages=Array.from(document.querySelectorAll('.content-page[id]'));
    const screenIds=new Set(pages.map(page=>page.id));
    if(!content||!homeControl||!pages.length) return;

    let currentRoute='terminal-home';
    let transitioning=false;
    let queuedRequest=null;

    function normalize(target){
      if(target==='faction-relation') return 'faction-info';
      if(target==='region-map'||target==='zone-map'||target==='operation-map') return 'map-room';
      return screenIds.has(target)?target:'terminal-home';
    }

    function screenLabel(target){
      const buildScreen=window.ProjectCurseBuild?.screens?.find(screen=>screen.id===target);
      return buildScreen?.label||target;
    }

    function closeQuickNav(){
      shellBar?.classList.remove('is-quick-open');
      switchControl?.setAttribute('aria-expanded','false');
    }

    function updateChrome(target){
      document.body.dataset.route=target;
      if(currentLabel) currentLabel.textContent=screenLabel(target);
      document.querySelectorAll('[data-uac-route]').forEach(control=>{
        if(normalize(control.dataset.uacRoute)===target) control.setAttribute('aria-current','page');
        else control.removeAttribute('aria-current');
      });
      homeControl.hidden=target==='terminal-home';
      homeControl.setAttribute('aria-hidden',target==='terminal-home'?'true':'false');
      closeQuickNav();
    }

    function writeHistory(target,mode){
      if(mode==='none') return;
      try{
        if(mode==='push') history.pushState({route:target},'','#'+target);
        else history.replaceState({route:target},'','#'+target);
      }catch(_error){}
    }

    function commitRoute(target,previous,historyMode){
      const activePage=pages.find(page=>page.id===target)||pages[0];
      pages.forEach(page=>{
        const active=page===activePage;
        page.classList.toggle('active',active);
        if(active){
          page.removeAttribute('inert');
          page.removeAttribute('aria-hidden');
        }else{
          page.setAttribute('inert','');
          page.setAttribute('aria-hidden','true');
        }
      });
      currentRoute=target;
      updateChrome(target);
      content.scrollTop=0;
      content.scrollLeft=0;
      writeHistory(target,historyMode);
      document.dispatchEvent(new CustomEvent('projectcurse:screen-committed',{detail:{target,previous}}));
      return activePage;
    }

    function focusScreen(target){
      const page=document.getElementById(target);
      const heading=page?.querySelector('h1,h2,[data-screen-heading]');
      if(!heading) return;
      if(!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex','-1');
      try{heading.focus({preventScroll:true});}catch(_error){}
    }

    function queue(target,options){
      return new Promise(resolve=>{
        if(queuedRequest) queuedRequest.resolvers.forEach(done=>done(currentRoute));
        queuedRequest={target,options,resolvers:[resolve]};
      });
    }

    async function navigate(rawTarget,{replace=true,historyMode,instant=false,focus=true}={}){
      const target=normalize(rawTarget);
      const resolvedHistoryMode=historyMode||(replace?'replace':'push');
      if(transitioning) return queue(target,{replace,historyMode:resolvedHistoryMode,instant,focus});
      if(target===currentRoute&&!instant){
        closeQuickNav();
        return target;
      }

      const previous=currentRoute;
      let committed=false;
      const commit=()=>{
        if(committed) return document.getElementById(target);
        committed=true;
        return commitRoute(target,previous,resolvedHistoryMode);
      };

      transitioning=true;
      document.dispatchEvent(new CustomEvent('projectcurse:route-will-change',{detail:{target,previous}}));
      try{
        if(window.ProjectCurseTransition?.run){
          await window.ProjectCurseTransition.run({from:previous,to:target,commit,instant});
        }else{
          commit();
        }
        if(!committed) commit();
        if(focus&&!instant) focusScreen(target);
        return target;
      }finally{
        transitioning=false;
        if(queuedRequest){
          const next=queuedRequest;
          queuedRequest=null;
          navigate(next.target,next.options).then(result=>next.resolvers.forEach(done=>done(result)));
        }
      }
    }

    function pulse(control){
      if(!control) return;
      control.classList.remove('uac-control-pulse');
      void control.offsetWidth;
      control.classList.add('uac-control-pulse');
      window.setTimeout(()=>control.classList.remove('uac-control-pulse'),220);
    }

    document.addEventListener('click',event=>{
      const routeControl=event.target.closest?.('[data-uac-route]');
      if(!routeControl) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      pulse(routeControl);
      const operation=routeControl.dataset.uacMapOperation;
      const incident=routeControl.dataset.uacMapIncident;
      const pilgrimage=routeControl.dataset.uacPilgrimage;
      const archiveRecord=routeControl.dataset.uacArchiveRecord;
      const historyRecord=routeControl.dataset.uacHistoryRecord;
      navigate(routeControl.dataset.uacRoute,{replace:false,historyMode:'push'}).then(target=>{
        if(target==='map-room'){
          if(operation) window.ProjectCurseMapRoomRuntime?.showOperation?.(operation);
          else if(incident) window.ProjectCurseMapRoomRuntime?.showIncident?.(incident);
          if(pilgrimage) window.ProjectCursePilgrimageRuntime?.open?.(pilgrimage);
        }else if(target==='archive-entry'&&archiveRecord) window.ProjectCurseRuntimeModules?.archiveIndex?.open?.(archiveRecord,routeControl);
        else if(target==='history'&&historyRecord) window.ProjectCurseWorldHistoryRuntime?.open?.(historyRecord);
      });
    },true);

    switchControl?.addEventListener('click',event=>{
      event.preventDefault();
      const open=!shellBar?.classList.contains('is-quick-open');
      shellBar?.classList.toggle('is-quick-open',open);
      switchControl.setAttribute('aria-expanded',open?'true':'false');
    });

    document.addEventListener('keydown',event=>{
      if(event.key==='Escape') closeQuickNav();
    });

    document.addEventListener('pointerdown',event=>{
      const control=event.target.closest?.('button, a, [role="button"]');
      if(control) pulse(control);
    },{capture:true,passive:true});

    const followLocation=()=>{
      const hash=decodeURIComponent(location.hash.replace(/^#/,''));
      navigate(hash||'terminal-home',{historyMode:'none',replace:false,focus:true});
    };
    window.addEventListener('popstate',followLocation);
    window.addEventListener('hashchange',()=>{
      const hash=normalize(decodeURIComponent(location.hash.replace(/^#/,''))||'terminal-home');
      if(hash!==currentRoute&&!transitioning) followLocation();
    });

    const initialHash=decodeURIComponent(location.hash.replace(/^#/,''));
    const initialRoute=normalize(initialHash||'terminal-home');
    currentRoute=initialRoute;
    commitRoute(initialRoute,initialRoute,'replace');
    document.documentElement.dataset.channelTheme=window.ProjectCurseTransition?.getPreset?.(initialRoute)?.theme||'command';

    window.showPage=(target)=>navigate(target,{replace:false,historyMode:'push'});
    window.ProjectCurseShell=Object.freeze({
      navigate,
      getRoute:()=>currentRoute,
      getScrollRoot:()=>content,
      isTransitioning:()=>transitioning
    });
  });
})();
