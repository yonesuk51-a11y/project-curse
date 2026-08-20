// Project Curse 5.39.0 — shared incident, region, operation and cult-lineage network.
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
      title:'아마리온 설립',summary:'공간 개척과 자원 독점을 목표로 한 초기 연구기업 설립.',
      region:'northamerica',coordinates:[-98,39],history:'1975-09-12-amarion',factions:['amarion','fhc'],records:['Unknown_Record1_860204']
    },
    'evt-blood-lake':{
      id:'evt-blood-lake',code:'EVT-1986-0725',date:'1986.07.25',status:'RESIDUAL',confidence:'confirmed',
      title:'피의 호수 사건',summary:'F.H.C 조사팀이 북해권 혈액성 수역에 진입한 뒤 발생한 회수·실종 사건.',
      region:'europe',coordinates:[9.2,55.5],history:'1986-07-25-immortality',factions:['fhc','uac','nhc','blood-cult'],
      records:['Immortality_860201','Unknown_Record2_860205'],operation:'op-immortality'
    },
    'evt-tokyo-record':{
      id:'evt-tokyo-record',code:'EVT-1989-0823',date:'1989.08.23',status:'ARCHIVED',confidence:'observed',
      title:'도쿄 지부 기록',summary:'교육기관 내부의 의식 교육과 인간 위장형 괴이 피해가 확인된 기록.',
      region:'eastasia',coordinates:[139.69,35.68],history:'1989-08-23-tokyo',factions:['sid','fhc','ushinoda','corruption-cult','shadow-cult'],records:['Sakuma_Tape_991028','Cults_871104']
    },
    'evt-deadzone-raid':{
      id:'evt-deadzone-raid',code:'EVT-2006-0820',date:'2006.08.20',status:'SITE LOST',confidence:'historical',
      title:'위버멘시 미국 지부 습격',summary:'방랑자 10명과 일부 연구자료가 회수된 뒤 시설 좌표가 소실된 사건.',
      region:'northamerica',coordinates:[-96,37],history:'2006-08-20-ubermensch-raid',factions:['uac','syndicate'],records:['Unknown_Record3_920711']
    },
    'evt-northern-front':{
      id:'evt-northern-front',code:'EVT-2026-0820',date:'2026.08.20',status:'ADVANTAGE / CONTESTED',confidence:'corroborated',
      title:'북부전선 역전',summary:'일본과 동맹권이 짐승의 길 계열 세력을 세 번째 차단선 밖으로 밀어냈다.',
      region:'eastasia',coordinates:[130,48],history:'2026-08-20-northern-reversal',factions:['sid','nhc'],records:[]
    },
    'evt-gbf-unlit':{
      id:'evt-gbf-unlit',code:'EVT-GBF-UNLIT',date:'DATE LOST',status:'ROUTE UNSTABLE',confidence:'testimony',
      title:'불빛 없는 성채 접근',summary:'몬수르 교회의 요청을 받은 순례자 경로가 검은 강과 무광 성채에서 중첩된 사건.',
      region:'southamerica',coordinates:[-66,-18],factions:['sid'],records:[],operation:'op-unlit-fortress'
    },
    'evt-deadzone-return':{
      id:'evt-deadzone-return',code:'EVT-2029-0412',date:'2029.04.12',status:'QUARANTINE ACTIVE',confidence:'observed',
      title:'검문소 07 귀환자 신원 상충',summary:'네 명의 귀환자와 다섯 번째 생체 신호가 서부 귀환 회랑의 동일 출입 요청으로 감지된 사건.',
      region:'northamerica',coordinates:[-124,44],history:'2029-04-12-checkpoint-07',factions:['uac','deadzone-blood'],records:['Dead_Zone_Pilgrimage'],operation:'op-deadzone-return'
    },
    'evt-deadzone-recovery':{
      id:'evt-deadzone-recovery',code:'EVT-DZ-OUTBOUND-R05',date:'AFTER 06:03',status:'SEALED / VERDICT REQUIRED',confidence:'disputed',
      title:'검문소 07 지하 구조 신호',summary:'역방향 순례 판정에서 복원된 좌표가 데드존 내륙이 아니라 검문소 07 아래의 존재하지 않는 층을 가리킨 사건.',
      region:'northamerica',coordinates:[-124,44],history:'2029-04-12-checkpoint-07',factions:['uac'],records:['Dead_Zone_Pilgrimage'],operation:'op-deadzone-recovery'
    },
    'evt-southern-mobilization':{
      id:'evt-southern-mobilization',code:'EVT-2030-0117',date:'2030.01.17',status:'CRITICAL / PARTIAL',confidence:'observed',
      title:'남부 집단 소환·쿠데타 전조',
      summary:'남부 해안 분파의 특수부대 집결, 도시권 집단 소환과 성위대 지휘부 침투 정황이 동시에 포착됐다.',
      region:'southamerica',coordinates:[-46,-23],history:'2030-01-17-broken-crown',factions:['sid','nhc','ushinoda','southern-blood'],records:['Cults_871104'],operation:'op-southern-coup',
      participants:['피의 종교 남부권','남부 해안 분파','성위대 내부 공작망','몬수르 교회 일부','우시노다 잔존 인원'],
      intelligence:[
        '남부 특수부대는 적 전력을 분산시키기 위한 동시다발 소환을 준비 중이다.',
        '성위대 지휘관 한 명이 특수부대 공작원으로 지목됐으나 명령 출처가 상충한다.',
        '남부권은 북부 전선에서 일본 동맹권이 우세해지는 상황을 위협으로 판단한다.',
        '데드존 분파의 순례자 지원·평화 노선이 남부 지휘부와 충돌하고 있다.',
        '우시노다 잔존망은 F.H.C 내부 분쟁을 통제하지 못하며 일부 인원만 남부권에 흡수될 것으로 추정된다.'
      ]
    }
  };

  const operation={
    id:'op-southern-coup',incident:'evt-southern-mobilization',label:'남부 집단 소환 차단',code:'OP-BROKEN-CROWN',region:'남미 대흑림 / 남부 해안권',
    classification:'BLACK / COMMAND CONTESTED',status:'ACTIVE INTELLIGENCE',
    summary:'도시권 집단 소환과 성위대 지휘부 침투를 분리 확인하고, 남부 특수부대의 전력 분산 계획을 추적하는 진행 중 작전.',
    directive:'성위대 지휘관에 대한 처형 명령은 발신 계통 검증 전 집행 금지. 생존 여부와 공작 신분을 분리 확인할 것.',
    objectives:['도시별 소환 앵커 식별','해안 특수부대 이동 경로 차단','성위대 명령 계통 검증','북부 전선 교란 신호 분리','민간 정착지 철수 회랑 확보'],
    sites:[
      {x:94,y:426,label:'해안 감청소',kind:'facility'},
      {x:246,y:374,label:'남부 집결지',kind:'hostile'},
      {x:414,y:292,label:'도시 소환권 A',kind:'incident'},
      {x:568,y:228,label:'성위대 지휘부',kind:'unknown'},
      {x:735,y:170,label:'도시 소환권 B',kind:'incident'},
      {x:880,y:118,label:'북부 교란선',kind:'line'}
    ],
    steps:[
      {time:'T-06:00',title:'해안 분파 집결',note:'서로 적대하던 남부 소규모 교단의 통신 식별자가 하나의 지휘망 아래 묶였다.',route:[[94,426],[246,374]],units:[{id:'SIG-A',x:246,y:374,status:'unstable'}]},
      {time:'T-04:20',title:'소환 앵커 운반',note:'의식 장비로 추정되는 화물이 두 도시와 성위대 보급선으로 분산됐다.',route:[[94,426],[246,374],[414,292],[568,228]],alternate:[[246,374],[735,170]],units:[{id:'CELL-3',x:414,y:292,status:'unstable'},{id:'CELL-7',x:735,y:170,status:'unknown'}]},
      {time:'T-02:10',title:'지휘부 신원 상충',note:'성위대 지휘관의 명령 서명과 남부 특수부대 암호키가 일치한다. 생존 시 처형하라는 별도 명령은 발신처가 확인되지 않았다.',route:[[94,426],[246,374],[414,292],[568,228]],units:[{id:'HG-01',x:568,y:228,status:'split'}]},
      {time:'T-00:40',title:'도시권 동시 소환',note:'두 도시에서 대규모 소환 전조가 발생했다. 현장 전력이 분리되면 북부 교란선이 열릴 가능성이 높다.',route:[[94,426],[246,374],[414,292],[568,228],[735,170]],alternate:[[568,228],[880,118]],units:[{id:'SID-4',x:414,y:292,status:'normal'},{id:'NHC-2',x:735,y:170,status:'unstable'}]},
      {time:'T+00:00',title:'전력 분산 개시',note:'북부 전선과 남부 도시권에서 같은 시각의 위조 구조 신호가 송출됐다.',route:[[94,426],[246,374],[414,292],[568,228],[735,170],[880,118]],units:[{id:'NHC-2',x:880,y:118,status:'split'},{id:'HG-01',x:568,y:228,status:'unknown'}]},
      {time:'T+00:18',title:'지휘 계통 단절',note:'남부 해안권 통신이 끊겼다. 작전 결과와 성위대 지휘관의 생존 여부는 확인되지 않았다.',route:[[94,426],[246,374],[414,292],[568,228],[735,170]],alternate:[[735,170],[414,292],[94,426]],units:[{id:'SID-4',x:414,y:292,status:'lost'},{id:'HG-01',x:568,y:228,status:'unknown'}]}
    ]
  };

  root.ProjectCurseIncidentNetwork=freeze({
    version:root.ProjectCurseBuild?.version||'5.39.0',
    incidents,
    incidentList:Object.values(incidents),
    operations:[operation],
    getIncident:id=>incidents[id]||null,
    getOperation:id=>id===operation.id?operation:null
  });
})(window);
