/* Project Curse / U.A.C Regional Map Record Link Module
   Map-to-record keys, route whitelist and keyword rules are data, not renderer logic. */
(function(){
  'use strict';
  window.ProjectCurseRegionRecordLinks={
    RECORD_LIBRARY:{
    redzone:{title:'레드존 이상현상 및 오염 기준 문서',record:'Redzone_881120',code:'Redzone_881120',tag:'오염·이상현상'},
    nhc:{title:'N.H.C 현장 작전·장비·봉쇄 규정 문서',record:'NHC_Manual_891219',code:'NHC_Manual_891219',tag:'현장 작전'},
    fcr:{title:'타락 개체 분류 추가 보고서',record:'FCR_Archive_890402',code:'FCR_Archive_890402',tag:'교차 위험'},
    ferals:{title:'타락 개체 분류 보고서',record:'타락 개체_860722',code:'Ferals_860722',tag:'개체 분류'},
    cults:{title:'F.H.C 극비 보안 문서',record:'Cults_871104',code:'Cults_871104',tag:'오컬트 위협'},
    bloodlake:{title:'피의 호수 부검 기록',record:'불명_Record2_860205',code:'Unknown_Record2_860205',tag:'사건·부검'},
    immortality:{title:'불멸을 향해',record:'Immortality_860201',code:'Immortality_860201',tag:'초기 사건'},
    sakuma:{title:'사쿠마 유타 실종 사건 보고서',record:'Sakuma_Tape_991028',code:'Sakuma_Tape_991028',tag:'실종 사건'},
    zone:{title:'구역 위험도 분류 문서',url:'docs/Zone_870815/',code:'Zone_870815',tag:'구역 등급'}
  },
    DOC_ROUTE_WHITELIST:{
    'docs/Zone_870815/':1,
    'docs/Redzone_881120/':1,
    'docs/NHC_Manual_891219/':1,
    'docs/FCR_Archive_890402/':1,
    'docs/Ferals_860722/':1,
    'docs/Cults_871104/':1,
    'docs/Unknown_Record2_860205/':1,
    'docs/Immortality_860201/':1,
    'docs/Sakuma_Tape_991028/':1
  },
    RECORD_KEYWORDS:[
    {re:/피의\s*호수|Blood\s*Lake/i,keys:['bloodlake','redzone']},
    {re:/레드존 이상|오염 기준|Dead\s*Hour|혈문|Ghost\s*Channel|시간 오염|오염 무전|레드존 장기|C\.A\.P|CI 등급/i,keys:['redzone']},
    {re:/블랙 태그|봉쇄선 붕괴|봉쇄|현장 운용|N\.H\.C|작전 실패|기록 회수|장비|시설|차량|특수탄약/i,keys:['nhc']},
    {re:/구역 위험도|그린존|옐로우존|화이트존|위험도 분류|검문 관리권|후방 운영권/i,keys:['zone']},
    {re:/타락 개체|추가 보고서|귀환자|우시노다교 의식성|괴이|의식성 오염/i,keys:['fcr']},
    {re:/C\.P\.D|대피|선별|검문 기록|항만 검문/i,keys:['nhc','zone']},
    {re:/현상 기록/i,keys:['redzone']}
  ]
  };
})();
