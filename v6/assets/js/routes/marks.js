import {FACTION_MARKS,FACTION_BRANCHES,FACTION_LINEAGE} from '../data.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));

const statusKorean=Object.freeze({
  official:'기관·편제 표식 초안',
  'field-attested':'복수 현장 확인 표식',
  reconstructed:'표식 감식 재구성',
  analyst:'분석관 지정 기호'
});

const mark=(item,variant='seal')=>`<span class="pc-v6-mark-stage pc-v6-mark-stage--${esc(variant)} is-${esc(item.status)}">
  <span class="pc-v6-mark" data-mark="${esc(item.id)}" ${variant==='seal'?`role="img" aria-label="${esc(item.name)} 표식. 문서 인장 문맥."`:'aria-hidden="true"'}><i></i><b></b><em></em></span>
</span>`;

const nameLedger=item=>{
  const rows=[];
  if(item.publicName) rows.push({name:`${item.publicName.fullName} / ${item.publicName.name}`,role:item.publicName.role});
  if(item.earlyLabel) rows.push({name:`${item.earlyLabel.fullName} / ${item.earlyLabel.name} · ${item.earlyLabel.period}`,role:`${item.earlyLabel.kind} / ${item.earlyLabel.confidence}`});
  if(item.precursor) rows.push({name:`${item.precursor.fullName} / ${item.precursor.name} · ${item.precursor.period}`,role:item.precursor.kind});
  rows.push(...(item.nameLedger||[]));
  if(!rows.length) return '';
  return `<details><summary>명칭·약어 대조 장부</summary><ul>${rows.map(row=>`<li><b>${esc(row.name)}</b><span>${esc(row.role)}</span></li>`).join('')}</ul></details>`;
};

const card=item=>`<article class="pc-v6-mark-card" data-mark-card data-mark-status="${esc(item.status)}">
  <header><span>${esc(item.group)} / ${esc(item.markStatus)}</span><small>${esc(item.confidence)}</small></header>
  <div class="pc-v6-mark-card__main">
    <div class="pc-v6-mark-specimens">
      <div class="pc-v6-mark-specimens__seal">${mark(item,'seal')}<span>SEAL / 96</span></div>
      <div class="pc-v6-mark-specimens__small">
        <div>${mark(item,'badge')}<span>BADGE / 32</span></div>
        <div>${mark(item,'map')}<span>MAP / 18</span></div>
      </div>
    </div>
    <div class="pc-v6-mark-card__body">
      <div class="pc-v6-mark-card__name"><span>${esc(item.code)}</span><h3>${esc(item.name)}</h3><b>${esc(item.fullName)}</b>${item.fullNameStatus?`<small>${esc(item.fullNameStatus)}</small>`:''}</div>
      <p>${esc(item.doctrine)}</p>
      <dl>
        <div><dt>형태 문법</dt><dd>${esc(item.motif)}</dd></div>
        <div><dt>손실 전가</dt><dd>${esc(item.cost)}</dd></div>
        <div><dt>명칭 판정</dt><dd>${esc(item.nameStatus)}</dd></div>
        <div><dt>표식 판정</dt><dd>${esc(item.markStatus)} · ${esc(statusKorean[item.status]||item.status)}</dd></div>
      </dl>
      ${nameLedger(item)}
    </div>
  </div>
</article>`;

const directionSymbol=Object.freeze({forward:'→',bidirectional:'↔',none:'···'});
const directionText=Object.freeze({forward:'에서 다음으로 이어짐',bidirectional:'서로 오가는 관계',none:'직접 계보가 확인되지 않은 참조'});
const lineageRow=item=>`<li data-relation="${esc(item.relationType.toLowerCase().replace(/[^a-z0-9]+/g,'-'))}" data-direction="${esc(item.direction)}">
  <div><span>${esc(item.relationType)}</span><small>${esc(item.period)}</small></div>
  <p><b>${esc(item.fromName)}</b><i aria-hidden="true">${directionSymbol[item.direction]||'···'}</i><span class="pc-v6-sr-only">${directionText[item.direction]||directionText.none}</span><b>${esc(item.toName)}</b></p>
  <em>${esc(item.label)}</em><strong>${esc(item.confidence)}</strong>
</li>`;

const branchRegistry=()=>`<section class="pc-v6-branches" aria-labelledby="v6BranchTitle">
  <header><span>BRANCH CARTOUCHE / NO NEW FACTION MARK</span><h3 id="v6BranchTitle">지부는 독립 세력처럼 부풀리지 않는다.</h3><p>부모 표식 아래 카르투슈만 바꾸며, 2021년 이후 실제 명령권은 모두 판정 보류다.</p></header>
  <ul>${FACTION_BRANCHES.map(item=>`<li><span>${esc(item.cartouche)}</span><b>${esc(item.code)} · ${esc(item.name)}</b><p>${esc(item.note)}</p><small>${esc(item.commandStatus)}</small></li>`).join('')}</ul>
</section>`;

export function render(){
  const groups=[...new Set(FACTION_MARKS.map(item=>item.group))];
  const sections=groups.map(group=>{
    const items=FACTION_MARKS.filter(item=>item.group===group);
    return `<section class="pc-v6-mark-group"><header><span>${esc(group)}</span><small>${items.length} MARKS</small></header><div>${items.map(card).join('')}</div></section>`;
  }).join('');
  return `<section class="pc-v6-marks" aria-labelledby="v6MarksTitle">
    <header class="pc-v6-pagehead"><div><span>MARKS 04 / IDENTITY REGISTER</span><small>17 SYSTEMS · 51 CONTEXT VARIANTS</small></div><p>명칭·형태·출처 상태를 함께 판정</p></header>
    <div class="pc-v6-marks-intro"><div><span class="pc-v6-eyebrow">FACTION IDENTITY / A02</span><h1 id="v6MarksTitle">약어는 남기고,<br>잘못된 역사는 끊는다.</h1><p>구판의 약어는 검색 가능한 레거시 명칭으로 보존한다. V6의 정식 이름은 조직이 실제로 무엇을 지키고 누구를 버리는지 설명하며, 모든 표식은 문서 인장·목록 배지·지도 기호로 따로 검증한다.</p></div><aside><span>IDENTIFICATION TEST</span><button type="button" data-mark-mode aria-pressed="false">단색 식별 시험</button><p>색을 제거해도 17개 실루엣과 공식·재구성 프레임을 구분할 수 있어야 한다.</p></aside></div>
    <div class="pc-v6-mark-principles"><span>01 / 약어와 레거시 검색어 보존</span><span>02 / SEAL · BADGE · MAP 별도 판정</span><span>03 / 기관·현장·교단 형태 문법 분리</span><span>04 / 공식 여부는 표식 밖 프레임에 표시</span></div>
    <section class="pc-v6-mark-decision" aria-labelledby="v6MarkDecisionTitle">
      <div><span>NAMING DECISION / A02</span><h2 id="v6MarkDecisionTitle">8개 핵심 약어를 A02 기준 명칭안으로 채택했다.</h2></div>
      <p>U.A.C는 세계정부가 아니라 협약체, N.H.C는 1993년에 정식화된 현장사령부, S.I.D는 2001년 독립한 증거 판정기관이다. F.H.C는 거주권을 상품화하는 컨소시엄이며, S.O.N과 P.O.H는 각각 단절된 명령망과 인계 보류 송장망이다. A.R.F와 C.P.D는 2005년 애시 크루 산하 편제로 분리한다.</p>
    </section>
    <div class="pc-v6-mark-filters" role="group" aria-label="표식 출처 상태 필터">
      <button type="button" data-mark-filter="all" aria-pressed="true">전체 17</button>
      <button type="button" data-mark-filter="official" aria-pressed="false">공식 초안</button>
      <button type="button" data-mark-filter="field-attested" aria-pressed="false">현장 확인</button>
      <button type="button" data-mark-filter="reconstructed" aria-pressed="false">감식 재구성</button>
      <button type="button" data-mark-filter="analyst" aria-pressed="false">분석 기호</button>
    </div>
    <div class="pc-v6-mark-groups">${sections}</div>
    <section class="pc-v6-lineage" aria-labelledby="v6LineageTitle">
      <header><div><span>LINEAGE / COMMAND / TRANSACTION</span><h2 id="v6LineageTitle">계보와 거래를 같은 선으로 그리지 않는다.</h2></div><p>F.H.C와 S.O.N의 거래는 하위 지휘가 아니며, P.O.H와 하이먼도 같은 조직으로 합치지 않는다.</p></header>
      <ol>${FACTION_LINEAGE.map(lineageRow).join('')}</ol>
      ${branchRegistry()}
    </section>
    <div class="pc-v6-sr-only" data-mark-status aria-live="polite" aria-atomic="true"></div>
  </section>`;
}

export function mount(root){
  const status=root.querySelector('[data-mark-status]');
  const page=root.querySelector('.pc-v6-marks');
  root.querySelector('[data-mark-mode]')?.addEventListener('click',event=>{
    const active=page?.classList.toggle('is-monochrome')||false;
    event.currentTarget.textContent=active?'색상 식별로 복귀':'단색 식별 시험';
    event.currentTarget.setAttribute('aria-pressed',String(active));
    if(status) status.textContent=active?'표식을 단색 식별 모드로 바꿨습니다.':'표식을 색상 식별 모드로 되돌렸습니다.';
  });
  root.querySelectorAll('[data-mark-filter]').forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.markFilter;
    let visible=0;
    root.querySelectorAll('[data-mark-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    root.querySelectorAll('[data-mark-card]').forEach(item=>{
      const show=filter==='all'||item.dataset.markStatus===filter;
      item.hidden=!show;
      if(show) visible+=1;
    });
    root.querySelectorAll('.pc-v6-mark-group').forEach(group=>group.hidden=![...group.querySelectorAll('[data-mark-card]')].some(item=>!item.hidden));
    if(status) status.textContent=`${button.textContent.trim()} 필터, ${visible}개 표식을 표시합니다.`;
  }));
}
