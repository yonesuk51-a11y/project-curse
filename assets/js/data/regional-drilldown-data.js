// Project Curse 5.23.2 — regional drilldown districts, route focus, and threat intelligence.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseRegionalDrilldown=freeze({
    version:'regional-drilldown-v2',
    districts:[
      {
        id:'gbf-western-marches',region:'southamerica',terrain:'forest',
        label:'서부 순례 회랑',code:'GBF / WESTERN MARCHES',status:'ROUTE OVERLAP',confidence:'31%',
        description:'순례자 증언과 몬수르 교회의 종 운반 기록을 겹쳐 복원한 서부 진입로. 같은 길이 서로 다른 목적지로 이어진다.',
        warning:'비현실감이 발생하면 기존 경로를 역행하지 말 것. 검은 강의 강둑은 지도상 안전지대가 아니다.',
        routes:[
          {id:'western-pilgrim',className:'pilgrimage',label:'WESTERN PILGRIM TRACE',risk:'high',signal:'intermittent',rule:'공포를 느낀 상태에서 교전하지 말 것',siteIds:['gbf-west-observation','gbf-monsur-chapel','gbf-duel-ground','gbf-derealization','gbf-black-river','gbf-blood-lake','gbf-unlit-fortress'],points:[[70,438],[235,350],[400,289],[520,329],[610,353],[744,250],[908,124]]},
          {id:'derealized-return',className:'broken',label:'DEREALIZED RETURN',risk:'critical',signal:'duplicated',rule:'자신의 것이 아닌 생각이 들면 즉시 경로 변경',siteIds:['gbf-derealization','gbf-duel-ground','gbf-monsur-chapel'],points:[[520,329],[402,289],[239,352]]},
          {id:'black-river-line',className:'hazard',label:'BLACK RIVER / NO BANK',risk:'critical',signal:'lost',rule:'검은 강의 강둑에 접근하지 말 것',siteIds:['gbf-derealization','gbf-black-river'],points:[[470,38],[514,137],[489,228],[610,353],[582,448],[650,540]]}
        ],
        sites:[
          {id:'gbf-west-observation',x:70,y:438,type:'facility',label:'서부 외곽 관측소',meta:'순례자 계수·장비 봉인',status:'교신 가능',confidence:'observed',records:['Great_Black_Forest_Region']},
          {id:'gbf-monsur-chapel',x:235,y:350,type:'cult',label:'몬수르 서부 교회',meta:'종 운반 요청·순례자 보호',status:'불완전 교신',confidence:'testimony',records:['Great_Black_Forest_Region','Pilgrim_Rules_GBF'],operation:'op-unlit-fortress'},
          {id:'gbf-duel-ground',x:400,y:289,type:'incident',label:'귀환자의 결투 지점',meta:'영상마다 참가 인원 변동',status:'상충 진술',confidence:'disputed',records:['Pilgrim_Rules_GBF'],operation:'op-unlit-fortress'},
          {id:'gbf-derealization',x:520,y:329,type:'anomaly',label:'비현실감 중첩권',meta:'회랑이 교회와 강 양쪽으로 이어짐',status:'경로 이중화',confidence:'estimated',operation:'op-unlit-fortress'},
          {id:'gbf-black-river',x:610,y:353,type:'anomaly',label:'검은 강 제4관측점',meta:'동일 일련번호 장비 회수',status:'접근 금지',confidence:'observed',records:['Pilgrim_Rules_GBF'],operation:'op-unlit-fortress'},
          {id:'gbf-blood-lake',x:744,y:250,type:'incident',label:'피의 호수',meta:'북부 전사자·남방 표식 동시 발견',status:'의식 반응 잔류',confidence:'observed',records:['Pilgrim_Rules_GBF'],operation:'op-unlit-fortress'},
          {id:'gbf-unlit-fortress',x:908,y:124,type:'fortress',label:'불빛 없는 성채',meta:'외부 폐허 / 내부 거주 진술',status:'좌표 중첩',confidence:'disputed',records:['Great_Black_Forest_Region'],operation:'op-unlit-fortress',incident:'evt-gbf-unlit'}
        ]
      },
      {
        id:'gbf-coastal-belt',region:'southamerica',terrain:'coast',
        label:'남방 해안 동원권',code:'GBF / COASTAL MOBILIZATION',status:'ACTIVE OPERATION',confidence:'46%',
        description:'남부 특수부대의 집결, 도시 집단 소환, 성위대 침투 신호를 하나의 전선으로 재구성한 해안 작전권.',
        warning:'표시 상태는 OP-BROKEN-CROWN 최종 판단에 따라 갱신된다. 판단 전 좌표는 적대·우호가 확정되지 않는다.',
        operation:'op-southern-coup',
        routes:[
          {id:'coastal-infiltration',className:'hostile',label:'COASTAL INFILTRATION',risk:'critical',signal:'tracked',rule:'특수부대 지휘권을 확인하기 전 교신 금지',siteIds:['coast-listening-post','coast-muster','coast-summon-a','coast-guard-command','coast-summon-b','coast-northern-line'],points:[[86,430],[250,365],[418,294],[590,250],[750,179],[920,104]]},
          {id:'northern-diversion',className:'front',label:'NORTHERN DIVERSION',risk:'high',signal:'spoofed',rule:'북부 전선 발신자 식별값을 신뢰하지 말 것',siteIds:['coast-guard-command','coast-summon-b','coast-northern-line'],points:[[590,250],[686,169],[796,207],[920,104]]},
          {id:'civilian-evacuation',className:'pilgrimage',label:'UNVERIFIED EVACUATION',risk:'medium',signal:'intermittent',rule:'대피 경로와 순례 경로를 혼동하지 말 것',siteIds:['coast-summon-a','coast-muster','coast-listening-post'],points:[[418,294],[335,394],[202,456]]}
        ],
        sites:[
          {id:'coast-listening-post',x:86,y:430,type:'facility',label:'해안 감청소',meta:'남방 주파수 최초 포착',status:'감청 유지',confidence:'observed',records:['Operation_Broken_Crown'],operation:'op-southern-coup',incident:'evt-southern-mobilization'},
          {id:'coast-muster',x:250,y:365,type:'line',label:'남부 특수부대 집결지',meta:'분산 침투조 출항 흔적',status:'부분 식별',confidence:'estimated',records:['Operation_Broken_Crown'],operation:'op-southern-coup'},
          {id:'coast-summon-a',x:418,y:294,type:'incident',label:'도시 소환권 A',meta:'동시다발 소환 반응',status:'소환 진행',confidence:'observed',records:['Operation_Broken_Crown'],operation:'op-southern-coup',verdictStates:{execute:{status:'의식 붕괴 / 민간 피해',tone:'failed'},detain:{status:'외곽 봉쇄',tone:'contained'},cooperate:{status:'소환 좌표 공유',tone:'allied'},defer:{status:'소환 진행',tone:'hostile'}}},
          {id:'coast-guard-command',x:590,y:250,type:'facility',label:'성위대 지휘부',meta:'특수부대 지휘관 침투 의심',status:'처형 명령 대기',confidence:'estimated',records:['Operation_Broken_Crown'],operation:'op-southern-coup',verdictStates:{execute:{status:'지휘관 제거',tone:'secured'},detain:{status:'구금 / 심문 중',tone:'contained'},cooperate:{status:'제한 교신 개방',tone:'allied'},defer:{status:'지휘권 미확인',tone:'unknown'}}},
          {id:'coast-summon-b',x:750,y:179,type:'incident',label:'도시 소환권 B',meta:'북부 전력 분산 목표',status:'활성 신호',confidence:'estimated',records:['Operation_Broken_Crown'],operation:'op-southern-coup',verdictStates:{execute:{status:'소환핵 파괴',tone:'secured'},detain:{status:'반응 격리',tone:'contained'},cooperate:{status:'위장 채널 전환',tone:'allied'},defer:{status:'신호 확대',tone:'hostile'}}},
          {id:'coast-northern-line',x:920,y:104,type:'line',label:'북부 교란선',meta:'짐승의 길 전선으로 위장 송신',status:'전선 혼선',confidence:'estimated',records:['Operation_Broken_Crown'],operation:'op-southern-coup',incident:'evt-northern-front',verdictStates:{execute:{status:'교란선 단절',tone:'secured'},detain:{status:'신호 추적 중',tone:'contained'},cooperate:{status:'역정보 송신',tone:'allied'},defer:{status:'목적 불명',tone:'unknown'}}}
        ]
      },
      {
        id:'gbf-inner-refuges',region:'southamerica',terrain:'deep-forest',
        label:'내부 피난 성채권',code:'GBF / INNER REFUGES',status:'NO CENTRAL AUTHORITY',confidence:'18%',
        description:'국가 대신 성채, 촌락, 교회가 서로의 피난처 역할을 하는 내부 정착권. 지도상의 거리는 도보 기록과 일치하지 않는다.',
        warning:'성채 자체가 하나의 교단일 수 있다. 불빛이 없는 성채와 오래된 전장은 우회할 것.',
        routes:[
          {id:'refuge-chain',className:'pilgrimage',label:'SANCTUARY CHAIN',risk:'medium',signal:'testimony',rule:'불빛이 확인된 피난 성채만 이용할 것',siteIds:['inner-village-seven','inner-sanctuary-castle','inner-forest-circle','inner-distance-fork','inner-feral-front','inner-old-citadel'],points:[[87,421],[245,344],[423,381],[568,276],[746,318],[907,201]]},
          {id:'feral-front',className:'hazard',label:'FERAL HUNTING FRONT',risk:'critical',signal:'biological',rule:'같은 종끼리의 교전도 안전 신호로 판단하지 말 것',siteIds:['inner-feral-front','inner-old-citadel'],points:[[150,125],[298,195],[455,151],[620,208],[808,126],[960,163]]},
          {id:'impossible-fork',className:'broken',label:'IMPOSSIBLE DISTANCE',risk:'high',signal:'duplicated',rule:'동일 표지석을 두 번 발견하면 직전 분기점으로 돌아가지 말 것',siteIds:['inner-forest-circle','inner-distance-fork','inner-feral-front'],points:[[423,381],[568,276],[423,381],[746,318]]}
        ],
        sites:[
          {id:'inner-village-seven',x:87,y:421,type:'settlement',label:'제7 산촌',meta:'최근 확보된 인간 정착지',status:'야간 봉쇄',confidence:'testimony',records:['Great_Black_Forest_Region']},
          {id:'inner-sanctuary-castle',x:245,y:344,type:'fortress',label:'피난 성채 아벨',meta:'소속 불문 피난민 수용',status:'수용 가능',confidence:'testimony',records:['Great_Black_Forest_Region']},
          {id:'inner-forest-circle',x:423,y:381,type:'cult',label:'숲 교단 고리',meta:'촌락과 사냥선을 공동 관리',status:'비적대',confidence:'estimated',records:['Great_Black_Forest_Region']},
          {id:'inner-distance-fork',x:568,y:276,type:'anomaly',label:'불가능 거리 갈림길',meta:'동일 표지석이 세 지점에 존재',status:'측량 파기',confidence:'disputed',records:['Pilgrim_Rules_GBF']},
          {id:'inner-feral-front',x:746,y:318,type:'unknown',label:'타락 야수 사냥선',meta:'포식 지능 개체 활동 증가',status:'영토 탈환 중',confidence:'observed',records:['Great_Black_Forest_Region']},
          {id:'inner-old-citadel',x:907,y:201,type:'fortress',label:'시간망각 성채',meta:'교단·집결지·피난처 기능 중첩',status:'진입 허가 불명',confidence:'testimony',records:['Great_Black_Forest_Region']}
        ]
      },
      {
        id:'deadzone-return-corridor',region:'northamerica',terrain:'dead',
        label:'서부 귀환 회랑',code:'DEAD ZONE / RETURN CORRIDOR',status:'QUARANTINE ACTIVE',confidence:'22%',
        description:'귀환한 순례자 일곱 명의 진술이 유일하게 겹치는 서부 경로. 왕복 경로 중 귀환 구간만 지도에 남아 있다.',
        warning:'전진 경로를 역산하지 말 것. 무전에서 자신의 목소리를 들으면 현재 진행 방향을 즉시 변경할 것.',
        routes:[
          {id:'return-only',className:'pilgrimage',label:'RETURN TESTIMONY ONLY',risk:'high',signal:'testimony',rule:'귀환 증언을 전진 항법에 사용하지 말 것',siteIds:['dead-return-shore','dead-checkpoint-07','dead-quarantine-ring','dead-last-overlap','dead-inland-silence'],points:[[92,430],[245,366],[382,292],[520,232],[682,171],[893,112]]},
          {id:'lost-outbound',className:'broken',label:'OUTBOUND DATA LOST',risk:'critical',signal:'lost',rule:'소실된 출발 경로를 역산하지 말 것',siteIds:['dead-quarantine-ring','dead-last-overlap','dead-inland-silence'],points:[[382,292],[486,351],[622,326]]},
          {id:'exchange-channel',className:'front',label:'NEUTRAL EXCHANGE CHANNEL',risk:'medium',signal:'encrypted',rule:'중립 분파의 호출부호가 일치할 때만 응답',siteIds:['dead-checkpoint-07','dead-neutral-camp','dead-exchange'],points:[[245,366],[344,435],[475,421]]}
        ],
        sites:[
          {id:'dead-return-shore',x:92,y:430,type:'returned',label:'서부 귀환 지점',meta:'귀환 기록 7건 / 출발 기록 불명',status:'격리선 유지',confidence:'observed',records:['Dead_Zone_Pilgrimage']},
          {id:'dead-checkpoint-07',x:245,y:366,type:'facility',label:'검문소 07',meta:'장비 봉인·귀환자 신원 분리',status:'부분 가동',confidence:'observed',records:['Dead_Zone_Pilgrimage']},
          {id:'dead-neutral-camp',x:344,y:435,type:'settlement',label:'중립 순례자 지원소',meta:'데드존 혈교 분파가 운영',status:'피난 지원',confidence:'testimony',records:['Dead_Zone_Pilgrimage','Operation_Broken_Crown']},
          {id:'dead-exchange',x:475,y:421,type:'signal',label:'남북 교신 교환점',meta:'평화 공존 분파와 남방 채널 연결',status:'암호화 대기',confidence:'estimated',records:['Operation_Broken_Crown'],operation:'op-southern-coup',verdictStates:{execute:{status:'교신 채널 소실',tone:'failed'},detain:{status:'증언 검증 채널',tone:'contained'},cooperate:{status:'교환 채널 개방',tone:'allied'},defer:{status:'암호화 대기',tone:'unknown'}}},
          {id:'dead-quarantine-ring',x:382,y:292,type:'zone',label:'귀환자 격리환',meta:'비인간 반응 3건 기록',status:'봉쇄 유지',confidence:'observed',records:['Dead_Zone_Pilgrimage']},
          {id:'dead-last-overlap',x:520,y:232,type:'anomaly',label:'마지막 좌표 중첩점',meta:'7개 진술이 이 지점 이후 분기',status:'전진 금지',confidence:'disputed',records:['Dead_Zone_Pilgrimage']},
          {id:'dead-inland-silence',x:893,y:112,type:'unknown',label:'내륙 무응답 경계',meta:'도시·국가·위성 신호 동시 소실',status:'NO RESPONSE',confidence:'disputed',records:['Dead_Zone_Pilgrimage']}
        ]
      },
      {
        id:'deadzone-kingdom-graves',region:'northamerica',terrain:'ruins',
        label:'고대 왕국 묘역',code:'DEAD ZONE / KINGDOM GRAVES',status:'HISTORICAL SIGNALS',confidence:'14%',
        description:'멸망한 왕국과 버려진 요새가 겹쳐 있는 묘역. 일부 성채는 이름과 주인이 사라진 뒤에도 순례자를 받아들인다.',
        warning:'불빛 없는 요새에 응답하지 말 것. 고유 무기는 봉인 주체가 확인되기 전까지 회수 금지다.',
        routes:[
          {id:'grave-road',className:'historical',label:'KINGDOM GRAVE ROAD',risk:'high',signal:'historical',rule:'왕국 표식과 현재 성채의 소속을 동일시하지 말 것',siteIds:['grave-throne','grave-refuge','grave-weapon-field','grave-unlit','grave-memorial','grave-last-kingdom'],points:[[90,438],[250,367],[421,309],[575,232],[742,279],[915,161]]},
          {id:'refuge-route',className:'pilgrimage',label:'REFUGE CASTLE TRACE',risk:'medium',signal:'testimony',rule:'불빛과 내부 열원이 함께 확인된 성채만 피난처로 판정',siteIds:['grave-throne','grave-refuge','grave-weapon-field'],points:[[250,367],[366,437],[524,398]]},
          {id:'collapsed-wall',className:'hazard',label:'COLLAPSED FORTIFICATION',risk:'critical',signal:'lost',rule:'무등화 요새와 붕괴 방벽 사이에서 야영하지 말 것',siteIds:['grave-unlit','grave-last-kingdom'],points:[[151,163],[318,204],[489,147],[651,196],[844,112]]}
        ],
        sites:[
          {id:'grave-throne',x:90,y:438,type:'ruin',label:'이름 없는 왕좌터',meta:'왕조 표식 11종 중첩',status:'발굴 중지',confidence:'historical',records:['Dead_Zone_Pilgrimage']},
          {id:'grave-refuge',x:250,y:367,type:'fortress',label:'귀환 성채',meta:'집을 잃은 순례자 임시 수용',status:'불빛 확인',confidence:'testimony',records:['Dead_Zone_Pilgrimage']},
          {id:'grave-weapon-field',x:421,y:309,type:'anomaly',label:'봉인 무기 묘지',meta:'개체 결박 반응 다수',status:'회수 금지',confidence:'observed',records:['Dead_Zone_Pilgrimage']},
          {id:'grave-unlit',x:575,y:232,type:'fortress',label:'무등화 요새',meta:'내부 열원 없음 / 문 개방',status:'접근 금지',confidence:'disputed',records:['Dead_Zone_Pilgrimage']},
          {id:'grave-memorial',x:742,y:279,type:'incident',label:'순례자 추모호',meta:'피의 수면 아래 장비 신호',status:'헌정 흔적',confidence:'testimony',records:['Dead_Zone_Pilgrimage']},
          {id:'grave-last-kingdom',x:915,y:161,type:'ruin',label:'마지막 왕국 잔해',meta:'국가 이전 연대의 방벽',status:'미확인 수호 반응',confidence:'historical',records:['Dead_Zone_Pilgrimage']}
        ]
      },
      {
        id:'deadzone-silent-interior',region:'northamerica',terrain:'silent',
        label:'내륙 무응답권',code:'DEAD ZONE / SILENT INTERIOR',status:'MAP TERMINATES HERE',confidence:'7%',
        description:'지도, 위성, 순례자 진술이 모두 끊기는 내륙. 표식 대부분은 위치가 아니라 마지막 통신 시각을 지리 좌표처럼 환산한 것이다.',
        warning:'이 지도는 경로 안내가 아니다. 자신이 보내지 않은 구조 신호와 개인 식별 신호에 응답하지 말 것.',
        routes:[
          {id:'last-map-line',className:'broken',label:'LAST CARTOGRAPHIC LINE',risk:'critical',signal:'terminating',rule:'지도 종결선 이후의 좌표값을 위치로 해석하지 말 것',siteIds:['silent-last-station','silent-personal-echo','silent-black-highway','silent-force-boundary'],points:[[84,431],[245,366],[397,303],[548,248]]},
          {id:'black-highway',className:'hazard',label:'BLACK HIGHWAY',risk:'critical',signal:'looping',rule:'과거 지명이 반복되면 즉시 도로에서 이탈할 것',siteIds:['silent-black-highway','silent-force-boundary','silent-no-return'],points:[[160,133],[330,182],[504,119],[688,169],[908,96]]},
          {id:'false-rescue',className:'hostile',label:'FALSE RESCUE SIGNAL',risk:'critical',signal:'spoofed',rule:'자신 또는 귀환자의 목소리로 온 구조 신호에 응답 금지',siteIds:['silent-force-boundary','silent-false-rescue','silent-no-return'],points:[[548,248],[682,342],[824,309]]}
        ],
        sites:[
          {id:'silent-last-station',x:84,y:431,type:'facility',label:'최후 지도국',meta:'종이 지도 3장만 회수',status:'폐쇄',confidence:'historical',records:['Dead_Zone_Pilgrimage']},
          {id:'silent-personal-echo',x:245,y:366,type:'signal',label:'개인 식별 반향',meta:'실종자 자신의 구조 신호',status:'응답 금지',confidence:'disputed',records:['Dead_Zone_Pilgrimage']},
          {id:'silent-black-highway',x:397,y:303,type:'anomaly',label:'검은 고속도로',meta:'거리 표지판이 과거 지명을 사용',status:'경로 순환',confidence:'estimated',records:['Dead_Zone_Pilgrimage']},
          {id:'silent-force-boundary',x:548,y:248,type:'unknown',label:'미지 세력 경계',meta:'모든 외부 통제 신호 종결',status:'MAP TERMINATES',confidence:'disputed',records:['Dead_Zone_Pilgrimage']},
          {id:'silent-false-rescue',x:682,y:342,type:'incident',label:'거짓 구조 신호원',meta:'귀환자 4명의 목소리 중첩',status:'활성',confidence:'observed',records:['Dead_Zone_Pilgrimage']},
          {id:'silent-no-return',x:908,y:96,type:'unknown',label:'무귀환 중심부',meta:'위치가 아닌 마지막 통신 시각',status:'UNKNOWN CONTROL',confidence:'disputed',records:['Dead_Zone_Pilgrimage']}
        ]
      }
    ]
  });
})(window);
