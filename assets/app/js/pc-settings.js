// Project Curse 6 — 상단 바의 보기·링크·설정 단추와 설정 창. 2026-09-25 사용자 결정.
// 설정: 열람자 호출부호, 소리(켜짐·꺼짐), 효과(자동·전체·줄임), 보기(간략·전체), 지금 화면 링크 복사. 모두 이 브라우저에만 저장한다.
// '효과: 자동'은 기기의 움직임 줄이기 설정을 따른다. '전체'를 고르면 그 설정이 켜진 기기에서도 연출이 움직인다.
(function (root) {
  'use strict';

  const doc = root.document;
  const PC = root.PCApp;
  const h = PC.h;
  const prefs = root.PCPrefs;
  let panel = null;
  let opener = null;

  const FX = [['auto', '자동'], ['full', '전체'], ['reduced', '줄임']];
  const DENSITY = [['brief', '간략'], ['full', '전체']];
  const SOUND = [['on', '켜짐'], ['off', '꺼짐']];

  function seg(label, name, options, current, onPick) {
    return h('div.tc-set-row', null,
      h('p.tc-set-label', { id: `tc-set-${name}`, text: label }),
      h('div.tc-seg', { role: 'group', 'aria-labelledby': `tc-set-${name}`, 'data-tc-set': name },
        options.map(([value, text]) => h('button', {
          type: 'button',
          'data-value': value,
          'aria-pressed': String(value === current),
          'data-tc-cue': 'menu.select',
          text,
          onclick: () => onPick(value)
        }))
      )
    );
  }

  function note() {
    return prefs.systemReduced()
      ? '이 기기는 움직임 줄이기가 켜져 있습니다. 자동이면 연출을 멈춘 화면으로 보여 주고, 전체를 고르면 모두 움직입니다.'
      : '자동은 기기 설정을 따릅니다.';
  }

  // 열람자 호출부호 — 기동 화면의 칸과 같은 값(PCPrefs.operator). 비워서 저장하면 익명으로 돌아간다
  function operatorRow() {
    const input = h('input#tc-set-operator', {
      type: 'text', maxlength: String(prefs.operatorMax || 24), autocomplete: 'off', spellcheck: 'false',
      placeholder: '비워 두면 익명 열람', value: prefs.operator?.() || null
    });
    const save = (event) => {
      event.preventDefault();
      const name = prefs.setOperator(input.value);
      input.value = name;
      PC.toast(name ? `열람자를 등록했습니다: ${name}` : '열람자를 지웠습니다. 익명으로 엽니다.');
      root.PCAudio?.cue('menu.select');
    };
    return h('div.tc-set-row', null,
      h('label.tc-set-label', { for: 'tc-set-operator', text: '열람자' }),
      h('form.tc-set-operator', { onsubmit: save }, input, h('button.tc-btn', { type: 'submit', text: '저장' })),
      h('p.tc-set-note', { text: '자캐 이름이나 호출부호. 기동 화면과 화면 머리에 표시됩니다.' })
    );
  }

  function build() {
    const soundNow = root.PCAudio?.isOn?.() ? 'on' : 'off';
    return h('div.tc-settings', { id: 'tc-settings', role: 'dialog', 'aria-label': '표시 설정' },
      h('p.tc-settings-head', null, h('b', { text: '표시 설정' }), h('span', { text: '이 브라우저에만 저장됩니다.' })),
      operatorRow(),
      seg('소리', 'sound', SOUND, soundNow, (value) => root.PCAudio?.set?.(value === 'on')),
      seg('효과', 'fx', FX, prefs.get('fx'), (value) => prefs.set('fx', value)),
      h('p.tc-set-note', { 'data-tc-set-note': true, text: note() }),
      seg('보기', 'density', DENSITY, prefs.get('density'), (value) => prefs.set('density', value)),
      h('p.tc-set-note', { text: '간략 보기는 영문 코드와 부가 수치를 숨깁니다. 이름·날짜·판정·본문은 그대로입니다.' }),
      h('div.tc-set-row', null,
        h('p.tc-set-label', { text: '링크' }),
        h('button.tc-btn', { type: 'button', text: '지금 화면 링크 복사', onclick: () => PC.copyLink() })
      )
    );
  }

  function sync() {
    const values = { sound: root.PCAudio?.isOn?.() ? 'on' : 'off', fx: prefs.get('fx'), density: prefs.get('density') };
    doc.querySelectorAll('[data-tc-set]').forEach((group) => {
      group.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.value === values[group.dataset.tcSet])));
    });
    const noteEl = doc.querySelector('[data-tc-set-note]');
    if (noteEl) noteEl.textContent = note();
    doc.querySelectorAll('[data-tc-density-toggle]').forEach((button) => {
      button.setAttribute('aria-pressed', String(values.density === 'full'));
      const state = button.querySelector('b');
      if (state) state.textContent = values.density === 'full' ? '전체' : '간략';
    });
    doc.querySelectorAll('[data-tc-settings]').forEach((button) => button.setAttribute('aria-expanded', String(!!panel)));
  }

  function close(restoreFocus = true) {
    if (!panel) return;
    panel.remove();
    panel = null;
    doc.removeEventListener('pointerdown', onOutside, true);
    doc.removeEventListener('keydown', onKey, true);
    root.PCAudio?.cue('menu.close');
    sync();
    if (restoreFocus && opener?.isConnected) opener.focus({ preventScroll: true });
  }

  function onOutside(event) {
    if (!panel) return;
    if (panel.contains(event.target) || event.target.closest('[data-tc-settings]')) return;
    close(false);
  }
  function onKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  }

  function open(button) {
    if (panel) {
      close();
      return;
    }
    opener = button;
    panel = build();
    doc.body.append(panel);
    doc.addEventListener('pointerdown', onOutside, true);
    doc.addEventListener('keydown', onKey, true);
    root.PCAudio?.cue('menu.open');
    sync();
    // 휴대폰 자판이 뜨지 않게 글자 칸이 아닌 첫 선택 단추에 포커스를 둔다
    panel.querySelector('.tc-seg button')?.focus({ preventScroll: true });
  }

  doc.addEventListener('click', (event) => {
    const settings = event.target.closest('[data-tc-settings]');
    if (settings) {
      open(settings);
      return;
    }
    if (event.target.closest('[data-tc-density-toggle]')) {
      prefs.set('density', prefs.get('density') === 'full' ? 'brief' : 'full');
      root.PCAudio?.cue('menu.select');
      return;
    }
    if (event.target.closest('[data-tc-copy]')) PC.copyLink();
  });

  doc.addEventListener('pc:prefs', sync);
  doc.addEventListener('pc:audio', sync);
  doc.addEventListener('pc:route', () => close(false));
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', sync, { once: true });
  else sync();
})(window);
