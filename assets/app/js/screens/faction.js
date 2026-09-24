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

  let host, indexView, detailView, rows, count, listeners;
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
  function section(code, title, ...body) {
    return h('section.tc-panel.tc-fac-section', null,
      h('header.tc-panel-head', null, h('div', null, h('span.tc-label', { text: code }), h('h2', { text: title }))),
      h('div.tc-panel-body.tc-fac-copy', null, body));
  }
  function kv(items) {
    return h('dl.tc-kv.tc-fac-kv', null, items.filter(([, value]) => value).map(([term, value]) =>
      h('div', null, h('dt', { text: term }), h('dd', null, value))));
  }
  function paragraphs(items) { return items.map((text) => h('p', { text })); }
  function backLink() {
    return h('a.tc-btn', { href: PC.href('faction-info'), dataset: { facBack: '' } }, '← 세력 목록으로 복귀');
  }

  function markBoard(key, compact = false) {
    const mark = own(root.ProjectCurseFactionMarks?.marks, key);
    if (!mark) return PC.missing('MARK NOT FOUND', key, '문양 등록 자료가 없습니다.');
    // 번호는 source.order의 표시 순번이다. 새 회수 번호나 회수 위치를 설정으로 만들지 않는다.
    const number = String(source().order.indexOf(key) + 1).padStart(2, '0');
    return h('figure.tc-evidence.tc-fac-mark', { class: compact ? 'tc-fac-mark--compact' : null },
      h('div.tc-fac-mark-image', null, h('span.tc-code', { text: `MARK / ${number}` }),
        h('img', { src: mark.asset, alt: `${faction(key).name} 표식`, loading: 'lazy', decoding: 'async', width: 160, height: 160 })),
      h('figcaption', null,
        PC.tag(`감식 ${mark.confidence}`, mark.confidence === 'A' ? 'evidence' : 'caution'),
        compact ? null : h('span', { text: mark.source })));
  }

  function indexRow(key) {
    const item = faction(key);
    if (!item) return PC.missing('FACTION NOT FOUND', key, '편제표에 연결된 세력 문서가 없습니다.');
    return h('a.tc-row.tc-fac-row', { href: PC.href('faction-info', key), dataset: { facKey: key } },
      markBoard(key, true),
      h('div.tc-fac-row-copy', null,
        h('div.tc-fac-tags', null, h('h3', { text: item.name }), PC.tag(classification(key), node(key) ? 'occult' : 'info')),
        h('p', { text: item.lead }),
        h('p.tc-fac-index-status', { text: firstSentence(item.assessment?.status) })),
      h('span.tc-row-go', { 'aria-hidden': 'true', text: '›' }));
  }

  function renderRows() {
    PC.clear(rows);
    let total = 0;
    (source()?.groups || []).forEach((group) => {
      const keys = group.keys.filter((key) => filter === 'all' || tagsFor(key).includes(filter));
      if (!keys.length) return;
      total += keys.length;
      rows.append(h('section.tc-fac-group', null,
        h('header.tc-section-head', null,
          h('div', null, h('span.tc-label', { text: group.label }), h('h2', { text: display().groupLabels[group.label] || group.label })),
          h('span.tc-code', { text: `${String(keys.length).padStart(2, '0')} FILES` })),
        h('div.tc-rows', null, keys.map(indexRow))));
    });
    count.textContent = `${total} / ${source()?.order.length || 0}개 문서`;
    if (!total) rows.append(PC.missing('NO MATCHING FILES', filter, '선택한 분류에 해당하는 세력 문서가 없습니다.'));
    indexView.querySelectorAll('[data-fac-filter]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.facFilter === filter)));
  }

  function markAnalysis(key) {
    const mark = own(root.ProjectCurseFactionMarks?.marks, key);
    if (!mark) return PC.missing('MARK NOT FOUND', key, '문양 감식 자료가 없습니다.');
    return h('details.tc-disclosure', null,
      h('summary', null, h('span', null, h('span.tc-label', { text: 'INSIGNIA / AUTHENTICATION' }), h('b', { text: '문양 감식' }))),
      h('div.tc-disclosure-body.tc-fac-copy', null,
        kv([['종류', mark.type], ['처음 확인', mark.firstSeen], ['사용 방식', mark.usage], ['등록본', mark.assetState]]),
        h('ol.tc-fac-symbols', null, (mark.symbols || []).map((item) => h('li', null, h('b', { text: item.label }), h('p', { text: item.text })))),
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
    return section('LINEAGE / COMMAND STATUS', '교단 계통',
      h('div.tc-fac-tags', null, PC.tag(data.states[current.state].label, stateTone(current.state)), h('b', { text: current.kind })),
      h('p.tc-fac-command', { text: current.command }), h('p', { text: current.summary }),
      h('ul.tc-fac-lineage-nodes', { 'aria-label': '우시노다 계보 노드' }, data.order.map((id) => h('li', null,
        h('a.tc-fac-connection', { href: PC.href('faction-info', id), 'aria-current': id === key ? 'page' : null },
          h('b', { text: data.nodes[id].name }), h('span', { text: data.nodes[id].short }), PC.tag(data.states[data.nodes[id].state].label, stateTone(data.nodes[id].state)))))),
      h('ol.tc-fac-lineage-edges', null, data.edges.map((edge) => h('li', { dataset: { state: edge.state } },
        h('div.tc-fac-tags', null,
          h('a.tc-fac-inline-link', { href: PC.href('faction-info', edge.from), text: data.nodes[edge.from].name }),
          h('i.tc-fac-edge-line', { 'aria-hidden': 'true' }),
          h('a.tc-fac-inline-link', { href: PC.href('faction-info', edge.to), text: data.nodes[edge.to].name })),
        h('p', { text: edge.label }), PC.tag(data.states[edge.state].label, stateTone(edge.state))))),
      h('aside.tc-note.tc-note--caution', null, h('b', { text: '확인되지 않음' }),
        h('p.tc-fac-prose', { text: data.unresolved.map((item) => item.text).join(' ') })),
      h('div.tc-fac-copy', null, h('h3', { text: '연결 세계 기록' }),
        (current.history || []).map((id) => {
          const record = historyRecord(id);
          const meta = data.historyMeta?.[id];
          return record ? h('a.tc-fac-connection', { href: PC.href('history', id) },
            h('time.tc-code', { text: record.date || meta?.date }), h('b', { text: record.title || meta?.title || id }))
            : PC.missing('HISTORY NOT FOUND', id, '계통에 연결된 세계 기록이 없습니다.');
        })));
  }

  function relatedPeople(key) {
    const people = root.ProjectCursePersonnel;
    const ids = people?.factionIndex?.[key] || [];
    if (!ids.length) return null;
    return section('PERSONNEL / 2006', '관련 인물',
      h('ul.tc-fac-people', null, ids.map((id) => {
        const person = own(people.byId, id);
        return h('li', null, person ? h('a.tc-fac-connection', { href: PC.href('personnel', id) },
          h('b', { text: person.name }), h('span', { text: person.role }))
          : PC.missing('PERSONNEL NOT FOUND', id, '연결된 인물 파일이 없습니다.'));
      })), h('div.tc-btnrow', null, link('인물 기록 열기 ↗', 'personnel')));
  }

  function incidentSection(key) {
    const list = incidents(key);
    const markers = new Set((root.ProjectCurseMapRoom?.markers || []).map((item) => item.incident));
    const ops = new Set((root.ProjectCurseMapRoom?.operations || []).map((item) => item.id));
    if (!list.length) return null;
    return section('INCIDENT CROSS REFERENCE', '연결 사건',
      h('ol.tc-fac-incidents', null, list.map((item) => h('li', null,
        h('div.tc-fac-tags', null, h('time.tc-code', { text: item.date }), PC.tag(item.status, /SEALED|CONFLICT/.test(item.status) ? 'danger' : 'evidence', { latin: true })),
        h('h3', { text: item.title }), h('p', { text: item.summary }),
        h('div.tc-btnrow', null,
          item.history ? link('연표 기록 ↗', 'history', item.history) : null,
          markers.has(item.id) ? link('지도 위치 ↗', 'map-room', 'incident', item.id) : null,
          item.operation && ops.has(item.operation) ? link('작전 경과 ↗', 'map-room', 'op', item.operation) : null)))));
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
    detailView.dataset.facDossier = key;
    PC.append(detailView, [
      h('header.tc-panel.tc-bracket.tc-fac-cover', null, markBoard(key),
        h('div.tc-fac-cover-copy', null,
          h('p.tc-label', { text: `FACTION DOSSIER / ${key}` }),
          h('h1', { text: item.name, 'data-tc-focus': true }), h('p', { text: item.lead }),
          h('div.tc-fac-tags', null, PC.tag(classification(key), current ? 'occult' : 'info'),
            registered?.status ? PC.tag(registered.status, relationTone(registered.status)) : null,
            current ? PC.tag(lineage().states[current.state].label, stateTone(current.state)) : null),
          registered?.risk ? h('div.tc-fac-tags', { 'aria-label': '위험 태그' }, registered.risk.split(' / ').map((risk) => PC.tag(risk, 'danger'))) : null,
          registered?.zone ? kv([['활동권', registered.zone]]) : null)),
      section('CURRENT ASSESSMENT', '현재와 주요 행동',
        h('p', { text: item.assessment?.status || item.lead }),
        h('ul.tc-fac-bullets', null, item.operations.map((text) => h('li', { text }))),
        h('div.tc-btnrow', null, item.relations[0] ? link(`${faction(item.relations[0].target)?.name || item.relations[0].target} · ${item.relations[0].label}`, 'faction-info', item.relations[0].target) : null,
          incidents(key)[0] ? link(incidents(key)[0].title, incidents(key)[0].history ? 'history' : 'map-room', ...(incidents(key)[0].history ? [incidents(key)[0].history] : ['incident', incidents(key)[0].id])) : null)),
      section('ORGANIZATION', '조직과 활동', paragraphs(item.overview),
        item.profile ? h('section.tc-fac-profile', null,
          h('h3', { text: item.profile.label }), h('p', { text: item.profile.note }), kv(item.profile.items)) : null,
        h('section.tc-fac-copy', null, h('h3', { text: '내부 문제' }), h('p', { text: item.fault }))),
      item.assessment ? section('CONTEXT', '이해에 필요한 배경',
        h('dl.tc-fac-context', null, [['현재', 'status'], ['형성 과정', 'lineage'], ['주의할 점', 'misconception'], ['남겨진 문제', 'past'], ['아직 모르는 것', 'unresolved']].map(([term, field]) =>
          h('div', null, h('dt', { text: term }), h('dd', { text: item.assessment[field] }))))) : null,
      section('CHRONOLOGY', '주요 연혁', h('ol.tc-fac-chronology', null, item.chronology.map(([date, text]) =>
        h('li', null, h('time.tc-code', { text: date }), h('span', { text }))))),
      item.visual?.src ? h('figure.tc-evidence.tc-fac-visual', { dataset: { evidenceClass: item.visual.className } },
        h('div.tc-evidence-media', null, PC.img(item.visual.src, { alt: item.visual.alt || '' })),
        h('figcaption', null, h('b', { text: item.visual.label }), h('span.tc-fac-prose', { text: item.visual.caption }))) : null,
      markAnalysis(key), lineageSection(key),
      section('CONNECTED FACTIONS', '다른 세력과의 관계',
        h('ul.tc-fac-relations', null, item.relations.map((relation) => h('li', null,
          faction(relation.target) ? h('a.tc-fac-relation', { href: PC.href('faction-info', relation.target) },
            h('div.tc-fac-tags', null, h('b', { text: faction(relation.target).name }), PC.tag(relation.label, relationTone(relation.label))), h('p', { text: relation.text }))
            : PC.missing('FACTION NOT FOUND', relation.target, relation.text))))),
      relatedPeople(key), incidentSection(key),
      h('nav.tc-btnrow', { 'aria-label': '세력 목록 복귀' }, backLink())]);
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
    rows = h('div.tc-fac-groups');
    count = h('p.tc-code', { role: 'status', 'aria-live': 'polite' });
    indexView.append(PC.screenHead('faction-info', { desc: display().intro, meta: [['DOSSIERS', `${source().order.length}`], ['GROUPS', `${source().groups.length}`]] }),
      h('section.tc-panel.tc-fac-controls', { 'aria-label': '세력 분류 필터' },
        h('div.tc-fac-control-head', null, h('h2', { text: '분석 대상 편제' }), count),
        h('div.tc-seg', { role: 'group', 'aria-label': '세력 분류' }, Object.entries(root.ProjectCurseCanon.factionTagLabels).map(([id, label]) =>
          h('button', { type: 'button', 'aria-pressed': String(id === filter), dataset: { facFilter: id } }, label)))), rows);
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
