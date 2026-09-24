// Project Curse 6 — 상황판(홈) 화면 (담당: Claude). 주소는 #terminal-home 그대로.
// 2026-09-25 사용자 결정: 옛 5.54 홈처럼 '설명 없이 이상한 것 하나'부터 보여 준다. 화면에 한꺼번에 보이는 양을 줄인다.
// 순서: 화면 머리 → 보관함 쪽지와 키아트(복구 스캔·레이더) → 긴급 경보(요약)·최근 신호 → 지난 방문 이후 → 사건부터 읽기
//       → 접어 둔 판(귀환 신호 접촉 보고, 민간 재난 방송, 작전 기록).
// 하위 쪽: #terminal-home/intro(입문 카드), #terminal-home/guide(자캐 설정 안내) — 단말 밖 안내(community-guide-data.js).
// 경보·수신·작전 목록은 진행 상태(pc-state.js)를 따라 바뀐다. 문구는 home-screen-data.js에 있다.
(function (root) {
  'use strict';

  const PC = root.PCApp;
  const { h } = PC;

  const intel = () => root.ProjectCurseHomeIntelligence || {};
  const copy = () => root.ProjectCurseHomeScreen || {};
  const guideData = () => root.ProjectCurseCommunityGuide || {};
  const operations = () => root.ProjectCurseMapRoom?.operations || [];
  const findOperation = (id) => operations().find((op) => op.id === id) || null;
  const opState = () => root.ProjectCurseOperationState;
  const pilgrimState = () => root.ProjectCursePilgrimageState;
  const verdictState = () => root.ProjectCurseVerdictArchiveState;

  const SIGNAL_TONES = { critical: 'danger', unstable: 'caution', returned: 'info', recovered: 'ok' };
  const STATE_EVENTS = ['projectcurse:operation-state-change', 'projectcurse:pilgrimage-state-change', 'projectcurse:verdict-archive-change'];
  const TITLES = { index: '상황판', intro: '입문 카드', guide: '자캐 설정 안내' };

  // {이름} 자리를 값으로 채운다. 값이 없으면 자리를 그대로 두지 않고 빈 문자열로 둔다.
  const fill = (template, values) => String(template || '').replace(/\{(\w+)\}/g, (_, key) => (values[key] ?? ''));

  // 영문 표지와 한글 표지를 나눠 붙인다 — 영문은 전체 보기에서만(간략 보기에서는 한글만).
  function label(english, korean) {
    return h('span.tc-label', null,
      english ? h('span.tc-full-only', { text: korean ? `${english} / ` : english }) : null,
      korean ? h('span', { text: korean }) : null);
  }

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

  function link(text, target, primary) {
    return h('a', { class: primary ? 'tc-btn tc-btn--primary' : 'tc-btn', href: PC.href(...target) },
      text, primary ? h('i', { 'aria-hidden': 'true', text: '›' }) : null);
  }
  function kv(term, value, code) {
    return h('div', null, h('dt', { text: term }), h('dd', { class: code ? 'tc-code' : null, text: value }));
  }
  // 접어 둔 판 — 제목과 한 줄 요약만 보이고 누르면 펼친다
  function fold(id, title, summary, body) {
    return h('details.tc-disclosure.tc-home-fold', { id },
      h('summary', null, h('span', null, h('b', { text: title }), summary ? h('small', { text: summary }) : null)),
      h('div.tc-disclosure-body', null, body)
    );
  }

  /* ---------- 현재 경보(요약) ---------- */
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
        facts: [['기록', verdict.id, true], ['풀린 기록', `${verdicts.unlocked} / ${verdicts.total}`, true], ['읽지 않음', String(verdicts.unread), true], ['판단 상태', text.verdict.scope, true]],
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
          ['확보한 정보', `${operation.recovered} / ${operation.total}`, true],
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
        h('p.tc-home-flash-code', null, h('b', { text: 'FLASH' }), h('span', null, h('span.tc-brief-only', { text: '긴급 경보' }), h('span.tc-full-only', { text: `CURRENT ALERT / ${view.code}` }))),
        PC.tag(view.priority, verdict ? 'ok' : 'danger', { latin: true, mark: true })
      ),
      h('div.tc-home-flash-body', null,
        h('h2#tc-home-flash-title', { text: view.title }),
        h('p', { text: view.copy }),
        h('div.tc-btnrow', null,
          link(view.action[0], view.action[1], true),
          verdict ? link('판정 보관', ['map-room', 'verdict']) : link('부서진 왕관 기록', ['history', '2030-01-17-broken-crown'])
        ),
        h('details.tc-home-flash-more', null,
          h('summary', { text: '작전 정보' }),
          h('dl.tc-kv.tc-home-flash-kv', null, view.facts.map(([term, value, code]) => kv(term, value, code))),
          view.directive ? h('div.tc-note.tc-note--caution', null, h('b', null, h('span.tc-full-only', { text: 'DIRECTIVE / ' }), '지시'), h('p', { text: view.directive })) : null
        )
      )
    );
  }

  /* ---------- 최근 들어온 신호 ---------- */
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
    let text, status, tone;
    if (summary.status === 'complete') {
      text = fill(channel.complete, values);
      status = channel.status.complete;
      tone = ending?.tone === 'hostile' ? 'critical' : channel.unstableEnding && ending?.tone === 'unstable' ? 'unstable' : 'recovered';
    } else if (summary.status === 'active') {
      text = fill(channel.active, values);
      status = `${summary.progress}% · ${last?.outcome || channel.status.outcomeFallback}`;
      tone = last?.tone || 'unstable';
    } else if (locked) {
      text = channel.locked;
      status = channel.status.locked;
      tone = 'critical';
    } else {
      text = channel.idle;
      status = channel.status.idle;
      tone = channel.unlockVerdict ? 'returned' : signal.tone;
    }
    // 봉인된 회수선은 순례 대신 작전의 봉인 상태로 보낸다.
    const href = locked ? PC.href('map-room', 'op', channel.operation) : PC.href('map-room', 'pilgrimage', channel.scenario);
    return { ...signal, label: text, status, tone, href };
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
        h('div', null, h('span.tc-label.tc-full-only', { text: 'LIVE INTELLIGENCE FEED' }), h('h2#tc-home-signals-title', { text: '최근 들어온 신호' })),
        h('span.tc-code.tc-dim.tc-full-only', { text: `${signals.length} CHANNELS` })
      ),
      h('ol.tc-home-signal-list.tc-fx-stagger', null, signals.map((signal, index) =>
        h('li', { style: `--i:${index}` }, h('a.tc-home-signal', { href: signal.href, dataset: { signalTone: signal.tone } },
          h('time.tc-code', { text: signal.time, 'data-tc-anomaly': index === 1 ? 'count' : null }),
          h('span', { text: signal.label }),
          PC.tag(signal.status, SIGNAL_TONES[signal.tone] || 'dim', { latin: true })
        ))
      ))
    );
  }

  /* ---------- 작전 기록 ---------- */
  // 판정으로 봉인된 작전은 기록 내용을 보여주지 않는다. 판정 기록이 보관되면 풀린다.
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
      h('span.tc-row-time.tc-full-only', { text: op.code }),
      h('span.tc-row-main', null,
        h('b', { text: op.label }),
        h('span', { text: op.region }),
        seal === 'sealed'
          ? h('span.tc-home-op-last', null, '마지막 기록 — ', h('span.tc-redact', { role: 'img', 'aria-label': '봉인된 기록' }), ' 판정 뒤에 볼 수 있음')
          : last ? h('span.tc-home-op-last', null, h('time.tc-code', { text: last.time }), ` 마지막 기록 — ${last.title}`) : null
      ),
      h('span.tc-row-meta', null,
        statusTag,
        span ? h('span.tc-full-only', null, PC.tag(`${steps.length} STEPS · ${span}`, 'info', { latin: true })) : null
      ),
      h('span.tc-row-go', { 'aria-hidden': 'true', text: '›' })
    );
  }

  function operationPanel(state) {
    const ops = operations();
    return h('section.tc-section.tc-home-ops', { 'aria-label': '작전 기록' },
      h('p.tc-home-fold-lead', { text: `지금 ${counts().regions}개 지역에서 작전 ${counts().ops}건이 응답 중이다. 지도에서 진행을 다시 볼 수 있다.` }),
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
    return h('section.tc-home-civil', { 'aria-label': civil.title },
      h('p.tc-home-fold-lead', null, h('span.tc-fx-live', { 'aria-hidden': 'true' }), civil.relay),
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
        h('dl.tc-kv', null, kv('보낸 곳', civil.author), kv('받는 곳', civil.recipient), kv('목적', civil.purpose)),
        h('div.tc-note.tc-note--caution', null, h('b', { text: '이 방송 기록의 한계' }), h('p', { text: civil.limit }))
      )
    );
  }

  /* ---------- 귀환 신호 접촉 보고 ---------- */
  function contactPanel() {
    const contact = copy().contact;
    const op = contact && findOperation(contact.operation);
    const step = op?.steps?.[contact.step];
    if (!op || !step) return PC.missing('CONTACT REPORT MISSING', contact ? `${contact.operation} / step ${contact.step}` : 'ProjectCurseHomeScreen.contact', '접촉 보고의 원본 작전 단계를 찾지 못했습니다.');
    const readable = contact.expect.every((value) => String(step.note || '').includes(value));
    return h('section.tc-home-contact', { 'aria-label': step.title },
      h('p.tc-home-fold-lead', null, label(`CONTACT REPORT · ${op.code}`, `${op.label} · ${step.time}`)),
      h('div.tc-home-contact-body', null,
        readable ? h('div.tc-sensor', { role: 'img', 'aria-label': contact.readout.map(([k, v]) => `${k} ${v}`).join(', ') },
          contact.readout.map(([name, value, mismatch]) => h('span', { class: mismatch ? 'is-mismatch' : null, dataset: mismatch ? { fxFinal: value, fxFrom: contact.readout[0][1] } : null }, h('small', { text: name }), h('b', { text: value })))
        ) : null,
        h('p', { text: step.note }),
        h('a.tc-btn', { href: PC.href('map-room', 'op', op.id) }, `${op.label} 진행 다시 보기`, h('i', { 'aria-hidden': 'true', text: '›' }))
      )
    );
  }

  /* ---------- 사건부터 읽기 ---------- */
  function entryPanel() {
    return h('section.tc-section.tc-home-entry', { 'aria-labelledby': 'tc-home-entry-title' },
      h('header.tc-section-head', null,
        h('div', null, h('span.tc-label.tc-full-only', { text: 'INCIDENT-LED ENTRY' }), h('h2#tc-home-entry-title', { text: '사건부터 읽기' })),
        h('p', { text: '세 기록 줄기는 서로 다른 시기에서 시작하지만 같은 붕괴를 향한다.' })
      ),
      h('ol.tc-home-entry-list', null, (copy().entries || []).map((entry) =>
        h('li', { class: `is-${entry.phase}` },
          h('span.tc-label', { text: entry.code }),
          h('h3', { text: entry.title }),
          h('p', { text: entry.text }),
          h('div.tc-btnrow', null, entry.links.map(([text, target, primary]) => link(text, target, primary)))
        )
      ))
    );
  }

  /* ---------- 지난 방문 이후 — 새 기록 알림(pc-updates.js) ---------- */
  function updatesPanel() {
    const U = root.PCUpdates;
    if (!U) return null;
    const { first, entries } = U.since(3);
    const fresh = U.count();
    if (!entries.length && !fresh) return null;
    return h('section.tc-panel.tc-home-updates', { 'aria-labelledby': 'tc-home-updates-title' },
      h('header.tc-panel-head', null,
        h('div', null, h('span.tc-label.tc-full-only', { text: 'UPDATE LOG' }), h('h2#tc-home-updates-title', { text: first ? '최근 갱신' : '지난 방문 이후' })),
        fresh ? PC.tag(`새 기록 ${fresh}건`, 'danger') : null
      ),
      entries.length ? h('ol.tc-home-update-list', null, entries.map((entry) =>
        h('li', null,
          h('time.tc-code', { text: entry.date }),
          h('div', null, h('b', { text: entry.title }), entry.text ? h('p', { text: entry.text }) : null),
          (entry.links || []).length ? h('div.tc-btnrow', null, entry.links.map((item) => h('a.tc-btn', { href: PC.href(item.route, ...(item.parts || [])) }, item.label))) : null
        )
      )) : h('p.tc-home-fold-lead', { text: '지난 방문 뒤에 새로 들어온 기록이 있습니다. 목록의 \'새 기록\' 표시를 확인하십시오.' })
    );
  }

  /* ---------- 보관함 쪽지 ---------- */
  function custodyPanel() {
    const note = copy().custody;
    if (!note) return PC.missing('CUSTODY NOTE MISSING', 'ProjectCurseHomeScreen.custody', '보관함 쪽지 기록이 없습니다.');
    const questions = [];
    note.questions.forEach((line, index) => questions.push(index ? h('br') : null, line));
    const [english, korean] = String(note.code || '').split(' / ');
    return h('section.tc-panel.tc-bracket.tc-bracket--evidence.tc-home-custody', { 'aria-labelledby': 'tc-home-custody-title' },
      h('header.tc-panel-head', null,
        h('div', null, label(korean ? english : '', korean || english), h('h2#tc-home-custody-title', { text: note.title }))
      ),
      h('div.tc-panel-body', null,
        h('blockquote.tc-home-custody-note', null, h('p', { text: note.opening }), h('p', null, questions)),
        h('p.tc-home-custody-foot', { text: note.foot }),
        h('div.tc-btnrow', null, note.links.map(([text, target]) => link(text, target)))
      )
    );
  }

  // 키아트 — 옛 홈의 '신호 복구' 연출(스캔선·빛줄기·진행 막대)과 붉은 레이더를 표시층에서 입힌다.
  function keyArt() {
    const art = copy().keyArt;
    if (!art) return null;
    return h('figure.tc-evidence.tc-home-keyart', null,
      h('div.tc-evidence-media', null,
        PC.img(art.src, { alt: art.alt, sizes: '(max-width: 860px) 94vw, 46vw' }),
        h('span.tc-recovery', { 'aria-hidden': 'true' }, h('i.tc-recovery-beam'), h('b', { text: 'VISUAL SIGNAL / RECOVERED' }), h('i.tc-recovery-bar'))
      ),
      h('span.tc-radar', { 'aria-hidden': 'true' }, h('i')),
      h('figcaption', null, h('b', { text: art.label }), h('span', { text: art.caption }))
    );
  }

  // 처음 온 사람을 위한 짧은 길
  function quickLinks() {
    return h('nav.tc-home-quick', { 'aria-label': '처음 온 열람자 안내' },
      h('a', { href: PC.href('terminal-home', 'intro') }, h('b', { text: '처음이라면' }), h('span', { text: '입문 카드' }), h('i', { 'aria-hidden': 'true', text: '›' })),
      h('a', { href: PC.href('terminal-home', 'guide') }, h('b', { text: '캐릭터를 만든다면' }), h('span', { text: '자캐 설정 안내' }), h('i', { 'aria-hidden': 'true', text: '›' })),
      h('a', { href: PC.href('field-manual') }, h('b', { text: '들어가기 전 확인' }), h('span', { text: '현장 지침' }), h('i', { 'aria-hidden': 'true', text: '›' }))
    );
  }

  /* ---------- 이상 층 — 접촉 보고 재계수 ---------- */
  // 열원이 처음에는 육안 인원과 같게 잡혔다가, 다시 세면 하나가 더 나온다. 세션마다 한 번, 판을 펼쳤을 때.
  // 효과 줄임이면 바로 최종 값만 보인다. 화면 낭독기는 처음부터 최종 값(aria-label)을 읽는다.
  const RECOUNT_KEY = 'pc6_contact_recount_v1';
  let recountTimers = [];
  const recountCells = () => [...document.querySelectorAll('#terminal-home .tc-home-contact [data-fx-final]')];

  function finishRecount() {
    recountTimers.forEach((timer) => root.clearTimeout(timer));
    recountTimers = [];
    recountCells().forEach((cell) => {
      cell.querySelector('b').textContent = cell.dataset.fxFinal;
      cell.classList.remove('is-counting');
      cell.classList.add('is-mismatch');
    });
  }

  function recount() {
    finishRecount();
    const cells = recountCells();
    const reduce = PC.fx() === 'reduced';
    let seen = true;
    try {
      seen = root.sessionStorage.getItem(RECOUNT_KEY) === '1';
      if (!seen && !reduce) root.sessionStorage.setItem(RECOUNT_KEY, '1');
    } catch (_error) { /* 기록할 수 없으면 연출하지 않는다 */ }
    if (!cells.length || reduce || seen) return;
    cells.forEach((cell) => {
      cell.querySelector('b').textContent = cell.dataset.fxFrom;
      cell.classList.remove('is-mismatch');
      cell.classList.add('is-counting');
    });
    cells.forEach((cell, index) => {
      recountTimers.push(root.setTimeout(() => {
        cell.querySelector('b').textContent = cell.dataset.fxFinal;
        cell.classList.remove('is-counting');
        cell.classList.add('is-mismatch', 'is-recount');
        if (index === 0) root.PCAudio?.cue('screening.mismatch');
      }, 2200 + index * 650));
    });
  }

  /* ---------- 입문 카드 ---------- */
  function termOf(term) {
    const framework = root.ProjectCurseWorldHistoryData?.worldFramework || {};
    if (term.code) {
      const item = (framework.ontology || []).find((entry) => entry.code === term.code);
      return item ? { name: item.name, text: item.text } : null;
    }
    return framework[term.key] ? { name: term.name, text: term.text } : null;
  }

  function backLink() {
    return h('a.tc-home-back', { href: PC.href('terminal-home'), onclick: (event) => { event.preventDefault(); PC.back('terminal-home'); } }, '← 상황판');
  }

  function renderIntro(box) {
    const data = guideData().intro;
    if (!data) {
      box.append(backLink(), PC.missing('INTRO MISSING', 'ProjectCurseCommunityGuide.intro', '입문 카드 자료가 없습니다.'));
      return;
    }
    const terms = data.terms.map(termOf).filter(Boolean);
    const path = copy().readingPath || [];
    box.append(
      backLink(),
      h('article.tc-ooc.tc-home-intro', { 'aria-labelledby': 'tc-intro-title' },
        h('header.tc-ooc-head', null,
          h('img.tc-ooc-logo', { src: 'assets/brand/og-image.png', alt: '가운데가 붉게 갈라진 흰 봉인 옆에 PROJECT CURSE 글자가 있는 로고', width: '1200', height: '630' }),
          h('p.tc-label', { text: data.kicker }),
          h('h1#tc-intro-title', { text: data.title, 'data-tc-focus': true }),
          h('p.tc-ooc-lead', { text: data.lead })
        ),
        h('section.tc-ooc-story', { 'aria-label': '이 세계는' }, data.story.map((line) => h('p', { text: line }))),
        h('section.tc-ooc-section', { 'aria-labelledby': 'tc-intro-terms' },
          h('h2#tc-intro-terms', { text: data.termsTitle }),
          h('dl.tc-ooc-terms', null, terms.map((term) => h('div', null, h('dt', { text: term.name }), h('dd', { text: term.text })))),
          h('p.tc-ooc-note', { text: data.termsNote })
        ),
        h('section.tc-ooc-section', { 'aria-labelledby': 'tc-intro-start' },
          h('h2#tc-intro-start', { text: data.startTitle }),
          h('ol.tc-ooc-cards', null, data.start.map((item, index) => h('li', null, h('a', { href: PC.href(...item.route) },
            h('i', { text: String(index + 1).padStart(2, '0') }), h('b', { text: item.title }), h('span', { text: item.text }), h('em', { 'aria-hidden': 'true', text: '›' })
          ))))
        ),
        path.length ? h('section.tc-ooc-section', { 'aria-labelledby': 'tc-intro-more' },
          h('h2#tc-intro-more', { text: data.moreTitle }),
          h('ol.tc-ooc-path', null, path.map(([title, text, target]) => h('li', null, h('a', { href: PC.href(...target) }, h('b', { text: title }), h('span', { text }), h('em', { 'aria-hidden': 'true', text: '›' })))))
        ) : null,
        h('div.tc-btnrow', null, data.links.map((item) => link(item.label, item.route, item.primary)))
      )
    );
  }

  /* ---------- 자캐 설정 안내 ---------- */
  function renderGuide(box) {
    const data = guideData().guide;
    if (!data) {
      box.append(backLink(), PC.missing('GUIDE MISSING', 'ProjectCurseCommunityGuide.guide', '자캐 설정 안내 자료가 없습니다.'));
      return;
    }
    const open = root.ProjectCurseOpenCanon || {};
    const section = (item) => {
      const body = [];
      if (item.paragraphs) body.push(...item.paragraphs.map((text) => h('p', { text })));
      if (item.items) body.push(h('dl.tc-ooc-terms', null, item.items.map(([term, text]) => h('div', null, h('dt', { text: term }), h('dd', { text })))));
      if (item.openCanon) {
        body.push(h('p', { text: open.lead || '' }));
        body.push(h('ul.tc-ooc-open', null, (open.guide || []).map((entry) => h('li', null,
          h('b', { text: entry.title }), h('span', { text: entry.text }),
          entry.route ? h('a', { href: PC.href(...entry.route) }, '관련 기록 ›') : null
        ))));
      }
      if (item.link) body.push(h('div.tc-btnrow', null, link(item.link.label, item.link.route)));
      return h('section.tc-ooc-section', { id: `tc-guide-${item.id}`, 'aria-labelledby': `tc-guide-${item.id}-title` },
        h('h2', { id: `tc-guide-${item.id}-title`, text: item.title }), body);
    };
    box.append(
      backLink(),
      h('article.tc-ooc.tc-home-guide', { 'aria-labelledby': 'tc-guide-title' },
        h('header.tc-ooc-head', null,
          h('p.tc-label', { text: data.kicker }),
          h('h1#tc-guide-title', { text: data.title, 'data-tc-focus': true }),
          h('p.tc-ooc-notice', { text: data.notice })
        ),
        data.sections.map(section)
      )
    );
  }

  /* ---------- 화면 ---------- */
  const live = { flash: null, signals: null, ops: null };
  let listeners = null;
  let indexView = null;
  let subView = null;

  // 진행 상태로 바뀌는 세 판을 다시 그린다. 같은 자리에서 바꿔 끼우므로 배치는 그대로다.
  let lastUnread = null;
  function refresh(event) {
    const state = progress();
    const unread = state.unreadVerdict?.id || null;
    if (event && unread && unread !== lastUnread) root.PCAudio?.cue('system.alert');
    lastUnread = unread;
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
    const civil = copy().civil;
    const contactStep = findOperation(copy().contact?.operation)?.steps?.[copy().contact?.step];
    indexView = h('div.tc-home-index', null,
      h('div.tc-home-unknown', { hidden: true }),
      PC.screenHead('terminal-home', { title: '합동작전 단말', desc: copy().lead, meta: nodeState() }),
      quickLinks(),
      h('p.tc-home-silence', { role: 'status' }, h('b', { text: '외부 교신 두절' }), h('span', { text: '삼야 무응답과 같은 시각이다. 수신 목록이 멈췄다.' }), h('a', { href: PC.href('history', '2042-10-31-three-night-silence') }, '기록 보기 ›')),
      h('div.tc-home-open', null, custodyPanel(), keyArt()),
      h('div.tc-home-grid', null, live.flash, live.signals),
      h('div.tc-home-updates-slot'),
      entryPanel(),
      h('div.tc-home-folds', null,
        fold('tc-home-fold-contact', contactStep ? `귀환 신호 — ${contactStep.title}` : '귀환 신호 접촉 보고', '육안 인원과 열원 수가 맞지 않은 보고', contactPanel()),
        fold('tc-home-fold-civil', civil?.title || '민간 재난 방송', '권역 경보망에서 받은 방송 여섯 건과 경보색 기준', civilPanel()),
        fold('tc-home-fold-ops', '작전 기록', `작전 ${counts().ops}건의 마지막 기록`, live.ops)
      ),
      h('p.tc-home-foot.tc-full-only', null, h('span', { text: 'PC-03' }), h('b', { text: 'NO EXTERNAL HANDSHAKE' }))
    );
    subView = h('div.tc-home-sub', { hidden: true });
    el.append(indexView, subView);
    // 접촉 보고를 펼치면 재계수 연출을 한 번 보여 준다
    indexView.querySelector('#tc-home-fold-contact')?.addEventListener('toggle', (event) => {
      if (event.target.open) recount();
    });
  }

  function show(parts, app, info) {
    const page = parts[0] === 'intro' || parts[0] === 'guide' ? parts[0] : 'index';
    app.setTitle(TITLES[page]);
    indexView.hidden = page !== 'index';
    subView.hidden = page === 'index';
    if (page !== 'index') {
      PC.clear(subView);
      if (page === 'intro') renderIntro(subView);
      else renderGuide(subView);
      PC.threat('low');
      return;
    }
    refresh();
    // 지난 방문 이후 판은 새 기록 계산이 끝난 뒤 그린다
    const slot = indexView.querySelector('.tc-home-updates-slot');
    if (slot) {
      PC.clear(slot);
      const panel = updatesPanel();
      if (panel) slot.append(panel);
    }
    // 상황판이 보이는 동안 진행 상태가 바뀌면 다시 그린다. 두 번 들어와도 하나만 붙는다.
    listeners?.abort();
    listeners = new AbortController();
    STATE_EVENTS.forEach((type) => document.addEventListener(type, refresh, { signal: listeners.signal }));
    // 모르는 주소로 들어오면 조용히 넘기지 않고 알린다.
    const box = indexView.querySelector('.tc-home-unknown');
    if (!box) return;
    PC.clear(box);
    box.hidden = !info.unknown;
    if (info.unknown) box.append(PC.missing('UNKNOWN CHANNEL', `#${info.unknown}`, '요청한 주소에 해당하는 채널이 없습니다. 상황판으로 연결했습니다.'));
  }

  function hide() {
    listeners?.abort();
    listeners = null;
    finishRecount();
  }

  PC.screen({ id: 'terminal-home', mount, show, hide });
})(window);
