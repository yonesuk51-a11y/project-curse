import {WORLD_FOUNDATION} from '../data.js';

const esc=value=>String(value??'').replace(/[&<>"]/g,char=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'
}[char]));

export function render(){
  const cards=WORLD_FOUNDATION.entrances.map((entry,index)=>`
    <article class="pc-v6-incident" style="--entry-order:${index}">
      <header><span>${esc(entry.year)}</span><small>${esc(entry.code)}</small></header>
      <h3>${esc(entry.title)}</h3>
      <p>${esc(entry.copy)}</p>
      <footer><em>${esc(entry.state)}</em><button type="button" data-v6-intent="${esc(entry.route)}"${entry.record?` data-v6-record="${esc(entry.record)}"`:''}>기록 경로 확인</button></footer>
    </article>`).join('');
  const limits=WORLD_FOUNDATION.limits.map((item,index)=>`<li><span>0${index+1}</span>${esc(item)}</li>`).join('');
  const losses=WORLD_FOUNDATION.lossDoctrine.map((item,index)=>`
    <article class="pc-v6-loss"><span>${String(index+1).padStart(2,'0')} / ${esc(item.code)}</span><h3>${esc(item.title)}</h3><p>${esc(item.copy)}</p></article>`).join('');
  return `
    <section class="pc-v6-briefing" aria-labelledby="v6BriefingTitle">
      <header class="pc-v6-pagehead">
        <div><span>SESSION 00 / WORLD STATE</span><small>PROJECT CURSE 6.0 REFOUNDATION</small></div>
        <p>이 화면은 기존 5.52 공개판을 교체하지 않는 독립 시제품이다.</p>
      </header>

      <div class="pc-v6-hero">
        <div class="pc-v6-hero__copy">
          <span class="pc-v6-eyebrow">2042 / RECOVERED WORLD</span>
          <h1 id="v6BriefingTitle">세상은 살아남지 못했다.<br><em>남은 것들이 종료를 미루고 있을 뿐이다.</em></h1>
          <p>${esc(WORLD_FOUNDATION.statement)}</p>
          <div class="pc-v6-hero__actions">
            <button type="button" class="is-primary" data-v6-intent="world">새 세계의 구조</button>
            <button type="button" data-v6-intent="archive">보호 기록 진입</button>
          </div>
        </div>
        <aside class="pc-v6-signal-card" aria-label="현재 신호">
          <span>LIVE SIGNAL / AFTERMATH</span>
          <div class="pc-v6-signal-card__pulse" aria-hidden="true"><i></i><i></i><i></i></div>
          <strong>${esc(WORLD_FOUNDATION.present.date)}</strong>
          <b>${esc(WORLD_FOUNDATION.present.signal)}</b>
          <p>${esc(WORLD_FOUNDATION.present.status)}</p>
        </aside>
      </div>

      <section class="pc-v6-section" aria-labelledby="v6EntrancesTitle">
        <header class="pc-v6-section__head"><span>THREE ENTRY LINES</span><h2 id="v6EntrancesTitle">세 번의 실패로 세계에 진입한다.</h2><p>사건은 영웅의 승리가 아니라, 기관이 무엇을 포기했는지로 이어진다.</p></header>
        <div class="pc-v6-incident-grid">${cards}</div>
      </section>

      <section class="pc-v6-section pc-v6-loss-section" aria-labelledby="v6LossTitle">
        <header class="pc-v6-section__head"><span>LOSS DOCTRINE</span><h2 id="v6LossTitle">이 세계에서 생존은 승리가 아니다.</h2><p>살아남는 일은 구조·복구·보상과 동의어가 아니다. 대부분은 다음 손실까지의 유예다.</p></header>
        <div class="pc-v6-loss-grid">${losses}</div>
      </section>

      <section class="pc-v6-section pc-v6-method" aria-labelledby="v6MethodTitle">
        <header class="pc-v6-section__head"><span>CANON METHOD</span><h2 id="v6MethodTitle">새 정사는 희망을 약속하지 않고, 손실의 근거를 남긴다.</h2></header>
        <ol>${limits}</ol>
      </section>
    </section>`;
}

export function mount(root,{navigate}){
  root.querySelectorAll('[data-v6-intent]').forEach(control=>{
    control.addEventListener('click',()=>navigate(control.dataset.v6Intent||'briefing',control.dataset.v6Record||''));
  });
}
