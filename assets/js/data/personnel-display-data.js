// Project Curse 6 — 옛 personnel-archive.js에서 옮긴 기준 연도·표시 문구.
// 개별 인물은 personnel-data.js가 profiles → remake 순서로 조립한 결과만 사용한다.
(function (root) {
  'use strict';
  root.ProjectCursePersonnelDisplay = Object.freeze({
    year: '2006',
    intro: '2006년까지 확인된 인물과 그들이 남긴 사건을 모았다. 이름을 선택하면 핵심 기록부터 읽을 수 있다.',
    statusLabels: Object.freeze({
      active: '2006년 활동 확인',
      deceased: '2006년 사망 기재',
      unknown: '2006년 이후 미확인'
    }),
    limitDefault: '이 인물의 세부 활동과 현재 상태는 추가 기록이 필요하다.',
    abilityCostMissing: '대가 기록 미확인'
  });
})(window);
