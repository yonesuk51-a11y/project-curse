// Project Curse 6 — 2006년 인물 명부와 파일 (담당: Codex)
// profiles/remake를 재조립하지 않는다. personnel-data.js가 확정한 표시 결과를 그대로 읽는다.
(function (root) {
  'use strict';
  const PC = root.PCApp;
  const { h } = PC;
  const source = () => root.ProjectCursePersonnel;
  const display = () => root.ProjectCursePersonnelDisplay;
  const own = (object, key) => object && Object.hasOwn(object, key) ? object[key] : null;
  const groupOf = (id) => own(source()?.groupById, id);
  const person = (id) => own(source()?.byId, id);
  const groupsOf = (record) => [record.group, ...(record.secondaryGroups || [])];
  const normalize = (value) => String(value ?? '').toLocaleLowerCase('ko-KR').replace(/[.·_\-\s]/g, '');
  const state = { query: '', group: 'all', status: 'all' };
  let host, indexView, detailView, resultList, resultCount, search, listeners;
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
    return (source()?.records || []).filter((record) =>
      (state.group === 'all' || groupsOf(record).includes(state.group)) &&
      (state.status === 'all' || record.status === state.status) && (!query || searchText(record).includes(query)));
  }
  function statusTag(id) {
    const label = own(display()?.statusLabels, id);
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
      h('header.tc-panel-head', null, h('div', null, h('span.tc-label', { text: code }), h('h2', { text: title }))),
      h('div.tc-panel-body.tc-per-copy', null, body));
  }
  function bullets(items) { return h('ul.tc-per-bullets', null, items.map((text) => h('li', { text }))); }
  function link(label, route, ...parts) { return h('a.tc-btn', { href: PC.href(route, ...parts) }, label); }
  function backLink() { return h('a.tc-btn', { href: PC.href('personnel'), dataset: { perBack: '' } }, '← 인물 명부'); }

  function recordRow(record) {
    return h('a.tc-row.tc-per-row', { href: PC.href('personnel', record.id), dataset: { perId: record.id } },
      h('span.tc-code.tc-per-roster-code', { text: groupOf(record.group)?.code || record.group }),
      h('div.tc-per-row-name', null, h('b', { text: record.name }),
        (record.aliases || []).length ? h('span', { text: record.aliases.join(' · ') }) : null,
        h('p', { text: record.role })),
      h('div.tc-per-row-unit', null, h('span.tc-label', { text: 'AFFILIATION' }), h('p', { text: record.affiliationSummary || groupOf(record.group)?.label }),
        record.secondaryGroups?.length ? h('p', { text: record.secondaryGroups.map((id) => groupOf(id)?.label || id).join(' · ') }) : null),
      h('span.tc-row-meta', null, statusTag(record.status)),
      h('span.tc-row-go', { 'aria-hidden': 'true', text: '›' }));
  }
  function renderResults() {
    const records = filteredRecords();
    PC.clear(resultList);
    source().groups.forEach((group) => {
      // 부 소속 필터로 찾더라도 명부의 주 편제에 한 번만 싣는다.
      const members = records.filter((record) => record.group === group.id);
      if (!members.length) return;
      resultList.append(h('section.tc-per-roster-group', null,
        h('header.tc-section-head', null, h('div', null, h('span.tc-label', { text: `${group.code} / PERSONNEL REGISTER` }), h('h2', { text: group.label })), h('span.tc-code', { text: `${members.length}명` })),
        h('div.tc-rows', null, members.map(recordRow))));
    });
    if (!records.length) resultList.append(PC.missing('NO MATCHING PERSONNEL', state.query, '조건에 맞는 인물 파일이 없습니다. 검색어나 상태·소속 필터를 조정하십시오.'));
    const groupLabel = state.group === 'all' ? '전체 인물' : groupOf(state.group)?.label;
    const statusLabel = state.status === 'all' ? '' : ` · ${display().statusLabels[state.status]}`;
    resultCount.textContent = `${records.length} / ${source().records.length}명 · ${groupLabel}${statusLabel}${state.query.trim() ? ` · “${state.query.trim()}”` : ''}`;
    indexView.querySelectorAll('[data-per-group]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.perGroup === state.group)));
    indexView.querySelectorAll('[data-per-status]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.perStatus === state.status)));
    search.value = state.query;
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
  function photoPlate(record) {
    // 현재 56명에는 사진 자료가 없다. 등록된 시각 자료가 생겼을 때만 사진판을 만든다.
    const visual = record.visual;
    if (!visual?.src) return null;
    return h('figure.tc-evidence.tc-per-photo', null,
      h('img', { src: visual.src, alt: visual.alt || record.name, loading: 'lazy', decoding: 'async' }),
      h('figcaption', null, h('b', { text: visual.label }), h('span', { text: visual.caption })));
  }
  function affiliationSection(record) {
    const affiliations = record.affiliations || [];
    const known = new Set(affiliations.map((item) => item.key));
    const groupKeys = [...new Set(groupsOf(record).flatMap((id) => groupOf(id)?.factionKeys || []))].filter((key) => !known.has(key));
    return section('AFFILIATION', '소속과 연결 세력',
      h('p', { text: record.affiliationSummary }),
      affiliations.map((item) => h('a.tc-per-connection', { href: PC.href('faction-info', item.key) },
        h('div.tc-per-tags', null, h('b', { text: item.label }), certaintyTag(item.certainty)), h('p', { text: item.role }))),
      groupKeys.map((key) => {
        const target = own(root.ProjectCurseFactionAnalysis?.factions, key);
        return target ? h('a.tc-per-connection', { href: PC.href('faction-info', key) }, h('b', { text: target.name }))
          : PC.missing('FACTION NOT FOUND', key, '소속 편제에 연결된 세력 문서가 없습니다.');
      }));
  }
  function relationshipsSection(record) {
    if (!record.relationships?.length) return null;
    return section('RELATIONS', '관계 인물', h('ul.tc-per-connections', null, record.relationships.map((item) => {
      const target = person(item.target);
      return h('li', null, target ? h('a.tc-per-connection', { href: PC.href('personnel', target.id) },
        h('div.tc-per-tags', null, h('b', { text: target.name }), certaintyTag(item.certainty)), h('p', { text: item.relation }))
        : PC.missing('PERSONNEL NOT FOUND', item.target, item.relation));
    })));
  }

  function relatedRecords(record) {
    // 개인 사건 문자열을 다른 사건 id로 추측해 치환하지 않는다.
    // 기존 factionIndex의 역방향 연결로 세력 사건철을 제공하고, 개인의 직접 참여와 구분한다.
    const keys = Object.entries(source().factionIndex).filter(([, ids]) => ids.includes(record.id)).map(([key]) => key);
    const network = root.ProjectCurseIncidentNetwork;
    const events = (network?.incidentList || []).filter((item) => item.factions.some((key) => keys.includes(key)));
    const mapped = new Set((root.ProjectCurseMapRoom?.markers || []).map((item) => item.incident));
    const operations = new Set((root.ProjectCurseMapRoom?.operations || []).map((item) => item.id));
    const archiveIds = [...new Set(events.flatMap((item) => item.records || []))];
    const archives = root.ProjectCurseArchive?.publicRecords || [];
    return section('CROSS REFERENCE', '관련 사건·기록',
      record.incident ? kv([['인물 파일에 기재된 사건', record.incident]]) : null,
      h('div.tc-btnrow', null, link('세계 기록 색인 ↗', 'history')),
      events.length ? h('details.tc-disclosure.tc-per-crossref', null,
        h('summary', null, h('span', null, h('span.tc-label', { text: 'AFFILIATION CROSS REFERENCE' }), h('b', { text: '소속 세력의 사건 색인' }))),
        h('div.tc-disclosure-body.tc-per-copy', null,
          h('p', { text: '소속 세력으로 연결한 사건철입니다. 이 인물의 직접 참여 여부는 각 기록에서 확인하십시오.' }),
          events.map((item) => h('section.tc-per-event', null, h('time.tc-code', { text: item.date }), h('h3', { text: item.title }),
            h('div.tc-btnrow', null,
              item.history ? link('연표 ↗', 'history', item.history) : null,
              mapped.has(item.id) ? link('지도 ↗', 'map-room', 'incident', item.id) : null,
              item.operation && operations.has(item.operation) ? link('작전 경과 ↗', 'map-room', 'op', item.operation) : null))),
          archiveIds.length ? h('div.tc-per-copy', null, h('h3', { text: '연결 기록보관소' }), archiveIds.map((id) => {
            const target = archives.find((item) => item.id === id) || own(root.ProjectCurseArchiveDocuments?.documents, id);
            return target ? h('a.tc-per-connection', { href: PC.href('archive-entry', id) }, h('span.tc-code', { text: id }), h('b', { text: target.title || id }))
              : PC.missing('ARCHIVE NOT FOUND', id, '연결된 기록의 색인 자료가 없습니다.');
          })) : null)) : null);
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
    PC.append(detailView, [navigation(record),
      h('div.tc-per-copy-feedback', { role: 'status', 'aria-live': 'polite' }),
      h('header.tc-panel.tc-bracket.tc-bracket--evidence.tc-per-cover', null,
        h('div.tc-per-cover-main', null,
          h('p.tc-label', { text: `PERSONNEL FILE / ${display().year}` }),
          h('p.tc-code', { text: record.id }),
          h('h1', { text: record.name, 'data-tc-focus': true }), h('p', { text: record.role }),
          h('div.tc-per-tags', null, statusTag(record.status), certaintyTag(record.certainty)),
          record.aliases?.length ? kv([['별칭·기존 명부명', record.aliases.join(' · ')]]) : null),
        photoPlate(record),
        kv([['기준 연도', display().year], ['편제', groupOf(record.group)?.label || record.group], ['소속', record.affiliationSummary], ['출신', identity?.origin]])),
      section('PROFILE / KEY RECORD', '주요 기록', h('p', { text: record.overview }),
        kv([['소속', record.unit], ['연결 사건', record.incident]])),
      (record.capabilities?.length || record.equipment?.length || record.abilitySource) ? section('CAPABILITY / COST', '능력과 대가',
        record.capabilities?.length ? h('div.tc-per-copy', null, h('h3', { text: '능력' }), bullets(record.capabilities)) : null,
        record.equipment?.length ? h('div.tc-per-copy', null, h('h3', { text: '장비' }), bullets(record.equipment)) : null,
        record.abilitySource ? kv([['발현 경로', record.abilitySource], ['확인된 대가', record.abilityCost || display().abilityCostMissing]]) : null) : null,
      identity ? section('IDENTITY', '신원', kv([['성별', identity.sex], ['출생', identity.birth], ['2006년 당시 나이', identity.age], ['출신', identity.origin], ['국적·신분', identity.nationality], ['소속', record.affiliationSummary]])) : null,
      section('BACKGROUND / SERVICE RECORD', '과거와 경력',
        (record.background || []).map((text) => h('p', { text })),
        h('ol.tc-per-chronology', null, (record.history || []).map(([date, text]) => h('li', null, h('time.tc-code', { text: date }), h('span', { text }))))),
      affiliationSection(record), relationshipsSection(record),
      h('details.tc-disclosure', null,
        h('summary', null, h('span', null, h('span.tc-label', { text: 'DISPOSITION / FIELD NOTES' }), h('b', { text: '성향과 추가 기록' }))),
        h('div.tc-disclosure-body.tc-per-copy', null,
          record.personality ? kv([['성향', record.personality.temperament], ['목표', record.personality.drive], ['두려움', record.personality.fear]]) : null,
          record.fieldNotes?.length ? h('section.tc-per-copy', null, h('h3', { text: '현장 기록' }), bullets(record.fieldNotes)) : null,
          record.notes?.length ? h('section.tc-per-copy', null, h('h3', { text: '추가 기록' }), bullets(record.notes)) : null)),
      h('aside.tc-note.tc-note--caution.tc-per-limits', null, h('b', { text: '확인되지 않은 부분' }), bullets(record.limits?.length ? record.limits : [display().limitDefault])),
      relatedRecords(record), h('nav.tc-btnrow', { 'aria-label': '인물 명부 복귀' }, backLink())]);
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
      feedback.append(h('p', { text: '주소를 선택해 복사하십시오.' }), input);
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
    const group = event.target.closest('[data-per-group]');
    const status = event.target.closest('[data-per-status]');
    if (group) state.group = group.dataset.perGroup;
    if (status) state.status = status.dataset.perStatus;
    if (event.target.closest('[data-per-reset]')) { state.query = ''; state.group = 'all'; state.status = 'all'; }
    if (group || status || event.target.closest('[data-per-reset]')) renderResults();
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
    resultCount = h('p.tc-per-result-count', { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' });
    resultList = h('div#tc-per-results.tc-per-results');
    indexView.append(PC.screenHead('personnel', { desc: display().intro, meta: [['REGISTER', display().year], ['FILES', `${source().records.length}`], ['GROUPS', `${source().groups.length}`]] }),
      h('section.tc-panel.tc-per-controls', { 'aria-label': '인물 기록 검색과 필터' },
        h('div.tc-per-search-row', null, h('label.tc-per-search', { for: 'tc-per-search' }, h('span', { text: '인물 검색' }), search), h('button.tc-btn', { type: 'button', dataset: { perReset: '' } }, '필터 초기화')),
        h('div.tc-seg', { role: 'group', 'aria-label': '상태 필터' }, [['all', '전체 상태'], ...Object.entries(display().statusLabels)].map(([id, label]) =>
          h('button', { type: 'button', 'aria-pressed': String(id === state.status), dataset: { perStatus: id } }, label)))),
      h('div.tc-per-workspace', null,
        h('aside.tc-panel.tc-per-groups', { 'aria-label': '소속 분류 필터' },
          h('header.tc-panel-head', null, h('div', null, h('span.tc-label', { text: 'CLASSIFICATION' }), h('h2', { text: '소속·관계군' }))),
          h('div.tc-per-group-buttons', { role: 'group', 'aria-label': '소속·관계군' },
            h('button.tc-per-group-button', { type: 'button', 'aria-pressed': 'true', dataset: { perGroup: 'all' } }, h('span', { text: '전체 명부' }), h('b', { text: `${source().records.length}` })),
            source().groups.map((group) => h('button.tc-per-group-button', { type: 'button', 'aria-pressed': 'false', dataset: { perGroup: group.id }, title: group.label },
              h('span', { text: group.short }), h('b', { text: `${source().records.filter((record) => groupsOf(record).includes(group.id)).length}` }))))),
        h('div.tc-per-roster', null, resultCount, resultList)));
    renderResults();
  }
  function show(parts, app, info) {
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
