import vm from 'node:vm';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { applyCanonRenames, renamedValue } from '../lib/canon-renames.mjs';

// 옛 화면의 실제 대본과 대조한다. 승인된 화면 안내만 지정된 위치에서 새 문구로 대조한다.
// 2026-09-25 사용자 승인 정사 이름 변경(tools/lib/canon-renames.mjs)은 옛 원문에 먼저 적용한 뒤 글자 그대로 비교한다.
export default function ({ add, read, context, app, archiveIds, opIds, historyIds }) {
  const source = read('assets/app/js/screens/archive.js');
  const css = read('assets/app/css/screens/archive.css');
  new vm.Script(source, { filename: 'archive.js' });
  add('two-screen-registration', ['archive-entry', 'media-audit'].every(id => source.includes(`PC.screen({ id: '${id}'`)));
  add('safe-dom-and-disposal', !/innerHTML|outerHTML\s*=|insertAdjacentHTML/.test(source) && ['AbortController', 'restoreVault?.()', 'releaseMedia', 'observer.disconnect()', 'auditHide()'].every(s => source.includes(s)));
  add('motion-playback-and-sound-preserved', source.includes("life.on(doc, 'pc:fx', syncFx)") && source.includes("life.on(motion, 'change', syncFx)") && !source.includes('toggle.disabled = motion.matches') && source.includes('영상 대본 전체 읽기') && css.includes('html[data-fx="reduced"] .tc-arc') && !css.includes('@media (prefers-reduced-motion: reduce)'));
  // html의 효과·밀도 속성은 읽되 반드시 기록보관소 아래에만 적용해야 한다.
  const scopedCss = css.replace(/html\[data-fx="reduced"\]\s+(?=\.tc-arc)/g, '').replace(/html:not\(\[data-density="full"\]\)\s+(?=\.tc-arc)/g, '');
  add('styles-scoped', !/(?:^|\})\s*(?:body|html|:root|\.record-page|\.page-tab|\.tc-btn|\.tc-row)\b/m.test(scopedCss));
  add('immersive-accessible-controls', ['dialog.showModal()', 'dialog.close()', 'aria-haspopup', "event.key === 'Tab'", "event.key === 'Escape'", 'trigger.focus', "classList.add('tc-immersive')", "classList.remove('tc-immersive')", 'pc:fx'].every(token => source.includes(token)));
  add('brief-labels-and-evidence-hooks', ['tc-full-only', 'tc-evidence-media', "tcAnomaly: 'text'", 'PC.threat?.(threat)', 'VISUAL SIGNAL / ACQUISITION REQUESTED'].every(token => source.includes(token)));
  add('bounded-mount-and-decode', source.includes('scope.later(finish, 400)') && source.includes("scope.on(doc, 'keydown', finish") && source.includes('mounting?.end()') && source.includes("view.classList.remove('tc-arc-decoding'), 600") && css.includes('tc-arc-acquisition::after'));
  const migrated = context.ProjectCurseArchiveViewerData;
  const oldChapters = vm.runInNewContext(read('tools/fixtures/legacy-app/assets/js/pages/archive-consolidation.js').match(/const storyChapters\s*=\s*(\[[\s\S]*?\n\s*\]);/)[1]);
  add('chapter-prose-verbatim', JSON.stringify(renamedValue(oldChapters)) === JSON.stringify(migrated.chapters));
  const oldPages = vm.runInNewContext(read('tools/fixtures/legacy-app/assets/js/core/record-cinematic-runtime.js').match(/    const pages = (\[[\s\S]*?\n\]);/)[1]);
  // 마지막 쪽은 영상 속 대사가 아니라 화면 닫기 안내다. 나머지 대사·장면·순서는 그대로 대조한다.
  const returnPage = oldPages.at(-1);
  const originalReturn = returnPage.group === 'return' && returnPage.title === '기록보관소 복귀' && JSON.stringify(returnPage.lines) === JSON.stringify(['손상 영상 첨부 확인이 끝났습니다.', '화면 선택 시 기록보관소 목록으로 복귀합니다.']);
  const expectedPages = oldPages.map(page => page === returnPage ? { ...page, title: '기록으로 돌아가기', lines: ['손상된 첨부 영상 확인이 끝났습니다.', '화면을 누르면 보고 있던 기록으로 돌아갑니다.'] } : page);
  add('cults-storyboard-preserved-with-approved-return-copy', originalReturn && JSON.stringify(expectedPages) === JSON.stringify(context.ProjectCurseLegacyCinematicSources.cults));
  const oldCopy = applyCanonRenames(read('tools/fixtures/legacy-app/assets/js/main.js') + read('tools/fixtures/legacy-app/assets/js/pages/archive-document.js') + read('tools/fixtures/legacy-app/assets/js/pages/archive-consolidation.js') + read('tools/fixtures/legacy-app/assets/js/pages/media-clearance.js')).replace(/<\/?strong>/g, '');
  const copyStrings = value => typeof value === 'string' ? [value] : Object.values(value).flatMap(copyStrings);
  const approvedCopy = {
    verdictIntro: ['직접 확인한 결과만 열린다. 최종 판정 순간의 선택과 측정값은 원본 기록과 분리한 판정 사본으로 보존된다.', '직접 확인한 결과만 열린다. 최종 판정 순간의 선택과 측정값은 원본 기록과 분리한 판정 기록으로 보존된다.'],
    operationReady: ['모든 정보가 복구됐다. 중앙 기록을 바꾸지 않는 현장 판정을 선택하라.', '모든 정보가 복구됐습니다. 중앙 기록을 바꾸지 않는 현장 판정을 고르십시오.'],
    operationSaved: [' / 현재 단말 사본에만 저장됨 · 중앙 기록 변화 없음.', ' / 현재 단말 기록에만 저장됨 · 중앙 기록 변화 없음.'],
    sourceIntro: ['현재 문서에 사용된 이미지의 출처 등급과 원본 대조 가능 여부를 표시한다. 복원 추정본은 원본 기록을 대신하지 않는다.', '현재 문서에 사용된 이미지의 출처 등급을 표시하고, 원본과 맞춰 볼 수 있는지 알려 준다. 복원 추정본은 원본 기록을 대신하지 않는다.'],
    comparisonNote: ['비교 경계를 움직여 두 사본의 크롭·색상·정보 손실을 직접 대조할 수 있다.', '비교 경계를 움직여 두 그림의 잘린 부분·색상·빠진 정보를 직접 맞춰 볼 수 있다.']
  };
  add('viewer-copy-approved-wording', Object.entries(approvedCopy).every(([key, [before, after]]) => oldCopy.includes(before) && migrated.copy[key] === after) && Object.entries(migrated.copy).every(([key, value]) => Object.hasOwn(approvedCopy, key) ? value === approvedCopy[key][1] : copyStrings(value).every(text => oldCopy.includes(text))));

  const storage = new Map(), events = [];
  const test = { console, localStorage: { getItem: k => storage.get(k) || null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) }, document: { dispatchEvent: e => events.push(e), addEventListener() {} }, CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } } };
  test.window = test; vm.createContext(test);
  for (const m of app.matchAll(/<script src="(assets\/js\/data\/[^"?]+)/g)) vm.runInContext(read(m[1]), test);
  vm.runInContext(read('tools/fixtures/legacy-app/assets/js/core/operation-state.js'), test);
  const operation = test.ProjectCurseOperationState;
  add('operation-boundary-verbatim', ['operationId', 'storageKey', 'branchIds', 'canonBoundary', 'decisions'].every(key => JSON.stringify(renamedValue(operation[key] ?? null)) === JSON.stringify(migrated.operation[key] ?? null)));
  ['record-cinematic-registry.js'].forEach(file => vm.runInContext(read(`assets/app/js/cinematic/${file}`), test));
  ['cults', 'immortality', 'ferals', 'sakuma'].forEach(name => vm.runInContext(read(`assets/app/js/cinematic/cinematic-${name}.js`), test));
  const registry = test.ProjectCurseCinematicRegistry;
  const expected = ['Cults_871104', 'Immortality_860201', 'Ferals_860722', 'Sakuma_Tape_991028'];
  // 옛 verify-package의 cinematic-registry-four-records(등록 순서 포함)를 여기서 이어받는다.
  add('four-independent-cinematics', expected.every(id => registry.pages(id).length > 0) && registry.ids().length === 4 && registry.ids().join('|') === expected.join('|'), expected.map(id => `${id}:${registry.pages(id).length}`).join(', '));
  add('all-records-openable', archiveIds.size === 17 && [...archiveIds].every(id => test.ProjectCurseArchiveDocuments.documents[id] || app.includes(`data-record="${id}"`)));
  add('reading-groups-complete', new Set(migrated.chapters.flatMap(c => c.ids)).size === 15 && migrated.chapters.every(c => c.ids.every(id => archiveIds.has(id))));
  const brokenLinks = (context.ProjectCurseIncidentNetwork?.incidentList || []).filter(i => i.records?.some(id => archiveIds.has(id))).flatMap(i => [i.operation && !opIds.has(i.operation) ? i.operation : '', i.history && !historyIds.has(i.history) ? i.history : ''].filter(Boolean));
  add('related-operation-history-targets', !brokenLinks.length, brokenLinks.join(', '));
  const paths = new Set();
  function collect(value) { if (typeof value === 'string' && /^(?:\.\.\/)*assets\//.test(value)) paths.add(value.replace(/^(?:\.\.\/)+/, '')); else if (Array.isArray(value)) value.forEach(collect); else if (value && typeof value === 'object') Object.values(value).forEach(collect); }
  expected.forEach(id => { collect(registry.get(id)); collect(registry.pages(id)); }); collect(test.ProjectCurseLegacyCinematicSources.cues); collect(test.ProjectCurseLegacyCinematicSources.media); collect(test.ProjectCurseArchiveDocuments.documents); collect(test.ProjectCurseArchive.publicRecords);
  const root = fileURLToPath(new URL('../../', import.meta.url)), missing = [...paths].filter(p => !existsSync(root + p));
  add('all-document-cinematic-media-exist', !missing.length, missing.join(', '));
  const moduleStart = app.indexOf('<!-- slot:archive-modules'), screenStart = app.indexOf('assets/app/js/screens/archive.js');
  add('registry-before-screen-no-old-runtime', app.indexOf('assets/app/js/cinematic/record-cinematic-registry.js') > moduleStart && app.indexOf('assets/app/js/cinematic/cinematic-sakuma.js') < screenStart && !app.includes('assets/js/core/record-cinematic-runtime.js'));
  add('restored-record-volumes', expected.every(id => { const cfg = registry.get(id); return cfg.introVolume === .68 && cfg.bgmVolume >= .54 && cfg.bgmVolume <= .78 && cfg.transitionVolume === .78; }) && source.includes('radio.volume = .17') && !source.includes('Math.min(.25'));

  // 읽음 표 머리·제출 유형·저장 안내 세 곳만 바꾼다. 보고 내용·판정·수치는 모두 그대로 대조한다.
  function approvedVerdictDocument(document) {
    const expectedDocument = JSON.parse(JSON.stringify(document));
    assert.equal(expectedDocument.telemetry[3][0], '열람 상태');
    expectedDocument.telemetry[3][0] = '읽음 상태';
    assert.equal(expectedDocument.sections[0].record.type, '현장 판정자 제출 사본');
    expectedDocument.sections[0].record.type = '현장 판정자 제출 기록';
    assert.equal(expectedDocument.sections[1].paragraphs[0], '아래 내용은 최종 판정이 내려진 순간의 선택 기록이다. 이후 작전을 다시 시작해도 이 사본은 바뀌지 않는다.');
    expectedDocument.sections[1].paragraphs[0] = '아래 내용은 최종 판정이 내려진 순간의 선택 기록이다. 이후 작전을 다시 시작해도 이 기록은 바뀌지 않는다.';
    return expectedDocument;
  }
  const states = {};
  Object.entries(test.ProjectCursePilgrimageData.scenarios).forEach(([id, scenario]) => { states[id] = { schema: 2, scenarioId: id, status: 'complete', step: scenario.stages.length - 1, metrics: Object.fromEntries(scenario.metrics.map(m => [m.key, 51])), violations: 1, choices: scenario.stages.map(s => ({ stage: s.id, choice: s.choices[0].id, ruleOutcome: 'unknown' })), ending: Object.keys(scenario.endings)[0], startedAt: '2042-01-01T00:00:00.000Z', updatedAt: '2042-01-01T01:00:00.000Z' }; });
  storage.set('pc_pilgrimage_states_v2', JSON.stringify({ schema: 2, states }));
  vm.runInContext(read('tools/fixtures/legacy-app/assets/js/core/pilgrimage-state.js'), test);
  vm.runInContext(read('tools/fixtures/legacy-app/assets/js/core/verdict-archive-state.js'), test);
  const registered = [];
  test.PCApp = { h() {}, screen: def => registered.push(def) }; test.matchMedia = () => ({ matches: false });
  const hook = 'root.__archiveTest = { loadVerdicts, verdictDocument, resolveVariant };';
  vm.runInContext(source.replace("  PC.screen({ id: 'archive-entry'", `${hook}\n  PC.screen({ id: 'archive-entry'`), test);
  test.__archiveTest.loadVerdicts();
  const reportIds = test.ProjectCurseVerdictArchiveState.list().filter(e => e.unlocked).map(e => e.id);
  const mismatches = reportIds.filter(id => JSON.stringify(approvedVerdictDocument(test.ProjectCurseVerdictArchiveState.getDocument(id))) !== JSON.stringify(test.__archiveTest.verdictDocument(id)));
  add('saved-verdict-render-data-parity', reportIds.length === 3 && !mismatches.length, mismatches.join(', '));
  const existingOwner = test.ProjectCurseVerdictArchiveState;
  const expectedReports = Object.fromEntries(reportIds.map(id => [id, JSON.stringify(approvedVerdictDocument(existingOwner.getDocument(id)))]));
  vm.runInContext('window.ProjectCurseVerdictArchiveState = null;', test);
  test.__archiveTest.loadVerdicts();
  add('independent-verdict-adapter-parity', reportIds.every(id => JSON.stringify(test.__archiveTest.verdictDocument(id)) === expectedReports[id]));
  const dismissed = JSON.parse(storage.get('pc_verdict_archive_state_v1'));
  const removed = reportIds[0], entry = test.ProjectCurseVerdictArchiveData.records.find(r => r.id === removed);
  delete dismissed.records[removed]; dismissed.dismissed[entry.scenarioId] = `${states[entry.scenarioId].ending}:${states[entry.scenarioId].updatedAt}`;
  storage.set('pc_verdict_archive_state_v1', JSON.stringify(dismissed)); test.__archiveTest.loadVerdicts();
  add('deleted-snapshot-stays-dismissed', test.__archiveTest.verdictDocument(removed) === null, JSON.stringify({ removed, dismissed: dismissed.dismissed[entry.scenarioId], current: `${test.ProjectCursePilgrimageState.get(entry.scenarioId).ending}:${test.ProjectCursePilgrimageState.get(entry.scenarioId).updatedAt}`, records: Object.keys(JSON.parse(storage.get('pc_verdict_archive_state_v1')).records) }));
  const variantMismatches = [];
  Object.entries(states).forEach(([id, saved]) => { const scenario = test.ProjectCursePilgrimageData.scenarios[id]; scenario.stages.forEach((stage, i) => { const actual = test.__archiveTest.resolveVariant(stage, saved), expectedStage = test.ProjectCursePilgrimageState.getStage(id, i, saved); if (JSON.stringify(actual) !== JSON.stringify(expectedStage)) variantMismatches.push(`${id}:${i}`); }); });
  add('reactive-stage-wording-parity', !variantMismatches.length, variantMismatches.join(', '));
  add('missing-local-report-no-substitute', test.__archiveTest.verdictDocument('missing-key') === null && test.__archiveTest.verdictDocument('DZ-RV-99') === null);
  verifyArchivePlayback({ add, read, context });
}

// 브라우저 대체가 아닌 격리 실행 검사다. 실제 화면 코드를 가짜 시계·매체로 구동한다.
export function screenRuntime({ context, read, screenName = 'archive' }) {
  let now = 0, sequence = 0;
  const timers = new Map(), allMedia = [], screens = new Map(), routes = [], threats = [];
  let c;
  class Target {
    constructor() { this.events = new Map(); }
    addEventListener(type, fn, options = {}) { if (!this.events.has(type)) this.events.set(type, []); this.events.get(type).push({ fn, options }); }
    listeners(type) { return (this.events.get(type) || []).filter(entry => !entry.options.signal?.aborted); }
    dispatchEvent(event) {
      event.target ||= this; event.currentTarget = this;
      event.preventDefault ||= function () { this.defaultPrevented = true; };
      event.stopPropagation ||= function () { this.stopped = true; };
      event.stopImmediatePropagation ||= function () { this.stopped = true; this.immediate = true; };
      for (const entry of this.listeners(event.type)) {
        if (entry.options.once) this.events.get(event.type).splice(this.events.get(event.type).indexOf(entry), 1);
        entry.fn(event); if (event.immediate) break;
      }
      if (event.bubbles && !event.stopped) this.parentNode?.dispatchEvent(event);
      return !event.defaultPrevented;
    }
    emit(type, props = {}) { return this.dispatchEvent({ type, ...props }); }
  }
  class Element extends Target {
    constructor(tag) {
      super(); this.tagName = tag.toUpperCase(); this.children = []; this.parentNode = null; this.dataset = {}; this.attrs = {}; this.hidden = false; this.disabled = false; this.open = false;
      this.style = { setProperty(name, value) { this[name] = value; } };
      this.classes = new Set();
      this.classList = { add: (...names) => names.forEach(n => this.classes.add(n)), remove: (...names) => names.forEach(n => this.classes.delete(n)), contains: n => this.classes.has(n), toggle: (n, force) => { const value = force ?? !this.classes.has(n); if (value) this.classes.add(n); else this.classes.delete(n); return value; } };
      if (['AUDIO', 'VIDEO'].includes(this.tagName)) { this.paused = true; this.ended = false; this.volume = 1; this.currentTime = 0; allMedia.push(this); }
    }
    get className() { return [...this.classes].join(' '); }
    set className(value) { this.classes = new Set(String(value).split(/\s+/).filter(Boolean)); }
    get isConnected() { return this === c.document.documentElement || !!this.parentNode?.isConnected; }
    get childElementCount() { return this.children.filter(n => n instanceof Element).length; }
    get nextSibling() { return this.parentNode?.children[this.parentNode.children.indexOf(this) + 1] || null; }
    get attributes() {
      const values = { ...this.attrs };
      if (this.className) values.class = this.className; else delete values.class;
      if (this.id) values.id = this.id;
      if (this.tabIndex != null) values.tabindex = String(this.tabIndex);
      for (const [key, value] of Object.entries(this.dataset)) values['data-' + key.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase())] = value;
      return Object.entries(values).map(([name, value]) => ({ name, value }));
    }
    get textContent() { return this.children.map(n => n instanceof Element ? n.textContent : String(n)).join(''); }
    set textContent(value) { this.replaceChildren(String(value)); }
    setAttribute(name, value) {
      this.attrs[name] = String(value);
      if (name === 'class') this.className = value;
      else if (name.startsWith('data-')) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = String(value);
      else if (['hidden', 'disabled', 'open', 'muted', 'loop'].includes(name)) this[name] = true;
      else if (name === 'tabindex') this.tabIndex = Number(value);
      else if (['id', 'value', 'src', 'type', 'loading'].includes(name)) this[name] = String(value);
    }
    getAttribute(name) { if (name === 'class') return this.className; if (['hidden', 'disabled', 'open'].includes(name)) return this[name] ? '' : null; if (name.startsWith('data-')) return this.dataset[name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] ?? null; return this.attrs[name] ?? this[name] ?? null; }
    removeAttribute(name) { delete this.attrs[name]; if (name === 'class') this.className = ''; if (name === 'id') this.id = ''; if (name === 'tabindex') delete this.tabIndex; if (name.startsWith('data-')) delete this.dataset[name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())]; if (['src', 'open', 'hidden'].includes(name)) this[name] = name === 'src' ? '' : false; }
    append(...items) { for (const item of items.flat(Infinity).filter(n => n != null && n !== false)) { if (item instanceof Element) { item.remove(); item.parentNode = this; } this.children.push(item); } }
    replaceChildren(...items) { this.children.forEach(n => { if (n instanceof Element) n.parentNode = null; }); this.children = []; this.append(...items); }
    insertBefore(node, next) { node.remove(); const index = next == null ? this.children.length : this.children.indexOf(next); assert.ok(index >= 0); this.children.splice(index, 0, node); node.parentNode = this; }
    replaceWith(node) { this.parentNode.insertBefore(node, this); this.remove(); }
    remove() { if (this.parentNode) { this.parentNode.children = this.parentNode.children.filter(n => n !== this); this.parentNode = null; } }
    all() { return [this, ...this.children.filter(n => n instanceof Element).flatMap(n => n.all())]; }
    matches(selector) {
      return selector.split(',').some(part => {
        let s = part.trim();
        if (s.includes(' ')) { const pieces = s.split(/\s+/), last = pieces.pop(); return this.matches(last) && !!this.parentNode?.closest(pieces.join(' ')); }
        if (s.includes(':not(:disabled)')) { if (this.disabled) return false; s = s.replace(':not(:disabled)', ''); }
        const tag = s.match(/^[\w-]+/)?.[0]; if (tag && tag.toUpperCase() !== this.tagName) return false;
        for (const match of s.matchAll(/\.([\w-]+)/g)) if (!this.classList.contains(match[1])) return false;
        const id = s.match(/#([\w-]+)/)?.[1]; if (id && this.id !== id) return false;
        for (const match of s.matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)) { const value = this.getAttribute(match[1]); if (value == null || (match[2] != null && String(value) !== match[2])) return false; }
        return true;
      });
    }
    querySelectorAll(selector) { return this.all().slice(1).filter(n => n.matches(selector)); }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    closest(selector) { return this.matches(selector) ? this : this.parentNode?.closest?.(selector) || null; }
    contains(node) { return this.all().includes(node); }
    focus() { c.document.activeElement = this; }
    scrollIntoView() {}
    getClientRects() { return this.closest('[hidden]') || this.closest('dialog')?.open === false ? [] : [{}]; }
    showModal() { this.open = true; this.setAttribute('open', ''); }
    close() { this.open = false; delete this.attrs.open; this.emit('close'); }
    play() { this.paused = false; return { catch() {} }; }
    pause() { this.paused = true; }
    load() {}
  }
  const document = new Target(), systemMotion = new Target(); systemMotion.matches = false;
  c = { ...context, document, AbortController, Node: Element, performance: { now: () => now }, console,
    CustomEvent: class { constructor(type, props) { this.type = type; Object.assign(this, props); } },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} }, sessionStorage: { getItem: () => null, setItem() {} },
    matchMedia: () => systemMotion, scrollY: 0, scrollTo() {},
    setTimeout(fn, delay) { const id = ++sequence; timers.set(id, { fn, due: now + delay }); return id; }, clearTimeout: id => timers.delete(id),
    requestAnimationFrame(fn) { return c.setTimeout(fn, 16); }, cancelAnimationFrame: id => timers.delete(id),
    PCAudio: { isOn: () => c.sound, cue() {} }, sound: true, mode: 'full' };
  document.documentElement = new Element('html'); document.body = new Element('body'); document.documentElement.append(document.body);
  document.createElement = tag => new Element(tag); document.querySelectorAll = s => document.documentElement.querySelectorAll(s); document.querySelector = s => document.querySelectorAll(s)[0] || null;
  document.activeElement = document.body;
  c.window = c; vm.createContext(c);
  // DOM 도우미도 실제 셸의 함수를 사용한다. 위 객체는 브라우저 경계만 흉내 낸다.
  const core = read('assets/app/js/pc-core.js');
  const domCode = core.slice(core.indexOf('  function h('), core.indexOf('  function clear('));
  vm.runInContext(`{ const doc = document; ${domCode} window.testH = h; }`, c);
  const h = c.testH;
  c.PCApp = { h, append: (el, children) => { el.append(...children); return el; }, clear: el => { el.replaceChildren(); return el; }, screen: screen => screens.set(screen.id, screen), setTitle() {},
    href: (...p) => '#' + p.join('/'), go: (...p) => routes.push(p), back: (...p) => routes.push(p), fx: () => c.mode, threat: level => threats.push(level),
    tag: text => h('span', null, text), missing: (code, key, text) => h('div.tc-missing', null, code, key, text), screenHead: () => h('header'), img: (src, props) => h('img', { src, ...props }) };
  for (const file of ['record-cinematic-registry', 'cinematic-cults', 'cinematic-immortality', 'cinematic-ferals', 'cinematic-sakuma']) vm.runInContext(read(`assets/app/js/cinematic/${file}.js`), c);
  const screenSource = read(`assets/app/js/screens/${screenName}.js`);
  vm.runInContext(screenName === 'archive' ? screenSource.replace("  PC.screen({ id: 'archive-entry'", "  root.__archiveDOM = { protectedBody };\n  PC.screen({ id: 'archive-entry'") : screenSource, c);
  const host = h('main'); document.body.append(host);
  const screen = screens.get(screenName === 'archive' ? 'archive-entry' : 'faction-info'); screen.mount(host, c.PCApp);
  const show = parts => screen.show(parts, c.PCApp, { reason: 'push' });
  const click = node => { assert.ok(node, '누를 요소가 있어야 한다'); node.focus(); node.emit('click', { bubbles: true, button: 0 }); };
  const tick = duration => {
    const end = now + duration; let iterations = 0;
    while (true) { const entry = [...timers].filter(([, value]) => value.due <= end).sort((a, b) => a[1].due - b[1].due)[0]; if (!entry) break; assert.ok(++iterations < 10000, '타이머가 끝나야 한다'); now = entry[1].due; timers.delete(entry[0]); entry[1].fn(); }
    now = end;
  };
  return { c, h, host, screen, show, click, tick, timers, allMedia, routes, threats, systemMotion };
}

function verifyArchivePlayback({ add, read, context }) {
  const check = (name, run) => { try { run(); add(name, true); } catch (error) { add(name, false, error.stack); } };
  check('ui-labels-preserve-source-records', () => {
    const r = screenRuntime({ read, context });
    const originalRecords = JSON.stringify(r.c.ProjectCurseArchive.publicRecords);
    const regionRecords = r.c.ProjectCurseArchive.publicRecords.filter(record => record.category === 'region');
    assert.ok(regionRecords.length > 0, '지역 분류 기록이 있어야 한다');
    r.show([]);
    assert.ok(r.host.querySelectorAll('.tc-arc-legend-row').every(row => !/열람|대조/.test(row.textContent)), '출처 범례도 쉬운 말로 표시한다');
    r.click(r.host.querySelector('[data-arc-filter="region"]'));
    const input = r.host.querySelector('#tc-arc-search'); input.value = '지역'; input.emit('input');
    const rows = r.host.querySelectorAll('.tc-arc-list [data-arc-record]');
    assert.equal(rows.length, regionRecords.length, '표시된 분류 이름으로도 기록을 찾는다');
    assert.ok(rows.every(row => row.querySelector('.tc-row-meta').textContent.includes('지역')));
    for (const record of regionRecords) {
      r.show([record.id]);
      assert.equal(r.host.querySelector('h1').textContent, record.title, '기록 제목은 고유명사로 보존한다');
      const term = r.host.querySelector('.tc-arc-cover').querySelectorAll('dt').find(el => el.textContent === '분류');
      assert.equal(term.parentNode.querySelector('dd').textContent, '지역');
    }
    assert.equal(JSON.stringify(r.c.ProjectCurseArchive.publicRecords), originalRecords, '표시 문구가 원본 자료를 바꾸지 않는다');
    r.screen.hide(); assert.equal(r.timers.size, 0);
  });
  check('four-modal-playback-lifecycles', () => {
    const r = screenRuntime({ read, context });
    for (const id of ['Cults_871104', 'Immortality_860201', 'Ferals_860722', 'Sakuma_Tape_991028']) {
      r.show([id]); const launch = r.host.querySelector('[aria-haspopup="dialog"]'); r.click(launch);
      assert.equal(r.threats.at(-1), id === 'Cults_871104' ? 'high' : 'critical');
      const modal = r.host.querySelector('.tc-arc-cinema-dialog'), cfg = r.c.ProjectCurseCinematicRegistry.get(id);
      assert.equal(modal.open, true); assert.ok(r.c.document.documentElement.classList.contains('tc-immersive'));
      const intro = modal.querySelector('.tc-arc-bridge-video'); assert.equal(intro.volume, .68); assert.equal(intro.muted, false); assert.equal(intro.paused, false);
      r.tick(cfg.introDuration || cfg.introFallback); assert.ok(modal.querySelector('.tc-arc-scene-body')); assert.equal(intro.paused, true);
      const currentStage = modal.querySelector('.tc-arc-cinema-stage'); currentStage.focus(); modal.emit('keydown', { key: 'p', target: currentStage });
      assert.ok(r.allMedia.filter(m => m.isConnected).every(m => m.paused)); const currentText = currentStage.textContent;
      r.tick(15000); assert.equal(currentStage.textContent, currentText);
      modal.emit('keydown', { key: 'p', target: currentStage }); assert.ok(r.allMedia.some(m => m.isConnected && !m.paused));
      modal.emit('keydown', { key: 'Escape', target: currentStage });
      assert.equal(modal.open, false); assert.equal(r.c.document.activeElement, launch); assert.equal(r.c.document.documentElement.classList.contains('tc-immersive'), false);
      assert.ok(r.allMedia.every(m => m.paused)); assert.equal(r.timers.size, 0);
      r.click(launch); r.screen.hide(); assert.equal(r.timers.size, 0); assert.ok(r.allMedia.every(m => m.paused)); assert.equal(r.c.document.documentElement.classList.contains('tc-immersive'), false);
      assert.equal(r.c.document.listeners('pc:fx').length, 0);
    }
  });
  check('reduced-mode-retains-timed-subtitles-and-audio', () => {
    const r = screenRuntime({ read, context }); r.c.mode = 'reduced'; r.show(['Cults_871104']); r.click(r.host.querySelector('[aria-haspopup="dialog"]'));
    const modal = r.host.querySelector('.tc-arc-cinema-dialog'); assert.ok(modal.classList.contains('tc-arc-fx-reduced'));
    assert.equal(modal.querySelector('.tc-arc-bridge-video').paused, false); assert.equal(modal.querySelector('.tc-arc-cinema-noise').paused, true);
    assert.equal(modal.querySelector('.tc-arc-bridge-still-frame').paused, true); assert.ok(modal.querySelector('.tc-arc-bridge-still-frame').src);
    r.tick(10450); r.tick(0);
    const lines = modal.querySelectorAll('[data-cinema-line]'); assert.equal(lines[0].classList.contains('tc-arc-line-pending'), false); assert.equal(lines[1].classList.contains('tc-arc-line-pending'), true);
    r.tick(400); const stage = modal.querySelector('.tc-arc-cinema-stage'); stage.focus(); modal.emit('keydown', { key: 'p', target: stage });
    r.tick(5000); modal.emit('keydown', { key: 'p', target: stage }); r.tick(499); assert.equal(lines[1].classList.contains('tc-arc-line-pending'), true);
    r.tick(1); assert.equal(lines[1].classList.contains('tc-arc-line-pending'), false);
    const frame = modal.querySelector('.tc-arc-scene-body'); r.c.mode = 'full'; r.c.document.emit('pc:fx', { detail: { mode: 'full' } }); assert.equal(modal.querySelector('.tc-arc-scene-body'), frame); assert.equal(modal.querySelector('.tc-arc-cinema-noise').paused, false);
    const mute = modal.querySelectorAll('button').find(b => b.textContent === '음소거'); r.click(mute); assert.equal(modal.querySelector('.tc-arc-scene-body'), frame); assert.ok(r.allMedia.filter(m => m.isConnected).every(m => m.muted));
    r.screen.hide(); assert.equal(r.timers.size, 0);
  });
  check('modal-keyboard-boundary-and-completion', () => {
    const r = screenRuntime({ read, context }); r.c.sound = false; r.show(['Sakuma_Tape_991028']); r.click(r.host.querySelector('[aria-haspopup="dialog"]'));
    const modal = r.host.querySelector('.tc-arc-cinema-dialog'); assert.equal(modal.querySelector('.tc-arc-bridge-video').muted, true);
    let controls = modal.querySelectorAll('button:not(:disabled), select, [tabindex="0"], summary').filter(n => n.getClientRects().length);
    controls.at(-1).focus(); modal.emit('keydown', { key: 'Tab', target: controls.at(-1) }); assert.equal(r.c.document.activeElement, controls[0]);
    controls[0].focus(); modal.emit('keydown', { key: 'Tab', shiftKey: true, target: controls[0] }); assert.equal(r.c.document.activeElement, controls.at(-1));
    const chooser = modal.querySelector('select'); chooser.value = String(r.c.ProjectCurseCinematicRegistry.pages('Sakuma_Tape_991028').length - 1); chooser.emit('change');
    r.click(modal.querySelectorAll('button').find(b => b.textContent === '계속 재생')); r.tick(15000);
    assert.equal(modal.open, false); assert.equal(r.c.document.documentElement.classList.contains('tc-immersive'), false); assert.ok(r.allMedia.every(m => m.paused));
    r.screen.hide();
  });
  check('mount-skip-image-acquisition-and-optional-shell', () => {
    const r = screenRuntime({ read, context }); delete r.c.PCApp.fx; r.show([]);
    const card = r.host.querySelector('[data-arc-record]'); r.click(card); assert.ok(card.querySelector('.tc-arc-mounting')); r.tick(0); r.c.document.emit('keydown', { key: 'x' });
    assert.equal(r.routes.length, 1); r.tick(500); assert.equal(r.routes.length, 1); r.screen.hide();
    r.show([]); r.click(r.host.querySelector('[data-arc-record]')); r.screen.hide(); r.tick(500); assert.equal(r.routes.length, 1);
    r.systemMotion.matches = true; r.show(['Ferals_860722']); r.click(r.host.querySelector('[aria-haspopup="dialog"]')); assert.ok(r.host.querySelector('.tc-arc-cinema-dialog').classList.contains('tc-arc-fx-reduced'));
    r.tick(10450);
    const chooser = r.host.querySelector('#tc-arc-scene'); chooser.value = String(r.c.ProjectCurseCinematicRegistry.pages('Ferals_860722').findIndex(page => page.image)); chooser.emit('change');
    const image = r.host.querySelector('.tc-arc-cinema-stage img'); assert.ok(image, '수신할 그림이 있어야 한다');
    const frame = image.closest('.tc-arc-image-frame'); assert.equal(frame.getAttribute('aria-busy'), 'true'); image.emit('load'); assert.equal(frame.getAttribute('aria-busy'), 'false'); assert.equal(frame.querySelector('.tc-arc-acquisition').hidden, true);
    r.screen.hide(); assert.equal(r.timers.size, 0);
  });
  check('all-scenes-finish-without-ended-events', () => {
    const r = screenRuntime({ read, context });
    for (const id of ['Cults_871104', 'Immortality_860201', 'Ferals_860722', 'Sakuma_Tape_991028']) {
      r.show([id]); const launch = r.host.querySelector('[aria-haspopup="dialog"]'); r.click(launch);
      const modal = r.host.querySelector('.tc-arc-cinema-dialog'); r.tick(2000000);
      assert.equal(modal.open, false, id); assert.equal(r.c.document.activeElement, launch, id);
      assert.equal(r.timers.size, 0, id); assert.ok(r.allMedia.every(m => m.paused), id); r.screen.hide();
    }
  });
  check('protected-image-wrapper-restores-original-node', () => {
    const r = screenRuntime({ read, context }); r.show(['Ferals_860722']);
    const vault = r.h('section'), image = r.h('img', { src: context.ProjectCurseLegacyCinematicSources.cults.find(page => page.image).image, alt: '보존 그림' });
    const figure = r.h('figure', null, image, r.h('figcaption', null, '보존 설명'));
    const article = r.h('article', { dataset: { record: 'Immortality_860201' }, hidden: true }, figure); vault.append(article); r.c.document.body.append(vault);
    const saved = node => JSON.stringify({ attrs: node.attributes.sort((a, b) => a.name.localeCompare(b.name)), children: node.children.map(child => typeof child === 'string' ? child : JSON.parse(saved(child))) });
    const before = saved(article); const wrapper = r.c.__archiveDOM.protectedBody(article); r.host.append(wrapper);
    assert.ok(article.querySelector('.tc-arc-acquisition')); assert.equal(image.closest('.tc-arc-image-frame')?.tagName, 'DIV');
    r.screen.hide(); assert.equal(article.parentNode, vault); assert.equal(image.parentNode, figure); assert.equal(saved(article), before);
    assert.equal(image.listeners('load').length, 0); assert.equal(image.listeners('click').length, 0);
  });
}
