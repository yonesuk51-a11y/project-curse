import {FACTION_MARKS} from '../data.js';
import {MAP_DISCLOSURE,MAP_CLAIMS,MAP_REGIONS,MAP_SIGNALS,MAP_CONNECTIONS,MAP_OPERATIONS} from '../map-data.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));
const factionById=new Map(FACTION_MARKS.map(item=>[item.id,item]));
const signalById=new Map(MAP_SIGNALS.map(item=>[item.id,item]));
const regionById=new Map(MAP_REGIONS.map(item=>[item.id,item]));
const operationById=new Map(MAP_OPERATIONS.map(item=>[item.id,item]));
const claimLabels=Object.freeze({occurrence:'발생',time:'시간',location:'위치',cause:'원인',relation:'관계',outcome:'결과'});
const factionId=entry=>typeof entry==='string'?entry:entry?.id;
const signalClaims=item=>MAP_CLAIMS.signals[item.id]||(
  item.operationId==='three-night'?(item.id.startsWith('gbf-')?MAP_CLAIMS.signals['three-night-gbf']:MAP_CLAIMS.signals['three-night-dz']):null
);
const claimToken=value=>String(value||'unresolved').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const claimGrid=(claims,extraClass='')=>claims?`<dl class="pc-v6-map-claims ${esc(extraClass)}" aria-label="증거 축 판정">${Object.entries(claimLabels).map(([key,label])=>`<div data-claim="${esc(claimToken(claims[key]))}"><dt>${esc(label)}</dt><dd>${esc(claims[key])}</dd></div>`).join('')}</dl>`:'';

const markGlyph=(id,variant='map',accessible=false)=>{
  const item=factionById.get(id);
  if(!item) return '';
  const scale=variant==='seal'?'seal':variant==='badge'?'badge':'map';
  return `<span class="pc-v6-mark-stage pc-v6-mark-stage--${scale} is-${esc(item.status)}" title="${esc(item.name)}">
    <span class="pc-v6-mark" data-mark="${esc(item.id)}" ${accessible?`role="img" aria-label="${esc(item.name)} 표식"`:'aria-hidden="true"'}><i></i><b></b><em></em></span>
  </span>`;
};

const factionMarks=entries=>entries?.length?`<div class="pc-v6-map-factions" data-layer="factions" aria-label="관련 세력">${entries.map(entry=>{
  const id=factionId(entry);
  const item=factionById.get(id);
  const relation=typeof entry==='object'?entry.relation:'';
  return item?`<span>${markGlyph(id,'badge',true)}<b>${esc(item.code)}</b><small>${esc(item.name)}</small>${relation?`<em>${esc(relation)}</em>`:''}</span>`:'';
}).join('')}</div>`:'<p class="pc-v6-map-empty">관련 세력 판정 없음</p>';

const lineStyle=({from,to})=>{
  const dx=to[0]-from[0];
  const dy=(to[1]-from[1])*.5625;
  const length=Math.sqrt(dx*dx+dy*dy);
  const angle=Math.atan2(dy,dx)*180/Math.PI;
  return `left:${from[0]}%;top:${from[1]}%;width:${length}%;transform:rotate(${angle}deg)`;
};

const regionCard=item=>`<button type="button" data-map-region="${esc(item.id)}">
  <span>${esc(item.code)} / ${esc(item.basis)}</span><b>${esc(item.name)}</b><small>${esc(item.status)}</small>
</button>`;

const signalMarker=item=>{
  const layer=item.kind==='silence'?'synchrony':item.kind==='incident'?'incidents':item.kind==='control'||item.kind==='front'?'theatres':'claims';
  const claims=signalClaims(item);
  const firstFaction=factionId(item.factions?.[0]);
  return `<button type="button" class="pc-v6-map-marker is-${esc(item.kind)}" data-map-signal="${esc(item.id)}" data-layer="${layer}" data-evidence="${esc(claimToken(claims?.occurrence))}" data-location="${esc(claimToken(claims?.location))}" style="left:${item.position.plot.x}%;top:${item.position.plot.y}%" aria-label="${esc(item.name)} — ${esc(item.status)}">
    <i aria-hidden="true"></i><span>${esc(item.code)}</span>${firstFaction?`<span class="pc-v6-map-marker__faction" data-layer="factions">${markGlyph(firstFaction)}</span>`:''}
  </button>`;
};

const connectionLine=item=>`<span class="pc-v6-map-connection is-${esc(item.kind)}" data-layer="routes" style="${lineStyle(item)}" title="${esc(item.label)} — ${esc(item.warning)}" aria-hidden="true" hidden><i></i></span>`;

const signalInfo=item=>`<div class="pc-v6-map-intel__code"><span>${esc(item.code)}</span><small>SIGNAL DOSSIER</small></div>
  <h2 tabindex="-1" data-map-info-title>${esc(item.name)}</h2>
  <dl>
    <div><dt>현재 판정</dt><dd>${esc(item.status)}</dd></div>
    <div><dt>근거 계층</dt><dd>${esc(item.basis)}</dd></div>
    <div><dt>위치 신뢰</dt><dd>${esc(item.certainty)}</dd></div>
  </dl>
  ${claimGrid(signalClaims(item))}
  <p>${esc(item.summary)}</p>
  ${factionMarks(item.factions)}
  ${item.operationId?`<button type="button" class="pc-v6-map-intel__open" data-open-operation="${esc(item.operationId)}">${esc(operationById.get(item.operationId)?.openLabel||'관련 증거 사본 열기')}</button>`:''}`;

const regionInfo=item=>`<div class="pc-v6-map-intel__code"><span>${esc(item.code)}</span><small>THEATRE DOSSIER</small></div>
  <h2 tabindex="-1" data-map-info-title>${esc(item.name)}</h2>
  <dl>
    <div><dt>현재 상태</dt><dd>${esc(item.status)}</dd></div>
    <div><dt>판정 근거</dt><dd>${esc(item.basis)}</dd></div>
    <div><dt>좌표 규칙</dt><dd>DISPLAY PLOT ONLY</dd></div>
  </dl>
  <p>${esc(item.copy)}</p>
  <div class="pc-v6-map-intel__warning">거리·방위·도착 시간 산출 금지</div>`;

const operationPanel=operation=>`<article class="pc-v6-operation-copy" data-operation-copy="${esc(operation.id)}">
  <header>
    <div><span>${esc(operation.code)}</span><small>${esc(operation.date)}</small></div>
    <b>${esc(operation.state)}</b>
  </header>
  <div class="pc-v6-operation-copy__title">
    <div><span class="pc-v6-eyebrow">${esc(operation.presentation)}</span><h2 tabindex="-1">${esc(operation.title)}</h2><p>${esc(operation.theatre)}</p></div>
    <div class="pc-v6-operation-copy__stamp">NON-NAV<br>DISPLAY</div>
  </div>
  ${claimGrid(MAP_CLAIMS.operations[operation.id],'pc-v6-operation-claims')}
  <div class="pc-v6-operation-copy__grid">
    <div class="pc-v6-operation-track" aria-label="${esc(operation.title)} 단계">
      <ol>${operation.steps.map((step,index)=>`<li>
        <button type="button" data-operation-step="${index}" ${index===0?'aria-current="step"':''}>
          <span>${String(index+1).padStart(2,'0')}</span><time>${esc(step.time)}</time><b>${esc(step.title)}</b><small>${esc(step.basis)}</small>
        </button>
      </li>`).join('')}</ol>
      <div class="pc-v6-operation-controls">
        <button type="button" data-operation-prev disabled>이전 단계</button>
        <span><b data-operation-position>01</b> / ${String(operation.steps.length).padStart(2,'0')}</span>
        <button type="button" data-operation-next>다음 단계</button>
      </div>
    </div>
    <aside class="pc-v6-operation-readout">
      <span data-operation-time>${esc(operation.steps[0].time)}</span>
      <h3 data-operation-title>${esc(operation.steps[0].title)}</h3>
      <p data-operation-copy-text>${esc(operation.steps[0].copy)}</p>
      <small data-operation-basis>${esc(operation.steps[0].basis)}</small>
    </aside>
  </div>
  <footer>
    <div><span>SOURCE BASIS</span><p>${esc(operation.basis)}</p><small>${esc(operation.confidence)}</small></div>
    <div><span>${esc(operation.lossLabel)}</span><p>${esc(operation.loss)}</p><small>${esc(operation.warning)}</small></div>
    <div><span>${esc(operation.factionLabel)}</span>${factionMarks(operation.factions)}</div>
  </footer>
  ${operation.id==='immortality'?'<a class="pc-v6-operation-source" href="#/archive/Immortality_860201">보호 기록 게이트웨이에서 원문 대조</a>':''}
</article>`;

export function render(){
  const initialSignal=MAP_SIGNALS[0];
  const initialOperation=MAP_OPERATIONS[0];
  return `<section class="pc-v6-map" aria-labelledby="v6MapTitle">
    <header class="pc-v6-pagehead"><div><span>MAP 02 / EVIDENCE CARTOGRAPHY</span><small>DISPLAY PLOT · NAVIGATION PROHIBITED</small></div><p>관측과 무지의 경계를 함께 표시</p></header>
    <div class="pc-v6-map-intro">
      <div><span class="pc-v6-eyebrow">WORLD CONTROL ROOM</span><h1 id="v6MapTitle">길이 아니라,<br>우리가 잃은 범위를 그린다.</h1><p>${esc(MAP_DISCLOSURE.statement)}</p></div>
      <aside><span>PLOT COORDINATES ONLY</span><b>DISTANCE · BEARING · ETA INVALID</b><p>검열·증언·적대 문서는 확인된 관측과 다른 표식으로 남긴다.</p></aside>
    </div>

    <div class="pc-v6-map-toolbar">
      <div class="pc-v6-map-modes" role="group" aria-label="지도 모드">
        <button type="button" data-map-mode="atlas" aria-pressed="true"><span>01</span><b>세계 상황도</b><small>WORLD ATLAS</small></button>
        <button type="button" data-map-mode="operation" aria-pressed="false"><span>02</span><b>사건·작전</b><small>EVIDENCE COPY</small></button>
      </div>
      <div class="pc-v6-map-layers" aria-label="세계 상황도 레이어">
        <span>VISIBLE LAYERS</span>
        <div>
          <button type="button" data-map-layer="theatres" aria-pressed="true">전구</button>
          <button type="button" data-map-layer="incidents" aria-pressed="true">사건</button>
          <button type="button" data-map-layer="synchrony" aria-pressed="true">2042 동시성</button>
          <button type="button" data-map-layer="claims" aria-pressed="true">증언·주장</button>
          <button type="button" data-map-layer="routes" aria-pressed="false">관계선</button>
          <button type="button" data-map-layer="factions" aria-pressed="true">세력 표식</button>
        </div>
      </div>
    </div>

    <div data-map-atlas>
      <div class="pc-v6-map-layout">
        <div class="pc-v6-map-plate-scroll" tabindex="0" role="region" aria-label="비항법 세계 상황도, 작은 화면에서는 가로로 스크롤할 수 있습니다.">
        <div class="pc-v6-map-plate">
          <div class="pc-v6-map-plate__grid" aria-hidden="true"></div>
          <div class="pc-v6-map-plate__identity"><span>EVIDENCE PLATE / WORLD-01</span><b>비항법 도면</b></div>
          ${MAP_REGIONS.map(item=>`<div class="pc-v6-map-region is-${esc(item.shape)}" data-layer="theatres" style="left:${item.position.plot.x}%;top:${item.position.plot.y}%;width:${item.w}%;height:${item.h}%" aria-hidden="true"><span>${esc(item.code)}</span></div>`).join('')}
          ${MAP_CONNECTIONS.map(connectionLine).join('')}
          <div class="pc-v6-map-sync-bracket is-dz" data-layer="synchrony" aria-hidden="true"><span>61H 01M</span></div>
          <div class="pc-v6-map-sync-bracket is-gbf" data-layer="synchrony" aria-hidden="true"><span>SAME WINDOW</span></div>
          ${MAP_SIGNALS.map(signalMarker).join('')}
          <div class="pc-v6-map-plate__scale" aria-hidden="true"><span>00</span><i></i><span>DISPLAY 100</span></div>
          <p class="pc-v6-map-plate__notice">TEMPORAL CORRELATION ONLY / NO ROUTE</p>
        </div></div>
        <aside class="pc-v6-map-intel" data-map-info>${signalInfo(initialSignal)}</aside>
      </div>
      <section class="pc-v6-map-route-ledger" data-layer="routes" aria-labelledby="v6MapRouteLedgerTitle" hidden>
        <header><span>RELATION LAYER / NOT A ROUTE</span><h2 id="v6MapRouteLedgerTitle">선은 이동로가 아니라 기록의 대조 관계다.</h2></header>
        <ol>${MAP_CONNECTIONS.map(item=>`<li><span>${esc(item.kind)}</span><b>${esc(item.label)}</b><p>${esc(item.basis)}</p><small>${esc(item.warning)}</small></li>`).join('')}</ol>
      </section>
      <details class="pc-v6-map-contacts">
        <summary><span>CONTACT INDEX</span><b>15개 관측점 목록 열기</b><small>삼야 무응답 10개 독립 관측 포함</small></summary>
        <div>${MAP_SIGNALS.map(item=>`<button type="button" data-map-signal="${esc(item.id)}"><span>${esc(item.code)}</span><b>${esc(item.name)}</b><small>${esc(item.status)}</small></button>`).join('')}</div>
      </details>
      <section class="pc-v6-map-theatres" aria-labelledby="v6MapTheatreTitle">
        <header><div><span>THEATRE INDEX</span><h2 id="v6MapTheatreTitle">붕괴 전구</h2></div><small>지도 마커 없이도 모든 지역을 선택할 수 있습니다.</small></header>
        <div>${MAP_REGIONS.map(regionCard).join('')}</div>
      </section>
      <section class="pc-v6-map-legend" aria-label="증거 등급 범례">
        <div><i class="is-observed"></i><b>OBSERVED</b><span>중심 표식: 현장 기록</span></div>
        <div><i class="is-corroborated"></i><b>CORROBORATED</b><span>중심 이중환: 복수 대조</span></div>
        <div><i class="is-claimed"></i><b>CLAIMED</b><span>중심 점선: 문서·증언 주장</span></div>
        <div><i class="is-location"></i><b>LOCATION STATE</b><span>외곽틀: 추정·상충·검열</span></div>
        <p>${MAP_DISCLOSURE.warnings.map(esc).join(' · ')}</p>
      </section>
    </div>

    <div data-map-operations hidden>
      <section class="pc-v6-operation-selector" aria-labelledby="v6OperationTitle">
        <header><div><span>EVIDENCE COPY INDEX</span><h2 id="v6OperationTitle">회수된 사건·작전 사본</h2></div><small>결과를 바꾸는 시나리오가 아니라 기록 순서 대조입니다.</small></header>
        <div>${MAP_OPERATIONS.map((item,index)=>`<button type="button" data-map-operation="${esc(item.id)}" ${index===0?'aria-current="true"':''}><span>${esc(item.code)}</span><b>${esc(item.title)}</b><small>${esc(item.state)}</small></button>`).join('')}</div>
      </section>
      <div data-operation-panel>${operationPanel(initialOperation)}</div>
    </div>
    <div class="pc-v6-sr-only" data-map-status aria-live="polite" aria-atomic="true"></div>
  </section>`;
}

export function mount(root,{detail='' }={}){
  const atlas=root.querySelector('[data-map-atlas]');
  const operations=root.querySelector('[data-map-operations]');
  const info=root.querySelector('[data-map-info]');
  const operationPanelRoot=root.querySelector('[data-operation-panel]');
  const status=root.querySelector('[data-map-status]');
  let mode='atlas';
  let currentOperation=MAP_OPERATIONS[0];
  const layerState=Object.fromEntries([...root.querySelectorAll('[data-map-layer]')].map(button=>[button.dataset.mapLayer,button.getAttribute('aria-pressed')==='true']));

  const setHash=value=>history.replaceState(null,'',`#/map/${value}`);
  const announce=message=>{if(status) status.textContent=message;};
  const applyLayer=layer=>root.querySelectorAll(`[data-layer="${layer}"]`).forEach(element=>element.hidden=!layerState[layer]);

  const setMode=next=>{
    mode=next==='operation'?'operation':'atlas';
    atlas.hidden=mode!=='atlas';
    operations.hidden=mode!=='operation';
    root.querySelectorAll('[data-map-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mapMode===mode)));
    root.querySelector('.pc-v6-map-layers')?.toggleAttribute('hidden',mode!=='atlas');
    announce(mode==='atlas'?'세계 상황도를 열었습니다.':'사건·작전 증거 사본을 열었습니다.');
  };

  const setSignal=item=>{
    if(!item) return;
    root.querySelectorAll('[data-map-signal]').forEach(button=>{
      const selected=button.dataset.mapSignal===item.id;
      button.classList.toggle('is-selected',selected);
      button.setAttribute('aria-pressed',String(selected));
    });
    root.querySelectorAll('[data-map-region]').forEach(button=>button.removeAttribute('aria-current'));
    info.innerHTML=signalInfo(item);
    applyLayer('factions');
    info.querySelector('[data-open-operation]')?.addEventListener('click',event=>selectOperation(operationById.get(event.currentTarget.dataset.openOperation),true));
    setHash(`signal:${item.id}`);
    announce(`${item.name}. ${item.status}. ${item.basis}.`);
  };

  const setRegion=item=>{
    if(!item) return;
    root.querySelectorAll('[data-map-signal]').forEach(button=>{button.classList.remove('is-selected');button.setAttribute('aria-pressed','false');});
    root.querySelectorAll('[data-map-region]').forEach(button=>{
      if(button.dataset.mapRegion===item.id) button.setAttribute('aria-current','true'); else button.removeAttribute('aria-current');
    });
    info.innerHTML=regionInfo(item);
    setHash(`theatre:${item.id}`);
    announce(`${item.name}. ${item.status}. ${item.basis}.`);
  };

  const bindOperationSteps=operation=>{
    const panel=operationPanelRoot.querySelector('[data-operation-copy]');
    if(!panel) return;
    let stepIndex=0;
    const applyStep=index=>{
      stepIndex=Math.max(0,Math.min(operation.steps.length-1,index));
      const step=operation.steps[stepIndex];
      panel.querySelectorAll('[data-operation-step]').forEach(button=>{
        if(Number(button.dataset.operationStep)===stepIndex) button.setAttribute('aria-current','step'); else button.removeAttribute('aria-current');
      });
      panel.querySelector('[data-operation-time]').textContent=step.time;
      panel.querySelector('[data-operation-title]').textContent=step.title;
      panel.querySelector('[data-operation-copy-text]').textContent=step.copy;
      panel.querySelector('[data-operation-basis]').textContent=step.basis;
      panel.querySelector('[data-operation-position]').textContent=String(stepIndex+1).padStart(2,'0');
      panel.querySelector('[data-operation-prev]').disabled=stepIndex===0;
      panel.querySelector('[data-operation-next]').disabled=stepIndex===operation.steps.length-1;
      announce(`${operation.title} ${step.time}, ${step.title}. ${step.copy}`);
    };
    panel.querySelectorAll('[data-operation-step]').forEach(button=>button.addEventListener('click',()=>applyStep(Number(button.dataset.operationStep))));
    panel.querySelector('[data-operation-prev]')?.addEventListener('click',()=>applyStep(stepIndex-1));
    panel.querySelector('[data-operation-next]')?.addEventListener('click',()=>applyStep(stepIndex+1));
  };

  const selectOperation=(item,focus=false)=>{
    if(!item) return;
    currentOperation=item;
    setMode('operation');
    root.querySelectorAll('[data-map-operation]').forEach(button=>{
      if(button.dataset.mapOperation===item.id) button.setAttribute('aria-current','true'); else button.removeAttribute('aria-current');
    });
    operationPanelRoot.innerHTML=operationPanel(item);
    applyLayer('factions');
    bindOperationSteps(item);
    setHash(`operation:${item.id}`);
    if(focus) operationPanelRoot.querySelector('h2')?.focus({preventScroll:false});
    announce(`${item.title} ${item.presentation}을 열었습니다. ${item.state}.`);
  };

  root.querySelectorAll('[data-map-mode]').forEach(button=>button.addEventListener('click',()=>{
    if(button.dataset.mapMode==='operation') selectOperation(currentOperation); else {setMode('atlas');setHash('atlas:world');}
  }));
  root.querySelectorAll('[data-map-layer]').forEach(button=>button.addEventListener('click',()=>{
    const layer=button.dataset.mapLayer;
    const next=!layerState[layer];
    layerState[layer]=next;
    button.setAttribute('aria-pressed',String(next));
    applyLayer(layer);
    announce(`${button.textContent.trim()} 레이어를 ${next?'표시':'숨김'} 처리했습니다.`);
  }));
  root.querySelectorAll('[data-map-signal]').forEach(button=>button.addEventListener('click',()=>setSignal(signalById.get(button.dataset.mapSignal))));
  root.querySelectorAll('[data-map-region]').forEach(button=>button.addEventListener('click',()=>setRegion(regionById.get(button.dataset.mapRegion))));
  root.querySelectorAll('[data-map-operation]').forEach(button=>button.addEventListener('click',()=>selectOperation(operationById.get(button.dataset.mapOperation),true)));

  Object.keys(layerState).forEach(applyLayer);

  const [kind,id]=String(detail||'').split(':');
  if(kind==='operation'&&operationById.has(id)) selectOperation(operationById.get(id));
  else if(kind==='theatre'&&regionById.has(id)){setMode('atlas');setRegion(regionById.get(id));}
  else if(kind==='signal'&&signalById.has(id)){setMode('atlas');setSignal(signalById.get(id));}
  else if(kind==='atlas'){setMode('atlas');}
  else {setMode('atlas');setSignal(MAP_SIGNALS[0]);}

  root.addEventListener('keydown',event=>{
    if(event.key!=='Escape'||mode!=='atlas') return;
    root.querySelectorAll('[data-map-signal]').forEach(button=>{button.classList.remove('is-selected');button.setAttribute('aria-pressed','false');});
    root.querySelectorAll('[data-map-region]').forEach(button=>button.removeAttribute('aria-current'));
    info.innerHTML='<span class="pc-v6-eyebrow">SELECTION CLEARED</span><h2 tabindex="-1" data-map-info-title>관측점을 선택하십시오.</h2><p>지도 마커 또는 아래 전구 목록을 사용해 증거 계층을 대조할 수 있습니다.</p>';
    setHash('atlas:world');
    announce('지도 선택을 해제했습니다.');
  });
}
