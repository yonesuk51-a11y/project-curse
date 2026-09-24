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
    limitDefault: '후대 결과와 미회수 자료는 이 문서의 판정 범위에 포함하지 않는다.',
    // 세계 기본 규칙의 존재 구분 아래에 싣는 그림 — 키는 worldFramework.ontology의 code
    ontologyVisuals: {
      PERSON: {
        src: 'assets/resources/derived/corrupted-isolation-observation-concept-v1.png',
        className: 'RECONSTRUCTED',
        label: 'INTERPRETIVE RECONSTRUCTION / PERSON — 타락자',
        alt: '어두운 복도에서 서리 낀 관찰창 너머로 본 격리실. 낡은 겉옷을 입은 성인이 두 손을 무릎에 모으고 앉아 있고, 역광 윤곽의 어깨와 등에서 가지 같은 뼈 가시가 뻗어 있다. 유리 안쪽에 손가락이 여섯인 손자국이 남아 있다.',
        caption: '인간이었던 기억과 신원을 일부 유지한 채 변질된 사람, 곧 타락자를 격리 관찰 장면으로 옮긴 분석 재구성이다. 특정 피격리자의 신원, 변질 원인과 경과, 실제 관찰 기록을 확정하지 않는다. 괴이와 같은 범주로 다루지 않는다.'
      }
    }
  });
})(window);
