// 기존 기록보관소의 화면 문구와 현장 작전 정의다. 설정 문장은 추가하지 않는다.
(function(root){
  'use strict';
  const chapters=[
    {index:'01',range:'아마리온–피의 호수',title:'금기를 사업으로 바꾸다',summary:'공간 개척 사업과 피의 호수 작전은 현상을 막기보다 이용할 수 있는 자원으로 보려 했던 시기를 남겼다.',ids:['Unknown_Record1_860204','Immortality_860201','Unknown_Record2_860205']},
    {index:'02',range:'괴이–구역–교단',title:'위협에 이름을 붙이다',summary:'괴이와 위험 구역, 교단의 의식을 분류하면서 흩어진 피해가 하나의 세계적 위협으로 묶이기 시작했다.',ids:['Ferals_860722','Zone_870815','Cults_871104']},
    {index:'03',range:'이탈–유통–실종',title:'기관이 서로를 배신하다',summary:'레드울프의 이탈, 비인가 병기 유통과 사쿠마의 실종은 대응기관 내부의 균열이 이미 진행 중이었음을 보여준다.',ids:['Unknown_Record3_920711','Unknown_Record4_930314','Sakuma_Tape_991028']},
    {index:'04',range:'대흑림–데드존–도시권',title:'국가 이후의 생존',summary:'대흑림과 데드존, 그리고 도시권에서는 국가 대신 성채와 검문소, 순례자와 학교의 불완전한 규칙이 사람을 살려 두었다.',ids:['Great_Black_Forest_Region','Pilgrim_Rules_GBF','Dead_Zone_Pilgrimage','Civil_Child_Drill','Returner_Note_West']},
    {index:'05',range:'남부 작전',title:'남부 전쟁이 모이다',summary:'분열된 교단과 특수부대, 집단 소환 계획이 하나의 쿠데타 작전으로 수렴한다.',ids:['Operation_Broken_Crown']}
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
    "scope": "이 판정은 현재 단말에만 보존되는 현장 지휘 사본이다. 중앙 연표와 후속 작전 명령에는 효력이 없다.",
    "fixedFacts": [
      "2030년 1월 17일, 남방 쿠데타와 도시 집단 소환을 저지하기 위한 부서진 왕관 작전이 개시됐다.",
      "성위대 지휘망 침투와 복수 도시의 소환 반응이 같은 시간대에 관측됐다.",
      "성위대 지휘관이 남방 특수부대 출신이라는 기록과, 그가 생존해 있을 경우 처형하라는 명령문이 함께 회수됐다.",
      "처형 명령의 최종 발신자, 지휘관의 실제 충성, 작전의 최종 승패는 확정되지 않았다."
    ],
    "pendingFacts": [
      "성위대 지휘관의 생존·처형·구금·협력 여부",
      "도시 소환진과 제3 발신자의 최종 상태",
      "남부 혈교 강경파의 전후 지휘권",
      "데드존 혈교와 남방 세력 사이의 장기 협력 또는 재편입 여부"
    ],
    "lineageGuard": "어느 선택도 남부 혈교를 우시노다 중앙 혈교의 확정 후계로 만들지 않으며, 데드존 혈교를 남부 지휘 아래 재편입시키지 않는다. 같은 표식·의식·일시적 교신은 동일한 지휘 계보의 증거가 아니다."
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
      "summary": "현장 지휘부는 추가 검증을 중단하고 회수된 처형 명령을 집행했다. 이 기록은 해당 작전 사본의 판단이며 지휘관의 공식 사망 기록을 확정하지 않는다.",
      "observed": "현장 부대가 지휘관 신호를 제거한 뒤 인증키와 내부 동조자 추적선이 끊겼다.",
      "immediate": "이 작전 지도에서 성위대 지휘망은 붕괴 상태로, 도시 소환진 한 곳은 재활성 상태로 표시된다.",
      "unresolved": "처형 명령의 원 발신자와 지휘관의 실제 충성은 확인되지 않았다. 남부 강경파가 전후 지휘권을 장악했다는 결론도 승인되지 않았다.",
      "consequence": "현재 지도 사본에서 지휘망 붕괴와 소환진 재활성 위험을 추적한다. 남부 전체의 권력 승계는 미확정이다.",
      "directive": "잔존 성위대의 무장을 해제하고 도시권 철수 회랑을 확보한다. 처형 명령의 진위는 별도 조사선으로 남긴다.",
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
      "summary": "현장 지휘부는 지휘관을 격리하고 암호키를 보존하는 절차를 선택했다. 이 기록은 지휘관의 공식 생존·구금 기록을 확정하지 않는다.",
      "observed": "현장 사본에는 지휘관 신호와 암호키, 내부 동조자 후보 명단이 호송 대상으로 등록됐다.",
      "immediate": "이 작전 지도에서 심문 채널이 열리고 두 번째 소환진 차단은 불완전 상태로 표시된다.",
      "unresolved": "지휘관이 남방 명령에 불복한 것인지, 더 깊은 침투를 위해 협조한 것인지는 판단할 수 없다.",
      "consequence": "현재 지도 사본에서 제3 발신자 추적선과 호송 공격 위험을 함께 유지한다.",
      "directive": "해안 감청소로 지휘관을 이송하고 데드존 교신 좌표와 암호키를 교차 검증한다.",
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
      "summary": "현장 지휘부는 처형 명령을 보류하고 지휘관과 한시적으로 도시 연결부를 차단했다. 이는 작전 단위의 협조이며 정식 동맹을 뜻하지 않는다.",
      "observed": "현장 사본에서 성위대와 합동팀의 이동선이 겹쳤고, 데드존 경고 좌표와 일치하는 연결부가 차단됐다.",
      "immediate": "이 작전 지도에서 소환진 두 곳이 정지하고 비인가 정보 교환로가 열린 것으로 표시된다.",
      "unresolved": "남부 강경파의 공개 적대, 지휘관의 장기 충성, 데드존 혈교의 공식 가담 여부는 확정되지 않았다.",
      "consequence": "현재 지도 사본에 공동 차단선과 비인가 교신을 표시한다. 데드존 혈교가 남부 또는 U.A.C 지휘에 편입된 것은 아니다.",
      "directive": "공동 대응 사실을 작전 한정 기록으로 봉인하고 데드존 경고 좌표를 독립 출처로 계속 검증한다.",
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
      "summary": "현장 지휘부는 추가 교신이 도착할 때까지 처형·구금·협력을 모두 보류했다. 이 판정은 미확정 상태를 보존한다.",
      "observed": "지휘관 신호와 인증키는 남아 있으나 현장 부대는 어느 명령도 최종 집행하지 않았다.",
      "immediate": "이 작전 지도에서 지휘망과 소환 반응, 철수 회랑이 모두 진행 중 또는 경합 상태로 남는다.",
      "unresolved": "지휘관의 운명, 제3 발신자, 쿠데타의 승패와 혈교 계보 변화가 모두 후대 승인 대상으로 남는다.",
      "consequence": "현재 지도 사본에서 모든 핵심 신호를 미결 상태로 유지하며 중앙 연표에는 변화를 주지 않는다.",
      "directive": "북부 교란선과 데드존 교신을 추가 회수한 뒤 지휘 판단을 재개한다.",
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
  "indexIntro": "처음에는 한 사건처럼 보였던 기록들이 시간이 지나며 같은 붕괴의 일부로 이어졌다. 위에서 아래로 읽으면 금지 기술의 실험부터 남부 전쟁까지의 흐름을 따라갈 수 있다.",
  "verdictIntro": "직접 확인한 결과만 열린다. 최종 판정 순간의 선택과 측정값은 원본 기록과 분리한 판정 기록으로 보존된다.",
  "verdictManage": "현재 작전 진행을 초기화해도 여기 보존된 판정 기록은 남는다. 아래 작업은 판정 보관소에만 적용된다.",
  "operationPending": "세 정보 경로를 모두 회수해야 현장 지휘 판정을 기록할 수 있다.",
  "operationReady": "모든 정보가 복구됐습니다. 중앙 기록을 바꾸지 않는 현장 판정을 고르십시오.",
  "operationSaved": " / 현재 단말 기록에만 저장됨 · 중앙 기록 변화 없음.",
  "mediaIntro": "파일 존재, 원본 계보, 제작 출처와 공개 허가는 서로 다른 판정이다. 이 화면은 자동 삭제나 승인 없이 확인해야 할 근거와 실제 사용 위치만 정리한다.",
  "mediaFooter": "지옥.zip과 Pictures 계열은 분위기 참고용이다. 개별 파일 승인 전에는 공개 기록, 세력 문양, 증거 이미지로 편입하지 않는다.",
  "mediaBoundary": [["FILE REGISTERED","해시·용량·사용처 확인"],["SOURCE IDENTIFIED","제작자·원출처·계보 증빙"],["RELEASE PERMISSION","라이선스·재배포 허가 문서"]],
  "mediaEvidenceState": {"CLEARED":"코드 기반 인터페이스 마스터","PROJECT_GENERATED":"생성 기록과 브리프 보존","SOURCE_REVIEW":"원본 계보 확인 / 재배포 범위 미확인","LICENSE_REVIEW":"제작자·원출처·허가 증빙 미등록"},
  "securityTitle": "F.H.C 제한 기록 / 부분 공개",
  "securityNote": "※ 검열 구간은 원문 일부가 삭제된 상태로 표시된다.",
  "sourceIntro": "현재 문서에 사용된 이미지의 출처 등급을 표시하고, 원본과 맞춰 볼 수 있는지 알려 준다. 복원 추정본은 원본 기록을 대신하지 않는다.",
  "securityFacts": [["보안","F.H.C 제한"],["접근","부분 공개"],["흔적","활성"],["무결성","61%"]],
  "comparisonNote": "비교 경계를 움직여 두 그림의 잘린 부분·색상·빠진 정보를 직접 맞춰 볼 수 있다.",
  "reconstructionNote": "이 이미지는 현존 원본이 아니다. 실제 원본이 확보되기 전까지 기록의 시각적 참고 자료로만 사용한다.",
  "sourceNote": "원본 계보가 완전히 확인되기 전에는 이 이미지를 재구성이나 보정의 기준본으로 사용하지 않는다.",
  "centralNoEffect": "없음. 이 판정은 중앙 연표와 혈교 지휘 계보를 변경하지 않는다."
},verdictDocument});
})(window);
