// Project Curse 5.22.0 — geographic, regional drilldown, and operation trace room.
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
    const network=root.ProjectCurseIncidentNetwork;
    const operationStore=root.ProjectCurseOperationState;
    if(!mount||!data) return;

    const state={
      mode:'region',
      region:'world',
      marker:null,
      detail:data.drilldowns?.[0]?.id||'',
      detailSite:null,
      operation:data.operations[0]?.id||'',
      step:operationStore?.get?.().mapStep||0,
      layers:{confirmed:true,estimated:true,zones:true,routes:true}
    };

    const regionById=id=>data.regions.find(region=>region.id===id)||data.regions[0];
    const markerById=id=>data.markers.find(marker=>marker.id===id)||null;
    const detailById=id=>(data.drilldowns||[]).find(detail=>detail.id===id)||(data.drilldowns||[])[0]||null;
    const operationById=id=>data.operations.find(operation=>operation.id===id)||data.operations[0];
    const incidentById=id=>network?.getIncident?.(id)||null;
    const polyline=points=>(points||[]).map(point=>point.join(',')).join(' ');
    const detailForMarker=marker=>{
      const map={
        'gbf-core':'gbf-inner-refuges','monsur-church':'gbf-western-marches','unlit-fortress':'gbf-western-marches','black-river':'gbf-western-marches','southern-coast':'gbf-coastal-belt',
        'dead-interior':'deadzone-silent-interior','returned-coast':'deadzone-return-corridor','former-us-branch':'deadzone-kingdom-graves'
      };
      return detailById(map[marker?.id]||(marker?.region==='southamerica'?'gbf-western-marches':marker?.region==='northamerica'?'deadzone-return-corridor':''));
    };

    function renderGraticule(region){
      const meridians=[-120,-60,0,60,120].map(lon=>{
        const x=((lon+180)/360)*1200;
        return `<path d="M${x} 0V620"></path><text x="${x+6}" y="606">${Math.abs(lon)}°${lon<0?'W':lon>0?'E':''}</text>`;
      }).join('');
      const parallels=[-60,-30,0,30,60].map(lat=>{
        const y=((90-lat)/180)*620;
        return `<path d="M0 ${y}H1200"></path><text x="8" y="${y-6}">${Math.abs(lat)}°${lat<0?'S':lat>0?'N':''}</text>`;
      }).join('');
      return `<g class="pc-map-graticule${region.id==='world'?' is-world':''}">${meridians}${parallels}</g>`;
    }

    function renderGeography(region){
      const visibleZones=data.zones.filter(zone=>region.id==='world'||zone.region===region.id);
      const visibleRoutes=(data.routes||[]).filter(route=>region.id==='world'||route.region===region.id);
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
        ${renderGraticule(region)}
        <g class="pc-map-land">${data.geography.map(piece=>`<path data-land="${escapeHTML(piece.id)}" d="${escapeHTML(piece.d)}"></path>`).join('')}</g>
        ${state.layers.zones?`<g class="pc-map-zones">${visibleZones.map(zone=>`<path class="pc-map-zone pc-map-zone--${escapeHTML(zone.className)}" d="${escapeHTML(zone.d)}"></path>`).join('')}</g>`:''}
        ${state.layers.routes?`<g class="pc-map-routes">${visibleRoutes.map(route=>{
          const end=route.points[route.points.length-1]||[0,0];
          return `<polyline class="pc-map-route pc-map-route--${escapeHTML(route.className)}" points="${polyline(route.points)}"></polyline><text class="pc-map-route-label" x="${end[0]+8}" y="${end[1]-8}">${escapeHTML(route.label)}</text>`;
        }).join('')}</g>`:''}`;
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
            <circle class="pc-map-marker-hit" r="28"></circle>
            <path class="pc-map-marker-hit-line" d="M0 0 H ${labelAnchor==='end'?-180:180}"></path>
            <circle class="pc-map-marker-ring" r="17"></circle>
            <path class="pc-map-marker-core" d="M 0 -7 L 7 0 0 7 -7 0 Z"></path>
            <text class="pc-map-marker-label" x="${labelX}" y="-11" text-anchor="${labelAnchor}">${title}</text>
            <text class="pc-map-marker-meta" x="${labelX}" y="5" text-anchor="${labelAnchor}">${meta}</text>
          </g>
        </g>`;
    }

    function renderRegionIntel(region,marker){
      const regionalDetails=(data.drilldowns||[]).filter(detail=>detail.region===region.id);
      if(!marker){
        return `
          <div class="pc-map-intel-kicker">SELECTED REGION</div>
          <h3>${escapeHTML(region.label)}</h3>
          <p>${escapeHTML(region.description)}</p>
          <dl class="pc-map-facts">
            <div><dt>관제 상태</dt><dd>${escapeHTML(region.status)}</dd></div>
            <div><dt>자료 상태</dt><dd>${escapeHTML(region.confidence)}</dd></div>
          </dl>
          <div class="pc-map-warning">표시 좌표는 항법용이 아니다. 신뢰도와 상충 기록을 함께 판독할 것.</div>
          ${regionalDetails.length?`<div class="pc-map-crosslinks pc-map-detail-entry"><b>세부 권역</b>${regionalDetails.map(detail=>`<button type="button" data-map-open-detail="${escapeHTML(detail.id)}">${escapeHTML(detail.label)}<i>${escapeHTML(detail.confidence)} →</i></button>`).join('')}</div>`:''}`;
      }

      const incident=incidentById(marker.incident);
      const records=[...new Set([...(marker.records||[]),...(incident?.records||[])])]
        .map(record=>`<button type="button" data-map-open-record="${escapeHTML(record)}">${escapeHTML(record)}<i>ARCHIVE →</i></button>`).join('');
      const factions=(incident?.factions||[])
        .filter(key=>root.ProjectCurseCanon?.factions?.[key])
        .map(key=>`<button type="button" data-map-open-faction="${escapeHTML(key)}">${escapeHTML(root.ProjectCurseCanon.factions[key].name)}<i>INTEL →</i></button>`).join('');
      const operation=marker.operation?operationById(marker.operation):null;
      const nearestDetail=detailForMarker(marker);
      return `
        <div class="pc-map-intel-kicker">SELECTED SIGNAL / ${escapeHTML(confidenceLabels[marker.confidence]||marker.confidence)}</div>
        <h3>${escapeHTML(marker.title)}</h3>
        <p>${escapeHTML(marker.meta)}</p>
        <dl class="pc-map-facts">
          <div><dt>상태</dt><dd>${escapeHTML(marker.status)}</dd></div>
          <div><dt>판정</dt><dd>${escapeHTML(confidenceLabels[marker.confidence]||marker.confidence)}</dd></div>
          ${incident?`<div><dt>사건 코드</dt><dd>${escapeHTML(incident.code)}</dd></div>`:''}
        </dl>
        ${incident?`<div class="pc-map-incident-summary"><b>${escapeHTML(incident.date)}</b><p>${escapeHTML(incident.summary)}</p></div>`:''}
        ${records?`<div class="pc-map-crosslinks"><b>연결 기록</b>${records}</div>`:''}
        ${factions?`<div class="pc-map-crosslinks"><b>관여 세력</b>${factions}</div>`:''}
        <div class="pc-map-intel-actions">
          ${marker.overview?`<button type="button" data-map-enter-region="${escapeHTML(marker.region)}">권역 상세 진입</button>`:''}
          ${nearestDetail&&!marker.overview?`<button type="button" data-map-open-detail="${escapeHTML(nearestDetail.id)}">${escapeHTML(nearestDetail.label)} 세부 지도 열기</button>`:''}
          ${incident?.history?`<button type="button" data-map-open-history="${escapeHTML(incident.history)}">세계 기록에서 사건 열기</button>`:''}
          ${operation?`<button type="button" data-map-open-operation="${escapeHTML(operation.id)}">${escapeHTML(operation.label)} 작전 열기</button>`:''}
        </div>`;
    }

    function detailTerrain(detail){
      if(detail.terrain==='coast') return `
        <path class="pc-detail-terrain pc-detail-terrain--forest" d="M0 40 C165 102 253 38 393 92 S664 72 1000 128 L1000 540 0 540 Z"></path>
        <path class="pc-detail-terrain pc-detail-terrain--water" d="M0 454 C146 404 244 470 365 419 S590 392 712 326 863 292 1000 226 L1000 540 0 540 Z"></path>
        <path class="pc-detail-river" d="M312 0 C354 106 326 190 419 272 S507 410 548 540"></path>`;
      if(detail.terrain==='forest'||detail.terrain==='deep-forest') return `
        <path class="pc-detail-terrain pc-detail-terrain--forest" d="M0 65 C113 22 218 96 345 52 S586 90 704 39 884 81 1000 24 L1000 540 0 540 Z"></path>
        ${detail.terrain==='deep-forest'?'<path class="pc-detail-canopy" d="M0 178 C131 98 250 183 372 115 S612 154 745 91 905 125 1000 82"></path><path class="pc-detail-canopy" d="M0 330 C148 257 267 348 411 272 S667 313 805 248 932 278 1000 237"></path>':''}`;
      if(detail.terrain==='ruins') return `
        <path class="pc-detail-terrain pc-detail-terrain--dead" d="M0 72 C174 117 294 35 447 111 S745 56 1000 119 L1000 540 0 540 Z"></path>
        <g class="pc-detail-ruins"><path d="M93 135h118v72H93z M296 79h93v124h-93z M694 96h151v82H694z M781 361h118v91H781z"></path></g>`;
      return `
        <path class="pc-detail-terrain pc-detail-terrain--dead" d="M0 74 C177 130 301 37 448 113 S732 61 1000 126 L1000 540 0 540 Z"></path>
        <path class="pc-detail-silence" d="M555 0 L1000 0 1000 540 716 540 C665 420 607 367 555 248 Z"></path>`;
    }

    function resolveDetailSite(site){
      const verdict=operationStore?.get?.().verdict;
      const outcome=verdict&&site.verdictStates?.[verdict];
      return {...site,status:outcome?.status||site.status,tone:outcome?.tone||''};
    }

    function detailSiteSymbol(site,index){
      const resolved=resolveDetailSite(site);
      const selected=state.detailSite===site.id?' is-selected':'';
      const tone=resolved.tone?` is-${escapeHTML(resolved.tone)}`:'';
      return `
        <g class="pc-detail-site pc-detail-site--${escapeHTML(site.type)}${tone}${selected}" data-map-detail-site="${escapeHTML(site.id)}" role="button" tabindex="0" aria-label="${escapeHTML(site.label)}: ${escapeHTML(resolved.status)}" transform="translate(${site.x} ${site.y})">
          <circle class="pc-detail-site-hit" r="28"></circle><circle class="pc-detail-site-ring" r="12"></circle><path class="pc-detail-site-core" d="M0 -6 L6 0 0 6 -6 0Z"></path>
          <text class="pc-detail-site-index" x="17" y="-10">${String(index+1).padStart(2,'0')}</text><text class="pc-detail-site-label" x="17" y="5">${escapeHTML(site.label)}</text>
        </g>`;
    }

    function renderDetailIntel(detail,site){
      if(!site) return `
        <div class="pc-map-intel-kicker">REGIONAL DRILLDOWN</div>
        <h3>${escapeHTML(detail.label)}</h3>
        <p>${escapeHTML(detail.description)}</p>
        <dl class="pc-map-facts"><div><dt>상태</dt><dd>${escapeHTML(detail.status)}</dd></div><div><dt>복원 신뢰도</dt><dd>${escapeHTML(detail.confidence)}</dd></div><div><dt>사건 지점</dt><dd>${detail.sites.length} SIGNALS</dd></div></dl>
        <div class="pc-map-warning">${escapeHTML(detail.warning)}</div>
        ${detail.operation?`<button class="pc-map-region-return" type="button" data-map-open-operation="${escapeHTML(detail.operation)}">연결 작전지도 열기</button>`:''}
        <button class="pc-map-region-return" type="button" data-map-return-region="${escapeHTML(detail.region)}">상위 권역으로 돌아가기</button>`;

      const resolved=resolveDetailSite(site);
      const incident=incidentById(site.incident);
      const records=[...new Set([...(site.records||[]),...(incident?.records||[])])];
      return `
        <div class="pc-map-intel-kicker">SELECTED SITE / ${escapeHTML(confidenceLabels[site.confidence]||site.confidence)}</div>
        <h3>${escapeHTML(site.label)}</h3>
        <p>${escapeHTML(site.meta)}</p>
        <dl class="pc-map-facts"><div><dt>현재 상태</dt><dd class="pc-detail-state${resolved.tone?` is-${escapeHTML(resolved.tone)}`:''}">${escapeHTML(resolved.status)}</dd></div><div><dt>판정</dt><dd>${escapeHTML(confidenceLabels[site.confidence]||site.confidence)}</dd></div>${incident?`<div><dt>사건 코드</dt><dd>${escapeHTML(incident.code)}</dd></div>`:''}</dl>
        ${site.verdictStates?`<div class="pc-detail-verdict-note"><b>OP-BROKEN-CROWN LINK</b><span>${operationStore?.get?.().verdict?`저장된 판단에 따라 지점 상태가 갱신됨`:'판단이 저장되면 지점 상태가 변경됨'}</span></div>`:''}
        ${incident?`<div class="pc-map-incident-summary"><b>${escapeHTML(incident.date)}</b><p>${escapeHTML(incident.summary)}</p></div>`:''}
        ${records.length?`<div class="pc-map-crosslinks"><b>연결 기록</b>${records.map(record=>`<button type="button" data-map-open-record="${escapeHTML(record)}">${escapeHTML(record)}<i>ARCHIVE →</i></button>`).join('')}</div>`:''}
        <div class="pc-map-intel-actions">
          ${incident?.history?`<button type="button" data-map-open-history="${escapeHTML(incident.history)}">세계 기록에서 사건 열기</button>`:''}
          ${site.operation?`<button type="button" data-map-open-operation="${escapeHTML(site.operation)}">연결 작전지도 열기</button>`:''}
          <button type="button" data-map-detail-clear="1">구역 개요로 돌아가기</button>
        </div>`;
    }

    function renderDetail(){
      const detail=detailById(state.detail);
      if(!detail) return '<div class="pc-map-warning">세부 권역 자료를 불러올 수 없다.</div>';
      state.detail=detail.id;
      state.region=detail.region;
      const selected=detail.sites.find(site=>site.id===state.detailSite)||null;
      const parent=regionById(detail.region);
      return `
        <div class="pc-map-detail-tabs" role="tablist" aria-label="세부 권역">
          ${(data.drilldowns||[]).map(item=>`<button type="button" role="tab" aria-selected="${item.id===detail.id}" class="${item.id===detail.id?'is-active':''}" data-map-detail="${escapeHTML(item.id)}"><small>${escapeHTML(regionById(item.region).label)} · ${escapeHTML(item.code)}</small>${escapeHTML(item.label)}</button>`).join('')}
        </div>
        <div class="pc-map-breadcrumb"><button type="button" data-map-return-region="world">세계</button><i>›</i><button type="button" data-map-return-region="${escapeHTML(parent.id)}">${escapeHTML(parent.label)}</button><i>›</i><b>${escapeHTML(detail.label)}</b></div>
        <div class="pc-map-detail-grid">
          <section class="pc-map-stage pc-map-detail-stage pc-map-detail-stage--${escapeHTML(detail.terrain)}" aria-label="${escapeHTML(detail.label)} 세부 지도">
            <div class="pc-map-stage-head"><span>${escapeHTML(detail.code)}</span><b>${escapeHTML(detail.status)} · ${escapeHTML(detail.confidence)}</b></div>
            <svg class="pc-map-svg" viewBox="0 0 1000 540" role="img" aria-labelledby="pcDetailTitle pcDetailDesc" preserveAspectRatio="xMidYMid meet">
              <title id="pcDetailTitle">${escapeHTML(detail.label)} 세부 지도</title><desc id="pcDetailDesc">복원된 경로와 사건 지점을 선택할 수 있는 세부 권역 지도</desc>
              <defs><pattern id="pc-detail-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" class="pc-map-grid-line"></path></pattern><filter id="pc-detail-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" result="blur"></feGaussianBlur><feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMerge></filter></defs>
              <rect class="pc-detail-grid" width="1000" height="540"></rect>${detailTerrain(detail)}
              <g class="pc-detail-routes">${detail.routes.map(route=>{const end=route.points.at(-1)||[0,0];return `<polyline class="pc-detail-route pc-detail-route--${escapeHTML(route.className)}" points="${polyline(route.points)}"></polyline><text class="pc-detail-route-label" x="${end[0]+9}" y="${end[1]-9}">${escapeHTML(route.label)}</text>`;}).join('')}</g>
              <g class="pc-detail-sites">${detail.sites.map(detailSiteSymbol).join('')}</g>
            </svg>
            <div class="pc-map-scan" aria-hidden="true"></div><div class="pc-map-coordinates">LOCAL TRACE · NOT FOR NAVIGATION · ${escapeHTML(detail.confidence)} INTEGRITY</div>
          </section>
          <aside class="pc-map-sidebar pc-map-detail-intel">${renderDetailIntel(detail,selected)}</aside>
        </div>`;
    }

    function renderRegion(){
      const region=regionById(state.region);
      const markers=data.markers.filter(marker=>{
        const inRegion=region.id==='world'?marker.overview:marker.region===region.id&&!marker.overview;
        const estimated=['estimated','testimony','disputed'].includes(marker.confidence);
        return inRegion&&(estimated?state.layers.estimated:state.layers.confirmed);
      });
      const selectedMarker=markerById(state.marker);

      return `
        <div class="pc-map-region-tabs" role="tablist" aria-label="관제 권역">
          ${data.regions.map(item=>`<button type="button" role="tab" aria-selected="${item.id===region.id}" class="${item.id===region.id?'is-active':''}" data-map-region="${escapeHTML(item.id)}"><small>${escapeHTML(item.code)}</small>${escapeHTML(item.label)}</button>`).join('')}
        </div>
        <div class="pc-map-layout">
          <aside class="pc-map-sidebar pc-map-layers">
            <div class="pc-map-panel-title">LAYER CONTROL</div>
            <button class="pc-map-layer-row${state.layers.confirmed?' is-active':''}" type="button" data-map-layer="confirmed" aria-pressed="${state.layers.confirmed}"><i class="is-confirmed"></i><span>확인된 시설·사건</span><b>${state.layers.confirmed?'ON':'OFF'}</b></button>
            <button class="pc-map-layer-row${state.layers.estimated?' is-active':''}" type="button" data-map-layer="estimated" aria-pressed="${state.layers.estimated}"><i class="is-estimated"></i><span>추정·증언 좌표</span><b>${state.layers.estimated?'ON':'OFF'}</b></button>
            <button class="pc-map-layer-row${state.layers.zones?' is-active':''}" type="button" data-map-layer="zones" aria-pressed="${state.layers.zones}"><i class="is-hostile"></i><span>오염·무응답 권역</span><b>${state.layers.zones?'ON':'OFF'}</b></button>
            <button class="pc-map-layer-row${state.layers.routes?' is-active':''}" type="button" data-map-layer="routes" aria-pressed="${state.layers.routes}"><i class="is-route"></i><span>순례·동원 경로</span><b>${state.layers.routes?'ON':'OFF'}</b></button>
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
              <desc id="pcMapDesc">실제 해안선 기준 권역 위에 사건, 시설, 추정 좌표와 오염 구역을 분리해 표시한 정보 지도</desc>
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
      if(operation.id==='op-southern-coup'){
        return `
          <path class="pc-op-terrain pc-op-terrain--forest" d="M0 84 C121 52 224 122 337 84 S557 62 690 38 869 84 1000 47 L1000 540 0 540 Z"></path>
          <path class="pc-op-terrain pc-op-terrain--coast" d="M0 458 C150 411 232 474 350 424 S575 396 690 333 858 294 1000 232 L1000 540 0 540 Z"></path>
          <path class="pc-op-river" d="M308 0 C355 107 325 197 420 275 S511 404 548 540"></path>
          <circle class="pc-op-blood" cx="414" cy="292" r="48"></circle>
          <circle class="pc-op-blood" cx="735" cy="170" r="55"></circle>
          <path class="pc-op-contested-line" d="M518 250 L622 188 701 205 814 126"></path>`;
      }
      return `
        <path class="pc-op-terrain pc-op-terrain--coast" d="M0 73 C168 128 294 36 435 112 S712 58 1000 128 L1000 540 0 540 Z"></path>
        <path class="pc-op-river" d="M371 0 C434 114 442 208 533 260 S712 287 1000 334"></path>
        <path class="pc-op-blood" d="M682 142 C744 105 830 125 849 181 C808 229 719 238 666 196 Z"></path>`;
    }

    function siteSymbol(site,index,siteStates=[]){
      const persistentState=siteStates[index]?` is-${escapeHTML(siteStates[index])}`:'';
      return `
        <g class="pc-op-site pc-op-site--${escapeHTML(site.kind)}${persistentState}" transform="translate(${site.x} ${site.y})">
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
      const persistent=operation.id===operationStore?.operationId?operationStore.get():null;
      const decision=persistent?operationStore.getDecision(persistent.verdict):null;
      const recovered=persistent?.visited?.length||0;
      const stepStates=decision?.stepStates||operation.steps.map((_item,index)=>index<state.step?'complete':index===state.step?'active':'available');
      const operationIncident=incidentById(operation.incident);
      const targetRegion=operationIncident?.region||(operation.id==='op-unlit-fortress'?'southamerica':'europe');
      const objectives=(operation.objectives||[]).map(item=>`<li>${escapeHTML(item)}</li>`).join('');

      return `
        <div class="pc-map-operation-tabs" role="tablist" aria-label="작전 기록">
          ${data.operations.map(item=>`<button type="button" role="tab" aria-selected="${item.id===operation.id}" class="${item.id===operation.id?'is-active':''}" data-map-operation="${escapeHTML(item.id)}"><small>${escapeHTML(item.code)}</small>${escapeHTML(item.label)}</button>`).join('')}
        </div>
        <div class="pc-map-operation-grid${decision?` has-verdict is-${escapeHTML(decision.tone)}`:''}"${persistent?` data-operation-persistence="active" data-operation-verdict="${escapeHTML(persistent.verdict||'pending')}"`:''}>
          <section class="pc-map-stage pc-map-operation-stage" aria-label="${escapeHTML(operation.label)} 작전 경로">
            <div class="pc-map-stage-head"><span>${escapeHTML(operation.code)}</span><b>${persistent?`SAVED · INTEL ${recovered}/3 · `:''}TRACE ${state.step+1}/${operation.steps.length}</b></div>
            <svg class="pc-map-svg" viewBox="0 0 1000 540" role="img" aria-labelledby="pcOpTitle pcOpDesc" preserveAspectRatio="xMidYMid meet">
              <title id="pcOpTitle">${escapeHTML(operation.label)} 작전 경로</title>
              <desc id="pcOpDesc">시간 단계에 따라 복구된 이동 경로와 인원 신호를 표시한 작전 지도</desc>
              <defs>
                <pattern id="pc-op-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" class="pc-map-grid-line"></path></pattern>
                <filter id="pc-op-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" result="blur"></feGaussianBlur><feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter>
              </defs>
              <rect class="pc-map-grid" width="1000" height="540"></rect>
              ${operationTerrain(operation)}
              <g>${operation.sites.map((site,index)=>siteSymbol(site,index,decision?.siteStates||[])).join('')}</g>
              ${step.alternate?`<polyline class="pc-op-route pc-op-route--alternate" points="${polyline(step.alternate)}"></polyline>`:''}
              <polyline class="pc-op-route" points="${polyline(step.route)}"></polyline>
              ${decision?.route?`<polyline class="pc-op-route pc-op-route--verdict pc-op-route--verdict-${escapeHTML(decision.id)}" points="${polyline(decision.route)}"></polyline>`:''}
              <g>${step.route.map((point,index)=>`<circle class="pc-op-waypoint${index===step.route.length-1?' is-current':''}" cx="${point[0]}" cy="${point[1]}" r="${index===step.route.length-1?7:4}"></circle>`).join('')}</g>
              <g>${step.units.map(unitSymbol).join('')}</g>
            </svg>
            <div class="pc-map-scan" aria-hidden="true"></div>
            <div class="pc-map-coordinates">ROUTE RECONSTRUCTION · ${escapeHTML(step.time)} · ${decision?escapeHTML(decision.status):'SIGNAL NOT VERIFIED'}</div>
          </section>
          <aside class="pc-map-sidebar pc-map-operation-intel">
            <div class="pc-map-intel-kicker">${escapeHTML(operation.region)} / ${escapeHTML(operation.code)}</div>
            <h3><time>${escapeHTML(step.time)}</time>${escapeHTML(step.title)}</h3>
            <p>${escapeHTML(step.note)}</p>
            <div class="pc-op-status"><span>${persistent?'정보 복구':'경로 복구'}</span><b>${persistent?`${recovered}/3 · ${Math.round(((state.step+1)/operation.steps.length)*100)}%`:Math.round(((state.step+1)/operation.steps.length)*100)+'%'}</b></div>
            ${decision?`<div class="pc-op-verdict"><small>${escapeHTML(decision.code)}</small><b>${escapeHTML(decision.title)}</b><p>${escapeHTML(decision.summary)}</p></div>`:''}
            <div class="pc-map-warning">${escapeHTML(decision?.consequence||operation.summary)}</div>
            ${operation.classification?`<dl class="pc-map-facts pc-op-classification"><div><dt>분류</dt><dd>${escapeHTML(operation.classification)}</dd></div><div><dt>작전 상태</dt><dd>${escapeHTML(decision?.status||operation.status)}</dd></div></dl>`:''}
            ${(decision?.directive||operation.directive)?`<div class="pc-op-directive"><b>COMMAND DIRECTIVE</b><p>${escapeHTML(decision?.directive||operation.directive)}</p></div>`:''}
            ${objectives?`<div class="pc-op-objectives"><b>OPERATION OBJECTIVES</b><ol>${objectives}</ol></div>`:''}
            ${persistent?`<button class="pc-map-region-return" type="button" data-map-open-record="Operation_Broken_Crown">작전 판단 기록 열기</button>`:''}
            ${operationIncident?.history?`<button class="pc-map-region-return" type="button" data-map-open-history="${escapeHTML(operationIncident.history)}">세계 기록에서 연결 사건 보기</button>`:''}
            <button class="pc-map-region-return" type="button" data-map-return-region="${targetRegion}">해당 권역에서 보기</button>
          </aside>
        </div>
        <div class="pc-map-timeline" aria-label="작전 시간 단계">
          ${operation.steps.map((item,index)=>{
            const phase=stepStates[index]||'available';
            return `<button type="button" class="${index===state.step?'is-active ':''}is-${escapeHTML(phase)}" aria-current="${index===state.step?'step':'false'}" data-map-step="${index}"${phase==='locked'?' disabled':''}><small>${escapeHTML(item.time)}</small><span>${escapeHTML(item.title)}</span><em>${escapeHTML(phase.toUpperCase())}</em></button>`;
          }).join('')}
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
            <button type="button" role="tab" aria-selected="${state.mode==='detail'}" class="${state.mode==='detail'?'is-active':''}" data-map-mode="detail"><small>02</small>세부 권역</button>
            <button type="button" role="tab" aria-selected="${state.mode==='operation'}" class="${state.mode==='operation'?'is-active':''}" data-map-mode="operation"><small>03</small>작전지도</button>
          </div>
          <div class="pc-map-view">${state.mode==='region'?renderRegion():state.mode==='detail'?renderDetail():renderOperation()}</div>
        </div>`;
    }

    async function openHistory(recordId){
      await root.ProjectCurseShell?.navigate?.('history',{replace:false,historyMode:'push'});
      root.ProjectCurseWorldHistoryRuntime?.open?.(recordId);
    }

    async function openFaction(key){
      await root.ProjectCurseShell?.navigate?.('faction-info',{replace:false,historyMode:'push'});
      root.ProjectCurseFactionAnalysisRuntime?.open?.(key);
    }

    async function openArchive(recordId){
      await root.ProjectCurseShell?.navigate?.('archive-entry',{replace:false,historyMode:'push'});
      root.ProjectCurseRuntimeModules?.archiveIndex?.open?.(recordId);
    }

    mount.addEventListener('click',event=>{
      const control=event.target.closest('button,[data-map-marker],[data-map-detail-site]');
      if(!control) return;
      if(control.dataset.mapMode){state.mode=control.dataset.mapMode;root.ProjectCurseAudioControl?.play?.('map.signal');render();return;}
      if(control.dataset.mapRegion){state.region=control.dataset.mapRegion;state.marker=null;root.ProjectCurseAudioControl?.play?.('map.signal');render();return;}
      if(control.dataset.mapLayer){state.layers[control.dataset.mapLayer]=!state.layers[control.dataset.mapLayer];state.marker=null;root.ProjectCurseAudioControl?.play?.('map.layer');render();return;}
      if(control.dataset.mapOpenHistory){root.ProjectCurseAudioControl?.play?.('incident.link');openHistory(control.dataset.mapOpenHistory);return;}
      if(control.dataset.mapOpenFaction){root.ProjectCurseAudioControl?.play?.('incident.link');openFaction(control.dataset.mapOpenFaction);return;}
      if(control.dataset.mapOpenRecord){root.ProjectCurseAudioControl?.play?.('incident.link');openArchive(control.dataset.mapOpenRecord);return;}
      if(control.dataset.mapMarker){
        const marker=markerById(control.dataset.mapMarker);
        state.marker=state.marker===control.dataset.mapMarker?null:control.dataset.mapMarker;
        if(marker?.overview&&state.marker===marker.id) state.region='world';
        root.ProjectCurseAudioControl?.play?.('map.signal');
        render();return;
      }
      if(control.dataset.mapOpenDetail){state.mode='detail';state.detail=control.dataset.mapOpenDetail;state.detailSite=null;root.ProjectCurseAudioControl?.play?.('incident.link');render();return;}
      if(control.dataset.mapDetail){state.mode='detail';state.detail=control.dataset.mapDetail;state.detailSite=null;root.ProjectCurseAudioControl?.play?.('map.signal');render();return;}
      if(control.dataset.mapDetailSite){state.detailSite=state.detailSite===control.dataset.mapDetailSite?null:control.dataset.mapDetailSite;root.ProjectCurseAudioControl?.play?.('map.signal');render();return;}
      if(control.dataset.mapDetailClear){state.detailSite=null;render();return;}
      if(control.dataset.mapEnterRegion){state.region=control.dataset.mapEnterRegion;state.marker=null;render();return;}
      if(control.dataset.mapOpenOperation){state.mode='operation';state.operation=control.dataset.mapOpenOperation;state.step=state.operation===operationStore?.operationId?operationStore.get().mapStep:0;root.ProjectCurseAudioControl?.play?.('incident.link');render();return;}
      if(control.dataset.mapOperation){state.operation=control.dataset.mapOperation;state.step=state.operation===operationStore?.operationId?operationStore.get().mapStep:0;root.ProjectCurseAudioControl?.play?.('map.signal');render();return;}
      if(control.dataset.mapStep!==undefined){
        state.step=Number(control.dataset.mapStep)||0;
        root.ProjectCurseAudioControl?.play?.('operation.step');
        if(state.operation===operationStore?.operationId) operationStore.setMapStep(state.step);
        else render();
        return;
      }
      if(control.dataset.mapReturnRegion){state.mode='region';state.region=control.dataset.mapReturnRegion;state.marker=null;render();}
    });

    mount.addEventListener('keydown',event=>{
      const marker=event.target.closest('[data-map-marker],[data-map-detail-site]');
      if(!marker||(event.key!=='Enter'&&event.key!==' ')) return;
      event.preventDefault();
      marker.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
    });

    document.addEventListener('projectcurse:operation-state-change',()=>{
      if(state.mode==='operation'&&state.operation===operationStore?.operationId) state.step=operationStore.get().mapStep;
      else if(state.mode!=='detail') return;
      render();
    });

    render();
    root.ProjectCurseMapRoomRuntime=Object.freeze({
      showRegion(id){if(regionById(id).id!==id) return false;state.mode='region';state.region=id;state.marker=null;render();return true;},
      showDetail(id,siteId){const detail=detailById(id);if(!detail||detail.id!==id) return false;state.mode='detail';state.detail=id;state.detailSite=detail.sites.some(site=>site.id===siteId)?siteId:null;render();return true;},
      showOperation(id){if(!data.operations.some(operation=>operation.id===id)) return false;state.mode='operation';state.operation=id;state.step=id===operationStore?.operationId?operationStore.get().mapStep:0;render();return true;},
      showIncident(id){const marker=data.markers.find(item=>item.incident===id);if(!marker) return false;state.mode='region';state.region=marker.region;state.marker=marker.id;render();return true;},
      getState:()=>({...state})
    });
  });
})(window);
