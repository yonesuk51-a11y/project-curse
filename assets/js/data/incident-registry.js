// Project Curse 5.42.0 — shared incident, region, operation and cult-lineage network.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const incidents={
    'evt-amarion-foundation':{
      id:'evt-amarion-foundation',code:'EVT-1975-0912',date:'1975.09.12',status:'HISTORICAL',confidence:'confirmed',
      title:'아마리온 설립',summary:'초기 연구기업 설립. 목표는 공간 개척과 자원 독점이었다.',
      region:'northamerica',coordinates:[-98,39],history:'1975-09-12-amarion',factions:['amarion','fhc'],records:['Unknown_Record1_860204']
    },
    'evt-blood-lake':{
      id:'evt-blood-lake',code:'EVT-1986-0201',date:'1986.02.01',status:'RESIDUAL',confidence:'confirmed',
      title:'피의 호수 사건',summary:'F.H.C 조사팀이 피처럼 변한 북해권 물가에 들어갔다. 그 뒤 회수 작전과 실종이 잇따랐다.',
      region:'europe',coordinates:[9.2,55.5],history:'1986-02-01-immortality',factions:['fhc','uac','nhc','blood-cult'],
      records:['Immortality_860201','Unknown_Record2_860205'],operation:'op-immortality'
    },
    'evt-tokyo-record':{
      id:'evt-tokyo-record',code:'EVT-1989-0823',date:'1989.08.23',status:'ARCHIVED',confidence:'observed',
      title:'도쿄 지부 기록',summary:'교육기관 안에서 의식을 가르친 일과, 사람으로 꾸민 괴이에게 입은 피해가 확인됐다.',
      region:'eastasia',coordinates:[139.69,35.68],history:'1989-08-23-tokyo',factions:['sid','fhc','ushinoda','corruption-cult','shadow-cult'],records:['Sakuma_Tape_991028','Cults_871104']
    },
    'evt-deadzone-raid':{
      id:'evt-deadzone-raid',code:'EVT-2006-0820',date:'2006.08.20',status:'SITE LOST',confidence:'historical',
      title:'위버멘시 미국 지부 습격',summary:'방랑자 10명과 연구 자료 일부를 거둬 왔다. 그 뒤 시설의 좌표가 사라졌다.',
      region:'northamerica',coordinates:[-96,37],history:'2006-08-20-ubermensch-raid',factions:['uac','syndicate'],records:['Unknown_Record3_920711']
    },
    'evt-northern-front':{
      id:'evt-northern-front',code:'EVT-2026-0820',date:'2026.08.20',status:'ADVANTAGE / CONTESTED',confidence:'corroborated',
      title:'북부전선 역전',summary:'일본과 동맹권이 짐승의 길 계열 세력을 세 번째 차단선 밖으로 밀어냈다.',
      region:'eastasia',coordinates:[130,48],history:'2026-08-20-northern-reversal',factions:['sid','nhc'],records:[]
    },
    'evt-gbf-unlit':{
      id:'evt-gbf-unlit',code:'EVT-GBF-UNLIT',date:'DATE LOST',status:'ROUTE UNSTABLE',confidence:'testimony',
      title:'불빛 없는 성채 접근',summary:'몬수르 교회의 부탁을 받은 순례자들의 길이 검은 강과 무광 성채에서 겹쳤다.',
      region:'southamerica',coordinates:[-66,-18],factions:['sid'],records:[],operation:'op-unlit-fortress'
    },
    'evt-deadzone-return':{
      id:'evt-deadzone-return',code:'EVT-2029-0412',date:'2029.04.12',status:'QUARANTINE ACTIVE',confidence:'observed',
      title:'검문소 07 귀환자 신원 상충',summary:'서부 귀환 회랑에서 귀환자 네 명과 다섯 번째 생체 신호가 잡혔다. 들어오겠다는 요청은 모두 같았다.',
      region:'northamerica',coordinates:[-124,44],history:'2029-04-12-checkpoint-07',factions:['uac','deadzone-blood'],records:['Dead_Zone_Pilgrimage'],operation:'op-deadzone-return'
    },
    'evt-deadzone-recovery':{
      id:'evt-deadzone-recovery',code:'EVT-DZ-OUTBOUND-R05',date:'AFTER 06:03',status:'SEALED / VERDICT REQUIRED',confidence:'disputed',
      title:'검문소 07 지하 구조 신호',summary:'역방향 순례를 판정하던 중 좌표가 되살아났다. 좌표는 데드존 안쪽이 아니라 검문소 07 아래, 존재하지 않는 층을 가리켰다.',
      region:'northamerica',coordinates:[-124,44],history:'2029-04-12-checkpoint-07',factions:['uac'],records:['Dead_Zone_Pilgrimage'],operation:'op-deadzone-recovery'
    },
    'evt-southern-mobilization':{
      id:'evt-southern-mobilization',code:'EVT-2030-0117',date:'2030.01.17',status:'CRITICAL / PARTIAL',confidence:'observed',
      title:'남방권 집단 소환·쿠데타 전조',
      summary:'혈맹 특수부대와 남방권 해안 세력이 모이는 정황이 잡혔다. 같은 때 도시의 집단 소환과 성위대 지휘부 침투 정황도 함께 잡혔다.',
      region:'southamerica',coordinates:[-46,-23],history:'2030-01-17-broken-crown',factions:['sid','nhc','ushinoda','southern-blood'],records:['Cults_871104'],operation:'op-southern-coup',
      participants:['남방 혈맹 전시망','남방권 해안 세력','성위대 내부 공작망','몬수르 교회 일부','우시노다 잔존 인원'],
      intelligence:[
        '혈맹 특수부대는 적의 전력을 흩어 놓으려고 여러 곳에서 한꺼번에 소환을 준비하고 있다.',
        '성위대 지휘관 한 명이 특수부대 공작원으로 지목됐다. 명령 출처가 상충한다.',
        '혈맹 지휘부는 북부 전선에서 일본 동맹권이 우세해지는 상황을 위협으로 본다.',
        '순례자를 돕고 평화를 내세우는 데드존 분파의 노선이 혈맹 지휘부와 부딪치고 있다.',
        '우시노다의 남은 연락망은 F.H.C 안의 다툼을 막지 못한다. 일부 인원만 남방권 전시망에 들어갈 것으로 추정된다.'
      ]
    }
  };

  const operation={
    id:'op-southern-coup',incident:'evt-southern-mobilization',label:'남방권 집단 소환 차단',code:'OP-BROKEN-CROWN',region:'남방권 / 대서양 해안·대흑림 외연',
    classification:'BLACK / COMMAND CONTESTED',status:'ACTIVE INTELLIGENCE',
    summary:'작전은 진행 중이다. 도시의 집단 소환과 성위대 지휘부 침투를 따로 확인한다. 혈맹 특수부대가 적의 전력을 흩으려는 계획을 뒤쫓는다.',
    directive:'발신 계통을 검증하기 전에는 성위대 지휘관 처형 명령 집행 금지. 살아 있는지와 공작원인지는 따로 확인할 것.',
    objectives:['도시별 소환 앵커 식별','해안 특수부대 이동 경로 차단','성위대 명령 계통 검증','북부 전선 교란 신호 분리','민간 정착지 철수 회랑 확보'],
    sites:[
      {x:94,y:426,label:'해안 감청소',kind:'facility'},
      {x:246,y:374,label:'남방권 집결지',kind:'hostile'},
      {x:414,y:292,label:'도시 소환권 A',kind:'incident'},
      {x:568,y:228,label:'성위대 지휘부',kind:'unknown'},
      {x:735,y:170,label:'도시 소환권 B',kind:'incident'},
      {x:880,y:118,label:'북부 교란선',kind:'line'}
    ],
    steps:[
      {time:'T-06:00',title:'해안 세력 집결',note:'서로 싸우던 남방권의 작은 교단과 무장세력의 통신 식별자가 한 지휘망 아래 묶였다.',route:[[94,426],[246,374]],units:[{id:'SIG-A',x:246,y:374,status:'unstable'}]},
      {time:'T-04:20',title:'소환 앵커 운반',note:'의식 장비로 추정되는 화물이 두 도시와 성위대 보급선으로 나뉘어 옮겨졌다.',route:[[94,426],[246,374],[414,292],[568,228]],alternate:[[246,374],[735,170]],units:[{id:'CELL-3',x:414,y:292,status:'unstable'},{id:'CELL-7',x:735,y:170,status:'unknown'}]},
      {time:'T-02:10',title:'지휘부 신원 상충',note:'성위대 지휘관의 명령 서명이 혈맹 특수부대의 암호키와 맞는다. 살아 있으면 처형하라는 별도 명령은 어디서 왔는지 확인되지 않았다.',route:[[94,426],[246,374],[414,292],[568,228]],units:[{id:'HG-01',x:568,y:228,status:'split'}]},
      {time:'T-00:40',title:'도시권 동시 소환',note:'두 도시에서 큰 소환의 전조가 나타났다. 현장 전력이 갈라지면 북부 교란선이 열릴 가능성이 높다.',route:[[94,426],[246,374],[414,292],[568,228],[735,170]],alternate:[[568,228],[880,118]],units:[{id:'SID-4',x:414,y:292,status:'normal'},{id:'NHC-2',x:735,y:170,status:'unstable'}]},
      {time:'T+00:00',title:'전력 분산 개시',note:'북부 전선과 남방권 도시에서 같은 시각에 가짜 구조 신호가 나갔다.',route:[[94,426],[246,374],[414,292],[568,228],[735,170],[880,118]],units:[{id:'NHC-2',x:880,y:118,status:'split'},{id:'HG-01',x:568,y:228,status:'unknown'}]},
      {time:'T+00:18',title:'지휘 계통 단절',note:'남방권 해안 통신이 끊겼다. 작전 결과와 성위대 지휘관의 생존 여부는 확인되지 않았다.',route:[[94,426],[246,374],[414,292],[568,228],[735,170]],alternate:[[735,170],[414,292],[94,426]],units:[{id:'SID-4',x:414,y:292,status:'lost'},{id:'HG-01',x:568,y:228,status:'unknown'}]}
    ]
  };

  root.ProjectCurseIncidentNetwork=freeze({
    version:root.ProjectCurseBuild?.version||'5.42.0',
    incidents,
    incidentList:Object.values(incidents),
    operations:[operation],
    getIncident:id=>incidents[id]||null,
    getOperation:id=>id===operation.id?operation:null
  });
})(window);
