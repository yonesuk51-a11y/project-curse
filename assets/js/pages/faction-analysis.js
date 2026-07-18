// Project Curse 5.15.2cf — unified faction dossier and relationship view
(function(){
  'use strict';

  const source = window.ProjectCurseFactionAnalysis;
  if(!source || !source.factions) return;

  const q = (selector, root=document) => root.querySelector(selector);
  const qa = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
  })[char]);
  const mark = (key) => `assets/faction_marks/${key}.webp`;
  let selected = null;
  let repairingMenu = false;

  function factionCard(key){
    const faction = source.factions[key];
    return `<button class="pc-faction-card" data-pc-faction-open="${esc(key)}" type="button">
      <img src="${mark(key)}" alt="${esc(faction.name)} 표식" loading="lazy">
      <b>${esc(faction.name)}</b>
    </button>`;
  }

  function factionGroups(){
    const groups = source.groups || [{label:'PRIMARY ORGANIZATIONS', keys:source.order}];
    return groups.map((group) => `<section class="pc-faction-index-group">
      <h3>${esc(group.label)}</h3>
      <div class="pc-faction-index-grid">${group.keys.map(factionCard).join('')}</div>
    </section>`).join('');
  }

  function relationButton(relation){
    const target = source.factions[relation.target];
    if(!target) return '';
    return `<button class="pc-faction-relation" data-pc-faction-open="${esc(relation.target)}" type="button">
      <strong>${esc(target.name)}<small>${esc(relation.label)}</small></strong>
      <span>${esc(relation.text)}</span>
      <i aria-hidden="true">›</i>
    </button>`;
  }

  function dossier(key){
    const faction = source.factions[key] || source.factions.uac;
    return `<article class="pc-faction-dossier" data-pc-faction-dossier="${esc(key)}" aria-live="polite">
      <header class="pc-faction-dossier-head">
        <img src="${mark(key)}" alt="${esc(faction.name)} 표식" loading="lazy">
        <div><span>FACTION DOSSIER / CONFIRMED HISTORY</span><h3>${esc(faction.name)}</h3></div>
      </header>
      <p class="pc-faction-lead">${esc(faction.lead)}</p>
      <section class="pc-faction-copy" aria-label="조직 개요">
        ${faction.overview.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}
      </section>
      <div class="pc-faction-brief-grid">
        <section class="pc-faction-operations">
          <h4 class="pc-faction-section-title">확인된 활동</h4>
          <ul>${faction.operations.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
        </section>
        <section class="pc-faction-fault">
          <h4 class="pc-faction-section-title">내부 문제와 모순</h4>
          <p>${esc(faction.fault)}</p>
        </section>
      </div>
      <section class="pc-faction-chronology">
        <h4 class="pc-faction-section-title">조직 연혁</h4>
        <ol>${faction.chronology.map(([date, text]) => `<li><time>${esc(date)}</time><span>${esc(text)}</span></li>`).join('')}</ol>
      </section>
      <section class="pc-faction-relations">
        <h4 class="pc-faction-section-title">직접 관계</h4>
        <div class="pc-faction-relation-list">${faction.relations.map(relationButton).join('')}</div>
      </section>
    </article>`;
  }

  function prepareSection(){
    const section = q('#faction-info');
    if(!section) return null;
    section.className = 'content-page panel pc-faction-analysis-page' + (section.classList.contains('active') ? ' active' : '');
    document.body.classList.add('pc-faction-analysis-ready');
    return section;
  }

  function renderIndex(){
    const section = prepareSection();
    if(!section) return;
    selected = null;
    section.innerHTML = `<div class="pc-faction-analysis" data-pc-faction-owner="1">
      <header class="pc-faction-analysis-intro">
        <small>U.A.C CLOSED ARCHIVE / FACTION ANALYSIS</small>
        <h2>세력 분석실</h2>
        <p>열람할 세력 마크를 선택하십시오.</p>
      </header>
      <div class="pc-faction-index" aria-label="분석 대상 세력">${factionGroups()}</div>
    </div>`;
  }

  function renderDossier(key){
    const section = prepareSection();
    if(!section) return;
    selected = source.factions[key] ? key : 'uac';
    section.innerHTML = `<div class="pc-faction-analysis pc-faction-analysis-detail" data-pc-faction-owner="1">
      <button class="pc-faction-back" data-pc-faction-back type="button"><i aria-hidden="true">←</i> 세력 목록으로 복귀</button>
      ${dossier(selected)}
    </div>`;
  }

  function factionKeyFromHash(){
    const match = location.hash.match(/^#faction-info\/([a-z0-9_-]+)$/i);
    return match && source.factions[match[1]] ? match[1] : null;
  }

  function setFactionHash(key, push){
    const hash = key ? `#faction-info/${key}` : '#faction-info';
    if(location.hash === hash) return;
    try{ history[push ? 'pushState' : 'replaceState'](null, '', hash); }catch(_error){}
  }

  function ensureMenu(){
    if(repairingMenu) return;
    const nav = q('.side-menu');
    if(!nav) return;
    repairingMenu = true;
    qa('a[data-target="faction-relation"]', nav).forEach((link) => link.remove());
    const factionLink = q('a[data-target="faction-info"]', nav);
    const archiveLink = q('a[data-target="archive-entry"]', nav);
    if(factionLink){
      const index = q('i', factionLink); const title = q('b', factionLink); const small = q('small', factionLink);
      if(index && index.textContent !== '03') index.textContent = '03';
      if(title && title.textContent !== '세력 분석실') title.textContent = '세력 분석실';
      if(small && small.textContent !== '기관·관계 기록') small.textContent = '기관·관계 기록';
    }
    if(archiveLink){
      const index = q('i', archiveLink);
      if(index && index.textContent !== '04') index.textContent = '04';
    }
    repairingMenu = false;
  }

  function activateFactionPage(){
    qa('.content-page').forEach((page) => page.classList.toggle('active', page.id === 'faction-info'));
    qa('.side-menu a[data-target]').forEach((link) => link.classList.toggle('active', link.dataset.target === 'faction-info'));
    const content = q('.legacy-content');
    if(content) content.scrollTop = 0;
  }

  function openIndex(push=true){
    activateFactionPage();
    renderIndex();
    setFactionHash(null, push);
  }

  function openDossier(key, push=true){
    if(!source.factions[key]) key = 'uac';
    activateFactionPage();
    renderDossier(key);
    setFactionHash(key, push);
  }

  function renderFromLocation(){
    const key = factionKeyFromHash();
    if(key) renderDossier(key);
    else renderIndex();
  }

  function boot(){
    ensureMenu();
    const section = q('#faction-info');
    if(section && !q('[data-pc-faction-owner="1"]', section)) renderFromLocation();
    if(location.hash === '#faction-relation') openIndex(false);
  }

  function ready(callback){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, {once:true});
    else callback();
  }

  ready(() => {
    renderFromLocation();
    boot();
    [80, 260, 700, 1400, 2600, 3800, 5400].forEach((delay) => setTimeout(boot, delay));

    document.addEventListener('click', (event) => {
      const legacyRelation = event.target.closest && event.target.closest('a[data-target="faction-relation"], [data-pc5152bo-open="relation"], [data-pc5152bo-faction]');
      if(legacyRelation){
        event.preventDefault();
        event.stopImmediatePropagation();
        const key = legacyRelation.dataset.pc5152boFaction;
        if(key && source.factions[key]) openDossier(key);
        else openIndex();
        return;
      }
      const factionMenu = event.target.closest && event.target.closest('.side-menu a[data-target="faction-info"]');
      if(factionMenu){
        event.preventDefault();
        event.stopImmediatePropagation();
        openIndex();
        return;
      }
      const back = event.target.closest && event.target.closest('[data-pc-faction-back]');
      if(back){
        event.preventDefault();
        event.stopImmediatePropagation();
        openIndex(false);
        return;
      }
      const open = event.target.closest && event.target.closest('[data-pc-faction-open]');
      if(open){
        event.preventDefault();
        event.stopImmediatePropagation();
        openDossier(open.dataset.pcFactionOpen);
      }
    }, true);

    window.addEventListener('hashchange', () => {
      if(location.hash === '#faction-relation') openIndex(false);
      else if(location.hash === '#faction-info' || factionKeyFromHash()){
        activateFactionPage();
        renderFromLocation();
      }
      setTimeout(boot, 40);
    });
    window.addEventListener('popstate', () => {
      if(location.hash === '#faction-info' || factionKeyFromHash()){
        activateFactionPage();
        renderFromLocation();
      }
    });

    const nav = q('.side-menu');
    if(nav){
      new MutationObserver(() => setTimeout(ensureMenu, 0)).observe(nav, {childList:true, subtree:true, characterData:true});
    }

    const section = q('#faction-info');
    if(section){
      new MutationObserver(() => {
        if(!q('[data-pc-faction-owner="1"]', section)) setTimeout(renderFromLocation, 0);
      }).observe(section, {childList:true});
    }

    window.ProjectCurseFactionAnalysisRuntime = Object.freeze({
      render(key){ key ? renderDossier(key) : renderIndex(); },
      open(key='uac'){
        openDossier(key);
      },
      index(){ openIndex(); },
      owner: 'assets/js/pages/faction-analysis.js'
    });
  });
})();
