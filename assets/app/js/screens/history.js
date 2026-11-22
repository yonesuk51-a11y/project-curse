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
  const openCanon = () => root.ProjectCurseOpenCanon || {};

  // 표지 — 영문만 있는 표지는 전체 보기에서만, 'EN / 한글' 겹표지는 한글만 남긴다(2026-09-25 간략/전체 보기).
  const latin = (value) => /^[A-Z0-9 .·\-–?()'&:]+$/.test(String(value).trim()) && /[A-Z]{2}/.test(String(value));
  function lbl(text) {
    const value = String(text || '');
    const [first, second] = value.split(' / ');
    if (second && latin(first) && !latin(second)) return h('span.tc-label', null, h('span.tc-full-only', { text: `${first} / ` }), h('span', { text: second }));
    if (latin(value)) return h('span.tc-label.tc-full-only', { text: value });
    return h('span.tc-label', { text: value });
  }
  // 영문 머리글 + 한글 — 간략 보기에서는 한글만
  const bi = (english, korean) => [h('span.tc-full-only', { text: `${english} / ` }), korean];

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
  // 2026-11-21 사용자 결정: 사건 연표와 세계 설정을 탭으로 나눈다. #history/world, #history/ref/<id>는 세계 설정 탭을 연다.
  let historyTabs = null;
  let indexView = null;
  let refNotice = null;
  let detailView = null;

  function turnsPanel() {
    return h('section.tc-panel.tc-bracket.tc-hist-turns', { 'aria-labelledby': 'tc-hist-turns-title' },
      h('header.tc-panel-head', null,
        h('div', null, lbl('READING PATH'), h('h2#tc-hist-turns-title', { text: '먼저 볼 네 전환점' }))
      ),
      h('ol.tc-hist-turn-list', null, (screenCopy().turns || []).map(([id, range, title, text]) => {
        const exists = findIndex(id) >= 0;
        return h('li', null, h(exists ? 'a' : 'div', { class: 'tc-hist-turn', href: exists ? PC.href('history', id) : null },
          h('time', { text: range }),
          h('b', { text: title }),
          h('span', { text: text }),
          exists ? h('em', { text: '대표 기록 보기 ›' }) : h('em.is-missing', { text: `기록 없음: ${id}` })
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
        h('div.tc-note.tc-note--evidence', null, h('b', null, bi('WORLD CONDITION', '세계의 조건')), h('p', { text: '기관은 원인이 아니라 후발 대응체계다.' }))
      ),
      h('ul.tc-hist-grid.tc-hist-grid--4', null, framework.ontology.map((item) =>
        h('li', null, lbl(item.code), h('b', { text: item.name }), h('p', { text: item.text }))
      )),
      // 존재 구분 그림 — history-screen-data.js의 ontologyVisuals[구분 코드]
      framework.ontology.map((item) => visualBlock(screenCopy().ontologyVisuals?.[item.code])),
      PC.openCanon?.(openCanon().world?.ontology || []),
      h('details.tc-disclosure.tc-hist-sub', null,
        h('summary', null, h('span', null, h('b', { text: '능력의 일곱 발현 경로와 대가' }))),
        h('ul.tc-hist-grid.tc-hist-grid--4', null, framework.abilitySources.map((item) =>
          h('li', null, h('b', { text: item.name }), h('p', { text: item.cost }))
        ))
      ),
      bloodBlock(framework.bloodArts),
      ubermenschBlock(framework.ubermensch),
      h('details.tc-disclosure.tc-hist-sub', null,
        h('summary', null, h('span', null, h('b', { text: '괴이 재난 속 민간인의 일상' }))),
        h('div.tc-disclosure-body', null, h('p.tc-hist-baseline', { text: framework.publicBaseline })),
        h('ul.tc-hist-grid.tc-hist-grid--5', null, framework.civilianSystems.map((item) =>
          h('li', null, h('b.tc-hist-coyote', { text: item.name }), h('p', { text: item.text }))
        ))
      ),
      possessionBlock(framework.reverseSiteCivilians),
      laughingBlock(framework.laughingTaken),
      risenBlock(framework.risenCorpses),
      anchorBlock(framework.anchorCall),
      mindBlock(framework.reverseMind)
    );
  }

  // 기시체와 잔류 리버스(2026-11-21 사용자 설정) — 피탈자(산 몸)와 가르고, 소각 절차는 교범으로 잇는다.
  function risenBlock(item) {
    if (!item) return null;
    return h('details.tc-disclosure.tc-hist-sub', { id: 'tc-ref-rule-risen' },
      h('summary', null, h('span', null, h('b', { text: item.label }))),
      h('div.tc-disclosure-body', null,
        h('p', { text: item.rule }),
        h('p', { text: item.handling }),
        h('p', { text: item.protocol }),
        h('p', { text: item.boundary }),
        stageGrid(item.stages, '기시체 변형 단계'),
        item.stageRule ? h('div.tc-note.tc-note--danger', null, h('b', null, bi('RISEN STAGES', '변형 단계 대응')), h('p', { text: item.stageRule })) : null,
        h('div.tc-note.tc-note--caution', null, h('b', { text: item.status }), h('p', { text: item.caution })),
        manualLink(item.manualSection)
      )
    );
  }

  // 단계 표 — 기시체 변형과 잔류물 착란이 같은 모양을 쓴다(2026-11-21 사용자 추천안 승인).
  function stageGrid(stages, label) {
    if (!stages?.length) return null;
    return h('ol.tc-hist-stages', { 'aria-label': label }, stages.map((stage) =>
      h('li', null, lbl(stage.code), h('b', { text: stage.name }), h('p', { text: stage.text }))
    ));
  }

  function manualLink(title) {
    return title ? h('p', null, h('a', { href: PC.href('field-manual') }, `현장 지침의 ${title} 보기`, h('i', { 'aria-hidden': 'true', text: ' ›' }))) : null;
  }

  // 앵커 잔류물의 부름(2026-11-21 사용자 추천안 승인) — 잔류물 곁에 오래 머문 사람의 착란 네 단계. 원인은 확인되지 않았다.
  function anchorBlock(item) {
    if (!item) return null;
    return h('details.tc-disclosure.tc-hist-sub', { id: 'tc-ref-rule-anchor' },
      h('summary', null, h('span', null, h('b', { text: item.label }))),
      h('div.tc-disclosure-body', null,
        h('p', { text: item.rule }),
        stageGrid(item.stages, '잔류물 착란 단계'),
        h('p', { text: item.handling }),
        h('div.tc-note.tc-note--caution', null, h('b', { text: item.status }), h('p', { text: item.caution })),
        manualLink(item.manualSection)
      )
    );
  }

  // 리버스 정신 반응(2026-11-21 사용자 추천안 승인) — 현실의 정신 질환을 가리키는 말로 쓰지 않는다.
  function mindBlock(item) {
    if (!item) return null;
    return h('details.tc-disclosure.tc-hist-sub', { id: 'tc-ref-rule-mind' },
      h('summary', null, h('span', null, h('b', { text: item.label }))),
      h('div.tc-disclosure-body', null,
        h('p', { text: item.rule }),
        h('ul.tc-hist-grid.tc-hist-grid--4', null, item.symptoms.map((symptom) =>
          h('li', null, lbl(symptom.code), h('b', { text: symptom.name }), h('p', { text: symptom.text }))
        )),
        h('p', { text: item.handling }),
        h('div.tc-note.tc-note--caution', null, h('b', { text: item.status }), h('p', { text: item.caution }))
      )
    );
  }

  // 웃는 피탈자(2026-11-21 사용자 설정) — 괴이화 없이 남을 해치며 기뻐한다. 판정을 통과한다. 첫 기록과 교범 항목으로 잇는다.
  function laughingBlock(item) {
    if (!item) return null;
    const index = item.record ? findIndex(item.record) : -1;
    return h('details.tc-disclosure.tc-hist-sub', { id: 'tc-ref-rule-laughing' },
      h('summary', null, h('span', null, h('b', { text: item.label }), h('small', { text: item.difference }))),
      h('div.tc-disclosure-body', null,
        h('p', { text: item.rule }),
        h('ul.tc-hist-signs', null, item.signs.map((sign) => h('li', { text: sign }))),
        h('p', { text: item.origin }),
        h('div.tc-note.tc-note--danger', null, h('b', null, bi('PASSES THE CHECK', '판정을 통과한다')), h('p', { text: item.detection })),
        h('div.tc-note.tc-note--caution', null, h('b', { text: item.status }), h('p', { text: item.caution })),
        item.record ? h('p', null, index >= 0
          ? h('a', { href: PC.href('history', item.record) }, `첫 기록 — ${records()[index].title}`, h('i', { 'aria-hidden': 'true', text: ' ›' }))
          : h('span.is-missing', { text: `${item.record} (기록 없음)` })) : null,
        manualLink(item.manualSection)
      )
    );
  }

  // 도래자(2026-11-21 사용자 설정·추천안 승인) — 넘어와 머무는 이계 종족. 종족마다 접는 칸, 계약·분대·다툼·거래·골목.
  function arrivalsBody() {
    const a = chronology()?.worldFramework?.arrivals;
    if (!a) return PC.missing('ARRIVALS MISSING', 'worldFramework.arrivals', '도래자 자료가 없습니다.');
    const index = a.record ? findIndex(a.record) : -1;
    const kv = (rows) => h('dl.tc-hist-kv', null, rows.filter(([, value]) => value).map(([term, value]) => h('div', null, h('dt', { text: term }), h('dd', { text: value }))));
    return h('div.tc-hist-ref', { id: 'tc-ref-arrivals' },
      h('p', { text: a.rule }),
      kv(a.distinctions),
      h('div.tc-note.tc-note--caution', null, h('b', { text: '머무는 대가' }), h('p', { text: a.cost })),
      h('div.tc-hist-parts', { 'aria-label': '도래자 종족' }, a.races.map((race) => h('details.tc-disclosure.tc-hist-sub', { id: `tc-ref-arrival-${race.id}` },
        h('summary', null, h('span', null, h('b', { text: race.name }), h('small', { text: race.look }))),
        h('div.tc-disclosure-body', null,
          kv([['힘', race.power], ['약속', race.bind], ['대가', race.cost], ['주로 보이는 곳', race.region], ['협력', race.work]]),
          race.note ? h('p.tc-hint', { text: race.note }) : null
        )
      ))),
      h('div.tc-hist-parts', null,
        h('div.tc-note.tc-note--evidence', { id: 'tc-ref-arrival-contract' }, h('b', { text: a.contract.title }), h('p', { text: a.contract.text }),
          h('ul.tc-hist-signs', null, a.contract.clauses.map((line) => h('li', { text: line })))),
        h('div.tc-note.tc-note--evidence', { id: 'tc-ref-arrival-squad' }, h('b', { text: a.squad.title }), h('p', { text: a.squad.text }),
          h('ul.tc-hist-signs', null, a.squad.rules.map((line) => h('li', { text: line }))))
      ),
      h('div.tc-note.tc-note--danger', null, h('b', null, a.dispute.title, ' ', verdictTag(a.dispute.grade)), h('p', { text: a.dispute.text })),
      h('ul.tc-hist-grid.tc-hist-grid--2.tc-hist-affairs', { 'aria-label': '세력과의 거래' }, a.dealings.map((deal) =>
        h('li', null, h('b', { text: deal.who }), verdictTag(deal.grade), h('p', { text: deal.text }))
      )),
      h('details.tc-disclosure.tc-hist-sub', { id: 'tc-ref-arrival-district' },
        h('summary', null, h('span', null, h('b', { text: a.district.title }), h('small', { text: '메밀묵 가게, 씨름판, 등록부 창구' }))),
        h('div.tc-disclosure-body', null,
          h('p', { text: a.district.text }),
          h('ul.tc-hist-signs', null, a.district.scenes.map((line) => h('li', { text: line })))
        )
      ),
      a.stranded ? h('details.tc-disclosure.tc-hist-sub', { id: 'tc-ref-arrival-stranded' },
        h('summary', null, h('span', null, h('b', { text: a.stranded.title }), h('small', { text: '등록이 닫힌 도래자 · 등 돌린 무리' }))),
        h('div.tc-disclosure-body', null,
          h('p', { text: a.stranded.text }),
          h('ul.tc-hist-signs', null, a.stranded.lines.map((line) => h('li', { text: line }))),
          a.stranded.dispute ? h('div.tc-note.tc-note--danger', null, h('b', null, a.stranded.dispute.title, ' ', verdictTag(a.stranded.dispute.grade)), h('p', { text: a.stranded.dispute.text })) : null
        )
      ) : null,
      a.record ? h('p', null, index >= 0
        ? h('a', { href: PC.href('history', a.record) }, `첫 계약 — ${records()[index].title}`, h('i', { 'aria-hidden': 'true', text: ' ›' }))
        : h('span.is-missing', { text: `${a.record} (기록 없음)` })) : null,
      h('p.tc-hist-caution', { text: `${a.status}. ${a.caution}` })
    );
  }

  // 이름 난 교전(2026-11-21 사용자 추천안 승인) — 교전마다 접는 칸. 병력·지형·분 단위 시각·교신·결과.
  function battlesBody() {
    const b = chronology()?.worldFramework?.battles;
    if (!b) return PC.missing('BATTLES MISSING', 'worldFramework.battles', '교전 기록이 없습니다.');
    return h('div.tc-hist-ref', { id: 'tc-ref-battles' },
      h('p', { text: b.rule }),
      h('div.tc-hist-parts', null, b.items.map((item) => {
        const index = item.record ? findIndex(item.record) : -1;
        return h('details.tc-disclosure.tc-hist-sub.tc-hist-battle', { id: `tc-ref-battle-${item.id}` },
          h('summary', null, h('span', null, h('b', { text: item.title }), h('small', { text: `${item.date} · ${item.place}` }))),
          h('div.tc-disclosure-body', null,
            h('p', null, verdictTag(item.grade)),
            h('dl.tc-hist-kv', null, item.forces.map(([side, text]) => h('div', null, h('dt', { text: side }), h('dd', { text })))),
            h('p.tc-hint', { text: item.ground }),
            h('section.tc-hist-fragment.is-log', null, h('span.tc-hist-fragment-label', { text: '현장 시각' }), logBlock(item.timeline.join('\n'))),
            h('section.tc-hist-fragment.is-quote', null, h('span.tc-hist-fragment-label', { text: '교신 발췌' }),
              h('ul.tc-hist-radio', null, item.radio.map((line) => h('li', { text: line })))),
            h('div.tc-note.tc-note--danger', null, h('b', { text: '남은 것' }), h('p', { text: item.result })),
            item.after ? h('p.tc-hint', { text: item.after }) : null,
            item.record ? h('p', null, index >= 0
              ? h('a', { href: PC.href('history', item.record) }, `함께 읽을 기록 — ${records()[index].title}`, h('i', { 'aria-hidden': 'true', text: ' ›' }))
              : h('span.is-missing', { text: `${item.record} (기록 없음)` })) : null,
            manualLink(item.manual)
          )
        );
      })),
      h('p.tc-hist-caution', { text: b.caution })
    );
  }

  // 레드존 방어선과 시설(2026-11-21 사용자 추천안 승인) — 다섯 겹, 시설 표, 블랙존, 해상 차단선
  function defenseBody() {
    const d = chronology()?.worldFramework?.redzoneDefense;
    if (!d) return PC.missing('DEFENSE MISSING', 'worldFramework.redzoneDefense', '레드존 방어선 자료가 없습니다.');
    return h('div.tc-hist-ref', { id: 'tc-ref-redzone-defense' },
      h('p', { text: d.rule }),
      h('ol.tc-hist-layers', { 'aria-label': '레드존 방어선 다섯 겹' }, d.layers.map((layer) =>
        h('li', null, h('b', { text: layer.name }), h('p', null, layer.text, h('small.tc-hist-failure', { text: ` 무너진 사례 — ${layer.failure}` })))
      )),
      refTable(d.facilities),
      h('div.tc-hist-parts', null,
        h('div.tc-note.tc-note--danger', null, h('b', { text: d.blackzone.name }), h('p', { text: d.blackzone.text }), h('p.tc-hint', { text: d.blackzone.caution })),
        h('div.tc-note.tc-note--evidence', null, h('b', { text: d.sea.name }), h('p', { text: d.sea.text }), h('p.tc-hint', { text: `무너진 사례 — ${d.sea.failure}` }))
      ),
      h('p.tc-hist-caution', { text: d.status })
    );
  }

  // 그늘의 조직(2026-11-21 사용자 추천안 승인) — P.O.H·S.O.N·프리윌. 조직마다 접는 칸 하나, 사건은 판정 등급과 함께.
  function orgsBody() {
    const o = chronology()?.worldFramework?.shadowOrgs;
    if (!o) return PC.missing('ORGS MISSING', 'worldFramework.shadowOrgs', '그늘의 조직 자료가 없습니다.');
    const factions = root.ProjectCurseFactionAnalysis?.factions || {};
    return h('div.tc-hist-ref', null,
      h('p', { text: o.rule }),
      o.orgs.map((org) => h('details.tc-disclosure.tc-hist-sub', { id: `tc-ref-org-${org.id}` },
        h('summary', null, h('span', null, h('b', { text: org.name }), h('small', { text: org.hook }))),
        h('div.tc-disclosure-body', null,
          h('p', { text: org.text }),
          refTable(org.structure),
          org.rules?.length ? h('ul.tc-hist-signs', null, org.rules.map((rule) => h('li', { text: rule }))) : null,
          h('ul.tc-hist-grid.tc-hist-grid--2.tc-hist-affairs', { 'aria-label': `${org.name} 사건` }, org.scenarios.map((sc) => {
            const index = sc.record ? findIndex(sc.record) : -1;
            return h('li', null,
              h('b', { text: sc.title }),
              h('p.tc-hist-affair-parties', { text: `${sc.date} · ${sc.place}` }),
              verdictTag(sc.grade),
              h('p', { text: sc.text }),
              sc.record ? (index >= 0
                ? h('p', null, h('a', { href: PC.href('history', sc.record) }, '연표 기록 보기', h('i', { 'aria-hidden': 'true', text: ' ›' })))
                : h('span.is-missing', { text: `${sc.record} (기록 없음)` })) : null
            );
          })),
          org.faction && factions[org.faction]
            ? h('p', null, h('a', { href: PC.href('faction-info', org.faction) }, `세력 분석에서 ${factions[org.faction].name} 보기`, h('i', { 'aria-hidden': 'true', text: ' ›' })))
            : null
        )
      )),
      h('div.tc-note.tc-note--caution', null, h('b', { text: o.status }), h('p', { text: o.caution }))
    );
  }

  // 리버스 지점의 피탈자(2026-09-25 사용자 설정) — 분류 근거는 괴이 판정표로, 교전은 교범으로 연결한다.
  function possessionBlock(item) {
    if (!item) return null;
    return h('details.tc-disclosure.tc-hist-sub', { id: 'tc-ref-rule-possession' },
      h('summary', null, h('span', null, h('b', { text: item.label }))),
      h('div.tc-disclosure-body', null,
        h('p', { text: item.rule }),
        h('p', { text: item.handling }),
        item.state ? h('p', { text: item.state }) : null,
        item.release ? h('p', { text: item.release }) : null,
        item.afterDeath ? h('p', { text: item.afterDeath }) : null,
        visualBlock(item.visual),
        h('div.tc-note.tc-note--caution', null, h('b', { text: item.status }), h('p', { text: item.caution })),
        PC.openCanon?.(openCanon().world?.reverseSiteCivilians || []),
        item.record ? h('p', null, h('a', { href: PC.href('archive-entry', item.record) }, '괴이 판정표 원문 열기', h('i', { 'aria-hidden': 'true', text: ' ›' }))) : null,
        item.manualSection ? h('p', null, h('a', { href: PC.href('field-manual') }, `현장 지침의 ${item.manualSection} 보기`, h('i', { 'aria-hidden': 'true', text: ' ›' }))) : null
      )
    );
  }

  // 혈술 네 갈래(2026-11-21 사용자 추천안 승인) — 피의 출처로 나눈다. 대응 순서는 현장 지침의 같은 이름 절로 잇는다.
  function bloodBlock(item) {
    if (!item) return null;
    return h('details.tc-disclosure.tc-hist-sub', { id: 'tc-ref-rule-blood' },
      h('summary', null, h('span', null, h('b', { text: item.label }))),
      h('div.tc-disclosure-body', null,
        h('p', { text: item.rule }),
        h('ul.tc-hist-grid.tc-hist-grid--4', null, item.branches.map((branch) =>
          h('li', null,
            lbl(branch.code),
            h('b', { text: `${branch.name} — ${branch.source}` }),
            h('p', { text: branch.arts }),
            h('p', { text: branch.cost })
          )
        )),
        h('div.tc-note.tc-note--caution', null, h('b', { text: item.status }), h('p', { text: item.caution })),
        item.manualSection ? h('p', null, h('a', { href: PC.href('field-manual') }, `현장 지침의 ${item.manualSection} 보기`, h('i', { 'aria-hidden': 'true', text: ' ›' }))) : null
      )
    );
  }

  // 위버멘시(2026-11-21 사용자 설정, 추천안 승인) — 계열별 대가와 수명, 죽은 뒤의 소각 장치. 재개 여부는 상충 기록이다.
  function ubermenschBlock(item) {
    if (!item) return null;
    return h('details.tc-disclosure.tc-hist-sub', { id: 'tc-ref-rule-ubermensch' },
      h('summary', null, h('span', null, h('b', { text: item.label }))),
      h('div.tc-disclosure-body', null,
        h('p', { text: item.rule }),
        h('p', { text: item.origin }),
        h('ul.tc-hist-grid.tc-hist-grid--3', null, item.branches.map((branch) =>
          h('li', null, lbl(branch.code), h('b', { text: branch.name }), h('p', { text: branch.power }), h('p', { text: branch.cost }))
        )),
        item.technology ? h('p', { text: item.technology }) : null,
        (item.visuals || []).map((visual) => visualBlock(visual)),
        item.maintenance ? h('div.tc-note.tc-note--evidence', null, h('b', null, bi('F.H.C — EGORIN', '안정제')), h('p', { text: item.maintenance })) : null,
        h('p', { text: item.lifespan }),
        h('p', { text: item.afterDeath }),
        h('div.tc-note.tc-note--caution', null, h('b', { text: item.status }), h('p', { text: item.caution }))
      )
    );
  }

  // 구역 판정과 존의 층(2026-11-21 사용자 추천안 승인) — 구역 판정은 땅의 상태, 판정 등급은 기록의 상태다. 둘을 섞지 않는다.
  function zoneBody() {
    const zone = chronology()?.worldFramework?.zoneGrading;
    if (!zone) return PC.missing('ZONE GRADES MISSING', 'worldFramework.zoneGrading', '구역 판정 데이터가 없습니다.');
    return h('div.tc-hist-ref', null,
      h('div.tc-hist-ref-lead', null,
        h('p', { text: zone.rule }),
        h('div.tc-note.tc-note--evidence', null, h('b', null, bi('ZONE RULE', '판정 기준')), h('p', { text: zone.handling }))
      ),
      h('ul.tc-hist-grid.tc-hist-grid--3', null, zone.grades.map((grade) =>
        h('li', null, lbl(grade.code), h('b', { text: grade.name }), h('p', { text: grade.text }), h('p.tc-hist-zone-example', { text: grade.example }))
      )),
      h('details.tc-disclosure.tc-hist-sub', null,
        h('summary', null, h('span', null, h('b', { text: '존의 일곱 층 — 바깥에서 안쪽으로' }))),
        h('ol.tc-hist-layers', null, zone.layers.map((layer) =>
          h('li', { class: layer.event ? 'is-event' : null },
            h('b', null, layer.name, layer.event ? PC.tag('사건 층', 'danger') : null),
            h('p', { text: layer.text })
          )
        ))
      ),
      h('details.tc-disclosure.tc-hist-sub', null,
        h('summary', null, h('span', null, h('b', { text: '존 이름을 붙이는 세 층' }))),
        h('ul.tc-hist-grid.tc-hist-grid--3', null, zone.naming.map((name) =>
          h('li', null, lbl(name.code), h('b', { text: name.name }), h('p', { text: name.text }))
        )),
        // 실제 이름 예 — 공식 판정명 / 현지 관습명 / 귀환자 구어
        h('ul.tc-hist-grid.tc-hist-grid--5', { 'aria-label': '존 이름 예' }, (zone.zones || []).map((item) =>
          h('li', null, h('b', { text: item.official }), h('p', { text: `현지 — ${item.local}` }), h('p', { text: `구어 — ${item.spoken}` }))
        ))
      ),
      h('div.tc-note.tc-note--caution', null, h('b', { text: zone.status }), h('p', { text: zone.caution }))
    );
  }

  // 국가 간 정세(2026-11-21 사용자 추천안 승인) — 결론이 기록되지 않은 상황만 적는다. 관련 기록으로 잇는다.
  function interstateBody() {
    const affairs = chronology()?.worldFramework?.interstateAffairs;
    if (!affairs) return PC.missing('INTERSTATE MISSING', 'worldFramework.interstateAffairs', '국가 간 정세 데이터가 없습니다.');
    return h('div.tc-hist-ref', null,
      h('div.tc-hist-ref-lead', null,
        h('p', { text: affairs.rule }),
        h('div.tc-note.tc-note--caution', null, h('b', null, bi('OPEN SITUATIONS', '결론 없는 상황')), h('p', { text: affairs.status }))
      ),
      h('ul.tc-hist-grid.tc-hist-grid--2.tc-hist-affairs', null, affairs.items.map((item) =>
        h('li', null,
          h('b', { text: item.title }),
          h('p.tc-hist-affair-parties', { text: item.parties }),
          PC.tag(item.status, 'caution'),
          h('p', { text: item.text }),
          h('p.tc-hist-affair-open', { text: `정해지지 않은 점 — ${item.open}` }),
          h('p.tc-hist-affair-links', null, (item.records || []).map((id) => {
            const index = findIndex(id);
            return index >= 0
              ? h('a', { href: PC.href('history', id) }, records()[index].title, h('i', { 'aria-hidden': 'true', text: ' ›' }))
              : h('span.is-missing', { text: `${id} (기록 없음)` });
          }))
        )
      ))
    );
  }

  // 세계가 지고 있다(2026-11-21 사용자 결정) — 종말 시계는 정보 추정. 항목마다 판정 등급을 함께 보인다.
  function declineBody() {
    const decline = chronology()?.worldFramework?.worldDecline;
    if (!decline) return PC.missing('DECLINE MISSING', 'worldFramework.worldDecline', '세계가 지고 있다 데이터가 없습니다.');
    const groups = [...new Set(decline.items.map((item) => item.group))];
    return h('div.tc-hist-ref', null,
      h('div.tc-hist-ref-lead', null,
        h('p', { text: decline.rule }),
        h('div.tc-note.tc-note--danger', null, h('b', null, decline.clock.label, ' ', verdictTag(decline.clock.grade)), h('p', { text: decline.clock.text }))
      ),
      groups.map((group) => h('details.tc-disclosure.tc-hist-sub', null,
        h('summary', null, h('span', null, h('b', { text: group }))),
        h('ul.tc-hist-grid.tc-hist-grid--2.tc-hist-affairs', null, decline.items.filter((item) => item.group === group).map((item) =>
          h('li', null, h('b', { text: item.title }), verdictTag(item.grade), h('p', { text: item.text }))
        ))
      )),
      h('div.tc-note.tc-note--caution', null, h('b', { text: decline.status }), h('p', { text: '판정 등급이 ‘정보 추정’이나 ‘증언 기반’인 항목은 확정된 사실이 아니다.' }))
    );
  }

  // 리버스 아래의 삶(2026-11-21 사용자 결정) — zoneLife·worldOrder·fieldCulture 52항목을 주제 일곱 갈래로 보인다.
  // 항목마다 한 줄 훅과 문서 모양을 먼저 보이고, 본문은 접는다(전체 보기에서는 펼친 채로 그린다). 끝에 이어지는 기록을 단다.
  const SIGNAL_AT = { 'sacrifice-list': 'sig-2', 'broadcast-announcer': 'sig-6' };

  // 무대 도시(2026-11-21 사용자 결정) — 카르벤 격리시, 마로아 자치시
  function cities() {
    return chronology()?.worldFramework?.cities || [];
  }

  function lifeItems() {
    const framework = chronology()?.worldFramework || {};
    return ['zoneLife', 'worldOrder', 'fieldCulture'].flatMap((key) => framework[key]?.items || []);
  }

  // 이어지는 기록의 이름표 — 삶 항목, 구술 증언, 카르벤 격리시, 주민 일지
  function refTitles() {
    const framework = chronology()?.worldFramework || {};
    const titles = new Map(lifeItems().map((item) => [item.id, item.title]));
    (framework.oralTestimony?.items || []).forEach((entry) => titles.set(entry.id, `증언 — ${entry.speaker.split(' / ')[0]}`));
    cities().forEach((city) => titles.set(city.id, city.label));
    const diary = cities().find((city) => city.id === 'karven')?.diary;
    if (diary) titles.set('diary', diary.title);
    return titles;
  }

  function linkChips(links, titles) {
    if (!links?.length) return null;
    return h('p.tc-hist-links', null,
      h('span', { text: '이어지는 기록' }),
      links.map((id) => titles.has(id)
        ? h('a', { href: PC.href('history', 'ref', id) }, titles.get(id), h('i', { 'aria-hidden': 'true', text: ' ›' }))
        : h('span.is-missing', { text: `${id} (기록 없음)` }))
    );
  }

  // 문서 모양 — 배급증 양식, 약관 조항, 방송 문안. 가림 막대는 richText가 그린다.
  function docBlock(doc) {
    if (!doc?.lines?.length) return null;
    const STAMP = { form: '접수', clause: '약관', script: '송출' };
    return h(`figure.tc-hist-doc.tc-paper.is-${doc.kind || 'form'}`, { 'data-stamp': STAMP[doc.kind] || '사본' },
      h('figcaption', { text: doc.title }),
      h('ol', null, doc.lines.map((line) => h('li', null, richText(line))))
    );
  }

  // 지난 방문 뒤 새로 생긴 항목(pc-updates.js의 life 분류). 첫 방문이면 비어 있다.
  const freshLife = () => new Set(root.PCUpdates?.fresh?.('life') || []);

  function lifeItem(item, titles, fresh) {
    const signal = SIGNAL_AT[item.id];
    return h('li.tc-hist-life', { id: `tc-ref-${item.id}` },
      h('header', null, h('b', { text: item.title }), h('span.tc-hist-life-tags', null, fresh?.has(item.id) ? PC.tag('새', 'evidence') : null, verdictTag(item.grade))),
      item.hook ? h('p.tc-hist-hook', { text: item.hook }) : null,
      docBlock(item.doc),
      h('details.tc-more', { open: PC.density?.() === 'full' },
        h('summary', null, h('span', { text: '본문' })),
        h('div.tc-more-body', null,
          h('p', { text: item.text }),
          item.excerpt ? h('figure.tc-hist-excerpt.tc-paper', { 'data-stamp': '유출' },
            h('figcaption', null, lbl('LEAKED EXCERPT'), h('span', { text: item.excerpt.label })),
            h('ol', null, item.excerpt.lines.map((line) => h('li', null, richText(line))))
          ) : null,
          stageGrid(item.stages, `${item.title} 단계`),
          wantedList(item.wanted),
          (item.tables || []).map((table) => refTable(table)),
          signal ? PC.signalMark?.(signal) : null,
          manualLink(item.manualSection),
          // 2026-11-22 사용자 결정: 메타 설명(현실에서 따온 것, 자캐에 쓰는 법)은 기록 본문과 따로 '자캐에 쓰기' 줄로
          item.tip ? h('p.tc-hist-tip', null, h('b', { text: '자캐에 쓰기' }), h('span', { text: item.tip })) : null,
          // 2026-11-21 사용자 결정: 이어지는 기록은 본문을 열었을 때만, 둘까지
          linkChips((item.links || []).slice(0, 2), titles)
        )
      )
    );
  }

  function lifeBody() {
    const intro = chronology()?.worldFramework?.lifeIntro;
    const items = lifeItems();
    if (!intro?.themes?.length || !items.length) return PC.missing('LIFE MISSING', 'worldFramework.lifeIntro', '리버스 아래의 삶 데이터가 없습니다.');
    const titles = refTitles();
    const fresh = freshLife();
    const stray = items.filter((item) => !intro.themes.includes(item.group));
    return h('div.tc-hist-ref', null,
      h('div.tc-hist-ref-lead', null,
        h('p', { text: intro.rule }),
        h('div.tc-note.tc-note--caution', null, h('b', null, bi('LIFE UNDER REVERSE', '판정 등급')), h('p', { text: intro.status }))
      ),
      intro.themes.map((theme) => {
        const list = items.filter((item) => item.group === theme);
        const added = list.filter((item) => fresh.has(item.id)).length;
        return h('details.tc-disclosure.tc-hist-sub', null,
          h('summary', null, h('span', null, h('b', { text: theme }), h('small', { text: added ? `${list.length}건 · 새 ${added}` : `${list.length}건` }))),
          h('ul.tc-hist-grid.tc-hist-grid--2.tc-hist-lifelist', null, list.map((item) => lifeItem(item, titles, fresh)))
        );
      }),
      stray.length ? PC.missing('THEME MISSING', stray.map((item) => `${item.id}:${item.group}`).join(', '), '갈래가 정해지지 않은 항목이 있습니다.') : null
    );
  }

  // 카르벤 주민 일지(2026-11-21 사용자 결정) — release(실제 공개일)가 지난 장만 보인다. 오늘 열린 장에는 표지를 단다.
  function localDay() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  // 주민 일지 — 카르벤은 #history/ref/diary, 다른 도시는 #history/ref/diary-<도시>(2026-11-22 다마 감시구 추가)
  function diaryBody(cityId = 'karven') {
    const diary = cities().find((city) => city.id === cityId)?.diary;
    if (!diary?.entries?.length) return PC.missing('DIARY MISSING', `worldFramework.cities[${cityId}].diary`, '주민 일지가 없습니다.');
    const today = localDay();
    const open = diary.entries.filter((entry) => entry.release <= today);
    return h('div.tc-hist-ref', { id: cityId === 'karven' ? 'tc-ref-diary' : `tc-ref-diary-${cityId}` },
      h('div.tc-hist-ref-lead', null,
        h('p', { text: diary.source }),
        h('div.tc-note.tc-note--evidence', null, h('b', null, bi('RECOVERED DIARY', `${open.length}/${diary.entries.length}장`)), h('p', { text: diary.limit }))
      ),
      h('ol.tc-hist-diary', null, open.map((entry) =>
        h('li.tc-paper', { 'data-stamp': '회수 사본' },
          h('header', null, h('time.tc-code', { text: entry.date }), h('b', { text: entry.title }), entry.release === today ? PC.tag('오늘 올라온 장', 'evidence') : (freshLife().has(entry.id) ? PC.tag('새 장', 'evidence') : null)),
          entry.lines.map((line) => h('p', { text: line }))
        )
      )),
      open.length < diary.entries.length ? h('p.tc-hist-diary-pending', { text: diary.pending }) : null,
      h('dl.tc-kv', null,
        h('div', null, h('dt', { text: '작성자' }), h('dd', { text: diary.author })),
        h('div', null, h('dt', { text: '받는 곳' }), h('dd', { text: diary.recipient }))
      )
    );
  }

  // 묶음 항목의 작은 표 — 은어, 금지곡, 축일, 훈련 과정, 계급·훈장. 좁은 화면에서는 칸 제목을 줄마다 붙인다.
  function refTable(table) {
    if (!table?.rows?.length) return null;
    // 칸 수는 표마다 달라서 grid 틀을 변수(--tpl)로 넘긴다. 좁은 화면 CSS가 한 칸으로 덮는다.
    const tpl = `minmax(6rem, .8fr) repeat(${Math.max(1, table.headers.length - 1)}, minmax(0, 2fr))`;
    return h('div.tc-hist-table', { role: 'table', 'aria-label': table.caption, style: `--tpl:${tpl}` },
      h('p.tc-hist-table-cap', { text: table.caption }),
      h('div.tc-hist-tr.tc-hist-th', { role: 'row' }, table.headers.map((head) => h('span', { role: 'columnheader', text: head }))),
      table.rows.map((row) => h('div.tc-hist-tr', { role: 'row' },
        row.map((cell, index) => h('span', { role: 'cell', 'data-head': table.headers[index] }, index === 0 ? h('b', { text: cell }) : cell))
      ))
    );
  }

  // 무대 도시(2026-11-21 사용자 추천안 승인) — 구역 판정 이름은 zoneGrading에서 읽는다. 소문은 소문 표지를 단다.
  // 카르벤에는 수신 조각과 2041 항구구 기록 링크가 붙는다.
  function cityBody(city) {
    const framework = chronology()?.worldFramework || {};
    if (!city) return PC.missing('CITY FILE MISSING', 'worldFramework.cities', '도시 기록이 없습니다.');
    const grades = framework.zoneGrading?.grades || [];
    const recordIndex = city.record ? findIndex(city.record) : -1;
    return h('div.tc-hist-ref', { id: `tc-ref-${city.id}` },
      h('div.tc-hist-ref-lead', null,
        city.hook ? h('p.tc-hist-city-hook', { text: city.hook }) : null,
        h('p', { text: city.rule }),
        h('div.tc-note.tc-note--evidence', null, h('b', null, bi('CITY FILE', city.region)), h('p', { text: city.population }))
      ),
      h('ul.tc-hist-grid.tc-hist-grid--3.tc-hist-city', null, city.districts.map((district) => {
        const grade = grades.find((item) => item.code === district.grade);
        return h('li', null,
          lbl(district.code),
          h('b', { text: district.name }),
          grade ? PC.tag(grade.name, ['SEALED', 'QUARANTINE', 'SILENT'].includes(grade.code) ? 'danger' : 'caution') : h('span.is-missing', { text: `${district.grade} (판정 없음)` }),
          h('p.tc-hist-city-places', { text: district.places }),
          h('p', { text: district.note })
        );
      })),
      city.id === 'karven' ? PC.signalMark?.('sig-4') : null,
      city.record ? h('p.tc-hist-city-record', null, recordIndex >= 0
        ? h('a', { href: PC.href('history', city.record) }, `연표 기록 — ${records()[recordIndex].title}`, h('i', { 'aria-hidden': 'true', text: ' ›' }))
        : h('span.is-missing', { text: `${city.record} (기록 없음)` })) : null,
      h('details.tc-disclosure.tc-hist-sub', null,
        h('summary', null, h('span', null, h('b', { text: '도시에 도는 소문' }), h('small', { text: `${city.rumors.length}건` }))),
        h('ul.tc-hist-rumors', null, city.rumors.map((rumor) => h('li', null, PC.tag('소문', 'evidence'), h('p', { text: rumor }))))
      ),
      h('div.tc-note.tc-note--caution', null, h('b', { text: city.status }), h('p', { text: city.caution }))
    );
  }

  // 수배 목록 — 호출명, 분류, 혐의, 주의. 실명은 쓰지 않는다.
  function wantedList(entries) {
    if (!entries?.length) return null;
    return h('ul.tc-hist-wanted', { 'aria-label': '수배 목록' }, entries.map((entry) =>
      h('li', null,
        h('header', null, lbl(entry.code), h('b', { text: entry.alias })),
        h('p.tc-hist-wanted-kind', { text: entry.kind }),
        h('p', { text: entry.charge }),
        h('p.tc-hist-wanted-note', { text: entry.note })
      )
    ));
  }

  // 구술 증언집(2026-11-21 사용자 추천안 승인) — 받아 적은 말이다. 사실 확인은 하지 않았다. 대사는 문장 개정 대상이 아니다.
  function testimonyBody() {
    const oral = chronology()?.worldFramework?.oralTestimony;
    if (!oral) return PC.missing('ORAL TESTIMONY MISSING', 'worldFramework.oralTestimony', '구술 증언집 데이터가 없습니다.');
    const life = chronology()?.worldFramework?.zoneLife?.items || [];
    return h('div.tc-hist-ref', null,
      h('div.tc-hist-ref-lead', null,
        h('p', { text: oral.rule }),
        h('div.tc-note.tc-note--evidence', null, h('b', null, bi('RECORD PURPOSE', '기록 목적')), h('p', { text: oral.purpose }))
      ),
      h('ul.tc-hist-testimonies', null, oral.items.map((entry) => {
        const topic = life.find((item) => item.id === entry.item);
        return h('li.tc-paper', { id: `tc-ref-${entry.id}`, 'data-stamp': '구술' },
          h('header', null,
            h('b', { text: entry.speaker }),
            h('small', { text: `${entry.date} · ${entry.place}` }),
            topic ? h('a.tc-hist-topic', { href: PC.href('history', 'ref', topic.id) }, PC.tag(topic.title, 'evidence')) : h('span.is-missing', { text: `${entry.item} (항목 없음)` })
          ),
          h('blockquote', null, entry.lines.map((line) => h('p', { text: line }))),
          h('p.tc-hist-caution', { text: `기록 한계 — ${entry.limit}` })
        );
      })),
      h('div.tc-note.tc-note--caution', null, h('b', { text: oral.status }), h('p', { text: '증언은 증언자가 겪었다고 말한 것이다. 확정된 사실로 쓰지 않는다.' }))
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
        h('p', { text: '세계가 어떻게 어긋나 있는지 본 기록 세 가지다. 어느 기관도 확인하지 못해서, 셋 다 결정 대기로 남아 있다.' }),
        h('div.tc-note.tc-note--caution', null, h('b', null, bi('UNCONFIRMED PATTERNS', '확인되지 않은 규칙')), h('p', { text: '사례를 같은 원인으로 묶는 근거로 쓰지 않는다.' }))
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
        h('div', null, lbl(program.code), h('b', { text: program.name }), h('p', { text: program.purpose })),
        h('dl', null,
          h('div', null, h('dt', null, bi('PERIOD', '기간')), h('dd', { text: program.period })),
          h('div', null, h('dt', null, bi('STATUS', '상태')), h('dd.is-sealed', { text: program.status }))
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
        h('li', null, lbl(item.label), h('p', { text: item.text }))
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
      h('summary', null, h('span', null, lbl(code), h('b', { text: title }), h('small', { text: hint }))),
      h('div.tc-disclosure-body', null, body)
    );
    // 2026-11-21 사용자 결정: 묶음 열하나를 다섯으로 줄였다. 묶음 안은 다시 접는 칸으로 나눈다.
    const sub = (title, hint, body) => h('details.tc-disclosure.tc-hist-sub.tc-hist-part', null,
      h('summary', null, h('span', null, h('b', { text: title }), hint ? h('small', { text: hint }) : null)),
      h('div.tc-disclosure-body', null, body)
    );
    const lifeCount = lifeItems().length;
    return h('div.tc-hist-refs', null,
      item('WORLD RULES', '세계의 기본 규칙', '존재 구분·발현 대가·몸과 죽음의 규칙·도래자', h('div.tc-hist-parts', null,
        frameworkBody(),
        sub('도래자 — 건너와 머무는 이들', '도깨비·길손·맡은이·산손·물손·재지기, 이름 계약', arrivalsBody())
      )),
      item('LAND AND STATES', '땅과 나라', '구역 판정·국가 간 정세·방어선·교전·그늘의 조직', h('div.tc-hist-parts', null,
        sub('구역 판정과 존의 층', '여섯 판정·일곱 층·세 이름', zoneBody()),
        sub('국가 간 정세', '결론이 기록되지 않은 상황', interstateBody()),
        sub('세계가 지고 있다', '종말 시계와 열 기록', declineBody()),
        sub('레드존 방어선과 시설', '다섯 겹·방어 시설·블랙존·해상 차단선', defenseBody()),
        sub('이름 난 교전', '성채 문·연료선·셋째 역·연료 창고·해안 철수선', battlesBody()),
        sub('그늘의 조직', 'P.O.H·S.O.N·프리윌', orgsBody())
      )),
      item('LIFE UNDER REVERSE', '리버스 아래의 삶', `일곱 갈래 ${lifeCount}항목 · 한 줄씩 먼저`, lifeBody()),
      item('VOICES AND PLACES', '목소리와 장소', `${cities().map((city) => city.label).join('·')}·주민 일지 ${cities().filter((city) => city.diary).length}·구술 증언`, h('div.tc-hist-parts', null,
        cities().map((city) => sub(city.label, `${city.region} · ${city.districts?.length || 0}구와 소문`, cityBody(city))),
        sub(cities().find((city) => city.id === 'karven')?.diary?.title || '주민 일지', '날마다 한 장씩 올라온다', diaryBody()),
        cities().filter((city) => city.id !== 'karven' && city.diary).map((city) => sub(city.diary.title, `${city.label} · 날마다 한 장씩`, diaryBody(city.id))),
        sub('구술 증언집', 'S.I.D 사회 기록반', testimonyBody())
      )),
      item('UNCONFIRMED', '확인되지 않은 것들', '세 규칙·일본 기술 도약의 계보', h('div.tc-hist-parts', null,
        sub('확인되지 않은 세 규칙', '관측·봉쇄·능력 상한', observationsBody()),
        sub('일본 기술 도약의 계보', '1982–1992 계측 계획', technologyBody())
      ))
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
      h('div.tc-hist-controls-head', null, lbl('ERA FILTER / 시대 선택'), status),
      seg,
      h('details.tc-disclosure.tc-hist-key', null,
        h('summary', null, h('span', null, lbl('CANON KEY'), h('b', { text: '기록의 확실성과 아직 결정되지 않은 설정' }))),
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
            h('small', null, era.range, h('span.tc-full-only', { text: ` / ${era.summary}` })),
            h('em.tc-full-only', { text: landmark })
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
    const chrono = h('div.tc-hist-tabbody', null,
      turnsPanel(),
      controls(),
      eraIndex()
    );
    const world = h('div.tc-hist-tabbody', null,
      h('p.tc-hist-tab-lead', { text: '여기에는 사건 대신 세계가 돌아가는 방식을 모았다. 기본 규칙, 땅과 나라, 사람들의 삶, 도시와 목소리로 나눠 본다.' }),
      refNotice = h('div.tc-hist-refnotice'),
      referenceStack()
    );
    historyTabs = PC.tabs({
      id: 'tc-hist', label: '세계 기록 보기', active: 'chrono',
      items: [
        { id: 'chrono', title: '사건 연표', hint: `${list.length}개 사건 · ${eras.length}개 시대`, body: chrono },
        { id: 'world', title: '세계 설정', hint: '규칙·땅과 나라·삶·도시와 목소리', body: world }
      ]
    });
    indexView = h('div.tc-hist-indexview', null,
      PC.screenHead('history', {
        title: '세계 기록',
        desc: '세계는 어느 날 한꺼번에 무너지지 않았다. 오래된 금기를 기술이 재기 시작했고, 대응기관은 적을 닮아 갔다. 그러다 한 대륙과 연락이 끊겼다. 이 일들이 수십 년에 걸쳐 겹쳤다. 사건 연표로 흐름을 잡고, 세계 설정에서 세계가 돌아가는 방식을 본다.',
        meta: [['SPAN', 'ORIGIN?–2042'], ['INDEX', `${list.length} RECORDS`], ['ERAS', String(eras.length)]]
      }),
      historyTabs.tablist,
      historyTabs.panels
    );
    renderIndex();
    return indexView;
  }

  function setTab(id, focus) {
    historyTabs?.set(id, focus);
  }

  /* ---------- 사건 기록 ---------- */

  // 2026-11-21 사용자 결정: 관련 기록은 접는 칸 하나에 넣는다. 이전·다음 기록 이동은 밖에 둔다.
  function relatedFold(record) {
    const panel = relatedLinks(record);
    if (!panel) return null;
    const count = panel.querySelectorAll('a').length;
    return h('details.tc-disclosure.tc-hist-related', null,
      h('summary', null, h('span', null, lbl('CROSS REFERENCE'), h('b', { text: '관련 기록 열기' }), h('small', { text: `${count}건` }))),
      h('div.tc-disclosure-body', null, panel)
    );
  }

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
      if (incident.operation && mappedOps.has(incident.operation)) links.push([`${incident.title} 작전`, 'OPERATION / 작전 진행', PC.href('map-room', 'op', incident.operation), 'op']);
    });
    synchrony.forEach((event) => links.push([`${event.title} 관측도 · ${event.points.length}개 신호`, '2042 SIGNAL LAYER / 동시 관측', PC.href('map-room', 'synchrony', event.id), 'signal']));
    factions.forEach((key) => links.push([`${canonFactions[key].name} 분석`, 'DOSSIER / 세력 문서', PC.href('faction-info', key)]));
    archives.forEach((id) => links.push([`${id} 기록`, 'RECOVERED / 회수 원문', PC.href('archive-entry', id)]));
    if (!links.length) return null;
    return h('section.tc-panel.tc-bracket.tc-hist-links', { 'aria-labelledby': 'tc-hist-links-title' },
      h('header.tc-panel-head', null, h('div', null, lbl('CROSS REFERENCE'), h('h2#tc-hist-links-title', { text: '관련 기록' }))),
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
  // 판정 기록이 보관되면(작전 지도에서 판정을 마치면) 봉인이 풀린다.
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
        h('div', null, lbl(`OPERATION TRACK · ${op.code}`), h('h2', { id, text: `${op.label} — 작전 진행` })),
        h('span.tc-code.tc-dim', { text: `${steps.length} STEPS · ${steps[0].time}–${steps[steps.length - 1].time}` })
      ),
      sealed
        ? h('div.tc-panel-body', null, h('div.tc-note.tc-note--danger', null, h('b', null, bi('SEALED', '봉인')), h('p', { text: `${op.status || '판정 봉인'} — 진행 기록은 판정을 마친 뒤 작전 지도에서 볼 수 있다.` })))
        : h('ol.tc-phase.tc-hist-phase', null, steps.map((step) => {
          const status = worstStatus(step);
          return h('li', { class: STATUS_CLASS[status] || 'is-done' },
            h('time', { text: step.time }),
            h('b', { text: step.title }),
            h('span', { text: STATUS_LABEL[status] || status })
          );
        })),
      h('div.tc-hist-optrack-foot', null,
        h('a.tc-btn', { href: PC.href('map-room', 'op', op.id) }, sealed ? '작전 지도에서 봉인 상태 확인' : '지도에서 진행 다시 보기', h('i', { 'aria-hidden': 'true', text: '›' }))
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
        lbl(type?.code || 'CONTESTED RECORD'),
        h('b', { text: type?.label || '상충 기록' }),
        PC.tag('교단 측 기록', 'occult')
      ),
      h('dl.tc-kv.tc-hist-counter-kv', null,
        [['작성', counter.author], ['받는 곳', counter.recipient], ['목적', counter.purpose], ['자료 상태', counter.provenance]]
          .filter(([, value]) => value)
          .map(([term, value]) => h('div', null, h('dt', { text: term }), h('dd', { text: value })))
      ),
      visualBlock(counter.visual),
      h('div.tc-hist-counter-body', null, (counter.fragments || []).map((fragment) => fragmentBlock(fragment, true))),
      counter.limit ? h('div.tc-note.tc-note--caution', null, h('b', { text: '두 기록을 맞춰 볼 때' }), h('p', { text: counter.limit })) : null
    );
  }

  function visualBlock(visual, record) {
    if (!visual?.src) return null;
    // 감식 보기(pc-inspect.js)가 읽는 기록 번호·날짜. 모르는 값은 붙이지 않는다
    const evidence = { evidenceClass: visual.className || 'RECONSTRUCTED' };
    if (record?.id) evidence.record = record.id;
    if (record?.date) evidence.dtg = String(record.date);
    return h('figure.tc-evidence.tc-hist-visual', { dataset: evidence },
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
          lbl(record.documentCode || 'EDITORIAL NOTE')
        ),
        h('time.tc-hist-date', { text: record.date }),
        h('h1', { text: record.title, 'data-tc-focus': true }),
        record.summary ? h('p.tc-hist-summary', { text: record.summary }) : null,
        variantLine(record),
        h('dl.tc-kv.tc-hist-kv', null,
          h('div', null, h('dt', { text: '시대 구획' }), h('dd', { text: era ? `${era.index} / ${era.title}` : '미분류' })),
          h('div', null, h('dt', { text: '기록 판정' }), h('dd', null, verdictTag(record.evidence))),
          h('div', null, h('dt', { text: '문서 성격' }), h('dd', { text: record.documentLabel || '편집자 해설' })),
          h('div', null, h('dt', { text: '자료 상태' }), h('dd', { text: record.sourceState || '출처 상태 미등록' }))
        )
      ),
      h('details.tc-disclosure.tc-hist-context', null,
        h('summary', null, h('span', null, lbl('CHAIN OF CUSTODY'), h('b', { text: '기록 근거와 한계' }))),
        h('div.tc-disclosure-body', null,
          h('p.tc-hist-basis', { text: record.basis || '판정 근거가 등록되지 않았다.' }),
          h('dl.tc-kv.tc-hist-provenance', null,
            h('div', null, h('dt', { text: '작성' }), h('dd', { text: record.author || '작성 주체 미상' })),
            h('div', null, h('dt', { text: '받는 곳' }), h('dd', { text: record.recipient || '받는 곳 기록 없음' })),
            h('div', null, h('dt', { text: '목적' }), h('dd', { text: record.purpose || '편찬 목적 미등록' }))
          ),
          h('div.tc-note.tc-note--caution', null, h('b', { text: '이 기록으로 확정할 수 없는 것' }), h('p', { text: record.archiveLimit || screenCopy().limitDefault }))
        )
      ),
      h('div.tc-hist-body', null,
        visualBlock(record.visual, record),
        fragments.map((fragment) => fragmentBlock(fragment, false)),
        counterPanel(record),
        PC.openCanon?.(openCanon().history?.[record.id] || [])
      ),
      // 기본 append는 null을 'null' 글자로 넣는다 — 없는 칸은 빈 문자열로 넘긴다
      operationTracks(record) || '',
      relatedFold(record) || '',
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

  /* ---------- 이상 층 연출 (2026-11-21 사용자 결정) ---------- */
  // 정보는 가리지 않는다. 세 이름은 본문에 모두 남고, 시계는 몇 초 뒤 다시 간다.
  // 이름이 갈린 나라 — 들어올 때마다 기록이 부르는 이름이 셋 가운데 하나로 바뀐다.
  function variantLine(record) {
    const names = record.nameVariants || [];
    if (names.length < 2) return null;
    const pick = names[Math.floor(Math.random() * names.length)];
    const other = names.filter((name) => name !== pick);
    return h('p.tc-hist-variant', null,
      '이 기록이 부르는 나라 — ',
      h('b', { text: pick, dataset: { tcAnomaly: 'name', tcAnomalyAlt: other[Math.floor(Math.random() * other.length)] } })
    );
  }

  let clockTimer = 0;
  function releaseClock() {
    root.clearTimeout(clockTimer);
    clockTimer = 0;
    delete root.document.documentElement.dataset.clockHold;
  }
  // 무응답 구역 기록 — 상단 바 시계가 7초 동안 멈춘다. 결계 안 방송이 있는 기록은 방송 윤곽음을 한 번 낸다.
  function atmosphere(record) {
    releaseClock();
    if (record?.silentZone) {
      root.document.documentElement.dataset.clockHold = 'on';
      clockTimer = root.setTimeout(releaseClock, 7000);
    }
    if (record?.broadcast) root.PCAudio?.broadcast?.();
  }

  function hide() {
    releaseClock();
    root.clearTimeout(refTimer);
  }

  /* ---------- 화면 등록 ---------- */

  function mount(el) {
    detailView = h('article.tc-hist-detail', { hidden: true });
    el.append(buildIndex(), detailView);
  }

  // 목록 스크롤 위치 — 이전·다음으로 여러 기록을 넘긴 뒤 돌아와도 보던 자리로 돌려놓는다.
  let indexScroll = 0;
  let onIndex = true;

  // #history/ref/<id> — 묶음 안의 항목으로 바로 간다. 감싼 접는 칸을 모두 펼치고 항목에 초점을 둔다. 없는 id는 없다고 표시한다.
  let refTimer = 0;
  function openRef(id) {
    root.clearTimeout(refTimer);
    refNotice?.replaceChildren();
    root.document.querySelectorAll('.tc-hist-refs .is-target').forEach((el) => el.classList.remove('is-target'));
    const target = id ? root.document.getElementById(`tc-ref-${id}`) : null;
    if (!target) {
      refNotice?.append(PC.missing('REFERENCE NOT FOUND', `history/ref/${id || ''}`, '세계 기록에 이 항목이 없습니다.'));
      return;
    }
    for (let node = target; node; node = node.parentElement) if (node.tagName === 'DETAILS') node.open = true;
    target.querySelector(':scope > details')?.setAttribute('open', '');
    target.classList.add('is-target');
    // 셸이 화면을 맨 위로 올리고 제목에 초점을 둔 다음에 옮긴다
    refTimer = root.setTimeout(() => {
      target.scrollIntoView({ block: 'start', behavior: PC.fx() === 'reduced' ? 'auto' : 'smooth' });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }, 60);
  }

  function show(parts, app, info) {
    const id = parts[0];
    releaseClock();
    if (!id || id === 'ref' || id === 'world') {
      detailView.hidden = true;
      indexView.hidden = false;
      app.setTitle('세계 기록');
      if (id === 'ref' || id === 'world') setTab('world');
      if (id === 'ref') {
        openRef(parts[1]);
      } else if (id === 'world') {
        refNotice?.replaceChildren();
      } else {
        refNotice?.replaceChildren();
        if (!onIndex && info.reason === 'push' && indexScroll) {
          const y = indexScroll;
          root.requestAnimationFrame(() => root.scrollTo(0, y));
        }
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
    atmosphere(records()[findIndex(id)]);
  }

  PC.screen({ id: 'history', mount, show, hide });
})(window);
