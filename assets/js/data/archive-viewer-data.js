// 기존 기록보관소의 화면 문구와 현장 작전 정의다. 설정 문장은 추가하지 않는다.
(function(root){
  'use strict';
  const chapters=[
    {index:'01',range:'아마리온–피의 호수',title:'금기를 사업으로 바꾸다',summary:'공간 개척 사업과 피의 호수 작전에는, 이상한 현상을 막기보다 자원으로 쓰려 했던 시기의 흔적이 남아 있다.',ids:['Unknown_Record1_860204','Immortality_860201','Unknown_Record2_860205']},
    {index:'02',range:'괴이–구역–교단',title:'위협에 이름을 붙이다',summary:'괴이와 위험 구역, 교단의 의식에 이름을 붙여 나누자, 흩어져 있던 피해가 하나의 세계적 위협으로 묶이기 시작했다.',ids:['Ferals_860722','Zone_870815','Cults_871104']},
    {index:'03',range:'이탈–유통–실종',title:'기관이 서로를 배신하다',summary:'레드울프의 이탈, 허가받지 않은 무기의 유통, 사쿠마의 실종은 대응기관 안쪽이 이미 갈라지고 있었다는 것을 보여 준다.',ids:['Unknown_Record3_920711','Unknown_Record4_930314','Sakuma_Tape_991028']},
    {index:'04',range:'대흑림–데드존–도시권',title:'국가 이후의 생존',summary:'대흑림과 데드존, 도시권에서는 나라 대신 성채와 검문소, 순례자와 학교가 빈틈 많은 규칙으로 사람을 살려 두었다.',ids:['Great_Black_Forest_Region','Pilgrim_Rules_GBF','Dead_Zone_Pilgrimage','Civil_Child_Drill','Returner_Note_West']},
    {index:'05',range:'남방 작전',title:'남방 전쟁이 모이다',summary:'갈라진 교단과 특수부대, 집단 소환 계획이 하나의 쿠데타 작전으로 모여든다.',ids:['Operation_Broken_Crown']}
  ];
  const operation={
  "operationId": "op-southern-coup",
  "storageKey": "pc_operation_broken_crown_v1",
  "branchIds": [
    "signal",
    "witness",
    "deadzone"
  ],
  "canonBoundary": {
    "status": "CENTRAL RECORD UNCHANGED",
    "scope": "이 판정은 이 단말에만 남는 현장 지휘 사본이다. 중앙 연표와 뒤따르는 작전 명령에는 효력이 없다.",
    "fixedFacts": [
      "2030년 1월 17일, 남방 쿠데타와 도시 집단 소환을 막으려는 부서진 왕관 작전이 시작됐다.",
      "성위대 지휘망 침투와 여러 도시의 소환 반응이 같은 시간대에 관측됐다.",
      "성위대 지휘관이 혈맹 특수부대 출신이라는 기록과, 그가 살아 있으면 처형하라는 명령문이 함께 회수됐다.",
      "처형 명령을 마지막에 보낸 사람, 지휘관이 실제로 누구에게 충성하는지, 작전의 최종 승패는 확정되지 않았다."
    ],
    "pendingFacts": [
      "성위대 지휘관이 살았는지, 처형·구금됐는지, 협력했는지",
      "도시 소환진과 제3 발신자의 최종 상태",
      "전쟁 뒤 남방 혈맹 강경파의 지휘권",
      "데드존 혈교가 남방 세력과 오래 협력할지, 다시 그 아래로 들어갈지"
    ],
    "lineageGuard": "어느 선택도 남방 혈맹을 혈교의 확정된 후계로 만들지 않는다. 데드존 혈교를 혈맹 지휘 아래로 다시 넣지도 않는다. 표식·의식이 같거나 잠깐 교신했다고 해서 같은 지휘 계보라는 증거가 되지는 않는다."
  },
  "decisions": {
    "execute": {
      "id": "execute",
      "code": "LOCAL-EXECUTE",
      "title": "지휘관 즉시 처형",
      "status": "LOCAL EXECUTION LOGGED",
      "tone": "failed",
      "scope": "local-command-verdict",
      "canonEffect": "none",
      "lineageEffect": "none",
      "summary": "현장 지휘부는 더 확인하지 않고 회수된 처형 명령을 집행했다. 이 기록은 이 작전 사본의 판단일 뿐, 지휘관의 공식 사망 기록을 확정하지 않는다.",
      "observed": "현장 부대가 지휘관 신호를 없앤 뒤, 인증키와 내부 동조자를 쫓던 선이 끊겼다.",
      "immediate": "이 작전 지도에서 성위대 지휘망은 무너진 상태로, 도시 소환진 한 곳은 다시 살아난 상태로 표시된다.",
      "unresolved": "처형 명령을 처음 보낸 사람과 지휘관의 실제 충성은 확인되지 않았다. 혈맹 강경파가 전쟁 뒤 지휘권을 쥐었다는 결론도 승인되지 않았다.",
      "consequence": "지금 지도 사본에서 지휘망이 무너진 일과 소환진이 다시 살아날 위험을 쫓는다. 혈맹 전체의 권력을 누가 이어받을지는 정해지지 않았다.",
      "directive": "남은 성위대의 무장을 해제하고 도시권 철수 회랑을 확보한다. 처형 명령이 진짜인지는 따로 조사선을 열어 남긴다.",
      "route": [
        [
          568,
          228
        ],
        [
          414,
          292
        ],
        [
          246,
          374
        ]
      ],
      "siteStates": [
        "secured",
        "hostile",
        "active",
        "lost",
        "active",
        "unknown"
      ],
      "stepStates": [
        "complete",
        "complete",
        "complete",
        "altered",
        "failed",
        "complete"
      ]
    },
    "detain": {
      "id": "detain",
      "code": "LOCAL-DETAIN",
      "title": "지휘관 확보 및 심문",
      "status": "LOCAL CUSTODY LOGGED",
      "tone": "contained",
      "scope": "local-command-verdict",
      "canonEffect": "none",
      "lineageEffect": "none",
      "summary": "현장 지휘부는 지휘관을 격리하고 암호키를 지키는 절차를 골랐다. 이 기록은 지휘관의 공식 생존·구금 기록을 확정하지 않는다.",
      "observed": "현장 사본에는 지휘관 신호와 암호키, 내부 동조자 후보 명단이 호송 대상으로 올랐다.",
      "immediate": "이 작전 지도에서 심문 채널이 열리고, 두 번째 소환진은 덜 막힌 상태로 표시된다.",
      "unresolved": "지휘관이 혈맹 명령을 거스른 것인지, 더 깊이 숨어들려고 협조한 것인지는 판단할 수 없다.",
      "consequence": "지금 지도 사본에는 제3 발신자를 쫓는 선과, 호송 중 공격받을 위험을 함께 남겨 둔다.",
      "directive": "지휘관을 해안 감청소로 옮기고, 데드존 교신 좌표와 암호키를 서로 맞춰 확인한다.",
      "route": [
        [
          568,
          228
        ],
        [
          414,
          292
        ],
        [
          94,
          426
        ]
      ],
      "siteStates": [
        "secured",
        "contained",
        "secured",
        "contained",
        "active",
        "unknown"
      ],
      "stepStates": [
        "complete",
        "complete",
        "complete",
        "complete",
        "altered",
        "complete"
      ]
    },
    "cooperate": {
      "id": "cooperate",
      "code": "LOCAL-COOPERATE",
      "title": "처형 명령 무시·공동 대응",
      "status": "LOCAL COOPERATION LOGGED",
      "tone": "allied",
      "scope": "local-command-verdict",
      "canonEffect": "none",
      "lineageEffect": "none",
      "summary": "현장 지휘부는 처형 명령을 미루고, 지휘관과 함께 잠시 도시 연결부를 막았다. 이것은 이 작전 안에서의 협조일 뿐, 정식 동맹을 뜻하지 않는다.",
      "observed": "현장 사본에서 성위대와 합동팀이 움직인 길이 겹쳤고, 데드존 경고 좌표와 맞는 연결부가 막혔다.",
      "immediate": "이 작전 지도에서 소환진 두 곳이 멈추고, 허가받지 않은 정보 교환로가 열린 것으로 표시된다.",
      "unresolved": "혈맹 강경파가 드러내 놓고 적이 될지, 지휘관이 오래 충성할지, 데드존 혈교가 공식으로 가담할지는 확정되지 않았다.",
      "consequence": "지금 지도 사본에 공동 차단선과 허가받지 않은 교신을 표시한다. 데드존 혈교가 혈맹이나 U.A.C 지휘 아래로 들어간 것은 아니다.",
      "directive": "함께 대응한 사실은 이 작전에서만 쓰는 기록으로 봉인한다. 데드존 경고 좌표는 따로 떨어진 출처로 계속 확인한다.",
      "route": [
        [
          568,
          228
        ],
        [
          414,
          292
        ],
        [
          735,
          170
        ]
      ],
      "siteStates": [
        "secured",
        "hostile",
        "secured",
        "allied",
        "secured",
        "contested"
      ],
      "stepStates": [
        "complete",
        "complete",
        "complete",
        "complete",
        "altered",
        "complete"
      ]
    },
    "defer": {
      "id": "defer",
      "code": "LOCAL-DEFERRED",
      "title": "판단 보류",
      "status": "LOCAL DECISION DEFERRED",
      "tone": "pending",
      "scope": "local-command-verdict",
      "canonEffect": "none",
      "lineageEffect": "none",
      "summary": "현장 지휘부는 교신이 더 들어올 때까지 처형·구금·협력을 모두 미뤘다. 이 판정은 정해지지 않은 상태를 그대로 둔다.",
      "observed": "지휘관 신호와 인증키는 남아 있다. 그러나 현장 부대는 어느 명령도 끝까지 집행하지 않았다.",
      "immediate": "이 작전 지도에서 지휘망과 소환 반응, 철수 회랑은 모두 진행 중이거나 다투는 상태로 남는다.",
      "unresolved": "지휘관의 운명, 제3 발신자, 쿠데타의 승패, 혈교 계보의 변화는 모두 나중에 승인할 일로 남는다.",
      "consequence": "지금 지도 사본에서는 핵심 신호를 모두 결정되지 않은 상태로 둔다. 중앙 연표는 바꾸지 않는다.",
      "directive": "북부 교란선과 데드존 교신을 더 회수한 뒤 지휘 판단을 다시 한다.",
      "route": [
        [
          568,
          228
        ],
        [
          880,
          118
        ]
      ],
      "siteStates": [
        "secured",
        "hostile",
        "active",
        "unknown",
        "active",
        "contested"
      ],
      "stepStates": [
        "complete",
        "complete",
        "complete",
        "complete",
        "active",
        "locked"
      ]
    }
  }
};
  function verdictDocument(entry,scenario,snapshot,ending,resolveStage){
    const id=entry.id;
    const choiceRows=snapshot.choices.map((saved,index)=>{
      const stageIndex=scenario.stages.findIndex(item=>item.id===saved.stage);
      const stage=resolveStage(stageIndex)||scenario.stages[stageIndex];
      const choice=stage?.choices.find(item=>item.id===saved.choice);
      return [String(index+1).padStart(2,'0'),stage?.title||saved.stage,choice?.label||saved.choice,scenario.outcomeLabels?.[saved.ruleOutcome]||saved.ruleOutcome];
    });
    const metricRows=scenario.metrics.map(metric=>[metric.label,`${snapshot.metrics?.[metric.key]??0}%`]);
    return {
      sourceId:id,scenarioId:entry.scenarioId,unlockScenario:entry.unlockScenario||null,presentation:'verdict',theme:entry.theme,code:entry.code,title:entry.title,
      summary:entry.summary,date:new Date(snapshot.unlockedAt).toLocaleString('ko-KR'),owner:'U.A.C 현장 판정 보관소',classification:'단말 보관 판정·중앙 기록 미승인',
      telemetry:[['판정 상태',ending.status],['선택 기록',`${choiceRows.length} / ${scenario.stages.length}`],['규칙 위반',`${snapshot.violations}회`],['읽음 상태',entry.unread?'새 기록':'확인함']],
      sections:[
        {title:'판정 요약',record:{code:'FIELD VERDICT',type:'현장 판정자 제출 기록',author:'현재 단말 현장 판정 저장소',recipient:'단말 관제 기록',evidence:'저장된 선택·측정값',limit:scenario.canonBoundary},paragraphs:[entry.summary,ending.summary],warning:`단말 관제 결과: ${ending.consequence} ${scenario.canonBoundary}`},
        {title:'현장 선택 기록',paragraphs:['아래 내용은 최종 판정이 내려진 순간의 선택 기록이다. 이후 작전을 다시 시작해도 이 기록은 바뀌지 않는다.'],table:{headers:['단계','현장','선택한 행동','규칙 판정'],rows:choiceRows}},
        {title:'최종 측정값',paragraphs:['수치는 현장 판정이 끝난 시점의 값이다. 서로 다른 시점의 결과를 직접 비교할 때는 선택 기록도 함께 확인한다.'],table:{headers:['항목','최종 값'],rows:metricRows}},
        {title:'분석과 후속 조치',paragraphs:[entry.finding,entry.directive],quote:entry.hidden}
      ]
    };
  }

  root.ProjectCurseArchiveViewerData=Object.freeze({chapters,operation,
  sourceDescriptions:Object.freeze({
    STABILIZED:'원본을 보존한 채 읽기 편하게 보정한 그림',
    UNVERIFIED:'기존 기록에 쓰였지만 원본의 출처가 아직 확인되지 않은 그림'
  }),copy:{
  "indexIntro": "처음에는 따로 떨어진 사건처럼 보였던 기록들이 시간이 지나며 같은 붕괴의 일부로 이어졌다. 위에서부터 차례로 읽으면 금지된 기술의 실험부터 남방 전쟁까지 흐름을 따라갈 수 있다.",
  "verdictIntro": "직접 확인한 결과만 열린다. 마지막 판정을 내린 순간의 선택과 측정값은 원본 기록과 따로 판정 기록에 남는다.",
  "verdictManage": "지금 하던 작전을 처음으로 되돌려도 여기 남긴 판정 기록은 그대로 있다. 아래 작업은 판정 보관소에만 적용된다.",
  "operationPending": "정보 갈래 세 개를 모두 회수해야 현장 지휘 판정을 남길 수 있다.",
  "operationReady": "모든 정보가 복구됐습니다. 중앙 기록을 바꾸지 않는 현장 판정을 고르십시오.",
  "operationSaved": " / 현재 단말 기록에만 저장됨 · 중앙 기록 변화 없음.",
  "mediaIntro": "파일이 있는지, 원본이 어디서 왔는지, 누가 만들었는지, 공개해도 되는지는 따로따로 판정한다. 이 화면은 무엇을 지우거나 승인하지 않는다. 확인할 근거와 실제로 쓰인 곳만 모아 둔다.",
  "mediaFooter": "지옥.zip과 Pictures 묶음은 분위기를 참고하는 데만 쓴다. 파일마다 승인을 받기 전에는 공개 기록, 세력 문양, 증거 그림에 넣지 않는다.",
  "mediaBoundary": [["FILE REGISTERED","파일 지문·크기·쓰인 곳 확인"],["SOURCE IDENTIFIED","누가 만들었고 어디서 왔는지 보여 주는 증거"],["RELEASE PERMISSION","써도 되고 다시 배포해도 된다는 허가 문서"]],
  "mediaEvidenceState": {"CLEARED":"코드로 만든 화면 원본","PROJECT_GENERATED":"만든 기록과 지시서를 남겨 둠","SOURCE_REVIEW":"원본 출처 확인 / 다시 배포해도 되는 범위는 미확인","LICENSE_REVIEW":"만든 사람·원래 출처·허가 증거가 아직 없음"},
  "securityTitle": "F.H.C 제한 기록 / 부분 공개",
  "securityNote": "※ 검열 구간은 원문 일부가 삭제된 상태로 표시된다.",
  "sourceIntro": "현재 문서에 사용된 이미지의 출처 등급을 표시하고, 원본과 맞춰 볼 수 있는지 알려 준다. 복원 추정본은 원본 기록을 대신하지 않는다.",
  "securityFacts": [["보안","F.H.C 제한"],["접근","부분 공개"],["흔적","활성"],["무결성","61%"]],
  "comparisonNote": "비교 경계를 움직여 두 그림의 잘린 부분·색상·빠진 정보를 직접 맞춰 볼 수 있다.",
  "reconstructionNote": "이 그림은 지금 남아 있는 원본이 아니다. 진짜 원본을 손에 넣기 전까지는 기록을 눈으로 이해하는 참고 자료로만 쓴다.",
  "sourceNote": "원본이 어디서 왔는지 다 확인되기 전에는, 이 그림을 다시 그리거나 고칠 때의 기준으로 쓰지 않는다.",
  "centralNoEffect": "없음. 이 판정은 중앙 연표와 혈교 지휘 계보를 바꾸지 않는다."
},verdictDocument});
})(window);
