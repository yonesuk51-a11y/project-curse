// Project Curse 5.15.2cv — permanent terminal shell and route owner.
(function(){
  'use strict';

  const ready=(callback)=>document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',callback,{once:true})
    : callback();

  ready(function(){
    const content=document.querySelector('.uac-shell-content');
    const homeControl=document.querySelector('.uac-shell-home[data-uac-route="terminal-home"]');
    const pages=Array.from(document.querySelectorAll('.content-page[id]'));
    const screenIds=new Set(pages.map(page=>page.id));
    if(!content||!homeControl||!pages.length) return;

    let currentRoute='terminal-home';

    function normalize(target){
      if(target==='faction-relation') return 'faction-info';
      if(target==='region-map'||target==='zone-map') return 'history';
      return screenIds.has(target)?target:'terminal-home';
    }

    function replayScreenEntrance(page){
      page.classList.remove('uac-screen-entering');
      void page.offsetWidth;
      page.classList.add('uac-screen-entering');
      window.setTimeout(()=>page.classList.remove('uac-screen-entering'),620);
    }

    function navigate(rawTarget,{replace=true}={}){
      const target=normalize(rawTarget);
      const activePage=pages.find(page=>page.id===target);
      const previous=currentRoute;

      document.dispatchEvent(new CustomEvent('projectcurse:route-will-change',{detail:{target,previous}}));
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
      document.body.dataset.route=target;
      homeControl.hidden=target==='terminal-home';
      homeControl.setAttribute('aria-hidden',target==='terminal-home'?'true':'false');
      content.scrollTop=0;
      content.scrollLeft=0;
      replayScreenEntrance(activePage);

      if(replace){
        try{history.replaceState(null,'','#'+target);}catch(_error){}
      }
      document.dispatchEvent(new CustomEvent('projectcurse:screen-committed',{detail:{target,previous}}));
      return target;
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
      navigate(routeControl.dataset.uacRoute,{replace:true});
    },true);

    document.addEventListener('pointerdown',event=>{
      const control=event.target.closest?.('button, a, [role="button"]');
      if(control) pulse(control);
    },{capture:true,passive:true});

    const initialHash=decodeURIComponent(location.hash.replace(/^#/,''));
    navigate(screenIds.has(initialHash)?initialHash:'terminal-home',{replace:true});

    window.showPage=(target)=>navigate(target,{replace:true});
    window.ProjectCurseShell=Object.freeze({
      navigate,
      getRoute:()=>currentRoute,
      getScrollRoot:()=>content
    });
  });
})();
