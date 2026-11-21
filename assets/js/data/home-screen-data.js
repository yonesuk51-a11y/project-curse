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
    // 2026-11-21 사용자 추천안 승인 — 합동 작전 공고. 주마다 한 건(모두에게 같은 공고). 참가자가 같은 작전을 각자 자캐의 자리에서 쓴다.
    // 공고는 교류용 글감이다. 공식 기록의 사건이 아니다. 결과는 정하지 않는다.
    bulletins: {
      title: '이번 주 합동 작전 공고',
      lead: '같은 작전을 각자의 자캐 자리에서 써 주세요. 결과는 정해져 있지 않습니다. 교전 보고서와 분대 편성표 양식을 함께 쓸 수 있습니다.',
      note: '공고는 교류용 글감이며 공식 기록이 아닙니다. 서로의 글이 어긋나면 둘 다 남깁니다.',
      items: [
        { code: 'JOP-01', title: '카르벤 북문 봉인 열차 호송', place: '카르벤 격리시 북문 → 굴뚝구',
          situation: '화요일 봉인 열차 맨 뒤 두 칸이 굴뚝구로 간다. 이번 주 북문 탐지견 한 마리가 열차 앞에서 짖지 않았다. 호송 인원을 늘린다.',
          roe: ['열차 문은 굴뚝구 소각 대기실 앞에서만 연다.', '칸 안에서 소리가 나도 멈추지 않는다. 시각만 적는다.', '탐지견이 짖지 않은 칸은 따로 적는다.'],
          seats: '조장·계측수·사수·회수·통신, 탐지견 조 하나', prompts: ['열차가 굴뚝구에 닿기 전 마지막 10분.', '짖지 않은 개를 맡은 사람의 밤.', '소각 대기실 앞에서 문을 연 사람.'],
          link: { label: '카르벤 격리시', route: ['history', 'ref', 'karven'] } },
        { code: 'JOP-02', title: '대흑림 성채 피난로 재측량', place: '대흑림 외연 성채 → 넷째 갈림길',
          situation: '성채 피난로의 넷째 갈림길 거리가 다시 늘었다. 등록 길손 한 명이 동행한다. 길손은 묻지 않은 길을 알려 주지 않는다.',
          roe: ['길손에게 물을 질문은 출발 전에 정해 둔다.', '탄피를 던져 거리를 먼저 잰다.', '해가 지기 전에 성채 문으로 돌아온다.'],
          seats: '조장·계측수·사수·통신, 협력원(길손)', prompts: ['길손에게 무엇을 물었고 무엇을 묻지 못했는가.', '지도와 걸음 수가 어긋난 순간.', '해가 지기 직전의 성채 문.'],
          link: { label: '도래자 — 길손', route: ['history', 'ref', 'arrival-gilson'] } },
        { code: 'JOP-03', title: '북해 해상 차단선 부표 수리', place: '북해권 해상 차단선 부표 17–22 구간',
          situation: '부표 17–22 구간이 다시 꺼졌다. 수리선 한 척을 호위한다. 2038년 매복이 있었던 구간이다.',
          roe: ['등화 없는 배는 탐조등을 비추고 시각을 적는다.', '연료와 수리 장비 근처로는 쏘지 않는다.', '수중 작업 중에는 물손 협력원의 신호를 우선한다.'],
          seats: '조장·계측수·사수·통신, 협력원(물손) 가능', prompts: ['부표가 다시 켜지기까지.', '물 아래에서 본 것.', '레이더에 잡혔다 사라진 반응.'],
          link: { label: '북해 연료선 호송 매복', route: ['history', 'ref', 'battle-fuel-convoy'] } },
        { code: 'JOP-04', title: '데드존 검문소 대조 근무 지원', place: '데드존 서부 검문소',
          situation: '귀환자가 한 주에 세 무리 들어온다. 검문소 인력이 모자라 대조 근무를 지원한다. 자동 판정에 서명할 사람이 필요하다.',
          roe: ['기계 판정에 서명하거나 보류한다. 서명한 판정은 서명한 사람의 판정이다.', '육안·열상·무전 계수가 다르면 전원을 분리 대기시킨다.', '가족 면회는 기억 대조 뒤에 허락한다.'],
          seats: '대조 근무자 둘, 사수, 통신, S.I.D 면담 하나', prompts: ['서명하지 못한 한 사람.', '열원이 하나 더 많았던 무리.', '면회실 문 앞에서 기다린 가족.'],
          link: { label: '검문소 07', route: ['history', '2029-04-12-checkpoint-07'] } },
        { code: 'JOP-05', title: '도시 폐쇄시설 기록 상자 회수', place: '도시 폐쇄시설 지하 2층',
          situation: 'A.R.F 회수조가 폐쇄시설 지하에 남은 기록 상자 여섯 개를 가져온다. 지난 회수조는 상자 다섯 개와 함께 돌아왔다. 출발 인원은 여섯이었다.',
          roe: ['들어갈 때, 나올 때, 인계할 때 인원을 따로 센다.', '상자는 열지 않는다. 봉인 운반함에 넣는다.', '같은 복도가 반복되면 멈춘다.'],
          seats: '조장·계측수·사수·회수·통신', prompts: ['지난 회수조의 여섯 번째 사람.', '상자 안에서 들린 소리.', '인계 서명란 앞에서.'],
          link: { label: '현장 지침 — 현장 절차', route: ['field-manual', 'field'] } },
        { code: 'JOP-06', title: '남방 해안 피난 선단 접안 엄호', place: '연안 자치시 연맹 해안',
          situation: '피난 선단 일곱 척이 해안 접근을 요청했다. 해변에 철수선 셋을 긋는다. 2037년 철수선과 같은 해변이다.',
          roe: ['체온이 있으면 피탈자다. 구속을 먼저 한다.', '철수선은 하나씩 물러난다. 물러날 때 줄을 긋는다.', '마지막 배가 떠날 때 계수한다.'],
          seats: '분대 셋, 연맹 해안 경비', prompts: ['제1선에서 물러나던 순간.', '배에 오르지 못한 사람.', '조명탄 빛 아래의 계수.'],
          link: { label: '남방 해안 철수선', route: ['history', 'ref', 'battle-coast-lines'] } },
        { code: 'JOP-07', title: '서부 순례 회랑 보관함 순찰', place: '서부 귀환 회랑 보관함',
          situation: '보관함에 남긴 쪽지 가운데 답이 적힌 쪽지가 나왔다. 쪽지를 남긴 사람은 아직 돌아오지 않았다. 회랑을 순찰하고 쪽지를 회수한다.',
          roe: ['쪽지는 읽지 않고 봉투에 넣는다.', '부르는 소리에 대답하지 않는다.', '보관함 앞에서는 둘 이상이 함께 선다.'],
          seats: '조장·계측수·사수·통신', prompts: ['답이 적힌 쪽지.', '회랑 끝에서 들린 이름.', '보관함에 무엇을 남겼는가.'],
          link: { label: '보관함에 남긴 쪽지', route: ['archive-entry', 'Returner_Note_West'] } },
        { code: 'JOP-08', title: '아랫역 배급 호송', place: '카르벤 격리시 아랫역 첫째·둘째 역',
          situation: '응답하는 두 역에 배급을 나른다. 셋째 역 방벽 앞을 지나야 한다. 지난주 방벽 너머에서 안내 방송이 다시 들렸다.',
          roe: ['방벽 앞에서는 멈추지 않는다.', '안내 방송이 부르는 역 이름을 세지 않는다. 시각만 적는다.', '배급 수와 받은 사람 수를 따로 센다.'],
          seats: '조장·계측수·사수·회수·통신', prompts: ['방벽 앞을 지나는 30초.', '배급을 받으러 나온 사람 수가 하나 많았던 날.', '방송이 부른 넷째 역.'],
          link: { label: '카르벤 아랫역 셋째 역 돌입', route: ['history', 'ref', 'battle-third-station'] } }
      ],
      // 2026-11-22 사용자 추천안 승인 — 네 주에 걸쳐 이어지는 공고. 홑 공고 여덟 주 뒤에 네 주가 이어진다(열두 주 주기).
      // 결과는 정하지 않는다. 마지막 주에 서로 다른 조가 쓴 종결 보고 셋을 함께 올린다.
      arc: {
        code: 'JOP-ARC1',
        title: '굴뚝구로 가는 셋째 칸',
        steps: [
          { title: '봉인 열차에 칸이 하나 늘었다', place: '카르벤 격리시 북문 봉인 열차 정거장',
            situation: '화요일 봉인 열차의 맨 뒤 칸이 셋이었다. 장부에는 둘이다. 셋째 칸에는 봉인 표지가 없다. 이번 주 호송조는 칸 수부터 다시 센다.',
            roe: ['칸 수를 육안, 열상, 정거장 장부로 따로 센다.', '셋째 칸 문은 열지 않는다.', '세 수가 다르면 열차를 세우지 않고 시각만 적는다.'],
            seats: '조장·계측수·사수·회수·통신', prompts: ['정거장에서 칸을 센 사람.', '장부에 셋째 칸을 적을지 말지 정한 사람.', '셋째 칸 창문에 비친 것.'],
            link: { label: '카르벤 격리시', route: ['history', 'ref', 'karven'] } },
          { title: '셋째 칸 안의 소리', place: '북문 → 굴뚝구 선로',
            situation: '지난주 셋째 칸에서 이름을 부르는 소리가 들렸다는 보고가 올라왔다. S.I.D 면담반 한 명이 호송조에 탄다. 부르는 이름은 받아 적되 대답하지 않는다.',
            roe: ['부르는 이름에 대답하지 않는다.', '들린 이름은 면담반이 따로 적는다.', '셋째 칸 문은 여전히 열지 않는다.'],
            seats: '조장·계측수·사수·통신, S.I.D 면담 하나', prompts: ['셋째 칸이 부른 이름 가운데 아는 이름.', '대답하고 싶었던 순간.', '면담반이 받아 적은 목록.'],
            link: { label: '문틈에서 이름을 묻는 것', route: ['history', 'ref', 'door-asker'] } },
          { title: '굴뚝구 소각 대기실', place: '카르벤 굴뚝구 시립 화장장',
            situation: '셋째 칸이 굴뚝구에 닿았다. 소각 대기실 앞에서 두 칸만 문을 연다. 셋째 칸은 대기실을 지나 선로 끝, 2039년부터 연기가 나지 않는 굴뚝 쪽으로 밀려간다.',
            roe: ['소각 대기실 앞에서는 장부에 있는 두 칸만 연다.', '선로 끝으로 따라가지 않는다. 다음 주 명령을 기다린다.', '굴뚝구 장례 대행인의 진술을 받는다.'],
            seats: '조장·계측수·사수·회수·통신', prompts: ['선로 끝으로 밀려가는 칸을 본 사람.', '장례 대행인이 한 말.', '대기 번호를 받지 못한 사람.'],
            link: { label: '카르벤 굴뚝구', route: ['history', 'ref', 'karven'] } },
          { title: '꺼진 굴뚝', place: '굴뚝구 선로 끝, 꺼진 굴뚝',
            situation: '꺼진 굴뚝 아래로 진입한다. 셋째 칸을 확인하고 돌아온다. 이번 주로 공고를 닫는다. 결과는 조마다 다르게 보고됐다.',
            roe: ['들어갈 때, 나올 때, 인계할 때 따로 센다.', '셋째 칸을 열면 시각과 연 사람을 적는다.', '굴뚝 안으로는 들어가지 않는다.'],
            seats: '분대 셋', prompts: ['셋째 칸을 연 사람.', '굴뚝 아래에서 센 수.', '종결 보고에 적지 않은 것.'],
            link: { label: '교전 보고서 양식', route: ['field-manual', 'register'] } }
        ],
        endings: [
          '종결 보고 A — 셋째 칸은 비어 있었다. 장부의 두 칸과 수가 맞았다. 호송 인원 한 명이 다음 날 배급 줄 끝에 서 있었다.',
          '종결 보고 B — 셋째 칸 안에는 2041년 항구구 주민 명부가 있었다. 명부의 이름은 모두 지워져 있었다.',
          '종결 보고 C — 꺼진 굴뚝에서 연기가 났다. 그날 소각 장부에 적힌 이름은 없다.'
        ],
        endingsNote: '세 보고는 서로 다른 조가 썼다. 합치지 않는다. 어느 쪽으로 이어 써도 된다.'
      }
    },
    // 2026-11-22 사용자 추천안 승인 — 둑시장 시세. 세계 기록 '배급 밖의 값'의 표가 기준이다. 날마다 범위 안에서 움직인다(같은 날 같은 값).
    prices: {
      title: '둑시장 시세',
      lead: '카르벤 둑시장 노점 게시판을 옮겼다. 배급증 밖의 값이다.',
      items: [
        { give: '연료 쿠폰 1장', get: '통조림', unit: '개', base: 2, spread: 1 },
        { give: '소금 한 줌', get: '붕대', unit: '롤', base: 1, spread: 1 },
        { give: '빈 탄피 열', get: '라디오', unit: '분', base: 60, spread: 20 },
        { give: '잔류물 하나', get: '연료 쿠폰', unit: '장', base: 5, spread: 2 },
        { give: '이름 하루치', get: '연료 쿠폰', unit: '장', base: 20, spread: 6 }
      ],
      note: '이름 하루치는 남의 대조 문항 하나를 대신 답해 주는 일이다. 걸리면 둘 다 배급이 끊긴다.'
    },
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
