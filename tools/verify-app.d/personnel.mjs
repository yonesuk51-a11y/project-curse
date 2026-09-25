import vm from 'node:vm';
import assert from 'node:assert/strict';
import { screenHarness } from './map.mjs';

export default function ({ add, read, context, app, historyIds, archiveIds, opIds }) {
  const P = context.ProjectCursePersonnel;
  const D = context.ProjectCursePersonnelDisplay;
  const F = context.ProjectCurseFactionAnalysis;
  const legacy = read('tools/fixtures/legacy-app/assets/js/pages/personnel-archive.js');
  const source = read('assets/app/js/screens/personnel.js');
  const records = P.records;
  // 2026-09-25 사용자 결정으로 2006년 명부에서 35명을 정리했다(56 → 21명, 빈 그룹 두 개 삭제).
  add('twenty-one-files-eight-groups', records.length === 21 && P.groups.length === 8);
  add('unique-ids-and-index', new Set(records.map((record) => record.id)).size === 21 && records.every((record) => P.byId[record.id] === record));
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
  const ageExceptions = { reiki: '26세 / 2004년 사망 기록', 'apostle-luke-eugene': '외형 37세 / 실제 연령 미상' };
  add('identity-career-and-recorded-age', D?.year === '2006' && records.every((record) => record.identity && (Object.hasOwn(ageExceptions, record.id) ? record.identity.age === ageExceptions[record.id] : record.identity.age.includes('2006')) && record.history.length && record.background.length));
  add('ability-cost-preserved', records.filter((record) => record.abilitySource).every((record) => record.abilityCost));
  add('historical-names-searchable', records.filter((record) => record.sourceName).every((record) => record.aliases.includes(record.sourceName)));
  // 2026-09-25 사용자 채택: 2006년 명부의 사진은 사쿠마 유타·마커스 콜, 기록 기반 4명, 지휘부 6명(12명)뿐이다.
  // 사진은 매체 목록과 증거 대장에 등록된 재구성 파일만 쓴다(추가 등록 명부도 같다).
  const withPortrait = (list) => list.filter((record) => record.visual?.src);
  const withFormerPortrait = [...records, ...(P.additions || [])].filter((record) => record.formerVisual?.src);
  const registeredPortrait = (visual) => Boolean(context.ProjectCurseMediaManifest?.resolve(visual.src) &&
    context.ProjectCurseVisualEvidence?.known?.[visual.src] && visual.className === 'RECONSTRUCTED' && visual.alt && visual.caption && visual.label);
  add('portraits-registered-only', withPortrait(records).map((record) => record.id).sort().join(',') === 'alma-kara,alma-koenig,alma-millen,apostle-luke-eugene,apostle-uro,baranto,ezekiel-kalp,frux,mason,pierce,sakuma-yuta,yohan' &&
    [...withPortrait(records), ...withPortrait(P.additions || [])].every((record) => registeredPortrait(record.visual)) &&
    withFormerPortrait.every((record) => registeredPortrait(record.formerVisual) && record.formerVisual.era),
    `${withPortrait(records).length} legacy / ${withPortrait(P.additions || []).length} additions / ${withFormerPortrait.length} former`);
  // 2042 추가 등록 — 2006년 명부(records)와 섞지 않는다. 인물마다 기준 연도와 확인되지 않은 부분을 적는다.
  const additions = P.additions || [];
  const additionGroupIds = new Set((P.additionGroups || []).map((group) => group.id));
  const legacyIds = new Set(records.map((record) => record.id));
  add('addition-register-separate', additions.length === 22 && additions.every((record) => record.register === 'addition' && !legacyIds.has(record.id) && P.byId[record.id] === record) &&
    new Set(additions.map((record) => record.id)).size === additions.length && P.groups.every((group) => !additionGroupIds.has(group.id)),
    `${additions.length} additions`);
  add('addition-records-complete', additions.every((record) => record.registerYear && record.role && record.overview && record.limits?.length &&
    additionGroupIds.has(record.group) && P.statuses[record.status] && P.certainties[record.certainty] &&
    (record.affiliations || []).every((item) => F.factions[item.key] && P.certainties[item.certainty]) &&
    (record.relationships || []).every((item) => P.byId[item.target] && P.certainties[item.certainty]) &&
    (!record.abilitySource || record.abilityCost)) && (P.additionGroups || []).every((group) => group.factionKeys.every((key) => F.factions[key])));
  add('addition-year-and-status-per-record', source.includes('record.registerYear || display().year') && source.includes("isAddition(record) ? own(source()?.statuses, id)?.label"));
  // 사용자 요청에 따른 안내문 두 어절만 교체한다. 연도·상태·대가·기록 한계는 옛 문구와 대조한다.
  add('legacy-display-facts-and-approved-intro', D?.year === '2006' && D.intro === '2006년까지 확인된 인물과 그들이 남긴 사건을 모았다. 이름을 누르면 주요 기록부터 읽을 수 있다.' &&
    [D.intro.replace('이름을 누르면 주요 기록', '이름을 선택하면 핵심 기록'), D.limitDefault, D.abilityCostMissing, ...Object.values(D.statusLabels)].every((text) => legacy.includes(text)));
  const incidents = context.ProjectCurseIncidentNetwork.incidentList;
  add('cross-reference-targets-exist', incidents.every((item) => (!item.history || historyIds.has(item.history)) && (!item.operation || opIds.has(item.operation)) && item.records.every((id) => archiveIds.has(id))));
  // 주소 끝의 내용 해시(-8자)는 tools/stamp-assets.mjs가 찍는다.
  add('own-data-slot-only', /<!-- slot:personnel-data -->\r?\n<script src="assets\/js\/data\/personnel-display-data\.js\?v=6\.0\.0(?:-[0-9a-f]{8})?"><\/script>/.test(app));
  let syntax = true;
  try { new vm.Script(source); } catch { syntax = false; }
  add('screen-javascript-parses', syntax);
  add('no-html-string-rendering', !/innerHTML|insertAdjacentHTML|document\.write/.test(source));
  add('unknown-key-is-explicit', source.includes('Object.hasOwn(object, key)') && source.includes("PC.missing('PERSONNEL NOT FOUND'"));
  add('lifecycle-cleans-events-and-frame', source.includes('function hide()') && source.includes('listeners?.abort()') && source.includes('cancelAnimationFrame(restoreFrame)'));
  const css = read('assets/app/css/screens/personnel.css');
  add('reduced-motion-screen-rule', css.includes('html[data-fx="reduced"]') && !/@media\s*\(prefers-reduced-motion/.test(css) && source.includes("addEventListener('pc:fx'"));
  add('dossier-open-and-responsive-density', css.includes('@keyframes tc-per-file-open') && css.includes('clip-path: inset(0 0 100% 0)') && css.includes('html:not([data-density="full"])') && css.includes('@media (max-width: 720px)') && css.includes('minmax(0, 1fr)'));
  add('identity-anomalies-backed-by-records', D.identityAnomalies.length === 2 && D.identityAnomalies.every((id) => /기억|신원/.test(P.byId[id]?.abilityCost || '') && /흐려짐|소실|재현하지 못함/.test(P.byId[id]?.abilityCost || '')));
  const check = (name, run) => { try { add(name, true, run() || ''); } catch (error) { add(name, false, error.message); } };
  check('former-portrait-plates-and-brief-labels', () => {
    const { c, host, screen } = screenHarness(context, source);
    const record = { ...withPortrait(records)[0] };
    delete record.formerVisual;
    // 하네스의 조회표만 바꾼다. 실제 명부와 매체 데이터에는 검사용 사진을 넣지 않는다.
    c.ProjectCursePersonnel = { ...P, byId: { ...P.byId, [record.id]: record } };
    const show = () => screen.show([record.id], c.PCApp);
    const plates = () => host.querySelectorAll('.tc-per-photo');
    show(); assert.equal(plates().length, 1); assert.equal(host.querySelector('.tc-per-photos'), null);
    const originalText = host.querySelector('.tc-per-detail').textContent;
    const originalPlateText = plates()[0].textContent;
    const formerVisual = {
      src: withPortrait(records)[1].visual.src, className: 'RECONSTRUCTED',
      label: 'PORTRAIT RECONSTRUCTION / 인물 재구성', era: '기사 시절',
      alt: '검사용 지난 모습의 대체 설명', caption: '검사용 지난 모습 사진 설명'
    };
    c.ProjectCursePersonnel.byId[record.id] = { ...record, formerVisual };
    show(); assert.equal(plates().length, 2);
    const [primary, former] = plates();
    assert.equal(primary.textContent, originalPlateText);
    assert.equal(primary.querySelector('img').getAttribute('src'), record.visual.src);
    assert.equal(primary.querySelector('img').getAttribute('alt'), record.visual.alt);
    assert.ok(former.classList.contains('tc-evidence'));
    assert.ok(former.classList.contains('tc-per-photo--former'));
    assert.equal(former.getAttribute('data-record'), record.id);
    assert.equal(former.querySelector('h2').textContent, formerVisual.era);
    assert.equal(former.querySelector('.tc-evidence-media img').getAttribute('src'), formerVisual.src);
    assert.equal(former.querySelector('img').getAttribute('alt'), formerVisual.alt);
    const caption = former.querySelector('figcaption');
    for (const brief of [true, false]) {
      assert.ok(former.visibleText(brief).includes(formerVisual.era));
      assert.ok(caption.visibleText(brief).includes('인물 재구성'));
      assert.ok(caption.visibleText(brief).includes(formerVisual.caption));
      assert.equal(caption.visibleText(brief).includes('PORTRAIT RECONSTRUCTION'), !brief);
    }
    screen.hide(); show(); assert.equal(plates().length, 2);
    c.ProjectCursePersonnel.byId[record.id] = record;
    show(); assert.equal(plates().length, 1); assert.equal(host.querySelector('.tc-per-photos'), null);
    assert.equal(host.querySelector('.tc-per-detail').textContent, originalText);
    // 객체가 있어도 src가 없으면 사진판과 자리표시는 늘지 않는다.
    c.ProjectCursePersonnel.byId[record.id] = { ...record, formerVisual: { ...formerVisual, src: '' } };
    show(); assert.equal(plates().length, 1);
    assert.equal(host.querySelector('.tc-per-detail').textContent, originalText);
    screen.hide();
    return '두 사진·시대 제목·alt·캡션·보기 밀도·왕복 / 지난 사진 없을 때 단일 사진 유지';
  });
  check('six-per-group-expand-search-and-return', () => {
    const { c, host, screen, navigations } = screenHarness(context, source);
    const show = (parts) => screen.show(parts, c.PCApp, { reason: 'navigate' });
    const click = (key, value) => { const button = host.all().find((node) => node.dataset[key] === value); assert.ok(button, `${key}:${value}`); host.emit('click', button); };
    const roster = () => host.querySelectorAll('[data-per-id]');
    const groups = [...P.groups, ...P.additionGroups], everyone = [...records, ...additions];
    const initial = groups.reduce((sum, group) => sum + Math.min(6, everyone.filter((person) => person.group === group.id).length), 0);
    show([]); assert.equal(roster().length, initial); assert.equal(initial, 39);
    const ids = () => roster().map((node) => node.dataset.perId);
    for (const group of groups) assert.ok(ids().filter((id) => P.byId[id].group === group.id).length <= 6);
    assert.equal(host.querySelectorAll('[data-per-expand]').length, 1);
    click('perExpand', 'ushinoda-figures'); assert.equal(roster().length, initial + 4); assert.equal(navigations.length, 0);
    assert.equal(c.document.activeElement.dataset.perExpand, 'ushinoda-figures');
    assert.equal(c.document.activeElement.getAttribute('aria-expanded'), 'true');
    show([records[0].id]); show([]); assert.equal(roster().length, initial + 4);
    screen.hide(); show([]); assert.equal(roster().length, initial + 4);
    click('perExpand', 'ushinoda-figures'); assert.equal(roster().length, initial);
    click('perGroup', 'ushinoda'); assert.equal(roster().length, everyone.filter((person) => [person.group, ...(person.secondaryGroups || [])].includes('ushinoda')).length); assert.equal(host.querySelectorAll('[data-per-expand]').length, 0);
    click('perReset', '');
    const search = host.querySelector('#tc-per-search'); search.value = '사도'; host.emit('input', search);
    assert.ok(roster().length > 6); assert.equal(host.querySelectorAll('[data-per-expand]').length, 0);
    search.value = '찾을수없는인물000'; host.emit('input', search); assert.equal(roster().length, 0); assert.ok(host.textContent.includes('NO MATCHING PERSONNEL'));
    click('perReset', ''); click('perStatus', 'active'); assert.equal(roster().length, everyone.filter((person) => person.status === 'active').length);
    screen.hide(); return `처음 ${initial}/${everyone.length}명 · 펼침·검색·소속·상태·왕복 확인`;
  });
  check('names-affiliations-status-and-brief-labels', () => {
    const { c, host, screen } = screenHarness(context, source); screen.show([], c.PCApp);
    const brief = host.visibleText(true), full = host.visibleText();
    assert.ok(!brief.includes('PERSONNEL REGISTER')); assert.ok(full.includes('PERSONNEL REGISTER'));
    for (const row of host.querySelectorAll('[data-per-id]')) {
      const person = P.byId[row.dataset.perId], text = row.visibleText(true);
      assert.ok(text.includes(person.name)); assert.ok(text.includes(person.role));
      assert.ok(text.includes(person.affiliationSummary || P.groupById[person.group].label));
      assert.ok(text.includes(person.register === 'addition' ? P.statuses[person.status].label : D.statusLabels[person.status]));
      for (const alias of person.aliases || []) assert.ok(text.includes(alias));
    }
    screen.hide();
  });
  check('approved-screen-words-and-record-text-preserved', () => {
    const { c, host, screen } = screenHarness(context, source);
    screen.show([], c.PCApp);
    assert.equal(host.querySelector('.tc-per-group-buttons').getAttribute('aria-label'), '소속과 관계');
    assert.ok(host.visibleText(true).includes('소속과 관계'));
    screen.show(['sakuma-yuta'], c.PCApp);
    assert.ok(host.querySelectorAll('dt').some(node => node.textContent === '조직'));
    assert.ok(host.querySelectorAll('a').some(node => node.textContent === '세계 기록 목록 ↗' && node.attrs.href === '#history'));
    assert.ok(host.textContent.includes('소속 세력의 사건 목록'));
    assert.ok(host.querySelectorAll('a').some(node => node.textContent === '작전 진행 ↗' && node.attrs.href.startsWith('#map-room/op/')));
    for (const text of [P.byId['sakuma-yuta'].overview, ...P.byId['sakuma-yuta'].background]) assert.ok(host.textContent.includes(text));
    assert.doesNotMatch(source, /소속·관계군|세계 기록 색인|사건 색인|작전 경과|\['편제',/);
    screen.hide();
  });
  check('detail-anomaly-open-canon-and-fx-lifecycle', () => {
    const { c, host, screen, frames, media } = screenHarness(context, source);
    const show = (parts) => screen.show(parts, c.PCApp, { reason: 'navigate' });
    for (const person of [...records, ...additions]) {
      show([person.id]);
      const hooks = host.querySelectorAll('[data-tc-anomaly]');
      assert.equal(hooks.length, D.identityAnomalies.includes(person.id) ? 1 : 0);
      for (const hook of hooks) { assert.equal(hook.closest('a,button,h1,h2,h3,input'), null); assert.equal(hook.textContent, person.name); }
      assert.ok(host.querySelector('.tc-per-dossier'));
    }
    const id = D.identityAnomalies[0];
    c.ProjectCurseOpenCanon = { personnel: { [id]: ['검사용 자유 해석'] } };
    show([id]); assert.ok(host.textContent.includes('자유 해석')); assert.ok(host.textContent.includes('검사용 자유 해석'));
    let calls = 0; c.PCApp.openCanon = (text) => { calls++; return c.PCApp.h('span', { text }); };
    show([id]); assert.equal(calls, 1);
    media.matches = true; c.PCApp.fx = () => 'full'; media.emit('change', media); assert.equal(host.dataset.perFx, 'full');
    c.PCApp.fx = () => 'reduced'; c.document.emit('pc:fx', c.document, undefined, { mode: 'reduced' }); assert.equal(host.dataset.perFx, 'reduced');
    assert.ok(host.textContent.includes(P.byId[id].name)); assert.ok(host.textContent.includes(P.byId[id].abilityCost));
    show(['missing-person']); assert.ok(host.textContent.includes('PERSONNEL NOT FOUND')); assert.equal(host.querySelector('.tc-per-dossier'), null);
    show([]); assert.ok(frames.size > 0); screen.hide(); assert.equal(frames.size, 0);
    assert.equal(c.document.events.get('pc:fx').size, 0); assert.equal(media.events.get('change').size, 0); assert.equal(host.events.get('click').size, 0);
    show([]); show([]); assert.equal(host.events.get('click').size, 1); assert.equal(c.document.events.get('pc:fx').size, 1); screen.hide();
  });
}
