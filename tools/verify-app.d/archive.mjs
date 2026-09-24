import vm from 'node:vm';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Compare against the old owners, rather than maintaining a second set of expected prose.
export default function ({ add, read, context, app, archiveIds, opIds, historyIds }) {
  const source = read('assets/app/js/screens/archive.js');
  const css = read('assets/app/css/screens/archive.css');
  new vm.Script(source, { filename: 'archive.js' });
  add('two-screen-registration', ['archive-entry', 'media-audit'].every(id => source.includes(`PC.screen({ id: '${id}'`)));
  add('safe-dom-and-disposal', !/innerHTML|outerHTML\s*=|insertAdjacentHTML/.test(source) && ['AbortController', 'restoreVault?.()', 'releaseMedia', 'observer.disconnect()', 'auditHide()'].every(s => source.includes(s)));
  add('motion-manual-reading', source.includes("life.on(motion, 'change'") && source.includes('toggle.disabled = motion.matches') && source.includes('영상 대본 전체 열람') && css.includes('@media (prefers-reduced-motion: reduce)'));
  add('styles-scoped', !/(?:^|\})\s*(?:body|html|:root|\.record-page|\.page-tab|\.tc-btn|\.tc-row)\b/m.test(css));
  const migrated = context.ProjectCurseArchiveViewerData;
  const oldChapters = vm.runInNewContext(read('assets/js/pages/archive-consolidation.js').match(/const storyChapters\s*=\s*(\[[\s\S]*?\n\s*\]);/)[1]);
  add('chapter-prose-verbatim', JSON.stringify(oldChapters) === JSON.stringify(migrated.chapters));
  const oldPages = vm.runInNewContext(read('assets/js/core/record-cinematic-runtime.js').match(/    const pages = (\[[\s\S]*?\n\]);/)[1]);
  add('cults-storyboard-verbatim', JSON.stringify(oldPages) === JSON.stringify(context.ProjectCurseLegacyCinematicSources.cults));
  const oldCopy = (read('assets/js/main.js') + read('assets/js/pages/archive-document.js') + read('assets/js/pages/archive-consolidation.js') + read('assets/js/pages/media-clearance.js')).replace(/<\/?strong>/g, '');
  const copyStrings = value => typeof value === 'string' ? [value] : Object.values(value).flatMap(copyStrings);
  add('viewer-copy-verbatim', copyStrings(migrated.copy).every(text => oldCopy.includes(text)));

  const storage = new Map(), events = [];
  const test = { console, localStorage: { getItem: k => storage.get(k) || null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) }, document: { dispatchEvent: e => events.push(e), addEventListener() {} }, CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } } };
  test.window = test; vm.createContext(test);
  for (const m of app.matchAll(/<script src="(assets\/js\/data\/[^"?]+)/g)) vm.runInContext(read(m[1]), test);
  vm.runInContext(read('assets/js/core/operation-state.js'), test);
  const operation = test.ProjectCurseOperationState;
  add('operation-boundary-verbatim', ['operationId', 'storageKey', 'branchIds', 'canonBoundary', 'decisions'].every(key => JSON.stringify(operation[key]) === JSON.stringify(migrated.operation[key])));
  ['record-cinematic-registry.js'].forEach(file => vm.runInContext(read(`assets/js/core/${file}`), test));
  ['cults', 'immortality', 'ferals', 'sakuma'].forEach(name => vm.runInContext(read(`assets/js/pages/cinematic-${name}.js`), test));
  const registry = test.ProjectCurseCinematicRegistry;
  const expected = ['Cults_871104', 'Immortality_860201', 'Ferals_860722', 'Sakuma_Tape_991028'];
  add('four-independent-cinematics', expected.every(id => registry.pages(id).length > 0) && registry.ids().length === 4, expected.map(id => `${id}:${registry.pages(id).length}`).join(', '));
  add('all-records-openable', archiveIds.size === 17 && [...archiveIds].every(id => test.ProjectCurseArchiveDocuments.documents[id] || app.includes(`data-record="${id}"`)));
  add('reading-groups-complete', new Set(migrated.chapters.flatMap(c => c.ids)).size === 15 && migrated.chapters.every(c => c.ids.every(id => archiveIds.has(id))));
  const brokenLinks = (context.ProjectCurseIncidentNetwork?.incidentList || []).filter(i => i.records?.some(id => archiveIds.has(id))).flatMap(i => [i.operation && !opIds.has(i.operation) ? i.operation : '', i.history && !historyIds.has(i.history) ? i.history : ''].filter(Boolean));
  add('related-operation-history-targets', !brokenLinks.length, brokenLinks.join(', '));
  const paths = new Set();
  function collect(value) { if (typeof value === 'string' && /^(?:\.\.\/)*assets\//.test(value)) paths.add(value.replace(/^(?:\.\.\/)+/, '')); else if (Array.isArray(value)) value.forEach(collect); else if (value && typeof value === 'object') Object.values(value).forEach(collect); }
  expected.forEach(id => { collect(registry.get(id)); collect(registry.pages(id)); }); collect(test.ProjectCurseLegacyCinematicSources.cues); collect(test.ProjectCurseArchiveDocuments.documents); collect(test.ProjectCurseArchive.publicRecords);
  const root = fileURLToPath(new URL('../../', import.meta.url)), missing = [...paths].filter(p => !existsSync(root + p));
  add('all-document-cinematic-media-exist', !missing.length, missing.join(', '));
  const moduleStart = app.indexOf('<!-- slot:archive-modules'), screenStart = app.indexOf('assets/app/js/screens/archive.js');
  add('registry-before-screen-no-old-runtime', app.indexOf('assets/js/core/record-cinematic-registry.js') > moduleStart && app.indexOf('assets/js/pages/cinematic-sakuma.js') < screenStart && !app.includes('assets/js/core/record-cinematic-runtime.js'));

  // Exercise the actual new state reader and old report generator against identical completed snapshots.
  const states = {};
  Object.entries(test.ProjectCursePilgrimageData.scenarios).forEach(([id, scenario]) => { states[id] = { schema: 2, scenarioId: id, status: 'complete', step: scenario.stages.length - 1, metrics: Object.fromEntries(scenario.metrics.map(m => [m.key, 51])), violations: 1, choices: scenario.stages.map(s => ({ stage: s.id, choice: s.choices[0].id, ruleOutcome: 'unknown' })), ending: Object.keys(scenario.endings)[0], startedAt: '2042-01-01T00:00:00.000Z', updatedAt: '2042-01-01T01:00:00.000Z' }; });
  storage.set('pc_pilgrimage_states_v2', JSON.stringify({ schema: 2, states }));
  vm.runInContext(read('assets/js/core/pilgrimage-state.js'), test);
  vm.runInContext(read('assets/js/core/verdict-archive-state.js'), test);
  const registered = [];
  test.PCApp = { h() {}, screen: def => registered.push(def) }; test.matchMedia = () => ({ matches: false });
  const hook = 'root.__archiveTest = { loadVerdicts, verdictDocument, resolveVariant };';
  vm.runInContext(source.replace("  PC.screen({ id: 'archive-entry'", `${hook}\n  PC.screen({ id: 'archive-entry'`), test);
  test.__archiveTest.loadVerdicts();
  const reportIds = test.ProjectCurseVerdictArchiveState.list().filter(e => e.unlocked).map(e => e.id);
  const mismatches = reportIds.filter(id => JSON.stringify(test.ProjectCurseVerdictArchiveState.getDocument(id)) !== JSON.stringify(test.__archiveTest.verdictDocument(id)));
  add('saved-verdict-render-data-parity', reportIds.length === 3 && !mismatches.length, mismatches.join(', '));
  const existingOwner = test.ProjectCurseVerdictArchiveState;
  const expectedReports = Object.fromEntries(reportIds.map(id => [id, JSON.stringify(existingOwner.getDocument(id))]));
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
}
