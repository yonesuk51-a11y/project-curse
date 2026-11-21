// Project Curse 6 — 세력 편제표와 분석 문서 (담당: Codex)
// 본문은 ProjectCurseFactionAnalysis, 표지는 등록부, 계통은 별도 판정 자료에서 읽는다.
(function (root) {
  'use strict';
  const PC = root.PCApp;
  const { h } = PC;
  const source = () => root.ProjectCurseFactionAnalysis;
  const display = () => root.ProjectCurseFactionDisplay;
  const lineage = () => root.ProjectCurseFactionLineage;
  const own = (object, key) => object && Object.hasOwn(object, key) ? object[key] : null;
  // 현재 등록부 키 11개는 분석 키와 일치한다. 별칭을 추측하거나 다른 문서로 대체하지 않는다.
  const faction = (key) => own(source()?.factions, key);
  const canon = (key) => own(root.ProjectCurseCanon?.factions, key);
  const node = (key) => own(lineage()?.nodes, key);
  const incidents = (key) => (root.ProjectCurseIncidentNetwork?.incidentList || []).filter((item) => item.factions.includes(key));
  const relationTone = (label) => /적대|상충|충돌|결별|이단/.test(label) ? 'danger' : /미확정|미확인|주장|감시/.test(label) ? 'caution' : 'info';
  const stateTone = (key) => ({ confirmed: 'ok', disputed: 'danger', split: 'caution', exception: 'occult' })[key];
  const firstSentence = (value) => String(value || '').trim().match(/^.*?[.!?。](?:\s|$)/)?.[0].trim() || value;
  const threatLevels = { CRITICAL: 'critical', HIGH: 'high', ELEVATED: 'elevated', GUARDED: 'guarded', LOW: 'low' };
  // 신원 불명 근거가 있는 사람만 대상으로 삼는다. 단순한 행방 불명은 제외한다.
  const uncertainIdentity = person => person.certainty === 'unresolved' || (person.limits || []).some(text => /본명.*확인되지|육체의 신원/.test(text));

  let host, indexView, detailView, count, listeners, indexTabs, groupBodies;
  let filter = 'all', active = false, onIndex = true, indexScroll = 0, restoreFrame = 0;

  function tagsFor(key) {
    const tags = root.ProjectCurseCanon?.factionTags?.[key];
    return tags || (node(key) ? ['cult'] : []);
  }
  function classification(key) {
    return canon(key)?.cat || node(key)?.kind || '분류 미등록';
  }
  function link(label, route, ...parts) {
    return h('a.tc-btn', { href: PC.href(route, ...parts) }, label);
  }
  function factionName(key, name) {
    const roleLabel = faction(key)?.roleLabel;
    return [name, roleLabel ? h('span.tc-fac-role', { text: ` ${roleLabel}` }) : null];
  }
  function section(code, title, ...body) {
    return h('section.tc-panel.tc-fac-section', null,
      h('header.tc-panel-head', null, h('div', null, h('span.tc-label.tc-full-only', { text: code }), h('h2', { text: title }))),
      h('div.tc-panel-body.tc-fac-copy', null, body));
  }
  function panel(code, title, hint, ...content) {
    const forced = typeof content.at(-1) === 'boolean' ? content.pop() : undefined;
    const open = forced ?? PC.density?.() === 'full';
    return h('details.tc-panel.tc-fac-section', { open },
      h('summary.tc-panel-head', null, h('div', null,
        h('span.tc-label.tc-full-only', { text: code }), h('h2', { text: title }), h('p.tc-hint', { text: hint }))),
      h('div.tc-panel-body.tc-fac-copy', null, content));
  }
  const groupKey = label => String(label).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  function linkGroup(title, entries) {
    if (!entries.length) return null;
    return h('section.tc-fac-link-group', null, h('h3', { text: title }),
      ...entries.slice(0, 2),
      entries.length > 2 ? h('details.tc-disclosure.tc-fac-more-links', null,
        h('summary', null, h('span', null, h('b', { text: '나머지 자료' }), h('span.tc-full-only.tc-label', { text: ` / ${entries.length - 2} FILES` }))),
        h('div.tc-disclosure-body', null, entries.slice(2))) : null);
  }
  function kv(items) {
    return h('dl.tc-kv.tc-fac-kv', null, items.filter(([, value]) => value).map(([term, value]) =>
      h('div', null, h('dt', { text: term }), h('dd', null, value))));
  }
  function paragraphs(items) { return items.map((text) => h('p', { text })); }
  function displayLabel(text) {
    const parts = String(text || '').match(/^([A-Z\d ._-]+)\s*\/\s*(.*[가-힣].*)$/);
    return parts ? [h('span.tc-full-only', { text: `${parts[1]} / ` }), parts[2]] : text;
  }
  function backLink() {
    return h('a.tc-btn', { href: PC.href('faction-info'), dataset: { facBack: '' } }, '← 세력 목록');
  }

  function markBoard(key, compact = false) {
    const mark = own(root.ProjectCurseFactionMarks?.marks, key);
    if (!mark) return PC.missing('MARK NOT FOUND', key, '문양 등록 자료가 없습니다.');
    // 번호는 source.order의 표시 순번이다. 새 회수 번호나 회수 위치를 설정으로 만들지 않는다.
    const number = String(source().order.indexOf(key) + 1).padStart(2, '0');
    return h('figure.tc-evidence.tc-fac-mark', { class: compact ? 'tc-fac-mark--compact' : null },
      h('div.tc-fac-mark-image', null, mark.asset ? h('span.tc-code.tc-full-only', { text: `MARK / ${number}` }) : null,
        mark.asset
          ? h('img', { src: mark.asset, alt: `${faction(key).name} 문양`, loading: 'lazy', decoding: 'async', width: 160, height: 160, 'data-tc-inspect': compact ? null : '' })
          : h('div.tc-fac-mark-empty', { role: 'img', 'aria-label': '휘장 미등록', text: '휘장 미등록' })),
      h('figcaption', null,
        PC.tag(mark.asset ? `감식 ${mark.confidence}` : '휘장 미등록', mark.asset && mark.confidence === 'A' ? 'evidence' : 'caution'),
        compact ? null : h('span', { text: mark.source })));
  }

  function indexRow(key) {
    const item = faction(key);
    if (!item) return PC.missing('FACTION NOT FOUND', key, '목록에 연결된 세력 문서가 없습니다.');
    return h('a.tc-row.tc-fac-row', { href: PC.href('faction-info', key), dataset: { facKey: key } },
      markBoard(key, true),
      h('div.tc-fac-row-copy', null,
        h('div.tc-fac-tags', null, h('h3', null, factionName(key, item.name)), PC.tag(classification(key), node(key) ? 'occult' : 'info')),
        h('p', { text: item.lead }),
        h('p.tc-fac-index-status', { text: firstSentence(item.assessment?.status) })),
      h('span.tc-row-go', { 'aria-hidden': 'true', text: '›' }));
  }

  function renderRows() {
    let total = 0;
    let firstMatch = '';
    (source()?.groups || []).forEach((group) => {
      const keys = group.keys.filter((key) => filter === 'all' || tagsFor(key).includes(filter));
      total += keys.length;
      const key = groupKey(group.label);
      if (keys.length) firstMatch ||= key;
      const body = groupBodies?.[key];
      if (!body) return;
      PC.clear(body);
      if (keys.length) body.append(...keys.map(indexRow));
    });
    count.textContent = `${total} / ${source()?.order.length || 0}개 문서`;
    if (!total) { groupBodies?.[groupKey(source()?.groups?.[0]?.label)]?.append(PC.missing('NO MATCHING FILES', filter, '선택한 분류에 해당하는 세력 문서가 없습니다.')); indexTabs?.set(groupKey(source()?.groups?.[0]?.label)); }
    else if (firstMatch && !source()?.groups?.some(group => groupKey(group.label) === indexTabs?.get?.() && group.keys.some(key => filter === 'all' || tagsFor(key).includes(filter)))) indexTabs?.set(firstMatch);
    indexView.querySelectorAll('[data-fac-filter]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.facFilter === filter)));
  }

  function markAnalysis(key) {
    const mark = own(root.ProjectCurseFactionMarks?.marks, key);
    if (!mark) return PC.missing('MARK NOT FOUND', key, '문양 감식 자료가 없습니다.');
    return h('details.tc-disclosure.tc-fac-analysis', { open: PC.density?.() === 'full' },
      h('summary', null, h('span', null, h('span.tc-label.tc-full-only', { text: 'INSIGNIA / AUTHENTICATION' }), h('b', { text: mark.asset ? '문양 감식' : '휘장 미등록' }), h('small.tc-hint', { text: mark.asset ? '등록 표식과 감식 근거를 확인한다.' : '휘장 자료와 상징은 아직 등록되지 않았다.' }))),
      h('div.tc-disclosure-body.tc-fac-copy', null,
        kv([['종류', mark.type], ['처음 확인', mark.firstSeen], ['사용 방식', mark.usage], ['등록본', mark.assetState]]),
        mark.symbols?.length
          ? h('ol.tc-fac-symbols', null, mark.symbols.map((item) => h('li', null, h('b', { text: item.label }), h('p', { text: item.text }))))
          : h('p.tc-fac-unregistered', { text: '휘장 미등록. 등록된 도형과 상징이 없다.' }),
        mark.note ? h('aside.tc-note.tc-note--caution', null, h('b', { text: '주의' }), h('p.tc-fac-prose', { text: mark.note })) : null));
  }

  function historyRecord(id) {
    const data = root.ProjectCurseWorldHistoryData;
    return data?.getRecord?.(id) || root.ProjectCurseWorldHistoryCore?.records?.find((item) => item.id === id)
      || root.ProjectCurseJapanTechnology?.records?.find((item) => item.id === id);
  }

  function lineageSection(key) {
    const current = node(key);
    if (!current) return null;
    const data = lineage();
    return h('section.tc-fac-copy.tc-fac-lineage', null,
      h('h3', { text: '교단 갈래' }),
      h('div.tc-fac-tags', null, PC.tag(data.states[current.state].label, stateTone(current.state)), h('b', { text: current.kind })),
      h('p.tc-fac-command', { text: current.command }), h('p', { text: current.summary }),
      h('ul.tc-fac-lineage-nodes', { 'aria-label': '우시노다 갈래 목록' }, data.order.map((id) => h('li', null,
        h('a.tc-fac-connection', { href: PC.href('faction-info', id), 'aria-current': id === key ? 'page' : null },
          h('b', null, factionName(id, data.nodes[id].name)), h('span', { text: data.nodes[id].short }), PC.tag(data.states[data.nodes[id].state].label, stateTone(data.nodes[id].state)))))),
      h('ol.tc-fac-lineage-edges', null, data.edges.map((edge) => h('li', { dataset: { state: edge.state } },
        h('div.tc-fac-tags', null,
          h('a.tc-fac-inline-link', { href: PC.href('faction-info', edge.from) }, factionName(edge.from, data.nodes[edge.from].name)),
          h('i.tc-fac-edge-line', { 'aria-hidden': 'true' }),
          h('a.tc-fac-inline-link', { href: PC.href('faction-info', edge.to) }, factionName(edge.to, data.nodes[edge.to].name))),
        h('p', { text: edge.label }), PC.tag(data.states[edge.state].label, stateTone(edge.state))))),
      h('aside.tc-note.tc-note--caution', null, h('b', { text: '확인되지 않음' }),
        h('p.tc-fac-prose', { text: data.unresolved.map((item) => item.text).join(' ') })),
      h('div.tc-fac-copy', null, h('h3', { text: '연결 세계 기록' }),
        (current.history || []).map((id) => {
          const record = historyRecord(id);
          const meta = data.historyMeta?.[id];
          return record ? h('a.tc-fac-connection', { href: PC.href('history', id) },
            h('time.tc-code', { text: record.date || meta?.date }), h('b', { text: record.title || meta?.title || id }))
            : PC.missing('HISTORY NOT FOUND', id, '이 갈래에 연결된 세계 기록이 없습니다.');
        })));
  }

  function relatedPeople(key) {
    const people = root.ProjectCursePersonnel;
    const ids = people?.factionIndex?.[key] || [];
    // 2042 추가 등록 인물은 2006년 명부와 섞지 않고 따로 싣는다(담당: Claude).
    const added = people?.additionIndex?.[key] || [];
    if (!ids.length && !added.length) return null;
    let anomalyCount = 0;
    const item = (id) => {
      const person = own(people.byId, id);
      if (person && uncertainIdentity(person) && anomalyCount < 2) {
        anomalyCount++;
        return h('li.tc-fac-person-uncertain', null,
          h('span', { text: person.name, dataset: { tcAnomaly: 'name' } }), h('span', { text: person.role }),
          h('a.tc-btn', { href: PC.href('personnel', id), 'aria-label': `${person.name} 인물 기록 열기` }, '인물 기록 열기'));
      }
      return h('li', null, person ? h('a.tc-fac-connection', { href: PC.href('personnel', id) },
        h('b', { text: person.name }), h('span', { text: person.role }))
        : PC.missing('PERSONNEL NOT FOUND', id, '연결된 인물 파일이 없습니다.'));
    };
    return h('section.tc-fac-link-group', null, h('h3', { text: '관련 인물' }),
      ids.length ? h('p.tc-label', { text: '2006년 명부' }) : null,
      ids.length ? h('ul.tc-fac-people', null, ids.slice(0, 2).map(item)) : null,
      ids.length > 2 ? h('details.tc-disclosure.tc-fac-more-links', null,
        h('summary', null, h('span', null, h('b', { text: '2006년 명부 나머지 인물' }))),
        h('div.tc-disclosure-body', null, h('ul.tc-fac-people', null, ids.slice(2).map(item)))) : null,
      added.length ? [h('h4', { text: people.additionLabel }), h('ul.tc-fac-people', null, added.slice(0, 2).map(item))] : null,
      added.length > 2 ? h('details.tc-disclosure.tc-fac-more-links', null,
        h('summary', null, h('span', null, h('b', { text: '추가 등록 인물 나머지' }))),
        h('div.tc-disclosure-body', null, h('ul.tc-fac-people', null, added.slice(2).map(item)))) : null,
      h('div.tc-btnrow', null, link('인물 기록 열기 ↗', 'personnel')));
  }

  function incidentSection(key) {
    const list = incidents(key);
    const markers = new Set((root.ProjectCurseMapRoom?.markers || []).map((item) => item.incident));
    const ops = new Set((root.ProjectCurseMapRoom?.operations || []).map((item) => item.id));
    if (!list.length) return null;
    const entries = list.map((item) => h('article.tc-fac-incident', null,
        h('div.tc-fac-tags', null, h('time.tc-code', { text: item.date }), PC.tag(item.status, /SEALED|CONFLICT/.test(item.status) ? 'danger' : 'evidence', { latin: true })),
        h('h3', { text: item.title }), h('p', { text: item.summary }),
        h('div.tc-btnrow', null,
          item.history ? link('연표 기록 ↗', 'history', item.history) : null,
          markers.has(item.id) ? link('지도 위치 ↗', 'map-room', 'incident', item.id) : null,
          item.operation && ops.has(item.operation) ? link('작전 진행 ↗', 'map-room', 'op', item.operation) : null)));
    return linkGroup('연결 사건', entries);
  }

  function relatedBundles(key, item, openMarks) {
    const factionLinks = item.relations.map((relation) => faction(relation.target)
      ? h('a.tc-fac-relation', { href: PC.href('faction-info', relation.target) },
        h('div.tc-fac-tags', null, h('b', null, factionName(relation.target, faction(relation.target).name)), PC.tag(relation.label, relationTone(relation.label))), h('p', { text: relation.text }))
      : PC.missing('FACTION NOT FOUND', relation.target, relation.text));
    const lineage = lineageSection(key);
    const groups = [
      linkGroup('다른 세력과의 관계', factionLinks),
      relatedPeople(key),
      incidentSection(key),
      lineage,
      openMarks.length ? h('section.tc-fac-link-group', null, h('h3', { text: '자유 해석' }), openMarks) : null
    ].filter(Boolean);
    return h('details.tc-disclosure.tc-fac-related', { open: PC.density?.() === 'full' },
      h('summary', null, h('span', null,
        h('span.tc-label.tc-full-only', { text: 'RELATED DOSSIERS' }), h('b', { text: '관련 인물·세력·사건' }),
        h('small.tc-hint', { text: '소속 연결과 사건 기록, 판정이 남은 갈래를 모았다.' }))),
      h('div.tc-disclosure-body.tc-fac-copy', null, groups));
  }

  function renderDetail(key) {
    PC.clear(detailView).append(h('nav.tc-btnrow', { 'aria-label': '세력 문서 이동' }, backLink()));
    delete detailView.dataset.facDossier;
    const item = faction(key);
    if (!item) {
      detailView.append(h('h1', { text: canon(key)?.name || '세력 문서 없음', 'data-tc-focus': true }),
        PC.missing('FACTION NOT FOUND', key, '이 단말에 해당하는 세력 분석 문서가 없습니다.'));
      return '세력 문서 없음';
    }
    const registered = canon(key);
    const current = node(key);
    const threat = threatLevels[String(item.threat || item.risk || registered?.threat || registered?.risk || '').toUpperCase()];
    if (threat) PC.threat?.(threat);
    const openCanon = root.ProjectCurseOpenCanon?.faction?.[key];
    const openMarks = (openCanon || []).map(text => PC.openCanon?.(text)).filter(Boolean);
    detailView.dataset.facDossier = key;
    const operationList = h('ul.tc-fac-bullets', null,
      item.operations.slice(0, 2).map((text) => h('li', { text })),
      item.operations.length > 2 ? h('li', null, h('details.tc-disclosure.tc-fac-more-links', null,
        h('summary', null, h('span', null, h('b', { text: '추가 행동·운용 기록' }))),
        h('div.tc-disclosure-body', null, h('ul.tc-fac-bullets', null, item.operations.slice(2).map((text) => h('li', { text })))))) : null);
    const contextBody = item.assessment ? h('dl.tc-fac-context', null,
      [['현재', 'status'], ['형성 과정', 'lineage'], ['주의할 점', 'misconception'], ['남겨진 문제', 'past'], ['아직 모르는 것', 'unresolved']].map(([term, field]) =>
        h('div', null, h('dt', { text: term }), h('dd', { text: item.assessment[field] })))) : null;
    const analysisTab = [
      panel('CURRENT ASSESSMENT', '현재와 주요 행동', item.assessment?.status || item.lead,
        h('p', { text: item.assessment?.status || item.lead }), operationList, true),
      panel('ORGANIZATION', '조직과 활동', firstSentence(item.overview[0]), paragraphs(item.overview),
        item.profile ? h('section.tc-fac-profile', null,
          h('h3', { text: item.profile.label }), h('p', { text: item.profile.note }), kv(item.profile.items)) : null,
        h('section.tc-fac-copy', null, h('h3', { text: '내부 문제' }), h('p', { text: item.fault }))),
      contextBody ? panel('CONTEXT', '이해에 필요한 배경', '미확정 사항과 해석 한계를 포함한다.', contextBody) : null
    ].filter(Boolean);
    const chronology = h('ol.tc-fac-chronology', null, item.chronology.map(([date, text]) =>
      h('li', null, h('time.tc-code', { text: date }), h('span', { text }))));
    const evidenceTab = [
      panel('CHRONOLOGY', '주요 연혁', '세력의 형성과 현재 상태에 이르는 기록.', chronology, false),
      item.visual?.src
        ? panel('REGISTERED VISUAL', '등록 시각 자료', '기록된 표식과 캡션을 확인한다.', h('figure.tc-evidence.tc-fac-visual', { dataset: { evidenceClass: item.visual.className } },
          h('div.tc-evidence-media', null, PC.img(item.visual.src, { alt: item.visual.alt || '' })),
          h('figcaption', null, h('b', null, displayLabel(item.visual.label)), h('span.tc-fac-prose', { text: item.visual.caption }))), false)
        : panel('VISUAL / PENDING', '등록 시각 자료', '채택된 문서 그림이 없다.', h('figure.tc-evidence.tc-fac-visual.tc-fac-visual--empty', null,
          h('div.tc-evidence-media', null, h('div.tc-fac-visual-empty', { role: 'img', 'aria-label': '그림 미등록', text: '그림 미등록' })),
          h('figcaption', null, h('b', null, '그림 미등록'), h('span.tc-fac-prose', { text: '그림은 사용자 채택 대기 상태다.' }))), false),
      markAnalysis(key)
    ].filter(Boolean);
    const relatedTab = [relatedBundles(key, item, openMarks)];
    const tabs = PC.tabs({ id: 'tc-fac-dossier', label: '세력 문서 갈래', active: 'assessment', items: [
      { id: 'assessment', title: '현재 분석', hint: '현재 판정과 조직 활동.', body: h('div.tc-fac-detail-stack', null, analysisTab) },
      { id: 'evidence', title: '연혁·감식', hint: '연혁, 등록 표식, 확인 자료.', body: h('div.tc-fac-detail-stack', null, evidenceTab) },
      { id: 'related', title: '연결 자료', hint: '관련 인물·세력·사건과 판정 한계.', body: h('div.tc-fac-detail-stack', null, relatedTab) }
    ] });
    PC.append(detailView, [
        h('header.tc-panel.tc-bracket.tc-fac-cover', null, markBoard(key),
        h('div.tc-fac-cover-copy', null,
          h('p.tc-label.tc-full-only', { text: `FACTION DOSSIER / ${key}` }),
          h('h1', { 'data-tc-focus': true }, factionName(key, item.name)), h('p', { text: item.lead }),
          h('div.tc-fac-tags', null, PC.tag(classification(key), current ? 'occult' : 'info'),
            registered?.status ? PC.tag(registered.status, relationTone(registered.status)) : null,
            current ? PC.tag(lineage().states[current.state].label, stateTone(current.state)) : null),
          registered?.risk ? h('div.tc-fac-tags', { 'aria-label': '위험 태그' }, registered.risk.split(' / ').map((risk) => PC.tag(risk, 'danger'))) : null,
          registered?.zone ? kv([['활동권', registered.zone]]) : null)),
        tabs.tablist, ...tabs.panels,
        h('nav.tc-btnrow', { 'aria-label': '세력 목록으로 돌아가기' }, backLink())]);
    return item.name;
  }

  function onClick(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.target.closest('[data-fac-back]')) { event.preventDefault(); PC.back('faction-info'); return; }
    const button = event.target.closest('[data-fac-filter]');
    if (button) { filter = button.dataset.facFilter; renderRows(); }
  }
  function mount(el) {
    host = el;
    indexView = h('div.tc-fac-index');
    detailView = h('article.tc-fac-detail', { hidden: true });
    host.append(indexView, detailView);
    if (!source()?.factions || !display()) {
      indexView.append(PC.missing('FACTION DATA MISSING', 'ProjectCurseFactionAnalysis / ProjectCurseFactionDisplay', '세력 분석 데이터를 불러오지 못했습니다.'));
      return;
    }
    count = h('p.tc-code.tc-full-only', { role: 'status', 'aria-live': 'polite' });
    groupBodies = {};
    const groupHints = {
      'PRIMARY INSTITUTIONS': '지휘 기관과 현장 전투 조직.',
      'FIELD RESPONSE LINE': '회수·대피·사후 대응 조직.',
      'EXTERNAL POWERS': '독립 세력과 이해 관계.',
      'CULT LINEAGE / COMMAND STATUS': '계통 판정과 미확정 관계 포함.',
      'PREDECESSOR RECORD': '전신 조직의 기록.'
    };
    const groupItems = source().groups.map((group) => {
      const id = groupKey(group.label), body = h('div.tc-rows.tc-fac-group-rows');
      groupBodies[id] = body;
      return { id, title: display().groupLabels[group.label] || group.label, hint: groupHints[group.label] || '등록 세력 문서.', body };
    });
    indexTabs = PC.tabs({ id: 'tc-fac-index', label: '세력 분석 분류', active: groupItems[0]?.id, items: groupItems });
    indexView.append(PC.screenHead('faction-info', { desc: display().intro, meta: [['DOSSIERS', `${source().order.length}`], ['GROUPS', `${source().groups.length}`]] }),
      h('section.tc-panel.tc-fac-controls', { 'aria-label': '세력 분류 필터' },
        h('div.tc-fac-control-head', null, h('h2', { text: '분석 대상 조직' }), count),
        h('div.tc-seg', { role: 'group', 'aria-label': '세력 분류' }, Object.entries(root.ProjectCurseCanon.factionTagLabels).map(([id, label]) =>
          h('button', { type: 'button', 'aria-pressed': String(id === filter), dataset: { facFilter: id } }, label)))),
      indexTabs.tablist, ...indexTabs.panels);
    indexView.querySelectorAll('.tc-screenhead-meta, .tc-screenhead-code').forEach(el => el.classList.add('tc-full-only'));
    renderRows();
  }
  function show(parts, app, info) {
    root.cancelAnimationFrame(restoreFrame);
    const key = parts.length > 1 ? parts.join('/') : parts[0];
    if (active && onIndex && key) indexScroll = root.scrollY;
    const restoring = !key && (!onIndex || !active) && info.reason !== 'initial';
    onIndex = !key;
    indexView.hidden = !!key;
    detailView.hidden = !key;
    app.setTitle(key ? renderDetail(key) : '세력 분석');
    listeners?.abort();
    listeners = new AbortController();
    host.addEventListener('click', onClick, { signal: listeners.signal });
    active = true;
    if (restoring) restoreFrame = root.requestAnimationFrame(() => root.scrollTo(0, indexScroll));
  }
  function hide() {
    if (onIndex) indexScroll = root.scrollY;
    active = false;
    listeners?.abort();
    root.cancelAnimationFrame(restoreFrame);
  }
  PC.screen({ id: 'faction-info', mount, show, hide });
})(window);
