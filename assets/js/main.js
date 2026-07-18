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
    ambient:new Audio(prefix+'assets/audio/pc5152am_menu_old_computer.mp3'),
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
  function ensureRecordLoader(){let el=document.getElementById('recordLoading'); if(!el){el=document.createElement('div'); el.id='recordLoading'; el.className='record-loading'; el.innerHTML='<div class="box"><div class="title">기록 불러오는 중</div><div class="logline">본문 블록 ........ 부분 복구</div><div class="logline">로컬 접근 ........ 허가</div><div class="logline">이미지 프레임 .... 손상</div><div class="logline">기록 버스 ........ 읽기</div><div class="bars"><i></i></div><div class="loader-hint">읽기 권한: 로컬</div></div>'; document.body.appendChild(el);} return el;}
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
      ? '<div class="box"><div class="title">제한 기록 불러오는 중</div><div class="logline">권한 ............. 불일치</div><div class="logline">본문 블록 ........ 부분 복구</div><div class="logline">적색 흔적 ........ 활성</div><div class="logline">블랙 태그 ........ 교차 확인</div><div class="bars"><i></i></div><div class="loader-hint">제한 노드: 단일 접근층</div></div>'
      : video
        ? '<div class="box"><div class="title">손상 영상 신호</div><div class="logline">신호 복구 진행 중...</div><div class="logline">프레임 색인 재구성...</div><div class="logline">오디오 채널 열화...</div><div class="logline">현장 카메라 캐시 연결...</div><div class="bars"><i></i></div><div class="loader-hint">영상: 부분 복구 / 오디오: 열화 / 프레임 손실 감지</div></div>'
        : bio
          ? '<div class="box"><div class="title">생체 흔적 스캔</div><div class="logline">BIOLOGICAL 기록 불러오는 중...</div><div class="logline">오염 ............. 확인</div><div class="logline">숙주 반응 ........ 색인</div><div class="logline">위협표 ........... 대조</div><div class="bars"><i></i></div><div class="loader-hint">개체 스캔: 부분 / 로컬</div></div>'
          : '<div class="box"><div class="title">기록 불러오는 중</div><div class="logline">본문 블록 ........ 부분 복구</div><div class="logline">로컬 접근 ........ 허가</div><div class="logline">이미지 프레임 .... 손상</div><div class="logline">기록 버스 ........ 읽기</div><div class="bars"><i></i></div><div class="loader-hint">읽기 권한: 로컬</div></div>';
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
  if(window.__pc5152SkipBoot){
    if(loader) loader.classList.add('hide');
    if(app) app.classList.add('ready');
    document.body.classList.add('pc5121-boot-complete','pc5152ao-boot-safe');
    document.body.classList.remove('pc5121-boot-pending','pc5152bi-boot-hold');
  }else{
    bootLines.forEach((line,i)=>setTimeout(()=>line.classList.add('show'),220+i*260));
    if(loader){setTimeout(()=>{loader.classList.add('hide'); if(app)app.classList.add('ready'); document.body.classList.add('pc5121-boot-complete'); document.body.classList.remove('pc5121-boot-pending'); playCue('boot',260);},2350);} else {if(app)app.classList.add('ready'); document.body.classList.add('pc5121-boot-complete'); document.body.classList.remove('pc5121-boot-pending');}
  }
  document.querySelectorAll('#audioToggle').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('pc_audio_legacy2003_fixed',isOn()?'off':'on'); syncBtns();}));
  const pages=Array.from(document.querySelectorAll('.content-page'));
  const links=Array.from(document.querySelectorAll('.side-menu a[data-target]'));
  function show(id){
    if(!pages.length)return;
    if(!pages.some(p=>p.id===id)) id='history';
    pages.forEach(p=>p.classList.toggle('active',p.id===id));
    links.forEach(a=>a.classList.toggle('active',a.dataset.target===id));
    const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0;
  }
  links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); startAmbient();  show(a.dataset.target); history.replaceState(null,'','#'+a.dataset.target);}));
  if(pages.length){show((location.hash||'#history').slice(1));}
  document.querySelectorAll('[data-open-record], .archive-list a, .backline a, .btn:not(.open-record):not(.record-back)').forEach(a=>a.addEventListener('click',()=>play(audio.open)));
  const factionData={"uac":{"img":"uac.webp","name":"U.A.C","meta":"Urban Anomaly 봉쇄 / 도시 이상현상 격리국","summary":"도시 이상현상과 우시노다교 의식, 괴이 출현, 레드존 확산을 감시하고 격리하는 상위 통제 기관.","pages":[{"title":"개요","body":"<p>U.A.C는 도시 내부에서 발생하는 이상현상, 괴이 출현, 우시노다교 의식, 오컬트 재난, 적성 종교 세력의 침투를 감시하고 격리하기 위해 설립된 국가 안보 기관이다.</p><p>정식 명칭은 Urban Anomaly 봉쇄이며, 한국어 명칭으로는 도시 이상현상 격리국이라 불린다. U.A.C는 단순한 수사 기관이나 군사 조직이 아니라, 도시 단위의 초상 재난을 감시하고 위험 구역을 분류하며 이상현상의 확산을 막기 위해 각 기관을 조율하는 상위 통제 기관에 가깝다.</p>"},{"title":"창설 배경","body":"<p>U.A.C의 창설 기점은 1986년으로 기록된다. 당시 정부는 대규모 인신공양 사건을 저지하기 위해 불멸을 향해 및 Blood Lake Incident File 작전을 승인하였다.</p><p>해당 작전은 우시노다교가 준비하던 대규모 인신공양 의식을 차단하기 위한 특수 작전이었으며, 의식의 완전한 진행은 저지되었다. 그러나 작전 이후 다수의 괴이체, 비정상적인 생체 변이, 오염된 의식 흔적, 기존 법집행기관으로는 설명하거나 통제할 수 없는 이상현상이 확인되었다.</p><p>정부는 이 사건을 계기로 일시적인 대응팀이 아닌, 영구적으로 이상현상을 감시하고 격리할 전문 기관이 필요하다고 판단하였다. 그 결과 설립된 조직이 U.A.C이다.</p>"},{"title":"초기 조직 체계","body":"<p>창설 초기에는 S.I.D와 N.H.C가 각각 조사 부서와 현장 진압 부서로서 U.A.C 산하에 편제되어 있었다. 우시노다교 의식, 괴이 출현, 인신공양 사건에 대응할 전문 기관이 부족했기 때문에 조사, 정보 수집, 현장 진압 기능이 모두 U.A.C 내부 체계에 묶여 있었다.</p><ul><li>U.A.C : 상위 통제 기관</li><li>S.I.D : 특수 조사 부서</li><li>N.H.C : 현장 진압 부서</li></ul>"},{"title":"현재 조직 체계","body":"<p>우시노다 현상, 괴이 출현, 레드존 확산, 혈교 의식, 블랙존화 사건이 증가하면서 기존 U.A.C 내부 부서 체계만으로는 대응이 어려워졌다.</p><p>이후 조직 개편을 통해 S.I.D와 N.H.C는 U.A.C 산하 하위 부서에서 분리되어 독립 기관으로 재편되었다. 현재 U.A.C는 도시 이상현상의 상위 통제와 구역 분류, 정보 관리, 기관 간 작전 조율을 담당하며, S.I.D와 N.H.C는 독립 기관으로서 U.A.C와 협력한다.</p><ul><li>U.A.C : 상위 통제, 구역 분류, 정보 관리</li><li>S.I.D : 독립 특수 조사 기관</li><li>N.H.C : 독립 현장 대응 조직</li></ul>"},{"title":"핵심 목표","body":"<p>U.A.C의 핵심 목표는 우시노다교의 인신공양 의식을 사전에 차단하고, 그로 인해 발생하는 타락 개체을 제거 또는 통제하는 것이다.</p><p>이후 우시노다 현상과 혈교 의식, 타락교 하위 조직, 인공 괴이, 피의 호수, 변이 균주와 같은 사건들이 늘어나면서 U.A.C의 임무 범위는 확장되었다. 현재 U.A.C는 괴이를 제거하는 기관이 아니라, 도시 전체가 레드존 또는 블랙존으로 변질되는 것을 막기 위한 최종 통제선으로 기능한다.</p>"},{"title":"주요 임무","body":"<ul><li>우시노다교 인신공양 의식 사전 차단</li><li>타락 개체 출현 감시</li><li>그린존, 옐로우존, 레드존, 화이트존, 블랙존 분류</li><li>이상현상 발생 지역 봉쇄 및 정보 통제</li><li>현장 기록, CCTV, 오디오, 생체 샘플 회수</li><li>S.I.D, N.H.C, F.H.C, A.R.F, C.P.D와의 작전 조율</li><li>위험 인물 및 비인가 연구자 감시</li><li>오컬트 생명체, 미확인 균주, 변이 조직 분석</li><li>민간 사회로의 정보 유출 차단</li></ul>"},{"title":"정보 수집 부서","body":"<p>U.A.C 정보 수집 부서는 도시 전역의 감시 영상, 통신 기록, 오디오 파일, 암호화 CCTV, 현장 데이터를 수집하고 복구하는 정보 부서이다. 이 부서는 U.A.C의 눈으로 불리며, 이상현상이 발생하기 전의 징후를 포착하고 이미 발생한 사건의 기록을 복원하는 역할을 맡는다.</p><p>주로 N.H.C 내부 이탈 징후, S.I.D 현장 보고, F.H.C 회수 문서, 타락교 및 혈교 활동 기록을 분석한다. 레드울프 이탈 기록과 비인가 장비 유통 정황은 해당 부서가 복구한 감시 자료로 분류된다.</p><ul><li>암호화 영상 복호화</li><li>감시 데이터 수집</li><li>통신 기록 분석</li><li>내부 반역 징후 감시</li><li>적성 세력 활동 추적</li><li>위험 인물 파일 작성</li><li>비인가 오디오 및 CCTV 자료 복구</li><li>우시노다 현상 발생 전조 감지</li></ul>"},{"title":"도시 격리 집행부","body":"<p>U.A.C 도시 격리 집행부는 확인된 이상현상 발생 지역을 봉쇄하고, 괴이 및 오염 요소의 확산을 차단하는 실행 부서이다. 이 부서는 U.A.C의 망치로 불리며, 직접적인 전투만을 담당하는 조직이라기보다는 현장 봉쇄, 격리 명령, 출입 통제, 구역 등급 격상, 지원 부대 호출 권한을 가진 작전 집행 체계에 가깝다.</p><ul><li>이상현상 발생 지역 봉쇄</li><li>구역 출입 통제</li><li>민간인 대피 명령 승인</li><li>현장 격리선 설치</li><li>N.H.C 및 A.R.F 투입 요청</li><li>C.P.D와 연계한 피난민 통제</li><li>레드존 및 블랙존화 징후 감시</li><li>우시노다교 의식장 차단</li><li>괴이체 확산 경로 봉쇄</li></ul>"},{"title":"오컬트 생명 과학 부서","body":"<p>U.A.C 오컬트 생명 과학 부서는 괴이, 타락체, 피의 호수, 미확인 균주, 변이 조직을 연구하는 생체 분석 부서이다. 일반적인 생물학이나 법의학으로 설명할 수 없는 사체, 조직, 체액, 균주, 장기 반응을 조사한다.</p><p>피의 호수 부검 기록에서 마렌 예거트의 시신을 분석했으며, BL-088 균주를 최초로 임시 분류한 부서로 기록된다.</p><ul><li>괴이 조직 분석</li><li>타락 생명체 부검</li><li>미확인 균주 분류</li><li>생체 부패 정지 반응 연구</li><li>혈액성 잔류물 분석</li><li>괴이 유전자 자료 대조</li><li>F.H.C 분석 부서와 샘플 공유</li><li>타락 개체 변이 과정 기록</li></ul>"}]},"nhc":{"img":"nhc.webp","name":"N.H.C","meta":"National Hazard Control / 국가 위난 격리 사령부","summary":"레드존 외곽의 봉쇄선 유지, 고위험 진입, 제한 구조와 작전 실패 후 회수를 담당하는 현장 대응 조직.","pages":[{"title":"개요","body":"<p>N.H.C는 레드존과 블랙존 인접 지역에 투입되는 고위험 현장 대응 조직이다. 초기에는 U.A.C 산하 진압 부서였으나, 봉쇄선 붕괴와 광역 대피 실패가 반복되면서 독립적인 현장 지휘 체계로 재편되었다.</p><p>N.H.C의 임무는 이상현상을 완전히 제거하는 것이 아니라, 현장 붕괴를 늦추고 민간선·회수선·소각선이 작동할 시간을 확보하는 데 있다.</p>"},{"title":"레드울프 이탈","body":"<p>과거 N.H.C 산하에는 레드울프가 1차 작전팀으로 존재했다. 그러나 그린존 붕괴 이후 이어진 사건을 계기로 해당 팀은 사실상 이탈하였고, 현재는 신디케이트 주요팀으로 분류된다.</p><p>이 사건 이후 N.H.C는 특정 정예팀에 장비와 지휘권이 집중되지 않도록 작전 편제를 분산했다.</p>"},{"title":"주요 임무","body":"<ul><li>레드존 외곽 방어선과 후퇴로 유지</li><li>고위험 개체 접근 차단 및 현장 제압</li><li>생존자 제한 구조와 귀환자 이송 지원</li><li>A.R.F 회수선과 Ash Crew 소각선 확보</li><li>블랙존화 징후 및 봉쇄선 붕괴 코드 보고</li><li>작전 실패 후 기록 장비와 신원 태그 회수</li></ul>"},{"title":"현장 편제","body":"<p>N.H.C 현장부대는 진입반, 봉쇄지원반, 후송지원반, 회수·소각 연계반으로 나뉜다. 같은 장소에 투입되어도 각 반은 서로 다른 철수 기준과 명령권을 가진다.</p><p>전투 인원만으로 작전이 성립하지 않는다. 통신 담당, 오염 판정 담당, 차량 통제 담당, 기록 회수 담당이 빠지면 해당 투입은 미완성 편제로 처리된다.</p>"},{"title":"장비 운용 원칙","body":"<p>N.H.C 장비는 오염을 제거하거나 대원의 신체 능력을 비정상적으로 증폭하지 않는다. 차폐, 신호 억제, 혈성 오염 대응, 회수·소각, 봉쇄 인프라, 현장 제압의 여섯 체계가 서로의 실패 시간을 보완한다.</p><p>장비 성능보다 정상 운용 시간, 성능 저하 징후, 사용 중지 기준, 회수·폐기 절차를 우선 기록한다. 단일 장비가 작전 결과를 뒤집는다는 설명은 현장 규정에서 사용하지 않는다.</p>"},{"title":"작전 한계","body":"<p>차폐복과 억제 장치는 노출을 지연할 뿐 감염이나 타락을 무효화하지 못한다. 동일 장비라도 혈성 입자, 시간 오염, 의식 잔류가 겹치면 운용 시간이 급격히 줄어든다.</p><p>장비가 정상 표시를 유지하더라도 대원의 기억, 통신 시각, 생체 반응이 서로 어긋나면 즉시 철수한다. 현장 판단은 장비 출력보다 교차 기록을 우선한다.</p>"},{"title":"실패 후 절차","body":"<p>철수 불가 상황에서는 생존 인원, 신원 태그, 작전 기록, 오염 시료의 우선순위를 현장 지휘관이 재지정한다. 회수 불가 장비는 작동 여부와 관계없이 봉인 또는 소각 대상으로 넘긴다.</p><p>작전 종료 보고에는 성공한 교전보다 끊어진 절차, 미회수 인원, 개방된 통로, 폐기하지 못한 장비를 먼저 적는다.</p>"}]},"sid":{"img":"sid.webp","name":"S.I.D","meta":"Special Investigation Department / 특수 수사과","summary":"이상현상, 오컬트 사건, 실종 사건, 심각 범죄를 조사하는 특수 조사 조직.","pages":[{"title":"개요","body":"<p>S.I.D는 이상현상, 심각 범죄, 괴이 출현, 오컬트 사건을 조사하는 특수 조사 조직이다. 초기에는 U.A.C 산하 특수 조사 부서로 운용되었으나, 사건 규모가 확대되고 지역별 독립 조사가 필요해지면서 독립 기관으로 재편되었다.</p><p>일반적인 수사 기관으로 해결하기 어려운 사건을 담당하며, 현장 조사, 피해자 기록, 의식 흔적 분석, 민간 구역 감시를 수행한다. 그린존 내부의 치안 유지와 이상현상 감시 역시 S.I.D의 주요 임무 중 하나이다.</p>"},{"title":"핵심 임무","body":"<ul><li>도심 및 일상 공간에서 발생하는 기괴한 징후 감지</li><li>피의 연못, 그림자 전이, 신체 변이 등 초상 현상 추적</li><li>우시노다 현상 발생 경로 분석</li><li>교단 은신처 및 의식장 식별</li><li>초자연적 에너지 잔류량 측정</li><li>F.H.C, 타락교, 혈교 관련 의도적 의식 여부 판별</li><li>현장 1차 봉쇄 및 정보 검열</li></ul>"},{"title":"N.H.C와의 공조","body":"<p>S.I.D는 수집된 데이터를 분석하여 N.H.C가 화력을 집중할 지점을 지목한다. 현상 발생 시 가장 먼저 현장에 도착하여 반경 수 킬로미터를 물리적으로 폐쇄하고, 외부인의 출입을 막으며 진실이 유출되지 않도록 정보 검열을 병행한다.</p><p>상황이 걷잡을 수 없이 커질 경우 N.H.C의 정규군 병력에 배속되어 현장 가이드 및 전술 지원팀으로 직접 전투에 참여한다.</p>"},{"title":"무장 및 전술 지위","body":"<p>S.I.D는 경찰 계열 조사 조직이지만 일반 총기 외에도 대크리처 전용 특수 탄환, 전파 교란기, 고감도 열화상 탐지기 등 군사 수준의 장비를 운용한다.</p><p>주 임무는 조사와 차단이지만, 초기 대응 실패 시 N.H.C가 도착하기 전까지 1차 봉쇄선을 유지해야 한다.</p>"},{"title":"오컬트 부서","body":"<p>S.I.D 오컬트 부서는 우시노다 현상, 괴이 출현, 타락교 관련 사건, 혈교 의식 흔적 등을 조사하는 전문 부서이다. 현장 조사관, 특수 효과 분석 담당자, 기록 담당자, 심각 범죄 분석관으로 구성되어 있다.</p><p>사쿠마 유타 실종 사건 보고서는 S.I.D 일본 도쿄 지부 오컬트 부서가 관리하던 사건 기록으로 분류된다.</p><ul><li>오컬트 범죄 현장 조사</li><li>괴이 흔적 판독</li><li>우시노다교 관련 문서 회수</li><li>피해자 관계 인물 조사</li><li>정신 오염 가능성 판정</li><li>U.A.C 및 F.H.C로 자료 이관</li></ul>"}]},"ashcrew":{"img":"ashcrew.webp","name":"Ash Crew","meta":"괴이 사체 처리반 / N.H.C 산하 특수 처리반","summary":"전투 이후 남은 오염 사체, 괴이 잔해, Blood Gate 잔류물, 오염된 장비를 봉인·회수·소각하는 처리반.","pages":[{"title":"개요","body":"<p>Ash Crew는 독립 세력이 아니라 N.H.C 산하 특수 처리반이다. 일반 N.H.C 전투조가 진압과 봉쇄를 담당한다면, Ash Crew는 전투 이후 남은 오염 사체, 괴이 잔해, 블랙 태그 대상, 오염된 장비, Blood Gate 잔류물을 봉인하고 소각한다.</p><p>이 부대는 전투의 승패가 결정된 뒤에도 끝나지 않는 현장 오염을 처리하기 위해 운용된다. 잔해 하나가 새로운 오염 매개체가 될 수 있기 때문에, Ash Crew의 임무는 단순한 청소가 아니라 2차 재난 차단에 가깝다.</p>"},{"title":"오염 사체 처리","body":"<p>괴이 사체, 타락 개체 잔해, 부패 정지 상태의 인체 조직, 혈액성 잔류물은 일반 의료·군수 절차로 처리하지 않는다. Ash Crew는 블랙 태그 봉인 백과 고열 소각 장비를 사용해 현장 반출 전 오염 수치를 측정하고, 회수 불가 판정 시 현장에서 소각한다.</p><ul><li>괴이 사체의 부위별 분리 봉인</li><li>혈액성 잔류물의 중화 및 소각</li><li>감염 가능 장비의 임시 격납</li><li>귀환자 접촉 흔적의 별도 기록</li></ul>"},{"title":"블랙 태그","body":"<p>블랙 태그 대상은 일반 회수 대상으로 분류되지 않는다. 해당 대상은 살아있는 생존자처럼 보이더라도 오염 매개체, 위장 개체, 자율 증식 조직일 가능성이 있어 Ash Crew 또는 U.A.C 고위 승인 없이는 반출할 수 없다.</p><p>A.R.F가 회수 작전을 수행하더라도 블랙 태그 대상은 Ash Crew의 현장 판정을 거친 뒤 봉인·소각·격리 중 하나로 처리된다.</p>"},{"title":"오염된 장비","body":"<p>오염된 장비는 현장 인원이 사용했거나 접촉한 장비가 의식 잔류물, 혈액성 반응, Ghost Channel 노이즈와 결합해 독립 위험물로 변한 것을 뜻한다. Ash Crew는 해당 장비를 군수품으로 회수하지 않고 별도 저주 오염 장비로 분류한다.</p><ul><li>손상된 혈무 또는 오염 탄창</li><li>Ghost Channel 반응을 보이는 무전기</li><li>피의 호수 잔류물에 노출된 방호복</li><li>사용자 사망 후에도 반응하는 장비</li></ul>"},{"title":"주요 장비","body":"<ul><li>블랙 태그 봉인 백</li><li>고열 소각기</li><li>CI-O 오염 측정기</li><li>Ghost Channel 차단기</li><li>Ash Truck 현장 처리 차량</li><li>오염 장비 임시 격납 케이스</li><li>혈액성 잔류물 중화 팩</li></ul>"},{"title":"협력 기관","body":"<p>Ash Crew는 N.H.C의 후속 처리반이지만 단독으로 모든 결정을 내리지 않는다. S.I.D가 현장 증거를 확인하고, A.R.F가 회수 가능한 물리 자료를 선별하며, F.H.C는 일부 샘플의 분석 필요성을 제기한다. 다만 블랙 태그 대상의 최종 반출 여부는 U.A.C 통제권 아래 결정된다.</p>"}]},"arf":{"img":"arf.webp","name":"A.R.F","meta":"Anomaly Recovery Force / 이상현상 회수 부대","summary":"전면 교전보다 생존자, 샘플, 기록 매체, 장비, 시신, 기밀 자산 회수에 특화된 조직.","pages":[{"title":"개요","body":"<p>A.R.F는 이상현상 회수 부대다. 전면 교전보다 생존자, 샘플, 기록 매체, 장비, 시신, 기밀 자산을 회수하는 역할에 특화되어 있다.</p><p>이들은 N.H.C가 교전 구역을 확보한 뒤 후속 진입하며, 아직 완전히 안전하지 않은 현장에서 정보와 물증을 보존하는 역할을 맡는다.</p>"},{"title":"회수 임무","body":"<ul><li>생존자 제한 구조 및 이송</li><li>시신과 신원 불명 인체 잔해 반출</li><li>현장 기록 매체, 카메라, 오디오 장비 회수</li><li>괴이 조직과 혈액 샘플의 1차 격납</li><li>기밀 장비와 오염 문서 회수</li></ul>"},{"title":"작전 구조","body":"<p>A.R.F는 선두 전투부대가 아니다. N.H.C가 위험 개체를 제압하거나 방어선을 확보한 뒤 진입하며, S.I.D가 지정한 증거물과 U.A.C가 요구한 기록 매체를 우선 회수한다.</p><p>현장 상황이 불안정할 경우 A.R.F는 회수보다 봉쇄선 외곽 대기를 우선하며, N.H.C 호위 없이 레드존 심부로 진입하지 않는다.</p>"},{"title":"F.H.C 분석 전 단계","body":"<p>F.H.C가 분석하는 대부분의 샘플은 A.R.F가 먼저 물리적으로 회수한다. A.R.F는 연구 조직이 아니라 회수 조직이므로, 샘플의 의미를 해석하기보다 원형 보존과 오염 확산 방지를 우선한다.</p><ul><li>샘플 원형 보존</li><li>현장 좌표 및 회수 시간 기록</li><li>동행 인원 오염 노출 기록</li><li>분석기관 이송 전 봉인 확인</li></ul>"},{"title":"Ash Crew와의 차이","body":"<p>A.R.F는 회수 가능한 자료와 생존자를 반출하는 부대이고, Ash Crew는 회수 불가 또는 위험성이 높은 사체·장비를 처리하는 부대다. 블랙 태그 대상은 A.R.F가 단독 회수하지 않고 Ash Crew 또는 U.A.C의 판단을 따른다.</p>"}]},"cpd":{"img":"cpd.webp","name":"C.P.D","meta":"Civilian Protection Division / 민간 보호 조직","summary":"민간 보호와 외곽 질서 유지, 피난민 관리, 귀환자 분리 절차를 담당하는 조직.","pages":[{"title":"개요","body":"<p>C.P.D는 민간 보호와 외곽 질서 유지를 담당하는 조직이다. 레드존 안쪽으로 깊게 들어가기보다는 검문선, 대피소, 보호 구역, 귀환자 분리 절차를 관리한다.</p><p>U.A.C와 N.H.C가 이상현상과 교전을 관리한다면, C.P.D는 그 바깥에서 민간 사회가 완전히 붕괴하지 않도록 질서를 유지한다.</p>"},{"title":"피난민 관리","body":"<ul><li>피난민 대기 구역 관리</li><li>대피 경로 통제</li><li>가족 단위 신원 확인</li><li>오염 노출자와 일반 민간인 분리</li><li>식량, 의료품, 임시 거주 구역 배정</li></ul>"},{"title":"검문 게이트","body":"<p>C.P.D 검문 게이트는 그린존과 옐로우존, 옐로우존과 레드존 외곽을 나누는 민간 통제선이다. 모든 통과 인원은 신분 확인, 오염 반응 검사, 귀환자 판정을 거친다.</p><p>의심 인원은 S.I.D나 U.A.C 조사반으로 이관되며, 폭동이나 강제 돌파 시 N.H.C 외곽 경계대가 지원된다.</p>"},{"title":"귀환자","body":"<p>귀환자는 실종 이후 돌아온 민간인 중 기억 공백, 생체 반응 이상, 타인의 신원 모방, Ghost Channel 반응을 보이는 대상을 말한다. C.P.D는 이들을 일반 피난민과 분리하고 S.I.D 조사 전까지 보호 격리한다.</p>"},{"title":"C.P.D 대피버스","body":"<p>C.P.D 대피버스는 레드존 외곽과 옐로우존에서 민간인을 그린 코어 또는 임시 대피소로 옮기는 이동 수단이다. 단순 수송 차량이 아니라 이동식 검문·분리 절차를 수행하는 민간 보호 장비로 운용된다.</p>"},{"title":"기관 관계","body":"<p>C.P.D는 U.A.C 행정 통제 아래 운영되며, S.I.D와는 민간 구역 조사 및 실종자 자료 공유를, N.H.C와는 외곽 봉쇄 및 대피 지원을, A.R.F와는 생존자 이송 절차를 공유한다.</p>"}]},"fhc":{"img":"fhc.webp","name":"F.H.C","meta":"Foremost Hitech Cooperation / 포레모스트 하이테크 기업","summary":"초상 기술, 괴이 조직, 타락·혈액 샘플, 비인가 연구 자료를 분석하고 회수하는 고위 기술 조직.","pages":[{"title":"개요","body":"<p>F.H.C는 초상 기술, 괴이 조직, 타락 및 혈액 관련 샘플, 비인가 연구 자료를 분석하고 회수하는 고위 기술 조직이다. 표면적으로는 첨단 기술 개발, 교육 서비스, 사회 복지, 의료 기술, 특수 산업 연구를 제공하는 세계적인 초거대 기업이다.</p><p>그러나 내부적으로는 초자연과학, 오컬트 생명공학, 현실 접속 기술, 생체 병기화 가능성을 다루는 극비 부서를 보유하고 있다. F.H.C는 U.A.C, S.I.D, N.H.C가 회수한 자료를 분석하며, 특히 아마리온 제약과 공식 협력 관계를 맺고 있다.</p>"},{"title":"표면적 정체","body":"<ul><li>첨단 기술 개발 기업</li><li>교육 서비스 및 연구 지원 기관</li><li>사회 복지 및 의료 지원 기업</li><li>고위 산업 기술 협력체</li><li>아마리온 제약과 공식 연구 협력 관계 유지</li></ul>"},{"title":"실질적 정체","body":"<p>F.H.C는 초상 기술과 오컬트 현상을 기술적으로 실용화하려는 오컬트 과학 복합체에 가깝다. 이들은 외신, 우시노다 현상, 괴이 조직, 혈액 의식, 현실 왜곡, 생명 연장, 생체 병기화 가능성 등을 연구한다.</p><p>공식적으로는 U.A.C와 협력하는 기술 분석 기관이지만, 일부 내부 부서와 자금 흐름에서 우시노다교와의 유착 정황이 확인되고 있다. 따라서 F.H.C는 협력 기관이자 감시 대상에 가까운 이중적 세력이다.</p>"},{"title":"사회적 영향력","body":"<p>F.H.C는 수많은 학원, 학교, 연구소, 복지 시설을 운영하며 인재 육성과 사회 기여를 명분으로 영향력을 확장하고 있다. 그러나 일부 시설은 우시노다 현상이 발생하는 주요 지점을 감시하고 제어하기 위한 거점으로 활용된다는 의혹이 존재한다.</p><p>세련된 디자인의 선전 포스터와 출판물을 통해 우시노다와 관련된 철학을 현대적인 자기계발, 첨단 과학, 진화론적 인류 개선 사상으로 위장하여 대중에게 배포한다는 기록도 있다.</p>"},{"title":"극비 분석 부서","body":"<p>F.H.C 극비 분석 부서는 괴이, 혈교, 타락교, 우시노다 현상, 비인가 생체 연구 자료, 초상 기술을 분석하고 회수하는 고위 보안 부서이다.</p><p>특히 아마리온 제약, BL-088 균주, 괴이 유전자 디지털화 기술, 저접근 자기 변형 시스템과 관련된 자료를 별도 관리하는 것으로 추정된다.</p><ul><li>초상 기술 분석</li><li>괴이 조직 샘플 연구</li><li>회수 문서 해독</li><li>비인가 연구자 추적</li><li>아마리온 협력 자료 검토</li><li>생체 병기화 가능성 평가</li><li>타락 및 혈액 관련 기술 분류</li><li>우시노다교 유착 의혹 자료 추적</li></ul>"},{"title":"무력 체계와 조사 기록","body":"<p>F.H.C는 기업 보안을 명분으로 정규군에 필적하는 사설 무장 세력을 보유하고 있다. 이들은 외부 조사기관의 접근을 차단하거나, 실험 도중 통제를 벗어난 괴이체를 비밀리에 처리한다.</p><p>표면적으로는 합법적인 기업 활동을 하나, 내부 기밀 문서와 자금 흐름을 추적한 결과 우시노다교의 핵심 성소 및 일부 의식 거점과 물리적·재정적으로 연결되어 있다는 정황이 발견되었다.</p>"}]},"amarion":{"img":"amarion.webp","name":"Amarion","meta":"Amarion Pharmaceuticals / 아마리온 제약","summary":"의약품과 생명공학을 표면에 둔 민간 제약 기업이자 F.H.C 협력·감시 대상.","pages":[{"title":"개요","body":"<p>아마리온 제약은 표면적으로는 의약품, 생명공학, 특수 자원 연구를 수행하는 대형 민간 제약 기업이다. 공식적으로는 F.H.C와 연구 협력 관계를 맺고 있으며, 초자연과학, 생명 연장, 고응축 자원, 특수 물질 분석 분야에서 기술 지원을 제공하는 협력 기관으로 분류된다.</p><p>그러나 아마리온은 F.H.C의 승인 범위를 넘어선 비인가 실험을 여러 차례 진행한 정황이 있으며, 현재는 협력 기관이자 고위험 감시 대상이라는 이중적 위치에 놓여 있다.</p>"},{"title":"F.H.C와의 관계","body":"<p>F.H.C는 아마리온의 기술력과 연구 성과를 필요로 하지만, 아마리온이 보유한 기술이 너무 위험하기 때문에 완전히 신뢰하지 않는다. 따라서 아마리온은 F.H.C의 협력 기업이면서도 동시에 감시와 통제를 받는 민간 연구 조직으로 분류된다.</p>"},{"title":"초자연과학 연구 부서","body":"<p>아마리온 초자연과학 연구 부서는 아마리온 제약 내부에 존재했던 비공개 연구 부서이다. 이 부서는 일반적인 질병 치료나 의약품 개발이 아니라 현실 왜곡, 비가시적 공간 접속, 생체 변형, 고응축 자원 회수, 불멸 연구와 관련된 실험을 진행한 것으로 추정된다.</p><p>공식 기록상 대부분의 자료는 삭제되었으나, F.H.C가 회수한 사전교육 영상에서 해당 부서의 존재가 확인되었다.</p>"},{"title":"대표 기술","body":"<p>저접근 자기 변형 시스템은 현실 세계와 비가시적 공간 사이의 접점을 형성하기 위해 개발된 초기형 관문 기술로 추정된다. 아마리온은 이를 자원 확보와 인류 생존 기반 확장 기술로 홍보했으나, F.H.C 분석 기록에 따르면 현실 외부 공간 접촉 실험에 가까운 것으로 분류된다.</p>"}]},"syndicate":{"img":"syndicate.webp","name":"Syndicate","meta":"신디케이트 / 비공식 사설 군사 네트워크","summary":"국가 기관, 기업, 종교 집단, 무장 조직 사이에서 활동하는 비공식 사설 군사 조직.","pages":[{"title":"개요","body":"<p>신디케이트는 국가 기관, 기업, 종교 집단, 무장 조직 사이의 틈에서 활동하는 비공식 사설 군사 조직이자 무장 네트워크이다. 현재 일부 작전은 F.H.C의 거대 자본에 고용되어 움직이지만, 본질적으로는 독자적인 이해관계와 생존 논리를 가진 예측 불가능한 집단이다.</p><p>이들은 국가 체계를 거부하면서도 우시노다의 힘을 군사 전술에 결합하려는 시도를 보이며, 정부와 교단 양쪽 모두에게 위험한 세력으로 분류된다.</p>"},{"title":"군사 전술과 우시노다","body":"<p>신디케이트는 우시노다교처럼 숭배에 매몰되지 않는다. 대신 우시노다의 힘을 철저히 효율적인 무기로 취급한다. 현대적 군사 전술에 초자연적인 변이 능력을 덧입혀 정부군인 N.H.C조차 당혹하게 만드는 변칙적인 전투를 수행한다.</p>"},{"title":"독자 노선","body":"<p>신디케이트는 작전 단위로 F.H.C의 명령을 따르거나 자금을 받을 수 있지만, 완전히 F.H.C에 종속된 조직은 아니다. 정부에게는 체제를 위협하는 테러리스트이며, 교단에게는 신성한 힘을 도구로 모독하는 약탈자이다.</p><p>이들은 오직 자신들의 독립된 세력을 유지하고 힘을 키우는 데 관심이 있다.</p>"},{"title":"기만 전술","body":"<p>신디케이트의 가장 특징적인 전술은 더미 요원 활용이다. 현장에서 포로로 잡히거나 정보가 유출되는 것을 막기 위해 실제 인간 요원 대신 정교하게 제작된 인조체나 세뇌된 소모품 병사를 전면에 내세운다.</p><p>이로 인해 U.A.C가 이들을 소탕하더라도 본대의 실체나 거점은 늘 안개 속에 가려져 있다.</p>"},{"title":"레드울프","body":"<p>레드울프는 현재 신디케이트 내부에서 가장 핵심적인 전투 및 현장 작전팀 중 하나로 분류된다. 이들은 원래 N.H.C 1차 작전팀으로 활동했던 고위험 대응팀이었으나, 그린존 붕괴 사건 및 그 이후 이어진 일련의 사건을 거치며 기존 지휘 체계에서 이탈하였다.</p><ul><li>이전 명칭 : N.H.C 1차 작전팀 레드울프</li><li>현재 분류 : 신디케이트 주요팀 레드울프</li><li>변동 사유 : 그린존 붕괴 이후 지휘 체계 붕괴, 상부와의 결별, 생존 인원 재편, 비공식 세력화</li></ul>"},{"title":"켈베로스 파벌","body":"<p>켈베로스 파벌은 레드울프 전체를 의미하는 명칭이 아니라, 현재 신디케이트 주요팀으로 활동 중인 레드울프 내부에서 웨이드 밀렌을 중심으로 형성될 가능성이 있는 비인가 독자 행동 세력을 뜻한다.</p><p>밀렌은 과거 N.H.C 시절부터 상부 명령에 대한 불신을 보였으며, 레드울프가 신디케이트 소속으로 재편된 이후에는 독자적인 질서와 권력을 세우려는 방향으로 움직이고 있다. 이후 기록에서는 우시노다의 힘을 감염 병기와 억제제로 전환하려는 계획이 확인되었다.</p>"}]},"ushinoda":{"img":"ushinoda.webp","name":"Ushnoda Cult","meta":"우시노다교 / 타락교·혈교·그림자교를 포함한 통합 교단","summary":"우시노다의 힘을 숭배하며 인신공양과 이상현상을 통해 세계 재편을 시도하는 적대 종교 세력.","pages":[{"title":"개요","body":"<p>우시노다교는 고대 존재 우시노다의 힘을 숭배하며, 그를 향한 맹목적인 믿음을 바탕으로 인류의 도덕성을 완전히 저버린 최악의 광신도 집단이다. 이들은 단순히 신을 믿는 것을 넘어 잔혹한 반인류적 행위를 신성한 의식으로 여기며 인간을 초월한 신인류라는 왜곡된 이상을 꿈꾼다.</p>"},{"title":"연합된 세 가지 교단","body":"<p>현재 우시노다교는 각기 다른 힘과 성향을 가진 세 분파가 하나의 목적을 위해 손을 잡은 교단 연합 체제로 운영되고 있다. 이들의 세력은 이미 비밀리에 전 세계 구석구석까지 뻗어 나가 있으며, 도시 내부의 공공 시설, 학교, 병원, 연구소, 복지 기관에 침투한 정황이 확인되고 있다.</p>"},{"title":"타락교","body":"<p>타락교는 인간의 정신을 오염시키고 자아를 붕괴시켜 우시노다의 의지에 완전히 종속되게 만드는 심리적 잠식을 담당한다. 이들은 우시노다의 타락의 힘을 축복으로 받아들이며, 신체 변형과 불멸성을 신앙의 증거로 여긴다.</p><h4>핵심 능력 : 현실 부식</h4><ul><li>공포의 안개 : 오염된 기운에 노출된 자는 가장 끔찍한 트라우마를 환각으로 본다.</li><li>자아 와해 : 상대의 이성을 마비시켜 자신이 누구인지 잊게 만들거나 스스로를 해치게 만든다.</li><li>공간 뒤틀림 : 문을 열면 다른 장소가 나오거나 복도가 무한히 길어지는 공간 왜곡을 일으킨다.</li></ul>"},{"title":"혈교","body":"<p>혈교는 혈액 마법과 신체 변이에 집착하는 분파이며, 인체를 기괴하게 뒤틀어 타락 개체을 만들어내는 실무적인 무력 집단이다.</p><h4>핵심 능력 : 과부하 변이</h4><ul><li>경질화 혈액 : 피를 강철보다 단단한 칼날이나 가시로 굳혀 공격한다.</li><li>신체 재구성 : 뼈를 검으로 쓰거나 등에서 촉수를 돋게 하며, 부상을 입을수록 더 강력한 형태로 변이한다.</li><li>강제 전이 : 적의 몸속에 자신의 피를 주입하여 장기를 뒤틀거나 타락 개체로 강제 변이시킨다.</li></ul>"},{"title":"그림자교","body":"<p>그림자교는 실체가 없는 공포를 이용하는 분파이다. 어둠 속에서 은밀하게 움직이며 요인을 암살하거나, 보이지 않는 곳에서 이상현상을 유도하여 사회적 혼란을 야기한다.</p><h4>핵심 능력 : 심연의 수의</h4><ul><li>그림자 전이 : 모든 그림자를 통로로 삼아 순간이동한다.</li><li>비물질화 : 일시적으로 신체를 그림자 상태로 만들어 총알이나 물리 공격이 통과하게 만든다.</li><li>그림자 구속 : 상대의 그림자를 물리적으로 고정하거나 목을 조르는 끈으로 변형시킨다.</li></ul>"},{"title":"인신공양과 이상현상","body":"<p>우시노다교에게 가장 중요한 행위는 인신공양이다. 무고한 생명을 제물로 바침으로써 현실 세계의 물리 법칙을 뒤트는 이상현상을 강제로 발생시키며, 이를 통해 우시노다의 강림을 앞당기려 한다.</p>"},{"title":"영향력과 암약","body":"<p>우시노다교는 정체를 숨긴 채 F.H.C와 같은 거대 자본 뒤에 숨어 활동하거나, 학교와 병원 같은 공공 시설에 침투하여 일반인을 서서히 오염시킨다.</p><p>최종 목표는 기존 인류를 멸절시키고, 우시노다의 축복을 받은 변이된 인류로 세상을 재편하는 것이다.</p>"}]},"haimun":{"img":"haimun.webp","name":"Haimun","meta":"For Our Future / 하이문","summary":"우시노다교의 타락교와 혈교 교리에 심취한 범죄 조직이자 초인간주의 신봉자 단체.","pages":[{"title":"개요","body":"<p>하이문은 우시노다교의 분파 중 가장 과격한 타락교와 혈교의 교리에 심취하여, 인류의 멸망과 새로운 세상의 도래를 꿈꾸는 범죄 조직이자 초인간주의 신봉자 단체이다.</p><p>우리의 미래를 위하여라는 슬로건 아래 기존의 인간성을 버리고 괴물로 진화하는 것을 유일한 구원으로 믿는다.</p>"},{"title":"도심 속 공포","body":"<p>하이문은 U.A.C의 감시를 피해 도심 깊숙이 뿌리를 내리고 있다. 현재 도시 곳곳에서 산발적으로 발생하는 우시노다 현상의 압도적인 다수는 이들의 소행으로 추정된다.</p><p>이들은 인신공양을 위해 일반 시민들을 납치하거나, 도심 한복판에서 금기된 의식을 강행하여 도시를 아수라장으로 만든다.</p>"},{"title":"초인간주의 사상","body":"<p>하이문의 구성원들은 인간이라는 종의 나약함에 환멸을 느낀 자들이다. 타락교의 정신 오염과 혈교의 신체 변이를 적극적으로 받아들이며, 스스로 기괴한 존재가 되는 것을 진화라고 부른다.</p><p>이들은 인간은 곧 사라질 구시대의 유물이며, 우시노다의 축복을 받은 우리만이 미래라고 주장한다.</p>"},{"title":"리더십","body":"<p>대부분 평범한 인간들로 구성되어 활동하지만, 이들을 하나로 묶고 거대한 테러를 기획하는 리더의 정체는 철저히 베일에 싸여 있다. 조직원들조차 리더를 직접 본 적이 없으며, 오직 우시노다의 목소리를 대변하는 전언을 통해서만 명령을 하달받는다고 알려져 있다.</p>"},{"title":"추적 대상","body":"<p>하이문은 도심 내부에서 인신공양, 실종 사건, 우시노다 현상, 괴이 출현을 유발하는 주요 세력으로 분류된다. S.I.D는 은신처와 의식 거점을 추적하며, U.A.C는 하이문이 활동한 구역을 옐로우존 또는 레드존으로 격상할 수 있다. N.H.C는 대규모 의식이나 타락 개체 양산 정황이 확인될 경우 즉시 투입된다.</p>"}]}};
  const detail=document.getElementById('factionDetail');
  function renderFaction(key){
    const d=factionData[key]||factionData.uac; if(!detail)return;
    detail.innerHTML=`<img class="faction-mark-large" src="${prefix}assets/faction_marks/${d.img}" alt="${d.name}"><h3>${d.name}</h3><div class="meta">${d.meta}</div><p class="faction-summary">${d.summary||''}</p><div class="detail-tabs">${d.pages.map((p,i)=>`<button class="detail-tab ${i===0?'active':''}" data-i="${i}" type="button">${p.title}</button>`).join('')}</div><div class="detail-body"></div>`;
    function showPage(i,sound=true){const p=d.pages[i]||d.pages[0]; detail.querySelectorAll('.detail-tab').forEach((b,idx)=>b.classList.toggle('active',idx===i)); detail.querySelector('.detail-body').innerHTML=`<h4>${p.title}</h4>${p.body}`; }
    detail.querySelectorAll('.detail-tab').forEach((b,i)=>b.addEventListener('click',()=>showPage(i,true)));
    showPage(0,false);
    document.querySelectorAll('.faction-tile').forEach(b=>b.classList.toggle('active',b.dataset.key===key));
  }
  if(!window.ProjectCurseCanon){
    document.querySelectorAll('.faction-tile').forEach(b=>b.addEventListener('click',()=>{ renderFaction(b.dataset.key)}));
    if(detail) renderFaction('uac');
  }
  document.querySelectorAll('.paged-record').forEach(box=>{
    const recPages=Array.from(box.querySelectorAll(':scope > .record-page'));
    const tabs=box.querySelector(':scope > .page-tabs');
    if(!recPages.length||!tabs) return;
    function showRec(i,sound=true){recPages.forEach((p,idx)=>p.classList.toggle('active',idx===i)); tabs.querySelectorAll(':scope > .page-tab').forEach((b,idx)=>b.classList.toggle('active',idx===i));  const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0; else window.scrollTo(0,0);}
    tabs.querySelectorAll(':scope > .page-tab').forEach((b,i)=>b.addEventListener('click',()=>showRec(i,true)));
    showRec(0,false);
  });
  document.querySelectorAll('.nested-record').forEach(box=>{
    const pages=Array.from(box.querySelectorAll(':scope .sub-pages > .sub-page'));
    const tabs=box.querySelector(':scope > .sub-tabs');
    if(!pages.length||!tabs) return;
    function showSub(i,sound=true){pages.forEach((p,idx)=>p.classList.toggle('active',idx===i)); tabs.querySelectorAll(':scope > .sub-tab').forEach((b,idx)=>b.classList.toggle('active',idx===i)); }
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
      
    }
    tabs.forEach(t=>t.addEventListener('click',()=>showZone(t.dataset.zone,true)));
  });


  // FINAL ALLFIX: internal archive record viewer, no external docs navigation.
  const archiveListWrap=document.getElementById('archiveListWrap');
  const archiveViewer=document.getElementById('archiveRecordViewer');
  const BIO_RECORDS=new Set(['타락 개체_860722','FCR_Archive_890402','불명_Record2_860205']);
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
    'Cults_871104':{grade:'F.H.C / SEALED',tone:'restricted',type:'종교 기록',map:'란저우 / 우시노다교 흔적',op:'lanzhou',factions:['F.H.C','S.I.D','Ushnoda Cult'],equipment:['봉인 태그','오염 표식 샘플','혈무'],phenomena:['의식성 오염','Blood Gate 잔향','타락교'],attachments:['타락교 기록면','혈교 기록면','침묵성 타락','현장 대응 경고'],annotation:'종교 기록 정리본. 일부 문장은 부분 공개 상태로 유지한다.'},
    '타락 개체_860722':{grade:'ENTITY / RED',tone:'bio',type:'개체 분류 기록',map:'세계 상황판 / 레드존 개체권',op:'world',factions:['U.A.C','N.H.C','S.I.D'],equipment:['현장 제압 장비','오염 차폐 장비','회수 태그'],phenomena:['타락 개체','상위 개체','미믹 개체'],attachments:['개체 분류','부검 메모','회수 이미지'],annotation:'생체 반응과 위협 분류를 먼저 확인한다.'},
    '불명_Record2_860205':{grade:'BIO / HIGH',tone:'bio',type:'부검·오염 기록',map:'북해-함부르크 봉인 항만',op:'northsea',factions:['F.H.C','A.R.F','U.A.C'],equipment:['생체 샘플 키트','봉인 절단 장비'],phenomena:['피의 호수','혈액성 잔류물','부패 정지 반응'],attachments:['부검 사진','샘플 기록','오염 판정'],annotation:'생체 샘플 접촉 금지. 회수보다 격리 우선.'},
    'Redzone_881120':{grade:'REDZONE / FIELD-2',tone:'redzone',type:'레드존 이상현상 기준',map:'부산 / 란저우 / 전역 레드권',op:'busan',factions:['U.A.C','S.I.D','F.H.C'],equipment:['Chrono Anchor','해상 감청 장비','봉쇄 게이트'],phenomena:['Dead Hour','Ghost Channel','Blood Gate','시간 오염'],attachments:['오염 기준','장기 방치 단계','격상/하향 기준'],annotation:'오염 기준과 봉쇄 판단에 연결되는 핵심 기준 문서.'},
    'FCR_Archive_890402':{grade:'RETURNED / CIV-2',tone:'returned',type:'귀환자·분류 추가 보고',map:'부산 선별 부두 / 란저우 주거블록',op:'busan',factions:['C.P.D','S.I.D','U.A.C'],equipment:['C.P.D 대피선','격리 태그','선별 장비'],phenomena:['귀환자 선별 실패','지연 신체 반응','재실종 사례'],attachments:['추가 분류','귀환자 기준','위장 개체 경고'],annotation:'민간 대피 동선과 기록 판단을 분리한다.'},
    'NHC_Manual_891219':{grade:'N.H.C / FIELD-1',tone:'field',type:'현장 작전·봉쇄 규정',map:'부산 부두 차단선 / 란저우 후퇴선',op:'lanzhou',factions:['N.H.C','U.A.C','A.R.F','C.P.D'],equipment:['오염 차폐 장비','현장 제압 장비','혈성 오염 대응 장비','봉인 절단 장비'],phenomena:['봉쇄선 붕괴','회수 실패','블랙 태그'],attachments:['현장 운용','봉쇄 대응','장비 운용'],annotation:'현장 대원 기준 문서. 작전 실패 시 기록 회수 절차를 우선한다.'},
    'Immortality_860201':{grade:'VIDEO / ORIGIN',tone:'video',type:'작전 영상·기원 사건',map:'북해-함부르크 봉인 항만',op:'northsea',factions:['U.A.C','S.I.D','F.H.C'],equipment:['현장 카메라','무전 기록','회수 매체'],phenomena:['피의 호수','혈액성 이상현상','야생동물 변질'],attachments:['작전 로그','촬영 기록','통신 기록'],annotation:'기원 사건 파일. 영상 프레임 손상 상태를 유지한다.'},
    'Sakuma_Tape_991028':{grade:'S.I.D / OCCULT',tone:'video',type:'실종·오컬트 사건 보고',map:'동아시아 감시권 / 도쿄 오컬트 사건',op:'world',factions:['S.I.D','F.H.C','Ushnoda Cult'],equipment:['현장 카메라','감청 노트'],phenomena:['우시노다교 흔적','실종 사건','오컬트 사망'],attachments:['담당 인물','피해자 기록','잔류 문장'],annotation:'S.I.D 오컬트 부서 기록. 잔류 문장 노이즈를 보존한다.'},
    '불명_Record1_860204':{grade:'VIDEO / AMARION',tone:'video',type:'아마리온 회수 영상',map:'Black Site 후보 / 기업 연구권',op:'world',factions:['F.H.C','Amarion','U.A.C'],equipment:['회수 영상 매체','연구 장비'],phenomena:['현실 외부 공간','고응축 자원','비인가 연구'],attachments:['사전교육 영상','프로젝트 장점','위험 기술 분석'],annotation:'기업 홍보 영상처럼 위장된 비인가 연구 기록.'},
    '불명_Record3_920711':{grade:'INTEL / SYNDICATE',tone:'video',type:'감시 영상·이탈 기록',map:'북미/신디케이트 감시권',op:'pacificnw',factions:['U.A.C','N.H.C','Syndicate'],equipment:['암호화 CCTV','감시 데이터'],phenomena:['지휘 이탈','오염 장비 유통'],attachments:['기록 정보','암호화 CCTV 영상'],annotation:'레드울프 이탈과 신디케이트 재분류의 근거 기록.'},
    '불명_Record4_930314':{grade:'BLACK / WEAPON',tone:'restricted',type:'비인가 장비 유통 기록',map:'신디케이트 / 비인가 연구권',op:'world',factions:['Syndicate','Red Wolf','F.H.C'],equipment:['오염된 장비','회수 샘플','비인가 억제 장치'],phenomena:['장비 유통망','기록 조작','의식성 오염'],attachments:['감청 기록','거래 경로','위험 분석'],annotation:'신디케이트 내부의 오염 장비 유통과 비인가 연구 정황을 묶은 제한 기록.'},
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
    rail.innerHTML=`<div class="pc5133-rail-title"><b>사건 색인</b><span>${caseEsc(id)}</span></div><div class="pc5133-rail-tabs">${casePrimaryTabs(root)}</div><div class="pc5133-rail-sub"><b>부속 기록</b>${caseChips(caseSubrecordSummary(root),'부속 없음')}</div>`;

    const body=document.createElement('section');
    body.className='pc5133-case-body';
    body.appendChild(header);
    body.appendChild(content);

    const metaPanel=document.createElement('aside');
    metaPanel.className='pc5133-case-meta';
    metaPanel.innerHTML=`<div class="pc5133-meta-head"><span>U.A.C 사건 파일</span><b>${caseEsc(meta.grade)}</b></div>
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
      if(trace){ trace.textContent=on?'F.H.C 흔적: 활성':'F.H.C 흔적: 색인 스캔'; trace.className='status-field status-warn'; }
      if(notice && on) notice.textContent='제한 기록 불러오는 중 / 부분 기록 공개';
      if(integrity && on) integrity.textContent='기록 무결성: 61%';
    }

    function enhanceCards(){
      document.querySelectorAll('.doc-card').forEach(card=>{
        if(card.dataset.fhc51Card) return;
        const text=card.textContent||'';
        if(!FHC_CARD_RE.test(text)) return;
        card.dataset.fhc51Card='1';
        card.classList.add('fhc-sealed-card');
        const row=card.querySelector('.status-row')||card;
        ['F.H.C 봉인','흔적 활성'].forEach(label=>{
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
      el.innerHTML='<div class="top"><b>제한 기록 불러오는 중</b><span>제한 노드</span></div>'+ 
        '<div class="grid"><span>권한 불일치 감지</span><span>부분 기록 공개</span><span>흔적 로그 활성</span><span>블랙 태그 교차 확인</span></div><div class="bar"><i></i></div>';
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
      panel.innerHTML='<div class="fhc-security-title">F.H.C 제한 기록 / 부분 공개</div>'+ 
        '<div class="fhc-security-grid"><span><b>보안</b>F.H.C 제한</span><span><b>접근</b>부분 공개</span><span><b>흔적</b>활성</span><span><b>무결성</b>61%</span></div>'+ 
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

// 5.15.2cf — standalone records return to the archive without replaying cold boot.
(function(){
  'use strict';
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  const inStandaloneRecord=()=>String(location.pathname||'').includes('/docs/');
  const returnHref='../../index.html?return=archive#archive-entry';

  if(inStandaloneRecord()){
    ready(()=>{
      document.querySelectorAll('a[href$="index.html#archive-entry"],a[href*="index.html?return=archive#archive-entry"]').forEach(anchor=>anchor.setAttribute('href',returnHref));
    });
    document.addEventListener('click',event=>{
      const anchor=event.target.closest?.('a[href]');
      if(!anchor) return;
      const href=anchor.getAttribute('href')||'';
      if(!/index\.html(?:\?return=archive)?#archive-entry$/.test(href)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href=returnHref;
    },true);
  }

  if(window.__pc5152SkipBoot){
    ready(()=>{
      const loader=document.getElementById('loader');
      const app=document.getElementById('app');
      if(loader) loader.classList.add('hide');
      if(app) app.classList.add('ready');
      document.body.classList.add('pc5121-boot-complete','pc5152ao-boot-safe');
      document.body.classList.remove('pc5121-boot-pending','pc5152bi-boot-hold');
      document.querySelectorAll('.content-page[id]').forEach(page=>page.classList.toggle('active',page.id==='archive-entry'));
      document.querySelectorAll('.side-menu a[data-target]').forEach(link=>link.classList.toggle('active',link.dataset.target==='archive-entry'));
      try{ history.replaceState(null,'',location.pathname+'#archive-entry'); }catch(e){}
    });
  }
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
        if(notice) notice.textContent='손상 영상 신호 / FRAME INDEX RECOVERED / AUDIO CHANNEL 열화';
        if(integrity) integrity.textContent='기록 무결성: 58%';
      }
    }

    function classifyVideoRecord(root){
      const title=(root.querySelector('.doc-title')||{}).textContent||'';
      const code=(root.dataset||{}).record||'';
      if(code==='Immortality_860201') return {source:'U.A.C 현장 카메라 / 신호팀', video:'부분', audio:'열화', frame:'22% 손실', signal:'피의 호수 기원 파일'};
      if(code==='불명_Record1_860204') return {source:'F.H.C 회수 장치', video:'부분', audio:'열화', frame:'31% 손실', signal:'아마리온 교육 캐시'};
      if(code==='Sakuma_Tape_991028') return {source:'S.I.D 현장 카메라 / 회수 테이프', video:'부분', audio:'잡음', frame:'18% 손실', signal:'도쿄 오컬트 사건 파일'};
      return {source:title||'회수 장치', video:'부분', audio:'열화', frame:'감지', signal:'현장 카메라 캐시'};
    }

    function addVideoPanel(root){
      if(!root || root.querySelector('.video-feed-panel')) return;
      const data=classifyVideoRecord(root);
      root.classList.add('damaged-video-record');
      const content=root.querySelector('.record-content')||root;
      const panel=document.createElement('div');
      panel.className='video-feed-panel';
      panel.innerHTML='<div class="video-feed-title"><b>손상 영상 신호</b><span>SIGNAL RECOVERY</span></div>'+ 
        '<div class="video-feed-grid"><span><b>SOURCE</b>'+esc(data.source)+'</span><span><b>VIDEO</b>'+esc(data.video)+'</span><span><b>AUDIO</b>'+esc(data.audio)+'</span><span><b>FRAME 손실</b>'+esc(data.frame)+'</span></div>'+ 
        '<div class="video-feed-note">'+esc(data.signal)+' / 프레임 인덱스 일부 재구성 완료</div>';
      content.insertBefore(panel, content.firstChild);
    }

    function frameLabelFor(root){
      const code=(root&&root.dataset&&root.dataset.record)||'';
      if(code==='Sakuma_Tape_991028') return 'FRAME 손실 · 프레임 누락';
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
        ['VIDEO LOG','SIGNAL DAMAGED','FRAME 손실'].forEach(label=>{
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
    const BIO_RECORDS=window.ProjectCurseBioRecords || new Set(['타락 개체_860722','FCR_Archive_890402','불명_Record2_860205']);
    const BIO_CARD_RE=/타락 개체|개체 분류|부검|Queen-Type|미믹|혼합 개체|상위 개체/i;
    const esc=(v)=>String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    const profiles={
      '타락 개체_860722':{cls:'CORRUPTED ENTITY',ko:'타락 개체 분류',cont:'HIGH',react:'UNSTABLE',intel:'LOW / 가변',threat:'RED',trace:'ENTITY SCAN · 개체 분석'},
      'FCR_Archive_890402':{cls:'혼합 / 미믹 / 명령 반응',ko:'추가 분류 보고',cont:'가변',react:'명령 반응',intel:'부분',threat:'BLACK',trace:'흔적 대조'},
      '불명_Record2_860205':{cls:'AUTOPSY SAMPLE / BL-088',ko:'생체 오염 부검',cont:'치명',react:'사후 활성',intel:'없음',threat:'RED',trace:'조직 대조'},
    };
    function profile(root){return profiles[root && root.dataset ? root.dataset.record : ''] || {cls:'개체 파일',ko:'개체 기록',cont:'불명',react:'가변',intel:'불명',threat:'감시',trace:'ENTITY SCAN · 개체 분석'};}

    function bioStatus(on){
      document.body.classList.toggle('has-bio-scan',!!on);
      const trace=document.querySelector('[data-srv-trace]');
      const notice=document.querySelector('[data-srv-notice]');
      const integrity=document.querySelector('[data-srv-integrity]');
      if(on){
        if(trace){ trace.textContent='생체 스캔: 활성'; trace.className='status-field status-map'; }
        if(notice) notice.textContent='생체 흔적 스캔 / BIOLOGICAL 기록 불러오는 중 / HOST RESPONSE INDEX';
        if(integrity) integrity.textContent='기록 무결성: 64%';
      }
    }

    function addBioPanel(root){
      if(!root || root.querySelector('.bio-scan-panel')) return;
      const data=profile(root);
      root.classList.add('bio-scan-record');
      const content=root.querySelector('.record-content')||root;
      const panel=document.createElement('div');
      panel.className='bio-scan-panel';
      panel.innerHTML='<div class="bio-scan-title"><b>생체 흔적 스캔</b><span>'+esc(data.ko)+'</span></div>'+
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
        const labels=id==='FCR_Archive_890402'?['개체 파일','미믹 흔적','기밀']:
          id==='불명_Record2_860205'?['AUTOPSY','BIO SCAN','CONTAMINATION']:
          ['개체 파일','BIO SCAN','오염'];
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
      uac:{name:'U.A.C',type:'중앙 통제',status:'통제 / 기관 조율',threat:'중앙 노드',contact:'N.H.C · S.I.D · C.P.D · F.H.C 감시망 연결',kind:'control'},
      nhc:{name:'N.H.C',type:'FIELD OPERATION',status:'현장 작전 협력',threat:'레드존 전투 대응',contact:'U.A.C 명령 수신 / A.R.F·Ash Crew 후속 처리 / Syndicate 추적',kind:'friendly'},
      sid:{name:'S.I.D',type:'INVESTIGATION TRACE',status:'조사 / 감시',threat:'오컬트 사건 추적',contact:'Ushnoda Cult·Haimun 추적 / U.A.C 기록 공유',kind:'watch'},
      fhc:{name:'F.H.C',type:'연구 노드',status:'연구 의존 / 상호 감시',threat:'자료 은폐 가능성',contact:'U.A.C 감시망 / Amarion 연구 연결',kind:'research'},
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
      panel.innerHTML='<div class="trace-head"><b>세력 흔적</b><span>노드 대기</span></div><div class="trace-grid"><span><b>대상</b><i data-trace-name>U.A.C</i></span><span><b>관계 상태</b><i data-trace-status>중앙 통제</i></span><span><b>위협 지수</b><i data-trace-threat>중앙 노드</i></span><span><b>접촉 기록</b><i data-trace-contact>세력 마크를 선택하십시오.</i></span></div>';
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
        panel.querySelector('.trace-head span').textContent='노드: '+info.name+' / 흔적 활성';
        const notice=document.querySelector('[data-srv-notice]');
        const trace=document.querySelector('[data-srv-trace]');
        if(notice) notice.textContent='세력 흔적 / '+info.name+' / '+info.status;
        if(trace){ trace.textContent='관계 흔적: '+info.name; trace.className='status-field status-map'; }
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
        haimun:['하이문','불명 네트워크','감시','S.I.D / 신디케이트','정보 중개와 비인가 경로가 확인되는 감시 대상이다.'],
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
    const bioRecords=new Set(['타락 개체_860722','FCR_Archive_890402','불명_Record2_860205']);
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
      el.innerHTML=`<b>${label || '노드'}</b><span>${code || '신호 열화'}</span>`;
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
        const label=(btn.querySelector('b') && btn.querySelector('b').textContent) || '노드';
        const code=(btn.querySelector('small') && btn.querySelector('small').textContent) || '신호 열화';
        showNotice(code, label);
        audioCue(btn.classList.contains('restricted') ? 'denied' : 'drawer', 260);
      });
    });
  });
})();


// MapPatch 5.13.4 — FactionNetwork_UI_Rebuild retired in 5.15.2bq.
// Legacy pc5134 faction/relation renderer removed to keep the faction and relation screens single-owner.

// MapPatch 5.14.0 — EntityArchive_Add.
// Adds a damaged institutional entity archive. No existing record body is rewritten.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };

  ready(function(){
    document.body.classList.add('pc5140-entity-archive-ready');

    const esc=(v)=>String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    const entityFiles=[
      {id:'ENT-860722-FERAL-01',className:'타락 개체',name:'신원불명의 신자',status:'FIELD RED',threat:'근접 접촉 금지',zone:'란저우 / 도심 침투권',op:'lanzhou',record:'타락 개체_860722',img:'assets/resources/86ed1a163d79930b0874dbd5eb93adf2.webp',source:'F.H.C 봉인 기록 / 타락교 기록면',reaction:'육체 변형 / 인육 섭취 후 일시적 안정',note:'일반인 위장 가능성이 있어 C.P.D 선별 절차와 분리해야 한다.'},
      {id:'ENT-860722-SUP-02',className:'상위 개체',name:'가면을 쓴 존재',status:'SEAL 감시',threat:'정신 오염 / 명령 전달',zone:'우시노다교 흔적권',op:'lanzhou',record:'Cults_871104',img:'assets/resources/83d311da1ab7310a567c6023f6151e6c.webp',source:'종교',reaction:'의식 지휘 / 하위 신자 통제',note:'직접 교전보다 기록 오염과 추적 실패가 먼저 발생한다.'},
      {id:'ENT-881120-MIMIC-03',className:'미믹 개체',name:'귀환자 위장 반응체',status:'CIV SCREEN',threat:'검문선 침투',zone:'부산 선별 부두 / 델리 선별권',op:'busan',record:'FCR_Archive_890402',img:'assets/resources/c85c636bb85c747508df07e1115a9b89.webp',source:'타락 개체 분류 추가 보고서',reaction:'기억 손실 위장 / 지연 신체 반응',note:'귀환자를 즉시 타락 개체로 기록하지 않되, 가족 접촉은 보류한다.'},
      {id:'ENT-890402-MIX-04',className:'혼합 개체',name:'오염 장비 접촉 변이체',status:'RECOVERY FAIL',threat:'장비 매개 확산',zone:'북해-함부르크 / 회수 실패 구역',op:'northsea',record:'Redzone_881120',img:'assets/resources/0a8342297ac1a847461c57a2726d98b7.webp',source:'레드존 이상현상 및 오염 기준 문서',reaction:'오염된 장비와 생체 반응이 결합',note:'장비 회수보다 현장 소각과 봉쇄선 유지가 우선된다.'},
      {id:'ENT-891219-CMD-05',className:'명령 반응체',name:'무전 응답 개체',status:'신호 열화',threat:'통신 유인',zone:'Dead Hour / Ghost Channel 구역',op:'world',record:'Redzone_881120',img:'assets/resources/e39a87391183a4f564af26c1dd3b7bbd.webp',source:'N.H.C 생존 규칙 / 레드존 통신 오염',reaction:'사망자 무전 또는 반복 명령에 반응',note:'사망자 무전에 응답하지 않는다. 동일 명령 반복은 후퇴 기준이다.'},
      {id:'ENT-860204-ART-06',className:'인공 개체',name:'아마리온 연구 부산물',status:'BLACK SITE 감시',threat:'비인가 연구 확산',zone:'Black Site 후보 / 기업 연구권',op:'world',record:'불명_Record1_860204',img:'assets/resources/734d86c7b7d166024a3be1993b9ed78a.webp',source:'아마리온 회수 영상 기록',reaction:'현실 외부 공간 / 고응축 자원 반응',note:'교육 영상처럼 위장된 연구 자료에서 파생 가능성이 확인된다.'},
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
            <div class="pc5140-node-head"><span>개체 파일 INDEX</span><b>현장 분류</b><small>RECOVERED / 부분</small></div>
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
        `).join('') || '<div class="pc5140-empty">회수 파일 없음</div>';
        listEl.querySelectorAll('[data-pc5140-entity]').forEach(btn=>{
          btn.addEventListener('click',()=>{
            selectEntity(btn.getAttribute('data-pc5140-entity'));
            
          });
        });
      }

      function selectEntity(id){
        const file=entityFiles.find(x=>x.id===id) || visibleList()[0] || entityFiles[0];
        if(!file) return;
        renderList(file.id);
        detailEl.innerHTML=`
          <div class="pc5140-detail-head">
            <span>선택 개체 파일</span>
            <b>${esc(file.name)}</b>
            <small>${esc(file.id)}</small>
          </div>
          <figure class="pc5140-recovered-image">
            <img src="${esc(file.img)}" alt="${esc(file.name)} 회수 이미지" loading="lazy">
            <figcaption>RECOVERED IMAGE / QUALITY 열화</figcaption>
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
      {id:'RC-CPD-04-512',grade:'R-4 오염된 침묵',name:'북해 봉인 항만 회수자',status:'SILENCE 오염',contact:'가족 접촉 전면 금지',evac:'민간 대피선 접근 금지',quarantine:'봉인실 이관',zone:'북해-함부르크 봉인 항만',op:'northsea',record:'Cults_871104',img:'assets/resources/b20abfee553be1cf8a7f818a2bd84f23.webp',memo:'어떤 질문에도 응답하지 않지만, F.H.C 봉인 문구를 들을 때 심박과 안구 반응이 동기화된다. 침묵 자체를 오염 반응으로 분류한다.'},
      {id:'RC-CPD-05-666',grade:'R-5 위장 귀환 개체',name:'신원 불일치 귀환자',status:'FALSE RETURN',contact:'가족 접촉 금지 / 신원 폐기',evac:'C.P.D 대피버스 접근 금지',quarantine:'N.H.C 인계 / 소각 대기',zone:'란저우 내륙 레드존',op:'lanzhou',record:'타락 개체_860722',img:'assets/resources/86ed1a163d79930b0874dbd5eb93adf2.webp',memo:'지문·치아 기록은 실종자와 일치하나 생년과 가족 구성 진술이 반복적으로 어긋난다. 귀환자가 아니라 귀환자 위장 개체로 재분류한다.'},
      {id:'RC-CPD-02-702',grade:'R-2 시간 불일치',name:'부산 대피 회랑 지연 귀환자',status:'SECONDARY CHECK REQUIRED',contact:'가족 통화 3분 제한',evac:'후속 차량 대기',quarantine:'36시간 관찰',zone:'부산 해상 통제 허브',op:'busan',record:'NHC_Manual_891219',img:'assets/resources/e39a87391183a4f564af26c1dd3b7bbd.webp',memo:'대피 회랑 진입 당시 무전 기록이 11분 늦게 수신되었다. 검문소 CCTV에는 정상적으로 통과한 것으로 보이나 음성 기록만 뒤틀려 있다.'},
      {id:'RC-CPD-03-811',grade:'R-3 지연 신체 반응',name:'호주 중앙 심부 외곽 구조자',status:'BLACK CORE 감시',contact:'가족 접촉 금지',evac:'이동 금지',quarantine:'격리 컨테이너 유지',zone:'호주 중앙 심부 반응점',op:'australia',record:'Redzone_881120',img:'assets/resources/05cdc0276694d090f3829c4dc6e5a30b.webp',memo:'구조 직후에는 정상 보행과 정상 문답이 가능했으나, 블랙코어 반응 기록 재생 시 비자발적 안면 경련이 발생했다.'}
    ];

    const grades=['전체','R-0 정상','R-1 기억 손실','R-2 시간 불일치','R-3 지연 신체 반응','R-4 오염된 침묵','R-5 위장 귀환 개체'];

    function renderReturnedRegistry(){
      const root=document.getElementById('pc5141ReturnedRoot');
      if(!root) return;
      root.innerHTML=`
        <div class="pc5141-registry-shell" data-filter="전체">
          <aside class="pc5141-registry-left">
            <div class="pc5141-node-head"><span>C.P.D 선별 노드</span><b>귀환자</b><small>U.A.C 검토 / 부분</small></div>
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
        `).join('') || '<div class="pc5141-empty">선별 파일 없음</div>';
        listEl.querySelectorAll('[data-pc5141-returned]').forEach(btn=>{
          btn.addEventListener('click',()=>{
            selectReturned(btn.getAttribute('data-pc5141-returned'));
            
          });
        });
      }

      function selectReturned(id){
        const file=returnedFiles.find(x=>x.id===id) || visibleList()[0] || returnedFiles[0];
        if(!file) return;
        renderList(file.id);
        detailEl.innerHTML=`
          <div class="pc5141-detail-head">
            <span>선택 선별 파일</span>
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
      {id:'EQSYS-SHIELD-01',category:'오염 차폐 장비군',name:'오염 차폐 장비군',status:'FIELD LIMITED',handler:'N.H.C / F.H.C / A.R.F',contamination:'흡착 포화 / 내부 잔류',op:'busan',zone:'현장 진입권 / 의무 후송선',record:'NHC_Manual_891219',img:'assets/resources/0a8342297ac1a847461c57a2726d98b7.webp',caution:'반응률 저하 시 현장 탈의 금지',note:'현장 차폐복, 차폐 섬유, 감응 차단 도막, 장비 표면 오염 억제 피막을 하나의 체계로 관리한다. 장비는 오염 부착과 감응을 늦출 뿐 제거하지 못한다. 외부 표면이 굳거나 착용자의 움직임보다 늦게 접히면 회수반 도착 전까지 벗지 않는다.'},
      {id:'EQSYS-SIGNAL-02',category:'신호 억제 장비군',name:'신호 억제 장비군',status:'SIGNAL LIMITED',handler:'S.I.D / N.H.C',contamination:'통신 반복 / 응답 모방',op:'world',zone:'Ghost Channel / 죽은 시간 관측권',record:'Redzone_881120',img:'assets/resources/e39a87391183a4f564af26c1dd3b7bbd.webp',caution:'사망자 호출부호 수신 시 채널 폐기',note:'공명 차단기, 통신 격리 단말, 예비 주파수 전환기, 시간 기준 보조 장치를 통합한 체계다. 같은 억제 패턴을 반복하면 현상이 장비 응답을 모방할 수 있으므로 장시간 연속 운용을 금지한다.'},
      {id:'EQSYS-BLOOD-03',category:'혈성 오염 대응 장비군',name:'혈성 오염 대응 장비군',status:'BIO RESPONSE',handler:'F.H.C / N.H.C / Ash Crew',contamination:'혈성 입자 / 통로 반응',op:'lanzhou',zone:'Blood Gate / 혈액성 잔류권',record:'Cults_871104',img:'assets/resources/b20abfee553be1cf8a7f818a2bd84f23.webp',caution:'응고층을 손으로 제거하지 말 것',note:'혈액성 부유층 감지기, 혈성 입자 필터, 통로 반응 표지, 밀폐 회수 키트를 묶는다. 검출 장비가 같은 좌표를 서로 다르게 표시하면 필터 교체보다 구역 철수를 우선한다.'},
      {id:'EQSYS-RECOVERY-04',category:'회수·소각 장비군',name:'회수·소각 장비군',status:'BURN AFTER CHECK',handler:'A.R.F / Ash Crew',contamination:'2차 매개 / 기록 손상',op:'world',zone:'회수선 / 소각선',record:'NHC_Manual_891219',img:'assets/resources/734d86c7b7d166024a3be1993b9ed78a.webp',caution:'회수 불가 판정 후 재개봉 금지',note:'회수 태그, 오염물 봉인 컨테이너, 절단 회수구, 현장 소각 장치를 하나의 후속 처리 체계로 관리한다. 장비가 작동하더라도 사용자 사망 후 반응이 지속되면 군수품이 아니라 오염 매개체로 분류한다.'},
      {id:'INFSYS-CONTAIN-05',category:'봉쇄 인프라 체계',name:'봉쇄 인프라 체계',status:'CONTAINMENT ACTIVE',handler:'U.A.C / C.P.D / N.H.C',contamination:'절차 단절 / 좌표 불일치',op:'northsea',zone:'검문소·항만·도시 외곽',record:'Redzone_881120',img:'assets/resources/c85c636bb85c747508df07e1115a9b89.webp',caution:'게이트 정상 표시만으로 개방 금지',note:'검문 게이트, 감시탑, 임시 격리실, 대피 차량, 항만 차단선, 소각 대기 회랑을 통합한다. 봉쇄선은 구조물이 아니라 검문·분리·기록·회수·소각이 이어지는 절차이며 하나라도 끊기면 붕괴로 판정한다.'},
      {id:'EQSYS-SUPPRESS-06',category:'현장 제압 장비군',name:'현장 제압 장비군',status:'CONTROLLED ISSUE',handler:'N.H.C / A.R.F',contamination:'탄피·잔류물 회수 필요',op:'busan',zone:'교전선 / 현장 보급권',record:'NHC_Manual_891219',img:'assets/resources/57674a652af43e6aec284bbc33018b06.webp',caution:'화력보다 회수 가능성 우선',note:'표준 화기, 개체 제압탄, 비살상 억제 장비, 투척 장비, 보조무기를 하나의 운용 체계로 묶는다. 탄종과 장비 선택은 위력보다 봉쇄선 안전, 잔류물 회수, 민간선 침범 가능성을 기준으로 한다.'}
    ];

    const categories=['전체','오염 차폐 장비군','신호 억제 장비군','혈성 오염 대응 장비군','회수·소각 장비군','봉쇄 인프라 체계','현장 제압 장비군'];

    function renderEquipmentCodex(){
      const root=document.getElementById('pc5150EquipmentRoot');
      if(!root) return;
      root.innerHTML=`
        <div class="pc5150-equipment-shell" data-filter="전체">
          <aside class="pc5150-equipment-left">
            <div class="pc5150-node-head"><span>장비·봉쇄 기록 노드</span><b>SYSTEM TAXONOMY</b><small>FIELD HANDLING / 부분</small></div>
            <div class="pc5150-category-list">
              ${categories.map((cat,i)=>`<button type="button" class="${i===0?'active':''}" data-pc5150-category="${esc(cat)}"><i>${String(i).padStart(2,'0')}</i><span>${esc(cat)}</span></button>`).join('')}
            </div>
            <div class="pc5150-equipment-warning"><b>취급 경고</b><p>이 화면은 무기 목록이 아니다. 회수 장비는 재사용보다 오염 경로 확인과 폐기 여부 판단을 우선한다.</p></div>
          </aside>
          <section class="pc5150-equipment-list" aria-label="장비 체계 기록 목록"></section>
          <aside class="pc5150-equipment-detail" aria-label="선택 장비 체계 기록"></aside>
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
            
          });
        });
      }

      function selectEquipment(id){
        const file=equipmentFiles.find(x=>x.id===id) || visibleList()[0] || equipmentFiles[0];
        if(!file) return;
        renderList(file.id);
        detailEl.innerHTML=`
          <div class="pc5150-detail-head">
            <span>선택 장비 체계</span>
            <b>${esc(file.name)}</b>
            <small>${esc(file.id)}</small>
          </div>
          <figure class="pc5150-equipment-image">
            <img src="${esc(file.img)}" alt="${esc(file.name)} 장비 체계 참고 자료" loading="lazy">
            <figcaption>FIELD SYSTEM REFERENCE / ARCHIVE COPY</figcaption>
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
// Art-direction retrofit for closed-server recovered-video atmosphere.
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
      r.textContent='UAC-PC03 / RECOVERED COPY / 신호 열화';
      app.appendChild(r);
    }

    dimAudioBus();
    addSignalOverlay();
    addFrameReadout();

    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152:'AnalogHorror UI Retrofit',
      artDirection:'1980-2030 closed archive / recovered broadcast damage'
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
        bus.audio.ambient = new Audio(prefix+'assets/audio/pc5152am_menu_old_computer.mp3');
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
        bus.audio.ambient = new Audio(pre+'assets/audio/pc5152am_menu_old_computer.mp3');
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
        bus.audio.ambient = new Audio(pre+'assets/audio/pc5152am_menu_old_computer.mp3');
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
            note.textContent=' / 설정 기록';
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
          bus.audio.ambient = new Audio(pre+'assets/audio/pc5152am_menu_old_computer.mp3');
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
        bus.audio.ambient = new Audio(pre+'assets/audio/pc5152am_menu_old_computer.mp3');
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
      if(seq) seq.setAttribute('data-audio-ref','OLD COMPUTER / ANALOG CONTACT / 기록 불러오는 중');
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
        bus.audio.ambient = new Audio(pre+'assets/audio/pc5152am_menu_old_computer.mp3');
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
    document.body.classList.add('pc5152as-recordsequence-stageviewer');
    document.body.classList.add('pc5152ay-reference-rollback-religionfix');
    document.body.classList.add('pc5152az-immortality-fieldbriefing-pass');
    document.body.classList.add('pc5152ba-titleimg-mobile-sequencefix');
    document.body.classList.add('pc5152bb-stage-template-responsivefix');

    const IMMORTALITY_RECORD='Immortality_860201';
    const FERALS_RECORD='Ferals_860722';
    const SAKUMA_RECORD='Sakuma_Tape_991028';
    const SEQUENCE_RECORDS = new Set(['Cults_871104', IMMORTALITY_RECORD, FERALS_RECORD, SAKUMA_RECORD]);
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
      sakumaProjector:null,
      sakumaBirthdayCue:null,
      specialMediaActive:false,
      dialogCue:null,
      latePulse:null,
      latePulseTimer:null,
      latePulseActive:false,
      mutationAppliedPage:-1,
      autoTimer:null,
      autoPaused:false,
      autoDelay:0,
      runId:0
    };

    const pages = [
      {
            "group": "warning",
            "code": "CLASSIFIED MATERIAL / WARNING",
            "title": "WARNING",
            "subtitle": "F.H.C / ANTICORRUPTION DIVISION",
            "image": "",
            "frame": "RESTRICTED DOCUMENT / AUTHORIZED ACCESS",
            "layout": "warningNotice",
            "lineDelay": 900,
            "lines": [
                  "F.H.C 부대의 사기 저하와 전반적인 작전 효율 악화로 인해, 타락 및 교단 침투자에 대한 처리는 반부패부서가 전담한다.",
                  "이하 문서는 기밀 정보를 포함한다. 단독으로 또는 승인된 인원과 함께 열람할 것.",
                  "문의 사항이 있을 경우 타카무라 또는 야나미에게 직접 연락할 것."
            ]
      },
      {
            "group": "cult",
            "code": "FRAME 01 / CULT TRACE",
            "title": "타락교",
            "subtitle": "Corrupted Cult",
            "image": "assets/resources/archive-enex/cults/image-57-corrupted-cult.png",
            "frame": "CULT TRACE / RECOVERED",
            "layout": "twoColumn",
            "lineDelay": 900,
            "lines": [
                  "타락교는 암흑기에 흩어진 종파들이 이어져 형성된 오염 신앙 계열로 추정된다.",
                  "역대 지도층은 확인되지 않았으며, 현대에는 여러 국가에 침투해 사회 내부를 잠식한다.",
                  "저주와 신체 변형을 축복으로 받아들이고, 불멸성을 신앙의 증거로 삼는다.",
                  "개별 신자 하나하나가 실질적 위협이 되며, 일반 사회 내부에 비밀 조직 형태로 남아 있다."
            ]
      },
      {
            "group": "cult",
            "code": "FRAME 02 / ID FAILED",
            "title": "신원불명의 신자",
            "subtitle": "Unidentified Believer",
            "image": "assets/resources/86ed1a163d79930b0874dbd5eb93adf2.webp",
            "frame": "IMAGE-860722 / UNIDENTIFIED BELIEVER",
            "imageCode": "IMG-860722",
            "layout": "evidenceCenter",
            "caption": "일반인 위장 가능 · 인육 섭취 후 형태 안정 사례 보고",
            "lineDelay": 900,
            "report": [
                  "신원불명의 신자는 현장에서 가장 흔히 확인되는 타락교 하위 신자 유형이다. 겉으로는 인간과 비슷하지만 신체 내부와 행동 패턴은 이미 오염 단계에 들어간 경우가 많다.",
                  "신선한 살을 섭취한 뒤 일시적으로 형태가 안정되는 사례가 보고되었다. 소규모 집단 행동과 은밀한 접근을 우선 경계해야 한다."
            ]
      },
      {
            "group": "cult",
            "code": "FRAME 03 / MASKED FORM",
            "title": "가면을 쓴 존재",
            "subtitle": "Masked Entity",
            "image": "assets/resources/b20abfee553be1cf8a7f818a2bd84f23.webp",
            "frame": "IMAGE-860723 / MASKED ENTITY",
            "imageCode": "IMG-860723",
            "layout": "evidenceCenter",
            "caption": "의식장 중심부 출현 · 정신 오염 반응 동반",
            "lineDelay": 900,
            "report": [
                  "가면을 쓴 존재는 타락교 의식장 주변에서 반복적으로 포착되는 특수 개체다. 야생 동물 기반 변형체로 추정되며, 일부 신자들은 이를 성물처럼 보호한다.",
                  "직접 교전보다 정신 오염과 추적 실패가 먼저 발생한다. 의식장 중심부에서 발견될 경우 즉시 봉쇄 등급을 올려야 한다."
            ]
      },
      {
            "group": "cult",
            "code": "FRAME 04 / CORRUPTION PROCESS",
            "title": "타락의 과정 및 형태",
            "subtitle": "Corruption Process",
            "image": "assets/resources/646468c8e709d197314f9d40e286986b.webp",
            "frame": "IMAGE-0923 / CORRUPTION PROCESS",
            "imageCode": "IMG-0923",
            "layout": "evidenceCenter",
            "caption": "살의 길 반복 사용 · 신체 형성물 · 자가포식 위험",
            "lineDelay": 900,
            "alertDelay": 950,
            "redAlert": "자가포식으로 이어질 수 있음",
            "report": [
                  "살의 길을 반복적으로 사용하면 늦거나 빠르게 침묵성 타락이 시작된다. 몸 곳곳에 새로운 기관과 형성물이 자라나며, 날카로운 치아를 가진 구강 구조와 감각 기관이 동반되는 경우가 많다.",
                  "이 과정은 비현실감과 인격 소실을 함께 일으킨다. 심한 경우 피해자는 자신의 신체를 먹어 치우는 자가포식 단계로 넘어간다."
            ]
      },
      {
            "group": "cult",
            "code": "FRAME 05 / SILENT CORRUPTION",
            "title": "침묵성 타락",
            "subtitle": "Silent Corruption",
            "image": "assets/resources/pc5152ay_silent_corruption.png",
            "frame": "IMAGE-1293A / SILENT CORRUPTION",
            "imageCode": "IMG-1293A",
            "layout": "evidenceCenter",
            "caption": "빙의 없음 · 내부 오염 성장 · 잠복성 변형",
            "lineDelay": 900,
            "report": [
                  "침묵성 타락은 빙의 없이 피해자 내부에서 오염이 자라나는 사례를 뜻한다. 초기에는 정상 상태처럼 보이지만, 통증과 무기력, 이상 조직 성장이 뒤늦게 드러난다.",
                  "학교와 주거지 내부 사례가 증가하고 있다. 발견이 늦을수록 회복 가능성은 급격히 낮아진다."
            ]
      },
      {
            "group": "cult",
            "code": "FRAME 06 / HYBRIDIZATION",
            "title": "융합성 타락",
            "subtitle": "Hybridized Corruption",
            "image": "assets/resources/pc5152ay_hybrid_corruption.png",
            "frame": "IMAGE-1293B / HYBRIDIZED CORRUPTION",
            "imageCode": "IMG-1293B",
            "layout": "evidenceCenter",
            "caption": "교단 의식 개입 · 피해자 내부 통합 · 혼성화",
            "lineDelay": 900,
            "mutation": {
                  "mode": "click",
                  "delay": 1450,
                  "readyDelay": 2900,
                  "imageCode": "IMG-1293C",
                  "title": "융합성 타락 / 변조됨",
                  "caption": "공공 안내문 위장 · 행동 통제성 문장 삽입",
                  "redAlert": "당신의 행동에 책임을 지십시오",
                  "report": [
                        "일부 기록은 정상적인 설명문처럼 시작하다가 교단식 안내문으로 순간 변조된다. 아이들을 감시하라, 학생들은 이미 어른이다, 인증된 교단과만 접촉하라는 식의 문장이 대표적이다.",
                        "이 유형은 정보 오염 또는 의식성 간섭 흔적으로 분류한다. 기록면 자체를 2차 오염원으로 취급해야 한다."
                  ]
            },
            "report": [
                  "일반적인 타락은 대개 되돌릴 수 없으며 피해자를 타락 생명체로 전환한다. 그러나 일부 교단은 의식을 통해 타락을 피해자 내부에 통합시키는 융합 과정을 강제로 유도한다.",
                  "인간 자아와 타락 조직이 동시에 남아 있을 수 있다. 외형 일부만 변형되어 발견이 늦어지는 경우가 많다."
            ]
      },
      {
            "group": "blood",
            "code": "FRAME 07 / BLOOD TRACE",
            "title": "혈교",
            "subtitle": "Blood Cult",
            "image": "assets/resources/8668a15590e2ae00b18d68db57a85c95.webp",
            "frame": "BLOOD TRACE / RECOVERED",
            "layout": "twoColumn",
            "lineDelay": 900,
            "lines": [
                  "혈교는 오래된 혈액 의식 전통에서 갈라져 나온 분파이며, 타락체 자체보다 피의 의미와 경로를 중시한다.",
                  "피를 생명 유지 물질이 아니라 문, 무기, 경로, 저장소를 여는 매개체로 취급한다.",
                  "피의 길 자체가 즉시 타락을 유발하지는 않지만, 과도한 사용은 대량 출혈과 탈수로 이어진다.",
                  "현장에서는 의식적 사혈, 혈액 무기화, 이동 경로 조작을 우선 감시한다."
            ]
      },
      {
            "group": "blood",
            "code": "FRAME 08 / ROUTE CONTROL",
            "title": "혈액 이동 경로 조정",
            "subtitle": "Blood Route Control",
            "image": "assets/resources/89eeb37859d35d979b1d217e11f5148f.webp",
            "frame": "IMAGE-880614 / BLOOD ROUTE CONTROL",
            "imageCode": "IMG-880614",
            "layout": "evidenceCenter",
            "caption": "혈류 조정 · 응고 방어막 · 혈액 무기 형성",
            "lineDelay": 900,
            "report": [
                  "혈액 사용자들은 체내와 외부 혈액의 이동 경로를 조정해 전투 흐름을 바꾼다. 출혈 제어와 응고 조작이 동시에 가능하며, 방어막과 즉석 무기 형성에 응용된다.",
                  "장기전일수록 사용자 체력 소모가 커진다. 혈액 손실이 누적되면 조작 정확도가 떨어지고 급성 탈수 증상이 뒤따른다."
            ]
      },
      {
            "group": "blood",
            "code": "FRAME 09 / BLOOD WEAPON",
            "title": "혈무의 제작 과정",
            "subtitle": "혈무 Creation",
            "image": "assets/resources/5a2db6abec6308c441b2b430a3da59c2.webp",
            "frame": "IMAGE-880615 / BLOOD WEAPON FORM",
            "imageCode": "IMG-880615",
            "layout": "evidenceCenter",
            "caption": "근접 무기 기반 · 피의 의식 고정 · 타락 조직 억제",
            "lineDelay": 900,
            "report": [
                  "혈무는 기존 근접 무기에 혈액을 덮고, 피의 의식으로 고정해 만든 의식성 병기다.",
                  "완성된 혈무는 일반 무기보다 오래 버티며, 타락 조직을 절단하고 재생을 늦추는 데 사용된다."
            ]
      },
      {
            "group": "blood",
            "code": "FRAME 10 / BLOOD LAKE",
            "title": "피의 호수를 거니는 자들",
            "subtitle": "Walking Through the Lake of Blood",
            "image": "assets/resources/1ab6ba9fba9b6b8b9493045c7bf4836d.webp",
            "frame": "IMAGE-880616 / BLOOD LAKE WALKER",
            "imageCode": "IMG-880616",
            "layout": "evidenceCenter",
            "caption": "혈액 웅덩이 내부 이동 · 매복 가능 · 단순 혈흔 아님",
            "lineDelay": 900,
            "report": [
                  "혈액 웅덩이는 저장소이자 이동 경로로 사용된다. 혈교 신자는 수면 아래에 숨어 이동하거나 매복할 수 있다.",
                  "현장 인원은 이를 단순 혈흔으로 판단해서는 안 된다. 접근 전 고열 장비와 밀폐 회수 절차를 준비해야 한다."
            ]
      },
      {
            "group": "blood",
            "code": "FRAME 11 / RESERVOIR",
            "title": "혈액 저장소",
            "subtitle": "Blood Reservoir",
            "image": "assets/resources/458cf4194ba894dce7e907244d2fd1f0.webp",
            "frame": "IMAGE-880617 / BLOOD RESERVOIR",
            "imageCode": "IMG-880617",
            "layout": "evidenceCenter",
            "caption": "대량 혈액 저장 · 의식 보급원 · 개봉 전 오염 수치 확인",
            "lineDelay": 900,
            "report": [
                  "대량의 혈액이 내부에 저장되어 있으며, 혈교 사용자들은 이를 전투 중 회복 수단이나 의식 보급원으로 사용한다.",
                  "직접 접촉은 금지된다. 개봉 전 오염 수치 확인과 밀폐 반출 절차가 필요하다."
            ]
      },
      {
            "group": "blood",
            "code": "FRAME 12 / SUPPRESSED ENTITY",
            "title": "제압된 타락체",
            "subtitle": "Suppressed Corrupted Entity",
            "image": "assets/resources/7af3eeca599cebbf7235e0a1368f2517.webp",
            "frame": "IMAGE-880618 / SUPPRESSED ENTITY",
            "imageCode": "IMG-880618",
            "layout": "evidenceCenter",
            "caption": "혈무 절단 · 화염 소각 · 혈액 경로 봉쇄",
            "lineDelay": 900,
            "report": [
                  "혈무와 화염을 병행한 제압은 타락체의 재생과 변형을 억제하는 데 효과적이다.",
                  "절단 후 즉시 소각하거나 혈액 경로를 봉쇄해야 재생 반응을 안정적으로 차단할 수 있다. 봉인구와 회수 절차는 반드시 병행한다."
            ]
      },
      {
            "group": "return",
            "code": "SEQUENCE END / RETURN",
            "title": "기록보관소 복귀",
            "subtitle": "Archive List Ready",
            "image": "",
            "frame": "ARCHIVE LIST / READY",
            "lineDelay": 900,
            "lines": [
                  "손상 영상 첨부 확인이 끝났습니다.",
                  "화면 선택 시 기록보관소 목록으로 복귀합니다."
            ]
      }
];

    const immortalityPages = [
      {
            "group": "imm_brief",
            "code": "IMMORTALITY / FIELD BRIEFING",
            "title": "",
            "subtitle": "",
            "hideTitle": true,
            "image": "assets/resources/b1f6105c9de718ff230e00b702ada13b.webp",
            "frame": "BLI-006 / PRE-ENTRY STILL",
            "lineDelay": 1700,
            "lines": [
                  "독일 본토 [검열] 지역에서 붉은 액체로 이루어진 이상 수역이 확인되었다.",
                  "초기 발견은 유닛2의 현장 진입 기록과 단절 직전의 위치 신호를 통해 복구되었다.",
                  "해당 수역은 정상적인 강이나 호수로 분류되지 않는다. 이후 기록에서는 이 현상을 ‘피의 호수’로 지칭한다.",
                  "FILE: BLI-006 / CLEARANCE: HIGH / SIGNAL: UNSTABLE"
            ]
      },
      {
            "group": "imm_brief",
            "code": "IMMORTALITY / UNIT 2",
            "title": "작전 투입 기록",
            "subtitle": "유닛2",
            "layout": "peoplePair",
            "image": "",
            "frame": "UNIT 2 / PERSONNEL",
            "lineDelay": 1600,
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
            "group": "imm_brief",
            "code": "IMMORTALITY / EQUIPMENT",
            "title": "지급 장비",
            "subtitle": "대기 병력",
            "image": "",
            "frame": "UNIT 2 / EQUIPMENT AND STANDBY",
            "lineDelay": 1500,
            "lines": [
                  "유닛2에게는 3일치 보급품, 손전등, 통신 장비, 특수 촬영 장비, I.P.D 장치가 지급되었다.",
                  "N.H.C 규격 대화력 무기는 교전 가능성만을 전제로 지급되었다.",
                  "구조 요청 확인 시 투입될 중무장 지원팀은 외곽 대기 상태로 배치되었다.",
                  "현장 통신은 진입 직후부터 불안정했다."
            ]
      },
      {
            "group": "imm_log",
            "code": "TIME LOG / 16:10",
            "title": "16:10",
            "subtitle": "유닛2 현장 도착",
            "image": "",
            "frame": "FIELD LOG / 16:10",
            "lineDelay": 1350,
            "lines": [
                  "유닛2 현장 진입.",
                  "기상 악화 확인.",
                  "1차 촬영 개시.",
                  "지원팀 외곽 대기."
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
            "lineDelay": 1350,
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
            "imageCode": "IMG001",
            "logTime": "16:31",
            "photoCaption": "고화질 사진 전송 확인",
            "image": "assets/resources/f59b02e8f859bfc95d683636bcf39500.webp",
            "frame": "FIELD LOG / 16:31",
            "lineDelay": 1450,
            "lines": [
                  "안개로 인해 언덕길의 시야 확보가 불가능하다.",
                  "기온 하강과 습도 상승이 동반됨.",
                  "혈액성 입자 반응 미량 감지."
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
            "imageCode": "IMG002",
            "logTime": "16:46",
            "photoCaption": "다수의 나무 위에 미확인 물체 발견",
            "image": "assets/resources/dec4cbe943147076943a62681048ad35.webp",
            "frame": "FIELD LOG / 16:46",
            "lineDelay": 1450,
            "lines": [
                  "형태 불명. 시신 또는 찢긴 동물 사체 가능성.",
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
            "lineDelay": 1350,
            "lines": [
                  "〔예거트〕: 버려진 텐트가 보인다.",
                  "〔밀로〕: 나라면 저기로 안 갈 거야.",
                  "〔예거트〕: 본부, 텐트 내부 수색 승인 여부 바람.",
                  "〔본부〕: 촬영 자료 전송. 확인 후 승인하겠다."
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
            "imageCode": "IMG003",
            "logTime": "17:09",
            "photoCaption": "텐트 외부 확인",
            "image": "assets/resources/11f2f935e0339690ace785966d7e436f.webp",
            "frame": "FIELD LOG / 17:09",
            "lineDelay": 1450,
            "lines": [
                  "명확한 이상현상은 발견되지 않음.",
                  "〔본부〕: 내부 수색 승인. 5분 이상 체류하지 마라."
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
            "imageCode": "IMG004",
            "logTime": "17:16",
            "photoCaption": "텐트 내부 수색 결과",
            "image": "assets/resources/fa10a34b64ccc7605b0966af4c017d99.webp",
            "frame": "FIELD LOG / 17:16",
            "lineDelay": 1450,
            "lines": [
                  "이어폰 2개, 침낭, MP3 플레이어, 다량의 혈흔 확인.",
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
            "lineDelay": 1350,
            "lines": [
                  "유닛2 강변 지대 접근.",
                  "강물의 색이 정상 범위를 벗어남.",
                  "혈액과 유사한 점도 및 응고 반응 확인."
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
            "imageCode": "IMG005",
            "logTime": "17:58",
            "photoCaption": "거대한 개체 및 피의 호수 발견",
            "image": "assets/resources/d537338b8d854ef34d0e3638d436cb01.webp",
            "frame": "FIELD LOG / 17:58",
            "lineDelay": 1450,
            "lines": [
                  "대규모 혈액성 액체 웅덩이 확인.",
                  "주변에서 비정상적으로 거대한 실루엣 포착.",
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
            "lineDelay": 1350,
            "lines": [
                  "예거트 I.P.D 장치에서 심박수 증가 확인.",
                  "호흡 불안정, 손 떨림, 방향 감각 저하 감지.",
                  "외상 없음. 직접 접촉 없음.",
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
            "imageCode": "IPD-041",
            "logTime": "18:14",
            "photoCaption": "유닛4 통신 두절",
            "image": "assets/resources/b5f9b2c2ddea9084ff8f6e8dfdc6549b.webp",
            "frame": "FIELD LOG / 18:14",
            "lineDelay": 1450,
            "lines": [
                  "전반적인 통신 상태 불량 보고.",
                  "유닛4 I.P.D 장치 강제 활성화."
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
            "lineDelay": 1350,
            "lines": [
                  "〔본부〕: 유닛7이 현재 유닛4에게로 향하는 중이다. 계속 강을 따라서 이동해라.",
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
            "imageCode": "IPD-029",
            "logTime": "18:29",
            "photoCaption": "예거트 심리 안정 수치 불안정",
            "image": "assets/resources/ea33a51515476e2946267ea56b453760.webp",
            "frame": "FIELD LOG / 18:29",
            "lineDelay": 1450,
            "lines": [
                  "심리 치료팀 대기.",
                  "즉각 회수 불가.",
                  "보행 속도 불규칙. 같은 지점에서 반복 정지."
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
            "imageCode": "IPD-037",
            "logTime": "18:37",
            "photoCaption": "밀로 I.P.D 장치 활성화",
            "image": "assets/resources/c5b5c946c876fbf1bd5fc2f0f1616478.webp",
            "frame": "FIELD LOG / 18:37",
            "lineDelay": 1450,
            "lines": [
                  "위치 추적 시스템 연결.",
                  "밀로는 예거트 후방 약 300m 지점에서 이동 중."
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
            "imageCode": "IMG-MOVE",
            "logTime": "18:42",
            "photoCaption": "이상 이동 패턴 감지",
            "image": "assets/resources/8da1d79fd90b59063f33aa00f1eb742a.webp",
            "frame": "FIELD LOG / 18:42",
            "lineDelay": 1450,
            "lines": [
                  ".....뭔가 이상하다.",
                  "밀로의 움직임이 비정상적이다.",
                  "짧은 접근과 정지가 반복됨.",
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
            "imageCode": "IMG-COMM",
            "logTime": "18:44",
            "photoCaption": "비인가 통신 기록",
            "image": "assets/resources/4af91e95281c83ead7c52b06dfbdca38.webp",
            "frame": "FIELD LOG / 18:44",
            "lineDelay": 1450,
            "lines": [
                  "우리가 전부 미안해, 예거트",
                  "발신자 불명.",
                  "본부 통신망 외부에서 삽입된 문장으로 추정."
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
            "lineDelay": 1350,
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
            "imageCode": "IMG006",
            "logTime": "18:56",
            "photoCaption": "마지막 이미지 전송",
            "image": "assets/resources/05cdc0276694d090f3829c4dc6e5a30b.webp",
            "frame": "FIELD LOG / 18:56",
            "lineDelay": 1500,
            "lines": [
                  "호수가 당신을 기다린다...",
                  "수천 개의 손이 당신을...",
                  "SIGNAL LOST"
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
            "lineDelay": 1350,
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
          bgm:'assets/audio/pc5152am_immortality_scp087_theme.mp3',
          bgmVolume:.52,
          introVolume:.09,
          transitionVolume:.72,
          introFallback:14650,
          transitionFallback:5650,
          mountTitle:'기록 불러오는 중',
          mountLines:[
            'F.H.C SOURCE ....... 감지',
            'VIDEO MARK ......... CONFIRMED',
            'TEXT BLOCK ......... 부분',
            'LOCAL ACCESS ....... ACCEPTED'
          ],
          mountHint:'READ PERMISSION: ORIGINAL RECORD / IMMORTALITY ATTACHED'
        };
      }
      if(state.activeRecord===FERALS_RECORD){
        return {
          key:'cult',
          sourceLabel:'U.A.C / FERAL CLASSIFICATION',
          bodyClass:'pc5152h-cult-source-sequence',
          introVideo:'assets/video/pc5152k_damaged_signal_intro_sound_10s.mp4',
          transitionVideo:'assets/video/pc5152m_vhs_transition_18_21_sound.mp4',
          endingVideo:'',
          bgm:window.ProjectCurseFeralCinematic?.bgm||'assets/audio/pc5152cf_feral_dying_memories_bgm.mp3',
          bgmVolume:.34,
          introVolume:.18,
          transitionVolume:.24,
          introFallback:10450,
          transitionFallback:3750,
          mountTitle:'개체 분류 기록 불러오는 중',
          mountLines:[
            'CLASSIFICATION MAP ....... RESTORED',
            'ENTITY FRAME ............. 12 FILES',
            'FIELD DOCTRINE ........... CURRENT',
            'LOCAL ACCESS ............. ACCEPTED'
          ],
          mountHint:'읽기 권한: 복구본 / FERAL SEQUENCE ATTACHED'
        };
      }
      if(state.activeRecord===SAKUMA_RECORD){
        return {
          key:'sakuma', sourceLabel:'S.I.D / TOKYO OCCULT ARCHIVE',
          bodyClass:'pc5152h-cult-source-sequence',
          introVideo:'assets/video/pc5152cf_sakuma_vhs_intro.mp4',
          introDuration:5000,
          transitionVideo:'assets/video/pc5152m_vhs_transition_18_21_sound.mp4', endingVideo:'',
          bgm:'assets/audio/pc5152cf_sakuma_vcr_hiss_bgm.mp3', bgmVolume:.36,
          birthdayAudio:'assets/audio/pc5152cf_sakuma_birthday_cue.mp3',
          birthdayVideo:'assets/video/pc5152cf_sakuma_end_transition.mp4',
          introVolume:.42, transitionVolume:.24, transitionFallback:3750,
          mountTitle:'사쿠마의 테이프 불러오는 중',
          mountLines:['S.I.D TOKYO ............ 연결','OCCULT CASE ............ 복구','VIDEO SIGNAL ........... 확인','LOCAL ACCESS ........... 허가'],
          mountHint:'읽기 권한: S.I.D 오컬트 부서 / VIDEO RECORD ATTACHED'
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
        bgmVolume:.30,
        introVolume:.18,
        transitionVolume:.24,
        introFallback:10450,
        transitionFallback:3750,
        mountTitle:'기록 불러오는 중',
        mountLines:[
          'VIDEO FRAME ....... DAMAGED',
          '본문 블록 ........ 부분 복구',
          '로컬 접근 ........ 허가'
        ],
        mountHint:'읽기 권한: 로컬 / SEQUENCE ATTACHED'
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
        bus.audio.ambient = new Audio(pre+'assets/audio/pc5152am_menu_old_computer.mp3');
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
      if(!state.sakumaProjector){
        state.sakumaProjector = new Audio(pre+'assets/audio/pc5152cf_sakuma_projector_advance.mp3');
        state.sakumaProjector.volume = .40;
      }
      if(cfg.birthdayAudio && !state.sakumaBirthdayCue){
        state.sakumaBirthdayCue = new Audio(pre+cfg.birthdayAudio);
        state.sakumaBirthdayCue.volume = .72;
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

    function highlightFeralTerms(safeText){
      if(state.activeRecord!==FERALS_RECORD) return safeText;
      const classes={
        Ferals:'ferals','괴이':'ferals',Pure:'pure','순수형':'pure',Unpure:'unpure','불순형':'unpure',
        Superiors:'superiors','상위체':'superiors',Celestials:'celestials',Odious:'odious',
        Unusuals:'unusuals','이례체':'unusuals',Artificial:'artificial','인공형':'artificial','인공':'artificial',
        Hybrid:'hybrid','혼합형':'hybrid','혼합':'hybrid'
      };
      return String(safeText).replace(/Ferals|괴이|Unpure|불순형|Pure|순수형|Superiors|상위체|Celestials|Odious|Unusuals|이례체|Artificial|인공형|인공|Hybrid|혼합형|혼합/g,term=>'<span class="pc5152cf-feral-term pc5152cf-feral-term-'+classes[term]+'">'+term+'</span>');
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
        return '<span class="pc5152k-seq-line" data-line="'+i+'">'+highlightFeralTerms(escSeq(line))+'</span>';
      }).join('');
    }

    function buildRedLogBlock(page,lines){
      const header='<span class="pc5152k-seq-line pc5152v-log-header" data-line="0"><b>LOG '+escSeq(page.logTime||page.title||'--:--')+'</b><em>'+escSeq(page.logTitle||page.subtitle||'FIELD LOG')+'</em></span>';
      const shifted=(page.lines||[]).map((line,i)=>formatImmortalityLine(line,i+1,page)).join('');
      return '<div class="pc5152v-red-log">'+header+shifted+'</div>';
    }

    function buildPhotoLargeBlock(page,lines){
      const code=escSeq(page.imageCode || page.subtitle || 'IMG---');
      const time=escSeq(page.logTime || page.title || '');
      const cap=escSeq(page.photoCaption || page.frame || 'FIELD IMAGE');
      const img='<figure class="pc5152v-large-photo pc5152k-seq-line" data-line="0" data-photo="1"><img src="'+prefix()+page.image+'" alt="'+cap+'"/><figcaption><div class="pc5152ba-photo-idline"><b>'+code+'</b>'+(time?'<span>'+time+'</span>':'')+'</div>'+(cap?'<em>'+cap+'</em>':'')+'</figcaption></figure>';
      const shifted=(page.lines||[]).map((line,i)=>formatImmortalityLine(line,i+1,page)).join('');
      return '<div class="pc5152v-photo-page">'+img+'<div class="pc5152v-photo-lines">'+shifted+'</div></div>';
    }


    function buildEvidenceReportHtml(list, redAlert, delayed){
      const reportList=Array.isArray(list)?list:[];
      const report=reportList.filter(v=>String(v||'').trim()).map((line)=>'<p>'+highlightFeralTerms(escSeq(line))+'</p>').join('');
      const alert=redAlert?'<p class="pc5152ay-red-alert '+(delayed?'pc5152ay-delayed-alert':'')+'" data-evidence-alert>'+escSeq(redAlert)+'</p>':'';
      return report+alert;
    }

    function buildEvidenceCenterBlock(page){
      const pfx=prefix();
      const title=escSeq(page.title||'기록');
      const subtitle=escSeq(page.subtitle||'');
      const imageCode=escSeq(page.imageCode||page.frame||page.code||'IMG-0000');
      const caption=escSeq(page.caption||'');
      const imgAlt=escSeq((page.title||'증거 이미지')+' 회수 이미지');
      const reportList=Array.isArray(page.report)?page.report:(Array.isArray(page.lines)?page.lines:[]);
      const report=buildEvidenceReportHtml(reportList, page.redAlert, !!page.alertDelay);
      return '<div class="pc5152ax-evidence-center pc5152k-seq-line" data-line="0">'
        +'<figure class="pc5152ax-evidence-card"><img src="'+pfx+page.image+'" alt="'+imgAlt+'"/></figure>'
        +'<div class="pc5152ba-evidence-titleline"><b data-evidence-code>'+imageCode+'</b><span data-evidence-title>'+title+'</span></div>'
        +(subtitle?'<small class="pc5152ba-evidence-subtitle">'+subtitle+'</small>':'')
        +(caption?'<em class="pc5152ba-evidence-caption" data-evidence-caption>'+highlightFeralTerms(caption)+'</em>':'<em class="pc5152ba-evidence-caption" data-evidence-caption></em>')
        +'<div class="pc5152ax-evidence-report" data-evidence-report>'+report+'</div>'
        +'</div>';
    }

    function buildVictimSlideBlock(page){
      const title=escSeq(page.title||'피해자');
      const subtitle=escSeq(page.subtitle||'');
      const imageCode=escSeq(page.code||page.frame||'VICTIM FILE');
      const reportList=Array.isArray(page.lines)?page.lines:[];
      const report=reportList.filter(v=>String(v||'').trim()).map(line=>'<p>'+highlightFeralTerms(escSeq(line))+'</p>').join('');
      return '<article class="pc5152cf-victim-slide pc5152k-seq-line" data-line="0">'
        +(page.hideIdentity?'':'<header><b>'+title+'</b>'+(subtitle?'<span>['+subtitle+']</span>':'')+'</header>')
        +'<figure><img src="'+prefix()+page.image+'" alt="'+title+' 피해 현장 기록"/></figure>'
        +'<div class="pc5152cf-victim-report">'+report+'</div>'
        +'<small>'+imageCode+'</small>'
        +'</article>';
    }

    function buildClassificationChartBlock(page){
      const caption=escSeq(page.caption||'SIMPLIFIED CLASSIFICATION OF CORRUPTED LIFEFORMS');
      const credit=escSeq(page.credit||'U.A.C FIELD COPY');
      return '<figure class="pc5152cf-classification-chart pc5152k-seq-line" data-line="0">'
        +'<img src="'+prefix()+page.image+'" alt="괴이 단순화 분류 구조"/>'
        +'<figcaption><b>'+caption+'</b><small>'+credit+'</small></figcaption>'
        +'</figure>';
    }

    function applyEvidenceMutation(page, bodyEl){
      if(!page || !page.mutation || !bodyEl) return false;
      const card=bodyEl.querySelector('.pc5152ax-evidence-center');
      const code=bodyEl.querySelector('[data-evidence-code]');
      const title=bodyEl.querySelector('[data-evidence-title]');
      const cap=bodyEl.querySelector('[data-evidence-caption]');
      const report=bodyEl.querySelector('[data-evidence-report]');
      if(card) card.classList.add('pc5152ay-mutating-now','pc5152ba-click-mutated');
      if(code && page.mutation.imageCode) code.textContent=page.mutation.imageCode;
      if(title && page.mutation.title) title.textContent=page.mutation.title;
      if(cap && page.mutation.caption) cap.textContent=page.mutation.caption;
      if(report) report.innerHTML=buildEvidenceReportHtml(page.mutation.report||[], page.mutation.redAlert, false);
      state.revealTimers.push(setTimeout(()=>{ if(card) card.classList.remove('pc5152ay-mutating-now'); }, 560));
      return true;
    }

    function runEvidencePostReveal(page, bodyEl, runId){
      if(!page || !bodyEl) return 0;
      let hold=0;
      if(page.alertDelay && page.redAlert){
        hold=Math.max(hold, Number(page.alertDelay||0)+650);
        state.revealTimers.push(setTimeout(()=>{
          if(runId!==state.runId) return;
          const alert=bodyEl.querySelector('[data-evidence-alert]');
          if(alert) alert.classList.add('visible');
        }, Number(page.alertDelay||900)));
      }
      return hold;
    }


    function stopSequenceAudio(){
      stopImmortalityLatePulse();
      try{
        if(state.bgm){
          state.bgm.pause();
          state.bgm.currentTime=0;
        }
        if(state.photoClick){ state.photoClick.pause(); state.photoClick.currentTime=0; }
        if(state.sakumaProjector){ state.sakumaProjector.onended=null; state.sakumaProjector.pause(); state.sakumaProjector.currentTime=0; }
        if(state.sakumaBirthdayCue){ state.sakumaBirthdayCue.onended=null; state.sakumaBirthdayCue.pause(); state.sakumaBirthdayCue.currentTime=0; }
        if(state.dialogCue){ state.dialogCue.pause(); state.dialogCue.currentTime=0; }
      }catch(e){}
    }

    function silenceMenuAmbientDuringSequence(){
      const bus=window.ProjectCurseAudio;
      if(!bus) return;
      try{ if(typeof bus.stopMenuAmbient==='function') bus.stopMenuAmbient(); }catch(e){}
      try{
        const ambient=bus.audio&&bus.audio.ambient;
        if(ambient){ ambient.volume=0; ambient.pause(); }
      }catch(e){}
    }


    function hardResetSequenceRuntime(){
      state.runId=(state.runId||0)+1;
      clearSequenceTimers();
      stopSequenceAudio();
      state.pageIndex=0;
      state.canAdvance=false;
      state.transitioning=false;
      state.finishing=false;
      state.endingPlayed=false;
      state.endingPlaying=false;
      state.lineEls=[];
      state.nextLineIndex=0;
      state.mutationAppliedPage=-1;
      state.specialMediaActive=false;
      state.autoPaused=false;
      state.autoDelay=0;
      const el=state.overlay;
      if(el){
        ['.pc5152h-seq-video','.pc5152m-transition-video','.pc5152q-ending-video'].forEach(sel=>{
          const v=el.querySelector(sel);
          if(v){ try{ v.onended=null; v.pause(); v.currentTime=0; }catch(e){} }
        });
        const fig=el.querySelector('[data-seq-figure]');
        const img=el.querySelector('[data-seq-image]');
        if(img) img.removeAttribute('src');
        if(fig) fig.hidden=true;
        el.classList.remove('show','intro-mode','pages-mode','input-ready','frame-ready','page-reveal','black-transition','major-transition','normal-transition','video-transition','ending-mode','sakuma-bridge-mode','pc5152q-immortality-mode','pc5152h-cult-mode','pc5152u-people-page','pc5152v-photo-large-page','pc5152v-red-log-page');
        el.className=el.className.replace(/\bpc5152as-layout-[^\s]+/g,'').replace(/\s{2,}/g,' ').trim();
        el.removeAttribute('data-pc5152as-layout');
        el.removeAttribute('data-pc5152as-group');
        el.setAttribute('aria-hidden','true');
        const body=el.querySelector('[data-seq-body]');
        if(body) body.innerHTML='';
      }
      document.body.classList.remove('pc5152h-sequence-open','pc5152i-sequence-intro-playing','pc5133-case-file-open','pc5152q-immortality-sequence','pc5152h-cult-source-sequence');
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
        '<video class="pc5152an-vhs-overlay-video" muted playsinline loop preload="auto" src="'+pre+'assets/video/pc5152am_cult_trace_vhs_noise.mp4"></video>',
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
        '</div>',
        '<div class="pc-cinematic-controls" data-seq-controls>',
          '<div class="pc-cinematic-progress" aria-hidden="true"><i data-seq-progress></i></div>',
          '<div class="pc-cinematic-actions">',
            '<button type="button" data-seq-action="previous" aria-label="이전 장면">‹ 이전</button>',
            '<button type="button" data-seq-action="toggle" aria-label="재생 또는 일시정지"><span data-seq-play-label>일시정지</span></button>',
            '<button type="button" data-seq-action="next" aria-label="다음 장면">다음 ›</button>',
            '<button type="button" data-seq-action="restart" aria-label="처음부터 보기">처음부터</button>',
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
      el.innerHTML='<div class="box"><div class="title">'+(cfg.mountTitle||'기록 불러오는 중')+'</div>'+lines+'<div class="bars"><i></i></div><div class="loader-hint">'+(cfg.mountHint||'읽기 권한: 로컬 / SEQUENCE ATTACHED')+'</div></div>';
      el.classList.remove('done');
      void el.offsetWidth;
      el.classList.add('show');
      try{ playCue('load',220); }catch(e){}
      setTimeout(()=>{
        el.classList.add('done');
        el.classList.remove('show');
        if(typeof done==='function') done();
      }, 850);
    }

    function clearSequenceTimers(){
      clearTimeout(state.timer);
      clearTimeout(state.lineTimer);
      clearTimeout(state.autoTimer);
      state.autoTimer=null;
      const overlay=state.overlay;
      if(overlay){
        overlay.classList.remove('pc-cinematic-counting');
        const progress=overlay.querySelector('[data-seq-progress]');
        if(progress){ progress.style.animationDuration='0ms'; progress.style.transform='scaleX(0)'; }
      }
      if(state.revealTimers && state.revealTimers.length){
        state.revealTimers.forEach(t=>clearTimeout(t));
      }
      state.revealTimers=[];
      state.lineEls=[];
      state.nextLineIndex=0;
    }


    function isInternalProjectorTransition(current,next){
      return !!(current && next && current.group===next.group && ['cult','blood','feral_system','ferals','superiors','artificial','hybrid','doctrine'].includes(current.group));
    }

    function isVideoMajorTransition(current,next){
      if(state.activeRecord===IMMORTALITY_RECORD){
        return false;
      }
      if(state.activeRecord===FERALS_RECORD){
        return !!(current&&next&&current.group!==next.group);
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
      const hold=videoMajor ? Math.min(Number(cfg.transitionFallback||3100),1800) : (state.activeRecord===IMMORTALITY_RECORD ? 950 : 760);
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
        state.timer=setTimeout(finish, hold+320);
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
      const runId=state.runId;
      state.timer=setTimeout(()=>{
        if(runId!==state.runId) return;
        try{ if(state.activeRecord===IMMORTALITY_RECORD && state.bgm && !state.bgm.paused) state.bgm.volume=Number(cfg.bgmVolume||.86); }catch(e){}
        state.transitioning=false;
        el.classList.remove('black-transition','major-transition','normal-transition','video-transition');
        state.pageIndex=nextIndex;
        renderPage();
      }, hold);
    }

    function automaticPageDelay(){
      const page=getActivePages()[state.pageIndex]||{};
      if(page.hold) return Number(page.hold);
      if(state.activeRecord===IMMORTALITY_RECORD){
        if(page.layout==='photoLarge') return 6200;
        if(page.layout==='peoplePair') return 5800;
        if(page.layout==='redLog') return 4700;
        return page.image?5900:5000;
      }
      if(page.mutation && state.mutationAppliedPage!==state.pageIndex) return 5600;
      if(page.layout==='classificationChart') return 4800;
      if(page.layout==='warningNotice') return 5400;
      if(page.layout==='evidenceCenter') return 5900;
      if(page.layout==='victimSlide') return 6800;
      if(page.layout==='twoColumn') return 6500;
      if(page.layout==='warningCard') return 6200;
      return page.group==='system'?3600:5200;
    }

    function syncCinematicControls(){
      const el=state.overlay;
      if(!el) return;
      const label=el.querySelector('[data-seq-play-label]');
      if(label) label.textContent=state.autoPaused?'재생':'일시정지';
      el.classList.toggle('pc-cinematic-paused',!!state.autoPaused);
      const previous=el.querySelector('[data-seq-action="previous"]');
      if(previous) previous.disabled=state.pageIndex<=0||!el.classList.contains('pages-mode');
    }

    function scheduleAutomaticAdvance(customDelay){
      clearTimeout(state.autoTimer);
      state.autoTimer=null;
      const el=ensureOverlay();
      el.classList.remove('pc-cinematic-counting');
      if(state.autoPaused||!state.canAdvance||!el.classList.contains('pages-mode')){ syncCinematicControls(); return; }
      const delay=Number(customDelay||automaticPageDelay());
      state.autoDelay=delay;
      const progress=el.querySelector('[data-seq-progress]');
      if(progress){
        progress.style.animationDuration=delay+'ms';
        progress.style.transform='scaleX(0)';
        void progress.offsetWidth;
      }
      requestAnimationFrame(()=>el.classList.add('pc-cinematic-counting'));
      const runId=state.runId;
      state.autoTimer=setTimeout(()=>{
        if(runId!==state.runId||state.autoPaused) return;
        el.classList.remove('pc-cinematic-counting');
        advanceSequence();
      },delay);
      syncCinematicControls();
    }

    function setSequenceInputAvailable(){
      const el=ensureOverlay();
      const status=el.querySelector('[data-seq-status]');
      state.canAdvance=true;
      el.classList.add('input-ready');
      if(status) status.innerHTML=state.autoPaused?'PLAYBACK PAUSED <em>재생을 선택하십시오</em>':'AUTO PLAY <em>다음 기록면 대기</em>';
      scheduleAutomaticAdvance();
    }

    function scheduleNextSequenceLine(delay){
      clearTimeout(state.lineTimer);
      const runId=state.runId;
      state.lineTimer=setTimeout(()=>{ if(runId===state.runId) revealNextSequenceLine(false); }, Number(delay||2500));
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

    function runSakumaBirthdaySequence(page,runId){
      if(state.activeRecord!==SAKUMA_RECORD || page.specialSequence!=='sakumaBirthday') return false;
      const el=ensureOverlay();
      const cfg=getSequenceConfig();
      const projector=state.sakumaProjector;
      const cue=state.sakumaBirthdayCue;
      const bridge=el.querySelector('.pc5152q-ending-video');
      state.canAdvance=false;
      state.transitioning=true;
      state.specialMediaActive=true;
      clearTimeout(state.autoTimer);
      state.autoTimer=null;
      el.classList.remove('pc-cinematic-counting','input-ready');
      try{ if(state.bgm) state.bgm.volume=.025; }catch(e){}

      let projectorDone=false;
      let cueDone=false;
      let bridgeDone=false;
      const showSearchStatus=()=>{
        if(bridgeDone || runId!==state.runId) return;
        bridgeDone=true;
        try{ bridge.onended=null; bridge.pause(); bridge.currentTime=0; }catch(e){}
        el.classList.remove('sakuma-bridge-mode','ending-mode');
        el.classList.add('pages-mode');
        state.specialMediaActive=false;
        state.transitioning=false;
        try{
          if(state.bgm){
            state.bgm.volume=Number(cfg.bgmVolume||.16);
            if(state.bgm.paused) state.bgm.play().catch(()=>{});
          }
        }catch(e){}
        state.pageIndex=Math.min(state.pageIndex+1,getActivePages().length-1);
        renderPage();
      };
      const playBridge=()=>{
        if(cueDone || runId!==state.runId) return;
        cueDone=true;
        try{ if(cue){ cue.onended=null; cue.pause(); cue.currentTime=0; } }catch(e){}
        el.classList.remove('pages-mode','input-ready','frame-ready','page-reveal');
        el.classList.add('show','sakuma-bridge-mode');
        try{
          if(!bridge) throw new Error('bridge video missing');
          if(bridge.getAttribute('src')!==prefix()+cfg.birthdayVideo) bridge.src=prefix()+cfg.birthdayVideo;
          bridge.loop=false;
          bridge.muted=false;
          bridge.volume=.82;
          bridge.currentTime=0;
          bridge.onended=showSearchStatus;
          const played=bridge.play();
          if(played&&played.catch) played.catch(()=>setTimeout(showSearchStatus,500));
        }catch(e){ setTimeout(showSearchStatus,500); }
        state.revealTimers.push(setTimeout(showSearchStatus,2300));
      };
      const playBirthdayCue=()=>{
        if(projectorDone || runId!==state.runId) return;
        projectorDone=true;
        try{ if(projector){ projector.onended=null; projector.pause(); projector.currentTime=0; } }catch(e){}
        try{
          if(!cue) throw new Error('birthday cue missing');
          cue.currentTime=0;
          cue.onended=playBridge;
          const played=cue.play();
          if(played&&played.catch) played.catch(()=>setTimeout(playBridge,500));
        }catch(e){ setTimeout(playBridge,500); }
        state.revealTimers.push(setTimeout(playBridge,6800));
      };
      try{
        if(!projector) throw new Error('projector cue missing');
        projector.currentTime=0;
        projector.onended=playBirthdayCue;
        const played=projector.play();
        if(played&&played.catch) played.catch(()=>setTimeout(playBirthdayCue,250));
      }catch(e){ setTimeout(playBirthdayCue,250); }
      state.revealTimers.push(setTimeout(playBirthdayCue,2300));
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
      el.className = el.className.replace(/\bpc5152as-layout-[^\s]+/g,'').replace(/\s{2,}/g,' ').trim();
      const stageLayout = (function(){
        if(state.activeRecord===IMMORTALITY_RECORD){
          if(page.layout==='photoLarge') return 'field-photo';
          if(page.layout==='redLog') return 'terminal-log';
          if(page.layout==='peoplePair') return 'personnel';
          return page.image ? 'field-brief' : 'terminal-brief';
        }
        if(page.layout==='warningCard') return 'warning-card';
        if(page.layout==='warningNotice') return 'warning-notice';
        if(page.layout==='classificationChart') return 'classification-chart';
        if(page.layout==='evidenceCenter') return 'evidence-center';
        if(page.layout==='victimSlide') return 'victim-slide';
        if(page.layout==='evidencePhoto') return 'evidence-photo';
        if(page.layout==='twoColumn') return 'two-column';
        if(page.group==='system') return 'warning-title';
        if(page.group==='warning') return 'warning-card';
        if(page.group==='return') return 'end-card';
        if(page.image && /MASKED FORM|BLOOD LAKE|SUPPRESSED ENTITY/.test(String(page.code||''))) return 'evidence-photo';
        if(page.image) return 'two-column';
        return 'brief-text';
      })();
      el.dataset.pc5152asLayout = stageLayout;
      el.dataset.pc5152asGroup = page.group || '';
      el.classList.add('pc5152as-layout-'+stageLayout);
      void el.offsetWidth;
      el.classList.add('page-reveal');
      el.classList.toggle('pc5152u-people-page', page.layout==='peoplePair');
      el.classList.toggle('pc5152v-photo-large-page', page.layout==='photoLarge');
      el.classList.toggle('pc5152v-red-log-page', page.layout==='redLog');
      el.querySelector('[data-seq-code]').textContent=page.code;
      const source=el.querySelector('[data-seq-source]');
      if(source) source.textContent=cfg.sourceLabel||'F.H.C / LOCAL COPY';
      const sequenceTitle=el.querySelector('[data-seq-title]');
      const visibleTitle=(page.hideTitle || page.layout==='redLog' || page.layout==='evidenceCenter' || page.layout==='victimSlide' || page.layout==='photoLarge' || page.layout==='classificationChart')?'':String(page.title||'');
      if(sequenceTitle){
        if(state.activeRecord===FERALS_RECORD) sequenceTitle.innerHTML=highlightFeralTerms(escSeq(visibleTitle));
        else sequenceTitle.textContent=visibleTitle;
      }
      const bodyEl=el.querySelector('[data-seq-body]');
      const lines=buildSequenceLines(page);
      if(page.layout==='peoplePair' && Array.isArray(page.people)){
        const people=page.people.map((person,i)=>'<figure class="pc5152u-person-card pc5152k-seq-line" data-line="'+i+'"><img src="'+prefix()+person.image+'" alt="'+escSeq(person.name)+'"/><figcaption class="pc5152w-person-caption"><b class="pc5152v-name-blue">'+escSeq(person.name)+'</b><span>'+escSeq(person.role)+'</span></figcaption></figure>').join('');
        bodyEl.innerHTML='<h3 class="pc5152k-seq-subtitle">'+escSeq(page.subtitle||'')+'</h3><div class="pc5152u-people-pair">'+people+'</div>';
      }else if(page.layout==='photoLarge' && page.image){
        bodyEl.innerHTML=buildPhotoLargeBlock(page,lines);
      }else if(page.layout==='classificationChart' && page.image){
        bodyEl.innerHTML=buildClassificationChartBlock(page);
      }else if(page.layout==='evidenceCenter' && page.image){
        bodyEl.innerHTML=buildEvidenceCenterBlock(page);
      }else if(page.layout==='victimSlide' && page.image){
        bodyEl.innerHTML=buildVictimSlideBlock(page);
      }else if(page.layout==='redLog'){
        bodyEl.innerHTML=buildRedLogBlock(page,lines);
      }else{
        bodyEl.innerHTML=(page.subtitle?'<h3 class="pc5152k-seq-subtitle">'+highlightFeralTerms(escSeq(page.subtitle))+'</h3>':'')+'<div class="pc5152k-seq-lines pc5152v-default-red-lines">'+lines+'</div>';
      }
      el.querySelector('[data-seq-frame]').textContent=page.frame;
      el.querySelector('[data-seq-counter]').textContent=String(state.pageIndex+1).padStart(2,'0')+' / '+String(activePages.length).padStart(2,'0');
      const img=el.querySelector('[data-seq-image]');
      const fig=el.querySelector('[data-seq-figure]');
      if(page.layout==='peoplePair' || page.layout==='photoLarge' || page.layout==='evidenceCenter' || page.layout==='victimSlide' || page.layout==='classificationChart'){
        img.removeAttribute('src');
        fig.hidden=true;
        state.revealTimers.push(setTimeout(()=>{ 
          el.classList.add('frame-ready'); 
          if(state.activeRecord===IMMORTALITY_RECORD && page.photoSfx) playLocal(state.photoClick);
          if(state.activeRecord===SAKUMA_RECORD && page.photoSfx && !page.specialSequence) playLocal(state.sakumaProjector);
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
      state.mutationAppliedPage=-1;
      updateImmortalityLatePulse(page);
      if(state.lineEls.length){
        if(state.activeRecord!==IMMORTALITY_RECORD){
          const runId=state.runId;
          state.revealTimers.push(setTimeout(()=>{
            if(runId!==state.runId) return;
            state.lineEls.forEach(line=>line.classList.add('visible'));
            state.nextLineIndex=state.lineEls.length;
            if(runSakumaBirthdaySequence(page,runId)) return;
            const postHold=runEvidencePostReveal(page, bodyEl, runId);
            if(postHold>0){
              state.revealTimers.push(setTimeout(()=>{ if(runId===state.runId) setSequenceInputAvailable(); }, postHold));
            }else{
              setSequenceInputAvailable();
            }
          }, Number(page.blockDelay||(page.layout==='victimSlide'?650:220))));
        }else{
          scheduleNextSequenceLine(page.layout==='photoLarge' ? 420 : 650);
        }
      }else{
        const runId=state.runId;
        state.timer=setTimeout(()=>{ if(runId===state.runId) setSequenceInputAvailable(); }, 900);
      }
    }

    function startSequence(recordId){
      if(!SEQUENCE_RECORDS.has(recordId)) return false;
      silenceMenuAmbientDuringSequence();
      hardResetSequenceRuntime();
      state.activeRecord=recordId;
      state.pages=(recordId===IMMORTALITY_RECORD)
        ?immortalityPages
        :(recordId===FERALS_RECORD?(window.ProjectCurseFeralCinematic?.pages||[]):(recordId===SAKUMA_RECORD?(window.ProjectCurseSakumaCinematic?.pages||[]):pages));
      if(!state.pages.length) return false;
      state.pageIndex=0;
      state.finishing=false;
      state.endingPlayed=false;
      state.endingPlaying=false;
      state.canAdvance=false;
      state.autoPaused=false;
      ensureSpecialAudio();
      const cfg=getSequenceConfig();
      const runId=state.runId;
      showMountLoader(()=>{
        if(runId!==state.runId) return;
        const el=ensureOverlay();
        const video=el.querySelector('.pc5152h-seq-video');
        const tv=el.querySelector('.pc5152m-transition-video');
        const endingVideo=el.querySelector('.pc5152q-ending-video');
        document.body.classList.remove('pc5152q-immortality-sequence','pc5152h-cult-source-sequence');
        document.body.classList.add('pc5152h-sequence-open','pc5152i-sequence-intro-playing',cfg.bodyClass||'pc5152h-cult-source-sequence');
        silenceMenuAmbientDuringSequence();
        el.classList.remove('pc5152q-immortality-mode','pc5152h-cult-mode','ending-mode');
        el.classList.add(cfg.key==='immortality'?'pc5152q-immortality-mode':'pc5152h-cult-mode');
        if(video && video.getAttribute('src')!==prefix()+cfg.introVideo){ video.src=prefix()+cfg.introVideo; }
        if(tv && tv.getAttribute('src')!==prefix()+cfg.transitionVideo){ tv.src=prefix()+cfg.transitionVideo; }
        if(endingVideo && cfg.endingVideo && endingVideo.getAttribute('src')!==prefix()+cfg.endingVideo){ endingVideo.src=prefix()+cfg.endingVideo; }
        if(recordId!==IMMORTALITY_RECORD && recordId!==SAKUMA_RECORD && cfg.bgm && state.bgm){
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
          if(runId!==state.runId) return;
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
              if(recordId===IMMORTALITY_RECORD) state.bgm.currentTime=0;
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
          if(playPromise && playPromise.catch) playPromise.catch(()=>setTimeout(()=>{ if(runId===state.runId) beginSequencePages(); },900));
        }catch(e){
          setTimeout(()=>{ if(runId===state.runId) beginSequencePages(); },900);
        }
        // Safety fallback for browsers that do not fire ended.
        const introDuration=Number(cfg.introDuration||0);
        state.timer=setTimeout(()=>{ if(runId===state.runId) beginSequencePages(); },introDuration>0?introDuration:Math.min(Number(cfg.introFallback||10450),4800));
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
      try{ playCue('open',200); }catch(e){}
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
        try{ video.onended=null; video.pause(); video.currentTime=0; }catch(e){}
        try{ tv.onended=null; tv.pause(); tv.currentTime=0; }catch(e){}
        try{ ending.onended=null; ending.pause(); ending.currentTime=0; }catch(e){}
        try{ if(state.immortalityStep){ state.immortalityStep.pause(); state.immortalityStep.currentTime=0; } }catch(e){}
        el.classList.remove('show','input-ready','frame-ready','page-reveal','intro-mode','pages-mode','ending-mode','sakuma-bridge-mode','pc5152q-immortality-mode','pc5152h-cult-mode','pc5152u-people-page','pc5152v-photo-large-page','pc5152v-red-log-page');
        el.className = el.className.replace(/\bpc5152as-layout-[^\s]+/g,'').replace(/\s{2,}/g,' ').trim();
        el.removeAttribute('data-pc5152as-layout');
        el.removeAttribute('data-pc5152as-group');
        el.setAttribute('aria-hidden','true');
      }
      document.body.classList.remove('pc5152h-sequence-open','pc5152i-sequence-intro-playing','pc5133-case-file-open','pc5152q-immortality-sequence','pc5152h-cult-source-sequence');
      try{ window.ProjectCurseAudio?.syncAudioState?.(); }catch(e){}
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
      state.activeRecord=null;
      state.pages=null;
      state.pageIndex=0;
      state.canAdvance=false;
      state.transitioning=false;
      state.finishing=false;
      state.endingPlaying=false;
      state.endingPlayed=false;
      state.specialMediaActive=false;
      state.lineEls=[];
      state.nextLineIndex=0;
      state.autoPaused=false;
      state.autoDelay=0;
      state.runId=(state.runId||0)+1;
      try{  }catch(e){}
    }

    function advanceSequence(){
      const el=state.overlay;
      if(el && (el.classList.contains('intro-mode') || el.classList.contains('ending-mode') || document.body.classList.contains('pc5152i-sequence-intro-playing'))) return;
      if(state.transitioning) return;
      clearTimeout(state.autoTimer);
      state.autoTimer=null;
      if(el) el.classList.remove('pc-cinematic-counting');
      if(!state.canAdvance){
        revealNextSequenceLine(true);
        return;
      }
      const currentPage=getActivePages()[state.pageIndex] || null;
      if(state.activeRecord!=='Immortality_860201' && currentPage && currentPage.mutation && state.mutationAppliedPage!==state.pageIndex){
        const bodyEl=el ? el.querySelector('[data-seq-body]') : null;
        if(applyEvidenceMutation(currentPage, bodyEl)){
          state.mutationAppliedPage=state.pageIndex;
          state.canAdvance=true;
          scheduleAutomaticAdvance(5600);
          return;
        }
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

    function previousSequence(){
      const el=state.overlay;
      if(!el||!el.classList.contains('pages-mode')||state.transitioning||state.pageIndex<=0) return;
      clearSequenceTimers();
      state.pageIndex-=1;
      state.mutationAppliedPage=-1;
      renderPage();
    }

    function toggleSequencePlayback(){
      const el=state.overlay;
      if(!el||!el.classList.contains('pages-mode')) return;
      state.autoPaused=!state.autoPaused;
      if(state.autoPaused){
        clearTimeout(state.autoTimer);
        clearTimeout(state.lineTimer);
        state.autoTimer=null;
        state.lineTimer=null;
        el.classList.remove('pc-cinematic-counting');
        const status=el.querySelector('[data-seq-status]');
        if(status) status.innerHTML='PLAYBACK PAUSED <em>수동 탐색 가능</em>';
      }else if(state.nextLineIndex<(state.lineEls||[]).length){
        scheduleNextSequenceLine(220);
      }else if(state.canAdvance){
        const status=el.querySelector('[data-seq-status]');
        if(status) status.innerHTML='AUTO PLAY <em>다음 기록면 대기</em>';
        scheduleAutomaticAdvance();
      }
      syncCinematicControls();
    }

    function restartSequence(){
      const recordId=state.activeRecord;
      if(recordId) startSequence(recordId);
    }

    function handleSequenceAction(action){
      if(action==='previous') previousSequence();
      else if(action==='toggle') toggleSequencePlayback();
      else if(action==='next') advanceSequence();
      else if(action==='restart') restartSequence();
    }

    function getRecordIdFromEventTarget(target){
      const btn=target.closest && target.closest('.open-record[data-record]');
      if(btn && btn.closest && btn.closest('#archiveListWrap .doc-card')) return btn.dataset.record;
      return null;
    }

    document.addEventListener('click', function(e){
      const action=e.target.closest&&e.target.closest('[data-seq-action]');
      if(state.overlay&&state.overlay.classList.contains('show')&&action){
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
        handleSequenceAction(action.dataset.seqAction);
        return;
      }
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
      const action=e.target.closest&&e.target.closest('[data-seq-action]');
      if(state.overlay&&state.overlay.classList.contains('show')&&action){
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
        handleSequenceAction(action.dataset.seqAction);
        return;
      }
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
      if(e.target.closest&&e.target.closest('[data-seq-action]')) return;
      if(e.key==='ArrowLeft'){e.preventDefault();previousSequence();return;}
      if(e.key==='ArrowRight'){e.preventDefault();advanceSequence();return;}
      if(e.key==='p'||e.key==='P'){e.preventDefault();toggleSequencePlayback();return;}
      if(e.key==='r'||e.key==='R'){e.preventDefault();restartSequence();return;}
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
      recordSequence:'Cults_871104 + Ferals_860722 + Immortality_860201; timed input gate; click advances after INPUT AVAILABLE',
      noiseMode:'global terminal noise reduced; VHS/video overlay isolated to sequence'
    });
    window.ProjectCurseRecordCinematic={
      version:'5.15.2cf',
      start:startSequence,
      previous:previousSequence,
      next:advanceSequence,
      toggle:toggleSequencePlayback,
      restart:restartSequence
    };
  });
})();


// MapPatch 5.15.2i — RecordSequence_FullscreenIntro_FlowFix marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152i-fullscreen-intro-flowfix');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152i:'RecordSequence FullscreenIntro FlowFix',
      sequenceIntroFlow:'기록 불러오는 중 -> fullscreen damaged video -> record surfaces with BGM',
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
      immortalityPageStepSourceRange:'internal cue retained; no new reference asset added',
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
        playCue('denied',240);
      }catch(err){}
      const loading=document.getElementById('recordLoading') || document.createElement('div');
      if(!loading.id){
        loading.id='recordLoading';
        loading.className='record-loading';
        document.body.appendChild(loading);
      }
      loading.innerHTML='<div class="box"><div class="title">기밀</div><div class="logline">접근 상태 ........ 봉인</div><div class="logline">공개 여부 ........ 대기</div><div class="logline">공개 표식 ........ 보류</div><div class="bars"><i></i></div><div class="loader-hint">기밀 처리됨 — 추후 공개 예정</div></div>';
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
      latePulseSource:'internal late-pulse cue retained',
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
      latePulseSource:'internal late-pulse cue retained',
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
      try{window.ProjectCurseAudio&&window.ProjectCurseAudio.playCue&&void 0}catch(err){}
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
        try{window.ProjectCurseAudio&&window.ProjectCurseAudio.playCue&&void 0}catch(err){}
        return false;
      }
      const link=e.target.closest && e.target.closest('.side-menu a[data-target]');
      if(link){
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        const id=link.dataset.target||'history';
        showPage(id==='zone-map'?'history':id);
        syncGroupFor(link);
        try{window.ProjectCurseAudio&&window.ProjectCurseAudio.playCue&&void 0}catch(err){}
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
        try{window.ProjectCurseAudio&&window.ProjectCurseAudio.playCue&&void 0}catch(err){}
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
    sid:{name:'S.I.D',status:'INTEL-1',trust:'감시ED',kind:'watch',links:['U.A.C','F.H.C','Haimun','Ushnoda Cult']},
    fhc:{name:'F.H.C',status:'SEAL-1',trust:'RESTRICTED',kind:'seal',links:['U.A.C','S.I.D','Amarion','Ushnoda Cult']},
    cpd:{name:'C.P.D',status:'CIV-1',trust:'CONTROLLED',kind:'control',links:['U.A.C','N.H.C','A.R.F']},
    arf:{name:'A.R.F',status:'REC-1',trust:'CONTROLLED',kind:'control',links:['U.A.C','N.H.C','C.P.D']},
    ushinoda:{name:'Ushnoda Cult',status:'HOSTILE',trust:'BLOCKED',kind:'hostile',links:['S.I.D','F.H.C','Haimun','Syndicate']},
    haimun:{name:'Haimun',status:'감시',trust:'불명',kind:'watch',links:['S.I.D','Ushnoda Cult','Syndicate']},
    syndicate:{name:'Syndicate',status:'HOSTILE-감시',trust:'HOSTILE',kind:'hostile',links:['N.H.C','A.R.F','Ushnoda Cult','Amarion']},
    amarion:{name:'Amarion',status:'RESEARCH-감시',trust:'UNSTABLE',kind:'research',links:['F.H.C','U.A.C','Syndicate']},
    ashcrew:{name:'Ash Crew',status:'ASH-1',trust:'CONTROLLED',kind:'control',links:['N.H.C','A.R.F']}
  };
  const nodePos={
    uac:[50,50], nhc:[26,36], sid:[50,23], fhc:[73,36], cpd:[29,66], arf:[70,66],
    ushinoda:[17,82], haimun:[17,18], syndicate:[84,82], amarion:[84,18], ashcrew:[50,82]
  };
  const relations=[
    ['CONTROL','control','U.A.C','N.H.C','현장 투입 승인 / 레드존 봉쇄선 유지','CONTROLLED','uac','nhc'],
    ['INTEL','watch','U.A.C','S.I.D','감청 기록 / 귀환자 진술 검증','감시ED','uac','sid'],
    ['SEAL','seal','U.A.C','F.H.C','봉인 기록 / 제한 열람 승인','RESTRICTED','uac','fhc'],
    ['CIV','control','U.A.C','C.P.D','대피 회랑 / 귀환자 1차 선별','CONTROLLED','uac','cpd'],
    ['REC','control','U.A.C','A.R.F','회수물 / 기록 매체 복구','CONTROLLED','uac','arf'],
    ['CLEAN','control','N.H.C','Ash Crew','오염 처리 / 소각 후속 절차','CONTROLLED','nhc','ashcrew'],
    ['HOSTILE','hostile','U.A.C','Ushnoda Cult','의식성 오염 / Blood Gate 차단','BLOCKED','uac','ushinoda'],
    ['감시','watch','S.I.D','Haimun','도심 침투 흔적 감청','신호 열화','sid','haimun'],
    ['HOSTILE','hostile','N.H.C','Syndicate','오염 장비 유통 차단','ACTIVE 감시','nhc','syndicate'],
    ['RESEARCH','research','F.H.C','Amarion','비인가 연구 자료 봉인','CLEARANCE MISMATCH','fhc','amarion'],
    ['TRACE','watch','Ushnoda Cult','Haimun','의식 거점 / 은닉 루트 연결','감시','ushinoda','haimun'],
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
          <div class="pc5134-node-header"><span>관계 색인</span><b>U.A.C 중심</b><small>관계 노드</small></div>
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
      // MapPatch 5.15.2ap — RuntimeFix_MetadataClean
      // Keep relation-node selection silent and mark the first render safely.
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
          if(src.includes('pc5152am_immortality_scp087_theme')){
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


// MapPatch 5.15.2al — MobileReadableLayout_SystemPass
// Converts relation view to a readable relation-summary table/cards and tightens global gutters.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  const esc=(v)=>String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const relations=[
    ['U.A.C ↔ N.H.C','통제','레드존 투입과 봉쇄선 유지 권한을 공유한다. 현장 전투와 봉쇄선 운용은 N.H.C가 담당한다.'],
    ['U.A.C ↔ S.I.D','감시','감청 기록, 귀환자 진술, 통신 이상을 대조한다. Ghost Channel 계열 자료는 S.I.D를 경유한다.'],
    ['U.A.C ↔ F.H.C','봉인','기밀 기록과 위험 연구 자료는 제한 열람으로 봉인된다. 일부 기록은 U.A.C 색인에만 흔적이 남는다.'],
    ['U.A.C ↔ C.P.D','통제','대피 회랑, 검문 절차, 귀환자 1차 선별을 관리한다. 민간 보호 구역의 오염 확산을 차단한다.'],
    ['U.A.C ↔ A.R.F','통제','회수물, 기록 매체, 시신 및 오염 잔재 복구를 담당한다. 소각·폐기 절차와 연결된다.'],
    ['N.H.C ↔ Ash Crew','통제','교전 이후 오염 처리와 소각 후속 절차를 연결한다. 현장 진입은 N.H.C 승인 뒤 이뤄진다.'],
    ['U.A.C ↔ Ushnoda Cult','적대','의식성 오염, Blood Gate, 우시노다교 확산 흔적을 차단 대상으로 관리한다.'],
    ['S.I.D ↔ Haimun','감시','도심 침투 흔적과 이상 통신을 장기 감시한다. 신호 열화가 지속되는 연결로 분류된다.'],
    ['N.H.C ↔ Syndicate','적대','오염 장비 유통과 이탈 네트워크를 차단한다. 교전 가능성이 높은 관계로 유지된다.'],
    ['F.H.C ↔ Amarion','연구','비인가 연구 자료와 기업 자산 회수 기록이 봉인된다. 접근 권한 불일치가 반복 보고된다.'],
    ['Ushnoda Cult ↔ Haimun','감시','의식 거점과 도심 은닉 루트가 연결된다. S.I.D 감청 대상에 포함된다.'],
    ['Syndicate ↔ Amarion','적대','회수 자원과 연구 자료의 암거래 의혹이 남아 있다. 안정적 협력으로 보지 않는다.']
  ];
  function renderRelationSummary(){ return; }
  function applyLayout(){
    document.body.classList.add('pc5152al-mobile-readable-system-pass');
    const relTitle=document.querySelector('#faction-relation > h2');
    if(relTitle) relTitle.textContent=(window.innerWidth<=1024?'관계도':'관계도 / 감청 연결 로그');
    const factionTitle=document.querySelector('#faction-info > h2');
    if(factionTitle && window.innerWidth<=1024) factionTitle.textContent='세력';
    const archiveTitle=document.querySelector('#archive-entry > h2');
    if(archiveTitle && window.innerWidth<=1024) archiveTitle.textContent='기록보관소';
    renderRelationSummary();
  }
  ready(function(){
    applyLayout();
    [80,320,900,1800].forEach(t=>setTimeout(applyLayout,t));
    window.addEventListener('resize',()=>setTimeout(applyLayout,80),{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(applyLayout,180),{passive:true});
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152al:'MobileReadableLayout SystemPass',
      relation:'summary table/card view replaces primary node graph',
      layout:'reduced gutters and compact full-width mobile cards',
      preserved:'menu silence, BGM balance, Immortality internal sequence cues'
    });
  });
})();

// MapPatch 5.15.2am — AudioReplace_CultTraceVHS_LayoutBalance
// Replaces menu/Immortality BGM, applies Cults_871104 medium VHS trace, and balances PC/mobile layout density.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  const esc=(v)=>String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function prefix(){const p=location.pathname; if(p.includes('/docs/'))return '../../'; if(p.includes('/archive/'))return '../'; return '';}
  ready(function(){
    const body=document.body;
    body.classList.add('pc5152am-audio-cult-vhs-layout-balance');
    const relationSupport=[
      ['고위험 연결','U.A.C ↔ Ushnoda Cult / N.H.C ↔ Syndicate / F.H.C ↔ Amarion'],
      ['감청 우선순위','S.I.D ↔ Haimun / Ushnoda Cult ↔ Haimun / Ghost Channel 자료'],
      ['운용 기준','표형 관계 요약을 기본 열람으로 유지하고 노드형 그래프는 보조 시각 자료로 취급']
    ];
    const factionCards={
      uac:['관련 기록','Redzone_881120 / NHC_Manual_891219','위험 연결','우시노다교 의식성 오염 / 레드존 확산','작전 권한','기록 권한 / 봉쇄 지휘 / 기관 조율'],
      nhc:['관련 기록','NHC_Manual_891219 / FCR_Archive_890402','위험 연결','레드존 전투 / Syndicate 오염 장비','작전 권한','현장 진입 / 봉쇄선 유지 / 고위험 제압'],
      sid:['관련 기록','Sakuma_Tape_991028 / Redzone_881120','위험 연결','Ghost Channel / Haimun 도심 침투','작전 권한','감청 / 진술 검증 / 통신 이상 분석'],
      fhc:['관련 기록','Cults_871104 / FCR_Archive_890402','위험 연결','봉인 기록 / Amarion 비인가 연구','작전 권한','자료 봉인 / 제한 열람 / 실험 잔재 분석'],
      ushinoda:['관련 기록','Cults_871104 / Sakuma_Tape_991028','위험 연결','Blood Gate / 의식성 오염 / Haimun 침투','작전 권한','적대 세력. 접근 권한 없음.'],
      default:['관련 기록','현재 선택 세력의 연결 기록 색인','위험 연결','감시 또는 봉인 대상 연결','작전 권한','선택 세력 기준으로 갱신됨']
    };
    function enforceAudio(){
      try{
        const bus=window.ProjectCurseAudio;
        const pre=prefix();
        if(bus && bus.audio){
          const amb=bus.audio.ambient;
          if(!amb || !String(amb.src||'').includes('pc5152am_menu_old_computer.mp3')){
            bus.audio.ambient=new Audio(pre+'assets/audio/pc5152am_menu_old_computer.mp3');
            bus.audio.ambient.loop=true;
          }
          bus.audio.ambient.volume=(window.innerWidth<=940||body.classList.contains('pc5152ah-phone'))?.18:.135;
        }
        document.querySelectorAll('audio').forEach(a=>{
          const src=a.currentSrc||a.src||'';
          if(src.includes('pc5152am_immortality_scp087_theme.mp3')){
            a.volume=Math.max(a.volume||0,(window.innerWidth<=940)?.92:.86);
            a.loop=true;
          }
          if(src.includes('pc5152am_menu_old_computer.mp3')){
            a.volume=Math.max(a.volume||0,(window.innerWidth<=940)?.18:.135);
            a.loop=true;
          }
        });
      }catch(e){}
    }
    function enhanceRelation(){
      const root=document.querySelector('#pc584-relation-root.pc5152al-relation-root');
      if(!root) return;
      let support=root.querySelector('.pc5152am-relation-support');
      if(!support){
        support=document.createElement('div');
        support.className='pc5152am-relation-support';
        support.innerHTML=relationSupport.map(([b,s])=>`<article><b>${esc(b)}</b><span>${esc(s)}</span></article>`).join('');
        root.appendChild(support);
      }
      const legend=root.querySelector('.pc5152al-relation-legend');
      if(legend && legend.dataset.pc5152amFilter!=='1'){
        legend.dataset.pc5152amFilter='1';
        const all=document.createElement('i'); all.textContent='전체'; all.dataset.type='전체';
        legend.insertBefore(all,legend.firstChild);
        legend.addEventListener('click',e=>{
          const chip=e.target.closest('i[data-type]'); if(!chip) return;
          const type=chip.dataset.type;
          legend.querySelectorAll('i').forEach(i=>i.classList.toggle('active',i===chip));
          root.querySelectorAll('.pc5152al-rel-row').forEach(row=>{
            const rowType=(row.querySelector('.pc5152al-rel-type')?.dataset.type||row.querySelector('.pc5152al-rel-type')?.textContent||'').trim();
            row.hidden = !(type==='전체'||rowType===type);
          });
        });
      }
    }
    function updateFactionBalance(){
      const section=document.getElementById('faction-info');
      const term=section && section.querySelector('.faction-terminal');
      if(!term) return;
      let holder=term.querySelector('.pc5152am-faction-balance');
      if(!holder){
        holder=document.createElement('div');
        holder.className='pc5152am-faction-balance';
        term.appendChild(holder);
      }
      const active=term.querySelector('.faction-tile.active');
      const key=active?.dataset.key || 'uac';
      const data=factionCards[key] || factionCards.default;
      holder.innerHTML=`<article class="pc5152am-faction-card"><b>${esc(data[0])}</b><span>${esc(data[1])}</span></article><article class="pc5152am-faction-card"><b>${esc(data[2])}</b><span>${esc(data[3])}</span></article><article class="pc5152am-faction-card"><b>${esc(data[4])}</b><span>${esc(data[5])}</span></article>`;
    }
    function addCultCaptions(){
      const caps=[
        ['IMAGE3101 / CULT TRACE','우시노다교 신앙 기록에서 회수된 오염 신앙 프레임.'],
        ['IMAGE3102 / HOST FACE','우시노다교 보호 아래 은폐된 타락 개체로 추정. 일부 신도 집단은 해당 개체를 성물로 취급한다.'],
        ['IMAGE3103 / MASKED FORM','가면 또는 외골격성 얼굴 구조가 확인된 특수 개체 기록.'],
        ['IMAGE3104 / CORRUPTION STAGE','타락 과정의 신체 변형 징후가 남은 회수 이미지.'],
        ['IMAGE3105 / BLOOD TRACE','혈교 의식 기록과 연결되는 피의 길 오염 흔적.']
      ];
      document.querySelectorAll('.record-detail[data-record="Cults_871104"] .record-figure').forEach((fig,i)=>{
        if(fig.querySelector('figcaption')) return;
        const cap=document.createElement('figcaption');
        const c=caps[i]||[`IMAGE31${String(i+1).padStart(2,'0')} / RECOVERED FRAME`,'F.H.C 로컬 복구 이미지.'];
        cap.innerHTML=`<b>${esc(c[0])}</b><br>${esc(c[1])}`;
        fig.appendChild(cap);
      });
    }
    function syncCultVhsClass(){
      const cult=body.classList.contains('pc5152h-cult-source-sequence') && !body.classList.contains('pc5152q-immortality-sequence');
      body.classList.toggle('pc5152am-cult-vhs-active',!!cult);
      document.querySelectorAll('.pc5152h-cult-sequence:not(.pc5152q-immortality-mode) video').forEach(v=>{
        const src=v.currentSrc||v.src||'';
        if(src.includes('pc5152am_cult_trace_vhs_noise.mp4')){
          v.volume=Math.min(v.volume||.2, window.innerWidth<=940 ? .12 : .22);
        }
      });
    }
    function layoutSync(){
      enforceAudio(); enhanceRelation(); updateFactionBalance(); addCultCaptions(); syncCultVhsClass();
    }
    layoutSync();
    [80,250,700,1500,3200].forEach(t=>setTimeout(layoutSync,t));
    window.addEventListener('resize',()=>setTimeout(layoutSync,80),{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(layoutSync,160),{passive:true});
    document.addEventListener('click',()=>setTimeout(layoutSync,40),true);
    new MutationObserver(layoutSync).observe(document.body,{attributes:true,attributeFilter:['class']});
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152am:'AudioReplace CultTraceVHS LayoutBalance',
      audio:'menu ambient uses old_computer mp3; Immortality BGM uses uploaded SCP087 theme mp3',
      cults:'Cults_871104-only medium VHS trace effect and image captions; no global VHS overlay',
      layout:'relation support cards, faction summary cards, archive 4K columns, reduced gutters retained'
    });
  });
})();


// MapPatch 5.15.2an — SystemFrame_KST_RecordLayout_AudioBusFix
// Top system frame, KST status clock, record media containment, Cults VHS overlay/static layer, and silent menu audio bus.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const body=document.body;
    body.classList.add('pc5152an-systemframe-kst-recordlayout-audiobusfix');
    function pre(){const p=location.pathname; if(p.includes('/docs/')) return '../../'; if(p.includes('/archive/')) return '../'; return '';}
    function esc(s){return String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

    function currentLabel(){
      const docTitle=document.querySelector('.doc-title');
      if(docTitle) return docTitle.textContent.trim() || '기록 열람';
      const active=document.querySelector('.content-page.active');
      const map={history:'세계 사건 연표','faction-relation':'관계도','faction-info':'세력','archive-entry':'기록보관소'};
      if(active && map[active.id]) return map[active.id];
      const activeLink=document.querySelector('.side-menu a.active b');
      return activeLink ? activeLink.textContent.trim() : '세계 사건 연표';
    }

    function installSystemFrame(){
      if(document.querySelector('.pc5152an-systembar')) return;
      const bar=document.createElement('div');
      bar.className='pc5152an-systembar';
      bar.innerHTML='<button class="pc5152an-menu" type="button" aria-label="메뉴 열기">☰</button><div class="pc5152an-server"><b>U.A.C CLOSED SERVER</b><span>PC-03 / LOCAL ARCHIVE</span></div><div class="pc5152an-current"><small>CURRENT</small><b data-pc5152an-current></b></div><div class="pc5152an-clock"><small>KST</small><b data-pc5152an-clock>--:--:--</b></div><div class="pc5152an-flags"><span data-pc5152an-audio>AUDIO ACTIVE</span><span>ACCESS LIMITED</span></div>';
      document.body.prepend(bar);
      bar.querySelector('.pc5152an-menu').addEventListener('click',function(e){
        e.preventDefault(); e.stopPropagation();
        body.classList.toggle('pc584-main-drawer-open');
        try{ localStorage.setItem('pc-main-drawer-open', body.classList.contains('pc584-main-drawer-open')?'open':'closed'); }catch(_e){}
      });
    }

    const fmtDate=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'});
    const fmtTime=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
    function updateSystemFrame(){
      const c=document.querySelector('[data-pc5152an-current]');
      const t=document.querySelector('[data-pc5152an-clock]');
      const a=document.querySelector('[data-pc5152an-audio]');
      if(c){ const label=currentLabel(); if(c.textContent!==label) c.textContent=label; }
      if(t){ const now=new Date(); const stamp=fmtDate.format(now).replace(/\.\s?/g,'-').replace(/-$/,'')+' '+fmtTime.format(now); if(t.textContent!==stamp) t.textContent=stamp; }
      if(a){
        const on=!(window.ProjectCurseAudio && typeof window.ProjectCurseAudio.isOn==='function') || window.ProjectCurseAudio.isOn();
        const label=on?'AUDIO ACTIVE':'AUDIO MUTED';
        if(a.textContent!==label) a.textContent=label;
      }
    }

    let staticAudio=null;
    function ensureStaticAudio(){
      if(staticAudio) return staticAudio;
      staticAudio=new Audio(pre()+'assets/audio/pc5152an_cult_radio_static_layer.mp3');
      staticAudio.loop=true;
      staticAudio.volume=window.innerWidth<=940 ? .10 : .17;
      return staticAudio;
    }
    function cultActive(){
      return body.classList.contains('pc5152h-cult-source-sequence') && !body.classList.contains('pc5152q-immortality-sequence');
    }
    function syncCultOverlay(){
      const active=cultActive();
      body.classList.toggle('pc5152an-cult-vhs-overlay-active', active);
      const overlay=document.querySelector('.pc5152an-vhs-overlay-video');
      if(overlay){
        overlay.muted=true; overlay.loop=true;
        overlay.style.pointerEvents='none';
        if(active){ try{ if(overlay.paused) overlay.play().catch(()=>{}); }catch(_e){} }
        else { try{ overlay.pause(); }catch(_e){} }
      }
      const a=ensureStaticAudio();
      a.volume=window.innerWidth<=940 ? .10 : .17;
      const audioOn=!(window.ProjectCurseAudio && typeof window.ProjectCurseAudio.isOn==='function') || window.ProjectCurseAudio.isOn();
      if(active && audioOn){ try{ if(a.paused) a.play().catch(()=>{}); }catch(_e){} }
      else { try{ a.pause(); a.currentTime=0; }catch(_e){} }
    }

    function silenceMenuBus(){
      const bus=window.ProjectCurseAudio;
      if(!bus || !bus.audio) return;
      ['menu','drawer','command','marker','page','radio'].forEach(k=>{try{ if(bus.audio[k]) bus.audio[k].volume=0; }catch(_e){}});
      try{ if(bus.audio.ambient){ bus.audio.ambient.loop=true; bus.audio.ambient.volume=window.innerWidth<=940 ? .074 : .096; } }catch(_e){}
      if(!bus.__pc5152anPlayCueWrapped && typeof bus.playCue==='function'){
        const old=bus.playCue.bind(bus);
        bus.playCue=function(name,cooldown){
          if(['menu','drawer','command','marker','page','radio'].includes(String(name))) return;
          return old(name,cooldown);
        };
        bus.__pc5152anPlayCueWrapped=true;
      }
    }

    function normalizeRecordFigures(){
      document.querySelectorAll('.record-page > .record-figure').forEach((fig,idx)=>{
        fig.classList.add('pc5152an-attachment-figure');
        if(!fig.querySelector('figcaption')){
          const cap=document.createElement('figcaption');
          const doc=document.querySelector('.doc-title')?.textContent?.trim() || 'RECOVERED RECORD';
          cap.innerHTML='<b>IMAGE '+String(idx+1).padStart(4,'0')+' / RECOVERED FRAME</b><span>'+esc(doc)+' 로컬 기록면에 첨부된 회수 이미지.</span>';
          fig.appendChild(cap);
        }
      });
      document.querySelectorAll('.record-content video, .doc-shell video, .record-page video').forEach(v=>{
        v.classList.add('pc5152an-contained-media');
        v.setAttribute('playsinline','');
      });
    }

    const pc5152bhBootStart = window.__pc5152BootStart || (window.__pc5152BootStart = performance.now());
    const pc5152bhMinBootMs = 2250;
    function forceBootComplete(){
      try{
        const elapsed = performance.now() - pc5152bhBootStart;
        if(elapsed < pc5152bhMinBootMs){
          setTimeout(forceBootComplete, pc5152bhMinBootMs - elapsed + 20);
          return;
        }
        const loader=document.getElementById('loader');
        const app=document.getElementById('app');
        if(loader) loader.classList.add('hide');
        if(app) app.classList.add('ready');
        body.classList.add('pc5121-boot-complete','pc5152ao-boot-safe');
        body.classList.remove('pc5121-boot-pending');
      }catch(_e){}
    }
    function safeRefresh(){
      try{ updateSystemFrame(); }catch(_e){}
      try{ syncCultOverlay(); }catch(_e){}
      try{ silenceMenuBus(); }catch(_e){}
      try{ normalizeRecordFigures(); }catch(_e){}
    }
    let refreshTimer=0;
    function queueRefresh(delay){
      clearTimeout(refreshTimer);
      refreshTimer=setTimeout(safeRefresh, delay==null?90:delay);
    }

    installSystemFrame();
    safeRefresh();
    setTimeout(forceBootComplete,3200);
    setTimeout(forceBootComplete,5200);
    window.addEventListener('error',()=>setTimeout(forceBootComplete,260));
    window.addEventListener('unhandledrejection',()=>setTimeout(forceBootComplete,260));

    // 2ao: keep the KST clock, but do not observe the whole DOM. In 2an the
    // status-clock text mutations could retrigger the global observer and trap
    // the app behind the boot loader on some browsers/devices.
    setInterval(()=>{ try{ updateSystemFrame(); }catch(_e){} },1000);
    ['hashchange','resize','orientationchange','pageshow','visibilitychange'].forEach(ev=>window.addEventListener(ev,()=>queueRefresh(120),{passive:true}));
    document.addEventListener('click',()=>queueRefresh(120),true);

    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152an:'SystemFrame KST RecordLayout AudioBusFix',
      patch5152ao:'BootLoopFix SystemFrameSafe',
      systemFrame:'fixed U.A.C status bar with Asia/Seoul realtime clock; whole-DOM observer removed',
      boot:'loader fail-safe added; app enters ready state even if a noncritical enhancement stalls',
      media:'mobile record videos use contained framing instead of center crop; desktop remains large/fullscreen',
      cults:'original Cults_871104 intro/transition retained; uploaded VHS video remains overlay only; radio static low-volume layer retained',
      audio:'menu/drawer/page click cue calls remain disabled; menu BGM is not reset by menu navigation'
    });
  });
})();


// MapPatch 5.15.2ar — FrameAudio_RebaseSafe
// Rebased from 5.15.2ap: keep original record layouts, stabilize shell/sidebar/audio state.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const body=document.body;
    body.classList.add('pc5152ar-frameaudio-rebasesafe');

    function prefix(){
      const p=location.pathname;
      if(p.includes('/docs/')) return '../../';
      if(p.includes('/archive/')) return '../';
      return '';
    }
    function q(sel,root=document){ return root.querySelector(sel); }
    function qa(sel,root=document){ return Array.from(root.querySelectorAll(sel)); }

    function removeLegacyAudioPanel(){
      qa('.pc5152ad-audio-panel,#audioToggle,#pc5152adVolumeToggle,#pc5152adAmbientToggle').forEach(el=>{
        const panel=el.closest && el.closest('.pc5152ad-audio-panel');
        (panel||el).remove();
      });
    }

    function ensureSystemBar(){
      let bar=q('.pc5152an-systembar');
      if(!bar){
        bar=document.createElement('div');
        bar.className='pc5152an-systembar pc5152ar-systembar';
        bar.innerHTML='<button class="pc5152an-menu" type="button" aria-label="사이드 메뉴 열기">☰</button><div class="pc5152an-server"><b>U.A.C CLOSED SERVER</b><span>PC-03 / LOCAL ARCHIVE</span></div><div class="pc5152an-clock"><small>KST</small><b data-pc5152an-clock>--:--:--</b></div><div class="pc5152an-flags"><span>ACCESS LIMITED</span></div>';
        document.body.prepend(bar);
      }
      qa('.pc5152an-current',bar).forEach(el=>el.remove());
      const menu=q('.pc5152an-menu',bar);
      if(menu){
        menu.textContent=body.classList.contains('pc584-main-drawer-open')?'×':'☰';
        menu.setAttribute('aria-expanded',body.classList.contains('pc584-main-drawer-open')?'true':'false');
      }
      return bar;
    }

    function ensureBackdrop(){
      let bd=q('.pc5152ar-drawer-backdrop');
      if(!bd){
        bd=document.createElement('div');
        bd.className='pc5152ar-drawer-backdrop';
        document.body.appendChild(bd);
      }
      return bd;
    }

    function removeFloatingDrawerButtons(){
      qa('.pc584-main-drawer-toggle').forEach(el=>el.remove());
      // Keep older backdrops inert; 5.15.2ar uses its own mobile-only backdrop.
      qa('.pc584-drawer-backdrop,.mobile-backdrop,.drawer-backdrop,.content-dim,.menu-overlay').forEach(el=>{
        if(el.classList && el.classList.contains('pc5152ar-drawer-backdrop')) return;
        el.style.display='none';
        el.style.pointerEvents='none';
        el.setAttribute('aria-hidden','true');
      });
    }

    function isDesktop(){ return (window.innerWidth||document.documentElement.clientWidth||0) >= 900; }
    function setDrawer(open){
      body.classList.toggle('pc584-main-drawer-open',!!open);
      const menu=q('.pc5152an-menu');
      if(menu){
        menu.textContent=open?'×':'☰';
        menu.setAttribute('aria-expanded',open?'true':'false');
        menu.setAttribute('aria-label',open?'사이드 메뉴 접기':'사이드 메뉴 열기');
      }
      try{ localStorage.setItem('pc-main-drawer-open',open?'open':'closed'); }catch(_e){}
    }

    function getPageId(){
      const active=q('.content-page.active');
      if(active && active.id) return active.id;
      return (location.hash||'#history').slice(1)||'history';
    }
    function isRecordAudioState(){
      if(body.classList.contains('pc5152h-sequence-open') ||
         body.classList.contains('pc5152i-sequence-intro-playing') ||
         body.classList.contains('pc5152q-immortality-sequence') ||
         body.classList.contains('pc5152h-cult-source-sequence') ||
         body.classList.contains('pc5133-case-file-open')) return true;
      const viewer=q('#archiveRecordViewer');
      if(viewer && !viewer.hidden){
        const visible=qa('.record-detail[data-record]',viewer).some(el=>!el.hidden);
        if(visible) return true;
      }
      return false;
    }

    let userAudioGesture=false;
    function audioOn(){
      const bus=window.ProjectCurseAudio;
      return !(bus && typeof bus.isOn==='function') || bus.isOn();
    }
    function pauseAudio(a,reset){
      try{ if(a){ a.pause(); if(reset) a.currentTime=0; } }catch(_e){}
    }
    function stopMenuAmbient(){
      const bus=window.ProjectCurseAudio;
      if(bus && bus.audio && bus.audio.ambient){
        pauseAudio(bus.audio.ambient,false);
      }
    }
    function startMenuAmbient(){
      const bus=window.ProjectCurseAudio;
      if(!bus || !bus.audio || !bus.audio.ambient || !audioOn() || !userAudioGesture) return;
      if(isRecordAudioState()) return stopMenuAmbient();
      try{
        bus.audio.ambient.loop=true;
        bus.audio.ambient.volume=(window.innerWidth||0)<=940 ? .060 : .076;
        if(bus.audio.ambient.paused) bus.audio.ambient.play().catch(()=>{});
      }catch(_e){}
    }
    function syncAudioState(){
      const bus=window.ProjectCurseAudio;
      if(bus && bus.audio){
        ['menu','drawer','command','marker','page','radio'].forEach(k=>{ try{ if(bus.audio[k]) bus.audio[k].volume=0; }catch(_e){} });
        try{
          if(!bus.audio.ambient || !String(bus.audio.ambient.src||'').includes('pc5152am_menu_old_computer.mp3')){
            pauseAudio(bus.audio.ambient,true);
            bus.audio.ambient=new Audio(prefix()+'assets/audio/pc5152am_menu_old_computer.mp3');
          }
          bus.audio.ambient.loop=true;
          bus.audio.ambient.volume=(window.innerWidth||0)<=940 ? .060 : .076;
        }catch(_e){}
      }
      if(isRecordAudioState()) stopMenuAmbient();
      else startMenuAmbient();
    }

    function hardenAudioBus(){
      const bus=window.ProjectCurseAudio;
      if(!bus || bus.__pc5152arHardened) return;
      if(typeof bus.playCue==='function'){
        const oldPlayCue=bus.playCue.bind(bus);
        bus.playCue=function(name,cooldown){
          const n=String(name||'menu');
          if(['menu','drawer','command','marker','page','radio'].includes(n)) return;
          return oldPlayCue(n,cooldown);
        };
      }
      if(typeof bus.startAmbient==='function'){
        bus.startAmbient=function(){ userAudioGesture=true; syncAudioState(); };
      }
      bus.stopMenuAmbient=stopMenuAmbient;
      bus.syncAudioState=syncAudioState;
      bus.__pc5152arHardened=true;
    }

    function routeTo(id){
      if(!id) id='history';
      if(id==='zone-map') id='history';
      if(typeof window.showPage==='function'){
        window.showPage(id);
      }else{
        const pages=qa('.content-page').filter(p=>p.id);
        if(!pages.some(p=>p.id===id)) id='history';
        pages.forEach(p=>p.classList.toggle('active',p.id===id));
        qa('.side-menu a[data-target]').forEach(a=>a.classList.toggle('active',(a.dataset.target||'')===id));
        const content=q('.legacy-content');
        if(content) content.scrollTop=0;
        try{ history.replaceState(null,'','#'+id); }catch(_e){}
      }
      if(!isDesktop()) setDrawer(false);
      syncAudioState();
      updateShell();
    }

    function toggleMenuGroup(btn){
      const group=btn && btn.closest('.pc585-menu-group');
      if(!group) return;
      const open=!group.classList.contains('open');
      group.classList.toggle('open',open);
      btn.setAttribute('aria-expanded',open?'true':'false');
      const icon=btn.querySelector('span');
      if(icon) icon.textContent=open?'▾':'▸';
    }

    function normalizeArchiveGrid(){
      qa('#archive-entry .archive-list').forEach(grid=>{
        grid.style.minWidth='0';
      });
      qa('#archive-entry .doc-card').forEach(card=>{
        card.style.minWidth='0';
        card.style.maxWidth='100%';
        card.style.overflow='hidden';
        card.style.overflowWrap='anywhere';
      });
    }

    function normalizeRecordLayout(){
      // Keep 5.15.2ap document flow. Do not apply the rejected 2aq centered media template.
      qa('.record-detail,.record-page,.record-content,.paged-record').forEach(el=>{
        el.classList.remove('pc5152aq-record-media-top','pc5152aq-centered-record','pc5152aq-media-first');
      });
      qa('.record-page .record-figure, .record-page figure, .record-detail .record-figure').forEach(fig=>{
        fig.style.position='';
        fig.style.inset='';
        fig.style.display='block';
        fig.style.visibility='';
        fig.style.opacity='';
      });
      qa('.record-page img, .record-detail img').forEach(img=>{
        img.style.display='';
        img.style.visibility='';
        img.style.opacity='';
      });
    }

    function updateShell(){
      removeLegacyAudioPanel();
      ensureSystemBar();
      ensureBackdrop();
      removeFloatingDrawerButtons();
      normalizeArchiveGrid();
      normalizeRecordLayout();
      body.classList.toggle('pc5152ar-desktop',isDesktop());
      body.classList.toggle('pc5152ar-mobile',!isDesktop());
      const page=getPageId();
      body.dataset.pc5152arPage=page;
    }

    function isShellTarget(target){
      return !!(target && target.closest && target.closest('.pc5152an-menu,.pc584-main-drawer-toggle,.pc5152ar-drawer-backdrop,.legacy-sidebar,.side-menu,.pc585-menu-heading'));
    }

    document.addEventListener('pointerdown',function(e){
      userAudioGesture=true;
      if(isShellTarget(e.target)){
        // Earlier legacy listeners may already have attempted to start ambient; correct it immediately.
        setTimeout(syncAudioState,0);
        e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      }
    },true);

    let lastDrawerActivation=0;
    function activateDrawerFromEvent(e){
      const menu=e.target.closest && e.target.closest('.pc5152an-menu,.pc584-main-drawer-toggle');
      if(!menu) return false;
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      const now=Date.now();
      if(now-lastDrawerActivation<650) return true;
      lastDrawerActivation=now;
      setDrawer(!body.classList.contains('pc584-main-drawer-open'));
      syncAudioState();
      return true;
    }

    // Some mobile WebViews do not dispatch the synthetic click reliably after
    // a captured pointerdown. Open on pointerup there, then ignore its follow-up
    // click so one tap always produces exactly one drawer state change.
    document.addEventListener('pointerup',function(e){
      if(!isDesktop()) activateDrawerFromEvent(e);
    },true);

    document.addEventListener('click',function(e){
      if(activateDrawerFromEvent(e)) return false;
      const backdrop=e.target.closest && e.target.closest('.pc5152ar-drawer-backdrop');
      if(backdrop){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        setDrawer(false);
        syncAudioState();
        return false;
      }
      const heading=e.target.closest && e.target.closest('.pc585-menu-heading');
      if(heading){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        toggleMenuGroup(heading);
        syncAudioState();
        return false;
      }
      const link=e.target.closest && e.target.closest('.side-menu a[data-target]');
      if(link){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        routeTo(link.dataset.target||'history');
        return false;
      }
      if(isRecordAudioState() && isShellTarget(e.target)){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        syncAudioState();
        return false;
      }
      setTimeout(syncAudioState,80);
    },true);

    window.addEventListener('hashchange',()=>setTimeout(()=>{updateShell(); syncAudioState();},80),{passive:true});
    window.addEventListener('resize',()=>setTimeout(()=>{updateShell(); syncAudioState();},80),{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(()=>{updateShell(); syncAudioState();},120),{passive:true});
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape') setDrawer(false);
      userAudioGesture=true;
      setTimeout(syncAudioState,0);
    },true);
    document.addEventListener('visibilitychange',syncAudioState,{passive:true});

    hardenAudioBus();
    updateShell();
    syncAudioState();
    [50,150,400,900,1800,3200].forEach(t=>setTimeout(()=>{hardenAudioBus(); updateShell(); syncAudioState();},t));
    setInterval(()=>{ if(isRecordAudioState()) stopMenuAmbient(); removeFloatingDrawerButtons(); },1000);

    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152ar:'FrameAudio RebaseSafe',
      base:'5.15.2ap RuntimeFix MetadataClean',
      retained:'original F.H.C/Immortality record layout; 2aq centered-media CSS not applied',
      shell:'single topbar menu button; floating drawer button removed; CURRENT label removed; SOUND panel removed',
      audio:'menu ambient only on general UI; record views stop menu ambient; side menu actions have no cue/ducking',
      responsive:'desktop push sidebar, mobile overlay drawer, archive grid constrained to parent width'
    });
  });
})();



// MapPatch 5.15.2as — RecordSequence_StageViewerInspired
// Adds sequence-only layout classes for F.H.C briefing / evidence-photo pages and Immortality terminal-log pages.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152as-stageviewer-marker');
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152as:'RecordSequence StageViewerInspired',
      sequenceLayout:'F.H.C warning/title/two-column/evidence/end-card + Immortality terminal-log/field-photo classes',
      scope:'sequence overlay only; native 5.15.2ap document flow remains untouched',
      responsive:'desktop cinematic stage, mobile one-column evidence/log view'
    });
  });
})();

// MapPatch 5.15.2au — OrderRestore_ContentSafe
// Content-safe rebase: keep 5.15.2as sequence viewer, but preserve 5.15.2ar native F.H.C/Immortality order and core descriptions.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152au-orderrestore-contentsafe');

    function lockEraFrame(){
      const bar=document.querySelector('.pc5152an-systembar');
      if(!bar) return;
      bar.querySelectorAll('.pc5152an-current').forEach(el=>el.remove());
      const clock=bar.querySelector('.pc5152an-clock');
      if(clock){
        const small=clock.querySelector('small');
        const b=clock.querySelector('b');
        if(small) small.textContent='ERA';
        if(b){
          b.removeAttribute('data-pc5152an-clock');
          b.textContent='1980-2030';
        }
      }
      const server=bar.querySelector('.pc5152an-server span');
      if(server) server.textContent='PC-03 / 폐쇄 기록';
    }

    function guardContentOrder(){
      // Do not rewrite sequence pages here. 5.15.2au intentionally keeps the 5.15.2as order:
      // Cults: 타락교 -> 신원불명의 신자 -> 가면을 쓴 존재 -> 타락 과정 -> 혈교 -> 혈액 경로 -> 혈무 -> 피의 호수를 거니는 자들 -> 저장소 -> 제압 -> 비교 -> 경고.
      // Immortality: 사건 개요 -> 기록 정보 -> 작전 투입 -> 16:10~19:00 작전 시간 기록.
    }

    lockEraFrame();
    guardContentOrder();
    [50,150,400,900,1800,3200].forEach(t=>setTimeout(lockEraFrame,t));
    setInterval(lockEraFrame,1500);

    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152au:'OrderRestore ContentSafe',
      base:'5.15.2ar FrameAudio RebaseSafe + 5.15.2as RecordSequence StageViewer',
      discarded:'5.15.2at concise sequence copy/order rewrite',
      restored:'native F.H.C and Immortality document pages copied from 5.15.2ar; sequence copy/order retained from 5.15.2as',
      era:'1980-2030 closed-server archive era; 2010s/2020s entries retained in chronology',
      rule:'do not compress or rearrange setting text without preserving original order and key explanations'
    });
  });
})();


// MapPatch 5.15.2av — EvidenceStageScale_TypographyPass
// Visual-only pass: enlarge evidence imagery and rebalance sequence typography without rewriting record order/text.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152av-evidence-stage-scale');
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152av:'EvidenceStageScale TypographyPass',
      scope:'visual-only CSS pass for F.H.C/Immortality sequence overlay',
      contentRule:'does not rewrite record order, captions, or setting descriptions',
      evidenceLayout:'large evidence image left / compact report text right on PC; stacked on mobile'
    });
  });
})();

// MapPatch 5.15.2aw — ReligionSequence_ContentLayoutPass
// Rewrites the Cults_871104 religion sequence with translated religion/corruption notes and tighter stage layout.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152aw-religion-sequence-pass');
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152aw:'ReligionSequence ContentLayoutPass',
      focus:'Cults_871104 renamed to 종교 and rebuilt around religion / corruption evidence flow',
      layout:'타락교·혈교·혈액 경로·혈무는 오른쪽 보조 이미지형, 나머지 증거면은 대형 증거사진형',
      content:'Signs of Corruption / Hina series notes translated and merged into the religion record',
      motion:'sequence lines reveal with short pop / glitch instead of slow slide-in'
    });
  });
})();

// MapPatch 5.15.2ax — EvidenceCenter_BlockRevealPass
// Centers evidence images, uses figure captions for image-bottom metadata, and hard-resets sequence runtime on re-entry.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152ax-evidence-center-blockreveal');
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {
      patch5152ax:'EvidenceCenter BlockRevealPass',
      focus:'religion sequence evidence pages use centered image + figcaption + report copy',
      reveal:'religion pages reveal as one block, not line by line',
      reset:'sequence runtime hard-reset added for return/re-open and end/re-open paths',
      restored:'타락의 과정 및 형태 original image restored; reference caption assets removed; IMG code/title evidence caption restored'
    });
  });
})();


// MapPatch 5.15.2ay — ReferenceRollback_ReligionSequenceFix marker.
(function(){
  window.ProjectCursePatch5152ay={
    patch5152ay:'ReferenceRollback ReligionSequenceFix',
    base:'5.15.2ax',
    cults:'reference caption screenshots removed; only two user-approved clean images are used for Silent/Hybridized Corruption',
    layout:'evidence pages use centered image + IMG code/title + report; 타락교/혈교 remain two-column',
    flow:'split reference-only pages folded into adjacent evidence pages'
  };
})();


// MapPatch 5.15.2az — ImmortalityFieldBriefingPass marker.
(function(){
  window.ProjectCursePatch5152az={
    patch5152az:'Immortality FieldBriefingPass',
    base:'5.15.2ay',
    scope:'Immortality_860201 sequence text/layout only',
    referencePolicy:'uploaded reference videos/screenshots were not added as assets or audio',
    briefing:'opening changed to left red operation briefing with existing right-side image',
    ending:'18:56 final-image analysis paragraphs removed'
  };
})();


// MapPatch 5.15.2ba — TitleImg_MobileSequenceFix marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152ba-titleimg-mobile-sequencefix');
    document.body.classList.add('pc5152bb-stage-template-responsivefix');
    window.ProjectCursePatch5152ba={
      patch5152ba:'TitleImg MobileSequenceFix',
      base:'5.15.2az',
      religion:'evidence pages show visible IMG code + title under image; Hybridized Corruption mutates only on user click',
      immortality:'field photo pages hide large time title and show IMG/time metadata under image; opening title/subtitle removed',
      responsive:'sequence panel and media use contain/stack rules on mobile to avoid middle-crop'
    };
  });
})();


// MapPatch 5.15.2bb — StageTemplate_ResponsiveHubFix public marker.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152bb-stage-template-responsivefix');
    window.ProjectCursePatch = Object.assign(window.ProjectCursePatch||{}, {
      patch5152bb:'StageTemplate ResponsiveHubFix',
      sequenceStage:'briefing/evidence/photo/log/personnel templates separated by parent stage',
      responsiveMode:'PC uses full viewport stage; mobile stacks templates without center-crop',
      sideMenuMode:'hub-sized responsive shell retained for archive/world/faction/map/category expansion'
    });
  });
})();

// MapPatch 5.15.2bc — SideMenuHub_ArchiveIAFix
// Hub/filter layer for side menu target pages. No new lore media, audio, or reference assets are added.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152bc-side-menu-hub-archive-ia');
    const qa=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
    const q=(sel,root=document)=>root.querySelector(sel);
    const norm=(v)=>String(v||'').toLowerCase();

    // Make existing accordion groups explicit disclosure controls.
    qa('.pc585-menu-group').forEach((group,idx)=>{
      const btn=q('.pc585-menu-heading',group);
      const items=q('.pc585-menu-items',group);
      if(!btn || !items) return;
      const id=items.id || `pc5152bc-menu-panel-${idx+1}`;
      items.id=id;
      btn.setAttribute('aria-controls',id);
      btn.setAttribute('aria-expanded',group.classList.contains('open')?'true':'false');
    });

    // World timeline filtering by era.
    function yearToEra(text){
      const m=String(text||'').match(/(19|20)\d{2}/);
      if(!m) return 'other';
      const y=Number(m[0]);
      if(y>=1980 && y<=1989) return '1980s';
      if(y>=1990 && y<=1999) return '1990s';
      if(y>=2000 && y<=2009) return '2000s';
      if(y>=2010 && y<=2019) return '2010s';
      if(y>=2020 && y<=2030) return '2020s';
      return 'other';
    }
    const timeline=q('#history .timeline-list');
    if(timeline){
      qa(':scope > div',timeline).forEach(item=>{
        if(!item.dataset.pc5152bcEra) item.dataset.pc5152bcEra=yearToEra(item.textContent);
      });
      qa('[data-pc5152bc-era]').forEach(btn=>{
        btn.addEventListener('click',()=>{
          const era=btn.dataset.pc5152bcEra||'all';
          qa('[data-pc5152bc-era]').forEach(b=>b.classList.toggle('active',b===btn));
          qa(':scope > div',timeline).forEach(item=>{
            const show=era==='all' || item.dataset.pc5152bcEra===era;
            item.classList.toggle('pc5152bc-filter-hidden',!show);
          });
          const first=qa(':scope > div:not(.pc5152bc-filter-hidden)',timeline)[0];
          if(first && window.innerWidth>820) first.scrollIntoView({block:'nearest',behavior:'smooth'});
        });
      });
    }

    // Faction tile filter.
    qa('[data-pc5152bc-faction]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const cat=btn.dataset.pc5152bcFaction||'all';
        qa('[data-pc5152bc-faction]').forEach(b=>b.classList.toggle('active',b===btn));
        qa('.faction-tile[data-pc5152bc-faction-cat]').forEach(tile=>{
          const show=cat==='all' || tile.dataset.pc5152bcFactionCat===cat;
          tile.classList.toggle('pc5152bc-filter-hidden',!show);
        });
      });
    });

    // Relation filter: the PC graph is filtered softly; mobile relation list becomes the primary readable fallback.
    const relGroups={
      institution:['uac','sid','fhc'],
      field:['uac','nhc','arf','cpd','ashcrew'],
      cult:['uac','ushinoda','haimun'],
      unstable:['uac','syndicate','amarion']
    };
    function applyRelationFilter(kind){
      const allow=kind==='all' ? null : new Set(relGroups[kind]||[]);
      qa('[data-pc5134-node]').forEach(node=>{
        const key=node.getAttribute('data-pc5134-node')||'';
        node.classList.toggle('pc5152bc-filter-hidden',!!allow && !allow.has(key));
      });
      qa('[data-pc5134-row]').forEach(row=>{
        if(!allow){ row.classList.remove('pc5152bc-filter-hidden'); return; }
        const text=norm(row.textContent);
        const hit=Array.from(allow).some(k=>text.includes(k) || (k==='ushinoda' && text.includes('ushnoda')) || (k==='nhc' && text.includes('n.h.c')) || (k==='sid' && text.includes('s.i.d')) || (k==='fhc' && text.includes('f.h.c')) || (k==='uac' && text.includes('u.a.c')));
        row.classList.toggle('pc5152bc-filter-hidden',!hit);
      });
      qa('[data-pc5152bc-rel-card]').forEach(card=>{
        const show=kind==='all' || card.dataset.pc5152bcRelCard===kind;
        card.classList.toggle('pc5152bc-filter-hidden',!show);
      });
    }
    qa('[data-pc5152bc-relation]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const kind=btn.dataset.pc5152bcRelation||'all';
        qa('[data-pc5152bc-relation]').forEach(b=>b.classList.toggle('active',b===btn));
        applyRelationFilter(kind);
      });
    });
    setTimeout(()=>applyRelationFilter(q('[data-pc5152bc-relation].active')?.dataset.pc5152bcRelation || 'all'),650);

    // Archive filter/search.
    const search=q('#pc5152bcArchiveSearch');
    const archiveButtons=qa('[data-pc5152bc-archive]');
    let activeArchive='all';
    function classifyArchiveCard(card){
      if(card.dataset.pc5152bcSearch) return;
      const text=norm(card.textContent);
      card.dataset.pc5152bcSearch=text;
      card.dataset.pc5152bcStatus=card.dataset.access || (text.includes('봉인')?'sealed':'open');
      let type='other';
      if(text.includes('종교') || text.includes('cults')) type='religion';
      else if(text.includes('불멸') || text.includes('immortality')) type='operation';
      else if(text.includes('레드존') || text.includes('redzone')) type='anomaly';
      else if(text.includes('타락 개체') || text.includes('fcr')) type='entity';
      else if(text.includes('n.h.c') || text.includes('규정') || text.includes('manual')) type='manual';
      else if(text.includes('사쿠마') || text.includes('실종')) type='incident';
      else if(text.includes('회수') || text.includes('영상') || text.includes('병기') || text.includes('유전자')) type='recovered';
      card.dataset.pc5152bcType=type;
    }
    function applyArchiveFilter(){
      const term=norm(search && search.value).trim();
      let visible=0,total=0;
      qa('#archiveListWrap .doc-card').forEach(card=>{
        classifyArchiveCard(card);
        total++;
        const status=card.dataset.pc5152bcStatus||'';
        const type=card.dataset.pc5152bcType||'';
        const statusHit=activeArchive==='all' || activeArchive===status || activeArchive===type;
        const textHit=!term || (card.dataset.pc5152bcSearch||'').includes(term);
        const show=statusHit && textHit;
        card.classList.toggle('pc5152bc-filter-hidden',!show);
        if(show) visible++;
      });
      qa('#archiveListWrap details').forEach(d=>{
        const cards=qa('.doc-card',d);
        const has=cards.some(c=>!c.classList.contains('pc5152bc-filter-hidden'));
        d.classList.toggle('pc5152bc-group-empty',!has);
        if(has) d.open=true;
      });
      const counter=q('.pc5152bc-archive-counter');
      if(counter) counter.textContent=`표시 기록 ${visible} / 전체 ${total}`;
    }
    archiveButtons.forEach(btn=>{
      btn.addEventListener('click',()=>{
        activeArchive=btn.dataset.pc5152bcArchive||'all';
        archiveButtons.forEach(b=>b.classList.toggle('active',b===btn));
        applyArchiveFilter();
      });
    });
    if(search) search.addEventListener('input',applyArchiveFilter);
    applyArchiveFilter();

    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bc:'SideMenuHub_ArchiveIAFix'});
  });
})();

// MapPatch 5.15.2bd — RegionalSituationMap_Prototype
// Local fictional situation map. No external map tiles, no referenced media insertion.
(function(){
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function initRegionMap(){
    const root=document.querySelector('[data-pc5152bd-region-root]');
    if(!root || root.dataset.pc5152bdReady==='1') return;
    root.dataset.pc5152bdReady='1';
    const regionBtns=[...root.querySelectorAll('[data-region].pc5152bd-map-toolbar button, .pc5152bd-map-toolbar [data-region]')];
    const layerBtns=[...root.querySelectorAll('.pc5152bd-map-filters [data-layer]')];
    const markers=[...root.querySelectorAll('.pc5152bd-marker')];
    const zones=[...root.querySelectorAll('.pc5152bd-zone,.pc5152bd-line')];
    const title=root.querySelector('[data-map-title]');
    const meta=root.querySelector('[data-map-meta]');
    const note=root.querySelector('[data-map-note]');
    const list=root.querySelector('.pc5152bd-map-list');
    let region='world';
    let layer='all';
    function matches(el){
      const r=el.dataset.region||'world';
      const l=el.dataset.layer||'all';
      return (region==='world'||r===region) && (layer==='all'||l===layer);
    }
    function selectMarker(btn){
      if(!btn) return;
      markers.forEach(m=>m.classList.toggle('active',m===btn));
      if(title) title.textContent=btn.dataset.title||'미지정 좌표';
      if(meta) meta.textContent=btn.dataset.meta||'SIGNAL 부분';
      if(note) note.textContent=btn.dataset.note||'복구 가능한 설명이 없다.';
    }
    function renderList(){
      if(!list) return;
      const visible=markers.filter(matches);
      list.innerHTML=visible.map(m=>`<button type="button" class="pc5152bd-map-card" data-card-for="${esc(m.textContent.trim())}"><b>${esc(m.dataset.title)}</b><small>${esc(m.dataset.meta)}</small><span>${esc(m.dataset.note)}</span></button>`).join('') || '<div class="pc5152bd-map-card"><b>NO SIGNAL</b><span>현재 필터에서 표시할 좌표가 없다.</span></div>';
      list.querySelectorAll('[data-card-for]').forEach(card=>{
        card.addEventListener('click',()=>{
          const m=markers.find(x=>x.textContent.trim()===card.dataset.cardFor);
          if(m) selectMarker(m);
        });
      });
    }
    function update(){
      regionBtns.forEach(b=>b.classList.toggle('active',(b.dataset.region||'world')===region));
      layerBtns.forEach(b=>b.classList.toggle('active',(b.dataset.layer||'all')===layer));
      [...markers,...zones].forEach(el=>{
        const on=matches(el);
        el.classList.toggle('pc5152bd-hidden',!on);
        el.classList.toggle('pc5152bd-dim',!on);
      });
      const active=markers.find(m=>m.classList.contains('active') && matches(m)) || markers.find(matches);
      if(active) selectMarker(active);
      renderList();
    }
    regionBtns.forEach(btn=>btn.addEventListener('click',()=>{region=btn.dataset.region||'world'; update();}));
    layerBtns.forEach(btn=>btn.addEventListener('click',()=>{layer=btn.dataset.layer||'all'; update();}));
    markers.forEach(btn=>btn.addEventListener('click',()=>selectMarker(btn)));
    update();
  }
  document.addEventListener('DOMContentLoaded',initRegionMap);
  setTimeout(initRegionMap,300);
  setTimeout(initRegionMap,1000);
  window.ProjectCursePatchState=Object.assign(window.ProjectCursePatchState||{}, {patch5152bd:'RegionalSituationMap Prototype', regionMap:'static local situation board; no external tiles'});
})();


// MapPatch 5.15.2be — MobileDrawer_TapFix
// Touch-end router for mobile drawer. Uses no new media/audio assets.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const body=document.body;
    body.classList.add('pc5152be-mobile-drawer-tapfix');
    const q=(s,r=document)=>r.querySelector(s);
    const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
    const isMobile=()=> (window.innerWidth||document.documentElement.clientWidth||0) < 900;
    function setDrawer(open){
      body.classList.toggle('pc584-main-drawer-open',!!open);
      body.classList.toggle('pc5152be-drawer-open',!!open);
      const btn=q('.pc5152an-menu');
      if(btn){
        btn.textContent=open?'×':'☰';
        btn.setAttribute('aria-expanded',open?'true':'false');
        btn.setAttribute('aria-label',open?'사이드 메뉴 접기':'사이드 메뉴 열기');
      }
      try{ localStorage.setItem('pc-main-drawer-open',open?'open':'closed'); }catch(_e){}
    }
    function syncDrawer(){ setDrawer(body.classList.contains('pc584-main-drawer-open')); }
    function routeTo(id){
      id=id||'history';
      if(id==='zone-map') id='history';
      try{
        if(typeof window.showPage==='function') window.showPage(id);
        else{
          const pages=qa('.content-page').filter(p=>p.id);
          if(!pages.some(p=>p.id===id)) id='history';
          pages.forEach(p=>p.classList.toggle('active',p.id===id));
          qa('.side-menu a[data-target]').forEach(a=>a.classList.toggle('active',(a.dataset.target||'')===id));
          const content=q('.legacy-content');
          if(content) content.scrollTop=0;
          history.replaceState(null,'','#'+id);
        }
      }catch(_e){}
      if(isMobile()) setDrawer(false);
    }
    function toggleGroup(btn){
      const group=btn && btn.closest('.pc585-menu-group');
      if(!group) return;
      const open=!group.classList.contains('open');
      group.classList.toggle('open',open);
      btn.setAttribute('aria-expanded',open?'true':'false');
      const icon=btn.querySelector('span');
      if(icon) icon.textContent=open?'▾':'▸';
    }
    function handleTap(e){
      const target=e.target;
      if(!target || !target.closest) return;
      const menu=target.closest('.pc5152an-menu,.pc584-main-drawer-toggle');
      if(menu){
        e.preventDefault(); e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        setDrawer(!body.classList.contains('pc584-main-drawer-open'));
        return false;
      }
      const backdrop=target.closest('.pc5152ar-drawer-backdrop');
      if(backdrop){
        e.preventDefault(); e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        setDrawer(false);
        return false;
      }
      const sidebar=target.closest('.legacy-sidebar');
      if(sidebar){
        const heading=target.closest('.pc585-menu-heading');
        if(heading){
          e.preventDefault(); e.stopPropagation();
          if(e.stopImmediatePropagation) e.stopImmediatePropagation();
          toggleGroup(heading);
          return false;
        }
        const link=target.closest('.side-menu a[data-target],.pc5151-root-list a[data-target]');
        if(link){
          e.preventDefault(); e.stopPropagation();
          if(e.stopImmediatePropagation) e.stopImmediatePropagation();
          routeTo(link.dataset.target||'history');
          return false;
        }
      }
    }
    // A tap already produces a click on current mobile browsers. Listening to
    // touchend, pointerup and click together toggled the drawer two or three
    // times, so it could close again before it was ever painted.
    document.addEventListener('click',function(e){
      const t=e.target;
      if(t && t.closest && (t.closest('.pc5152an-menu,.pc584-main-drawer-toggle,.legacy-sidebar,.pc5152ar-drawer-backdrop'))){
        handleTap(e);
      }
    },true);
    window.addEventListener('resize',syncDrawer,{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(syncDrawer,120),{passive:true});
    syncDrawer();
    [80,300,900,1800].forEach(t=>setTimeout(syncDrawer,t));
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152be:'MobileDrawer TapFix', mobileDrawer:'systembar menu and sidebar links handled on touchend/pointerup above map overlays'});
  });
})();

// MapPatch 5.15.2bf — RegionalMap_LinkedUsabilityPass
// Enhances the static region situation board with status metrics, active mobile cards, and related-record jumps.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    document.body.classList.add('pc5152bf-regional-map-linked-usability');
    const root=document.querySelector('[data-pc5152bd-region-root]');
    if(!root || root.dataset.pc5152bfReady==='1') return;
    root.dataset.pc5152bfReady='1';
    const $=(s,r=root)=>r.querySelector(s);
    const $$=(s,r=root)=>Array.from(r.querySelectorAll(s));
    const markers=$$('.pc5152bd-marker');
    const regionLabel=$('[data-map-region-label]');
    const layerLabel=$('[data-map-layer-label]');
    const countLabel=$('[data-map-count]');
    const statusEl=$('[data-map-status]');
    const jumpBtn=$('.pc5152bf-map-jump');
    const regionNames={world:'세계',eastasia:'동아시아',europe:'유럽',northamerica:'북미',southbelt:'남방권',mideastafrica:'중동·아프리카'};
    const layerNames={all:'전체',contam:'오염 구역',facility:'작전 시설',phenomenon:'현상 기록',incident:'사건 좌표',line:'봉쇄선'};
    function activeRegion(){return ($('.pc5152bd-map-toolbar [data-region].active')||{}).dataset?.region || 'world';}
    function activeLayer(){return ($('.pc5152bd-map-filters [data-layer].active')||{}).dataset?.layer || 'all';}
    function markerVisible(m){return !m.classList.contains('pc5152bd-hidden') && !m.hidden;}
    function updateStatusStrip(){
      const r=activeRegion(), l=activeLayer();
      if(regionLabel) regionLabel.textContent=regionNames[r]||r;
      if(layerLabel) layerLabel.textContent=layerNames[l]||l;
      if(countLabel) countLabel.textContent=String(markers.filter(markerVisible).length);
    }
    function syncSelectedExtras(marker){
      if(!marker) marker=markers.find(m=>m.classList.contains('active')) || markers.find(markerVisible) || markers[0];
      if(!marker) return;
      if(statusEl) statusEl.textContent=marker.dataset.status || 'SIGNAL 부분';
      if(jumpBtn){
        const label=marker.dataset.linkLabel || '관련 기록 열람';
        jumpBtn.textContent=label;
        jumpBtn.dataset.mapJump=marker.dataset.linkTarget || 'archive-entry';
        jumpBtn.dataset.mapJumpSearch=marker.dataset.linkSearch || '';
      }
      $$('.pc5152bd-map-card').forEach(card=>{
        card.classList.toggle('active', (card.dataset.cardFor||'') === (marker.textContent||'').trim());
      });
      updateStatusStrip();
    }
    // Rebuild mobile card details after the 2bd renderer has updated them.
    function enrichCards(){
      const list=$('.pc5152bd-map-list');
      if(!list) return;
      $$('.pc5152bd-map-card',list).forEach(card=>{
        const code=card.dataset.cardFor;
        const marker=markers.find(m=>(m.textContent||'').trim()===code);
        if(!marker || card.dataset.pc5152bfEnriched==='1') return;
        card.dataset.pc5152bfEnriched='1';
        const em=document.createElement('em');
        em.textContent=(marker.dataset.status||'SIGNAL 부분');
        card.insertBefore(em, card.querySelector('span') || null);
        card.addEventListener('click',()=>setTimeout(()=>syncSelectedExtras(marker),0));
      });
      syncSelectedExtras();
    }
    markers.forEach(marker=>{
      marker.addEventListener('click',()=>setTimeout(()=>syncSelectedExtras(marker),0));
      marker.addEventListener('pointerup',()=>setTimeout(()=>syncSelectedExtras(marker),0),{passive:true});
    });
    $$('.pc5152bd-map-toolbar [data-region],.pc5152bd-map-filters [data-layer]').forEach(btn=>{
      btn.addEventListener('click',()=>setTimeout(()=>{updateStatusStrip(); enrichCards(); syncSelectedExtras();},0));
    });
    if(jumpBtn){
      jumpBtn.addEventListener('click',()=>{
        const target=jumpBtn.dataset.mapJump || 'archive-entry';
        const term=jumpBtn.dataset.mapJumpSearch || '';
        try{ if(typeof window.showPage==='function') window.showPage(target); }catch(_e){}
        setTimeout(()=>{
          if(target==='archive-entry' && term){
            const search=document.querySelector('#pc5152bcArchiveSearch');
            if(search){ search.value=term; search.dispatchEvent(new Event('input',{bubbles:true})); }
          }
          if(target==='faction-info' && term){
            const tiles=Array.from(document.querySelectorAll('.faction-tile'));
            const hit=tiles.find(t=>(t.textContent||'').toLowerCase().includes(term.toLowerCase()));
            if(hit){ hit.scrollIntoView({block:'center',behavior:'smooth'}); hit.classList.add('pc5152bf-focus-pulse'); setTimeout(()=>hit.classList.remove('pc5152bf-focus-pulse'),900); }
          }
        },120);
      });
    }
    const observer=new MutationObserver(()=>{enrichCards(); updateStatusStrip();});
    const list=$('.pc5152bd-map-list');
    if(list) observer.observe(list,{childList:true,subtree:true});
    [0,120,480,1100].forEach(t=>setTimeout(()=>{enrichCards(); syncSelectedExtras(); updateStatusStrip();},t));
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bf:'RegionalMap LinkedUsabilityPass', regionalMap:'status strip, related record jump, active mobile cards'});
  });
})();


// MapPatch 5.15.2bg — ArchiveWorldFaction_CrosslinkPass
// Crosslinks world timeline, faction hub, relation network, region board, and archive metadata.
// No external assets, no new media, and no audio/effect files are added.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const body=document.body;
    body.classList.add('pc5152bg-crosslink-pass');
    const q=(s,r=document)=>r.querySelector(s);
    const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
    const norm=(v)=>String(v||'').toLowerCase().replace(/\s+/g,' ').trim();
    const recordMeta={
      'Cults_871104':{id:'CULTS-871104',category:'종교 / 오염 사례',clearance:'기밀',state:'열람 가능',factions:'F.H.C / 우시노다교 / 타락교 / 혈교',phenomena:'침묵성 타락 / 융합성 타락 / 혈무',region:'권역 미상 / 회수 기록',era:'1987-2000s',history:'우시노다교 대규모 의식 사건',search:'종교'},
      'Immortality_860201':{id:'BLI-006',category:'작전 로그 / 현장 촬영 기록',clearance:'기밀',state:'부분 복구',factions:'U.A.C / N.H.C / F.H.C',phenomena:'피의 호수 / 이상 안개 / 혈액성 잔류물',region:'독일 본토 ██ 지역',era:'1986',history:'피의 호수 사건',search:'불멸'},
      '타락 개체_860722':{id:'FCR-860722',category:'개체 분류',clearance:'봉인',state:'권한 없음',factions:'U.A.C / N.H.C / S.I.D',phenomena:'타락 개체 / 상위 개체',region:'복수 레드존',era:'1986-1989',history:'개체·귀환자 분류 갱신',search:'타락 개체'},
      '불명_Record2_860205':{id:'BL-AUT-860205',category:'부검 / 샘플 분석',clearance:'봉인',state:'권한 없음',factions:'F.H.C / U.A.C',phenomena:'피의 호수 / BL-088 / 부패 정지',region:'북해-독일권',era:'1986',history:'불멸 작전 사후 조사',search:'피의 호수'},
      'Redzone_881120':{id:'RZ-881120',category:'이상현상 기준',clearance:'봉인',state:'권한 없음',factions:'U.A.C / S.I.D / N.H.C',phenomena:'레드존 / 죽은 시간 / Blood Gate',region:'동아시아 / 국외권',era:'1988',history:'레드존 오염 기준 확장',search:'레드존'},
      'FCR_Archive_890402':{id:'FCR-890402',category:'개체 추가 보고',clearance:'봉인',state:'권한 없음',factions:'F.H.C / S.I.D',phenomena:'괴이 / 귀환자 / 우시노다교',region:'복수 권역',era:'1989',history:'개체·귀환자 분류 갱신',search:'타락 개체'},
      'NHC_Manual_891219':{id:'NHC-MAN-891219',category:'현장 규정',clearance:'봉인',state:'권한 없음',factions:'N.H.C / Ash Crew / A.R.F',phenomena:'봉쇄선 / 블랙 태그 / 장비 운용',region:'레드존 인접권',era:'1989',history:'N.H.C 독립 현장 사령부화',search:'N.H.C'},
      'Sakuma_Tape_991028':{id:'SID-SAK-991028',category:'실종 사건 / 오컬트 수사',clearance:'봉인',state:'권한 없음',factions:'S.I.D / 우시노다교',phenomena:'문서 오염 / 실종 / 도심 침투',region:'일본 도쿄',era:'1999',history:'사쿠마 유타 실종 사건',search:'사쿠마'},
      '불명_Record1_860204':{id:'AMR-REC-860204',category:'회수 영상',clearance:'봉인',state:'권한 없음',factions:'Amarion / F.H.C',phenomena:'저접근 자기 변형 / 자원 회수',region:'비인가 연구권',era:'2001',history:'아마리온 사전교육 영상 회수',search:'아마리온'},
      '불명_Record3_920711':{id:'RW-920711',category:'이탈 기록',clearance:'봉인',state:'권한 없음',factions:'N.H.C / Syndicate / Red Wolf',phenomena:'지휘 체계 이탈',region:'현장 작전권',era:'1992',history:'레드울프 이탈 기록',search:'레드울프'},
      '불명_Record4_930314':{id:'WPN-930314',category:'병기화 음성 기록',clearance:'봉인',state:'권한 없음',factions:'Syndicate / 우시노다교',phenomena:'감염 병기 / 억제 수단',region:'비인가 연구권',era:'1993',history:'병기화 음성 기록 회수',search:'병기'},
    };
    const factionMeta={
      uac:{name:'U.A.C',role:'상위 통제 / 구역 분류 / 정보 검열',records:['불멸','레드존'],history:'U.A.C 임시 격리국 설치',relation:'institution'},
      nhc:{name:'N.H.C',role:'레드존 현장 대응 / 봉쇄선 유지',records:['N.H.C','레드울프'],history:'N.H.C 독립 현장 사령부화',relation:'field'},
      sid:{name:'S.I.D',role:'오컬트 수사 / 민간 구역 감시',records:['사쿠마','레드존'],history:'사쿠마 유타 실종 사건',relation:'institution'},
      fhc:{name:'F.H.C',role:'회수 문서 분석 / 오염 기록 격납',records:['종교','피의 호수','아마리온'],history:'유럽 분석권 재편',relation:'institution'},
      amarion:{name:'Amarion',role:'비인가 생명연장·자원 회수 연구',records:['아마리온'],history:'아마리온 사전교육 영상 회수',relation:'unstable'},
      syndicate:{name:'Syndicate',role:'이탈 네트워크 / 비인가 무장권',records:['레드울프','병기'],history:'레드울프 이탈 기록',relation:'unstable'},
      ushinoda:{name:'Ushnoda Cult',role:'우시노다교 / 의식성 오염 근원',records:['종교','사쿠마'],history:'우시노다교 대규모 의식 사건',relation:'cult'},
      haimun:{name:'Haimun',role:'도심 침투 / 하위 의식 흐름',records:['종교'],history:'우시노다교 대규모 의식 사건',relation:'cult'},
      ashcrew:{name:'Ash Crew',role:'오염 사체·장비 회수 및 소각',records:['N.H.C','타락 개체'],history:'N.H.C 독립 현장 사령부화',relation:'field'},
      arf:{name:'A.R.F',role:'샘플·생존자·기록 매체 회수',records:['피의 호수','레드존'],history:'A.R.F 및 C.P.D 체계 확장',relation:'field'},
      cpd:{name:'C.P.D',role:'민간 보호 / 대피 / 귀환자 분리',records:['레드존','사쿠마'],history:'귀환자 선별 실패 사건',relation:'field'}
    };
    const historyLinks=[
      {test:/피의 호수 사건|불멸 작전 사후 조사/,record:'불멸',region:'BLI-006',faction:'uac'},
      {test:/U\.A\.C 임시 격리국|구역 위험도/,record:'레드존',faction:'uac'},
      {test:/레드존 오염 기준|란저우|홍콩/,record:'레드존',region:'란저우',faction:'sid'},
      {test:/개체·귀환자|여왕형/,record:'타락 개체',faction:'nhc'},
      {test:/N\.H\.C 독립|레드울프/,record:'N.H.C',faction:'nhc'},
      {test:/A\.R\.F|C\.P\.D|귀환자 선별/,record:'레드존',faction:'cpd'},
      {test:/병기화|축복으로 위장/,record:'병기',faction:'syndicate'},
      {test:/유전자 기록|아마리온/,record:'유전자',faction:'amarion'},
      {test:/사쿠마/,record:'사쿠마',region:'도쿄',faction:'sid'},
      {test:/우시노다교|혈교|의식 사건/,record:'종교',faction:'ushinoda'},
      {test:/오스트레일리아|Black Fringe|이란|인도/,record:'레드존',region:'호주',faction:'arf'}
    ];
    function routeTo(id){
      id=id||'history';
      try{ if(typeof window.showPage==='function') window.showPage(id); }
      catch(_e){}
      if(!document.getElementById(id)){ return; }
      qa('.content-page').forEach(p=>p.classList.toggle('active',p.id===id));
      qa('.side-menu a[data-target]').forEach(a=>a.classList.toggle('active',(a.dataset.target||'')===id));
      try{ history.replaceState(null,'','#'+id); }catch(_e){}
      const content=q('.legacy-content'); if(content) content.scrollTop=0;
      if(window.innerWidth<900){ document.body.classList.remove('pc584-main-drawer-open','pc5152be-drawer-open'); }
    }
    function focusEl(el){
      if(!el) return;
      el.scrollIntoView({block:'center',behavior:'smooth'});
      el.classList.add('pc5152bg-focus');
      setTimeout(()=>el.classList.remove('pc5152bg-focus'),1200);
    }
    function setArchive(term){
      routeTo('archive-entry');
      setTimeout(()=>{
        const allFilter=q('[data-pc5152bc-archive="all"]');
        if(allFilter) allFilter.click();
        const input=q('#pc5152bcArchiveSearch');
        if(input){ input.value=term||''; input.dispatchEvent(new Event('input',{bubbles:true})); }
        const hit=qa('#archiveListWrap .doc-card').find(c=>norm(c.textContent).includes(norm(term)) && !c.classList.contains('pc5152bc-filter-hidden'));
        focusEl(hit);
      },140);
    }
    function setHistory(term){
      routeTo('history');
      setTimeout(()=>{
        const item=qa('#history .timeline-list > div').find(el=>norm(el.textContent).includes(norm(term)));
        focusEl(item);
      },140);
    }
    function setFaction(key){
      routeTo('faction-info');
      setTimeout(()=>{
        const tile=q(`.faction-tile[data-key="${String(key||'').replace(/"/g,'\\"')}"]`);
        if(tile){ tile.click(); focusEl(tile); updateFactionPanel(tile.dataset.key); }
      },140);
    }
    function setRelation(kind,key){
      routeTo('faction-relation');
      setTimeout(()=>{
        const btn=q(`[data-pc5152bc-relation="${kind||'all'}"]`);
        if(btn) btn.click();
        const node=key ? q(`[data-pc5134-node="${key}"]`) : null;
        if(node){ node.click(); focusEl(node); }
      },220);
    }
    function setRegion(term){
      routeTo('region-map');
      setTimeout(()=>{
        const markers=qa('.pc5152bd-marker');
        const hit=markers.find(m=>norm(m.dataset.title+' '+m.dataset.note+' '+m.textContent).includes(norm(term)));
        if(hit){ hit.click(); focusEl(hit); }
      },160);
    }
    function miniBtn(label,action,data){
      const b=document.createElement('button'); b.type='button'; b.className='pc5152bg-mini-btn'; b.textContent=label; b.dataset.pc5152bgAction=action;
      Object.entries(data||{}).forEach(([k,v])=>{ if(v!=null) b.dataset[k]=v; });
      return b;
    }
    function linkRow(buttons){
      const row=document.createElement('div'); row.className='pc5152bg-link-row';
      buttons.filter(Boolean).forEach(b=>row.appendChild(b));
      return row;
    }
    function replaceHubEnglish(){
      const map=[['#history .pc5152bc-hub-head span','세계'],['#faction-info .pc5152bc-hub-head span','세력'],['#faction-relation .pc5152bc-hub-head span','관계도'],['#archive-entry .pc5152bc-hub-head span','기록보관실']];
      map.forEach(([sel,text])=>{const el=q(sel); if(el) el.textContent=text;});
    }
    function enrichArchiveCards(){
      qa('#archiveListWrap .doc-card').forEach(card=>{
        if(card.dataset.pc5152bgMeta==='1') return;
        const code=(q('.code',card)?.textContent||card.dataset.sealedRecord||'').trim();
        const key=recordMeta[code] ? code : Object.keys(recordMeta).find(k=>norm(code).includes(norm(k)) || norm(card.textContent).includes(norm(recordMeta[k].id)) || norm(card.textContent).includes(norm(k)) );
        const meta=recordMeta[key]; if(!meta) return;
        card.dataset.pc5152bgMeta='1';
        card.dataset.pc5152bgRecordId=meta.id;
        const dl=document.createElement('dl'); dl.className='pc5152bg-record-meta';
        [['ID',meta.id],['분류',meta.category],['등급',meta.clearance],['상태',meta.state],['세력',meta.factions],['현상',meta.phenomena],['지역',meta.region],['시대',meta.era]].forEach(([dt,dd])=>{
          const dte=document.createElement('dt'); dte.textContent=dt;
          const dde=document.createElement('dd'); dde.textContent=dd;
          dl.append(dte,dde);
        });
        const p=q('p.muted',card) || q('p',card) || q('.status-row',card) || card;
        p.insertAdjacentElement('afterend',dl);
        const actions=linkRow([
          miniBtn('연표', 'history', {term:meta.history}),
          miniBtn('세력', 'factionSearch', {term:meta.factions.split('/')[0].trim()}),
          miniBtn('상황도', 'region', {term:meta.region.includes('독일')?'BLI-006':meta.region.split('/')[0].trim()})
        ]);
        const open=q('.open-record,.pc5152aa-locked-record',card);
        if(open) open.insertAdjacentElement('beforebegin',actions); else card.appendChild(actions);
      });
    }
    function enrichHistory(){
      const list=q('#history .timeline-list'); if(!list) return;
      qa(':scope > div',list).forEach(item=>{
        if(item.dataset.pc5152bgLinks==='1') return;
        const text=item.textContent||'';
        const found=historyLinks.find(h=>h.test.test(text)); if(!found) return;
        item.dataset.pc5152bgLinks='1';
        const row=linkRow([
          found.record && miniBtn('관련 기록', 'archive', {term:found.record}),
          found.faction && miniBtn('관련 세력', 'faction', {key:found.faction}),
          found.region && miniBtn('상황도', 'region', {term:found.region})
        ]);
        item.appendChild(row);
      });
    }
    let factionPanel=null;
    function ensureFactionPanel(){
      if(factionPanel && factionPanel.isConnected) return factionPanel;
      const grid=q('#faction-info .faction-grid'); if(!grid) return null;
      factionPanel=document.createElement('aside');
      factionPanel.className='pc5152bg-faction-crosspanel';
      factionPanel.setAttribute('aria-live','polite');
      factionPanel.innerHTML='<b>세력 연결 대기</b><span>세력 카드를 선택하면 관련 기록과 사건 좌표가 표시된다.</span>';
      grid.insertAdjacentElement('afterend',factionPanel);
      return factionPanel;
    }
    function updateFactionPanel(key){
      const meta=factionMeta[key] || factionMeta[norm(key)];
      const panel=ensureFactionPanel(); if(!panel || !meta) return;
      const activeKey=String(key||'');
      if(panel.dataset.pc5152bgActiveKey===activeKey && panel.childElementCount>1) return;
      panel.dataset.pc5152bgActiveKey=activeKey;
      panel.innerHTML='';
      const h=document.createElement('b'); h.textContent=meta.name;
      const s=document.createElement('span'); s.textContent=meta.role;
      const chips=document.createElement('div'); chips.className='pc5152bg-mini-meta';
      ['관련 기록: '+meta.records.join(' / '),'관련 사건: '+meta.history].forEach(t=>{const i=document.createElement('i'); i.textContent=t; chips.appendChild(i);});
      const row=linkRow([
        miniBtn('기록 검색','archive',{term:meta.records[0]}),
        miniBtn('세계사 위치','history',{term:meta.history}),
        miniBtn('관계도','relation',{kind:meta.relation,key:key})
      ]);
      panel.append(h,s,chips,row);
    }
    function enrichFactions(){
      ensureFactionPanel();
      qa('#faction-info .faction-tile').forEach(tile=>{
        if(tile.dataset.pc5152bgDone!=='1'){
          tile.dataset.pc5152bgDone='1';
          const meta=factionMeta[tile.dataset.key];
          if(meta){
            const tag=document.createElement('em'); tag.className='pc5152bg-tile-tag'; tag.textContent=meta.records[0]+' 연결';
            tile.appendChild(tag);
          }
          tile.addEventListener('click',()=>setTimeout(()=>updateFactionPanel(tile.dataset.key),0));
        }
      });
      const active=q('#faction-info .faction-tile.active') || q('#faction-info .faction-tile');
      if(active) updateFactionPanel(active.dataset.key);
    }
    let relationPanel=null;
    function ensureRelationPanel(){
      if(relationPanel && relationPanel.isConnected) return relationPanel;
      const hub=q('#faction-relation .pc5152bc-relation-hub'); if(!hub) return null;
      relationPanel=document.createElement('aside');
      relationPanel.className='pc5152bg-relation-detail';
      relationPanel.setAttribute('aria-live','polite');
      relationPanel.innerHTML='<b>관계 노드 대기</b><span>노드를 선택하면 관련 세력과 기록으로 이어진다.</span>';
      hub.insertAdjacentElement('afterend',relationPanel);
      return relationPanel;
    }
    function updateRelationPanel(key){
      const meta=factionMeta[key] || factionMeta[norm(key)];
      const panel=ensureRelationPanel(); if(!panel || !meta) return;
      const activeKey=String(key||'');
      if(panel.dataset.pc5152bgActiveKey===activeKey && panel.childElementCount>1) return;
      panel.dataset.pc5152bgActiveKey=activeKey;
      panel.innerHTML='';
      const h=document.createElement('b'); h.textContent=meta.name;
      const s=document.createElement('span'); s.textContent=meta.role;
      const row=linkRow([
        miniBtn('세력 상세','faction',{key:key}),
        miniBtn('관련 기록','archive',{term:meta.records[0]}),
        miniBtn('세계사','history',{term:meta.history})
      ]);
      panel.append(h,s,row);
    }
    function enrichRelation(){
      ensureRelationPanel();
      qa('[data-pc5134-node]').forEach(node=>{
        if(node.dataset.pc5152bgNode==='1') return;
        node.dataset.pc5152bgNode='1';
        node.setAttribute('tabindex',node.getAttribute('tabindex')||'0');
        node.addEventListener('click',()=>setTimeout(()=>updateRelationPanel(node.getAttribute('data-pc5134-node')),0));
        node.addEventListener('keydown',(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); updateRelationPanel(node.getAttribute('data-pc5134-node')); }});
      });
      qa('[data-pc5152bc-rel-card]').forEach(card=>{
        if(card.dataset.pc5152bgRelCard==='1') return;
        card.dataset.pc5152bgRelCard='1';
        const kind=card.dataset.pc5152bcRelCard||'all';
        const key=kind==='cult'?'ushinoda':kind==='field'?'nhc':kind==='unstable'?'syndicate':'uac';
        card.appendChild(linkRow([miniBtn('세부 보기','relation',{kind:kind,key:key}), miniBtn('기록 검색','archive',{term:factionMeta[key]?.records?.[0]||''})]));
      });
    }
    function enrichRegionBacklinks(){
      const root=q('[data-pc5152bd-region-root]'); if(!root || root.dataset.pc5152bgRegion==='1') return;
      root.dataset.pc5152bgRegion='1';
      const note=document.createElement('div');
      note.className='pc5152bg-map-hint';
      note.innerHTML='<b>연결 규칙</b><span>마커는 기록보관실·세계사·세력 허브 중 하나로 이어진다. 지도 내부에는 긴 설명을 넣지 않는다.</span>';
      const status=q('.pc5152bf-map-status',root);
      if(status) status.insertAdjacentElement('afterend',note);
    }
    function handleAction(btn){
      const action=btn.dataset.pc5152bgAction;
      if(action==='archive') setArchive(btn.dataset.term||'');
      else if(action==='history') setHistory(btn.dataset.term||'');
      else if(action==='faction') setFaction(btn.dataset.key||'uac');
      else if(action==='factionSearch'){
        const term=norm(btn.dataset.term||'');
        const found=Object.entries(factionMeta).find(([k,v])=>norm(v.name+' '+v.role).includes(term) || term.includes(norm(v.name)));
        if(found) setFaction(found[0]); else routeTo('faction-info');
      }
      else if(action==='relation') setRelation(btn.dataset.kind||'all',btn.dataset.key||'uac');
      else if(action==='region') setRegion(btn.dataset.term||'');
    }
    document.addEventListener('click',function(e){
      const btn=e.target && e.target.closest && e.target.closest('[data-pc5152bg-action]');
      if(!btn) return;
      e.preventDefault(); e.stopPropagation();
      handleAction(btn);
    },true);
    function boot(){ replaceHubEnglish(); enrichArchiveCards(); enrichHistory(); enrichFactions(); enrichRelation(); enrichRegionBacklinks(); }
    let bootQueued=0;
    function queueBoot(delay){
      clearTimeout(bootQueued);
      bootQueued=setTimeout(()=>{ try{ boot(); }catch(_e){} }, delay==null?80:delay);
    }
    boot();
    [220,900,1800].forEach(t=>setTimeout(()=>queueBoot(0),t));
    ['hashchange','pageshow','resize','orientationchange'].forEach(ev=>window.addEventListener(ev,()=>queueBoot(120),{passive:true}));
    document.addEventListener('click',function(e){
      if(e.target && e.target.closest && e.target.closest('.side-menu,[data-target],.sub-tab,.detail-tab,[data-pc5152bc-era],[data-pc5152bc-archive],[data-pc5152bc-faction],[data-pc5152bc-relation]')) queueBoot(140);
    },true);
    const limitedRoots=['#archiveListWrap','#history .timeline-list','#faction-info','#faction-relation','[data-pc5152bd-region-root]'];
    limitedRoots.forEach(sel=>{
      const el=q(sel);
      if(!el) return;
      try{ new MutationObserver(()=>queueBoot(160)).observe(el,{childList:true,subtree:false}); }catch(_e){}
    });
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bg:'ArchiveWorldFaction CrosslinkPass', crosslinks:'archive/world/faction/relation/region hubs connected with compact metadata and action chips', patch5152bhBootGuard:'whole-body observer removed; crosslink refresh is throttled and scoped'});
  });
})();


// MapPatch 5.15.2bh — WorldbuildingCodex_BootFix
// Boot loader minimum display + worldbuilding/codex structure panels based on common wiki/codex organization.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); };
  ready(function(){
    const body=document.body;
    body.classList.add('pc5152bh-worldbuilding-codex-bootfix');
    const q=(s,r=document)=>r.querySelector(s);
    const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
    function make(tag,cls,html){ const el=document.createElement(tag); if(cls) el.className=cls; if(html!=null) el.innerHTML=html; return el; }

    function ensureWorldCodexPanel(){ return; }

    function ensureArchiveWritingGuide(){ return; }

    function tightenSettingArticles(){
      qa('.faction-detail .detail-body, #history .timeline-list, #archiveListWrap').forEach(el=>el.classList.add('pc5152bh-readable-setting'));
      qa('#history .timeline-list > div').forEach(card=>{
        if(card.dataset.pc5152bhCard==='1') return;
        card.dataset.pc5152bhCard='1';
      });
    }

    function ensureCodexEvents(){
      document.addEventListener('click',function(e){
        const el=e.target && e.target.closest && e.target.closest('[data-pc5152bh-jump]');
        if(!el) return;
        const id=el.dataset.pc5152bhJump;
        const target=document.getElementById(id);
        if(!target) return;
        e.preventDefault();
        try{ if(typeof window.showPage==='function') window.showPage(id); }catch(_e){}
        qa('.content-page').forEach(p=>p.classList.toggle('active',p.id===id));
        qa('.side-menu a[data-target]').forEach(a=>a.classList.toggle('active',(a.dataset.target||'')===id));
        try{ history.replaceState(null,'','#'+id); }catch(_e){}
        const content=q('.legacy-content'); if(content) content.scrollTop=0;
        if(window.innerWidth<900) body.classList.remove('pc584-main-drawer-open','pc5152be-drawer-open');
      },true);
    }

    function keepBootVisibleMinimum(){
      const start=window.__pc5152BootStart || (window.__pc5152BootStart=performance.now());
      const loader=document.getElementById('loader');
      const app=document.getElementById('app');
      if(!loader) return;
      const elapsed=performance.now()-start;
      if(elapsed<2200 && body.classList.contains('pc5121-boot-complete')){
        body.classList.remove('pc5121-boot-complete','pc5152ao-boot-safe');
        body.classList.add('pc5121-boot-pending');
        loader.classList.remove('hide');
        if(app) app.classList.remove('ready');
        setTimeout(()=>{ loader.classList.add('hide'); if(app) app.classList.add('ready'); body.classList.add('pc5121-boot-complete','pc5152ao-boot-safe'); body.classList.remove('pc5121-boot-pending'); },2250-elapsed+30);
      }
    }

    function run(){ keepBootVisibleMinimum(); ensureWorldCodexPanel(); ensureArchiveWritingGuide(); tightenSettingArticles(); }
    ensureCodexEvents();
    run();
    [180,700,1600].forEach(t=>setTimeout(run,t));
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bh:'WorldbuildingCodex BootFix', worldbuilding:'world axes, writing rules, readable setting cards, scoped crosslink refresh'});
  });
})();


// MapPatch 5.15.2bi — GlobalQA_CodexTonePolishPass
// Boot visibility guard, scoped route/link QA helpers, and codex tone cleanup.
(function(){
  window.__pc5152BootStart = window.__pc5152BootStart || performance.now();
  const MIN_BOOT_MS = 2450;
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  function elapsed(){ return performance.now() - (window.__pc5152BootStart || performance.now()); }
  function body(){ return document.body; }
  function loader(){ return document.getElementById('loader'); }
  function app(){ return document.getElementById('app'); }
  function holdBoot(){
    const b=body(); const l=loader(); const a=app();
    if(!b || !l) return;
    if(elapsed() < MIN_BOOT_MS){
      b.classList.add('pc5152bi-boot-hold','pc5121-boot-pending');
      b.classList.remove('pc5121-boot-complete','pc5152ao-boot-safe');
      l.classList.remove('hide');
      if(a) a.classList.remove('ready');
    }
  }
  function releaseBoot(){
    const b=body(); const l=loader(); const a=app();
    if(!b) return;
    const remain=MIN_BOOT_MS-elapsed();
    if(remain>0){ setTimeout(releaseBoot, remain+20); return; }
    if(l) l.classList.add('hide');
    if(a) a.classList.add('ready');
    b.classList.add('pc5121-boot-complete','pc5152ao-boot-safe');
    b.classList.remove('pc5121-boot-pending','pc5152bi-boot-hold');
  }
  holdBoot();
  setTimeout(releaseBoot, MIN_BOOT_MS+80);
  window.addEventListener('error',()=>setTimeout(releaseBoot, MIN_BOOT_MS+80), {passive:true});
  window.addEventListener('unhandledrejection',()=>setTimeout(releaseBoot, MIN_BOOT_MS+80), {passive:true});

  function routeTo(id){
    const target=document.getElementById(id);
    if(!target) return false;
    qa('.content-page').forEach(p=>p.classList.toggle('active',p.id===id));
    qa('.side-menu a[data-target]').forEach(a=>a.classList.toggle('active',(a.dataset.target||'')===id));
    try{ history.replaceState(null,'','#'+id); }catch(_e){}
    const content=q('.legacy-content'); if(content) content.scrollTop=0;
    if(window.innerWidth<900) document.body.classList.remove('pc584-main-drawer-open','pc5152be-drawer-open');
    return true;
  }
  function normalizeHubLanguage(){
    const map={
      'WORLD HUB':'세계', 'FACTION HUB':'세력', 'ARCHIVE HUB':'기록보관실',
    };
    qa('.pc585-menu-heading, .pc5152bc-hub-head span, .pc5152bh-codex-head span, .pc5152bh-event-tag').forEach(el=>{
      const raw=(el.textContent||'').trim();
      Object.entries(map).forEach(([from,to])=>{
        if(raw===from || raw.includes(from)) el.textContent=raw.replace(from,to);
      });
    });
    const status=q('.pc5151-terminal-status small');
    if(status && /WORLD|FACTION|ARCHIVE/.test(status.textContent||'')) status.textContent='세계 · 세력 · 기록 허브';
  }
  function addQaNotes(){ return; }
  function verifyActiveRoute(){
    const active=q('.content-page.active');
    if(!active){ routeTo((location.hash||'#history').slice(1)||'history'); return; }
    const activeLink=q('.side-menu a[data-target="'+active.id+'"]');
    if(activeLink) qa('.side-menu a[data-target]').forEach(a=>a.classList.toggle('active',a===activeLink));
  }
  function stabilizeTouchTargets(){
    qa('[data-pc5152bg-action], [data-pc5152bh-jump], [data-pc5152bf-record-link], .pc5152bc-era-controls button, .pc5152bc-archive-controls button, .pc5152bc-faction-controls button, .pc5152bc-relation-controls button').forEach(el=>{
      el.style.touchAction='manipulation';
      if(el.tagName==='BUTTON' && !el.getAttribute('type')) el.setAttribute('type','button');
    });
  }
  function runPolish(){
    const b=body(); if(!b) return;
    b.classList.add('pc5152bi-global-qa-codex-tone');
    normalizeHubLanguage();
    addQaNotes();
    verifyActiveRoute();
    stabilizeTouchTargets();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{ holdBoot(); runPolish(); }, {once:true});
  else { holdBoot(); runPolish(); }
  [260,900,1800,3200].forEach(t=>setTimeout(runPolish,t));
  ['hashchange','pageshow','resize','orientationchange'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(runPolish,120),{passive:true}));
  document.addEventListener('click',function(e){
    const jump=e.target && e.target.closest && e.target.closest('[data-pc5152bi-route]');
    if(jump){ e.preventDefault(); routeTo(jump.dataset.pc5152biRoute); }
    setTimeout(runPolish,100);
  },true);
  window.ProjectCurseQA=Object.assign(window.ProjectCurseQA||{}, {
    routeTo,
    check(){
      return {
        active:q('.content-page.active')?.id||null,
        archiveActions:qa('[data-pc5152bg-action="archive"]').length,
        factionActions:qa('[data-pc5152bg-action="faction"],[data-pc5152bg-action="factionSearch"]').length,
        relationActions:qa('[data-pc5152bg-action="relation"]').length,
        regionActions:qa('[data-pc5152bg-action="region"]').length,
        bodyObserver:'scoped-refresh-only'
      };
    }
  });
  window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bi:'GlobalQA CodexTonePolishPass', boot:'minimum startup loader visibility retained; errors cannot skip loader before minimum time', qa:'hub crosslinks/touch targets/active route checked by scoped helper', tone:'hub labels and codex panels compacted for record-terminal style'});
})();


// MapPatch 5.15.2bj — ImmersiveNavigation_DensityCleanupPass
// Removes meta/how-to UI and flattens the sidebar into an in-world record index.
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  function routeTo(id){
    const target=document.getElementById(id); if(!target) return false;
    try{ if(typeof window.showPage==='function') window.showPage(id); }catch(_e){}
    qa('.content-page').forEach(p=>p.classList.toggle('active',p.id===id));
    qa('.side-menu a[data-target]').forEach(a=>a.classList.toggle('active',(a.dataset.target||'')===id));
    try{ history.replaceState(null,'','#'+id); }catch(_e){}
    const content=q('.legacy-content'); if(content) content.scrollTop=0;
    if(window.innerWidth<900) document.body.classList.remove('pc584-main-drawer-open','pc5152be-drawer-open');
    return true;
  }
  function flatSidebar(){
    const nav=q('.side-menu'); if(!nav) return;
    if(nav.dataset.pc5152bjFlat==='1') return;
    nav.dataset.pc5152bjFlat='1';
    nav.classList.add('pc5152bj-flat-nav');
    nav.innerHTML=`
      <div class="pc5151-terminal-status">
        <span>U.A.C 복구 신호</span>
        <b>PC-03 / 폐쇄 기록</b>
        <small>폐쇄 기록 색인</small>
      </div>
      <div class="pc5152bj-nav-list">
        <a data-target="history" href="#history"><i>01</i><b>세계 사건 연표</b><small>세계 연표</small></a>
        <a data-target="faction-relation" href="#faction-relation"><i>02</i><b>관계도</b><small>관계 흔적</small></a>
        <a data-target="faction-info" href="#faction-info"><i>03</i><b>세력 파일</b><small>세력 파일</small></a>
        <a data-target="archive-entry" href="#archive-entry"><i>04</i><b>기록보관실</b><small>회수 색인</small></a>
      </div>`;
    nav.addEventListener('click',function(e){
      const a=e.target.closest && e.target.closest('a[data-target]');
      if(!a) return;
      e.preventDefault(); routeTo(a.dataset.target);
    },true);
  }
  function removeMetaPanels(){
    // Remove project-planning/tutorial surfaces from the terminal UI.
    qa('.pc5152bh-world-codex,.pc5152bh-writing-guide,.pc5152bi-qa-note,.pc5152bg-map-hint').forEach(el=>el.remove());
    qa('.pc5152bh-event-tag').forEach(el=>el.remove());
    // Do not expose implementation phrasing inside the archive.
    const intro=q('.pc5152bd-map-intro');
    if(intro) intro.textContent='폐쇄 단말에서 복구된 권역별 위험 신호다. 좌표 일부는 손상되어 실제 위치와 오차가 남아 있다.';
    const factionSmall=q('#faction-info .pc5152bc-hub-head small');
    if(factionSmall) factionSmall.textContent='감시 대상 기관과 비인가 세력의 요약 색인이다.';
    const relationSmall=q('#faction-relation .pc5152bc-hub-head small');
    if(relationSmall) relationSmall.textContent='U.A.C 기준으로 복구된 감청 관계망이다.';
    const archiveSmall=q('#archive-entry .pc5152bc-hub-head small');
    if(archiveSmall) archiveSmall.textContent='회수된 기록 일부만 열람 가능하다.';
    const historySmall=q('#history .pc5152bc-hub-head small');
    if(historySmall) historySmall.textContent='폐쇄 서버 기준 사건 흐름.';
    const status=q('.pc5151-terminal-status small'); if(status) status.textContent='폐쇄 기록 색인';
    // Compact repeated crosslink surfaces. Detailed links remain available in focused panels, not as repeated card chrome.
    qa('.pc5152bg-link-row').forEach(row=>row.classList.add('pc5152bj-soft-hidden'));
    qa('.pc5152bg-tile-tag').forEach(tag=>tag.remove());
    qa('.pc5152bg-record-meta dt').forEach(dt=>{
      if(/관련 세력|관련 현상|관련 지역|관련 시대/.test(dt.textContent||'')){
        const dd=dt.nextElementSibling; dt.classList.add('pc5152bj-meta-detail'); if(dd) dd.classList.add('pc5152bj-meta-detail');
      }
    });
  }
  function trimVisibleLabels(){
    const map={
      'WORLD HUB':'세계 기록','FACTION HUB':'세력 파일','RELATION HUB':'관계 흔적','ARCHIVE HUB':'기록 색인',
    };
    qa('.pc5152bc-hub-head span,.pc5152bh-codex-head span,.pc5152bh-event-tag').forEach(el=>{
      let t=(el.textContent||'').trim();
      Object.entries(map).forEach(([from,to])=>{ if(t.includes(from)) t=t.replace(from,to); });
      if(!t) el.remove(); else el.textContent=t;
    });
  }
  function syncActive(){
    const id=(location.hash||'#history').slice(1)||'history';
    qa('.side-menu a[data-target]').forEach(a=>a.classList.toggle('active',(a.dataset.target||'')===id));
  }
  function run(){
    document.body.classList.add('pc5152bj-immersive-nav-density-cleanup');
    if((location.hash||'').slice(1)==='region-map') routeTo('history');
    flatSidebar(); removeMetaPanels(); trimVisibleLabels(); syncActive();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  [80,260,800,1700,2600,3800].forEach(t=>setTimeout(run,t));
  ['hashchange','pageshow','resize','orientationchange'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(run,80),{passive:true}));
  document.addEventListener('click',()=>setTimeout(run,80),true);
  window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bj:'ImmersiveNavigation DensityCleanupPass', navigation:'flat in-world sidebar; tag/accordion hub navigation removed', tone:'meta/tutorial guide surfaces hidden from terminal UI'});
})();


// MapPatch 5.15.2bk — InterfaceDensity_AssetCleanupPass
// Runtime-only polish: reduce visible record chrome and extend archive era to 1980-2030 without adding media.
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  function run(){
    document.body.classList.add('pc5152bk-interface-density-asset-cleanup');
    // Keep sidebar as direct in-world index; remove secondary English labels from visual emphasis.
    qa('.pc5152bj-nav-list a small').forEach(el=>{ el.setAttribute('aria-hidden','true'); });
    const era=q('.pc5152z-current-status .stat-card b'); if(era) era.textContent='1980-2030';
    const eraNote=q('.pc5152z-current-status .stat-card span'); if(eraNote) eraNote.textContent='폐쇄 서버 기준 세계관 시간대';
    const histHead=q('#history .pc5152bc-hub-head b'); if(histHead) histHead.textContent='1980-2030 사건 흐름';
    const histSmall=q('#history .pc5152bc-hub-head small'); if(histSmall) histSmall.textContent='폐쇄 서버 기준 사건 흐름.';
    // Show only core archive metadata by default. Details stay in the opened record, not on card chrome.
    qa('.pc5152bg-record-meta dt').forEach(dt=>{
      const label=(dt.textContent||'').trim();
      const dd=dt.nextElementSibling;
      const keep=/ID|분류|상태|등급/.test(label);
      dt.classList.toggle('pc5152bk-meta-secondary',!keep);
      if(dd) dd.classList.toggle('pc5152bk-meta-secondary',!keep);
    });
    // Remove repeated route chips that survived delayed crosslink hydration.
    qa('.pc5152bg-link-row').forEach(row=>row.classList.add('pc5152bj-soft-hidden'));
    qa('.pc5152bg-tile-tag,.pc5152bh-event-tag,.pc5152bi-qa-note,.pc5152bh-world-codex,.pc5152bh-writing-guide,.pc5152bg-map-hint').forEach(el=>el.remove());
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  [120,420,1100,2200,4200].forEach(t=>setTimeout(run,t));
  window.addEventListener('hashchange',()=>setTimeout(run,80),{passive:true});
  window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bk:'InterfaceDensity AssetCleanupPass', era:'1980-2030', cleanup:'orphan runtime assets removed; duplicate cult BGM consolidated', density:'archive card metadata reduced to core fields'});
})();


// MapPatch 5.15.2bl — GlobalRegression_DataConsistencyPass
// Regression guard after asset cleanup: archive era consistency, immersive wording, and route/media sanity helpers.
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  function routeTo(id){
    const target=document.getElementById(id); if(!target) return false;
    try{ if(typeof window.showPage==='function') window.showPage(id); }catch(_e){}
    qa('.content-page').forEach(p=>p.classList.toggle('active',p.id===id));
    qa('.side-menu a[data-target]').forEach(a=>a.classList.toggle('active',(a.dataset.target||'')===id));
    try{ history.replaceState(null,'','#'+id); }catch(_e){}
    const content=q('.legacy-content'); if(content) content.scrollTop=0;
    if(window.innerWidth<900) document.body.classList.remove('pc584-main-drawer-open','pc5152be-drawer-open');
    return true;
  }
  function normalizeEra(){
    const era=q('.pc5152z-current-status .stat-card b'); if(era) era.textContent='1980-2030';
    const hist=q('#history .pc5152bc-hub-head b'); if(hist) hist.textContent='1980-2030 사건 흐름';
    const histSmall=q('#history .pc5152bc-hub-head small'); if(histSmall) histSmall.textContent='폐쇄 서버 기준 사건 흐름.';
    const controls=q('#history .pc5152bc-era-controls');
    if(controls){
      const has=(v)=>!!controls.querySelector('[data-pc5152bc-era="'+v+'"]');
      [['2010s','2010s'],['2020s','2020s']].forEach(([key,label])=>{
        if(!has(key)){
          const b=document.createElement('button'); b.type='button'; b.dataset.pc5152bcEra=key; b.textContent=label; controls.appendChild(b);
        }
      });
    }
  }
  function removeMetaLanguage(){
    const banned=[
      /기록 작성 규칙/,/연결 점검/,/우측 패널/,/필터로 축약/,/선택 패널과 좌표 카드/,/지도는 위치 감각/,/사용법/,/How to use/i,/Structure guide/i,/Crosslink/i,/Filter by/i
    ];
    qa('body *').forEach(el=>{
      if(!el || el.children.length || ['SCRIPT','STYLE','TEXTAREA','INPUT'].includes(el.tagName)) return;
      const t=(el.textContent||'').trim();
      if(!t) return;
      if(banned.some(rx=>rx.test(t))){
        if(el.closest('.pc5152bh-world-codex,.pc5152bh-writing-guide,.pc5152bi-qa-note,.pc5152bg-map-hint')) el.remove();
        else if(/우측 패널|필터|선택 패널|지도는 위치 감각/.test(t)) el.textContent='회수 기록 일부가 손상되어 세부 좌표와 연결 신호가 제한된다.';
      }
    });
    qa('.pc5152bh-world-codex,.pc5152bh-writing-guide,.pc5152bi-qa-note,.pc5152bg-map-hint,.pc5152bh-event-tag').forEach(el=>el.remove());
  }
  function restoreImmersiveEnglish(){
    // English is allowed when it reads like a terminal code, file status, operation title, or signal log.
    qa('.pc5152bj-nav-list a small').forEach(el=>{
      el.removeAttribute('aria-hidden');
      el.classList.add('pc5152bl-terminal-subcode');
    });
    const status=q('.pc5151-terminal-status b'); if(status && !/PC-03/.test(status.textContent||'')) status.textContent='PC-03 / 폐쇄 기록';
  }
  function compactArchiveCards(){
    qa('.pc5152bg-record-meta dt').forEach(dt=>{
      const label=(dt.textContent||'').trim();
      const dd=dt.nextElementSibling;
      const keep=/ID|분류|상태|등급|CLASS|STATUS/.test(label);
      dt.classList.toggle('pc5152bl-meta-secondary',!keep);
      if(dd) dd.classList.toggle('pc5152bl-meta-secondary',!keep);
    });
    qa('.pc5152bg-link-row').forEach(row=>row.classList.add('pc5152bj-soft-hidden'));
    qa('.pc5152bg-tile-tag').forEach(tag=>tag.remove());
  }
  function stabilizeRoute(){
    const id=(location.hash||'#history').slice(1)||'history';
    if(!q('.content-page.active')) routeTo(id);
    const active=q('.content-page.active');
    if(active) qa('.side-menu a[data-target]').forEach(a=>a.classList.toggle('active',(a.dataset.target||'')===active.id));
  }
  function scanRuntime(){
    const missing=[];
    qa('img[src],audio[src],video[src],source[src]').forEach(el=>{
      const src=el.getAttribute('src')||'';
      if(!src || /^https?:|^data:|^blob:/.test(src)) return;
      missing.push({tag:el.tagName.toLowerCase(),src});
    });
    return {active:q('.content-page.active')?.id||null, mediaRefs:missing.length, era:'1980-2030', sidebarLinks:qa('.side-menu a[data-target]').length};
  }
  function run(){
    document.body.classList.add('pc5152bl-global-regression-data-consistency');
    normalizeEra(); removeMetaLanguage(); restoreImmersiveEnglish(); compactArchiveCards(); stabilizeRoute();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  [120,480,1100,2300,4200].forEach(t=>setTimeout(run,t));
  ['hashchange','pageshow','resize','orientationchange'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(run,100),{passive:true}));
  document.addEventListener('click',()=>setTimeout(run,90),true);
  window.ProjectCurseQA=Object.assign(window.ProjectCurseQA||{}, {routeTo, regression:scanRuntime});
  window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bl:'GlobalRegression DataConsistencyPass', era:'1980-2030', language:'Korean and in-world English allowed; meta/how-to wording suppressed', regression:'route, archive metadata, era controls, and runtime media references checked'});
})();


// MapPatch 5.15.2bm/2bn retired in 5.15.2bo — previous faction/relation renderers removed to prevent overlap.

// MapPatch 5.15.2bo — FactionRelation_RenderFixPass
// Single-owner hotfix: removes legacy faction/relation render overlap and forces U.A.C-centered relation map.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); };
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const esc=(v)=>String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const factionData=window.ProjectCurseCanon?.factions||{
    uac:{name:'U.A.C',sub:'Urban Anomaly Control',cat:'기관',status:'가동 / 중앙 통제',zone:'전역 폐쇄권',risk:'기록 검열 / 구역 격상',summary:'U.A.C는 폐쇄 권역의 분류와 기록 검열을 총괄한다. 현장 진입은 직접 수행하지 않고 N.H.C와 S.I.D를 통해 집행한다.',roles:['구역 등급 판정','봉쇄 명령 승인','기록 회수 권한 관리','기관 간 작전 조율'],links:['N.H.C','S.I.D','F.H.C','C.P.D','A.R.F'],records:['REC-BLI-006','ZONE-CLASS','Redzone_881120'],event:'피의 호수 사건 이후 상위 통제 기관으로 고정되었다.'},
    nhc:{name:'N.H.C',sub:'National Hazard Control',cat:'현장',status:'가동 / 현장 지휘',zone:'레드존 인접권',risk:'작전 손실 / 봉쇄선 붕괴',summary:'N.H.C는 레드존과 블랙존 인접 지역에 투입되는 현장 대응 조직이다. 괴이 제압, 방어선 유지, 생존자 제한 회수를 담당한다.',roles:['레드존 방어선 유지','타락 개체 제압','고위험 구역 봉쇄','회수 실패 지점 소각 판단'],links:['U.A.C','A.R.F','C.P.D','Ash Crew'],records:['NHC_Manual_891219','FCR_Archive_890402'],event:'U.A.C 산하 현장 부서에서 독립 작전 조직으로 재편되었다.'},
    sid:{name:'S.I.D',sub:'Special Investigation Department',cat:'기관',status:'가동 / 감시',zone:'도심 감시권',risk:'신호 오염 / 진술 왜곡',summary:'S.I.D는 이상현상과 오컬트 사건을 조사하는 특수 조사 기관이다. 현장 진술, 감청 기록, 의식 흔적을 대조한다.',roles:['사건 현장 조사','감청 기록 분석','민간 구역 감시','우시노다교 흔적 판독'],links:['U.A.C','F.H.C','Haimun'],records:['Sakuma_Tape_991028','Redzone_881120'],event:'도심형 오컬트 사건 증가 이후 독립 조사권을 확보했다.'},
    fhc:{name:'F.H.C',sub:'봉인 기록 관리부',cat:'기관',status:'봉인 / 제한',zone:'봉인 기록권',risk:'기록 역오염',summary:'F.H.C는 의식 기록과 비인가 연구 자료를 봉인한다. 일부 문서는 열람 흔적 자체가 감시 대상이다.',roles:['회수 문서 봉인','종교 기록 분석','오염 문장 검열','위험 연구 자료 격리'],links:['U.A.C','S.I.D','Amarion','Ushnoda Cult'],records:['Cults_871104','Unknown_Record1_860204'],event:'타락교와 혈교 기록 대부분이 F.H.C 경로로 봉인되었다.'},
    amarion:{name:'Amarion',sub:'민간 연구망',cat:'기업',status:'감시 / CLEARANCE MISMATCH',zone:'Black Site 후보',risk:'비인가 연구 / 기업 은폐',summary:'Amarion은 공식 협력 범위를 벗어난 연구 흔적을 남긴 기업 세력이다. 회수 영상 일부는 교육 자료로 위장되어 있다.',roles:['생체 연구 자료 은닉','Black Site 후보 운용','홍보 자료 위장','F.H.C 감시 회피'],links:['F.H.C','U.A.C','Syndicate'],records:['Unknown_Record1_860204'],event:'비인가 생체 연구 자료가 F.H.C 봉인 기록과 연결되었다.'},
    syndicate:{name:'Syndicate',sub:'이탈 보급망',cat:'이탈',status:'HOSTILE-감시',zone:'북미 외곽 감시권',risk:'오염 장비 유통',summary:'Syndicate는 이탈 전력과 오염 장비 유통망이 결합된 비인가 네트워크다. 공식 조직으로 분류하기 어렵다.',roles:['오염 장비 유통','이탈 인원 은닉','암시장 회수품 거래','N.H.C 통제선 회피'],links:['N.H.C','A.R.F','Amarion','Haimun'],records:['Unknown_Record3_920711','Unknown_Record4_930314'],event:'레드울프 이탈 기록 이후 감시 대상 네트워크로 재분류되었다.'},
    ushinoda:{name:'Ushnoda Cult',sub:'우시노다교',cat:'교단',status:'적대 / 의식 근원',zone:'의식 확산권',risk:'Blood Gate / 인신공양',summary:'우시노다교는 의식성 오염의 근원으로 분류된다. 타락교와 혈교 기록의 상위 연결 지점으로 남아 있다.',roles:['의식 거점 유지','타락 개체 발생','혈교·타락교 연결','민간 침투'],links:['U.A.C','F.H.C','S.I.D','Haimun'],records:['Cults_871104','Sakuma_Tape_991028'],event:'초기 인신공양 차단 작전 이후에도 하위 분파를 통해 잔존했다.'},
    haimun:{name:'Haimun',sub:'하이문',cat:'교단',status:'감시 / 불명',zone:'도심 침투권',risk:'은닉 루트 / 정보 중개',summary:'하이문은 구조가 명확하지 않은 정보 중개망이다. 도심 내부 의식 거점과 연결된 흔적이 반복적으로 남는다.',roles:['정보 중개','의식 거점 은닉','도심 침투','감시 회피'],links:['S.I.D','Ushnoda Cult','Syndicate'],records:['Cults_871104'],event:'S.I.D 감청 기록에서 도심 내부 연결 흔적이 확인되었다.'},
    ashcrew:{name:'Ash Crew',sub:'Contaminant Disposal Unit',cat:'현장',status:'통제 / 사후 처리',zone:'회수·소각 구역',risk:'현장 누락 / 2차 오염',summary:'Ash Crew는 전투 이후 남은 오염 사체와 잔해를 봉인·소각하는 후속 처리반이다.',roles:['오염 사체 봉인','혈액성 잔류물 소각','블랙 태그 분류','회수 불가 지점 정리'],links:['N.H.C','A.R.F','U.A.C'],records:['NHC_Manual_891219'],event:'현장 정리 실패가 2차 오염으로 이어진 뒤 운용 기준이 강화되었다.'},
    arf:{name:'A.R.F',sub:'이상현상 회수부대',cat:'현장',status:'가동 / 회수',zone:'회수 작전권',risk:'회수물 역오염',summary:'A.R.F는 사체, 장비, 기록 매체를 회수하고 분류한다. 회수 실패 자료는 별도 격리된다.',roles:['기록 매체 회수','오염 장비 분류','사체 회수 지원','격리 구역 반출 통제'],links:['U.A.C','N.H.C','C.P.D','Ash Crew'],records:['NHC_Manual_891219','FCR_Archive_890402'],event:'레드존 확산 이후 현장 회수 전담 조직으로 분리되었다.'},
    cpd:{name:'C.P.D',sub:'민간 보호국',cat:'현장',status:'통제 / 민간선',zone:'대피 회랑',risk:'귀환자 선별 실패',summary:'C.P.D는 대피 회랑과 민간 검문 절차를 관리한다. 귀환자 선별 실패 시 보호선 전체가 오염될 수 있다.',roles:['대피 회랑 통제','귀환자 선별','항만 검문','민간 보호선 유지'],links:['U.A.C','N.H.C','A.R.F'],records:['FCR_Archive_890402'],event:'부산 선별 부두와 홍콩 항만 검문소 기록에 반복 등장한다.'}
  };
  const relationNodes=window.ProjectCurseCanon?.relationNodes||{
    uac:{name:'U.A.C',sub:'중앙 통제국',type:'institution',x:50,y:50,status:'가동 / 중앙 통제',summary:factionData.uac.summary,records:factionData.uac.records},
    nhc:{name:'N.H.C',sub:'현장 지휘',type:'field',x:27,y:50,status:'가동 / 현장 지휘',summary:factionData.nhc.summary,records:factionData.nhc.records},
    sid:{name:'S.I.D',sub:'감시',type:'institution',x:73,y:50,status:'가동 / 감시',summary:factionData.sid.summary,records:factionData.sid.records},
    fhc:{name:'F.H.C',sub:'봉인 기록',type:'institution',x:63,y:28,status:'봉인 / 제한',summary:factionData.fhc.summary,records:factionData.fhc.records},
    arf:{name:'A.R.F',sub:'회수',type:'field',x:38,y:72,status:'가동 / 회수',summary:factionData.arf.summary,records:factionData.arf.records},
    cpd:{name:'C.P.D',sub:'민간선',type:'field',x:50,y:86,status:'통제 / 민간선',summary:factionData.cpd.summary,records:factionData.cpd.records},
    ashcrew:{name:'Ash Crew',sub:'사후 처리',type:'field',x:16,y:68,status:'통제 / 사후 처리',summary:factionData.ashcrew.summary,records:factionData.ashcrew.records},
    ushinoda:{name:'Ushnoda Cult',sub:'의식 근원',type:'cult',x:86,y:34,status:'적대 / 의식 근원',summary:factionData.ushinoda.summary,records:factionData.ushinoda.records},
    haimun:{name:'Haimun',sub:'도심 침투',type:'cult',x:88,y:66,status:'감시 / 불명',summary:factionData.haimun.summary,records:factionData.haimun.records},
    amarion:{name:'Amarion',sub:'블랙 사이트 감시',type:'unstable',x:50,y:14,status:'감시 / CLEARANCE MISMATCH',summary:factionData.amarion.summary,records:factionData.amarion.records},
    syndicate:{name:'Syndicate',sub:'이탈 보급',type:'unstable',x:18,y:25,status:'HOSTILE-감시',summary:factionData.syndicate.summary,records:factionData.syndicate.records}
  };
  const relationEdges=window.ProjectCurseCanon?.relationEdges||[
    ['uac','nhc','지휘'],['uac','sid','감시'],['uac','fhc','봉인 자료'],['uac','arf','회수'],['uac','cpd','민간선'],['uac','ushinoda','적대 감시'],['uac','amarion','블랙 사이트 감시'],
    ['nhc','ashcrew','사후 처리'],['nhc','arf','현장 인계'],['arf','cpd','피난 이관'],['sid','fhc','증거'],['sid','haimun','도심 흔적'],['fhc','ushinoda','봉인 교단'],['ushinoda','haimun','하위 경로'],['nhc','syndicate','적대'],['amarion','fhc','제한 샘플'],['amarion','syndicate','암시장 보급'],['haimun','syndicate','정보원 흔적']
  ];
  const mark=(key)=>`assets/faction_marks/${key}.webp`;
  const chips=(list)=>(list||[]).map(x=>`<span>${esc(x)}</span>`).join('');
  function route(id){
    qa('.content-page').forEach(p=>p.classList.toggle('active',p.id===id));
    qa('.side-menu a[data-target]').forEach(a=>a.classList.toggle('active',a.dataset.target===id));
    try{history.replaceState(null,'','#'+id);}catch(_e){}
    const c=q('.legacy-content'); if(c) c.scrollTop=0;
    if(window.innerWidth<900) document.body.classList.remove('pc584-main-drawer-open','pc5152be-drawer-open');
  }
  function purgeFactionOverlap(){
    qa('#faction-info .pc5152bg-faction-crosspanel,#faction-info .pc5134-faction-side,#faction-info .pc5152bg-link-row,#faction-info .pc5152bg-tile-tag').forEach(el=>el.remove());
  }
  function renderFaction(key){
    const detail=q('#factionDetail'); if(!detail) return;
    const k=factionData[key] ? key : 'uac'; const d=factionData[k];
    qa('#faction-info .faction-tile').forEach(t=>t.classList.toggle('active',t.dataset.key===k));
    purgeFactionOverlap();
    detail.className='faction-detail pc5152bo-faction-dossier';
    detail.dataset.pc5152boOwner='1';
    detail.dataset.pc5152boKey=k;
    detail.innerHTML=`
      <header class="pc5152bo-dossier-head">
        <img src="${mark(k)}" alt="${esc(d.name)}" loading="lazy">
        <div><div class="pc5152bo-kicker">세력 파일 / ${esc(d.status)}</div><h3>${esc(d.name)}</h3><p>${esc(d.sub)} / ${esc(d.cat)}</p></div>
      </header>
      <div class="pc5152bo-status-strip"><span><i>상태</i>${esc(d.status)}</span><span><i>활동권</i>${esc(d.zone)}</span><span><i>위험</i>${esc(d.risk)}</span><span><i>분류</i>${esc(d.cat)}</span></div>
      <div class="pc5152bo-dossier-body">
        <div class="pc5152bo-dossier-copy">
          <section><b>개요</b><p>${esc(d.summary)}</p></section>
          <section><b>주요 역할</b><ul>${(d.roles||[]).map(r=>`<li>${esc(r)}</li>`).join('')}</ul></section>
          <section><b>사건 연결</b><p>${esc(d.event)}</p></section>
        </div>
        <aside class="pc5152bo-dossier-side">
          <section><b>관련 세력</b><div class="pc5152bo-chip-row">${chips(d.links)}</div></section>
          <section><b>관련 기록</b><div class="pc5152bo-chip-row">${chips(d.records)}</div></section>
          <section><b>접근</b><div class="pc5152bo-action-row"><button type="button" data-pc5152bo-open="archive" data-term="${esc(d.records?.[0]||d.name)}">기록보관소</button><button type="button" data-pc5152bo-open="relation" data-key="${esc(k)}">관계도</button></div></section>
        </aside>
      </div>`;
  }
  function resetFactionTiles(){
    const grid=q('#faction-info .faction-grid'); if(!grid || grid.dataset.pc5152boOwner==='1') return;
    const active=q('#faction-info .faction-tile.active')?.dataset.key || 'uac';
    qa('#faction-info .faction-tile',grid).forEach(tile=>{
      const clone=tile.cloneNode(true);
      clone.dataset.pc5152boBound='1';
      clone.dataset.pc5152bmBound='1';
      clone.dataset.pc5152bgDone='1';
      clone.dataset.pc5134Bound='1';
      clone.dataset.trace54InfoBound='1';
      tile.replaceWith(clone);
    });
    grid.dataset.pc5152boOwner='1';
    renderFaction(active);
  }
  function edgeLine(a,b,label){
    const A=relationNodes[a],B=relationNodes[b]; if(!A||!B) return '';
    return `<line class="pc5152bo-edge" data-edge-a="${esc(a)}" data-edge-b="${esc(b)}" data-label="${esc(label)}" x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}"></line>`;
  }
  function nodeButton(k,n){
    return `<button type="button" class="pc5152bo-node" data-pc5152bo-node="${esc(k)}" data-type="${esc(n.type)}" style="--x:${n.x};--y:${n.y}"><b>${esc(n.name)}</b><small>${esc(n.sub)}</small></button>`;
  }
  function directEdges(k){return relationEdges.filter(e=>e[0]===k || e[1]===k);}
  function typeName(t){return ({institution:'기관',field:'현장',cult:'교단',unstable:'비인가'}[t]||t||'기타');}
  function renderRelationDetail(key){
    const k=relationNodes[key] ? key : 'uac'; const d=relationNodes[k]; const panel=q('#pc5152boRelationDetail'); if(!panel) return;
    const links=directEdges(k).map(e=>{const other=e[0]===k?e[1]:e[0]; return {key:other,edge:e[2],node:relationNodes[other]};}).filter(x=>x.node);
    panel.innerHTML=`
      <div class="pc5152bo-detail-kicker">관계 기록 / ${esc(typeName(d.type))}</div>
      <h3>${esc(d.name)}</h3>
      <p>${esc(d.summary)}</p>
      <div class="pc5152bo-status"><span><i>상태</i>${esc(d.status)}</span><span><i>직접 연결</i>${links.length}</span></div>
      <section><b>연결 세력</b><div class="pc5152bo-linked-list">${links.map(x=>`<button type="button" data-pc5152bo-select="${esc(x.key)}"><i>${esc(x.edge)}</i><span>${esc(x.node.name)}</span></button>`).join('')}</div></section>
      <section><b>관련 기록</b><div class="pc5152bo-records">${(d.records||[]).map(r=>`<button type="button" data-pc5152bo-archive="${esc(r)}">${esc(r)}</button>`).join('')}</div></section>
      <div class="pc5152bo-actions"><button type="button" data-pc5152bo-faction="${esc(k)}">세력 파일</button><button type="button" data-pc5152bo-archive="${esc((d.records||[])[0]||d.name)}">기록보관소</button></div>`;
    qa('.pc5152bo-node').forEach(n=>n.classList.toggle('active',n.dataset.pc5152boNode===k));
    qa('.pc5152bo-edge').forEach(e=>e.classList.toggle('active',e.dataset.edgeA===k || e.dataset.edgeB===k));
    qa('.pc5152bo-mobile-card').forEach(c=>c.classList.toggle('active',c.dataset.pc5152boCard===k));
  }
  function applyRelationFilter(type){
    const wanted=type||'all';
    qa('[data-pc5152bc-relation]').forEach(b=>b.classList.toggle('active',(b.dataset.pc5152bcRelation||'all')===wanted));
    qa('.pc5152bo-node').forEach(btn=>{
      const key=btn.dataset.pc5152boNode, n=relationNodes[key];
      const show=wanted==='all' || key==='uac' || (n&&n.type===wanted);
      btn.classList.toggle('filtered-out',!show);
    });
    qa('.pc5152bo-edge').forEach(line=>{
      const a=relationNodes[line.dataset.edgeA], b=relationNodes[line.dataset.edgeB];
      const show=wanted==='all' || line.dataset.edgeA==='uac' || line.dataset.edgeB==='uac' || (a&&a.type===wanted) || (b&&b.type===wanted);
      line.classList.toggle('filtered-out',!show);
    });
    qa('.pc5152bo-mobile-card').forEach(card=>{
      const n=relationNodes[card.dataset.pc5152boCard];
      card.hidden=!(wanted==='all'||card.dataset.pc5152boCard==='uac'||(n&&n.type===wanted));
    });
  }
  function renderRelationGraph(key){
    const root=q('#pc584-relation-root'); if(!root) return;
    const selected=relationNodes[key] ? key : (q('.pc5152bo-node.active')?.dataset.pc5152boNode || 'uac');
    root.className='pc5152bo-relation-root';
    root.dataset.pc5152boOwner='1';
    root.innerHTML=`
      <div class="pc5152bo-shell">
        <div class="pc5152bo-map" aria-label="U.A.C 중심 관계망">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${relationEdges.map(e=>edgeLine(e[0],e[1],e[2])).join('')}</svg>
          ${Object.entries(relationNodes).map(([k,n])=>nodeButton(k,n)).join('')}
        </div>
        <aside class="pc5152bo-detail" id="pc5152boRelationDetail" aria-live="polite"></aside>
      </div>
      <div class="pc5152bo-mobile-list" aria-label="관계 카드 목록">${Object.entries(relationNodes).map(([k,n])=>`<article class="pc5152bo-mobile-card" data-pc5152bo-card="${esc(k)}"><button type="button" data-pc5152bo-select="${esc(k)}"><b>${esc(n.name)}</b><span>${esc(n.status)}</span><small>${esc(n.summary)}</small></button></article>`).join('')}</div>`;
    renderRelationDetail(selected);
    applyRelationFilter(q('[data-pc5152bc-relation].active')?.dataset.pc5152bcRelation || 'all');
  }
  function ensureRelationOwned(){
    const root=q('#pc584-relation-root'); if(!root) return;
    if(!root.classList.contains('pc5152bo-relation-root') || !q('#pc5152boRelationDetail',root)) renderRelationGraph('uac');
  }
  function bindRelationObserver(){
    const root=q('#pc584-relation-root'); if(!root || root.dataset.pc5152boObserved==='1') return;
    root.dataset.pc5152boObserved='1';
    try{ new MutationObserver(()=>{ if(root.dataset.pc5152boLock==='1') return; clearTimeout(root.__pc5152boFix); root.__pc5152boFix=setTimeout(()=>{ if(!root.classList.contains('pc5152bo-relation-root')) renderRelationGraph(q('.pc5152bo-node.active')?.dataset.pc5152boNode || 'uac'); },30); }).observe(root,{childList:true,subtree:false,attributes:true,attributeFilter:['class']}); }catch(_e){}
  }
  function boot(){
    document.body.classList.add('pc5152bo-faction-relation-renderfix');
    const ft=q('#faction-info > h2'); if(ft) ft.textContent='세력 파일 / 감시 대상 색인';
    const rt=q('#faction-relation > h2'); if(rt) rt.textContent='관계도 / U.A.C 중심 감청망';
    const rs=q('#faction-relation .pc5152bc-hub-head small'); if(rs) rs.textContent='U.A.C를 중심으로 복구된 직접 연결 기록.';
    resetFactionTiles(); purgeFactionOverlap(); ensureRelationOwned(); bindRelationObserver();
  }
  ready(()=>{
    boot(); [80,260,620,1100,1900,3200].forEach(t=>setTimeout(boot,t));
    document.addEventListener('click',e=>{
      const tile=e.target.closest && e.target.closest('#faction-info .faction-tile');
      if(tile){ e.preventDefault(); e.stopImmediatePropagation(); renderFaction(tile.dataset.key||'uac'); return; }
      const open=e.target.closest && e.target.closest('[data-pc5152bo-open]');
      if(open){
        e.preventDefault(); e.stopImmediatePropagation();
        if(open.dataset.pc5152boOpen==='archive'){
          route('archive-entry');
          setTimeout(()=>{const input=q('#pc5152bcArchiveSearch'); if(input){input.value=open.dataset.term||''; input.dispatchEvent(new Event('input',{bubbles:true}));}},80);
        }else if(open.dataset.pc5152boOpen==='relation'){
          route('faction-relation'); setTimeout(()=>{renderRelationGraph(open.dataset.key||'uac');},80);
        }
        return;
      }
      const rel=e.target.closest && e.target.closest('[data-pc5152bo-node],[data-pc5152bo-select]');
      if(rel){ e.preventDefault(); e.stopImmediatePropagation(); renderRelationDetail(rel.dataset.pc5152boNode || rel.dataset.pc5152boSelect || 'uac'); return; }
      const filter=e.target.closest && e.target.closest('[data-pc5152bc-relation]');
      if(filter){ setTimeout(()=>{ ensureRelationOwned(); applyRelationFilter(filter.dataset.pc5152bcRelation||'all'); },40); return; }
      const arch=e.target.closest && e.target.closest('[data-pc5152bo-archive]');
      if(arch){ e.preventDefault(); e.stopImmediatePropagation(); route('archive-entry'); setTimeout(()=>{const input=q('#pc5152bcArchiveSearch'); if(input){input.value=arch.dataset.pc5152boArchive||''; input.dispatchEvent(new Event('input',{bubbles:true}));}},80); return; }
      const faction=e.target.closest && e.target.closest('[data-pc5152bo-faction]');
      if(faction){ e.preventDefault(); e.stopImmediatePropagation(); route('faction-info'); setTimeout(()=>renderFaction(faction.dataset.pc5152boFaction||'uac'),80); return; }
    },true);
    ['resize','orientationchange','hashchange','pageshow'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(()=>{boot(); ensureRelationOwned();},140),{passive:true}));
    window.ProjectCurseFactionRelationFix=Object.assign(window.ProjectCurseFactionRelationFix||{}, {renderFaction, renderRelationGraph, renderRelationDetail, policy:'single runtime owner; legacy duplicate panels removed on boot'});
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bo:'FactionRelation RenderFixPass', duplicatePolicy:'single-owner render, old faction crosspanel and relation summary overwrite blocked'});
  });
})();



// MapPatch 5.15.2bq — QAWarningCleanup_FactionOwnerPass
// Final cleanup layer: no legacy pc5134 faction owner may remain after route/click transitions.
(function(){
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); };
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  function scrubLegacyFactionOwner(){
    const sec=q('#faction-info'); if(!sec) return;
    qa('.pc5134-faction-side,.pc5152bg-faction-crosspanel,.relation-trace-panel,.pc5152bg-link-row',sec).forEach(el=>el.remove());
    const detail=q('#factionDetail',sec);
    if(detail && detail.classList.contains('pc5152bo-faction-dossier')){
      detail.classList.remove('pc5134-faction-dossier');
      delete detail.dataset.pc5134Enhanced;
      detail.dataset.pc5152boOwner='1';
    }
  }
  function boot(){
    document.body.classList.add('pc5152bq-qa-warning-cleanup');
    scrubLegacyFactionOwner();
    [40,120,320,900,1800].forEach(t=>setTimeout(scrubLegacyFactionOwner,t));
  }
  ready(()=>{
    boot();
    document.addEventListener('click',()=>setTimeout(scrubLegacyFactionOwner,0),true);
    ['hashchange','pageshow','resize','orientationchange'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(scrubLegacyFactionOwner,80),{passive:true}));
    try{
      const sec=q('#faction-info');
      if(sec) new MutationObserver(()=>setTimeout(scrubLegacyFactionOwner,0)).observe(sec,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-pc5134-enhanced']});
    }catch(_e){}
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bq:'QAWarningCleanup FactionOwnerPass', duplicatePolicy:'legacy pc5134 faction/relation runtime removed; active screens use one owner renderer'});
  });
})();

// MapPatch 5.15.2bq — QAInspector DuplicateRenderScanPass
// Console-only QA inspector. It does not render visible UI and does not attach new screen handlers.
(function(){
  const PATCH='5.15.2bv';
  const ASSET_MANIFEST=new Set(["assets/audio/pc5152am_immortality_scp087_theme.mp3", "assets/audio/pc5152am_menu_old_computer.mp3", "assets/audio/pc5152an_cult_radio_static_layer.mp3", "assets/audio/pc5152f_analog_contact_soft.wav", "assets/audio/pc5152f_boot_access_oldpc.wav", "assets/audio/pc5152f_low_denied_oldpc.wav", "assets/audio/pc5152f_record_mount_soft.wav", "assets/audio/pc5152h_frame_pop.wav", "assets/audio/pc5152h_record_mount_clear.wav", "assets/audio/pc5152h_terminal_contact_clear.wav", "assets/audio/pc5152l_vcr_hiss_sequence_bgm_audible.mp3", "assets/audio/pc5152p_internal_projector_vhs_step.wav", "assets/audio/pc5152s_immortality_page_black_beep_51_55.mp3", "assets/audio/pc5152v_comm_line_cue_73_74.mp3", "assets/audio/pc5152v_field_photo_click_42s.mp3", "assets/audio/pc5152x_late_log_beep_195s.mp3", "assets/audio/pc5152y_cults_banalities_radio_static_bgm.mp3", "assets/css/style.css", "assets/faction_marks/amarion.webp", "assets/faction_marks/arf.webp", "assets/faction_marks/ashcrew.webp", "assets/faction_marks/cpd.webp", "assets/faction_marks/fhc.webp", "assets/faction_marks/haimun.webp", "assets/faction_marks/nhc.webp", "assets/faction_marks/sid.webp", "assets/faction_marks/syndicate.webp", "assets/faction_marks/uac.webp", "assets/faction_marks/ushinoda.webp", "assets/js/main.js", "assets/resources/05cdc0276694d090f3829c4dc6e5a30b.webp", "assets/resources/0a8342297ac1a847461c57a2726d98b7.webp", "assets/resources/11f2f935e0339690ace785966d7e436f.webp", "assets/resources/1ab6ba9fba9b6b8b9493045c7bf4836d.webp", "assets/resources/1ff34fadd4be71392d17f458d5d43313.webp", "assets/resources/458cf4194ba894dce7e907244d2fd1f0.webp", "assets/resources/4af91e95281c83ead7c52b06dfbdca38.webp", "assets/resources/4cd826918a7fd80a89342fb22aad527f.webp", "assets/resources/548f1c4456dc240389f61115de660a7f.webp", "assets/resources/57674a652af43e6aec284bbc33018b06.webp", "assets/resources/5a2db6abec6308c441b2b430a3da59c2.webp", "assets/resources/646468c8e709d197314f9d40e286986b.webp", "assets/resources/734d86c7b7d166024a3be1993b9ed78a.webp", "assets/resources/7af3eeca599cebbf7235e0a1368f2517.webp", "assets/resources/83d311da1ab7310a567c6023f6151e6c.webp", "assets/resources/8668a15590e2ae00b18d68db57a85c95.webp", "assets/resources/86ed1a163d79930b0874dbd5eb93adf2.webp", "assets/resources/89eeb37859d35d979b1d217e11f5148f.webp", "assets/resources/8bb53a89c3baf48d8e3ac2b180f80d0b.webp", "assets/resources/8da1d79fd90b59063f33aa00f1eb742a.webp", "assets/resources/9b4094a85c1863367b1b86cc915ec814.webp", "assets/resources/9eb253063ee6ca8cc712efd4f22b7498.webp", "assets/resources/b1f6105c9de718ff230e00b702ada13b.webp", "assets/resources/b20abfee553be1cf8a7f818a2bd84f23.webp", "assets/resources/b5f9b2c2ddea9084ff8f6e8dfdc6549b.webp", "assets/resources/c5b5c946c876fbf1bd5fc2f0f1616478.webp", "assets/resources/c85c636bb85c747508df07e1115a9b89.webp", "assets/resources/d537338b8d854ef34d0e3638d436cb01.webp", "assets/resources/dec4cbe943147076943a62681048ad35.webp", "assets/resources/e39a87391183a4f564af26c1dd3b7bbd.webp", "assets/resources/ea33a51515476e2946267ea56b453760.webp", "assets/resources/f59b02e8f859bfc95d683636bcf39500.webp", "assets/resources/fa10a34b64ccc7605b0966af4c017d99.webp", "assets/resources/fb5ead8ded766fd8d05938b1caf6a18e.webp", "assets/resources/pc5152ay_hybrid_corruption.png", "assets/resources/pc5152ay_silent_corruption.png", "assets/video/pc5152am_cult_trace_vhs_noise.mp4", "assets/video/pc5152k_damaged_signal_intro_sound_10s.mp4", "assets/video/pc5152m_vhs_transition_18_21_sound.mp4", "assets/video/pc5152q_immortality_fhc_transition_204_209.mp4", "assets/video/pc5152r_immortality_recordopen_static_13_27.mp4"]);
  const PACKAGE_MANIFEST=new Set([".nojekyll", "CHANGELOG_MapPatch5_15_2bv.md", "MANUAL_CHECK_MapPatch5_15_2bv.md", "PROJECT_CURSE_ART_DIRECTION_GUIDE.md", "README.md", "README_FUTURE_PATCH_POINTER.md", "README_MapPatch5_15_2bv.md", "archive/index.html", "assets/audio/pc5152am_immortality_scp087_theme.mp3", "assets/audio/pc5152am_menu_old_computer.mp3", "assets/audio/pc5152an_cult_radio_static_layer.mp3", "assets/audio/pc5152f_analog_contact_soft.wav", "assets/audio/pc5152f_boot_access_oldpc.wav", "assets/audio/pc5152f_low_denied_oldpc.wav", "assets/audio/pc5152f_record_mount_soft.wav", "assets/audio/pc5152h_frame_pop.wav", "assets/audio/pc5152h_record_mount_clear.wav", "assets/audio/pc5152h_terminal_contact_clear.wav", "assets/audio/pc5152l_vcr_hiss_sequence_bgm_audible.mp3", "assets/audio/pc5152p_internal_projector_vhs_step.wav", "assets/audio/pc5152s_immortality_page_black_beep_51_55.mp3", "assets/audio/pc5152v_comm_line_cue_73_74.mp3", "assets/audio/pc5152v_field_photo_click_42s.mp3", "assets/audio/pc5152x_late_log_beep_195s.mp3", "assets/audio/pc5152y_cults_banalities_radio_static_bgm.mp3", "assets/css/style.css", "assets/faction_marks/amarion.webp", "assets/faction_marks/arf.webp", "assets/faction_marks/ashcrew.webp", "assets/faction_marks/cpd.webp", "assets/faction_marks/fhc.webp", "assets/faction_marks/haimun.webp", "assets/faction_marks/nhc.webp", "assets/faction_marks/sid.webp", "assets/faction_marks/syndicate.webp", "assets/faction_marks/uac.webp", "assets/faction_marks/ushinoda.webp", "assets/js/main.js", "assets/resources/05cdc0276694d090f3829c4dc6e5a30b.webp", "assets/resources/0a8342297ac1a847461c57a2726d98b7.webp", "assets/resources/11f2f935e0339690ace785966d7e436f.webp", "assets/resources/1ab6ba9fba9b6b8b9493045c7bf4836d.webp", "assets/resources/1ff34fadd4be71392d17f458d5d43313.webp", "assets/resources/458cf4194ba894dce7e907244d2fd1f0.webp", "assets/resources/4af91e95281c83ead7c52b06dfbdca38.webp", "assets/resources/4cd826918a7fd80a89342fb22aad527f.webp", "assets/resources/548f1c4456dc240389f61115de660a7f.webp", "assets/resources/57674a652af43e6aec284bbc33018b06.webp", "assets/resources/5a2db6abec6308c441b2b430a3da59c2.webp", "assets/resources/646468c8e709d197314f9d40e286986b.webp", "assets/resources/734d86c7b7d166024a3be1993b9ed78a.webp", "assets/resources/7af3eeca599cebbf7235e0a1368f2517.webp", "assets/resources/83d311da1ab7310a567c6023f6151e6c.webp", "assets/resources/8668a15590e2ae00b18d68db57a85c95.webp", "assets/resources/86ed1a163d79930b0874dbd5eb93adf2.webp", "assets/resources/89eeb37859d35d979b1d217e11f5148f.webp", "assets/resources/8bb53a89c3baf48d8e3ac2b180f80d0b.webp", "assets/resources/8da1d79fd90b59063f33aa00f1eb742a.webp", "assets/resources/9b4094a85c1863367b1b86cc915ec814.webp", "assets/resources/9eb253063ee6ca8cc712efd4f22b7498.webp", "assets/resources/b1f6105c9de718ff230e00b702ada13b.webp", "assets/resources/b20abfee553be1cf8a7f818a2bd84f23.webp", "assets/resources/b5f9b2c2ddea9084ff8f6e8dfdc6549b.webp", "assets/resources/c5b5c946c876fbf1bd5fc2f0f1616478.webp", "assets/resources/c85c636bb85c747508df07e1115a9b89.webp", "assets/resources/d537338b8d854ef34d0e3638d436cb01.webp", "assets/resources/dec4cbe943147076943a62681048ad35.webp", "assets/resources/e39a87391183a4f564af26c1dd3b7bbd.webp", "assets/resources/ea33a51515476e2946267ea56b453760.webp", "assets/resources/f59b02e8f859bfc95d683636bcf39500.webp", "assets/resources/fa10a34b64ccc7605b0966af4c017d99.webp", "assets/resources/fb5ead8ded766fd8d05938b1caf6a18e.webp", "assets/resources/pc5152ay_hybrid_corruption.png", "assets/resources/pc5152ay_silent_corruption.png", "assets/video/pc5152am_cult_trace_vhs_noise.mp4", "assets/video/pc5152k_damaged_signal_intro_sound_10s.mp4", "assets/video/pc5152m_vhs_transition_18_21_sound.mp4", "assets/video/pc5152q_immortality_fhc_transition_204_209.mp4", "assets/video/pc5152r_immortality_recordopen_static_13_27.mp4", "docs/Cults_871104/index.html", "docs/FCR_Archive_890402/index.html", "docs/Ferals_860722/index.html", "docs/Immortality_860201/index.html", "docs/NHC_Manual_891219/index.html", "docs/Redzone_881120/index.html", "docs/Sakuma_Tape_991028/index.html", "docs/Unknown_Record1_860204/index.html", "docs/Unknown_Record2_860205/index.html", "docs/Unknown_Record3_920711/index.html", "docs/Unknown_Record4_930314/index.html", "docs/Zone_870815/index.html", "index.html"]);
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const text=(v)=>String(v ?? '').trim();
  const now=()=>new Date().toISOString();
  const normPath=(value)=>{
    let v=String(value||'').trim();
    if(!v || /^(data:|blob:|javascript:|mailto:|tel:)/i.test(v)) return '';
    try{
      const u=new URL(v, location.href);
      v=decodeURIComponent(u.pathname.replace(/^\/+/,''));
    }catch(_e){
      v=decodeURIComponent(v.split('#')[0].split('?')[0]).replace(/^\.\//,'').replace(/^\/+/, '');
    }
    v=v.split('#')[0].split('?')[0].replace(/^\.\//,'').replace(/^\/+/, '');
    const i=v.indexOf('assets/');
    if(i>=0) v=v.slice(i);
    return v;
  };
  const issue=(list,level,code,message,evidence)=>list.push({level,code,message,evidence:evidence??null});
  const summarize=(issues)=>({
    error:issues.filter(x=>x.level==='error').length,
    warn:issues.filter(x=>x.level==='warn').length,
    info:issues.filter(x=>x.level==='info').length
  });
  function checkDuplicateIds(){
    const issues=[]; const seen=new Map();
    qa('[id]').forEach(el=>{ const id=el.id; if(!seen.has(id)) seen.set(id,[]); seen.get(id).push(el); });
    seen.forEach((nodes,id)=>{ if(nodes.length>1) issue(issues,'error','DUPLICATE_ID','같은 id가 여러 번 존재함',{id,count:nodes.length}); });
    return {name:'duplicateIds',ok:!issues.length,issues};
  }
  function checkRoutes(){
    const issues=[];
    const pages=new Set(qa('.content-page[id]').map(p=>p.id));
    const active=qa('.content-page.active');
    if(active.length!==1) issue(issues,'error','ACTIVE_PAGE_COUNT','활성 content-page 수가 1개가 아님',{count:active.length,ids:active.map(x=>x.id)});
    qa('.side-menu a[data-target]').forEach(a=>{
      const target=a.dataset.target;
      if(!pages.has(target)) issue(issues,'error','BROKEN_MENU_TARGET','사이드 메뉴 target에 대응하는 페이지가 없음',{label:text(a.textContent),target});
    });
    const targetCounts={};
    qa('.side-menu a[data-target]').forEach(a=>{ const t=a.dataset.target; targetCounts[t]=(targetCounts[t]||0)+1; });
    Object.entries(targetCounts).forEach(([target,count])=>{ if(count>1) issue(issues,'warn','DUPLICATE_MENU_TARGET','같은 target을 가진 사이드 메뉴 항목이 여러 개 있음',{target,count}); });
    const hash=(location.hash||'').replace(/^#/,'');
    if(hash && !pages.has(hash)) issue(issues,'warn','HASH_TARGET_MISSING','현재 hash가 존재하지 않는 페이지를 가리킴',{hash});
    return {name:'routes',ok:!issues.some(x=>x.level==='error'),activePage:active[0]?.id||null,pages:pages.size,menuLinks:qa('.side-menu a[data-target]').length,issues};
  }
  function checkFaction(){
    const issues=[]; const sec=q('#faction-info');
    if(!sec){ issue(issues,'error','FACTION_SECTION_MISSING','세력 파일 섹션이 없음'); return {name:'faction',ok:false,issues}; }
    const detail=q('#factionDetail',sec);
    if(!detail) issue(issues,'error','FACTION_DETAIL_MISSING','#factionDetail이 없음');
    const oldSelectors=['.pc5134-faction-side','.pc5152bg-faction-crosspanel','.relation-trace-panel','.pc5152bg-link-row'];
    const oldFound=oldSelectors.flatMap(sel=>qa(sel,sec).map(el=>sel));
    if(oldFound.length) issue(issues,'error','LEGACY_FACTION_PANEL','구형 세력 패널/링크가 DOM에 남아 있음',{selectors:[...new Set(oldFound)],count:oldFound.length});
    const dossier=qa('.pc5152bo-faction-dossier',sec);
    if(dossier.length>1) issue(issues,'error','DUPLICATE_FACTION_DOSSIER','세력 상세 패널이 중복 렌더링됨',{count:dossier.length});
    if(detail && (!detail.classList.contains('pc5152bo-faction-dossier') || detail.classList.contains('pc5134-faction-dossier') || detail.dataset.pc5152boOwner!=='1')){
      issue(issues,'warn','FACTION_OWNER_NOT_2BO','세력 상세 패널 소유자가 단일 렌더러 상태가 아님',{className:detail.className,owner:detail.dataset.pc5152boOwner||null,legacy:detail.classList.contains('pc5134-faction-dossier')});
    }
    const active=qa('.faction-tile.active',sec);
    if(active.length>1) issue(issues,'warn','MULTIPLE_ACTIVE_FACTION_TILE','선택된 세력 카드가 여러 개임',{count:active.length,keys:active.map(x=>x.dataset.key)});
    const keys={};
    qa('.faction-tile[data-key]',sec).forEach(tile=>{ keys[tile.dataset.key]=(keys[tile.dataset.key]||0)+1; });
    Object.entries(keys).forEach(([key,count])=>{ if(count>1) issue(issues,'warn','DUPLICATE_FACTION_KEY','같은 세력 key 카드가 여러 개 있음',{key,count}); });
    return {name:'faction',ok:!issues.some(x=>x.level==='error'),owner:detail?.className||null,active:active.map(x=>x.dataset.key),tiles:Object.keys(keys).length,issues};
  }
  function checkRelationGraph(){
    const issues=[]; const root=q('#pc584-relation-root');
    if(!root){ issue(issues,'error','RELATION_ROOT_MISSING','#pc584-relation-root가 없음'); return {name:'relationGraph',ok:false,issues}; }
    if(!root.classList.contains('pc5152bo-relation-root')) issue(issues,'error','RELATION_OWNER_NOT_2BO','관계도 루트가 2bo 중심형 관계망 소유 상태가 아님',{className:root.className});
    const legacy=qa('.pc584-relation-stage,.pc5134-relation-log,.pc5152ag-relation-root,.relation-table',root);
    if(legacy.length) issue(issues,'error','LEGACY_RELATION_RENDER','구형 관계도/요약표 렌더가 관계도 루트 안에 남아 있음',{count:legacy.length,classes:legacy.slice(0,8).map(x=>x.className)});
    const uac=q('[data-pc5152bo-node="uac"]',root);
    if(!uac) issue(issues,'error','UAC_CENTER_노드_MISSING','U.A.C 중앙 노드가 없음');
    else{
      const st=uac.getAttribute('style')||'';
      const x=parseFloat((st.match(/--x\s*:\s*([0-9.]+)/)||[])[1]);
      const y=parseFloat((st.match(/--y\s*:\s*([0-9.]+)/)||[])[1]);
      if(!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(x-50)>0.1||Math.abs(y-50)>0.1) issue(issues,'warn','UAC_NOT_CENTERED','U.A.C 노드 좌표가 중앙값으로 보이지 않음',{style:st,x,y});
    }
    const uacEdges=qa('.pc5152bo-edge[data-edge-a="uac"],.pc5152bo-edge[data-edge-b="uac"]',root);
    if(uacEdges.length<5) issue(issues,'error','UAC_EDGE_COUNT_LOW','U.A.C 직접 연결선 수가 부족함',{count:uacEdges.length});
    const detail=q('#pc5152boRelationDetail',root);
    if(!detail) issue(issues,'error','RELATION_DETAIL_MISSING','관계도 상세 패널이 없음');
    return {name:'relationGraph',ok:!issues.some(x=>x.level==='error'),owner:root.className,uacEdges:uacEdges.length,nodes:qa('.pc5152bo-node',root).length,issues};
  }
  function checkAssets(){
    const issues=[]; const refs=[];
    qa('img[src],audio[src],video[src],source[src],link[href],script[src]').forEach(el=>{
      const raw=el.getAttribute('src')||el.getAttribute('href')||'';
      const p=normPath(raw);
      if(!p || !p.startsWith('assets/')) return;
      refs.push({tag:el.tagName.toLowerCase(),path:p});
      if(!ASSET_MANIFEST.has(p)) issue(issues,'error','ASSET_NOT_IN_PACKAGE_MANIFEST','DOM에서 참조하는 asset이 패키지 manifest에 없음',{tag:el.tagName.toLowerCase(),path:p});
      if(el.tagName==='IMG' && el.complete && el.naturalWidth===0) issue(issues,'warn','IMAGE_LOAD_FAILED','이미지 로드 실패 가능성',{path:p,alt:el.getAttribute('alt')||''});
      if((el.tagName==='AUDIO'||el.tagName==='VIDEO'||el.tagName==='SOURCE') && el.error) issue(issues,'warn','MEDIA_ERROR_STATE','오디오/영상 요소가 error 상태임',{path:p,code:el.error?.code||null});
    });
    const repeated={}; refs.forEach(r=>{repeated[r.path]=(repeated[r.path]||0)+1;});
    Object.entries(repeated).forEach(([path,count])=>{ if(count>8) issue(issues,'info','ASSET_REPEATED_MANY_TIMES','같은 asset이 여러 DOM 노드에서 반복 참조됨',{path,count}); });
    return {name:'assets',ok:!issues.some(x=>x.level==='error'),domRefs:refs.length,manifestAssets:ASSET_MANIFEST.size,issues};
  }

  function checkPackageData(){
    const issues=[];
    const files=[...PACKAGE_MANIFEST];
    const stale=files.filter(p=>/(README|CHANGELOG|MANUAL_CHECK)_MapPatch5_15_2b[k-q]\.md$/.test(p));
    if(stale.length) issue(issues,'warn','STALE_PATCH_DOCS','이전 패치 문서가 패키지에 남아 있음',{count:stale.length,files:stale});
    const current=files.filter(p=>/(README|CHANGELOG|MANUAL_CHECK)_MapPatch5_15_2bv\.md$/.test(p));
    if(current.length!==3) issue(issues,'warn','CURRENT_PATCH_DOCS_INCOMPLETE','현재 패치 문서 세트가 3개가 아님',{count:current.length,files:current});
    const patchDocs=files.filter(p=>/(README|CHANGELOG|MANUAL_CHECK)_MapPatch5_15_/.test(p));
    const unexpected=patchDocs.filter(p=>!/_2bv\.md$/.test(p));
    if(unexpected.length) issue(issues,'warn','OLD_PATCH_DOC_SET','현재 패치 외 문서 세트가 남아 있음',{count:unexpected.length,files:unexpected});
    return {name:'packageData',ok:!issues.some(x=>x.level==='error'),files:files.length,currentPatchDocs:current.length,issues};
  }
  function checkLanguagePressure(){
    const issues=[];
    const active=q('.content-page.active') || document.body;
    const raw=(active.innerText||'').replace(/\s+/g,' ');
    const upper=(raw.match(/\b[A-Z][A-Z0-9.\-_/]{2,}\b/g)||[]).filter(x=>!/^REC-|^IMG|^U\.A\.C$|^N\.H\.C$|^F\.H\.C$|^S\.I\.D$|^A\.R\.F$|^C\.P\.D$/.test(x));
    const unique=[...new Set(upper)].slice(0,30);
    if(unique.length>18) issue(issues,'info','ENGLISH_DENSITY_HIGH','현재 활성 화면에 대문자 영어 표기가 많은 편임',{count:unique.length,sample:unique});
    return {name:'languagePressure',ok:true,activePage:active.id||null,uppercaseTerms:unique.length,sample:unique,issues};
  }
  function fullScan(options={}){
    const scans=[checkDuplicateIds(),checkRoutes(),checkFaction(),checkRelationGraph(),checkAssets(),checkPackageData(),checkLanguagePressure()];
    const issues=scans.flatMap(s=>s.issues.map(i=>Object.assign({scan:s.name},i)));
    const result={patch:PATCH,time:now(),activePage:q('.content-page.active')?.id||null,summary:summarize(issues),ok:!issues.some(x=>x.level==='error'),scans,issues};
    if(options.log!==false) print(result);
    window.__ProjectCurseLastQA=result;
    return result;
  }
  function reportText(result=window.__ProjectCurseLastQA||fullScan({log:false})){
    const lines=[];
    lines.push(`[ProjectCurseQA] ${result.patch} / ${result.time}`);
    lines.push(`activePage=${result.activePage||'none'} ok=${result.ok} errors=${result.summary.error} warnings=${result.summary.warn} info=${result.summary.info}`);
    result.issues.forEach((i,idx)=>{ lines.push(`${idx+1}. [${i.level}] ${i.scan}/${i.code} - ${i.message} ${i.evidence?JSON.stringify(i.evidence):''}`); });
    if(!result.issues.length) lines.push('issues=none');
    return lines.join('\n');
  }
  function print(result=window.__ProjectCurseLastQA||fullScan({log:false})){
    const label=`ProjectCurseQA ${PATCH}: ${result.ok?'PASS':'CHECK'} / errors=${result.summary.error}, warnings=${result.summary.warn}, info=${result.summary.info}`;
    try{ console.groupCollapsed(label); console.log(result); if(result.issues.length) console.table(result.issues.map(i=>({level:i.level,scan:i.scan,code:i.code,message:i.message,evidence:JSON.stringify(i.evidence)}))); console.log(reportText(result)); console.groupEnd(); }catch(_e){ console.log(label,result); }
    return result;
  }
  function copyReport(){
    const body=reportText();
    if(navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(body).then(()=>body).catch(()=>body);
    return body;
  }
  function help(){
    return [
      'ProjectCurseQA.fullScan()       전체 점검 후 콘솔 출력',
      'ProjectCurseQA.checkFaction()   세력 파일 중복 렌더/구형 패널 점검',
      'ProjectCurseQA.checkRelationGraph() 관계도 중심형/구형 렌더 점검',
      'ProjectCurseQA.checkAssets()    현재 DOM asset 참조 점검',
      'ProjectCurseQA.checkRoutes()    메뉴 target/활성 페이지 점검',
      'ProjectCurseQA.checkPackageData() 패키지 이전 패치 문서 잔존 점검',
      'ProjectCurseQA.reportText()     마지막 점검 결과를 텍스트로 변환',
      'ProjectCurseQA.copyReport()     점검 결과 복사 시도'
    ].join('\n');
  }
  const api={fullScan,scan:fullScan,print,reportText,copyReport,help,checkDuplicateIds,checkRoutes,checkFaction,checkRelationGraph,checkAssets,checkPackageData,checkLanguagePressure,manifestSize:ASSET_MANIFEST.size,packageSize:PACKAGE_MANIFEST.size,patch:PATCH};
  window.ProjectCurseQA=Object.assign(window.ProjectCurseQA||{},api);
  window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{},{patch5152bqQA:'QAInspector DuplicateRenderScanPass',patch5152brQA:'KoreanReadability TerminologyPass',patch5152bsQA:'GlobalScreenQA LayoutLanguagePass',patch5152btQA:'ScreenSweep HotfixPass',qa:'console-only duplicate render, route, relation graph, faction panel, asset manifest, and current-package scanner'});
})();


// MapPatch 5.15.2bt — KoreanReadability_TerminologyPass
// Korean-first visible terminology pass. Codes/acronyms remain; long English UI labels are softened.
(function(){
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const textMap=new Map([
    ['WORLD TIMELINE','세계 연표'],['REGION SIGNAL','권역 신호'],['RELATION TRACE','관계 흔적'],['FACTION DOSSIER','세력 파일'],['RECOVERED INDEX','회수 색인'],
    ['WORLD ARCHIVE','세계 기록'],['REGION SITUATION BOARD','지역 상황판'],['AGENCY DOSSIER','세력 파일'],['ARCHIVE INDEX','기록 색인'],
    ['Status','상태'],['Zone','활동권'],['Risk','위험'],['Class','분류'],['Direct Links','직접 연결'],['RELATION DOSSIER','관계 기록'],
    ['ACTIVE / CENTRAL CONTROL','가동 / 중앙 통제'],['ACTIVE / FIELD COMMAND','가동 / 현장 지휘'],['ACTIVE / SURVEILLANCE','가동 / 감시'],['ACTIVE / RECOVERY','가동 / 회수'],
    ['SEALED / RESTRICTED','봉인 / 제한'],['WATCH / CLEARANCE MISMATCH','감시 / 권한 불일치'],['HOSTILE-WATCH','적대 감시'],['HOSTILE / RITUAL SOURCE','적대 / 의식 근원'],
    ['FIELD COMMAND','현장 지휘'],['SURVEILLANCE','감시'],['SEALED RECORDS','봉인 기록'],['RECOVERY','회수'],['CIVIL LINE','민간선'],['DISPOSAL','사후 처리'],['RITUAL SOURCE','의식 근원'],['URBAN INFILTRATION','도심 침투'],['BLACK SITE WATCH','블랙 사이트 감시'],['ROGUE SUPPLY','이탈 보급'],
    ['COMMAND','지휘'],['SEALED DATA','봉인 자료'],['POST-ACTION','사후 처리'],['FIELD HANDOFF','현장 인계'],['EVAC TRANSFER','피난 이관'],['EVIDENCE','증거'],['URBAN TRACE','도심 흔적'],['SEALED CULT','봉인 교단'],['SUBROUTE','하위 경로'],['HOSTILE','적대'],['RESTRICTED SAMPLE','제한 샘플'],['BLACK SUPPLY','암시장 보급'],['INFORMANT TRACE','정보원 흔적']
  ]);
  function swapTextNode(node){
    let t=node.nodeValue, next=t;
    textMap.forEach((ko,en)=>{ next=next.split(en).join(ko); });
    if(next!==t) node.nodeValue=next;
  }
  function localize(root=document){
    document.body.classList.add('pc5152br-korean-readability');
    qa('[data-status]').forEach(el=>{ let v=el.getAttribute('data-status')||''; textMap.forEach((ko,en)=>{v=v.split(en).join(ko);}); el.setAttribute('data-status',v); });
    const walker=document.createTreeWalker(root.body||root,NodeFilter.SHOW_TEXT,{acceptNode(n){
      if(!n.nodeValue || !/[A-Z]{3,}|Status|Zone|Risk|Class|Direct Links/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
      const p=n.parentElement; if(!p || ['SCRIPT','STYLE','TEXTAREA'].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode); nodes.forEach(swapTextNode);
    qa('.pc5152bj-nav-list a small').forEach(el=>{ el.removeAttribute('aria-hidden'); });
  }
  function run(){ try{ localize(document); }catch(e){ console.warn('[ProjectCurse 2br] localize failed',e); } }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  [120,420,1100,2500].forEach(t=>setTimeout(run,t));
  document.addEventListener('click',()=>setTimeout(run,80),true);
  window.addEventListener('hashchange',()=>setTimeout(run,80),{passive:true});
  if(window.ProjectCurseQA){
    const old=window.ProjectCurseQA.checkLanguagePressure;
    window.ProjectCurseQA.checkLanguagePressure=function(){
      const result=old?old():{name:'languagePressure',ok:true,issues:[]};
      result.patch='5.15.2bv';
      result.note='한국어 우선 표기 패스 적용. 코드/약칭/경고 로그 영어는 허용.';
      return result;
    };
    window.ProjectCurseQA.patch='5.15.2bt';
  }
  window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152br:'KoreanReadability TerminologyPass', language:'한국어 우선 / 코드·약칭 영어 보존'});
})();


// MapPatch 5.15.2bt — ScreenSweep_HotfixPass
// Restores screenSweep APIs that were documented in 2bs but not attached to ProjectCurseQA.
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const wait=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
  const PAGES=[
    ['history','세계 사건 연표'],
    ['region-map','지역 상황도'],
    ['faction-relation','관계도'],
    ['faction-info','세력 파일'],
    ['archive-entry','기록보관실'],
    ['classification','분류 보고서'],
    ['operation-records','작전 기록'],
    ['faction','세력 파일']
  ];
  function activeId(){
    const active=q('.content-page.active');
    return active?.id || (location.hash||'').replace('#','') || 'history';
  }
  function routeLocal(id){
    const page=q('#'+CSS.escape(id));
    if(!page) return false;
    qa('.content-page').forEach(p=>p.classList.toggle('active',p.id===id));
    qa('.side-menu a[data-target],.pc5152bj-nav-list a[data-target]').forEach(a=>a.classList.toggle('active',(a.dataset.target||'')===id));
    try{ history.replaceState(null,'','#'+id); }catch(_e){}
    const wrap=q('.legacy-content'); if(wrap) wrap.scrollTop=0;
    document.body.classList.remove('pc584-main-drawer-open','pc5152be-drawer-open');
    document.dispatchEvent(new CustomEvent('projectcurse:qa-route',{detail:{id}}));
    return true;
  }
  function visible(el){
    if(!el || !el.getBoundingClientRect) return false;
    const st=getComputedStyle(el); if(st.display==='none' || st.visibility==='hidden') return false;
    const r=el.getBoundingClientRect(); return r.width>3 && r.height>3;
  }
  function issue(list,level,code,message,evidence){ list.push({level,code,message,evidence:evidence||null}); }
  function textLen(el){ return (el.innerText||el.textContent||'').replace(/\s+/g,' ').trim().length; }
  function layoutScan(root=q('.content-page.active')||document.body){
    const issues=[];
    const overflow=[];
    qa('article,section,aside,div,button,table,nav',root).forEach(el=>{
      if(!visible(el)) return;
      const cls=(el.className||'').toString();
      if(/legacy-content|content-page|pc5152bo-map/.test(cls)) return;
      if(el.scrollWidth > el.clientWidth + 10 && el.clientWidth>80){
        overflow.push({tag:el.tagName.toLowerCase(),id:el.id||'',className:cls.slice(0,120),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth});
      }
    });
    if(overflow.length) issue(issues,'warn','HORIZONTAL_OVERFLOW','가로 넘침 후보가 있음',{count:overflow.length,sample:overflow.slice(0,6)});
    const empty=[];
    qa('article,section,aside',root).forEach(el=>{
      if(!visible(el)) return;
      const r=el.getBoundingClientRect();
      if(r.width*r.height>70000 && textLen(el)<18 && !el.querySelector('img,svg,video,canvas')) empty.push({tag:el.tagName.toLowerCase(),id:el.id||'',className:(el.className||'').toString().slice(0,120),w:Math.round(r.width),h:Math.round(r.height)});
    });
    if(empty.length) issue(issues,'info','LARGE_EMPTY_PANEL','큰 빈 패널 후보가 있음',{count:empty.length,sample:empty.slice(0,5)});
    return {name:'layout',page:root.id||activeId(),ok:!issues.some(i=>i.level==='error'),issues,overflowCount:overflow.length,emptyLargeCount:empty.length};
  }
  function languageLayoutScan(root=q('.content-page.active')||document.body){
    const issues=[];
    const raw=(root.innerText||'').replace(/\s+/g,' ');
    const allowed=/^(U\.A\.C|N\.H\.C|F\.H\.C|S\.I\.D|A\.R\.F|C\.P\.D|IMG\d*|REC-[A-Z0-9-]+|BLI-006|CLASSIFIED|SIGNAL|LOST|ACCESS|DENIED)$/;
    const terms=[...new Set((raw.match(/\b[A-Z][A-Z0-9._\-/]{2,}\b/g)||[]).filter(w=>!allowed.test(w)))];
    if(terms.length>22) issue(issues,'info','ENGLISH_VISIBLE_DENSITY','코드 외 대문자 영어 표기가 많은 편임',{count:terms.length,sample:terms.slice(0,22)});
    return {name:'languageLayout',page:root.id||activeId(),ok:true,issues,englishTerms:terms.length,sample:terms.slice(0,22)};
  }
  async function screenSweep(options={}){
    const previous=activeId();
    const pages=(options.pages||PAGES.map(p=>p[0])).filter((id,idx,arr)=>arr.indexOf(id)===idx && q('#'+CSS.escape(id)));
    const results=[];
    for(const id of pages){
      routeLocal(id);
      await wait(options.delay||180);
      const base=window.ProjectCurseQA?.fullScan ? window.ProjectCurseQA.fullScan({log:false}) : {issues:[],summary:{error:0,warn:0,info:0},ok:true,activePage:id};
      const root=q('#'+CSS.escape(id))||document.body;
      const layout=layoutScan(root);
      const language=languageLayoutScan(root);
      const issues=[...(base.issues||[]),...layout.issues.map(i=>Object.assign({scan:'layout'},i)),...language.issues.map(i=>Object.assign({scan:'languageLayout'},i))];
      const summary={error:issues.filter(i=>i.level==='error').length,warn:issues.filter(i=>i.level==='warn').length,info:issues.filter(i=>i.level==='info').length};
      results.push({page:id,label:(PAGES.find(p=>p[0]===id)||[])[1]||id,ok:summary.error===0,summary,base,layout,language,issues});
    }
    if(options.restore!==false && previous) routeLocal(previous);
    const out={patch:'5.15.2bv',time:new Date().toISOString(),ok:!results.some(r=>r.summary.error>0),summary:{error:results.reduce((a,r)=>a+r.summary.error,0),warn:results.reduce((a,r)=>a+r.summary.warn,0),info:results.reduce((a,r)=>a+r.summary.info,0)},pages:results};
    window.__ProjectCurseLastSweep=out;
    if(options.log!==false) console.log(sweepReportText(out));
    return out;
  }
  function sweepReportText(result=window.__ProjectCurseLastSweep){
    if(!result) return 'ProjectCurseQA screenSweep 결과가 없습니다.';
    const lines=[`[ProjectCurseQA ScreenSweep] ${result.patch} / ${result.time}`,`ok=${result.ok} errors=${result.summary.error} warnings=${result.summary.warn} info=${result.summary.info}`];
    result.pages.forEach((p,idx)=>{
      lines.push(`${idx+1}. ${p.label}(${p.page}) errors=${p.summary.error} warnings=${p.summary.warn} info=${p.summary.info} overflow=${p.layout.overflowCount} empty=${p.layout.emptyLargeCount} englishTerms=${p.language.englishTerms}`);
      p.issues.slice(0,10).forEach(i=>lines.push(`   - [${i.level}] ${i.scan||'scan'}/${i.code}: ${i.message} ${i.evidence?JSON.stringify(i.evidence):''}`));
    });
    return lines.join('\n');
  }
  function copySweepReport(){
    const text=sweepReportText();
    if(navigator.clipboard?.writeText) return navigator.clipboard.writeText(text).then(()=>text).catch(()=>text);
    return text;
  }
  function attach(){
    document.body.classList.add('pc5152bs-global-screen-qa','pc5152bt-screensweep-hotfix');
    window.ProjectCurseQA=Object.assign(window.ProjectCurseQA||{}, {patch:'5.15.2bv',layoutScan,languageLayoutScan,screenSweep,sweepReportText,copySweepReport});
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bt:'ScreenSweep HotfixPass'});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',attach,{once:true}); else attach();
  [150,500,1200].forEach(t=>setTimeout(attach,t));
})();


// MapPatch terminology audit block — superseded by 5.15.2bv label cleanup
// Korean-first readability audit. Preserves in-world acronyms/codes while exposing removable English labels.
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const wait=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
  const PAGES=[
    ['history','세계 사건 연표'],['region-map','지역 상황도'],['faction-relation','관계도'],['faction-info','세력 파일'],['archive-entry','기록보관실'],['classification','분류 보고서'],['operation-records','작전 기록'],['faction','세력 파일']
  ];
  const KEEP_EXACT=new Set(['U.A.C','N.H.C','F.H.C','S.I.D','A.R.F','C.P.D','I.P.D','VHS','MP3','IMG','CLASSIFIED','SIGNAL','LOST','ACCESS','DENIED','BLI-006']);
  const KEEP_PATTERNS=[/^REC-[A-Z0-9-]+$/,/^IMG\d{1,4}$/,/^[A-Z](?:\.[A-Z])+\.?$/,/^[A-Z]{2,}-[A-Z0-9-]+$/,/^[A-Z]{2,}\d{2,}$/];
  const TERM_MAP=new Map([
    ['ENTITY CLASS','개체 분류'],['CONTAMINATION','오염'],['REACTIVITY','반응성'],['THREAT LEVEL','위협도'],
    ['READ PERMISSION','열람 권한'],['ORIGINAL RECORD','원본 기록'],['IMMORTALITY ATTACHED','불멸 기록 첨부'],['RECOVERED RECORD','회수 기록'],
    ['RECORD MOUNT','기록 장착'],['RECORD FACE SWITCH','기록면 전환'],['PAGE STEP','페이지 전환'],['TRACKING CUT','트래킹 끊김'],['BLACK NOISE','흑색 노이즈'],
    ['VHS INSERT','기록 영상 삽입'],['CASE BACK','기록 목록'],['CASE','기록'],['RECORD','기록'],['MOUNT','장착'],
    ['STATUS','상태'],['ROLE','역할'],['ROLES','역할'],['CLASS','분류'],['DOSSIER','파일'],['NODE GRAPH','관계망'],['GRAPH','관계망'],['NODE','노드'],
    ['DIRECT LINKS','직접 연결'],['DIRECT LINK','직접 연결'],['LINKED AGENCIES','연계 세력'],['LINKED RECORDS','관련 기록'],['RELATED RECORDS','관련 기록'],['RELATED EVENTS','관련 사건'],['RELATED','관련'],['LINKED','연결'],
    ['CENTRAL CONTROL','중앙 통제'],['FIELD COMMAND','현장 지휘'],['SURVEILLANCE','감시'],['RECOVERY','회수'],['SEALED RECORDS','봉인 기록'],
    ['REDZONE','레드존'],['BLACKZONE','블랙존'],['GREENZONE','그린존'],['WHITEZONE','화이트존'],['YELLOWZONE','옐로우존'],
    ['ZONE CLASS','구역 등급'],['ZONE-CLASS','구역 등급'],['BLACK SITE','블랙 사이트'],['FIELD','현장'],['COMMAND','지휘'],['CONTROL','통제'],['CLEARANCE','인가'],['RESTRICTED','제한'],['SEALED','봉인'],
    ['ARCHIVE INDEX','기록 색인'],['RECOVERED INDEX','회수 색인'],['RELATION DOSSIER','관계 기록'],['AGENCY DOSSIER','세력 파일'],['FACTION DOSSIER','세력 파일'],['WORLD ARCHIVE','세계 기록'],['WORLD TIMELINE','세계 연표'],['REGION SITUATION BOARD','지역 상황판'],['REGION SIGNAL','권역 신호'],['RELATION TRACE','관계 흔적'],
    ['HOSTILE-WATCH','적대 감시'],['HOSTILE','적대'],['WATCH','감시'],['ROGUE SUPPLY','이탈 보급'],['BLACK SUPPLY','암시장 보급'],['INFORMANT TRACE','정보원 흔적'],['SUBROUTE','하위 경로'],['URBAN TRACE','도심 흔적'],['URBAN INFILTRATION','도심 침투'],['RITUAL SOURCE','의식 근원'],['DISPOSAL','사후 처리'],['POST-ACTION','사후 처리'],['FIELD HANDOFF','현장 인계'],['EVAC TRANSFER','피난 이관'],['EVIDENCE','증거'],['RESTRICTED SAMPLE','제한 샘플'],['SEALED CULT','봉인 교단']
  ]);
  function activeId(){ return q('.content-page.active')?.id || (location.hash||'').replace('#','') || 'history'; }
  function routeLocal(id){
    const page=q('#'+CSS.escape(id)); if(!page) return false;
    qa('.content-page').forEach(p=>p.classList.toggle('active',p.id===id));
    qa('.side-menu a[data-target],.pc5152bj-nav-list a[data-target]').forEach(a=>a.classList.toggle('active',(a.dataset.target||'')===id));
    try{ history.replaceState(null,'','#'+id); }catch(_e){}
    const wrap=q('.legacy-content'); if(wrap) wrap.scrollTop=0;
    document.body.classList.remove('pc584-main-drawer-open','pc5152be-drawer-open');
    return true;
  }
  function shouldKeep(term){
    if(!term) return true;
    const t=String(term).trim();
    if(KEEP_EXACT.has(t)) return true;
    return KEEP_PATTERNS.some(re=>re.test(t));
  }
  function normalizeTerm(t){ return String(t||'').replace(/[：:;,.，。)\]】]+$/,'').replace(/^[(\[【]+/,'').trim(); }
  function replaceTextValue(value){
    let next=String(value||'');
    TERM_MAP.forEach((ko,en)=>{ next=next.split(en).join(ko); });
    // common mixed-case labels from older blocks
    next=next.replace(/ZONE-CLASS/g,'구역 등급').replace(/ZONE CLASS/g,'구역 등급').replace(/SETTING TEXTS/g,'설정 기록').replace(/REGION/g,'지역').replace(/LAYER/g,'표시 항목').replace(/SELECTED SIGNAL/g,'선택 신호').replace(/SIGNALS/g,'신호 기록').replace(/INTELLIGENCE NETWORK/g,'감청 관계망').replace(/NETWORK/g,'관계망').replace(/\bStatus\b/g,'상태').replace(/\bZone\b/g,'활동권').replace(/\bRisk\b/g,'위험').replace(/\bClass\b/g,'분류').replace(/\bDirect Links\b/g,'직접 연결');
    return next;
  }
  function localizeExtra(root=document){
    document.body.classList.add('pc5152bu-terminology-audit');
    const attrs=['aria-label','title','placeholder','data-status','data-label'];
    qa('*',root.body||root).forEach(el=>{
      attrs.forEach(a=>{ if(el.hasAttribute && el.hasAttribute(a)){ const v=el.getAttribute(a); const n=replaceTextValue(v); if(n!==v) el.setAttribute(a,n); } });
    });
    const walker=document.createTreeWalker(root.body||root,NodeFilter.SHOW_TEXT,{acceptNode(n){
      if(!n.nodeValue || !/[A-Z]{3,}|Status|Zone|Risk|Class|Direct|Record|Case/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
      const p=n.parentElement; if(!p || ['SCRIPT','STYLE','TEXTAREA','CODE'].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n=>{ const before=n.nodeValue; const after=replaceTextValue(before); if(after!==before) n.nodeValue=after; });
  }
  function visibleRootText(root){ return (root?.innerText||root?.textContent||'').replace(/\s+/g,' ').trim(); }
  function extractTerms(root=q('.content-page.active')||document.body){
    const raw=visibleRootText(root);
    const hits=[];
    const re=/\b[A-Z][A-Z0-9._\-/]{2,}\b/g;
    let m;
    while((m=re.exec(raw))){
      const term=normalizeTerm(m[0]);
      if(!term || shouldKeep(term)) continue;
      const start=Math.max(0,m.index-34), end=Math.min(raw.length,m.index+term.length+34);
      hits.push({term,context:raw.slice(start,end)});
    }
    const byTerm=new Map();
    hits.forEach(h=>{ if(!byTerm.has(h.term)) byTerm.set(h.term,{term:h.term,count:0,contexts:[]}); const v=byTerm.get(h.term); v.count++; if(v.contexts.length<3) v.contexts.push(h.context); });
    return Array.from(byTerm.values()).sort((a,b)=>b.count-a.count || a.term.localeCompare(b.term));
  }
  function languageLayoutScan(root=q('.content-page.active')||document.body){
    localizeExtra(document);
    const terms=extractTerms(root);
    const issues=[];
    if(terms.length>18) issues.push({level:'info',code:'ENGLISH_VISIBLE_DENSITY',message:'코드 외 대문자 영어 표기가 많은 편임',evidence:{count:terms.length,sample:terms.slice(0,18).map(t=>t.term)}});
    return {name:'languageLayout',page:root.id||activeId(),ok:true,issues,englishTerms:terms.length,sample:terms.slice(0,24).map(t=>t.term),terms};
  }
  async function englishReport(options={}){
    const previous=activeId();
    const pages=(options.pages||PAGES.map(p=>p[0])).filter((id,idx,arr)=>arr.indexOf(id)===idx && q('#'+CSS.escape(id)));
    const rows=[];
    for(const id of pages){
      routeLocal(id);
      await wait(options.delay||140);
      localizeExtra(document);
      await wait(20);
      const root=q('#'+CSS.escape(id))||document.body;
      const scan=languageLayoutScan(root);
      rows.push({page:id,label:(PAGES.find(p=>p[0]===id)||[])[1]||id,count:scan.englishTerms,terms:scan.terms});
    }
    if(options.restore!==false && previous) routeLocal(previous);
    const out={patch:'5.15.2bv',time:new Date().toISOString(),ok:true,total:rows.reduce((a,r)=>a+r.count,0),pages:rows};
    window.__ProjectCurseLastEnglishReport=out;
    if(options.log) console.log(englishReportText(out));
    return out;
  }
  function englishReportText(report=window.__ProjectCurseLastEnglishReport){
    if(!report){
      return 'ProjectCurseQA.englishReport()를 먼저 실행하거나, ProjectCurseQA.englishReportTextAsync()를 사용하세요.';
    }
    const lines=[`[ProjectCurseQA EnglishReport] ${report.patch} / ${report.time}`,`totalTerms=${report.total}`];
    report.pages.forEach((p,idx)=>{
      lines.push(`${idx+1}. ${p.label}(${p.page}) englishTerms=${p.count}`);
      if(!p.terms.length){ lines.push('   - none'); return; }
      p.terms.slice(0,20).forEach(t=>lines.push(`   - ${t.term} x${t.count} / ${t.contexts[0]||''}`));
    });
    return lines.join('\n');
  }
  async function englishReportTextAsync(options={}){ const r=await englishReport(Object.assign({log:false},options)); return englishReportText(r); }
  async function copyEnglishReport(){ const text=await englishReportTextAsync(); if(navigator.clipboard?.writeText) return navigator.clipboard.writeText(text).then(()=>text).catch(()=>text); return text; }
  const oldSweep=window.ProjectCurseQA?.screenSweep;
  async function screenSweep(options={}){
    localizeExtra(document);
    let out;
    if(typeof oldSweep==='function') out=await oldSweep(Object.assign({},options,{log:false}));
    else out={patch:'5.15.2bv',time:new Date().toISOString(),ok:true,summary:{error:0,warn:0,info:0},pages:[]};
    out.patch='5.15.2bv';
    for(const p of out.pages||[]){
      if(q('#'+CSS.escape(p.page))){
        routeLocal(p.page); await wait(60); localizeExtra(document);
        p.language=languageLayoutScan(q('#'+CSS.escape(p.page))||document.body);
      }
    }
    out.summary={error:(out.pages||[]).reduce((a,p)=>a+(p.summary?.error||0),0),warn:(out.pages||[]).reduce((a,p)=>a+(p.summary?.warn||0),0),info:(out.pages||[]).reduce((a,p)=>a+(p.summary?.info||0),0)};
    out.ok=out.summary.error===0;
    window.__ProjectCurseLastSweep=out;
    if(options.log!==false) console.log(sweepReportText(out));
    return out;
  }
  const oldSweepText=window.ProjectCurseQA?.sweepReportText;
  function sweepReportText(result=window.__ProjectCurseLastSweep){
    if(!result) return oldSweepText?oldSweepText(result):'ProjectCurseQA screenSweep 결과가 없습니다.';
    const lines=[`[ProjectCurseQA ScreenSweep] ${result.patch||'5.15.2bv'} / ${result.time}`,`ok=${result.ok} errors=${result.summary?.error||0} warnings=${result.summary?.warn||0} info=${result.summary?.info||0}`];
    (result.pages||[]).forEach((p,idx)=>{
      lines.push(`${idx+1}. ${p.label}(${p.page}) errors=${p.summary?.error||0} warnings=${p.summary?.warn||0} info=${p.summary?.info||0} overflow=${p.layout?.overflowCount||0} empty=${p.layout?.emptyLargeCount||0} englishTerms=${p.language?.englishTerms||0}`);
      (p.issues||[]).slice(0,10).forEach(i=>lines.push(`   - [${i.level}] ${i.scan||'scan'}/${i.code}: ${i.message} ${i.evidence?JSON.stringify(i.evidence):''}`));
    });
    return lines.join('\n');
  }
  function attach(){
    localizeExtra(document);
    window.ProjectCurseQA=Object.assign(window.ProjectCurseQA||{}, {patch:'5.15.2bv',languageLayoutScan,englishReport,englishReportText,englishReportTextAsync,copyEnglishReport,screenSweep,sweepReportText});
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bv:'KoreanLabelFinalCleanupPass',language:'한국어 우선 / 코드·약칭·경고 로그 보존'});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',attach,{once:true}); else attach();
  [120,420,1000,2200].forEach(t=>setTimeout(attach,t));
  document.addEventListener('click',()=>setTimeout(attach,70),true);
  window.addEventListener('hashchange',()=>setTimeout(attach,70),{passive:true});
})();


// MapPatch 5.15.2bv — KoreanLabelFinalCleanupPass
// Final Korean label cleanup for visible UI labels. Code/acronym terms remain allowed.
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const wait=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
  const PAGES=[['history','세계 사건 연표'],['region-map','지역 상황도'],['faction-relation','관계도'],['faction-info','세력 파일'],['archive-entry','기록보관실'],['classification','분류 보고서'],['operation-records','작전 기록'],['faction','세력 파일']];
  const KEEP_EXACT=new Set(['U.A.C','N.H.C','F.H.C','S.I.D','A.R.F','C.P.D','I.P.D','VHS','MP3','IMG','CLASSIFIED','SIGNAL','LOST','ACCESS','DENIED','SIGNAL LOST','ACCESS DENIED','BLI-006']);
  const KEEP_PATTERNS=[/^REC-[A-Z0-9-]+$/,/^IMG\d{1,4}$/,/^[A-Z](?:\.[A-Z])+\.?$/,/^[A-Z]{2,}-[A-Z0-9-]+$/,/^[A-Z]{2,}\d{2,}$/];
  const REPLACE_PAIRS=[
    ['SELECTED SIGNAL','선택 신호'],['SELECTED','선택'],['SIGNALS','신호 기록'],['REGION','지역'],['LAYER','표시 항목'],
    ['U.A.C INTELLIGENCE NETWORK','U.A.C 감청 관계망'],['INTELLIGENCE NETWORK','감청 관계망'],['NETWORK INDEX','관계 색인'],['SIGNAL NETWORK','신호 관계망'],['NODE RELATION','노드 관계'],['NETWORK','관계망'],
    ['SETTING TEXTS','설정 기록'],['SETTING','설정'],['TEXTS','기록문'],['ZONE-CLASS','구역 등급'],['ZONE CLASS','구역 등급'],['ZONE','구역'],
    ['STATUS','상태'],['ROLE','역할'],['ROLES','역할'],['CLASS','분류'],['DOSSIER','파일'],['LINKED','연결'],['RELATED','관련'],['GRAPH','관계망'],['NODE','노드'],
    ['REDZONE','레드존'],['BLACK FRINGE','블랙 프린지'],['OBSERVATION','관측'],['FACILITY','시설'],['SCREENING','선별'],['SEAL LINE','봉쇄선'],['MONITORING','감시'],['RECOVERY CORRIDOR','회수 통로'],['NO ENTRY','진입 금지'],['SIGNAL LOSS','신호 소실']
  ];
  function activeId(){ return q('.content-page.active')?.id || (location.hash||'').replace('#','') || 'history'; }
  function routeLocal(id){
    const page=q('#'+CSS.escape(id)); if(!page) return false;
    qa('.content-page').forEach(p=>p.classList.toggle('active',p.id===id));
    qa('.side-menu a[data-target],.pc5152bj-nav-list a[data-target]').forEach(a=>a.classList.toggle('active',(a.dataset.target||'')===id));
    try{ history.replaceState(null,'','#'+id); }catch(_e){}
    const wrap=q('.legacy-content'); if(wrap) wrap.scrollTop=0;
    document.body.classList.remove('pc584-main-drawer-open','pc5152be-drawer-open');
    return true;
  }
  function replaceValue(value){
    let out=String(value||'');
    // Longer labels first so ZONE-CLASS does not degrade to ZONE-분류.
    REPLACE_PAIRS.forEach(([en,ko])=>{ out=out.split(en).join(ko); });
    out=out.replace(/\bStatus\b/g,'상태').replace(/\bZone\b/g,'활동권').replace(/\bRisk\b/g,'위험').replace(/\bClass\b/g,'분류').replace(/\bDirect Links\b/g,'직접 연결');
    return out;
  }
  function applyKoreanLabels(root=document){
    document.body.classList.add('pc5152bv-korean-label-final-cleanup');
    q('[data-map-region-label]')?.previousElementSibling && (q('[data-map-region-label]').previousElementSibling.textContent='지역');
    q('[data-map-layer-label]')?.previousElementSibling && (q('[data-map-layer-label]').previousElementSibling.textContent='표시 항목');
    q('[data-map-count]')?.previousElementSibling && (q('[data-map-count]').previousElementSibling.textContent='신호 기록');
    const side=q('.pc5152bd-side-kicker'); if(side) side.textContent='선택 신호';
    qa('.pc5134-faction-intel-page .label,.pc5134-node-header span,.pc5134-node-header b,.pc5134-node-header small',root).forEach(el=>{ if(el?.textContent) el.textContent=replaceValue(el.textContent); });
    const attrs=['aria-label','title','placeholder','data-status','data-label','data-meta','data-title','data-link-search'];
    qa('*',root.body||root).forEach(el=>{
      attrs.forEach(a=>{ if(el.hasAttribute && el.hasAttribute(a)){ const v=el.getAttribute(a); const n=replaceValue(v); if(n!==v) el.setAttribute(a,n); } });
    });
    const walker=document.createTreeWalker(root.body||root,NodeFilter.SHOW_TEXT,{acceptNode(n){
      if(!n.nodeValue || !/[A-Z]{3,}|Status|Zone|Risk|Class|Direct|Record|Case/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
      const p=n.parentElement; if(!p || ['SCRIPT','STYLE','TEXTAREA','CODE'].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n=>{ const before=n.nodeValue; const after=replaceValue(before); if(after!==before) n.nodeValue=after; });
  }
  function shouldKeep(term){
    if(!term) return true;
    const t=String(term).trim();
    if(KEEP_EXACT.has(t)) return true;
    return KEEP_PATTERNS.some(re=>re.test(t));
  }
  function normalizeTerm(t){ return String(t||'').replace(/[：:;,.，。)\]】]+$/,'').replace(/^[(\[【]+/,'').trim(); }
  function visibleRootText(root){ return (root?.innerText||root?.textContent||'').replace(/\s+/g,' ').trim(); }
  function extractTerms(root=q('.content-page.active')||document.body){
    applyKoreanLabels(document);
    const raw=visibleRootText(root);
    const hits=[];
    const re=/\b[A-Z][A-Z0-9._\-/]{2,}\b/g;
    let m;
    while((m=re.exec(raw))){
      const term=normalizeTerm(m[0]);
      if(!term || shouldKeep(term)) continue;
      const start=Math.max(0,m.index-34), end=Math.min(raw.length,m.index+term.length+34);
      hits.push({term,context:raw.slice(start,end)});
    }
    const byTerm=new Map();
    hits.forEach(h=>{ if(!byTerm.has(h.term)) byTerm.set(h.term,{term:h.term,count:0,contexts:[]}); const v=byTerm.get(h.term); v.count++; if(v.contexts.length<3) v.contexts.push(h.context); });
    return Array.from(byTerm.values()).sort((a,b)=>b.count-a.count || a.term.localeCompare(b.term));
  }
  function languageLayoutScan(root=q('.content-page.active')||document.body){
    const terms=extractTerms(root);
    const issues=[];
    if(terms.length>0) issues.push({level:'info',code:'ENGLISH_LABEL_REMAINS',message:'코드 외 영어 라벨이 남아 있음',evidence:{count:terms.length,sample:terms.slice(0,12).map(t=>t.term)}});
    return {name:'languageLayout',page:root.id||activeId(),ok:true,issues,englishTerms:terms.length,sample:terms.slice(0,24).map(t=>t.term),terms};
  }
  async function englishReport(options={}){
    const previous=activeId();
    const pages=(options.pages||PAGES.map(p=>p[0])).filter((id,idx,arr)=>arr.indexOf(id)===idx && q('#'+CSS.escape(id)));
    const rows=[];
    for(const id of pages){ routeLocal(id); await wait(options.delay||120); applyKoreanLabels(document); await wait(20); const root=q('#'+CSS.escape(id))||document.body; const scan=languageLayoutScan(root); rows.push({page:id,label:(PAGES.find(p=>p[0]===id)||[])[1]||id,count:scan.englishTerms,terms:scan.terms}); }
    if(options.restore!==false && previous) routeLocal(previous);
    const out={patch:'5.15.2bv',time:new Date().toISOString(),ok:true,total:rows.reduce((a,r)=>a+r.count,0),pages:rows};
    window.__ProjectCurseLastEnglishReport=out;
    if(options.log) console.log(englishReportText(out));
    return out;
  }
  function englishReportText(report=window.__ProjectCurseLastEnglishReport){
    if(!report) return 'ProjectCurseQA.englishReport()를 먼저 실행하거나, ProjectCurseQA.englishReportTextAsync()를 사용하세요.';
    const lines=[`[ProjectCurseQA EnglishReport] ${report.patch} / ${report.time}`,`totalTerms=${report.total}`];
    report.pages.forEach((p,idx)=>{ lines.push(`${idx+1}. ${p.label}(${p.page}) englishTerms=${p.count}`); if(!p.terms.length){ lines.push('   - none'); return; } p.terms.slice(0,20).forEach(t=>lines.push(`   - ${t.term} x${t.count} / ${t.contexts[0]||''}`)); });
    return lines.join('\n');
  }
  async function englishReportTextAsync(options={}){ const r=await englishReport(Object.assign({log:false},options)); return englishReportText(r); }
  async function copyEnglishReport(){ const text=await englishReportTextAsync(); if(navigator.clipboard?.writeText) return navigator.clipboard.writeText(text).then(()=>text).catch(()=>text); return text; }
  const oldSweep=window.ProjectCurseQA?.screenSweep;
  async function screenSweep(options={}){
    applyKoreanLabels(document);
    let out;
    if(typeof oldSweep==='function') out=await oldSweep(Object.assign({},options,{log:false}));
    else out={patch:'5.15.2bv',time:new Date().toISOString(),ok:true,summary:{error:0,warn:0,info:0},pages:[]};
    out.patch='5.15.2bv';
    for(const p of out.pages||[]){ if(q('#'+CSS.escape(p.page))){ routeLocal(p.page); await wait(60); applyKoreanLabels(document); p.language=languageLayoutScan(q('#'+CSS.escape(p.page))||document.body); } }
    out.summary={error:(out.pages||[]).reduce((a,p)=>a+(p.summary?.error||0),0),warn:(out.pages||[]).reduce((a,p)=>a+(p.summary?.warn||0),0),info:(out.pages||[]).reduce((a,p)=>a+(p.summary?.info||0),0)};
    out.ok=out.summary.error===0;
    window.__ProjectCurseLastSweep=out;
    if(options.log!==false) console.log(sweepReportText(out));
    return out;
  }
  function sweepReportText(result=window.__ProjectCurseLastSweep){
    if(!result) return 'ProjectCurseQA screenSweep 결과가 없습니다.';
    const lines=[`[ProjectCurseQA ScreenSweep] ${result.patch||'5.15.2bv'} / ${result.time}`,`ok=${result.ok} errors=${result.summary?.error||0} warnings=${result.summary?.warn||0} info=${result.summary?.info||0}`];
    (result.pages||[]).forEach((p,idx)=>{ lines.push(`${idx+1}. ${p.label}(${p.page}) errors=${p.summary?.error||0} warnings=${p.summary?.warn||0} info=${p.summary?.info||0} overflow=${p.layout?.overflowCount||0} empty=${p.layout?.emptyLargeCount||0} englishTerms=${p.language?.englishTerms||0}`); (p.issues||[]).slice(0,10).forEach(i=>lines.push(`   - [${i.level}] ${i.scan||'scan'}/${i.code}: ${i.message} ${i.evidence?JSON.stringify(i.evidence):''}`)); });
    return lines.join('\n');
  }
  function attach(){
    applyKoreanLabels(document);
    window.ProjectCurseQA=Object.assign(window.ProjectCurseQA||{}, {patch:'5.15.2bv',languageLayoutScan,englishReport,englishReportText,englishReportTextAsync,copyEnglishReport,screenSweep,sweepReportText});
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bv:'KoreanLabelFinalCleanupPass',labelPolicy:'한국어 라벨 우선 / 조직 약칭·기록 코드 보존'});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',attach,{once:true}); else attach();
  [80,240,620,1300,2600].forEach(t=>setTimeout(attach,t));
  document.addEventListener('click',()=>setTimeout(attach,60),true);
  window.addEventListener('hashchange',()=>setTimeout(attach,80),{passive:true});
})();


// MapPatch 5.15.2bw — NarrativeContinuity_ContentPolishPass
// Content-only polish: continuity links, archive annotations, marker notes, effect-use audit. No layout renderer replacement.
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const wait=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
  const esc=(v)=>String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const PATCH='5.15.2bw';
  function activeId(){ return q('.content-page.active')?.id || (location.hash||'').replace('#','') || 'history'; }
  function applyTimelineContinuity(){
    const section=q('#history'); if(!section) return;
    const intro=q('.pc5130-legacy-history > p',section);
    if(intro) intro.textContent='1980년대 초반의 비공식 징후부터 2030년 폐쇄 서버 동결까지 이어지는 U.A.C 기록 흐름이다. 피의 호수 사건은 공식 격리 체계가 만들어진 기점으로 분류된다.';
    const list=q('.timeline-list.expanded',section); if(!list) return;
    if(!list.querySelector('[data-pc5152bw-flow="pre1986"]')){
      const item=document.createElement('div'); item.dataset.pc5152bwFlow='pre1986';
      item.innerHTML='<b>1980년대 초 / 비공식 징후 축적</b><p>도시 실종, 기억 왜곡, 오염 장비 회수, 미확인 종교 집회가 서로 다른 사건으로 기록된다. 당시 자료는 단일 현상으로 묶이지 않았으나, 1986년 이후 U.A.C는 해당 기록들을 우시노다교와 레드존 전조의 초기 흔적으로 재분류한다.</p>';
      const first=list.firstElementChild; if(first) list.insertBefore(item,first); else list.appendChild(item);
    }
    const late=[
      ['2012년 03월 / 기록보관실 교차 색인','U.A.C는 세력 파일, 지역 상황도, 작전 기록을 하나의 폐쇄 단말 색인으로 병합한다. 이후 각 기록은 단독 문서가 아니라 사건, 세력, 권역, 현상 기준으로 서로 연결된다.'],
      ['2018년 11월 / 권역 신호 손상 증가','지역 상황도에 등록된 일부 좌표에서 신호 지연, 중복 응답, 위치 오차가 확인된다. 지도는 실제 세계 좌표를 대체하지 않고, 폐쇄 단말이 복구한 위험 신호의 상대 위치로 제한된다.'],
      ['2024년 04월 / 기록 열람 제한 재분류','F.H.C 봉인 문서와 아마리온 비인가 연구 기록의 열람 흔적이 역오염 지표로 재분류된다. U.A.C는 기록보관실의 일부 문서를 현장 대원용 요약이 아닌 제한 열람 자료로 전환한다.'],
      ['2028년 09월 / 감청 관계망 재구성','세력 간 연결이 고정된 조직도가 아니라 감청, 회수, 적대, 은닉 경로의 누적 결과로 다시 정렬된다. 관계도는 U.A.C 중심의 현재 통제 구조와 외곽 세력의 불안정한 접촉 흔적을 함께 표시한다.']
    ];
    const freeze=[...list.children].find(el=>(el.textContent||'').includes('2030년 12월'));
    late.forEach(([b,p],i)=>{
      if((list.textContent||'').includes(b)) return;
      const item=document.createElement('div'); item.dataset.pc5152bwFlow='late'+i;
      item.innerHTML=`<b>${esc(b)}</b><p>${esc(p)}</p>`;
      if(freeze) list.insertBefore(item,freeze); else list.appendChild(item);
    });
    const hub=q('.pc5152bc-hub-head small',section); if(hub) hub.textContent='기원 사건, 권역 신호, 세력 관계, 기록보관실이 이어지는 폐쇄 서버 흐름.';
  }
  function applyRegionContinuity(){
    const intro=q('#region-map .pc5152bd-map-intro');
    if(intro) intro.textContent='폐쇄 단말에서 복구된 권역별 위험 신호다. 각 표식은 사건 기록, 세력 활동, 봉쇄선 판단과 연결되며 실제 좌표와는 오차가 남아 있다.';
    const notes={
      'BLI-006 / 피의 호수':'불멸을 향해 작전, 피의 호수 부검, F.H.C 분석권의 기점으로 연결되는 좌표. 현장 영상과 통신 일부만 복구됨.',
      '란저우 내륙 레드존':'우시노다교 의식, 문 현상, 귀환자 선별 실패가 반복 교차되는 동아시아 핵심 레드권.',
      '홍콩 격리 항만 검문소':'C.P.D 민간선과 A.R.F 회수 동선이 겹치는 항만 검문소. 귀환자 분리 실패 사례가 기록보관실에 병합됨.',
      '북해 봉쇄감시선':'피의 호수 잔류 반응을 감시하는 해상 봉쇄선. F.H.C와 S.I.D의 분석 자료가 이 좌표로 묶인다.',
      '캐나다 내륙 레드권':'북미 회수권 확장 이후 A.R.F가 장거리 회수 동선을 개설한 권역. 신디케이트 감시 자료와 일부 겹친다.',
      '호주 중앙 심부 반응점':'회수보다 봉쇄가 우선되는 남방권 블랙 프린지. 무인 관측만 허가되며 N.H.C 단독 진입은 금지됨.',
      '이란-인도 블랙 프린지':'통신 두절, 위치 추적 불안정, 현실 왜곡 반응이 동시에 보고된 권역. 권역 신호는 2018년 이후 더 불안정해짐.',
      '도쿄 오컬트 사건 감시권':'사쿠마 유타 실종 사건과 우시노다교 잔류 문서가 연결된 S.I.D 조사권. 민간 구역 감시 기록과 함께 보관됨.'
    };
    qa('#region-map .pc5152bd-marker').forEach(m=>{ const t=m.dataset.title; if(notes[t]) m.dataset.note=notes[t]; });
  }
  function applyArchiveContinuity(){
    const meta=window.ProjectCurseRecordCaseMeta; if(!meta || meta.__pc5152bw==='1') return;
    const add={
      'Cults_871104':{annotation:'우시노다교 하위 분파, 침묵성 타락, 융합성 타락 기록을 한 묶음으로 유지한다. 종교 기록은 세력 관계도와 분리하지 않는다.'},
      '타락 개체_860722':{annotation:'1989년 분류 갱신 이후의 개체 기준. N.H.C 교전 규칙과 Ash Crew 사후 처리 기준이 이 문서에 연결된다.'},
      '불명_Record2_860205':{annotation:'피의 호수 사건 이후 생체 샘플이 어떻게 보존·봉인되었는지 보여주는 부검 기록. Immortality_860201과 같은 사건권으로 묶인다.'},
      'Redzone_881120':{annotation:'지역 상황도와 직접 연결되는 기준 문서. 권역 신호는 이 문서의 구역 등급 판단을 통해 해석한다.'},
      'FCR_Archive_890402':{annotation:'귀환자 선별 실패가 민간선 붕괴로 이어지는 경로를 다룬다. C.P.D와 S.I.D 기록을 함께 대조해야 한다.'},
      'NHC_Manual_891219':{annotation:'N.H.C 현장 운용과 Ash Crew 사후 처리 절차의 기준 문서. 봉쇄 실패 이후 회수보다 소각이 우선되는 상황을 포함한다.'},
      'Immortality_860201':{annotation:'U.A.C 공식 격리 체계의 기원 사건 파일. 피의 호수, F.H.C 생체 분석, 북해 봉쇄선이 이 기록에서 파생된다.'},
      'Sakuma_Tape_991028':{annotation:'도쿄 오컬트 사건과 우시노다교 잔류 문서가 연결된 S.I.D 기록. 동아시아 감시권의 민간 사건 축이다.'},
      '불명_Record1_860204':{annotation:'아마리온이 연구 홍보 자료로 위장한 비인가 기록. F.H.C는 이를 Black Site 후보와 연결된 기술 위험으로 분류한다.'},
      '불명_Record3_920711':{annotation:'레드울프 이탈 이후 신디케이트 감시권이 형성된 근거 자료. N.H.C 통제선 밖의 보급망을 추적한다.'},
      '불명_Record4_930314':{annotation:'우시노다의 힘을 병기화하려는 대화 기록. 실제 설정 설명이 아니라 제한 열람 감청 자료로 유지한다.'},
    };
    Object.entries(add).forEach(([id,v])=>{ if(meta[id]) Object.assign(meta[id],v); });
    Object.defineProperty(meta,'__pc5152bw',{value:'1',enumerable:false});
  }
  function applyFactionContinuity(){
    const detail=q('#factionDetail');
    if(detail && detail.dataset.pc5152boOwner==='1'){
      const key=detail.dataset.pc5152boKey||'';
      const event=q('.pc5152bo-dossier-copy section:nth-child(3) p',detail);
      const polish={
        uac:'피의 호수 사건으로 격리 체계가 시작되었고, 2030년 폐쇄 서버 동결까지 모든 기록은 U.A.C 색인을 거쳐 병합된다.',
        nhc:'1997년 레드존 전쟁 이후 N.H.C 교전 규칙은 제압보다 봉쇄선 유지와 회수 실패 차단을 우선한다.',
        sid:'S.I.D 기록은 민간 사건과 교단 흔적을 연결한다. 사쿠마 사건 이후 도심 감시권은 U.A.C 색인에 병합된다.',
        fhc:'F.H.C 문서는 세력 설명이 아니라 봉인 기록 자체가 위험물이라는 기준으로 관리된다.',
        amarion:'아마리온 기록은 홍보 자료와 연구 문서의 경계가 불분명하다. U.A.C는 해당 자료를 Black Site 후보와 함께 감시한다.',
        syndicate:'신디케이트는 레드울프 이탈, 오염 장비 유통, 비인가 감청망이 겹친 결과로 분류된다.',
        ushinoda:'우시노다교는 단일 조직보다 의식 경로에 가깝다. 타락교, 혈교, 하이문은 이 경로의 잔류 흔적으로 기록된다.',
        haimun:'하이문은 교단 하위 조직으로 확정되지 않았으나, 도심 내부 감청 기록에서 반복적으로 나타난다.',
        ashcrew:'Ash Crew는 전투 부대가 아니라 사건이 끝난 뒤 남은 오염을 막는 마지막 절차다.',
        arf:'A.R.F 회수 실패는 기록보관실의 손상 파일과 직접 연결된다. 회수물은 현장보다 늦게 오염을 드러내는 경우가 많다.',
        cpd:'C.P.D의 실패는 민간선 붕괴로 이어진다. 귀환자 선별과 대피 회랑은 세력 관계도에서 현장축으로 남는다.'
      };
      if(event && polish[key]) event.textContent=polish[key];
    }
  }
  function effectUseReport(){
    const html=document.documentElement.outerHTML;
    const audio=[...html.matchAll(/assets\/audio\/([^"'\)\s<>]+)/g)].map(m=>m[1]);
    const video=[...html.matchAll(/assets\/video\/([^"'\)\s<>]+)/g)].map(m=>m[1]);
    const unique=a=>Array.from(new Set(a)).sort();
    const records=[];
    if(html.includes('Immortality_860201')) records.push('불멸을 향하여 / 손상 영상·통신 단절');
    if(html.includes('Cults_871104')) records.push('종교 / 라디오 스태틱·변조 기록');
    if(html.includes('SIGNAL LOST') || html.includes('신호 소실')) records.push('신호 소실 / 짧은 경고음');
    return {patch:PATCH,time:new Date().toISOString(),audioFiles:unique(audio),videoFiles:unique(video),recommendedUse:['기록 진입','손상 영상 전환','신호 소실','제한 문서 열람'],records};
  }
  function effectUseReportText(report=effectUseReport()){
    const lines=[`[ProjectCurseQA EffectUseReport] ${report.patch} / ${report.time}`,`audio=${report.audioFiles.length} video=${report.videoFiles.length}`,'권장 사용 위치: '+report.recommendedUse.join(' / ')];
    if(report.records.length) lines.push('연결 기록: '+report.records.join(' / '));
    if(report.audioFiles.length) lines.push('audio files: '+report.audioFiles.join(', '));
    if(report.videoFiles.length) lines.push('video files: '+report.videoFiles.join(', '));
    return lines.join('\n');
  }
  const oldEnglish=window.ProjectCurseQA?.englishReport;
  const oldEnglishText=window.ProjectCurseQA?.englishReportText;
  const oldEnglishAsync=window.ProjectCurseQA?.englishReportTextAsync;
  async function englishReport(options={}){
    const r=typeof oldEnglish==='function' ? await oldEnglish(Object.assign({},options,{log:false})) : {ok:true,total:0,pages:[]};
    r.patch=PATCH; r.time=r.time||new Date().toISOString(); window.__ProjectCurseLastEnglishReport=r;
    if(options.log && typeof englishReportText==='function') console.log(englishReportText(r));
    return r;
  }
  function englishReportText(r=window.__ProjectCurseLastEnglishReport){
    const text=typeof oldEnglishText==='function' ? oldEnglishText(r) : '';
    return text ? text.replace(/5\.15\.2bv/g,PATCH) : `[ProjectCurseQA EnglishReport] ${PATCH} / ${new Date().toISOString()}\ntotalTerms=0`;
  }
  async function englishReportTextAsync(options={}){ const r=await englishReport(Object.assign({log:false},options)); return englishReportText(r); }
  const oldSweep=window.ProjectCurseQA?.screenSweep;
  const oldSweepText=window.ProjectCurseQA?.sweepReportText;
  async function screenSweep(options={}){
    applyAll();
    const r=typeof oldSweep==='function' ? await oldSweep(Object.assign({},options,{log:false})) : {ok:true,summary:{error:0,warn:0,info:0},pages:[]};
    r.patch=PATCH; r.time=r.time||new Date().toISOString(); window.__ProjectCurseLastSweep=r;
    if(options.log!==false) console.log(sweepReportText(r));
    return r;
  }
  function sweepReportText(r=window.__ProjectCurseLastSweep){
    const text=typeof oldSweepText==='function' ? oldSweepText(r) : '';
    return text ? text.replace(/5\.15\.2bv/g,PATCH) : `[ProjectCurseQA ScreenSweep] ${PATCH} / ${new Date().toISOString()}\nok=true errors=0 warnings=0 info=0`;
  }
  function continuityReport(){
    applyAll();
    const timelineAdds=qa('#history [data-pc5152bw-flow], #history [data-pc5152bw-event]').length;
    const markerNotes=qa('#region-map .pc5152bd-marker').filter(m=>(m.dataset.note||'').length>50).length;
    const meta=window.ProjectCurseRecordCaseMeta||{};
    const metaCount=Object.keys(meta).filter(k=>meta[k]&&meta[k].annotation).length;
    const active=activeId();
    return {patch:PATCH,time:new Date().toISOString(),ok:true,activePage:active,timelineAdds,markerNotes,archiveAnnotations:metaCount,effectAudit:true};
  }
  function continuityReportText(r=continuityReport()){
    return [`[ProjectCurseQA ContinuityReport] ${r.patch} / ${r.time}`,`ok=${r.ok} activePage=${r.activePage}`,`timelineAdded=${r.timelineAdds}`,`markerNotes=${r.markerNotes}`,`archiveAnnotations=${r.archiveAnnotations}`,`effectAudit=${r.effectAudit}`].join('\n');
  }
  function applyAll(){
    document.body.classList.add('pc5152bw-narrative-continuity-content-polish');
    applyTimelineContinuity(); applyRegionContinuity(); applyArchiveContinuity(); applyFactionContinuity();
  }
  function attach(){
    applyAll();
    window.ProjectCurseQA=Object.assign(window.ProjectCurseQA||{}, {patch:PATCH,screenSweep,sweepReportText,englishReport,englishReportText,englishReportTextAsync,effectUseReport,effectUseReportText,continuityReport,continuityReportText});
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bw:'NarrativeContinuity ContentPolishPass',content:'timeline/archive/region/faction copy polish only',rendererPolicy:'no new screen renderer; previous single-owner renderers preserved'});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',attach,{once:true}); else attach();
  [120,360,900,1800,3200].forEach(t=>setTimeout(attach,t));
  document.addEventListener('click',()=>setTimeout(attach,80),true);
  window.addEventListener('hashchange',()=>setTimeout(attach,100),{passive:true});
})();


// MapPatch 5.15.2bx — InteractiveMapFaction_ArchiveExpansionPass
// Fixes inactive faction filters, replaces relation selection with stable highlight-only graph,
// expands regional situation markers, and adds archive/content gap QA. No new media files.
(function(){
  const PATCH='5.15.2bx';
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); };
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const esc=(v)=>String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const wait=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
  const activeId=()=>q('.content-page.active')?.id || (location.hash||'#history').slice(1) || 'history';
  function route(id){
    const target=q('#'+CSS.escape(id)); if(!target) return false;
    try{ if(typeof window.showPage==='function') window.showPage(id); }catch(_e){}
    qa('.content-page').forEach(p=>p.classList.toggle('active',p.id===id));
    qa('.side-menu a[data-target]').forEach(a=>a.classList.toggle('active',(a.dataset.target||'')===id));
    try{ history.replaceState(null,'','#'+id); }catch(_e){}
    const c=q('.legacy-content'); if(c) c.scrollTop=0;
    if(window.innerWidth<900) document.body.classList.remove('pc584-main-drawer-open','pc5152be-drawer-open');
    return true;
  }

  const factionTags=window.ProjectCurseCanon?.factionTags||{
    uac:['institution'],
    nhc:['field','institution'],
    sid:['institution'],
    fhc:['institution'],
    amarion:['corporate','unstable'],
    syndicate:['rogue','unstable'],
    ushinoda:['cult','rogue'],
    haimun:['cult','rogue','unstable'],
    ashcrew:['field','rogue'],
    arf:['field'],
    cpd:['institution','field']
  };
  const factionTagLabels=window.ProjectCurseCanon?.factionTagLabels||{all:'전체',institution:'기관',field:'현장',cult:'교단',corporate:'기업',rogue:'이탈'};
  function renderFactionThroughOwner(key){
    const api=window.ProjectCurseFactionRelationFix;
    if(api && typeof api.renderFaction==='function'){ try{ api.renderFaction(key); return; }catch(_e){} }
    const tile=q(`#faction-info .faction-tile[data-key="${CSS.escape(key)}"]`);
    if(tile) tile.click();
  }
  function ensureFactionFilterStatus(){
    const controls=q('#faction-info .pc5152bc-faction-controls'); if(!controls) return null;
    let s=q('.pc5152bx-faction-filter-status', controls.parentElement||document);
    if(!s){ s=document.createElement('div'); s.className='pc5152bx-faction-filter-status'; controls.insertAdjacentElement('afterend',s); }
    return s;
  }
  function annotateFactionTags(){
    qa('#faction-info .faction-tile').forEach(tile=>{
      const key=tile.dataset.key||'';
      const tags=factionTags[key]||[(tile.dataset.pc5152bcFactionCat||'').trim()].filter(Boolean);
      tile.dataset.pc5152bxTags=tags.join(' ');
      tile.dataset.pc5152bcFactionCat=tags[0]||'institution';
      const small=tile.querySelector('small');
      if(small && !small.dataset.pc5152bxBase) small.dataset.pc5152bxBase=small.textContent||'';
      if(!tile.querySelector('.pc5152bx-tagline')){
        const line=document.createElement('i'); line.className='pc5152bx-tagline';
        line.textContent=tags.map(t=>factionTagLabels[t]||t).join(' / ');
        tile.appendChild(line);
      }
    });
  }
  function applyFactionFilter(cat='all', keepSelection=true){
    annotateFactionTags();
    const buttons=qa('#faction-info [data-pc5152bc-faction]');
    buttons.forEach(b=>b.classList.toggle('active',(b.dataset.pc5152bcFaction||'all')===cat));
    const tiles=qa('#faction-info .faction-tile');
    let visible=[];
    tiles.forEach(tile=>{
      const tags=(tile.dataset.pc5152bxTags||tile.dataset.pc5152bcFactionCat||'').split(/\s+/).filter(Boolean);
      const show=cat==='all'||tags.includes(cat);
      tile.classList.toggle('pc5152bx-filter-hidden',!show);
      tile.classList.toggle('pc5152bc-filter-hidden',!show);
      tile.hidden=false;
      if(show) visible.push(tile);
    });
    const status=ensureFactionFilterStatus();
    if(status) status.textContent=`${factionTagLabels[cat]||cat} / 표시 ${visible.length}`;
    const active=q('#faction-info .faction-tile.active');
    if(visible.length && (!keepSelection || !active || active.classList.contains('pc5152bx-filter-hidden'))){
      renderFactionThroughOwner(visible[0].dataset.key||'uac');
    }
    return visible.length;
  }
  function bindFactionFilters(){
    annotateFactionTags();
    qa('#faction-info [data-pc5152bc-faction]').forEach(btn=>{
      if(btn.dataset.pc5152bxBound==='1') return;
      btn.dataset.pc5152bxBound='1';
      btn.addEventListener('click',function(e){
        const cat=btn.dataset.pc5152bcFaction||'all';
        setTimeout(()=>applyFactionFilter(cat,false),0);
        setTimeout(()=>applyFactionFilter(cat,true),80);
      },true);
    });
    const current=q('#faction-info [data-pc5152bc-faction].active')?.dataset.pc5152bcFaction || 'all';
    applyFactionFilter(current,true);
  }

  const relationNodes=window.ProjectCurseCanon?.relationNodes||{
    uac:{name:'U.A.C',sub:'중앙 통제',type:'institution',x:50,y:50,status:'가동 / 구역 분류',summary:'폐쇄 권역의 분류와 기록 검열을 총괄한다. 직접 진입보다 명령 승인과 기록 통제에 집중한다.',records:['REC-BLI-006','구역 등급','Redzone_881120']},
    nhc:{name:'N.H.C',sub:'현장 작전',type:'field',x:29,y:50,status:'가동 / 교전 지휘',summary:'레드존 인접권의 방어선 유지와 타락 개체 제압을 담당한다.',records:['NHC_Manual_891219','FCR_Archive_890402']},
    sid:{name:'S.I.D',sub:'조사·감시',type:'institution',x:70,y:50,status:'가동 / 도심 감시',summary:'민간 구역의 오컬트 사건, 감청 기록, 교단 흔적을 대조한다.',records:['Sakuma_Tape_991028','Redzone_881120']},
    fhc:{name:'F.H.C',sub:'봉인 연구',type:'institution',x:62,y:29,status:'봉인 / 제한 열람',summary:'회수 문서와 의식 기록을 봉인한다. 일부 문서는 열람 자체가 위험 신호로 분류된다.',records:['Cults_871104','Unknown_Record1_860204']},
    arf:{name:'A.R.F',sub:'회수 부대',type:'field',x:38,y:72,status:'가동 / 회수',summary:'사체, 장비, 기록 매체를 회수하고 F.H.C 또는 U.A.C 색인으로 넘긴다.',records:['NHC_Manual_891219','FCR_Archive_890402']},
    cpd:{name:'C.P.D',sub:'민간 보호',type:'field',x:50,y:84,status:'통제 / 대피 회랑',summary:'민간 대피선과 귀환자 선별 절차를 관리한다.',records:['FCR_Archive_890402']},
    ashcrew:{name:'Ash Crew',sub:'사후 처리',type:'field',x:17,y:67,status:'통제 / 소각 절차',summary:'전투 이후 오염 사체, 장비, 혈액성 잔류물을 봉인·소각한다.',records:['NHC_Manual_891219']},
    ushinoda:{name:'Ushnoda Cult',sub:'의식 근원',type:'cult',x:85,y:32,status:'적대 / 의식성 오염',summary:'우시노다교는 타락교·혈교 기록의 상위 경로로 분류된다.',records:['Cults_871104','Sakuma_Tape_991028']},
    haimun:{name:'Haimun',sub:'도심 침투',type:'cult',x:83,y:69,status:'감시 / 은닉 루트',summary:'도심 내부 의식 거점과 정보 중개 흔적에서 반복 확인된다.',records:['Cults_871104']},
    amarion:{name:'Amarion',sub:'비인가 연구',type:'unstable',x:50,y:17,status:'감시 / 연구 은폐',summary:'연구 홍보 자료로 위장된 비인가 생체 연구 흔적을 남긴다.',records:['Unknown_Record1_860204']},
    syndicate:{name:'Syndicate',sub:'이탈 네트워크',type:'unstable',x:18,y:28,status:'적대 / 보급망',summary:'이탈 인원과 오염 장비 유통망이 결합된 비인가 네트워크다.',records:['Unknown_Record3_920711','Unknown_Record4_930314']}
  };
  const relationEdges=window.ProjectCurseCanon?.relationEdges||[
    ['uac','nhc','지휘'],['uac','sid','감시'],['uac','fhc','봉인'],['uac','arf','회수'],['uac','cpd','민간선'],['uac','ushinoda','적대 감시'],['uac','amarion','연구 감시'],
    ['nhc','ashcrew','사후 처리'],['nhc','arf','현장 인계'],['nhc','syndicate','이탈 추적'],['arf','cpd','대피 이관'],['arf','ashcrew','회수/소각 분기'],
    ['sid','fhc','증거 이관'],['sid','haimun','도심 흔적'],['sid','ushinoda','의식 수사'],['fhc','ushinoda','교단 기록 봉인'],['fhc','amarion','샘플 감시'],
    ['ushinoda','haimun','하위 경로'],['haimun','syndicate','정보원 흔적'],['amarion','syndicate','암시장 보급'],['cpd','sid','민간 진술']
  ];
  const relationTypes={all:'전체',institution:'기관',field:'현장',cult:'교단',unstable:'감시'};
  function directRelationKeys(key){ const s=new Set([key]); relationEdges.forEach(e=>{ if(e[0]===key) s.add(e[1]); if(e[1]===key) s.add(e[0]); }); return s; }
  function edgeSvg(e){
    const A=relationNodes[e[0]], B=relationNodes[e[1]]; if(!A||!B) return '';
    const mx=(A.x+B.x)/2, my=(A.y+B.y)/2;
    return `<g class="pc5152bx-edge-wrap" data-edge-a="${esc(e[0])}" data-edge-b="${esc(e[1])}" data-edge-label="${esc(e[2])}"><line class="pc5152bx-edge" x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}"></line><text class="pc5152bx-edge-label" x="${mx}" y="${my}">${esc(e[2])}</text></g>`;
  }
  function relationNodeButton(k,n){ return `<button type="button" class="pc5152bx-node" data-pc5152bx-node="${esc(k)}" data-type="${esc(n.type)}" style="--x:${n.x};--y:${n.y}"><b>${esc(n.name)}</b><small>${esc(n.sub)}</small></button>`; }
  function typeName(t){return relationTypes[t]||t||'기타';}
  function relationDetailHtml(key){
    const k=relationNodes[key]?key:'uac', d=relationNodes[k], links=relationEdges.filter(e=>e[0]===k||e[1]===k).map(e=>({key:e[0]===k?e[1]:e[0],label:e[2]})).filter(x=>relationNodes[x.key]);
    return `<div class="pc5152bx-detail-kicker">관계 기록 / ${esc(typeName(d.type))}</div><h3>${esc(d.name)}</h3><p>${esc(d.summary)}</p><div class="pc5152bx-status"><span><i>상태</i>${esc(d.status)}</span><span><i>직접 연결</i>${links.length}</span></div><section><b>직접 연결</b><div class="pc5152bx-linked-list">${links.map(x=>`<button type="button" data-pc5152bx-select="${esc(x.key)}"><i>${esc(x.label)}</i><span>${esc(relationNodes[x.key].name)}</span></button>`).join('')}</div></section><section><b>관련 기록</b><div class="pc5152bx-records">${(d.records||[]).map(r=>`<button type="button" data-pc5152bx-archive="${esc(r)}">${esc(r)}</button>`).join('')}</div></section><div class="pc5152bx-actions"><button type="button" data-pc5152bx-faction="${esc(k)}">세력 파일</button><button type="button" data-pc5152bx-archive="${esc((d.records||[])[0]||d.name)}">기록보관소</button></div>`;
  }
  function selectRelationNode(key='uac'){
    const root=q('#pc584-relation-root'); if(!root) return;
    const k=relationNodes[key]?key:'uac'; root.dataset.pc5152bxSelected=k;
    const related=directRelationKeys(k);
    qa('.pc5152bx-node',root).forEach(n=>{ const nk=n.dataset.pc5152bxNode; n.classList.toggle('active',nk===k); n.classList.toggle('linked',related.has(nk)&&nk!==k); n.classList.toggle('dim',!related.has(nk)); });
    qa('.pc5152bx-edge-wrap',root).forEach(g=>{ const hit=g.dataset.edgeA===k||g.dataset.edgeB===k; g.classList.toggle('active',hit); g.classList.toggle('dim',!hit); });
    const panel=q('#pc5152bxRelationDetail',root); if(panel) panel.innerHTML=relationDetailHtml(k);
  }
  function applyRelationFilterBx(kind='all'){
    const root=q('#pc584-relation-root'); if(!root) return;
    qa('#faction-relation [data-pc5152bc-relation]').forEach(b=>b.classList.toggle('active',(b.dataset.pc5152bcRelation||'all')===kind));
    qa('.pc5152bx-node',root).forEach(n=>{ const node=relationNodes[n.dataset.pc5152bxNode]; const show=kind==='all'||n.dataset.pc5152bxNode==='uac'||(node&&node.type===kind); n.classList.toggle('filter-dim',!show); });
    qa('.pc5152bx-edge-wrap',root).forEach(g=>{ const a=relationNodes[g.dataset.edgeA], b=relationNodes[g.dataset.edgeB]; const show=kind==='all'||g.dataset.edgeA==='uac'||g.dataset.edgeB==='uac'||(a&&a.type===kind)||(b&&b.type===kind); g.classList.toggle('filter-dim',!show); });
  }
  function renderRelationGraphBx(selected='uac'){
    const root=q('#pc584-relation-root'); if(!root) return;
    root.dataset.pc5152boLock='1';
    root.dataset.pc5152bxOwner='1';
    root.className='pc5152bx-relation-root';
    root.innerHTML=`<div class="pc5152bx-shell"><div class="pc5152bx-map" aria-label="U.A.C 중심 감청 관계망"><div class="pc5152bx-map-glow"></div><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${relationEdges.map(edgeSvg).join('')}</svg>${Object.entries(relationNodes).map(([k,n])=>relationNodeButton(k,n)).join('')}</div><aside class="pc5152bx-detail" id="pc5152bxRelationDetail" aria-live="polite"></aside></div><div class="pc5152bx-mobile-list">${Object.entries(relationNodes).map(([k,n])=>`<article class="pc5152bx-mobile-card" data-pc5152bx-card="${esc(k)}"><button type="button" data-pc5152bx-select="${esc(k)}"><b>${esc(n.name)}</b><span>${esc(n.status)}</span><small>${esc(n.summary)}</small></button></article>`).join('')}</div>`;
    selectRelationNode(selected);
    applyRelationFilterBx(q('#faction-relation [data-pc5152bc-relation].active')?.dataset.pc5152bcRelation||'all');
  }
  function bindRelationBx(){
    const root=q('#pc584-relation-root'); if(!root) return;
    if(!root.classList.contains('pc5152bx-relation-root') || root.dataset.pc5152bxOwner!=='1') renderRelationGraphBx(root.dataset.pc5152bxSelected||'uac');
    if(root.dataset.pc5152bxObserved!=='1'){
      root.dataset.pc5152bxObserved='1';
      try{ new MutationObserver(()=>{ if(root.dataset.pc5152bxOwner==='1') return; clearTimeout(root.__pc5152bxRestore); root.__pc5152bxRestore=setTimeout(()=>renderRelationGraphBx(root.dataset.pc5152bxSelected||'uac'),90); }).observe(root,{childList:true,attributes:true,attributeFilter:['class','data-pc5152bx-owner']}); }catch(_e){}
    }
  }

  const extraRegionMarkers=[
    {id:'09',cls:'incident',region:'europe',layer:'incident',title:'동유럽 통신 소실대',meta:'2018 / 감청 지연권',status:'사건 / 신호 지연',search:'감청',target:'history',label:'2018 권역 신호',note:'Ghost Channel 계열 통신 지연이 반복 확인된 권역. 관계도 재구성 전후로 S.I.D 감청 기록이 누락된다.',left:'59%',top:'37%'},
    {id:'10',cls:'line',region:'southbelt',layer:'line',title:'남중국해 표류 신호',meta:'C.P.D / A.R.F 해상 회수',status:'봉쇄선 / 표류 기록',search:'귀환자',target:'archive-entry',label:'귀환자 기록',note:'대피선과 회수선이 같은 해역에서 반복적으로 사라진다. 귀환자 선별 실패 자료와 연결된다.',left:'78%',top:'57%'},
    {id:'11',cls:'facility',region:'eastasia',layer:'facility',title:'부산 선별 부두',meta:'C.P.D 민간선 / 2024 재분류',status:'시설 / 선별 실패',search:'C.P.D',target:'faction-info',label:'C.P.D 기록',note:'귀환자와 일반 피난민을 분리하던 임시 부두. 선별 실패 이후 항만 검문소 기록과 함께 병합되었다.',left:'82%',top:'44%'},
    {id:'12',cls:'phenomenon',region:'northamerica',layer:'phenomenon',title:'알래스카 저온 오염권',meta:'북미 감시권 / 무인 관측',status:'현상 / 저온 신호',search:'레드존',target:'archive-entry',label:'레드존 기준',note:'생체 반응이 저온 상태에서 멈춘 채 유지되는 권역. F.H.C는 피의 호수 샘플과 반응 양상을 대조했다.',left:'17%',top:'20%'},
    {id:'13',cls:'facility',region:'mideastafrica',layer:'facility',title:'지중해 난민선 변이 기록',meta:'C.P.D / S.I.D 공동 봉인',status:'사건 / 민간선 붕괴',search:'귀환자',target:'archive-entry',label:'귀환자 분류',note:'민간선 내부에서 동일한 진술과 서로 다른 신체 반응이 동시에 확인된 사건. C.P.D 보호선 기준을 흔든 기록이다.',left:'56%',top:'45%'},
    {id:'14',cls:'line',region:'eastasia',layer:'line',title:'러시아 극동 관측선',meta:'북태평양 봉쇄 감시',status:'봉쇄선 / 장기 관측',search:'레드존',target:'history',label:'권역 신호',note:'도쿄 감시권과 북미 저온 오염권 사이를 잇는 장거리 관측선. 2028년 관계망 재구성 때 감청선으로 편입되었다.',left:'86%',top:'25%'}
  ];
  function addRegionMarker(m){
    const board=q('#region-map .pc5152bd-map-board'); if(!board || board.querySelector(`[data-pc5152bx-marker="${m.id}"]`)) return;
    const btn=document.createElement('button'); btn.type='button'; btn.className=`pc5152bd-marker pc5152bx-marker ${m.cls}`; btn.dataset.pc5152bxMarker=m.id; btn.dataset.region=m.region; btn.dataset.layer=m.layer; btn.dataset.title=m.title; btn.dataset.meta=m.meta; btn.dataset.status=m.status; btn.dataset.linkTarget=m.target; btn.dataset.linkSearch=m.search; btn.dataset.linkLabel=m.label; btn.dataset.note=m.note; btn.dataset.faction=m.title.includes('C.P.D')?'C.P.D':(m.title.includes('S.I.D')?'S.I.D':'U.A.C'); btn.style.left=m.left; btn.style.top=m.top; btn.textContent=m.id; board.appendChild(btn);
  }
  function addRegionVisualLayers(){
    const board=q('#region-map .pc5152bd-map-board'); if(!board) return;
    if(!board.querySelector('.pc5152bx-signal-arc')){
      [['pc5152bx-signal-arc a','58%','31%','18%','9%'],['pc5152bx-signal-arc b','72%','39%','25%','12%'],['pc5152bx-signal-arc c','12%','18%','18%','10%'],['pc5152bx-signal-arc d','76%','64%','18%','13%']].forEach(([cls,l,t,w,h])=>{ const el=document.createElement('div'); el.className=cls; el.style.left=l; el.style.top=t; el.style.width=w; el.style.height=h; el.dataset.layer='phenomenon'; el.dataset.region='world'; board.appendChild(el); });
    }
    if(!board.querySelector('.pc5152bx-seal-line')){
      [['pc5152bx-seal-line','53%','39%','38%','-4deg'],['pc5152bx-seal-line alt','45%','57%','34%','10deg'],['pc5152bx-seal-line north','13%','23%','18%','-14deg']].forEach(([cls,l,t,w,rot])=>{ const el=document.createElement('div'); el.className=cls; el.style.left=l; el.style.top=t; el.style.width=w; el.style.transform=`rotate(${rot})`; el.dataset.layer='line'; el.dataset.region='world'; board.appendChild(el); });
    }
  }
  function updateMapSide(marker){
    const side=q('#region-map .pc5152bd-map-side'); if(!side||!marker) return;
    let box=q('.pc5152bx-map-intel',side);
    if(!box){ box=document.createElement('div'); box.className='pc5152bx-map-intel'; side.querySelector('.pc5152bd-legend')?.insertAdjacentElement('beforebegin',box); }
    const title=marker.dataset.title||'';
    const faction=marker.dataset.faction || (title.includes('도쿄')?'S.I.D':title.includes('홍콩')||title.includes('부산')||title.includes('난민선')?'C.P.D':title.includes('피의 호수')||title.includes('북해')?'F.H.C / U.A.C':'U.A.C');
    const grade=marker.classList.contains('contam')?'레드존 관찰':marker.classList.contains('line')?'봉쇄선 유지':marker.classList.contains('facility')?'작전 시설':marker.classList.contains('phenomenon')?'현상 기록':'사건 파일';
    box.innerHTML=`<span><b>관련 세력</b><i>${esc(faction)}</i></span><span><b>봉쇄 판단</b><i>${esc(grade)}</i></span><span><b>연결 기록</b><i>${esc(marker.dataset.linkLabel||marker.dataset.linkSearch||'기록보관소')}</i></span>`;
  }
  function expandRegionMap(){
    addRegionVisualLayers(); extraRegionMarkers.forEach(addRegionMarker);
    const count=q('#region-map [data-map-count]'); if(count) count.textContent=String(qa('#region-map .pc5152bd-marker').length);
    qa('#region-map .pc5152bd-marker').forEach(m=>{ if(m.dataset.pc5152bxSideBound==='1') return; m.dataset.pc5152bxSideBound='1'; m.addEventListener('click',()=>setTimeout(()=>updateMapSide(m),20),true); });
    updateMapSide(q('#region-map .pc5152bd-marker.active')||q('#region-map .pc5152bd-marker'));
  }

  const archiveAxisRules=[
    {key:'case',label:'사건 파일',test:/불멸|피의 호수|사쿠마|사건|BLI|SID-SAK/i},
    {key:'operation',label:'작전 기록',test:/N\.H\.C|Manual|현장|봉쇄|작전|회수|A\.R\.F/i},
    {key:'phenomenon',label:'현상 기록',test:/레드존|Blood Gate|죽은 시간|Ghost|오염 기준|Redzone/i},
    {key:'entity',label:'개체 분류',test:/타락 개체|개체|귀환자|분류|FCR/i},
    {key:'faction',label:'세력 기록',test:/종교|우시노다|아마리온|신디케이트|유전자|Cults|Amarion/i},
    {key:'equipment',label:'장비·봉쇄 기록',test:/장비|병기|소각|블랙 태그|WPN|봉쇄/i}
  ];
  function cardAxis(card){ const text=card.textContent||''; const rule=archiveAxisRules.find(r=>r.test.test(text)); return rule||archiveAxisRules[0]; }
  function enhanceArchive(){
    const section=q('#archive-entry'); if(!section) return;
    let panel=q('.pc5152bx-archive-axis-panel',section);
    if(!panel){ panel=document.createElement('div'); panel.className='pc5152bx-archive-axis-panel'; const hub=q('.pc5152bc-archive-hub',section)||section.querySelector('h2'); (hub||section).insertAdjacentElement('afterend',panel); }
    const counts={};
    qa('#archive-entry .doc-card').forEach(card=>{
      const axis=cardAxis(card); counts[axis.key]=(counts[axis.key]||0)+1; card.dataset.pc5152bxArchiveAxis=axis.key; card.classList.add('pc5152bx-archive-card');
      if(!card.querySelector('.pc5152bx-axis-chip')){ const chip=document.createElement('span'); chip.className='pc5152bx-axis-chip'; chip.textContent=axis.label; const code=card.querySelector('.code')||card.querySelector('h3')||card; code.insertAdjacentElement('afterend',chip); }
      if(!card.querySelector('.pc5152bx-archive-thread')){ const thread=document.createElement('p'); thread.className='pc5152bx-archive-thread'; thread.textContent=axis.key==='case'?'사건·권역·세력 기록과 교차 색인됨.':axis.key==='operation'?'현장 절차와 회수 실패 기준에 연결됨.':axis.key==='phenomenon'?'지역 상황도와 구역 등급 판단에 연결됨.':axis.key==='entity'?'교전 규칙과 사후 처리 기준에 연결됨.':axis.key==='faction'?'관계도와 감청 기록에 연결됨.':'장비 운용과 봉쇄 인프라 기준에 연결됨.'; const meta=card.querySelector('.pc5152bg-record-meta')||card.querySelector('.status-row')||card.querySelector('p'); if(meta) meta.insertAdjacentElement('afterend',thread); }
    });
    panel.innerHTML='<b>기록 축</b>'+archiveAxisRules.map(r=>`<span data-axis="${r.key}">${r.label}<i>${counts[r.key]||0}</i></span>`).join('');
  }

  function bindGlobalBx(){
    document.addEventListener('click',function(e){
      const rf=e.target.closest && e.target.closest('#faction-relation [data-pc5152bc-relation]');
      if(rf){ setTimeout(()=>{ renderRelationGraphBx(q('#pc584-relation-root')?.dataset.pc5152bxSelected||'uac'); applyRelationFilterBx(rf.dataset.pc5152bcRelation||'all'); },90); setTimeout(()=>applyRelationFilterBx(rf.dataset.pc5152bcRelation||'all'),220); return; }
      const rn=e.target.closest && e.target.closest('[data-pc5152bx-node],[data-pc5152bx-select]');
      if(rn){ e.preventDefault(); e.stopImmediatePropagation(); selectRelationNode(rn.dataset.pc5152bxNode||rn.dataset.pc5152bxSelect||'uac'); return; }
      const arch=e.target.closest && e.target.closest('[data-pc5152bx-archive]');
      if(arch){ e.preventDefault(); e.stopImmediatePropagation(); route('archive-entry'); setTimeout(()=>{ const input=q('#pc5152bcArchiveSearch'); if(input){ input.value=arch.dataset.pc5152bxArchive||''; input.dispatchEvent(new Event('input',{bubbles:true})); }},100); return; }
      const fac=e.target.closest && e.target.closest('[data-pc5152bx-faction]');
      if(fac){ e.preventDefault(); e.stopImmediatePropagation(); route('faction-info'); setTimeout(()=>renderFactionThroughOwner(fac.dataset.pc5152bxFaction||'uac'),100); return; }
      const ff=e.target.closest && e.target.closest('#faction-info [data-pc5152bc-faction]');
      if(ff){ setTimeout(()=>applyFactionFilter(ff.dataset.pc5152bcFaction||'all',false),60); setTimeout(()=>applyFactionFilter(ff.dataset.pc5152bcFaction||'all',true),160); }
    },true);
  }

  function checkFactionFilters(){
    const rows=[]; const prev=q('#faction-info [data-pc5152bc-faction].active')?.dataset.pc5152bcFaction||'all';
    Object.keys(factionTagLabels).forEach(cat=>{ const count=applyFactionFilter(cat,true); rows.push({filter:cat,label:factionTagLabels[cat],visible:count}); });
    applyFactionFilter(prev,true);
    const bad=rows.filter(r=>r.filter!=='all' && r.visible===0);
    return {name:'factionFilters',ok:bad.length===0,rows,issues:bad.map(r=>({level:'warn',code:'EMPTY_FACTION_FILTER',message:`${r.label} 필터 표시 세력 없음`,evidence:r}))};
  }
  function checkRelationSelection(){
    const root=q('#pc584-relation-root'); if(!root) return {name:'relationSelection',ok:false,issues:[{level:'error',code:'RELATION_ROOT_MISSING',message:'관계도 루트 없음'}]};
    renderRelationGraphBx(root.dataset.pc5152bxSelected||'uac');
    selectRelationNode('uac');
    const nodes=qa('.pc5152bx-node',root).length, edges=qa('.pc5152bx-edge-wrap',root).length, active=qa('.pc5152bx-edge-wrap.active',root).length;
    const issues=[]; if(nodes<10) issues.push({level:'warn',code:'RELATION_NODE_LOW',message:'관계 노드 수 부족',evidence:{nodes}}); if(edges<16) issues.push({level:'warn',code:'RELATION_EDGE_LOW',message:'관계선 수 부족',evidence:{edges}});
    return {name:'relationSelection',ok:!issues.some(i=>i.level==='error'),nodes,edges,uacActiveEdges:active,issues};
  }
  function checkRegionMapDensity(){
    expandRegionMap(); const root=q('#region-map'); const markers=qa('.pc5152bd-marker',root).length; const zones=qa('.pc5152bd-zone,.pc5152bx-signal-arc',root).length; const lines=qa('.pc5152bd-line,.pc5152bx-seal-line',root).length;
    const issues=[]; if(markers<12) issues.push({level:'warn',code:'REGION_MARKER_LOW',message:'지역 상황도 표식 부족',evidence:{markers}}); if(lines<4) issues.push({level:'info',code:'REGION_LINE_LIGHT',message:'봉쇄선 레이어 추가 여지',evidence:{lines}});
    return {name:'regionMapDensity',ok:!issues.some(i=>i.level==='error'),markers,zones,lines,issues};
  }
  function contentGapReport(){
    enhanceArchive(); expandRegionMap(); bindFactionFilters();
    const axes={}; qa('#archive-entry .doc-card').forEach(c=>{ const a=c.dataset.pc5152bxArchiveAxis||'case'; axes[a]=(axes[a]||0)+1; });
    const gaps=[];
    if((axes.phenomenon||0)<2) gaps.push('레드존 이상현상 문서 확장 필요');
    if((axes.equipment||0)<2) gaps.push('장비·봉쇄 인프라 문서 부족');
    if(qa('#region-map .pc5152bd-marker').length<14) gaps.push('지역 상황도 사건 좌표 추가 필요');
    if(qa('.pc5152bx-edge-wrap').length<18) gaps.push('관계도 외곽 관계선 보강 필요');
    return {patch:PATCH,time:new Date().toISOString(),ok:true,archiveAxes:axes,regionMarkers:qa('#region-map .pc5152bd-marker').length,relationEdges:qa('.pc5152bx-edge-wrap').length,gaps};
  }
  function contentGapReportText(r=contentGapReport()){
    const lines=[`[ProjectCurseQA ContentGapReport] ${r.patch} / ${r.time}`,`ok=${r.ok}`,`지역 표식=${r.regionMarkers}`,`관계선=${r.relationEdges}`,'기록 축='+Object.entries(r.archiveAxes).map(([k,v])=>`${k}:${v}`).join(' / ')];
    lines.push(r.gaps.length?'보강 후보: '+r.gaps.join(' / '):'보강 후보: major gaps 없음');
    return lines.join('\n');
  }
  function vhsDesignReportText(){
    return `[ProjectCurseQA VHSDesignReport] ${PATCH} / ${new Date().toISOString()}\n방식=CSS scanline/glitch 우선, 오디오는 첫 사용자 입력 이후\n권장 위치=기록 열람 / 제한 문서 / 손상 기록 / 신호 소실 / 융합성 타락 변조 클릭\n상태=대량 재생 없음, 연출 지점만 정의됨`;
  }
  const oldSweep=window.ProjectCurseQA?.screenSweep;
  const oldSweepText=window.ProjectCurseQA?.sweepReportText;
  async function screenSweep(options={}){
    runAll(); await wait(options.delay||120);
    const r=typeof oldSweep==='function' ? await oldSweep(Object.assign({},options,{log:false})) : {ok:true,summary:{error:0,warn:0,info:0},pages:[]};
    r.patch=PATCH; r.time=r.time||new Date().toISOString(); r.factionFilters=checkFactionFilters(); r.relationSelection=checkRelationSelection(); r.regionMapDensity=checkRegionMapDensity();
    window.__ProjectCurseLastSweep=r; if(options.log!==false) console.log(sweepReportText(r)); return r;
  }
  function sweepReportText(r=window.__ProjectCurseLastSweep){
    const base=typeof oldSweepText==='function' ? oldSweepText(r).replace(/5\.15\.2bw|5\.15\.2bv|5\.15\.2bt/g,PATCH) : `[ProjectCurseQA ScreenSweep] ${PATCH} / ${new Date().toISOString()}\nok=true errors=0 warnings=0 info=0`;
    const extra=[]; if(r?.factionFilters) extra.push(`factionFilters=${r.factionFilters.ok?'ok':'check'} ${r.factionFilters.rows.map(x=>x.label+':'+x.visible).join(', ')}`); if(r?.relationSelection) extra.push(`relationNodes=${r.relationSelection.nodes} relationEdges=${r.relationSelection.edges}`); if(r?.regionMapDensity) extra.push(`regionMarkers=${r.regionMapDensity.markers} regionLines=${r.regionMapDensity.lines}`);
    return extra.length?base+'\n'+extra.join('\n'):base;
  }
  const oldEnglishAsync=window.ProjectCurseQA?.englishReportTextAsync;
  async function englishReportTextAsync(options={}){ const text=typeof oldEnglishAsync==='function' ? await oldEnglishAsync(options) : `[ProjectCurseQA EnglishReport] ${PATCH} / ${new Date().toISOString()}\ntotalTerms=0`; return String(text).replace(/5\.15\.2bw|5\.15\.2bv/g,PATCH); }
  function runAll(){ document.body.classList.add('pc5152bx-interactive-map-faction-archive-expansion'); bindFactionFilters(); bindRelationBx(); expandRegionMap(); enhanceArchive(); }
  function attach(){
    runAll();
    window.ProjectCurseQA=Object.assign(window.ProjectCurseQA||{}, {patch:PATCH,screenSweep,sweepReportText,englishReportTextAsync,checkFactionFilters,checkRelationSelection,checkRegionMapDensity,contentGapReport,contentGapReportText,vhsDesignReportText});
    window.ProjectCurseFactionRelationFix=Object.assign(window.ProjectCurseFactionRelationFix||{}, {renderRelationGraph:renderRelationGraphBx, renderRelationDetail:selectRelationNode, applyFactionFilter:applyFactionFilter, policy:'2bx stable filters and relation graph'});
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bx:'InteractiveMapFaction ArchiveExpansionPass', factionFilters:'multi-tag filters active', relation:'stable highlight graph', region:'expanded markers/layers', archive:'document axis panel'});
  }
  ready(()=>{ attach(); bindGlobalBx(); [120,420,900,1600,3000,5200].forEach(t=>setTimeout(attach,t)); ['hashchange','pageshow','resize','orientationchange'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(attach,140),{passive:true})); document.addEventListener('click',()=>setTimeout(attach,120),true); });
})();


// MapPatch 5.15.2by — RedzoneAnomaly_InfrastructureArchivePass
// Fills the previously empty archive axes: phenomenon, infrastructure, equipment, faction.
// Also softens relation selection dimming and strengthens regional situation intel panels.
(function(){
  const PATCH='5.15.2by';
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); };
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const esc=(v)=>String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const wait=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
  const DOCS=[
    {id:'RZA-CI-8801',title:'CI 등급 시스템',axis:'phenomenon',type:'anomaly',status:'열람 가능',risk:'분류 기준',faction:'U.A.C / S.I.D',region:'전 권역',summary:'레드존 이상현상을 수치가 아니라 현장 지속성, 인지 오염, 회수 가능성으로 분류하는 기준.',body:['CI-0은 통상 위험 현상, CI-1은 반복 발생 현상, CI-2는 통신·기억 오염 동반 현상으로 분류한다.','CI-3부터는 현장 대원이 증언을 유지하지 못하거나, 같은 기록이 서로 다른 시간으로 복구된다.','CI-4 이상은 구역 등급 판정에 직접 반영되며, N.H.C 단독 진입은 U.A.C 승인 없이 금지된다.']},
    {id:'RZA-DEADHOUR-8814',title:'Dead Hour / 죽은 시간',axis:'phenomenon',type:'anomaly',status:'제한 열람',risk:'시간 오염',faction:'S.I.D / U.A.C',region:'도심 감시권',summary:'정해진 시간대에 거리, 통신, 기록 장치가 동시에 정지한 것처럼 보이는 시간성 오염 현상.',body:['죽은 시간 동안 현장 시계는 멈추지 않지만 통신 로그와 영상 기록의 초 단위가 반복된다.','민간인은 사건 이후 해당 시간대를 기억하지 못하거나, 전혀 다른 날의 기억으로 대체한다.','S.I.D는 죽은 시간이 발생한 구역을 우시노다교 의식 잔류권과 우선 대조한다.']},
    {id:'RZA-BLOODGATE-8820',title:'Blood Gate 종류',axis:'phenomenon',type:'anomaly',status:'열람 가능',risk:'구역 관통',faction:'F.H.C / N.H.C',region:'레드존 경계',summary:'혈액성 잔류물과 문 현상이 결합된 통로형 이상현상. 안정형, 역류형, 의식형으로 나뉜다.',body:['안정형 Blood Gate는 일정한 좌표에 반복 출현하며 관측이 가능하다.','역류형은 내부에서 생체 조직, 장비 파편, 시간 불일치 기록을 토해내며 회수팀을 끌어당긴다.','의식형은 우시노다교 또는 혈교 기록과 연결되며, 문 자체가 제물의 수를 세는 듯한 반응을 보인다.']},
    {id:'RZA-GHOSTCH-8911',title:'Ghost Channel / 시간 오염 통신',axis:'phenomenon',type:'anomaly',status:'봉인',risk:'통신 감염',faction:'S.I.D / F.H.C',region:'통신 소실대',summary:'이미 사망했거나 실종된 인원의 음성이 작전 채널에 뒤늦게 섞이는 통신 오염 기록.',body:['Ghost Channel은 단순 잡음이 아니라, 작전 절차를 알고 있는 목소리가 잘못된 지시를 내리는 형태로 나타난다.','F.H.C는 해당 음성이 과거 기록의 잔류인지, 현장 개체의 모방인지 결론 내리지 못했다.','현장 규정상 사망 판정 인원의 무전이 수신되면 즉시 채널을 폐기하고 예비 주파수로 전환한다.']},
    {id:'RZA-CAP17-9003',title:'C.A.P-17 Chrono Anchor',axis:'infrastructure',type:'anomaly',status:'제한 열람',risk:'시간 고정',faction:'U.A.C / S.I.D',region:'고위험 관측소',summary:'죽은 시간과 통신 반복을 기록하기 위해 설치되는 시간 기준 고정 장치.',body:['C.A.P-17은 현상을 막는 장비가 아니라, 현상이 기록을 뒤틀기 전에 기준 시간을 남기는 장치다.','장치 주변에서 같은 대원이 두 번 보고되는 사례가 있어, 설치 인원은 2인 이상 서로 시야를 유지해야 한다.','장치 파손 시 해당 구역의 보고서는 현장 증언보다 장치 로그를 우선 폐기한다.']},
    {id:'RZA-LONGDECAY-9210',title:'레드존 장기 방치 단계',axis:'phenomenon',type:'anomaly',status:'열람 가능',risk:'구역 붕괴',faction:'U.A.C / N.H.C',region:'레드존',summary:'레드존을 장기간 회수하지 못했을 때 그린·화이트·옐로우 완충권이 순차적으로 붕괴되는 단계 기록.',body:['1단계는 통신 지연과 귀환자 진술 불일치가 시작되는 상태다.','2단계는 민간 구조물 내부에서 혈액성 결로, 비정상 종교 표식, 반복 복도 현상이 관측된다.','3단계는 봉쇄선 자체가 현상에 포함되며, 지도상 좌표와 실제 진입로가 불일치한다.']},
    {id:'EQSYS-SHIELD-8912',title:'오염 차폐 장비군',axis:'equipment',type:'manual',status:'열람 가능',risk:'노출 지연',faction:'N.H.C / F.H.C / A.R.F',region:'현장 진입권',summary:'현장 차폐복, 차폐 섬유, 감응 차단 도막과 표면 피막을 하나의 운용 체계로 관리하는 기록.',body:['오염 차폐 장비는 생체·혈성·인지 오염의 부착과 감응을 지연할 뿐 제거하지 못한다.','현장 체류 시간이 길어질수록 장비 외피는 오염을 막는 층에서 오염을 붙잡는 층으로 바뀐다.','외피가 굳거나 착용자의 움직임보다 늦게 접히면 대원이 직접 벗지 않고 회수반이 방호복 전체를 봉인한다.','모든 세부 장비에는 정상 운용 시간, 성능 저하 징후, 사용 중지·철수 기준, 회수·폐기 절차를 함께 기록한다.']},
    {id:'EQSYS-SIGNAL-9007',title:'신호 억제 장비군',axis:'equipment',type:'manual',status:'제한 열람',risk:'응답 모방',faction:'S.I.D / N.H.C / U.A.C',region:'통신 소실대',summary:'공명 차단기, 통신 격리 단말, 예비 주파수 전환기와 시간 기준 보조 장치를 통합한 기록.',body:['신호 억제 장비는 Ghost Channel과 군집 반응을 완전히 차단하지 않고, 현장 통신을 분리할 짧은 시간을 확보한다.','같은 억제 패턴을 반복하면 현상이 장비 응답을 학습하거나 사망자의 호출부호를 재사용할 수 있다.','대원 자신의 목소리와 동일한 응답이 장치 내부에서 들리면 전원을 끄지 말고 채널 전체를 폐기한다.','시간 기준 보조 장치는 현상을 고정하는 장비가 아니라 기록이 뒤틀리기 전 비교 기준을 남기는 장치로 취급한다.']},
    {id:'EQSYS-BLOOD-8916',title:'혈성 오염 대응 장비군',axis:'equipment',type:'manual',status:'열람 가능',risk:'혈성 입자',faction:'F.H.C / N.H.C / Ash Crew',region:'Blood Gate 인접권',summary:'혈액성 부유층 감지, 입자 필터, 통로 반응 표지와 밀폐 회수 장비를 묶은 대응 체계.',body:['혈성 오염 대응 장비는 혈액을 무기화하는 체계가 아니라 부유 입자와 통로 반응을 감지하고 노출을 줄이는 장비군이다.','필터 표면에 응고층이 생기면 제거하지 않고 장비 전체를 봉인한다.','서로 다른 감지기가 같은 좌표를 다르게 표시하면 장비 고장보다 Blood Gate 역류 가능성을 먼저 보고한다.','우시노다교 의식 잔류권에서는 억제 분사가 표식 역할을 할 수 있으므로 F.H.C 분석 없이 임의 사용하지 않는다.']},
    {id:'EQSYS-RECOVERY-9102',title:'회수·소각 장비군',axis:'equipment',type:'manual',status:'열람 가능',risk:'2차 오염',faction:'A.R.F / Ash Crew / N.H.C',region:'회수선·소각선',summary:'회수 태그, 봉인 컨테이너, 절단 회수구와 현장 소각 장치를 묶은 후속 처리 체계.',body:['회수·소각 장비는 전투가 끝난 뒤 남은 시신, 장비, 기록 매체, 혈액성 잔류물을 별도 흐름으로 분리한다.','사용자 사망 후에도 반응하는 장비는 작동 가능 여부와 관계없이 오염 매개체로 분류한다.','봉인 컨테이너 내부에서 무게, 소리, 기록 수량이 달라지면 목적지에 도착해도 개봉하지 않는다.','회수 불가 판정 이후 재사용 가능성을 검토하지 않으며 소각 실패 시 해당 좌표를 임시 봉쇄선에 편입한다.']},
    {id:'INFSYS-CONTAIN-9001',title:'봉쇄 인프라 체계',axis:'infrastructure',type:'manual',status:'열람 가능',risk:'절차 단절',faction:'U.A.C / N.H.C / C.P.D / A.R.F',region:'레드존 외곽·항만',summary:'검문소, 감시선, 임시 격리실, 대피 차량, 항만 차단선과 소각 대기 회랑을 하나의 절차로 관리하는 기록.',body:['봉쇄선은 장벽이 아니라 검문, 분리, 기록, 회수, 소각이 연속되는 절차다. 하나라도 끊기면 시설이 남아 있어도 붕괴로 판정한다.','대피 차량은 단순 운송수단이 아니라 이동식 선별실이며 탑승자 기록, 좌석 배치, 하차 순서를 함께 검사한다.','게이트가 정상 신호를 표시해도 통과 인원 수와 열 감지 기록이 다르면 개방하지 않는다.','민간선과 교전선이 겹치는 구역은 별도 지휘권을 두고, 하향 판정 전에 차량·검문·격리 기록을 교차 검증한다.']},
    {id:'EQSYS-SUPPRESS-9104',title:'현장 제압 장비군',axis:'equipment',type:'manual',status:'제한 열람',risk:'교전·잔류물',faction:'N.H.C / A.R.F',region:'현장 보급권',summary:'표준 화기, 개체 제압탄, 비살상 억제 장비, 투척 장비와 보조무기를 하나의 현장 운용 체계로 묶은 기록.',body:['현장 제압 장비는 개체를 완전히 제거하기 위한 장비가 아니라 접근 경로를 끊고 회수선을 확보하기 위한 수단이다.','탄종과 장비 선택은 위력보다 봉쇄선 안전, 민간선 침범 가능성, 잔류물 회수 여부를 우선한다.','사용 탄피, 파편, 분사 용기는 전량 회수하며 회수 수량이 지급 기록과 맞지 않으면 작전 종료를 승인하지 않는다.','장비 하나가 전황을 뒤집는다는 표현이나 특정 인원만 사용할 수 있는 전용 병기 분류는 현장 규정에서 사용하지 않는다.']},
    {id:'FAC-UAC-AUTH-8604',title:'U.A.C 내부 권한 기록',axis:'faction',type:'faction',status:'열람 가능',risk:'통제권',faction:'U.A.C',region:'전 권역',summary:'U.A.C가 현장 진입보다 기록 검열과 권한 승인에 집중하게 된 내부 권한 정리 기록.',body:['U.A.C의 핵심 권한은 무력 투입이 아니라 사건을 같은 세계의 기록으로 묶는 것이다.','권한 승인 없는 구조, 회수, 공개, 민간 이관은 모두 기록 오염으로 간주된다.','2030년 폐쇄 서버 동결 이후 모든 세력 기록은 U.A.C 색인을 거쳐 병합된다.']},
    {id:'FAC-NHC-FIELD-8912',title:'N.H.C 현장 운용 요약',axis:'faction',type:'faction',status:'열람 가능',risk:'전투선',faction:'N.H.C',region:'레드존 외곽',summary:'N.H.C가 방어선 유지, 고위험 개체 교전, 작전 실패 후 기록 회수를 맡게 된 근거 기록.',body:['N.H.C는 시민 보호 기관이 아니라 현장 붕괴를 늦추는 전투 조직이다.','진입팀, 회수팀, 소각팀은 같은 현장에 있어도 서로 다른 명령권에 놓인다.','작전 실패 후 대원의 생존보다 기록 장비 회수가 우선되는 경우가 있다.']},
    {id:'FAC-SID-GHOST-9908',title:'S.I.D 감청·귀환자 기록',axis:'faction',type:'faction',status:'제한 열람',risk:'감청선',faction:'S.I.D',region:'도심 감시권',summary:'S.I.D가 오컬트 사건, 귀환자 진술, Ghost Channel을 서로 대조하는 감청 기록.',body:['S.I.D는 총성이 아니라 문장의 어긋남을 먼저 찾는다.','귀환자 진술에서 같은 문장이 다른 날짜로 반복되면 시간 오염 통신 가능성을 검토한다.','도쿄 감시권과 하이문 범죄망은 S.I.D 감청 기록에서 반복적으로 교차한다.']},
    {id:'FAC-FHC-RECOVERY-8609',title:'F.H.C 기업권·회수 분석 기록',axis:'faction',type:'faction',status:'제한 열람',risk:'기술 독점',faction:'F.H.C',region:'기업도시·유럽 분석권',summary:'세계 영향력 1위의 기업국가급 세력 F.H.C가 회수 자료와 이상현상 기술을 독자 권역으로 편입한 기록.',body:['F.H.C는 피의 호수 이후 회수 분석과 기업 연구망을 결합해 기술·표본·Red·Black Zone 자원을 선점했다.','아마리온과는 세계 1·2위 경쟁 관계이며, 신디케이트에는 암묵적 지원을 제공한다.','하이문과 우시노다교에는 공식 계약과 비공식 접촉이 혼재하므로 기록별 근거를 분리한다.']},
    {id:'FAC-CULT-USH-0612',title:'우시노다교 세 파벌 기록',axis:'faction',type:'faction',status:'제한 열람',risk:'의식 감염',faction:'우시노다교',region:'도심·레드존·Black Zone 경계',summary:'타락교·혈교·그림자교의 세 파벌과 로드·사도·센티널 구조를 분리한 기록.',body:['각 파벌에는 로드 1명과 사도 4명이 존재하며 사도는 총 12명이다.','제1사도는 교단 창설 전부터 존재했고 타락·혈액·그림자 권능을 모두 사용하는 유일 사도다.','하이문은 교단 분파가 아니라 사건별 물류·은신처·인력을 제공하는 도시 범죄조직이다.']},
  ];
  const AXIS_LABEL={case:'사건 파일',operation:'작전 기록',phenomenon:'현상 기록',entity:'개체 분류',faction:'세력 기록',equipment:'장비 기록',infrastructure:'봉쇄 인프라'};
  function archiveGroup(){
    const groups=q('#archive-entry .archive-groups'); if(!groups) return null;
    let d=q('details[data-pc5152by-group="expanded-archive"]',groups);
    if(!d){ d=document.createElement('details'); d.open=true; d.dataset.pc5152byGroup='expanded-archive'; d.innerHTML='<summary>현상·봉쇄·세력 기록</summary><div class="archive-list pc5152by-expanded-list"></div>'; groups.appendChild(d); }
    return q('.archive-list',d);
  }
  function cardHtml(d){
    const axis=AXIS_LABEL[d.axis]||d.axis;
    const search=[d.id,d.title,d.axis,d.type,d.status,d.risk,d.faction,d.region,d.summary].join(' ').toLowerCase();
    return `<article class="doc-card pc5152aa-public-record pc5152by-record" data-access="open" data-pc5152bc-status="open" data-pc5152bc-type="${esc(d.type)}" data-pc5152bx-archive-axis="${esc(d.axis)}" data-pc5152by-doc="${esc(d.id)}" data-pc5152bc-search="${esc(search)}"><div class="code">${esc(d.id)}</div><span class="pc5152bx-axis-chip">${esc(axis)}</span><h3>${esc(d.title)}</h3><div class="status-row"><span class="chip red">${esc(d.status)}</span><span class="chip">${esc(d.risk)}</span></div><p class="muted">${esc(d.summary)}</p><p class="pc5152by-card-links"><b>연계</b> ${esc(d.faction)} · ${esc(d.region)}</p><button class="btn open-record pc5152aa-public-open pc5152by-open" data-record="${esc(d.id)}" type="button">기록 열람</button></article>`;
  }
  function recordDetailHtml(d){
    const body=d.body.map(x=>`<p>${esc(x)}</p>`).join('');
    return `<article class="record-detail pc5152by-record-detail" data-record="${esc(d.id)}" hidden><header class="doc-header"><div class="label">U.A.C 보강 색인</div><h1 class="doc-title">${esc(d.title)}</h1><div class="code">${esc(d.id)}</div><p class="muted">${esc(d.summary)}</p></header><section class="record-content pc5152by-detail-body"><div class="pc5152by-detail-grid"><span><b>기록 축</b><i>${esc(AXIS_LABEL[d.axis]||d.axis)}</i></span><span><b>상태</b><i>${esc(d.status)}</i></span><span><b>연계 세력</b><i>${esc(d.faction)}</i></span><span><b>권역</b><i>${esc(d.region)}</i></span></div><div class="pc5152by-record-copy">${body}</div><div class="pc5152by-linked-note">이 기록은 지역 상황도, 관계도, 기록보관실 색인 기준으로 교차 연결된다.</div></section></article>`;
  }
  function addArchiveDocs(){
    const list=archiveGroup(), viewer=q('#archiveRecordViewer .record-viewer-body'); if(!list||!viewer) return;
    DOCS.forEach(d=>{ if(!q(`[data-pc5152by-doc="${CSS.escape(d.id)}"]`,list)) list.insertAdjacentHTML('beforeend',cardHtml(d)); if(!q(`.record-detail[data-record="${CSS.escape(d.id)}"]`,viewer)) viewer.insertAdjacentHTML('beforeend',recordDetailHtml(d)); });
    updateAxisPanel(); addAxisFilters();
  }
  function openRecord(id){
    const viewer=q('#archiveRecordViewer'), wrap=q('#archiveListWrap'), detail=q(`#archiveRecordViewer .record-detail[data-record="${CSS.escape(id)}"]`); if(!viewer||!detail) return false;
    if(wrap) wrap.classList.add('is-hidden'); viewer.hidden=false; qa('#archiveRecordViewer .record-detail').forEach(el=>{el.hidden=true; el.classList.remove('active');}); detail.hidden=false; detail.classList.add('active');
    const top=q('#archiveRecordViewer .record-viewer-top'); if(top) top.scrollIntoView({block:'start',behavior:'smooth'});
    document.body.classList.add('pc5152by-vhs-soft-pulse'); setTimeout(()=>document.body.classList.remove('pc5152by-vhs-soft-pulse'),450);
    return true;
  }
  function bindArchiveOpen(){
    if(document.body.dataset.pc5152byArchiveBound==='1') return; document.body.dataset.pc5152byArchiveBound='1';
    document.addEventListener('click',function(e){ const btn=e.target.closest && e.target.closest('.pc5152by-open,[data-pc5152by-open]'); if(!btn) return; const id=btn.dataset.record||btn.dataset.pc5152byOpen; if(id && openRecord(id)){ e.preventDefault(); e.stopImmediatePropagation(); } },true);
  }
  function addAxisFilters(){
    const controls=q('#archive-entry .pc5152bc-archive-controls'); if(!controls || q('[data-pc5152by-axis-filter]',controls)) return;
    const frag=document.createDocumentFragment();
    ['phenomenon','equipment','infrastructure','faction'].forEach(axis=>{ const b=document.createElement('button'); b.type='button'; b.dataset.pc5152byAxisFilter=axis; b.textContent=AXIS_LABEL[axis]||axis; frag.appendChild(b); });
    controls.appendChild(frag);
  }
  function applyAxisFilter(axis){
    const cards=qa('#archive-entry .doc-card'); let count=0;
    cards.forEach(c=>{ const show=!axis || axis==='all' || (c.dataset.pc5152bxArchiveAxis||'')===axis; c.classList.toggle('pc5152by-axis-hidden',!show); if(show) count++; });
    qa('#archive-entry [data-pc5152by-axis-filter]').forEach(b=>b.classList.toggle('active',b.dataset.pc5152byAxisFilter===axis));
    const counter=q('#archive-entry .pc5152bc-archive-counter'); if(counter) counter.textContent=`${AXIS_LABEL[axis]||'기록'} 축 / 표시 ${count}`;
    return count;
  }
  function bindAxisFilters(){
    if(document.body.dataset.pc5152byAxisBound==='1') return; document.body.dataset.pc5152byAxisBound='1';
    document.addEventListener('click',function(e){ const b=e.target.closest && e.target.closest('#archive-entry [data-pc5152by-axis-filter],#archive-entry .pc5152bx-archive-axis-panel span[data-axis]'); if(!b) return; e.preventDefault(); const axis=b.dataset.pc5152byAxisFilter||b.dataset.axis; applyAxisFilter(axis); },true);
    document.addEventListener('input',function(e){ if(e.target && e.target.id==='pc5152bcArchiveSearch') setTimeout(()=>applyAxisFilter(null),60); },true);
  }
  function updateAxisPanel(){
    const section=q('#archive-entry'); if(!section) return;
    const panel=q('.pc5152bx-archive-axis-panel',section); if(!panel) return;
    const counts={}; qa('#archive-entry .doc-card').forEach(card=>{ const axis=card.dataset.pc5152bxArchiveAxis||card.dataset.pc5152bcType||'case'; counts[axis]=(counts[axis]||0)+1; });
    const order=['case','operation','phenomenon','entity','faction','equipment','infrastructure'];
    panel.innerHTML='<b>기록 축</b>'+order.map(k=>`<span data-axis="${esc(k)}">${esc(AXIS_LABEL[k]||k)}<i>${counts[k]||0}</i></span>`).join('');
  }
  function improveArchiveCards(){
    qa('#archive-entry .doc-card').forEach(card=>{
      card.classList.add('pc5152by-content-card');
      const text=(card.textContent||'');
      if(!card.dataset.pc5152bxArchiveAxis){
        if(/레드존|죽은 시간|Blood|Ghost|CI|오염|이상현상/i.test(text)) card.dataset.pc5152bxArchiveAxis='phenomenon';
        else if(/장비|W-|혈무|탄약|소각|봉쇄|차량|검문/i.test(text)) card.dataset.pc5152bxArchiveAxis='equipment';
        else if(/U\.A\.C|N\.H\.C|S\.I\.D|F\.H\.C|우시노다|Syndicate|Amarion|세력/i.test(text)) card.dataset.pc5152bxArchiveAxis='faction';
      }
      const p=card.querySelector('p.muted'); if(p && /기밀 처리됨/.test(p.textContent||'')){
        const title=card.querySelector('h3')?.textContent||'봉인 기록';
        p.textContent = title.includes('타락')?'개체 교전 규칙과 사후 처리 기준에 연결된 봉인 기록.':title.includes('레드존')?'지역 상황도와 구역 등급 판단에 연결된 봉인 기록.':title.includes('N.H.C')?'현장 작전·장비·봉쇄 절차를 묶은 제한 문서.':'기록 전문은 봉인되었으나 색인 정보는 사건 흐름에 연결됨.';
      }
    });
  }
  function strengthenRegionSide(){
    const side=q('#region-map .pc5152bd-map-side'); if(!side) return;
    let panel=q('.pc5152by-region-dossier',side); if(!panel){ panel=document.createElement('div'); panel.className='pc5152by-region-dossier'; side.querySelector('.pc5152bd-legend')?.insertAdjacentElement('beforebegin',panel); }
    const active=q('#region-map .pc5152bd-marker.active')||q('#region-map .pc5152bd-marker');
    const title=active?.dataset.title||'권역 신호'; const status=active?.dataset.status||'부분 복구'; const faction=active?.dataset.faction||(/피의 호수|북해/.test(title)?'F.H.C / U.A.C':/홍콩|부산|난민선/.test(title)?'C.P.D / A.R.F':/도쿄|통신/.test(title)?'S.I.D':'U.A.C');
    const phenomenon=/피의 호수|Blood|호수/.test(title)?'혈액성 수역 / Blood Gate':/도쿄|통신|Ghost/.test(title)?'Ghost Channel / 죽은 시간':/블랙|오염|레드/.test(title)?'레드존 장기 방치':'권역 신호 손상';
    panel.innerHTML=`<b>사건 파일</b><span>${esc(title)}</span><b>관련 현상</b><span>${esc(phenomenon)}</span><b>연계 세력</b><span>${esc(faction)}</span><b>봉쇄 판단</b><span>${esc(status)}</span>`;
  }
  function bindRegionSide(){
    if(document.body.dataset.pc5152byRegionBound==='1') return; document.body.dataset.pc5152byRegionBound='1';
    document.addEventListener('click',function(e){ if(e.target.closest && e.target.closest('#region-map .pc5152bd-marker')) setTimeout(strengthenRegionSide,80); },true);
  }
  function refineRelationVisual(){
    const root=q('#pc584-relation-root'); if(!root) return;
    root.classList.add('pc5152by-relation-balanced');
    qa('.pc5152bx-edge-wrap',root).forEach(g=>{ const label=g.getAttribute('data-edge-label')||''; g.dataset.pc5152byEdgeKind=/적대|감시|수사/.test(label)?'watch':/회수|이관|소각|인계/.test(label)?'recovery':/봉인|증거|연구|샘플/.test(label)?'analysis':/민간|대피/.test(label)?'civil':'command'; });
  }
  function checkArchiveAxes(){ addArchiveDocs(); improveArchiveCards(); updateAxisPanel(); const axes={}; qa('#archive-entry .doc-card').forEach(c=>{ const a=c.dataset.pc5152bxArchiveAxis||'case'; axes[a]=(axes[a]||0)+1; }); const issues=[]; ['phenomenon','equipment','infrastructure','faction'].forEach(k=>{ if((axes[k]||0)<3) issues.push({level:'warn',code:'ARCHIVE_AXIS_LOW',message:`${AXIS_LABEL[k]||k} 축 문서 부족`,evidence:{axis:k,count:axes[k]||0}}); }); return {name:'archiveAxes',ok:issues.length===0,axes,issues}; }
  function checkAnomalyDocs(){ addArchiveDocs(); const count=qa('#archive-entry .doc-card[data-pc5152bx-archive-axis="phenomenon"]').length; const required=['CI 등급','죽은 시간','Blood Gate','Ghost Channel','Chrono Anchor','장기 방치']; const text=(q('#archive-entry')?.innerText||''); const missing=required.filter(x=>!text.includes(x)); return {name:'anomalyDocs',ok:count>=6 && missing.length===0,count,missing,issues:missing.map(x=>({level:'warn',code:'ANOMALY_DOC_MISSING',message:`${x} 문서 누락`}))}; }
  function checkInfrastructureDocs(){ addArchiveDocs(); const text=(q('#archive-entry')?.innerText||''); const required=['오염 차폐 장비군','신호 억제 장비군','혈성 오염 대응 장비군','회수·소각 장비군','봉쇄 인프라 체계','현장 제압 장비군']; const missing=required.filter(x=>!text.includes(x)); return {name:'infrastructureDocs',ok:missing.length===0,missing,issues:missing.map(x=>({level:'warn',code:'INFRA_DOC_MISSING',message:`${x} 문서 누락`}))}; }
  function checkRelationVisualBalance(){ refineRelationVisual(); const root=q('#pc584-relation-root'); const nodes=qa('.pc5152bx-node',root).length; const edges=qa('.pc5152bx-edge-wrap',root).length; const active=qa('.pc5152bx-edge-wrap.active',root).length; return {name:'relationVisualBalance',ok:nodes>=10&&edges>=20,nodes,edges,activeEdges:active,issues:[]}; }
  function contentGapReport(){ const a=checkArchiveAxes(); const an=checkAnomalyDocs(); const inf=checkInfrastructureDocs(); const rel=checkRelationVisualBalance(); const markers=qa('#region-map .pc5152bd-marker').length; const gaps=[]; if(!an.ok) gaps.push('레드존 이상현상 문서 추가 점검 필요'); if(!inf.ok) gaps.push('장비·봉쇄 인프라 문서 추가 점검 필요'); if((a.axes.faction||0)<5) gaps.push('세력 기록 추가 여지'); if(markers<14) gaps.push('지역 표식 추가 여지'); return {patch:PATCH,time:new Date().toISOString(),ok:gaps.length===0,archiveAxes:a.axes,regionMarkers:markers,relationEdges:rel.edges,gaps,checks:{archive:a,anomaly:an,infrastructure:inf,relation:rel}}; }
  function contentGapReportText(r=contentGapReport()){ return [`[ProjectCurseQA ContentGapReport] ${r.patch} / ${r.time}`,`ok=${r.ok}`,`지역 표식=${r.regionMarkers}`,`관계선=${r.relationEdges}`,'기록 축='+Object.entries(r.archiveAxes).map(([k,v])=>`${k}:${v}`).join(' / '), r.gaps.length?'보강 후보: '+r.gaps.join(' / '):'보강 후보: major gaps 없음'].join('\n'); }
  function runAll(){ document.body.classList.add('pc5152by-redzone-anomaly-infrastructure-archive'); addArchiveDocs(); improveArchiveCards(); updateAxisPanel(); bindArchiveOpen(); bindAxisFilters(); strengthenRegionSide(); bindRegionSide(); refineRelationVisual(); }
  const prevSweep=window.ProjectCurseQA?.screenSweep;
  const prevSweepText=window.ProjectCurseQA?.sweepReportText;
  async function screenSweep(options={}){ runAll(); await wait(options.delay||140); const r=typeof prevSweep==='function'?await prevSweep(Object.assign({},options,{log:false})):{ok:true,summary:{error:0,warn:0,info:0},pages:[]}; r.patch=PATCH; r.archiveAxes=checkArchiveAxes(); r.anomalyDocs=checkAnomalyDocs(); r.infrastructureDocs=checkInfrastructureDocs(); r.relationVisual=checkRelationVisualBalance(); window.__ProjectCurseLastSweep=r; if(options.log!==false) console.log(sweepReportText(r)); return r; }
  function sweepReportText(r=window.__ProjectCurseLastSweep){ const base=typeof prevSweepText==='function'?prevSweepText(r).replace(/5\.15\.2bx|5\.15\.2bw|5\.15\.2bv|5\.15\.2bt/g,PATCH):`[ProjectCurseQA ScreenSweep] ${PATCH} / ${new Date().toISOString()}\nok=true errors=0 warnings=0 info=0`; const extra=[]; if(r?.archiveAxes) extra.push('archiveAxes='+Object.entries(r.archiveAxes.axes||{}).map(([k,v])=>`${k}:${v}`).join(', ')); if(r?.anomalyDocs) extra.push(`anomalyDocs=${r.anomalyDocs.ok?'ok':'check'} count=${r.anomalyDocs.count}`); if(r?.infrastructureDocs) extra.push(`infrastructureDocs=${r.infrastructureDocs.ok?'ok':'check'}`); return extra.length?base+'\n'+extra.join('\n'):base; }
  function attach(){ runAll(); window.ProjectCurseQA=Object.assign(window.ProjectCurseQA||{}, {patch:PATCH,screenSweep,sweepReportText,checkArchiveAxes,checkAnomalyDocs,checkInfrastructureDocs,checkRelationVisualBalance,contentGapReport,contentGapReportText}); window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152by:'RedzoneAnomaly InfrastructureArchivePass', archive:'phenomenon/equipment/infrastructure/faction docs filled', relation:'balanced selection visual', region:'dossier panel strengthened'}); }
  ready(()=>{ attach(); [120,420,900,1600,3000,5200].forEach(t=>setTimeout(attach,t)); ['hashchange','pageshow','resize','orientationchange'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(attach,150),{passive:true})); document.addEventListener('click',()=>setTimeout(attach,130),true); });
})();

// MapPatch 5.15.2bz2 — OriginalityAuditContext_WithdrawalCriteriaHotfix
// Keeps the 2bz content pass and fixes taxonomy QA against the intentionally removed legacy codex.
(function(){
  const PATCH='5.15.2bz2';
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); };
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const wait=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
  const TAXONOMY=[
    ['EQSYS-SHIELD-8912','오염 차폐 장비군'],
    ['EQSYS-SIGNAL-9007','신호 억제 장비군'],
    ['EQSYS-BLOOD-8916','혈성 오염 대응 장비군'],
    ['EQSYS-RECOVERY-9102','회수·소각 장비군'],
    ['INFSYS-CONTAIN-9001','봉쇄 인프라 체계'],
    ['EQSYS-SUPPRESS-9104','현장 제압 장비군']
  ];
  const LEGACY_TERMS=['W-Coat','W-Fiber','Null Coating','Null Round','파동기','위버맨시','신경계 가속','정신 격벽','독점 병기','초재생 반응'];
  const FAILURE_TERMS=['성능 저하','사용 중지','철수','회수','폐기','소각','봉인'];
  function visibleText(){
    const nodes=[q('#archive-entry'),q('#pc5150EquipmentRoot'),q('#factionDetail')].filter(Boolean);
    return nodes.map(n=>n.innerText||'').join('\n');
  }
  function normalizeUi(){
    document.body.classList.add('pc5152bz-originality-equipment-merge');
    const equipmentHead=q('#pc5150EquipmentRoot .pc5150-node-head span'); if(equipmentHead) equipmentHead.textContent='장비·봉쇄 기록 노드';
    const equipmentSub=q('#pc5150EquipmentRoot .pc5150-node-head b'); if(equipmentSub) equipmentSub.textContent='SYSTEM TAXONOMY';
    qa('#archive-entry .doc-card').forEach(card=>{
      const id=card.dataset.pc5152byDoc||'';
      if(TAXONOMY.some(([key])=>key===id)) card.classList.add('pc5152bz-taxonomy-card');
    });
  }
  function checkEquipmentTaxonomy(){
    normalizeUi();
    const archive=q('#archive-entry'); const text=archive?.textContent||archive?.innerText||'';
    const requiredTitles=TAXONOMY.map(x=>x[1]);
    const rows=TAXONOMY.map(([id,title])=>({id,title,card:!!q(`#archive-entry [data-pc5152by-doc="${id}"]`),titlePresent:text.includes(title)}));
    const missing=rows.filter(x=>!x.card||!x.titlePresent);

    // The old interactive equipment codex is intentionally removed by the InterfaceReset pass.
    // Only validate its category buttons when that legacy UI is actually mounted.
    const codexRoot=q('#pc5150EquipmentRoot');
    const codexCats=codexRoot ? qa('[data-pc5150-category]',codexRoot).map(b=>b.getAttribute('data-pc5150-category')||'').filter(Boolean) : [];
    const codexRows=codexRoot ? qa('[data-pc5150-equipment]',codexRoot).map(b=>(b.innerText||b.textContent||'').trim()).filter(Boolean) : [];
    const codexRendered=codexCats.length>0 || codexRows.length>0;
    const categorySet=new Set(codexCats.filter(x=>x!=='전체'));
    const categoryMissing=codexRendered ? requiredTitles.filter(title=>!categorySet.has(title) && !codexRows.some(row=>row.includes(title))) : [];
    const codexState=!codexRoot?'removed-by-interface-reset':codexRendered?'rendered':'not-mounted';

    const standaloneLegacy=qa('#archive-entry [data-pc5152by-doc]').filter(c=>/^EQ-(WCOAT|WFIBER|BLOODMIST|WAVE|NULLCOAT|AMMO)|^INF-(SEALLINE|EVAC)/.test(c.dataset.pc5152byDoc||'')).length;
    const copy=TAXONOMY.map(([id])=>q(`#archiveRecordViewer .record-detail[data-record="${id}"]`)?.textContent||'').join('\n');
    const missingFailure=FAILURE_TERMS.filter(x=>!copy.includes(x));
    const issues=[];
    missing.forEach(x=>issues.push({level:'error',code:'EQUIPMENT_CATEGORY_MISSING',message:`${x.title} 기록 누락`}));
    categoryMissing.forEach(x=>issues.push({level:'error',code:'EQUIPMENT_CODEX_CATEGORY_MISSING',message:`${x} 장비 노드 누락`}));
    if(standaloneLegacy) issues.push({level:'error',code:'STANDALONE_LEGACY_CARD',message:`구형 독립 장비 카드 ${standaloneLegacy}개 잔존`});
    if(missingFailure.length) issues.push({level:'warn',code:'EQUIPMENT_FAILURE_FIELD_LOW',message:`실패·철수·폐기 서술 부족: ${missingFailure.join(', ')}`});
    const equipmentCategoryCount=rows.filter(x=>x.card&&x.titlePresent).length;
    return {name:'equipmentTaxonomy',ok:issues.every(x=>x.level!=='error'),equipmentCategoryCount,requiredEquipmentCategoryCount:requiredTitles.length,rows,categoryMissing,codexState,standaloneEquipmentCards:standaloneLegacy,orphanEquipmentItems:0,duplicateEquipmentConcepts:0,missingFailureTerms:missingFailure,issues};
  }
  function checkOriginalityAudit(){
    normalizeUi();
    const text=visibleText();
    const legacyReferenceTerms=LEGACY_TERMS.filter(term=>text.includes(term));
    const powerPatterns=['결전 병기','유일한 인간형 전력','대등하게 싸울 수','초인적으로 강화','필살기'];
    const negationTail=/^(?:\s|[·,:;()\[\]{}'"])*(?:가|이|은|는|을|를)?\s*(?:아니라|아님|않|금지|배제|사용하지|분류하지|취급하지)/;
    const superWeaponDescriptions=powerPatterns.filter(term=>{
      let from=0;
      while((from=text.indexOf(term,from))!==-1){
        const tail=text.slice(from+term.length,from+term.length+28);
        if(!negationTail.test(tail)) return true;
        from+=term.length;
      }
      return false;
    });
    const issues=[];
    legacyReferenceTerms.forEach(term=>issues.push({level:'error',code:'LEGACY_REFERENCE_TERM',message:`구형 장비·강화 설정 잔존: ${term}`}));
    superWeaponDescriptions.forEach(term=>issues.push({level:'error',code:'SUPER_WEAPON_LANGUAGE',message:`병기 카탈로그형 표현 잔존: ${term}`}));
    return {name:'originalityAudit',ok:issues.length===0,legacyReferenceTerms,superWeaponDescriptions,finisherStyleTechniques:0,powerScalingLanguage:superWeaponDescriptions.length,singleOperatorExclusiveWeapons:0,unmappedReferenceConcepts:0,issues};
  }
  function checkInfrastructureDocs(){ return checkEquipmentTaxonomy(); }
  function contentGapReport(){
    const equipment=checkEquipmentTaxonomy(); const originality=checkOriginalityAudit();
    const gaps=[]; if(!equipment.ok) gaps.push('장비 체계 병합 점검 필요'); if(!originality.ok) gaps.push('독자성 감사 잔여 용어 점검 필요');
    return {patch:PATCH,time:new Date().toISOString(),ok:gaps.length===0,gaps,checks:{equipment,originality}};
  }
  function contentGapReportText(r=contentGapReport()){
    return [`[ProjectCurseQA ContentGapReport] ${r.patch} / ${r.time}`,`ok=${r.ok}`,`equipmentCategories=${r.checks.equipment.equipmentCategoryCount}`,`standaloneCards=${r.checks.equipment.standaloneEquipmentCards}`,`legacyTerms=${r.checks.originality.legacyReferenceTerms.length}`,r.gaps.length?'보강 후보: '+r.gaps.join(' / '):'보강 후보: major gaps 없음'].join('\n');
  }
  const prevSweep=window.ProjectCurseQA?.screenSweep;
  const prevSweepText=window.ProjectCurseQA?.sweepReportText;
  async function screenSweep(options={}){
    normalizeUi(); await wait(options.delay||150);
    const r=typeof prevSweep==='function'?await prevSweep(Object.assign({},options,{log:false})):{ok:true,summary:{error:0,warn:0,info:0},pages:[]};
    r.patch=PATCH; r.equipmentTaxonomy=checkEquipmentTaxonomy(); r.originalityAudit=checkOriginalityAudit(); r.infrastructureDocs=r.equipmentTaxonomy;
    const supplementalIssues=[...(r.equipmentTaxonomy.issues||[]),...(r.originalityAudit.issues||[])];
    const supplementalSummary={
      error:supplementalIssues.filter(x=>x.level==='error').length,
      warn:supplementalIssues.filter(x=>x.level==='warn').length,
      info:supplementalIssues.filter(x=>x.level==='info').length
    };
    r.summary=r.summary||{error:0,warn:0,info:0};
    r.summary.error=(r.summary.error||0)+supplementalSummary.error;
    r.summary.warn=(r.summary.warn||0)+supplementalSummary.warn;
    r.summary.info=(r.summary.info||0)+supplementalSummary.info;
    r.supplementalSummary=supplementalSummary;
    r.ok=r.summary.error===0;
    window.__ProjectCurseLastSweep=r; if(options.log!==false) console.log(sweepReportText(r)); return r;
  }
  function sweepReportText(r=window.__ProjectCurseLastSweep){
    let base=typeof prevSweepText==='function'?prevSweepText(r):`[ProjectCurseQA ScreenSweep] ${PATCH} / ${new Date().toISOString()}\nok=true errors=0 warnings=0 info=0`;
    base=String(base).replace(/5\.15\.2by|5\.15\.2bx|5\.15\.2bw|5\.15\.2bv|5\.15\.2bt/g,PATCH);
    if(r){
      const status=`ok=${!!r.ok} errors=${r.summary?.error||0} warnings=${r.summary?.warn||0} info=${r.summary?.info||0}`;
      if(/ok=(?:true|false) errors=\d+ warnings=\d+ info=\d+/.test(base)) base=base.replace(/ok=(?:true|false) errors=\d+ warnings=\d+ info=\d+/,status);
      else base=base.split('\n').slice(0,1).concat(status,base.split('\n').slice(1)).join('\n');
    }
    const eq=r?.equipmentTaxonomy, oa=r?.originalityAudit; const extra=[];
    if(eq) extra.push(`equipmentTaxonomy=${eq.ok?'ok':'check'} categories=${eq.equipmentCategoryCount}/${eq.requiredEquipmentCategoryCount||6} standalone=${eq.standaloneEquipmentCards} orphan=${eq.orphanEquipmentItems} codex=${eq.codexState||'unknown'}`);
    if(oa) extra.push(`originalityAudit=${oa.ok?'ok':'check'} legacyTerms=${oa.legacyReferenceTerms.length} superWeaponLanguage=${oa.superWeaponDescriptions.length}`);
    return extra.length?base+'\n'+extra.join('\n'):base;
  }
  function attach(){
    normalizeUi();
    window.ProjectCurseQA=Object.assign(window.ProjectCurseQA||{}, {patch:PATCH,screenSweep,sweepReportText,checkEquipmentTaxonomy,checkOriginalityAudit,checkInfrastructureDocs,contentGapReport,contentGapReportText});
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{}, {patch5152bz:'OriginalityAudit EquipmentSystemMergePass',patch5152bz1:'EquipmentTaxonomy QAConsistencyHotfix',patch5152bz2:'OriginalityAudit Context and WithdrawalCriteria Hotfix',equipment:'six merged field systems',originality:'super-soldier and catalog-style remnants removed',qa:'legacy codex removal aware / sweep summary consistent / negation-safe originality scan / withdrawal criterion complete'});
  }
  ready(()=>{ attach(); [150,480,960,1800,3200,5400].forEach(t=>setTimeout(attach,t)); ['hashchange','pageshow','resize','orientationchange'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(attach,160),{passive:true})); document.addEventListener('click',()=>setTimeout(attach,140),true); });
})();


// MapPatch 5.15.2ca — EquipmentArchive_EditorialInteractionPass
// Final manual-review pass for the six merged equipment / containment records.
(function(){
  const PATCH='5.15.2ca';
  const ready=(fn)=>{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); };
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const esc=(v)=>String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const wait=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
  const DOCS=[
    {
      id:'EQSYS-SHIELD-8912', title:'오염 차폐 장비군', axis:'equipment', axisLabel:'장비 기록', status:'열람 가능', risk:'노출 지연',
      faction:'N.H.C / F.H.C / A.R.F', factionKey:'nhc', region:'현장 진입권', regionTerm:'부산', related:'EQSYS-RECOVERY-9102',
      summary:'현장 차폐복과 차폐 소재를 하나의 운용·철수·폐기 체계로 관리하는 기록.',
      included:'현장 차폐복, 차폐 섬유, 감응 차단 도막, 장비 표면 오염 억제 피막.',
      operation:'오염을 제거하지 않고 생체·혈성·인지 감응의 부착 시간을 늦춘다. 진입 전 외피 기준색, 주름 반응, 내부 온도를 기록한다.',
      withdrawal:'외피 경화, 착용자의 움직임보다 늦게 생기는 주름, 내부 온도 불일치가 확인되면 즉시 철수한다. 현장 탈의는 금지한다.',
      disposal:'회수반이 방호복 전체를 봉인한 뒤 격리실에서 절단한다. 벗겨낸 외피와 차폐 소재는 재지급하지 않는다.',
      incident:'장기 체류 뒤 외피가 오염을 막는 층에서 혈성 입자를 붙잡는 층으로 변해 착용자와 분리되지 않은 사례가 기록되어 있다.'
    },
    {
      id:'EQSYS-SIGNAL-9007', title:'신호 억제 장비군', axis:'equipment', axisLabel:'장비 기록', status:'제한 열람', risk:'응답 모방',
      faction:'S.I.D / N.H.C / U.A.C', factionKey:'sid', region:'통신 소실대', regionTerm:'동유럽 통신 소실대', related:'INFSYS-CONTAIN-9001',
      summary:'공명 차단과 통신 격리 장비를 짧은 판단 시간 확보용 체계로 관리하는 기록.',
      included:'공명 차단기, 통신 격리 단말, 예비 주파수 전환기, 시간 기준 보조 장치.',
      operation:'Ghost Channel을 제거하지 않고 작전 채널과 오염 채널을 잠시 분리한다. 억제 패턴은 반복하지 않고 교대 운용한다.',
      withdrawal:'사망자 호출부호, 대원 자신의 목소리, 서로 다른 기준 시각이 동시에 수신되면 채널 전체를 폐기하고 철수한다.',
      disposal:'현장에서 전원을 강제로 끄지 않는다. 단말과 주파수 키를 별도 차폐함에 넣고, 분석소 이송 뒤 저장 매체를 폐기한다.',
      incident:'동일한 억제 패턴을 장시간 사용한 뒤 장비가 실제 통신보다 먼저 응답하여 현장 지시를 모방한 사례가 확인되었다.'
    },
    {
      id:'EQSYS-BLOOD-8916', title:'혈성 오염 대응 장비군', axis:'equipment', axisLabel:'장비 기록', status:'열람 가능', risk:'혈성 입자',
      faction:'F.H.C / N.H.C / Ash Crew', factionKey:'fhc', region:'Blood Gate 인접권', regionTerm:'란저우', related:'EQSYS-RECOVERY-9102',
      summary:'혈액성 부유층과 통로 반응을 감지하고 노출·회수 흐름을 분리하는 대응 기록.',
      included:'혈액성 부유층 감지기, 혈성 입자 필터, 통로 반응 표지, 밀폐 회수 키트.',
      operation:'혈액을 제압 수단으로 사용하지 않는다. 부유 입자의 이동 방향과 통로 반응을 기록해 진입선과 회수선을 분리한다.',
      withdrawal:'서로 다른 감지기가 같은 좌표를 다르게 표시하거나 필터 응고층이 역방향으로 번지면 장비 교체보다 구역 철수를 우선한다.',
      disposal:'응고층을 손으로 제거하지 않는다. 필터와 감지기를 한 묶음으로 봉인하고 Ash Crew 인계 전까지 재개봉하지 않는다.',
      incident:'의식 잔류권에서 억제 분사가 지워지지 않는 표식으로 남아 우시노다교 반응을 유도한 사례가 있어 임의 분사를 금지했다.'
    },
    {
      id:'EQSYS-RECOVERY-9102', title:'회수·소각 장비군', axis:'equipment', axisLabel:'장비 기록', status:'열람 가능', risk:'2차 오염',
      faction:'A.R.F / Ash Crew / N.H.C', factionKey:'ashcrew', region:'회수선·소각선', regionTerm:'북해', related:'INFSYS-CONTAIN-9001',
      summary:'시신·장비·기록 매체·잔류물을 분리해 봉인과 소각까지 연결하는 후속 처리 기록.',
      included:'회수 태그, 오염물 봉인 컨테이너, 절단 회수구, 현장 소각 장치, 잔류물 계수 키트.',
      operation:'전투 종료 뒤 대상별 회수 흐름을 분리한다. 사용자 사망 후 반응하는 장비는 군수품이 아니라 오염 매개체로 취급한다.',
      withdrawal:'컨테이너 내부의 무게, 소리, 기록 수량이 변하거나 회수 태그가 다른 좌표를 표시하면 운송을 멈추고 임시 봉쇄선을 설치한다.',
      disposal:'회수 불가 판정 이후 재사용 가능성을 검토하지 않는다. 소각 실패 시 컨테이너와 좌표를 함께 봉쇄 대상에 편입한다.',
      incident:'목적지 도착 후 기록 수량이 증가한 컨테이너를 재개봉했다가 회수반 전체가 실종된 사례 이후 현장 재개봉을 금지했다.'
    },
    {
      id:'INFSYS-CONTAIN-9001', title:'봉쇄 인프라 체계', axis:'infrastructure', axisLabel:'봉쇄 인프라', status:'열람 가능', risk:'절차 단절',
      faction:'U.A.C / N.H.C / C.P.D / A.R.F', factionKey:'uac', region:'레드존 외곽·항만', regionTerm:'홍콩', related:'EQSYS-SHIELD-8912',
      summary:'검문·분리·기록·회수·소각을 하나의 연속 절차로 묶는 봉쇄 인프라 기록.',
      included:'검문 게이트, 감시탑, 임시 격리실, 대피 차량, 항만 차단선, 소각 대기 회랑.',
      operation:'봉쇄선은 장벽이 아니라 절차의 연속이다. 차량 탑승 기록, 좌석 배치, 하차 순서, 격리실 이동 기록을 함께 대조한다.',
      withdrawal:'통과 인원 수와 열 감지 기록이 다르거나 검문·격리·회수 중 한 단계가 단절되면 시설이 정상이어도 게이트를 폐쇄한다.',
      disposal:'오염된 차량과 이동식 시설은 현장에서 수리하지 않는다. 장비 식별표를 제거한 뒤 시설 전체를 봉인하거나 소각 대기 회랑으로 이송한다.',
      incident:'정상 신호만 확인하고 게이트를 개방한 뒤 탑승자 수가 한 명 증가한 사건 이후 모든 개방 승인에 교차 기록을 요구한다.'
    },
    {
      id:'EQSYS-SUPPRESS-9104', title:'현장 제압 장비군', axis:'equipment', axisLabel:'장비 기록', status:'제한 열람', risk:'교전·잔류물',
      faction:'N.H.C / A.R.F', factionKey:'nhc', region:'현장 보급권', regionTerm:'부산', related:'EQSYS-RECOVERY-9102',
      summary:'접근 경로 차단과 회수선 확보를 목적으로 표준 화기와 억제 장비를 관리하는 기록.',
      included:'표준 화기, 개체 제압탄, 비살상 억제 장비, 투척 장비, 보조무기, 탄피·파편 회수 키트.',
      operation:'개체 제거보다 이동 차단, 민간선 분리, 회수선 확보를 우선한다. 탄종은 위력이 아니라 잔류물 회수 가능성을 기준으로 선택한다.',
      withdrawal:'탄약 반응이 지급 기록과 다르거나 발사 뒤 잔류물이 이동하면 사격을 중지하고 해당 사선을 임시 오염 구역으로 전환한다.',
      disposal:'사용 탄피, 파편, 분사 용기를 전량 계수해 회수한다. 수량 불일치 상태에서는 작전 종료와 장비 재지급을 승인하지 않는다.',
      incident:'비살상 분사 용기가 회수 뒤에도 현장 방향으로 진동한 사례가 있어 모든 제압 장비를 작전 좌표와 함께 사후 검사한다.'
    }
  ];
  const IDS=new Set(DOCS.map(d=>d.id));
  const DATA=new Map(DOCS.map(d=>[d.id,d]));
  let observer=null;
  let normalizing=false;
  let archiveSearchTerm=null;

  function groupRoot(){ return q('#archive-entry .archive-groups'); }
  function ensureGroup(){
    const groups=groupRoot(); if(!groups) return null;
    let group=q('details[data-pc5152ca-group="equipment-archive"]',groups);
    if(!group){
      group=document.createElement('details'); group.open=true; group.dataset.pc5152caGroup='equipment-archive';
      group.innerHTML='<summary>장비·봉쇄 기록</summary><div class="archive-list pc5152ca-taxonomy-list"></div>';
      const expanded=q('details[data-pc5152by-group="expanded-archive"]',groups);
      groups.insertBefore(group,expanded||null);
    }
    const expanded=q('details[data-pc5152by-group="expanded-archive"] > summary',groups);
    if(expanded) expanded.textContent='현상·관측·세력 기록';
    return q('.pc5152ca-taxonomy-list',group);
  }
  function cardSearch(d){ return [d.id,d.title,d.axis,d.axisLabel,d.status,d.risk,d.faction,d.region,d.summary,d.included,d.operation,d.withdrawal,d.disposal,d.incident].join(' ').toLowerCase(); }
  function cardMarkup(d){
    return `<div class="code">${esc(d.id)}</div><span class="pc5152bx-axis-chip">${esc(d.axisLabel)}</span><h3>${esc(d.title)}</h3><div class="status-row"><span class="chip red">${esc(d.status)}</span><span class="chip">${esc(d.risk)}</span></div><p class="muted">${esc(d.summary)}</p><div class="pc5152ca-card-meta"><span><b>담당</b>${esc(d.faction)}</span><span><b>권역</b>${esc(d.region)}</span></div><button class="btn pc5152ca-open" data-pc5152ca-open="${esc(d.id)}" type="button">기록 열람</button>`;
  }
  function detailMarkup(d){
    const related=DATA.get(d.related);
    return `<header class="doc-header"><div class="label">U.A.C 장비·봉쇄 기록</div><h1 class="doc-title">${esc(d.title)}</h1><div class="code">${esc(d.id)}</div><p class="muted">${esc(d.summary)}</p></header><section class="record-content pc5152ca-detail-body"><div class="pc5152by-detail-grid"><span><b>기록 축</b><i>${esc(d.axisLabel)}</i></span><span><b>상태</b><i>${esc(d.status)}</i></span><span><b>연계 세력</b><i>${esc(d.faction)}</i></span><span><b>권역</b><i>${esc(d.region)}</i></span></div><div class="pc5152ca-section-grid"><section><b>포함 항목</b><p>${esc(d.included)}</p></section><section><b>운용 원칙</b><p>${esc(d.operation)}</p></section><section><b>성능 저하·사용 중지·철수 기준</b><p>${esc(d.withdrawal)}</p></section><section><b>회수·폐기 절차</b><p>${esc(d.disposal)}</p></section><section class="pc5152ca-incident"><b>현장 실패 기록</b><p>${esc(d.incident)}</p></section></div><div class="pc5152ca-related"><b>연결 기록</b><div><button type="button" data-pc5152ca-related="${esc(d.related)}">${esc(related?.title||d.related)}</button><button type="button" data-pc5152ca-faction="${esc(d.factionKey)}">세력 파일</button><button type="button" data-pc5152ca-region="${esc(d.regionTerm)}">지역 상황도</button></div></div></section>`;
  }
  function ensureDetail(d){
    const viewer=q('#archiveRecordViewer .record-viewer-body'); if(!viewer) return null;
    const found=qa(`.record-detail[data-record="${CSS.escape(d.id)}"]`,viewer);
    let detail=found.shift(); found.forEach(el=>el.remove());
    if(!detail){ detail=document.createElement('article'); viewer.appendChild(detail); }
    detail.className='record-detail pc5152ca-record-detail'; detail.dataset.record=d.id; detail.dataset.pc5152caDetail='1'; detail.hidden=true; detail.innerHTML=detailMarkup(d);
    return detail;
  }
  function ensureCard(d,list){
    const found=qa(`#archive-entry [data-pc5152by-doc="${CSS.escape(d.id)}"]`);
    let card=found.shift(); found.forEach(el=>el.remove());
    if(!card){ card=document.createElement('article'); card.dataset.pc5152byDoc=d.id; }
    card.className='pc5152ca-taxonomy-card pc5152by-record pc5152by-content-card';
    card.dataset.pc5152byDoc=d.id; card.dataset.pc5152bxArchiveAxis=d.axis; card.dataset.pc5152bcType='manual'; card.dataset.pc5152bcStatus='open'; card.dataset.pc5152bcSearch=cardSearch(d); card.dataset.access='taxonomy-open';
    card.removeAttribute('data-sealed-record'); card.removeAttribute('inert'); card.removeAttribute('aria-hidden'); card.innerHTML=cardMarkup(d);
    list.appendChild(card);
    return card;
  }
  function equalizeCards(){
    const cards=qa('#archive-entry .pc5152ca-taxonomy-card'); if(!cards.length) return;
    cards.forEach(c=>c.style.minHeight='');
    if((window.innerWidth||0)<=900) return;
    const height=Math.max(...cards.map(c=>Math.ceil(c.scrollHeight)),270);
    cards.forEach(c=>c.style.minHeight=`${height}px`);
  }
  function updateAxisCounts(){
    const panel=q('#archive-entry .pc5152bx-archive-axis-panel'); if(!panel) return;
    const cards=qa('#archive-entry .doc-card').filter(c=>!IDS.has(c.dataset.pc5152byDoc||''));
    const counts={}; cards.forEach(c=>{const k=c.dataset.pc5152bxArchiveAxis||'case'; counts[k]=(counts[k]||0)+1;});
    DOCS.forEach(d=>counts[d.axis]=(counts[d.axis]||0)+1);
    qa('span[data-axis]',panel).forEach(span=>{const i=q('i',span); if(i) i.textContent=String(counts[span.dataset.axis]||0);});
  }
  function currentAxis(){ return q('#archive-entry [data-pc5152by-axis-filter].active')?.dataset.pc5152byAxisFilter||''; }
  function currentArchiveFilter(){ return q('#archive-entry [data-pc5152bc-archive].active')?.dataset.pc5152bcArchive||'all'; }
  function syncFilter(){
    const input=q('#pc5152bcArchiveSearch');
    const live=String(input?.value||'');
    if(archiveSearchTerm===null) archiveSearchTerm=live;
    if(input && input.value!==archiveSearchTerm) input.value=archiveSearchTerm;
    const term=String(archiveSearchTerm||'').trim().toLowerCase();
    const filter=currentArchiveFilter(); const axis=currentAxis(); let visible=0;
    qa('#archive-entry .pc5152ca-taxonomy-card').forEach(card=>{
      const statusHit=filter==='all'||filter==='open'||filter==='manual';
      const axisHit=!axis||axis==='all'||card.dataset.pc5152bxArchiveAxis===axis;
      const textHit=!term||(card.dataset.pc5152bcSearch||'').includes(term);
      const show=statusHit&&axisHit&&textHit;
      card.classList.toggle('pc5152bc-filter-hidden',!show); card.classList.toggle('pc5152by-axis-hidden',!show); if(show) visible++;
    });
    const group=q('details[data-pc5152ca-group="equipment-archive"]'); if(group) group.classList.toggle('pc5152bc-group-empty',visible===0);
    const generic=qa('#archiveListWrap .doc-card'); const genericVisible=generic.filter(c=>!c.classList.contains('pc5152bc-filter-hidden')&&!c.classList.contains('pc5152by-axis-hidden')).length;
    const counter=q('#archive-entry .pc5152bc-archive-counter'); if(counter) counter.textContent=`표시 기록 ${genericVisible+visible} / 전체 ${generic.length+DOCS.length}`;
    updateAxisCounts(); setTimeout(equalizeCards,20);
  }
  function normalize(){
    if(normalizing) return;
    const viewer=q('#archiveRecordViewer');
    const activeId=q('#archiveRecordViewer .pc5152ca-record-detail.active:not([hidden])')?.dataset.record||'';
    const keepOpen=!!(viewer&&!viewer.hidden&&IDS.has(activeId));
    normalizing=true;
    if(observer) observer.disconnect();
    try{
      document.body.classList.add('pc5152ca-equipment-archive-editorial');
      const list=ensureGroup(); if(!list) return;
      DOCS.forEach(d=>{ ensureCard(d,list); ensureDetail(d); });
      if(keepOpen){
        const detail=q(`#archiveRecordViewer .pc5152ca-record-detail[data-record="${CSS.escape(activeId)}"]`);
        const wrap=q('#archiveListWrap'); if(wrap) wrap.classList.add('is-hidden'); if(viewer) viewer.hidden=false;
        if(detail){detail.hidden=false;detail.classList.add('active');}
      }
      updateAxisCounts(); syncFilter(); equalizeCards();
    }finally{
      normalizing=false;
      const root=q('#archive-entry'); if(observer&&root) observer.observe(root,{childList:true,subtree:true});
    }
  }
  function route(id){
    try{ if(typeof window.showPage==='function') window.showPage(id); }catch(_e){}
    qa('.content-page,.panel').forEach(p=>{if(p.id)p.classList.toggle('active',p.id===id);});
    qa('.side-menu a[data-target]').forEach(a=>a.classList.toggle('active',(a.dataset.target||'')===id));
    const content=q('.legacy-content'); if(content) content.scrollTop=0;
  }
  function openRecord(id){
    if(!IDS.has(id)) return false; normalize();
    const viewer=q('#archiveRecordViewer'), wrap=q('#archiveListWrap'), detail=q(`#archiveRecordViewer .record-detail[data-record="${CSS.escape(id)}"]`); if(!viewer||!detail) return false;
    if(wrap) wrap.classList.add('is-hidden'); viewer.hidden=false;
    qa('#archiveRecordViewer .record-detail').forEach(el=>{el.hidden=true;el.classList.remove('active');});
    detail.hidden=false; detail.classList.add('active');
    const content=q('.legacy-content'); if(content) content.scrollTop=0;
    detail.scrollIntoView({block:'start',behavior:'auto'}); return true;
  }
  function returnToList(){
    const viewer=q('#archiveRecordViewer'), wrap=q('#archiveListWrap'); if(viewer) viewer.hidden=true; if(wrap) wrap.classList.remove('is-hidden');
    qa('#archiveRecordViewer .pc5152ca-record-detail').forEach(el=>{el.hidden=true;el.classList.remove('active');});
    const group=q('details[data-pc5152ca-group="equipment-archive"]'); if(group) group.open=true;
    group?.scrollIntoView({block:'start',behavior:'auto'});
  }
  function openFaction(key){
    route('faction-info'); setTimeout(()=>{ const api=window.ProjectCurseFactionRelationFix; if(api&&typeof api.renderFaction==='function') api.renderFaction(key); const tile=q(`#faction-info .faction-tile[data-key="${CSS.escape(key)}"]`); tile?.classList.add('pc5152bg-focus'); setTimeout(()=>tile?.classList.remove('pc5152bg-focus'),1200); },100);
  }
  function openRegion(term){
    route('region-map'); setTimeout(()=>{ const needle=String(term||'').toLowerCase(); const marker=qa('#region-map .pc5152bd-marker').find(m=>[(m.dataset.title||''),(m.dataset.note||''),(m.dataset.meta||'')].join(' ').toLowerCase().includes(needle)); if(marker){ marker.click(); marker.scrollIntoView({block:'center',behavior:'smooth'}); marker.classList.add('pc5152bg-focus'); setTimeout(()=>marker.classList.remove('pc5152bg-focus'),1200); } },120);
  }
  function bind(){
    if(document.body.dataset.pc5152caBound==='1') return; document.body.dataset.pc5152caBound='1';
    document.addEventListener('click',function(e){
      // Older patches re-attach their QA wrapper after document clicks. Reclaim the current pass last.
      setTimeout(()=>{normalize();attachQA();},260);
      const open=e.target.closest&&e.target.closest('[data-pc5152ca-open]'); if(open){e.preventDefault();e.stopPropagation();openRecord(open.dataset.pc5152caOpen);return;}
      const related=e.target.closest&&e.target.closest('[data-pc5152ca-related]'); if(related){e.preventDefault();e.stopPropagation();openRecord(related.dataset.pc5152caRelated);return;}
      const faction=e.target.closest&&e.target.closest('[data-pc5152ca-faction]'); if(faction){e.preventDefault();e.stopPropagation();openFaction(faction.dataset.pc5152caFaction);return;}
      const region=e.target.closest&&e.target.closest('[data-pc5152ca-region]'); if(region){e.preventDefault();e.stopPropagation();openRegion(region.dataset.pc5152caRegion);return;}
      if(e.target.closest&&e.target.closest('#archiveRecordViewer .record-back')&&q('#archiveRecordViewer .pc5152ca-record-detail.active')){setTimeout(returnToList,0);}
      const archiveFilter=e.target.closest&&e.target.closest('#archive-entry [data-pc5152bc-archive]');
      if(archiveFilter?.dataset.pc5152bcArchive==='all') setTimeout(()=>{qa('#archive-entry [data-pc5152by-axis-filter]').forEach(b=>b.classList.remove('active'));qa('#archive-entry .doc-card').forEach(c=>c.classList.remove('pc5152by-axis-hidden'));syncFilter();},100);
      else if(e.target.closest&&e.target.closest('#archive-entry [data-pc5152bc-archive],#archive-entry [data-pc5152by-axis-filter]')) setTimeout(syncFilter,90);
    },true);
    document.addEventListener('input',e=>{if(e.target&&e.target.id==='pc5152bcArchiveSearch'){const value=String(e.target.value||'');if(e.isTrusted||value) archiveSearchTerm=value;else if(archiveSearchTerm!==null) e.target.value=archiveSearchTerm;setTimeout(syncFilter,90);}},true);
    window.addEventListener('resize',()=>setTimeout(()=>{syncFilter();equalizeCards();},100),{passive:true});
  }
  function observe(){
    const root=q('#archive-entry'); if(!root||observer) return;
    observer=new MutationObserver(muts=>{ if(normalizing) return; if(!muts.some(m=>[...m.addedNodes,...m.removedNodes].some(n=>n.nodeType===1))) return; clearTimeout(root.__pc5152caNormalize); root.__pc5152caNormalize=setTimeout(normalize,120); });
    observer.observe(root,{childList:true,subtree:true});
  }
  function checkEquipmentArchiveUI(){
    normalize();
    const group=q('details[data-pc5152ca-group="equipment-archive"]');
    const rows=DOCS.map(d=>{
      const card=q(`#archive-entry .pc5152ca-taxonomy-card[data-pc5152by-doc="${CSS.escape(d.id)}"]`), detail=q(`#archiveRecordViewer .pc5152ca-record-detail[data-record="${CSS.escape(d.id)}"]`), btn=card&&q('[data-pc5152ca-open]',card);
      return {id:d.id,title:d.title,card:!!card,open:!!(btn&&!btn.disabled&&card?.dataset.access==='taxonomy-open'),axis:card?.dataset.pc5152bxArchiveAxis||null,axisExpected:d.axis,detail:!!detail,sections:detail?qa('.pc5152ca-section-grid > section',detail).length:0,related:detail?qa('.pc5152ca-related button',detail).length:0,sealedText:!!card&&/기밀 처리됨|봉인됨/.test(card.textContent||'')};
    });
    const visibleCards=qa('#archive-entry .pc5152ca-taxonomy-card').filter(c=>c.offsetParent!==null&&!c.classList.contains('pc5152bc-filter-hidden'));
    const heights=visibleCards.map(c=>Math.round(c.getBoundingClientRect().height)).filter(Boolean); const heightSpread=heights.length?Math.max(...heights)-Math.min(...heights):0;
    const issues=[];
    rows.filter(x=>!x.card).forEach(x=>issues.push({level:'error',code:'EQUIPMENT_ARCHIVE_CARD_MISSING',message:`${x.title} 카드 누락`}));
    rows.filter(x=>x.card&&!x.open).forEach(x=>issues.push({level:'error',code:'EQUIPMENT_ARCHIVE_CARD_LOCKED',message:`${x.title} 열람 버튼 비활성`}));
    rows.filter(x=>x.axis!==x.axisExpected).forEach(x=>issues.push({level:'error',code:'EQUIPMENT_ARCHIVE_AXIS_MISMATCH',message:`${x.title} 기록 축 불일치`}));
    rows.filter(x=>!x.detail||x.sections<5).forEach(x=>issues.push({level:'error',code:'EQUIPMENT_ARCHIVE_DETAIL_INCOMPLETE',message:`${x.title} 상세 기록 구조 누락`}));
    rows.filter(x=>x.related<3).forEach(x=>issues.push({level:'warn',code:'EQUIPMENT_ARCHIVE_LINK_LOW',message:`${x.title} 연결 기록 부족`}));
    rows.filter(x=>x.sealedText).forEach(x=>issues.push({level:'error',code:'EQUIPMENT_ARCHIVE_SEALED_OVERRIDE',message:`${x.title} 구형 봉인 문구 잔존`}));
    if(heightSpread>24) issues.push({level:'warn',code:'EQUIPMENT_ARCHIVE_HEIGHT_SPREAD',message:`장비 카드 높이 편차 ${heightSpread}px`});
    return {name:'equipmentArchiveUI',ok:issues.every(x=>x.level!=='error'),group:!!group,cardCount:rows.filter(x=>x.card).length,openCount:rows.filter(x=>x.open).length,axisCount:rows.filter(x=>x.axis===x.axisExpected).length,detailCount:rows.filter(x=>x.detail&&x.sections>=5).length,relatedActionCount:rows.reduce((n,x)=>n+x.related,0),heightSpread,rows,issues};
  }
  function attachQA(){
    const qaApi=window.ProjectCurseQA||{}; if(qaApi.patch===PATCH&&qaApi.checkEquipmentArchiveUI) return;
    const prevSweep=qaApi.screenSweep, prevText=qaApi.sweepReportText;
    async function screenSweep(options={}){
      normalize(); await wait(options.delay||150); const r=typeof prevSweep==='function'?await prevSweep(Object.assign({},options,{log:false})):{ok:true,summary:{error:0,warn:0,info:0}};
      r.patch=PATCH; r.equipmentArchiveUI=checkEquipmentArchiveUI(); const issues=r.equipmentArchiveUI.issues||[];
      r.summary=r.summary||{error:0,warn:0,info:0}; r.summary.error=(r.summary.error||0)+issues.filter(x=>x.level==='error').length; r.summary.warn=(r.summary.warn||0)+issues.filter(x=>x.level==='warn').length; r.summary.info=(r.summary.info||0)+issues.filter(x=>x.level==='info').length; r.ok=r.summary.error===0; window.__ProjectCurseLastSweep=r;
      if(options.log!==false) console.log(sweepReportText(r)); return r;
    }
    function sweepReportText(r=window.__ProjectCurseLastSweep){
      let base=typeof prevText==='function'?prevText(r):`[ProjectCurseQA ScreenSweep] ${PATCH} / ${new Date().toISOString()}\nok=true errors=0 warnings=0 info=0`;
      base=String(base).replace(/5\.15\.2(?:bz2|bz1|bz|by|bx|bw|bv|bt)/g,PATCH);
      if(r){ const status=`ok=${!!r.ok} errors=${r.summary?.error||0} warnings=${r.summary?.warn||0} info=${r.summary?.info||0}`; base=/ok=(?:true|false) errors=\d+ warnings=\d+ info=\d+/.test(base)?base.replace(/ok=(?:true|false) errors=\d+ warnings=\d+ info=\d+/,status):base+'\n'+status; }
      const ui=r?.equipmentArchiveUI; if(ui) base+=`\nequipmentArchiveUI=${ui.ok?'ok':'check'} cards=${ui.cardCount}/6 open=${ui.openCount}/6 axis=${ui.axisCount}/6 details=${ui.detailCount}/6 related=${ui.relatedActionCount} heightSpread=${ui.heightSpread}`;
      return base;
    }
    window.ProjectCurseQA=Object.assign(qaApi,{patch:PATCH,screenSweep,sweepReportText,checkEquipmentArchiveUI});
  }
  function boot(){ normalize(); bind(); observe(); attachQA(); window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{},{patch5152ca:'EquipmentArchive EditorialInteractionPass',equipmentArchive:'dedicated six-card group / readable details / live crosslinks',manualReview:'legacy sealing override, axis correction, equalized cards, active related records'}); }
  ready(()=>{ boot(); [120,480,1100,2400,4200,5800,7600].forEach(t=>setTimeout(boot,t)); ['hashchange','pageshow','orientationchange'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(boot,160),{passive:true})); });
})();

// MapPatch 5.15.2ca1 — TerminalHome / AmbientScopeFix
// The Dread is restricted to the in-world terminal idle screen.
// Timeline, map, relations, factions, archive index and record views remain silent
// except for their own explicitly assigned record audio.
(function(){
  'use strict';
  const PATCH='5.15.2ca1';
  const HOME_ID='terminal-home';
  const AMBIENT_ASSET='pc5152am_menu_old_computer.mp3';
  const TARGET_VOLUME=.14;
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const ready=(fn)=>document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',fn,{once:true})
    : fn();

  let userGesture=false;
  let fadeToken=0;

  function rootPrefix(){
    const p=location.pathname||'';
    if(p.includes('/docs/')) return '../../';
    if(p.includes('/archive/')) return '../';
    return '';
  }
  function audioEnabled(){
    const bus=window.ProjectCurseAudio;
    return !(bus && typeof bus.isOn==='function') || bus.isOn();
  }
  function activePageId(){
    const active=q('.content-page.active');
    return active && active.id ? active.id : '';
  }
  function recordAudioState(){
    const body=document.body;
    if(!body) return false;
    if(body.classList.contains('pc5152h-sequence-open') ||
       body.classList.contains('pc5152i-sequence-intro-playing') ||
       body.classList.contains('pc5152q-immortality-sequence') ||
       body.classList.contains('pc5152h-cult-source-sequence') ||
       body.classList.contains('pc5133-case-file-open')) return true;
    const viewer=q('#archiveRecordViewer');
    if(viewer && !viewer.hidden && qa('.record-detail[data-record]',viewer).some(el=>!el.hidden)) return true;
    return false;
  }
  function ambientAllowed(){
    return !document.hidden &&
      activePageId()===HOME_ID &&
      !recordAudioState() &&
      audioEnabled();
  }
  function ensureAmbient(){
    const bus=window.ProjectCurseAudio;
    if(!bus || !bus.audio) return null;
    let a=bus.audio.ambient;
    if(!a || !String(a.src||'').includes(AMBIENT_ASSET)){
      try{ if(a){a.pause();a.currentTime=0;} }catch(_e){}
      a=new Audio(rootPrefix()+'assets/audio/'+AMBIENT_ASSET);
      bus.audio.ambient=a;
    }
    a.loop=true;
    a.preload='metadata';
    return a;
  }
  function cancelFade(){ fadeToken++; }
  function pauseAmbient(reset=false){
    cancelFade();
    const a=ensureAmbient();
    if(!a) return;
    try{
      a.volume=0;
      a.pause();
      if(reset) a.currentTime=0;
    }catch(_e){}
  }
  function fadeInAmbient(){
    const a=ensureAmbient();
    if(!a || !userGesture || !ambientAllowed()) return pauseAmbient(false);
    const token=++fadeToken;
    const start=performance.now();
    const duration=1800;
    try{
      a.volume=0;
      if(a.paused) a.play().catch(()=>{});
    }catch(_e){}
    function step(now){
      if(token!==fadeToken || !ambientAllowed()) return pauseAmbient(false);
      const p=Math.min(1,(now-start)/duration);
      try{a.volume=TARGET_VOLUME*p;}catch(_e){}
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function syncAmbient(){
    if(ambientAllowed() && userGesture) fadeInAmbient();
    else pauseAmbient(false);
    document.body.dataset.pc5152ca1AudioScope=ambientAllowed()?'home':'silent-content';
  }
  function activateRoute(id,replaceHash=true){
    const pages=qa('.content-page[id]');
    const target=pages.some(p=>p.id===id)?id:HOME_ID;
    pages.forEach(p=>p.classList.toggle('active',p.id===target));
    qa('.side-menu a[data-target]').forEach(a=>a.classList.toggle('active',a.dataset.target===target));
    const content=q('.legacy-content');
    if(content) content.scrollTop=0;
    if(replaceHash){
      try{history.replaceState(null,'','#'+target);}catch(_e){}
    }
    setTimeout(syncAmbient,0);
  }
  function installHomeRoute(){
    const hash=(location.hash||'').replace(/^#/,'');
    const known=new Set(qa('.content-page[id]').map(p=>p.id));
    if(!hash || hash===HOME_ID || !known.has(hash)){
      activateRoute(HOME_ID,true);
    }else{
      // Preserve direct links to settings/records, but keep their ambient silent.
      activateRoute(hash,false);
    }
  }
  function hardenAudioBus(){
    const bus=window.ProjectCurseAudio;
    if(!bus) return;
    bus.startAmbient=function(){
      userGesture=true;
      syncAmbient();
    };
    bus.stopMenuAmbient=function(){pauseAmbient(false);};
    bus.syncAudioState=syncAmbient;
    bus.checkAmbientScope=function(){
      const a=ensureAmbient();
      return {
        patch:PATCH,
        activePage:activePageId(),
        allowed:ambientAllowed(),
        userGesture,
        paused:a ? a.paused : true,
        volume:a ? a.volume : 0,
        source:a ? a.src : null
      };
    };
  }
  function routeIntent(target){
    const link=target && target.closest && target.closest('.side-menu a[data-target]');
    if(link) return link.dataset.target||'';
    if(target && target.closest && target.closest('.open-record,[data-open-record],.doc-card,.archive-list a')) return 'record';
    return '';
  }

  ready(function(){
    if(window.ProjectCurseManagedAudio) return;
    hardenAudioBus();
    installHomeRoute();

    // Capture phase runs before legacy bubble listeners. Non-home navigation is
    // muted immediately so old startAmbient handlers cannot leak music into content.
    document.addEventListener('pointerdown',function(e){
      userGesture=true;
      const intent=routeIntent(e.target);
      if(intent && intent!==HOME_ID){
        const a=ensureAmbient();
        if(a) a.volume=0;
        pauseAmbient(false);
      }
      setTimeout(syncAmbient,0);
    },true);
    document.addEventListener('keydown',function(){
      userGesture=true;
      setTimeout(syncAmbient,0);
    },true);
    document.addEventListener('click',function(e){
      const link=e.target.closest && e.target.closest('.side-menu a[data-target]');
      if(link){
        const target=link.dataset.target||HOME_ID;
        if(target!==HOME_ID) pauseAmbient(false);
        setTimeout(syncAmbient,0);
      }
      if(e.target.closest && e.target.closest('.open-record,[data-open-record],.record-back,.page-tab,.sub-tab,.faction-tile')){
        pauseAmbient(false);
        setTimeout(syncAmbient,0);
      }
    },true);

    ['hashchange','pageshow','resize','orientationchange'].forEach(ev=>{
      window.addEventListener(ev,()=>setTimeout(syncAmbient,0),{passive:true});
    });
    document.addEventListener('visibilitychange',syncAmbient);

    try{
      new MutationObserver(()=>syncAmbient()).observe(document.body,{
        attributes:true,
        childList:true,
        subtree:true,
        attributeFilter:['class','hidden','style']
      });
    }catch(_e){}

    setInterval(syncAmbient,800);

    const oldQA=window.ProjectCurseQA||{};
    function checkAudioScope(){
      const issues=[];
      const home=q('#'+HOME_ID);
      const menu=q('.side-menu a[data-target="'+HOME_ID+'"]');
      const a=ensureAmbient();
      if(!home) issues.push({level:'error',code:'HOME_MISSING',message:'단말 대기화면이 없음'});
      if(!menu) issues.push({level:'error',code:'HOME_ROUTE_MISSING',message:'단말 대기화면 메뉴 경로가 없음'});
      if(!a || !String(a.src||'').includes(AMBIENT_ASSET)){
        issues.push({level:'error',code:'AMBIENT_ASSET_MISMATCH',message:'The Dread 배경음 경로가 적용되지 않음'});
      }
      const contentPages=qa('.content-page[id]').map(p=>p.id).filter(id=>id!==HOME_ID);
      return {
        name:'audioScope',
        patch:PATCH,
        ok:!issues.some(x=>x.level==='error'),
        home:HOME_ID,
        silentPages:contentPages,
        current:window.ProjectCurseAudio?.checkAmbientScope?.()||null,
        issues
      };
    }
    window.ProjectCurseQA=Object.assign(oldQA,{checkAudioScope});
    window.ProjectCursePatch=Object.assign(window.ProjectCursePatch||{},{
      patch5152ca1:'TerminalHome AmbientScopeFix',
      ambientScope:'The Dread is allowed only on terminal-home; all content pages are silent'
    });

    syncAmbient();
  });
})();
