import {FACTION_MARKS} from '../data.js';

const esc=value=>String(value??'').replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
const mark=id=>`<span class="pc-v6-mark" data-mark="${esc(id)}" role="img" aria-label="${esc(id)} 세력 표식 초안"><i></i><b></b><em></em></span>`;

export function render(){
  const groups=[...new Set(FACTION_MARKS.map(item=>item.group))];
  const sections=groups.map(group=>{
    const cards=FACTION_MARKS.filter(item=>item.group===group).map(item=>`<article class="pc-v6-mark-card">${mark(item.id)}<div><span>${esc(item.group)} / FORM STUDY A01</span><h3>${esc(item.code)}</h3><b>${esc(item.name)}</b><p>${esc(item.motif)}</p><em>${esc(item.state)}</em></div></article>`).join('');
    return `<section class="pc-v6-mark-group"><header><span>${esc(group)}</span><small>${cards.match(/pc-v6-mark-card/g)?.length||0} MARKS</small></header><div>${cards}</div></section>`;
  }).join('');
  return `<section class="pc-v6-marks" aria-labelledby="v6MarksTitle">
    <header class="pc-v6-pagehead"><div><span>MARKS 03 / FORM LANGUAGE</span><small>CSS VECTOR STUDY · NO LEGACY ASSET REUSE</small></div><p>명칭·교리 확정 전 형태 초안</p></header>
    <div class="pc-v6-marks-intro"><div><span class="pc-v6-eyebrow">FACTION IDENTITY</span><h1 id="v6MarksTitle">같은 원 안에 글자만 바꾸지 않는다.</h1><p>각 표식은 세력의 임무와 금기를 한 가지 중심 형태로 압축한다. 지도 점, 문서 봉인, 장비 패치에서도 같은 실루엣을 유지해야 한다.</p></div><aside><span>TEST MODE</span><button type="button" data-mark-mode>단색 식별 시험</button><p>색이 사라져도 세력을 구분할 수 있는지 확인한다.</p></aside></div>
    <div class="pc-v6-mark-principles"><span>01 / 한 세력 한 중심형</span><span>02 / 세부선보다 실루엣</span><span>03 / 기관과 교단의 문법 분리</span><span>04 / 감식 재구성은 공식 휘장과 분리</span></div>
    <div class="pc-v6-mark-groups">${sections}</div>
  </section>`;
}

export function mount(root){
  root.querySelector('[data-mark-mode]')?.addEventListener('click',event=>{
    const active=root.classList.toggle('is-monochrome');
    event.currentTarget.textContent=active?'색상 식별로 복귀':'단색 식별 시험';
  });
}
