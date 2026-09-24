import vm from 'node:vm';

export default function ({ add, read, context, app, historyIds, opIds }) {
  const F = context.ProjectCurseFactionAnalysis;
  const C = context.ProjectCurseCanon;
  const M = context.ProjectCurseFactionMarks;
  const L = context.ProjectCurseFactionLineage;
  const D = context.ProjectCurseFactionDisplay;
  const P = context.ProjectCursePersonnel;
  const source = read('assets/app/js/screens/faction.js');
  const legacy = read('assets/js/pages/faction-analysis.js');
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
  add('registered-marks-and-visuals-exist', images.length === 25 && !missingImages.length, missingImages.join('|'));
  add('mark-provenance-and-grades', keys.every((key) => M.marks[key]?.source && /^[A-D]$/.test(M.marks[key]?.confidence)));
  add('lineage-links-resolve', L.order.every((key) => F.factions[key] && L.nodes[key].history.every((id) => historyIds.has(id))) && L.edges.every((edge) => L.nodes[edge.from] && L.nodes[edge.to] && L.states[edge.state]));
  const incidents = context.ProjectCurseIncidentNetwork.incidentList.filter((item) => item.factions.some((key) => keys.includes(key)));
  add('incident-history-operation-targets', incidents.every((item) => (!item.history || historyIds.has(item.history)) && (!item.operation || opIds.has(item.operation))));
  add('personnel-links-resolve', Object.entries(P.factionIndex).filter(([key]) => keys.includes(key)).every(([, ids]) => ids.every((id) => P.byId[id])));
  add('legacy-display-copy-exact', !!D?.intro && legacy.includes(D.intro) && F.groups.every((group) => D.groupLabels[group.label] && legacy.includes(`'${group.label}':'${D.groupLabels[group.label]}'`)));
  // 주소 끝의 내용 해시(-8자)는 tools/stamp-assets.mjs가 찍는다.
  add('own-data-slot-only', /<!-- slot:faction-data -->\r?\n<script src="assets\/js\/data\/faction-display-data\.js\?v=6\.0\.0(?:-[0-9a-f]{8})?"><\/script>/.test(app));
  let syntax = true;
  try { new vm.Script(source); } catch { syntax = false; }
  add('screen-javascript-parses', syntax);
  add('no-html-string-rendering', !/innerHTML|insertAdjacentHTML|document\.write/.test(source));
  add('unknown-key-is-explicit', source.includes("Object.hasOwn(object, key)") && source.includes("PC.missing('FACTION NOT FOUND'") && !/factions\[key\]\s*\|\|/.test(source));
  add('lifecycle-cleans-events-and-frame', source.includes('function hide()') && source.includes('listeners?.abort()') && source.includes('cancelAnimationFrame(restoreFrame)'));
  add('reduced-motion-screen-rule', read('assets/app/css/screens/faction.css').includes('@media (prefers-reduced-motion: reduce)'));
}
