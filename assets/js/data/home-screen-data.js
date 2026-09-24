// Project Curse 6 — 단말 상태(홈) 화면의 편집 문구·기록선·상태 표시 문구.
// 화면 코드(assets/app/js/screens/home.js)는 이 값을 그대로 보여 준다. {이름} 자리는 진행 상태 값으로 채운다.
// 경보·수신 문구는 옛 홈(pages/terminal-home.js)의 상태 문구를 글자 그대로 옮겼다.
(function (root) {
  'use strict';

  function freeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseHomeScreen = freeze({
    version: '6.0.0',
    lead: '외부망은 끊겼다. 남은 것은 서로 모순되는 사건철과 아직 응답 중인 관측점뿐이다.',

    // 현재 경보 — 미열람 판정 기록 → 저장된 작전 판정 → 정보 회수 진행 → 기본 경보 순서로 바뀐다.
    alert: {
      verdict: {
        code: 'FIELD-VERDICT',
        title: '새 현장 판정 기록',
        priority: 'NEW RECORD DECRYPTED',
        copy: '{id} 「{title}」 기록을 복원했다. 최종 판정 순간의 선택과 측정값이 별도 사본으로 보존됐다.',
        action: '새 판정 기록 열기',
        scope: 'TERMINAL SNAPSHOT'
      },
      decision: {
        priority: { deferred: 'LOCAL DECISION DEFERRED', saved: 'LOCAL VERDICT SAVED' },
        copy: '{summary} 중앙 연표와 세력 계보에는 반영되지 않는다.',
        action: '작전 결과 지도 열기',
        scope: 'FIELD COPY / CENTRAL RECORD UNCHANGED'
      },
      recovered: {
        copy: '부서진 왕관 정보 경로 {recovered}/{total}개가 복구됐다. 지휘 판단은 아직 확정되지 않았다.',
        action: '작전 분석 재개'
      },
      fallbackCopy: '남방 해안권에서 상충하는 지휘 신호가 감지됐다.'
    },

    // 순례 판단 흔적 — 마지막 선택의 규칙 결과
    traces: {
      kept: '규칙 준수',
      broken: '규칙 위반',
      verified: '검증 완료',
      contained: '위험 봉쇄',
      compromised: '신호 오염',
      secured: '경로 확보'
    },

    // 최근 수신 — 수신 데이터(home-intelligence-data.js)의 첫 네 행이 아래 네 채널이다.
    channels: [
      {
        kind: 'operation',
        decided: '부서진 왕관 · {title}',
        recovered: '부서진 왕관 정보 {recovered}/{total} 복구',
        status: { deferred: 'LOCAL DEFERRED', saved: 'LOCAL VERDICT', recovered: 'ANALYSIS' }
      },
      {
        kind: 'pilgrimage',
        scenario: 'unlit-fortress',
        complete: '불빛 없는 성채 · {ending}',
        endingFallback: '순례 종료',
        active: '불빛 없는 성채 {completed}/{total} · {trace}',
        traceFallback: '진입 중',
        idle: '불빛 없는 성채 순례 채널 대기',
        status: { complete: 'RESULT SAVED', outcomeFallback: 'TRACE', idle: 'PILGRIMAGE READY' }
      },
      {
        kind: 'pilgrimage',
        scenario: 'deadzone-return',
        complete: '데드존 귀환 판정 · {ending}',
        endingFallback: '검문 종료',
        active: '검문소 07 {completed}/{total} · {trace}',
        traceFallback: '심사 중',
        idle: '데드존 귀환자 검문 채널 대기',
        unstableEnding: true,
        status: { complete: 'VERDICT SAVED', outcomeFallback: 'SCREENED', idle: 'SCREENING READY' }
      },
      {
        kind: 'pilgrimage',
        scenario: 'deadzone-recovery',
        operation: 'op-deadzone-recovery',
        unlockVerdict: 'DZ-VR-04',
        complete: '전진 회수 판정 · {ending}',
        endingFallback: '작전 종료',
        active: '데드존 전진 회수 {completed}/{total} · {trace}',
        traceFallback: '하강 중',
        idle: '검문소 지하 전진 회수선 개방',
        locked: '검문소 지하 구조 신호 봉인',
        status: { complete: 'VERDICT SAVED', outcomeFallback: 'RECOVERED', idle: 'DZ-R05 READY', locked: 'DZ-VR-04 REQUIRED' }
      }
    ],
    unreadVerdict: { time: 'NOW', status: 'DECRYPTED', label: '{id} · {title}' },

    // 민간 재난 방송 — 2006년 이후의 재난 일상(경보색·창문 봉인·기억 대조·배급 순서·통행 서류·따로 치르는 장례)을
    // 방송 문안으로 옮겼다. 근거: worldFramework.publicBaseline·civilianSystems, Civil_Child_Drill.
    // 경보색 뜻은 화면이 Civil_Child_Drill의 '경보색과 할 일' 표에서 직접 읽는다. 여기 적지 않는다.
    civil: {
      code: 'CIVIL ALERT RELAY / 민간 재난 방송',
      title: '민간 방송 수신본',
      relay: '1 REGION COPY',
      author: '권역 공식 재난 방송 · 발신 기관 표기 없음',
      recipient: '권역 거주민·검문 대기열',
      purpose: '경보색 전환과 행동 지시',
      limit: '한 권역 경보망에서 받은 사본이다. 같은 소식도 권역마다 날짜가 다르다. 방송은 발생 원인, 기관 책임, 능력자의 대가를 다루지 않는다.',
      broadcasts: [
        { time: '04:12', color: '빨강', region: '서부 귀환 회랑', text: '경보색 빨강. 창문에서 떨어지십시오. 부를 때까지 자리를 옮기지 마십시오. 밖에서 이름을 부르는 소리에는 대답하지 마십시오.' },
        { time: '03:40', color: '노랑', region: '도시권', text: '경보색 노랑. 외출을 삼가십시오. 가방은 문 옆에 두십시오. 이 방송은 발생 원인을 안내하지 않습니다.' },
        { time: '02:55', kind: '배급', region: '성채권 배급소', text: '이번 배급은 발전기 연료, 냉장 의약품, 정수 필터 순서입니다. 식량 배급 순서는 다음 방송에서 알려 드립니다.' },
        { time: '02:20', kind: '통행', region: '검문소 07 대기열', text: '여권은 받지 않습니다. 노출기록, 동행자 서명, 귀환 경로, 마지막 수면 시각을 준비하십시오. 마지막 수면 시각이 기억나지 않으면 모른다고 적으십시오.' },
        { time: '01:05', color: '하양', region: '전 권역', text: '경보색 하양. 확인 중입니다. 다음 방송까지 기다리십시오. 이 방송에 적힌 날짜를 기준으로 삼지 마십시오.' },
        { time: '00:30', kind: '실종자 공고', region: '도시권', text: '시신 없는 장례는 이름, 물건, 음성기록으로 나눠 접수합니다. 귀가한 가족의 동일인 판정이 끝나기 전에도 장례 접수는 유지됩니다.' }
      ],
      legendTitle: '경보색 기준 — 학교 대피 수업 표',
      legendLink: ['기준 문서 열람', ['archive-entry', 'Civil_Child_Drill']]
    },

    // 접촉 보고 — 작전 단계의 기입 문장에서 센서 값을 뽑는다. 기입 문장이 바뀌어 값이 맞지 않으면 판독 막대를 그리지 않는다.
    contact: {
      operation: 'op-deadzone-return',
      step: 0,
      expect: ['4명', '5개'],
      readout: [['육안', '4', false], ['열원', '5', true], ['출입 요청', '5', true]]
    },

    entries: [
      {
        phase: 'exposure',
        code: 'ENTRY 01 / 1986',
        title: '최초 노출',
        text: '호수에서 돌아온 조사관들은 같은 시체를 두고 서로 다른 보고서를 남겼다. 교단이라는 이름이 공식 기록에 처음 등장한 것도 그날이었다.',
        links: [
          ['연표로 진입', ['history', '1986-02-01-immortality'], true],
          ['피의 호수 원기록', ['archive-entry', 'Immortality_860201']]
        ]
      },
      {
        phase: 'collapse',
        code: 'ENTRY 02 / 2007–2012',
        title: '세계의 붕괴',
        text: '북미 지휘망은 철수했고, 남방 측량대는 숲의 끝을 찾지 못했다. 두 대륙은 서로 다른 이유로 지도에서 지워졌다.',
        links: [
          ['붕괴 연표', ['history', '2008-09-06-dead-zone-designation'], true],
          ['데드존', ['archive-entry', 'Dead_Zone_Pilgrimage']],
          ['대흑림', ['archive-entry', 'Great_Black_Forest_Region']]
        ]
      },
      {
        phase: 'current',
        code: 'ENTRY 03 / 2030–2042',
        title: '현재 기록',
        text: '중앙 색인이 닫힌 뒤에도 관측점은 신호를 보냈다. 2042년, 세 밤 동안 열 개 지점이 같은 시각에 침묵했다.',
        links: [
          ['부서진 왕관', ['history', '2030-01-17-broken-crown'], true],
          ['작전 지도', ['map-room', 'op', 'op-southern-coup']],
          ['삼야 무응답', ['history', '2042-10-31-three-night-silence']]
        ]
      }
    ],

    // 처음 접속한 사람을 위한 여섯 기록선
    readingPath: [
      ['세계 기록', '기관 이전의 성채 전승에서 2042년 세 밤의 침묵까지 큰 흐름을 잡는다.', ['history']],
      ['기관과 교단', '같은 사건을 두고 갈라진 조직과 교단의 지휘선을 대조한다.', ['faction-info']],
      ['인물 기록', '주요 인물과 그들이 남긴 사건을 따라간다.', ['personnel']],
      ['대흑림과 순례 규칙', '성채 밖에서 법 대신 생환자들의 규칙이 작동하는 이유를 읽는다.', ['archive-entry', 'Great_Black_Forest_Region']],
      ['데드존 귀환선', '사라진 대륙에서 돌아온 자들이 어떤 판정을 받았는지 따라간다.', ['archive-entry', 'Dead_Zone_Pilgrimage']],
      ['부서진 왕관', '중앙 색인 동결 이후에도 끝나지 않은 남부 작전의 분기 기록을 연다.', ['archive-entry', 'Operation_Broken_Crown']]
    ],
    manualLink: {
      code: 'BEFORE DEPLOYMENT',
      title: '투입 전 확인 — 교전 교범',
      text: '교전 원칙, 철수 조건, 표식, 장비군, 능력과 대가, 현장 인원 등록 양식'
    },

    custody: {
      code: 'UNCLAIMED CUSTODY NOTE / 서부 귀환 회랑 보관함',
      title: '보관함에 남긴 쪽지',
      opening: '나는 답을 적지 않는다. 적으면 안 된다고 배웠다.',
      questions: [
        '첫째. 네가 열두 살 때 부엌에서 무엇을 깨뜨렸는지.',
        '둘째. 그 집에서 밤마다 나던 소리를 우리가 뭐라고 불렀는지.',
        '셋째. 내가 너에게 한 번도 하지 않은 말이 무엇인지.'
      ],
      foot: '위탁자 이름 칸은 비어 있다. 수취인이 찾아갔는지는 보관 장부에 남아 있지 않다.',
      links: [
        ['귀환자 기록', ['archive-entry', 'Returner_Note_West']],
        ['데드존 귀환선', ['archive-entry', 'Dead_Zone_Pilgrimage']]
      ]
    },

    keyArt: {
      src: 'assets/resources/derived/remake-keyart-checkpoint-07-concept-v2.png',
      alt: '검문소 07 출입문 앞에 귀환자 네 명이 서 있고, 대원이 든 열상 판독 단말에는 인체 형상 다섯 개가 표시된 편집 키아트',
      label: 'EDITORIAL KEY ART / CHECKPOINT 07',
      caption: '설정 기반 편집 키아트 · 사건 원본이나 감시 화면으로 취급하지 않음 · 다섯 번째 열원의 신원은 확정되지 않았다'
    }
  });
})(window);
