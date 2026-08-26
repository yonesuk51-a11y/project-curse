import {PEOPLE_SOURCE,PEOPLE_GROUPS,PEOPLE_CERTAINTIES,PEOPLE_RECORDS} from '../people-data.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));
const groupById=new Map(PEOPLE_GROUPS.map(item=>[item.id,item]));
const personById=new Map(PEOPLE_RECORDS.map(item=>[item.id,item]));
const certaintyKorean=Object.freeze({listed:'원 명부 기재',partial:'부분 확인·잠정 보완',unresolved:'해석 보류'});
const status2042=Object.freeze({
  active:{code:'LAST REGISTER / 2006',label:'2006년 활동 기재',copy:'2042년 현재 생존·재직·소속은 확인되지 않았다.'},
  deceased:{code:'DEATH ENTERED / DATE DISPUTED',label:'사망 기재',copy:'사망 시점·원인·회수 여부는 인물별 기록 한계를 따른다.'},
  unknown:{code:'STATUS GAP / 2006',label:'2006년 당시 상태 미확인',copy:'실종·사망·이탈 가운데 어느 상태인지 확정하지 않는다.'}
});
const tokens=items=>items?.length?`<ul class="pc-v6-person-tags">${items.map(item=>`<li>${esc(typeof item==='string'?item:item.label||item.role||'기록')}</li>`).join('')}</ul>`:'<p class="pc-v6-person-empty">기재 없음</p>';
const personSearchText=person=>[
  person.name,person.sourceName,...(person.aliases||[]),person.role,person.overview,person.affiliationSummary,
  ...(person.capabilities||[]),...(person.equipment||[]),...(person.affiliations||[]).flatMap(item=>[item.label,item.role])
].join(' ').toLocaleLowerCase('ko');

const listItem=person=>{
  const group=groupById.get(person.group);
  const state=status2042[person.status]||status2042.unknown;
  return `<li data-person-item data-person-id="${esc(person.id)}" data-person-group="${esc(person.group)}" data-person-status="${esc(person.status)}" data-person-certainty="${esc(person.certainty)}" data-person-limited="${person.certainty!=='listed'||person.limits?.length?'true':'false'}" data-person-ability="${person.capabilities?.length?'true':'false'}" data-person-search="${esc(personSearchText(person))}">
    <button type="button" data-person-select="${esc(person.id)}">
      <span>${esc(group?.code||'UNK')} / ${esc(state.code)}</span><b>${esc(person.name)}</b><small>${esc(person.role)}</small><em>${esc(certaintyKorean[person.certainty]||person.certainty)}</em>
    </button>
  </li>`;
};

const relationshipLedger=person=>{
  if(!person.relationships?.length) return '<p class="pc-v6-person-empty">원 명부 또는 보완 기록에 직접 기재된 관계 없음</p>';
  return `<ol class="pc-v6-person-relations">${person.relationships.map(item=>{
    const target=personById.get(item.target);
    return `<li><span>${esc(item.relation)}</span><b>${esc(target?.name||item.target)}</b><small>${esc(certaintyKorean[item.certainty]||item.certainty||'판정 없음')}</small></li>`;
  }).join('')}</ol>`;
};

const identityGrid=person=>{
  const identity=person.identity||{};
  return `<dl class="pc-v6-person-identity">
    <div><dt>성별 표기</dt><dd>${esc(identity.sex||'미기재')}</dd></div>
    <div><dt>출생 기록</dt><dd>${esc(identity.birth||'미기재')}</dd></div>
    <div><dt>기록 당시 연령</dt><dd>${esc(identity.age||'미기재')}</dd></div>
    <div><dt>출신</dt><dd>${esc(identity.origin||'미기재')}</dd></div>
    <div><dt>국적·신분</dt><dd>${esc(identity.nationality||'미기재')}</dd></div>
    <div><dt>2042 현재</dt><dd>UNRESOLVED</dd></div>
  </dl>`;
};

const dossier=person=>{
  const group=groupById.get(person.group);
  const state=status2042[person.status]||status2042.unknown;
  const registerName=person.sourceName||person.name;
  const affiliations=person.affiliations?.map(item=>`${item.label} · ${item.role} / ${certaintyKorean[item.certainty]||item.certainty}`)||[];
  const history=person.history?.length?`<ol>${person.history.map(item=>`<li><time>${esc(item[0])}</time><p>${esc(item[1])}</p></li>`).join('')}</ol>`:'<p class="pc-v6-person-empty">잠정 보완 이력 없음</p>';
  return `<article class="pc-v6-person-dossier" data-person-dossier="${esc(person.id)}">
    <header>
      <div><span>${esc(group?.code||'UNK')} / ${esc(group?.label||person.group)}</span><small>${esc(PEOPLE_SOURCE.migrationState)}</small></div>
      <b>${esc(state.code)}</b>
    </header>
    <div class="pc-v6-person-dossier__hero">
      <div><span class="pc-v6-eyebrow">PERSONNEL INTAKE / ${String(PEOPLE_RECORDS.indexOf(person)+1).padStart(2,'0')}</span><h2 tabindex="-1">${esc(person.name)}</h2><p>${esc(person.role)}</p>${person.sourceName?`<small>구 명부명 / ${esc(person.sourceName)}</small>`:''}</div>
      <div class="pc-v6-person-dossier__status is-${esc(person.status)}"><span>${esc(state.label)}</span><b>2042 / 확인 불가</b><small>${esc(state.copy)}</small></div>
    </div>
    <section class="pc-v6-person-layer is-supplemental" aria-labelledby="personIdentity-${esc(person.id)}">
      <header><div><span>SUPPLEMENTAL IDENTITY / PROVISIONAL</span><h3 id="personIdentity-${esc(person.id)}">신원 보완은 정사 확정이 아니다.</h3></div><p>보완된 이름·생년·성별·출신·경력은 인물 파일을 읽기 위한 잠정 초안이다.</p></header>
      ${identityGrid(person)}
      <p class="pc-v6-person-overview">${esc(person.overview)}</p>
      <dl class="pc-v6-person-motive">
        <div><dt>성향</dt><dd>${esc(person.personality?.temperament||'미기재')}</dd></div>
        <div><dt>원하는 것</dt><dd>${esc(person.personality?.drive||'미기재')}</dd></div>
        <div><dt>두려워하는 것</dt><dd>${esc(person.personality?.fear||'미기재')}</dd></div>
      </dl>
    </section>
    <div class="pc-v6-person-dossier__grid">
      <section class="pc-v6-person-layer is-register"><header><span>LEGACY REGISTER / PRESERVED</span><h3>원 명부 보존층</h3></header>
        <dl class="pc-v6-person-register"><div><dt>명부명</dt><dd>${esc(registerName)}</dd></div><div><dt>분류군</dt><dd>${esc(group?.label||person.group)}</dd></div><div><dt>명부 판정</dt><dd>${esc(certaintyKorean[person.certainty]||PEOPLE_CERTAINTIES[person.certainty]?.label||person.certainty)}</dd></div><div><dt>표시 역할</dt><dd>${esc(person.role)}</dd></div></dl>
        <h4>소속 기록</h4>${tokens(affiliations.length?affiliations:[person.affiliationSummary].filter(Boolean))}
        <h4>능력 표기</h4>${tokens(person.capabilities)}
        <h4>장비 표기</h4>${tokens(person.equipment)}
      </section>
      <section class="pc-v6-person-layer is-tracking"><header><span>CHARACTER TRACKING / V6</span><h3>사건 연결 판정</h3></header>
        <div class="pc-v6-person-no-link"><b>NO ADOPTED INCIDENT LINK</b><p>이 인물의 구판 이력을 V6 사건선에 아직 연결하지 않았다.</p></div>
        <h4>직접 기재 관계</h4>${relationshipLedger(person)}
        <a href="#/marks">관련 세력 표식 대장 열기</a>
      </section>
    </div>
    <section class="pc-v6-person-history" aria-label="잠정 보완 이력"><header><span>SUPPLEMENTAL HISTORY</span><h3>최근 보완 이력</h3></header>${history}</section>
    <footer class="pc-v6-person-limit"><div><span>ARCHIVE LIMIT</span><h3>이 파일로 확정할 수 없는 것</h3></div>${person.limits?.length?`<ul>${person.limits.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`:'<p>원 명부 밖의 현재 상태와 사건 연결.</p>'}${person.fieldNotes?.length?`<aside><span>FIELD NOTE / PROVISIONAL</span><p>${esc(person.fieldNotes.join(' '))}</p></aside>`:''}</footer>
  </article>`;
};

export function render(){
  const deceased=PEOPLE_RECORDS.filter(item=>item.status==='deceased').length;
  const uncertain=PEOPLE_RECORDS.filter(item=>item.certainty!=='listed'||item.limits?.length).length;
  return `<section class="pc-v6-people" aria-labelledby="v6PeopleTitle">
    <header class="pc-v6-pagehead"><div><span>PEOPLE 05 / LEGACY INTAKE</span><small>${PEOPLE_RECORDS.length} FILES · ${PEOPLE_GROUPS.length} GROUPS · 2042 STATUS UNRESOLVED</small></div><p>주인공이 아니라 기록된 사람을 추적</p></header>
    <div class="pc-v6-people-intro"><div><span class="pc-v6-eyebrow">PERSONNEL INDEX / NOT YET CANON</span><h1 id="v6PeopleTitle">살아 있었다는 기록과,<br>살아 있다는 말은 다르다.</h1><p>${esc(PEOPLE_SOURCE.boundary)}</p></div><aside><span>PROTAGONIST RULE</span><b>FREY / NOT RESTORED</b><p>${esc(PEOPLE_SOURCE.protagonistRule)}</p></aside></div>
    <dl class="pc-v6-people-stats"><div><dt>INTAKE FILES</dt><dd>${PEOPLE_RECORDS.length}</dd><small>프레이 제외</small></div><div><dt>GROUPS</dt><dd>${PEOPLE_GROUPS.length}</dd><small>구 명부 분류</small></div><div><dt>DEATH ENTERED</dt><dd>${deceased}</dd><small>경위 미확정 포함</small></div><div><dt>LIMITED FILES</dt><dd>${uncertain}</dd><small>해석 제한 보유</small></div><div><dt>2042 CONFIRMED</dt><dd>0</dd><small>자동 생존 승계 없음</small></div></dl>
    <section class="pc-v6-people-console" aria-label="인물 기록 검색과 열람">
      <div class="pc-v6-people-index">
        <header><span>SEARCH / FILTER</span><label><span class="pc-v6-sr-only">인물 검색</span><input type="search" data-person-search placeholder="이름 · 별칭 · 소속 · 능력" autocomplete="off"></label>
          <select data-person-group aria-label="명부 분류군"><option value="all">전체 분류군</option>${PEOPLE_GROUPS.map(item=>`<option value="${esc(item.id)}">${esc(item.label)}</option>`).join('')}</select>
          <div role="group" aria-label="인물 상태 필터"><button type="button" data-person-filter="all" aria-pressed="true">전체</button><button type="button" data-person-filter="deceased" aria-pressed="false">사망 기재</button><button type="button" data-person-filter="uncertain" aria-pressed="false">제한 기록</button><button type="button" data-person-filter="ability" aria-pressed="false">능력 표기</button></div>
        </header>
        <p><b data-person-count>${PEOPLE_RECORDS.length}</b> / ${PEOPLE_RECORDS.length} FILES</p>
        <ol data-person-list>${PEOPLE_RECORDS.map(listItem).join('')}</ol>
      </div>
      <div class="pc-v6-people-detail" data-person-detail>${dossier(PEOPLE_RECORDS[0])}</div>
    </section>
    <div class="pc-v6-sr-only" data-person-status aria-live="polite" aria-atomic="true"></div>
  </section>`;
}

export function mount(root,{detail='' }={}){
  const list=root.querySelector('[data-person-list]');
  const panel=root.querySelector('[data-person-detail]');
  const search=root.querySelector('[data-person-search]');
  const group=root.querySelector('[data-person-group]');
  const count=root.querySelector('[data-person-count]');
  const live=root.querySelector('[data-person-status]');
  let filter='all';
  let selected=PEOPLE_RECORDS[0];

  const selectPerson=(person,{focus=false,updateHash=true}={})=>{
    if(!person) return;
    selected=person;
    panel.innerHTML=dossier(person);
    list.querySelectorAll('[data-person-select]').forEach(button=>{
      if(button.dataset.personSelect===person.id) button.setAttribute('aria-current','true'); else button.removeAttribute('aria-current');
    });
    if(updateHash) history.replaceState(null,'',`#/people/${encodeURIComponent(`person:${person.id}`)}`);
    if(focus) panel.querySelector('h2')?.focus({preventScroll:false});
    if(live) live.textContent=`${person.name}, ${person.role} 인물 파일을 열었습니다. 2042년 현재 상태는 확인되지 않았습니다.`;
  };

  const applyFilters=()=>{
    const query=search.value.trim().toLocaleLowerCase('ko');
    const groupId=group.value;
    const visible=[];
    list.querySelectorAll('[data-person-item]').forEach(item=>{
      const statusMatch=filter==='all'||filter==='deceased'&&item.dataset.personStatus==='deceased'||filter==='uncertain'&&item.dataset.personLimited==='true'||filter==='ability'&&item.dataset.personAbility==='true';
      const show=(groupId==='all'||item.dataset.personGroup===groupId)&&statusMatch&&(!query||item.dataset.personSearch.includes(query));
      item.hidden=!show;
      if(show) visible.push(item);
    });
    count.textContent=String(visible.length);
    if(!visible.some(item=>item.dataset.personId===selected.id)&&visible[0]) selectPerson(personById.get(visible[0].dataset.personId),{updateHash:true});
    if(live) live.textContent=`인물 기록 ${visible.length}개를 표시합니다.`;
  };

  list.querySelectorAll('[data-person-select]').forEach(button=>button.addEventListener('click',()=>selectPerson(personById.get(button.dataset.personSelect),{focus:true})));
  search.addEventListener('input',applyFilters);
  group.addEventListener('change',applyFilters);
  root.querySelectorAll('[data-person-filter]').forEach(button=>button.addEventListener('click',()=>{
    filter=button.dataset.personFilter;
    root.querySelectorAll('[data-person-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    applyFilters();
  }));

  const initialId=detail.startsWith('person:')?detail.slice(7):'';
  selectPerson(personById.get(initialId)||PEOPLE_RECORDS[0],{updateHash:false});
}
