// Project Curse 5.15.2cv — route-free faction dossier owner.
(function(){
  'use strict';

  const source=window.ProjectCurseFactionAnalysis;
  if(!source?.factions) return;

  const q=(selector,root=document)=>root.querySelector(selector);
  const esc=(value)=>String(value??'').replace(/[&<>'"]/g,(char)=>({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  })[char]);
  const mark=(key)=>`assets/faction_marks/${key}.webp`;
  let selected=null;

  function factionCard(key){
    const faction=source.factions[key];
    return `<button class="pc-faction-card" data-pc-faction-open="${esc(key)}" type="button">
      <img src="${mark(key)}" alt="${esc(faction.name)} 표식" loading="lazy">
      <b>${esc(faction.name)}</b>
    </button>`;
  }

  function factionGroups(){
    const groups=source.groups||[{label:'PRIMARY ORGANIZATIONS',keys:source.order}];
    return groups.map((group)=>`<section class="pc-faction-index-group">
      <h3>${esc(group.label)}</h3>
      <div class="pc-faction-index-grid">${group.keys.map(factionCard).join('')}</div>
    </section>`).join('');
  }

  function relationButton(relation){
    const target=source.factions[relation.target];
    if(!target) return '';
    return `<button class="pc-faction-relation" data-pc-faction-open="${esc(relation.target)}" type="button">
      <strong>${esc(target.name)}<small>${esc(relation.label)}</small></strong>
      <span>${esc(relation.text)}</span><i aria-hidden="true">›</i>
    </button>`;
  }

  function dossier(key){
    const faction=source.factions[key]||source.factions.uac;
    return `<article class="pc-faction-dossier" data-pc-faction-dossier="${esc(key)}" aria-live="polite">
      <header class="pc-faction-dossier-head">
        <img src="${mark(key)}" alt="${esc(faction.name)} 표식" loading="lazy">
        <div><span>FACTION DOSSIER / CONFIRMED HISTORY</span><h3>${esc(faction.name)}</h3></div>
      </header>
      <p class="pc-faction-lead">${esc(faction.lead)}</p>
      <section class="pc-faction-copy" aria-label="조직 개요">
        ${faction.overview.map((paragraph)=>`<p>${esc(paragraph)}</p>`).join('')}
      </section>
      <div class="pc-faction-brief-grid">
        <section class="pc-faction-operations"><h4 class="pc-faction-section-title">확인된 활동</h4>
          <ul>${faction.operations.map((item)=>`<li>${esc(item)}</li>`).join('')}</ul>
        </section>
        <section class="pc-faction-fault"><h4 class="pc-faction-section-title">내부 문제와 모순</h4><p>${esc(faction.fault)}</p></section>
      </div>
      <section class="pc-faction-chronology"><h4 class="pc-faction-section-title">조직 연혁</h4>
        <ol>${faction.chronology.map(([date,text])=>`<li><time>${esc(date)}</time><span>${esc(text)}</span></li>`).join('')}</ol>
      </section>
      <section class="pc-faction-relations"><h4 class="pc-faction-section-title">직접 관계</h4>
        <div class="pc-faction-relation-list">${faction.relations.map(relationButton).join('')}</div>
      </section>
    </article>`;
  }

  function prepareSection(){
    const section=q('#faction-info');
    if(!section) return null;
    section.className='content-page panel pc-faction-analysis-page'+(section.classList.contains('active')?' active':'');
    document.body.classList.add('pc-faction-analysis-ready');
    return section;
  }

  function resetScroll(){
    const content=q('.uac-shell-content');
    if(content){content.scrollTop=0;content.scrollLeft=0;}
  }

  function renderIndex(){
    const section=prepareSection();
    if(!section) return false;
    selected=null;
    section.innerHTML=`<div class="pc-faction-analysis" data-pc-faction-owner="1">
      <header class="pc-faction-analysis-intro"><small>U.A.C CLOSED ARCHIVE / FACTION ANALYSIS</small>
        <h2>세력 분석실</h2><p>열람할 세력 마크를 선택하십시오.</p>
      </header>
      <div class="pc-faction-index" aria-label="분석 대상 세력">${factionGroups()}</div>
    </div>`;
    resetScroll();
    return true;
  }

  function renderDossier(key){
    const section=prepareSection();
    if(!section) return false;
    selected=source.factions[key]?key:'uac';
    section.innerHTML=`<div class="pc-faction-analysis pc-faction-analysis-detail" data-pc-faction-owner="1">
      <button class="pc-faction-back" data-pc-faction-back type="button"><i aria-hidden="true">←</i> 세력 목록으로 복귀</button>
      ${dossier(selected)}
    </div>`;
    resetScroll();
    return true;
  }

  function openIndex(){
    if(window.ProjectCurseShell?.getRoute()!=='faction-info') window.ProjectCurseShell?.navigate('faction-info');
    return renderIndex();
  }

  function openDossier(key){
    if(!source.factions[key]) key='uac';
    if(window.ProjectCurseShell?.getRoute()!=='faction-info') window.ProjectCurseShell?.navigate('faction-info');
    return renderDossier(key);
  }

  function ready(callback){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',callback,{once:true});
    else callback();
  }

  ready(()=>{
    renderIndex();

    document.addEventListener('projectcurse:screen-committed',(event)=>{
      if(event.detail?.target==='faction-info'&&event.detail?.previous!=='faction-info') renderIndex();
    });

    document.addEventListener('click',(event)=>{
      const back=event.target.closest?.('[data-pc-faction-back]');
      if(back){
        event.preventDefault();
        event.stopImmediatePropagation();
        renderIndex();
        return;
      }
      const open=event.target.closest?.('[data-pc-faction-open]');
      if(open){
        event.preventDefault();
        event.stopImmediatePropagation();
        openDossier(open.dataset.pcFactionOpen);
      }
    },true);

    window.ProjectCurseFactionAnalysisRuntime=Object.freeze({
      render:(key)=>key?renderDossier(key):renderIndex(),
      open:openDossier,
      index:openIndex,
      getSelected:()=>selected,
      owner:'assets/js/pages/faction-analysis.js'
    });
  });
})();
