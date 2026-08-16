// Project Curse 5.28.0 — reactive field scenarios with persistent cross-stage consequences.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCursePilgrimageData=freeze({
    version:'2.1.0',
    scenarios:{
      'unlit-fortress':{
        id:'unlit-fortress',code:'PILGRIMAGE / GBF-07',title:'불빛 없는 성채',region:'남미 대흑림 · 서부 순례 회랑',
        summary:'몬수르 서부 교회가 맡긴 작은 종을 운반하고, 불빛 없는 성채의 구조 신호가 실제 생존자에게서 나온 것인지 확인한다.',
        directive:'현상과의 접촉을 최소화하되, 도움 요청에는 성채 바깥에서 응답한다.',
        theme:'forest',channel:'U.A.C FIELD PILGRIMAGE CHANNEL',entryLabel:'VOLUNTARY ENTRY / NO RETURN GUARANTEE',directiveLabel:'PILGRIM DIRECTIVE',
        metrics:[{key:'fear',label:'FEAR',tone:'fear',initial:8},{key:'corruption',label:'CORRUPTION',tone:'corruption',initial:0},{key:'signal',label:'SIGNAL',tone:'signal',initial:86}],
        outcomeLabels:{kept:'RULE KEPT',broken:'RULE BROKEN'},negativeOutcomes:['broken'],
        primaryRecord:'Great_Black_Forest_Region',guideRecord:'Pilgrim_Rules_GBF',mapTarget:{detail:'gbf-western-marches',site:'gbf-unlit-fortress'},
        records:['Great_Black_Forest_Region','Pilgrim_Rules_GBF'],operation:'op-unlit-fortress',incident:'evt-gbf-unlit',
        map:{viewBox:'0 0 900 420',points:[[66,346],[205,282],[347,219],[477,267],[603,188],[742,118]],labels:['외곽 관측소','몬수르 교회','결투 지점','검은 강','피의 호수','불빛 없는 성채']},
        stages:[
          {
            id:'observation',code:'TRACE 01',time:'16:10',title:'서부 외곽 관측소',location:'경계선 03 / 정상 거리',
            narrative:'조사팀 네 명의 장비와 생체 신호가 일치한다. 숲 안쪽에서는 존재하지 않는 다섯 번째 호출 부호가 간헐적으로 응답한다.',
            signal:'T-01 / 4 PERSONNEL / EXTRA CARRIER DETECTED',rule:{code:'PREP',text:'출발하기 전에 개인 장비와 봉인물을 확인하라.'},
            choices:[
              {id:'seal-check',label:'봉인과 장비를 재검사한다',description:'속도를 늦추고 종과 무기의 결속 흔적을 확인한다.',tone:'safe',deltas:{fear:-3,corruption:-2,signal:8},ruleOutcome:'kept'},
              {id:'follow-carrier',label:'다섯 번째 신호를 추적한다',description:'경로 밖의 호출 부호를 짧게 따라가 흔적을 채집한다.',tone:'risk',deltas:{fear:8,corruption:5,signal:-6},ruleOutcome:'broken'}
            ]
          },
          {
            id:'monsur',code:'TRACE 02',time:'16:43',title:'몬수르 서부 교회',location:'서부 회랑 / 불완전 교신',
            narrative:'시간에 잊힌 교회가 작은 종을 내민다. 종을 성채 문 앞에 두고 세 번 울려 달라는 부탁이다. 대가에 관한 질문에는 누구도 답하지 않는다.',
            signal:'LIFE COUNT 05 / VISUAL COUNT 04',rule:{code:'RULE 01',text:'오래전에 잊힌 교단이 도움을 청하면 거절하지 마라.'},
            choices:[
              {id:'accept-bell',label:'종을 인계받는다',description:'요청을 수락하고 종을 격리함에 봉인한다.',tone:'safe',deltas:{fear:4,corruption:3,signal:6},ruleOutcome:'kept'},
              {id:'refuse-bell',label:'종을 받지 않고 좌표만 요구한다',description:'의식 계약을 피하지만 교회의 보호 표식도 받지 못한다.',tone:'risk',deltas:{fear:9,corruption:7,signal:-9},ruleOutcome:'broken'}
            ]
          },
          {
            id:'duel',code:'TRACE 03',time:'17:18',title:'귀환자의 결투',location:'옛 전장 외곽 / 인원 불일치',
            narrative:'반대편에서 돌아오는 순례자가 길을 막고 결투를 요구한다. 영상 프레임마다 그의 얼굴과 무기가 바뀌지만, 발밑 그림자는 하나다.',
            signal:'RETURNED PILGRIM / ID UNRESOLVED',rule:{code:'RULE 02',text:'순례에서 돌아온 자가 결투를 청하면 거절하지 마라.'},
            variants:[{when:{choice:'refuse-bell'},location:'옛 전장 외곽 / 보호 표식 없음',narrative:'교회의 보호 표식이 없는 것을 본 귀환자가 곧바로 길을 막는다. 그는 결투가 아니라 “거절한 부탁을 대신 갚으라”고 요구한다. 영상 프레임마다 얼굴과 무기는 바뀌지만, 종을 들지 않은 손만 같은 위치에 남는다.',signal:'RETURNED PILGRIM / MONSUR MARK ABSENT / DEBT CLAIMED'}],
            choices:[
              {id:'ritual-duel',label:'무기를 거두고 증언으로 결투한다',description:'서로의 귀환 경로를 한 문장씩 말하며 결투를 대신한다.',tone:'safe',deltas:{fear:5,corruption:2,signal:10},ruleOutcome:'kept'},
              {id:'evade-duel',label:'대답하지 않고 길을 돌아간다',description:'싸움은 피할 수 있지만 귀환자가 남긴 표식이 조사팀을 따라온다.',tone:'risk',deltas:{fear:12,corruption:8,signal:-8},ruleOutcome:'broken'}
            ]
          },
          {
            id:'black-river',code:'TRACE 04',time:'18:06',title:'검은 강 제4관측점',location:'거리 오차 +3.7km / 통신 저하',
            narrative:'강둑에는 조사팀과 동일한 일련번호의 장비가 놓여 있다. 물은 빛을 반사하지 않고, 건너편의 조사팀이 현재 행동을 수 초 늦게 반복한다.',
            signal:'DUPLICATE EQUIPMENT / BANK PROXIMITY WARNING',rule:{code:'RULE 09',text:'강물이 검다면 물가에 가까이 가지 마라.'},
            variants:[{when:{choice:'follow-carrier'},narrative:'출발 때 추적했던 다섯 번째 신호가 강 한가운데서 멈춘다. 강둑에는 조사팀과 동일한 장비 다섯 벌이 놓여 있고, 건너편의 다섯 그림자가 현재 행동을 수 초 늦게 반복한다.',signal:'EXTRA CARRIER FOUND / EQUIPMENT SETS 05 / BANK WARNING'}],
            choices:[
              {id:'keep-distance',label:'강둑에서 물러나 종소리로 길을 찾는다',description:'울림이 사라지는 쪽을 피해 상류의 마른 땅으로 돌아간다.',tone:'safe',deltas:{fear:5,corruption:-1,signal:4},ruleOutcome:'kept'},
              {id:'recover-duplicate',label:'같은 일련번호가 찍힌 장비를 회수한다',description:'검은 물 가까이 다가가 장비와 기억카드를 가져온다.',tone:'danger',deltas:{fear:14,corruption:16,signal:-12},ruleOutcome:'broken'}
            ]
          },
          {
            id:'blood-lake',code:'TRACE 05',time:'18:29',title:'피의 호수',location:'북부 전사자 장비 신호 / 시간 불명',
            narrative:'호수 주변에는 서로 다른 시대와 전선의 장비가 놓여 있다. 남방 특수부대 표식 사이에서 아직 켜진 송신기가 전사자들의 호출 부호를 반복한다.',
            signal:'MEMORIAL RESPONSE / HOSTILE TRACE NEARBY',rule:{code:'RULE 06',text:'피의 호수를 만나면 쓰러진 자들에게 예를 표하라.'},
            choices:[
              {id:'pay-respect',label:'무기를 내리고 전사자의 호출 부호를 읽는다',description:'종을 한 번 울리고 장비를 원래 위치에 둔다.',tone:'safe',deltas:{fear:-2,corruption:-4,signal:9},ruleOutcome:'kept'},
              {id:'take-transmitter',label:'작동 중인 송신기를 회수한다',description:'남방 교신을 추적하기 위해 추모 배열을 해체한다.',tone:'danger',deltas:{fear:10,corruption:13,signal:4},ruleOutcome:'broken'}
            ]
          },
          {
            id:'fortress',code:'TRACE 06',time:'18:51',title:'불빛 없는 성채',location:'무광 외벽 / 내부 생활 소음 확인',
            narrative:'성채에는 불빛이 없지만 안쪽에서 식기와 발걸음 소리가 들린다. 구조 요청은 문 안이 아니라 조사팀의 무전기에서 나온다. 종은 아직 울리지 않았는데 성문이 조금씩 열린다.',
            signal:'NO LIGHT / OCCUPIED INTERIOR / ROUTE CLOSING',rule:{code:'RULE 07',text:'불빛 없는 전장과 성채는 피하라. 도움 요청에는 밖에서 응답하라.'},
            variants:[
              {when:{choice:'take-transmitter'},narrative:'성채 안의 생활 소음 사이로 피의 호수에서 가져온 송신기가 먼저 응답한다. 송신기에는 조사팀이 아직 보내지 않은 구조 요청이 저장돼 있고, 성문은 그 재생 속도에 맞춰 조금씩 열린다.',signal:'RECOVERED TRANSMITTER ACTIVE / FUTURE DISTRESS LOOP',choicePatches:{'enter-fortress':{description:'송신기가 가리키는 방과 아직 보내지 않은 구조 요청의 발신자를 직접 확인한다.'}}},
              {when:{all:['refuse-bell','evade-duel']},narrative:'성채에는 불빛도 생활 소음도 없다. 뒤따라온 귀환자가 성문 앞에 서서 조사팀 대신 보이지 않는 종을 세 번 울린다. 구조 요청은 이제 단말 사용자의 목소리로 철수를 막는다.',signal:'NO COVENANT / RETURNED PILGRIM AT GATE / OPERATOR VOICE'}
            ],
            choices:[
              {id:'answer-outside',label:'성문 밖에서 종을 세 번 울리고 협상한다',description:'성채 안으로 들어가지 않고 구조 요청의 대가와 인원만 확인한다.',tone:'safe',deltas:{fear:7,corruption:2,signal:11},ruleOutcome:'kept',ending:'sanctuary'},
              {id:'enter-fortress',label:'열린 성문 안으로 진입한다',description:'내부 주민과 다섯 번째 조사원의 정체를 직접 확인한다.',tone:'danger',deltas:{fear:18,corruption:22,signal:-18},ruleOutcome:'broken',ending:'breach'},
              {id:'withdraw',label:'종을 두고 전 경로에서 철수한다',description:'요청에는 물건으로 답하고 생존 인원을 우선한다.',tone:'neutral',deltas:{fear:5,corruption:-2,signal:-7},ruleOutcome:'kept',ending:'retreat'}
            ]
          }
        ],
        endings:{
          sanctuary:{id:'sanctuary',code:'ENDING / OUTSIDE COVENANT',title:'성문 밖의 협정',tone:'allied',status:'PASSAGE CONDITIONALLY OPEN',summary:'종소리 뒤 성문은 닫혔고, 무전기에서 다섯 번째 호출 부호가 사라졌다. 내부 주민은 모습을 보이지 않은 채 실종자 두 명을 성문 밖으로 내보냈다.',consequence:'서부 순례 회랑에 제한적인 피난 통로가 생겼다. 성채 내부는 여전히 미확인 상태다.'},
          breach:{id:'breach',code:'ENDING / INTERIOR BREACH',title:'다섯 번째 조사원',tone:'hostile',status:'COORDINATE COLLAPSED',summary:'성문 안에는 조사팀이 도착하기 전부터 네 사람의 방이 준비돼 있었다. 다섯 번째 방의 이름표에는 현재 단말 사용자의 호출 부호가 적혀 있었다.',consequence:'성채 좌표와 철수 경로가 지도에서 사라졌다. 오염된 기억카드가 새 기록으로 남았다.'},
          retreat:{id:'retreat',code:'ENDING / ROUTE ABANDONED',title:'남겨 둔 종',tone:'contained',status:'TEAM RETURNED / ROUTE LOST',summary:'조사팀은 전원 외곽 관측소로 돌아왔다. 그러나 인계 목록에는 처음부터 다섯 명이 출발한 것으로 기록돼 있다.',consequence:'인원은 생환했지만 성채 접근 경로를 다시 사용할 수 없다. 몬수르 교회는 종의 반환을 요구하지 않았다.'}
        }
      },
      'deadzone-return':{
        id:'deadzone-return',code:'RETURN PROTOCOL / DZ-07',title:'돌아온 자의 이름',region:'북미 데드존 · 서부 귀환 회랑',
        summary:'데드존 경계에서 회수된 네 명의 귀환자와 다섯 번째 생체 신호를 분리하고, 검문소 07 내부로 들이기 전에 신원과 기억의 연속성을 판정한다.',
        directive:'귀환자의 증언을 전진 항법에 사용하지 말고, 사람의 수보다 서로 다른 기억의 수를 우선 확인한다.',
        theme:'deadzone',channel:'U.A.C RETURN SCREENING CHANNEL',entryLabel:'QUARANTINE AUTHORITY / IDENTITY NOT GUARANTEED',directiveLabel:'RETURN DIRECTIVE',
        metrics:[{key:'identity',label:'IDENTITY',tone:'identity',initial:82},{key:'exposure',label:'EXPOSURE',tone:'exposure',initial:14},{key:'coherence',label:'COHERENCE',tone:'coherence',initial:76},{key:'trust',label:'TRUST',tone:'trust',initial:58}],
        outcomeLabels:{verified:'CHECK VERIFIED',compromised:'CHECK COMPROMISED',contained:'RISK CONTAINED'},negativeOutcomes:['compromised'],
        records:['Dead_Zone_Pilgrimage'],operation:'op-deadzone-return',incident:'evt-deadzone-return',primaryRecord:'Dead_Zone_Pilgrimage',guideRecord:'Dead_Zone_Pilgrimage',mapTarget:{detail:'deadzone-return-corridor',site:'dead-checkpoint-07'},
        map:{viewBox:'0 0 900 420',points:[[78,86],[218,142],[356,205],[498,252],[650,315],[814,356]],labels:['서부 귀환 신호','백색 재 검문소','진술 분리실','기억 체크섬','격리 회랑','최종 귀환 판정']},
        stages:[
          {
            id:'return-signal',code:'SCREEN 01',time:'04:12',title:'서부 귀환 신호',location:'경계선 외측 / 열원 05 · 시야 04',
            narrative:'등록된 네 명의 순례자가 폐쇄선을 향해 걸어온다. 열상 장비에는 그들 사이를 같은 보폭으로 걷는 다섯 번째 열원이 있으나, 육안과 카메라에는 나타나지 않는다.',
            signal:'VISUAL 04 / THERMAL 05 / OUTBOUND RECORD MISSING',rule:{code:'RETURN 01',text:'귀환자의 말과 생체 신호를 따로 확인하라. 경계선 밖에서 인원을 다시 세어라.'},
            choices:[
              {id:'hold-perimeter',label:'외곽 조명을 켠 뒤 네 사람을 따로 세운다',description:'열원을 떨어뜨려 놓고 다섯 번째 반응이 누구를 따라가는지 확인한다.',tone:'safe',deltas:{identity:8,exposure:-3,coherence:5,trust:4},ruleOutcome:'verified'},
              {id:'open-first-gate',label:'귀환자들이 쓰러지기 전에 1차 격리문을 연다',description:'네 사람은 추위를 피하지만 다섯 번째 열원도 검문 구역으로 들어온다.',tone:'risk',deltas:{identity:-9,exposure:11,coherence:-6,trust:7},ruleOutcome:'compromised'}
            ]
          },
          {
            id:'white-ash',code:'SCREEN 02',time:'04:26',title:'백색 재 검문소',location:'검문소 07 / 표면 오염 분리대',
            narrative:'장비와 의복에 묻은 흰 재는 바람과 반대 방향으로 흐른다. 재를 털어 낼 때마다 네 사람의 출발 사진에서 얼굴 하나가 잠깐씩 지워진다.',
            signal:'ASH SAMPLE RESPONDS TO ARCHIVE IMAGE / MASS +0.7KG',rule:{code:'RETURN 02',text:'귀환자가 가져온 물질은 없애기 전에 출발 기록과 대조하라. 사람별로 따로 봉인하라.'},
            choices:[
              {id:'isolate-samples',label:'사람마다 묻어 온 재를 따로 봉인한다',description:'출발 사진과 대조해 재가 어느 얼굴부터 지우는지 기록한다.',tone:'safe',deltas:{identity:7,exposure:4,coherence:7,trust:-2},ruleOutcome:'verified'},
              {id:'incinerate-ash',label:'모든 재와 외부 장비를 즉시 소각한다',description:'표면 오염은 줄지만 신원 대조에 사용할 물적 증거가 사라진다.',tone:'neutral',deltas:{identity:-5,exposure:-9,coherence:-3,trust:3},ruleOutcome:'contained'}
            ]
          },
          {
            id:'testimony',code:'SCREEN 03',time:'04:51',title:'귀환자 진술 대조',location:'분리 심문실 A–D / 음성 지연 0.8초',
            narrative:'네 귀환자는 서로 격리되어 있는데도 같은 시각에 같은 단어로 답한다. 누구도 출발지는 기억하지 못하지만, 지도에 없는 ‘아르디스 왕국’의 마지막 밤을 자신의 어린 시절처럼 설명한다.',
            signal:'FOUR VOICES / ONE SENTENCE / UNKNOWN KINGDOM MEMORY',rule:{code:'RETURN 03',text:'모두 같은 말을 해도 믿지 마라. 서로 다른 기억을 찾아 기록하라.'},
            variants:[{when:{choice:'incinerate-ash'},narrative:'흰 재를 소각한 뒤 네 귀환자의 얼굴은 출발 사진과 다시 일치한다. 그러나 서로 격리된 네 사람은 같은 시각에 같은 문장으로 답하고, 소각로 안에서는 지도에 없는 ‘아르디스 왕국’의 국가가 흘러나온다.',signal:'ASH DESTROYED / FOUR VOICES SYNCHRONIZED / EVIDENCE LOST'}],
            choices:[
              {id:'personal-questions',label:'각자에게 서로 다른 개인적인 질문을 던진다',description:'작전과 관계없는 감각과 추억을 물어 똑같은 답변을 흔든다.',tone:'safe',deltas:{identity:10,exposure:2,coherence:8,trust:5},ruleOutcome:'verified'},
              {id:'shared-map',label:'네 사람에게 같은 귀환 지도를 보여 준다',description:'경로는 빠르게 되살아나지만 네 사람의 기억이 하나로 합쳐진다.',tone:'danger',deltas:{identity:-12,exposure:8,coherence:-11,trust:9},ruleOutcome:'compromised'}
            ]
          },
          {
            id:'checksum',code:'SCREEN 04',time:'05:17',title:'기억 체크섬',location:'인지 검사실 / 기록 시각 역행',
            narrative:'출발 전에 봉인한 네 개의 개인 문장이 개봉된다. 세 귀환자는 자신의 문장을 기억하지 못한다. 네 번째는 모든 문장을 알고 있으며, 아직 개봉하지 않은 다섯 번째 봉투의 문장까지 읽는다.',
            signal:'SEALED PHRASES 04 / RESPONSE SET 05',rule:{code:'RETURN 04',text:'봉인한 문장을 미리 아는 자를 원본이라고 믿지 마라.'},
            choices:[
              {id:'false-checksum',label:'가짜 다섯 번째 문장을 제시해 반응을 기록한다',description:'존재하지 않는 기억을 누가 먼저 완성하는지 확인한다.',tone:'safe',deltas:{identity:9,exposure:5,coherence:12,trust:-4},ruleOutcome:'verified'},
              {id:'forced-extraction',label:'신경 추출기로 공통 기억을 강제 분리한다',description:'빠른 결과를 얻지만 네 사람의 개인 기억이 동시에 손상될 수 있다.',tone:'danger',deltas:{identity:-8,exposure:14,coherence:-15,trust:-12},ruleOutcome:'compromised'}
            ]
          },
          {
            id:'quarantine',code:'SCREEN 05',time:'05:44',title:'격리 회랑',location:'내부 봉쇄선 / 외부에서 동일 호출 부호 수신',
            narrative:'검문소 바깥에서 구조 신호가 다시 들어온다. 송신자는 안에 있는 네 사람의 호출 부호를 차례로 사용하며 “문을 열지 마라. 우리는 아직 밖에 있다”고 반복한다.',
            signal:'EXTERNAL DISTRESS / INTERNAL IDS MATCH / DOOR PRESSURE RISING',rule:{code:'RETURN 05',text:'자신이나 귀환자의 목소리로 구조 신호가 와도 대답하지 마라.'},
            variants:[{when:{choice:'shared-map'},narrative:'검문소 바깥에서 구조 신호가 다시 들어온다. 네 목소리는 이제 서로의 문장을 이어 말하지 않고 완전히 같은 한 목소리로 겹친다. 내부 귀환자들도 같은 지도를 바라보며 동시에 “우리는 아직 밖에 있다”고 말한다.',signal:'ONE SHARED VOICE / INTERNAL AND EXTERNAL MEMORY MATCH'}],
            choices:[
              {id:'silent-lockdown',label:'대답하지 않은 채 문을 잠그고 생체 신호를 다시 잰다',description:'바깥 신호는 무시하고 실제로 안에 있는 네 사람부터 격리한다.',tone:'safe',deltas:{identity:6,exposure:-5,coherence:5,trust:3},ruleOutcome:'contained'},
              {id:'answer-distress',label:'바깥 신호에 신원 확인 질문을 보낸다',description:'답은 돌아오지만 질문이 끝나기 전에 목소리가 단말 사용자의 것으로 바뀐다.',tone:'danger',deltas:{identity:-11,exposure:16,coherence:-9,trust:-6},ruleOutcome:'compromised'}
            ]
          },
          {
            id:'verdict',code:'SCREEN 06',time:'06:03',title:'최종 귀환 판정',location:'검문소 07 내측문 / 운영자 단독 승인',
            narrative:'내측문 앞에는 네 사람이 서 있지만 출입 통제기는 다섯 개의 승인을 요구한다. 마지막 승인을 비워 두면 문은 열리지 않는다. 운영자 명단의 다섯 번째 줄에는 현재 단말의 호출 부호가 자동 입력된다.',
            signal:'RETURN COUNT 04 / ACCESS COUNT 05 / OPERATOR INCLUDED',rule:{code:'FINAL VERDICT',text:'살아 돌아왔다는 사실과 침투 가능성을 함께 기록하라. 모른다는 결론을 승인으로 바꾸지 마라.'},
            variants:[{when:{choice:'answer-distress'},narrative:'내측문 앞에는 네 귀환자와 통신으로만 존재하는 운영자 목소리가 함께 서 있다. 출입 통제기는 이미 다섯 번째 승인을 받은 것으로 표시하며, 운영자에게 남은 선택은 그 승인을 유지하거나 전체 기록을 무효화하는 것뿐이다.',signal:'RETURN COUNT 04 / REMOTE APPROVAL 05 ALREADY PRESENT',choicePatches:{'approve-fifth':{label:'이미 등록된 다섯 번째 승인을 유지한다',description:'바깥 신호에 보낸 운영자 음성을 정식 귀환 승인으로 인정한다.'},'reverse-pilgrimage':{description:'원격 승인의 발신점을 찾기 위해 별도 조사팀을 최초 구조 신호 방향으로 보낸다.'}}}],
            choices:[
              {id:'conditional-return',label:'네 사람의 귀환을 조건부로 승인한다',description:'각자 따로 감시하며 인간으로 확인된 기억을 보존한다. 다섯 번째 승인은 비워 둔다.',tone:'safe',deltas:{identity:8,exposure:3,coherence:6,trust:8},ruleOutcome:'verified',ending:'approved'},
              {id:'seal-checkpoint',label:'검문소 전체를 봉쇄하고 누구도 통과시키지 않는다',description:'내부 침투를 막지만 진짜 생존자까지 데드존 귀환자로 남는다.',tone:'neutral',deltas:{identity:2,exposure:-12,coherence:1,trust:-7},ruleOutcome:'contained',ending:'sealed'},
              {id:'approve-fifth',label:'자동 생성된 다섯 번째 승인까지 수락한다',description:'내측문을 완전히 열고 시스템이 요구하는 인원수를 신뢰한다.',tone:'danger',deltas:{identity:-20,exposure:24,coherence:-18,trust:-15},ruleOutcome:'compromised',ending:'fifth'},
              {id:'reverse-pilgrimage',label:'승인을 멈추고 처음 구조 신호가 온 곳을 추적한다',description:'귀환 판정을 보류한 채 별도 조사팀을 데드존으로 보낸다.',tone:'risk',deltas:{identity:4,exposure:10,coherence:4,trust:2},ruleOutcome:'contained',ending:'reverse'}
            ]
          }
        ],
        endings:{
          approved:{id:'approved',code:'ENDING / CONDITIONAL RETURN',title:'귀환 승인',tone:'allied',status:'RETURN APPROVED / FIFTH PENDING',summary:'네 귀환자는 서로 다른 감시실로 이송됐다. 다섯 번째 열원은 경계문 앞에서 사라졌지만, 매일 04시 12분이면 비어 있는 침상 하나의 체온이 사람의 온도로 올라간다.',consequence:'서부 귀환 회랑이 조건부로 재개방됐다. 검문소는 모든 귀환 기록에 다섯 번째 인원 칸을 남겨 둔다.'},
          sealed:{id:'sealed',code:'ENDING / TOTAL QUARANTINE',title:'검문소 봉쇄',tone:'contained',status:'WESTERN CORRIDOR SEALED',summary:'검문소 07의 내외측문이 모두 용접됐다. 마지막 카메라 영상에서 네 귀환자는 봉쇄 명령 직전까지 다섯 번째 사람과 대화하고 있었지만, 그 자리는 영상 압축 오류로만 남았다.',consequence:'침투 가능성은 억제됐으나 생존자 신원도 확정되지 않았다. 서부 회랑의 모든 귀환 접수가 중단됐다.'},
          fifth:{id:'fifth',code:'ENDING / OPERATOR ADDED',title:'다섯 번째 귀환자',tone:'hostile',status:'OPERATOR 05 / SESSION ACTIVE',summary:'문이 열린 뒤 통과 기록에는 다섯 명이 표시됐다. 네 귀환자는 모두 존재하지만 다섯 번째 인물의 영상은 없다. 대신 현재 단말의 로그인 기록이 데드존 출발 명단에서 발견됐다.',consequence:'검문소 내부망의 사용자 수가 하나 증가했다. 서부 귀환 회랑 좌표는 외부에서 정상으로 보이지만 내부 신원 체계는 신뢰할 수 없다.'},
          reverse:{id:'reverse',code:'ENDING / OUTBOUND REOPENED',title:'역방향 순례',tone:'unstable',status:'RECOVERY TEAM OUTBOUND',summary:'귀환 판정은 보류됐고 조사팀이 원래 구조 신호를 따라 폐쇄선 밖으로 출발했다. 네 귀환자는 그들이 향한 방향을 보자 처음으로 서로 다른 표정을 지었다.',consequence:'세 번째 현장 작전의 전진 경로가 열렸다. 귀환자들은 아직 격리 중이며 조사팀의 호출 부호가 하나씩 다섯 번째 신호로 바뀌고 있다.'}
        }
      },
      'deadzone-recovery':{
        id:'deadzone-recovery',code:'OUTBOUND RECOVERY / DZ-R05',title:'검문소 아래의 구조 신호',region:'북미 데드존 · 지하 전진 회수선',
        summary:'DZ-VR-04에 남은 좌표를 따라 검문소 07 아래의 존재하지 않는 층으로 내려가, 최초 구조 신호의 발생원과 먼저 도착해 있는 회수팀의 흔적을 확인한다.',
        directive:'호출 부호는 본인이 먼저 말하기 전까지 대신 부르지 않는다. 귀환자의 공통 기억과 앞으로 남겨질 자신의 흔적을 항법 자료로 사용하지 않는다.',
        theme:'recovery',channel:'U.A.C OUTBOUND RECOVERY CHANNEL',entryLabel:'DZ-VR-04 VERIFIED / OUTBOUND AUTHORIZED',directiveLabel:'RECOVERY DIRECTIVE',
        unlock:{type:'verdict',id:'DZ-VR-04',label:'역방향 순례 판정 필요'},
        metrics:[{key:'team',label:'TEAM',tone:'team',initial:100},{key:'tether',label:'TETHER',tone:'tether',initial:88},{key:'depth',label:'DEPTH',tone:'depth',initial:6},{key:'echo',label:'ECHO',tone:'echo',initial:4}],
        outcomeLabels:{secured:'ROUTE SECURED',contained:'RISK CONTAINED',compromised:'SIGNAL COMPROMISED'},negativeOutcomes:['compromised'],
        records:['Dead_Zone_Pilgrimage'],operation:'op-deadzone-recovery',incident:'evt-deadzone-recovery',primaryRecord:'Dead_Zone_Pilgrimage',guideRecord:'DZ-VR-04',mapTarget:{detail:'deadzone-return-corridor',site:'dead-origin-beacon'},
        map:{viewBox:'0 0 900 420',points:[[82,92],[225,150],[370,218],[517,270],[668,326],[818,362]],labels:['지하 출발 좌표','매몰 검문소 06','이름 없는 주거지','역행 고속도로','원신호 발생점','회수·봉쇄선']},
        stages:[
          {
            id:'sublevel',code:'RECOVERY 01',time:'06:21',title:'검문소 아래의 좌표',location:'검문소 07 지하 / 도면상 빈 공간',
            narrative:'DZ-VR-04의 첫 좌표는 내륙이 아니라 검문소 화물 승강기 아래를 가리킨다. 승강기에는 없는 지하 8층 버튼이 켜져 있고, 닫힌 문 너머에서는 회수팀 네 명의 목소리가 출발 보고를 반복한다.',
            signal:'OUTBOUND TEAM 04 / VOICE COUNT 04 / DEPARTURE TIME -17 MIN',rule:{code:'RECOVERY 01',text:'출발 전에 귀환할 물리 경로를 남겨라. 먼저 들린 자신의 보고에는 대답하지 마라.'},
            choices:[
              {id:'anchor-tether',label:'수동 사다리를 열고 물리 견인선을 고정한다',description:'하강은 느리지만 검문소와 이어진 실제 장력을 계속 확인할 수 있다.',tone:'safe',deltas:{team:0,tether:9,depth:8,echo:2},ruleOutcome:'secured'},
              {id:'answer-elevator',label:'목소리에 응답하고 지하 8층 버튼을 누른다',description:'곧바로 아래층에 도착하지만 승강기 안의 인원 표시는 다섯 명으로 바뀐다.',tone:'risk',deltas:{team:-6,tether:-14,depth:15,echo:13},ruleOutcome:'compromised'}
            ]
          },
          {
            id:'checkpoint-06',code:'RECOVERY 02',time:'06:38',title:'매몰된 검문소 06',location:'지하 8층 / 운영 기록 19년 선행',
            narrative:'벽 뒤에서 검문소 06의 간판과 출입 기록이 드러난다. 기록에는 지금 막 출발한 회수팀이 열아홉 해 전에 이곳으로 귀환했고, 네 사람 모두 “구조 신호를 찾지 못했다”고 진술한 것으로 적혀 있다.',
            signal:'CHECKPOINT 06 / RETURN LOG PRECEDES DEPARTURE / PERSONNEL 04',rule:{code:'RECOVERY 02',text:'도착 기록이 출발보다 빠르면 이름을 대조하지 말고 시계부터 분리하라.'},
            variants:[{when:{choice:'answer-elevator'},narrative:'승강기 문이 열리자 매몰된 검문소 06의 인원 계수기가 다섯 명을 맞이한다. 열아홉 해 전 귀환 기록에는 회수팀 네 명과 얼굴 없는 승강기 안내원 한 명이 함께 서 있고, 안내원의 호출 부호는 현재 단말과 일치한다.',signal:'CHECKPOINT 06 / ARRIVAL COUNT 05 / OPERATOR ESCORT LOGGED'}],
            choices:[
              {id:'seal-roster',label:'귀환 명단을 덮고 각자의 시계를 따로 봉인한다',description:'누가 돌아온 것으로 적혔는지 확인하지 않은 채 물리 시간만 비교한다.',tone:'safe',deltas:{team:3,tether:5,depth:9,echo:-2},ruleOutcome:'contained'},
              {id:'read-roster',label:'열아홉 해 전 귀환 명단을 전부 읽는다',description:'네 이름은 일치하지만 다섯 번째 줄에는 현재 단말 운영자가 적혀 있다.',tone:'danger',deltas:{team:-8,tether:-8,depth:12,echo:16},ruleOutcome:'compromised'}
            ]
          },
          {
            id:'nameless-homes',code:'RECOVERY 03',time:'07:04',title:'이름이 사라진 주거지',location:'지하 주거 구획 / 외부 하늘 신호 감지',
            narrative:'검문소 뒤편에는 햇빛과 바람까지 재현된 주택가가 있다. 문패에는 팀원의 호출 부호가 하나씩 적혀 있고, 각 집 안에서는 그 사람이 가장 오래 듣지 못한 가족의 목소리가 현관문을 열어 달라고 말한다.',
            signal:'RESIDENTIAL SKY FALSE / FOUR HOMES / FAMILY VOICE MATCH',rule:{code:'RECOVERY 03',text:'자기 이름이 적힌 집에는 들어가지 마라. 기억이 아니라 대형을 따라 이동하라.'},
            variants:[{when:{choice:'read-roster'},narrative:'주택가에는 팀원 네 명의 집과 명단에서 읽은 다섯 번째 이름의 집이 함께 서 있다. 다섯 번째 집의 문패에는 현재 단말 운영자가 표시되고, 안에서는 아직 녹음하지 않은 운영자의 출발 명령이 가족의 목소리와 겹쳐 들린다.',signal:'RESIDENTIAL SKY FALSE / HOMES 05 / OPERATOR RESIDENCE FOUND'}],
            choices:[
              {id:'mark-exteriors',label:'문을 열지 않고 네 집의 외벽에 같은 표식을 남긴다',description:'가족의 목소리를 기록하되 팀 대형과 견인선을 유지한다.',tone:'safe',deltas:{team:7,tether:4,depth:10,echo:3},ruleOutcome:'secured'},
              {id:'split-homes',label:'각자 자신의 집에 들어가 목소리를 확인한다',description:'안에서는 몇 분이지만 바깥에서는 한 사람씩 몇 시간씩 사라진다.',tone:'danger',deltas:{team:-22,tether:-13,depth:15,echo:18},ruleOutcome:'compromised'}
            ]
          },
          {
            id:'reverse-highway',code:'RECOVERY 04',time:'07:37',title:'역행 고속도로',location:'표지판 거리 -12km / 발자국 선행',
            narrative:'차량과 빗물은 모두 출발지 쪽으로 거꾸로 흐른다. 도로 위에는 회수팀 장비와 같은 밑창 자국이 원신호 방향으로 이어지며, 아직 하지 않은 무전이 뒤쪽에서 차례로 재생된다.',
            signal:'DISTANCE DECREASING / FOOTPRINTS LEAD TEAM / RADIO FUTURE ECHO',rule:{code:'RECOVERY 04',text:'앞서 있는 자신의 흔적을 따라가지 마라. 장력이 유지되는 방향만 믿어라.'},
            variants:[{when:{choice:'split-homes'},narrative:'차량과 빗물은 출발지 쪽으로 거꾸로 흐르지만 팀원들의 시계는 서로 다른 속도로 앞으로 간다. 각자가 집 안에서 들은 가족 목소리가 아직 하지 않은 미래 무전을 대신 읽고, 다섯 갈래 발자국이 원신호로 이어진다.',signal:'TEAM CLOCKS DESYNCHRONIZED / FAMILY VOICES ON FUTURE RADIO'}],
            choices:[
              {id:'walk-against-echo',label:'무전을 끄고 견인선 장력에 맞춰 역행한다',description:'화면과 소리를 버리고 실제로 당겨지는 방향만 따라간다.',tone:'safe',deltas:{team:4,tether:8,depth:11,echo:-5},ruleOutcome:'secured'},
              {id:'follow-footprints',label:'미래의 발자국을 지름길로 사용한다',description:'빠르게 전진하지만 발자국 하나가 대열 뒤에서 새로 생기기 시작한다.',tone:'risk',deltas:{team:-9,tether:-15,depth:17,echo:17},ruleOutcome:'compromised'}
            ]
          },
          {
            id:'origin-beacon',code:'RECOVERY 05',time:'08:05',title:'원신호 발생점',location:'지하 관제탑 / 구조 신호 04:12 반복',
            narrative:'관제탑의 송신기는 회수팀 장비를 분해해 만든 부품으로 작동한다. 네 개의 배낭과 카메라가 이미 연결돼 있고, 그중 하나에는 아직 마르지 않은 피가 묻어 있다. 신호는 구조 요청이 아니라 검문소의 문을 여는 승인문을 반복한다.',
            signal:'BEACON BUILT FROM CURRENT EQUIPMENT / APPROVAL LOOP ACTIVE',rule:{code:'RECOVERY 05',text:'자신의 장비로 만들어진 신호에는 신원을 보내지 마라. 전원과 기록을 따로 분리하라.'},
            variants:[{when:{choice:'follow-footprints'},narrative:'미래 발자국은 관제탑 안에서 끝난다. 송신기에는 회수팀 장비 네 벌과 출처 없는 다섯 번째 카메라가 연결돼 있다. 카메라 화면에는 현재 팀의 바로 뒤를 걷는 단말 운영자가 비치고, 송신기는 그 영상을 검문 승인문과 함께 반복한다.',signal:'BEACON EQUIPMENT SETS 05 / OPERATOR IMAGE LIVE',choicePatches:{'full-identification':{label:'영상 속 다섯 번째 인원까지 포함해 응답한다',description:'네 호출 부호와 운영자 식별자를 원신호에 정식 전송한다.'}}}],
            choices:[
              {id:'split-power',label:'송신 전원을 끊고 원신호만 수동 매체에 복사한다',description:'신호를 회수하되 검문소로 향하는 자동 승인은 차단한다.',tone:'safe',deltas:{team:3,tether:4,depth:8,echo:-7},ruleOutcome:'contained'},
              {id:'full-identification',label:'네 호출 부호로 구조 신호에 정식 응답한다',description:'송신기는 곧바로 다섯 번째 호출 부호를 발급하고 철수 경로를 승인한다.',tone:'danger',deltas:{team:-13,tether:-16,depth:12,echo:24},ruleOutcome:'compromised'}
            ]
          },
          {
            id:'final-relay',code:'RECOVERY 06',time:'08:22',title:'다섯 번째 신호의 주인',location:'원신호 하부 회랑 / 검문소 07 수직선',
            narrative:'송신기 아래에는 먼저 도착한 회수팀 네 명이 앉아 있다. 얼굴과 장비는 현재 팀과 같지만 열아홉 해 늙어 있다. 그들은 “우리가 돌아가면 너희가 여기에 남는다”고 말하며, 한 사람만 중계기에 연결하면 나머지는 모두 철수할 수 있다고 주장한다.',
            signal:'DUPLICATE TEAM 04 / RELAY REQUIRES 01 / TETHER TERMINUS',rule:{code:'FINAL RECOVERY',text:'무엇을 사람으로 회수했고 무엇을 신호로 남겼는지 분리해 기록하라.'},
            variants:[{when:{choice:'full-identification'},narrative:'먼저 도착한 회수팀 네 명 옆에 빈 중계 의자가 켜져 있다. 의자에는 방금 원신호로 보낸 운영자 식별자가 이미 등록돼 있다. 늙은 팀은 “중계자는 선택하는 사람이 아니라 먼저 대답한 사람”이라고 말하며 견인선을 운영자 좌석에 연결한다.',signal:'DUPLICATE TEAM 04 / OPERATOR RELAY PRE-ASSIGNED',choicePatches:{'accept-relay':{label:'이미 배정된 운영자 중계를 승인한다',description:'원신호가 선점한 운영자 식별자를 다섯 번째 중계점으로 확정한다.'},'recover-beacon':{description:'운영자 중계 등록을 물리적으로 분리하고 두 회수팀을 같은 견인선에 묶는다.'}}}],
            choices:[
              {id:'recover-beacon',label:'중계기를 분리하고 두 팀을 같은 견인선에 묶는다',description:'원신호와 생존 가능 인원을 함께 지상으로 데려간다.',tone:'safe',deltas:{team:8,tether:9,depth:-18,echo:7},ruleOutcome:'secured',ending:'recovered'},
              {id:'seal-origin',label:'회랑을 붕괴시키고 현재 팀만 견인선으로 철수한다',description:'중계와 복제팀을 지하에 봉쇄해 검문소로 이어지는 신호를 끊는다.',tone:'neutral',deltas:{team:4,tether:6,depth:-12,echo:-14},ruleOutcome:'contained',ending:'buried'},
              {id:'accept-relay',label:'운영자 호출 부호를 중계기에 등록한다',description:'현장 인원은 모두 풀려나지만 단말 접속이 원신호의 다섯 번째 중계점이 된다.',tone:'danger',deltas:{team:-10,tether:-24,depth:4,echo:30},ruleOutcome:'compromised',ending:'relay'}
            ]
          }
        ],
        endings:{
          recovered:{id:'recovered',code:'ENDING / BEACON RECOVERED',title:'두 번 돌아온 사람들',tone:'allied',status:'BEACON RECOVERED / PERSONNEL 08',summary:'견인선 끝에서 여덟 명이 지상으로 올라왔다. 먼저 도착했던 네 사람은 검문소 햇빛을 보자 빠르게 젊어졌고, 두 팀의 얼굴은 끝내 구분할 수 없게 됐다.',consequence:'최초 구조 신호의 송신기가 격리 보관소로 회수됐다. 검문소는 생존자 여덟 명을 네 쌍으로 분리해 서로 다른 기억이 생기는지 관찰한다.',variants:[{when:{choice:'full-identification'},status:'BEACON RECOVERED / OPERATOR LINK CUT',summary:'두 회수팀은 모두 지상으로 돌아왔지만 운영자 중계 등록을 떼어 낸 순간 여덟 명이 동시에 현재 단말의 호출 부호를 말했다. 이후 그들은 빠르게 젊어져 서로를 구분할 수 없게 됐다.',consequence:'송신기는 회수됐고 운영자 연결도 끊겼다. 다만 여덟 생존자는 잠들 때마다 같은 운영자 세션의 종료 화면을 기억한다.'}]},
          buried:{id:'buried',code:'ENDING / ORIGIN SEALED',title:'닫힌 출발선',tone:'contained',status:'OUTBOUND SHAFT SEALED',summary:'원신호 회랑과 먼저 도착한 팀은 붕괴 구역 아래에 남았다. 현재 팀 네 명은 견인선을 따라 귀환했지만, 누구도 지하에서 본 자신의 얼굴을 설명하지 못한다.',consequence:'다섯 번째 신호는 멎었고 전진 회수선은 영구 봉쇄됐다. 검문소 07 지하에서는 매일 08시 22분에 네 번의 구조 타격음이 들린다.'},
          relay:{id:'relay',code:'ENDING / OPERATOR RELAY',title:'다섯 번째 중계자',tone:'hostile',status:'OPERATOR RELAY / SIGNAL CONTINUES',summary:'현장에 있던 여덟 명은 모두 지상으로 돌아왔다. 대신 단말 운영자 계정이 원신호 중계기에 등록됐고, 데드존 전역의 구조 신호가 같은 목소리로 바뀌었다.',consequence:'검문소의 문은 닫혀 있지만 승인 요청은 계속 들어온다. 현재 단말을 끄면 가장 가까운 다른 단말에서 같은 세션이 이어진다.',variants:[{when:{all:['answer-elevator','read-roster','full-identification']},title:'처음부터 있던 중계자',status:'OPERATOR RELAY / PRE-EXISTING',summary:'중계 승인을 누르자 새 연결은 만들어지지 않았다. 검문소 06의 열아홉 해 전 기록과 지하 주거지의 다섯 번째 집, 원신호 송신기가 모두 같은 운영자 세션을 이미 사용하고 있었다.',consequence:'현장 인원은 귀환했지만 현재 단말은 중계망의 시작점이 아니라 가장 최근에 열린 출구로 판정됐다. 어느 단말이 최초 중계점인지는 확인할 수 없다.'}]}
        }
      }
    }
  });
})(window);
