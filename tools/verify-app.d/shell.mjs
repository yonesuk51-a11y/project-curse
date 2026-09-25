// 셸 추가 검사 — 통합 검색(pc-search.js)과 열람자 호출부호(pc-prefs.js·pc-fx.js·pc-settings.js·screenHead). 2026-09-25 사용자 결정. (담당: Claude)
// 실제 셸 파일을 격리 실행해 목록·찾기·저장 규칙을 확인한다. 브라우저 표시·키보드 확인은 AGENTS.md 4절의 브라우저 확인이 맡는다.
import vm from 'node:vm';
import assert from 'node:assert/strict';

export default function ({ add, read, context, app, historyIds, archiveIds, opIds }) {
  const check = (name, run) => {
    try {
      run();
      add(name, true);
    } catch (error) {
      add(name, false, error.message);
    }
  };

  const searchSource = read('assets/app/js/pc-search.js');

  check('search-wired-into-shell', () => {
    assert.ok(app.includes('data-tc-search=""'), '상단 바에 검색 단추가 있어야 한다');
    const core = app.indexOf('assets/app/js/pc-core.js');
    const search = app.indexOf('assets/app/js/pc-search.js');
    assert.ok(core > -1 && search > core, 'pc-search.js는 pc-core.js 뒤에 불러야 한다');
    assert.ok(!/innerHTML/.test(searchSource), 'DOM은 PCApp.h로만 만든다');
    assert.ok(searchSource.includes("'aria-modal': 'true'"), '검색 창은 모달 대화상자로 알린다');
    assert.ok(searchSource.includes("event.key === '/'") && /toLowerCase\(\) === 'k'/.test(searchSource), "'/'와 Ctrl(⌘)+K로 연다");
    assert.ok(searchSource.includes("addEventListener('pc:route'"), '화면이 바뀌면 창을 닫는다');
  });

  // 데이터가 올라온 단말과 같은 조건에서 목록을 만들고 찾는다
  const sandbox = { ...context, console, URLSearchParams };
  sandbox.window = sandbox;
  sandbox.document = { addEventListener() {}, querySelector: () => null, querySelectorAll: () => [], body: { append() {} } };
  sandbox.PCApp = { h: () => ({}), href: (...parts) => `#${parts.join('/')}` };
  vm.createContext(sandbox);
  let S = null;
  try {
    vm.runInContext(searchSource, sandbox, { filename: 'pc-search.js' });
    S = sandbox.PCSearch;
  } catch (error) {
    add('search-module-loads', false, error.message);
  }
  if (!S) return;

  const items = S.build();
  const kinds = items.reduce((acc, item) => ({ ...acc, [item.kind]: (acc[item.kind] || 0) + 1 }), {});
  check('search-index-covers-every-record', () => {
    const people = Object.keys(context.ProjectCursePersonnel?.byId || {});
    assert.equal(kinds.personnel, people.length, `인물 ${kinds.personnel}/${people.length}`);
    assert.equal(kinds.history, historyIds.size, `세계 기록 ${kinds.history}/${historyIds.size}`);
    assert.equal(kinds.faction, Object.keys(context.ProjectCurseFactionAnalysis?.factions || {}).length, '세력');
    assert.equal(kinds.archive, (context.ProjectCurseArchive?.publicRecords || []).length, '기록보관소');
    assert.ok(kinds.map >= opIds.size + (context.ProjectCurseMapRoom?.drilldowns || []).length, '작전 지도');
    assert.ok(kinds.guide >= 3, '안내');
    // 목록의 주소는 실제 기록으로 이어져야 한다(없는 기록으로 보내지 않는다)
    const broken = items.filter((item) => {
      const [route, a, b] = item.parts;
      if (route === 'personnel') return !people.includes(a);
      if (route === 'history') return !historyIds.has(a);
      if (route === 'archive-entry') return !archiveIds.has(a);
      if (route === 'map-room' && a === 'op') return !opIds.has(b);
      return false;
    }).map((item) => item.path);
    assert.equal(broken.length, 0, broken.join(' | '));
  });

  check('search-finds-names-aliases-initials', () => {
    const first = (text) => S.query(items, text)[0]?.path;
    const paths = (text) => S.query(items, text).map((item) => item.path);
    assert.equal(first('콘라트 발렌'), 'personnel/alma-koenig', '표시 이름');
    assert.ok(paths('알마 코니그').includes('personnel/alma-koenig'), '옛 명부명(별칭)');
    assert.equal(first('nhc'), 'faction-info/nhc', '점을 무시한 약어');
    assert.equal(first('현장 전투군'), 'faction-info/nhc', '한글 역할');
    assert.equal(first('ㅅㅋㅁ'), 'personnel/sakuma-yuta', '초성');
    assert.ok(paths('삼야').includes('history/2042-10-31-three-night-silence'), '세계 기록');
    assert.equal(first('등록증'), 'field-manual/register', '안내');
    assert.equal(S.query(items, 'zzzz').length, 0, '없는 말은 비어 있어야 한다');
    assert.equal(S.query(items, '   ').length, 0, '빈 검색어');
  });

  // 열람자 호출부호 — 저장 규칙은 pc-prefs.js를 그대로 실행해 확인한다
  check('operator-callsign-clean-and-stored', () => {
    const store = new Map();
    const events = [];
    const p = {
      console, URLSearchParams,
      localStorage: { getItem: (key) => store.get(key) ?? null, setItem: (key, value) => store.set(key, String(value)), removeItem: (key) => store.delete(key) },
      matchMedia: () => ({ matches: false, addEventListener() {} }),
      location: { search: '?boot=skip' },
      CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } }
    };
    p.window = p;
    p.document = { documentElement: { dataset: {}, classList: { add() {}, remove() {} } }, dispatchEvent: (event) => events.push(event) };
    vm.createContext(p);
    vm.runInContext(read('assets/app/js/pc-prefs.js'), p);
    const prefs = p.PCPrefs;
    assert.equal(prefs.operator(), '', '처음에는 익명');
    assert.equal(prefs.setOperator('  렌 < 03 >\n '), '렌 03', '꺾쇠·제어 문자를 빼고 공백을 줄인다');
    assert.equal(store.get('pc6_operator_v1'), '렌 03', '이 기기에 저장한다');
    assert.ok(events.some((event) => event.type === 'pc:prefs' && event.detail?.name === 'operator'), '바뀌면 알린다');
    assert.equal(Array.from(prefs.setOperator('가'.repeat(40))).length, prefs.operatorMax, '길이 제한');
    assert.equal(prefs.setOperator(''), '', '비우면 익명');
    assert.equal(store.has('pc6_operator_v1'), false, '비우면 저장값도 지운다');
  });

  check('operator-callsign-shown-in-boot-head-settings', () => {
    const fx = read('assets/app/js/pc-fx.js');
    const core = read('assets/app/js/pc-core.js');
    const settings = read('assets/app/js/pc-settings.js');
    const gate = context.ProjectCurseTerminalFx?.boot?.gate?.operator;
    assert.ok(gate?.label && gate?.hint, '접속 화면 칸의 문구는 데이터에 있다');
    assert.ok(fx.includes('setOperator?.(opInput.value)') && fx.includes('event.isComposing'), '접속할 때 저장하고, 한글 입력 중 Enter는 무시한다');
    assert.ok(fx.includes("event.target.closest('button, .tc-boot-operator')"), '칸을 눌러도 접속하지 않는다');
    assert.ok(core.includes("'data-tc-operator': true") && core.includes("event.detail?.name !== 'operator'"), '화면 머리에 보이고 바꾸면 따라 바뀐다');
    assert.ok(settings.includes('tc-set-operator') && settings.includes('prefs.setOperator('), '설정 창에서 바꾼다');
  });
}
