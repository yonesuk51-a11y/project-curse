// Project Curse 5.25.0 — conditional field-verdict archive definitions.
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
        lockedTitle:'대흑림 현장 판정 01',requirement:'「성문 밖의 협정」 결말을 확인하면 열린다.',
        summary:'조사팀은 성채에 들어가지 않고도 구조 요청에 응답했다. 종을 울린 뒤 실종자 두 명이 성문 밖으로 돌아왔다.',
        finding:'성채는 순례자의 규칙을 이해하며, 규칙을 지킨 사람에게만 제한적으로 길을 내주는 것으로 보인다. 다만 내부 주민의 수와 정체는 확인하지 못했다.',
        directive:'서부 회랑을 조건부 피난로로 등록한다. 다음 조사대도 성문 안으로 들어가지 말고, 모든 협상은 바깥에서 진행한다.',
        hidden:'종을 세 번 울린 시각, 조사팀 인원 기록은 네 명에서 잠시 다섯 명으로 바뀌었다. 돌아온 실종자 두 명은 그 변화를 기억하지 못한다.'
      },
      {
        id:'GBF-VR-02',scenarioId:'unlit-fortress',endingId:'breach',theme:'great-black-forest',
        code:'GBF-VR-02 / INTERIOR BREACH',title:'다섯 번째 조사원',
        lockedTitle:'대흑림 현장 판정 02',requirement:'「다섯 번째 조사원」 결말을 확인하면 열린다.',
        summary:'조사팀은 열린 성문을 통과했다. 성채 안에는 네 사람의 방과, 현재 단말 사용자를 위한 다섯 번째 방이 준비돼 있었다.',
        finding:'다섯 번째 신호는 조사대를 따라온 존재가 아니었다. 성채가 관측자를 조사 인원에 포함하면서 만들어 낸 자리였을 가능성이 높다.',
        directive:'성채 좌표를 폐기하고 관련 기억카드를 독립망에 격리한다. 같은 호출 부호가 들려도 응답하지 않는다.',
        hidden:'다섯 번째 방의 침대는 사용한 흔적이 있었다. 베개 아래에서는 이 판정 기록을 인쇄한 종이가 발견됐다.'
      },
      {
        id:'GBF-VR-03',scenarioId:'unlit-fortress',endingId:'retreat',theme:'great-black-forest',
        code:'GBF-VR-03 / ROUTE ABANDONED',title:'남겨 둔 종',
        lockedTitle:'대흑림 현장 판정 03',requirement:'「남겨 둔 종」 결말을 확인하면 열린다.',
        summary:'조사팀은 종을 성문 앞에 두고 전원 철수했다. 생존자는 네 명이지만 출발 명단에는 처음부터 다섯 명이 적혀 있다.',
        finding:'규칙을 어기지 않고 접촉도 피했으나, 종을 넘겨받은 순간 맺어진 관계까지 끊지는 못했다. 사라진 경로 대신 인원 기록이 바뀌었다.',
        directive:'서부 외곽 관측소를 폐쇄하고 몬수르 교회와의 재접촉을 보류한다. 출발 명단의 다섯 번째 이름은 읽지 않는다.',
        hidden:'철수 뒤에도 종소리는 매일 18시 51분에 한 번씩 들린다. 소리는 성채 쪽이 아니라 관측소 안에서 난다.'
      },
      {
        id:'DZ-VR-01',scenarioId:'deadzone-return',endingId:'approved',theme:'dead-zone',
        code:'DZ-VR-01 / CONDITIONAL RETURN',title:'귀환 승인',
        lockedTitle:'데드존 귀환 판정 01',requirement:'「귀환 승인」 결말을 확인하면 열린다.',
        summary:'네 귀환자는 서로 다른 감시실로 옮겨졌다. 신원은 조건부로 인정됐으며, 다섯 번째 승인은 비워 둔 채 봉인됐다.',
        finding:'개인의 사소한 기억은 서로 달랐고 출발 기록과도 이어졌다. 다섯 번째 열원은 사람보다 검문 절차 자체에 붙어 있었을 가능성이 높다.',
        directive:'귀환자별 감시를 유지하되 공동 심문은 중단한다. 매일 04시 12분에 빈 침상의 체온과 출입 기록을 대조한다.',
        hidden:'빈 침상에서 채취한 지문은 네 귀환자와 일치하지 않는다. 지문 등록 번호는 검문 운영자의 것이다.'
      },
      {
        id:'DZ-VR-02',scenarioId:'deadzone-return',endingId:'sealed',theme:'dead-zone',
        code:'DZ-VR-02 / TOTAL QUARANTINE',title:'검문소 봉쇄',
        lockedTitle:'데드존 귀환 판정 02',requirement:'「검문소 봉쇄」 결말을 확인하면 열린다.',
        summary:'검문소 07의 안쪽 문과 바깥쪽 문을 모두 봉쇄했다. 침투 가능성은 낮아졌지만 네 귀환자의 신원도 확정하지 못했다.',
        finding:'봉쇄 직전 영상에서 귀환자들은 보이지 않는 다섯 번째 사람과 대화하고 있었다. 영상 손상은 네 사람 사이의 빈자리에서만 발생했다.',
        directive:'서부 귀환 접수를 중단하고 무인 관측만 유지한다. 검문소 안에서 오는 구조 요청에는 답하지 않는다.',
        hidden:'용접이 끝난 뒤에도 안쪽 출입문은 매일 한 번 열린 것으로 기록된다. 전력 사용량은 변하지 않는다.'
      },
      {
        id:'DZ-VR-03',scenarioId:'deadzone-return',endingId:'fifth',theme:'dead-zone',
        code:'DZ-VR-03 / OPERATOR ADDED',title:'다섯 번째 귀환자',
        lockedTitle:'데드존 귀환 판정 03',requirement:'「다섯 번째 귀환자」 결말을 확인하면 열린다.',
        summary:'출입 통제기가 요구한 다섯 번째 승인을 받아들였다. 네 귀환자는 모두 통과했지만 시스템에는 다섯 명이 입장한 것으로 남았다.',
        finding:'다섯 번째 인물은 영상에 존재하지 않는다. 대신 현재 단말의 로그인 기록이 데드존 출발 명단과 검문소 입장 기록에 동시에 추가됐다.',
        directive:'검문소 내부망을 즉시 분리하고 운영자 계정을 폐기한다. 같은 계정이 다시 접속하면 사람의 요청으로 간주하지 않는다.',
        hidden:'이 문서를 열람하는 동안 검문소 사용자 수가 하나 늘었다. 접속 위치는 현재 화면으로 표시된다.'
      },
      {
        id:'DZ-VR-04',scenarioId:'deadzone-return',endingId:'reverse',theme:'dead-zone',
        code:'DZ-VR-04 / OUTBOUND REOPENED',title:'역방향 순례',
        lockedTitle:'데드존 귀환 판정 04',requirement:'「역방향 순례」 결말을 확인하면 열린다.',
        summary:'귀환 판정을 보류하고 별도 조사팀을 구조 신호가 시작된 방향으로 보냈다. 네 귀환자는 여전히 검문소에 격리돼 있다.',
        finding:'조사팀이 폐쇄선을 넘자 귀환자들의 기억과 표정이 처음으로 서로 달라졌다. 공통 기억을 유지하던 외부 압력이 약해진 것으로 보인다.',
        directive:'전진 회수 작전의 통신망을 검문소와 분리한다. 조사팀 호출 부호가 다섯 번째 신호로 바뀌면 즉시 송신을 끊는다.',
        hidden:'조사팀의 첫 좌표는 데드존 안쪽이 아니라 검문소 지하를 가리켰다. 해당 층은 건축 도면에 없다.'
      }
    ]
  });
})(window);
