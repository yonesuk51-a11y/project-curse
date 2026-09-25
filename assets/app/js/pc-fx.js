// Project Curse 6 — 연출. 2026-09-25 사용자 결정으로 옛 5.54의 기동·인계 연출을 되살렸다.
// 문구와 시간은 terminal-fx-data.js(boot, handoffTiming)와 transition-manifest.js에서 읽는다.
// 효과 모드(PCApp.fx())가 'reduced'이면 같은 화면을 움직임 없이 짧게 보여 준다(연출을 지우지 않는다).
//
// 1. 단말 기동 — 탭마다 처음 들어올 때. 홈으로 들어오면 접속 확인 뒤 옛 기동(약 8.9초, 2.6초 뒤부터 건너뛰기),
//    공유 링크로 바로 들어오면 2초짜리 접속, 같은 탭에서 새로고침하면 세션 복원(1.2초).
// 2. 기록 언마운트 — 기록보관소의 기록을 닫고 목록으로 돌아올 때(약 0.95초).
// 3. 화면 인계 막 — 채널이 바뀌면 본문을 덮고 경로·요청·채널명·인장·세 단계·진행 막대를 보여 준 뒤 드러낸다.
// 4. 채널별 등장 — 드러날 때 채널마다 다른 방식으로 나타나고, 부품이 차례로 떠오른다.
// 5. 돌아오면 화면 켜짐 — 다른 탭에 갔다 오면 화면이 가로선에서 한 번 펼쳐진다.
// 6. 증거 현상 — 증거 사진이 다 받아지면 어두운 필름에서 현상되듯 떠오른다.
// 기동 중이 아닌 연출은 아무 곳이나 누르거나 아무 키나 누르면 바로 끝난다.
(function (root) {
  'use strict';

  const doc = root.document;
  const html = doc.documentElement;
  const PC = root.PCApp;
  const h = PC.h;
  const data = root.ProjectCurseTerminalFx || {};
  const bootData = data.boot || {};
  const transitions = root.ProjectCurseTransitions?.screens || {};
  const BOOT_KEY = 'pc6_boot_seen_v2';
  const BRAND = 'assets/brand/project-curse-emblem-128.png';

  const reduced = () => PC.fx() === 'reduced';
  const mobile = () => !!root.matchMedia?.('(max-width: 760px)').matches;
  const audio = () => root.PCAudio;
  const version = () => PC.version; // 단말(표시층) 버전. build-info.js의 5.x는 자료 묶음 버전이다
  let bootActive = false;

  /* ---------- 공용: 타이머 묶음 ---------- */
  function timeline() {
    const timers = [];
    return {
      at(ms, fn) {
        timers.push(root.setTimeout(fn, Math.max(0, ms)));
      },
      clear() {
        timers.splice(0).forEach((timer) => root.clearTimeout(timer));
      }
    };
  }

  /* ---------- 1·2. 기동과 언마운트 ---------- */

  function sessionSeen() {
    try {
      return root.sessionStorage.getItem(BOOT_KEY) === '1';
    } catch (_error) {
      return false;
    }
  }
  function markSeen() {
    try {
      root.sessionStorage.setItem(BOOT_KEY, '1');
    } catch (_error) { /* 다음 새로고침에도 첫 기동으로 보일 수 있다 */ }
  }
  // 확인용 주소 인자: ?boot=full|link|restore|skip
  function forcedMode() {
    try {
      const mode = new URLSearchParams(root.location.search).get('boot');
      return ['full', 'link', 'restore', 'skip'].includes(mode) ? mode : null;
    } catch (_error) {
      return null;
    }
  }
  function initialMode() {
    const forced = forcedMode();
    if (forced === 'skip') return null;
    if (forced === 'full') return 'cold';
    if (forced) return forced;
    if (sessionSeen()) return 'restore';
    const hash = root.location.hash.replace(/^#/, '');
    return !hash || hash === 'terminal-home' ? 'cold' : 'link';
  }

  function releaseApp() {
    html.classList.remove('tc-boot-pending');
    doc.querySelector('.tc-app')?.removeAttribute('inert');
  }

  // 기동 줄의 글 — CHANNEL 줄은 요청 채널 이름, ACCESS 줄은 열람자 호출부호가 있으면 끝에 붙인다(기록 언마운트는 제외)
  function lineLabel(mode, code, label, extra) {
    if (code === 'CHANNEL' && extra.channel) return `${extra.channel} 채널 연결`;
    const who = root.PCPrefs?.operator?.() || '';
    if (code === 'ACCESS' && who && mode !== 'unmount') return `${label} — ${bootData.operatorAccess || '열람자'} ${who}`;
    return label;
  }

  function bootPanel(mode, cfg, extra = {}) {
    const lines = (cfg.lines || []).map(([code, label, result, tone]) => {
      const row = h('li', { class: tone ? `is-${tone}` : null, 'data-state': 'wait' },
        h('b', { text: `[${code}]` }),
        h('span', { text: lineLabel(mode, code, label, extra) }),
        h('em', { text: 'WAIT' })
      );
      row.dataset.result = result;
      return row;
    });
    const gates = (cfg.gates || []).map((gate) => h('li', null, h('i'), h('span', { text: gate })));
    const meterBar = h('i');
    const meterText = h('b', { text: '000%' });
    const footer = h('span', { text: cfg.footer ? `BUILD ${version()} / ${cfg.footer[0]}` : `${cfg.kicker}` });
    const skip = cfg.skip ? h('button.tc-boot-skip', { type: 'button', disabled: true, 'data-tc-cue': 'menu.close', text: cfg.skip }) : null;
    const panel = h('div.tc-boot-panel', null,
      h('header.tc-boot-head', null,
        h('img.tc-boot-logo', { src: BRAND, alt: '', width: '48', height: '48' }),
        h('div', null, h('p.tc-boot-kicker', { text: cfg.kicker }), h('h2', { id: 'tc-boot-title', text: cfg.title }))
      ),
      h('ol.tc-boot-lines', null, lines),
      h('div.tc-boot-meter', null, h('span', null, meterBar), meterText),
      gates.length ? h('ol.tc-boot-gates', null, gates) : null,
      h('footer.tc-boot-foot', null, footer, skip)
    );
    return { panel, lines, gates, meterBar, meterText, footer, skip };
  }

  function runBoot(mode, extra = {}) {
    const cfg = bootData[mode];
    if (!cfg) {
      releaseApp();
      return;
    }
    bootActive = true;
    const calm = reduced();
    const scale = calm ? (bootData.reducedScale || 0.32) : 1;
    const parts = bootPanel(mode, cfg, extra);
    const interactive = mode === 'cold';
    const overlay = h('div.tc-boot', {
      'data-mode': mode,
      role: interactive ? 'dialog' : null,
      'aria-modal': interactive ? 'true' : null,
      'aria-labelledby': interactive ? 'tc-boot-title' : null,
      'aria-hidden': interactive ? null : 'true'
    }, parts.panel);
    if (interactive) doc.querySelector('.tc-app')?.setAttribute('inert', '');
    const existing = doc.querySelector('.tc-boot');
    if (existing) existing.replaceWith(overlay);
    else doc.body.append(overlay);
    html.classList.remove('tc-boot-pending');

    const t = timeline();
    const duration = (cfg.duration || 1000) * scale;
    const finish = (cfg.finish || 200) * scale;
    let done = false;
    let skippable = !interactive;
    let raf = 0;
    const started = performance.now();

    const setMeter = (ratio) => {
      const pct = Math.max(0, Math.min(100, Math.round(ratio * 100)));
      parts.meterBar.style.setProperty('--p', pct + '%');
      parts.meterText.textContent = String(pct).padStart(3, '0') + '%';
      parts.gates.forEach((gate, index) => gate.classList.toggle('is-on', pct >= ((index + 1) / parts.gates.length) * 100 - 0.5));
    };
    if (!calm) {
      const step = () => {
        setMeter((performance.now() - started) / duration);
        if (!done) raf = root.requestAnimationFrame(step);
      };
      raf = root.requestAnimationFrame(step);
    } else {
      setMeter(0);
    }

    (cfg.lines || []).forEach((line, index) => {
      const row = parts.lines[index];
      t.at((cfg.starts?.[index] || 0) * scale, () => {
        row.dataset.state = 'check';
        row.querySelector('em').textContent = 'CHECK';
      });
      t.at((cfg.ends?.[index] || 0) * scale, () => {
        row.dataset.state = 'done';
        row.querySelector('em').textContent = row.dataset.result;
        if (calm) setMeter((index + 1) / cfg.lines.length);
        if (mode !== 'cold') return;
        if (line[3] === 'danger') {
          overlay.classList.add('is-alarm');
          t.at(700, () => overlay.classList.remove('is-alarm'));
          audio()?.cue('system.alert');
        } else {
          audio()?.cue('operation.step');
        }
      });
    });
    if (cfg.footer) {
      const lastEnd = (cfg.ends?.[cfg.ends.length - 1] || duration) * scale;
      t.at(lastEnd - 260 * scale, () => { parts.footer.textContent = `BUILD ${version()} / ${cfg.footer[1]}`; });
      t.at(duration, () => {
        parts.footer.textContent = `BUILD ${version()} / ${cfg.footer[2]}`;
        overlay.classList.add('is-granted');
        audio()?.cue('channel.command');
      });
    }
    if (parts.skip) {
      t.at((cfg.skipAfter || 0) * scale, () => {
        parts.skip.disabled = false;
        skippable = true;
      });
      parts.skip.addEventListener('click', () => end());
    }

    function onKey(event) {
      if (!skippable) return;
      if (interactive && event.key !== 'Escape') return;
      end();
    }
    function onPointer(event) {
      if (!skippable || interactive) return;
      if (event.target.closest('.tc-boot-skip')) return;
      end();
    }
    doc.addEventListener('keydown', onKey, true);
    overlay.addEventListener('pointerdown', onPointer);

    function end() {
      if (done) return;
      done = true;
      t.clear();
      root.cancelAnimationFrame(raf);
      setMeter(1);
      doc.removeEventListener('keydown', onKey, true);
      markSeen();
      releaseApp();
      overlay.classList.add('is-leaving');
      root.setTimeout(() => {
        overlay.remove();
        bootActive = false;
        enter(PC.current()?.route, true);
        if (interactive) {
          const heading = doc.querySelector('.tc-screen:not([hidden]) h1');
          if (heading) {
            if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
            heading.focus({ preventScroll: true });
          }
        }
      }, calm ? 0 : 280);
    }
    t.at(duration + finish, end);
    if (interactive) root.setTimeout(() => parts.skip?.focus({ preventScroll: true }), 30);
  }

  // 접속 확인 — 누르는 순간 브라우저가 소리를 허락한다. '소리 없이 접속'은 음향을 끄고 들어간다.
  function gate() {
    const cfg = bootData.gate;
    if (!cfg) {
      runBoot('cold');
      return;
    }
    bootActive = true;
    const enterBtn = h('button.tc-btn.tc-btn--primary', { type: 'button', text: cfg.enter });
    const silentBtn = h('button.tc-btn', { type: 'button', text: cfg.silent });
    // 열람자 호출부호 칸 — 적는 동안에는 키를 눌러도 접속하지 않는다. 칸에서 Enter를 누르면 소리와 함께 접속한다
    const op = cfg.operator || null;
    const opInput = op ? h('input.tc-boot-operator-input', {
      id: 'tc-gate-operator', type: 'text', maxlength: String(root.PCPrefs?.operatorMax || 24), autocomplete: 'off', spellcheck: 'false',
      placeholder: op.placeholder, value: root.PCPrefs?.operator?.() || null
    }) : null;
    const opField = op ? h('label.tc-boot-operator', { for: 'tc-gate-operator' },
      h('span', { text: op.label }), opInput, op.hint ? h('small', { text: op.hint }) : null) : null;
    const overlay = h('div.tc-boot.is-gate', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'tc-gate-title' },
      h('div.tc-boot-panel', null,
        h('header.tc-boot-head', null,
          h('img.tc-boot-logo', { src: BRAND, alt: '', width: '48', height: '48' }),
          h('div', null, h('p.tc-boot-kicker', { text: cfg.kicker }), h('h2', { id: 'tc-gate-title', text: cfg.title }))
        ),
        h('div.tc-boot-gate-copy', null, (cfg.lines || []).map((line) => h('p', { text: line }))),
        opField,
        h('div.tc-boot-actions', null, enterBtn, silentBtn),
        h('p.tc-boot-note', { text: cfg.note })
      )
    );
    doc.querySelector('.tc-app')?.setAttribute('inert', '');
    doc.body.append(overlay);
    html.classList.remove('tc-boot-pending');
    root.setTimeout(() => enterBtn.focus({ preventScroll: true }), 30);

    let passed = false;
    function pass(withSound) {
      if (passed) return;
      passed = true;
      doc.removeEventListener('keydown', onKey, true);
      if (opInput) root.PCPrefs?.setOperator?.(opInput.value);
      if (withSound) {
        root.PCAudio?.unlock?.();
        if (!root.PCAudio?.isOn?.()) root.PCAudio?.set?.(true, { quiet: true });
        root.PCAudio?.cue('boot.start');
      } else {
        root.PCAudio?.set?.(false, { quiet: true });
      }
      runBoot('cold');
    }
    function onKey(event) {
      if (event.key === 'Tab' || event.key === 'Shift') return;
      if (opInput && (event.target === opInput || doc.activeElement === opInput)) {
        if (event.key === 'Enter' && !event.isComposing) {
          event.preventDefault();
          pass(true);
        }
        return;
      }
      if ((event.key === 'Enter' || event.key === ' ') && doc.activeElement === silentBtn) return;
      if (event.key === 'Enter' || event.key === ' ') event.preventDefault();
      pass(true);
    }
    enterBtn.addEventListener('click', () => pass(true));
    silentBtn.addEventListener('click', () => pass(false));
    silentBtn.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        pass(false);
      }
    });
    overlay.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button, .tc-boot-operator')) return;
      pass(true);
    });
    doc.addEventListener('keydown', onKey, true);
  }

  /* ---------- 3·4. 화면 인계 막과 채널별 등장 ---------- */

  let handoffEl = null;
  let handoffTimeline = null;
  let handoffEnd = null;

  function endHandoff() {
    if (handoffEnd) handoffEnd();
  }

  function handoff(fromRoute, toRoute) {
    const to = transitions[toRoute] || data.handoff?.[toRoute];
    if (!to) {
      enter(toRoute, true);
      return;
    }
    endHandoff();
    const from = transitions[fromRoute] || data.handoff?.[fromRoute] || {};
    const info = PC.channel(toRoute) || {};
    const calm = reduced();
    const timing = (calm ? data.handoffTiming?.reduced : (mobile() ? data.handoffTiming?.mobile : data.handoffTiming?.desktop)) || { reveal: 900, out: 200 };
    const phases = (to.phases || []).slice(0, 3).map((phase, index) => h('li', null, h('span', { text: String(index + 1).padStart(2, '0') }), h('b', { text: phase })));
    const status = h('p.tc-handoff-status', { text: calm ? to.status || '' : '' });
    const el = h('div.tc-handoff', { 'aria-hidden': 'true', 'data-route': toRoute },
      h('div.tc-handoff-card', null,
        h('p.tc-handoff-path', null, h('span', { text: from.code || 'COMMAND' }), h('i'), h('span', { text: to.code || info.code || '' })),
        h('p.tc-handoff-request', { text: to.request || '' }),
        h('div.tc-handoff-title', null, h('b', { text: info.label || to.label || '' }), h('span.tc-seal', null, h('i', { text: info.index || '--' }))),
        h('ol.tc-handoff-phases', null, phases),
        status,
        h('i.tc-handoff-progress')
      )
    );
    if (calm) phases.forEach((phase) => phase.classList.add('is-done'));
    doc.body.append(el);
    handoffEl = el;
    const t = timeline();
    handoffTimeline = t;
    if (!calm) {
      (timing.phases || []).forEach((ms, index) => t.at(ms, () => {
        phases.forEach((phase, i) => {
          phase.classList.toggle('is-active', i === index);
          phase.classList.toggle('is-done', i < index);
        });
      }));
      t.at(timing.status || 0, () => {
        phases.forEach((phase) => {
          phase.classList.remove('is-active');
          phase.classList.add('is-done');
        });
        status.textContent = to.status || '';
      });
    }
    const skip = () => handoffEnd && handoffEnd();
    el.addEventListener('pointerdown', skip);
    doc.addEventListener('keydown', skip, true);
    handoffEnd = () => {
      handoffEnd = null;
      t.clear();
      el.removeEventListener('pointerdown', skip);
      doc.removeEventListener('keydown', skip, true);
      enter(toRoute, true);
      if (calm || !timing.out) {
        el.remove();
      } else {
        el.classList.add('is-leaving');
        root.setTimeout(() => el.remove(), timing.out);
      }
      if (handoffEl === el) handoffEl = null;
    };
    t.at(timing.reveal || 900, () => handoffEnd && handoffEnd());
  }

  // 채널별 등장(channel=true)과 부품 순차 등장. 줄임 모드에서는 CSS가 움직임을 끈다.
  function enter(route, channelEntry) {
    const el = route && doc.getElementById(route);
    if (!el || el.hidden) return;
    el.classList.remove('is-entering', 'is-staggering');
    void el.offsetWidth; // 애니메이션을 처음부터 다시 시작한다
    el.classList.add(channelEntry ? 'is-entering' : 'is-staggering');
    root.setTimeout(() => el.classList.remove('is-entering', 'is-staggering'), 1100);
  }

  /* ---------- 5. 돌아오면 화면 켜짐 ---------- */

  let hiddenAt = 0;
  doc.addEventListener('visibilitychange', () => {
    if (doc.hidden) {
      hiddenAt = Date.now();
      return;
    }
    if (!hiddenAt || Date.now() - hiddenAt < 2000 || bootActive) return;
    html.classList.remove('tc-poweron');
    void html.offsetWidth;
    html.classList.add('tc-poweron');
    root.PCAudio?.play?.('analog', { gain: 0.9, key: 'poweron', cooldown: 1500 });
    root.setTimeout(() => html.classList.remove('tc-poweron'), 520);
  });

  /* ---------- 6. 증거 현상 ---------- */
  doc.addEventListener('load', (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || img.dataset.fxDeveloped) return;
    if (!img.closest('.tc-evidence-media, .tc-arc-image-frame')) return;
    img.dataset.fxDeveloped = '1';
    if (!reduced()) img.classList.add('tc-fx-develop');
  }, true);

  /* ---------- 이동 ---------- */
  doc.addEventListener('pc:route', (event) => {
    const detail = event.detail || {};
    if (detail.reason === 'initial') {
      const mode = initialMode();
      if (!mode) {
        releaseApp();
        markSeen();
        return;
      }
      if (mode === 'cold') gate();
      else runBoot(mode, { channel: PC.channel(detail.route)?.label });
      return;
    }
    if (bootActive) return;
    if (detail.screenChanged) {
      handoff(detail.previousRoute, detail.route);
      return;
    }
    const leftRecord = detail.previousRoute === 'archive-entry' && (detail.previousParts || []).length && detail.route === 'archive-entry' && !(detail.parts || []).length;
    if (leftRecord) {
      runBoot('unmount');
      return;
    }
    if (detail.reason !== 'same' && detail.reason !== 'replace') enter(detail.route, false);
  });

  // 효과를 줄임으로 바꾸면 진행 중인 인계 막을 바로 끝낸다.
  doc.addEventListener('pc:fx', (event) => {
    if (event.detail?.mode === 'reduced') endHandoff();
  });
})(window);
