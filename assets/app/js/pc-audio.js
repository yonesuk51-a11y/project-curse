// Project Curse 6 — 음향. 효과음마다 쿨다운을 두고, 소리 하나는 낮게 낸다.
// 2026-09-25 사용자 결정: 기본은 켜짐(옛 5.54와 같다). 브라우저 규칙상 첫 클릭·터치 뒤부터 소리가 난다.
// 옛 사이트에서 소리를 꺼 둔 방문자(pc_audio_legacy2003_fixed='off' 또는 pc_audio_settings_v1.muted)는 꺼진 채로 둔다.
// 소리 이름(cue)·파일·기본 음량은 terminal-fx-data.js, 사건(event)의 버스·게인·쿨다운·덕킹과 화면별 음량 프로필은
// audio-manifest.js, 채널별 인계 소리는 transition-manifest.js를 그대로 쓴다.
// 화면 모듈은 window.PCAudio?.cue('operation.step')처럼 사건 이름으로 부른다. 꺼져 있으면 아무 일도 하지 않는다.
// 채널 이동·상세 열람·목록 복귀 소리는 pc-core.js의 'pc:route' 알림을 듣고 여기서 낸다. 화면이 따로 부르지 않는다.
// 이상 신호의 짧은 잡음과 위협 등급 '심각'의 낮은 울림은 음원 없이 Web Audio로 합성한다.
(function (root) {
  'use strict';

  const doc = root.document;
  const STORAGE_KEY = 'pc6_audio_v1';
  const fx = root.ProjectCurseTerminalFx || {};
  const manifest = root.ProjectCurseAudioManifest || {};
  const transitions = root.ProjectCurseTransitions?.screens || {};
  const events = manifest.events || {};
  const profiles = manifest.profiles || {};
  const cues = fx.cues || {};
  const BASE = fx.audioBase || 'assets/audio/';
  const DEFAULT_COOLDOWN = 220;

  // 옛 사이트에서 꺼 두었는지 — 새 설정이 없을 때만 본다
  function legacyMuted() {
    try {
      if (root.localStorage.getItem('pc_audio_legacy2003_fixed') === 'off') return true;
      const saved = JSON.parse(root.localStorage.getItem('pc_audio_settings_v1') || 'null');
      return !!(saved && saved.muted);
    } catch (_error) {
      return false;
    }
  }

  let on = true;
  try {
    const stored = root.localStorage.getItem(STORAGE_KEY);
    on = stored === null ? !legacyMuted() : stored === 'on';
  } catch (_error) { /* 저장소를 쓸 수 없으면 기본값(켜짐)을 따른다 */ }

  const players = new Map();
  const lastPlayed = new Map();
  let ambient = null;
  let profileId = 'terminal-home';
  let duck = 1;
  let duckTimer = 0;
  let unlocked = !!root.navigator?.userActivation?.hasBeenActive;

  const clamp = (value) => Math.max(0, Math.min(1, Number(value) || 0));
  const busGain = (bus) => Number((profiles[profileId] || profiles.document || {})[bus] ?? 1);

  function player(name) {
    const cue = cues[name];
    if (!cue) return null;
    if (!players.has(name)) {
      const audio = new Audio(BASE + cue.file);
      audio.preload = 'auto';
      players.set(name, audio);
    }
    return players.get(name);
  }

  function applyAmbient() {
    if (ambient) ambient.volume = clamp((fx.ambient?.volume || 0) * busGain('ambient') * duck);
  }

  // 소리 하나를 낸다. 덕킹이 있으면 환경음을 잠깐 낮춘다.
  function sound(name, options = {}) {
    if (!on || doc.hidden) return false;
    const { gain = 1, bus = 'interface', cooldown = DEFAULT_COOLDOWN, key = name, duckTo = null, duckMs = 0 } = options;
    const now = Date.now();
    if (now - (lastPlayed.get(key) || 0) < cooldown) return false;
    const audio = player(name);
    if (!audio) return false;
    lastPlayed.set(key, now);
    audio.volume = clamp((cues[name].volume || 0) * gain * busGain(bus));
    if (duckTo != null && duckMs > 0) {
      duck = clamp(duckTo);
      applyAmbient();
      root.clearTimeout(duckTimer);
      duckTimer = root.setTimeout(() => {
        duck = 1;
        applyAmbient();
      }, duckMs);
    }
    try {
      audio.currentTime = 0;
      const result = audio.play();
      if (result && result.catch) result.catch(() => {});
    } catch (_error) {
      return false;
    }
    return true;
  }

  // 사건 이름으로 부른다(audio-manifest.js events). 사건이 아니면 소리 이름으로 본다.
  function cue(eventName) {
    const event = events[eventName];
    if (!event) return sound(eventName);
    return sound(event.cue, {
      gain: event.gain ?? 1,
      bus: event.bus || 'interface',
      cooldown: event.cooldown ?? DEFAULT_COOLDOWN,
      key: eventName,
      duckTo: event.duck ?? null,
      duckMs: event.duckMs || 0
    });
  }

  function startAmbient() {
    if (!on || !fx.ambient?.file || doc.hidden) return;
    if (!ambient) {
      ambient = new Audio(BASE + fx.ambient.file);
      ambient.loop = true;
    }
    applyAmbient();
    const result = ambient.play();
    if (result && result.catch) result.catch(() => {});
  }

  function stopAmbient() {
    if (ambient) ambient.pause();
  }

  /* ---------- 합성음: 이상 신호 잡음, 심각 등급의 낮은 울림 ---------- */

  let context = null;
  function audioContext() {
    if (!unlocked) return null;
    const Ctor = root.AudioContext || root.webkitAudioContext;
    if (!Ctor) return null;
    if (!context) context = new Ctor();
    if (context.state === 'suspended') context.resume().catch(() => {});
    return context;
  }

  // 짧은 잡음 — 가운데가 불룩한 대역 잡음. 0.06 이하로 낮게.
  function noise({ ms = 140, gain = 0.045, freq = 1800 } = {}) {
    if (!on || doc.hidden) return false;
    const ctx = audioContext();
    if (!ctx) return false;
    const length = Math.floor(ctx.sampleRate * ms / 1000);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = freq;
    band.Q.value = 0.8;
    const amp = ctx.createGain();
    amp.gain.value = Math.min(0.06, gain) * busGain('alert');
    src.connect(band).connect(amp).connect(ctx.destination);
    src.start();
    return true;
  }

  // 낮은 울림 — 심각 등급 화면에 머무는 동안만 아주 작게 깔린다.
  let drone = null;
  function droneOn() {
    if (!on || drone || doc.hidden) return;
    const ctx = audioContext();
    if (!ctx) return;
    const amp = ctx.createGain();
    amp.gain.value = 0;
    const low = ctx.createOscillator();
    low.type = 'sine';
    low.frequency.value = 43;
    const beat = ctx.createOscillator();
    beat.type = 'sine';
    beat.frequency.value = 46.5;
    low.connect(amp);
    beat.connect(amp);
    amp.connect(ctx.destination);
    low.start();
    beat.start();
    amp.gain.linearRampToValueAtTime(0.035 * busGain('ambient'), ctx.currentTime + 2.4);
    drone = { amp, oscs: [low, beat], ctx };
  }
  function droneOff() {
    if (!drone) return;
    const { amp, oscs, ctx } = drone;
    drone = null;
    amp.gain.cancelScheduledValues(ctx.currentTime);
    amp.gain.setValueAtTime(amp.gain.value, ctx.currentTime);
    amp.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
    oscs.forEach((osc) => osc.stop(ctx.currentTime + 1.3));
  }

  /* ---------- 켜기·끄기 ---------- */

  function render() {
    doc.querySelectorAll('[data-tc-audio]').forEach((button) => {
      button.setAttribute('aria-pressed', String(on));
      const state = button.querySelector('b');
      if (state) state.textContent = on ? 'ON' : 'OFF';
    });
    doc.documentElement.dataset.audio = on ? 'on' : 'off';
    doc.dispatchEvent(new CustomEvent('pc:audio', { detail: { on } }));
  }

  function set(value, options = {}) {
    on = !!value;
    try {
      root.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
    } catch (_error) { /* 저장하지 못해도 이번 방문에서는 따른다 */ }
    if (on) {
      startAmbient();
      if (!options.quiet) cue('channel.request');
      if (doc.documentElement.dataset.threat === 'critical') droneOn();
    } else {
      stopAmbient();
      droneOff();
    }
    render();
  }

  // 사용자 조작 안에서 부른다(기동 접속 단추 등). 브라우저가 소리를 허락하게 하고 환경음을 시작한다.
  function unlock() {
    unlocked = true;
    audioContext();
    startAmbient();
  }

  // 화면별 음량 프로필 — 주소가 길게 맞는 것부터 찾는다. 없으면 화면 id, 그래도 없으면 문서 프로필.
  function pickProfile(route, parts) {
    const map = fx.profiles || {};
    for (let n = parts.length; n >= 0; n--) {
      const key = [route, ...parts.slice(0, n)].join('/');
      if (map[key]) return map[key];
    }
    if (parts.length && map[`${route}/*`]) return map[`${route}/*`];
    return profiles[route] ? route : 'document';
  }

  let handoffTimer = 0;
  // 이동 소리 — 채널이 바뀌면 요청음 뒤에 채널 인계음(옛 단말의 요청·인계 두 소리), 같은 채널에서 상세로 들어가면 열람음, 목록으로 돌아오면 복귀음.
  doc.addEventListener('pc:route', (event) => {
    const detail = event.detail || {};
    const parts = detail.parts || [];
    profileId = pickProfile(detail.route, parts);
    applyAmbient();
    if (detail.reason === 'initial' || detail.reason === 'same') return;
    if (detail.screenChanged) {
      cue('channel.request');
      const handoff = (transitions[detail.route] || fx.handoff?.[detail.route])?.sound;
      root.clearTimeout(handoffTimer);
      if (handoff) handoffTimer = root.setTimeout(() => cue(handoff), 620);
      return;
    }
    const nav = fx.navigation?.[detail.route];
    if (!nav) return;
    if (!parts.length) {
      if ((detail.previousParts || []).length && nav.back) cue(nav.back);
      return;
    }
    const open = typeof nav.open === 'string' ? nav.open : nav.open?.[parts[0]];
    if (open) cue(open);
  });

  // 위협 등급 — 심각으로 올라가면 낮은 경고음 한 번과 울림, 내려가면 울림을 걷는다.
  const THREAT_ORDER = ['low', 'guarded', 'elevated', 'high', 'critical'];
  doc.addEventListener('pc:threat', (event) => {
    const { level, previous } = event.detail || {};
    if (level === 'critical') {
      if (previous && THREAT_ORDER.indexOf(previous) < THREAT_ORDER.indexOf('critical')) cue('system.alert');
      droneOn();
    } else {
      droneOff();
    }
  });

  doc.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-tc-audio]');
    if (toggle) {
      unlocked = true;
      set(!on);
      return;
    }
    // 화면이 정해 둔 소리가 있으면 그것을, 없으면 버튼·펼침에 아주 짧은 접점음. 링크는 이동 소리가 맡는다.
    const tagged = event.target.closest('[data-tc-cue]');
    if (tagged) {
      cue(tagged.dataset.tcCue);
      return;
    }
    if (event.target.closest('button, summary')) cue('archive.filter');
  });

  doc.addEventListener('visibilitychange', () => {
    if (!on) return;
    if (doc.hidden) {
      stopAmbient();
      droneOff();
    } else {
      startAmbient();
      if (doc.documentElement.dataset.threat === 'critical') droneOn();
    }
  });

  // 자동 재생 제한 — 켜져 있으면 첫 조작 때 환경음을 시작한다(기동 화면의 접속 단추도 여기서 풀린다).
  const resume = () => {
    unlocked = true;
    doc.removeEventListener('pointerdown', resume, true);
    doc.removeEventListener('keydown', resume, true);
    if (on) {
      startAmbient();
      if (doc.documentElement.dataset.threat === 'critical') droneOn();
    }
  };
  doc.addEventListener('pointerdown', resume, true);
  doc.addEventListener('keydown', resume, true);

  root.PCAudio = Object.freeze({ cue, play: sound, noise, set, unlock, isOn: () => on });
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', render, { once: true });
  else render();
})(window);
