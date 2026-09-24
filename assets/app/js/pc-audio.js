// Project Curse 6 — 음향. 가이드 8절: 건조하고 낮게, 기본은 꺼짐, 효과음마다 쿨다운.
// 파일 목록은 site-manifest.js의 audio 항목을 그대로 쓴다.
// 화면 모듈은 window.PCAudio?.play('marker') 처럼 부른다. 꺼져 있으면 아무 일도 하지 않는다.
(function (root) {
  'use strict';

  const doc = root.document;
  const STORAGE_KEY = 'pc6_audio_v1';
  const BASE = 'assets/audio/';
  const manifest = root.ProjectCurseStructure?.audio || {};
  const effects = manifest.effects || {};
  const GAIN = { ambient: 0.16, effect: 0.34 };
  const COOLDOWN_MS = 260;

  let on = false;
  try {
    on = root.localStorage.getItem(STORAGE_KEY) === 'on';
  } catch (_error) { /* 저장소를 쓸 수 없으면 꺼진 채로 둔다 */ }

  const players = new Map();
  const lastPlayed = new Map();
  let ambient = null;

  function player(cue) {
    const file = effects[cue];
    if (!file) return null;
    if (!players.has(cue)) {
      const audio = new Audio(BASE + file);
      audio.preload = 'auto';
      audio.volume = GAIN.effect;
      players.set(cue, audio);
    }
    return players.get(cue);
  }

  function play(cue) {
    if (!on || doc.hidden) return false;
    const now = Date.now();
    if (now - (lastPlayed.get(cue) || 0) < COOLDOWN_MS) return false;
    const audio = player(cue);
    if (!audio) return false;
    lastPlayed.set(cue, now);
    try {
      audio.currentTime = 0;
      const result = audio.play();
      if (result && result.catch) result.catch(() => {});
    } catch (_error) {
      return false;
    }
    return true;
  }

  function startAmbient() {
    if (!manifest.ambient) return;
    if (!ambient) {
      ambient = new Audio(BASE + manifest.ambient);
      ambient.loop = true;
      ambient.volume = GAIN.ambient;
    }
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
      play('contact');
    } else {
      stopAmbient();
    }
    render();
  }

  doc.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-tc-audio]');
    if (toggle) {
      set(!on);
      return;
    }
    // 링크·버튼을 누를 때 아주 짧은 접점 소리
    if (event.target.closest('a[href^="#"], button, summary')) play('analog');
  });

  // 채널이 바뀌면 무전 신호음. 같은 채널 안의 이동은 판독음.
  let lastScreen = '';
  root.addEventListener('hashchange', () => {
    const screen = doc.body.dataset.screen || '';
    root.setTimeout(() => {
      const next = doc.body.dataset.screen || '';
      play(next !== lastScreen ? 'radio' : 'marker');
      lastScreen = next;
    }, 0);
    lastScreen = lastScreen || screen;
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

  root.PCAudio = Object.freeze({ play, set, isOn: () => on });
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', render, { once: true });
  else render();
})(window);
