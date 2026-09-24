import vm from 'node:vm';
import assert from 'node:assert/strict';
import { screenRuntime } from './archive.mjs';

export default function ({ add, read, context, app, historyIds, opIds }) {
  const F = context.ProjectCurseFactionAnalysis;
  const C = context.ProjectCurseCanon;
  const M = context.ProjectCurseFactionMarks;
  const L = context.ProjectCurseFactionLineage;
  const D = context.ProjectCurseFactionDisplay;
  const P = context.ProjectCursePersonnel;
  const source = read('assets/app/js/screens/faction.js');
  const legacy = read('tools/fixtures/legacy-app/assets/js/pages/faction-analysis.js');
  const keys = F.order;
  add('seventeen-dossiers', keys.length === 17 && Object.keys(F.factions).length === 17);
  add('five-groups-cover-every-dossier-once', F.groups.length === 5 && F.groups.flatMap((group) => group.keys).join('|') === keys.join('|') && new Set(keys).size === keys.length);
  add('history-canon-keys-open-exact-dossiers', Object.keys(C.factions).every((key) => F.factions[key]?.name === C.factions[key].name), Object.keys(C.factions).join('|'));
  add('all-relation-targets-exist', keys.every((key) => F.factions[key].relations.every((item) => Object.hasOwn(F.factions, item.target))));
  add('all-dossiers-retain-complete-body', keys.every((key) => {
    const item = F.factions[key];
    return item.lead && item.overview.length && item.operations.length && item.fault && item.chronology.length && ['status', 'lineage', 'misconception', 'past', 'unresolved'].every((field) => item.assessment[field]);
  }));
  const images = keys.flatMap((key) => [M.marks[key]?.asset, F.factions[key].visual?.src]).filter(Boolean);
  const missingImages = images.filter((file) => { try { return !read(file).length; } catch { return true; } });
  add('registered-marks-and-visuals-exist', images.length === 34 && !missingImages.length, missingImages.join('|'));
  add('mark-provenance-and-grades', keys.every((key) => M.marks[key]?.source && /^[A-D]$/.test(M.marks[key]?.confidence)));
  add('lineage-links-resolve', L.order.every((key) => F.factions[key] && L.nodes[key].history.every((id) => historyIds.has(id))) && L.edges.every((edge) => L.nodes[edge.from] && L.nodes[edge.to] && L.states[edge.state]));
  const incidents = context.ProjectCurseIncidentNetwork.incidentList.filter((item) => item.factions.some((key) => keys.includes(key)));
  add('incident-history-operation-targets', incidents.every((item) => (!item.history || historyIds.has(item.history)) && (!item.operation || opIds.has(item.operation))));
  add('personnel-links-resolve', Object.entries(P.factionIndex).filter(([key]) => keys.includes(key)).every(([, ids]) => ids.every((id) => P.byId[id])));
  // 사용자 용어표에 따른 묶음 이름 한 곳만 바꾼다. 도입문과 다른 묶음 이름은 옛 화면과 대조한다.
  const approvedGroup = 'CULT LINEAGE / COMMAND STATUS';
  add('display-copy-approved-wording', !!D?.intro && legacy.includes(D.intro) && D.groupLabels[approvedGroup] === '우시노다 갈래' && F.groups.every((group) => D.groupLabels[group.label] && legacy.includes(`'${group.label}':'${group.label === approvedGroup ? '우시노다 계통' : D.groupLabels[group.label]}'`)));
  // 주소 끝의 내용 해시(-8자)는 tools/stamp-assets.mjs가 찍는다.
  add('own-data-slot-only', /<!-- slot:faction-data -->\r?\n<script src="assets\/js\/data\/faction-display-data\.js\?v=6\.0\.0(?:-[0-9a-f]{8})?"><\/script>/.test(app));
  let syntax = true;
  try { new vm.Script(source); } catch { syntax = false; }
  add('screen-javascript-parses', syntax);
  add('no-html-string-rendering', !/innerHTML|insertAdjacentHTML|document\.write/.test(source));
  add('unknown-key-is-explicit', source.includes("Object.hasOwn(object, key)") && source.includes("PC.missing('FACTION NOT FOUND'") && !/factions\[key\]\s*\|\|/.test(source));
  add('lifecycle-cleans-events-and-frame', source.includes('function hide()') && source.includes('listeners?.abort()') && source.includes('cancelAnimationFrame(restoreFrame)'));
  const css = read('assets/app/css/screens/faction.css');
  add('reduced-motion-screen-rule', css.includes('html[data-fx="reduced"]') && !css.includes('@media (prefers-reduced-motion: reduce)'));
  add('brief-labels-and-optional-shell', source.includes('tc-full-only') && source.includes('PC.threat?.(threat)') && source.includes('root.ProjectCurseOpenCanon?.faction?.[key]') && source.includes('PC.openCanon?.(text)'));
  add('uncertain-names-outside-links', source.includes('anomalyCount < 2') && source.includes("h('span', { text: person.name, dataset: { tcAnomaly: 'name' } })") && source.includes("person.certainty === 'unresolved'"));
  try {
    const runtime = screenRuntime({ read, context, screenName: 'faction' });
    for (const key of keys) {
      runtime.show([key]);
      assert.ok(runtime.host.textContent.includes(F.factions[key].name));
      assert.ok(runtime.host.textContent.includes(F.factions[key].fault));
      const anomalies = runtime.host.querySelectorAll('[data-tc-anomaly]');
      assert.ok(anomalies.length <= 2);
      assert.ok(anomalies.every(el => !el.closest('a,button,h1,h2,h3,input')));
    }
    assert.equal(runtime.threats.length, 0, '위험 설명에서 등급을 지어내지 않는다');
    runtime.c.ProjectCurseOpenCanon = { faction: { fhc: ['검사용 자유 해석'] } };
    runtime.c.PCApp.openCanon = text => runtime.h('p', null, text);
    runtime.show(['fhc']); assert.ok(runtime.host.textContent.includes('검사용 자유 해석'));
    assert.ok(runtime.host.querySelectorAll('[data-tc-anomaly]').length > 0, '신원 불명 인물이 표시되어야 한다');
    runtime.show(['없는-세력']); assert.ok(runtime.host.textContent.includes('FACTION NOT FOUND'));
    runtime.screen.hide(); assert.equal(runtime.host.listeners('click').length, 0); assert.equal(runtime.timers.size, 0);
    add('detail-shell-fallback-and-identity-execution', true);
  } catch (error) { add('detail-shell-fallback-and-identity-execution', false, error.stack); }
}
