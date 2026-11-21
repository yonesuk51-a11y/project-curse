// Project Curse 6 — 2006년 인물 명부·2042 추가 등록과 파일 (담당: Codex, 추가 등록 표시는 Claude)
// profiles/remake를 재조립하지 않는다. personnel-data.js가 확정한 표시 결과를 그대로 읽는다.
// 추가 등록(additions)은 2006년 명부와 섞지 않고 아래에 따로 싣는다. 기준 연도와 상태 문구도 인물마다 따로 쓴다.
(function (root) {
  'use strict';
  const PC = root.PCApp;
  const { h } = PC;
  const source = () => root.ProjectCursePersonnel;
  const display = () => root.ProjectCursePersonnelDisplay;
  const own = (object, key) => object && Object.hasOwn(object, key) ? object[key] : null;
  const groupOf = (id) => own(source()?.groupById, id);
  const person = (id) => own(source()?.byId, id);
  const additions = () => source()?.additions || [];
  const everyone = () => [...(source()?.records || []), ...additions()];
  const isAddition = (record) => record?.register === 'addition';
  const groupsOf = (record) => [record.group, ...(record.secondaryGroups || [])];
  const normalize = (value) => String(value ?? '').toLocaleLowerCase('ko-KR').replace(/[.·_\-\s]/g, '');
  const state = { query: '', group: 'all', status: 'all' };
  const expandedGroups = new Set();
  const openGroups = new Set();
  const initialGroupSize = 6;
  const filtering = () => !!normalize(state.query) || state.group !== 'all' || state.status !== 'all';
  const motionQuery = root.matchMedia?.('(prefers-reduced-motion: reduce)');
  const reducedFx = () => PC.fx ? PC.fx() === 'reduced' : !!motionQuery?.matches;
  let host, indexView, detailView, resultList, resultCount, search, listeners, rosterTabs, rosterBodies;
  let active = false, onIndex = true, selected = '', indexScroll = 0, restoreFrame = 0, renderVersion = 0;

  // 옛 검색 범위를 보존한다. 개명 전 이름, 부 소속, 장비, 대가, 관계, 경력도 검색된다.
  function searchText(record) {
    return normalize([
      record.name, record.sourceName, ...(record.aliases || []), record.role, record.overview, record.affiliationSummary,
      ...groupsOf(record).map((id) => groupOf(id)?.label || id),
      ...(record.affiliations || []).flatMap((item) => [item.label, item.role]),
      ...(record.capabilities || []), ...(record.equipment || []),
      ...(record.relationships || []).flatMap((item) => [person(item.target)?.name || item.target, item.relation]),
      ...Object.values(record.identity || {}), ...Object.values(record.personality || {}),
      ...(record.background || []), ...(record.history || []).flat(), ...(record.fieldNotes || []),
      record.unit, record.recordFunction, record.incident, record.abilitySource, record.abilityCost,
      ...(record.notes || []), ...(record.limits || [])
    ].join(' '));
  }
  function filteredRecords() {
    const query = normalize(state.query);
    return everyone().filter((record) =>
      (state.group === 'all' || groupsOf(record).includes(state.group)) &&
      (state.status === 'all' || record.status === state.status) && (!query || searchText(record).includes(query)));
  }
  function statusTag(id, record) {
    // 2042 추가 등록 인물에는 "2006년 …" 문구 대신 일반 상태 문구를 쓴다.
    const label = isAddition(record) ? own(source()?.statuses, id)?.label : own(display()?.statusLabels, id);
    return label ? PC.tag(label, { active: 'ok', deceased: 'evidence', unknown: 'caution' }[id])
      : PC.missing('STATUS NOT FOUND', id, '상태 분류가 없습니다.');
  }
  function certaintyTag(id) {
    const certainty = own(source()?.certainties, id);
    return certainty ? PC.tag(certainty.label, { listed: 'evidence', partial: 'info', unresolved: 'caution' }[id])
      : PC.missing('CERTAINTY NOT FOUND', id, '기록 판정이 없습니다.');
  }
  function kv(items) {
    return h('dl.tc-kv.tc-per-kv', null, items.filter(([, value]) => value).map(([term, value]) =>
      h('div', null, h('dt', { text: term }), h('dd', null, value))));
  }
  function section(code, title, ...body) {
    return h('section.tc-panel.tc-per-section', null,
      h('header.tc-panel-head', null, h('div', null, h('span.tc-label.tc-full-only', { text: code }), h('h2', { text: title }))),
      h('div.tc-panel-body.tc-per-copy', null, body));
  }
  function panel(code, title, hint, ...content) {
    const forced = typeof content.at(-1) === 'boolean' ? content.pop() : undefined;
    const open = forced ?? PC.density?.() === 'full';
    return h('details.tc-panel.tc-per-section', { open },
      h('summary.tc-panel-head', null, h('div', null,
        h('span.tc-label.tc-full-only', { text: code }), h('h2', null, title), h('p.tc-hint', { text: hint }))),
      h('div.tc-panel-body.tc-per-copy', null, content));
  }
  function linkGroup(title, entries) {
    if (!entries.length) return null;
    return h('section.tc-per-link-group', null, h('h3', { text: title }), ...entries.slice(0, 2),
      entries.length > 2 ? h('details.tc-disclosure.tc-per-more-links', null,
        h('summary', null, h('span', null, h('b', { text: '나머지 자료' }), h('span.tc-full-only.tc-label', { text: ` / ${entries.length - 2} FILES` }))),
        h('div.tc-disclosure-body', null, entries.slice(2))) : null);
  }
  function bullets(items) { return h('ul.tc-per-bullets', null, items.map((text) => h('li', { text }))); }
  function link(label, route, ...parts) { return h('a.tc-btn', { href: PC.href(route, ...parts) }, label); }
  function backLink() { return h('a.tc-btn', { href: PC.href('personnel'), dataset: { perBack: '' } }, '← 인물 명부'); }

  function recordRow(record) {
    return h('a.tc-row.tc-per-row', { href: PC.href('personnel', record.id), dataset: { perId: record.id } },
      h('span.tc-code.tc-per-roster-code.tc-full-only', { text: groupOf(record.group)?.code || record.group }),
      h('div.tc-per-row-name', null, h('b', { text: record.name }),
        (record.aliases || []).length ? h('span', { text: record.aliases.join(' · ') }) : null),
      h('div.tc-per-row-unit', null, h('span.tc-label.tc-full-only', { text: 'AFFILIATION' }), h('p.tc-per-row-role', { text: record.role }), h('p', { text: record.affiliationSummary || groupOf(record.group)?.label }),
        record.secondaryGroups?.length ? h('p', { text: record.secondaryGroups.map((id) => groupOf(id)?.label || id).join(' · ') }) : null),
      h('span.tc-row-meta', null, statusTag(record.status, record)),
      h('span.tc-row-go', { 'aria-hidden': 'true', text: '›' }));
  }
  function rosterRows(group, members) {
    const expanded = filtering() || expandedGroups.has(group.id) || PC.density?.() === 'full';
    const visible = expanded ? members : members.slice(0, initialGroupSize);
    const listId = `tc-per-group-${group.id}`;
    return [h('div.tc-rows', { id: listId }, visible.map(recordRow)),
      !filtering() && members.length > initialGroupSize ? h('button.tc-btn.tc-per-expand', {
        type: 'button', dataset: { perExpand: group.id }, 'aria-controls': listId, 'aria-expanded': String(expanded)
      }, expanded ? '처음 6명만 보기' : `나머지 ${members.length - initialGroupSize}명 보기`) : null];
  }
  function renderResults() {
    const records = filteredRecords();
    Object.values(rosterBodies || {}).forEach((body) => PC.clear(body));
    source().groups.forEach((group) => {
      // 부 소속 필터로 찾더라도 명부의 주 편제에 한 번만 싣는다.
      const members = records.filter((record) => !isAddition(record) && record.group === group.id);
      if (!members.length) return;
      rosterBodies.legacy.append(rosterFold(group, members, group.label, `${group.code} / PERSONNEL REGISTER`));
    });
    const added = records.filter(isAddition);
    if (added.length) {
      rosterBodies.addition.append(h('section.tc-per-roster-group.tc-per-roster-addition', null,
        h('p.tc-per-addition-intro', { text: source().additionIntro }),
        (source().additionGroups || []).map((group) => {
          const members = added.filter((record) => record.group === group.id);
          return members.length ? rosterFold(group, members, group.label, `${group.code} / ADDITIONAL REGISTER`) : null;
        })));
    }
    if (!records.length) rosterBodies.legacy.append(PC.missing('NO MATCHING PERSONNEL', state.query, '조건에 맞는 인물이 없습니다. 검색어나 상태·소속을 바꿔 보세요.'));
    const groupLabel = state.group === 'all' ? '전체 인물' : groupOf(state.group)?.label;
    const statusLabel = state.status === 'all' ? '' : ` · ${own(source().statuses, state.status)?.label}`;
    const shown = resultList.querySelectorAll('[data-per-id]').length;
    resultCount.textContent = `${records.length} / ${everyone().length}명 · ${groupLabel}${statusLabel}${state.query.trim() ? ` · “${state.query.trim()}”` : ''}${shown < records.length ? ` · ${shown}명 표시, 소속별로 더 볼 수 있습니다.` : ''}`;
    indexView.querySelectorAll('[data-per-group]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.perGroup === state.group)));
    indexView.querySelectorAll('[data-per-status]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.perStatus === state.status)));
    search.value = state.query;
    const hasLegacy = records.some((record) => !isAddition(record));
    const hasAddition = records.some(isAddition);
    if (hasAddition && !hasLegacy) rosterTabs?.set('addition');
    else if (hasLegacy && !hasAddition) rosterTabs?.set('legacy');
  }

  function rosterFold(group, members, title, code) {
    const expanded = filtering() || openGroups.has(group.id) || PC.density?.() === 'full';
    return h('details.tc-panel.tc-per-roster-fold', { open: expanded, dataset: { perFold: group.id } },
      h('summary.tc-panel-head', null, h('div', null,
        h('span.tc-label.tc-full-only', { text: code }), h('h2', { text: title }),
        h('p.tc-hint', { text: '이름을 선택하면 인물 파일이 열린다.' })),
        h('span.tc-code.tc-full-only', { text: `${members.length}명` })),
      h('div.tc-panel-body.tc-per-roster-body', null, rosterRows(group, members)));
  }

  function navigation(record) {
    const records = filteredRecords();
    const index = records.findIndex((item) => item.id === record.id);
    const previous = index > 0 ? records[index - 1] : null;
    const next = index >= 0 ? records[index + 1] : null;
    return h('nav.tc-per-navigation', { 'aria-label': '인물 파일 이동' }, backLink(),
      h('div.tc-btnrow', null,
        previous ? h('a.tc-btn', { href: PC.href('personnel', previous.id), rel: 'prev', 'aria-label': `이전 인물, ${previous.name}` }, '‹ 이전') : h('button.tc-btn', { type: 'button', disabled: true }, '‹ 이전'),
        next ? h('a.tc-btn', { href: PC.href('personnel', next.id), rel: 'next', 'aria-label': `다음 인물, ${next.name}` }, '다음 ›') : h('button.tc-btn', { type: 'button', disabled: true }, '다음 ›'),
        h('button.tc-btn', { type: 'button', dataset: { perCopy: '' } }, '직접 링크 복사')));
  }
  function photoPlate(record, visual = record.visual, former = false) {
    // 등록된 시각 자료가 있는 인물에게만 사진판을 만든다.
    if (!visual?.src) return null;
    const pair = /^([A-Z][A-Z\s/-]+)\s*\/\s*([가-힣].*)$/.exec(visual.label || '');
    return h('figure.tc-evidence.tc-per-photo', { class: former ? 'tc-per-photo--former' : null, 'data-record': record.id, 'data-dtg': visual.dtg, 'data-place': visual.place, 'data-coords': visual.coords },
      former ? h('h2.tc-per-photo-era', { text: visual.era }) : null,
      h('div.tc-evidence-media', null, PC.img(visual.src, { alt: visual.alt || record.name })),
      h('figcaption', null, h('b', null, pair ? [h('span.tc-full-only', { text: pair[1] + ' / ' }), h('span', { text: pair[2] })] : visual.label), h('span', { text: visual.caption })));
  }
  function affiliationSection(record) {
    const affiliations = record.affiliations || [];
    const known = new Set(affiliations.map((item) => item.key));
    const groupKeys = [...new Set(groupsOf(record).flatMap((id) => groupOf(id)?.factionKeys || []))].filter((key) => !known.has(key));
    const entries = [
      ...affiliations.map((item) => h('a.tc-per-connection', { href: PC.href('faction-info', item.key) },
        h('div.tc-per-tags', null, h('b', { text: item.label }), certaintyTag(item.certainty)), h('p', { text: item.role }))),
      ...groupKeys.map((key) => {
        const target = own(root.ProjectCurseFactionAnalysis?.factions, key);
        return target ? h('a.tc-per-connection', { href: PC.href('faction-info', key) }, h('b', { text: target.name }))
          : PC.missing('FACTION NOT FOUND', key, '소속 조직에 연결된 세력 문서가 없습니다.');
      })
    ];
    return h('section.tc-per-link-group', null, h('h3', { text: '소속과 연결 세력' }),
      h('p', { text: record.affiliationSummary }), ...entries.slice(0, 2),
      entries.length > 2 ? h('details.tc-disclosure.tc-per-more-links', null,
        h('summary', null, h('span', null, h('b', { text: '추가 소속 연결' }))),
        h('div.tc-disclosure-body', null, entries.slice(2))) : null);
  }
  function relationshipsSection(record) {
    if (!record.relationships?.length) return null;
    const entries = record.relationships.map((item) => {
      const target = person(item.target);
      return target ? h('a.tc-per-connection', { href: PC.href('personnel', target.id) },
        h('div.tc-per-tags', null, h('b', { text: target.name }), certaintyTag(item.certainty)), h('p', { text: item.relation }))
        : PC.missing('PERSONNEL NOT FOUND', item.target, item.relation);
    });
    return h('section.tc-per-link-group', null, h('h3', { text: '관계 인물' }), ...entries.slice(0, 2),
      entries.length > 2 ? h('details.tc-disclosure.tc-per-more-links', null,
        h('summary', null, h('span', null, h('b', { text: '나머지 관계 인물' }))),
        h('div.tc-disclosure-body', null, entries.slice(2))) : null);
  }

  function relatedRecords(record) {
    // 개인 사건 문자열을 다른 사건 id로 추측해 치환하지 않는다.
    // 기존 factionIndex의 역방향 연결로 세력 사건철을 제공하고, 개인의 직접 참여와 구분한다.
    const index = isAddition(record) ? (source().additionIndex || {}) : source().factionIndex;
    const keys = Object.entries(index).filter(([, ids]) => ids.includes(record.id)).map(([key]) => key);
    const network = root.ProjectCurseIncidentNetwork;
    const events = (network?.incidentList || []).filter((item) => item.factions.some((key) => keys.includes(key)));
    const mapped = new Set((root.ProjectCurseMapRoom?.markers || []).map((item) => item.incident));
    const operations = new Set((root.ProjectCurseMapRoom?.operations || []).map((item) => item.id));
    const archiveIds = [...new Set(events.flatMap((item) => item.records || []))];
    const archives = root.ProjectCurseArchive?.publicRecords || [];
    const eventCards = events.map((item) => {
      const links = [
        item.history ? link('연표 ↗', 'history', item.history) : null,
        mapped.has(item.id) ? link('지도 ↗', 'map-room', 'incident', item.id) : null,
        item.operation && operations.has(item.operation) ? link('작전 진행 ↗', 'map-room', 'op', item.operation) : null
      ].filter(Boolean);
      const linkSet = h('div.tc-btnrow', null, links.slice(0, 2), links.length > 2 ? h('details.tc-disclosure.tc-per-more-links', null,
        h('summary', null, h('span', null, h('b', { text: '추가 이동' }))), h('div.tc-disclosure-body', null, links.slice(2))) : null);
      return h('section.tc-per-event', null, h('time.tc-code.tc-full-only', { text: item.date }), h('h3', { text: item.title }), linkSet);
    });
    const archiveLinks = archiveIds.map((id) => {
      const target = archives.find((item) => item.id === id) || own(root.ProjectCurseArchiveDocuments?.documents, id);
      return target ? h('a.tc-per-connection', { href: PC.href('archive-entry', id) }, h('span.tc-code.tc-full-only', { text: id }), h('b', { text: target.title || id }))
        : PC.missing('ARCHIVE NOT FOUND', id, '연결된 기록의 목록 자료가 없습니다.');
    });
    return h('section.tc-per-link-group', null, h('h3', { text: '관련 사건·기록' }),
      record.incident ? kv([['인물 파일에 기록된 사건', record.incident]]) : null,
      h('div.tc-btnrow', null, link('세계 기록 목록 ↗', 'history')),
      events.length ? [h('h3', { text: '소속 세력의 사건 목록' }), h('p', { text: '소속 세력과 관련된 사건입니다. 이 인물이 직접 참여했는지는 각 기록에서 확인해 주세요.' }),
        ...eventCards.slice(0, 2), eventCards.length > 2 ? h('details.tc-disclosure.tc-per-more-links', null,
          h('summary', null, h('span', null, h('b', { text: '나머지 사건 기록' }))), h('div.tc-disclosure-body', null, eventCards.slice(2))) : null] : null,
      archiveLinks.length ? h('details.tc-disclosure.tc-per-crossref', { open: PC.density?.() === 'full' },
        h('summary', null, h('span', null, h('span.tc-label.tc-full-only', { text: 'ARCHIVE CROSS REFERENCE' }), h('b', { text: '연결 기록보관소' }), h('small.tc-hint', { text: '소속 세력의 사건철에 연결된 기록.' }))),
        h('div.tc-disclosure-body', null, archiveLinks.slice(0, 2), archiveLinks.length > 2 ? h('details.tc-disclosure.tc-per-more-links', null,
          h('summary', null, h('span', null, h('b', { text: '나머지 기록' }))), h('div.tc-disclosure-body', null, archiveLinks.slice(2))) : null)) : null);
  }

  function relatedConnections(record) {
    const sections = [affiliationSection(record), relationshipsSection(record), relatedRecords(record)].filter(Boolean);
    if (!sections.length) return null;
    return h('details.tc-disclosure.tc-per-connections-fold', { open: PC.density?.() === 'full' },
      h('summary', null, h('span', null, h('span.tc-label.tc-full-only', { text: 'RELATED DOSSIERS' }), h('b', { text: '관련 세력·인물·사건·기록' }),
        h('small.tc-hint', { text: '소속 확인, 관계 자료와 사건 연결을 포함한다.' }))),
      h('div.tc-disclosure-body.tc-per-related-stack', null, sections));
  }

  function renderDetail(id) {
    renderVersion += 1;
    PC.clear(detailView);
    delete detailView.dataset.perSelected;
    const record = person(id);
    if (!record) {
      detailView.append(backLink(), h('h1', { text: '인물 파일 없음', 'data-tc-focus': true }), PC.missing('PERSONNEL NOT FOUND', id, '이 명부에 해당하는 인물 파일이 없습니다.'));
      return '인물 파일 없음';
    }
    detailView.dataset.perSelected = id;
    const identity = record.identity;
    const identityAnomaly = display().identityAnomalies?.includes(id) && /기억|신원/.test(record.abilityCost || '');
    const openCanon = own(root.ProjectCurseOpenCanon?.personnel, id);
    const profileParts = [
      section('PROFILE / KEY RECORD', '주요 기록', h('p', { text: record.overview }),
        kv([['소속', record.unit], ['연결 사건', record.incident]])),
      (record.capabilities?.length || record.equipment?.length || record.abilitySource) ? panel('CAPABILITY / COST', '능력과 대가', '능력의 발현 경로와 확인된 대가, 장비 기록.',
        record.capabilities?.length ? h('div.tc-per-copy', null, h('h3', { text: '능력' }), bullets(record.capabilities)) : null,
        record.equipment?.length ? h('div.tc-per-copy', null, h('h3', { text: '장비' }), bullets(record.equipment)) : null,
        record.abilitySource ? kv([['발현 경로', record.abilitySource], ['확인된 대가', record.abilityCost || display().abilityCostMissing]]) : null) : null,
      identity ? panel('IDENTITY', '신원', '등록부의 신원 대조 항목.', kv([['성별', identity.sex], ['출생', identity.birth], ['2006년 당시 나이', identity.age], ['출신', identity.origin], ['국적·신분', identity.nationality], ['소속', record.affiliationSummary]])) : null
    ].filter(Boolean);
    const serviceHistory = h('ol.tc-per-chronology', null, (record.history || []).map(([date, text]) =>
      h('li', null, h('time.tc-code', { text: date }), h('span', { text }))));
    const serviceParts = [panel('BACKGROUND / SERVICE RECORD', '과거와 경력',
      record.background?.[0] || '배경 설명과 경력 연혁을 기록했다.',
      (record.background || []).map((text) => h('p', { text })), serviceHistory)];
    const additionalParts = [
      panel('DISPOSITION / FIELD NOTES', '성향과 추가 기록', '현장 기록과 추가 메모를 포함한다.',
        record.personality ? kv([['성향', record.personality.temperament], ['목표', record.personality.drive], ['두려움', record.personality.fear]]) : null,
        record.fieldNotes?.length ? h('section.tc-per-copy', null, h('h3', { text: '현장 기록' }), bullets(record.fieldNotes)) : null,
        record.notes?.length ? h('section.tc-per-copy', null, h('h3', { text: '추가 기록' }), bullets(record.notes)) : null),
      panel('RECORD LIMITS', h('span', null, '확인되지 않은 부분', record.limits?.length ? h('span.tc-full-only', { text: ` · ${record.limits.length}개` }) : null),
        '이 파일이 확정하지 않는 신원과 사건 범위를 적었다.',
        h('aside.tc-note.tc-note--caution.tc-per-limits', null, h('b', { text: '확인되지 않은 부분' }), bullets(record.limits?.length ? record.limits : [display().limitDefault])))
    ];
    if (Array.isArray(openCanon) && openCanon.length) additionalParts.push(panel('OPEN INTERPRETATION', '자유 해석', '확인되지 않은 해석 메모.',
      h('ul.tc-per-bullets', null, openCanon.map((text) => h('li', null, PC.openCanon?.(text) ?? h('span', { text }))))));
    const dossierTabs = PC.tabs({ id: 'tc-per-dossier', label: '인물 파일 갈래', active: 'profile', items: [
      { id: 'profile', title: '주요 기록', hint: '인물 정보와 핵심 판정.', body: h('div.tc-per-dossier-stack', null, profileParts) },
      { id: 'service', title: '과거·경력', hint: '경력 설명과 사건 연혁.', body: h('div.tc-per-dossier-stack', null, serviceParts) },
      { id: 'connections', title: '연결 자료', hint: '관련 세력·인물·사건·기록.', body: h('div.tc-per-dossier-stack', null, relatedConnections(record)) },
      { id: 'additional', title: '추가 기록·한계', hint: '미확인 범위와 추가 메모 포함.', body: h('div.tc-per-dossier-stack', null, additionalParts) }
    ] });
    PC.append(detailView, [navigation(record),
      h('div.tc-per-copy-feedback', { role: 'status', 'aria-live': 'polite' }),
      h('div.tc-per-dossier', null,
      h('header.tc-panel.tc-bracket.tc-bracket--evidence.tc-per-cover', null,
        h('div.tc-per-cover-main', null,
          h('p.tc-label.tc-full-only', { text: `PERSONNEL FILE / ${record.registerYear || display().year}` }),
          h('p.tc-code.tc-full-only', { text: record.id }),
          h('h1', { text: '인물 파일', 'data-tc-focus': true }),
          h('p.tc-per-name', null, h('span', { text: record.name, 'data-tc-anomaly': identityAnomaly ? 'name' : null })), h('p', { text: record.role }),
          h('div.tc-per-tags', null, statusTag(record.status, record), certaintyTag(record.certainty)),
          record.aliases?.length ? kv([['별칭·기존 명부명', record.aliases.join(' · ')]]) : null),
        // 지난 모습이 있는 파일만 묶는다. 나머지 파일의 사진판과 배치는 그대로 둔다.
          record.formerVisual?.src ? h('div.tc-per-photos', null, photoPlate(record), photoPlate(record, record.formerVisual, true)) : photoPlate(record),
          kv([['기준 연도', record.registerYear || display().year], ['등록', isAddition(record) ? source().additionLabel : null], ['조직', groupOf(record.group)?.label || record.group], ['소속', record.affiliationSummary], ['출신', identity?.origin]])),
      dossierTabs.tablist, ...dossierTabs.panels), h('nav.tc-btnrow', { 'aria-label': '인물 명부 복귀' }, backLink())]);
    return record.name;
  }

  async function copyLink() {
    if (!person(selected)) return;
    const version = renderVersion;
    const url = new URL(root.location.href);
    url.hash = PC.href('personnel', selected).slice(1);
    let copied = false;
    try { await root.navigator.clipboard.writeText(url.href); copied = true; } catch (_error) { /* 읽기 전용 주소란 제공 */ }
    if (!active || version !== renderVersion) return;
    const feedback = detailView.querySelector('.tc-per-copy-feedback');
    PC.clear(feedback);
    if (copied) feedback.append(h('p', { text: '링크가 복사되었습니다.' }));
    else {
      const input = h('input.tc-per-link-input', { type: 'text', readonly: true, value: url.href, 'aria-label': '인물 직접 링크' });
      feedback.append(h('p', { text: '아래 주소를 복사해 주세요.' }), input);
      input.focus(); input.select();
    }
  }
  function onInput(event) {
    if (event.target !== search) return;
    state.query = search.value;
    renderResults();
  }
  function onClick(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.target.closest('[data-per-back]')) { event.preventDefault(); PC.back('personnel'); return; }
    if (event.target.closest('[data-per-copy]')) { copyLink(); return; }
    const expand = event.target.closest('[data-per-expand]');
    if (expand) {
      const id = expand.dataset.perExpand;
      if (expandedGroups.has(id)) expandedGroups.delete(id); else expandedGroups.add(id);
      renderResults();
      [...resultList.querySelectorAll('[data-per-expand]')].find((button) => button.dataset.perExpand === id)?.focus({ preventScroll: true });
      root.PCAudio?.cue('archive.filter');
      return;
    }
    const group = event.target.closest('[data-per-group]');
    const status = event.target.closest('[data-per-status]');
    if (group) state.group = group.dataset.perGroup;
    if (status) state.status = status.dataset.perStatus;
    if (event.target.closest('[data-per-reset]')) { state.query = ''; state.group = 'all'; state.status = 'all'; }
    if (group || status || event.target.closest('[data-per-reset]')) { renderResults(); root.PCAudio?.cue('archive.filter'); }
  }
  function onToggle(event) {
    const fold = event.target.closest?.('[data-per-fold]');
    if (!fold || !host.contains(fold)) return;
    if (fold.open) openGroups.add(fold.dataset.perFold); else openGroups.delete(fold.dataset.perFold);
  }
  function mount(el) {
    host = el;
    indexView = h('div.tc-per-index');
    detailView = h('article.tc-per-detail', { hidden: true });
    host.append(indexView, detailView);
    if (!source()?.records || !display()) {
      indexView.append(PC.missing('PERSONNEL DATA MISSING', 'ProjectCursePersonnel / ProjectCursePersonnelDisplay', '인물 명부 데이터를 불러오지 못했습니다.'));
      return;
    }
    search = h('input#tc-per-search', { type: 'search', autocomplete: 'off', placeholder: '이름 / 소속 / 역할', 'aria-controls': 'tc-per-results' });
    resultCount = h('p.tc-per-result-count.tc-full-only', { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' });
    const allGroups = [...source().groups, ...(source().additionGroups || [])];
    rosterBodies = { legacy: h('div.tc-per-register-list'), addition: h('div.tc-per-register-list') };
    rosterTabs = PC.tabs({ id: 'tc-per-index', label: '인물 명부 기준', active: 'legacy', items: [
      { id: 'legacy', title: `${display().year}년 명부`, hint: '2006년 당시의 인물 등록.', body: rosterBodies.legacy },
      { id: 'addition', title: '추가 등록', hint: '별도 기준 연도로 등록한 인물.', body: rosterBodies.addition }
    ] });
    resultList = h('div#tc-per-results.tc-per-results', null, rosterTabs.tablist, ...rosterTabs.panels);
    const head = PC.screenHead('personnel', { desc: display().intro, meta: [['REGISTER', additions().length ? `${display().year} · ${source().additionLabel}` : display().year], ['FILES', `${everyone().length}`], ['GROUPS', `${allGroups.length}`]] });
    head.querySelector('.tc-screenhead-code')?.classList.add('tc-full-only');
    head.querySelector('.tc-screenhead-meta')?.classList.add('tc-full-only');
    indexView.append(head,
      h('section.tc-panel.tc-per-controls', { 'aria-label': '인물 기록 검색과 필터' },
        h('div.tc-per-search-row', null, h('label.tc-per-search', { for: 'tc-per-search' }, h('span', { text: '인물 검색' }), search), h('button.tc-btn', { type: 'button', dataset: { perReset: '' } }, '필터 초기화')),
        // 두 명부를 함께 거르므로 연도 없는 일반 상태 문구를 쓴다.
        h('div.tc-seg', { role: 'group', 'aria-label': '상태 필터' }, [['all', '전체 상태'], ...Object.entries(source().statuses).map(([id, item]) => [id, item.label])].map(([id, label]) =>
          h('button', { type: 'button', 'aria-pressed': String(id === state.status), dataset: { perStatus: id } }, label)))),
      h('div.tc-per-workspace', null,
        h('div.tc-per-roster', null, resultCount, resultList),
        h('details.tc-disclosure.tc-per-groups', { open: PC.density?.() === 'full' },
          h('summary', null, h('span', null, h('b', { text: '소속과 관계 필터' }), h('small.tc-hint', { text: '편제와 추가 등록 소속을 골라 본다.' }))),
          h('div.tc-disclosure-body', null, h('div.tc-per-group-buttons', { role: 'group', 'aria-label': '소속과 관계' },
            h('button.tc-per-group-button', { type: 'button', 'aria-pressed': 'true', dataset: { perGroup: 'all' } }, h('span', { text: '전체 명부' }), h('b.tc-full-only', { text: `${everyone().length}` })),
            allGroups.map((group) => h('button.tc-per-group-button', { type: 'button', 'aria-pressed': 'false', dataset: { perGroup: group.id }, title: group.label },
              h('span', { text: group.label }), h('b.tc-full-only', { text: `${everyone().filter((record) => groupsOf(record).includes(group.id)).length}` }))))))));
    renderResults();
  }
  function onMotion() { host.dataset.perFx = reducedFx() ? 'reduced' : 'full'; }
  function show(parts, app, info = {}) {
    root.cancelAnimationFrame(restoreFrame);
    const id = parts.length > 1 ? parts.join('/') : parts[0];
    if (active && onIndex && id) indexScroll = root.scrollY;
    const restoring = !id && (!onIndex || !active) && info.reason !== 'initial';
    onIndex = !id;
    selected = id || '';
    indexView.hidden = !!id;
    detailView.hidden = !id;
    app.setTitle(id ? renderDetail(id) : '인물 기록');
    listeners?.abort();
    listeners = new AbortController();
    host.addEventListener('click', onClick, { signal: listeners.signal });
    host.addEventListener('input', onInput, { signal: listeners.signal });
    host.addEventListener('toggle', onToggle, { signal: listeners.signal, capture: true });
    root.document.addEventListener('pc:fx', onMotion, { signal: listeners.signal });
    motionQuery?.addEventListener?.('change', onMotion, { signal: listeners.signal });
    onMotion();
    active = true;
    if (restoring) restoreFrame = root.requestAnimationFrame(() => root.scrollTo(0, indexScroll));
  }
  function hide() {
    if (onIndex) indexScroll = root.scrollY;
    active = false;
    renderVersion += 1;
    listeners?.abort();
    root.cancelAnimationFrame(restoreFrame);
  }
  PC.screen({ id: 'personnel', mount, show, hide });
})(window);
