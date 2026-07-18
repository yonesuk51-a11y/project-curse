// MapPatch 5.15.2ce — canonical organization registry
// This is the sole authoritative source for the active faction dossier and relation graph.
(function(root){
  'use strict';

  function freeze(value){
    if(!value || typeof value!=='object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const factions={
    uac:{
      name:'U.A.C',sub:'Urban Anomaly Containment / 도시 이상현상 격리국',cat:'초국가 기구',
      status:'가동 / 초국가 집행',zone:'국제 이상현상 대응권',risk:'관할 충돌 / 정보 독점',
      summary:'아이반 레스작의 비밀 감시망에서 출발해 1993년 11월 2일 공식 설립된 초국가 조정기관이다. 국가기관과 독립 대응조직 사이의 법적 접근권, 통행, 정보와 자산을 연결한다.',
      roles:['이상현상 구역 등급 판정','국경 간 격리 명령과 통행권 승인','기관 간 정보·자산·작전 조율','민간 공개 범위와 기록 접근권 관리'],
      links:['N.H.C','S.I.D','F.H.C','우시노다교','신디케이트'],records:['REC-BLI-006','ZONE-CLASS','Redzone_881120'],
      event:'1993년 11월 2일 공식 설립되었고, 2001년 7월 21일 N.H.C·S.I.D 독립 이후 지원·조정 축으로 재편되었다.'
    },
    nhc:{
      name:'N.H.C',sub:'독립 고위험 현장 대응조직',cat:'현장',status:'가동 / 특수 자율권',zone:'레드존·블랙존 인접권',risk:'작전 손실 / 봉쇄선 붕괴',
      summary:'과거 U.A.C 산하 현장부서였으나 현재는 독립 조직이다. U.A.C로부터 법적 통행권, 정보, 자산과 폭넓은 지원을 받으면서도 현장 지휘와 철수 판단에서는 특수 자율권을 행사한다.',
      roles:['고위험 구역 진입과 방어선 유지','타락 개체·변칙 전력 제압','생존자 제한 구조와 후퇴로 확보','작전 실패 후 기록·신원 태그 회수'],
      links:['U.A.C','Ash Crew'],records:['NHC_Manual_891219','FCR_Archive_890402'],
      event:'2001년 7월 21일 S.I.D와 동시에 독립기관으로 개편된 뒤 U.A.C의 특수 지원협정과 독립 현장지휘 체계를 함께 유지한다.'
    },
    sid:{
      name:'S.I.D',sub:'특수 조사·감청 조직',cat:'기관',status:'가동 / 조사권',zone:'도시 감시·사건 수사권',risk:'기억 오염 / 증거 변조',
      summary:'도시 내부의 이상현상, 오컬트 사건, 실종과 변조된 기록을 조사한다. 일반 치안을 대체하지 않으며 사건이 이상현상 단계로 격상된 뒤 증거 회수와 전문 수사를 맡는다.',
      roles:['사건 현장과 피해자 기록 조사','감청·영상·통신 기록 교차 검증','교단·범죄조직 은닉망 추적','귀환자 진술과 시간 오염 판정'],
      links:['U.A.C','하이문','우시노다교'],records:['Sakuma_Tape_991028','Redzone_881120'],
      event:'1993년 각국 특수 수사 본부로 설치되었고, 2001년 7월 21일 N.H.C와 동시에 독립기관으로 개편되었다.'
    },
    fhc:{
      name:'F.H.C',sub:'정부 계약 기반 연구·기술 복합기업',cat:'기업',status:'가동 / 독자 권역',zone:'교육·설비·연구·대리작전권',risk:'기술 독점 / 비인가 실험',
      summary:'아마리온의 공간 연구와 사업 기반을 승계해 1982년 3월 22일 설립됐다. 정부 계약과 합법 사업을 확장하는 한편 우시노다의 힘을 연구하고 TAD·신디케이트·하이문을 통해 비공개 영향망을 유지한다.',
      roles:['이상현상 기술·표본 선점','교육·설비·연구기관 운영','TAD 무력부대 운용','회수 자료 분석·봉인과 비인가 실험'],
      links:['U.A.C','N.H.C','S.I.D','신디케이트','하이문','우시노다교'],records:['Cults_871104','Unknown_Record1_860204'],
      event:'1986년 피의 호수 조사에 개입했으며 1993년 이후 의혹 회피와 대외 대응을 위해 TAD를 전면에 내세웠다.'
    },
    amarion:{
      name:'아마리온',sub:'F.H.C의 전신 기업',cat:'기업',status:'역사 기록 / 활동 종료',zone:'초기 공간 연구 사업권',risk:'왜곡 실험 / 자료 승계',
      summary:'1975년 9월 12일 설립된 미국 연구기업으로 F.H.C 창설자의 초기 사업체다. 저근접 자기 왜곡 시스템을 실행한 뒤 대외 활동이 사라졌고, 인력과 연구자료는 1982년 F.H.C의 기반으로 승계됐다.',
      roles:['저근접 자기 왜곡 시스템 연구','신규 공간 진입 시도','인구 분산·자원 확보 사업 구상','F.H.C로 연구 인력과 자료 승계'],
      links:['F.H.C'],records:['Unknown_Record1_860204'],
      event:'F.H.C의 경쟁사가 아니라 그 이전 단계의 기업·연구 기반으로 재분류되었다.'
    },
    syndicate:{
      name:'신디케이트',sub:'반 U.A.C 연합세력',cat:'이탈',status:'적대 / 분산 연합',zone:'국가 외곽·암시장·비인가 작전권',risk:'체제 전복 / 오염 장비 유통',
      summary:'U.A.C의 초국가 통제에 반대하는 세력들이 결집한 연합이다. 창설기에는 일부 국가가 비밀리에 지원했으며 현재는 F.H.C의 암묵적 지원을 받지만 어느 한 조직의 완전한 하부세력은 아니다.',
      roles:['반 U.A.C 세력 결집','이탈 전력·장비·정보 이동','비인가 작전과 은닉 거점 운영','국가·기업 지원망 분산 관리'],
      links:['U.A.C','F.H.C','우시노다교'],records:['Unknown_Record3_920711','Unknown_Record4_930314'],
      event:'초기 국가 지원망에서 출발해 현재의 분산형 반 U.A.C 연합으로 확대되었다.'
    },
    ushinoda:{
      name:'우시노다교',sub:'타락교·혈교·그림자교',cat:'교단',status:'적대 / 세 파벌',zone:'의식 확산권·평행세계 누출권',risk:'의식 오염 / 현실 중첩',
      summary:'타락교, 혈교, 그림자교의 정확히 세 파벌로 구성된다. 파벌마다 로드 1명과 사도 4명이 존재하며, 센티널은 계급이 아니라 각 로드에게 귀속된 호위·전투·처형 자산이다.',
      roles:['세 파벌의 의식 거점 운용','평행세계 누출과 Black Zone 확대','타락·혈액·그림자 권능 집행','민간 조직과 범죄망을 통한 침투'],
      links:['U.A.C','F.H.C','하이문','신디케이트'],records:['Cults_871104','Sakuma_Tape_991028'],
      event:'제1사도는 교단 창설 전부터 존재했으며 세 권능을 모두 사용하는 유일 사도로 남아 있다.'
    },
    haimun:{
      name:'하이문',sub:'도시 기반 범죄조직',cat:'이탈',status:'감시 / 범죄망',zone:'도심 물류·은신·구금망',risk:'납치 / 밀거래 / 의식 지원',
      summary:'교단의 분파가 아닌 도시 기반 범죄조직이다. 우시노다교 사건에는 물류, 은신처, 인력과 현장 협조를 제공하며 F.H.C에는 인신매매·비인가 의료·구금망을 통해 시험 대상과 금지 자료를 공급한다.',
      roles:['밀수·위조 신분·은신처 운영','인신매매와 비인가 의료망 운용','교단 사건의 물류·인력 지원','금지 기술·표본·내부정보 이동'],
      links:['F.H.C','우시노다교','S.I.D'],records:['Cults_871104','FAC-HAIMUN-TRACE'],
      event:'도심 의식망의 하위 교단이 아니라 교단과 기업 양쪽을 거래 상대로 삼는 범죄망으로 재분류되었다.'
    },
    ashcrew:{
      name:'Ash Crew',sub:'N.H.C 산하 리버스 사후 대응조직',cat:'현장',status:'가동 / N.H.C 산하',zone:'회수·대피·봉인·소각선',risk:'2차 오염 / 처리 실패',
      summary:'리버스 피해자이자 생존자인 비비안 산체스가 세운 민간 기반 조직으로, 2005년 1월 21일 N.H.C 산하에 편성됐다. A.R.F와 C.P.D를 아래에 두고 전투 직후의 현장·생존자·오염 잔류물을 처리한다.',
      roles:['리버스 직후 현장 진입','오염 사체와 잔해 봉인','생존자 회수·대피 지원','A.R.F·C.P.D 현장 조율'],
      links:['N.H.C','A.R.F','C.P.D'],records:['NHC_Manual_891219'],event:'2005년 1월 21일 N.H.C 산하조직으로 편성되고 A.R.F·C.P.D가 그 아래에 조직됐다.'
    },
    arf:{
      name:'A.R.F',sub:'Ash Crew 산하 회수조직',cat:'현장',status:'가동 / 회수',zone:'회수 작전권',risk:'회수물 역오염',
      summary:'Ash Crew 아래에서 사체, 장비와 기록 매체를 회수·분류하는 현장 조직이다. 리버스 직후의 오염 구역에서 반출 대상과 폐기 대상을 가른다.',
      roles:['기록 매체와 현장 표본 회수','오염 장비 분류','시신 회수 지원','격리 구역 반출 통제'],
      links:['Ash Crew'],records:['NHC_Manual_891219','FCR_Archive_890402'],event:'2005년 1월 21일 Ash Crew 산하 현장조직으로 편성됐다.'
    },
    cpd:{
      name:'C.P.D',sub:'Ash Crew 산하 민간 분리·대피조직',cat:'현장',status:'가동 / 민간선',zone:'대피 회랑·선별선',risk:'귀환자 선별 실패',
      summary:'Ash Crew 아래에서 이상현상 구역의 민간인 분리, 대피와 귀환자 선별을 맡는다. 일반 치안과 재난 대응을 대체하지 않으며 현장 공공기관과 협력한다.',
      roles:['오염 노출자와 일반 피난민 분리','대피 회랑 기록 유지','귀환자 1차 선별','전문 조사조직으로 인계'],
      links:['Ash Crew'],records:['FCR_Archive_890402'],event:'2005년 1월 21일 Ash Crew 산하 현장조직으로 편성됐다.'
    }
  };

  const relationNodes={
    uac:{name:'U.A.C',sub:'초국가 집행',type:'institution',x:50,y:50,status:'가동 / 중앙 조율',summary:factions.uac.summary,records:factions.uac.records},
    nhc:{name:'N.H.C',sub:'독립 현장 대응',type:'field',x:31,y:47,status:'특수 자율권',summary:factions.nhc.summary,records:factions.nhc.records},
    sid:{name:'S.I.D',sub:'조사·감청',type:'institution',x:69,y:47,status:'가동 / 조사권',summary:factions.sid.summary,records:factions.sid.records},
    fhc:{name:'F.H.C',sub:'연구·기술 복합기업',type:'institution',x:58,y:24,status:'정부 계약 / 비공개 영향망',summary:factions.fhc.summary,records:factions.fhc.records},
    amarion:{name:'아마리온',sub:'F.H.C 전신 기업',type:'unstable',x:40,y:13,status:'역사 기록 / 승계',summary:factions.amarion.summary,records:factions.amarion.records},
    syndicate:{name:'신디케이트',sub:'반 U.A.C 연합',type:'unstable',x:18,y:29,status:'적대 / 분산 연합',summary:factions.syndicate.summary,records:factions.syndicate.records},
    ushinoda:{name:'우시노다교',sub:'세 파벌 교단',type:'cult',x:84,y:31,status:'적대 / 의식 근원',summary:factions.ushinoda.summary,records:factions.ushinoda.records},
    haimun:{name:'하이문',sub:'도시 범죄조직',type:'unstable',x:84,y:70,status:'감시 / 범죄망',summary:factions.haimun.summary,records:factions.haimun.records},
    ashcrew:{name:'Ash Crew',sub:'N.H.C 산하',type:'field',x:18,y:69,status:'가동 / 사후 처리',summary:factions.ashcrew.summary,records:factions.ashcrew.records},
    arf:{name:'A.R.F',sub:'Ash Crew 산하 회수',type:'field',x:40,y:82,status:'가동 / 회수',summary:factions.arf.summary,records:factions.arf.records},
    cpd:{name:'C.P.D',sub:'Ash Crew 산하 민간선',type:'field',x:61,y:83,status:'가동 / 민간선',summary:factions.cpd.summary,records:factions.cpd.records}
  };

  const relations=[
    {a:'uac',b:'nhc',label:'특수 지원·조율',kind:'support',confidence:'confirmed'},
    {a:'uac',b:'sid',label:'정보·수사 공조',kind:'cooperation',confidence:'confirmed'},
    {a:'uac',b:'fhc',label:'감시·정치적 대립',kind:'watch',confidence:'confirmed'},
    {a:'uac',b:'ushinoda',label:'격리·적대',kind:'hostile',confidence:'confirmed'},
    {a:'uac',b:'syndicate',label:'체제 대립',kind:'hostile',confidence:'confirmed'},
    {a:'nhc',b:'ashcrew',label:'산하·지휘',kind:'command',confidence:'confirmed'},
    {a:'ashcrew',b:'arf',label:'산하·회수',kind:'command',confidence:'confirmed'},
    {a:'ashcrew',b:'cpd',label:'산하·민간선',kind:'command',confidence:'confirmed'},
    {a:'sid',b:'haimun',label:'수사·감청',kind:'watch',confidence:'confirmed'},
    {a:'nhc',b:'sid',label:'정보·현장 인계',kind:'cooperation',confidence:'confirmed'},
    {a:'nhc',b:'fhc',label:'시설·TAD 충돌',kind:'hostile',confidence:'confirmed'},
    {a:'sid',b:'fhc',label:'시설·연결망 수사',kind:'watch',confidence:'confirmed'},
    {a:'fhc',b:'amarion',label:'연구·사업 기반 승계',kind:'history',confidence:'confirmed'},
    {a:'fhc',b:'syndicate',label:'암묵 지원',kind:'support',confidence:'confirmed'},
    {a:'fhc',b:'haimun',label:'인체·표본 공급',kind:'trade',confidence:'confirmed'},
    {a:'fhc',b:'ushinoda',label:'비공식 접촉',kind:'covert',confidence:'confirmed'},
    {a:'haimun',b:'ushinoda',label:'물류·은신 협조',kind:'cooperation',confidence:'confirmed'},
    {a:'syndicate',b:'ushinoda',label:'제한적 임시 동맹',kind:'temporary',confidence:'confirmed'}
  ];

  const factionTags={
    uac:['institution'],nhc:['field','institution'],sid:['institution'],fhc:['corporate','institution'],
    amarion:['corporate','unstable'],syndicate:['rogue','unstable'],ushinoda:['cult','rogue'],
    haimun:['rogue','unstable'],ashcrew:['field'],arf:['field'],cpd:['field']
  };

  const terminology=[
    ['Urban Anomaly Containment','United Nations Anomaly Containment'],
    ['신디케이트는','S.O.N은'],['신디케이트가','S.O.N이'],['신디케이트를','S.O.N을'],
    ['신디케이트와','S.O.N과'],['신디케이트의','S.O.N의'],['신디케이트에','S.O.N에'],['신디케이트','S.O.N'],
    ['하이문은','P.O.H는'],['하이문이','P.O.H가'],['하이문을','P.O.H를'],
    ['하이문과','P.O.H와'],['하이문의','P.O.H의'],['하이문에','P.O.H에'],['하이문','P.O.H']
  ];
  function normalizeTerms(value){
    if(typeof value==='string') return terminology.reduce((text,[from,to])=>text.split(from).join(to),value);
    if(Array.isArray(value)) return value.map(normalizeTerms);
    if(value&&typeof value==='object') Object.keys(value).forEach(key=>{value[key]=normalizeTerms(value[key]);});
    return value;
  }
  normalizeTerms(factions); normalizeTerms(relationNodes); normalizeTerms(relations);

  root.ProjectCurseCanon=freeze({
    version:'5.15.2cf',
    official:{uacEnglish:'United Nations Anomaly Containment',syndicateEnglish:'Shadow Of Nemesis',haimunEnglish:'Power Of Haimun'},
    ushinodaHierarchy:{
      factions:['타락교','혈교','그림자교'],
      lordsPerFaction:1,
      apostlesPerFaction:4,
      apostlesTotal:12,
      firstApostle:'교단 창설 이전부터 존재하며 세 권능을 모두 사용하는 유일 사도',
      sentinel:'계급이 아니라 각 로드에게 귀속된 호위·전투·처형 자산'
    },
    factions,
    relationNodes,
    relations,
    relationEdges:relations.map(r=>[r.a,r.b,r.label]),
    factionTags,
    factionTagLabels:{all:'전체',institution:'기관',field:'현장',cult:'교단',corporate:'기업',rogue:'이탈'},
    unresolved:[
      'S.I.D·A.R.F·C.P.D의 최종 영문 풀네임',
      'C.P.D의 정확한 법적 소속과 권한 범위',
      '우시노다교의 최종 영문 철자'
    ]
  });
})(window);
