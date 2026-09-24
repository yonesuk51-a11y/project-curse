// Project Curse 6 — 보기 설정. <head>에서 먼저 불러 첫 화면이 그려지기 전에 html 속성을 정한다.
// 효과(auto·full·reduced) → html[data-fx="full|reduced"]. auto는 시스템의 '움직임 줄이기'를 따른다.
// 보기(brief·full) → html[data-density]. 간략 보기에서는 .tc-full-only 요소가 숨는다(components.css).
// 2026-09-25 사용자 결정: 움직임 줄이기 환경에서도 연출을 지우지 않고 움직임만 멈춘다. 사용자가 '효과: 전체'를 고르면 시스템 설정과 관계없이 움직인다.
(function (root) {
  'use strict';

  const doc = root.document;
  const html = doc.documentElement;
  const KEYS = { fx: 'pc6_fx_v1', density: 'pc6_density_v1' };
  const DEFAULTS = { fx: 'auto', density: 'brief' };
  const ALLOWED = { fx: ['auto', 'full', 'reduced'], density: ['brief', 'full'] };
  const media = root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function read(name) {
    try {
      const value = root.localStorage.getItem(KEYS[name]);
      return ALLOWED[name].includes(value) ? value : DEFAULTS[name];
    } catch (_error) {
      return DEFAULTS[name];
    }
  }

  const state = { fx: read('fx'), density: read('density') };
  const systemReduced = () => !!(media && media.matches);
  const fx = () => (state.fx === 'auto' ? (systemReduced() ? 'reduced' : 'full') : state.fx);

  // 속성을 맞추고, 효과 모드가 바뀌었으면 true
  function apply() {
    const mode = fx();
    const changed = html.dataset.fx !== mode;
    html.dataset.fx = mode;
    html.dataset.density = state.density;
    return changed;
  }

  function emit(name, fxChanged) {
    doc.dispatchEvent(new CustomEvent('pc:prefs', { detail: { name, fx: fx(), density: state.density, setting: { ...state } } }));
    if (fxChanged) doc.dispatchEvent(new CustomEvent('pc:fx', { detail: { mode: fx() } }));
  }

  function set(name, value) {
    if (!ALLOWED[name] || !ALLOWED[name].includes(value)) return;
    state[name] = value;
    try {
      root.localStorage.setItem(KEYS[name], value);
    } catch (_error) { /* 저장하지 못해도 이번 방문에서는 따른다 */ }
    emit(name, apply());
  }

  if (media) {
    const onSystem = () => emit('system', apply());
    if (media.addEventListener) media.addEventListener('change', onSystem);
    else if (media.addListener) media.addListener(onSystem);
  }

  apply();
  // 기동 연출(pc-fx.js)이 뜨기 전에 본문이 먼저 보이지 않게 한다. ?boot=skip이면 바로 보인다(base.css에 4초 안전장치)
  try {
    if (new URLSearchParams(root.location.search).get('boot') !== 'skip') html.classList.add('tc-boot-pending');
  } catch (_error) { /* 주소를 읽지 못하면 숨기지 않는다 */ }
  root.PCPrefs = Object.freeze({
    get: (name) => state[name],
    set,
    fx,
    density: () => state.density,
    systemReduced
  });
})(window);
