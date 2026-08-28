// Project Curse 5.54.0 — reader-first theater entry, shareable map locations, and evidence-gated cartographic intelligence.
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
    corroborated:'교차 확인 자료',
    observed:'관측 자료',
    estimated:'추정 좌표',
    disputed:'상충 진술',
    testimony:'순례자 증언',
    historical:'과거 기록'
  };

  ready(function(){
    const mount=document.getElementById('uacMapRoom');
    const data=root.ProjectCurseMapRoom;
    const signalIndex=root.ProjectCurseMapSignalIndex;
    const network=root.ProjectCurseIncidentNetwork;
    const operationStore=root.ProjectCurseOperationState;
    const pilgrimageStore=root.ProjectCursePilgrimageState;
    const verdictStore=root.ProjectCurseVerdictArchiveState;
    if(!mount||!data) return;

    const sessionKey='project_curse_map_session_v1';
    const sessionVersion=2;
    const recentKey='project_curse_map_recent_v1';
    const recentLimit=4;
    let recentLocations=[];

    const state={
      mode:'landing',
      region:'world',
      marker:null,
      synchronyPoint:null,
      detail:data.drilldowns?.[0]?.id||'',
      detailSite:null,
      detailLayers:{routes:true,threats:true,comms:false,distortion:true},
      operation:data.operations[0]?.id||'',
      step:operationStore?.get?.().mapStep||0,
      intelCollapsed:true,
      indexOpen:false,
      indexQuery:'',
      indexFilter:'all',
      indexSelection:null,
      layers:{confirmed:true,estimated:true,zones:true,routes:true,synchrony:true}
    };

    const exactRegionById=id=>data.regions.find(region=>region.id===id)||null;
    const exactDetailById=id=>(data.drilldowns||[]).find(detail=>detail.id===id)||null;
    const exactOperationById=id=>data.operations.find(operation=>operation.id===id)||null;
    const regionById=id=>data.regions.find(region=>region.id===id)||data.regions[0];
    const markerById=id=>data.markers.find(marker=>marker.id===id)||null;
    const synchronyEvents=data.synchronyEvents||[];
    const synchronyPointById=id=>synchronyEvents.flatMap(event=>event.points.map(point=>({event,point}))).find(item=>item.point.id===id)||null;
    const detailById=id=>(data.drilldowns||[]).find(detail=>detail.id===id)||(data.drilldowns||[])[0]||null;
    const operationById=id=>data.operations.find(operation=>operation.id===id)||data.operations[0];
    const incidentById=id=>network?.getIncident?.(id)||null;
    const polyline=points=>(points||[]).map(point=>point.join(',')).join(' ');
    const riskLabels={critical:'치명',high:'높음',medium:'주의',low:'낮음'};
    const pilgrimageOutcome=id=>pilgrimageStore?.getSummary?.(id)||null;
    const scenarioStageByItem={
      'gbf-west-observation':['unlit-fortress',0],'monsur-church':['unlit-fortress',1],'gbf-monsur-chapel':['unlit-fortress',1],'gbf-duel-ground':['unlit-fortress',2],'black-river':['unlit-fortress',3],'gbf-black-river':['unlit-fortress',3],'gbf-blood-lake':['unlit-fortress',4],'unlit-fortress':['unlit-fortress',5],'gbf-unlit-fortress':['unlit-fortress',5],
      'returned-coast':['deadzone-return',0],'dead-return-shore':['deadzone-return',0],'dead-checkpoint-07':['deadzone-return',1],'dead-quarantine-ring':['deadzone-return',4],
      'dead-interior':['deadzone-recovery',0],'dead-sublevel-08':['deadzone-recovery',0],'dead-checkpoint-06':['deadzone-recovery',1],'dead-reverse-highway':['deadzone-recovery',3],'dead-origin-beacon':['deadzone-recovery',4]
    };
    const traceTone=outcome=>['broken','compromised'].includes(outcome)?'hostile':outcome==='contained'?'contained':['kept','verified','secured'].includes(outcome)?'secured':'unknown';
    const operationScenarioId=operation=>operation?.scenario||({'op-unlit-fortress':'unlit-fortress','op-deadzone-return':'deadzone-return','op-deadzone-recovery':'deadzone-recovery'}[operation?.id]||null);
    const operationStep=operation=>{const id=operationScenarioId(operation);if(!id) return operation?.id===operationStore?.operationId?operationStore.get().mapStep:0;const summary=pilgrimageOutcome(id);return summary?.status==='complete'?(operation.steps.length-1):summary?.status==='active'?summary.step:0;};
    const recoveryUnlocked=()=>Boolean(verdictStore?.isUnlocked?.('DZ-VR-04'));
    function mapLocationParts(){
      if(state.mode==='landing') return [];
      if(state.mode==='detail') return ['detail',state.detail,...(state.detailSite?[state.detailSite]:[])];
      if(state.mode==='operation') return ['operation',state.operation];
      const selection=state.marker?['marker',state.marker]:state.synchronyPoint?['synchrony',state.synchronyPoint]:[];
      return ['region',state.region,...selection];
    }
    const mapLocationKey=path=>path.map(part=>encodeURIComponent(part)).join('/');
    function mapLocationDescriptor(path){
      if(!Array.isArray(path)||!path.length) return null;
      if(path[0]==='detail'){
        const detail=exactDetailById(path[1]);
        const site=detail&&path[2]?detail.sites.find(item=>item.id===path[2]):null;
        if(!detail||path.length>3||(path[2]&&!site)) return null;
        return {path:['detail',detail.id,...(site?[site.id]:[])],eyebrow:`세부 권역 · ${regionById(detail.region).label}`,title:site?.label||detail.label,meta:site?detail.label:detail.code};
      }
      if(path[0]==='operation'){
        const operation=exactOperationById(path[1]);
        if(!operation||path.length>2) return null;
        return {path:['operation',operation.id],eyebrow:'작전지도',title:operation.label,meta:operation.code};
      }
      if(path[0]==='region'){
        const region=exactRegionById(path[1]);
        if(!region||path.length>4) return null;
        if(!path[2]) return path.length===2?{path:['region',region.id],eyebrow:'지역 상황도',title:region.label,meta:region.code}:null;
        if(path[2]==='marker'){
          const marker=markerById(path[3]);
          const valid=marker&&(marker.region===region.id||(region.id==='world'&&marker.overview));
          return valid?{path:['region',region.id,'marker',marker.id],eyebrow:`지역 상황도 · ${region.label}`,title:marker.title,meta:marker.meta}:null;
        }
        if(path[2]==='synchrony'){
          const signal=synchronyPointById(path[3]);
          const valid=signal&&(signal.point.region===region.id||region.id==='world');
          return valid?{path:['region',region.id,'synchrony',signal.point.id],eyebrow:`동시 무응답 · ${region.label}`,title:signal.point.label,meta:signal.event.title}:null;
        }
      }
      return null;
    }
    function restoreRecentLocations(){
      let saved;
      try{saved=JSON.parse(sessionStorage.getItem(recentKey)||'[]');}catch(_error){return;}
      if(!Array.isArray(saved)) return;
      const seen=new Set();
      recentLocations=saved.slice(0,12).map(item=>mapLocationDescriptor(Array.isArray(item)?item:item?.path)).filter(item=>{
        if(!item) return false;
        const key=mapLocationKey(item.path);
        if(seen.has(key)) return false;
        seen.add(key);return true;
      }).slice(0,recentLimit).map(item=>item.path);
    }
    function saveRecentLocations(){
      try{sessionStorage.setItem(recentKey,JSON.stringify(recentLocations));}catch(_error){}
    }
    function rememberMapLocation(path=mapLocationParts()){
      const descriptor=mapLocationDescriptor(path);
      if(!descriptor) return false;
      const key=mapLocationKey(descriptor.path);
      if(mapLocationKey(recentLocations[0]||[])===key) return true;
      recentLocations=[descriptor.path,...recentLocations.filter(item=>mapLocationKey(item)!==key)].slice(0,recentLimit);
      saveRecentLocations();return true;
    }
    const recentMapLocations=()=>recentLocations.map(mapLocationDescriptor).filter(Boolean);
    function mapLocationHash(){
      const suffix=mapLocationParts().map(part=>encodeURIComponent(part)).join('/');
      return `#map-room${suffix?`/${suffix}`:''}`;
    }
    function writeMapLocation(historyMode='replace'){
      if(historyMode==='none'||root.ProjectCurseShell?.getRoute?.()!=='map-room') return false;
      const nextHash=mapLocationHash();
      if(location.hash===nextHash) return true;
      try{
        const method=historyMode==='push'?'pushState':'replaceState';
        history[method]({route:'map-room',map:mapLocationParts()},'',nextHash);
        return true;
      }catch(_error){return false;}
    }
    function readInitialMapLocationPath(){
      const request=root.ProjectCurseShell?.getLocation?.();
      if(request?.route==='map-room'&&Array.isArray(request.mapRoomPath)) return request.mapRoomPath;
      const raw=location.hash.replace(/^#/,'');
      let decoded=raw;
      try{decoded=decodeURIComponent(raw);}catch(_error){}
      const [route,...parts]=decoded.split('/');
      return route==='map-room'?parts:null;
    }
    function applyMapLocationPath(path,{shouldRender=true,focus=false,historyMode='none'}={}){
      if(!Array.isArray(path)) return false;
      state.indexOpen=false;state.indexSelection=null;state.marker=null;state.synchronyPoint=null;
      if(!path.length){
        state.mode='landing';state.intelCollapsed=true;
      }else if(path[0]==='region'){
        const region=exactRegionById(path[1]);
        if(!region) return false;
        state.mode='region';state.region=region.id;state.intelCollapsed=true;
        if(path[2]==='marker'){
          const marker=markerById(path[3]);
          const valid=marker&&(marker.region===region.id||(region.id==='world'&&marker.overview));
          if(!valid) return false;
          state.marker=marker.id;state.intelCollapsed=false;
          state.layers[['estimated','testimony','disputed'].includes(marker.confidence)?'estimated':'confirmed']=true;
        }else if(path[2]==='synchrony'){
          const signal=synchronyPointById(path[3]);
          const valid=signal&&(signal.point.region===region.id||region.id==='world');
          if(!valid) return false;
          state.synchronyPoint=signal.point.id;state.layers.synchrony=true;state.intelCollapsed=false;
        }else if(path.length>2) return false;
      }else if(path[0]==='detail'){
        const detail=exactDetailById(path[1]);
        if(!detail) return false;
        const site=path[2]?detail.sites.find(item=>item.id===path[2]):null;
        if(path[2]&&!site) return false;
        if(path.length>3) return false;
        state.mode='detail';state.detail=detail.id;state.region=detail.region;state.detailSite=site?.id||null;state.intelCollapsed=!site;
      }else if(path[0]==='operation'){
        const operation=exactOperationById(path[1]);
        if(!operation||path.length>2) return false;
        state.mode='operation';state.operation=operation.id;state.step=operationStep(operation);state.indexSelection=`operation:${operation.id}`;state.intelCollapsed=false;
      }else return false;
      if(shouldRender){
        render({historyMode});
        if(focus&&state.mode==='detail'&&state.detailSite) focusDetailIntelAfterRender();
      }
      return true;
    }
    const theaters=[
      {
        id:'north',number:'01',eyebrow:'NORTHERN FRONT',title:'북부전선',
        status:'전선 신호 증가',confidence:'관측 신뢰도 78%',tone:'front',
        summary:'도쿄 감시권과 란저우 레드존 너머에서 일본 동맹권과 짐승의 길이 맞부딪친다.',
        note:'도시 감시 · 복제 구조신호 · 연속 차단선',target:{kind:'detail',id:'eastasia-northern-front'}
      },
      {
        id:'forest',number:'02',eyebrow:'GREAT BLACK FOREST',title:'대흑림',
        status:'공간 측량 불가',confidence:'지도 신뢰도 31%',tone:'forest',
        summary:'성채와 마을은 남아 있지만 길의 거리와 정착지 좌표가 관측할 때마다 달라진다.',
        note:'순례 경로 · 검은 강 · 불빛 없는 성채',target:{kind:'region',id:'southamerica'}
      },
      {
        id:'deadzone',number:'03',eyebrow:'THE DEAD ZONE',title:'데드존',
        status:'내륙 응답 없음',confidence:'지도 신뢰도 22%',tone:'dead',
        summary:'과거의 국가 지도와 현재의 귀환 기록이 일치하지 않는다. 돌아온 사람도 증거가 되지 못한다.',
        note:'귀환 검문 · 사라진 내륙 · 봉쇄된 구조 신호',target:{kind:'region',id:'northamerica'}
      },
      {
        id:'south',number:'04',eyebrow:'OPERATION BROKEN CROWN',title:'남부 쿠데타',
        status:'CRITICAL / PARTIAL',confidence:'부분 감청',tone:'coup',
        summary:'남부 해안의 집단 소환과 성위대 침투가 한 작전으로 수렴한다. 지휘 계통은 이미 오염됐다.',
        note:'특수부대 · 도시 소환 · 남방 해안 동원',target:{kind:'detail',id:'gbf-coastal-belt'}
      }
    ];
    function restoreMapSession(){
      let saved;
      try{saved=JSON.parse(sessionStorage.getItem(sessionKey)||'null');}catch(_error){return;}
      if(!saved||typeof saved!=='object') return;
      if(saved.entryVersion===sessionVersion&&['landing','region','detail','operation'].includes(saved.mode)) state.mode=saved.mode;
      if(data.regions.some(region=>region.id===saved.region)) state.region=saved.region;
      if(data.markers.some(marker=>marker.id===saved.marker)) state.marker=saved.marker;
      if(synchronyPointById(saved.synchronyPoint)) state.synchronyPoint=saved.synchronyPoint;
      if((data.drilldowns||[]).some(detail=>detail.id===saved.detail)) state.detail=saved.detail;
      const detail=detailById(state.detail);
      if(detail?.sites?.some(site=>site.id===saved.detailSite)) state.detailSite=saved.detailSite;
      if(data.operations.some(operation=>operation.id===saved.operation)) state.operation=saved.operation;
      if(Number.isFinite(saved.step)) state.step=Math.max(0,Math.floor(saved.step));
      if(typeof saved.intelCollapsed==='boolean') state.intelCollapsed=saved.intelCollapsed;
      if(typeof saved.indexOpen==='boolean') state.indexOpen=saved.indexOpen;
      if(typeof saved.indexQuery==='string') state.indexQuery=saved.indexQuery.slice(0,80);
      if(signalIndex?.filters?.some(filter=>filter.id===saved.indexFilter)) state.indexFilter=saved.indexFilter;
      if(signalIndex?.items?.some(item=>item.id===saved.indexSelection)) state.indexSelection=saved.indexSelection;
      Object.keys(state.layers).forEach(key=>{if(typeof saved.layers?.[key]==='boolean') state.layers[key]=saved.layers[key];});
      Object.keys(state.detailLayers).forEach(key=>{if(typeof saved.detailLayers?.[key]==='boolean') state.detailLayers[key]=saved.detailLayers[key];});
    }
    function saveMapSession(){
      try{
        sessionStorage.setItem(sessionKey,JSON.stringify({
          entryVersion:sessionVersion,
          mode:state.mode,region:state.region,marker:state.marker,synchronyPoint:state.synchronyPoint,
          detail:state.detail,detailSite:state.detailSite,detailLayers:{...state.detailLayers},
          operation:state.operation,step:state.step,intelCollapsed:state.intelCollapsed,
          indexOpen:state.indexOpen,indexQuery:state.indexQuery,indexFilter:state.indexFilter,indexSelection:state.indexSelection,
          layers:{...state.layers}
        }));
      }catch(_error){}
    }
    restoreRecentLocations();
    restoreMapSession();
    const initialMapLocationPath=readInitialMapLocationPath();
    if(initialMapLocationPath?.length){
      const matchesRestoredLocation=JSON.stringify(mapLocationParts())===JSON.stringify(initialMapLocationPath);
      const restoredTransientState={intelCollapsed:state.intelCollapsed,indexOpen:state.indexOpen,indexSelection:state.indexSelection};
      if(!applyMapLocationPath(initialMapLocationPath,{shouldRender:false})){
        state.mode='landing';state.intelCollapsed=true;writeMapLocation('replace');
      }else if(matchesRestoredLocation) Object.assign(state,restoredTransientState);
    }
    const scenarioButton=(scenarioId,labels)=>{
      const summary=pilgrimageOutcome(scenarioId);
      if(scenarioId==='deadzone-recovery'&&!recoveryUnlocked()) return `<button type="button" class="pc-map-pilgrimage-entry is-locked" data-map-open-pilgrimage="deadzone-return">DZ-VR-04 역방향 순례 판정 후 접근 승인</button>`;
      const label=summary?.status==='complete'?labels.complete:summary?.status==='active'?labels.active:labels.idle;
      return `<button type="button" class="pc-map-pilgrimage-entry" data-map-open-pilgrimage="${escapeHTML(scenarioId)}">${escapeHTML(label)}</button>`;
    };
    const resolvePilgrimageTarget=item=>{
      if(!item) return item;
      const link=scenarioStageByItem[item.id];const scenarioId=link?.[0];const stageIndex=link?.[1];
      if(!scenarioId) return item;
      const scenario=root.ProjectCursePilgrimageData?.scenarios?.[scenarioId];
      const ending=pilgrimageOutcome(scenarioId)?.endingData;
      if(ending&&stageIndex===scenario?.stages?.length-1) return {...item,status:ending.status,tone:ending.tone};
      const saved=pilgrimageStore?.get?.(scenarioId)?.choices?.find(entry=>entry.stage===scenario?.stages?.[stageIndex]?.id);
      if(saved) return {...item,status:scenario?.outcomeLabels?.[saved.ruleOutcome]||saved.ruleOutcome.toUpperCase(),tone:traceTone(saved.ruleOutcome)};
      return item;
    };
    const detailForMarker=marker=>{
      const map={
        'tokyo':'eastasia-northern-front','lanzhou':'eastasia-northern-front','northern-front':'eastasia-northern-front',
        'blood-lake-site':'europe-north-sea-blockade','fhc-europe':'europe-north-sea-blockade',
        'gbf-core':'gbf-inner-refuges','monsur-church':'gbf-western-marches','unlit-fortress':'gbf-western-marches','black-river':'gbf-western-marches','southern-coast':'gbf-coastal-belt',
        'dead-interior':'deadzone-return-corridor','returned-coast':'deadzone-return-corridor','former-us-branch':'deadzone-kingdom-graves'
      };
      return detailById(map[marker?.id]||(marker?.region==='southamerica'?'gbf-western-marches':marker?.region==='northamerica'?'deadzone-return-corridor':''));
    };

    const indexItems=signalIndex?.items||[];
    const indexItemById=id=>indexItems.find(item=>item.id===id)||null;
    const indexTypeLabel=item=>signalIndex?.categoryLabels?.[item.category]||item.category.toUpperCase();
    const indexConfidenceLabel=item=>signalIndex?.confidenceLabels?.[item.confidence]||confidenceLabels[item.confidence]||item.confidence;
    const isMobileIndex=()=>matchMedia('(max-width: 820px)').matches;
    const indexMatchesFilter=item=>{
      if(state.indexFilter==='all') return true;
      if(['event','site','operation','synchrony'].includes(state.indexFilter)) return item.category===state.indexFilter;
      if(state.indexFilter==='confirmed') return !item.uncertain&&item.category!=='withheld';
      if(state.indexFilter==='estimated') return item.uncertain;
      if(state.indexFilter==='unresolved') return item.unresolved;
      if(state.indexFilter==='linked') return item.linked;
      return true;
    };
    const filteredIndexItems=()=>{
      const query=state.indexQuery.trim().toLocaleLowerCase('ko-KR');
      return indexItems.filter(item=>indexMatchesFilter(item)&&(!query||item.search.includes(query)));
    };

    function renderIndexResults(){
      const items=filteredIndexItems();
      if(!items.length) return '<div class="pc-map-index-empty"><b>NO MATCHING CONTACT</b><span>검색어나 필터를 바꾸면 다른 관측 기록을 확인할 수 있다.</span></div>';
      return items.map(item=>{
        const selected=state.indexSelection===item.id;
        const mapLabel=item.mapStatus==='withheld'?'POSITION WITHHELD':item.mapStatus==='independent'?'NO ROUTE':item.mapStatus==='operation'?'TRACE MAP':'MAP CONTACT';
        const links=item.records.length+(item.history?1:0)+(item.factions?.length||0);
        const actions=item.category==='withheld'?`<div class="pc-map-index-item-actions">
          ${item.history?`<button type="button" data-map-open-history="${escapeHTML(item.history)}">세계 기록</button>`:''}
          ${(item.factionKeys||[]).map(key=>`<button type="button" data-map-open-faction="${escapeHTML(key)}">${escapeHTML(root.ProjectCurseCanon?.factions?.[key]?.name||key)}</button>`).join('')}
          ${item.records.map(record=>`<button type="button" data-map-open-record="${escapeHTML(record)}">${escapeHTML(record)}</button>`).join('')}
        </div>`:'';
        return `<article class="pc-map-index-item pc-map-index-item--${escapeHTML(item.category)}${selected?' is-selected':''}" role="listitem">
          <button type="button" data-map-index-item="${escapeHTML(item.id)}" aria-current="${selected?'true':'false'}"${item.category==='withheld'?' aria-describedby="pcMapIndexWithheldNote"':''}>
            <span class="pc-map-index-kind"><i></i>${escapeHTML(indexTypeLabel(item))}<time>${escapeHTML(item.year)}</time></span>
            <strong>${escapeHTML(item.title)}</strong>
            <small>${escapeHTML(item.code)} · ${escapeHTML(item.region)}</small>
            <p>${escapeHTML(item.meta)}</p>
            <span class="pc-map-index-tags"><b>${escapeHTML(indexConfidenceLabel(item))}</b><em>${escapeHTML(mapLabel)}</em><i>${links} LINK${links===1?'':'S'}</i></span>
          </button>${actions}
        </article>`;
      }).join('');
    }

    function renderSignalIndex(){
      if(!signalIndex) return '';
      const matches=filteredIndexItems().length;
      const selected=indexItemById(state.indexSelection);
      const mobile=isMobileIndex();
      return `
        <div class="pc-map-index-bar">
          <button type="button" class="pc-map-index-toggle${state.indexOpen?' is-active':''}" data-map-index-toggle aria-expanded="${state.indexOpen}" aria-controls="pcMapSignalIndex">
            <span><i></i>SIGNAL INDEX</span><b>${indexItems.length} CONTACTS</b><small>${selected?escapeHTML(selected.title):'검색·필터·지도 자동 추적'}</small><em aria-hidden="true"></em>
          </button>
        </div>
        <button type="button" class="pc-map-index-scrim${state.indexOpen?' is-visible':''}" data-map-index-close aria-label="신호 색인 닫기" tabindex="${state.indexOpen?'0':'-1'}"></button>
        <section class="pc-map-signal-index${state.indexOpen?' is-open':''}" id="pcMapSignalIndex" role="dialog" aria-modal="${mobile}" aria-hidden="${!state.indexOpen}" aria-labelledby="pcMapIndexTitle"${state.indexOpen?'':' inert'}>
          <header class="pc-map-index-head">
            <div><span>U.A.C CARTOGRAPHIC CONTACT REGISTER</span><h3 id="pcMapIndexTitle">SIGNAL INDEX</h3><p>표식·작전·독립 관측과 위치 보류 기록을 하나의 판독 목록으로 묶는다.</p></div>
            <div><b>${String(indexItems.length).padStart(2,'0')}</b><small>TOTAL CONTACTS</small></div>
            <button type="button" data-map-index-close aria-label="신호 색인 닫기"><i></i></button>
          </header>
          <div class="pc-map-index-tools">
            <label><span>CONTACT SEARCH</span><input type="search" value="${escapeHTML(state.indexQuery)}" placeholder="사건·권역·세력·호출부호 검색" maxlength="80" autocomplete="off" spellcheck="false" data-map-index-search></label>
            <button type="button" data-map-index-clear${state.indexQuery?'':' disabled'}>검색 초기화</button>
          </div>
          <div class="pc-map-index-filters" role="group" aria-label="신호 색인 필터">
            ${signalIndex.filters.map(filter=>`<button type="button" class="${state.indexFilter===filter.id?'is-active':''}" data-map-index-filter="${escapeHTML(filter.id)}" aria-pressed="${state.indexFilter===filter.id}">${escapeHTML(filter.label)}</button>`).join('')}
          </div>
          <div class="pc-map-index-result-head"><span role="status" aria-live="polite" data-map-index-count>${matches}개 접촉 정보</span><b>${escapeHTML(signalIndex.filters.find(filter=>filter.id===state.indexFilter)?.label||'전체')} / ${state.indexQuery?'SEARCH ACTIVE':'ARCHIVE READY'}</b></div>
          <div class="pc-map-index-results" role="list" data-map-index-results>${renderIndexResults()}</div>
          <p class="pc-map-index-withheld-note" id="pcMapIndexWithheldNote">POSITION WITHHELD 항목은 사건을 부정하지 않는다. 승인된 지도 표식이 없어 위치 이동만 제한한다.</p>
        </section>`;
    }

    function updateSignalIndex(){
      const results=mount.querySelector('[data-map-index-results]');
      if(results) results.innerHTML=renderIndexResults();
      const count=mount.querySelector('[data-map-index-count]');
      if(count) count.textContent=`${filteredIndexItems().length}개 접촉 정보`;
      mount.querySelectorAll('[data-map-index-filter]').forEach(button=>{
        const active=button.dataset.mapIndexFilter===state.indexFilter;
        button.classList.toggle('is-active',active);
        button.setAttribute('aria-pressed',String(active));
      });
      const clear=mount.querySelector('[data-map-index-clear]');
      if(clear) clear.disabled=!state.indexQuery;
      saveMapSession();
    }

    function selectIndexItem(item){
      if(!item) return;
      state.indexSelection=item.id;
      if(item.target.kind==='marker'){
        const marker=markerById(item.target.id);
        state.mode='region';state.region=marker.region;state.marker=marker.id;state.synchronyPoint=null;state.intelCollapsed=false;
        state.layers[['estimated','testimony','disputed'].includes(marker.confidence)?'estimated':'confirmed']=true;
      }else if(item.target.kind==='synchrony'){
        state.mode='region';state.region=item.regionId;state.marker=null;state.synchronyPoint=item.target.id;state.layers.synchrony=true;state.intelCollapsed=false;
      }else if(item.target.kind==='operation'){
        state.mode='operation';state.operation=item.target.id;state.step=operationStep(operationById(item.target.id));state.intelCollapsed=false;
      }else if(item.target.kind==='withheld'){
        state.mode='region';state.region=item.regionId;state.marker=null;state.synchronyPoint=null;state.intelCollapsed=true;
      }
      if(item.target.kind!=='withheld'&&isMobileIndex()) state.indexOpen=false;
      root.ProjectCurseAudioControl?.play?.(item.target.kind==='withheld'?'map.layer':'map.signal');
      render({historyMode:'push'});
    }

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
      marker=resolvePilgrimageTarget(marker);
      const selected=state.marker===marker.id?' is-selected':'';
      const outcome=marker.tone?` is-${escapeHTML(marker.tone)}`:'';
      const title=escapeHTML(marker.title);
      const meta=escapeHTML(marker.meta);
      const labelX=Number.isFinite(marker.labelX)?marker.labelX:13;
      const labelAnchor=marker.labelAnchor==='end'?'end':'start';
      return `
        <g class="pc-map-marker pc-map-marker--${escapeHTML(marker.type)}${outcome}${selected}" data-map-marker="${escapeHTML(marker.id)}" role="button" tabindex="0" aria-label="${title}: ${meta}" transform="translate(${marker.x} ${marker.y})">
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

    function synchronyPointSymbol(event,point,region){
      const selected=state.synchronyPoint===point.id?' is-selected':'';
      const regional=region.id==='world'?' is-world':' is-regional';
      const title=`${event.title} / ${point.label}`;
      return `
        <g class="pc-map-synchrony-point pc-map-synchrony-point--${escapeHTML(point.kind)}${regional}${selected}" data-map-synchrony-point="${escapeHTML(point.id)}" role="button" tabindex="0" aria-label="${escapeHTML(title)}: ${escapeHTML(point.site)}" transform="translate(${point.x} ${point.y})">
          <circle class="pc-map-synchrony-hit" r="24"></circle>
          <circle class="pc-map-synchrony-wave pc-map-synchrony-wave--outer" r="16"></circle>
          <circle class="pc-map-synchrony-wave" r="10"></circle>
          <rect class="pc-map-synchrony-core" x="-3.5" y="-3.5" width="7" height="7" rx="1"></rect>
          <text class="pc-map-synchrony-code" x="12" y="-8">${escapeHTML(point.code)}</text>
          ${region.id==='world'?'':`<text class="pc-map-synchrony-label" x="12" y="5">${escapeHTML(point.label)}</text>`}
        </g>`;
    }

    function renderSynchronyIntel(event,point){
      const regionCount=event.points.filter(item=>item.region===point.region).length;
      const regionLabel=point.region==='southamerica'?'대흑림 성채':'데드존 검문소';
      return `
        <div class="pc-map-intel-kicker">SYNCHRONY EVENT / ${escapeHTML(confidenceLabels[event.confidence]||event.confidence)}</div>
        <h3>${escapeHTML(event.title)}</h3>
        <p>${escapeHTML(point.label)} · ${escapeHTML(point.site)}</p>
        <dl class="pc-map-facts">
          <div><dt>사건 코드</dt><dd>${escapeHTML(event.code)}</dd></div>
          <div><dt>관측 시각</dt><dd>${escapeHTML(event.date)}</dd></div>
          <div><dt>무응답</dt><dd>${escapeHTML(event.duration)}</dd></div>
          <div><dt>현장 묶음</dt><dd>${escapeHTML(regionLabel)} ${regionCount}곳</dd></div>
          <div><dt>수신 호출</dt><dd>${escapeHTML(point.callsign)}</dd></div>
          <div><dt>복구 장부</dt><dd>${escapeHTML(point.log)}</dd></div>
        </dl>
        <div class="pc-map-synchrony-summary">
          <small>SIMULTANEOUS OBSERVATION</small>
          <div><b>06</b><span>GBF CASTLES</span><i></i><b>04</b><span>DZ CHECKPOINTS</span></div>
          <p>${escapeHTML(event.summary)}</p>
        </div>
        <div class="pc-map-warning pc-map-synchrony-boundary"><b>NO ROUTE / NO GEOGRAPHIC LINK</b>${escapeHTML(event.boundary)}</div>
        <div class="pc-map-intel-actions">
          <button type="button" data-map-open-history="${escapeHTML(event.history)}">세계 기록에서 삼야 무응답 열기</button>
        </div>`;
    }

    function renderRegionIntel(region,marker,synchronySignal){
      if(synchronySignal) return renderSynchronyIntel(synchronySignal.event,synchronySignal.point);
      const regionalDetails=(data.drilldowns||[]).filter(detail=>detail.region===region.id);
      if(!marker){
        const naming=region.nomenclature;
        const aliases=naming?.aliases?.map(item=>item.label).join(' · ');
        const legacy=naming?.legacy?.map(item=>item.label).join(' · ');
        return `
          <div class="pc-map-intel-kicker">SELECTED REGION</div>
          <h3>${escapeHTML(region.label)}</h3>
          <p>${escapeHTML(region.description)}</p>
          <dl class="pc-map-facts">
            ${naming?`<div><dt>기록 표제</dt><dd>${escapeHTML(naming.primary)} / ${escapeHTML(naming.short)}</dd></div>
            <div><dt>지리 범위</dt><dd>${escapeHTML(naming.scope)}</dd></div>
            ${aliases?`<div><dt>현지·구어</dt><dd>${escapeHTML(aliases)}</dd></div>`:''}
            ${legacy?`<div><dt>폐기 표기</dt><dd>${escapeHTML(legacy)}</dd></div>`:''}`:''}
            <div><dt>관제 상태</dt><dd>${escapeHTML(region.status)}</dd></div>
            <div><dt>자료 상태</dt><dd>${escapeHTML(region.confidence)}</dd></div>
          </dl>
          <div class="pc-map-warning">${escapeHTML(naming?.boundary||'표시 좌표는 항법용이 아니다. 신뢰도와 상충 기록을 함께 판독할 것.')}</div>
          ${regionalDetails.length?`<div class="pc-map-crosslinks pc-map-detail-entry"><b>세부 권역</b>${regionalDetails.map(detail=>`<button type="button" data-map-open-detail="${escapeHTML(detail.id)}">${escapeHTML(detail.label)}<i>${escapeHTML(detail.confidence)} →</i></button>`).join('')}</div>`:''}`;
      }

      marker=resolvePilgrimageTarget(marker);
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
          ${marker.id==='unlit-fortress'?`<button type="button" class="pc-map-pilgrimage-entry" data-map-open-pilgrimage="unlit-fortress">${pilgrimageOutcome('unlit-fortress')?.status==='idle'?'현장 순례 개시':'순례 기록 재개'}</button>`:''}
          ${marker.id==='returned-coast'?`<button type="button" class="pc-map-pilgrimage-entry" data-map-open-pilgrimage="deadzone-return">${pilgrimageOutcome('deadzone-return')?.status==='idle'?'귀환자 검문 개시':pilgrimageOutcome('deadzone-return')?.status==='complete'?'귀환 판정 결과 열기':'저장된 검문 재개'}</button>`:''}
          ${marker.id==='dead-interior'?scenarioButton('deadzone-recovery',{idle:'전진 회수 작전 개시',active:'저장된 회수 작전 재개',complete:'전진 회수 결과 열기'}):''}
        </div>`;
    }

    function detailTerrain(detail){
      if(detail.terrain==='front') return `
        <path class="pc-detail-terrain pc-detail-terrain--front" d="M0 84 C142 38 238 104 365 62 S614 98 728 47 884 76 1000 32 L1000 540 0 540 Z"></path>
        <g class="pc-detail-front-grid"><path d="M40 463 L198 381 344 408 501 334 646 286 788 183 958 84"></path><path d="M119 510 L263 420 431 449 566 366 731 321 903 202"></path><path d="M176 78 V475 M356 42 V458 M538 68 V407 M716 31 V338 M875 56 V246"></path></g>
        <path class="pc-detail-front-barrier" d="M598 430 C666 365 702 297 764 248 S858 161 954 104"></path>`;
      if(detail.terrain==='northsea') return `
        <path class="pc-detail-terrain pc-detail-terrain--northsea" d="M0 0 H1000 V540 H0 Z"></path>
        <path class="pc-detail-northsea-coast" d="M0 438 C128 391 213 417 316 354 S503 322 609 253 824 224 1000 128 L1000 540 0 540 Z"></path>
        <g class="pc-detail-northsea-current"><path d="M41 104 C196 52 289 143 432 97 S702 75 954 31"></path><path d="M32 214 C194 168 304 232 452 189 S737 173 972 92"></path><path d="M167 312 C302 260 397 311 536 270 S778 252 955 181"></path></g>
        <path class="pc-detail-northsea-blockade" d="M526 83 C626 45 765 62 856 126 S917 277 847 349"></path>`;
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
      site=resolvePilgrimageTarget(site);
      const verdict=operationStore?.get?.().verdict;
      const outcome=verdict&&site.verdictStates?.[verdict];
      return {...site,status:outcome?.status||site.status,tone:outcome?.tone||''};
    }

    function routesForSite(detail,siteId){return (detail.routes||[]).filter(route=>(route.siteIds||[]).includes(siteId));}
    function threatForSite(site){
      const resolved=resolveDetailSite(site);
      if(['failed','hostile'].includes(resolved.tone)) return 'critical';
      if(['allied','secured'].includes(resolved.tone)) return 'low';
      if(resolved.tone==='contained') return 'medium';
      if(['unknown','incident','zone','anomaly'].includes(site.type)||site.confidence==='disputed') return 'high';
      if(['cult','fortress','ruin'].includes(site.type)) return 'medium';
      return 'low';
    }
    function communicationForSite(site){
      const resolved=resolveDetailSite(site);
      if(['allied','secured'].includes(resolved.tone)) return 'open';
      if(['failed','hostile'].includes(resolved.tone)||['unknown','anomaly','zone','incident'].includes(site.type)) return 'lost';
      if(['facility','signal','settlement','returned','cult'].includes(site.type)) return 'partial';
      return 'none';
    }

    function renderDetailOverlays(detail,selected){
      const threatRadius={critical:78,high:62,medium:48,low:34};
      const threats=state.detailLayers.threats?detail.sites.map(site=>{
        const risk=threatForSite(site);
        const active=!selected||selected.id===site.id;
        return `<circle class="pc-detail-threat pc-detail-threat--${risk}${active?' is-active':''}" cx="${site.x}" cy="${site.y}" r="${threatRadius[risk]}"></circle>`;
      }).join(''):'';
      const comms=state.detailLayers.comms?detail.sites.map(site=>{
        const comm=communicationForSite(site);
        if(comm==='none'||comm==='lost') return '';
        return `<circle class="pc-detail-comm pc-detail-comm--${comm}${selected&&selected.id!==site.id?' is-muted':''}" cx="${site.x}" cy="${site.y}" r="${comm==='open'?88:66}"></circle>`;
      }).join(''):'';
      const distortion=state.detailLayers.distortion?detail.sites.map((site,index)=>{
        if(!['anomaly','unknown'].includes(site.type)&&site.confidence!=='disputed') return '';
        const active=!selected||selected.id===site.id;
        return `<ellipse class="pc-detail-distortion${active?' is-active':''}" cx="${site.x}" cy="${site.y}" rx="${74+(index%2)*15}" ry="${42+(index%3)*8}" transform="rotate(${(index%2?18:-14)} ${site.x} ${site.y})"></ellipse>`;
      }).join(''):'';
      return `<g class="pc-detail-overlays">${threats}${comms}${distortion}</g>`;
    }

    function detailSiteSymbol(site,index,relatedSiteIds=new Set()){
      const resolved=resolveDetailSite(site);
      const selected=state.detailSite===site.id?' is-selected':'';
      const tone=resolved.tone?` is-${escapeHTML(resolved.tone)}`:'';
      const focus=state.detailSite?(relatedSiteIds.has(site.id)?' is-related':' is-muted'):'';
      return `
        <g class="pc-detail-site pc-detail-site--${escapeHTML(site.type)}${tone}${focus}${selected}" data-map-detail-site="${escapeHTML(site.id)}" role="button" tabindex="0" aria-label="${escapeHTML(site.label)}: ${escapeHTML(resolved.status)}" transform="translate(${site.x} ${site.y})">
          <circle class="pc-detail-site-hit" r="28"></circle><circle class="pc-detail-site-ring" r="12"></circle><path class="pc-detail-site-core" d="M0 -6 L6 0 0 6 -6 0Z"></path>
          <text class="pc-detail-site-index" x="17" y="-10">${String(index+1).padStart(2,'0')}</text><text class="pc-detail-site-label" x="17" y="5">${escapeHTML(site.label)}</text>
        </g>`;
    }

    function renderRouteSequence(detail,site){
      if(!site) return '';
      const routes=routesForSite(detail,site.id);
      if(!routes.length) return '<div class="pc-detail-route-empty">연결 경로가 복원되지 않았다.</div>';
      return `<div class="pc-detail-route-sequences"><div class="pc-detail-sequence-title"><b>CONNECTED ROUTE</b><span>${routes.length} TRACE${routes.length>1?'S':''}</span></div>${routes.map(route=>{
        const current=Math.max(0,(route.siteIds||[]).indexOf(site.id));
        const previous=route.siteIds?.[current-1];
        const next=route.siteIds?.[current+1];
        return `<section class="pc-detail-route-card pc-detail-route-card--${escapeHTML(route.risk||'medium')}">
          <header><div><small>${escapeHTML(route.label)}</small><b>${escapeHTML(riskLabels[route.risk]||route.risk)} 위험 · ${escapeHTML(String(route.signal||'unknown').toUpperCase())}</b></div><span>${current+1}/${route.siteIds.length}</span></header>
          <ol>${route.siteIds.map((id,index)=>{const target=detail.sites.find(item=>item.id===id);if(!target)return '';const phase=index<current?'is-before':index===current?'is-current':'is-after';return `<li><button type="button" class="${phase}" data-map-route-step="${escapeHTML(id)}" aria-current="${index===current?'step':'false'}"><i>${String(index+1).padStart(2,'0')}</i><span>${escapeHTML(target.label)}</span><em>${index<current?'PASSED':index===current?'CURRENT':'NEXT'}</em></button></li>`;}).join('')}</ol>
          <p>${escapeHTML(route.rule||'현장 판단을 우선할 것.')}</p>
          <div class="pc-detail-route-nav">${previous?`<button type="button" data-map-route-step="${escapeHTML(previous)}">← 이전 지점</button>`:'<span>경로 시작</span>'}${next?`<button type="button" data-map-route-step="${escapeHTML(next)}">다음 지점 →</button>`:'<span>경로 종결</span>'}</div>
        </section>`;
      }).join('')}</div>`;
    }

    function detailBriefVisible(brief,site){
      return Boolean(brief&&(!site||!brief.siteIds?.length||brief.siteIds.includes(site.id)));
    }

    function detailCueForSite(siteId,fallback='map.signal'){
      const detail=detailById(state.detail);
      const site=detail?.sites?.find(item=>item.id===siteId);
      if(!site) return fallback;
      return detailBriefVisible(detail.visual,site)||detailBriefVisible(detail.signalBrief,site)?'map.brief':fallback;
    }

    function renderDetailVisual(detail,site){
      const visual=detail.visual;
      if(!detailBriefVisible(visual,site)) return '';
      const historyId=visual.history||site?.history;
      const fallback=root.ProjectCurseMedia?'':` src="${escapeHTML(visual.src)}"`;
      return `<figure class="pc-map-visual-brief" data-map-visual-brief>
        <button type="button" class="pc-map-visual-open"${historyId?` data-map-open-history="${escapeHTML(historyId)}"`:''} aria-label="${escapeHTML(visual.title)} 확대 및 세계 기록 열기">
          <span class="pc-map-visual-frame" data-pc-media-frame>
            <img data-pc-source="${escapeHTML(visual.src)}" data-pc-media-mode="thumbnail"${fallback} alt="${escapeHTML(visual.alt||'')}"/>
            <span class="pc-map-visual-state">RECONSTRUCTED</span><i aria-hidden="true"></i>
          </span>
        </button>
        <figcaption><small>${escapeHTML(visual.label||'복원 추정')}</small><b>${escapeHTML(visual.title)}</b><p>${escapeHTML(visual.caption||'')}</p>${historyId?`<button type="button" data-map-open-history="${escapeHTML(historyId)}">확대·세계 기록 열기 <i>→</i></button>`:''}<span>${escapeHTML(visual.assetId||'VISUAL EVIDENCE')}</span></figcaption>
      </figure>`;
    }

    function renderDetailSignalBrief(detail,site){
      const brief=detail.signalBrief;
      if(!detailBriefVisible(brief,site)) return '';
      const lanes=(brief.lanes||[]).map(lane=>{
        const bars=(lane.pattern||[]).map(level=>`<i style="--pc-signal-level:${Math.max(1,Math.min(9,Number(level)||1))*10}%"></i>`).join('');
        return `<div class="pc-map-signal-lane"><header><b>${escapeHTML(lane.code)}</b><span>${escapeHTML(lane.state)}</span></header><div class="pc-map-signal-wave" aria-hidden="true">${bars}</div><small>${escapeHTML(lane.fingerprint)}</small></div>`;
      }).join('');
      const checks=(brief.checks||[]).map(check=>`<div class="is-${escapeHTML(check.tone||'neutral')}"><dt>${escapeHTML(check.label)}</dt><dd>${escapeHTML(check.value)}</dd></div>`).join('');
      const log=(brief.log||[]).map(entry=>`<li><time>${escapeHTML(entry.time)}</time><span>${escapeHTML(entry.text)}</span></li>`).join('');
      return `<section class="pc-map-signal-brief" aria-label="${escapeHTML(brief.title)}">
        <header><small>${escapeHTML(brief.label||'SIGNAL COMPARISON')}</small><b>${escapeHTML(brief.title)}</b><p>${escapeHTML(brief.summary||'')}</p></header>
        <div class="pc-map-signal-lanes">${lanes}</div><dl class="pc-map-signal-checks">${checks}</dl><ol class="pc-map-signal-log">${log}</ol>
      </section>`;
    }

    function renderDetailBriefing(detail,site){
      return `${renderDetailVisual(detail,site)}${renderDetailSignalBrief(detail,site)}`;
    }

    function detailBriefTarget(detail,selected){
      const siteIds=[...new Set([...(detail.visual?.siteIds||[]),...(detail.signalBrief?.siteIds||[])])];
      if(selected&&siteIds.includes(selected.id)) return selected;
      return detail.sites.find(site=>siteIds.includes(site.id))||null;
    }

    function renderMobileDetailBriefEntry(detail,selected){
      const target=detailBriefTarget(detail,selected);
      if(!target) return '';
      const counts=[];
      if(detail.visual) counts.push('복원 자료 1건');
      if(detail.signalBrief) counts.push('신호 대조 1건');
      const title=detail.visual?.title||detail.signalBrief?.title||detail.label;
      const summary=detail.signalBrief?.summary||detail.visual?.caption||detail.description;
      const expanded=!state.intelCollapsed&&state.detailSite===target.id;
      return `<section class="pc-map-mobile-brief-entry" aria-label="${escapeHTML(detail.label)} 복원 브리핑">
        <button type="button" data-map-detail-brief="${escapeHTML(target.id)}" aria-expanded="${expanded}" aria-controls="pcMapDetailIntelBody">
          <span><small>RECOVERED BRIEFING</small><b>${escapeHTML(counts.join(' · '))}</b></span>
          <strong>${escapeHTML(title)}</strong><p>${escapeHTML(summary)}</p><em aria-hidden="true">OPEN BRIEF →</em>
        </button>
      </section>`;
    }

    function renderMobileDetailSiteIndex(detail,selected){
      return `<section class="pc-map-mobile-site-index" aria-labelledby="pcMapMobileSiteIndexTitle">
        <header><div><small>SIGNAL DIRECTORY</small><h3 id="pcMapMobileSiteIndexTitle">지점 판독 목록</h3></div><span>${detail.sites.length} SIGNALS</span></header>
        <p>작은 지도 표식 대신 목록에서 지점을 선택할 수 있습니다. 선택하면 현장 정보와 연결 경로가 바로 펼쳐집니다.</p>
        <div>${detail.sites.map((site,index)=>{
          const resolved=resolveDetailSite(site);
          const risk=threatForSite(site);
          const active=selected?.id===site.id;
          return `<button type="button" class="pc-map-mobile-site${active?' is-active':''}" data-map-detail-site="${escapeHTML(site.id)}" data-map-detail-source="list" aria-pressed="${active}"><i>${String(index+1).padStart(2,'0')}</i><span><b>${escapeHTML(site.label)}</b><small>${escapeHTML(resolved.status)}</small></span><em class="is-${escapeHTML(risk)}">${escapeHTML(riskLabels[risk])}</em></button>`;
        }).join('')}</div>
      </section>`;
    }

    function focusDetailIntelAfterRender(){
      root.requestAnimationFrame(()=>{
        const heading=mount.querySelector('[data-map-detail-intel-heading]');
        if(!heading) return;
        if(isMobileIndex()){
          const reduceMotion=root.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
          heading.closest('.pc-map-detail-intel')?.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});
        }
        heading.focus({preventScroll:true});
      });
    }

    function renderDetailIntel(detail,site){
      if(!site) return `
        <div class="pc-map-intel-kicker">REGIONAL DRILLDOWN</div>
        <h3 tabindex="-1" data-map-detail-intel-heading>${escapeHTML(detail.label)}</h3>
        <p>${escapeHTML(detail.description)}</p>
        ${renderDetailBriefing(detail,null)}
        <dl class="pc-map-facts"><div><dt>상태</dt><dd>${escapeHTML(detail.status)}</dd></div><div><dt>복원 신뢰도</dt><dd>${escapeHTML(detail.confidence)}</dd></div><div><dt>사건 지점</dt><dd>${detail.sites.length} SIGNALS</dd></div></dl>
        <div class="pc-map-warning">${escapeHTML(detail.warning)}</div>
        ${detail.operation?`<button class="pc-map-region-return" type="button" data-map-open-operation="${escapeHTML(detail.operation)}">연결 작전지도 열기</button>`:''}
        <button class="pc-map-region-return" type="button" data-map-return-region="${escapeHTML(detail.region)}">상위 권역으로 돌아가기</button>`;

      const resolved=resolveDetailSite(site);
      const incident=incidentById(site.incident);
      const historyId=site.history||incident?.history;
      const records=[...new Set([...(site.records||[]),...(incident?.records||[])])];
      const connectedRoutes=routesForSite(detail,site.id);
      const threat=threatForSite(site);
      const communication=communicationForSite(site);
      return `
        <div class="pc-map-intel-kicker">SELECTED SITE / ${escapeHTML(confidenceLabels[site.confidence]||site.confidence)}</div>
        <h3 tabindex="-1" data-map-detail-intel-heading>${escapeHTML(site.label)}</h3>
        <p>${escapeHTML(site.meta)}</p>
        ${renderDetailBriefing(detail,site)}
        <dl class="pc-map-facts"><div><dt>현재 상태</dt><dd class="pc-detail-state${resolved.tone?` is-${escapeHTML(resolved.tone)}`:''}">${escapeHTML(resolved.status)}</dd></div><div><dt>위험도</dt><dd class="pc-detail-risk is-${escapeHTML(threat)}">${escapeHTML(riskLabels[threat])}</dd></div><div><dt>통신</dt><dd>${escapeHTML(communication.toUpperCase())}</dd></div><div><dt>연결 경로</dt><dd>${connectedRoutes.length} TRACE${connectedRoutes.length>1?'S':''}</dd></div><div><dt>판정</dt><dd>${escapeHTML(confidenceLabels[site.confidence]||site.confidence)}</dd></div>${incident?`<div><dt>사건 코드</dt><dd>${escapeHTML(incident.code)}</dd></div>`:''}</dl>
        ${site.verdictStates?`<div class="pc-detail-verdict-note"><b>FIELD OPERATION COPY</b><span>${operationStore?.get?.().verdict?`현장 판정에 따라 이 지도 사본만 갱신됨 · 중앙 기록 변화 없음`:'판정을 저장하면 이 지도 사본의 지점 상태만 변경됨'}</span></div>`:''}
        ${incident?`<div class="pc-map-incident-summary"><b>${escapeHTML(incident.date)}</b><p>${escapeHTML(incident.summary)}</p></div>`:''}
        ${records.length?`<div class="pc-map-crosslinks"><b>연결 기록</b>${records.map(record=>`<button type="button" data-map-open-record="${escapeHTML(record)}">${escapeHTML(record)}<i>ARCHIVE →</i></button>`).join('')}</div>`:''}
        <div class="pc-map-intel-actions">
          ${historyId?`<button type="button" data-map-open-history="${escapeHTML(historyId)}">세계 기록에서 사건 열기</button>`:''}
          ${site.operation?`<button type="button" data-map-open-operation="${escapeHTML(site.operation)}">연결 작전지도 열기</button>`:''}
          ${site.id==='gbf-unlit-fortress'?`<button type="button" class="pc-map-pilgrimage-entry" data-map-open-pilgrimage="unlit-fortress">${pilgrimageOutcome('unlit-fortress')?.status==='idle'?'이 지점에서 순례 개시':'순례 기록 재개'}</button>`:''}
          ${site.id==='dead-checkpoint-07'?`<button type="button" class="pc-map-pilgrimage-entry" data-map-open-pilgrimage="deadzone-return">${pilgrimageOutcome('deadzone-return')?.status==='idle'?'검문소 07 귀환 심사 개시':pilgrimageOutcome('deadzone-return')?.status==='complete'?'저장된 귀환 판정 열기':'귀환자 검문 재개'}</button>`:''}
          ${['dead-sublevel-08','dead-checkpoint-06','dead-reverse-highway','dead-origin-beacon'].includes(site.id)?scenarioButton('deadzone-recovery',{idle:'이 좌표에서 전진 회수 작전 개시',active:'저장된 전진 회수 작전 재개',complete:'전진 회수 판정 결과 열기'}):''}
          <button type="button" data-map-detail-clear="1">구역 개요로 돌아가기</button>
        </div>
        ${renderRouteSequence(detail,site)}`;
    }

    function renderIntelPanel(type,title,content){
      const bodyId=`pcMap${type[0].toUpperCase()}${type.slice(1)}IntelBody`;
      const expanded=!state.intelCollapsed;
      return `<button type="button" class="pc-map-intel-toggle" data-map-intel-toggle aria-expanded="${expanded}" aria-controls="${bodyId}" aria-label="${expanded?'지도 선택 정보 접기':'지도 선택 정보 펼치기'}"><small>FIELD INTELLIGENCE</small><b>${escapeHTML(title)}</b><i aria-hidden="true"></i></button><div class="pc-map-intel-body" id="${bodyId}">${content}</div>`;
    }

    function intelPanelClass(){return `pc-map-intel-panel${state.intelCollapsed?' is-collapsed':''}`;}

    function renderDetail(){
      const detail=detailById(state.detail);
      if(!detail) return '<div class="pc-map-warning">세부 권역 자료를 불러올 수 없다.</div>';
      state.detail=detail.id;
      state.region=detail.region;
      const selected=detail.sites.find(site=>site.id===state.detailSite)||null;
      const focusedRoutes=selected?routesForSite(detail,selected.id):[];
      const focusedRouteIds=new Set(focusedRoutes.map(route=>route.id));
      const relatedSiteIds=new Set(selected?focusedRoutes.flatMap(route=>route.siteIds||[]):detail.sites.map(site=>site.id));
      const parent=regionById(detail.region);
      return `
        <div class="pc-map-detail-tabs" role="tablist" aria-label="세부 권역">
          ${(data.drilldowns||[]).map(item=>`<button type="button" role="tab" aria-selected="${item.id===detail.id}" tabindex="${item.id===detail.id?'0':'-1'}" class="${item.id===detail.id?'is-active':''}" data-map-detail="${escapeHTML(item.id)}"><small>${escapeHTML(regionById(item.region).label)} · ${escapeHTML(item.code)}</small>${escapeHTML(item.label)}</button>`).join('')}
        </div>
        <div class="pc-map-breadcrumb"><button type="button" data-map-return-region="world">세계</button><i>›</i><button type="button" data-map-return-region="${escapeHTML(parent.id)}">${escapeHTML(parent.label)}</button><i>›</i><b>${escapeHTML(detail.label)}</b></div>
        <div class="pc-detail-layerbar" role="group" aria-label="세부 지도 레이어">
          <span>TACTICAL OVERLAY</span>
          <button type="button" class="${state.detailLayers.routes?'is-active':''}" data-map-detail-layer="routes" aria-pressed="${state.detailLayers.routes}"><i class="is-route"></i>경로</button>
          <button type="button" class="${state.detailLayers.threats?'is-active':''}" data-map-detail-layer="threats" aria-pressed="${state.detailLayers.threats}"><i class="is-threat"></i>위험 반경</button>
          <button type="button" class="${state.detailLayers.comms?'is-active':''}" data-map-detail-layer="comms" aria-pressed="${state.detailLayers.comms}"><i class="is-comm"></i>통신권</button>
          <button type="button" class="${state.detailLayers.distortion?'is-active':''}" data-map-detail-layer="distortion" aria-pressed="${state.detailLayers.distortion}"><i class="is-distortion"></i>공간 왜곡</button>
          ${selected?`<b>${focusedRoutes.length} CONNECTED TRACE${focusedRoutes.length!==1?'S':''}</b>`:'<b>ALL SIGNALS</b>'}
        </div>
        <div class="pc-map-detail-grid">
          <section class="pc-map-stage pc-map-detail-stage pc-map-detail-stage--${escapeHTML(detail.terrain)}${selected?' has-focus':''}" aria-label="${escapeHTML(detail.label)} 세부 지도">
            <div class="pc-map-stage-head"><span>${escapeHTML(detail.code)}</span><b>${escapeHTML(detail.status)} · ${escapeHTML(detail.confidence)}</b></div>
            <svg class="pc-map-svg" viewBox="0 0 1000 540" role="img" aria-labelledby="pcDetailTitle pcDetailDesc" preserveAspectRatio="xMidYMid meet">
              <title id="pcDetailTitle">${escapeHTML(detail.label)} 세부 지도</title><desc id="pcDetailDesc">복원된 경로와 사건 지점을 선택할 수 있는 세부 권역 지도</desc>
              <defs><pattern id="pc-detail-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" class="pc-map-grid-line"></path></pattern><filter id="pc-detail-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" result="blur"></feGaussianBlur><feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMerge></filter></defs>
              <rect class="pc-detail-grid" width="1000" height="540"></rect>${detailTerrain(detail)}${renderDetailOverlays(detail,selected)}
              ${state.detailLayers.routes?`<g class="pc-detail-routes">${detail.routes.map(route=>{const end=route.points.at(-1)||[0,0];const focus=selected?(focusedRouteIds.has(route.id)?' is-focused':' is-muted'):'';return `<g class="pc-detail-route-group${focus}" data-detail-route="${escapeHTML(route.id)}"><polyline class="pc-detail-route pc-detail-route--${escapeHTML(route.className)}" points="${polyline(route.points)}"></polyline><text class="pc-detail-route-label" x="${end[0]+9}" y="${end[1]-9}">${escapeHTML(route.label)}</text></g>`;}).join('')}</g>`:''}
              <g class="pc-detail-sites">${detail.sites.map((site,index)=>detailSiteSymbol(site,index,relatedSiteIds)).join('')}</g>
            </svg>
            <div class="pc-map-scan" aria-hidden="true"></div><div class="pc-map-coordinates">LOCAL TRACE · NOT FOR NAVIGATION · ${escapeHTML(detail.confidence)} INTEGRITY</div>
          </section>
          ${renderMobileDetailBriefEntry(detail,selected)}
          ${renderMobileDetailSiteIndex(detail,selected)}
          <aside class="pc-map-sidebar pc-map-detail-intel ${intelPanelClass()}">${renderIntelPanel('detail',selected?.label||detail.label,renderDetailIntel(detail,selected))}</aside>
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
      const synchronySignals=synchronyEvents.flatMap(event=>event.points
        .filter(point=>region.id==='world'||point.region===region.id)
        .map(point=>({event,point})));
      const selectedSynchrony=synchronyPointById(state.synchronyPoint);

      return `
        <div class="pc-map-region-tabs" role="tablist" aria-label="관제 권역">
          ${data.regions.map(item=>`<button type="button" role="tab" aria-selected="${item.id===region.id}" tabindex="${item.id===region.id?'0':'-1'}" class="${item.id===region.id?'is-active':''}" data-map-region="${escapeHTML(item.id)}"><small>${escapeHTML(item.code)}</small>${escapeHTML(item.label)}</button>`).join('')}
        </div>
        <div class="pc-map-mobile-layerbar" role="group" aria-label="지도 레이어 빠른 제어">
          <span>LAYERS</span>
          <button type="button" class="${state.layers.confirmed?'is-active':''}" data-map-layer="confirmed" aria-pressed="${state.layers.confirmed}">확인</button>
          <button type="button" class="${state.layers.estimated?'is-active':''}" data-map-layer="estimated" aria-pressed="${state.layers.estimated}">추정</button>
          <button type="button" class="${state.layers.zones?'is-active':''}" data-map-layer="zones" aria-pressed="${state.layers.zones}">권역</button>
          <button type="button" class="${state.layers.routes?'is-active':''}" data-map-layer="routes" aria-pressed="${state.layers.routes}">경로</button>
          <button type="button" class="pc-map-mobile-synchrony${state.layers.synchrony?' is-active':''}" data-map-layer="synchrony" aria-pressed="${state.layers.synchrony}">2042 신호 <b>10</b></button>
        </div>
        <div class="pc-map-layout">
          <aside class="pc-map-sidebar pc-map-layers">
            <div class="pc-map-panel-title">LAYER CONTROL</div>
            <button class="pc-map-layer-row${state.layers.confirmed?' is-active':''}" type="button" data-map-layer="confirmed" aria-pressed="${state.layers.confirmed}"><i class="is-confirmed"></i><span>확인된 시설·사건</span><b>${state.layers.confirmed?'ON':'OFF'}</b></button>
            <button class="pc-map-layer-row${state.layers.estimated?' is-active':''}" type="button" data-map-layer="estimated" aria-pressed="${state.layers.estimated}"><i class="is-estimated"></i><span>추정·증언 좌표</span><b>${state.layers.estimated?'ON':'OFF'}</b></button>
            <button class="pc-map-layer-row${state.layers.zones?' is-active':''}" type="button" data-map-layer="zones" aria-pressed="${state.layers.zones}"><i class="is-hostile"></i><span>오염·무응답 권역</span><b>${state.layers.zones?'ON':'OFF'}</b></button>
            <button class="pc-map-layer-row${state.layers.routes?' is-active':''}" type="button" data-map-layer="routes" aria-pressed="${state.layers.routes}"><i class="is-route"></i><span>순례·동원 경로</span><b>${state.layers.routes?'ON':'OFF'}</b></button>
            <button class="pc-map-layer-row pc-map-layer-row--synchrony${state.layers.synchrony?' is-active':''}" type="button" data-map-layer="synchrony" aria-pressed="${state.layers.synchrony}"><i class="is-synchrony"></i><span>2042 동시 무응답</span><b>${state.layers.synchrony?'10':'OFF'}</b></button>
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
              ${state.layers.synchrony?`<g class="pc-map-synchrony" data-synchrony-event="three-night-silence">${synchronySignals.map(item=>synchronyPointSymbol(item.event,item.point,region)).join('')}</g>`:''}
            </svg>
            <div class="pc-map-scan" aria-hidden="true"></div>
            <div class="pc-map-coordinates">LAT/LON RECONSTRUCTED · NAVIGATION PROHIBITED</div>
          </section>
          <aside class="pc-map-sidebar pc-map-intel ${intelPanelClass()}">${renderIntelPanel('region',selectedSynchrony?.point?.label||selectedMarker?.title||region.label,renderRegionIntel(region,selectedMarker,selectedSynchrony))}</aside>
        </div>`;
    }

    function operationTerrain(operation){
      if(operation.id==='op-deadzone-recovery'){
        return `
          <path class="pc-op-terrain pc-op-terrain--dead" d="M0 28 C153 72 286 17 426 73 S704 28 1000 86 L1000 540 0 540 Z"></path>
          <path class="pc-op-contested-line" d="M0 108H1000 M0 216H1000 M0 324H1000 M0 432H1000"></path>
          <path class="pc-op-river" d="M12 74 C174 139 281 169 421 238 S718 328 1000 405"></path>
          <circle class="pc-op-blood" cx="668" cy="326" r="48"></circle>`;
      }
      if(operation.id==='op-deadzone-return'){
        return `
          <path class="pc-op-terrain pc-op-terrain--dead" d="M0 72 C174 117 294 35 447 111 S745 56 1000 119 L1000 540 0 540 Z"></path>
          <path class="pc-op-contested-line" d="M126 0V540 M304 0V540 M482 0V540 M660 0V540 M838 0V540"></path>
          <path class="pc-op-river" d="M0 64 C173 133 287 189 421 242 S707 353 1000 438"></path>
          <circle class="pc-op-blood" cx="704" cy="348" r="54"></circle>`;
      }
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
      const canonBoundary=persistent?operationStore.canonBoundary:null;
      const recovered=persistent?.visited?.length||0;
      const scenarioId=operationScenarioId(operation);const scenarioState=scenarioId?pilgrimageStore?.get?.(scenarioId):null;
      const scenarioEnding=scenarioId?pilgrimageOutcome(scenarioId)?.endingData:null;
      const stepStates=decision?.stepStates||(scenarioState?operation.steps.map((_item,index)=>scenarioState.choices[index]?.ruleOutcome||(index===state.step&&scenarioState.status==='active'?'active':'locked')):operation.steps.map((_item,index)=>index<state.step?'complete':index===state.step?'active':'available'));
      const siteStates=decision?.siteStates||(scenarioState?operation.steps.map((_item,index)=>traceTone(scenarioState.choices[index]?.ruleOutcome)):[]);
      const operationIncident=incidentById(operation.incident);
      const targetRegion=operationIncident?.region||(operation.id==='op-unlit-fortress'?'southamerica':operation.id==='op-deadzone-recovery'?'northamerica':'europe');
      const objectives=(operation.objectives||[]).map(item=>`<li>${escapeHTML(item)}</li>`).join('');

      return `
        <div class="pc-map-operation-tabs" role="tablist" aria-label="작전 기록">
          ${data.operations.map(item=>`<button type="button" role="tab" aria-selected="${item.id===operation.id}" tabindex="${item.id===operation.id?'0':'-1'}" class="${item.id===operation.id?'is-active':''}" data-map-operation="${escapeHTML(item.id)}"><small>${escapeHTML(item.code)}</small>${escapeHTML(item.label)}</button>`).join('')}
        </div>
        <div class="pc-map-operation-grid${decision?` has-verdict is-${escapeHTML(decision.tone)}`:scenarioEnding?` has-verdict is-${escapeHTML(scenarioEnding.tone)}`:''}${operation.id==='op-deadzone-recovery'&&!recoveryUnlocked()?' is-scenario-locked':''}"${persistent?` data-operation-persistence="active" data-operation-verdict="${escapeHTML(persistent.verdict||'pending')}"`:''}>
          <section class="pc-map-stage pc-map-operation-stage" aria-label="${escapeHTML(operation.label)} 작전 경로">
            <div class="pc-map-stage-head"><span>${escapeHTML(operation.code)}</span><b>${persistent?`LOCAL COPY · INTEL ${recovered}/3 · `:''}TRACE ${state.step+1}/${operation.steps.length}</b></div>
            <svg class="pc-map-svg" viewBox="0 0 1000 540" role="img" aria-labelledby="pcOpTitle pcOpDesc" preserveAspectRatio="xMidYMid meet">
              <title id="pcOpTitle">${escapeHTML(operation.label)} 작전 경로</title>
              <desc id="pcOpDesc">시간 단계에 따라 복구된 이동 경로와 인원 신호를 표시한 작전 지도</desc>
              <defs>
                <pattern id="pc-op-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" class="pc-map-grid-line"></path></pattern>
                <filter id="pc-op-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" result="blur"></feGaussianBlur><feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter>
              </defs>
              <rect class="pc-map-grid" width="1000" height="540"></rect>
              ${operationTerrain(operation)}
              <g>${operation.sites.map((site,index)=>siteSymbol(site,index,siteStates)).join('')}</g>
              ${step.alternate?`<polyline class="pc-op-route pc-op-route--alternate" points="${polyline(step.alternate)}"></polyline>`:''}
              <polyline class="pc-op-route" points="${polyline(step.route)}"></polyline>
              ${decision?.route?`<polyline class="pc-op-route pc-op-route--verdict pc-op-route--verdict-${escapeHTML(decision.id)}" points="${polyline(decision.route)}"></polyline>`:''}
              <g>${step.route.map((point,index)=>`<circle class="pc-op-waypoint${index===step.route.length-1?' is-current':''}" cx="${point[0]}" cy="${point[1]}" r="${index===step.route.length-1?7:4}"></circle>`).join('')}</g>
              <g>${step.units.map(unitSymbol).join('')}</g>
            </svg>
            <div class="pc-map-scan" aria-hidden="true"></div>
            <div class="pc-map-coordinates">ROUTE RECONSTRUCTION · ${escapeHTML(step.time)} · ${escapeHTML(decision?.status||scenarioEnding?.status||'SIGNAL NOT VERIFIED')}${decision?' · CENTRAL RECORD UNCHANGED':''}</div>
          </section>
          <aside class="pc-map-sidebar pc-map-operation-intel ${intelPanelClass()}">
            ${renderIntelPanel('operation',`${step.time} · ${step.title}`,`
            <div class="pc-map-intel-kicker">${escapeHTML(operation.region)} / ${escapeHTML(operation.code)}</div>
            <h3><time>${escapeHTML(step.time)}</time>${escapeHTML(step.title)}</h3>
            <p>${escapeHTML(step.note)}</p>
            <div class="pc-op-status"><span>${persistent?'정보 복구':'경로 복구'}</span><b>${persistent?`${recovered}/3 · ${Math.round(((state.step+1)/operation.steps.length)*100)}%`:Math.round(((state.step+1)/operation.steps.length)*100)+'%'}</b></div>
            ${decision?`<div class="pc-op-verdict"><small>${escapeHTML(decision.code)} / LOCAL COMMAND VERDICT</small><b>${escapeHTML(decision.title)}</b><p>${escapeHTML(decision.summary)}</p></div>`:''}
            ${decision&&canonBoundary?`<div class="pc-op-canon-boundary"><small>${escapeHTML(canonBoundary.status)}</small><b>이 지도는 작전 사본이다</b><p>${escapeHTML(canonBoundary.scope)}</p><span>${escapeHTML(canonBoundary.lineageGuard)}</span></div>`:''}
            ${!decision&&scenarioEnding?`<div class="pc-op-verdict"><small>${escapeHTML(scenarioEnding.code)}</small><b>${escapeHTML(scenarioEnding.title)}</b><p>${escapeHTML(scenarioEnding.summary)}</p></div>`:''}
            <div class="pc-map-warning">${escapeHTML(decision?.consequence||scenarioEnding?.consequence||operation.summary)}</div>
            ${operation.classification?`<dl class="pc-map-facts pc-op-classification"><div><dt>분류</dt><dd>${escapeHTML(operation.classification)}</dd></div><div><dt>${decision?'현장 판정':'작전 상태'}</dt><dd>${escapeHTML(decision?.status||scenarioEnding?.status||operation.status)}</dd></div>${decision?`<div><dt>중앙 기록 반영</dt><dd>없음 / 승인 대기</dd></div>`:''}</dl>`:''}
            ${(decision?.directive||operation.directive)?`<div class="pc-op-directive"><b>COMMAND DIRECTIVE</b><p>${escapeHTML(decision?.directive||operation.directive)}</p></div>`:''}
            ${objectives?`<div class="pc-op-objectives"><b>OPERATION OBJECTIVES</b><ol>${objectives}</ol></div>`:''}
            ${operation.id==='op-unlit-fortress'?`<button class="pc-map-region-return pc-map-pilgrimage-entry" type="button" data-map-open-pilgrimage="unlit-fortress">${pilgrimageOutcome('unlit-fortress')?.status==='idle'?'현장 순례 개시':pilgrimageOutcome('unlit-fortress')?.status==='complete'?'순례 결과 열기':'저장된 순례 재개'}</button>`:''}
            ${operation.id==='op-deadzone-return'?`<button class="pc-map-region-return pc-map-pilgrimage-entry" type="button" data-map-open-pilgrimage="deadzone-return">${pilgrimageOutcome('deadzone-return')?.status==='idle'?'귀환 심사 프로토콜 개시':pilgrimageOutcome('deadzone-return')?.status==='complete'?'귀환 판정 결과 열기':'저장된 검문 재개'}</button>`:''}
            ${operation.id==='op-deadzone-recovery'?scenarioButton('deadzone-recovery',{idle:'전진 회수 작전 개시',active:'저장된 전진 회수 작전 재개',complete:'전진 회수 판정 결과 열기'}):''}
            ${persistent?`<button class="pc-map-region-return" type="button" data-map-open-record="Operation_Broken_Crown">작전 판단 기록 열기</button>`:''}
            ${operationIncident?.history?`<button class="pc-map-region-return" type="button" data-map-open-history="${escapeHTML(operationIncident.history)}">세계 기록에서 연결 사건 보기</button>`:''}
            <button class="pc-map-region-return" type="button" data-map-return-region="${targetRegion}">해당 권역에서 보기</button>`)}
          </aside>
        </div>
        <div class="pc-map-timeline" aria-label="작전 시간 단계">
          ${operation.steps.map((item,index)=>{
            const phase=stepStates[index]||'available';
            return `<button type="button" class="${index===state.step?'is-active ':''}is-${escapeHTML(phase)}" aria-current="${index===state.step?'step':'false'}" data-map-step="${index}"${phase==='locked'?' disabled':''}><small>${escapeHTML(item.time)}</small><span>${escapeHTML(item.title)}</span><em>${escapeHTML(phase.toUpperCase())}</em></button>`;
          }).join('')}
        </div>`;
    }

    function renderTheaterIndex(){
      const recent=recentMapLocations();
      return `<section class="pc-map-theater-index" aria-labelledby="pcMapTheaterTitle">
        <div class="pc-map-theater-intro">
          <div><span>SELECT OPERATIONAL THEATER</span><h3 id="pcMapTheaterTitle">먼저, 사건이 벌어진 곳을 선택하십시오.</h3></div>
          <p>지도는 세계를 설명하지 않는다. 남아 있는 신호와 돌아오지 못한 사람들의 경로만 표시한다.</p>
        </div>
        <div class="pc-map-theater-grid">
          ${theaters.map(theater=>`<button type="button" class="pc-map-theater-card pc-map-theater-card--${escapeHTML(theater.tone)}" data-map-theater="${escapeHTML(theater.id)}" aria-label="${escapeHTML(theater.title)} 관제 자료 열기">
            <span class="pc-map-theater-number">${escapeHTML(theater.number)}</span>
            <span class="pc-map-theater-copy">
              <small>${escapeHTML(theater.eyebrow)}</small>
              <strong>${escapeHTML(theater.title)}</strong>
              <em>${escapeHTML(theater.status)}</em>
              <p>${escapeHTML(theater.summary)}</p>
              <b>${escapeHTML(theater.note)}</b>
            </span>
            <span class="pc-map-theater-confidence">${escapeHTML(theater.confidence)}</span>
            <i aria-hidden="true"></i>
          </button>`).join('')}
        </div>
        <div class="pc-map-theater-utilities">
          <button type="button" data-map-theater="world"><small>00</small><span>전체 세계 지도</span><b>확인된 권역 신호를 한 화면에서 본다</b></button>
          <button type="button" data-map-open-index><small>29</small><span>신호 색인</span><b>사건·장소·작전·동기화 기록을 검색한다</b></button>
        </div>
        ${recent.length?`<section class="pc-map-recent" aria-labelledby="pcMapRecentTitle">
          <header><div><span>RECENT COORDINATES</span><h4 id="pcMapRecentTitle">최근 열람한 좌표</h4></div><p>이 세션에서 확인한 마지막 ${recent.length}개 지점</p></header>
          <div class="pc-map-recent-list">
            ${recent.map((item,index)=>`<button type="button" data-map-recent="${index}" aria-label="${escapeHTML(item.title)} 다시 열기"><small>${String(index+1).padStart(2,'0')}</small><span><b>${escapeHTML(item.title)}</b><em>${escapeHTML(item.eyebrow)} · ${escapeHTML(item.meta)}</em></span><i>REOPEN →</i></button>`).join('')}
          </div>
        </section>`:''}
      </section>`;
    }

    function renderWorkspace(){
      return `<div class="pc-map-workspace-head">
          <button type="button" data-map-landing><i aria-hidden="true"></i><span>작전권 선택으로</span></button>
          <p>${state.mode==='operation'?'선택한 작전의 시간대와 현장 경로':state.mode==='detail'?'선택한 권역의 세부 경로와 관측점':'확인 좌표와 관측 신호를 겹쳐 표시'}</p>
          <button type="button" class="pc-map-copy-link" data-map-copy-link aria-label="현재 지도 좌표 링크 복사"><small>LINK</small><span>좌표 링크 복사</span></button>
        </div>
        <div class="pc-map-mode-switch" role="tablist" aria-label="지도 모드">
          <button type="button" role="tab" aria-selected="${state.mode==='region'}" tabindex="${state.mode==='region'?'0':'-1'}" class="${state.mode==='region'?'is-active':''}" data-map-mode="region"><small>01</small>지역 상황도</button>
          <button type="button" role="tab" aria-selected="${state.mode==='detail'}" tabindex="${state.mode==='detail'?'0':'-1'}" class="${state.mode==='detail'?'is-active':''}" data-map-mode="detail"><small>02</small>세부 권역</button>
          <button type="button" role="tab" aria-selected="${state.mode==='operation'}" tabindex="${state.mode==='operation'?'0':'-1'}" class="${state.mode==='operation'?'is-active':''}" data-map-mode="operation"><small>03</small>작전지도</button>
        </div>
        ${renderSignalIndex()}
        <div class="pc-map-view">${state.mode==='region'?renderRegion():state.mode==='detail'?renderDetail():renderOperation()}</div>`;
    }

    function render({historyMode='none'}={}){
      if(state.mode!=='landing') rememberMapLocation();
      mount.innerHTML=`
        <div class="pc-map-room">
          <header class="pc-map-room-head">
            <div><span>U.A.C CARTOGRAPHIC INTELLIGENCE</span><h2>권역 관제도</h2><p>${state.mode==='landing'?'네 개 전구에서 회수된 불완전한 관측 기록.':'확인 좌표, 현장 진술, 손상된 작전 신호를 겹쳐 표시한다.'}</p></div>
            <div class="pc-map-live"><i></i><span>PARTIAL UPLINK</span><b>${escapeHTML(data.version)}</b></div>
          </header>
          ${state.mode==='landing'?renderTheaterIndex():renderWorkspace()}
        </div>`;
      root.ProjectCurseMedia?.enhance?.(mount,{mode:'thumbnail'});
      saveMapSession();
      writeMapLocation(historyMode);
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

    function fallbackCopy(value){
      const field=document.createElement('textarea');
      field.value=value;field.setAttribute('readonly','');field.style.position='fixed';field.style.opacity='0';
      document.body.appendChild(field);field.select();
      let copied=false;
      try{copied=document.execCommand('copy');}catch(_error){}
      field.remove();return copied;
    }

    async function copyCurrentMapLink(control){
      writeMapLocation('replace');
      let copied=false;
      try{await navigator.clipboard.writeText(location.href);copied=true;}
      catch(_error){copied=fallbackCopy(location.href);}
      const label=control.querySelector('span');
      if(label) label.textContent=copied?'좌표 링크 복사됨':'링크 복사 실패';
      control.classList.toggle('is-copied',copied);
      control.setAttribute('aria-label',copied?'현재 지도 좌표 링크가 복사됨':'현재 지도 좌표 링크 복사 실패');
      root.ProjectCurseAudioControl?.play?.(copied?'menu.select':'menu.close');
      root.setTimeout(()=>{
        if(!control.isConnected) return;
        if(label) label.textContent='좌표 링크 복사';
        control.classList.remove('is-copied');control.setAttribute('aria-label','현재 지도 좌표 링크 복사');
      },1800);
    }

    function tabIdentity(tab){
      return ['mapMode','mapRegion','mapDetail','mapOperation'].map(key=>[key,tab.dataset[key]]).find(([,value])=>value!==undefined)||null;
    }

    function focusRenderedTab(identity){
      if(!identity) return;
      root.requestAnimationFrame(()=>{
        const [key,value]=identity;
        [...mount.querySelectorAll('[role="tab"]')].find(tab=>tab.dataset[key]===value)?.focus();
      });
    }

    mount.addEventListener('click',event=>{
      const control=event.target.closest('button,[data-map-marker],[data-map-synchrony-point],[data-map-detail-site]');
      if(!control) return;
      if(control.dataset.mapCopyLink!==undefined){copyCurrentMapLink(control);return;}
      if(control.dataset.mapRecent!==undefined){
        const path=recentLocations[Number(control.dataset.mapRecent)];
        if(path&&applyMapLocationPath(path,{historyMode:'push'})) root.ProjectCurseAudioControl?.play?.('map.signal');
        return;
      }
      if(control.dataset.mapTheater){
        const theater=theaters.find(item=>item.id===control.dataset.mapTheater);
        state.indexOpen=false;state.indexSelection=null;state.marker=null;state.synchronyPoint=null;state.intelCollapsed=true;
        if(control.dataset.mapTheater==='world'){state.mode='region';state.region='world';}
        else if(theater?.target.kind==='operation'){state.mode='operation';state.operation=theater.target.id;state.step=operationStep(operationById(state.operation));state.indexSelection=`operation:${state.operation}`;state.intelCollapsed=false;}
        else if(theater?.target.kind==='detail'){state.mode='detail';state.detail=theater.target.id;state.detailSite=null;state.intelCollapsed=true;}
        else if(theater?.target.kind==='region'){state.mode='region';state.region=theater.target.id;}
        else return;
        root.ProjectCurseAudioControl?.play?.('map.signal');render({historyMode:'push'});return;
      }
      if(control.dataset.mapLanding!==undefined){state.mode='landing';state.indexOpen=false;state.indexSelection=null;state.marker=null;state.synchronyPoint=null;state.intelCollapsed=true;root.ProjectCurseAudioControl?.play?.('menu.close');render({historyMode:'push'});return;}
      if(control.dataset.mapOpenIndex!==undefined){state.mode='region';state.region='world';state.indexOpen=true;state.indexSelection=null;render({historyMode:'push'});mount.querySelector('[data-map-index-search]')?.focus();root.ProjectCurseAudioControl?.play?.('menu.open');return;}
      if(control.dataset.mapIndexToggle!==undefined){
        state.indexOpen=!state.indexOpen;render();
        mount.querySelector(state.indexOpen?'[data-map-index-search]':'[data-map-index-toggle]')?.focus();
        root.ProjectCurseAudioControl?.play?.(state.indexOpen?'menu.open':'menu.close');return;
      }
      if(control.dataset.mapIndexClose!==undefined){
        state.indexOpen=false;render();mount.querySelector('[data-map-index-toggle]')?.focus();root.ProjectCurseAudioControl?.play?.('menu.close');return;
      }
      if(control.dataset.mapIndexClear!==undefined){
        state.indexQuery='';const input=mount.querySelector('[data-map-index-search]');if(input) input.value='';updateSignalIndex();input?.focus();return;
      }
      if(control.dataset.mapIndexFilter){state.indexFilter=control.dataset.mapIndexFilter;updateSignalIndex();root.ProjectCurseAudioControl?.play?.('archive.filter');return;}
      if(control.dataset.mapIndexItem){selectIndexItem(indexItemById(control.dataset.mapIndexItem));return;}
      if(control.dataset.mapIntelToggle!==undefined){state.intelCollapsed=!state.intelCollapsed;const panel=control.closest('.pc-map-intel-panel');panel?.classList.toggle('is-collapsed',state.intelCollapsed);control.setAttribute('aria-expanded',String(!state.intelCollapsed));control.setAttribute('aria-label',state.intelCollapsed?'지도 선택 정보 펼치기':'지도 선택 정보 접기');root.ProjectCurseAudioControl?.play?.(state.intelCollapsed?'menu.close':'menu.open');saveMapSession();return;}
      if(control.dataset.mapMode){state.mode=control.dataset.mapMode;state.indexSelection=state.mode==='operation'?`operation:${state.operation}`:null;state.intelCollapsed=true;root.ProjectCurseAudioControl?.play?.('map.signal');render({historyMode:'push'});return;}
      if(control.dataset.mapRegion){state.region=control.dataset.mapRegion;state.marker=null;state.synchronyPoint=null;state.indexSelection=null;state.intelCollapsed=true;root.ProjectCurseAudioControl?.play?.('map.signal');render({historyMode:'push'});return;}
      if(control.dataset.mapLayer){state.layers[control.dataset.mapLayer]=!state.layers[control.dataset.mapLayer];state.marker=null;if(control.dataset.mapLayer==='synchrony') state.synchronyPoint=null;state.indexSelection=state.synchronyPoint?`synchrony:${state.synchronyPoint}`:null;root.ProjectCurseAudioControl?.play?.('map.layer');render();return;}
      if(control.dataset.mapOpenHistory){root.ProjectCurseAudioControl?.play?.('incident.link');openHistory(control.dataset.mapOpenHistory);return;}
      if(control.dataset.mapOpenFaction){root.ProjectCurseAudioControl?.play?.('incident.link');openFaction(control.dataset.mapOpenFaction);return;}
      if(control.dataset.mapOpenRecord){root.ProjectCurseAudioControl?.play?.('incident.link');openArchive(control.dataset.mapOpenRecord);return;}
      if(control.dataset.mapOpenPilgrimage){root.ProjectCurseAudioControl?.play?.('incident.link');root.ProjectCursePilgrimageRuntime?.open?.(control.dataset.mapOpenPilgrimage);return;}
      if(control.dataset.mapMarker){
        const marker=markerById(control.dataset.mapMarker);
        state.marker=state.marker===control.dataset.mapMarker?null:control.dataset.mapMarker;
        state.indexSelection=state.marker?`marker:${state.marker}`:null;
        state.synchronyPoint=null;
        state.intelCollapsed=!state.marker;
        if(marker?.overview&&state.marker===marker.id) state.region='world';
        root.ProjectCurseAudioControl?.play?.('map.signal');
        render({historyMode:'push'});return;
      }
      if(control.dataset.mapSynchronyPoint){
        const signal=synchronyPointById(control.dataset.mapSynchronyPoint);
        if(!signal) return;
        state.marker=null;
        state.synchronyPoint=state.synchronyPoint===signal.point.id?null:signal.point.id;
        state.indexSelection=state.synchronyPoint?`synchrony:${state.synchronyPoint}`:null;
        state.intelCollapsed=!state.synchronyPoint;
        root.ProjectCurseAudioControl?.play?.('map.signal');
        render({historyMode:'push'});return;
      }
      if(control.dataset.mapOpenDetail){state.mode='detail';state.detail=control.dataset.mapOpenDetail;state.detailSite=null;state.indexSelection=null;state.intelCollapsed=true;root.ProjectCurseAudioControl?.play?.('incident.link');render({historyMode:'push'});return;}
      if(control.dataset.mapDetail){state.mode='detail';state.detail=control.dataset.mapDetail;state.detailSite=null;state.indexSelection=null;state.intelCollapsed=true;root.ProjectCurseAudioControl?.play?.('map.signal');render({historyMode:'push'});return;}
      if(control.dataset.mapDetailLayer){const layer=control.dataset.mapDetailLayer;state.detailLayers[layer]=!state.detailLayers[layer];root.ProjectCurseAudioControl?.play?.('map.layer');render();return;}
      if(control.dataset.mapDetailBrief){state.detailSite=control.dataset.mapDetailBrief;state.intelCollapsed=false;root.ProjectCurseAudioControl?.play?.('map.brief');render({historyMode:'push'});focusDetailIntelAfterRender();return;}
      if(control.dataset.mapRouteStep){state.detailSite=control.dataset.mapRouteStep;state.intelCollapsed=false;root.ProjectCurseAudioControl?.play?.(detailCueForSite(state.detailSite,'operation.step'));render({historyMode:'push'});return;}
      if(control.dataset.mapDetailSite){const fromList=control.dataset.mapDetailSource==='list';state.detailSite=fromList?control.dataset.mapDetailSite:(state.detailSite===control.dataset.mapDetailSite?null:control.dataset.mapDetailSite);state.intelCollapsed=!state.detailSite;root.ProjectCurseAudioControl?.play?.(state.detailSite?detailCueForSite(state.detailSite):'map.signal');render({historyMode:'push'});if(fromList&&state.detailSite) focusDetailIntelAfterRender();return;}
      if(control.dataset.mapDetailClear){state.detailSite=null;state.intelCollapsed=true;render({historyMode:'push'});return;}
      if(control.dataset.mapEnterRegion){state.region=control.dataset.mapEnterRegion;state.marker=null;state.synchronyPoint=null;state.indexSelection=null;state.intelCollapsed=true;render({historyMode:'push'});return;}
      if(control.dataset.mapOpenOperation){state.mode='operation';state.operation=control.dataset.mapOpenOperation;state.step=operationStep(operationById(state.operation));state.indexSelection=`operation:${state.operation}`;state.intelCollapsed=false;root.ProjectCurseAudioControl?.play?.('incident.link');render({historyMode:'push'});return;}
      if(control.dataset.mapOperation){state.operation=control.dataset.mapOperation;state.step=operationStep(operationById(state.operation));state.indexSelection=`operation:${state.operation}`;state.intelCollapsed=true;root.ProjectCurseAudioControl?.play?.('map.signal');render({historyMode:'push'});return;}
      if(control.dataset.mapStep!==undefined){
        state.step=Number(control.dataset.mapStep)||0;
        state.intelCollapsed=false;
        root.ProjectCurseAudioControl?.play?.('operation.step');
        if(state.operation===operationStore?.operationId) operationStore.setMapStep(state.step);
        else render();
        return;
      }
      if(control.dataset.mapReturnRegion){state.mode='region';state.region=control.dataset.mapReturnRegion;state.marker=null;state.synchronyPoint=null;state.indexSelection=null;state.intelCollapsed=true;render({historyMode:'push'});}
    });

    mount.addEventListener('input',event=>{
      if(!event.target.matches('[data-map-index-search]')) return;
      state.indexQuery=event.target.value.slice(0,80);
      updateSignalIndex();
    });

    document.addEventListener('keydown',event=>{
      if(state.indexOpen&&event.key==='Escape'){
        event.preventDefault();state.indexOpen=false;render();mount.querySelector('[data-map-index-toggle]')?.focus();return;
      }
      if(state.indexOpen&&isMobileIndex()&&event.key==='Tab'){
        const panel=mount.querySelector('.pc-map-signal-index');
        const focusable=[...panel.querySelectorAll('button:not([disabled]),input:not([disabled])')].filter(node=>node.offsetParent!==null);
        if(focusable.length){const first=focusable[0];const last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();return;}if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();return;}}
      }
    });

    mount.addEventListener('keydown',event=>{
      const tab=event.target.closest('[role="tab"]');
      const tablist=tab?.closest('[role="tablist"]');
      const tabKeys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'];
      if(tab&&tablist&&tabKeys.includes(event.key)){
        const tabs=[...tablist.querySelectorAll('[role="tab"]')].filter(item=>!item.disabled&&item.offsetParent!==null);
        const index=tabs.indexOf(tab);
        if(index>=0&&tabs.length){
          event.preventDefault();
          const nextIndex=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'||event.key==='ArrowDown'?1:-1)+tabs.length)%tabs.length;
          const next=tabs[nextIndex];const identity=tabIdentity(next);
          next.click();focusRenderedTab(identity);return;
        }
      }
      const marker=event.target.closest('[data-map-marker],[data-map-synchrony-point],[data-map-detail-site]');
      if(!marker||(event.key!=='Enter'&&event.key!==' ')) return;
      event.preventDefault();
      marker.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
    });

    document.addEventListener('projectcurse:operation-state-change',()=>{
      if(state.mode==='operation'&&state.operation===operationStore?.operationId) state.step=operationStore.get().mapStep;
      else if(state.mode!=='detail') return;
      render();
    });
    document.addEventListener('projectcurse:pilgrimage-state-change',event=>{if(state.mode==='operation'&&operationScenarioId(operationById(state.operation))===event.detail?.scenarioId) state.step=operationStep(operationById(state.operation));render();});
    document.addEventListener('projectcurse:verdict-archive-change',()=>render());

    render();
    root.ProjectCurseMapRoomRuntime=Object.freeze({
      openLocation(path,options={}){return applyMapLocationPath(path,{shouldRender:true,focus:Boolean(options.focus),historyMode:options.historyMode||'none'});},
      showRegion(id){if(!exactRegionById(id)) return false;state.indexOpen=false;state.indexSelection=null;state.mode='region';state.region=id;state.marker=null;state.synchronyPoint=null;state.intelCollapsed=true;render({historyMode:'replace'});return true;},
      showDetail(id,siteId){const detail=exactDetailById(id);if(!detail) return false;state.indexOpen=false;state.indexSelection=null;state.mode='detail';state.detail=id;state.detailSite=detail.sites.some(site=>site.id===siteId)?siteId:null;state.intelCollapsed=!state.detailSite;render({historyMode:'replace'});return true;},
      showOperation(id){if(!exactOperationById(id)) return false;state.indexOpen=false;state.indexSelection=`operation:${id}`;state.mode='operation';state.operation=id;state.step=operationStep(operationById(id));state.intelCollapsed=false;render({historyMode:'replace'});return true;},
      showIncident(id){const marker=data.markers.find(item=>item.incident===id);if(!marker) return false;state.indexOpen=false;state.indexSelection=`marker:${marker.id}`;state.mode='region';state.region=marker.region;state.marker=marker.id;state.synchronyPoint=null;state.intelCollapsed=false;render({historyMode:'replace'});return true;},
      showSynchrony(eventId='three-night-silence',pointId){const event=synchronyEvents.find(item=>item.id===eventId);if(!event) return false;const point=event.points.find(item=>item.id===pointId)||null;state.indexOpen=false;state.indexSelection=point?`synchrony:${point.id}`:null;state.mode='region';state.region=point?.region||'world';state.marker=null;state.synchronyPoint=point?.id||null;state.layers.synchrony=true;state.intelCollapsed=!point;render({historyMode:'replace'});return true;},
      openSignalIndex(query=''){if(state.mode==='landing'){state.mode='region';state.region='world';}state.indexQuery=String(query).slice(0,80);state.indexOpen=true;render({historyMode:'replace'});return true;},
      getShareUrl:()=>new URL(mapLocationHash(),location.href).href,
      getRecentLocations:()=>recentLocations.map(path=>[...path]),
      getState:()=>({...state,layers:{...state.layers},detailLayers:{...state.detailLayers}})
    });
  });
})(window);
