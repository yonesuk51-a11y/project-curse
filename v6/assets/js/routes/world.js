import {WORLD_THEATRES,ABILITY_PATHS,V6_ERAS,CORE_TERMS} from '../data.js';

const esc=value=>String(value??'').replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));

export function render(){
  const theatres=WORLD_THEATRES.map(item=>`
    <article class="pc-v6-theatre" data-accent="${esc(item.accent)}">
      <header><span>${esc(item.index)}</span><small>${esc(item.call)}</small></header>
      <h3>${esc(item.name)}</h3><b>${esc(item.state)}</b><p>${esc(item.summary)}</p>
      <dl><div><dt>확인</dt><dd>${esc(item.truth)}</dd></div><div><dt>미해결</dt><dd>${esc(item.unknown)}</dd></div></dl>
    </article>`).join('');
  const paths=ABILITY_PATHS.map(item=>`
    <article class="pc-v6-path"><span>${esc(item.index)}</span><h3>${esc(item.name)}</h3>
      <dl><div><dt>접속</dt><dd>${esc(item.condition)}</dd></div><div><dt>대가</dt><dd>${esc(item.cost)}</dd></div><div><dt>대응</dt><dd>${esc(item.counter)}</dd></div></dl>
    </article>`).join('');
  const eras=V6_ERAS.map((item,index)=>`<li><span>0${index+1}</span><time>${esc(item.range)}</time><div><b>${esc(item.title)}</b><p>${esc(item.copy)}</p></div></li>`).join('');
  const terms=CORE_TERMS.map((item,index)=>`<article class="pc-v6-term"><span>${String(index+1).padStart(2,'0')} / ${esc(item.code)}</span><h3>${esc(item.name)}</h3><p>${esc(item.copy)}</p></article>`).join('');
  return `<section class="pc-v6-world" aria-labelledby="v6WorldTitle">
    <header class="pc-v6-pagehead"><div><span>WORLD 01 / REFOUNDATION</span><small>GEOGRAPHY · POWER · HISTORY</small></div><p>채택 전 초안 / 구판 정사 자동 승계 없음</p></header>
    <div class="pc-v6-world-intro">
      <div><span class="pc-v6-eyebrow">WORLD PREMISE</span><h1 id="v6WorldTitle">측정은 이해가 아니었다.</h1><p>인류가 반복 가능한 흔적을 기술로 표준화할수록, 현실은 그 규격을 침입 경로로 사용했다. 문명은 재건되지 않았고, 살아 있는 구역만 서로 다른 속도로 소진되고 있다.</p></div>
      <aside><span>FOUNDATION RULE / 01</span><b>모든 힘은 사용자를 먼저 죽인다.</b><p>능력은 위험을 지우지 않는다. 수명·기억·신체·관계를 앞으로 당겨 소모해 잠깐 다른 사람에게 넘길 뿐이다.</p></aside>
    </div>
    <section class="pc-v6-section" aria-labelledby="v6TermsTitle"><header class="pc-v6-section__head"><span>CORE VOCABULARY</span><h2 id="v6TermsTitle">현상은 여섯 개의 공통어로 기록한다.</h2><p>우주론은 미해결로 남겨도 현장에서 무엇이 바뀌고 무엇을 잃는지는 같은 언어로 적는다.</p></header><div class="pc-v6-term-grid">${terms}</div></section>
    <section class="pc-v6-section" aria-labelledby="v6TheatreTitle"><header class="pc-v6-section__head"><span>FOUR THEATRES</span><h2 id="v6TheatreTitle">같은 붕괴가 네 지역에서 다른 사회를 만들었다.</h2><p>국가의 존속 여부보다 누가 길·기록·피난처를 유지하는지가 권력이 된다.</p></header><div class="pc-v6-theatre-grid">${theatres}</div></section>
    <section class="pc-v6-section" aria-labelledby="v6AbilityTitle"><header class="pc-v6-section__head"><span>ACCESS PATHS</span><h2 id="v6AbilityTitle">능력은 네 가지 죽음의 경로로 분류한다.</h2><p>얻는 방식은 달라도 과사용은 언제나 사용자의 기준상을 깎아 먹는다. 무상으로 강해지는 인물은 없다.</p></header><div class="pc-v6-path-grid">${paths}</div></section>
    <section class="pc-v6-section pc-v6-era-section" aria-labelledby="v6EraTitle"><header class="pc-v6-section__head"><span>1975–2042</span><h2 id="v6EraTitle">세계사는 여섯 번 방향을 바꾼다.</h2></header><ol class="pc-v6-era-list">${eras}</ol></section>
    <aside class="pc-v6-conflict-note"><span>DATE / ORGANIZATION CONFLICT</span><h2>1986년 피의 호수 기록은 하나의 날짜로 합치지 않는다.</h2><p><b>1986.02.01</b>은 유닛2 현장 사건 또는 원기록 작성일, <b>1986.07.25</b>는 회수·재진입·공식 사건 등록일일 가능성을 열어 둔다. 당시 문서의 N.H.C 명칭도 후대 편집 표기인지 프로토 규격인지 별도 판정한다.</p></aside>
  </section>`;
}

export function mount(){}
