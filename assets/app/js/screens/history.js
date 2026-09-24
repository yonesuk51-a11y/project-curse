// Project Curse 6 — 세계 기록 화면 (담당: Claude)
// #history            연표 목록
// #history/<기록 id>  사건 기록(증거 파일)
(function (root) {
  'use strict';

  const PC = root.PCApp;
  const { h } = PC;

  const chronology = () => root.ProjectCurseWorldHistoryData;
  const prose = () => root.ProjectCurseWorldHistoryProse;
  const japan = () => root.ProjectCurseJapanTechnology;
  const core = () => root.ProjectCurseWorldHistoryCore;

  const screenCopy = () => root.ProjectCurseHistoryScreen || {};

  /* ---------- 기록 조립 — 5.54 화면과 같은 순서로 합친다 ---------- */

  function sortKey(record) {
    if (record.sort) return record.sort;
    const parts = String(record.date).match(/\d+/g)?.map(Number) || [9999];
    const after = /이후|전후/.test(record.date);
    return parts[0] * 10000 + (parts[1] ?? (after ? 99 : 0)) * 100 + (parts[2] ?? (after ? 99 : 0));
  }

  let cache = null;
  function records() {
    if (cache) return cache;
    const chron = chronology();
    const pros = prose();
    const jp = japan();
    const list = [
      // 고대 기록에는 기록별 그림(recordVisuals)만 붙인다.
      ...(chron?.deepHistoryRecords || []).map((record) => ({ ...record, ...(pros?.recordVisuals?.[record.id] ? { visual: pros.recordVisuals[record.id] } : {}) })),
      ...(core()?.records || []).map((record) => ({
        ...record,
        paragraphs: [...record.paragraphs],
        ...(chron?.getRecord?.(record.id) || {}),
        ...(pros?.getRecord?.(record.id) || {})
      })),
      ...(jp?.records || []).map((record) => {
        const type = pros?.documentTypes?.[record.documentType];
        return {
          ...record,
          documentLabel: type?.label || '내부 기술기록',
          documentCode: type?.code || 'TECHNICAL RECORD',
          paragraphs: record.fragments.map((fragment) => fragment.text),
          isTechnology: true
        };
      }),
      ...(chron?.post2006Records || []).map((record) => ({ ...record, ...(pros?.getRecord?.(record.id) || {}) }))
    ];
    cache = list.sort((a, b) => sortKey(a) - sortKey(b));
    return cache;
  }

  const findIndex = (id) => records().findIndex((record) => record.id === id);

  /* ---------- 글 조각 ---------- */

  // ██ 구간은 가림 막대로 바꾼다. 글자는 그대로 둔다.
  function richText(text) {
    const parts = String(text || '').split(/(█+)/);
    return parts.map((part) => (/^█+$/.test(part)
      ? h('span.tc-redact', { role: 'img', 'aria-label': '삭제된 구간', style: `min-width:${Math.max(2, part.length) * .62}em` })
      : part));
  }

  function verdictTag(key) {
    const level = chronology()?.getEvidence?.(key);
    return PC.tag(level?.label || '판정 대기', PC.verdictTone(key || 'estimated'));
  }

  // 현장 기입 — 시각으로 시작하는 줄이 절반 이상이면 시각 열이 있는 기록으로 그린다.
  const TIME_LINE = /^\s*((?:T[+-])?\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)$/;
  function logBlock(text, occult) {
    const lines = String(text || '').split('\n').map((line) => line.trimEnd()).filter((line) => line.trim());
    const timed = lines.filter((line) => TIME_LINE.test(line)).length;
    const cls = occult ? 'tc-log tc-log--occult' : 'tc-log';
    if (!lines.length) return null;
    if (timed * 2 < lines.length) {
      return h('ol', { class: `${cls} tc-hist-log-plain` }, lines.map((line) => h('li', null, h('span', null, richText(line)))));
    }
    return h('ol', { class: cls }, lines.map((line) => {
      const match = TIME_LINE.exec(line);
      return h('li', null, h('time', { text: match ? match[1] : '—' }), h('span', null, richText(match ? match[2] : line.trim())));
    }));
  }

  function fragmentBlock(fragment, occult) {
    const kind = fragment.kind || 'document';
    let copy;
    if (kind === 'log') copy = logBlock(fragment.text, occult);
    else if (kind === 'quote') copy = h('blockquote', null, richText(fragment.text));
    else copy = h('p', null, richText(fragment.text));
    return h('section', { class: `tc-hist-fragment is-${kind}` },
      h('span.tc-hist-fragment-label', { text: fragment.label || '기록 발췌' }),
      copy
    );
  }

  /* ---------- 목록 화면 ---------- */

  let activeEra = 'all';
  let indexView = null;
  let detailView = null;

  function turnsPanel() {
    return h('section.tc-panel.tc-bracket.tc-hist-turns', { 'aria-labelledby': 'tc-hist-turns-title' },
      h('header.tc-panel-head', null,
        h('div', null, h('span.tc-label', { text: 'READING PATH' }), h('h2#tc-hist-turns-title', { text: '먼저 볼 네 전환점' }))
      ),
      h('ol.tc-hist-turn-list', null, (screenCopy().turns || []).map(([id, range, title, text]) => {
        const exists = findIndex(id) >= 0;
        return h('li', null, h(exists ? 'a' : 'div', { class: 'tc-hist-turn', href: exists ? PC.href('history', id) : null },
          h('time', { text: range }),
          h('b', { text: title }),
          h('span', { text: text }),
          exists ? h('em', { text: '대표 기록 열람 ›' }) : h('em.is-missing', { text: `기록 없음: ${id}` })
        ));
      }))
    );
  }

  function frameworkBody() {
    const framework = chronology()?.worldFramework;
    if (!framework) return PC.missing('FRAMEWORK MISSING', 'worldFramework', '세계 기본 규칙 데이터가 없습니다.');
    return h('div.tc-hist-ref', null,
      h('div.tc-hist-ref-lead', null,
        h('p', { text: framework.thesis }),
        h('div.tc-note.tc-note--evidence', null, h('b', { text: 'WORLD CONDITION' }), h('p', { text: '기관은 원인이 아니라 후발 대응체계다.' }))
      ),
      h('ul.tc-hist-grid.tc-hist-grid--4', null, framework.ontology.map((item) =>
        h('li', null, h('span.tc-label', { text: item.code }), h('b', { text: item.name }), h('p', { text: item.text }))
      )),
      // 존재 구분 그림 — history-screen-data.js의 ontologyVisuals[구분 코드]
      framework.ontology.map((item) => visualBlock(screenCopy().ontologyVisuals?.[item.code])),
      h('details.tc-disclosure.tc-hist-sub', null,
        h('summary', null, h('span', null, h('b', { text: '능력의 일곱 발현 경로와 대가' }))),
        h('ul.tc-hist-grid.tc-hist-grid--4', null, framework.abilitySources.map((item) =>
          h('li', null, h('b', { text: item.name }), h('p', { text: item.cost }))
        ))
      ),
      h('details.tc-disclosure.tc-hist-sub', null,
        h('summary', null, h('span', null, h('b', { text: '괴이 재난 속 민간인의 일상' }))),
        h('div.tc-disclosure-body', null, h('p.tc-hist-baseline', { text: framework.publicBaseline })),
        h('ul.tc-hist-grid.tc-hist-grid--5', null, framework.civilianSystems.map((item) =>
          h('li', null, h('b.tc-hist-coyote', { text: item.name }), h('p', { text: item.text }))
        ))
      ),
      possessionBlock(framework.reverseSiteCivilians)
    );
  }

  // 리버스 지점의 피탈자(2026-09-25 사용자 설정) — 분류 근거는 괴이 판정표로, 교전은 교범으로 연결한다.
  function possessionBlock(item) {
    if (!item) return null;
    return h('details.tc-disclosure.tc-hist-sub', null,
      h('summary', null, h('span', null, h('b', { text: item.label }))),
      h('div.tc-disclosure-body', null,
        h('p', { text: item.rule }),
        h('p', { text: item.handling }),
        item.state ? h('p', { text: item.state }) : null,
        item.release ? h('p', { text: item.release }) : null,
        item.afterDeath ? h('p', { text: item.afterDeath }) : null,
        visualBlock(item.visual),
        h('div.tc-note.tc-note--caution', null, h('b', { text: item.status }), h('p', { text: item.caution })),
        item.record ? h('p', null, h('a', { href: PC.href('archive-entry', item.record) }, '괴이 판정표 원문 열기', h('i', { 'aria-hidden': 'true', text: ' ›' }))) : null,
        item.manualSection ? h('p', null, h('a', { href: PC.href('field-manual') }, `교전 교범의 ${item.manualSection} 보기`, h('i', { 'aria-hidden': 'true', text: ' ›' }))) : null
      )
    );
  }

  function observationsBody() {
    const framework = chronology()?.worldFramework;
    if (!framework) return PC.missing('FRAMEWORK MISSING', 'worldFramework', '세계 기본 규칙 데이터가 없습니다.');
    const rule = (item) => item ? h('section.tc-hist-rule', null,
      h('header', null, h('b', { text: item.label }), PC.tag(item.status, 'caution')),
      h('p', { text: item.rule }),
      item.consequence ? h('p', { text: item.consequence }) : null,
      h('ul.tc-hist-cases', null, item.cases.map((entry) =>
        h('li', null,
          findIndex(entry.record) >= 0
            ? h('a', { href: PC.href('history', entry.record) }, entry.label, h('i', { 'aria-hidden': 'true', text: '›' }))
            : h('span.is-missing', { text: `${entry.label} (기록 없음)` }),
          h('p', { text: entry.note })
        )
      )),
      h('p.tc-hist-caution', { text: item.caution })
    ) : null;
    return h('div.tc-hist-ref', null,
      h('div.tc-hist-ref-lead', null,
        h('p', { text: '세계가 어떻게 어긋나는지에 대한 세 가지 관측이다. 어느 기관도 확인하지 못했고, 셋 다 결정 대기 상태로 남아 있다.' }),
        h('div.tc-note.tc-note--caution', null, h('b', { text: 'UNCONFIRMED PATTERNS' }), h('p', { text: '사례를 같은 원인으로 묶는 근거로 쓰지 않는다.' }))
      ),
      rule(framework.observerDivergence),
      rule(framework.containmentDrift),
      rule(framework.wielderCeiling)
    );
  }

  function technologyBody() {
    const jp = japan();
    if (!jp) return PC.missing('TRACE MISSING', 'ProjectCurseJapanTechnology', '기술 계보 데이터가 없습니다.');
    const program = jp.program;
    return h('div.tc-hist-ref.tc-hist-tech', null,
      h('div.tc-hist-tech-head', null,
        h('div', null, h('span.tc-label', { text: program.code }), h('b', { text: program.name }), h('p', { text: program.purpose })),
        h('dl', null,
          h('div', null, h('dt', { text: 'PERIOD' }), h('dd', { text: program.period })),
          h('div', null, h('dt', { text: 'STATUS' }), h('dd.is-sealed', { text: program.status }))
        )
      ),
      h('ol.tc-hist-track', null, jp.technologies.map((item, index) =>
        h('li', { dataset: { state: item.state } }, h(findIndex(item.record) >= 0 ? 'a' : 'div', { href: findIndex(item.record) >= 0 ? PC.href('history', item.record) : null },
          h('i', { text: String(index + 1).padStart(2, '0') }),
          h('span.tc-code', { text: item.code }),
          h('b', { text: item.name }),
          h('p', { text: item.summary })
        ))
      )),
      h('ul.tc-hist-grid.tc-hist-grid--4', null, jp.socialOutcomes.map((item) =>
        h('li', null, h('span.tc-label', { text: item.label }), h('p', { text: item.text }))
      )),
      h('details.tc-disclosure.tc-hist-sub', null,
        h('summary', null, h('span', null, h('b', { text: '공개 역사와 U.A.C 제한 기록의 경계' }))),
        h('ul.tc-hist-grid.tc-hist-grid--2', null, jp.publicAnchors.map((anchor) =>
          h('li', null,
            h('b', { text: `${anchor.range} / ${anchor.label}` }),
            h('p', { text: anchor.fact }),
            h('p.tc-hist-boundary', { text: anchor.boundary }),
            h('a.tc-hist-source', { href: anchor.url, target: '_blank', rel: 'noopener noreferrer', 'data-tc-native': true }, `근거 확인 · ${anchor.source} ↗`)
          )
        ))
      ),
      h('div.tc-note.tc-note--caution', null, h('b', { text: '아직 확인되지 않은 점' }), h('p', { text: jp.openQuestions.join(' ') }))
    );
  }

  function referenceStack() {
    const item = (code, title, hint, body) => h('details.tc-disclosure.tc-hist-refbox', null,
      h('summary', null, h('span', null, h('span.tc-label', { text: code }), h('b', { text: title }), h('small', { text: hint }))),
      h('div.tc-disclosure-body', null, body)
    );
    return h('div.tc-hist-refs', null,
      item('WORLD RULES', '세계의 기본 규칙', '존재 구분·발현 대가·민간 생존', frameworkBody()),
      item('UNCONFIRMED PATTERNS', '확인되지 않은 세 규칙', '관측·봉쇄·능력 상한', observationsBody()),
      item('TECHNOLOGY TRACE', '일본 기술 도약의 계보', '1982–1992 계측 계획', technologyBody())
    );
  }

  function controls() {
    const eras = chronology()?.eras || [];
    const status = h('b.tc-hist-filter-status', { 'aria-live': 'polite' });
    const seg = h('div.tc-seg.tc-hist-eras', { role: 'group', 'aria-label': '시대 선택' },
      [{ id: 'all', index: 'ALL', title: '전체 시대' }, ...eras].map((era) =>
        h('button', { type: 'button', 'aria-pressed': String(era.id === activeEra), dataset: { era: era.id }, onclick: () => setEra(era.id) },
          h('i', { text: era.index }), era.title)
      )
    );
    const levels = Object.entries(chronology()?.evidenceLevels || {});
    const unresolved = chronology()?.unresolved || [];
    return h('section.tc-hist-controls', { 'aria-label': '연표 필터' },
      h('div.tc-hist-controls-head', null, h('span.tc-label', { text: 'ERA FILTER / 시대 선택' }), status),
      seg,
      h('details.tc-disclosure.tc-hist-key', null,
        h('summary', null, h('span', null, h('span.tc-label', { text: 'CANON KEY' }), h('b', { text: '기록의 확실성과 아직 결정되지 않은 설정' }))),
        h('div.tc-disclosure-body', null,
          h('ul.tc-hist-levels', null, levels.map(([key, level]) =>
            h('li', null, PC.tag(level.label, PC.verdictTone(key)), h('p', { text: level.description }))
          )),
          h('ul.tc-hist-unresolved', null, unresolved.map((item) =>
            h('li.tc-note.tc-note--caution', null, h('b', { text: `${item.scope} / ${item.label}` }), h('p', { text: item.reason }))
          ))
        )
      )
    );
  }

  function recordRow(record) {
    const index = findIndex(record.id);
    return h('a.tc-row.tc-hist-row', {
      href: PC.href('history', record.id),
      class: record.isTechnology ? 'is-technology' : null
    },
      h('time.tc-row-time', { text: record.date }),
      h('span.tc-row-main', null,
        h('b', { text: record.title }),
        h('span', { text: record.summary }),
        h('span.tc-hist-row-source', { text: record.sourceState || '출처 상태 미등록' })
      ),
      h('span.tc-row-meta', null,
        verdictTag(record.evidence),
        PC.tag(record.documentLabel || '편집자 해설', 'evidence')
      ),
      h('span.tc-row-go', { 'aria-hidden': 'true', text: String(index + 1).padStart(2, '0') })
    );
  }

  function eraIndex() {
    const host = h('div.tc-hist-index', { 'aria-label': '세계 사건 연표' });
    return host;
  }

  function renderIndex() {
    const host = indexView.querySelector('.tc-hist-index');
    const status = indexView.querySelector('.tc-hist-filter-status');
    const eras = (chronology()?.eras || []).filter((era) => activeEra === 'all' || era.id === activeEra);
    PC.clear(host);
    let visible = 0;
    eras.forEach((era) => {
      const eraRecords = records().filter((record) => record.era === era.id);
      if (!eraRecords.length) return;
      visible += eraRecords.length;
      const first = eraRecords[0];
      const last = eraRecords[eraRecords.length - 1];
      const landmark = first === last ? `${first.date} · ${first.title}` : `${first.date} · ${first.title} → ${last.date} · ${last.title}`;
      host.append(h('details.tc-hist-era', { open: activeEra !== 'all', dataset: { era: era.id } },
        h('summary.tc-hist-era-head', null,
          h('i', { text: era.index }),
          h('span', null,
            h('b', { text: era.title }),
            h('small', { text: `${era.range} / ${era.summary}` }),
            h('em', { text: landmark })
          ),
          h('span.tc-hist-era-count', null, h('b', { text: `${String(eraRecords.length).padStart(2, '0')}건` }))
        ),
        h('div.tc-rows.tc-hist-era-rows', null, eraRecords.map(recordRow))
      ));
    });
    if (status) status.textContent = `${visible}개 사건 표시`;
  }

  function setEra(id) {
    activeEra = id;
    indexView.querySelectorAll('.tc-hist-eras button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.era === id));
    });
    renderIndex();
  }

  function buildIndex() {
    const list = records();
    const eras = chronology()?.eras || [];
    indexView = h('div.tc-hist-indexview', null,
      PC.screenHead('history', {
        title: '세계 기록',
        desc: '세계는 어느 날 한꺼번에 무너지지 않았다. 오래된 금기, 산업화된 계측, 대응기관의 모방과 대륙의 침묵이 수십 년에 걸쳐 겹쳤다. 먼저 네 전환점으로 흐름을 잡고, 필요한 시대와 사건 기록을 연다.',
        meta: [['SPAN', 'ORIGIN?–2042'], ['INDEX', `${list.length} RECORDS`], ['ERAS', String(eras.length)]]
      }),
      turnsPanel(),
      referenceStack(),
      controls(),
      eraIndex()
    );
    renderIndex();
    return indexView;
  }

  /* ---------- 사건 기록 ---------- */

  function relatedLinks(record) {
    const incidents = root.ProjectCurseIncidentNetwork?.incidentList?.filter((item) => item.history === record.id) || [];
    const mapRoom = root.ProjectCurseMapRoom || {};
    const synchrony = (mapRoom.synchronyEvents || []).filter((event) => event.history === record.id);
    const mappedIncidents = new Set((mapRoom.markers || []).map((marker) => marker.incident).filter(Boolean));
    const mappedOps = new Set((mapRoom.operations || []).map((operation) => operation.id));
    const canonFactions = root.ProjectCurseCanon?.factions || {};
    const factions = [...new Set([
      ...(Array.isArray(record.factions) ? record.factions : []),
      ...incidents.flatMap((incident) => incident.factions || [])
    ])].filter((key) => canonFactions[key]).slice(0, 4);
    const archives = [...new Set([
      ...(Array.isArray(record.records) ? record.records : []),
      ...incidents.flatMap((incident) => incident.records || [])
    ])].slice(0, 4);

    const links = [];
    incidents.forEach((incident) => {
      if (mappedIncidents.has(incident.id)) links.push([`${incident.title} 위치`, 'COORDINATES / 관측 좌표', PC.href('map-room', 'incident', incident.id)]);
      if (incident.operation && mappedOps.has(incident.operation)) links.push([`${incident.title} 작전`, 'OPERATION / 작전 경과', PC.href('map-room', 'op', incident.operation), 'op']);
    });
    synchrony.forEach((event) => links.push([`${event.title} 관측도 · ${event.points.length}개 신호`, '2042 SIGNAL LAYER / 동시 관측', PC.href('map-room', 'synchrony', event.id), 'signal']));
    factions.forEach((key) => links.push([`${canonFactions[key].name} 분석`, 'DOSSIER / 세력 문서', PC.href('faction-info', key)]));
    archives.forEach((id) => links.push([`${id} 기록`, 'RECOVERED / 회수 원문', PC.href('archive-entry', id)]));
    if (!links.length) return null;
    return h('section.tc-panel.tc-bracket.tc-hist-links', { 'aria-labelledby': 'tc-hist-links-title' },
      h('header.tc-panel-head', null, h('div', null, h('span.tc-label', { text: 'CROSS REFERENCE' }), h('h2#tc-hist-links-title', { text: '관련 기록' }))),
      h('ul.tc-hist-link-list', null, links.map(([label, kind, target, tone]) =>
        h('li', null, h('a', { href: target, class: tone ? `is-${tone}` : null },
          h('small', { text: kind }),
          h('b', { text: label }),
          h('i', { 'aria-hidden': 'true', text: '›' })
        ))
      ))
    );
  }

  /* ---------- 작전 경과 — 연결된 작전의 단계를 위상선으로 ---------- */
  // 단계마다 가장 나쁜 부대 상태로 색을 정한다. 봉인 작전은 단계 내용을 보여주지 않는다.
  const STATUS_RANK = { normal: 0, unstable: 1, unknown: 2, split: 3, lost: 4 };
  const STATUS_CLASS = { normal: 'is-done', unstable: 'is-contact', unknown: 'is-unknown', split: 'is-loss', lost: 'is-loss' };
  const STATUS_LABEL = { normal: '정상', unstable: '불안정', unknown: '미상', split: '분열', lost: '소실' };
  // 판정 사본이 보관되면(상황 관제에서 판정을 마치면) 봉인이 풀린다.
  const isSealed = (op) => (op.unlockVerdict
    ? !root.ProjectCurseVerdictArchiveState?.isUnlocked(op.unlockVerdict)
    : /SEALED/.test(op.status || ''));

  function worstStatus(step) {
    return (step.units || []).reduce((worst, unit) => ((STATUS_RANK[unit.status] ?? 0) > (STATUS_RANK[worst] ?? 0) ? unit.status : worst), 'normal');
  }

  function operationTrack(op) {
    const steps = op.steps;
    const sealed = isSealed(op);
    const id = `tc-hist-op-${op.id}`;
    return h('section.tc-panel.tc-hist-optrack', { 'aria-labelledby': id },
      h('header.tc-panel-head', null,
        h('div', null, h('span.tc-label', { text: `OPERATION TRACK · ${op.code}` }), h('h2', { id, text: `${op.label} — 작전 경과` })),
        h('span.tc-code.tc-dim', { text: `${steps.length} STEPS · ${steps[0].time}–${steps[steps.length - 1].time}` })
      ),
      sealed
        ? h('div.tc-panel-body', null, h('div.tc-note.tc-note--danger', null, h('b', { text: 'SEALED' }), h('p', { text: `${op.status || '판정 봉인'} — 경과 기록은 판정 이후 상황 관제에서 열람한다.` })))
        : h('ol.tc-phase.tc-hist-phase', null, steps.map((step) => {
          const status = worstStatus(step);
          return h('li', { class: STATUS_CLASS[status] || 'is-done' },
            h('time', { text: step.time }),
            h('b', { text: step.title }),
            h('span', { text: STATUS_LABEL[status] || status })
          );
        })),
      h('div.tc-hist-optrack-foot', null,
        h('a.tc-btn', { href: PC.href('map-room', 'op', op.id) }, sealed ? '상황 관제에서 봉인 상태 확인' : '지도에서 경과 재생', h('i', { 'aria-hidden': 'true', text: '›' }))
      )
    );
  }

  function operationTracks(record) {
    const incidents = root.ProjectCurseIncidentNetwork?.incidentList?.filter((item) => item.history === record.id) || [];
    const ops = root.ProjectCurseMapRoom?.operations || [];
    const linked = [...new Set(incidents.map((incident) => incident.operation).filter(Boolean))]
      .map((opId) => ops.find((op) => op.id === opId))
      .filter((op) => op && op.steps && op.steps.length);
    return linked.length ? h('div.tc-hist-optracks', null, linked.map(operationTrack)) : null;
  }

  function counterPanel(record) {
    const counter = record.counterRecord;
    if (!counter) return null;
    const type = prose()?.documentTypes?.[counter.documentType];
    return h('section.tc-panel.tc-bracket.tc-bracket--occult.tc-hist-counter', { 'aria-label': type?.label || '상충 기록' },
      h('header.tc-hist-counter-head', null,
        h('span.tc-label', { text: type?.code || 'CONTESTED RECORD' }),
        h('b', { text: type?.label || '상충 기록' }),
        PC.tag('교단 측 기록', 'occult')
      ),
      h('dl.tc-kv.tc-hist-counter-kv', null,
        [['작성', counter.author], ['수신', counter.recipient], ['목적', counter.purpose], ['자료 상태', counter.provenance]]
          .filter(([, value]) => value)
          .map(([term, value]) => h('div', null, h('dt', { text: term }), h('dd', { text: value })))
      ),
      visualBlock(counter.visual),
      h('div.tc-hist-counter-body', null, (counter.fragments || []).map((fragment) => fragmentBlock(fragment, true))),
      counter.limit ? h('div.tc-note.tc-note--caution', null, h('b', { text: '두 기록을 대조할 때' }), h('p', { text: counter.limit })) : null
    );
  }

  function visualBlock(visual) {
    if (!visual?.src) return null;
    return h('figure.tc-evidence.tc-hist-visual', { dataset: { evidenceClass: visual.className || 'RECONSTRUCTED' } },
      h('div.tc-evidence-media', null, PC.img(visual.src, { alt: visual.alt || '' })),
      h('figcaption', null, h('b', { text: visual.label || 'INTERPRETIVE RECONSTRUCTION' }), h('span', { text: visual.caption || '' }))
    );
  }

  function renderDetail(id) {
    PC.clear(detailView);
    const list = records();
    const index = findIndex(id);
    const back = h('a.tc-hist-back', { href: PC.href('history'), onclick: (event) => { event.preventDefault(); PC.back('history'); } }, '← 세계 사건 연표');
    if (index < 0) {
      detailView.append(back, PC.missing('RECORD NOT FOUND', id, '이 단말의 세계 기록에 해당하는 사건이 없습니다.'));
      return { title: '기록 없음' };
    }
    const record = list[index];
    const era = chronology()?.getEra?.(record.era);
    const fragments = record.fragments || (record.paragraphs || []).map((text, i) => ({ label: `기록 ${i + 1}`, kind: 'document', text }));
    const previous = list[index - 1];
    const next = list[index + 1];
    detailView.classList.toggle('is-technology', !!record.isTechnology);

    detailView.append(
      back,
      h('header.tc-panel.tc-bracket.tc-hist-dossier', null,
        h('p.tc-hist-dossier-code', null,
          h('span.tc-label', { text: record.isTechnology ? `TECHNICAL RECORD / ${String(index + 1).padStart(2, '0')}` : `EVENT RECORD / ${String(index + 1).padStart(2, '0')}` }),
          h('span.tc-label', { text: record.documentCode || 'EDITORIAL NOTE' })
        ),
        h('time.tc-hist-date', { text: record.date }),
        h('h1', { text: record.title, 'data-tc-focus': true }),
        record.summary ? h('p.tc-hist-summary', { text: record.summary }) : null,
        h('dl.tc-kv.tc-hist-kv', null,
          h('div', null, h('dt', { text: '시대 구획' }), h('dd', { text: era ? `${era.index} / ${era.title}` : '미분류' })),
          h('div', null, h('dt', { text: '기록 판정' }), h('dd', null, verdictTag(record.evidence))),
          h('div', null, h('dt', { text: '문서 성격' }), h('dd', { text: record.documentLabel || '편집자 해설' })),
          h('div', null, h('dt', { text: '자료 상태' }), h('dd', { text: record.sourceState || '출처 상태 미등록' }))
        )
      ),
      h('details.tc-disclosure.tc-hist-context', null,
        h('summary', null, h('span', null, h('span.tc-label', { text: 'CHAIN OF CUSTODY' }), h('b', { text: '기록 근거와 한계' }))),
        h('div.tc-disclosure-body', null,
          h('p.tc-hist-basis', { text: record.basis || '판정 근거가 등록되지 않았다.' }),
          h('dl.tc-kv.tc-hist-provenance', null,
            h('div', null, h('dt', { text: '작성' }), h('dd', { text: record.author || '작성 주체 미상' })),
            h('div', null, h('dt', { text: '수신' }), h('dd', { text: record.recipient || '수신 기록 없음' })),
            h('div', null, h('dt', { text: '목적' }), h('dd', { text: record.purpose || '편찬 목적 미등록' }))
          ),
          h('div.tc-note.tc-note--caution', null, h('b', { text: '이 기록으로 확정할 수 없는 것' }), h('p', { text: record.archiveLimit || screenCopy().limitDefault }))
        )
      ),
      h('div.tc-hist-body', null,
        visualBlock(record.visual),
        fragments.map((fragment) => fragmentBlock(fragment, false)),
        counterPanel(record)
      ),
      operationTracks(record),
      relatedLinks(record),
      h('nav.tc-hist-nav', { 'aria-label': '사건 기록 이동' },
        previous
          ? h('a.tc-btn', { href: PC.href('history', previous.id), rel: 'prev' }, h('i', { text: '←' }), h('span', null, h('small', { text: '이전 사건' }), h('b', { text: previous.title })))
          : h('span.tc-hist-nav-end', { text: '첫 기록' }),
        h('a.tc-btn', { href: PC.href('history'), onclick: (event) => { event.preventDefault(); PC.back('history'); } }, '연표로 돌아가기'),
        next
          ? h('a.tc-btn.tc-hist-nav-next', { href: PC.href('history', next.id), rel: 'next' }, h('span', null, h('small', { text: '다음 사건' }), h('b', { text: next.title })), h('i', { text: '→' }))
          : h('span.tc-hist-nav-end', { text: '마지막 기록' })
      )
    );
    return { title: record.title };
  }

  /* ---------- 화면 등록 ---------- */

  function mount(el) {
    detailView = h('article.tc-hist-detail', { hidden: true });
    el.append(buildIndex(), detailView);
  }

  // 목록 스크롤 위치 — 이전·다음으로 여러 기록을 넘긴 뒤 돌아와도 보던 자리로 돌려놓는다.
  let indexScroll = 0;
  let onIndex = true;

  function show(parts, app, info) {
    const id = parts[0];
    if (!id) {
      detailView.hidden = true;
      indexView.hidden = false;
      app.setTitle('세계 기록');
      if (!onIndex && info.reason === 'push' && indexScroll) {
        const y = indexScroll;
        root.requestAnimationFrame(() => root.scrollTo(0, y));
      }
      onIndex = true;
      return;
    }
    if (onIndex && !indexView.hidden) indexScroll = root.scrollY;
    onIndex = false;
    indexView.hidden = true;
    detailView.hidden = false;
    const result = renderDetail(id);
    app.setTitle(result.title);
  }

  PC.screen({ id: 'history', mount, show });
})(window);
