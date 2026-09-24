// Project Curse 6 — 단말 상태(홈) 화면 (담당: Claude)
// 작전 현황판이다. 긴급 경보, 수신 기록, 작전 목록, 접촉 보고, 사건 진입, 신규 열람 안내 순서.
(function (root) {
  'use strict';

  const PC = root.PCApp;
  const { h } = PC;

  const intel = () => root.ProjectCurseHomeIntelligence || {};
  const operations = () => root.ProjectCurseMapRoom?.operations || [];
  const findOperation = (id) => operations().find((op) => op.id === id) || null;

  const SIGNAL_TONES = { critical: 'danger', unstable: 'caution', returned: 'info', recovered: 'ok' };

  // 단말 상태 — 옛 홈처럼 실제 데이터에서 센다.
  function counts() {
    const map = root.ProjectCurseMapRoom || {};
    return {
      records: root.ProjectCurseArchive?.publicRecords?.length || 0,
      ops: operations().length,
      regions: Math.max(0, (map.regions?.length || 1) - 1),
      unresolved: root.ProjectCurseIncidentNetwork?.incidentList?.filter((item) => !['HISTORICAL', 'ARCHIVED'].includes(item.status)).length || 0
    };
  }
  function nodeState() {
    const c = counts();
    return [['NETWORK', 'ISOLATED'], ['ARCHIVE', `${c.records} OPEN`], ['OPERATIONS', `${c.ops} ACTIVE`], ['UNRESOLVED', `${c.unresolved} SIGNALS`]];
  }

  // 접촉 보고 — 작전 단계의 기입 문장에서 센서 값을 뽑아 보여준다.
  // 기입 문장이 바뀌어 값이 맞지 않으면 판독 막대를 그리지 않고 문장만 둔다.
  const CONTACT = {
    operation: 'op-deadzone-return',
    step: 0,
    expect: ['4명', '5개'],
    readout: [['육안', '4', false], ['열원', '5', true], ['출입 요청', '5', true]]
  };

  const ENTRIES = [
    {
      phase: 'exposure',
      code: 'ENTRY 01 / 1986',
      title: '최초 노출',
      text: '호수에서 돌아온 조사관들은 같은 시체를 두고 서로 다른 보고서를 남겼다. 교단이라는 이름이 공식 기록에 처음 등장한 것도 그날이었다.',
      links: [
        ['연표로 진입', ['history', '1986-02-01-immortality'], true],
        ['피의 호수 원기록', ['archive-entry', 'Immortality_860201']]
      ]
    },
    {
      phase: 'collapse',
      code: 'ENTRY 02 / 2007–2012',
      title: '세계의 붕괴',
      text: '북미 지휘망은 철수했고, 남방 측량대는 숲의 끝을 찾지 못했다. 두 대륙은 서로 다른 이유로 지도에서 지워졌다.',
      links: [
        ['붕괴 연표', ['history', '2008-09-06-dead-zone-designation'], true],
        ['데드존', ['archive-entry', 'Dead_Zone_Pilgrimage']],
        ['대흑림', ['archive-entry', 'Great_Black_Forest_Region']]
      ]
    },
    {
      phase: 'current',
      code: 'ENTRY 03 / 2030–2042',
      title: '현재 기록',
      text: '중앙 색인이 닫힌 뒤에도 관측점은 신호를 보냈다. 2042년, 세 밤 동안 열 개 지점이 같은 시각에 침묵했다.',
      links: [
        ['부서진 왕관', ['history', '2030-01-17-broken-crown'], true],
        ['작전 지도', ['map-room', 'op', 'op-southern-coup']],
        ['삼야 무응답', ['history', '2042-10-31-three-night-silence']]
      ]
    }
  ];

  // 처음 접속한 사람을 위한 여섯 기록선
  const READING_PATH = [
    ['세계 기록', '기관 이전의 성채 전승에서 2042년 세 밤의 침묵까지 큰 흐름을 잡는다.', ['history']],
    ['기관과 교단', '같은 사건을 두고 갈라진 조직과 교단의 지휘선을 대조한다.', ['faction-info']],
    ['인물 기록', '주요 인물과 그들이 남긴 사건을 따라간다.', ['personnel']],
    ['대흑림과 순례 규칙', '성채 밖에서 법 대신 생환자들의 규칙이 작동하는 이유를 읽는다.', ['archive-entry', 'Great_Black_Forest_Region']],
    ['데드존 귀환선', '사라진 대륙에서 돌아온 자들이 어떤 판정을 받았는지 따라간다.', ['archive-entry', 'Dead_Zone_Pilgrimage']],
    ['부서진 왕관', '중앙 색인 동결 이후에도 끝나지 않은 남부 작전의 분기 기록을 연다.', ['archive-entry', 'Operation_Broken_Crown']]
  ];

  function link(label, target, primary) {
    return h('a', { class: primary ? 'tc-btn tc-btn--primary' : 'tc-btn', href: PC.href(...target) },
      label, primary ? h('i', { 'aria-hidden': 'true', text: '›' }) : null);
  }

  function signalHref(signal) {
    if (signal.route === 'map-room' && signal.operation) return PC.href('map-room', 'op', signal.operation);
    if (signal.route === 'archive-entry' && signal.record) return PC.href('archive-entry', signal.record);
    return PC.href(signal.route);
  }

  /* ---------- 긴급 경보 ---------- */
  function flashPanel() {
    const alert = intel().alert;
    if (!alert) return PC.missing('ALERT FEED EMPTY', 'ProjectCurseHomeIntelligence.alert', '긴급 경보 데이터가 없습니다.');
    const op = findOperation(alert.operation);
    return h('section.tc-panel.tc-bracket.tc-bracket--danger.tc-home-flash', { 'aria-labelledby': 'tc-home-flash-title' },
      h('header.tc-home-flash-head', null,
        h('p.tc-home-flash-code', null, h('b', { text: 'FLASH' }), h('span', { text: alert.priority })),
        PC.tag(`THREAT ${alert.threat}`, 'danger', { latin: true, mark: true })
      ),
      h('div.tc-home-flash-body', null,
        h('h2#tc-home-flash-title', { text: alert.title }),
        h('p', { text: '해안 교단의 대량 소환 준비와 북방 전선 교란 명령이 동일한 암호표에서 발견됐다.' }),
        h('dl.tc-kv.tc-home-flash-kv', null,
          kv('작전', op ? op.code : alert.operation, true),
          op && op.classification ? kv('보안', op.classification, true) : null,
          kv('신뢰도', alert.confidence),
          op && op.status ? kv('상태', op.status, true) : null
        ),
        op && op.directive ? h('div.tc-note.tc-note--caution', null, h('b', { text: 'DIRECTIVE / 지시' }), h('p', { text: op.directive })) : null,
        h('div.tc-btnrow', null,
          link('작전 지도 열람', ['map-room', 'op', alert.operation], true),
          link('부서진 왕관 기록', ['history', '2030-01-17-broken-crown'])
        )
      )
    );
  }

  function kv(term, value, code) {
    return h('div', null, h('dt', { text: term }), h('dd', { class: code ? 'tc-code' : null, text: value }));
  }

  /* ---------- 수신 기록 ---------- */
  function signalPanel() {
    const signals = intel().signals || [];
    return h('section.tc-panel.tc-home-signals', { 'aria-labelledby': 'tc-home-signals-title' },
      h('header.tc-panel-head', null,
        h('div', null, h('span.tc-label', { text: 'RECENT SIGNALS' }), h('h2#tc-home-signals-title', { text: '최근 수신' })),
        h('span.tc-code.tc-dim', { text: `${signals.length} ENTRIES` })
      ),
      h('ol.tc-home-signal-list', null, signals.map((signal) =>
        h('li', null, h('a.tc-home-signal', { href: signalHref(signal) },
          h('time.tc-code', { text: signal.time }),
          h('span', { text: signal.label }),
          PC.tag(signal.status, SIGNAL_TONES[signal.tone] || 'dim', { latin: true })
        ))
      ))
    );
  }

  /* ---------- 작전 목록 ---------- */
  // 판정으로 봉인된 작전은 기입 내용을 보여주지 않는다. 열람은 상황 관제의 판정 절차를 따른다.
  const isSealed = (op) => Boolean(op.unlockVerdict) || /SEALED/.test(op.status || '');

  function operationRow(op) {
    const steps = op.steps || [];
    const last = steps[steps.length - 1];
    const span = steps.length ? `${steps[0].time}–${last.time}` : '';
    const sealed = isSealed(op);
    return h('a.tc-row.tc-home-op', { href: PC.href('map-room', 'op', op.id) },
      h('span.tc-row-time', { text: op.code }),
      h('span.tc-row-main', null,
        h('b', { text: op.label }),
        h('span', { text: op.region }),
        sealed
          ? h('span.tc-home-op-last', null, '최종 기입 — ', h('span.tc-redact', { role: 'img', 'aria-label': '봉인된 기입' }), ' 판정 이후 열람')
          : last ? h('span.tc-home-op-last', null, h('time.tc-code', { text: last.time }), ` 최종 기입 — ${last.title}`) : null
      ),
      h('span.tc-row-meta', null,
        op.status ? PC.tag(op.status, /SEALED/.test(op.status) ? 'danger' : 'caution', { latin: true }) : PC.tag('RECOVERED TRACK', 'dim', { latin: true }),
        span ? PC.tag(`${steps.length} STEPS · ${span}`, 'info', { latin: true }) : null
      ),
      h('span.tc-row-go', { 'aria-hidden': 'true', text: '›' })
    );
  }

  function operationPanel() {
    const ops = operations();
    return h('section.tc-section.tc-home-ops', { 'aria-labelledby': 'tc-home-ops-title' },
      h('header.tc-section-head', null,
        h('div', null, h('span.tc-label', { text: 'OPERATIONS INDEX' }), h('h2#tc-home-ops-title', { text: '작전 기록' })),
        h('p', { text: `현재 ${counts().regions}개 권역에서 ${counts().ops}개 작전 채널이 응답 중이다. 지도에서 경과를 재생한다.` })
      ),
      ops.length ? h('div.tc-rows', null, ops.map(operationRow)) : PC.missing('NO OPERATIONS', 'ProjectCurseMapRoom.operations', '작전 데이터가 없습니다.')
    );
  }

  /* ---------- 접촉 보고 ---------- */
  function contactPanel() {
    const op = findOperation(CONTACT.operation);
    const step = op?.steps?.[CONTACT.step];
    if (!op || !step) return PC.missing('CONTACT REPORT MISSING', `${CONTACT.operation} / step ${CONTACT.step}`, '접촉 보고의 원본 작전 단계를 찾지 못했습니다.');
    const readable = CONTACT.expect.every((value) => String(step.note || '').includes(value));
    return h('section.tc-panel.tc-home-contact', { 'aria-labelledby': 'tc-home-contact-title' },
      h('header.tc-panel-head', null,
        h('div', null, h('span.tc-label', { text: `CONTACT REPORT · ${op.code}` }), h('h2#tc-home-contact-title', { text: step.title })),
        h('time.tc-code.tc-dim', { text: step.time })
      ),
      h('div.tc-panel-body.tc-home-contact-body', null,
        readable ? h('div.tc-sensor', { role: 'img', 'aria-label': CONTACT.readout.map(([k, v]) => `${k} ${v}`).join(', ') },
          CONTACT.readout.map(([label, value, mismatch]) => h('span', { class: mismatch ? 'is-mismatch' : null }, h('small', { text: label }), h('b', { text: value })))
        ) : null,
        h('p', { text: step.note }),
        h('a.tc-btn', { href: PC.href('map-room', 'op', op.id) }, `${op.label} 경과 재생`, h('i', { 'aria-hidden': 'true', text: '›' }))
      )
    );
  }

  /* ---------- 사건 진입 ---------- */
  function entryPanel() {
    return h('section.tc-section.tc-home-entry', { 'aria-labelledby': 'tc-home-entry-title' },
      h('header.tc-section-head', null,
        h('div', null, h('span.tc-label', { text: 'INCIDENT-LED ENTRY' }), h('h2#tc-home-entry-title', { text: '사건으로 세계에 진입' })),
        h('p', { text: '세 기록선은 서로 다른 시기에서 시작하지만 같은 붕괴를 향한다.' })
      ),
      h('ol.tc-home-entry-list', null, ENTRIES.map((entry) =>
        h('li', { class: `is-${entry.phase}` },
          h('span.tc-label', { text: entry.code }),
          h('h3', { text: entry.title }),
          h('p', { text: entry.text }),
          h('div.tc-btnrow', null, entry.links.map(([label, target, primary]) => link(label, target, primary)))
        )
      ))
    );
  }

  /* ---------- 신규 열람 안내 ---------- */
  function readingPanel() {
    return h('section.tc-panel.tc-home-reading', { 'aria-labelledby': 'tc-home-reading-title' },
      h('header.tc-panel-head', null,
        h('div', null, h('span.tc-label', { text: 'NEW READER ORIENTATION' }), h('h2#tc-home-reading-title', { text: '처음 접속했다면 여섯 기록선을 따라가십시오' }))
      ),
      h('ol.tc-home-reading-list', null, READING_PATH.map(([title, text, target], index) =>
        h('li', null, h('a', { href: PC.href(...target) },
          h('i', { text: String(index + 1).padStart(2, '0') }),
          h('span', null, h('b', { text: title }), h('small', { text: text })),
          h('em', { 'aria-hidden': 'true', text: '›' })
        ))
      )),
      h('a.tc-home-manual', { href: PC.href('field-manual') },
        h('span.tc-label', { text: 'BEFORE DEPLOYMENT' }),
        h('b', { text: '투입 전 확인 — 교전 교범' }),
        h('small', { text: '교전 원칙, 철수 조건, 표식, 장비군, 능력과 대가, 현장 인원 등록 양식' }),
        h('em', { 'aria-hidden': 'true', text: '›' })
      )
    );
  }

  /* ---------- 증거 두 점 ---------- */
  function custodyPanel() {
    return h('section.tc-panel.tc-bracket.tc-bracket--evidence.tc-home-custody', { 'aria-labelledby': 'tc-home-custody-title' },
      h('header.tc-panel-head', null,
        h('div', null, h('span.tc-label', { text: 'UNCLAIMED CUSTODY NOTE / 서부 귀환 회랑 보관함' }), h('h2#tc-home-custody-title', { text: '보관함에 남긴 쪽지' }))
      ),
      h('div.tc-panel-body', null,
        h('blockquote.tc-home-custody-note', null,
          h('p', { text: '나는 답을 적지 않는다. 적으면 안 된다고 배웠다.' }),
          h('p', null, '첫째. 네가 열두 살 때 부엌에서 무엇을 깨뜨렸는지.', h('br'), '둘째. 그 집에서 밤마다 나던 소리를 우리가 뭐라고 불렀는지.', h('br'), '셋째. 내가 너에게 한 번도 하지 않은 말이 무엇인지.')
        ),
        h('p.tc-home-custody-foot', { text: '위탁자 이름 칸은 비어 있다. 수취인이 찾아갔는지는 보관 장부에 남아 있지 않다.' }),
        h('div.tc-btnrow', null,
          link('귀환자 기록', ['archive-entry', 'Returner_Note_West']),
          link('데드존 귀환선', ['archive-entry', 'Dead_Zone_Pilgrimage'])
        )
      )
    );
  }

  function keyArt() {
    return h('figure.tc-evidence.tc-home-keyart', null,
      h('div.tc-evidence-media', null,
        h('img', {
          src: 'assets/resources/derived/project-curse-world-keyart-concept-v1.png',
          alt: '폐쇄 관제실의 화면에 대흑림 성채와 데드존 도로가 동시에 표시된 편집 키아트',
          decoding: 'async',
          loading: 'lazy'
        })
      ),
      h('figcaption', null,
        h('b', { text: 'EDITORIAL KEY ART / ARCHIVE ORIENTATION' }),
        h('span', { text: '설정 기반 편집 키아트 · 사건 원본이나 감시 화면으로 취급하지 않음' })
      )
    );
  }

  function mount(el) {
    const alert = intel().alert;
    const threat = document.querySelector('[data-tc-threat]');
    if (threat) threat.textContent = alert ? alert.threat : '—';
    el.append(
      h('div.tc-home-unknown', { hidden: true }),
      PC.screenHead('terminal-home', {
        title: '합동작전 단말',
        desc: '외부망은 끊겼다. 남은 것은 서로 모순되는 사건철과 아직 응답 중인 관측점뿐이다.',
        meta: nodeState()
      }),
      h('div.tc-home-grid', null,
        flashPanel(),
        signalPanel(),
        contactPanel()
      ),
      operationPanel(),
      entryPanel(),
      readingPanel(),
      h('div.tc-home-evidence', null, custodyPanel(), keyArt()),
      h('p.tc-home-foot', null, h('span', { text: 'PC-03' }), h('b', { text: 'NO EXTERNAL HANDSHAKE' }))
    );
  }

  function show(_parts, app, info) {
    app.setTitle('단말 상태');
    // 모르는 주소로 들어오면 조용히 넘기지 않고 알린다.
    const box = document.querySelector('#terminal-home .tc-home-unknown');
    if (!box) return;
    PC.clear(box);
    box.hidden = !info.unknown;
    if (info.unknown) box.append(PC.missing('UNKNOWN CHANNEL', `#${info.unknown}`, '요청한 주소에 해당하는 채널이 없습니다. 단말 상태로 연결했습니다.'));
  }

  PC.screen({ id: 'terminal-home', mount, show });
})(window);
