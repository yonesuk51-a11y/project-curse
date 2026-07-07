document.addEventListener('DOMContentLoaded',()=>{
  document.body.classList.add('pc5121-boot-pending');
  function rootPrefix(){const p=location.pathname; if(p.includes('/docs/'))return '../../'; if(p.includes('/archive/'))return '../'; return '';}
  const prefix=rootPrefix();
  const loader=document.getElementById('loader');
  const app=document.getElementById('app');
  const audio={
    menu:new Audio(prefix+'assets/audio/pc5152f_analog_contact_soft.wav'),
    open:new Audio(prefix+'assets/audio/pc5152f_record_mount_soft.wav'),
    page:new Audio(prefix+'assets/audio/pc5152f_analog_contact_soft.wav'),
    boot:new Audio(prefix+'assets/audio/pc5152f_boot_access_oldpc.wav'),
    ambient:new Audio(prefix+'assets/audio/pc5152f_old_terminal_roomtone.wav'),
    load:new Audio(prefix+'assets/audio/pc5152f_record_mount_soft.wav'),
    drawer:new Audio(prefix+'assets/audio/pc5152f_analog_contact_soft.wav'),
    command:new Audio(prefix+'assets/audio/pc5152f_analog_contact_soft.wav'),
    restricted:new Audio(prefix+'assets/audio/pc5152f_low_denied_oldpc.wav'),
    video:new Audio(prefix+'assets/audio/pc5152f_record_mount_soft.wav'),
    radio:new Audio(prefix+'assets/audio/pc5152f_analog_contact_soft.wav'),
    marker:new Audio(prefix+'assets/audio/pc5152f_analog_contact_soft.wav'),
    alert:new Audio(prefix+'assets/audio/pc5152f_low_denied_oldpc.wav'),
    denied:new Audio(prefix+'assets/audio/pc5152f_low_denied_oldpc.wav')
  };
  const audioVolume={menu:.045,open:.075,page:.06,boot:.075,ambient:.028,load:.07,drawer:.055,command:.05,restricted:.075,video:.052,radio:.045,marker:.018,alert:.045,denied:.065};
  Object.keys(audio).forEach(k=>{if(audio[k]) audio[k].volume=audioVolume[k]??.16;});
  audio.ambient.loop=true;
  let ambientStarted=false;
  let activeRecordLoadMode='default';
  const audioCooldown={};
  if(localStorage.getItem('pc_audio_legacy2003_fixed')===null) localStorage.setItem('pc_audio_legacy2003_fixed','on');
  function isOn(){return localStorage.getItem('pc_audio_legacy2003_fixed')!=='off'}
  function play(a,key='generic',cooldown=55){
    if(!isOn()||!a)return;
    const now=performance.now();
    if(audioCooldown[key] && now-audioCooldown[key]<cooldown) return;
    audioCooldown[key]=now;
    try{a.currentTime=0; a.play().catch(()=>{});}catch(e){}
  }
  function playCue(name,cooldown=70){
    const a=audio[name]||audio.menu;
    play(a,name,cooldown);
  }
  function startAmbient(){
    if(!isOn()||ambientStarted||!audio.ambient)return;
    ambientStarted=true;
    try{audio.ambient.currentTime=0; audio.ambient.play().catch(()=>{ambientStarted=false;});}catch(e){ambientStarted=false;}
  }
  window.ProjectCurseAudio={playCue,play,startAmbient,isOn,audio};
  document.addEventListener('pointerdown',startAmbient); document.addEventListener('keydown',startAmbient);
  function ensureRecordLoader(){let el=document.getElementById('recordLoading'); if(!el){el=document.createElement('div'); el.id='recordLoading'; el.className='record-loading'; el.innerHTML='<div class="box"><div class="title">RECORD MOUNT</div><div class="logline">TEXT BLOCK ........ PARTIAL</div><div class="logline">LOCAL ACCESS ...... ACCEPTED</div><div class="logline">IMAGE FRAME ....... DAMAGED</div><div class="logline">RECORD BUS ........ READ</div><div class="bars"><i></i></div><div class="loader-hint">READ PERMISSION: LOCAL</div></div>'; document.body.appendChild(el);} return el;}
  function configureRecordLoader(mode){
    const el=ensureRecordLoader();
    activeRecordLoadMode=mode||'default';
    const fhc=mode==='fhc';
    const video=mode==='video';
    const bio=mode==='bio';
    el.classList.toggle('fhc-mode',fhc);
    el.classList.toggle('video-mode',video);
    el.classList.toggle('bio-mode',bio);
    el.innerHTML=fhc
      ? '<div class="box"><div class="title">RESTRICTED RECORD MOUNT</div><div class="logline">CLEARANCE ......... MISMATCH</div><div class="logline">TEXT BLOCK ........ PARTIAL</div><div class="logline">RED TRACE ......... ENABLED</div><div class="logline">BLACK TAG ......... CROSS-CHECK</div><div class="bars"><i></i></div><div class="loader-hint">RESTRICTED NODE: SINGLE ACCESS LAYER</div></div>'
      : video
        ? '<div class="box"><div class="title">DAMAGED VIDEO FEED</div><div class="logline">SIGNAL RECOVERY IN PROGRESS...</div><div class="logline">FRAME INDEX REBUILD...</div><div class="logline">AUDIO CHANNEL DEGRADED...</div><div class="logline">FIELD CAMERA CACHE MOUNTED...</div><div class="bars"><i></i></div><div class="loader-hint">VIDEO: PARTIAL / AUDIO: DEGRADED / FRAME LOSS DETECTED</div></div>'
        : bio
          ? '<div class="box"><div class="title">BIOLOGICAL TRACE SCAN</div><div class="logline">BIOLOGICAL RECORD MOUNT...</div><div class="logline">CONTAMINATION ..... CHECK</div><div class="logline">HOST REACTION ..... INDEX</div><div class="logline">THREAT TABLE ...... MATCH</div><div class="bars"><i></i></div><div class="loader-hint">ENTITY SCAN: PARTIAL / LOCAL</div></div>'
          : '<div class="box"><div class="title">RECORD MOUNT</div><div class="logline">TEXT BLOCK ........ PARTIAL</div><div class="logline">LOCAL ACCESS ...... ACCEPTED</div><div class="logline">IMAGE FRAME ....... DAMAGED</div><div class="logline">RECORD BUS ........ READ</div><div class="bars"><i></i></div><div class="loader-hint">READ PERMISSION: LOCAL</div></div>';
    return el;
  }
  function showRecordLoad(next){
    const el=ensureRecordLoader();
    el.classList.remove('done');
    void el.offsetWidth;
    el.classList.add('show');
    startAmbient();
    if(activeRecordLoadMode==='fhc') playCue('restricted',220);
    else if(activeRecordLoadMode==='video') playCue('video',220);
    else if(activeRecordLoadMode==='bio') playCue('radio',220);
    else playCue('load',220);
    const minTime=850;
    setTimeout(()=>{ el.classList.add('done'); if(typeof next==='function') next(); else el.classList.remove('show'); },minTime);
  }
  function syncBtns(){document.querySelectorAll('#audioToggle').forEach(b=>b.textContent=isOn()?'효과음: 켜짐':'효과음: 꺼짐')}
  syncBtns();
  const bootLines=Array.from(document.querySelectorAll('#bootLines p'));
  bootLines.forEach((line,i)=>setTimeout(()=>line.classList.add('show'),220+i*260));
  if(loader){setTimeout(()=>{loader.classList.add('hide'); if(app)app.classList.add('ready'); document.body.classList.add('pc5121-boot-complete'); document.body.classList.remove('pc5121-boot-pending'); playCue('boot',260);},2350);} else {if(app)app.classList.add('ready'); document.body.classList.add('pc5121-boot-complete'); document.body.classList.remove('pc5121-boot-pending');}
  document.querySelectorAll('#audioToggle').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('pc_audio_legacy2003_fixed',isOn()?'off':'on'); syncBtns(); if(isOn())playCue('menu',90);}));
  const pages=Array.from(document.querySelectorAll('.content-page'));
  const links=Array.from(document.querySelectorAll('.side-menu a[data-target]'));
  function show(id){
    if(!pages.length)return;
    if(!pages.some(p=>p.id===id)) id='history';
    pages.forEach(p=>p.classList.toggle('active',p.id===id));
    links.forEach(a=>a.classList.toggle('active',a.dataset.target===id));
    const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0;
  }
  links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); startAmbient(); playCue('menu',140); show(a.dataset.target); history.replaceState(null,'','#'+a.dataset.target);}));
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
  document.querySelectorAll('.faction-tile').forEach(b=>b.addEventListener('click',()=>{playCue('menu',160); renderFaction(b.dataset.key)})); if(detail) renderFaction('uac');
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

  /* MapPatch 5.13.3 — U.A.C case-file record viewer shell.
     Existing record bodies are preserved; this only wraps them with metadata / links / sub-record navigation. */
  const recordCaseMeta = {
    'Cults_871104':{grade:'F.H.C / SEALED',tone:'restricted',type:'오컬트 봉인 기록',map:'란저우 / 우시노다교 흔적',op:'lanzhou',factions:['F.H.C','S.I.D','Ushnoda Cult'],equipment:['봉인 태그','오염 표식 샘플','혈무'],phenomena:['의식성 오염','Blood Gate 잔향','타락교'],attachments:['타락교 기록면','혈교 기록면','현장 대응 경고'],annotation:'F.H.C 봉인 기록. 일부 문장은 부분 공개 상태로 유지한다.'},
    '타락 개체_860722':{grade:'ENTITY / RED',tone:'bio',type:'개체 분류 기록',map:'세계 상황판 / 레드존 개체권',op:'world',factions:['U.A.C','N.H.C','S.I.D'],equipment:['Null Round','W-Coat','회수 태그'],phenomena:['타락 개체','상위 개체','미믹 개체'],attachments:['개체 분류','부검 메모','회수 이미지'],annotation:'생체 반응과 위협 분류를 먼저 확인한다.'},
    '불명_Record2_860205':{grade:'BIO / HIGH',tone:'bio',type:'부검·오염 기록',map:'북해-함부르크 봉인 항만',op:'northsea',factions:['F.H.C','A.R.F','U.A.C'],equipment:['생체 샘플 키트','Black Tag Charge'],phenomena:['피의 호수','혈액성 잔류물','부패 정지 반응'],attachments:['부검 사진','샘플 기록','오염 판정'],annotation:'생체 샘플 접촉 금지. 회수보다 격리 우선.'},
    'Redzone_881120':{grade:'REDZONE / FIELD-2',tone:'redzone',type:'레드존 이상현상 기준',map:'부산 / 란저우 / 전역 레드권',op:'busan',factions:['U.A.C','S.I.D','F.H.C'],equipment:['Chrono Anchor','해상 감청 장비','봉쇄 게이트'],phenomena:['Dead Hour','Ghost Channel','Blood Gate','시간 오염'],attachments:['오염 기준','장기 방치 단계','격상/하향 기준'],annotation:'오염 기준과 봉쇄 판단에 연결되는 핵심 기준 문서.'},
    'FCR_Archive_890402':{grade:'RETURNED / CIV-2',tone:'returned',type:'귀환자·분류 추가 보고',map:'부산 선별 부두 / 란저우 주거블록',op:'busan',factions:['C.P.D','S.I.D','U.A.C'],equipment:['C.P.D 대피선','격리 태그','선별 장비'],phenomena:['귀환자 선별 실패','지연 신체 반응','재실종 사례'],attachments:['추가 분류','귀환자 기준','위장 개체 경고'],annotation:'민간 대피 동선과 기록 판단을 분리한다.'},
    'NHC_Manual_891219':{grade:'N.H.C / FIELD-1',tone:'field',type:'현장 작전·봉쇄 규정',map:'부산 부두 차단선 / 란저우 후퇴선',op:'lanzhou',factions:['N.H.C','U.A.C','A.R.F','C.P.D'],equipment:['W-Coat','Null Round','혈무','Black Tag Charge'],phenomena:['봉쇄선 붕괴','회수 실패','블랙 태그'],attachments:['현장 운용','봉쇄 대응','장비 운용'],annotation:'현장 대원 기준 문서. 작전 실패 시 기록 회수 절차를 우선한다.'},
    'Immortality_860201':{grade:'VIDEO / ORIGIN',tone:'video',type:'작전 영상·기원 사건',map:'북해-함부르크 봉인 항만',op:'northsea',factions:['U.A.C','S.I.D','F.H.C'],equipment:['현장 카메라','무전 기록','회수 매체'],phenomena:['피의 호수','혈액성 이상현상','야생동물 변질'],attachments:['작전 로그','촬영 기록','통신 기록'],annotation:'기원 사건 파일. 영상 프레임 손상 상태를 유지한다.'},
    'Sakuma_Tape_991028':{grade:'S.I.D / OCCULT',tone:'video',type:'실종·오컬트 사건 보고',map:'동아시아 감시권 / 도쿄 오컬트 사건',op:'world',factions:['S.I.D','F.H.C','Ushnoda Cult'],equipment:['현장 카메라','감청 노트'],phenomena:['우시노다교 흔적','실종 사건','오컬트 사망'],attachments:['담당 인물','피해자 기록','잔류 문장'],annotation:'S.I.D 오컬트 부서 기록. 잔류 문장 노이즈를 보존한다.'},
    '불명_Record1_860204':{grade:'VIDEO / AMARION',tone:'video',type:'아마리온 회수 영상',map:'Black Site 후보 / 기업 연구권',op:'world',factions:['F.H.C','Amarion','U.A.C'],equipment:['회수 영상 매체','연구 장비'],phenomena:['현실 외부 공간','고응축 자원','비인가 연구'],attachments:['사전교육 영상','프로젝트 장점','위험 기술 분석'],annotation:'기업 홍보 영상처럼 위장된 비인가 연구 기록.'},
    '불명_Record3_920711':{grade:'INTEL / SYNDICATE',tone:'video',type:'감시 영상·이탈 기록',map:'북미/신디케이트 감시권',op:'pacificnw',factions:['U.A.C','N.H.C','Syndicate'],equipment:['암호화 CCTV','감시 데이터'],phenomena:['지휘 이탈','오염 장비 유통'],attachments:['기록 정보','암호화 CCTV 영상'],annotation:'레드울프 이탈과 신디케이트 재분류의 근거 기록.'},
    '불명_Record4_930314':{grade:'BLACK / WEAPON',tone:'restricted',type:'비인가 오디오 기록',map:'신디케이트 / 우시노다교 연계 감시',op:'world',factions:['Syndicate','Red Wolf','F.H.C','Ushnoda Cult'],equipment:['혈무','오염된 장비','생체 병기'],phenomena:['우시노다 힘 병기화','의식성 오염'],attachments:['오디오 기록','무기화 논의','위험 분석'],annotation:'대화 기록은 문서 삽입용 설정이 아니라 제한 열람 자료로 유지한다.'},
    '불명_Record5_940626':{grade:'GENE / EXTREME',tone:'bio',type:'비인가 유전자 연구',map:'Black Site / 아마리온 연계 감시',op:'world',factions:['F.H.C','Amarion','U.A.C'],equipment:['생체 프린팅 장비','유전자 분석 자료'],phenomena:['괴이 유전자','강제 진화','인류 정화 사상'],attachments:['유전자 기록','기술 위험 분석','격리 판정'],annotation:'사상 위험과 기술 위험이 결합된 고위험 생체 기록.'}
  };
  window.ProjectCurseRecordCaseMeta = recordCaseMeta;

  function caseEsc(v){
    return String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function caseChips(items, emptyLabel){
    const list=Array.isArray(items)?items.filter(Boolean):[];
    if(!list.length) return `<span class="pc5133-chip muted">${caseEsc(emptyLabel || '미연결')}</span>`;
    return list.map(x=>`<span class="pc5133-chip">${caseEsc(x)}</span>`).join('');
  }

  function caseDefaultMeta(id, root){
    const title=(root && root.querySelector('.doc-title') && root.querySelector('.doc-title').textContent.trim()) || id || '기록';
    return {grade:'ARCHIVE / FIELD',tone:'default',type:title,map:'관련 작전권 미지정',op:'world',factions:['U.A.C'],equipment:[],phenomena:[],attachments:['본문 기록','첨부 이미지','페이지 기록'],annotation:'기존 기록 본문은 유지하고 열람 구조만 사건 파일 형식으로 재구성한다.'};
  }

  function casePrimaryTabs(root){
    const tabs=[...root.querySelectorAll('.paged-record > .page-tabs > .page-tab')].slice(0,8);
    return tabs.map((b,i)=>`<button type="button" data-pc5133-tab="${i}"><i>${String(i+1).padStart(2,'0')}</i><span>${caseEsc((b.textContent||'기록면').trim())}</span></button>`).join('') || '<span class="pc5133-empty">기록면 없음</span>';
  }

  function caseSubrecordSummary(root){
    const subTabs=[...root.querySelectorAll('.nested-record > .sub-tabs > .sub-tab')].slice(0,8).map(b=>(b.textContent||'부속 기록').trim());
    return subTabs.length ? subTabs : ['본문 기록','첨부 이미지','시스템 주석'];
  }

  function enhanceCaseFile(root,id){
    if(!root) return;
    const meta=Object.assign(caseDefaultMeta(id,root), recordCaseMeta[id] || {});
    root.classList.add('pc5133-case-file',`pc5133-tone-${meta.tone || 'default'}`);
    root.dataset.caseTone=meta.tone || 'default';
    if(root.dataset.pc5133Enhanced==='1'){
      updateCaseRail(root);
      return;
    }
    root.dataset.pc5133Enhanced='1';

    const header=root.querySelector(':scope > .doc-header');
    const content=root.querySelector(':scope > .record-content');
    if(!header || !content) return;

    const frame=document.createElement('div');
    frame.className='pc5133-case-frame';
    const rail=document.createElement('aside');
    rail.className='pc5133-case-rail';
    rail.innerHTML=`<div class="pc5133-rail-title"><b>CASE INDEX</b><span>${caseEsc(id)}</span></div><div class="pc5133-rail-tabs">${casePrimaryTabs(root)}</div><div class="pc5133-rail-sub"><b>부속 기록</b>${caseChips(caseSubrecordSummary(root),'부속 없음')}</div>`;

    const body=document.createElement('section');
    body.className='pc5133-case-body';
    body.appendChild(header);
    body.appendChild(content);

    const metaPanel=document.createElement('aside');
    metaPanel.className='pc5133-case-meta';
    metaPanel.innerHTML=`<div class="pc5133-meta-head"><span>U.A.C CASE FILE</span><b>${caseEsc(meta.grade)}</b></div>
      <div class="pc5133-meta-grid">
        <span>기록 유형</span><strong>${caseEsc(meta.type)}</strong>
        <span>관련 권역</span><strong>${caseEsc(meta.map)}</strong>
        <span>연결 상태</span><strong>기록 색인만 표시</strong>
      </div>
      <section><b>관련 세력</b><div>${caseChips(meta.factions,'세력 미연결')}</div></section>
      <section><b>관련 장비</b><div>${caseChips(meta.equipment,'장비 미연결')}</div></section>
      <section><b>현상 / 개체</b><div>${caseChips(meta.phenomena,'현상 미연결')}</div></section>
      <section><b>첨부 / 하위 기록</b><div>${caseChips(meta.attachments,'첨부 없음')}</div></section>
      <section class="pc5133-system-note"><b>U.A.C 주석</b><p>${caseEsc(meta.annotation)}</p></section>`;

    frame.appendChild(rail);
    frame.appendChild(body);
    frame.appendChild(metaPanel);
    root.appendChild(frame);

    rail.querySelectorAll('[data-pc5133-tab]').forEach(btn=>{
      btn.addEventListener('click',e=>{
        e.preventDefault();
        const i=Number(btn.getAttribute('data-pc5133-tab')||0);
        const pageTabs=root.querySelectorAll('.paged-record > .page-tabs > .page-tab');
        if(pageTabs[i]) pageTabs[i].click();
        updateCaseRail(root);
        if(window.ProjectCurseAudio) window.ProjectCurseAudio.playCue('command',120);
      });
    });
    root.querySelectorAll('.paged-record > .page-tabs > .page-tab').forEach(btn=>{
      if(btn.dataset.pc5133TabSync) return;
      btn.dataset.pc5133TabSync='1';
      btn.addEventListener('click',()=>setTimeout(()=>updateCaseRail(root),0));
    });
    metaPanel.querySelectorAll('[data-pc5133-open-op]').forEach(btn=>{
      btn.addEventListener('click',e=>{
        e.preventDefault();
        const op=btn.getAttribute('data-pc5133-open-op')||'world';
        if(typeof window.ProjectCurseSelectOperation==='function') window.ProjectCurseSelectOperation(op,{show:true,closeMap:true});
        if(window.ProjectCurseAudio) window.ProjectCurseAudio.playCue('command',140);
      });
    });
    updateCaseRail(root);
  }

  function updateCaseRail(root){
    if(!root) return;
    const rail=root.querySelector('.pc5133-case-rail');
    if(!rail) return;
    const active=[...root.querySelectorAll('.paged-record > .page-tabs > .page-tab')].findIndex(b=>b.classList.contains('active'));
    rail.querySelectorAll('[data-pc5133-tab]').forEach((btn,i)=>btn.classList.toggle('active',i===active));
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
      document.body.classList.add('pc5133-case-file-open');
      archiveViewer.querySelectorAll('.record-detail').forEach(el=>{el.hidden=true;});
      selected.hidden=false;
      enhanceCaseFile(selected,id);
      resetRecordState(selected);
      updateCaseRail(selected);
      const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0;
      const loaderEl=document.getElementById('recordLoading'); if(loaderEl) loaderEl.classList.remove('show');
      playCue('open',180);
    });
  }
  function closeInternalRecord(e){
    if(e){e.preventDefault(); e.stopPropagation();}
    if(archiveViewer){archiveViewer.hidden=true; archiveViewer.querySelectorAll('.record-detail').forEach(el=>{el.hidden=true;});}
    document.body.classList.remove('pc5133-case-file-open');
    if(archiveListWrap){archiveListWrap.classList.remove('is-hidden'); archiveListWrap.querySelectorAll('details').forEach(d=>d.open=true);}
    const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0;
    playCue('menu',160);
  }
  window.ProjectCurseShowInternalRecord=showInternalRecord;
  window.ProjectCurseCloseInternalRecord=closeInternalRecord;
  document.querySelectorAll('.open-record[data-record]').forEach(btn=>{
    btn.addEventListener('click',e=>{e.preventDefault(); showInternalRecord(btn.dataset.record);});
  });
  document.querySelectorAll('.record-back').forEach(btn=>btn.addEventListener('click',e=>closeInternalRecord(e)));

});




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
      if(notice && on) notice.textContent='RESTRICTED RECORD MOUNT / PARTIAL RECORD RELEASED';
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
      el.innerHTML='<div class="top"><b>RESTRICTED RECORD MOUNT</b><span>RESTRICTED NODE</span></div>'+ 
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
        if(notice) notice.textContent='BIOLOGICAL TRACE SCAN / BIOLOGICAL RECORD MOUNT / HOST RESPONSE INDEX';
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
      // 5.15.2d: disable old synthesized faction beeps. Use unified analog tape/relay audio bus.
      try{
        const cue = (kind==='hostile'||kind==='ritual') ? 'restricted' : 'drawer';
        if(window.ProjectCurseAudio && typeof window.ProjectCurseAudio.playCue==='function'){
          window.ProjectCurseAudio.playCue(cue, 260);
        }
      }catch(e){}
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
          /* slide sweep disabled in 5.15.2z */
        },true);
      });
    }

    markRelationTree();
    addFactionInfoPulse();
    setTimeout(()=>{markRelationTree(); addFactionInfoPulse();},600);
  });
})();

window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {patch54:'Faction Relation Trace'});


// MapPatch 5.9.1 — MapViewport_TelemetryLog_Expansion
// Clean runtime expansion: single map renderer with enlarged viewport and telemetry log panel.
// This module owns the main drawer, map drawer, city operation map, and single-DOM relation tree.
(function(){
  const ready = (fn) => { if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); };

  ready(function(){
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const mark = (name) => 'assets/faction_marks/' + name + '.webp';

    const pages = Array.from(document.querySelectorAll('.content-page'));
    const sideLinks = Array.from(document.querySelectorAll('.side-menu a[data-target]'));
    const shell = document.querySelector('.pc584-city-map-shell');
    const stage = document.getElementById('pc584-city-stage');
    const info = document.getElementById('pc584-city-info');

    function showPage(id){
      if(!pages.length) return;
      if(!pages.some(p => p.id === id)) id = 'history';
      pages.forEach(p => p.classList.toggle('active', p.id === id));
      sideLinks.forEach(a => {
        a.classList.toggle('active', a.dataset.target === id);
      });
      const content = document.querySelector('.legacy-content');
      if(content) content.scrollTop = 0;
      history.replaceState(null, '', '#' + id);
    }

    function syncAccordionFor(link){
      document.querySelectorAll('.pc585-menu-group').forEach(group => {
        const shouldOpen = !!(link && group.contains(link));
        if(shouldOpen){
          group.classList.add('open');
          const heading = group.querySelector('.pc585-menu-heading');
          if(heading){
            heading.setAttribute('aria-expanded','true');
            const icon = heading.querySelector('span');
            if(icon) icon.textContent = '▾';
          }
        }
      });
    }

    function setupMainDrawer(){
      const body = document.body;
      body.classList.add('pc584-city-operation-ready');
      body.classList.remove('pc584-main-drawer-open');
      const sidebar = document.querySelector('.legacy-sidebar');
      if(!sidebar) return;
      document.querySelectorAll('.pc584-main-drawer-toggle,.pc584-drawer-backdrop').forEach(el => el.remove());

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'pc584-main-drawer-toggle';
      toggle.setAttribute('aria-label', '왼쪽 메뉴 열기');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';

      const backdrop = document.createElement('div');
      backdrop.className = 'pc584-drawer-backdrop';
      document.body.append(toggle, backdrop);

      function set(open){
        body.classList.toggle('pc584-main-drawer-open', !!open);
        toggle.textContent = open ? '×' : '☰';
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      set(false);

      toggle.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); set(!body.classList.contains('pc584-main-drawer-open')); });
      backdrop.addEventListener('click', () => set(false));
      document.addEventListener('keydown', e => { if(e.key === 'Escape') { set(false); closeMapDrawer(); } });

      document.querySelectorAll('.pc585-menu-heading').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          const group = btn.closest('.pc585-menu-group');
          if(!group) return;
          const open = !group.classList.contains('open');
          group.classList.toggle('open', open);
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
          const icon = btn.querySelector('span');
          if(icon) icon.textContent = open ? '▾' : '▸';
        });
      });

      sideLinks.forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          e.stopImmediatePropagation();
          const target = link.dataset.target || 'history';
          showPage(target === 'zone-map' ? 'history' : target);
          syncAccordionFor(link);
          set(false);
        }, true);
      });
    }


    /* Map/runtime data removed in 5.15.2aa: 지역지도·작전지도 모듈은 현재 빌드에서 사용하지 않는다. */
    function closeMapDrawer(){}
    function setupMapDrawer(){}
    function renderOperation(){}
    function selectOperation(op, opts){
      showPage('history');
      const link = document.querySelector('.side-menu a[data-target="history"]');
      syncAccordionFor(link);
    }
    window.ProjectCurseSelectOperation = function(){ selectOperation('history', {show:true}); };
    window.ProjectCurseActivateOperation = function(){};

    function renderRelation(){
      const root = document.getElementById('pc584-relation-root');
      if(!root) return;
      const relationInfo = {
        uac:['U.A.C','중앙 통제','CORE-0','N.H.C / S.I.D / F.H.C / C.P.D / A.R.F','구역 분류, 기록 통제, 기관 간 작전 조율을 담당하는 중심 기관이다.'],
        nhc:['N.H.C','현장 작전','FIELD-1','U.A.C / C.P.D / A.R.F','레드존 투입, 봉쇄선 유지, 회수·소각 현장 작전을 맡는다.'],
        sid:['S.I.D','정보/감청','INTEL-1','U.A.C / F.H.C / N.H.C','오염 통신, 귀환자 진술, 우시노다교 흔적을 검증한다.'],
        fhc:['F.H.C','봉인 기록','SEAL-1','U.A.C / S.I.D','오컬트 기록, 봉인 자료, 극비 문서 격리를 담당한다.'],
        cpd:['C.P.D','민간 대피','CIV-1','U.A.C / N.H.C','대피 회랑, 검문소, 귀환자 1차 선별을 담당한다.'],
        arf:['A.R.F','회수/복구','REC-1','U.A.C / N.H.C','장비, 사체, 기록 매체 회수와 복구 절차를 담당한다.'],
        ushinoda:['우시노다교','적대 의식 세력','HOSTILE','U.A.C / N.H.C / S.I.D','의식성 오염과 Blood Gate 관련 위험 세력이다.'],
        haimun:['하이문','불명 네트워크','WATCH','S.I.D / 신디케이트','정보 중개와 비인가 경로가 확인되는 감시 대상이다.'],
        syndicate:['신디케이트','오염 장비 유통','HOSTILE','N.H.C / A.R.F','오염 장비 거래와 이탈 네트워크 관련 세력이다.'],
        amarion:['아마리온','비인가 연구','RESEARCH','F.H.C / U.A.C','Black Site와 인공 개체 연구 의혹이 연결된 대상이다.']
      };
      const rows = [
        ['협력','U.A.C ↔ N.H.C','작전 승인','현장 투입과 봉쇄 명령이 연결된다.','uac nhc'],
        ['협력','U.A.C ↔ S.I.D','정보 검증','감청과 진술 검증이 작전 판단에 반영된다.','uac sid'],
        ['협력','U.A.C ↔ F.H.C','기록 봉인','위험 기록과 오컬트 자료가 격리된다.','uac fhc'],
        ['협력','U.A.C ↔ C.P.D','민간 통제','대피 회랑과 검문 절차가 연결된다.','uac cpd'],
        ['협력','U.A.C ↔ A.R.F','회수 복구','회수물과 폐기 절차가 연결된다.','uac arf'],
        ['적대','U.A.C ↔ 우시노다교','의식 차단','의식성 오염과 Blood Gate를 차단한다.','uac ushinoda'],
        ['감시','S.I.D ↔ 하이문','정보 감시','비인가 정보 흐름을 추적한다.','sid haimun'],
        ['적대','N.H.C ↔ 신디케이트','장비 차단','오염 장비 유통을 추적·차단한다.','nhc syndicate'],
        ['감시','F.H.C ↔ 아마리온','연구 격리','비인가 연구 기록을 봉인한다.','fhc amarion']
      ];
      function node(key,label,role,tone){
        const img = key === 'ushinoda' ? 'ushinoda' : key;
        return `<button type="button" class="pc584-relation-node ${tone||''}" data-relation-key="${key}"><img src="${mark(img)}" alt="${esc(label)}"><b>${esc(label)}</b><small>${esc(role)}</small></button>`;
      }
      root.innerHTML = `
        <div class="pc584-relation-stage">
          <div class="pc584-relation-core">${node('uac','U.A.C','중앙 통제','root')}</div>
          <div class="pc584-relation-trunk"></div>
          <div class="pc584-relation-agencies">
            <div>${node('nhc','N.H.C','현장작전')}<span>봉쇄 / 회수 / 소각</span></div>
            <div>${node('sid','S.I.D','정보/감청')}<span>감청 / 진술 검증</span></div>
            <div>${node('fhc','F.H.C','봉인기록','research')}<span>오컬트 자료 격리</span></div>
            <div>${node('cpd','C.P.D','민간대피')}<span>대피 / 검문 / 선별</span></div>
            <div>${node('arf','A.R.F','회수/복구')}<span>복구 / 회수물 분류</span></div>
          </div>
          <div class="pc584-relation-watchline"><span>감시 / 적대 / 불명 연결</span></div>
          <div class="pc584-relation-externals">
            ${node('ushinoda','우시노다교','의식성 오염','hostile')}
            ${node('haimun','하이문','정보 중개','watch')}
            ${node('syndicate','신디케이트','오염 장비','hostile')}
            ${node('amarion','아마리온','비인가 연구','research')}
          </div>
        </div>
        <div class="pc584-relation-status">
          <span><b>선택 세력</b><i data-r-name>U.A.C</i></span>
          <span><b>상태 태그</b><i data-r-tag>중앙 통제</i></span>
          <span><b>관계 등급</b><i data-r-grade>CORE-0</i></span>
          <span><b>직접 연결</b><i data-r-links>N.H.C / S.I.D / F.H.C / C.P.D / A.R.F</i></span>
          <span class="wide"><b>U.A.C 판단</b><i data-r-summary>구역 분류, 기록 통제, 기관 간 작전 조율을 담당하는 중심 기관이다.</i></span>
        </div>
        <table class="relation-table pc584-relation-table"><thead><tr><th>구분</th><th>관계</th><th>상태</th><th>설명</th></tr></thead><tbody>${rows.map(r => `<tr data-rel-row="${esc(r[4])}"><td class="${r[0].includes('적대')?'hostile':r[0].includes('감시')?'neutral':'friendly'}">${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table>`;

      function update(key){
        const d = relationInfo[key] || relationInfo.uac;
        root.querySelectorAll('.pc584-relation-node').forEach(n => n.classList.toggle('active', n.dataset.relationKey === key));
        root.querySelector('[data-r-name]').textContent = d[0];
        root.querySelector('[data-r-tag]').textContent = d[1];
        root.querySelector('[data-r-grade]').textContent = d[2];
        root.querySelector('[data-r-links]').textContent = d[3];
        root.querySelector('[data-r-summary]').textContent = d[4];
        root.querySelectorAll('.relation-table tbody tr').forEach(row => row.classList.toggle('pc584-row-active', (row.dataset.relRow || '').split(/\s+/).includes(key)));
      }
      root.querySelectorAll('.pc584-relation-node').forEach(btn => btn.addEventListener('click', () => update(btn.dataset.relationKey || 'uac')));
      update('uac');
    }

    setupMainDrawer();
    setupMapDrawer();
    renderRelation();

    // Initial state
    const initialHash = (location.hash || '#history').slice(1);
    showPage(initialHash === 'zone-map' ? 'history' : initialHash);
  });
})();


// MapPatch 5.13.0 — CommandCenter_UI_Rebuild.
// Lightweight dashboard bindings only. Side menu full rebuild remains 5.13.1.
(function(){
  const ready = (fn) => { if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); };
  ready(function(){
    function activateOperation(op){
      if(!op) return;
      if(typeof window.ProjectCurseSelectOperation === 'function'){
        window.ProjectCurseSelectOperation(op, {show:true, closeMap:true});
        return;
      }
      const link = document.querySelector(`.side-menu a[data-target="zone-map"][data-operation="${CSS.escape(op)}"]`);
      if(link) link.click();
    }

    function openLinkedRecord(recordId){
      if(!recordId) return;
      const archiveLink = document.querySelector('.side-menu a[data-target="archive-entry"]');
      if(archiveLink) archiveLink.click();
      setTimeout(() => {
        if(typeof window.ProjectCurseShowInternalRecord === 'function'){
          window.ProjectCurseShowInternalRecord(recordId);
          document.body.classList.add('pc5130-command-record-opened');
          setTimeout(()=>document.body.classList.remove('pc5130-command-record-opened'), 900);
        }
      }, 120);
    }

    document.querySelectorAll('[data-pc5130-op]').forEach(btn => {
      if(btn.dataset.bound5130) return;
      btn.dataset.bound5130 = '1';
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        activateOperation(btn.getAttribute('data-pc5130-op'));
      });
    });

    document.querySelectorAll('[data-pc5130-record]').forEach(btn => {
      if(btn.dataset.bound5130) return;
      btn.dataset.bound5130 = '1';
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        openLinkedRecord(btn.getAttribute('data-pc5130-record'));
      });
    });
  });
})();


// MapPatch 5.13.1 — SideMenu_CommandCenter_Rebuild.
(function(){
  const ready = (fn) => { if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); };
  ready(function(){
    function ensureModuleToast(){
      let el = document.querySelector('.pc5131-module-toast');
      if(el) return el;
      el = document.createElement('div');
      el.className = 'pc5131-module-toast';
      el.setAttribute('aria-live','polite');
      document.body.appendChild(el);
      return el;
    }

    function showModuleToast(label){
      const el = ensureModuleToast();
      el.textContent = `${label || 'MODULE'} / ACCESS LOCKED`;
      el.classList.add('show');
      clearTimeout(el._pc5131Timer);
      el._pc5131Timer = setTimeout(()=>el.classList.remove('show'), 1400);
    }

    document.querySelectorAll('[data-pc5131-module-placeholder]').forEach(btn => {
      if(btn.dataset.bound5131) return;
      btn.dataset.bound5131 = '1';
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const label = (btn.querySelector('b') && btn.querySelector('b').textContent) || btn.getAttribute('data-pc5131-module-placeholder') || 'MODULE';
        document.body.classList.add('pc5131-module-pending');
        showModuleToast(label);
        setTimeout(()=>document.body.classList.remove('pc5131-module-pending'), 900);
      });
    });
  });
})();


// MapPatch 5.13.2 — SoundSystem_Remaster runtime bindings.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5132-audio-remastered');
    document.body.classList.add('pc5133a-atmosphere-restored');
    function cue(name,cooldown){
      if(window.ProjectCurseAudio && typeof window.ProjectCurseAudio.playCue==='function'){
        window.ProjectCurseAudio.playCue(name,cooldown || 90);
      }
    }
    const videoRecords=new Set(['Immortality_860201','Sakuma_Tape_991028','불명_Record1_860204']);
    const bioRecords=new Set(['타락 개체_860722','FCR_Archive_890402','불명_Record2_860205','불명_Record5_940626']);
    const restrictedRecords=new Set(['Cults_871104']);

    document.addEventListener('click',function(e){
      const target=e.target && e.target.closest ? e.target.closest('button,a,[role="button"]') : null;
      if(!target) return;

      if(target.matches('[data-pc5131-module-placeholder]')){
        cue('denied',260);
        return;
      }
      if(target.matches('.pc585-menu-heading,[data-dock-toggle],.pc584-map-drawer-toggle,.pc584-main-drawer-toggle')){
        cue('drawer',120);
        return;
      }
      if(target.matches('.pc589-marker,.pc589-route,.pc589-facility-label,.pc584-operation-filter')){
        cue('marker',260);
        return;
      }
      if(target.matches('[data-pc5124-open-record],[data-pc5130-record]')){
        const recordId=target.getAttribute('data-record-id')||target.getAttribute('data-pc5130-record')||'';
        if(restrictedRecords.has(recordId)) cue('restricted',260);
        else if(videoRecords.has(recordId)) cue('video',220);
        else if(bioRecords.has(recordId)) cue('radio',180);
        else cue('open',160);
        return;
      }
      if(target.matches('.open-record[data-record]')){
        const recordId=target.getAttribute('data-record')||'';
        if(restrictedRecords.has(recordId)) cue('restricted',260);
        else if(videoRecords.has(recordId)) cue('video',220);
        else if(bioRecords.has(recordId)) cue('radio',180);
        else cue('open',160);
        return;
      }
      if(target.matches('[data-pc5130-op],.pc5131-operation-list a[data-operation],.pc5131-module-items a[data-target]')){
        cue('command',100);
        return;
      }
    },true);

    // Atmosphere restore: hover alert cue disabled; visual warning only.
  });
})();


// MapPatch 5.13.3c — SideMenu_AnalogArchive_Rework.
// Keeps the existing page/router behavior and adds archive-record/damaged-node directory actions.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5133c-side-archive');

    function audioCue(name, cooldown){
      if(window.ProjectCurseAudio && typeof window.ProjectCurseAudio.playCue==='function'){
        window.ProjectCurseAudio.playCue(name, cooldown || 160);
      }
    }

    function ensureNotice(){
      let el=document.querySelector('.pc5133c-node-notice');
      if(el) return el;
      el=document.createElement('div');
      el.className='pc5133c-node-notice';
      el.setAttribute('aria-live','polite');
      document.body.appendChild(el);
      return el;
    }

    function showNotice(code, label){
      const el=ensureNotice();
      el.innerHTML=`<b>${label || 'NODE'}</b><span>${code || 'SIGNAL DEGRADED'}</span>`;
      el.classList.add('show');
      clearTimeout(el._pc5133cTimer);
      el._pc5133cTimer=setTimeout(()=>el.classList.remove('show'),1500);
    }

    function openRecord(recordId){
      if(!recordId) return;
      const archiveLink=document.querySelector('.side-menu a[data-target="archive-entry"]');
      if(archiveLink) archiveLink.click();
      setTimeout(()=>{
        if(typeof window.ProjectCurseShowInternalRecord==='function'){
          window.ProjectCurseShowInternalRecord(recordId);
          document.body.classList.add('pc5133c-record-jump');
          setTimeout(()=>document.body.classList.remove('pc5133c-record-jump'),900);
        }
      },120);
    }

    document.querySelectorAll('[data-pc5133c-record]').forEach(btn=>{
      if(btn.dataset.bound5133c) return;
      btn.dataset.bound5133c='1';
      btn.addEventListener('click',e=>{
        e.preventDefault();
        e.stopPropagation();
        const id=btn.getAttribute('data-pc5133c-record') || '';
        openRecord(id);
        audioCue(btn.classList.contains('restricted') ? 'restricted' : 'record', 220);
      });
    });

    document.querySelectorAll('[data-pc5133c-damaged]').forEach(btn=>{
      if(btn.dataset.bound5133c) return;
      btn.dataset.bound5133c='1';
      btn.addEventListener('click',e=>{
        e.preventDefault();
        e.stopPropagation();
        const label=(btn.querySelector('b') && btn.querySelector('b').textContent) || 'NODE';
        const code=(btn.querySelector('small') && btn.querySelector('small').textContent) || 'SIGNAL DEGRADED';
        showNotice(code, label);
        audioCue(btn.classList.contains('restricted') ? 'denied' : 'drawer', 260);
      });
    });
  });
})();


// MapPatch 5.13.4 — FactionNetwork_UI_Rebuild.
// Rebuilds faction relation/info presentation as U.A.C closed-network intelligence analysis.
// Existing faction lore bodies are not rewritten.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5134-faction-network-ready');

    const esc=(v)=>String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const mark=(key)=>`assets/faction_marks/${key}.webp`;

    const factionIntel={
      uac:{name:'U.A.C',role:'중앙 통제 / 기록 권한',status:'CORE-0',trust:'CONTROL',risk:'전역 감시',op:'세계 상황판',records:['Redzone_881120','NHC_Manual_891219'],links:['N.H.C','S.I.D','F.H.C','C.P.D','A.R.F'],note:'구역 분류와 기록 권한을 집중 보유한다. 모든 기관 파일은 U.A.C 노드를 경유한다.'},
      nhc:{name:'N.H.C',role:'현장 작전 / 봉쇄선',status:'FIELD-1',trust:'CONTROLLED',risk:'작전 손실',op:'부산 / 란저우',records:['NHC_Manual_891219','FCR_Archive_890402'],links:['U.A.C','C.P.D','A.R.F'],note:'레드존 투입과 회수·소각 절차의 최전선. 장비 손실 시 오염 확산 위험이 상승한다.'},
      sid:{name:'S.I.D',role:'정보 / 감청 / 진술 검증',status:'INTEL-1',trust:'WATCHED',risk:'신호 오염',op:'동아시아 감시권',records:['Sakuma_Tape_991028','Redzone_881120'],links:['U.A.C','F.H.C','하이문'],note:'감청 기록과 귀환자 진술을 대조한다. Ghost Channel 계열 자료와 직접 연결된다.'},
      fhc:{name:'F.H.C',role:'봉인 기록 / 극비 분석',status:'SEAL-1',trust:'RESTRICTED',risk:'기록 역오염',op:'북해-함부르크',records:['Cults_871104','불명_Record1_860204'],links:['U.A.C','S.I.D','아마리온'],note:'오컬트 기록과 비인가 연구 자료를 봉인한다. 열람 흔적 자체가 추적 대상이 될 수 있다.'},
      amarion:{name:'Amarion',role:'비인가 연구 / 기업 자료',status:'RESEARCH-WATCH',trust:'UNSTABLE',risk:'Black Site 연계',op:'감시 후보',records:['불명_Record1_860204','불명_Record5_940626'],links:['F.H.C','U.A.C'],note:'공식 협력 범위를 넘어선 연구 흔적이 확인된다. 회수 영상은 교육 자료로 위장되어 있다.'},
      syndicate:{name:'Syndicate',role:'이탈 네트워크 / 오염 장비',status:'HOSTILE-WATCH',trust:'HOSTILE',risk:'오염 장비 유통',op:'북미 외곽 감시권',records:['불명_Record3_920711','불명_Record4_930314'],links:['N.H.C','A.R.F','Red Wolf'],note:'이탈 부대와 오염 장비 유통망이 연결된다. 공식 조직으로 분류하기 어렵다.'},
      ushinoda:{name:'Ushnoda Cult / 우시노다교',role:'의식성 오염 / 적대 종교망',status:'HOSTILE',trust:'BLOCKED',risk:'Blood Gate / 인신공양',op:'란저우 / 도심 침투권',records:['Cults_871104','Sakuma_Tape_991028'],links:['S.I.D','F.H.C','하이문'],note:'의식성 오염의 중심. 일부 기록은 우시노다교 대신 Ushnoda Cult 명칭으로 봉인되어 있다.'},
      haimun:{name:'Haimun / 하이문',role:'불명 정보 중개망',status:'WATCH',trust:'UNKNOWN',risk:'은닉 루트',op:'도심 침투권',records:['Cults_871104'],links:['S.I.D','신디케이트','우시노다교'],note:'흔적은 확인되나 구조가 불명확하다. 정보 중개와 의식 거점 연결 정황이 남아 있다.'},
      ashcrew:{name:'Ash Crew',role:'오염 처리 / 소각',status:'ASH-1',trust:'CONTROLLED',risk:'현장 누락',op:'회수·소각 구역',records:['NHC_Manual_891219'],links:['N.H.C','A.R.F'],note:'오염 처리 구역과 소각 절차에 연결된다. 공식 기관 밖에서 움직이는 경우가 있어 추적이 필요하다.'},
      arf:{name:'A.R.F',role:'회수 / 복구 / 분류',status:'REC-1',trust:'CONTROLLED',risk:'회수물 역오염',op:'부산 / 란저우',records:['NHC_Manual_891219','FCR_Archive_890402'],links:['U.A.C','N.H.C','C.P.D'],note:'사체, 장비, 기록 매체 회수 및 분류를 담당한다. 회수 실패 자료는 별도 격리된다.'},
      cpd:{name:'C.P.D',role:'민간 보호 / 검문 / 선별',status:'CIV-1',trust:'CONTROLLED',risk:'귀환자 선별 실패',op:'부산 / 델리',records:['FCR_Archive_890402'],links:['U.A.C','N.H.C','A.R.F'],note:'대피 회랑과 검문소를 관리한다. 귀환자 선별 실패 시 민간 보호선 전체가 오염될 수 있다.'}
    };

    const relationRows=[
      ['CONTROL','U.A.C','N.H.C','현장 투입 / 봉쇄 명령','CONTROLLED'],
      ['INTEL','U.A.C','S.I.D','감청 / 진술 검증','WATCHED'],
      ['SEAL','U.A.C','F.H.C','기록 봉인 / 제한 열람','RESTRICTED'],
      ['CIV','U.A.C','C.P.D','대피 회랑 / 귀환자 선별','CONTROLLED'],
      ['REC','U.A.C','A.R.F','회수물 / 기록 매체 복구','CONTROLLED'],
      ['HOSTILE','U.A.C','Ushnoda Cult','의식성 오염 / Blood Gate 차단','BLOCKED'],
      ['WATCH','S.I.D','Haimun','비인가 정보 흐름 추적','SIGNAL DEGRADED'],
      ['HOSTILE','N.H.C','Syndicate','오염 장비 유통 차단','ACTIVE WATCH'],
      ['RESEARCH','F.H.C','Amarion','비인가 연구 자료 봉인','CLEARANCE MISMATCH']
    ];

    function chipList(list){
      return (list||[]).map(x=>`<span>${esc(x)}</span>`).join('');
    }

    function renderNetwork(){
      const root=document.getElementById('pc584-relation-root');
      if(!root) return;
      root.classList.add('pc5134-intel-network-root');
      const nodes=['uac','nhc','sid','fhc','cpd','arf','ushinoda','haimun','syndicate','amarion'];
      root.innerHTML=`
        <div class="pc5134-network-shell">
          <aside class="pc5134-network-left">
            <div class="pc5134-node-header"><span>NETWORK INDEX</span><b>U.A.C CENTERED</b><small>PARTIAL CONNECTION LOG</small></div>
            <div class="pc5134-node-list">
              ${nodes.map(key=>{
                const d=factionIntel[key];
                const imgKey=key==='ushinoda'?'ushinoda':key;
                return `<button type="button" data-pc5134-node="${esc(key)}"><img src="${mark(imgKey)}" alt="${esc(d.name)}"><b>${esc(d.name)}</b><small>${esc(d.status)} / ${esc(d.trust)}</small></button>`;
              }).join('')}
            </div>
          </aside>
          <section class="pc5134-network-center">
            <div class="pc5134-signal-frame">
              <div class="pc5134-signal-line horizontal"></div>
              <div class="pc5134-signal-line vertical"></div>
              <button type="button" class="pc5134-map-node core" data-pc5134-node="uac">U.A.C</button>
              <button type="button" class="pc5134-map-node n1" data-pc5134-node="nhc">N.H.C</button>
              <button type="button" class="pc5134-map-node n2" data-pc5134-node="sid">S.I.D</button>
              <button type="button" class="pc5134-map-node n3" data-pc5134-node="fhc">F.H.C</button>
              <button type="button" class="pc5134-map-node n4" data-pc5134-node="cpd">C.P.D</button>
              <button type="button" class="pc5134-map-node n5" data-pc5134-node="arf">A.R.F</button>
              <button type="button" class="pc5134-map-node hostile h1" data-pc5134-node="ushinoda">Ushnoda Cult</button>
              <button type="button" class="pc5134-map-node watch h2" data-pc5134-node="haimun">Haimun</button>
              <button type="button" class="pc5134-map-node hostile h3" data-pc5134-node="syndicate">Syndicate</button>
              <button type="button" class="pc5134-map-node watch h4" data-pc5134-node="amarion">Amarion</button>
            </div>
            <div class="pc5134-relation-log">
              <b>CONNECTION LOG</b>
              ${relationRows.map(r=>`<div data-pc5134-row="${esc(r[1]+' '+r[2])}"><i>${esc(r[0])}</i><span>${esc(r[1])} ↔ ${esc(r[2])}</span><small>${esc(r[3])} / ${esc(r[4])}</small></div>`).join('')}
            </div>
          </section>
          <aside class="pc5134-network-right">
            <div class="pc5134-dossier-head"><span>SELECTED NODE</span><b data-pc5134-name>U.A.C</b><small data-pc5134-status>CORE-0</small></div>
            <div class="pc5134-dossier-grid">
              <span>역할</span><b data-pc5134-role>중앙 통제</b>
              <span>감시 상태</span><b data-pc5134-trust>CONTROL</b>
              <span>위험 항목</span><b data-pc5134-risk>전역 감시</b>
              <span>관할 범위</span><b data-pc5134-op>세계 상황판</b>
            </div>
            <section><b>직접 연결</b><div data-pc5134-links></div></section>
            <section><b>관련 기록</b><div data-pc5134-records></div></section>
            <section class="pc5134-node-note"><b>U.A.C 판단</b><p data-pc5134-note></p></section>
          </aside>
        </div>`;

      function select(key){
        const d=factionIntel[key]||factionIntel.uac;
        root.querySelectorAll('[data-pc5134-node]').forEach(el=>el.classList.toggle('active',el.getAttribute('data-pc5134-node')===key));
        root.querySelector('[data-pc5134-name]').textContent=d.name;
        root.querySelector('[data-pc5134-status]').textContent=d.status;
        root.querySelector('[data-pc5134-role]').textContent=d.role;
        root.querySelector('[data-pc5134-trust]').textContent=d.trust;
        root.querySelector('[data-pc5134-risk]').textContent=d.risk;
        root.querySelector('[data-pc5134-op]').textContent=d.op;
        root.querySelector('[data-pc5134-links]').innerHTML=chipList(d.links);
        root.querySelector('[data-pc5134-records]').innerHTML=(d.records||[]).map(id=>`<button type="button" data-pc5134-record="${esc(id)}">${esc(id)}</button>`).join('');
        root.querySelector('[data-pc5134-note]').textContent=d.note;
        root.querySelectorAll('[data-pc5134-row]').forEach(row=>row.classList.toggle('active',(row.getAttribute('data-pc5134-row')||'').toLowerCase().includes((d.name.split('/')[0]||'').trim().toLowerCase())));
        if(window.ProjectCurseAudio) window.ProjectCurseAudio.playCue('drawer',180);
      }

      root.querySelectorAll('[data-pc5134-node]').forEach(btn=>{
        btn.addEventListener('click',e=>{
          e.preventDefault();
          select(btn.getAttribute('data-pc5134-node')||'uac');
        });
      });

      root.addEventListener('click',e=>{
        const rec=e.target.closest && e.target.closest('[data-pc5134-record]');
        if(!rec) return;
        e.preventDefault();
        const id=rec.getAttribute('data-pc5134-record');
        const archiveLink=document.querySelector('.side-menu a[data-target="archive-entry"]');
        if(archiveLink) archiveLink.click();
        setTimeout(()=>{ if(typeof window.ProjectCurseShowInternalRecord==='function') window.ProjectCurseShowInternalRecord(id); },120);
      });

      select('uac');
    }

    function enhanceFactionDetail(){
      const detail=document.getElementById('factionDetail');
      if(!detail || detail.dataset.pc5134Enhanced==='1') return;
      const active=document.querySelector('.faction-tile.active');
      const key=(active && active.dataset.key) || 'uac';
      const d=factionIntel[key] || factionIntel.uac;
      detail.dataset.pc5134Enhanced='1';
      detail.classList.add('pc5134-faction-dossier');
      const panel=document.createElement('aside');
      panel.className='pc5134-faction-side';
      panel.innerHTML=`<div class="pc5134-side-head"><span>AGENCY NODE</span><b>${esc(d.status)}</b></div>
        <div class="pc5134-side-grid"><span>역할</span><b>${esc(d.role)}</b><span>감시</span><b>${esc(d.trust)}</b><span>위험</span><b>${esc(d.risk)}</b><span>관할</span><b>${esc(d.op)}</b></div>
        <section><b>직접 연결</b><div>${chipList(d.links)}</div></section>
        <section><b>관련 기록</b><div>${(d.records||[]).map(id=>`<button type="button" data-pc5134-record="${esc(id)}">${esc(id)}</button>`).join('')}</div></section>
        <section><b>상태 주석</b><p>${esc(d.note)}</p></section>`;
      detail.appendChild(panel);
      panel.querySelectorAll('[data-pc5134-record]').forEach(btn=>{
        btn.addEventListener('click',e=>{
          e.preventDefault();
          const id=btn.getAttribute('data-pc5134-record');
          const archiveLink=document.querySelector('.side-menu a[data-target="archive-entry"]');
          if(archiveLink) archiveLink.click();
          setTimeout(()=>{ if(typeof window.ProjectCurseShowInternalRecord==='function') window.ProjectCurseShowInternalRecord(id); },120);
        });
      });
    }

    function bindFactionDetailEnhance(){
      setTimeout(enhanceFactionDetail,140);
      document.querySelectorAll('.faction-tile').forEach(tile=>{
        if(tile.dataset.pc5134Bound) return;
        tile.dataset.pc5134Bound='1';
        tile.addEventListener('click',()=>{
          const detail=document.getElementById('factionDetail');
          if(detail) detail.dataset.pc5134Enhanced='0';
          setTimeout(enhanceFactionDetail,60);
        },true);
      });
    }

    renderNetwork();
    setTimeout(renderNetwork,400);
    bindFactionDetailEnhance();
  });
})();


// MapPatch 5.14.0 — EntityArchive_Add.
// Adds a damaged institutional entity archive. No existing record body is rewritten.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5140-entity-archive-ready');

    const esc=(v)=>String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    const entityFiles=[
      {id:'ENT-860722-FERAL-01',className:'타락 개체',name:'신원불명의 신자',status:'FIELD RED',threat:'근접 접촉 금지',zone:'란저우 / 도심 침투권',op:'lanzhou',record:'타락 개체_860722',img:'assets/resources/86ed1a163d79930b0874dbd5eb93adf2.webp',source:'F.H.C 봉인 기록 / 타락교 기록면',reaction:'육체 변형 / 인육 섭취 후 일시적 안정',note:'일반인 위장 가능성이 있어 C.P.D 선별 절차와 분리해야 한다.'},
      {id:'ENT-860722-SUP-02',className:'상위 개체',name:'가면을 쓴 존재',status:'SEAL WATCH',threat:'정신 오염 / 명령 전달',zone:'우시노다교 흔적권',op:'lanzhou',record:'Cults_871104',img:'assets/resources/83d311da1ab7310a567c6023f6151e6c.webp',source:'F.H.C 극비 보안 문서',reaction:'의식 지휘 / 하위 신자 통제',note:'직접 교전보다 기록 오염과 추적 실패가 먼저 발생한다.'},
      {id:'ENT-881120-MIMIC-03',className:'미믹 개체',name:'귀환자 위장 반응체',status:'CIV SCREEN',threat:'검문선 침투',zone:'부산 선별 부두 / 델리 선별권',op:'busan',record:'FCR_Archive_890402',img:'assets/resources/c85c636bb85c747508df07e1115a9b89.webp',source:'타락 개체 분류 추가 보고서',reaction:'기억 손실 위장 / 지연 신체 반응',note:'귀환자를 즉시 타락 개체로 기록하지 않되, 가족 접촉은 보류한다.'},
      {id:'ENT-890402-MIX-04',className:'혼합 개체',name:'오염 장비 접촉 변이체',status:'RECOVERY FAIL',threat:'장비 매개 확산',zone:'북해-함부르크 / 회수 실패 구역',op:'northsea',record:'Redzone_881120',img:'assets/resources/0a8342297ac1a847461c57a2726d98b7.webp',source:'레드존 이상현상 및 오염 기준 문서',reaction:'오염된 장비와 생체 반응이 결합',note:'장비 회수보다 현장 소각과 봉쇄선 유지가 우선된다.'},
      {id:'ENT-891219-CMD-05',className:'명령 반응체',name:'무전 응답 개체',status:'SIGNAL DEGRADED',threat:'통신 유인',zone:'Dead Hour / Ghost Channel 구역',op:'world',record:'Redzone_881120',img:'assets/resources/e39a87391183a4f564af26c1dd3b7bbd.webp',source:'N.H.C 생존 규칙 / 레드존 통신 오염',reaction:'사망자 무전 또는 반복 명령에 반응',note:'사망자 무전에 응답하지 않는다. 동일 명령 반복은 후퇴 기준이다.'},
      {id:'ENT-860204-ART-06',className:'인공 개체',name:'아마리온 연구 부산물',status:'BLACK SITE WATCH',threat:'비인가 연구 확산',zone:'Black Site 후보 / 기업 연구권',op:'world',record:'불명_Record1_860204',img:'assets/resources/734d86c7b7d166024a3be1993b9ed78a.webp',source:'아마리온 회수 영상 기록',reaction:'현실 외부 공간 / 고응축 자원 반응',note:'교육 영상처럼 위장된 연구 자료에서 파생 가능성이 확인된다.'},
      {id:'ENT-QTYPE-07',className:'Queen-Type',name:'중심 반응핵 후보',status:'BLACK CORE',threat:'구역 블랙존화',zone:'호주 중앙 심부 / 란저우 지하 반응핵',op:'australia',record:'Redzone_881120',img:'assets/resources/05cdc0276694d090f3829c4dc6e5a30b.webp',source:'레드존 장기 방치 단계 / 블랙존화 징후',reaction:'주변 개체 반응과 오염권을 동기화',note:'실체보다 반응핵 후보로 먼저 기록된다. 접근보다 관측 축 유지가 우선이다.'},
      {id:'ENT-RETURN-08',className:'귀환자 위장 개체',name:'지연 신체 반응 귀환자',status:'CIV HOLD',threat:'대피선 내부 확산',zone:'부산 / 델리 / 귀환자 집결지',op:'delhi',record:'FCR_Archive_890402',img:'assets/resources/fb5ead8ded766fd8d05938b1caf6a18e.webp',source:'귀환자 이상 반응 추가 보고',reaction:'정상 진술 이후 지연 변이',note:'C.P.D 대피 회랑에 합류시키기 전 2차 선별과 무전 기록 대조가 필요하다.'}
    ];

    const classOrder=['전체','타락 개체','상위 개체','미믹 개체','혼합 개체','명령 반응체','인공 개체','Queen-Type','귀환자 위장 개체'];

    function chips(items){
      return (items||[]).map(x=>`<span>${esc(x)}</span>`).join('');
    }

    function renderEntityArchive(){
      const root=document.getElementById('pc5140EntityRoot');
      if(!root) return;
      root.innerHTML=`
        <div class="pc5140-entity-shell" data-filter="전체">
          <aside class="pc5140-entity-left">
            <div class="pc5140-node-head"><span>ENTITY FILE INDEX</span><b>FIELD CLASSIFICATION</b><small>RECOVERED / PARTIAL</small></div>
            <div class="pc5140-filter-list">
              ${classOrder.map((name,i)=>`<button type="button" class="${i===0?'active':''}" data-pc5140-filter="${esc(name)}"><i>${String(i).padStart(2,'0')}</i><span>${esc(name)}</span></button>`).join('')}
            </div>
            <div class="pc5140-entity-warning"><b>주의</b><p>이 색인은 개체 도감이 아니다. 회수 이미지와 현장 진술이 충돌할 경우 현장 기록을 우선한다.</p></div>
          </aside>
          <section class="pc5140-entity-list" aria-label="개체 파일 목록"></section>
          <aside class="pc5140-entity-detail" aria-label="선택 개체 파일"></aside>
        </div>`;

      const shell=root.querySelector('.pc5140-entity-shell');
      const listEl=root.querySelector('.pc5140-entity-list');
      const detailEl=root.querySelector('.pc5140-entity-detail');

      function visibleList(){
        const filter=shell.dataset.filter||'전체';
        return filter==='전체' ? entityFiles : entityFiles.filter(x=>x.className===filter);
      }

      function renderList(activeId){
        const list=visibleList();
        listEl.innerHTML=list.map(file=>`
          <button type="button" class="pc5140-entity-row ${file.id===activeId?'active':''}" data-pc5140-entity="${esc(file.id)}">
            <i>${esc(file.id)}</i>
            <b>${esc(file.name)}</b>
            <span>${esc(file.className)} / ${esc(file.status)}</span>
            <small>${esc(file.threat)}</small>
          </button>
        `).join('') || '<div class="pc5140-empty">NO RECOVERED FILE</div>';
        listEl.querySelectorAll('[data-pc5140-entity]').forEach(btn=>{
          btn.addEventListener('click',()=>{
            selectEntity(btn.getAttribute('data-pc5140-entity'));
            if(window.ProjectCurseAudio) window.ProjectCurseAudio.playCue('drawer',180);
          });
        });
      }

      function selectEntity(id){
        const file=entityFiles.find(x=>x.id===id) || visibleList()[0] || entityFiles[0];
        if(!file) return;
        renderList(file.id);
        detailEl.innerHTML=`
          <div class="pc5140-detail-head">
            <span>SELECTED ENTITY FILE</span>
            <b>${esc(file.name)}</b>
            <small>${esc(file.id)}</small>
          </div>
          <figure class="pc5140-recovered-image">
            <img src="${esc(file.img)}" alt="${esc(file.name)} 회수 이미지" loading="lazy">
            <figcaption>RECOVERED IMAGE / QUALITY DEGRADED</figcaption>
          </figure>
          <div class="pc5140-detail-grid">
            <span>분류</span><b>${esc(file.className)}</b>
            <span>상태</span><b>${esc(file.status)}</b>
            <span>위협</span><b>${esc(file.threat)}</b>
            <span>관련 작전권</span><b>${esc(file.zone)}</b>
            <span>출처</span><b>${esc(file.source)}</b>
            <span>반응</span><b>${esc(file.reaction)}</b>
          </div>
          <section><b>현장 메모</b><p>${esc(file.note)}</p></section>
          <div class="pc5140-detail-actions">
            <button type="button" data-pc5140-open-record="${esc(file.record)}">관련 기록 열람</button>
            <button type="button" data-pc5140-open-op="${esc(file.op)}">관련 작전권 열기</button>
          </div>`;

        detailEl.querySelectorAll('[data-pc5140-open-record]').forEach(btn=>{
          btn.addEventListener('click',e=>{
            e.preventDefault();
            const id=btn.getAttribute('data-pc5140-open-record');
            const archiveLink=document.querySelector('.side-menu a[data-target="archive-entry"]');
            if(archiveLink) archiveLink.click();
            setTimeout(()=>{ if(typeof window.ProjectCurseShowInternalRecord==='function') window.ProjectCurseShowInternalRecord(id); },120);
          });
        });
        detailEl.querySelectorAll('[data-pc5140-open-op]').forEach(btn=>{
          btn.addEventListener('click',e=>{
            e.preventDefault();
            const op=btn.getAttribute('data-pc5140-open-op')||'world';
            if(typeof window.ProjectCurseSelectOperation==='function') window.ProjectCurseSelectOperation(op,{show:true,closeMap:true});
          });
        });
      }

      root.querySelectorAll('[data-pc5140-filter]').forEach(btn=>{
        btn.addEventListener('click',()=>{
          shell.dataset.filter=btn.getAttribute('data-pc5140-filter')||'전체';
          root.querySelectorAll('[data-pc5140-filter]').forEach(x=>x.classList.toggle('active',x===btn));
          const first=visibleList()[0] || entityFiles[0];
          selectEntity(first && first.id);
        });
      });

      selectEntity(entityFiles[0].id);
    }

    renderEntityArchive();
    setTimeout(renderEntityArchive,260);
  });
})();


// MapPatch 5.14.1 — ReturnedCivilianRegistry_Add.
// Adds C.P.D / U.A.C returned civilian screening registry. Existing record bodies are not rewritten.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5141-returned-registry-ready');

    const esc=(v)=>String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    const returnedFiles=[
      {id:'RC-CPD-00-117',grade:'R-0 정상',name:'부산 항만 귀환자 / 임시 정상',status:'RELEASE PENDING',contact:'가족 접촉 제한 해제 대기',evac:'C.P.D 대피버스 조건부 합류',quarantine:'12시간 관찰',zone:'부산 해상 통제 허브',op:'busan',record:'FCR_Archive_890402',img:'assets/resources/c85c636bb85c747508df07e1115a9b89.webp',memo:'초기 진술과 무전 기록이 일치한다. 단, 레드존 외곽 체류 시간이 길어 2차 체온·혈액 반응 검사를 유지한다.'},
      {id:'RC-CPD-01-204',grade:'R-1 기억 손실',name:'란저우 외곽 회수 민간인',status:'SCREENING HOLD',contact:'가족 접촉 보류',evac:'대피버스 합류 보류',quarantine:'24시간 격리',zone:'란저우 내륙 레드존',op:'lanzhou',record:'타락 개체_860722',img:'assets/resources/8bb53a89c3baf48d8e3ac2b180f80d0b.webp',memo:'귀환 직전 3시간의 기억이 공백 상태다. 우시노다교 의식성 오염 흔적은 확인되지 않았으나 동일 문장을 반복한다.'},
      {id:'RC-CPD-02-311',grade:'R-2 시간 불일치',name:'서울 Core 검문선 통과자',status:'TIME MISMATCH',contact:'가족 접촉 녹취 후 제한',evac:'대피선 후방 배치',quarantine:'48시간 격리',zone:'서울 Core / 한강 봉쇄권',op:'seoul',record:'Redzone_881120',img:'assets/resources/0a8342297ac1a847461c57a2726d98b7.webp',memo:'본인 진술의 체류 시간과 검문소 시각 기록이 일치하지 않는다. Ghost Channel 계열 시간 오염 가능성을 배제할 수 없다.'},
      {id:'RC-CPD-03-408',grade:'R-3 지연 신체 반응',name:'델리 귀환자 집결지 등록자',status:'BODY RESPONSE DELAYED',contact:'가족 접촉 금지',evac:'대피버스 합류 금지',quarantine:'72시간 격리 / 의료 관찰',zone:'델리 귀환자 선별권',op:'delhi',record:'FCR_Archive_890402',img:'assets/resources/fb5ead8ded766fd8d05938b1caf6a18e.webp',memo:'초기 검사는 정상이었으나 9시간 뒤 피부 반점과 맥박 불일치가 발생했다. 귀환자 위장 개체 가능성은 낮지만 관찰 지속.'},
      {id:'RC-CPD-04-512',grade:'R-4 오염된 침묵',name:'북해 봉인 항만 회수자',status:'SILENCE CONTAMINATED',contact:'가족 접촉 전면 금지',evac:'민간 대피선 접근 금지',quarantine:'봉인실 이관',zone:'북해-함부르크 봉인 항만',op:'northsea',record:'Cults_871104',img:'assets/resources/b20abfee553be1cf8a7f818a2bd84f23.webp',memo:'어떤 질문에도 응답하지 않지만, F.H.C 봉인 문구를 들을 때 심박과 안구 반응이 동기화된다. 침묵 자체를 오염 반응으로 분류한다.'},
      {id:'RC-CPD-05-666',grade:'R-5 위장 귀환 개체',name:'신원 불일치 귀환자',status:'FALSE RETURN',contact:'가족 접촉 금지 / 신원 폐기',evac:'C.P.D 대피버스 접근 금지',quarantine:'N.H.C 인계 / 소각 대기',zone:'란저우 내륙 레드존',op:'lanzhou',record:'타락 개체_860722',img:'assets/resources/86ed1a163d79930b0874dbd5eb93adf2.webp',memo:'지문·치아 기록은 실종자와 일치하나 생년과 가족 구성 진술이 반복적으로 어긋난다. 귀환자가 아니라 귀환자 위장 개체로 재분류한다.'},
      {id:'RC-CPD-02-702',grade:'R-2 시간 불일치',name:'부산 대피 회랑 지연 귀환자',status:'SECONDARY CHECK REQUIRED',contact:'가족 통화 3분 제한',evac:'후속 차량 대기',quarantine:'36시간 관찰',zone:'부산 해상 통제 허브',op:'busan',record:'NHC_Manual_891219',img:'assets/resources/e39a87391183a4f564af26c1dd3b7bbd.webp',memo:'대피 회랑 진입 당시 무전 기록이 11분 늦게 수신되었다. 검문소 CCTV에는 정상적으로 통과한 것으로 보이나 음성 기록만 뒤틀려 있다.'},
      {id:'RC-CPD-03-811',grade:'R-3 지연 신체 반응',name:'호주 중앙 심부 외곽 구조자',status:'BLACK CORE WATCH',contact:'가족 접촉 금지',evac:'이동 금지',quarantine:'격리 컨테이너 유지',zone:'호주 중앙 심부 반응점',op:'australia',record:'Redzone_881120',img:'assets/resources/05cdc0276694d090f3829c4dc6e5a30b.webp',memo:'구조 직후에는 정상 보행과 정상 문답이 가능했으나, 블랙코어 반응 기록 재생 시 비자발적 안면 경련이 발생했다.'}
    ];

    const grades=['전체','R-0 정상','R-1 기억 손실','R-2 시간 불일치','R-3 지연 신체 반응','R-4 오염된 침묵','R-5 위장 귀환 개체'];

    function renderReturnedRegistry(){
      const root=document.getElementById('pc5141ReturnedRoot');
      if(!root) return;
      root.innerHTML=`
        <div class="pc5141-registry-shell" data-filter="전체">
          <aside class="pc5141-registry-left">
            <div class="pc5141-node-head"><span>C.P.D SCREENING NODE</span><b>RETURNED CIVILIAN</b><small>U.A.C REVIEW / PARTIAL</small></div>
            <div class="pc5141-grade-list">
              ${grades.map((grade,i)=>`<button type="button" class="${i===0?'active':''}" data-pc5141-grade="${esc(grade)}"><i>${grade==='전체'?'ALL':grade.split(' ')[0]}</i><span>${esc(grade)}</span></button>`).join('')}
            </div>
            <div class="pc5141-registry-warning"><b>검문 주의</b><p>귀환자는 생존자로 확정되지 않는다. 가족 접촉과 C.P.D 대피버스 합류는 2차 선별 이후에만 허용한다.</p></div>
          </aside>
          <section class="pc5141-registry-list" aria-label="귀환자 선별 파일 목록"></section>
          <aside class="pc5141-registry-detail" aria-label="선택 귀환자 선별 파일"></aside>
        </div>`;

      const shell=root.querySelector('.pc5141-registry-shell');
      const listEl=root.querySelector('.pc5141-registry-list');
      const detailEl=root.querySelector('.pc5141-registry-detail');

      function visibleList(){
        const filter=shell.dataset.filter||'전체';
        return filter==='전체' ? returnedFiles : returnedFiles.filter(x=>x.grade===filter);
      }

      function renderList(activeId){
        const list=visibleList();
        listEl.innerHTML=list.map(file=>`
          <button type="button" class="pc5141-returned-row ${file.id===activeId?'active':''}" data-pc5141-returned="${esc(file.id)}">
            <i>${esc(file.id)}</i>
            <b>${esc(file.name)}</b>
            <span>${esc(file.grade)} / ${esc(file.status)}</span>
            <small>${esc(file.contact)}</small>
          </button>
        `).join('') || '<div class="pc5141-empty">NO SCREENING FILE</div>';
        listEl.querySelectorAll('[data-pc5141-returned]').forEach(btn=>{
          btn.addEventListener('click',()=>{
            selectReturned(btn.getAttribute('data-pc5141-returned'));
            if(window.ProjectCurseAudio) window.ProjectCurseAudio.playCue('drawer',180);
          });
        });
      }

      function selectReturned(id){
        const file=returnedFiles.find(x=>x.id===id) || visibleList()[0] || returnedFiles[0];
        if(!file) return;
        renderList(file.id);
        detailEl.innerHTML=`
          <div class="pc5141-detail-head">
            <span>SELECTED SCREENING FILE</span>
            <b>${esc(file.name)}</b>
            <small>${esc(file.id)}</small>
          </div>
          <figure class="pc5141-screening-image">
            <img src="${esc(file.img)}" alt="${esc(file.name)} 선별 자료" loading="lazy">
            <figcaption>SCREENING IMAGE / LOW QUALITY COPY</figcaption>
          </figure>
          <div class="pc5141-detail-grid">
            <span>R 등급</span><b>${esc(file.grade)}</b>
            <span>상태</span><b>${esc(file.status)}</b>
            <span>가족 접촉</span><b>${esc(file.contact)}</b>
            <span>대피선</span><b>${esc(file.evac)}</b>
            <span>격리</span><b>${esc(file.quarantine)}</b>
            <span>관련 작전권</span><b>${esc(file.zone)}</b>
          </div>
          <section><b>선별 메모</b><p>${esc(file.memo)}</p></section>
          <div class="pc5141-detail-actions">
            <button type="button" data-pc5141-open-record="${esc(file.record)}">관련 기록 열람</button>
            <button type="button" data-pc5141-open-op="${esc(file.op)}">관련 작전권 열기</button>
          </div>`;

        detailEl.querySelectorAll('[data-pc5141-open-record]').forEach(btn=>{
          btn.addEventListener('click',e=>{
            e.preventDefault();
            const id=btn.getAttribute('data-pc5141-open-record');
            const archiveLink=document.querySelector('.side-menu a[data-target="archive-entry"]');
            if(archiveLink) archiveLink.click();
            setTimeout(()=>{ if(typeof window.ProjectCurseShowInternalRecord==='function') window.ProjectCurseShowInternalRecord(id); },120);
          });
        });
        detailEl.querySelectorAll('[data-pc5141-open-op]').forEach(btn=>{
          btn.addEventListener('click',e=>{
            e.preventDefault();
            const op=btn.getAttribute('data-pc5141-open-op')||'world';
            if(typeof window.ProjectCurseSelectOperation==='function') window.ProjectCurseSelectOperation(op,{show:true,closeMap:true});
          });
        });
      }

      root.querySelectorAll('[data-pc5141-grade]').forEach(btn=>{
        btn.addEventListener('click',()=>{
          shell.dataset.filter=btn.getAttribute('data-pc5141-grade')||'전체';
          root.querySelectorAll('[data-pc5141-grade]').forEach(x=>x.classList.toggle('active',x===btn));
          const first=visibleList()[0] || returnedFiles[0];
          selectReturned(first && first.id);
        });
      });

      selectReturned(returnedFiles[0].id);
    }

    renderReturnedRegistry();
    setTimeout(renderReturnedRegistry,260);
  });
})();


// MapPatch 5.15.0 — EquipmentCodex_Interactive.
// Adds recovered equipment codex as N.H.C/A.R.F handling records. Existing record bodies are not rewritten.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5150-equipment-codex-ready');

    const esc=(v)=>String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    const equipmentFiles=[
      {id:'EQ-NHC-CG-001',category:'오염된 장비',name:'회수된 돌격소총 / 오염 반응',status:'BURN AFTER CHECK',handler:'N.H.C / A.R.F',contamination:'혈액성 잔류 반응',op:'lanzhou',zone:'란저우 내륙 레드존',record:'NHC_Manual_891219',img:'assets/resources/548f1c4456dc240389f61115de660a7f.webp',caution:'사용 금지 / 탄창 분리 후 소각 대기',note:'작동 가능한 상태로 회수되었지만 손잡이와 장전부에서 생체 반응이 검출되었다. 재사용이 아니라 회수 경로 역추적용으로만 보관한다.'},
      {id:'EQ-UAC-WC-014',category:'W-Coat',name:'W-Coat 현장 방호막',status:'FIELD LIMITED',handler:'N.H.C 장비반',contamination:'외부 오염 차단 / 내부 잔류 가능',op:'busan',zone:'부산 해상 통제 허브',record:'NHC_Manual_891219',img:'assets/resources/0a8342297ac1a847461c57a2726d98b7.webp',caution:'찢김 발생 시 즉시 폐기',note:'단기 투입용 방호 코팅. 레드존 장기 체류를 보장하지 않으며, 귀환자 선별 구역으로 반입할 수 없다.'},
      {id:'EQ-UAC-WF-027',category:'W-Fiber',name:'W-Fiber 보강 내피',status:'RECOVERED SAMPLE',handler:'A.R.F 회수반',contamination:'섬유층 미세 오염 흡착',op:'seoul',zone:'서울 Core / 한강 봉쇄권',record:'Redzone_881120',img:'assets/resources/4cd826918a7fd80a89342fb22aad527f.webp',caution:'세척 재사용 금지',note:'방호복 내피로 사용된 흔적이 있으나, 섬유 내부에 미세 오염 물질이 남아 반복 착용자를 오염시킬 수 있다.'},
      {id:'EQ-FHC-BM-104',category:'혈무',name:'혈무 / 봉인 실패품',status:'F.H.C SEALED',handler:'F.H.C / S.I.D',contamination:'의식성 오염 / 접촉 반응',op:'lanzhou',zone:'우시노다교 흔적권',record:'Cults_871104',img:'assets/resources/b20abfee553be1cf8a7f818a2bd84f23.webp',caution:'직접 접촉 금지 / 봉인 태그 유지',note:'제압 도구로 기록되어 있으나 제작 과정 자체가 의식성 오염과 연결된다. N.H.C 일반 장비고에 보관할 수 없다.'},
      {id:'EQ-SID-WG-211',category:'파동기',name:'현장 파동기 / 신호 교란형',status:'SIGNAL UNSTABLE',handler:'S.I.D 감청반',contamination:'Ghost Channel 간섭',op:'world',zone:'Dead Hour / 통신 오염권',record:'Redzone_881120',img:'assets/resources/e39a87391183a4f564af26c1dd3b7bbd.webp',caution:'사망자 무전 수신 시 전원 차단',note:'오염 신호를 밀어내기 위한 장비지만 특정 주파수에서 오히려 명령 반응체를 유인할 수 있다.'},
      {id:'EQ-UAC-NC-305',category:'Null Coating',name:'Null Coating 봉쇄 패널',status:'CONTAINMENT USE',handler:'U.A.C 시설반',contamination:'표면 안정 / 균열 시 역류',op:'northsea',zone:'북해-함부르크 봉인 항만',record:'Redzone_881120',img:'assets/resources/1ff34fadd4be71392d17f458d5d43313.webp',caution:'균열 발견 시 접근 금지',note:'봉쇄선과 임시 격리실 표면에 적용된다. 표면이 안정적일 때만 유효하며 균열 이후에는 오염을 막는 대신 가둬둔 신호가 역류한다.'},
      {id:'EQ-NHC-AM-410',category:'특수탄약',name:'Null Round / 현장 지급 탄약',status:'CONTROLLED AMMO',handler:'N.H.C 화기반',contamination:'잔류 분말 회수 필요',op:'busan',zone:'부산 / 레드존 외곽 작전권',record:'NHC_Manual_891219',img:'assets/resources/57674a652af43e6aec284bbc33018b06.webp',caution:'소모 탄피 전량 회수',note:'타락 개체 제압용으로 제한 지급된다. 탄피와 잔류 분말이 회수되지 않으면 2차 오염 증거가 누락된다.'},
      {id:'EQ-CPD-BUS-502',category:'차량·시설·봉쇄 인프라',name:'C.P.D 대피버스 / 검문 이동체',status:'CIV ROUTE HOLD',handler:'C.P.D / U.A.C',contamination:'탑승자 선별 실패 위험',op:'delhi',zone:'델리 귀환자 선별권',record:'FCR_Archive_890402',img:'assets/resources/c85c636bb85c747508df07e1115a9b89.webp',caution:'R-3 이상 탑승 금지',note:'대피 수단이지만 이동식 검문선으로도 운용된다. 귀환자 분류가 확정되지 않은 인원을 태우면 차량 전체가 격리된다.'},
      {id:'EQ-UAC-GATE-620',category:'차량·시설·봉쇄 인프라',name:'임시 Blood Gate 차단 프레임',status:'PARTIAL FAILURE',handler:'U.A.C / F.H.C',contamination:'의식 잔향 / 봉인 태그 손상',op:'lanzhou',zone:'란저우 지하 반응권',record:'Cults_871104',img:'assets/resources/83d311da1ab7310a567c6023f6151e6c.webp',caution:'완전 폐쇄 기록 없음',note:'Blood Gate 주변에 설치된 임시 프레임. 차단 장비로 분류되지만 실제로는 확산 속도를 늦추는 장치에 가깝다.'},
      {id:'EQ-ARF-REC-777',category:'오염된 장비',name:'회수 태그 / 손상된 기록 매체',status:'INDEX DAMAGED',handler:'A.R.F 기록반',contamination:'데이터 손상 / 시각 노이즈',op:'world',zone:'세계 상황판 / 회수 자료',record:'불명_Record1_860204',img:'assets/resources/734d86c7b7d166024a3be1993b9ed78a.webp',caution:'원본 덮어쓰기 금지',note:'장비 자체보다 장비에 남은 영상·음성 기록이 더 위험한 경우가 있다. 복구 전용 단말기 외부에서는 열람하지 않는다.'}
    ];

    const categories=['전체','오염된 장비','W-Coat','W-Fiber','혈무','파동기','Null Coating','특수탄약','차량·시설·봉쇄 인프라'];

    function renderEquipmentCodex(){
      const root=document.getElementById('pc5150EquipmentRoot');
      if(!root) return;
      root.innerHTML=`
        <div class="pc5150-equipment-shell" data-filter="전체">
          <aside class="pc5150-equipment-left">
            <div class="pc5150-node-head"><span>N.H.C EQUIPMENT NODE</span><b>RECOVERED CODEX</b><small>FIELD HANDLING / PARTIAL</small></div>
            <div class="pc5150-category-list">
              ${categories.map((cat,i)=>`<button type="button" class="${i===0?'active':''}" data-pc5150-category="${esc(cat)}"><i>${String(i).padStart(2,'0')}</i><span>${esc(cat)}</span></button>`).join('')}
            </div>
            <div class="pc5150-equipment-warning"><b>취급 경고</b><p>이 화면은 무기 목록이 아니다. 회수 장비는 재사용보다 오염 경로 확인과 폐기 여부 판단을 우선한다.</p></div>
          </aside>
          <section class="pc5150-equipment-list" aria-label="회수 장비 파일 목록"></section>
          <aside class="pc5150-equipment-detail" aria-label="선택 장비 취급 파일"></aside>
        </div>`;

      const shell=root.querySelector('.pc5150-equipment-shell');
      const listEl=root.querySelector('.pc5150-equipment-list');
      const detailEl=root.querySelector('.pc5150-equipment-detail');

      function visibleList(){
        const filter=shell.dataset.filter||'전체';
        return filter==='전체' ? equipmentFiles : equipmentFiles.filter(x=>x.category===filter);
      }

      function renderList(activeId){
        const list=visibleList();
        listEl.innerHTML=list.map(file=>`
          <button type="button" class="pc5150-equipment-row ${file.id===activeId?'active':''}" data-pc5150-equipment="${esc(file.id)}">
            <i>${esc(file.id)}</i>
            <b>${esc(file.name)}</b>
            <span>${esc(file.category)} / ${esc(file.status)}</span>
            <small>${esc(file.caution)}</small>
          </button>
        `).join('') || '<div class="pc5150-empty">NO RECOVERED EQUIPMENT FILE</div>';
        listEl.querySelectorAll('[data-pc5150-equipment]').forEach(btn=>{
          btn.addEventListener('click',()=>{
            selectEquipment(btn.getAttribute('data-pc5150-equipment'));
            if(window.ProjectCurseAudio) window.ProjectCurseAudio.playCue('drawer',180);
          });
        });
      }

      function selectEquipment(id){
        const file=equipmentFiles.find(x=>x.id===id) || visibleList()[0] || equipmentFiles[0];
        if(!file) return;
        renderList(file.id);
        detailEl.innerHTML=`
          <div class="pc5150-detail-head">
            <span>SELECTED EQUIPMENT FILE</span>
            <b>${esc(file.name)}</b>
            <small>${esc(file.id)}</small>
          </div>
          <figure class="pc5150-equipment-image">
            <img src="${esc(file.img)}" alt="${esc(file.name)} 회수 장비 자료" loading="lazy">
            <figcaption>RECOVERED EQUIPMENT IMAGE / ARCHIVE COPY</figcaption>
          </figure>
          <div class="pc5150-detail-grid">
            <span>분류</span><b>${esc(file.category)}</b>
            <span>상태</span><b>${esc(file.status)}</b>
            <span>취급 기관</span><b>${esc(file.handler)}</b>
            <span>오염 상태</span><b>${esc(file.contamination)}</b>
            <span>관련 작전권</span><b>${esc(file.zone)}</b>
            <span>취급 경고</span><b>${esc(file.caution)}</b>
          </div>
          <section><b>현장 취급 메모</b><p>${esc(file.note)}</p></section>
          <div class="pc5150-detail-actions">
            <button type="button" data-pc5150-open-record="${esc(file.record)}">관련 기록 열람</button>
            <button type="button" data-pc5150-open-op="${esc(file.op)}">관련 작전권 열기</button>
          </div>`;

        detailEl.querySelectorAll('[data-pc5150-open-record]').forEach(btn=>{
          btn.addEventListener('click',e=>{
            e.preventDefault();
            const id=btn.getAttribute('data-pc5150-open-record');
            const archiveLink=document.querySelector('.side-menu a[data-target="archive-entry"]');
            if(archiveLink) archiveLink.click();
            setTimeout(()=>{ if(typeof window.ProjectCurseShowInternalRecord==='function') window.ProjectCurseShowInternalRecord(id); },120);
          });
        });
        detailEl.querySelectorAll('[data-pc5150-open-op]').forEach(btn=>{
          btn.addEventListener('click',e=>{
            e.preventDefault();
            const op=btn.getAttribute('data-pc5150-open-op')||'world';
            if(typeof window.ProjectCurseSelectOperation==='function') window.ProjectCurseSelectOperation(op,{show:true,closeMap:true});
          });
        });
      }

      root.querySelectorAll('[data-pc5150-category]').forEach(btn=>{
        btn.addEventListener('click',()=>{
          shell.dataset.filter=btn.getAttribute('data-pc5150-category')||'전체';
          root.querySelectorAll('[data-pc5150-category]').forEach(x=>x.classList.toggle('active',x===btn));
          const first=visibleList()[0] || equipmentFiles[0];
          selectEquipment(first && first.id);
        });
      });

      selectEquipment(equipmentFiles[0].id);
    }

    renderEquipmentCodex();
    setTimeout(renderEquipmentCodex,260);
  });
})();


// MapPatch 5.15.1 — InterfaceReset_ArchiveTerminal.
// Restores the interface around four root archive drawers and demotes recent feature pages to archive sub-indexes.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5151-interface-reset');

    function playCue(name,cooldown){
      if(window.ProjectCurseAudio && typeof window.ProjectCurseAudio.playCue==='function'){
        window.ProjectCurseAudio.playCue(name,cooldown||180);
      }
    }

    function showPageById(id){
      if(!id) return;
      const sideLink=document.querySelector(`.side-menu a[data-target="${CSS.escape(id)}"]`);
      if(sideLink){
        sideLink.click();
        return;
      }
      const pages=Array.from(document.querySelectorAll('.content-page'));
      if(!pages.some(p=>p.id===id)) return;
      pages.forEach(p=>p.classList.toggle('active',p.id===id));
      history.replaceState(null,'','#'+id);
      const c=document.querySelector('.legacy-content');
      if(c) c.scrollTop=0;
      playCue('drawer',200);
    }

    document.querySelectorAll('[data-pc5151-page]').forEach(btn=>{
      if(btn.dataset.bound5151) return;
      btn.dataset.bound5151='1';
      btn.addEventListener('click',e=>{
        e.preventDefault();
        showPageById(btn.getAttribute('data-pc5151-page'));
      });
    });

    // Make root archive grouping explicit for later patches.
    window.ProjectCurseArchiveRoot = Object.assign(window.ProjectCurseArchiveRoot || {}, {
      patch:'5.15.1',
      rootOrder:['세계 사건 연표','세력','기록보관소'],
      archiveSubIndexes:['entity-archive','returned-registry','equipment-codex']
    });
  });
})();


// MapPatch 5.15.2 — AnalogHorror_UI_Retrofit.
// Art-direction retrofit for 2000~2010 analog-horror recovered-video atmosphere.
// No new feature modules; existing records/maps remain intact.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5152-analog-horror-retrofit');

    function dimAudioBus(){
      const bus=window.ProjectCurseAudio;
      if(!bus || !bus.audio) return;
      const v={
        menu:.018, open:.038, page:.026, boot:.04, ambient:.022, load:.034,
        drawer:.026, command:.024, restricted:.042, video:.034, radio:.022,
        marker:.009, alert:.032, denied:.038
      };
      Object.keys(v).forEach(k=>{
        try{ if(bus.audio[k]) bus.audio[k].volume=v[k]; }catch(e){}
      });
    }

    function addSignalOverlay(){
      if(document.querySelector('.pc5152-signal-overlay')) return;
      const overlay=document.createElement('div');
      overlay.className='pc5152-signal-overlay';
      overlay.setAttribute('aria-hidden','true');
      overlay.innerHTML='<i></i><i></i><i></i>';
      document.body.appendChild(overlay);
    }

    function addFrameReadout(){
      const app=document.getElementById('app');
      if(!app || document.querySelector('.pc5152-frame-id')) return;
      const r=document.createElement('div');
      r.className='pc5152-frame-id';
      r.setAttribute('aria-hidden','true');
      r.textContent='UAC-PC03 / RECOVERED COPY / SIGNAL DEGRADED';
      app.appendChild(r);
    }

    dimAudioBus();
    addSignalOverlay();
    addFrameReadout();

    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152:'AnalogHorror UI Retrofit',
      artDirection:'2000-2010 recovered broadcast / damaged institutional archive'
    });
  });
})();


// MapPatch 5.15.2a — FellonReference_SignalDrift_TonePass.
// Adds slow top-to-bottom analog signal drift and pushes the interface closer to rough animated horror archive footage.
// This is a tone pass only; no new feature modules.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5152a-fellon-signal-pass');

    function installSlowSignalDrift(){
      if(document.querySelector('.pc5152a-slow-drift')) return;
      const drift=document.createElement('div');
      drift.className='pc5152a-slow-drift';
      drift.setAttribute('aria-hidden','true');
      drift.innerHTML='<span></span><b></b>';
      document.body.appendChild(drift);
    }

    function installArchiveNoiseMeter(){
      const app=document.getElementById('app');
      if(!app || document.querySelector('.pc5152a-tape-meter')) return;
      const meter=document.createElement('div');
      meter.className='pc5152a-tape-meter';
      meter.setAttribute('aria-hidden','true');
      meter.innerHTML='<i>TRACK 03</i><i>HEAD DIRTY</i><i>DROP FRAME</i>';
      app.appendChild(meter);
    }

    function retuneSoundBus(){
      const bus=window.ProjectCurseAudio;
      if(!bus || !bus.audio) return;
      const prefix=(function(){const p=location.pathname; if(p.includes('/docs/'))return '../../'; if(p.includes('/archive/'))return '../'; return '';})();
      try{
        bus.audio.ambient = new Audio(prefix+'assets/audio/pc5152f_old_terminal_roomtone.wav');
        bus.audio.ambient.loop = true;
        bus.audio.video = new Audio(prefix+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.radio = new Audio(prefix+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.load = new Audio(prefix+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.open = new Audio(prefix+'assets/audio/pc5152f_record_mount_soft.wav');
      }catch(e){}
      const v={menu:.012,open:.028,page:.018,boot:.026,ambient:.020,load:.026,drawer:.018,command:.017,restricted:.032,video:.028,radio:.022,marker:.006,alert:.024,denied:.030};
      Object.keys(v).forEach(k=>{try{ if(bus.audio[k]) bus.audio[k].volume=v[k]; }catch(e){}});
    }

    installSlowSignalDrift();
    installArchiveNoiseMeter();
    retuneSoundBus();

    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152a:'FellonReference SignalDrift TonePass',
      drift:'slow top-to-bottom analog noise pass',
      visualReference:'rough animated horror archive / recovered tape record'
    });
  });
})();


// MapPatch 5.15.2b — CurseSeries_ReferenceRecalibration.
// Recalibrates UI/source notes around user-supplied Curse:The Series playlist structure.
// No direct copying; Project Curse remains independent.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5152b-curse-series-recalibrated');

    function installTapeSequenceOverlay(){
      if(document.querySelector('.pc5152b-tape-sequence-overlay')) return;
      const el=document.createElement('div');
      el.className='pc5152b-tape-sequence-overlay';
      el.setAttribute('aria-hidden','true');
      el.innerHTML='<span>CURSE REF / STRUCTURE ONLY</span><b>FHC TAPE INDEX DAMAGED</b><i>SEQ 01 / SEQ 02 / SEQ ??</i>';
      document.body.appendChild(el);
    }

    function tagArchiveCards(){
      const cards=Array.from(document.querySelectorAll('#archive-entry .doc-card'));
      cards.forEach((card,idx)=>{
        if(card.dataset.pc5152bTape) return;
        const code=(card.querySelector('.code') && card.querySelector('.code').textContent.trim()) || ('REC-'+String(idx+1).padStart(2,'0'));
        card.dataset.pc5152bTape='TAPE-'+String(idx+1).padStart(2,'0');
        card.style.setProperty('--pc5152b-tape-label', '"'+card.dataset.pc5152bTape+' / '+code.replace(/"/g,'')+'"');
      });
    }

    function bindSeriesShelf(){
      document.querySelectorAll('.pc5152b-tape-row').forEach((row,idx)=>{
        if(row.dataset.bound5152b) return;
        row.dataset.bound5152b='1';
        row.addEventListener('click',()=>{
          if(window.ProjectCurseAudio && typeof window.ProjectCurseAudio.playCue==='function'){
            window.ProjectCurseAudio.playCue(idx===0?'video':idx===1?'load':'restricted',320);
          }
        });
      });
    }

    installTapeSequenceOverlay();
    tagArchiveCards();
    bindSeriesShelf();

    window.ProjectCurseReferenceNotes = Object.assign(window.ProjectCurseReferenceNotes || {}, {
      patch5152b:'CurseSeries Reference Recalibration',
      suppliedReferenceSets:['curse VHS','curse series','hatred series'],
      usageRule:'structure, tone, pacing, rough archival presentation only; no direct copying'
    });
  });
})();


// MapPatch 5.15.2c — ArchiveAndAudio_Cleanup.
// Restores audible background ambience, replaces button/loading cues, and temporarily hides cross-link style archive connectors.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5152c-archive-audio-cleanup');

    function prefix(){
      const p=location.pathname;
      if(p.includes('/docs/'))return '../../';
      if(p.includes('/archive/'))return '../';
      return '';
    }

    function retuneAudio(){
      const bus=window.ProjectCurseAudio;
      if(!bus || !bus.audio) return;
      const pre=prefix();
      try{
        bus.audio.ambient = new Audio(pre+'assets/audio/pc5152f_old_terminal_roomtone.wav');
        bus.audio.ambient.loop = true;
        bus.audio.menu = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.drawer = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.command = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.marker = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.open = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.page = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.load = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.video = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.radio = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.restricted = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.denied = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
      }catch(e){}
      const v={
        menu:.040, open:.052, page:.042, boot:.042, ambient:.064, load:.055,
        drawer:.034, command:.034, restricted:.045, video:.050, radio:.044,
        marker:.020, alert:.034, denied:.044
      };
      Object.keys(v).forEach(k=>{try{ if(bus.audio[k]) bus.audio[k].volume=v[k]; }catch(e){}});
      try{ if(typeof bus.startAmbient==='function') bus.startAmbient(); }catch(e){}
    }

    function disableArchiveCrossLinks(){
      // Archive storage should temporarily behave as a list of original setting texts only.
      document.querySelectorAll('#archive-entry [data-pc5151-page], #archive-entry .pc5151-archive-subindex, #archive-entry .pc5152b-series-shelf').forEach(el=>{
        el.setAttribute('aria-hidden','true');
        el.classList.add('pc5152c-temporarily-hidden-link');
      });

      // Hide related-record / related-operation buttons in derived sub-index pages and case-file side panels for this cleanup pass.
      const selectors=[
        '[data-pc5140-open-record]','[data-pc5140-open-op]',
        '[data-pc5141-open-record]','[data-pc5141-open-op]',
        '[data-pc5150-open-record]','[data-pc5150-open-op]',
        '[data-case-open-record]','[data-case-open-op]',
        '.pc5133-case-links','.pc5133-case-actions',
        '.pc5140-detail-actions','.pc5141-detail-actions','.pc5150-detail-actions'
      ];
      selectors.forEach(sel=>{
        document.querySelectorAll(sel).forEach(el=>{
          el.classList.add('pc5152c-link-disabled');
          el.setAttribute('aria-hidden','true');
          if(el.tagName==='BUTTON' || el.tagName==='A') el.setAttribute('tabindex','-1');
        });
      });
    }

    function keepWorldOverviewClean(){
      const worldGroup=document.querySelector('[data-menu-group="world-overview"] .pc5151-root-list');
      if(!worldGroup) return;
      Array.from(worldGroup.children).forEach((child,idx)=>{
        const target=child.getAttribute && child.getAttribute('data-target');
        if(idx>0 || target!=='history') child.classList.add('pc5152c-world-extra-hidden');
      });
    }

    retuneAudio();
    disableArchiveCrossLinks();
    keepWorldOverviewClean();

    // Re-run link cleanup after dynamically rendered sub-index detail panels appear.
    setTimeout(disableArchiveCrossLinks, 340);
    setTimeout(disableArchiveCrossLinks, 900);

    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152c:'ArchiveAndAudio Cleanup',
      archiveMode:'original setting texts only',
      audioMode:'audible broadcast roomtone + dry relay/tape mount cues'
    });
  });
})();


// MapPatch 5.15.2d — AudioFactionArchive_Hotfix.
// Fixes low SFX levels, removes legacy faction trace panel/noise, and restores archive record opening via full-row click.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5152d-audio-faction-archive-hotfix');

    function prefix(){
      const p=location.pathname;
      if(p.includes('/docs/'))return '../../';
      if(p.includes('/archive/'))return '../';
      return '';
    }

    function retuneAudioStrong(){
      const bus=window.ProjectCurseAudio;
      if(!bus || !bus.audio) return;
      const pre=prefix();
      try{
        bus.audio.ambient = new Audio(pre+'assets/audio/pc5152f_old_terminal_roomtone.wav');
        bus.audio.ambient.loop = true;
        bus.audio.menu = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.drawer = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.command = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.marker = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.alert = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.restricted = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.denied = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.open = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.page = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.load = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.video = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.radio = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
      }catch(e){}

      // User reported SFX too small; raise UI cues while keeping background controlled.
      const v={
        menu:.095, drawer:.085, command:.085, marker:.060,
        open:.105, page:.088, restricted:.095, denied:.090, alert:.090,
        load:.100, video:.090, radio:.082, boot:.070, ambient:.072
      };
      Object.keys(v).forEach(k=>{try{ if(bus.audio[k]) bus.audio[k].volume=v[k]; }catch(e){}});
    }

    function removeLegacyFactionTracePanel(){
      document.querySelectorAll('.relation-trace-panel').forEach(el=>el.remove());
      const section=document.getElementById('faction-relation');
      if(section){
        section.classList.add('pc5152d-legacy-trace-removed');
        delete section.dataset.traceKind;
        delete section.dataset.traceFocus;
      }
    }

    function cleanupFactionAudioRoutes(){
      // Ensure faction mark/tile/node controls use only the new analog bus cue and do not sound silent.
      const controls=document.querySelectorAll('.faction-mark-large, [data-pc5134-node], .pc5134-map-node, .tree-node');
      controls.forEach(el=>{
        if(el.dataset.pc5152dAudioBound) return;
        el.dataset.pc5152dAudioBound='1';
        el.addEventListener('pointerdown',()=>{
          try{
            if(window.ProjectCurseAudio && typeof window.ProjectCurseAudio.playCue==='function'){
              window.ProjectCurseAudio.playCue(el.classList.contains('hostile') ? 'restricted' : 'drawer', 220);
            }
          }catch(e){}
        }, {passive:true});
      });
    }

    function restoreArchiveOpenRuntime(){
      const archive=document.getElementById('archive-entry');
      if(!archive) return;
      archive.classList.add('pc5152d-archive-open-restored');

      archive.querySelectorAll('#archiveListWrap .doc-card').forEach((card,idx)=>{
        const button=card.querySelector('.open-record[data-record]');
        if(!button) return;
        const id=button.getAttribute('data-record');
        card.dataset.pc5152dRecord=id;
        card.removeAttribute('role');
        card.removeAttribute('tabindex');
        card.removeAttribute('aria-label');
        card.querySelectorAll('.pc5152d-open-cue').forEach(el=>el.remove());
        if(button.dataset.pc5152dTextPatched!=='1'){
          button.textContent='열람';
          button.dataset.pc5152dTextPatched='1';
        }
        if(card.dataset.pc5152dOpenBound) return;
        card.dataset.pc5152dOpenBound='1';

        const open=(e)=>{
          if(e){
            const tag=(e.target && e.target.tagName || '').toLowerCase();
            if(tag==='summary' || tag==='details') return;
            e.preventDefault();
            e.stopPropagation();
          }
          if(window.ProjectCurseAudio && typeof window.ProjectCurseAudio.playCue==='function'){
            window.ProjectCurseAudio.playCue('load',360);
          }
          if(typeof window.ProjectCurseShowInternalRecord==='function'){
            window.ProjectCurseShowInternalRecord(id);
          }else{
            button.click();
          }
        };

        button.addEventListener('click',open, true);
      });
    }

    function makeArchiveReadable(){
      const wrap=document.getElementById('archiveListWrap');
      if(wrap){
        wrap.querySelectorAll('details').forEach(d=>d.open=true);
      }
      const archive=document.getElementById('archive-entry');
      if(archive){
        archive.querySelectorAll('summary').forEach(s=>{
          if(!s.querySelector('.pc5152d-summary-note')){
            const note=document.createElement('span');
            note.className='pc5152d-summary-note';
            note.textContent=' / SETTING TEXTS';
            s.appendChild(note);
          }
        });
      }
    }

    retuneAudioStrong();
    removeLegacyFactionTracePanel();
    cleanupFactionAudioRoutes();
    restoreArchiveOpenRuntime();
    makeArchiveReadable();

    // Dynamic faction/archive renderers can recreate nodes; repeat cleanup safely.
    [160,480,1100,1900].forEach(t=>setTimeout(()=>{
      retuneAudioStrong();
      removeLegacyFactionTracePanel();
      cleanupFactionAudioRoutes();
      restoreArchiveOpenRuntime();
      makeArchiveReadable();
    },t));

    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152d:'AudioFactionArchive Hotfix',
      audioMode:'stronger analog button/load cues',
      archiveMode:'full row open restored',
      factionCleanup:'legacy trace panel removed and synth beep suppressed'
    });
  });
})();


// MapPatch 5.15.2e — AudioTone_DeGameify_Hotfix.
// Replaces typewriter-like button attack and over-performed loading sound with dull tape-deck/server-relay cues.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5152e-audio-tone-degameify');

    function prefix(){
      const p=location.pathname;
      if(p.includes('/docs/'))return '../../';
      if(p.includes('/archive/'))return '../';
      return '';
    }

    function retuneDeGameifiedAudio(){
      const bus=window.ProjectCurseAudio;
      if(!bus || !bus.audio) return;
      const pre=prefix();
      try{
        bus.audio.menu = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.drawer = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.command = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.marker = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');

        bus.audio.open = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.page = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');

        bus.audio.load = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.video = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.radio = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');

        bus.audio.alert = new Audio(pre+'assets/audio/pc5152f_low_denied_oldpc.wav');
        bus.audio.restricted = new Audio(pre+'assets/audio/pc5152f_low_denied_oldpc.wav');
        bus.audio.denied = new Audio(pre+'assets/audio/pc5152f_low_denied_oldpc.wav');

        // Keep the restored background bed from 5.15.2c/2d.
        if(!bus.audio.ambient || !String(bus.audio.ambient.src||'').includes('pc5152c_broadcast_roomtone.wav')){
          bus.audio.ambient = new Audio(pre+'assets/audio/pc5152f_old_terminal_roomtone.wav');
          bus.audio.ambient.loop = true;
        }
      }catch(e){}

      // Maintain audibility but pull attacks and theatrical loading back.
      const v={
        menu:.082, drawer:.076, command:.076, marker:.050,
        open:.088, page:.074,
        load:.078, video:.068, radio:.064,
        restricted:.080, denied:.076, alert:.074,
        boot:.060, ambient:.070
      };
      Object.keys(v).forEach(k=>{try{ if(bus.audio[k]) bus.audio[k].volume=v[k]; }catch(e){}});
    }

    function markAudioDiagnostic(){
      const meter=document.querySelector('.pc5152a-tape-meter');
      if(meter && !meter.querySelector('.pc5152e-audio-note')){
        const n=document.createElement('span');
        n.className='pc5152e-audio-note';
        n.textContent=' / SFX DULL BUS';
        meter.appendChild(n);
      }
    }

    retuneDeGameifiedAudio();
    markAudioDiagnostic();

    // Re-apply after older late patch blocks touch the same audio bus.
    [120,420,1000,2200].forEach(t=>setTimeout(()=>{
      retuneDeGameifiedAudio();
      markAudioDiagnostic();
    },t));

    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152e:'AudioTone DeGameify Hotfix',
      audioMode:'dull tape deck / server relay, no typewriter click, no theatrical load'
    });
  });
})();


// MapPatch 5.15.2f — AudioReference_Rebuild.
// Rebuilds the audio bus around the user's uploaded reference sounds:
// old computer bed, computer starting, analog contact, and computer startup boot.
// Goal: old electronic recording equipment in operation, not UI SFX.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5152f-audio-reference-rebuild');

    function prefix(){
      const p=location.pathname;
      if(p.includes('/docs/'))return '../../';
      if(p.includes('/archive/'))return '../';
      return '';
    }

    function installReferenceAudioBus(){
      const bus=window.ProjectCurseAudio;
      if(!bus || !bus.audio) return;
      const pre=prefix();
      try{
        bus.audio.ambient = new Audio(pre+'assets/audio/pc5152f_old_terminal_roomtone.wav');
        bus.audio.ambient.loop = true;

        // Short contact: analog-17 reference, softened. Used for ordinary UI input only.
        bus.audio.menu = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.drawer = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.command = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.marker = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');

        // Record access: dull tape latch / equipment engaging.
        bus.audio.open = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.page = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');

        // Loading / video / radio: equipment reading record medium.
        bus.audio.load = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.video = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.radio = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');

        // Rare major boot/access cue.
        bus.audio.boot = new Audio(pre+'assets/audio/pc5152f_boot_access_oldpc.wav');

        // Low denied/restricted: old equipment refusal, no arcade beep.
        bus.audio.alert = new Audio(pre+'assets/audio/pc5152f_low_denied_oldpc.wav');
        bus.audio.restricted = new Audio(pre+'assets/audio/pc5152f_low_denied_oldpc.wav');
        bus.audio.denied = new Audio(pre+'assets/audio/pc5152f_low_denied_oldpc.wav');
      }catch(e){}

      // Tuned from the reference set: audible but mostly "machine presence", not button performance.
      const v={
        ambient:.118,
        menu:.070, drawer:.064, command:.064, marker:.042,
        page:.050, open:.070,
        load:.074, video:.066, radio:.060,
        boot:.068,
        restricted:.068, denied:.066, alert:.060
      };
      Object.keys(v).forEach(k=>{try{ if(bus.audio[k]) bus.audio[k].volume=v[k]; }catch(e){}});
    }

    function suppressClickiness(){
      // The reference pass should not feel like rapid key typing.
      document.querySelectorAll('[data-pc5134-node], .pc5134-map-node, .tree-node, .pc5151-root-list a, .pc5151-root-list button').forEach(el=>{
        if(el.dataset.pc5152fAudioBound) return;
        el.dataset.pc5152fAudioBound='1';
        el.addEventListener('pointerdown',()=>{
          try{
            if(window.ProjectCurseAudio && typeof window.ProjectCurseAudio.playCue==='function'){
              const heavy = el.closest && (el.closest('#archive-entry') || el.closest('#faction-relation'));
              window.ProjectCurseAudio.playCue(heavy ? 'open' : 'menu', heavy ? 520 : 340);
            }
          }catch(e){}
        }, {passive:true});
      });
    }

    function updateAudioDiagnostics(){
      const meter=document.querySelector('.pc5152a-tape-meter');
      if(meter && !meter.querySelector('.pc5152f-audio-note')){
        const note=document.createElement('span');
        note.className='pc5152f-audio-note';
        note.textContent=' / OLD COMPUTER REF';
        meter.appendChild(note);
      }
      const seq=document.querySelector('.pc5152b-tape-sequence-overlay');
      if(seq) seq.setAttribute('data-audio-ref','OLD COMPUTER / ANALOG CONTACT / RECORD MOUNT');
    }

    installReferenceAudioBus();
    suppressClickiness();
    updateAudioDiagnostics();

    // Late patches may reassign volumes or dynamic nodes may re-render. Keep this stable.
    [160,520,1200,2400].forEach(t=>setTimeout(()=>{
      installReferenceAudioBus();
      suppressClickiness();
      updateAudioDiagnostics();
    },t));

    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152f:'AudioReference Rebuild',
      audioMode:'old computer roomtone + analog contact + record mount',
      referenceFiles:[
        '331946__bennohansen__old_computer.mp3',
        '841814__izzint__computer-starting.wav',
        '795374__tobbler__analog-17.wav',
        '403566__lamamakesmusic__computer_startup_boot.wav'
      ]
    });
  });
})();


// MapPatch 5.15.2g — CleanRuntime_RedBlackTerminal_Rebase.
// Red/black terminal interface pass + runtime cleanup confirmation.
// No new feature routes; keeps world/archive scope locked.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5152g-redblack-terminal-rebase');

    function prefix(){
      const p=location.pathname;
      if(p.includes('/docs/'))return '../../';
      if(p.includes('/archive/'))return '../';
      return '';
    }

    function enforceCleanAudioBus(){
      const bus=window.ProjectCurseAudio;
      if(!bus || !bus.audio) return;
      const pre=prefix();
      try{
        bus.audio.ambient = new Audio(pre+'assets/audio/pc5152f_old_terminal_roomtone.wav');
        bus.audio.ambient.loop = true;
        bus.audio.menu = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.drawer = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.command = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.marker = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.page = new Audio(pre+'assets/audio/pc5152f_analog_contact_soft.wav');
        bus.audio.open = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.load = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.video = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.radio = new Audio(pre+'assets/audio/pc5152f_record_mount_soft.wav');
        bus.audio.boot = new Audio(pre+'assets/audio/pc5152f_boot_access_oldpc.wav');
        bus.audio.alert = new Audio(pre+'assets/audio/pc5152f_low_denied_oldpc.wav');
        bus.audio.restricted = new Audio(pre+'assets/audio/pc5152f_low_denied_oldpc.wav');
        bus.audio.denied = new Audio(pre+'assets/audio/pc5152f_low_denied_oldpc.wav');
      }catch(e){}
      const v={
        ambient:.114,
        menu:.062, drawer:.058, command:.058, marker:.040, page:.046,
        open:.064, load:.066, video:.060, radio:.056,
        boot:.062, alert:.058, restricted:.064, denied:.060
      };
      Object.keys(v).forEach(k=>{try{ if(bus.audio[k]) bus.audio[k].volume=v[k]; }catch(e){}});
    }

    function relabelRootMenu(){
      document.querySelectorAll('.pc5151-root-label').forEach((el,idx)=>{
        el.setAttribute('data-pc5152g-index', String(idx+1).padStart(2,'0'));
      });
      document.querySelectorAll('.pc5151-root-list a, .pc5151-root-list button').forEach(el=>{
        if(el.dataset.pc5152gLine) return;
        el.dataset.pc5152gLine='1';
        const code=el.querySelector('i');
        const small=el.querySelector('small');
        if(code) code.textContent='['+code.textContent.replace(/[\[\]]/g,'').trim()+']';
        if(small && !small.textContent.includes('LOCAL')) small.textContent=small.textContent.replace('GLOBAL BOARD','READ ONLY BOARD').replace('AREA BOARD','LOCAL BOARD');
      });
    }

    function markArchiveRows(){
      document.querySelectorAll('#archive-entry .doc-card').forEach(card=>{
        card.classList.add('pc5152g-file-row');
        card.querySelectorAll('.pc5152g-row-status').forEach(el=>el.remove());
      });
    }

    function redblackLoaderState(){
      const loader=document.getElementById('loader');
      if(loader) loader.classList.add('pc5152g-redblack-loader-live');
      const recordLoading=document.getElementById('recordLoading');
      if(recordLoading) recordLoading.classList.add('pc5152g-record-mount-loader');
    }

    enforceCleanAudioBus();
    relabelRootMenu();
    markArchiveRows();
    redblackLoaderState();

    [120,520,1200,2400].forEach(t=>setTimeout(()=>{
      enforceCleanAudioBus();
      relabelRootMenu();
      markArchiveRows();
      redblackLoaderState();
    },t));

    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152g:'CleanRuntime RedBlackTerminal Rebase',
      audioAssets:'pc5152f-only runtime audio',
      interfaceMode:'black terminal with red error/code accents',
      loaderMode:'PC-03 boot log / record mount log',
      archiveMode:'file index rows, original setting text only'
    });
  });
})();


// MapPatch 5.15.2h — AudioClarity_SideContent_TerminalNoise_RecordSequence.
// Clarifies ordinary UI audio, reduces global TV/VHS feel, rebases side content,
// and adds a click-gated damaged-record sequence only for Cults_871104.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5152h-audio-sidecontent-terminal-sequence');

    const IMMORTALITY_RECORD='Immortality_860201';
    const SEQUENCE_RECORDS = new Set(['Cults_871104', IMMORTALITY_RECORD]);
    const state = {
      overlay:null,
      pageIndex:0,
      canAdvance:false,
      timer:null,
      bgm:null,
      cut:null,
      frame:null,
      activeRecord:null,
      nativeShow: window.ProjectCurseShowInternalRecord || null,
      finishing:false,
      lineTimer:null,
      lineEls:[],
      nextLineIndex:0,
      currentLineDelay:2500,
      pages:null,
      bgmSrc:'',
      endingPlayed:false,
      endingPlaying:false,
      immortalityStep:null,
      photoClick:null,
      dialogCue:null,
      latePulse:null,
      latePulseTimer:null,
      latePulseActive:false
    };

    const pages = [
      {
        group:'system',
        code:'VIDEO ATTACHMENT / PARTIAL',
        title:'RECOVERED SIGNAL',
        subtitle:'Damaged Record Surface',
        image:'',
        frame:'SIGNAL BUS / DEGRADED',
        lineDelay:2300,
        lines:[
          '손상된 의식성 오염 기록을 복구했습니다.',
          '영상 프레임과 신원 정보 일부는 완전하지 않습니다.'
        ]
      },
      {
        group:'cult',
        code:'FRAME 01 / CULT TRACE',
        title:'타락교',
        subtitle:'Corrupted Cult',
        image:'assets/resources/83d311da1ab7310a567c6023f6151e6c.webp',
        frame:'CULT TRACE / RECOVERED',
        lineDelay:2500,
        lines:[
          '타락교는 우시노다를 신으로 숭배하는 오염 신앙 계열이다.',
          '이들은 저주의 힘을 신성한 축복으로 받아들이며, 인간의 육체와 정신을 변질시키는 힘을 축복이라 부른다.',
          '특징: 우시노다를 신으로 숭배한다.',
          '타락의 힘을 저주가 아닌 축복으로 받아들인다.',
          '육체 변형과 불멸성을 신앙의 증거로 여긴다.',
          '인육 섭취와 의식을 통해 변형을 억제하거나 강화한다.',
          '현대 사회 내부에 비밀 조직 형태로 침투해 있다.'
        ]
      },
      {
        group:'cult',
        code:'FRAME 02 / ID FAILED',
        title:'신원불명의 신자',
        subtitle:'Unidentified Believer',
        image:'assets/resources/86ed1a163d79930b0874dbd5eb93adf2.webp',
        frame:'ID MATCH / FAILED',
        lineDelay:2500,
        lines:[
          '신원불명의 신자는 타락교 내부에서 가장 일반적으로 발견되는 신자 유형이다.',
          '타락의 힘을 받아들인 뒤 신체 변형을 겪으며, 인간으로서의 원래 형태를 점차 잃어간다.',
          '행동 양상: 단독 또는 소규모 집단으로 활동한다.',
          '일반인처럼 위장할 수 있다.',
          '신체 곳곳에 타락의 흔적이 남아 있다.',
          '살해 후 신선한 살을 섭취하는 습성이 있다.',
          '섭취 행위로 일시적으로 원래 모습을 회복한다.'
        ]
      },
      {
        group:'cult',
        code:'FRAME 03 / MASKED FORM',
        title:'가면을 쓴 존재',
        subtitle:'Masked Entity',
        image:'assets/resources/b20abfee553be1cf8a7f818a2bd84f23.webp',
        frame:'FACE TRACK / BLOCKED',
        lineDelay:2500,
        lines:[
          '가면을 쓴 존재는 타락교의 보호를 받는 특수 괴이 개체다.',
          '본래 야생의 짐승이었으나 우시노다의 타락에 의해 변형된 것으로 추정된다.',
          '특징: 야생 동물 기반의 변형 개체로 추정된다.',
          '가면 또는 가면과 유사한 외골격을 지닌다.',
          '타락교 내부에서 신성한 동물로 취급된다.',
          '의식장 중심부에서 발견되는 경우가 많다.',
          '일부 개체는 신자들에게 명령을 내리는 듯한 행동을 보인다.'
        ]
      },
      {
        group:'cult',
        code:'FRAME 04 / DEGRADATION STAGE',
        title:'타락의 과정 및 형태',
        subtitle:'Corruption Process',
        image:'assets/resources/646468c8e709d197314f9d40e286986b.webp',
        frame:'FORM SHIFT / PARTIAL',
        lineDelay:2500,
        lines:[
          '타락의 힘을 받아들인 생명체는 점진적인 신체 변형을 겪는다.',
          '초기에는 피부 변색, 체온 변화, 감각 이상, 골격 통증이 보고된다.',
          '관찰된 변형 증상: 골격 뒤틀림과 뼈의 비정상적 성장.',
          '피부 파열과 근육 구조 변형.',
          '감각 기관 손실과 자아 붕괴.',
          '기억 손상과 폭력성 증가.',
          '인간 형태의 일시적 회복.'
        ]
      },
      {
        group:'blood',
        code:'FRAME 05 / BLOOD TRACE',
        title:'혈교',
        subtitle:'Blood Cult',
        image:'assets/resources/8668a15590e2ae00b18d68db57a85c95.webp',
        frame:'BLOOD TRACE / RECOVERED',
        lineDelay:2500,
        lines:[
          '혈교는 피의 길을 숭배하는 의식 계열이다.',
          '피를 생명 유지 물질이 아니라 문을 열고, 형태를 만들고, 힘을 전달하는 매개체로 취급한다.',
          '특징: 피의 길을 숭배한다.',
          '피를 의식의 핵심 매개체로 사용한다.',
          '피를 이용해 무기, 경로, 덫, 저장소를 만든다.',
          '대량 출혈, 희생 의식, 혈액 저장 의식과 관련되어 있다.'
        ]
      },
      {
        group:'blood',
        code:'FRAME 06 / ROUTE CONTROL',
        title:'혈액 이동 경로 조정',
        subtitle:'Blood Route Control',
        image:'assets/resources/89eeb37859d35d979b1d217e11f5148f.webp',
        frame:'BLOOD ROUTE / CONTROL',
        lineDelay:2500,
        lines:[
          '혈액을 이용한 능력은 혈액의 이동 경로를 조정할 수 있는 것으로 확인되었다.',
          '출혈을 막거나, 외부 혈액을 응고시켜 무기와 방어 수단으로 활용한다.',
          '출혈로 인한 사망 방지.',
          '혈액 흐름 제어.',
          '혈액 응고를 이용한 방어막 생성.',
          '혈액을 칼날, 창, 사슬 형태로 변형.'
        ]
      },
      {
        group:'blood',
        code:'FRAME 07 / BLOOD WEAPON',
        title:'혈무의 제작 과정',
        subtitle:'혈무 Creation',
        image:'assets/resources/5a2db6abec6308c441b2b430a3da59c2.webp',
        frame:'WEAPON FORM / PARTIAL',
        lineDelay:2500,
        lines:[
          '혈무는 혈액을 근접 무기에 덮은 뒤 피의 의식을 통해 강화한 무기를 뜻한다.',
          '의식이 완료된 혈무는 기존 무기보다 높은 공격력과 내구성을 지닌다.',
          '근접 무기에 혈액을 덮어 제작한다.',
          '피의 의식이 필요하다.',
          '무기의 내구성과 절삭력이 증가한다.',
          '타락체에게 높은 피해를 입힌다.'
        ]
      },
      {
        group:'blood',
        code:'FRAME 08 / BLOOD LAKE',
        title:'피의 호수를 거니는 자들',
        subtitle:'Walking Through the Lake of Blood',
        image:'assets/resources/1ab6ba9fba9b6b8b9493045c7bf4836d.webp',
        frame:'LAKE PATH / WARNING',
        lineDelay:2500,
        lines:[
          '혈액 웅덩이는 혈교 신자들에게 저장소이자 이동 경로로 사용된다.',
          '현장 대응 인원은 혈액 웅덩이를 단순한 오염 물질로 판단해서는 안 된다.',
          '혈액 웅덩이에 접근하지 말 것.',
          '웅덩이 내부 은닉 가능성을 고려할 것.',
          '혈액용기를 사용해 회수 및 격리할 것.',
          '고열 장비로 확산을 차단할 것.'
        ]
      },
      {
        group:'blood',
        code:'FRAME 09 / RESERVOIR',
        title:'혈액 저장소',
        subtitle:'Blood Reservoir',
        image:'assets/resources/458cf4194ba894dce7e907244d2fd1f0.webp',
        frame:'RESERVOIR / SEALED',
        lineDelay:2500,
        lines:[
          '혈액 저장소는 혈액 사용자들의 보급 수단이며, 전투 중 손실된 혈액을 보충하는 용도로 사용된다.',
          '일부 의식에서는 중심 물체로 쓰이기도 한다.',
          '대량의 혈액이 저장되어 있다.',
          '전투 중 회복 수단으로 사용된다.',
          '오염 가능성이 높아 일반 접촉은 금지된다.',
          '회수 시 밀폐형 혈액용기 사용이 권장된다.'
        ]
      },
      {
        group:'blood',
        code:'FRAME 10 / SUPPRESSED ENTITY',
        title:'제압된 타락체',
        subtitle:'Suppressed Corrupted Entity',
        image:'assets/resources/7af3eeca599cebbf7235e0a1368f2517.webp',
        frame:'SUPPRESSION / CONFIRMED',
        lineDelay:2500,
        lines:[
          '혈무와 화염을 함께 사용한 공격은 타락체의 재생 능력과 신체 변형을 억제하는 데 효과적이다.',
          '혈무를 이용한 근접 절단.',
          '화염을 이용한 조직 소각.',
          '혈액 경로 봉쇄.',
          '타락 조직의 재생 차단.',
          '봉인구와 병행 사용.'
        ]
      },
      {
        group:'compare',
        code:'FRAME 11 / CROSS CHECK',
        title:'타락교와 혈교 비교',
        subtitle:'비교 기록',
        image:'',
        frame:'CROSS-CHECK / TEXT ONLY',
        lineDelay:2500,
        lines:[
          '타락교는 우시노다의 타락과 신체 변형을 숭배한다.',
          '혈교는 피의 길과 혈액 의식을 중심으로 움직인다.',
          '타락교의 핵심 위협은 괴이화와 불멸성이다.',
          '혈교의 핵심 위협은 혈액 무기화와 이동 경로 조작이다.',
          '두 계열 모두 우시노다교 통합 위협 안에서 관리된다.'
        ]
      },
      {
        group:'warning',
        code:'FRAME 12 / FIELD WARNING',
        title:'현장 대응 경고',
        subtitle:'작전 지침',
        image:'',
        frame:'FIELD RESPONSE / WARNING',
        lineDelay:2500,
        lines:[
          '타락교 신자는 인간의 외형을 유지하고 있어도 안전하지 않다.',
          '혈교가 남긴 혈액 웅덩이는 단순한 혈흔이 아니다.',
          '혈액 웅덩이는 이동 경로, 저장소, 덫, 원거리 공격 수단으로 사용될 수 있다.',
          '단독 접근 금지.',
          'N.H.C 또는 S.I.D 동행 필수.',
          '혈액 웅덩이 접촉 금지.',
          '의식장 발견 시 현장 봉쇄 우선.'
        ]
      },
      {
        group:'return',
        code:'SEQUENCE END / RETURN',
        title:'기록보관소 복귀',
        subtitle:'Archive List Ready',
        image:'',
        frame:'ARCHIVE LIST / READY',
        lineDelay:2300,
        lines:[
          '손상 영상 첨부 확인이 끝났습니다.',
          '화면 선택 시 본문 열람으로 진입하지 않고 기록보관소 목록으로 복귀합니다.'
        ]
      }
    ];

    const immortalityPages = [
      {
            "group": "imm_original",
            "code": "IMMORTALITY / ORIGINAL RECORD",
            "title": "불멸을 향해",
            "subtitle": "Blood Lake Incident File",
            "image": "",
            "frame": "ORIGINAL RECORD / OVERVIEW",
            "lineDelay": 2300,
            "lines": [
                  "독일 본토 [검열] 지역에서 이상현상 감지됨",
                  "XX 정찰 부대에 의해 최초 발견",
                  "이 문서는 독일 본토 [검열] 지역에서 발생한 피의 호수 관련 이상현상과, 현장 촬영 및 통신 임무를 수행하던 유닛2의 작전 기록을 정리한 사건 파일이다",
                  "현장 인근 주민들의 제보에 따르면 붉은 액체가 강을 뒤덮었으며, 피로 뒤덮이거나 살이 찢겨진 야생 동물들이 마을을 덮친 것으로 보고되었다",
                  "해당 현상은 혈교 또는 혈액성 의식과 관련된 사건으로 추정되며, 이후 피의 호수 와 연결되는 다수의 이상현상이 확인되었다"
            ]
      },
      {
            "group": "imm_original",
            "code": "IMMORTALITY / RECORD INFO",
            "title": "기록 정보",
            "subtitle": "문서 분류",
            "image": "assets/resources/b1f6105c9de718ff230e00b702ada13b.webp",
            "frame": "CASE INFO / BLOOD LAKE",
            "lineDelay": 2300,
            "lines": [
                  "분류명: 불멸을 향해",
                  "영문명: Blood Lake Incident File",
                  "기록 형태: 작전 로그 / 현장 촬영 기록 / 통신 기록 / 이상현상 보고서",
                  "관련 지역: 독일 본토 [검열] 지역",
                  "관련 현상:  피의 호수 / 혈액성 잔류물 / 이상 안개 / 야생 동물 변질",
                  "관련 피해자: 마렌 예거트 / 요나스 밀로 / 유닛4 / 유닛7",
                  "보안 등급: 기밀",
                  "위험도:  높음 ~ 극한",
                  "사건 개요",
                  "독일 본토 [검열] 지역에서 붉은 액체가 강을 뒤덮는 이상현상이 보고되었다",
                  "현장 근처에 거주하던 주민들은 피로 뒤덮인 야생 동물, 살이 찢겨진 짐승, 안개에 가려진 언덕길, 나무 위에 매달린 미확인 물체 등을 목격했다고 진술하였다",
                  "해당 지역은 초기에는 화이트존 으로 분류되었으나, 현장 기록과 통신 두절, 피의 호수 발견 이후 레드존 후보 지역으로 재분류되었다",
                  "본 기록은 유닛2가 현장에 투입된 이후 전송한 사진, 통신, 위치 추적 자료, 심리 상태 기록을 기반으로 복구되었다"
            ]
      },
      {
            "group": "imm_original",
            "code": "IMMORTALITY / UNIT 2",
            "title": "작전 투입 기록",
            "subtitle": "유닛2",
            "layout": "peoplePair",
            "image": "",
            "frame": "UNIT 2 / PERSONNEL",
            "lineDelay": 2300,
            "people": [
                  {
                        "name": "마렌 예거트",
                        "role": "현장 촬영 및 통신 담당",
                        "image": "assets/resources/9b4094a85c1863367b1b86cc915ec814.webp"
                  },
                  {
                        "name": "요나스 밀로",
                        "role": "기술 지원 전문가",
                        "image": "assets/resources/9eb253063ee6ca8cc712efd4f22b7498.webp"
                  }
            ],
            "lines": []
      },
      {
            "group": "imm_original",
            "code": "IMMORTALITY / UNIT 2 EQUIPMENT",
            "title": "지급 장비",
            "subtitle": "대기 병력",
            "image": "",
            "frame": "UNIT 2 / EQUIPMENT AND STANDBY",
            "lineDelay": 2300,
            "lines": [
                  "유닛2에게는 현장 정찰을 위한 3일치의 보급품과 손전등, 통신 장비, 특수 촬영 장비, I.P.D 장치, N.H.C 에서 사용하는 대화력 무기가 지급되었다.",
                  "해당 장비는 이상현상 감지 지역에서의 생존, 위치 추적, 심리 상태 측정, 고위험 개체와의 교전 가능성을 고려하여 지급된 것으로 확인된다.",
                  "유닛2의 구조 요청이 확인될 경우 즉시 대응할 수 있도록 중무장팀이 인근 대기 지점에 배치되었다.",
                  "그러나 현장 통신 상태가 불안정해지면서 구조 요청의 정확한 수신 여부와 위치 확인에 문제가 발생하였다."
            ]
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 16:10",
            "title": "16:10",
            "subtitle": "유닛2 현장 도착",
            "image": "",
            "frame": "FIELD LOG / 16:10",
            "lineDelay": 1500,
            "lines": [
                  "유닛2가 현장에 도착",
                  "유닛2에는 다음 장비가 지급되었다.",
                  "3일치 보급품",
                  "휴대용 손전등",
                  "N.H.C 규격 대화력 무기",
                  "개인 추적용 I.P.D 장치",
                  "현장 촬영 장비",
                  "혈액 오염 감지 키트",
                  "단거리 통신 장치",
                  "유닛2의 구조 요청이 확인될 경우 즉시 대응할 중무장 지원팀이 대기 상태에 들어갔다."
            ],
            "layout": "redLog",
            "logTime": "16:10",
            "logTitle": "유닛2 현장 도착",
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 16:27",
            "title": "16:27",
            "subtitle": "초기 통신 연결",
            "image": "",
            "frame": "FIELD LOG / 16:27",
            "lineDelay": 1500,
            "lines": [
                  "〔예거트〕: 본부로 사진 전송 중, 확인 바람.",
                  "〔본부〕: 전송 확인됨. 대기하라."
            ],
            "layout": "redLog",
            "logTime": "16:27",
            "logTitle": "초기 통신 연결",
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 16:31",
            "title": "16:31",
            "subtitle": "IMG001",
            "image": "assets/resources/f59b02e8f859bfc95d683636bcf39500.webp",
            "frame": "FIELD LOG / 16:31",
            "lineDelay": 1650,
            "lines": [
                  "고화질 사진 전송 확인",
                  "안개로 인해 언덕길의 시야 확보가 불가능한 상태.",
                  "가시거리는 극히 제한적이며, 기온 하강 및 습도 상승이 동반됨.",
                  "본부 분석",
                  "해당 안개는 자연 발생 안개와 성분이 일부 다르며, 미세한 혈액성 입자 반응이 감지됨."
            ],
            "layout": "photoLarge",
            "photoSfx": true,
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 16:46",
            "title": "16:46",
            "subtitle": "IMG002",
            "image": "assets/resources/dec4cbe943147076943a62681048ad35.webp",
            "frame": "FIELD LOG / 16:46",
            "lineDelay": 1650,
            "lines": [
                  "다수의 나무 위에 미확인 물체 발견",
                  "현장 주변 나무 위에 다수의 미확인 물체가 매달려 있는 것이 확인되었다.",
                  "형태는 불명확하며, 시신 또는 찢긴 동물의 사체일 가능성이 제기되었다.",
                  "〔본부〕: 해당 지점과 거리를 유지한 채 이동하라."
            ],
            "layout": "photoLarge",
            "photoSfx": true,
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 17:02",
            "title": "17:02",
            "subtitle": "버려진 텐트 발견",
            "image": "",
            "frame": "FIELD LOG / 17:02",
            "lineDelay": 1500,
            "lines": [
                  "〔예거트〕: 버려진 텐트가 보인다.",
                  "〔밀로〕: 나라면 저기로 안 갈 거야.",
                  "〔예거트〕: 아직 작전지의 절반도 오지 않았어. 겁쟁이처럼 굴지 마. 본부, 텐트 내부를 수색해도 될지 승인 여부 바람.",
                  "〔본부〕: 특수 장치로 촬영한 사진 전송 바람. 확인 후 승인 여부를 알려주겠다."
            ],
            "layout": "redLog",
            "logTime": "17:02",
            "logTitle": "버려진 텐트 발견",
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 17:09",
            "title": "17:09",
            "subtitle": "IMG003",
            "image": "assets/resources/11f2f935e0339690ace785966d7e436f.webp",
            "frame": "FIELD LOG / 17:09",
            "lineDelay": 1650,
            "lines": [
                  "텐트 외부 확인",
                  "특수 장치로 촬영된 텐트 외부 사진 분석 결과, 명확한 이상현상은 발견되지 않음.",
                  "〔본부〕: 텐트 내부 수색을 승인한다. 단, 5분 이상 체류하지 마라. 날이 어두워진다."
            ],
            "layout": "photoLarge",
            "photoSfx": true,
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 17:16",
            "title": "17:16",
            "subtitle": "IMG004",
            "image": "assets/resources/fa10a34b64ccc7605b0966af4c017d99.webp",
            "frame": "FIELD LOG / 17:16",
            "lineDelay": 1650,
            "lines": [
                  "텐트 내부 수색 결과",
                  "텐트 내부에서는 민간인이 머물렀던 흔적이 발견되었다.",
                  "확인된 물품은 다음과 같다.",
                  "이어폰 2개",
                  "침낭",
                  "MP3 플레이어",
                  "다량의 혈흔",
                  "현장 상태를 바탕으로 최소 2명의 민간인이 해당 장소에 머물렀던 것으로 추정된다.",
                  "〔예거트〕: 본부?",
                  "〔본부〕: 계속 이동해라."
            ],
            "layout": "photoLarge",
            "photoSfx": true,
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 17:41",
            "title": "17:41",
            "subtitle": "강변 접근",
            "image": "",
            "frame": "FIELD LOG / 17:41",
            "lineDelay": 1500,
            "lines": [
                  "유닛2가 강변 지대에 접근하였다.",
                  "현장 영상에서 강물의 색이 정상 범위를 벗어난 것으로 확인되었다.",
                  "본부 분석",
                  "강물은 단순한 적색 오염수가 아니며, 혈액과 유사한 점도 및 응고 반응을 보인다."
            ],
            "layout": "redLog",
            "logTime": "17:41",
            "logTitle": "강변 접근",
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 17:58",
            "title": "17:58",
            "subtitle": "IMG005",
            "image": "assets/resources/d537338b8d854ef34d0e3638d436cb01.webp",
            "frame": "FIELD LOG / 17:58",
            "lineDelay": 1650,
            "lines": [
                  "거대한 개체 및 피의 호수 발견",
                  "현장 깊숙한 지점에서 대규모 혈액성 액체 웅덩이, 이른바 피의 호수 가 발견되었다.",
                  "동시에 그 주변에서 비정상적으로 거대한 개체의 실루엣이 포착되었다.",
                  "피의 호수 는 정적인 액체가 아니라, 마치 내부에서 미세한 파동과 움직임이 감지되는 형태로 보고되었다.",
                  "〔예거트〕: 무서워.",
                  "〔본부〕: 이유는?",
                  "〔예거트〕: 나도 잘 모르겠다, 본부."
            ],
            "layout": "photoLarge",
            "photoSfx": true,
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 18:06",
            "title": "18:06",
            "subtitle": "심리 상태 이상 감지",
            "image": "",
            "frame": "FIELD LOG / 18:06",
            "lineDelay": 1500,
            "lines": [
                  "예거트에게 부착된 I.P.D 장치에서 심박수 증가, 호흡 불안정, 손 떨림, 방향 감각 저하가 감지되었다.",
                  "본부 기록",
                  "외상 없음. 적성 개체와의 직접 접촉 없음.",
                  "정신 간섭형 이상 반응 가능성 있음."
            ],
            "layout": "redLog",
            "logTime": "18:06",
            "logTitle": "심리 상태 이상 감지",
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 18:14",
            "title": "18:14",
            "subtitle": "유닛4 통신 두절",
            "image": "assets/resources/b5f9b2c2ddea9084ff8f6e8dfdc6549b.webp",
            "frame": "FIELD LOG / 18:14",
            "lineDelay": 1650,
            "lines": [
                  "유닛4와의 통신이 완전히 두절되었다.",
                  "동시에 전반적인 통신 상태 불량이 보고되었다.",
                  "유닛4에게 부착된 I.P.D 장치가 강제 활성화되었으며, 위치 추적 시스템에 연결되었다."
            ],
            "layout": "photoLarge",
            "photoSfx": false,
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 18:22",
            "title": "18:22",
            "subtitle": "유닛7 이동 개시",
            "image": "",
            "frame": "FIELD LOG / 18:22",
            "lineDelay": 1500,
            "lines": [
                  "〔본부〕: 유닛7이 현재 유닛4에게로 향하는 중이다. 계속 강을 따라서 이동해라. 걱정마라.",
                  "〔예거트〕: 무서워."
            ],
            "layout": "redLog",
            "logTime": "18:22",
            "logTitle": "유닛7 이동 개시",
            "latePulse": false,
            "photoSfx": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 18:29",
            "title": "18:29",
            "subtitle": "예거트 심리 안정 수치 불안정",
            "image": "assets/resources/ea33a51515476e2946267ea56b453760.webp",
            "frame": "FIELD LOG / 18:29",
            "lineDelay": 1650,
            "lines": [
                  "예거트에게 부착된 I.P.D 장치에서 심리 안정 상태가 불안정함을 확인하였다.",
                  "심리 치료팀 대기.",
                  "그러나 현장 상황상 즉각 회수는 불가능.",
                  "본부 기록",
                  "움직임이 좋지 않다.",
                  "보행 속도가 일정하지 않고, 같은 지점에서 반복적으로 멈추는 현상이 확인됨."
            ],
            "layout": "photoLarge",
            "photoSfx": false,
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 18:37",
            "title": "18:37",
            "subtitle": "밀로 I.P.D 장치 활성화",
            "image": "assets/resources/c5b5c946c876fbf1bd5fc2f0f1616478.webp",
            "frame": "FIELD LOG / 18:37",
            "lineDelay": 1650,
            "lines": [
                  "밀로에게 부착된 I.P.D 장치 활성화 확인.",
                  "위치 추적 시스템에 연결됨.",
                  "밀로는 예거트의 후방 약 300m 지점에서 이동 중인 것으로 표시되었다."
            ],
            "layout": "photoLarge",
            "photoSfx": false,
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 18:42",
            "title": "18:42",
            "subtitle": "이상 이동 패턴 감지",
            "image": "assets/resources/8da1d79fd90b59063f33aa00f1eb742a.webp",
            "frame": "FIELD LOG / 18:42",
            "lineDelay": 1650,
            "lines": [
                  ".....뭔가 이상하다.",
                  "밀로의 움직임이 비정상적이다.",
                  "밀로의 이동 경로는 일반적인 인간의 보행 패턴과 일치하지 않는다.",
                  "짧은 시간 동안 지나치게 빠르게 접근하거나, 특정 지점에서 비정상적으로 정지하는 양상이 반복된다.",
                  "〔본부〕: 예거트, 즉시 총기를 꺼내라. 위험 상황에 대비하라."
            ],
            "layout": "photoLarge",
            "photoSfx": false,
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 18:44",
            "title": "18:44",
            "subtitle": "비인가 통신 기록",
            "image": "assets/resources/4af91e95281c83ead7c52b06dfbdca38.webp",
            "frame": "FIELD LOG / 18:44",
            "lineDelay": 1650,
            "lines": [
                  "우리가 전부 미안해, 예거트",
                  "이 문장은 본부 기록에 남아 있으나, 누가 어떤 의도로 해당 표현을 사용했는지는 불명이다.",
                  "일부 분석관은 이를 단순 오기록이 아닌, 통신망에 개입한 제3의 존재 또는 혈교 의식으로 인해 왜곡된 송신으로 추정한다."
            ],
            "layout": "photoLarge",
            "photoSfx": false,
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 18:51",
            "title": "18:51",
            "subtitle": "마지막 정상 통신",
            "image": "",
            "frame": "FIELD LOG / 18:51",
            "lineDelay": 1500,
            "lines": [
                  "〔본부〕: 유닛7 이동 중임을 확인. 보고하라.",
                  "〔#%$〕: .......",
                  "이후 통신 품질이 급격히 저하되었다."
            ],
            "layout": "redLog",
            "logTime": "18:51",
            "logTitle": "마지막 정상 통신",
            "latePulse": false,
            "photoSfx": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 18:56",
            "title": "18:56",
            "subtitle": "IMG006",
            "image": "assets/resources/05cdc0276694d090f3829c4dc6e5a30b.webp",
            "frame": "FIELD LOG / 18:56",
            "lineDelay": 1650,
            "lines": [
                  "마지막 이미지 전송",
                  "호수가 당신을 기다린다... 수천 개의 손이 당신을....",
                  "마지막으로 전송된 이미지에는 피의 호수 표면으로부터 다수의 손과 유사한 형상이 솟아오르는 장면이 담겨 있었다.",
                  "형상은 인간의 손과 유사했으나, 관절 구조와 길이가 비정상적으로 뒤틀려 있었다.",
                  "이미지 표면에는 분석이 불가능한 문장 일부가 노이즈처럼 남아 있었다."
            ],
            "layout": "photoLarge",
            "photoSfx": false,
            "latePulse": false
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 19:00",
            "title": "기록보관소로 복귀",
            "subtitle": "19:00 / 임무 상태: 완료",
            "image": "",
            "frame": "FIELD LOG / 19:00",
            "lineDelay": 1500,
            "lines": [
                  "시스템상 임무는 완료로 처리되었다.",
                  "기록 열람을 종료합니다.",
                  "입력 시 기록보관소 목록으로 복귀합니다."
            ],
            "layout": "redLog",
            "logTime": "19:00",
            "logTitle": "기록보관소로 복귀",
            "latePulse": false,
            "photoSfx": false
      }
];

    function getActivePages(){
      return state.pages || pages;
    }

    function getSequenceConfig(){
      if(state.activeRecord===IMMORTALITY_RECORD){
        return {
          key:'immortality',
          sourceLabel:'U.A.C / ORIGINAL RECORD',
          bodyClass:'pc5152q-immortality-sequence',
          introVideo:'assets/video/pc5152r_immortality_recordopen_static_13_27.mp4',
          transitionVideo:'assets/video/pc5152q_immortality_fhc_transition_204_209.mp4',
          endingVideo:'',
          bgm:'assets/audio/pc5152v_immortality_scp087_vcr_ambient_mix.mp3',
          bgmVolume:.86,
          introVolume:.09,
          transitionVolume:.72,
          introFallback:14650,
          transitionFallback:5650,
          mountTitle:'RECORD MOUNT',
          mountLines:[
            'F.H.C SOURCE ....... DETECTED',
            'VIDEO MARK ......... CONFIRMED',
            'TEXT BLOCK ......... PARTIAL',
            'LOCAL ACCESS ....... ACCEPTED'
          ],
          mountHint:'READ PERMISSION: ORIGINAL RECORD / IMMORTALITY ATTACHED'
        };
      }
      return {
        key:'cult',
        sourceLabel:'F.H.C / LOCAL COPY',
        bodyClass:'pc5152h-cult-source-sequence',
        introVideo:'assets/video/pc5152k_damaged_signal_intro_sound_10s.mp4',
        transitionVideo:'assets/video/pc5152m_vhs_transition_18_21_sound.mp4',
        endingVideo:'',
        bgm:'assets/audio/pc5152y_cults_banalities_radio_static_bgm.mp3',
        bgmVolume:.54,
        introVolume:.68,
        transitionVolume:.78,
        introFallback:10450,
        transitionFallback:3750,
        mountTitle:'RECORD MOUNT',
        mountLines:[
          'VIDEO FRAME ....... DAMAGED',
          'TEXT BLOCK ........ PARTIAL',
          'LOCAL ACCESS ...... ACCEPTED'
        ],
        mountHint:'READ PERMISSION: LOCAL / SEQUENCE ATTACHED'
      };
    }


    function prefix(){
      const p=location.pathname;
      if(p.includes('/docs/'))return '../../';
      if(p.includes('/archive/'))return '../';
      return '';
    }

    function installClearAudioBus(){
      const bus=window.ProjectCurseAudio;
      if(!bus || !bus.audio) return;
      const pre=prefix();
      try{
        bus.audio.ambient = new Audio(pre+'assets/audio/pc5152f_old_terminal_roomtone.wav');
        bus.audio.ambient.loop = true;

        bus.audio.menu = new Audio(pre+'assets/audio/pc5152h_terminal_contact_clear.wav');
        bus.audio.drawer = new Audio(pre+'assets/audio/pc5152h_terminal_contact_clear.wav');
        bus.audio.command = new Audio(pre+'assets/audio/pc5152h_terminal_contact_clear.wav');
        bus.audio.marker = new Audio(pre+'assets/audio/pc5152h_terminal_contact_clear.wav');
        bus.audio.page = new Audio(pre+'assets/audio/pc5152h_terminal_contact_clear.wav');

        bus.audio.open = new Audio(pre+'assets/audio/pc5152h_record_mount_clear.wav');
        bus.audio.load = new Audio(pre+'assets/audio/pc5152h_record_mount_clear.wav');
        bus.audio.video = new Audio(pre+'assets/audio/pc5152h_record_mount_clear.wav');
        bus.audio.radio = new Audio(pre+'assets/audio/pc5152h_record_mount_clear.wav');

        bus.audio.boot = new Audio(pre+'assets/audio/pc5152f_boot_access_oldpc.wav');
        bus.audio.alert = new Audio(pre+'assets/audio/pc5152f_low_denied_oldpc.wav');
        bus.audio.restricted = new Audio(pre+'assets/audio/pc5152f_low_denied_oldpc.wav');
        bus.audio.denied = new Audio(pre+'assets/audio/pc5152f_low_denied_oldpc.wav');
      }catch(e){}
      const v={
        ambient:.088,
        menu:.078, drawer:.070, command:.070, marker:.052, page:.062,
        open:.078, load:.080, video:.070, radio:.064,
        boot:.060, alert:.058, restricted:.064, denied:.060
      };
      Object.keys(v).forEach(k=>{try{ if(bus.audio[k]) bus.audio[k].volume=v[k]; }catch(e){}});
    }

    function ensureSpecialAudio(){
      const pre=prefix();
      const cfg=getSequenceConfig();
      if(cfg.bgm){
        const bgmPath=pre+cfg.bgm;
        if(!state.bgm || state.bgmSrc!==bgmPath){
          try{ if(state.bgm){ state.bgm.pause(); state.bgm.currentTime=0; } }catch(e){}
          state.bgm = new Audio(bgmPath);
          state.bgm.loop = true;
          state.bgmSrc = bgmPath;
        }
        state.bgm.volume = Number(cfg.bgmVolume||.78);
      }else{
        try{ if(state.bgm){ state.bgm.pause(); state.bgm.currentTime=0; } }catch(e){}
        state.bgm = null;
        state.bgmSrc = '';
      }
      if(!state.internalStep){
        state.internalStep = new Audio(pre+'assets/audio/pc5152p_internal_projector_vhs_step.wav');
        state.internalStep.volume = .58;
      }
      if(!state.immortalityStep){
        state.immortalityStep = new Audio(pre+'assets/audio/pc5152s_immortality_page_black_beep_51_55.mp3');
        state.immortalityStep.volume = .0;
      }
      if(!state.photoClick){
        state.photoClick = new Audio(pre+'assets/audio/pc5152v_field_photo_click_42s.mp3');
        state.photoClick.volume = .58;
      }
      if(!state.dialogCue){
        state.dialogCue = new Audio(pre+'assets/audio/pc5152v_comm_line_cue_73_74.mp3');
        state.dialogCue.volume = .42;
      }
      if(!state.latePulse){
        state.latePulse = new Audio(pre+'assets/audio/pc5152x_late_log_beep_195s.mp3');
        state.latePulse.volume = .0;
      }
      if(!state.frame){
        state.frame = new Audio(pre+'assets/audio/pc5152h_frame_pop.wav');
        state.frame.volume = .0;
      }
    }

    function playLocal(a){
      if(!a) return;
      try{ a.currentTime=0; a.play().catch(()=>{}); }catch(e){}
    }

    function stopImmortalityLatePulse(){
      if(state.latePulseTimer){
        clearInterval(state.latePulseTimer);
        state.latePulseTimer=null;
      }
      state.latePulseActive=false;
      try{ if(state.latePulse){ state.latePulse.pause(); state.latePulse.currentTime=0; } }catch(e){}
    }

    function updateImmortalityLatePulse(page){
      if(state.activeRecord!==IMMORTALITY_RECORD || !page || !page.latePulse){
        stopImmortalityLatePulse();
        return;
      }
      if(state.latePulseActive) return;
      state.latePulseActive=true;
      setTimeout(()=>{ if(state.latePulseActive) playLocal(state.latePulse); }, 250);
      state.latePulseTimer=setInterval(()=>{ playLocal(state.latePulse); }, 2000);
    }

    function escSeq(v){
      return String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    function highlightImmortalityNames(text){
      return String(text)
        .replace(/(마렌 예거트|요나스 밀로|예거트|밀로)/g,'<span class="pc5152v-name-blue">$1</span>')
        .replace(/(본부)/g,'<span class="pc5152v-name-mint">$1</span>');
    }

    function isDialogueLike(line){
      const s=String(line||'');
      return /^〔[^〕]+〕\s*:/.test(s) || s.includes('우리가 전부 미안해');
    }

    function formatImmortalityLine(line,i,page){
      const raw=String(line||'');
      const safe=escSeq(raw);
      const dialog=isDialogueLike(raw);
      const m=raw.match(/^〔([^〕]+)〕\s*:\s*(.*)$/);
      let cls='pc5152k-seq-line pc5152v-red-line';
      let attrs=' data-line="'+i+'"';
      if(dialog) attrs+=' data-dialog="1"';
      if(m){
        const speaker=m[1];
        const body=highlightImmortalityNames(escSeq(m[2]||''));
        let scls='pc5152v-speaker-red';
        if(/예거트|밀로/.test(speaker)) scls='pc5152v-speaker-blue';
        else if(/본부/.test(speaker)) scls='pc5152v-speaker-mint';
        else if(/#|%|\$|\?/.test(speaker)) scls='pc5152v-speaker-corrupt';
        return '<span class="'+cls+' pc5152v-dialog-line"'+attrs+'><b class="'+scls+'">〔'+escSeq(speaker)+'〕:</b><em>'+body+'</em></span>';
      }
      if(dialog){
        return '<span class="'+cls+' pc5152v-dialog-line pc5152v-unauthorized-line"'+attrs+'>'+highlightImmortalityNames(safe)+'</span>';
      }
      return '<span class="'+cls+'"'+attrs+'>'+highlightImmortalityNames(safe)+'</span>';
    }

    function buildSequenceLines(page){
      return (page.lines||[]).map((line,i)=>{
        if(state.activeRecord===IMMORTALITY_RECORD) return formatImmortalityLine(line,i,page);
        return '<span class="pc5152k-seq-line" data-line="'+i+'">'+escSeq(line)+'</span>';
      }).join('');
    }

    function buildRedLogBlock(page,lines){
      const header='<span class="pc5152k-seq-line pc5152v-log-header" data-line="0"><b>LOG '+escSeq(page.logTime||page.title||'--:--')+'</b><em>'+escSeq(page.logTitle||page.subtitle||'FIELD LOG')+'</em></span>';
      const shifted=(page.lines||[]).map((line,i)=>formatImmortalityLine(line,i+1,page)).join('');
      return '<div class="pc5152v-red-log">'+header+shifted+'</div>';
    }

    function buildPhotoLargeBlock(page,lines){
      const cap=escSeq(page.subtitle||page.frame||'FIELD IMAGE');
      const img='<figure class="pc5152v-large-photo pc5152k-seq-line" data-line="0" data-photo="1"><img src="'+prefix()+page.image+'" alt="'+cap+'"/><figcaption>'+cap+'</figcaption></figure>';
      const shifted=(page.lines||[]).map((line,i)=>formatImmortalityLine(line,i+1,page)).join('');
      return '<div class="pc5152v-photo-page">'+img+'<div class="pc5152v-photo-lines">'+shifted+'</div></div>';
    }


    function stopSequenceAudio(){
      stopImmortalityLatePulse();
      try{
        if(state.bgm){
          state.bgm.pause();
          state.bgm.currentTime=0;
        }
        if(state.photoClick){ state.photoClick.pause(); state.photoClick.currentTime=0; }
        if(state.dialogCue){ state.dialogCue.pause(); state.dialogCue.currentTime=0; }
      }catch(e){}
    }

    function ensureOverlay(){
      if(state.overlay) return state.overlay;
      const pre=prefix();
      const el=document.createElement('div');
      el.className='pc5152h-cult-sequence';
      el.setAttribute('aria-hidden','true');
      el.innerHTML=[
        '<video class="pc5152h-seq-video" playsinline preload="auto" src="'+pre+'assets/video/pc5152k_damaged_signal_intro_sound_10s.mp4"></video>',
        '<video class="pc5152m-transition-video" playsinline preload="auto" src="'+pre+'assets/video/pc5152m_vhs_transition_18_21_sound.mp4"></video>',
        '<video class="pc5152q-ending-video" playsinline preload="auto"></video>',
        '<div class="pc5152h-seq-black"></div>',
        '<div class="pc5152h-seq-scan"></div>',
        '<button class="pc5152x-seq-return" type="button">돌아가기</button>',
        '<div class="pc5152h-seq-panel">',
          '<div class="pc5152h-seq-meta"><span data-seq-code></span><b data-seq-source>F.H.C / LOCAL COPY</b></div>',
          '<div class="pc5152h-seq-body">',
            '<div class="pc5152h-seq-text">',
              '<h2 data-seq-title></h2>',
              '<div class="pc5152k-seq-linebox" data-seq-body></div>',
            '</div>',
            '<figure class="pc5152h-seq-frame" data-seq-figure>',
              '<img data-seq-image alt="손상 기록 프레임"/>',
              '<figcaption data-seq-frame></figcaption>',
            '</figure>',
          '</div>',
          '<div class="pc5152h-seq-footer">',
            '<span data-seq-status>SIGNAL READING...</span>',
            '<small data-seq-counter></small>',
          '</div>',
        '</div>'
      ].join('');
      document.body.appendChild(el);
      state.overlay=el;
      return el;
    }

    function showMountLoader(done){
      const cfg=getSequenceConfig();
      const el=document.getElementById('recordLoading') || document.createElement('div');
      if(!el.id){
        el.id='recordLoading';
        el.className='record-loading pc5152h-record-mount-loader';
        document.body.appendChild(el);
      }
      el.classList.add('pc5152h-record-mount-loader');
      const lines=(cfg.mountLines||[]).map(line=>'<div class="logline">'+line+'</div>').join('');
      el.innerHTML='<div class="box"><div class="title">'+(cfg.mountTitle||'RECORD MOUNT')+'</div>'+lines+'<div class="bars"><i></i></div><div class="loader-hint">'+(cfg.mountHint||'READ PERMISSION: LOCAL / SEQUENCE ATTACHED')+'</div></div>';
      el.classList.remove('done');
      void el.offsetWidth;
      el.classList.add('show');
      try{ if(window.ProjectCurseAudio) window.ProjectCurseAudio.playCue('load',220); }catch(e){}
      setTimeout(()=>{
        el.classList.add('done');
        el.classList.remove('show');
        if(typeof done==='function') done();
      }, 850);
    }

    function clearSequenceTimers(){
      clearTimeout(state.timer);
      clearTimeout(state.lineTimer);
      if(state.revealTimers && state.revealTimers.length){
        state.revealTimers.forEach(t=>clearTimeout(t));
      }
      state.revealTimers=[];
      state.lineEls=[];
      state.nextLineIndex=0;
    }


    function isInternalProjectorTransition(current,next){
      return !!(current && next && current.group===next.group && (current.group==='cult' || current.group==='blood'));
    }

    function isVideoMajorTransition(current,next){
      if(state.activeRecord===IMMORTALITY_RECORD){
        return false;
      }
      return !!(current && next && (
        (current.group==='system' && next.group==='cult') ||
        (current.group==='cult' && next.group==='blood') ||
        (current.group==='blood' && next.group==='compare') ||
        (current.group==='compare' && next.group==='warning')
      ));
    }

    function beginBlackTransition(nextIndex){
      const el=ensureOverlay();
      const activePages=getActivePages();
      const current=activePages[state.pageIndex] || {};
      const next=activePages[nextIndex] || {};
      const videoMajor=isVideoMajorTransition(current,next);
      const cfg=getSequenceConfig();
      const hold=videoMajor ? Number(cfg.transitionFallback||3100) : (state.activeRecord===IMMORTALITY_RECORD ? 4050 : 2000);
      state.canAdvance=false;
      state.transitioning=true;
      clearSequenceTimers();
      el.classList.remove('input-ready','frame-ready','page-reveal');
      el.classList.add('black-transition');
      el.classList.toggle('major-transition', !!videoMajor);
      el.classList.toggle('video-transition', !!videoMajor);
      el.classList.toggle('normal-transition', !videoMajor);
      const immortalityBlack = state.activeRecord===IMMORTALITY_RECORD && !videoMajor;
      el.querySelector('[data-seq-code]').textContent=videoMajor?'VHS INSERT / RECORD FACE SWITCH':(immortalityBlack?'F.H.C BLACK NOISE / PAGE STEP':'TRACKING CUT / PAGE STEP');
      el.querySelector('[data-seq-title]').textContent='';
      el.querySelector('[data-seq-body]').innerHTML='';
      el.querySelector('[data-seq-frame]').textContent=videoMajor?'VIDEO INSERT 18-21 / SOUND ON':(immortalityBlack?'BLACK SIGNAL / BEEP 51-55':'VHS BLACK / HOLD');
      el.querySelector('[data-seq-counter]').textContent='';
      const source=el.querySelector('[data-seq-source]');
      if(source && immortalityBlack) source.textContent=cfg.sourceLabel||'F.H.C / RECOVERED SOURCE';
      const fig=el.querySelector('[data-seq-figure]');
      if(fig) fig.hidden=true;
      const status=el.querySelector('[data-seq-status]');
      status.textContent=videoMajor?'VHS INSERT PLAYBACK':(immortalityBlack?'BLACK NOISE / AUDIO PULSE':'NOISE HOLD / PAGE RECOVER');

      if(videoMajor){
        const tv=el.querySelector('.pc5152m-transition-video');
        let moved=false;
        const finish=()=>{
          if(moved) return;
          moved=true;
          clearTimeout(state.timer);
          try{ tv.pause(); tv.currentTime=0; }catch(e){}
          try{ if(state.bgm && !state.bgm.paused) state.bgm.volume=Number(cfg.bgmVolume||.78); }catch(e){}
          state.transitioning=false;
          el.classList.remove('black-transition','major-transition','normal-transition','video-transition');
          state.pageIndex=nextIndex;
          renderPage();
        };
        try{
          if(state.bgm && !state.bgm.paused) state.bgm.volume=.30;
          tv.loop=false;
          tv.muted=false;
          tv.volume=Number(cfg.transitionVolume||.78);
          if(tv.getAttribute('src')!==prefix()+cfg.transitionVideo){ tv.src=prefix()+cfg.transitionVideo; }
          tv.currentTime=0;
          tv.onended=finish;
          const playPromise=tv.play();
          if(playPromise && playPromise.catch) playPromise.catch(()=>setTimeout(finish, hold));
        }catch(e){
          setTimeout(finish, hold);
        }
        state.timer=setTimeout(finish, hold+650);
        return;
      }

      // Immortality pages use only a noisy black hold plus the 51s-55s beep cue.
      // Cult/blood internal subpages keep the VHS-treated slide projector cue.
      if(state.activeRecord===IMMORTALITY_RECORD){
        try{ if(state.bgm && !state.bgm.paused) state.bgm.volume=.62; }catch(e){}
        playLocal(state.immortalityStep);
      }else if(isInternalProjectorTransition(current,next)){
        playLocal(state.internalStep);
      }
      state.timer=setTimeout(()=>{
        try{ if(state.activeRecord===IMMORTALITY_RECORD && state.bgm && !state.bgm.paused) state.bgm.volume=Number(cfg.bgmVolume||.86); }catch(e){}
        state.transitioning=false;
        el.classList.remove('black-transition','major-transition','normal-transition','video-transition');
        state.pageIndex=nextIndex;
        renderPage();
      }, hold);
    }

    function setSequenceInputAvailable(){
      const el=ensureOverlay();
      const status=el.querySelector('[data-seq-status]');
      state.canAdvance=true;
      el.classList.add('input-ready');
      if(status) status.innerHTML='INPUT AVAILABLE <em>화면 선택 시 다음 기록면으로 이동</em>';
    }

    function scheduleNextSequenceLine(delay){
      clearTimeout(state.lineTimer);
      state.lineTimer=setTimeout(()=>{ revealNextSequenceLine(false); }, Number(delay||2500));
    }

    function revealNextSequenceLine(manual){
      if(state.transitioning) return false;
      const el=ensureOverlay();
      if(el.classList.contains('intro-mode') || document.body.classList.contains('pc5152i-sequence-intro-playing')) return false;
      const lines=state.lineEls || [];
      if(!lines.length){
        setSequenceInputAvailable();
        return false;
      }
      if(state.nextLineIndex >= lines.length){
        setSequenceInputAvailable();
        return false;
      }
      const lineEl=lines[state.nextLineIndex];
      if(lineEl){
        lineEl.classList.add('visible');
        if(state.activeRecord===IMMORTALITY_RECORD && lineEl.dataset && lineEl.dataset.dialog==='1'){
          playLocal(state.dialogCue);
        }
      }
      state.nextLineIndex += 1;
      if(state.nextLineIndex >= lines.length){
        clearTimeout(state.lineTimer);
        setSequenceInputAvailable();
      }else{
        const nextDelay=(state.activeRecord===IMMORTALITY_RECORD && lineEl && lineEl.dataset && lineEl.dataset.dialog==='1') ? 3600 : (state.currentLineDelay || 2500);
        scheduleNextSequenceLine(nextDelay);
      }
      return true;
    }

    function renderPage(){
      const el=ensureOverlay();
      const activePages=getActivePages();
      const cfg=getSequenceConfig();
      const page=activePages[state.pageIndex] || activePages[0];
      state.canAdvance=false;
      state.transitioning=false;
      clearSequenceTimers();
      el.classList.remove('input-ready','frame-ready','page-reveal','black-transition','major-transition','normal-transition');
      void el.offsetWidth;
      el.classList.add('page-reveal');
      el.classList.toggle('pc5152u-people-page', page.layout==='peoplePair');
      el.classList.toggle('pc5152v-photo-large-page', page.layout==='photoLarge');
      el.classList.toggle('pc5152v-red-log-page', page.layout==='redLog');
      el.querySelector('[data-seq-code]').textContent=page.code;
      const source=el.querySelector('[data-seq-source]');
      if(source) source.textContent=cfg.sourceLabel||'F.H.C / LOCAL COPY';
      el.querySelector('[data-seq-title]').textContent=page.layout==='redLog' ? '' : page.title;
      const bodyEl=el.querySelector('[data-seq-body]');
      const lines=buildSequenceLines(page);
      if(page.layout==='peoplePair' && Array.isArray(page.people)){
        const people=page.people.map((person,i)=>'<figure class="pc5152u-person-card pc5152k-seq-line" data-line="'+i+'"><img src="'+prefix()+person.image+'" alt="'+escSeq(person.name)+'"/><figcaption class="pc5152w-person-caption"><b class="pc5152v-name-blue">'+escSeq(person.name)+'</b><span>'+escSeq(person.role)+'</span></figcaption></figure>').join('');
        bodyEl.innerHTML='<h3 class="pc5152k-seq-subtitle">'+escSeq(page.subtitle||'')+'</h3><div class="pc5152u-people-pair">'+people+'</div>';
      }else if(page.layout==='photoLarge' && page.image){
        bodyEl.innerHTML=buildPhotoLargeBlock(page,lines);
      }else if(page.layout==='redLog'){
        bodyEl.innerHTML=buildRedLogBlock(page,lines);
      }else{
        bodyEl.innerHTML='<h3 class="pc5152k-seq-subtitle">'+escSeq(page.subtitle||'')+'</h3><div class="pc5152k-seq-lines pc5152v-default-red-lines">'+lines+'</div>';
      }
      el.querySelector('[data-seq-frame]').textContent=page.frame;
      el.querySelector('[data-seq-counter]').textContent=String(state.pageIndex+1).padStart(2,'0')+' / '+String(activePages.length).padStart(2,'0');
      const img=el.querySelector('[data-seq-image]');
      const fig=el.querySelector('[data-seq-figure]');
      if(page.layout==='peoplePair' || page.layout==='photoLarge'){
        img.removeAttribute('src');
        fig.hidden=true;
        state.revealTimers.push(setTimeout(()=>{ 
          el.classList.add('frame-ready'); 
          if(state.activeRecord===IMMORTALITY_RECORD && page.photoSfx) playLocal(state.photoClick);
        }, 650));
      }else if(page.image){
        img.src=prefix()+page.image;
        fig.hidden=false;
        state.revealTimers.push(setTimeout(()=>{ 
          el.classList.add('frame-ready'); 
          if(state.activeRecord===IMMORTALITY_RECORD && page.photoSfx) playLocal(state.photoClick);
        }, 900));
      }else{
        img.removeAttribute('src');
        fig.hidden=true;
      }
      const status=el.querySelector('[data-seq-status]');
      status.textContent='SIGNAL READING...';
      state.lineEls=[...bodyEl.querySelectorAll('.pc5152k-seq-line')];
      state.nextLineIndex=0;
      state.currentLineDelay=Number(page.lineDelay||2500);
      updateImmortalityLatePulse(page);
      if(state.lineEls.length){
        scheduleNextSequenceLine(page.layout==='photoLarge' ? 420 : 650);
      }else{
        state.timer=setTimeout(()=>setSequenceInputAvailable(), 900);
      }
    }

    function startSequence(recordId){
      if(!SEQUENCE_RECORDS.has(recordId)) return false;
      if(state.overlay && state.overlay.classList.contains('show')) return true;
      state.activeRecord=recordId;
      state.pages=(recordId===IMMORTALITY_RECORD)?immortalityPages:pages;
      state.pageIndex=0;
      state.finishing=false;
      state.endingPlayed=false;
      state.endingPlaying=false;
      state.canAdvance=false;
      ensureSpecialAudio();
      const cfg=getSequenceConfig();
      showMountLoader(()=>{
        const el=ensureOverlay();
        const video=el.querySelector('.pc5152h-seq-video');
        const tv=el.querySelector('.pc5152m-transition-video');
        const endingVideo=el.querySelector('.pc5152q-ending-video');
        document.body.classList.remove('pc5152q-immortality-sequence','pc5152h-cult-source-sequence');
        document.body.classList.add('pc5152h-sequence-open','pc5152i-sequence-intro-playing',cfg.bodyClass||'pc5152h-cult-source-sequence');
        el.classList.remove('pc5152q-immortality-mode','pc5152h-cult-mode','ending-mode');
        el.classList.add(cfg.key==='immortality'?'pc5152q-immortality-mode':'pc5152h-cult-mode');
        if(video && video.getAttribute('src')!==prefix()+cfg.introVideo){ video.src=prefix()+cfg.introVideo; }
        if(tv && tv.getAttribute('src')!==prefix()+cfg.transitionVideo){ tv.src=prefix()+cfg.transitionVideo; }
        if(endingVideo && cfg.endingVideo && endingVideo.getAttribute('src')!==prefix()+cfg.endingVideo){ endingVideo.src=prefix()+cfg.endingVideo; }
        if(recordId==='Cults_871104' && cfg.bgm && state.bgm){
          try{
            state.bgm.currentTime=0;
            state.bgm.volume=Number(cfg.bgmVolume||.54);
            state.bgm.play().catch(()=>{});
          }catch(e){}
        }
        el.setAttribute('aria-hidden','false');
        el.classList.add('show','intro-mode');
        el.classList.remove('pages-mode','input-ready','frame-ready','page-reveal');
        el.querySelector('[data-seq-code]').textContent='DAMAGED SIGNAL / PLAYBACK';
        el.querySelector('[data-seq-title]').textContent='';
        el.querySelector('[data-seq-body]').textContent='';
        el.querySelector('[data-seq-frame]').textContent='';
        el.querySelector('[data-seq-counter]').textContent='';
        el.querySelector('[data-seq-status]').textContent='VIDEO SIGNAL PLAYBACK...';
        const fig=el.querySelector('[data-seq-figure]');
        if(fig) fig.hidden=true;

        let moved=false;
        const beginSequencePages=()=>{
          if(moved) return;
          moved=true;
          clearTimeout(state.timer);
          try{ video.pause(); video.currentTime=0; }catch(e){}
        try{ if(tv){ tv.pause(); tv.currentTime=0; } }catch(e){}
        try{ if(endingVideo){ endingVideo.pause(); endingVideo.currentTime=0; } }catch(e){}
          el.classList.remove('intro-mode','input-ready','frame-ready','page-reveal');
          el.classList.add('pages-mode');
          document.body.classList.remove('pc5152i-sequence-intro-playing');
          try{
            if(cfg.bgm && state.bgm){
              if(recordId!=='Cults_871104') state.bgm.currentTime=0;
              state.bgm.volume=Number(cfg.bgmVolume||.78);
              if(state.bgm.paused) state.bgm.play().catch(()=>{});
            }
          }catch(e){}
          renderPage();
        };

        try{
          video.loop=false;
          video.muted=false;
          video.volume=Number(cfg.introVolume||.68);
          video.currentTime=0;
          video.onended=beginSequencePages;
          const playPromise=video.play();
          if(playPromise && playPromise.catch) playPromise.catch(()=>setTimeout(beginSequencePages,900));
        }catch(e){
          setTimeout(beginSequencePages,900);
        }
        // Safety fallback for browsers that do not fire ended.
        state.timer=setTimeout(beginSequencePages,Number(cfg.introFallback||10450));
      });
      return true;
    }

    function openRecordBodyDirect(recordId){
      const archiveViewer=document.getElementById('archiveRecordViewer');
      const archiveListWrap=document.getElementById('archiveListWrap');
      if(!archiveViewer) return;
      const selected=archiveViewer.querySelector('.record-detail[data-record="'+recordId.replace(/"/g,'\\"')+'"]');
      if(!selected){
        if(state.nativeShow) state.nativeShow(recordId);
        return;
      }
      if(archiveListWrap){
        archiveListWrap.classList.add('is-hidden');
        archiveListWrap.querySelectorAll('details').forEach(d=>d.open=true);
      }
      archiveViewer.hidden=false;
      archiveViewer.querySelectorAll('.record-detail').forEach(el=>{el.hidden=true;});
      selected.hidden=false;
      document.body.classList.add('pc5133-case-file-open','pc5152h-sidecontent-rebased');
      const c=document.querySelector('.legacy-content');
      if(c) c.scrollTop=0;
      try{ if(window.ProjectCurseAudio) window.ProjectCurseAudio.playCue('open',200); }catch(e){}
    }

    function finishSequence(skipEnding){
      if(state.finishing) return;
      const cfg=getSequenceConfig();
      const el=state.overlay;
      if(!skipEnding && cfg.endingVideo && !state.endingPlayed && el){
        state.endingPlayed=true;
        state.endingPlaying=true;
        state.canAdvance=false;
        state.transitioning=true;
        clearSequenceTimers();
        stopSequenceAudio();
        const ending=el.querySelector('.pc5152q-ending-video');
        el.classList.remove('input-ready','frame-ready','page-reveal','intro-mode','pages-mode','black-transition','major-transition','normal-transition','video-transition');
        el.classList.add('show','ending-mode');
        el.setAttribute('aria-hidden','false');
        el.querySelector('[data-seq-code]').textContent='F.H.C END MARK / PLAYBACK';
        el.querySelector('[data-seq-title]').textContent='';
        el.querySelector('[data-seq-body]').innerHTML='';
        el.querySelector('[data-seq-frame]').textContent='WAY TO THE ETERNITY';
        el.querySelector('[data-seq-counter]').textContent='';
        const source=el.querySelector('[data-seq-source]');
        if(source) source.textContent=cfg.sourceLabel||'F.H.C / RECOVERED SOURCE';
        const fig=el.querySelector('[data-seq-figure]');
        if(fig) fig.hidden=true;
        el.querySelector('[data-seq-status]').textContent='F.H.C ENDING MARKER';
        let ended=false;
        const complete=()=>{
          if(ended) return;
          ended=true;
          clearTimeout(state.timer);
          state.endingPlaying=false;
          state.transitioning=false;
          try{ ending.pause(); ending.currentTime=0; }catch(e){}
          finishSequence(true);
        };
        try{
          if(ending.getAttribute('src')!==prefix()+cfg.endingVideo) ending.src=prefix()+cfg.endingVideo;
          ending.loop=false;
          ending.muted=false;
          ending.volume=.82;
          ending.currentTime=0;
          ending.onended=complete;
          const playPromise=ending.play();
          if(playPromise && playPromise.catch) playPromise.catch(()=>setTimeout(complete,900));
        }catch(e){
          setTimeout(complete,900);
        }
        state.timer=setTimeout(complete,17000);
        return;
      }
      state.finishing=true;
      clearSequenceTimers();
      stopSequenceAudio();
      if(el){
        const video=el.querySelector('.pc5152h-seq-video');
        const tv=el.querySelector('.pc5152m-transition-video');
        const ending=el.querySelector('.pc5152q-ending-video');
        try{ video.pause(); video.currentTime=0; }catch(e){}
        try{ tv.pause(); tv.currentTime=0; }catch(e){}
        try{ ending.pause(); ending.currentTime=0; }catch(e){}
        try{ if(state.immortalityStep){ state.immortalityStep.pause(); state.immortalityStep.currentTime=0; } }catch(e){}
        el.classList.remove('show','input-ready','frame-ready','page-reveal','intro-mode','pages-mode','ending-mode','pc5152q-immortality-mode','pc5152h-cult-mode','pc5152u-people-page','pc5152v-photo-large-page','pc5152v-red-log-page');
        el.setAttribute('aria-hidden','true');
      }
      document.body.classList.remove('pc5152h-sequence-open','pc5152i-sequence-intro-playing','pc5133-case-file-open','pc5152q-immortality-sequence','pc5152h-cult-source-sequence');
      const archiveViewer=document.getElementById('archiveRecordViewer');
      const archiveListWrap=document.getElementById('archiveListWrap');
      if(archiveViewer){
        archiveViewer.hidden=true;
        archiveViewer.querySelectorAll('.record-detail').forEach(el=>{el.hidden=true;});
      }
      if(archiveListWrap){
        archiveListWrap.classList.remove('is-hidden');
        archiveListWrap.querySelectorAll('details').forEach(d=>d.open=true);
      }
      const c=document.querySelector('.legacy-content');
      if(c) c.scrollTop=0;
      try{ if(window.ProjectCurseAudio) window.ProjectCurseAudio.playCue('menu',180); }catch(e){}
    }

    function advanceSequence(){
      const el=state.overlay;
      if(el && (el.classList.contains('intro-mode') || el.classList.contains('ending-mode') || document.body.classList.contains('pc5152i-sequence-intro-playing'))) return;
      if(state.transitioning) return;
      if(!state.canAdvance){
        revealNextSequenceLine(true);
        return;
      }
      if(state.pageIndex < getActivePages().length-1){
        if(state.activeRecord===IMMORTALITY_RECORD){
          state.canAdvance=false;
          state.pageIndex += 1;
          renderPage();
        }else{
          beginBlackTransition(state.pageIndex + 1);
        }
      }else{
        finishSequence();
      }
    }

    function getRecordIdFromEventTarget(target){
      const btn=target.closest && target.closest('.open-record[data-record]');
      if(btn && btn.closest && btn.closest('#archiveListWrap .doc-card')) return btn.dataset.record;
      return null;
    }

    document.addEventListener('click', function(e){
      if(state.overlay && state.overlay.classList.contains('show') && e.target.closest && e.target.closest('.pc5152x-seq-return')){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        finishSequence(true);
        return;
      }
      if(state.overlay && state.overlay.classList.contains('show')){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        advanceSequence();
        return;
      }
      const id=getRecordIdFromEventTarget(e.target);
      if(SEQUENCE_RECORDS.has(id)){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        startSequence(id);
      }
    }, true);

    
    document.addEventListener('touchend', function(e){
      if(state.overlay && state.overlay.classList.contains('show') && e.target.closest && e.target.closest('.pc5152x-seq-return')){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        finishSequence(true);
        return;
      }
      if(state.overlay && state.overlay.classList.contains('show')){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        advanceSequence();
      }
    }, {capture:true, passive:false});

    document.addEventListener('keydown', function(e){
      if(!(state.overlay && state.overlay.classList.contains('show'))) return;
      if(e.key==='Enter' || e.key===' '){
        e.preventDefault();
        advanceSequence();
      }
    }, true);

    document.addEventListener('click', function(e){
      if(e.target.closest && e.target.closest('.record-back')){
        stopSequenceAudio();
        document.body.classList.remove('pc5152h-sequence-open','pc5152i-sequence-intro-playing');
      }
    }, true);

    if(state.nativeShow){
      window.ProjectCurseShowInternalRecord=function(id){
        if(SEQUENCE_RECORDS.has(id)) return startSequence(id);
        return state.nativeShow(id);
      };
    }

    function markSideContent(){
      document.querySelectorAll('.content-page, .record-detail, .archive-record-viewer').forEach(el=>el.classList.add('pc5152h-terminal-doc'));
      const viewer=document.getElementById('archiveRecordViewer');
      if(viewer) viewer.classList.add('pc5152h-record-viewer');
      const cultCard=[...document.querySelectorAll('.doc-card')].find(card=>{
        const b=card.querySelector('.open-record[data-record="Cults_871104"]');
        return !!b;
      });
      if(cultCard){
        cultCard.classList.add('pc5152h-sequence-card');
        if(!cultCard.querySelector('.pc5152h-seq-chip')){
          const chip=document.createElement('span');
          chip.className='pc5152h-seq-chip';
          chip.textContent='SEQUENCE ATTACHED';
          (cultCard.querySelector('.status-row')||cultCard).appendChild(chip);
        }
      }
    }

    installClearAudioBus();
    markSideContent();
    [160,520,1200,2400].forEach(t=>setTimeout(()=>{
      installClearAudioBus();
      markSideContent();
    },t));

    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152h:'AudioClarity SideContent TerminalNoise RecordSequence',
      audioMode:'clearer terminal contact + special cult sequence bgm only inside sequence',
      recordSequence:'Cults_871104 only; timed input gate; click advances after INPUT AVAILABLE',
      noiseMode:'global terminal noise reduced; VHS/video overlay isolated to sequence'
    });
  });
})();


// MapPatch 5.15.2i — RecordSequence_FullscreenIntro_FlowFix marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152i-fullscreen-intro-flowfix');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152i:'RecordSequence FullscreenIntro FlowFix',
      sequenceIntroFlow:'RECORD MOUNT -> fullscreen damaged video -> record surfaces with BGM',
      pageStepAudio:'disabled by 5.15.2n video insert transitions'
    });
  });
})();


// MapPatch 5.15.2j — RecordSequence_TextImage_ReturnFix marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152j-recordsequence-textimage-returnfix');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152j:'RecordSequence TextImage ReturnFix',
      sequenceText:'restored longer record text and bullets in sequence pages',
      sequenceImages:'uncropped contain-mode image frames',
      sequenceEnd:'returns to archive list instead of opening original body',
      pageAdvanceAudio:'disabled by 5.15.2n; video insert audio only during page advance'
    });
  });
})();


// MapPatch 5.15.2k — RecordSequence_ReadFlow_AudioFullScope marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152k-recordsequence-readflow-audiofullscope');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152k:'RecordSequence ReadFlow AudioFullScope',
      introVideo:'fullscreen damaged video with sound',
      sequenceBgm:'pc5152l_vcr_hiss_sequence_bgm_audible.mp3 lower-volume first MP3',
      groupTransition:'disabled by 5.15.2n video insert transitions',
      lineReveal:'title/subtitle first; explanation lines reveal every 4-5 seconds; input after all lines',
      pagesIncluded:'cult pages, blood cult pages, comparison record, field warning, return page'
    });
  });
})();


// MapPatch 5.15.2l — Sequence_ClickReveal_LineAdvance marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152l-sequence-clickreveal-lineadvance');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152l:'Sequence ClickReveal LineAdvance',
      sequenceBgm:'pc5152l_vcr_hiss_sequence_bgm_audible.mp3 at raised audible volume',
      lineRevealMode:'automatic 2-3s reveal plus click/touch immediate next-line reveal',
      advanceRule:'click reveals hidden line first; page advances only after all lines are visible'
    });
  });
})();


// MapPatch 5.15.2m — MajorTransition_VideoInsert marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152m-majortransition-videoinsert');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152m:'MajorTransition VideoInsert',
      transitionVideo:'pc5152m_vhs_transition_18_21_sound.mp4',
      affectedTransitions:'cult-to-blood and blood-to-compare use video segment with sound instead of glitch effect',
      sourceRange:'18s-21s'
    });
  });
})();


// MapPatch 5.15.2n — TransitionVideo_AllPages_BgmBoost marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152n-transitionvideo-allpages-bgmboost');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152n:'TransitionVideo AllPages BgmBoost',
      transitionVideo:'18-21s VHS insert is used only for major record-face transitions',
      separateTransitionSfx:'removed; internal page advances use quiet 2s VHS black hold',
      sequenceBgm:'first MP3 background raised to .78 runtime volume'
    });
  });
})();


// MapPatch 5.15.2o — MajorTransitionScopeFix_Bgm15 marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152o-majortransition-scopefix-bgm15');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152o:'MajorTransitionScopeFix_Bgm15_ImageBoost',
      transitionVideoScope:'guide-to-cult, cult-to-blood, blood-to-compare, compare-to-warning only',
      internalPageTransitions:'quiet 2s VHS black hold; no inserted video',
      sequenceBgm:'explanation-page BGM raised from .52 to .78 runtime volume',
      transitionDuck:'BGM ducks to .30 during transition video and restores to .78'
    });
  });
})();


// MapPatch 5.15.2p — InternalPage_ProjectorStep marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152p-internalpage-projectorstep');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152p:'InternalPage ProjectorStep',
      internalStepAudio:'pc5152p_internal_projector_vhs_step.wav',
      internalStepScope:'cult and blood internal subpage transitions only',
      majorTransitions:'18-21s VHS video only; no projector step'
    });
  });
})();


// MapPatch 5.15.2q — Immortality_FHC_SourceSequence marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152q-immortality-fhc-source-sequence-ready');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152q:'Immortality FHC Source Sequence',
      immortalityRecord:'Immortality_860201',
      immortalityScope:'F.H.C source playback sequence only for 불멸을 향해',
      cultSequencePreserved:'Cults_871104 existing sequence retained'
    });
  });
})();


// MapPatch 5.15.2r — Immortality_RecordOpenStatic_13_27 marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152r-immortality-recordopen-static-ready');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152r:'Immortality RecordOpen Static 13-27',
      immortalityIntroVideo:'pc5152r_immortality_recordopen_static_13_27.mp4',
      immortalityIntroSourceRange:'VHS static noise 13s-27s',
      scope:'Immortality_860201 record-open intro only'
    });
  });
})();


// MapPatch 5.15.2s — Immortality_BlackNoise_PageStep marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152s-immortality-blacknoise-pagestep-ready');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152s:'Immortality BlackNoise PageStep',
      immortalityPageTransition:'black noisy hold only; no transition video',
      immortalityPageStepAudio:'pc5152s_immortality_page_black_beep_51_55.mp3',
      immortalityPageStepSourceRange:'f-lake.mp4 51s-55s',
      cultSequencePreserved:'Cults_871104 unchanged'
    });
  });
})();


// MapPatch 5.15.2t — Immortality_OriginalText_NoBGM marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152t-immortality-originaltext-nobgm-ready');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152t:'Immortality OriginalText NoBGM',
      immortalityPages:'restored from existing archive record text',
      immortalityBGM:'disabled',
      immortalityPageStepAudio:'kept 51s-55s beep during black page hold',
      cultSequencePreserved:'Cults_871104 unchanged'
    });
  });
})();


// MapPatch 5.15.2u — Immortality_Unit2Split_IntroVolumeDown marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152u-immortality-unit2-split-introvol-ready');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152u:'Immortality Unit2 Split IntroVolumeDown',
      immortalityIntroVolume:'.45',
      immortalityUnit2Page:'people pair layout for Maren Jegert and Jonas Milo',
      immortalityEquipmentPage:'split into next page',
      cultSequencePreserved:'Cults_871104 unchanged'
    });
  });
})();


// MapPatch 5.15.2v — Immortality_LogPhoto_AudioRework marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152v-immortality-logphoto-audio-ready');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152v:'Immortality LogPhoto Audio Rework',
      immortalityIntroVolume:'.09',
      immortalityBGM:'SCP087 theme mixed with VCR hiss',
      immortalityTransitions:'direct page advance, no black transition hold',
      futureRecords:'classified until future release'
    });

    const publicRecords=new Set(['Immortality_860201','Cults_871104']);
    const classifyCard=(card)=>{
      if(!card || card.dataset.pc5152vClassified) return;
      const btn=card.querySelector('.open-record[data-record]');
      if(!btn || publicRecords.has(btn.dataset.record)) return;
      card.dataset.pc5152vClassified='1';
      card.classList.add('pc5152v-classified-card');
      const muted=card.querySelector('.muted');
      if(muted) muted.textContent='기밀 처리됨 — 추후 공개 예정.';
      btn.dataset.pc5152vOriginalRecord=btn.dataset.record||'';
      btn.removeAttribute('data-record');
      btn.classList.remove('open-record');
      btn.textContent='기밀 처리됨';
      btn.classList.add('pc5152v-classified-button');
      btn.setAttribute('aria-label','기밀 처리됨 — 추후 공개 예정');
    };
    document.querySelectorAll('#archiveListWrap .doc-card').forEach(classifyCard);
    document.addEventListener('click',function(e){
      const btn=e.target.closest && e.target.closest('.pc5152v-classified-button');
      if(!btn) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      try{
        if(window.ProjectCurseAudio) window.ProjectCurseAudio.playCue('denied',240);
      }catch(err){}
      const loading=document.getElementById('recordLoading') || document.createElement('div');
      if(!loading.id){
        loading.id='recordLoading';
        loading.className='record-loading';
        document.body.appendChild(loading);
      }
      loading.innerHTML='<div class="box"><div class="title">CLASSIFIED</div><div class="logline">ACCESS STATUS ..... SEALED</div><div class="logline">DISCLOSURE ........ PENDING</div><div class="logline">RELEASE FLAG ...... FUTURE</div><div class="bars"><i></i></div><div class="loader-hint">기밀 처리됨 — 추후 공개 예정</div></div>';
      loading.classList.remove('done');
      loading.classList.add('show');
      setTimeout(()=>{ loading.classList.add('done'); loading.classList.remove('show'); }, 980);
    },true);
  });
})();


// MapPatch 5.15.2w — Immortality_PulseCaptionPacingFix marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152w-immortality-pulse-caption-pacing-ready');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152w:'Immortality Pulse Caption Pacing Fix',
      latePulseSource:'f-lake 3:04-3:06',
      latePulseInterval:'2 seconds',
      personCaptions:'forced visible under Maren/Jonas photos',
      dialoguePacing:'3.6 seconds after each dialogue/comm line',
      immortalityBgmVolume:'.30'
    });
  });
})();


// MapPatch 5.15.2x — Immortality_ReturnButton_EndReturn_SideMapRemove marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152x-immortality-returnbutton-sidemapremove-ready');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152x:'Immortality ReturnButton EndReturn SideMapRemove',
      sideMenuMap:'removed',
      archiveMenu:'moved to 03',
      regionMap:'hidden',
      mainMenuSlowDrift:'disabled outside record viewing',
      latePulseSource:'f-lake 3:15',
      latePulseStop:'18:51',
      latePhotoClick:'disabled after 18:14',
      endingVideo:'disabled; return to archive',
      sequenceReturnButton:'enabled'
    });
  });
})();


// MapPatch 5.15.2y — CultsBGM_ImmortalityNoLatePulse marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152y-cultsbgm-immortality-nolatepulse-ready');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152y:'CultsBGM ImmortalityNoLatePulse',
      cultsBgm:'pc5152y_cults_banalities_radio_static_bgm.mp3',
      cultsBgmStart:'starts with first intro video after record open',
      immortalityLatePulse:'disabled'
    });
  });
})();


// MapPatch 5.15.2aa — ArchiveAccessLock_MapDataPrune.
// Only Cults_871104 and Immortality_860201 are openable in the current archive build.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152aa-archive-lock-map-prune');
    const PUBLIC_RECORDS = new Set(['Cults_871104','Immortality_860201']);
    window.ProjectCursePublicRecords = PUBLIC_RECORDS;

    function denyCue(){
      try{ if(window.ProjectCurseAudio && typeof window.ProjectCurseAudio.playCue==='function') window.ProjectCurseAudio.playCue('denied',260); }catch(e){}
    }

    function lockArchiveCards(){
      document.querySelectorAll('#archiveListWrap .doc-card').forEach(card=>{
        const code = (card.querySelector('.code') && card.querySelector('.code').textContent.trim()) || card.getAttribute('data-sealed-record') || '';
        const btn = card.querySelector('button');
        if(PUBLIC_RECORDS.has(code)){
          card.dataset.access='open';
          card.classList.add('pc5152aa-public-record');
          card.classList.remove('pc5152aa-sealed-record','pc5152v-classified-card');
          if(btn){
            btn.disabled=false;
            btn.removeAttribute('aria-disabled');
            btn.classList.add('btn','open-record','pc5152aa-public-open');
            btn.classList.remove('pc5152aa-locked-record','pc5152v-classified-button');
            btn.setAttribute('data-record', code);
            btn.textContent='기록 열람';
          }
          return;
        }
        card.dataset.access='sealed';
        card.dataset.sealedRecord=code;
        card.classList.add('pc5152aa-sealed-record');
        card.classList.remove('pc5152d-open-card','pc5152h-sequence-card');
        card.removeAttribute('role');
        card.removeAttribute('tabindex');
        card.removeAttribute('aria-label');
        delete card.dataset.pc5152dRecord;
        delete card.dataset.pc5152dOpenBound;
        const muted=card.querySelector('.muted');
        if(muted) muted.textContent='기밀 처리됨 — 열람 권한 없음.';
        if(btn){
          btn.disabled=true;
          btn.removeAttribute('data-record');
          btn.classList.remove('open-record','pc5152aa-public-open');
          btn.classList.add('pc5152aa-locked-record');
          btn.setAttribute('aria-disabled','true');
          btn.textContent='기밀 처리됨';
        }
      });
      const viewer=document.getElementById('archiveRecordViewer');
      if(viewer){
        viewer.querySelectorAll('.record-detail[data-record]').forEach(el=>{
          if(!PUBLIC_RECORDS.has(el.getAttribute('data-record')||'')) el.remove();
        });
      }
    }

    lockArchiveCards();
    [120,420,900,1800,3200].forEach(t=>setTimeout(lockArchiveCards,t));

    const nativeShow = window.ProjectCurseShowInternalRecord;
    window.ProjectCurseShowInternalRecord = function(id){
      if(!PUBLIC_RECORDS.has(String(id||''))){ denyCue(); return false; }
      return nativeShow ? nativeShow(id) : false;
    };

    const nativeActivateOperation = window.ProjectCurseActivateOperation;
    window.ProjectCurseSelectOperation = function(){
      if(typeof window.showPage === 'function') window.showPage('history');
      return false;
    };
    window.ProjectCurseActivateOperation = function(){ return false; };

    document.addEventListener('click', function(e){
      const card = e.target.closest && e.target.closest('#archiveListWrap .doc-card');
      const btn = e.target.closest && e.target.closest('.open-record[data-record], .pc5152aa-locked-record, .pc5152v-classified-button');
      const id = btn && btn.getAttribute ? (btn.getAttribute('data-record') || '') : '';
      if(card && card.dataset.access === 'sealed'){
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); denyCue(); return;
      }
      if(btn && id && !PUBLIC_RECORDS.has(id)){
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); denyCue(); return;
      }
      if(btn && !id && (btn.classList.contains('pc5152aa-locked-record') || btn.classList.contains('pc5152v-classified-button'))){
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); denyCue(); return;
      }
      const zoneLink = e.target.closest && e.target.closest('[data-target="zone-map"], [href="#zone-map"], [data-pc5140-open-op], [data-pc5141-open-op], [data-pc5150-open-op], [data-case-open-op]');
      if(zoneLink){
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        return;
      }
    }, true);

    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152aa:'ArchiveAccessLock MapDataPrune',
      openRecords:'Cults_871104 / Immortality_860201',
      sealedRecords:'non-public archive records are disabled and body data removed',
      mapRuntime:'region/operation map data and assets removed from current build'
    });
  });
})();



// MapPatch 5.15.2ac — EventDedup_ArchiveClickGuard_UIPrune
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152ac-event-dedup-archive-clickguard');
    document.querySelectorAll('.pc5152ab-breadcrumb').forEach(el=>el.remove());
    const rel=document.querySelector('#faction-relation .section-brief'); if(rel) rel.remove();
    const infoP=document.querySelector('#faction-info > p'); if(infoP) infoP.remove();
    document.querySelectorAll('#archiveListWrap .doc-card').forEach(card=>{
      card.removeAttribute('role');
      card.removeAttribute('tabindex');
      card.removeAttribute('aria-label');
      card.querySelectorAll('.pc5152d-open-cue').forEach(el=>el.remove());
    });
    // Capture guard: only the explicit record button can mount public sequence records.
    document.addEventListener('click',function(e){
      const openCard=e.target.closest && e.target.closest('#archiveListWrap .doc-card[data-access="open"]');
      const openBtn=e.target.closest && e.target.closest('#archiveListWrap .doc-card[data-access="open"] .open-record[data-record]');
      if(openCard && !openBtn){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    }, true);
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152ac:'EventDedup ArchiveClickGuard UIPrune',
      factionTileAudio:'single click cue only',
      archiveOpen:'button-only',
      breadcrumbs:'removed from visible UI',
      relationBrief:'removed from visible UI'
    });
  });
})();


// MapPatch 5.15.2ad — PCSidebarRestore_UIDiet_AudioSync_NoVHS
// PC-first cleanup: no mobile drawer, no main-menu VHS/noise, restored drawer toggle, single UI sound gate.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const body=document.body;
    body.classList.remove('scan','pc5152ab-visibility-mobile-audio','pc5152ab-menu-open');
    body.classList.add('pc5152ad-pc-ui','pc584-city-operation-ready');
    document.querySelectorAll('#pc5152abMobileMenu,#pc5152abMobileBackdrop,.pc5152ab-mobile-menu-toggle,.pc5152ab-mobile-backdrop,.pc5152ab-breadcrumb,.side-note').forEach(el=>el.remove());
    document.querySelectorAll('#faction-relation .section-brief,#faction-info > p,#archive-entry > p').forEach(el=>el.remove());
    document.querySelectorAll('.pc5152a-slow-drift,.pc5152-signal-overlay,.pc5152a-tape-meter').forEach(el=>el.remove());

    // Audio gate: one UI cue per user action, with pointerdown/hover noises suppressed.
    const bus=window.ProjectCurseAudio;
    if(bus && typeof bus.playCue==='function' && !bus.pc5152adWrapped){
      const native=bus.playCue.bind(bus);
      let lastAt=0;
      let lastName='';
      bus.playCue=function(name,cooldown){
        const now=performance.now();
        const n=String(name||'menu');
        if(now-lastAt<125) return;
        lastAt=now; lastName=n;
        const normalized=(n==='drawer'||n==='command'||n==='marker')?'menu':n;
        return native(normalized, Math.max(cooldown||0, 135));
      };
      bus.pc5152adWrapped=true;
    }
    document.addEventListener('pointerdown',function(e){
      const t=e.target && e.target.closest ? e.target.closest('.side-menu a,.pc585-menu-heading,.faction-tile,.pc584-relation-node,.pc584-main-drawer-toggle,.open-record,.record-back') : null;
      if(!t) return;
      try{ window.ProjectCurseAudio && window.ProjectCurseAudio.startAmbient && window.ProjectCurseAudio.startAmbient(); }catch(err){}
      e.stopPropagation();
    },true);

    const pages=Array.from(document.querySelectorAll('.content-page,.panel')).filter(p=>p.id);
    const links=Array.from(document.querySelectorAll('.side-menu a[data-target]'));
    function showPage(id){
      if(!pages.some(p=>p.id===id)) id='history';
      if(id==='zone-map') id='history';
      pages.forEach(p=>p.classList.toggle('active',p.id===id));
      links.forEach(a=>a.classList.toggle('active',(a.dataset.target||'')===id));
      const content=document.querySelector('.legacy-content');
      if(content) content.scrollTop=0;
      try{ history.replaceState(null,'','#'+id); }catch(e){}
    }
    window.showPage=showPage;
    const initial=(location.hash||'#history').slice(1)||'history';
    showPage(initial==='zone-map'?'history':initial);

    function syncGroupFor(link){
      document.querySelectorAll('.pc585-menu-group').forEach(group=>{
        const open=!!(link && group.contains(link));
        if(open){
          group.classList.add('open');
          const h=group.querySelector('.pc585-menu-heading');
          if(h){h.setAttribute('aria-expanded','true'); const s=h.querySelector('span'); if(s) s.textContent='▾';}
        }
      });
    }

    // Restore PC drawer toggle. No mobile drawer classes are used.
    document.querySelectorAll('.pc584-main-drawer-toggle,.pc584-drawer-backdrop').forEach(el=>el.remove());
    const toggle=document.createElement('button');
    toggle.type='button';
    toggle.className='pc584-main-drawer-toggle';
    toggle.setAttribute('aria-label','사이드 메뉴 열기/닫기');
    toggle.setAttribute('aria-expanded','false');
    toggle.textContent='☰';
    const backdrop=document.createElement('div');
    backdrop.className='pc584-drawer-backdrop';
    document.body.append(toggle,backdrop);
    function setDrawer(open){
      body.classList.toggle('pc584-main-drawer-open',!!open);
      toggle.textContent=open?'×':'☰';
      toggle.setAttribute('aria-expanded',open?'true':'false');
    }
    setDrawer(false);
    toggle.addEventListener('click',function(e){
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      try{window.ProjectCurseAudio&&window.ProjectCurseAudio.playCue&&window.ProjectCurseAudio.playCue('menu',150)}catch(err){}
      setDrawer(!body.classList.contains('pc584-main-drawer-open'));
    },true);
    backdrop.addEventListener('click',function(e){ e.preventDefault(); setDrawer(false); },true);
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') setDrawer(false); });

    document.addEventListener('click',function(e){
      const heading=e.target.closest && e.target.closest('.pc585-menu-heading');
      if(heading){
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        const group=heading.closest('.pc585-menu-group');
        const open=!(group && group.classList.contains('open'));
        if(group) group.classList.toggle('open',open);
        heading.setAttribute('aria-expanded',open?'true':'false');
        const s=heading.querySelector('span'); if(s) s.textContent=open?'▾':'▸';
        try{window.ProjectCurseAudio&&window.ProjectCurseAudio.playCue&&window.ProjectCurseAudio.playCue('menu',150)}catch(err){}
        return false;
      }
      const link=e.target.closest && e.target.closest('.side-menu a[data-target]');
      if(link){
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        const id=link.dataset.target||'history';
        showPage(id==='zone-map'?'history':id);
        syncGroupFor(link);
        try{window.ProjectCurseAudio&&window.ProjectCurseAudio.playCue&&window.ProjectCurseAudio.playCue('menu',150)}catch(err){}
        setDrawer(false);
        return false;
      }
      const openCard=e.target.closest && e.target.closest('#archiveListWrap .doc-card[data-access="open"]');
      const openBtn=e.target.closest && e.target.closest('#archiveListWrap .doc-card[data-access="open"] .open-record[data-record]');
      if(openCard && !openBtn){
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        return false;
      }
      const sealed=e.target.closest && e.target.closest('#archiveListWrap .doc-card[data-access="sealed"],#archiveListWrap .pc5152aa-locked-record');
      if(sealed){
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        try{window.ProjectCurseAudio&&window.ProjectCurseAudio.playCue&&window.ProjectCurseAudio.playCue('denied',260)}catch(err){}
        return false;
      }
    },true);

    // Re-state public archive locks after older renderers mutate cards.
    const PUBLIC=new Set(['Cults_871104','Immortality_860201']);
    function relockArchive(){
      document.querySelectorAll('#archiveListWrap .doc-card').forEach(card=>{
        const code=(card.querySelector('.code')&&card.querySelector('.code').textContent.trim())||card.dataset.sealedRecord||'';
        const btn=card.querySelector('button');
        const open=PUBLIC.has(code);
        card.dataset.access=open?'open':'sealed';
        card.classList.toggle('pc5152aa-public-record',open);
        card.classList.toggle('pc5152aa-sealed-record',!open);
        card.removeAttribute('role'); card.removeAttribute('tabindex'); card.removeAttribute('aria-label');
        card.querySelectorAll('.pc5152d-open-cue').forEach(el=>el.remove());
        if(btn){
          if(open){
            btn.disabled=false; btn.removeAttribute('aria-disabled'); btn.setAttribute('data-record',code);
            btn.classList.add('open-record','pc5152aa-public-open'); btn.classList.remove('pc5152aa-locked-record','pc5152v-classified-button');
            btn.textContent='기록 열람';
          }else{
            btn.disabled=true; btn.removeAttribute('data-record'); btn.setAttribute('aria-disabled','true');
            btn.classList.remove('open-record','pc5152aa-public-open'); btn.classList.add('pc5152aa-locked-record');
            btn.textContent='기밀 처리됨';
          }
        }
      });
    }
    relockArchive(); [160,600,1400,2800].forEach(t=>setTimeout(relockArchive,t));

    // Simple PC sound controls; no mobile drawer settings.
    const PRESETS={low:{label:'낮음',scale:.55},normal:{label:'보통',scale:.82},high:{label:'높음',scale:1}};
    const order=['low','normal','high'];
    const getPreset=()=>PRESETS[localStorage.getItem('pc5152ad_volume')||'normal']?localStorage.getItem('pc5152ad_volume')||'normal':'normal';
    function ambientOn(){return localStorage.getItem('pc5152ad_ambient')!=='off';}
    function applyVolumes(){
      const scale=PRESETS[getPreset()].scale;
      const b=window.ProjectCurseAudio;
      if(b && b.audio){
        Object.entries(b.audio).forEach(([k,a])=>{
          try{
            const cap=k==='ambient'?.035:(k==='denied'||k==='restricted')?.075:.065;
            a.volume=Math.max(0,Math.min(cap,cap*scale));
            if(k==='ambient' && !ambientOn()) a.pause();
          }catch(e){}
        });
      }
      const vol=document.getElementById('pc5152adVolumeToggle');
      if(vol) vol.textContent='볼륨: '+PRESETS[getPreset()].label;
      const amb=document.getElementById('pc5152adAmbientToggle');
      if(amb) amb.textContent=ambientOn()?'배경음: 켜짐':'배경음: 꺼짐';
    }
    applyVolumes();
    const vol=document.getElementById('pc5152adVolumeToggle');
    if(vol && !vol.dataset.pc5152adBound){
      vol.dataset.pc5152adBound='1';
      vol.addEventListener('click',function(e){
        e.preventDefault(); e.stopPropagation();
        const next=order[(order.indexOf(getPreset())+1)%order.length];
        localStorage.setItem('pc5152ad_volume',next);
        applyVolumes();
        try{window.ProjectCurseAudio&&window.ProjectCurseAudio.playCue&&window.ProjectCurseAudio.playCue('menu',150)}catch(err){}
      },true);
    }
    const amb=document.getElementById('pc5152adAmbientToggle');
    if(amb && !amb.dataset.pc5152adBound){
      amb.dataset.pc5152adBound='1';
      amb.addEventListener('click',function(e){
        e.preventDefault(); e.stopPropagation();
        localStorage.setItem('pc5152ad_ambient',ambientOn()?'off':'on');
        applyVolumes();
        if(ambientOn()) try{window.ProjectCurseAudio&&window.ProjectCurseAudio.startAmbient&&window.ProjectCurseAudio.startAmbient()}catch(err){}
      },true);
    }
    setInterval(applyVolumes,2200);

    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152ad:'PCSidebarRestore UIDiet AudioSync NoVHS',
      mobile:'not included in this build',
      sidebar:'PC drawer restored',
      audio:'single action cue gate + simple volume preset',
      archiveOpen:'button-only public records',
      visualEffects:'main-menu scan/noise/VHS overlays removed'
    });
  });
})();


// MapPatch 5.15.2ae — SourceDiet_LayoutPolish_S24Mobile.
// Final runtime guard: PC layout stays stable; S24 Ultra gets readable one-column/mobile drawer behavior.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const body=document.body;
    body.classList.add('pc5152ae-source-diet','pc5152ae-s24-ready');
    body.classList.remove('scan','pc5152-analog-horror-retrofit','pc5152a-fellon-signal-pass','pc5152b-curse-series-recalibrated','pc5152ab-visibility-mobile-audio');

    function cleanVisualResidue(){
      document.querySelectorAll('.pc5152-signal-overlay,.pc5152-frame-id,.pc5152a-slow-drift,.pc5152a-tape-meter,.pc5152b-tape-sequence-overlay,.pc5152ab-breadcrumb,.pc5152ab-mobile-menu-toggle,.pc5152ab-mobile-backdrop').forEach(el=>el.remove());
      document.querySelectorAll('#archiveListWrap .doc-card img.thumb,.pc5152d-open-cue').forEach(el=>el.remove());
      document.querySelectorAll('#faction-info > p,#faction-relation > .section-brief,#archive-entry > p').forEach(el=>el.remove());
      document.querySelectorAll('#entity-archive,#returned-registry,#equipment-codex,#zone-map').forEach(el=>el.remove());
    }
    cleanVisualResidue();
    [200,650,1500,3000].forEach(t=>setTimeout(cleanVisualResidue,t));

    const PUBLIC=new Set(['Cults_871104','Immortality_860201']);
    function lockArchive(){
      document.querySelectorAll('#archiveListWrap .doc-card').forEach(card=>{
        const code=(card.querySelector('.code')&&card.querySelector('.code').textContent.trim())||card.dataset.sealedRecord||'';
        const open=PUBLIC.has(code);
        card.dataset.access=open?'open':'sealed';
        card.classList.toggle('pc5152aa-public-record',open);
        card.classList.toggle('pc5152aa-sealed-record',!open);
        card.removeAttribute('role'); card.removeAttribute('tabindex'); card.removeAttribute('aria-label');
        let row=card.querySelector('.status-row');
        if(!row){ row=document.createElement('div'); row.className='status-row'; const p=card.querySelector('p'); card.insertBefore(row,p||card.firstChild); }
        row.innerHTML='<span class="chip red'+(open?'':' pc5152aa-sealed-chip')+'">'+(open?'열람 가능':'봉인됨')+'</span>';
        let btn=card.querySelector('button');
        if(btn){
          if(open){
            btn.disabled=false; btn.removeAttribute('aria-disabled'); btn.dataset.record=code;
            btn.className='btn open-record pc5152aa-public-open'; btn.textContent='기록 열람';
          }else{
            btn.disabled=true; btn.removeAttribute('data-record'); btn.setAttribute('aria-disabled','true');
            btn.className='btn pc5152aa-locked-record'; btn.textContent='기밀 처리됨';
          }
        }
      });
    }
    lockArchive();
    [250,700,1800,3200].forEach(t=>setTimeout(lockArchive,t));

    // Strong click guard: only the two public buttons open files; card/title/body clicks never open.
    document.addEventListener('click',function(e){
      const archive=document.getElementById('archiveListWrap');
      if(!archive) return;
      const openBtn=e.target.closest && e.target.closest('#archiveListWrap .open-record[data-record]');
      if(openBtn){
        const id=openBtn.getAttribute('data-record');
        if(!PUBLIC.has(id)){
          e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
          try{window.ProjectCurseAudio&&window.ProjectCurseAudio.playCue&&window.ProjectCurseAudio.playCue('denied',260)}catch(err){}
          return false;
        }
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        try{window.ProjectCurseAudio&&window.ProjectCurseAudio.playCue&&window.ProjectCurseAudio.playCue('open',220)}catch(err){}
        if(typeof window.ProjectCurseShowInternalRecord==='function') window.ProjectCurseShowInternalRecord(id);
        return false;
      }
      const card=e.target.closest && e.target.closest('#archiveListWrap .doc-card');
      if(card){
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        if(card.dataset.access==='sealed'){
          try{window.ProjectCurseAudio&&window.ProjectCurseAudio.playCue&&window.ProjectCurseAudio.playCue('denied',280)}catch(err){}
        }
        return false;
      }
    },true);

    // One cue per interaction. Prevent older stacked menu/faction effects from leaking through.
    const bus=window.ProjectCurseAudio;
    if(bus && typeof bus.playCue==='function' && !bus.pc5152aeWrapped){
      const native=bus.playCue.bind(bus);
      let last=0;
      bus.playCue=function(name,cooldown){
        const now=performance.now();
        if(now-last<190) return;
        last=now;
        const n=String(name||'menu');
        const normalized=(n==='drawer'||n==='command'||n==='marker'||n==='radio')?'menu':n;
        return native(normalized, Math.max(Number(cooldown)||0, 200));
      };
      bus.pc5152aeWrapped=true;
    }

    // Sidebar: desktop keeps restored drawer; mobile/S24 uses same toggle as off-canvas menu.
    function applyViewportMode(){
      const mobile=window.matchMedia('(max-width: 760px)').matches || (window.matchMedia('(pointer: coarse)').matches && window.innerWidth<=940);
      body.classList.toggle('pc5152ae-mobile-viewport', mobile);
    }
    applyViewportMode();
    window.addEventListener('resize',applyViewportMode,{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(applyViewportMode,80),{passive:true});

    // Remove stale zone/map routes if an old link reappears.
    document.addEventListener('click',function(e){
      const zone=e.target.closest && e.target.closest('[data-target="zone-map"],[href="#zone-map"],[data-pc5133-open-op],[data-case-open-op],[data-pc5140-open-op],[data-pc5141-open-op],[data-pc5150-open-op]');
      if(zone){
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        const archiveLink=document.querySelector('.side-menu a[data-target="archive-entry"]');
        if(archiveLink) archiveLink.click();
        return false;
      }
    },true);

    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152ae:'SourceDiet LayoutPolish S24Mobile',
      mobile:'S24 Ultra friendly responsive layout enabled without mobile-only feature creep',
      archive:'thumbnail-free file index; button-only open guard',
      visualEffects:'noise/VHS/scan overlays removed from main runtime and locked stubs',
      maps:'region/operation map runtime remains pruned and routed away'
    });
  });
})();


// MapPatch 5.15.2af — FluidResolution_S24DesktopResponsive
// Adds viewport category classes and desktop default sidebar state for resolution-safe PC/S24 layouts.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const body=document.body;
    body.classList.add('pc5152af-fluid-resolution');
    body.classList.remove('scan','pc5152-analog-horror-retrofit','pc5152a-fellon-signal-pass','pc5152b-curse-series-recalibrated');
    document.querySelectorAll('.pc5152-signal-overlay,.pc5152-frame-id,.pc5152a-slow-drift,.pc5152a-tape-meter,.pc5152b-tape-sequence-overlay,.pc5152ab-breadcrumb,.pc5152ab-mobile-menu-toggle,.pc5152ab-mobile-backdrop').forEach(el=>el.remove());

    const KEY='pc5152af_sidebar_state';
    function viewportClass(){
      const w=window.innerWidth||document.documentElement.clientWidth||0;
      const coarse=window.matchMedia&&window.matchMedia('(pointer: coarse)').matches;
      body.classList.toggle('pc5152af-phone', w<=760 || (coarse && w<=940));
      body.classList.toggle('pc5152af-tablet', w>760 && w<=1024);
      body.classList.toggle('pc5152af-desktop-compact', w>1024 && w<=1366);
      body.classList.toggle('pc5152af-desktop-wide', w>=1800);
      body.style.setProperty('--pc-af-vw', String(w));
      const toggle=document.querySelector('.pc584-main-drawer-toggle');
      if(toggle){
        toggle.setAttribute('aria-label', body.classList.contains('pc584-main-drawer-open')?'사이드 메뉴 접기':'사이드 메뉴 펼치기');
        toggle.setAttribute('aria-expanded', body.classList.contains('pc584-main-drawer-open')?'true':'false');
        toggle.textContent=body.classList.contains('pc584-main-drawer-open')?'×':'☰';
      }
    }

    function defaultSidebar(){
      const w=window.innerWidth||0;
      const saved=localStorage.getItem(KEY);
      const desktop=w>=1025 && !(window.matchMedia&&window.matchMedia('(pointer: coarse)').matches);
      if(saved==='open') body.classList.add('pc584-main-drawer-open');
      else if(saved==='closed') body.classList.remove('pc584-main-drawer-open');
      else body.classList.toggle('pc584-main-drawer-open', desktop);
      viewportClass();
    }
    defaultSidebar();
    window.addEventListener('resize',()=>{viewportClass();}, {passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(viewportClass,80), {passive:true});

    // Persist sidebar state without fighting the existing restored toggle handler.
    let lastOpen=body.classList.contains('pc584-main-drawer-open');
    const obs=new MutationObserver(()=>{
      const open=body.classList.contains('pc584-main-drawer-open');
      if(open!==lastOpen){
        lastOpen=open;
        try{localStorage.setItem(KEY, open?'open':'closed');}catch(e){}
        viewportClass();
      }
    });
    obs.observe(body,{attributes:true,attributeFilter:['class']});

    // Last safety pass: media and long tokens must not escape their containers after record render.
    function clampMedia(){
      document.querySelectorAll('img,video,iframe,canvas,svg').forEach(el=>{
        el.style.maxWidth='100%';
        if(el.tagName==='IMG' || el.tagName==='VIDEO'){
          el.style.height='auto';
          el.style.objectFit='contain';
        }
      });
      document.querySelectorAll('.record-page,.faction-detail,.doc-card,.timeline-list>div').forEach(el=>{
        el.style.overflowWrap='anywhere';
      });
    }
    clampMedia();
    [200,700,1800,3600].forEach(t=>setTimeout(clampMedia,t));

    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152af:'FluidResolution S24DesktopResponsive',
      desktopResolution:'1366/FHD/QHD/4K/ultrawide fluid layout guards',
      mobile:'S24 Ultra readability and media containment retained',
      sidebar:'desktop defaults open; saved collapsed/open state; mobile remains off-canvas',
      overflow:'text/media/table containment guards applied'
    });
  });
})();


// MapPatch 5.15.2ag — ClickGuard_RelationNetwork_DensityResponsive
// Adds final click guard, compact relation-network replacement, and density safeguards for PC/mobile.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  const esc=(v)=>String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mark=(key)=>`assets/faction_marks/${key}.webp`;
  const nodeInfo={
    uac:{name:'U.A.C',status:'CORE-0',trust:'CONTROL',kind:'control',links:['N.H.C','S.I.D','F.H.C','C.P.D','A.R.F']},
    nhc:{name:'N.H.C',status:'FIELD-1',trust:'CONTROLLED',kind:'control',links:['U.A.C','C.P.D','A.R.F','Syndicate']},
    sid:{name:'S.I.D',status:'INTEL-1',trust:'WATCHED',kind:'watch',links:['U.A.C','F.H.C','Haimun','Ushnoda Cult']},
    fhc:{name:'F.H.C',status:'SEAL-1',trust:'RESTRICTED',kind:'seal',links:['U.A.C','S.I.D','Amarion','Ushnoda Cult']},
    cpd:{name:'C.P.D',status:'CIV-1',trust:'CONTROLLED',kind:'control',links:['U.A.C','N.H.C','A.R.F']},
    arf:{name:'A.R.F',status:'REC-1',trust:'CONTROLLED',kind:'control',links:['U.A.C','N.H.C','C.P.D']},
    ushinoda:{name:'Ushnoda Cult',status:'HOSTILE',trust:'BLOCKED',kind:'hostile',links:['S.I.D','F.H.C','Haimun','Syndicate']},
    haimun:{name:'Haimun',status:'WATCH',trust:'UNKNOWN',kind:'watch',links:['S.I.D','Ushnoda Cult','Syndicate']},
    syndicate:{name:'Syndicate',status:'HOSTILE-WATCH',trust:'HOSTILE',kind:'hostile',links:['N.H.C','A.R.F','Ushnoda Cult','Amarion']},
    amarion:{name:'Amarion',status:'RESEARCH-WATCH',trust:'UNSTABLE',kind:'research',links:['F.H.C','U.A.C','Syndicate']},
    ashcrew:{name:'Ash Crew',status:'ASH-1',trust:'CONTROLLED',kind:'control',links:['N.H.C','A.R.F']}
  };
  const nodePos={
    uac:[50,50], nhc:[26,36], sid:[50,23], fhc:[73,36], cpd:[29,66], arf:[70,66],
    ushinoda:[17,82], haimun:[17,18], syndicate:[84,82], amarion:[84,18], ashcrew:[50,82]
  };
  const relations=[
    ['CONTROL','control','U.A.C','N.H.C','현장 투입 승인 / 레드존 봉쇄선 유지','CONTROLLED','uac','nhc'],
    ['INTEL','watch','U.A.C','S.I.D','감청 기록 / 귀환자 진술 검증','WATCHED','uac','sid'],
    ['SEAL','seal','U.A.C','F.H.C','봉인 기록 / 제한 열람 승인','RESTRICTED','uac','fhc'],
    ['CIV','control','U.A.C','C.P.D','대피 회랑 / 귀환자 1차 선별','CONTROLLED','uac','cpd'],
    ['REC','control','U.A.C','A.R.F','회수물 / 기록 매체 복구','CONTROLLED','uac','arf'],
    ['CLEAN','control','N.H.C','Ash Crew','오염 처리 / 소각 후속 절차','CONTROLLED','nhc','ashcrew'],
    ['HOSTILE','hostile','U.A.C','Ushnoda Cult','의식성 오염 / Blood Gate 차단','BLOCKED','uac','ushinoda'],
    ['WATCH','watch','S.I.D','Haimun','도심 침투 흔적 감청','SIGNAL DEGRADED','sid','haimun'],
    ['HOSTILE','hostile','N.H.C','Syndicate','오염 장비 유통 차단','ACTIVE WATCH','nhc','syndicate'],
    ['RESEARCH','research','F.H.C','Amarion','비인가 연구 자료 봉인','CLEARANCE MISMATCH','fhc','amarion'],
    ['TRACE','watch','Ushnoda Cult','Haimun','의식 거점 / 은닉 루트 연결','WATCH','ushinoda','haimun'],
    ['TRADE','hostile','Syndicate','Amarion','회수 자원 / 연구 자료 암거래 의혹','UNSTABLE','syndicate','amarion']
  ];
  function chips(list){return (list||[]).map(x=>`<span>${esc(x)}</span>`).join('');}
  function lineStyle(a,b){
    const [x1,y1]=nodePos[a], [x2,y2]=nodePos[b];
    const dx=x2-x1, dy=y2-y1;
    const len=Math.sqrt(dx*dx+dy*dy);
    const ang=Math.atan2(dy,dx)*180/Math.PI;
    return `left:${x1}%;top:${y1}%;width:${len}%;transform:rotate(${ang}deg);`;
  }
  function renderRelationNetwork(){
    const root=document.getElementById('pc584-relation-root');
    if(!root) return;
    const order=['uac','nhc','sid','fhc','cpd','arf','ashcrew','ushinoda','haimun','syndicate','amarion'];
    root.className='pc5152ag-relation-root';
    root.innerHTML=`
      <div class="pc5152ag-network-shell">
        <aside class="pc5152ag-network-left">
          <div class="pc5134-node-header"><span>NETWORK INDEX</span><b>U.A.C CENTERED</b><small>RELATION NODES</small></div>
          <div class="pc5152ag-node-list">
            ${order.map(key=>{const d=nodeInfo[key]; const imgKey=key==='ushinoda'?'ushinoda':key; return `<button type="button" data-pc5152ag-node="${esc(key)}"><img src="${mark(imgKey)}" alt="${esc(d.name)}"><b>${esc(d.name)}</b><small>${esc(d.status)} / ${esc(d.trust)}</small></button>`;}).join('')}
          </div>
        </aside>
        <section class="pc5152ag-network-center">
          <div class="pc5152ag-legend"><span class="control"><i></i>통제</span><span class="watch"><i></i>감시</span><span class="seal"><i></i>봉인</span><span class="hostile"><i></i>적대</span><span class="research"><i></i>연구</span></div>
          <div class="pc5152ag-focus-line"><b data-pc5152ag-focus>U.A.C</b><span data-pc5152ag-status>CORE-0</span><span data-pc5152ag-links>N.H.C / S.I.D / F.H.C</span></div>
          <div class="pc5152ag-signal-frame">
            ${relations.map(r=>`<i class="pc5152ag-link ${esc(r[1])}" data-link-a="${esc(r[6])}" data-link-b="${esc(r[7])}" style="${lineStyle(r[6],r[7])}"></i>`).join('')}
            ${order.filter(k=>nodePos[k]).map(key=>{const d=nodeInfo[key]; const [x,y]=nodePos[key]; return `<button type="button" class="pc5152ag-map-node ${esc(d.kind)} ${key==='uac'?'core':''}" style="left:${x}%;top:${y}%" data-pc5152ag-node="${esc(key)}">${esc(d.name)}</button>`;}).join('')}
          </div>
          <div class="pc5152ag-relation-log"><b>CONNECTION LOG</b>${relations.map(r=>`<div data-pc5152ag-row="${esc(r[6]+' '+r[7])}"><i>${esc(r[0])}</i><span>${esc(r[2])} ↔ ${esc(r[3])}</span><small>${esc(r[4])} / ${esc(r[5])}</small></div>`).join('')}</div>
        </section>
      </div>`;
    function select(key){
      const d=nodeInfo[key]||nodeInfo.uac;
      root.querySelectorAll('[data-pc5152ag-node]').forEach(el=>el.classList.toggle('active',el.getAttribute('data-pc5152ag-node')===key));
      root.querySelector('[data-pc5152ag-focus]').textContent=d.name;
      root.querySelector('[data-pc5152ag-status]').textContent=d.status+' / '+d.trust;
      root.querySelector('[data-pc5152ag-links]').innerHTML=chips(d.links);
      root.querySelectorAll('[data-pc5152ag-row]').forEach(row=>{
        const tx=(row.getAttribute('data-pc5152ag-row')||'').split(/\s+/);
        row.classList.toggle('active',tx.includes(key));
      });
      root.querySelectorAll('.pc5152ag-link').forEach(line=>{
        const on=line.getAttribute('data-link-a')===key || line.getAttribute('data-link-b')===key || key==='uac';
        line.style.opacity=on?'.78':'.20';
      });
      if(window.ProjectCurseAudio && !root.dataset.pc5152agInit) window.ProjectCurseAudio.playCue('drawer',180);
      root.dataset.pc5152agInit='1';
    }
    root.querySelectorAll('[data-pc5152ag-node]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault(); e.stopPropagation(); select(btn.getAttribute('data-pc5152ag-node')||'uac');}));
    select('uac');
  }
  ready(function(){
    // only public archive buttons can open records; card/title/description clicks are inert.
    const archive=document.getElementById('archive-entry');
    if(archive && archive.dataset.pc5152agClickGuard!=='1'){
      archive.dataset.pc5152agClickGuard='1';
      archive.addEventListener('click',function(e){
        const publicBtn=e.target.closest && e.target.closest('.pc5152aa-public-open,.open-record[data-record]');
        if(publicBtn) return;
        const card=e.target.closest && e.target.closest('.doc-card');
        if(card){ e.preventDefault(); e.stopPropagation(); }
      },true);
    }
    // Re-render relation UI after older relation rebuilds finish.
    setTimeout(renderRelationNetwork,0);
    setTimeout(renderRelationNetwork,350);
  });
})();


// MapPatch 5.15.2ah — ArchiveStackFix_4KOverlaySidebar_BGMBoost
// Fixes archive card stacking/clickability, widens 4K layout, makes the sidebar overlay the content, and boosts Immortality BGM.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const body=document.body;
    body.classList.add('pc5152ah-archive-4k-overlay-bgm');

    function normalizeArchiveCards(){
      const archive=document.getElementById('archive-entry');
      if(!archive) return;
      const openIds=new Set(['Cults_871104','Immortality_860201']);
      archive.querySelectorAll('.doc-card').forEach(card=>{
        card.classList.remove('pc5152v-classified-card','fhc-sealed-card','video-damaged-card','bio-scan-card');
        card.removeAttribute('onclick');
        card.style.position='relative';
        card.style.zIndex=card.getAttribute('data-access')==='open'?'3':'1';
        card.style.overflow='hidden';
        card.querySelectorAll('.thumb,.open-file-cue,.pc5152ac-open-cue,.pc5152ad-card-cue,.doc-status-badge').forEach(el=>el.remove());
        const btn=card.querySelector('button.open-record,[data-record].open-record,.pc5152aa-public-open');
        const code=(card.querySelector('.code')?.textContent||btn?.getAttribute('data-record')||'').trim();
        const isOpen=openIds.has(btn?.getAttribute('data-record')||code);
        card.setAttribute('data-access', isOpen?'open':'sealed');
        card.classList.toggle('pc5152aa-public-record',isOpen);
        card.classList.toggle('pc5152aa-sealed-record',!isOpen);
        if(btn){
          if(isOpen){
            btn.classList.add('btn','open-record','pc5152aa-public-open');
            btn.removeAttribute('disabled');
            btn.removeAttribute('aria-disabled');
            btn.type='button';
            btn.textContent='기록 열람';
            btn.style.pointerEvents='auto';
            btn.style.position='relative';
            btn.style.zIndex='20';
          }else{
            btn.classList.remove('open-record','pc5152aa-public-open');
            btn.classList.add('pc5152aa-locked-record');
            btn.setAttribute('disabled','');
            btn.setAttribute('aria-disabled','true');
            btn.type='button';
            btn.textContent='기밀 처리됨';
            btn.style.pointerEvents='none';
          }
        }
      });
      if(archive.dataset.pc5152ahClickGuard!=='1'){
        archive.dataset.pc5152ahClickGuard='1';
        archive.addEventListener('click',function(e){
          const btn=e.target.closest && e.target.closest('button.open-record.pc5152aa-public-open[data-record]');
          if(btn){ return; }
          const card=e.target.closest && e.target.closest('.doc-card');
          if(card){ e.preventDefault(); e.stopPropagation(); }
        },true);
      }
    }

    function applyAhViewport(){
      const w=window.innerWidth||document.documentElement.clientWidth||0;
      body.classList.toggle('pc5152ah-4k', w>=3000);
      body.classList.toggle('pc5152ah-qhd', w>=2200 && w<3000);
      body.classList.toggle('pc5152ah-fhd', w>=1600 && w<2200);
      body.classList.toggle('pc5152ah-phone', w<=760 || (window.matchMedia && window.matchMedia('(pointer:coarse)').matches && w<=940));
      body.style.setProperty('--pc-ah-vw', String(w));
    }
    applyAhViewport();
    window.addEventListener('resize',applyAhViewport,{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(applyAhViewport,80),{passive:true});

    // Make the restored sidebar an overlay: it does not shrink content width on PC.
    const toggle=document.querySelector('.pc584-main-drawer-toggle');
    if(toggle && toggle.dataset.pc5152ahBound!=='1'){
      toggle.dataset.pc5152ahBound='1';
      toggle.addEventListener('click',()=>setTimeout(applyAhViewport,0),true);
    }

    // Boost Immortality BGM for phones where maximum device volume is still quiet.
    function boostImmortalityBgm(){
      try{
        const active=document.body.classList.contains('pc5152q-immortality-sequence');
        const seqOpen=document.body.classList.contains('pc5152h-sequence-open');
        const audios=[...document.querySelectorAll('audio')];
        audios.forEach(a=>{
          const src=a.currentSrc||a.src||'';
          if(src.includes('pc5152v_immortality_scp087_vcr_ambient_mix')){
            a.volume = Math.max(a.volume||0, body.classList.contains('pc5152ah-phone') ? .92 : .86);
          }
        });
      }catch(e){}
    }
    normalizeArchiveCards();
    [80,300,900,1800,3600].forEach(t=>setTimeout(()=>{normalizeArchiveCards();boostImmortalityBgm();},t));
    document.addEventListener('click',function(e){
      const btn=e.target.closest && e.target.closest('button.open-record.pc5152aa-public-open[data-record="Immortality_860201"]');
      if(btn) setTimeout(boostImmortalityBgm,950);
    },true);

    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152ah:'ArchiveStackFix 4KOverlaySidebar BGMBoost',
      archive:'openable cards are boxed and button-only; no stacked click-blocking layers',
      layout:'4K content width expanded; sidebar overlays content and covers no more than the intended menu width',
      responsive:'PC/FHD/QHD/4K/ultrawide plus common mobile widths retained',
      audio:'Immortality sequence BGM boosted for desktop and mobile playback'
    });
  });
})();


// MapPatch 5.15.2ai — ViewportQA_GlobalResponsive_SilentMenu_BGM
// Same-link PC/mobile QA: fix mobile side-menu touch, shorten menu labels, silence menu clicks, boost main ambient BGM, keep Immortality internal cues intact.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const body=document.body;
    body.classList.add('pc5152ai-global-responsive-silent-menu');

    function renameMenuLabels(){
      document.querySelectorAll('.side-menu a[data-target="faction-info"] b').forEach(el=>{el.textContent='세력';});
      document.querySelectorAll('.side-menu a[data-target="faction-relation"] b').forEach(el=>{el.textContent='관계도';});
      document.querySelectorAll('.side-menu a[data-target="archive-entry"] b').forEach(el=>{el.textContent='기록보관소';});
    }

    function pages(){return Array.from(document.querySelectorAll('.content-page'));}
    function sideLinks(){return Array.from(document.querySelectorAll('.side-menu a[data-target]'));}
    function openPage(id){
      if(!id || !pages().some(p=>p.id===id)) id='history';
      pages().forEach(p=>p.classList.toggle('active', p.id===id));
      sideLinks().forEach(a=>a.classList.toggle('active', a.dataset.target===id));
      const link=document.querySelector(`.side-menu a[data-target="${CSS.escape(id)}"]`);
      if(link){
        document.querySelectorAll('.pc585-menu-group').forEach(group=>{
          if(group.contains(link)){
            group.classList.add('open');
            const head=group.querySelector('.pc585-menu-heading');
            if(head){
              head.setAttribute('aria-expanded','true');
              const icon=head.querySelector('span'); if(icon) icon.textContent='▾';
            }
          }
        });
      }
      const content=document.querySelector('.legacy-content');
      if(content) content.scrollTop=0;
      try{ history.replaceState(null,'','#'+id); }catch(e){}
    }
    function closeDrawerOnMobile(){
      const isMobile=(window.innerWidth||0)<=1024 || (window.matchMedia && window.matchMedia('(pointer:coarse)').matches && (window.innerWidth||0)<=940);
      if(isMobile) body.classList.remove('pc584-main-drawer-open');
      const toggle=document.querySelector('.pc584-main-drawer-toggle');
      if(toggle && isMobile){
        toggle.textContent='☰';
        toggle.setAttribute('aria-expanded','false');
      }
    }

    // Force mobile side-menu links to be selectable even if an older layer/listener is present.
    sideLinks().forEach(link=>{
      if(link.dataset.pc5152aiTouch==='1') return;
      link.dataset.pc5152aiTouch='1';
      link.style.pointerEvents='auto';
      link.addEventListener('pointerup',function(e){
        const isMobile=(window.innerWidth||0)<=1024 || (window.matchMedia && window.matchMedia('(pointer:coarse)').matches && (window.innerWidth||0)<=940);
        if(!isMobile) return;
        e.preventDefault();
        e.stopPropagation();
        openPage(link.dataset.target || 'history');
        closeDrawerOnMobile();
      },true);
      link.addEventListener('click',function(e){
        const isMobile=(window.innerWidth||0)<=1024 || (window.matchMedia && window.matchMedia('(pointer:coarse)').matches && (window.innerWidth||0)<=940);
        if(!isMobile) return;
        e.preventDefault();
        e.stopPropagation();
        openPage(link.dataset.target || 'history');
        closeDrawerOnMobile();
      },true);
    });

    // Menu actions should be silent. Keep boot, record-open, access-denied, main BGM, and Immortality sequence cues.
    function applySilentMenuAndBgm(){
      const bus=window.ProjectCurseAudio;
      if(!bus || !bus.audio) return;
      ['menu','drawer','command','marker'].forEach(k=>{try{ if(bus.audio[k]) bus.audio[k].volume=0; }catch(e){}});
      // Page/tab relays are treated as menu UI in this build, so keep them silent too.
      try{ if(bus.audio.page) bus.audio.page.volume=0; }catch(e){}
      // Main menu/background ambience should be audible on PC and mobile without making UI clicks harsh.
      try{
        if(bus.audio.ambient){
          bus.audio.ambient.volume = body.classList.contains('pc5152ah-phone') || (window.innerWidth||0)<=940 ? .18 : .135;
          bus.audio.ambient.loop = true;
        }
      }catch(e){}
    }

    // Normalize archive cards after older patch code mutates them.
    function fixArchiveCards(){
      const archive=document.getElementById('archive-entry');
      if(!archive) return;
      const openIds=new Set(['Cults_871104','Immortality_860201']);
      archive.querySelectorAll('.doc-card').forEach(card=>{
        const btn=card.querySelector('button[data-record],button.open-record,.pc5152aa-public-open');
        const code=(card.querySelector('.code')?.textContent||btn?.getAttribute('data-record')||card.getAttribute('data-sealed-record')||'').trim();
        const id=btn?.getAttribute('data-record') || code;
        const open=openIds.has(id) || openIds.has(code);
        card.setAttribute('data-access', open?'open':'sealed');
        card.style.pointerEvents='auto';
        card.style.overflow='hidden';
        card.style.position='relative';
        card.style.zIndex=open?'8':'1';
        card.querySelectorAll('.thumb,.open-file-cue,.pc5152ac-open-cue,.pc5152ad-card-cue,.doc-status-badge').forEach(el=>el.remove());
        if(btn){
          btn.type='button';
          if(open){
            btn.classList.add('btn','open-record','pc5152aa-public-open');
            btn.removeAttribute('disabled');
            btn.removeAttribute('aria-disabled');
            btn.textContent='기록 열람';
            btn.style.pointerEvents='auto';
            btn.style.position='relative';
            btn.style.zIndex='60';
          }else{
            btn.classList.remove('open-record','pc5152aa-public-open');
            btn.classList.add('pc5152aa-locked-record');
            btn.setAttribute('disabled','');
            btn.setAttribute('aria-disabled','true');
            btn.textContent='기밀 처리됨';
            btn.style.pointerEvents='none';
          }
        }
      });
    }

    const archive=document.getElementById('archive-entry');
    if(archive && archive.dataset.pc5152aiClickGuard!=='1'){
      archive.dataset.pc5152aiClickGuard='1';
      archive.addEventListener('click',function(e){
        const btn=e.target.closest && e.target.closest('button.open-record.pc5152aa-public-open[data-record]');
        if(btn) return;
        const card=e.target.closest && e.target.closest('.doc-card');
        if(card){ e.preventDefault(); e.stopPropagation(); }
      },true);
    }

    function syncViewportClass(){
      const w=window.innerWidth||document.documentElement.clientWidth||0;
      body.classList.toggle('pc5152ai-phone', w<=760 || (window.matchMedia && window.matchMedia('(pointer:coarse)').matches && w<=940));
      body.classList.toggle('pc5152ai-4k', w>=3000);
      applySilentMenuAndBgm();
    }

    renameMenuLabels();
    fixArchiveCards();
    syncViewportClass();
    [50,250,700,1400,3000].forEach(t=>setTimeout(()=>{renameMenuLabels();fixArchiveCards();syncViewportClass();},t));
    window.addEventListener('resize',syncViewportClass,{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(syncViewportClass,80),{passive:true});
    document.addEventListener('pointerdown',()=>setTimeout(applySilentMenuAndBgm,0),true);
    document.addEventListener('click',()=>setTimeout(()=>{fixArchiveCards();applySilentMenuAndBgm();},0),true);

    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152ai:'ViewportQA GlobalResponsive SilentMenu BGM',
      menu:'mobile side-menu touch fixed; 세력/관계도 short labels; menu click sounds muted',
      audio:'main ambient BGM boosted; record and Immortality internal cues preserved',
      layout:'global PC/mobile responsive containment and archive card stacking guard'
    });
  });
})();


// MapPatch 5.15.2aj — MobileSidebarRouter_WidthHotfix
// Final override for mobile sidebar routing and full-width content. Keeps menu sounds silent and preserves Immortality sequence cues.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const body=document.body;
    body.classList.add('pc5152aj-mobile-sidebar-router-width-hotfix');
    const pageSel='.content-page,.panel';
    const sidebar=document.querySelector('.legacy-sidebar');
    const toggle=document.querySelector('.pc584-main-drawer-toggle');
    function isMobile(){
      const w=window.innerWidth||document.documentElement.clientWidth||0;
      return w<=1024 || ((window.matchMedia&&window.matchMedia('(pointer:coarse)').matches) && w<=1180);
    }
    function allPages(){ return Array.from(document.querySelectorAll(pageSel)).filter(p=>p.id); }
    function allLinks(){ return Array.from(document.querySelectorAll('.side-menu a[data-target]')); }
    function setToggleLabel(){
      const t=document.querySelector('.pc584-main-drawer-toggle');
      if(!t) return;
      const open=body.classList.contains('pc584-main-drawer-open');
      t.textContent=open?'×':'☰';
      t.setAttribute('aria-expanded', open?'true':'false');
      t.setAttribute('aria-label', open?'사이드 메뉴 접기':'사이드 메뉴 펼치기');
    }
    function openDrawer(open){
      body.classList.toggle('pc584-main-drawer-open', !!open);
      try{ localStorage.setItem('pc-main-drawer-open', open?'open':'closed'); }catch(e){}
      setToggleLabel();
    }
    function openPage(id){
      if(!id || !document.getElementById(id)) id='history';
      allPages().forEach(p=>p.classList.toggle('active', p.id===id));
      allLinks().forEach(a=>a.classList.toggle('active', a.dataset.target===id));
      const active=document.querySelector(`.side-menu a[data-target="${CSS.escape(id)}"]`);
      if(active){
        document.querySelectorAll('.pc585-menu-group').forEach(group=>{
          if(group.contains(active)){
            group.classList.add('open');
            const head=group.querySelector('.pc585-menu-heading');
            if(head){ head.setAttribute('aria-expanded','true'); const s=head.querySelector('span'); if(s) s.textContent='▾'; }
          }
        });
      }
      const content=document.querySelector('.legacy-content');
      if(content) content.scrollTop=0;
      try{ history.replaceState(null,'','#'+id); }catch(e){}
      if(isMobile()) openDrawer(false);
    }
    function toggleGroup(btn){
      const group=btn && btn.closest('.pc585-menu-group');
      if(!group) return;
      const open=!group.classList.contains('open');
      group.classList.toggle('open',open);
      btn.setAttribute('aria-expanded',open?'true':'false');
      const icon=btn.querySelector('span'); if(icon) icon.textContent=open?'▾':'▸';
    }
    // Make the old backdrop inert; if it exists above the content it must not capture touches.
    document.querySelectorAll('.pc584-drawer-backdrop,.mobile-backdrop,.drawer-backdrop,.content-dim,.menu-overlay').forEach(el=>{
      el.style.pointerEvents='none'; el.style.display='none'; el.style.visibility='hidden';
    });
    // Rename menu labels again after older scripts mutate DOM.
    function rename(){
      document.querySelectorAll('.side-menu a[data-target="faction-relation"] b').forEach(el=>el.textContent='관계도');
      document.querySelectorAll('.side-menu a[data-target="faction-info"] b').forEach(el=>el.textContent='세력');
      document.querySelectorAll('.side-menu a[data-target="archive-entry"] b').forEach(el=>el.textContent='기록보관소');
    }
    rename();
    // Hard mobile router: handle menu links at document capture before old handlers can swallow the tap.
    let lastRoute=0;
    function routeFromEvent(e){
      const link=e.target && e.target.closest ? e.target.closest('.legacy-sidebar .side-menu a[data-target]') : null;
      const heading=e.target && e.target.closest ? e.target.closest('.legacy-sidebar .pc585-menu-heading') : null;
      if(!link && !heading) return;
      if(!isMobile()) return;
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      if(heading){ toggleGroup(heading); return; }
      const now=Date.now();
      if(now-lastRoute<260) return;
      lastRoute=now;
      openPage(link.dataset.target || 'history');
    }
    ['touchstart','pointerdown','click'].forEach(type=>{
      document.addEventListener(type, routeFromEvent, {capture:true, passive:false});
    });
    // Also delegate inside the sidebar for desktop and non-touch fallback.
    if(sidebar && sidebar.dataset.pc5152ajRouter!=='1'){
      sidebar.dataset.pc5152ajRouter='1';
      sidebar.addEventListener('click',function(e){
        const link=e.target.closest && e.target.closest('.side-menu a[data-target]');
        const heading=e.target.closest && e.target.closest('.pc585-menu-heading');
        if(heading && !link){ e.preventDefault(); toggleGroup(heading); return; }
        if(link){ e.preventDefault(); openPage(link.dataset.target || 'history'); }
      },true);
    }
    if(toggle && toggle.dataset.pc5152ajToggle!=='1'){
      toggle.dataset.pc5152ajToggle='1';
      ['touchstart','pointerdown','click'].forEach(type=>{
        toggle.addEventListener(type,function(e){
          e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation();
          openDrawer(!body.classList.contains('pc584-main-drawer-open'));
        },{capture:true, passive:false});
      });
    }
    function normalizeArchive(){
      const openIds=new Set(['Cults_871104','Immortality_860201']);
      document.querySelectorAll('#archive-entry .doc-card').forEach(card=>{
        const code=(card.querySelector('.code')?.textContent||'').trim();
        const btn=card.querySelector('button[data-record],button.open-record,.pc5152aa-public-open,.pc5152aa-locked-record');
        const id=(btn?.getAttribute('data-record')||code).trim();
        const open=openIds.has(id)||openIds.has(code);
        card.dataset.access=open?'open':'sealed';
        card.style.pointerEvents='auto'; card.style.position='relative'; card.style.overflow='hidden'; card.style.zIndex=open?'20':'1';
        if(btn){
          btn.type='button';
          if(open){
            btn.classList.add('btn','open-record','pc5152aa-public-open');
            btn.classList.remove('pc5152aa-locked-record');
            btn.removeAttribute('disabled'); btn.removeAttribute('aria-disabled'); btn.textContent='기록 열람';
            btn.style.pointerEvents='auto'; btn.style.position='relative'; btn.style.zIndex='50';
          }else{
            btn.classList.remove('open-record','pc5152aa-public-open'); btn.classList.add('pc5152aa-locked-record');
            btn.setAttribute('disabled',''); btn.setAttribute('aria-disabled','true'); btn.textContent='기밀 처리됨';
            btn.style.pointerEvents='none';
          }
        }
      });
    }
    const archive=document.getElementById('archive-entry');
    if(archive && archive.dataset.pc5152ajGuard!=='1'){
      archive.dataset.pc5152ajGuard='1';
      archive.addEventListener('click',function(e){
        const btn=e.target.closest && e.target.closest('button.open-record.pc5152aa-public-open[data-record]');
        if(btn) return;
        const card=e.target.closest && e.target.closest('.doc-card');
        if(card){ e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation(); }
      },true);
    }
    function sync(){
      body.classList.toggle('pc5152aj-phone', isMobile());
      document.querySelectorAll('.pc584-drawer-backdrop,.mobile-backdrop,.drawer-backdrop,.content-dim,.menu-overlay').forEach(el=>{
        el.style.pointerEvents='none'; el.style.display='none'; el.style.visibility='hidden';
      });
      setToggleLabel(); rename(); normalizeArchive();
    }
    sync(); [80,250,650,1400,2800].forEach(t=>setTimeout(sync,t));
    window.addEventListener('resize',sync,{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(sync,120),{passive:true});
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152aj:'MobileSidebarRouter WidthHotfix',
      mobile:'sidebar independent overlay; links routed at capture phase; content no longer reserves sidebar column',
      layout:'mobile pages use full viewport width; PC 4K overlay layout preserved',
      audio:'menu click sounds remain silent; main BGM and record/Immortality cues preserved'
    });
  });
})();

// MapPatch 5.15.2ak — MobileLayoutPass_RelationRecordFix
// Global mobile page density pass, relation graph/log split support, record detail spacing, and section scroll hard reset.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const body=document.body;
    body.classList.add('pc5152ak-mobile-layout-pass');
    const originalTitles = new Map();
    function isMobile(){
      const w=window.innerWidth||document.documentElement.clientWidth||0;
      return w<=820 || ((window.matchMedia&&window.matchMedia('(pointer:coarse)').matches) && w<=1180);
    }
    function q(sel,root=document){return root.querySelector(sel);}
    function qa(sel,root=document){return Array.from(root.querySelectorAll(sel));}
    function setTitle(id,text,full){
      const h=q(`#${id} > h2`);
      if(!h) return;
      if(!originalTitles.has(h)) originalTitles.set(h, full || h.textContent);
      h.textContent=isMobile()?text:originalTitles.get(h);
    }
    function mobileTitlePass(){
      setTitle('faction-info','세력','기관 파일 / 감시 대상 색인');
      setTitle('faction-relation','관계도','기관 관계망 / 감청 분석 노드');
      setTitle('archive-entry','기록보관소','기록보관소 / 기록 파일 색인');
    }
    function resetScroll(){
      const content=q('.legacy-content');
      if(content) content.scrollTop=0;
      try{ document.scrollingElement.scrollTop=0; }catch(e){}
      try{ window.scrollTo(0,0); }catch(e){}
    }
    function activeId(){
      const hash=(location.hash||'').replace('#','');
      return hash || 'history';
    }
    function hardActivate(id){
      if(!id || !q('#'+CSS.escape(id))) id='history';
      qa('.content-page,.panel').forEach(p=>{
        if(!p.id) return;
        const on=p.id===id;
        p.classList.toggle('active',on);
        p.toggleAttribute('inert',!on);
        p.style.pointerEvents=on?'auto':'none';
      });
      qa('.side-menu a[data-target]').forEach(a=>a.classList.toggle('active',a.dataset.target===id));
      resetScroll();
      setTimeout(resetScroll,30);
      setTimeout(resetScroll,160);
    }
    function scrubInactive(){
      qa('.content-page:not(.active),.panel:not(.active)').forEach(p=>{
        p.style.pointerEvents='none';
        p.setAttribute('aria-hidden','true');
        p.setAttribute('inert','');
      });
      qa('.content-page.active,.panel.active').forEach(p=>{
        p.style.pointerEvents='auto';
        p.removeAttribute('aria-hidden');
        p.removeAttribute('inert');
      });
    }
    function relationPass(){
      const root=q('#faction-relation .pc5152ag-relation-root');
      if(!root) return;
      root.dataset.pc5152akMobileLayout=isMobile()?'mobile':'desktop';
      if(isMobile()){
        const center=q('.pc5152ag-network-center',root);
        const signal=q('.pc5152ag-signal-frame',root);
        const log=q('.pc5152ag-relation-log',root);
        const focus=q('.pc5152ag-focus-line',root);
        if(center && signal && log){
          signal.style.order='1';
          if(focus) focus.style.order='2';
          log.style.order='3';
        }
      }
    }
    function archivePass(){
      const openIds=new Set(['Cults_871104','Immortality_860201']);
      qa('#archive-entry .doc-card').forEach(card=>{
        const code=(q('.code',card)?.textContent||'').trim();
        const btn=q('button[data-record],button.open-record,.pc5152aa-public-open,.pc5152aa-locked-record',card);
        const id=(btn?.getAttribute('data-record')||code).trim();
        const open=openIds.has(id)||openIds.has(code);
        card.dataset.access=open?'open':'sealed';
        card.style.display='flex';
        card.style.flexDirection='column';
        card.style.overflow='hidden';
        card.style.isolation='isolate';
        card.style.position='relative';
        if(btn){
          btn.type='button';
          if(open){
            btn.disabled=false;
            btn.removeAttribute('aria-disabled');
            btn.classList.add('open-record','pc5152aa-public-open','btn');
            btn.textContent='기록 열람';
            btn.style.pointerEvents='auto';
            btn.style.position='relative';
            btn.style.zIndex='10';
          }else{
            btn.disabled=true;
            btn.setAttribute('aria-disabled','true');
            btn.classList.remove('open-record','pc5152aa-public-open');
            btn.classList.add('pc5152aa-locked-record');
            btn.textContent='기밀 처리됨';
            btn.style.pointerEvents='none';
          }
        }
      });
    }
    function sideMenuHardRoute(e){
      if(!isMobile()) return;
      const link=e.target && e.target.closest ? e.target.closest('.legacy-sidebar .side-menu a[data-target]') : null;
      const heading=e.target && e.target.closest ? e.target.closest('.legacy-sidebar .pc585-menu-heading') : null;
      if(!link && !heading) return;
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      if(heading){
        const group=heading.closest('.pc585-menu-group');
        if(group){
          const open=!group.classList.contains('open');
          group.classList.toggle('open',open);
          heading.setAttribute('aria-expanded',open?'true':'false');
          const icon=heading.querySelector('span'); if(icon) icon.textContent=open?'▾':'▸';
        }
        return;
      }
      const id=link.dataset.target || 'history';
      hardActivate(id);
      try{ history.replaceState(null,'','#'+id); }catch(err){}
      body.classList.remove('pc584-main-drawer-open');
      const toggle=q('.pc584-main-drawer-toggle');
      if(toggle){toggle.textContent='☰';toggle.setAttribute('aria-expanded','false');}
    }
    ['touchend','pointerup','click'].forEach(type=>document.addEventListener(type,sideMenuHardRoute,{capture:true,passive:false}));
    function apply(){
      mobileTitlePass();
      relationPass();
      archivePass();
      scrubInactive();
      body.classList.toggle('pc5152ak-phone',isMobile());
      if(isMobile()){
        qa('.pc584-drawer-backdrop,.mobile-backdrop,.drawer-backdrop,.content-dim,.menu-overlay,.frame-overlay,.noise-layer,.scan-layer').forEach(el=>{
          el.style.display='none';el.style.visibility='hidden';el.style.pointerEvents='none';el.style.opacity='0';
        });
      }
    }
    apply();
    hardActivate(activeId());
    [80,260,700,1500,3200].forEach(t=>setTimeout(()=>{apply();hardActivate(activeId());},t));
    window.addEventListener('hashchange',()=>{setTimeout(()=>{apply();hardActivate(activeId());},0);},{passive:true});
    window.addEventListener('resize',()=>setTimeout(apply,60),{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(()=>{apply();hardActivate(activeId());},160),{passive:true});
    document.addEventListener('click',()=>setTimeout(()=>{apply();scrubInactive();},30),true);
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152ak:'MobileLayoutPass RelationRecordFix',
      mobile:'relation graph/log split; tighter timeline/faction/record layout; full-width mobile pages',
      router:'mobile section taps routed via capture; section scroll resets to top; inactive panels inert',
      preserved:'Immortality internal sequence cues untouched; PC 4K layout preserved'
    });
  });
})();
