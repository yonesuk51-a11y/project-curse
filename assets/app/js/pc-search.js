// Project Curse 6 — 통합 검색. 2026-09-25 사용자 결정.
// 상단 바의 '검색' 단추, '/' 키, Ctrl(⌘)+K로 연다. 인물·세계 기록·세력·기록보관소·작전 지도·안내를 한 번에 찾는다.
// 목록은 단말에 이미 올라온 데이터에서 처음 열 때 한 번 만든다. 새 설정이나 요약을 지어내지 않는다.
// 이름·별칭(옛 명부명)·약어는 점과 공백을 무시하고 맞추고(N.H.C = nhc), 한글 초성(ㅅㅋㅁ → 사쿠마)으로도 찾는다.
(function (root) {
  'use strict';

  const doc = root.document;
  const PC = root.PCApp;
  const h = PC.h;

  const KINDS = [
    ['personnel', '인물 기록'],
    ['history', '세계 기록'],
    ['faction', '세력 분석'],
    ['archive', '기록보관소'],
    ['map', '작전 지도'],
    ['guide', '안내·채널']
  ];
  const KIND_LABEL = Object.fromEntries(KINDS);
  const PER_KIND = 8;

  /* ---------- 목록 만들기 ---------- */

  // 점·공백·기호를 빼고 소문자로 — 'N.H.C' → 'nhc', '데드존 혈교' → '데드존혈교'
  const norm = (value) => String(value ?? '').normalize('NFC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
  const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
  const initials = (value) => Array.from(norm(value)).map((ch) => {
    const code = ch.charCodeAt(0) - 0xac00;
    return code >= 0 && code < 11172 ? CHO[Math.floor(code / 588)] : ch;
  }).join('');
  const firstSentence = (value) => {
    const text = (Array.isArray(value) ? value.find(Boolean) : value) || '';
    return String(text).replace(/\s+/g, ' ').trim().split(/(?<=[.다])\s/)[0] || '';
  };

  function build() {
    const items = [];
    const seen = new Set();
    const add = (kind, parts, title, extra = {}) => {
      if (!title) return;
      const path = parts.join('/');
      if (seen.has(path)) return;
      seen.add(path);
      const keys = (extra.keys || []).filter(Boolean).map(String);
      const text = [extra.sub, ...(extra.text || [])].filter(Boolean).join(' ');
      items.push({
        kind, parts, path, title: String(title), sub: extra.sub ? String(extra.sub) : '', text,
        nTitle: norm(title), nKeys: keys.map(norm), nText: norm(text), cho: initials(title), choKeys: keys.map(initials)
      });
    };

    // 인물 — personnel-data.js가 확정한 표시 결과(이름·별칭·역할·소속)
    Object.values(root.ProjectCursePersonnel?.byId || {}).forEach((record) => {
      add('personnel', ['personnel', record.id], record.name, {
        sub: record.role || record.affiliationSummary,
        keys: [...(record.aliases || []), record.unit, record.affiliationSummary],
        text: [record.overview]
      });
    });

    // 세계 기록 — history.js와 같은 순서: 고대 기록, 핵심 기록, 기술 기록, 2006년 이후 기록
    const chron = root.ProjectCurseWorldHistoryData || {};
    const prose = root.ProjectCurseWorldHistoryProse || {};
    const merged = (record) => ({ ...record, ...(chron.getRecord?.(record.id) || {}), ...(prose.getRecord?.(record.id) || {}) });
    [
      ...(chron.deepHistoryRecords || []),
      ...(root.ProjectCurseWorldHistoryCore?.records || []).map(merged),
      ...(root.ProjectCurseJapanTechnology?.records || []),
      ...(chron.post2006Records || []).map((record) => ({ ...record, ...(prose.getRecord?.(record.id) || {}) }))
    ].forEach((record) => {
      add('history', ['history', record.id], record.title, {
        sub: record.date || '',
        keys: [record.date, record.dateLabel],
        text: [record.summary || firstSentence(record.paragraphs)]
      });
    });

    // 세력 — 약어 세력은 한글 역할(roleLabel)로도 찾는다
    Object.entries(root.ProjectCurseFactionAnalysis?.factions || {}).forEach(([id, faction]) => {
      add('faction', ['faction-info', id], faction.name, {
        sub: faction.roleLabel || '',
        keys: [faction.roleLabel, faction.short, faction.english],
        text: [faction.lead]
      });
    });

    // 기록보관소 — 공개 기록
    (root.ProjectCurseArchive?.publicRecords || []).forEach((record) => {
      add('archive', ['archive-entry', record.id], record.title, {
        sub: record.date || record.categoryLabel || '',
        keys: [record.id, record.code, ...(record.tags || [])],
        text: [record.summary]
      });
    });

    // 작전 지도 — 작전, 지역 상세 지도, 현장 기록(순례·귀환·회수), 동시 관측, 지도 지점
    const map = root.ProjectCurseMapRoom || {};
    (map.operations || []).forEach((op) => add('map', ['map-room', 'op', op.id], op.label, { sub: '작전', keys: [op.code, op.region], text: [op.summary] }));
    (map.drilldowns || []).forEach((item) => add('map', ['map-room', 'region', item.id], item.label, { sub: '지역 상세 지도', keys: [item.code], text: [firstSentence(item.description)] }));
    Object.entries(root.ProjectCursePilgrimageData?.scenarios || {}).forEach(([id, scenario]) => {
      add('map', ['map-room', 'pilgrimage', id], scenario.title, { sub: '현장 기록', keys: [scenario.code], text: [scenario.summary] });
    });
    (map.synchronyEvents || []).forEach((event) => add('map', ['map-room', 'synchrony', event.id], event.title, { sub: '동시 관측', keys: [event.code, event.date], text: [event.summary] }));
    (root.ProjectCurseMapSignalIndex?.items || []).forEach((item) => {
      if (item.target?.kind !== 'marker') return;
      add('map', ['map-room', 'marker', item.target.id], item.title, { sub: item.region || '지도 지점', keys: [item.code, item.date, item.meta], text: [item.status] });
    });

    // 안내와 채널 — 입문 카드, 자캐 설정 안내, 등록 양식·등록증, 그리고 왼쪽 채널 목록
    add('guide', ['terminal-home', 'intro'], '입문 카드', { sub: '처음 오신 분', keys: ['입문', '처음', '소개'] });
    add('guide', ['terminal-home', 'guide'], '자캐 설정 안내', { sub: '교류 안내', keys: ['자캐', '캐릭터', '설정', '교류'] });
    add('guide', ['field-manual', 'register'], '자캐 등록증 만들기', { sub: '현장 인원 등록 양식', keys: ['등록증', '등록 양식', '인원 등록', '호출부호'] });
    doc.querySelectorAll?.('[data-tc-nav]').forEach((link) => {
      const label = link.getAttribute('aria-label') || link.textContent;
      add('guide', [link.getAttribute('data-tc-nav')], label, { sub: '채널' });
    });
    return items;
  }

  /* ---------- 찾기 ---------- */

  // 낱말마다 점수를 매겨 모두 맞은 것만 남긴다(띄어 쓴 낱말은 AND). 제목 > 별칭·약어 > 본문 요약 순.
  function wordScore(item, word) {
    if (/^[ㄱ-ㅎ]+$/.test(word)) {
      if (item.cho.startsWith(word)) return 70;
      if (item.cho.includes(word)) return 50;
      return item.choKeys.some((key) => key.includes(word)) ? 35 : 0;
    }
    if (item.nTitle === word) return 100;
    if (item.nTitle.startsWith(word)) return 80;
    if (item.nTitle.includes(word)) return 60;
    if (item.nKeys.some((key) => key === word)) return 55;
    if (item.nKeys.some((key) => key.includes(word))) return 45;
    return item.nText.includes(word) ? 15 : 0;
  }

  function query(items, text, limit = 60) {
    const words = String(text ?? '').trim().split(/\s+/).map(norm).filter(Boolean);
    if (!words.length) return [];
    const hits = [];
    for (const item of items) {
      let total = 0;
      for (const word of words) {
        const score = wordScore(item, word);
        if (!score) {
          total = 0;
          break;
        }
        total += score;
      }
      if (total) hits.push([total, item]);
    }
    hits.sort((a, b) => b[0] - a[0] || a[1].title.length - b[1].title.length);
    return hits.slice(0, limit).map(([, item]) => item);
  }

  /* ---------- 창 ---------- */

  let items = null;
  let panel = null;
  let opener = null;
  let input = null;
  let results = null;
  let status = null;

  const busy = () => !!doc.querySelector('.tc-boot');
  const typing = (target) => !!target?.closest?.('input, textarea, select, [contenteditable="true"]');

  // 제목에서 찾은 글자를 표시 — 점을 무시하고 맞춘 경우(N.H.C ↔ nhc)에는 표시 없이 둔다
  function marked(title, text) {
    const word = String(text || '').trim().split(/\s+/)[0] || '';
    const at = word ? title.toLowerCase().indexOf(word.toLowerCase()) : -1;
    if (at < 0) return [title];
    return [title.slice(0, at), h('mark', { text: title.slice(at, at + word.length) }), title.slice(at + word.length)];
  }

  // 종류별 묶음 안에서는 종류 표지를 빼고, 묶음 없이 보여 줄 때만 붙인다
  function hitLink(item, text, withKind = false) {
    return h('a.tc-search-hit', { href: PC.href(...item.parts) },
      withKind ? h('span.tc-search-kind', { text: KIND_LABEL[item.kind] }) : null,
      h('b', null, marked(item.title, text)),
      item.sub ? h('small', { text: item.sub }) : null
    );
  }

  function starters() {
    return h('div.tc-search-empty', null,
      h('p', { text: '인물·기록·세력·장소 이름으로 찾습니다. 옛 명부명과 약어(nhc), 초성(ㅅㅋㅁ)도 됩니다.' }),
      h('ul.tc-search-list', null, items.filter((item) => item.kind === 'guide' && item.parts.length > 1).slice(0, 3)
        .map((item) => h('li', null, hitLink(item, '', true))))
    );
  }

  function render() {
    const text = input.value;
    results.replaceChildren();
    if (!text.trim()) {
      status.textContent = '';
      results.append(starters());
      return;
    }
    const found = query(items, text);
    if (!found.length) {
      status.textContent = '맞는 기록이 없습니다.';
      results.append(h('p.tc-search-none', { text: `‘${text.trim()}’에 맞는 기록이 없습니다. 이름의 일부나 초성으로 다시 찾아 보십시오.` }));
      return;
    }
    let shown = 0;
    // 가장 잘 맞은 기록이 든 종류부터 — found는 점수 순이다
    const order = [...new Set(found.map((item) => item.kind))];
    order.forEach((kind) => {
      const label = KIND_LABEL[kind];
      const group = found.filter((item) => item.kind === kind);
      shown += Math.min(group.length, PER_KIND);
      results.append(h('section.tc-search-group', { 'aria-label': label },
        h('h3', null, label, h('span', { text: String(group.length) })),
        h('ul.tc-search-list', null, group.slice(0, PER_KIND).map((item) => h('li', null, hitLink(item, text))))
      ));
    });
    status.textContent = `찾은 기록 ${found.length}개${shown < found.length ? ` — 종류마다 ${PER_KIND}개까지 보여 줍니다` : ''}`;
  }

  function links() {
    return panel ? [...panel.querySelectorAll('a.tc-search-hit')] : [];
  }

  function onPanelKey(event) {
    if (!panel) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    const all = links();
    const index = all.indexOf(doc.activeElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!all.length) return;
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      const next = index < 0 ? (step > 0 ? 0 : all.length - 1) : index + step;
      if (next < 0) input.focus();
      else all[Math.min(next, all.length - 1)].focus();
      return;
    }
    if (event.key === 'Enter' && doc.activeElement === input && !event.isComposing && all[0]) {
      event.preventDefault();
      all[0].click();
      return;
    }
    // 창 안에서만 Tab이 돈다
    if (event.key === 'Tab') {
      const focusables = [...panel.querySelectorAll('button, input, a[href]')];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function syncButtons() {
    doc.querySelectorAll('[data-tc-search]').forEach((button) => button.setAttribute('aria-expanded', String(!!panel)));
  }

  function open(button) {
    if (panel || busy()) return;
    if (!items) items = build();
    opener = button || doc.activeElement;
    input = h('input#tc-search-input', {
      type: 'search', autocomplete: 'off', spellcheck: 'false', enterkeyhint: 'search',
      placeholder: '이름, 사건, 세력, 장소…', 'aria-controls': 'tc-search-results'
    });
    status = h('p.tc-search-status', { role: 'status', 'aria-live': 'polite' });
    results = h('div.tc-search-results#tc-search-results');
    panel = h('div.tc-search', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'tc-search-title' },
      h('div.tc-search-box', null,
        h('header.tc-search-head', null,
          h('h2#tc-search-title', null, h('span.tc-full-only', { text: 'SEARCH / ' }), '통합 검색'),
          h('button.tc-btn.tc-search-close', { type: 'button', text: '닫기', onclick: () => close() })
        ),
        h('label.tc-search-field', { for: 'tc-search-input' }, h('span.tc-sr', { text: '검색어' }), input),
        status,
        results
      )
    );
    panel.addEventListener('pointerdown', (event) => {
      if (event.target === panel) close();
    });
    input.addEventListener('input', render);
    panel.addEventListener('keydown', onPanelKey);
    // 지금 보고 있는 화면을 다시 고르면 주소가 그대로라 이동 알림이 없다 — 누른 뒤에 직접 닫는다
    results.addEventListener('click', (event) => {
      if (event.target.closest('a.tc-search-hit')) root.setTimeout(() => close(false), 0);
    });
    doc.body.append(panel);
    render();
    syncButtons();
    root.PCAudio?.cue('menu.open');
    input.focus({ preventScroll: true });
  }

  function close(restoreFocus = true) {
    if (!panel) return;
    panel.remove();
    panel = null;
    input = null;
    results = null;
    status = null;
    syncButtons();
    root.PCAudio?.cue('menu.close');
    if (restoreFocus && opener?.isConnected) opener.focus({ preventScroll: true });
  }

  doc.addEventListener('click', (event) => {
    const button = event.target.closest?.('[data-tc-search]');
    if (!button) return;
    if (panel) close();
    else open(button);
  });
  // '/' 키(글자를 적는 중이 아닐 때)와 Ctrl(⌘)+K
  doc.addEventListener('keydown', (event) => {
    if (panel || event.defaultPrevented) return;
    const combo = (event.ctrlKey || event.metaKey) && !event.altKey && String(event.key).toLowerCase() === 'k';
    const slash = event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !typing(event.target);
    if (!combo && !slash) return;
    if (busy()) return;
    event.preventDefault();
    open(doc.querySelector('[data-tc-search]'));
  });
  // 결과를 눌러 화면이 바뀌면 창을 닫는다(새 화면이 제목에 포커스를 둔다)
  doc.addEventListener('pc:route', () => close(false));

  root.PCSearch = Object.freeze({ build, query, norm, initials, open, close });
})(window);
