document.addEventListener('DOMContentLoaded',()=>{
  function rootPrefix(){const p=location.pathname; if(p.includes('/docs/'))return '../../'; if(p.includes('/archive/'))return '../'; return '';}
  const prefix=rootPrefix();
  const loader=document.getElementById('loader');
  const app=document.getElementById('app');
  const audio={menu:new Audio(prefix+'assets/audio/menu_tick.mp3'),open:new Audio(prefix+'assets/audio/record_open.mp3'),page:new Audio(prefix+'assets/audio/page_turn.mp3'),boot:new Audio(prefix+'assets/audio/boot_legacy.mp3'),ambient:new Audio(prefix+'assets/audio/ambient_loop.mp3'),load:new Audio(prefix+'assets/audio/record_load.mp3')};
  audio.menu.volume=.26; audio.open.volume=.30; audio.page.volume=.28; audio.boot.volume=.30; audio.load.volume=.42; audio.ambient.volume=.11; audio.ambient.loop=true;
  let ambientStarted=false;
  if(localStorage.getItem('pc_audio_legacy2003_fixed')===null) localStorage.setItem('pc_audio_legacy2003_fixed','on');
  function isOn(){return localStorage.getItem('pc_audio_legacy2003_fixed')!=='off'}
  function play(a){if(!isOn()||!a)return; try{a.currentTime=0; a.play().catch(()=>{});}catch(e){}}
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
  function showRecordLoad(next){const el=ensureRecordLoader(); el.classList.remove('done'); void el.offsetWidth; el.classList.add('show'); startAmbient(); play(audio.load||audio.open); const minTime=2050; setTimeout(()=>{ el.classList.add('done'); if(typeof next==='function') next(); else el.classList.remove('show'); },minTime);}
  function syncBtns(){document.querySelectorAll('#audioToggle').forEach(b=>b.textContent=isOn()?'효과음: 켜짐':'효과음: 꺼짐')}
  syncBtns();
  const bootLines=Array.from(document.querySelectorAll('#bootLines p'));
  bootLines.forEach((line,i)=>setTimeout(()=>line.classList.add('show'),220+i*260));
  if(loader){setTimeout(()=>{loader.classList.add('hide'); if(app)app.classList.add('ready'); play(audio.boot);},2350);} else {if(app)app.classList.add('ready');}
  document.querySelectorAll('#audioToggle').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('pc_audio_legacy2003_fixed',isOn()?'off':'on'); syncBtns(); if(isOn())play(audio.menu);}));
  const pages=Array.from(document.querySelectorAll('.content-page'));
  const links=Array.from(document.querySelectorAll('.side-menu a[data-target]'));
  function show(id){
    if(!pages.length)return;
    if(!pages.some(p=>p.id===id)) id='history';
    pages.forEach(p=>p.classList.toggle('active',p.id===id));
    links.forEach(a=>a.classList.toggle('active',a.dataset.target===id));
    const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0;
  }
  links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); startAmbient(); play(audio.menu); show(a.dataset.target); history.replaceState(null,'','#'+a.dataset.target);}));
  if(pages.length){show((location.hash||'#history').slice(1));}
  document.querySelectorAll('[data-open-record], .archive-list a, .backline a, .btn:not(.open-record):not(.record-back)').forEach(a=>a.addEventListener('click',()=>play(audio.open)));
  const factionData={"uac": {"img": "uac.webp", "name": "U.A.C", "meta": "Urban Anomaly 봉쇄 / 도시 이상현상 격리국", "summary": "도시 이상현상과 우시노다교 의식, 괴이 출현, 레드존 확산을 감시하고 격리하는 상위 통제 기관.", "pages": [{"title": "개요", "body": "<p>U.A.C는 도시 내부에서 발생하는 이상현상, 괴이 출현, 우시노다교 의식, 오컬트 재난, 적성 종교 세력의 침투를 감시하고 격리하기 위해 설립된 국가 안보 기관이다.</p><p>정식 명칭은 Urban Anomaly 봉쇄이며, 한국어 명칭으로는 도시 이상현상 격리국이라 불린다. U.A.C는 단순한 수사 기관이나 군사 조직이 아니라, 도시 단위의 초상 재난을 감시하고 위험 구역을 분류하며 이상현상의 확산을 막기 위해 각 기관을 조율하는 상위 통제 기관에 가깝다.</p>"}, {"title": "창설 배경", "body": "<p>U.A.C의 창설 기점은 1986년으로 기록된다. 당시 정부는 대규모 인신공양 사건을 저지하기 위해 불멸을 향해 및 Blood Lake Incident File 작전을 승인하였다.</p><p>해당 작전은 우시노다교가 준비하던 대규모 인신공양 의식을 차단하기 위한 특수 작전이었으며, 의식의 완전한 진행은 저지되었다. 그러나 작전 이후 다수의 괴이체, 비정상적인 생체 변이, 오염된 의식 흔적, 기존 법집행기관으로는 설명하거나 통제할 수 없는 이상현상이 확인되었다.</p><p>정부는 이 사건을 계기로 일시적인 대응팀이 아닌, 영구적으로 이상현상을 감시하고 격리할 전문 기관이 필요하다고 판단하였다. 그 결과 설립된 조직이 U.A.C이다.</p>"}, {"title": "초기 조직 체계", "body": "<p>창설 초기에는 S.I.D와 N.H.C가 각각 조사 부서와 현장 진압 부서로서 U.A.C 산하에 편제되어 있었다. 우시노다교 의식, 괴이 출현, 인신공양 사건에 대응할 전문 기관이 부족했기 때문에 조사, 정보 수집, 현장 진압 기능이 모두 U.A.C 내부 체계에 묶여 있었다.</p><ul><li>U.A.C : 상위 통제 기관</li><li>S.I.D : 특수 조사 부서</li><li>N.H.C : 현장 진압 부서</li></ul>"}, {"title": "현재 조직 체계", "body": "<p>우시노다 현상, 괴이 출현, 레드존 확산, 혈교 의식, 블랙존화 사건이 증가하면서 기존 U.A.C 내부 부서 체계만으로는 대응이 어려워졌다.</p><p>이후 조직 개편을 통해 S.I.D와 N.H.C는 U.A.C 산하 하위 부서에서 분리되어 독립 기관으로 재편되었다. 현재 U.A.C는 도시 이상현상의 상위 통제와 구역 분류, 정보 관리, 기관 간 작전 조율을 담당하며, S.I.D와 N.H.C는 독립 기관으로서 U.A.C와 협력한다.</p><ul><li>U.A.C : 상위 통제, 구역 분류, 정보 관리</li><li>S.I.D : 독립 특수 조사 기관</li><li>N.H.C : 독립 현장 대응 조직</li></ul>"}, {"title": "핵심 목표", "body": "<p>U.A.C의 핵심 목표는 우시노다교의 인신공양 의식을 사전에 차단하고, 그로 인해 발생하는 타락 개체을 제거 또는 통제하는 것이다.</p><p>이후 우시노다 현상과 혈교 의식, 타락교 하위 조직, 인공 괴이, 피의 호수, 변이 균주와 같은 사건들이 늘어나면서 U.A.C의 임무 범위는 확장되었다. 현재 U.A.C는 괴이를 제거하는 기관이 아니라, 도시 전체가 레드존 또는 블랙존으로 변질되는 것을 막기 위한 최종 통제선으로 기능한다.</p>"}, {"title": "주요 임무", "body": "<ul><li>우시노다교 인신공양 의식 사전 차단</li><li>타락 개체 출현 감시</li><li>그린존, 옐로우존, 레드존, 화이트존, 블랙존 분류</li><li>이상현상 발생 지역 봉쇄 및 정보 통제</li><li>현장 기록, CCTV, 오디오, 생체 샘플 회수</li><li>S.I.D, N.H.C, F.H.C, A.R.F, C.P.D와의 작전 조율</li><li>위험 인물 및 비인가 연구자 감시</li><li>오컬트 생명체, 미확인 균주, 변이 조직 분석</li><li>민간 사회로의 정보 유출 차단</li></ul>"}, {"title": "정보 수집 부서", "body": "<p>U.A.C 정보 수집 부서는 도시 전역의 감시 영상, 통신 기록, 오디오 파일, 암호화 CCTV, 현장 데이터를 수집하고 복구하는 정보 부서이다. 이 부서는 U.A.C의 눈으로 불리며, 이상현상이 발생하기 전의 징후를 포착하고 이미 발생한 사건의 기록을 복원하는 역할을 맡는다.</p><p>주로 N.H.C 내부 이탈 징후, S.I.D 현장 보고, F.H.C 회수 문서, 타락교 및 혈교 활동 기록을 분석한다. 레드울프 이탈 기록과 축복으로 위장된 병기는 해당 부서가 복구한 감시 자료로 분류된다.</p><ul><li>암호화 영상 복호화</li><li>감시 데이터 수집</li><li>통신 기록 분석</li><li>내부 반역 징후 감시</li><li>적성 세력 활동 추적</li><li>위험 인물 파일 작성</li><li>비인가 오디오 및 CCTV 자료 복구</li><li>우시노다 현상 발생 전조 감지</li></ul>"}, {"title": "도시 격리 집행부", "body": "<p>U.A.C 도시 격리 집행부는 확인된 이상현상 발생 지역을 봉쇄하고, 괴이 및 오염 요소의 확산을 차단하는 실행 부서이다. 이 부서는 U.A.C의 망치로 불리며, 직접적인 전투만을 담당하는 조직이라기보다는 현장 봉쇄, 격리 명령, 출입 통제, 구역 등급 격상, 지원 부대 호출 권한을 가진 작전 집행 체계에 가깝다.</p><ul><li>이상현상 발생 지역 봉쇄</li><li>구역 출입 통제</li><li>민간인 대피 명령 승인</li><li>현장 격리선 설치</li><li>N.H.C 및 A.R.F 투입 요청</li><li>C.P.D와 연계한 피난민 통제</li><li>레드존 및 블랙존화 징후 감시</li><li>우시노다교 의식장 차단</li><li>괴이체 확산 경로 봉쇄</li></ul>"}, {"title": "오컬트 생명 과학 부서", "body": "<p>U.A.C 오컬트 생명 과학 부서는 괴이, 타락체, 피의 호수, 미확인 균주, 변이 조직을 연구하는 생체 분석 부서이다. 일반적인 생물학이나 법의학으로 설명할 수 없는 사체, 조직, 체액, 균주, 장기 반응을 조사한다.</p><p>피의 호수 부검 기록에서 마렌 예거트의 시신을 분석했으며, BL-088 균주를 최초로 임시 분류한 부서로 기록된다.</p><ul><li>괴이 조직 분석</li><li>타락 생명체 부검</li><li>미확인 균주 분류</li><li>생체 부패 정지 반응 연구</li><li>혈액성 잔류물 분석</li><li>괴이 유전자 자료 대조</li><li>F.H.C 분석 부서와 샘플 공유</li><li>타락 개체 변이 과정 기록</li></ul>"}]}, "nhc": {"img": "nhc.webp", "name": "N.H.C", "meta": "National Hazard Control / 국가 위난 격리 사령부", "summary": "레드존과 블랙존 인접 지역에 투입되는 고위험 현장 대응 조직.", "pages": [{"title": "개요", "body": "<p>N.H.C는 레드존, 옐로우존, 블랙존 인접 지역에 투입되는 고위험 현장 대응 조직이다. 초기에는 U.A.C 산하 현장 진압 부서로 운용되었으나, 레드존 확산과 블랙존화 사건이 증가하면서 독립적인 현장 대응 조직으로 재편되었다.</p><p>괴이 섬멸, 방어선 유지, 고위험 구역 봉쇄, 생존자 회수, 적성 무장 세력 제압을 담당한다. U.A.C가 전체 통제와 정보 관리를 담당한다면, N.H.C는 직접적인 전투와 현장 작전을 수행하는 조직이다.</p>"}, {"title": "레드울프 이탈", "body": "<p>과거 N.H.C 산하에는 레드울프가 1차 작전팀으로 존재했다. 그러나 그린존 붕괴 이후 이어진 사건을 계기로 해당 팀은 사실상 이탈하였고, 현재는 신디케이트 주요팀으로 분류된다.</p>"}, {"title": "주요 임무", "body": "<ul><li>레드존 방어선 유지</li><li>괴이 및 타락체 섬멸</li><li>고위험 구역 봉쇄</li><li>생존자 제한 구조</li><li>적성 무장 세력 제압</li><li>블랙존화 징후 감시</li><li>오염 구역 정화 및 소각 판단</li></ul>"}, {"title": "전술 및 특수 자산", "body": "<p>N.H.C는 일반 화기뿐만 아니라 타락 개체의 재생력을 억제하는 고주파 소각탄, 혈액 변이를 중단시키는 화학 중화 가스, 대괴이 특수 탄약 등 우시노다 현상에 특화된 독점 병기를 운용한다.</p><p>포획된 변이체를 해부하여 약점을 찾아내고, 인간 요원들에게 초자연적 저항력을 부여하는 위험한 시술 시설을 보유하고 있다는 의혹도 존재한다.</p>"}, {"title": "위버맨시", "body": "<p>위버맨시는 N.H.C의 기술력으로 탄생한 대생명체 전용 강화병이다. 우시노다 현상, 혈교 의식, 타락교 정신 오염, 그림자 계열 이상현상에 대응하기 위해 만들어진 극비 전력이다.</p><p>타락 개체와 대등하게 싸울 수 있는 유일한 인간형 전력으로 평가되지만, 시술 부작용으로 인해 서서히 인간성을 잃거나 결국 스스로가 격리 대상이 되는 경우가 있다.</p>"}, {"title": "기본 핵심 능력", "body": "<h4>혈액 중화 및 강화</h4><p>혈교의 혈액 마법에 대응하기 위해 자신의 혈액을 특수 화학 물질로 치환한 개체군이다. 이 혈액은 괴이체의 산성 혈액에 부식되지 않으며, 상처 부위를 빠르게 응고시키는 초재생 반응을 제공한다.</p><h4>신경계 가속</h4><p>그림자 계열 이상현상에 대응하기 위해 신경계를 기계적으로 가속한 개체군이다. 그림자 속에서 적이 나타나는 찰나의 움직임을 포착할 수 있는 초감각적 반사신경을 가진다.</p><h4>정신 격벽</h4><p>타락교의 정신 오염을 차단하기 위해 뇌에 인지 필터 칩을 삽입한 개체군이다. 환각이나 공포를 노이즈로 처리하여 무시할 수 있지만, 부작용으로 인간적인 감정까지 거세되어 기계처럼 차가운 성격이 되는 경우가 있다.</p>"}, {"title": "교단 분파별 사냥 전술", "body": "<h4>타락교 대응</h4><p>S.I.D가 특수 전파 교란기로 공간 왜곡을 억제하는 동안, 위버맨시는 정신 격벽을 활성화한 채 안개를 뚫고 진입한다.</p><h4>혈교 대응</h4><p>위버맨시는 대괴이용 무기를 사용하여 혈교의 경질화된 피와 뼈 무기를 절단한다. 혈액 마법에 전염되지 않는 특수 방호복과 중화 혈액 덕분에 강제 변이 공격을 무시하며 육탄전으로 괴물들을 제압한다.</p><h4>그림자교 대응</h4><p>고광도 UV 조명탄과 음파 탐지기로 그림자교의 은신처를 강제로 노출시킨다. 그림자 속으로 숨으려는 적을 가속된 신경계로 추적하여 비물질화가 풀리는 짧은 순간을 노려 특수 탄환으로 사살한다.</p>"}]}, "sid": {"img": "sid.webp", "name": "S.I.D", "meta": "Special Investigation Department / 특수 수사과", "summary": "이상현상, 오컬트 사건, 실종 사건, 심각 범죄를 조사하는 특수 조사 조직.", "pages": [{"title": "개요", "body": "<p>S.I.D는 이상현상, 심각 범죄, 괴이 출현, 오컬트 사건을 조사하는 특수 조사 조직이다. 초기에는 U.A.C 산하 특수 조사 부서로 운용되었으나, 사건 규모가 확대되고 지역별 독립 조사가 필요해지면서 독립 기관으로 재편되었다.</p><p>일반적인 수사 기관으로 해결하기 어려운 사건을 담당하며, 현장 조사, 피해자 기록, 의식 흔적 분석, 민간 구역 감시를 수행한다. 그린존 내부의 치안 유지와 이상현상 감시 역시 S.I.D의 주요 임무 중 하나이다.</p>"}, {"title": "핵심 임무", "body": "<ul><li>도심 및 일상 공간에서 발생하는 기괴한 징후 감지</li><li>피의 연못, 그림자 전이, 신체 변이 등 초상 현상 추적</li><li>우시노다 현상 발생 경로 분석</li><li>교단 은신처 및 의식장 식별</li><li>초자연적 에너지 잔류량 측정</li><li>F.H.C, 타락교, 혈교 관련 의도적 의식 여부 판별</li><li>현장 1차 봉쇄 및 정보 검열</li></ul>"}, {"title": "N.H.C와의 공조", "body": "<p>S.I.D는 수집된 데이터를 분석하여 N.H.C가 화력을 집중할 지점을 지목한다. 현상 발생 시 가장 먼저 현장에 도착하여 반경 수 킬로미터를 물리적으로 폐쇄하고, 외부인의 출입을 막으며 진실이 유출되지 않도록 정보 검열을 병행한다.</p><p>상황이 걷잡을 수 없이 커질 경우 N.H.C의 정규군 병력에 배속되어 현장 가이드 및 전술 지원팀으로 직접 전투에 참여한다.</p>"}, {"title": "무장 및 전술 지위", "body": "<p>S.I.D는 경찰 계열 조사 조직이지만 일반 총기 외에도 대크리처 전용 특수 탄환, 전파 교란기, 고감도 열화상 탐지기 등 군사 수준의 장비를 운용한다.</p><p>주 임무는 조사와 차단이지만, 초기 대응 실패 시 N.H.C가 도착하기 전까지 1차 봉쇄선을 유지해야 한다.</p>"}, {"title": "오컬트 부서", "body": "<p>S.I.D 오컬트 부서는 우시노다 현상, 괴이 출현, 타락교 관련 사건, 혈교 의식 흔적 등을 조사하는 전문 부서이다. 현장 조사관, 특수 효과 분석 담당자, 기록 담당자, 심각 범죄 분석관으로 구성되어 있다.</p><p>사쿠마 유타 실종 사건 보고서는 S.I.D 일본 도쿄 지부 오컬트 부서가 관리하던 사건 기록으로 분류된다.</p><ul><li>오컬트 범죄 현장 조사</li><li>괴이 흔적 판독</li><li>우시노다교 관련 문서 회수</li><li>피해자 관계 인물 조사</li><li>정신 오염 가능성 판정</li><li>U.A.C 및 F.H.C로 자료 이관</li></ul>"}]}, "ashcrew": {"img": "ashcrew.webp", "name": "Ash Crew", "meta": "괴이 사체 처리반 / N.H.C 산하 특수 처리반", "summary": "전투 이후 남은 오염 사체, 괴이 잔해, Blood Gate 잔류물, 오염된 장비를 봉인·회수·소각하는 처리반.", "pages": [{"title": "개요", "body": "<p>Ash Crew는 독립 세력이 아니라 N.H.C 산하 특수 처리반이다. 일반 N.H.C 전투조가 진압과 봉쇄를 담당한다면, Ash Crew는 전투 이후 남은 오염 사체, 괴이 잔해, 블랙 태그 대상, 오염된 장비, Blood Gate 잔류물을 봉인하고 소각한다.</p><p>이 부대는 전투의 승패가 결정된 뒤에도 끝나지 않는 현장 오염을 처리하기 위해 운용된다. 잔해 하나가 새로운 오염 매개체가 될 수 있기 때문에, Ash Crew의 임무는 단순한 청소가 아니라 2차 재난 차단에 가깝다.</p>"}, {"title": "오염 사체 처리", "body": "<p>괴이 사체, 타락 개체 잔해, 부패 정지 상태의 인체 조직, 혈액성 잔류물은 일반 의료·군수 절차로 처리하지 않는다. Ash Crew는 블랙 태그 봉인 백과 고열 소각 장비를 사용해 현장 반출 전 오염 수치를 측정하고, 회수 불가 판정 시 현장에서 소각한다.</p><ul><li>괴이 사체의 부위별 분리 봉인</li><li>혈액성 잔류물의 중화 및 소각</li><li>감염 가능 장비의 임시 격납</li><li>귀환자 접촉 흔적의 별도 기록</li></ul>"}, {"title": "블랙 태그", "body": "<p>블랙 태그 대상은 일반 회수 대상으로 분류되지 않는다. 해당 대상은 살아있는 생존자처럼 보이더라도 오염 매개체, 위장 개체, 자율 증식 조직일 가능성이 있어 Ash Crew 또는 U.A.C 고위 승인 없이는 반출할 수 없다.</p><p>A.R.F가 회수 작전을 수행하더라도 블랙 태그 대상은 Ash Crew의 현장 판정을 거친 뒤 봉인·소각·격리 중 하나로 처리된다.</p>"}, {"title": "오염된 장비", "body": "<p>오염된 장비는 현장 인원이 사용했거나 접촉한 장비가 의식 잔류물, 혈액성 반응, Ghost Channel 노이즈와 결합해 독립 위험물로 변한 것을 뜻한다. Ash Crew는 해당 장비를 군수품으로 회수하지 않고 별도 저주 오염 장비로 분류한다.</p><ul><li>손상된 혈무 또는 오염 탄창</li><li>Ghost Channel 반응을 보이는 무전기</li><li>피의 호수 잔류물에 노출된 방호복</li><li>사용자 사망 후에도 반응하는 장비</li></ul>"}, {"title": "주요 장비", "body": "<ul><li>블랙 태그 봉인 백</li><li>고열 소각기</li><li>CI-O 오염 측정기</li><li>Ghost Channel 차단기</li><li>Ash Truck 현장 처리 차량</li><li>오염 장비 임시 격납 케이스</li><li>혈액성 잔류물 중화 팩</li></ul>"}, {"title": "협력 기관", "body": "<p>Ash Crew는 N.H.C의 후속 처리반이지만 단독으로 모든 결정을 내리지 않는다. S.I.D가 현장 증거를 확인하고, A.R.F가 회수 가능한 물리 자료를 선별하며, F.H.C는 일부 샘플의 분석 필요성을 제기한다. 다만 블랙 태그 대상의 최종 반출 여부는 U.A.C 통제권 아래 결정된다.</p>"}]}, "arf": {"img": "arf.webp", "name": "A.R.F", "meta": "Anomaly Recovery Force / 이상현상 회수 부대", "summary": "전면 교전보다 생존자, 샘플, 기록 매체, 장비, 시신, 기밀 자산 회수에 특화된 조직.", "pages": [{"title": "개요", "body": "<p>A.R.F는 이상현상 회수 부대다. 전면 교전보다 생존자, 샘플, 기록 매체, 장비, 시신, 기밀 자산을 회수하는 역할에 특화되어 있다.</p><p>이들은 N.H.C가 교전 구역을 확보한 뒤 후속 진입하며, 아직 완전히 안전하지 않은 현장에서 정보와 물증을 보존하는 역할을 맡는다.</p>"}, {"title": "회수 임무", "body": "<ul><li>생존자 제한 구조 및 이송</li><li>시신과 신원 불명 인체 잔해 반출</li><li>현장 기록 매체, 카메라, 오디오 장비 회수</li><li>괴이 조직과 혈액 샘플의 1차 격납</li><li>기밀 장비와 오염 문서 회수</li></ul>"}, {"title": "작전 구조", "body": "<p>A.R.F는 선두 전투부대가 아니다. N.H.C가 위험 개체를 제압하거나 방어선을 확보한 뒤 진입하며, S.I.D가 지정한 증거물과 U.A.C가 요구한 기록 매체를 우선 회수한다.</p><p>현장 상황이 불안정할 경우 A.R.F는 회수보다 봉쇄선 외곽 대기를 우선하며, N.H.C 호위 없이 레드존 심부로 진입하지 않는다.</p>"}, {"title": "F.H.C 분석 전 단계", "body": "<p>F.H.C가 분석하는 대부분의 샘플은 A.R.F가 먼저 물리적으로 회수한다. A.R.F는 연구 조직이 아니라 회수 조직이므로, 샘플의 의미를 해석하기보다 원형 보존과 오염 확산 방지를 우선한다.</p><ul><li>샘플 원형 보존</li><li>현장 좌표 및 회수 시간 기록</li><li>동행 인원 오염 노출 기록</li><li>분석기관 이송 전 봉인 확인</li></ul>"}, {"title": "Ash Crew와의 차이", "body": "<p>A.R.F는 회수 가능한 자료와 생존자를 반출하는 부대이고, Ash Crew는 회수 불가 또는 위험성이 높은 사체·장비를 처리하는 부대다. 블랙 태그 대상은 A.R.F가 단독 회수하지 않고 Ash Crew 또는 U.A.C의 판단을 따른다.</p>"}]}, "cpd": {"img": "cpd.webp", "name": "C.P.D", "meta": "Civilian Protection Division / 민간 보호 조직", "summary": "민간 보호와 외곽 질서 유지, 피난민 관리, 귀환자 분리 절차를 담당하는 조직.", "pages": [{"title": "개요", "body": "<p>C.P.D는 민간 보호와 외곽 질서 유지를 담당하는 조직이다. 레드존 안쪽으로 깊게 들어가기보다는 검문선, 대피소, 보호 구역, 귀환자 분리 절차를 관리한다.</p><p>U.A.C와 N.H.C가 이상현상과 교전을 관리한다면, C.P.D는 그 바깥에서 민간 사회가 완전히 붕괴하지 않도록 질서를 유지한다.</p>"}, {"title": "피난민 관리", "body": "<ul><li>피난민 대기 구역 관리</li><li>대피 경로 통제</li><li>가족 단위 신원 확인</li><li>오염 노출자와 일반 민간인 분리</li><li>식량, 의료품, 임시 거주 구역 배정</li></ul>"}, {"title": "검문 게이트", "body": "<p>C.P.D 검문 게이트는 그린존과 옐로우존, 옐로우존과 레드존 외곽을 나누는 민간 통제선이다. 모든 통과 인원은 신분 확인, 오염 반응 검사, 귀환자 판정을 거친다.</p><p>의심 인원은 S.I.D나 U.A.C 조사반으로 이관되며, 폭동이나 강제 돌파 시 N.H.C 외곽 경계대가 지원된다.</p>"}, {"title": "귀환자", "body": "<p>귀환자는 실종 이후 돌아온 민간인 중 기억 공백, 생체 반응 이상, 타인의 신원 모방, Ghost Channel 반응을 보이는 대상을 말한다. C.P.D는 이들을 일반 피난민과 분리하고 S.I.D 조사 전까지 보호 격리한다.</p>"}, {"title": "C.P.D 대피버스", "body": "<p>C.P.D 대피버스는 레드존 외곽과 옐로우존에서 민간인을 그린 코어 또는 임시 대피소로 옮기는 이동 수단이다. 단순 수송 차량이 아니라 이동식 검문·분리 절차를 수행하는 민간 보호 장비로 운용된다.</p>"}, {"title": "기관 관계", "body": "<p>C.P.D는 U.A.C 행정 통제 아래 운영되며, S.I.D와는 민간 구역 조사 및 실종자 자료 공유를, N.H.C와는 외곽 봉쇄 및 대피 지원을, A.R.F와는 생존자 이송 절차를 공유한다.</p>"}]}, "fhc": {"img": "fhc.webp", "name": "F.H.C", "meta": "Foremost Hitech Cooperation / 포레모스트 하이테크 기업", "summary": "초상 기술, 괴이 조직, 타락·혈액 샘플, 비인가 연구 자료를 분석하고 회수하는 고위 기술 조직.", "pages": [{"title": "개요", "body": "<p>F.H.C는 초상 기술, 괴이 조직, 타락 및 혈액 관련 샘플, 비인가 연구 자료를 분석하고 회수하는 고위 기술 조직이다. 표면적으로는 첨단 기술 개발, 교육 서비스, 사회 복지, 의료 기술, 특수 산업 연구를 제공하는 세계적인 초거대 기업이다.</p><p>그러나 내부적으로는 초자연과학, 오컬트 생명공학, 현실 접속 기술, 생체 병기화 가능성을 다루는 극비 부서를 보유하고 있다. F.H.C는 U.A.C, S.I.D, N.H.C가 회수한 자료를 분석하며, 특히 아마리온 제약과 공식 협력 관계를 맺고 있다.</p>"}, {"title": "표면적 정체", "body": "<ul><li>첨단 기술 개발 기업</li><li>교육 서비스 및 연구 지원 기관</li><li>사회 복지 및 의료 지원 기업</li><li>고위 산업 기술 협력체</li><li>아마리온 제약과 공식 연구 협력 관계 유지</li></ul>"}, {"title": "실질적 정체", "body": "<p>F.H.C는 초상 기술과 오컬트 현상을 기술적으로 실용화하려는 오컬트 과학 복합체에 가깝다. 이들은 외신, 우시노다 현상, 괴이 조직, 혈액 의식, 현실 왜곡, 생명 연장, 생체 병기화 가능성 등을 연구한다.</p><p>공식적으로는 U.A.C와 협력하는 기술 분석 기관이지만, 일부 내부 부서와 자금 흐름에서 우시노다교와의 유착 정황이 확인되고 있다. 따라서 F.H.C는 협력 기관이자 감시 대상에 가까운 이중적 세력이다.</p>"}, {"title": "사회적 영향력", "body": "<p>F.H.C는 수많은 학원, 학교, 연구소, 복지 시설을 운영하며 인재 육성과 사회 기여를 명분으로 영향력을 확장하고 있다. 그러나 일부 시설은 우시노다 현상이 발생하는 주요 지점을 감시하고 제어하기 위한 거점으로 활용된다는 의혹이 존재한다.</p><p>세련된 디자인의 선전 포스터와 출판물을 통해 우시노다와 관련된 철학을 현대적인 자기계발, 첨단 과학, 진화론적 인류 개선 사상으로 위장하여 대중에게 배포한다는 기록도 있다.</p>"}, {"title": "극비 분석 부서", "body": "<p>F.H.C 극비 분석 부서는 괴이, 혈교, 타락교, 우시노다 현상, 비인가 생체 연구 자료, 초상 기술을 분석하고 회수하는 고위 보안 부서이다.</p><p>특히 아마리온 제약, BL-088 균주, 괴이 유전자 디지털화 기술, 저접근 자기 변형 시스템과 관련된 자료를 별도 관리하는 것으로 추정된다.</p><ul><li>초상 기술 분석</li><li>괴이 조직 샘플 연구</li><li>회수 문서 해독</li><li>비인가 연구자 추적</li><li>아마리온 협력 자료 검토</li><li>생체 병기화 가능성 평가</li><li>타락 및 혈액 관련 기술 분류</li><li>우시노다교 유착 의혹 자료 추적</li></ul>"}, {"title": "무력 체계와 조사 기록", "body": "<p>F.H.C는 기업 보안을 명분으로 정규군에 필적하는 사설 무장 세력을 보유하고 있다. 이들은 외부 조사기관의 접근을 차단하거나, 실험 도중 통제를 벗어난 괴이체를 비밀리에 처리한다.</p><p>표면적으로는 합법적인 기업 활동을 하나, 내부 기밀 문서와 자금 흐름을 추적한 결과 우시노다교의 핵심 성소 및 일부 의식 거점과 물리적·재정적으로 연결되어 있다는 정황이 발견되었다.</p>"}]}, "amarion": {"img": "amarion.webp", "name": "Amarion", "meta": "Amarion Pharmaceuticals / 아마리온 제약", "summary": "의약품과 생명공학을 표면에 둔 민간 제약 기업이자 F.H.C 협력·감시 대상.", "pages": [{"title": "개요", "body": "<p>아마리온 제약은 표면적으로는 의약품, 생명공학, 특수 자원 연구를 수행하는 대형 민간 제약 기업이다. 공식적으로는 F.H.C와 연구 협력 관계를 맺고 있으며, 초자연과학, 생명 연장, 고응축 자원, 특수 물질 분석 분야에서 기술 지원을 제공하는 협력 기관으로 분류된다.</p><p>그러나 아마리온은 F.H.C의 승인 범위를 넘어선 비인가 실험을 여러 차례 진행한 정황이 있으며, 현재는 협력 기관이자 고위험 감시 대상이라는 이중적 위치에 놓여 있다.</p>"}, {"title": "F.H.C와의 관계", "body": "<p>F.H.C는 아마리온의 기술력과 연구 성과를 필요로 하지만, 아마리온이 보유한 기술이 너무 위험하기 때문에 완전히 신뢰하지 않는다. 따라서 아마리온은 F.H.C의 협력 기업이면서도 동시에 감시와 통제를 받는 민간 연구 조직으로 분류된다.</p>"}, {"title": "초자연과학 연구 부서", "body": "<p>아마리온 초자연과학 연구 부서는 아마리온 제약 내부에 존재했던 비공개 연구 부서이다. 이 부서는 일반적인 질병 치료나 의약품 개발이 아니라 현실 왜곡, 비가시적 공간 접속, 생체 변형, 고응축 자원 회수, 불멸 연구와 관련된 실험을 진행한 것으로 추정된다.</p><p>공식 기록상 대부분의 자료는 삭제되었으나, F.H.C가 회수한 사전교육 영상에서 해당 부서의 존재가 확인되었다.</p>"}, {"title": "대표 기술", "body": "<p>저접근 자기 변형 시스템은 현실 세계와 비가시적 공간 사이의 접점을 형성하기 위해 개발된 초기형 관문 기술로 추정된다. 아마리온은 이를 자원 확보와 인류 생존 기반 확장 기술로 홍보했으나, F.H.C 분석 기록에 따르면 현실 외부 공간 접촉 실험에 가까운 것으로 분류된다.</p>"}]}, "syndicate": {"img": "syndicate.webp", "name": "Syndicate", "meta": "신디케이트 / 비공식 사설 군사 네트워크", "summary": "국가 기관, 기업, 종교 집단, 무장 조직 사이에서 활동하는 비공식 사설 군사 조직.", "pages": [{"title": "개요", "body": "<p>신디케이트는 국가 기관, 기업, 종교 집단, 무장 조직 사이의 틈에서 활동하는 비공식 사설 군사 조직이자 무장 네트워크이다. 현재 일부 작전은 F.H.C의 거대 자본에 고용되어 움직이지만, 본질적으로는 독자적인 이해관계와 생존 논리를 가진 예측 불가능한 집단이다.</p><p>이들은 국가 체계를 거부하면서도 우시노다의 힘을 군사 전술에 결합하려는 시도를 보이며, 정부와 교단 양쪽 모두에게 위험한 세력으로 분류된다.</p>"}, {"title": "군사 전술과 우시노다", "body": "<p>신디케이트는 우시노다교처럼 숭배에 매몰되지 않는다. 대신 우시노다의 힘을 철저히 효율적인 무기로 취급한다. 현대적 군사 전술에 초자연적인 변이 능력을 덧입혀 정부군인 N.H.C조차 당혹하게 만드는 변칙적인 전투를 수행한다.</p>"}, {"title": "독자 노선", "body": "<p>신디케이트는 작전 단위로 F.H.C의 명령을 따르거나 자금을 받을 수 있지만, 완전히 F.H.C에 종속된 조직은 아니다. 정부에게는 체제를 위협하는 테러리스트이며, 교단에게는 신성한 힘을 도구로 모독하는 약탈자이다.</p><p>이들은 오직 자신들의 독립된 세력을 유지하고 힘을 키우는 데 관심이 있다.</p>"}, {"title": "기만 전술", "body": "<p>신디케이트의 가장 특징적인 전술은 더미 요원 활용이다. 현장에서 포로로 잡히거나 정보가 유출되는 것을 막기 위해 실제 인간 요원 대신 정교하게 제작된 인조체나 세뇌된 소모품 병사를 전면에 내세운다.</p><p>이로 인해 U.A.C가 이들을 소탕하더라도 본대의 실체나 거점은 늘 안개 속에 가려져 있다.</p>"}, {"title": "레드울프", "body": "<p>레드울프는 현재 신디케이트 내부에서 가장 핵심적인 전투 및 현장 작전팀 중 하나로 분류된다. 이들은 원래 N.H.C 1차 작전팀으로 활동했던 고위험 대응팀이었으나, 그린존 붕괴 사건 및 그 이후 이어진 일련의 사건을 거치며 기존 지휘 체계에서 이탈하였다.</p><ul><li>이전 명칭 : N.H.C 1차 작전팀 레드울프</li><li>현재 분류 : 신디케이트 주요팀 레드울프</li><li>변동 사유 : 그린존 붕괴 이후 지휘 체계 붕괴, 상부와의 결별, 생존 인원 재편, 비공식 세력화</li></ul>"}, {"title": "켈베로스 파벌", "body": "<p>켈베로스 파벌은 레드울프 전체를 의미하는 명칭이 아니라, 현재 신디케이트 주요팀으로 활동 중인 레드울프 내부에서 웨이드 밀렌을 중심으로 형성될 가능성이 있는 비인가 독자 행동 세력을 뜻한다.</p><p>밀렌은 과거 N.H.C 시절부터 상부 명령에 대한 불신을 보였으며, 레드울프가 신디케이트 소속으로 재편된 이후에는 독자적인 질서와 권력을 세우려는 방향으로 움직이고 있다. 이후 기록에서는 우시노다의 힘을 감염 병기와 억제제로 전환하려는 계획이 확인되었다.</p>"}]}, "ushinoda": {"img": "ushinoda.webp", "name": "Ushnoda Cult", "meta": "우시노다교 / 타락교·혈교·그림자교를 포함한 통합 교단", "summary": "우시노다의 힘을 숭배하며 인신공양과 이상현상을 통해 세계 재편을 시도하는 적대 종교 세력.", "pages": [{"title": "개요", "body": "<p>우시노다교는 고대 존재 우시노다의 힘을 숭배하며, 그를 향한 맹목적인 믿음을 바탕으로 인류의 도덕성을 완전히 저버린 최악의 광신도 집단이다. 이들은 단순히 신을 믿는 것을 넘어 잔혹한 반인류적 행위를 신성한 의식으로 여기며 인간을 초월한 신인류라는 왜곡된 이상을 꿈꾼다.</p>"}, {"title": "연합된 세 가지 교단", "body": "<p>현재 우시노다교는 각기 다른 힘과 성향을 가진 세 분파가 하나의 목적을 위해 손을 잡은 교단 연합 체제로 운영되고 있다. 이들의 세력은 이미 비밀리에 전 세계 구석구석까지 뻗어 나가 있으며, 도시 내부의 공공 시설, 학교, 병원, 연구소, 복지 기관에 침투한 정황이 확인되고 있다.</p>"}, {"title": "타락교", "body": "<p>타락교는 인간의 정신을 오염시키고 자아를 붕괴시켜 우시노다의 의지에 완전히 종속되게 만드는 심리적 잠식을 담당한다. 이들은 우시노다의 타락의 힘을 축복으로 받아들이며, 신체 변형과 불멸성을 신앙의 증거로 여긴다.</p><h4>핵심 능력 : 현실 부식</h4><ul><li>공포의 안개 : 오염된 기운에 노출된 자는 가장 끔찍한 트라우마를 환각으로 본다.</li><li>자아 와해 : 상대의 이성을 마비시켜 자신이 누구인지 잊게 만들거나 스스로를 해치게 만든다.</li><li>공간 뒤틀림 : 문을 열면 다른 장소가 나오거나 복도가 무한히 길어지는 공간 왜곡을 일으킨다.</li></ul>"}, {"title": "혈교", "body": "<p>혈교는 혈액 마법과 신체 변이에 집착하는 분파이며, 인체를 기괴하게 뒤틀어 타락 개체을 만들어내는 실무적인 무력 집단이다.</p><h4>핵심 능력 : 과부하 변이</h4><ul><li>경질화 혈액 : 피를 강철보다 단단한 칼날이나 가시로 굳혀 공격한다.</li><li>신체 재구성 : 뼈를 검으로 쓰거나 등에서 촉수를 돋게 하며, 부상을 입을수록 더 강력한 형태로 변이한다.</li><li>강제 전이 : 적의 몸속에 자신의 피를 주입하여 장기를 뒤틀거나 타락 개체로 강제 변이시킨다.</li></ul>"}, {"title": "그림자교", "body": "<p>그림자교는 실체가 없는 공포를 이용하는 분파이다. 어둠 속에서 은밀하게 움직이며 요인을 암살하거나, 보이지 않는 곳에서 이상현상을 유도하여 사회적 혼란을 야기한다.</p><h4>핵심 능력 : 심연의 수의</h4><ul><li>그림자 전이 : 모든 그림자를 통로로 삼아 순간이동한다.</li><li>비물질화 : 일시적으로 신체를 그림자 상태로 만들어 총알이나 물리 공격이 통과하게 만든다.</li><li>그림자 구속 : 상대의 그림자를 물리적으로 고정하거나 목을 조르는 끈으로 변형시킨다.</li></ul>"}, {"title": "인신공양과 이상현상", "body": "<p>우시노다교에게 가장 중요한 행위는 인신공양이다. 무고한 생명을 제물로 바침으로써 현실 세계의 물리 법칙을 뒤트는 이상현상을 강제로 발생시키며, 이를 통해 우시노다의 강림을 앞당기려 한다.</p>"}, {"title": "영향력과 암약", "body": "<p>우시노다교는 정체를 숨긴 채 F.H.C와 같은 거대 자본 뒤에 숨어 활동하거나, 학교와 병원 같은 공공 시설에 침투하여 일반인을 서서히 오염시킨다.</p><p>최종 목표는 기존 인류를 멸절시키고, 우시노다의 축복을 받은 변이된 인류로 세상을 재편하는 것이다.</p>"}]}, "haimun": {"img": "haimun.webp", "name": "Haimun", "meta": "For Our Future / 하이문", "summary": "우시노다교의 타락교와 혈교 교리에 심취한 범죄 조직이자 초인간주의 신봉자 단체.", "pages": [{"title": "개요", "body": "<p>하이문은 우시노다교의 분파 중 가장 과격한 타락교와 혈교의 교리에 심취하여, 인류의 멸망과 새로운 세상의 도래를 꿈꾸는 범죄 조직이자 초인간주의 신봉자 단체이다.</p><p>우리의 미래를 위하여라는 슬로건 아래 기존의 인간성을 버리고 괴물로 진화하는 것을 유일한 구원으로 믿는다.</p>"}, {"title": "도심 속 공포", "body": "<p>하이문은 U.A.C의 감시를 피해 도심 깊숙이 뿌리를 내리고 있다. 현재 도시 곳곳에서 산발적으로 발생하는 우시노다 현상의 압도적인 다수는 이들의 소행으로 추정된다.</p><p>이들은 인신공양을 위해 일반 시민들을 납치하거나, 도심 한복판에서 금기된 의식을 강행하여 도시를 아수라장으로 만든다.</p>"}, {"title": "초인간주의 사상", "body": "<p>하이문의 구성원들은 인간이라는 종의 나약함에 환멸을 느낀 자들이다. 타락교의 정신 오염과 혈교의 신체 변이를 적극적으로 받아들이며, 스스로 기괴한 존재가 되는 것을 진화라고 부른다.</p><p>이들은 인간은 곧 사라질 구시대의 유물이며, 우시노다의 축복을 받은 우리만이 미래라고 주장한다.</p>"}, {"title": "리더십", "body": "<p>대부분 평범한 인간들로 구성되어 활동하지만, 이들을 하나로 묶고 거대한 테러를 기획하는 리더의 정체는 철저히 베일에 싸여 있다. 조직원들조차 리더를 직접 본 적이 없으며, 오직 우시노다의 목소리를 대변하는 전언을 통해서만 명령을 하달받는다고 알려져 있다.</p>"}, {"title": "추적 대상", "body": "<p>하이문은 도심 내부에서 인신공양, 실종 사건, 우시노다 현상, 괴이 출현을 유발하는 주요 세력으로 분류된다. S.I.D는 은신처와 의식 거점을 추적하며, U.A.C는 하이문이 활동한 구역을 옐로우존 또는 레드존으로 격상할 수 있다. N.H.C는 대규모 의식이나 타락 개체 양산 정황이 확인될 경우 즉시 투입된다.</p>"}]}};
  const detail=document.getElementById('factionDetail');
  function renderFaction(key){
    const d=factionData[key]||factionData.uac; if(!detail)return;
    detail.innerHTML=`<img class="faction-mark-large" src="${prefix}assets/faction_marks/${d.img}" alt="${d.name}"><h3>${d.name}</h3><div class="meta">${d.meta}</div><p class="faction-summary">${d.summary||''}</p><div class="detail-tabs">${d.pages.map((p,i)=>`<button class="detail-tab ${i===0?'active':''}" data-i="${i}" type="button">${p.title}</button>`).join('')}</div><div class="detail-body"></div>`;
    function showPage(i,sound=true){const p=d.pages[i]||d.pages[0]; detail.querySelectorAll('.detail-tab').forEach((b,idx)=>b.classList.toggle('active',idx===i)); detail.querySelector('.detail-body').innerHTML=`<h4>${p.title}</h4>${p.body}`; if(sound)play(audio.page);}
    detail.querySelectorAll('.detail-tab').forEach((b,i)=>b.addEventListener('click',()=>showPage(i,true)));
    showPage(0,false);
    document.querySelectorAll('.faction-tile').forEach(b=>b.classList.toggle('active',b.dataset.key===key));
  }
  document.querySelectorAll('.faction-tile').forEach(b=>b.addEventListener('click',()=>{play(audio.menu); renderFaction(b.dataset.key)})); if(detail) renderFaction('uac');
  document.querySelectorAll('.paged-record').forEach(box=>{
    const recPages=Array.from(box.querySelectorAll(':scope > .record-page'));
    const tabs=box.querySelector(':scope > .page-tabs');
    if(!recPages.length||!tabs) return;
    function showRec(i,sound=true){recPages.forEach((p,idx)=>p.classList.toggle('active',idx===i)); tabs.querySelectorAll(':scope > .page-tab').forEach((b,idx)=>b.classList.toggle('active',idx===i)); if(sound)play(audio.page); const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0; else window.scrollTo(0,0);}
    tabs.querySelectorAll(':scope > .page-tab').forEach((b,i)=>b.addEventListener('click',()=>showRec(i,true)));
    showRec(0,false);
  });
  document.querySelectorAll('.nested-record').forEach(box=>{
    const pages=Array.from(box.querySelectorAll(':scope .sub-pages > .sub-page'));
    const tabs=box.querySelector(':scope > .sub-tabs');
    if(!pages.length||!tabs) return;
    function showSub(i,sound=true){pages.forEach((p,idx)=>p.classList.toggle('active',idx===i)); tabs.querySelectorAll(':scope > .sub-tab').forEach((b,idx)=>b.classList.toggle('active',idx===i)); if(sound)play(audio.page);}
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
      if(sound){startAmbient(); play(audio.page);}
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
      play(audio.open);
    });
  }
  function closeInternalRecord(e){
    if(e){e.preventDefault(); e.stopPropagation();}
    if(archiveViewer){archiveViewer.hidden=true; archiveViewer.querySelectorAll('.record-detail').forEach(el=>{el.hidden=true;});}
    if(archiveListWrap){archiveListWrap.classList.remove('is-hidden'); archiveListWrap.querySelectorAll('details').forEach(d=>d.open=true);}
    const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0;
    play(audio.menu);
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
    red:{title:'붉은 원형',body:'<p><b>표시:</b> 레드존 영향권 / 중심부 마커</p><p>고위험 사건 발생권을 원형 반경으로 표시한다. 자세한 구역 기준은 오른쪽 레드존 항목에서 확인한다.</p>'},
    yellow:{title:'황색 원형',body:'<p><b>표시:</b> 옐로우존 경계권</p><p>레드존 인근의 완충·경계권을 표시한다. 독립 구역이 아니라 레드존 주변 방어·조사 범위로 배치한다.</p>'},
    black:{title:'흑색 원형',body:'<p><b>표시:</b> 블랙존 봉쇄권</p><p>진입 금지 또는 통제권 상실 구역을 표시한다. 상세 기준은 오른쪽 블랙존 항목에서 확인한다.</p>'},
    green:{title:'녹색 원형',body:'<p><b>표시:</b> 그린존 코어 / 안정 행정권</p><p>주요 수도권, 행정 거점, 민간 거주가 유지되는 안정권을 작게 표시한다. 주변 이상 징후가 증가하면 옐로우존으로 격상될 수 있다.</p>'},
    white:{title:'백색 원형',body:'<p><b>표시:</b> 화이트존 감시권 / 외곽 통제권</p><p>완전한 안전지대가 아니라 장기 감시와 출입 통제가 유지되는 권역을 표시한다. 그린존과 겹칠 경우 흰 원은 외곽 감시권, 녹색 원은 안정 중심부를 의미한다.</p>'},
    defense:{title:'방어선',body:'<p><b>표시:</b> 긴 점선 차단선</p><p>N.H.C 외곽 방어선과 C.P.D 통제선의 위치를 나타낸다.</p>'},
    gate:{title:'봉쇄 게이트',body:'<p><b>표시:</b> 마름모형 게이트 마커</p><p>구역 출입과 검문을 통제하는 고정 봉쇄 지점이다.</p>'},
    bus:{title:'C.P.D 대피버스',body:'<p><b>표시:</b> 작은 차량형 마커</p><p>민간인 이송, 귀환자 분리, 선별 검사 대기자 수송을 담당하는 C.P.D 이동 대피 지점이다.</p>'},
    hq:{title:'본부 / 기지 / 시설',body:'<p><b>표시:</b> 삼각형, 다이아몬드, 사각형 계열 마커</p><p>U.A.C 본부, N.H.C 전방기지, S.I.D 지부, A.R.F 회수 거점, F.H.C 연구시설, 이동 감시 거점 등을 나타낸다.</p>'},
    ash:{title:'오염 처리소',body:'<p><b>표시:</b> 십자형 처리 마커</p><p>오염된 장비, 괴이 잔류물, 회수 금지 물품을 봉인·소각·격리하는 후처리 지점이다.</p>'}
  };
  function render(key){const box=document.getElementById('mapInfoDisplay'); if(!box || !data[key]) return; box.innerHTML='<h3>'+data[key].title+'</h3>'+data[key].body; document.querySelectorAll('.map-info-btn').forEach(b=>b.classList.toggle('active',b.dataset.mapInfo===key));}
  document.querySelectorAll('.map-info-btn').forEach(btn=>btn.addEventListener('click',()=>{try{if(typeof play==='function' && typeof audio!=='undefined') play(audio.menu);}catch(e){} render(btn.dataset.mapInfo);}));
})();


// Actual world map continental record controls.
(function(){
  const shell=document.querySelector('.continental-map-shell');
  if(!shell) return;
  const panels=Array.from(shell.querySelectorAll('.continent-panel'));
  const tabs=Array.from(shell.querySelectorAll('.continent-tab'));
  const filters=Array.from(shell.querySelectorAll('.continent-filter'));
  function playTick(){try{if(typeof play==='function' && typeof audio!=='undefined') play(audio.page||audio.menu);}catch(e){}}
  function showRegion(key,sound){
    panels.forEach(p=>p.classList.toggle('active',p.dataset.continentPanel===key));
    tabs.forEach(t=>t.classList.toggle('active',t.dataset.continent===key));
    if(sound) playTick();
  }
  function showFilter(key,sound){
    shell.dataset.filter=key;
    filters.forEach(f=>f.classList.toggle('active',f.dataset.mapFilter===key));
    if(sound) playTick();
  }
  tabs.forEach(t=>t.addEventListener('click',()=>showRegion(t.dataset.continent,true)));
  filters.forEach(f=>f.addEventListener('click',()=>showFilter(f.dataset.mapFilter,true)));
  showFilter('all',false);
})();


// Stable U.A.C continental map click-card details.
(function(){
  const shell=document.querySelector('.continental-map-shell');
  if(!shell) return;
  function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function updateCard(el){
    const panel=el.closest('.continent-panel'); if(!panel) return;
    const card=panel.querySelector('.map-detail-card'); if(!card) return;
    const title=el.dataset.title || el.getAttribute('title') || 'U.A.C 관제 기록';
    const status=el.dataset.status || '상태 기록 없음';
    const records=el.dataset.records || '지역지도';
    card.innerHTML='<b>'+esc(title)+'</b><p>'+esc(status)+'</p><small>관련 기록: '+esc(records)+'</small>';
  }
  shell.querySelectorAll('.continent-marker,.map-overlay').forEach(el=>{
    el.addEventListener('click',()=>{try{if(typeof play==='function' && typeof audio!=='undefined') play(audio.menu);}catch(e){} updateCard(el);});
  });
  shell.querySelectorAll('.continent-panel').forEach(panel=>{
    const first=panel.querySelector('.continent-marker,.map-overlay'); if(first) updateCard(first);
  });
})();


// Project Curse 2차 지도 패치: 가독성 정리 + 짧은 검수 표시 + 세계지도 요약 + 봉쇄선 감쇠.
(function(){
  const shell=document.querySelector('.continental-map-shell.datamap-v3');
  if(!shell) return;
  shell.classList.add('map-patch1');
  const NS='http://www.w3.org/2000/svg';
  const W=1600, H=900;
  const typeLabel={zone:'오염 구역',facility:'작전 시설',anomaly:'현상 기록',incident:'사건 좌표',blockade:'봉쇄선', 'blockade-node':'봉쇄 거점'};
  const zoneLabel={red:'레드존',yellow:'옐로우존',green:'그린존',white:'화이트존',black:'블랙존'};
const maps={"world":{"extent":{"lonMin":-185,"lonMax":185,"latMin":-65,"latMax":85}},"east":{"extent":{"lonMin":68,"lonMax":158,"latMin":-8,"latMax":60}},"europe":{"extent":{"lonMin":-28,"lonMax":48,"latMin":28,"latMax":74}},"north":{"extent":{"lonMin":-175,"lonMax":-20,"latMin":0,"latMax":83}},"southasia":{"extent":{"lonMin":55,"lonMax":105,"latMin":-3,"latMax":40}},"seindian":{"extent":{"lonMin":84,"lonMax":136,"latMin":-16,"latMax":28}},"oceania":{"extent":{"lonMin":106,"lonMax":184,"latMin":-52,"latMax":-2}},"mideast":{"extent":{"lonMin":20,"lonMax":70,"latMin":6,"latMax":45}},"africa":{"extent":{"lonMin":-25,"lonMax":60,"latMin":-38,"latMax":42}}};
  const data={"world":[{"type":"zone","zone":"red","name":"유럽 북부 레드존","status":"독일 북부-덴마크 남부 대표 오염권","records":"피의 호수 부검 기록 / 레드존 이상현상 및 오염 기준 문서","lon":10.1,"lat":55,"r":2.05,"core":0.82,"surface":"land","surfaceLabel":"육상/권역","location":"전역 축약 표시","qa":"REVIEWED","regionName":"세계"},{"type":"zone","zone":"red","name":"란저우 내륙 레드존","status":"중국 서북부 내륙 오염권","records":"레드존 이상현상 및 오염 기준 문서 / N.H.C 현장 작전·장비·봉쇄 규정 문서","lon":103.8,"lat":36.1,"r":1.95,"core":0.78,"surface":"land","surfaceLabel":"육상/권역","location":"중국 간쑤성 내륙","qa":"REVIEWED","regionName":"세계"},{"type":"zone","zone":"red","name":"캐나다 북부 레드존","status":"캐나다 북서부 광역 봉쇄권","records":"레드존 이상현상 및 오염 기준 문서 / N.H.C 현장 작전·장비·봉쇄 규정 문서","lon":-126,"lat":63,"r":3.1,"core":1.25,"surface":"land","surfaceLabel":"육상/권역","location":"캐나다 북부권","qa":"REVIEWED","regionName":"세계"},{"type":"zone","zone":"red","name":"호주 남중부 레드존","status":"남호주 내륙 오염권","records":"레드존 이상현상 및 오염 기준 문서 / N.H.C 현장 작전·장비·봉쇄 규정 문서","lon":135,"lat":-32.5,"r":2.3,"core":0.9,"surface":"land","surfaceLabel":"육상/권역","location":"호주 내륙·남방권","qa":"REVIEWED","regionName":"세계"},{"type":"zone","zone":"black","name":"호주 중앙 블랙존 후보지","status":"호주 중앙 심부 반응 코어","records":"레드존 이상현상 및 오염 기준 문서 / N.H.C 현장 작전·장비·봉쇄 규정 문서","lon":132.5,"lat":-25.5,"r":1.05,"surface":"land","surfaceLabel":"육상/권역","location":"호주 내륙·남방권","qa":"REVIEW REQUIRED","regionName":"세계"},{"type":"zone","zone":"yellow","name":"중동 사막 감시권","status":"이라크-시리아-사우디 북부 장기 감시권","records":"지역지도","lon":42,"lat":31,"r":3.05,"surface":"land","surfaceLabel":"육상/권역","location":"중동 내륙 감시권","qa":"REVIEWED","regionName":"세계"},{"type":"zone","zone":"white","name":"홍콩 연안 화이트존","status":"홍콩-선전 항만 검문·관리권 대표 표기","records":"구역 위험도 분류 문서 / 지역지도","lon":114.16,"lat":22.3,"r":0.95,"surface":"port","surfaceLabel":"항만/연안","location":"남중국 연안","qa":"REVIEWED","regionName":"세계"},{"type":"zone","zone":"green","name":"호주 남동부 그린존","status":"멜버른-캔버라 후방 운영권 대표 표기","records":"구역 위험도 분류 문서 / 지역지도","lon":146.5,"lat":-36.7,"r":1.1,"surface":"land","surfaceLabel":"육상/권역","location":"호주 내륙·남방권","qa":"REVIEWED","regionName":"세계"},{"type":"blockade","surface":"sea","name":"북해 해상 감시권","status":"북해 점선 감시권","records":"피의 호수 부검 기록","lon":4.5,"lat":56.5,"rx":2.1,"ry":1.35,"rot":-10,"surfaceLabel":"해상/감시권","location":"북해 해상권","qa":"REVIEWED","regionName":"세계"},{"type":"blockade","surface":"sea","name":"동중국해 감시권","status":"동중국해 점선 감시권","records":"지역지도","lon":127,"lat":28,"rx":2.2,"ry":1.4,"rot":14,"surfaceLabel":"해상/감시권","location":"동중국해 해상권","qa":"REVIEWED","regionName":"세계"},{"type":"incident","name":"피의 호수 사건","status":"1986년 북해권 혈액성 이상현상","records":"피의 호수 부검 기록","lon":10.1,"lat":55,"surface":"sea","surfaceLabel":"해상/통제 노드","location":"독일 북부·덴마크 남부권","qa":"REVIEWED","regionName":"세계"},{"type":"incident","name":"란저우 대오염 사건","status":"동아시아 내륙 오염 사건","records":"레드존 이상현상 및 오염 기준 문서","lon":103.8,"lat":36.1,"surface":"land","surfaceLabel":"육상/권역","location":"중국 간쑤성 내륙","qa":"REVIEWED","regionName":"세계"},{"type":"incident","name":"호주 중앙 심부 반응점","status":"오세아니아 심부 반응 기록","records":"레드존 이상현상 및 오염 기준 문서","lon":132.5,"lat":-25.5,"surface":"land","surfaceLabel":"육상/권역","location":"호주 내륙·남방권","qa":"REVIEWED","regionName":"세계"},{"type":"blockade","kind":"defense","name":"글로벌 레드존 봉쇄망","status":"대표 봉쇄망 요약선","records":"지역지도","points":[[-130,50],[-80,48],[-5,50],[45,36],[110,35]],"surface":"land","surfaceLabel":"육상/권역","location":"전역 축약 표시","qa":"REVIEWED","regionName":"세계"}],"east":[{"type":"zone","zone":"red","name":"란저우 내륙 레드존","status":"중국 간쑤성 란저우 중심 레드존","records":"레드존 이상현상 및 오염 기준 문서 / N.H.C 현장 작전·장비·봉쇄 규정 문서","lon":103.8,"lat":36.1,"r":4.2,"core":1.65,"surface":"land","surfaceLabel":"육상/권역","location":"중국 간쑤성 내륙","qa":"REVIEWED","regionName":"동아시아"},{"type":"zone","zone":"red","name":"주강 하구 레드존","status":"광저우-선전-홍콩 축 연안 오염권","records":"레드존 이상현상 및 오염 기준 문서 / N.H.C 현장 작전·장비·봉쇄 규정 문서","lon":114.1,"lat":22.7,"r":2.25,"core":0.82,"surface":"port","surfaceLabel":"항만/연안","location":"남중국 연안","qa":"REVIEWED","regionName":"동아시아"},{"type":"zone","zone":"black","name":"란저우 심부 반응 후보지","status":"란저우 레드존 내부 심부 반응","records":"레드존 이상현상 및 오염 기준 문서 / N.H.C 현장 작전·장비·봉쇄 규정 문서","lon":103.8,"lat":36.1,"r":1.25,"surface":"land","surfaceLabel":"육상/권역","location":"중국 간쑤성 내륙","qa":"REVIEW REQUIRED","regionName":"동아시아"},{"type":"zone","zone":"white","name":"홍콩 격리 항만 관리권","status":"항만 검역·귀환자 선별 관리권","records":"지역지도","lon":114.16,"lat":22.3,"r":1.15,"surface":"port","surfaceLabel":"항만/연안","location":"남중국 연안","qa":"REVIEWED","regionName":"동아시아"},{"type":"zone","zone":"white","name":"부산 검문 관리권","status":"한반도 남동부 항만 검문권","records":"구역 위험도 분류 문서","lon":129.05,"lat":35.15,"r":1.25,"surface":"port","surfaceLabel":"항만/연안","location":"한반도 남동부 연안","qa":"REVIEWED","regionName":"동아시아"},{"type":"zone","zone":"green","name":"일본 서남부 그린존","status":"후쿠오카 권역 후방 운영권","records":"구역 위험도 분류 문서 / 지역지도","lon":130.4,"lat":33.6,"r":1.25,"surface":"land","surfaceLabel":"육상/권역","location":"동아시아 권역","qa":"REVIEWED","regionName":"동아시아"},{"type":"blockade","surface":"sea","name":"동중국해 감시권","status":"해상 점선 감시권","records":"지역지도","lon":127.4,"lat":27.6,"rx":4.4,"ry":2.75,"rot":16,"surfaceLabel":"해상/감시권","location":"동중국해 해상권","qa":"REVIEWED","regionName":"동아시아"},{"type":"blockade","kind":"defense","name":"란저우 동부 1차 차단선","status":"란저우 동측 육상 차단선","records":"N.H.C 현장 작전·장비·봉쇄 규정 문서","points":[[104.2,38.2],[107.3,36.7],[108.1,34.8]],"surface":"land","surfaceLabel":"육상/권역","location":"중국 간쑤성 내륙","qa":"REVIEWED","regionName":"동아시아"},{"type":"facility","name":"N.H.C 란저우 전방 관측기지","status":"레드존 동측 외곽 관측기지","records":"N.H.C 현장 작전·장비·봉쇄 규정 문서","lon":106.2,"lat":36.3,"org":"nhc","surface":"land","surfaceLabel":"육상/권역","location":"중국 간쑤성 내륙","qa":"REVIEWED","regionName":"동아시아"},{"type":"facility","name":"홍콩 격리 항만 검문소","status":"항만 검역·귀환자 선별","records":"지역지도","lon":114.15,"lat":22.3,"org":"cpd","surface":"port","surfaceLabel":"항만/연안","location":"남중국 연안","qa":"REVIEWED","regionName":"동아시아"},{"type":"facility","name":"부산 동아시아 해상 통제 허브","status":"부산항 남동 연안 해상 통제 거점","records":"지역지도","lon":128.98,"lat":35.05,"org":"uac","surface":"sea","qa":"REVIEWED","location":"한반도 남동부 연안 / 부산항 외곽","surfaceLabel":"해상/통제 노드","regionName":"동아시아"},{"type":"incident","name":"홍콩 항만 집단 실종 사건","status":"항만 구역 민간인 소실 기록","records":"타락 개체 분류 추가 보고서","lon":114.2,"lat":22.2,"surface":"port","surfaceLabel":"항만/연안","location":"남중국 연안","qa":"REVIEWED","regionName":"동아시아"},{"type":"anomaly","name":"황허 변류 이상현상","status":"하천 흐름·기록 좌표 불일치","records":"레드존 이상현상 및 오염 기준 문서","lon":105,"lat":36.2,"surface":"land","surfaceLabel":"육상/권역","location":"중국 간쑤성 내륙","qa":"REVIEW REQUIRED","regionName":"동아시아"}],"europe":[{"type":"zone","zone":"red","name":"피의 호수 레드존","status":"함부르크 북부-독일·덴마크 접경 메인 레드존","records":"피의 호수 부검 기록 / 레드존 이상현상 및 오염 기준 문서","lon":10.25,"lat":54.9,"r":4.4,"core":1.75,"surface":"land","surfaceLabel":"육상/권역","location":"독일 북부·덴마크 남부권","qa":"REVIEWED","regionName":"유럽"},{"type":"zone","zone":"black","name":"피의 호수 중심 블랙존 후보지","status":"혈색 수면 중심부 심부 반응","records":"피의 호수 부검 기록","lon":10.25,"lat":55,"r":1.22,"surface":"land","surfaceLabel":"육상/권역","location":"독일 북부·덴마크 남부권","qa":"REVIEW REQUIRED","regionName":"유럽"},{"type":"zone","zone":"white","name":"코펜하겐 검문 관리권","status":"북유럽 대피·검문 관리권","records":"구역 위험도 분류 문서","lon":12.57,"lat":55.68,"r":1.35,"surface":"land","surfaceLabel":"육상/권역","location":"덴마크 동부 연안","qa":"REVIEWED","regionName":"유럽"},{"type":"zone","zone":"yellow","name":"북독일 옐로우존","status":"피의 호수 외곽 감시 완충권","records":"구역 위험도 분류 문서 / 지역지도","lon":9.1,"lat":53.7,"r":2.2,"surface":"land","surfaceLabel":"육상/권역","location":"유럽 권역","qa":"REVIEWED","regionName":"유럽"},{"type":"blockade","surface":"sea","name":"북해 해상 감시권","status":"북해 점선 감시권","records":"피의 호수 부검 기록","lon":5,"lat":56.3,"rx":5,"ry":2.45,"rot":-12,"surfaceLabel":"해상/감시권","location":"북해 해상권","qa":"REVIEWED","regionName":"유럽"},{"type":"blockade","kind":"defense","name":"독일-덴마크 이중 봉쇄선","status":"독일 북부-덴마크 남부 핵심 차단선","records":"N.H.C 현장 작전·장비·봉쇄 규정 문서","points":[[7.8,54.5],[10.5,54.9],[13,54.5]],"surface":"land","surfaceLabel":"육상/권역","location":"유럽 권역","qa":"REVIEWED","regionName":"유럽"},{"type":"facility","name":"함부르크 봉쇄사령 거점","status":"피의 호수 후방 통제소","records":"지역지도","lon":10,"lat":53.55,"org":"nhc","surface":"land","surfaceLabel":"육상/권역","location":"독일 북부·덴마크 남부권","qa":"REVIEWED","regionName":"유럽"},{"type":"facility","name":"코펜하겐 대피 검문 허브","status":"북유럽 대피 검문 허브","records":"지역지도","lon":12.57,"lat":55.68,"org":"cpd","surface":"land","surfaceLabel":"육상/권역","location":"덴마크 동부 연안","qa":"REVIEWED","regionName":"유럽"},{"type":"incident","name":"피의 호수 사건 원점","status":"혈액성 이상현상 원점","records":"피의 호수 부검 기록","lon":10.35,"lat":55.05,"surface":"land","surfaceLabel":"육상/권역","location":"독일 북부·덴마크 남부권","qa":"REVIEWED","regionName":"유럽"},{"type":"incident","name":"A.R.F 회수 실패 지점","status":"피의 호수 회수 실패 기록","records":"피의 호수 부검 기록","lon":9.2,"lat":54.9,"surface":"land","surfaceLabel":"육상/권역","location":"유럽 권역","qa":"REVIEWED","regionName":"유럽"},{"type":"anomaly","name":"북해 오염 무전 수신권","status":"북해 해상 오염 무전 반복","records":"레드존 이상현상 및 오염 기준 문서","lon":5.8,"lat":56.4,"surface":"sea","surfaceLabel":"해상/통제 노드","location":"북해 해상권","qa":"REVIEWED","regionName":"유럽"}],"north":[{"type":"zone","zone":"red","name":"캐나다 북서 레드존","status":"유콘-노스웨스트 준주 광역 봉쇄권","records":"레드존 이상현상 및 오염 기준 문서 / N.H.C 현장 작전·장비·봉쇄 규정 문서","lon":-128,"lat":63,"r":5.1,"core":2.15,"surface":"land","surfaceLabel":"육상/권역","location":"캐나다 북부권","qa":"REVIEWED","regionName":"북미"},{"type":"zone","zone":"red","name":"캐나다 중북부 레드존","status":"앨버타 북부-서스캐처원 북부 확산권","records":"레드존 이상현상 및 오염 기준 문서 / N.H.C 현장 작전·장비·봉쇄 규정 문서","lon":-111,"lat":58,"r":3.9,"core":1.55,"surface":"land","surfaceLabel":"육상/권역","location":"캐나다 북부권","qa":"REVIEWED","regionName":"북미"},{"type":"zone","zone":"black","name":"북부 침묵 지대 블랙존 후보","status":"캐나다 북부 심부 후보 코어","records":"레드존 이상현상 및 오염 기준 문서 / N.H.C 현장 작전·장비·봉쇄 규정 문서","lon":-122,"lat":65,"r":1.35,"surface":"land","surfaceLabel":"육상/권역","location":"캐나다 북부권","qa":"REVIEW REQUIRED","regionName":"북미"},{"type":"zone","zone":"yellow","name":"오대호 옐로우존","status":"오대호 주변 감시 완충권","records":"지역지도","lon":-82,"lat":44,"r":3.1,"surface":"land","surfaceLabel":"육상/권역","location":"오대호 주변권","qa":"REVIEWED","regionName":"북미"},{"type":"zone","zone":"white","name":"밴쿠버 검역 관리권","status":"태평양 연안 검역항 관리권","records":"지역지도","lon":-123.12,"lat":49.28,"r":1.35,"surface":"sea","surfaceLabel":"해상/통제 노드","location":"북미 태평양 연안","qa":"REVIEWED","regionName":"북미"},{"type":"zone","zone":"green","name":"에드먼턴 후방 그린존","status":"캐나다 후방 방어·물류 운영권","records":"구역 위험도 분류 문서 / 지역지도","lon":-113.49,"lat":53.55,"r":1.45,"surface":"land","surfaceLabel":"육상/권역","location":"북미 권역","qa":"REVIEWED","regionName":"북미"},{"type":"blockade","surface":"sea","name":"태평양 연안 감시권","status":"밴쿠버-시애틀 앞바다 점선 감시권","records":"지역지도","lon":-125,"lat":48.7,"rx":2.7,"ry":1.85,"rot":18,"surfaceLabel":"해상/감시권","location":"북미 태평양 연안","qa":"REVIEWED","regionName":"북미"},{"type":"blockade","kind":"defense","name":"캐나다 남하 1차 차단선","status":"캐나다 북부 남하 차단선","records":"N.H.C 현장 작전·장비·봉쇄 규정 문서","points":[[-126,56],[-116,54],[-103,54],[-94,52]],"surface":"land","surfaceLabel":"육상/권역","location":"캐나다 북부권","qa":"REVIEWED","regionName":"북미"},{"type":"facility","name":"에드먼턴 방어물류기지","status":"레드존 후방 물류거점","records":"지역지도","lon":-113.49,"lat":53.55,"org":"nhc","surface":"land","surfaceLabel":"육상/권역","location":"북미 권역","qa":"REVIEWED","regionName":"북미"},{"type":"facility","name":"밴쿠버 검역 항만","status":"태평양 연안 검역항","records":"지역지도","lon":-123.12,"lat":49.28,"org":"cpd","surface":"sea","surfaceLabel":"해상/통제 노드","location":"북미 태평양 연안","qa":"REVIEWED","regionName":"북미"},{"type":"incident","name":"북부 정찰대 전멸지점","status":"캐나다 북부 정찰 기록 소실","records":"지역지도","lon":-126,"lat":62.5,"surface":"land","surfaceLabel":"육상/권역","location":"북미 권역","qa":"REVIEWED","regionName":"북미"},{"type":"anomaly","name":"위성 영상 변질 구역","status":"위성 영상 변질 관측지","records":"레드존 이상현상 및 오염 기준 문서","lon":-109,"lat":59.5,"surface":"land","surfaceLabel":"육상/권역","location":"북미 권역","qa":"REVIEW REQUIRED","regionName":"북미"}],"southasia":[{"type":"zone","zone":"yellow","name":"인도 북부 감시권","status":"인도 북부 장기 감시권","records":"지역지도","lon":78.8,"lat":28.5,"r":4.2,"surface":"land","surfaceLabel":"육상/권역","location":"인도 북부권","qa":"REVIEWED","regionName":"남아시아"},{"type":"zone","zone":"white","name":"뉴델리 서부 검문 관리권","status":"수도권 외곽 검문·선별 관리권","records":"구역 위험도 분류 문서","lon":76.8,"lat":28.6,"r":1.35,"surface":"land","surfaceLabel":"육상/권역","location":"인도 북부권","qa":"REVIEWED","regionName":"남아시아"},{"type":"zone","zone":"green","name":"인도 서부 후방 운영권","status":"서부 항만 후방 운영권","records":"지역지도","lon":73,"lat":19,"r":1.45,"surface":"port","surfaceLabel":"항만/연안","location":"남아시아 권역","qa":"REVIEWED","regionName":"남아시아"},{"type":"blockade","surface":"sea","name":"인도양 항로 감시권","status":"인도양 북부 항로 점선 감시권","records":"지역지도","lon":73.5,"lat":8,"rx":3.4,"ry":2.1,"rot":-10,"surfaceLabel":"해상/감시권","location":"인도양 북부·서인도 연안","qa":"REVIEWED","regionName":"남아시아"},{"type":"blockade","kind":"defense","name":"인도 북부 내륙 감시선","status":"인도 북부 내륙 감시선","records":"지역지도","points":[[74.5,30.5],[78.5,29.3],[82.5,27.8]],"surface":"land","surfaceLabel":"육상/권역","location":"인도 북부권","qa":"REVIEWED","regionName":"남아시아"},{"type":"facility","name":"뉴델리 서부 검문소","status":"수도권 외곽 검문소","records":"지역지도","lon":76.8,"lat":28.6,"org":"cpd","surface":"land","surfaceLabel":"육상/권역","location":"인도 북부권","qa":"REVIEWED","regionName":"남아시아"},{"type":"facility","name":"뭄바이 후방 보급 허브","status":"서부 항만 후방 보급","records":"지역지도","lon":72.88,"lat":19.07,"org":"uac","surface":"port","surfaceLabel":"항만/연안","location":"인도양 북부·서인도 연안","qa":"REVIEWED","regionName":"남아시아"},{"type":"incident","name":"갠지스 상류 이상현상","status":"상류 시간·수위 불일치","records":"레드존 이상현상 및 오염 기준 문서","lon":78,"lat":29.9,"surface":"land","surfaceLabel":"육상/권역","location":"인도 북부권","qa":"REVIEWED","regionName":"남아시아"},{"type":"anomaly","name":"인도 북부 오염 무전 수신권","status":"내륙 반복 무전 감지","records":"레드존 이상현상 및 오염 기준 문서","lon":79.4,"lat":27.5,"surface":"sea","surfaceLabel":"해상/통제 노드","location":"인도 북부권","qa":"REVIEWED","regionName":"남아시아"}],"seindian":[{"type":"zone","zone":"white","name":"싱가포르 검문 관리권","status":"말라카 해협 검문 허브","records":"지역지도","lon":103.85,"lat":1.3,"r":1.25,"surface":"sea","surfaceLabel":"해상/통제 노드","location":"말라카 해협권","qa":"REVIEWED","regionName":"동남아·인도양"},{"type":"zone","zone":"yellow","name":"자바 해역 감시권","status":"자바 해역 집단 실종권 감시","records":"지역지도","lon":111.5,"lat":-5.4,"r":3.2,"surface":"sea","surfaceLabel":"해상/통제 노드","location":"자바 해역권","qa":"REVIEWED","regionName":"동남아·인도양"},{"type":"zone","zone":"yellow","name":"보르네오 이상신호권","status":"보르네오 해상 이상신호권","records":"레드존 이상현상 및 오염 기준 문서","lon":114,"lat":1,"r":2.4,"surface":"sea","surfaceLabel":"해상/통제 노드","location":"보르네오 해상권","qa":"REVIEWED","regionName":"동남아·인도양"},{"type":"zone","zone":"green","name":"말레이 반도 후방 그린존","status":"말라카 남부 후방 운영권","records":"구역 위험도 분류 문서 / 지역지도","lon":101.7,"lat":3.1,"r":1.2,"surface":"sea","surfaceLabel":"해상/통제 노드","location":"동남아·인도양 권역","qa":"REVIEWED","regionName":"동남아·인도양"},{"type":"blockade","surface":"sea","name":"말라카 해협 감시권","status":"말라카 해협 점선 감시권","records":"지역지도","lon":100.5,"lat":4,"rx":3.2,"ry":1.8,"rot":-22,"surfaceLabel":"해상/감시권","location":"말라카 해협권","qa":"REVIEWED","regionName":"동남아·인도양"},{"type":"blockade","kind":"defense","name":"인도네시아 군도 통제선","status":"군도 해상 통제선","records":"지역지도","points":[[103,1],[108,-3],[114,-6],[120,-7]],"surface":"sea","surfaceLabel":"해상/감시권","location":"자바 해역권","qa":"REVIEWED","regionName":"동남아·인도양"},{"type":"facility","name":"싱가포르 검문 허브","status":"동남아 군도 검문 허브","records":"지역지도","lon":103.85,"lat":1.29,"org":"cpd","surface":"port","surfaceLabel":"항만/연안","location":"말라카 해협권","qa":"REVIEWED","regionName":"동남아·인도양"},{"type":"facility","name":"자카르타 해상 감시소","status":"자바 해역 감시소","records":"지역지도","lon":106.85,"lat":-6.2,"org":"uac","surface":"sea","surfaceLabel":"해상/통제 노드","location":"동남아·인도양 권역","qa":"REVIEWED","regionName":"동남아·인도양"},{"type":"incident","name":"자바 해역 집단 실종 사건","status":"해상 집단 실종 기록","records":"지역지도","lon":112,"lat":-5.2,"surface":"sea","surfaceLabel":"해상/통제 노드","location":"자바 해역권","qa":"REVIEWED","regionName":"동남아·인도양"},{"type":"anomaly","name":"보르네오 해상 이상신호","status":"해상 오염 신호 반복","records":"레드존 이상현상 및 오염 기준 문서","lon":114,"lat":1,"surface":"sea","surfaceLabel":"해상/통제 노드","location":"보르네오 해상권","qa":"REVIEWED","regionName":"동남아·인도양"}],"oceania":[{"type":"zone","zone":"red","name":"호주 남중부 레드존","status":"남호주 내륙 레드존","records":"레드존 이상현상 및 오염 기준 문서 / N.H.C 현장 작전·장비·봉쇄 규정 문서","lon":135,"lat":-32.5,"r":4,"core":1.6,"surface":"land","surfaceLabel":"육상/권역","location":"호주 내륙·남방권","qa":"REVIEWED","regionName":"오세아니아"},{"type":"zone","zone":"black","name":"호주 중앙 블랙존 후보지","status":"앨리스스프링스 서측 심부 반응","records":"레드존 이상현상 및 오염 기준 문서 / N.H.C 현장 작전·장비·봉쇄 규정 문서","lon":132.5,"lat":-25.5,"r":1.45,"surface":"land","surfaceLabel":"육상/권역","location":"호주 내륙·남방권","qa":"REVIEW REQUIRED","regionName":"오세아니아"},{"type":"zone","zone":"yellow","name":"호주 동부 옐로우존","status":"호주 동부 내륙 감시권","records":"지역지도","lon":149,"lat":-29.5,"r":3.35,"surface":"land","surfaceLabel":"육상/권역","location":"호주 내륙·남방권","qa":"REVIEWED","regionName":"오세아니아"},{"type":"zone","zone":"green","name":"호주 남동부 후방 운영권","status":"멜버른-캔버라 후방 운영권","records":"지역지도","lon":145,"lat":-37.2,"r":1.55,"surface":"land","surfaceLabel":"육상/권역","location":"호주 내륙·남방권","qa":"REVIEWED","regionName":"오세아니아"},{"type":"blockade","surface":"sea","name":"뉴질랜드 북방 감시권","status":"뉴질랜드 북방 점선 감시권","records":"지역지도","lon":174,"lat":-30,"rx":3.3,"ry":2,"rot":18,"surfaceLabel":"해상/감시권","location":"뉴질랜드 북방·남태평양권","qa":"REVIEWED","regionName":"오세아니아"},{"type":"blockade","kind":"defense","name":"호주 내륙-해안 방어선","status":"호주 내륙 접근 차단선","records":"N.H.C 현장 작전·장비·봉쇄 규정 문서","points":[[130,-30],[137,-32],[143,-36]],"surface":"land","surfaceLabel":"육상/권역","location":"호주 내륙·남방권","qa":"REVIEWED","regionName":"오세아니아"},{"type":"facility","name":"다윈 해군 검역기지","status":"호주 북부 검역항","records":"지역지도","lon":130.84,"lat":-12.46,"org":"nhc","surface":"port","surfaceLabel":"항만/연안","location":"오세아니아 권역","qa":"REVIEWED","regionName":"오세아니아"},{"type":"facility","name":"애들레이드 차단 거점","status":"남호주 내륙 접근 차단 거점","records":"지역지도","lon":138.6,"lat":-34.93,"org":"nhc","surface":"land","surfaceLabel":"육상/권역","location":"오세아니아 권역","qa":"REVIEWED","regionName":"오세아니아"},{"type":"facility","name":"멜버른 후방 병참기지","status":"남동부 후방 병참","records":"지역지도","lon":144.96,"lat":-37.81,"org":"uac","surface":"land","surfaceLabel":"육상/권역","location":"오세아니아 권역","qa":"REVIEWED","regionName":"오세아니아"},{"type":"facility","name":"오클랜드 남태평양 보급거점","status":"남태평양 보급 거점","records":"지역지도","lon":174.76,"lat":-36.85,"org":"cpd","surface":"sea","surfaceLabel":"해상/통제 노드","location":"뉴질랜드 북방·남태평양권","qa":"REVIEWED","regionName":"오세아니아"},{"type":"incident","name":"호주 중앙 심부 반응점","status":"호주 내륙 심부 반응 기록","records":"레드존 이상현상 및 오염 기준 문서","lon":132.5,"lat":-25.5,"surface":"land","surfaceLabel":"육상/권역","location":"호주 내륙·남방권","qa":"REVIEWED","regionName":"오세아니아"},{"type":"anomaly","name":"사막 지하 진동 기록점","status":"호주 내륙 지하 진동 기록","records":"레드존 이상현상 및 오염 기준 문서","lon":132.2,"lat":-25.4,"surface":"land","surfaceLabel":"육상/권역","location":"호주 내륙·남방권","qa":"REVIEWED","regionName":"오세아니아"}],"mideast":[{"type":"zone","zone":"yellow","name":"중동 사막 옐로우존","status":"이라크-시리아-사우디 북부 장기 감시권","records":"지역지도","lon":42,"lat":31,"r":4.35,"surface":"land","surfaceLabel":"육상/권역","location":"중동 내륙 감시권","qa":"REVIEWED","regionName":"중동"},{"type":"zone","zone":"red","name":"시리아-이라크 경계 이상 발화권","status":"사막 경계 이상 발화점 주변 소형 레드존","records":"레드존 이상현상 및 오염 기준 문서","lon":41,"lat":34,"r":1.65,"core":0.62,"surface":"land","surfaceLabel":"육상/권역","location":"중동 내륙 감시권","qa":"REVIEWED","regionName":"중동"},{"type":"zone","zone":"white","name":"수에즈-홍해 북부 관리권","status":"수에즈-홍해 북부 항로 관리권","records":"구역 위험도 분류 문서","lon":33.2,"lat":28.6,"r":1.55,"surface":"sea","surfaceLabel":"해상/통제 노드","location":"수에즈·홍해 항로권","qa":"REVIEWED","regionName":"중동"},{"type":"zone","zone":"green","name":"바그다드 후방 그린존","status":"중동 사막 감시권 후방 분석·운영권","records":"구역 위험도 분류 문서 / 지역지도","lon":44.36,"lat":33.31,"r":1.15,"surface":"land","surfaceLabel":"육상/권역","location":"중동 내륙 감시권","qa":"REVIEWED","regionName":"중동"},{"type":"blockade","surface":"sea","name":"홍해 해상 감시권","status":"홍해 해상 점선 감시권","records":"지역지도","lon":39,"lat":20,"rx":3,"ry":4,"rot":28,"surfaceLabel":"해상/감시권","location":"수에즈·홍해 항로권","qa":"REVIEWED","regionName":"중동"},{"type":"blockade","kind":"defense","name":"수에즈-홍해 항로 검문선","status":"수에즈-홍해 항로 점선","records":"지역지도","points":[[32,30],[34,24],[38,18],[42,13]],"surface":"sea","surfaceLabel":"해상/감시권","location":"수에즈·홍해 항로권","qa":"REVIEWED","regionName":"중동"},{"type":"blockade","kind":"defense","name":"중동 사막 횡단 차단선","status":"사막 횡단 차단선","records":"N.H.C 현장 작전·장비·봉쇄 규정 문서","points":[[36,32],[43,31],[49,29]],"surface":"land","surfaceLabel":"육상/권역","location":"중동 내륙 감시권","qa":"REVIEWED","regionName":"중동"},{"type":"facility","name":"수에즈 항로 봉쇄통제소","status":"수에즈 항로 봉쇄통제","records":"지역지도","lon":32.55,"lat":29.97,"org":"cpd","surface":"sea","surfaceLabel":"해상/통제 노드","location":"수에즈·홍해 항로권","qa":"REVIEWED","regionName":"중동"},{"type":"facility","name":"리야드 사막 관측기지","status":"사막 감시 기지","records":"지역지도","lon":46.68,"lat":24.71,"org":"nhc","surface":"land","surfaceLabel":"육상/권역","location":"중동 내륙 감시권","qa":"REVIEWED","regionName":"중동"},{"type":"facility","name":"바그다드 후방 분석소","status":"사막 감시권 후방 분석소","records":"지역지도","lon":44.36,"lat":33.31,"org":"uac","surface":"land","surfaceLabel":"육상/권역","location":"중동 내륙 감시권","qa":"REVIEWED","regionName":"중동"},{"type":"incident","name":"시리아-이라크 경계 이상 발화점","status":"사막 경계 이상 발화 기록","records":"레드존 이상현상 및 오염 기준 문서","lon":41,"lat":34,"surface":"land","surfaceLabel":"육상/권역","location":"중동 내륙 감시권","qa":"REVIEWED","regionName":"중동"},{"type":"incident","name":"홍해 선박 실종 기록","status":"홍해 해상 실종 기록","records":"지역지도","lon":40,"lat":18,"surface":"sea","surfaceLabel":"해상/통제 노드","location":"수에즈·홍해 항로권","qa":"REVIEWED","regionName":"중동"},{"type":"anomaly","name":"사막 오염 무전 반복 구역","status":"모래폭풍 내 음성 전파","records":"레드존 이상현상 및 오염 기준 문서","lon":42.5,"lat":31,"surface":"land","surfaceLabel":"육상/권역","location":"북아프리카·사헬권","qa":"REVIEWED","regionName":"중동"}],"africa":[{"type":"zone","zone":"black","name":"북아프리카 흑색 후보권","status":"리비아 남부-알제리 동부 사막권","records":"레드존 이상현상 및 오염 기준 문서","lon":12,"lat":22,"r":1.8,"surface":"land","surfaceLabel":"육상/권역","location":"북아프리카·사헬권","qa":"REVIEW REQUIRED","regionName":"아프리카"},{"type":"zone","zone":"yellow","name":"사헬 감시권","status":"차드-수단 서부 감시축","records":"지역지도","lon":22,"lat":13,"r":4.3,"surface":"land","surfaceLabel":"육상/권역","location":"북아프리카·사헬권","qa":"REVIEWED","regionName":"아프리카"},{"type":"zone","zone":"red","name":"동아프리카 사건권","status":"케냐 북부 귀환자 붕괴권","records":"타락 개체 분류 추가 보고서","lon":37,"lat":2,"r":1.55,"core":0.58,"surface":"land","surfaceLabel":"육상/권역","location":"동아프리카 내륙권","qa":"REVIEWED","regionName":"아프리카"},{"type":"zone","zone":"white","name":"카이로 검문 관리권","status":"북아프리카 검문 통합 허브","records":"지역지도","lon":31.24,"lat":30.04,"r":1.35,"surface":"land","surfaceLabel":"육상/권역","location":"북아프리카 지중해 연안","qa":"REVIEWED","regionName":"아프리카"},{"type":"zone","zone":"green","name":"나이로비 회수지원 그린존","status":"동아프리카 회수지원 후방 운영권","records":"구역 위험도 분류 문서 / 지역지도","lon":36.82,"lat":-1.29,"r":1.25,"surface":"land","surfaceLabel":"육상/권역","location":"동아프리카 내륙권","qa":"REVIEWED","regionName":"아프리카"},{"type":"blockade","surface":"sea","name":"지중해 남부 해상 감시권","status":"북아프리카 연안 해상 감시권","records":"지역지도","lon":16,"lat":35,"rx":4.2,"ry":1.6,"rot":-4,"surfaceLabel":"해상/감시권","location":"북아프리카 지중해 연안","qa":"REVIEWED","regionName":"아프리카"},{"type":"blockade","kind":"defense","name":"사헬 횡단 감시선","status":"사헬 횡단 감시선","records":"지역지도","points":[[5,16],[18,14],[32,12]],"surface":"land","surfaceLabel":"육상/권역","location":"북아프리카·사헬권","qa":"REVIEWED","regionName":"아프리카"},{"type":"facility","name":"카이로 검문 통합허브","status":"북아프리카 검문 통합허브","records":"지역지도","lon":31.24,"lat":30.04,"org":"uac","surface":"land","surfaceLabel":"육상/권역","location":"북아프리카 지중해 연안","qa":"REVIEWED","regionName":"아프리카"},{"type":"facility","name":"나이로비 회수지원 거점","status":"동아프리카 회수지원 거점","records":"지역지도","lon":36.82,"lat":-1.29,"org":"arf","surface":"land","surfaceLabel":"육상/권역","location":"동아프리카 내륙권","qa":"REVIEWED","regionName":"아프리카"},{"type":"facility","name":"지부티 해상 감시기지","status":"홍해 남부 해상 감시기지","records":"지역지도","lon":43.15,"lat":11.59,"org":"uac","surface":"sea","surfaceLabel":"해상/통제 노드","location":"아프리카 동부 해상 감시권","qa":"REVIEWED","regionName":"아프리카"},{"type":"incident","name":"리비아 남부 유물 회수 실패","status":"사막권 회수 실패 사건","records":"지역지도","lon":14,"lat":23,"surface":"land","surfaceLabel":"육상/권역","location":"북아프리카·사헬권","qa":"REVIEWED","regionName":"아프리카"},{"type":"incident","name":"케냐 북부 귀환자 집단 붕괴","status":"동아프리카 귀환자 붕괴 사건","records":"타락 개체 분류 추가 보고서","lon":37,"lat":2,"surface":"land","surfaceLabel":"육상/권역","location":"동아프리카 내륙권","qa":"REVIEWED","regionName":"아프리카"},{"type":"anomaly","name":"사막 유리화 흔적","status":"사막 표층 유리화 관측","records":"레드존 이상현상 및 오염 기준 문서","lon":14,"lat":23,"surface":"land","surfaceLabel":"육상/권역","location":"북아프리카·사헬권","qa":"REVIEWED","regionName":"아프리카"}]};

  const regionCode={world:'WD',east:'EA',europe:'EU',north:'NA',southasia:'SA',seindian:'SI',oceania:'OC',mideast:'ME',africa:'AF'};
  const regionName={world:'세계',east:'동아시아',europe:'유럽',north:'북미',southasia:'남아시아',seindian:'동남아·인도양',oceania:'오세아니아',mideast:'중동',africa:'아프리카'};

  function textOf(item){return [item.name,item.status,item.records,item.org,item.kind,item.surface].filter(Boolean).join(' ');}
  function classifyBlockadeNode(item){
    if(!item || item.type!=='facility') return false;
    return /(검문|검역|봉쇄|차단|통제|항로|해상\s*통제|게이트|허브)/.test(textOf(item));
  }
  function displayFilter(item){if(classifyBlockadeNode(item)) return 'blockade-node'; return item.type;}
  function displayLabel(item){if(item && item.type==='zone') return zoneLabel[item.zone]||'오염 구역'; return typeLabel[displayFilter(item)]||typeLabel[item.type]||'기록';}
  function codePrefix(item){
    if(item.type==='zone') return ({red:'RZ',black:'BZ',yellow:'YZ',white:'WZ',green:'GZ'}[item.zone]||'ZN');
    if(classifyBlockadeNode(item)) return 'GATE';
    if(item.type==='facility') return 'FAC';
    if(item.type==='incident') return 'INC';
    if(item.type==='anomaly') return 'ANM';
    if(item.type==='blockade' && item.surface==='sea' && item.lon!=null) return 'SEA';
    if(item.type==='blockade') return 'BLK';
    return 'REC';
  }
  function assignCode(region,item,counters){
    const prefix=codePrefix(item), rc=regionCode[region]||region.toUpperCase();
    counters[prefix]=(counters[prefix]||0)+1;
    return `${prefix}-${rc}-${String(counters[prefix]).padStart(2,'0')}`;
  }
  function nodeRole(item){
    const t=textOf(item);
    if(/해상|항로|항만|연안|수에즈|홍해|부산|밴쿠버|홍콩|다윈|지부티|말라카|싱가포르/.test(t)) return 'maritime';
    if(/사령|통합|통제소|허브|본부/.test(t)) return 'command';
    if(/초소|관측|관측기지|감시소/.test(t)) return 'outpost';
    if(/검문|검역|차단|봉쇄/.test(t)) return 'checkpoint';
    return 'gate';
  }
  function lineVisual(item){
    const t=textOf(item);
    if(/붕괴|소실|실패|전멸|단절/.test(t)) return 'line-broken';
    if(item.surface==='sea' || /해상|항로|북해|홍해|인도양|동중국해|태평양|지중해|말라카/.test(t)) return 'line-sea';
    if(/감시/.test(t)) return 'line-watch';
    if(/이중|완전|방어|차단|봉쇄망|봉쇄선/.test(t)) return 'line-hard';
    return 'line-blockade';
  }
  function visualName(item){
    const f=displayFilter(item), role=nodeRole(item), l=lineVisual(item);
    if(f==='blockade-node') return role==='maritime'?'항로/항만 통제 노드':role==='command'?'봉쇄사령 노드':role==='outpost'?'차단초소 노드':'검문 게이트 노드';
    if(item.type==='blockade') return l==='line-sea'?'해상 점선 봉쇄선':l==='line-hard'?'완전 차단선':l==='line-watch'?'감시선':l==='line-broken'?'붕괴/소실 구간':'봉쇄선';
    if(item.type==='zone') return ({red:'레드존 해칭+코어',black:'블랙존 심부 코어',yellow:'옐로우 점선 감시권',white:'화이트 관리권',green:'그린 후방 운영권'}[item.zone]||'권역 표시');
    if(item.type==='facility') return '작전 시설 노드';
    if(item.type==='incident') return '사건 좌표 노드';
    if(item.type==='anomaly') return '현상 기록 노드';
    return '기록 노드';
  }
  function surfaceLabel(item){ if(item.surfaceLabel) return item.surfaceLabel; if(item.surface==='sea') return '해상/감시권'; if(item.surface==='port') return '항만/연안'; if(item.surface==='land') return '육상/권역'; return (/해상|항로|바다|해역|북해|홍해|인도양|태평양|지중해|말라카/.test(textOf(item))?'해상/감시권':'육상/권역');}
  function geoFrame(region){
    const e=maps[region].extent;
    const lonSpan=e.lonMax-e.lonMin, latSpan=e.latMax-e.latMin;
    const scale=Math.min(W/lonSpan,H/latSpan);
    const mapW=lonSpan*scale, mapH=latSpan*scale;
    return {e,scale,mapW,mapH,offX:(W-mapW)/2,offY:(H-mapH)/2};
  }
  function xy(region, lon, lat){
    const f=geoFrame(region);
    return [f.offX+(lon-f.e.lonMin)*f.scale, f.offY+(f.e.latMax-lat)*f.scale];
  }
  function inExtent(region, lon, lat){const e=maps[region].extent; const pad=0.0001; return lon>=e.lonMin-pad&&lon<=e.lonMax+pad&&lat>=e.latMin-pad&&lat<=e.latMax+pad;}
  function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function el(tag, attrs){const n=document.createElementNS(NS,tag); Object.entries(attrs||{}).forEach(([k,v])=>n.setAttribute(k,v)); return n;}
  function itemAttrs(item){
    const a={'data-map-item':'1','data-filter':displayFilter(item),'data-visual':visualName(item),'data-role':nodeRole(item),'data-title':item.name,'data-code':item.code||'', 'data-status':item.status||'', 'data-records':item.records||'지역지도','data-region':item._region||'', 'data-surface':item.surfaceLabel||surfaceLabel(item), 'data-qa':item.qa||'REVIEWED', 'data-location':item.location||'', 'data-lon':(item.lon!=null?String(item.lon):''), 'data-lat':(item.lat!=null?String(item.lat):''), 'data-proj':(item._xy?('X '+Math.round(item._xy[0])+' / Y '+Math.round(item._xy[1])):''), 'tabindex':'0'};
    if(item && item.type==='zone') a['data-zone']=item.zone||'';
    return a;
  }
  function applyDatum(n,item){Object.entries(itemAttrs(item)).forEach(([k,v])=>n.setAttribute(k,v));}
  function pstr(region,p){return xy(region,p[0],p[1]).map(v=>v.toFixed(1)).join(',');}
  function ensureDefs(layer){
    const defs=el('defs',{});
    defs.innerHTML=`
      <pattern id="rzHatch" patternUnits="userSpaceOnUse" width="18" height="18" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="18" class="hatch-line-red"/></pattern>
      <pattern id="yzHatch" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="20" class="hatch-line-yellow"/></pattern>
      <pattern id="blackNoise" patternUnits="userSpaceOnUse" width="24" height="24"><circle cx="5" cy="7" r="1.5" class="black-noise-dot"/><circle cx="17" cy="13" r="1" class="black-noise-dot"/><circle cx="10" cy="20" r=".8" class="black-noise-dot"/></pattern>`;
    layer.appendChild(defs);
  }
  function makeDebug(g,x,y,item){
    // 2차 패치: 지도 위 긴 검수 문장을 제거하고, 검수 모드에서는 십자점+짧은 코드만 표시한다.
    // 전체 좌표/표면 판정/관련 기록은 우측 상세 카드와 관제 목록에서 확인한다.
    const dg=el('g',{class:'debug-readout'});
    dg.appendChild(el('line',{x1:(x-7).toFixed(1),y1:y.toFixed(1),x2:(x+7).toFixed(1),y2:y.toFixed(1),class:'debug-cross'}));
    dg.appendChild(el('line',{x1:x.toFixed(1),y1:(y-7).toFixed(1),x2:x.toFixed(1),y2:(y+7).toFixed(1),class:'debug-cross'}));
    const t=el('text',{x:(x+9).toFixed(1),y:(y+11).toFixed(1),class:'debug-code'});
    t.textContent=item.code||'NO-CODE';
    dg.appendChild(t);
    g.appendChild(dg);
  }
  function makeZone(layer,region,item){
    if(!inExtent(region,item.lon,item.lat)) return null;
    const [x,y]=xy(region,item.lon,item.lat); item._region=region; item._xy=[x,y];
    const g=el('g',{}); applyDatum(g,item);
    const z=item.zone||'red'; const cls='zone-circle zone-'+z;
    const r=(item.r||2.5)*9; const core=(item.core||Math.max(.42,(item.r||2.5)*.40))*9;
    if(z==='red'){
      g.appendChild(el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:r.toFixed(1),class:cls+' zone-outer'}));
      g.appendChild(el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:r.toFixed(1),class:'zone-hatch zone-hatch-red'}));
      g.appendChild(el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:core.toFixed(1),class:cls+' zone-core'}));
    }else if(z==='black'){
      g.appendChild(el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:r.toFixed(1),class:cls}));
      g.appendChild(el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:r.toFixed(1),class:'zone-noise zone-noise-black'}));
    }else if(z==='yellow'){
      g.appendChild(el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:r.toFixed(1),class:cls}));
      g.appendChild(el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:r.toFixed(1),class:'zone-hatch zone-hatch-yellow'}));
    }else{
      g.appendChild(el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:r.toFixed(1),class:cls}));
    }
    const label=el('text',{x:(x+r+8).toFixed(1),y:(y-r*.38).toFixed(1),class:'zone-code-label'}); label.textContent=item.code||''; g.appendChild(label);
    makeDebug(g,x,y,item);
    layer.appendChild(g); return g;
  }
  function makeLine(layer,region,item){
    if(!item.points || item.points.some(p=>!inExtent(region,p[0],p[1]))) return null;
    const pts=item.points.map(p=>xy(region,p[0],p[1])); item._region=region; item._xy=pts[Math.floor(pts.length/2)]||pts[0];
    const g=el('g',{}); applyDatum(g,item);
    const cls='map-line '+lineVisual(item);
    if(cls.includes('line-hard')) g.appendChild(el('polyline',{points:pts.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' '),class:'map-line line-hard-back'}));
    g.appendChild(el('polyline',{points:pts.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' '),class:cls}));
    const [lx,ly]=item._xy; const label=el('text',{x:(lx+10).toFixed(1),y:(ly-12).toFixed(1),class:'node-label line-code-label'}); label.textContent=item.code||''; g.appendChild(label); makeDebug(g,lx,ly,item);
    layer.appendChild(g); return g;
  }
  function makeRing(layer,region,item){
    if(!inExtent(region,item.lon,item.lat)) return null;
    const [x,y]=xy(region,item.lon,item.lat); item._region=region; item._xy=[x,y];
    const g=el('g',{}); applyDatum(g,item);
    const rx=(item.rx||4)*9, ry=(item.ry||2.4)*9;
    g.appendChild(el('ellipse',{cx:x.toFixed(1),cy:y.toFixed(1),rx:rx.toFixed(1),ry:ry.toFixed(1),transform:`rotate(${item.rot||0} ${x.toFixed(1)} ${y.toFixed(1)})`,class:'sea-ring sea-ring-watch'}));
    g.appendChild(el('text',{x:(x+rx+8).toFixed(1),y:(y-6).toFixed(1),class:'zone-code-label sea-code-label'})).textContent=item.code||'';
    makeDebug(g,x,y,item);
    layer.appendChild(g); return g;
  }
  function markerShape(type,org,x,y,item){
    const visual=(classifyBlockadeNode(item)?'blockade-node':type), role=nodeRole(item);
    const s=11.5;
    const g=el('g',{class:'node-marker node-marker-'+(visual||'unknown')+' node-role-'+role});
    const pt=(dx,dy)=>[(x+dx*s).toFixed(1),(y+dy*s).toFixed(1)].join(',');
    const cls=(base)=>base+(org?' '+org:'')+(role?' role-'+role:'');
    if(visual==='facility'){
      g.appendChild(el('polygon',{points:[pt(0,-1.15),pt(1.05,-.55),pt(1.05,.55),pt(0,1.15),pt(-1.05,.55),pt(-1.05,-.55)].join(' '),class:cls('node-shape node-facility')}));
      if(org==='uac') g.appendChild(el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:(.34*s).toFixed(1),class:'node-symbol node-symbol-core'}));
      else if(org==='nhc') g.appendChild(el('polyline',{points:[pt(-.42,-.12),pt(0,.42),pt(.42,-.12)].join(' '),class:'node-symbol node-symbol-chevron'}));
      else if(org==='arf') g.appendChild(el('polyline',{points:[pt(-.45,.3),pt(0,-.38),pt(.45,.3)].join(' '),class:'node-symbol node-symbol-hook'}));
      else g.appendChild(el('line',{x1:(x-.42*s).toFixed(1),y1:y.toFixed(1),x2:(x+.42*s).toFixed(1),y2:y.toFixed(1),class:'node-symbol node-symbol-line'}));
    }else if(visual==='blockade-node'){
      if(role==='command'){
        g.appendChild(el('rect',{x:(x-1.18*s).toFixed(1),y:(y-1.05*s).toFixed(1),width:(2.36*s).toFixed(1),height:(2.10*s).toFixed(1),rx:(.12*s).toFixed(1),class:'node-shape node-blockade-node node-blockade-command'}));
        g.appendChild(el('line',{x1:(x-1*s).toFixed(1),y1:(y-.45*s).toFixed(1),x2:(x+1*s).toFixed(1),y2:(y-.45*s).toFixed(1),class:'node-symbol node-symbol-commandbar'}));
        g.appendChild(el('line',{x1:(x-.58*s).toFixed(1),y1:(y+.36*s).toFixed(1),x2:(x+.58*s).toFixed(1),y2:(y+.36*s).toFixed(1),class:'node-symbol node-symbol-commandbar'}));
      }else if(role==='maritime'){
        g.appendChild(el('rect',{x:(x-1.18*s).toFixed(1),y:(y-.78*s).toFixed(1),width:(2.36*s).toFixed(1),height:(1.56*s).toFixed(1),rx:(.10*s).toFixed(1),class:'node-shape node-blockade-node node-blockade-maritime'}));
        g.appendChild(el('path',{d:`M ${(x-.78*s).toFixed(1)} ${(y+.18*s).toFixed(1)} Q ${x.toFixed(1)} ${(y-.28*s).toFixed(1)} ${(x+.78*s).toFixed(1)} ${(y+.18*s).toFixed(1)}`,class:'node-symbol node-symbol-wave'}));
        g.appendChild(el('line',{x1:x.toFixed(1),y1:(y-.62*s).toFixed(1),x2:x.toFixed(1),y2:(y-.16*s).toFixed(1),class:'node-symbol node-symbol-antenna'}));
      }else if(role==='outpost'){
        g.appendChild(el('rect',{x:(x-.86*s).toFixed(1),y:(y-.86*s).toFixed(1),width:(1.72*s).toFixed(1),height:(1.72*s).toFixed(1),rx:(.08*s).toFixed(1),class:'node-shape node-blockade-node node-blockade-outpost'}));
        g.appendChild(el('line',{x1:(x-.46*s).toFixed(1),y1:y.toFixed(1),x2:(x+.46*s).toFixed(1),y2:y.toFixed(1),class:'node-symbol node-symbol-crossbar'}));
        g.appendChild(el('line',{x1:x.toFixed(1),y1:(y-.46*s).toFixed(1),x2:x.toFixed(1),y2:(y+.46*s).toFixed(1),class:'node-symbol node-symbol-crossbar'}));
      }else{
        g.appendChild(el('rect',{x:(x-1.10*s).toFixed(1),y:(y-.72*s).toFixed(1),width:(2.20*s).toFixed(1),height:(1.44*s).toFixed(1),rx:(.09*s).toFixed(1),class:'node-shape node-blockade-node node-blockade-checkpoint'}));
        g.appendChild(el('line',{x1:(x-.46*s).toFixed(1),y1:(y-.72*s).toFixed(1),x2:(x-.46*s).toFixed(1),y2:(y+.72*s).toFixed(1),class:'node-symbol node-symbol-gatebar'}));
        g.appendChild(el('line',{x1:(x+.46*s).toFixed(1),y1:(y-.72*s).toFixed(1),x2:(x+.46*s).toFixed(1),y2:(y+.72*s).toFixed(1),class:'node-symbol node-symbol-gatebar'}));
      }
    }else if(visual==='incident'){
      g.appendChild(el('polygon',{points:[pt(0,-1.05),pt(1.05,0),pt(0,1.05),pt(-1.05,0)].join(' '),class:'node-shape node-incident'}));
      g.appendChild(el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:(.21*s).toFixed(1),class:'node-symbol node-symbol-dot'}));
    }else if(visual==='anomaly'){
      g.appendChild(el('polygon',{points:[pt(0,-1.12),pt(1.05,.95),pt(-1.05,.95)].join(' '),class:'node-shape node-anomaly'}));
      g.appendChild(el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:(.42*s).toFixed(1),class:'node-symbol node-symbol-ring'}));
      g.appendChild(el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:(.15*s).toFixed(1),class:'node-symbol node-symbol-dot dim'}));
    }else{
      g.appendChild(el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:(.72*s).toFixed(1),class:'node-shape node-zone'}));
      g.appendChild(el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:(.28*s).toFixed(1),class:'node-symbol node-symbol-dot'}));
    }
    return g;
  }
  function makeMarker(layer,region,item){
    if(!inExtent(region,item.lon,item.lat)) return null;
    const [x,y]=xy(region,item.lon,item.lat); item._region=region; item._xy=[x,y];
    const g=el('g',{}); applyDatum(g,item);
    g.appendChild(markerShape(item.type,item.org,x,y,item));
    const label=el('text',{x:(x+16).toFixed(1),y:(y-14).toFixed(1),class:'node-label'}); label.textContent=item.code||item.name; g.appendChild(label);
    makeDebug(g,x,y,item);
    layer.appendChild(g); return g;
  }
  function renderRegion(region){
    const panel=shell.querySelector(`[data-continent-panel="${region}"]`); if(!panel) return;
    const layer=panel.querySelector('.map-data-layer'); const list=panel.querySelector('.continent-point-list');
    if(!layer||!list) return;
    layer.setAttribute('viewBox',`0 0 ${W} ${H}`); layer.setAttribute('preserveAspectRatio','xMidYMid meet');
    layer.innerHTML=''; list.innerHTML=''; ensureDefs(layer);
    const counters={}; const items=data[region]||[];
    items.forEach(item=>{item.code=assignCode(region,item,counters);});
    items.forEach(item=>{
      let node=null;
      if(item.lon!=null && item.lat!=null && item.type==='zone') node=makeZone(layer,region,item);
      else if(item.points && item.type==='blockade') node=makeLine(layer,region,item);
      else if(item.lon!=null && item.lat!=null && item.type==='blockade' && item.surface==='sea') node=makeRing(layer,region,item);
      else if(item.lon!=null && item.lat!=null) node=makeMarker(layer,region,item);
      if(!node) return;
      const li=document.createElement('div'); li.className='continent-point'+(item.type==='zone'?' zone-point zone-'+(item.zone||''):''); li.dataset.filter=displayFilter(item); if(item.type==='zone') li.dataset.zone=item.zone||'';
      const coord=(item.lon!=null&&item.lat!=null)?`위도 ${item.lat.toFixed(2)} / 경도 ${item.lon.toFixed(2)}`:(item.points?`${item.points.length}점 선형 좌표`:'좌표 미지정');
      li.innerHTML=`<b>${esc(item.code)} · ${esc(displayLabel(item))}</b><span>${esc(item.name)}<small>${esc(item.status||'위치 검수 대상')} · ${esc(coord)}</small></span>`;
      li.addEventListener('click',()=>updateCard(panel,item)); list.appendChild(li);
      node.addEventListener('click',()=>updateCard(panel,item));
      node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();updateCard(panel,item);}});
    });
    if(items[0]) updateCard(panel,items[0]);
  }
  function updateCard(panel,item){
    const card=panel.querySelector('.map-detail-card'); if(!card||!item) return;
    const xyTxt=item._xy?`X ${Math.round(item._xy[0])} / Y ${Math.round(item._xy[1])}`:'선형 좌표';
    const coord=(item.lon!=null&&item.lat!=null)?`${item.lat.toFixed(4)}, ${item.lon.toFixed(4)}`:(item.points?`${item.points.length}개 경유점`:'좌표 없음');
    card.innerHTML=`<b>${esc(item.code||'NO-CODE')} · ${esc(item.name)}</b><p>${esc(item.status||'상태 기록 없음')}</p><small>분류: ${esc(displayLabel(item))}<br>표현: ${esc(visualName(item))}<br>표면: ${esc(surfaceLabel(item))}<br>좌표: ${esc(coord)}<br>SVG: ${esc(xyTxt)}<br>관련 기록: ${esc(item.records||'지역지도')}</small>`;
  }
  function matchFilter(el,filter){if(filter==='all') return true; if(filter==='zone') return el.dataset.filter==='zone'; if(filter && filter.startsWith('zone-')) return el.dataset.filter==='zone' && el.dataset.zone===filter.replace('zone-',''); return el.dataset.filter===filter;}
  function applyFilter(){const filter=shell.dataset.filter||'all'; shell.querySelectorAll('[data-map-item]').forEach(el=>{el.style.display=matchFilter(el,filter)?'':'none';}); shell.querySelectorAll('.continent-point').forEach(el=>{el.style.display=matchFilter(el,filter)?'':'none';});}
  function addDebugButton(){
    const filters=shell.querySelector('.continent-filters'); if(!filters || filters.querySelector('[data-map-debug]')) return;
    const btn=document.createElement('button'); btn.type='button'; btn.className='continent-filter debug-filter'; btn.dataset.mapDebug='toggle'; btn.textContent='검수 모드';
    btn.addEventListener('click',()=>{shell.classList.toggle('map-debug-on'); btn.classList.toggle('active',shell.classList.contains('map-debug-on'));});
    filters.appendChild(btn);
  }
  // 2차 패치: 세계 지도는 요약판으로 유지한다. 세부 사건 좌표와 전역 봉쇄선은 대륙별 지도에서 확인한다.
  data.world=(data.world||[]).filter(function(item){
    return item.type==='zone' || (item.type==='blockade' && item.surface==='sea');
  });
  Object.keys(data).forEach(renderRegion);
  addDebugButton();
  shell.querySelectorAll('.continent-filter:not(.debug-filter)').forEach(btn=>btn.addEventListener('click',()=>setTimeout(applyFilter,0)));
  shell.querySelectorAll('.continent-tab').forEach(btn=>btn.addEventListener('click',()=>setTimeout(applyFilter,0)));
  applyFilter();
})();


// U.A.C regional surface-link overlay. Replaces code-dump loading with map-control surface alignment.
document.addEventListener('DOMContentLoaded', function(){
  const shell = document.querySelector('.continental-map-shell.datamap-v3');
  if(!shell) return;
  const regionNames = {
    world:'세계 관제 개요', east:'동아시아 관제면', europe:'유럽 관제면', north:'북미 관제면',
    southasia:'남아시아 관제면', seindian:'동남아·인도양 관제면', oceania:'오세아니아 관제면', mideast:'중동 관제면', africa:'아프리카 관제면'
  };
  const stepText = ['감시망 수신','좌표면 정렬','오염권 레이어 대기','봉쇄선 레이어 동기화','지도 표면 개방'];
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function ensureLoader(){
    let el = shell.querySelector('.uac-map-code-loader');
    if(el) return el;
    el = document.createElement('div');
    el.className = 'uac-map-code-loader uac-map-surface-loader';
    el.setAttribute('aria-hidden','true');
    el.innerHTML = '<div class="surface-frame"><i></i><i></i><i></i><i></i></div>'+ 
      '<div class="surface-scan-x"></div><div class="surface-scan-y"></div>'+ 
      '<div class="red-band"></div>'+ 
      '<div class="status-card"><div class="status-title"><b>REGIONAL SURFACE LINK</b><em data-loader-region>세계 관제 개요</em></div>'+ 
      '<div class="status-log">'+stepText.map(function(t){return '<span>'+esc(t)+'</span>';}).join('')+'</div>'+ 
      '<div class="progress-row"><i></i></div></div>'+ 
      '<div class="sector-grid">'+Array.from({length:20},function(){return '<i></i>';}).join('')+'</div>';
    shell.appendChild(el);
    return el;
  }
  let timer = null;
  function showMapSurfaceLoader(regionKey, duration){
    const el = ensureLoader();
    const label = el.querySelector('[data-loader-region]');
    if(label) label.textContent = regionNames[regionKey] || '권역 관제면';
    clearTimeout(timer);
    el.classList.remove('is-fading');
    el.classList.add('is-active');
    timer = setTimeout(function(){
      el.classList.add('is-fading');
      setTimeout(function(){el.classList.remove('is-active','is-fading');}, 280);
    }, duration || 920);
  }
  shell.querySelectorAll('.continent-tab').forEach(function(btn){
    btn.addEventListener('click', function(){showMapSurfaceLoader(btn.dataset.continent || 'world', 1050);}, true);
  });
  document.querySelectorAll('.side-menu a[data-target="zone-map"]').forEach(function(link){
    link.addEventListener('click', function(){
      const active = shell.querySelector('.continent-tab.active');
      setTimeout(function(){showMapSurfaceLoader(active ? active.dataset.continent : 'world', 1120);}, 80);
    }, false);
  });
  if((location.hash || '').replace('#','') === 'zone-map'){
    setTimeout(function(){
      const active = shell.querySelector('.continent-tab.active');
      showMapSurfaceLoader(active ? active.dataset.continent : 'world', 1120);
    }, 520);
  }
});


// Project Curse 3차 패치: 서버 상태 바 + 지도 레이어 부팅 + 확대/축소 + 상세 패널 + 문서 상태 뱃지.
(function(){
  const ready = (fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const shell=document.querySelector('.continental-map-shell.datamap-v3');
    const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    // 1) 상단 서버 상태 바
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
    function setStatus(mode, region){
      const map=statusBar.querySelector('[data-srv-map]');
      const trace=statusBar.querySelector('[data-srv-trace]');
      const notice=statusBar.querySelector('[data-srv-notice]');
      const crumb=statusBar.querySelector('[data-srv-breadcrumb]');
      const field=statusBar.querySelector('[data-srv-field]');
      const regionName={world:'GLOBAL',east:'EAST-ASIA',europe:'EUROPE',north:'NORTH-AMERICA',southasia:'SOUTH-ASIA',seindian:'SEA/INDIAN',oceania:'OCEANIA',mideast:'MIDDLE-EAST',africa:'AFRICA'}[region||'']||'';
      if(mode==='map'){
        map.textContent='MAP SYNC: ACTIVE '+(regionName?'/ '+regionName:'');
        trace.textContent='F.H.C TRACE: NONE'; trace.className='status-field';
        field.textContent='N.H.C FIELD LINK: LIMITED';
        notice.textContent='REGION LAYER / ZONE / BLOCKADE NETWORK READY'; if(crumb) crumb.textContent='U.A.C ARCHIVE / 지역지도 / '+(regionName||'GLOBAL');
      }else if(mode==='archive'){
        map.textContent='MAP SYNC: STANDBY';
        trace.textContent='F.H.C TRACE: INDEX SCAN'; trace.className='status-field status-warn';
        notice.textContent='ARCHIVE INDEX OPEN / RECORD BADGES ACTIVE'; if(crumb) crumb.textContent='U.A.C ARCHIVE / 기록보관서';
      }else if(mode==='faction'){
        map.textContent='MAP SYNC: STANDBY';
        trace.textContent='RELATION TRACE: ACTIVE'; trace.className='status-field status-map';
        notice.textContent='FACTION NETWORK ANALYSIS MODULE'; if(crumb) crumb.textContent='U.A.C ARCHIVE / 세력 분석';
      }else{
        map.textContent='MAP SYNC: STANDBY';
        trace.textContent='F.H.C TRACE: NONE'; trace.className='status-field';
        notice.textContent='PROJECT CURSE / SCOPELOCKED SERVER'; if(crumb) crumb.textContent='U.A.C ARCHIVE / HOME';
      }
    }
    function currentPage(){const a=document.querySelector('.content-page.active'); return a?a.id:(location.hash||'').replace('#','');}
    function updateStatusFromPage(){
      const id=currentPage();
      const active=shell?shell.querySelector('.continent-tab.active'):null;
      if(id==='zone-map') setStatus('map',active?active.dataset.continent:'world');
      else if(id==='archive-entry') setStatus('archive');
      else if(id==='faction-info'||id==='faction-relation') setStatus('faction');
      else setStatus('home');
    }
    document.querySelectorAll('.side-menu a[data-target]').forEach(a=>a.addEventListener('click',()=>setTimeout(updateStatusFromPage,60)));
    window.addEventListener('hashchange',()=>setTimeout(updateStatusFromPage,60));
    setTimeout(updateStatusFromPage,120);

    // 2) 문서 상태 뱃지
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

    if(!shell) return;
    shell.classList.add('map-patch3');

    // 3) 지도 확대/축소 / 넓게 보기 / 드래그 이동
    const zoomState=new WeakMap();
    function getState(frame){
      let s=zoomState.get(frame);
      if(!s){s={scale:1,x:0,y:0,wide:false}; zoomState.set(frame,s);} return s;
    }
    function clampViewport(frame){
      const s=getState(frame);
      const scale=Math.max(1,Math.min(3.2,+s.scale||1));
      s.scale=scale;
      if(scale<=1.001){s.x=0;s.y=0;return;}
      const maxX=Math.max(0,(frame.clientWidth||0)*(scale-1)/2);
      const maxY=Math.max(0,(frame.clientHeight||0)*(scale-1)/2);
      s.x=Math.max(-maxX,Math.min(maxX,+s.x||0));
      s.y=Math.max(-maxY,Math.min(maxY,+s.y||0));
    }
    function syncMarkerScale(frame){
      const s=getState(frame);
      const inv=(1/(Math.max(1,+s.scale||1))).toFixed(4);
      frame.style.setProperty('--pc-marker-inv', inv);
      frame.querySelectorAll('.node-label,.zone-code-label,.line-code-label,.debug-code').forEach(el=>{
        el.style.setProperty('--pc-marker-inv', inv);
      });
    }
    function applyViewport(frame){
      const s=getState(frame);
      clampViewport(frame);
      const transform=`translate(${s.x}px, ${s.y}px) scale(${s.scale})`;
      // 5.5.1: one viewport state drives base map, SVG markers, and tactical LOD together.
      frame.style.setProperty('--map-x', s.x+'px');
      frame.style.setProperty('--map-y', s.y+'px');
      frame.style.setProperty('--map-scale', String(s.scale));
      frame.querySelectorAll('.continent-map-img,.map-data-layer,.pc55-tactical-lod').forEach(el=>{el.style.transform=transform;});
      syncMarkerScale(frame);
      const read=frame.querySelector('.map-zoom-readout'); if(read) read.textContent=Math.round(s.scale*100)+'%';
      const stage=frame.querySelector('.map-zoom-stage'); if(stage){ const n=s.scale<1.15?1:(s.scale<1.55?2:(s.scale<2.05?3:(s.scale<2.65?4:5))); const labels={1:'ZOOM 1 / 권역 관제',2:'ZOOM 2 / 작전권 관제',3:'ZOOM 3 / 전술 관제',4:'ZOOM 4 / 시설 관제',5:'ZOOM 5 / 기록 분석'}; stage.textContent=labels[n]; frame.dataset.zoomStage=String(n); }
      frame.classList.toggle('map-wide-mode',!!s.wide);
      const wideBtn=frame.querySelector('[data-map-tool="wide"]'); if(wideBtn) wideBtn.classList.toggle('active',!!s.wide);
    }
    function scheduleViewport(frame){
      // 5.5.6: pointer drag can emit dozens of move events per second; schedule transform sync once per animation frame.
      if(frame._pc556ViewportRAF) return;
      frame._pc556ViewportRAF=requestAnimationFrame(()=>{frame._pc556ViewportRAF=0; applyViewport(frame);});
    }
    function zoomFrame(frame,delta){
      const s=getState(frame);
      s.scale=Math.max(1,Math.min(3.2, +(s.scale+delta).toFixed(2)));
      if(s.scale<=1.001){s.x=0;s.y=0;s.wide=false;}
      applyViewport(frame);
    }
    function resetFrame(frame){const s=getState(frame); s.scale=1;s.x=0;s.y=0;s.wide=false;applyViewport(frame);}
    function wideFrame(frame){const s=getState(frame); s.scale=1;s.x=0;s.y=0;s.wide=!s.wide; applyViewport(frame);}
    function ensureTools(frame){
      if(frame.querySelector('.map-viewport-tools')) return;
      const tools=document.createElement('div');
      tools.className='map-viewport-tools';
      tools.innerHTML='<button type="button" data-map-tool="zoom-in">+</button><button type="button" data-map-tool="zoom-out">−</button><span class="map-zoom-readout">100%</span><span class="map-zoom-stage">ZOOM 1 / 권역 보기</span><button type="button" data-map-tool="reset">FIT</button><button type="button" data-map-tool="wide">WIDE</button>';
      frame.appendChild(tools);
      tools.addEventListener('click',e=>{
        const btn=e.target.closest('button'); if(!btn) return;
        e.preventDefault(); e.stopPropagation();
        const act=btn.dataset.mapTool;
        if(act==='zoom-in') zoomFrame(frame,.18);
        else if(act==='zoom-out') zoomFrame(frame,-.18);
        else if(act==='reset') resetFrame(frame);
        else if(act==='wide') wideFrame(frame);
      });
      frame.addEventListener('wheel',e=>{
        if(!e.ctrlKey && Math.abs(e.deltaY)<30) return;
        e.preventDefault(); zoomFrame(frame,e.deltaY<0?.14:-.14);
      },{passive:false});
      let drag=null;
      frame.addEventListener('pointerdown',e=>{
        if(e.target.closest('.map-viewport-tools') || e.target.closest('.map-detail-card')) return;
        const s=getState(frame);
        if(s.scale<=1.001) return;
        drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:s.x,startY:s.y};
        frame.classList.add('is-dragging');
        try{frame.setPointerCapture(e.pointerId);}catch(_e){}
      });
      frame.addEventListener('pointermove',e=>{
        if(!drag || drag.id!==e.pointerId) return;
        const s=getState(frame); s.x=drag.startX+(e.clientX-drag.x); s.y=drag.startY+(e.clientY-drag.y); clampViewport(frame); scheduleViewport(frame);
      });
      function endDrag(e){ if(drag && (!e || drag.id===e.pointerId)){drag=null; frame.classList.remove('is-dragging');}}
      frame.addEventListener('pointerup',endDrag); frame.addEventListener('pointercancel',endDrag); frame.addEventListener('lostpointercapture',endDrag);
      applyViewport(frame);
    }
    shell.querySelectorAll('.continent-map-frame').forEach(ensureTools);

    // 4) 지역지도 레이어 부팅 연출
    const bootSteps=['감시망 수신','좌표면 정렬','오염권 레이어 대기','시설 표식 확인','봉쇄선 레이어 동기화','사건 좌표 대기','관제면 개방'];
    function ensureBoot(frame){
      let boot=frame.querySelector('.uac-layer-boot');
      if(boot) return boot;
      boot=document.createElement('div');
      boot.className='uac-layer-boot';
      boot.innerHTML='<div class="boot-panel"><div class="boot-title">REGIONAL SURFACE LINK<em data-boot-region>REGION</em></div><div class="boot-steps">'+bootSteps.map(s=>'<span>'+esc(s)+'</span>').join('')+'</div><div class="boot-progress"><i></i></div></div>';
      frame.appendChild(boot); return boot;
    }
    function runLayerBoot(region){
      const panel=shell.querySelector(`[data-continent-panel="${region}"]`)||shell.querySelector('.continent-panel.active');
      if(!panel) return;
      const frame=panel.querySelector('.continent-map-frame'); if(!frame) return;
      const boot=ensureBoot(frame); const label=boot.querySelector('[data-boot-region]');
      const names={world:'GLOBAL',east:'EAST-ASIA',europe:'EUROPE',north:'NORTH-AMERICA',southasia:'SOUTH-ASIA',seindian:'SEA/INDIAN',oceania:'OCEANIA',mideast:'MIDDLE-EAST',africa:'AFRICA'};
      if(label) label.textContent=names[region]||'REGION';
      boot.querySelectorAll('.boot-steps span').forEach(s=>s.classList.remove('on'));
      boot.classList.remove('is-active'); void boot.offsetWidth; boot.classList.add('is-active');
      panel.classList.add('layer-booting');
      boot.querySelectorAll('.boot-steps span').forEach((step,i)=>setTimeout(()=>step.classList.add('on'),120+i*105));
      clearTimeout(frame._uacBootTimer);
      frame._uacBootTimer=setTimeout(()=>{boot.classList.remove('is-active'); panel.classList.remove('layer-booting');},1500);
      setStatus('map',region);
    }
    shell.querySelectorAll('.continent-tab').forEach(btn=>btn.addEventListener('click',()=>setTimeout(()=>runLayerBoot(btn.dataset.continent||'world'),80),false));
    document.querySelectorAll('.side-menu a[data-target="zone-map"]').forEach(link=>link.addEventListener('click',()=>setTimeout(()=>{
      const active=shell.querySelector('.continent-tab.active'); runLayerBoot(active?active.dataset.continent:'world');
    },160)));
    if((location.hash||'').replace('#','')==='zone-map') setTimeout(()=>{const active=shell.querySelector('.continent-tab.active'); runLayerBoot(active?active.dataset.continent:'world');},780);

    // 5) 마커 상세 패널 강화. 기존 카드 정보를 덮지 않고 서버식 상세 형식으로 재표시.
    function linkedRecords(records){
      const parts=String(records||'지역지도').split('/').map(s=>s.trim()).filter(Boolean).slice(0,4);
      return parts.length?parts:['지역지도'];
    }
    function strengthenCardFromElement(el){
      const panel=el.closest('.continent-panel'); if(!panel) return;
      const card=panel.querySelector('.map-detail-card'); if(!card) return;
      const code=el.getAttribute('data-code')||'NO-CODE';
      const title=el.getAttribute('data-title')||'U.A.C 관제 기록';
      const type=el.getAttribute('data-visual')||el.getAttribute('data-filter')||'기록';
      const role=el.getAttribute('data-role')||'node';
      const status=el.getAttribute('data-status')||'상태 기록 없음';
      const records=el.getAttribute('data-records')||'지역지도';
      const surface=/해상|항로|maritime|sea/i.test([title,type,role,status,records].join(' '))?'해상/항로':'육상/권역';
      card.classList.add('detail-v3');
      card.innerHTML='<div class="detail-code-row"><span class="detail-code">'+esc(code)+'</span><span class="detail-type">'+esc(type)+'</span></div>'+ 
        '<b>'+esc(title)+'</b><p class="detail-status">'+esc(status)+'</p>'+ 
        '<div class="detail-grid"><i>역할</i><b>'+esc(role)+'</b><i>표면</i><b>'+esc(surface)+'</b><i>관측</i><b>FIELD REVIEW</b><i>동기화</i><b>MAP PATCH 3</b></div>'+ 
        '<div class="linked-records">'+linkedRecords(records).map(r=>'<span>'+esc(r)+'</span>').join('')+'</div>';
    }
    shell.addEventListener('click',e=>{
      const el=e.target.closest('[data-map-item]'); if(el) setTimeout(()=>strengthenCardFromElement(el),0);
    },true);
    shell.querySelectorAll('.continent-point').forEach(li=>li.addEventListener('click',()=>{
      const panel=li.closest('.continent-panel'); if(!panel) return;
      const code=(li.querySelector('b')||{}).textContent||'';
      const target=Array.from(panel.querySelectorAll('[data-map-item]')).find(n=>code && code.includes(n.getAttribute('data-code')));
      if(target) setTimeout(()=>strengthenCardFromElement(target),0);
    }));
    shell.querySelectorAll('.continent-panel').forEach(panel=>{const first=panel.querySelector('[data-map-item]'); if(first) strengthenCardFromElement(first);});
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


// PATCH 5.5 — Tactical map zoom detail layers.
// Scope lock: regional map only. Archive / F.H.C / video / bio scan / faction trace are not modified.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const shell=document.querySelector('.continental-map-shell.datamap-v3');
    if(!shell || shell.dataset.patch55Applied) return;
    shell.dataset.patch55Applied='1';
    shell.classList.add('map-patch55');

    const filterNames={
      all:'전체 레이어', zone:'오염 구역', 'zone-red':'레드존', 'zone-yellow':'옐로우존', 'zone-green':'그린존', 'zone-white':'화이트존', 'zone-black':'블랙존', facility:'작전 시설', anomaly:'현상 기록', incident:'사건 좌표', blockade:'봉쇄선', 'blockade-node':'봉쇄 거점'
    };
    const stageData={
      1:{title:'ZOOM 1 / 권역 보기', desc:'대형 오염권 · 주요 봉쇄선 · 대표 거점만 표시', code:'REGION OVERVIEW'},
      2:{title:'ZOOM 2 / 작전권 보기', desc:'작전 거점 · 감시선 · 항만 검문권 · 외곽선 표시', code:'OPERATION SECTOR'},
      3:{title:'ZOOM 3 / 전술 상세', desc:'사건 좌표 · 봉쇄 게이트 · 현상 기록점 · 제한 경로 표시', code:'TACTICAL DETAIL'},
      4:{title:'ZOOM 4 / 시설 구조', desc:'시설 코드 · 방어선 분할 · 내부 노드 표시', code:'FACILITY STRUCTURE'},
      5:{title:'ZOOM 5 / 기록 분석', desc:'사건 로그 연결선 · 오염 확산 추정선 · 경고 라벨 표시', code:'RECORD ANALYSIS'}
    };
    const regionNames={world:'GLOBAL',east:'EAST-ASIA',europe:'EUROPE',north:'NORTH-AMERICA',southasia:'SOUTH-ASIA',seindian:'SEA/INDIAN',oceania:'OCEANIA',mideast:'MIDDLE-EAST',africa:'AFRICA'};

    let audioCtx=null, lastTone=0;
    function soundEnabled(){ return localStorage.getItem('pc_audio_legacy2003_fixed')!=='off'; }
    function mapTone(kind){
      if(!soundEnabled()) return;
      const now=performance.now();
      if(now-lastTone<120) return;
      lastTone=now;
      try{
        const AC=window.AudioContext||window.webkitAudioContext;
        if(!AC) return;
        audioCtx=audioCtx||new AC();
        if(audioCtx.state==='suspended') audioCtx.resume().catch(()=>{});
        const t=audioCtx.currentTime;
        const o=audioCtx.createOscillator();
        const g=audioCtx.createGain();
        const lp=audioCtx.createBiquadFilter();
        const f={zoomIn:[150,230],zoomOut:[230,150],wide:[118,150],filter:[260,300],region:[135,195],audit:[360,260],reset:[190,160]}[kind]||[180,220];
        o.type='sine';
        lp.type='lowpass';
        lp.frequency.setValueAtTime(kind==='filter'?900:620,t);
        o.frequency.setValueAtTime(f[0],t);
        o.frequency.linearRampToValueAtTime(f[1],t+0.20);
        g.gain.setValueAtTime(0.0001,t);
        g.gain.linearRampToValueAtTime(kind==='audit'?0.010:0.007,t+0.035);
        g.gain.exponentialRampToValueAtTime(0.0001,t+0.28);
        o.connect(lp); lp.connect(g); g.connect(audioCtx.destination);
        o.start(t); o.stop(t+0.30);
      }catch(e){}
    }

    function makeEl(tag, cls, text){
      const el=document.createElement(tag);
      if(cls) el.className=cls;
      if(text!=null) el.textContent=text;
      return el;
    }
    function line(parent,lvl,x1,y1,x2,y2,cls){
      const el=makeEl('i','pc55-lod-item pc55-lod-'+lvl+' pc55-line '+(cls||''));
      const dx=x2-x1, dy=y2-y1;
      const len=Math.sqrt(dx*dx+dy*dy);
      const angle=Math.atan2(dy,dx)*180/Math.PI;
      el.style.left=x1+'%'; el.style.top=y1+'%'; el.style.width=len+'%'; el.style.transform='rotate('+angle+'deg)';
      parent.appendChild(el); return el;
    }
    function dot(parent,lvl,x,y,cls,label){
      const el=makeEl('i','pc55-lod-item pc55-lod-'+lvl+' pc55-dot '+(cls||''));
      el.style.left=x+'%'; el.style.top=y+'%';
      if(label) el.setAttribute('data-label',label);
      parent.appendChild(el); return el;
    }
    function block(parent,lvl,x,y,w,h,cls,label){
      const el=makeEl('i','pc55-lod-item pc55-lod-'+lvl+' pc55-block '+(cls||''));
      el.style.left=x+'%'; el.style.top=y+'%'; el.style.width=w+'%'; el.style.height=h+'%';
      if(label) el.setAttribute('data-label',label);
      parent.appendChild(el); return el;
    }
    function label(parent,lvl,x,y,text,cls){
      const el=makeEl('span','pc55-lod-item pc55-lod-'+lvl+' pc55-lod-label '+(cls||''),text);
      el.style.left=x+'%'; el.style.top=y+'%';
      parent.appendChild(el); return el;
    }
    function seedFromRegion(region){
      let h=0; String(region||'world').split('').forEach(ch=>{h=(h*31+ch.charCodeAt(0))%997;});
      return h;
    }
    function ensureLod(frame){
      if(frame.querySelector('.pc55-tactical-lod')) return;
      const panel=frame.closest('.continent-panel');
      const region=panel?.dataset.continentPanel||'world';
      const seed=seedFromRegion(region);
      const layer=makeEl('div','pc55-tactical-lod');
      layer.setAttribute('aria-hidden','true');
      frame.insertBefore(layer, frame.querySelector('.map-data-layer') || frame.firstChild);

      // ZOOM 1/2: broad sector grid and primary routes.
      line(layer,2, 12+(seed%9), 72, 82, 38+(seed%8), 'route-main');
      line(layer,2, 20, 22+(seed%6), 75-(seed%7), 64, 'route-watch');
      line(layer,2, 9, 50, 92, 50+(seed%5), 'route-soft');
      label(layer,2, 6, 8, 'SECTOR '+(regionNames[region]||region).replace(/[^A-Z/]/g,''), 'sector');
      label(layer,2, 73, 14+(seed%5), 'BORDER WATCH', 'sector soft');

      // ZOOM 3: checkpoints and anomaly/incident micro-points.
      const pts=[[32,34],[45,43],[58,38],[64,57],[38,63],[72,48],[24,55],[51,70]];
      pts.forEach((p,i)=>dot(layer,3,p[0]+((seed+i)%5-2),p[1]+((seed*i)%5-2),i%3===0?'gate':(i%3===1?'anomaly':'incident'),['GATE','ANM','INC'][i%3]+'-'+String(i+1).padStart(2,'0')));
      line(layer,3,31,34,45,43,'restricted');
      line(layer,3,45,43,58,38,'restricted');
      line(layer,3,58,38,64,57,'restricted red');
      line(layer,3,38,63,51,70,'restricted');
      label(layer,3, 18, 84, 'ENTRY ROUTE LIMITED', 'warn');

      // ZOOM 4: facility blocks, defense segmentation and internal nodes.
      block(layer,4, 33+(seed%5), 28, 12, 7, 'facility','FAC-A');
      block(layer,4, 55, 48+(seed%4), 10, 6, 'facility','FAC-B');
      block(layer,4, 68, 35, 8, 9, 'facility command','CMD');
      block(layer,4, 27, 58, 9, 6, 'facility muted','OBS');
      line(layer,4, 29, 58, 76, 35, 'defense');
      line(layer,4, 33, 64, 67, 63, 'defense soft');
      label(layer,4, 55, 30, 'INNER NODE / 시설 구조', 'facility-tag');

      // ZOOM 5: analysis vectors and warning labels.
      line(layer,5, 36, 34, 67, 52, 'analysis red');
      line(layer,5, 42, 62, 71, 43, 'analysis yellow');
      line(layer,5, 50, 28, 60, 70, 'analysis soft');
      dot(layer,5, 68, 52, 'warning','LOG');
      dot(layer,5, 42, 62, 'warning yellow','SPREAD');
      label(layer,5, 66, 56, 'LOG LINK', 'warn');
      label(layer,5, 39, 68, '확산 추정선', 'warn yellow');
      label(layer,5, 10, 92, 'RECORD ANALYSIS LAYER', 'analysis-label');

      const card=makeEl('div','pc55-stage-card');
      card.innerHTML='<b data-pc55-stage-title>ZOOM 1 / 권역 보기</b><span data-pc55-stage-desc>대형 오염권 · 주요 봉쇄선 · 대표 거점만 표시</span><em data-pc55-stage-code>REGION OVERVIEW</em>';
      frame.appendChild(card);
      const hud=makeEl('div','pc55-sync-hud');
      hud.innerHTML='<b>TACTICAL LAYER SYNC</b><span>전술 레이어 동기화</span>';
      frame.appendChild(hud);
    }
    function activePanel(){ return shell.querySelector('.continent-panel.active'); }
    function activeFrame(){ return activePanel()?.querySelector('.continent-map-frame'); }
    function updateStage(frame){
      if(!frame) return;
      let n=parseInt(frame.dataset.zoomStage||'1',10);
      if(!stageData[n]) n=1;
      frame.dataset.pc55Stage=String(n);
      const d=stageData[n];
      const t=frame.querySelector('[data-pc55-stage-title]');
      const s=frame.querySelector('[data-pc55-stage-desc]');
      const c=frame.querySelector('[data-pc55-stage-code]');
      if(t) t.textContent=d.title;
      if(s) s.textContent=d.desc;
      if(c) c.textContent=d.code;
      const status=document.querySelector('[data-srv-map]');
      if(status && (document.querySelector('.content-page.active')?.id==='zone-map')){
        const region=activePanel()?.dataset.continentPanel||'world';
        status.textContent='MAP SYNC: ACTIVE / '+(regionNames[region]||region.toUpperCase())+' / Z'+n;
      }
    }
    function showSync(frame,title,desc){
      if(!frame) return;
      const hud=frame.querySelector('.pc55-sync-hud');
      if(!hud) return;
      hud.querySelector('b').textContent=title||'TACTICAL LAYER SYNC';
      hud.querySelector('span').textContent=desc||'전술 레이어 동기화';
      hud.classList.remove('is-active');
      requestAnimationFrame(()=>hud.classList.add('is-active'));
      clearTimeout(hud._pc55Timer);
      hud._pc55Timer=setTimeout(()=>hud.classList.remove('is-active'),320);
    }
    function ensureStatus(){
      let status=shell.querySelector('.pc55-filter-status');
      if(status) return status;
      status=makeEl('div','pc55-filter-status');
      status.innerHTML='<b>FILTER ACTIVE</b><span data-pc55-filter-text>전체 레이어</span><em data-pc55-stage-mini>ZOOM 1</em>';
      const filters=shell.querySelector('.continent-filters');
      if(filters) filters.insertAdjacentElement('afterend',status);
      else shell.insertBefore(status,shell.firstChild);
      return status;
    }
    function updateFilterStatus(){
      const status=ensureStatus();
      const key=shell.dataset.filter||'all';
      const stage=activeFrame()?.dataset.zoomStage||activeFrame()?.dataset.pc55Stage||'1';
      status.querySelector('[data-pc55-filter-text]').textContent=filterNames[key]||key;
      status.querySelector('[data-pc55-stage-mini]').textContent='ZOOM '+stage;
      shell.dataset.pc55Filter=key;
    }
    function initFrame(frame){
      ensureLod(frame);
      updateStage(frame);
      const obs=new MutationObserver(()=>{ updateStage(frame); updateFilterStatus(); });
      obs.observe(frame,{attributes:true,attributeFilter:['data-zoom-stage']});
    }

    shell.querySelectorAll('.continent-map-frame').forEach(initFrame);
    updateFilterStatus();

    shell.querySelectorAll('.map-viewport-tools').forEach(tools=>{
      if(tools.dataset.pc55Bound) return;
      tools.dataset.pc55Bound='1';
      tools.addEventListener('click',function(e){
        const btn=e.target.closest('[data-map-tool]'); if(!btn) return;
        const frame=btn.closest('.continent-map-frame');
        const act=btn.dataset.mapTool;
        setTimeout(()=>{
          updateStage(frame); updateFilterStatus();
          if(act==='zoom-in'){mapTone('zoomIn'); frame.dataset.pc556LastZoom='in';}
          else if(act==='zoom-out'){mapTone('zoomOut'); frame.dataset.pc556LastZoom='out';}
          else if(act==='wide'){mapTone('wide'); showSync(frame,'WIDE VIEW RECALIBRATED','권역 전체 보기 좌표 재정렬');}
          else {mapTone('reset'); showSync(frame,'MAP VIEW FIT','기본 보기로 복귀');}
        },30);
      },true);
    });
    shell.querySelectorAll('.continent-map-frame').forEach(frame=>{
      let wheelTimer=0;
      frame.addEventListener('wheel',function(e){
        if(!e.ctrlKey && Math.abs(e.deltaY)<30) return;
        const now=performance.now();
        if(now-wheelTimer<180) return;
        wheelTimer=now;
        setTimeout(()=>{
          updateStage(frame); updateFilterStatus();
          mapTone(e.deltaY<0?'zoomIn':'zoomOut');
          frame.dataset.pc556LastZoom=e.deltaY<0?'in':'out';
        },35);
      },{passive:true});
    });
    shell.querySelectorAll('.continent-filter').forEach(btn=>{
      if(btn.dataset.pc55Bound) return;
      btn.dataset.pc55Bound='1';
      btn.addEventListener('click',function(){
        setTimeout(()=>{
          updateFilterStatus();
          const key=shell.dataset.filter||btn.dataset.mapFilter||'all';
          mapTone(btn.dataset.mapDebug?'audit':'filter');
          showSync(activeFrame(),btn.dataset.mapDebug?'AUDIT LAYER TOGGLE':'FILTER MATRIX UPDATED',(filterNames[key]||'선택 레이어')+' 표시 기준 갱신');
        },40);
      },true);
    });
    shell.querySelectorAll('.continent-tab').forEach(btn=>{
      if(btn.dataset.pc55RegionBound) return;
      btn.dataset.pc55RegionBound='1';
      btn.addEventListener('click',function(){
        setTimeout(()=>{
          shell.querySelectorAll('.continent-map-frame').forEach(frame=>{ensureLod(frame); updateStage(frame);});
          updateFilterStatus();
          mapTone('region');
          showSync(activeFrame(),'REGION LAYER LINKED',(regionNames[btn.dataset.continent]||btn.textContent.trim())+' 권역 전술 레이어 연결');
        },80);
      },true);
    });
    setTimeout(()=>{shell.querySelectorAll('.continent-map-frame').forEach(frame=>{ensureLod(frame); updateStage(frame);}); updateFilterStatus();},420);
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch55:'Tactical Map Zoom Detail Layers'});


// PATCH 5.5.1 — TacticalMapQA / viewport clamp / marker detail recovery / menu transition separation.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const shell=document.querySelector('.continental-map-shell.datamap-v3');
    if(shell) shell.classList.add('map-patch551');

    // Left-menu entry transitions are separate from record-file notices and map HUDs.
    const menuFx={
      history:['CHRONICLE INDEX REBUILD','연대 기록 색인 재구성',['사건 연표 확인','기록 단절 구간 보정','U.A.C 역사 자료면 개방']],
      factions:['FACTION DOSSIER ACCESS','세력 기록철 접근',['식별 코드 대조','관계 등급 확인','세력 파일 목록 개방']],
      relation:['RELATION TRACE MATRIX','관계 추적 행렬 전개',['중심 기관 확인: U.A.C','연결 세력 조회','감시/협력/적대 경로 분리']],
      'zone-map':['REGIONAL SURFACE LINK','권역 관제면 연결',['감시망 수신','좌표면 정렬','오염권·봉쇄선 레이어 대기']],
      'archive-entry':['ARCHIVE SURFACE OPEN','기록 보관면 개방',['색인 잠금 해제','문서 상태 대조','열람 가능 기록 정렬']]
    };
    function ensureMenuLoader(){
      let el=document.querySelector('.pc551-menu-loader');
      if(el) return el;
      el=document.createElement('div');
      el.className='pc551-menu-loader';
      el.innerHTML='<div class="pc551-menu-box"><b></b><em></em><div class="pc551-menu-lines"></div><i></i></div>';
      document.body.appendChild(el);
      return el;
    }
    let menuTimer=null;
    function showMenuLoader(id){
      const data=menuFx[id]||['TERMINAL PANEL SYNC','터미널 표시면 동기화',['화면 모드 확인','표시 옵션 동기화','서버 표면 개방']];
      const el=ensureMenuLoader();
      el.querySelector('b').textContent=data[0];
      el.querySelector('em').textContent=data[1];
      el.querySelector('.pc551-menu-lines').innerHTML=data[2].map(t=>'<span>'+esc(t)+'</span>').join('');
      clearTimeout(menuTimer);
      el.classList.remove('hide');
      el.classList.add('show');
      menuTimer=setTimeout(()=>{el.classList.add('hide'); setTimeout(()=>el.classList.remove('show','hide'),260);},780);
    }
    document.querySelectorAll('.side-menu a[data-target]').forEach(a=>{
      if(a.dataset.pc551MenuFx) return;
      a.dataset.pc551MenuFx='1';
      a.addEventListener('click',()=>showMenuLoader(a.dataset.target),true);
    });

    // Robust marker detail-card recovery. Runs after older map handlers so the server-style card stays visible.
    function linkedRecords(records){
      const parts=String(records||'지역지도').split('/').map(s=>s.trim()).filter(Boolean).slice(0,5);
      return parts.length?parts:['지역지도'];
    }
    function detailFromElement(el){
      if(!el) return;
      const panel=el.closest('.continent-panel');
      if(!panel) return;
      const card=panel.querySelector('.map-detail-card');
      if(!card) return;
      const code=el.getAttribute('data-code')||'NO-CODE';
      const visual=el.getAttribute('data-visual')||el.getAttribute('data-filter')||'관제 표식';
      const title=el.getAttribute('data-title')||'U.A.C 관제 기록';
      const status=el.getAttribute('data-status')||'상태 기록 없음';
      const role=el.getAttribute('data-role')||'node';
      const records=el.getAttribute('data-records')||'지역지도';
      const surface=/해상|항로|연안|항만|maritime|sea/i.test([title,visual,role,status,records].join(' '))?'해상/항로':'육상/권역';
      card.classList.add('detail-v3','detail-551');
      card.innerHTML='<div class="detail-code-row"><span class="detail-code">'+esc(code)+'</span><span class="detail-type">'+esc(visual)+'</span></div>'+ 
        '<b>'+esc(title)+'</b><p class="detail-status">'+esc(status)+'</p>'+ 
        '<div class="detail-grid"><i>역할</i><b>'+esc(role)+'</b><i>표면</i><b>'+esc(surface)+'</b><i>관측</i><b>FIELD REVIEW</b><i>동기화</i><b>MAP PATCH 5.5.1</b></div>'+ 
        '<div class="linked-records">'+linkedRecords(records).map(r=>'<span>'+esc(r)+'</span>').join('')+'</div>';
    }
    if(shell){
      shell.addEventListener('click',e=>{
        const el=e.target.closest('[data-map-item]');
        if(el) setTimeout(()=>detailFromElement(el),35);
      },false);
      shell.addEventListener('keydown',e=>{
        if(e.key!=='Enter'&&e.key!==' ') return;
        const el=e.target.closest('[data-map-item]');
        if(el) setTimeout(()=>detailFromElement(el),35);
      },false);
      setTimeout(()=>{
        shell.querySelectorAll('.continent-panel').forEach(panel=>{
          const first=panel.querySelector('[data-map-item]');
          if(first) detailFromElement(first);
        });
      },650);
    }
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch551:'Tactical Map QA'});

// PATCH 5.5.2 — MapCoordinateViewportQA / all-region fixed 16:9 basemap alignment.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const shell=document.querySelector('.continental-map-shell.datamap-v3');
    if(!shell) return;
    shell.classList.add('map-patch552');
    const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const regionNames={world:'세계',east:'동아시아',europe:'유럽',north:'북미',southasia:'남아시아',seindian:'동남아·인도양',oceania:'오세아니아',mideast:'중동',africa:'아프리카'};
    const regionMode={world:'전역 축약 관제',east:'동아시아 고정 좌표면',europe:'유럽 고정 좌표면',north:'북미 고정 좌표면',southasia:'남아시아 고정 좌표면',seindian:'동남아·인도양 고정 좌표면',oceania:'오세아니아 고정 좌표면',mideast:'중동 고정 좌표면',africa:'아프리카 고정 좌표면'};
    function activePanel(){return shell.querySelector('.continent-panel.active')||shell.querySelector('.continent-panel');}
    function getRegion(panel){return panel?.dataset.continentPanel || 'world';}
    function coordStatus(el){return el.getAttribute('data-qa') || 'REVIEWED';}
    function surfaceOf(el){return el.getAttribute('data-surface') || (/해상|항로|항만|연안|sea|maritime/i.test([el.getAttribute('data-title'),el.getAttribute('data-status'),el.getAttribute('data-role')].join(' '))?'해상/항만':'육상/권역');}
    function locationOf(el){return el.getAttribute('data-location') || regionNames[getRegion(el.closest('.continent-panel'))] || '권역 관제면';}
    function linked(records){
      const arr=String(records||'지역지도').split('/').map(v=>v.trim()).filter(Boolean).slice(0,5);
      return arr.length?arr:['지역지도'];
    }
    function writeCardFromMarker(el){
      if(!el) return;
      const panel=el.closest('.continent-panel'); if(!panel) return;
      const card=panel.querySelector('.map-detail-card'); if(!card) return;
      const region=getRegion(panel);
      const code=el.getAttribute('data-code')||'NO-CODE';
      const visual=el.getAttribute('data-visual')||el.getAttribute('data-filter')||'관제 표식';
      const title=el.getAttribute('data-title')||'U.A.C 관제 기록';
      const status=el.getAttribute('data-status')||'상태 기록 없음';
      const role=el.getAttribute('data-role')||'node';
      const records=el.getAttribute('data-records')||'지역지도';
      const qa=coordStatus(el);
      const qaCls=qa==='REVIEWED'?'qa-ok':'qa-review';
      card.classList.add('detail-v3','detail-551','detail-552');
      card.innerHTML='<div class="detail-code-row"><span class="detail-code">'+esc(code)+'</span><span class="detail-type">'+esc(visual)+'</span></div>'+ 
        '<b>'+esc(title)+'</b><p class="detail-status">'+esc(status)+'</p>'+ 
        '<div class="detail-grid detail-grid-552">'+
          '<i>권역</i><b>'+esc(regionNames[region]||region)+'</b>'+
          '<i>역할</i><b>'+esc(role)+'</b>'+
          '<i>표면</i><b>'+esc(surfaceOf(el))+'</b>'+
          '<i>위치 판정</i><b>'+esc(locationOf(el))+'</b>'+
          '<i>좌표 상태</i><b class="'+qaCls+'">'+esc(qa)+'</b>'+
          '<i>동기화</i><b>MAP PATCH 5.5.2</b>'+
        '</div>'+ 
        '<div class="linked-records">'+linked(records).map(r=>'<span>'+esc(r)+'</span>').join('')+'</div>';
    }
    function findMarkerByListItem(li){
      const panel=li.closest('.continent-panel'); if(!panel) return null;
      const text=(li.textContent||'').replace(/\s+/g,' ').trim();
      const markers=Array.from(panel.querySelectorAll('[data-map-item]'));
      return markers.find(el=>text.includes(el.getAttribute('data-title')||'') || text.includes(el.getAttribute('data-code')||'NO-CODE')) || markers[0] || null;
    }
    // Make every active-region marker carry visible QA hints for debug mode.
    function decorateMarkers(){
      shell.querySelectorAll('[data-map-item]').forEach(el=>{
        const panel=el.closest('.continent-panel');
        const region=getRegion(panel);
        if(!el.getAttribute('data-region')) el.setAttribute('data-region',region);
        if(!el.getAttribute('data-qa')) el.setAttribute('data-qa','REVIEWED');
        if(!el.getAttribute('data-surface')) el.setAttribute('data-surface',surfaceOf(el));
        if(!el.getAttribute('data-location')) el.setAttribute('data-location',locationOf(el));
        el.setAttribute('data-qa-label',(regionNames[region]||region)+' / '+surfaceOf(el)+' / '+coordStatus(el));
      });
    }
    function ensureAuditPanel(){
      let panel=shell.querySelector('.pc552-audit-panel');
      if(panel) return panel;
      panel=document.createElement('div');
      panel.className='pc552-audit-panel';
      panel.innerHTML='<b>MARKER QA</b><span data-pc552-audit-region>권역</span><span data-pc552-audit-surface>표면</span><span data-pc552-audit-status>좌표 상태</span>';
      shell.appendChild(panel);
      return panel;
    }
    function updateAuditPanel(el){
      const panel=ensureAuditPanel();
      const reg=el?regionNames[getRegion(el.closest('.continent-panel'))]:'권역';
      panel.querySelector('[data-pc552-audit-region]').textContent='권역: '+reg;
      panel.querySelector('[data-pc552-audit-surface]').textContent='표면: '+(el?surfaceOf(el):'대기');
      panel.querySelector('[data-pc552-audit-status]').textContent='좌표 상태: '+(el?coordStatus(el):'대기');
    }
    shell.addEventListener('click',e=>{
      const marker=e.target.closest('[data-map-item]');
      if(marker){ setTimeout(()=>{decorateMarkers(); writeCardFromMarker(marker); updateAuditPanel(marker);},55); return; }
      const li=e.target.closest('.continent-point');
      if(li){ setTimeout(()=>{const m=findMarkerByListItem(li); if(m){writeCardFromMarker(m); updateAuditPanel(m);}},60); }
    },false);
    shell.addEventListener('mouseover',e=>{
      const marker=e.target.closest('[data-map-item]'); if(marker) updateAuditPanel(marker);
    },false);
    shell.querySelectorAll('.continent-tab').forEach(btn=>{
      btn.addEventListener('click',()=>setTimeout(()=>{
        decorateMarkers();
        const p=activePanel();
        const frame=p?.querySelector('.continent-map-frame');
        if(frame){ frame.classList.add('pc552-region-fixed'); frame.dataset.qaSurface=regionMode[getRegion(p)]||'고정 좌표면'; }
        const first=p?.querySelector('[data-map-item]'); if(first){ writeCardFromMarker(first); updateAuditPanel(first); }
      },140),true);
    });
    // Reassert all map surfaces after old handlers finish.
    setTimeout(()=>{
      decorateMarkers();
      shell.querySelectorAll('.continent-map-frame').forEach(frame=>{
        frame.classList.add('pc552-region-fixed');
        const panel=frame.closest('.continent-panel');
        frame.dataset.qaSurface=regionMode[getRegion(panel)]||'고정 좌표면';
      });
      const first=activePanel()?.querySelector('[data-map-item]');
      if(first){ writeCardFromMarker(first); updateAuditPanel(first); }
    },900);
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch552:'Map Coordinate Viewport QA'});


// PATCH 5.5.3 — MapProjectionMarkerRebuild / geo-frame projection + marker audit detail.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const shell=document.querySelector('.continental-map-shell.datamap-v3');
    if(!shell) return;
    shell.classList.add('map-patch553');
    const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const regionNames={world:'세계',east:'동아시아',europe:'유럽',north:'북미',southasia:'남아시아',seindian:'동남아·인도양',oceania:'오세아니아',mideast:'중동',africa:'아프리카'};
    const regionFrame={
      world:'전역 지오 프레임 / 대륙 절단 방지', east:'동아시아 지오 프레임 / 한반도·일본·중국 동부 정렬', europe:'유럽 지오 프레임 / 북해·발트·중부유럽 정렬', north:'북미 지오 프레임 / 알래스카·캐나다·오대호 포함', southasia:'남아시아 지오 프레임 / 인도권 정렬', seindian:'동남아·인도양 지오 프레임 / 해협·항로 정렬', oceania:'오세아니아 지오 프레임 / 호주·뉴질랜드 정렬', mideast:'중동 지오 프레임 / 수에즈·홍해·메소포타미아 정렬', africa:'아프리카 지오 프레임 / 북아프리카·사헬·동아프리카 정렬'
    };
    function panelOf(el){return el?.closest?.('.continent-panel')||shell.querySelector('.continent-panel.active')||shell.querySelector('.continent-panel');}
    function regionOf(el){return panelOf(el)?.dataset.continentPanel||'world';}
    function linked(records){const arr=String(records||'지역지도').split('/').map(v=>v.trim()).filter(Boolean).slice(0,5); return arr.length?arr:['지역지도'];}
    function surfaceOf(el){return el.getAttribute('data-surface') || (/해상|항로|항만|연안|sea|maritime/i.test([el.getAttribute('data-title'),el.getAttribute('data-status'),el.getAttribute('data-role')].join(' '))?'해상/항만':'육상/권역');}
    function locOf(el){return el.getAttribute('data-location') || regionFrame[regionOf(el)] || '권역 관제면';}
    function qaOf(el){return el.getAttribute('data-qa') || 'REVIEWED';}
    function coordOf(el){
      const lat=el.getAttribute('data-lat'), lon=el.getAttribute('data-lon');
      if(lat && lon) return '위도 '+Number(lat).toFixed(4)+' / 경도 '+Number(lon).toFixed(4);
      return '선형/권역 좌표';
    }
    function projOf(el){return el.getAttribute('data-proj') || '투영 좌표 대기';}
    function codeOf(el){return el.getAttribute('data-code') || 'NO-CODE';}
    function writeCard(el){
      if(!el) return;
      const panel=panelOf(el), card=panel?.querySelector('.map-detail-card');
      if(!card) return;
      const region=regionOf(el);
      const visual=el.getAttribute('data-visual')||el.getAttribute('data-filter')||'관제 표식';
      const title=el.getAttribute('data-title')||'U.A.C 관제 기록';
      const status=el.getAttribute('data-status')||'상태 기록 없음';
      const role=el.getAttribute('data-role')||'node';
      const records=el.getAttribute('data-records')||'지역지도';
      const qa=qaOf(el); const qaCls=qa==='REVIEWED'?'qa-ok':(qa==='OUT OF REGION'||qa==='SURFACE MISMATCH'?'qa-bad':'qa-review');
      card.classList.add('detail-v3','detail-551','detail-552','detail-553');
      card.innerHTML='<div class="detail-code-row"><span class="detail-code">'+esc(codeOf(el))+'</span><span class="detail-type">'+esc(visual)+'</span></div>'+ 
        '<b>'+esc(title)+'</b><p class="detail-status">'+esc(status)+'</p>'+ 
        '<div class="detail-grid detail-grid-552 detail-grid-553">'+
          '<i>권역</i><b>'+esc(regionNames[region]||region)+'</b>'+ 
          '<i>역할</i><b>'+esc(role)+'</b>'+ 
          '<i>표면</i><b>'+esc(surfaceOf(el))+'</b>'+ 
          '<i>위치 판정</i><b>'+esc(locOf(el))+'</b>'+ 
          '<i>위경도</i><b>'+esc(coordOf(el))+'</b>'+ 
          '<i>투영좌표</i><b>'+esc(projOf(el))+'</b>'+ 
          '<i>좌표 상태</i><b class="'+qaCls+'">'+esc(qa)+'</b>'+ 
          '<i>동기화</i><b>MAP PATCH 5.5.3</b>'+ 
        '</div>'+ 
        '<div class="linked-records">'+linked(records).map(r=>'<span>'+esc(r)+'</span>').join('')+'</div>';
    }
    function ensureAudit(){
      let p=shell.querySelector('.pc553-audit-panel');
      if(p) return p;
      p=document.createElement('div'); p.className='pc553-audit-panel';
      p.innerHTML='<b>GEO PROJECTION QA</b><span data-audit-region>권역</span><span data-audit-coord>위경도</span><span data-audit-proj>투영좌표</span><span data-audit-surface>표면</span><span data-audit-status>좌표상태</span>';
      shell.appendChild(p); return p;
    }
    function updateAudit(el){
      const p=ensureAudit();
      const region=el?regionOf(el):((shell.querySelector('.continent-panel.active')||{}).dataset?.continentPanel||'world');
      p.querySelector('[data-audit-region]').textContent='권역: '+(regionNames[region]||region);
      p.querySelector('[data-audit-coord]').textContent='위경도: '+(el?coordOf(el):'대기');
      p.querySelector('[data-audit-proj]').textContent='투영좌표: '+(el?projOf(el):'대기');
      p.querySelector('[data-audit-surface]').textContent='표면: '+(el?surfaceOf(el):'대기');
      p.querySelector('[data-audit-status]').textContent='좌표 상태: '+(el?qaOf(el):'대기');
    }
    function decorateFrames(){
      shell.querySelectorAll('.continent-map-frame').forEach(frame=>{
        const r=frame.closest('.continent-panel')?.dataset.continentPanel||'world';
        frame.classList.add('pc553-geoframe');
        frame.dataset.qaSurface=regionFrame[r]||'지오 프레임 좌표면';
      });
    }
    function decorateMarkers(){
      shell.querySelectorAll('[data-map-item]').forEach(el=>{
        const region=regionOf(el);
        if(!el.getAttribute('data-region')) el.setAttribute('data-region',region);
        if(!el.getAttribute('data-qa')) el.setAttribute('data-qa','REVIEWED');
        el.setAttribute('data-qa-label',(regionNames[region]||region)+' / '+surfaceOf(el)+' / '+qaOf(el));
      });
    }
    shell.addEventListener('click',e=>{
      const el=e.target.closest('[data-map-item]');
      if(el) setTimeout(()=>{decorateMarkers(); writeCard(el); updateAudit(el);},90);
    },false);
    shell.addEventListener('mouseover',e=>{
      const el=e.target.closest('[data-map-item]'); if(el) updateAudit(el);
    },false);
    shell.querySelectorAll('.continent-tab').forEach(btn=>{
      btn.addEventListener('click',()=>setTimeout(()=>{decorateFrames(); decorateMarkers(); const first=panelOf(shell.querySelector('.continent-panel.active'))?.querySelector('[data-map-item]'); if(first){writeCard(first); updateAudit(first);} else updateAudit(null);},220),true);
    });
    setTimeout(()=>{decorateFrames(); decorateMarkers(); const first=(shell.querySelector('.continent-panel.active')||shell).querySelector('[data-map-item]'); if(first){writeCard(first); updateAudit(first);} else updateAudit(null);},1050);
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch553:'Geo Projection Marker Rebuild'});


// PATCH 5.5.3B — Viewport Bleed Continuation / no black empty margins.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const shell=document.querySelector('.continental-map-shell.datamap-v3');
    if(!shell) return;
    shell.classList.add('map-patch553b');
    function ensureBleed(frame){
      if(!frame || frame.querySelector('.pc553-bleed-map')) return;
      const main=frame.querySelector('.continent-map-img');
      if(!main) return;
      const bleed=document.createElement('img');
      bleed.className='pc553-bleed-map';
      bleed.alt='';
      bleed.setAttribute('aria-hidden','true');
      bleed.src=main.currentSrc || main.src;
      bleed.dataset.bleedSource='same-map-overscan';
      frame.insertBefore(bleed, main);
      frame.classList.add('pc553-bleed-ready');
    }
    function ensureAll(){shell.querySelectorAll('.continent-map-frame').forEach(ensureBleed);}
    ensureAll();
    shell.querySelectorAll('.continent-tab').forEach(btn=>btn.addEventListener('click',()=>setTimeout(ensureAll,90),true));
    const obs=new MutationObserver(()=>ensureAll());
    obs.observe(shell,{subtree:true,childList:true});
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch553b:'Viewport Bleed Continuation'});


// PATCH 5.5.4 — MapViewportMarkerStackQA / marker stack selection + viewport usability.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const shell=document.querySelector('.continental-map-shell.datamap-v3');
    if(!shell) return;
    shell.classList.add('map-patch554');
    const W=1600, H=900;
    const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    let suppressStack=false;

    function activePanel(){return shell.querySelector('.continent-panel.active')||shell.querySelector('.continent-panel');}
    function frameOf(panel){return panel?.querySelector?.('.continent-map-frame')||null;}
    function scaleOf(frame){const v=parseFloat(getComputedStyle(frame).getPropertyValue('--map-scale')); return Number.isFinite(v)&&v>0?v:1;}
    function stageOf(frame){const n=parseInt(frame?.dataset?.zoomStage||'1',10); return Number.isFinite(n)?Math.max(1,Math.min(5,n)):1;}
    function filterOf(){return shell.dataset.filter||'all';}
    function parseProj(el){
      const raw=el.getAttribute('data-proj')||'';
      const m=raw.match(/X\s*(-?\d+(?:\.\d+)?)\s*\/\s*Y\s*(-?\d+(?:\.\d+)?)/i);
      if(m) return {x:+m[1],y:+m[2]};
      try{
        if(typeof el.getBBox==='function'){
          const b=el.getBBox();
          if(Number.isFinite(b.x+b.width+b.y+b.height)) return {x:b.x+b.width/2,y:b.y+b.height/2};
        }
      }catch(_e){}
      return null;
    }
    function markerTitle(el){return el.getAttribute('data-title')||el.getAttribute('data-code')||'U.A.C 관제 기록';}
    function markerCode(el){return el.getAttribute('data-code')||'NO-CODE';}
    function markerType(el){return el.getAttribute('data-visual')||el.getAttribute('data-filter')||'관제 표식';}
    function priorityOf(el){
      const f=el.getAttribute('data-filter')||'';
      const z=el.getAttribute('data-zone')||'';
      const t=[f,z,markerTitle(el),markerType(el),el.getAttribute('data-status')||''].join(' ');
      if(/black|블랙존|red|레드존/.test(t)) return 1;
      if(/blockade-node|facility|봉쇄 거점|작전 시설|통제|검문|허브/.test(t)) return 2;
      if(/incident|사건/.test(t)) return 3;
      if(/anomaly|현상/.test(t)) return 4;
      return 5;
    }
    function visibleByFilter(el){
      const f=filterOf();
      const ef=el.getAttribute('data-filter')||'';
      const z=el.getAttribute('data-zone')||'';
      if(f==='all') return true;
      if(f.startsWith('zone-')) return ef==='zone' && z===f.replace('zone-','');
      return ef===f;
    }
    function isSelectable(el){
      if(!el || !el.matches || !el.matches('[data-map-item]')) return false;
      const p=parseProj(el); if(!p) return false;
      return true;
    }
    function markers(panel){
      return Array.from(panel.querySelectorAll('[data-map-item]')).filter(isSelectable).map(el=>({el,p:parseProj(el),priority:priorityOf(el)}));
    }
    function stackThreshold(frame){
      const s=scaleOf(frame);
      return Math.max(12, 38 / Math.max(1,s));
    }
    function nearbyGroup(target){
      const panel=target.closest('.continent-panel');
      const frame=frameOf(panel); if(!panel||!frame) return [target];
      const t=parseProj(target); if(!t) return [target];
      const th=stackThreshold(frame);
      const arr=markers(panel).filter(o=>visibleByFilter(o.el)).filter(o=>Math.hypot(o.p.x-t.x,o.p.y-t.y)<=th);
      arr.sort((a,b)=>a.priority-b.priority || markerCode(a.el).localeCompare(markerCode(b.el)));
      return arr.map(o=>o.el);
    }
    function buildGroups(panel){
      const frame=frameOf(panel); if(!frame) return [];
      const th=stackThreshold(frame);
      const pool=markers(panel).filter(o=>visibleByFilter(o.el));
      const used=new Set(), groups=[];
      for(const item of pool){
        if(used.has(item.el)) continue;
        const group=[];
        for(const other of pool){
          if(used.has(other.el)) continue;
          if(Math.hypot(other.p.x-item.p.x,other.p.y-item.p.y)<=th){ group.push(other); }
        }
        group.forEach(o=>used.add(o.el));
        group.sort((a,b)=>a.priority-b.priority || markerCode(a.el).localeCompare(markerCode(b.el)));
        groups.push(group);
      }
      return groups;
    }
    function ensureStackPanel(frame){
      let p=frame.querySelector('.pc554-stack-panel');
      if(p) return p;
      p=document.createElement('div');
      p.className='pc554-stack-panel';
      p.innerHTML='<div class="pc554-stack-head"><b>MARKER STACK DETECTED</b><button type="button" aria-label="닫기">×</button></div><div class="pc554-stack-sub">중첩 좌표 선택</div><div class="pc554-stack-list"></div>';
      p.querySelector('button').addEventListener('click',()=>p.classList.remove('show'));
      frame.appendChild(p);
      return p;
    }
    function appendStackState(el, group){
      const panel=el.closest('.continent-panel'); const card=panel?.querySelector?.('.map-detail-card');
      if(!card) return;
      let state=card.querySelector('.pc554-stack-state');
      if(!state){ state=document.createElement('div'); state.className='pc554-stack-state'; card.appendChild(state); }
      const idx=Math.max(1, group.indexOf(el)+1);
      state.innerHTML='<i>중첩 상태</i><b>'+ (group.length>1 ? 'STACKED / '+group.length+' RECORDS · SELECTED '+idx : 'SINGLE MARKER') +'</b>';
      card.classList.add('detail-554');
    }
    function openMarker(el, group){
      suppressStack=true;
      try{ el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window})); }catch(_e){}
      setTimeout(()=>{ appendStackState(el, group||[el]); suppressStack=false; },160);
    }
    function showStackPanel(frame, group){
      const panel=ensureStackPanel(frame);
      const list=panel.querySelector('.pc554-stack-list');
      const sub=panel.querySelector('.pc554-stack-sub');
      if(sub) sub.textContent='중첩 좌표 '+group.length+'건 감지 / 선택 후 상세 패널 호출';
      list.innerHTML='';
      group.forEach((el,i)=>{
        const btn=document.createElement('button');
        btn.type='button';
        btn.innerHTML='<span>'+esc(markerCode(el))+'</span><b>'+esc(markerTitle(el))+'</b><em>'+esc(markerType(el))+'</em>';
        btn.addEventListener('click',e=>{e.preventDefault(); e.stopPropagation(); panel.classList.remove('show'); openMarker(el,group);});
        list.appendChild(btn);
      });
      panel.classList.add('show');
    }
    function ensureClusterLayer(frame){
      let layer=frame.querySelector('.pc554-cluster-layer');
      if(layer) return layer;
      layer=document.createElement('div'); layer.className='pc554-cluster-layer';
      frame.appendChild(layer); return layer;
    }
    function renderClusters(panel){
      const frame=frameOf(panel); if(!frame) return;
      ensureHitAreas(panel);
      ensureUrbanLod(frame);
      const layer=ensureClusterLayer(frame);
      const groups=buildGroups(panel);
      layer.innerHTML='';
      let stackCount=0;
      groups.forEach((group,idx)=>{
        if(group.length<2) return;
        stackCount++;
        const avg=group.reduce((acc,o)=>{acc.x+=o.p.x;acc.y+=o.p.y;return acc;},{x:0,y:0});
        avg.x/=group.length; avg.y/=group.length;
        const btn=document.createElement('button');
        btn.type='button'; btn.className='pc554-cluster-badge'; btn.textContent='+'+group.length;
        btn.style.left=(avg.x/W*100).toFixed(3)+'%'; btn.style.top=(avg.y/H*100).toFixed(3)+'%';
        btn.dataset.stackSize=String(group.length);
        btn.addEventListener('click',e=>{e.preventDefault(); e.stopPropagation(); showStackPanel(frame, group.map(o=>o.el)); updateStackAudit(group.map(o=>o.el));});
        layer.appendChild(btn);
      });
      frame.dataset.stackCount=String(stackCount);
      updateStackAudit(null);
    }
    function ensureHitAreas(panel){
      const svgNS='http://www.w3.org/2000/svg';
      markers(panel).forEach(({el,p})=>{
        if(el.querySelector('.pc554-hit-area')) return;
        const f=el.getAttribute('data-filter')||'';
        if(f==='zone' || f==='blockade') return;
        const c=document.createElementNS(svgNS,'circle');
        c.setAttribute('class','pc554-hit-area');
        c.setAttribute('cx',p.x.toFixed(1)); c.setAttribute('cy',p.y.toFixed(1)); c.setAttribute('r','20');
        try{el.insertBefore(c,el.firstChild);}catch(_e){el.appendChild(c);}
      });
    }
    function ensureUrbanLod(frame){
      if(frame.querySelector('.pc554-urban-lod')) return;
      const d=document.createElement('div'); d.className='pc554-urban-lod';
      d.innerHTML='<i></i><i></i><i></i>';
      frame.appendChild(d);
    }
    function ensureAudit(){
      let p=shell.querySelector('.pc554-stack-audit');
      if(p) return p;
      p=document.createElement('div'); p.className='pc554-stack-audit';
      p.innerHTML='<b>MARKER STACK QA</b><span data-stack-region>권역</span><span data-stack-zoom>줌</span><span data-stack-count>중첩</span><span data-stack-mode>선택</span>';
      shell.appendChild(p); return p;
    }
    function updateStackAudit(group){
      const p=ensureAudit(); const panel=activePanel(); const frame=frameOf(panel);
      const region=panel?.dataset?.continentPanel||'world';
      p.querySelector('[data-stack-region]').textContent='권역: '+region;
      p.querySelector('[data-stack-zoom]').textContent='줌: ZOOM '+stageOf(frame);
      p.querySelector('[data-stack-count]').textContent='중첩 그룹: '+(frame?.dataset?.stackCount||'0');
      p.querySelector('[data-stack-mode]').textContent='선택: '+(group&&group.length>1?'목록 모드 '+group.length+'건':'단일/대기');
    }
    function refresh(){
      const panel=activePanel(); if(!panel) return;
      renderClusters(panel);
      updateStackAudit(null);
    }
    shell.addEventListener('click',e=>{
      const el=e.target.closest('[data-map-item]');
      if(!el || suppressStack) return;
      const group=nearbyGroup(el);
      setTimeout(()=>appendStackState(el,group),190);
      if(group.length>1){
        const frame=frameOf(el.closest('.continent-panel'));
        setTimeout(()=>{showStackPanel(frame,group); updateStackAudit(group);},80);
      }
    },true);
    shell.addEventListener('mouseover',e=>{
      const el=e.target.closest('[data-map-item]');
      if(!el) return;
      const group=nearbyGroup(el); updateStackAudit(group);
    },true);
    shell.addEventListener('click',e=>{
      if(e.target.closest('.continent-tab,.continent-filter,.map-viewport-tools button')) setTimeout(refresh,180);
    },true);
    shell.addEventListener('wheel',()=>{
      if(shell.classList.contains('map-fast-nav')) return;
      clearTimeout(shell._pc554WheelRefresh);
      shell._pc554WheelRefresh=setTimeout(refresh,300);
    },{passive:true});
    const obs=new MutationObserver(muts=>{
      if(muts.some(m=>m.type==='attributes' && (m.attributeName==='data-zoom-stage'||m.attributeName==='class'))){
        clearTimeout(shell._pc554MutationRefresh);
        shell._pc554MutationRefresh=setTimeout(refresh,180);
      }
    });
    shell.querySelectorAll('.continent-map-frame').forEach(frame=>obs.observe(frame,{attributes:true,attributeFilter:['data-zoom-stage','class']}));
    setTimeout(refresh,1200);
    setTimeout(refresh,2200);
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch554:'Map Viewport Marker Stack QA'});

// PATCH 5.5.5 — MapVisualLayerCleanupQA
// Keeps helper LOD blocks out of overview zoom, clarifies that they are non-clickable visual layers,
// and records visual-layer QA state without touching archive/faction/F.H.C/video/entity features.
document.addEventListener('DOMContentLoaded', function(){
  const shell = document.querySelector('.continental-map-shell.datamap-v3');
  if(!shell) return;
  shell.classList.add('map-patch555');
  function activePanel(){ return shell.querySelector('.continent-panel.active') || shell.querySelector('.continent-panel'); }
  function frameOf(panel){ return panel ? panel.querySelector('.continent-map-frame') : null; }
  function zoomOf(frame){ return frame ? String(frame.dataset.zoomStage || frame.dataset.pc55Stage || '1') : '1'; }
  function filterOf(){ return shell.dataset.filter || 'all'; }
  function regionOf(panel){ return (panel && panel.dataset && panel.dataset.continentPanel) || 'world'; }
  const regionNames={world:'세계',east:'동아시아',europe:'유럽',north:'북미',southasia:'남아시아',seindian:'동남아·인도양',oceania:'오세아니아',mideast:'중동',africa:'아프리카'};
  function ensureLegend(frame){
    if(!frame) return null;
    let el=frame.querySelector('.pc555-helper-legend');
    if(el) return el;
    el=document.createElement('div');
    el.className='pc555-helper-legend';
    el.innerHTML='<b>VISUAL HELPER LAYER</b><span>보조 관제 블록 · 실제 마커 아님</span>';
    frame.appendChild(el);
    return el;
  }
  function ensureAudit(){
    let el=shell.querySelector('.pc555-visual-audit');
    if(el) return el;
    el=document.createElement('div');
    el.className='pc555-visual-audit';
    el.innerHTML='<b>VISUAL LAYER QA</b><span data-vqa-region>권역</span><span data-vqa-zoom>줌</span><span data-vqa-filter>필터</span><span data-vqa-helper>보조 레이어</span>';
    shell.appendChild(el);
    return el;
  }
  function tagHelpers(frame){
    if(!frame) return;
    frame.querySelectorAll('.pc55-block,.pc554-urban-lod').forEach(function(el){
      el.setAttribute('aria-hidden','true');
      el.setAttribute('data-helper-layer','visual-only');
      el.setAttribute('title','보조 관제 레이어 / 실제 마커 아님');
      el.style.pointerEvents='none';
    });
  }
  function refresh(){
    const panel=activePanel(); const frame=frameOf(panel); if(!frame) return;
    ensureLegend(frame);
    tagHelpers(frame);
    const z=parseInt(zoomOf(frame),10)||1;
    frame.dataset.visualHelperMode = z>=4 ? (filterOf()==='facility'?'facility-focus':'detail-only') : 'hidden-overview';
    const audit=ensureAudit();
    const helperText = z>=4 ? (filterOf()==='facility' ? '시설 필터 강조 / 클릭 불가' : '상세 줌에서만 약하게 표시 / 클릭 불가') : 'ZOOM 1~2 숨김';
    const region = regionNames[regionOf(panel)] || regionOf(panel);
    audit.querySelector('[data-vqa-region]').textContent='권역: '+region;
    audit.querySelector('[data-vqa-zoom]').textContent='줌: ZOOM '+z;
    audit.querySelector('[data-vqa-filter]').textContent='필터: '+filterOf();
    audit.querySelector('[data-vqa-helper]').textContent='보조 레이어: '+helperText;
  }
  shell.addEventListener('click', function(e){
    if(e.target.closest('.continent-tab,.continent-filter,.map-viewport-tools button,.pc554-cluster-badge,.pc554-stack-list button')){
      setTimeout(refresh, 80);
      setTimeout(refresh, 240);
    }
  }, true);
  shell.addEventListener('wheel', function(){ setTimeout(refresh, 120); }, {passive:true});
  const mo=new MutationObserver(function(muts){
    if(muts.some(function(m){ return m.type==='attributes' && /data-zoom-stage|data-pc55-stage|class/.test(m.attributeName||''); })){
      clearTimeout(shell._pc555VisualRefresh);
      shell._pc555VisualRefresh=setTimeout(refresh, 140);
    }
  });
  shell.querySelectorAll('.continent-map-frame,.continent-panel').forEach(function(el){
    mo.observe(el,{attributes:true,attributeFilter:['data-zoom-stage','data-pc55-stage','class']});
  });
  setTimeout(refresh, 400);
  setTimeout(refresh, 1400);
});

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch555:'Map Visual Layer Cleanup QA'});


// PATCH 5.5.6 — MapPerformanceMarkerFineTuneQA
// Performance-first patch: reduces zoom/drag overlay spam, pauses heavy visual layers during navigation,
// adds lightweight GEO/PERFORMANCE QA, and keeps marker fine-tune metadata visible without touching other menus.
document.addEventListener('DOMContentLoaded', function(){
  const shell=document.querySelector('.continental-map-shell.datamap-v3');
  if(!shell) return;
  shell.classList.add('map-patch556');
  const regionNames={world:'세계',east:'동아시아',europe:'유럽',north:'북미',southasia:'남아시아',seindian:'동남아·인도양',oceania:'오세아니아',mideast:'중동',africa:'아프리카'};
  let navTimer=0, perfTimer=0, lastFrame=null;
  function activePanel(){return shell.querySelector('.continent-panel.active')||shell.querySelector('.continent-panel');}
  function activeFrame(){return activePanel()?.querySelector?.('.continent-map-frame')||null;}
  function stageOf(frame){return frame ? (frame.dataset.zoomStage||frame.dataset.pc55Stage||'1') : '1';}
  function regionOf(panel){return panel?.dataset?.continentPanel || 'world';}
  function beginFastNav(frame, reason){
    frame=frame||activeFrame();
    lastFrame=frame||lastFrame;
    shell.classList.add('map-fast-nav');
    if(frame) frame.classList.add('pc556-fast-nav');
    if(reason) shell.dataset.perfReason=reason;
    clearTimeout(navTimer);
    navTimer=setTimeout(function(){
      shell.classList.remove('map-fast-nav');
      shell.querySelectorAll('.pc556-fast-nav').forEach(function(f){f.classList.remove('pc556-fast-nav');});
      refreshPerfAudit();
    },220);
  }
  function markerCount(panel){return panel?panel.querySelectorAll('[data-map-item]').length:0;}
  function reviewedCount(panel){return panel?panel.querySelectorAll('[data-map-item][data-qa="REVIEWED"]').length:0;}
  function reviewRequiredCount(panel){return panel?panel.querySelectorAll('[data-map-item][data-qa="REVIEW REQUIRED"], [data-map-item][data-qa="SURFACE MISMATCH"], [data-map-item][data-qa="OUT OF REGION"]').length:0;}
  function ensurePerfAudit(){
    let el=shell.querySelector('.pc556-perf-audit');
    if(el) return el;
    el=document.createElement('div');
    el.className='pc556-perf-audit';
    el.innerHTML='<b>MAP PERFORMANCE QA</b><span data-pqa-region>권역</span><span data-pqa-zoom>줌</span><span data-pqa-marker>마커</span><span data-pqa-mode>렌더</span><span data-pqa-reason>상태</span>';
    shell.appendChild(el);
    return el;
  }
  function refreshPerfAudit(){
    const panel=activePanel(); const frame=activeFrame(); const el=ensurePerfAudit();
    const region=regionNames[regionOf(panel)]||regionOf(panel);
    el.querySelector('[data-pqa-region]').textContent='권역: '+region;
    el.querySelector('[data-pqa-zoom]').textContent='줌: ZOOM '+stageOf(frame);
    el.querySelector('[data-pqa-marker]').textContent='마커: '+markerCount(panel)+' / 확인 '+reviewedCount(panel)+' / 재검수 '+reviewRequiredCount(panel);
    el.querySelector('[data-pqa-mode]').textContent='렌더: '+(shell.classList.contains('map-fast-nav')?'FAST NAV · 상세 레이어 일시 정지':'STABLE · 상세 레이어 복구');
    el.querySelector('[data-pqa-reason]').textContent='상태: '+(shell.dataset.perfReason||'대기');
  }
  function schedulePerfAudit(reason){
    if(reason) shell.dataset.perfReason=reason;
    clearTimeout(perfTimer);
    perfTimer=setTimeout(refreshPerfAudit,160);
  }
  function decorateMarkerFineTune(){
    shell.querySelectorAll('[data-map-item]').forEach(function(el){
      const qa=el.getAttribute('data-qa')||'REVIEWED';
      const surface=el.getAttribute('data-surface')||'';
      const lon=el.getAttribute('data-lon')||'';
      const lat=el.getAttribute('data-lat')||'';
      el.setAttribute('data-pc556-qa', qa);
      el.setAttribute('data-pc556-surface', surface);
      if(lon && lat) el.setAttribute('data-pc556-geo', lat+' / '+lon);
    });
  }
  function ensureGeoCrosshair(frame){
    if(!frame || frame.querySelector('.pc556-geo-crosshair')) return;
    const el=document.createElement('div');
    el.className='pc556-geo-crosshair';
    el.innerHTML='<span></span><i></i><b>GEO QA</b>';
    frame.appendChild(el);
  }
  function ensureAll(){
    shell.querySelectorAll('.continent-map-frame').forEach(ensureGeoCrosshair);
    decorateMarkerFineTune();
    refreshPerfAudit();
  }
  shell.addEventListener('wheel', function(e){
    if(e.target.closest('.continent-map-frame')) beginFastNav(e.target.closest('.continent-map-frame'), '휠 줌 입력 · HUD 축소');
  }, {passive:true, capture:true});
  shell.addEventListener('pointerdown', function(e){
    const frame=e.target.closest('.continent-map-frame');
    if(frame && !e.target.closest('.map-detail-card,.pc554-stack-panel')) beginFastNav(frame, '드래그 준비 · 상세 레이어 일시 정지');
  }, true);
  shell.addEventListener('pointermove', function(e){
    const frame=e.target.closest('.continent-map-frame');
    if(frame && frame.classList.contains('is-dragging')) beginFastNav(frame, '드래그 이동 · 렌더 간소화');
  }, true);
  shell.addEventListener('click', function(e){
    const tool=e.target.closest('.map-viewport-tools button');
    if(tool){ beginFastNav(tool.closest('.continent-map-frame'), '툴 조작 · '+(tool.dataset.mapTool||'view')); schedulePerfAudit('툴 조작 완료 대기'); }
    if(e.target.closest('.continent-tab,.continent-filter')){ schedulePerfAudit('권역/필터 변경'); setTimeout(ensureAll,260); }
    const item=e.target.closest('[data-map-item]');
    if(item){ schedulePerfAudit('마커 선택 · '+(item.getAttribute('data-code')||item.getAttribute('data-title')||'NO-CODE')); }
  }, true);
  const mo=new MutationObserver(function(muts){
    if(muts.some(function(m){return m.type==='attributes' && /data-zoom-stage|data-pc55-stage|class/.test(m.attributeName||'');})){
      schedulePerfAudit('줌/레이어 상태 갱신');
    }
  });
  shell.querySelectorAll('.continent-map-frame,.continent-panel').forEach(function(el){mo.observe(el,{attributes:true,attributeFilter:['data-zoom-stage','data-pc55-stage','class']});});
  ensureAll();
  setTimeout(ensureAll,1200);
});

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch556:'Map Performance + Marker Fine Tune QA'});


// PATCH 5.5.7 — MapTacticalVisualUpgrade
// Visual-only map upgrade. Keeps 5.5.6 as base and does NOT apply the rejected 5.5.6.1 hotfix.
// Adds contamination hatching overlays, surveillance radii, FEEDS panel, satellite/drone links, and marker visual language.
document.addEventListener('DOMContentLoaded', function(){
  const shell=document.querySelector('.continental-map-shell.datamap-v3');
  if(!shell || shell.dataset.patch557Applied) return;
  shell.dataset.patch557Applied='1';
  shell.classList.add('map-patch557');

  const regionNames={world:'세계',east:'동아시아',europe:'유럽',north:'북미',southasia:'남아시아',seindian:'동남아·인도양',oceania:'오세아니아',mideast:'중동',africa:'아프리카'};
  const feedByRegion={
    world:['SATELLITE','FIELD REVIEW','BLOCKADE GRID','REGIONAL RELAY'],
    east:['SATELLITE','HARBOR WATCH','BLOCKADE GRID','DRONE WATCH'],
    europe:['SATELLITE','NORTH SEA FEED','FIELD REVIEW','BLOCKADE GRID'],
    north:['SATELLITE','BOREAL WATCH','FIELD REVIEW','AIR ROUTE'],
    southasia:['SATELLITE','RIVER WATCH','FIELD REVIEW','DRONE WATCH'],
    seindian:['SATELLITE','STRAIT WATCH','SEA LANE','FIELD REVIEW'],
    oceania:['SATELLITE','OUTBACK GRID','SEA WATCH','DRONE WATCH'],
    mideast:['SATELLITE','DESERT WATCH','BLOCKADE GRID','FIELD REVIEW'],
    africa:['SATELLITE','SAHEL WATCH','FIELD REVIEW','SEA WATCH']
  };
  const filterNames={all:'전체 레이어',zone:'오염 구역','zone-red':'레드존','zone-yellow':'옐로우존','zone-green':'그린존','zone-white':'화이트존','zone-black':'블랙존',facility:'작전 시설',anomaly:'현상 기록',incident:'사건 좌표','blockade-node':'봉쇄 거점',blockade:'봉쇄선'};

  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function activePanel(){return shell.querySelector('.continent-panel.active')||shell.querySelector('.continent-panel');}
  function activeFrame(){return activePanel()?.querySelector?.('.continent-map-frame')||null;}
  function regionOf(panel){return panel?.dataset?.continentPanel || 'world';}
  function stageOf(frame){return parseInt(frame?.dataset?.zoomStage || frame?.dataset?.pc55Stage || '1',10)||1;}
  function filterOf(){return shell.dataset.filter || 'all';}
  function parseProj(el){
    const raw=el.getAttribute('data-proj')||'';
    const m=/X\s*(-?\d+(?:\.\d+)?)\s*\/\s*Y\s*(-?\d+(?:\.\d+)?)/i.exec(raw);
    if(m) return [Math.max(0,Math.min(1600,parseFloat(m[1]))), Math.max(0,Math.min(900,parseFloat(m[2])) )];
    try{
      if(typeof el.getBBox==='function'){
        const b=el.getBBox();
        if(isFinite(b.x) && isFinite(b.y)) return [b.x+b.width/2,b.y+b.height/2];
      }
    }catch(e){}
    return null;
  }
  function pct(p){return [p[0]/16,p[1]/9];}
  function markerKind(el){
    const f=el.getAttribute('data-filter')||'';
    const z=el.getAttribute('data-zone')||'';
    const t=[el.getAttribute('data-title'),el.getAttribute('data-visual'),el.getAttribute('data-role'),el.getAttribute('data-surface')].join(' ');
    if(f==='zone' || /^zone-/.test(f) || /레드존|블랙존|옐로우|화이트|그린/.test(t)) return z || (f.replace('zone-','')||'red');
    if(f==='blockade-node' || /게이트|통제 노드|검문/.test(t)) return 'gate';
    if(f==='facility') return 'facility';
    if(f==='anomaly') return 'anomaly';
    if(f==='incident') return 'incident';
    if(f==='blockade' || /봉쇄선|감시권/.test(t)) return 'blockade';
    return f || 'node';
  }
  function ensureFeedsPanel(){
    let panel=shell.querySelector('.pc557-feeds-panel');
    if(panel) return panel;
    panel=document.createElement('aside');
    panel.className='pc557-feeds-panel';
    panel.innerHTML='<div class="pc557-feeds-head"><b>ACTIVE FEEDS</b><span data-pc557-region>REGION</span></div><div class="pc557-feed-list" data-pc557-feeds></div><div class="pc557-feed-metrics"><span data-pc557-filter>FILTER</span><span data-pc557-marker>MARKERS</span><span data-pc557-stage>ZOOM</span></div>';
    shell.appendChild(panel);
    return panel;
  }
  function ensureLegend(){
    let legend=shell.querySelector('.pc557-tactical-legend');
    if(legend) return legend;
    legend=document.createElement('div');
    legend.className='pc557-tactical-legend';
    legend.innerHTML='<b>TACTICAL VISUAL</b><span><i class="rz"></i>해칭 오염권</span><span><i class="rad"></i>감시 반경</span><span><i class="sat"></i>위성/드론 링크</span><span><i class="feed"></i>활성 피드</span>';
    shell.appendChild(legend);
    return legend;
  }
  function ensureViz(frame){
    if(!frame) return null;
    let layer=frame.querySelector('.pc557-tactical-viz');
    if(layer) return layer;
    layer=document.createElement('div');
    layer.className='pc557-tactical-viz';
    layer.setAttribute('aria-hidden','true');
    const lod=frame.querySelector('.pc55-tactical-lod');
    if(lod) lod.appendChild(layer); else frame.insertBefore(layer, frame.querySelector('.map-data-layer'));
    return layer;
  }
  function addDiv(layer,cls,x,y,w,h,text,meta){
    const el=document.createElement('i');
    el.className=cls;
    el.style.left=x+'%'; el.style.top=y+'%';
    if(w!=null) el.style.width=w+'%';
    if(h!=null) el.style.height=h+'%';
    if(text) el.setAttribute('data-label',text);
    if(meta){
      if(meta.code) el.setAttribute('data-node-code',meta.code);
      if(meta.type) el.setAttribute('data-layer-type',meta.type);
      if(meta.kind) el.setAttribute('data-layer-kind',meta.kind);
    }
    layer.appendChild(el);
    return el;
  }
  function addLine(layer,cls,a,b,label,meta){
    const dx=b[0]-a[0], dy=b[1]-a[1];
    const len=Math.sqrt(dx*dx+dy*dy);
    const angle=Math.atan2(dy,dx)*180/Math.PI;
    const el=document.createElement('i');
    el.className='pc557-link '+cls;
    el.style.left=a[0]+'%'; el.style.top=a[1]+'%'; el.style.width=len+'%'; el.style.transform='rotate('+angle+'deg)';
    if(label) el.setAttribute('data-label',label);
    if(meta){
      el.setAttribute('data-layer-type','link');
      if(meta.source) el.setAttribute('data-source-code',meta.source);
      if(meta.target) el.setAttribute('data-target-code',meta.target);
      if(meta.feed) el.setAttribute('data-feed-type',meta.feed);
    }
    layer.appendChild(el);
  }
  function addCard(layer,x,y,code,title,kind){
    const card=document.createElement('span');
    card.className='pc557-mini-card '+(kind||'');
    card.style.left=x+'%'; card.style.top=y+'%';
    card.setAttribute('data-node-code',code||'NODE');
    card.setAttribute('data-layer-type','card');
    card.setAttribute('data-layer-kind',kind||'node');
    card.innerHTML='<b>'+esc(code||'NODE')+'</b><em>'+esc(title||'관제 표식')+'</em>';
    layer.appendChild(card);
  }
  function markerSnapshot(frame){
    const nodes=Array.from(frame.querySelectorAll('[data-map-item]')).map(function(el){
      const p=parseProj(el);
      if(!p) return null;
      const pc=pct(p);
      return {el:el,x:pc[0],y:pc[1],kind:markerKind(el),filter:el.getAttribute('data-filter')||'',zone:el.getAttribute('data-zone')||'',code:el.getAttribute('data-code')||'',title:el.getAttribute('data-title')||'',surface:el.getAttribute('data-surface')||''};
    }).filter(Boolean);
    return nodes;
  }
  function buildViz(frame){
    const layer=ensureViz(frame); if(!layer) return;
    const stage=stageOf(frame);
    layer.innerHTML='';
    const nodes=markerSnapshot(frame);
    const zones=nodes.filter(n=>['red','black','yellow','white','green'].includes(n.kind)).slice(0,9);
    const gates=nodes.filter(n=>n.kind==='gate' || /해상|항만|통제/.test(n.surface)).slice(0,7);
    const facilities=nodes.filter(n=>n.kind==='facility').slice(0,6);
    const anomalies=nodes.filter(n=>n.kind==='anomaly' || n.kind==='incident').slice(0,7);

    zones.forEach(function(n,i){
      const size=(n.kind==='black'?13:(n.kind==='red'?18:(n.kind==='yellow'?15:11))) * (stage>=4?1.07:1);
      addDiv(layer,'pc557-hatch pc557-zone-'+n.kind, n.x-size/2, n.y-size/2, size, size, n.kind.toUpperCase(), {code:n.code,type:'zone',kind:n.kind});
      if(stage>=2) addDiv(layer,'pc557-radius pc557-radius-'+n.kind, n.x-size*.72, n.y-size*.72, size*1.44, size*1.44, 'WATCH', {code:n.code,type:'radius',kind:n.kind});
      if(stage>=3) addCard(layer, Math.min(88,n.x+2), Math.max(4,n.y-4), n.code, n.title, 'zone');
    });
    gates.forEach(function(n,i){
      if(stage>=2) addDiv(layer,'pc557-radius pc557-radius-gate', n.x-5.2, n.y-5.2, 10.4, 10.4, 'GATE', {code:n.code,type:'radius',kind:'gate'});
      if(stage>=4) addCard(layer, Math.min(88,n.x+2), Math.max(5,n.y+2), n.code, n.title, 'gate');
    });
    anomalies.forEach(function(n,i){
      if(stage>=3) addDiv(layer,'pc557-radius pc557-radius-scan', n.x-3.7, n.y-3.7, 7.4, 7.4, 'SCAN', {code:n.code,type:'radius',kind:'scan'});
      if(stage>=5) addCard(layer, Math.min(88,n.x+1.6), Math.max(5,n.y-3), n.code, n.title, 'anomaly');
    });

    const linkSources = zones.concat(gates).concat(facilities).filter(Boolean).slice(0,7);
    for(let i=0;i<linkSources.length-1;i++){
      const a=linkSources[i], b=linkSources[i+1];
      const cls = /해상|항만/.test(a.surface+b.surface) ? 'pc557-link-drone' : (i%2?'pc557-link-sat':'pc557-link-field');
      if(stage>=2) addLine(layer, cls, [a.x,a.y], [b.x,b.y], i%2?'DRONE':'SAT', {source:a.code,target:b.code,feed:(i%2?'DRONE':'SAT')});
    }
    if(stage>=4){
      facilities.forEach(function(n,i){
        addDiv(layer,'pc557-facility-cell', n.x-3.5, n.y-2.5, 7, 5, 'FAC', {code:n.code,type:'facility',kind:'facility'});
      });
    }
    frame.dataset.pc557VisualReady='1';
  }
  function updateFeeds(){
    const panel=ensureFeedsPanel();
    const active=activePanel(); const frame=activeFrame(); const region=regionOf(active);
    const feeds=feedByRegion[region]||feedByRegion.world;
    const count=active ? active.querySelectorAll('[data-map-item]').length : 0;
    const review=active ? active.querySelectorAll('[data-map-item][data-qa="REVIEW REQUIRED"], [data-map-item][data-qa="SURFACE MISMATCH"], [data-map-item][data-qa="OUT OF REGION"]').length : 0;
    const list=panel.querySelector('[data-pc557-feeds]');
    list.innerHTML=feeds.map(function(f,i){
      const ok = review && i===1 ? 'WARN' : 'ONLINE';
      return '<span class="'+(ok==='WARN'?'warn':'')+'"><b>'+esc(f)+'</b><em>'+ok+'</em></span>';
    }).join('');
    panel.querySelector('[data-pc557-region]').textContent=regionNames[region]||region.toUpperCase();
    panel.querySelector('[data-pc557-filter]').textContent='FILTER / '+(filterNames[filterOf()]||filterOf());
    panel.querySelector('[data-pc557-marker]').textContent='MARKERS / '+count+(review?' · REVIEW '+review:'');
    panel.querySelector('[data-pc557-stage]').textContent='ZOOM / '+stageOf(frame);
  }
  function refresh(){
    ensureLegend();
    shell.querySelectorAll('.continent-map-frame').forEach(function(frame){
      buildViz(frame);
      frame.dataset.pc557Stage=stageOf(frame);
    });
    updateFeeds();
  }
  let timer=0;
  function schedule(delay){ clearTimeout(timer); timer=setTimeout(refresh, delay||140); }
  shell.addEventListener('click',function(e){
    if(e.target.closest('.continent-tab,.continent-filter,.map-viewport-tools button,.pc554-cluster-badge,.pc554-stack-list button')) schedule(180);
  },true);
  shell.addEventListener('wheel',function(e){ if(e.target.closest('.continent-map-frame')) schedule(260); },{passive:true});
  const mo=new MutationObserver(function(muts){
    if(muts.some(function(m){return m.type==='attributes' && /data-zoom-stage|data-pc55-stage|class/.test(m.attributeName||'');})) schedule(180);
  });
  shell.querySelectorAll('.continent-map-frame,.continent-panel').forEach(function(el){mo.observe(el,{attributes:true,attributeFilter:['data-zoom-stage','data-pc55-stage','class']});});
  setTimeout(refresh,450);
  setTimeout(refresh,1350);
});

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch557:'Map Tactical Visual Upgrade'});


// PATCH 5.5.8 — MapLayerDeclutterQA / zoom-stage visibility rules and selected marker focus.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const shell=document.querySelector('.continental-map-shell.datamap-v3');
    if(!shell) return;
    shell.classList.add('map-patch558');
    const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    let selectedCode='';
    function activePanel(){return shell.querySelector('.continent-panel.active')||shell.querySelector('.continent-panel');}
    function activeFrame(){return activePanel()?.querySelector?.('.continent-map-frame')||null;}
    function stageOf(frame){return parseInt(frame?.dataset?.zoomStage || frame?.dataset?.pc55Stage || '1',10)||1;}
    function filterOf(){return shell.dataset.filter || 'all';}
    function selectedExists(frame){return !!(selectedCode && frame && frame.querySelector('[data-map-item][data-code="'+CSS.escape(selectedCode)+'"]'));}
    function related(el){
      if(!selectedCode) return false;
      return el.getAttribute('data-node-code')===selectedCode || el.getAttribute('data-source-code')===selectedCode || el.getAttribute('data-target-code')===selectedCode;
    }
    function clearFlags(el){
      el.classList.remove('pc558-hidden','pc558-muted','pc558-related','pc558-focus','pc558-overview');
      el.removeAttribute('data-pc558-rule');
    }
    function hide(el,rule){el.classList.add('pc558-hidden'); if(rule) el.setAttribute('data-pc558-rule',rule);}
    function mute(el,rule){el.classList.add('pc558-muted'); if(rule) el.setAttribute('data-pc558-rule',rule);}
    function focus(el){el.classList.add('pc558-related','pc558-focus');}
    function applyFrame(frame){
      if(!frame) return;
      const stage=stageOf(frame);
      const filter=filterOf();
      const hasSel=selectedExists(frame);
      frame.classList.toggle('pc558-has-selection',hasSel);
      frame.dataset.pc558Stage=String(stage);
      frame.dataset.pc558Selected=hasSel?selectedCode:'';
      const viz=frame.querySelector('.pc557-tactical-viz');
      if(!viz) return;
      const items=Array.from(viz.querySelectorAll('.pc557-hatch,.pc557-radius,.pc557-link,.pc557-mini-card,.pc557-facility-cell'));
      let visibleCards=0;
      items.forEach(function(el){
        clearFlags(el);
        const isH=el.classList.contains('pc557-hatch');
        const isR=el.classList.contains('pc557-radius');
        const isL=el.classList.contains('pc557-link');
        const isC=el.classList.contains('pc557-mini-card');
        const isF=el.classList.contains('pc557-facility-cell');
        const rel=related(el);
        const type=el.getAttribute('data-layer-type')||'';
        const kind=el.getAttribute('data-layer-kind')||'';
        if(rel) focus(el);
        // Filter-first coarse suppression. Keeps non-selected categories from dominating the view.
        if(filter==='facility' && !(isF || (isC&&kind==='facility') || rel)) mute(el,'filter-facility');
        if(filter==='anomaly' && !(kind==='anomaly' || kind==='scan' || rel)) mute(el,'filter-anomaly');
        if(filter==='incident' && !(kind==='incident' || rel)) mute(el,'filter-incident');
        if((filter==='blockade'||filter==='blockade-node') && !(kind==='gate'||isL||rel)) mute(el,'filter-blockade');
        if(filter.startsWith('zone') && !(isH || rel)) mute(el,'filter-zone');
        // Stage visibility table.
        if(stage<=1){
          if(!isH) hide(el,'zoom1-overview');
          else mute(el,'zoom1-hatch-only');
          return;
        }
        if(stage===2){
          if(isC||isF||isL) hide(el,'zoom2-summary');
          else if(isR) mute(el,'zoom2-low-radius');
          else if(isH) mute(el,'zoom2-low-hatch');
          return;
        }
        if(stage===3){
          if(isF) hide(el,'zoom3-no-facility');
          if(isL && !rel) mute(el,'zoom3-link-muted');
          if(isC){
            if(hasSel && rel) focus(el);
            else hide(el,'zoom3-label-selected-only');
          }
          if(isH&&!rel) mute(el,'zoom3-hatch-muted');
          if(isR&&!rel) mute(el,'zoom3-radius-muted');
          return;
        }
        if(stage===4){
          if(isC){
            if(hasSel){ if(!rel) hide(el,'zoom4-selected-labels-only'); }
            else if(++visibleCards>3) hide(el,'zoom4-card-cap');
          }
          if(isL && hasSel && !rel) hide(el,'zoom4-related-links-only');
          if((isH||isR) && hasSel && !rel) mute(el,'zoom4-background-context');
          return;
        }
        // ZOOM 5: analysis is target-centered. Do not show every radius/link/card at once.
        if(stage>=5){
          if(hasSel){
            if((isC||isR||isL||isF) && !rel) hide(el,'zoom5-selection-focus');
            if(isH && !rel) mute(el,'zoom5-hatch-context');
          }else{
            if(isC||isL||isR||isF) hide(el,'zoom5-wait-for-selection');
            if(isH) mute(el,'zoom5-overview-hatch');
          }
        }
      });
    }
    function applyAll(){shell.querySelectorAll('.continent-map-frame').forEach(applyFrame); updateAudit();}
    function ensureAudit(){
      let p=shell.querySelector('.pc558-declutter-audit');
      if(p) return p;
      p=document.createElement('div');
      p.className='pc558-declutter-audit';
      p.innerHTML='<b>LAYER VISIBILITY QA</b><span data-dqa-stage>ZOOM</span><span data-dqa-filter>FILTER</span><span data-dqa-select>SELECT</span><span data-dqa-rule>RULE</span>';
      shell.appendChild(p); return p;
    }
    function updateAudit(){
      const p=ensureAudit(); const frame=activeFrame(); const stage=stageOf(frame); const f=filterOf();
      p.querySelector('[data-dqa-stage]').textContent='줌: ZOOM '+stage;
      p.querySelector('[data-dqa-filter]').textContent='필터: '+f;
      p.querySelector('[data-dqa-select]').textContent='선택: '+(selectedCode||'없음');
      p.querySelector('[data-dqa-rule]').textContent='규칙: '+(stage>=5?'선택 대상 중심':'단계별 요약');
    }
    shell.addEventListener('click',function(e){
      const marker=e.target.closest('[data-map-item]');
      if(marker){ selectedCode=marker.getAttribute('data-code')||''; setTimeout(applyAll,80); return; }
      if(e.target.closest('.continent-filter,.continent-tab')){ selectedCode=''; setTimeout(applyAll,160); return; }
      if(e.target.closest('.map-viewport-tools button,.pc554-cluster-badge,.pc554-stack-list button')) setTimeout(applyAll,180);
    },true);
    shell.addEventListener('keydown',function(e){
      if(e.key!=='Enter'&&e.key!==' ') return;
      const marker=e.target.closest('[data-map-item]');
      if(marker){ selectedCode=marker.getAttribute('data-code')||''; setTimeout(applyAll,80); }
    },true);
    shell.addEventListener('wheel',function(e){ if(e.target.closest('.continent-map-frame')){ clearTimeout(shell._pc558Wheel); shell._pc558Wheel=setTimeout(applyAll,260); } },{passive:true});
    const mo=new MutationObserver(function(muts){
      if(muts.some(function(m){return m.type==='attributes' && /data-zoom-stage|data-pc55-stage|class/.test(m.attributeName||'');})){
        clearTimeout(shell._pc558Mutation); shell._pc558Mutation=setTimeout(applyAll,160);
      }
    });
    shell.querySelectorAll('.continent-map-frame,.continent-panel').forEach(function(el){mo.observe(el,{attributes:true,attributeFilter:['data-zoom-stage','data-pc55-stage','class']});});
    setTimeout(applyAll,800);
    setTimeout(applyAll,1600);
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch558:'Map Layer Declutter QA'});

// PATCH 5.5.8.1 — MapLayerVisibilityHotfix
// Narrow hotfix after 5.5.8: stronger declutter gates for ZOOM 4/5 and no-selection states.
// Does not alter map pan/zoom transform logic.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const shell=document.querySelector('.continental-map-shell.datamap-v3');
    if(!shell || shell.dataset.patch5581Applied) return;
    shell.dataset.patch5581Applied='1';
    shell.classList.add('map-patch5581');
    let selectedCode='';
    const qs=(root,sel)=>Array.from((root||document).querySelectorAll(sel));
    function activePanel(){return shell.querySelector('.continent-panel.active')||shell.querySelector('.continent-panel');}
    function activeFrame(){return activePanel()?.querySelector?.('.continent-map-frame')||null;}
    function stageOf(frame){return parseInt(frame?.dataset?.zoomStage || frame?.dataset?.pc55Stage || '1',10)||1;}
    function markerCodeFromEventTarget(t){
      const m=t.closest?.('[data-map-item]');
      if(m) return m.getAttribute('data-code')||'';
      const b=t.closest?.('.pc554-stack-list button');
      if(b){
        const span=b.querySelector('span');
        return span ? (span.textContent||'').trim() : '';
      }
      return '';
    }
    function clear5581(el){
      el.classList.remove('pc5581-hidden','pc5581-dim','pc5581-focus','pc5581-related');
      el.removeAttribute('data-pc5581-rule');
    }
    function hide(el,why){el.classList.add('pc5581-hidden'); if(why) el.setAttribute('data-pc5581-rule',why);}
    function dim(el,why){el.classList.add('pc5581-dim'); if(why) el.setAttribute('data-pc5581-rule',why);}
    function mark(el){el.classList.add('pc5581-related','pc5581-focus');}
    function isRelated(el){
      if(!selectedCode) return false;
      return el.getAttribute('data-node-code')===selectedCode || el.getAttribute('data-source-code')===selectedCode || el.getAttribute('data-target-code')===selectedCode;
    }
    function applyFrame(frame){
      if(!frame) return;
      const stage=stageOf(frame);
      const hasSel=!!(selectedCode && frame.querySelector('[data-map-item][data-code="'+(window.CSS&&CSS.escape?CSS.escape(selectedCode):selectedCode.replace(/"/g,'\\"'))+'"]'));
      frame.classList.toggle('pc5581-has-selection',hasSel);
      frame.classList.toggle('pc5581-no-selection',!hasSel);
      frame.dataset.pc5581Stage=String(stage);
      frame.dataset.pc5581Selected=hasSel?selectedCode:'';
      const items=qs(frame,'.pc557-hatch,.pc557-radius,.pc557-link,.pc557-mini-card,.pc557-facility-cell');
      let cardBudget = stage>=4 ? 2 : 0;
      items.forEach(function(el){
        clear5581(el);
        const hatch=el.classList.contains('pc557-hatch');
        const radius=el.classList.contains('pc557-radius');
        const link=el.classList.contains('pc557-link');
        const card=el.classList.contains('pc557-mini-card');
        const fac=el.classList.contains('pc557-facility-cell');
        const rel=isRelated(el);
        if(rel) mark(el);

        if(stage<=1){
          if(!hatch) hide(el,'5581-zoom1-summary-only');
          else dim(el,'5581-zoom1-hatch-bg');
          return;
        }
        if(stage===2){
          if(link||card||fac) hide(el,'5581-zoom2-no-detail');
          else dim(el,'5581-zoom2-low-context');
          return;
        }
        if(stage===3){
          if(link||fac) hide(el,'5581-zoom3-no-link-fac');
          if(card && !rel) hide(el,'5581-zoom3-selected-card-only');
          if((hatch||radius) && !rel) dim(el,'5581-zoom3-background');
          return;
        }
        if(stage===4){
          if(hasSel){
            if((link||card||radius||fac) && !rel) hide(el,'5581-zoom4-focus-only');
            if(hatch && !rel) dim(el,'5581-zoom4-muted-hatch');
          }else{
            if(link||radius||fac) hide(el,'5581-zoom4-wait-selection');
            if(card){ if(cardBudget-- > 0) dim(el,'5581-zoom4-card-preview'); else hide(el,'5581-zoom4-card-cap'); }
            if(hatch) dim(el,'5581-zoom4-hatch-bg');
          }
          return;
        }
        // ZOOM 5 is analysis mode. Without a selected marker, keep only quiet context.
        if(stage>=5){
          if(hasSel){
            if((link||card||radius||fac) && !rel) hide(el,'5581-zoom5-selected-only');
            if(hatch && !rel) dim(el,'5581-zoom5-hatch-context');
          }else{
            if(link||card||radius||fac) hide(el,'5581-zoom5-no-selection');
            if(hatch) dim(el,'5581-zoom5-hatch-bg-only');
          }
        }
      });
      // Hide old helper wording in normal mode even if older patches reinsert it.
      if(!shell.classList.contains('map-debug-on')){
        qs(frame,'.pc55-lod-label,.pc555-helper-legend,.pc555-visual-audit,.pc558-declutter-audit').forEach(function(el){ el.classList.add('pc5581-hidden'); });
      }
    }
    function applyAll(){qs(shell,'.continent-map-frame').forEach(applyFrame); updateAudit();}
    function updateAudit(){
      const p=shell.querySelector('.pc558-declutter-audit');
      const frame=activeFrame();
      if(!p || !frame) return;
      const rule=p.querySelector('[data-dqa-rule]');
      if(rule) rule.textContent='규칙: 5.5.8.1 핫픽스 · '+(frame.classList.contains('pc5581-has-selection')?'선택 중심':'요약 표시');
    }
    shell.addEventListener('click',function(e){
      const code=markerCodeFromEventTarget(e.target);
      if(code){selectedCode=code; setTimeout(applyAll,120); return;}
      if(e.target.closest('.continent-filter,.continent-tab')){selectedCode=''; setTimeout(applyAll,180); return;}
      if(e.target.closest('.map-viewport-tools button')) setTimeout(applyAll,180);
    },true);
    shell.addEventListener('wheel',function(e){ if(e.target.closest('.continent-map-frame')){ clearTimeout(shell._pc5581Wheel); shell._pc5581Wheel=setTimeout(applyAll,220); } },{passive:true});
    const mo=new MutationObserver(function(muts){
      if(muts.some(m=>m.type==='attributes')){ clearTimeout(shell._pc5581Mo); shell._pc5581Mo=setTimeout(applyAll,180); }
    });
    qs(shell,'.continent-map-frame,.continent-panel').forEach(el=>mo.observe(el,{attributes:true,attributeFilter:['data-zoom-stage','data-pc55-stage','class']}));
    setTimeout(applyAll,500);
    setTimeout(applyAll,1400);
  });
})();
window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch5581:'Map Layer Visibility Hotfix'});

// PATCH 5.5.9 — MapRuntimeCleanup
// Consolidates map zoom/drag input at document-capture level so older patch listeners do not all react to every zoom/drag event.
// This patch intentionally avoids display:none hide/restore loops from 5.5.6.1 and only commits heavy layer state once after input settles.
// PATCH 5.6.1 overrides this runtime to use fixed 5-step zoom snapping instead of free percent zoom.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const shell=document.querySelector('.continental-map-shell.datamap-v3');
    if(!shell || shell.dataset.patch559Applied) return;
    shell.dataset.patch559Applied='1';
    shell.classList.add('map-patch559','map-runtime-consolidated','map-patch561');

    const state=new WeakMap();
    const ZOOM_STEPS=[
      {stage:1,scale:1.00,label:'ZOOM 1 / 권역 보기',code:'REGION OVERVIEW'},
      {stage:2,scale:1.40,label:'ZOOM 2 / 작전권 보기',code:'OPERATION SECTOR'},
      {stage:3,scale:1.85,label:'ZOOM 3 / 전술 관제',code:'TACTICAL CONTROL'},
      {stage:4,scale:2.40,label:'ZOOM 4 / 시설 관제',code:'FACILITY CONTROL'},
      {stage:5,scale:3.00,label:'ZOOM 5 / 기록 분석',code:'RECORD ANALYSIS'}
    ];
    const MIN=ZOOM_STEPS[0].scale, MAX=ZOOM_STEPS[ZOOM_STEPS.length-1].scale;
    const layerSelector='.continent-map-img,.map-data-layer,.pc55-tactical-lod';
    let dragging=null;
    let busyTimer=0;

    function px(n){ return Number.isFinite(n)? n+'px' : '0px'; }
    function parsePx(v){ const n=parseFloat(String(v||'').replace('px','')); return Number.isFinite(n)?n:0; }
    function frameFromTarget(t){ return t && t.closest ? t.closest('.continent-map-frame') : null; }
    function isMapTool(t){ return t && t.closest && t.closest('.map-viewport-tools button'); }
    function stepByStage(stage){ return ZOOM_STEPS[Math.max(1,Math.min(5,stage))-1] || ZOOM_STEPS[0]; }
    function nearestStep(scale){
      let best=ZOOM_STEPS[0], diff=Infinity;
      ZOOM_STEPS.forEach(st=>{ const d=Math.abs((+scale||1)-st.scale); if(d<diff){diff=d; best=st;} });
      return best;
    }
    function stageForScale(scale){ return nearestStep(scale).stage; }
    function getState(frame){
      let s=state.get(frame);
      if(!s){
        const cs=getComputedStyle(frame);
        const raw=parseFloat(frame.dataset.pc559Scale||cs.getPropertyValue('--map-scale')||'1') || 1;
        const st=nearestStep(raw);
        s={scale:st.scale,x:parsePx(cs.getPropertyValue('--map-x')),y:parsePx(cs.getPropertyValue('--map-y')),wide:frame.classList.contains('map-wide-mode'),raf:0,idle:0,stage:st.stage,wheelDebt:0,wheelTimer:0};
        state.set(frame,s);
      }
      return s;
    }
    function clamp(frame,s){
      const st=nearestStep(s.scale);
      s.scale=Math.max(MIN,Math.min(MAX,st.scale));
      s.stage=st.stage;
      if(s.scale<=1.001){s.x=0;s.y=0;return;}
      const maxX=Math.max(0,(frame.clientWidth||0)*(s.scale-1)/2);
      const maxY=Math.max(0,(frame.clientHeight||0)*(s.scale-1)/2);
      s.x=Math.max(-maxX,Math.min(maxX,+s.x||0));
      s.y=Math.max(-maxY,Math.min(maxY,+s.y||0));
    }
    function markBusy(){
      shell.classList.add('pc559-runtime-moving');
      clearTimeout(busyTimer);
      busyTimer=setTimeout(()=>shell.classList.remove('pc559-runtime-moving'),180);
    }
    function syncReadout(frame,s,commit){
      const st=stepByStage(s.stage||stageForScale(s.scale));
      const read=frame.querySelector('.map-zoom-readout');
      // 5.6.1: stage-first readout. Percent remains only as a small secondary cue.
      if(read) read.textContent=Math.round(st.scale*100)+'%';
      const stageEl=frame.querySelector('.map-zoom-stage');
      if(stageEl) stageEl.textContent=st.label;
      const pc55Title=frame.querySelector('[data-pc55-stage-title]');
      if(pc55Title) pc55Title.textContent=st.label;
      const pc55Code=frame.querySelector('[data-pc55-stage-code]');
      if(pc55Code) pc55Code.textContent=st.code;
      if(commit){
        s.stage=st.stage;
        frame.dataset.zoomStage=String(st.stage);
        frame.dataset.pc55Stage=String(st.stage);
        frame.dataset.pc559Scale=String(st.scale.toFixed(2));
        frame.dataset.pc561ZoomStep=String(st.stage);
      }
    }
    function apply(frame,commit){
      const s=getState(frame);
      clamp(frame,s);
      const transform='translate('+s.x+'px, '+s.y+'px) scale('+s.scale+')';
      frame.style.setProperty('--map-x',px(s.x));
      frame.style.setProperty('--map-y',px(s.y));
      frame.style.setProperty('--map-scale',String(s.scale));
      frame.style.setProperty('--pc-marker-inv',String((1/Math.max(1,s.scale)).toFixed(4)));
      frame.querySelectorAll(layerSelector).forEach(el=>{ el.style.transform=transform; });
      syncReadout(frame,s,!!commit);
    }
    function scheduleApply(frame,commitDelay){
      const s=getState(frame);
      markBusy();
      if(!s.raf){
        s.raf=requestAnimationFrame(()=>{ s.raf=0; apply(frame,false); });
      }
      clearTimeout(s.idle);
      s.idle=setTimeout(()=>{ apply(frame,true); }, commitDelay==null?120:commitDelay);
    }
    function setStage(frame,stage){
      const s=getState(frame);
      const st=stepByStage(stage);
      s.scale=st.scale;
      s.stage=st.stage;
      if(s.stage<=1){s.x=0;s.y=0;s.wide=false; frame.classList.remove('map-wide-mode');}
      clamp(frame,s);
      scheduleApply(frame,110);
    }
    function stepZoom(frame,dir){
      const s=getState(frame);
      const cur=nearestStep(s.scale).stage;
      setStage(frame,cur+(dir>0?1:-1));
    }
    function reset(frame){
      const s=getState(frame); s.scale=MIN; s.stage=1; s.x=0; s.y=0; s.wide=false;
      frame.classList.remove('map-wide-mode');
      const btn=frame.querySelector('[data-map-tool="wide"]'); if(btn) btn.classList.remove('active');
      scheduleApply(frame,90);
    }
    function wide(frame){
      const s=getState(frame); s.scale=MIN; s.stage=1; s.x=0; s.y=0; s.wide=!s.wide;
      frame.classList.toggle('map-wide-mode',s.wide);
      const btn=frame.querySelector('[data-map-tool="wide"]'); if(btn) btn.classList.toggle('active',s.wide);
      scheduleApply(frame,100);
    }
    function handleTool(e){
      const btn=isMapTool(e.target); if(!btn) return false;
      const frame=frameFromTarget(btn); if(!frame || !shell.contains(frame)) return false;
      e.preventDefault(); e.stopImmediatePropagation();
      const act=btn.dataset.mapTool;
      if(act==='zoom-in') stepZoom(frame,1);
      else if(act==='zoom-out') stepZoom(frame,-1);
      else if(act==='reset') reset(frame);
      else if(act==='wide') wide(frame);
      return true;
    }
    function handleWheel(e){
      const frame=frameFromTarget(e.target); if(!frame || !shell.contains(frame)) return false;
      if(e.target.closest('.map-detail-card,.pc554-stack-panel,.pc557-feeds-panel')) return false;
      if(!e.ctrlKey && Math.abs(e.deltaY)<28) return false;
      e.preventDefault(); e.stopImmediatePropagation();
      const s=getState(frame);
      // 5.6.1: accumulate wheel motion and snap only one ZOOM step at a time.
      s.wheelDebt += e.deltaY;
      clearTimeout(s.wheelTimer);
      const threshold=e.ctrlKey?70:120;
      if(Math.abs(s.wheelDebt)>=threshold){
        stepZoom(frame, s.wheelDebt<0?1:-1);
        s.wheelDebt=0;
      }
      s.wheelTimer=setTimeout(()=>{s.wheelDebt=0;},160);
      return true;
    }
    function beginDrag(e){
      const frame=frameFromTarget(e.target); if(!frame || !shell.contains(frame)) return false;
      if(e.button!==0 || e.target.closest('.map-viewport-tools,.map-detail-card,.pc554-stack-panel,.pc557-feeds-panel')) return false;
      if(e.target.closest('[data-map-item],.pc554-cluster-badge')){ e.stopImmediatePropagation(); return true; }
      const s=getState(frame);
      if(s.scale<=1.001) return false;
      e.preventDefault(); e.stopImmediatePropagation();
      dragging={frame,id:e.pointerId,x:e.clientX,y:e.clientY,startX:s.x,startY:s.y};
      shell.classList.add('pc559-runtime-moving');
      try{frame.setPointerCapture(e.pointerId);}catch(_e){}
      return true;
    }
    function moveDrag(e){
      if(!dragging || dragging.id!==e.pointerId) return false;
      e.preventDefault(); e.stopImmediatePropagation();
      const s=getState(dragging.frame);
      s.x=dragging.startX+(e.clientX-dragging.x);
      s.y=dragging.startY+(e.clientY-dragging.y);
      clamp(dragging.frame,s);
      scheduleApply(dragging.frame,140);
      return true;
    }
    function endDrag(e){
      if(!dragging || (e && dragging.id!==e.pointerId)) return false;
      e.preventDefault(); e.stopImmediatePropagation();
      const frame=dragging.frame; dragging=null;
      clearTimeout(busyTimer);
      busyTimer=setTimeout(()=>shell.classList.remove('pc559-runtime-moving'),120);
      apply(frame,true);
      return true;
    }
    function initFrames(){
      shell.querySelectorAll('.continent-map-frame').forEach(frame=>{
        const s=getState(frame);
        const st=nearestStep(s.scale);
        s.scale=st.scale; s.stage=st.stage;
        apply(frame,true);
      });
    }

    document.addEventListener('click',handleTool,true);
    document.addEventListener('wheel',handleWheel,{capture:true,passive:false});
    document.addEventListener('pointerdown',beginDrag,true);
    document.addEventListener('pointermove',moveDrag,true);
    document.addEventListener('pointerup',endDrag,true);
    document.addEventListener('pointercancel',endDrag,true);

    shell.addEventListener('click',function(e){
      if(e.target.closest('.continent-tab,.continent-filter')) setTimeout(initFrames,120);
    },false);

    initFrames();
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch559:'Map Runtime Cleanup', patch561Runtime:'Map Zoom Step Runtime'});


// PATCH 5.6 — RecordLinkCodebook + MapReadabilityCleanup
// Scope: map marker <-> archive record linking, codebook overlay, and readability gates.
// Keeps pan/zoom runtime from 5.5.9 intact.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const shell=document.querySelector('.continental-map-shell.datamap-v3');
    const pages=Array.from(document.querySelectorAll('.content-page'));
    const links=Array.from(document.querySelectorAll('.side-menu a[data-target]'));
    const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const RECORD_ALIASES=[
      {id:'Redzone_881120', keys:['레드존 이상현상','오염 기준','레드존 이상현상 및 오염 기준 문서','Redzone']},
      {id:'NHC_Manual_891219', keys:['N.H.C 현장 작전','N.H.C 현장 작전·장비·봉쇄 규정 문서','NHC 현장','봉쇄 규정']},
      {id:'Zone_870815', keys:['구역 위험도','구역 위험도 분류 문서','지역지도']},
      {id:'불명_Record2_860205', keys:['피의 호수','피의 호수 부검 기록']},
      {id:'FCR_Archive_890402', keys:['타락 개체 분류 추가','추가 보고서','괴이','귀환자']},
      {id:'타락 개체_860722', keys:['타락 개체 분류 보고서','타락 개체']},
      {id:'Cults_871104', keys:['F.H.C 극비 보안','F.H.C','우시노다교','Ushnoda']},
      {id:'Immortality_860201', keys:['불멸을 향해','불멸 작전']},
      {id:'Sakuma_Tape_991028', keys:['사쿠마 유타','사쿠마 유타 실종 사건 보고서']},
      {id:'불명_Record1_860204', keys:['아마리온 회수 영상','아마리온 회수 영상 기록']},
      {id:'불명_Record3_920711', keys:['레드울프 이탈','레드울프 이탈 기록']},
      {id:'불명_Record4_930314', keys:['축복으로 위장된 병기']},
      {id:'불명_Record5_940626', keys:['새로운 세계를 위한 유전자','새로운 세계를 위한 유전자 기록']}
    ];
    const CODEBOOK=[
      ['RZ','레드존','고위험 오염권·중심 코어 표식'],
      ['YZ','옐로우존','감시·격상 후보 구역'],
      ['GZ','그린존','후방 운영·관리권'],
      ['WZ','화이트존','검문·관리·완충 구역'],
      ['BZ / BLK','블랙존','진입 금지 심부 위험권'],
      ['GATE','봉쇄 거점','게이트·검문 허브·통제 노드'],
      ['SEA','해상 감시권','항로·해역·감시선 표식'],
      ['FAC','작전 시설','관제소·회수거점·지원 시설'],
      ['ANM','현상 기록','이상현상 관측점'],
      ['INC / EVT','사건 좌표','사건·전투·실종 좌표']
    ];
    function resolveRecordId(label){
      const txt=String(label||'').trim();
      if(!txt) return '';
      const direct=document.querySelector('.record-detail[data-record="'+(window.CSS&&CSS.escape?CSS.escape(txt):txt.replace(/"/g,'\\"'))+'"]');
      if(direct) return txt;
      const found=RECORD_ALIASES.find(r=>r.keys.some(k=>txt.includes(k)||k.includes(txt)));
      return found?found.id:'';
    }
    function recordTitle(id){
      const el=document.querySelector('.record-detail[data-record="'+(window.CSS&&CSS.escape?CSS.escape(id):id.replace(/"/g,'\\"'))+'"] .doc-title');
      return el?el.textContent.trim():id;
    }
    function switchPage(id){
      if(!pages.length) return;
      pages.forEach(p=>p.classList.toggle('active',p.id===id));
      links.forEach(a=>a.classList.toggle('active',a.dataset.target===id));
      try{history.replaceState(null,'','#'+id);}catch(_e){}
      const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0;
    }
    function openRecord(id){
      if(!id) return;
      switchPage('archive-entry');
      setTimeout(()=>{
        if(typeof window.ProjectCurseShowInternalRecord==='function') window.ProjectCurseShowInternalRecord(id);
        else document.querySelector('.open-record[data-record="'+(window.CSS&&CSS.escape?CSS.escape(id):id.replace(/"/g,'\\"'))+'"]').click();
        const target=document.querySelector('.record-detail[data-record="'+(window.CSS&&CSS.escape?CSS.escape(id):id.replace(/"/g,'\\"'))+'"]');
        if(target){ target.classList.add('pc56-record-linked-open'); setTimeout(()=>target.classList.remove('pc56-record-linked-open'),1300); }
      },90);
    }
    function activePanel(){ return shell?.querySelector('.continent-panel.active') || shell?.querySelector('.continent-panel') || null; }
    function activeFrame(){ return activePanel()?.querySelector?.('.continent-map-frame') || null; }
    function showMapRegion(region, code){
      if(!shell) return;
      switchPage('zone-map');
      const tab=shell.querySelector('.continent-tab[data-continent="'+region+'"]');
      if(tab) tab.click();
      setTimeout(()=>{
        const selector='[data-map-item][data-code="'+(window.CSS&&CSS.escape?CSS.escape(code):String(code).replace(/"/g,'\\"'))+'"]';
        const marker=shell.querySelector(selector);
        if(marker){
          marker.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
          marker.classList.add('pc56-linked-marker-flash');
          marker.scrollIntoView({block:'center',inline:'center',behavior:'smooth'});
          setTimeout(()=>marker.classList.remove('pc56-linked-marker-flash'),1200);
        }
      },220);
    }
    function splitRecords(records){
      return String(records||'').split('/').map(s=>s.trim()).filter(Boolean).slice(0,6);
    }
    function enhanceLinkedRecords(root){
      (root||document).querySelectorAll('.linked-records').forEach(box=>{
        if(box.dataset.pc56Linked) return;
        const entries=Array.from(box.children).length?Array.from(box.children).map(el=>el.textContent.trim()):splitRecords(box.textContent);
        box.dataset.pc56Linked='1';
        box.innerHTML='';
        entries.forEach(label=>{
          const id=resolveRecordId(label);
          const btn=document.createElement('button');
          btn.type='button';
          btn.className='pc56-record-link';
          btn.textContent=label;
          if(id){btn.dataset.record=id; btn.title='기록보관서에서 열기: '+recordTitle(id);} else {btn.dataset.mapOnly='1'; btn.title='지역지도 참조 항목';}
          box.appendChild(btn);
        });
      });
    }
    function markerInfo(el){
      return {
        code:el.getAttribute('data-code')||'NO-CODE',
        title:el.getAttribute('data-title')||'U.A.C 관제 표식',
        region:el.getAttribute('data-region')||el.closest('.continent-panel')?.dataset?.continentPanel||'world',
        surface:el.getAttribute('data-surface')||'표면 판정 없음',
        qa:el.getAttribute('data-qa')||'REVIEWED',
        records:splitRecords(el.getAttribute('data-records')||'')
      };
    }
    function collectRecordLinks(){
      const map=new Map();
      if(!shell) return map;
      shell.querySelectorAll('[data-map-item]').forEach(el=>{
        const info=markerInfo(el);
        info.records.forEach(label=>{
          const id=resolveRecordId(label);
          if(!id) return;
          if(!map.has(id)) map.set(id,[]);
          map.get(id).push(info);
        });
      });
      return map;
    }
    function injectRecordMapLinks(){
      const related=collectRecordLinks();
      document.querySelectorAll('.record-detail[data-record]').forEach(article=>{
        if(article.dataset.pc56Maplinks) return;
        const id=article.dataset.record;
        const list=(related.get(id)||[]).slice(0,8);
        if(!list.length) return;
        article.dataset.pc56Maplinks='1';
        const panel=document.createElement('div');
        panel.className='pc56-record-maplinks';
        panel.innerHTML='<div class="pc56-record-maplinks-head"><b>RELATED MAP COORDINATES</b><span>지도 좌표 연결</span></div><div class="pc56-record-maplinks-list"></div>';
        const wrap=panel.querySelector('.pc56-record-maplinks-list');
        list.forEach(item=>{
          const btn=document.createElement('button');
          btn.type='button';
          btn.dataset.region=item.region;
          btn.dataset.code=item.code;
          btn.innerHTML='<b>'+esc(item.code)+'</b><span>'+esc(item.title)+'</span><em>'+esc(item.surface)+' / '+esc(item.qa)+'</em>';
          wrap.appendChild(btn);
        });
        const header=article.querySelector('.doc-header');
        if(header) header.insertAdjacentElement('afterend',panel);
      });
    }
    function ensureCodebook(){
      if(!shell || shell.querySelector('.pc56-codebook')) return;
      const box=document.createElement('aside');
      box.className='pc56-codebook';
      box.innerHTML='<button class="pc56-codebook-toggle" type="button">CODEBOOK</button><div class="pc56-codebook-panel"><div class="pc56-codebook-head"><b>MAP CODEBOOK</b><span>표식 코드북</span></div><div class="pc56-codebook-list"></div></div>';
      const list=box.querySelector('.pc56-codebook-list');
      CODEBOOK.forEach(r=>{
        const row=document.createElement('div');
        row.innerHTML='<b>'+esc(r[0])+'</b><span>'+esc(r[1])+'</span><em>'+esc(r[2])+'</em>';
        list.appendChild(row);
      });
      shell.appendChild(box);
    }
    function updateReadabilityState(){
      if(!shell) return;
      const stackOpen=!!shell.querySelector('.pc554-stack-panel.show');
      const detailActive=!!shell.querySelector('.map-detail-card.pc56-detail-active, .map-detail-card.detail-v3:not(.pc56-detail-idle)');
      shell.classList.toggle('pc56-stack-mode',stackOpen);
      shell.classList.toggle('pc56-marker-mode',detailActive && !stackOpen);
      shell.classList.toggle('pc56-overview-mode',!stackOpen && !detailActive);
      // In marker/stack mode, keep feeds compact and prevent right-side information overload.
      shell.classList.add('pc56-feeds-compact');
    }
    function markDetailActive(card){
      if(!card) return;
      card.classList.add('pc56-detail-active');
      card.classList.remove('pc56-detail-idle');
      updateReadabilityState();
    }
    function resetToOverview(){
      if(!shell) return;
      shell.querySelectorAll('.map-detail-card').forEach(c=>{c.classList.remove('pc56-detail-active'); c.classList.add('pc56-detail-idle');});
      shell.querySelectorAll('.pc554-stack-panel.show').forEach(p=>p.classList.remove('show'));
      updateReadabilityState();
    }
    function softenBleed(){
      if(!shell) return;
      shell.classList.add('map-patch56');
      shell.querySelectorAll('.continent-map-frame').forEach(frame=>{
        frame.classList.add('pc56-readability-frame');
      });
    }
    if(shell){
      shell.classList.add('map-patch56','pc56-overview-mode','pc56-feeds-compact');
      ensureCodebook();
      softenBleed();
      shell.addEventListener('click',function(e){
        const link=e.target.closest('.pc56-record-link');
        if(link){
          e.preventDefault(); e.stopPropagation();
          if(link.dataset.record) openRecord(link.dataset.record);
          else switchPage('zone-map');
          return;
        }
        const toggle=e.target.closest('.pc56-codebook-toggle');
        if(toggle){ e.preventDefault(); e.stopPropagation(); shell.classList.toggle('pc56-codebook-open'); return; }
        const marker=e.target.closest('[data-map-item]');
        if(marker){
          setTimeout(()=>{
            const card=marker.closest('.continent-panel')?.querySelector('.map-detail-card');
            markDetailActive(card); enhanceLinkedRecords(card||document); updateReadabilityState();
          },80);
          return;
        }
        if(e.target.closest('.pc554-cluster-badge')){ setTimeout(updateReadabilityState,80); return; }
        if(e.target.closest('.pc554-stack-list button')){ setTimeout(()=>{ const card=activePanel()?.querySelector('.map-detail-card'); markDetailActive(card); enhanceLinkedRecords(card||document); updateReadabilityState(); },120); return; }
        if(e.target.closest('.continent-tab,.continent-filter')){ setTimeout(()=>{ resetToOverview(); softenBleed(); injectRecordMapLinks(); },180); }
      },true);
      shell.addEventListener('keydown',function(e){
        if(e.key!=='Enter'&&e.key!==' ') return;
        const marker=e.target.closest('[data-map-item]');
        if(marker) setTimeout(()=>{const card=marker.closest('.continent-panel')?.querySelector('.map-detail-card'); markDetailActive(card); enhanceLinkedRecords(card||document);},90);
      },true);
      const mo=new MutationObserver(function(muts){
        let needLinks=false, needState=false;
        muts.forEach(m=>{
          if(m.type==='childList') needLinks=true;
          if(m.type==='attributes' && /class|hidden/.test(m.attributeName||'')) needState=true;
        });
        if(needLinks){ clearTimeout(shell._pc56Links); shell._pc56Links=setTimeout(()=>{enhanceLinkedRecords(shell); injectRecordMapLinks();},120); }
        if(needState){ clearTimeout(shell._pc56State); shell._pc56State=setTimeout(updateReadabilityState,80); }
      });
      mo.observe(shell,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden']});
    }
    document.addEventListener('click',function(e){
      const link=e.target.closest('.pc56-record-link');
      if(link){ e.preventDefault(); e.stopPropagation(); if(link.dataset.record) openRecord(link.dataset.record); }
      const mapBtn=e.target.closest('.pc56-record-maplinks button[data-code]');
      if(mapBtn){ e.preventDefault(); showMapRegion(mapBtn.dataset.region||'world', mapBtn.dataset.code||''); }
    },true);
    setTimeout(()=>{ enhanceLinkedRecords(document); injectRecordMapLinks(); updateReadabilityState(); },900);
    setTimeout(()=>{ enhanceLinkedRecords(document); injectRecordMapLinks(); updateReadabilityState(); },1800);
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch56:'Record Link Codebook + Map Readability Cleanup'});

// PATCH 5.6.2 — ArchiveTransitionCleanup + MapResidualOverlayFix
// Scope: archive transition separation and normal-mode map ghost/label/link cleanup.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const shell=document.querySelector('.continental-map-shell.datamap-v3');
    if(shell) shell.classList.add('map-patch562');
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
    // Separate the three archive effects: menu entry, record-tab remap, and individual file open.
    document.querySelectorAll('.side-menu a[data-target="archive-entry"]').forEach(a=>{
      if(a.dataset.pc562ArchiveEntry) return;
      a.dataset.pc562ArchiveEntry='1';
      a.addEventListener('click',()=>archiveToast('ARCHIVE SURFACE OPEN','색인 잠금 해제 / 문서 상태 대조 / 열람 가능 기록 정렬'),true);
    });
    document.querySelectorAll('.page-tab,.sub-tab').forEach(btn=>{
      if(btn.dataset.pc562Surface) return;
      btn.dataset.pc562Surface='1';
      btn.addEventListener('click',()=>{
        const inRecord=btn.closest('#archive-entry,.record-content,.paged-record,.nested-record');
        if(inRecord) archiveToast('RECORD SURFACE REMAP','상단 스캔라인 1회 / 기록면 색인 재정렬');
      },true);
    });
    document.querySelectorAll('.open-record[data-record]').forEach(btn=>{
      if(btn.dataset.pc562RecordOpen) return;
      btn.dataset.pc562RecordOpen='1';
      btn.addEventListener('click',()=>archiveToast('RECORD FILE OPEN','기록 파일 호출 / 열람 권한 유지 / 문서 섹터 확인'),true);
    });
    document.querySelectorAll('.record-back').forEach(btn=>{
      if(btn.dataset.pc562Back) return;
      btn.dataset.pc562Back='1';
      btn.addEventListener('click',()=>archiveToast('ARCHIVE INDEX RESTORED','기록 목록으로 복귀 / 임시 열람 상태 해제'),true);
    });

    // Map residual overlay cleanup: track selected marker and allow only related visualization layers in normal mode.
    if(!shell) return;
    function activePanel(){return shell.querySelector('.continent-panel.active')||shell.querySelector('.continent-panel');}
    function frames(){return Array.from(shell.querySelectorAll('.continent-map-frame'));}
    function clearSelection(frame){
      (frame? [frame] : frames()).forEach(f=>{
        f.classList.remove('pc562-has-selection');
        delete f.dataset.pc562SelectedCode;
        f.querySelectorAll('[data-map-item].pc562-selected').forEach(el=>el.classList.remove('pc562-selected'));
        f.querySelectorAll('.pc562-related').forEach(el=>el.classList.remove('pc562-related'));
      });
    }
    function markRelated(frame,code){
      if(!frame||!code) return;
      frame.classList.add('pc562-has-selection');
      frame.dataset.pc562SelectedCode=code;
      frame.querySelectorAll('[data-map-item]').forEach(el=>el.classList.toggle('pc562-selected',(el.getAttribute('data-code')||'')===code));
      frame.querySelectorAll('.pc557-hatch,.pc557-radius,.pc557-mini-card,.pc557-facility-cell,.pc557-link').forEach(el=>{
        const node=el.getAttribute('data-node-code')||'';
        const src=el.getAttribute('data-source-code')||'';
        const tgt=el.getAttribute('data-target-code')||'';
        const rel=(node===code||src===code||tgt===code);
        el.classList.toggle('pc562-related',rel);
      });
    }
    function selectMarker(marker){
      if(!marker) return;
      const frame=marker.closest('.continent-map-frame');
      const code=marker.getAttribute('data-code')||'';
      clearSelection(frame);
      if(code) markRelated(frame,code);
    }
    shell.addEventListener('click',function(e){
      const marker=e.target.closest('[data-map-item]');
      if(marker){ setTimeout(()=>selectMarker(marker),80); return; }
      if(e.target.closest('.continent-tab,.continent-filter')){ setTimeout(()=>{ clearSelection(); const p=activePanel(); const card=p?.querySelector?.('.map-detail-card'); if(card&&!card.classList.contains('pc56-detail-active')) clearSelection(p?.querySelector?.('.continent-map-frame')); },160); }
      if(e.target.closest('.map-viewport-tools button')){ setTimeout(()=>{ const card=activePanel()?.querySelector?.('.map-detail-card.pc56-detail-active'); if(!card) clearSelection(activePanel()?.querySelector?.('.continent-map-frame')); },160); }
    },true);
    // Stack-panel selection eventually dispatches marker click; this pass catches any detail-card-only changes.
    const mo=new MutationObserver(()=>{
      clearTimeout(shell._pc562Mo);
      shell._pc562Mo=setTimeout(()=>{
        const p=activePanel(); const frame=p?.querySelector?.('.continent-map-frame');
        const activeCard=p?.querySelector?.('.map-detail-card.pc56-detail-active, .map-detail-card.detail-551, .map-detail-card.detail-552, .map-detail-card.detail-553');
        if(!activeCard||!frame) return;
        const codeEl=activeCard.querySelector('.detail-code,.detail-code-row .detail-code');
        const code=(codeEl?codeEl.textContent.trim():activeCard.querySelector('b')?.textContent?.trim()||'');
        const marker=code?frame.querySelector('[data-map-item][data-code="'+(window.CSS&&CSS.escape?CSS.escape(code):code.replace(/"/g,'\\"'))+'"]'):null;
        if(marker) selectMarker(marker);
      },180);
    });
    mo.observe(shell,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden']});
    setTimeout(()=>{clearSelection();},550);
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
      fx.innerHTML='<b>'+esc(info.title)+'</b><span>'+esc(info.sub)+'</span>'+info.lines.map(l=>'<i>'+esc(l)+'</i>').join('');
      requestAnimationFrame(()=>fx.classList.add('active'));
      fxTimer=setTimeout(()=>fx.classList.remove('active'),780);
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
