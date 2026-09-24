// Project Curse 6 — 단말 상태(홈) 화면 (담당: Claude)
// 작전 현황판이다. 현재 경보, 최근 수신, 접촉 보고, 작전 목록, 사건 진입, 신규 열람 안내 순서.
// 경보·수신·작전 목록은 진행 상태(pc-state.js)를 따라 바뀐다. 문구는 home-screen-data.js에 있다.
(function (root) {
  'use strict';

  const PC = root.PCApp;
  const { h } = PC;

  const intel = () => root.ProjectCurseHomeIntelligence || {};
  const copy = () => root.ProjectCurseHomeScreen || {};
  const operations = () => root.ProjectCurseMapRoom?.operations || [];
  const findOperation = (id) => operations().find((op) => op.id === id) || null;
  const opState = () => root.ProjectCurseOperationState;
  const pilgrimState = () => root.ProjectCursePilgrimageState;
  const verdictState = () => root.ProjectCurseVerdictArchiveState;

  const SIGNAL_TONES = { critical: 'danger', unstable: 'caution', returned: 'info', recovered: 'ok' };
  const STATE_EVENTS = ['projectcurse:operation-state-change', 'projectcurse:pilgrimage-state-change', 'projectcurse:verdict-archive-change'];

  // {이름} 자리를 값으로 채운다. 값이 없으면 자리를 그대로 두지 않고 빈 문자열로 둔다.
  const fill = (template, values) => String(template || '').replace(/\{(\w+)\}/g, (_, key) => (values[key] ?? ''));

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

  /* ---------- 진행 상태 읽기 ---------- */
  // 상태 저장소가 없으면(불러오기 실패) 진행이 없는 것으로 읽는다. 기본 경보와 데이터 문구만 보인다.
  function progress() {
    const O = opState();
    const P = pilgrimState();
    const V = verdictState();
    const idle = { status: 'idle', completed: 0, total: 0, progress: 0, endingData: null };
    const scenario = (id) => (P ? P.getSummary(id) : idle);
    const unreadVerdict = V
      ? V.list().filter((entry) => entry.unread)
        .sort((a, b) => String(b.snapshot?.unlockedAt || '').localeCompare(String(a.snapshot?.unlockedAt || '')))[0] || null
      : null;
    return {
      operation: O ? O.getSummary() : { recovered: 0, total: 3, mapStep: 0, status: 'analysis', decision: null },
      scenario,
      lastChoice: (id) => (P ? P.get(id)?.choices?.at?.(-1) || null : null),
      unlocked: (id) => Boolean(V?.isUnlocked(id)),
      verdicts: V ? V.getSummary() : { total: 0, unlocked: 0, unread: 0 },
      unreadVerdict
    };
  }

  function link(label, target, primary) {
    return h('a', { class: primary ? 'tc-btn tc-btn--primary' : 'tc-btn', href: PC.href(...target) },
      label, primary ? h('i', { 'aria-hidden': 'true', text: '›' }) : null);
  }
  function kv(term, value, code) {
    return h('div', null, h('dt', { text: term }), h('dd', { class: code ? 'tc-code' : null, text: value }));
  }

  /* ---------- 현재 경보 ---------- */
  function flashPanel(state) {
    const alert = intel().alert;
    if (!alert) return PC.missing('ALERT FEED EMPTY', 'ProjectCurseHomeIntelligence.alert', '긴급 경보 데이터가 없습니다.');
    const text = copy().alert || {};
    const op = findOperation(alert.operation);
    const incident = root.ProjectCurseIncidentNetwork?.getIncident?.(alert.incident);
    const { operation, unreadVerdict: verdict, verdicts } = state;
    const decision = operation.decision;

    let view;
    if (verdict) {
      view = {
        code: text.verdict.code,
        title: text.verdict.title,
        priority: text.verdict.priority,
        copy: fill(text.verdict.copy, { id: verdict.id, title: verdict.title }),
        facts: [['기록', verdict.id, true], ['복호화 기록', `${verdicts.unlocked} / ${verdicts.total}`, true], ['읽지 않음', String(verdicts.unread), true], ['판단 상태', text.verdict.scope, true]],
        action: [text.verdict.action, ['map-room', 'verdict', verdict.id]]
      };
    } else {
      const steps = op?.steps?.length || 0;
      view = {
        code: incident?.code || alert.incident,
        title: decision?.title || alert.title,
        priority: decision ? (operation.status === 'deferred' ? text.decision.priority.deferred : text.decision.priority.saved) : alert.priority,
        copy: decision ? fill(text.decision.copy, { summary: decision.summary })
          : operation.recovered ? fill(text.recovered.copy, { recovered: operation.recovered, total: operation.total })
            : incident?.summary || text.fallbackCopy,
        facts: [
          ['작전', op ? op.code : alert.operation, true],
          ['정보 회수', `${operation.recovered} / ${operation.total}`, true],
          steps ? ['작전 단계', `${Math.min(operation.mapStep + 1, steps)} / ${steps}`, true] : null,
          decision ? ['판정 범위', text.decision.scope, true] : ['판단 상태', alert.threat, true],
          ['신뢰도', alert.confidence]
        ].filter(Boolean),
        action: [decision ? text.decision.action : operation.recovered ? text.recovered.action : alert.action, ['map-room', 'op', alert.operation]],
        directive: op?.directive
      };
    }

    return h('section.tc-panel.tc-bracket.tc-bracket--danger.tc-home-flash', { 'aria-labelledby': 'tc-home-flash-title', dataset: { operationStatus: operation.status } },
      h('header.tc-home-flash-head', null,
        h('p.tc-home-flash-code', null, h('b', { text: 'FLASH' }), h('span', { text: `CURRENT ALERT / ${view.code}` })),
        PC.tag(view.priority, verdict ? 'ok' : 'danger', { latin: true, mark: true })
      ),
      h('div.tc-home-flash-body', null,
        h('h2#tc-home-flash-title', { text: view.title }),
        h('p', { text: view.copy }),
        h('dl.tc-kv.tc-home-flash-kv', null, view.facts.map(([term, value, code]) => kv(term, value, code))),
        view.directive ? h('div.tc-note.tc-note--caution', null, h('b', { text: 'DIRECTIVE / 지시' }), h('p', { text: view.directive })) : null,
        h('div.tc-btnrow', null,
          link(view.action[0], view.action[1], true),
          verdict ? link('판정 보관', ['map-room', 'verdict']) : link('부서진 왕관 기록', ['history', '2030-01-17-broken-crown'])
        )
      )
    );
  }

  /* ---------- 최근 수신 ---------- */
  // 순례 채널은 마지막 선택의 규칙 결과를 보여 준다.
  function trace(state, scenarioId) {
    const choice = state.lastChoice(scenarioId);
    if (!choice) return null;
    const labels = copy().traces || {};
    return {
      label: labels[choice.ruleOutcome] || String(choice.ruleOutcome || '').toUpperCase(),
      outcome: String(choice.ruleOutcome || '').toUpperCase(),
      tone: ['broken', 'compromised'].includes(choice.ruleOutcome) ? 'critical' : choice.ruleOutcome === 'contained' ? 'unstable' : 'returned'
    };
  }

  function liveSignal(signal, channel, state) {
    if (!channel) return { ...signal, href: staticHref(signal) };
    if (channel.kind === 'operation') {
      const { operation } = state;
      const decision = operation.decision;
      const deferred = operation.status === 'deferred';
      return {
        ...signal,
        label: decision ? fill(channel.decided, { title: decision.title }) : operation.recovered ? fill(channel.recovered, operation) : signal.label,
        status: decision ? (deferred ? channel.status.deferred : channel.status.saved) : operation.recovered ? channel.status.recovered : signal.status,
        tone: decision ? (deferred ? 'unstable' : 'recovered') : signal.tone,
        href: PC.href('map-room', 'op', signal.operation)
      };
    }
    const summary = state.scenario(channel.scenario);
    const last = trace(state, channel.scenario);
    const locked = channel.unlockVerdict && !state.unlocked(channel.unlockVerdict);
    const ending = summary.endingData;
    const values = { ending: ending?.title || channel.endingFallback, completed: summary.completed, total: summary.total, trace: last?.label || channel.traceFallback };
    let label, status, tone;
    if (summary.status === 'complete') {
      label = fill(channel.complete, values);
      status = channel.status.complete;
      tone = ending?.tone === 'hostile' ? 'critical' : channel.unstableEnding && ending?.tone === 'unstable' ? 'unstable' : 'recovered';
    } else if (summary.status === 'active') {
      label = fill(channel.active, values);
      status = `${summary.progress}% · ${last?.outcome || channel.status.outcomeFallback}`;
      tone = last?.tone || 'unstable';
    } else if (locked) {
      label = channel.locked;
      status = channel.status.locked;
      tone = 'critical';
    } else {
      label = channel.idle;
      status = channel.status.idle;
      tone = channel.unlockVerdict ? 'returned' : signal.tone;
    }
    // 봉인된 회수선은 순례 대신 작전의 봉인 상태로 보낸다.
    const href = locked ? PC.href('map-room', 'op', channel.operation) : PC.href('map-room', 'pilgrimage', channel.scenario);
    return { ...signal, label, status, tone, href };
  }

  function staticHref(signal) {
    if (signal.route === 'map-room' && signal.operation) return PC.href('map-room', 'op', signal.operation);
    if (signal.route === 'archive-entry' && signal.record) return PC.href('archive-entry', signal.record);
    return PC.href(signal.route);
  }

  function signalPanel(state) {
    const channels = copy().channels || [];
    let signals = (intel().signals || []).map((signal, index) => liveSignal(signal, channels[index], state));
    const verdict = state.unreadVerdict;
    if (verdict) {
      const row = copy().unreadVerdict || {};
      signals = [{ time: row.time, status: row.status, tone: 'recovered', label: fill(row.label, verdict), href: PC.href('map-room', 'verdict', verdict.id) }, ...signals];
    }
    return h('section.tc-panel.tc-home-signals', { 'aria-labelledby': 'tc-home-signals-title' },
      h('header.tc-panel-head', null,
        h('div', null, h('span.tc-label', { text: 'LIVE INTELLIGENCE FEED' }), h('h2#tc-home-signals-title', { text: '최근 수신' })),
        h('span.tc-code.tc-dim', { text: `${signals.length} CHANNELS` })
      ),
      h('ol.tc-home-signal-list', null, signals.map((signal) =>
        h('li', null, h('a.tc-home-signal', { href: signal.href, dataset: { signalTone: signal.tone } },
          h('time.tc-code', { text: signal.time }),
          h('span', { text: signal.label }),
          PC.tag(signal.status, SIGNAL_TONES[signal.tone] || 'dim', { latin: true })
        ))
      ))
    );
  }

  /* ---------- 작전 목록 ---------- */
  // 판정으로 봉인된 작전은 기입 내용을 보여주지 않는다. 판정 사본이 보관되면 풀린다.
  function sealState(op, state) {
    if (op.unlockVerdict) return state.unlocked(op.unlockVerdict) ? 'cleared' : 'sealed';
    return /SEALED/.test(op.status || '') ? 'sealed' : 'open';
  }

  function operationRow(op, state) {
    const steps = op.steps || [];
    const last = steps[steps.length - 1];
    const span = steps.length ? `${steps[0].time}–${last.time}` : '';
    const seal = sealState(op, state);
    const statusTag = seal === 'cleared' ? PC.tag(`${op.unlockVerdict} CLEARED`, 'ok', { latin: true })
      : op.status ? PC.tag(op.status, seal === 'sealed' ? 'danger' : 'caution', { latin: true })
        : PC.tag('RECOVERED TRACK', 'dim', { latin: true });
    return h('a.tc-row.tc-home-op', { href: PC.href('map-room', 'op', op.id) },
      h('span.tc-row-time', { text: op.code }),
      h('span.tc-row-main', null,
        h('b', { text: op.label }),
        h('span', { text: op.region }),
        seal === 'sealed'
          ? h('span.tc-home-op-last', null, '최종 기입 — ', h('span.tc-redact', { role: 'img', 'aria-label': '봉인된 기입' }), ' 판정 이후 열람')
          : last ? h('span.tc-home-op-last', null, h('time.tc-code', { text: last.time }), ` 최종 기입 — ${last.title}`) : null
      ),
      h('span.tc-row-meta', null,
        statusTag,
        span ? PC.tag(`${steps.length} STEPS · ${span}`, 'info', { latin: true }) : null
      ),
      h('span.tc-row-go', { 'aria-hidden': 'true', text: '›' })
    );
  }

  function operationPanel(state) {
    const ops = operations();
    return h('section.tc-section.tc-home-ops', { 'aria-labelledby': 'tc-home-ops-title' },
      h('header.tc-section-head', null,
        h('div', null, h('span.tc-label', { text: 'OPERATIONS INDEX' }), h('h2#tc-home-ops-title', { text: '작전 기록' })),
        h('p', { text: `현재 ${counts().regions}개 권역에서 ${counts().ops}개 작전 채널이 응답 중이다. 지도에서 경과를 재생한다.` })
      ),
      ops.length ? h('div.tc-rows', null, ops.map((op) => operationRow(op, state))) : PC.missing('NO OPERATIONS', 'ProjectCurseMapRoom.operations', '작전 데이터가 없습니다.')
    );
  }

  /* ---------- 민간 재난 방송 ---------- */
  // 경보색 이름은 글자로도 적는다. 색만으로 뜻을 전하지 않는다.
  const ALERT_TONES = { '초록': 'ok', '노랑': 'caution', '빨강': 'danger', '하양': 'dotted', '검정': 'dim' };

  // 경보색의 뜻은 학교 대피 수업 표(Civil_Child_Drill)에서 그대로 읽는다.
  function alertColors() {
    const docs = root.ProjectCurseArchiveDocuments?.documents || {};
    const drill = Array.isArray(docs) ? docs.find((doc) => doc.id === 'Civil_Child_Drill') : docs.Civil_Child_Drill;
    return drill?.sections?.find((section) => section.title === '경보색과 할 일')?.table?.rows || null;
  }

  function civilPanel() {
    const civil = copy().civil;
    if (!civil) return PC.missing('CIVIL RELAY MISSING', 'ProjectCurseHomeScreen.civil', '민간 방송 수신본이 없습니다.');
    const colors = alertColors();
    return h('section.tc-panel.tc-home-civil', { 'aria-labelledby': 'tc-home-civil-title' },
      h('header.tc-panel-head', null,
        h('div', null, h('span.tc-label', { text: civil.code }), h('h2#tc-home-civil-title', { text: civil.title })),
        h('span.tc-code.tc-dim', { text: civil.relay })
      ),
      h('div.tc-home-civil-body', null,
        h('ol.tc-home-civil-list', null, civil.broadcasts.map((item) =>
          h('li', null,
            h('time.tc-code', { text: item.time }),
            item.color ? PC.tag(`경보색 ${item.color}`, ALERT_TONES[item.color] || 'dim') : PC.tag(item.kind, 'info'),
            h('div', null, h('b', { text: item.region }), h('p', { text: item.text }))
          )
        )),
        h('aside.tc-home-civil-legend', { 'aria-labelledby': 'tc-home-civil-legend-title' },
          h('h3#tc-home-civil-legend-title', { text: civil.legendTitle }),
          colors
            ? h('dl', null, colors.map(([name, action]) => h('div', null, h('dt', null, PC.tag(name, ALERT_TONES[name] || 'dim')), h('dd', { text: action }))))
            : PC.missing('ALERT TABLE MISSING', 'Civil_Child_Drill / 경보색과 할 일', '경보색 기준 표를 찾지 못했습니다.'),
          civil.legendLink ? link(civil.legendLink[0], civil.legendLink[1]) : null
        )
      ),
      h('footer.tc-home-civil-foot', null,
        h('dl.tc-kv', null, kv('발신', civil.author), kv('수신', civil.recipient), kv('목적', civil.purpose)),
        h('div.tc-note.tc-note--caution', null, h('b', { text: '수신본의 한계' }), h('p', { text: civil.limit }))
      )
    );
  }

  /* ---------- 접촉 보고 ---------- */
  function contactPanel() {
    const contact = copy().contact;
    const op = contact && findOperation(contact.operation);
    const step = op?.steps?.[contact.step];
    if (!op || !step) return PC.missing('CONTACT REPORT MISSING', contact ? `${contact.operation} / step ${contact.step}` : 'ProjectCurseHomeScreen.contact', '접촉 보고의 원본 작전 단계를 찾지 못했습니다.');
    const readable = contact.expect.every((value) => String(step.note || '').includes(value));
    return h('section.tc-panel.tc-home-contact', { 'aria-labelledby': 'tc-home-contact-title' },
      h('header.tc-panel-head', null,
        h('div', null, h('span.tc-label', { text: `CONTACT REPORT · ${op.code}` }), h('h2#tc-home-contact-title', { text: step.title })),
        h('time.tc-code.tc-dim', { text: step.time })
      ),
      h('div.tc-panel-body.tc-home-contact-body', null,
        readable ? h('div.tc-sensor', { role: 'img', 'aria-label': contact.readout.map(([k, v]) => `${k} ${v}`).join(', ') },
          contact.readout.map(([label, value, mismatch]) => h('span', { class: mismatch ? 'is-mismatch' : null }, h('small', { text: label }), h('b', { text: value })))
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
      h('ol.tc-home-entry-list', null, (copy().entries || []).map((entry) =>
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
    const manual = copy().manualLink;
    return h('section.tc-panel.tc-home-reading', { 'aria-labelledby': 'tc-home-reading-title' },
      h('header.tc-panel-head', null,
        h('div', null, h('span.tc-label', { text: 'NEW READER ORIENTATION' }), h('h2#tc-home-reading-title', { text: '처음 접속했다면 여섯 기록선을 따라가십시오' }))
      ),
      h('ol.tc-home-reading-list', null, (copy().readingPath || []).map(([title, text, target], index) =>
        h('li', null, h('a', { href: PC.href(...target) },
          h('i', { text: String(index + 1).padStart(2, '0') }),
          h('span', null, h('b', { text: title }), h('small', { text })),
          h('em', { 'aria-hidden': 'true', text: '›' })
        ))
      )),
      manual ? h('a.tc-home-manual', { href: PC.href('field-manual') },
        h('span.tc-label', { text: manual.code }),
        h('b', { text: manual.title }),
        h('small', { text: manual.text }),
        h('em', { 'aria-hidden': 'true', text: '›' })
      ) : null
    );
  }

  /* ---------- 증거 두 점 ---------- */
  function custodyPanel() {
    const note = copy().custody;
    if (!note) return PC.missing('CUSTODY NOTE MISSING', 'ProjectCurseHomeScreen.custody', '보관함 쪽지 기록이 없습니다.');
    const questions = [];
    note.questions.forEach((line, index) => questions.push(index ? h('br') : null, line));
    return h('section.tc-panel.tc-bracket.tc-bracket--evidence.tc-home-custody', { 'aria-labelledby': 'tc-home-custody-title' },
      h('header.tc-panel-head', null,
        h('div', null, h('span.tc-label', { text: note.code }), h('h2#tc-home-custody-title', { text: note.title }))
      ),
      h('div.tc-panel-body', null,
        h('blockquote.tc-home-custody-note', null, h('p', { text: note.opening }), h('p', null, questions)),
        h('p.tc-home-custody-foot', { text: note.foot }),
        h('div.tc-btnrow', null, note.links.map(([label, target]) => link(label, target)))
      )
    );
  }

  function keyArt() {
    const art = copy().keyArt;
    if (!art) return null;
    return h('figure.tc-evidence.tc-home-keyart', null,
      h('div.tc-evidence-media', null, PC.img(art.src, { alt: art.alt, sizes: '(max-width: 860px) 94vw, 58vw' })),
      h('figcaption', null, h('b', { text: art.label }), h('span', { text: art.caption }))
    );
  }

  /* ---------- 화면 ---------- */
  const live = { flash: null, signals: null, ops: null };
  let listeners = null;

  // 진행 상태로 바뀌는 세 판을 다시 그린다. 같은 자리에서 바꿔 끼우므로 배치는 그대로다.
  function refresh() {
    const state = progress();
    const next = { flash: flashPanel(state), signals: signalPanel(state), ops: operationPanel(state) };
    Object.keys(next).forEach((key) => {
      live[key].replaceWith(next[key]);
      live[key] = next[key];
    });
  }

  function mount(el) {
    const state = progress();
    live.flash = flashPanel(state);
    live.signals = signalPanel(state);
    live.ops = operationPanel(state);
    el.append(
      h('div.tc-home-unknown', { hidden: true }),
      PC.screenHead('terminal-home', { title: '합동작전 단말', desc: copy().lead, meta: nodeState() }),
      h('div.tc-home-grid', null, live.flash, live.signals, contactPanel()),
      civilPanel(),
      live.ops,
      entryPanel(),
      readingPanel(),
      h('div.tc-home-evidence', null, custodyPanel(), keyArt()),
      h('p.tc-home-foot', null, h('span', { text: 'PC-03' }), h('b', { text: 'NO EXTERNAL HANDSHAKE' }))
    );
  }

  function show(_parts, app, info) {
    app.setTitle('단말 상태');
    refresh();
    // 홈이 보이는 동안 진행 상태가 바뀌면 다시 그린다. 두 번 들어와도 하나만 붙는다.
    listeners?.abort();
    listeners = new AbortController();
    STATE_EVENTS.forEach((type) => document.addEventListener(type, refresh, { signal: listeners.signal }));
    // 모르는 주소로 들어오면 조용히 넘기지 않고 알린다.
    const box = document.querySelector('#terminal-home .tc-home-unknown');
    if (!box) return;
    PC.clear(box);
    box.hidden = !info.unknown;
    if (info.unknown) box.append(PC.missing('UNKNOWN CHANNEL', `#${info.unknown}`, '요청한 주소에 해당하는 채널이 없습니다. 단말 상태로 연결했습니다.'));
  }

  function hide() {
    listeners?.abort();
    listeners = null;
  }

  PC.screen({ id: 'terminal-home', mount, show, hide });
})(window);
