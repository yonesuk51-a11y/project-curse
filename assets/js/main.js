document.addEventListener('DOMContentLoaded',()=>{
  function rootPrefix(){const p=location.pathname; if(p.includes('/docs/'))return '../../'; if(p.includes('/archive/'))return '../'; return '';}
  const prefix=rootPrefix();
  const loader=document.getElementById('loader'); const app=document.getElementById('app');
  const audio={menu:new Audio(prefix+'assets/audio/menu_tick.mp3'),open:new Audio(prefix+'assets/audio/record_open.mp3'),page:new Audio(prefix+'assets/audio/page_turn.mp3'),boot:new Audio(prefix+'assets/audio/boot_legacy.mp3')};
  audio.menu.volume=.26; audio.open.volume=.30; audio.page.volume=.28; audio.boot.volume=.30;
  if(localStorage.getItem('pc_audio_legacy2003_fixed')===null) localStorage.setItem('pc_audio_legacy2003_fixed','on');
  function isOn(){return localStorage.getItem('pc_audio_legacy2003_fixed')!=='off'}
  function play(a){if(!isOn()||!a)return; try{a.currentTime=0; a.play().catch(()=>{});}catch(e){}}
  function syncBtns(){document.querySelectorAll('#audioToggle').forEach(b=>b.textContent=isOn()?'효과음: 켜짐':'효과음: 꺼짐')}
  syncBtns();
  if(loader){setTimeout(()=>{loader.classList.add('hide'); if(app)app.classList.add('ready'); play(audio.boot);},1650);} else {if(app)app.classList.add('ready');}
  document.querySelectorAll('#audioToggle').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('pc_audio_legacy2003_fixed',isOn()?'off':'on'); syncBtns(); if(isOn())play(audio.menu);}));

  const pages=Array.from(document.querySelectorAll('.content-page'));
  const links=Array.from(document.querySelectorAll('.side-menu a[data-target]'));
  function show(id){ if(!pages.length)return; if(!pages.some(p=>p.id===id)) id='history'; pages.forEach(p=>p.classList.toggle('active',p.id===id)); links.forEach(a=>a.classList.toggle('active',a.dataset.target===id)); const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0; }
  links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); play(audio.menu); show(a.dataset.target); history.replaceState(null,'','#'+a.dataset.target);}));
  if(pages.length){show((location.hash||'#history').slice(1));}
  document.querySelectorAll('[data-open-record], .archive-list a, .backline a, .btn').forEach(a=>a.addEventListener('click',()=>play(audio.open)));

  const factionData={
    uac:{img:'uac.webp',name:'U.A.C',meta:'도시 이상현상 격리국 / 상위 통제 기관',pages:[
      ['개요','도시 내부에서 발생하는 이상현상, 괴이 출현, 우시노다교 의식, 오컬트 재난, 적성 종교 세력의 침투를 감시하고 격리하기 위해 설립된 국가 안보 기관이다. 1986년 피의 호수 사건 이후 기존 법집행 체계만으로는 대응할 수 없는 이상현상을 관리하기 위해 만들어졌다.'],
      ['주요 임무','구역 분류, 정보 은폐, 기록 보존, 기관 간 작전 조율, 위험 구역 봉쇄 승인, 귀환자 선별 기준 수립을 담당한다. U.A.C는 현장 작전보다 정보 통제와 정책 결정에 가까운 상위 기관으로 기능한다.'],
      ['기관 관계','N.H.C, S.I.D, A.R.F, C.P.D, Ash Crew와 협력하지만 모든 세부 작전 정보를 공유하지는 않는다. F.H.C와 Amarion은 필요한 연구 파트너이면서 동시에 감시 대상이다.'],
      ['위험성','U.A.C의 가장 큰 위험은 기록 은폐와 통제 권한이 지나치게 집중되어 있다는 점이다. 여러 현장 기록에서 U.A.C의 명령 지연, 정보 검열, 회수 실패 은폐 정황이 반복적으로 언급된다.']
    ]},
    nhc:{img:'nhc.webp',name:'N.H.C',meta:'현장 전투 / 봉쇄 / 장비 운용',pages:[
      ['개요','레드존 진입과 현장 봉쇄를 담당하는 전투 조직이다. U.A.C가 정보를 통제한다면 N.H.C는 실제로 오염 구역 안에 들어가 봉쇄선과 민간인 철수를 수행한다.'],
      ['주요 임무','괴이 교전, 민간인 철수, 봉쇄선 유지, 장비 운용, 위험 구역 진입, 회수 부대 보호, 현장 지휘를 담당한다. Young Soldier와 일반 병력, 일부 혈무 운용자가 혼재한다.'],
      ['장비와 규정','방독 장비, 장갑복, 실탄, 소각 장비, 혈무, 봉쇄용 표식, 오염 샘플 회수 도구를 사용한다. 현장에서는 교전보다 생존과 봉쇄 유지가 우선된다.'],
      ['기관 관계','U.A.C의 통제 아래 움직이나, 장기적인 레드존 작전 이후 현장 판단권이 확대되었다. Redwolf 계열 이탈자는 Syndicate 내부 작전 집단으로 분류된다.']
    ]},
    sid:{img:'sid.webp',name:'S.I.D',meta:'오컬트 사건 / 실종 / 범죄 조사',pages:[
      ['개요','우시노다교 의식, 실종 사건, 기억 오염, 귀환자 관련 사건을 조사하는 특수 조사 기관이다. 일반 수사기관과 달리 괴이와 오컬트 범죄를 동시에 다룬다.'],
      ['주요 임무','실종자 추적, 의식 흔적 분석, 오염 문양 확인, 증언 기록, 사망 처리 오류 조사, 귀환자 진술 검증을 수행한다.'],
      ['사건 연결','사쿠마 유타 실종 사건, 피의 호수 관련 목격 기록, 도심 내 우시노다교 잠입 사건과 강하게 연결된다.'],
      ['한계','전투 조직이 아니므로 레드존 직접 진입에는 제한이 있다. 위험도가 높은 지역에서는 N.H.C 동행이 필수로 분류된다.']
    ]},
    fhc:{img:'fhc.webp',name:'F.H.C',meta:'극비 연구 / 생체 분석 / 상호 불신',pages:[
      ['개요','오염 분석, 생체 연구, 괴이 조직, 유전자 기록, 치료 기술과 연결된 연구 조직이다. U.A.C와 협력하지만 비인가 실험 가능성 때문에 항상 감시 대상이다.'],
      ['연구 분야','타락체 조직 분석, 피의 호수 샘플, 혈액 반응, 귀환자 생체 검사, 괴이 유전자, 오염 회복 기술을 다룬다.'],
      ['위험 요소','연구 목적이 치료인지 병기화인지 명확하지 않은 기록이 다수 존재한다. 일부 극비 보안 문서에서는 인간 재조립과 생체 병기화 정황이 확인된다.'],
      ['기관 관계','U.A.C는 F.H.C 자료에 의존하지만 완전히 신뢰하지 않는다. N.H.C와 S.I.D는 F.H.C가 보유한 자료를 필요로 하면서도 현장 정보 은폐 가능성을 의심한다.']
    ]},
    amarion:{img:'amarion.webp',name:'Amarion',meta:'제약 기업 / 의료 재조립 / 현실 접속 연구',pages:[
      ['개요','제약과 의료 기술을 표면에 둔 기업형 연구 세력이다. 피의 호수, 생체 복구, 의료 재조립, 괴이 유전자 실험과 연결된 자료에서 반복적으로 등장한다.'],
      ['핵심 기술','생체 프린팅, 세포 복구, 임상 회복 기술, 기억 안정화, 실험체 유지 장치 등을 개발한 것으로 기록된다.'],
      ['회수 기록','아마리온 회수 영상 기록에서는 사전교육 자료 형식 아래에 비정상 연구 목적이 숨겨져 있는 것으로 분류된다.'],
      ['감시 이유','공식적으로는 제약 기업이나, 실제로는 F.H.C와 U.A.C가 주시하는 민간 연구 네트워크로 기록된다.']
    ]},
    syndicate:{img:'syndicate.webp',name:'Syndicate',meta:'이탈 무장 네트워크 / Redwolf 계열 통합',pages:[
      ['개요','비인가 거래, 정보 탈취, 생체 시료 유통, 레드존 외곽 무장 활동과 연결된 세력이다. 공식 기관이 접근하지 못하는 그레이존에서 영향력이 크다.'],
      ['Redwolf 계열','Redwolf는 별도 세력이 아니라 Syndicate 내부의 이탈 전투조직 또는 작전 집단으로 처리한다. N.H.C 이탈자와 현장 장비 유출 기록이 연결된다.'],
      ['활동 방식','무기 밀수, 회수품 거래, 오염 시료 유통, 민간 피난로 장악, 정보 브로커 활동을 수행한다.'],
      ['위험성','U.A.C와 N.H.C 입장에서는 추적 대상이지만, 때때로 블랙존 내부 정보와 생존자 이동 경로를 제공하기도 한다.']
    ]},
    ushinoda:{img:'ushinoda.webp',name:'우시노다교',meta:'타락교와 혈교를 포함한 통합 적대 종교',pages:[
      ['개요','인신공양, 기억 오염, 괴이 발생, 귀환자 왜곡과 연결되는 핵심 적대 종교 세력이다. 타락교와 혈교는 우시노다교 내부 계열 또는 의식 분파로 통합한다.'],
      ['타락교 계열','타락의 힘을 신성한 축복으로 받아들이며 육체 변형과 괴이화를 신앙의 증거로 여긴다. 인간성을 잃어가는 과정도 의식의 일부로 간주한다.'],
      ['혈교 계열','피의 길과 혈액 의식을 중심으로 움직인다. 혈액을 무기, 이동 경로, 저장소, 봉인 도구로 활용하며 피의 호수 사건과 강하게 연결된다.'],
      ['현장 위험','피의 호수 사건, 사쿠마 유타 실종 기록, 레드존 오염 기준, 귀환 민간인 문제와 연결된다. S.I.D와 N.H.C의 직접 대응 대상이다.']
    ]},
    haimun:{img:'haimun.webp',name:'Haimun',meta:'도심 침투 / 비공식 거점 / 시민 납치',pages:[
      ['개요','도심 내부에서 움직이는 침투형 조직으로, 비공식 거점과 민간 구역 내부 의식 준비와 연결된다.'],
      ['활동 방식','민간 구역 안에서 생존자 조직 또는 구호 단체처럼 위장하고, 특정 인물 납치와 은신처 확보에 관여한다.'],
      ['연결 세력','일부 기록에서는 우시노다교 의식 집행자나 Syndicate 계열 운반책과 접촉한 정황이 확인된다.'],
      ['위험성','검문망 내부에서 움직이기 때문에 C.P.D와 S.I.D의 추적 대상이며, 민간 구역 불안을 확대하는 요인으로 분류된다.']
    ]},
    ashcrew:{img:'ashcrew.webp',name:'Ash Crew',meta:'오염 시체 / 장비 / 잔류물 처리반',pages:[
      ['개요','N.H.C와 A.R.F가 지나간 뒤 현장에 남은 오염 시체, 오염 장비, 혈액 잔류물, 저주받은 장비를 회수하거나 소각하는 사후 처리 조직이다.'],
      ['주요 임무','오염 시체 소각, 장비 폐기, 혈액 잔류물 밀봉, 저주받은 장비 격리, 현장 흔적 제거를 수행한다.'],
      ['작전 조건','오염 수준이 높아 일반 회수 인력 투입이 불가능한 지역에서 작전한다. 전투보다 폐기와 기록 봉인이 우선된다.'],
      ['위험성','오염 물질과 가장 늦게 접촉하기 때문에 감염·정신 오염·기록 왜곡 위험이 높다.']
    ]},
    arf:{img:'arf.webp',name:'A.R.F',meta:'회수 부대 / 시료와 기록 복구',pages:[
      ['개요','이상현상 발생 이후 현장에서 생존자, 시료, 장비, 문서, 영상 기록을 회수하는 부대다.'],
      ['주요 임무','생존자 확보, 회수품 분류, 손상된 영상과 문서 복원, 오염 샘플 운반, 조사 자료 인계 작업을 수행한다.'],
      ['작전 구조','N.H.C가 현장 안전을 확보한 뒤 투입되는 경우가 많으며, 회수 실패 지역은 Black File 또는 회수 금지 구역으로 분류된다.'],
      ['기관 연결','회수품은 U.A.C 기록 서버, F.H.C 분석 부서, S.I.D 사건 데이터베이스로 분배된다.']
    ]},
    cpd:{img:'cpd.webp',name:'C.P.D',meta:'민간 보호 / 피난민 선별 / 검문 게이트',pages:[
      ['개요','민간인 대피, 피난민 수용, 귀환자 선별, 검문 게이트 운영을 담당하는 민간 보호 조직이다.'],
      ['주요 임무','화이트존 피난소 운영, 귀환자 신원 확인, 오염 의심자 분리, 민간 이동 통제, 가족 재등록 절차를 맡는다.'],
      ['귀환자 대응','Returned Civilian은 모두 위험 대상으로 보지 않지만, 기억 공백, 생체 반응, 사망 기록 중복이 확인되면 격리한다.'],
      ['한계','전투 조직은 아니므로 직접 교전은 피하며, 고위험 귀환자나 페럴 의심 상황에서는 N.H.C 지원을 요청한다.']
    ]}
  };
  const detail=document.getElementById('factionDetail');
  let currentFaction='uac';
  function renderFaction(key){
    currentFaction=key; const d=factionData[key]||factionData.uac; if(!detail)return;
    detail.innerHTML=`<img class="faction-mark-large" src="${prefix}assets/faction_marks/${d.img}" alt="${d.name}"><h3>${d.name}</h3><div class="meta">${d.meta}</div><div class="detail-tabs">${d.pages.map((p,i)=>`<button class="detail-tab ${i===0?'active':''}" data-i="${i}" type="button">${p[0]}</button>`).join('')}</div><div class="detail-body"></div>`;
    function showPage(i){ const p=d.pages[i]||d.pages[0]; detail.querySelectorAll('.detail-tab').forEach((b,idx)=>b.classList.toggle('active',idx===i)); detail.querySelector('.detail-body').innerHTML=`<h4>${p[0]}</h4><p>${p[1]}</p>`; play(audio.page); }
    detail.querySelectorAll('.detail-tab').forEach((b,i)=>b.addEventListener('click',()=>showPage(i)));
    showPage(0);
    document.querySelectorAll('.faction-tile').forEach(b=>b.classList.toggle('active',b.dataset.key===key));
  }
  document.querySelectorAll('.faction-tile').forEach(b=>b.addEventListener('click',()=>{play(audio.menu); renderFaction(b.dataset.key)})); if(detail) renderFaction('uac');

  document.querySelectorAll('.paged-record').forEach(box=>{
    const recPages=Array.from(box.querySelectorAll('.record-page'));
    const tabs=box.querySelector('.page-tabs');
    if(!recPages.length||!tabs) return;
    function showRec(i, sound=true){ recPages.forEach((p,idx)=>p.classList.toggle('active',idx===i)); tabs.querySelectorAll('.page-tab').forEach((b,idx)=>b.classList.toggle('active',idx===i)); if(sound)play(audio.page); const c=document.querySelector('.legacy-content'); if(c)c.scrollTop=0; else window.scrollTo(0,0); }
    tabs.querySelectorAll('.page-tab').forEach((b,i)=>b.addEventListener('click',()=>showRec(i,true)));
    showRec(0,false);
  });
});
