// Project Curse 6 — 단말 갱신 기록. 2026-09-25 사용자 결정(새 기록 알림).
// 홈의 '지난 방문 이후' 판이 이 목록에서 방문자가 마지막으로 온 뒤의 항목을 보여 준다(pc-updates.js).
// 새 기록·새 그림을 올릴 때 맨 위에 한 줄을 더한다. at(시각, 선택)을 적으면 같은 날 두 번 갱신해도 구분된다.
// 공개 문구 규칙(WRITING_STYLE_GUIDE.md): 제작 과정을 설명하는 말을 쓰지 않는다.
(function (root) {
  'use strict';

  const freeze = (value) => {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  };

  root.ProjectCurseSiteUpdates = freeze({
    entries: [
      {
        date: '2026-09-25',
        at: '2026-09-25T23:50:00+09:00',
        title: '인물 기록 12명 추가 등록',
        text: '우시노다교 교단 명단의 사도 7명과 N.H.C 대원 5명이 2042 추가 등록 명부에 올랐다. F.H.C 전술대괴이부대(TAD)의 표장 뜻과 N.H.C 타격부대 편성이 세력 분석에 추가됐다.',
        links: [{ label: '인물 기록', route: 'personnel' }]
      },
      {
        date: '2026-09-25',
        at: '2026-09-25T23:30:00+09:00',
        title: '열람자 호출부호·통합 검색·등록증 발급',
        text: '접속할 때 열람자 호출부호를 남길 수 있다. 상단 바의 검색으로 인물·기록·세력·장소를 한 번에 찾는다. 현장 인원 등록 양식에서 등록증 그림을 발급받는다.',
        links: [{ label: '등록증 발급', route: 'field-manual', parts: ['register'] }]
      },
      {
        date: '2026-09-25',
        at: '2026-09-25T21:00:00+09:00',
        title: '단말 기동 절차와 채널 인계 복구',
        text: '로컬 기동 절차, 채널 인계 화면, 단말 음향이 다시 연결됐다. 표시 설정에서 소리·효과·보기를 바꿀 수 있다.',
        links: [{ label: '현장 지침', route: 'field-manual' }]
      },
      {
        date: '2026-09-25',
        at: '2026-09-25T17:40:00+09:00',
        title: '세계 기록 현장 재구성 17건 추가',
        text: '세계 기록 17건에 분석 재구성 그림이 붙었다.',
        links: [{ label: '세계 기록', route: 'history' }]
      },
      {
        date: '2026-09-25',
        at: '2026-09-25T15:00:00+09:00',
        title: '피탈자 교전 규칙 개정',
        text: '리버스 지점의 피탈자 판정 징후와 교전 규칙이 교범에 추가됐다. 현장 재구성 두 장이 새 판으로 바뀌었다.',
        links: [{ label: '피탈자 교전 규칙', route: 'field-manual' }]
      },
      {
        date: '2026-09-25',
        at: '2026-09-25T12:00:00+09:00',
        title: '세계 기록 현장 재구성 10건 추가',
        text: '세계 기록 10건과 기록보관소 6건에 분석 재구성 그림이 붙었다.',
        links: [{ label: '기록보관소', route: 'archive-entry' }]
      },
      {
        date: '2026-09-25',
        at: '2026-09-25T09:00:00+09:00',
        title: '인물 기록 사진 11건 등록',
        text: '인물 기록 11건에 신원 사진이 등록됐다.',
        links: [{ label: '인물 기록', route: 'personnel' }]
      },
      {
        date: '2026-09-24',
        title: '합동작전 단말 전환',
        text: '폐쇄 기록 단말이 합동작전 단말로 바뀌었다. 옛 문서 주소는 기록보관소로 이어진다.',
        links: [{ label: '기록보관소', route: 'archive-entry' }]
      }
    ]
  });
})(window);
