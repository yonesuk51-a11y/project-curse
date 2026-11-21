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

  /* ---------- 구역 판정 판 (2026-11-21 사용자 결정) ---------- */
  // 판정은 작전 지도 지역 데이터(zoneGradeCode)와 세계 기본 규칙(zoneGrading)에서 읽는다. 오늘의 정세 회람은 날짜로 하나를 고른다.
  function zonePanel() {
    const framework = root.ProjectCurseWorldHistoryData?.worldFramework || {};
    const grades = framework.zoneGrading?.grades || [];
    const districts = root.ProjectCurseMapRoom?.drilldowns || [];
    if (!grades.length || !districts.length) return PC.missing('ZONE BOARD MISSING', 'zoneGrading / drilldowns', '구역 판정 데이터가 없습니다.');
    const affairs = framework.interstateAffairs?.items || [];
    const day = Math.floor(Date.now() / 86400000);
    const affair = affairs.length ? affairs[day % affairs.length] : null;
    return h('section.tc-home-zones', { 'aria-label': '구역 판정 판' },
      h('p.tc-home-fold-lead', { text: '구역 판정은 행정이 어디까지 닿는지이며 위험도가 아니다.' }),
      h('ul.tc-home-zone-list', null, districts.map((district) => {
        const grade = grades.find((item) => item.code === district.zoneGradeCode);
        const name = grade ? grade.name : (district.zoneGradeStatus === 'not-applicable' ? '판정 대상 아님' : '판정 없음');
        return h('li', null,
          h('a', { href: PC.href('map-room', 'region', district.id) }, h('b', { text: district.label }), h('span', { text: name }))
        );
      })),
      affair ? h('aside.tc-home-affair', { 'aria-labelledby': 'tc-home-affair-title' },
        h('h3#tc-home-affair-title', null, '오늘의 정세 회람 — ', affair.title),
        PC.tag(affair.status, 'caution'),
        h('p', { text: affair.text }),
        link('국가 간 정세 전체 보기', ['history', 'world'])
      ) : null
    );
  }

  /* ---------- 합동 작전 공고 (2026-11-21 사용자 추천안 승인) ---------- */
  // 주마다 한 건. 같은 주에는 모두에게 같은 공고가 보인다. 결과는 정하지 않는다(교류용 글감).
  function weekIndex(length) {
    return length ? Math.floor((Math.floor(Date.now() / 86400000) + 3) / 7) % length : -1;
  }
  function bulletinItem() {
    const items = copy().bulletins?.items || [];
    return items[weekIndex(items.length)] || null;
  }
  function bulletinPanel() {
    const b = copy().bulletins;
    const item = bulletinItem();
    if (!b || !item) return PC.missing('BULLETIN MISSING', 'ProjectCurseHomeScreen.bulletins', '합동 작전 공고가 없습니다.');
    return h('section.tc-home-bulletin', { 'aria-labelledby': 'tc-home-bulletin-title' },
      h('p.tc-home-fold-lead', { text: b.lead }),
      h('header', null, label(item.code, item.place), h('h3#tc-home-bulletin-title', { text: item.title })),
      h('p', { text: item.situation }),
      h('dl.tc-home-bulletin-kv', null,
        h('div', null, h('dt', { text: '교전 규칙' }), h('dd', null, h('ul', null, item.roe.map((line) => h('li', { text: line }))))),
        h('div', null, h('dt', { text: '모집 자리' }), h('dd', { text: item.seats })),
        h('div', null, h('dt', { text: '써 볼 장면' }), h('dd', null, h('ul', null, item.prompts.map((line) => h('li', { text: line })))))
      ),
      h('div.tc-btnrow', null,
        link('교전 보고서 양식', ['field-manual', 'register'], true),
        item.link ? link(item.link.label, item.link.route) : null
      ),
      h('p.tc-hint', { text: b.note })
    );
  }

  /* ---------- 도시 공포 지수 · 수배 회람 (2026-11-21 사용자 요청) ---------- */
  // 공포 지수는 home-screen-data.js의 공시 기준값(base)에서 날짜마다 spread 안으로 움직인다. 같은 날에는 같은 값이다.
  const today = () => Math.floor(Date.now() / 86400000);
  function dayNoise(index, day) {
    return Math.abs(Math.sin((day + 1) * 12.9898 + (index + 1) * 78.233) * 43758.5453) % 1;
  }
  function fearValue(city, index, day) {
    return Math.max(0, Math.min(100, Math.round(city.base + (dayNoise(index, day) - 0.5) * city.spread)));
  }

  function fearPanel() {
    const fear = copy().fear;
    if (!fear?.cities?.length || !fear.bands?.length) return PC.missing('FEAR INDEX MISSING', 'ProjectCurseHomeScreen.fear', '공포 지수 공시가 없습니다.');
    const day = today();
    const bandOf = (value) => [...fear.bands].reverse().find((band) => value >= band.min) || fear.bands[0];
    return h('section.tc-home-fear', { 'aria-label': fear.title },
      h('p.tc-home-fold-lead', { text: fear.lead }),
      h('ol.tc-home-fear-list', null, fear.cities.map((city, index) => {
        const value = fearValue(city, index, day);
        const delta = value - fearValue(city, index, day - 1);
        const band = bandOf(value);
        return h('li', { class: `is-${band.tone}` },
          h('b', { text: city.name }),
          h('span.tc-home-fear-meter', { role: 'img', 'aria-label': `지수 ${value}, ${band.name}` }, h('i', { style: `width:${value}%` })),
          h('span.tc-home-fear-value', null,
            h('strong.tc-code', { text: String(value) }),
            h('small', { text: delta === 0 ? '어제와 같음' : `어제보다 ${delta > 0 ? '▲' : '▼'}${Math.abs(delta)}` })
          ),
          PC.tag(band.name, band.tone),
          h('p', { text: city.note })
        );
      })),
      h('div.tc-home-fear-bands', null,
        h('h3', { text: '지수 구간과 방송 문안' }),
        h('dl', null, fear.bands.map((band) => h('div', null, h('dt', null, PC.tag(`${band.min}+ ${band.name}`, band.tone)), h('dd', { text: band.act }))))
      ),
      h('footer.tc-home-civil-foot', null,
        h('dl.tc-kv', null, kv('보낸 곳', fear.author), kv('받는 곳', fear.recipient), kv('목적', fear.purpose)),
        h('div.tc-note.tc-note--caution', null, h('b', { text: '이 공시의 한계' }), h('p', { text: fear.limit })),
        link('공포 관리 행정 보기', ['history', 'ref', 'fear-office'])
      )
    );
  }

  // 재 농도 기상 방송(2026-11-21 사용자 요청) — 공포 지수와 같은 날짜 값 함수를 쓴다. 하늘 현상은 날짜로 하나.
  function ashPanel() {
    const ash = copy().ashWeather;
    if (!ash?.regions?.length || !ash.grades?.length || !ash.phenomena?.length) return PC.missing('ASH FORECAST MISSING', 'ProjectCurseHomeScreen.ashWeather', '재 농도 예보가 없습니다.');
    const day = today();
    const gradeOf = (value) => [...ash.grades].reverse().find((grade) => value >= grade.min) || ash.grades[0];
    const sky = ash.phenomena[day % ash.phenomena.length];
    const offset = 11;
    return h('section.tc-home-ash', { 'aria-label': ash.title },
      h('p.tc-home-fold-lead', null, h('span.tc-fx-live', { 'aria-hidden': 'true' }), ash.lead),
      h('div.tc-home-ash-sky', { class: `is-${sky.tone}` },
        h('header', null, h('span.tc-code', { text: ash.code }), PC.tag(`오늘의 하늘 — ${sky.name}`, sky.tone)),
        h('p', { text: sky.text }),
        PC.signalMark?.('sig-1')
      ),
      h('ol.tc-home-fear-list.tc-home-ash-list', null, ash.regions.map((region, index) => {
        const value = Math.max(0, Math.round(region.base + (dayNoise(index + offset, day) - 0.5) * region.spread));
        const grade = gradeOf(value);
        return h('li', { class: `is-${grade.tone}` },
          h('b', { text: region.name }),
          h('span.tc-home-fear-meter', { role: 'img', 'aria-label': `재 농도 ${value} ${ash.unit}, ${grade.name}` }, h('i', { style: `width:${Math.min(100, Math.round(value / ash.max * 100))}%` })),
          h('span.tc-home-fear-value', null, h('strong.tc-code', { text: String(value) }), h('small', { text: ash.unit })),
          PC.tag(grade.name, grade.tone),
          h('p', { text: region.note })
        );
      })),
      h('div.tc-home-fear-bands', null,
        h('h3', { text: '농도 등급과 행동 요령' }),
        h('dl', null, ash.grades.map((grade) => h('div', null, h('dt', null, PC.tag(`${grade.min}+ ${grade.name}`, grade.tone)), h('dd', { text: grade.act }))))
      ),
      h('footer.tc-home-civil-foot', null,
        h('dl.tc-kv', null, kv('보낸 곳', ash.author), kv('받는 곳', ash.recipient), kv('목적', ash.purpose)),
        h('div.tc-note.tc-note--caution', null, h('b', { text: '이 방송의 한계' }), h('p', { text: ash.limit })),
        link('재 내리는 날 보기', ['history', 'ref', 'ash-fall'])
      )
    );
  }

  /* ---------- 오늘의 기록 한 장 (2026-11-21 사용자 결정) ---------- */
  // 세계 기록에서 한 줄 훅·증언·은어·소문·금지곡을 모아 날짜로 하나를 고른다. 오늘 올라온 주민 일지가 있으면 그 장이 먼저다.
  function localDay() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function dailyPool() {
    const framework = root.ProjectCurseWorldHistoryData?.worldFramework || {};
    const life = ['zoneLife', 'worldOrder', 'fieldCulture'].flatMap((key) => framework[key]?.items || []);
    const pool = [];
    life.filter((item) => item.hook).forEach((item) => pool.push({ kind: '한 줄', text: item.hook, source: item.title, ref: item.id }));
    (framework.oralTestimony?.items || []).forEach((entry) => entry.lines.forEach((line) => pool.push({ kind: '증언', text: line, source: entry.speaker, ref: entry.id })));
    const tableRows = (id) => life.find((item) => item.id === id)?.tables?.[0]?.rows || [];
    tableRows('field-slang').forEach(([term, meaning]) => pool.push({ kind: '은어', text: `${term} — ${meaning}`, source: '현장 은어', ref: 'field-slang' }));
    tableRows('banned-songs').forEach(([song, reason]) => pool.push({ kind: '금지곡', text: `${song} — ${reason}`, source: '방송 금지곡', ref: 'banned-songs' }));
    (framework.cities || []).forEach((city) => (city.rumors || []).forEach((rumor) => pool.push({ kind: '소문', text: rumor, source: city.label, ref: city.id })));
    return pool;
  }

  function dailyCard() {
    const head = copy().daily;
    const diary = root.ProjectCurseWorldHistoryData?.worldFramework?.cities?.find((city) => city.id === 'karven')?.diary;
    const fresh = diary?.entries?.find((entry) => entry.release === localDay());
    const pool = dailyPool();
    if (!head || (!fresh && !pool.length)) return PC.missing('DAILY RECORD MISSING', 'ProjectCurseHomeScreen.daily', '오늘의 기록이 없습니다.');
    const pick = fresh
      ? { kind: '주민 일지 · 새 장', text: fresh.lines[0], source: `${diary.title} — ${fresh.date} ${fresh.title}`, ref: 'diary' }
      : pool[(today() * 7919) % pool.length];
    const status = h('span.tc-home-daily-status', { role: 'status' });
    const save = () => {
      const Card = root.PCRegisterCard;
      if (!Card?.drawRecord) { status.textContent = '카드를 그릴 수 없습니다.'; return; }
      status.textContent = '카드를 그리는 중…';
      const emblem = Card.emblem(() => undefined);
      Card.fontsReady().then(() => {
        const canvas = document.createElement('canvas');
        Card.drawRecord(canvas, { title: head.title, kind: pick.kind, text: pick.text, source: pick.source }, { emblem });
        return Card.save(canvas, Card.recordFilename(pick));
      }).then((ok) => { status.textContent = ok ? '카드를 저장했습니다.' : '저장하지 못했습니다.'; }, () => { status.textContent = '저장하지 못했습니다.'; });
    };
    return h('section.tc-home-daily.tc-paper', { 'aria-labelledby': 'tc-home-daily-title', 'data-stamp': '사본' },
      h('header', null, h('h2#tc-home-daily-title', { text: head.title }), PC.tag(pick.kind, fresh ? 'danger' : 'evidence')),
      h('blockquote', null, h('p', { text: pick.text })),
      h('footer', null,
        h('span', { text: pick.source }),
        h('span.tc-home-daily-actions', null,
          h('button.tc-btn', { type: 'button', onclick: save }, '카드로 저장 (PNG)'),
          link('이어서 읽기', ['history', 'ref', pick.ref])
        ),
        status
      )
    );
  }

  /* ---------- 빈 자리의 밤 (2026-11-21 사용자 결정) ---------- */
  // special 축일 하루 동안만 방송 띠 위에 특별 방송을 띄운다. 그날에만 잡히는 덧붙은 수신 조각도 여기 끼운다.
  function feastPanel() {
    const feast = PC.feastToday?.();
    if (!feast?.special) return null;
    const extra = copy().signal?.fragments?.find((item) => item.epilogue);
    return h('section.tc-home-feast', { 'aria-labelledby': 'tc-home-feast-title' },
      h('header', null, h('span.tc-code', { text: 'SPECIAL BROADCAST' }), h('h2#tc-home-feast-title', { text: `오늘은 ${feast.name}` }), PC.tag(feast.faction, 'danger')),
      h('ol', null, (feast.broadcast || []).map((line) => h('li', { text: line }))),
      extra ? PC.signalMark?.(extra.id) : null,
      feast.note ? h('p.tc-home-feast-note', { text: feast.note }) : null
    );
  }

  /* ---------- 방송 띠 (2026-11-21 사용자 결정) ---------- */
  // 공포 지수·재 농도·수배 회람·오늘의 하늘을 화면 위쪽 한 줄로 흘린다. 효과 줄임에서는 멈춘 채 가로로 밀어 본다.
  // 띠는 읽기 보조다. 같은 값은 '오늘의 공시' 칸에 모두 있다.
  function tickerItems() {
    const day = today();
    const items = [];
    const fear = copy().fear;
    (fear?.cities || []).forEach((city, index) => {
      const value = fearValue(city, index, day);
      const band = [...(fear.bands || [])].reverse().find((item) => value >= item.min);
      items.push({ code: 'FEAR', text: `${city.name} 공포 ${value}${band ? ` · ${band.name}` : ''}`, tone: band?.tone });
    });
    const ash = copy().ashWeather;
    if (ash?.phenomena?.length) items.push({ code: 'SKY', text: `오늘의 하늘 — ${ash.phenomena[day % ash.phenomena.length].name}`, tone: ash.phenomena[day % ash.phenomena.length].tone });
    (ash?.regions || []).forEach((region, index) => {
      const value = Math.max(0, Math.round(region.base + (dayNoise(index + 11, day) - 0.5) * region.spread));
      const grade = [...(ash.grades || [])].reverse().find((item) => value >= item.min);
      items.push({ code: 'ASH', text: `${region.name} 재 ${value}${ash.unit ? ` ${ash.unit}` : ''}${grade ? ` · ${grade.name}` : ''}`, tone: grade?.tone });
    });
    const feast = PC.feastToday?.();
    const next = PC.nextFeast?.();
    if (feast) items.unshift({ code: 'FEAST', text: `오늘 교단 축일 — ${feast.name}(${feast.faction}) · 리버스 경계`, tone: 'danger' });
    else if (next) items.push({ code: 'FEAST', text: `다음 교단 축일 — ${next.feast.name}(${next.feast.faction}) · ${next.days}일 남음`, tone: next.days <= 7 ? 'caution' : null });
    const wanted = root.ProjectCurseWorldHistoryData?.worldFramework?.worldOrder?.items?.find((item) => item.id === 'wanted-list')?.wanted || [];
    if (wanted.length) {
      const top = wanted[day % wanted.length];
      items.push({ code: 'WANTED', text: `수배 ${top.code} ${top.alias} — ${top.kind}`, tone: 'danger' });
    }
    return items;
  }

  function tickerBar() {
    const items = tickerItems();
    if (!items.length) return null;
    const row = (hidden) => h('ul', { 'aria-hidden': hidden ? 'true' : null }, items.map((item) =>
      h('li', { class: item.tone ? `is-${item.tone}` : null }, h('span.tc-code', { text: item.code }), h('span', { text: item.text }))
    ));
    const openNotice = () => {
      const fold = indexView?.querySelector('#tc-home-fold-notice');
      if (!fold) return;
      fold.open = true;
      fold.scrollIntoView({ block: 'start', behavior: PC.fx() === 'reduced' ? 'auto' : 'smooth' });
      fold.querySelector('summary')?.focus({ preventScroll: true });
    };
    return h('section.tc-home-ticker', { 'aria-label': '방송 띠 — 오늘의 공시 요약' },
      h('span.tc-home-ticker-live', null, h('span.tc-fx-live', { 'aria-hidden': 'true' }), 'ON AIR'),
      h('div.tc-home-ticker-window', { tabindex: '0', 'aria-label': '방송 띠 내용. 가로로 밀어 볼 수 있습니다.' },
        h('div.tc-home-ticker-track', null, row(false), row(true))
      ),
      h('button.tc-home-ticker-more', { type: 'button', onclick: openNotice }, '공시 전체', h('i', { 'aria-hidden': 'true', text: ' ›' }))
    );
  }

  /* ---------- 수신 조각 모음 (2026-11-21 사용자 결정) ---------- */
  // 받은 조각은 방송 순서대로 잇고, 받지 못한 자리는 어느 채널에 있는지만 알린다.
  function fragmentPanel() {
    const signal = copy().signal;
    if (!signal?.fragments?.length) return PC.missing('SIGNAL MISSING', 'ProjectCurseHomeScreen.signal', '수신 조각 자료가 없습니다.');
    const found = new Set(PC.signalFound?.() || []);
    const ordered = signal.fragments.filter((item) => !item.epilogue).sort((a, b) => a.order - b.order);
    const extra = signal.fragments.filter((item) => item.epilogue);
    const count = ordered.filter((item) => found.has(item.id)).length;
    return h('section.tc-home-frag', { 'aria-label': signal.title },
      h('p.tc-home-fold-lead', { text: signal.intro }),
      h('p.tc-home-frag-count', null, h('strong.tc-code', { text: `${count}/${ordered.length}` }), h('span', { text: ' 조각 수신' })),
      h('ol.tc-home-frag-list', null, ordered.map((item) => found.has(item.id)
        ? h('li.is-found', null, h('span.tc-code', { text: String(item.order).padStart(2, '0') }), h('p', { text: item.text }))
        : h('li', null, h('span.tc-code', { text: String(item.order).padStart(2, '0') }), h('p', { text: `— ${signal.missing} · ${item.screen} 어딘가 —` }))
      )),
      count === ordered.length ? h('p.tc-home-frag-done', null, signal.complete, signal.record ? ' ' : null,
        signal.record ? h('a', { href: PC.href('history', signal.record) }, '연표 기록 보기', h('i', { 'aria-hidden': 'true', text: ' ›' })) : null) : null,
      extra.length ? h('ol.tc-home-frag-list.tc-home-frag-extra', { 'aria-label': '덧붙은 수신' }, extra.map((item) => found.has(item.id)
        ? h('li.is-found', null, h('span.tc-code', { text: '+' }), h('p', null, item.text, h('small', { text: ` — ${item.received}` })))
        : h('li', null, h('span.tc-code', { text: '+' }), h('p', { text: `— ${signal.missing} · ${item.screen}에만 잡힌다 —` }))
      )) : null,
      h('footer.tc-home-civil-foot', null,
        h('dl.tc-kv', null, kv('보낸 곳', signal.author), kv('받는 곳', signal.recipient), kv('시기', signal.date)),
        h('div.tc-note.tc-note--caution', null, h('b', { text: '이 복원본의 한계' }), h('p', { text: signal.limit }))
      )
    );
  }

  // 오늘의 공시 안의 접는 칸
  function noticePart(id, title, hint, body) {
    return h('details.tc-disclosure.tc-home-notice-part', { id },
      h('summary', null, h('span', null, h('b', { text: title }), h('small', { text: hint }))),
      h('div.tc-disclosure-body', null, body)
    );
  }

  function renderFragments() {
    const slot = indexView?.querySelector('.tc-home-frag-slot');
    if (slot) slot.replaceChildren(fragmentPanel());
  }

  function wantedPanel() {
    const head = copy().wanted;
    const list = root.ProjectCurseWorldHistoryData?.worldFramework?.worldOrder?.items?.find((item) => item.id === 'wanted-list')?.wanted || [];
    if (!head || !list.length) return PC.missing('WANTED CIRCULAR MISSING', 'worldOrder / wanted-list', '수배 회람이 없습니다.');
    const first = today() % list.length;
    const ordered = [...list.slice(first), ...list.slice(0, first)];
    return h('section.tc-home-wanted', { 'aria-label': head.title },
      h('p.tc-home-fold-lead', { text: head.lead }),
      h('ol.tc-home-wanted-list', null, ordered.map((entry, index) =>
        h('li', { class: index === 0 ? 'is-top' : null },
          h('header', null, h('span.tc-code', { text: entry.code }), index === 0 ? PC.tag('오늘 회람 맨 위', 'danger') : null),
          h('b', { text: entry.alias }),
          h('p.tc-home-wanted-kind', { text: entry.kind }),
          h('p', { text: entry.charge }),
          h('p.tc-home-wanted-note', { text: entry.note })
        )
      )),
      h('footer.tc-home-civil-foot', null,
        h('p.tc-home-wanted-report', { text: head.report }),
        h('div.tc-note.tc-note--caution', null, h('b', { text: '이 회람의 한계' }), h('p', { text: head.limit })),
        link('수배 목록 원문 보기', ['history', 'ref', 'wanted-list'])
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
    // 2026-11-21 사용자 결정: 첫 화면에는 가장 최근 한 건만. 나머지는 건수만 알린다.
    const { first, entries: all } = U.since(3);
    const entries = all.slice(0, 1);
    const more = first ? 0 : all.length - entries.length;
    const fresh = U.count();
    if (!entries.length && !fresh) return null;
    return h('section.tc-panel.tc-home-updates', { 'aria-labelledby': 'tc-home-updates-title' },
      h('header.tc-panel-head', null,
        h('div', null, h('span.tc-label.tc-full-only', { text: 'UPDATE LOG' }), h('h2#tc-home-updates-title', { text: first ? '최근 갱신' : '지난 방문 이후' })),
        fresh ? PC.tag(`새 기록 ${fresh}건`, 'danger') : null
      ),
      entries.length ? h('ol.tc-home-update-list', null, entries.map((entry) =>
        h('li', null,
          h('time.tc-code', { text: String(entry.date).replace(/-/g, '.'), datetime: entry.date }),
          h('div', null, h('b', { text: entry.title }), entry.text ? h('p', { text: entry.text }) : null),
          (entry.links || []).length ? h('div.tc-btnrow', null, entry.links.map((item) => h('a.tc-btn', { href: PC.href(item.route, ...(item.parts || [])) }, item.label))) : null
        )
      )) : h('p.tc-home-fold-lead', { text: '지난 방문 뒤에 새로 들어온 기록이 있습니다. 목록의 \'새 기록\' 표시를 확인하십시오.' }),
      more > 0 ? h('p.tc-home-update-more', { text: `이 밖에 ${more}건이 더 들어왔다. 각 채널의 '새' 표시를 확인하십시오.` }) : null
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
      h('a', { href: PC.href('field-manual', 'register') }, h('b', { text: '다 만들었다면' }), h('span', { text: '자캐 등록증 만들기' }), h('i', { 'aria-hidden': 'true', text: '›' }))
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
      // 묶음 목록(전 소속 등) — 묶음마다 접는 칸으로 둔다
      if (item.groups) body.push(h('div.tc-ooc-groups', null, item.groups.map((group) => h('details.tc-disclosure', null,
        h('summary', null, h('b', { text: `${group.title} · ${group.items.length}` })),
        h('dl.tc-ooc-terms', null, group.items.map(([term, text]) => h('div', null, h('dt', { text: term }), h('dd', { text }))))
      ))));
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
      // 2026-11-21 사용자 결정: 첫 화면은 '오늘'만 — 방송 띠, 오늘의 기록, 긴급 경보·최근 신호, 최근 갱신 한 줄.
      // 바로가기·사건부터 읽기·보관함 쪽지·키아트는 지우지 않고 아래 접는 칸으로 내렸다(처음 온 방문자에게는 '처음 오셨다면'을 펼쳐 둔다).
      h('div.tc-home-ticker-slot'),
      h('p.tc-home-silence', { role: 'status' }, h('b', { text: '외부 교신 두절' }), h('span', { text: '삼야 무응답과 같은 시각이다. 수신 목록이 멈췄다.' }), h('a', { href: PC.href('history', '2042-10-31-three-night-silence') }, '기록 보기 ›')),
      h('div.tc-home-daily-slot'),
      h('div.tc-home-grid', null, live.flash, live.signals),
      h('div.tc-home-updates-slot'),
      h('div.tc-home-folds', null,
        fold('tc-home-fold-start', '처음 오셨다면', '입문 카드·자캐 설정 안내·등록증·사건부터 읽기', h('div.tc-home-start', null, quickLinks(), entryPanel())),
        fold('tc-home-fold-custody', copy().custody?.title || '보관함에 남긴 쪽지', '서부 귀환 회랑 보관함 · 검문소 07 키아트', h('div.tc-home-open', null, custodyPanel(), keyArt())),
        fold('tc-home-fold-contact', contactStep ? `귀환 신호 — ${contactStep.title}` : '귀환 신호 접촉 보고', '육안 인원과 열원 수가 맞지 않은 보고', contactPanel()),
        fold('tc-home-fold-civil', civil?.title || '민간 재난 방송', '권역 경보망에서 받은 방송 여섯 건과 경보색 기준', civilPanel()),
        fold('tc-home-fold-bulletin', copy().bulletins?.title || '합동 작전 공고', bulletinItem() ? `${bulletinItem().code} · ${bulletinItem().title}` : '', bulletinPanel()),
        fold('tc-home-fold-zones', '구역 판정 판', '지역 여덟 곳의 판정과 오늘의 국가 간 정세', zonePanel()),
        // 2026-11-21 사용자 결정: 공포 지수·재 농도·수배 회람을 '오늘의 공시' 한 칸으로 묶었다. 요약은 위쪽 방송 띠가 흘린다.
        fold('tc-home-fold-notice', '오늘의 공시', '공포 지수·재 농도 기상 방송·수배 회람', h('div.tc-home-notice', null,
          noticePart('tc-home-notice-fear', copy().fear?.title || '도시 공포 지수', `도시 ${copy().fear?.cities?.length || 0}곳`, fearPanel()),
          noticePart('tc-home-notice-ash', copy().ashWeather?.title || '재 농도 기상 방송', `권역 ${copy().ashWeather?.regions?.length || 0}곳과 오늘의 하늘`, ashPanel()),
          noticePart('tc-home-notice-wanted', copy().wanted?.title || '수배 회람', `호출명 ${root.ProjectCurseWorldHistoryData?.worldFramework?.worldOrder?.items?.find((item) => item.id === 'wanted-list')?.wanted?.length || 0}개`, wantedPanel())
        )),
        fold('tc-home-fold-signal', copy().signal?.title || '수신 조각', `흩어진 방송 조각 ${copy().signal?.fragments?.length || 0}개`, h('div.tc-home-frag-slot')),
        fold('tc-home-fold-ops', '작전 기록', `작전 ${counts().ops}건의 마지막 기록`, live.ops)
      ),
      h('p.tc-home-foot.tc-full-only', null, h('span', { text: 'PC-03' }), h('b', { text: 'NO EXTERNAL HANDSHAKE' }))
    );
    subView = h('div.tc-home-sub', { hidden: true });
    el.append(indexView, subView);
    // 처음 온 방문자에게는 '처음 오셨다면'을 펼쳐 둔다
    if (root.PCUpdates?.first?.()) indexView.querySelector('#tc-home-fold-start')?.setAttribute('open', '');
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
    // 오늘의 기록은 날짜가 바뀌면 달라지므로 들어올 때마다 그린다. 수신 조각 모음도 같다.
    const daily = indexView.querySelector('.tc-home-daily-slot');
    if (daily) daily.replaceChildren(dailyCard());
    const ticker = indexView.querySelector('.tc-home-ticker-slot');
    if (ticker) ticker.replaceChildren(...[feastPanel(), tickerBar()].filter(Boolean));
    renderFragments();
    // 상황판이 보이는 동안 진행 상태가 바뀌면 다시 그린다. 두 번 들어와도 하나만 붙는다.
    listeners?.abort();
    listeners = new AbortController();
    STATE_EVENTS.forEach((type) => document.addEventListener(type, refresh, { signal: listeners.signal }));
    document.addEventListener('pc:signal', renderFragments, { signal: listeners.signal });
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
