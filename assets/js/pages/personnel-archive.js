// Project Curse 5.51.0 — searchable identity and background dossier archive.
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
    const items=[['all','전체'],...Object.entries(source.statuses).map(([id,item])=>[id,item.label])];
    return items.map(([id,label],index)=>`<button class="${index===0?'is-active':''}" data-pc-person-status="${esc(id)}" type="button">${esc(label)}</button>`).join('');
  }

  function shellMarkup(){
    return `<div class="pc-personnel-archive" data-pc-personnel-owner="1">
      <header class="pc-personnel-intro">
        <div>
          <small>U.A.C PERSONNEL REGISTER / SUPPLEMENTAL IDENTITY</small>
          <h2>인물 기록</h2>
          <p>56명의 이름·출신·기록 당시 나이·소속·성향·과거 이력을 세계 기록 아래에서 독립적으로 대조한다.</p>
        </div>
        <dl aria-label="인물 명부 상태">
          <div><dt>등록 인물</dt><dd>${source.stats.total}</dd></div>
          <div><dt>신원 보완</dt><dd>${source.stats.profiled}</dd></div>
          <div><dt>이름 정리</dt><dd>${source.stats.renamed}</dd></div>
          <div><dt>사망 기재</dt><dd>${source.stats.deceased}</dd></div>
        </dl>
      </header>
      <aside class="pc-personnel-boundary">
        <b>SUPPLEMENTAL IDENTITY</b>
        <p>원 명부의 이름·능력 표기와 보완된 출생·소속·경력은 구분해 판독한다. 보완 이름은 기존 명부명으로도 검색된다.</p>
        <span>56 INDEPENDENT FILES</span>
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
        <section class="pc-personnel-detail" data-pc-person-detail aria-live="polite">${emptyDetailMarkup()}</section>
      </div>
    </div>`;
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
    const status=statusOf(record.status);
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
    return `<section class="pc-personnel-section pc-personnel-capabilities"><header><small>CAPABILITY / EQUIPMENT</small><h4>능력과 장비</h4></header>
      ${capabilities.length?`<div><b>기재 능력</b><ul>${capabilities.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></div>`:''}
      ${equipment.length?`<div><b>기재 장비</b><ul>${equipment.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></div>`:''}
      <p>목록에 적힌 명칭은 보유 사실을 넘어 위력·범위·숙련도를 확정하지 않는다.</p>
    </section>`;
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

  function detailMarkup(record){
    const group=groupOf(record.group);
    const status=statusOf(record.status);
    const certainty=certaintyOf(record.certainty);
    const aliases=(record.aliases||[]).filter(alias=>alias!==record.sourceName);
    const sourceName=record.sourceName?`<p class="pc-personnel-source">구 명부명 <b>${esc(record.sourceName)}</b></p>`:'';
    const aliasLine=aliases.length?`<p class="pc-personnel-alias">호칭·별칭 <b>${esc(aliases.join(' / '))}</b></p>`:'';
    return `<article class="pc-personnel-dossier" data-person-tone="${esc(group.tone)}" data-pc-person-selected="${esc(record.id)}">
      <header class="pc-personnel-dossier-head">
        <div class="pc-personnel-code"><small>${esc(recordCode(record))}</small><i aria-hidden="true">${esc(group.code)}</i></div>
        <div><small>SUPPLEMENTAL PERSONNEL DOSSIER / ${esc(certainty.label)}</small><h3 tabindex="-1">${esc(record.name)}</h3>${sourceName}${aliasLine}<p>${esc(record.role)}</p></div>
        <span data-person-status="${esc(status.tone)}">${esc(status.label)}</span>
      </header>
      <dl class="pc-personnel-meta">
        <div><dt>주 분류</dt><dd>${esc(group.label)}</dd></div>
        <div><dt>기록 신뢰</dt><dd data-certainty="${esc(certainty.tone)}">${esc(certainty.label)}</dd></div>
        <div><dt>직책·관계</dt><dd>${esc(record.role)}</dd></div>
        <div><dt>자료 상태</dt><dd>원 명부 + 보완 신원</dd></div>
      </dl>
      ${identityMarkup(record)}
      <section class="pc-personnel-overview"><small>IDENTIFICATION SUMMARY</small><p>${esc(record.overview)}</p></section>
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
      <footer><span>보완 신원은 원 명부와 분리 판독</span><b>${esc(source.editorialRule)}</b></footer>
    </article>`;
  }

  function resultLabel(records){
    const group=state.group==='all'?'전체 인물':groupOf(state.group).label;
    const status=state.status==='all'?'':` · ${statusOf(state.status).label}`;
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
    if(list) list.innerHTML=records.length?records.map(cardMarkup).join(''):`<div class="pc-personnel-no-results"><b>NO RECORDS</b><span>조건에 맞는 인물 파일이 없습니다.</span></div>`;
    if(detail){
      const selected=state.selected?source.byId[state.selected]:null;
      detail.innerHTML=selected?detailMarkup(selected):emptyDetailMarkup(!records.length);
      if(focusDetail&&selected){
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

  function openRecord(id,{focus=true,resetFilters=false}={}){
    const record=source.byId[id];
    if(!record) return false;
    const show=()=>{
      prepare();
      if(resetFilters){state.query='';state.group='all';state.status='all';}
      state.selected=id;
      if(state.group!=='all'&&!recordGroups(record).includes(state.group)) state.group='all';
      if(state.status!=='all'&&record.status!==state.status) state.status='all';
      syncControls();
      renderResults({focusDetail:focus});
      document.dispatchEvent(new CustomEvent('projectcurse:personnel-selected',{detail:{id}}));
      return true;
    };
    if(window.ProjectCurseShell?.getRoute()!=='personnel'){
      window.ProjectCurseShell?.navigate('personnel',{replace:false,historyMode:'push'}).then(show);
      return true;
    }
    return show();
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
      renderResults();
    });
    document.addEventListener('click',event=>{
      const group=event.target.closest?.('[data-pc-person-group]');
      if(group){
        event.preventDefault();event.stopImmediatePropagation();
        state.group=group.dataset.pcPersonGroup;state.selected=null;
        window.ProjectCurseAudioControl?.play?.('filter.change');
        syncControls();renderResults();return;
      }
      const status=event.target.closest?.('[data-pc-person-status]');
      if(status){
        event.preventDefault();event.stopImmediatePropagation();
        state.status=status.dataset.pcPersonStatus;state.selected=null;
        window.ProjectCurseAudioControl?.play?.('filter.change');
        syncControls();renderResults();return;
      }
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
        openRecord(person.dataset.pcPersonOpen,{focus:true});
      }
    },true);

    window.ProjectCursePersonnelRuntime=Object.freeze({
      open:openRecord,openFaction,render:prepare,getSelected:()=>state.selected,
      getFiltered:()=>filteredRecords().map(record=>record.id),owner:'assets/js/pages/personnel-archive.js'
    });
  });
})();
