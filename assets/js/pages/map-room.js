// Project Curse — interactive regional control map and operation trace room.
(function(root){
  'use strict';

  const ready=callback=>document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',callback,{once:true})
    : callback();

  const escapeHTML=value=>String(value??'')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');

  const confidenceLabels={
    confirmed:'확인 자료',
    observed:'관측 자료',
    estimated:'추정 좌표',
    disputed:'상충 진술',
    testimony:'순례자 증언',
    historical:'과거 기록'
  };

  ready(function(){
    const mount=document.getElementById('uacMapRoom');
    const data=root.ProjectCurseMapRoom;
    if(!mount||!data) return;

    const state={
      mode:'region',
      region:'world',
      marker:null,
      operation:data.operations[0]?.id||'',
      step:0
    };

    const regionById=id=>data.regions.find(region=>region.id===id)||data.regions[0];
    const markerById=id=>data.markers.find(marker=>marker.id===id)||null;
    const operationById=id=>data.operations.find(operation=>operation.id===id)||data.operations[0];
    const polyline=points=>(points||[]).map(point=>point.join(',')).join(' ');

    function renderGeography(region){
      const visibleZones=data.zones.filter(zone=>region.id==='world'||zone.region===region.id);
      return `
        <defs>
          <pattern id="pc-map-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" class="pc-map-grid-line"></path>
          </pattern>
          <filter id="pc-map-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur"></feGaussianBlur>
            <feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge>
          </filter>
        </defs>
        <rect class="pc-map-grid" x="0" y="0" width="1200" height="620"></rect>
        <g class="pc-map-land">${data.geography.map(piece=>`<path data-land="${escapeHTML(piece.id)}" d="${escapeHTML(piece.d)}"></path>`).join('')}</g>
        <g class="pc-map-zones">${visibleZones.map(zone=>`<path class="pc-map-zone pc-map-zone--${escapeHTML(zone.className)}" d="${escapeHTML(zone.d)}"></path>`).join('')}</g>`;
    }

    function markerSymbol(marker){
      const selected=state.marker===marker.id?' is-selected':'';
      const title=escapeHTML(marker.title);
      const meta=escapeHTML(marker.meta);
      const labelX=Number.isFinite(marker.labelX)?marker.labelX:13;
      const labelAnchor=marker.labelAnchor==='end'?'end':'start';
      return `
        <g class="pc-map-marker pc-map-marker--${escapeHTML(marker.type)}${selected}" data-map-marker="${escapeHTML(marker.id)}" role="button" tabindex="0" aria-label="${title}: ${meta}" transform="translate(${marker.x} ${marker.y})">
          <g class="pc-map-marker-symbol">
            <circle class="pc-map-marker-ring" r="17"></circle>
            <path class="pc-map-marker-core" d="M 0 -7 L 7 0 0 7 -7 0 Z"></path>
            <text class="pc-map-marker-label" x="${labelX}" y="-11" text-anchor="${labelAnchor}">${title}</text>
            <text class="pc-map-marker-meta" x="${labelX}" y="5" text-anchor="${labelAnchor}">${meta}</text>
          </g>
        </g>`;
    }

    function renderRegionIntel(region,marker){
      if(!marker){
        return `
          <div class="pc-map-intel-kicker">SELECTED REGION</div>
          <h3>${escapeHTML(region.label)}</h3>
          <p>${escapeHTML(region.description)}</p>
          <dl class="pc-map-facts">
            <div><dt>관제 상태</dt><dd>${escapeHTML(region.status)}</dd></div>
            <div><dt>자료 상태</dt><dd>${escapeHTML(region.confidence)}</dd></div>
          </dl>
          <div class="pc-map-warning">표시 좌표는 항법용이 아니다. 신뢰도와 상충 기록을 함께 판독할 것.</div>`;
      }

      const records=(marker.records||[]).map(record=>`<li>${escapeHTML(record)}</li>`).join('');
      const operation=marker.operation?operationById(marker.operation):null;
      return `
        <div class="pc-map-intel-kicker">SELECTED SIGNAL / ${escapeHTML(confidenceLabels[marker.confidence]||marker.confidence)}</div>
        <h3>${escapeHTML(marker.title)}</h3>
        <p>${escapeHTML(marker.meta)}</p>
        <dl class="pc-map-facts">
          <div><dt>상태</dt><dd>${escapeHTML(marker.status)}</dd></div>
          <div><dt>판정</dt><dd>${escapeHTML(confidenceLabels[marker.confidence]||marker.confidence)}</dd></div>
        </dl>
        ${records?`<div class="pc-map-records"><b>연결 기록</b><ul>${records}</ul></div>`:''}
        <div class="pc-map-intel-actions">
          ${marker.overview?`<button type="button" data-map-enter-region="${escapeHTML(marker.region)}">권역 상세 진입</button>`:''}
          ${operation?`<button type="button" data-map-open-operation="${escapeHTML(operation.id)}">${escapeHTML(operation.label)} 작전 열기</button>`:''}
        </div>`;
    }

    function renderRegion(){
      const region=regionById(state.region);
      const markers=data.markers.filter(marker=>region.id==='world'?marker.overview:marker.region===region.id&&!marker.overview);
      const selectedMarker=markerById(state.marker);

      return `
        <div class="pc-map-region-tabs" role="tablist" aria-label="관제 권역">
          ${data.regions.map(item=>`<button type="button" role="tab" aria-selected="${item.id===region.id}" class="${item.id===region.id?'is-active':''}" data-map-region="${escapeHTML(item.id)}"><small>${escapeHTML(item.code)}</small>${escapeHTML(item.label)}</button>`).join('')}
        </div>
        <div class="pc-map-layout">
          <aside class="pc-map-sidebar pc-map-layers">
            <div class="pc-map-panel-title">LAYER CONTROL</div>
            <div class="pc-map-layer-row"><i class="is-confirmed"></i><span>확인된 시설·사건</span><b>ON</b></div>
            <div class="pc-map-layer-row"><i class="is-estimated"></i><span>추정·증언 좌표</span><b>ON</b></div>
            <div class="pc-map-layer-row"><i class="is-hostile"></i><span>오염·무응답 권역</span><b>ON</b></div>
            <div class="pc-map-meter"><span>MAP INTEGRITY</span><b>${escapeHTML(region.confidence)}</b><i><em style="--pc-map-meter:${region.id==='northamerica'?'22%':region.id==='southamerica'?'31%':region.id==='world'?'63%':'78%'}"></em></i></div>
            <div class="pc-map-legend">
              <b>기호 판독</b>
              <span><i class="facility"></i>기관·시설</span>
              <span><i class="incident"></i>사건·충돌</span>
              <span><i class="anomaly"></i>이상현상</span>
              <span><i class="unknown"></i>무응답·상충</span>
            </div>
          </aside>
          <section class="pc-map-stage pc-map-stage--${escapeHTML(region.id)}" aria-label="${escapeHTML(region.label)} 관제 지도">
            <div class="pc-map-stage-head"><span>${escapeHTML(region.code)}</span><b>${escapeHTML(region.status)}</b></div>
            <svg class="pc-map-svg" viewBox="${escapeHTML(region.viewBox)}" role="img" aria-labelledby="pcMapTitle pcMapDesc" preserveAspectRatio="xMidYMid meet">
              <title id="pcMapTitle">${escapeHTML(region.label)} 관제 지도</title>
              <desc id="pcMapDesc">권역별 사건과 이상현상 위치를 단순화해 표시한 정보 지도</desc>
              ${renderGeography(region)}
              <g class="pc-map-markers">${markers.map(markerSymbol).join('')}</g>
            </svg>
            <div class="pc-map-scan" aria-hidden="true"></div>
            <div class="pc-map-coordinates">LAT/LON RECONSTRUCTED · NAVIGATION PROHIBITED</div>
          </section>
          <aside class="pc-map-sidebar pc-map-intel">${renderRegionIntel(region,selectedMarker)}</aside>
        </div>`;
    }

    function operationTerrain(operation){
      if(operation.id==='op-unlit-fortress'){
        return `
          <path class="pc-op-terrain pc-op-terrain--forest" d="M0 90 C130 40 230 112 352 67 S590 81 714 45 905 73 1000 22 L1000 540 0 540 Z"></path>
          <path class="pc-op-river" d="M526 0 C485 114 615 171 552 257 S530 412 620 540"></path>
          <path class="pc-op-blood" d="M664 215 C704 178 776 183 806 223 C770 263 702 274 662 246 Z"></path>`;
      }
      return `
        <path class="pc-op-terrain pc-op-terrain--coast" d="M0 73 C168 128 294 36 435 112 S712 58 1000 128 L1000 540 0 540 Z"></path>
        <path class="pc-op-river" d="M371 0 C434 114 442 208 533 260 S712 287 1000 334"></path>
        <path class="pc-op-blood" d="M682 142 C744 105 830 125 849 181 C808 229 719 238 666 196 Z"></path>`;
    }

    function siteSymbol(site,index){
      return `
        <g class="pc-op-site pc-op-site--${escapeHTML(site.kind)}" transform="translate(${site.x} ${site.y})">
          <circle r="9"></circle><path d="M -14 0 H 14 M 0 -14 V 14"></path>
          <text x="16" y="-11">0${index+1} · ${escapeHTML(site.label)}</text>
        </g>`;
    }

    function unitSymbol(unit){
      return `
        <g class="pc-op-unit pc-op-unit--${escapeHTML(unit.status)}" transform="translate(${unit.x} ${unit.y})">
          <circle r="11"></circle><circle r="3"></circle><text x="15" y="4">${escapeHTML(unit.id)}</text>
        </g>`;
    }

    function renderOperation(){
      const operation=operationById(state.operation);
      state.step=Math.max(0,Math.min(state.step,operation.steps.length-1));
      const step=operation.steps[state.step];
      const targetRegion=operation.id==='op-unlit-fortress'?'southamerica':'europe';

      return `
        <div class="pc-map-operation-tabs" role="tablist" aria-label="작전 기록">
          ${data.operations.map(item=>`<button type="button" role="tab" aria-selected="${item.id===operation.id}" class="${item.id===operation.id?'is-active':''}" data-map-operation="${escapeHTML(item.id)}"><small>${escapeHTML(item.code)}</small>${escapeHTML(item.label)}</button>`).join('')}
        </div>
        <div class="pc-map-operation-grid">
          <section class="pc-map-stage pc-map-operation-stage" aria-label="${escapeHTML(operation.label)} 작전 경로">
            <div class="pc-map-stage-head"><span>${escapeHTML(operation.code)}</span><b>TRACE ${state.step+1}/${operation.steps.length}</b></div>
            <svg class="pc-map-svg" viewBox="0 0 1000 540" role="img" aria-labelledby="pcOpTitle pcOpDesc" preserveAspectRatio="xMidYMid meet">
              <title id="pcOpTitle">${escapeHTML(operation.label)} 작전 경로</title>
              <desc id="pcOpDesc">시간 단계에 따라 복구된 이동 경로와 인원 신호를 표시한 작전 지도</desc>
              <defs>
                <pattern id="pc-op-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" class="pc-map-grid-line"></path></pattern>
                <filter id="pc-op-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" result="blur"></feGaussianBlur><feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter>
              </defs>
              <rect class="pc-map-grid" width="1000" height="540"></rect>
              ${operationTerrain(operation)}
              <g>${operation.sites.map(siteSymbol).join('')}</g>
              ${step.alternate?`<polyline class="pc-op-route pc-op-route--alternate" points="${polyline(step.alternate)}"></polyline>`:''}
              <polyline class="pc-op-route" points="${polyline(step.route)}"></polyline>
              <g>${step.route.map((point,index)=>`<circle class="pc-op-waypoint${index===step.route.length-1?' is-current':''}" cx="${point[0]}" cy="${point[1]}" r="${index===step.route.length-1?7:4}"></circle>`).join('')}</g>
              <g>${step.units.map(unitSymbol).join('')}</g>
            </svg>
            <div class="pc-map-scan" aria-hidden="true"></div>
            <div class="pc-map-coordinates">ROUTE RECONSTRUCTION · ${escapeHTML(step.time)} · SIGNAL NOT VERIFIED</div>
          </section>
          <aside class="pc-map-sidebar pc-map-operation-intel">
            <div class="pc-map-intel-kicker">${escapeHTML(operation.region)} / ${escapeHTML(operation.code)}</div>
            <h3><time>${escapeHTML(step.time)}</time>${escapeHTML(step.title)}</h3>
            <p>${escapeHTML(step.note)}</p>
            <div class="pc-op-status"><span>경로 복구</span><b>${Math.round(((state.step+1)/operation.steps.length)*100)}%</b></div>
            <div class="pc-map-warning">${escapeHTML(operation.summary)}</div>
            <button class="pc-map-region-return" type="button" data-map-return-region="${targetRegion}">해당 권역에서 보기</button>
          </aside>
        </div>
        <div class="pc-map-timeline" aria-label="작전 시간 단계">
          ${operation.steps.map((item,index)=>`<button type="button" class="${index===state.step?'is-active':''}" aria-current="${index===state.step?'step':'false'}" data-map-step="${index}"><small>${escapeHTML(item.time)}</small><span>${escapeHTML(item.title)}</span></button>`).join('')}
        </div>`;
    }

    function render(){
      mount.innerHTML=`
        <div class="pc-map-room">
          <header class="pc-map-room-head">
            <div><span>U.A.C CARTOGRAPHIC INTELLIGENCE</span><h2>권역 관제도</h2><p>확인 좌표, 현장 진술, 손상된 작전 신호를 겹쳐 표시한다.</p></div>
            <div class="pc-map-live"><i></i><span>PARTIAL UPLINK</span><b>${escapeHTML(data.version)}</b></div>
          </header>
          <div class="pc-map-mode-switch" role="tablist" aria-label="지도 모드">
            <button type="button" role="tab" aria-selected="${state.mode==='region'}" class="${state.mode==='region'?'is-active':''}" data-map-mode="region"><small>01</small>지역 상황도</button>
            <button type="button" role="tab" aria-selected="${state.mode==='operation'}" class="${state.mode==='operation'?'is-active':''}" data-map-mode="operation"><small>02</small>작전지도</button>
          </div>
          <div class="pc-map-view">${state.mode==='region'?renderRegion():renderOperation()}</div>
        </div>`;
    }

    mount.addEventListener('click',event=>{
      const control=event.target.closest('button,[data-map-marker]');
      if(!control) return;
      if(control.dataset.mapMode){state.mode=control.dataset.mapMode;render();return;}
      if(control.dataset.mapRegion){state.region=control.dataset.mapRegion;state.marker=null;render();return;}
      if(control.dataset.mapMarker){
        const marker=markerById(control.dataset.mapMarker);
        state.marker=state.marker===control.dataset.mapMarker?null:control.dataset.mapMarker;
        if(marker?.overview&&state.marker===marker.id) state.region='world';
        render();return;
      }
      if(control.dataset.mapEnterRegion){state.region=control.dataset.mapEnterRegion;state.marker=null;render();return;}
      if(control.dataset.mapOpenOperation){state.mode='operation';state.operation=control.dataset.mapOpenOperation;state.step=0;render();return;}
      if(control.dataset.mapOperation){state.operation=control.dataset.mapOperation;state.step=0;render();return;}
      if(control.dataset.mapStep!==undefined){state.step=Number(control.dataset.mapStep)||0;render();return;}
      if(control.dataset.mapReturnRegion){state.mode='region';state.region=control.dataset.mapReturnRegion;state.marker=null;render();}
    });

    mount.addEventListener('keydown',event=>{
      const marker=event.target.closest('[data-map-marker]');
      if(!marker||(event.key!=='Enter'&&event.key!==' ')) return;
      event.preventDefault();
      marker.click();
    });

    render();
    root.ProjectCurseMapRoomRuntime=Object.freeze({
      showRegion(id){if(regionById(id).id!==id) return false;state.mode='region';state.region=id;state.marker=null;render();return true;},
      showOperation(id){if(!data.operations.some(operation=>operation.id===id)) return false;state.mode='operation';state.operation=id;state.step=0;render();return true;},
      getState:()=>({...state})
    });
  });
})(window);
