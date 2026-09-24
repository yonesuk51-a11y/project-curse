// Project Curse 6 — 새 기록 알림. 2026-09-25 사용자 결정.
// 이 브라우저가 지난번에 본 기록 목록(세계 기록·기록보관소·인물·세력·작전)을 저장해 두고, 이번 방문에 새로 생긴 기록을 찾는다.
// 본문 안에서 새 기록으로 가는 링크에는 셸이 data-tc-new를 붙인다(화면 코드는 할 일이 없다).
// 첫 방문에는 아무것도 표시하지 않고 기준만 저장한다. 한 탭(세션) 안에서는 처음 계산한 결과를 유지한다.
// 무엇이 들어왔는지 사람이 읽는 목록은 site-updates-data.js(갱신 기록)가 맡는다. 홈이 PCUpdates.since()로 보여 준다.
(function (root) {
  'use strict';

  const doc = root.document;
  const PC = root.PCApp;
  const KEY = 'pc6_seen_v1';
  const SESSION_KEY = 'pc6_fresh_v1';

  const asList = (value) => (Array.isArray(value) ? value : value && typeof value === 'object' ? Object.values(value) : []);
  const idsOf = (value) => asList(value).map((item) => item && item.id).filter(Boolean);

  // 주소 첫 조각(map-room은 두 조각)과 같은 모양의 키로 모은다
  function collect() {
    const personnel = root.ProjectCursePersonnel || {};
    return {
      history: idsOf(root.ProjectCurseWorldHistoryCore?.records),
      'archive-entry': idsOf(root.ProjectCurseArchive?.publicRecords),
      personnel: personnel.byId ? Object.keys(personnel.byId) : idsOf(personnel.records),
      'faction-info': Object.keys(root.ProjectCurseFactionAnalysis?.factions || {}),
      'map-room': idsOf(root.ProjectCurseMapRoom?.operations).map((id) => `op/${id}`)
    };
  }

  function compute() {
    try {
      const cached = JSON.parse(root.sessionStorage.getItem(SESSION_KEY) || 'null');
      if (cached && cached.fresh) return cached;
    } catch (_error) { /* 새로 계산한다 */ }
    const now = collect();
    let stored = null;
    try {
      stored = JSON.parse(root.localStorage.getItem(KEY) || 'null');
    } catch (_error) {
      stored = null;
    }
    const result = { first: !stored, since: stored?.at || null, fresh: {} };
    if (stored) {
      Object.entries(now).forEach(([kind, list]) => {
        const before = stored.ids?.[kind];
        if (!Array.isArray(before)) {
          result.fresh[kind] = []; // 새로 생긴 분류는 이번 방문을 기준으로 삼는다
          return;
        }
        const old = new Set(before);
        result.fresh[kind] = list.filter((id) => !old.has(id));
      });
    }
    try {
      root.localStorage.setItem(KEY, JSON.stringify({ at: new Date().toISOString(), ids: now }));
      root.sessionStorage.setItem(SESSION_KEY, JSON.stringify(result));
    } catch (_error) { /* 저장하지 못하면 다음 방문에도 첫 방문으로 본다 */ }
    return result;
  }

  let state = null;
  const sets = {};
  // 홈이 먼저 그려질 수도 있으므로 처음 물을 때 계산한다
  function ensure() {
    if (!state) state = compute();
    return state;
  }
  function freshSet(kind) {
    if (!sets[kind]) sets[kind] = new Set(ensure().fresh?.[kind] || []);
    return sets[kind];
  }

  function keyFor(loc) {
    if (!loc.parts.length) return null;
    return loc.route === 'map-room' ? loc.parts.slice(0, 2).join('/') : loc.parts[0];
  }

  function decorate(scope) {
    if (ensure().first) return;
    scope.querySelectorAll('a[href^="#"]').forEach((link) => {
      if (link.dataset.tcNew) return;
      const loc = PC.parse(link.getAttribute('href'));
      const key = keyFor(loc);
      if (!key || !freshSet(loc.route).has(key)) return;
      const display = root.getComputedStyle(link).display;
      link.dataset.tcNew = display === 'inline' ? 'inline' : 'block';
      // 링크 이름에도 들어가도록 글자로 붙인다(블록 링크는 오른쪽 위에 띄운다 — components.css)
      link.append(PC.h('span.tc-new-badge', { text: '새 기록' }));
    });
  }

  function isFresh(route, ...parts) {
    const key = keyFor({ route, parts });
    return !!key && freshSet(route).has(key);
  }

  function count() {
    return Object.values(ensure().fresh || {}).reduce((sum, list) => sum + list.length, 0);
  }

  // 갱신 기록 — 지난 방문 이후 것. 첫 방문이면 최근 것 몇 개.
  function since(limit = 3) {
    const entries = [...(root.ProjectCurseSiteUpdates?.entries || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    ensure();
    if (state.first || !state.since) return { first: true, entries: entries.slice(0, limit) };
    // 항목의 at(시각)이 있으면 그것으로, 없으면 그날의 끝으로 비교한다
    const last = Date.parse(state.since);
    const when = (entry) => Date.parse(entry.at || `${entry.date}T23:59:59Z`);
    return { first: false, entries: entries.filter((entry) => when(entry) > last) };
  }

  function start() {
    ensure();
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

  root.PCUpdates = Object.freeze({
    isFresh,
    count,
    since,
    first: () => !!ensure().first,
    lastVisit: () => ensure().since || null,
    fresh: (kind) => [...freshSet(kind)]
  });

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})(window);
