import {ARCHIVE_RECORDS,CULT_INDEX,IMMORTALITY_ACTS} from './data.js';

const esc=value=>String(value??'').replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
let dialog=null;
let returnTarget=null;
let closeCallback=null;

function ensureDialog(){
  if(dialog) return dialog;
  dialog=document.createElement('dialog');
  dialog.className='pc-v6-record-dialog';
  dialog.addEventListener('click',event=>{if(event.target===dialog) dialog.close('dismiss');});
  dialog.addEventListener('close',()=>{
    document.body.classList.remove('pc-v6-record-open');
    const callback=closeCallback;closeCallback=null;
    callback?.();
    returnTarget?.focus?.({preventScroll:true});
    returnTarget=null;
  });
  document.body.append(dialog);
  return dialog;
}

function cultMarkup(record){
  const tabs=CULT_INDEX.map((item,index)=>`<button type="button" data-cult-index="${index}" aria-pressed="${index===0}"><span>${esc(item.code)}</span><b>${esc(item.title)}</b><small>${esc(item.group)}</small></button>`).join('');
  return `<div class="pc-v6-cult-desk"><nav aria-label="교단 기록면">${tabs}</nav><section data-cult-panel></section><aside><span>ANALYST NOTE</span><p>이 화면은 자동 영상이 아니다. 기록면을 직접 선택하고 출처와 현장 대응을 대조한다.</p><b>원문 텍스트 변경 없음</b></aside></div>`;
}

function cultPanel(item){
  return `<figure><img src="${esc(item.image)}" alt="${esc(item.title)} 기록 이미지"><figcaption><code>${esc(item.code)}</code><span>${esc(item.state)}</span></figcaption></figure><article><span>${esc(item.group)}</span><h3>${esc(item.title)}</h3><dl><div><dt>원문 근거</dt><dd>${esc(item.sourceRef)}</dd></div><div><dt>현재 판독</dt><dd>${esc(item.finding)}</dd></div><div><dt>현장 대응</dt><dd>${esc(item.response)}</dd></div></dl></article>`;
}

function immortalityMarkup(){
  const timeline=IMMORTALITY_ACTS.map((item,index)=>`<button type="button" data-immortality-act="${index}" aria-pressed="${index===0}"><span>${esc(item.act)}</span><time>${esc(item.time)}</time><b>${esc(item.title)}</b></button>`).join('');
  return `<div class="pc-v6-immortality"><nav aria-label="불멸을 향해 네 막">${timeline}</nav><section data-immortality-panel></section><footer><span>PLAYBACK STATE / PAUSED</span><b>자동 재생 없음 · 음향 없음 · 장면 직접 선택</b></footer></div>`;
}

function immortalityPanel(item){
  return `<figure><img src="${esc(item.image)}" alt="${esc(item.title)} 회수 이미지"><figcaption><span>${esc(item.signal)}</span><time>${esc(item.time)}</time></figcaption></figure><article><span>${esc(item.act)}</span><h3>${esc(item.title)}</h3><b>${esc(item.state)}</b><p>${esc(item.summary)}</p><small>${esc(item.sourceRef)}</small></article>`;
}

function bindCult(root){
  const panel=root.querySelector('[data-cult-panel]');
  const select=index=>{
    const item=CULT_INDEX[index]||CULT_INDEX[0];
    panel.innerHTML=cultPanel(item);
    root.querySelectorAll('[data-cult-index]').forEach((button,buttonIndex)=>button.setAttribute('aria-pressed',String(buttonIndex===index)));
  };
  root.querySelectorAll('[data-cult-index]').forEach(button=>button.addEventListener('click',()=>select(Number(button.dataset.cultIndex))));
  select(0);
}

function bindImmortality(root){
  const panel=root.querySelector('[data-immortality-panel]');
  const select=index=>{
    const item=IMMORTALITY_ACTS[index]||IMMORTALITY_ACTS[0];
    panel.innerHTML=immortalityPanel(item);
    root.querySelectorAll('[data-immortality-act]').forEach((button,buttonIndex)=>button.setAttribute('aria-pressed',String(buttonIndex===index)));
  };
  root.querySelectorAll('[data-immortality-act]').forEach(button=>button.addEventListener('click',()=>select(Number(button.dataset.immortalityAct))));
  select(0);
}

export function openRecord(id,trigger,{onClose}={}){
  const record=ARCHIVE_RECORDS[id];
  if(!record) return false;
  const root=ensureDialog();
  returnTarget=trigger||document.activeElement;
  closeCallback=onClose||null;
  root.innerHTML=`<div class="pc-v6-record-dialog__frame"><header><div><span>${esc(record.code)} / ${esc(record.source)}</span><h2 id="v6RecordDialogTitle">${esc(record.title)}</h2></div><div><a href="${esc(record.original)}" target="_blank" rel="noopener">보호 원문</a><button type="button" data-sensitive-toggle aria-pressed="true">이미지 표시</button><button type="button" data-dialog-close aria-label="기록 연출 닫기">닫기 ×</button></div></header><div class="pc-v6-record-dialog__notice"><span>STAGED RECONSTRUCTION</span><dl><div><dt>TEXT INTEGRITY</dt><dd>${esc(record.integrity)}</dd></div><div><dt>SOURCE PROVENANCE</dt><dd>${esc(record.provenance)}</dd></div><div><dt>PRESENTATION</dt><dd>${esc(record.presentation)}</dd></div></dl></div><div class="pc-v6-record-dialog__content">${id==='Cults_871104'?cultMarkup(record):immortalityMarkup(record)}</div></div>`;
  root.setAttribute('aria-labelledby','v6RecordDialogTitle');
  root.querySelector('[data-dialog-close]').addEventListener('click',()=>root.close('close'));
  root.classList.add('is-sensitive-hidden');
  root.querySelector('[data-sensitive-toggle]').addEventListener('click',event=>{
    const hidden=root.classList.toggle('is-sensitive-hidden');
    event.currentTarget.setAttribute('aria-pressed',String(hidden));
    event.currentTarget.textContent=hidden?'이미지 표시':'이미지 가리기';
  });
  if(id==='Cults_871104') bindCult(root); else bindImmortality(root);
  document.body.classList.add('pc-v6-record-open');
  if(!root.open) root.showModal();
  root.querySelector('[data-dialog-close]')?.focus({preventScroll:true});
  return true;
}
