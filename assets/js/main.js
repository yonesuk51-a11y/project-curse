
document.addEventListener('DOMContentLoaded',()=>{
  const loader=document.getElementById('loader'); const app=document.getElementById('app');
  setTimeout(()=>{ if(loader) loader.classList.add('hide'); if(app) app.classList.add('ready'); },1500);

  function rootPrefix(){const p=location.pathname.replace(/\\/g,'/'); if(p.includes('/docs/'))return '../../'; if(p.includes('/archive/'))return '../'; return '';}
  const prefix=rootPrefix();
  const menu=new Audio(prefix+'assets/audio/menu_tick.mp3'); menu.volume=.22;
  const open=new Audio(prefix+'assets/audio/record_open.mp3'); open.volume=.26;
  const page=new Audio(prefix+'assets/audio/page_turn.mp3'); page.volume=.28;
  const boot=new Audio(prefix+'assets/audio/boot_legacy.mp3'); boot.volume=.28;
  let sound=localStorage.getItem('pc_audio'); if(sound===null){sound='on'; localStorage.setItem('pc_audio','on');}
  function isOn(){return localStorage.getItem('pc_audio')!=='off'}
  function play(a){if(!isOn())return; try{a.currentTime=0; a.play().catch(()=>{});}catch(e){}}
  function syncBtns(){document.querySelectorAll('#audioToggle').forEach(b=>b.textContent=isOn()?'효과음: 켜짐':'효과음: 꺼짐')}
  syncBtns(); setTimeout(()=>play(boot),250);
  document.querySelectorAll('#audioToggle').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('pc_audio',isOn()?'off':'on'); syncBtns(); if(isOn())play(menu);}));

  const pages=Array.from(document.querySelectorAll('.content-page'));
  const links=Array.from(document.querySelectorAll('.side-menu a[data-target]'));
  function show(id){pages.forEach(p=>p.classList.toggle('active',p.id===id)); links.forEach(a=>a.classList.toggle('active',a.dataset.target===id)); if(pages.length) window.scrollTo({top:0});}
  links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); play(menu); show(a.dataset.target); history.replaceState(null,'','#'+a.dataset.target)}));
  if(pages.length){const id=(location.hash||'#history').slice(1); show(document.getElementById(id)?id:'history');}
  document.querySelectorAll('.side-menu a:not([data-target]), .archive-list a, .backline a, .btn').forEach(a=>a.addEventListener('click',()=>play(open)));

  const factionData={
    uac:{name:'U.A.C',meta:'도시 이상현상 격리국 / 상위 통제 기관',body:['도시 이상현상, 레드존 확산, 오컬트 재난, 괴이 출현 기록을 통제하는 상위 기관이다.','1986년 피의 호수 사건 이후 기존 법집행 체계만으로는 대응할 수 없는 이상현상을 관리하기 위해 설립되었다.','주요 역할은 구역 분류, 정보 은폐, 기록 보존, 기관 간 작전 조율, 위험 구역 봉쇄 승인이다.']},
    nhc:{name:'N.H.C',meta:'현장 전투 / 봉쇄 / 장비 운용',body:['레드존 진입과 현장 봉쇄를 담당하는 전투 조직이다.','민간인 철수, 괴이 교전, 봉쇄선 유지, 장비 운용, 위험 구역 작전 규정을 수행한다.','U.A.C의 정보와 명령을 기반으로 움직이지만 현장 판단권은 점차 독립적으로 확대되었다.']},
    sid:{name:'S.I.D',meta:'오컬트 사건 / 실종 / 범죄 조사',body:['우시노다교 의식, 실종 사건, 기억 오염, 귀환자 관련 사건을 조사하는 특수 조사 기관이다.','사쿠마 유타 실종 사건 같은 오컬트 범죄 기록과 직접 연결된다.','N.H.C가 현장을 봉쇄한다면 S.I.D는 사건의 원인과 의식 흔적을 추적한다.']},
    arf:{name:'A.R.F',meta:'회수 부대 / 시료와 기록 복구',body:['A.R.F는 이상현상 발생 이후 현장에서 생존자, 시료, 장비, 문서, 영상 기록을 회수하는 부대다.','N.H.C가 현장 안전을 확보한 뒤 투입되는 경우가 많으며, 회수 실패 지역은 Black File 또는 회수 금지 구역으로 분류된다.','회수품은 U.A.C 기록 서버, F.H.C 분석 부서, S.I.D 사건 데이터베이스로 분배된다.']},
    fhc:{name:'F.H.C',meta:'극비 연구 / 생체 분석 / 상호 불신',body:['F.H.C는 오염 분석, 생체 연구, 괴이 조직, 유전자 기록, 치료 기술과 연결된 연구 조직이다.','U.A.C와 협력하지만, 비인가 실험과 생체 병기화 가능성 때문에 항상 감시 대상이다.','F.H.C 극비 보안 문서는 연구 기록이 단순 의료 목적을 넘어섰다는 정황을 포함한다.']},
    amarion:{name:'Amarion',meta:'제약 기업 / 의료 재조립 / 현실 접속 연구',body:['아마리온은 제약과 의료 기술을 표면에 둔 기업형 연구 세력이다.','피의 호수, 생체 복구, 의료 재조립, 괴이 유전자 실험과 연결된 자료에서 반복적으로 등장한다.','회수 영상 기록에서는 교육 자료 형식 아래에 비정상 연구 목적이 숨겨져 있는 것으로 분류된다.']},
    syndicate:{name:'Syndicate',meta:'이탈 무장 네트워크 / Redwolf 계열 통합',body:['Syndicate는 비인가 거래, 정보 탈취, 생체 시료 유통, 레드존 외곽 무장 활동과 연결된 세력이다.','Redwolf 계열 이탈 전투조직은 별도 세력으로 분리하지 않고 신디케이트 네트워크 안에 포함해서 다룬다.','N.H.C와 U.A.C 입장에서는 추적 대상이자 정보 유출의 주요 경로다.']},
    ushinoda:{name:'우시노다교',meta:'타락교와 혈교를 포함한 통합 적대 종교',body:['우시노다교는 인신공양, 기억 오염, 괴이 발생, 귀환자 왜곡과 연결되는 핵심 적대 종교 세력이다.','타락교와 혈교는 별도 메뉴로 나누지 않고 우시노다교 내부 계열 또는 의식 분파로 통합한다.','피의 호수 사건, 사쿠마 유타 실종 기록, 레드존 오염 기준과 강하게 연결된다.']},
    haimun:{name:'Haimun',meta:'도심 침투 / 비공식 거점 / 시민 납치',body:['Haimun은 도심 내부에서 움직이는 침투형 조직으로, 비공식 거점과 민간 구역 내부 의식 준비와 연결된다.','지역에 따라 생존자 조직처럼 위장하거나, 우시노다교 계열 의식 집행자와 접촉한다.','민간인 실종과 검문 회피 기록에서 반복적으로 언급된다.']}
  };
  const detail=document.getElementById('factionDetail');
  function renderFaction(key){const d=factionData[key]||factionData.uac; if(detail){detail.innerHTML=`<h3>${d.name}</h3><div class="meta">${d.meta}</div><ul>${d.body.map(x=>`<li>${x}</li>`).join('')}</ul>`;} document.querySelectorAll('.faction-tile').forEach(b=>b.classList.toggle('active',b.dataset.key===key));}
  document.querySelectorAll('.faction-tile').forEach(b=>b.addEventListener('click',()=>{play(page); renderFaction(b.dataset.key)})); renderFaction('uac');

  document.querySelectorAll('.paged-record').forEach(box=>{
    const recPages=Array.from(box.querySelectorAll('.record-page'));
    const tabs=box.querySelector('.page-tabs');
    function showRec(i){recPages.forEach((p,idx)=>p.classList.toggle('active',idx===i)); if(tabs) tabs.querySelectorAll('button').forEach((b,idx)=>b.classList.toggle('active',idx===i)); play(page); window.scrollTo({top:0});}
    if(tabs){tabs.querySelectorAll('button').forEach((b,i)=>b.addEventListener('click',()=>showRec(i)));}
  });
});
