// Project Curse 5.54.0 — 2006 personnel snapshot with canon names, operational cells and ability costs.
(function(){
  'use strict';

  const source=window.ProjectCursePersonnel;
  if(!source?.records?.length) return;

  const q=(selector,root=document)=>root.querySelector(selector);
  const qa=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  })[char]);
  const normalize=value=>String(value??'').toLocaleLowerCase('ko-KR').replace(/[.·_\-\s]/g,'');

  const state={query:'',group:'all',status:'all',selected:null};
  let initialized=false;

  function groupOf(id){return source.groupById[id]||{label:id,short:id,code:'PER',tone:'unknown'};}
  function statusOf(id){return source.statuses[id]||source.statuses.unknown;}
  function displayStatusOf(id){
    const status=statusOf(id);
    const labels={
      active:'2006년 활동 확인',
      deceased:'2006년 사망 기재',
      unknown:'2006년 이후 미확인'
    };
    return {...status,label:labels[id]||status.label};
  }
  function certaintyOf(id){return source.certainties[id]||source.certainties.unresolved;}
  function recordCode(record){
    const position=source.records.indexOf(record)+1;
    return `${groupOf(record.group).code}-${String(position).padStart(3,'0')}`;
  }
  function recordGroups(record){return [record.group,...(record.secondaryGroups||[])];}
  function targetName(id){return source.byId[id]?.name||id;}

  function searchText(record){
    return normalize([
      record.name,record.sourceName,...(record.aliases||[]),record.role,record.overview,record.affiliationSummary,
      ...recordGroups(record).map(id=>groupOf(id).label),
      ...(record.affiliations||[]).flatMap(item=>[item.label,item.role]),
      ...(record.capabilities||[]),...(record.equipment||[]),
      ...(record.relationships||[]).flatMap(item=>[targetName(item.target),item.relation]),
      ...Object.values(record.identity||{}),...Object.values(record.personality||{}),
      ...(record.background||[]),...(record.history||[]).flat(),...(record.fieldNotes||[]),
      record.unit,record.recordFunction,record.incident,record.abilitySource,record.abilityCost,
      ...(record.notes||[]),...(record.limits||[])
    ].join(' '));
  }

  function filteredRecords(){
    const query=normalize(state.query);
    return source.records.filter(record=>{
      if(state.group!=='all'&&!recordGroups(record).includes(state.group)) return false;
      if(state.status!=='all'&&record.status!==state.status) return false;
      return !query||searchText(record).includes(query);
    });
  }

  function groupFilters(){
    const buttons=[`<button class="is-active" data-pc-person-group="all" type="button"><span>전체 명부</span><b>${source.stats.total}</b></button>`];
    source.groups.forEach(group=>{
      const count=source.records.filter(record=>recordGroups(record).includes(group.id)).length;
      buttons.push(`<button data-pc-person-group="${esc(group.id)}" data-person-tone="${esc(group.tone)}" type="button"><span>${esc(group.short)}</span><b>${count}</b></button>`);
    });
    return buttons.join('');
  }

  function statusFilters(){
    const items=[['all','전체'],...Object.keys(source.statuses).map(id=>[id,displayStatusOf(id).label])];
    return items.map(([id,label],index)=>`<button class="${index===0?'is-active':''}" data-pc-person-status="${esc(id)}" type="button">${esc(label)}</button>`).join('');
  }

  function shellMarkup(){
    return `<div class="pc-personnel-archive" data-pc-personnel-owner="1">
      <header class="pc-personnel-intro">
        <div>
          <small>U.A.C PERSONNEL REGISTER / 2006 SNAPSHOT</small>
          <h2>인물 기록</h2>
          <p>이 명부는 2006년에 확인되거나 추정된 56명을 세계 사건 속 역할로 다시 배열한 역사 자료다. 개편 정본명과 구 명부명을 함께 보존하며, 활동 표시는 2042년 현재의 생존이나 재직을 뜻하지 않는다.</p>
        </div>
        <dl aria-label="인물 명부 상태">
          <div><dt>등록 인물</dt><dd>${source.stats.total}</dd></div>
          <div><dt>기록 기준</dt><dd>2006</dd></div>
          <div><dt>신원 보완</dt><dd>${source.stats.profiled}</dd></div>
          <div><dt>이름 정리</dt><dd>${source.stats.renamed}</dd></div>
        </dl>
      </header>
      <aside class="pc-personnel-boundary">
        <b>HISTORICAL REGISTER</b>
        <p>상태와 나이는 모두 2006년 기록을 기준으로 읽는다. 새 이름은 중앙 색인이 채택한 판독명이며 원본에 남은 이름은 구 명부명으로 보존된다. 사도 번호는 확정 계급이 아니라 서로 경쟁하는 좌석 주장으로 읽는다.</p>
        <span>BASIS / 2006</span>
      </aside>
      <section class="pc-personnel-controls" aria-label="인물 기록 검색과 필터">
        <label class="pc-personnel-search"><span>인물 검색</span><input autocomplete="off" data-pc-person-search placeholder="이름 / 출신 / 나이 / 소속 / 경력 / 능력" type="search"><i aria-hidden="true">⌕</i></label>
        <div class="pc-personnel-statuses" role="group" aria-label="상태 필터">${statusFilters()}</div>
      </section>
      <div class="pc-personnel-workspace">
        <aside class="pc-personnel-groups" aria-label="소속 분류 필터">
          <header><small>CLASSIFICATION</small><b>소속·관계군</b></header>
          <div>${groupFilters()}</div>
        </aside>
        <section class="pc-personnel-index" aria-label="인물 색인">
          <header><div><small>INDEX RESULTS</small><b data-pc-person-result-label>전체 인물</b></div><span data-pc-person-count>${source.stats.total}건</span></header>
          <div class="pc-personnel-list" data-pc-person-list></div>
        </section>
        <section class="pc-personnel-detail" data-pc-person-detail aria-live="polite">${summaryDetailMarkup(source.records)}</section>
      </div>
    </div>`;
  }

  function summaryDetailMarkup(records){
    const counts=Object.keys(source.statuses).reduce((result,id)=>{
      result[id]=source.records.filter(record=>record.status===id).length;
      return result;
    },{});
    const statusButtons=['active','deceased','unknown'].map(id=>{
      const status=displayStatusOf(id);
      return `<button data-pc-person-summary-status="${esc(id)}" type="button"><span data-person-status="${esc(status.tone)}">${esc(status.label)}</span><b>${counts[id]||0}</b><i aria-hidden="true">›</i></button>`;
    }).join('');
    return `<article class="pc-personnel-summary">
      <header><div><small>REGISTER SNAPSHOT / BASIS 2006</small><h3>선택 전 명부 판독</h3><p>이 화면은 현재 인물의 생존 명단이 아니라, 2006년 당시 확보된 관계와 신원 기록의 색인이다.</p></div><span>HISTORICAL</span></header>
      <dl aria-label="인물 명부 요약">
        <div><dt>전체 파일</dt><dd>${source.stats.total}</dd></div>
        <div><dt>현재 조건</dt><dd>${records.length}</dd></div>
        <div><dt>사망 기재</dt><dd>${counts.deceased||0}</dd></div>
        <div><dt>기준연도</dt><dd>2006</dd></div>
      </dl>
      <section><header><small>STATUS TRIAGE</small><h4>기록 상태로 좁혀 보기</h4></header><div>${statusButtons}</div></section>
      <aside><b>판독 주의</b><ul><li><strong>활동 확인</strong>은 2006년 당시의 활동 흔적을 뜻한다.</li><li><strong>사망 기재</strong>는 원 명부에 사망 표기가 있는 경우만 집계한다.</li><li><strong>이후 미확인</strong>은 2006년 이후의 행적을 현재 자료로 확정할 수 없다는 뜻이다.</li></ul><p>왼쪽 색인에서 인물을 선택하면 직접 링크가 주소에 기록된다.</p></aside>
    </article>`;
  }

  function emptyDetailMarkup(empty=false){
    return `<div class="pc-personnel-empty" data-empty-kind="${empty?'search':'selection'}">
      <i aria-hidden="true"><span></span></i>
      <small>${empty?'NO MATCHING PERSONNEL':'PERSONNEL FILE STANDBY'}</small>
      <h3>${empty?'조건에 맞는 인물이 없습니다':'인물 파일을 선택하십시오'}</h3>
      <p>${empty?'검색어나 상태·소속 필터를 조정하십시오.':'왼쪽 색인에서 인물을 선택하면 신원, 소속, 경력, 관계, 능력과 기록 한계를 한 화면에서 대조할 수 있습니다.'}</p>
    </div>`;
  }

  function cardMarkup(record){
    const group=groupOf(record.group);
    const status=displayStatusOf(record.status);
    const aliases=(record.aliases||[]).filter(alias=>alias!==record.sourceName);
    const sourceName=record.sourceName?`<small class="pc-personnel-source-name">구 명부명 ${esc(record.sourceName)}</small>`:'';
    const aliasLine=aliases.length?`<small>${esc(aliases.join(' / '))}</small>`:'';
    const identity=record.identity?`<small class="pc-personnel-card-identity">${esc(record.identity.sex)} · ${esc(record.identity.age)}</small>`:'';
    return `<button class="pc-personnel-card${state.selected===record.id?' is-selected':''}" data-pc-person-open="${esc(record.id)}" data-person-tone="${esc(group.tone)}" type="button">
      <i aria-hidden="true">${esc(group.code)}</i>
      <span><small>${esc(recordCode(record))} · ${esc(group.short)}</small><b>${esc(record.name)}</b>${sourceName}${aliasLine}<em>${esc(record.role)}</em>${identity}</span>
      <strong data-person-status="${esc(status.tone)}">${esc(status.label)}</strong>
    </button>`;
  }

  function identityMarkup(record){
    if(!record.identity) return '';
    const identity=record.identity;
    return `<section class="pc-personnel-identity" aria-label="${esc(record.name)} 신원 정보">
      <header><small>IDENTITY / RECORD BASIS</small><h4>신원과 기록 기준</h4></header>
      <dl>
        <div><dt>성별</dt><dd>${esc(identity.sex)}</dd></div>
        <div><dt>출생</dt><dd>${esc(identity.birth)}</dd></div>
        <div><dt>기록 당시 나이</dt><dd>${esc(identity.age)}</dd></div>
        <div><dt>출신</dt><dd>${esc(identity.origin)}</dd></div>
        <div><dt>국적·신분</dt><dd>${esc(identity.nationality)}</dd></div>
        <div><dt>소속 요약</dt><dd>${esc(record.affiliationSummary||groupOf(record.group).label)}</dd></div>
      </dl>
    </section>`;
  }

  function backgroundMarkup(record){
    const background=record.background||[];
    const history=record.history||[];
    if(!background.length&&!history.length) return '';
    return `<section class="pc-personnel-background">
      <header><small>BACKGROUND / CAREER TRACE</small><h4>과거 이력</h4></header>
      ${background.length?`<div class="pc-personnel-background-copy">${background.map(item=>`<p>${esc(item)}</p>`).join('')}</div>`:''}
      ${history.length?`<ol>${history.map(item=>`<li><time>${esc(item[0])}</time><span>${esc(item[1])}</span></li>`).join('')}</ol>`:''}
    </section>`;
  }

  function psychologyMarkup(record){
    if(!record.personality) return '';
    return `<section class="pc-personnel-section pc-personnel-psychology"><header><small>DISPOSITION / MOTIVE</small><h4>성향과 동기</h4></header><dl>
      <div><dt>성향</dt><dd>${esc(record.personality.temperament)}</dd></div>
      <div><dt>목표</dt><dd>${esc(record.personality.drive)}</dd></div>
      <div><dt>두려움</dt><dd>${esc(record.personality.fear)}</dd></div>
    </dl></section>`;
  }

  function fieldNotesMarkup(record){
    if(!record.fieldNotes?.length) return '';
    return `<section class="pc-personnel-section pc-personnel-field-notes"><header><small>FIELD HABIT / TELL</small><h4>현장 습관</h4></header><ul>${record.fieldNotes.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></section>`;
  }

  function affiliationMarkup(record){
    if(!record.affiliations?.length) return '';
    return `<section class="pc-personnel-section pc-personnel-affiliations"><header><small>AFFILIATION</small><h4>소속 기록</h4></header><div>${record.affiliations.map(item=>{
      const certainty=certaintyOf(item.certainty);
      return `<button type="button" data-pc-person-faction="${esc(item.key)}"><span><b>${esc(item.label)}</b><small>${esc(item.role)}</small></span><em data-certainty="${esc(certainty.tone)}">${esc(certainty.label)}</em><i aria-hidden="true">↗</i></button>`;
    }).join('')}</div></section>`;
  }

  function capabilityMarkup(record){
    const capabilities=record.capabilities||[];
    const equipment=record.equipment||[];
    if(!capabilities.length&&!equipment.length) return '';
    return `<section class="pc-personnel-section pc-personnel-capabilities"><header><small>CAPABILITY / SOURCE / COST</small><h4>능력과 대가</h4></header>
      ${capabilities.length?`<div><b>기재 능력</b><ul>${capabilities.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></div>`:''}
      ${equipment.length?`<div><b>기재 장비</b><ul>${equipment.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></div>`:''}
      ${record.abilitySource?`<dl class="pc-personnel-ability-ledger"><div><dt>발현 경로</dt><dd>${esc(record.abilitySource)}</dd></div><div><dt>확인된 대가</dt><dd>${esc(record.abilityCost||'대가 기록 미확인')}</dd></div></dl>`:''}
      <p>능력은 승리 조건이 아니다. 사용 뒤 남는 손상·기억 결손·의식 종속까지 전력으로 계산한다.</p>
    </section>`;
  }

  function canonTraceMarkup(record){
    if(!record.unit&&!record.recordFunction&&!record.incident) return '';
    return `<section class="pc-personnel-canon-trace"><header><small>WORLD FUNCTION / OPERATIONAL TRACE</small><h4>세계 안에서의 위치</h4></header><dl>
      ${record.unit?`<div><dt>작전 분류</dt><dd>${esc(record.unit)}</dd></div>`:''}
      ${record.recordFunction?`<div><dt>서사 기능</dt><dd>${esc(record.recordFunction)}</dd></div>`:''}
      ${record.incident?`<div><dt>사건 연결</dt><dd>${esc(record.incident)}</dd></div>`:''}
    </dl></section>`;
  }

  function relationshipsMarkup(record){
    if(!record.relationships?.length) return '';
    return `<section class="pc-personnel-section pc-personnel-relations"><header><small>RELATION INDEX</small><h4>직접 관계</h4></header><div>${record.relationships.map(item=>{
      const target=source.byId[item.target];
      const certainty=certaintyOf(item.certainty);
      return `<button type="button"${target?` data-pc-person-open="${esc(target.id)}"`:''}><span><b>${esc(target?.name||item.target)}</b><small>${esc(item.relation)}</small></span><em data-certainty="${esc(certainty.tone)}">${esc(certainty.label)}</em>${target?'<i aria-hidden="true">›</i>':''}</button>`;
    }).join('')}</div></section>`;
  }

  function notesMarkup(record){
    if(!record.notes?.length) return '';
    return `<section class="pc-personnel-section pc-personnel-notes"><header><small>LISTED NOTES</small><h4>남은 메모</h4></header><ul>${record.notes.map(note=>`<li>${esc(note)}</li>`).join('')}</ul></section>`;
  }

  function limitsMarkup(record){
    const limits=record.limits?.length?record.limits:['이 인물의 세부 활동과 현재 상태는 추가 기록이 필요하다.'];
    return `<aside class="pc-personnel-limits"><header><small>ARCHIVE LIMIT</small><b>이 기록으로 확정할 수 없는 것</b></header><ul>${limits.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></aside>`;
  }

  function detailNavigationMarkup(record){
    const records=filteredRecords();
    const index=records.findIndex(item=>item.id===record.id);
    const previous=index>0?records[index-1]:null;
    const next=index>=0&&index<records.length-1?records[index+1]:null;
    return `<nav class="pc-personnel-detail-nav" aria-label="인물 파일 이동">
      <button data-pc-person-back type="button"><span aria-hidden="true">←</span><b>인물 색인</b></button>
      <div>
        <button aria-label="${previous?`이전 인물, ${esc(previous.name)}`:'이전 인물 없음'}" data-pc-person-prev type="button"${previous?'':' disabled'}><span aria-hidden="true">‹</span><b>이전</b></button>
        <button aria-label="${next?`다음 인물, ${esc(next.name)}`:'다음 인물 없음'}" data-pc-person-next type="button"${next?'':' disabled'}><b>다음</b><span aria-hidden="true">›</span></button>
        <button data-pc-person-copy-link type="button"><span aria-hidden="true">⌁</span><b>직접 링크</b></button>
      </div>
    </nav>`;
  }

  function detailMarkup(record){
    const group=groupOf(record.group);
    const status=displayStatusOf(record.status);
    const certainty=certaintyOf(record.certainty);
    const aliases=(record.aliases||[]).filter(alias=>alias!==record.sourceName);
    const sourceName=record.sourceName?`<p class="pc-personnel-source">구 명부명 <b>${esc(record.sourceName)}</b></p>`:'';
    const aliasLine=aliases.length?`<p class="pc-personnel-alias">호칭·별칭 <b>${esc(aliases.join(' / '))}</b></p>`:'';
    return `<article class="pc-personnel-dossier" data-person-tone="${esc(group.tone)}" data-pc-person-selected="${esc(record.id)}">
      ${detailNavigationMarkup(record)}
      <header class="pc-personnel-dossier-head">
        <div class="pc-personnel-code"><small>${esc(recordCode(record))}</small><i aria-hidden="true">${esc(group.code)}</i></div>
        <div><small>PERSONNEL DOSSIER / BASIS 2006 / ${esc(certainty.label)}</small><h3 tabindex="-1">${esc(record.name)}</h3>${sourceName}${aliasLine}<p>${esc(record.role)}</p></div>
        <span data-person-status="${esc(status.tone)}">${esc(status.label)}</span>
      </header>
      <dl class="pc-personnel-meta">
        <div><dt>주 분류</dt><dd>${esc(group.label)}</dd></div>
        <div><dt>기록 신뢰</dt><dd data-certainty="${esc(certainty.tone)}">${esc(certainty.label)}</dd></div>
        <div><dt>직책·관계</dt><dd>${esc(record.role)}</dd></div>
        <div><dt>자료 상태</dt><dd>2006 명부 + 보완 신원</dd></div>
      </dl>
      ${identityMarkup(record)}
      <section class="pc-personnel-overview"><small>IDENTIFICATION SUMMARY</small><p>${esc(record.overview)}</p></section>
      ${canonTraceMarkup(record)}
      ${backgroundMarkup(record)}
      <div class="pc-personnel-dossier-grid">
        ${affiliationMarkup(record)}
        ${capabilityMarkup(record)}
        ${relationshipsMarkup(record)}
        ${psychologyMarkup(record)}
        ${fieldNotesMarkup(record)}
        ${notesMarkup(record)}
      </div>
      ${limitsMarkup(record)}
      <footer><span>개편 정본명과 원 명부명 병기</span><b>${esc(source.editorialRule)}</b></footer>
    </article>`;
  }

  function resultLabel(records){
    const group=state.group==='all'?'전체 인물':groupOf(state.group).label;
    const status=state.status==='all'?'':` · ${displayStatusOf(state.status).label}`;
    const query=state.query.trim()?` · “${state.query.trim()}”`:'';
    return `${group}${status}${query}`;
  }

  function renderResults({focusDetail=false}={}){
    const root=q('#personnel');
    if(!root) return;
    const records=filteredRecords();
    const list=q('[data-pc-person-list]',root);
    const detail=q('[data-pc-person-detail]',root);
    const count=q('[data-pc-person-count]',root);
    const label=q('[data-pc-person-result-label]',root);
    if(count) count.textContent=`${records.length}건`;
    if(label) label.textContent=resultLabel(records);

    if(state.selected&&!records.some(record=>record.id===state.selected)) state.selected=null;
    const selectedRecord=state.selected?source.byId[state.selected]:null;
    root.classList.toggle('pc-personnel-has-selection',Boolean(selectedRecord));
    if(list) list.innerHTML=records.length?records.map(cardMarkup).join(''):`<div class="pc-personnel-no-results"><b>NO RECORDS</b><span>조건에 맞는 인물 파일이 없습니다.</span></div>`;
    if(detail){
      detail.innerHTML=selectedRecord?detailMarkup(selectedRecord):(records.length?summaryDetailMarkup(records):emptyDetailMarkup(true));
      if(focusDetail&&selectedRecord){
        const heading=q('h3',detail);
        try{heading?.focus({preventScroll:true});}catch(_error){heading?.focus();}
        if(matchMedia('(max-width: 900px)').matches) detail.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
      }
    }
  }

  function syncControls(){
    const root=q('#personnel');
    if(!root) return;
    const search=q('[data-pc-person-search]',root);
    if(search&&search.value!==state.query) search.value=state.query;
    qa('[data-pc-person-group]',root).forEach(button=>button.classList.toggle('is-active',button.dataset.pcPersonGroup===state.group));
    qa('[data-pc-person-status]',root).forEach(button=>button.classList.toggle('is-active',button.dataset.pcPersonStatus===state.status));
  }

  function prepare(){
    const section=q('#personnel');
    const host=q('#uacPersonnelArchive',section);
    if(!section||!host) return false;
    section.classList.add('pc-personnel-page');
    if(!initialized){host.innerHTML=shellMarkup();initialized=true;}
    renderResults();
    return true;
  }

  function personnelHash(id=''){
    return id?`#personnel/${encodeURIComponent(id)}`:'#personnel';
  }

  function writePersonnelLocation(id,mode='replace'){
    if(mode==='none') return;
    const hash=personnelHash(id);
    if(location.hash===hash) return;
    try{
      const method=mode==='push'?'pushState':'replaceState';
      history[method]({route:'personnel',personnelId:id||null},'',hash);
    }catch(_error){}
  }

  function directRecordId(){
    const request=window.ProjectCurseShell?.getLocation?.();
    if(request?.route==='personnel') return request.personnelId||'';
    let raw='';
    try{raw=decodeURIComponent(location.hash.replace(/^#/,''));}
    catch(_error){raw=location.hash.replace(/^#/,'');}
    return raw.startsWith('personnel/')?raw.slice('personnel/'.length):'';
  }

  function openRecord(id,{focus=true,resetFilters=false,historyMode='push'}={}){
    const record=source.byId[id];
    if(!record) return false;
    const show=(resolvedHistoryMode=historyMode)=>{
      prepare();
      if(resetFilters){state.query='';state.group='all';state.status='all';}
      if(state.query&&!searchText(record).includes(normalize(state.query))) state.query='';
      state.selected=id;
      if(state.group!=='all'&&!recordGroups(record).includes(state.group)) state.group='all';
      if(state.status!=='all'&&record.status!==state.status) state.status='all';
      syncControls();
      renderResults({focusDetail:focus});
      writePersonnelLocation(id,resolvedHistoryMode);
      document.dispatchEvent(new CustomEvent('projectcurse:personnel-selected',{detail:{id}}));
      return true;
    };
    if(window.ProjectCurseShell?.getRoute()!=='personnel'){
      window.ProjectCurseShell?.navigate('personnel',{replace:false,historyMode:'push'}).then(()=>show(historyMode==='none'?'none':'replace'));
      return true;
    }
    return show();
  }

  function clearSelection({focus=false,historyMode='replace'}={}){
    prepare();
    state.selected=null;
    syncControls();
    renderResults();
    writePersonnelLocation('',historyMode);
    if(focus){
      const index=q('.pc-personnel-index',q('#personnel'));
      if(matchMedia('(max-width: 900px)').matches) index?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
      const search=q('[data-pc-person-search]',q('#personnel'));
      try{search?.focus({preventScroll:true});}catch(_error){search?.focus();}
    }
    return true;
  }

  function adjacentRecord(offset){
    const records=filteredRecords();
    const index=records.findIndex(record=>record.id===state.selected);
    return index<0?null:records[index+offset]||null;
  }

  async function copyDirectLink(button){
    if(!state.selected) return false;
    const url=new URL(location.href);
    url.hash=personnelHash(state.selected).slice(1);
    let copied=false;
    try{await navigator.clipboard.writeText(url.href);copied=true;}
    catch(_error){
      const input=document.createElement('textarea');
      input.value=url.href;input.setAttribute('readonly','');input.style.position='fixed';input.style.opacity='0';
      document.body.appendChild(input);input.select();
      try{copied=document.execCommand('copy');}catch(__error){copied=false;}
      input.remove();
    }
    const label=button?.querySelector('b');
    if(label){const original=label.textContent;label.textContent=copied?'링크 복사됨':'주소에서 복사';setTimeout(()=>{label.textContent=original;},1600);}
    return copied;
  }

  function openFaction(key){
    const ids=source.factionIndex[key]||[];
    const first=ids[0];
    if(!first) return false;
    state.group='all';state.status='all';state.query='';
    return openRecord(first);
  }

  function ready(callback){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',callback,{once:true});
    else callback();
  }

  ready(()=>{
    prepare();
    document.addEventListener('projectcurse:screen-committed',event=>{
      if(event.detail?.target==='personnel') prepare();
    });
    document.addEventListener('input',event=>{
      const input=event.target.closest?.('[data-pc-person-search]');
      if(!input) return;
      state.query=input.value;
      state.selected=null;
      writePersonnelLocation('','replace');
      renderResults();
    });
    document.addEventListener('click',event=>{
      const group=event.target.closest?.('[data-pc-person-group]');
      if(group){
        event.preventDefault();event.stopImmediatePropagation();
        state.group=group.dataset.pcPersonGroup;state.selected=null;
        writePersonnelLocation('','replace');
        window.ProjectCurseAudioControl?.play?.('filter.change');
        syncControls();renderResults();return;
      }
      const status=event.target.closest?.('[data-pc-person-status]');
      if(status){
        event.preventDefault();event.stopImmediatePropagation();
        state.status=status.dataset.pcPersonStatus;state.selected=null;
        writePersonnelLocation('','replace');
        window.ProjectCurseAudioControl?.play?.('filter.change');
        syncControls();renderResults();return;
      }
      const summaryStatus=event.target.closest?.('[data-pc-person-summary-status]');
      if(summaryStatus){
        event.preventDefault();event.stopImmediatePropagation();
        state.status=summaryStatus.dataset.pcPersonSummaryStatus;state.selected=null;
        writePersonnelLocation('','replace');
        window.ProjectCurseAudioControl?.play?.('filter.change');
        syncControls();renderResults();return;
      }
      const back=event.target.closest?.('[data-pc-person-back]');
      if(back){event.preventDefault();event.stopImmediatePropagation();clearSelection({focus:true,historyMode:'push'});return;}
      const previous=event.target.closest?.('[data-pc-person-prev]');
      if(previous){
        event.preventDefault();event.stopImmediatePropagation();
        const record=adjacentRecord(-1);if(record) openRecord(record.id,{focus:true,historyMode:'replace'});return;
      }
      const next=event.target.closest?.('[data-pc-person-next]');
      if(next){
        event.preventDefault();event.stopImmediatePropagation();
        const record=adjacentRecord(1);if(record) openRecord(record.id,{focus:true,historyMode:'replace'});return;
      }
      const copy=event.target.closest?.('[data-pc-person-copy-link]');
      if(copy){event.preventDefault();event.stopImmediatePropagation();copyDirectLink(copy);return;}
      const faction=event.target.closest?.('[data-pc-person-faction]');
      if(faction){
        event.preventDefault();event.stopImmediatePropagation();
        window.ProjectCurseAudioControl?.play?.('incident.link');
        window.ProjectCurseShell?.navigate('faction-info',{replace:false,historyMode:'push'}).then(()=>window.ProjectCurseFactionAnalysisRuntime?.open?.(faction.dataset.pcPersonFaction));
        return;
      }
      const person=event.target.closest?.('[data-pc-person-open]');
      if(person){
        event.preventDefault();event.stopImmediatePropagation();
        window.ProjectCurseAudioControl?.play?.('faction.open');
        openRecord(person.dataset.pcPersonOpen,{focus:true,historyMode:'push'});
      }
    },true);

    window.ProjectCursePersonnelRuntime=Object.freeze({
      open:openRecord,clear:clearSelection,openFaction,render:prepare,getSelected:()=>state.selected,
      getFiltered:()=>filteredRecords().map(record=>record.id),owner:'assets/js/pages/personnel-archive.js'
    });

    if(window.ProjectCurseShell?.getRoute()==='personnel'){
      const directId=directRecordId();
      if(directId&&source.byId[directId]) openRecord(directId,{focus:false,resetFilters:true,historyMode:'none'});
      else if(directId) clearSelection({historyMode:'replace'});
    }
  });
})();
