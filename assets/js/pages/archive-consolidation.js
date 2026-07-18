// MapPatch 5.15.2cf — original-record archive index
(function(){
  'use strict';
  const archive=window.ProjectCurseArchive;
  if(!archive?.publicRecords) return;

  const q=(selector,root=document)=>root.querySelector(selector);
  const qa=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const safe=value=>window.CSS?.escape?CSS.escape(String(value)):String(value).replace(/[^a-zA-Z0-9_-]/g,'\\$&');
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[char]));
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  let observer=null;
  let normalizing=false;
  let queued=false;

  function indexMarkup(){
    const group=(format,eyebrow,title)=>{
      const rows=archive.publicRecords.filter(record=>record.format===format).map(record=>`<button type="button" class="pc-archive-row" data-pc-archive-open="${esc(record.id)}" data-pc-archive-format="${format}">
        <code>${esc(record.code||record.id)}</code>
        <span><b>${esc(record.title)}</b><small>${esc(record.summary)}</small></span>
        <i>${format==='video'?'영상 재생':'문서 열람'}&nbsp;›</i>
      </button>`).join('');
      return `<section class="pc-archive-format-group pc-archive-format-${format}" aria-label="${esc(title)}">
        <header class="pc-archive-format-head"><span>${esc(eyebrow)}</span><h4>${esc(title)}</h4></header>
        <div class="pc-archive-row-list">${rows}</div>
      </section>`;
    };
    return `<section class="pc-archive-index" data-pc-archive-owner="1" aria-label="복구된 기록 색인">
      <header class="pc-archive-index-head"><span>RECOVERED ORIGINAL RECORDS</span><h3>복구된 기록</h3></header>
      ${group('video','VIDEO RECORDS','영상 기록')}
      ${group('document','DOCUMENT FILES','문서 기록')}
    </section>`;
  }

  function renderIndex(){
    const wrap=q('#archiveListWrap');
    if(!wrap) return;
    qa(':scope > .archive-groups',wrap).forEach(legacy=>legacy.remove());
    let host=q(':scope > .pc-archive-index-host',wrap);
    if(!host){
      host=document.createElement('div');
      host.className='pc-archive-index-host';
      wrap.prepend(host);
    }
    host.innerHTML=indexMarkup();
    document.body?.classList.add('pc-archive-index-active');
  }

  function openOriginal(id){
    if(!archive.publicRecords.some(record=>record.id===id)) return false;
    const viewer=q('#archiveRecordViewer');
    const wrap=q('#archiveListWrap');
    const detail=q(`#archiveRecordViewer .record-detail[data-record="${safe(id)}"]`);
    if(!viewer||!detail) return false;
    if(wrap) wrap.classList.add('is-hidden');
    viewer.hidden=false;
    qa('.record-detail',viewer).forEach(record=>{record.hidden=true;record.classList.remove('active');});
    detail.hidden=false;
    detail.classList.add('active');
    const status=q('.viewer-status',viewer);
    if(status) status.textContent='U.A.C 원본 기록';
    q('.legacy-content')?.scrollTo({top:0,behavior:'auto'});
    return true;
  }

  function returnToIndex(){
    const viewer=q('#archiveRecordViewer');
    const wrap=q('#archiveListWrap');
    if(viewer) viewer.hidden=true;
    if(wrap) wrap.classList.remove('is-hidden');
    q('[data-pc-archive-owner="1"]')?.scrollIntoView({block:'start',behavior:'auto'});
  }

  function needsNormalization(){
    const wrap=q('#archiveListWrap');
    return !!wrap&&!q(':scope > .pc-archive-index-host > [data-pc-archive-owner="1"]',wrap);
  }

  function normalize(){
    if(normalizing||!q('#archive-entry')) return;
    normalizing=true;
    observer?.disconnect();
    try{renderIndex();}
    finally{
      normalizing=false;
      const root=q('#archive-entry');
      if(root&&observer) observer.observe(root,{childList:true,subtree:true});
    }
  }

  function schedule(){
    if(queued) return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      if(needsNormalization()) normalize();
    });
  }

  function check(){
    const rows=qa('.pc-archive-index-host > [data-pc-archive-owner="1"] .pc-archive-row');
    const ids=rows.map(row=>row.dataset.pcArchiveOpen).join('|');
    return {
      name:'archiveIndex',
      patch:'5.15.2cf',
      ok:ids===archive.publicRecords.map(record=>record.id).join('|'),
      records:rows.length,
      issues:ids===archive.publicRecords.map(record=>record.id).join('|')?[]:[{level:'error',code:'PUBLIC_INDEX_MISMATCH',message:ids}]
    };
  }

  ready(()=>{
    const root=q('#archive-entry');
    if(!root) return;
    observer=new MutationObserver(schedule);
    normalize();
    observer.observe(root,{childList:true,subtree:true});
    [80,260,700,1400,2600,3800,5400].forEach(delay=>window.setTimeout(()=>{if(needsNormalization()) normalize();},delay));
    document.addEventListener('click',event=>{
      const open=event.target.closest?.('[data-pc-archive-open]');
      if(open){
        event.preventDefault();
        event.stopImmediatePropagation();
        const id=open.dataset.pcArchiveOpen;
        const record=archive.publicRecords.find(item=>item.id===id);
        if(record?.presentation==='cinematic'&&typeof window.ProjectCurseRecordCinematic?.start==='function'){
          const started=window.ProjectCurseRecordCinematic.start(id);
          if(started!==false) return;
        }
        if(record?.href){
          window.location.href=record.href;
          return;
        }
        const opened=typeof window.ProjectCurseShowInternalRecord==='function'?window.ProjectCurseShowInternalRecord(id):false;
        if(opened===false) openOriginal(id);
        return;
      }
      const back=event.target.closest?.('#archiveRecordViewer .record-back');
      const current=q('#archiveRecordViewer .record-detail.active:not([hidden])');
      if(back&&current&&archive.publicRecords.some(record=>record.id===current.dataset.record)){
        event.preventDefault();
        event.stopImmediatePropagation();
        returnToIndex();
      }
    },true);
    window.ProjectCurseRuntimeModules=window.ProjectCurseRuntimeModules||{};
    window.ProjectCurseRuntimeModules.archiveIndex={owner:'assets/js/pages/archive-consolidation.js',normalize,openOriginal,check};
  });
})();
