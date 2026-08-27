// Project Curse 5.54.0 — reader-first faction profiles with optional archive depth.
(function(){
  'use strict';

  const source=window.ProjectCurseFactionAnalysis;
  const incidentNetwork=window.ProjectCurseIncidentNetwork;
  const markRegistry=window.ProjectCurseFactionMarks;
  const lineage=window.ProjectCurseFactionLineage;
  const historyData=window.ProjectCurseWorldHistoryData;
  const personnel=window.ProjectCursePersonnel;
  if(!source?.factions) return;

  const q=(selector,root=document)=>root.querySelector(selector);
  const esc=(value)=>String(value??'').replace(/[&<>'"]/g,(char)=>({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  })[char]);
  let selected=null;

  function markData(key){
    return markRegistry?.marks?.[key]||{
      name:source.factions[key]?.name||key,
      asset:`assets/faction_marks/${key}.webp`,
      type:'등록 표식',source:'기존 세력 자료',assetState:'감식 정보 미등록',
      firstSeen:'확인되지 않음',confidence:'—',usage:'세력 식별',symbols:[]
    };
  }

  function markImage(key,className='',decorative=false){
    const data=markData(key);
    const fallback=data.legacyAsset||`assets/faction_marks/${key}.webp`;
    const alt=decorative?'':`${source.factions[key]?.name||data.name} 표식`;
    return `<img${className?` class="${esc(className)}"`:''} src="${esc(data.asset)}" alt="${esc(alt)}" data-pc-faction-mark="${esc(key)}" data-pc-mark-fallback="${esc(fallback)}"${decorative?' aria-hidden="true"':''} loading="lazy">`;
  }

  function markStyle(key){
    const accent=markData(key).accent;
    return accent?` style="--pc-faction-mark-accent:${esc(accent)}"`:'';
  }

  function firstSentence(value){
    const text=String(value||'').trim();
    const match=text.match(/^.*?[.!?。](?:\s|$)/);
    return match?match[0].trim():text;
  }

  function groupLabel(label){
    return ({
      'PRIMARY INSTITUTIONS':'주요 기관',
      'EXTERNAL POWERS':'독립 세력',
      'CULT LINEAGE / COMMAND STATUS':'우시노다 계통'
    })[label]||label;
  }

  function factionCard(key){
    const faction=source.factions[key];
    const status=firstSentence(faction.assessment?.status);
    return `<button class="pc-faction-card" data-pc-faction-open="${esc(key)}" type="button"${markStyle(key)}>
      ${markImage(key)}
      <span><b>${esc(faction.name)}</b><p>${esc(faction.lead)}</p>${status?`<small>${esc(status)}</small>`:''}</span>
      <i aria-hidden="true">›</i>
    </button>`;
  }

  function factionGroups(){
    const groups=source.groups||[{label:'PRIMARY ORGANIZATIONS',keys:source.order}];
    return groups.map((group)=>`<section class="pc-faction-index-group">
      <h3>${esc(groupLabel(group.label))}</h3>
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

  function factionProfile(faction){
    const profile=faction.profile;
    if(!profile?.items?.length) return '';
    return `<section class="pc-faction-profile" aria-label="${esc(profile.label)}">
      <header><h4>${esc(profile.label)}</h4></header>
      <p>${esc(profile.note)}</p>
      <dl>${profile.items.map(([term,text])=>`<div><dt>${esc(term)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl>
    </section>`;
  }

  function factionAssessment(faction){
    const assessment=faction.assessment;
    if(!assessment) return '';
    const rows=[
      ['현재',assessment.status,'current'],
      ['형성 과정',assessment.lineage,'lineage'],
      ['주의할 점',assessment.misconception,'misread'],
      ['남겨진 문제',assessment.past,'past'],
      ['아직 모르는 것',assessment.unresolved,'unresolved']
    ];
    return `<section class="pc-faction-assessment" aria-label="세력 이해에 필요한 배경">
      <header><small>CONTEXT</small><h4>이해에 필요한 배경</h4></header>
      <dl>${rows.map(([term,text,tone])=>`<div data-assessment-layer="${tone}"><dt>${esc(term)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl>
    </section>`;
  }

  function factionVisual(faction){
    const visual=faction.visual;
    if(!visual?.src) return '';
    return `<figure class="pc-faction-visual" data-evidence-class="${esc(visual.className||'UNVERIFIED')}">
      <img src="${esc(visual.src)}" alt="${esc(visual.alt||'')}" loading="lazy" decoding="async">
      <figcaption><b>${esc(visual.label||'ANALYTICAL RECONSTRUCTION')}</b><span>${esc(visual.caption||'')}</span></figcaption>
    </figure>`;
  }

  function personnelLinks(key){
    const ids=personnel?.factionIndex?.[key]||[];
    if(!ids.length) return '';
    const visible=ids.slice(0,8).map(id=>personnel.byId[id]).filter(Boolean);
    return `<section class="pc-faction-personnel"><header><div><small>PERSONNEL</small><h4 class="pc-faction-section-title">관련 인물</h4></div></header>
      <div>${visible.map(record=>`<button data-uac-person-record="${esc(record.id)}" data-uac-route="personnel" type="button"><span><b>${esc(record.name)}</b><small>${esc(record.role)}</small></span><i aria-hidden="true">›</i></button>`).join('')}</div>
      <footer><button data-uac-route="personnel" type="button">인물 기록 열기&nbsp;↗</button></footer>
    </section>`;
  }

  function markAuthentication(key){
    const data=markData(key);
    const symbols=(data.symbols||[]).map(item=>`<li><strong>${esc(item.label)}</strong><span>${esc(item.text)}</span></li>`).join('');
    return `<section class="pc-faction-mark-analysis" aria-labelledby="pc-faction-mark-title"${markStyle(key)}>
      <header>
        <small>INSIGNIA</small>
        <h4 id="pc-faction-mark-title">문양</h4>
      </header>
      <div class="pc-faction-mark-grid">
        <figure>
          ${markImage(key,'pc-faction-mark-master')}
        </figure>
        <dl>
          <div><dt>종류</dt><dd>${esc(data.type)}</dd></div>
          <div><dt>처음 확인</dt><dd>${esc(data.firstSeen)}</dd></div>
          <div><dt>사용 방식</dt><dd>${esc(data.usage)}</dd></div>
        </dl>
      </div>
      ${symbols?`<ol class="pc-faction-mark-symbols">${symbols}</ol>`:''}
      ${data.note?`<p class="pc-faction-mark-note"><b>주의</b>${esc(data.note)}</p>`:''}
    </section>`;
  }

  function lineageAtlas(key){
    const active=lineage?.nodes?.[key];
    if(!active) return '';
    const state=lineage.states?.[active.state];
    const nodes=lineage.order.map(nodeKey=>{
      const node=lineage.nodes[nodeKey];
      return `<button type="button" class="pc-lineage-node${nodeKey===key?' is-active':''}" data-pc-faction-open="${esc(nodeKey)}" data-lineage-state="${esc(node.state)}"${markStyle(nodeKey)}>
        ${markImage(nodeKey,'',true)}
        <span><b>${esc(node.name)}</b><small>${esc(node.short)}</small></span>
      </button>`;
    }).join('');
    const edges=lineage.edges.map(edge=>{
      const edgeState=lineage.states?.[edge.state];
      return `<li data-lineage-state="${esc(edge.state)}"><span>${esc(lineage.nodes[edge.from]?.name)}</span><i aria-hidden="true"></i><span>${esc(lineage.nodes[edge.to]?.name)}</span><small>${esc(edge.label)} · ${esc(edgeState?.label)}</small></li>`;
    }).join('');
    const history=(active.history||[]).map(id=>{
      const record=historyData?.records?.[id];
      const meta=lineage.historyMeta?.[id];
      if(!record&&!meta) return null;
      return {id,date:record?.date||meta?.date||'DATE PARTIAL',title:record?.title||meta?.title||id};
    }).filter(Boolean);
    return `<section class="pc-faction-lineage" aria-labelledby="pc-lineage-title">
      <header><div><small>LINEAGE</small><h4 id="pc-lineage-title">교단 계통</h4></div><span data-lineage-state="${esc(active.state)}">${esc(state?.label||active.state)}</span></header>
      <div class="pc-lineage-current"><strong>${esc(active.kind)}</strong><span>${esc(active.command)}</span><p>${esc(active.summary)}</p></div>
      <div class="pc-lineage-atlas" aria-label="우시노다 계보 노드">${nodes}</div>
      <ol class="pc-lineage-edges">${edges}</ol>
      <aside class="pc-lineage-warning"><b>확인되지 않음</b><span>${esc(lineage.unresolved.map(item=>item.text).join(' '))}</span></aside>
      ${history.length?`<div class="pc-lineage-history"><h5>연결 세계 기록</h5>${history.map(record=>`<button type="button" data-pc-faction-history="${esc(record.id)}"><time>${esc(record.date)}</time><span>${esc(record.title)}</span><i aria-hidden="true">↗</i></button>`).join('')}</div>`:''}
    </section>`;
  }

  function factionReaderSummary(faction,incidents){
    const assessment=faction.assessment||{};
    const relation=faction.relations?.[0];
    const target=relation?source.factions[relation.target]:null;
    const incident=incidents[0];
    return `<section class="pc-faction-reader-summary" aria-label="${esc(faction.name)} 핵심 정보">
      <div><small>현재</small><p>${esc(assessment.status||faction.lead)}</p></div>
      ${faction.operations?.length?`<div><small>주요 행동</small><p>${esc(faction.operations[0])}</p></div>`:''}
      ${relation&&target?`<button type="button" data-pc-faction-open="${esc(relation.target)}"><small>주요 관계</small><b>${esc(target.name)}</b><span>${esc(relation.label)}</span><i aria-hidden="true">›</i></button>`:''}
      ${incident?`<button type="button" data-pc-faction-incident="${esc(incident.id)}"><small>대표 사건</small><b>${esc(incident.title)}</b><span>${esc(incident.date)}</span><i aria-hidden="true">↗</i></button>`:''}
    </section>`;
  }

  function moreRecord(label,title,body){
    if(!body) return '';
    return `<details class="pc-faction-more"><summary><span><small>${esc(label)}</small><b>${esc(title)}</b></span><em>펼쳐 보기&nbsp;＋</em></summary><div>${body}</div></details>`;
  }

  function dossier(key){
    const faction=source.factions[key]||source.factions.uac;
    const incidents=(incidentNetwork?.incidentList||[]).filter(item=>item.factions.includes(key));
    const organization=`<section class="pc-faction-copy" aria-label="조직 개요">${faction.overview.map((paragraph)=>`<p>${esc(paragraph)}</p>`).join('')}</section>
      ${factionProfile(faction)}
      <div class="pc-faction-brief-grid"><section class="pc-faction-operations"><h4 class="pc-faction-section-title">주요 활동</h4><ul>${faction.operations.map((item)=>`<li>${esc(item)}</li>`).join('')}</ul></section><section class="pc-faction-fault"><h4 class="pc-faction-section-title">내부 문제</h4><p>${esc(faction.fault)}</p></section></div>
      ${factionAssessment(faction)}`;
    const history=`<section class="pc-faction-chronology"><h4 class="pc-faction-section-title">주요 연혁</h4><ol>${faction.chronology.map(([date,text])=>`<li><time>${esc(date)}</time><span>${esc(text)}</span></li>`).join('')}</ol></section>
      ${incidents.length?`<section class="pc-faction-incidents"><h4 class="pc-faction-section-title">연결 사건</h4><div>${incidents.map(incident=>`<button type="button" data-pc-faction-incident="${esc(incident.id)}"><time>${esc(incident.date)}</time><strong>${esc(incident.title)}</strong><small>${esc(incident.status)}</small></button>`).join('')}</div></section>`:''}`;
    const connections=`${personnelLinks(key)}<section class="pc-faction-relations"><h4 class="pc-faction-section-title">다른 세력과의 관계</h4><div class="pc-faction-relation-list">${faction.relations.map(relationButton).join('')}</div></section>`;
    const evidence=`${factionVisual(faction)}${markAuthentication(key)}${lineageAtlas(key)}`;
    return `<article class="pc-faction-dossier" data-pc-faction-dossier="${esc(key)}" aria-live="polite"${markStyle(key)}>
      <header class="pc-faction-dossier-head">
        ${markImage(key)}
        <div><span>FACTION</span><h3>${esc(faction.name)}</h3></div>
      </header>
      <p class="pc-faction-lead">${esc(faction.lead)}</p>
      ${factionReaderSummary(faction,incidents)}
      <div class="pc-faction-more-stack">
        ${moreRecord('ORGANIZATION','조직과 활동',organization)}
        ${moreRecord('HISTORY','역사와 사건',history)}
        ${moreRecord('CONNECTIONS','관계와 인물',connections)}
        ${moreRecord('INSIGNIA / LINEAGE','문양과 계통',evidence)}
      </div>
    </article>`;
  }

  function prepareSection(){
    const section=q('#faction-info');
    if(!section) return null;
    section.className='content-page panel pc-faction-analysis-page'+(section.classList.contains('active')?' active':'');
    document.body.classList.add('pc-faction-analysis-ready');
    return section;
  }

  function bindMarkFallbacks(root){
    root.querySelectorAll('img[data-pc-faction-mark]').forEach(image=>{
      image.addEventListener('error',()=>{
        const fallback=image.dataset.pcMarkFallback;
        if(fallback&&image.getAttribute('src')!==fallback){
          image.setAttribute('src',fallback);
          return;
        }
        const key=image.dataset.pcFactionMark||'';
        const label=(source.factions[key]?.name||key).replace(/[^A-Za-z0-9.]/g,'').slice(0,5)||'MARK';
        const replacement=document.createElement('span');
        replacement.className='pc-faction-mark-fallback';
        replacement.setAttribute('role','img');
        replacement.setAttribute('aria-label',image.alt||`${label} 표식`);
        replacement.textContent=label;
        image.replaceWith(replacement);
      },{once:true});
    });
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
      <header class="pc-faction-analysis-intro"><small>U.A.C CLOSED ARCHIVE / INTELLIGENCE ANALYSIS</small>
        <h2>세력 분석</h2><p>기관과 교단, 독립 세력이 무엇을 원하고 누구와 충돌하는지 정리했다.</p>
      </header>
      <div class="pc-faction-index" aria-label="분석 대상 세력">${factionGroups()}</div>
    </div>`;
    bindMarkFallbacks(section);
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
    bindMarkFallbacks(section);
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
      const history=event.target.closest?.('[data-pc-faction-history]');
      if(history){
        event.preventDefault();
        event.stopImmediatePropagation();
        window.ProjectCurseAudioControl?.play?.('incident.link');
        window.ProjectCurseShell?.navigate('history',{replace:false,historyMode:'push'}).then(()=>{
          window.ProjectCurseWorldHistoryRuntime?.open?.(history.dataset.pcFactionHistory);
        });
        return;
      }
      const incident=event.target.closest?.('[data-pc-faction-incident]');
      if(incident){
        event.preventDefault();
        event.stopImmediatePropagation();
        window.ProjectCurseAudioControl?.play?.('incident.link');
        window.ProjectCurseShell?.navigate('map-room',{replace:false,historyMode:'push'}).then(()=>{
          window.ProjectCurseMapRoomRuntime?.showIncident?.(incident.dataset.pcFactionIncident);
        });
        return;
      }
      const back=event.target.closest?.('[data-pc-faction-back]');
      if(back){
        event.preventDefault();
        event.stopImmediatePropagation();
        window.ProjectCurseAudioControl?.play?.('faction.back');
        renderIndex();
        return;
      }
      const open=event.target.closest?.('[data-pc-faction-open]');
      if(open){
        event.preventDefault();
        event.stopImmediatePropagation();
        window.ProjectCurseAudioControl?.play?.('faction.open');
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
