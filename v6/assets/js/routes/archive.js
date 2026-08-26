import {ARCHIVE_RECORDS} from '../data.js';

const esc=value=>String(value??'').replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));

export function render(){
  const records=Object.values(ARCHIVE_RECORDS).map(record=>`
    <article class="pc-v6-record-card" data-risk="${esc(record.risk)}">
      <figure><img src="${esc(record.cover)}" alt="" loading="lazy"><figcaption><span>${esc(record.source)}</span><b>${esc(record.risk)}</b></figcaption></figure>
      <div class="pc-v6-record-card__body"><header><code>${esc(record.code)}</code><time>${esc(record.date)}</time></header><h2>${esc(record.title)}</h2><p>${esc(record.summary)}</p>
        <dl><div><dt>텍스트 무결성</dt><dd>${esc(record.integrity)}</dd></div><div><dt>출처 계보</dt><dd>${esc(record.provenance)}</dd></div><div><dt>현재 제시 방식</dt><dd>${esc(record.presentation)}</dd></div><div><dt>진행</dt><dd>${esc(record.duration)}</dd></div><div><dt>음향</dt><dd>${esc(record.audio)}</dd></div></dl>
        <footer><a href="${esc(record.original)}" target="_blank" rel="noopener">보호 원문 열람</a><button type="button" data-open-record="${esc(record.id)}">V6 연출 시제품</button></footer>
      </div>
    </article>`).join('');
  return `<section class="pc-v6-archive" aria-labelledby="v6ArchiveTitle">
    <header class="pc-v6-pagehead"><div><span>ARCHIVE 02 / SOURCE GATE</span><small>ORIGINAL ≠ STAGED PLAYBACK</small></div><p>원문과 연출본을 같은 자료처럼 표시하지 않는다.</p></header>
    <div class="pc-v6-archive-intro"><span class="pc-v6-eyebrow">DOUBLE ENTRY</span><h1 id="v6ArchiveTitle">죽은 사람의 기록부터 구분한다.</h1><p>원문은 즉시 열리고, 연출은 별도의 재구성 계층에서 시작한다. 출처가 불명인 자료도 지우지는 않지만, 원본이라는 이름으로 위장하지 않는다.</p></div>
    <div class="pc-v6-record-grid">${records}</div>
    <aside class="pc-v6-source-rule"><span>SOURCE BOUNDARY</span><p>두 보호 기록의 현재 이미지·오디오·영상 자산은 출처 대조 및 라이선스 검토 상태다. V6 시제품은 기존 공개 이미지만 제한적으로 참조하며 오디오와 영상을 자동 재생하지 않는다.</p></aside>
  </section>`;
}

export async function mount(root,{navigate,detail}){
  const open=async(id,trigger)=>{
    const viewer=await import('../record-theatre.js');
    viewer.openRecord(id,trigger,{onClose:()=>{
      if(location.hash!== '#/archive') navigate('archive');
    }});
  };
  root.querySelectorAll('[data-open-record]').forEach(button=>button.addEventListener('click',()=>navigate('archive',button.dataset.openRecord)));
  if(detail&&ARCHIVE_RECORDS[detail]){
    const trigger=root.querySelector(`[data-open-record="${CSS.escape(detail)}"]`);
    requestAnimationFrame(()=>open(detail,trigger));
  }
}
