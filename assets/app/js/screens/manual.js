// Project Curse 6 — 교전 교범 화면 (담당: Claude)
// 새 설정을 쓰지 않는다. N.H.C 현장 교범(archive-document-data.js의 NHC_Manual_891219)과
// 세계 기본 규칙(world-history-data.js의 worldFramework)을 투입 전 참조판으로 다시 배치한다.
// 문장은 데이터에서 절 제목으로 찾아 읽는다. 제목이 바뀌어 찾지 못하면 없다고 표시한다.
(function (root) {
  'use strict';

  const PC = root.PCApp;
  const { h } = PC;

  const MANUAL_ID = 'NHC_Manual_891219';
  const STORAGE_KEY = 'pc6_field_register_v1';
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

  function panel(code, title, body, options = {}) {
    const id = `tc-man-${options.slug || code.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return h('section', { class: `tc-panel tc-man-panel${options.bracket ? ` tc-bracket${options.bracket === true ? '' : ` tc-bracket--${options.bracket}`}` : ''}${options.cls ? ` ${options.cls}` : ''}`, 'aria-labelledby': id },
      h('header.tc-panel-head', null,
        h('div', null, h('span.tc-label', { text: code }), h('h2', { id, text: title })),
        options.aside || null
      ),
      h('div.tc-panel-body', null, body)
    );
  }

  /* ---------- 교범 첫머리 ---------- */
  function doctrine() {
    const doc = manual();
    const scope = section('적용 범위와 지휘 관계');
    return h('section.tc-man-doctrine', { 'aria-label': '교범 첫 원칙' },
      h('blockquote', null, h('p', { text: scope?.quote || '' })),
      h('div.tc-man-doctrine-meta', null,
        h('span.tc-label', { text: doc?.code || MANUAL_ID }),
        h('span', { text: `${doc?.owner || ''} · ${doc?.classification || ''}` }),
        h('span', { text: '이 단말에 등록된 마지막 개정은 2005.01.21 현장 개정본이다.' }),
        h('a.tc-btn', { href: PC.href('archive-entry', MANUAL_ID) }, '교범 원문 열람', h('i', { 'aria-hidden': 'true', text: '›' }))
      )
    );
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
      sec.warning ? h('div.tc-note.tc-note--caution', null, h('b', { text: 'COMMANDER NOTE' }), h('p', { text: sec.warning })) : null
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
      sec.warning ? h('div.tc-note.tc-note--danger', null, h('b', { text: 'MISSION FAILURE' }), h('p', { text: sec.warning })) : null
    ], { slug: 'roe' });
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
      sec.warning ? h('div.tc-note.tc-note--evidence', null, h('b', { text: 'TAG RULE' }), h('p', { text: sec.warning })) : null
    ], { bracket: true, slug: 'tags' });
  }

  /* ---------- 진입 ---------- */
  function entryPanels() {
    const prep = section('진입 전 준비');
    const move = section('진입과 이동');
    return h('div.tc-man-pair', null,
      prep ? panel('PRE-ENTRY CHECK', '진입 전 준비', [
        list(prep.items, 'tc-man-list tc-man-list--check'),
        prep.warning ? h('div.tc-note.tc-note--caution', null, h('b', { text: 'NO ENTRY' }), h('p', { text: prep.warning })) : null
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
      h('ul.tc-man-loadout', null, (sec.groups || []).map((group) => h('li', { class: group.title === '현장 제압 장비군' ? 'is-kinetic' : null },
        h('header', null,
          h('b', { text: group.title }),
          functions.get(group.title) ? h('span', { text: functions.get(group.title) }) : null
        ),
        h('ul', null, group.items.map((item) => {
          const [name, ...rest] = item.split(' — ');
          return h('li', null, h('b.tc-man-item-name', { text: name }), rest.length ? h('span', { text: rest.join(' — ') }) : null);
        }))
      ))),
      sec.warning ? h('div.tc-note.tc-note--caution', null, h('b', { text: 'ROUND DISCIPLINE' }), h('p', { text: sec.warning })) : null
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
              sec.warning ? h('div.tc-note.tc-note--caution', null, h('b', { text: 'NOTE' }), h('p', { text: sec.warning })) : null
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
    const gearGroups = (gear?.groups || []).map((group) => group.title);

    const form = h('form.tc-man-form', { onsubmit: (event) => event.preventDefault() },
      field('호출부호', h('input', { name: 'callsign', type: 'text', maxlength: '24', autocomplete: 'off', value: saved.callsign || '' })),
      field('소속', select('faction', factionOptions, saved.faction || '')),
      field('배치선', select('line', [['', '선택'], ...LINES.map(([line, unit]) => [line, unit ? `${line} — ${unit}` : line])], saved.line || '')),
      field('분류', select('class', classOptions, saved.class || ''), '괴이는 등록 대상이 아니다.'),
      field('발현 경로', select('source', sourceOptions, saved.source || ''), '능력자만 적는다. 대가는 교범 기준으로 자동 기입된다.'),
      field('표식', select('tag', tagOptions, saved.tag || '')),
      h('fieldset.tc-man-field.tc-man-gear', null,
        h('legend', { text: '장비군' }),
        gearGroups.map((title) => h('label', null,
          h('input', { type: 'checkbox', name: 'gear', value: title, checked: (saved.gear || []).includes(title) ? true : null }),
          h('span', { text: title })
        ))
      ),
      field('마지막 정상 기준점', h('input', { name: 'anchor', type: 'text', maxlength: '40', autocomplete: 'off', value: saved.anchor || '' }), '교범: 마지막으로 정상 확인된 기준점을 표시한다.')
    );

    const preview = h('pre.tc-man-preview', { 'aria-live': 'polite' });
    const copyStatus = h('span.tc-man-copy-status', { role: 'status' });
    const copyButton = h('button.tc-btn.tc-btn--primary', { type: 'button', onclick: copy }, '양식 복사');

    function values() {
      const data = new FormData(form);
      return {
        callsign: String(data.get('callsign') || '').trim(),
        faction: data.get('faction') || '',
        line: data.get('line') || '',
        class: data.get('class') || '',
        source: data.get('source') || '',
        tag: data.get('tag') || '',
        gear: data.getAll('gear'),
        anchor: String(data.get('anchor') || '').trim()
      };
    }

    function text(v) {
      const blank = '______';
      const faction = v.faction === 'none' ? '무소속·민간' : (factions()[v.faction]?.name || blank);
      const cls = v.class === 'human' ? '인간' : ((fw?.ontology || []).find((item) => item.code === v.class)?.name || blank);
      const source = (fw?.abilitySources || []).find((item) => item.name === v.source);
      const tagRow = (tagSec?.table?.rows || []).find(([name]) => name === v.tag);
      const lines = [
        '■ 현장 인원 등록 — N.H.C 현장 교범(2005.01.21 현장 개정) 기준',
        `호출부호 : ${v.callsign || blank}`,
        `소속     : ${faction}`,
        `배치선   : ${v.line || blank}`,
        `분류     : ${cls}${v.class === 'WIELDER' && source ? ` / ${source.name} — 대가: ${source.cost}` : ''}`,
        `표식     : ${tagRow ? `${tagRow[0]} — ${tagRow[1]}` : blank}`,
        `장비군   : ${v.gear.length ? v.gear.join(', ') : blank}`,
        `기준점   : ${v.anchor || blank}`
      ];
      return lines.join('\n');
    }

    function update() {
      const v = values();
      const sourceSelect = form.elements.source;
      sourceSelect.disabled = v.class !== 'WIELDER';
      preview.textContent = text(v);
      saveForm(v);
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

    return panel('FIELD REGISTER', '현장 인원 등록 양식', [
      h('p.tc-man-lead', { text: '투입 인원은 진입 전에 호출부호·배치선·표식을 원본 명단에 남긴다. 아래 양식은 교범의 표식과 장비군, 세계 기본 규칙의 발현 경로를 그대로 쓴다.' }),
      h('div.tc-man-register', null,
        form,
        h('div.tc-man-output', null,
          h('span.tc-label', { text: 'REGISTER COPY' }),
          preview,
          h('div.tc-btnrow', null, copyButton, copyStatus)
        )
      )
    ], { bracket: true, slug: 'register' });
  }

  function mount(el) {
    const doc = manual();
    if (!doc) {
      el.append(PC.screenHead('field-manual'), PC.missing('MANUAL NOT FOUND', MANUAL_ID, '현장 교범 원문이 이 단말에 없습니다.'));
      return;
    }
    el.append(
      PC.screenHead('field-manual', {
        title: '교전 교범',
        desc: doc.summary,
        meta: [['ISSUER', 'N.H.C HQ'], ['REVISION', '2005.01.21'], ['FIRST ED.', '1989.12.19']]
      }),
      doctrine(),
      h('div.tc-man-pair', null, breakPanel(), engagementPanel()),
      tagPanel(),
      entryPanels(),
      loadoutPanel(),
      wielderPanel(),
      linesPanel(),
      registerPanel()
    );
  }

  function show(_parts, app) {
    app.setTitle('교전 교범');
  }

  PC.screen({ id: 'field-manual', mount, show });
})(window);
