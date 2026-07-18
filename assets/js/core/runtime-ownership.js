// Project Curse 5.15.2co — runtime ownership firewall
(function(){
  'use strict';
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  const qa=(selector,root=document)=>Array.from(root.querySelectorAll(selector));

  function replaceListenerTarget(node){
    if(!node?.parentNode) return node;
    const clone=node.cloneNode(true);
    node.parentNode.replaceChild(clone,node);
    return clone;
  }

  function claimShell(){
    // Legacy passes attached handlers directly to these nodes. Replacing only
    // the shell controls preserves markup and state while removing those
    // handlers. The managed shell then owns navigation at Window capture.
    qa('.side-menu a[data-target],.pc5152an-menu,.pc584-main-drawer-toggle').forEach(replaceListenerTarget);
    qa('.pc584-drawer-backdrop,.mobile-backdrop,.drawer-backdrop,.content-dim,.menu-overlay').forEach(node=>{
      if(node.classList.contains('pc5152ar-drawer-backdrop')) return;
      node.setAttribute('aria-hidden','true');
      node.style.pointerEvents='none';
    });
    document.body.dataset.pcRuntimeOwnership='5.15.2co';
  }

  function report(){
    const pages=qa('.content-page[id]');
    const active=pages.filter(page=>page.classList.contains('active'));
    const duplicateIds=qa('[id]').map(node=>node.id).filter((id,index,all)=>all.indexOf(id)!==index);
    const issues=[];
    if(active.length!==1) issues.push({level:'error',code:'ACTIVE_SCREEN_OWNER',message:`활성 화면 ${active.length}개`});
    if(duplicateIds.length) issues.push({level:'error',code:'DUPLICATE_DOM_ID',message:[...new Set(duplicateIds)].join(', ')});
    return {name:'runtimeOwnership',patch:'5.15.2co',ok:issues.length===0,active:active[0]?.id||'',issues};
  }

  ready(()=>{
    claimShell();
    window.ProjectCurseRuntimeModules=window.ProjectCurseRuntimeModules||{};
    window.ProjectCurseRuntimeModules.runtimeOwnership={owner:'assets/js/core/runtime-ownership.js',claimShell,check:report};
  });
})();
