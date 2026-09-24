// Project Curse 6 — 단말 음향·연출 설정. 소리 이름(cue)별 파일·기본 음량, 화면 이동에 붙는 사건 이름, 채널 인계 문구.
// 사건(event) 정의(버스·쿨다운·게인·덕킹)와 화면별 음량 프로필은 audio-manifest.js를, 채널 인계 문구는
// transition-manifest.js를 그대로 쓴다. 여기에는 새 단말에서 생긴 것만 둔다.
// 음량은 옛 단말이 조정해 둔 값(main.js의 clear 음원 표)을 기준으로 한다. 가이드 8절: 건조하고 낮게, 기본은 꺼짐.
(function (root) {
  'use strict';

  function freeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseTerminalFx = freeze({
    version: '6.0.0',
    audioBase: 'assets/audio/',
    ambient: { file: 'pc5152am_menu_old_computer.mp3', volume: 0.07 },
    // 소리 이름 → 파일·기본 음량. audio-manifest.js의 사건들이 쓰는 이름을 모두 갖춘다.
    cues: {
      contact: { file: 'pc5152h_terminal_contact_clear.wav', volume: 0.078 },
      analog: { file: 'pc5152f_analog_contact_soft.wav', volume: 0.06 },
      confirm: { file: 'pc5152h_frame_pop.wav', volume: 0.06 },
      page: { file: 'pc5152h_terminal_contact_clear.wav', volume: 0.062 },
      marker: { file: 'pc5152h_terminal_contact_clear.wav', volume: 0.052 },
      open: { file: 'pc5152h_record_mount_clear.wav', volume: 0.078 },
      load: { file: 'pc5152h_record_mount_clear.wav', volume: 0.08 },
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
        request: 'FIELD MANUAL REQUESTED',
        phases: ['REVISION CHECK', 'DOCTRINE LOAD', 'REGISTER OPEN'],
        status: 'MANUAL REV 2005.01.21 MOUNTED',
        sound: 'channel.command'
      }
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
    // 단말 기동 — 세션마다 한 번, 주소 없이 홈으로 들어왔을 때만. 값은 채널 레일 아래의 단말 표지와 같다.
    boot: [
      ['PC-03', 'U.A.C JOINT OPS TERMINAL'],
      ['OUTER RELAY', '2042'],
      ['EXTERNAL HANDSHAKE', 'NONE'],
      ['CENTRAL INDEX', 'FROZEN 2030.12'],
      ['LOCAL CONTROL', 'RESTORED']
    ]
  });
})(window);
