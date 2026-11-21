// Project Curse 6 — 상황판(홈) 화면의 편집 문구·기록 줄기·상태 표시 문구. 2026-09-25 화면 말 용어표 적용.
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
    lead: '외부망은 끊겼다. 남은 것은 서로 모순되는 사건 기록과 아직 응답 중인 관측 지점뿐이다.',

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
        traceFallback: '들어가는 중',
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
      title: '민간 재난 방송',
      relay: '1 REGION COPY',
      author: '권역 공식 재난 방송 · 보낸 기관 표기 없음',
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
      legendLink: ['기준 문서 보기', ['archive-entry', 'Civil_Child_Drill']]
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
          ['연표에서 보기', ['history', '1986-02-01-immortality'], true],
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
        text: '중앙 기록이 멈춘 뒤에도 관측 지점은 신호를 보냈다. 2042년, 세 밤 동안 열 개 지점이 같은 시각에 침묵했다.',
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
      ['기관과 교단', '같은 사건을 두고 갈라진 조직과 교단의 지휘선을 맞춰 본다.', ['faction-info']],
      ['인물 기록', '주요 인물과 그들이 남긴 사건을 따라간다.', ['personnel']],
      ['대흑림과 순례 규칙', '성채 밖에서 법 대신 생환자들의 규칙이 작동하는 이유를 읽는다.', ['archive-entry', 'Great_Black_Forest_Region']],
      ['데드존 귀환선', '사라진 대륙에서 돌아온 자들이 어떤 판정을 받았는지 따라간다.', ['archive-entry', 'Dead_Zone_Pilgrimage']],
      ['부서진 왕관', '중앙 기록이 멈춘 뒤에도 끝나지 않은 남방 작전, 네 갈래로 나뉜 결과를 연다.', ['archive-entry', 'Operation_Broken_Crown']]
    ],
    manualLink: {
      code: 'BEFORE DEPLOYMENT',
      title: '들어가기 전 확인 — 현장 지침',
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

    // 도시 공포 지수(2026-11-21 사용자 요청) — 세계 기록 '버티는 체제와 바뀌는 몸'의 공포 관리 행정을 상황판에 공시로 보인다.
    // 값은 base를 기준으로 날짜마다 spread 안에서 바뀐다. 측정값이 아니라 공시 사본이다.
    fear: {
      title: '도시 공포 지수',
      code: 'FEAR INDEX / DAILY NOTICE',
      lead: '공포 관리 행정이 매일 내는 도시별 지수다. 수치가 오르면 방송이 더 침착해진다.',
      author: '공포 관리 행정 일일 공시',
      recipient: '권역 방송국 / 경보 방송 책임자',
      purpose: '방송 문안 조정 기준',
      limit: '공포가 잔류 리버스를 키운다는 가설은 확인되지 않았다. 지수는 신고 건수, 통화량, 배급소 대기열로 추정한 값이고 측정 방법은 공개되지 않았다. 이 단말의 값은 공시 사본이며 날마다 바뀐다.',
      bands: [
        { min: 0, name: '평온', tone: 'ok', act: '표준 문안을 읽는다.' },
        { min: 40, name: '주의', tone: 'info', act: '문안을 더 천천히 읽는다.' },
        { min: 60, name: '경계', tone: 'caution', act: '배경 음악을 넣는다. 숫자를 읽지 않는다.' },
        { min: 80, name: '억제', tone: 'danger', act: '공포 유발 단속을 시작한다. 방송은 더 침착하게 읽는다.' }
      ],
      cities: [
        { id: 'tokyo', name: '도쿄 감시권', base: 48, spread: 16, note: '독립시계가 어긋난 날 오른다.' },
        { id: 'deadzone-coast', name: '데드존 해안 격리선', base: 71, spread: 14, note: '역류 사이렌 시험 방송이 있는 주에 오른다.' },
        { id: 'coastal-league', name: '대흑림 외연 연안 자치시', base: 55, spread: 20, note: '성채가 문을 열지 않은 밤 다음 날 오른다.' },
        { id: 'northern-line', name: '북부 차단선 처리장 도시', base: 66, spread: 12, note: '청소조 교대 명단이 공시되는 날 오른다.' },
        { id: 'karven', name: '카르벤 격리시', base: 58, spread: 18, note: '항구구에 조명탄이 오른 날 오른다.' },
        { id: 'vesca-border', name: '베스카 격리선 밖 국경 도시', base: 77, spread: 14, note: '선간 지대 순찰 보고 뒤에 오른다.' },
        { id: 'western-corridor', name: '서부 순례 회랑 입구', base: 44, spread: 22, note: '귀의 운동 행렬이 지나간 날 오른다.' }
      ]
    },

    // 재 농도 기상 방송(2026-11-21 사용자 요청) — 세계 기록 worldOrder의 '재 내리는 날'을 공영 기상 방송으로 보인다.
    // 권역 값은 base 둘레에서 날마다 바뀌고, 오늘의 하늘(phenomena)은 날짜로 하나를 고른다. 측정값이 아니라 방송 사본이다.
    ashWeather: {
      title: '재 농도 기상 방송',
      code: 'ASH FORECAST / 06:00',
      lead: '권역 공영 방송의 아침 기상 예보다. 재 농도는 미세먼지처럼 알린다.',
      unit: 'μg/m³',
      max: 300,
      author: '권역 공영 방송 기상팀',
      recipient: '권역 주민',
      purpose: '재 농도 예보와 행동 요령 안내',
      limit: '재 농도는 소각 연기와 리버스 잔해를 함께 잰 값이다. 둘을 나누는 측정 방법은 공개되지 않았다. 붉은 비와 기시체 신고의 관계는 통계일 뿐 원인으로 확인되지 않았다. 이 단말의 값은 방송 사본이며 날마다 바뀐다.',
      grades: [
        { min: 0, name: '좋음', tone: 'ok', act: '창문을 열어도 된다.' },
        { min: 36, name: '보통', tone: 'info', act: '빨래는 실내에서 말린다.' },
        { min: 76, name: '나쁨', tone: 'caution', act: '외출할 때 방진 마스크를 쓴다. 집에 들어오기 전에 옷을 턴다.' },
        { min: 151, name: '매우 나쁨', tone: 'danger', act: '외출을 줄인다. 창틈을 막는다. 배급소 줄은 실내 대기실에서 기다린다.' }
      ],
      regions: [
        { id: 'northern-line', name: '북부 차단선 처리장 도시', base: 150, spread: 90, note: '처리장 굴뚝이 바람 위쪽에 있다.' },
        { id: 'deadzone-coast', name: '데드존 해안 격리선', base: 100, spread: 80, note: '해풍이 불면 낮아진다. 역류 뒤 소각이 몰리면 오른다.' },
        { id: 'tokyo', name: '도쿄 감시권', base: 55, spread: 50, note: '서쪽 해안 소각장에서 바람이 불어온다.' },
        { id: 'karven', name: '카르벤 격리시', base: 75, spread: 60, note: '북풍이 불면 굴뚝구의 재가 시 전체에 내린다.' },
        { id: 'coastal-league', name: '남방 해안 연안 자치시', base: 50, spread: 60, note: '연료가 모자란 주에는 오히려 낮아진다.' },
        { id: 'western-corridor', name: '서부 순례 회랑', base: 35, spread: 40, note: '성채 소각로는 밤에만 돈다.' }
      ],
      phenomena: [
        { id: 'ash-snow', name: '재 눈', tone: 'caution', text: '화장장 쪽 바람이 이어집니다. 오후부터 재가 눈처럼 내리겠습니다. 내린 재는 쓸어 모아 지정 수거함에 넣어 주십시오. 재를 모으는 일과 소각 신고는 별개입니다.' },
        { id: 'red-rain', name: '붉은 비', tone: 'danger', text: '밤사이 붉은 비가 예보됐습니다. 빗물은 마시지 마십시오. 붉은 비 다음 날에는 기시체 신고가 늘 수 있습니다. 사망 신고와 소각 신고를 미루지 마십시오.' },
        { id: 'clear', name: '맑음', tone: 'ok', text: '재 농도가 낮겠습니다. 창문을 열어도 좋습니다. 농도가 낮은 것은 소각로가 멈췄다는 뜻일 수 있습니다. 가까운 화장장의 운영 공지를 확인해 주십시오.' },
        { id: 'stray-stars', name: '어긋난 별', tone: 'info', text: '오늘 밤 별자리가 어긋나 보일 수 있습니다. 하늘을 오래 보지 마십시오. 별의 위치는 신고하지 않으셔도 됩니다.' },
        { id: 'ash-fog', name: '잿빛 안개', tone: 'caution', text: '재와 안개가 섞여 시야가 50미터 아래로 떨어지겠습니다. 차량 운행을 줄여 주십시오. 안개 속에서 이름을 부르는 소리가 들리면 대답하기 전에 체온부터 확인하십시오.' }
      ]
    },

    // 수신 조각 — 세 번째 아나운서(2026-11-21 사용자 결정). 조각은 상황판·세계 기록·현장 지침에 하나씩 끼어 있다.
    // 받은 조각 id만 이 기기에 남는다(pc-core PCApp.signalMark). screen은 받지 못한 조각 자리에 보이는 위치 힌트다.
    signal: {
      title: '수신 조각 — 세 번째 아나운서',
      intro: '단말 곳곳의 기록에 같은 주파수의 잡음이 끼어 있다. 받은 조각은 이 단말에만 남고, 방송 순서대로 이어 붙인다.',
      missing: '수신되지 않음',
      author: '항구구 임시 송출 / 송출자 이름 없음',
      date: '2041.08.19 22:40경',
      record: '2041-08-19-harbor-delay-zone',
      recipient: '카르벤 격리시 항구구 주민',
      limit: '조각은 복원본이다. 방송 전체 길이와 원본 녹음이 남아 있는지는 확인되지 않았다. 수배 목록의 세 번째 아나운서와 같은 사람인지는 목소리 대조로만 추정됐다.',
      complete: '여섯 조각이 이어졌다. 방송은 여기서 표준 문안으로 돌아간다.',
      fragments: [
        { id: 'sig-1', order: 1, screen: '상황판', text: '이 방송은 표준 문안이 아닙니다.' },
        { id: 'sig-2', order: 2, screen: '세계 기록', text: '항구구 주민 여러분, 목록에 우리 구가 있습니다. 지연 구역이라고 적혀 있습니다.' },
        { id: 'sig-3', order: 3, screen: '현장 지침', text: '사이렌을 기다리지 마십시오. 오늘 밤 사이렌은 울리지 않습니다.' },
        { id: 'sig-4', order: 4, screen: '세계 기록', text: '대피 회랑은 열리지 않습니다. 북문으로 가십시오. 지금 가십시오.' },
        { id: 'sig-5', order: 5, screen: '현장 지침', text: '북문의 개가 짖지 않으면 통과입니다. 짐은 두고 가십시오.' },
        { id: 'sig-6', order: 6, screen: '세계 기록', text: '제 이름은 말하지 않겠습니다. 이름을 부르면 찾아올 테니까요. 이제 표준 문안으로 돌아갑니다.' },
        // 빈 자리의 밤에만 잡히는 덧붙은 조각 — 같은 주파수, 같은 목소리로 추정. 2041년 방송의 일부가 아니다.
        { id: 'sig-night', order: 7, screen: '빈 자리의 밤', epilogue: true, received: '2042년 동짓날 밤 수신 / 같은 주파수', text: '북문은 오늘 밤에도 열려 있지 않습니다. 그래도 가십시오. 저는 아직 여기 있습니다.' }
      ]
    },

    // 교단 축일(2026-11-21 사용자 결정) — 세계 기록 '교단 축일 달력'의 날짜. md는 월-일. 축일에는 방송 띠에 경계가 뜬다.
    // special은 그날 하루 단말 전체에 연출이 도는 축일이다(pc-core PCApp.feastToday, html[data-feast]).
    feasts: [
      { id: 'split-blood', name: '갈라선 피의 날', faction: '데드존 혈교', md: '02-21' },
      { id: 'rewritten-land', name: '다시 쓰인 땅의 날', faction: '타락교', md: '09-27' },
      { id: 'first-name', name: '첫 이름의 날', faction: '우시노다교 전체', md: '11-04' },
      {
        id: 'empty-seat-night', name: '빈 자리의 밤', faction: '그림자교', md: '12-22', special: true,
        note: '동짓날. 2026–2029년은 12월 22일이다.',
        broadcast: [
          '권역 안내 방송입니다. 오늘은 한 해에서 밤이 가장 긴 날입니다.',
          '해가 지면 밖에서 이름을 부르는 소리에 대답하지 마십시오.',
          '실내에서는 30분마다 가족의 이름을 서로 불러 주십시오.',
          '식탁의 빈 자리에는 앉지 마십시오. 침착하게 행동해 주십시오.'
        ]
      }
    ],

    // 오늘의 기록 한 장(2026-11-21 사용자 결정) — 세계 기록에서 날짜로 하나를 고른다. 여기에는 머리말만 둔다.
    daily: {
      title: '오늘의 기록 한 장',
      lead: '단말이 오늘 하루 맨 앞에 올려 두는 기록 조각이다. 날마다 바뀐다.'
    },

    // 수배 회람(2026-11-21 사용자 요청) — 수배자는 세계 기록 worldOrder의 수배 목록에서 읽는다. 여기에는 회람 머리말만 둔다.
    wanted: {
      title: '수배 회람',
      code: 'WANTED CIRCULAR / U.A.C · S.I.D',
      lead: 'U.A.C와 S.I.D가 함께 올린 수배 회람이다. 회람 맨 위에 오르는 호출명은 날마다 바뀐다.',
      report: '제보는 가까운 검문소로 한다. 호출명으로만 신고한다. 실명을 부르지 않는다.',
      limit: '혐의는 수배 기관의 주장이다. 판결 기록이 아니다.'
    },

    keyArt: {
      src: 'assets/resources/derived/remake-keyart-checkpoint-07-concept-v2.png',
      alt: '검문소 07 출입문 앞에 귀환자 네 명이 서 있고, 대원이 든 열상 판독 단말에는 인체 형상 다섯 개가 표시된 편집 키아트',
      label: 'EDITORIAL KEY ART / CHECKPOINT 07',
      caption: '설정 기반 편집 키아트 · 사건 원본이나 감시 화면으로 취급하지 않음 · 다섯 번째 열원의 신원은 확정되지 않았다'
    }
  });
})(window);
