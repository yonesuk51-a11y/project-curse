// Project Curse 6 — 앱 핵심: DOM 도우미, 화면 등록, 주소 규칙, 셸 표시.
// 화면 모듈은 PCApp.screen({...})으로 등록한다. 등록 순서와 무관하게 DOMContentLoaded 뒤에 첫 화면을 그린다.
(function (root) {
  'use strict';

  const doc = root.document;
  const SCREEN_IDS = ['terminal-home', 'map-room', 'history', 'faction-info', 'archive-entry', 'personnel', 'field-manual', 'media-audit'];
  // 새 앱에서 생긴 채널 — 옛 앱과 함께 쓰는 channel-identity-data.js에는 넣지 않는다.
  const APP_CHANNELS = [
    {
      id: 'field-manual', index: '06', code: 'FIELD MANUAL', label: '현장 지침', shortLabel: '지침',
      description: '현장에 들어가기 전에 확인하는 기준. 교전 원칙, 철수 조건, 표식, 장비, 능력과 대가, 인원 등록 양식.',
      telemetry: [['SOURCE', 'N.H.C MANUAL'], ['REVISION', '2005.01.21'], ['FORM', 'FIELD REGISTER']]
    }
  ];
  // 옛 주소를 새 화면으로 잇는다. 모르는 주소는 조용히 바꾸지 않고 홈에서 알린다.
  const ALIASES = {
    'faction-relation': 'faction-info',
    'region-map': 'map-room',
    'zone-map': 'map-room',
    'operation-map': 'map-room'
  };
  const SITE = 'U.A.C 합동작전 단말';

  /* ---------- DOM ---------- */

  // h('div.tc-panel#id', {속성}, ...자식) — 문자열 자식은 글자로만 넣는다(HTML 해석 없음).
  function h(spec, props, ...children) {
    const match = /^([a-z0-9-]*)((?:[#.][\w-]+)*)$/i.exec(spec || '');
    const tag = (match && match[1]) || 'div';
    const el = doc.createElement(tag);
    const tokens = match ? match[2].match(/[#.][\w-]+/g) || [] : [];
    tokens.forEach((token) => {
      if (token[0] === '#') el.id = token.slice(1);
      else el.classList.add(token.slice(1));
    });
    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        if (value == null || value === false) return;
        if (key === 'class') el.className = el.className ? `${el.className} ${value}` : value;
        else if (key === 'text') el.textContent = value;
        else if (key === 'dataset') Object.assign(el.dataset, value);
        else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2), value);
        else if (value === true) el.setAttribute(key, '');
        else el.setAttribute(key, String(value));
      });
    }
    return append(el, children);
  }

  function append(el, children) {
    children.flat(Infinity).forEach((child) => {
      if (child == null || child === false || child === '') return;
      el.append(child instanceof Node ? child : String(child));
    });
    return el;
  }

  function clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
    return el;
  }

  /* ---------- 주소 ---------- */

  function decodeSafe(value) {
    try {
      return decodeURIComponent(value);
    } catch (_error) {
      return value;
    }
  }

  function parse(hash) {
    const raw = String(hash || '').replace(/^#/, '');
    const segments = raw.split('/').map(decodeSafe);
    const head = ALIASES[segments[0]] || segments[0];
    if (!raw) return { route: 'terminal-home', parts: [], unknown: '' };
    if (!SCREEN_IDS.includes(head)) return { route: 'terminal-home', parts: [], unknown: raw };
    return { route: head, parts: segments.slice(1).filter(Boolean), unknown: '' };
  }

  function href(route, ...parts) {
    const clean = parts.flat().filter((part) => part != null && part !== '');
    return '#' + [route, ...clean.map((part) => encodeURIComponent(part))].join('/');
  }

  // data-uac-* 링크 속성 → 새 주소. 데이터 파일과 옛 마크업이 이 속성을 쓴다.
  function linkTarget(ds) {
    const route = ALIASES[ds.uacRoute] || ds.uacRoute;
    if (route === 'history' && ds.uacHistoryRecord) return [route, ds.uacHistoryRecord];
    if (route === 'archive-entry' && ds.uacArchiveRecord) return [route, ds.uacArchiveRecord];
    if (route === 'personnel' && ds.uacPersonRecord) return [route, ds.uacPersonRecord];
    if (route === 'faction-info' && ds.uacFaction) return [route, ds.uacFaction];
    if (route === 'map-room') {
      if (ds.uacMapOperation) return [route, 'op', ds.uacMapOperation];
      if (ds.uacMapIncident) return [route, 'incident', ds.uacMapIncident];
      if (ds.uacPilgrimage) return [route, 'pilgrimage', ds.uacPilgrimage];
    }
    return [route];
  }

  /* ---------- 화면 등록과 전환 ---------- */

  const registry = new Map();
  const scrollMemory = new Map();
  const trail = []; // 앱 안에서 밀어 넣은 이전 주소들 — back()이 뒤로 가기를 쓸지 판단한다
  let current = null;
  let pushPending = false;
  let started = false;

  function screen(def) {
    if (!def || !SCREEN_IDS.includes(def.id)) throw new Error(`PCApp.screen: 알 수 없는 화면 ${def && def.id}`);
    if (registry.has(def.id)) throw new Error(`PCApp.screen: 이미 등록된 화면 ${def.id}`);
    registry.set(def.id, { def, el: null, mounted: false });
    if (started && current && current.route === def.id) render('push');
  }

  function saveScroll() {
    if (current) scrollMemory.set(current.key, root.scrollY);
  }

  function go(route, ...parts) {
    const next = href(route, ...parts);
    if (next === location.hash) {
      render('same');
      return;
    }
    saveScroll();
    if (current) trail.push(current.key);
    pushPending = true;
    location.hash = next;
  }

  // 목록으로 돌아가기 — 바로 앞 주소가 목적지면 브라우저 뒤로 가기로 스크롤 위치까지 되살린다.
  function back(route, ...parts) {
    const target = href(route, ...parts);
    if (trail.length && trail[trail.length - 1] === target) {
      history.back();
      return;
    }
    go(route, ...parts);
  }

  function replace(route, ...parts) {
    const next = href(route, ...parts);
    try {
      history.replaceState(history.state, '', next);
    } catch (_error) {
      location.replace(next);
      return;
    }
    render('replace');
  }

  function setTitle(text) {
    doc.title = text ? `${text} | ${SITE}` : SITE;
  }

  const announcer = () => doc.querySelector('[data-tc-announcer]');
  function announce(text) {
    const el = announcer();
    if (!el) return;
    el.textContent = '';
    root.setTimeout(() => {
      el.textContent = text;
    }, 30);
  }

  // 화면 안에서 지금 보이는 제목에 초점을 둔다. 숨은 하위 화면(목록↔상세)의 제목은 건너뛴다.
  function focusHeading(el) {
    const visible = (node) => node.getClientRects().length > 0;
    const target = [...el.querySelectorAll('[data-tc-focus]')].find(visible) || [...el.querySelectorAll('h1')].find(visible);
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    try {
      target.focus({ preventScroll: true });
    } catch (_error) {
      target.focus();
    }
  }

  function channel(id) {
    const list = [...(root.ProjectCurseChannelData?.channels || []), ...APP_CHANNELS];
    return list.find((item) => item.id === id) || null;
  }

  function updateChrome(route) {
    doc.body.dataset.screen = route;
    doc.querySelectorAll('[data-tc-nav]').forEach((link) => {
      if (link.dataset.tcNav === route) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const info = channel(route);
    const code = doc.querySelector('[data-tc-ch-code]');
    const label = doc.querySelector('[data-tc-ch-label]');
    if (code) code.textContent = info ? info.index : '--';
    if (label) label.textContent = info ? info.label : route;
  }

  function render(reason) {
    const loc = parse(location.hash);
    const key = location.hash || '#terminal-home';
    const entry = registry.get(loc.route);
    const previous = current;
    current = { ...loc, key };

    registry.forEach((item, id) => {
      if (id === loc.route || !item.el || item.el.hidden) return;
      item.el.hidden = true;
      try {
        item.def.hide?.(api);
      } catch (error) {
        console.error(error);
      }
    });
    // 아직 등록되지 않은 화면의 'SCREEN NOT BUILT' 표시도 떠날 때 숨긴다
    SCREEN_IDS.forEach((id) => {
      if (id === loc.route || registry.has(id)) return;
      const host = doc.getElementById(id);
      if (host) host.hidden = true;
    });

    updateChrome(loc.route);
    // 위협 등급은 채널 기본값으로 되돌리고, 상세 화면이 show()에서 자기 등급을 넘긴다.
    threat(null, loc.route);
    // 기록 영상 몰입 재생은 기록보관소를 떠나면 끝난다(화면의 hide()가 먼저 지우지만 안전하게 한 번 더).
    if (loc.route !== 'archive-entry') doc.documentElement.classList.remove('tc-immersive');

    if (!entry) {
      const host = doc.getElementById(loc.route);
      if (host) {
        host.hidden = false;
        clear(host).append(missing('SCREEN NOT BUILT', loc.route, '이 화면은 아직 새 단말에 옮겨지지 않았습니다.'));
      }
      setTitle(channel(loc.route)?.label || loc.route);
      return;
    }

    if (!entry.el) entry.el = doc.getElementById(loc.route);
    if (!entry.mounted) {
      entry.def.mount?.(entry.el, api);
      entry.mounted = true;
    }
    const screenChanged = !previous || previous.route !== loc.route;
    entry.el.hidden = false;
    entry.def.show?.(loc.parts, api, { unknown: loc.unknown, reason });

    if (reason === 'pop' && scrollMemory.has(key)) root.scrollTo(0, scrollMemory.get(key));
    else if (reason !== 'same') root.scrollTo(0, 0);

    if (reason !== 'initial' && reason !== 'replace') focusHeading(entry.el);
    if (screenChanged && reason !== 'initial') announce(`${channel(loc.route)?.label || loc.route} 채널`);

    // 음향·연출 계층(pc-audio.js, pc-fx.js)이 듣는 이동 알림. 화면 모듈은 쓰지 않는다.
    doc.dispatchEvent(new CustomEvent('pc:route', {
      detail: {
        route: loc.route,
        parts: [...loc.parts],
        previousRoute: previous ? previous.route : null,
        previousParts: previous ? [...previous.parts] : [],
        screenChanged,
        reason
      }
    }));
  }

  /* ---------- 공용 조각 ---------- */

  // 화면 머리 — 채널 데이터에서 코드·설명·수치를 가져온다. 넘긴 값이 있으면 그 값을 쓴다.
  // 채널 대표 그림(channel-hero-data.js)이 있으면 머리 뒤에 어둡게 깐다. 상세 화면은 hero:false로 끈다.
  // 오른쪽 인장(조준선·점선 고리·채널 번호)은 옛 5.54 채널 머리판의 표지다. 영문 코드와 운용 수치는 간략 보기에서 숨는다.
  function screenHead(id, options = {}) {
    const info = channel(id) || {};
    const meta = options.meta || info.telemetry || [];
    const hero = options.hero === false ? null : (options.hero || root.ProjectCurseChannelHeroes?.[id] || null);
    return h('header.tc-screenhead.tc-bracket', hero ? { class: 'has-hero' } : null,
      hero ? h('div.tc-screenhead-hero', { 'aria-hidden': 'true' },
        img(hero.src, { alt: '', loading: 'eager', sizes: '(max-width: 760px) 100vw, 1200px', style: hero.position ? `object-position:${hero.position}` : null })) : null,
      h('p.tc-screenhead-code', null, h('i', { text: `CH ${info.index || '--'}` }), h('span.tc-full-only', { text: options.code || info.code || '' })),
      h('h1', { text: options.title || info.label || id, 'data-tc-focus': true }),
      (options.desc || info.description) ? h('p.tc-screenhead-desc', { text: options.desc || info.description }) : null,
      meta.length ? h('dl.tc-screenhead-meta.tc-full-only', null, meta.map(([term, value]) => h('div', null, h('dt', { text: term }), h('dd', { text: value })))) : null,
      h('span.tc-seal', { 'aria-hidden': 'true' }, h('i', { text: info.index || '--' }))
    );
  }

  /* ---------- 위협 등급 — 2026-09-25 사용자 결정: 기록의 등급에 따라 화면 분위기가 달라진다 ---------- */

  const THREATS = ['low', 'guarded', 'elevated', 'high', 'critical'];
  const THREAT_LABELS = {
    low: ['LOW', '낮음'],
    guarded: ['GUARDED', '경계'],
    elevated: ['ELEVATED', '주의'],
    high: ['HIGH', '높음'],
    critical: ['CRITICAL', '심각']
  };
  // 채널 기본값. 홈은 현재 긴급 경보의 등급을 따른다. 나머지 채널 목록은 '주의'에서 시작하고 상세 화면이 올리거나 내린다.
  function baseThreat(route) {
    if (route === 'terminal-home') {
      const alert = String(root.ProjectCurseHomeIntelligence?.alert?.threat || '').toLowerCase();
      return THREATS.includes(alert) ? alert : 'elevated';
    }
    if (route === 'field-manual') return 'guarded';
    return 'elevated';
  }
  function threat(level, route) {
    const key = String(level || '').toLowerCase();
    const next = THREATS.includes(key) ? key : baseThreat(route || current?.route);
    const html = doc.documentElement;
    const previous = html.dataset.threat || null;
    html.dataset.threat = next;
    const el = doc.querySelector('[data-tc-threat]');
    if (el) {
      clear(el).append(h('span.tc-full-only', { text: THREAT_LABELS[next][0] }), h('span.tc-brief-only', { text: THREAT_LABELS[next][1] }));
    }
    if (previous !== next) doc.dispatchEvent(new CustomEvent('pc:threat', { detail: { level: next, previous } }));
    return next;
  }

  /* ---------- 자유 해석 표시 — 공식 기록이 정하지 않은 부분. 교류에서 자유롭게 해석해도 된다 ---------- */

  function openCanon(items, options = {}) {
    const list = (Array.isArray(items) ? items : [items]).filter((item) => typeof item === 'string' && item.trim());
    if (!list.length) return null;
    return h('aside.tc-open-canon', { 'aria-label': '자유 해석' },
      h('p.tc-open-canon-head', null,
        h('b', { text: '자유 해석' }),
        h('span', { text: options.lead || '공식 기록이 아직 정하지 않은 부분입니다. 교류에서 자유롭게 해석해도 됩니다.' }),
        h('a', { href: href('terminal-home', 'guide'), text: '안내' })
      ),
      list.length === 1 ? h('p', { text: list[0] }) : h('ul', null, list.map((item) => h('li', { text: item })))
    );
  }

  /* ---------- 알림과 링크 복사 ---------- */

  let toastTimer = 0;
  function toast(text) {
    let el = doc.querySelector('[data-tc-toast]');
    if (!el) {
      el = h('p.tc-toast', { 'data-tc-toast': true, role: 'status', 'aria-live': 'polite' });
      doc.body.append(el);
    }
    el.textContent = text;
    el.classList.add('is-on');
    root.clearTimeout(toastTimer);
    toastTimer = root.setTimeout(() => el.classList.remove('is-on'), 2200);
  }

  // 공유 주소 — 인물·기록 상세는 링크 미리보기용 정적 주소(share/…)가 있으면 그것을, 없으면 지금 주소를 쓴다.
  function shareUrl(loc = current) {
    const base = root.location.href.replace(/#.*$/, '').replace(/[^/]*$/, '');
    const shared = root.ProjectCurseShareIndex?.resolve?.(loc?.route, loc?.parts || []);
    if (shared) return base + shared;
    return base + (location.hash || '#terminal-home');
  }

  function copyText(text) {
    if (root.navigator?.clipboard?.writeText && root.isSecureContext) {
      return root.navigator.clipboard.writeText(text).then(() => true, () => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    const area = h('textarea', { readonly: true, 'aria-hidden': 'true', style: 'position:fixed;top:-100px;left:0;opacity:0' });
    area.value = text;
    doc.body.append(area);
    area.select();
    let ok = false;
    try {
      ok = doc.execCommand('copy');
    } catch (_error) {
      ok = false;
    }
    area.remove();
    return ok;
  }
  function copyLink(url) {
    const text = url || shareUrl();
    return copyText(text).then((ok) => {
      toast(ok ? '링크를 복사했습니다.' : `복사하지 못했습니다. 주소: ${text}`);
      root.PCAudio?.cue(ok ? 'menu.select' : 'system.denied');
      return ok;
    });
  }

  const fx = () => (root.PCPrefs ? root.PCPrefs.fx() : (root.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full'));
  const density = () => (root.PCPrefs ? root.PCPrefs.density() : 'brief');

  function tag(text, tone, options = {}) {
    const classes = ['tc-tag'];
    if (tone) classes.push(`tc-tag--${tone}`);
    if (options.latin) classes.push('tc-tag--latin');
    if (options.mark) classes.push('tc-tag--mark');
    return h('span', { class: classes.join(' '), text, title: options.title || null });
  }

  // 기록 판정 — 키는 데이터가 정하고, 표시 색은 여기서 정한다.
  const VERDICT_TONES = {
    confirmed: 'ok',
    corroborated: 'info',
    observed: 'evidence',
    testimony: 'dotted',
    disputed: 'danger',
    estimated: 'dim'
  };
  function verdictTone(key) {
    return VERDICT_TONES[key] || 'dim';
  }

  // 이미지 — media-manifest.js에 반응형 파생본(480·960px WebP)이 있으면 srcset으로 쓴다.
  // 원본 경로는 data-original에 남겨 증거 확대·원본 비교에 쓴다. docs 기준 상대 경로(../../)도 받는다.
  function img(src, props = {}) {
    const manifest = root.ProjectCurseMediaManifest;
    const clean = manifest?.normalize ? manifest.normalize(src) : String(src || '').replace(/^(\.\.\/)+/, '');
    const entry = manifest?.resolve?.(clean);
    const attrs = { alt: '', loading: 'lazy', decoding: 'async', ...props, 'data-original': clean };
    delete attrs.sizes;
    if (entry?.variants?.length) {
      const largest = entry.variants[entry.variants.length - 1];
      attrs.src = largest.src;
      attrs.srcset = entry.variants.map((variant) => `${variant.src} ${variant.width}w`).join(', ');
      attrs.sizes = props.sizes || '(max-width: 760px) 94vw, 960px';
      if (entry.width && entry.height) {
        attrs.width = String(entry.width);
        attrs.height = String(entry.height);
      }
    } else {
      attrs.src = clean;
    }
    // 저조도로 칠한 그림은 증거 틀 보정 필터를 끈다(components.css).
    if (entry?.tone) attrs['data-tone'] = entry.tone;
    return h('img', attrs);
  }

  function missing(code, key, message) {
    return h('div.tc-missing', { role: 'status' },
      h('b', { text: code }),
      h('p', { text: message }),
      key ? h('code', { text: key }) : null
    );
  }

  /* ---------- 상단 바 시계 ---------- */

  function pad(value) {
    return String(value).padStart(2, '0');
  }
  function startClock() {
    const el = doc.querySelector('[data-tc-clock]');
    if (!el) return;
    let timer = 0;
    const tick = () => {
      // 이상 신호(pc-anomaly.js)가 가끔 시계를 한 초 어긋나게 한다
      const now = new Date(Date.now() + (root.PCAnomaly?.clockSkew?.() || 0));
      el.textContent = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}Z`;
      el.setAttribute('datetime', now.toISOString());
    };
    const run = () => {
      root.clearInterval(timer);
      if (doc.hidden) return;
      tick();
      timer = root.setInterval(tick, 1000);
    };
    doc.addEventListener('visibilitychange', run);
    run();
  }

  /* ---------- 클릭 위임 ---------- */

  function isPlainClick(event) {
    return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  }

  function onClick(event) {
    if (event.defaultPrevented || !isPlainClick(event)) return;
    const skip = event.target.closest('.tc-skip');
    if (skip) {
      event.preventDefault();
      const main = doc.getElementById('tc-main');
      main?.focus();
      return;
    }
    const control = event.target.closest('[data-uac-route]');
    if (control) {
      event.preventDefault();
      go(...linkTarget(control.dataset));
      return;
    }
    const link = event.target.closest('a[href^="#"]');
    if (link && !link.hasAttribute('data-tc-native')) {
      const loc = parse(link.getAttribute('href'));
      event.preventDefault();
      if (loc.unknown) go('terminal-home');
      else go(loc.route, ...loc.parts);
    }
  }

  /* ---------- 시작 ---------- */

  function start() {
    if (started) return;
    started = true;
    try {
      history.scrollRestoration = 'manual';
    } catch (_error) { /* 지원하지 않는 브라우저 */ }
    doc.addEventListener('click', onClick);
    root.addEventListener('hashchange', () => {
      const reason = pushPending ? 'push' : 'pop';
      pushPending = false;
      if (reason === 'pop') {
        saveScroll();
        if (trail.length && trail[trail.length - 1] === (location.hash || '#terminal-home')) trail.pop();
      }
      render(reason);
    });
    startClock();
    render('initial');
  }

  const api = Object.freeze({
    version: '6.1.0',
    fx,
    density,
    threat,
    openCanon,
    toast,
    copyLink,
    shareUrl,
    h,
    append,
    clear,
    href,
    go,
    back,
    replace,
    parse,
    linkTarget,
    screen,
    setTitle,
    announce,
    channel,
    screenHead,
    tag,
    verdictTone,
    img,
    missing,
    current: () => current
  });

  root.PCApp = api;
  // 옛 모듈(기록 영상 연출 등)이 부르는 이동 함수를 새 주소 규칙으로 잇는다.
  root.ProjectCurseShell = Object.freeze({
    navigate: (route) => Promise.resolve(go(ALIASES[route] || route)),
    getRoute: () => current && current.route
  });

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start, { once: true });
  else root.setTimeout(start, 0);
})(window);
