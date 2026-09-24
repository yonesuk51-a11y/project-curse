// Project Curse 6 — archive owner. Prose belongs to data or the protected nodes.
(function (root) {
  'use strict';
  const PC = root.PCApp, { h } = PC, doc = root.document;
  const data = root.ProjectCurseArchiveViewerData;
  const records = () => root.ProjectCurseArchive?.publicRecords || [];
  const documents = () => root.ProjectCurseArchiveDocuments?.documents || {};
  const registry = () => root.ProjectCurseCinematicRegistry;
  const evidence = () => root.ProjectCurseVisualEvidence;
  const motion = root.matchMedia('(prefers-reduced-motion: reduce)');
  const categories = [['all', '전체'], ['video', '영상'], ['incident', '사건·회수'], ['region', '권역'], ['guide', '규정·안내'], ['operation', '작전'], ['entity', '개체'], ['cult', '교단·오염']];
  const sourceNames = { ORIGINAL: '원본 보존', STABILIZED: '열람 보정본', RECONSTRUCTED: '복원 추정본', UNVERIFIED: '출처 대조 대기' };
  const sourceTones = { ORIGINAL: 'ok', STABILIZED: 'info', RECONSTRUCTED: 'evidence', UNVERIFIED: 'dim' };
  const indexState = { filter: 'all', query: '', scope: 'public', scroll: 0, focus: '' };
  let host, view, life, activeId = '', restoreVault = null, player = null;
  let images = [], imageDialog = null, imageLife = null, imageIndex = 0, imageTrigger = null;

  // One lifetime per show, with child lifetimes for changing media frames/dialogs.
  function lifetime() {
    const controller = new AbortController(), timers = new Set(), frames = new Set(), disposers = [];
    return {
      get live() { return !controller.signal.aborted; },
      on(target, type, fn, options = {}) { target.addEventListener(type, fn, { ...options, signal: controller.signal }); },
      later(fn, ms) { const id = root.setTimeout(() => { timers.delete(id); if (!controller.signal.aborted) fn(); }, ms); timers.add(id); return id; },
      frame(fn) { const id = root.requestAnimationFrame(() => { frames.delete(id); if (!controller.signal.aborted) fn(); }); frames.add(id); },
      dispose(fn) { disposers.push(fn); },
      end() { controller.abort(); timers.forEach(root.clearTimeout); frames.forEach(root.cancelAnimationFrame); disposers.splice(0).forEach(fn => fn()); }
    };
  }
  function button(label, fn, props = {}, scope = life) {
    const el = h('button.tc-btn', { type: 'button', ...props }, label);
    scope.on(el, 'click', fn); return el;
  }
  function link(label, route, ...parts) { return h('a.tc-btn', { href: PC.href(route, ...parts) }, label); }
  function backLink() {
    const el = link('← 기록 색인', 'archive-entry');
    life.on(el, 'click', e => { e.preventDefault(); PC.back('archive-entry'); }); return el;
  }
  function kv(entries) { return h('dl.tc-kv.tc-arc-kv', null, entries.map(([term, value]) => h('div', null, h('dt', { text: term }), h('dd', null, value ?? '미등록')))); }
  function note(label, text, tone = 'evidence') { return h(`aside.tc-note.tc-note--${tone}`, null, h('b', { text: label }), h('p', { text })); }
  function disclosure(label, content, code = '', open = false) {
    return h('details.tc-disclosure.tc-arc-disclosure', { open }, h('summary', null, h('span', null, code ? h('small.tc-label', { text: code }) : null, h('b', { text: label }))), h('div.tc-disclosure-body.tc-arc-stack', null, content));
  }
  function section(title, ...children) { return h('section.tc-arc-section', null, h('h2', { text: title }), children); }
  function sourceTag(key) { return PC.tag(sourceNames[key] || '출처 미등록', sourceTones[key] || 'dim'); }
  function riskTag(risk) { return PC.tag(risk || '미등록', /CRITICAL|HIGH/.test(risk) ? 'danger' : risk ? 'caution' : 'dim', { latin: true }); }
  function readSaved(key, empty, storage) {
    try { const value = JSON.parse((storage || root.localStorage).getItem(key)); return value && typeof value === 'object' ? value : empty; } catch (_) { return empty; }
  }
  function writeSaved(key, value, storage) {
    try { (storage || root.localStorage).setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; }
  }
  function storageNote(ok, target) { if (!ok) target.append(PC.missing('LOCAL SAVE UNAVAILABLE', '', '이 브라우저에서 저장할 수 없습니다. 현재 열람 중인 사본에만 반영됩니다.')); }
  function focusAt(el) { if (el) { el.tabIndex = -1; el.focus({ preventScroll: true }); el.scrollIntoView({ block: 'start', behavior: motion.matches ? 'auto' : 'smooth' }); } }

  function directory() {
    return Object.entries(documents()).filter(([id]) => !records().some(r => r.id === id)).map(([id, item]) => ({ id, code: item.code, title: item.title, summary: item.summary, date: item.date, format: 'document', categoryLabel: '내부 문서', category: 'internal', risk: '', provenance: '', tags: [] }));
  }
  function recordRow(record) {
    return h('a.tc-row.tc-arc-row', { href: PC.href('archive-entry', record.id), dataset: { arcRecord: record.id } },
      h('span.tc-row-time.tc-arc-code', null, h('b', { text: record.code }), h('time', { text: record.date })),
      h('span.tc-row-main', null, h('b', { text: record.title }), h('span.tc-arc-row-summary', { text: record.summary })),
      h('span.tc-row-meta', null, PC.tag(record.format, 'info', { latin: true }), PC.tag(record.categoryLabel, 'evidence'), riskTag(record.risk), sourceTag(record.provenance)), h('span.tc-row-go', { text: '›', 'aria-hidden': 'true' }));
  }
  function renderIndex() {
    const all = [...records(), ...directory()];
    const controls = h('section.tc-panel.tc-arc-tools', { 'aria-label': '기록 검색 및 분류' });
    const input = h('input#tc-arc-search', { type: 'search', value: indexState.query, placeholder: '증거 코드 · 제목 · 사건 · 지역', autocomplete: 'off', spellcheck: 'false' });
    const result = h('p.tc-code', { role: 'status', 'aria-live': 'polite' });
    const list = h('div.tc-rows.tc-arc-list', { 'aria-label': '증거 목록' });
    const empty = h('div.tc-arc-stack', { hidden: true }, PC.missing('NO MATCHING RECORD', '', '일치하는 기록이 없습니다.'), button('검색·분류 초기화', () => { indexState.query = ''; indexState.filter = 'all'; input.value = ''; apply(); input.focus(); }));
    const scopes = h('div.tc-seg', { role: 'group', 'aria-label': '색인 범위' });
    [['public', `공개 기록 ${records().length}`], ['internal', `내부 문서 ${directory().length}`], ['all', `전체 ${all.length}`]].forEach(([key, label]) => scopes.append(button(label, () => { indexState.scope = key; apply(); }, { dataset: { arcScope: key } })));
    const filters = h('div.tc-seg', { role: 'group', 'aria-label': '기록 분류 필터' }, categories.map(([key, label]) => button([label, h('i', { 'aria-hidden': 'true' })], () => { indexState.filter = key; apply(); }, { dataset: { arcFilter: key } })));
    const chapterGroups = data.chapters.map(chapter => {
      const item = disclosure(chapter.title, [h('p', { text: chapter.summary }), h('div.tc-btnrow', null, chapter.ids.map(id => { const r = records().find(record => record.id === id); return r ? h('a.tc-btn', { href: PC.href('archive-entry', id), dataset: { arcRecord: id } }, r.title) : PC.missing('CHAPTER RECORD MISSING', id, '기록 묶음의 항목이 없습니다.'); }))], `${chapter.index} / ${chapter.range}`);
      return { item, ids: chapter.ids };
    });
    const readingGroups = disclosure('사건 흐름에 따른 기록 묶음', [h('p', { text: data.copy.indexIntro }), ...chapterGroups.map(group => group.item)], 'READING INDEX');
    function apply() {
      const pool = indexState.scope === 'public' ? records() : indexState.scope === 'internal' ? directory() : all;
      const query = indexState.query.trim().toLocaleLowerCase('ko');
      const matches = pool.filter(r => (indexState.filter === 'all' || (indexState.filter === 'video' ? r.format === 'video' : r.category === indexState.filter)) && (!query || [r.id, r.code, r.title, r.summary, r.format, r.categoryLabel, r.date, ...(r.tags || [])].join(' ').toLocaleLowerCase('ko').includes(query)));
      list.replaceChildren(...matches.map(recordRow)); list.hidden = !matches.length; empty.hidden = !!matches.length;
      result.textContent = `${matches.length} / ${pool.length}건 · ${query ? `“${indexState.query.trim()}”` : '증거 코드 / 형식 / 분류 / 위험도 / 출처'}`;
      scopes.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.arcScope === indexState.scope)));
      filters.querySelectorAll('button').forEach(b => { const key = b.dataset.arcFilter; b.setAttribute('aria-pressed', String(key === indexState.filter)); b.querySelector('i').textContent = String(pool.filter(r => key === 'all' || (key === 'video' ? r.format === 'video' : r.category === key)).length); });
      const visibleIds = new Set(matches.map(r => r.id));
      chapterGroups.forEach(({ item, ids }) => { item.hidden = !ids.some(id => visibleIds.has(id)); item.querySelectorAll('[data-arc-record]').forEach(a => { a.hidden = !visibleIds.has(a.dataset.arcRecord); }); if (query || indexState.filter !== 'all') item.open = !item.hidden; });
      readingGroups.hidden = chapterGroups.every(group => group.item.hidden); if (query || indexState.filter !== 'all') readingGroups.open = true;
    }
    life.on(input, 'input', () => { indexState.query = input.value; apply(); });
    life.on(view, 'click', e => { const a = e.target.closest('[data-arc-record]'); if (a) { indexState.focus = a.dataset.arcRecord; indexState.scroll = root.scrollY; } });
    controls.append(h('div.tc-arc-toolbar', null, h('label.tc-arc-search', { for: input.id }, h('span.tc-label', { text: '증거 검색' }), input), link('매체 검수 ›', 'media-audit')), scopes, filters, result);
    view.append(PC.screenHead('archive-entry', { meta: [['PUBLIC', String(records().length).padStart(2, '0')], ['VIDEO', String(records().filter(r => r.format === 'video').length).padStart(2, '0')], ['INTERNAL', String(directory().length).padStart(2, '0')]] }), controls, list, empty);
    view.append(readingGroups);
    view.append(disclosure('자료 출처 표시', Object.entries(evidence()?.classes || {}).map(([key, item]) => h('div.tc-arc-legend-row', null, sourceTag(key), h('p', { text: item.description }))), 'SOURCE STATE'), verdictIndex()); apply();
  }

  /* ---------- Responsive originals and source comparison ---------- */
  function imageNode(src, alt, scope = life, original = false) {
    const path = evidence().normalize(src), descriptor = root.ProjectCurseMediaManifest?.resolve(path);
    const img = h('img', { alt: alt || '', decoding: 'async', loading: original ? 'eager' : 'lazy' });
    if (descriptor) {
      img.width = descriptor.width; img.height = descriptor.height;
      if (!original && descriptor.variants.length) { img.srcset = descriptor.variants.map(v => `${v.src} ${v.width}w`).join(', '); img.sizes = '(max-width: 720px) 92vw, 760px'; }
    }
    const wrapper = h('div.tc-arc-image-frame', null, img), status = h('p.tc-arc-image-status', { role: 'status', hidden: true });
    scope.on(img, 'error', () => { status.hidden = false; status.replaceChildren('시각 자료를 불러오지 못했습니다. ', button('다시 요청', () => { status.hidden = true; img.src = path; }, {}, scope)); });
    scope.on(img, 'load', () => { status.hidden = true; }); wrapper.append(status); img.src = path; return wrapper;
  }
  // 첨부 썸네일은 가장 작은 반응형 파생본을 쓴다. 파생본이 없으면 원본 경로 그대로다.
  function thumbSrc(path) {
    return root.ProjectCurseMediaManifest?.resolve(path)?.variants?.[0]?.src || path;
  }
  function registerImage(src, caption, alt, recordId = activeId) {
    images.push(evidence().resolve(src, { recordId, sequence: images.length + 1, caption, alt })); return images.length - 1;
  }
  function figure(item, eager = false) {
    if (!item?.src) return null;
    const index = registerImage(item.src, item.caption, item.alt), resolved = images[index];
    const fig = h('figure.tc-evidence.tc-arc-figure', null,
      h('div.tc-arc-evidence-head', null, sourceTag(resolved.className), h('span.tc-code', { text: resolved.assetId }), button('증거 확대·대조', e => openEvidence(index, e.currentTarget), { dataset: { arcEvidence: String(index) } })),
      imageNode(item.src, item.alt), item.caption ? h('figcaption', null, h('span', { text: item.caption })) : null);
    if (eager) fig.querySelector('img').loading = 'eager'; return fig;
  }
  function evidenceIndex() {
    if (!images.length) return null;
    const controls = h('div.tc-seg', { role: 'group', 'aria-label': '첨부 출처 필터' }), list = h('div.tc-arc-attachment-list'), status = h('p.tc-code', { role: 'status' });
    let selected = 'ALL', listLife = lifetime(); life.dispose(() => listLife.end());
    function render() {
      listLife.end(); listLife = lifetime();
      controls.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.source === selected)));
      list.replaceChildren(...images.map((item, index) => ({ item, index })).filter(({ item }) => selected === 'ALL' || item.className === selected).map(({ item, index }) => button([h('img.tc-arc-thumb', { src: thumbSrc(item.path), alt: '', loading: 'lazy', decoding: 'async', width: 72, height: 64 }), h('span', null, h('small.tc-code', { text: item.assetId }), h('b', { text: item.caption || item.alt || item.path }), sourceTag(item.className))], e => openEvidence(index, e.currentTarget), { class: 'tc-arc-attachment', dataset: { arcEvidence: String(index) } }, listLife)));
      status.textContent = `${list.childElementCount} / ${images.length}개 첨부`;
      if (!list.childElementCount) list.append(PC.missing('NO MATCHING EVIDENCE', selected, '이 출처 등급의 첨부가 없습니다.'));
    }
    [['ALL', '전체'], ...Object.entries(sourceNames)].forEach(([key, label]) => controls.append(button(label, () => { selected = key; render(); }, { dataset: { source: key } }))); render();
    return disclosure('시각 증거 보존 상태와 첨부', [h('p', { text: data.copy.sourceIntro }), controls, status, list], 'VISUAL EVIDENCE');
  }
  function openEvidence(index, trigger) {
    if (!images[index]) { view.append(PC.missing('EVIDENCE NOT FOUND', String(index), '첨부가 없습니다.')); return; }
    player?.pause(); imageIndex = index; imageTrigger = trigger?.isConnected ? trigger : view.querySelector(`.tc-arc-cinema-stage [data-arc-evidence="${index}"]`);
    if (!imageDialog) {
      imageDialog = h('dialog.tc-arc-dialog', { 'aria-labelledby': 'tc-arc-evidence-title' }); view.append(imageDialog);
      life.on(imageDialog, 'cancel', e => { e.preventDefault(); closeEvidence(); });
      life.on(imageDialog, 'click', e => { if (e.target === imageDialog) closeEvidence(); });
      life.on(imageDialog, 'keydown', e => { if (e.target.matches('input')) return; if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); imageIndex = (imageIndex + (e.key === 'ArrowLeft' ? -1 : 1) + images.length) % images.length; renderEvidence(); } });
    }
    renderEvidence(); if (!imageDialog.open) imageDialog.showModal(); imageDialog.querySelector('button').focus();
  }
  function closeEvidence(restore = true) {
    imageLife?.end(); imageLife = null; if (imageDialog?.open) imageDialog.close(); imageDialog?.replaceChildren();
    if (restore && imageTrigger?.isConnected) imageTrigger.focus({ preventScroll: true }); imageTrigger = null;
  }
  function renderEvidence() {
    const focusedLabel = imageDialog?.contains(doc.activeElement) ? doc.activeElement.textContent : '';
    imageLife?.end(); imageLife = lifetime(); const scope = imageLife, item = images[imageIndex];
    const stage = h('div.tc-arc-evidence-stage'), loading = h('p.tc-code', { role: 'status', text: '시각 자료 요청 중' });
    const close = button('닫기 · Esc', () => closeEvidence(), { 'aria-label': '시각 증거 닫기' }, scope), current = imageNode(item.path, item.alt || item.caption, scope, true);
    let range = null;
    if (item.comparison) {
      const original = imageNode(item.comparison.path, item.comparison.label, scope, true), compare = h('div.tc-arc-compare', null, original, current);
      current.classList.add('tc-arc-compare-current'); compare.style.setProperty('--arc-split', '50%');
      range = h('input#tc-arc-compare-range', { type: 'range', min: 0, max: 100, value: 50, disabled: true });
      scope.on(range, 'input', () => compare.style.setProperty('--arc-split', `${range.value}%`));
      stage.append(h('div.tc-arc-compare-labels', null, h('span', { text: item.className }), h('span', { text: item.comparison.label })), compare, h('label.tc-arc-range', { for: range.id }, '두 이미지 비교 경계', range));
    } else stage.append(current);
    const sync = () => { const imgs = [...stage.querySelectorAll('img')], ready = imgs.every(img => img.complete && img.naturalWidth > 0); if (range) range.disabled = !ready; loading.textContent = ready ? `${imgs.length} / ${imgs.length}개 원본 크기 자료 수신` : '자료 수신 대기 · 실패한 자료는 다시 요청할 수 있습니다.'; };
    stage.querySelectorAll('img').forEach(img => { scope.on(img, 'load', sync); scope.on(img, 'error', sync); }); sync();
    imageDialog.replaceChildren(h('header.tc-arc-dialog-head', null, h('div', null, h('p.tc-code', { text: `${item.recordId} / ${imageIndex + 1} OF ${images.length}` }), h('h2#tc-arc-evidence-title', { text: item.assetId })), close), stage, loading,
      h('p', { text: item.caption || item.alt }), kv([['출처 판정', sourceTag(item.className)], ['출처', item.source], ['시점', item.date], ['무결성', item.integrity], ['원본 상태', item.comparison ? '비교 자료 연결됨' : item.originalState === 'missing' ? '원본 미등록' : item.originalState === 'available' ? '원본 계열 확인' : '추가 대조 필요'], ['관계', item.comparison?.relationship || '단일 자산']]),
      h('p', { text: item.handling }), note('대조 주석', item.comparison ? data.copy.comparisonNote : item.className === 'RECONSTRUCTED' ? data.copy.reconstructionNote : data.copy.sourceNote),
      h('nav.tc-btnrow', { 'aria-label': '첨부 이동' }, button('← 이전 증거', () => { imageIndex = (imageIndex - 1 + images.length) % images.length; renderEvidence(); }, {}, scope), button('다음 증거 →', () => { imageIndex = (imageIndex + 1) % images.length; renderEvidence(); }, {}, scope)));
    if (focusedLabel) [...imageDialog.querySelectorAll('button')].find(b => b.textContent === focusedLabel)?.focus({ preventScroll: true });
  }

  /* ---------- File cover, authored documents and protected originals ---------- */
  function related(id) {
    const links = new Map();
    (root.ProjectCurseIncidentNetwork?.incidentList || []).filter(item => item.records?.includes(id)).forEach(item => {
      if (item.operation) links.set(`op:${item.operation}`, link(item.title || item.operation, 'map-room', 'op', item.operation));
      if (item.history) links.set(`history:${item.history}`, link('연관 세계 기록', 'history', item.history));
      (item.factions || []).forEach(key => links.set(`faction:${key}`, link(key.toUpperCase(), 'faction-info', key)));
      (item.records || []).filter(key => key !== id).forEach(key => links.set(`record:${key}`, link(records().find(r => r.id === key)?.title || key, 'archive-entry', key)));
    });
    return links.size ? h('nav.tc-btnrow', { 'aria-label': '관련 작전·세력·기록' }, [...links.values()]) : h('p.tc-muted', { text: '관련 작전·세력 연결 미등록' });
  }
  function fileCover(id, record, item, locked) {
    const cinema = registry()?.get(id), title = record?.title || item?.title || locked?.querySelector('.doc-title')?.textContent || id;
    const custody = (item?.sections || []).filter(s => s.record).map(s => s.record);
    return h('header.tc-panel.tc-arc-cover', null, h('div.tc-arc-cover-top', null, h('p.tc-code', { text: `EVIDENCE FILE / ${id}` }), backLink()),
      h('h1', { text: title, 'data-tc-focus': '' }), record?.summary ? h('p.tc-arc-lead', { text: record.summary }) : null,
      item?.summary && item.summary !== record?.summary ? h('p', { text: item.summary }) : null,
      kv([['증거 번호', record?.code || item?.code || id], ['보안 등급', item?.classification || (id === 'Cults_871104' ? data.copy.securityFacts[0][1] : '별도 등급 미등록')], ['작성·기록일', record?.date || item?.date || '미등록'], ['출처', item?.owner || cinema?.sourceLabel || '미등록'], ['형식', record?.format || 'document'], ['분류', record?.categoryLabel || '내부 문서'], ['위험도', riskTag(record?.risk)], ['출처 판정', sourceTag(record?.provenance)]]),
      item?.date && record?.date && item.date !== record.date ? kv([['본문 기록일·개정 이력', item.date]]) : null,
      locked?.querySelector('.doc-meta') ? h('p.tc-arc-meta', { text: locked.querySelector('.doc-meta').textContent }) : null,
      disclosure('인계 기록·정보 한계', custody.length ? custody.map(r => kv([['기록', r.code], ['작성자', r.author], ['수신자', r.recipient], ['근거', r.evidence], ['한계', r.limit]])) : h('p.tc-muted', { text: '이 자료에 등록된 인계 기록이 없습니다.' }), 'CHAIN OF CUSTODY'),
      related(id), h('p.tc-code', { text: `ATTACHMENTS / ${item?.sections?.length || 0} DOCUMENT SECTIONS${cinema ? ` · ${registry().pages(id).length} VIDEO FRAMES` : ''}` }),
      h('p.tc-arc-annotation', { text: '판정 주석과 자료의 출처·한계는 각 기록면에 함께 표시됩니다.' }));
  }
  function tableBlock(table) {
    return h('div.tc-arc-table-wrap', { tabindex: '0', role: 'region', 'aria-label': '기록 표 · 좌우 이동 가능' }, h('table.tc-arc-table', null,
      table.headers?.length ? h('thead', null, h('tr', null, table.headers.map(text => h('th', { scope: 'col', text })))) : null,
      h('tbody', null, (table.rows || []).map(row => h('tr', null, row.map(text => h('td', { text })))))));
  }
  function transcriptBlock(rows) {
    return h('ol.tc-arc-transcript', null, rows.map(row => h('li', { class: row.cue ? 'tc-arc-cue' : '' }, h('time.tc-code', { text: row.time || '—' }),
      h('div', null, row.speaker ? h('b', { text: row.speaker }) : null, h('p', { text: row.cue || row.text })))));
  }
  function authoredBlocks(item) {
    const out = [];
    if (item.image && item.image.placement !== 'after') out.push(figure(item.image));
    if (item.record) out.push(kv([['자료 코드', item.record.code], ['문서 목적', item.record.type], ['작성자', item.record.author], ['수신자', item.record.recipient], ['근거', item.record.evidence], ['정보 한계', item.record.limit]]));
    (item.paragraphs || []).forEach(text => out.push(h('p', { text })));
    if (item.quote) out.push(h('blockquote', { text: item.quote }));
    if (item.items) out.push(h('ul', null, item.items.map(text => h('li', { text }))));
    if (item.table) out.push(tableBlock(item.table));
    if (item.transcript) out.push(transcriptBlock(item.transcript));
    if (item.warning) out.push(note('기록 주의', item.warning, 'danger'));
    (item.groups || []).forEach(group => out.push(h('section.tc-arc-group', null, h('h4', { text: group.title }), authoredBlocks(group))));
    if (item.branches) out.push(operationBranches(item.branches));
    if (item.image?.placement === 'after') out.push(figure(item.image));
    return out;
  }
  function documentBody(item) {
    const nav = h('nav.tc-arc-toc', { 'aria-label': '문서 목차' }, h('b.tc-label', { text: 'CONTENTS / 문서 목차' }));
    const body = h('div.tc-arc-document-body'), layout = h('div.tc-arc-document', null, nav, body), sections = [];
    if (item.telemetry) body.append(kv(item.telemetry));
    if (item.hero) body.append(figure(item.hero, true));
    (item.sections || []).forEach((part, i) => {
      const block = h('section.tc-arc-document-section', { id: `tc-arc-part-${i}`, 'aria-labelledby': `tc-arc-part-title-${i}` }, h('h2', { id: `tc-arc-part-title-${i}`, text: part.title }), authoredBlocks(part));
      const jump = button(`${String(i + 1).padStart(2, '0')} · ${part.title}`, () => focusAt(block), { dataset: { arcPart: String(i) } }); nav.append(jump); body.append(block); sections.push(block);
    });
    if (root.IntersectionObserver) {
      const observer = new IntersectionObserver(entries => { const entry = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (!entry) return; nav.querySelectorAll('button').forEach(b => b.setAttribute('aria-current', String(sections[Number(b.dataset.arcPart)] === entry.target))); }, { rootMargin: '-90px 0px -50% 0px' });
      sections.forEach(s => observer.observe(s)); life.dispose(() => observer.disconnect());
    }
    const scenario = item.scenarioId || ({ Great_Black_Forest_Region: 'unlit-fortress', Dead_Zone_Pilgrimage: 'deadzone-return' })[activeId];
    if (scenario) body.append(link('해당 현장 기록으로 이동', 'map-room', 'pilgrimage', scenario));
    if (item.unlockScenario) body.append(link('연결된 전진 회수 작전', 'map-room', 'pilgrimage', item.unlockScenario));
    if (item.presentation === 'verdict') { const target = root.ProjectCursePilgrimageData?.scenarios[scenario]?.mapTarget; if (target?.detail) body.append(link('판정 좌표를 관제도에서 확인', 'map-room', 'region', target.detail)); }
    return layout;
  }
  function protectedBody(article) {
    const parent = article.parentNode, next = article.nextSibling;
    const attributes = [article, ...article.querySelectorAll('*')].map(el => [el, [...el.attributes].map(a => [a.name, a.value])]);
    const textUndo = [], wrapper = h('div.tc-arc-protected'); let tabSet = 0;
    const restricted = article.dataset.record === 'Cults_871104';
    if (restricted) wrapper.append(note(data.copy.securityTitle, data.copy.securityNote), kv(data.copy.securityFacts));
    wrapper.append(article); article.hidden = false;
    function tabs(bar, panels) {
      if (!bar) return;
      const buttons = [...bar.children].filter(el => el.tagName === 'BUTTON'), group = tabSet++;
      bar.setAttribute('role', 'tablist'); bar.setAttribute('aria-label', group ? '하위 기록면' : '보호 원문 기록면');
      function select(i, focus = false) {
        buttons.forEach((b, n) => { b.classList.toggle('active', n === i); b.tabIndex = n === i ? 0 : -1; b.setAttribute('aria-selected', String(n === i)); });
        panels.forEach((p, n) => { p.hidden = n !== i; p.classList.toggle('active', n === i); }); if (focus) buttons[i].focus();
      }
      buttons.forEach((b, i) => {
        b.id = `tc-arc-tab-${group}-${i}`; b.setAttribute('role', 'tab');
        if (panels[i]) { panels[i].id = `tc-arc-panel-${group}-${i}`; b.setAttribute('aria-controls', panels[i].id); panels[i].setAttribute('role', 'tabpanel'); panels[i].setAttribute('aria-labelledby', b.id); }
        life.on(b, 'click', () => select(i));
        life.on(b, 'keydown', e => { let n = i; if (e.key === 'ArrowRight') n = (i + 1) % buttons.length; else if (e.key === 'ArrowLeft') n = (i - 1 + buttons.length) % buttons.length; else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = buttons.length - 1; else return; e.preventDefault(); select(n, true); });
      }); select(0);
    }
    article.querySelectorAll('.paged-record').forEach(p => tabs(p.querySelector(':scope > .page-tabs'), [...p.children].filter(el => el.classList.contains('record-page'))));
    article.querySelectorAll('.nested-record').forEach(p => tabs(p.querySelector(':scope > .sub-tabs'), [...(p.querySelector(':scope > .sub-pages')?.children || [])]));
    // Same deterministic redaction selection as the old main.js patch. Undo every text-node change on return.
    let used = 0;
    const targets = restricted ? [...article.querySelectorAll('.record-page p, .record-page li, .record-page h3, .sub-page p, .sub-page li')].filter(el => el.textContent.trim().length >= 30 && !el.closest('.fhc-security-panel, .record-figure') && /우시노다|타락|혈교|의식|인신|괴이|변형|혈무|제물|오염|변이|피의|교단|존재|신자|현장|소각|봉쇄/.test(el.textContent)) : [];
    targets.forEach((el, index) => {
      if (used >= 6 || (index % 2 && !/인신|혈무|피의|제물|오염/.test(el.textContent))) return;
      const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode(node) { return node.nodeValue.trim().length >= 28 && !node.parentElement.closest('script,style,button,figcaption,.fhc-security-panel,.record-figure,.page-tabs,.sub-tabs,.doc-header') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } });
      const node = walker.nextNode(); if (!node || node.nodeValue.length < 34) return;
      const raw = node.nodeValue, min = Math.max(7, Math.floor(raw.length * .22)), max = Math.max(min + 1, Math.floor(raw.length * .56));
      let start = min + (used * 13) % Math.max(1, max - min); const gap = raw.indexOf(' ', start); if (gap > start && gap < Math.min(raw.length - 8, start + 9)) start = gap + 1;
      const length = Math.max(5, Math.min(18, Math.floor(raw.length * (.13 + (used % 3) * .03)), raw.length - start - 5));
      const before = doc.createTextNode(raw.slice(0, start)), mask = h('span.tc-arc-redaction', { role: 'img', 'aria-label': 'F.H.C 삭제 구간', title: 'F.H.C 삭제 구간' }), after = doc.createTextNode(raw.slice(start + length));
      mask.style.setProperty('--arc-redaction-width', `${Math.max(5, Math.min(12, length))}em`); node.replaceWith(before, mask, after); textUndo.push(() => { before.replaceWith(node); mask.remove(); after.remove(); }); used++;
    });
    article.querySelectorAll('img').forEach(img => {
      const index = registerImage(img.getAttribute('src'), img.closest('figure')?.querySelector('figcaption')?.textContent || '', img.alt);
      img.tabIndex = 0; img.setAttribute('role', 'button'); img.setAttribute('aria-label', `${img.alt} · 증거 확대·대조`);
      life.on(img, 'click', () => openEvidence(index, img)); life.on(img, 'keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEvidence(index, img); } });
    });
    restoreVault = () => {
      textUndo.reverse().forEach(fn => fn()); attributes.forEach(([el, saved]) => { [...el.attributes].forEach(a => el.removeAttribute(a.name)); saved.forEach(([key, value]) => el.setAttribute(key, value)); });
      parent.insertBefore(article, next?.parentNode === parent ? next : null);
    };
    return wrapper;
  }

  /* ---------- Local operation records; the map and archive share the existing keys ---------- */
  function confirmation(label, action, scope = life) {
    let armed = false;
    const control = button(label, () => {
      if (armed) { armed = false; control.textContent = label; action(); return; }
      armed = true; control.textContent = `${label} · 다시 누르면 확인`;
      scope.later(() => { armed = false; control.textContent = label; }, 4200);
    }, {}, scope); return control;
  }
  function operationBranches(branchData) {
    const config = data.operation, shared = root.ProjectCurseOperationState, boundary = config.canonBoundary;
    const fresh = () => ({ schema: 1, operationId: config.operationId, visited: [], verdict: null, mapStep: 0, status: 'analysis', updatedAt: null });
    let state = { ...fresh(), ...readSaved(config.storageKey, {}) }, selected = '';
    function normalize() { state.visited = [...new Set((Array.isArray(state.visited) ? state.visited : []).filter(id => config.branchIds.includes(id)))]; if (!config.decisions[state.verdict]) state.verdict = null; }
    normalize();
    const shell = h('div.tc-arc-operation'), status = h('p.tc-code', { role: 'status' }), controls = h('div.tc-seg', { role: 'group', 'aria-label': '출처 상충 정보 경로' });
    const panels = h('div'), decisions = h('div.tc-arc-decisions'), report = h('section.tc-panel.tc-arc-local-report'), complete = h('p', { text: branchData.complete, hidden: true }), decisionStatus = h('p', { role: 'status' });
    function persist(reason) {
      if (reason === 'reset') { try { root.localStorage.removeItem(config.storageKey); } catch (_) { storageNote(false, shell); } }
      else { state.updatedAt = new Date().toISOString(); storageNote(writeSaved(config.storageKey, state), shell); }
      doc.dispatchEvent(new CustomEvent('projectcurse:operation-state-change', { detail: { reason, state: { ...state, visited: [...state.visited] } } }));
    }
    function refresh() {
      if (shared) state = { ...shared.get(), visited: [...shared.get().visited] };
      normalize(); const ready = config.branchIds.every(id => state.visited.includes(id)); complete.hidden = !ready;
      status.textContent = `${state.visited.length} / ${config.branchIds.length}개 출처 열람 · ${state.updatedAt ? new Date(state.updatedAt).toLocaleString('ko-KR') : '열람 시각 미등록'}`;
      controls.querySelectorAll('button').forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.branch === selected)); b.querySelector('small').textContent = state.visited.includes(b.dataset.branch) ? '열람 기록 있음' : '열람 전'; });
      panels.querySelectorAll('[data-branch-panel]').forEach(p => { p.hidden = p.dataset.branchPanel !== selected; });
      decisions.querySelectorAll('button').forEach(b => { b.disabled = !ready; b.setAttribute('aria-pressed', String(state.verdict === b.dataset.verdict)); });
      const decision = config.decisions[state.verdict]; report.hidden = !decision; report.replaceChildren();
      decisionStatus.textContent = decision ? `${decision.status}${data.copy.operationSaved}` : ready ? data.copy.operationReady : data.copy.operationPending;
      if (decision) report.append(h('p.tc-code', { text: `${decision.code} / LOCAL COMMAND VERDICT` }), h('h3', { text: decision.title }),
        kv([['회수 정보', `${state.visited.length} / ${config.branchIds.length}`], ['현재 작전 단계', `${state.mapStep + 1} / 6`], ['현장 판정', decision.status], ['중앙 기록', boundary.status], ['최종 갱신', state.updatedAt ? new Date(state.updatedAt).toLocaleString('ko-KR') : '기록 없음']]), h('p', { text: decision.summary }),
        kv([['현장 관측', decision.observed], ['지도 사본 반영', decision.immediate], ['승인 대기', decision.unresolved], ['중앙 기록 반영', data.copy.centralNoEffect], ['작전 영향', decision.consequence], ['후속 지침', decision.directive]]));
    }
    branchData.entries.forEach(entry => {
      const control = button(h('span', null, h('b', { text: entry.label }), h('small.tc-code')), () => {
        selected = entry.id; if (shared) shared.visitBranch(entry.id); else { if (!state.visited.includes(entry.id)) state.visited.push(entry.id); state.status = state.verdict ? (state.verdict === 'defer' ? 'deferred' : 'resolved') : state.visited.length === config.branchIds.length ? 'decision-ready' : 'analysis'; persist('branch'); } refresh();
      }, { dataset: { branch: entry.id }, 'aria-controls': `tc-arc-branch-${entry.id}` }); controls.append(control);
      panels.append(h('section.tc-panel.tc-arc-branch', { id: `tc-arc-branch-${entry.id}`, dataset: { branchPanel: entry.id }, hidden: true }, h('h3', { text: entry.label }), h('p.tc-code', { text: entry.status }), h('p', { text: entry.summary }), kv([['출처', entry.source], ['근거', entry.evidence], ['한계', entry.limit]]), h('p', { text: entry.reveal })));
    });
    Object.values(config.decisions).forEach(d => decisions.append(button(h('span', null, h('small.tc-code', { text: `${d.code} / LOCAL ONLY` }), h('b', { text: d.title }), h('span', { text: d.immediate })), () => { if (!config.branchIds.every(id => state.visited.includes(id))) return; if (shared) shared.chooseVerdict(d.id); else { state.verdict = d.id; state.mapStep = d.id === 'defer' ? 4 : 5; state.status = d.id === 'defer' ? 'deferred' : 'resolved'; persist('verdict'); } refresh(); }, { dataset: { verdict: d.id } })));
    shell.append(h('p.tc-code', { text: branchData.label }), status, controls, panels, complete,
      note('중앙 기록 승인 범위', boundary.scope), disclosure('확정된 사실·후대 승인 대기', [section('2030년에 확정된 사실', h('ul', null, boundary.fixedFacts.map(text => h('li', { text })))), section('후대 승인 대기', h('ul', null, boundary.pendingFacts.map(text => h('li', { text })))), h('p', { text: boundary.lineageGuard })], boundary.status),
      h('h3', { text: '현장 작전 사본 판정' }), decisionStatus, decisions, report,
      h('nav.tc-btnrow', null, link('작전지도에서 현재 결과 보기', 'map-room', 'op', config.operationId), confirmation('작전 진행 초기화', () => { selected = ''; if (shared) shared.reset(); else { state = fresh(); persist('reset'); } refresh(); })));
    life.on(doc, 'projectcurse:operation-state-change', e => { if (e.detail?.state) state = { ...e.detail.state, visited: [...e.detail.state.visited] }; refresh(); }); refresh(); return shell;
  }
  const verdictKey = 'pc_verdict_archive_state_v1';
  let verdictState = null;
  function scenarioState(id) {
    if (root.ProjectCursePilgrimageState?.get) return root.ProjectCursePilgrimageState.get(id);
    return readSaved('pc_pilgrimage_states_v2', {}).states?.[id] || (id === 'unlit-fortress' ? readSaved('pc_pilgrimage_state_v1', null) : null);
  }
  function loadVerdicts() {
    const owner = root.ProjectCurseVerdictArchiveState;
    if (owner?.capture) Object.keys(root.ProjectCursePilgrimageData?.scenarios || {}).forEach(id => owner.capture(id, { silent: true }));
    const saved = readSaved(verdictKey, {}); verdictState = { schema: 1, records: saved.records || {}, dismissed: saved.dismissed || {} };
    if (owner?.capture) return;
    let changed = false;
    (root.ProjectCurseVerdictArchiveData?.records || []).forEach(entry => {
      const current = scenarioState(entry.scenarioId);
      if (!current || current.status !== 'complete' || current.ending !== entry.endingId || verdictState.dismissed[entry.scenarioId] === `${current.ending}:${current.updatedAt || ''}`) return;
      const existing = verdictState.records[entry.id]; if (existing?.updatedAt === current.updatedAt) return;
      const now = new Date().toISOString(); verdictState.records[entry.id] = { id: entry.id, scenarioId: entry.scenarioId, endingId: current.ending, unlockedAt: existing?.unlockedAt || current.updatedAt || now, updatedAt: current.updatedAt || now, readAt: existing?.readAt || null, metrics: { ...current.metrics }, violations: current.violations || 0, choices: (current.choices || []).map(c => ({ ...c })) }; delete verdictState.dismissed[entry.scenarioId]; changed = true;
    }); if (changed) writeSaved(verdictKey, verdictState);
  }
  function saveVerdicts(reason, id) { const ok = writeSaved(verdictKey, verdictState); doc.dispatchEvent(new CustomEvent('projectcurse:verdict-archive-change', { detail: { reason, id } })); return ok; }
  function resolveVariant(base, state) {
    if (!base) return null;
    const chosen = new Set((state.choices || []).map(c => c.choice));
    const matches = when => !when || (!when.choice || chosen.has(when.choice)) && (!when.all || when.all.every(id => chosen.has(id))) && (!when.any || when.any.some(id => chosen.has(id))) && (!when.not || when.not.every(id => !chosen.has(id))) && Object.entries(when.metrics || {}).every(([key, range]) => { const value = state.metrics?.[key] ?? state[key] ?? 0; return (range.min == null || value >= range.min) && (range.max == null || value <= range.max); });
    const variant = (base.variants || []).find(v => matches(v.when)); if (!variant) return base;
    const choices = (variant.choices || base.choices)?.map(c => variant.choicePatches?.[c.id] ? { ...c, ...variant.choicePatches[c.id] } : c);
    const resolved = { ...base, ...variant, ...(choices ? { choices } : {}) }; delete resolved.when; delete resolved.variants; delete resolved.choicePatches; return resolved;
  }
  function verdictDocument(id) {
    const entry = root.ProjectCurseVerdictArchiveData?.records.find(r => r.id === id), snapshot = verdictState?.records[id];
    if (!entry || !snapshot) return null;
    const scenario = root.ProjectCursePilgrimageData?.scenarios[entry.scenarioId], ending = resolveVariant(scenario?.endings?.[entry.endingId], snapshot);
    if (!scenario || !ending || !Array.isArray(snapshot.choices)) return null;
    const result = data.verdictDocument({ ...entry, unread: !snapshot.readAt }, scenario, snapshot, ending, i => resolveVariant(scenario.stages[i], snapshot));
    if (!snapshot.readAt) { if (root.ProjectCurseVerdictArchiveState?.markRead) root.ProjectCurseVerdictArchiveState.markRead(id); else { snapshot.readAt = new Date().toISOString(); saveVerdicts('read', id); } } return result;
  }
  function verdictIndex() {
    const shell = h('section.tc-panel.tc-arc-verdicts'), list = h('div.tc-rows'), status = h('p.tc-code', { role: 'status' }); let listScope = lifetime(); life.dispose(() => listScope.end());
    const select = h('select#tc-arc-verdict-scenario', { 'aria-label': '현장 사본 범위' }, h('option', { value: 'all', text: '모든 현장' }), Object.entries(root.ProjectCursePilgrimageData?.scenarios || {}).map(([id, value]) => h('option', { value: id, text: value.title })));
    function render() {
      listScope.end(); listScope = lifetime(); const entries = (root.ProjectCurseVerdictArchiveData?.records || []).filter(r => select.value === 'all' || r.scenarioId === select.value);
      status.textContent = `${entries.filter(r => verdictState.records[r.id]).length} / ${entries.length}건 수신 · 현재 단말에 저장된 현장 판정`;
      list.replaceChildren(...entries.map(entry => { const saved = verdictState.records[entry.id]; return h('div.tc-arc-verdict-row', null, h('span.tc-code', { text: entry.code }),
        h('div', null, h('b', { text: saved ? entry.title : entry.lockedTitle }), h('p', { text: saved ? entry.summary : entry.requirement })), saved ? link(saved.readAt ? '사본 열람' : '미열람 사본', 'archive-entry', entry.id) : PC.tag('현장 사본 미수신', 'dim')); }));
    }
    life.on(select, 'change', render);
    const clear = confirmation('선택 범위의 사본 삭제', () => {
      const owner = root.ProjectCurseVerdictArchiveState;
      if (owner?.clearAll && owner?.clearScenario) { if (select.value === 'all') owner.clearAll(); else owner.clearScenario(select.value); loadVerdicts(); }
      else { Object.entries(verdictState.records).forEach(([id, saved]) => { if (select.value === 'all' || saved.scenarioId === select.value) delete verdictState.records[id]; }); Object.keys(root.ProjectCursePilgrimageData?.scenarios || {}).forEach(id => { if (select.value !== 'all' && select.value !== id) return; const s = scenarioState(id); if (s?.status === 'complete') verdictState.dismissed[id] = `${s.ending}:${s.updatedAt || ''}`; }); storageNote(saveVerdicts('clear', null), shell); } render();
    });
    shell.append(h('h2', { text: '현장 판정 사본' }), h('p', { text: data.copy.verdictIntro }), status, select, list, h('p', { text: data.copy.verdictManage }), h('div.tc-btnrow', null, button('읽음 표시 초기화', () => { if (root.ProjectCurseVerdictArchiveState?.resetRead) { root.ProjectCurseVerdictArchiveState.resetRead(); loadVerdicts(); } else { Object.values(verdictState.records).forEach(r => { r.readAt = null; }); storageNote(saveVerdicts('reset-read', null), shell); } render(); }), clear));
    life.on(doc, 'projectcurse:pilgrimage-state-change', () => { loadVerdicts(); render(); }); render(); return shell;
  }

  /* ---------- The old storyboard and damaged media, inside the evidence layer ---------- */
  function cinemaViewer(id) {
    const config = registry().get(id), pages = registry().pages(id), cues = root.ProjectCurseLegacyCinematicSources.cues;
    if (!pages.length) return PC.missing('VIDEO SCRIPT MISSING', id, '이 영상의 기록면이 없습니다.');
    const attachments = new Map();
    pages.forEach(p => { [p.image, ...(p.people || []).map(person => person.image)].filter(Boolean).forEach(src => { if (!attachments.has(src)) attachments.set(src, registerImage(src, p.caption || p.photoCaption || p.frame, p.title || p.code)); }); });
    const shell = h('section.tc-arc-cinema', { 'aria-label': '기록 영상 뷰어' }), stage = h('div.tc-evidence.tc-arc-cinema-stage', { tabindex: '0', 'aria-label': '영상 기록면 · 좌우 화살표 이동, P 재생·정지, R 처음' });
    const status = h('p.tc-code', { role: 'status', 'aria-live': 'polite' }), audioState = h('p.tc-arc-media-status', { role: 'status' });
    const chooser = h('select#tc-arc-scene', { 'aria-label': '영상 기록면 선택' }, pages.map((p, i) => h('option', { value: String(i), text: `${String(i + 1).padStart(2, '0')} / ${p.code}` })));
    let index = 0, playing = false, sound = Boolean(root.PCAudio?.isOn?.()), introSeen = false, altered = false, inBridge = false, frameLife = lifetime();
    const bgm = h('audio', { src: config.bgm, preload: 'none', loop: true }); bgm.volume = Math.min(.25, config.bgmVolume || .2); bgm.muted = !sound;
    function releaseMedia(media) { media.pause(); media.removeAttribute('src'); media.load(); }
    life.dispose(() => { frameLife.end(); releaseMedia(bgm); });
    function safePlay(media) { const request = media.play(); if (request?.catch) request.catch(error => { if (!life?.live || !media.isConnected || error.name === 'AbortError') return; if (media.tagName === 'VIDEO' && !media.muted && error.name === 'NotAllowedError') { media.muted = true; safePlay(media); audioState.textContent = '손상 영상 구간을 음소거로 재시도합니다.'; } else audioState.textContent = '재생 요청을 완료하지 못했습니다. 재생 버튼으로 다시 요청하거나 기록면을 직접 열람할 수 있습니다.'; }); }
    function stopFrame() { frameLife.end(); frameLife = lifetime(); }
    function cue(path, loop = false) {
      if (!path || !sound || !playing || motion.matches) return;
      const media = h('audio', { src: path, preload: 'none', loop }); media.volume = .25; shell.append(media);
      frameLife.on(media, 'error', () => { audioState.textContent = '일부 첨부 음원을 불러오지 못했습니다.'; });
      frameLife.dispose(() => { releaseMedia(media); media.remove(); }); safePlay(media); return media;
    }
    function sceneBody(page, scope, staticText = false) {
      const panel = h('div.tc-arc-scene-body', { dataset: { layout: page.layout || 'briefText' } });
      if (page.title && !page.hideTitle && !page.hideIdentity) panel.append(h('h3', { text: page.title }));
      if (page.subtitle && !page.hideIdentity) panel.append(h('p.tc-arc-scene-subtitle', { text: page.subtitle }));
      if (page.logTime || page.logTitle) panel.append(h('p.tc-arc-time', { text: [page.logTime, page.logTitle].filter(Boolean).join(' / ') }));
      function picture(src, alt, caption) {
        const n = attachments.get(src), fig = h('figure.tc-arc-cinema-figure', null, imageNode(src, alt, scope));
        if (caption) fig.append(h('figcaption', { text: caption }));
        fig.append(button('증거 확대·대조', e => openEvidence(n, e.currentTarget), { dataset: { arcEvidence: String(n) } }, scope)); return fig;
      }
      if (!staticText && page.people) panel.append(h('div.tc-arc-people', null, page.people.map(person => picture(person.image, person.name, `${person.name} / ${person.role}`))));
      if (staticText && page.people) panel.append(kv(page.people.map(p => [p.name, p.role])));
      if (page.image && !staticText) panel.append(picture(page.image, page.hideIdentity ? page.code : page.title || page.code, page.caption || page.photoCaption));
      if (page.imageCode) panel.append(h('p.tc-code', { text: page.imageCode }));
      if (staticText && (page.caption || page.photoCaption)) panel.append(h('p', { text: page.caption || page.photoCaption }));
      if (page.credit) panel.append(h('p.tc-arc-credit', { text: page.credit }));
      const words = h('div.tc-arc-scene-lines');
      (page.lines || []).forEach((text, i) => words.append(h('p', { text, dataset: { cinemaLine: String(i) }, class: /^〔/.test(text) ? 'tc-arc-radio-line' : '' })));
      (page.report || []).forEach(text => words.append(h('p', { text })));
      if (page.redAlert) words.append(h('p.tc-arc-alert', { text: page.redAlert })); panel.append(words);
      if (staticText && page.lineMutation) panel.append(note('동일 기록면의 보정 후 문장', page.lineMutation.to));
      if (page.postFlashLines?.length) panel.append(disclosure('간섭 구간 전문', page.postFlashLines.map(text => h('p', { text })), 'RECORDED INTERFERENCE', staticText));
      return panel;
    }
    const toggle = button('영상 재생', () => { if (playing) pause(); else start(); });
    const previous = button('← 이전 기록면', () => step(-1));
    const next = button('다음 기록면 →', advance);
    const soundLabel = () => (sound ? '음향 켜짐 · 낮은 볼륨' : '음향 꺼짐');
    const soundControl = button(soundLabel(), () => { sound = !sound; bgm.muted = !sound; soundControl.textContent = soundLabel(); soundControl.setAttribute('aria-pressed', String(sound)); if (sound && playing && !motion.matches) safePlay(bgm); else bgm.pause(); if (!inBridge) render(); }); soundControl.setAttribute('aria-pressed', String(sound));
    function sync() {
      chooser.value = String(index); previous.disabled = index <= 0;
      next.textContent = index === pages.length - 1 ? '기록 색인으로 →' : '다음 기록면 →';
      toggle.disabled = motion.matches; toggle.textContent = motion.matches ? '모션 감소 · 수동 열람' : playing ? '일시정지' : '영상 재생';
      soundControl.disabled = motion.matches; shell.classList.toggle('is-playing', playing && !motion.matches);
      status.textContent = `${String(index + 1).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')} · ${inBridge ? '손상 매체 재생' : playing ? '자동 경과' : '수동 열람'} · ${pages[index].frame || pages[index].code}`;
    }
    function hold(page) {
      if (page.hold) return Number(page.hold);
      if (id === 'Immortality_860201') return ({ photoLarge: 6200, peoplePair: 5800, redLog: 4700 })[page.layout] || (page.image ? 5900 : 5000);
      return ({ classificationChart: 4800, warningNotice: 5400, evidenceCenter: 5900, victimSlide: 6800, twoColumn: 6500, warningCard: 6200 })[page.layout] || (page.group === 'system' ? 3600 : 5200);
    }
    function render() {
      stopFrame(); inBridge = false; bgm.volume = Math.min(.25, config.bgmVolume || .2); const source = pages[index], page = altered && source.mutation ? { ...source, ...source.mutation } : source;
      const content = sceneBody(page, frameLife), footer = h('div.tc-btnrow');
      if (source.mutation) footer.append(button(altered ? '변조 전 기록면 대조' : '변조된 기록면 대조', () => { altered = !altered; render(); }, { 'aria-pressed': String(altered) }, frameLife));
      stage.replaceChildren(h('header.tc-arc-cinema-stamp', null, h('span.tc-code', { text: page.code }), h('span.tc-code', { text: config.sourceLabel })), content, footer);
      if (playing && !motion.matches) {
        const lineDelay = Number(page.lineDelay || 900), first = Number(page.firstLineDelay || 0), last = first + Math.max(0, (page.lines?.length || 0) - 1) * lineDelay;
        content.querySelectorAll('[data-cinema-line]').forEach((line, i) => { line.classList.add('tc-arc-line-pending'); frameLife.later(() => { line.classList.remove('tc-arc-line-pending'); if (/^〔/.test(line.textContent)) cue(cues.dialog); }, first + i * lineDelay); });
        if (page.photoSfx && !page.specialSequence) cue(id === 'Sakuma_Tape_991028' ? cues.projector : cues.photo);
        if (page.reportAudio) cue(cues.report);
        if (page.rangeAudio === 'latePursuit') cue(cues.pursuit, true);
        if (page.postFlashLines?.length) frameLife.later(() => { content.querySelector('details').open = true; cue(cues.intrusion); }, last + Number(page.postFlashDelay || 900));
        if (page.lineMutation) frameLife.later(() => { const line = content.querySelector(`[data-cinema-line="${page.lineMutation.index}"]`); if (line) line.textContent = page.lineMutation.to; }, first + page.lineMutation.index * lineDelay + Number(page.lineMutation.delay || 720));
        if (page.specialSequence === 'sakumaBirthday') {
          let projectorDone = false, birthdayDone = false; bgm.volume = .025;
          const nextStatus = () => { bgm.volume = Math.min(.25, config.bgmVolume || .2); step(1); };
          const playBridge = () => { if (birthdayDone) return; birthdayDone = true; bridge(config.birthdayVideo, 2300, nextStatus); };
          const playBirthday = () => { if (projectorDone) return; projectorDone = true; const track = cue(config.birthdayAudio); if (track) frameLife.on(track, 'ended', playBridge, { once: true }); frameLife.later(playBridge, 6800); };
          const projector = cue(cues.projector); if (projector) frameLife.on(projector, 'ended', playBirthday, { once: true }); frameLife.later(playBirthday, 2300);
        }
        else frameLife.later(() => { if (source.mutation && !altered) { altered = true; render(); } else if (index < pages.length - 1) step(1); else pause(); }, last + hold(page));
      }
      sync();
    }
    function bridge(path, timeout, done) {
      if (!path || motion.matches || !playing) { done(); return; }
      stopFrame(); inBridge = true; const video = h('video', { src: path, playsinline: true, preload: 'metadata', 'aria-label': '기록 매체의 손상 구간' }); video.muted = !sound; video.volume = .2;
      let finished = false;
      const finish = () => { if (finished || !life.live) return; finished = true; done(); };
      frameLife.on(video, 'ended', finish); frameLife.on(video, 'error', () => { audioState.textContent = '손상 매체를 읽지 못했습니다. 기록면으로 진행합니다.'; finish(); });
      frameLife.dispose(() => releaseMedia(video)); frameLife.later(finish, timeout + 350);
      stage.replaceChildren(h('p.tc-code', { text: config.sourceLabel }), video, button('손상 구간 건너뛰기', finish, {}, frameLife)); sync(); safePlay(video);
    }
    function pause() { playing = false; bgm.pause(); render(); }
    function start() {
      if (motion.matches) return;
      playing = true; audioState.textContent = ''; if (sound) safePlay(bgm);
      if (!introSeen && index === 0) { introSeen = true; bridge(config.introVideo, config.introFallback, render); } else render();
    }
    function step(direction) {
      if (direction > 0 && index === pages.length - 1) { PC.go('archive-entry'); return; }
      const old = pages[index]; index = Math.max(0, Math.min(pages.length - 1, index + direction)); altered = false;
      if (playing && id !== 'Immortality_860201' && old.group !== pages[index].group && direction > 0) bridge(config.transitionVideo, config.transitionFallback, render); else { render(); if (id !== 'Immortality_860201') cue(cues.step); }
    }
    function advance() {
      if (inBridge) return;
      const pending = stage.querySelector('.tc-arc-line-pending');
      if (pending) { pending.classList.remove('tc-arc-line-pending'); return; }
      if (pages[index].mutation && !altered) { altered = true; render(); return; }
      step(1);
    }
    life.on(chooser, 'change', () => { index = Number(chooser.value); altered = false; introSeen = true; pause(); });
    life.on(stage, 'keydown', e => { if (e.target !== stage) return; if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') advance(); else if (e.key.toLowerCase() === 'p') { if (playing) pause(); else start(); } else if (e.key.toLowerCase() === 'r') { index = 0; introSeen = false; altered = false; pause(); } else return; e.preventDefault(); });
    life.on(stage, 'click', e => { if (!e.target.closest('button,a,select,input,summary,details')) advance(); });
    life.on(motion, 'change', () => { if (motion.matches) pause(); sync(); });
    life.on(doc, 'visibilitychange', () => { if (doc.hidden) pause(); });
    const transcript = disclosure('영상 대본 전체 열람', pages.map((page, i) => disclosure(`${String(i + 1).padStart(2, '0')} / ${page.code}`, [sceneBody(page, life, true), page.mutation ? disclosure('같은 기록면의 변조본', sceneBody({ ...page, ...page.mutation }, life, true), 'ALTERED RECORD') : null], page.frame)), 'FULL TRANSCRIPT');
    life.on(transcript, 'toggle', () => { if (transcript.open && playing) pause(); });
    shell.append(h('div.tc-arc-player-heading', null, h('h2', { text: '기록 영상' }), chooser), h('div.tc-arc-player-controls', null, previous, toggle, next, button('처음부터', () => { index = 0; altered = false; introSeen = false; pause(); }), soundControl), status, stage, audioState, transcript, bgm);
    player = { pause() { if (playing || inBridge) pause(); } }; render(); return shell;
  }

  /* ---------- Read-only provenance audit ---------- */
  let auditHost, auditLife = null, auditDetailLife = null, auditListLife = null;
  const auditKey = 'project_curse_media_clearance_v1'; let auditState;
  function auditHide() { auditDetailLife?.end(); auditListLife?.end(); auditLife?.end(); auditDetailLife = auditListLife = auditLife = null; }
  function renderAudit() {
    auditHide(); auditLife = lifetime(); const scope = auditLife, media = root.ProjectCurseMediaProvenance;
    if (!media) { auditHost.replaceChildren(PC.missing('MEDIA INDEX MISSING', '', '매체 검수 데이터가 없습니다.')); return; }
    let saved = {}; try { saved = readSaved(auditKey, {}, root.sessionStorage); } catch (_) { /* unavailable session storage */ }
    auditState = { scope: 'priority', release: 'all', kind: 'all', query: '', selected: media.priorityQueue?.[0]?.path || '', ...saved };
    if (!['priority', 'all', 'reference'].includes(auditState.scope)) auditState.scope = 'priority';
    if (!['all', 'review', 'managed'].includes(auditState.release)) auditState.release = 'all';
    if (!['all', 'image', 'audio', 'video'].includes(auditState.kind)) auditState.kind = 'all';
    auditState.query = typeof auditState.query === 'string' ? auditState.query : '';
    const wrapper = h('div.tc-arc.tc-arc-audit'), status = h('p.tc-code', { role: 'status' }), list = h('div.tc-arc-audit-list', { role: 'group', 'aria-label': '매체 검수 결과' }), detail = h('section.tc-panel.tc-arc-audit-detail', { 'aria-label': '선택 매체 상세' });
    const input = h('input#tc-arc-media-search', { type: 'search', value: auditState.query, placeholder: '경로 · 출처 · 허가 상태 · 사용 위치' });
    const controls = h('div.tc-panel.tc-arc-tools', null, h('div.tc-arc-toolbar', null, h('label.tc-arc-search', { for: input.id }, h('span.tc-label', { text: '매체 검색' }), input), link('기록 색인 ›', 'archive-entry')));
    let matches = [];
    const groups = [];
    function filterGroup(label, key, options) {
      const group = h('div.tc-seg', { role: 'group', 'aria-label': label });
      options.forEach(([value, text]) => group.append(button(text, () => { auditState[key] = value; update(); }, { dataset: { value } }, scope)));
      groups.push([group, key]); return group;
    }
    controls.append(filterGroup('검수 범위', 'scope', [['priority', '우선 검수'], ['all', '전체 자산'], ['reference', '참고 전용']]),
      filterGroup('허가 상태', 'release', [['all', '모든 상태'], ['review', '확인 필요'], ['managed', '프로젝트 관리']]),
      filterGroup('매체 형식', 'kind', [['all', '모든 형식'], ['image', '이미지'], ['audio', '음원'], ['video', '영상']]), status);
    function persist() { try { writeSaved(auditKey, auditState, root.sessionStorage); } catch (_) { /* no persistence */ } }
    function showDetail() {
      auditDetailLife?.end(); auditDetailLife = lifetime();
      list.querySelectorAll('[data-path]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.path === auditState.selected)));
      if (auditState.scope === 'reference') { detail.replaceChildren(note('REFERENCE ONLY', '참고 전용 자료의 편입 제한은 각 항목에 표시된 기준을 따릅니다.')); return; }
      const asset = matches.find(a => a.path === auditState.selected);
      if (!asset) { detail.replaceChildren(PC.missing('MEDIA NOT SELECTED', auditState.selected || '', '목록에서 열람할 자산을 선택하십시오.')); return; }
      detail.replaceChildren(h('p.tc-code', { text: asset.kind.toUpperCase() }), h('h2', { text: asset.path.split('/').at(-1), tabindex: '-1' }),
        kv([['원본 경로', asset.path], ['공개 상태', asset.release], ['출처 판정', asset.provenance], ['출처', asset.source], ['취급 기준', asset.handling], ['근거 상태', data.copy.mediaEvidenceState[asset.release] || '미등록'], ['파일 크기', `${Number(asset.bytes || 0).toLocaleString('ko-KR')} bytes`], ['SHA-256', asset.sha256 || '미등록'], ['우선순위', asset.rank ? `${asset.rank} / ${asset.priorityReason}` : '우선 검수 목록 외'], ['다음 조치', asset.priorityReason || asset.handling], ['보호 범위', asset.protectedScope ? '보호 기록에 연결됨' : '별도 보호 범위 없음'], ['파생 원본', asset.derivedFrom || '파생 원본 미등록']]),
        section('사용 위치', h('ul.tc-arc-paths', null, (asset.usedBy || []).map(text => h('li', { text })))), h('p.tc-code', { text: '미디어 미리보기·자동 재생 없음' }));
    }
    function update() {
      auditListLife?.end(); auditListLife = lifetime(); const ls = auditListLife;
      groups.forEach(([group, key]) => group.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.value === auditState[key]))));
      if (auditState.scope === 'reference') {
        matches = []; list.replaceChildren(...(media.referenceOnly || []).map(a => h('section.tc-panel.tc-arc-reference', null, h('h2', { text: a.name }), h('p', { text: a.role }), h('p.tc-code', { text: a.rule })))); status.textContent = `${media.referenceOnly.length}개 참고 자료 · 사이트 매체와 별도 관리`; showDetail(); persist(); return;
      }
      const source = auditState.scope === 'priority' ? media.priorityQueue || [] : media.assets;
      const q = auditState.query.trim().toLocaleLowerCase('ko');
      matches = source.map(a => ({ ...media.assets.find(b => b.path === a.path), ...a, ...media.priorityQueue?.find(b => b.path === a.path) })).filter(a => (auditState.kind === 'all' || a.kind === auditState.kind) && (auditState.release === 'all' || (auditState.release === 'review') === /^(SOURCE|LICENSE)_REVIEW$/.test(a.release)) && (!q || [a.path, a.kind, a.release, a.provenance, a.source, a.handling, a.priorityReason, a.derivedFrom, ...(a.usedBy || [])].join(' ').toLocaleLowerCase('ko').includes(q)));
      status.textContent = `${matches.length} / ${source.length}개 매체 · 출처·허가 검수 목록`;
      // Retain an explicit missing selection. Never substitute a different requested asset.
      list.replaceChildren(...matches.map((a, i) => {
        const b = button(h('span', null, h('small.tc-code', { text: `${a.kind.toUpperCase()} / ${a.release}` }), h('b', { text: a.path.split('/').at(-1) }), h('span', { text: a.source })), () => { auditState.selected = a.path; showDetail(); persist(); }, { class: 'tc-arc-media-row', dataset: { path: a.path } }, ls);
        ls.on(b, 'keydown', e => { if (!['ArrowUp', 'ArrowDown'].includes(e.key)) return; e.preventDefault(); const next = Math.max(0, Math.min(matches.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1))); auditState.selected = matches[next].path; showDetail(); persist(); list.querySelectorAll('button')[next].focus(); }); return b;
      }));
      if (!matches.length) list.append(PC.missing('NO MATCHING MEDIA', '', '조건에 맞는 매체가 없습니다.'), button('검색·필터 초기화', () => { auditState.query = ''; auditState.kind = auditState.release = 'all'; input.value = ''; update(); input.focus(); }, {}, ls));
      showDetail(); persist();
    }
    scope.on(input, 'input', () => { auditState.query = input.value; update(); });
    scope.on(wrapper, 'keydown', e => { if (e.key === 'Escape') { auditState.query = ''; input.value = ''; update(); input.focus(); } });
    wrapper.append(PC.screenHead('media-audit', { title: '매체 검수', code: 'SOURCE / RELEASE REVIEW', desc: data.copy.mediaIntro, meta: [['ASSETS', String(media.assets.length)], ['PRIORITY', String(media.priorityQueue.length)], ['REFERENCE', String(media.referenceOnly.length)]] }),
      kv([['등록 자산', String(media.stats.registered)], ['프로젝트 관리', String(media.stats.managed)], ['출처·권리 검토', String(media.stats.review)], ['최우선 확인', String(media.stats.priority)], ['참고 자료 노출', String(media.stats.referenceExposure)]]),
      disclosure('감사 판정 경계', kv(data.copy.mediaBoundary), 'RELEASE CONTROL'), controls, h('div.tc-arc-audit-layout', null, list, detail), note(`REFERENCE ZIP INGESTION / ${media.stats.referenceExposure === 0 ? 'BLOCKED / 0 EXPOSED' : 'BOUNDARY BREACH'}`, data.copy.mediaFooter)); auditHost.replaceChildren(wrapper); PC.setTitle('매체 검수'); update();
  }

  function clearArchive() {
    closeEvidence(false); life?.end(); restoreVault?.(); restoreVault = null; life = null; player = null; images = []; imageDialog = null; imageTrigger = null; activeId = '';
  }
  function showArchive(parts, app, info) {
    clearArchive(); life = lifetime(); activeId = parts[0] || ''; view = h('div.tc-arc'); host.replaceChildren(view); PC.setTitle('기록보관소'); loadVerdicts();
    if (parts.length > 1) { view.append(PC.missing('UNKNOWN RECORD ADDRESS', parts.join('/'), '기록 주소의 세부 경로를 찾을 수 없습니다.'), link('기록 색인', 'archive-entry')); return; }
    if (!activeId) {
      renderIndex();
      if (info?.reason === 'pop') life.frame(() => { const row = [...view.querySelectorAll('[data-arc-record]')].find(el => el.dataset.arcRecord === indexState.focus); row?.focus({ preventScroll: true }); root.scrollTo(0, indexState.scroll); });
    } else {
      const record = records().find(r => r.id === activeId), locked = [...doc.querySelectorAll('#tc-vault > article')].find(el => el.dataset.record === activeId);
      const item = Object.hasOwn(documents(), activeId) ? documents()[activeId] : verdictDocument(activeId);
      if (!record && !item && !locked) { view.append(PC.missing('RECORD MISSING', activeId, '이 주소에 해당하는 기록이나 수신된 현장 사본이 없습니다.'), link('기록 색인', 'archive-entry')); return; }
      PC.setTitle(record?.title || item?.title || locked?.querySelector('.doc-title')?.textContent || activeId);
      view.append(fileCover(activeId, record, item, locked));
      const cinema = registry()?.get(activeId) ? cinemaViewer(activeId) : null;
      const body = locked ? protectedBody(locked) : item ? documentBody(item) : PC.missing('RECORD BODY MISSING', activeId, '색인은 있으나 본문이 등록되지 않았습니다.');
      if (record?.cover && !images.some(image => image.path === evidence().normalize(record.cover))) registerImage(record.cover, record.title, record.title);
      view.append(evidenceIndex() || h('p.tc-code', { text: '시각 첨부 미등록' }));
      if (cinema) view.append(cinema);
      view.append(body, h('nav.tc-btnrow.tc-arc-file-end', null, backLink(), button('표지로', () => focusAt(view.querySelector('h1')))));
    }
    life.on(doc, 'projectcurse:pilgrimage-state-change', e => { if (e.detail?.reason === 'reset') { delete verdictState.dismissed[e.detail.scenarioId]; saveVerdicts('reset-dismissal', null); } loadVerdicts(); });
  }
  PC.screen({ id: 'archive-entry', mount(el) { host = el; }, show: showArchive, hide: clearArchive });
  PC.screen({ id: 'media-audit', mount(el) { auditHost = el; }, show: renderAudit, hide: auditHide });
})(window);
