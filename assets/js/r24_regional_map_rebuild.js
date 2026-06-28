/* Project Curse / U.A.C Regional Map Module Rebuild
   MapPatch5_8_1R-52 — tactical display decongestion pass, on R51 tactical display base.
   This module intentionally does NOT use legacy classes such as .continental-map-shell,
   .continent-filter, .continent-panel, or [data-map-item]. */
(function(){
  'use strict';
  var VERSION='5.8.1R-46 PrecisionLayerAuditHotfix';
  var NS='http://www.w3.org/2000/svg';
  var VIEW={w:1600,h:900};
  var FILTERS=[
    {key:'all',label:'전체'},
    {key:'zone',label:'오염 구역'},
    {key:'zone-red',label:'레드존'},
    {key:'zone-yellow',label:'옐로우존'},
    {key:'zone-green',label:'그린존'},
    {key:'zone-white',label:'화이트존'},
    {key:'zone-black',label:'블랙존'},
    {key:'facility',label:'작전 시설'},
    {key:'anomaly',label:'현상 기록'},
    {key:'incident',label:'사건 좌표'},
    {key:'blockade-node',label:'봉쇄 거점'},
    {key:'blockade',label:'봉쇄선'},
    {key:'review',label:'검수 모드',mode:true}
  ];
  var INDEX_FILTERS=[
    {key:'auto',label:'필터 연동'},
    {key:'all',label:'전체 색인'},
    {key:'zone',label:'오염 구역'},
    {key:'incident',label:'사건 좌표'},
    {key:'anomaly',label:'현상 기록'},
    {key:'blockade',label:'봉쇄선'},
    {key:'blockade-node',label:'봉쇄 거점'},
    {key:'facility',label:'작전 시설'},
    {key:'comms',label:'통신 이상'},
    {key:'relation',label:'관계권'}
  ];
  var RELEASE_CHECKS=[
    'world-selector',
    'eight-regions',
    'fixed-filter-order',
    'review-mode-only-codes',
    'self-review-report',
    'link-audit',
    'record-index',
    'map-record-return-flow',
    'overlap-selection-menu',
    'legacy-map-disabled',
    'compact-warning-summary',
    'final-hotfix-readiness-report',
    'data-module-split',
    'performance-index-polish',
    'expanded-map-visual-hotfix',
    'detail-map-zoom-focus',
    'precision-content-layer',
    'precision-layer-audit-hotfix'
  ];
  var DATA_MODULE=window.ProjectCurseRegionMapData||{};
  var SUMMARY_MODULE=window.ProjectCurseRegionSummaries||{};
  var LINK_MODULE=window.ProjectCurseRegionRecordLinks||{};
  var REGIONS=DATA_MODULE.REGIONS||[];
  var WORLD_BUTTONS=DATA_MODULE.WORLD_BUTTONS||[];
  var DATA=DATA_MODULE.DATA||{};
  var REGION_INFO=SUMMARY_MODULE.REGION_INFO||{};
  var RECORD_LIBRARY=LINK_MODULE.RECORD_LIBRARY||{};
  var DOC_ROUTE_WHITELIST=LINK_MODULE.DOC_ROUTE_WHITELIST||{};
  var RECORD_KEYWORDS=LINK_MODULE.RECORD_KEYWORDS||[];
  var VISUAL_HOTFIX=DATA_MODULE.VISUAL_HOTFIX||{};
  var PRECISION_LAYER=DATA_MODULE.PRECISION_LAYER||{};
  var PRECISION_AUDIT_HOTFIX=DATA_MODULE.PRECISION_AUDIT_HOTFIX||{};

  var state={region:'world',filter:'all',review:false,selected:null,overlap:null,indexKind:'auto',indexQuery:'',returnRecord:null,returnMap:null,lastMap:null,zoom:'base',focus:'none'};
  var ZOOM_MODES=[{key:'summary',label:'요약',scale:1},{key:'base',label:'기본',scale:1},{key:'zoom',label:'확대',scale:1.38},{key:'precision',label:'정밀',scale:1.78}];
  var PERF={indexCache:{},maxDefaultRows:28,maxFilteredRows:36,maxSearchRows:48,overlapMaxRows:6};
  function invalidatePerfCache(){PERF.indexCache={};}
  if(!REGIONS.length || !Object.keys(DATA).length){
    console.warn('[UAC Regional Map] data modules are missing or empty. Check assets/data/uac_region_map_data.js load order.');
  }

  var root=null, els={};
  function $(sel,ctx){return (ctx||document).querySelector(sel);} 
  function ce(tag,cls){var el=document.createElement(tag); if(cls) el.className=cls; return el;}
  function se(tag,attrs){var el=document.createElementNS(NS,tag); Object.keys(attrs||{}).forEach(function(k){el.setAttribute(k,String(attrs[k]));}); return el;}
  function esc(s){return String(s==null?'':s).replace(/[&<>'"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c];});}
  function cssEsc(s){return (window.CSS&&CSS.escape)?CSS.escape(String(s)):String(s).replace(/[^a-zA-Z0-9_-]/g,function(c){return '\\'+c;});}
  function regionDef(key){return REGIONS.filter(function(r){return r.key===key;})[0]||REGIONS[0];}
  function frame(region){var e=regionDef(region).extent||{lonMin:-185,lonMax:185,latMin:-65,latMax:85}; var lon=e.lonMax-e.lonMin, lat=e.latMax-e.latMin, sc=Math.min(VIEW.w/lon,VIEW.h/lat); return {e:e,sc:sc,ox:(VIEW.w-lon*sc)/2,oy:(VIEW.h-lat*sc)/2};}
  function xy(region,lon,lat){var f=frame(region); return [f.ox+(lon-f.e.lonMin)*f.sc, f.oy+(f.e.latMax-lat)*f.sc];}
  function pathPoints(region,pts){return (pts||[]).map(function(p){var v=xy(region,p[0],p[1]); return v[0].toFixed(1)+','+v[1].toFixed(1);}).join(' ');}
  function curvePath(region,pts){
    pts=pts||[];
    if(pts.length<2) return '';
    var p=pts.map(function(a){return xy(region,a[0],a[1]);});
    if(p.length===2) return 'M '+p[0][0].toFixed(1)+' '+p[0][1].toFixed(1)+' L '+p[1][0].toFixed(1)+' '+p[1][1].toFixed(1);
    if(p.length===3) return 'M '+p[0][0].toFixed(1)+' '+p[0][1].toFixed(1)+' Q '+p[1][0].toFixed(1)+' '+p[1][1].toFixed(1)+' '+p[2][0].toFixed(1)+' '+p[2][1].toFixed(1);
    var d='M '+p[0][0].toFixed(1)+' '+p[0][1].toFixed(1);
    for(var i=1;i<p.length-1;i++){
      var mx=(p[i][0]+p[i+1][0])/2, my=(p[i][1]+p[i+1][1])/2;
      d+=' Q '+p[i][0].toFixed(1)+' '+p[i][1].toFixed(1)+' '+mx.toFixed(1)+' '+my.toFixed(1);
    }
    d+=' T '+p[p.length-1][0].toFixed(1)+' '+p[p.length-1][1].toFixed(1);
    return d;
  }
  function hash(s){s=String(s||''); var h=2166136261; for(var i=0;i<s.length;i++){h^=s.charCodeAt(i); h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);} return h>>>0;}
  function rnd(seed){seed=(seed*1664525+1013904223)>>>0; return [seed,seed/4294967296];}
  function blobPath(cx,cy,rx,ry,seed,pts,irr,rot){pts=pts||26; irr=irr||.25; rot=rot||0; var a0=rot*Math.PI/180, st=seed>>>0, arr=[]; for(var i=0;i<pts;i++){var r1; var t=rnd(st); st=t[0]; r1=t[1]; var r2; t=rnd(st); st=t[0]; r2=t[1]; var a=a0+Math.PI*2*i/pts+(r1-.5)*.16; var wob=1+(r2-.5)*irr+Math.sin(i*1.9+(seed%23))*.055; arr.push([cx+Math.cos(a)*rx*wob,cy+Math.sin(a)*ry*wob]);} var d='M '+mid(arr[pts-1],arr[0]); for(var j=0;j<pts;j++){d+=' Q '+arr[j][0].toFixed(1)+' '+arr[j][1].toFixed(1)+' '+mid(arr[j],arr[(j+1)%pts]);} return d+' Z'; function mid(a,b){return ((a[0]+b[0])/2).toFixed(1)+' '+((a[1]+b[1])/2).toFixed(1);}}
  function scaleVal(s,type){var map={tiny:18,small:28,medium:42,mid:42,large:62,xlarge:84}; var v=map[s]||map.medium; if(type==='zone') return v*1.25; if(type==='line') return {small:2.5,medium:3.2,large:4.2,xlarge:5.2}[s]||3.2; if(type==='pulse') return {small:34,medium:48,large:68,xlarge:88}[s]||48; return v;}
  function detailRank(key){return {summary:0,base:1,zoom:2,precision:3}[key]||1;}
  function itemRequiredRank(it){return it&&it.detail==='precision'?3:(it&&it.detail==='zoom'?2:1);}
  function itemDetailLabel(it){return it&&it.detail==='precision'?'정밀':(it&&it.detail==='zoom'?'확대':'기본');}
  function requiredZoomForItem(it){return it&&it.detail==='precision'?'precision':(it&&it.detail==='zoom'?'zoom':(state.zoom==='summary'?'base':state.zoom||'base'));}
  function isSummaryCore(it){
    if(!it) return false;
    if(it.summary===true) return true;
    if(it.detail) return false;
    if(it.type==='zone') return true;
    if(it.type==='blockade') return it.scale!=='small';
    if(it.type==='incident') return it.scale!=='small';
    if(it.type==='facility') return /관측기지|검문소|관제소|감시초소|항만 검역 시설|후방 감시소/.test(it.name||'');
    if(it.type==='blockade-node') return it.scale!=='small' && /검문|통제|부표|거점/.test(it.name||'');
    return false;
  }
  function detailVisible(it){
    if(state.zoom==='summary') return isSummaryCore(it);
    return itemRequiredRank(it)<=detailRank(state.zoom);
  }
  function itemVisible(it){if(state.region==='world') return false; if(!detailVisible(it)) return false; var f=state.filter; if(f==='all') return true; if(f==='zone') return it.type==='zone'; if(f.indexOf('zone-')===0) return it.type==='zone' && it.zone===f.replace('zone-',''); return it.type===f;}
  function detailVisibleInMode(it,mode){
    mode=mode||'base';
    if(mode==='summary') return isSummaryCore(it);
    return itemRequiredRank(it)<=detailRank(mode);
  }
  function itemVisibleInMode(it,filter,mode){
    if(!detailVisibleInMode(it,mode)) return false;
    var f=filter||'all';
    if(f==='all') return true;
    if(f==='zone') return it.type==='zone';
    if(f.indexOf('zone-')===0) return it.type==='zone' && it.zone===f.replace('zone-','');
    return it.type===f;
  }
  function visibleItemsForMode(region,filter,mode){
    return (DATA[region]||[]).filter(function(it){return itemVisibleInMode(it,filter||'all',mode||'base');});
  }
  function detailCounts(items){
    return {
      base:(items||[]).filter(function(it){return !it.detail;}).length,
      zoom:(items||[]).filter(function(it){return it.detail==='zoom';}).length,
      precision:(items||[]).filter(function(it){return it.detail==='precision';}).length
    };
  }
  function setRegion(key){state.region=key; state.selected=null; state.overlap=null; state.filter='all'; state.indexQuery=''; state.returnRecord=null; state.zoom='base'; state.focus='none'; invalidatePerfCache(); render(); saveMapSnapshot({source:'region'});}
  function setFilter(key){if(key==='review'){state.review=!state.review;} else {state.filter=key; state.selected=null; state.overlap=null;} invalidatePerfCache(); render(); saveMapSnapshot({source:'filter'});}
  function groupClass(it){return ' r24-group-'+String(it.group||'none').replace(/[^a-z0-9_-]/gi,'-');}
  function clearChildren(el){while(el&&el.firstChild) el.removeChild(el.firstChild);}
  function mapSnapshot(extra){
    var selected=findItem(state.selected);
    var snap={region:state.region,filter:state.filter,review:!!state.review,selected:state.selected||null,title:selected?selected.name:null,fromRecord:state.returnRecord||null,zoom:state.zoom,focus:state.focus,panX:Number(state.panX)||0,panY:Number(state.panY)||0,ts:Date.now()};
    if(extra) Object.keys(extra).forEach(function(k){snap[k]=extra[k];});
    return snap;
  }
  function saveMapSnapshot(extra){
    if(state.region&&state.region!=='world') state.lastMap=mapSnapshot(extra);
    try{ sessionStorage.setItem('ProjectCurseR35LastMap',JSON.stringify(state.lastMap||mapSnapshot(extra))); }catch(e){}
    return state.lastMap;
  }
  function readMapSnapshot(){
    if(state.lastMap) return state.lastMap;
    try{var raw=sessionStorage.getItem('ProjectCurseR35LastMap'); if(raw) return JSON.parse(raw);}catch(e){}
    return null;
  }
  function saveRouteContext(ctx){
    ctx=ctx||{};
    try{ sessionStorage.setItem('ProjectCurseR35RouteContext',JSON.stringify(ctx)); }catch(e){}
    window.ProjectCurseR35RouteContext=ctx;
    return ctx;
  }
  function readRouteContext(){
    if(window.ProjectCurseR35RouteContext) return window.ProjectCurseR35RouteContext;
    try{var raw=sessionStorage.getItem('ProjectCurseR35RouteContext'); if(raw) return JSON.parse(raw);}catch(e){}
    return null;
  }
  function recordTitle(recordId){
    var article=null;
    if(recordId){
      Array.prototype.some.call(document.querySelectorAll('.record-detail[data-record]'),function(el){
        if(el.getAttribute('data-record')===String(recordId)){article=el; return true;}
        return false;
      });
    }
    var t=article&&article.querySelector('.doc-title');
    if(t&&t.textContent) return t.textContent.trim();
    var match=null; Object.keys(RECORD_LIBRARY).some(function(k){var r=RECORD_LIBRARY[k]; if(r.record===recordId){match=r.title; return true;} return false;});
    return match||recordId||'이전 기록';
  }
  function currentRecordContext(){
    var article=null, viewer=document.getElementById('archiveRecordViewer');
    if(viewer&&!viewer.hidden) article=viewer.querySelector('.record-detail:not([hidden])');
    if(!article) article=document.querySelector('.record-detail[data-record]:not([hidden])');
    if(!article) return null;
    var id=article.getAttribute('data-record');
    return {record:id,title:recordTitle(id)};
  }
  function applyMapSnapshot(snap,opts){
    snap=snap||readMapSnapshot();
    if(!snap) return false;
    if(snap.selected) return openMapItem(snap.region,snap.selected,Object.assign({fromRecord:snap.fromRecord,keepFilter:snap.filter,keepReview:snap.review,keepZoom:snap.zoom,keepFocus:snap.focus,keepPanX:Number(snap.panX)||0,keepPanY:Number(snap.panY)||0,returning:true},opts||{}));
    if(snap.region&&regionDef(snap.region)){
      var nav=document.querySelector('.side-menu a[data-target="zone-map"]');
      if(nav&&!nav.classList.contains('active')) nav.click();
      var apply=function(){ if(!root) build(); state.region=snap.region; state.filter=snap.filter||'all'; state.review=!!snap.review; state.selected=null; state.overlap=null; state.zoom=snap.zoom||'base'; state.focus=snap.focus||'none'; state.panX=Number(snap.panX)||0; state.panY=Number(snap.panY)||0; render(); if(root) try{root.scrollIntoView({block:'start',behavior:'smooth'});}catch(e){root.scrollIntoView();} };
      setTimeout(apply,nav?430:20); setTimeout(apply,nav?560:90);
      return true;
    }
    return false;
  }
  function build(){
    var section=$('#zone-map'); if(!section) return;
    section.querySelectorAll('.continental-map-shell,.uac-r24-regional-map').forEach(function(el){el.remove();});
    root=ce('div','uac-r24-regional-map'); root.setAttribute('data-r24-version',VERSION);
    root.innerHTML='<div class="r24-topbar"><div class="r24-title"><b>U.A.C REGIONAL SURFACE</b><span data-r24-status>MODULE REBUILD</span></div><div class="r24-region-tabs" data-r24-regions></div></div><div class="r24-filter-row" data-r24-filters></div><div class="r24-body"><div class="r24-map-stage" data-r24-stage><img class="r24-map-img" alt=""/><svg class="r24-map-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" role="img"></svg><div class="r24-overlap-menu" data-r24-overlap hidden></div><div class="r24-world-buttons" data-r24-world-buttons></div><div class="r24-world-hint"><b>WORLD REGION SELECTOR</b><span>권역 버튼을 선택하면 상세 작전 지도로 전환됩니다.</span></div></div><aside class="r24-info"><div class="r24-info-head"><b data-r24-info-title></b><span data-r24-info-status></span></div><p data-r24-info-body></p><div class="r44-view-controls" data-r44-view-controls></div><div class="r24-selected" data-r24-selected><b>선택 기록 없음</b><span>지도 요소를 선택하면 요약 관제 정보가 표시됩니다.</span></div><div class="r24-record-index" data-r24-index><div class="r24-index-head"><b>RECORD INDEX</b><span data-r24-index-count>0</span></div><div class="r24-index-chips" data-r24-index-chips></div><input type="search" data-r24-index-search placeholder="색인 검색: 사건, 봉쇄, 권역, 관계권" autocomplete="off"/><div class="r24-index-list" data-r24-index-list></div></div><div class="r24-self-review" data-r24-self-review><div class="r24-self-head"><b>SELF REVIEW</b><span data-r24-review-state>READY</span></div><div class="r24-self-metrics" data-r24-self-metrics></div><div class="r24-link-audit" data-r24-link-audit></div><div class="r24-self-actions"><button type="button" data-r24-report>검수 리포트 생성</button><button type="button" data-r24-final>최종 점검</button><button type="button" data-r24-copy>리포트 복사</button></div><textarea data-r24-report-text readonly spellcheck="false" placeholder="검수 리포트 생성 버튼을 누르면 현재 권역/필터/요소 수/관계권 상태가 텍스트로 출력됩니다."></textarea></div><div class="r24-list-head"><b>VISIBLE NODES</b><span data-r24-count>0</span></div><div class="r24-node-list" data-r24-list></div></aside></div>';
    var header=section.querySelector('.doc-header, .section-intro-decluttered');
    if(header && header.nextSibling) header.parentNode.insertBefore(root, header.nextSibling); else section.appendChild(root);
    els.regions=$('[data-r24-regions]',root); els.filters=$('[data-r24-filters]',root); els.stage=$('[data-r24-stage]',root); els.img=$('.r24-map-img',root); els.svg=$('.r24-map-svg',root); els.overlap=$('[data-r24-overlap]',root); els.world=$('[data-r24-world-buttons]',root); els.status=$('[data-r24-status]',root); els.infoTitle=$('[data-r24-info-title]',root); els.infoStatus=$('[data-r24-info-status]',root); els.infoBody=$('[data-r24-info-body]',root); els.zoomControls=$('[data-r44-view-controls]',root); els.selected=$('[data-r24-selected]',root); els.index=$('[data-r24-index]',root); els.indexChips=$('[data-r24-index-chips]',root); els.indexSearch=$('[data-r24-index-search]',root); els.indexList=$('[data-r24-index-list]',root); els.indexCount=$('[data-r24-index-count]',root); els.selfReview=$('[data-r24-self-review]',root); els.reviewState=$('[data-r24-review-state]',root); els.selfMetrics=$('[data-r24-self-metrics]',root); els.linkAudit=$('[data-r24-link-audit]',root); els.reportText=$('[data-r24-report-text]',root); els.reportButton=$('[data-r24-report]',root); els.finalButton=$('[data-r24-final]',root); els.copyButton=$('[data-r24-copy]',root); els.list=$('[data-r24-list]',root); els.count=$('[data-r24-count]',root); if(els.zoomControls) els.zoomControls.addEventListener('click',handleZoomControls); if(els.selected) els.selected.addEventListener('click',handleSelectedRecordClick); if(els.index) els.index.addEventListener('click',handleIndexClick); if(els.indexSearch) els.indexSearch.addEventListener('input',function(){state.indexQuery=this.value||''; invalidatePerfCache(); renderIndexPanel(); renderSelfReview(false);}); if(els.overlap) els.overlap.addEventListener('click',handleOverlapMenuClick); if(els.stage) els.stage.addEventListener('click',handleStageClick); ensurePanWheelHandlers(); if(els.reportButton) els.reportButton.addEventListener('click',function(){renderSelfReview(true);}); if(els.finalButton) els.finalButton.addEventListener('click',function(){if(els.reportText) els.reportText.value=makeFinalHotfixReadinessReport(); renderSelfReview(false);}); if(els.copyButton) els.copyButton.addEventListener('click',copySelfReviewReport);
    REGIONS.forEach(function(r){var b=ce('button','r24-region-tab'); b.type='button'; b.dataset.region=r.key; b.innerHTML='<b>'+esc(r.label)+'</b><span>'+esc(r.sub)+'</span>'; b.addEventListener('click',function(){setRegion(r.key);}); els.regions.appendChild(b);});
    FILTERS.forEach(function(f){var b=ce('button','r24-filter'); b.type='button'; b.dataset.filter=f.key; if(f.mode) b.dataset.mode='review'; b.textContent=f.label; b.addEventListener('click',function(){setFilter(f.key);}); els.filters.appendChild(b);});
    WORLD_BUTTONS.forEach(function(w){var b=ce('button','r24-world-btn'); b.type='button'; b.dataset.region=w.region; b.style.left=w.left+'%'; b.style.top=w.top+'%'; b.innerHTML='<b>'+esc(w.label)+'</b><span>'+esc(w.sub)+'</span>'; b.addEventListener('click',function(){setRegion(w.region);}); els.world.appendChild(b);});
    render();
  }
  function render(){ if(!root) return; if(state.region==='world'){state.zoom='base'; state.focus='none';} var r=regionDef(state.region), info=REGION_INFO[state.region]||REGION_INFO.world; root.dataset.region=state.region; root.dataset.filter=state.filter; root.dataset.review=state.review?'1':'0'; root.dataset.zoom=state.zoom; root.dataset.focus=state.focus; els.img.src=r.map; els.img.alt=(info.title||r.label)+' 지도'; els.status.textContent= state.region==='world'?'WORLD SELECTOR / NO DATA LAYER':(info.status+' / '+(state.review?'REVIEW MODE':'OPERATIONS VIEW')); els.infoTitle.textContent=info.title; els.infoStatus.textContent=info.status; els.infoBody.textContent=info.body; Array.prototype.forEach.call(els.regions.children,function(b){b.classList.toggle('active',b.dataset.region===state.region);}); Array.prototype.forEach.call(els.filters.children,function(b){b.classList.toggle('active',b.dataset.filter===state.filter || (b.dataset.filter==='review'&&state.review));}); els.filters.hidden=(state.region==='world'); els.world.hidden=(state.region!=='world'); root.classList.toggle('is-world',state.region==='world'); root.classList.toggle('is-review',!!state.review); document.body.classList.toggle('r24-map-review-mode',!!state.review); root.classList.toggle('r24-focus-active',!!state.selected); clearChildren(els.svg); clearChildren(els.list); var count=0; if(state.region!=='world'){var defs=se('defs',{}); defs.appendChild(markerDef('arrow-end','M 0 0 L 8 4 L 0 8 z')); els.svg.appendChild(defs); var items=(DATA[state.region]||[]).filter(itemVisible); items.filter(function(it){return it.type==='blockade';}).forEach(function(it){renderBlockade(it); count++;}); items.filter(function(it){return it.type==='zone';}).forEach(function(it){renderZone(it); count++;}); items.filter(function(it){return it.type!=='zone'&&it.type!=='blockade';}).forEach(function(it){renderPoint(it); count++;}); items.forEach(addListItem); } els.count.textContent=String(count); renderZoomControls(); updateZoomView(); renderIndexPanel(); updateSelected(); highlight(); updateOverlapMenu(); renderSelfReview(false); }

  function zoomModeDef(key){return ZOOM_MODES.filter(function(z){return z.key===key;})[0]||ZOOM_MODES[0];}
  function zoomLabel(){return zoomModeDef(state.zoom).label;}
  function setZoomMode(key){
    if(state.region==='world') return;
    state.zoom=zoomModeDef(key).key;
    if(state.zoom==='base'||state.zoom==='summary') state.focus='none';
    else if(state.focus==='none' && state.selected) state.focus='selected';
    if(state.selected){var selected=findItem(state.selected); if(selected && !detailVisible(selected)){state.selected=null; state.overlap=null; state.focus='none';}}
    render();
  }
  function setZoomFocus(mode){
    if(state.region==='world') return;
    if(mode==='selected' && !findItem(state.selected)) return;
    if(mode==='relation'){
      var it=findItem(state.selected);
      if(!it||!it.group) return;
    }
    state.focus=mode;
    if(state.focus!=='none' && (state.zoom==='base'||state.zoom==='summary')) state.zoom='zoom';
    render();
  }
  function clearZoomFocus(){state.zoom='base'; state.focus='none'; render();}
  function itemAnchor(it){
    if(!it) return [VIEW.w/2,VIEW.h/2];
    if(it.type==='blockade' && it.points && it.points.length){
      var pts=it.points.map(function(p){return xy(state.region,p[0],p[1]);});
      var sx=0,sy=0; pts.forEach(function(p){sx+=p[0]; sy+=p[1];});
      return [sx/pts.length,sy/pts.length];
    }
    if(typeof it.lon==='number' && typeof it.lat==='number') return xy(state.region,it.lon,it.lat);
    return [VIEW.w/2,VIEW.h/2];
  }
  function itemBounds(it){
    if(!it) return null;
    if(it.type==='blockade' && it.points && it.points.length){
      var xs=[],ys=[]; it.points.forEach(function(p){var q=xy(state.region,p[0],p[1]); xs.push(q[0]); ys.push(q[1]);});
      return {x1:Math.min.apply(null,xs),x2:Math.max.apply(null,xs),y1:Math.min.apply(null,ys),y2:Math.max.apply(null,ys)};
    }
    var c=itemAnchor(it), pad=it.type==='zone'?scaleVal(it.size,'zone')*1.45:(it.type==='comms'||it.type==='anomaly'?scaleVal(it.scale,'pulse')*.80:42);
    return {x1:c[0]-pad,x2:c[0]+pad,y1:c[1]-pad,y2:c[1]+pad};
  }
  function mergeBounds(bounds){
    var out=null;
    (bounds||[]).filter(Boolean).forEach(function(b){
      if(!out) out={x1:b.x1,x2:b.x2,y1:b.y1,y2:b.y2};
      else {out.x1=Math.min(out.x1,b.x1); out.x2=Math.max(out.x2,b.x2); out.y1=Math.min(out.y1,b.y1); out.y2=Math.max(out.y2,b.y2);}
    });
    return out;
  }
  function focusBounds(){
    if(state.region==='world') return null;
    var selected=findItem(state.selected);
    if(state.focus==='relation' && selected && selected.group){
      var groupItems=(DATA[state.region]||[]).filter(function(it){return it.group===selected.group;});
      return mergeBounds(groupItems.map(itemBounds));
    }
    if(state.focus==='selected' && selected) return itemBounds(selected);
    return null;
  }
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
  function updateZoomView(){
    if(!root) return;
    if(state.region==='world' || state.zoom==='base' || state.zoom==='summary'){
      root.style.setProperty('--r44-zoom-scale','1');
      root.style.setProperty('--r44-pan-x','0%');
      root.style.setProperty('--r44-pan-y','0%');
      return;
    }
    var z=zoomModeDef(state.zoom), b=focusBounds(), cx=VIEW.w/2, cy=VIEW.h/2;
    if(b){cx=(b.x1+b.x2)/2; cy=(b.y1+b.y2)/2;}
    cx=clamp(cx,VIEW.w*.10,VIEW.w*.90); cy=clamp(cy,VIEW.h*.12,VIEW.h*.88);
    var cxp=cx/VIEW.w*100, cyp=cy/VIEW.h*100;
    var tx=50-z.scale*cxp, ty=50-z.scale*cyp;
    var maxPan=state.zoom==='precision'?58:42;
    tx=clamp(tx,-maxPan,18); ty=clamp(ty,-maxPan,18);
    root.style.setProperty('--r44-zoom-scale',String(z.scale));
    root.style.setProperty('--r44-pan-x',tx.toFixed(3)+'%');
    root.style.setProperty('--r44-pan-y',ty.toFixed(3)+'%');
  }
  function renderZoomControls(){
    if(!els.zoomControls) return;
    if(state.region==='world'){els.zoomControls.hidden=true; els.zoomControls.innerHTML=''; return;}
    var selected=findItem(state.selected), canSelected=!!selected, canRelation=!!(selected&&selected.group);
    els.zoomControls.hidden=false;
    els.zoomControls.innerHTML='<div class="r44-control-head"><b>DETAIL VIEW</b><span>'+esc(zoomLabel())+' / '+esc(state.focus==='relation'?'관계권 중심':state.focus==='selected'?'선택 중심':'전체')+'</span></div><div class="r44-zoom-row">'+ZOOM_MODES.map(function(z){return '<button type="button" data-r44-zoom="'+esc(z.key)+'" class="'+(state.zoom===z.key?'active':'')+'">'+esc(z.label)+'</button>';}).join('')+'</div><div class="r44-zoom-row focus"><button type="button" data-r44-focus="selected" '+(canSelected?'':'disabled')+' class="'+(state.focus==='selected'?'active':'')+'">선택 중심</button><button type="button" data-r44-focus="relation" '+(canRelation?'':'disabled')+' class="'+(state.focus==='relation'?'active':'')+'">관계권 중심</button><button type="button" data-r44-clear="1">초기화</button></div>';
  }
  function handleZoomControls(ev){
    var zoom=ev.target&&ev.target.closest?ev.target.closest('[data-r44-zoom]'):null;
    var focus=ev.target&&ev.target.closest?ev.target.closest('[data-r44-focus]'):null;
    var clear=ev.target&&ev.target.closest?ev.target.closest('[data-r44-clear]'):null;
    if(zoom){ev.preventDefault(); setZoomMode(zoom.getAttribute('data-r44-zoom')); return;}
    if(focus){ev.preventDefault(); setZoomFocus(focus.getAttribute('data-r44-focus')); return;}
    if(clear){ev.preventDefault(); clearZoomFocus(); return;}
  }
  function shouldZoomLabel(it){
    if(state.zoom==='base'||state.zoom==='summary'||state.region==='world'||!state.selected) return false;
    var sel=findItem(state.selected);
    if(!sel) return false;
    if(it.id===sel.id) return true;
    return state.zoom==='precision' && state.focus==='relation' && sel.group && it.group===sel.group;
  }
  function addZoomLabel(parent,it,x,y,local){
    if(!shouldZoomLabel(it)) return;
    var label=it.id===state.selected?it.name:(it.name.length>18?it.name.slice(0,18)+'…':it.name);
    var t=se('text',{x:x.toFixed?x.toFixed(1):x,y:y.toFixed?y.toFixed(1):y,class:'r24-zoom-label'}); t.textContent=label; parent.appendChild(t);
    if(state.review){var s=se('text',{x:x.toFixed?(x).toFixed(1):x,y:y.toFixed?(Number(y)+13).toFixed(1):y,class:'r24-zoom-label code'}); s.textContent=it.id+' / '+(it.group||'-'); parent.appendChild(s);}
  }
  function markerDef(id,d){var m=se('marker',{id:id,viewBox:'0 0 8 8',refX:'7',refY:'4',markerWidth:'7',markerHeight:'7',orient:'auto-start-reverse'}); m.appendChild(se('path',{d:d,class:'r24-arrow'})); return m;}
  function renderZone(it){var p=xy(state.region,it.lon,it.lat), cx=p[0], cy=p[1], base=scaleVal(it.size,'zone'), seed=hash(it.id+'|'+it.name+'|'+it.variant), g=se('g',{class:'r24-item r24-zone r24-zone-'+it.zone+' r24-zone-size-'+(it.size||'medium')+' r24-variant-'+(it.variant||'base')+' r45-detail-'+(it.detail||'base')+groupClass(it),tabindex:'0','data-id':it.id}); var rot={ 'spread-tail':-14,'coastal-spread':8,'inland-spread':-4,'buffer-band':14,'desert-watch':4,'sea-buffer':-25,'port-control':0,'gate-control':0,'rear-core':0,'void-core':0,'core-crack':0,'desert-spread':-10 }[it.variant]||0; var rx=base, ry=base*.78; if(/buffer|desert|sea/.test(it.variant||'')){rx=base*1.28; ry=base*.70;} if(/port|gate/.test(it.variant||'')){rx=base*.90; ry=base*.58;} if(it.zone==='black'){rx=base*.78; ry=base*.72;} var outer=se('path',{d:blobPath(cx,cy,rx,ry,seed,28,it.zone==='black'?.42:.30,rot),class:'r24-zone-fill'}); g.appendChild(outer); if(it.zone==='red'){g.appendChild(se('path',{d:blobPath(cx+rx*.08,cy-ry*.03,rx*.36,ry*.34,seed^0x9e3779b9,18,.35,rot+17),class:'r24-zone-core'})); if(/tail|spread/.test(it.variant||'')){g.appendChild(se('path',{d:blobPath(cx+rx*.48,cy+ry*.22,rx*.38,ry*.18,seed^0x85ebca6b,16,.40,rot-20),class:'r24-zone-tail'}));}}
    if(it.zone==='black'){g.appendChild(se('path',{d:'M '+(cx-rx*.45).toFixed(1)+' '+(cy-ry*.10).toFixed(1)+' C '+(cx-rx*.15).toFixed(1)+' '+(cy-ry*.55).toFixed(1)+' '+(cx+rx*.22).toFixed(1)+' '+(cy+ry*.46).toFixed(1)+' '+(cx+rx*.50).toFixed(1)+' '+(cy+ry*.02).toFixed(1),class:'r24-black-crack'})); g.appendChild(se('path',{d:blobPath(cx-rx*.02,cy+ry*.02,rx*.34,ry*.29,seed^0x27d4eb2f,16,.45,rot+25),class:'r24-black-core'}));}
    if(it.zone==='red'){g.insertBefore(se('path',{d:blobPath(cx-rx*.05,cy+ry*.06,rx*1.10,ry*.98,seed^0x7f4a7c15,30,.18,rot-8),class:'r24-zone-outer-haze'}),outer);}
    if(it.zone==='yellow'){g.appendChild(se('path',{d:blobPath(cx,cy,rx*1.08,ry*1.08,seed^0x165667b1,28,.18,rot),class:'r24-zone-watch'}));}
    if(it.zone==='green'||it.zone==='white'){g.appendChild(se('path',{d:blobPath(cx,cy,rx*.72,ry*.62,seed^0xa5a5a5a5,18,.18,rot),class:'r24-zone-inner'})); g.appendChild(se('path',{d:blobPath(cx,cy,rx*1.02,ry*.86,seed^0x6c8e9cf5,22,.10,rot),class:'r24-zone-management-ring'}));}
    bindItem(g,it); els.svg.appendChild(g); if(state.review) addReviewLabel(g,it,cx+rx+6,cy-ry*.55); addZoomLabel(g,it,cx+rx+10,cy+ry*.08); }
  function renderBlockade(it){var pts=it.points||[], d=curvePath(state.region,pts); if(!d) return; var g=se('g',{class:'r24-item r24-blockade r24-blockade-'+(it.variant||'line')+' r24-line-scale-'+(it.scale||'medium')+' r45-detail-'+(it.detail||'base')+groupClass(it),tabindex:'0','data-id':it.id}); var path=se('path',{d:d,class:'r24-blockade-line'}); var back=se('path',{d:d,class:'r24-blockade-back'}); g.appendChild(back); g.appendChild(path); if(/sea|route/.test(it.variant||'')) path.setAttribute('marker-end','url(#arrow-end)'); var xyMid=middlePoint(state.region,pts); addBlockadeTicks(g,pts,it.variant); bindItem(g,it); els.svg.appendChild(g); if(state.review && xyMid) addReviewLabel(g,it,xyMid[0]+10,xyMid[1]-10); if(xyMid) addZoomLabel(g,it,xyMid[0]+12,xyMid[1]+18);}
  function middlePoint(region,pts){if(!pts||!pts.length) return null; var p=pts[Math.floor(pts.length/2)]; return xy(region,p[0],p[1]);}
  function addBlockadeTicks(g,pts,variant){if(!pts||pts.length<2) return; for(var i=0;i<pts.length-1;i++){var a=xy(state.region,pts[i][0],pts[i][1]), b=xy(state.region,pts[i+1][0],pts[i+1][1]); var dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1; var nx=-dy/len,ny=dx/len; var c=Math.max(1,Math.floor(len/170)); for(var k=1;k<=c;k++){var t=k/(c+1),x=a[0]+dx*t,y=a[1]+dy*t; g.appendChild(se('line',{x1:(x-nx*8).toFixed(1),y1:(y-ny*8).toFixed(1),x2:(x+nx*8).toFixed(1),y2:(y+ny*8).toFixed(1),class:/sea|route/.test(variant||'')?'r24-sea-tick':'r24-blockade-tick'}));}}}
  function renderPoint(it){var p=xy(state.region,it.lon,it.lat), x=p[0], y=p[1], g=se('g',{class:'r24-item r24-point r24-'+it.type+' r24-scale-'+(it.scale||'medium')+' r45-detail-'+(it.detail||'base')+groupClass(it),tabindex:'0','data-id':it.id,transform:'translate('+x.toFixed(1)+' '+y.toFixed(1)+')'}); var sc={small:.86,medium:1,mid:1.06,large:1.18,xlarge:1.30}[it.scale]||1; if(it.type==='facility') drawFacility(g,sc); else if(it.type==='blockade-node') drawGate(g,sc); else if(it.type==='incident') drawIncident(g,sc); else if(it.type==='anomaly') drawAnomaly(g,sc,it.scale); else if(it.type==='comms') drawComms(g,sc,it.scale); bindItem(g,it); els.svg.appendChild(g); if(state.review) addReviewLabel(g,it,20,-16,true); addZoomLabel(g,it,20,24,true);}
  function drawFacility(g,sc){g.appendChild(se('path',{d:'M 0 '+(-16*sc)+' L '+(15*sc)+' '+(-7*sc)+' L '+(15*sc)+' '+(9*sc)+' L 0 '+(17*sc)+' L '+(-15*sc)+' '+(9*sc)+' L '+(-15*sc)+' '+(-7*sc)+' Z',class:'r24-icon-plate'})); g.appendChild(se('path',{d:'M '+(-8*sc)+' '+(6*sc)+' L '+(-8*sc)+' '+(-2*sc)+' L '+(-3*sc)+' '+(-7*sc)+' L '+(4*sc)+' '+(-7*sc)+' L '+(9*sc)+' '+(-2*sc)+' L '+(9*sc)+' '+(6*sc)+' Z',class:'r24-icon-line'})); g.appendChild(se('line',{x1:-5*sc,y1:1*sc,x2:6*sc,y2:1*sc,class:'r24-icon-line'}));}
  function drawGate(g,sc){g.appendChild(se('rect',{x:-13*sc,y:-13*sc,width:26*sc,height:26*sc,rx:3*sc,class:'r24-gate-plate'})); g.appendChild(se('path',{d:'M '+(-9*sc)+' '+(-5*sc)+' L '+(9*sc)+' '+(-5*sc)+' M '+(-9*sc)+' '+(5*sc)+' L '+(9*sc)+' '+(5*sc)+' M '+(-6*sc)+' '+(-10*sc)+' L '+(-6*sc)+' '+(10*sc)+' M '+(6*sc)+' '+(-10*sc)+' L '+(6*sc)+' '+(10*sc),class:'r24-icon-line'}));}
  function drawIncident(g,sc){g.appendChild(se('path',{d:'M 0 '+(-17*sc)+' L '+(17*sc)+' '+(13*sc)+' L '+(-17*sc)+' '+(13*sc)+' Z',class:'r24-incident-plate'})); g.appendChild(se('line',{x1:0,y1:-6*sc,x2:0,y2:4*sc,class:'r24-icon-line'})); g.appendChild(se('circle',{cx:0,cy:8*sc,r:2*sc,class:'r24-icon-fill'}));}
  function drawAnomaly(g,sc,size){var r=scaleVal(size,'pulse')*.45; g.appendChild(se('circle',{cx:0,cy:0,r:r,class:'r24-pulse-ring'})); g.appendChild(se('circle',{cx:0,cy:0,r:9*sc,class:'r24-anomaly-core'})); g.appendChild(se('path',{d:'M '+(-13*sc)+' 0 Q 0 '+(-15*sc)+' '+(13*sc)+' 0 Q 0 '+(15*sc)+' '+(-13*sc)+' 0 Z',class:'r24-icon-line'}));}
  function drawComms(g,sc,size){var r=scaleVal(size,'pulse')*.52; g.appendChild(se('circle',{cx:0,cy:0,r:r,class:'r24-comms-field'})); g.appendChild(se('line',{x1:0,y1:12*sc,x2:0,y2:-12*sc,class:'r24-icon-line'})); g.appendChild(se('path',{d:'M '+(-15*sc)+' '+(-6*sc)+' Q 0 '+(-20*sc)+' '+(15*sc)+' '+(-6*sc)+' M '+(-10*sc)+' 0 Q 0 '+(-9*sc)+' '+(10*sc)+' 0',class:'r24-icon-line r24-broken'}));}
  function addReviewLabel(parent,it,x,y,local){var t=se('text',{x:x.toFixed?x.toFixed(1):x,y:y.toFixed?y.toFixed(1):y,class:'r24-review-label'}); t.textContent=it.id; parent.appendChild(t);}
  function bindItem(g,it){g.addEventListener('click',function(ev){ev.stopPropagation(); selectItemFromPointer(it,ev);}); g.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault(); state.overlap=null; state.selected=it.id; if(state.zoom!=='base'&&state.focus==='none') state.focus='selected'; saveMapSnapshot({source:'keyboard'}); if(state.zoom!=='base'){render(); return;} updateSelected(); highlight(); updateOverlapMenu(); updateZoomView(); renderZoomControls();}});}

  function selectItemFromPointer(it,ev){
    var pt=eventSvgPoint(ev), ui=eventStagePoint(ev);
    var candidates=pt?overlapCandidates(pt[0],pt[1],it):[it];
    state.selected=it.id;
    if(state.zoom!=='base'&&state.focus==='none') state.focus='selected';
    saveMapSnapshot({source:'select'});
    if(candidates.length>1){
      state.overlap={x:ui?ui[0]:16,y:ui?ui[1]:16,ids:candidates.map(function(x){return x.id;})};
    } else {
      state.overlap=null;
    }
    if(state.zoom!=='base'){render(); return;} updateSelected(); highlight(); updateOverlapMenu();
  }
  function eventStagePoint(ev){
    if(!els.stage||!ev) return null;
    var r=els.stage.getBoundingClientRect();
    return [Math.max(8,Math.min(r.width-8,ev.clientX-r.left)),Math.max(8,Math.min(r.height-8,ev.clientY-r.top))];
  }
  function eventSvgPoint(ev){
    if(!els.svg||!ev) return null;
    var p=els.svg.createSVGPoint(); p.x=ev.clientX; p.y=ev.clientY;
    try{var m=els.svg.getScreenCTM(); if(!m) return null; var q=p.matrixTransform(m.inverse()); return [q.x,q.y];}catch(e){return null;}
  }
  function itemAnchor(it){
    if(!it) return null;
    if(it.type==='blockade') return middlePoint(state.region,it.points||[]);
    if(typeof it.lon==='number'&&typeof it.lat==='number') return xy(state.region,it.lon,it.lat);
    return null;
  }
  function itemHitScore(it,x,y){
    if(!it) return Infinity;
    if(it.type==='zone'){
      var c=itemAnchor(it); if(!c) return Infinity;
      var r=scaleVal(it.size,'zone'), rx=r*1.55, ry=r*(it.zone==='black'?.95:1.05);
      var dx=(x-c[0])/Math.max(1,rx), dy=(y-c[1])/Math.max(1,ry), d=Math.sqrt(dx*dx+dy*dy);
      return d<=1.12?d*42:Infinity;
    }
    if(it.type==='blockade'){
      var pts=(it.points||[]).map(function(p){return xy(state.region,p[0],p[1]);});
      if(pts.length<2) return Infinity;
      var best=Infinity;
      for(var i=0;i<pts.length-1;i++) best=Math.min(best,distToSeg(x,y,pts[i],pts[i+1]));
      var th={small:18,medium:22,large:28,xlarge:34}[it.scale||'medium']||22;
      return best<=th?best+10:Infinity;
    }
    var a=itemAnchor(it); if(!a) return Infinity;
    var d2=Math.hypot(x-a[0],y-a[1]);
    var th2={small:28,medium:34,mid:38,large:48,xlarge:60}[it.scale||'medium']||34;
    if(it.type==='anomaly'||it.type==='comms') th2=Math.max(th2,scaleVal(it.scale,'pulse')*.55);
    return d2<=th2?d2:Infinity;
  }
  function distToSeg(x,y,a,b){
    var dx=b[0]-a[0], dy=b[1]-a[1], l=dx*dx+dy*dy;
    if(!l) return Math.hypot(x-a[0],y-a[1]);
    var t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/l));
    return Math.hypot(x-(a[0]+dx*t),y-(a[1]+dy*t));
  }
  function overlapPriority(it){return {facility:1,'blockade-node':2,incident:3,anomaly:4,comms:5,blockade:6,zone:7}[it.type]||9;}
  function overlapCandidates(x,y,primary){
    var arr=getVisibleItems().map(function(it){return {it:it,score:itemHitScore(it,x,y)};}).filter(function(o){return isFinite(o.score);});
    if(primary&&!arr.some(function(o){return o.it.id===primary.id;})) arr.push({it:primary,score:0});
    arr.sort(function(a,b){return (a.it.id===primary.id?-1:0)-(b.it.id===primary.id?-1:0) || overlapPriority(a.it)-overlapPriority(b.it) || a.score-b.score || String(a.it.id).localeCompare(String(b.it.id));});
    return arr.slice(0,8).map(function(o){return o.it;});
  }
  function handleOverlapMenuClick(ev){
    var btn=ev.target&&ev.target.closest?ev.target.closest('[data-r24-overlap-pick]'):null;
    if(!btn) return;
    ev.preventDefault(); ev.stopPropagation();
    state.selected=btn.getAttribute('data-r24-overlap-pick');
    if(state.zoom!=='base'&&state.focus==='none') state.focus='selected';
    saveMapSnapshot({source:'overlap'});
    state.overlap=null;
    if(state.zoom!=='base'){render(); return;} updateSelected(); highlight(); updateOverlapMenu();
  }
  function handleStageClick(ev){
    if(state.region==='world') return;
    if(ev.target&&ev.target.closest&&ev.target.closest('.r24-item,.r24-overlap-menu,.r24-world-btn')) return;
    state.selected=null; state.overlap=null; if(state.focus!=='none') state.focus='none'; updateSelected(); highlight(); updateOverlapMenu(); updateZoomView(); renderZoomControls();
  }
  function updateOverlapMenu(){
    if(!els.overlap) return;
    var ov=state.overlap;
    if(!ov||!ov.ids||ov.ids.length<2||state.region==='world'){
      els.overlap.hidden=true; els.overlap.innerHTML=''; return;
    }
    var r=els.stage?els.stage.getBoundingClientRect():{width:320,height:220};
    var left=Math.max(8,Math.min((r.width||320)-220,ov.x+10));
    var top=Math.max(8,Math.min((r.height||220)-160,ov.y+10));
    els.overlap.style.left=left+'px'; els.overlap.style.top=top+'px';
    var items=ov.ids.map(findItem).filter(Boolean), shown=items.slice(0,PERF.overlapMaxRows), more=Math.max(0,items.length-shown.length);
    els.overlap.innerHTML='<b>겹친 요소 선택</b><span>후보 '+items.length+'개 · 같은 관계권 우선 선택</span><div>'+shown.map(function(it){return '<button type="button" data-r24-overlap-pick="'+esc(it.id)+'" class="'+(it.id===state.selected?'active':'')+'"><strong>'+esc(it.name)+'</strong><em><i>'+esc(typeLabel(it))+'</i>'+(it.zone?' · '+zoneLabel(it.zone):'')+' · '+esc(it.group||'-')+(state.review?' / '+esc(it.id):'')+'</em></button>';}).join('')+(more?'<p class="r24-overlap-more">추가 후보 '+more+'개는 색인 검색 또는 필터 전환으로 확인</p>':'')+'</div>';
    els.overlap.hidden=false;
  }
  function findItem(id){var all=DATA[state.region]||[]; for(var i=0;i<all.length;i++) if(all[i].id===id) return all[i]; return null;}
  function addRecordKey(list,key){if(key&&RECORD_LIBRARY[key]&&list.indexOf(key)===-1) list.push(key);}
  function relatedRecordKeys(it){
    var keys=[], text=((it.records||'')+' '+(it.name||'')+' '+(it.status||'')+' '+(it.role||'')+' '+(it.group||'')).trim();
    RECORD_KEYWORDS.forEach(function(rule){ if(rule.re.test(text)) rule.keys.forEach(function(k){addRecordKey(keys,k);}); });
    if(it.type==='zone'){
      if(it.zone==='red'){addRecordKey(keys,'redzone'); addRecordKey(keys,'nhc');}
      else if(it.zone==='black'){addRecordKey(keys,'redzone'); addRecordKey(keys,'nhc');}
      else if(it.zone==='yellow'||it.zone==='green'||it.zone==='white'){addRecordKey(keys,'zone');}
    }
    if(it.type==='facility'||it.type==='blockade'||it.type==='blockade-node') addRecordKey(keys,'nhc');
    if(it.type==='incident') addRecordKey(keys,'fcr');
    if(it.type==='anomaly'||it.type==='comms') addRecordKey(keys,'redzone');
    if(/blood-lake/.test(it.group||'')){addRecordKey(keys,'bloodlake'); addRecordKey(keys,'redzone');}
    if(/cults?|ushinoda|haimun/i.test(text)){addRecordKey(keys,'cults'); addRecordKey(keys,'fcr');}
    if(/타락 개체 분류 보고서/.test(text)) addRecordKey(keys,'ferals');
    return keys.slice(0,4);
  }
  function renderRecordLinks(it){
    var keys=relatedRecordKeys(it);
    if(!keys.length) return '';
    return '<div class="r24-linked-records"><strong>관련 기록</strong><div class="r24-linked-record-list">'+keys.map(function(k){var r=RECORD_LIBRARY[k]; return '<button type="button" class="r24-record-link" data-r24-record-link="'+esc(k)+'"><b>'+esc(r.title)+'</b><span>'+esc(r.tag||'RECORD')+(state.review?' / '+esc(r.code||r.record||r.url||k):'')+'</span></button>';}).join('')+'</div></div>';
  }
  function openInternalRecord(recordId,opts){
    opts=opts||{};
    if(!recordId || typeof window.ProjectCurseShowInternalRecord!=='function') return false;
    var fromMap=opts.fromMap||saveMapSnapshot({source:'map-to-record',record:recordId});
    saveRouteContext({mode:'map-to-record',record:recordId,map:fromMap,ts:Date.now()});
    if(window.ProjectCursePlayAudioRole) window.ProjectCursePlayAudioRole('recordOpen');
    var archiveLink=document.querySelector('.side-menu a[data-target="archive-entry"]');
    if(archiveLink && !archiveLink.classList.contains('active')) archiveLink.click();
    setTimeout(function(){window.ProjectCurseShowInternalRecord(recordId); mountRecordReturnPanels();},160);
    setTimeout(mountRecordReturnPanels,560);
    setTimeout(mountRecordReturnPanels,2280);
    return true;
  }
  function openRelatedRecord(key){
    var r=RECORD_LIBRARY[key]; if(!r) return;
    if(r.record && openInternalRecord(r.record,{fromMap:saveMapSnapshot({source:'map-to-record',recordKey:key,record:r.record})})) return;
    if(window.ProjectCursePlayAudioRole) window.ProjectCursePlayAudioRole('recordOpen');
    if(r.url) window.location.href=r.url;
  }
  function handleSelectedRecordClick(ev){
    var btn=ev.target&&ev.target.closest?ev.target.closest('[data-r24-record-link]'):null;
    var back=ev.target&&ev.target.closest?ev.target.closest('[data-r24-return-record]'):null;
    var resume=ev.target&&ev.target.closest?ev.target.closest('[data-r24-resume-map]'):null;
    if(back){
      ev.preventDefault(); ev.stopPropagation();
      openInternalRecord(back.getAttribute('data-r24-return-record'),{fromMap:mapSnapshot({source:'map-return-record'})});
      return;
    }
    if(resume){
      ev.preventDefault(); ev.stopPropagation(); applyMapSnapshot(readMapSnapshot()); return;
    }
    if(!btn) return;
    ev.preventDefault(); ev.stopPropagation();
    openRelatedRecord(btn.getAttribute('data-r24-record-link'));
  }
  function indexFilterFromMapFilter(){
    if(state.filter==='all') return 'all';
    if(state.filter==='zone'||state.filter.indexOf('zone-')===0) return 'zone';
    if(state.filter==='incident') return 'incident';
    if(state.filter==='anomaly') return 'anomaly';
    if(state.filter==='blockade') return 'blockade';
    if(state.filter==='blockade-node') return 'blockade-node';
    if(state.filter==='facility') return 'facility';
    if(state.filter==='comms') return 'comms';
    return 'all';
  }
  function activeIndexKind(){return state.indexKind==='auto'?indexFilterFromMapFilter():state.indexKind;}
  function indexKindLabel(kind){var row=INDEX_FILTERS.filter(function(x){return x.key===kind;})[0]; return row?row.label:kind;}
  function indexFilterMatches(it,kind){
    if(kind==='all') return true;
    if(kind==='zone') return it.type==='zone';
    if(kind==='relation') return true;
    return it.type===kind;
  }
  function indexUniverse(){
    var out=[];
    if(state.region==='world'){
      Object.keys(DATA).forEach(function(region){(DATA[region]||[]).forEach(function(it){out.push({region:region,item:it});});});
    } else {
      (DATA[state.region]||[]).forEach(function(it){out.push({region:state.region,item:it});});
    }
    return out;
  }
  function indexText(row){var it=row.item; return [it.id,it.name,it.type,it.zone,it.group,it.role,it.status,it.records,regionLabel(row.region)].join(' ').toLowerCase();}
  function indexQueryPass(row){var q=String(state.indexQuery||'').trim().toLowerCase(); if(!q) return true; return q.split(/\s+/).every(function(part){return indexText(row).indexOf(part)!==-1;});}
  function indexPriority(it){return {incident:1,anomaly:2,comms:3,zone:4,'blockade-node':5,blockade:6,facility:7}[it.type]||9;}
  function regionOrderIndex(key){for(var i=0;i<REGIONS.length;i++) if(REGIONS[i].key===key) return i; return 999;}
  function indexRegionRank(row){
    if(state.region!=='world' && row.region===state.region) return -1;
    return regionOrderIndex(row.region);
  }
  function indexRowSort(a,b){
    return indexRegionRank(a)-indexRegionRank(b) || indexPriority(a.item)-indexPriority(b.item) || regionLabel(a.region).localeCompare(regionLabel(b.region),'ko') || String(a.item.name).localeCompare(String(b.item.name),'ko');
  }
  function buildIndexRows(){
    var kind=activeIndexKind();
    if(kind==='relation') return buildRelationIndexRows();
    return indexUniverse().filter(function(row){return indexFilterMatches(row.item,kind)&&indexQueryPass(row);}).sort(indexRowSort);
  }
  function indexCacheKey(){return [state.region,state.filter,state.indexKind,activeIndexKind(),String(state.indexQuery||'').trim().toLowerCase()].join('|');}
  function buildIndexRowsCached(){
    var key=indexCacheKey();
    if(PERF.indexCache[key]) return PERF.indexCache[key].slice();
    var rows=buildIndexRows();
    PERF.indexCache[key]=rows.slice();
    return rows;
  }
  function indexDisplayLimit(kind,rows){
    if(state.indexQuery) return PERF.maxSearchRows;
    if(kind==='all' && state.region==='world') return PERF.maxDefaultRows;
    if(kind==='relation') return PERF.maxFilteredRows;
    return PERF.maxFilteredRows;
  }
  function indexSummary(rows){
    var out={current:0,other:0,regions:{}};
    (rows||[]).forEach(function(row){
      var r=row.region||'-'; out.regions[r]=(out.regions[r]||0)+1;
      if(state.region!=='world' && r===state.region) out.current++; else out.other++;
    });
    return out;
  }
  function buildRelationIndexRows(){
    var groups={}, q=String(state.indexQuery||'').trim().toLowerCase();
    indexUniverse().forEach(function(row){
      var it=row.item, key=row.region+'|'+(it.group||'ungrouped');
      if(!groups[key]) groups[key]={region:row.region,group:it.group||'ungrouped',items:[],types:{},zones:{}};
      groups[key].items.push(it); groups[key].types[it.type]=(groups[key].types[it.type]||0)+1; if(it.zone) groups[key].zones[it.zone]=(groups[key].zones[it.zone]||0)+1;
    });
    return Object.keys(groups).map(function(k){return groups[k];}).filter(function(g){
      if(!q) return true;
      var text=[g.group,regionLabel(g.region)].concat(g.items.map(function(it){return it.id+' '+it.name+' '+it.status;})).join(' ').toLowerCase();
      return q.split(/\s+/).every(function(part){return text.indexOf(part)!==-1;});
    }).sort(function(a,b){return (state.region!=='world'&&a.region===state.region?-1:0)-(state.region!=='world'&&b.region===state.region?-1:0) || regionOrderIndex(a.region)-regionOrderIndex(b.region) || b.items.length-a.items.length || a.group.localeCompare(b.group);});
  }
  function openIndexItem(region,id){
    var found=findGlobalItem(id); if(!found) return false;
    var it=found.item, filter=it.type==='zone'?('zone-'+it.zone):it.type;
    return openMapItem(region||found.region,id,{keepFilter:filter,keepReview:state.review,keepZoom:requiredZoomForItem(it),keepFocus:'selected'});
  }
  function openIndexGroup(region,group){
    var items=(DATA[region]||[]).filter(function(it){return (it.group||'ungrouped')===group;}).sort(function(a,b){return indexPriority(a)-indexPriority(b)||String(a.name).localeCompare(String(b.name),'ko');});
    if(!items.length) return false;
    return openMapItem(region,items[0].id,{keepFilter:'all',keepReview:state.review});
  }
  function renderIndexPanel(){
    if(!els.index) return;
    var kind=activeIndexKind(), rows=buildIndexRowsCached(), limit=indexDisplayLimit(kind,rows), shown=rows.slice(0,limit), more=Math.max(0,rows.length-shown.length), summary=indexSummary(rows);
    els.index.hidden=false;
    if(els.indexChips){
      els.indexChips.innerHTML=INDEX_FILTERS.map(function(f){return '<button type="button" data-r24-index-kind="'+esc(f.key)+'" class="'+((state.indexKind===f.key||(state.indexKind!=='auto'&&f.key===kind))?'active':'')+'">'+esc(f.label)+'</button>';}).join('');
    }
    if(els.indexSearch&&document.activeElement!==els.indexSearch) els.indexSearch.value=state.indexQuery||'';
    if(els.indexCount){
      var scope=state.region==='world'?'전 권역':('현재 권역 '+summary.current+'개'+(summary.other?' / 외부 '+summary.other+'개':''));
      els.indexCount.textContent=esc(indexKindLabel(kind))+' · '+rows.length+' · '+scope;
    }
    if(!els.indexList) return;
    if(!rows.length){var q=state.indexQuery?(' / 검색어 '+state.indexQuery):''; els.indexList.innerHTML='<div class="r24-index-empty"><b>검색 결과 없음</b><span>'+esc(indexKindLabel(kind))+esc(q)+' 조건과 일치하는 지도 기록이 없습니다. 필터 연동 또는 전체 색인으로 전환해 확인하십시오. 현재 권역 기준 색인이 비어 있으면 세계 화면에서 전체 색인을 확인하십시오.</span></div>'; return;}
    if(kind==='relation'){
      els.indexList.innerHTML=shown.map(function(g){
        var lead=g.items.slice().sort(function(a,b){return indexPriority(a)-indexPriority(b);})[0];
        var zoneText=fmtCounts(g.zones,{red:'레드존',yellow:'옐로우존',green:'그린존',white:'화이트존',black:'블랙존'});
        var selected=findItem(state.selected), active=selected&&selected.group===g.group&&state.region===g.region;
        return '<button type="button" class="r24-index-row relation '+(active?'selected ':'')+(g.region===state.region?'current-region':'')+'" data-r24-index-region="'+esc(g.region)+'" data-r24-index-group="'+esc(g.group)+'"><b>'+esc(g.group)+'</b><span>'+esc(regionLabel(g.region))+' · 요소 '+g.items.length+'개 · '+esc(typeLabel(lead))+(zoneText!=='-'?' · '+esc(zoneText):'')+(state.review?' / '+esc((lead&&lead.id)||'-'):'')+'</span></button>';
      }).join('')+(more?'<div class="r24-index-more">표시 '+shown.length+'/'+rows.length+' · 추가 관계권 '+more+'개는 검색어로 좁혀 확인하십시오.</div>':'');
    } else {
      els.indexList.innerHTML=shown.map(function(row){var it=row.item, dLabel=it.detail?(it.detail==='precision'?'정밀 전용':(it.detail==='zoom'?'확대 전용':itemDetailLabel(it))):''; return '<button type="button" class="r24-index-row '+(row.region===state.region?'current-region ':'')+(it.id===state.selected?'selected ':'')+(it.detail?'precision-gated':'')+'" data-r24-index-region="'+esc(row.region)+'" data-r24-index-open="'+esc(it.id)+'"><b>'+esc(it.name)+'</b><span><i>'+esc(typeLabel(it))+'</i> '+esc(regionLabel(row.region))+(it.zone?' · '+esc(zoneLabel(it.zone)):'')+' · '+esc(it.group||'-')+(dLabel?' · '+esc(dLabel):'')+(it.detail&&detailRank(state.zoom)<itemRequiredRank(it)?' · 열면 자동 전환':'')+(state.review?' / '+esc(it.id):'')+'</span></button>';}).join('')+(more?'<div class="r24-index-more">표시 '+shown.length+'/'+rows.length+' · 추가 항목 '+more+'개는 검색어로 좁혀 확인하십시오.</div>':'');
    }
  }
  function handleIndexClick(ev){
    var kind=ev.target&&ev.target.closest?ev.target.closest('[data-r24-index-kind]'):null;
    var open=ev.target&&ev.target.closest?ev.target.closest('[data-r24-index-open]'):null;
    var group=ev.target&&ev.target.closest?ev.target.closest('[data-r24-index-group]'):null;
    if(kind){ev.preventDefault(); ev.stopPropagation(); state.indexKind=kind.getAttribute('data-r24-index-kind')||'auto'; invalidatePerfCache(); renderIndexPanel(); renderSelfReview(false); return;}
    if(open){ev.preventDefault(); ev.stopPropagation(); openIndexItem(open.getAttribute('data-r24-index-region'),open.getAttribute('data-r24-index-open')); return;}
    if(group){ev.preventDefault(); ev.stopPropagation(); openIndexGroup(group.getAttribute('data-r24-index-region'),group.getAttribute('data-r24-index-group')); return;}
  }

  function renderNavigationControls(it){
    var parts=[];
    if(state.returnRecord){
      parts.push('<button type="button" class="r24-nav-return-record" data-r24-return-record="'+esc(state.returnRecord)+'"><b>이전 기록으로 돌아가기</b><span>'+esc(recordTitle(state.returnRecord))+(state.review?' / '+esc(state.returnRecord):'')+'</span></button>');
    }
    var last=readMapSnapshot();
    if(last&&last.selected&&(!it||last.selected!==it.id)){
      parts.push('<button type="button" class="r24-nav-resume-map" data-r24-resume-map="1"><b>이전 지도 위치 복구</b><span>'+esc(regionLabel(last.region))+(last.title?' · '+esc(last.title):'')+(state.review?' / '+esc(last.selected):'')+'</span></button>');
    }
    return parts.length?'<div class="r24-navigation-bridge"><strong>이동 흐름</strong><div>'+parts.join('')+'</div></div>':'';
  }
  function updateSelected(){
    var it=findItem(state.selected);
    if(!it){els.selected.innerHTML='<b>선택 기록 없음</b><span>지도 요소를 선택하면 요약 관제 정보와 관련 기록 링크가 표시됩니다.</span>'+renderNavigationControls(null); return;}
    els.selected.innerHTML='<b>'+esc(it.name)+'</b><em>'+esc(typeLabel(it))+(it.zone?' / '+zoneLabel(it.zone):'')+'</em><p>'+esc(it.status||'')+'</p><dl><dt>관계권</dt><dd>'+esc(it.group||'-')+'</dd><dt>보기 단계</dt><dd>'+esc(itemDetailLabel(it))+'</dd><dt>기록</dt><dd>'+esc(it.records||'-')+'</dd>'+(state.review?'<dt>내부 코드</dt><dd>'+esc(it.id)+'</dd>':'')+'</dl>'+renderRecordLinks(it)+renderNavigationControls(it);
  }
  function highlight(){var it=findItem(state.selected), group=it&&it.group; if(root) root.classList.toggle('r24-focus-active',!!it); Array.prototype.forEach.call(els.svg.querySelectorAll('.r24-item'),function(n){var same=n.getAttribute('data-id')===state.selected; n.classList.toggle('selected',same); n.classList.remove('related'); if(group&&!same&&n.className&&String(n.getAttribute('class')||'').indexOf('r24-group-'+String(group).replace(/[^a-z0-9_-]/gi,'-'))!==-1) n.classList.add('related');}); var selectedNode=state.selected&&els.svg?els.svg.querySelector('.r24-item[data-id="'+cssEsc(state.selected)+'"]'):null; var selectedItem=findItem(state.selected); if(selectedNode&&selectedItem&&selectedItem.type!=='zone') els.svg.appendChild(selectedNode); renderSelfReview(false);}
  function addListItem(it){var b=ce('button','r24-node-row'); b.type='button'; b.innerHTML='<b>'+esc(it.name)+'</b><span>'+esc(typeLabel(it))+(it.zone?' · '+zoneLabel(it.zone):'')+(it.detail?' · '+itemDetailLabel(it):'')+'</span>'; b.addEventListener('click',function(){state.selected=it.id; if(state.zoom!=='base'&&state.focus==='none') state.focus='selected'; saveMapSnapshot({source:'list'}); if(state.zoom!=='base'){render(); return;} updateSelected(); highlight(); updateZoomView(); renderZoomControls();}); els.list.appendChild(b);}
  function typeLabel(it){return {zone:'오염 구역',facility:'작전 시설',anomaly:'현상 기록',incident:'사건 좌표','blockade-node':'봉쇄 거점',blockade:'봉쇄선',comms:'통신'}[it.type]||it.type;}
  function zoneLabel(z){return {red:'레드존',yellow:'옐로우존',green:'그린존',white:'화이트존',black:'블랙존'}[z]||z;}
  function getRegionItems(region){return (DATA[region]||[]).slice();}
  function getVisibleItems(){return state.region==='world'?[]:getRegionItems(state.region).filter(itemVisible);}
  function countBy(items,fn){var out={}; items.forEach(function(it){var k=fn(it)||'-'; out[k]=(out[k]||0)+1;}); return out;}
  function fmtCounts(obj,labels){var keys=Object.keys(obj); if(!keys.length) return '-'; keys.sort(); return keys.map(function(k){return (labels&&labels[k]?labels[k]:k)+': '+obj[k];}).join(' / ');}
  function activeFilterLabel(){var f=FILTERS.filter(function(x){return x.key===state.filter;})[0]; return f?f.label:state.filter;}
  function relationGroups(items){var g=countBy(items,function(it){return it.group||'ungrouped';}); var keys=Object.keys(g).sort(function(a,b){return g[b]-g[a] || a.localeCompare(b);}); return keys.map(function(k){return k+'('+g[k]+')';}).join(', ')||'-';}
  function regionLabel(key){var r=regionDef(key); return r?r.label:key;}
  function itemRegion(id){var found=null; Object.keys(DATA).some(function(region){return (DATA[region]||[]).some(function(it){if(it.id===id){found=region; return true;} return false;});}); return found;}
  function findGlobalItem(id){var found=null, foundRegion=null; Object.keys(DATA).some(function(region){return (DATA[region]||[]).some(function(it){if(it.id===id){found=it; foundRegion=region; return true;} return false;});}); return found?{item:found,region:foundRegion}:null;}
  function bridgePriority(it){return {zone:1,incident:2,anomaly:3,comms:4,'blockade-node':5,blockade:6,facility:7}[it.type]||9;}
  function buildRecordBridgeIndex(){
    var out={};
    Object.keys(DATA).forEach(function(region){
      (DATA[region]||[]).forEach(function(it){
        relatedRecordKeys(it).forEach(function(k){
          var r=RECORD_LIBRARY[k];
          if(!r||!r.record) return;
          (out[r.record]=out[r.record]||[]).push({recordKey:k,region:region,itemId:it.id,name:it.name,type:it.type,zone:it.zone,group:it.group});
        });
      });
    });
    Object.keys(out).forEach(function(recordId){
      var seen={};
      out[recordId]=out[recordId].filter(function(x){var key=x.region+'|'+x.itemId; if(seen[key]) return false; seen[key]=1; return true;}).sort(function(a,b){
        return regionLabel(a.region).localeCompare(regionLabel(b.region),'ko') || bridgePriority(findGlobalItem(a.itemId).item)-bridgePriority(findGlobalItem(b.itemId).item) || String(a.name).localeCompare(String(b.name),'ko');
      });
    });
    return out;
  }
  function getRecordMapLinks(recordId){return (buildRecordBridgeIndex()[recordId]||[]).slice();}
  function mapBridgeButton(link){
    var it=(findGlobalItem(link.itemId)||{}).item||link;
    return '<button type="button" class="r24-map-bridge-link" data-r24-open-map-region="'+esc(link.region)+'" data-r24-open-map-id="'+esc(link.itemId)+'"><b>'+esc(link.name)+'</b><span>'+esc(regionLabel(link.region))+' · '+esc(typeLabel(it))+(it.zone?' · '+esc(zoneLabel(it.zone)):'')+'<i class="r24-map-link-id"> / '+esc(link.itemId)+'</i></span></button>';
  }
  function mountRecordMapBridges(){
    var index=buildRecordBridgeIndex();
    document.querySelectorAll('.record-detail[data-record]').forEach(function(article){
      var recordId=article.getAttribute('data-record');
      var links=index[recordId]||[];
      var old=article.querySelector(':scope > .r24-record-map-bridge');
      if(old) old.remove();
      if(!links.length) return;
      var box=ce('div','r24-record-map-bridge');
      var shown=links.slice(0,18), remain=Math.max(0,links.length-shown.length);
      box.setAttribute('data-r24-map-record',recordId);
      box.innerHTML='<div class="r24-record-map-bridge-head"><b>관련 지도 기록</b><span>'+esc(links.length)+'개 좌표 연결'+(remain?' / 주요 '+shown.length+'개 표시':'')+'</span></div><p>이 문서와 연결된 지도 요소입니다. 버튼을 누르면 지역지도에서 해당 권역과 요소를 바로 엽니다.</p><div class="r24-record-map-bridge-list">'+shown.map(mapBridgeButton).join('')+'</div>'+(remain?'<div class="r24-record-map-bridge-more">추가 연결 '+remain+'개는 지역지도 SELF REVIEW에서 확인하십시오.</div>':'');
      var header=article.querySelector(':scope > header.doc-header');
      if(header&&header.nextSibling) header.parentNode.insertBefore(box,header.nextSibling); else article.insertBefore(box,article.firstChild);
    });
  }
  function handleRecordMapBridgeClick(ev){
    var btn=ev.target&&ev.target.closest?ev.target.closest('[data-r24-open-map-region][data-r24-open-map-id]'):null;
    if(!btn) return;
    ev.preventDefault(); ev.stopPropagation();
    var article=btn.closest('.record-detail');
    openMapItem(btn.getAttribute('data-r24-open-map-region'),btn.getAttribute('data-r24-open-map-id'),{fromRecord:article&&article.dataset?article.dataset.record:null});
  }
  function ensureRecordBridgeListener(){
    if(window.__ProjectCurseR24RecordBridgeBound) return;
    window.__ProjectCurseR24RecordBridgeBound=true;
    document.addEventListener('click',handleRecordMapBridgeClick,true);
    document.addEventListener('click',handleReturnMapFromRecord,true);
  }
  function activeRecordArticles(){
    return Array.prototype.slice.call(document.querySelectorAll('.record-detail[data-record]')).filter(function(a){return !a.hidden;});
  }
  function mountRecordReturnPanels(){
    var ctx=readRouteContext();
    if(!ctx||!ctx.map||!ctx.map.region) return;
    activeRecordArticles().forEach(function(article){
      var recordId=article.getAttribute('data-record');
      if(ctx.record&&recordId!==ctx.record) return;
      var old=article.querySelector(':scope > .r24-record-return-bridge');
      if(old) old.remove();
      var box=ce('div','r24-record-return-bridge');
      var title=ctx.map.title || (ctx.map.selected&&findGlobalItem(ctx.map.selected)&&findGlobalItem(ctx.map.selected).item.name) || '이전 지도 위치';
      box.innerHTML='<div class="r24-record-return-head"><b>지도 복귀 경로</b><span>'+esc(regionLabel(ctx.map.region))+(ctx.map.selected?' / '+esc(ctx.map.selected):'')+'</span></div><p>이 기록을 열기 전 확인하던 지역지도 위치로 되돌아갑니다.</p><button type="button" data-r24-return-map-from-record="1"><b>지역지도 위치로 복귀</b><span>'+esc(title)+'</span></button>';
      var header=article.querySelector(':scope > header.doc-header');
      if(header&&header.nextSibling) header.parentNode.insertBefore(box,header.nextSibling); else article.insertBefore(box,article.firstChild);
    });
  }
  function handleReturnMapFromRecord(ev){
    var btn=ev.target&&ev.target.closest?ev.target.closest('[data-r24-return-map-from-record]'):null;
    if(!btn) return;
    ev.preventDefault(); ev.stopPropagation();
    var ctx=readRouteContext();
    if(ctx&&ctx.map) applyMapSnapshot(ctx.map,{returning:true});
  }
  function openMapItem(region,id,opts){
    opts=opts||{};
    var g=findGlobalItem(id); if(!g) return false;
    region=region||g.region;
    var rec=opts.fromRecord || (currentRecordContext()&&currentRecordContext().record) || null;
    if(rec) saveRouteContext({mode:'record-to-map',record:rec,map:{region:region,selected:id},ts:Date.now()});
    var nav=document.querySelector('.side-menu a[data-target="zone-map"]');
    if(nav&&!nav.classList.contains('active')) nav.click();
    var apply=function(){
      if(!root) build();
      var targetItem=(findGlobalItem(id)||{}).item;
      state.region=region; state.filter=opts.keepFilter||'all'; state.review=typeof opts.keepReview==='boolean'?opts.keepReview:state.review; state.selected=id; state.overlap=null; state.returnRecord=rec; state.zoom=opts.keepZoom||requiredZoomForItem(targetItem)||state.zoom||'base'; state.focus=opts.keepFocus||((state.zoom!=='base'&&state.zoom!=='summary')?'selected':'none'); state.panX=typeof opts.keepPanX==='number'?opts.keepPanX:0; state.panY=typeof opts.keepPanY==='number'?opts.keepPanY:0; invalidatePerfCache();
      render(); saveMapSnapshot({source:opts.returning?'return-map':'record-to-map'});
      if(root){root.classList.add('r24-return-focus'); setTimeout(function(){if(root) root.classList.remove('r24-return-focus');},900); try{root.scrollIntoView({block:'start',behavior:'smooth'});}catch(e){root.scrollIntoView();}}
    };
    setTimeout(apply,nav?430:20);
    setTimeout(apply,nav?560:90);
    return true;
  }
  function reverseBridgeRecordsForItem(it){
    if(!it) return [];
    return relatedRecordKeys(it).map(function(k){var r=RECORD_LIBRARY[k]; return r&&r.record?{key:k,record:r.record,title:r.title}:null;}).filter(Boolean);
  }
  function normalizeRoute(url){
    return String(url||'').replace(/^\.\//,'').replace(/\/+/g,'/').replace(/index\.html$/,'').replace(/([^/])$/,'$1/');
  }
  function recordDomExists(recordId){
    if(!recordId) return false;
    return Array.prototype.some.call(document.querySelectorAll('[data-record]'),function(el){return el.getAttribute('data-record')===String(recordId);});
  }
  function routeKnown(url){
    var route=normalizeRoute(url);
    return !!DOC_ROUTE_WHITELIST[route] || !!document.querySelector('a[href="'+route+'"],a[href="'+route+'index.html"]');
  }
  function auditLinkIntegrity(){
    var warnings=[], notes=[], bridge=buildRecordBridgeIndex(), mapIds={}, totalMapLinks=0, recordLinkTargets=0;
    Object.keys(DATA).forEach(function(region){
      if(!regionDef(region)||region==='world') warnings.push('정의되지 않은 권역 데이터: '+region);
      (DATA[region]||[]).forEach(function(it){
        var key=region+'|'+it.id;
        if(mapIds[it.id]&&mapIds[it.id]!==region) warnings.push('전역 중복 지도 ID: '+it.id+' ('+mapIds[it.id]+' / '+region+')');
        mapIds[it.id]=region;
        var rk=relatedRecordKeys(it);
        if(!rk.length) warnings.push('관련 기록 없음: '+region+'→'+it.id);
        rk.forEach(function(k){
          var r=RECORD_LIBRARY[k];
          if(!r) warnings.push('기록 라이브러리 키 누락: '+it.id+'→'+k);
          else if(r.record&&!recordDomExists(r.record)) warnings.push('문서 ID 미검출: '+it.id+'→'+r.record);
          else if(r.url&&!routeKnown(r.url)) warnings.push('문서 경로 미검출: '+it.id+'→'+r.url);
        });
      });
    });
    Object.keys(RECORD_LIBRARY).forEach(function(k){
      var r=RECORD_LIBRARY[k];
      if(!r.record&&!r.url) warnings.push('기록 대상 없음: '+k);
      if(r.record){recordLinkTargets++; if(!recordDomExists(r.record)) warnings.push('기록 라이브러리 문서 ID 미검출: '+k+'→'+r.record);}
      if(r.url&&!routeKnown(r.url)) warnings.push('기록 라이브러리 문서 경로 미검출: '+k+'→'+r.url);
    });
    Object.keys(bridge).forEach(function(recordId){
      var links=bridge[recordId]||[];
      totalMapLinks+=links.length;
      if(!recordDomExists(recordId)) warnings.push('역방향 브리지 문서 없음: '+recordId);
      links.forEach(function(link){
        if(!regionDef(link.region)||!DATA[link.region]) warnings.push('역방향 브리지 권역 없음: '+recordId+'→'+link.region);
        var found=findGlobalItem(link.itemId);
        if(!found) warnings.push('역방향 브리지 지도 요소 없음: '+recordId+'→'+link.itemId);
        else if(found.region!==link.region) warnings.push('역방향 브리지 권역 불일치: '+recordId+'→'+link.itemId+' ('+link.region+' / '+found.region+')');
      });
    });
    document.querySelectorAll('[data-r24-open-map-region][data-r24-open-map-id]').forEach(function(btn){
      var region=btn.getAttribute('data-r24-open-map-region'), id=btn.getAttribute('data-r24-open-map-id'), found=findGlobalItem(id);
      if(!found) warnings.push('문서 버튼 지도 요소 없음: '+id);
      else if(found.region!==region) warnings.push('문서 버튼 권역 불일치: '+id+' ('+region+' / '+found.region+')');
    });
    if(!warnings.length) notes.push('지도↔문서 연결 정상');
    return {ok:!warnings.length,warnings:warnings,notes:notes,recordTargets:recordLinkTargets,bridgeRecords:Object.keys(bridge).length,mapLinks:totalMapLinks};
  }
  function fmtLinkAudit(audit){
    if(!audit) audit=auditLinkIntegrity();
    return audit.ok?'정상 · 문서 '+audit.recordTargets+'개 / 역방향 문서 '+audit.bridgeRecords+'개 / 지도 링크 '+audit.mapLinks+'개':'경고 '+audit.warnings.length+'건 · '+audit.warnings.slice(0,4).join(' / ')+(audit.warnings.length>4?' / ...':'');
  }
  function auditPrecisionLayer(){
    var warnings=[], notes=[], regionKeys=REGIONS.filter(function(r){return r.key!=='world';}).map(function(r){return r.key;}), totals={all:0,base:0,zoom:0,precision:0}, modeTotals={}, currentVisible=getVisibleItems();
    ['summary','base','zoom','precision'].forEach(function(mode){modeTotals[mode]=0;});
    regionKeys.forEach(function(region){
      var items=DATA[region]||[], counts=detailCounts(items);
      totals.all+=items.length; totals.base+=counts.base; totals.zoom+=counts.zoom; totals.precision+=counts.precision;
      ['summary','base','zoom','precision'].forEach(function(mode){modeTotals[mode]+=visibleItemsForMode(region,'all',mode).length;});
      var summaryLeaks=items.filter(function(it){return it.detail && detailVisibleInMode(it,'summary');});
      if(summaryLeaks.length) warnings.push(regionDef(region).label+' 요약 보기 정밀/확대 요소 노출: '+summaryLeaks.map(function(it){return it.id;}).slice(0,4).join(', '));
      var baseLeaks=items.filter(function(it){return it.detail && detailVisibleInMode(it,'base');});
      if(baseLeaks.length) warnings.push(regionDef(region).label+' 기본 보기 정밀/확대 요소 노출: '+baseLeaks.map(function(it){return it.id;}).slice(0,4).join(', '));
      var zoomHidden=items.filter(function(it){return it.detail==='zoom'&&!detailVisibleInMode(it,'zoom');});
      if(zoomHidden.length) warnings.push(regionDef(region).label+' 확대 전용 요소가 확대 보기에서 숨김: '+zoomHidden.map(function(it){return it.id;}).slice(0,4).join(', '));
      var precisionHidden=items.filter(function(it){return it.detail==='precision'&&!detailVisibleInMode(it,'precision');});
      if(precisionHidden.length) warnings.push(regionDef(region).label+' 정밀 전용 요소가 정밀 보기에서 숨김: '+precisionHidden.map(function(it){return it.id;}).slice(0,4).join(', '));
    });
    if(PRECISION_LAYER.addedItems && PRECISION_LAYER.addedItems!==(totals.zoom+totals.precision)) warnings.push('정밀 레이어 메타데이터 추가 수 불일치: '+PRECISION_LAYER.addedItems+' / 실제 '+(totals.zoom+totals.precision));
    if(!PRECISION_AUDIT_HOTFIX.version) warnings.push('R46 정밀 레이어 검수 메타데이터 누락');
    notes.push('전체 '+totals.all+'개 / 기본 '+totals.base+'개 / 확대 전용 '+totals.zoom+'개 / 정밀 전용 '+totals.precision+'개');
    notes.push('요약 '+modeTotals.summary+'개 / 기본 '+modeTotals.base+'개 / 확대 '+modeTotals.zoom+'개 / 정밀 '+modeTotals.precision+'개 표시 기준');
    notes.push('현재 '+regionLabel(state.region)+' '+activeFilterLabel()+' 표시 '+currentVisible.length+'개 / 정밀 계열 '+currentVisible.filter(function(it){return !!it.detail;}).length+'개');
    return {ok:!warnings.length,warnings:warnings,notes:notes,totals:totals,modeTotals:modeTotals,currentVisible:currentVisible.length,currentDetailVisible:currentVisible.filter(function(it){return !!it.detail;}).length};
  }
  function fmtPrecisionAudit(audit){
    if(!audit) audit=auditPrecisionLayer();
    return audit.ok?'정상 · 전체 '+audit.totals.all+'개 / 확대전용 '+audit.totals.zoom+'개 / 정밀전용 '+audit.totals.precision+'개':'경고 '+audit.warnings.length+'건 · '+audit.warnings.slice(0,4).join(' / ')+(audit.warnings.length>4?' / ...':'');
  }

  function auditReleaseCandidate(){
    var warnings=[], notes=[];
    var linkAudit=auditLinkIntegrity();
    var precisionAudit=auditPrecisionLayer();
    if(!linkAudit.ok) warnings.push('LINK AUDIT 경고 '+linkAudit.warnings.length+'건');
    if(!precisionAudit.ok) warnings.push('PRECISION LAYER 경고 '+precisionAudit.warnings.length+'건');
    if(WORLD_BUTTONS.length!==8) warnings.push('권역 버튼 수 불일치: '+WORLD_BUTTONS.length);
    if(!DATA_MODULE || !DATA_MODULE.DATA) warnings.push('지도 데이터 모듈 누락');
    if(!SUMMARY_MODULE || !SUMMARY_MODULE.REGION_INFO) warnings.push('권역 요약 데이터 모듈 누락');
    if(!LINK_MODULE || !LINK_MODULE.RECORD_LIBRARY) warnings.push('기록 연결 데이터 모듈 누락');
    if(!VISUAL_HOTFIX.version) warnings.push('R43 확장 시각 보정 메타데이터 누락');
    if(!ZOOM_MODES || ZOOM_MODES.length!==4) warnings.push('상세 보기 배율 정의 불일치');
    if(!PRECISION_LAYER.version) warnings.push('R45 정밀 콘텐츠 레이어 메타데이터 누락');
    if(!PRECISION_AUDIT_HOTFIX.version) warnings.push('R46 정밀 레이어 검수 메타데이터 누락');
    var regionKeys=REGIONS.filter(function(r){return r.key!=='world';}).map(function(r){return r.key;});
    if(regionKeys.length!==8) warnings.push('상세 권역 수 불일치: '+regionKeys.length);
    regionKeys.forEach(function(key){
      var items=DATA[key]||[];
      if(!items.length) warnings.push('권역 데이터 없음: '+key);
      var q=qaWarnings(items);
      if(q.length) warnings.push(regionDef(key).label+' 자동 점검: '+q.join(' / '));
      var hasZone=items.some(function(it){return it.type==='zone';});
      var hasLine=items.some(function(it){return it.type==='blockade';});
      var hasNode=items.some(function(it){return it.type==='blockade-node';});
      if(!hasZone) warnings.push(regionDef(key).label+' 오염 구역 없음');
      if(!hasLine) warnings.push(regionDef(key).label+' 봉쇄선 없음');
      if(!hasNode) warnings.push(regionDef(key).label+' 봉쇄 거점 없음');
    });
    var filterOrder=FILTERS.map(function(f){return f.key;}).join(',');
    var expected='all,zone,zone-red,zone-yellow,zone-green,zone-white,zone-black,facility,anomaly,incident,blockade-node,blockade,review';
    if(filterOrder!==expected) warnings.push('필터 순서 불일치');
    if(!INDEX_FILTERS.some(function(f){return f.key==='relation';})) warnings.push('관계권 색인 누락');
    if(document.querySelector('.continental-map-shell,.continent-panel,.continent-filter,[data-map-item]')) warnings.push('구형 지도 DOM 잔재 감지');
    if(!document.querySelector('#zone-map .uac-r24-regional-map')) warnings.push('R24+ 지도 모듈 DOM 미검출');
    notes.push('릴리즈 후보 체크 '+RELEASE_CHECKS.length+'개 기준');
    notes.push('필터 '+FILTERS.length+'개 / 색인 '+INDEX_FILTERS.length+'개 / 권역 '+regionKeys.length+'개');
    notes.push('상세 보기 배율 '+ZOOM_MODES.length+'개 / 세계지도 줌 비활성 기준');
    notes.push('정밀 레이어 검수: '+fmtPrecisionAudit(precisionAudit));
    return {ok:!warnings.length,warnings:warnings,notes:notes,checks:RELEASE_CHECKS.slice(),regions:regionKeys.length,filters:FILTERS.length,indexFilters:INDEX_FILTERS.length,linkAudit:linkAudit,precisionAudit:precisionAudit};
  }
  function fmtReleaseAudit(audit){
    if(!audit) audit=auditReleaseCandidate();
    return audit.ok?'정상 · 권역 '+audit.regions+'개 / 필터 '+audit.filters+'개 / 색인 '+audit.indexFilters+'개':'경고 '+audit.warnings.length+'건 · '+audit.warnings.slice(0,4).join(' / ')+(audit.warnings.length>4?' / ...':'');
  }
  function auditFinalHotfixReadiness(seed){
    seed=seed||{};
    var linkAudit=seed.linkAudit||auditLinkIntegrity();
    var releaseAudit=seed.releaseAudit||auditReleaseCandidate();
    var precisionAudit=seed.precisionAudit||auditPrecisionLayer();
    var regionItems=seed.regionItems||getRegionItems(state.region);
    var visible=seed.visible||getVisibleItems();
    var indexRows=buildIndexRowsCached();
    var warnings=[], notes=[];
    if(state.region!=='world'){
      qaWarnings(regionItems).forEach(function(w){warnings.push('자동 점검: '+w);});
      if(!visible.length) warnings.push('표시 요소 없음: '+regionDef(state.region).label+' / '+activeFilterLabel());
    } else {
      if(WORLD_BUTTONS.length!==8) warnings.push('세계 권역 버튼 수 불일치: '+WORLD_BUTTONS.length);
    }
    if(!linkAudit.ok) linkAudit.warnings.forEach(function(w){warnings.push('LINK AUDIT: '+w);});
    if(!precisionAudit.ok) precisionAudit.warnings.forEach(function(w){warnings.push('PRECISION LAYER: '+w);});
    if(!releaseAudit.ok) releaseAudit.warnings.forEach(function(w){
      if(w.indexOf('LINK AUDIT')===0) return;
      if(w.indexOf('자동 점검:')!==-1) return;
      warnings.push('RELEASE CANDIDATE: '+w);
    });
    if(!INDEX_FILTERS.length) warnings.push('RECORD INDEX: 색인 필터 없음');
    if(state.region!=='world' && !indexRows.length) warnings.push('RECORD INDEX: 현재 조건 항목 없음');
    if(document.querySelector('.continental-map-shell,.continent-panel,.continent-filter,[data-map-item]')) warnings.push('LEGACY DOM: 구형 지도 잔재 감지');
    notes.push('검수 리포트 요약 압축 기준 적용');
    notes.push('문제 항목은 상단 문제 목록에 우선 출력');
    notes.push('최종 확인 항목: 자동 점검 / LINK AUDIT / RECORD INDEX / RELEASE CANDIDATE');
    notes.push('R42 성능·색인 정리 기준 적용');
    notes.push('색인 캐시/표시 제한/후보 메뉴 압축 기준 적용');
    if(VISUAL_HOTFIX.version) notes.push('R43 확장 시각 보정 기준 적용');
    notes.push('R44 상세지도 전용 확대·초점 보기 기준 적용');
    if(PRECISION_LAYER.version) notes.push('R45 정밀 콘텐츠 레이어 기준 적용');
    if(PRECISION_AUDIT_HOTFIX.version) notes.push('R46 정밀 레이어 검수·표시 단계 점검 기준 적용');
    return {ok:!warnings.length,warnings:warnings,notes:notes,linkAudit:linkAudit,releaseAudit:releaseAudit,precisionAudit:precisionAudit,indexRows:indexRows.length,visible:visible.length,total:regionItems.length,region:state.region,filter:state.filter};
  }
  function fmtFinalReadiness(audit){
    if(!audit) audit=auditFinalHotfixReadiness();
    return audit.ok?'정상 · 경고 0건 / 색인 '+audit.indexRows+'개 / 표시 '+audit.visible+'/'+audit.total:'경고 '+audit.warnings.length+'건 · '+audit.warnings.slice(0,4).join(' / ')+(audit.warnings.length>4?' / ...':'');
  }
  function makeFinalHotfixReadinessReport(){
    var audit=auditFinalHotfixReadiness();
    var lines=[];
    lines.push('[U.A.C 지역지도 상세 보기·최종 점검 리포트]');
    lines.push('버전: '+VERSION);
    lines.push('[요약]');
    lines.push('상태: '+(audit.ok?'정상':'경고'));
    lines.push('경고: '+audit.warnings.length+'건');
    lines.push('권역/필터: '+regionDef(state.region).label+' ('+state.region+') / '+activeFilterLabel()+' ('+state.filter+')');
    lines.push('상세 보기: '+zoomLabel()+' / '+(state.focus==='relation'?'관계권 중심':state.focus==='selected'?'선택 중심':'전체'));
    lines.push('정밀 레이어: '+(PRECISION_LAYER.version?('활성 · 추가 '+(PRECISION_LAYER.addedItems||0)+'개'):'없음'));
    lines.push('표시/전체: '+audit.visible+' / '+audit.total);
    lines.push('LINK AUDIT: '+fmtLinkAudit(audit.linkAudit));
    lines.push('RECORD INDEX: '+indexKindLabel(activeIndexKind())+' / 검색어 '+(state.indexQuery||'-')+' / 항목 '+audit.indexRows);
    lines.push('RELEASE CANDIDATE: '+fmtReleaseAudit(audit.releaseAudit));
    lines.push('PRECISION LAYER: '+fmtPrecisionAudit(audit.precisionAudit));
    lines.push('성능/색인: 캐시 '+Object.keys(PERF.indexCache).length+'개 / 기본 표시 제한 '+PERF.maxDefaultRows+'개 / 검색 표시 제한 '+PERF.maxSearchRows+'개');
    lines.push('확장 시각 보정: '+(VISUAL_HOTFIX.version?VISUAL_HOTFIX.version:'메타데이터 없음'));
    lines.push('문제 목록: '+(audit.warnings.length?audit.warnings.join(' / '):'없음'));
    lines.push('검수 메모: '+audit.notes.join(' / '));
    return lines.join('\n');
  }
  function qaWarnings(regionItems){var warnings=[]; var ids={}; regionItems.forEach(function(it){if(ids[it.id]) warnings.push('중복 ID: '+it.id); ids[it.id]=1; if(!it.group) warnings.push('관계권 누락: '+it.id); if(!it.name) warnings.push('이름 누락: '+it.id); if(!it.status) warnings.push('상태 설명 누락: '+it.id);}); var byGroup={}; regionItems.forEach(function(it){var g=it.group||'ungrouped'; (byGroup[g]=byGroup[g]||[]).push(it);}); Object.keys(byGroup).forEach(function(g){var arr=byGroup[g], hasBlockade=arr.some(function(x){return x.type==='blockade';}), hasGate=arr.some(function(x){return x.type==='blockade-node';}), loneZone=arr.length===1&&arr[0].type==='zone', loneZoneKind=loneZone&&arr[0].zone; if(hasBlockade&&!hasGate) warnings.push('봉쇄선은 있으나 봉쇄 거점 없음: '+g); if(hasGate&&!hasBlockade) warnings.push('봉쇄 거점은 있으나 봉쇄선 없음: '+g); if(g!=='ungrouped'&&loneZone&&(loneZoneKind==='red'||loneZoneKind==='black')) warnings.push('단독 위험 존 관계권 확인 필요: '+g);}); return warnings;
  }
  function makeSelfReviewReport(){
    var r=regionDef(state.region), regionItems=getRegionItems(state.region), visible=getVisibleItems(), hidden=state.region==='world'?0:Math.max(0,regionItems.length-visible.length), selected=findItem(state.selected), typeLabels={zone:'오염 구역',facility:'작전 시설',anomaly:'현상 기록',incident:'사건 좌표','blockade-node':'봉쇄 거점',blockade:'봉쇄선',comms:'통신'};
    var zoneLabels={red:'레드존',yellow:'옐로우존',green:'그린존',white:'화이트존',black:'블랙존'};
    var lines=[];
    lines.push('[U.A.C 지역지도 자체 검수 리포트]');
    lines.push('버전: '+VERSION);
    var linkAudit=auditLinkIntegrity();
    var releaseAudit=auditReleaseCandidate();
    var precisionAudit=auditPrecisionLayer();
    var finalAudit=auditFinalHotfixReadiness({linkAudit:linkAudit,releaseAudit:releaseAudit,precisionAudit:precisionAudit,regionItems:regionItems,visible:visible});
    lines.push('[요약]');
    lines.push('상태: '+(finalAudit.ok?'정상':'경고')+' / 경고 '+finalAudit.warnings.length+'건');
    lines.push('LINK AUDIT: '+(linkAudit.ok?'정상':'경고 '+linkAudit.warnings.length+'건')+' / RECORD INDEX: '+buildIndexRows().length+'개 / RELEASE CANDIDATE: '+(releaseAudit.ok?'정상':'경고 '+releaseAudit.warnings.length+'건')+' / PRECISION: '+(precisionAudit.ok?'정상':'경고 '+precisionAudit.warnings.length+'건'));
    if(finalAudit.warnings.length) lines.push('문제 목록: '+finalAudit.warnings.join(' / '));
    lines.push('권역: '+r.label+' ('+state.region+')');
    lines.push('필터: '+activeFilterLabel()+' ('+state.filter+')');
    lines.push('상세 보기: '+zoomLabel()+' ('+state.zoom+') / '+(state.focus==='relation'?'관계권 중심':state.focus==='selected'?'선택 중심':'전체'));
    lines.push('정밀 레이어: '+(PRECISION_LAYER.version?('활성 / 추가 '+(PRECISION_LAYER.addedItems||0)+'개 / 현재 표시 '+visible.filter(function(it){return !!it.detail;}).length+'개 / '+fmtPrecisionAudit(precisionAudit)):'메타데이터 없음'));
    lines.push('검수 모드: '+(state.review?'ON':'OFF'));
    lines.push('색인: '+indexKindLabel(activeIndexKind())+' / 검색어 '+(state.indexQuery||'-')+' / 항목 '+buildIndexRowsCached().length);
    lines.push('선택 요소: '+(selected?(selected.name+' / '+selected.id+' / 관계권 '+(selected.group||'-')):'없음'));
    var navCtx=readRouteContext();
    if(navCtx&&navCtx.mode) lines.push('이동 흐름: '+navCtx.mode+(navCtx.record?' / 기록 '+navCtx.record:'')+(navCtx.map&&navCtx.map.selected?' / 지도 '+navCtx.map.selected:''));
    lines.push('링크 무결성: '+fmtLinkAudit(linkAudit));
    if(linkAudit.warnings.length) lines.push('링크 경고: '+linkAudit.warnings.join(' / '));
    lines.push('릴리즈 후보 점검: '+fmtReleaseAudit(releaseAudit));
    lines.push('정밀 레이어 점검: '+fmtPrecisionAudit(precisionAudit));
    lines.push('최종 준비 점검: '+fmtFinalReadiness(finalAudit));
    lines.push('성능/색인 점검: 캐시 '+Object.keys(PERF.indexCache).length+'개 / 표시 제한 '+indexDisplayLimit(activeIndexKind(),buildIndexRowsCached())+'개 / 현재 항목 '+buildIndexRowsCached().length+'개');
    if(releaseAudit.warnings.length) lines.push('릴리즈 후보 경고: '+releaseAudit.warnings.join(' / '));
    if(selected){ lines.push('연결 기록: '+relatedRecordKeys(selected).map(function(k){var r=RECORD_LIBRARY[k]; return r.title+'['+(r.code||r.record||r.url||k)+']';}).join(' / ')); var rev=reverseBridgeRecordsForItem(selected); lines.push('역방향 지도 링크: '+(rev.length?rev.map(function(x){return x.record+'→'+selected.id;}).join(' / '):'내부 기록 브리지 없음')); }
    if(state.overlap&&state.overlap.ids&&state.overlap.ids.length>1){lines.push('겹친 선택 후보: '+state.overlap.ids.map(function(id){var oi=findItem(id); return oi?(oi.name+'['+id+']'):id;}).join(' / '));}
    if(state.region==='world'){
      lines.push('세계지도 상태: 권역 선택 전용 / 데이터 레이어 없음 / 필터 숨김');
      lines.push('권역 버튼 수: '+WORLD_BUTTONS.length);
      lines.push('검수 포인트: 버튼 위치, 지도 크롭, 양옆 여백, 권역 이동 여부');
      return lines.join('\n');
    }
    lines.push('요소 수: 전체 '+regionItems.length+' / 표시 '+visible.length+' / 숨김 '+hidden);
    lines.push('표시 유형: '+fmtCounts(countBy(visible,function(it){return it.type;}),typeLabels));
    lines.push('표시 존: '+fmtCounts(countBy(visible.filter(function(it){return it.type==='zone';}),function(it){return it.zone;}),zoneLabels));
    lines.push('관계권: '+relationGroups(visible));
    var warnings=qaWarnings(regionItems);
    lines.push('자동 점검: '+(warnings.length?warnings.join(' / '):'중복 ID·기본 필드 누락 없음'));
    lines.push('검수 포인트: 배치 관계성, 존 크기 차등, 봉쇄선 방향·곡률, 코드 라벨 일반 화면 비노출, 필터 결과 확인');
    return lines.join('\n');
  }
  function renderSelfReview(forceReport){
    if(!els.selfMetrics) return;
    var regionItems=getRegionItems(state.region), visible=getVisibleItems(), selected=findItem(state.selected), zoneCount=visible.filter(function(it){return it.type==='zone';}).length, lineCount=visible.filter(function(it){return it.type==='blockade';}).length;
    var linkAudit=auditLinkIntegrity();
    var releaseAudit=auditReleaseCandidate();
    var precisionAudit=auditPrecisionLayer();
    var finalAudit=auditFinalHotfixReadiness({linkAudit:linkAudit,releaseAudit:releaseAudit,precisionAudit:precisionAudit,regionItems:regionItems,visible:visible});
    els.reviewState.textContent=state.region==='world'?'WORLD':(state.review?'REVIEW ON':'OPS VIEW');
    if(root){root.classList.toggle('r24-link-audit-warning',!linkAudit.ok); root.classList.toggle('r24-release-audit-warning',!releaseAudit.ok); root.classList.toggle('r24-final-audit-warning',!finalAudit.ok);}
    els.selfMetrics.innerHTML='<span><b>권역</b>'+esc(regionDef(state.region).label)+'</span><span><b>필터</b>'+esc(activeFilterLabel())+'</span><span><b>상세 보기</b>'+esc(zoomLabel()+'/'+(state.focus==='relation'?'관계권':state.focus==='selected'?'선택':'전체'))+'</span><span><b>색인</b>'+esc(indexKindLabel(activeIndexKind()))+'</span><span><b>표시/전체</b>'+visible.length+'/'+regionItems.length+'</span><span><b>존/선</b>'+zoneCount+'/'+lineCount+'</span><span><b>선택</b>'+esc(selected?selected.id:'-')+'</span><span><b>문서↔지도</b>'+esc(selected?reverseBridgeRecordsForItem(selected).length+'개':'-')+'</span><span><b>링크 점검</b>'+esc(linkAudit.ok?'정상':linkAudit.warnings.length+'건')+'</span><span><b>RC 점검</b>'+esc(releaseAudit.ok?'정상':releaseAudit.warnings.length+'건')+'</span><span><b>최종</b>'+esc(finalAudit.ok?'정상':finalAudit.warnings.length+'건')+'</span><span><b>색인 캐시</b>'+Object.keys(PERF.indexCache).length+'</span><span><b>정밀 표시</b>'+visible.filter(function(it){return !!it.detail;}).length+'</span><span><b>정밀 점검</b>'+esc(precisionAudit.ok?'정상':precisionAudit.warnings.length+'건')+'</span><span><b>복귀 기록</b>'+esc(state.returnRecord||'-')+'</span>';
    if(els.linkAudit) els.linkAudit.innerHTML='<b>FINAL CHECK</b><span class="'+(finalAudit.ok?'ok':'warn')+'">'+esc(fmtFinalReadiness(finalAudit))+'<br>LINK '+esc(linkAudit.ok?'정상':linkAudit.warnings.length+'건')+' · RC '+esc(releaseAudit.ok?'정상':releaseAudit.warnings.length+'건')+' · PRECISION '+esc(precisionAudit.ok?'정상':precisionAudit.warnings.length+'건')+'</span>';
    if(forceReport||(!els.reportText.value&&state.region!=='world')) els.reportText.value=makeSelfReviewReport();
  }
  function copySelfReviewReport(){
    if(!els.reportText) return;
    if(!els.reportText.value) els.reportText.value=makeSelfReviewReport();
    els.reportText.focus(); els.reportText.select();
    var done=function(ok){if(els.reviewState) els.reviewState.textContent=ok?'COPIED':'COPY READY';};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(els.reportText.value).then(function(){done(true);}).catch(function(){try{document.execCommand('copy'); done(true);}catch(e){done(false);}});} else {try{document.execCommand('copy'); done(true);}catch(e){done(false);}}
  }

  function resetToWorld(){
    state.region='world';
    state.filter='all';
    state.review=false;
    state.selected=null;
    state.overlap=null;
    state.returnRecord=null;
    state.zoom='base';
    state.focus='none';
    render();
  }




  /* R52 — TacticalDisplayDecongestionPass
     - Decongests R51 tactical overlay after visual review screenshots.
     - General operations view now hides internal BARRIER/OP-GROUP labels, keeps mini card for zoom 5,
       reduces marker/icon weight, and moves heavy self-review/final/visible-node lists to review mode.
     - Review mode still exposes technical labels and full reports. */
  VERSION='5.8.1R-52 TacticalDisplayDecongestionPass';
  if(RELEASE_CHECKS.indexOf('tactical-display-decongestion-pass')===-1) RELEASE_CHECKS.push('tactical-display-decongestion-pass');
  var TACTICAL_DISPLAY_DECONGESTION=DATA_MODULE.TACTICAL_DISPLAY_DECONGESTION||{version:VERSION};

  function reviewOrZoom5(){return !!state.review || zoomLevel(state.zoom)>=5;}
  function blockadeDisplayLabel(it){
    var v=String((it&&it.variant)||'line');
    if(/port/.test(v)) return '항만 차단';
    if(/sea-route|route/.test(v)) return '해상 차단 항로';
    if(/sea|watch/.test(v)) return '해상 감시선';
    if(/land|contour/.test(v)) return '육상 봉쇄선';
    if(/city|urban/.test(v)) return '도시 차단선';
    return '봉쇄선';
  }
  function shouldShowBlockadeMapTag(it){
    if(state.region==='world') return false;
    if(state.review) return zoomLevel(state.zoom)>=3;
    return state.selected===it.id && zoomLevel(state.zoom)>=5;
  }
  function shouldZoomLabel(it){
    if(state.region==='world'||!state.selected) return false;
    var lv=zoomLevel(state.zoom), sel=findItem(state.selected);
    if(!sel) return false;
    if(state.review) return lv>=5 && itemDisplayMode(it)==='full';
    return it.id===sel.id && lv>=5;
  }
  function indexDisplayLimit(kind,rows){
    if(state.review){
      if(state.indexQuery) return PERF.maxSearchRows;
      if(kind==='all' && state.region==='world') return PERF.maxDefaultRows;
      if(kind==='relation') return PERF.maxFilteredRows;
      return PERF.maxFilteredRows;
    }
    if(state.indexQuery) return 14;
    if(kind==='relation') return 6;
    if(kind==='all' && state.region==='world') return 8;
    return 5;
  }
  function renderTacticalRelationOverlay(){
    if(state.region==='world'||!state.selected) return;
    var lv=zoomLevel(state.zoom);
    if(!state.review && lv<4) return;
    var sel=findItem(state.selected), items=relationItemsForSelected();
    if(!sel||!sel.group||items.length<2) return;
    var b=tacticalBounds(items); if(!b) return;
    var g=se('g',{class:'r51-relation-overlay r52-decongested-relation r51-card-status-'+cardStatusKey(sel),'data-r51-group':sel.group});
    g.appendChild(se('rect',{x:b.x1.toFixed(1),y:b.y1.toFixed(1),width:b.w.toFixed(1),height:b.h.toFixed(1),rx:Math.min(30,Math.max(10,b.w*.06)).toFixed(1),class:'r51-relation-ring'}));
    if(state.review || lv>=5){
      var anchors=items.map(function(it){return {it:it,p:itemAnchor(it)};}).filter(function(x){return !!x.p;}).slice(0,state.review?14:6);
      anchors.forEach(function(x){g.appendChild(se('line',{x1:b.cx.toFixed(1),y1:b.cy.toFixed(1),x2:x.p[0].toFixed(1),y2:x.p[1].toFixed(1),class:'r51-relation-trace'}));});
    }
    if(state.review || lv>=5){
      var tag=se('text',{x:clamp(b.x1+10,20,VIEW.w-220).toFixed(1),y:clamp(b.y1-10,24,VIEW.h-20).toFixed(1),class:'r51-relation-tag'});
      tag.textContent=state.review?('OP-GROUP / '+sel.group+' / '+items.length+' nodes'):('관계권 / '+shortLabel(sel.group,18));
      g.appendChild(tag);
    }
    els.svg.appendChild(g);
  }
  function renderTacticalInfoCard(){
    if(state.region==='world'||!state.selected) return;
    var lv=zoomLevel(state.zoom);
    if(!state.review && lv<5) return;
    var it=findItem(state.selected); if(!it) return;
    var p=itemAnchor(it); if(!p) return;
    var w=state.review?230:208, h=state.review?64:50;
    var x=clamp(p[0]+24,14,VIEW.w-w-14), y=clamp(p[1]-70,16,VIEW.h-h-16);
    var g=se('g',{class:'r51-mini-card r52-mini-card r51-card-status-'+cardStatusKey(it),transform:'translate('+x.toFixed(1)+' '+y.toFixed(1)+')'});
    g.appendChild(se('rect',{x:0,y:0,width:w,height:h,rx:4,class:'r51-mini-card-bg'}));
    g.appendChild(se('line',{x1:8,y1:20,x2:w-8,y2:20,class:'r51-mini-card-rule'}));
    var t1=se('text',{x:10,y:14,class:'r51-mini-card-title'}); t1.textContent=shortLabel(it.name,state.review?26:22); g.appendChild(t1);
    var t2=se('text',{x:10,y:35,class:'r51-mini-card-meta'}); t2.textContent=typeLabel(it)+(it.zone?' / '+zoneLabel(it.zone):'')+(it.group?' / '+shortLabel(it.group,12):''); g.appendChild(t2);
    if(state.review){var t3=se('text',{x:10,y:51,class:'r51-mini-card-meta'}); t3.textContent='ZOOM '+itemZoomMin(it)+'+ / '+(relatedRecordKeys(it).length||0)+' REC / '+it.id; g.appendChild(t3);}
    else {var t4=se('text',{x:10,y:47,class:'r51-mini-card-meta'}); t4.textContent='줌 '+itemZoomMin(it)+'+ / 관련 기록 '+(relatedRecordKeys(it).length||0); g.appendChild(t4);}
    els.svg.appendChild(g);
  }
  function renderBlockade(it){
    var pts=it.points||[], d=curvePath(state.region,pts); if(!d) return;
    var g=se('g',{class:'r24-item r24-blockade r52-blockade r24-blockade-'+(it.variant||'line')+' r24-line-scale-'+(it.scale||'medium')+' r45-detail-'+(it.detail||'base')+groupClass(it)+tacticalPriorityClass(it),tabindex:'0','data-id':it.id});
    var path=se('path',{d:d,class:'r24-blockade-line'}), back=se('path',{d:d,class:'r24-blockade-back'}); g.appendChild(back); g.appendChild(path);
    if(state.review || zoomLevel(state.zoom)>=4 || /sea|route/.test(it.variant||'')) path.setAttribute('marker-end','url(#r51-arrow-end)');
    var xyMid=middlePoint(state.region,pts); addBlockadeTicks(g,pts,it.variant);
    if((state.review || zoomLevel(state.zoom)>=4 || state.selected===it.id) && pts.length>=2){
      var a=xy(state.region,pts[0][0],pts[0][1]), b=xy(state.region,pts[pts.length-1][0],pts[pts.length-1][1]);
      g.appendChild(se('circle',{cx:a[0].toFixed(1),cy:a[1].toFixed(1),r:state.review?4.8:4.1,class:'r51-blockade-cap start'}));
      g.appendChild(se('circle',{cx:b[0].toFixed(1),cy:b[1].toFixed(1),r:state.review?5.8:5.0,class:'r51-blockade-cap end'}));
    }
    if(xyMid && shouldShowBlockadeMapTag(it)){
      var tag=se('text',{x:(xyMid[0]+9).toFixed(1),y:(xyMid[1]-12).toFixed(1),class:'r51-blockade-tag r52-blockade-tag'});
      tag.textContent=state.review?('BARRIER / '+(it.variant||'line')):blockadeDisplayLabel(it);
      g.appendChild(tag);
    }
    bindItem(g,it); els.svg.appendChild(g); if(state.review && xyMid) addReviewLabel(g,it,xyMid[0]+10,xyMid[1]-10); if(xyMid) addZoomLabel(g,it,xyMid[0]+12,xyMid[1]+18);
  }
  function renderPoint(it){
    var p=xy(state.region,it.lon,it.lat), x=p[0], y=p[1], g=se('g',{class:'r24-item r24-point r52-point r24-'+it.type+' r24-scale-'+(it.scale||'medium')+' r45-detail-'+(it.detail||'base')+groupClass(it)+tacticalPriorityClass(it),tabindex:'0','data-id':it.id,transform:'translate('+x.toFixed(1)+' '+y.toFixed(1)+')'});
    var sc={small:.68,medium:.82,mid:.88,large:1.02,xlarge:1.12}[it.scale]||.82;
    var selected=state.selected===it.id;
    if(state.review || selected || zoomLevel(state.zoom)>=4) g.appendChild(se('circle',{cx:0,cy:0,r:(17*sc).toFixed(1),class:'r51-priority-ring'}));
    if(it.type==='facility') drawFacility(g,sc); else if(it.type==='blockade-node') drawGate(g,sc); else if(it.type==='incident') drawIncident(g,sc); else if(it.type==='anomaly') drawAnomaly(g,sc,it.scale); else if(it.type==='comms') drawComms(g,sc,it.scale);
    if((state.review || zoomLevel(state.zoom)>=5) && (it.type==='facility'||it.type==='blockade-node')) g.appendChild(se('path',{d:'M -18 0 L -12 0 M 12 0 L 18 0 M 0 -18 L 0 -12 M 0 12 L 0 18',class:'r51-crosshair'}));
    bindItem(g,it); els.svg.appendChild(g); if(state.review) addReviewLabel(g,it,16,-14,true); addZoomLabel(g,it,17,21,true);
  }
  function renderZoomDot(it){
    var p=itemAnchor(it); if(!p) return;
    var cls='r24-item r47-zoom-dot r52-zoom-dot r47-dot-'+it.type+' r47-stage-min-'+itemZoomMin(it)+groupClass(it)+tacticalPriorityClass(it);
    var g=se('g',{class:cls,tabindex:'0','data-id':it.id,transform:'translate('+p[0].toFixed(1)+' '+p[1].toFixed(1)+')'});
    var r={core:5.1,primary:4.7,standard:4.2,support:3.7}[tacticalPriority(it)]||4.2;
    g.appendChild(se('circle',{cx:0,cy:0,r:r,class:'r47-dot-core'}));
    if(it.type==='blockade'||it.type==='blockade-node') g.appendChild(se('line',{x1:-6,y1:0,x2:6,y2:0,class:'r47-dot-line'}));
    if(it.type==='incident') g.appendChild(se('path',{d:'M 0 -6 L 5.5 5 L -5.5 5 Z',class:'r47-dot-shape'}));
    if((state.review||state.selected===it.id) && tacticalPriority(it)==='core') g.appendChild(se('circle',{cx:0,cy:0,r:(r+4).toFixed(1),class:'r51-dot-halo'}));
    bindItem(g,it); els.svg.appendChild(g); if(state.review && zoomLevel(state.zoom)>=5) addReviewLabel(g,it,8,-8,true); if(shouldZoomLabel(it)) addZoomLabel(g,it,10,16,true);
  }
  function renderZoomControls(){
    if(!els.zoomControls) return;
    if(state.region==='world'){els.zoomControls.hidden=true; els.zoomControls.innerHTML=''; return;}
    var selected=findItem(state.selected), canSelected=!!selected, canRelation=!!(selected&&selected.group);
    els.zoomControls.hidden=false;
    var zdef=zoomModeDef(state.zoom), panText=panStateLabel();
    els.zoomControls.innerHTML='<div class="r44-control-head r48-control-head r50-control-head r51-control-head r52-control-head"><b>TACTICAL ZOOM</b><span>현재: '+esc(zoomLabel())+' · '+esc(zdef.summary||'')+'</span></div><div class="r50-operating-state r52-operating-state"><b>조작</b><span>휠 확대/축소 · '+esc(canPanDetailMap()?'드래그 가능':'전체 고정')+' · '+esc(panText)+'</span></div><div class="r44-zoom-row r47-zoom-row r52-zoom-row">'+ZOOM_MODES.map(function(z){return '<button type="button" data-r44-zoom="'+esc(z.key)+'" class="'+(state.zoom===z.key?'active':'')+'"><b>'+esc(z.label)+'</b><small>'+esc(z.summary)+'</small></button>';}).join('')+'</div><div class="r44-zoom-row focus r52-focus-row"><button type="button" data-r44-focus="selected" '+(canSelected?'':'disabled')+' class="'+(state.focus==='selected'?'active':'')+'">선택 중심</button><button type="button" data-r44-focus="relation" '+(canRelation?'':'disabled')+' class="'+(state.focus==='relation'?'active':'')+'">관계권 중심</button><button type="button" data-r44-clear="1">줌/위치 초기화</button></div><div class="r48-pan-hint r50-pan-hint r51-pan-hint r52-pan-hint">일반 화면: 라벨 최소화 · 세부 카드/관계권 텍스트는 줌5 또는 검수 모드에서 표시</div>';
  }
  function updateSelected(){
    var it=findItem(state.selected);
    if(!it){els.selected.innerHTML='<b>선택 기록 없음</b><span>지도 요소를 선택하면 요약 관제 정보와 관련 기록 링크가 표시됩니다.</span>'+renderNavigationControls(null); return;}
    var recs=relatedRecordKeys(it).length;
    els.selected.innerHTML='<b>'+esc(it.name)+'</b><em>'+esc(typeLabel(it))+(it.zone?' / '+zoneLabel(it.zone):'')+'</em><p>'+esc(it.status||'')+'</p><dl><dt>관계권</dt><dd>'+esc(it.group||'-')+'</dd><dt>표시 단계</dt><dd>'+esc(itemDetailLabel(it))+' 이상 / 현재 '+esc(zoomLabel())+'</dd><dt>현재 표시</dt><dd>'+esc(itemDisplayMode(it)==='dot'?'점 표시':'상세 표시')+'</dd><dt>관련 기록</dt><dd>'+esc(String(recs))+'개</dd>'+(state.review?'<dt>내부 코드</dt><dd>'+esc(it.id)+'</dd>':'')+'</dl>'+renderRecordLinks(it)+renderNavigationControls(it);
  }
  function auditTacticalDisplayDecongestion(){
    var warnings=[], notes=[];
    if(!TACTICAL_DISPLAY_DECONGESTION.version) warnings.push('R52 디클러터 메타데이터 누락');
    if(RELEASE_CHECKS.indexOf('tactical-display-decongestion-pass')===-1) warnings.push('릴리즈 체크 tactical-display-decongestion-pass 누락');
    notes.push('일반 화면 BARRIER/OP-GROUP 텍스트 숨김, 줌5/검수 모드에서만 세부 라벨 표시');
    notes.push('마커/점 크기 축소, 관계권 프레임 약화, 미니 카드 축소 및 줌5 전용화');
    notes.push('우측 패널 SELF REVIEW/FINAL CHECK/VISIBLE NODES는 검수 모드 전용 표시');
    return {ok:!warnings.length,warnings:warnings,notes:notes,version:TACTICAL_DISPLAY_DECONGESTION.version||'-'};
  }
  function makeTacticalDisplayDecongestionReport(){
    var a=auditTacticalDisplayDecongestion();
    return '[U.A.C 지역지도 전술 표시 정리 검수 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n현재: '+regionLabel(state.region)+' / '+zoomLabel()+' / review '+(state.review?'ON':'OFF')+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');
  }



  /* R54 — ZoomFiveRestoreAndFinalAuditHotfix
     - Corrects R53 zoom stage interpretation: maximum zoom remains zoom 5, not 10 split stages.
     - Keeps R53 marker/icon scaling and functional pictogram mapping.
     - Adds final audit cleanup for the restored 1~5 zoom model. */
  VERSION='5.8.1R-54 ZoomFiveRestoreAndFinalAuditHotfix';
  if(RELEASE_CHECKS.indexOf('zoom-five-restore')===-1) RELEASE_CHECKS.push('zoom-five-restore');
  if(RELEASE_CHECKS.indexOf('marker-icon-final-audit')===-1) RELEASE_CHECKS.push('marker-icon-final-audit');
  if(typeof MARKER_ICON_REBUILD==='object' && MARKER_ICON_REBUILD){
    MARKER_ICON_REBUILD.version=VERSION;
    MARKER_ICON_REBUILD.zoomStages=5;
    MARKER_ICON_REBUILD.zoomFiveRestored=true;
    MARKER_ICON_REBUILD.note='R54 restores tactical zoom to 1~5 while keeping non-zone marker, line, ring, endpoint, and pictogram scale compensation.';
  }
  if(typeof PAN_WHEEL_ZOOM==='object' && PAN_WHEEL_ZOOM){
    PAN_WHEEL_ZOOM.version=VERSION;
    PAN_WHEEL_ZOOM.maxZoomStage=5;
    PAN_WHEEL_ZOOM.panFromZoom=2;
    PAN_WHEEL_ZOOM.zoomFiveRestored=true;
  }
  ZOOM_MODES=[
    {key:'z1',label:'줌 1',scale:1.00,level:1,summary:'존 중심 / 나머지 최소 점'},
    {key:'z2',label:'줌 2',scale:1.16,level:2,summary:'주요 거점·사건 소형화'},
    {key:'z3',label:'줌 3',scale:1.34,level:3,summary:'봉쇄·기록·시설 표준 표시'},
    {key:'z4',label:'줌 4',scale:1.58,level:4,summary:'통신·보조 거점 세부 표시'},
    {key:'z5',label:'줌 5',scale:1.88,level:5,summary:'최대 상세 / 아이콘 상한 유지'}
  ];
  if(/^z(?:6|7|8|9|10)$/.test(String(state.zoom||''))) state.zoom='z5';

  function zoomKeyForLevel(lv){lv=Math.max(1,Math.min(5,Math.round(Number(lv)||1))); return 'z'+lv;}
  function zoomModeDef(key){
    var k=String(key||state.zoom||'z1');
    var m=/^z(\d+)$/.exec(k);
    if(m) k=zoomKeyForLevel(Number(m[1]));
    return ZOOM_MODES.filter(function(z){return z.key===k;})[0]||ZOOM_MODES[0];
  }
  function zoomLabel(){return zoomModeDef(state.zoom).label;}
  function zoomLevel(key){return zoomModeDef(key||state.zoom).level||1;}

  function itemZoomMin(it){
    if(!it) return 5;
    if(typeof it.zoomMin==='number') return Math.max(1,Math.min(5,Math.round(it.zoomMin)));
    if(it.detail==='precision') return 5;
    if(it.detail==='zoom') return 4;
    if(it.type==='zone') return 1;
    var icon=inferUacIcon(it).icon;
    if(icon==='icon-black-signal'||icon==='icon-ritual') return 4;
    if(icon==='icon-warning') return 3;
    if(icon==='icon-incident'||icon==='icon-contamination') return it.scale==='small'?4:3;
    if(icon==='icon-command') return 2;
    if(icon==='icon-airfield'||icon==='icon-harbor'||icon==='icon-supply'||icon==='icon-quarantine') return it.scale==='small'?4:3;
    if(icon==='icon-port-control'||icon==='icon-checkpoint'||icon==='icon-blockade-node') return it.scale==='small'?4:3;
    if(icon==='icon-comms'||icon==='icon-relay'||icon==='icon-observation'||icon==='icon-radar'||icon==='icon-jamming') return it.scale==='small'?4:3;
    if(it.type==='blockade') return it.scale==='small'?4:3;
    if(it.type==='facility') return it.scale==='small'?4:3;
    if(it.type==='anomaly') return it.scale==='small'?4:3;
    if(it.type==='comms') return 4;
    return 3;
  }
  function itemDetailLabel(it){return '줌 '+itemZoomMin(it);}
  function requiredZoomForItem(it){return zoomKeyForLevel(itemZoomMin(it));}
  function detailCounts(items){
    var out={z1:0,z2:0,z3:0,z4:0,z5:0,precision:0,zoomOnly:0};
    (items||[]).forEach(function(it){var m=itemZoomMin(it); out['z'+m]=(out['z'+m]||0)+1; if(it.detail==='precision') out.precision++; if(it.zoomMin||it.detail==='zoom') out.zoomOnly++;});
    return out;
  }

  function zoomVisualFactor(){return [0,.46,.58,.72,.88,1.00][zoomLevel(state.zoom)]||.72;}
  function markerVisualScale(it){
    var cam=zoomModeDef(state.zoom).scale||1;
    var raw=scaleBucketFactor(it.scale)*priorityScaleFactor(it)*zoomVisualFactor()/cam;
    if(it.type==='blockade-node'||inferUacIcon(it).icon==='icon-sea-buoy') raw*=.86;
    if(it.type==='comms'||it.type==='anomaly') raw*=.80;
    if(tacticalPriority(it)==='support') raw*=.92;
    return clampNum(raw,.26,.76);
  }
  function dotVisualRadius(it){
    var lv=zoomLevel(state.zoom), p=tacticalPriority(it), base={core:3.6,primary:3.1,standard:2.7,support:2.25}[p]||2.7;
    if(it.type==='incident') base+=.30;
    if(lv<=2) base-=.50;
    return clampNum(base,1.55,4.05);
  }
  function fieldVisualRadius(it,sc){
    var cam=zoomModeDef(state.zoom).scale||1;
    var base=it.type==='comms'?23:20;
    if(inferUacIcon(it).icon==='icon-radar') base=22;
    return clampNum(base*zoomVisualFactor()/cam,0,18);
  }
  function lineWidthForItem(it){
    var base={small:.92,medium:1.10,mid:1.18,large:1.36,xlarge:1.56}[it.scale]||1.10;
    var v=String(it.variant||'');
    if(/sea|route/.test(v)) base*=.64;
    if(/desert/.test(v)) base*=.78;
    if(/port/.test(v)) base*=.78;
    if(state.selected===it.id) base*=1.22;
    if(state.review) base*=1.10;
    return clampNum(base,.55,2.05);
  }
  function capRadiusForItem(it,end){var r={small:1.9,medium:2.3,mid:2.4,large:2.7,xlarge:3.0}[it.scale]||2.3; if(end) r+=.35; if(state.review) r+=.25; return clampNum(r,1.45,3.5);}

  function handleStageWheel(ev){
    if(state.region==='world') return; if(!ev||state.isPanning) return;
    ev.preventDefault(); ev.stopPropagation();
    var now=Date.now(), dy=Number(ev.deltaY)||0; if(Math.abs(dy)<6) return;
    var dir=dy<0?1:-1; if(now-(state.lastWheelAt||0)<(PAN_WHEEL_ZOOM.wheelCooldownMs||135) && dir===state.lastWheelDirection) return;
    state.lastWheelAt=now; state.lastWheelDirection=dir;
    var cur=zoomLevel(state.zoom), next=clamp(cur+dir,1,5); if(next===cur) return;
    var oldScale=zoomModeDef(state.zoom).scale||1, nextKey=zoomKeyForLevel(next), nextScale=zoomModeDef(nextKey).scale||1;
    if(next>1){var p=stagePointPercent(ev), c=focusCenterPercent(); state.panX=(Number(state.panX)||0)+(oldScale-nextScale)*(p.x-c.x); state.panY=(Number(state.panY)||0)+(oldScale-nextScale)*(p.y-c.y);}
    setZoomMode(nextKey,{keepPan:true,source:'wheel'});
  }
  function panLimitForZoom(key){
    var lv=zoomLevel(key||state.zoom); if(lv<=1) return {x:0,y:0};
    return {x:[0,0,18,30,44,60][lv]||44,y:[0,0,15,24,36,50][lv]||36};
  }
  function canPanDetailMap(){return state.region!=='world' && zoomLevel(state.zoom)>=2;}
  function setZoomMode(key,opts){
    opts=opts||{}; if(state.region==='world') return;
    var prev=state.zoom, prevLevel=zoomLevel(prev);
    state.zoom=zoomModeDef(key).key;
    if(zoomLevel(state.zoom)<=1){state.focus='none'; resetPan();}
    else { if(!opts.keepPan) resetPan(); normalizePan(); }
    if(prev!==state.zoom || prevLevel!==zoomLevel(state.zoom)) saveMapSnapshot({source:opts.source||'zoom'});
    render();
  }
  function setZoomFocus(mode){
    if(state.region==='world') return;
    if(mode==='selected' && !findItem(state.selected)) return;
    if(mode==='relation'){var it=findItem(state.selected); if(!it||!it.group) return;}
    state.focus=mode;
    if(state.focus!=='none' && zoomLevel(state.zoom)<3) state.zoom='z3';
    resetPan(); render();
  }
  function clearZoomFocus(){state.zoom='z1'; state.focus='none'; resetPan(); render();}
  function setRegion(key){state.region=key; state.selected=null; state.overlap=null; state.filter='all'; state.indexQuery=''; state.returnRecord=null; state.zoom='z1'; state.focus='none'; resetPan(); invalidatePerfCache(); render(); saveMapSnapshot({source:'region'});}
  function updateZoomView(){
    if(!root) return; ensurePanWheelHandlers(); root.dataset.r53='marker-scale-icon-mapping'; root.dataset.r54='zoom-five-restore';
    if(state.region==='world' || zoomLevel(state.zoom)<=1){resetPan(); root.style.setProperty('--r44-zoom-scale','1'); root.style.setProperty('--r44-pan-x','0%'); root.style.setProperty('--r44-pan-y','0%'); root.dataset.pan='0'; return;}
    normalizePan();
    var z=zoomModeDef(state.zoom), b=focusBounds(), cx=VIEW.w/2, cy=VIEW.h/2;
    if(b){cx=(b.x1+b.x2)/2; cy=(b.y1+b.y2)/2;}
    cx=clamp(cx,VIEW.w*.10,VIEW.w*.90); cy=clamp(cy,VIEW.h*.12,VIEW.h*.88);
    var tx=50-z.scale*(cx/VIEW.w*100)+(Number(state.panX)||0), ty=50-z.scale*(cy/VIEW.h*100)+(Number(state.panY)||0);
    var lim=panLimitForZoom(state.zoom); tx=clamp(tx,-lim.x-24,26); ty=clamp(ty,-lim.y-18,26);
    root.style.setProperty('--r44-zoom-scale',String(z.scale)); root.style.setProperty('--r44-pan-x',tx.toFixed(3)+'%'); root.style.setProperty('--r44-pan-y',ty.toFixed(3)+'%'); root.dataset.pan=canPanDetailMap()?'1':'0';
  }
  function renderZoomControls(){
    if(!els.zoomControls) return; if(state.region==='world'){els.zoomControls.hidden=true; els.zoomControls.innerHTML=''; return;}
    var selected=findItem(state.selected), canSelected=!!selected, canRelation=!!(selected&&selected.group), zdef=zoomModeDef(state.zoom), panText=canPanDetailMap()?'드래그 가능':'전체 고정';
    els.zoomControls.hidden=false;
    els.zoomControls.innerHTML='<div class="r44-control-head r48-control-head r53-control-head r54-control-head"><b>TACTICAL ZOOM</b><span>현재: '+esc(zoomLabel())+' / 5 · '+esc(zdef.summary||'')+' · '+esc(panText)+'</span></div><div class="r50-operating-state r52-operating-state r53-operating-state r54-operating-state"><b>스케일</b><span>존 유지 · 마커/선/링 동적 보정 · '+esc(panStateLabel())+'</span></div><div class="r44-zoom-row r47-zoom-row r53-zoom-row r54-zoom-row">'+ZOOM_MODES.map(function(z){return '<button type="button" data-r44-zoom="'+esc(z.key)+'" class="'+(state.zoom===z.key?'active':'')+'"><b>'+esc(z.label)+'</b><small>'+esc(z.summary)+'</small></button>';}).join('')+'</div><div class="r44-zoom-row focus r52-focus-row"><button type="button" data-r44-focus="selected" '+(canSelected?'':'disabled')+' class="'+(state.focus==='selected'?'active':'')+'">선택 중심</button><button type="button" data-r44-focus="relation" '+(canRelation?'':'disabled')+' class="'+(state.focus==='relation'?'active':'')+'">관계권 중심</button><button type="button" data-r44-clear="1">줌/위치 초기화</button></div><div class="r48-pan-hint r50-pan-hint r51-pan-hint r52-pan-hint r53-pan-hint r54-pan-hint">마우스 휠: 줌 1~5 · 줌2 이상 드래그 · 클릭 판정은 유지하고 시각 크기만 축소</div>';
  }

  function auditMarkerScaleAndIconMapping(){
    var warnings=[], notes=[], iconCounts={}, stageCounts={}, total=0, zones=0;
    REGIONS.filter(function(r){return r.key!=='world';}).forEach(function(r){(DATA[r.key]||[]).forEach(function(it){total++; if(it.type==='zone'){zones++; return;} var meta=inferUacIcon(it), z=itemZoomMin(it); iconCounts[meta.icon]=(iconCounts[meta.icon]||0)+1; stageCounts['z'+z]=(stageCounts['z'+z]||0)+1; if(z<1||z>5) warnings.push(r.label+' 줌 범위 오류: '+it.id); if(!meta.icon) warnings.push(r.label+' 아이콘 미매칭: '+it.id);});});
    if(ZOOM_MODES.length!==5) warnings.push('줌 단계 수 5 아님: '+ZOOM_MODES.length);
    if(!MARKER_ICON_REBUILD.markerVisualScaleSeparated) warnings.push('마커 스케일 분리 플래그 누락');
    if(MARKER_ICON_REBUILD.zoomStages!==5) warnings.push('마커 아이콘 메타데이터 줌 단계 불일치: '+MARKER_ICON_REBUILD.zoomStages);
    notes.push('총 '+total+'개 / 존 '+zones+'개 / 비존 '+(total-zones)+'개');
    notes.push('아이콘 '+Object.keys(iconCounts).length+'종 적용');
    notes.push('줌 단계 '+Object.keys(stageCounts).sort().map(function(k){return k+':'+stageCounts[k];}).join(', '));
    notes.push('R54: 줌은 1~5 유지, 최대 배율을 10단계로 분할하지 않음');
    return {ok:!warnings.length,warnings:warnings,notes:notes,iconCounts:iconCounts,stageCounts:stageCounts,total:total,zones:zones,version:VERSION};
  }
  function makeMarkerScaleAndIconMappingReport(){var a=auditMarkerScaleAndIconMapping(); return '[U.A.C 지역지도 마커 스케일·아이콘 매핑 검수 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n현재: '+regionLabel(state.region)+' / '+zoomLabel()+' / review '+(state.review?'ON':'OFF')+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');}
  function auditZoomStageLayer(){
    var warnings=[], notes=[], regions=REGIONS.filter(function(r){return r.key!=='world';}).map(function(r){return r.key;}), totals={all:0,removedPrecision:ZOOM_STAGE_LAYER.removedPrecisionItems||0,stages:{}}, fullTotals={}, currentVisible=getVisibleItems();
    for(var i=1;i<=5;i++){totals.stages['z'+i]=0; fullTotals['z'+i]=0;}
    regions.forEach(function(region){var items=DATA[region]||[]; totals.all+=items.length; items.forEach(function(it){var m=itemZoomMin(it); totals.stages['z'+m]=(totals.stages['z'+m]||0)+1; if(it.detail==='precision') warnings.push(regionDef(region).label+' 제거되지 않은 정밀 데이터: '+it.id); if(m<1||m>5) warnings.push(regionDef(region).label+' 줌 단계 범위 오류: '+it.id);}); for(var z=1;z<=5;z++) fullTotals['z'+z]+=items.filter(function(it){return itemDisplayMode(it,'z'+z)==='full';}).length; var z1Zones=visibleItemsForMode(region,'zone','z1').length; if(!z1Zones) warnings.push(regionDef(region).label+' 줌1 존 표시 없음');});
    notes.push('전체 '+totals.all+'개 / 현재 표시 '+currentVisible.length+'개 / 줌5 전체표시 '+fullTotals.z5+'개');
    notes.push('전체 표시 기준: '+Object.keys(fullTotals).map(function(k){return k+' '+fullTotals[k];}).join(' / '));
    notes.push('R54 기준: 기존 줌1~줌5 구조 복구');
    return {ok:!warnings.length,warnings:warnings,notes:notes,totals:totals,fullTotals:fullTotals,currentVisible:currentVisible.length};
  }
  function fmtZoomStageAudit(audit){audit=audit||auditZoomStageLayer(); return audit.ok?'정상 · 전체 '+audit.totals.all+'개 / 줌5 전체표시 '+audit.fullTotals.z5+'개':'경고 '+audit.warnings.length+'건 · '+audit.warnings.slice(0,4).join(' / ')+(audit.warnings.length>4?' / ...':'');}
  function auditPanWheelZoom(){
    var warnings=[], notes=[];
    if(!PAN_WHEEL_ZOOM.wheelZoom) warnings.push('마우스 휠 줌 설정 누락');
    if(!PAN_WHEEL_ZOOM.worldLocked) warnings.push('세계지도 줌 잠금 설정 누락');
    if(ZOOM_MODES.length!==5) warnings.push('줌 단계 수 불일치: '+ZOOM_MODES.length);
    if((PAN_WHEEL_ZOOM.maxZoomStage||5)!==5) warnings.push('최대 줌 단계 설정 불일치: '+PAN_WHEEL_ZOOM.maxZoomStage);
    if(!PAN_WHEEL_ZOOM.noAutoRecenterOnSelection) warnings.push('선택 시 자동 중심 복귀 방지 설정 누락');
    notes.push('상세지도 줌 1~5 / 휠 전환 / 줌2~5 제한 드래그 / 일반 선택 위치 유지 / 세계지도 고정');
    notes.push('존 제외 마커는 카메라 배율과 분리된 동적 스케일 보정 적용');
    return {ok:!warnings.length,warnings:warnings,notes:notes,panFromZoom:PAN_WHEEL_ZOOM.panFromZoom,maxZoomStage:5};
  }
  function makePanWheelZoomReport(){var a=auditPanWheelZoom(); return '[U.A.C 지역지도 줌·드래그 검수 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n현재: '+regionLabel(state.region)+' / '+zoomLabel()+' / pan '+(Number(state.panX)||0).toFixed(2)+','+(Number(state.panY)||0).toFixed(2)+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');}
  function auditZoomFiveRestoreHotfix(){
    var warnings=[], notes=[], marker=auditMarkerScaleAndIconMapping(), zoom=auditZoomStageLayer(), pan=auditPanWheelZoom();
    if(ZOOM_MODES.length!==5) warnings.push('줌 버튼 수가 5개가 아님');
    if((MARKER_ICON_REBUILD.zoomStages||0)!==5) warnings.push('MARKER_ICON_REBUILD.zoomStages가 5가 아님');
    if((PAN_WHEEL_ZOOM.maxZoomStage||0)!==5) warnings.push('PAN_WHEEL_ZOOM.maxZoomStage가 5가 아님');
    [marker,zoom,pan].forEach(function(a){if(a&&!a.ok) a.warnings.forEach(function(w){warnings.push(w);});});
    notes.push('R53 아이콘 매핑/비존 스케일 보정 유지');
    notes.push('R54 줌 단계는 다시 1~5로 고정');
    notes.push('세계지도는 권역 선택 전용/줌 없음 유지');
    return {ok:!warnings.length,warnings:warnings,notes:notes,marker:marker,zoom:zoom,pan:pan};
  }
  function makeZoomFiveRestoreHotfixReport(){var a=auditZoomFiveRestoreHotfix(); return '[U.A.C 지역지도 줌5 복구·최종 안정화 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');}


  /* R55 — FinalReleaseAuditAndPackageCleanup
     - Adds a single final release audit that consolidates link, RC, zoom, pan, no-auto-recenter,
       decongestion, marker/icon mapping, and restored five-stage zoom checks.
     - Does not add map content, zones, or world-map tactical markers. */
  VERSION='5.8.1R-59 RegionalMapMountAndResponsiveStabilityHotfix';
  if(RELEASE_CHECKS.indexOf('final-release-audit')===-1) RELEASE_CHECKS.push('final-release-audit');
  var FINAL_RELEASE_AUDIT={
    version:VERSION,
    lockedWorldSelector:true,
    zoomStages:5,
    keepsR53IconMapping:true,
    keepsR54ZoomFiveRestore:true,
    addsContent:false,
    note:'R55 consolidates final release readiness checks without changing content count or world selector behavior.'
  };
  if(typeof MARKER_ICON_REBUILD==='object' && MARKER_ICON_REBUILD){
    MARKER_ICON_REBUILD.version=VERSION;
    MARKER_ICON_REBUILD.zoomStages=5;
    MARKER_ICON_REBUILD.finalReleaseAudit=true;
  }
  if(typeof PAN_WHEEL_ZOOM==='object' && PAN_WHEEL_ZOOM){
    PAN_WHEEL_ZOOM.version=VERSION;
    PAN_WHEEL_ZOOM.maxZoomStage=5;
    PAN_WHEEL_ZOOM.panFromZoom=2;
    PAN_WHEEL_ZOOM.finalReleaseAudit=true;
  }

  function auditFinalReleaseReadiness(){
    var warnings=[], notes=[];
    var linkAudit=auditLinkIntegrity();
    var releaseAudit=auditReleaseCandidate();
    var zoomAudit=auditZoomStageLayer();
    var panAudit=auditPanWheelZoom();
    var noRecenterAudit=auditNoAutoRecenterOnSelection();
    var interactionAudit=auditMapInteractionStability();
    var displayAudit=auditTacticalDisplayDecongestion();
    var markerAudit=auditMarkerScaleAndIconMapping();
    var zoomFiveAudit=auditZoomFiveRestoreHotfix();
    var finalHotfix=auditFinalHotfixReadiness({linkAudit:linkAudit, releaseAudit:releaseAudit, zoomAudit:zoomAudit, regionItems:getRegionItems(state.region), visible:getVisibleItems()});
    var audits=[linkAudit,releaseAudit,zoomAudit,panAudit,noRecenterAudit,interactionAudit,displayAudit,markerAudit,zoomFiveAudit,finalHotfix];
    audits.forEach(function(a){ if(a && a.warnings && a.warnings.length){ a.warnings.forEach(function(w){ warnings.push(w); }); } });
    if(ZOOM_MODES.length!==5) warnings.push('최종 릴리즈 기준 줌 단계 수가 5가 아님: '+ZOOM_MODES.length);
    if((PAN_WHEEL_ZOOM.maxZoomStage||0)!==5) warnings.push('최종 릴리즈 기준 마우스 휠 최대 줌이 5가 아님');
    if((MARKER_ICON_REBUILD.zoomStages||0)!==5) warnings.push('마커/아이콘 메타데이터가 줌 5 기준이 아님');
    if(state.region==='world' && (state.panX||state.panY)) warnings.push('세계지도 상태에 pan 값이 남아 있음');
    var allItems=[]; REGIONS.filter(function(r){return r.key!=='world';}).forEach(function(r){(DATA[r.key]||[]).forEach(function(it){allItems.push(it);});});
    var zones=allItems.filter(function(it){return it.type==='zone';}).length;
    var precision=allItems.filter(function(it){return it.detail==='precision';}).length;
    var nonZones=allItems.length-zones;
    if(allItems.length!==165) warnings.push('최종 지도 요소 수가 165개가 아님: '+allItems.length);
    if(precision!==0) warnings.push('제거되어야 할 정밀 전용 데이터 잔존: '+precision+'개');
    if(!zones) warnings.push('존 데이터 없음');
    if(!nonZones) warnings.push('비존 마커 데이터 없음');
    notes.push('요소 '+allItems.length+'개 / 존 '+zones+'개 / 비존 '+nonZones+'개 / 정밀 전용 '+precision+'개');
    notes.push('세계지도는 권역 선택 전용, 상세지도는 줌1~줌5/휠줌/줌2~5 드래그 유지');
    notes.push('R53 기능별 아이콘 매핑과 R54 줌5 복구 기준 유지');
    notes.push('새 존/새 블랙존/세계지도 마커 추가 없음');
    return {ok:!warnings.length,warnings:warnings,notes:notes,version:VERSION,checks:{link:linkAudit.ok,release:releaseAudit.ok,zoom:zoomAudit.ok,pan:panAudit.ok,noRecenter:noRecenterAudit.ok,interaction:interactionAudit.ok,display:displayAudit.ok,marker:markerAudit.ok,zoomFive:zoomFiveAudit.ok,finalHotfix:finalHotfix.ok},totals:{all:allItems.length,zones:zones,nonZones:nonZones,precision:precision}};
  }
  function makeFinalReleaseReadinessReport(){
    var a=auditFinalReleaseReadiness();
    return '[U.A.C 지역지도 최종 릴리즈 점검 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n요소: 전체 '+a.totals.all+'개 / 존 '+a.totals.zones+'개 / 비존 '+a.totals.nonZones+'개 / 정밀 전용 '+a.totals.precision+'개\n체크: LINK '+(a.checks.link?'정상':'경고')+' / RC '+(a.checks.release?'정상':'경고')+' / ZOOM '+(a.checks.zoom?'정상':'경고')+' / PAN '+(a.checks.pan?'정상':'경고')+' / ICON '+(a.checks.marker?'정상':'경고')+' / FINAL '+(a.checks.finalHotfix?'정상':'경고')+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');
  }

  function exposeApi(){
    window.ProjectCurseRegionalMap={
      version:VERSION,
      resetToWorld:resetToWorld,
      getState:function(){return {region:state.region,filter:state.filter,review:!!state.review,selected:state.selected,zoom:state.zoom,focus:state.focus,overlap:state.overlap&&state.overlap.ids?state.overlap.ids.slice():[]};},
      setZoomMode:setZoomMode,
      setZoomFocus:setZoomFocus,
      clearZoomFocus:clearZoomFocus,
      getRelatedRecords:function(id){var local=findItem(id||state.selected), global=!local&&id?findGlobalItem(id):null, it=local||(global&&global.item); return it?relatedRecordKeys(it).map(function(k){return RECORD_LIBRARY[k];}):[];},
      getRecordMapLinks:getRecordMapLinks,
      openRelatedRecord:openRelatedRecord,
      openMapItem:openMapItem,
      returnToLastMap:function(){return applyMapSnapshot(readMapSnapshot());},
      getRouteContext:readRouteContext,
      getIndexRows:function(){return buildIndexRows().map(function(row){return row.item?{region:row.region,id:row.item.id,name:row.item.name,type:row.item.type,zone:row.item.zone,group:row.item.group}:{region:row.region,group:row.group,count:row.items.length};});},
      openIndexItem:openIndexItem,
      auditLinkIntegrity:auditLinkIntegrity,
      makeLinkAuditReport:function(){var a=auditLinkIntegrity(); return '[U.A.C 지도↔문서 링크 무결성 리포트]\n버전: '+VERSION+'\n요약: '+fmtLinkAudit(a)+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음');},
      auditReleaseCandidate:auditReleaseCandidate,
      auditFinalHotfixReadiness:auditFinalHotfixReadiness,
      auditPrecisionLayer:auditPrecisionLayer,
      makePrecisionLayerAuditReport:function(){var a=auditPrecisionLayer(); return '[U.A.C 지역지도 정밀 레이어 검수 리포트]\n버전: '+VERSION+'\n요약: '+fmtPrecisionAudit(a)+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n세부: '+a.notes.join(' / ');},
      makeFinalHotfixReadinessReport:makeFinalHotfixReadinessReport,
      makeReleaseCandidateReport:function(){var a=auditReleaseCandidate(); return '[U.A.C 지역지도 릴리즈 후보 검수 리포트]\n버전: '+VERSION+'\n요약: '+fmtReleaseAudit(a)+'\n체크: '+a.checks.join(', ')+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음');},
      makePerformanceIndexReport:function(){var rows=buildIndexRowsCached(); return '[U.A.C 지역지도 성능·색인 리포트]\n버전: '+VERSION+'\n색인: '+indexKindLabel(activeIndexKind())+' / 항목 '+rows.length+' / 표시 제한 '+indexDisplayLimit(activeIndexKind(),rows)+'\n캐시: '+Object.keys(PERF.indexCache).length+'개';},
      makeZoomFocusReport:function(){return '[U.A.C 지역지도 상세 보기 리포트]\n버전: '+VERSION+'\n권역: '+regionLabel(state.region)+' ('+state.region+')\n보기 배율: '+zoomLabel()+' ('+state.zoom+')\n초점: '+(state.focus==='relation'?'관계권 중심':state.focus==='selected'?'선택 중심':'전체')+'\n정밀 레이어: '+(PRECISION_LAYER.version?('활성 / 추가 '+(PRECISION_LAYER.addedItems||0)+'개'):'없음')+'\n선택: '+(state.selected||'-');},
      makeSelfReviewReport:makeSelfReviewReport
    };
  }

  /* R47 — Tactical Zoom Stage Reveal overrides
     - Removes summary/precision view logic from the active renderer.
     - Detail maps use zoom 1~5 staged reveal.
     - Non-zone elements appear as tactical dots before their full reveal stage. */
  VERSION='5.8.1R-47 TacticalZoomStageReveal';
  RELEASE_CHECKS=[
    'world-selector',
    'eight-regions',
    'fixed-filter-order',
    'review-mode-only-codes',
    'self-review-report',
    'link-audit',
    'record-index',
    'map-record-return-flow',
    'overlap-selection-menu',
    'legacy-map-disabled',
    'compact-warning-summary',
    'final-hotfix-readiness-report',
    'data-module-split',
    'performance-index-polish',
    'expanded-map-visual-hotfix',
    'tactical-zoom-stage-reveal'
  ];
  ZOOM_MODES=[
    {key:'z1',label:'줌 1',scale:1.00,level:1,summary:'존 중심 / 나머지 점 표시'},
    {key:'z2',label:'줌 2',scale:1.16,level:2,summary:'주요 시설·주요 사건 표시'},
    {key:'z3',label:'줌 3',scale:1.34,level:3,summary:'봉쇄선·현상 기록 표시'},
    {key:'z4',label:'줌 4',scale:1.58,level:4,summary:'보조 시설·통신권 표시'},
    {key:'z5',label:'줌 5',scale:1.88,level:5,summary:'최대 라벨·근접 후보 확인'}
  ];
  var ZOOM_STAGE_LAYER=DATA_MODULE.ZOOM_STAGE_LAYER||{};
  PRECISION_LAYER={};
  PRECISION_AUDIT_HOTFIX={};
  if(state.zoom==='base'||state.zoom==='summary'||state.zoom==='zoom'||state.zoom==='precision') state.zoom='z1';

  function zoomModeDef(key){return ZOOM_MODES.filter(function(z){return z.key===key;})[0]||ZOOM_MODES[0];}
  function zoomLabel(){return zoomModeDef(state.zoom).label;}
  function zoomLevel(key){var z=zoomModeDef(key||state.zoom); return z.level||1;}
  function zoomKeyForLevel(lv){lv=Math.max(1,Math.min(5,Number(lv)||1)); return 'z'+lv;}
  function itemZoomMin(it){
    if(!it) return 5;
    if(typeof it.zoomMin==='number') return Math.max(1,Math.min(5,it.zoomMin));
    if(it.detail==='zoom') return 4;
    if(it.detail==='precision') return 5;
    if(it.type==='zone') return 1;
    if(it.type==='incident') return it.scale==='small'?3:2;
    if(it.type==='facility') return it.scale==='small'?3:2;
    if(it.type==='blockade') return it.scale==='small'?4:3;
    if(it.type==='blockade-node') return it.scale==='small'?4:3;
    if(it.type==='anomaly') return it.scale==='small'?4:3;
    if(it.type==='comms') return 4;
    return 3;
  }
  function itemDetailLabel(it){return '줌 '+itemZoomMin(it);}
  function requiredZoomForItem(it){return zoomKeyForLevel(itemZoomMin(it));}
  function filterMatches(it,filter){
    var f=filter||state.filter||'all';
    if(f==='all') return true;
    if(f==='zone') return it.type==='zone';
    if(f.indexOf('zone-')===0) return it.type==='zone' && it.zone===f.replace('zone-','');
    return it.type===f;
  }
  function itemFullVisibleInMode(it,mode){return zoomLevel(mode)>=itemZoomMin(it);}
  function itemDotEligible(it){return !!it && it.type!=='zone';}
  function itemDisplayMode(it,mode){
    if(!it) return 'hidden';
    var lv=zoomLevel(mode||state.zoom);
    if(itemFullVisibleInMode(it,mode||state.zoom)) return 'full';
    if(lv>=1 && itemDotEligible(it)) return 'dot';
    return 'hidden';
  }
  function detailVisible(it){return itemDisplayMode(it,state.zoom)!=='hidden';}
  function itemVisible(it){if(state.region==='world') return false; if(!filterMatches(it,state.filter)) return false; return detailVisible(it);}
  function detailVisibleInMode(it,mode){return itemDisplayMode(it,mode)!=='hidden';}
  function itemVisibleInMode(it,filter,mode){return filterMatches(it,filter||'all') && detailVisibleInMode(it,mode||'z1');}
  function visibleItemsForMode(region,filter,mode){return (DATA[region]||[]).filter(function(it){return itemVisibleInMode(it,filter||'all',mode||'z1');});}
  function detailCounts(items){
    var out={z1:0,z2:0,z3:0,z4:0,z5:0,precision:0,zoomOnly:0};
    (items||[]).forEach(function(it){var m=itemZoomMin(it); out['z'+m]=(out['z'+m]||0)+1; if(it.detail==='precision') out.precision++; if(it.zoomMin||it.detail==='zoom') out.zoomOnly++;});
    return out;
  }
  function setRegion(key){state.region=key; state.selected=null; state.overlap=null; state.filter='all'; state.indexQuery=''; state.returnRecord=null; state.zoom='z1'; state.focus='none'; invalidatePerfCache(); render(); saveMapSnapshot({source:'region'});}
  function setZoomMode(key){
    if(state.region==='world') return;
    state.zoom=zoomModeDef(key).key;
    if(state.focus==='none' && state.selected && zoomLevel(state.zoom)>=3) state.focus='selected';
    render();
  }
  function setZoomFocus(mode){
    if(state.region==='world') return;
    if(mode==='selected' && !findItem(state.selected)) return;
    if(mode==='relation'){
      var it=findItem(state.selected);
      if(!it||!it.group) return;
    }
    state.focus=mode;
    if(state.focus!=='none' && zoomLevel(state.zoom)<3) state.zoom='z3';
    render();
  }
  function clearZoomFocus(){state.zoom='z1'; state.focus='none'; render();}

  function render(){
    if(!root) return;
    if(state.region==='world'){state.zoom='z1'; state.focus='none';}
    else {state.zoom=zoomModeDef(state.zoom).key;}
    var r=regionDef(state.region), info=REGION_INFO[state.region]||REGION_INFO.world;
    root.dataset.region=state.region; root.dataset.filter=state.filter; root.dataset.review=state.review?'1':'0'; root.dataset.zoom=state.zoom; root.dataset.focus=state.focus;
    els.img.src=r.map; els.img.alt=(info.title||r.label)+' 지도';
    els.status.textContent= state.region==='world'?'WORLD SELECTOR / NO DATA LAYER':(info.status+' / '+(state.review?'REVIEW MODE':'OPERATIONS VIEW')+' / '+zoomLabel());
    els.infoTitle.textContent=info.title; els.infoStatus.textContent=info.status; els.infoBody.textContent=info.body;
    Array.prototype.forEach.call(els.regions.children,function(b){b.classList.toggle('active',b.dataset.region===state.region);});
    Array.prototype.forEach.call(els.filters.children,function(b){b.classList.toggle('active',b.dataset.filter===state.filter || (b.dataset.filter==='review'&&state.review));});
    els.filters.hidden=(state.region==='world'); els.world.hidden=(state.region!=='world');
    root.classList.toggle('is-world',state.region==='world'); root.classList.toggle('is-review',!!state.review); document.body.classList.toggle('r24-map-review-mode',!!state.review); root.classList.toggle('r24-focus-active',!!state.selected);
    clearChildren(els.svg); clearChildren(els.list);
    var count=0;
    if(state.region!=='world'){
      var defs=se('defs',{}); defs.appendChild(markerDef('arrow-end','M 0 0 L 8 4 L 0 8 z')); els.svg.appendChild(defs);
      var items=(DATA[state.region]||[]).filter(itemVisible);
      var full=items.filter(function(it){return itemDisplayMode(it)==='full';});
      var dots=items.filter(function(it){return itemDisplayMode(it)==='dot';});
      full.filter(function(it){return it.type==='blockade';}).forEach(function(it){renderBlockade(it); count++;});
      full.filter(function(it){return it.type==='zone';}).forEach(function(it){renderZone(it); count++;});
      full.filter(function(it){return it.type!=='zone'&&it.type!=='blockade';}).forEach(function(it){renderPoint(it); count++;});
      dots.forEach(function(it){renderZoomDot(it); count++;});
      items.forEach(addListItem);
    }
    els.count.textContent=String(count);
    renderZoomControls(); updateZoomView(); renderIndexPanel(); updateSelected(); highlight(); updateOverlapMenu(); renderSelfReview(false);
  }
  function renderZoomDot(it){
    var p=itemAnchor(it); if(!p) return;
    var cls='r24-item r47-zoom-dot r47-dot-'+it.type+' r47-stage-min-'+itemZoomMin(it)+groupClass(it);
    var g=se('g',{class:cls,tabindex:'0','data-id':it.id,transform:'translate('+p[0].toFixed(1)+' '+p[1].toFixed(1)+')'});
    var r={blockade:5,'blockade-node':5,facility:5,incident:5.5,anomaly:4.8,comms:4.8}[it.type]||5;
    g.appendChild(se('circle',{cx:0,cy:0,r:r,class:'r47-dot-core'}));
    if(it.type==='blockade'||it.type==='blockade-node') g.appendChild(se('line',{x1:-8,y1:0,x2:8,y2:0,class:'r47-dot-line'}));
    if(it.type==='incident') g.appendChild(se('path',{d:'M 0 -8 L 7 6 L -7 6 Z',class:'r47-dot-shape'}));
    bindItem(g,it); els.svg.appendChild(g);
    if(state.review && zoomLevel(state.zoom)>=5) addReviewLabel(g,it,10,-10,true);
    if(shouldZoomLabel(it)) addZoomLabel(g,it,12,18,true);
  }
  function updateZoomView(){
    if(!root) return;
    if(state.region==='world' || state.zoom==='z1'){
      root.style.setProperty('--r44-zoom-scale','1');
      root.style.setProperty('--r44-pan-x','0%');
      root.style.setProperty('--r44-pan-y','0%');
      return;
    }
    var z=zoomModeDef(state.zoom), b=focusBounds(), cx=VIEW.w/2, cy=VIEW.h/2;
    if(b){cx=(b.x1+b.x2)/2; cy=(b.y1+b.y2)/2;}
    cx=clamp(cx,VIEW.w*.10,VIEW.w*.90); cy=clamp(cy,VIEW.h*.12,VIEW.h*.88);
    var cxp=cx/VIEW.w*100, cyp=cy/VIEW.h*100;
    var tx=50-z.scale*cxp, ty=50-z.scale*cyp;
    var maxPan=zoomLevel(state.zoom)>=5?64:(zoomLevel(state.zoom)>=4?54:42);
    tx=clamp(tx,-maxPan,18); ty=clamp(ty,-maxPan,18);
    root.style.setProperty('--r44-zoom-scale',String(z.scale));
    root.style.setProperty('--r44-pan-x',tx.toFixed(3)+'%');
    root.style.setProperty('--r44-pan-y',ty.toFixed(3)+'%');
  }
  function renderZoomControls(){
    if(!els.zoomControls) return;
    if(state.region==='world'){els.zoomControls.hidden=true; els.zoomControls.innerHTML=''; return;}
    var selected=findItem(state.selected), canSelected=!!selected, canRelation=!!(selected&&selected.group);
    els.zoomControls.hidden=false;
    var zdef=zoomModeDef(state.zoom);
    els.zoomControls.innerHTML='<div class="r44-control-head"><b>TACTICAL ZOOM</b><span>'+esc(zoomLabel())+' / '+esc(zdef.summary||'')+' / '+esc(state.focus==='relation'?'관계권 중심':state.focus==='selected'?'선택 중심':'전체')+'</span></div><div class="r44-zoom-row r47-zoom-row">'+ZOOM_MODES.map(function(z){return '<button type="button" data-r44-zoom="'+esc(z.key)+'" class="'+(state.zoom===z.key?'active':'')+'"><b>'+esc(z.label)+'</b><small>'+esc(z.summary)+'</small></button>';}).join('')+'</div><div class="r44-zoom-row focus"><button type="button" data-r44-focus="selected" '+(canSelected?'':'disabled')+' class="'+(state.focus==='selected'?'active':'')+'">선택 중심</button><button type="button" data-r44-focus="relation" '+(canRelation?'':'disabled')+' class="'+(state.focus==='relation'?'active':'')+'">관계권 중심</button><button type="button" data-r44-clear="1">줌 1 복귀</button></div>';
  }
  function shouldZoomLabel(it){
    if(state.region==='world'||!state.selected) return false;
    var lv=zoomLevel(state.zoom), sel=findItem(state.selected);
    if(!sel) return false;
    if(it.id===sel.id && lv>=2) return true;
    if(lv>=5 && state.focus==='relation' && sel.group && it.group===sel.group) return true;
    if(state.review && lv>=5 && itemDisplayMode(it)==='full') return true;
    return false;
  }
  function addListItem(it){
    var b=ce('button','r24-node-row'); b.type='button';
    var mode=itemDisplayMode(it)==='dot'?'점 표시':'표시';
    b.innerHTML='<b>'+esc(it.name)+'</b><span>'+esc(typeLabel(it))+(it.zone?' · '+zoneLabel(it.zone):'')+' · '+esc(itemDetailLabel(it))+' · '+mode+'</span>';
    b.addEventListener('click',function(){state.selected=it.id; if(zoomLevel(state.zoom)>=3&&state.focus==='none') state.focus='selected'; saveMapSnapshot({source:'list'}); render();});
    els.list.appendChild(b);
  }
  function updateSelected(){
    var it=findItem(state.selected);
    if(!it){els.selected.innerHTML='<b>선택 기록 없음</b><span>지도 요소를 선택하면 요약 관제 정보와 관련 기록 링크가 표시됩니다.</span>'+renderNavigationControls(null); return;}
    els.selected.innerHTML='<b>'+esc(it.name)+'</b><em>'+esc(typeLabel(it))+(it.zone?' / '+zoneLabel(it.zone):'')+'</em><p>'+esc(it.status||'')+'</p><dl><dt>관계권</dt><dd>'+esc(it.group||'-')+'</dd><dt>표시 단계</dt><dd>'+esc(itemDetailLabel(it))+' 이상 / 현재 '+esc(zoomLabel())+'</dd><dt>현재 표시</dt><dd>'+esc(itemDisplayMode(it)==='dot'?'점 표시':'상세 표시')+'</dd><dt>기록</dt><dd>'+esc(it.records||'-')+'</dd>'+(state.review?'<dt>내부 코드</dt><dd>'+esc(it.id)+'</dd>':'')+'</dl>'+renderRecordLinks(it)+renderNavigationControls(it);
  }
  function renderIndexPanel(){
    if(!els.index) return;
    var kind=activeIndexKind(), rows=buildIndexRowsCached(), limit=indexDisplayLimit(kind,rows), shown=rows.slice(0,limit), more=Math.max(0,rows.length-shown.length), summary=indexSummary(rows);
    els.index.hidden=false;
    if(els.indexChips) els.indexChips.innerHTML=INDEX_FILTERS.map(function(f){return '<button type="button" data-r24-index-kind="'+esc(f.key)+'" class="'+((state.indexKind===f.key||(state.indexKind!=='auto'&&f.key===kind))?'active':'')+'">'+esc(f.label)+'</button>';}).join('');
    if(els.indexSearch&&document.activeElement!==els.indexSearch) els.indexSearch.value=state.indexQuery||'';
    if(els.indexCount){var scope=state.region==='world'?'전 권역':('현재 권역 '+summary.current+'개'+(summary.other?' / 외부 '+summary.other+'개':'')); els.indexCount.textContent=esc(indexKindLabel(kind))+' · '+rows.length+' · '+scope;}
    if(!els.indexList) return;
    if(!rows.length){var q=state.indexQuery?(' / 검색어 '+state.indexQuery):''; els.indexList.innerHTML='<div class="r24-index-empty"><b>검색 결과 없음</b><span>'+esc(indexKindLabel(kind))+esc(q)+' 조건과 일치하는 지도 기록이 없습니다. 필터 연동 또는 전체 색인으로 전환해 확인하십시오.</span></div>'; return;}
    if(kind==='relation'){
      els.indexList.innerHTML=shown.map(function(g){var lead=g.items.slice().sort(function(a,b){return indexPriority(a)-indexPriority(b);})[0]; var zoneText=fmtCounts(g.zones,{red:'레드존',yellow:'옐로우존',green:'그린존',white:'화이트존',black:'블랙존'}); var selected=findItem(state.selected), active=selected&&selected.group===g.group&&state.region===g.region; return '<button type="button" class="r24-index-row relation '+(active?'selected ':'')+(g.region===state.region?'current-region':'')+'" data-r24-index-region="'+esc(g.region)+'" data-r24-index-group="'+esc(g.group)+'"><b>'+esc(g.group)+'</b><span>'+esc(regionLabel(g.region))+' · 요소 '+g.items.length+'개 · '+esc(typeLabel(lead))+(zoneText!=='-'?' · '+esc(zoneText):'')+(state.review?' / '+esc((lead&&lead.id)||'-'):'')+'</span></button>';}).join('')+(more?'<div class="r24-index-more">표시 '+shown.length+'/'+rows.length+' · 추가 관계권 '+more+'개는 검색어로 좁혀 확인하십시오.</div>':'');
    } else {
      els.indexList.innerHTML=shown.map(function(row){var it=row.item, min=itemZoomMin(it), auto=zoomLevel(state.zoom)<min?' · 열면 '+itemDetailLabel(it)+' 자동 전환':''; return '<button type="button" class="r24-index-row '+(row.region===state.region?'current-region ':'')+(it.id===state.selected?'selected ':'')+'r47-stage-row" data-r24-index-region="'+esc(row.region)+'" data-r24-index-open="'+esc(it.id)+'"><b>'+esc(it.name)+'</b><span><i>'+esc(typeLabel(it))+'</i> '+esc(regionLabel(row.region))+(it.zone?' · '+esc(zoneLabel(it.zone)):'')+' · '+esc(it.group||'-')+' · '+esc(itemDetailLabel(it))+auto+(state.review?' / '+esc(it.id):'')+'</span></button>';}).join('')+(more?'<div class="r24-index-more">표시 '+shown.length+'/'+rows.length+' · 추가 항목 '+more+'개는 검색어로 좁혀 확인하십시오.</div>':'');
    }
  }
  function openIndexItem(region,id){var found=findGlobalItem(id); if(!found) return false; var it=found.item, filter=it.type==='zone'?('zone-'+it.zone):it.type; return openMapItem(region||found.region,id,{keepFilter:filter,keepReview:state.review,keepZoom:requiredZoomForItem(it),keepFocus:'selected'});}
  function openIndexGroup(region,group){var items=(DATA[region]||[]).filter(function(it){return (it.group||'ungrouped')===group;}).sort(function(a,b){return indexPriority(a)-indexPriority(b)||String(a.name).localeCompare(String(b.name),'ko');}); if(!items.length) return false; return openMapItem(region,items[0].id,{keepFilter:'all',keepReview:state.review,keepZoom:'z3',keepFocus:'relation'});}
  function auditZoomStageLayer(){
    var warnings=[], notes=[], regions=REGIONS.filter(function(r){return r.key!=='world';}).map(function(r){return r.key;}), totals={all:0,removedPrecision:ZOOM_STAGE_LAYER.removedPrecisionItems||0,stages:{z1:0,z2:0,z3:0,z4:0,z5:0}}, fullTotals={z1:0,z2:0,z3:0,z4:0,z5:0}, currentVisible=getVisibleItems();
    regions.forEach(function(region){var items=DATA[region]||[]; totals.all+=items.length; items.forEach(function(it){var m=itemZoomMin(it); totals.stages['z'+m]=(totals.stages['z'+m]||0)+1; if(it.detail==='precision') warnings.push(regionDef(region).label+' 제거되지 않은 정밀 데이터: '+it.id); if(m<1||m>5) warnings.push(regionDef(region).label+' 줌 단계 범위 오류: '+it.id);}); ['z1','z2','z3','z4','z5'].forEach(function(mode){fullTotals[mode]+=items.filter(function(it){return itemDisplayMode(it,mode)==='full';}).length;}); var z1Zones=visibleItemsForMode(region,'zone','z1').length; if(!z1Zones) warnings.push(regionDef(region).label+' 줌1 존 표시 없음');});
    if(!ZOOM_STAGE_LAYER.version) warnings.push('R47 줌 단계 메타데이터 누락');
    notes.push('전체 '+totals.all+'개 / 제거된 정밀 전용 '+totals.removedPrecision+'개 / 현재 표시 '+currentVisible.length+'개');
    notes.push('전체 표시 기준: 줌1 '+fullTotals.z1+'개 / 줌2 '+fullTotals.z2+'개 / 줌3 '+fullTotals.z3+'개 / 줌4 '+fullTotals.z4+'개 / 줌5 '+fullTotals.z5+'개');
    return {ok:!warnings.length,warnings:warnings,notes:notes,totals:totals,fullTotals:fullTotals,currentVisible:currentVisible.length};
  }
  function fmtZoomStageAudit(audit){audit=audit||auditZoomStageLayer(); return audit.ok?'정상 · 전체 '+audit.totals.all+'개 / 줌5 전체표시 '+audit.fullTotals.z5+'개':'경고 '+audit.warnings.length+'건 · '+audit.warnings.slice(0,4).join(' / ')+(audit.warnings.length>4?' / ...':'');}
  function auditPrecisionLayer(){return auditZoomStageLayer();}
  function fmtPrecisionAudit(audit){return fmtZoomStageAudit(audit);}
  function auditReleaseCandidate(){
    var warnings=[], notes=[], linkAudit=auditLinkIntegrity(), zoomAudit=auditZoomStageLayer();
    if(!linkAudit.ok) warnings.push('LINK AUDIT 경고 '+linkAudit.warnings.length+'건');
    if(!zoomAudit.ok) warnings.push('ZOOM STAGE 경고 '+zoomAudit.warnings.length+'건');
    if(WORLD_BUTTONS.length!==8) warnings.push('권역 버튼 수 불일치: '+WORLD_BUTTONS.length);
    if(!DATA_MODULE || !DATA_MODULE.DATA) warnings.push('지도 데이터 모듈 누락');
    if(!SUMMARY_MODULE || !SUMMARY_MODULE.REGION_INFO) warnings.push('권역 요약 데이터 모듈 누락');
    if(!LINK_MODULE || !LINK_MODULE.RECORD_LIBRARY) warnings.push('기록 연결 데이터 모듈 누락');
    var regionKeys=REGIONS.filter(function(r){return r.key!=='world';}).map(function(r){return r.key;});
    if(regionKeys.length!==8) warnings.push('상세 권역 수 불일치: '+regionKeys.length);
    regionKeys.forEach(function(k){var items=DATA[k]||[]; if(!items.length) warnings.push(regionDef(k).label+' 데이터 없음'); var q=qaWarnings(items); if(q.length) warnings.push(regionDef(k).label+' QA '+q.length+'건');});
    var expected='all,zone,zone-red,zone-yellow,zone-green,zone-white,zone-black,facility,anomaly,incident,blockade-node,blockade,review';
    if(FILTERS.map(function(f){return f.key;}).join(',')!==expected) warnings.push('필터 순서 불일치');
    if(root&&root.querySelector('.continental-map-shell,.continent-panel,.continent-filter,[data-map-item]')) warnings.push('구형 지도 DOM 잔재 감지');
    notes.push('권역 '+regionKeys.length+'개 / 필터 '+FILTERS.length+'개 / 색인 '+INDEX_FILTERS.length+'개');
    notes.push('링크 점검: '+fmtLinkAudit(linkAudit));
    notes.push('줌 단계 점검: '+fmtZoomStageAudit(zoomAudit));
    return {ok:!warnings.length,warnings:warnings,notes:notes,checks:RELEASE_CHECKS.slice(),regions:regionKeys.length,filters:FILTERS.length,indexFilters:INDEX_FILTERS.length,linkAudit:linkAudit,zoomAudit:zoomAudit,precisionAudit:zoomAudit};
  }
  function auditFinalHotfixReadiness(seed){
    seed=seed||{}; var warnings=[], notes=[], linkAudit=seed.linkAudit||auditLinkIntegrity(), releaseAudit=seed.releaseAudit||auditReleaseCandidate(), zoomAudit=seed.precisionAudit||seed.zoomAudit||auditZoomStageLayer(), regionItems=seed.regionItems||getRegionItems(state.region), visible=seed.visible||getVisibleItems(), indexRows=buildIndexRowsCached();
    if(!linkAudit.ok) linkAudit.warnings.forEach(function(w){warnings.push('LINK: '+w);});
    if(!releaseAudit.ok) releaseAudit.warnings.forEach(function(w){warnings.push('RC: '+w);});
    if(!zoomAudit.ok) zoomAudit.warnings.forEach(function(w){warnings.push('ZOOM: '+w);});
    if(root&&root.querySelector('.continental-map-shell,.continent-panel,.continent-filter,[data-map-item]')) warnings.push('구형 지도 DOM 잔재 감지');
    notes.push('검수 리포트 요약 압축 기준 적용');
    notes.push('문제 항목은 상단 문제 목록에 우선 출력');
    notes.push('최종 확인 항목: 자동 점검 / LINK AUDIT / RECORD INDEX / RELEASE CANDIDATE / ZOOM STAGE');
    return {ok:!warnings.length,warnings:warnings,notes:notes,linkAudit:linkAudit,releaseAudit:releaseAudit,precisionAudit:zoomAudit,zoomAudit:zoomAudit,indexRows:indexRows.length,visible:visible.length,total:regionItems.length,region:state.region,filter:state.filter};
  }
  function fmtFinalReadiness(audit){return audit.ok?'정상 · 경고 0건':'경고 '+audit.warnings.length+'건 · '+audit.warnings.slice(0,3).join(' / ')+(audit.warnings.length>3?' / ...':'');}
  function makeFinalHotfixReadinessReport(){
    var regionItems=getRegionItems(state.region), visible=getVisibleItems(), linkAudit=auditLinkIntegrity(), releaseAudit=auditReleaseCandidate(), zoomAudit=auditZoomStageLayer(), audit=auditFinalHotfixReadiness({linkAudit:linkAudit,releaseAudit:releaseAudit,zoomAudit:zoomAudit,regionItems:regionItems,visible:visible});
    var lines=[];
    lines.push('[U.A.C 지역지도 줌 단계 최종 점검 리포트]'); lines.push('버전: '+VERSION); lines.push('[요약]');
    lines.push('상태: '+(audit.ok?'정상':'경고')); lines.push('경고: '+audit.warnings.length+'건'); lines.push('권역/필터: '+regionLabel(state.region)+' ('+state.region+') / '+activeFilterLabel()+' ('+state.filter+')'); lines.push('줌 단계: '+zoomLabel()+' ('+state.zoom+') / '+(state.focus==='relation'?'관계권 중심':state.focus==='selected'?'선택 중심':'전체'));
    lines.push('표시/전체: '+audit.visible+' / '+audit.total); lines.push('LINK AUDIT: '+fmtLinkAudit(linkAudit)); lines.push('RECORD INDEX: '+indexKindLabel(activeIndexKind())+' / 검색어 '+(state.indexQuery||'-')+' / 항목 '+audit.indexRows); lines.push('RELEASE CANDIDATE: '+fmtReleaseAudit(releaseAudit)); lines.push('ZOOM STAGE: '+fmtZoomStageAudit(zoomAudit)); lines.push('문제 목록: '+(audit.warnings.length?audit.warnings.join(' / '):'없음')); lines.push('검수 메모: '+audit.notes.join(' / ')); return lines.join('\n');
  }
  function makeSelfReviewReport(){
    var r=regionDef(state.region), regionItems=getRegionItems(state.region), visible=getVisibleItems(), hidden=state.region==='world'?0:Math.max(0,regionItems.length-visible.length), selected=findItem(state.selected), typeLabels={zone:'오염 구역',facility:'작전 시설',anomaly:'현상 기록',incident:'사건 좌표','blockade-node':'봉쇄 거점',blockade:'봉쇄선',comms:'통신'}, zoneLabels={red:'레드존',yellow:'옐로우존',green:'그린존',white:'화이트존',black:'블랙존'}, lines=[];
    var linkAudit=auditLinkIntegrity(), releaseAudit=auditReleaseCandidate(), zoomAudit=auditZoomStageLayer(), finalAudit=auditFinalHotfixReadiness({linkAudit:linkAudit,releaseAudit:releaseAudit,zoomAudit:zoomAudit,regionItems:regionItems,visible:visible});
    lines.push('[U.A.C 지역지도 자체 검수 리포트]'); lines.push('버전: '+VERSION); lines.push('[요약]'); lines.push('상태: '+(finalAudit.ok?'정상':'경고')+' / 경고 '+finalAudit.warnings.length+'건'); lines.push('LINK AUDIT: '+(linkAudit.ok?'정상':'경고 '+linkAudit.warnings.length+'건')+' / RECORD INDEX: '+buildIndexRows().length+'개 / RELEASE CANDIDATE: '+(releaseAudit.ok?'정상':'경고 '+releaseAudit.warnings.length+'건')+' / ZOOM STAGE: '+(zoomAudit.ok?'정상':'경고 '+zoomAudit.warnings.length+'건'));
    if(finalAudit.warnings.length) lines.push('문제 목록: '+finalAudit.warnings.join(' / '));
    lines.push('권역: '+r.label+' ('+state.region+')'); lines.push('필터: '+activeFilterLabel()+' ('+state.filter+')'); lines.push('줌 단계: '+zoomLabel()+' ('+state.zoom+') / '+(state.focus==='relation'?'관계권 중심':state.focus==='selected'?'선택 중심':'전체')); lines.push('줌 단계 점검: '+fmtZoomStageAudit(zoomAudit)); lines.push('검수 모드: '+(state.review?'ON':'OFF')); lines.push('색인: '+indexKindLabel(activeIndexKind())+' / 검색어 '+(state.indexQuery||'-')+' / 항목 '+buildIndexRowsCached().length); lines.push('선택 요소: '+(selected?(selected.name+' / '+selected.id+' / 관계권 '+(selected.group||'-')+' / '+itemDetailLabel(selected)):'없음'));
    var navCtx=readRouteContext(); if(navCtx&&navCtx.mode) lines.push('이동 흐름: '+navCtx.mode+(navCtx.record?' / 기록 '+navCtx.record:'')+(navCtx.map&&navCtx.map.selected?' / 지도 '+navCtx.map.selected:''));
    lines.push('링크 무결성: '+fmtLinkAudit(linkAudit)); if(linkAudit.warnings.length) lines.push('링크 경고: '+linkAudit.warnings.join(' / ')); lines.push('릴리즈 후보 점검: '+fmtReleaseAudit(releaseAudit)); lines.push('최종 준비 점검: '+fmtFinalReadiness(finalAudit)); lines.push('성능/색인 점검: 캐시 '+Object.keys(PERF.indexCache).length+'개 / 표시 제한 '+indexDisplayLimit(activeIndexKind(),buildIndexRowsCached())+'개 / 현재 항목 '+buildIndexRowsCached().length+'개');
    if(selected){lines.push('연결 기록: '+relatedRecordKeys(selected).map(function(k){var rr=RECORD_LIBRARY[k]; return rr.title+'['+(rr.code||rr.record||rr.url||k)+']';}).join(' / ')); var rev=reverseBridgeRecordsForItem(selected); lines.push('역방향 지도 링크: '+(rev.length?rev.map(function(x){return x.record+'→'+selected.id;}).join(' / '):'내부 기록 브리지 없음'));}
    if(state.overlap&&state.overlap.ids&&state.overlap.ids.length>1) lines.push('겹친 선택 후보: '+state.overlap.ids.map(function(id){var oi=findItem(id); return oi?(oi.name+'['+id+']'):id;}).join(' / '));
    if(state.region==='world'){lines.push('세계지도 상태: 권역 선택 전용 / 데이터 레이어 없음 / 필터 숨김'); lines.push('권역 버튼 수: '+WORLD_BUTTONS.length); lines.push('검수 포인트: 버튼 위치, 지도 크롭, 양옆 여백, 권역 이동 여부'); return lines.join('\n');}
    lines.push('요소 수: 전체 '+regionItems.length+' / 표시 '+visible.length+' / 숨김 '+hidden); lines.push('표시 유형: '+fmtCounts(countBy(visible,function(it){return it.type;}),typeLabels)); lines.push('표시 존: '+fmtCounts(countBy(visible.filter(function(it){return it.type==='zone';}),function(it){return it.zone;}),zoneLabels)); lines.push('관계권: '+relationGroups(visible)); var warnings=qaWarnings(regionItems); lines.push('자동 점검: '+(warnings.length?warnings.join(' / '):'중복 ID·기본 필드 누락 없음')); lines.push('검수 포인트: 줌 단계별 표시, 점 표시 전환, 배치 관계성, 코드 라벨 일반 화면 비노출'); return lines.join('\n');
  }
  function renderSelfReview(forceReport){
    if(!els.selfMetrics) return;
    var regionItems=getRegionItems(state.region), visible=getVisibleItems(), selected=findItem(state.selected), zoneCount=visible.filter(function(it){return it.type==='zone';}).length, lineCount=visible.filter(function(it){return it.type==='blockade';}).length, dotCount=visible.filter(function(it){return itemDisplayMode(it)==='dot';}).length;
    var linkAudit=auditLinkIntegrity(), releaseAudit=auditReleaseCandidate(), zoomAudit=auditZoomStageLayer(), finalAudit=auditFinalHotfixReadiness({linkAudit:linkAudit,releaseAudit:releaseAudit,zoomAudit:zoomAudit,regionItems:regionItems,visible:visible});
    els.reviewState.textContent=state.region==='world'?'WORLD':(state.review?'REVIEW ON':'OPS VIEW');
    if(root){root.classList.toggle('r24-link-audit-warning',!linkAudit.ok); root.classList.toggle('r24-release-audit-warning',!releaseAudit.ok); root.classList.toggle('r24-final-audit-warning',!finalAudit.ok);}
    els.selfMetrics.innerHTML='<span><b>권역</b>'+esc(regionDef(state.region).label)+'</span><span><b>필터</b>'+esc(activeFilterLabel())+'</span><span><b>줌 단계</b>'+esc(zoomLabel()+'/'+(state.focus==='relation'?'관계권':state.focus==='selected'?'선택':'전체'))+'</span><span><b>색인</b>'+esc(indexKindLabel(activeIndexKind()))+'</span><span><b>표시/전체</b>'+visible.length+'/'+regionItems.length+'</span><span><b>점 표시</b>'+dotCount+'</span><span><b>존/선</b>'+zoneCount+'/'+lineCount+'</span><span><b>선택</b>'+esc(selected?selected.id:'-')+'</span><span><b>문서↔지도</b>'+esc(selected?reverseBridgeRecordsForItem(selected).length+'개':'-')+'</span><span><b>링크 점검</b>'+esc(linkAudit.ok?'정상':linkAudit.warnings.length+'건')+'</span><span><b>RC 점검</b>'+esc(releaseAudit.ok?'정상':releaseAudit.warnings.length+'건')+'</span><span><b>줌 점검</b>'+esc(zoomAudit.ok?'정상':zoomAudit.warnings.length+'건')+'</span><span><b>최종</b>'+esc(finalAudit.ok?'정상':finalAudit.warnings.length+'건')+'</span><span><b>색인 캐시</b>'+Object.keys(PERF.indexCache).length+'</span><span><b>복귀 기록</b>'+esc(state.returnRecord||'-')+'</span>';
    if(els.linkAudit) els.linkAudit.innerHTML='<b>FINAL CHECK</b><span class="'+(finalAudit.ok?'ok':'warn')+'">'+esc(fmtFinalReadiness(finalAudit))+'<br>LINK '+esc(linkAudit.ok?'정상':linkAudit.warnings.length+'건')+' · RC '+esc(releaseAudit.ok?'정상':releaseAudit.warnings.length+'건')+' · ZOOM '+esc(zoomAudit.ok?'정상':zoomAudit.warnings.length+'건')+'</span>';
    if(forceReport||(!els.reportText.value&&state.region!=='world')) els.reportText.value=makeSelfReviewReport();
  }


  /* R48 — DetailMapPanAndWheelZoomControlPass
     - World selector remains non-zoomable and non-draggable.
     - Detail maps use mouse wheel for zoom 1~5.
     - Zoom 2~5 allow limited drag panning. */

  /* R49 — NoAutoRecenteringOnSelection
     - Normal marker/zone/line/list/overlap selection no longer forces selected-focus recentering.
     - User pan position is preserved while selecting nearby elements.
     - Only explicit focus buttons, record/index jumps, return snapshots, or zoom reset change focus/pan intentionally. */
  VERSION='5.8.1R-49 NoAutoRecenteringOnSelection';
  if(RELEASE_CHECKS.indexOf('detail-map-pan-wheel-zoom')===-1) RELEASE_CHECKS.push('detail-map-pan-wheel-zoom');
  if(RELEASE_CHECKS.indexOf('no-auto-recenter-on-selection')===-1) RELEASE_CHECKS.push('no-auto-recenter-on-selection');
  var PAN_WHEEL_ZOOM={version:'5.8.1R-49',panFromZoom:2,wheelZoom:true,worldLocked:true,noAutoRecenterOnSelection:true};
  state.panX=Number(state.panX)||0;
  state.panY=Number(state.panY)||0;
  state.isPanning=false;
  state.panMoved=false;
  state.panClickBlock=false;
  state.panStart=null;

  function canPanDetailMap(){return state.region!=='world' && zoomLevel(state.zoom)>=2;}
  function panMaxForZoom(){var lv=zoomLevel(state.zoom); return lv>=5?62:(lv>=4?50:(lv>=3?38:(lv>=2?25:0)));}
  function normalizePan(){
    if(!canPanDetailMap()){state.panX=0; state.panY=0; return;}
    var max=panMaxForZoom();
    state.panX=clamp(Number(state.panX)||0,-max,max);
    state.panY=clamp(Number(state.panY)||0,-max,max);
  }
  function resetPan(){state.panX=0; state.panY=0;}
  function ensurePanWheelHandlers(){
    if(!els||!els.stage||els.stage.dataset.r48PanWheelBound==='1') return;
    els.stage.dataset.r48PanWheelBound='1';
    els.stage.addEventListener('wheel',handleStageWheel,{passive:false});
    els.stage.addEventListener('pointerdown',handlePanPointerDown);
    window.addEventListener('pointermove',handlePanPointerMove);
    window.addEventListener('pointerup',handlePanPointerUp);
    window.addEventListener('pointercancel',handlePanPointerUp);
  }
  function handleStageWheel(ev){
    if(state.region==='world') return;
    if(!ev) return;
    ev.preventDefault();
    ev.stopPropagation();
    var cur=zoomLevel(state.zoom);
    var next=cur + (ev.deltaY<0?1:-1);
    next=clamp(next,1,5);
    if(next===cur) return;
    setZoomMode(zoomKeyForLevel(next),{keepPan:true,source:'wheel'});
  }
  function handlePanPointerDown(ev){
    if(!canPanDetailMap() || !ev || ev.button!==0) return;
    if(ev.target&&ev.target.closest&&ev.target.closest('.r24-item,.r24-overlap-menu,.r24-world-btn,button,input,textarea')) return;
    state.isPanning=true; state.panMoved=false; state.panClickBlock=false;
    state.panStart={x:ev.clientX,y:ev.clientY,panX:Number(state.panX)||0,panY:Number(state.panY)||0};
    if(els.stage){els.stage.classList.add('r48-panning'); try{els.stage.setPointerCapture(ev.pointerId);}catch(e){}}
  }
  function handlePanPointerMove(ev){
    if(!state.isPanning||!state.panStart||!els.stage) return;
    var box=els.stage.getBoundingClientRect();
    var dx=((ev.clientX-state.panStart.x)/(box.width||1))*100;
    var dy=((ev.clientY-state.panStart.y)/(box.height||1))*100;
    if(Math.abs(dx)>0.25||Math.abs(dy)>0.25) state.panMoved=true;
    state.panX=state.panStart.panX+dx;
    state.panY=state.panStart.panY+dy;
    normalizePan();
    updateZoomView();
  }
  function handlePanPointerUp(ev){
    if(!state.isPanning) return;
    if(els.stage){els.stage.classList.remove('r48-panning'); try{els.stage.releasePointerCapture(ev&&ev.pointerId);}catch(e){}}
    if(state.panMoved){state.panClickBlock=true; setTimeout(function(){state.panClickBlock=false;},80); saveMapSnapshot({source:'pan'});}
    state.isPanning=false; state.panStart=null;
  }
  function setZoomMode(key,opts){
    opts=opts||{};
    if(state.region==='world') return;
    var prev=state.zoom;
    state.zoom=zoomModeDef(key).key;
    if(zoomLevel(state.zoom)<=1){state.focus='none'; resetPan();}
    else {
      if(!opts.keepPan) resetPan();
      else normalizePan();
      // R49: zooming should not automatically recenter on the currently selected element.
      // Focus is changed only by explicit focus controls or external navigation.
    }
    if(prev!==state.zoom) saveMapSnapshot({source:opts.source||'zoom'});
    render();
  }
  function setZoomFocus(mode){
    if(state.region==='world') return;
    if(mode==='selected' && !findItem(state.selected)) return;
    if(mode==='relation'){
      var it=findItem(state.selected);
      if(!it||!it.group) return;
    }
    state.focus=mode;
    if(state.focus!=='none' && zoomLevel(state.zoom)<3) state.zoom='z3';
    resetPan();
    render();
  }
  function clearZoomFocus(){state.zoom='z1'; state.focus='none'; resetPan(); render();}
  function setRegion(key){state.region=key; state.selected=null; state.overlap=null; state.filter='all'; state.indexQuery=''; state.returnRecord=null; state.zoom='z1'; state.focus='none'; resetPan(); invalidatePerfCache(); render(); saveMapSnapshot({source:'region'});}
  function updateZoomView(){
    if(!root) return;
    ensurePanWheelHandlers();
    if(state.region==='world' || state.zoom==='z1'){
      resetPan();
      root.style.setProperty('--r44-zoom-scale','1');
      root.style.setProperty('--r44-pan-x','0%');
      root.style.setProperty('--r44-pan-y','0%');
      root.dataset.pan='0';
      return;
    }
    normalizePan();
    var z=zoomModeDef(state.zoom), b=focusBounds(), cx=VIEW.w/2, cy=VIEW.h/2;
    if(b){cx=(b.x1+b.x2)/2; cy=(b.y1+b.y2)/2;}
    cx=clamp(cx,VIEW.w*.10,VIEW.w*.90); cy=clamp(cy,VIEW.h*.12,VIEW.h*.88);
    var cxp=cx/VIEW.w*100, cyp=cy/VIEW.h*100;
    var tx=50-z.scale*cxp + (Number(state.panX)||0);
    var ty=50-z.scale*cyp + (Number(state.panY)||0);
    var maxPan=zoomLevel(state.zoom)>=5?70:(zoomLevel(state.zoom)>=4?58:(zoomLevel(state.zoom)>=3?46:34));
    tx=clamp(tx,-maxPan,24); ty=clamp(ty,-maxPan,24);
    root.style.setProperty('--r44-zoom-scale',String(z.scale));
    root.style.setProperty('--r44-pan-x',tx.toFixed(3)+'%');
    root.style.setProperty('--r44-pan-y',ty.toFixed(3)+'%');
    root.dataset.pan=canPanDetailMap()?'1':'0';
  }
  function renderZoomControls(){
    if(!els.zoomControls) return;
    if(state.region==='world'){els.zoomControls.hidden=true; els.zoomControls.innerHTML=''; return;}
    var selected=findItem(state.selected), canSelected=!!selected, canRelation=!!(selected&&selected.group);
    els.zoomControls.hidden=false;
    var zdef=zoomModeDef(state.zoom), panText=canPanDetailMap()?'드래그 이동 가능':'전체 고정';
    els.zoomControls.innerHTML='<div class="r44-control-head r48-control-head"><b>TACTICAL ZOOM</b><span>'+esc(zoomLabel())+' / 휠 확대·축소 / '+esc(panText)+' / '+esc(state.focus==='relation'?'관계권 중심':state.focus==='selected'?'선택 중심':'수동 위치 유지')+'</span></div><div class="r44-zoom-row r47-zoom-row">'+ZOOM_MODES.map(function(z){return '<button type="button" data-r44-zoom="'+esc(z.key)+'" class="'+(state.zoom===z.key?'active':'')+'"><b>'+esc(z.label)+'</b><small>'+esc(z.summary)+'</small></button>';}).join('')+'</div><div class="r44-zoom-row focus"><button type="button" data-r44-focus="selected" '+(canSelected?'':'disabled')+' class="'+(state.focus==='selected'?'active':'')+'">선택 중심</button><button type="button" data-r44-focus="relation" '+(canRelation?'':'disabled')+' class="'+(state.focus==='relation'?'active':'')+'">관계권 중심</button><button type="button" data-r44-clear="1">줌/위치 초기화</button></div><div class="r48-pan-hint">마우스 휠: 줌 1~5 전환 · 줌 2~5: 빈 지도 영역 드래그 이동 · 일반 선택은 현재 위치 유지 · 세계지도: 고정</div>';
  }
  function handleStageClick(ev){
    if(state.panClickBlock){state.panClickBlock=false; return;}
    if(state.region==='world') return;
    if(ev.target&&ev.target.closest&&ev.target.closest('.r24-item,.r24-overlap-menu,.r24-world-btn')) return;
    state.selected=null; state.overlap=null; if(state.focus!=='none') state.focus='none'; updateSelected(); highlight(); updateOverlapMenu(); updateZoomView(); renderZoomControls();
  }

  /* R49 final selection handlers: select without implicit recenter/focus. */
  function preserveManualViewOnSelection(){
    // If an explicit focus mode was active, normal map/list/overlap selection returns to manual pan view.
    // External navigation can still request keepFocus:'selected' or keepFocus:'relation'.
    if(state.focus!=='none') state.focus='none';
    normalizePan();
  }
  function bindItem(g,it){
    g.addEventListener('click',function(ev){ev.stopPropagation(); selectItemFromPointer(it,ev);});
    g.addEventListener('keydown',function(ev){
      if(ev.key==='Enter'||ev.key===' '){
        ev.preventDefault();
        state.overlap=null;
        state.selected=it.id;
        preserveManualViewOnSelection();
        saveMapSnapshot({source:'keyboard'});
        render();
      }
    });
  }
  function selectItemFromPointer(it,ev){
    var pt=eventSvgPoint(ev), ui=eventStagePoint(ev);
    var candidates=pt?overlapCandidates(pt[0],pt[1],it):[it];
    state.selected=it.id;
    preserveManualViewOnSelection();
    saveMapSnapshot({source:'select'});
    if(candidates.length>1){
      state.overlap={x:ui?ui[0]:16,y:ui?ui[1]:16,ids:candidates.map(function(x){return x.id;})};
    } else {
      state.overlap=null;
    }
    render();
  }
  function handleOverlapMenuClick(ev){
    var btn=ev.target&&ev.target.closest?ev.target.closest('[data-r24-overlap-pick]'):null;
    if(!btn) return;
    ev.preventDefault(); ev.stopPropagation();
    state.selected=btn.getAttribute('data-r24-overlap-pick');
    preserveManualViewOnSelection();
    saveMapSnapshot({source:'overlap'});
    state.overlap=null;
    render();
  }
  function addListItem(it){
    var b=ce('button','r24-node-row'); b.type='button';
    var mode=itemDisplayMode(it)==='dot'?'점 표시':'표시';
    b.innerHTML='<b>'+esc(it.name)+'</b><span>'+esc(typeLabel(it))+(it.zone?' · '+zoneLabel(it.zone):'')+' · '+esc(itemDetailLabel(it))+' · '+mode+'</span>';
    b.addEventListener('click',function(){
      state.selected=it.id;
      preserveManualViewOnSelection();
      saveMapSnapshot({source:'list'});
      render();
    });
    els.list.appendChild(b);
  }
  function auditNoAutoRecenterOnSelection(){
    var warnings=[], notes=[];
    if(!PAN_WHEEL_ZOOM.noAutoRecenterOnSelection) warnings.push('선택 시 자동 중심 복귀 방지 설정 누락');
    notes.push('일반 마커/존/선/목록/겹침 후보 선택은 panX/panY와 수동 위치를 유지');
    notes.push('선택 중심/관계권 중심 버튼, 색인·문서 점프, 줌·위치 초기화만 초점을 명시 변경');
    return {ok:!warnings.length,warnings:warnings,notes:notes};
  }
  function makeNoAutoRecenterReport(){
    var a=auditNoAutoRecenterOnSelection();
    return '[U.A.C 지역지도 선택 위치 유지 검수 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n현재: '+regionLabel(state.region)+' / '+zoomLabel()+' / focus '+state.focus+' / pan '+(Number(state.panX)||0).toFixed(2)+','+(Number(state.panY)||0).toFixed(2)+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');
  }

  function auditPanWheelZoom(){
    var warnings=[], notes=[];
    if(!PAN_WHEEL_ZOOM.wheelZoom) warnings.push('마우스 휠 줌 설정 누락');
    if(!PAN_WHEEL_ZOOM.worldLocked) warnings.push('세계지도 줌 잠금 설정 누락');
    if(ZOOM_MODES.length!==5) warnings.push('줌 단계 수 불일치: '+ZOOM_MODES.length);
    if(!PAN_WHEEL_ZOOM.noAutoRecenterOnSelection) warnings.push('선택 시 자동 중심 복귀 방지 설정 누락');
    notes.push('상세지도 줌 1~5 / 휠 전환 / 줌2~5 제한 드래그 / 일반 선택 위치 유지 / 세계지도 고정');
    return {ok:!warnings.length,warnings:warnings,notes:notes,panFromZoom:PAN_WHEEL_ZOOM.panFromZoom};
  }
  function makePanWheelZoomReport(){var a=auditPanWheelZoom(); return '[U.A.C 지역지도 줌·드래그 검수 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n현재: '+regionLabel(state.region)+' / '+zoomLabel()+' / pan '+(Number(state.panX)||0).toFixed(2)+','+(Number(state.panY)||0).toFixed(2)+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');}
  function resetToWorld(){state.region='world'; state.filter='all'; state.review=false; state.selected=null; state.overlap=null; state.returnRecord=null; state.zoom='z1'; state.focus='none'; resetPan(); render();}
  /* R50 — MapInteractionStabilityPolish
     - Keeps R47 zoom-stage reveal and R49 no-auto-recenter behavior.
     - Adds tighter pan bounds, wheel zoom cooldown, cursor-aware zoom adjustment,
       stronger selected/related feedback, overlap-menu clamping, and state reporting. */
  VERSION='5.8.1R-50 MapInteractionStabilityPolish';
  if(RELEASE_CHECKS.indexOf('map-interaction-stability-polish')===-1) RELEASE_CHECKS.push('map-interaction-stability-polish');
  if(typeof PAN_WHEEL_ZOOM==='object'){
    PAN_WHEEL_ZOOM.version='5.8.1R-50';
    PAN_WHEEL_ZOOM.interactionStabilityPolish=true;
    PAN_WHEEL_ZOOM.wheelCooldownMs=135;
    PAN_WHEEL_ZOOM.cursorAwareWheel=true;
    PAN_WHEEL_ZOOM.clampedPanBounds=true;
  }
  state.lastWheelAt=0;
  state.lastWheelDirection=0;
  state.panBoundHit=false;
  state.panLastSavedAt=0;

  function stagePointPercent(ev){
    if(!els.stage||!ev) return {x:50,y:50};
    var box=els.stage.getBoundingClientRect();
    var x=((ev.clientX-box.left)/(box.width||1))*100;
    var y=((ev.clientY-box.top)/(box.height||1))*100;
    return {x:clamp(x,0,100),y:clamp(y,0,100)};
  }
  function focusCenterPercent(){
    var b=focusBounds(), cx=VIEW.w/2, cy=VIEW.h/2;
    if(b){cx=(b.x1+b.x2)/2; cy=(b.y1+b.y2)/2;}
    cx=clamp(cx,VIEW.w*.10,VIEW.w*.90); cy=clamp(cy,VIEW.h*.12,VIEW.h*.88);
    return {x:cx/VIEW.w*100,y:cy/VIEW.h*100};
  }
  function panLimitForZoom(key){
    var lv=zoomLevel(key||state.zoom);
    if(lv<=1) return {x:0,y:0};
    if(lv===2) return {x:18,y:15};
    if(lv===3) return {x:31,y:25};
    if(lv===4) return {x:44,y:34};
    return {x:58,y:44};
  }
  function normalizePan(){
    if(!canPanDetailMap()){state.panX=0; state.panY=0; state.panBoundHit=false; return;}
    var lim=panLimitForZoom(state.zoom), px=Number(state.panX)||0, py=Number(state.panY)||0;
    var nx=clamp(px,-lim.x,lim.x), ny=clamp(py,-lim.y,lim.y);
    state.panBoundHit=(nx!==px||ny!==py);
    state.panX=nx; state.panY=ny;
  }
  function panMagnitude(){return Math.round(Math.hypot(Number(state.panX)||0,Number(state.panY)||0));}
  function panStateLabel(){
    if(state.region==='world') return 'WORLD LOCKED';
    if(!canPanDetailMap()) return 'PAN LOCKED';
    var moved=panMagnitude();
    return 'PAN '+(moved?'OFFSET '+moved:'READY')+(state.panBoundHit?' / BOUND':'');
  }
  function savePanSnapshotThrottled(){
    var now=Date.now();
    if(now-(state.panLastSavedAt||0)>260){state.panLastSavedAt=now; saveMapSnapshot({source:'pan-live'});}
  }
  function handleStageWheel(ev){
    if(state.region==='world') return;
    if(!ev||state.isPanning) return;
    ev.preventDefault();
    ev.stopPropagation();
    var now=Date.now(), dy=Number(ev.deltaY)||0;
    if(Math.abs(dy)<6) return;
    var dir=dy<0?1:-1;
    if(now-(state.lastWheelAt||0)<PAN_WHEEL_ZOOM.wheelCooldownMs && dir===state.lastWheelDirection) return;
    state.lastWheelAt=now; state.lastWheelDirection=dir;
    var cur=zoomLevel(state.zoom), next=clamp(cur+dir,1,5);
    if(next===cur) return;
    var oldScale=zoomModeDef(state.zoom).scale||1, nextKey=zoomKeyForLevel(next), nextScale=zoomModeDef(nextKey).scale||1;
    if(next>1){
      var p=stagePointPercent(ev), c=focusCenterPercent();
      state.panX=(Number(state.panX)||0)+(oldScale-nextScale)*(p.x-c.x);
      state.panY=(Number(state.panY)||0)+(oldScale-nextScale)*(p.y-c.y);
    }
    setZoomMode(nextKey,{keepPan:true,source:'wheel'});
  }
  function handlePanPointerDown(ev){
    if(!canPanDetailMap() || !ev || ev.button!==0) return;
    if(ev.target&&ev.target.closest&&ev.target.closest('.r24-item,.r24-overlap-menu,.r24-world-btn,button,input,textarea,a')) return;
    state.isPanning=true; state.panMoved=false; state.panClickBlock=false; state.panBoundHit=false;
    state.panStart={x:ev.clientX,y:ev.clientY,panX:Number(state.panX)||0,panY:Number(state.panY)||0};
    if(els.stage){els.stage.classList.add('r48-panning','r50-panning'); try{els.stage.setPointerCapture(ev.pointerId);}catch(e){}}
  }
  function handlePanPointerMove(ev){
    if(!state.isPanning||!state.panStart||!els.stage) return;
    var box=els.stage.getBoundingClientRect();
    var damp=zoomLevel(state.zoom)>=5?.92:1;
    var dx=((ev.clientX-state.panStart.x)/(box.width||1))*100*damp;
    var dy=((ev.clientY-state.panStart.y)/(box.height||1))*100*damp;
    if(Math.abs(dx)>0.18||Math.abs(dy)>0.18) state.panMoved=true;
    state.panX=state.panStart.panX+dx;
    state.panY=state.panStart.panY+dy;
    normalizePan();
    updateZoomView();
    if(root){root.dataset.panState=panStateLabel();}
    savePanSnapshotThrottled();
  }
  function handlePanPointerUp(ev){
    if(!state.isPanning) return;
    if(els.stage){els.stage.classList.remove('r48-panning','r50-panning'); try{els.stage.releasePointerCapture(ev&&ev.pointerId);}catch(e){}}
    normalizePan();
    updateZoomView();
    if(state.panMoved){state.panClickBlock=true; setTimeout(function(){state.panClickBlock=false;},110); saveMapSnapshot({source:'pan'});}
    state.isPanning=false; state.panStart=null;
  }
  function setZoomMode(key,opts){
    opts=opts||{};
    if(state.region==='world') return;
    var prev=state.zoom, prevLevel=zoomLevel(prev);
    state.zoom=zoomModeDef(key).key;
    if(zoomLevel(state.zoom)<=1){state.focus='none'; resetPan();}
    else {
      if(!opts.keepPan) resetPan();
      normalizePan();
      // R49/R50: normal zooming never auto-recenters on a selected element.
    }
    if(prev!==state.zoom || prevLevel!==zoomLevel(state.zoom)) saveMapSnapshot({source:opts.source||'zoom'});
    render();
  }
  function updateZoomView(){
    if(!root) return;
    ensurePanWheelHandlers();
    root.dataset.zoomLevel=String(zoomLevel(state.zoom));
    root.dataset.panState=panStateLabel();
    if(state.region==='world' || state.zoom==='z1'){
      resetPan();
      root.style.setProperty('--r44-zoom-scale','1');
      root.style.setProperty('--r44-pan-x','0%');
      root.style.setProperty('--r44-pan-y','0%');
      root.dataset.pan='0';
      root.dataset.panRange='0/0';
      if(els.stage){els.stage.dataset.panRange='0/0'; els.stage.dataset.panState=panStateLabel();}
      return;
    }
    normalizePan();
    var z=zoomModeDef(state.zoom), c=focusCenterPercent();
    var tx=50-z.scale*c.x+(Number(state.panX)||0);
    var ty=50-z.scale*c.y+(Number(state.panY)||0);
    var stageLimit=panLimitForZoom(state.zoom), maxX=stageLimit.x+18, maxY=stageLimit.y+18;
    tx=clamp(tx,-maxX,22); ty=clamp(ty,-maxY,22);
    root.style.setProperty('--r44-zoom-scale',String(z.scale));
    root.style.setProperty('--r44-pan-x',tx.toFixed(3)+'%');
    root.style.setProperty('--r44-pan-y',ty.toFixed(3)+'%');
    root.dataset.pan=canPanDetailMap()?'1':'0';
    root.dataset.panRange=stageLimit.x+'/'+stageLimit.y;
    if(els.stage){els.stage.dataset.panRange=stageLimit.x+'/'+stageLimit.y; els.stage.dataset.panState=panStateLabel();}
  }
  function renderZoomControls(){
    if(!els.zoomControls) return;
    if(state.region==='world'){els.zoomControls.hidden=true; els.zoomControls.innerHTML=''; return;}
    var selected=findItem(state.selected), canSelected=!!selected, canRelation=!!(selected&&selected.group);
    els.zoomControls.hidden=false;
    var zdef=zoomModeDef(state.zoom), panText=panStateLabel(), moved=panMagnitude();
    els.zoomControls.innerHTML='<div class="r44-control-head r48-control-head r50-control-head"><b>TACTICAL ZOOM</b><span>'+esc(zoomLabel())+' / '+esc(zdef.summary||'')+' / '+esc(panText)+'</span></div><div class="r50-operating-state"><b>상태</b><span>'+esc(regionLabel(state.region))+' · '+esc(zoomLabel())+' · '+esc(canPanDetailMap()?'드래그 가능':'전체 고정')+' · 위치 '+esc(String(moved))+'</span></div><div class="r44-zoom-row r47-zoom-row">'+ZOOM_MODES.map(function(z){return '<button type="button" data-r44-zoom="'+esc(z.key)+'" class="'+(state.zoom===z.key?'active':'')+'"><b>'+esc(z.label)+'</b><small>'+esc(z.summary)+'</small></button>';}).join('')+'</div><div class="r44-zoom-row focus"><button type="button" data-r44-focus="selected" '+(canSelected?'':'disabled')+' class="'+(state.focus==='selected'?'active':'')+'">선택 중심</button><button type="button" data-r44-focus="relation" '+(canRelation?'':'disabled')+' class="'+(state.focus==='relation'?'active':'')+'">관계권 중심</button><button type="button" data-r44-clear="1">줌/위치 초기화</button></div><div class="r48-pan-hint r50-pan-hint">마우스 휠: 줌 1~5 단계 전환 · 줌 2~5: 빈 지도 영역 드래그 · 이동 범위 제한 적용 · 일반 선택은 현재 위치 유지</div>';
  }
  function updateOverlapMenu(){
    if(!els.overlap) return;
    var ov=state.overlap;
    if(!ov||!ov.ids||ov.ids.length<2||state.region==='world'){
      els.overlap.hidden=true; els.overlap.innerHTML=''; return;
    }
    var r=els.stage?els.stage.getBoundingClientRect():{width:320,height:220};
    var menuW=Math.min(276,Math.max(220,(r.width||320)-22)), menuH=Math.min(230,Math.max(160,(r.height||220)-22));
    var left=clamp((Number(ov.x)||0)+12,8,Math.max(8,(r.width||320)-menuW-8));
    var top=clamp((Number(ov.y)||0)+12,8,Math.max(8,(r.height||220)-menuH-8));
    els.overlap.style.left=left+'px'; els.overlap.style.top=top+'px'; els.overlap.style.width=menuW+'px'; els.overlap.style.maxHeight=menuH+'px';
    var items=ov.ids.map(findItem).filter(Boolean).sort(function(a,b){
      var sel=findItem(state.selected), sg=sel&&sel.group; var ag=a.group===sg?0:1, bg=b.group===sg?0:1;
      return ag-bg || itemZoomMin(a)-itemZoomMin(b) || String(a.name).localeCompare(String(b.name),'ko');
    });
    var shown=items.slice(0,PERF.overlapMaxRows), more=Math.max(0,items.length-shown.length);
    els.overlap.innerHTML='<b>겹친 요소 선택</b><span>후보 '+items.length+'개 · 현재 화면 위치 유지</span><div>'+shown.map(function(it){return '<button type="button" data-r24-overlap-pick="'+esc(it.id)+'" class="'+(it.id===state.selected?'active':'')+'"><strong>'+esc(it.name)+'</strong><em><i>'+esc(typeLabel(it))+'</i>'+(it.zone?' · '+zoneLabel(it.zone):'')+' · '+esc(it.group||'-')+' · '+esc(itemDisplayMode(it)==='dot'?'점':'상세')+(state.review?' / '+esc(it.id):'')+'</em></button>';}).join('')+(more?'<p class="r24-overlap-more">추가 후보 '+more+'개는 색인 검색 또는 필터 전환으로 확인</p>':'')+'</div>';
    els.overlap.hidden=false;
  }
  function auditMapInteractionStability(){
    var warnings=[], notes=[];
    if(!PAN_WHEEL_ZOOM.interactionStabilityPolish) warnings.push('R50 조작 안정화 플래그 누락');
    if(!PAN_WHEEL_ZOOM.cursorAwareWheel) warnings.push('마우스 위치 기반 휠 줌 보정 설정 누락');
    if(!PAN_WHEEL_ZOOM.clampedPanBounds) warnings.push('드래그 이동 범위 제한 설정 누락');
    if(PAN_WHEEL_ZOOM.wheelCooldownMs<100) warnings.push('휠 줌 쿨다운이 너무 짧음: '+PAN_WHEEL_ZOOM.wheelCooldownMs+'ms');
    notes.push('휠 쿨다운 '+PAN_WHEEL_ZOOM.wheelCooldownMs+'ms');
    notes.push('현재 '+regionLabel(state.region)+' / '+zoomLabel()+' / '+panStateLabel()+' / pan '+(Number(state.panX)||0).toFixed(2)+','+(Number(state.panY)||0).toFixed(2));
    notes.push('줌2~5 제한 드래그, 줌1·세계지도 고정, 일반 선택 위치 유지');
    return {ok:!warnings.length,warnings:warnings,notes:notes,pan:canPanDetailMap(),panX:Number(state.panX)||0,panY:Number(state.panY)||0,panRange:panLimitForZoom(state.zoom),wheelCooldown:PAN_WHEEL_ZOOM.wheelCooldownMs};
  }
  function makeInteractionStabilityReport(){
    var a=auditMapInteractionStability();
    return '[U.A.C 지역지도 조작 안정화 검수 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n현재: '+regionLabel(state.region)+' / '+zoomLabel()+' / '+panStateLabel()+'\n이동값: '+a.panX.toFixed(2)+','+a.panY.toFixed(2)+' / 범위 '+a.panRange.x+','+a.panRange.y+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');
  }
  function auditPanWheelZoom(){
    var warnings=[], notes=[], interaction=auditMapInteractionStability();
    if(!PAN_WHEEL_ZOOM.wheelZoom) warnings.push('마우스 휠 줌 설정 누락');
    if(!PAN_WHEEL_ZOOM.worldLocked) warnings.push('세계지도 줌 잠금 설정 누락');
    if(ZOOM_MODES.length!==5) warnings.push('줌 단계 수 불일치: '+ZOOM_MODES.length);
    if(!PAN_WHEEL_ZOOM.noAutoRecenterOnSelection) warnings.push('선택 시 자동 중심 복귀 방지 설정 누락');
    if(!interaction.ok) interaction.warnings.forEach(function(w){warnings.push('조작 안정화: '+w);});
    notes.push('상세지도 줌 1~5 / 휠 쿨다운 / 마우스 위치 기반 줌 보정 / 줌2~5 제한 드래그 / 세계지도 고정');
    return {ok:!warnings.length,warnings:warnings,notes:notes,panFromZoom:PAN_WHEEL_ZOOM.panFromZoom,interaction:interaction};
  }
  function makePanWheelZoomReport(){var a=auditPanWheelZoom(); return '[U.A.C 지역지도 줌·드래그 검수 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n현재: '+regionLabel(state.region)+' / '+zoomLabel()+' / '+panStateLabel()+' / pan '+(Number(state.panX)||0).toFixed(2)+','+(Number(state.panY)||0).toFixed(2)+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');}


  /* R51 — TacticalDisplayPolish
     - Adds restrained Division-like tactical readability without changing the lore/data model.
     - Adds priority hierarchy, relation operation-frame overlay, blockade endpoints/direction cues,
       and a zoom-gated on-map tactical info card. */
  VERSION='5.8.1R-51 TacticalDisplayPolish';
  if(RELEASE_CHECKS.indexOf('tactical-display-polish')===-1) RELEASE_CHECKS.push('tactical-display-polish');
  var TACTICAL_DISPLAY_POLISH=DATA_MODULE.TACTICAL_DISPLAY_POLISH||{version:VERSION};

  function tacticalPriority(it){
    if(!it) return 'support';
    if(it.zone==='black' || (it.type==='zone'&&it.zone==='red') || it.scale==='xlarge' || it.scale==='large') return 'core';
    if(itemZoomMin(it)<=2 || it.type==='blockade') return 'primary';
    if(itemZoomMin(it)>=4 || it.scale==='small') return 'support';
    return 'standard';
  }
  function tacticalPriorityClass(it){return ' r51-priority-'+tacticalPriority(it)+' r51-stage-'+itemZoomMin(it);}
  function shortLabel(text,max){text=String(text||''); max=max||28; return text.length>max?text.slice(0,max-1)+'…':text;}
  function cardStatusKey(it){
    if(!it) return 'none';
    if(it.zone==='black'||it.zone==='red'||it.type==='incident') return 'hostile';
    if(it.zone==='yellow'||it.type==='anomaly'||it.type==='comms') return 'watch';
    if(it.type==='blockade'||it.type==='blockade-node') return 'control';
    if(it.zone==='green'||it.zone==='white'||it.type==='facility') return 'managed';
    return 'unknown';
  }
  function relationItemsForSelected(){
    var sel=findItem(state.selected);
    if(!sel||!sel.group||state.region==='world') return [];
    return (DATA[state.region]||[]).filter(function(it){return it.group===sel.group && filterMatches(it,state.filter);});
  }
  function tacticalBounds(items){
    var pts=[];
    (items||[]).forEach(function(it){
      var p=itemAnchor(it);
      if(p) pts.push(p);
      if(it.type==='blockade'&&it.points&&it.points.length){
        it.points.forEach(function(pt){pts.push(xy(state.region,pt[0],pt[1]));});
      }
    });
    if(!pts.length) return null;
    var x1=Infinity,y1=Infinity,x2=-Infinity,y2=-Infinity;
    pts.forEach(function(p){x1=Math.min(x1,p[0]);y1=Math.min(y1,p[1]);x2=Math.max(x2,p[0]);y2=Math.max(y2,p[1]);});
    var pad=zoomLevel(state.zoom)>=4?42:34;
    x1=clamp(x1-pad,16,VIEW.w-18); y1=clamp(y1-pad,16,VIEW.h-18); x2=clamp(x2+pad,18,VIEW.w-16); y2=clamp(y2+pad,18,VIEW.h-16);
    return {x1:x1,y1:y1,x2:x2,y2:y2,cx:(x1+x2)/2,cy:(y1+y2)/2,w:Math.max(38,x2-x1),h:Math.max(32,y2-y1)};
  }
  function renderTacticalRelationOverlay(){
    if(state.region==='world'||!state.selected||zoomLevel(state.zoom)<2) return;
    var sel=findItem(state.selected), items=relationItemsForSelected();
    if(!sel||!sel.group||items.length<2) return;
    var b=tacticalBounds(items); if(!b) return;
    var g=se('g',{class:'r51-relation-overlay r51-card-status-'+cardStatusKey(sel),'data-r51-group':sel.group});
    g.appendChild(se('rect',{x:b.x1.toFixed(1),y:b.y1.toFixed(1),width:b.w.toFixed(1),height:b.h.toFixed(1),rx:Math.min(34,Math.max(12,b.w*.08)).toFixed(1),class:'r51-relation-ring'}));
    if(zoomLevel(state.zoom)>=4){
      var anchors=items.map(function(it){return {it:it,p:itemAnchor(it)};}).filter(function(x){return !!x.p;}).slice(0,10);
      anchors.forEach(function(x){g.appendChild(se('line',{x1:b.cx.toFixed(1),y1:b.cy.toFixed(1),x2:x.p[0].toFixed(1),y2:x.p[1].toFixed(1),class:'r51-relation-trace'}));});
    }
    var tag=se('text',{x:clamp(b.x1+12,20,VIEW.w-220).toFixed(1),y:clamp(b.y1-10,24,VIEW.h-20).toFixed(1),class:'r51-relation-tag'});
    tag.textContent='OP-GROUP / '+sel.group+' / '+items.length+' nodes';
    g.appendChild(tag);
    els.svg.appendChild(g);
  }
  function renderTacticalInfoCard(){
    if(state.region==='world'||!state.selected||zoomLevel(state.zoom)<3) return;
    var it=findItem(state.selected); if(!it) return;
    var p=itemAnchor(it); if(!p) return;
    var w=270,h=74;
    var x=clamp(p[0]+28,16,VIEW.w-w-16), y=clamp(p[1]-88,18,VIEW.h-h-18);
    var g=se('g',{class:'r51-mini-card r51-card-status-'+cardStatusKey(it),transform:'translate('+x.toFixed(1)+' '+y.toFixed(1)+')'});
    g.appendChild(se('rect',{x:0,y:0,width:w,height:h,rx:5,class:'r51-mini-card-bg'}));
    g.appendChild(se('line',{x1:8,y1:22,x2:w-8,y2:22,class:'r51-mini-card-rule'}));
    var t1=se('text',{x:12,y:15,class:'r51-mini-card-title'}); t1.textContent=shortLabel(it.name,30); g.appendChild(t1);
    var t2=se('text',{x:12,y:38,class:'r51-mini-card-meta'}); t2.textContent=typeLabel(it)+(it.zone?' / '+zoneLabel(it.zone):'')+' / '+(it.group||'-'); g.appendChild(t2);
    var t3=se('text',{x:12,y:55,class:'r51-mini-card-meta'}); t3.textContent='ZOOM '+itemZoomMin(it)+'+ / '+(itemDisplayMode(it)==='dot'?'DOT':'DETAIL')+' / '+(relatedRecordKeys(it).length||0)+' REC'; g.appendChild(t3);
    if(state.review){var t4=se('text',{x:12,y:68,class:'r51-mini-card-code'}); t4.textContent=it.id; g.appendChild(t4);}
    els.svg.appendChild(g);
  }

  function render(){
    if(!root) return;
    if(state.region==='world'){state.zoom='z1'; state.focus='none';}
    else {state.zoom=zoomModeDef(state.zoom).key;}
    var r=regionDef(state.region), info=REGION_INFO[state.region]||REGION_INFO.world;
    root.dataset.region=state.region; root.dataset.filter=state.filter; root.dataset.review=state.review?'1':'0'; root.dataset.zoom=state.zoom; root.dataset.focus=state.focus; root.dataset.r51='tactical-display-polish';
    els.img.src=r.map; els.img.alt=(info.title||r.label)+' 지도';
    els.status.textContent= state.region==='world'?'WORLD SELECTOR / NO DATA LAYER':(info.status+' / '+(state.review?'REVIEW MODE':'OPERATIONS VIEW')+' / '+zoomLabel()+' / TACTICAL DISPLAY');
    els.infoTitle.textContent=info.title; els.infoStatus.textContent=info.status; els.infoBody.textContent=info.body;
    Array.prototype.forEach.call(els.regions.children,function(b){b.classList.toggle('active',b.dataset.region===state.region);});
    Array.prototype.forEach.call(els.filters.children,function(b){b.classList.toggle('active',b.dataset.filter===state.filter || (b.dataset.filter==='review'&&state.review));});
    els.filters.hidden=(state.region==='world'); els.world.hidden=(state.region!=='world');
    root.classList.toggle('is-world',state.region==='world'); root.classList.toggle('is-review',!!state.review); document.body.classList.toggle('r24-map-review-mode',!!state.review); root.classList.toggle('r24-focus-active',!!state.selected);
    clearChildren(els.svg); clearChildren(els.list);
    var count=0;
    if(state.region!=='world'){
      var defs=se('defs',{}); defs.appendChild(markerDef('arrow-end','M 0 0 L 8 4 L 0 8 z')); defs.appendChild(markerDef('r51-arrow-end','M 0 0 L 8 4 L 0 8 z')); els.svg.appendChild(defs);
      renderTacticalRelationOverlay();
      var items=(DATA[state.region]||[]).filter(itemVisible);
      var full=items.filter(function(it){return itemDisplayMode(it)==='full';});
      var dots=items.filter(function(it){return itemDisplayMode(it)==='dot';});
      full.filter(function(it){return it.type==='blockade';}).forEach(function(it){renderBlockade(it); count++;});
      full.filter(function(it){return it.type==='zone';}).forEach(function(it){renderZone(it); count++;});
      full.filter(function(it){return it.type!=='zone'&&it.type!=='blockade';}).forEach(function(it){renderPoint(it); count++;});
      dots.forEach(function(it){renderZoomDot(it); count++;});
      renderTacticalInfoCard();
      items.forEach(addListItem);
    }
    els.count.textContent=String(count);
    renderZoomControls(); updateZoomView(); renderIndexPanel(); updateSelected(); highlight(); updateOverlapMenu(); renderSelfReview(false);
  }
  function renderZone(it){
    var p=xy(state.region,it.lon,it.lat), cx=p[0], cy=p[1], base=scaleVal(it.size,'zone'), seed=hash(it.id+'|'+it.name+'|'+it.variant), g=se('g',{class:'r24-item r24-zone r24-zone-'+it.zone+' r24-zone-size-'+(it.size||'medium')+' r24-variant-'+(it.variant||'base')+' r45-detail-'+(it.detail||'base')+groupClass(it)+tacticalPriorityClass(it),tabindex:'0','data-id':it.id});
    var rot={ 'spread-tail':-14,'coastal-spread':8,'inland-spread':-4,'buffer-band':14,'desert-watch':4,'sea-buffer':-25,'port-control':0,'gate-control':0,'rear-core':0,'void-core':0,'core-crack':0,'desert-spread':-10 }[it.variant]||0;
    var rx=base, ry=base*.78; if(/buffer|desert|sea/.test(it.variant||'')){rx=base*1.28; ry=base*.70;} if(/port|gate/.test(it.variant||'')){rx=base*.90; ry=base*.58;} if(it.zone==='black'){rx=base*.78; ry=base*.72;}
    var outer=se('path',{d:blobPath(cx,cy,rx,ry,seed,28,it.zone==='black'?.42:.30,rot),class:'r24-zone-fill'}); g.appendChild(outer);
    if(it.zone==='red'){g.appendChild(se('path',{d:blobPath(cx+rx*.08,cy-ry*.03,rx*.36,ry*.34,seed^0x9e3779b9,18,.35,rot+17),class:'r24-zone-core'})); if(/tail|spread/.test(it.variant||'')){g.appendChild(se('path',{d:blobPath(cx+rx*.48,cy+ry*.22,rx*.38,ry*.18,seed^0x85ebca6b,16,.40,rot-20),class:'r24-zone-tail'}));}}
    if(it.zone==='black'){g.appendChild(se('path',{d:'M '+(cx-rx*.45).toFixed(1)+' '+(cy-ry*.10).toFixed(1)+' C '+(cx-rx*.15).toFixed(1)+' '+(cy-ry*.55).toFixed(1)+' '+(cx+rx*.22).toFixed(1)+' '+(cy+ry*.46).toFixed(1)+' '+(cx+rx*.50).toFixed(1)+' '+(cy+ry*.02).toFixed(1),class:'r24-black-crack'})); g.appendChild(se('path',{d:blobPath(cx-rx*.02,cy+ry*.02,rx*.34,ry*.29,seed^0x27d4eb2f,16,.45,rot+25),class:'r24-black-core'}));}
    if(it.zone==='red'){g.insertBefore(se('path',{d:blobPath(cx-rx*.05,cy+ry*.06,rx*1.10,ry*.98,seed^0x7f4a7c15,30,.18,rot-8),class:'r24-zone-outer-haze'}),outer);}
    if(it.zone==='yellow'){g.appendChild(se('path',{d:blobPath(cx,cy,rx*1.08,ry*1.08,seed^0x165667b1,28,.18,rot),class:'r24-zone-watch'}));}
    if(it.zone==='green'||it.zone==='white'){g.appendChild(se('path',{d:blobPath(cx,cy,rx*.72,ry*.62,seed^0xa5a5a5a5,18,.18,rot),class:'r24-zone-inner'})); g.appendChild(se('path',{d:blobPath(cx,cy,rx*1.02,ry*.86,seed^0x6c8e9cf5,22,.10,rot),class:'r24-zone-management-ring'}));}
    if(zoomLevel(state.zoom)>=2){g.appendChild(se('path',{d:blobPath(cx,cy,rx*1.16,ry*1.04,seed^0x51f15e,24,.08,rot),class:'r51-zone-tactical-ring'}));}
    bindItem(g,it); els.svg.appendChild(g); if(state.review) addReviewLabel(g,it,cx+rx+6,cy-ry*.55); addZoomLabel(g,it,cx+rx+10,cy+ry*.08);
  }
  function renderBlockade(it){
    var pts=it.points||[], d=curvePath(state.region,pts); if(!d) return;
    var g=se('g',{class:'r24-item r24-blockade r24-blockade-'+(it.variant||'line')+' r24-line-scale-'+(it.scale||'medium')+' r45-detail-'+(it.detail||'base')+groupClass(it)+tacticalPriorityClass(it),tabindex:'0','data-id':it.id});
    var path=se('path',{d:d,class:'r24-blockade-line'}), back=se('path',{d:d,class:'r24-blockade-back'}); g.appendChild(back); g.appendChild(path);
    if(/sea|route/.test(it.variant||'') || zoomLevel(state.zoom)>=3) path.setAttribute('marker-end','url(#r51-arrow-end)');
    var xyMid=middlePoint(state.region,pts); addBlockadeTicks(g,pts,it.variant);
    if(zoomLevel(state.zoom)>=3 && pts.length>=2){
      var a=xy(state.region,pts[0][0],pts[0][1]), b=xy(state.region,pts[pts.length-1][0],pts[pts.length-1][1]);
      g.appendChild(se('circle',{cx:a[0].toFixed(1),cy:a[1].toFixed(1),r:5.2,class:'r51-blockade-cap start'}));
      g.appendChild(se('circle',{cx:b[0].toFixed(1),cy:b[1].toFixed(1),r:6.2,class:'r51-blockade-cap end'}));
      if(xyMid) g.appendChild(se('text',{x:(xyMid[0]+10).toFixed(1),y:(xyMid[1]-14).toFixed(1),class:'r51-blockade-tag'})).textContent='BARRIER / '+(it.variant||'line');
    }
    bindItem(g,it); els.svg.appendChild(g); if(state.review && xyMid) addReviewLabel(g,it,xyMid[0]+10,xyMid[1]-10); if(xyMid) addZoomLabel(g,it,xyMid[0]+12,xyMid[1]+18);
  }
  function renderPoint(it){
    var p=xy(state.region,it.lon,it.lat), x=p[0], y=p[1], g=se('g',{class:'r24-item r24-point r24-'+it.type+' r24-scale-'+(it.scale||'medium')+' r45-detail-'+(it.detail||'base')+groupClass(it)+tacticalPriorityClass(it),tabindex:'0','data-id':it.id,transform:'translate('+x.toFixed(1)+' '+y.toFixed(1)+')'});
    var sc={small:.86,medium:1,mid:1.06,large:1.18,xlarge:1.30}[it.scale]||1;
    if(zoomLevel(state.zoom)>=2) g.appendChild(se('circle',{cx:0,cy:0,r:(20*sc).toFixed(1),class:'r51-priority-ring'}));
    if(it.type==='facility') drawFacility(g,sc); else if(it.type==='blockade-node') drawGate(g,sc); else if(it.type==='incident') drawIncident(g,sc); else if(it.type==='anomaly') drawAnomaly(g,sc,it.scale); else if(it.type==='comms') drawComms(g,sc,it.scale);
    if(zoomLevel(state.zoom)>=4 && (it.type==='facility'||it.type==='blockade-node')) g.appendChild(se('path',{d:'M -22 0 L -14 0 M 14 0 L 22 0 M 0 -22 L 0 -14 M 0 14 L 0 22',class:'r51-crosshair'}));
    bindItem(g,it); els.svg.appendChild(g); if(state.review) addReviewLabel(g,it,20,-16,true); addZoomLabel(g,it,20,24,true);
  }
  function renderZoomDot(it){
    var p=itemAnchor(it); if(!p) return;
    var cls='r24-item r47-zoom-dot r47-dot-'+it.type+' r47-stage-min-'+itemZoomMin(it)+groupClass(it)+tacticalPriorityClass(it);
    var g=se('g',{class:cls,tabindex:'0','data-id':it.id,transform:'translate('+p[0].toFixed(1)+' '+p[1].toFixed(1)+')'});
    var r={core:6.4,primary:5.8,standard:5.2,support:4.5}[tacticalPriority(it)]||5;
    g.appendChild(se('circle',{cx:0,cy:0,r:r,class:'r47-dot-core'}));
    if(it.type==='blockade'||it.type==='blockade-node') g.appendChild(se('line',{x1:-8,y1:0,x2:8,y2:0,class:'r47-dot-line'}));
    if(it.type==='incident') g.appendChild(se('path',{d:'M 0 -8 L 7 6 L -7 6 Z',class:'r47-dot-shape'}));
    if(tacticalPriority(it)==='core') g.appendChild(se('circle',{cx:0,cy:0,r:(r+5).toFixed(1),class:'r51-dot-halo'}));
    bindItem(g,it); els.svg.appendChild(g); if(state.review && zoomLevel(state.zoom)>=5) addReviewLabel(g,it,10,-10,true); if(shouldZoomLabel(it)) addZoomLabel(g,it,12,18,true);
  }
  function renderZoomControls(){
    if(!els.zoomControls) return;
    if(state.region==='world'){els.zoomControls.hidden=true; els.zoomControls.innerHTML=''; return;}
    var selected=findItem(state.selected), canSelected=!!selected, canRelation=!!(selected&&selected.group);
    els.zoomControls.hidden=false;
    var zdef=zoomModeDef(state.zoom), panText=panStateLabel(), moved=panMagnitude();
    var path='U.A.C MAP › '+regionLabel(state.region)+' › '+zoomLabel()+(selected?' › '+shortLabel(selected.name,18):'');
    els.zoomControls.innerHTML='<div class="r44-control-head r48-control-head r50-control-head r51-control-head"><b>TACTICAL ZOOM</b><span>'+esc(zoomLabel())+' / '+esc(zdef.summary||'')+' / '+esc(panText)+'</span></div><div class="r51-tactical-path"><b>경로</b><span>'+esc(path)+'</span></div><div class="r50-operating-state"><b>상태</b><span>'+esc(regionLabel(state.region))+' · '+esc(zoomLabel())+' · '+esc(canPanDetailMap()?'드래그 가능':'전체 고정')+' · 위치 '+esc(String(moved))+'</span></div><div class="r44-zoom-row r47-zoom-row">'+ZOOM_MODES.map(function(z){return '<button type="button" data-r44-zoom="'+esc(z.key)+'" class="'+(state.zoom===z.key?'active':'')+'"><b>'+esc(z.label)+'</b><small>'+esc(z.summary)+'</small></button>';}).join('')+'</div><div class="r44-zoom-row focus"><button type="button" data-r44-focus="selected" '+(canSelected?'':'disabled')+' class="'+(state.focus==='selected'?'active':'')+'">선택 중심</button><button type="button" data-r44-focus="relation" '+(canRelation?'':'disabled')+' class="'+(state.focus==='relation'?'active':'')+'">관계권 중심</button><button type="button" data-r44-clear="1">줌/위치 초기화</button></div><div class="r48-pan-hint r50-pan-hint r51-pan-hint">마우스 휠: 줌 1~5 · 줌 2~5 드래그 · 선택은 위치 유지 · 관계권 선택 시 전술 묶음 표시</div>';
  }
  function auditTacticalDisplayPolish(){
    var warnings=[], notes=[];
    if(!TACTICAL_DISPLAY_POLISH.version) warnings.push('R51 전술 표시 메타데이터 누락');
    if(RELEASE_CHECKS.indexOf('tactical-display-polish')===-1) warnings.push('릴리즈 체크 tactical-display-polish 누락');
    if(state.region!=='world'){
      var items=DATA[state.region]||[], core=items.filter(function(it){return tacticalPriority(it)==='core';}).length, support=items.filter(function(it){return tacticalPriority(it)==='support';}).length;
      notes.push(regionLabel(state.region)+' 전술 위계: 핵심 '+core+' / 보조 '+support+' / 전체 '+items.length);
    }
    notes.push('관계권 링, 지도 위 미니 카드, 봉쇄선 끝점/방향, 우선순위 클래스 활성');
    notes.push('세계지도는 권역 선택 전용 유지');
    return {ok:!warnings.length,warnings:warnings,notes:notes,version:TACTICAL_DISPLAY_POLISH.version||'-'};
  }
  function makeTacticalDisplayReport(){
    var a=auditTacticalDisplayPolish();
    return '[U.A.C 지역지도 전술 표시 검수 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n현재: '+regionLabel(state.region)+' / '+zoomLabel()+' / '+(state.selected||'-')+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');
  }


  /* R52 — TacticalDisplayDecongestionPass
     - Decongests R51 tactical overlay after visual review screenshots.
     - General operations view now hides internal BARRIER/OP-GROUP labels, keeps mini card for zoom 5,
       reduces marker/icon weight, and moves heavy self-review/final/visible-node lists to review mode.
     - Review mode still exposes technical labels and full reports. */
  VERSION='5.8.1R-52 TacticalDisplayDecongestionPass';
  if(RELEASE_CHECKS.indexOf('tactical-display-decongestion-pass')===-1) RELEASE_CHECKS.push('tactical-display-decongestion-pass');
  var TACTICAL_DISPLAY_DECONGESTION=DATA_MODULE.TACTICAL_DISPLAY_DECONGESTION||{version:VERSION};

  function reviewOrZoom5(){return !!state.review || zoomLevel(state.zoom)>=5;}
  function blockadeDisplayLabel(it){
    var v=String((it&&it.variant)||'line');
    if(/port/.test(v)) return '항만 차단';
    if(/sea-route|route/.test(v)) return '해상 차단 항로';
    if(/sea|watch/.test(v)) return '해상 감시선';
    if(/land|contour/.test(v)) return '육상 봉쇄선';
    if(/city|urban/.test(v)) return '도시 차단선';
    return '봉쇄선';
  }
  function shouldShowBlockadeMapTag(it){
    if(state.region==='world') return false;
    if(state.review) return zoomLevel(state.zoom)>=3;
    return state.selected===it.id && zoomLevel(state.zoom)>=5;
  }
  function shouldZoomLabel(it){
    if(state.region==='world'||!state.selected) return false;
    var lv=zoomLevel(state.zoom), sel=findItem(state.selected);
    if(!sel) return false;
    if(state.review) return lv>=5 && itemDisplayMode(it)==='full';
    return it.id===sel.id && lv>=5;
  }
  function indexDisplayLimit(kind,rows){
    if(state.review){
      if(state.indexQuery) return PERF.maxSearchRows;
      if(kind==='all' && state.region==='world') return PERF.maxDefaultRows;
      if(kind==='relation') return PERF.maxFilteredRows;
      return PERF.maxFilteredRows;
    }
    if(state.indexQuery) return 14;
    if(kind==='relation') return 6;
    if(kind==='all' && state.region==='world') return 8;
    return 5;
  }
  function renderTacticalRelationOverlay(){
    if(state.region==='world'||!state.selected) return;
    var lv=zoomLevel(state.zoom);
    if(!state.review && lv<4) return;
    var sel=findItem(state.selected), items=relationItemsForSelected();
    if(!sel||!sel.group||items.length<2) return;
    var b=tacticalBounds(items); if(!b) return;
    var g=se('g',{class:'r51-relation-overlay r52-decongested-relation r51-card-status-'+cardStatusKey(sel),'data-r51-group':sel.group});
    g.appendChild(se('rect',{x:b.x1.toFixed(1),y:b.y1.toFixed(1),width:b.w.toFixed(1),height:b.h.toFixed(1),rx:Math.min(30,Math.max(10,b.w*.06)).toFixed(1),class:'r51-relation-ring'}));
    if(state.review || lv>=5){
      var anchors=items.map(function(it){return {it:it,p:itemAnchor(it)};}).filter(function(x){return !!x.p;}).slice(0,state.review?14:6);
      anchors.forEach(function(x){g.appendChild(se('line',{x1:b.cx.toFixed(1),y1:b.cy.toFixed(1),x2:x.p[0].toFixed(1),y2:x.p[1].toFixed(1),class:'r51-relation-trace'}));});
    }
    if(state.review || lv>=5){
      var tag=se('text',{x:clamp(b.x1+10,20,VIEW.w-220).toFixed(1),y:clamp(b.y1-10,24,VIEW.h-20).toFixed(1),class:'r51-relation-tag'});
      tag.textContent=state.review?('OP-GROUP / '+sel.group+' / '+items.length+' nodes'):('관계권 / '+shortLabel(sel.group,18));
      g.appendChild(tag);
    }
    els.svg.appendChild(g);
  }
  function renderTacticalInfoCard(){
    if(state.region==='world'||!state.selected) return;
    var lv=zoomLevel(state.zoom);
    if(!state.review && lv<5) return;
    var it=findItem(state.selected); if(!it) return;
    var p=itemAnchor(it); if(!p) return;
    var w=state.review?230:208, h=state.review?64:50;
    var x=clamp(p[0]+24,14,VIEW.w-w-14), y=clamp(p[1]-70,16,VIEW.h-h-16);
    var g=se('g',{class:'r51-mini-card r52-mini-card r51-card-status-'+cardStatusKey(it),transform:'translate('+x.toFixed(1)+' '+y.toFixed(1)+')'});
    g.appendChild(se('rect',{x:0,y:0,width:w,height:h,rx:4,class:'r51-mini-card-bg'}));
    g.appendChild(se('line',{x1:8,y1:20,x2:w-8,y2:20,class:'r51-mini-card-rule'}));
    var t1=se('text',{x:10,y:14,class:'r51-mini-card-title'}); t1.textContent=shortLabel(it.name,state.review?26:22); g.appendChild(t1);
    var t2=se('text',{x:10,y:35,class:'r51-mini-card-meta'}); t2.textContent=typeLabel(it)+(it.zone?' / '+zoneLabel(it.zone):'')+(it.group?' / '+shortLabel(it.group,12):''); g.appendChild(t2);
    if(state.review){var t3=se('text',{x:10,y:51,class:'r51-mini-card-meta'}); t3.textContent='ZOOM '+itemZoomMin(it)+'+ / '+(relatedRecordKeys(it).length||0)+' REC / '+it.id; g.appendChild(t3);}
    else {var t4=se('text',{x:10,y:47,class:'r51-mini-card-meta'}); t4.textContent='줌 '+itemZoomMin(it)+'+ / 관련 기록 '+(relatedRecordKeys(it).length||0); g.appendChild(t4);}
    els.svg.appendChild(g);
  }
  function renderBlockade(it){
    var pts=it.points||[], d=curvePath(state.region,pts); if(!d) return;
    var g=se('g',{class:'r24-item r24-blockade r52-blockade r24-blockade-'+(it.variant||'line')+' r24-line-scale-'+(it.scale||'medium')+' r45-detail-'+(it.detail||'base')+groupClass(it)+tacticalPriorityClass(it),tabindex:'0','data-id':it.id});
    var path=se('path',{d:d,class:'r24-blockade-line'}), back=se('path',{d:d,class:'r24-blockade-back'}); g.appendChild(back); g.appendChild(path);
    if(state.review || zoomLevel(state.zoom)>=4 || /sea|route/.test(it.variant||'')) path.setAttribute('marker-end','url(#r51-arrow-end)');
    var xyMid=middlePoint(state.region,pts); addBlockadeTicks(g,pts,it.variant);
    if((state.review || zoomLevel(state.zoom)>=4 || state.selected===it.id) && pts.length>=2){
      var a=xy(state.region,pts[0][0],pts[0][1]), b=xy(state.region,pts[pts.length-1][0],pts[pts.length-1][1]);
      g.appendChild(se('circle',{cx:a[0].toFixed(1),cy:a[1].toFixed(1),r:state.review?4.8:4.1,class:'r51-blockade-cap start'}));
      g.appendChild(se('circle',{cx:b[0].toFixed(1),cy:b[1].toFixed(1),r:state.review?5.8:5.0,class:'r51-blockade-cap end'}));
    }
    if(xyMid && shouldShowBlockadeMapTag(it)){
      var tag=se('text',{x:(xyMid[0]+9).toFixed(1),y:(xyMid[1]-12).toFixed(1),class:'r51-blockade-tag r52-blockade-tag'});
      tag.textContent=state.review?('BARRIER / '+(it.variant||'line')):blockadeDisplayLabel(it);
      g.appendChild(tag);
    }
    bindItem(g,it); els.svg.appendChild(g); if(state.review && xyMid) addReviewLabel(g,it,xyMid[0]+10,xyMid[1]-10); if(xyMid) addZoomLabel(g,it,xyMid[0]+12,xyMid[1]+18);
  }
  function renderPoint(it){
    var p=xy(state.region,it.lon,it.lat), x=p[0], y=p[1], g=se('g',{class:'r24-item r24-point r52-point r24-'+it.type+' r24-scale-'+(it.scale||'medium')+' r45-detail-'+(it.detail||'base')+groupClass(it)+tacticalPriorityClass(it),tabindex:'0','data-id':it.id,transform:'translate('+x.toFixed(1)+' '+y.toFixed(1)+')'});
    var sc={small:.68,medium:.82,mid:.88,large:1.02,xlarge:1.12}[it.scale]||.82;
    var selected=state.selected===it.id;
    if(state.review || selected || zoomLevel(state.zoom)>=4) g.appendChild(se('circle',{cx:0,cy:0,r:(17*sc).toFixed(1),class:'r51-priority-ring'}));
    if(it.type==='facility') drawFacility(g,sc); else if(it.type==='blockade-node') drawGate(g,sc); else if(it.type==='incident') drawIncident(g,sc); else if(it.type==='anomaly') drawAnomaly(g,sc,it.scale); else if(it.type==='comms') drawComms(g,sc,it.scale);
    if((state.review || zoomLevel(state.zoom)>=5) && (it.type==='facility'||it.type==='blockade-node')) g.appendChild(se('path',{d:'M -18 0 L -12 0 M 12 0 L 18 0 M 0 -18 L 0 -12 M 0 12 L 0 18',class:'r51-crosshair'}));
    bindItem(g,it); els.svg.appendChild(g); if(state.review) addReviewLabel(g,it,16,-14,true); addZoomLabel(g,it,17,21,true);
  }
  function renderZoomDot(it){
    var p=itemAnchor(it); if(!p) return;
    var cls='r24-item r47-zoom-dot r52-zoom-dot r47-dot-'+it.type+' r47-stage-min-'+itemZoomMin(it)+groupClass(it)+tacticalPriorityClass(it);
    var g=se('g',{class:cls,tabindex:'0','data-id':it.id,transform:'translate('+p[0].toFixed(1)+' '+p[1].toFixed(1)+')'});
    var r={core:5.1,primary:4.7,standard:4.2,support:3.7}[tacticalPriority(it)]||4.2;
    g.appendChild(se('circle',{cx:0,cy:0,r:r,class:'r47-dot-core'}));
    if(it.type==='blockade'||it.type==='blockade-node') g.appendChild(se('line',{x1:-6,y1:0,x2:6,y2:0,class:'r47-dot-line'}));
    if(it.type==='incident') g.appendChild(se('path',{d:'M 0 -6 L 5.5 5 L -5.5 5 Z',class:'r47-dot-shape'}));
    if((state.review||state.selected===it.id) && tacticalPriority(it)==='core') g.appendChild(se('circle',{cx:0,cy:0,r:(r+4).toFixed(1),class:'r51-dot-halo'}));
    bindItem(g,it); els.svg.appendChild(g); if(state.review && zoomLevel(state.zoom)>=5) addReviewLabel(g,it,8,-8,true); if(shouldZoomLabel(it)) addZoomLabel(g,it,10,16,true);
  }
  function renderZoomControls(){
    if(!els.zoomControls) return;
    if(state.region==='world'){els.zoomControls.hidden=true; els.zoomControls.innerHTML=''; return;}
    var selected=findItem(state.selected), canSelected=!!selected, canRelation=!!(selected&&selected.group);
    els.zoomControls.hidden=false;
    var zdef=zoomModeDef(state.zoom), panText=panStateLabel();
    els.zoomControls.innerHTML='<div class="r44-control-head r48-control-head r50-control-head r51-control-head r52-control-head"><b>TACTICAL ZOOM</b><span>현재: '+esc(zoomLabel())+' · '+esc(zdef.summary||'')+'</span></div><div class="r50-operating-state r52-operating-state"><b>조작</b><span>휠 확대/축소 · '+esc(canPanDetailMap()?'드래그 가능':'전체 고정')+' · '+esc(panText)+'</span></div><div class="r44-zoom-row r47-zoom-row r52-zoom-row">'+ZOOM_MODES.map(function(z){return '<button type="button" data-r44-zoom="'+esc(z.key)+'" class="'+(state.zoom===z.key?'active':'')+'"><b>'+esc(z.label)+'</b><small>'+esc(z.summary)+'</small></button>';}).join('')+'</div><div class="r44-zoom-row focus r52-focus-row"><button type="button" data-r44-focus="selected" '+(canSelected?'':'disabled')+' class="'+(state.focus==='selected'?'active':'')+'">선택 중심</button><button type="button" data-r44-focus="relation" '+(canRelation?'':'disabled')+' class="'+(state.focus==='relation'?'active':'')+'">관계권 중심</button><button type="button" data-r44-clear="1">줌/위치 초기화</button></div><div class="r48-pan-hint r50-pan-hint r51-pan-hint r52-pan-hint">일반 화면: 라벨 최소화 · 세부 카드/관계권 텍스트는 줌5 또는 검수 모드에서 표시</div>';
  }
  function updateSelected(){
    var it=findItem(state.selected);
    if(!it){els.selected.innerHTML='<b>선택 기록 없음</b><span>지도 요소를 선택하면 요약 관제 정보와 관련 기록 링크가 표시됩니다.</span>'+renderNavigationControls(null); return;}
    var recs=relatedRecordKeys(it).length;
    els.selected.innerHTML='<b>'+esc(it.name)+'</b><em>'+esc(typeLabel(it))+(it.zone?' / '+zoneLabel(it.zone):'')+'</em><p>'+esc(it.status||'')+'</p><dl><dt>관계권</dt><dd>'+esc(it.group||'-')+'</dd><dt>표시 단계</dt><dd>'+esc(itemDetailLabel(it))+' 이상 / 현재 '+esc(zoomLabel())+'</dd><dt>현재 표시</dt><dd>'+esc(itemDisplayMode(it)==='dot'?'점 표시':'상세 표시')+'</dd><dt>관련 기록</dt><dd>'+esc(String(recs))+'개</dd>'+(state.review?'<dt>내부 코드</dt><dd>'+esc(it.id)+'</dd>':'')+'</dl>'+renderRecordLinks(it)+renderNavigationControls(it);
  }
  function auditTacticalDisplayDecongestion(){
    var warnings=[], notes=[];
    if(!TACTICAL_DISPLAY_DECONGESTION.version) warnings.push('R52 디클러터 메타데이터 누락');
    if(RELEASE_CHECKS.indexOf('tactical-display-decongestion-pass')===-1) warnings.push('릴리즈 체크 tactical-display-decongestion-pass 누락');
    notes.push('일반 화면 BARRIER/OP-GROUP 텍스트 숨김, 줌5/검수 모드에서만 세부 라벨 표시');
    notes.push('마커/점 크기 축소, 관계권 프레임 약화, 미니 카드 축소 및 줌5 전용화');
    notes.push('우측 패널 SELF REVIEW/FINAL CHECK/VISIBLE NODES는 검수 모드 전용 표시');
    return {ok:!warnings.length,warnings:warnings,notes:notes,version:TACTICAL_DISPLAY_DECONGESTION.version||'-'};
  }
  function makeTacticalDisplayDecongestionReport(){
    var a=auditTacticalDisplayDecongestion();
    return '[U.A.C 지역지도 전술 표시 정리 검수 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n현재: '+regionLabel(state.region)+' / '+zoomLabel()+' / review '+(state.review?'ON':'OFF')+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');
  }




  /* R53 — MarkerScaleAndIconMappingRebuild
     - Expands tactical zoom from 1~5 to 1~10.
     - Keeps contamination zones as area-scale information.
     - Separates camera zoom from non-zone marker visual scale so facilities/lines/rings do not balloon and overlap.
     - Adds Korean-name based tactical pictogram mapping: airfield, harbor, supply, antenna, radar, checkpoint, buoy, incident, anomaly, etc. */
  VERSION='5.8.1R-53 MarkerScaleAndIconMappingRebuild';
  if(RELEASE_CHECKS.indexOf('marker-scale-icon-mapping-rebuild')===-1) RELEASE_CHECKS.push('marker-scale-icon-mapping-rebuild');
  var MARKER_ICON_REBUILD={
    version:VERSION,
    zoomStages:10,
    zonesKeepOriginalScale:true,
    markerVisualScaleSeparated:true,
    inferIconFromKoreanName:true,
    clickTargetPreserved:true
  };
  if(typeof PAN_WHEEL_ZOOM==='object'){
    PAN_WHEEL_ZOOM.version='5.8.1R-53';
    PAN_WHEEL_ZOOM.panFromZoom=2;
    PAN_WHEEL_ZOOM.maxZoomStage=10;
    PAN_WHEEL_ZOOM.markerScaleSeparated=true;
  }
  ZOOM_MODES=[
    {key:'z1',label:'줌 1',scale:1.00,level:1,summary:'존 중심 / 초소형 점'},
    {key:'z2',label:'줌 2',scale:1.08,level:2,summary:'권역 개요 / 점 군집'},
    {key:'z3',label:'줌 3',scale:1.18,level:3,summary:'핵심 시설·경고'},
    {key:'z4',label:'줌 4',scale:1.31,level:4,summary:'봉쇄·검문 구조'},
    {key:'z5',label:'줌 5',scale:1.45,level:5,summary:'표준 전술도'},
    {key:'z6',label:'줌 6',scale:1.62,level:6,summary:'통신·관측 세부'},
    {key:'z7',label:'줌 7',scale:1.82,level:7,summary:'관계권 세부'},
    {key:'z8',label:'줌 8',scale:2.05,level:8,summary:'보조 노드'},
    {key:'z9',label:'줌 9',scale:2.30,level:9,summary:'근접 라벨'},
    {key:'z10',label:'줌 10',scale:2.58,level:10,summary:'최대 세부'}
  ];
  if(!/^z\d+$/.test(String(state.zoom||''))) state.zoom='z1';

  var UAC_ICON_RULES=[
    {icon:'icon-black-signal',label:'블랙존 징후',frame:'diamond',priority:100,match:['블랙존 후보','심부 반응','암흑','균열','검은','흑색']},
    {icon:'icon-ritual',label:'의식 사건',frame:'diamond',priority:96,match:['의식','제단','우시노다교','제물','교단','문양']},
    {icon:'icon-warning',label:'경고 사건',frame:'triangle',priority:92,match:['경고','위험','붕괴','실패','이탈','누락']},
    {icon:'icon-contamination',label:'오염 반응',frame:'diamond',priority:88,match:['오염','맥동','토양','반응점','열점','압력']},
    {icon:'icon-incident',label:'사건 좌표',frame:'diamond',priority:85,match:['사건','좌표','실종','사고','표류','귀환']},
    {icon:'icon-port-control',label:'항만 통제',frame:'capsule',priority:82,match:['항만 검문','항만 차단','항만 통제','항만 게이트','항만 보조 게이트']},
    {icon:'icon-sea-buoy',label:'해상 부표',frame:'circle',priority:80,match:['부표','검문부표','해상 노드']},
    {icon:'icon-checkpoint',label:'검문소',frame:'capsule',priority:78,match:['검문','검문소','통제소','게이트']},
    {icon:'icon-blockade-node',label:'봉쇄 거점',frame:'capsule',priority:76,match:['봉쇄 거점','차단 거점','방벽','방어 거점']},
    {icon:'icon-barrier-line',label:'봉쇄선',frame:'line',priority:74,match:['봉쇄선','차단선','방어선']},
    {icon:'icon-jamming',label:'전파 교란',frame:'circle',priority:72,match:['통신 지연','신호 단절','교란','잡음','통신 저하','단파','지연권']},
    {icon:'icon-relay',label:'중계소',frame:'circle',priority:70,match:['중계','송신','수신','증폭']},
    {icon:'icon-comms',label:'통신기지',frame:'circle',priority:68,match:['통신','교신']},
    {icon:'icon-satellite',label:'위성 관측',frame:'circle',priority:67,match:['위성','장거리 관측']},
    {icon:'icon-observation',label:'관측소',frame:'circle',priority:66,match:['관측','관측소','관측기지','관측선']},
    {icon:'icon-radar',label:'감시기지',frame:'circle',priority:64,match:['감시','감시선','레이더','감시초소','감시소']},
    {icon:'icon-airfield',label:'항공거점',frame:'square',priority:62,match:['공항','활주로','항공','헬기','드론']},
    {icon:'icon-harbor',label:'항만거점',frame:'square',priority:60,match:['항만','항구','부두','해상기지']},
    {icon:'icon-supply',label:'보급기지',frame:'square',priority:58,match:['보급','저장','물류','창고']},
    {icon:'icon-quarantine',label:'격리시설',frame:'square',priority:56,match:['검역','격리','선별','차폐']},
    {icon:'icon-research',label:'연구시설',frame:'square',priority:54,match:['연구','실험','분석']},
    {icon:'icon-medical',label:'의료시설',frame:'square',priority:52,match:['의료','치료','구호']},
    {icon:'icon-shelter',label:'대피거점',frame:'square',priority:50,match:['대피','피난','민간 보호']},
    {icon:'icon-power',label:'전력시설',frame:'square',priority:48,match:['발전','전력','변전']},
    {icon:'icon-record',label:'현상 기록',frame:'diamond',priority:46,match:['기록','로그','현상 기록']},
    {icon:'icon-anomaly',label:'이상현상',frame:'diamond',priority:44,match:['현상','에코','파문','반응']},
    {icon:'icon-base',label:'작전기지',frame:'square',priority:40,match:['기지','초소','거점']}
  ];
  var UAC_ICON_FALLBACK={
    facility:'icon-base', anomaly:'icon-record', incident:'icon-incident', comms:'icon-jamming',
    'blockade-node':'icon-blockade-node', blockade:'icon-barrier-line', zone:'zone'
  };
  function zoomModeDef(key){return ZOOM_MODES.filter(function(z){return z.key===key;})[0]||ZOOM_MODES[0];}
  function zoomLabel(){return zoomModeDef(state.zoom).label;}
  function zoomLevel(key){var z=zoomModeDef(key||state.zoom); return z.level||1;}
  function zoomKeyForLevel(lv){lv=Math.max(1,Math.min(10,Number(lv)||1)); return 'z'+lv;}
  function inferUacIcon(it){
    if(!it) return {icon:'icon-base',label:'기본',frame:'square',priority:0};
    if(it.type==='zone') return {icon:'zone',label:'오염 구역',frame:'zone',priority:0};
    var hay=[it.name,it.status,it.group,it.variant,it.type].filter(Boolean).join(' ');
    var best=null;
    UAC_ICON_RULES.forEach(function(rule){
      for(var i=0;i<rule.match.length;i++){
        if(hay.indexOf(rule.match[i])!==-1){ if(!best||rule.priority>best.priority) best=rule; break; }
      }
    });
    if(best) return best;
    var fallback=UAC_ICON_FALLBACK[it.type]||'icon-base';
    return UAC_ICON_RULES.filter(function(r){return r.icon===fallback;})[0]||{icon:fallback,label:typeLabel(it),frame:'square',priority:0};
  }
  function iconClassForItem(it){return ' r53-icon-'+inferUacIcon(it).icon.replace(/^icon-/,'')+' r53-frame-'+inferUacIcon(it).frame;}
  function itemZoomMin(it){
    if(!it) return 10;
    if(typeof it.zoomMin==='number') return Math.max(1,Math.min(10,Math.round(it.zoomMin)));
    if(it.detail==='precision') return 8;
    if(it.detail==='zoom') return 6;
    if(it.type==='zone') return 1;
    var icon=inferUacIcon(it).icon;
    if(icon==='icon-black-signal'||icon==='icon-ritual') return 5;
    if(icon==='icon-warning') return 3;
    if(icon==='icon-incident'||icon==='icon-contamination') return it.scale==='small'?5:4;
    if(icon==='icon-command') return 3;
    if(icon==='icon-airfield'||icon==='icon-harbor'||icon==='icon-supply'||icon==='icon-quarantine') return it.scale==='small'?6:5;
    if(icon==='icon-port-control'||icon==='icon-checkpoint'||icon==='icon-blockade-node') return it.scale==='small'?6:4;
    if(icon==='icon-comms'||icon==='icon-relay'||icon==='icon-observation'||icon==='icon-radar'||icon==='icon-jamming') return it.scale==='small'?6:5;
    if(it.type==='blockade') return it.scale==='small'?6:4;
    if(it.type==='facility') return it.scale==='small'?5:4;
    if(it.type==='anomaly') return it.scale==='small'?6:5;
    if(it.type==='comms') return 5;
    return 5;
  }
  function itemDetailLabel(it){return '줌 '+itemZoomMin(it);}
  function requiredZoomForItem(it){return zoomKeyForLevel(itemZoomMin(it));}
  function filterMatches(it,filter){
    var f=filter||state.filter||'all';
    if(f==='all') return true;
    if(f==='zone') return it.type==='zone';
    if(f.indexOf('zone-')===0) return it.type==='zone' && it.zone===f.replace('zone-','');
    return it.type===f;
  }
  function itemFullVisibleInMode(it,mode){return zoomLevel(mode)>=itemZoomMin(it);}
  function itemDotEligible(it){return !!it && it.type!=='zone';}
  function itemDisplayMode(it,mode){
    if(!it) return 'hidden';
    var lv=zoomLevel(mode||state.zoom);
    if(itemFullVisibleInMode(it,mode||state.zoom)) return 'full';
    if(lv>=1 && itemDotEligible(it)) return 'dot';
    return 'hidden';
  }
  function detailVisible(it){return itemDisplayMode(it,state.zoom)!=='hidden';}
  function detailVisibleInMode(it,mode){return itemDisplayMode(it,mode)!=='hidden';}
  function itemVisible(it){if(state.region==='world') return false; if(!filterMatches(it,state.filter)) return false; return detailVisible(it);}
  function itemVisibleInMode(it,filter,mode){return filterMatches(it,filter||'all') && detailVisibleInMode(it,mode||'z1');}
  function visibleItemsForMode(region,filter,mode){return (DATA[region]||[]).filter(function(it){return itemVisibleInMode(it,filter||'all',mode||'z1');});}
  function detailCounts(items){
    var out={}; for(var i=1;i<=10;i++) out['z'+i]=0; out.precision=0; out.zoomOnly=0;
    (items||[]).forEach(function(it){var m=itemZoomMin(it); out['z'+m]=(out['z'+m]||0)+1; if(it.detail==='precision') out.precision++; if(it.zoomMin||it.detail==='zoom') out.zoomOnly++;});
    return out;
  }
  function clampNum(n,min,max){return Math.max(min,Math.min(max,Number(n)||0));}
  function zoomVisualFactor(){return [0,.42,.48,.56,.64,.74,.84,.94,1.02,1.10,1.16][zoomLevel(state.zoom)]||.74;}
  function scaleBucketFactor(s){return {tiny:.42,small:.52,medium:.66,mid:.70,large:.82,xlarge:.92}[s]||.66;}
  function priorityScaleFactor(it){var p=tacticalPriority(it); return {core:1.10,primary:1.00,standard:.90,support:.78}[p]||.9;}
  function markerVisualScale(it){
    var cam=zoomModeDef(state.zoom).scale||1;
    var raw=scaleBucketFactor(it.scale)*priorityScaleFactor(it)*zoomVisualFactor()/cam;
    if(it.type==='blockade-node'||inferUacIcon(it).icon==='icon-sea-buoy') raw*=.88;
    if(it.type==='comms'||it.type==='anomaly') raw*=.82;
    return clampNum(raw,.28,.78);
  }
  function dotVisualRadius(it){
    var lv=zoomLevel(state.zoom), p=tacticalPriority(it), base={core:3.8,primary:3.3,standard:2.9,support:2.5}[p]||2.9;
    if(it.type==='incident') base+=.35;
    if(lv<=2) base-=.45;
    return clampNum(base,1.8,4.4);
  }
  function ringVisualRadius(it,sc){return clampNum(13*sc,6,12);}
  function fieldVisualRadius(it,sc){
    var cam=zoomModeDef(state.zoom).scale||1;
    var base=it.type==='comms'?25:22;
    if(inferUacIcon(it).icon==='icon-radar') base=24;
    return clampNum(base*zoomVisualFactor()/cam,.0,22);
  }
  function lineWidthForItem(it){
    var base={small:1.05,medium:1.28,mid:1.38,large:1.62,xlarge:1.86}[it.scale]||1.28;
    var v=String(it.variant||'');
    if(/sea|route/.test(v)) base*=.72;
    if(/desert/.test(v)) base*=.82;
    if(/port/.test(v)) base*=.84;
    if(state.selected===it.id) base*=1.28;
    if(state.review) base*=1.12;
    return clampNum(base,.7,2.4);
  }
  function capRadiusForItem(it,end){var r={small:2.2,medium:2.7,mid:2.8,large:3.1,xlarge:3.4}[it.scale]||2.7; if(end) r+=.45; if(state.review) r+=.35; return clampNum(r,1.8,4.2);}
  function drawFrame(g,frame,sc,cls){
    cls=cls||'r24-icon-plate';
    if(frame==='hex') g.appendChild(se('path',{d:'M 0 '+(-13*sc)+' L '+(12*sc)+' '+(-7*sc)+' L '+(12*sc)+' '+(7*sc)+' L 0 '+(13*sc)+' L '+(-12*sc)+' '+(7*sc)+' L '+(-12*sc)+' '+(-7*sc)+' Z',class:cls}));
    else if(frame==='circle') g.appendChild(se('circle',{cx:0,cy:0,r:(12*sc).toFixed(1),class:cls}));
    else if(frame==='diamond') g.appendChild(se('path',{d:'M 0 '+(-13*sc)+' L '+(13*sc)+' 0 L 0 '+(13*sc)+' L '+(-13*sc)+' 0 Z',class:cls}));
    else if(frame==='triangle') g.appendChild(se('path',{d:'M 0 '+(-14*sc)+' L '+(14*sc)+' '+(12*sc)+' L '+(-14*sc)+' '+(12*sc)+' Z',class:'r24-incident-plate'}));
    else if(frame==='capsule') g.appendChild(se('rect',{x:(-15*sc).toFixed(1),y:(-9*sc).toFixed(1),width:(30*sc).toFixed(1),height:(18*sc).toFixed(1),rx:(5*sc).toFixed(1),class:'r24-gate-plate'}));
    else g.appendChild(se('rect',{x:(-12*sc).toFixed(1),y:(-12*sc).toFixed(1),width:(24*sc).toFixed(1),height:(24*sc).toFixed(1),rx:(3*sc).toFixed(1),class:cls}));
  }
  function drawMappedMarker(g,it,sc){
    var meta=inferUacIcon(it), icon=meta.icon, frame=meta.frame;
    if(icon==='icon-command') frame='hex';
    drawFrame(g,frame,sc, icon==='icon-warning'?'r24-incident-plate':'r24-icon-plate');
    var c='r24-icon-line';
    function line(x1,y1,x2,y2,k){g.appendChild(se('line',{x1:(x1*sc).toFixed(1),y1:(y1*sc).toFixed(1),x2:(x2*sc).toFixed(1),y2:(y2*sc).toFixed(1),class:k||c}));}
    function path(d,k){g.appendChild(se('path',{d:d.replace(/(-?\d+(?:\.\d+)?)/g,function(m){return (Number(m)*sc).toFixed(1);}),class:k||c}));}
    function circ(cx,cy,r,k){g.appendChild(se('circle',{cx:(cx*sc).toFixed(1),cy:(cy*sc).toFixed(1),r:(r*sc).toFixed(1),class:k||c}));}
    if(icon==='icon-airfield'){path('M 0 -10 L 3 -2 L 11 1 L 11 4 L 3 3 L 1 10 L -2 10 L -3 3 L -11 4 L -11 1 L -3 -2 L 0 -10 Z');}
    else if(icon==='icon-supply'){path('M -8 -6 L 8 -6 L 8 7 L -8 7 Z M -8 -2 L 8 -2 M -3 -6 L -3 7 M 3 -6 L 3 7');}
    else if(icon==='icon-harbor'){line(0,-9,0,6); path('M -6 -1 Q 0 10 6 -1 M -5 4 L -9 1 M 5 4 L 9 1'); circ(0,-8,2,'r24-icon-fill');}
    else if(icon==='icon-port-control'){path('M -8 -5 L 8 -5 M -8 5 L 8 5 M -5 -8 L -5 8 M 5 -8 L 5 8'); line(-11,0,11,0);}
    else if(icon==='icon-checkpoint'){line(-10,3,10,-3); path('M -8 -7 L -8 7 M 8 -7 L 8 7');}
    else if(icon==='icon-blockade-node'){path('M -9 -5 L 9 -5 M -9 5 L 9 5 M -6 -9 L -6 9 M 0 -9 L 0 9 M 6 -9 L 6 9');}
    else if(icon==='icon-comms'){line(0,8,0,-8); path('M -8 -3 Q 0 -11 8 -3 M -6 2 Q 0 -4 6 2');}
    else if(icon==='icon-relay'){line(0,9,0,-9); path('M -7 -5 L 0 -10 L 7 -5 M -8 1 Q 0 -7 8 1');}
    else if(icon==='icon-observation'){path('M -10 0 Q 0 -8 10 0 Q 0 8 -10 0 Z'); circ(0,0,2.8,'r24-icon-fill');}
    else if(icon==='icon-radar'){line(0,8,0,-8); path('M -10 5 Q 0 -7 10 5 M -6 1 Q 0 -4 6 1');}
    else if(icon==='icon-satellite'){path('M -8 4 Q -2 -6 8 -8 M -2 -1 L 8 8 M 4 4 L 9 9'); circ(-2,-1,2,'r24-icon-fill');}
    else if(icon==='icon-jamming'){line(0,8,0,-8); path('M -9 -4 Q 0 -12 9 -4 M -7 2 Q 0 -5 7 2 M -8 8 L 8 -8');}
    else if(icon==='icon-incident'){path('M 0 -8 L 7 6 L -7 6 Z'); circ(0,1,2,'r24-icon-fill');}
    else if(icon==='icon-warning'){line(0,-5,0,3); circ(0,7,1.6,'r24-icon-fill');}
    else if(icon==='icon-record'){path('M -6 -8 L 6 -8 L 6 8 L -6 8 Z M -3 -3 L 3 -3 M -3 2 L 3 2');}
    else if(icon==='icon-anomaly'){path('M -8 0 Q -2 -8 5 -4 Q 11 0 4 6 Q -2 11 -8 3');}
    else if(icon==='icon-contamination'){path('M 0 -9 Q 8 0 4 7 Q 0 11 -5 6 Q -9 1 0 -9 Z');}
    else if(icon==='icon-black-signal'){path('M -8 -2 Q -2 -10 5 -5 Q 12 1 4 8 Q -3 10 -9 4'); line(-5,-6,5,6);}
    else if(icon==='icon-ritual'){path('M 0 -9 L 8 6 L -8 6 Z M -5 6 L 5 6 M 0 -3 L 0 5');}
    else if(icon==='icon-medical'){path('M -3 -8 L 3 -8 L 3 -3 L 8 -3 L 8 3 L 3 3 L 3 8 L -3 8 L -3 3 L -8 3 L -8 -3 L -3 -3 Z');}
    else if(icon==='icon-research'){path('M -4 -9 L 4 -9 M -2 -9 L -2 -2 L -8 8 L 8 8 L 2 -2 L 2 -9');}
    else if(icon==='icon-quarantine'){path('M 0 -8 L 7 -4 L 7 4 L 0 8 L -7 4 L -7 -4 Z M -5 0 L 5 0 M 0 -5 L 0 5');}
    else if(icon==='icon-power'){path('M 2 -10 L -5 1 L 1 1 L -2 10 L 7 -3 L 1 -3 Z');}
    else if(icon==='icon-sea-buoy'){line(0,-8,0,8); path('M -6 2 Q 0 7 6 2 M -8 -2 L 8 -2'); circ(0,-8,2,'r24-icon-fill');}
    else {path('M -7 5 L -7 -2 L -2 -7 L 4 -7 L 8 -2 L 8 5 Z M -4 1 L 5 1');}
  }
  function drawFacility(g,sc){drawMappedMarker(g,{type:'facility',name:'작전기지'},sc);}
  function drawGate(g,sc){drawMappedMarker(g,{type:'blockade-node',name:'봉쇄 거점'},sc);}
  function drawIncident(g,sc){drawMappedMarker(g,{type:'incident',name:'경고 사건'},sc);}
  function drawAnomaly(g,sc,size){var r=fieldVisualRadius({type:'anomaly',scale:size},sc); if(r>3) g.appendChild(se('circle',{cx:0,cy:0,r:r.toFixed(1),class:'r24-pulse-ring r53-field-ring'})); drawMappedMarker(g,{type:'anomaly',name:'이상현상'},sc);}
  function drawComms(g,sc,size){var r=fieldVisualRadius({type:'comms',scale:size},sc); if(r>3) g.appendChild(se('circle',{cx:0,cy:0,r:r.toFixed(1),class:'r24-comms-field r53-field-ring'})); drawMappedMarker(g,{type:'comms',name:'통신 지연'},sc);}
  function renderPoint(it){
    var p=xy(state.region,it.lon,it.lat), x=p[0], y=p[1], meta=inferUacIcon(it), sc=markerVisualScale(it), selected=state.selected===it.id;
    var g=se('g',{class:'r24-item r24-point r52-point r53-point r24-'+it.type+' r24-scale-'+(it.scale||'medium')+' r45-detail-'+(it.detail||'base')+groupClass(it)+tacticalPriorityClass(it)+iconClassForItem(it),tabindex:'0','data-id':it.id,'data-uac-icon':meta.icon,transform:'translate('+x.toFixed(1)+' '+y.toFixed(1)+')'});
    g.appendChild(se('circle',{cx:0,cy:0,r:(Math.max(12,20*sc)).toFixed(1),class:'r53-click-target'}));
    var fieldR=fieldVisualRadius(it,sc);
    if((it.type==='comms'||meta.icon==='icon-radar'||meta.icon==='icon-jamming'||meta.icon==='icon-observation') && (state.review||selected||zoomLevel(state.zoom)>=6) && fieldR>3){
      g.appendChild(se('circle',{cx:0,cy:0,r:fieldR.toFixed(1),class:it.type==='comms'?'r24-comms-field r53-field-ring':'r24-pulse-ring r53-field-ring'}));
    }
    if(state.review || selected || zoomLevel(state.zoom)>=7) g.appendChild(se('circle',{cx:0,cy:0,r:ringVisualRadius(it,sc).toFixed(1),class:'r51-priority-ring r53-priority-ring'}));
    drawMappedMarker(g,it,sc);
    if((state.review || (selected && zoomLevel(state.zoom)>=7)) && (it.type==='facility'||it.type==='blockade-node')) g.appendChild(se('path',{d:'M '+(-12*sc).toFixed(1)+' 0 L '+(-8*sc).toFixed(1)+' 0 M '+(8*sc).toFixed(1)+' 0 L '+(12*sc).toFixed(1)+' 0 M 0 '+(-12*sc).toFixed(1)+' L 0 '+(-8*sc).toFixed(1)+' M 0 '+(8*sc).toFixed(1)+' L 0 '+(12*sc).toFixed(1),class:'r51-crosshair r53-crosshair'}));
    bindItem(g,it); els.svg.appendChild(g); if(state.review) addReviewLabel(g,it,12,-12,true); addZoomLabel(g,it,12,16,true);
  }
  function renderZoomDot(it){
    var p=itemAnchor(it); if(!p) return; var meta=inferUacIcon(it), r=dotVisualRadius(it);
    var cls='r24-item r47-zoom-dot r52-zoom-dot r53-zoom-dot r47-dot-'+it.type+' r47-stage-min-'+itemZoomMin(it)+groupClass(it)+tacticalPriorityClass(it)+iconClassForItem(it);
    var g=se('g',{class:cls,tabindex:'0','data-id':it.id,'data-uac-icon':meta.icon,transform:'translate('+p[0].toFixed(1)+' '+p[1].toFixed(1)+')'});
    g.appendChild(se('circle',{cx:0,cy:0,r:(Math.max(9,r+5)).toFixed(1),class:'r53-click-target'}));
    g.appendChild(se('circle',{cx:0,cy:0,r:r.toFixed(1),class:'r47-dot-core'}));
    if(it.type==='blockade'||it.type==='blockade-node') g.appendChild(se('line',{x1:(-r*1.15).toFixed(1),y1:0,x2:(r*1.15).toFixed(1),y2:0,class:'r47-dot-line'}));
    if(it.type==='incident') g.appendChild(se('path',{d:'M 0 '+(-r*1.15).toFixed(1)+' L '+(r).toFixed(1)+' '+(r*.9).toFixed(1)+' L '+(-r).toFixed(1)+' '+(r*.9).toFixed(1)+' Z',class:'r47-dot-shape'}));
    if((state.review||state.selected===it.id) && tacticalPriority(it)==='core') g.appendChild(se('circle',{cx:0,cy:0,r:(r+3).toFixed(1),class:'r51-dot-halo'}));
    bindItem(g,it); els.svg.appendChild(g); if(state.review && zoomLevel(state.zoom)>=8) addReviewLabel(g,it,7,-7,true); if(shouldZoomLabel(it)) addZoomLabel(g,it,9,14,true);
  }
  function renderBlockade(it){
    var pts=it.points||[], d=curvePath(state.region,pts); if(!d) return;
    var g=se('g',{class:'r24-item r24-blockade r52-blockade r53-blockade r24-blockade-'+(it.variant||'line')+' r24-line-scale-'+(it.scale||'medium')+' r45-detail-'+(it.detail||'base')+groupClass(it)+tacticalPriorityClass(it)+iconClassForItem(it),tabindex:'0','data-id':it.id,'data-uac-icon':inferUacIcon(it).icon});
    var back=se('path',{d:d,class:'r24-blockade-back'}), path=se('path',{d:d,class:'r24-blockade-line'});
    back.style.strokeWidth=(Math.max(2.4,lineWidthForItem(it)+2.4)).toFixed(2)+'px'; path.style.strokeWidth=lineWidthForItem(it).toFixed(2)+'px';
    g.appendChild(back); g.appendChild(path);
    if(state.review || zoomLevel(state.zoom)>=7 || state.selected===it.id) path.setAttribute('marker-end','url(#r51-arrow-end)');
    addBlockadeTicks(g,pts,it.variant);
    if((state.review || zoomLevel(state.zoom)>=7 || state.selected===it.id) && pts.length>=2){
      var a=xy(state.region,pts[0][0],pts[0][1]), b=xy(state.region,pts[pts.length-1][0],pts[pts.length-1][1]);
      g.appendChild(se('circle',{cx:a[0].toFixed(1),cy:a[1].toFixed(1),r:capRadiusForItem(it,false).toFixed(1),class:'r51-blockade-cap start r53-blockade-cap'}));
      g.appendChild(se('circle',{cx:b[0].toFixed(1),cy:b[1].toFixed(1),r:capRadiusForItem(it,true).toFixed(1),class:'r51-blockade-cap end r53-blockade-cap'}));
    }
    var xyMid=middlePoint(state.region,pts);
    if(xyMid && shouldShowBlockadeMapTag(it)){
      var tag=se('text',{x:(xyMid[0]+7).toFixed(1),y:(xyMid[1]-9).toFixed(1),class:'r51-blockade-tag r52-blockade-tag r53-blockade-tag'});
      tag.textContent=state.review?('BARRIER / '+(it.variant||'line')):blockadeDisplayLabel(it);
      g.appendChild(tag);
    }
    bindItem(g,it); els.svg.appendChild(g); if(state.review && xyMid) addReviewLabel(g,it,xyMid[0]+8,xyMid[1]-8); if(xyMid) addZoomLabel(g,it,xyMid[0]+10,xyMid[1]+15);
  }
  function handleStageWheel(ev){
    if(state.region==='world') return; if(!ev||state.isPanning) return;
    ev.preventDefault(); ev.stopPropagation();
    var now=Date.now(), dy=Number(ev.deltaY)||0; if(Math.abs(dy)<6) return;
    var dir=dy<0?1:-1; if(now-(state.lastWheelAt||0)<(PAN_WHEEL_ZOOM.wheelCooldownMs||135) && dir===state.lastWheelDirection) return;
    state.lastWheelAt=now; state.lastWheelDirection=dir;
    var cur=zoomLevel(state.zoom), next=clamp(cur+dir,1,10); if(next===cur) return;
    var oldScale=zoomModeDef(state.zoom).scale||1, nextKey=zoomKeyForLevel(next), nextScale=zoomModeDef(nextKey).scale||1;
    if(next>1){var p=stagePointPercent(ev), c=focusCenterPercent(); state.panX=(Number(state.panX)||0)+(oldScale-nextScale)*(p.x-c.x); state.panY=(Number(state.panY)||0)+(oldScale-nextScale)*(p.y-c.y);}
    setZoomMode(nextKey,{keepPan:true,source:'wheel'});
  }
  function panLimitForZoom(key){
    var lv=zoomLevel(key||state.zoom); if(lv<=1) return {x:0,y:0};
    return {x:[0,0,16,24,32,41,50,60,72,84,96][lv]||50,y:[0,0,13,20,27,34,42,50,60,70,80][lv]||42};
  }
  function updateZoomView(){
    if(!root) return; ensurePanWheelHandlers(); root.dataset.r53='marker-scale-icon-mapping';
    if(state.region==='world' || zoomLevel(state.zoom)<=1){resetPan(); root.style.setProperty('--r44-zoom-scale','1'); root.style.setProperty('--r44-pan-x','0%'); root.style.setProperty('--r44-pan-y','0%'); root.dataset.pan='0'; return;}
    normalizePan();
    var z=zoomModeDef(state.zoom), b=focusBounds(), cx=VIEW.w/2, cy=VIEW.h/2;
    if(b){cx=(b.x1+b.x2)/2; cy=(b.y1+b.y2)/2;}
    cx=clamp(cx,VIEW.w*.10,VIEW.w*.90); cy=clamp(cy,VIEW.h*.12,VIEW.h*.88);
    var tx=50-z.scale*(cx/VIEW.w*100)+(Number(state.panX)||0), ty=50-z.scale*(cy/VIEW.h*100)+(Number(state.panY)||0);
    var lim=panLimitForZoom(state.zoom); tx=clamp(tx,-lim.x-24,26); ty=clamp(ty,-lim.y-18,26);
    root.style.setProperty('--r44-zoom-scale',String(z.scale)); root.style.setProperty('--r44-pan-x',tx.toFixed(3)+'%'); root.style.setProperty('--r44-pan-y',ty.toFixed(3)+'%'); root.dataset.pan=canPanDetailMap()?'1':'0';
  }
  function renderZoomControls(){
    if(!els.zoomControls) return; if(state.region==='world'){els.zoomControls.hidden=true; els.zoomControls.innerHTML=''; return;}
    var selected=findItem(state.selected), canSelected=!!selected, canRelation=!!(selected&&selected.group), zdef=zoomModeDef(state.zoom), panText=canPanDetailMap()?'드래그 가능':'전체 고정';
    els.zoomControls.hidden=false;
    els.zoomControls.innerHTML='<div class="r44-control-head r48-control-head r53-control-head"><b>TACTICAL ZOOM</b><span>현재: '+esc(zoomLabel())+' / 10 · '+esc(zdef.summary||'')+' · '+esc(panText)+'</span></div><div class="r50-operating-state r52-operating-state r53-operating-state"><b>스케일</b><span>존 유지 · 마커/선/링 동적 보정 · '+esc(panStateLabel())+'</span></div><div class="r44-zoom-row r47-zoom-row r53-zoom-row">'+ZOOM_MODES.map(function(z){return '<button type="button" data-r44-zoom="'+esc(z.key)+'" class="'+(state.zoom===z.key?'active':'')+'"><b>'+z.level+'</b><small>'+esc(z.summary)+'</small></button>';}).join('')+'</div><div class="r44-zoom-row focus r52-focus-row"><button type="button" data-r44-focus="selected" '+(canSelected?'':'disabled')+' class="'+(state.focus==='selected'?'active':'')+'">선택 중심</button><button type="button" data-r44-focus="relation" '+(canRelation?'':'disabled')+' class="'+(state.focus==='relation'?'active':'')+'">관계권 중심</button><button type="button" data-r44-clear="1">줌/위치 초기화</button></div><div class="r48-pan-hint r50-pan-hint r51-pan-hint r52-pan-hint r53-pan-hint">마우스 휠: 줌 1~10 · 줌2 이상 드래그 · 클릭 판정은 유지하고 시각 크기만 축소</div>';
  }
  function updateSelected(){
    var it=findItem(state.selected);
    if(!it){els.selected.innerHTML='<b>선택 기록 없음</b><span>지도 요소를 선택하면 요약 관제 정보와 관련 기록 링크가 표시됩니다.</span>'+renderNavigationControls(null); return;}
    var recs=relatedRecordKeys(it).length, meta=inferUacIcon(it);
    els.selected.innerHTML='<b>'+esc(it.name)+'</b><em>'+esc(typeLabel(it))+(it.zone?' / '+zoneLabel(it.zone):'')+'</em><p>'+esc(it.status||'')+'</p><dl><dt>아이콘</dt><dd>'+esc(meta.label)+' / '+esc(meta.icon)+'</dd><dt>관계권</dt><dd>'+esc(it.group||'-')+'</dd><dt>표시 단계</dt><dd>'+esc(itemDetailLabel(it))+' 이상 / 현재 '+esc(zoomLabel())+'</dd><dt>현재 표시</dt><dd>'+esc(itemDisplayMode(it)==='dot'?'점 표시':'상세 표시')+'</dd><dt>관련 기록</dt><dd>'+esc(String(recs))+'개</dd>'+(state.review?'<dt>내부 코드</dt><dd>'+esc(it.id)+'</dd>':'')+'</dl>'+renderRecordLinks(it)+renderNavigationControls(it);
  }
  function renderIndexPanel(){
    if(!els.indexList||!els.indexCount||!els.indexChips) return;
    var kind=activeIndexKind(), rows=buildIndexRowsCached(), limit=indexDisplayLimit(kind,rows), shown=rows.slice(0,limit), more=Math.max(0,rows.length-shown.length);
    els.indexCount.textContent='전체 색인 · 현재 '+shown.length+'개'+(more?' / 추가 '+more+'개':'');
    Array.prototype.forEach.call(els.indexChips.querySelectorAll('button'),function(b){b.classList.toggle('active',b.dataset.r24IndexKind===kind);});
    if(!rows.length){var q=state.indexQuery?(' / 검색어 '+state.indexQuery):''; els.indexList.innerHTML='<div class="r24-index-empty"><b>검색 결과 없음</b><span>'+esc(indexKindLabel(kind))+esc(q)+' 조건과 일치하는 지도 기록이 없습니다.</span></div>'; return;}
    if(kind==='relation'){
      els.indexList.innerHTML=shown.map(function(g){var lead=g.items.slice().sort(function(a,b){return indexPriority(a)-indexPriority(b);})[0]; var zoneText=fmtCounts(g.zones,{red:'레드존',yellow:'옐로우존',green:'그린존',white:'화이트존',black:'블랙존'}); var selected=findItem(state.selected), active=selected&&selected.group===g.group&&state.region===g.region; return '<button type="button" class="r24-index-row relation '+(active?'selected ':'')+(g.region===state.region?'current-region':'')+'" data-r24-index-region="'+esc(g.region)+'" data-r24-index-group="'+esc(g.group)+'"><b>'+esc(g.group)+'</b><span>'+esc(regionLabel(g.region))+' · 요소 '+g.items.length+'개 · '+esc(typeLabel(lead))+(zoneText!=='-'?' · '+esc(zoneText):'')+(state.review?' / '+esc((lead&&lead.id)||'-'):'')+'</span></button>';}).join('')+(more?'<div class="r24-index-more">표시 '+shown.length+'/'+rows.length+' · 추가 관계권 '+more+'개는 검색어로 좁혀 확인하십시오.</div>':'');
    } else {
      els.indexList.innerHTML=shown.map(function(row){var it=row.item, min=itemZoomMin(it), auto=zoomLevel(state.zoom)<min?' · 열면 '+itemDetailLabel(it)+' 자동 전환':'', meta=inferUacIcon(it); return '<button type="button" class="r24-index-row '+(row.region===state.region?'current-region ':'')+(it.id===state.selected?'selected ':'')+'r47-stage-row r53-icon-row" data-r24-index-region="'+esc(row.region)+'" data-r24-index-open="'+esc(it.id)+'"><b>'+esc(it.name)+'</b><span><i>'+esc(meta.label)+'</i> '+esc(regionLabel(row.region))+(it.zone?' · '+esc(zoneLabel(it.zone)):'')+' · '+esc(it.group||'-')+' · '+esc(itemDetailLabel(it))+auto+(state.review?' / '+esc(it.id)+' / '+esc(meta.icon):'')+'</span></button>';}).join('')+(more?'<div class="r24-index-more">표시 '+shown.length+'/'+rows.length+' · 추가 항목 '+more+'개는 검색어로 좁혀 확인하십시오.</div>':'');
    }
  }
  function auditMarkerScaleAndIconMapping(){
    var warnings=[], notes=[], iconCounts={}, stageCounts={}, total=0, zones=0;
    REGIONS.filter(function(r){return r.key!=='world';}).forEach(function(r){(DATA[r.key]||[]).forEach(function(it){total++; if(it.type==='zone'){zones++; return;} var meta=inferUacIcon(it), z=itemZoomMin(it); iconCounts[meta.icon]=(iconCounts[meta.icon]||0)+1; stageCounts['z'+z]=(stageCounts['z'+z]||0)+1; if(z<1||z>10) warnings.push(r.label+' 줌 범위 오류: '+it.id); if(!meta.icon) warnings.push(r.label+' 아이콘 미매칭: '+it.id);});});
    if(ZOOM_MODES.length!==10) warnings.push('줌 단계 수 10 아님: '+ZOOM_MODES.length);
    if(!MARKER_ICON_REBUILD.markerVisualScaleSeparated) warnings.push('마커 스케일 분리 플래그 누락');
    notes.push('총 '+total+'개 / 존 '+zones+'개 / 비존 '+(total-zones)+'개');
    notes.push('아이콘 '+Object.keys(iconCounts).length+'종 적용');
    notes.push('줌 단계 '+Object.keys(stageCounts).sort().map(function(k){return k+':'+stageCounts[k];}).join(', '));
    return {ok:!warnings.length,warnings:warnings,notes:notes,iconCounts:iconCounts,stageCounts:stageCounts,total:total,zones:zones,version:MARKER_ICON_REBUILD.version};
  }
  function makeMarkerScaleAndIconMappingReport(){var a=auditMarkerScaleAndIconMapping(); return '[U.A.C 지역지도 마커 스케일·아이콘 매핑 검수 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n현재: '+regionLabel(state.region)+' / '+zoomLabel()+' / review '+(state.review?'ON':'OFF')+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');}
  function auditZoomStageLayer(){
    var warnings=[], notes=[], regions=REGIONS.filter(function(r){return r.key!=='world';}).map(function(r){return r.key;}), totals={all:0,removedPrecision:ZOOM_STAGE_LAYER.removedPrecisionItems||0,stages:{}}, fullTotals={}, currentVisible=getVisibleItems();
    for(var i=1;i<=10;i++){totals.stages['z'+i]=0; fullTotals['z'+i]=0;}
    regions.forEach(function(region){var items=DATA[region]||[]; totals.all+=items.length; items.forEach(function(it){var m=itemZoomMin(it); totals.stages['z'+m]=(totals.stages['z'+m]||0)+1; if(it.detail==='precision') warnings.push(regionDef(region).label+' 제거되지 않은 정밀 데이터: '+it.id); if(m<1||m>10) warnings.push(regionDef(region).label+' 줌 단계 범위 오류: '+it.id);}); for(var z=1;z<=10;z++) fullTotals['z'+z]+=items.filter(function(it){return itemDisplayMode(it,'z'+z)==='full';}).length; var z1Zones=visibleItemsForMode(region,'zone','z1').length; if(!z1Zones) warnings.push(regionDef(region).label+' 줌1 존 표시 없음');});
    notes.push('전체 '+totals.all+'개 / 현재 표시 '+currentVisible.length+'개 / 줌10 전체표시 '+fullTotals.z10+'개');
    notes.push('전체 표시 기준: '+Object.keys(fullTotals).map(function(k){return k+' '+fullTotals[k];}).join(' / '));
    return {ok:!warnings.length,warnings:warnings,notes:notes,totals:totals,fullTotals:fullTotals,currentVisible:currentVisible.length};
  }
  function fmtZoomStageAudit(audit){audit=audit||auditZoomStageLayer(); return audit.ok?'정상 · 전체 '+audit.totals.all+'개 / 줌10 전체표시 '+audit.fullTotals.z10+'개':'경고 '+audit.warnings.length+'건 · '+audit.warnings.slice(0,4).join(' / ')+(audit.warnings.length>4?' / ...':'');}

  function auditPanWheelZoom(){
    var warnings=[], notes=[];
    if(!PAN_WHEEL_ZOOM.wheelZoom) warnings.push('마우스 휠 줌 설정 누락');
    if(!PAN_WHEEL_ZOOM.worldLocked) warnings.push('세계지도 줌 잠금 설정 누락');
    if(ZOOM_MODES.length!==10) warnings.push('줌 단계 수 불일치: '+ZOOM_MODES.length);
    if((PAN_WHEEL_ZOOM.maxZoomStage||10)!==10) warnings.push('최대 줌 단계 설정 불일치: '+PAN_WHEEL_ZOOM.maxZoomStage);
    if(!PAN_WHEEL_ZOOM.noAutoRecenterOnSelection) warnings.push('선택 시 자동 중심 복귀 방지 설정 누락');
    notes.push('상세지도 줌 1~10 / 휠 전환 / 줌2~10 제한 드래그 / 일반 선택 위치 유지 / 세계지도 고정');
    notes.push('존 제외 마커는 카메라 배율과 분리된 동적 스케일 보정 적용');
    return {ok:!warnings.length,warnings:warnings,notes:notes,panFromZoom:PAN_WHEEL_ZOOM.panFromZoom,maxZoomStage:10};
  }
  function makePanWheelZoomReport(){var a=auditPanWheelZoom(); return '[U.A.C 지역지도 줌·드래그 검수 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n현재: '+regionLabel(state.region)+' / '+zoomLabel()+' / pan '+(Number(state.panX)||0).toFixed(2)+','+(Number(state.panY)||0).toFixed(2)+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');}
  /* R54 final override — active after R53 runtime overrides. */
  /* R54 — ZoomFiveRestoreAndFinalAuditHotfix
     - Corrects R53 zoom stage interpretation: maximum zoom remains zoom 5, not 10 split stages.
     - Keeps R53 marker/icon scaling and functional pictogram mapping.
     - Adds final audit cleanup for the restored 1~5 zoom model. */
  VERSION='5.8.1R-54 ZoomFiveRestoreAndFinalAuditHotfix';
  if(RELEASE_CHECKS.indexOf('zoom-five-restore')===-1) RELEASE_CHECKS.push('zoom-five-restore');
  if(RELEASE_CHECKS.indexOf('marker-icon-final-audit')===-1) RELEASE_CHECKS.push('marker-icon-final-audit');
  if(typeof MARKER_ICON_REBUILD==='object' && MARKER_ICON_REBUILD){
    MARKER_ICON_REBUILD.version=VERSION;
    MARKER_ICON_REBUILD.zoomStages=5;
    MARKER_ICON_REBUILD.zoomFiveRestored=true;
    MARKER_ICON_REBUILD.note='R54 restores tactical zoom to 1~5 while keeping non-zone marker, line, ring, endpoint, and pictogram scale compensation.';
  }
  if(typeof PAN_WHEEL_ZOOM==='object' && PAN_WHEEL_ZOOM){
    PAN_WHEEL_ZOOM.version=VERSION;
    PAN_WHEEL_ZOOM.maxZoomStage=5;
    PAN_WHEEL_ZOOM.panFromZoom=2;
    PAN_WHEEL_ZOOM.zoomFiveRestored=true;
  }
  ZOOM_MODES=[
    {key:'z1',label:'줌 1',scale:1.00,level:1,summary:'존 중심 / 나머지 최소 점'},
    {key:'z2',label:'줌 2',scale:1.16,level:2,summary:'주요 거점·사건 소형화'},
    {key:'z3',label:'줌 3',scale:1.34,level:3,summary:'봉쇄·기록·시설 표준 표시'},
    {key:'z4',label:'줌 4',scale:1.58,level:4,summary:'통신·보조 거점 세부 표시'},
    {key:'z5',label:'줌 5',scale:1.88,level:5,summary:'최대 상세 / 아이콘 상한 유지'}
  ];
  if(/^z(?:6|7|8|9|10)$/.test(String(state.zoom||''))) state.zoom='z5';

  function zoomKeyForLevel(lv){lv=Math.max(1,Math.min(5,Math.round(Number(lv)||1))); return 'z'+lv;}
  function zoomModeDef(key){
    var k=String(key||state.zoom||'z1');
    var m=/^z(\d+)$/.exec(k);
    if(m) k=zoomKeyForLevel(Number(m[1]));
    return ZOOM_MODES.filter(function(z){return z.key===k;})[0]||ZOOM_MODES[0];
  }
  function zoomLabel(){return zoomModeDef(state.zoom).label;}
  function zoomLevel(key){return zoomModeDef(key||state.zoom).level||1;}

  function itemZoomMin(it){
    if(!it) return 5;
    if(typeof it.zoomMin==='number') return Math.max(1,Math.min(5,Math.round(it.zoomMin)));
    if(it.detail==='precision') return 5;
    if(it.detail==='zoom') return 4;
    if(it.type==='zone') return 1;
    var icon=inferUacIcon(it).icon;
    if(icon==='icon-black-signal'||icon==='icon-ritual') return 4;
    if(icon==='icon-warning') return 3;
    if(icon==='icon-incident'||icon==='icon-contamination') return it.scale==='small'?4:3;
    if(icon==='icon-command') return 2;
    if(icon==='icon-airfield'||icon==='icon-harbor'||icon==='icon-supply'||icon==='icon-quarantine') return it.scale==='small'?4:3;
    if(icon==='icon-port-control'||icon==='icon-checkpoint'||icon==='icon-blockade-node') return it.scale==='small'?4:3;
    if(icon==='icon-comms'||icon==='icon-relay'||icon==='icon-observation'||icon==='icon-radar'||icon==='icon-jamming') return it.scale==='small'?4:3;
    if(it.type==='blockade') return it.scale==='small'?4:3;
    if(it.type==='facility') return it.scale==='small'?4:3;
    if(it.type==='anomaly') return it.scale==='small'?4:3;
    if(it.type==='comms') return 4;
    return 3;
  }
  function itemDetailLabel(it){return '줌 '+itemZoomMin(it);}
  function requiredZoomForItem(it){return zoomKeyForLevel(itemZoomMin(it));}
  function detailCounts(items){
    var out={z1:0,z2:0,z3:0,z4:0,z5:0,precision:0,zoomOnly:0};
    (items||[]).forEach(function(it){var m=itemZoomMin(it); out['z'+m]=(out['z'+m]||0)+1; if(it.detail==='precision') out.precision++; if(it.zoomMin||it.detail==='zoom') out.zoomOnly++;});
    return out;
  }

  function zoomVisualFactor(){return [0,.46,.58,.72,.88,1.00][zoomLevel(state.zoom)]||.72;}
  function markerVisualScale(it){
    var cam=zoomModeDef(state.zoom).scale||1;
    var raw=scaleBucketFactor(it.scale)*priorityScaleFactor(it)*zoomVisualFactor()/cam;
    if(it.type==='blockade-node'||inferUacIcon(it).icon==='icon-sea-buoy') raw*=.86;
    if(it.type==='comms'||it.type==='anomaly') raw*=.80;
    if(tacticalPriority(it)==='support') raw*=.92;
    return clampNum(raw,.26,.76);
  }
  function dotVisualRadius(it){
    var lv=zoomLevel(state.zoom), p=tacticalPriority(it), base={core:3.6,primary:3.1,standard:2.7,support:2.25}[p]||2.7;
    if(it.type==='incident') base+=.30;
    if(lv<=2) base-=.50;
    return clampNum(base,1.55,4.05);
  }
  function fieldVisualRadius(it,sc){
    var cam=zoomModeDef(state.zoom).scale||1;
    var base=it.type==='comms'?23:20;
    if(inferUacIcon(it).icon==='icon-radar') base=22;
    return clampNum(base*zoomVisualFactor()/cam,0,18);
  }
  function lineWidthForItem(it){
    var base={small:.92,medium:1.10,mid:1.18,large:1.36,xlarge:1.56}[it.scale]||1.10;
    var v=String(it.variant||'');
    if(/sea|route/.test(v)) base*=.64;
    if(/desert/.test(v)) base*=.78;
    if(/port/.test(v)) base*=.78;
    if(state.selected===it.id) base*=1.22;
    if(state.review) base*=1.10;
    return clampNum(base,.55,2.05);
  }
  function capRadiusForItem(it,end){var r={small:1.9,medium:2.3,mid:2.4,large:2.7,xlarge:3.0}[it.scale]||2.3; if(end) r+=.35; if(state.review) r+=.25; return clampNum(r,1.45,3.5);}

  function handleStageWheel(ev){
    if(state.region==='world') return; if(!ev||state.isPanning) return;
    ev.preventDefault(); ev.stopPropagation();
    var now=Date.now(), dy=Number(ev.deltaY)||0; if(Math.abs(dy)<6) return;
    var dir=dy<0?1:-1; if(now-(state.lastWheelAt||0)<(PAN_WHEEL_ZOOM.wheelCooldownMs||135) && dir===state.lastWheelDirection) return;
    state.lastWheelAt=now; state.lastWheelDirection=dir;
    var cur=zoomLevel(state.zoom), next=clamp(cur+dir,1,5); if(next===cur) return;
    var oldScale=zoomModeDef(state.zoom).scale||1, nextKey=zoomKeyForLevel(next), nextScale=zoomModeDef(nextKey).scale||1;
    if(next>1){var p=stagePointPercent(ev), c=focusCenterPercent(); state.panX=(Number(state.panX)||0)+(oldScale-nextScale)*(p.x-c.x); state.panY=(Number(state.panY)||0)+(oldScale-nextScale)*(p.y-c.y);}
    setZoomMode(nextKey,{keepPan:true,source:'wheel'});
  }
  function panLimitForZoom(key){
    var lv=zoomLevel(key||state.zoom); if(lv<=1) return {x:0,y:0};
    return {x:[0,0,18,30,44,60][lv]||44,y:[0,0,15,24,36,50][lv]||36};
  }
  function canPanDetailMap(){return state.region!=='world' && zoomLevel(state.zoom)>=2;}
  function setZoomMode(key,opts){
    opts=opts||{}; if(state.region==='world') return;
    var prev=state.zoom, prevLevel=zoomLevel(prev);
    state.zoom=zoomModeDef(key).key;
    if(zoomLevel(state.zoom)<=1){state.focus='none'; resetPan();}
    else { if(!opts.keepPan) resetPan(); normalizePan(); }
    if(prev!==state.zoom || prevLevel!==zoomLevel(state.zoom)) saveMapSnapshot({source:opts.source||'zoom'});
    render();
  }
  function setZoomFocus(mode){
    if(state.region==='world') return;
    if(mode==='selected' && !findItem(state.selected)) return;
    if(mode==='relation'){var it=findItem(state.selected); if(!it||!it.group) return;}
    state.focus=mode;
    if(state.focus!=='none' && zoomLevel(state.zoom)<3) state.zoom='z3';
    resetPan(); render();
  }
  function clearZoomFocus(){state.zoom='z1'; state.focus='none'; resetPan(); render();}
  function setRegion(key){state.region=key; state.selected=null; state.overlap=null; state.filter='all'; state.indexQuery=''; state.returnRecord=null; state.zoom='z1'; state.focus='none'; resetPan(); invalidatePerfCache(); render(); saveMapSnapshot({source:'region'});}
  function updateZoomView(){
    if(!root) return; ensurePanWheelHandlers(); root.dataset.r53='marker-scale-icon-mapping'; root.dataset.r54='zoom-five-restore';
    if(state.region==='world' || zoomLevel(state.zoom)<=1){resetPan(); root.style.setProperty('--r44-zoom-scale','1'); root.style.setProperty('--r44-pan-x','0%'); root.style.setProperty('--r44-pan-y','0%'); root.dataset.pan='0'; return;}
    normalizePan();
    var z=zoomModeDef(state.zoom), b=focusBounds(), cx=VIEW.w/2, cy=VIEW.h/2;
    if(b){cx=(b.x1+b.x2)/2; cy=(b.y1+b.y2)/2;}
    cx=clamp(cx,VIEW.w*.10,VIEW.w*.90); cy=clamp(cy,VIEW.h*.12,VIEW.h*.88);
    var tx=50-z.scale*(cx/VIEW.w*100)+(Number(state.panX)||0), ty=50-z.scale*(cy/VIEW.h*100)+(Number(state.panY)||0);
    var lim=panLimitForZoom(state.zoom); tx=clamp(tx,-lim.x-24,26); ty=clamp(ty,-lim.y-18,26);
    root.style.setProperty('--r44-zoom-scale',String(z.scale)); root.style.setProperty('--r44-pan-x',tx.toFixed(3)+'%'); root.style.setProperty('--r44-pan-y',ty.toFixed(3)+'%'); root.dataset.pan=canPanDetailMap()?'1':'0';
  }
  function renderZoomControls(){
    if(!els.zoomControls) return; if(state.region==='world'){els.zoomControls.hidden=true; els.zoomControls.innerHTML=''; return;}
    var selected=findItem(state.selected), canSelected=!!selected, canRelation=!!(selected&&selected.group), zdef=zoomModeDef(state.zoom), panText=canPanDetailMap()?'드래그 가능':'전체 고정';
    els.zoomControls.hidden=false;
    els.zoomControls.innerHTML='<div class="r44-control-head r48-control-head r53-control-head r54-control-head"><b>TACTICAL ZOOM</b><span>현재: '+esc(zoomLabel())+' / 5 · '+esc(zdef.summary||'')+' · '+esc(panText)+'</span></div><div class="r50-operating-state r52-operating-state r53-operating-state r54-operating-state"><b>스케일</b><span>존 유지 · 마커/선/링 동적 보정 · '+esc(panStateLabel())+'</span></div><div class="r44-zoom-row r47-zoom-row r53-zoom-row r54-zoom-row">'+ZOOM_MODES.map(function(z){return '<button type="button" data-r44-zoom="'+esc(z.key)+'" class="'+(state.zoom===z.key?'active':'')+'"><b>'+esc(z.label)+'</b><small>'+esc(z.summary)+'</small></button>';}).join('')+'</div><div class="r44-zoom-row focus r52-focus-row"><button type="button" data-r44-focus="selected" '+(canSelected?'':'disabled')+' class="'+(state.focus==='selected'?'active':'')+'">선택 중심</button><button type="button" data-r44-focus="relation" '+(canRelation?'':'disabled')+' class="'+(state.focus==='relation'?'active':'')+'">관계권 중심</button><button type="button" data-r44-clear="1">줌/위치 초기화</button></div><div class="r48-pan-hint r50-pan-hint r51-pan-hint r52-pan-hint r53-pan-hint r54-pan-hint">마우스 휠: 줌 1~5 · 줌2 이상 드래그 · 클릭 판정은 유지하고 시각 크기만 축소</div>';
  }

  function auditMarkerScaleAndIconMapping(){
    var warnings=[], notes=[], iconCounts={}, stageCounts={}, total=0, zones=0;
    REGIONS.filter(function(r){return r.key!=='world';}).forEach(function(r){(DATA[r.key]||[]).forEach(function(it){total++; if(it.type==='zone'){zones++; return;} var meta=inferUacIcon(it), z=itemZoomMin(it); iconCounts[meta.icon]=(iconCounts[meta.icon]||0)+1; stageCounts['z'+z]=(stageCounts['z'+z]||0)+1; if(z<1||z>5) warnings.push(r.label+' 줌 범위 오류: '+it.id); if(!meta.icon) warnings.push(r.label+' 아이콘 미매칭: '+it.id);});});
    if(ZOOM_MODES.length!==5) warnings.push('줌 단계 수 5 아님: '+ZOOM_MODES.length);
    if(!MARKER_ICON_REBUILD.markerVisualScaleSeparated) warnings.push('마커 스케일 분리 플래그 누락');
    if(MARKER_ICON_REBUILD.zoomStages!==5) warnings.push('마커 아이콘 메타데이터 줌 단계 불일치: '+MARKER_ICON_REBUILD.zoomStages);
    notes.push('총 '+total+'개 / 존 '+zones+'개 / 비존 '+(total-zones)+'개');
    notes.push('아이콘 '+Object.keys(iconCounts).length+'종 적용');
    notes.push('줌 단계 '+Object.keys(stageCounts).sort().map(function(k){return k+':'+stageCounts[k];}).join(', '));
    notes.push('R54: 줌은 1~5 유지, 최대 배율을 10단계로 분할하지 않음');
    return {ok:!warnings.length,warnings:warnings,notes:notes,iconCounts:iconCounts,stageCounts:stageCounts,total:total,zones:zones,version:VERSION};
  }
  function makeMarkerScaleAndIconMappingReport(){var a=auditMarkerScaleAndIconMapping(); return '[U.A.C 지역지도 마커 스케일·아이콘 매핑 검수 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n현재: '+regionLabel(state.region)+' / '+zoomLabel()+' / review '+(state.review?'ON':'OFF')+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');}
  function auditZoomStageLayer(){
    var warnings=[], notes=[], regions=REGIONS.filter(function(r){return r.key!=='world';}).map(function(r){return r.key;}), totals={all:0,removedPrecision:ZOOM_STAGE_LAYER.removedPrecisionItems||0,stages:{}}, fullTotals={}, currentVisible=getVisibleItems();
    for(var i=1;i<=5;i++){totals.stages['z'+i]=0; fullTotals['z'+i]=0;}
    regions.forEach(function(region){var items=DATA[region]||[]; totals.all+=items.length; items.forEach(function(it){var m=itemZoomMin(it); totals.stages['z'+m]=(totals.stages['z'+m]||0)+1; if(it.detail==='precision') warnings.push(regionDef(region).label+' 제거되지 않은 정밀 데이터: '+it.id); if(m<1||m>5) warnings.push(regionDef(region).label+' 줌 단계 범위 오류: '+it.id);}); for(var z=1;z<=5;z++) fullTotals['z'+z]+=items.filter(function(it){return itemDisplayMode(it,'z'+z)==='full';}).length; var z1Zones=visibleItemsForMode(region,'zone','z1').length; if(!z1Zones) warnings.push(regionDef(region).label+' 줌1 존 표시 없음');});
    notes.push('전체 '+totals.all+'개 / 현재 표시 '+currentVisible.length+'개 / 줌5 전체표시 '+fullTotals.z5+'개');
    notes.push('전체 표시 기준: '+Object.keys(fullTotals).map(function(k){return k+' '+fullTotals[k];}).join(' / '));
    notes.push('R54 기준: 기존 줌1~줌5 구조 복구');
    return {ok:!warnings.length,warnings:warnings,notes:notes,totals:totals,fullTotals:fullTotals,currentVisible:currentVisible.length};
  }
  function fmtZoomStageAudit(audit){audit=audit||auditZoomStageLayer(); return audit.ok?'정상 · 전체 '+audit.totals.all+'개 / 줌5 전체표시 '+audit.fullTotals.z5+'개':'경고 '+audit.warnings.length+'건 · '+audit.warnings.slice(0,4).join(' / ')+(audit.warnings.length>4?' / ...':'');}
  function auditPanWheelZoom(){
    var warnings=[], notes=[];
    if(!PAN_WHEEL_ZOOM.wheelZoom) warnings.push('마우스 휠 줌 설정 누락');
    if(!PAN_WHEEL_ZOOM.worldLocked) warnings.push('세계지도 줌 잠금 설정 누락');
    if(ZOOM_MODES.length!==5) warnings.push('줌 단계 수 불일치: '+ZOOM_MODES.length);
    if((PAN_WHEEL_ZOOM.maxZoomStage||5)!==5) warnings.push('최대 줌 단계 설정 불일치: '+PAN_WHEEL_ZOOM.maxZoomStage);
    if(!PAN_WHEEL_ZOOM.noAutoRecenterOnSelection) warnings.push('선택 시 자동 중심 복귀 방지 설정 누락');
    notes.push('상세지도 줌 1~5 / 휠 전환 / 줌2~5 제한 드래그 / 일반 선택 위치 유지 / 세계지도 고정');
    notes.push('존 제외 마커는 카메라 배율과 분리된 동적 스케일 보정 적용');
    return {ok:!warnings.length,warnings:warnings,notes:notes,panFromZoom:PAN_WHEEL_ZOOM.panFromZoom,maxZoomStage:5};
  }
  function makePanWheelZoomReport(){var a=auditPanWheelZoom(); return '[U.A.C 지역지도 줌·드래그 검수 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n현재: '+regionLabel(state.region)+' / '+zoomLabel()+' / pan '+(Number(state.panX)||0).toFixed(2)+','+(Number(state.panY)||0).toFixed(2)+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');}
  function auditZoomFiveRestoreHotfix(){
    var warnings=[], notes=[], marker=auditMarkerScaleAndIconMapping(), zoom=auditZoomStageLayer(), pan=auditPanWheelZoom();
    if(ZOOM_MODES.length!==5) warnings.push('줌 버튼 수가 5개가 아님');
    if((MARKER_ICON_REBUILD.zoomStages||0)!==5) warnings.push('MARKER_ICON_REBUILD.zoomStages가 5가 아님');
    if((PAN_WHEEL_ZOOM.maxZoomStage||0)!==5) warnings.push('PAN_WHEEL_ZOOM.maxZoomStage가 5가 아님');
    [marker,zoom,pan].forEach(function(a){if(a&&!a.ok) a.warnings.forEach(function(w){warnings.push(w);});});
    notes.push('R53 아이콘 매핑/비존 스케일 보정 유지');
    notes.push('R54 줌 단계는 다시 1~5로 고정');
    notes.push('세계지도는 권역 선택 전용/줌 없음 유지');
    return {ok:!warnings.length,warnings:warnings,notes:notes,marker:marker,zoom:zoom,pan:pan};
  }
  function makeZoomFiveRestoreHotfixReport(){var a=auditZoomFiveRestoreHotfix(); return '[U.A.C 지역지도 줌5 복구·최종 안정화 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');}



  /* R55 final override — active after all previous runtime overrides. */
  VERSION='5.8.1R-59 RegionalMapMountAndResponsiveStabilityHotfix';
  if(RELEASE_CHECKS.indexOf('final-release-audit')===-1) RELEASE_CHECKS.push('final-release-audit');
  if(typeof FINAL_RELEASE_AUDIT==='object' && FINAL_RELEASE_AUDIT){
    FINAL_RELEASE_AUDIT.version=VERSION;
    FINAL_RELEASE_AUDIT.zoomStages=5;
  }
  if(typeof MARKER_ICON_REBUILD==='object' && MARKER_ICON_REBUILD){
    MARKER_ICON_REBUILD.version=VERSION;
    MARKER_ICON_REBUILD.zoomStages=5;
    MARKER_ICON_REBUILD.finalReleaseAudit=true;
  }
  if(typeof PAN_WHEEL_ZOOM==='object' && PAN_WHEEL_ZOOM){
    PAN_WHEEL_ZOOM.version=VERSION;
    PAN_WHEEL_ZOOM.maxZoomStage=5;
    PAN_WHEEL_ZOOM.panFromZoom=2;
    PAN_WHEEL_ZOOM.finalReleaseAudit=true;
  }


  function auditResponsiveStabilityHotfix(){
    var warnings=[], notes=[];
    var section=document.querySelector('#zone-map');
    var mounted=!!document.querySelector('#zone-map .uac-r24-regional-map');
    if(!section) warnings.push('zone-map 섹션 누락');
    if(!mounted) warnings.push('지역지도 모듈 DOM 미마운트');
    if(root){
      if(!root.querySelector('.r24-map-stage')) warnings.push('지도 스테이지 누락');
      if(!root.querySelector('.r24-map-img')) warnings.push('지도 이미지 레이어 누락');
      if(!root.querySelector('.r24-map-svg')) warnings.push('지도 SVG 레이어 누락');
      if(!root.querySelector('.r24-info')) warnings.push('정보 패널 누락');
    }
    notes.push('R57/R58의 함수 오버라이드형 모바일 패치를 제거하고 안정 렌더러 기반 CSS 반응형으로 복구');
    notes.push('PC 넓은 화면: 지도+패널 / 중간 폭: 지도 우선 단일 열 / 모바일: 지도 우선+압축 패널');
    notes.push('지도 렌더링 자체는 지연·스킵하지 않음');
    return {ok:!warnings.length,warnings:warnings,notes:notes,version:VERSION,mounted:mounted};
  }
  function makeResponsiveStabilityReport(){var a=auditResponsiveStabilityHotfix(); return '[U.A.C 지역지도 반응형·마운트 안정화 리포트]\n버전: '+VERSION+'\n요약: '+(a.ok?'정상':'경고 '+a.warnings.length+'건')+'\n마운트: '+(a.mounted?'ON':'OFF')+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n메모: '+a.notes.join(' / ');}

  function exposeApi(){
    window.ProjectCurseRegionalMap={
      version:VERSION, auditResponsiveStabilityHotfix:auditResponsiveStabilityHotfix, makeResponsiveStabilityReport:makeResponsiveStabilityReport, resetToWorld:resetToWorld, getState:function(){return {region:state.region,filter:state.filter,review:!!state.review,selected:state.selected,zoom:state.zoom,focus:state.focus,panX:Number(state.panX)||0,panY:Number(state.panY)||0,canPan:canPanDetailMap(),overlap:state.overlap&&state.overlap.ids?state.overlap.ids.slice():[]};}, setZoomMode:setZoomMode, setZoomFocus:setZoomFocus, clearZoomFocus:clearZoomFocus,
      getRelatedRecords:function(id){var local=findItem(id||state.selected), global=!local&&id?findGlobalItem(id):null, it=local||(global&&global.item); return it?relatedRecordKeys(it).map(function(k){return RECORD_LIBRARY[k];}):[];},
      getRecordMapLinks:getRecordMapLinks, openRelatedRecord:openRelatedRecord, openMapItem:openMapItem, returnToLastMap:function(){return applyMapSnapshot(readMapSnapshot());}, getRouteContext:readRouteContext,
      getIndexRows:function(){return buildIndexRows().map(function(row){return row.item?{region:row.region,id:row.item.id,name:row.item.name,type:row.item.type,zone:row.item.zone,group:row.item.group,zoomMin:itemZoomMin(row.item)}:{region:row.region,group:row.group,count:row.items.length};});}, openIndexItem:openIndexItem,
      auditLinkIntegrity:auditLinkIntegrity, makeLinkAuditReport:function(){var a=auditLinkIntegrity(); return '[U.A.C 지도↔문서 링크 무결성 리포트]\n버전: '+VERSION+'\n요약: '+fmtLinkAudit(a)+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음');},
      auditReleaseCandidate:auditReleaseCandidate, auditFinalHotfixReadiness:auditFinalHotfixReadiness, auditZoomStageLayer:auditZoomStageLayer, auditPanWheelZoom:auditPanWheelZoom, auditNoAutoRecenterOnSelection:auditNoAutoRecenterOnSelection, auditMapInteractionStability:auditMapInteractionStability, auditTacticalDisplayPolish:auditTacticalDisplayPolish, makeTacticalDisplayReport:makeTacticalDisplayReport, auditTacticalDisplayDecongestion:auditTacticalDisplayDecongestion, makeTacticalDisplayDecongestionReport:makeTacticalDisplayDecongestionReport, auditMarkerScaleAndIconMapping:auditMarkerScaleAndIconMapping, makeMarkerScaleAndIconMappingReport:makeMarkerScaleAndIconMappingReport, auditZoomFiveRestoreHotfix:auditZoomFiveRestoreHotfix, makeZoomFiveRestoreHotfixReport:makeZoomFiveRestoreHotfixReport, auditFinalReleaseReadiness:auditFinalReleaseReadiness, makeFinalReleaseReadinessReport:makeFinalReleaseReadinessReport, makeNoAutoRecenterReport:makeNoAutoRecenterReport, makePanWheelZoomReport:makePanWheelZoomReport, makeInteractionStabilityReport:makeInteractionStabilityReport, makeZoomStageAuditReport:function(){var a=auditZoomStageLayer(); return '[U.A.C 지역지도 줌 단계 검수 리포트]\n버전: '+VERSION+'\n요약: '+fmtZoomStageAudit(a)+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음')+'\n세부: '+a.notes.join(' / ');},
      makeFinalHotfixReadinessReport:makeFinalHotfixReadinessReport, makeReleaseCandidateReport:function(){var a=auditReleaseCandidate(); return '[U.A.C 지역지도 릴리즈 후보 검수 리포트]\n버전: '+VERSION+'\n요약: '+fmtReleaseAudit(a)+'\n체크: '+a.checks.join(', ')+'\n'+(a.warnings.length?'경고: '+a.warnings.join(' / '):'경고 없음');}, makePerformanceIndexReport:function(){var rows=buildIndexRowsCached(); return '[U.A.C 지역지도 성능·색인 리포트]\n버전: '+VERSION+'\n색인: '+indexKindLabel(activeIndexKind())+' / 항목 '+rows.length+' / 표시 제한 '+indexDisplayLimit(activeIndexKind(),rows)+'\n캐시: '+Object.keys(PERF.indexCache).length+'개';}, makeZoomFocusReport:function(){return '[U.A.C 지역지도 줌 단계 리포트]\n버전: '+VERSION+'\n권역: '+regionLabel(state.region)+' ('+state.region+')\n줌 단계: '+zoomLabel()+' ('+state.zoom+')\n초점: '+(state.focus==='relation'?'관계권 중심':state.focus==='selected'?'선택 중심':'전체')+'\n선택: '+(state.selected||'-');}, makeSelfReviewReport:makeSelfReviewReport
    };
  }

  function boot(){build(); mountRecordMapBridges(); mountRecordReturnPanels(); ensureRecordBridgeListener(); exposeApi(); setTimeout(function(){ if(!document.querySelector('#zone-map .uac-r24-regional-map')){ build(); } mountRecordMapBridges(); mountRecordReturnPanels(); ensureRecordBridgeListener(); exposeApi(); },350);}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
