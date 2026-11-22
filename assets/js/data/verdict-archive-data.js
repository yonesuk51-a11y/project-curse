// Project Curse 5.33.0 — conditional field-verdict archive definitions and recovery unlock chain.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseVerdictArchiveData=freeze({
    version:'1.0.0',
    records:[
      {
        id:'GBF-VR-01',scenarioId:'unlit-fortress',endingId:'sanctuary',theme:'great-black-forest',
        code:'GBF-VR-01 / OUTSIDE COVENANT',title:'성문 밖의 협정',
        lockedTitle:'대흑림 현장 판정 01',requirement:'「성문 밖의 협정」 결과를 확인하면 열린다.',
        summary:'조사팀은 성채에 들어가지 않고도 구조 요청에 응답했다. 종을 울린 뒤 실종자 두 명이 성문 밖으로 돌아왔다.',
        finding:'성채는 순례자의 규칙을 알고, 규칙을 지킨 사람에게만 조금씩 길을 내주는 것으로 보인다. 다만 안에 사는 사람의 수와 정체는 확인하지 못했다.',
        directive:'서부 회랑을 조건을 단 피난로로 올린다. 다음 조사대도 성문 안으로 들어가지 않는다. 협상은 모두 바깥에서 한다.',
        hidden:'종을 세 번 울린 시각, 조사팀 인원 기록은 네 명에서 잠시 다섯 명으로 바뀌었다. 돌아온 실종자 두 명은 그 변화를 기억하지 못한다.'
      },
      {
        id:'GBF-VR-02',scenarioId:'unlit-fortress',endingId:'breach',theme:'great-black-forest',
        code:'GBF-VR-02 / INTERIOR BREACH',title:'다섯 번째 조사원',
        lockedTitle:'대흑림 현장 판정 02',requirement:'「다섯 번째 조사원」 결과를 확인하면 열린다.',
        summary:'조사팀은 열린 성문을 통과했다. 성채 안에는 네 사람의 방과, 현재 단말 사용자를 위한 다섯 번째 방이 준비돼 있었다.',
        finding:'다섯 번째 신호는 조사대를 따라온 존재가 아니었다. 성채가 지켜보던 사람까지 조사 인원으로 세면서 만들어 낸 자리였을 가능성이 높다.',
        directive:'성채 좌표를 폐기한다. 관련 기억카드는 따로 떨어진 망에 격리한다. 같은 호출 부호가 들려도 응답하지 않는다.',
        hidden:'다섯 번째 방의 침대는 사용한 흔적이 있었다. 베개 아래에서는 이 판정 기록을 인쇄한 종이가 발견됐다.'
      },
      {
        id:'GBF-VR-03',scenarioId:'unlit-fortress',endingId:'retreat',theme:'great-black-forest',
        code:'GBF-VR-03 / ROUTE ABANDONED',title:'남겨 둔 종',
        lockedTitle:'대흑림 현장 판정 03',requirement:'「남겨 둔 종」 결과를 확인하면 열린다.',
        summary:'조사팀은 종을 성문 앞에 두고 전원 철수했다. 생존자는 네 명. 출발 명단에는 처음부터 다섯 명이 적혀 있다.',
        finding:'규칙을 어기지 않았다. 접촉도 피했다. 그러나 종을 넘겨받은 순간 맺어진 관계까지 끊지는 못했다. 사라진 경로 대신 인원 기록이 바뀌었다.',
        directive:'서부 외곽 관측소를 닫는다. 몬수르 교회와 다시 접촉하는 일은 미룬다. 출발 명단의 다섯 번째 이름은 읽지 않는다.',
        hidden:'철수 뒤에도 종소리는 매일 18시 51분에 한 번씩 들린다. 소리는 성채 쪽이 아니라 관측소 안에서 난다.'
      },
      {
        id:'DZ-VR-01',scenarioId:'deadzone-return',endingId:'approved',theme:'dead-zone',
        code:'DZ-VR-01 / CONDITIONAL RETURN',title:'귀환 승인',
        lockedTitle:'데드존 귀환 판정 01',requirement:'「귀환 승인」 결과를 확인하면 열린다.',
        summary:'네 귀환자는 서로 다른 감시실로 옮겨졌다. 신원은 조건을 달아 인정됐다. 다섯 번째 승인은 비워 둔 채 봉인됐다.',
        finding:'한 사람 한 사람의 작은 기억은 서로 달랐다. 출발 기록과도 이어졌다. 다섯 번째 열 반응은 사람보다 검문 절차 자체에 붙어 있었을 가능성이 높다.',
        directive:'귀환자마다 따로 하는 감시는 계속한다. 함께 하는 심문은 멈춘다. 매일 04시 12분에 빈 침상의 체온과 출입 기록을 맞춰 본다.',
        hidden:'빈 침상에서 채취한 지문은 네 귀환자와 일치하지 않는다. 지문 등록 번호는 검문 운영자의 것이다.'
      },
      {
        id:'DZ-VR-02',scenarioId:'deadzone-return',endingId:'sealed',theme:'dead-zone',
        code:'DZ-VR-02 / TOTAL QUARANTINE',title:'검문소 봉쇄',
        lockedTitle:'데드존 귀환 판정 02',requirement:'「검문소 봉쇄」 결과를 확인하면 열린다.',
        summary:'검문소 07의 안쪽 문과 바깥쪽 문을 모두 봉쇄했다. 침투 가능성은 낮아졌다. 그러나 네 귀환자의 신원도 확정하지 못했다.',
        finding:'봉쇄 바로 전 영상에서 귀환자들은 보이지 않는 다섯 번째 사람과 대화하고 있었다. 영상은 네 사람 사이의 빈자리에서만 망가져 있었다.',
        directive:'서부 귀환 접수를 멈춘다. 사람 없이 지켜보는 무인 관측만 남긴다. 검문소 안에서 오는 구조 요청에는 답하지 않는다.',
        hidden:'용접이 끝난 뒤에도 안쪽 출입문은 매일 한 번 열린 것으로 기록된다. 전력 사용량은 변하지 않는다.'
      },
      {
        id:'DZ-VR-03',scenarioId:'deadzone-return',endingId:'fifth',theme:'dead-zone',
        code:'DZ-VR-03 / OPERATOR ADDED',title:'다섯 번째 귀환자',
        lockedTitle:'데드존 귀환 판정 03',requirement:'「다섯 번째 귀환자」 결과를 확인하면 열린다.',
        summary:'출입 통제기가 요구한 다섯 번째 승인을 받아들였다. 네 귀환자는 모두 통과했다. 시스템에는 다섯 명이 입장한 것으로 남았다.',
        finding:'다섯 번째 인물은 영상에 존재하지 않는다. 대신 현재 단말의 로그인 기록이 데드존 출발 명단과 검문소 입장 기록에 동시에 추가됐다.',
        directive:'검문소 내부망을 바로 끊어 낸다. 운영자 계정을 폐기한다. 같은 계정이 다시 접속하면 사람의 요청으로 보지 않는다.',
        hidden:'이 문서를 읽는 동안 검문소 사용자 수가 하나 늘었다. 접속 위치는 지금 이 화면으로 표시된다.'
      },
      {
        id:'DZ-VR-04',scenarioId:'deadzone-return',endingId:'reverse',theme:'dead-zone',unlockScenario:'deadzone-recovery',
        code:'DZ-VR-04 / OUTBOUND REOPENED',title:'역방향 순례',
        lockedTitle:'데드존 귀환 판정 04',requirement:'「역방향 순례」 결과를 확인하면 열린다.',
        summary:'귀환 판정을 보류했다. 구조 신호가 시작된 방향으로 별도 조사팀을 보냈다. 네 귀환자는 여전히 검문소에 격리돼 있다.',
        finding:'조사팀이 폐쇄선을 넘자 귀환자들의 기억과 표정이 처음으로 서로 달라졌다. 공통 기억을 유지하던 외부 압력이 약해진 것으로 보인다.',
        directive:'전진 회수 작전의 통신망을 검문소와 분리한다. 조사팀 호출 부호가 다섯 번째 신호로 바뀌면 즉시 송신을 끊는다.',
        hidden:'조사팀의 첫 좌표는 데드존 안쪽이 아니라 검문소 지하를 가리켰다. 해당 층은 건축 도면에 없다.'
      },
      {
        id:'DZ-RV-01',scenarioId:'deadzone-recovery',endingId:'recovered',theme:'dead-zone-recovery',
        code:'DZ-RV-01 / BEACON RECOVERED',title:'두 번 돌아온 사람들',
        lockedTitle:'데드존 전진 회수 판정 01',requirement:'「두 번 돌아온 사람들」 결과를 확인하면 열린다.',
        summary:'원신호 송신기와 동일한 회수팀 두 조가 지상으로 돌아왔다. 여덟 명은 서로를 원본이나 복제라고 지목하지 않았다.',
        finding:'신호는 사람을 복제한 것이 아니라 같은 인원이 서로 다른 때에 돌아온 모습을 한 장소에 겹친 것으로 보인다. 지상에 오른 뒤 겉으로 보이는 나이가 같아져, 몸으로는 구분할 수 없다.',
        directive:'여덟 명을 네 쌍으로 나눠 따로 격리한다. 서로 다른 경험이 생기는지 지켜본다. 원신호 송신기는 검문소 시간망과 연결하지 않는다.',
        hidden:'두 팀의 기억이 처음으로 달라진 순간은 송신기 회수가 아니라 이 판정 기록의 제목을 읽었을 때였다.'
      },
      {
        id:'DZ-RV-02',scenarioId:'deadzone-recovery',endingId:'buried',theme:'dead-zone-recovery',
        code:'DZ-RV-02 / ORIGIN SEALED',title:'닫힌 출발선',
        lockedTitle:'데드존 전진 회수 판정 02',requirement:'「닫힌 출발선」 결과를 확인하면 열린다.',
        summary:'원신호 회랑과 먼저 도착한 회수팀을 붕괴 구역 아래에 봉쇄했다. 현재 팀 네 명은 물리 견인선을 따라 귀환했다.',
        finding:'구조 신호는 중단됐다. 지하 타격음은 검문소의 하루보다 17분 빠르게 반복된다. 봉쇄는 공간을 닫았을 뿐 두 시간대의 접촉까지 끊지는 못했다.',
        directive:'화물 승강기와 지하 사다리를 콘크리트로 메운다. 매일 08시 05분부터 08시 22분까지 검문소 통신을 손으로 끊는다.',
        hidden:'봉쇄 후 회수된 견인선의 끝에는 잘린 흔적이 없다. 선 전체가 처음부터 검문소 안에 놓여 있었던 것으로 분석됐다.'
      },
      {
        id:'DZ-RV-03',scenarioId:'deadzone-recovery',endingId:'relay',theme:'dead-zone-recovery',
        code:'DZ-RV-03 / OPERATOR RELAY',title:'다섯 번째 중계자',
        lockedTitle:'데드존 전진 회수 판정 03',requirement:'「다섯 번째 중계자」 결과를 확인하면 열린다.',
        summary:'현장 인원은 모두 귀환했다. 그러나 현재 단말 운영자 계정이 원신호 중계망에 등록됐다. 구조 신호의 목소리도 운영자와 일치한다.',
        finding:'다섯 번째 신호는 사람이 아니라 승인 권한이 이동하는 자리였다. 계정을 폐기할 때마다 다음 관제 단말이 그 자리를 자동으로 이어받는다.',
        directive:'단말을 끄지 않는다. 외부망과 끊은 채 사람 없이 전원을 켜 둔다. 새 구조 요청은 사람의 증언이 아니라 중계망의 복제 신호로 분류한다.',
        hidden:'이 문서에 표시되는 지금 읽는 사람 수는 한 명이다. 검문소 기록에는 같은 화면을 읽고 있는 사용자가 다섯 명으로 나온다.'
      },
      {
        id:'VSK-VR-01',scenarioId:'interline-night-patrol',endingId:'all-returned',theme:'dead-zone',
        code:'VSK-VR-01 / ALL RETURNED',title:'전원 귀환',
        lockedTitle:'베스카 선간 지대 판정 01',requirement:'「전원 귀환」 결과를 확인하면 열린다.',
        summary:'외곽 검문선의 삼중 계수는 맨눈·열상·무전 응답 모두 다섯으로 맞았다. 순찰조 다섯 자리가 귀환 처리됐다.',
        finding:'이 순찰 기록은 관할이 비어 있는 곳에서 한 번 센 현장 계수다. 이웃 나라 경계의 법적 권한이나 구역 판정을 확정하지 않는다.',
        directive:'통행권과 계수 원본을 별도로 보관한다. 같은 호출 부호가 들려도 확인되지 않은 구조 요청에는 응답하지 않는다.',
        hidden:'귀환 뒤 독립시계 하나가 다시 맞았다. 조가 시계를 맡은 대원의 이름을 적은 칸은 비어 있다.'
      },
      {
        id:'VSK-VR-02',scenarioId:'interline-night-patrol',endingId:'extra-count',theme:'dead-zone',
        code:'VSK-VR-02 / EXTRA COUNT',title:'남는 수 하나',
        lockedTitle:'베스카 선간 지대 판정 02',requirement:'「남는 수 하나」 결과를 확인하면 열린다.',
        summary:'계수표에는 다섯 자리와 별도로 수 하나가 더 남았다. 그 값을 사람 한 명으로 바꾸지 않았다.',
        finding:'맨눈·열상·무전 원본값이 서로 맞지 않는 문제는 풀리지 않았다. 그 수가 어디서 왔는지는 확인되지 않았다.',
        directive:'조 전원에게 Gray Tag를 달아 따로 대기시킨다. 여섯 번째 수를 명부나 호출 부호에 붙이지 않는다.',
        hidden:'검문소 사본에 기록된 여섯 번째 값은 다음 교대의 출발 계수에도 남았다.'
      },
      {
        id:'VSK-VR-03',scenarioId:'interline-night-patrol',endingId:'held-in-band',theme:'dead-zone',
        code:'VSK-VR-03 / WITHDRAWAL HELD',title:'띠 안의 대기',
        lockedTitle:'베스카 선간 지대 판정 03',requirement:'「띠 안의 대기」 결과를 확인하면 열린다.',
        summary:'통행권과 교전권을 누가 책임지는지 정리되지 않아, 순찰조의 철수가 선간 지대에서 멈췄다. 사격 승인은 내려지지 않았다.',
        finding:'N.H.C는 그 띠에서 교전권 없이 순찰했다. 이웃 초소의 요청이 N.H.C에 교전권을 준 것은 아니다.',
        directive:'초소마다 승인 문서가 올 때까지 그 자리를 지킨다. 세 계수값과 독립시계 값은 따로따로 남긴다.',
        hidden:'교대 통신표에는 순찰조가 귀환했다고 적혔다. 접수 시각은 비어 있다.'
      },
      {
        id:'ORV-VR-01',scenarioId:'red-moat-negotiation',endingId:'channel-opened',theme:'dead-zone',
        code:'ORV-VR-01 / CHANNEL OPENED',title:'셋째가 보낸 사람',
        lockedTitle:'오르비나 봉쇄 판정 01',requirement:'「셋째가 보낸 사람」 결과를 확인하면 열린다.',
        summary:'단방향 말길 시험 뒤 결계 안 방송은 “한 집”에서 “셋째”라고 부른 사람 한 명을 보냈다. 봉쇄선 바깥에서 인계 기록만 남았다.',
        finding:'수신 경로는 열렸다. 상대가 누구인지, 혈약을 맺었는지는 확인되지 않았다.',
        directive:'열린 채널은 실험용으로 봉인한다. 마르쿠스 아이데가 교단 중재를 거부한 기록은 그대로 둔다.',
        hidden:'인계표의 보낸 곳과 받는 곳은 모두 “한 집”으로 입력됐다.'
      },
      {
        id:'ORV-VR-02',scenarioId:'red-moat-negotiation',endingId:'refused',theme:'dead-zone',
        code:'ORV-VR-02 / MEDIATION REFUSED',title:'봉쇄 유지',
        lockedTitle:'오르비나 봉쇄 판정 02',requirement:'「봉쇄 유지」 결과를 확인하면 열린다.',
        summary:'중재 제안은 거부됐다. 포위 지휘소는 통신선을 닫고 봉쇄를 유지했다.',
        finding:'결계 안 생존자와 방송 발신자는 확인되지 않았다. 거부는 결계 안 상황의 판정이 아니다.',
        directive:'바깥에서 계속 지켜본다. 실종 정찰조 이름과 같은 방송에는 응답하지 않는다.',
        hidden:'회신 기록에는 “제안 없음”이 입력됐다. 수신함에는 봉인된 제안서가 남아 있다.'
      },
      {
        id:'ORV-VR-03',scenarioId:'red-moat-negotiation',endingId:'name-called',theme:'dead-zone',
        code:'ORV-VR-03 / NAME ANSWERED',title:'응답한 이름',
        lockedTitle:'오르비나 봉쇄 판정 03',requirement:'「응답한 이름」 결과를 확인하면 열린다.',
        summary:'결계 안 방송이 지휘소 대원의 이름을 불렀다. 지휘소 대원 한 명이 대답했다.',
        finding:'응답자는 Gray Tag를 달고 따로 떨어졌다. 몸을 빼앗겼는지, 방송을 누가 보냈는지는 확정되지 않았다.',
        directive:'대원의 음성과 생체 기록을 따로 봉인한다. 봉쇄선은 그대로 두고, 이름을 다시 부르지 않는다.',
        hidden:'음성 기록의 마지막 응답 뒤에 한 박자의 침묵이 있다. 방송 재생 장치에는 그 구간이 없다.'
      },
      {
        id:'VAC-VR-01',scenarioId:'empty-seat-returner-screening',endingId:'accepted',theme:'dead-zone',
        code:'VAC-VR-01 / IDENTITY ACCEPTED',title:'보증된 귀환',
        lockedTitle:'공석 구역 귀환 판정 01',requirement:'「보증된 귀환」 결과를 확인하면 열린다.',
        summary:'망명 대표단장 이레나 볼트가 귀환자의 신원을 보증했다. 검문소는 보증과 현장 확인을 붙여 인계했다.',
        finding:'기억하는 길과 소리는 별도로 기록됐다. 공석 구역의 세 이름 기록은 합쳐지지 않았다.',
        directive:'이레나 볼트의 보증은 현장 신원 확인으로만 보관한다. 다른 귀환자에게 저절로 적용하지 않는다.',
        hidden:'신임장의 나라 이름 칸은 인계 뒤에도 비어 있다.'
      },
      {
        id:'VAC-VR-02',scenarioId:'empty-seat-returner-screening',endingId:'waitlist',theme:'dead-zone',
        code:'VAC-VR-02 / HANDOFF WAITLIST',title:'검문소 대기 명단',
        lockedTitle:'공석 구역 귀환 판정 02',requirement:'「검문소 대기 명단」 결과를 확인하면 열린다.',
        summary:'어느 나라도 귀환자를 받지 않았다. 귀환자는 검문소 대기 명단에 남았다.',
        finding:'검문 절차는 끝났지만 신원 인계는 승인되지 않았다. 이름 기록은 각각 보존됐다.',
        directive:'대기 구획은 그대로 둔다. 이름을 하나로 맞추거나 인계 완료로 바꾸지 않는다.',
        hidden:'대기 명단의 접수 번호는 매일 바뀐다. 귀환자는 번호가 바뀌는 소리를 먼저 기억했다.'
      },
      {
        id:'VAC-VR-03',scenarioId:'empty-seat-returner-screening',endingId:'fourth-name',theme:'dead-zone',
        code:'VAC-VR-03 / FOURTH NAME',title:'넷째 이름',
        lockedTitle:'공석 구역 귀환 판정 03',requirement:'「넷째 이름」 결과를 확인하면 열린다.',
        summary:'귀환자는 세 기록 어디에도 없는 넷째 이름을 고향으로 기억했다. 검문소는 그 이름을 별도 기록으로 남겼다.',
        finding:'기억과 세 이름 기록은 일치하지 않는다. 넷째 이름의 표기와 원인은 확인되지 않았다.',
        directive:'넷째 이름은 따로 항목을 만들어 남긴다. 공석 구역의 원래 이름으로 승인하지 않는다.',
        hidden:'이 기록을 출력한 봉투에는 네 번째 주소 칸이 미리 접혀 있다.'
      }
    ]
  });
})(window);
