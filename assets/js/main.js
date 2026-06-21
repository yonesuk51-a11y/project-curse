document.addEventListener('DOMContentLoaded',()=>{
  function rootPrefix(){const p=location.pathname.replace(/\\/g,'/'); if(p.includes('/docs/'))return '../../'; if(p.includes('/archive/'))return '../'; return '';}
  const prefix=rootPrefix();
  const loader=document.getElementById('loader'); const app=document.getElementById('app');
  const audio={
    menu:new Audio(prefix+'assets/audio/menu_tick.mp3'),
    open:new Audio(prefix+'assets/audio/record_open.mp3'),
    page:new Audio(prefix+'assets/audio/page_turn.mp3'),
    boot:new Audio(prefix+'assets/audio/boot_legacy.mp3')
  };
  audio.menu.volume=.28; audio.open.volume=.32; audio.page.volume=.28; audio.boot.volume=.30;
  if(localStorage.getItem('pc_audio_legacy2003_fixed')===null) localStorage.setItem('pc_audio_legacy2003_fixed','on');
  function isOn(){return localStorage.getItem('pc_audio_legacy2003_fixed')!=='off'}
  function play(a){if(!isOn()||!a)return; try{a.currentTime=0; a.play().catch(()=>{});}catch(e){}}
  function syncBtns(){document.querySelectorAll('#audioToggle').forEach(b=>b.textContent=isOn()?'효과음: 켜짐':'효과음: 꺼짐')}
  syncBtns();
  if(loader){setTimeout(()=>{loader.classList.add('hide'); if(app)app.classList.add('ready'); play(audio.boot);},1650);} else {if(app)app.classList.add('ready');}
  document.querySelectorAll('#audioToggle').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('pc_audio_legacy2003_fixed',isOn()?'off':'on'); syncBtns(); if(isOn())play(audio.menu);}));

  const pages=Array.from(document.querySelectorAll('.content-page'));
  const links=Array.from(document.querySelectorAll('.side-menu a[data-target]'));
  function show(id){
    if(!pages.length) return;
    const exists=pages.some(p=>p.id===id); if(!exists) id='history';
    pages.forEach(p=>p.classList.toggle('active',p.id===id));
    links.forEach(a=>a.classList.toggle('active',a.dataset.target===id));
    const content=document.querySelector('.legacy-content'); if(content) content.scrollTop=0;
  }
  links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); play(audio.menu); show(a.dataset.target); history.replaceState(null,'','#'+a.dataset.target);}));
  if(pages.length){show((location.hash||'#history').slice(1));}
  document.querySelectorAll('[data-open-record], .archive-list a, .backline a, .btn').forEach(a=>a.addEventListener('click',()=>play(audio.open)));

  const factionData={
    uac:{img:'uac.webp',name:'U.A.C',meta:'도시 이상현상 격리국 / 상위 통제 기관',body:['도시 내부에서 발생하는 이상현상, 괴이 출현, 우시노다교 의식, 오컬트 재난, 적성 종교 세력의 침투를 감시하고 격리하기 위해 설립된 국가 안보 기관이다.','1986년 피의 호수 사건 이후 기존 법집행 체계만으로는 대응할 수 없는 이상현상을 관리하기 위해 만들어졌다.','주요 임무는 구역 분류, 정보 은폐, 기록 보존, 기관 간 작전 조율, 위험 구역 봉쇄 승인이다.']},
    nhc:{img:'nhc.webp',name:'N.H.C',meta:'현장 전투 / 봉쇄 / 장비 운용',body:['레드존 진입과 현장 봉쇄를 담당하는 전투 조직이다.','민간인 철수, 괴이 교전, 봉쇄선 유지, 장비 운용, 위험 구역 작전 규정을 수행한다.','U.A.C의 정보와 명령을 기반으로 움직이지만 현장 판단권은 점차 독립적으로 확대되었다.']},
    sid:{img:'sid.webp',name:'S.I.D',meta:'오컬트 사건 / 실종 / 범죄 조사',body:['우시노다교 의식, 실종 사건, 기억 오염, 귀환자 관련 사건을 조사하는 특수 조사 기관이다.','사쿠마 유타 실종 사건 같은 오컬트 범죄 기록과 직접 연결된다.','N.H.C가 현장을 봉쇄한다면 S.I.D는 사건의 원인과 의식 흔적을 추적한다.']},
    fhc:{img:'fhc.webp',name:'F.H.C',meta:'극비 연구 / 생체 분석 / 상호 불신',body:['오염 분석, 생체 연구, 괴이 조직, 유전자 기록, 치료 기술과 연결된 연구 조직이다.','U.A.C와 협력하지만 비인가 실험과 생체 병기화 가능성 때문에 항상 감시 대상이다.','F.H.C 극비 보안 문서는 연구 기록이 단순 의료 목적을 넘어섰다는 정황을 포함한다.']},
    amarion:{img:'amarion.webp',name:'Amarion',meta:'제약 기업 / 의료 재조립 / 현실 접속 연구',body:['제약과 의료 기술을 표면에 둔 기업형 연구 세력이다.','피의 호수, 생체 복구, 의료 재조립, 괴이 유전자 실험과 연결된 자료에서 반복적으로 등장한다.','회수 영상 기록에서는 교육 자료 형식 아래에 비정상 연구 목적이 숨겨져 있는 것으로 분류된다.']},
    syndicate:{img:'syndicate.webp',name:'Syndicate',meta:'이탈 무장 네트워크 / Redwolf 계열 통합',body:['비인가 거래, 정보 탈취, 생체 시료 유통, 레드존 외곽 무장 활동과 연결된 세력이다.','Redwolf 계열 이탈 전투조직은 별도 세력으로 분리하지 않고 신디케이트 네트워크 안에 포함해서 다룬다.','N.H.C와 U.A.C 입장에서는 추적 대상이자 정보 유출의 주요 경로다.']},
    ushinoda:{img:'ushinoda.webp',name:'우시노다교',meta:'타락교와 혈교를 포함한 통합 적대 종교',body:['인신공양, 기억 오염, 괴이 발생, 귀환자 왜곡과 연결되는 핵심 적대 종교 세력이다.','타락교와 혈교는 별도 메뉴로 나누지 않고 우시노다교 내부 계열 또는 의식 분파로 통합한다.','피의 호수 사건, 사쿠마 유타 실종 기록, 레드존 오염 기준과 강하게 연결된다.']},
    haimun:{img:'haimun.webp',name:'Haimun',meta:'도심 침투 / 비공식 거점 / 시민 납치',body:['도심 내부에서 움직이는 침투형 조직으로, 비공식 거점과 민간 구역 내부 의식 준비와 연결된다.','지역에 따라 생존자 조직처럼 위장하거나 우시노다교 계열 의식 집행자와 접촉한다.','민간인 실종과 검문 회피 기록에서 반복적으로 언급된다.']},
    ashcrew:{img:'ashcrew.webp',name:'Ash Crew',meta:'오염 시체 / 장비 / 잔류물 처리반',body:['N.H.C와 A.R.F가 지나간 뒤 현장에 남은 오염 시체, 오염 장비, 혈액 잔류물, 저주받은 장비를 회수하거나 소각하는 사후 처리 조직이다.','전투보다 회수와 폐기 절차에 집중하며, 현장 기록에서 가장 늦게 투입되는 경우가 많다.','오염 수준이 높아 일반 회수 인력 투입이 불가능한 구역에서 작전한다.']},
    arf:{img:'arf.webp',name:'A.R.F',meta:'회수 부대 / 시료와 기록 복구',body:['이상현상 발생 이후 현장에서 생존자, 시료, 장비, 문서, 영상 기록을 회수하는 부대다.','N.H.C가 현장 안전을 확보한 뒤 투입되는 경우가 많으며, 회수 실패 지역은 Black File 또는 회수 금지 구역으로 분류된다.','회수품은 U.A.C 기록 서버, F.H.C 분석 부서, S.I.D 사건 데이터베이스로 분배된다.']},
    cpd:{img:'cpd.webp',name:'C.P.D',meta:'민간 보호 / 피난민 선별 / 검문 게이트',body:['민간인 대피, 피난민 수용, 귀환자 선별, 검문 게이트 운영을 담당하는 민간 보호 조직이다.','레드존 경계의 혼란을 통제하고 오염 의심자와 귀환 민간인을 분리한다.','전투 조직은 아니지만 재난 사회를 유지하기 위한 핵심 행정·보호 기능을 맡는다.']}
  };
  const detail=document.getElementById('factionDetail');
  function renderFaction(key){const d=factionData[key]||factionData.uac; if(detail){detail.innerHTML=`<img class="faction-mark-large" src="${prefix}assets/faction_marks/${d.img}" alt="${d.name}"><h3>${d.name}</h3><div class="meta">${d.meta}</div><ul>${d.body.map(x=>`<li>${x}</li>`).join('')}</ul>`;} document.querySelectorAll('.faction-tile').forEach(b=>b.classList.toggle('active',b.dataset.key===key));}
  document.querySelectorAll('.faction-tile').forEach(b=>b.addEventListener('click',()=>{play(audio.page); renderFaction(b.dataset.key)})); if(detail) renderFaction('uac');

  document.querySelectorAll('.paged-record').forEach(box=>{
    const recPages=Array.from(box.querySelectorAll('.record-page'));
    const tabs=box.querySelector('.page-tabs');
    if(!recPages.length||!tabs) return;
    function showRec(i, sound=true){recPages.forEach((p,idx)=>p.classList.toggle('active',idx===i)); tabs.querySelectorAll('.page-tab').forEach((b,idx)=>b.classList.toggle('active',idx===i)); if(sound) play(audio.page); const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0; else window.scrollTo(0,0);}
    tabs.querySelectorAll('.page-tab').forEach((b,i)=>b.addEventListener('click',()=>showRec(i,true)));
    showRec(0,false);
  });
});
