// Project Curse 5.54.0 — canonical organization, geography, and failure-state registry.
// This is the sole authoritative source for active faction relations and regional name authority.
(function(root){
  'use strict';

  function freeze(value){
    if(!value || typeof value!=='object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const geography={
    greatBlackForest:{
      id:'great-black-forest',primary:'대흑림',english:'Great Black Forest',short:'GBF',
      scope:'남아메리카 내륙 이상권',mapLabel:'대흑림',
      aliases:[
        {label:'자유의 땅',authority:'현지 관습명',meaning:'의식·주술 지식의 중앙 금지 부재와 성채 피난 관습을 함께 가리킨다.'},
        {label:'악몽의 숲',authority:'귀환자 구어',meaning:'생환자의 체험을 가리키는 말이며 지도 경계나 행정권을 뜻하지 않는다.'}
      ],
      legacy:[
        {label:'남방 데드존',authority:'폐기된 외부 분류',meaning:'2012년 측량 소실 전후 문서에만 남긴다. 현재 지도 표제나 데드존의 동의어로 사용하지 않는다.'}
      ],
      boundary:'해안 현실권과 내륙 이상권의 정확한 선은 측량할 수 없다. 대흑림은 남아메리카 전체가 문자 그대로 숲이라는 뜻이 아니다.'
    },
    deadZone:{
      id:'dead-zone',primary:'북미 데드존',english:'North American Dead Zone',short:'DZ',
      scope:'북아메리카 내륙 무응답권',mapLabel:'북미 데드존',
      aliases:[
        {label:'잊힌 땅',authority:'순례자 구어',meaning:'귀환 보장과 공통 행정기록이 사라진 상태를 가리킨다.'},
        {label:'지옥',authority:'생환자 속칭',meaning:'체험을 압축한 표현이며 위협등급이나 단일 지배세력의 명칭이 아니다.'}
      ],
      legacy:[],
      boundary:'현재 기록에서 데드존 또는 DEAD ZONE을 단독으로 쓰면 북미 내륙 무응답권을 뜻한다. 해안 격리선과 영유권 주장의 존속을 부정하지 않는다.'
    },
    southernTheater:{
      id:'southern-theater',primary:'남방권',english:'Southern Theater',short:'SOUTH',
      scope:'대흑림 외연·남아메리카 대서양 해안에 걸친 동원망',mapLabel:'남방권',
      aliases:[
        {label:'남방 작전권',authority:'기관 작전어',meaning:'병력·보급·의식 신호가 묶이는 범위를 가리킨다.'}
      ],
      legacy:[],
      boundary:'국가·대륙·단일 교단의 영토명이 아니다. 남부 혈교, 해안 세력과 협력 성채가 모두 같은 지휘를 따른다는 뜻도 아니다.'
    }
  };

  const geographyRules={
    koreanDeadZone:'현재 한국어 표기는 데드존으로 붙여 쓴다. 인용문과 보호 원문은 원래 표기를 보존한다.',
    southernTerms:'남부 혈교는 세력명, 남방권은 작전망, 남방 발신망은 감청된 통신 계통으로 구분한다.',
    bloodSurfaces:{
      northSea:{label:'북해 피의 호수 사건',kind:'단일 사건명',relation:'1986년 북해권 사건과 후대 봉쇄 기록만 가리킨다.'},
      greatBlackForest:{label:'대흑림 피의 호수 흔적',kind:'복수 현장의 구전명',relation:'순례로에서 반복 보고된 현장들이다. 북해 사건과의 공통 기원은 확인되지 않았다.'},
      deadZone:{label:'데드존 추모호·혈성 수면',kind:'개별 증언명',relation:'왕국 묘역과 귀환 증언의 현장명이다. 다른 두 기록과의 연결은 확인되지 않았다.'}
    }
  };

  const factions={
    uac:{
      name:'U.A.C',sub:'United Nations Anomaly Containment',cat:'독립기관',
      status:'가동 / 초국가 집행',zone:'국제 이상현상 대응권',risk:'관할 충돌 / 정보 독점',
      summary:'아이반 레스작의 비밀 감시망에서 출발해 1993년 11월 2일 공식 설립된 초국가 조정기관이다. 국가기관과 독립 대응조직 사이의 법적 접근권, 통행, 정보와 자산을 연결한다.',
      roles:['이상현상 구역 등급 판정','국경 간 격리 명령과 통행권 승인','기관 간 정보·자산·작전 조율','민간 공개 범위와 기록 접근권 관리'],
      links:['N.H.C','S.I.D','F.H.C','우시노다교','S.O.N'],records:['REC-BLI-006','ZONE-CLASS','Redzone_881120'],
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
      links:['U.A.C','P.O.H','우시노다교'],records:['Sakuma_Tape_991028','Redzone_881120'],
      event:'1993년 각국 특수 수사 본부로 설치되었고, 2001년 7월 21일 N.H.C와 동시에 독립기관으로 개편되었다.'
    },
    fhc:{
      name:'F.H.C',sub:'분열된 연구·기술 복합기업권',cat:'기업',status:'법인 존속 / 중앙 지휘 상실',zone:'시설별 상충 통제권',risk:'기술 독점 / 비인가 실험 / 명령 위조',
      summary:'아마리온의 공간 연구와 사업 기반을 승계해 1982년 설립됐다. 2021년 서브매서커 이후 법인은 존속하지만 중앙 지휘는 사실상 상실됐고, 유니온·아크·TAD·연구시설은 구조소, 용병기지, 독립 연구소 또는 교단 점거지로 서로 다르게 움직인다.',
      roles:['이상현상 기술·표본 선점','시설별 독립 생존·연구','TAD 명칭을 공유하는 상충 부대 운용','회수 자료 분석·봉인과 비인가 실험'],
      links:['U.A.C','N.H.C','S.I.D','S.O.N','P.O.H','우시노다교'],records:['Cults_871104','Unknown_Record1_860204'],
      event:'1986년 피의 호수 조사에 개입했고 1993년 이후 TAD를 전면에 내세웠다. 2021년 내부 학살 이후에는 같은 F.H.C 표식을 단 시설끼리도 통제권과 임무가 충돌한다.'
    },
    amarion:{
      name:'아마리온',sub:'F.H.C의 전신 기업',cat:'기업',status:'역사 기록 / 활동 종료',zone:'초기 공간 연구 사업권',risk:'왜곡 실험 / 자료 승계',
      summary:'1975년 9월 12일 설립된 미국 연구기업으로 F.H.C 창설자의 초기 사업체다. 저근접 자기 왜곡 시스템을 실행한 뒤 대외 활동이 사라졌고, 인력과 연구자료는 1982년 F.H.C의 기반으로 승계됐다.',
      roles:['저근접 자기 왜곡 시스템 연구','신규 공간 진입 시도','인구 분산·자원 확보 사업 구상','F.H.C로 연구 인력과 자료 승계'],
      links:['F.H.C'],records:['Unknown_Record1_860204'],
      event:'F.H.C의 경쟁사가 아니라 그 이전 단계의 기업·연구 기반으로 재분류되었다.'
    },
    syndicate:{
      name:'S.O.N',sub:'Shadow Of Nemesis',cat:'이탈',status:'적대 / 분산 연합',zone:'국가 외곽·암시장·비인가 작전권',risk:'체제 전복 / 오염 장비 유통',
      summary:'U.A.C의 초국가 통제에 반대하는 세력들이 결집한 연합이다. 창설기에는 일부 국가가 비밀리에 지원했으며 현재는 F.H.C의 암묵적 지원을 받지만 어느 한 조직의 완전한 하부세력은 아니다.',
      roles:['반 U.A.C 세력 결집','이탈 전력·장비·정보 이동','비인가 작전과 은닉 거점 운영','국가·기업 지원망 분산 관리'],
      links:['U.A.C','F.H.C','우시노다교'],records:['Unknown_Record3_920711','Unknown_Record4_930314'],
      event:'초기 국가 지원망에서 출발해 현재의 분산형 반 U.A.C 연합으로 확대되었다.'
    },
    ushinoda:{
      name:'우시노다교',sub:'타락교·혈교·그림자교',cat:'교단',status:'적대 / 좌석 계보 분열',zone:'의식 확산권·평행세계 누출권',risk:'의식 오염 / 현실 중첩 / 계보 사칭',
      summary:'타락교, 혈교, 그림자교는 각각 하나의 로드좌와 네 사도석을 교리상 주장한다. 이는 언제나 15명이 실재한다는 뜻이 아니다. 공석, 복수 주장자와 죽은 자의 이름을 계승한 사례가 있어 현장에서는 번호보다 권능·의식 문법·계승 증거를 우선한다.',
      roles:['세 파벌의 의식 거점 운용','평행세계 누출과 Black Zone 확대','타락·혈액·그림자 권능 집행','민간 조직과 범죄망을 통한 침투'],
      links:['U.A.C','F.H.C','P.O.H','S.O.N'],records:['Cults_871104','Sakuma_Tape_991028'],
      event:'첫 번째 사도는 창설 이전 기록에도 나타나지만 동일 인물, 반복 현상, 계승 좌석 가운데 무엇인지 확정되지 않았다.'
    },
    haimun:{
      name:'P.O.H',sub:'Power Of Haimun',cat:'이탈',status:'감시 / 범죄망',zone:'도심 물류·은신·구금망',risk:'납치 / 밀거래 / 의식 지원',
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
    fhc:{name:'F.H.C',sub:'분열 기업권',type:'institution',x:58,y:24,status:'법인 존속 / 중앙 지휘 상실',summary:factions.fhc.summary,records:factions.fhc.records},
    amarion:{name:'아마리온',sub:'F.H.C 전신 기업',type:'unstable',x:40,y:13,status:'역사 기록 / 승계',summary:factions.amarion.summary,records:factions.amarion.records},
    syndicate:{name:'S.O.N',sub:'Shadow Of Nemesis',type:'unstable',x:18,y:29,status:'적대 / 분산 연합',summary:factions.syndicate.summary,records:factions.syndicate.records},
    ushinoda:{name:'우시노다교',sub:'세 파벌·좌석 계보',type:'cult',x:84,y:31,status:'적대 / 계보 분열',summary:factions.ushinoda.summary,records:factions.ushinoda.records},
    haimun:{name:'P.O.H',sub:'Power Of Haimun',type:'unstable',x:84,y:70,status:'감시 / 범죄망',summary:factions.haimun.summary,records:factions.haimun.records},
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

  root.ProjectCurseCanon=freeze({
    version:'5.54.0',
    official:{uacEnglish:'United Nations Anomaly Containment',syndicateEnglish:'Shadow Of Nemesis',haimunEnglish:'Power Of Haimun'},
    geography,
    geographyRules,
    ushinodaHierarchy:{
      factions:['타락교','혈교','그림자교'],
      lordsPerFaction:1,
      apostlesPerFaction:4,
      apostlesTotal:12,
      doctrinalSeats:{lordsPerFaction:1,apostlesPerFaction:4,apostlesTotal:12},
      occupancy:'정원은 교리상 좌석 수다. 공석·복수 주장·계승명 중복 때문에 실제 인원수와 일치하지 않을 수 있다.',
      firstApostle:'창설 이전 기록에도 나타나지만 동일 인물·반복 현상·계승 좌석 여부는 미확정',
      sentinel:'계급이 아니라 로드좌 주장자에게 귀속되는 호위·전투·처형 자산'
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
