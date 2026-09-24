// Project Curse 6 — 연출. 가이드: 셸은 정밀하고 건조하게, 손상은 증거·이상 층에만, 점프 스케어·번쩍임 금지.
// 모든 연출은 짧게 끝나고 조작을 막지 않는다(pointer-events 없음, 아무 키·클릭으로 건너뜀).
// 모션 감소 설정이면 아무것도 하지 않는다. 문구는 transition-manifest.js·terminal-fx-data.js에서 읽는다.
//
// 1. 채널 인계 — 채널이 바뀌면 상단 바의 채널 표지 자리에 요청 › 단계 › 상태가 짧게 지나가고, 바 아래에 연결선이 그어진다.
// 2. 단말 기동 — 세션마다 한 번, 주소 없이 홈으로 들어왔을 때만 기동 대조 다섯 줄을 보여 주고 걷힌다.
// 3. 증거 현상 — 증거 사진이 다 받아지면 어두운 필름에서 현상되듯 떠오른다.
(function (root) {
  'use strict';

  const doc = root.document;
  const PC = root.PCApp;
  const h = PC.h;
  const fx = root.ProjectCurseTerminalFx || {};
  const transitions = root.ProjectCurseTransitions?.screens || {};
  const reduced = root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const BOOT_KEY = 'pc6_boot_seen_v1';
  const STEP_MS = 110;

  const allowed = () => !reduced.matches && !doc.hidden;

  /* ---------- 1. 채널 인계 ---------- */
  let handoffEl = null;
  let linkEl = null;
  let handoffTimers = [];

  function ensureHandoff() {
    const channelBox = doc.querySelector('.tc-bar-channel');
    const bar = doc.querySelector('.tc-bar');
    if (!channelBox || !bar) return false;
    if (!handoffEl) {
      handoffEl = h('span.tc-fx-handoff', { 'aria-hidden': 'true' });
      channelBox.append(handoffEl);
    }
    if (!linkEl) {
      linkEl = h('i.tc-fx-link', { 'aria-hidden': 'true' });
      bar.append(linkEl);
    }
    return true;
  }

  function endHandoff() {
    handoffTimers.forEach((timer) => root.clearTimeout(timer));
    handoffTimers = [];
    doc.documentElement.classList.remove('tc-fx-handing');
    if (linkEl) linkEl.classList.remove('is-running');
  }

  function handoff(route) {
    const data = transitions[route] || fx.handoff?.[route];
    if (!data || !allowed() || !ensureHandoff()) return;
    endHandoff();
    const steps = [data.request, ...(data.phases || []), data.status].filter(Boolean);
    doc.documentElement.classList.add('tc-fx-handing');
    void linkEl.offsetWidth; // 연결선 애니메이션을 처음부터 다시 시작한다
    linkEl.classList.add('is-running');
    steps.forEach((step, index) => {
      handoffTimers.push(root.setTimeout(() => {
        handoffEl.textContent = step;
      }, index * STEP_MS));
    });
    handoffTimers.push(root.setTimeout(endHandoff, steps.length * STEP_MS + 320));
  }

  /* ---------- 2. 단말 기동 ---------- */
  function bootSeen() {
    try {
      return root.sessionStorage.getItem(BOOT_KEY) === '1';
    } catch (_error) {
      return true; // 기록할 수 없으면 매번 보여 주지 않는다
    }
  }

  function boot() {
    const lines = fx.boot || [];
    const hash = root.location.hash.replace(/^#/, '');
    if (!lines.length || !allowed() || bootSeen() || (hash && hash !== 'terminal-home')) return;
    try {
      root.sessionStorage.setItem(BOOT_KEY, '1');
    } catch (_error) { /* 다음에도 보일 수 있다 */ }
    const list = h('ol.tc-fx-boot-lines');
    const overlay = h('div.tc-fx-boot', { 'aria-hidden': 'true' }, h('i.tc-fx-boot-bar'), list);
    doc.body.append(overlay);
    root.PCAudio?.cue('boot.start');
    const timers = [];
    const finish = () => {
      timers.forEach((timer) => root.clearTimeout(timer));
      doc.removeEventListener('pointerdown', finish, true);
      doc.removeEventListener('keydown', finish, true);
      overlay.classList.add('is-leaving');
      root.setTimeout(() => overlay.remove(), 240);
    };
    lines.forEach(([term, value], index) => {
      timers.push(root.setTimeout(() => {
        list.append(h('li', null, h('span', { text: term }), h('b', { text: value })));
      }, 90 + index * 150));
    });
    timers.push(root.setTimeout(finish, 90 + lines.length * 150 + 380));
    doc.addEventListener('pointerdown', finish, true);
    doc.addEventListener('keydown', finish, true);
  }

  /* ---------- 3. 증거 현상 ---------- */
  doc.addEventListener('load', (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || img.dataset.fxDeveloped) return;
    if (!img.closest('.tc-evidence-media, .tc-arc-image-frame')) return;
    img.dataset.fxDeveloped = '1';
    if (allowed()) img.classList.add('tc-fx-develop');
  }, true);

  /* ---------- 이동 ---------- */
  doc.addEventListener('pc:route', (event) => {
    const detail = event.detail || {};
    if (detail.reason === 'initial') {
      boot();
      return;
    }
    if (detail.screenChanged) handoff(detail.route);
  });

  // 모션 감소로 바뀌면 진행 중인 연출을 바로 끝낸다.
  if (reduced.addEventListener) reduced.addEventListener('change', () => { if (reduced.matches) endHandoff(); });
})(window);
