// Project Curse 6 — 현장 지침 화면(옛 이름 교전 교범, 2026-09-25 채널 이름 변경) (담당: Claude)
// 새 설정을 쓰지 않는다. N.H.C 현장 교범(archive-document-data.js의 NHC_Manual_891219)과
// 세계 기본 규칙(world-history-data.js의 worldFramework)을 투입 전 참조판으로 다시 배치한다.
// 문장은 데이터에서 절 제목으로 찾아 읽는다. 제목이 바뀌어 찾지 못하면 없다고 표시한다.
(function (root) {
  'use strict';

  const PC = root.PCApp;
  const { h } = PC;

  const MANUAL_ID = 'NHC_Manual_891219';
  const STORAGE_KEY = 'pc6_field_register_v1';
  // 화면을 떠날 때(hide) 정리하는 타이머와, 없는 항목 안내를 넣는 자리
  let drawTimer = 0;
  let stampTimer = 0;
  let focusTimer = 0;
  let notice = null;
  const manual = () => root.ProjectCurseArchiveDocuments?.documents?.[MANUAL_ID] || null;
  const framework = () => root.ProjectCurseWorldHistoryData?.worldFramework || null;
  const factions = () => root.ProjectCurseCanon?.factions || {};

  function section(title) {
    return manual()?.sections?.find((item) => item.title === title) || null;
  }

  function missingSection(title) {
    return PC.missing('SECTION NOT FOUND', `${MANUAL_ID} / ${title}`, '교범 원문에서 이 절을 찾지 못했습니다.');
  }

  // 교범 원문의 이미지 경로는 docs 페이지 기준(../../)이다. 새 앱 기준으로 바꾼다.
  const assetPath = (src) => String(src || '').replace(/^(\.\.\/)+/, '');

  function list(items, cls) {
    return h('ul', { class: cls || 'tc-man-list' }, (items || []).map((item) => h('li', { text: item })));
  }

  function paragraphs(items) {
    return (items || []).map((text) => h('p', { text }));
  }

  // 표지 — 영문만 있는 표지는 전체 보기에서만, 'EN / 한글' 겹표지는 한글만 남긴다(2026-09-25 간략/전체 보기).
  function lbl(text) {
    const value = String(text || '');
    const [first, second] = value.split(' / ');
    const latin = (part) => /^[A-Z0-9 .·\-–?()'&:]+$/.test(part.trim()) && /[A-Z]{2}/.test(part);
    if (second && latin(first) && !latin(second)) return h('span.tc-label', null, h('span.tc-full-only', { text: `${first} / ` }), h('span', { text: second }));
    if (latin(value)) return h('span.tc-label.tc-full-only', { text: value });
    return h('span.tc-label', { text: value });
  }
  // 영문 머리글 + 한글 — 간략 보기에서는 한글만
  const bi = (english, korean) => h('b', null, h('span.tc-full-only', { text: `${english} / ` }), korean);

  // 2026-11-21 사용자 결정: 패널은 접는 칸이다. 처음에는 제목과 한 줄 설명(HINTS)만, 전체 보기에서는 펼친 채로 그린다.
  function panel(code, title, body, options = {}) {
    const slug = options.slug || code.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = `tc-man-${slug}`;
    // 등록 양식은 그 탭의 본문이라 늘 펼친다
    const open = options.open ?? (slug === 'register' || PC.density?.() === 'full');
    return h('details', { class: `tc-panel tc-man-panel${options.bracket ? ` tc-bracket${options.bracket === true ? '' : ` tc-bracket--${options.bracket}`}` : ''}${options.cls ? ` ${options.cls}` : ''}`, 'aria-labelledby': id, open, dataset: { slug } },
      h('summary.tc-panel-head', null,
        h('div', null, lbl(code), h('h2', { id, text: title }), HINTS[slug] ? h('p.tc-hint', { text: HINTS[slug] }) : null)
      ),
      h('div.tc-panel-body', null, body)
    );
  }

  /* ---------- 교범 첫머리 ---------- */
  // 마지막 개정일은 교범 데이터(revision)에서 읽는다. 2026-11-21 사용자 결정으로 2041 개정본이 됐다.
  const revision = () => manual()?.revision || '';

  function doctrine() {
    const doc = manual();
    const scope = section('적용 범위와 지휘 관계');
    const history = section('개정 이력');
    return h('section.tc-man-doctrine', { 'aria-label': '교범 첫 원칙' },
      h('blockquote', null, h('p', { text: scope?.quote || '' })),
      h('div.tc-man-doctrine-meta', null,
        h('span.tc-label', { text: doc?.code || MANUAL_ID }),
        h('span', { text: `${doc?.owner || ''} · ${doc?.classification || ''}` }),
        h('span', { text: `이 단말에 등록된 마지막 개정은 ${revision()} 개정본이다.` }),
        h('a.tc-btn', { href: PC.href('archive-entry', MANUAL_ID) }, '교범 원문 보기', h('i', { 'aria-hidden': 'true', text: '›' }))
      ),
      history?.table ? h('details.tc-disclosure.tc-man-revisions', null,
        h('summary', null, h('span', null, h('b', { text: '개정 이력' }))),
        h('div.tc-disclosure-body', null,
          paragraphs(history.paragraphs),
          h('div.tc-man-table', { role: 'table', 'aria-label': '교범 개정 이력' },
            h('div.tc-man-tr.tc-man-th', { role: 'row' }, history.table.headers.map((head) => h('span', { role: 'columnheader', text: head }))),
            history.table.rows.map(([date, label, text]) => h('div.tc-man-tr', { role: 'row' },
              h('span', { role: 'cell' }, h('b', { text: date })),
              h('span', { role: 'cell', 'data-head': history.table.headers[1], text: label }),
              h('span', { role: 'cell', 'data-head': history.table.headers[2], text })
            ))
          )
        )
      ) : missingSection('개정 이력')
    );
  }

  /* ---------- 탭과 한 줄 설명 (2026-11-21 사용자 결정) ---------- */
  // 패널 열일곱을 탭 넷으로 나눈다. 탭 안의 패널은 접힌 채 제목과 한 줄 설명만 보인다. #field-manual/<탭>으로 바로 연다.
  const HINTS = {
    break: '공유 시간·지휘 통신·철수 경로 가운데 둘을 잃으면 전원 철수한다.',
    roe: '목표는 사살이 아니라 접근 방향을 막는 것이다.',
    possessed: '몸을 빼앗긴 민간인. 체온과 맥박이 있으면 피탈자다.',
    risen: '일어난 죽은 몸은 관절부터 끊고 태운다.',
    blood: '피가 어디서 왔는지로 갈래를 나누고 대응한다.',
    percept: '보면 오염되는 괴이, 잔류물 착란, 리버스 정신 반응.',
    backflow: '사이렌이 울리고 10분이 지나면 대피소 문은 열리지 않는다.',
    cleanup: '잔류물 곁의 작업은 한 교대에 90초.',
    tags: 'White·Gray·Red·Black·Null — 다섯 표식.',
    prep: '철수 경로가 확정되지 않으면 들어가지 않는다.',
    move: '같은 복도가 반복되면 멈춘다. 탄피를 던져 거리를 본다.',
    team: '다섯 자리, 삼중 계수, 독립시계 셋.',
    loadout: '장비군 일곱과 제식 화기.',
    wielder: '능력의 발현 경로와 그 대가.',
    lines: '민간 분리, 회수, 지휘 승계, 작전 종료와 인식표.',
    checkpoint: '바깥에서 안쪽으로 한 방향, 일곱 단계.',
    drill: '기계 판정에 서명할지 보류할지 고른다. 정답은 없다.',
    register: '자캐 등록 양식과 등록증 그림(PNG).',
    // 2026-11-21 사용자 결정 — 능력 등급·소능력·2030년대 장비
    'ability-grade': 'L0–L4. 등급은 세기가 아니라 얼마나 지켜볼지다.',
    fitness: '관측 신뢰도·이름 반응·계수·오염 내성·교전·남은 기억 — A–E.',
    service: '기억 대조 일치율, 진입·귀환, 누적 노출, 체력 검정, 웃음 반응.',
    skills: '저격부터 통역까지 열네 자격. 한 사람이 셋까지.',
    'minor-abilities': '작고 쓸모 있는 능력 열 가지와 그 대가.',
    'field-abilities': '교전을 돕지만 혼자 상황을 바꾸지 못하는 능력 여덟.',
    'cost-log': '쓸 때마다 적는 대가 일지와 72시간 억제제.',
    'field-electronics': '판정 조준경, 투명 표시창 고글, 전자 인식표, 손바닥 드론.',
    'body-augments': '열상 의안, 근전도 의수, 피부 아래 신원 칩, 신경 포트.',
    'black-market': '체온 조끼, 칩 복제기 — 검문을 속이는 장비와 적발 요령.',
    'anti-reverse': '기억 보존 기록기, 이름 반응 측정기, 역류 계측기.'
  };
  const TABS = {
    roe: { title: '교전 규칙', hint: '철수·교전·피탈자·기시체·혈술·지각 오염·표식' },
    field: { title: '현장 절차', hint: '진입·현장조·역류·청소조·인계·검문소·서명 연습' },
    gear: { title: '장비와 능력', hint: '능력 등급·소능력·장비군·2030년대 장비' },
    register: { title: '자캐 등록', hint: '등록 양식·등록증 그림' }
  };
  let manualTabs = null;

  function setTab(id, focus) {
    return manualTabs?.set(id, focus) || false;
  }

  function tabs(groups) {
    manualTabs = PC.tabs({
      id: 'tc-man', label: '현장 지침 보기', active: 'roe',
      items: Object.entries(TABS).map(([id, tab]) => ({ id, title: tab.title, hint: tab.hint, body: groups[id] }))
    });
    return [manualTabs.tablist, ...manualTabs.panels];
  }

  /* ---------- 철수 조건 판정 ---------- */
  // "공유 시간, 지휘 통신 또는 철수 경로 가운데 둘을 잃으면 전원 철수한다." — 교범 문장을 그대로 판정기로 만든다.
  const BREAK_SIGNALS = [['time', '공유 시간'], ['comms', '지휘 통신'], ['route', '철수 경로']];

  function breakPanel() {
    const sec = section('철수와 봉쇄선 붕괴');
    if (!sec) return missingSection('철수와 봉쇄선 붕괴');
    const lost = new Set();
    const verdict = h('p.tc-man-verdict', { 'aria-live': 'polite' });
    const buttons = BREAK_SIGNALS.map(([key, label]) => h('button', {
      type: 'button',
      'aria-pressed': 'false',
      dataset: { signal: key },
      onclick: (event) => {
        const button = event.currentTarget;
        if (lost.has(key)) lost.delete(key);
        else lost.add(key);
        button.setAttribute('aria-pressed', String(lost.has(key)));
        update();
      }
    }, h('span', { text: label }), h('b', { class: 'tc-man-signal-state' })));

    function update() {
      buttons.forEach((button) => {
        const off = lost.has(button.dataset.signal);
        button.querySelector('.tc-man-signal-state').textContent = off ? 'LOST' : 'HOLD';
      });
      const abort = lost.size >= 2;
      verdict.classList.toggle('is-abort', abort);
      verdict.textContent = abort
        ? `전원 철수 — 셋 가운데 ${lost.size}개 상실`
        : `작전 지속 — 셋 가운데 ${lost.size}개 상실. 두 개를 잃으면 전원 철수한다.`;
      if (abort) root.PCAudio?.cue('system.denied');
    }
    update();

    const withdrawal = sec.items || [];
    return panel('BREAK CONDITIONS', '철수 조건', [
      h('p.tc-man-lead', { text: withdrawal[0] || '' }),
      h('div.tc-man-signals', { role: 'group', 'aria-label': '상실한 기준 선택' }, buttons),
      verdict,
      list(withdrawal.slice(1)),
      sec.warning ? h('div.tc-note.tc-note--caution', null, bi('COMMANDER NOTE', '지휘관 메모'), h('p', { text: sec.warning })) : null
    ], { bracket: 'danger', slug: 'break' });
  }

  /* ---------- 교전 원칙 ---------- */
  // 교범 절에 붙은 장면 그림(분석 재구성)은 원칙 문단 뒤에 싣는다. 한계 문장은 증거 대장(visual-evidence-data.js)에서 읽는다.
  function scene(image) {
    if (!image?.src) return null;
    const src = assetPath(image.src);
    const handling = root.ProjectCurseVisualEvidence?.resolve?.(src)?.handling;
    return h('figure.tc-evidence.tc-man-scene', null,
      h('div.tc-evidence-media', null, PC.img(src, { alt: image.alt || '', sizes: '(max-width: 760px) 94vw, 720px' })),
      h('figcaption', null, h('b', { text: image.caption || '' }), handling ? h('span', { text: handling }) : null)
    );
  }

  function engagementPanel() {
    const sec = section('접촉과 교전');
    if (!sec) return missingSection('접촉과 교전');
    return panel('RULES OF ENGAGEMENT', '접촉과 교전', [
      paragraphs(sec.paragraphs),
      scene(sec.image),
      list(sec.items, 'tc-man-list tc-man-list--rules'),
      sec.warning ? h('div.tc-note.tc-note--danger', null, bi('MISSION FAILURE', '임무 실패'), h('p', { text: sec.warning })) : null
    ], { slug: 'roe' });
  }

  /* ---------- 피탈자 교전 규칙 ---------- */
  // 리버스 지점에서 몸을 빼앗긴 민간인, 피탈자(2026-09-25 사용자 설정). 세계 기본 규칙의 같은 항목과 서로 링크한다.
  function possessionPanel() {
    const sec = section('피탈자 교전 규칙');
    if (!sec) return missingSection('피탈자 교전 규칙');
    const rec = sec.record || {};
    return panel('ROE / TAKEN CIVILIANS', '피탈자 교전 규칙', [
      paragraphs(sec.paragraphs),
      scene(sec.image),
      list(sec.items, 'tc-man-list tc-man-list--rules'),
      sec.quote ? h('blockquote.tc-man-quote', null, h('p', { text: sec.quote })) : null,
      sec.warning ? h('div.tc-note.tc-note--danger', null, bi('MISSION FAILURE', '임무 실패'), h('p', { text: sec.warning })) : null,
      rec.limit ? h('div.tc-note.tc-note--caution', null, bi('INFORMATION LIMIT', '이 규칙의 한계'), h('p', { text: rec.limit })) : null,
      h('p', null, h('a', { href: PC.href('history', 'ref', 'rule-possession') }, '세계 기본 규칙에서 피탈자 항목 보기', h('i', { 'aria-hidden': 'true', text: ' ›' })))
    ], { bracket: 'danger', slug: 'possessed' });
  }

  /* ---------- 기시체 소각 프로토콜 ---------- */
  // 일어난 죽은 몸, 기시체(2026-11-21 사용자 설정). 체온·맥박으로 피탈자와 가른다.
  function risenPanel() {
    const sec = section('기시체 소각 프로토콜');
    if (!sec) return missingSection('기시체 소각 프로토콜');
    const rec = sec.record || {};
    return panel('ROE / RISEN CORPSES', '기시체 소각 프로토콜', [
      paragraphs(sec.paragraphs),
      list(sec.items, 'tc-man-list tc-man-list--rules'),
      sec.warning ? h('div.tc-note.tc-note--danger', null, bi('RECORD RULE', '기록 규칙'), h('p', { text: sec.warning })) : null,
      rec.limit ? h('div.tc-note.tc-note--caution', null, bi('INFORMATION LIMIT', '이 규칙의 한계'), h('p', { text: rec.limit })) : null,
      h('p', null, h('a', { href: PC.href('history', 'ref', 'rule-risen') }, '세계 기본 규칙에서 기시체 항목 보기', h('i', { 'aria-hidden': 'true', text: ' ›' })))
    ], { bracket: 'danger', slug: 'risen' });
  }

  /* ---------- 혈술 대응 ---------- */
  // 피를 쓰는 능력의 네 갈래(2026-11-21 사용자 추천안 승인). 세계 기본 규칙의 혈술 항목과 서로 링크한다.
  function bloodPanel() {
    const sec = section('혈술 대응');
    if (!sec?.table) return missingSection('혈술 대응');
    const [, signHead, counterHead] = sec.table.headers;
    const rec = sec.record || {};
    return panel('ROE / BLOOD ARTS', '혈술 대응', [
      paragraphs(sec.paragraphs),
      h('div.tc-man-table', { role: 'table', 'aria-label': '혈술 갈래별 징후와 대응' },
        h('div.tc-man-tr.tc-man-th', { role: 'row' },
          sec.table.headers.map((head) => h('span', { role: 'columnheader', text: head }))
        ),
        sec.table.rows.map(([branch, sign, counter]) => h('div.tc-man-tr', { role: 'row' },
          h('span', { role: 'cell' }, h('b', { text: branch })),
          h('span', { role: 'cell', 'data-head': signHead, text: sign }),
          h('span', { role: 'cell', 'data-head': counterHead, text: counter })
        ))
      ),
      list(sec.items, 'tc-man-list tc-man-list--rules'),
      sec.warning ? h('div.tc-note.tc-note--danger', null, bi('AFTER CONTACT', '쓰러뜨린 뒤'), h('p', { text: sec.warning })) : null,
      rec.limit ? h('div.tc-note.tc-note--caution', null, bi('INFORMATION LIMIT', '이 규칙의 한계'), h('p', { text: rec.limit })) : null,
      h('p', null, h('a', { href: PC.href('history', 'ref', 'rule-blood') }, '세계 기본 규칙에서 혈술 항목 보기', h('i', { 'aria-hidden': 'true', text: ' ›' })))
    ], { bracket: 'danger', slug: 'blood' });
  }

  /* ---------- 지각 오염 대응 ---------- */
  // 보면 오염되는 괴이, 잔류물 착란, 리버스 정신 반응(2026-11-21 사용자 추천안 승인). 세계 기본 규칙의 같은 항목과 서로 링크한다.
  function perceptPanel() {
    const sec = section('지각 오염 대응');
    if (!sec?.table) return missingSection('지각 오염 대응');
    const [, signHead, actHead] = sec.table.headers;
    const rec = sec.record || {};
    return panel('ROE / PERCEPTUAL HAZARD', '지각 오염 대응', [
      paragraphs(sec.paragraphs),
      h('div.tc-man-table', { role: 'table', 'aria-label': '지각 오염 갈래별 징후와 조치' },
        h('div.tc-man-tr.tc-man-th', { role: 'row' },
          sec.table.headers.map((head) => h('span', { role: 'columnheader', text: head }))
        ),
        sec.table.rows.map(([kind, sign, act]) => h('div.tc-man-tr', { role: 'row' },
          h('span', { role: 'cell' }, h('b', { text: kind })),
          h('span', { role: 'cell', 'data-head': signHead, text: sign }),
          h('span', { role: 'cell', 'data-head': actHead, text: act })
        ))
      ),
      list(sec.items, 'tc-man-list tc-man-list--rules'),
      sec.warning ? h('div.tc-note.tc-note--caution', null, bi('RECORD RULE', '기록 규칙'), h('p', { text: sec.warning })) : null,
      rec.limit ? h('div.tc-note.tc-note--caution', null, bi('INFORMATION LIMIT', '이 규칙의 한계'), h('p', { text: rec.limit })) : null,
      h('p', null, h('a', { href: PC.href('history', 'ref', 'rule-anchor') }, '세계 기본 규칙에서 앵커 잔류물의 부름 보기', h('i', { 'aria-hidden': 'true', text: ' ›' })))
    ], { bracket: 'danger', slug: 'percept' });
  }

  /* ---------- 역류 경보와 대피 · 청소조 노출 한도 ---------- */
  // 같은 모양의 짧은 절 둘(2026-11-21 사용자 추천안 승인). 문단·순서·경고만 그린다.
  function rulePanel(title, code, slug, noteCode, noteLabel, extra) {
    const sec = section(title);
    if (!sec) return missingSection(title);
    return panel(code, title, [
      paragraphs(sec.paragraphs),
      list(sec.items, 'tc-man-list tc-man-list--rules'),
      extra || null,
      sec.warning ? h('div.tc-note.tc-note--caution', null, bi(noteCode, noteLabel), h('p', { text: sec.warning })) : null
    ], { slug });
  }

  // 현장 적합성 평가 항목 — [양식 키, 이름, 등록증의 짧은 이름]. 교범 '현장 적합성 평가' 표의 순서와 같다.
  const FITNESS = [['observe', '관측 신뢰도', '관측'], ['name', '이름 반응', '이름'], ['count', '계수 정확도', '계수'], ['contam', '오염 내성', '오염'], ['combat', '교전 숙련', '교전'], ['memory', '남은 기억', '기억']];

  /* ---------- 표 하나짜리 절 (2026-11-21 사용자 결정) ---------- */
  // 능력 등급·소능력·장비처럼 문단 + 표 + 항목 + 경고로 된 절. 칸 수는 표마다 다르다. 좁은 화면에서는 칸 제목을 줄마다 붙인다.
  function tablePanel(title, code, slug) {
    const sec = section(title);
    if (!sec?.table) return missingSection(title);
    const heads = sec.table.headers;
    return panel(code, title, [
      paragraphs(sec.paragraphs),
      h('div.tc-man-table.tc-man-table--wide', { role: 'table', 'aria-label': title, style: `--tpl:minmax(7rem, .9fr) repeat(${Math.max(1, heads.length - 1)}, minmax(0, 1.6fr))` },
        h('div.tc-man-tr.tc-man-th', { role: 'row' }, heads.map((head) => h('span', { role: 'columnheader', text: head }))),
        sec.table.rows.map((row) => h('div.tc-man-tr', { role: 'row' },
          row.map((cell, index) => index === 0
            ? h('span', { role: 'cell' }, h('b', { text: cell }))
            : h('span', { role: 'cell', 'data-head': heads[index], text: cell }))
        ))
      ),
      list(sec.items, 'tc-man-list tc-man-list--rules'),
      sec.warning ? h('div.tc-note.tc-note--caution', null, bi('NOTE', '참고'), h('p', { text: sec.warning })) : null
    ], { slug });
  }

  /* ---------- 현장조 편성과 계수 ---------- */
  // 다섯 자리, 삼중 계수, 독립시계 세 개(2026-11-21 사용자 추천안 승인). 공유 시간은 철수 조건 판정과 같은 항목이다.
  function teamPanel() {
    const sec = section('현장조 편성과 계수');
    if (!sec?.table) return missingSection('현장조 편성과 계수');
    const [roleHead, dutyHead] = sec.table.headers;
    return panel('FIELD TEAM / COUNT', '현장조 편성과 계수', [
      paragraphs(sec.paragraphs),
      h('div.tc-man-sources', { role: 'table', 'aria-label': '현장조 다섯 자리' },
        h('div.tc-man-tr.tc-man-th', { role: 'row' },
          h('span', { role: 'columnheader', text: roleHead }),
          h('span', { role: 'columnheader', text: dutyHead })
        ),
        sec.table.rows.map(([role, duty]) => h('div.tc-man-tr', { role: 'row' },
          h('span', { role: 'cell' }, h('b', { text: role })),
          h('span', { role: 'cell', 'data-head': dutyHead, text: duty })
        ))
      ),
      list(sec.items, 'tc-man-list tc-man-list--rules'),
      sec.warning ? h('div.tc-note.tc-note--caution', null, bi('COUNT RULE', '계수 규칙'), h('p', { text: sec.warning })) : null
    ], { slug: 'team' });
  }

  /* ---------- 검문소 표준 배치 ---------- */
  // 바깥에서 안쪽으로 한 방향 동선(2026-11-21 사용자 추천안 승인). 단계 번호는 교범 표의 순서 그대로다.
  function checkpointPanel() {
    const sec = section('검문소 표준 배치');
    if (!sec?.table) return missingSection('검문소 표준 배치');
    return panel('CHECKPOINT LAYOUT', '검문소 표준 배치', [
      paragraphs(sec.paragraphs),
      h('ol.tc-man-steps', { 'aria-label': '검문소 단계' }, sec.table.rows.map(([step, duty]) =>
        h('li', null, h('b', { text: step }), h('span', { text: duty }))
      )),
      list(sec.items),
      PC.signalMark?.('sig-5'),
      sec.warning ? h('div.tc-note.tc-note--caution', null, bi('NOTE', '참고'), h('p', { text: sec.warning })) : null
    ], { slug: 'checkpoint' });
  }

  /* ---------- 자동 판정 서명 연습 (2026-11-21 사용자 결정) ---------- */
  // 7주 차 검문 훈련 자료. 날짜로 세 사례를 고른다. 서명·보류 뒤에 실제로 있었던 일을 보인다. 정답·점수는 없다. 기록하지 않는다.
  function drillPanel() {
    const sec = section('자동 판정 서명 연습');
    const drill = sec?.drill;
    if (!drill?.cases?.length) return missingSection('자동 판정 서명 연습');
    const day = Math.floor(Date.now() / 86400000);
    const start = day % drill.cases.length;
    const picked = [0, 1, 2].map((offset) => drill.cases[(start + offset) % drill.cases.length]);
    const TONE = { '사람': 'ok', '피탈자': 'caution', '기시체': 'danger' };
    return panel('VERDICT SIGN-OFF DRILL', '자동 판정 서명 연습', [
      paragraphs(sec.paragraphs),
      h('ol.tc-man-drill', null, picked.map((item) => {
        const result = h('p.tc-man-drill-result', { hidden: true, 'aria-live': 'polite' });
        const choose = (kind) => {
          result.textContent = kind === 'signed' ? item.signed : item.held;
          result.hidden = false;
          sign.disabled = true;
          hold.disabled = true;
          (kind === 'signed' ? sign : hold).classList.add('is-chosen');
          root.PCAudio?.cue(kind === 'signed' ? 'system.alert' : 'menu.select');
        };
        const sign = h('button.tc-btn.tc-btn--caution', { type: 'button', onclick: () => choose('signed') }, '서명');
        const hold = h('button.tc-btn', { type: 'button', onclick: () => choose('held') }, '보류');
        return h('li', null,
          h('header', null, h('b', { text: item.label }), h('span', null, '기계 판정 ', PC.tag(item.machine, TONE[item.machine] || 'info'))),
          h('dl.tc-man-drill-readings', null, drill.columns.map((column, index) => h('div', null, h('dt', { text: column }), h('dd.tc-code', { text: item.readings[index] })))),
          h('div.tc-btnrow', null, sign, hold),
          result
        );
      })),
      sec.warning ? h('div.tc-note.tc-note--caution', null, bi('SIGN-OFF RULE', '서명 규칙'), h('p', { text: sec.warning })) : null
    ], { slug: 'drill' });
  }

  /* ---------- 표식 체계 ---------- */
  const TAG_CLASS = { 'White Tag': 'white', 'Gray Tag': 'gray', 'Red Tag': 'red', 'Black Tag': 'black', 'Null Tag': 'null' };

  function tagChip(name) {
    return h('span', { class: `tc-man-tag is-${TAG_CLASS[name] || 'gray'}`, text: name });
  }

  function tagPanel() {
    const sec = section('Black Tag Protocol');
    if (!sec?.table) return missingSection('Black Tag Protocol');
    const [, meaningHead, actionHead] = sec.table.headers;
    return panel('BLACK TAG PROTOCOL', '표식 체계', [
      paragraphs(sec.paragraphs),
      h('div.tc-man-table', { role: 'table', 'aria-label': '현장 표식' },
        h('div.tc-man-tr.tc-man-th', { role: 'row' },
          sec.table.headers.map((head) => h('span', { role: 'columnheader', text: head }))
        ),
        sec.table.rows.map(([name, meaning, action]) => h('div.tc-man-tr', { role: 'row' },
          h('span', { role: 'cell' }, tagChip(name)),
          h('span', { role: 'cell', 'data-head': meaningHead, text: meaning }),
          h('span', { role: 'cell', 'data-head': actionHead, text: action })
        ))
      ),
      sec.warning ? h('div.tc-note.tc-note--evidence', null, bi('TAG RULE', '표식 규칙'), h('p', { text: sec.warning })) : null
    ], { bracket: true, slug: 'tags' });
  }

  /* ---------- 진입 ---------- */
  function entryPanels() {
    const prep = section('진입 전 준비');
    const move = section('진입과 이동');
    return h('div.tc-man-pair', null,
      prep ? panel('PRE-ENTRY CHECK', '진입 전 준비', [
        list(prep.items, 'tc-man-list tc-man-list--check'),
        prep.warning ? h('div.tc-note.tc-note--caution', null, bi('NO ENTRY', '들어가지 말 것'), h('p', { text: prep.warning })) : null
      ], { slug: 'prep' }) : missingSection('진입 전 준비'),
      move ? panel('MOVEMENT', '진입과 이동', [
        paragraphs(move.paragraphs),
        list(move.items, 'tc-man-list tc-man-list--rules')
      ], { slug: 'move' }) : missingSection('진입과 이동')
    );
  }

  /* ---------- 장비군 ---------- */
  function loadoutPanel() {
    const sec = section('장비 운용');
    if (!sec) return missingSection('장비 운용');
    const functions = new Map((sec.table?.rows || []).map(([name, role]) => [name, role]));
    return panel('LOADOUT', '장비군', [
      paragraphs(sec.paragraphs),
      h('ul.tc-man-loadout', null, (sec.groups || []).map((group) => h('li', { class: ['현장 제압 장비군', '제식 화기군'].includes(group.title) ? 'is-kinetic' : null },
        h('header', null,
          h('b', { text: group.title }),
          functions.get(group.title) ? h('span', { text: functions.get(group.title) }) : null
        ),
        h('ul', null, group.items.map((item) => {
          const [name, ...rest] = item.split(' — ');
          return h('li', null, h('b.tc-man-item-name', { text: name }), rest.length ? h('span', { text: rest.join(' — ') }) : null);
        }))
      ))),
      sec.warning ? h('div.tc-note.tc-note--caution', null, bi('ROUND DISCIPLINE', '사격 규율'), h('p', { text: sec.warning })) : null
    ], { slug: 'loadout' });
  }

  /* ---------- 현장 편성·회수·승계 ---------- */
  function linesPanel() {
    const scope = section('적용 범위와 지휘 관계');
    const blocks = [
      ['민간인 분리와 구조', 'CIVILIAN LINE'],
      ['회수와 현장 처리', 'RECOVERY LINE'],
      ['지휘 승계와 인증', 'COMMAND SUCCESSION'],
      ['작전 종료와 기록', 'AFTER ACTION']
    ];
    return panel('FIELD LINES', '현장 편성과 인계', [
      scope ? paragraphs(scope.paragraphs) : missingSection('적용 범위와 지휘 관계'),
      h('div.tc-man-folds', null, blocks.map(([title, code]) => {
        const sec = section(title);
        if (!sec) return missingSection(title);
        return h('details.tc-disclosure', null,
          h('summary', null, h('span', null, h('span.tc-label', { text: code }), h('b', { text: title }))),
          h('div.tc-disclosure-body.tc-man-fold', null,
            sec.image ? h('figure.tc-evidence.tc-man-plate', null,
              h('div.tc-evidence-media', null, PC.img(assetPath(sec.image.src), { alt: sec.image.alt || '', sizes: '200px' })),
              h('figcaption', null, h('b', { text: sec.image.caption || '' }))
            ) : null,
            h('div', null,
              paragraphs(sec.paragraphs),
              list(sec.items),
              sec.warning ? h('div.tc-note.tc-note--caution', null, bi('NOTE', '참고'), h('p', { text: sec.warning })) : null
            )
          )
        );
      }))
    ], { slug: 'lines' });
  }

  /* ---------- 능력 운용 ---------- */
  function wielderPanel() {
    const fw = framework();
    if (!fw) return PC.missing('FRAMEWORK MISSING', 'worldFramework', '세계 기본 규칙 데이터가 없습니다.');
    const ceiling = fw.wielderCeiling;
    return panel('WIELDER / 능력 운용', '능력과 대가', [
      h('ul.tc-man-ontology', null, fw.ontology.map((item) => h('li', null,
        h('span.tc-label', { text: item.code }), h('b', { text: item.name }), h('p', { text: item.text })
      ))),
      h('div.tc-man-sources', { role: 'table', 'aria-label': '능력의 발현 경로와 대가' },
        h('div.tc-man-tr.tc-man-th', { role: 'row' }, h('span', { role: 'columnheader', text: '발현 경로' }), h('span', { role: 'columnheader', text: '대가' })),
        fw.abilitySources.map((item) => h('div.tc-man-tr', { role: 'row' },
          h('span', { role: 'cell' }, h('b', { text: item.name })),
          h('span', { role: 'cell', text: item.cost })
        ))
      ),
      ceiling ? h('div.tc-man-ceiling', null,
        h('header', null, h('b', { text: ceiling.label }), PC.tag(ceiling.status, 'caution')),
        h('p', { text: ceiling.rule }),
        ceiling.consequence ? h('p', { text: ceiling.consequence }) : null,
        h('p.tc-man-caution', { text: ceiling.caution })
      ) : null
    ], { slug: 'wielder' });
  }

  /* ---------- 현장 인원 등록 양식 ---------- */
  const LINES = [
    ['교전선', 'N.H.C'],
    ['민간선', 'C.P.D'],
    ['회수선', 'A.R.F'],
    ['현장 처리', 'Ash Crew'],
    ['재검사·수사', 'S.I.D'],
    ['구역 판정', 'U.A.C'],
    ['해당 없음', '']
  ];

  function loadForm() {
    try {
      return JSON.parse(root.localStorage.getItem(STORAGE_KEY) || '{}') || {};
    } catch (_error) {
      return {};
    }
  }
  function saveForm(values) {
    try {
      root.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch (_error) { /* 저장하지 못해도 이번 방문에서는 쓴다 */ }
  }

  function registerPanel() {
    const fw = framework();
    const tagSec = section('Black Tag Protocol');
    const gear = section('장비 운용');
    const saved = loadForm();
    const field = (label, control, hint) => h('label.tc-man-field', null, h('span', { text: label }), control, hint ? h('small', { text: hint }) : null);
    const select = (name, options, value) => h('select', { name },
      options.map(([optionValue, text]) => h('option', { value: optionValue, selected: optionValue === value ? true : null, text }))
    );

    const factionOptions = [['', '선택'], ...Object.entries(factions()).map(([key, item]) => [key, item.name || key]), ['none', '무소속·민간']];
    const classOptions = [['', '선택'], ['human', '인간'], ...(fw?.ontology || []).filter((item) => ['PERSON', 'WIELDER'].includes(item.code)).map((item) => [item.code, item.name])];
    const sourceOptions = [['', '해당 없음'], ...(fw?.abilitySources || []).map((item) => [item.name, item.name])];
    const tagOptions = [['', '선택'], ...(tagSec?.table?.rows || []).map(([name]) => [name, name])];
    // 출신 목록은 자캐 설정 안내(community-guide-data.js의 origin 항목)에서 읽는다.
    const originSection = root.ProjectCurseCommunityGuide?.guide?.sections?.find?.((item) => item.id === 'origin');
    const originOptions = [['', '선택 안 함'], ...(originSection?.items || []).map(([name]) => [name, name])];
    const gearGroups = (gear?.groups || []).map((group) => group.title);
    // 2026-11-21 사용자 결정 — 능력 등급·소능력·보조 장비는 교범 절의 표에서 읽는다
    const rowsOf = (title) => section(title)?.table?.rows || [];
    const gradeOptions = [['', '선택 안 함'], ...rowsOf('능력 등급과 등록').map(([grade, target]) => [grade, `${grade} — ${target}`])];
    const minorOptions = [['', '없음'], ...rowsOf('생활형 소능력').map(([name]) => [name, `${name} (L1)`]), ...rowsOf('현장형 보조 능력').map(([name]) => [name, `${name} (L2)`])];
    const augmentOptions = [['', '없음'], ...rowsOf('인체 보조 장비').map(([name]) => [name, name]), ...rowsOf('현장 전자장비').map(([name]) => [name, name])];
    // 복무 기록(2026-11-21 사용자 결정) — 전 소속은 자캐 설정 안내의 묶음, 나머지는 교범 '복무 기록과 계측값'·'현장 자격과 특기'에서 읽는다
    const serviceSection = root.ProjectCurseCommunityGuide?.guide?.sections?.find?.((item) => item.id === 'service');
    const serviceSec = section('복무 기록과 계측값') || {};
    const skillRows = rowsOf('현장 자격과 특기');
    const pick = (list) => [['', '—'], ...(list || []).map((item) => [item, item])];
    const unitSelect = (value) => h('select', { name: 'unit' },
      h('option', { value: '', selected: value ? null : true, text: '없음' }),
      (serviceSection?.groups || []).map((group) => h('optgroup', { label: group.title },
        group.items.map(([name]) => h('option', { value: name, selected: name === value ? true : null, text: name }))
      ))
    );
    const num = (name, max, value) => h('input', { name, type: 'number', inputmode: 'numeric', min: '0', max: String(max), step: '1', value: value ?? '' });
    const savedService = saved.service || {};

    const form = h('form.tc-man-form', { onsubmit: (event) => event.preventDefault() },
      field('이름', h('input', { name: 'name', type: 'text', maxlength: '24', autocomplete: 'off', value: saved.name || '' }), '캐릭터 이름. 등록증 그림에 크게 들어간다.'),
      // 호출부호가 비어 있으면 단말 열람자 호출부호(설정·접속 화면)를 먼저 채운다
      field('호출부호', h('input', { name: 'callsign', type: 'text', maxlength: '24', autocomplete: 'off', value: saved.callsign || root.PCPrefs?.operator?.() || '' })),
      field('소속', select('faction', factionOptions, saved.faction || '')),
      field('배치선', select('line', [['', '선택'], ...LINES.map(([line, unit]) => [line, unit ? `${line} — ${unit}` : line])], saved.line || '')),
      field('분류', select('class', classOptions, saved.class || ''), '괴이는 등록 대상이 아니다.'),
      field('발현 경로', select('source', sourceOptions, saved.source || ''), '능력자만 적는다. 대가는 교범 기준으로 자동으로 적힌다.'),
      field('출신', select('origin', originOptions, saved.origin || ''), '자캐 설정 안내의 출신 목록. 고르면 등록증에 한 줄 들어간다.'),
      field('능력 등급', select('grade', gradeOptions, saved.grade || ''), '등급은 세기가 아니라 얼마나 지켜볼지다.'),
      field('소능력', select('minor', minorOptions, saved.minor || ''), '작은 능력 하나. 대가는 교범 표대로 자동으로 적힌다.'),
      field('보조 장비', select('augment', augmentOptions, saved.augment || ''), '몸에 단 장비나 개인 전자장비 하나.'),
      // 현장 적합성 평가(2026-11-21 사용자 결정) — 여섯 항목을 A–E로. 비워 두면 양식과 등록증에 나오지 않는다
      h('fieldset.tc-man-field.tc-man-fitness', null,
        h('legend', { text: '현장 적합성 평가 (선택)' }),
        FITNESS.map(([key, name]) => h('label', null, h('span', { text: name }),
          select(`fit-${key}`, [['', '—'], ['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D'], ['E', 'E']], saved.fitness?.[key] || '')
        )),
        h('small', { text: '등급은 세기가 아니라 어디까지 들여보낼지다. 높을수록 깊이 배치된다.' })
      ),
      h('fieldset.tc-man-field.tc-man-service', null,
        h('legend', { text: '복무 기록 (선택)' }),
        field('전 소속', unitSelect(savedService.unit || ''), '실제 부대는 전 소속으로만. 부대 마크는 그림에 넣지 않는다.'),
        field('복무 기간', h('input', { name: 'period', type: 'text', maxlength: '20', autocomplete: 'off', placeholder: '예: 2031–2039', value: savedService.period || '' })),
        field('퇴역 사유', select('discharge', pick(serviceSec.discharge), savedService.discharge || '')),
        field('기억 대조 일치율 (%)', num('memory', 100, savedService.memory), '90 이상 통과 · 70–89 재검사 · 70 밑 관측 자격 정지'),
        h('div.tc-man-counts', null,
          field('존 진입', num('entries', 999, savedService.entries)),
          field('귀환', num('returns', 999, savedService.returns)),
          field('리버스 목격', num('sightings', 999, savedService.sightings))
        ),
        field('누적 노출 (분)', num('exposure', 9999, savedService.exposure), '작전 인원 한도는 한 해 30분.'),
        field('체력 검정', select('physical', pick(serviceSec.physical), savedService.physical || '')),
        field('웃음 반응 검사', select('laugh', pick(serviceSec.laugh), savedService.laugh || '')),
        h('fieldset.tc-man-skills', null,
          h('legend', { text: '자격·특기 (셋까지)' }),
          skillRows.map(([name]) => h('label', null,
            h('input', { type: 'checkbox', name: 'skill', value: name, checked: (savedService.skills || []).includes(name) ? true : null }),
            h('span', { text: name })
          ))
        ),
        field('잃은 것', h('input', { name: 'lost', type: 'text', maxlength: '40', autocomplete: 'off', placeholder: '예: 어머니의 목소리', value: savedService.lost || '' })),
        field('남은 것', h('input', { name: 'kept', type: 'text', maxlength: '40', autocomplete: 'off', placeholder: '예: 첫 배치지의 냄새', value: savedService.kept || '' })),
        h('small', { text: '고른 칸만 글 양식과 복무 기록 그림에 들어간다. 남은 기억이 많을수록 프리윌 계약금이 높다.' })
      ),
      field('표식', select('tag', tagOptions, saved.tag || '')),
      h('fieldset.tc-man-field.tc-man-gear', null,
        h('legend', { text: '장비군' }),
        gearGroups.map((title) => h('label', null,
          h('input', { type: 'checkbox', name: 'gear', value: title, checked: (saved.gear || []).includes(title) ? true : null }),
          h('span', { text: title })
        ))
      ),
      field('마지막 정상 기준점', h('input', { name: 'anchor', type: 'text', maxlength: '40', autocomplete: 'off', value: saved.anchor || '' }), '교범: 마지막으로 정상 확인된 기준점을 표시한다.'),
      h('label.tc-man-field.tc-man-field--wide', null, h('span', { text: '한 줄 기록 (선택)' }),
        h('input', { name: 'note', type: 'text', maxlength: '60', autocomplete: 'off', value: saved.note || '' }),
        h('small', { text: '캐릭터를 한 줄로. 등록증 그림 아래에 들어간다.' }))
    );

    const preview = h('pre.tc-man-preview', { 'aria-live': 'polite' });
    const copyStatus = h('span.tc-man-copy-status', { role: 'status' });
    const copyButton = h('button.tc-btn.tc-btn--primary', { type: 'button', onclick: copy }, '양식 복사');

    function values() {
      const data = new FormData(form);
      return {
        name: String(data.get('name') || '').trim(),
        callsign: String(data.get('callsign') || '').trim(),
        faction: data.get('faction') || '',
        line: data.get('line') || '',
        class: data.get('class') || '',
        source: data.get('source') || '',
        tag: data.get('tag') || '',
        origin: data.get('origin') || '',
        grade: data.get('grade') || '',
        fitness: Object.fromEntries(FITNESS.map(([key]) => [key, data.get(`fit-${key}`) || ''])),
        minor: data.get('minor') || '',
        augment: data.get('augment') || '',
        service: {
          unit: data.get('unit') || '',
          period: String(data.get('period') || '').trim(),
          discharge: data.get('discharge') || '',
          memory: clampNum(data.get('memory'), 100),
          entries: clampNum(data.get('entries'), 999),
          returns: clampNum(data.get('returns'), 999),
          sightings: clampNum(data.get('sightings'), 999),
          exposure: clampNum(data.get('exposure'), 9999),
          physical: data.get('physical') || '',
          laugh: data.get('laugh') || '',
          skills: data.getAll('skill').slice(0, 3),
          lost: String(data.get('lost') || '').trim(),
          kept: String(data.get('kept') || '').trim()
        },
        gear: data.getAll('gear'),
        anchor: String(data.get('anchor') || '').trim(),
        note: String(data.get('note') || '').trim()
      };
    }

    // 빈 칸은 ''로 둔다(0과 구분). 숫자가 아니거나 범위를 넘으면 범위 안으로 자른다
    function clampNum(raw, max) {
      const text = String(raw ?? '').trim();
      if (!text) return '';
      const value = Math.round(Number(text));
      return Number.isFinite(value) ? String(Math.min(max, Math.max(0, value))) : '';
    }

    function hasService(sv) {
      return !!sv && Object.entries(sv).some(([key, value]) => (key === 'skills' ? value.length : value !== ''));
    }

    // 계측값 판정 문구 — 교범 기준표의 경계값 그대로
    function memoryNote(value) {
      if (value === '') return '';
      const n = Number(value);
      return n >= 90 ? '통과' : n >= 70 ? '재검사' : '관측 자격 정지';
    }
    function countNote(sv) {
      if (sv.entries === '' || sv.returns === '') return '';
      const a = Number(sv.entries);
      const b = Number(sv.returns);
      return b > a ? 'S.I.D 분리 심사' : a > b ? '등록 보류' : '';
    }

    function serviceLines(sv) {
      if (!hasService(sv)) return [];
      const out = ['— 복무 기록 —'];
      if (sv.unit) out.push(`전 소속   : ${sv.unit}${sv.period ? ` (${sv.period})` : ''}`);
      else if (sv.period) out.push(`복무 기간 : ${sv.period}`);
      if (sv.discharge) out.push(`퇴역 사유 : ${sv.discharge}`);
      if (sv.skills.length) out.push(`자격      : ${sv.skills.join(' · ')}`);
      if (sv.memory !== '') out.push(`기억 대조 : ${sv.memory}% — ${memoryNote(sv.memory)}`);
      if (sv.entries !== '' || sv.returns !== '' || sv.sightings !== '') {
        const note = countNote(sv);
        out.push(`진입·귀환 : 진입 ${sv.entries || '—'} / 귀환 ${sv.returns || '—'} / 목격 ${sv.sightings || '—'}${note ? ` — ${note}` : ''}`);
      }
      if (sv.exposure !== '') out.push(`누적 노출 : ${sv.exposure}분${Number(sv.exposure) > 30 ? ' — 한 해 한도 30분 기준 초과 기록 있음' : ''}`);
      if (sv.physical) out.push(`체력 검정 : ${sv.physical}`);
      if (sv.laugh) out.push(`웃음 반응 : ${sv.laugh}`);
      if (sv.lost) out.push(`잃은 것   : ${sv.lost}`);
      if (sv.kept) out.push(`남은 것   : ${sv.kept}`);
      return out;
    }

    function minorCost(name) {
      const row = [...rowsOf('생활형 소능력'), ...rowsOf('현장형 보조 능력')].find(([item]) => item === name);
      return row ? row[2] : '';
    }

    function text(v) {
      const blank = '______';
      const faction = v.faction === 'none' ? '무소속·민간' : (factions()[v.faction]?.name || blank);
      const cls = v.class === 'human' ? '인간' : ((fw?.ontology || []).find((item) => item.code === v.class)?.name || blank);
      const source = (fw?.abilitySources || []).find((item) => item.name === v.source);
      const tagRow = (tagSec?.table?.rows || []).find(([name]) => name === v.tag);
      const lines = [
        `■ 현장 인원 등록 — N.H.C 현장 교범(${revision()} 개정) 기준`,
        `이름     : ${v.name || blank}`,
        `호출부호 : ${v.callsign || blank}`,
        `소속     : ${faction}`,
        `배치선   : ${v.line || blank}`,
        `분류     : ${cls}${v.class === 'WIELDER' && source ? ` / ${source.name} — 대가: ${source.cost}` : ''}`,
        `출신     : ${v.origin || blank}`,
        `능력 등급: ${v.grade || blank}`,
        `소능력   : ${v.minor ? `${v.minor} — 대가: ${minorCost(v.minor)}` : '없음'}`,
        `보조 장비: ${v.augment || '없음'}`,
        ...(FITNESS.some(([key]) => v.fitness?.[key]) ? [`평가     : ${FITNESS.map(([key, , short]) => `${short} ${v.fitness[key] || '—'}`).join(' · ')}`] : []),
        `표식     : ${tagRow ? `${tagRow[0]} — ${tagRow[1]}` : blank}`,
        `장비군   : ${v.gear.length ? v.gear.join(', ') : blank}`,
        `기준점   : ${v.anchor || blank}`
      ];
      if (v.note) lines.push(`기록     : ${v.note}`);
      lines.push(...serviceLines(v.service));
      return lines.join('\n');
    }

    /* 등록증 그림(2026-09-25 사용자 결정) — 양식 값으로 manual-card.js가 1080×1350 PNG를 그린다.
       방문자가 넣은 사진은 이 기기의 메모리에서만 쓰고 저장하지 않는다. */
    const Card = root.PCRegisterCard || null;
    let photo = null;
    const canvas = Card ? h('canvas.tc-man-card-canvas', { width: String(Card.WIDTH), height: String(Card.HEIGHT), role: 'img', 'aria-label': '등록증 미리보기' }) : null;
    const cardView = Card ? h('div.tc-man-card-view', null, canvas, h('span.tc-man-card-stamp', { 'aria-hidden': 'true', text: '등록' })) : null;
    const cardStatus = h('span.tc-man-copy-status', { role: 'status' });
    const photoInput = h('input', { type: 'file', accept: 'image/*', hidden: true, 'aria-hidden': 'true', tabindex: '-1' });
    const photoButton = h('button.tc-btn', { type: 'button', onclick: () => photoInput.click() }, '사진 넣기');
    const photoClear = h('button.tc-btn', { type: 'button', hidden: true, onclick: clearPhoto }, '사진 빼기');
    const saveButton = h('button.tc-btn.tc-btn--primary', { type: 'button', onclick: saveCard }, '등록증 저장 (PNG)');
    // 복무 기록(뒷면) — 복무 기록 칸을 하나라도 채우면 나타난다
    const serviceCanvas = Card ? h('canvas.tc-man-card-canvas', { width: String(Card.WIDTH), height: String(Card.HEIGHT), role: 'img', 'aria-label': '복무 기록 미리보기' }) : null;
    const serviceView = Card ? h('div.tc-man-card-view.tc-man-card-view--back', { hidden: true }, serviceCanvas) : null;
    const serviceButton = h('button.tc-btn', { type: 'button', hidden: true, onclick: saveService }, '복무 기록 저장 (PNG)');
    const emblemImage = Card ? Card.emblem(() => redraw()) : null;

    function cardData(v) {
      const key = v.faction;
      const lineRow = LINES.find(([line]) => line === v.line);
      const source = v.class === 'WIELDER' ? (fw?.abilitySources || []).find((item) => item.name === v.source) : null;
      const tagRow = (tagSec?.table?.rows || []).find(([name]) => name === v.tag);
      const card = {
        name: v.name,
        callsign: v.callsign,
        faction: key === 'none' ? '무소속·민간' : (factions()[key]?.name || ''),
        role: key && key !== 'none' ? (root.ProjectCurseFactionAnalysis?.factions?.[key]?.roleLabel || '') : '',
        line: lineRow ? (lineRow[1] ? `${lineRow[0]} — ${lineRow[1]}` : lineRow[0]) : '',
        cls: v.class === 'human' ? '인간' : ((fw?.ontology || []).find((item) => item.code === v.class)?.name || ''),
        source: source?.name || '',
        cost: source?.cost || '',
        tag: tagRow?.[0] || '',
        tagNote: tagRow?.[1] || '',
        origin: v.origin || '',
        grade: v.grade || '',
        fitness: FITNESS.some(([key]) => v.fitness?.[key]) ? FITNESS.map(([key, , short]) => ({ label: short, grade: v.fitness[key] || '' })) : null,
        minor: v.minor || '',
        minorCost: v.minor ? minorCost(v.minor) : '',
        augment: v.augment || '',
        unit: v.service.unit,
        service: hasService(v.service) ? {
          ...v.service,
          memoryNote: memoryNote(v.service.memory),
          countNote: countNote(v.service),
          exposureOver: v.service.exposure !== '' && Number(v.service.exposure) > 30
        } : null,
        gear: v.gear,
        anchor: v.anchor,
        note: v.note
      };
      card.regNo = Card.regNo(card);
      card.issued = Card.dtg();
      return card;
    }

    // 글자마다 다시 그리지 않도록 잠깐 모았다가 그린다(창이 가려져 있어도 도는 setTimeout)
    function redraw() {
      if (!Card || !canvas) return;
      root.clearTimeout(drawTimer);
      drawTimer = root.setTimeout(() => {
        const card = cardData(values());
        Card.draw(canvas, card, { photo, emblem: emblemImage });
        canvas.setAttribute('aria-label', `등록증 미리보기 — ${card.name || '이름 미기재'}, ${card.faction || '소속 미기재'}, ${card.regNo}`);
        const back = !!card.service;
        serviceView.hidden = !back;
        serviceButton.hidden = !back;
        if (back) {
          Card.drawService(serviceCanvas, card, { emblem: emblemImage });
          serviceCanvas.setAttribute('aria-label', `복무 기록 미리보기 — ${card.name || '이름 미기재'}, ${card.unit || '전 소속 미기재'}, ${card.regNo}`);
        }
      }, 40);
    }

    function clearPhoto() {
      photo?.close?.();
      photo = null;
      photoClear.hidden = true;
      cardStatus.textContent = '사진을 뺐습니다.';
      redraw();
      photoButton.focus({ preventScroll: true });
    }

    photoInput.addEventListener('change', () => {
      const file = photoInput.files?.[0];
      photoInput.value = '';
      if (!file) return;
      Card.loadPhoto(file).then((image) => {
        photo?.close?.();
        photo = image;
        photoClear.hidden = false;
        cardStatus.textContent = '사진을 넣었습니다. 이 기기 안에서만 쓰입니다.';
        redraw();
      }, (error) => {
        cardStatus.textContent = error?.message === 'size' ? '사진이 너무 큽니다. 20MB까지 넣을 수 있습니다.' : '그림 파일만 넣을 수 있습니다.';
        root.PCAudio?.cue('system.denied');
      });
    });

    function saveCard() {
      const card = cardData(values());
      Card.draw(canvas, card, { photo, emblem: emblemImage });
      Card.save(canvas, Card.filename(card)).then((ok) => {
        cardStatus.textContent = ok ? '저장했습니다. 카카오스토리에 그대로 올리면 됩니다.' : '저장하지 못했습니다. 그림을 길게 눌러 저장해 보십시오.';
        if (!ok) {
          root.PCAudio?.cue('system.denied');
          return;
        }
        root.PCAudio?.cue('channel.command');
        cardView.classList.remove('is-stamped');
        void cardView.offsetWidth;
        cardView.classList.add('is-stamped');
        root.clearTimeout(stampTimer);
        stampTimer = root.setTimeout(() => cardView.classList.remove('is-stamped'), 1100);
      });
    }

    function saveService() {
      const card = cardData(values());
      if (!card.service) return;
      Card.drawService(serviceCanvas, card, { emblem: emblemImage });
      Card.save(serviceCanvas, Card.serviceFilename(card)).then((ok) => {
        cardStatus.textContent = ok ? '복무 기록을 저장했습니다. 등록증과 함께 올리면 됩니다.' : '저장하지 못했습니다. 그림을 길게 눌러 저장해 보십시오.';
        root.PCAudio?.cue(ok ? 'channel.command' : 'system.denied');
      });
    }

    function update() {
      // 자격은 셋까지 — 셋을 고르면 나머지를 잠근다
      const skillBoxes = [...form.querySelectorAll('input[name="skill"]')];
      const picked = skillBoxes.filter((box) => box.checked).length;
      skillBoxes.forEach((box) => { box.disabled = !box.checked && picked >= 3; });
      const v = values();
      const sourceSelect = form.elements.source;
      sourceSelect.disabled = v.class !== 'WIELDER';
      preview.textContent = text(v);
      saveForm(v);
      redraw();
    }

    function copy() {
      const content = preview.textContent;
      const done = () => {
        copyStatus.textContent = '복사했습니다.';
        root.setTimeout(() => { copyStatus.textContent = ''; }, 2400);
      };
      if (root.navigator.clipboard?.writeText) {
        root.navigator.clipboard.writeText(content).then(done, () => fallback(content, done));
      } else {
        fallback(content, done);
      }
    }

    function fallback(content, done) {
      const area = h('textarea', { 'aria-hidden': 'true', class: 'tc-sr' });
      area.value = content;
      document.body.append(area);
      area.select();
      try {
        document.execCommand('copy');
        done();
      } catch (_error) {
        copyStatus.textContent = '복사하지 못했습니다. 양식을 직접 선택해 복사하십시오.';
      }
      area.remove();
    }

    form.addEventListener('input', update);
    form.addEventListener('change', update);
    update();
    // 글꼴이 늦게 오면 한 번 더 그린다
    Card?.fontsReady().then(redraw);

    return panel('FIELD REGISTER', '현장 인원 등록 양식', [
      h('p.tc-man-lead', { text: '현장에 들어가는 인원은 들어가기 전에 호출부호·배치선·표식을 원본 명단에 남긴다. 아래 양식은 교범의 표식과 장비군, 세계 기본 규칙의 발현 경로를 그대로 쓴다.' }),
      h('div.tc-man-register', null,
        form,
        h('div.tc-man-output', null,
          lbl('REGISTER COPY / 글 양식'),
          preview,
          h('div.tc-btnrow', null, copyButton, copyStatus)
        )
      ),
      Card ? h('div.tc-man-card', null,
        cardView,
        h('div.tc-man-card-side', null,
          lbl('REGISTER CARD / 등록증 그림'),
          h('p', { text: '양식을 채우면 등록증 그림이 바로 바뀝니다. 사진을 넣으면 왼쪽 칸에 들어갑니다. 저장한 그림(PNG, 1080×1350)을 카카오스토리에 올리면 됩니다.' }),
          h('p.tc-man-card-note', { text: '사진은 이 기기 안에서만 쓰이고 어디로도 보내지 않습니다. 화면을 새로 고치면 사라집니다. 등록증은 교류용이며 공식 기록이 아닙니다.' }),
          h('div.tc-btnrow', null, saveButton, photoButton, photoClear, serviceButton),
          cardStatus,
          photoInput
        ),
        serviceView
      ) : null
    ], { bracket: true, slug: 'register' });
  }

  function mount(el) {
    const doc = manual();
    if (!doc) {
      el.append(PC.screenHead('field-manual'), PC.missing('MANUAL NOT FOUND', MANUAL_ID, '현장 교범 원문이 이 단말에 없습니다.'));
      return;
    }
    notice = h('div.tc-man-notice');
    el.append(
      PC.screenHead('field-manual', {
        title: '현장 지침',
        // 채널 이름은 2026-09-25에 '현장 지침'으로 바꿨다. 원문 문서 이름(N.H.C 교전 교범)은 고유명사라 그대로 둔다
        desc: `N.H.C 교전 교범(${revision()} 개정)을 옮긴 현장 기준. ${doc.summary}`,
        meta: [['ISSUER', 'N.H.C HQ'], ['REVISION', revision()], ['FIRST ED.', '1989.12.19']]
      }),
      notice,
      doctrine(),
      ...tabs({
        roe: [
          h('div.tc-man-pair', null, breakPanel(), engagementPanel()),
          possessionPanel(),
          risenPanel(),
          bloodPanel(),
          perceptPanel(),
          tagPanel()
        ],
        field: [
          entryPanels(),
          teamPanel(),
          h('div.tc-man-pair', null,
            rulePanel('역류 경보와 대피', 'BACKFLOW SIREN', 'backflow', 'SHELTER DOOR', '대피소 문', PC.signalMark?.('sig-3')),
            rulePanel('청소조 노출 한도', 'CLEANUP CREW', 'cleanup', 'SENTENCE CREDIT', '감경 계산')
          ),
          linesPanel(),
          checkpointPanel(),
          drillPanel()
        ],
        gear: [
          tablePanel('능력 등급과 등록', 'ABILITY GRADE', 'ability-grade'),
          tablePanel('현장 적합성 평가', 'FIELD FITNESS', 'fitness'),
          h('div.tc-man-pair', null,
            tablePanel('복무 기록과 계측값', 'SERVICE RECORD', 'service'),
            tablePanel('현장 자격과 특기', 'QUALIFICATIONS', 'skills')
          ),
          h('div.tc-man-pair', null,
            tablePanel('생활형 소능력', 'MINOR ABILITIES / L1', 'minor-abilities'),
            tablePanel('현장형 보조 능력', 'FIELD ABILITIES / L2', 'field-abilities')
          ),
          tablePanel('대가 관리 일지와 억제제', 'COST LOG', 'cost-log'),
          wielderPanel(),
          loadoutPanel(),
          h('div.tc-man-pair', null,
            tablePanel('현장 전자장비', 'FIELD ELECTRONICS', 'field-electronics'),
            tablePanel('인체 보조 장비', 'BODY AUGMENTS', 'body-augments')
          ),
          h('div.tc-man-pair', null,
            tablePanel('암시장 교란 장비', 'BLACK MARKET', 'black-market'),
            tablePanel('신형 반-리버스 장비', 'ANTI-REVERSE', 'anti-reverse')
          )
        ],
        register: [registerPanel()]
      })
    );
  }

  // #field-manual/register — 등록 양식·등록증으로 바로 간다(상황판·검색의 '자캐 등록증 만들기'). 없는 항목은 없다고 표시한다.
  function show(parts, app) {
    app.setTitle('현장 지침');
    root.clearTimeout(focusTimer);
    notice?.replaceChildren();
    const part = parts?.[0];
    if (!part) return;
    if (part !== 'register' && !TABS[part]) {
      notice?.append(PC.missing('SECTION NOT FOUND', `field-manual/${part}`, '현장 지침에 이 항목이 없습니다.'));
      return;
    }
    setTab(part);
    if (part !== 'register') return;
    root.document.getElementById('tc-man-register')?.closest('details')?.setAttribute('open', '');
    // 셸이 화면을 맨 위로 올리고 제목에 포커스를 둔 다음에 옮긴다
    focusTimer = root.setTimeout(() => {
      const heading = root.document.getElementById('tc-man-register');
      if (!heading) return;
      heading.closest('details')?.scrollIntoView({ block: 'start', behavior: PC.fx() === 'reduced' ? 'auto' : 'smooth' });
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }, 60);
  }

  function hide() {
    [drawTimer, stampTimer, focusTimer].forEach((timer) => root.clearTimeout(timer));
  }

  PC.screen({ id: 'field-manual', mount, show, hide });
})(window);
