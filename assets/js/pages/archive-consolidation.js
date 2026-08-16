// Project Curse 5.25.0 — public archive and conditional field-verdict index owner.
(function(){
  'use strict';
  const archive=window.ProjectCurseArchive;
  const verdicts=window.ProjectCurseVerdictArchiveState;
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
      const rows=archive.publicRecords.filter(record=>record.format===format).map(record=>`<button type="button" class="pc-archive-row" data-pc-public-record="1" data-pc-archive-open="${esc(record.id)}" data-pc-archive-format="${format}">
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
      ${verdictMarkup()}
    </section>`;
  }

  function verdictMarkup(){
    if(!verdicts) return '';
    const summary=verdicts.getSummary();
    const entries=verdicts.list();
    const group=(scenarioId,code,title)=>{
      const rows=entries.filter(entry=>entry.scenarioId===scenarioId).map(entry=>{
        const state=entry.unlocked?(entry.unread?'새 기록':'복호화 완료'):'잠김';
        const label=entry.unlocked?entry.title:entry.lockedTitle;
        const copy=entry.unlocked?entry.summary:entry.requirement;
        return `<button type="button" class="pc-archive-row pc-verdict-row ${entry.unlocked?'is-unlocked':'is-locked'} ${entry.unread?'is-unread':''}" data-pc-verdict-id="${esc(entry.id)}" ${entry.unlocked?`data-pc-archive-open="${esc(entry.id)}"`:''} aria-disabled="${entry.unlocked?'false':'true'}">
          <code>${esc(entry.id)}</code><span><b>${esc(label)}</b><small>${esc(copy)}</small></span><i>${esc(state)}${entry.unlocked?'&nbsp;›':''}</i>
        </button>`;
      }).join('');
      return `<section class="pc-verdict-subgroup" data-verdict-scenario="${esc(scenarioId)}"><header><span>${esc(code)}</span><h5>${esc(title)}</h5></header><div class="pc-archive-row-list">${rows}</div></section>`;
    };
    return `<section class="pc-verdict-archive" aria-label="현장 판정 기록">
      <header class="pc-verdict-head"><div><span>FIELD VERDICT ARCHIVE</span><h4>현장 판정 기록</h4><p>직접 확인한 결말의 기록만 열린다. 결말이 확정된 순간의 선택과 측정값은 별도 사본으로 보존된다.</p></div><dl><div><dt>열린 기록</dt><dd>${summary.unlocked} / ${summary.total}</dd></div><div><dt>읽지 않음</dt><dd>${summary.unread}</dd></div></dl></header>
      ${group('unlit-fortress','GBF / WESTERN PILGRIMAGE','대흑림 서부 순례 판정')}
      ${group('deadzone-return','DZ / RETURN SCREENING','데드존 귀환 검문 판정')}
      <details class="pc-verdict-manage"><summary>판정 기록 관리</summary><div><p>시나리오의 현재 진행을 초기화해도 여기 보존된 판정 기록은 남는다. 아래 작업은 판정 보관소에만 적용된다.</p><button type="button" data-verdict-reset="read">모든 기록을 읽지 않음으로 표시</button><button type="button" data-verdict-reset="unlit-fortress">대흑림 판정 기록 삭제</button><button type="button" data-verdict-reset="deadzone-return">데드존 판정 기록 삭제</button><button type="button" class="is-danger" data-verdict-reset="all">모든 판정 기록 삭제</button></div></details>
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
    q('.uac-shell-content')?.scrollTo({top:0,behavior:'auto'});
    return true;
  }

  function returnToIndex(){
    window.ProjectCurseInternalDocumentViewer?.close?.();
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
    const rows=qa('.pc-archive-index-host > [data-pc-archive-owner="1"] .pc-archive-row[data-pc-public-record]');
    const ids=rows.map(row=>row.dataset.pcArchiveOpen).join('|');
    const expectedIds=['video','document'].flatMap(format=>archive.publicRecords.filter(record=>record.format===format).map(record=>record.id)).join('|');
    const verdictRows=qa('.pc-verdict-row');
    return {
      name:'archiveIndex',
      patch:'5.25.0',
      ok:ids===expectedIds&&(!verdicts||verdictRows.length===verdicts.getSummary().total),
      records:rows.length,
      verdicts:verdictRows.length,
      issues:ids===expectedIds?[]:[{level:'error',code:'PUBLIC_INDEX_MISMATCH',message:ids}]
    };
  }

  function openRecord(id,trigger){
    const record=archive.publicRecords.find(item=>item.id===id);
    const verdict=verdicts?.getEntry?.(id);
    if(!record&&!verdict) return false;
    if(verdict){
      if(!verdict.unlocked) return false;
      const opened=window.ProjectCurseInternalDocumentViewer?.open?.(id,trigger||null)!==false;
      if(opened) verdicts.markRead(id);
      return opened;
    }
    normalize();
    if(record.format==='video'&&window.ProjectCurseCinematicRegistry?.get?.(id)&&typeof window.ProjectCurseRecordCinematic?.start==='function'){
      return window.ProjectCurseRecordCinematic.start(id)!==false;
    }
    if(record.format==='document') return window.ProjectCurseInternalDocumentViewer?.open?.(id,trigger||null)!==false;
    const opened=typeof window.ProjectCurseShowInternalRecord==='function'?window.ProjectCurseShowInternalRecord(id):false;
    if(opened===false) return openOriginal(id)!==false;
    return true;
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
        if(openRecord(open.dataset.pcArchiveOpen,open)===false) window.ProjectCurseAudio?.playCue?.('denied',300);
        return;
      }
      const lockedVerdict=event.target.closest?.('[data-pc-verdict-id]:not([data-pc-archive-open])');
      if(lockedVerdict){
        event.preventDefault();event.stopImmediatePropagation();
        window.ProjectCurseAudioControl?.play?.('system.denied');
        lockedVerdict.classList.remove('is-denied');void lockedVerdict.offsetWidth;lockedVerdict.classList.add('is-denied');
        return;
      }
      const reset=event.target.closest?.('[data-verdict-reset]');
      if(reset){
        event.preventDefault();event.stopImmediatePropagation();
        const scope=reset.dataset.verdictReset;
        if(scope==='read'){verdicts?.resetRead?.();return;}
        if(reset.dataset.confirmReset!=='1'){
          reset.dataset.confirmReset='1';reset.dataset.originalLabel=reset.textContent;
          reset.textContent='한 번 더 눌러 삭제 확인';
          window.ProjectCurseAudioControl?.play?.('system.denied');
          window.setTimeout(()=>{if(reset.isConnected){delete reset.dataset.confirmReset;reset.textContent=reset.dataset.originalLabel||'판정 기록 삭제';}},4200);
          return;
        }
        if(scope==='all') verdicts?.clearAll?.();
        else verdicts?.clearScenario?.(scope);
        window.ProjectCurseAudioControl?.play?.('system.alert');
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
    document.addEventListener('projectcurse:verdict-archive-change',()=>renderIndex());
    window.ProjectCurseRuntimeModules=window.ProjectCurseRuntimeModules||{};
    window.ProjectCurseRuntimeModules.archiveIndex={owner:'assets/js/pages/archive-consolidation.js',normalize,open:openRecord,openOriginal,check};
  });
})();
