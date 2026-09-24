// Project Curse 6 — 세계 기록 화면의 편집 문구. 화면 코드(assets/app/js/screens/history.js)는 이 값을 그대로 보여 준다.
(function (root) {
  'use strict';

  function freeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseHistoryScreen = freeze({
    version: '6.0.0',
    // 먼저 볼 네 전환점 — [기록 id, 시기, 제목, 요약]
    turns: [
      ['deep-citadel-charters', '기원 불명–1974', '문보다 오래된 금기', '성채의 피난권과 봉인 관습은 현대 기관보다 먼저 존재했다.'],
      ['1975-09-12-amarion', '1975–1992', '기술이 금기를 계측하다', '아마리온과 일본의 계측 계획이 오래된 현상을 산업과 도시 설비의 언어로 바꿨다.'],
      ['1999-07-12-ubermensch', '1993–2006', '대응기관이 적을 닮다', '공식 대응 체계는 확장됐지만, 살아남기 위해 교단의 방식을 모방하기 시작했다.'],
      ['2008-09-06-dead-zone-designation', '2007–2042', '중앙이 사라진 뒤', '대륙 침묵 이후 성채와 검문소, 전선은 하나의 명령 없이 각자의 생존법을 만들었다.']
    ],
    // 기록마다 판정 한계가 따로 없을 때 붙는 문장
    limitDefault: '후대 결과와 미회수 자료는 이 문서의 판정 범위에 포함하지 않는다.'
  });
})(window);
