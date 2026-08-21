// Project Curse 5.49.0 — lore-first archive index and conditional verdict owner.
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
  const categoryOrder=['all','video','incident','region','guide','operation','entity','cult'];
  const categoryLabels={all:'전체',video:'영상',incident:'사건·회수',region:'권역',guide:'규정·안내',operation:'작전',entity:'개체',cult:'교단·오염'};
  const provenanceLabels={ORIGINAL:'원본 보존',STABILIZED:'열람 보정본',RECONSTRUCTED:'복원 추정본',UNVERIFIED:'출처 대조 대기'};
  let observer=null;
  let normalizing=false;
  let queued=false;
  let filter='all';
  let search='';

  function recordSearchText(record){
    return [record.id,record.code,record.title,record.summary,record.categoryLabel,record.format,...(record.tags||[])].join(' ').toLocaleLowerCase('ko');
  }

  function categoryCount(category){
    return archive.publicRecords.filter(record=>category==='all'||(category==='video'?record.format==='video':record.category===category)).length;
  }

  function coverMarkup(record){
    if(record.cover) return `<img src="${esc(record.cover)}" alt="" loading="lazy" decoding="async">`;
    return `<span class="pc-archive-signal-plate" aria-hidden="true"><i>${esc(record.code.slice(0,3))}</i><b>${esc(record.date)}</b></span>`;
  }

  function cardMarkup(record,index){
    const provenance=provenanceLabels[record.provenance]||provenanceLabels.UNVERIFIED;
    const action=record.format==='video'?'영상 기록 재생':'문서 기록 열람';
    const tags=(record.tags||[]).slice(0,3).map(tag=>`<li>${esc(tag)}</li>`).join('');
    return `<button type="button" class="pc-archive-card" data-pc-public-record="1" data-pc-archive-open="${esc(record.id)}" data-pc-archive-format="${esc(record.format)}" data-pc-archive-category="${esc(record.category)}" data-pc-archive-search="${esc(recordSearchText(record))}" style="--archive-order:${index}">
      <span class="pc-archive-card-visual" data-provenance="${esc(record.provenance)}">${coverMarkup(record)}<span class="pc-archive-format-mark">${record.format==='video'?'▶ SEQUENCE':'▤ DOSSIER'}</span><span class="pc-archive-risk" data-risk="${esc(record.risk)}">${esc(record.risk)}</span></span>
      <span class="pc-archive-card-body">
        <span class="pc-archive-card-meta"><code>${esc(record.code||record.id)}</code><time>${esc(record.date)}</time></span>
        <span class="pc-archive-card-title">${esc(record.title)}</span>
        <span class="pc-archive-card-summary">${esc(record.summary)}</span>
        <ul class="pc-archive-tags" aria-label="관련 표식">${tags}</ul>
        <span class="pc-archive-card-foot"><span class="pc-archive-provenance" data-provenance="${esc(record.provenance)}">${esc(provenance)}</span><i>${action}<b aria-hidden="true">→</b></i></span>
      </span>
    </button>`;
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
      <header class="pc-verdict-head"><div><span>FIELD VERDICT ARCHIVE</span><h4>현장 판정 기록</h4><p>직접 확인한 결말만 열린다. 결말이 확정된 순간의 선택과 측정값은 원본 기록과 분리한 판정 사본으로 보존된다.</p></div><dl><div><dt>열린 기록</dt><dd>${summary.unlocked} / ${summary.total}</dd></div><div><dt>읽지 않음</dt><dd>${summary.unread}</dd></div></dl></header>
      ${group('unlit-fortress','GBF / WESTERN PILGRIMAGE','대흑림 서부 순례 판정')}
      ${group('deadzone-return','DZ / RETURN SCREENING','데드존 귀환 검문 판정')}
      ${group('deadzone-recovery','DZ / OUTBOUND RECOVERY','데드존 전진 회수 판정')}
      <details class="pc-verdict-manage"><summary>판정 기록 관리</summary><div><p>시나리오의 현재 진행을 초기화해도 여기 보존된 판정 기록은 남는다. 아래 작업은 판정 보관소에만 적용된다.</p><button type="button" data-verdict-reset="read">모든 기록을 읽지 않음으로 표시</button><button type="button" data-verdict-reset="unlit-fortress">대흑림 판정 기록 삭제</button><button type="button" data-verdict-reset="deadzone-return">데드존 귀환 판정 삭제</button><button type="button" data-verdict-reset="deadzone-recovery">전진 회수 판정 삭제</button><button type="button" class="is-danger" data-verdict-reset="all">모든 판정 기록 삭제</button></div></details>
    </section>`;
  }

  function provenanceNoticeMarkup(){
    return `<aside class="pc-public-credits-note" aria-label="자료 출처 안내"><div><span>SOURCE &amp; RECONSTRUCTION</span><b>자료 출처·복원 상태 안내</b><p>기록 이미지는 원본 보존·복원 추정·출처 대조 대기를 구분한다. 복원 이미지는 실제 촬영 원본을 대신하지 않는다.</p></div><a href="MEDIA_CREDITS.md">크레딧과 공개 검토 원칙&nbsp;›</a></aside>`;
  }

  function indexMarkup(){
    const videoCount=categoryCount('video');
    const reconstructed=archive.publicRecords.filter(record=>record.provenance==='RECONSTRUCTED').length;
    const unverified=archive.publicRecords.filter(record=>record.provenance==='UNVERIFIED').length;
    const filterButtons=categoryOrder.map(category=>`<button type="button" data-pc-archive-filter="${category}" aria-pressed="${category===filter?'true':'false'}"><span>${categoryLabels[category]}</span><b>${categoryCount(category)}</b></button>`).join('');
    const cards=archive.publicRecords.map(cardMarkup).join('');
    return `<section class="pc-archive-index" data-pc-archive-owner="1" aria-label="복구 기록 신호 라이브러리">
      <header class="pc-archive-index-head">
        <div class="pc-archive-heading"><span>U.A.C / RECOVERED SIGNAL LIBRARY</span><h3>기록보관소</h3><p>영상·문서·권역 보고서를 한 색인에서 교차 열람한다. 각 이미지에는 <strong>원본 계보와 복원 상태</strong>를 함께 표시한다.</p></div>
        <dl class="pc-archive-telemetry" aria-label="보관소 상태">
          <div><dt>공개 기록</dt><dd>${archive.publicRecords.length}<small>FILES</small></dd></div>
          <div><dt>영상 시퀀스</dt><dd>${videoCount}<small>RUN</small></dd></div>
          <div><dt>복원 추정</dt><dd>${reconstructed}<small>EST.</small></dd></div>
          <div><dt>대조 대기</dt><dd>${unverified}<small>WAIT</small></dd></div>
        </dl>
      </header>
      <div class="pc-archive-console">
        <div class="pc-archive-console-head"><div><span>CLASSIFICATION MATRIX</span><b>기록 분류</b></div><label><span>색인 검색</span><input type="search" data-pc-archive-search-input autocomplete="off" spellcheck="false" value="${esc(search)}" placeholder="ID · 제목 · 키워드"></label></div>
        <div class="pc-archive-filters" role="group" aria-label="기록 분류 필터">${filterButtons}</div>
      </div>
      <div class="pc-archive-result-line"><span aria-live="polite" data-pc-archive-result>전체 ${archive.publicRecords.length}건 표시</span><i>원본 보존 / 복원 추정 / 출처 대조 대기를 구분하여 표시</i></div>
      <div class="pc-archive-card-grid">${cards}</div>
      <div class="pc-archive-empty" hidden data-pc-archive-empty><span>NO MATCHING SIGNAL</span><b>일치하는 기록이 없습니다.</b><button type="button" data-pc-archive-reset>분류 초기화</button></div>
      <aside class="pc-archive-source-legend" aria-label="이미지 출처 상태 안내"><span>SOURCE STATE</span><dl><div data-provenance="ORIGINAL"><dt>원본 보존</dt><dd>원본 출처 계열에서 회수된 자료</dd></div><div data-provenance="RECONSTRUCTED"><dt>복원 추정본</dt><dd>설정·증언을 근거로 재구성한 장면</dd></div><div data-provenance="UNVERIFIED"><dt>출처 대조 대기</dt><dd>기존 자산이나 원본 계보 확인 전인 자료</dd></div></dl></aside>
      ${provenanceNoticeMarkup()}
      ${verdictMarkup()}
    </section>`;
  }

  function applyFilters({announce=false}={}){
    const host=q('[data-pc-archive-owner="1"]');
    if(!host) return;
    const query=search.trim().toLocaleLowerCase('ko');
    let visible=0;
    qa('.pc-archive-card[data-pc-public-record]',host).forEach(card=>{
      const categoryMatch=filter==='all'||(filter==='video'?card.dataset.pcArchiveFormat==='video':card.dataset.pcArchiveCategory===filter);
      const searchMatch=!query||(card.dataset.pcArchiveSearch||'').includes(query);
      const show=categoryMatch&&searchMatch;
      card.hidden=!show;
      card.setAttribute('aria-hidden',show?'false':'true');
      if(show) visible++;
    });
    qa('[data-pc-archive-filter]',host).forEach(button=>button.setAttribute('aria-pressed',button.dataset.pcArchiveFilter===filter?'true':'false'));
    const result=q('[data-pc-archive-result]',host);
    if(result) result.textContent=`${categoryLabels[filter]||'전체'} ${visible}건 표시${query?` · “${search.trim()}” 검색`:''}`;
    const empty=q('[data-pc-archive-empty]',host);
    if(empty) empty.hidden=visible!==0;
    if(announce) window.ProjectCurseAudioControl?.play?.('archive.filter');
  }

  function renderIndex(){
    const wrap=q('#archiveListWrap');
    if(!wrap) return;
    qa(':scope > .archive-groups',wrap).forEach(legacy=>legacy.remove());
    let host=q(':scope > .pc-archive-index-host',wrap);
    if(!host){host=document.createElement('div');host.className='pc-archive-index-host';wrap.prepend(host);}
    host.innerHTML=indexMarkup();
    document.body?.classList.add('pc-archive-index-active');
    applyFilters();
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
    detail.hidden=false;detail.classList.add('active');
    const status=q('.viewer-status',viewer);if(status) status.textContent='U.A.C 원본 기록';
    q('.uac-shell-content')?.scrollTo({top:0,behavior:'auto'});
    return true;
  }

  function returnToIndex(){
    window.ProjectCurseInternalDocumentViewer?.close?.();
    const viewer=q('#archiveRecordViewer');const wrap=q('#archiveListWrap');
    if(viewer) viewer.hidden=true;if(wrap) wrap.classList.remove('is-hidden');
    q('[data-pc-archive-owner="1"]')?.scrollIntoView({block:'start',behavior:'auto'});
  }

  function needsNormalization(){
    const wrap=q('#archiveListWrap');
    return !!wrap&&!q(':scope > .pc-archive-index-host > [data-pc-archive-owner="1"]',wrap);
  }

  function normalize(){
    if(normalizing||!q('#archive-entry')) return;
    normalizing=true;observer?.disconnect();
    try{renderIndex();}
    finally{normalizing=false;const root=q('#archive-entry');if(root&&observer) observer.observe(root,{childList:true,subtree:true});}
  }

  function schedule(){
    if(queued) return;queued=true;
    requestAnimationFrame(()=>{queued=false;if(needsNormalization()) normalize();});
  }

  function check(){
    const cards=qa('.pc-archive-index-host > [data-pc-archive-owner="1"] .pc-archive-card[data-pc-public-record]');
    const ids=cards.map(card=>card.dataset.pcArchiveOpen).join('|');
    const expectedIds=archive.publicRecords.map(record=>record.id).join('|');
    const verdictRows=qa('.pc-verdict-row');
    const credits=q('.pc-public-credits-note');
    return {name:'archiveIndex',patch:'5.49.0',ok:ids===expectedIds&&cards.every(card=>card.dataset.pcArchiveCategory)&&(!verdicts||verdictRows.length===verdicts.getSummary().total)&&!!credits,records:cards.length,verdicts:verdictRows.length,media:window.ProjectCurseMediaProvenance?.stats?.registered||0,issues:ids===expectedIds?[]:[{level:'error',code:'PUBLIC_INDEX_MISMATCH',message:ids}]};
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
    if(trigger?.classList){trigger.classList.remove('is-requested');void trigger.offsetWidth;trigger.classList.add('is-requested');}
    if(record.format==='video'&&window.ProjectCurseCinematicRegistry?.get?.(id)&&typeof window.ProjectCurseRecordCinematic?.start==='function') return window.ProjectCurseRecordCinematic.start(id)!==false;
    if(record.format==='document') return window.ProjectCurseInternalDocumentViewer?.open?.(id,trigger||null)!==false;
    const opened=typeof window.ProjectCurseShowInternalRecord==='function'?window.ProjectCurseShowInternalRecord(id):false;
    return opened===false?openOriginal(id)!==false:true;
  }

  ready(()=>{
    const root=q('#archive-entry');if(!root) return;
    observer=new MutationObserver(schedule);normalize();observer.observe(root,{childList:true,subtree:true});
    [80,260,700,1400,2600,3800,5400].forEach(delay=>window.setTimeout(()=>{if(needsNormalization()) normalize();},delay));
    document.addEventListener('click',event=>{
      const filterButton=event.target.closest?.('[data-pc-archive-filter]');
      if(filterButton){event.preventDefault();filter=filterButton.dataset.pcArchiveFilter||'all';applyFilters({announce:true});return;}
      const resetFilter=event.target.closest?.('[data-pc-archive-reset]');
      if(resetFilter){event.preventDefault();filter='all';search='';const input=q('[data-pc-archive-search-input]');if(input) input.value='';applyFilters({announce:true});input?.focus();return;}
      const open=event.target.closest?.('[data-pc-archive-open]');
      if(open){event.preventDefault();event.stopImmediatePropagation();if(openRecord(open.dataset.pcArchiveOpen,open)===false) window.ProjectCurseAudioControl?.play?.('system.denied');return;}
      const lockedVerdict=event.target.closest?.('[data-pc-verdict-id]:not([data-pc-archive-open])');
      if(lockedVerdict){event.preventDefault();event.stopImmediatePropagation();window.ProjectCurseAudioControl?.play?.('system.denied');lockedVerdict.classList.remove('is-denied');void lockedVerdict.offsetWidth;lockedVerdict.classList.add('is-denied');return;}
      const reset=event.target.closest?.('[data-verdict-reset]');
      if(reset){
        event.preventDefault();event.stopImmediatePropagation();const scope=reset.dataset.verdictReset;
        if(scope==='read'){verdicts?.resetRead?.();return;}
        if(reset.dataset.confirmReset!=='1'){
          reset.dataset.confirmReset='1';reset.dataset.originalLabel=reset.textContent;reset.textContent='한 번 더 눌러 삭제 확인';window.ProjectCurseAudioControl?.play?.('system.denied');
          window.setTimeout(()=>{if(reset.isConnected){delete reset.dataset.confirmReset;reset.textContent=reset.dataset.originalLabel||'판정 기록 삭제';}},4200);return;
        }
        if(scope==='all') verdicts?.clearAll?.();else verdicts?.clearScenario?.(scope);window.ProjectCurseAudioControl?.play?.('system.alert');return;
      }
      const back=event.target.closest?.('#archiveRecordViewer .record-back');
      const current=q('#archiveRecordViewer .record-detail.active:not([hidden])');
      if(back&&current&&archive.publicRecords.some(record=>record.id===current.dataset.record)){event.preventDefault();event.stopImmediatePropagation();returnToIndex();}
    },true);
    document.addEventListener('input',event=>{
      const input=event.target.closest?.('[data-pc-archive-search-input]');
      if(!input) return;search=input.value||'';applyFilters();
    });
    document.addEventListener('projectcurse:verdict-archive-change',()=>renderIndex());
    window.ProjectCurseRuntimeModules=window.ProjectCurseRuntimeModules||{};
    window.ProjectCurseRuntimeModules.archiveIndex={owner:'assets/js/pages/archive-consolidation.js',normalize,open:openRecord,openOriginal,applyFilters,check};
  });
})();
