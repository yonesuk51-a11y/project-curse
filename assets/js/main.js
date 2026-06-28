document.addEventListener('DOMContentLoaded',()=>{
  function rootPrefix(){const p=location.pathname; if(p.includes('/docs/'))return '../../'; if(p.includes('/archive/'))return '../'; return '';}
  const prefix=rootPrefix();
  const loader=document.getElementById('loader');
  const app=document.getElementById('app');
  const audio={menu:new Audio(prefix+'assets/audio/menu_tick.mp3'),open:new Audio(prefix+'assets/audio/record_open.mp3'),page:new Audio(prefix+'assets/audio/page_turn.mp3'),boot:new Audio(prefix+'assets/audio/boot_legacy.mp3'),ambient:new Audio(prefix+'assets/audio/ambient_loop.mp3'),load:new Audio(prefix+'assets/audio/record_load.mp3')};
  // 5.8.1R-1b: server-role sound balance. Uses existing files only; no new ui_*.wav or router assets.
  audio.menu.volume=.13; audio.open.volume=.20; audio.page.volume=.16; audio.boot.volume=.20; audio.load.volume=.27; audio.ambient.volume=.045; audio.ambient.loop=true;
  let ambientStarted=false;
  if(localStorage.getItem('pc_audio_legacy2003_fixed')===null) localStorage.setItem('pc_audio_legacy2003_fixed','on');
  function isOn(){return localStorage.getItem('pc_audio_legacy2003_fixed')!=='off'}
  function play(a){if(!isOn()||!a)return; try{a.currentTime=0; a.play().catch(()=>{});}catch(e){}}
  const audioRoleGate=Object.create(null);
  function playRole(role){
    const file={menu:audio.menu,recordLoad:audio.load,recordOpen:audio.open,page:audio.page,boot:audio.boot}[role];
    if(!file) return;
    const now=performance.now();
    const gap={menu:115,recordLoad:520,recordOpen:180,page:120,boot:900}[role]||120;
    if(audioRoleGate[role] && now-audioRoleGate[role]<gap) return;
    audioRoleGate[role]=now;
    play(file);
  }
  window.ProjectCursePlayAudioRole=playRole;
  function startAmbient(){if(!isOn()||ambientStarted||!audio.ambient)return; ambientStarted=true; try{audio.ambient.play().catch(()=>{ambientStarted=false;});}catch(e){ambientStarted=false;}}
  document.addEventListener('pointerdown',startAmbient); document.addEventListener('keydown',startAmbient);
  function ensureRecordLoader(){let el=document.getElementById('recordLoading'); if(!el){el=document.createElement('div'); el.id='recordLoading'; el.className='record-loading'; el.innerHTML='<div class="box"><div class="title">DOCUMENT HASH CHECK</div><div class="logline">VERIFYING ARCHIVE SEAL...</div><div class="logline">CHECKING CLEARANCE LEVEL...</div><div class="logline">DECRYPTING RECORD BLOCK...</div><div class="logline">MOUNTING PAGE SECTORS...</div><div class="bars"><i></i></div><div class="loader-hint">READ PERMISSION: FIELD REVIEW</div></div>'; document.body.appendChild(el);} return el;}
  function configureRecordLoader(mode){
    const el=ensureRecordLoader();
    const fhc=mode==='fhc';
    const video=mode==='video';
    const bio=mode==='bio';
    el.classList.toggle('fhc-mode',fhc);
    el.classList.toggle('video-mode',video);
    el.classList.toggle('bio-mode',bio);
    el.innerHTML=fhc
      ? '<div class="box"><div class="title">F.H.C INTERNAL ACCESS</div><div class="logline">CLEARANCE MISMATCH DETECTED...</div><div class="logline">PARTIAL RECORD RELEASED...</div><div class="logline">TRACE LOG ENABLED...</div><div class="logline">BLACK TAG CROSS-CHECK...</div><div class="bars"><i></i></div><div class="loader-hint">RESTRICTED NODE: SINGLE ACCESS LAYER</div></div>'
      : video
        ? '<div class="box"><div class="title">DAMAGED VIDEO FEED</div><div class="logline">SIGNAL RECOVERY IN PROGRESS...</div><div class="logline">FRAME INDEX REBUILD...</div><div class="logline">AUDIO CHANNEL DEGRADED...</div><div class="logline">FIELD CAMERA CACHE MOUNTED...</div><div class="bars"><i></i></div><div class="loader-hint">VIDEO: PARTIAL / AUDIO: DEGRADED / FRAME LOSS DETECTED</div></div>'
        : bio
          ? '<div class="box"><div class="title">BIOLOGICAL TRACE SCAN</div><div class="logline">ENTITY CLASSIFICATION...</div><div class="logline">CONTAMINATION RESPONSE CHECK...</div><div class="logline">HOST REACTION INDEX...</div><div class="logline">THREAT TABLE MATCHING...</div><div class="bars"><i></i></div><div class="loader-hint">ENTITY SCAN: PARTIAL / THREAT TABLE ACTIVE</div></div>'
          : '<div class="box"><div class="title">DOCUMENT HASH CHECK</div><div class="logline">VERIFYING ARCHIVE SEAL...</div><div class="logline">CHECKING CLEARANCE LEVEL...</div><div class="logline">DECRYPTING RECORD BLOCK...</div><div class="logline">MOUNTING PAGE SECTORS...</div><div class="bars"><i></i></div><div class="loader-hint">READ PERMISSION: FIELD REVIEW</div></div>';
    return el;
  }
  function showRecordLoad(next){const el=ensureRecordLoader(); el.classList.remove('done'); void el.offsetWidth; el.classList.add('show'); startAmbient(); playRole('recordLoad'); const minTime=2050; setTimeout(()=>{ el.classList.add('done'); if(typeof next==='function') next(); else el.classList.remove('show'); },minTime);}
  function syncBtns(){document.querySelectorAll('#audioToggle').forEach(b=>b.textContent=isOn()?'효과음: 켜짐':'효과음: 꺼짐')}
  syncBtns();
  const bootLines=Array.from(document.querySelectorAll('#bootLines p'));
  const bootProgress=document.querySelector('[data-boot-progress]');
  const bootPercent=document.querySelector('[data-boot-percent]');
  const bootStatus=document.querySelector('[data-boot-status]');
  const bootIntegrity=document.querySelector('[data-boot-status-row="integrity"]');
  const bootSequence=document.querySelector('[data-boot-status-row="sequence"]');
  const bootDuration=4200;
  let bootDone=false;
  function setBootProgress(pct){
    const value=Math.max(0,Math.min(100,Math.round(pct)));
    if(bootProgress) bootProgress.style.width=value+'%';
    if(bootPercent) bootPercent.textContent=value+'%';
    bootLines.forEach((line,i)=>line.classList.toggle('show', value >= (i+1)*(100/Math.max(bootLines.length,1))-8));
    if(bootStatus){
      if(value<22) bootStatus.textContent='TERMINAL HANDSHAKE IN PROGRESS...';
      else if(value<44) bootStatus.textContent='ARCHIVE INDEX SYNCHRONIZING...';
      else if(value<66) bootStatus.textContent='STORAGE NODE MOUNTING...';
      else if(value<88) bootStatus.textContent='ACCESS VERIFICATION ACTIVE...';
      else if(value<100) bootStatus.textContent='RECORD INTEGRITY FINAL CHECK...';
      else bootStatus.textContent='SERVER HANDOFF INITIALIZED';
    }
  }
  function finishBoot(reason){
    if(bootDone) return;
    bootDone=true;
    setBootProgress(100);
    if(loader) loader.dataset.bootState=reason||'complete';
    if(bootIntegrity) bootIntegrity.textContent='VERIFIED';
    if(bootSequence) bootSequence.textContent='COMPLETE';
    if(bootStatus) bootStatus.textContent='MAIN ARCHIVE NODE LINK READY';
    if(loader) loader.classList.add('is-handoff');
    playRole('boot');
    setTimeout(()=>{
      if(loader) loader.classList.add('hide');
      if(app) app.classList.add('ready');
    },520);
  }
  if(loader){
    let bootStart=performance.now();
    function bootTick(now){
      const pct=((now-bootStart)/bootDuration)*100;
      setBootProgress(pct);
      if(pct>=100) setTimeout(()=>finishBoot('complete'),260);
      else requestAnimationFrame(bootTick);
    }
    requestAnimationFrame(bootTick);
    setTimeout(()=>finishBoot('fail-safe'),7200);
  } else {if(app)app.classList.add('ready');}
  document.querySelectorAll('#audioToggle').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('pc_audio_legacy2003_fixed',isOn()?'off':'on'); syncBtns(); if(isOn())playRole('menu');}));
  const pages=Array.from(document.querySelectorAll('.content-page'));
  const links=Array.from(document.querySelectorAll('.side-menu a[data-target]'));
  const moduleStateMap={
    history:{code:'01',status:'CHRONICLE INDEX // ONLINE',sub:'연대 기록 색인 연결'},
    'faction-info':{code:'02',status:'FACTION DATABASE // ACCESS GRANTED',sub:'세력 데이터베이스 연결'},
    'faction-relation':{code:'03',status:'RELATION MATRIX // LINKED',sub:'세력 관계 행렬 연결'},
    'zone-map':{code:'04',status:'REGIONAL SURFACE // SYNC READY',sub:'권역 관제면 연결'},
    'archive-entry':{code:'05',status:'ARCHIVE REPOSITORY // MOUNTED',sub:'기록 보관소 연결'}
  };
  function ensureMenuModuleDecor(){
    links.forEach((a,idx)=>{
      if(a.dataset.moduleDecorated) return;
      a.dataset.moduleDecorated='1';
      const info=moduleStateMap[a.dataset.target]||{code:String(idx+1).padStart(2,'0')};
      a.classList.add('module-entry');
      a.setAttribute('data-module-code',info.code||String(idx+1).padStart(2,'0'));
      a.insertAdjacentHTML('beforeend','<em class="menu-module-state" aria-hidden="true">STANDBY</em><span class="menu-module-scan" aria-hidden="true"></span>');
    });
  }
  function applyMenuState(target,phase){
    links.forEach(a=>{
      const state=a.querySelector('.menu-module-state');
      const active=a.dataset.target===target;
      a.classList.toggle('menu-linking',active && phase==='linking');
      a.classList.toggle('menu-online',active && phase==='online');
      a.classList.toggle('menu-idle',!active);
      if(state){
        if(active && phase==='linking') state.textContent='LINKING...';
        else if(active && phase==='online') state.textContent='ONLINE';
        else state.textContent='STANDBY';
      }
    });
    document.body.dataset.activeModule=target||'';
  }
  function clearReveal(page){
    if(!page) return;
    page.classList.remove('server-reveal-active');
    page.querySelectorAll('.server-reveal-item').forEach(el=>{
      el.classList.remove('server-reveal-item');
      el.style.removeProperty('--reveal-delay');
      el.style.removeProperty('--reveal-order');
      el.style.removeProperty('--reveal-duration');
    });
  }
  function collectRevealItems(page){
    const items=[];
    const seen=new Set();
    const push=(el)=>{
      if(!el || seen.has(el)) return;
      seen.add(el);
      items.push(el);
    };
    Array.from(page.children).forEach(child=>push(child));
    const nestedSelectors=[
      '.overview-stats > *','.timeline-list > *','.faction-grid > *','.detail-tabs > *','.page-tabs > *','.sub-tabs > *',
      '.map-catalog > *','.map-catalog.compact > *','.archive-list > *','.archive-groups details', '.zone-risk-grid > *',
      '.zone-risk-tabs > *','.zone-risk-page > *','.pc564-analysis-grid > *','.linked-records > *','.relation-table tbody tr',
      '.doc-meta > *','.doc-grid > *','.record-page > *','.record-content > *','.record-shell > *','.map-legend > *'
    ];
    nestedSelectors.forEach(sel=>page.querySelectorAll(sel).forEach(push));
    return items.slice(0,64);
  }
  function runPageReveal(id,instant){
    const page=pages.find(p=>p.id===id);
    if(!page) return;
    pages.forEach(p=>{ if(p!==page) clearReveal(p); });
    clearReveal(page);
    const items=collectRevealItems(page);
    items.forEach((el,idx)=>{
      el.classList.add('server-reveal-item');
      el.style.setProperty('--reveal-order',idx);
      el.style.setProperty('--reveal-delay', instant ? '0ms' : (70 + idx*28)+'ms');
      el.style.setProperty('--reveal-duration', instant ? '0ms' : (idx<4? '420ms':'360ms'));
    });
    requestAnimationFrame(()=>page.classList.add('server-reveal-active'));
  }
  let menuStateTimer=null;
  function announceModule(target){
    clearTimeout(menuStateTimer);
    applyMenuState(target,'linking');
    const info=moduleStateMap[target];
    const notice=document.querySelector('[data-srv-notice]');
    const trace=document.querySelector('[data-srv-trace]');
    if(info){
      if(notice) notice.textContent='MODULE LINK REQUEST / '+info.sub;
      if(trace) trace.textContent=info.status;
    }
    document.body.classList.add('server-module-switching');
    menuStateTimer=setTimeout(()=>{
      document.body.classList.remove('server-module-switching');
      applyMenuState(target,'online');
    },420);
  }
  function show(id,opts){
    opts=opts||{};
    if(!pages.length)return;
    if(!pages.some(p=>p.id===id)) id='history';
    pages.forEach(p=>p.classList.toggle('active',p.id===id));
    links.forEach(a=>a.classList.toggle('active',a.dataset.target===id));
    if(opts.announce!==false) announceModule(id); else applyMenuState(id,'online');
    runPageReveal(id,!!opts.instant);
    const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0;
  }
  ensureMenuModuleDecor();
  links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); startAmbient(); playRole('menu'); show(a.dataset.target,{announce:true}); history.replaceState(null,'','#'+a.dataset.target);}));
  if(pages.length){show((location.hash||'#history').slice(1),{announce:false,instant:true});}
  document.querySelectorAll('[data-open-record], .archive-list a, .backline a, .btn:not(.open-record):not(.record-back)').forEach(a=>a.addEventListener('click',()=>playRole('recordOpen')));
  const factionData={"uac": {"img": "uac.webp", "name": "U.A.C", "meta": "Urban Anomaly 봉쇄 / 도시 이상현상 격리국", "summary": "도시 이상현상과 우시노다교 의식, 괴이 출현, 레드존 확산을 감시하고 격리하는 상위 통제 기관.", "pages": [{"title": "개요", "body": "<p>U.A.C는 도시 내부에서 발생하는 이상현상, 괴이 출현, 우시노다교 의식, 오컬트 재난, 적성 종교 세력의 침투를 감시하고 격리하기 위해 설립된 국가 안보 기관이다.</p><p>정식 명칭은 Urban Anomaly 봉쇄이며, 한국어 명칭으로는 도시 이상현상 격리국이라 불린다. U.A.C는 단순한 수사 기관이나 군사 조직이 아니라, 도시 단위의 초상 재난을 감시하고 위험 구역을 분류하며 이상현상의 확산을 막기 위해 각 기관을 조율하는 상위 통제 기관에 가깝다.</p>"}, {"title": "창설 배경", "body": "<p>U.A.C의 창설 기점은 1986년으로 기록된다. 당시 정부는 대규모 인신공양 사건을 저지하기 위해 불멸을 향해 및 Blood Lake Incident File 작전을 승인하였다.</p><p>해당 작전은 우시노다교가 준비하던 대규모 인신공양 의식을 차단하기 위한 특수 작전이었으며, 의식의 완전한 진행은 저지되었다. 그러나 작전 이후 다수의 괴이체, 비정상적인 생체 변이, 오염된 의식 흔적, 기존 법집행기관으로는 설명하거나 통제할 수 없는 이상현상이 확인되었다.</p><p>정부는 이 사건을 계기로 일시적인 대응팀이 아닌, 영구적으로 이상현상을 감시하고 격리할 전문 기관이 필요하다고 판단하였다. 그 결과 설립된 조직이 U.A.C이다.</p>"}, {"title": "초기 조직 체계", "body": "<p>창설 초기에는 S.I.D와 N.H.C가 각각 조사 부서와 현장 진압 부서로서 U.A.C 산하에 편제되어 있었다. 우시노다교 의식, 괴이 출현, 인신공양 사건에 대응할 전문 기관이 부족했기 때문에 조사, 정보 수집, 현장 진압 기능이 모두 U.A.C 내부 체계에 묶여 있었다.</p><ul><li>U.A.C : 상위 통제 기관</li><li>S.I.D : 특수 조사 부서</li><li>N.H.C : 현장 진압 부서</li></ul>"}, {"title": "현재 조직 체계", "body": "<p>우시노다 현상, 괴이 출현, 레드존 확산, 혈교 의식, 블랙존화 사건이 증가하면서 기존 U.A.C 내부 부서 체계만으로는 대응이 어려워졌다.</p><p>이후 조직 개편을 통해 S.I.D와 N.H.C는 U.A.C 산하 하위 부서에서 분리되어 독립 기관으로 재편되었다. 현재 U.A.C는 도시 이상현상의 상위 통제와 구역 분류, 정보 관리, 기관 간 작전 조율을 담당하며, S.I.D와 N.H.C는 독립 기관으로서 U.A.C와 협력한다.</p><ul><li>U.A.C : 상위 통제, 구역 분류, 정보 관리</li><li>S.I.D : 독립 특수 조사 기관</li><li>N.H.C : 독립 현장 대응 조직</li></ul>"}, {"title": "핵심 목표", "body": "<p>U.A.C의 핵심 목표는 우시노다교의 인신공양 의식을 사전에 차단하고, 그로 인해 발생하는 타락 개체을 제거 또는 통제하는 것이다.</p><p>이후 우시노다 현상과 혈교 의식, 타락교 하위 조직, 인공 괴이, 피의 호수, 변이 균주와 같은 사건들이 늘어나면서 U.A.C의 임무 범위는 확장되었다. 현재 U.A.C는 괴이를 제거하는 기관이 아니라, 도시 전체가 레드존 또는 블랙존으로 변질되는 것을 막기 위한 최종 통제선으로 기능한다.</p>"}, {"title": "주요 임무", "body": "<ul><li>우시노다교 인신공양 의식 사전 차단</li><li>타락 개체 출현 감시</li><li>그린존, 옐로우존, 레드존, 화이트존, 블랙존 분류</li><li>이상현상 발생 지역 봉쇄 및 정보 통제</li><li>현장 기록, CCTV, 오디오, 생체 샘플 회수</li><li>S.I.D, N.H.C, F.H.C, A.R.F, C.P.D와의 작전 조율</li><li>위험 인물 및 비인가 연구자 감시</li><li>오컬트 생명체, 미확인 균주, 변이 조직 분석</li><li>민간 사회로의 정보 유출 차단</li></ul>"}, {"title": "정보 수집 부서", "body": "<p>U.A.C 정보 수집 부서는 도시 전역의 감시 영상, 통신 기록, 오디오 파일, 암호화 CCTV, 현장 데이터를 수집하고 복구하는 정보 부서이다. 이 부서는 U.A.C의 눈으로 불리며, 이상현상이 발생하기 전의 징후를 포착하고 이미 발생한 사건의 기록을 복원하는 역할을 맡는다.</p><p>주로 N.H.C 내부 이탈 징후, S.I.D 현장 보고, F.H.C 회수 문서, 타락교 및 혈교 활동 기록을 분석한다. 레드울프 이탈 기록과 축복으로 위장된 병기는 해당 부서가 복구한 감시 자료로 분류된다.</p><ul><li>암호화 영상 복호화</li><li>감시 데이터 수집</li><li>통신 기록 분석</li><li>내부 반역 징후 감시</li><li>적성 세력 활동 추적</li><li>위험 인물 파일 작성</li><li>비인가 오디오 및 CCTV 자료 복구</li><li>우시노다 현상 발생 전조 감지</li></ul>"}, {"title": "도시 격리 집행부", "body": "<p>U.A.C 도시 격리 집행부는 확인된 이상현상 발생 지역을 봉쇄하고, 괴이 및 오염 요소의 확산을 차단하는 실행 부서이다. 이 부서는 U.A.C의 망치로 불리며, 직접적인 전투만을 담당하는 조직이라기보다는 현장 봉쇄, 격리 명령, 출입 통제, 구역 등급 격상, 지원 부대 호출 권한을 가진 작전 집행 체계에 가깝다.</p><ul><li>이상현상 발생 지역 봉쇄</li><li>구역 출입 통제</li><li>민간인 대피 명령 승인</li><li>현장 격리선 설치</li><li>N.H.C 및 A.R.F 투입 요청</li><li>C.P.D와 연계한 피난민 통제</li><li>레드존 및 블랙존화 징후 감시</li><li>우시노다교 의식장 차단</li><li>괴이체 확산 경로 봉쇄</li></ul>"}, {"title": "오컬트 생명 과학 부서", "body": "<p>U.A.C 오컬트 생명 과학 부서는 괴이, 타락체, 피의 호수, 미확인 균주, 변이 조직을 연구하는 생체 분석 부서이다. 일반적인 생물학이나 법의학으로 설명할 수 없는 사체, 조직, 체액, 균주, 장기 반응을 조사한다.</p><p>피의 호수 부검 기록에서 마렌 예거트의 시신을 분석했으며, BL-088 균주를 최초로 임시 분류한 부서로 기록된다.</p><ul><li>괴이 조직 분석</li><li>타락 생명체 부검</li><li>미확인 균주 분류</li><li>생체 부패 정지 반응 연구</li><li>혈액성 잔류물 분석</li><li>괴이 유전자 자료 대조</li><li>F.H.C 분석 부서와 샘플 공유</li><li>타락 개체 변이 과정 기록</li></ul>"}]}, "nhc": {"img": "nhc.webp", "name": "N.H.C", "meta": "National Hazard Control / 국가 위난 격리 사령부", "summary": "레드존과 블랙존 인접 지역에 투입되는 고위험 현장 대응 조직.", "pages": [{"title": "개요", "body": "<p>N.H.C는 레드존, 옐로우존, 블랙존 인접 지역에 투입되는 고위험 현장 대응 조직이다. 초기에는 U.A.C 산하 현장 진압 부서로 운용되었으나, 레드존 확산과 블랙존화 사건이 증가하면서 독립적인 현장 대응 조직으로 재편되었다.</p><p>괴이 섬멸, 방어선 유지, 고위험 구역 봉쇄, 생존자 회수, 적성 무장 세력 제압을 담당한다. U.A.C가 전체 통제와 정보 관리를 담당한다면, N.H.C는 직접적인 전투와 현장 작전을 수행하는 조직이다.</p>"}, {"title": "레드울프 이탈", "body": "<p>과거 N.H.C 산하에는 레드울프가 1차 작전팀으로 존재했다. 그러나 그린존 붕괴 이후 이어진 사건을 계기로 해당 팀은 사실상 이탈하였고, 현재는 신디케이트 주요팀으로 분류된다.</p>"}, {"title": "주요 임무", "body": "<ul><li>레드존 방어선 유지</li><li>괴이 및 타락체 섬멸</li><li>고위험 구역 봉쇄</li><li>생존자 제한 구조</li><li>적성 무장 세력 제압</li><li>블랙존화 징후 감시</li><li>오염 구역 정화 및 소각 판단</li></ul>"}, {"title": "전술 및 특수 자산", "body": "<p>N.H.C는 일반 화기뿐만 아니라 타락 개체의 재생력을 억제하는 고주파 소각탄, 혈액 변이를 중단시키는 화학 중화 가스, 대괴이 특수 탄약 등 우시노다 현상에 특화된 독점 병기를 운용한다.</p><p>포획된 변이체를 해부하여 약점을 찾아내고, 인간 요원들에게 초자연적 저항력을 부여하는 위험한 시술 시설을 보유하고 있다는 의혹도 존재한다.</p>"}, {"title": "위버맨시", "body": "<p>위버맨시는 N.H.C의 기술력으로 탄생한 대생명체 전용 강화병이다. 우시노다 현상, 혈교 의식, 타락교 정신 오염, 그림자 계열 이상현상에 대응하기 위해 만들어진 극비 전력이다.</p><p>타락 개체와 대등하게 싸울 수 있는 유일한 인간형 전력으로 평가되지만, 시술 부작용으로 인해 서서히 인간성을 잃거나 결국 스스로가 격리 대상이 되는 경우가 있다.</p>"}, {"title": "기본 핵심 능력", "body": "<h4>혈액 중화 및 강화</h4><p>혈교의 혈액 마법에 대응하기 위해 자신의 혈액을 특수 화학 물질로 치환한 개체군이다. 이 혈액은 괴이체의 산성 혈액에 부식되지 않으며, 상처 부위를 빠르게 응고시키는 초재생 반응을 제공한다.</p><h4>신경계 가속</h4><p>그림자 계열 이상현상에 대응하기 위해 신경계를 기계적으로 가속한 개체군이다. 그림자 속에서 적이 나타나는 찰나의 움직임을 포착할 수 있는 초감각적 반사신경을 가진다.</p><h4>정신 격벽</h4><p>타락교의 정신 오염을 차단하기 위해 뇌에 인지 필터 칩을 삽입한 개체군이다. 환각이나 공포를 노이즈로 처리하여 무시할 수 있지만, 부작용으로 인간적인 감정까지 거세되어 기계처럼 차가운 성격이 되는 경우가 있다.</p>"}, {"title": "교단 분파별 사냥 전술", "body": "<h4>타락교 대응</h4><p>S.I.D가 특수 전파 교란기로 공간 왜곡을 억제하는 동안, 위버맨시는 정신 격벽을 활성화한 채 안개를 뚫고 진입한다.</p><h4>혈교 대응</h4><p>위버맨시는 대괴이용 무기를 사용하여 혈교의 경질화된 피와 뼈 무기를 절단한다. 혈액 마법에 전염되지 않는 특수 방호복과 중화 혈액 덕분에 강제 변이 공격을 무시하며 육탄전으로 괴물들을 제압한다.</p><h4>그림자교 대응</h4><p>고광도 UV 조명탄과 음파 탐지기로 그림자교의 은신처를 강제로 노출시킨다. 그림자 속으로 숨으려는 적을 가속된 신경계로 추적하여 비물질화가 풀리는 짧은 순간을 노려 특수 탄환으로 사살한다.</p>"}]}, "sid": {"img": "sid.webp", "name": "S.I.D", "meta": "Special Investigation Department / 특수 수사과", "summary": "이상현상, 오컬트 사건, 실종 사건, 심각 범죄를 조사하는 특수 조사 조직.", "pages": [{"title": "개요", "body": "<p>S.I.D는 이상현상, 심각 범죄, 괴이 출현, 오컬트 사건을 조사하는 특수 조사 조직이다. 초기에는 U.A.C 산하 특수 조사 부서로 운용되었으나, 사건 규모가 확대되고 지역별 독립 조사가 필요해지면서 독립 기관으로 재편되었다.</p><p>일반적인 수사 기관으로 해결하기 어려운 사건을 담당하며, 현장 조사, 피해자 기록, 의식 흔적 분석, 민간 구역 감시를 수행한다. 그린존 내부의 치안 유지와 이상현상 감시 역시 S.I.D의 주요 임무 중 하나이다.</p>"}, {"title": "핵심 임무", "body": "<ul><li>도심 및 일상 공간에서 발생하는 기괴한 징후 감지</li><li>피의 연못, 그림자 전이, 신체 변이 등 초상 현상 추적</li><li>우시노다 현상 발생 경로 분석</li><li>교단 은신처 및 의식장 식별</li><li>초자연적 에너지 잔류량 측정</li><li>F.H.C, 타락교, 혈교 관련 의도적 의식 여부 판별</li><li>현장 1차 봉쇄 및 정보 검열</li></ul>"}, {"title": "N.H.C와의 공조", "body": "<p>S.I.D는 수집된 데이터를 분석하여 N.H.C가 화력을 집중할 지점을 지목한다. 현상 발생 시 가장 먼저 현장에 도착하여 반경 수 킬로미터를 물리적으로 폐쇄하고, 외부인의 출입을 막으며 진실이 유출되지 않도록 정보 검열을 병행한다.</p><p>상황이 걷잡을 수 없이 커질 경우 N.H.C의 정규군 병력에 배속되어 현장 가이드 및 전술 지원팀으로 직접 전투에 참여한다.</p>"}, {"title": "무장 및 전술 지위", "body": "<p>S.I.D는 경찰 계열 조사 조직이지만 일반 총기 외에도 대크리처 전용 특수 탄환, 전파 교란기, 고감도 열화상 탐지기 등 군사 수준의 장비를 운용한다.</p><p>주 임무는 조사와 차단이지만, 초기 대응 실패 시 N.H.C가 도착하기 전까지 1차 봉쇄선을 유지해야 한다.</p>"}, {"title": "오컬트 부서", "body": "<p>S.I.D 오컬트 부서는 우시노다 현상, 괴이 출현, 타락교 관련 사건, 혈교 의식 흔적 등을 조사하는 전문 부서이다. 현장 조사관, 특수 효과 분석 담당자, 기록 담당자, 심각 범죄 분석관으로 구성되어 있다.</p><p>사쿠마 유타 실종 사건 보고서는 S.I.D 일본 도쿄 지부 오컬트 부서가 관리하던 사건 기록으로 분류된다.</p><ul><li>오컬트 범죄 현장 조사</li><li>괴이 흔적 판독</li><li>우시노다교 관련 문서 회수</li><li>피해자 관계 인물 조사</li><li>정신 오염 가능성 판정</li><li>U.A.C 및 F.H.C로 자료 이관</li></ul>"}]}, "ashcrew": {"img": "ashcrew.webp", "name": "Ash Crew", "meta": "괴이 사체 처리반 / N.H.C 산하 특수 처리반", "summary": "전투 이후 남은 오염 사체, 괴이 잔해, Blood Gate 잔류물, 오염된 장비를 봉인·회수·소각하는 처리반.", "pages": [{"title": "개요", "body": "<p>Ash Crew는 독립 세력이 아니라 N.H.C 산하 특수 처리반이다. 일반 N.H.C 전투조가 진압과 봉쇄를 담당한다면, Ash Crew는 전투 이후 남은 오염 사체, 괴이 잔해, 블랙 태그 대상, 오염된 장비, Blood Gate 잔류물을 봉인하고 소각한다.</p><p>이 부대는 전투의 승패가 결정된 뒤에도 끝나지 않는 현장 오염을 처리하기 위해 운용된다. 잔해 하나가 새로운 오염 매개체가 될 수 있기 때문에, Ash Crew의 임무는 단순한 청소가 아니라 2차 재난 차단에 가깝다.</p>"}, {"title": "오염 사체 처리", "body": "<p>괴이 사체, 타락 개체 잔해, 부패 정지 상태의 인체 조직, 혈액성 잔류물은 일반 의료·군수 절차로 처리하지 않는다. Ash Crew는 블랙 태그 봉인 백과 고열 소각 장비를 사용해 현장 반출 전 오염 수치를 측정하고, 회수 불가 판정 시 현장에서 소각한다.</p><ul><li>괴이 사체의 부위별 분리 봉인</li><li>혈액성 잔류물의 중화 및 소각</li><li>감염 가능 장비의 임시 격납</li><li>귀환자 접촉 흔적의 별도 기록</li></ul>"}, {"title": "블랙 태그", "body": "<p>블랙 태그 대상은 일반 회수 대상으로 분류되지 않는다. 해당 대상은 살아있는 생존자처럼 보이더라도 오염 매개체, 위장 개체, 자율 증식 조직일 가능성이 있어 Ash Crew 또는 U.A.C 고위 승인 없이는 반출할 수 없다.</p><p>A.R.F가 회수 작전을 수행하더라도 블랙 태그 대상은 Ash Crew의 현장 판정을 거친 뒤 봉인·소각·격리 중 하나로 처리된다.</p>"}, {"title": "오염된 장비", "body": "<p>오염된 장비는 현장 인원이 사용했거나 접촉한 장비가 의식 잔류물, 혈액성 반응, Ghost Channel 노이즈와 결합해 독립 위험물로 변한 것을 뜻한다. Ash Crew는 해당 장비를 군수품으로 회수하지 않고 별도 저주 오염 장비로 분류한다.</p><ul><li>손상된 혈무 또는 오염 탄창</li><li>Ghost Channel 반응을 보이는 무전기</li><li>피의 호수 잔류물에 노출된 방호복</li><li>사용자 사망 후에도 반응하는 장비</li></ul>"}, {"title": "주요 장비", "body": "<ul><li>블랙 태그 봉인 백</li><li>고열 소각기</li><li>CI-O 오염 측정기</li><li>Ghost Channel 차단기</li><li>Ash Truck 현장 처리 차량</li><li>오염 장비 임시 격납 케이스</li><li>혈액성 잔류물 중화 팩</li></ul>"}, {"title": "협력 기관", "body": "<p>Ash Crew는 N.H.C의 후속 처리반이지만 단독으로 모든 결정을 내리지 않는다. S.I.D가 현장 증거를 확인하고, A.R.F가 회수 가능한 물리 자료를 선별하며, F.H.C는 일부 샘플의 분석 필요성을 제기한다. 다만 블랙 태그 대상의 최종 반출 여부는 U.A.C 통제권 아래 결정된다.</p>"}]}, "arf": {"img": "arf.webp", "name": "A.R.F", "meta": "Anomaly Recovery Force / 이상현상 회수 부대", "summary": "전면 교전보다 생존자, 샘플, 기록 매체, 장비, 시신, 기밀 자산 회수에 특화된 조직.", "pages": [{"title": "개요", "body": "<p>A.R.F는 이상현상 회수 부대다. 전면 교전보다 생존자, 샘플, 기록 매체, 장비, 시신, 기밀 자산을 회수하는 역할에 특화되어 있다.</p><p>이들은 N.H.C가 교전 구역을 확보한 뒤 후속 진입하며, 아직 완전히 안전하지 않은 현장에서 정보와 물증을 보존하는 역할을 맡는다.</p>"}, {"title": "회수 임무", "body": "<ul><li>생존자 제한 구조 및 이송</li><li>시신과 신원 불명 인체 잔해 반출</li><li>현장 기록 매체, 카메라, 오디오 장비 회수</li><li>괴이 조직과 혈액 샘플의 1차 격납</li><li>기밀 장비와 오염 문서 회수</li></ul>"}, {"title": "작전 구조", "body": "<p>A.R.F는 선두 전투부대가 아니다. N.H.C가 위험 개체를 제압하거나 방어선을 확보한 뒤 진입하며, S.I.D가 지정한 증거물과 U.A.C가 요구한 기록 매체를 우선 회수한다.</p><p>현장 상황이 불안정할 경우 A.R.F는 회수보다 봉쇄선 외곽 대기를 우선하며, N.H.C 호위 없이 레드존 심부로 진입하지 않는다.</p>"}, {"title": "F.H.C 분석 전 단계", "body": "<p>F.H.C가 분석하는 대부분의 샘플은 A.R.F가 먼저 물리적으로 회수한다. A.R.F는 연구 조직이 아니라 회수 조직이므로, 샘플의 의미를 해석하기보다 원형 보존과 오염 확산 방지를 우선한다.</p><ul><li>샘플 원형 보존</li><li>현장 좌표 및 회수 시간 기록</li><li>동행 인원 오염 노출 기록</li><li>분석기관 이송 전 봉인 확인</li></ul>"}, {"title": "Ash Crew와의 차이", "body": "<p>A.R.F는 회수 가능한 자료와 생존자를 반출하는 부대이고, Ash Crew는 회수 불가 또는 위험성이 높은 사체·장비를 처리하는 부대다. 블랙 태그 대상은 A.R.F가 단독 회수하지 않고 Ash Crew 또는 U.A.C의 판단을 따른다.</p>"}]}, "cpd": {"img": "cpd.webp", "name": "C.P.D", "meta": "Civilian Protection Division / 민간 보호 조직", "summary": "민간 보호와 외곽 질서 유지, 피난민 관리, 귀환자 분리 절차를 담당하는 조직.", "pages": [{"title": "개요", "body": "<p>C.P.D는 민간 보호와 외곽 질서 유지를 담당하는 조직이다. 레드존 안쪽으로 깊게 들어가기보다는 검문선, 대피소, 보호 구역, 귀환자 분리 절차를 관리한다.</p><p>U.A.C와 N.H.C가 이상현상과 교전을 관리한다면, C.P.D는 그 바깥에서 민간 사회가 완전히 붕괴하지 않도록 질서를 유지한다.</p>"}, {"title": "피난민 관리", "body": "<ul><li>피난민 대기 구역 관리</li><li>대피 경로 통제</li><li>가족 단위 신원 확인</li><li>오염 노출자와 일반 민간인 분리</li><li>식량, 의료품, 임시 거주 구역 배정</li></ul>"}, {"title": "검문 게이트", "body": "<p>C.P.D 검문 게이트는 그린존과 옐로우존, 옐로우존과 레드존 외곽을 나누는 민간 통제선이다. 모든 통과 인원은 신분 확인, 오염 반응 검사, 귀환자 판정을 거친다.</p><p>의심 인원은 S.I.D나 U.A.C 조사반으로 이관되며, 폭동이나 강제 돌파 시 N.H.C 외곽 경계대가 지원된다.</p>"}, {"title": "귀환자", "body": "<p>귀환자는 실종 이후 돌아온 민간인 중 기억 공백, 생체 반응 이상, 타인의 신원 모방, Ghost Channel 반응을 보이는 대상을 말한다. C.P.D는 이들을 일반 피난민과 분리하고 S.I.D 조사 전까지 보호 격리한다.</p>"}, {"title": "C.P.D 대피버스", "body": "<p>C.P.D 대피버스는 레드존 외곽과 옐로우존에서 민간인을 그린 코어 또는 임시 대피소로 옮기는 이동 수단이다. 단순 수송 차량이 아니라 이동식 검문·분리 절차를 수행하는 민간 보호 장비로 운용된다.</p>"}, {"title": "기관 관계", "body": "<p>C.P.D는 U.A.C 행정 통제 아래 운영되며, S.I.D와는 민간 구역 조사 및 실종자 자료 공유를, N.H.C와는 외곽 봉쇄 및 대피 지원을, A.R.F와는 생존자 이송 절차를 공유한다.</p>"}]}, "fhc": {"img": "fhc.webp", "name": "F.H.C", "meta": "Foremost Hitech Cooperation / 포레모스트 하이테크 기업", "summary": "초상 기술, 괴이 조직, 타락·혈액 샘플, 비인가 연구 자료를 분석하고 회수하는 고위 기술 조직.", "pages": [{"title": "개요", "body": "<p>F.H.C는 초상 기술, 괴이 조직, 타락 및 혈액 관련 샘플, 비인가 연구 자료를 분석하고 회수하는 고위 기술 조직이다. 표면적으로는 첨단 기술 개발, 교육 서비스, 사회 복지, 의료 기술, 특수 산업 연구를 제공하는 세계적인 초거대 기업이다.</p><p>그러나 내부적으로는 초자연과학, 오컬트 생명공학, 현실 접속 기술, 생체 병기화 가능성을 다루는 극비 부서를 보유하고 있다. F.H.C는 U.A.C, S.I.D, N.H.C가 회수한 자료를 분석하며, 특히 아마리온 제약과 공식 협력 관계를 맺고 있다.</p>"}, {"title": "표면적 정체", "body": "<ul><li>첨단 기술 개발 기업</li><li>교육 서비스 및 연구 지원 기관</li><li>사회 복지 및 의료 지원 기업</li><li>고위 산업 기술 협력체</li><li>아마리온 제약과 공식 연구 협력 관계 유지</li></ul>"}, {"title": "실질적 정체", "body": "<p>F.H.C는 초상 기술과 오컬트 현상을 기술적으로 실용화하려는 오컬트 과학 복합체에 가깝다. 이들은 외신, 우시노다 현상, 괴이 조직, 혈액 의식, 현실 왜곡, 생명 연장, 생체 병기화 가능성 등을 연구한다.</p><p>공식적으로는 U.A.C와 협력하는 기술 분석 기관이지만, 일부 내부 부서와 자금 흐름에서 우시노다교와의 유착 정황이 확인되고 있다. 따라서 F.H.C는 협력 기관이자 감시 대상에 가까운 이중적 세력이다.</p>"}, {"title": "사회적 영향력", "body": "<p>F.H.C는 수많은 학원, 학교, 연구소, 복지 시설을 운영하며 인재 육성과 사회 기여를 명분으로 영향력을 확장하고 있다. 그러나 일부 시설은 우시노다 현상이 발생하는 주요 지점을 감시하고 제어하기 위한 거점으로 활용된다는 의혹이 존재한다.</p><p>세련된 디자인의 선전 포스터와 출판물을 통해 우시노다와 관련된 철학을 현대적인 자기계발, 첨단 과학, 진화론적 인류 개선 사상으로 위장하여 대중에게 배포한다는 기록도 있다.</p>"}, {"title": "극비 분석 부서", "body": "<p>F.H.C 극비 분석 부서는 괴이, 혈교, 타락교, 우시노다 현상, 비인가 생체 연구 자료, 초상 기술을 분석하고 회수하는 고위 보안 부서이다.</p><p>특히 아마리온 제약, BL-088 균주, 괴이 유전자 디지털화 기술, 저접근 자기 변형 시스템과 관련된 자료를 별도 관리하는 것으로 추정된다.</p><ul><li>초상 기술 분석</li><li>괴이 조직 샘플 연구</li><li>회수 문서 해독</li><li>비인가 연구자 추적</li><li>아마리온 협력 자료 검토</li><li>생체 병기화 가능성 평가</li><li>타락 및 혈액 관련 기술 분류</li><li>우시노다교 유착 의혹 자료 추적</li></ul>"}, {"title": "무력 체계와 조사 기록", "body": "<p>F.H.C는 기업 보안을 명분으로 정규군에 필적하는 사설 무장 세력을 보유하고 있다. 이들은 외부 조사기관의 접근을 차단하거나, 실험 도중 통제를 벗어난 괴이체를 비밀리에 처리한다.</p><p>표면적으로는 합법적인 기업 활동을 하나, 내부 기밀 문서와 자금 흐름을 추적한 결과 우시노다교의 핵심 성소 및 일부 의식 거점과 물리적·재정적으로 연결되어 있다는 정황이 발견되었다.</p>"}]}, "amarion": {"img": "amarion.webp", "name": "Amarion", "meta": "Amarion Pharmaceuticals / 아마리온 제약", "summary": "의약품과 생명공학을 표면에 둔 민간 제약 기업이자 F.H.C 협력·감시 대상.", "pages": [{"title": "개요", "body": "<p>아마리온 제약은 표면적으로는 의약품, 생명공학, 특수 자원 연구를 수행하는 대형 민간 제약 기업이다. 공식적으로는 F.H.C와 연구 협력 관계를 맺고 있으며, 초자연과학, 생명 연장, 고응축 자원, 특수 물질 분석 분야에서 기술 지원을 제공하는 협력 기관으로 분류된다.</p><p>그러나 아마리온은 F.H.C의 승인 범위를 넘어선 비인가 실험을 여러 차례 진행한 정황이 있으며, 현재는 협력 기관이자 고위험 감시 대상이라는 이중적 위치에 놓여 있다.</p>"}, {"title": "F.H.C와의 관계", "body": "<p>F.H.C는 아마리온의 기술력과 연구 성과를 필요로 하지만, 아마리온이 보유한 기술이 너무 위험하기 때문에 완전히 신뢰하지 않는다. 따라서 아마리온은 F.H.C의 협력 기업이면서도 동시에 감시와 통제를 받는 민간 연구 조직으로 분류된다.</p>"}, {"title": "초자연과학 연구 부서", "body": "<p>아마리온 초자연과학 연구 부서는 아마리온 제약 내부에 존재했던 비공개 연구 부서이다. 이 부서는 일반적인 질병 치료나 의약품 개발이 아니라 현실 왜곡, 비가시적 공간 접속, 생체 변형, 고응축 자원 회수, 불멸 연구와 관련된 실험을 진행한 것으로 추정된다.</p><p>공식 기록상 대부분의 자료는 삭제되었으나, F.H.C가 회수한 사전교육 영상에서 해당 부서의 존재가 확인되었다.</p>"}, {"title": "대표 기술", "body": "<p>저접근 자기 변형 시스템은 현실 세계와 비가시적 공간 사이의 접점을 형성하기 위해 개발된 초기형 관문 기술로 추정된다. 아마리온은 이를 자원 확보와 인류 생존 기반 확장 기술로 홍보했으나, F.H.C 분석 기록에 따르면 현실 외부 공간 접촉 실험에 가까운 것으로 분류된다.</p>"}]}, "syndicate": {"img": "syndicate.webp", "name": "Syndicate", "meta": "신디케이트 / 비공식 사설 군사 네트워크", "summary": "국가 기관, 기업, 종교 집단, 무장 조직 사이에서 활동하는 비공식 사설 군사 조직.", "pages": [{"title": "개요", "body": "<p>신디케이트는 국가 기관, 기업, 종교 집단, 무장 조직 사이의 틈에서 활동하는 비공식 사설 군사 조직이자 무장 네트워크이다. 현재 일부 작전은 F.H.C의 거대 자본에 고용되어 움직이지만, 본질적으로는 독자적인 이해관계와 생존 논리를 가진 예측 불가능한 집단이다.</p><p>이들은 국가 체계를 거부하면서도 우시노다의 힘을 군사 전술에 결합하려는 시도를 보이며, 정부와 교단 양쪽 모두에게 위험한 세력으로 분류된다.</p>"}, {"title": "군사 전술과 우시노다", "body": "<p>신디케이트는 우시노다교처럼 숭배에 매몰되지 않는다. 대신 우시노다의 힘을 철저히 효율적인 무기로 취급한다. 현대적 군사 전술에 초자연적인 변이 능력을 덧입혀 정부군인 N.H.C조차 당혹하게 만드는 변칙적인 전투를 수행한다.</p>"}, {"title": "독자 노선", "body": "<p>신디케이트는 작전 단위로 F.H.C의 명령을 따르거나 자금을 받을 수 있지만, 완전히 F.H.C에 종속된 조직은 아니다. 정부에게는 체제를 위협하는 테러리스트이며, 교단에게는 신성한 힘을 도구로 모독하는 약탈자이다.</p><p>이들은 오직 자신들의 독립된 세력을 유지하고 힘을 키우는 데 관심이 있다.</p>"}, {"title": "기만 전술", "body": "<p>신디케이트의 가장 특징적인 전술은 더미 요원 활용이다. 현장에서 포로로 잡히거나 정보가 유출되는 것을 막기 위해 실제 인간 요원 대신 정교하게 제작된 인조체나 세뇌된 소모품 병사를 전면에 내세운다.</p><p>이로 인해 U.A.C가 이들을 소탕하더라도 본대의 실체나 거점은 늘 안개 속에 가려져 있다.</p>"}, {"title": "레드울프", "body": "<p>레드울프는 현재 신디케이트 내부에서 가장 핵심적인 전투 및 현장 작전팀 중 하나로 분류된다. 이들은 원래 N.H.C 1차 작전팀으로 활동했던 고위험 대응팀이었으나, 그린존 붕괴 사건 및 그 이후 이어진 일련의 사건을 거치며 기존 지휘 체계에서 이탈하였다.</p><ul><li>이전 명칭 : N.H.C 1차 작전팀 레드울프</li><li>현재 분류 : 신디케이트 주요팀 레드울프</li><li>변동 사유 : 그린존 붕괴 이후 지휘 체계 붕괴, 상부와의 결별, 생존 인원 재편, 비공식 세력화</li></ul>"}, {"title": "켈베로스 파벌", "body": "<p>켈베로스 파벌은 레드울프 전체를 의미하는 명칭이 아니라, 현재 신디케이트 주요팀으로 활동 중인 레드울프 내부에서 웨이드 밀렌을 중심으로 형성될 가능성이 있는 비인가 독자 행동 세력을 뜻한다.</p><p>밀렌은 과거 N.H.C 시절부터 상부 명령에 대한 불신을 보였으며, 레드울프가 신디케이트 소속으로 재편된 이후에는 독자적인 질서와 권력을 세우려는 방향으로 움직이고 있다. 이후 기록에서는 우시노다의 힘을 감염 병기와 억제제로 전환하려는 계획이 확인되었다.</p>"}]}, "ushinoda": {"img": "ushinoda.webp", "name": "Ushnoda Cult", "meta": "우시노다교 / 타락교·혈교·그림자교를 포함한 통합 교단", "summary": "우시노다의 힘을 숭배하며 인신공양과 이상현상을 통해 세계 재편을 시도하는 적대 종교 세력.", "pages": [{"title": "개요", "body": "<p>우시노다교는 고대 존재 우시노다의 힘을 숭배하며, 그를 향한 맹목적인 믿음을 바탕으로 인류의 도덕성을 완전히 저버린 최악의 광신도 집단이다. 이들은 단순히 신을 믿는 것을 넘어 잔혹한 반인류적 행위를 신성한 의식으로 여기며 인간을 초월한 신인류라는 왜곡된 이상을 꿈꾼다.</p>"}, {"title": "연합된 세 가지 교단", "body": "<p>현재 우시노다교는 각기 다른 힘과 성향을 가진 세 분파가 하나의 목적을 위해 손을 잡은 교단 연합 체제로 운영되고 있다. 이들의 세력은 이미 비밀리에 전 세계 구석구석까지 뻗어 나가 있으며, 도시 내부의 공공 시설, 학교, 병원, 연구소, 복지 기관에 침투한 정황이 확인되고 있다.</p>"}, {"title": "타락교", "body": "<p>타락교는 인간의 정신을 오염시키고 자아를 붕괴시켜 우시노다의 의지에 완전히 종속되게 만드는 심리적 잠식을 담당한다. 이들은 우시노다의 타락의 힘을 축복으로 받아들이며, 신체 변형과 불멸성을 신앙의 증거로 여긴다.</p><h4>핵심 능력 : 현실 부식</h4><ul><li>공포의 안개 : 오염된 기운에 노출된 자는 가장 끔찍한 트라우마를 환각으로 본다.</li><li>자아 와해 : 상대의 이성을 마비시켜 자신이 누구인지 잊게 만들거나 스스로를 해치게 만든다.</li><li>공간 뒤틀림 : 문을 열면 다른 장소가 나오거나 복도가 무한히 길어지는 공간 왜곡을 일으킨다.</li></ul>"}, {"title": "혈교", "body": "<p>혈교는 혈액 마법과 신체 변이에 집착하는 분파이며, 인체를 기괴하게 뒤틀어 타락 개체을 만들어내는 실무적인 무력 집단이다.</p><h4>핵심 능력 : 과부하 변이</h4><ul><li>경질화 혈액 : 피를 강철보다 단단한 칼날이나 가시로 굳혀 공격한다.</li><li>신체 재구성 : 뼈를 검으로 쓰거나 등에서 촉수를 돋게 하며, 부상을 입을수록 더 강력한 형태로 변이한다.</li><li>강제 전이 : 적의 몸속에 자신의 피를 주입하여 장기를 뒤틀거나 타락 개체로 강제 변이시킨다.</li></ul>"}, {"title": "그림자교", "body": "<p>그림자교는 실체가 없는 공포를 이용하는 분파이다. 어둠 속에서 은밀하게 움직이며 요인을 암살하거나, 보이지 않는 곳에서 이상현상을 유도하여 사회적 혼란을 야기한다.</p><h4>핵심 능력 : 심연의 수의</h4><ul><li>그림자 전이 : 모든 그림자를 통로로 삼아 순간이동한다.</li><li>비물질화 : 일시적으로 신체를 그림자 상태로 만들어 총알이나 물리 공격이 통과하게 만든다.</li><li>그림자 구속 : 상대의 그림자를 물리적으로 고정하거나 목을 조르는 끈으로 변형시킨다.</li></ul>"}, {"title": "인신공양과 이상현상", "body": "<p>우시노다교에게 가장 중요한 행위는 인신공양이다. 무고한 생명을 제물로 바침으로써 현실 세계의 물리 법칙을 뒤트는 이상현상을 강제로 발생시키며, 이를 통해 우시노다의 강림을 앞당기려 한다.</p>"}, {"title": "영향력과 암약", "body": "<p>우시노다교는 정체를 숨긴 채 F.H.C와 같은 거대 자본 뒤에 숨어 활동하거나, 학교와 병원 같은 공공 시설에 침투하여 일반인을 서서히 오염시킨다.</p><p>최종 목표는 기존 인류를 멸절시키고, 우시노다의 축복을 받은 변이된 인류로 세상을 재편하는 것이다.</p>"}]}, "haimun": {"img": "haimun.webp", "name": "Haimun", "meta": "For Our Future / 하이문", "summary": "우시노다교의 타락교와 혈교 교리에 심취한 범죄 조직이자 초인간주의 신봉자 단체.", "pages": [{"title": "개요", "body": "<p>하이문은 우시노다교의 분파 중 가장 과격한 타락교와 혈교의 교리에 심취하여, 인류의 멸망과 새로운 세상의 도래를 꿈꾸는 범죄 조직이자 초인간주의 신봉자 단체이다.</p><p>우리의 미래를 위하여라는 슬로건 아래 기존의 인간성을 버리고 괴물로 진화하는 것을 유일한 구원으로 믿는다.</p>"}, {"title": "도심 속 공포", "body": "<p>하이문은 U.A.C의 감시를 피해 도심 깊숙이 뿌리를 내리고 있다. 현재 도시 곳곳에서 산발적으로 발생하는 우시노다 현상의 압도적인 다수는 이들의 소행으로 추정된다.</p><p>이들은 인신공양을 위해 일반 시민들을 납치하거나, 도심 한복판에서 금기된 의식을 강행하여 도시를 아수라장으로 만든다.</p>"}, {"title": "초인간주의 사상", "body": "<p>하이문의 구성원들은 인간이라는 종의 나약함에 환멸을 느낀 자들이다. 타락교의 정신 오염과 혈교의 신체 변이를 적극적으로 받아들이며, 스스로 기괴한 존재가 되는 것을 진화라고 부른다.</p><p>이들은 인간은 곧 사라질 구시대의 유물이며, 우시노다의 축복을 받은 우리만이 미래라고 주장한다.</p>"}, {"title": "리더십", "body": "<p>대부분 평범한 인간들로 구성되어 활동하지만, 이들을 하나로 묶고 거대한 테러를 기획하는 리더의 정체는 철저히 베일에 싸여 있다. 조직원들조차 리더를 직접 본 적이 없으며, 오직 우시노다의 목소리를 대변하는 전언을 통해서만 명령을 하달받는다고 알려져 있다.</p>"}, {"title": "추적 대상", "body": "<p>하이문은 도심 내부에서 인신공양, 실종 사건, 우시노다 현상, 괴이 출현을 유발하는 주요 세력으로 분류된다. S.I.D는 은신처와 의식 거점을 추적하며, U.A.C는 하이문이 활동한 구역을 옐로우존 또는 레드존으로 격상할 수 있다. N.H.C는 대규모 의식이나 타락 개체 양산 정황이 확인될 경우 즉시 투입된다.</p>"}]}};
  const detail=document.getElementById('factionDetail');
  function renderFaction(key){
    const d=factionData[key]||factionData.uac; if(!detail)return;
    detail.innerHTML=`<img class="faction-mark-large" src="${prefix}assets/faction_marks/${d.img}" alt="${d.name}"><h3>${d.name}</h3><div class="meta">${d.meta}</div><p class="faction-summary">${d.summary||''}</p><div class="detail-tabs">${d.pages.map((p,i)=>`<button class="detail-tab ${i===0?'active':''}" data-i="${i}" type="button">${p.title}</button>`).join('')}</div><div class="detail-body"></div>`;
    function showPage(i,sound=true){const p=d.pages[i]||d.pages[0]; detail.querySelectorAll('.detail-tab').forEach((b,idx)=>b.classList.toggle('active',idx===i)); detail.querySelector('.detail-body').innerHTML=`<h4>${p.title}</h4>${p.body}`; if(sound)playRole('page');}
    detail.querySelectorAll('.detail-tab').forEach((b,i)=>b.addEventListener('click',()=>showPage(i,true)));
    showPage(0,false);
    document.querySelectorAll('.faction-tile').forEach(b=>b.classList.toggle('active',b.dataset.key===key));
  }
  document.querySelectorAll('.faction-tile').forEach(b=>b.addEventListener('click',()=>{playRole('menu'); renderFaction(b.dataset.key)})); if(detail){ detail.innerHTML='<div class="pc581r10-faction-standby"><b>FACTION DATABASE STANDBY</b><span>세력 마크를 선택하면 해당 정보 페이지를 열람한다.</span></div>'; document.querySelectorAll('.faction-tile').forEach(b=>b.classList.remove('active')); }
  document.querySelectorAll('.paged-record').forEach(box=>{
    const recPages=Array.from(box.querySelectorAll(':scope > .record-page'));
    const tabs=box.querySelector(':scope > .page-tabs');
    if(!recPages.length||!tabs) return;
    function showRec(i,sound=true){recPages.forEach((p,idx)=>p.classList.toggle('active',idx===i)); tabs.querySelectorAll(':scope > .page-tab').forEach((b,idx)=>b.classList.toggle('active',idx===i)); if(sound)playRole('page'); const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0; else window.scrollTo(0,0);}
    tabs.querySelectorAll(':scope > .page-tab').forEach((b,i)=>b.addEventListener('click',()=>showRec(i,true)));
    showRec(0,false);
  });
  document.querySelectorAll('.nested-record').forEach(box=>{
    const pages=Array.from(box.querySelectorAll(':scope .sub-pages > .sub-page'));
    const tabs=box.querySelector(':scope > .sub-tabs');
    if(!pages.length||!tabs) return;
    function showSub(i,sound=true){pages.forEach((p,idx)=>p.classList.toggle('active',idx===i)); tabs.querySelectorAll(':scope > .sub-tab').forEach((b,idx)=>b.classList.toggle('active',idx===i)); if(sound)playRole('page');}
    tabs.querySelectorAll(':scope > .sub-tab').forEach((b,i)=>b.addEventListener('click',()=>showSub(i,true)));
    showSub(0,false);
  });
  // FINAL ALLFIX: document navigation disabled; archive records open inside the index panel.

  document.querySelectorAll('.zone-risk-panel').forEach(panel=>{
    const tabs=Array.from(panel.querySelectorAll('.zone-risk-tab'));
    const pages=Array.from(panel.querySelectorAll('.zone-risk-page'));
    const keyMap={security:'security',green:'green',yellow:'yellow',red:'red',white:'white',black:'black',upgrade:'upgrade',down:'down'};
    function showZone(key,sound=true){
      const cls=keyMap[key]||key||'security';
      let matched=false;
      pages.forEach((p,i)=>{const on=p.classList.contains(cls)||(!key && i===0); if(on) matched=true; p.classList.toggle('active',on);});
      if(!matched && pages[0]) pages[0].classList.add('active');
      tabs.forEach(t=>t.classList.toggle('active', t.dataset.zone===key));
      if(sound){startAmbient(); playRole('page');}
    }
    tabs.forEach(t=>t.addEventListener('click',()=>showZone(t.dataset.zone,true)));
  });


  // FINAL ALLFIX: internal archive record viewer, no external docs navigation.
  const archiveListWrap=document.getElementById('archiveListWrap');
  const archiveViewer=document.getElementById('archiveRecordViewer');
  const BIO_RECORDS=new Set(['타락 개체_860722','FCR_Archive_890402','불명_Record2_860205','불명_Record5_940626']);
  window.ProjectCurseBioRecords=BIO_RECORDS;
  const VIDEO_RECORDS=new Set(['Immortality_860201','Sakuma_Tape_991028','불명_Record1_860204']);
  window.ProjectCurseVideoRecords=VIDEO_RECORDS;
  function resetRecordState(root){
    if(!root) return;
    root.querySelectorAll('.paged-record').forEach(box=>{
      const recPages=Array.from(box.querySelectorAll(':scope > .record-page'));
      const tabs=box.querySelector(':scope > .page-tabs');
      recPages.forEach((p,i)=>p.classList.toggle('active',i===0));
      if(tabs) tabs.querySelectorAll(':scope > .page-tab').forEach((b,i)=>b.classList.toggle('active',i===0));
    });
    root.querySelectorAll('.nested-record').forEach(box=>{
      const pages=Array.from(box.querySelectorAll(':scope .sub-pages > .sub-page'));
      const tabs=box.querySelector(':scope > .sub-tabs');
      pages.forEach((p,i)=>p.classList.toggle('active',i===0));
      if(tabs) tabs.querySelectorAll(':scope > .sub-tab').forEach((b,i)=>b.classList.toggle('active',i===0));
    });
  }
  function showInternalRecord(id){
    if(!archiveViewer) return;
    const selected=archiveViewer.querySelector(`.record-detail[data-record="${id}"]`);
    if(!selected) return;
    startAmbient();
    const loaderMode=id==='Cults_871104'?'fhc':(VIDEO_RECORDS.has(id)?'video':(BIO_RECORDS.has(id)?'bio':'default'));
    configureRecordLoader(loaderMode);
    showRecordLoad(()=>{
      if(archiveListWrap) archiveListWrap.classList.add('is-hidden');
      archiveViewer.hidden=false;
      archiveViewer.querySelectorAll('.record-detail').forEach(el=>{el.hidden=true;});
      selected.hidden=false;
      resetRecordState(selected);
      const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0;
      const loaderEl=document.getElementById('recordLoading'); if(loaderEl) loaderEl.classList.remove('show');
      playRole('recordOpen');
    });
  }
  function closeInternalRecord(e){
    if(e){e.preventDefault(); e.stopPropagation();}
    if(archiveViewer){archiveViewer.hidden=true; archiveViewer.querySelectorAll('.record-detail').forEach(el=>{el.hidden=true;});}
    if(archiveListWrap){archiveListWrap.classList.remove('is-hidden'); archiveListWrap.querySelectorAll('details').forEach(d=>d.open=true);}
    const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0;
    playRole('menu');
  }
  window.ProjectCurseShowInternalRecord=showInternalRecord;
  window.ProjectCurseCloseInternalRecord=closeInternalRecord;
  document.querySelectorAll('.open-record[data-record]').forEach(btn=>{
    btn.addEventListener('click',e=>{e.preventDefault(); showInternalRecord(btn.dataset.record);});
  });
  document.querySelectorAll('.record-back').forEach(btn=>btn.addEventListener('click',e=>closeInternalRecord(e)));

});



// Final patch: bottom map marker explanation buttons only. Zone criteria stays in the right panel.
(function(){
  const data={
    red:{title:'붉은 오염 확산형',body:'<p><b>표시:</b> 레드존 영향권 / 중심부 마커</p><p>고위험 사건 발생권을 불규칙한 오염 확산형으로 표시한다. 자세한 구역 기준은 오른쪽 레드존 항목에서 확인한다.</p>'},
    yellow:{title:'황색 오염 확산형',body:'<p><b>표시:</b> 옐로우존 경계권</p><p>레드존 인근의 완충·경계권을 표시한다. 독립 구역이 아니라 레드존 주변 방어·조사 범위로 배치한다.</p>'},
    black:{title:'흑색 오염 확산형',body:'<p><b>표시:</b> 블랙존 봉쇄권</p><p>진입 금지 또는 통제권 상실 구역을 표시한다. 상세 기준은 오른쪽 블랙존 항목에서 확인한다.</p>'},
    green:{title:'녹색 오염 확산형',body:'<p><b>표시:</b> 그린존 코어 / 안정 행정권</p><p>주요 수도권, 행정 거점, 민간 거주가 유지되는 안정권을 분리된 안정권으로 표시한다. 주변 이상 징후가 증가하면 옐로우존으로 격상될 수 있다.</p>'},
    white:{title:'백색 오염 확산형',body:'<p><b>표시:</b> 화이트존 감시권 / 외곽 통제권</p><p>완전한 안전지대가 아니라 장기 감시와 출입 통제가 유지되는 권역을 표시한다. 그린존과 겹치지 않도록 외곽 감시권과 안정 중심부를 분리 표기한다.</p>'},
    defense:{title:'방어선',body:'<p><b>표시:</b> 긴 점선 차단선</p><p>N.H.C 외곽 방어선과 C.P.D 통제선의 위치를 나타낸다.</p>'},
    gate:{title:'봉쇄 게이트',body:'<p><b>표시:</b> 마름모형 게이트 마커</p><p>구역 출입과 검문을 통제하는 고정 봉쇄 지점이다.</p>'},
    bus:{title:'C.P.D 대피버스',body:'<p><b>표시:</b> 작은 차량형 마커</p><p>민간인 이송, 귀환자 분리, 선별 검사 대기자 수송을 담당하는 C.P.D 이동 대피 지점이다.</p>'},
    hq:{title:'본부 / 기지 / 시설',body:'<p><b>표시:</b> 삼각형, 다이아몬드, 사각형 계열 마커</p><p>U.A.C 본부, N.H.C 전방기지, S.I.D 지부, A.R.F 회수 거점, F.H.C 연구시설, 이동 감시 거점 등을 나타낸다.</p>'},
    ash:{title:'오염 처리소',body:'<p><b>표시:</b> 십자형 처리 마커</p><p>오염된 장비, 괴이 잔류물, 회수 금지 물품을 봉인·소각·격리하는 후처리 지점이다.</p>'}
  };
  function render(key){const box=document.getElementById('mapInfoDisplay'); if(!box || !data[key]) return; box.innerHTML='<h3>'+data[key].title+'</h3>'+data[key].body; document.querySelectorAll('.map-info-btn').forEach(b=>b.classList.toggle('active',b.dataset.mapInfo===key));}
  document.querySelectorAll('.map-info-btn').forEach(btn=>btn.addEventListener('click',()=>{try{if(typeof play==='function' && typeof audio!=='undefined') playRole('menu');}catch(e){} render(btn.dataset.mapInfo);}));
})();


// R30 package cleanup: server status bar + document badges retained without legacy map DOM.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    function ensureStatusBar(){
      let bar=document.querySelector('.uac-server-statusbar');
      if(bar) return bar;
      bar=document.createElement('div');
      bar.className='uac-server-statusbar';
      bar.innerHTML='<span class="status-dot"></span><b>U.A.C ARCHIVE NODE</b><span class="status-field" data-srv-node>ONLINE</span><span class="status-field status-warn" data-srv-field>N.H.C FIELD LINK: LIMITED</span><span class="status-field" data-srv-trace>F.H.C TRACE: NONE</span><span class="status-field status-map" data-srv-map>MAP SYNC: STANDBY</span><span class="status-field" data-srv-integrity>RECORD INTEGRITY: 72%</span><span class="status-field status-breadcrumb" data-srv-breadcrumb>U.A.C ARCHIVE / HOME</span><span class="status-scroll" data-srv-notice>PROJECT CURSE / SCOPELOCKED SERVER</span>';
      document.body.prepend(bar);
      document.body.classList.add('has-uac-statusbar');
      return bar;
    }
    const statusBar=ensureStatusBar();
    function activeR24Region(){
      const root=document.querySelector('#zone-map .uac-r24-regional-map');
      return root ? (root.dataset.region||'world') : 'world';
    }
    function setStatus(mode){
      const map=statusBar.querySelector('[data-srv-map]');
      const trace=statusBar.querySelector('[data-srv-trace]');
      const notice=statusBar.querySelector('[data-srv-notice]');
      const crumb=statusBar.querySelector('[data-srv-breadcrumb]');
      const field=statusBar.querySelector('[data-srv-field]');
      const region=activeR24Region();
      const regionName={world:'GLOBAL',east:'EAST-ASIA',europe:'EUROPE',north:'NORTH-AMERICA',southasia:'SOUTH-ASIA',seindian:'SEA/INDIAN',oceania:'OCEANIA',mideast:'MIDDLE-EAST',africa:'AFRICA'}[region]||'GLOBAL';
      if(mode==='map'){
        if(map) map.textContent='MAP SYNC: ACTIVE / '+regionName;
        if(trace){trace.textContent='F.H.C TRACE: NONE'; trace.className='status-field';}
        if(field) field.textContent='N.H.C FIELD LINK: LIMITED';
        if(notice) notice.textContent='REGION MODULE R30 / FINAL PACKAGE READY';
        if(crumb) crumb.textContent='U.A.C ARCHIVE / 지역지도 / '+regionName;
      }else if(mode==='archive'){
        if(map) map.textContent='MAP SYNC: STANDBY';
        if(trace){trace.textContent='F.H.C TRACE: INDEX SCAN'; trace.className='status-field status-warn';}
        if(notice) notice.textContent='ARCHIVE INDEX OPEN / RECORD BADGES ACTIVE';
        if(crumb) crumb.textContent='U.A.C ARCHIVE / 기록보관서';
      }else if(mode==='faction'){
        if(map) map.textContent='MAP SYNC: STANDBY';
        if(trace){trace.textContent='RELATION TRACE: ACTIVE'; trace.className='status-field status-map';}
        if(notice) notice.textContent='FACTION NETWORK ANALYSIS MODULE';
        if(crumb) crumb.textContent='U.A.C ARCHIVE / 세력 분석';
      }else{
        if(map) map.textContent='MAP SYNC: STANDBY';
        if(trace){trace.textContent='F.H.C TRACE: NONE'; trace.className='status-field';}
        if(notice) notice.textContent='PROJECT CURSE / SCOPELOCKED SERVER';
        if(crumb) crumb.textContent='U.A.C ARCHIVE / HOME';
      }
    }
    function currentPage(){const a=document.querySelector('.content-page.active'); return a?a.id:(location.hash||'').replace('#','');}
    function updateStatus(){
      const id=currentPage();
      if(id==='zone-map') setStatus('map');
      else if(id==='archive-entry') setStatus('archive');
      else if(id==='faction-info'||id==='faction-relation') setStatus('faction');
      else setStatus('home');
    }
    document.querySelectorAll('.side-menu a[data-target]').forEach(a=>a.addEventListener('click',()=>setTimeout(updateStatus,90)));
    document.addEventListener('click',e=>{ if(e.target.closest && e.target.closest('.r24-region-tab,.r24-world-btn')) setTimeout(updateStatus,80); },true);
    window.addEventListener('hashchange',()=>setTimeout(updateStatus,90));
    setTimeout(updateStatus,160);
    const badgeMap=[
      {re:/F\.H\.C|Cults|극비|검열|보안/i, cls:'badge-blacktag', text:'BLACK TAG'},
      {re:/타락 개체|FCR|괴이|오염/i, cls:'badge-contaminated', text:'CONTAMINATED'},
      {re:/레드존|Redzone|NHC|봉쇄|현장/i, cls:'badge-restricted', text:'RESTRICTED'},
      {re:/사쿠마|실종|아마리온|부검|레드울프|회수|영상/i, cls:'badge-partial', text:'PARTIAL'},
      {re:/축복|유전자|병기/i, cls:'badge-redacted', text:'REDACTED'}
    ];
    document.querySelectorAll('.doc-card').forEach(card=>{
      if(card.querySelector('.doc-status-badge')) return;
      const text=card.textContent||'';
      const pick=badgeMap.find(b=>b.re.test(text))||{cls:'badge-verified',text:'VERIFIED'};
      const row=card.querySelector('.status-row')||card;
      const badge=document.createElement('span');
      badge.className='doc-status-badge '+pick.cls;
      badge.textContent=pick.text;
      row.appendChild(badge);
    });
  });
})();

// MapPatch5_SAFE_UI_REAPPLY: lightweight status/badge/loading/zoom-stage polish only.
window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch5:'Safe UI Reapply'});


// PATCH 5.1 — F.H.C restricted record effect. Narrow and non-destructive.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const FHC_RECORDS=new Set(['Cults_871104']);
    const FHC_CARD_RE=/F\.H\.C|극비 보안|Cults_871104|BLACK TAG/i;
    const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    function statusTrace(on){
      const trace=document.querySelector('[data-srv-trace]');
      const notice=document.querySelector('[data-srv-notice]');
      const integrity=document.querySelector('[data-srv-integrity]');
      document.body.classList.toggle('has-fhc-trace',!!on);
      if(trace){ trace.textContent=on?'F.H.C TRACE: ACTIVE':'F.H.C TRACE: INDEX SCAN'; trace.className='status-field status-warn'; }
      if(notice && on) notice.textContent='F.H.C INTERNAL ACCESS / PARTIAL RECORD RELEASED';
      if(integrity && on) integrity.textContent='RECORD INTEGRITY: 61%';
    }

    function enhanceCards(){
      document.querySelectorAll('.doc-card').forEach(card=>{
        if(card.dataset.fhc51Card) return;
        const text=card.textContent||'';
        if(!FHC_CARD_RE.test(text)) return;
        card.dataset.fhc51Card='1';
        card.classList.add('fhc-sealed-card');
        const row=card.querySelector('.status-row')||card;
        ['F.H.C SEALED','TRACE ENABLED'].forEach(label=>{
          if([...row.querySelectorAll('.fhc-card-chip')].some(x=>x.textContent===label)) return;
          const chip=document.createElement('span'); chip.className='fhc-card-chip'; chip.textContent=label; row.appendChild(chip);
        });
      });
    }

    function ensureAccessOverlay(){
      let el=document.querySelector('.fhc-access-overlay');
      if(el) return el;
      el=document.createElement('div');
      el.className='fhc-access-overlay';
      el.setAttribute('aria-hidden','true');
      el.innerHTML='<div class="top"><b>F.H.C INTERNAL ACCESS</b><span>RESTRICTED NODE</span></div>'+ 
        '<div class="grid"><span>CLEARANCE MISMATCH DETECTED</span><span>PARTIAL RECORD RELEASED</span><span>TRACE LOG ENABLED</span><span>BLACK TAG CROSS-CHECK</span></div><div class="bar"><i></i></div>';
      document.body.appendChild(el);
      return el;
    }
    let overlayTimer=null;
    function showFhcAccess(){
      const el=ensureAccessOverlay();
      clearTimeout(overlayTimer);
      el.classList.remove('hide');
      void el.offsetWidth;
      el.classList.add('show');
      overlayTimer=setTimeout(()=>{el.classList.add('hide'); el.classList.remove('show');},1540);
    }

    function addSecurityPanel(root){
      if(!root || root.querySelector('.fhc-security-panel')) return;
      const content=root.querySelector('.record-content')||root.querySelector('.doc-header')||root;
      const panel=document.createElement('div');
      panel.className='fhc-security-panel';
      panel.innerHTML='<div class="fhc-security-title">F.H.C RESTRICTED RECORD / 부분 공개 기록</div>'+ 
        '<div class="fhc-security-grid"><span><b>SECURITY</b>F.H.C RESTRICTED</span><span><b>ACCESS</b>PARTIAL</span><span><b>TRACE</b>ACTIVE</span><span><b>INTEGRITY</b>61%</span></div>'+ 
        '<div class="fhc-redact-note">※ 검열 구간은 원문 일부가 삭제된 상태로 표시된다.</div>';
      content.insertBefore(panel, content.firstChild);
    }

    function firstTextNode(el){
      const walker=document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
        acceptNode(node){
          if(!node.nodeValue || node.nodeValue.trim().length<28) return NodeFilter.FILTER_REJECT;
          const p=node.parentElement;
          if(!p || /SCRIPT|STYLE|BUTTON|FIGCAPTION/.test(p.tagName)) return NodeFilter.FILTER_REJECT;
          if(p.closest('.fhc-security-panel,.record-figure,.page-tabs,.sub-tabs,.doc-header')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      return walker.nextNode();
    }
    function insertInlineRedaction(el,idx){
      if(!el || el.dataset.fhc51Redacted) return false;
      const node=firstTextNode(el);
      if(!node) return false;
      const text=node.nodeValue;
      const len=text.length;
      if(len<34) return false;
      const minStart=Math.max(7,Math.floor(len*0.22));
      const maxStart=Math.max(minStart+1,Math.floor(len*0.56));
      let start=minStart+((idx*13)%Math.max(1,maxStart-minStart));
      const nearSpace=text.indexOf(' ',start);
      if(nearSpace>start && nearSpace<Math.min(len-8,start+9)) start=nearSpace+1;
      const redactLen=Math.max(5,Math.min(18,Math.floor(len*(0.13+(idx%3)*0.03)),len-start-5));
      if(redactLen<5) return false;
      const before=text.slice(0,start);
      const after=text.slice(start+redactLen);
      const frag=document.createDocumentFragment();
      if(before) frag.appendChild(document.createTextNode(before));
      const span=document.createElement('span');
      const maskLen=Math.max(5,Math.min(12,redactLen));
      span.className='fhc-redact-inline';
      span.setAttribute('data-mask','█'.repeat(maskLen));
      span.setAttribute('aria-label','F.H.C 삭제 구간');
      span.title='F.H.C 삭제 구간';
      frag.appendChild(span);
      if(after) frag.appendChild(document.createTextNode(after));
      node.parentNode.replaceChild(frag,node);
      el.dataset.fhc51Redacted='1';
      return true;
    }

    function applyRedactions(root){
      if(!root || root.dataset.fhc51Applied) return;
      root.dataset.fhc51Applied='1';
      root.classList.add('fhc-restricted-record');
      addSecurityPanel(root);
      const candidates=[...root.querySelectorAll('.record-page p, .record-page li, .record-page h3, .sub-page p, .sub-page li')]
        .filter(el=>{
          const t=(el.textContent||'').trim();
          if(t.length<30) return false;
          if(el.closest('.fhc-security-panel,.record-figure')) return false;
          return /우시노다|타락|혈교|의식|인신|괴이|변형|혈무|제물|오염|변이|피의|교단|존재|신자|현장|소각|봉쇄/.test(t);
        });
      let used=0;
      candidates.forEach((el,i)=>{
        if(used>=6) return;
        if(i%2===0 || /인신|혈무|피의|제물|오염/.test(el.textContent||'')){
          if(insertInlineRedaction(el,used)) used++;
        }
      });
    }

    function applyAll(){
      enhanceCards();
      document.querySelectorAll('.record-detail[data-record="Cults_871104"]').forEach(root=>applyRedactions(root));
    }
    applyAll();

    document.querySelectorAll('.open-record[data-record]').forEach(btn=>{
      btn.addEventListener('click',function(){
        if(FHC_RECORDS.has(btn.dataset.record)){
          // 5.1.1: separate F.H.C overlay disabled to avoid double-stacked loading screens.
          statusTrace(true);
          setTimeout(applyAll,260);
          setTimeout(applyAll,1200);
        }
      }, true);
    });
    document.querySelectorAll('.record-back').forEach(btn=>btn.addEventListener('click',function(){
      setTimeout(()=>{ document.body.classList.remove('has-fhc-trace'); },120);
    }, true));
    document.querySelectorAll('.side-menu a[data-target]').forEach(a=>a.addEventListener('click',function(){
      if(a.dataset.target!=='archive-entry') setTimeout(()=>document.body.classList.remove('has-fhc-trace'),120);
    }, true));
  });
})();


// PATCH 5.1.1 — F.H.C loading overlay unified and redactions now replace source text segments.
window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch511:'FHC Overlay/Redaction Tune'});


// PATCH 5.2 — Damaged video feed effects. Narrow scope: recovered video/tape records only.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const VIDEO_RECORDS=window.ProjectCurseVideoRecords || new Set(['Immortality_860201','Sakuma_Tape_991028','불명_Record1_860204']);
    const VIDEO_CARD_RE=/영상|비디오|Tape|Sakuma|사쿠마|아마리온 회수|감시 기록|현장 촬영/i;
    const esc=(v)=>String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    function videoStatus(on){
      document.body.classList.toggle('has-video-feed',!!on);
      const trace=document.querySelector('[data-srv-trace]');
      const notice=document.querySelector('[data-srv-notice]');
      const integrity=document.querySelector('[data-srv-integrity]');
      if(on){
        if(trace){ trace.textContent='VIDEO FEED: DAMAGED'; trace.className='status-field status-map'; }
        if(notice) notice.textContent='DAMAGED VIDEO FEED / FRAME INDEX RECOVERED / AUDIO CHANNEL DEGRADED';
        if(integrity) integrity.textContent='RECORD INTEGRITY: 58%';
      }
    }

    function classifyVideoRecord(root){
      const title=(root.querySelector('.doc-title')||{}).textContent||'';
      const code=(root.dataset||{}).record||'';
      if(code==='Immortality_860201') return {source:'U.A.C FIELD CAMERA / SIGNAL TEAM', video:'PARTIAL', audio:'DEGRADED', frame:'22% LOSS', signal:'BLOOD LAKE ORIGIN FILE'};
      if(code==='불명_Record1_860204') return {source:'F.H.C RECOVERED DEVICE', video:'PARTIAL', audio:'DEGRADED', frame:'31% LOSS', signal:'AMARION TRAINING CACHE'};
      if(code==='Sakuma_Tape_991028') return {source:'S.I.D FIELD CAMERA / RECOVERED TAPE', video:'PARTIAL', audio:'NOISY', frame:'18% LOSS', signal:'TOKYO OCCULT CASE FILE'};
      return {source:title||'RECOVERED DEVICE', video:'PARTIAL', audio:'DEGRADED', frame:'DETECTED', signal:'FIELD CAMERA CACHE'};
    }

    function addVideoPanel(root){
      if(!root || root.querySelector('.video-feed-panel')) return;
      const data=classifyVideoRecord(root);
      root.classList.add('damaged-video-record');
      const content=root.querySelector('.record-content')||root;
      const panel=document.createElement('div');
      panel.className='video-feed-panel';
      panel.innerHTML='<div class="video-feed-title"><b>DAMAGED VIDEO FEED</b><span>SIGNAL RECOVERY</span></div>'+ 
        '<div class="video-feed-grid"><span><b>SOURCE</b>'+esc(data.source)+'</span><span><b>VIDEO</b>'+esc(data.video)+'</span><span><b>AUDIO</b>'+esc(data.audio)+'</span><span><b>FRAME LOSS</b>'+esc(data.frame)+'</span></div>'+ 
        '<div class="video-feed-note">'+esc(data.signal)+' / 프레임 인덱스 일부 재구성 완료</div>';
      content.insertBefore(panel, content.firstChild);
    }

    function frameLabelFor(root){
      const code=(root&&root.dataset&&root.dataset.record)||'';
      if(code==='Sakuma_Tape_991028') return 'FRAME LOSS · 프레임 누락';
      if(code==='불명_Record1_860204') return 'SIGNAL CORRUPTED · 신호 손상';
      return 'VIDEO DAMAGE · 영상 손상';
    }

    function markVideoFrames(root){
      if(!root) return;
      const label=frameLabelFor(root);
      root.querySelectorAll('.record-figure').forEach((fig,i)=>{
        if(fig.dataset.video52Frame) return;
        fig.dataset.video52Frame='1';
        fig.classList.add('video-frame-loss');
        fig.setAttribute('data-frame-code', i===0 ? label : '');
        if(i>0) fig.classList.add('video-frame-subtle');
      });
    }

    function enhanceCards(){
      document.querySelectorAll('.doc-card').forEach(card=>{
        if(card.dataset.video52Card) return;
        const btn=card.querySelector('.open-record[data-record]');
        const id=btn?btn.dataset.record:'';
        const text=card.textContent||'';
        if(!VIDEO_RECORDS.has(id) && !VIDEO_CARD_RE.test(text)) return;
        card.dataset.video52Card='1';
        card.classList.add('video-damaged-card');
        const row=card.querySelector('.status-row')||card;
        ['VIDEO LOG','SIGNAL DAMAGED','FRAME LOSS'].forEach(label=>{
          if([...row.querySelectorAll('.video-card-chip')].some(x=>x.textContent===label)) return;
          const chip=document.createElement('span');
          chip.className='video-card-chip';
          chip.textContent=label;
          row.appendChild(chip);
        });
      });
    }

    function applyAll(){
      enhanceCards();
      VIDEO_RECORDS.forEach(id=>{
        document.querySelectorAll('.record-detail[data-record="'+id.replace(/"/g,'\\"')+'"]').forEach(root=>{
          addVideoPanel(root);
          markVideoFrames(root);
        });
      });
    }
    applyAll();

    document.querySelectorAll('.open-record[data-record]').forEach(btn=>{
      btn.addEventListener('click',function(){
        if(VIDEO_RECORDS.has(btn.dataset.record)){
          videoStatus(true);
          setTimeout(applyAll,220);
          setTimeout(applyAll,1150);
        }else{
          setTimeout(()=>document.body.classList.remove('has-video-feed'),160);
        }
      }, true);
    });
    document.querySelectorAll('.record-back').forEach(btn=>btn.addEventListener('click',function(){
      setTimeout(()=>document.body.classList.remove('has-video-feed'),120);
    }, true));
    document.querySelectorAll('.side-menu a[data-target]').forEach(a=>a.addEventListener('click',function(){
      if(a.dataset.target!=='archive-entry') setTimeout(()=>document.body.classList.remove('has-video-feed'),120);
    }, true));
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch52:'Damaged Video Feed'});


window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch521:'Video Feed Layout Tuning', patch522:'Video Feed Layout/Label Fix'});


// PATCH 5.3 — Entity biological scan effects. Narrow scope: entity/autopsy/gene reports only.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const BIO_RECORDS=window.ProjectCurseBioRecords || new Set(['타락 개체_860722','FCR_Archive_890402','불명_Record2_860205','불명_Record5_940626']);
    const BIO_CARD_RE=/타락 개체|개체 분류|부검|유전자|괴이 유전자|Queen-Type|미믹|혼합 개체|상위 개체/i;
    const esc=(v)=>String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    const profiles={
      '타락 개체_860722':{cls:'CORRUPTED ENTITY',ko:'타락 개체 분류',cont:'HIGH',react:'UNSTABLE',intel:'LOW / VARIABLE',threat:'RED',trace:'ENTITY SCAN · 개체 분석'},
      'FCR_Archive_890402':{cls:'MIXED / MIMIC / COMMAND-REACTIVE',ko:'추가 분류 보고',cont:'VARIABLE',react:'COMMAND RESPONSE',intel:'PARTIAL',threat:'BLACK',trace:'TRACE MATCH · 흔적 대조'},
      '불명_Record2_860205':{cls:'AUTOPSY SAMPLE / BL-088',ko:'생체 오염 부검',cont:'CRITICAL',react:'POST-MORTEM ACTIVE',intel:'NONE',threat:'RED',trace:'TISSUE CHECK · 조직 대조'},
      '불명_Record5_940626':{cls:'GENE TRACE / FORCED EVOLUTION',ko:'비인가 유전자 기록',cont:'BIOHAZARD',react:'SYNTHETIC',intel:'UNKNOWN',threat:'BLACK',trace:'GENE SCAN · 유전자 대조'}
    };
    function profile(root){return profiles[root && root.dataset ? root.dataset.record : ''] || {cls:'ENTITY FILE',ko:'개체 기록',cont:'UNKNOWN',react:'VARIABLE',intel:'UNKNOWN',threat:'WATCH',trace:'ENTITY SCAN · 개체 분석'};}

    function bioStatus(on){
      document.body.classList.toggle('has-bio-scan',!!on);
      const trace=document.querySelector('[data-srv-trace]');
      const notice=document.querySelector('[data-srv-notice]');
      const integrity=document.querySelector('[data-srv-integrity]');
      if(on){
        if(trace){ trace.textContent='BIO SCAN: ACTIVE'; trace.className='status-field status-map'; }
        if(notice) notice.textContent='BIOLOGICAL TRACE SCAN / ENTITY CLASSIFICATION / HOST RESPONSE INDEX';
        if(integrity) integrity.textContent='RECORD INTEGRITY: 64%';
      }
    }

    function addBioPanel(root){
      if(!root || root.querySelector('.bio-scan-panel')) return;
      const data=profile(root);
      root.classList.add('bio-scan-record');
      const content=root.querySelector('.record-content')||root;
      const panel=document.createElement('div');
      panel.className='bio-scan-panel';
      panel.innerHTML='<div class="bio-scan-title"><b>BIOLOGICAL TRACE SCAN</b><span>'+esc(data.ko)+'</span></div>'+
        '<div class="bio-scan-grid"><span><b>ENTITY CLASS</b>'+esc(data.cls)+'</span><span><b>CONTAMINATION</b>'+esc(data.cont)+'</span><span><b>REACTIVITY</b>'+esc(data.react)+'</span><span><b>THREAT LEVEL</b>'+esc(data.threat)+'</span></div>'+
        '<div class="bio-scan-note">HOST REACTION INDEX / '+esc(data.intel)+' / 본문 변조 없음</div>';
      content.insertBefore(panel, content.firstChild);
    }

    function markBioFrames(root){
      if(!root) return;
      const data=profile(root);
      const figs=Array.from(root.querySelectorAll('.record-figure'));
      figs.forEach((fig,i)=>{
        if(fig.classList.contains('video-frame-loss') || fig.dataset.bio53Frame) return;
        fig.dataset.bio53Frame='1';
        fig.classList.add('bio-scan-frame');
        fig.setAttribute('data-bio-code', i===0 ? data.trace : '');
        if(i>0) fig.classList.add('bio-scan-subtle');
      });
    }

    function enhanceCards(){
      document.querySelectorAll('.doc-card').forEach(card=>{
        if(card.dataset.bio53Card) return;
        const btn=card.querySelector('.open-record[data-record]');
        const id=btn?btn.dataset.record:'';
        const text=card.textContent||'';
        if(!BIO_RECORDS.has(id) && !BIO_CARD_RE.test(text)) return;
        card.dataset.bio53Card='1';
        card.classList.add('bio-scan-card');
        const row=card.querySelector('.status-row')||card;
        const labels=id==='FCR_Archive_890402'?['ENTITY FILE','MIMIC TRACE','CLASSIFIED']:
          id==='불명_Record2_860205'?['AUTOPSY','BIO SCAN','CONTAMINATION']:
          id==='불명_Record5_940626'?['GENE TRACE','BIOHAZARD','CLASSIFIED']:
          ['ENTITY FILE','BIO SCAN','CONTAMINATED'];
        labels.forEach(label=>{
          if([...row.querySelectorAll('.bio-card-chip')].some(x=>x.textContent===label)) return;
          const chip=document.createElement('span');
          chip.className='bio-card-chip';
          chip.textContent=label;
          row.appendChild(chip);
        });
      });
    }

    function applyAll(){
      enhanceCards();
      BIO_RECORDS.forEach(id=>{
        document.querySelectorAll('.record-detail[data-record="'+id.replace(/"/g,'\\"')+'"]').forEach(root=>{
          addBioPanel(root);
          markBioFrames(root);
        });
      });
    }
    applyAll();

    document.querySelectorAll('.open-record[data-record]').forEach(btn=>{
      btn.addEventListener('click',function(){
        if(BIO_RECORDS.has(btn.dataset.record)){
          bioStatus(true);
          setTimeout(applyAll,220);
          setTimeout(applyAll,1150);
        }else{
          setTimeout(()=>document.body.classList.remove('has-bio-scan'),160);
        }
      }, true);
    });
    document.querySelectorAll('.record-back').forEach(btn=>btn.addEventListener('click',function(){
      setTimeout(()=>document.body.classList.remove('has-bio-scan'),120);
    }, true));
    document.querySelectorAll('.side-menu a[data-target]').forEach(a=>a.addEventListener('click',function(){
      if(a.dataset.target!=='archive-entry') setTimeout(()=>document.body.classList.remove('has-bio-scan'),120);
    }, true));
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch53:'Entity Bio Scan Report'});

// PATCH 5.4 — faction relation trace + record surface transition effects.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const audioKey='pc_audio_legacy2003_fixed';
    let ctx=null;
    function audioEnabled(){ return localStorage.getItem(audioKey)!=='off'; }
    function tone(freq=520,dur=0.055,vol=0.018,type='square'){
      if(!audioEnabled()) return;
      try{
        const AC=window.AudioContext||window.webkitAudioContext;
        if(!AC) return;
        ctx=ctx||new AC();
        if(ctx.state==='suspended') ctx.resume().catch(()=>{});
        const o=ctx.createOscillator();
        const g=ctx.createGain();
        o.type=type;
        o.frequency.setValueAtTime(freq,ctx.currentTime);
        g.gain.setValueAtTime(0.0001,ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(Math.max(vol,0.0002),ctx.currentTime+0.01);
        g.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+dur);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur+0.02);
      }catch(e){}
    }
    function pulse(kind){
      if(kind==='hostile'){ tone(180,.08,.024,'sawtooth'); setTimeout(()=>tone(360,.045,.014,'square'),80); return; }
      if(kind==='surface'){ tone(620,.04,.012,'triangle'); setTimeout(()=>tone(780,.035,.010,'triangle'),55); return; }
      tone(440,.055,.016,'square'); setTimeout(()=>tone(660,.035,.010,'triangle'),65);
    }

    const keyAliases={
      uac:['U.A.C','UAC','중앙 통제'],
      nhc:['N.H.C','NHC','현장 작전'],
      sid:['S.I.D','SID','조사'],
      fhc:['F.H.C','FHC','극비 연구'],
      amarion:['Amarion','아마리온'],
      syndicate:['Syndicate','신디케이트'],
      ushinoda:['Ushnoda','우시노다'],
      haimun:['Haimun','하이문'],
      ashcrew:['Ash Crew','오염 처리'],
      arf:['A.R.F','ARF','회수'],
      cpd:['C.P.D','CPD','민간 보호']
    };
    const traceProfiles={
      uac:{name:'U.A.C',type:'CENTRAL CONTROL',status:'통제 / 기관 조율',threat:'중앙 노드',contact:'N.H.C · S.I.D · C.P.D · F.H.C 감시망 연결',kind:'control'},
      nhc:{name:'N.H.C',type:'FIELD OPERATION',status:'현장 작전 협력',threat:'레드존 전투 대응',contact:'U.A.C 명령 수신 / A.R.F·Ash Crew 후속 처리 / Syndicate 추적',kind:'friendly'},
      sid:{name:'S.I.D',type:'INVESTIGATION TRACE',status:'조사 / 감시',threat:'오컬트 사건 추적',contact:'Ushnoda Cult·Haimun 추적 / U.A.C 기록 공유',kind:'watch'},
      fhc:{name:'F.H.C',type:'RESEARCH NODE',status:'연구 의존 / 상호 감시',threat:'자료 은폐 가능성',contact:'U.A.C 감시망 / Amarion 연구 연결',kind:'research'},
      amarion:{name:'Amarion',type:'PRIVATE RESEARCH',status:'협력 기업 / 감시 대상',threat:'비인가 생체 실험 의혹',contact:'F.H.C 연구망과 연결',kind:'research'},
      syndicate:{name:'Syndicate',type:'HOSTILE NETWORK',status:'적대 / 추적',threat:'이탈 전투조직 통합',contact:'N.H.C·U.A.C 추적 대상',kind:'hostile'},
      ushinoda:{name:'Ushnoda Cult',type:'RITUAL HOSTILE',status:'의식 범죄 / 오염 확산',threat:'블랙 태그 후보',contact:'S.I.D 감시 / Haimun 하위 위험 연결',kind:'hostile'},
      haimun:{name:'Haimun',type:'URBAN INFILTRATION',status:'도심 침투 / 납치 / 의식',threat:'레드존 확산 연결',contact:'Ushnoda Cult 하위 위험망',kind:'ritual'},
      ashcrew:{name:'Ash Crew',type:'AFTER-ACTION CLEANUP',status:'오염 처리 / 소각',threat:'블랙 태그 처리',contact:'N.H.C 후속 처리망',kind:'friendly'},
      arf:{name:'A.R.F',type:'RECOVERY FORCE',status:'회수 지원',threat:'샘플·기록 매체 회수',contact:'N.H.C 확보 이후 진입',kind:'friendly'},
      cpd:{name:'C.P.D',type:'CIVILIAN CONTROL',status:'민간 통제 / 검문',threat:'피난민 선별',contact:'U.A.C 행정 통제 / 대피 지원',kind:'friendly'}
    };
    function keyFromText(text){
      const t=String(text||'').toLowerCase();
      for(const [key,aliases] of Object.entries(keyAliases)){
        if(aliases.some(a=>t.includes(String(a).toLowerCase()))) return key;
      }
      return '';
    }
    function nodeKey(node){
      return node.dataset.factionKey || keyFromText([node.querySelector('b')?.textContent,node.querySelector('img')?.alt,node.textContent].join(' '));
    }
    function ensureRelationPanel(section){
      let panel=section.querySelector('.relation-trace-panel');
      if(panel) return panel;
      panel=document.createElement('div');
      panel.className='relation-trace-panel';
      panel.innerHTML='<div class="trace-head"><b>FACTION TRACE</b><span>NODE STANDBY</span></div><div class="trace-grid"><span><b>FOCUS</b><i data-trace-name>U.A.C</i></span><span><b>RELATION STATUS</b><i data-trace-status>중앙 통제</i></span><span><b>THREAT INDEX</b><i data-trace-threat>중앙 노드</i></span><span><b>CONTACT HISTORY</b><i data-trace-contact>세력 마크를 선택하십시오.</i></span></div>';
      const tree=section.querySelector('.relation-tree-panel');
      if(tree) tree.insertAdjacentElement('beforebegin',panel); else section.appendChild(panel);
      return panel;
    }
    function markRelationTree(){
      const section=document.getElementById('faction-relation');
      if(!section) return;
      const panel=ensureRelationPanel(section);
      const nodes=Array.from(section.querySelectorAll('.tree-node'));
      nodes.forEach(n=>{
        const k=nodeKey(n); if(!k) return;
        n.dataset.factionKey=k;
        n.setAttribute('role','button');
        n.setAttribute('tabindex','0');
        n.setAttribute('aria-label',(traceProfiles[k]?.name||k)+' 관계 추적');
      });
      section.querySelectorAll('.tree-branch,.tree-child').forEach(block=>{
        const keys=Array.from(block.querySelectorAll('.tree-node')).map(nodeKey).filter(Boolean);
        block.dataset.relationKeys=Array.from(new Set(keys)).join(' ');
      });
      function update(key){
        const info=traceProfiles[key]||traceProfiles.uac;
        section.classList.add('relation-trace-active');
        section.dataset.traceKind=info.kind||'control';
        section.dataset.traceFocus=key;
        nodes.forEach(n=>{
          const k=nodeKey(n);
          const related=key==='uac' ? true : (k===key || (n.closest('.tree-branch,.tree-child')?.dataset.relationKeys||'').split(/\s+/).includes(key));
          n.classList.toggle('rel-selected',k===key);
          n.classList.toggle('rel-related',related && k!==key);
          n.classList.toggle('rel-muted',!related);
        });
        section.querySelectorAll('.tree-branch,.tree-child').forEach(block=>{
          const keys=(block.dataset.relationKeys||'').split(/\s+/).filter(Boolean);
          const active=key==='uac' || keys.includes(key);
          block.classList.toggle('rel-path-active',active);
          block.classList.toggle('rel-path-muted',!active);
        });
        section.querySelectorAll('.relation-table tbody tr').forEach(row=>{
          const tx=row.textContent||'';
          const active=key==='uac' ? /U\.A\.C|UAC/.test(tx) : (keyAliases[key]||[]).some(a=>tx.includes(a));
          row.classList.toggle('relation-row-active',active);
          row.classList.toggle('relation-row-muted',!active);
        });
        panel.querySelector('[data-trace-name]').textContent=info.name+' / '+info.type;
        panel.querySelector('[data-trace-status]').textContent=info.status;
        panel.querySelector('[data-trace-threat]').textContent=info.threat;
        panel.querySelector('[data-trace-contact]').textContent=info.contact;
        panel.querySelector('.trace-head span').textContent='NODE: '+info.name+' / TRACE ACTIVE';
        const notice=document.querySelector('[data-srv-notice]');
        const trace=document.querySelector('[data-srv-trace]');
        if(notice) notice.textContent='FACTION TRACE / '+info.name+' / '+info.status;
        if(trace){ trace.textContent='RELATION TRACE: '+info.name; trace.className='status-field status-map'; }
        pulse(info.kind==='hostile'||info.kind==='ritual'?'hostile':'relation');
      }
      nodes.forEach(n=>{
        if(n.dataset.trace54Bound) return;
        n.dataset.trace54Bound='1';
        n.addEventListener('click',()=>update(nodeKey(n)||'uac'));
        n.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault(); update(nodeKey(n)||'uac');} });
      });
      update('uac');
    }

    function addFactionInfoPulse(){
      const detail=document.getElementById('factionDetail');
      document.querySelectorAll('.faction-tile').forEach(tile=>{
        if(tile.dataset.trace54InfoBound) return;
        tile.dataset.trace54InfoBound='1';
        tile.addEventListener('click',()=>{
          pulse('relation');
          if(!detail) return;
          detail.classList.remove('faction-detail-loading');
          void detail.offsetWidth;
          detail.classList.add('faction-detail-loading');
          setTimeout(()=>detail.classList.remove('faction-detail-loading'),720);
        },true);
      });
    }

    function ensureSurfaceLoader(box){
      let el=box.querySelector(':scope > .record-surface-loader');
      if(el) return el;
      el=document.createElement('div');
      el.className='record-surface-loader';
      el.innerHTML='<div><b>RECORD SURFACE REMAP</b><span>INDEX PAGE SWITCH / SECTOR VERIFY / LOCAL CACHE READY</span><i></i></div>';
      box.appendChild(el);
      return el;
    }
    function surfaceFx(btn){
      const box=btn.closest('.paged-record,.nested-record,.record-content');
      if(!box) return;
      const el=ensureSurfaceLoader(box);
      const title=String(btn.textContent||'기록면').trim();
      el.querySelector('b').textContent='RECORD SURFACE: '+title;
      el.querySelector('span').textContent='기록면 색인 재정렬 / 페이지 섹터 확인 / 열람 권한 유지';
      box.classList.remove('record-surface-active');
      el.classList.remove('show');
      void box.offsetWidth;
      box.classList.add('record-surface-active');
      el.classList.add('show');
      pulse('surface');
      setTimeout(()=>{ el.classList.remove('show'); box.classList.remove('record-surface-active'); },820);
    }
    function bindRecordSurfaceTabs(){
      document.querySelectorAll('.page-tab,.sub-tab').forEach(btn=>{
        if(btn.dataset.surface54Bound) return;
        btn.dataset.surface54Bound='1';
        btn.addEventListener('click',()=>surfaceFx(btn),true);
      });
    }

    markRelationTree();
    addFactionInfoPulse();
    bindRecordSurfaceTabs();
    setTimeout(()=>{markRelationTree(); addFactionInfoPulse(); bindRecordSurfaceTabs();},600);
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch54:'Faction Relation Trace + Record Surface Transition'});


// R30 package cleanup: obsolete 5.5~5.6.1 legacy zoom/drag regional-map runtime removed.


// R30 package cleanup: obsolete 5.6 legacy map codebook/readability block removed.

// PATCH 5.6.2 — ArchiveTransitionCleanup
// Scope: archive transition separation. Legacy map residual logic removed in R30.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
    function ensureToast(){
      let t=document.querySelector('.pc562-archive-toast');
      if(t) return t;
      t=document.createElement('div');
      t.className='pc562-archive-toast';
      t.innerHTML='<b></b><span></span><i></i>';
      document.body.appendChild(t);
      return t;
    }
    let toastTimer=0;
    function archiveToast(title,body){
      const t=ensureToast();
      t.querySelector('b').textContent=title||'ARCHIVE SURFACE OPEN';
      t.querySelector('span').textContent=body||'기록 보관면 상태를 갱신합니다.';
      t.classList.remove('show');
      void t.offsetWidth;
      t.classList.add('show');
      document.body.classList.add('pc562-archive-active');
      clearTimeout(toastTimer);
      toastTimer=setTimeout(()=>{t.classList.remove('show');document.body.classList.remove('pc562-archive-active');},940);
    }
    // 5.8.1R-1: archive toast dedup.
    // Menu entry uses the compact pc564 notice; page tabs use the internal record-surface loader;
    // individual records keep the existing full record-loading panel only.
    document.querySelectorAll('.side-menu a[data-target="archive-entry"],.page-tab,.sub-tab,.open-record[data-record],.record-back').forEach(el=>{
      el.dataset.pc562ArchiveSuppressed='1';
    });

    // R30 package cleanup: legacy regional-map residual overlay cleanup removed.
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch562:'Archive Transition Cleanup + Map Residual Overlay Fix'});


// PATCH 5.6.3 — FactionRelationVisualUpgrade
// U.A.C centered radial relation matrix, status tags, richer analysis panel, and row/node focus sync.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const section=document.getElementById('faction-relation');
    if(!section || section.dataset.pc563Ready) return;
    section.dataset.pc563Ready='1';
    section.classList.add('pc563-faction-relation');

    const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const prefix=(document.body&&document.body.dataset&&document.body.dataset.basePath)||'';

    const statusClass={
      '통제':'control','감시':'watch','적대':'hostile','불명':'unknown','비공식 접촉':'informal','협력':'control','연구':'watch'
    };
    const nodes={
      uac:{name:'U.A.C',img:'uac.webp',tag:'통제',role:'상위 조정기관',x:50,y:50,summary:'권역 등급, 기록 통제, 현장 투입 기준을 하나의 관제망으로 묶는 중심 노드.'},
      nhc:{name:'N.H.C',img:'nhc.webp',tag:'통제',role:'현장 작전',x:50,y:16,summary:'레드존과 블랙존 인접 구역에 투입되는 고위험 현장 대응 조직.'},
      sid:{name:'S.I.D',img:'sid.webp',tag:'감시',role:'특수 조사',x:78,y:30,summary:'실종, 오컬트 범죄, 의식 흔적, 이상현상 전조를 추적하는 조사 기관.'},
      fhc:{name:'F.H.C',img:'fhc.webp',tag:'감시',role:'극비 연구',x:78,y:70,summary:'초상 기술과 생체 샘플을 분석하지만 은폐 가능성 때문에 감시가 유지되는 연구 노드.'},
      amarion:{name:'Amarion',img:'amarion.webp',tag:'비공식 접촉',role:'민간 연구망',x:65,y:87,summary:'F.H.C 연구망과 연결된 제약·생명공학 조직. 협력과 위험이 동시에 기록된다.'},
      syndicate:{name:'Syndicate',img:'syndicate.webp',tag:'적대',role:'이탈 네트워크',x:35,y:87,summary:'비공식 무장 네트워크. 레드울프 계열 이탈 기록과 연결된 추적 대상.'},
      ushinoda:{name:'Ushnoda Cult',img:'ushinoda.webp',tag:'적대',role:'의식 범죄',x:22,y:70,summary:'의식성 오염, 인신공양, 블랙존화 징후와 직접 연결되는 핵심 적대 세력.'},
      haimun:{name:'Haimun',img:'haimun.webp',tag:'불명',role:'도심 침투',x:22,y:30,summary:'도심권 납치와 의식 흔적에 반복적으로 등장하지만 지휘 구조는 불명으로 남아 있다.'},
      arf:{name:'A.R.F',img:'arf.webp',tag:'통제',role:'회수 부대',x:34,y:17,summary:'N.H.C가 확보한 현장에 후속 진입하여 생존자, 샘플, 기록 매체를 회수한다.'},
      ashcrew:{name:'Ash Crew',img:'ashcrew.webp',tag:'통제',role:'오염 처리',x:66,y:17,summary:'오염 사체, 장비, 잔류물을 봉인·회수·소각하는 N.H.C 후속 처리반.'},
      cpd:{name:'C.P.D',img:'cpd.webp',tag:'감시',role:'민간 통제',x:14,y:50,summary:'검문, 피난민 분리, 귀환자 선별 같은 민간 통제 축을 담당한다. C.P.D 대피버스는 관계도 노드에서 제외한다.'}
    };
    const edges=[
      {a:'uac',b:'nhc',type:'command',label:'작전 통제',desc:'U.A.C가 구역 정보와 봉쇄 명령을 제공하고 N.H.C가 현장 진입을 수행한다.'},
      {a:'uac',b:'sid',type:'watch',label:'조사 감시',desc:'S.I.D는 현장 조사와 기록을 U.A.C 관제망으로 송신한다.'},
      {a:'uac',b:'fhc',type:'watch',label:'상호 감시',desc:'F.H.C 연구 자료는 필요하지만 은폐 위험 때문에 U.A.C 감시가 유지된다.'},
      {a:'uac',b:'cpd',type:'command',label:'민간 통제',desc:'C.P.D는 검문과 대피 통제를 수행하되 U.A.C 행정 명령 아래 움직인다.'},
      {a:'nhc',b:'arf',type:'command',label:'후속 회수',desc:'현장 확보 이후 A.R.F가 생존자와 자료를 회수한다.'},
      {a:'nhc',b:'ashcrew',type:'command',label:'오염 처리',desc:'Ash Crew는 전투 후 남은 오염 잔류물을 봉인하거나 소각한다.'},
      {a:'nhc',b:'syndicate',type:'hostile',label:'이탈 추적',desc:'신디케이트 내부 레드울프 계열은 N.H.C 이탈 기록과 연결된다.'},
      {a:'sid',b:'ushinoda',type:'hostile',label:'의식 추적',desc:'우시노다교는 S.I.D가 추적하는 핵심 의식 범죄 세력이다.'},
      {a:'ushinoda',b:'haimun',type:'ritual',label:'도심 침투',desc:'하이문은 우시노다교의 도심 침투와 납치, 의식 흔적에 연결된다.'},
      {a:'fhc',b:'amarion',type:'informal',label:'연구 연결',desc:'아마리온은 F.H.C 연구망과 접촉하지만 비인가 실험 때문에 별도 감시된다.'},
      {a:'fhc',b:'syndicate',type:'informal',label:'비공식 접촉',desc:'자금·용병·실험 자료 흐름에서 비공식 접촉 가능성이 남아 있다.'},
      {a:'uac',b:'ushinoda',type:'hostile',label:'적대 차단',desc:'U.A.C 관제망의 최종 목적은 의식성 오염과 블랙존 확산 차단이다.'}
    ];
    const relatedMap={};
    Object.keys(nodes).forEach(k=>relatedMap[k]=new Set([k]));
    edges.forEach(e=>{relatedMap[e.a].add(e.b);relatedMap[e.b].add(e.a);});

    function lineSvg(){
      const line=(e)=>{
        const a=nodes[e.a],b=nodes[e.b];
        return '<line class="pc563-edge pc563-edge-'+esc(e.type)+'" data-edge-a="'+esc(e.a)+'" data-edge-b="'+esc(e.b)+'" x1="'+a.x+'" y1="'+a.y+'" x2="'+b.x+'" y2="'+b.y+'"><title>'+esc(e.label+' / '+e.desc)+'</title></line>';
      };
      return '<svg class="pc563-radial-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">'
        +'<defs><radialGradient id="pc563Core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#8ed9e9" stop-opacity=".22"/><stop offset="60%" stop-color="#8ed9e9" stop-opacity=".045"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient></defs>'
        +'<circle cx="50" cy="50" r="16" class="pc563-ring pc563-ring-core"/><circle cx="50" cy="50" r="30" class="pc563-ring"/><circle cx="50" cy="50" r="43" class="pc563-ring pc563-ring-outer"/><circle cx="50" cy="50" r="48" fill="url(#pc563Core)"/>'
        +edges.map(line).join('')+'</svg>';
    }
    function nodeHtml(key){
      const n=nodes[key];
      const cls=statusClass[n.tag]||'unknown';
      return '<button class="pc563-node pc563-status-'+cls+(key==='uac'?' pc563-uac':'')+'" type="button" data-faction-key="'+esc(key)+'" style="left:'+n.x+'%;top:'+n.y+'%" aria-label="'+esc(n.name)+' 관계 분석">'
        +'<img src="'+esc(prefix)+'assets/faction_marks/'+esc(n.img)+'" alt="'+esc(n.name)+'"/>'
        +'<b>'+esc(n.name)+'</b><small>'+esc(n.role)+'</small><span class="pc563-tag">'+esc(n.tag)+'</span>'
        +'</button>';
    }
    function render(){
      const tree=section.querySelector('.relation-tree-panel');
      if(!tree) return;
      tree.classList.add('pc563-radial-panel');
      tree.setAttribute('aria-label','U.A.C 중심 360도 세력 관계도');
      const order=['nhc','arf','ashcrew','sid','fhc','amarion','syndicate','ushinoda','haimun','cpd','uac'];
      tree.innerHTML='<div class="pc563-relation-matrix">'
        +'<div class="pc563-matrix-title"><b>RELATION TRACE MATRIX</b><span>U.A.C 중심 관계 추적 행렬 / 감시·통제·적대 경로 분리</span></div>'
        +lineSvg()+order.map(nodeHtml).join('')+'</div>';
      const brief=section.querySelector('.section-brief');
      if(brief){
        brief.innerHTML='U.A.C 관계도는 조직의 우호 여부를 단순히 나열하지 않는다. 현장 통제, 감시 의존, 연구 불신, 비공식 접촉, 의식성 적대 경로를 하나의 추적 행렬로 묶어 표시한다. 선택한 노드와 직접 연결된 경로만 밝게 유지되며, 나머지는 관제망 뒤편으로 후퇴한다.';
      }
      const cap=section.querySelector('.map-caption');
      if(cap){
        cap.textContent='관계도는 기관·세력 단위만 표시한다. 차량, 장비, 대피버스, 지도 마커는 관계도 노드에서 제외한다.';
      }
      let strip=section.querySelector('.pc563-status-strip');
      if(!strip){
        strip=document.createElement('div');
        strip.className='pc563-status-strip';
        strip.innerHTML=['통제','감시','적대','불명','비공식 접촉'].map(s=>'<span class="pc563-mini-status pc563-status-'+(statusClass[s]||'unknown')+'">'+esc(s)+'</span>').join('');
        section.querySelector('.relation-legend')?.insertAdjacentElement('afterend',strip);
      }
    }
    function ensurePanel(){
      let p=section.querySelector('.pc563-analysis-panel');
      if(p) return p;
      p=document.createElement('div');
      p.className='pc563-analysis-panel';
      p.innerHTML='<div class="pc563-analysis-head"><b>TRACE ANALYSIS</b><span data-pc563-panel-state>NODE STANDBY</span></div><div class="pc563-analysis-grid"><span><b>선택 세력</b><i data-pc563-name>U.A.C</i></span><span><b>상태 태그</b><i data-pc563-status>통제</i></span><span><b>직접 연결</b><i data-pc563-links>N.H.C / S.I.D / F.H.C</i></span><span class="wide"><b>분석</b><i data-pc563-summary>중앙 통제 노드 대기 중.</i></span></div><div class="pc563-edge-note" data-pc563-edge-note>관계선을 선택하거나 세력 노드를 선택하십시오.</div>';
      const tree=section.querySelector('.relation-tree-panel');
      if(tree) tree.insertAdjacentElement('afterend',p); else section.appendChild(p);
      return p;
    }
    function edgeTextFor(key){
      return edges.filter(e=>e.a===key||e.b===key).map(e=>nodes[e.a===key?e.b:e.a].name+' · '+e.label).join(' / ') || '직접 연결 없음';
    }
    function pulseTone(kind){
      // Keep temporary node click tone only; full audio mix remains postponed.
      try{
        const audioKey='pc_audio_legacy2003_fixed';
        if(localStorage.getItem(audioKey)==='off') return;
        const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
        const ctx=window.__pc563AudioCtx||(window.__pc563AudioCtx=new AC());
        if(ctx.state==='suspended') ctx.resume().catch(()=>{});
        const o=ctx.createOscillator(), g=ctx.createGain(), f=kind==='hostile'?190:kind==='informal'?330:460;
        o.type=kind==='hostile'?'sawtooth':'triangle';
        o.frequency.setValueAtTime(f,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(f*1.35,ctx.currentTime+.075);
        g.gain.setValueAtTime(.0001,ctx.currentTime); g.gain.exponentialRampToValueAtTime(.018,ctx.currentTime+.012); g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.105);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+.13);
      }catch(e){}
    }
    function focus(key,opts={}){
      if(!nodes[key]) key='uac';
      const n=nodes[key];
      const related=relatedMap[key]||new Set([key]);
      section.dataset.pc563Focus=key;
      section.dataset.pc563Status=statusClass[n.tag]||'unknown';
      section.querySelectorAll('.pc563-node').forEach(btn=>{
        const k=btn.dataset.factionKey;
        btn.classList.toggle('pc563-selected',k===key);
        btn.classList.toggle('pc563-related',k!==key && related.has(k));
        btn.classList.toggle('pc563-muted',!related.has(k));
      });
      section.querySelectorAll('.pc563-edge').forEach(line=>{
        const a=line.dataset.edgeA,b=line.dataset.edgeB;
        const active=(a===key||b===key||key==='uac');
        line.classList.toggle('pc563-edge-active',active);
        line.classList.toggle('pc563-edge-muted',!active);
      });
      const panel=ensurePanel();
      panel.querySelector('[data-pc563-name]').textContent=n.name+' / '+n.role;
      panel.querySelector('[data-pc563-status]').textContent=n.tag;
      panel.querySelector('[data-pc563-links]').textContent=edgeTextFor(key);
      panel.querySelector('[data-pc563-summary]').textContent=n.summary;
      panel.querySelector('[data-pc563-panel-state]').textContent='NODE: '+n.name+' / TRACE ACTIVE';
      const edgeNote=edges.filter(e=>e.a===key||e.b===key).slice(0,3).map(e=>'['+e.label+'] '+e.desc).join('  ');
      panel.querySelector('[data-pc563-edge-note]').textContent=edgeNote||'선택 노드 주변 관계 자료 부족.';
      section.querySelectorAll('.relation-table tbody tr').forEach(row=>{
        const tx=row.textContent||'';
        const name=n.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
        const active=key==='uac' ? /U\.A\.C|UAC/.test(tx) : (tx.includes(n.name)||tx.includes(n.name.replace(' Cult',''))||tx.includes(n.role));
        row.classList.toggle('relation-row-active',active);
        row.classList.toggle('relation-row-muted',!active);
      });
      const notice=document.querySelector('[data-srv-notice]');
      const trace=document.querySelector('[data-srv-trace]');
      if(notice) notice.textContent='RELATION TRACE MATRIX / '+n.name+' / '+n.tag;
      if(trace){ trace.textContent='RELATION TRACE MATRIX: '+n.name; trace.className='status-field status-map'; }
      if(!opts.silent) pulseTone((statusClass[n.tag]||'control'));
    }
    function bind(){
      section.querySelectorAll('.pc563-node').forEach(btn=>{
        if(btn.dataset.pc563Bound) return;
        btn.dataset.pc563Bound='1';
        btn.addEventListener('click',()=>focus(btn.dataset.factionKey));
        btn.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault(); focus(btn.dataset.factionKey);} });
      });
      section.querySelectorAll('.relation-table tbody tr').forEach(row=>{
        if(row.dataset.pc563Bound) return;
        row.dataset.pc563Bound='1';
        row.setAttribute('tabindex','0');
        row.addEventListener('click',()=>{
          const tx=row.textContent||'';
          const k=Object.keys(nodes).find(key=>tx.includes(nodes[key].name)||tx.includes(nodes[key].name.replace(' Cult',''))||tx.includes(nodes[key].role));
          if(k) focus(k);
        });
      });
      document.querySelectorAll('.side-menu a[data-target="faction-relation"]').forEach(a=>{
        if(a.dataset.pc563Menu) return;
        a.dataset.pc563Menu='1';
        a.addEventListener('click',()=>{
          const notice=document.querySelector('[data-srv-notice]');
          const trace=document.querySelector('[data-srv-trace]');
          if(notice) notice.textContent='RELATION TRACE MATRIX / 중심 기관 확인: U.A.C / 경로 분리';
          if(trace){ trace.textContent='RELATION TRACE MATRIX: ONLINE'; trace.className='status-field status-map'; }
          setTimeout(()=>focus('uac',{silent:true}),160);
        },true);
      });
    }
    render();
    ensurePanel();
    bind();
    focus('uac',{silent:true});
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch563:'Faction Relation Visual Upgrade'});

// PATCH 5.6.4 — MenuEntryFXPolish + Faction Relation Layout Fix
// Adds menu-specific entry overlays and folds the faction relation layout hotfix into the originally planned menu polish patch.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const prefix=(document.body&&document.body.dataset&&document.body.dataset.basePath)||'';
    const menuFx={
      history:{cls:'archive',title:'CHRONICLE INDEX REBUILD',sub:'연대 기록 색인 재구성',lines:['사건 연표 확인','기록 단절 구간 보정','세계 기록면 개방']},
      'faction-info':{cls:'faction',title:'FACTION DOSSIER ACCESS',sub:'세력 기록철 접근',lines:['식별 코드 대조','관계 등급 확인','세력 파일 목록 개방']},
      'faction-relation':{cls:'faction',title:'RELATION TRACE MATRIX',sub:'관계 추적 행렬 전개',lines:['중심 기관 확인: U.A.C','연결 세력 조회','감시·통제·적대 경로 분리']},
      'zone-map':{cls:'map',title:'REGIONAL SURFACE LINK',sub:'권역 관제면 연결',lines:['감시망 수신','좌표면 정렬','봉쇄선 레이어 동기화']},
      'archive-entry':{cls:'archive',title:'ARCHIVE SURFACE OPEN',sub:'기록 보관면 개방',lines:['색인 잠금 해제','문서 상태 대조','열람 가능 기록 정렬']}
    };
    let fx=document.querySelector('.pc564-menu-fx');
    if(!fx){ fx=document.createElement('div'); fx.className='pc564-menu-fx'; fx.setAttribute('aria-hidden','true'); document.body.appendChild(fx); }
    let fxTimer=null;
    function showMenuFx(target){
      const info=menuFx[target]; if(!info) return;
      clearTimeout(fxTimer);
      fx.className='pc564-menu-fx '+(info.cls||'');
      fx.innerHTML='<b>'+esc(info.title)+'</b><span>'+esc(info.sub)+'</span>'+info.lines.map((l,i)=>'<i style="--line-order:'+i+'">'+esc(l)+'</i>').join('');
      requestAnimationFrame(()=>fx.classList.add('active'));
      fxTimer=setTimeout(()=>fx.classList.remove('active'),980);
      const notice=document.querySelector('[data-srv-notice]');
      const trace=document.querySelector('[data-srv-trace]');
      if(notice) notice.textContent=info.title+' / '+info.sub;
      if(trace) trace.textContent=info.title+': ONLINE';
    }
    document.querySelectorAll('.side-menu a[data-target]').forEach(a=>{
      if(a.dataset.pc564MenuFx) return;
      a.dataset.pc564MenuFx='1';
      a.addEventListener('click',()=>showMenuFx(a.dataset.target),true);
    });

    const section=document.getElementById('faction-relation');
    if(!section || section.dataset.pc564Ready) return;
    section.dataset.pc564Ready='1';
    section.classList.add('pc564-faction-layout-fix');
    const statusClass={'통제':'control','감시':'watch','적대':'hostile','불명':'unknown','비공식 접촉':'informal'};
    const nodes={
      uac:{name:'U.A.C',img:'uac.webp',tag:'통제',role:'상위 조정기관',x:50,y:50,grade:'CORE-0',risk:'중심 통제',watch:'상시 관제',records:'권역 지도 / 봉쇄 규정',summary:'U.A.C는 현장 작전, 조사 기록, 연구 자료, 민간 통제를 하나의 관제망으로 묶어 최종 판단을 내리는 중심 기관이다.'},
      nhc:{name:'N.H.C',img:'nhc.webp',tag:'통제',role:'현장 작전',x:50,y:22,grade:'OP-1',risk:'고위험 투입',watch:'직접 지휘',records:'현장 작전·장비·봉쇄 규정',summary:'N.H.C는 레드존과 블랙존 외곽에 진입하는 주 현장 전력이며, U.A.C 명령에 따라 봉쇄·구출·교전 기준을 수행한다.'},
      sid:{name:'S.I.D',img:'sid.webp',tag:'감시',role:'특수 조사',x:73,y:36,grade:'INV-2',risk:'정보 민감',watch:'기록 송신',records:'사건 좌표 / 현상 기록',summary:'S.I.D는 실종, 오컬트 범죄, 우시노다교 흔적을 추적하며 조사 결과를 U.A.C 중앙 기록망으로 송신한다.'},
      fhc:{name:'F.H.C',img:'fhc.webp',tag:'감시',role:'극비 연구',x:73,y:64,grade:'LAB-2',risk:'은폐 가능성',watch:'상호 감시',records:'F.H.C 극비 보안 문서',summary:'F.H.C의 연구 자료는 대응에 필요하지만, 생체 실험과 자료 은폐 가능성 때문에 U.A.C의 감시선 안에 묶인다.'},
      cpd:{name:'C.P.D',img:'cpd.webp',tag:'감시',role:'민간 통제국',x:27,y:50,grade:'CIV-3',risk:'민간 접촉',watch:'행정 감시',records:'대피·검문·선별 기록',summary:'C.P.D는 검문, 피난민 분리, 귀환자 선별 같은 민간 통제 축을 담당한다. 대피버스·차량 단위는 관계도 노드에서 제외된다.'},
      arf:{name:'A.R.F',img:'arf.webp',tag:'통제',role:'회수 부대',x:35,y:22,grade:'REC-2',risk:'오염 회수',watch:'N.H.C 연계',records:'회수·소각 절차',summary:'A.R.F는 N.H.C가 확보한 현장에 후속 진입하여 생존자, 샘플, 기록 매체를 회수한다.'},
      ashcrew:{name:'Ash Crew',img:'ashcrew.webp',tag:'통제',role:'오염 처리',x:65,y:22,grade:'ASH-2',risk:'잔류 오염',watch:'N.H.C 연계',records:'오염된 장비 / 소각 기록',summary:'Ash Crew는 전투 후 남은 오염 장비, 사체, 잔류물을 봉인·회수·소각하는 후속 처리반이다.'},
      amarion:{name:'Amarion',img:'amarion.webp',tag:'비공식 접촉',role:'민간 연구망',x:66,y:82,grade:'BIO-4',risk:'비인가 실험',watch:'F.H.C 경유',records:'연구 연결 / 비인가 자료',summary:'Amarion은 제약·생명공학 자료를 통해 F.H.C와 연결되지만, 비인가 실험 기록 때문에 공식 협력으로 분류되지 않는다.'},
      syndicate:{name:'Syndicate',img:'syndicate.webp',tag:'적대',role:'이탈 네트워크',x:34,y:82,grade:'HOST-1',risk:'교전 가능',watch:'추적 대상',records:'레드울프 이탈 기록',summary:'Syndicate는 비공식 무장 네트워크이며, 레드울프 계열 이탈 작전 집단과 연결된 추적 대상이다.'},
      ushinoda:{name:'Ushnoda Cult',img:'ushinoda.webp',tag:'적대',role:'의식 범죄',x:21,y:68,grade:'RIT-0',risk:'블랙존화',watch:'차단 대상',records:'우시노다교 의식성 오염',summary:'Ushnoda Cult는 의식성 오염, 기억 왜곡, 인신공양, 블랙존화 징후와 직접 연결되는 핵심 적대 세력이다.'},
      haimun:{name:'Haimun',img:'haimun.webp',tag:'불명',role:'도심 침투',x:21,y:32,grade:'UNK-3',risk:'구조 불명',watch:'잠복 감시',records:'하이문 도심 침투 기록',summary:'Haimun은 도심권 납치와 의식 흔적에 반복적으로 등장하지만 지휘 구조와 상위 연결은 아직 불명으로 남아 있다.'}
    };
    const edges=[
      {a:'uac',b:'nhc',type:'command',label:'작전 통제',desc:'U.A.C가 구역 정보와 봉쇄 명령을 제공하고 N.H.C가 현장 진입을 수행한다.'},
      {a:'uac',b:'sid',type:'watch',label:'조사 감시',desc:'S.I.D는 조사 결과를 U.A.C 중앙 기록망으로 송신한다.'},
      {a:'uac',b:'fhc',type:'watch',label:'상호 감시',desc:'F.H.C 연구 자료는 필요하지만 은폐 가능성 때문에 감시가 유지된다.'},
      {a:'uac',b:'cpd',type:'command',label:'민간 통제',desc:'C.P.D는 검문과 대피 통제를 수행하되 U.A.C 행정 명령 아래 움직인다.'},
      {a:'uac',b:'ushinoda',type:'hostile',label:'적대 차단',desc:'U.A.C 관제망은 의식성 오염과 블랙존 확산 차단을 우선한다.'},
      {a:'nhc',b:'arf',type:'command',label:'후속 회수',desc:'현장 확보 이후 A.R.F가 생존자와 자료를 회수한다.'},
      {a:'nhc',b:'ashcrew',type:'command',label:'오염 처리',desc:'Ash Crew는 전투 후 남은 오염 잔류물을 봉인하거나 소각한다.'},
      {a:'nhc',b:'syndicate',type:'hostile',label:'이탈 추적',desc:'Syndicate 내부 레드울프 계열은 N.H.C 이탈 기록과 연결된다.'},
      {a:'sid',b:'ushinoda',type:'hostile',label:'의식 추적',desc:'Ushnoda Cult는 S.I.D가 추적하는 핵심 의식 범죄 세력이다.'},
      {a:'ushinoda',b:'haimun',type:'ritual',label:'도심 침투',desc:'Haimun은 Ushnoda Cult의 도심 침투와 납치, 의식 흔적에 연결된다.'},
      {a:'fhc',b:'amarion',type:'informal',label:'연구 연결',desc:'Amarion은 F.H.C 연구망과 접촉하지만 비인가 실험 때문에 별도 감시된다.'},
      {a:'fhc',b:'syndicate',type:'informal',label:'비공식 접촉',desc:'자금·용병·실험 자료 흐름에서 비공식 접촉 가능성이 남아 있다.'}
    ];
    const related={}; Object.keys(nodes).forEach(k=>related[k]=new Set([k])); edges.forEach(e=>{related[e.a].add(e.b);related[e.b].add(e.a);});
    function pathFor(e){
      const a=nodes[e.a],b=nodes[e.b];
      if(e.a==='uac'||e.b==='uac') return 'M '+a.x+' '+a.y+' L '+b.x+' '+b.y;
      const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
      const dx=mx-50,dy=my-50;
      const len=Math.max(1,Math.sqrt(dx*dx+dy*dy));
      const cx=50+(dx/len)*34, cy=50+(dy/len)*26;
      return 'M '+a.x+' '+a.y+' Q '+cx+' '+cy+' '+b.x+' '+b.y;
    }
    function edgeHtml(e){ return '<path class="pc564-edge '+esc(e.type)+'" data-edge-a="'+esc(e.a)+'" data-edge-b="'+esc(e.b)+'" d="'+pathFor(e)+'"><title>'+esc(e.label+' / '+e.desc)+'</title></path>'; }
    function nodeHtml(k){
      const n=nodes[k],cls=statusClass[n.tag]||'unknown';
      return '<button type="button" class="pc564-node '+cls+(k==='uac'?' uac':'')+'" data-faction-key="'+esc(k)+'" style="left:'+n.x+'%;top:'+n.y+'%" aria-label="'+esc(n.name)+' 관계 분석">'
        +'<img src="'+esc(prefix)+'assets/faction_marks/'+esc(n.img)+'" alt="'+esc(n.name)+'"/><b>'+esc(n.name)+'</b><small>'+esc(n.role)+'</small><span class="pc564-tag">'+esc(n.tag)+'</span></button>';
    }
    function render(){
      const tree=section.querySelector('.relation-tree-panel'); if(!tree) return;
      tree.classList.add('pc563-radial-panel','pc564-radial-panel');
      tree.setAttribute('aria-label','U.A.C 중심 방사형 세력 관계도');
      const order=['uac','nhc','sid','fhc','cpd','arf','ashcrew','amarion','syndicate','ushinoda','haimun'];
      tree.innerHTML='<div class="pc564-matrix"><div class="pc564-title"><b>RELATION TRACE MATRIX</b><span>중심 통제 / 감시 의존 / 비공식 접촉 / 의식성 적대 경로 분리</span></div>'
        +'<svg class="pc564-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><circle class="pc564-ring inner" cx="50" cy="50" r="17"/><circle class="pc564-ring" cx="50" cy="50" r="30"/><circle class="pc564-ring outer" cx="50" cy="50" r="42"/><circle class="pc564-ring outer" cx="50" cy="50" r="47"/>'+edges.map(edgeHtml).join('')+'</svg>'
        +order.map(nodeHtml).join('')+'</div>';
      const brief=section.querySelector('.section-brief');
      if(brief) brief.innerHTML='U.A.C 관계도는 세력의 우호 여부만 나열하지 않는다. 현장 통제, 조사 감시, 연구 불신, 비공식 접촉, 의식성 적대 경로를 하나의 추적 행렬로 묶어 보여준다. 선택한 노드와 직접 연결된 경로만 밝게 유지되고, 무관한 노드와 선은 관제면 뒤로 후퇴한다.';
      const cap=section.querySelector('.map-caption');
      if(cap) cap.textContent='관계도는 기관·세력 단위만 표시한다. C.P.D 대피버스, 차량, 장비, 지도 마커는 관계도 노드에서 제외한다.';
      section.querySelector('.pc563-status-strip')?.remove();
      const legend=section.querySelector('.relation-legend');
      if(legend && !section.querySelector('.pc564-status-strip')){
        const strip=document.createElement('div'); strip.className='pc563-status-strip pc564-status-strip';
        strip.innerHTML=['통제','감시','적대','불명','비공식 접촉'].map(s=>'<span class="pc563-mini-status pc563-status-'+(statusClass[s]||'unknown')+'">'+esc(s)+'</span>').join('');
        legend.insertAdjacentElement('afterend',strip);
      }
    }
    function ensurePanel(){
      section.querySelector('.pc563-analysis-panel')?.remove();
      let p=section.querySelector('.pc564-analysis-panel'); if(p) return p;
      p=document.createElement('div'); p.className='pc564-analysis-panel';
      p.innerHTML='<div class="pc564-analysis-head"><b>TRACE ANALYSIS</b><span data-pc564-state>NODE STANDBY</span></div><div class="pc564-analysis-grid"><span><b>선택 세력</b><i data-pc564-name>U.A.C</i></span><span><b>상태 태그</b><i data-pc564-status>통제</i></span><span><b>관계 등급</b><i data-pc564-grade>CORE-0</i></span><span><b>감시 상태</b><i data-pc564-watch>상시 관제</i></span><span><b>직접 연결</b><i data-pc564-links>N.H.C / S.I.D / F.H.C</i></span><span><b>위험도</b><i data-pc564-risk>중심 통제</i></span><span><b>관련 기록</b><i data-pc564-records>권역 지도 / 봉쇄 규정</i></span><span class="wide"><b>U.A.C 판단</b><i data-pc564-summary>중앙 통제 노드 대기 중.</i></span></div>';
      const tree=section.querySelector('.relation-tree-panel'); if(tree) tree.insertAdjacentElement('afterend',p); else section.appendChild(p); return p;
    }
    function edgeText(k){ return edges.filter(e=>e.a===k||e.b===k).map(e=>nodes[e.a===k?e.b:e.a].name+' · '+e.label).join(' / ') || '직접 연결 없음'; }
    function tone(k){
      try{ if(localStorage.getItem('pc_audio_legacy2003_fixed')==='off') return; const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return; const ctx=window.__pc564Ctx||(window.__pc564Ctx=new AC()); if(ctx.state==='suspended') ctx.resume().catch(()=>{}); const n=nodes[k]||nodes.uac; const cls=statusClass[n.tag]||'control'; const f=cls==='hostile'?185:cls==='informal'?310:cls==='watch'?270:430; const o=ctx.createOscillator(),g=ctx.createGain(); o.type=cls==='hostile'?'sawtooth':'triangle'; o.frequency.setValueAtTime(f,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(f*1.25,ctx.currentTime+.07); g.gain.setValueAtTime(.0001,ctx.currentTime); g.gain.exponentialRampToValueAtTime(.016,ctx.currentTime+.012); g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.11); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+.13); }catch(e){}
    }
    function focus(k,opts={}){
      if(!nodes[k]) k='uac'; const n=nodes[k]; const rel=related[k]||new Set([k]);
      section.dataset.pc564Focus=k; section.dataset.pc563Focus=k; section.dataset.pc563Status=statusClass[n.tag]||'unknown';
      section.querySelectorAll('.pc564-node').forEach(btn=>{ const key=btn.dataset.factionKey; btn.classList.toggle('selected',key===k); btn.classList.toggle('related',key!==k&&rel.has(key)); btn.classList.toggle('muted',!rel.has(key)); });
      section.querySelectorAll('.pc564-edge').forEach(edge=>{ const a=edge.dataset.edgeA,b=edge.dataset.edgeB; const active=(a===k||b===k||k==='uac'&&(a==='uac'||b==='uac')); edge.classList.toggle('focus',active); edge.classList.toggle('dim',!active); });
      const p=ensurePanel();
      p.querySelector('[data-pc564-name]').textContent=n.name+' / '+n.role;
      p.querySelector('[data-pc564-status]').textContent=n.tag;
      p.querySelector('[data-pc564-grade]').textContent=n.grade;
      p.querySelector('[data-pc564-watch]').textContent=n.watch;
      p.querySelector('[data-pc564-links]').textContent=edgeText(k);
      p.querySelector('[data-pc564-risk]').textContent=n.risk;
      p.querySelector('[data-pc564-records]').textContent=n.records;
      p.querySelector('[data-pc564-summary]').textContent=n.summary;
      p.querySelector('[data-pc564-state]').textContent='NODE: '+n.name+' / TRACE ACTIVE';
      section.querySelectorAll('.relation-table tbody tr').forEach(row=>{ const tx=row.textContent||''; const active=k==='uac'?/U\.A\.C|UAC/.test(tx):(tx.includes(n.name)||tx.includes(n.name.replace(' Cult',''))||tx.includes(n.role)); row.classList.toggle('pc564-row-active',active); row.classList.toggle('pc564-row-muted',!active); row.classList.remove('relation-row-active','relation-row-muted'); });
      const notice=document.querySelector('[data-srv-notice]'); const trace=document.querySelector('[data-srv-trace]'); if(notice) notice.textContent='RELATION TRACE MATRIX / '+n.name+' / '+n.tag; if(trace){trace.textContent='RELATION TRACE MATRIX: '+n.name; trace.className='status-field status-map';}
      if(!opts.silent) tone(k);
    }
    function bind(){
      section.querySelectorAll('.pc564-node').forEach(btn=>{ btn.addEventListener('click',()=>focus(btn.dataset.factionKey)); btn.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault(); focus(btn.dataset.factionKey);} }); });
      section.querySelectorAll('.relation-table tbody tr').forEach(row=>{ row.setAttribute('tabindex','0'); row.addEventListener('click',()=>{ const tx=row.textContent||''; const k=Object.keys(nodes).find(key=>tx.includes(nodes[key].name)||tx.includes(nodes[key].name.replace(' Cult',''))||tx.includes(nodes[key].role)); if(k) focus(k); }); });
      document.querySelectorAll('.side-menu a[data-target="faction-relation"]').forEach(a=>{ a.addEventListener('click',()=>setTimeout(()=>focus('uac',{silent:true}),180),true); });
    }
    render(); ensurePanel(); bind(); focus('uac',{silent:true});
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch564:'Menu Entry FX Polish + Faction Relation Layout Fix'});


// PATCH 5.6.4.1 — FactionRelationLayoutRelationHotfix
// Restores node readability, rebuilds the U.A.C-centered relation rings, and expands relation descriptions.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const section=document.getElementById('faction-relation');
    if(!section || section.dataset.pc5641Ready) return;
    section.dataset.pc5641Ready='1';
    section.classList.add('pc5641-faction-relation-hotfix');
    const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const prefix=(document.body&&document.body.dataset&&document.body.dataset.basePath)||'';
    const statusClass={'통제':'control','감시':'watch','적대':'hostile','불명':'unknown','비공식 접촉':'informal','제한 협력':'limited'};
    const typeLabel={command:'작전 통제',watch:'조사/감시',limited:'제한 협력',hostile:'적대/교전',ritual:'의식성 침투',informal:'비공식 접촉',unknown:'불명/자료 부족'};
    const nodes={
      uac:{name:'U.A.C',img:'uac.webp',tag:'통제',role:'상위 조정기관',ring:'중심 관제',x:50,y:50,grade:'CORE-0',risk:'중심 통제',watch:'상시 관제',records:'권역 지도 / 봉쇄 규정 / 기록 통제',summary:'U.A.C는 현장 작전, 조사 기록, 연구 자료, 민간 통제 기준을 하나의 관제망으로 묶어 최종 판단을 내리는 중심 기관이다.'},
      nhc:{name:'N.H.C',img:'nhc.webp',tag:'통제',role:'현장 작전',ring:'1차 작전권',x:50,y:20,grade:'OP-1',risk:'고위험 투입',watch:'직접 지휘',records:'N.H.C 현장 작전·장비·봉쇄 규정',summary:'N.H.C는 레드존과 블랙존 외곽에 진입하는 주 현장 전력이며, U.A.C 명령에 따라 봉쇄·구출·교전 기준을 수행한다.'},
      sid:{name:'S.I.D',img:'sid.webp',tag:'감시',role:'특수 조사',ring:'1차 작전권',x:70,y:38,grade:'INV-2',risk:'정보 민감',watch:'기록 송신',records:'사건 좌표 / 현상 기록 / 실종 조사',summary:'S.I.D는 실종, 오컬트 범죄, 우시노다교 흔적을 추적하며 조사 결과를 U.A.C 중앙 기록망으로 송신한다.'},
      fhc:{name:'F.H.C',img:'fhc.webp',tag:'감시',role:'극비 연구',ring:'1차 감시권',x:70,y:62,grade:'LAB-2',risk:'은폐 가능성',watch:'상호 감시',records:'F.H.C 극비 보안 문서',summary:'F.H.C의 연구 자료는 대응에 필요하지만, 생체 실험과 자료 은폐 가능성 때문에 U.A.C의 감시선 안에 묶인다.'},
      cpd:{name:'C.P.D',img:'cpd.webp',tag:'감시',role:'민간 통제국',ring:'1차 작전권',x:30,y:50,grade:'CIV-3',risk:'민간 접촉',watch:'행정 감시',records:'대피·검문·선별 기록',summary:'C.P.D는 검문, 피난민 분리, 귀환자 선별 같은 민간 통제 축을 담당한다. C.P.D 대피버스·차량 단위는 관계도 노드에서 제외된다.'},
      arf:{name:'A.R.F',img:'arf.webp',tag:'통제',role:'회수 부대',ring:'2차 후속권',x:38,y:28,grade:'REC-2',risk:'오염 회수',watch:'N.H.C 연계',records:'회수·소각 연계 절차',summary:'A.R.F는 N.H.C가 확보한 현장에 후속 진입하여 생존자, 샘플, 기록 매체를 회수한다. 독자 행동 시 U.A.C 감시 대상으로 전환된다.'},
      ashcrew:{name:'Ash Crew',img:'ashcrew.webp',tag:'통제',role:'오염 처리',ring:'2차 후속권',x:62,y:28,grade:'ASH-2',risk:'잔류 오염',watch:'N.H.C 연계',records:'오염된 장비 / 소각 기록',summary:'Ash Crew는 전투 후 남은 오염 장비, 사체, 잔류물을 봉인·회수·소각하는 후속 처리반이다.'},
      amarion:{name:'Amarion',img:'amarion.webp',tag:'비공식 접촉',role:'민간 연구망',ring:'2차 위험권',x:64,y:80,grade:'BIO-4',risk:'비인가 실험',watch:'F.H.C 경유 감시',records:'연구 연결 / 비인가 자료',summary:'Amarion은 제약·생명공학 자료를 통해 F.H.C와 연결되지만, 비인가 실험 기록 때문에 공식 협력으로 분류되지 않는다.'},
      syndicate:{name:'Syndicate',img:'syndicate.webp',tag:'적대',role:'이탈 네트워크',ring:'2차 위험권',x:36,y:80,grade:'HOST-1',risk:'교전 가능',watch:'추적 대상',records:'레드울프 이탈 기록',summary:'Syndicate는 비공식 무장 네트워크이며, 레드울프 계열 이탈 작전 집단과 연결된 추적 대상이다.'},
      ushinoda:{name:'Ushnoda Cult',img:'ushinoda.webp',tag:'적대',role:'의식 범죄',ring:'외곽 적대권',x:23,y:68,grade:'RIT-0',risk:'블랙존화',watch:'차단 대상',records:'우시노다교 의식성 오염',summary:'Ushnoda Cult는 의식성 오염, 기억 왜곡, 인신공양, 블랙존화 징후와 직접 연결되는 핵심 적대 세력이다.'},
      haimun:{name:'Haimun',img:'haimun.webp',tag:'불명',role:'도심 침투',ring:'외곽 불명권',x:23,y:32,grade:'UNK-3',risk:'구조 불명',watch:'잠복 감시',records:'하이문 도심 침투 기록',summary:'Haimun은 도심권 납치와 의식 흔적에 반복적으로 등장하지만 지휘 구조와 상위 연결은 아직 불명으로 남아 있다.'}
    };
    const edges=[
      {a:'uac',b:'nhc',type:'command',label:'작전 통제',desc:'U.A.C가 권역 대응 기준을 내리고 N.H.C가 현장 투입과 봉쇄 작전을 수행한다.'},
      {a:'uac',b:'sid',type:'watch',label:'조사/감시',desc:'S.I.D는 현장 조사와 기록 검증을 담당하고, U.A.C에 정보와 징후를 보고한다.'},
      {a:'uac',b:'fhc',type:'limited',label:'제한 협력 / 감시',desc:'F.H.C 연구 자료는 필요하지만 위험성이 높아 U.A.C가 지속 감시한다.'},
      {a:'uac',b:'cpd',type:'command',label:'민간 통제',desc:'민간 대피, 검문, 도시 통제 기준을 공유한다.'},
      {a:'uac',b:'arf',type:'watch',label:'감시 / 제한 접촉',desc:'회수·복구 활동은 허용되지만 독자 행동 때문에 감시 대상이다.'},
      {a:'uac',b:'ushinoda',type:'hostile',label:'적대 차단',desc:'의식성 오염 확산과 정보 교란으로 U.A.C 대응 체계와 충돌한다.'},
      {a:'uac',b:'haimun',type:'unknown',label:'불명 / 위험',desc:'명확한 지휘체계는 불명이나, 여러 오염 사건에서 반복적으로 언급된다.'},
      {a:'nhc',b:'sid',type:'command',label:'현장 정보 공유',desc:'N.H.C가 확보한 현장 데이터를 S.I.D가 분석·검증한다.'},
      {a:'nhc',b:'cpd',type:'command',label:'봉쇄/대피 협력',desc:'민간 통제선, 대피 루트, 검문소 운영에서 협력한다.'},
      {a:'nhc',b:'fhc',type:'limited',label:'회수 자료 인계 / 불신',desc:'개체·장비·오염 샘플 인계는 있으나 현장 부대는 F.H.C를 신뢰하지 않는다.'},
      {a:'nhc',b:'arf',type:'command',label:'후속 회수',desc:'현장 확보 이후 A.R.F가 생존자, 장비, 기록 매체를 회수한다.'},
      {a:'nhc',b:'ashcrew',type:'command',label:'오염 처리',desc:'Ash Crew는 전투 후 남은 오염 잔류물을 봉인하거나 소각한다.'},
      {a:'nhc',b:'ushinoda',type:'hostile',label:'현장 교전',desc:'우시노다교 의식 오염과 현장 교전 기록이 다수 존재한다.'},
      {a:'nhc',b:'syndicate',type:'hostile',label:'이탈 추적',desc:'Syndicate 내부 레드울프 계열은 N.H.C 이탈 기록과 연결된다.'},
      {a:'sid',b:'ushinoda',type:'watch',label:'조사 대상',desc:'S.I.D가 우시노다교 신호, 문서, 현장 잔류 의식을 추적한다.'},
      {a:'sid',b:'haimun',type:'watch',label:'감시',desc:'하이문 관련 기록은 직접 증거보다 간접 신호가 많아 감시 상태가 유지된다.'},
      {a:'fhc',b:'syndicate',type:'informal',label:'비공식 접촉',desc:'비인가 장비·샘플·연구 자재 유통 의혹이 남아 있다.'},
      {a:'fhc',b:'amarion',type:'informal',label:'비공식 연구 접촉',desc:'인공 개체, 혼합 개체, 비인가 실험과의 연계가 의심된다.'},
      {a:'syndicate',b:'ashcrew',type:'informal',label:'거래/회수 루트',desc:'오염지대 잔해, 장비, 회수품을 둘러싼 비공식 거래망 정황이 있다.'},
      {a:'syndicate',b:'amarion',type:'informal',label:'은닉 지원',desc:'실험 시설과 자금 흐름이 간접적으로 연결된 정황이 있다.'},
      {a:'ushinoda',b:'haimun',type:'ritual',label:'의식성 접촉 / 불명',desc:'우시노다교 의식과 하이문 측 오염 기록 사이의 반복적 접점이 확인된다.'}
    ];
    const related={}; Object.keys(nodes).forEach(k=>related[k]=new Set([k])); edges.forEach(e=>{related[e.a].add(e.b); related[e.b].add(e.a);});
    function curve(e){
      const a=nodes[e.a], b=nodes[e.b];
      if(e.a==='uac'||e.b==='uac') return 'M '+a.x+' '+a.y+' L '+b.x+' '+b.y;
      const mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
      const dx=mx-50, dy=my-50, len=Math.max(1,Math.sqrt(dx*dx+dy*dy));
      const push=(e.type==='hostile'||e.type==='ritual')?10:e.type==='informal'?7:5;
      const cx=mx+(dx/len)*push, cy=my+(dy/len)*push;
      return 'M '+a.x+' '+a.y+' Q '+cx+' '+cy+' '+b.x+' '+b.y;
    }
    function edgeHtml(e,i){return '<path class="pc5641-edge '+esc(e.type)+'" data-edge-index="'+i+'" data-edge-a="'+esc(e.a)+'" data-edge-b="'+esc(e.b)+'" d="'+curve(e)+'"><title>'+esc(nodes[e.a].name+' ↔ '+nodes[e.b].name+' / '+e.label+' / '+e.desc)+'</title></path>';}
    function nodeHtml(k){const n=nodes[k], cls=statusClass[n.tag]||'unknown'; return '<button type="button" class="pc5641-node '+cls+(k==='uac'?' uac':'')+'" data-faction-key="'+esc(k)+'" style="left:'+n.x+'%;top:'+n.y+'%" aria-label="'+esc(n.name)+' 관계 분석"><img src="'+esc(prefix)+'assets/faction_marks/'+esc(n.img)+'" alt="'+esc(n.name)+'"><b>'+esc(n.name)+'</b><small>'+esc(n.role)+'</small><span class="pc5641-tag">'+esc(n.tag)+'</span></button>';}
    function buildTable(){
      const tbody=section.querySelector('.relation-table tbody'); if(!tbody) return;
      const rowClass={command:'friendly',watch:'neutral',limited:'neutral',hostile:'hostile',ritual:'hostile',informal:'neutral',unknown:'neutral'};
      tbody.innerHTML=edges.map((e,i)=>'<tr data-edge-index="'+i+'" data-edge-a="'+esc(e.a)+'" data-edge-b="'+esc(e.b)+'"><td class="'+(rowClass[e.type]||'neutral')+'">'+esc(typeLabel[e.type]||e.type)+'</td><td>'+esc(nodes[e.a].name+' ↔ '+nodes[e.b].name)+'</td><td>'+esc(e.label)+'</td><td>'+esc(e.desc)+'</td></tr>').join('');
    }
    function render(){
      const tree=section.querySelector('.relation-tree-panel'); if(!tree) return;
      section.classList.add('pc5641-default-view');
      tree.classList.add('pc5641-radial-panel');
      tree.setAttribute('aria-label','U.A.C 중심 3단 링 세력 관계도');
      const order=['uac','nhc','sid','fhc','cpd','arf','ashcrew','amarion','syndicate','ushinoda','haimun'];
      tree.innerHTML='<div class="pc5641-matrix"><div class="pc5641-title"><b>RELATION TRACE MATRIX</b><span>U.A.C 중심 3단 링 / 작전권·위험권·외곽 불명권 분리</span></div><div class="pc5641-ring-label core">중심 관제</div><div class="pc5641-ring-label inner">1차 작전권</div><div class="pc5641-ring-label outer">외곽 위험권</div><svg class="pc5641-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><circle class="pc5641-ring core" cx="50" cy="50" r="14"/><circle class="pc5641-ring inner" cx="50" cy="50" r="25"/><circle class="pc5641-ring mid" cx="50" cy="50" r="36"/><circle class="pc5641-ring outer" cx="50" cy="50" r="44"/>'+edges.map(edgeHtml).join('')+'</svg>'+order.map(nodeHtml).join('')+'</div>';
      const brief=section.querySelector('.section-brief');
      if(brief) brief.innerHTML='U.A.C 관계도는 우호 여부를 단순 나열하지 않는다. 중심 관제, 1차 작전권, 후속 회수권, 연구 불신, 비공식 접촉, 의식성 적대 경로를 하나의 추적 행렬로 묶어 표시한다. 기본 상태에서는 모든 노드를 확인할 수 있으며, 노드를 선택하면 해당 세력과 직접 연결된 경로만 강조된다.';
      const cap=section.querySelector('.map-caption');
      if(cap) cap.textContent='관계도는 기관·세력 단위만 표시한다. C.P.D 대피버스, 차량, 장비, 지도 마커는 관계도 노드에서 제외한다.';
      buildTable();
      section.querySelector('.pc563-status-strip')?.remove();
      if(!section.querySelector('.pc5641-status-strip')){
        const legend=section.querySelector('.relation-legend');
        const strip=document.createElement('div'); strip.className='pc5641-status-strip';
        strip.innerHTML=['통제','감시','적대','불명','비공식 접촉','제한 협력'].map(s=>'<span class="pc5641-mini-status '+(statusClass[s]||'unknown')+'">'+esc(s)+'</span>').join('');
        (legend||section.querySelector('.pc5641-matrix')).insertAdjacentElement('afterend',strip);
      }
    }
    function ensurePanel(){
      section.querySelector('.pc563-analysis-panel')?.remove();
      section.querySelector('.pc564-analysis-panel')?.remove();
      let p=section.querySelector('.pc5641-analysis-panel'); if(p) return p;
      p=document.createElement('div'); p.className='pc5641-analysis-panel';
      p.innerHTML='<div class="pc5641-analysis-head"><b>TRACE ANALYSIS</b><span data-pc5641-state>NO NODE SELECTED / ALL NODES VISIBLE</span></div><div class="pc5641-analysis-grid"><span><b>선택 세력</b><i data-pc5641-name>대기 중</i></span><span><b>상태 태그</b><i data-pc5641-status>전체 표시</i></span><span><b>관계 등급</b><i data-pc5641-grade>STANDBY</i></span><span><b>감시 상태</b><i data-pc5641-watch>선택 대기</i></span><span><b>직접 연결</b><i data-pc5641-links>노드를 선택하면 직접 연결 경로가 표시된다.</i></span><span><b>위험도</b><i data-pc5641-risk>전체 관제</i></span><span><b>관련 기록</b><i data-pc5641-records>기록 연결 대기</i></span><span class="wide"><b>U.A.C 판단</b><i data-pc5641-summary>기본 상태에서는 모든 노드와 주요 관계선을 가시 상태로 유지한다. 흐림 처리는 세력 노드 선택 후에만 적용된다.</i></span><span class="wide"><b>관계 기록</b><i data-pc5641-edge-note>선택된 세력 없음.</i></span></div>';
      const tree=section.querySelector('.relation-tree-panel'); if(tree) tree.insertAdjacentElement('afterend',p); else section.appendChild(p); return p;
    }
    function edgeList(k){return edges.filter(e=>e.a===k||e.b===k).map(e=>{const other=e.a===k?e.b:e.a; return nodes[other].name+' · '+e.label+' — '+e.desc;});}
    function reset(){
      section.dataset.pc5641Focus=''; section.classList.add('pc5641-default-view');
      section.querySelectorAll('.pc5641-node').forEach(btn=>btn.classList.remove('selected','related','muted'));
      section.querySelectorAll('.pc5641-edge').forEach(edge=>edge.classList.remove('focus','dim'));
      section.querySelectorAll('.relation-table tbody tr').forEach(row=>row.classList.remove('pc5641-row-active','pc5641-row-muted','pc564-row-active','pc564-row-muted','relation-row-active','relation-row-muted'));
      const p=ensurePanel();
      p.querySelector('[data-pc5641-state]').textContent='NO NODE SELECTED / ALL NODES VISIBLE';
      p.querySelector('[data-pc5641-name]').textContent='대기 중';
      p.querySelector('[data-pc5641-status]').textContent='전체 표시';
      p.querySelector('[data-pc5641-grade]').textContent='STANDBY';
      p.querySelector('[data-pc5641-watch]').textContent='선택 대기';
      p.querySelector('[data-pc5641-links]').textContent='노드를 선택하면 직접 연결 경로가 표시된다.';
      p.querySelector('[data-pc5641-risk]').textContent='전체 관제';
      p.querySelector('[data-pc5641-records]').textContent='기록 연결 대기';
      p.querySelector('[data-pc5641-summary]').textContent='기본 상태에서는 모든 노드와 주요 관계선을 가시 상태로 유지한다. 흐림 처리는 세력 노드 선택 후에만 적용된다.';
      p.querySelector('[data-pc5641-edge-note]').textContent='선택된 세력 없음.';
    }
    function tone(k){
      try{ if(localStorage.getItem('pc_audio_legacy2003_fixed')==='off') return; const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return; const ctx=window.__pc5641Ctx||(window.__pc5641Ctx=new AC()); if(ctx.state==='suspended') ctx.resume().catch(()=>{}); const n=nodes[k]||nodes.uac; const cls=statusClass[n.tag]||'control'; const f=cls==='hostile'?185:cls==='informal'?310:cls==='watch'?270:430; const o=ctx.createOscillator(),g=ctx.createGain(); o.type=cls==='hostile'?'sawtooth':'triangle'; o.frequency.setValueAtTime(f,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(f*1.22,ctx.currentTime+.065); g.gain.setValueAtTime(.0001,ctx.currentTime); g.gain.exponentialRampToValueAtTime(.014,ctx.currentTime+.012); g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.10); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+.12); }catch(e){}
    }
    function focus(k,opts={}){
      if(!nodes[k]) return reset();
      const n=nodes[k], rel=related[k]||new Set([k]);
      section.classList.remove('pc5641-default-view'); section.dataset.pc5641Focus=k; section.dataset.pc563Focus=k; section.dataset.pc563Status=statusClass[n.tag]||'unknown';
      section.querySelectorAll('.pc5641-node').forEach(btn=>{ const key=btn.dataset.factionKey; btn.classList.toggle('selected',key===k); btn.classList.toggle('related',key!==k&&rel.has(key)); btn.classList.toggle('muted',!rel.has(key)); });
      section.querySelectorAll('.pc5641-edge').forEach(edge=>{ const a=edge.dataset.edgeA,b=edge.dataset.edgeB; const active=(a===k||b===k); edge.classList.toggle('focus',active); edge.classList.toggle('dim',!active); });
      section.querySelectorAll('.relation-table tbody tr').forEach(row=>{ const active=(row.dataset.edgeA===k||row.dataset.edgeB===k); row.classList.toggle('pc5641-row-active',active); row.classList.toggle('pc5641-row-muted',!active); row.classList.remove('pc564-row-active','pc564-row-muted','relation-row-active','relation-row-muted'); });
      const p=ensurePanel();
      p.querySelector('[data-pc5641-state]').textContent='NODE: '+n.name+' / TRACE ACTIVE';
      p.querySelector('[data-pc5641-name]').textContent=n.name+' / '+n.role+' / '+n.ring;
      p.querySelector('[data-pc5641-status]').textContent=n.tag;
      p.querySelector('[data-pc5641-grade]').textContent=n.grade;
      p.querySelector('[data-pc5641-watch]').textContent=n.watch;
      p.querySelector('[data-pc5641-links]').textContent=Array.from(rel).filter(x=>x!==k).map(x=>nodes[x].name).join(' / ') || '직접 연결 없음';
      p.querySelector('[data-pc5641-risk]').textContent=n.risk;
      p.querySelector('[data-pc5641-records]').textContent=n.records;
      p.querySelector('[data-pc5641-summary]').textContent=n.summary;
      p.querySelector('[data-pc5641-edge-note]').textContent=edgeList(k).join('  |  ') || '관계 기록 없음';
      const notice=document.querySelector('[data-srv-notice]'), trace=document.querySelector('[data-srv-trace]');
      if(notice) notice.textContent='RELATION TRACE MATRIX / '+n.name+' / '+n.tag;
      if(trace){ trace.textContent='RELATION TRACE MATRIX: '+n.name; trace.className='status-field status-map'; }
      if(!opts.silent) tone(k);
    }
    function bind(){
      section.querySelectorAll('.pc5641-node').forEach(btn=>{ btn.addEventListener('click',()=>focus(btn.dataset.factionKey)); btn.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();focus(btn.dataset.factionKey);}}); });
      section.querySelectorAll('.relation-table tbody tr').forEach(row=>{ row.setAttribute('tabindex','0'); row.addEventListener('click',()=>{ focus(row.dataset.edgeA||'uac'); }); });
      section.querySelector('.pc5641-title')?.addEventListener('dblclick',reset);
      document.querySelectorAll('.side-menu a[data-target="faction-relation"]').forEach(a=>{ a.addEventListener('click',()=>setTimeout(reset,230),true); });
    }
    render(); ensurePanel(); bind(); reset();
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch5641:'Faction Relation Layout + Relation Hotfix'});

// PATCH 5.7 — Audio FX Polish + Faction Relation Node Visibility Fix
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  // Lightweight audio polish: avoid duplicate rapid-fire playback of the same short UI sound.
  (function installAudioGate(){
    if(window.__pc57AudioGateInstalled) return; window.__pc57AudioGateInstalled=true;
    try{
      const nativePlay=HTMLMediaElement.prototype.play;
      const last=new Map();
      HTMLMediaElement.prototype.play=function(){
        try{
          const src=this.currentSrc||this.src||'';
          if(src && !/ambient_loop/i.test(src)){
            const now=performance.now();
            const prev=last.get(src)||0;
            if(now-prev<85) return Promise.resolve();
            last.set(src,now);
          }
        }catch(e){}
        return nativePlay.apply(this,arguments);
      };
    }catch(e){}
  })();
  ready(function(){
    const section=document.getElementById('faction-relation');
    if(!section) return;
    section.classList.add('pc57-faction-node-fix');
    const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const prefix=(document.body&&document.body.dataset&&document.body.dataset.basePath)||'';
    const statusClass={'통제':'control','감시':'watch','적대':'hostile','불명':'unknown','비공식 접촉':'informal','제한 협력':'limited'};
    const typeLabel={command:'작전 통제',watch:'조사/감시',limited:'제한 협력',hostile:'적대/교전',ritual:'의식성 침투',informal:'비공식 접촉',unknown:'불명/자료 부족'};
    const nodes={
      uac:{name:'U.A.C',img:'uac.webp',tag:'통제',role:'상위 조정기관',ring:'중심 관제',x:50,y:50,grade:'CORE-0',risk:'중심 통제',watch:'상시 관제',records:'권역 지도 / 봉쇄 규정 / 기록 통제',summary:'U.A.C는 현장 작전, 조사 기록, 연구 자료, 민간 통제 기준을 하나의 관제망으로 묶어 최종 판단을 내리는 중심 기관이다.'},
      nhc:{name:'N.H.C',img:'nhc.webp',tag:'통제',role:'현장 작전',ring:'1차 작전권',x:50,y:21,grade:'OP-1',risk:'고위험 투입',watch:'직접 지휘',records:'N.H.C 현장 작전·장비·봉쇄 규정',summary:'N.H.C는 레드존과 블랙존 외곽에 진입하는 주 현장 전력이며, U.A.C 명령에 따라 봉쇄·구출·교전 기준을 수행한다.'},
      sid:{name:'S.I.D',img:'sid.webp',tag:'감시',role:'특수 조사',ring:'1차 작전권',x:72,y:36,grade:'INV-2',risk:'정보 민감',watch:'기록 송신',records:'사건 좌표 / 현상 기록 / 실종 조사',summary:'S.I.D는 실종, 오컬트 범죄, 우시노다교 흔적을 추적하며 조사 결과를 U.A.C 중앙 기록망으로 송신한다.'},
      fhc:{name:'F.H.C',img:'fhc.webp',tag:'감시',role:'극비 연구',ring:'1차 감시권',x:72,y:64,grade:'LAB-2',risk:'은폐 가능성',watch:'상호 감시',records:'F.H.C 극비 보안 문서',summary:'F.H.C의 연구 자료는 대응에 필요하지만, 생체 실험과 자료 은폐 가능성 때문에 U.A.C의 감시선 안에 묶인다.'},
      cpd:{name:'C.P.D',img:'cpd.webp',tag:'감시',role:'민간 통제국',ring:'1차 작전권',x:28,y:50,grade:'CIV-3',risk:'민간 접촉',watch:'행정 감시',records:'대피·검문·선별 기록',summary:'C.P.D는 검문, 피난민 분리, 귀환자 선별 같은 민간 통제 축을 담당한다. C.P.D 대피버스·차량 단위는 관계도 노드에서 제외된다.'},
      arf:{name:'A.R.F',img:'arf.webp',tag:'통제',role:'회수 부대',ring:'2차 후속권',x:35,y:30,grade:'REC-2',risk:'오염 회수',watch:'N.H.C 연계',records:'회수·소각 연계 절차',summary:'A.R.F는 N.H.C가 확보한 현장에 후속 진입하여 생존자, 샘플, 기록 매체를 회수한다. 독자 행동 시 U.A.C 감시 대상으로 전환된다.'},
      ashcrew:{name:'Ash Crew',img:'ashcrew.webp',tag:'통제',role:'오염 처리',ring:'2차 후속권',x:65,y:30,grade:'ASH-2',risk:'잔류 오염',watch:'N.H.C 연계',records:'오염된 장비 / 소각 기록',summary:'Ash Crew는 전투 후 남은 오염 장비, 사체, 잔류물을 봉인·회수·소각하는 후속 처리반이다.'},
      amarion:{name:'Amarion',img:'amarion.webp',tag:'비공식 접촉',role:'민간 연구망',ring:'2차 위험권',x:64,y:78,grade:'BIO-4',risk:'비인가 실험',watch:'F.H.C 경유 감시',records:'연구 연결 / 비인가 자료',summary:'Amarion은 제약·생명공학 자료를 통해 F.H.C와 연결되지만, 비인가 실험 기록 때문에 공식 협력으로 분류되지 않는다.'},
      syndicate:{name:'Syndicate',img:'syndicate.webp',tag:'적대',role:'이탈 네트워크',ring:'2차 위험권',x:36,y:78,grade:'HOST-1',risk:'교전 가능',watch:'추적 대상',records:'레드울프 이탈 기록',summary:'Syndicate는 비공식 무장 네트워크이며, 레드울프 계열 이탈 작전 집단과 연결된 추적 대상이다.'},
      ushinoda:{name:'Ushnoda Cult',img:'ushinoda.webp',tag:'적대',role:'의식 범죄',ring:'외곽 적대권',x:18,y:67,grade:'RIT-0',risk:'블랙존화',watch:'차단 대상',records:'우시노다교 의식성 오염',summary:'Ushnoda Cult는 의식성 오염, 기억 왜곡, 인신공양, 블랙존화 징후와 직접 연결되는 핵심 적대 세력이다.'},
      haimun:{name:'Haimun',img:'haimun.webp',tag:'불명',role:'도심 침투',ring:'외곽 불명권',x:18,y:33,grade:'UNK-3',risk:'구조 불명',watch:'잠복 감시',records:'하이문 도심 침투 기록',summary:'Haimun은 도심권 납치와 의식 흔적에 반복적으로 등장하지만 지휘 구조와 상위 연결은 아직 불명으로 남아 있다.'}
    };
    const edges=[
      {a:'uac',b:'nhc',type:'command',label:'작전 통제',desc:'U.A.C가 권역 대응 기준을 내리고 N.H.C가 현장 투입과 봉쇄 작전을 수행한다.'},
      {a:'uac',b:'sid',type:'watch',label:'조사/감시',desc:'S.I.D는 현장 조사와 기록 검증을 담당하고 U.A.C에 정보와 징후를 보고한다.'},
      {a:'uac',b:'fhc',type:'limited',label:'제한 협력 / 감시',desc:'F.H.C 연구 자료는 필요하지만 위험성이 높아 U.A.C가 지속 감시한다.'},
      {a:'uac',b:'cpd',type:'command',label:'민간 통제',desc:'민간 대피, 검문, 도시 통제 기준을 공유한다.'},
      {a:'uac',b:'arf',type:'watch',label:'감시 / 제한 접촉',desc:'회수·복구 활동은 허용되지만 독자 행동 때문에 감시 대상이다.'},
      {a:'uac',b:'ushinoda',type:'hostile',label:'적대 차단',desc:'의식성 오염 확산과 정보 교란으로 U.A.C 대응 체계와 충돌한다.'},
      {a:'uac',b:'haimun',type:'unknown',label:'불명 / 위험',desc:'명확한 지휘체계는 불명이나 여러 오염 사건에서 반복적으로 언급된다.'},
      {a:'nhc',b:'sid',type:'command',label:'현장 정보 공유',desc:'N.H.C가 확보한 현장 데이터를 S.I.D가 분석·검증한다.'},
      {a:'nhc',b:'cpd',type:'command',label:'봉쇄/대피 협력',desc:'민간 통제선, 대피 루트, 검문소 운영에서 협력한다.'},
      {a:'nhc',b:'fhc',type:'limited',label:'회수 자료 인계 / 불신',desc:'개체·장비·오염 샘플 인계는 있으나 현장 부대는 F.H.C를 신뢰하지 않는다.'},
      {a:'nhc',b:'arf',type:'command',label:'후속 회수',desc:'현장 확보 이후 A.R.F가 생존자, 장비, 기록 매체를 회수한다.'},
      {a:'nhc',b:'ashcrew',type:'command',label:'오염 처리',desc:'Ash Crew는 전투 후 남은 오염 잔류물을 봉인하거나 소각한다.'},
      {a:'nhc',b:'ushinoda',type:'hostile',label:'현장 교전',desc:'우시노다교 의식 오염과 현장 교전 기록이 다수 존재한다.'},
      {a:'nhc',b:'syndicate',type:'hostile',label:'이탈 추적',desc:'Syndicate 내부 레드울프 계열은 N.H.C 이탈 기록과 연결된다.'},
      {a:'sid',b:'ushinoda',type:'watch',label:'조사 대상',desc:'S.I.D가 우시노다교 신호, 문서, 현장 잔류 의식을 추적한다.'},
      {a:'sid',b:'haimun',type:'watch',label:'감시',desc:'하이문 관련 기록은 직접 증거보다 간접 신호가 많아 감시 상태가 유지된다.'},
      {a:'fhc',b:'syndicate',type:'informal',label:'비공식 접촉',desc:'비인가 장비·샘플·연구 자재 유통 의혹이 남아 있다.'},
      {a:'fhc',b:'amarion',type:'informal',label:'비공식 연구 접촉',desc:'인공 개체, 혼합 개체, 비인가 실험과의 연계가 의심된다.'},
      {a:'syndicate',b:'ashcrew',type:'informal',label:'거래/회수 루트',desc:'오염지대 잔해, 장비, 회수품을 둘러싼 비공식 거래망 정황이 있다.'},
      {a:'syndicate',b:'amarion',type:'informal',label:'은닉 지원',desc:'실험 시설과 자금 흐름이 간접적으로 연결된 정황이 있다.'},
      {a:'ushinoda',b:'haimun',type:'ritual',label:'의식성 접촉 / 불명',desc:'우시노다교 의식과 하이문 측 오염 기록 사이의 반복적 접점이 확인된다.'}
    ];
    const related={}; Object.keys(nodes).forEach(k=>related[k]=new Set([k])); edges.forEach(e=>{related[e.a].add(e.b); related[e.b].add(e.a);});
    function curve(e){ const a=nodes[e.a],b=nodes[e.b]; if(!a||!b) return ''; if(e.a==='uac'||e.b==='uac') return 'M '+a.x+' '+a.y+' L '+b.x+' '+b.y; const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=mx-50,dy=my-50,len=Math.max(1,Math.sqrt(dx*dx+dy*dy)),push=(e.type==='hostile'||e.type==='ritual')?9:e.type==='informal'?7:5,cx=mx+(dx/len)*push,cy=my+(dy/len)*push; return 'M '+a.x+' '+a.y+' Q '+cx+' '+cy+' '+b.x+' '+b.y; }
    function edgeHtml(e,i){ return '<path class="pc57-edge '+esc(e.type)+'" data-edge-index="'+i+'" data-edge-a="'+esc(e.a)+'" data-edge-b="'+esc(e.b)+'" d="'+curve(e)+'"><title>'+esc(nodes[e.a].name+' ↔ '+nodes[e.b].name+' / '+e.label+' / '+e.desc)+'</title></path>'; }
    function nodeHtml(k){ const n=nodes[k],cls=statusClass[n.tag]||'unknown'; return '<button type="button" class="pc57-node '+cls+(k==='uac'?' uac':'')+'" data-faction-key="'+esc(k)+'" style="left:'+n.x+'%;top:'+n.y+'%" aria-label="'+esc(n.name)+' 관계 분석"><img src="'+esc(prefix)+'assets/faction_marks/'+esc(n.img)+'" alt="'+esc(n.name)+'"><b>'+esc(n.name)+'</b><small>'+esc(n.role)+'</small><span class="pc57-tag">'+esc(n.tag)+'</span></button>'; }
    function buildTable(){ const tbody=section.querySelector('.relation-table tbody'); if(!tbody) return; const rowClass={command:'friendly',watch:'neutral',limited:'neutral',hostile:'hostile',ritual:'hostile',informal:'neutral',unknown:'neutral'}; tbody.innerHTML=edges.map((e,i)=>'<tr data-edge-index="'+i+'" data-edge-a="'+esc(e.a)+'" data-edge-b="'+esc(e.b)+'"><td class="'+(rowClass[e.type]||'neutral')+'">'+esc(typeLabel[e.type]||e.type)+'</td><td>'+esc(nodes[e.a].name+' ↔ '+nodes[e.b].name)+'</td><td>'+esc(e.label)+'</td><td>'+esc(e.desc)+'</td></tr>').join(''); }
    function render(){
      const tree=section.querySelector('.relation-tree-panel'); if(!tree) return;
      section.classList.add('pc57-default-view');
      tree.classList.add('pc57-radial-panel');
      tree.setAttribute('aria-label','U.A.C 중심 3단 링 세력 관계도');
      const order=['uac','nhc','sid','fhc','cpd','arf','ashcrew','amarion','syndicate','ushinoda','haimun'];
      tree.innerHTML='<div class="pc57-matrix"><div class="pc57-title"><b>RELATION TRACE MATRIX</b><span>U.A.C 중심 3단 링 / 연결 노드 가시성 복구 / 오디오 중복 재생 억제</span></div><svg class="pc57-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><circle class="pc57-ring core" cx="50" cy="50" r="14"/><circle class="pc57-ring inner" cx="50" cy="50" r="25"/><circle class="pc57-ring mid" cx="50" cy="50" r="36"/><circle class="pc57-ring outer" cx="50" cy="50" r="44"/>'+edges.map(edgeHtml).join('')+'</svg>'+order.map(nodeHtml).join('')+'</div>';
      const brief=section.querySelector('.section-brief');
      if(brief) brief.innerHTML='U.A.C 관계도는 조직 노드와 직접 연결 경로를 우선 표시한다. 기본 상태에서는 모든 세력이 선명하게 보이고, 노드를 선택한 뒤에만 선택 세력·직접 연결 세력·비관련 세력이 단계적으로 구분된다. C.P.D 대피버스·차량·장비 단위는 관계도 노드에서 제외된다.';
      const cap=section.querySelector('.map-caption'); if(cap) cap.textContent='기본 상태에서는 모든 노드가 표시된다. 노드 선택 시 직접 연결 경로만 강조되며, 무관 노드는 완전히 숨기지 않고 낮은 명도로만 후퇴한다.';
      buildTable();
      section.querySelectorAll('.pc563-status-strip,.pc5641-status-strip,.pc57-status-strip').forEach(el=>el.remove());
      const legend=section.querySelector('.relation-legend');
      if(legend){ const strip=document.createElement('div'); strip.className='pc57-status-strip'; strip.innerHTML=['통제','감시','적대','불명','비공식 접촉','제한 협력'].map(s=>'<span class="pc57-mini-status '+(statusClass[s]||'unknown')+'">'+esc(s)+'</span>').join(''); legend.insertAdjacentElement('afterend',strip); }
    }
    function ensurePanel(){ section.querySelectorAll('.pc563-analysis-panel,.pc564-analysis-panel,.pc5641-analysis-panel').forEach(el=>el.remove()); let p=section.querySelector('.pc57-analysis-panel'); if(p) return p; p=document.createElement('div'); p.className='pc57-analysis-panel'; p.innerHTML='<div class="pc57-analysis-head"><b>TRACE ANALYSIS</b><span data-pc57-state>NO NODE SELECTED / ALL NODES VISIBLE</span></div><div class="pc57-analysis-grid"><span><b>선택 세력</b><i data-pc57-name>대기 중</i></span><span><b>상태 태그</b><i data-pc57-status>전체 표시</i></span><span><b>관계 등급</b><i data-pc57-grade>STANDBY</i></span><span><b>감시 상태</b><i data-pc57-watch>선택 대기</i></span><span><b>직접 연결</b><i data-pc57-links>노드를 선택하면 직접 연결 경로가 표시된다.</i></span><span><b>위험도</b><i data-pc57-risk>전체 관제</i></span><span><b>관련 기록</b><i data-pc57-records>기록 연결 대기</i></span><span class="wide"><b>U.A.C 판단</b><i data-pc57-summary>기본 상태에서는 모든 노드와 주요 관계선을 가시 상태로 유지한다.</i></span><span class="wide"><b>관계 기록</b><i data-pc57-edge-note>선택된 세력 없음.</i></span></div>'; const tree=section.querySelector('.relation-tree-panel'); if(tree) tree.insertAdjacentElement('afterend',p); else section.appendChild(p); return p; }
    function edgeList(k){return edges.filter(e=>e.a===k||e.b===k).map(e=>{const other=e.a===k?e.b:e.a; return nodes[other].name+' · '+e.label+' — '+e.desc;});}
    function reset(){ section.dataset.pc57Focus=''; section.classList.add('pc57-default-view'); section.querySelectorAll('.pc57-node').forEach(btn=>btn.classList.remove('selected','related','muted')); section.querySelectorAll('.pc57-edge').forEach(edge=>edge.classList.remove('focus','dim')); section.querySelectorAll('.relation-table tbody tr').forEach(row=>row.classList.remove('pc57-row-active','pc57-row-muted','pc5641-row-active','pc5641-row-muted','pc564-row-active','pc564-row-muted','relation-row-active','relation-row-muted')); const p=ensurePanel(); p.querySelector('[data-pc57-state]').textContent='NO NODE SELECTED / ALL NODES VISIBLE'; p.querySelector('[data-pc57-name]').textContent='대기 중'; p.querySelector('[data-pc57-status]').textContent='전체 표시'; p.querySelector('[data-pc57-grade]').textContent='STANDBY'; p.querySelector('[data-pc57-watch]').textContent='선택 대기'; p.querySelector('[data-pc57-links]').textContent='노드를 선택하면 직접 연결 경로가 표시된다.'; p.querySelector('[data-pc57-risk]').textContent='전체 관제'; p.querySelector('[data-pc57-records]').textContent='기록 연결 대기'; p.querySelector('[data-pc57-summary]').textContent='기본 상태에서는 모든 노드와 주요 관계선을 가시 상태로 유지한다.'; p.querySelector('[data-pc57-edge-note]').textContent='선택된 세력 없음.'; }
    function tone(k){ try{ if(localStorage.getItem('pc_audio_legacy2003_fixed')==='off') return; const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return; const ctx=window.__pc57Ctx||(window.__pc57Ctx=new AC()); if(ctx.state==='suspended') ctx.resume().catch(()=>{}); const n=nodes[k]||nodes.uac; const cls=statusClass[n.tag]||'control'; const f=cls==='hostile'?175:cls==='informal'?300:cls==='watch'?250:400; const o=ctx.createOscillator(),g=ctx.createGain(); o.type=cls==='hostile'?'sawtooth':'triangle'; o.frequency.setValueAtTime(f,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(f*1.16,ctx.currentTime+.06); g.gain.setValueAtTime(.0001,ctx.currentTime); g.gain.exponentialRampToValueAtTime(.010,ctx.currentTime+.012); g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.095); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+.11); }catch(e){} }
    function focus(k,opts={}){ if(!nodes[k]) return reset(); const n=nodes[k],rel=related[k]||new Set([k]); section.classList.remove('pc57-default-view'); section.dataset.pc57Focus=k; section.querySelectorAll('.pc57-node').forEach(btn=>{ const key=btn.dataset.factionKey; btn.classList.toggle('selected',key===k); btn.classList.toggle('related',key!==k&&rel.has(key)); btn.classList.toggle('muted',!rel.has(key)); }); section.querySelectorAll('.pc57-edge').forEach(edge=>{ const a=edge.dataset.edgeA,b=edge.dataset.edgeB,active=(a===k||b===k); edge.classList.toggle('focus',active); edge.classList.toggle('dim',!active); }); section.querySelectorAll('.relation-table tbody tr').forEach(row=>{ const active=(row.dataset.edgeA===k||row.dataset.edgeB===k); row.classList.toggle('pc57-row-active',active); row.classList.toggle('pc57-row-muted',!active); row.classList.remove('pc5641-row-active','pc5641-row-muted','pc564-row-active','pc564-row-muted','relation-row-active','relation-row-muted'); }); const p=ensurePanel(); p.querySelector('[data-pc57-state]').textContent='NODE: '+n.name+' / TRACE ACTIVE'; p.querySelector('[data-pc57-name]').textContent=n.name+' / '+n.role+' / '+n.ring; p.querySelector('[data-pc57-status]').textContent=n.tag; p.querySelector('[data-pc57-grade]').textContent=n.grade; p.querySelector('[data-pc57-watch]').textContent=n.watch; p.querySelector('[data-pc57-links]').textContent=Array.from(rel).filter(x=>x!==k).map(x=>nodes[x].name).join(' / ') || '직접 연결 없음'; p.querySelector('[data-pc57-risk]').textContent=n.risk; p.querySelector('[data-pc57-records]').textContent=n.records; p.querySelector('[data-pc57-summary]').textContent=n.summary; p.querySelector('[data-pc57-edge-note]').textContent=edgeList(k).join('  |  ') || '관계 기록 없음'; const notice=document.querySelector('[data-srv-notice]'),trace=document.querySelector('[data-srv-trace]'); if(notice) notice.textContent='RELATION TRACE MATRIX / '+n.name+' / '+n.tag; if(trace){ trace.textContent='RELATION TRACE MATRIX: '+n.name; trace.className='status-field status-map'; } if(!opts.silent) tone(k); }
    function bind(){ section.querySelectorAll('.pc57-node').forEach(btn=>{ btn.addEventListener('click',()=>focus(btn.dataset.factionKey)); btn.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();focus(btn.dataset.factionKey);}}); }); section.querySelectorAll('.relation-table tbody tr').forEach(row=>{ row.setAttribute('tabindex','0'); row.addEventListener('click',()=>focus(row.dataset.edgeA||'uac')); }); section.querySelector('.pc57-title')?.addEventListener('dblclick',reset); document.querySelectorAll('.side-menu a[data-target="faction-relation"]').forEach(a=>{ a.addEventListener('click',()=>setTimeout(()=>{render();ensurePanel();bind();reset();},310),true); }); }
    render(); ensurePanel(); bind(); reset();
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch57:'Audio FX Polish + Faction Relation Node Visibility Fix'});

// PATCH 5.7.1 — RestrictedRecordFXAudit + FactionRelationFocusLogicFix
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const section=document.getElementById('faction-relation');
    if(!section) return;
    const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const prefix=(document.body&&document.body.dataset&&document.body.dataset.basePath)||'';
    const statusClass={'통제':'control','감시':'watch','적대':'hostile','불명':'unknown','비공식 접촉':'informal','제한 협력':'limited'};
    const typeLabel={command:'작전 통제',watch:'조사/감시',limited:'제한 협력',hostile:'적대/교전',ritual:'의식성 침투',informal:'비공식 접촉',unknown:'불명/자료 부족'};
    const nodes={
      uac:{name:'U.A.C',img:'uac.webp',tag:'통제',role:'상위 조정기관',ring:'중심 관제',x:50,y:50,grade:'CORE-0',risk:'중심 통제',watch:'상시 관제',records:'권역 지도 / 봉쇄 규정 / 기록 통제',summary:'U.A.C는 현장 작전, 조사 기록, 연구 자료, 민간 통제 기준을 하나의 관제망으로 묶어 최종 판단을 내리는 중심 기관이다.'},
      nhc:{name:'N.H.C',img:'nhc.webp',tag:'통제',role:'현장 작전',ring:'1차 작전권',x:50,y:22,grade:'OP-1',risk:'고위험 투입',watch:'직접 지휘',records:'N.H.C 현장 작전·장비·봉쇄 규정',summary:'N.H.C는 레드존과 블랙존 외곽에 진입하는 주 현장 전력이며, U.A.C 명령에 따라 봉쇄·구출·교전 기준을 수행한다.'},
      sid:{name:'S.I.D',img:'sid.webp',tag:'감시',role:'특수 조사',ring:'1차 작전권',x:72,y:36,grade:'INV-2',risk:'정보 민감',watch:'기록 송신',records:'사건 좌표 / 현상 기록 / 실종 조사',summary:'S.I.D는 실종, 오컬트 범죄, 우시노다교 흔적을 추적하며 조사 결과를 U.A.C 중앙 기록망으로 송신한다.'},
      fhc:{name:'F.H.C',img:'fhc.webp',tag:'감시',role:'극비 연구',ring:'1차 감시권',x:72,y:64,grade:'LAB-2',risk:'은폐 가능성',watch:'상호 감시',records:'F.H.C 극비 보안 문서',summary:'F.H.C의 연구 자료는 대응에 필요하지만, 생체 실험과 자료 은폐 가능성 때문에 U.A.C의 감시선 안에 묶인다.'},
      cpd:{name:'C.P.D',img:'cpd.webp',tag:'감시',role:'민간 통제국',ring:'1차 작전권',x:28,y:50,grade:'CIV-3',risk:'민간 접촉',watch:'행정 감시',records:'대피·검문·선별 기록',summary:'C.P.D는 검문, 피난민 분리, 귀환자 선별 같은 민간 통제 축을 담당한다. C.P.D 대피버스·차량 단위는 관계도 노드에서 제외된다.'},
      arf:{name:'A.R.F',img:'arf.webp',tag:'통제',role:'회수 부대',ring:'2차 후속권',x:34,y:30,grade:'REC-2',risk:'오염 회수',watch:'N.H.C 연계',records:'회수·소각 연계 절차',summary:'A.R.F는 N.H.C가 확보한 현장에 후속 진입하여 생존자, 샘플, 기록 매체를 회수한다. 독자 행동 시 U.A.C 감시 대상으로 전환된다.'},
      ashcrew:{name:'Ash Crew',img:'ashcrew.webp',tag:'통제',role:'오염 처리',ring:'2차 후속권',x:66,y:30,grade:'ASH-2',risk:'잔류 오염',watch:'N.H.C 연계',records:'오염된 장비 / 소각 기록',summary:'Ash Crew는 전투 후 남은 오염 장비, 사체, 잔류물을 봉인·회수·소각하는 후속 처리반이다.'},
      amarion:{name:'Amarion',img:'amarion.webp',tag:'비공식 접촉',role:'민간 연구망',ring:'2차 위험권',x:66,y:78,grade:'BIO-4',risk:'비인가 실험',watch:'F.H.C 경유 감시',records:'연구 연결 / 비인가 자료',summary:'Amarion은 제약·생명공학 자료를 통해 F.H.C와 연결되지만, 비인가 실험 기록 때문에 공식 협력으로 분류되지 않는다.'},
      syndicate:{name:'Syndicate',img:'syndicate.webp',tag:'적대',role:'이탈 네트워크',ring:'2차 위험권',x:34,y:78,grade:'HOST-1',risk:'교전 가능',watch:'추적 대상',records:'레드울프 이탈 기록',summary:'Syndicate는 비공식 무장 네트워크이며, 레드울프 계열 이탈 작전 집단과 연결된 추적 대상이다.'},
      ushinoda:{name:'Ushnoda Cult',img:'ushinoda.webp',tag:'적대',role:'의식 범죄',ring:'외곽 적대권',x:17,y:66,grade:'RIT-0',risk:'블랙존화',watch:'차단 대상',records:'우시노다교 의식성 오염',summary:'Ushnoda Cult는 의식성 오염, 기억 왜곡, 인신공양, 블랙존화 징후와 직접 연결되는 핵심 적대 세력이다.'},
      haimun:{name:'Haimun',img:'haimun.webp',tag:'불명',role:'도심 침투',ring:'외곽 불명권',x:17,y:34,grade:'UNK-3',risk:'구조 불명',watch:'잠복 감시',records:'하이문 도심 침투 기록',summary:'Haimun은 도심권 납치와 의식 흔적에 반복적으로 등장하지만 지휘 구조와 상위 연결은 아직 불명으로 남아 있다.'}
    };
    const idAlias={uac:'uac',UAC:'uac','U.A.C':'uac',nhc:'nhc','N.H.C':'nhc',sid:'sid','S.I.D':'sid',fhc:'fhc','F.H.C':'fhc',cpd:'cpd','C.P.D':'cpd',arf:'arf','A.R.F':'arf',ashcrew:'ashcrew','Ash Crew':'ashcrew',syndicate:'syndicate','Syndicate':'syndicate',ushinoda:'ushinoda',ushnoda:'ushinoda','Ushnoda Cult':'ushinoda','Ushinoda Cult':'ushinoda',haimun:'haimun','Haimun':'haimun',amarion:'amarion','Amarion':'amarion'};
    const canon=(v)=>idAlias[v]||idAlias[String(v||'').trim()]||String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'');
    const edges=[
      {a:'uac',b:'nhc',type:'command',label:'작전 통제',desc:'U.A.C가 권역 대응 기준을 내리고 N.H.C가 현장 투입과 봉쇄 작전을 수행한다.'},
      {a:'uac',b:'sid',type:'watch',label:'조사/감시',desc:'S.I.D는 현장 조사와 기록 검증을 담당하고 U.A.C에 정보와 징후를 보고한다.'},
      {a:'uac',b:'fhc',type:'limited',label:'제한 협력 / 감시',desc:'F.H.C 연구 자료는 필요하지만 위험성이 높아 U.A.C가 지속 감시한다.'},
      {a:'uac',b:'cpd',type:'command',label:'민간 통제',desc:'민간 대피, 검문, 도시 통제 기준을 공유한다.'},
      {a:'uac',b:'arf',type:'watch',label:'감시 / 제한 접촉',desc:'회수·복구 활동은 허용되지만 독자 행동 때문에 감시 대상이다.'},
      {a:'uac',b:'ushinoda',type:'hostile',label:'적대 차단',desc:'의식성 오염 확산과 정보 교란으로 U.A.C 대응 체계와 충돌한다.'},
      {a:'uac',b:'haimun',type:'unknown',label:'불명 / 위험',desc:'명확한 지휘체계는 불명이나 여러 오염 사건에서 반복적으로 언급된다.'},
      {a:'nhc',b:'sid',type:'command',label:'현장 정보 공유',desc:'N.H.C가 확보한 현장 데이터를 S.I.D가 분석·검증한다.'},
      {a:'nhc',b:'cpd',type:'command',label:'봉쇄/대피 협력',desc:'민간 통제선, 대피 루트, 검문소 운영에서 협력한다.'},
      {a:'nhc',b:'fhc',type:'limited',label:'회수 자료 인계 / 불신',desc:'개체·장비·오염 샘플 인계는 있으나 현장 부대는 F.H.C를 신뢰하지 않는다.'},
      {a:'nhc',b:'arf',type:'command',label:'후속 회수',desc:'현장 확보 이후 A.R.F가 생존자, 장비, 기록 매체를 회수한다.'},
      {a:'nhc',b:'ashcrew',type:'command',label:'오염 처리',desc:'Ash Crew는 전투 후 남은 오염 잔류물을 봉인하거나 소각한다.'},
      {a:'nhc',b:'ushinoda',type:'hostile',label:'현장 교전',desc:'우시노다교 의식 오염과 현장 교전 기록이 다수 존재한다.'},
      {a:'nhc',b:'syndicate',type:'hostile',label:'이탈 추적',desc:'Syndicate 내부 레드울프 계열은 N.H.C 이탈 기록과 연결된다.'},
      {a:'sid',b:'ushinoda',type:'watch',label:'조사 대상',desc:'S.I.D가 우시노다교 신호, 문서, 현장 잔류 의식을 추적한다.'},
      {a:'sid',b:'haimun',type:'watch',label:'감시',desc:'하이문 관련 기록은 직접 증거보다 간접 신호가 많아 감시 상태가 유지된다.'},
      {a:'fhc',b:'syndicate',type:'informal',label:'비공식 접촉',desc:'비인가 장비·샘플·연구 자재 유통 의혹이 남아 있다.'},
      {a:'fhc',b:'amarion',type:'informal',label:'비공식 연구 접촉',desc:'인공 개체, 혼합 개체, 비인가 실험과의 연계가 의심된다.'},
      {a:'syndicate',b:'ashcrew',type:'informal',label:'거래/회수 루트',desc:'오염지대 잔해, 장비, 회수품을 둘러싼 비공식 거래망 정황이 있다.'},
      {a:'syndicate',b:'amarion',type:'informal',label:'은닉 지원',desc:'실험 시설과 자금 흐름이 간접적으로 연결된 정황이 있다.'},
      {a:'ushinoda',b:'haimun',type:'ritual',label:'의식성 접촉 / 불명',desc:'우시노다교 의식과 하이문 측 오염 기록 사이의 반복적 접점이 확인된다.'}
    ].map(e=>Object.assign({},e,{a:canon(e.a),b:canon(e.b)}));
    const related={}; Object.keys(nodes).forEach(k=>related[k]=new Set([k])); edges.forEach(e=>{ if(nodes[e.a]&&nodes[e.b]){ related[e.a].add(e.b); related[e.b].add(e.a); }});
    function secondarySet(k){ const out=new Set(); (related[k]||new Set()).forEach(r=>{ (related[r]||new Set()).forEach(x=>{ if(x!==k && !(related[k]||new Set()).has(x)) out.add(x); }); }); return out; }
    function curve(e){ const a=nodes[e.a],b=nodes[e.b]; if(!a||!b) return ''; if(e.a==='uac'||e.b==='uac') return 'M '+a.x+' '+a.y+' L '+b.x+' '+b.y; const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=mx-50,dy=my-50,len=Math.max(1,Math.sqrt(dx*dx+dy*dy)),push=(e.type==='hostile'||e.type==='ritual')?8:e.type==='informal'?6:4,cx=mx+(dx/len)*push,cy=my+(dy/len)*push; return 'M '+a.x+' '+a.y+' Q '+cx+' '+cy+' '+b.x+' '+b.y; }
    function edgeHtml(e,i){ return '<path class="pc571-edge '+esc(e.type)+'" data-edge-index="'+i+'" data-edge-a="'+esc(e.a)+'" data-edge-b="'+esc(e.b)+'" d="'+curve(e)+'"><title>'+esc(nodes[e.a].name+' ↔ '+nodes[e.b].name+' / '+e.label+' / '+e.desc)+'</title></path>'; }
    function nodeHtml(k){ const n=nodes[k],cls=statusClass[n.tag]||'unknown'; return '<button type="button" class="pc571-node '+cls+(k==='uac'?' uac':'')+'" data-faction-key="'+esc(k)+'" style="left:'+n.x+'%;top:'+n.y+'%" aria-label="'+esc(n.name)+' 관계 분석"><img src="'+esc(prefix)+'assets/faction_marks/'+esc(n.img)+'" alt="'+esc(n.name)+'"><b>'+esc(n.name)+'</b><small>'+esc(n.role)+'</small><span class="pc571-tag">'+esc(n.tag)+'</span></button>'; }
    function buildTable(){ const tbody=section.querySelector('.relation-table tbody'); if(!tbody) return; const rowClass={command:'friendly',watch:'neutral',limited:'neutral',hostile:'hostile',ritual:'hostile',informal:'neutral',unknown:'neutral'}; tbody.innerHTML=edges.map((e,i)=>'<tr data-edge-index="'+i+'" data-edge-a="'+esc(e.a)+'" data-edge-b="'+esc(e.b)+'"><td class="'+(rowClass[e.type]||'neutral')+'">'+esc(typeLabel[e.type]||e.type)+'</td><td>'+esc(nodes[e.a].name+' ↔ '+nodes[e.b].name)+'</td><td>'+esc(e.label)+'</td><td>'+esc(e.desc)+'</td></tr>').join(''); }
    function renderRelation(){
      const tree=section.querySelector('.relation-tree-panel'); if(!tree) return;
      section.classList.add('pc571-faction-focus-fix','pc571-default-view');
      tree.classList.add('pc571-radial-panel');
      tree.setAttribute('aria-label','U.A.C 중심 3단 링 세력 관계도');
      const order=['uac','nhc','sid','fhc','cpd','arf','ashcrew','amarion','syndicate','ushinoda','haimun'];
      tree.innerHTML='<div class="pc571-matrix"><div class="pc571-title"><b>RELATION TRACE MATRIX</b><span>U.A.C 선택 시 직접 연결 노드가 드러나도록 포커스 판정 보정</span></div><div class="pc571-ring-label core">중심 관제</div><div class="pc571-ring-label inner">1차 작전권</div><div class="pc571-ring-label mid">후속/위험권</div><div class="pc571-ring-label outer">외곽 불명권</div><svg class="pc571-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><circle class="pc571-ring core" cx="50" cy="50" r="14"/><circle class="pc571-ring inner" cx="50" cy="50" r="25"/><circle class="pc571-ring mid" cx="50" cy="50" r="36"/><circle class="pc571-ring outer" cx="50" cy="50" r="44"/>'+edges.map(edgeHtml).join('')+'</svg>'+order.map(nodeHtml).join('')+'</div>';
      const brief=section.querySelector('.section-brief');
      if(brief) brief.innerHTML='U.A.C 관계도는 선택한 세력을 중심으로 직접 연결 노드를 드러내고, 2차 연결 노드는 중간 명도로 유지한다. 기본 상태에서는 모든 조직 노드가 표시되며, C.P.D 대피버스·차량·장비 단위는 관계도 노드에서 제외된다.';
      const cap=section.querySelector('.map-caption'); if(cap) cap.textContent='U.A.C를 선택하면 N.H.C, S.I.D, F.H.C, C.P.D, A.R.F, Ushnoda Cult, Haimun이 직접 연결 노드로 강조된다.';
      buildTable();
      section.querySelectorAll('.pc563-status-strip,.pc5641-status-strip,.pc57-status-strip,.pc571-status-strip').forEach(el=>el.remove());
      const legend=section.querySelector('.relation-legend');
      if(legend){ const strip=document.createElement('div'); strip.className='pc571-status-strip'; strip.innerHTML=['통제','감시','적대','불명','비공식 접촉','제한 협력'].map(s=>'<span class="pc571-mini-status '+(statusClass[s]||'unknown')+'">'+esc(s)+'</span>').join(''); legend.insertAdjacentElement('afterend',strip); }
    }
    function ensurePanel(){ section.querySelectorAll('.pc563-analysis-panel,.pc564-analysis-panel,.pc5641-analysis-panel,.pc57-analysis-panel').forEach(el=>el.remove()); let p=section.querySelector('.pc571-analysis-panel'); if(p) return p; p=document.createElement('div'); p.className='pc571-analysis-panel'; p.innerHTML='<div class="pc571-analysis-head"><b>TRACE ANALYSIS</b><span data-pc571-state>NO NODE SELECTED / ALL NODES VISIBLE</span></div><div class="pc571-analysis-grid"><span><b>선택 세력</b><i data-pc571-name>대기 중</i></span><span><b>상태 태그</b><i data-pc571-status>전체 표시</i></span><span><b>관계 등급</b><i data-pc571-grade>STANDBY</i></span><span><b>감시 상태</b><i data-pc571-watch>선택 대기</i></span><span><b>직접 연결</b><i data-pc571-links>노드를 선택하면 직접 연결 경로가 표시된다.</i></span><span><b>2차 연결</b><i data-pc571-secondary>선택 대기</i></span><span><b>관련 기록</b><i data-pc571-records>기록 연결 대기</i></span><span class="wide"><b>U.A.C 판단</b><i data-pc571-summary>기본 상태에서는 모든 노드와 주요 관계선을 가시 상태로 유지한다.</i></span><span class="wide"><b>관계 기록</b><i data-pc571-edge-note>선택된 세력 없음.</i></span></div>'; const tree=section.querySelector('.relation-tree-panel'); if(tree) tree.insertAdjacentElement('afterend',p); else section.appendChild(p); return p; }
    function edgeList(k){return edges.filter(e=>e.a===k||e.b===k).map(e=>{const other=e.a===k?e.b:e.a; return nodes[other].name+' · '+e.label+' — '+e.desc;});}
    function reset(){ section.dataset.pc571Focus=''; section.classList.add('pc571-default-view'); section.querySelectorAll('.pc571-node').forEach(btn=>btn.classList.remove('selected','related','secondary','muted')); section.querySelectorAll('.pc571-edge').forEach(edge=>edge.classList.remove('focus','secondary','dim')); section.querySelectorAll('.relation-table tbody tr').forEach(row=>row.classList.remove('pc571-row-active','pc571-row-muted','pc57-row-active','pc57-row-muted','pc5641-row-active','pc5641-row-muted','pc564-row-active','pc564-row-muted','relation-row-active','relation-row-muted')); const p=ensurePanel(); p.querySelector('[data-pc571-state]').textContent='NO NODE SELECTED / ALL NODES VISIBLE'; p.querySelector('[data-pc571-name]').textContent='대기 중'; p.querySelector('[data-pc571-status]').textContent='전체 표시'; p.querySelector('[data-pc571-grade]').textContent='STANDBY'; p.querySelector('[data-pc571-watch]').textContent='선택 대기'; p.querySelector('[data-pc571-links]').textContent='노드를 선택하면 직접 연결 경로가 표시된다.'; p.querySelector('[data-pc571-secondary]').textContent='선택 대기'; p.querySelector('[data-pc571-records]').textContent='기록 연결 대기'; p.querySelector('[data-pc571-summary]').textContent='기본 상태에서는 모든 노드와 주요 관계선을 가시 상태로 유지한다.'; p.querySelector('[data-pc571-edge-note]').textContent='선택된 세력 없음.'; }
    function focus(rawKey,opts={}){ const k=canon(rawKey); if(!nodes[k]) return reset(); const n=nodes[k],rel=related[k]||new Set([k]),sec=secondarySet(k); section.classList.remove('pc571-default-view'); section.dataset.pc571Focus=k; section.querySelectorAll('.pc571-node').forEach(btn=>{ const key=canon(btn.dataset.factionKey); const isSelected=key===k, isRelated=key!==k && rel.has(key), isSecondary=key!==k && !rel.has(key) && sec.has(key); btn.classList.toggle('selected',isSelected); btn.classList.toggle('related',isRelated); btn.classList.toggle('secondary',isSecondary); btn.classList.toggle('muted',!isSelected&&!isRelated&&!isSecondary); }); section.querySelectorAll('.pc571-edge').forEach(edge=>{ const a=canon(edge.dataset.edgeA),b=canon(edge.dataset.edgeB),active=(a===k||b===k),secondary=(rel.has(a)||rel.has(b)); edge.classList.toggle('focus',active); edge.classList.toggle('secondary',!active&&secondary); edge.classList.toggle('dim',!active&&!secondary); }); section.querySelectorAll('.relation-table tbody tr').forEach(row=>{ const a=canon(row.dataset.edgeA),b=canon(row.dataset.edgeB),active=(a===k||b===k); row.classList.toggle('pc571-row-active',active); row.classList.toggle('pc571-row-muted',!active); row.classList.remove('pc57-row-active','pc57-row-muted','pc5641-row-active','pc5641-row-muted','pc564-row-active','pc564-row-muted','relation-row-active','relation-row-muted'); }); const p=ensurePanel(); const direct=Array.from(rel).filter(x=>x!==k&&nodes[x]); const second=Array.from(sec).filter(x=>nodes[x]); p.querySelector('[data-pc571-state]').textContent='NODE: '+n.name+' / DIRECT LINKS VISIBLE'; p.querySelector('[data-pc571-name]').textContent=n.name+' / '+n.role+' / '+n.ring; p.querySelector('[data-pc571-status]').textContent=n.tag; p.querySelector('[data-pc571-grade]').textContent=n.grade; p.querySelector('[data-pc571-watch]').textContent=n.watch; p.querySelector('[data-pc571-links]').textContent=direct.map(x=>nodes[x].name).join(' / ') || '직접 연결 없음'; p.querySelector('[data-pc571-secondary]').textContent=second.map(x=>nodes[x].name).join(' / ') || '2차 연결 없음'; p.querySelector('[data-pc571-records]').textContent=n.records; p.querySelector('[data-pc571-summary]').textContent=n.summary; p.querySelector('[data-pc571-edge-note]').textContent=edgeList(k).join('  |  ') || '관계 기록 없음'; const notice=document.querySelector('[data-srv-notice]'),trace=document.querySelector('[data-srv-trace]'); if(notice) notice.textContent='RELATION TRACE MATRIX / '+n.name+' / DIRECT NODES VISIBLE'; if(trace){ trace.textContent='RELATION TRACE MATRIX: '+n.name; trace.className='status-field status-map'; } if(!opts.silent && window.__pc57LastTone!==k){ window.__pc57LastTone=k; setTimeout(()=>{ if(window.__pc57LastTone===k) window.__pc57LastTone=''; },120); }
    }
    function bindRelation(){ section.querySelectorAll('.pc571-node').forEach(btn=>{ if(btn.dataset.pc571Bound) return; btn.dataset.pc571Bound='1'; btn.addEventListener('click',ev=>{ev.stopPropagation();focus(btn.dataset.factionKey);},true); btn.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();focus(btn.dataset.factionKey);}},true); }); section.querySelectorAll('.relation-table tbody tr').forEach(row=>{ row.setAttribute('tabindex','0'); if(row.dataset.pc571Bound) return; row.dataset.pc571Bound='1'; row.addEventListener('click',()=>focus(row.dataset.edgeA||'uac'),true); }); const title=section.querySelector('.pc571-title'); if(title&&!title.dataset.pc571Bound){title.dataset.pc571Bound='1'; title.addEventListener('dblclick',reset,true);} }
    function install(){ renderRelation(); ensurePanel(); bindRelation(); reset(); }
    install();
    const menu=document.querySelectorAll('.side-menu a[data-target="faction-relation"]');
    menu.forEach(a=>a.addEventListener('click',()=>{setTimeout(install,360);setTimeout(install,620);},true));
    let installing=false;
    const tree=section.querySelector('.relation-tree-panel');
    if(tree && window.MutationObserver){
      const mo=new MutationObserver(()=>{ if(installing) return; if(section.offsetParent===null) return; if(!section.querySelector('.pc571-matrix')){ installing=true; setTimeout(()=>{install(); installing=false;},60); } });
      mo.observe(tree,{childList:true,subtree:false});
    }

    // Restricted record FX audit scope: keep F.H.C/video/bio special effects inside their own record groups only.
    const FHC=new Set(['Cults_871104']);
    const VIDEO=new Set(['Immortality_860201','Sakuma_Tape_991028','불명_Record1_860204']);
    const BIO=new Set(['타락 개체_860722','불명_Record2_860205','FCR_Archive_890402','불명_Record5_940626']);
    function auditRecords(){
      document.querySelectorAll('.record-detail').forEach(root=>{
        const id=root.dataset.record||'';
        root.classList.remove('pc571-restricted-audit','pc571-video-audit','pc571-bio-audit');
        root.querySelectorAll('.pc571-audit-badge').forEach(el=>el.remove());
        let label='';
        if(FHC.has(id)){root.classList.add('pc571-restricted-audit'); label='RESTRICTED FX AUDIT / F.H.C ONLY';}
        else if(VIDEO.has(id)){root.classList.add('pc571-video-audit'); label='DAMAGED VIDEO FX AUDIT / VIDEO ONLY';}
        else if(BIO.has(id)){root.classList.add('pc571-bio-audit'); label='BIO TRACE FX AUDIT / ENTITY ONLY';}
        if(label){ const header=root.querySelector('.doc-header'); if(header&&!header.querySelector('.pc571-audit-badge')){ const badge=document.createElement('div'); badge.className='pc571-audit-badge'; badge.textContent=label; header.insertAdjacentElement('afterend',badge); } }
      });
    }
    auditRecords();
    document.querySelectorAll('.open-record,.record-back,.side-menu a').forEach(el=>el.addEventListener('click',()=>setTimeout(auditRecords,180),true));
    if(window.MutationObserver){ const viewer=document.getElementById('archiveRecordViewer'); if(viewer){ new MutationObserver(()=>setTimeout(auditRecords,60)).observe(viewer,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class']}); } }
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch571:'Restricted Record FX Audit + Faction Focus Logic Fix'});

// PATCH 5.8 — FinalUIPerformanceQA + Faction Focus Polish
// Keeps the originally planned final QA pass, while tightening faction relation focus readability:
// selected/direct nodes stay readable, indirect nodes step back, unrelated nodes/lines disappear from the active trace.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch58:'Final UI Performance QA + Faction Focus Polish'});
    const section=document.getElementById('faction-relation');
    if(!section) return;
    const canon=(v)=>String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'').replace(/^uac$/,'uac').replace(/^nhc$/,'nhc').replace(/^sid$/,'sid').replace(/^fhc$/,'fhc').replace(/^cpd$/,'cpd').replace(/^arf$/,'arf').replace(/^ushnodacult$|^ushinodacult$|^ushnoda$|^ushinoda$/,'ushinoda').replace(/^ashcrew$/,'ashcrew').replace(/^haimun$/,'haimun').replace(/^amarion$/,'amarion').replace(/^syndicate$/,'syndicate');
    function getNodes(){ return Array.from(section.querySelectorAll('.pc571-node')); }
    function getEdges(){ return Array.from(section.querySelectorAll('.pc571-edge')); }
    function buildAdj(){
      const adj={};
      getNodes().forEach(n=>{ adj[canon(n.dataset.factionKey)]=new Set(); });
      getEdges().forEach(e=>{
        const a=canon(e.dataset.edgeA), b=canon(e.dataset.edgeB);
        if(!a||!b) return;
        if(!adj[a]) adj[a]=new Set();
        if(!adj[b]) adj[b]=new Set();
        adj[a].add(b); adj[b].add(a);
      });
      return adj;
    }
    function directOf(key,adj){ return new Set([key,...Array.from((adj&&adj[key])||[])]); }
    function secondaryOf(key,adj,direct){
      const out=new Set();
      Array.from(direct||[]).forEach(k=>{
        Array.from((adj&&adj[k])||[]).forEach(x=>{ if(x!==key && !(direct||new Set()).has(x)) out.add(x); });
      });
      return out;
    }
    function currentFocus(){
      const selected=section.querySelector('.pc571-node.selected');
      if(selected) return canon(selected.dataset.factionKey);
      return canon(section.dataset.pc571Focus||'');
    }
    function resetPolish(){
      section.classList.add('pc58-faction-focus-polish','pc58-default-view');
      section.classList.remove('pc58-trace-active');
      getNodes().forEach(n=>n.classList.remove('pc58-selected','pc58-direct','pc58-secondary','pc58-muted'));
      getEdges().forEach(e=>e.classList.remove('pc58-focus','pc58-secondary','pc58-hidden'));
      const state=section.querySelector('[data-pc571-state]');
      if(state && !section.dataset.pc571Focus) state.textContent='NO NODE SELECTED / ALL NODES VISIBLE';
    }
    function applyPolish(key){
      const nodes=getNodes(), edges=getEdges();
      if(!nodes.length || !edges.length) return;
      key=canon(key||currentFocus());
      if(!key){ resetPolish(); return; }
      const adj=buildAdj();
      if(!adj[key]){ resetPolish(); return; }
      const direct=directOf(key,adj);
      const secondary=secondaryOf(key,adj,direct);
      section.classList.add('pc58-faction-focus-polish','pc58-trace-active');
      section.classList.remove('pc58-default-view');
      nodes.forEach(node=>{
        const k=canon(node.dataset.factionKey);
        const selected=k===key;
        const isDirect=!selected && direct.has(k);
        const isSecondary=!selected && !isDirect && secondary.has(k);
        node.classList.toggle('pc58-selected',selected);
        node.classList.toggle('pc58-direct',isDirect);
        node.classList.toggle('pc58-secondary',isSecondary);
        node.classList.toggle('pc58-muted',!selected && !isDirect && !isSecondary);
      });
      edges.forEach(edge=>{
        const a=canon(edge.dataset.edgeA), b=canon(edge.dataset.edgeB);
        const focus=(a===key||b===key);
        const directPair=!focus && direct.has(a) && direct.has(b);
        const secondLink=!focus && !directPair && ((direct.has(a)&&secondary.has(b))||(direct.has(b)&&secondary.has(a)));
        const visibleSecondary=directPair || secondLink;
        edge.classList.toggle('pc58-focus',focus);
        edge.classList.toggle('pc58-secondary',visibleSecondary);
        // If neither endpoint belongs to the selected trace path, remove the line from the visual trace.
        edge.classList.toggle('pc58-hidden',!focus && !visibleSecondary);
      });
      const state=section.querySelector('[data-pc571-state]');
      if(state) state.textContent='NODE: '+(section.querySelector('.pc571-node.pc58-selected b')?.textContent||key)+' / CONNECTED TRACE ONLY';
    }
    function bind(){
      section.classList.add('pc58-faction-focus-polish');
      getNodes().forEach(node=>{
        if(node.dataset.pc58Bound) return;
        node.dataset.pc58Bound='1';
        node.addEventListener('click',()=>setTimeout(()=>applyPolish(node.dataset.factionKey),0),true);
        node.addEventListener('keydown',(e)=>{ if(e.key==='Enter'||e.key===' ') setTimeout(()=>applyPolish(node.dataset.factionKey),0); },true);
      });
      section.querySelectorAll('.relation-table tbody tr').forEach(row=>{
        if(row.dataset.pc58Bound) return;
        row.dataset.pc58Bound='1';
        row.addEventListener('click',()=>setTimeout(()=>applyPolish(row.dataset.edgeA||row.dataset.edgeB||'uac'),0),true);
      });
      const title=section.querySelector('.pc571-title,.pc57-title,.pc5641-title');
      if(title && !title.dataset.pc58Bound){
        title.dataset.pc58Bound='1';
        title.addEventListener('dblclick',()=>setTimeout(resetPolish,0),true);
      }
      const focus=currentFocus();
      if(focus) applyPolish(focus); else resetPolish();
    }
    function schedule(){ setTimeout(bind,80); setTimeout(bind,360); setTimeout(bind,760); }
    schedule();
    document.querySelectorAll('.side-menu a[data-target="faction-relation"]').forEach(a=>a.addEventListener('click',schedule,true));
    if(window.MutationObserver){
      const tree=section.querySelector('.relation-tree-panel')||section;
      const mo=new MutationObserver(()=>{ if(section.querySelector('.pc571-node')) schedule(); });
      mo.observe(tree,{childList:true,subtree:true});
    }
  });
})();

// PATCH 5.8.1 — FinalHotfix SourceCleanup + Faction Trace Clarity
// Finalizes the recommended hotfix pass: keep only selected-node direct relation lines visible,
// push unrelated nodes further back, and leave a deployment/source sanity marker for GitHub uploads.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch581:'Final Hotfix SourceCleanup + Faction Trace Clarity'});
    const section=document.getElementById('faction-relation');
    if(!section) return;
    const canon=(v)=>String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'')
      .replace(/^uac$/,'uac').replace(/^nhc$/,'nhc').replace(/^sid$/,'sid').replace(/^fhc$/,'fhc')
      .replace(/^cpd$/,'cpd').replace(/^arf$/,'arf')
      .replace(/^ushnodacult$|^ushinodacult$|^ushnoda$|^ushinoda$/,'ushinoda')
      .replace(/^ashcrew$/,'ashcrew').replace(/^haimun$/,'haimun').replace(/^amarion$/,'amarion').replace(/^syndicate$/,'syndicate');
    function nodes(){ return Array.from(section.querySelectorAll('.pc571-node')); }
    function edges(){ return Array.from(section.querySelectorAll('.pc571-edge')); }
    function rows(){ return Array.from(section.querySelectorAll('.relation-table tbody tr')); }
    function adjacency(){
      const adj={};
      nodes().forEach(n=>{ adj[canon(n.dataset.factionKey)]=new Set(); });
      edges().forEach(e=>{
        const a=canon(e.dataset.edgeA), b=canon(e.dataset.edgeB);
        if(!a||!b) return;
        if(!adj[a]) adj[a]=new Set();
        if(!adj[b]) adj[b]=new Set();
        adj[a].add(b); adj[b].add(a);
      });
      return adj;
    }
    function selectedKey(){
      const picked=section.querySelector('.pc571-node.selected,.pc571-node.pc58-selected,.pc571-node.pc581-selected');
      return canon((picked&&picked.dataset.factionKey)||section.dataset.pc571Focus||'');
    }
    function clear581(){
      section.classList.add('pc581-source-cleanup','pc581-default-view');
      section.classList.remove('pc581-trace-active');
      nodes().forEach(n=>n.classList.remove('pc581-selected','pc581-direct','pc581-secondary','pc581-muted'));
      edges().forEach(e=>e.classList.remove('pc581-focus','pc581-hidden'));
      rows().forEach(r=>r.classList.remove('pc581-row-active','pc581-row-muted','pc581-row-hidden'));
      const state=section.querySelector('[data-pc571-state]');
      if(state && !section.dataset.pc571Focus) state.textContent='NO NODE SELECTED / ALL NODES VISIBLE / 5.8.1 CLEAN';
    }
    function apply581(rawKey){
      const ns=nodes(), es=edges();
      if(!ns.length||!es.length) return;
      const key=canon(rawKey||selectedKey());
      const adj=adjacency();
      if(!key||!adj[key]){ clear581(); return; }
      const direct=new Set([key,...Array.from(adj[key]||[])]);
      const second=new Set();
      Array.from(direct).forEach(k=>Array.from(adj[k]||[]).forEach(x=>{ if(x!==key&&!direct.has(x)) second.add(x); }));
      section.classList.add('pc581-source-cleanup','pc581-trace-active');
      section.classList.remove('pc581-default-view');
      ns.forEach(node=>{
        const k=canon(node.dataset.factionKey);
        const selected=k===key;
        const isDirect=!selected&&direct.has(k);
        const isSecond=!selected&&!isDirect&&second.has(k);
        node.classList.toggle('pc581-selected',selected);
        node.classList.toggle('pc581-direct',isDirect);
        node.classList.toggle('pc581-secondary',isSecond);
        node.classList.toggle('pc581-muted',!selected&&!isDirect&&!isSecond);
      });
      es.forEach(edge=>{
        const a=canon(edge.dataset.edgeA), b=canon(edge.dataset.edgeB);
        const focus=(a===key||b===key);
        edge.classList.toggle('pc581-focus',focus);
        // 5.8.1 rule: when a node is selected, lines not directly attached to that node disappear.
        edge.classList.toggle('pc581-hidden',!focus);
      });
      rows().forEach(row=>{
        const a=canon(row.dataset.edgeA), b=canon(row.dataset.edgeB);
        const active=(a===key||b===key);
        const near=!active && (direct.has(a)||direct.has(b));
        row.classList.toggle('pc581-row-active',active);
        row.classList.toggle('pc581-row-muted',near);
        row.classList.toggle('pc581-row-hidden',!active&&!near);
      });
      const state=section.querySelector('[data-pc571-state]');
      const label=section.querySelector('.pc571-node.pc581-selected b')?.textContent||key;
      if(state) state.textContent='NODE: '+label+' / DIRECT RELATION LINES ONLY / 5.8.1';
      const note=section.querySelector('[data-pc571-edge-note]');
      if(note && note.textContent) note.textContent=note.textContent.replace(/\s+\|\s+/g,'  |  ');
    }
    function bind581(){
      section.classList.add('pc581-source-cleanup');
      nodes().forEach(node=>{
        if(node.dataset.pc581Bound) return;
        node.dataset.pc581Bound='1';
        node.addEventListener('click',()=>{ setTimeout(()=>apply581(node.dataset.factionKey),20); setTimeout(()=>apply581(node.dataset.factionKey),160); },true);
        node.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') setTimeout(()=>apply581(node.dataset.factionKey),20); },true);
      });
      rows().forEach(row=>{
        if(row.dataset.pc581Bound) return;
        row.dataset.pc581Bound='1';
        row.addEventListener('click',()=>setTimeout(()=>apply581(row.dataset.edgeA||row.dataset.edgeB||'uac'),20),true);
      });
      const title=section.querySelector('.pc571-title,.pc57-title,.pc5641-title');
      if(title&&!title.dataset.pc581Bound){
        title.dataset.pc581Bound='1';
        title.addEventListener('dblclick',()=>setTimeout(clear581,40),true);
      }
      const focus=selectedKey();
      if(focus) apply581(focus); else clear581();
    }
    function schedule(){ setTimeout(bind581,120); setTimeout(bind581,420); setTimeout(bind581,900); }
    schedule();
    document.querySelectorAll('.side-menu a[data-target="faction-relation"]').forEach(a=>a.addEventListener('click',schedule,true));
    if(window.MutationObserver){
      const tree=section.querySelector('.relation-tree-panel')||section;
      new MutationObserver(()=>{ if(section.querySelector('.pc571-node')) schedule(); }).observe(tree,{childList:true,subtree:true});
    }
  });
})();


window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch581R1:'BootAndOverlayDedup ServerTransition'});

// PATCH 5.8.1R-1c — ServerStatusbarAndModuleHeaderPolish
// Strengthens the server-terminal feeling through statusbar/module headers only.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const moduleMeta={
      history:{num:'01',code:'CHRONICLE INDEX',ko:'세계 역사',sub:'연대 기록 색인 / 사건 흐름 조회',access:'READ ONLY',trace:'PASSIVE',integrity:'VERIFIED',breadcrumb:'U.A.C ARCHIVE / 세계 역사',notice:'CHRONICLE INDEX // SERVER MODULE ONLINE'},
      'faction-info':{num:'02',code:'FACTION DATABASE',ko:'세력 정보',sub:'세력 기록철 / 데이터베이스 조회',access:'FIELD REVIEW',trace:'DATABASE QUERY',integrity:'VERIFIED',breadcrumb:'U.A.C ARCHIVE / 세력 정보',notice:'FACTION DATABASE // ACCESS GRANTED'},
      'faction-relation':{num:'03',code:'RELATION MATRIX',ko:'세력 관계',sub:'관계 행렬 / 직접 연결 추적',access:'TRACE VIEW',trace:'RELATION LINK',integrity:'VERIFIED',breadcrumb:'U.A.C ARCHIVE / 세력 관계',notice:'RELATION MATRIX // TRACE LINKED'},
      'zone-map':{num:'04',code:'REGIONAL SURFACE',ko:'지역 지도',sub:'권역 관제면 / 봉쇄선 레이어',access:'SURVEY MODE',trace:'MAP SYNC',integrity:'LIVE',breadcrumb:'U.A.C ARCHIVE / 지역 지도',notice:'REGIONAL SURFACE // SYNC READY'},
      'archive-entry':{num:'05',code:'ARCHIVE REPOSITORY',ko:'기록 보관소',sub:'문서 저장소 / 열람 가능 기록',access:'FIELD REVIEW',trace:'INDEX SCAN',integrity:'VERIFIED',breadcrumb:'U.A.C ARCHIVE / 기록 보관소',notice:'ARCHIVE REPOSITORY // MOUNTED'}
    };
    const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    function currentTarget(){
      const active=document.querySelector('.content-page.active');
      if(active&&moduleMeta[active.id]) return active.id;
      const hash=(location.hash||'#history').replace('#','');
      return moduleMeta[hash]?hash:'history';
    }
    function ensureHeaders(){
      Object.keys(moduleMeta).forEach(id=>{
        const page=document.getElementById(id);
        const meta=moduleMeta[id];
        if(!page||page.querySelector(':scope > .pc581-module-header')) return;
        const header=document.createElement('div');
        header.className='pc581-module-header';
        header.setAttribute('data-module-header',id);
        header.innerHTML='<div class="pc581-module-kicker"><span>MODULE '+esc(meta.num)+'</span><i>SERVER NODE HANDOFF</i></div>'+ 
          '<div class="pc581-module-main"><b>'+esc(meta.code)+'</b><em>'+esc(meta.ko)+'</em></div>'+ 
          '<div class="pc581-module-grid"><span><i>STATUS</i><b>ONLINE</b></span><span><i>ACCESS</i><b>'+esc(meta.access)+'</b></span><span><i>TRACE</i><b>'+esc(meta.trace)+'</b></span><span><i>INTEGRITY</i><b>'+esc(meta.integrity)+'</b></span></div>'+ 
          '<p>'+esc(meta.sub)+'</p>';
        page.insertBefore(header,page.firstChild);
      });
    }
    function ensureStatusFields(){
      const bar=document.querySelector('.uac-server-statusbar');
      if(!bar) return null;
      bar.classList.add('pc581-r1c-statusbar');
      if(!bar.querySelector('[data-srv-module]')){
        const field=document.createElement('span');
        field.className='status-field status-module';
        field.setAttribute('data-srv-module','');
        field.textContent='CURRENT MODULE: CHRONICLE INDEX';
        const node=bar.querySelector('[data-srv-node]');
        if(node&&node.nextSibling) bar.insertBefore(field,node.nextSibling);
        else bar.appendChild(field);
      }
      if(!bar.querySelector('[data-srv-access]')){
        const access=document.createElement('span');
        access.className='status-field status-access';
        access.setAttribute('data-srv-access','');
        access.textContent='ACCESS: READ ONLY';
        const module=bar.querySelector('[data-srv-module]');
        if(module&&module.nextSibling) bar.insertBefore(access,module.nextSibling);
        else bar.appendChild(access);
      }
      return bar;
    }
    let pulseTimer=null;
    function updateStatus(target){
      const meta=moduleMeta[target]||moduleMeta.history;
      const bar=ensureStatusFields();
      if(!bar) return;
      const set=(sel,text)=>{ const el=bar.querySelector(sel); if(el) el.textContent=text; };
      set('[data-srv-module]','CURRENT MODULE: '+meta.code);
      set('[data-srv-access]','ACCESS: '+meta.access);
      set('[data-srv-trace]','TRACE STATUS: '+meta.trace);
      set('[data-srv-map]',target==='zone-map'?'MAP SYNC: ACTIVE':'MAP SYNC: STANDBY');
      set('[data-srv-integrity]','RECORD INTEGRITY: '+meta.integrity);
      set('[data-srv-breadcrumb]',meta.breadcrumb);
      set('[data-srv-notice]',meta.notice);
      const trace=bar.querySelector('[data-srv-trace]');
      if(trace){
        trace.className='status-field';
        if(target==='faction-relation'||target==='zone-map') trace.classList.add('status-map');
        if(target==='archive-entry') trace.classList.add('status-warn');
      }
      const map=bar.querySelector('[data-srv-map]');
      if(map){ map.classList.toggle('status-map',target==='zone-map'); }
      bar.setAttribute('data-current-module',target);
      bar.classList.remove('module-pulse');
      clearTimeout(pulseTimer);
      requestAnimationFrame(()=>bar.classList.add('module-pulse'));
      pulseTimer=setTimeout(()=>bar.classList.remove('module-pulse'),620);
    }
    function activateHeader(target){
      document.querySelectorAll('.pc581-module-header').forEach(header=>{
        const on=header.getAttribute('data-module-header')===target;
        header.classList.toggle('is-current',on);
        if(on){
          header.classList.remove('is-linking');
          void header.offsetWidth;
          header.classList.add('is-linking');
          setTimeout(()=>header.classList.remove('is-linking'),640);
        }
      });
    }
    function refresh(target){
      target=target||currentTarget();
      ensureHeaders();
      updateStatus(target);
      activateHeader(target);
      document.body.dataset.pc581Module=target;
    }
    ensureHeaders();
    setTimeout(()=>refresh(currentTarget()),180);
    document.querySelectorAll('.side-menu a[data-target]').forEach(a=>{
      if(a.dataset.pc581R1cBound) return;
      a.dataset.pc581R1cBound='1';
      a.addEventListener('click',()=>{
        const target=a.dataset.target||'history';
        setTimeout(()=>refresh(target),120);
        setTimeout(()=>refresh(target),520);
      },true);
    });
    window.addEventListener('hashchange',()=>setTimeout(()=>refresh(currentTarget()),160));
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch581R1c:'ServerStatusbarAndModuleHeaderPolish'});


// PATCH 5.8.1R-2 — FactionSoundAndAudioDedup + MenuLayoutMicroFix
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch581r2:'FactionSoundAndAudioDedup + MenuLayoutMicroFix'});
    const audioKey='pc_audio_legacy2003_fixed';
    const soundOn=()=>localStorage.getItem(audioKey)!=='off';

    let clickHint='';
    let hintTimer=null;
    function setHint(v){
      clickHint=v;
      if(hintTimer) clearTimeout(hintTimer);
      hintTimer=setTimeout(()=>{ clickHint=''; }, 160);
    }

    const proto=window.HTMLMediaElement && window.HTMLMediaElement.prototype;
    if(proto && !proto.__pc581r2PatchedPlay){
      const nativePlay=proto.play;
      Object.defineProperty(proto,'__pc581r2PatchedPlay',{value:true, configurable:true});
      proto.play=function(){
        try{
          const src=String(this.currentSrc||this.src||'');
          if(clickHint==='faction-tile' && /menu_tick\.mp3(?:$|\?)/.test(src)){
            return Promise.resolve();
          }
        }catch(e){}
        return nativePlay.apply(this,arguments);
      };
    }

    let ctx=null;
    let lastNodeTone=0;
    let lastRowTone=0;
    function pulse(kind, hostile){
      if(!soundOn()) return;
      try{
        const AC=window.AudioContext||window.webkitAudioContext;
        if(!AC) return;
        ctx=ctx||new AC();
        if(ctx.state==='suspended') ctx.resume().catch(()=>{});
        const now=performance.now();
        if(kind==='node' && now-lastNodeTone<115) return;
        if(kind==='row' && now-lastRowTone<95) return;
        if(kind==='node') lastNodeTone=now;
        if(kind==='row') lastRowTone=now;

        const t=ctx.currentTime;
        const osc1=ctx.createOscillator();
        const gain=ctx.createGain();
        const lp=ctx.createBiquadFilter();
        lp.type='lowpass';
        lp.frequency.setValueAtTime(hostile?740:960,t);

        const start = kind==='row' ? (hostile?176:214) : (hostile?162:252);
        const end   = kind==='row' ? (hostile?148:186) : (hostile?132:338);
        osc1.type = hostile ? 'sawtooth' : (kind==='row' ? 'square' : 'triangle');
        osc1.frequency.setValueAtTime(start,t);
        osc1.frequency.exponentialRampToValueAtTime(end,t+(kind==='row'?0.060:0.085));

        gain.gain.setValueAtTime(0.0001,t);
        gain.gain.exponentialRampToValueAtTime(kind==='row'?0.010:0.013,t+0.010);
        gain.gain.exponentialRampToValueAtTime(0.0001,t+(kind==='row'?0.082:0.120));

        osc1.connect(lp); lp.connect(gain); gain.connect(ctx.destination);
        osc1.start(t); osc1.stop(t+(kind==='row'?0.10:0.14));

        if(kind==='node' && !hostile){
          const osc2=ctx.createOscillator();
          const g2=ctx.createGain();
          osc2.type='sine';
          osc2.frequency.setValueAtTime(410,t+0.018);
          osc2.frequency.exponentialRampToValueAtTime(476,t+0.070);
          g2.gain.setValueAtTime(0.0001,t+0.018);
          g2.gain.exponentialRampToValueAtTime(0.005,t+0.028);
          g2.gain.exponentialRampToValueAtTime(0.0001,t+0.100);
          osc2.connect(g2); g2.connect(ctx.destination); osc2.start(t+0.018); osc2.stop(t+0.110);
        }
      }catch(e){}
    }

    const factionInfo=document.getElementById('faction-info');
    if(factionInfo && !factionInfo.dataset.pc581r2Patched){
      factionInfo.dataset.pc581r2Patched='1';
      const markFactionHint=(ev)=>{ if(ev.target && ev.target.closest('.faction-tile')) setHint('faction-tile'); };
      factionInfo.addEventListener('pointerdown',markFactionHint,true);
      factionInfo.addEventListener('click',markFactionHint,true);
      factionInfo.addEventListener('keydown',(ev)=>{ if((ev.key==='Enter' || ev.key===' ') && ev.target && ev.target.closest('.faction-tile')) setHint('faction-tile'); },true);
    }

    const relation=document.getElementById('faction-relation');
    if(relation && !relation.dataset.pc581r2Patched){
      relation.dataset.pc581r2Patched='1';
      relation.addEventListener('click',(ev)=>{
        const node=ev.target && ev.target.closest('.pc571-node');
        if(node){
          const txt=(node.textContent||'') + ' ' + ((node.querySelector('.pc571-tag')||{}).textContent||'');
          const hostile=/적대|침투|의식|위험|hostile|danger/i.test(txt) || node.classList.contains('hostile') || node.classList.contains('danger');
          pulse('node',hostile);
          return;
        }
        const row=ev.target && ev.target.closest('.relation-table tbody tr');
        if(row){
          const hostile=/적대|침투|의식|위험|hostile/i.test(row.textContent||'');
          pulse('row',hostile);
        }
      },true);
      relation.addEventListener('keydown',(ev)=>{
        if(ev.key!=='Enter' && ev.key!==' ') return;
        const node=ev.target && ev.target.closest('.pc571-node');
        if(node){
          const txt=(node.textContent||'') + ' ' + ((node.querySelector('.pc571-tag')||{}).textContent||'');
          const hostile=/적대|침투|의식|위험|hostile|danger/i.test(txt) || node.classList.contains('hostile') || node.classList.contains('danger');
          pulse('node',hostile);
          return;
        }
        const row=ev.target && ev.target.closest('.relation-table tbody tr');
        if(row){
          const hostile=/적대|침투|의식|위험|hostile/i.test(row.textContent||'');
          pulse('row',hostile);
        }
      },true);
    }
  });
})();

// PATCH 5.8.1R-4 — FactionRelationCompactInspector
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch581r4:'Faction Relation Compact Inspector'});
    const section=document.getElementById('faction-relation');
    if(!section || section.dataset.pc581r4Ready) return;
    section.dataset.pc581r4Ready='1';
    section.classList.add('pc581r4-relation-compact');

    function ensureShell(){
      const tree=section.querySelector('.relation-tree-panel');
      if(!tree) return null;
      let shell=section.querySelector('.pc581r4-relation-shell');
      if(!shell){
        shell=document.createElement('div');
        shell.className='pc581r4-relation-shell';
        tree.insertAdjacentElement('beforebegin',shell);
        shell.appendChild(tree);
      }else if(tree.parentElement!==shell){
        shell.insertBefore(tree,shell.firstChild);
      }
      return shell;
    }

    function ensureInspector(){
      const shell=ensureShell();
      if(!shell) return null;
      let panel=shell.querySelector('.pc581r4-inspector');
      if(panel) return panel;
      panel=document.createElement('aside');
      panel.className='pc581r4-inspector';
      panel.setAttribute('aria-label','선택 세력 요약');
      panel.innerHTML=
        '<div class="pc581r4-inspector-head"><b>NODE INSPECTOR</b><span data-r4-state>STANDBY</span></div>'+ 
        '<div class="pc581r4-selected"><i>SELECTED NODE</i><strong data-r4-name>대기 중</strong><em data-r4-status>전체 표시</em></div>'+ 
        '<div class="pc581r4-inspector-grid">'+
          '<span><b>관계 등급</b><i data-r4-grade>STANDBY</i></span>'+ 
          '<span><b>감시 상태</b><i data-r4-watch>선택 대기</i></span>'+ 
          '<span class="wide"><b>직접 연결</b><i data-r4-links>노드를 선택하면 직접 연결 경로가 표시된다.</i></span>'+ 
          '<span class="wide"><b>2차 연결</b><i data-r4-secondary>선택 대기</i></span>'+ 
          '<span class="wide"><b>관련 기록</b><i data-r4-records>기록 연결 대기</i></span>'+ 
        '</div>'+ 
        '<div class="pc581r4-summary"><b>U.A.C 판단</b><p data-r4-summary>관계도에서 노드를 선택하면 직접 연결, 2차 연결, 관련 기록이 이 패널에 즉시 표시된다.</p></div>'+ 
        '<div class="pc581r4-edge-note"><b>관계 기록</b><p data-r4-edge-note>선택된 세력 없음.</p></div>';
      shell.appendChild(panel);
      return panel;
    }

    function val(sel,fallback){
      const el=section.querySelector(sel);
      return (el && el.textContent.trim()) || fallback || '';
    }

    function syncInspector(){
      const panel=ensureInspector();
      if(!panel) return;
      panel.querySelector('[data-r4-state]').textContent=val('[data-pc571-state]','NO NODE SELECTED');
      panel.querySelector('[data-r4-name]').textContent=val('[data-pc571-name]','대기 중');
      panel.querySelector('[data-r4-status]').textContent=val('[data-pc571-status]','전체 표시');
      panel.querySelector('[data-r4-grade]').textContent=val('[data-pc571-grade]','STANDBY');
      panel.querySelector('[data-r4-watch]').textContent=val('[data-pc571-watch]','선택 대기');
      panel.querySelector('[data-r4-links]').textContent=val('[data-pc571-links]','노드를 선택하면 직접 연결 경로가 표시된다.');
      panel.querySelector('[data-r4-secondary]').textContent=val('[data-pc571-secondary]','선택 대기');
      panel.querySelector('[data-r4-records]').textContent=val('[data-pc571-records]','기록 연결 대기');
      panel.querySelector('[data-r4-summary]').textContent=val('[data-pc571-summary]','기본 상태에서는 모든 노드와 주요 관계선을 가시 상태로 유지한다.');
      panel.querySelector('[data-r4-edge-note]').textContent=val('[data-pc571-edge-note]','선택된 세력 없음.');
      const tag=panel.querySelector('[data-r4-status]').textContent;
      panel.dataset.status=/적대|위험|침투|의식/.test(tag)?'hostile':/감시/.test(tag)?'watch':/통제|협력/.test(tag)?'control':'neutral';
    }

    function compactAnalysis(){
      const panel=section.querySelector('.pc571-analysis-panel');
      if(panel){
        panel.classList.add('pc581r4-source-analysis');
        panel.setAttribute('aria-hidden','true');
      }
    }

    function wrapRelationTable(){
      const table=section.querySelector('.relation-table');
      if(!table || table.closest('.pc581r4-relation-details')) return;
      const details=document.createElement('details');
      details.className='pc581r4-relation-details';
      const summary=document.createElement('summary');
      summary.innerHTML='<b>RELATION TABLE</b><span>상세 관계표 펼치기 / 선택 노드 기준 행 강조 유지</span>';
      table.insertAdjacentElement('beforebegin',details);
      details.appendChild(summary);
      details.appendChild(table);
    }

    function install(){
      ensureShell();
      ensureInspector();
      compactAnalysis();
      wrapRelationTable();
      syncInspector();
    }

    install();
    setTimeout(install,260);
    setTimeout(install,700);

    section.addEventListener('click',()=>setTimeout(syncInspector,40),true);
    section.addEventListener('keydown',(ev)=>{
      if(ev.key==='Enter' || ev.key===' ') setTimeout(syncInspector,40);
    },true);

    if(window.MutationObserver){
      let pending=false;
      const mo=new MutationObserver((mutations)=>{
        if(pending) return;
        if(!mutations.some(m=>Array.from(m.addedNodes||[]).some(n=>n.nodeType===1 && !n.classList?.contains('pc581r4-inspector')))) return;
        pending=true;
        setTimeout(()=>{pending=false; install();},80);
      });
      mo.observe(section,{childList:true,subtree:true});
    }
  });
})();


// PATCH 5.8.1R-6 — FinalRegressionQA_OverlapAndRuntimeAudit
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    if(document.body && document.body.dataset.pc581r6Ready) return;
    if(document.body) document.body.dataset.pc581r6Ready='1';
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch581r6:'FinalRegressionQA_OverlapAndRuntimeAudit'});

    function hideLegacyCenterLoaders(){
      document.querySelectorAll('.pc551-menu-loader').forEach(el=>{ el.classList.remove('show','hide'); el.setAttribute('aria-hidden','true'); });
      document.querySelectorAll('.uac-map-code-loader.is-active').forEach(el=>{ el.classList.remove('is-active','show','active'); el.setAttribute('aria-hidden','true'); });
    }
    function hideMenuToast(){
      document.querySelectorAll('.pc564-menu-fx.active').forEach(el=>el.classList.remove('active'));
    }
    function squashDuplicates(){
      const keepFirst=(sel)=>{ const arr=Array.from(document.querySelectorAll(sel)); arr.slice(1).forEach(el=>el.remove()); };
      keepFirst('.pc564-menu-fx');
      keepFirst('#recordLoading');
      keepFirst('.uac-server-statusbar');
      document.querySelectorAll('.content-page').forEach(page=>{
        const headers=Array.from(page.querySelectorAll(':scope > .pc581-module-header'));
        headers.slice(1).forEach(el=>el.remove());
      });
      const rel=document.getElementById('faction-relation');
      if(rel){
        const inspectors=Array.from(rel.querySelectorAll('.pc581r4-inspector'));
        inspectors.slice(1).forEach(el=>el.remove());
        const details=Array.from(rel.querySelectorAll('.pc581r4-relation-details'));
        details.slice(1).forEach(el=>el.remove());
      }
      document.querySelectorAll('.record-surface-loader.show').forEach((el,idx)=>{ if(idx>0) el.classList.remove('show'); });
    }
    function setStatusTitles(){
      document.querySelectorAll('.uac-server-statusbar .status-field,.uac-server-statusbar .status-scroll,.pc581-module-grid b,.pc581r5-summary-grid b').forEach(el=>{
        const t=(el.textContent||'').trim();
        if(t) el.setAttribute('title',t);
      });
    }
    function archiveSurfaceGate(){
      const shown=Array.from(document.querySelectorAll('.record-surface-loader.show'));
      if(shown.length>1) shown.slice(0,-1).forEach(el=>el.classList.remove('show'));
    }
    function audit(){ hideLegacyCenterLoaders(); squashDuplicates(); setStatusTitles(); archiveSurfaceGate(); }

    document.querySelectorAll('.side-menu a[data-target]').forEach(a=>{
      if(a.dataset.pc581r6Bound) return;
      a.dataset.pc581r6Bound='1';
      a.addEventListener('click',()=>{
        hideLegacyCenterLoaders();
        setTimeout(audit,60);
        setTimeout(audit,520);
      },true);
    });
    document.addEventListener('click',(ev)=>{
      const target=ev.target;
      if(!(target instanceof Element)) return;
      if(target.closest('.page-tab,.sub-tab')){
        hideMenuToast();
        setTimeout(archiveSurfaceGate,40);
      }
      if(target.closest('.open-record,[data-open-record],.archive-list a,.record-back')){
        hideMenuToast();
        setTimeout(audit,120);
      }
      if(target.closest('.uac-r24-regional-map,.r24-region-tab,.r24-filter,.r24-world-btn,.r24-item')){
        setTimeout(audit,180);
      }
      if(target.closest('.pc571-node,.relation-table tbody tr,.pc581r4-relation-details')){
        setTimeout(audit,120);
      }
    },true);
    window.addEventListener('resize',()=>{ clearTimeout(window.__pc581r6ResizeTimer); window.__pc581r6ResizeTimer=setTimeout(audit,160); });
    if(window.MutationObserver){
      const mo=new MutationObserver(()=>{ clearTimeout(window.__pc581r6MoTimer); window.__pc581r6MoTimer=setTimeout(audit,180); });
      mo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','hidden']});
    }
    setTimeout(audit,250);
    setTimeout(audit,1100);
  });
})();


// PATCH 5.8.1R-7 / R-7a — DocumentViewerServerPolish + LoadHotfix
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch581r7:'DocumentViewerServerPolish',
      patch581r7a:'DocumentViewerLoadHotfix'
    });
    const profiles={
      'Cults_871104':{kind:'restricted',node:'RESTRICTED DOCUMENT',access:'PARTIAL ACCESS',integrity:'SEALED / REDACTED',trace:'F.H.C WATCH',channel:'INTERNAL BLACK FILE'},
      'Immortality_860201':{kind:'video',node:'DAMAGED VIDEO FEED',access:'SIGNAL REVIEW',integrity:'FRAME LOSS DETECTED',trace:'AUDIO DEGRADED',channel:'FIELD CAMERA CACHE'},
      'Sakuma_Tape_991028':{kind:'video',node:'DAMAGED VIDEO FEED',access:'SIGNAL REVIEW',integrity:'PARTIAL RECOVERY',trace:'MISSING PERSON TRACE',channel:'S.I.D CASE TAPE'},
      '불명_Record1_860204':{kind:'video',node:'DAMAGED VIDEO FEED',access:'SIGNAL REVIEW',integrity:'CORRUPTED CACHE',trace:'AMARION WATCH',channel:'RECOVERED MEDIA'},
      '타락 개체_860722':{kind:'bio',node:'BIOLOGICAL TRACE SCAN',access:'ENTITY FILE',integrity:'THREAT TABLE VERIFIED',trace:'BIO INDEX ACTIVE',channel:'ENTITY CLASSIFICATION'},
      '불명_Record2_860205':{kind:'bio',node:'BIOLOGICAL TRACE SCAN',access:'AUTOPSY REVIEW',integrity:'SAMPLE LOG VERIFIED',trace:'CONTAMINATION WATCH',channel:'BLOOD LAKE BIO FILE'},
      'FCR_Archive_890402':{kind:'bio',node:'BIOLOGICAL TRACE SCAN',access:'ENTITY FILE',integrity:'SUPPLEMENTAL INDEX',trace:'FIELD TERMS ACTIVE',channel:'FCR ADDENDUM'},
      '불명_Record5_940626':{kind:'bio',node:'BIOLOGICAL TRACE SCAN',access:'RESTRICTED BIO DATA',integrity:'GENE FILE QUARANTINED',trace:'AMARION / F.H.C WATCH',channel:'GENETIC RISK FILE'},
      'NHC_Manual_891219':{kind:'operation',node:'FIELD OPERATION MANUAL',access:'OPERATION READ ONLY',integrity:'PROCEDURE VERIFIED',trace:'N.H.C FIELD ROUTE',channel:'CONTAINMENT MANUAL'},
      'Redzone_881120':{kind:'anomaly',node:'ANOMALY CONTAINMENT NODE',access:'REGIONAL REVIEW',integrity:'ZONE CRITERIA VERIFIED',trace:'CI TABLE ACTIVE',channel:'REDZONE PROTOCOL'},
      '불명_Record3_920711':{kind:'audio',node:'AUDIO SURVEILLANCE RECORD',access:'FIELD REVIEW',integrity:'TRANSCRIPT VERIFIED',trace:'REDWOLF TRACE',channel:'COMMAND LEAK'},
      '불명_Record4_930314':{kind:'audio',node:'AUDIO SURVEILLANCE RECORD',access:'FIELD REVIEW',integrity:'TRANSCRIPT VERIFIED',trace:'BIO WEAPON WATCH',channel:'INTERCEPTED AUDIO'}
    };
    const fallback={kind:'default',node:'DOCUMENT NODE',access:'FIELD REVIEW',integrity:'VERIFIED',trace:'ENABLED',channel:'ARCHIVE RECORD'};
    const esc=(v)=>String(v==null?'':v).replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const viewer=document.getElementById('archiveRecordViewer');
    let queueTimer=0;

    function activeArticle(){
      if(viewer && !viewer.hidden){
        const visible=viewer.querySelector('.record-detail:not([hidden])');
        if(visible) return visible;
      }
      return document.querySelector('.record-detail:not([hidden])');
    }
    function clearKinds(article){
      Array.from(article.classList).forEach(c=>{ if(c.indexOf('pc581r7-kind-')===0) article.classList.remove(c); });
    }
    function installOne(article){
      if(!article || !article.matches || !article.matches('.record-detail[data-record]')) return;
      const id=article.dataset.record||'';
      const profile=profiles[id]||fallback;
      clearKinds(article);
      article.classList.add('pc581r7-document-viewer','pc581r7-kind-'+profile.kind);
      article.dataset.docKind=profile.kind;
      const existing=article.querySelector(':scope > .pc581r7-doc-viewer');
      if(existing) return;
      const header=article.querySelector(':scope > .doc-header');
      const title=(header&&header.querySelector('.doc-title')?header.querySelector('.doc-title').textContent.trim():id)||id;
      const code=(header&&header.querySelector('.code')?header.querySelector('.code').textContent.trim():id)||id;
      const panel=document.createElement('div');
      panel.className='pc581r7-doc-viewer';
      panel.innerHTML='<div class="pc581r7-doc-core"><span>'+esc(profile.node)+'</span><b>'+esc(title)+'</b><small>'+esc(code)+'</small></div>'+
        '<div class="pc581r7-doc-grid">'+
        '<span><b>ACCESS LEVEL</b><i>'+esc(profile.access)+'</i></span>'+
        '<span><b>FILE INTEGRITY</b><i>'+esc(profile.integrity)+'</i></span>'+
        '<span><b>TRACE LOG</b><i>'+esc(profile.trace)+'</i></span>'+
        '<span><b>ARCHIVE CHANNEL</b><i>'+esc(profile.channel)+'</i></span>'+
        '</div><div class="pc581r7-doc-strip"><i></i><i></i><i></i><i></i><i></i></div>';
      if(header) header.insertAdjacentElement('afterend',panel);
      else article.insertAdjacentElement('afterbegin',panel);
    }
    function installVisible(){
      installOne(activeArticle());
    }
    function queueInstall(delay){
      clearTimeout(queueTimer);
      queueTimer=setTimeout(installVisible,delay||80);
    }

    // Initial pass is intentionally delayed and limited to the visible record only.
    queueInstall(180);

    // Record-open timing: run after the existing hash-check loader finishes, not while it is animating.
    document.addEventListener('click',(ev)=>{
      const target=ev.target;
      if(!(target instanceof Element)) return;
      if(target.closest('.open-record,[data-open-record],.archive-list a,.pc581r5-link-btn')){
        queueInstall(2220);
        setTimeout(installVisible,2520);
      }
      if(target.closest('.record-back')){
        const loading=document.getElementById('recordLoading');
        if(loading) loading.classList.remove('show');
      }
    },true);

    // Programmatic opens from map links use the same lightweight visible-only install.
    if(window.ProjectCurseShowInternalRecord && !window.ProjectCurseShowInternalRecord.__pc581r7aWrapped){
      const original=window.ProjectCurseShowInternalRecord;
      const wrapped=function(){
        const result=original.apply(this,arguments);
        queueInstall(2220);
        setTimeout(installVisible,2520);
        return result;
      };
      wrapped.__pc581r7aWrapped=true;
      window.ProjectCurseShowInternalRecord=wrapped;
    }

    // Narrow observer scope: hidden attribute changes only, debounced, visible record only.
    if(viewer && window.MutationObserver && !viewer.dataset.pc581r7aObserver){
      viewer.dataset.pc581r7aObserver='1';
      const mo=new MutationObserver(()=>queueInstall(140));
      mo.observe(viewer,{subtree:true,attributes:true,attributeFilter:['hidden']});
    }

    // Loader fail-safe: keep the intended loading FX, but never allow stale overlay to stay up.
    const loader=document.getElementById('recordLoading');
    if(loader && window.MutationObserver && !loader.dataset.pc581r7aFailsafe){
      loader.dataset.pc581r7aFailsafe='1';
      let hideTimer=0;
      const arm=()=>{
        clearTimeout(hideTimer);
        if(!loader.classList.contains('show')) return;
        hideTimer=setTimeout(()=>{
          if(loader.classList.contains('show')){
            loader.classList.add('done');
            loader.classList.remove('show');
          }
        },3200);
      };
      new MutationObserver(arm).observe(loader,{attributes:true,attributeFilter:['class']});
      arm();
    }
  });
})();


// PATCH 5.8.1R-10 — ArchiveViewerButtonUX + RevealRollback
// Removes the abandoned R-9 reveal behavior path and keeps only practical interaction cleanup.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch581r10:'ArchiveViewerButtonUX + RevealRollback'});
    const qsa=(root,sel)=>Array.from((root||document).querySelectorAll(sel));

    function factionStandby(){
      const detail=document.getElementById('factionDetail');
      if(detail){
        detail.classList.remove('faction-detail-loading');
        detail.innerHTML='<div class="pc581r10-faction-standby"><b>FACTION DATABASE STANDBY</b><span>세력 마크를 선택하면 해당 정보 페이지를 열람한다.</span></div>';
      }
      qsa(document,'.faction-tile').forEach(btn=>btn.classList.remove('active','selected'));
      qsa(document,'.faction-grid').forEach(grid=>grid.classList.remove('pc581r9-faction-focus','pc581r9a-focus','pc581r9b-focus','pc581r9c-focus'));
    }

    function relationReset(){
      const section=document.getElementById('faction-relation');
      if(!section) return;
      ['pc571Focus','pc57Focus','pc5641Focus','pc564Focus','pc563Focus'].forEach(k=>{try{section.dataset[k]='';}catch(e){}});
      section.classList.add('pc571-default-view','pc57-default-view');
      qsa(section,'.pc571-node,.pc57-node,.pc5641-node,.pc564-node,.pc563-node').forEach(btn=>{
        btn.classList.remove('selected','related','secondary','muted','pc581-selected','pc581-direct','pc581-secondary','pc581-muted','pc58-selected','pc58-direct','pc58-muted');
      });
      qsa(section,'.pc571-edge,.pc57-edge,.pc5641-edge,.pc564-edge,.pc563-edge').forEach(edge=>{
        edge.classList.remove('focus','secondary','dim','pc581-focus','pc581-secondary','pc581-dim','pc58-focus','pc58-dim');
      });
      qsa(section,'.relation-table tbody tr').forEach(row=>{
        row.classList.remove('pc571-row-active','pc571-row-muted','pc57-row-active','pc57-row-muted','pc5641-row-active','pc5641-row-muted','pc564-row-active','pc564-row-muted','relation-row-active','relation-row-muted');
      });
      const p=section.querySelector('.pc581r4-inspector,.pc57-analysis-panel,.pc571-analysis-panel');
      if(p){
        qsa(p,'[data-pc581r4-name],[data-pc57-name],[data-pc571-name]').forEach(el=>el.textContent='대기 중');
        qsa(p,'[data-pc581r4-state],[data-pc57-state],[data-pc571-state]').forEach(el=>el.textContent='NO NODE SELECTED / ALL NODES VISIBLE');
        qsa(p,'[data-pc581r4-status],[data-pc57-status],[data-pc571-status]').forEach(el=>el.textContent='전체 표시');
        qsa(p,'[data-pc581r4-grade],[data-pc57-grade],[data-pc571-grade]').forEach(el=>el.textContent='STANDBY');
      }
      qsa(section,'details.pc581r4-relation-details').forEach(d=>d.open=false);
    }

    function mapReset(){
      const api=window.ProjectCurseRegionalMap;
      if(api && typeof api.resetToWorld==='function') api.resetToWorld();
    }

    function archiveReset(){
      const viewer=document.getElementById('archiveRecordViewer');
      const list=document.getElementById('archiveListWrap');
      if(viewer){
        viewer.hidden=true;
        qsa(viewer,'.record-detail').forEach(el=>{el.hidden=true;});
      }
      if(list){
        list.classList.remove('is-hidden');
        qsa(list,'details').forEach(d=>d.open=true);
        qsa(list,'.doc-card,.open-record').forEach(el=>el.classList.remove('active','selected'));
      }
      qsa(document,'.record-surface-loader').forEach(el=>el.remove());
      qsa(document,'.record-surface-active').forEach(el=>el.classList.remove('record-surface-active'));
    }

    function historyReset(){
      const c=document.querySelector('.legacy-content');
      if(c) c.scrollTop=0;
      else window.scrollTo(0,0);
    }

    function resetMenuTarget(target){
      historyReset();
      if(target==='history') return;
      if(target==='faction-info') return factionStandby();
      if(target==='faction-relation') return relationReset();
      if(target==='zone-map') return mapReset();
      if(target==='archive-entry') return archiveReset();
    }

    qsa(document,'.side-menu a[data-target]').forEach(a=>{
      if(a.dataset.pc581r10ResetBound) return;
      a.dataset.pc581r10ResetBound='1';
      a.addEventListener('click',()=>{
        const target=a.dataset.target||'';
        setTimeout(()=>resetMenuTarget(target),60);
        setTimeout(()=>resetMenuTarget(target),360);
      },true);
    });

    // Initial override: Stable-2 auto-selected U.A.C; R-10 returns faction DB to standby on first load.
    setTimeout(()=>{
      const active=document.querySelector('.content-page.active');
      if(active && active.id==='faction-info') factionStandby();
      qsa(document,'.record-surface-loader').forEach(el=>el.remove());
    },180);

    // Archive button UX: mark tab groups for CSS-only server slot styling; no reveal/hide logic.
    function decorateArchiveTabs(root){
      qsa(root||document,'.record-detail .page-tabs').forEach(tabs=>{
        tabs.classList.add('pc581r10-surface-tabs');
        tabs.dataset.surfaceLabel='RECORD SURFACE SELECTOR';
      });
      qsa(root||document,'.record-detail .sub-tabs').forEach(tabs=>{
        tabs.classList.add('pc581r10-sub-tabs');
        tabs.dataset.surfaceLabel='SUB SURFACE SELECTOR';
      });
    }
    decorateArchiveTabs(document);
    document.addEventListener('click',(ev)=>{
      const target=ev.target;
      if(!(target instanceof Element)) return;
      if(target.closest('.open-record,.page-tab,.sub-tab,.record-back')){
        setTimeout(()=>decorateArchiveTabs(document),80);
        setTimeout(()=>{qsa(document,'.record-surface-loader').forEach(el=>el.remove());},40);
      }
    },true);
  });
})();

// PATCH 5.8.1R-11 — FactionDatabaseButtonUX
// Server-style focus and selector UX for the Faction Database screen only.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch581r11:'FactionDatabaseButtonUX'});
    const qsa=(root,sel)=>Array.from((root||document).querySelectorAll(sel));
    const esc=(v)=>String(v==null?'':v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    const factionInfo=document.getElementById('faction-info');
    const detail=document.getElementById('factionDetail');
    const grid=factionInfo?factionInfo.querySelector('.faction-grid'):null;
    if(!factionInfo || !detail || !grid) return;

    function tileList(){ return qsa(grid,'.faction-tile'); }
    function ensureTileStates(){
      tileList().forEach((tile,idx)=>{
        tile.dataset.pc581r11Index=String(idx+1).padStart(2,'0');
        if(!tile.querySelector(':scope > .pc581r11-tile-state')){
          const em=document.createElement('em');
          em.className='pc581r11-tile-state';
          em.textContent='STANDBY';
          em.setAttribute('aria-hidden','true');
          tile.appendChild(em);
        }
      });
    }

    function activeKey(){
      const active=grid.querySelector('.faction-tile.active');
      return active?active.dataset.key:'';
    }

    function updateTileFocus(){
      ensureTileStates();
      const key=activeKey();
      grid.classList.toggle('pc581r11-has-selection',!!key);
      tileList().forEach(tile=>{
        const selected=!!key && tile.dataset.key===key;
        tile.classList.toggle('pc581r11-selected',selected);
        tile.classList.toggle('pc581r11-dimmed',!!key && !selected);
        const state=tile.querySelector(':scope > .pc581r11-tile-state');
        if(state) state.textContent=selected?'ACTIVE / OPEN':'STANDBY';
      });
    }

    function factionNameFromDetail(){
      const h=detail.querySelector(':scope > h3');
      return h ? h.textContent.trim() : '';
    }

    function installDossierHeader(){
      const name=factionNameFromDetail();
      if(!name || detail.querySelector(':scope > .pc581r11-dossier-head')) return;
      const meta=(detail.querySelector(':scope > .meta')||{}).textContent||'';
      const key=activeKey();
      const tiles=tileList();
      const idx=Math.max(0,tiles.findIndex(t=>t.dataset.key===key))+1;
      const code=String(idx||1).padStart(2,'0');
      const head=document.createElement('div');
      head.className='pc581r11-dossier-head';
      head.innerHTML='<div class="pc581r11-dossier-title"><b>DATABASE NODE</b><span>FACTION DOSSIER // ACCESS VERIFIED</span></div>'+
        '<div class="pc581r11-dossier-grid">'+
        '<span><b>FACTION</b><i>'+esc(name)+'</i></span>'+
        '<span><b>DATABASE MATCH</b><i>'+esc(code)+'</i></span>'+
        '<span><b>ACCESS LEVEL</b><i>FIELD REVIEW</i></span>'+
        '<span><b>DOSSIER STATUS</b><i>VERIFIED</i></span>'+
        '<span class="wide"><b>META</b><i>'+esc(meta||'분류 기록 대기')+'</i></span>'+
        '</div>';
      detail.insertBefore(head,detail.firstChild);
    }

    function upgradeDetailTabs(){
      const tabs=detail.querySelector('.detail-tabs');
      if(!tabs) return;
      tabs.classList.add('pc581r11-detail-tabs');
      tabs.setAttribute('data-selector-label','DOSSIER RECORD SELECTOR');
      qsa(tabs,'.detail-tab').forEach(btn=>{
        if(!btn.querySelector(':scope > .pc581r11-tab-state')){
          const em=document.createElement('em');
          em.className='pc581r11-tab-state';
          em.setAttribute('aria-hidden','true');
          btn.appendChild(em);
        }
      });
      updateDetailTabStates();
    }

    function updateDetailTabStates(){
      const tabs=detail.querySelector('.detail-tabs');
      if(!tabs) return;
      qsa(tabs,'.detail-tab').forEach(btn=>{
        const em=btn.querySelector(':scope > .pc581r11-tab-state');
        if(em) em.textContent=btn.classList.contains('active')?'OPEN':'QUEUE';
      });
    }

    function isStandby(){ return !!detail.querySelector(':scope > .pc581r10-faction-standby'); }

    function applyFactionDatabaseUX(){
      ensureTileStates();
      updateTileFocus();
      if(isStandby()){
        detail.classList.remove('pc581r11-dossier-ready');
        grid.classList.remove('pc581r11-has-selection');
        tileList().forEach(tile=>{
          tile.classList.remove('pc581r11-selected','pc581r11-dimmed');
          const state=tile.querySelector(':scope > .pc581r11-tile-state');
          if(state) state.textContent='STANDBY';
        });
        const stand=detail.querySelector(':scope > .pc581r10-faction-standby');
        if(stand && !stand.querySelector('.pc581r11-standby-grid')){
          stand.insertAdjacentHTML('beforeend','<div class="pc581r11-standby-grid"><span><b>QUERY</b><i>WAITING</i></span><span><b>ACCESS ROUTE</b><i>FACTION DATABASE</i></span><span><b>DOSSIER</b><i>NOT MOUNTED</i></span></div>');
        }
        return;
      }
      if(factionNameFromDetail()){
        detail.classList.add('pc581r11-dossier-ready');
        installDossierHeader();
        upgradeDetailTabs();
      }
    }

    ensureTileStates();
    applyFactionDatabaseUX();

    grid.addEventListener('click',ev=>{
      const tile=ev.target.closest('.faction-tile');
      if(!tile) return;
      setTimeout(applyFactionDatabaseUX,0);
      setTimeout(applyFactionDatabaseUX,80);
    },true);
    grid.addEventListener('keydown',ev=>{
      if(ev.key!=='Enter' && ev.key!==' ') return;
      const tile=ev.target.closest('.faction-tile');
      if(!tile) return;
      setTimeout(applyFactionDatabaseUX,0);
      setTimeout(applyFactionDatabaseUX,80);
    },true);
    detail.addEventListener('click',ev=>{
      if(ev.target.closest('.detail-tab')){
        setTimeout(()=>{upgradeDetailTabs(); updateDetailTabStates();},0);
        setTimeout(()=>{upgradeDetailTabs(); updateDetailTabStates();},60);
      }
    },true);

    if(window.MutationObserver){
      let busy=false;
      new MutationObserver(()=>{
        if(busy) return;
        busy=true;
        requestAnimationFrame(()=>{ applyFactionDatabaseUX(); busy=false; });
      }).observe(detail,{childList:true,subtree:false});
    }

    qsa(document,'.side-menu a[data-target]').forEach(a=>{
      a.addEventListener('click',()=>{
        setTimeout(applyFactionDatabaseUX,180);
        setTimeout(applyFactionDatabaseUX,420);
      },true);
    });
  });
})();

// PATCH 5.8.1R-15 — AudioVolumeBalanceQA
// Finalizes server-style audio roles with lower volumes and contextual duplicate suppression.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch581r15:'AudioVolumeBalanceQA'});
    const audioKey='pc_audio_legacy2003_fixed';
    const soundOn=()=>localStorage.getItem(audioKey)!=='off';
    const roleVolume={
      menu:0.13,
      page:0.16,
      recordOpen:0.20,
      recordLoad:0.27,
      boot:0.20,
      ambient:0.045
    };
    const roleGap={
      menu:155,
      page:145,
      recordOpen:240,
      recordLoad:680,
      boot:1250,
      ambient:0
    };
    const lastPlayed=Object.create(null);
    let lastContext='';
    let lastContextAt=0;

    function roleFromSrc(src){
      src=String(src||'');
      if(/menu_tick\.mp3(?:$|\?)/.test(src)) return 'menu';
      if(/page_turn\.mp3(?:$|\?)/.test(src)) return 'page';
      if(/record_open\.mp3(?:$|\?)/.test(src)) return 'recordOpen';
      if(/record_load\.mp3(?:$|\?)/.test(src)) return 'recordLoad';
      if(/boot_legacy\.mp3(?:$|\?)/.test(src)) return 'boot';
      if(/ambient_loop\.mp3(?:$|\?)/.test(src)) return 'ambient';
      return '';
    }
    function contextFromTarget(target){
      if(!target || !target.closest) return '';
      if(target.closest('.side-menu a[data-target]')) return 'main-menu';
      if(target.closest('.faction-tile')) return 'faction-tile';
      if(target.closest('.pc571-node,.relation-table tbody tr')) return 'relation-trace';
      if(target.closest('.uac-r24-regional-map,.r24-item,.r24-region-tab,.r24-filter,.r24-world-btn,[data-r24-report],[data-r24-copy]')) return 'map-surface';
      if(target.closest('.page-tab,.sub-tab,.detail-tab')) return 'surface-tab';
      if(target.closest('.open-record,[data-open-record],.archive-list a')) return 'record-open';
      return '';
    }
    function markContext(ev){
      const c=contextFromTarget(ev.target);
      if(!c) return;
      lastContext=c;
      lastContextAt=performance.now();
    }
    document.addEventListener('pointerdown',markContext,true);
    document.addEventListener('click',markContext,true);
    document.addEventListener('keydown',(ev)=>{ if(ev.key==='Enter'||ev.key===' ') markContext(ev); },true);

    const proto=window.HTMLMediaElement && window.HTMLMediaElement.prototype;
    if(proto && !proto.__pc581r15AudioBalance){
      const nativePlay=proto.play;
      Object.defineProperty(proto,'__pc581r15AudioBalance',{value:true, configurable:true});
      proto.play=function(){
        const src=String(this.currentSrc||this.src||'');
        const role=roleFromSrc(src);
        if(role){
          try{ this.volume=roleVolume[role]; }catch(e){}
          if(!soundOn() && role!=='ambient') return Promise.resolve();
          const now=performance.now();
          const gap=roleGap[role]||120;
          if(gap && lastPlayed[role] && now-lastPlayed[role]<gap) return Promise.resolve();
          const ctxFresh=now-lastContextAt<260;
          // These contexts already have their own WebAudio or page-turn tone. Suppress the generic tick/open layer.
          if(ctxFresh && role==='menu' && (lastContext==='faction-tile'||lastContext==='relation-trace'||lastContext==='map-surface')) return Promise.resolve();
          if(ctxFresh && role==='recordOpen' && lastContext==='surface-tab') return Promise.resolve();
          if(ctxFresh && role==='page' && lastContext==='main-menu') return Promise.resolve();
          lastPlayed[role]=now;
        }
        return nativePlay.apply(this,arguments);
      };
    }

    // A light non-invasive volume pass for already-created media nodes.
    document.querySelectorAll('audio').forEach(el=>{
      const role=roleFromSrc(el.currentSrc||el.src||'');
      if(role){ try{ el.volume=roleVolume[role]; }catch(e){} }
    });
  });
})();

