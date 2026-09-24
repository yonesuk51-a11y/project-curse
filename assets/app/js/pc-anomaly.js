// Project Curse 6 — 이상 층의 드문 신호. 2026-09-25 사용자 결정(드문 이상 신호, 자리 비움, 삼야 무응답 기념일).
// 주제: 현대 전술 체계가 처리하지 못한 것이 공포가 된다. 정보를 가리지 않고, 점프 스케어도 없다.
//
// 1. 이상 신호 — 화면이 data-tc-anomaly="name|count|text"로 표시한 짧은 글자가 수십 초에 한 번 이하로
//    1초 안쪽 동안 다른 값처럼 보였다가 돌아온다. 원래 글자는 그대로 두고 겉에 덮어 보이므로 화면 낭독기는 원래 글자를 읽는다.
//    표시한 곳이 보이지 않으면 상단 바 시계가 한 초 어긋난다.
// 2. 자리 비움 — 탭을 떠나 있으면 탭 제목이 민간 방송 안내문으로 바뀌고, 돌아오면 원래대로.
// 3. 삼야 무응답 기념일 — 매년 10월 31일 02:17(UTC)부터 61시간 1분 동안 html[data-silence="on"].
//    상단 바에 교신 두절 경과가 뜨고, 화면이 더 어두워지며, 이상 신호가 잦아진다. 확인용 주소 인자: ?silence=1
(function (root) {
  'use strict';

  const doc = root.document;
  const html = doc.documentElement;
  const data = root.ProjectCurseTerminalFx || {};
  const cfg = data.anomaly || {};
  const away = data.away || {};
  const silence = data.silence || null;

  const rand = (a, b) => a + Math.random() * (b - a);
  let skew = 0;
  let timer = 0;

  /* ---------- 1. 이상 신호 ---------- */

  function onScreen(el) {
    if (!el.isConnected || el.closest('[hidden], [inert]')) return false;
    const box = el.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < root.innerHeight;
  }

  function altFor(el) {
    if (el.dataset.tcAnomalyAlt) return el.dataset.tcAnomalyAlt;
    const text = el.textContent.trim();
    if (el.dataset.tcAnomaly === 'count') {
      const match = text.match(/\d+/);
      if (match) {
        const value = Number(match[0]);
        const next = value > 0 && Math.random() < 0.5 ? value - 1 : value + 1;
        return text.replace(match[0], String(next));
      }
    }
    if (el.dataset.tcAnomaly === 'name') return cfg.nameAlt || '확인 불가';
    return cfg.textAlt || '—';
  }

  function candidates() {
    const limit = cfg.maxLength || 32;
    return [...doc.querySelectorAll('[data-tc-anomaly]')].filter((el) => {
      const length = el.textContent.trim().length;
      return length > 0 && length <= limit && onScreen(el);
    });
  }

  function busy() {
    return doc.hidden || html.classList.contains('tc-boot-pending') || !!doc.querySelector('.tc-boot, .tc-handoff, .tc-inspect');
  }

  function fire() {
    timer = 0;
    if (busy()) {
      schedule();
      return;
    }
    const list = candidates();
    const duration = rand(...(cfg.show || [650, 1050]));
    if (list.length && Math.random() < 0.75) {
      const el = list[Math.floor(Math.random() * list.length)];
      el.dataset.tcAnomalyShow = altFor(el);
      el.classList.add('tc-anomaly-on');
      root.PCAudio?.noise?.({ ms: 130, gain: 0.04 });
      root.setTimeout(() => {
        el.classList.remove('tc-anomaly-on');
        delete el.dataset.tcAnomalyShow;
      }, duration);
    } else {
      skew = Math.random() < 0.5 ? -1000 : 1000;
      html.classList.add('tc-anomaly-clock');
      root.PCAudio?.noise?.({ ms: 70, gain: 0.03, freq: 2600 });
      root.setTimeout(() => {
        skew = 0;
        html.classList.remove('tc-anomaly-clock');
      }, 1150);
    }
    schedule();
  }

  function schedule(first) {
    root.clearTimeout(timer);
    const [low, high] = cfg.gap || [60000, 150000];
    const factor = html.dataset.silence === 'on' ? 0.35 : html.dataset.threat === 'critical' ? 0.7 : 1;
    timer = root.setTimeout(fire, first ? cfg.firstDelay || 45000 : rand(low, high) * factor);
  }

  /* ---------- 2. 자리 비움 ---------- */

  let awayTimer = 0;
  let savedTitle = null;
  let shownTitle = null;
  doc.addEventListener('visibilitychange', () => {
    const titles = away.titles || [];
    if (doc.hidden) {
      if (!titles.length) return;
      root.clearTimeout(awayTimer);
      awayTimer = root.setTimeout(() => {
        savedTitle = doc.title;
        shownTitle = titles[Math.floor(Math.random() * titles.length)];
        doc.title = shownTitle;
      }, away.after || 1500);
      return;
    }
    root.clearTimeout(awayTimer);
    if (savedTitle !== null && doc.title === shownTitle) doc.title = savedTitle;
    savedTitle = null;
    shownTitle = null;
  });

  /* ---------- 3. 삼야 무응답 기념일 ---------- */

  function forcedSilence() {
    try {
      return new URLSearchParams(root.location.search).get('silence') === '1';
    } catch (_error) {
      return false;
    }
  }

  // 지금이 기념 기간이면 {start, end}(밀리초). 10월 31일에 시작해 11월 2일에 끝나므로 올해와 작년을 모두 본다.
  function silenceWindow(now = Date.now()) {
    if (!silence) return null;
    if (forcedSilence()) {
      const start = now - 3 * 3600000;
      return { start, end: start + silence.minutes * 60000 };
    }
    const year = new Date(now).getUTCFullYear();
    for (const y of [year, year - 1]) {
      const start = Date.UTC(y, silence.month - 1, silence.day, silence.hour, silence.minute);
      const end = start + silence.minutes * 60000;
      if (now >= start && now < end) return { start, end };
    }
    return null;
  }

  const pad = (value) => String(value).padStart(2, '0');
  let silenceTimer = 0;
  function renderSilence() {
    const win = silenceWindow();
    const cell = doc.querySelector('[data-tc-silence]');
    html.dataset.silence = win ? 'on' : 'off';
    if (cell) cell.hidden = !win;
    if (!win) return;
    const elapsed = Math.max(0, Math.floor((Date.now() - win.start) / 1000));
    const value = doc.querySelector('[data-tc-silence-value]');
    if (value) value.textContent = `${pad(Math.floor(elapsed / 3600))}:${pad(Math.floor(elapsed / 60) % 60)}:${pad(elapsed % 60)}`;
  }
  function startSilence() {
    renderSilence();
    root.clearInterval(silenceTimer);
    silenceTimer = root.setInterval(() => {
      if (!doc.hidden) renderSilence();
    }, 1000);
  }

  function start() {
    startSilence();
    schedule(true);
  }

  root.PCAnomaly = Object.freeze({
    clockSkew: () => skew,
    silence: () => html.dataset.silence === 'on',
    silenceWindow
  });

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})(window);
