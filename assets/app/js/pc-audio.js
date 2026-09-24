// Project Curse 6 — 음향. 가이드 8절: 건조하고 낮게, 기본은 꺼짐, 효과음마다 쿨다운.
// 소리 이름(cue)·파일·기본 음량은 terminal-fx-data.js, 사건(event)의 버스·게인·쿨다운·덕킹과 화면별 음량 프로필은
// audio-manifest.js, 채널별 인계 소리는 transition-manifest.js를 그대로 쓴다.
// 화면 모듈은 window.PCAudio?.cue('operation.step')처럼 사건 이름으로 부른다. 꺼져 있으면 아무 일도 하지 않는다.
// 채널 이동·상세 열람·목록 복귀 소리는 pc-core.js의 'pc:route' 알림을 듣고 여기서 낸다. 화면이 따로 부르지 않는다.
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

  let on = false;
  try {
    on = root.localStorage.getItem(STORAGE_KEY) === 'on';
  } catch (_error) { /* 저장소를 쓸 수 없으면 꺼진 채로 둔다 */ }

  const players = new Map();
  const lastPlayed = new Map();
  let ambient = null;
  let profileId = 'terminal-home';
  let duck = 1;
  let duckTimer = 0;

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
    if (!fx.ambient?.file) return;
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

  function render() {
    doc.querySelectorAll('[data-tc-audio]').forEach((button) => {
      button.setAttribute('aria-pressed', String(on));
      const state = button.querySelector('b');
      if (state) state.textContent = on ? 'ON' : 'OFF';
    });
    doc.documentElement.dataset.audio = on ? 'on' : 'off';
  }

  function set(value) {
    on = !!value;
    try {
      root.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
    } catch (_error) { /* 저장하지 못해도 이번 방문에서는 따른다 */ }
    if (on) {
      startAmbient();
      cue('channel.request');
    } else {
      stopAmbient();
    }
    render();
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

  // 이동 소리 — 채널이 바뀌면 채널 인계음, 같은 채널에서 상세로 들어가면 열람음, 목록으로 돌아오면 복귀음.
  doc.addEventListener('pc:route', (event) => {
    const detail = event.detail || {};
    const parts = detail.parts || [];
    profileId = pickProfile(detail.route, parts);
    applyAmbient();
    if (detail.reason === 'initial' || detail.reason === 'same') return;
    if (detail.screenChanged) {
      cue((transitions[detail.route] || fx.handoff?.[detail.route])?.sound || 'channel.request');
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

  doc.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-tc-audio]');
    if (toggle) {
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
    if (doc.hidden) stopAmbient();
    else startAmbient();
  });

  // 자동 재생 제한 — 저장된 설정이 켜짐이면 첫 조작 때 환경음을 시작한다.
  if (on) {
    const resume = () => {
      doc.removeEventListener('pointerdown', resume);
      doc.removeEventListener('keydown', resume);
      if (on) startAmbient();
    };
    doc.addEventListener('pointerdown', resume);
    doc.addEventListener('keydown', resume);
  }

  root.PCAudio = Object.freeze({ cue, play: sound, set, isOn: () => on });
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', render, { once: true });
  else render();
})(window);
