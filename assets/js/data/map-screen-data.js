// Project Curse 6 — 옛 지도·작전·판정 모듈의 설정 원문. 화면 안내는 copy에서 따로 다룬다.
(function(root){
'use strict';
  const canonBoundary=Object.freeze({
    status:'CENTRAL RECORD UNCHANGED',
    scope:'이 판정은 이 단말에만 남는 현장 지휘 사본이다. 중앙 연표와 뒤따르는 작전 명령에는 효력이 없다.',
    fixedFacts:Object.freeze([
      '2030년 1월 17일, 남방 쿠데타와 도시 집단 소환을 막으려는 부서진 왕관 작전이 시작됐다.',
      '성위대 지휘망 침투와 여러 도시의 소환 반응이 같은 시간대에 관측됐다.',
      '성위대 지휘관이 혈맹 특수부대 출신이라는 기록과, 그가 살아 있으면 처형하라는 명령문이 함께 회수됐다.',
      '처형 명령을 마지막에 보낸 사람, 지휘관이 실제로 누구에게 충성하는지, 작전의 최종 승패는 확정되지 않았다.'
    ]),
    pendingFacts:Object.freeze([
      '성위대 지휘관이 살았는지, 처형·구금됐는지, 협력했는지',
      '도시 소환진과 제3 발신자의 최종 상태',
      '전쟁 뒤 남방 혈맹 강경파의 지휘권',
      '데드존 혈교가 남방 세력과 오래 협력할지, 다시 그 아래로 들어갈지'
    ]),
    lineageGuard:'어느 선택도 남방 혈맹을 혈교의 확정된 후계로 만들지 않는다. 데드존 혈교를 혈맹 지휘 아래로 다시 넣지도 않는다. 표식·의식이 같거나 잠깐 교신했다고 해서 같은 지휘 계보라는 증거가 되지는 않는다.'
  });
  const decisions={
    execute:{
      id:'execute',code:'LOCAL-EXECUTE',title:'지휘관 즉시 처형',status:'LOCAL EXECUTION LOGGED',tone:'failed',scope:'local-command-verdict',canonEffect:'none',lineageEffect:'none',
      summary:'현장 지휘부는 더 확인하지 않고 회수된 처형 명령을 집행했다. 이 기록은 이 작전 사본의 판단일 뿐, 지휘관의 공식 사망 기록을 확정하지 않는다.',
      observed:'현장 부대가 지휘관 신호를 없앤 뒤, 인증키와 내부 동조자를 쫓던 선이 끊겼다.',
      immediate:'이 작전 지도에서 성위대 지휘망은 무너진 상태로, 도시 소환진 한 곳은 다시 살아난 상태로 표시된다.',
      unresolved:'처형 명령을 처음 보낸 사람과 지휘관의 실제 충성은 확인되지 않았다. 혈맹 강경파가 전쟁 뒤 지휘권을 잡았다는 결론도 승인되지 않았다.',
      consequence:'지금 지도 사본에서 지휘망이 무너진 일과 소환진이 다시 살아날 위험을 쫓는다. 혈맹 전체의 권력을 누가 이어받을지는 정해지지 않았다.',
      directive:'남은 성위대의 무장을 해제하고 도시권 철수 회랑을 확보한다. 처형 명령이 진짜인지는 따로 조사선을 열어 남긴다.',
      route:[[568,228],[414,292],[246,374]],siteStates:['secured','hostile','active','lost','active','unknown'],
      stepStates:['complete','complete','complete','altered','failed','complete']
    },
    detain:{
      id:'detain',code:'LOCAL-DETAIN',title:'지휘관 확보 및 심문',status:'LOCAL CUSTODY LOGGED',tone:'contained',scope:'local-command-verdict',canonEffect:'none',lineageEffect:'none',
      summary:'현장 지휘부는 지휘관을 격리하고 암호키를 지키는 절차를 골랐다. 이 기록은 지휘관의 공식 생존·구금 기록을 확정하지 않는다.',
      observed:'현장 사본에는 지휘관 신호와 암호키, 내부 동조자 후보 명단이 호송 대상으로 올랐다.',
      immediate:'이 작전 지도에서 심문 채널이 열리고, 두 번째 소환진은 덜 막힌 상태로 표시된다.',
      unresolved:'지휘관이 혈맹 명령을 거스른 것인지, 더 깊이 숨어들려고 협조한 것인지는 판단할 수 없다.',
      consequence:'지금 지도 사본에는 제3 발신자를 쫓는 선과, 호송 중 공격받을 위험을 함께 남겨 둔다.',
      directive:'지휘관을 해안 감청소로 옮기고, 데드존 교신 좌표와 암호키를 서로 맞춰 확인한다.',
      route:[[568,228],[414,292],[94,426]],siteStates:['secured','contained','secured','contained','active','unknown'],
      stepStates:['complete','complete','complete','complete','altered','complete']
    },
    cooperate:{
      id:'cooperate',code:'LOCAL-COOPERATE',title:'처형 명령 무시·공동 대응',status:'LOCAL COOPERATION LOGGED',tone:'allied',scope:'local-command-verdict',canonEffect:'none',lineageEffect:'none',
      summary:'현장 지휘부는 처형 명령을 미루고, 지휘관과 함께 잠시 도시 연결부를 막았다. 이것은 이 작전 안에서의 협조일 뿐, 정식 동맹을 뜻하지 않는다.',
      observed:'현장 사본에서 성위대와 합동팀이 움직인 길이 겹쳤고, 데드존 경고 좌표와 맞는 연결부가 막혔다.',
      immediate:'이 작전 지도에서 소환진 두 곳이 멈추고, 허가받지 않은 정보 교환로가 열린 것으로 표시된다.',
      unresolved:'혈맹 강경파가 드러내 놓고 적이 될지, 지휘관이 오래 충성할지, 데드존 혈교가 공식으로 가담할지는 확정되지 않았다.',
      consequence:'지금 지도 사본에 공동 차단선과 허가받지 않은 교신을 표시한다. 데드존 혈교가 혈맹이나 U.A.C 지휘 아래로 들어간 것은 아니다.',
      directive:'함께 대응한 사실은 이 작전에서만 쓰는 기록으로 봉인한다. 데드존 경고 좌표는 따로 떨어진 출처로 계속 확인한다.',
      route:[[568,228],[414,292],[735,170]],siteStates:['secured','hostile','secured','allied','secured','contested'],
      stepStates:['complete','complete','complete','complete','altered','complete']
    },
    defer:{
      id:'defer',code:'LOCAL-DEFERRED',title:'판단 보류',status:'LOCAL DECISION DEFERRED',tone:'pending',scope:'local-command-verdict',canonEffect:'none',lineageEffect:'none',
      summary:'현장 지휘부는 교신이 더 들어올 때까지 처형·구금·협력을 모두 미뤘다. 이 판정은 정해지지 않은 상태를 그대로 둔다.',
      observed:'지휘관 신호와 인증키는 남아 있다. 그러나 현장 부대는 어느 명령도 끝까지 집행하지 않았다.',
      immediate:'이 작전 지도에서 지휘망과 소환 반응, 철수 회랑은 모두 진행 중이거나 다투는 상태로 남는다.',
      unresolved:'지휘관의 운명, 제3 발신자, 쿠데타의 승패, 혈교 계보의 변화는 모두 나중에 승인할 일로 남는다.',
      consequence:'지금 지도 사본에서는 핵심 신호를 모두 결정되지 않은 상태로 둔다. 중앙 연표는 바꾸지 않는다.',
      directive:'북부 교란선과 데드존 교신을 더 회수한 뒤 지휘 판단을 다시 한다.',
      route:[[568,228],[880,118]],siteStates:['secured','hostile','active','unknown','active','contested'],
      stepStates:['complete','complete','complete','complete','active','locked']
    }
  };

    const theaters=[
      {
        id:'north',number:'01',eyebrow:'NORTHERN FRONT',title:'북부전선',
        status:'전선 신호 증가',confidence:'관측 신뢰도 78%',tone:'front',
        summary:'도쿄 감시권과 란저우 레드존 너머에서 일본 동맹권과 짐승의 길이 맞부딪친다.',
        note:'도시 감시 · 복제 구조신호 · 연속 차단선',target:{kind:'detail',id:'eastasia-northern-front'}
      },
      {
        id:'forest',number:'02',eyebrow:'GREAT BLACK FOREST',title:'대흑림',
        status:'공간 측량 불가',confidence:'지도 신뢰도 31%',tone:'forest',
        summary:'성채와 마을은 남아 있다. 그러나 길의 거리와 정착지 좌표가 잴 때마다 달라진다.',
        note:'순례 경로 · 검은 강 · 불빛 없는 성채',target:{kind:'region',id:'southamerica'}
      },
      {
        id:'deadzone',number:'03',eyebrow:'THE DEAD ZONE',title:'데드존',
        status:'내륙 응답 없음',confidence:'지도 신뢰도 22%',tone:'dead',
        summary:'옛 나라 지도와 지금의 귀환 기록이 맞지 않는다. 돌아온 사람도 증거가 되지 못한다.',
        note:'귀환 검문 · 사라진 내륙 · 봉쇄된 구조 신호',target:{kind:'region',id:'northamerica'}
      },
      {
        id:'south',number:'04',eyebrow:'OPERATION BROKEN CROWN',title:'남방 쿠데타',
        status:'CRITICAL / PARTIAL',confidence:'부분 감청',tone:'coup',
        summary:'남방 해안의 집단 소환과 성위대 침투가 한 작전으로 모여든다. 지휘 계통은 이미 오염됐다.',
        note:'특수부대 · 도시 소환 · 남방 해안 동원',target:{kind:'detail',id:'gbf-coastal-belt'}
      }
    ];

    const cityMapPositions=Object.freeze({
      karven:Object.freeze({x:480,y:80,region:'europe'}),
      maroa:Object.freeze({x:480,y:480,region:'southamerica'}),
      tama:Object.freeze({x:977,y:260,region:'eastasia'}),
      // 2026-11-22 넷째 도시 — 베스카 격리선 밖. 베스카의 정확한 위치는 정하지 않았으므로 유럽 권역 동쪽 대략 위치
      ostal:Object.freeze({x:690,y:110,region:'europe'})
    });

    const scenarioStageByItem={
      'gbf-west-observation':['unlit-fortress',0],'monsur-church':['unlit-fortress',1],'gbf-monsur-chapel':['unlit-fortress',1],'gbf-duel-ground':['unlit-fortress',2],'black-river':['unlit-fortress',3],'gbf-black-river':['unlit-fortress',3],'gbf-blood-lake':['unlit-fortress',4],'unlit-fortress':['unlit-fortress',5],'gbf-unlit-fortress':['unlit-fortress',5],
      'returned-coast':['deadzone-return',0],'dead-return-shore':['deadzone-return',0],'dead-checkpoint-07':['deadzone-return',1],'dead-quarantine-ring':['deadzone-return',4],
      'dead-interior':['deadzone-recovery',0],'dead-sublevel-08':['deadzone-recovery',0],'dead-checkpoint-06':['deadzone-recovery',1],'dead-reverse-highway':['deadzone-recovery',3],'dead-origin-beacon':['deadzone-recovery',4]
    };

function markerDetails(){
      const map={
        'tokyo':'eastasia-northern-front','lanzhou':'eastasia-northern-front','northern-front':'eastasia-northern-front',
        'blood-lake-site':'europe-north-sea-blockade','fhc-europe':'europe-north-sea-blockade',
        'gbf-core':'gbf-inner-refuges','monsur-church':'gbf-western-marches','unlit-fortress':'gbf-western-marches','black-river':'gbf-western-marches','southern-coast':'gbf-coastal-belt',
        'dead-interior':'deadzone-return-corridor','returned-coast':'deadzone-return-corridor','former-us-branch':'deadzone-kingdom-graves'
      };

return map;
}
function verdictDocument(entry,scenario,ending,snapshot,choiceRows,metricRows){
const id=entry.id;
    return {
      sourceId:id,scenarioId:entry.scenarioId,unlockScenario:entry.unlockScenario||null,presentation:'verdict',theme:entry.theme,code:entry.code,title:entry.title,
      summary:entry.summary,date:new Date(snapshot.unlockedAt).toLocaleString('ko-KR'),owner:'U.A.C 현장 판정 보관소',classification:'단말 보관 판정·중앙 기록 미승인',
      telemetry:[['판정 상태',ending.status],['선택 기록',`${choiceRows.length} / ${scenario.stages.length}`],['규칙 위반',`${snapshot.violations}회`],['읽음 상태',entry.unread?'새 기록':'확인함']],
      sections:[
        {title:'판정 요약',record:{code:'FIELD VERDICT',type:'현장 판정자 제출 사본',author:'현재 단말 현장 판정 저장소',recipient:'단말 관제 기록',evidence:'저장된 선택·측정값',limit:scenario.canonBoundary},paragraphs:[entry.summary,ending.summary],warning:`단말 관제 결과: ${ending.consequence} ${scenario.canonBoundary}`},
        {title:'현장 선택 기록',paragraphs:['아래 내용은 최종 판정이 내려진 순간의 선택 기록이다. 이후 작전을 다시 시작해도 이 사본은 바뀌지 않는다.'],table:{headers:['단계','현장','선택한 행동','규칙 판정'],rows:choiceRows}},
        {title:'최종 측정값',paragraphs:['수치는 현장 판정이 끝난 시점의 값이다. 서로 다른 시점의 결과를 직접 비교할 때는 선택 기록도 함께 확인한다.'],table:{headers:['항목','최종 값'],rows:metricRows}},
        {title:'분석과 후속 조치',paragraphs:[entry.finding,entry.directive],quote:entry.hidden}
      ]
    };
}
root.ProjectCurseMapScreenData=Object.freeze({
 canonBoundary, decisions:Object.freeze(decisions), theaters, cityMapPositions, scenarioStageByItem, markerDetails:markerDetails(), verdictDocument,
 display:Object.freeze({yearMin:1975,yearMax:2042,yearStepMs:1100,zoomMax:6,signalGapMs:42000,signalLossMs:3400}),
 copy:{
 timeline:'고른 해까지 날짜가 확인된 기록을 표시합니다. 연도를 알 수 없는 기록은 점선으로 남습니다.',
 timelineUnknown:'연도 알 수 없음',
 mapControls:'휠·두 손가락으로 확대, 끌어서 이동. 지도에 초점을 두고 + / − / 0 / 방향키로도 조작합니다.',
 signalBoundary:'짧은 선은 각 관측 지점의 신호입니다. 지점 사이의 통로를 뜻하지 않습니다.',
 noPhoto:'연결된 현장 사진 없음',
 navigation:'표시 좌표는 길을 찾는 데 쓰지 않는다. 신뢰도와 서로 맞지 않는 기록을 함께 확인한다.',
 withheld:'위치 공개 보류는 사건이 없었다는 뜻이 아니다. 지도에 표시할 지점이 승인되지 않아 위치로 이동할 수 없다.',
 index:'지도 지점, 작전, 독립 관측, 위치 공개가 보류된 기록을 함께 찾는다.',
 intro:'지도는 세계를 설명하지 않는다. 남아 있는 신호와 돌아오지 못한 사람들의 경로만 표시한다.',
 archive:'직접 확인한 결과만 열린다. 마지막 판정을 내린 순간의 선택과 측정값은 원본 기록과 따로 판정 기록에 남는다.',
 archiveManage:'지금 하던 작전을 처음으로 되돌려도 여기 남긴 판정 기록은 그대로 있다. 아래 작업은 판정 보관소에만 적용된다.'
 }
});
})(window);
