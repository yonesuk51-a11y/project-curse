// Project Curse 6 — 단말 음향·연출 설정. 소리 이름(cue)별 파일·기본 음량, 화면 이동에 붙는 사건 이름, 기동·인계·이상 신호 문구.
// 사건(event) 정의(버스·쿨다운·게인·덕킹)와 화면별 음량 프로필은 audio-manifest.js를, 채널 인계 문구는
// transition-manifest.js를 그대로 쓴다. 여기에는 새 단말에서 생긴 것만 둔다.
// 음량과 기동 문구는 옛 5.54 단말 값(tools/fixtures/legacy-app/assets/js/core/base-runtime.js, loading-sequence.js)을 되살렸다.
// 2026-09-25 사용자 결정: 효과음 기본 켜짐, 홈은 접속 확인 뒤 옛 기동(약 8.9초), 공유 링크로 바로 들어오면 2초.
(function (root) {
  'use strict';

  function freeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseTerminalFx = freeze({
    version: '6.1.0',
    audioBase: 'assets/audio/',
    ambient: { file: 'pc5152am_menu_old_computer.mp3', volume: 0.088 },
    // 소리 이름 → 파일·기본 음량. audio-manifest.js의 사건들이 쓰는 이름을 모두 갖춘다.
    cues: {
      contact: { file: 'pc5152h_terminal_contact_clear.wav', volume: 0.078 },
      analog: { file: 'pc5152f_analog_contact_soft.wav', volume: 0.06 },
      confirm: { file: 'pc5152h_frame_pop.wav', volume: 0.06 },
      page: { file: 'pc5152p_internal_projector_vhs_step.wav', volume: 0.058 },
      marker: { file: 'pc5152v_field_photo_click_42s.mp3', volume: 0.054 },
      open: { file: 'pc5152h_record_mount_clear.wav', volume: 0.078 },
      load: { file: 'pc5152h_record_mount_clear.wav', volume: 0.08 },
      mount: { file: 'pc5152f_record_mount_soft.wav', volume: 0.06 },
      radio: { file: 'pc5152v_comm_line_cue_73_74.mp3', volume: 0.064 },
      scan: { file: 'pc5152x_late_log_beep_195s.mp3', volume: 0.05 },
      projector: { file: 'pc5152p_internal_projector_vhs_step.wav', volume: 0.06 },
      boot: { file: 'pc5152f_boot_access_oldpc.wav', volume: 0.06 },
      alert: { file: 'pc5152f_low_denied_oldpc.wav', volume: 0.058 },
      restricted: { file: 'pc5152f_low_denied_oldpc.wav', volume: 0.064 },
      denied: { file: 'pc5152f_low_denied_oldpc.wav', volume: 0.06 }
    },
    // 같은 채널 안에서 상세로 들어가거나(open) 목록으로 돌아올 때(back) 부르는 사건.
    // map-room은 주소 두 번째 조각(op·pilgrimage·verdict…)마다 다르다.
    navigation: {
      'map-room': {
        open: { op: 'map.brief', pilgrimage: 'pilgrimage.enter', verdict: 'record.mount', region: 'map.signal', marker: 'map.signal', incident: 'map.signal', synchrony: 'map.signal' },
        back: 'menu.close'
      },
      history: { open: 'history.open', back: 'history.back' },
      'faction-info': { open: 'faction.open', back: 'faction.back' },
      'archive-entry': { open: 'record.mount', back: 'evidence.close' },
      personnel: { open: 'record.page', back: 'menu.close' },
      'media-audit': { open: 'evidence.open', back: 'evidence.close' }
    },
    // 작전 경과 재생 — 단계의 가장 나쁜 부대 상태에 따라 다른 소리. 부대가 갈라지거나 소실되면 낮은 거부음.
    stepCues: { normal: 'operation.step', unstable: 'map.signal', unknown: 'map.signal', split: 'system.denied', lost: 'system.denied' },
    // 순례·귀환 심사·전진 회수의 시작·선택·규칙 위반·완료 소리(audio-manifest.js의 사건 이름)
    scenarioCues: {
      'unlit-fortress': { start: 'pilgrimage.enter', step: 'pilgrimage.step', danger: 'pilgrimage.danger', complete: 'pilgrimage.complete' },
      'deadzone-return': { start: 'screening.enter', step: 'screening.step', danger: 'screening.mismatch', complete: 'screening.complete' },
      'deadzone-recovery': { start: 'recovery.enter', step: 'recovery.tether', danger: 'recovery.echo', complete: 'recovery.complete' }
    },
    // 부서진 왕관 지휘 판단을 저장할 때
    verdictCue: 'scenario.complete',
    // 옛 인계 문구(transition-manifest.js)에 없는 새 채널
    handoff: {
      'field-manual': {
        code: 'FIELD MANUAL',
        request: 'FIELD MANUAL REQUESTED',
        phases: ['REVISION CHECK', 'DOCTRINE LOAD', 'REGISTER OPEN'],
        status: 'MANUAL REV 2005.01.21 MOUNTED',
        sound: 'channel.command'
      }
    },
    // 화면 인계 막 — 옛 transition-controller.js의 덮기·단계·드러내기. 밀리초.
    handoffTiming: {
      desktop: { phases: [180, 420, 660], status: 860, reveal: 1120, out: 260 },
      mobile: { phases: [140, 320, 500], status: 640, reveal: 840, out: 220 },
      reduced: { reveal: 520, out: 0 }
    },
    // 화면별 음량 프로필 — audio-manifest.js의 profiles 이름. 없으면 화면 id를 쓴다.
    profiles: {
      'field-manual': 'guide',
      'map-room/pilgrimage/deadzone-recovery': 'recovery-scenario',
      'map-room/pilgrimage': 'scenario',
      'archive-entry/Dead_Zone_Pilgrimage': 'dead-zone',
      'archive-entry/Great_Black_Forest_Region': 'great-black-forest',
      'archive-entry/Pilgrim_Rules_GBF': 'great-black-forest',
      'archive-entry/Civil_Child_Drill': 'guide',
      'archive-entry/NHC_Manual_891219': 'guide',
      'archive-entry/*': 'document'
    },
    // 기동 — 옛 loading-sequence.js 문구와 시간. 줄은 [표지, 내용, 결과, 강조]. starts/ends는 줄마다 확인 시작·끝(밀리초).
    // 줄임 모드에서는 같은 문구를 움직임 없이 reducedScale 배율의 시간으로 보여 준다.
    boot: {
      reducedScale: 0.32,
      gate: {
        kicker: 'U.A.C 합동작전 단말 / PC-03',
        title: '단말 접속',
        lines: ['외부망은 끊겼다. 로컬 단말만 응답한다.', '누르면 단말을 깨웁니다. 소리가 함께 납니다.'],
        enter: '접속',
        silent: '소리 없이 접속',
        note: '소리는 오른쪽 위 단추로 언제든 끌 수 있습니다.'
      },
      cold: {
        kicker: 'U.A.C 합동작전 단말 / PC-03',
        title: '로컬 단말기 기동',
        duration: 8200,
        finish: 700,
        skipAfter: 2600,
        lines: [
          ['PC-03', '로컬 커널 및 권한 검사', 'OK'],
          ['AUDIO', '로컬 중계 채널 연결', 'LINKED'],
          ['ARCHIVE', '폐쇄 기록 색인 복구', 'RECOVERED'],
          ['CARTO', '관제 좌표 계층 동기화', 'PARTIAL', 'caution'],
          ['RZ/881120', '레드라인 흔적 검사', 'DETECTED', 'danger'],
          ['ACCESS', '현장 열람 권한 봉인', 'GRANTED']
        ],
        starts: [420, 1450, 2550, 3850, 5150, 6450],
        ends: [1150, 2180, 3320, 4650, 5950, 7350],
        gates: ['LINK', 'INDEX', 'VERIFY', 'ACCESS'],
        footer: ['COLD BOOT', 'FINAL ACCESS HOLD', 'ACCESS GRANTED / CHANNEL STABLE'],
        skip: '기동 건너뛰기'
      },
      link: {
        kicker: 'LINKED ACCESS / PC-03',
        title: '공유 주소 접속',
        duration: 1700,
        finish: 300,
        lines: [
          ['LINK', '공유 주소 확인', 'VERIFIED'],
          ['CHANNEL', '요청 채널 연결', 'OPEN'],
          ['ACCESS', '열람 권한 확인', 'GRANTED']
        ],
        starts: [80, 520, 1000],
        ends: [420, 900, 1450]
      },
      restore: {
        kicker: 'LOCAL SESSION / PC-03',
        title: '세션 복원',
        duration: 1200,
        finish: 180,
        lines: [
          ['SESSION', '이전 로컬 세션 확인', 'FOUND'],
          ['CHANNEL', '마지막 채널 상태 복구', 'RESTORED'],
          ['OPERATOR', '현장 열람 권한 확인', 'LIMITED', 'caution'],
          ['ACCESS', '로컬 채널 재봉인', 'GRANTED']
        ],
        starts: [80, 290, 520, 760],
        ends: [230, 470, 720, 1000]
      },
      unmount: {
        kicker: 'ARCHIVE RETURN / PC-03',
        title: '기록 언마운트',
        duration: 950,
        finish: 140,
        lines: [
          ['RECORD', '활성 기록 채널 분리', 'UNMOUNTED'],
          ['ARCHIVE', '공개 색인으로 복귀', 'READY'],
          ['ACCESS', '보관소 접근선 재연결', 'GRANTED']
        ],
        starts: [70, 280, 520],
        ends: [220, 470, 770]
      }
    },
    // 드문 이상 신호 — 화면이 data-tc-anomaly로 표시한 글자와 셸의 시계가 가끔 어긋났다가 돌아온다. 밀리초.
    anomaly: {
      firstDelay: 45000,
      gap: [60000, 150000],
      show: [650, 1050],
      maxLength: 32,
      nameAlt: '확인 불가',
      textAlt: '—'
    },
    // 자리 비움 — 탭을 떠나 있으면 탭 제목이 바뀐다. 문구는 홈 민간 방송(home-screen-data.js)에 이미 있는 안내다.
    away: {
      after: 1500,
      titles: [
        '[수신 대기] 밖에서 이름을 부르는 소리에는 대답하지 마십시오',
        '[경보색 빨강] 창문에서 떨어지십시오',
        '[대기] 부를 때까지 자리를 옮기지 마십시오',
        '[PC-03] 열람자 응답 없음'
      ]
    },
    // 삼야 무응답 기념일 — 매년 10월 31일 02:17부터 61시간 1분(2042-10-31 기록과 같은 길이). 기록에 시간대가 없어 단말 시계(UTC)에 맞춘다.
    silence: {
      month: 10,
      day: 31,
      hour: 2,
      minute: 17,
      minutes: 3661,
      label: '외부 교신 두절',
      code: 'SYNC-2042-1031',
      record: '2042-10-31-three-night-silence'
    }
  });
})(window);
