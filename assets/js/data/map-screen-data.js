// Project Curse 6 — 옛 지도·작전·판정 모듈의 설정 원문. 화면 안내는 copy에서 따로 다룬다.
(function(root){
'use strict';
  const canonBoundary=Object.freeze({
    status:'CENTRAL RECORD UNCHANGED',
    scope:'이 판정은 현재 단말에만 보존되는 현장 지휘 사본이다. 중앙 연표와 후속 작전 명령에는 효력이 없다.',
    fixedFacts:Object.freeze([
      '2030년 1월 17일, 남방 쿠데타와 도시 집단 소환을 저지하기 위한 부서진 왕관 작전이 개시됐다.',
      '성위대 지휘망 침투와 복수 도시의 소환 반응이 같은 시간대에 관측됐다.',
      '성위대 지휘관이 남방 특수부대 출신이라는 기록과, 그가 생존해 있을 경우 처형하라는 명령문이 함께 회수됐다.',
      '처형 명령의 최종 발신자, 지휘관의 실제 충성, 작전의 최종 승패는 확정되지 않았다.'
    ]),
    pendingFacts:Object.freeze([
      '성위대 지휘관의 생존·처형·구금·협력 여부',
      '도시 소환진과 제3 발신자의 최종 상태',
      '남부 혈교 강경파의 전후 지휘권',
      '데드존 혈교와 남방 세력 사이의 장기 협력 또는 재편입 여부'
    ]),
    lineageGuard:'어느 선택도 남부 혈교를 우시노다 중앙 혈교의 확정 후계로 만들지 않으며, 데드존 혈교를 남부 지휘 아래 재편입시키지 않는다. 같은 표식·의식·일시적 교신은 동일한 지휘 계보의 증거가 아니다.'
  });
  const decisions={
    execute:{
      id:'execute',code:'LOCAL-EXECUTE',title:'지휘관 즉시 처형',status:'LOCAL EXECUTION LOGGED',tone:'failed',scope:'local-command-verdict',canonEffect:'none',lineageEffect:'none',
      summary:'현장 지휘부는 추가 검증을 중단하고 회수된 처형 명령을 집행했다. 이 기록은 해당 작전 사본의 판단이며 지휘관의 공식 사망 기록을 확정하지 않는다.',
      observed:'현장 부대가 지휘관 신호를 제거한 뒤 인증키와 내부 동조자 추적선이 끊겼다.',
      immediate:'이 작전 지도에서 성위대 지휘망은 붕괴 상태로, 도시 소환진 한 곳은 재활성 상태로 표시된다.',
      unresolved:'처형 명령의 원 발신자와 지휘관의 실제 충성은 확인되지 않았다. 남부 강경파가 전후 지휘권을 장악했다는 결론도 승인되지 않았다.',
      consequence:'현재 지도 사본에서 지휘망 붕괴와 소환진 재활성 위험을 추적한다. 남부 전체의 권력 승계는 미확정이다.',
      directive:'잔존 성위대의 무장을 해제하고 도시권 철수 회랑을 확보한다. 처형 명령의 진위는 별도 조사선으로 남긴다.',
      route:[[568,228],[414,292],[246,374]],siteStates:['secured','hostile','active','lost','active','unknown'],
      stepStates:['complete','complete','complete','altered','failed','complete']
    },
    detain:{
      id:'detain',code:'LOCAL-DETAIN',title:'지휘관 확보 및 심문',status:'LOCAL CUSTODY LOGGED',tone:'contained',scope:'local-command-verdict',canonEffect:'none',lineageEffect:'none',
      summary:'현장 지휘부는 지휘관을 격리하고 암호키를 보존하는 절차를 선택했다. 이 기록은 지휘관의 공식 생존·구금 기록을 확정하지 않는다.',
      observed:'현장 사본에는 지휘관 신호와 암호키, 내부 동조자 후보 명단이 호송 대상으로 등록됐다.',
      immediate:'이 작전 지도에서 심문 채널이 열리고 두 번째 소환진 차단은 불완전 상태로 표시된다.',
      unresolved:'지휘관이 남방 명령에 불복한 것인지, 더 깊은 침투를 위해 협조한 것인지는 판단할 수 없다.',
      consequence:'현재 지도 사본에서 제3 발신자 추적선과 호송 공격 위험을 함께 유지한다.',
      directive:'해안 감청소로 지휘관을 이송하고 데드존 교신 좌표와 암호키를 교차 검증한다.',
      route:[[568,228],[414,292],[94,426]],siteStates:['secured','contained','secured','contained','active','unknown'],
      stepStates:['complete','complete','complete','complete','altered','complete']
    },
    cooperate:{
      id:'cooperate',code:'LOCAL-COOPERATE',title:'처형 명령 무시·공동 대응',status:'LOCAL COOPERATION LOGGED',tone:'allied',scope:'local-command-verdict',canonEffect:'none',lineageEffect:'none',
      summary:'현장 지휘부는 처형 명령을 보류하고 지휘관과 한시적으로 도시 연결부를 차단했다. 이는 작전 단위의 협조이며 정식 동맹을 뜻하지 않는다.',
      observed:'현장 사본에서 성위대와 합동팀의 이동선이 겹쳤고, 데드존 경고 좌표와 일치하는 연결부가 차단됐다.',
      immediate:'이 작전 지도에서 소환진 두 곳이 정지하고 비인가 정보 교환로가 열린 것으로 표시된다.',
      unresolved:'남부 강경파의 공개 적대, 지휘관의 장기 충성, 데드존 혈교의 공식 가담 여부는 확정되지 않았다.',
      consequence:'현재 지도 사본에 공동 차단선과 비인가 교신을 표시한다. 데드존 혈교가 남부 또는 U.A.C 지휘에 편입된 것은 아니다.',
      directive:'공동 대응 사실을 작전 한정 기록으로 봉인하고 데드존 경고 좌표를 독립 출처로 계속 검증한다.',
      route:[[568,228],[414,292],[735,170]],siteStates:['secured','hostile','secured','allied','secured','contested'],
      stepStates:['complete','complete','complete','complete','altered','complete']
    },
    defer:{
      id:'defer',code:'LOCAL-DEFERRED',title:'판단 보류',status:'LOCAL DECISION DEFERRED',tone:'pending',scope:'local-command-verdict',canonEffect:'none',lineageEffect:'none',
      summary:'현장 지휘부는 추가 교신이 도착할 때까지 처형·구금·협력을 모두 보류했다. 이 판정은 미확정 상태를 보존한다.',
      observed:'지휘관 신호와 인증키는 남아 있으나 현장 부대는 어느 명령도 최종 집행하지 않았다.',
      immediate:'이 작전 지도에서 지휘망과 소환 반응, 철수 회랑이 모두 진행 중 또는 경합 상태로 남는다.',
      unresolved:'지휘관의 운명, 제3 발신자, 쿠데타의 승패와 혈교 계보 변화가 모두 후대 승인 대상으로 남는다.',
      consequence:'현재 지도 사본에서 모든 핵심 신호를 미결 상태로 유지하며 중앙 연표에는 변화를 주지 않는다.',
      directive:'북부 교란선과 데드존 교신을 추가 회수한 뒤 지휘 판단을 재개한다.',
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
        summary:'성채와 마을은 남아 있지만 길의 거리와 정착지 좌표가 관측할 때마다 달라진다.',
        note:'순례 경로 · 검은 강 · 불빛 없는 성채',target:{kind:'region',id:'southamerica'}
      },
      {
        id:'deadzone',number:'03',eyebrow:'THE DEAD ZONE',title:'데드존',
        status:'내륙 응답 없음',confidence:'지도 신뢰도 22%',tone:'dead',
        summary:'과거의 국가 지도와 현재의 귀환 기록이 일치하지 않는다. 돌아온 사람도 증거가 되지 못한다.',
        note:'귀환 검문 · 사라진 내륙 · 봉쇄된 구조 신호',target:{kind:'region',id:'northamerica'}
      },
      {
        id:'south',number:'04',eyebrow:'OPERATION BROKEN CROWN',title:'남부 쿠데타',
        status:'CRITICAL / PARTIAL',confidence:'부분 감청',tone:'coup',
        summary:'남부 해안의 집단 소환과 성위대 침투가 한 작전으로 수렴한다. 지휘 계통은 이미 오염됐다.',
        note:'특수부대 · 도시 소환 · 남방 해안 동원',target:{kind:'detail',id:'gbf-coastal-belt'}
      }
    ];

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
      telemetry:[['판정 상태',ending.status],['선택 기록',`${choiceRows.length} / ${scenario.stages.length}`],['규칙 위반',`${snapshot.violations}회`],['열람 상태',entry.unread?'새 기록':'확인함']],
      sections:[
        {title:'판정 요약',record:{code:'FIELD VERDICT',type:'현장 판정자 제출 사본',author:'현재 단말 현장 판정 저장소',recipient:'단말 관제 기록',evidence:'저장된 선택·측정값',limit:scenario.canonBoundary},paragraphs:[entry.summary,ending.summary],warning:`단말 관제 결과: ${ending.consequence} ${scenario.canonBoundary}`},
        {title:'현장 선택 기록',paragraphs:['아래 내용은 최종 판정이 내려진 순간의 선택 기록이다. 이후 작전을 다시 시작해도 이 사본은 바뀌지 않는다.'],table:{headers:['단계','현장','선택한 행동','규칙 판정'],rows:choiceRows}},
        {title:'최종 측정값',paragraphs:['수치는 현장 판정이 끝난 시점의 값이다. 서로 다른 시점의 결과를 직접 비교할 때는 선택 기록도 함께 확인한다.'],table:{headers:['항목','최종 값'],rows:metricRows}},
        {title:'분석과 후속 조치',paragraphs:[entry.finding,entry.directive],quote:entry.hidden}
      ]
    };
}
root.ProjectCurseMapScreenData=Object.freeze({
 canonBoundary, decisions:Object.freeze(decisions), theaters, scenarioStageByItem, markerDetails:markerDetails(), verdictDocument,
 display:Object.freeze({yearMin:1975,yearMax:2042,yearStepMs:1100,zoomMax:6,signalGapMs:42000,signalLossMs:3400}),
 copy:{
 timeline:'선택한 해까지 날짜가 남은 기록을 표시합니다. 연도 미상은 점선으로 남습니다.',
 timelineUnknown:'연도 미상',
 mapControls:'휠·두 손가락으로 확대, 끌어서 이동. 지도에 초점을 두고 + / − / 0 / 방향키로도 조작합니다.',
 signalBoundary:'짧은 선은 각 관측점의 신호입니다. 지점 사이의 통로를 뜻하지 않습니다.',
 noPhoto:'연결된 현장 사진 없음',
 navigation:'표시 좌표는 길을 찾는 데 쓰지 않는다. 신뢰도와 서로 맞지 않는 기록을 함께 확인한다.',
 withheld:'위치 보류는 사건이 없었다는 뜻이 아니다. 지도에 표시할 지점이 승인되지 않아 위치로 이동할 수 없다.',
 index:'지도 지점, 작전, 독립 관측, 위치가 보류된 기록을 함께 찾는다.',
 intro:'지도는 세계를 설명하지 않는다. 남아 있는 신호와 돌아오지 못한 사람들의 경로만 표시한다.',
 archive:'직접 확인한 결과만 열린다. 최종 판정 순간의 선택과 측정값은 원본 기록과 분리한 판정 사본으로 보존된다.',
 archiveManage:'현재 작전 진행을 초기화해도 여기 보존된 판정 기록은 남는다. 아래 작업은 판정 보관소에만 적용된다.'
 }
});
})(window);
