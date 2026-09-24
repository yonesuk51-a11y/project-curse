#!/usr/bin/env node
// Project Curse 6 — 새 단말(index.html + assets/app/) 검증.
// 옛 verify-package.mjs 가운데 보호 기록·데이터·정사 검사를 새 구조로 옮기고, 새 앱의 화면·디자인 규칙을 더한다.
// 개수 단언은 기록을 추가·삭제했을 때만 새 값으로 고치고, 그 이유를 커밋 메시지에 적는다.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { compareFacts, dictionary, htmlText } from './prose-facts.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const read = (p) => readFileSync(ROOT + p, 'utf8');
const hash = (v) => createHash('sha256').update(v).digest('hex');
const checks = [];
const add = (name, pass, detail = '') => checks.push({ name, pass: !!pass, detail: String(detail) });
const tree = (dir) => readdirSync(ROOT + dir, { withFileTypes: true }).flatMap((entry) => {
  const rel = `${dir}${entry.name}`;
  return entry.isDirectory() ? tree(`${rel}/`) : [rel];
});

function article(source, id) {
  const start = source.indexOf(`<article class="record-detail" data-record="${id}"`);
  const end = start < 0 ? -1 : source.indexOf('</article>', start);
  return start < 0 || end < 0 ? '' : source.slice(start, end + '</article>'.length);
}

/* ---------- 1. 보호 기록 ----------
   원본은 canon/originals/에 봉인 보관하고 해시로 잠근다(2026-09-24 사용자 승인으로 개정판 작성 허용).
   사이트에 싣는 개정판은 원본의 사실을 바꾸지 않는다 — 숫자·약어·인용·판정 표현·고유명사를 원본과 대조한다. */
const LOCKED = {
  Cults_871104: { inline: 'aefa15d45fd74b868223144455da4dae59b5545f61fd5687a3132d8cf27c3429', standalone: '71b052533c33f3c4d9838a55633be82bb64030d4028be2304a48154fa049a740' },
  Immortality_860201: { inline: '38cd38c7db213c15517284155e7a70f98092cf9cae52e18d0be40b85fe73e993', standalone: '1d6c0fb57135631deb7feed3c4f6845f4bd1337e3b7ad34db78f95b8d5855626' }
};
const app = read('index.html');
const editions = [];
for (const [id, expected] of Object.entries(LOCKED)) {
  const originalArticle = read(`canon/originals/${id}.article.html`);
  const originalDocs = read(`canon/originals/${id}.docs.html`);
  add(`original-sealed:${id}`, hash(originalArticle) === expected.inline, hash(originalArticle));
  add(`original-docs-sealed:${id}`, hash(originalDocs) === expected.standalone, hash(originalDocs));
  // 개정판은 새 단말(index.html)의 #tc-vault에만 있다. docs/ 두 페이지는 기록보관소로 보내는 안내 페이지다(5절 끝에서 검사).
  editions.push([id, originalArticle, article(app, id), 'index.html']);
}
const publicApp = Object.keys(LOCKED).reduce((source, id) => source.replace(article(source, id), ''), app);
// 개정판 사실 대조는 데이터(고유명사 사전)를 불러온 뒤에 한다 — 아래 3절 끝.

/* ---------- 2. index.html이 부르는 파일 ---------- */
const localRefs = [...app.matchAll(/(?:src|href)="([^"#?]+)(?:\?[^"]*)?"/g)].map((m) => m[1]).filter((p) => !/^(https?:)?\/\//.test(p));
const missingRefs = localRefs.filter((p) => !existsSync(ROOT + p));
add('app-local-files-exist', missingRefs.length === 0, missingRefs.join(' | '));
add('app-no-legacy-runtime', !/assets\/css\/style\.css|assets\/js\/main\.js/.test(publicApp), '새 앱은 옛 style.css와 main.js를 불러오지 않는다');
add('app-social-metadata', ['name="description"', 'rel="canonical"', 'property="og:title"', 'property="og:image"', 'name="twitter:card"', 'project-curse-world-keyart-concept-v1.png'].every((needle) => app.includes(needle)));

/* ---------- 3. 데이터 적재 ---------- */
const context = { console };
context.window = context;
vm.createContext(context);
const dataScripts = [...app.matchAll(/<script src="(assets\/js\/data\/[^"?]+)/g)].map((m) => m[1]);
let loadError = '';
for (const file of dataScripts) {
  try {
    vm.runInContext(read(file), context, { filename: file });
  } catch (error) {
    loadError = `${file}: ${error.message}`;
    break;
  }
}
add('data-scripts-load', !loadError, loadError || `${dataScripts.length} files`);

// 보호 기록 개정판 — 원본과 사실 대조
const factDict = dictionary(context);
for (const [id, original, edition, where] of editions) {
  if (!edition) {
    add(`edition-present:${id}:${where}`, false, '개정판을 찾지 못했다');
    continue;
  }
  const result = compareFacts(htmlText(original), htmlText(edition), factDict);
  add(`edition-facts:${id}:${where}`, result.fails.length === 0, result.fails.join(' | '));
}

/* ---------- 4. 세계 기록 ---------- */
const W = context.ProjectCurseWorldHistoryData;
const P = context.ProjectCurseWorldHistoryProse;
const J = context.ProjectCurseJapanTechnology;
const C = context.ProjectCurseWorldHistoryCore;
add('history-core-eighteen-records', C?.records?.length === 18, C?.records?.length);
// 문장 흐름 개정 뒤에는 겹친 문단을 합쳐 문단 수가 줄 수 있다. 사실 보존은 tools/check-prose.mjs가 원문과 대조한다.
add('history-core-paragraphs-intact', C?.records?.every((record) => record.paragraphs.length >= 1 && record.paragraphs.every((text) => typeof text === 'string' && text.trim().length > 20)));
const historyRecords = [
  ...(W?.deepHistoryRecords || []),
  ...(C?.records || []).map((record) => ({ ...record, ...(W?.getRecord?.(record.id) || {}), ...(P?.getRecord?.(record.id) || {}) })),
  ...(J?.records || []),
  ...(W?.post2006Records || []).map((record) => ({ ...record, ...(P?.getRecord?.(record.id) || {}) }))
];
const historyIds = historyRecords.map((record) => record.id);
add('history-forty-nine-records', historyIds.length === 49, historyIds.length);
add('history-ids-unique', new Set(historyIds).size === historyIds.length);
const eraIds = new Set((W?.eras || []).map((era) => era.id));
const noEra = historyRecords.filter((record) => !eraIds.has(record.era)).map((record) => record.id);
add('history-every-record-has-era', noEra.length === 0, noEra.join(' | '));
const levels = new Set(Object.keys(W?.evidenceLevels || {}));
const badEvidence = historyRecords.filter((record) => record.evidence && !levels.has(record.evidence)).map((record) => record.id);
add('history-evidence-keys-known', badEvidence.length === 0, badEvidence.join(' | '));
const blood = P?.getRecord?.('1986-02-01-immortality');
add('history-blood-lake-counter-record', !!blood?.counterRecord?.fragments?.length);

/* ---------- 5. 화면 코드에 박힌 이동 대상이 데이터에 있다 ---------- */
const archiveDocuments = context.ProjectCurseArchiveDocuments?.documents || {};
const archiveIds = new Set([
  ...(context.ProjectCurseArchive?.publicRecords || []).map((record) => record.id),
  ...(Array.isArray(archiveDocuments) ? archiveDocuments.map((doc) => doc.id) : Object.keys(archiveDocuments))
]);
const opIds = new Set((context.ProjectCurseMapRoom?.operations || []).map((op) => op.id));
const historySet = new Set(historyIds);
const screenSources = tree('assets/app/js/screens/').filter((p) => p.endsWith('.js')).map((p) => [p, read(p)]);
// 새 앱이 만든 데이터 파일(index.html에서 ?v=6.x로 부르는 assets/js/data/*). 화면 문구와 이동 대상이 여기에도 있다.
const newDataFiles = [...new Set([...app.matchAll(/src="(assets\/js\/data\/[^"?]+\.js)\?v=6\./g)].map((m) => m[1]))];
const brokenTargets = [];
for (const [file, source] of [...screenSources, ...newDataFiles.map((file) => [file, read(file)])]) {
  for (const m of source.matchAll(/\['history',\s*'([^']+)'\]/g)) if (!historySet.has(m[1])) brokenTargets.push(`${file}: history/${m[1]}`);
  for (const m of source.matchAll(/\['archive-entry',\s*'([^']+)'\]/g)) if (!archiveIds.has(m[1])) brokenTargets.push(`${file}: archive-entry/${m[1]}`);
  for (const m of source.matchAll(/\['map-room',\s*'op',\s*'([^']+)'\]/g)) if (!opIds.has(m[1])) brokenTargets.push(`${file}: map-room/op/${m[1]}`);
}
// 옛 독립 문서 페이지(docs/<ID>/)는 새 단말의 기록보관소로 보내는 안내 페이지다(tools/build-docs-stubs.mjs).
// 공유된 주소가 끊기지 않고 미리보기 정보가 남아야 한다. 옛 표시층 파일을 부르지 않는다.
const docsIds = readdirSync(ROOT + 'docs', { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
const badStubs = docsIds.filter((id) => {
  const page = read(`docs/${id}/index.html`);
  const target = `../../index.html#archive-entry/${id}`;
  return !archiveIds.has(id) || !page.includes(`url=${target}"`) || !page.includes(`location.replace(${JSON.stringify(target)})`) ||
    !['property="og:title"', 'property="og:description"', 'property="og:image"', 'name="twitter:card"'].every((needle) => page.includes(needle)) ||
    /assets\/(?:css|js)\//.test(page);
});
add('docs-pages-forward-to-archive', docsIds.length === 9 && badStubs.length === 0, badStubs.join(' | ') || `${docsIds.length} pages`);
add('app-html-retired', !existsSync(ROOT + 'app.html'), '새 단말은 index.html 하나다');

const turns = context.ProjectCurseHistoryScreen?.turns || [];
if (turns.length !== 4) brokenTargets.push(`history-screen-data turns: ${turns.length}/4`);
for (const [id] of turns) if (!historySet.has(id)) brokenTargets.push(`history-screen-data turns: ${id}`);
add('screen-link-targets-exist', brokenTargets.length === 0, brokenTargets.join(' | '));
const homeIntel = context.ProjectCurseHomeIntelligence;
const badSignals = (homeIntel?.signals || []).filter((signal) => (signal.operation && !opIds.has(signal.operation)) || (signal.record && !archiveIds.has(signal.record)));
add('home-signal-targets-exist', badSignals.length === 0 && opIds.has(homeIntel?.alert?.operation), badSignals.map((s) => s.label).join(' | '));
// 홈의 진행 채널 — 순례·작전·판정 키가 실제 데이터에 있고, 수신 데이터 첫 네 행과 짝이 맞는다
const homeScreen = context.ProjectCurseHomeScreen;
const scenarioIds = new Set(Object.keys(context.ProjectCursePilgrimageData?.scenarios || {}));
const verdictIds = new Set((context.ProjectCurseVerdictArchiveData?.records || []).map((record) => record.id));
const contactOp = (context.ProjectCurseMapRoom?.operations || []).find((op) => op.id === homeScreen?.contact?.operation);
const badChannels = (homeScreen?.channels || []).filter((channel) =>
  (channel.scenario && !scenarioIds.has(channel.scenario)) ||
  (channel.operation && !opIds.has(channel.operation)) ||
  (channel.unlockVerdict && !verdictIds.has(channel.unlockVerdict)));
add('home-live-channels-resolve',
  homeScreen?.channels?.length === 4 && homeIntel?.signals?.length >= 4 && homeIntel.signals[0].operation === homeIntel.alert.operation &&
  badChannels.length === 0 && !!contactOp?.steps?.[homeScreen.contact.step] && !!homeScreen?.keyArt?.src && existsSync(ROOT + homeScreen.keyArt.src),
  badChannels.map((channel) => channel.scenario || channel.kind).join(' | '));

/* ---------- 6. 공개 문구 — 메타 용어 금지 ---------- */
const FORBIDDEN = ['정사', '캐논', '플레이어', '독자 선택', '시나리오 모드', '메인 스토리', 'AI 이미지', '생성 이미지'];
const stripComments = (source) => source.replace(/^\s*\/\/.*$/gm, '');
const publicSources = [publicApp, ...newDataFiles.map((file) => stripComments(read(file))), ...screenSources.map(([, source]) => stripComments(source))].join('\n');
const foundForbidden = FORBIDDEN.filter((term) => publicSources.includes(term));
add('public-copy-no-meta-language', foundForbidden.length === 0, foundForbidden.join(' | '));

/* ---------- 7. 화면 등록 ---------- */
const SCREEN_FILES = { 'terminal-home': 'home', history: 'history', 'map-room': 'map', 'faction-info': 'faction', 'archive-entry': 'archive', personnel: 'personnel', 'field-manual': 'manual' };
// 교전 교범은 교범 원문을 절 제목으로 찾아 읽는다. 제목이 바뀌면 화면이 비므로 여기서 먼저 잡는다.
const manualDoc = (Array.isArray(archiveDocuments) ? archiveDocuments.find((doc) => doc.id === 'NHC_Manual_891219') : archiveDocuments.NHC_Manual_891219) || null;
const manualSource = read('assets/app/js/screens/manual.js');
const manualTitles = [...manualSource.matchAll(/section\('([^']+)'\)/g)].map((m) => m[1]);
const blockTitles = [...(manualSource.match(/const blocks = \[([\s\S]*?)\];/)?.[1] || '').matchAll(/\['([^']+)',/g)].map((m) => m[1]);
const neededTitles = [...new Set([...manualTitles, ...blockTitles])];
const sectionTitles = new Set((manualDoc?.sections || []).map((sec) => sec.title));
const missingTitles = neededTitles.filter((title) => !sectionTitles.has(title));
add('manual-sections-exist', !!manualDoc && neededTitles.length >= 9 && missingTitles.length === 0, missingTitles.join(' | ') || `${neededTitles.length} sections`);
add('manual-break-rule-source', (manualDoc?.sections || []).some((sec) => (sec.items || []).some((item) => item.includes('둘을 잃으면 전원 철수'))));
for (const [id, name] of Object.entries(SCREEN_FILES)) {
  const source = read(`assets/app/js/screens/${name}.js`);
  const registers = /PC\.screen\(\{\s*id:\s*'([^']+)'/.exec(source);
  if (!registers) continue; // 아직 옮기지 않은 화면 — 셸이 SCREEN NOT BUILT로 알린다
  add(`screen-registers:${id}`, registers[1] === id, registers[1]);
}
const coreSource = read('assets/app/js/pc-core.js');
add('core-legacy-aliases', ['faction-relation', 'region-map', 'zone-map', 'operation-map'].every((alias) => coreSource.includes(`'${alias}'`)));
add('core-deep-link-attributes', ['uacHistoryRecord', 'uacArchiveRecord', 'uacPersonRecord', 'uacMapOperation', 'uacMapIncident', 'uacPilgrimage'].every((key) => coreSource.includes(key)));
add('core-no-silent-route-fallback', coreSource.includes('unknown: raw') && read('assets/app/js/screens/home.js').includes('UNKNOWN CHANNEL'));

/* ---------- 8. 디자인 규칙 — 가이드 2·7·14절 ---------- */
const cssFiles = tree('assets/app/css/').filter((p) => p.endsWith('.css'));
const radiusViolations = [];
const glowViolations = [];
for (const file of cssFiles) {
  const css = read(file);
  for (const m of css.matchAll(/border(?:-[a-z]+)*-radius\s*:\s*([^;}]+)/g)) {
    const values = m[1].match(/[\d.]+(?=px)/g) || [];
    if (values.some((v) => Number(v) > 2) || /%|rem|em/.test(m[1])) radiusViolations.push(`${file}: ${m[0].trim()}`);
  }
  for (const m of css.matchAll(/(?:box|text)-shadow\s*:\s*([^;}]+)/g)) {
    if (m[1].trim() === 'none') continue;
    // 번짐(blur)이 있는 그림자는 글로우로 본다. 번짐 0인 선 그림자와 inset만 허용한다.
    const shadows = m[1].split(/,(?![^(]*\))/);
    const blurred = shadows.some((shadow) => {
      const lengths = shadow.replace(/rgba?\([^)]*\)|var\([^)]*\)|inset/g, '').match(/-?[\d.]+(?:px)?/g) || [];
      return lengths.length >= 3 && Number(String(lengths[2]).replace('px', '')) > 0;
    });
    if (blurred || m[0].startsWith('text-shadow')) glowViolations.push(`${file}: ${m[0].trim()}`);
  }
}
add('design-radius-max-2px', radiusViolations.length === 0, radiusViolations.join(' | '));
add('design-no-glow', glowViolations.length === 0, glowViolations.join(' | '));
add('design-reduced-motion', read('assets/app/css/base.css').includes('prefers-reduced-motion'));
const tokens = read('assets/app/css/tokens.css');
add('design-guide-palette', ['#0a0c0b', '#111513', '#d8d6cc', '#56613f', '#9a7b50', '#c98a2e', '#9e2f2a', '#6e1f2a', '#7fa39a'].every((hex) => tokens.toLowerCase().includes(hex)));

/* ---------- 9. 외부 링크 ---------- */
const blankLinks = screenSources.filter(([, source]) => source.includes("target: '_blank'"));
add('external-links-noopener', blankLinks.every(([, source]) => source.includes("rel: 'noopener noreferrer'")));

/* ---------- 10. 화면별 추가 검사 — tools/verify-app.d/<화면>.mjs ----------
   각 파일은 default export로 ({add, read, context, app, historyIds, archiveIds, opIds}) => void 를 내보낸다.
   화면 담당자가 자기 파일에만 검사를 더해 서로 충돌하지 않게 한다. */
const extensionDir = 'tools/verify-app.d/';
if (existsSync(ROOT + extensionDir)) {
  for (const file of readdirSync(ROOT + extensionDir).filter((name) => name.endsWith('.mjs')).sort()) {
    try {
      const module = await import(new URL(`../${extensionDir}${file}`, import.meta.url));
      await module.default({ add: (name, pass, detail) => add(`${file.replace('.mjs', '')}:${name}`, pass, detail), read, context, app, historyIds: historySet, archiveIds, opIds });
    } catch (error) {
      add(`extension-load:${file}`, false, error.message);
    }
  }
}

console.log('Project Curse 6 app verification');
checks.forEach((check) => console.log(`${check.pass ? 'PASS' : 'FAIL'}  ${check.name}${check.detail && !check.pass ? `  ${check.detail}` : ''}`));
const failed = checks.filter((check) => !check.pass);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
if (failed.length) process.exitCode = 1;
