// MapPatch 5.15.2ce — shared tag and duplicate-connection cleanup
(function(){
  'use strict';
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const ready=(fn)=>document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',fn,{once:true})
    : fn();

  const hiddenSelectors=[
    '#archive-entry .pc5152bc-archive-controls',
    '#archive-entry .pc5152bc-archive-counter',
    '#archive-entry .pc5152bx-archive-axis-panel',
    '#archive-entry [data-pc5152by-axis-filter]',
    '#faction-info .pc5152bc-faction-controls',
    '#faction-info .pc5152bx-faction-filter-status',
    '#faction-relation .pc5152bc-relation-controls'
  ];
  const removeSelectors=[
    '.pc5152bg-link-row',
    '.pc5152bg-faction-crosspanel',
    '.pc5134-faction-side',
    '.relation-trace-panel',
    '#archive-entry .pc5152ca-related',
    '#archive-entry .pc5152by-linked-note',
    '#archive-entry .pc5152by-card-links',
  ];

  function apply(){
    document.body?.classList.add('pc5152ce-shared-declutter');
    hiddenSelectors.forEach(selector=>qa(selector).forEach(el=>{
      el.hidden=true;
      el.setAttribute('aria-hidden','true');
    }));
    removeSelectors.forEach(selector=>qa(selector).forEach(el=>el.remove()));

    const viewerStatus=q('#archive-entry .viewer-status');
    if(viewerStatus && /연결 기록/.test(viewerStatus.textContent||'')){
      viewerStatus.textContent='U.A.C 사건 파일 / 원본 기록';
    }
    const search=q('#archive-entry .pc5152bc-search');
    if(search) search.setAttribute('aria-label','기록 검색');
  }

  function report(){
    const visibleHidden=hiddenSelectors.flatMap(selector=>qa(selector)).filter(el=>!el.hidden);
    const duplicates=removeSelectors.flatMap(selector=>qa(selector));
    return {
      name:'sharedDeclutter',
      ok:visibleHidden.length===0 && duplicates.length===0,
      hiddenControls:hiddenSelectors.flatMap(selector=>qa(selector)).length,
      duplicatePanels:duplicates.length,
      issues:[
        ...visibleHidden.map(el=>({level:'warn',code:'TAG_CONTROL_VISIBLE',message:el.className||el.id})),
        ...duplicates.map(el=>({level:'warn',code:'DUPLICATE_CONNECTION_PANEL',message:el.className||el.id}))
      ]
    };
  }

  ready(()=>{
    apply();
    const roots=['archive-entry','faction-info','faction-relation']
      .map(id=>document.getElementById(id)).filter(Boolean);
    let queued=false;
    const schedule=()=>{
      if(queued) return;
      queued=true;
      requestAnimationFrame(()=>{queued=false;apply();});
    };
    roots.forEach(root=>{
      try{ new MutationObserver(schedule).observe(root,{childList:true,subtree:true}); }catch(_e){}
    });
    window.ProjectCurseRuntimeModules=window.ProjectCurseRuntimeModules||{};
    window.ProjectCurseRuntimeModules.sharedDeclutter={owner:'assets/js/pages/shared-declutter.js',apply,check:report};
  });
})();
