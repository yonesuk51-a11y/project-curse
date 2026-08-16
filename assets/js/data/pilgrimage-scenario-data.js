// Project Curse 5.23.1 — reusable pilgrimage scenario data, starting with the unlit fortress.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCursePilgrimageData=freeze({
    version:'1.0.0',
    scenarios:{
      'unlit-fortress':{
        id:'unlit-fortress',code:'PILGRIMAGE / GBF-07',title:'불빛 없는 성채',region:'남미 대흑림 · 서부 순례 회랑',
        summary:'몬수르 서부 교회가 맡긴 작은 종을 운반하고, 불빛 없는 성채의 구조 신호가 실제 생존자에게서 나온 것인지 확인한다.',
        directive:'현상과의 접촉을 최소화하되, 도움 요청에는 성채 바깥에서 응답한다.',
        records:['Great_Black_Forest_Region','Pilgrim_Rules_GBF'],operation:'op-unlit-fortress',incident:'evt-gbf-unlit',
        map:{viewBox:'0 0 900 420',points:[[66,346],[205,282],[347,219],[477,267],[603,188],[742,118]],labels:['외곽 관측소','몬수르 교회','결투 지점','검은 강','피의 호수','불빛 없는 성채']},
        stages:[
          {
            id:'observation',code:'TRACE 01',time:'16:10',title:'서부 외곽 관측소',location:'경계선 03 / 정상 거리',
            narrative:'조사팀 네 명의 장비와 생체 신호가 일치한다. 숲 안쪽에서는 존재하지 않는 다섯 번째 호출 부호가 간헐적으로 응답한다.',
            signal:'T-01 / 4 PERSONNEL / EXTRA CARRIER DETECTED',rule:{code:'PREP',text:'고유 장비와 봉인물을 출발 전에 검사한다.'},
            choices:[
              {id:'seal-check',label:'봉인과 장비를 재검사한다',description:'속도를 늦추고 종과 무기의 결속 흔적을 확인한다.',tone:'safe',deltas:{fear:-3,corruption:-2,signal:8},ruleOutcome:'kept'},
              {id:'follow-carrier',label:'다섯 번째 신호를 추적한다',description:'경로 밖의 호출 부호를 짧게 따라가 흔적을 채집한다.',tone:'risk',deltas:{fear:8,corruption:5,signal:-6},ruleOutcome:'broken'}
            ]
          },
          {
            id:'monsur',code:'TRACE 02',time:'16:43',title:'몬수르 서부 교회',location:'서부 회랑 / 불완전 교신',
            narrative:'시간에 잊힌 교회가 작은 종을 내민다. 종을 성채 문 앞에 두고 세 번 울려 달라는 부탁이다. 대가에 관한 질문에는 누구도 답하지 않는다.',
            signal:'LIFE COUNT 05 / VISUAL COUNT 04',rule:{code:'RULE 01',text:'낡고 잊힌 교단이 도움을 청하면 거절하지 않는다.'},
            choices:[
              {id:'accept-bell',label:'종을 인계받는다',description:'요청을 수락하고 종을 격리함에 봉인한다.',tone:'safe',deltas:{fear:4,corruption:3,signal:6},ruleOutcome:'kept'},
              {id:'refuse-bell',label:'종을 받지 않고 좌표만 요구한다',description:'의식 계약을 피하지만 교회의 보호 표식도 받지 못한다.',tone:'risk',deltas:{fear:9,corruption:7,signal:-9},ruleOutcome:'broken'}
            ]
          },
          {
            id:'duel',code:'TRACE 03',time:'17:18',title:'귀환자의 결투',location:'옛 전장 외곽 / 인원 불일치',
            narrative:'반대편에서 돌아오는 순례자가 길을 막고 결투를 요구한다. 영상 프레임마다 그의 얼굴과 무기가 바뀌지만, 발밑 그림자는 하나다.',
            signal:'RETURNED PILGRIM / ID UNRESOLVED',rule:{code:'RULE 02',text:'순례에서 돌아오는 자의 결투 요청을 거절하지 않는다.'},
            choices:[
              {id:'ritual-duel',label:'증언 교환 형식의 결투를 수락한다',description:'무기를 뽑지 않고 서로의 귀환 경로를 한 문장씩 증언한다.',tone:'safe',deltas:{fear:5,corruption:2,signal:10},ruleOutcome:'kept'},
              {id:'evade-duel',label:'무응답 상태로 우회한다',description:'교전을 피하지만 귀환자가 남긴 표식이 뒤를 따라온다.',tone:'risk',deltas:{fear:12,corruption:8,signal:-8},ruleOutcome:'broken'}
            ]
          },
          {
            id:'black-river',code:'TRACE 04',time:'18:06',title:'검은 강 제4관측점',location:'거리 오차 +3.7km / 통신 저하',
            narrative:'강둑에는 조사팀과 동일한 일련번호의 장비가 놓여 있다. 물은 빛을 반사하지 않고, 건너편의 조사팀이 현재 행동을 수 초 늦게 반복한다.',
            signal:'DUPLICATE EQUIPMENT / BANK PROXIMITY WARNING',rule:{code:'RULE 09',text:'강물이 검다면 강둑에 접근하지 않는다.'},
            choices:[
              {id:'keep-distance',label:'강둑에서 물러나 종으로 거리를 측정한다',description:'울림이 사라지는 방향을 피해 상류의 마른 지대를 찾는다.',tone:'safe',deltas:{fear:5,corruption:-1,signal:4},ruleOutcome:'kept'},
              {id:'recover-duplicate',label:'동일 일련번호 장비를 회수한다',description:'검은 수면 가까이 접근해 장비와 기억카드를 확보한다.',tone:'danger',deltas:{fear:14,corruption:16,signal:-12},ruleOutcome:'broken'}
            ]
          },
          {
            id:'blood-lake',code:'TRACE 05',time:'18:29',title:'피의 호수',location:'북부 전사자 장비 신호 / 시간 불명',
            narrative:'호수 주변에는 서로 다른 시대와 전선의 장비가 놓여 있다. 남방 특수부대 표식 사이에서 아직 켜진 송신기가 전사자들의 호출 부호를 반복한다.',
            signal:'MEMORIAL RESPONSE / HOSTILE TRACE NEARBY',rule:{code:'RULE 06',text:'피의 호수에서는 전사자에게 예를 표한다.'},
            choices:[
              {id:'pay-respect',label:'무기를 내리고 전사자의 호출 부호를 읽는다',description:'종을 한 번 울리고 장비를 원래 위치에 둔다.',tone:'safe',deltas:{fear:-2,corruption:-4,signal:9},ruleOutcome:'kept'},
              {id:'take-transmitter',label:'작동 중인 송신기를 회수한다',description:'남방 교신을 추적하기 위해 추모 배열을 해체한다.',tone:'danger',deltas:{fear:10,corruption:13,signal:4},ruleOutcome:'broken'}
            ]
          },
          {
            id:'fortress',code:'TRACE 06',time:'18:51',title:'불빛 없는 성채',location:'무광 외벽 / 내부 생활 소음 확인',
            narrative:'성채에는 불빛이 없지만 안쪽에서 식기와 발걸음 소리가 들린다. 구조 요청은 문 안이 아니라 조사팀의 무전기에서 나온다. 종은 아직 울리지 않았는데 성문이 조금씩 열린다.',
            signal:'NO LIGHT / OCCUPIED INTERIOR / ROUTE CLOSING',rule:{code:'RULE 07',text:'불빛 없는 옛 전장과 성채를 피하고, 도움 요청에는 바깥에서 응답한다.'},
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
      }
    }
  });
})(window);
