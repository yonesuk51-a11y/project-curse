// Project Curse 6 — 증거 사진 감식 보기. 2026-09-25 사용자 결정.
// .tc-evidence-media 안의 그림(또는 img[data-tc-inspect])을 누르면 어두운 감식 화면에서 크게 본다. 링크 안의 그림은 열지 않는다.
// 격자·모서리 괄호·눈금자는 표시층에서 입힌다(그림 파일에 굽지 않는다 — AGENTS.md 5절).
// 촬영 시각(DTG)·장소·좌표·기록 번호는 그림을 감싼 figure나 .tc-evidence의 data-dtg·data-place·data-coords·data-record에서 읽는다. 없으면 '미상'.
// 확대: 단추·휠·두 손가락, 끌어서 이동, 두 번 눌러 확대/원래 크기. 키보드: + − 0, 방향키, Esc.
(function (root) {
  'use strict';

  const doc = root.document;
  const PC = root.PCApp;
  const h = PC.h;
  const SELECTOR = '.tc-evidence-media img, img[data-tc-inspect]';
  const MIN = 1;
  const MAX = 4;

  function inspectable(img) {
    return img instanceof HTMLImageElement && img.matches(SELECTOR) && !img.closest('a, .tc-screenhead-hero, .tc-inspect, [data-tc-no-inspect]');
  }

  // 키보드로도 열 수 있게 증거 그림에 초점을 준다
  function decorate(rootEl) {
    rootEl.querySelectorAll(SELECTOR).forEach((img) => {
      if (img.dataset.tcInspectable || !inspectable(img)) return;
      img.dataset.tcInspectable = '1';
      img.tabIndex = 0;
      img.setAttribute('aria-haspopup', 'dialog');
      img.title = '눌러서 감식 보기로 크게 보기';
    });
  }

  function describe(img) {
    const scope = img.closest('figure, .tc-evidence') || img.parentElement;
    const pick = (key) => img.dataset[key] || img.closest(`[data-${key}]`)?.dataset?.[key] || '';
    const label = scope?.querySelector('figcaption b')?.textContent.trim() || scope?.dataset?.evidenceClass || '';
    const caption = scope?.querySelector('figcaption span, figcaption p')?.textContent.trim() || '';
    return { dtg: pick('dtg'), place: pick('place'), coords: pick('coords'), record: pick('record'), label, caption, alt: img.alt || '' };
  }

  let session = null;

  function close() {
    if (!session) return;
    const { overlay, origin, onKey } = session;
    session = null;
    doc.removeEventListener('keydown', onKey, true);
    overlay.remove();
    doc.querySelector('.tc-app')?.removeAttribute('inert');
    root.PCAudio?.cue('evidence.close');
    if (origin?.isConnected) origin.focus({ preventScroll: true });
  }

  function open(img) {
    if (session) close();
    const info = describe(img);
    const full = img.dataset.original || img.currentSrc || img.src;
    const picture = h('img.tc-inspect-img', { src: img.currentSrc || img.src, alt: info.alt, draggable: 'false' });
    if (full && full !== picture.src) {
      const loader = new Image();
      loader.onload = () => { picture.src = full; };
      loader.src = full;
    }
    const frame = h('div.tc-inspect-frame', null, picture, h('i.tc-inspect-grid', { 'aria-hidden': 'true' }), h('i.tc-inspect-corners', { 'aria-hidden': 'true' }), h('i.tc-inspect-ruler', { 'aria-hidden': 'true' }));
    const stage = h('div.tc-inspect-stage', null, frame);
    const zoomText = h('b.tc-inspect-zoom', { text: '×1.0' });
    const fields = [
      ['DTG', info.dtg || '미상'],
      ['장소', info.place || '미상'],
      ['좌표', info.coords || '미상'],
      ['기록', info.record || '—']
    ];
    const btn = (label, text, onClick) => h('button.tc-btn', { type: 'button', 'aria-label': label, text, onclick: onClick });
    const closeBtn = btn('감식 보기 닫기', '닫기', close);
    const overlay = h('div.tc-inspect', { role: 'dialog', 'aria-modal': 'true', 'aria-label': '감식 보기' },
      h('header.tc-inspect-bar', null,
        h('p.tc-inspect-title', null, h('b', { text: '감식 보기' }), info.label ? h('span', { text: info.label }) : null),
        h('dl.tc-inspect-meta', null, fields.map(([term, value]) => h('div', null, h('dt', { text: term }), h('dd', { text: value })))),
        h('div.tc-inspect-tools', null,
          btn('축소', '−', () => zoomBy(1 / 1.5)),
          zoomText,
          btn('확대', '+', () => zoomBy(1.5)),
          btn('원래 크기', '원래', () => reset()),
          closeBtn
        )
      ),
      stage,
      (info.caption || info.alt) ? h('p.tc-inspect-caption', { text: info.caption || info.alt }) : null
    );

    let scale = 1;
    let x = 0;
    let y = 0;
    const apply = () => {
      const box = stage.getBoundingClientRect();
      const limitX = (box.width * (scale - 1)) / 2;
      const limitY = (box.height * (scale - 1)) / 2;
      x = Math.max(-limitX, Math.min(limitX, x));
      y = Math.max(-limitY, Math.min(limitY, y));
      frame.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      zoomText.textContent = `×${scale.toFixed(1)}`;
      overlay.classList.toggle('is-zoomed', scale > 1.01);
    };
    function zoomTo(next, cx, cy) {
      const box = stage.getBoundingClientRect();
      const px = (cx ?? box.left + box.width / 2) - (box.left + box.width / 2);
      const py = (cy ?? box.top + box.height / 2) - (box.top + box.height / 2);
      const target = Math.max(MIN, Math.min(MAX, next));
      const ratio = target / scale;
      x = px - (px - x) * ratio;
      y = py - (py - y) * ratio;
      scale = target;
      apply();
    }
    function zoomBy(factor, cx, cy) {
      zoomTo(scale * factor, cx, cy);
    }
    function reset() {
      scale = 1;
      x = 0;
      y = 0;
      apply();
    }

    // 끌어서 이동, 두 손가락 확대
    const pointers = new Map();
    let pinchStart = null;
    stage.addEventListener('pointerdown', (event) => {
      stage.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchStart = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale };
      }
    });
    stage.addEventListener('pointermove', (event) => {
      const prev = pointers.get(event.pointerId);
      if (!prev) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2 && pinchStart) {
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        zoomTo(pinchStart.scale * (dist / (pinchStart.dist || 1)), (a.x + b.x) / 2, (a.y + b.y) / 2);
        return;
      }
      if (scale > 1) {
        x += event.clientX - prev.x;
        y += event.clientY - prev.y;
        apply();
      }
    });
    const release = (event) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) pinchStart = null;
    };
    stage.addEventListener('pointerup', release);
    stage.addEventListener('pointercancel', release);
    stage.addEventListener('wheel', (event) => {
      event.preventDefault();
      zoomBy(event.deltaY < 0 ? 1.2 : 1 / 1.2, event.clientX, event.clientY);
    }, { passive: false });
    stage.addEventListener('dblclick', (event) => {
      if (scale > 1.01) reset();
      else zoomTo(2.5, event.clientX, event.clientY);
    });

    function onKey(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      } else if (event.key === '+' || event.key === '=') {
        zoomBy(1.5);
      } else if (event.key === '-' || event.key === '_') {
        zoomBy(1 / 1.5);
      } else if (event.key === '0') {
        reset();
      } else if (event.key.startsWith('Arrow') && scale > 1) {
        event.preventDefault();
        const step = 48;
        if (event.key === 'ArrowLeft') x += step;
        if (event.key === 'ArrowRight') x -= step;
        if (event.key === 'ArrowUp') y += step;
        if (event.key === 'ArrowDown') y -= step;
        apply();
      } else if (event.key === 'Tab') {
        // 초점을 감식 화면 안에 둔다
        const focusable = [...overlay.querySelectorAll('button')];
        const index = focusable.indexOf(doc.activeElement);
        event.preventDefault();
        const next = event.shiftKey ? (index <= 0 ? focusable.length - 1 : index - 1) : (index + 1) % focusable.length;
        focusable[next].focus();
      }
    }

    doc.addEventListener('keydown', onKey, true);
    doc.querySelector('.tc-app')?.setAttribute('inert', '');
    doc.body.append(overlay);
    session = { overlay, origin: img, onKey };
    root.PCAudio?.cue('evidence.open');
    root.requestAnimationFrame(() => {
      apply();
      closeBtn.focus({ preventScroll: true });
    });
  }

  doc.addEventListener('click', (event) => {
    const img = event.target.closest?.(SELECTOR);
    if (!img || !inspectable(img)) return;
    event.preventDefault();
    open(img);
  });
  doc.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || !img.dataset.tcInspectable) return;
    event.preventDefault();
    open(img);
  });

  // 화면이 그림을 늦게 그려도 초점을 받게 한다
  function watch() {
    const main = doc.getElementById('tc-main');
    if (!main) return;
    decorate(main);
    let pending = 0;
    new MutationObserver(() => {
      if (pending) return;
      pending = root.requestAnimationFrame(() => {
        pending = 0;
        decorate(main);
      });
    }).observe(main, { childList: true, subtree: true });
  }
  doc.addEventListener('pc:route', () => {
    if (session) close();
  });

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', watch, { once: true });
  else watch();
  root.PCInspect = Object.freeze({ open, close });
})(window);
