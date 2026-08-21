// Project Curse 5.49.0 — operator-only media provenance and release-clearance console.
(function(root){
  'use strict';

  const data=root.ProjectCurseMediaProvenance;
  if(!data?.assets?.length) return;
  let operatorAccess=false;
  try{operatorAccess=new URLSearchParams(location.search).get('operator')==='media';}catch(_error){}
  if(!operatorAccess){
    root.ProjectCurseMediaClearanceRuntime=Object.freeze({available:false,open:()=>Promise.resolve(null),getState:()=>Object.freeze({}),getVisibleCount:()=>0});
    return;
  }

  const ready=callback=>document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',callback,{once:true})
    : callback();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
  const sessionKey='project_curse_media_clearance_v1';
  const releaseLabels={
    CLEARED:['PROJECT MANAGED','프로젝트 관리'],
    PROJECT_GENERATED:['GENERATED RECORD','생성 기록 보존'],
    SOURCE_REVIEW:['SOURCE REVIEW','공개 범위 확인'],
    LICENSE_REVIEW:['LICENSE REVIEW','출처·허가 확인']
  };
  const provenanceLabels={
    INTERFACE:'INTERFACE MASTER',RECONSTRUCTED:'RECONSTRUCTED',DELIVERY_DERIVATIVE:'DELIVERY DERIVATIVE',
    ORIGINAL_SOURCE:'ORIGINAL SOURCE',UNVERIFIED:'UNVERIFIED',UNVERIFIED_LEGACY:'LEGACY COPY'
  };
  const kindLabels={image:'IMAGE',audio:'AUDIO',video:'VIDEO'};
  const defaultState={scope:'priority',release:'all',kind:'all',query:'',selected:data.priorityQueue?.[0]?.path||data.assets[0].path};
  let state=loadState();

  function loadState(){
    try{
      const stored=JSON.parse(sessionStorage.getItem(sessionKey)||'{}');
      return Object.assign({},defaultState,stored&&typeof stored==='object'?stored:{});
    }catch(_error){return {...defaultState};}
  }

  function saveState(){
    try{sessionStorage.setItem(sessionKey,JSON.stringify(state));}catch(_error){}
  }

  function formatBytes(bytes){
    const value=Number(bytes)||0;
    if(value>=1024*1024) return `${(value/(1024*1024)).toFixed(value>=10*1024*1024?1:2)} MB`;
    if(value>=1024) return `${(value/1024).toFixed(value>=100*1024?0:1)} KB`;
    return `${value} B`;
  }

  function basename(path){return String(path||'').split('/').at(-1)||'';}

  function assetFor(path){return data.assets.find(asset=>asset.path===path)||data.priorityQueue?.find(asset=>asset.path===path)||null;}

  function rankedAsset(item){
    const base=assetFor(item.path)||item;
    const queued=data.priorityQueue?.find(candidate=>candidate.path===item.path);
    return Object.assign({},base,queued||{});
  }

  function sourceItems(){
    if(state.scope==='priority') return (data.priorityQueue||[]).map(rankedAsset);
    if(state.scope==='reference') return [];
    return data.assets.map(rankedAsset);
  }

  function searchText(item){
    return [item.path,item.kind,item.release,item.provenance,item.source,item.handling,item.priorityReason,item.derivedFrom,...(item.usedBy||[])].join(' ').toLocaleLowerCase('ko');
  }

  function visibleItems(){
    const query=state.query.trim().toLocaleLowerCase('ko');
    return sourceItems().filter(item=>{
      if(state.kind!=='all'&&item.kind!==state.kind) return false;
      if(state.release==='review'&&!['LICENSE_REVIEW','SOURCE_REVIEW'].includes(item.release)) return false;
      if(state.release==='managed'&&['LICENSE_REVIEW','SOURCE_REVIEW'].includes(item.release)) return false;
      if(query&&!searchText(item).includes(query)) return false;
      return true;
    });
  }

  function metric(label,value,unit,tone=''){
    return `<div${tone?` data-tone="${tone}"`:''}><dt>${esc(label)}</dt><dd>${esc(value)}<small>${esc(unit)}</small></dd></div>`;
  }

  function shellMarkup(){
    const stats=data.stats;
    return `<section class="pc-media-clearance" data-media-clearance-owner="1" aria-label="미디어 출처와 공개 권리 감사">
      <header class="pc-media-clearance-hero">
        <div><span>RELEASE CONTROL / EVIDENCE BEFORE ASSUMPTION</span><h2>미디어 출처·권리 감사</h2><p>파일 존재, 원본 계보, 제작 출처와 공개 허가는 서로 다른 판정이다. 이 화면은 자동 삭제나 승인 없이 <strong>확인해야 할 근거와 실제 사용 위치</strong>만 정리한다.</p></div>
        <div class="pc-media-clearance-gate" data-gate="open"><i aria-hidden="true"></i><small>PUBLIC RELEASE</small><b>REVIEW OPEN</b><span>${stats.review} EVIDENCE GAPS</span></div>
      </header>
      <dl class="pc-media-clearance-metrics" aria-label="미디어 감사 요약">
        ${metric('등록 자산',stats.registered,'FILES')}
        ${metric('프로젝트 관리',stats.managed,'KNOWN','managed')}
        ${metric('출처·권리 검토',stats.review,'OPEN','review')}
        ${metric('최우선 확인',stats.priority,'QUEUE','priority')}
        ${metric('참고 자료 노출',stats.referenceExposure,'EXPOSED',stats.referenceExposure?'blocked':'managed')}
      </dl>
      <section class="pc-media-clearance-boundary" aria-label="감사 판정 경계">
        <div><i>01</i><span><b>FILE REGISTERED</b><small>해시·용량·사용처 확인</small></span><em>${stats.registered} / ${stats.registered}</em></div>
        <div><i>02</i><span><b>SOURCE IDENTIFIED</b><small>제작자·원출처·계보 증빙</small></span><em>${stats.review} OPEN</em></div>
        <div><i>03</i><span><b>RELEASE PERMISSION</b><small>라이선스·재배포 허가 문서</small></span><em>NOT ASSUMED</em></div>
      </section>
      <div class="pc-media-clearance-console">
        <div class="pc-media-clearance-toolbar">
          <div class="pc-media-clearance-scopes" role="group" aria-label="감사 범위">
            <button type="button" data-media-scope="priority">우선 대기열 <b>${stats.priority}</b></button>
            <button type="button" data-media-scope="all">전체 대장 <b>${stats.registered}</b></button>
            <button type="button" data-media-scope="reference">참고 전용 <b>${stats.referenceOnly}</b></button>
          </div>
          <label class="pc-media-clearance-search"><span>자산 검색</span><input type="search" data-media-search autocomplete="off" spellcheck="false" placeholder="파일명 · 사용 화면 · 출처 상태" value="${esc(state.query)}"></label>
        </div>
        <div class="pc-media-clearance-filters">
          <div role="group" aria-label="권리 상태 필터"><button type="button" data-media-release="all">전체</button><button type="button" data-media-release="review">검토 중</button><button type="button" data-media-release="managed">관리됨</button></div>
          <div role="group" aria-label="미디어 종류 필터"><button type="button" data-media-kind="all">ALL</button><button type="button" data-media-kind="image">IMAGE</button><button type="button" data-media-kind="audio">AUDIO</button><button type="button" data-media-kind="video">VIDEO</button></div>
          <span data-media-result aria-live="polite"></span>
        </div>
        <div class="pc-media-clearance-workspace">
          <div class="pc-media-clearance-list" role="list" data-media-list></div>
          <aside class="pc-media-clearance-detail" data-media-detail aria-live="polite"></aside>
        </div>
      </div>
      <footer class="pc-media-clearance-footer"><span>REFERENCE ZIP INGESTION</span><b>${stats.referenceExposure===0?'BLOCKED / 0 EXPOSED':'BOUNDARY BREACH'}</b><p>지옥.zip과 Pictures 계열은 분위기 참고용이다. 개별 파일 승인 전에는 공개 기록, 세력 문양, 증거 이미지로 편입하지 않는다.</p></footer>
    </section>`;
  }

  function listMarkup(items){
    if(state.scope==='reference'){
      return `<div class="pc-media-reference-list">${(data.referenceOnly||[]).map((item,index)=>`<article role="listitem"><i>${String(index+1).padStart(2,'0')}</i><div><code>${esc(item.name)}</code><p>${esc(item.role)}</p></div><b>${esc(item.rule)}</b></article>`).join('')}</div>`;
    }
    if(!items.length) return '<div class="pc-media-clearance-empty"><b>NO MATCHING ASSET</b><span>검색어나 필터를 변경하십시오.</span></div>';
    return items.map((item,index)=>{
      const release=releaseLabels[item.release]||[item.release,item.release];
      const rank=item.rank?String(item.rank).padStart(2,'0'):String(index+1).padStart(3,'0');
      return `<button type="button" role="listitem" class="pc-media-clearance-row${item.path===state.selected?' is-selected':''}" data-media-path="${esc(item.path)}" data-release="${esc(item.release)}" aria-current="${item.path===state.selected?'true':'false'}">
        <i>${rank}</i><span><code>${esc(basename(item.path))}</code><small>${esc(item.path.replace(/\/[^/]+$/,''))}</small></span><em>${esc(kindLabels[item.kind]||item.kind)}</em><b>${esc(release[0])}</b>
      </button>`;
    }).join('');
  }

  function detailMarkup(item){
    if(state.scope==='reference') return `<div class="pc-media-clearance-detail-empty"><small>REFERENCE BOUNDARY</small><b>공개 자산이 아닙니다</b><p>참고 ZIP은 대장에 이름과 차단 규칙만 남고, 내부 파일은 열람하거나 미리보기로 표시하지 않는다.</p></div>`;
    if(!item) return `<div class="pc-media-clearance-detail-empty"><small>NO ASSET SELECTED</small><b>자산을 선택하십시오</b><p>파일을 재생하거나 표시하지 않고 출처와 사용 위치만 확인한다.</p></div>`;
    const release=releaseLabels[item.release]||[item.release,item.release];
    const usage=(item.usedBy||[]).map(path=>`<li><code>${esc(path)}</code></li>`).join('')||'<li><code>NO REGISTERED USAGE</code></li>';
    const evidence=item.release==='CLEARED'?'코드 기반 인터페이스 마스터':item.release==='PROJECT_GENERATED'?'생성 기록과 브리프 보존':item.release==='SOURCE_REVIEW'?'원본 계보 확인 / 재배포 범위 미확인':'제작자·원출처·허가 증빙 미등록';
    return `<header><div><span>${esc(item.rank?`PRIORITY ${String(item.rank).padStart(2,'0')}`:'ASSET RECORD')}</span><h3>${esc(basename(item.path))}</h3></div><em data-release="${esc(item.release)}">${esc(release[0])}</em></header>
      <div class="pc-media-clearance-path"><small>REPOSITORY PATH</small><code>${esc(item.path)}</code></div>
      <dl class="pc-media-clearance-facts">
        <div><dt>종류</dt><dd>${esc(kindLabels[item.kind]||item.kind)}</dd></div><div><dt>출처 계열</dt><dd>${esc(provenanceLabels[item.provenance]||item.provenance)}</dd></div>
        <div><dt>파일 크기</dt><dd>${esc(formatBytes(item.bytes))}</dd></div><div><dt>보호 기록 연결</dt><dd>${item.protectedScope?'YES / 변경 주의':'NO'}</dd></div>
      </dl>
      <section><small>SOURCE CLAIM</small><p>${esc(item.source)}</p></section>
      <section><small>EVIDENCE STATE</small><p>${esc(evidence)}</p></section>
      <section data-priority-note><small>NEXT ACTION</small><p>${esc(item.priorityReason||item.handling)}</p></section>
      ${item.derivedFrom?`<section><small>DERIVED FROM</small><code>${esc(item.derivedFrom)}</code></section>`:''}
      <section><small>USED BY / ${(item.usedBy||[]).length}</small><ul>${usage}</ul></section>
      <footer><span>SHA-256</span><code>${esc(item.sha256||'NOT AVAILABLE')}</code><b>미디어 미리보기·자동 재생 없음</b></footer>`;
  }

  function syncControls(host){
    host.querySelectorAll('[data-media-scope]').forEach(button=>{
      const active=button.dataset.mediaScope===state.scope;
      button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',active?'true':'false');
    });
    host.querySelectorAll('[data-media-release]').forEach(button=>{
      const active=button.dataset.mediaRelease===state.release;
      button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',active?'true':'false');
    });
    host.querySelectorAll('[data-media-kind]').forEach(button=>{
      const active=button.dataset.mediaKind===state.kind;
      button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',active?'true':'false');
    });
  }

  function renderResults({focusSelected=false}={}){
    const host=document.querySelector('[data-media-clearance-owner]');
    if(!host) return;
    const items=visibleItems();
    if(state.scope!=='reference'&&!items.some(item=>item.path===state.selected)) state.selected=items[0]?.path||'';
    const list=host.querySelector('[data-media-list]');
    const detail=host.querySelector('[data-media-detail]');
    if(list) list.innerHTML=listMarkup(items);
    if(detail) detail.innerHTML=detailMarkup(assetFor(state.selected)&&rankedAsset(assetFor(state.selected)));
    const result=host.querySelector('[data-media-result]');
    if(result) result.textContent=state.scope==='reference'?`참고 전용 ${data.referenceOnly.length}건 · 공개 노출 ${data.stats.referenceExposure}건`:`${items.length} / ${sourceItems().length} FILES`;
    syncControls(host);saveState();
    if(focusSelected) host.querySelector(`[data-media-path="${root.CSS?.escape?CSS.escape(state.selected):state.selected}"]`)?.focus();
  }

  function setState(patch,options){state=Object.assign({},state,patch);renderResults(options);}

  function install(){
    const mount=document.getElementById('uacMediaClearance');
    if(!mount||mount.dataset.mediaClearanceReady==='1') return;
    mount.dataset.mediaClearanceReady='1';mount.innerHTML=shellMarkup();
    renderResults();
    mount.addEventListener('input',event=>{
      if(!event.target.matches('[data-media-search]')) return;
      state=Object.assign({},state,{query:event.target.value});renderResults();
    });
    mount.addEventListener('click',event=>{
      const scope=event.target.closest('[data-media-scope]');
      if(scope) return setState({scope:scope.dataset.mediaScope,release:'all',kind:'all'});
      const release=event.target.closest('[data-media-release]');
      if(release) return setState({release:release.dataset.mediaRelease});
      const kind=event.target.closest('[data-media-kind]');
      if(kind) return setState({kind:kind.dataset.mediaKind});
      const row=event.target.closest('[data-media-path]');
      if(row) return setState({selected:row.dataset.mediaPath});
    });
    mount.addEventListener('keydown',event=>{
      const row=event.target.closest('[data-media-path]');
      if(row&&(event.key==='ArrowDown'||event.key==='ArrowUp')){
        const rows=Array.from(mount.querySelectorAll('[data-media-path]'));
        const next=rows[(rows.indexOf(row)+(event.key==='ArrowDown'?1:-1)+rows.length)%rows.length];
        if(next){event.preventDefault();setState({selected:next.dataset.mediaPath},{focusSelected:true});}
      }
      if(event.key==='Escape'&&state.query){
        const search=mount.querySelector('[data-media-search]');
        state=Object.assign({},state,{query:''});if(search) search.value='';renderResults();search?.focus();
      }
    });
  }

  ready(install);
  document.addEventListener('projectcurse:screen-committed',event=>{
    if(event.detail?.target==='media-audit') install();
  });
  root.ProjectCurseMediaClearanceRuntime=Object.freeze({
    available:true,
    open(path=''){
      const item=assetFor(path);
      if(item) state=Object.assign({},state,{scope:'all',query:'',kind:'all',release:'all',selected:item.path});
      return root.ProjectCurseShell?.navigate?.('media-audit',{replace:false,historyMode:'push'}).then(()=>{renderResults({focusSelected:Boolean(item)});return item||null;});
    },
    getState:()=>Object.freeze({...state}),
    getVisibleCount:()=>visibleItems().length
  });
})(window);
