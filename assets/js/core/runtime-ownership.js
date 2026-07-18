// Project Curse 5.15.2cp — runtime ownership firewall
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
    let backdrop=document.querySelector('.pc5152ar-drawer-backdrop');
    if(!backdrop){
      backdrop=document.createElement('div');
      backdrop.className='pc5152ar-drawer-backdrop';
      backdrop.setAttribute('aria-hidden','true');
      document.body.appendChild(backdrop);
    }
    document.body.classList.add('pc5152cp-site-shell');
    document.body.dataset.pcRuntimeOwnership='5.15.2cp';
  }

  function visibleMenuHitIssues(){
    if(!document.body.classList.contains('pc584-main-drawer-open')) return [];
    return qa('.side-menu a[data-target]').flatMap(link=>{
      const rect=link.getBoundingClientRect();
      if(rect.width<1||rect.height<1) return [];
      const x=Math.max(0,Math.min(innerWidth-1,rect.left+rect.width/2));
      const y=Math.max(0,Math.min(innerHeight-1,rect.top+rect.height/2));
      const hit=document.elementFromPoint(x,y);
      return hit&&(hit===link||link.contains(hit))?[]:[`${link.dataset.target||link.textContent.trim()}:${hit?.className||hit?.tagName||'none'}`];
    });
  }

  function report(){
    const pages=qa('.content-page[id]');
    const active=pages.filter(page=>page.classList.contains('active'));
    const duplicateIds=qa('[id]').map(node=>node.id).filter((id,index,all)=>all.indexOf(id)!==index);
    const issues=[];
    if(active.length!==1) issues.push({level:'error',code:'ACTIVE_SCREEN_OWNER',message:`활성 화면 ${active.length}개`});
    if(duplicateIds.length) issues.push({level:'error',code:'DUPLICATE_DOM_ID',message:[...new Set(duplicateIds)].join(', ')});
    const blocked=visibleMenuHitIssues();
    if(blocked.length) issues.push({level:'error',code:'MENU_HIT_BLOCKED',message:blocked.join(', ')});
    return {name:'runtimeOwnership',patch:'5.15.2cp',ok:issues.length===0,active:active[0]?.id||'',issues};
  }

  ready(()=>{
    claimShell();
    window.ProjectCurseRuntimeModules=window.ProjectCurseRuntimeModules||{};
    window.ProjectCurseRuntimeModules.runtimeOwnership={owner:'assets/js/core/runtime-ownership.js',claimShell,check:report};
  });
})();
