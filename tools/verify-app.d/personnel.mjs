import vm from 'node:vm';

export default function ({ add, read, context, app, historyIds, archiveIds, opIds }) {
  const P = context.ProjectCursePersonnel;
  const D = context.ProjectCursePersonnelDisplay;
  const F = context.ProjectCurseFactionAnalysis;
  const legacy = read('assets/js/pages/personnel-archive.js');
  const source = read('assets/app/js/screens/personnel.js');
  const records = P.records;
  add('fifty-six-files-ten-groups', records.length === 56 && P.groups.length === 10);
  add('unique-ids-and-index', new Set(records.map((record) => record.id)).size === 56 && records.every((record) => P.byId[record.id] === record));
  add('primary-and-secondary-groups-exist', records.every((record) => [record.group, ...(record.secondaryGroups || [])].every((id) => P.groupById[id])));
  add('status-and-certainty-keys', records.every((record) => P.statuses[record.status] && P.certainties[record.certainty] && (record.affiliations || []).every((item) => P.certainties[item.certainty]) && (record.relationships || []).every((item) => P.certainties[item.certainty])));
  add('all-relationship-targets-exist', records.every((record) => (record.relationships || []).every((item) => P.byId[item.target])));
  add('faction-and-group-links-exist', records.every((record) => (record.affiliations || []).every((item) => F.factions[item.key])) && P.groups.every((group) => group.factionKeys.every((key) => F.factions[key])));
  add('profiles-and-remakes-still-assembled', records.every((record) => {
    const profile = context.ProjectCursePersonnelProfiles.profiles[record.id];
    const remake = context.ProjectCursePersonnelRemake.records[record.id];
    return profile && remake && record.name === (remake.name || profile.name) && JSON.stringify(record.identity) === JSON.stringify(remake.identity || profile.identity) && record.incident === remake.incident;
  }));
  // 사망 당시 나이와 실제 연령 미상도 원문이다. 기준 연도에 맞춰 나이를 다시 계산하지 않는다.
  const ageExceptions = { 'yanami-shinka': '29세 / 2003년 사망 기록', duka: '42세 / 2001년 사망 기록', reiki: '26세 / 2004년 사망 기록', 'apostle-luke-eugene': '외형 37세 / 실제 연령 미상', 'apostle-urzag': '육체별 상이' };
  add('identity-career-and-recorded-age', D?.year === '2006' && records.every((record) => record.identity && (Object.hasOwn(ageExceptions, record.id) ? record.identity.age === ageExceptions[record.id] : record.identity.age.includes('2006')) && record.history.length && record.background.length));
  add('ability-cost-preserved', records.filter((record) => record.abilitySource).every((record) => record.abilityCost));
  add('historical-names-searchable', records.filter((record) => record.sourceName).every((record) => record.aliases.includes(record.sourceName)));
  add('distinct-aaron-identities', P.byId['aaron-uac'] && P.byId['aaron-syndicate'] && P.byId['aaron-uac'].name !== P.byId['aaron-syndicate'].name);
  add('no-unregistered-portraits', records.every((record) => !record.visual?.src));
  add('legacy-display-copy-exact', D?.year === '2006' && [D.intro, D.limitDefault, D.abilityCostMissing, ...Object.values(D.statusLabels)].every((text) => legacy.includes(text)));
  const incidents = context.ProjectCurseIncidentNetwork.incidentList;
  add('cross-reference-targets-exist', incidents.every((item) => (!item.history || historyIds.has(item.history)) && (!item.operation || opIds.has(item.operation)) && item.records.every((id) => archiveIds.has(id))));
  add('own-data-slot-only', /<!-- slot:personnel-data -->\r?\n<script src="assets\/js\/data\/personnel-display-data\.js\?v=6.0.0"><\/script>/.test(app));
  let syntax = true;
  try { new vm.Script(source); } catch { syntax = false; }
  add('screen-javascript-parses', syntax);
  add('no-html-string-rendering', !/innerHTML|insertAdjacentHTML|document\.write/.test(source));
  add('unknown-key-is-explicit', source.includes('Object.hasOwn(object, key)') && source.includes("PC.missing('PERSONNEL NOT FOUND'"));
  add('lifecycle-cleans-events-and-frame', source.includes('function hide()') && source.includes('listeners?.abort()') && source.includes('cancelAnimationFrame(restoreFrame)'));
  add('reduced-motion-screen-rule', read('assets/app/css/screens/personnel.css').includes('@media (prefers-reduced-motion: reduce)'));
}
