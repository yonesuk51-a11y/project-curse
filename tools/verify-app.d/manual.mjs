// 현장 지침 추가 검사 — 등록증 그림(manual-card.js)과 등록 양식 바로 가기(#field-manual/register). 2026-09-25 사용자 결정. (담당: Claude)
// 그리기는 브라우저에서 확인한다. 여기서는 기기 밖으로 보내는 요청이 없는지, 번호·시각·파일 이름 규칙과 연결을 본다.
import vm from 'node:vm';
import assert from 'node:assert/strict';

export default function ({ add, read, context, app }) {
  const check = (name, run) => {
    try {
      run();
      add(name, true);
    } catch (error) {
      add(name, false, error.message);
    }
  };
  const card = read('assets/app/js/screens/manual-card.js');
  const manual = read('assets/app/js/screens/manual.js');

  check('register-card-loaded-before-manual', () => {
    const cardAt = app.indexOf('assets/app/js/screens/manual-card.js');
    const manualAt = app.indexOf('assets/app/js/screens/manual.js');
    assert.ok(cardAt > -1 && manualAt > cardAt, 'manual-card.js를 manual.js 앞에서 부른다');
  });

  check('register-card-stays-on-device', () => {
    // 방문자 사진은 기기 밖으로 나가지 않는다 — 네트워크로 보내는 API를 쓰지 않는다
    const network = /\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|navigator\.share/;
    assert.ok(!network.test(card), 'manual-card.js');
    assert.ok(!network.test(manual), 'manual.js');
    assert.ok(!/innerHTML/.test(card) && !/innerHTML/.test(manual), 'innerHTML 금지');
    assert.ok(manual.includes("accept: 'image/*'"), '그림 파일만 받는다');
    assert.ok(card.includes('공식 기록이 아닙니다') && manual.includes('공식 기록이 아닙니다'), '교류용이라는 줄');
  });

  check('register-card-number-time-filename', () => {
    const c = { console, Math, Date, Array, String, Object, Promise };
    c.window = c;
    c.document = { createElement: () => ({}), body: { append() {} } };
    vm.createContext(c);
    vm.runInContext(card, c);
    const R = c.PCRegisterCard;
    assert.equal(R.WIDTH, 1080);
    assert.equal(R.HEIGHT, 1350);
    const a = R.regNo({ name: '한서윤', callsign: '까마귀 2', faction: 'N.H.C' });
    assert.match(a, /^PC03-[0-9A-Z]{6}$/);
    assert.equal(R.regNo({ name: '한서윤', callsign: '까마귀 2', faction: 'N.H.C' }), a, '같은 값이면 같은 번호');
    assert.notEqual(R.regNo({ name: '한서윤', callsign: '까마귀 3', faction: 'N.H.C' }), a, '값이 다르면 다른 번호');
    assert.equal(R.dtg(new Date(Date.UTC(2026, 8, 25, 1, 56))), '250156ZSEP42', '단말 시각은 2042년');
    assert.equal(R.filename({ name: 'a/b:c <d>' }), 'project-curse-등록증-abc-d.png', '파일 이름에 못 쓰는 글자를 뺀다');
    assert.equal(R.filename({}), 'project-curse-등록증-무명.png');
  });

  check('register-shortcut-and-missing-section', () => {
    assert.ok(manual.includes("part !== 'register'") && manual.includes("'SECTION NOT FOUND'"), '없는 항목은 없다고 표시한다');
    assert.ok(manual.includes('PC.screen({ id: \'field-manual\', mount, show, hide })'), '떠날 때 타이머를 정리한다');
    assert.ok(read('assets/app/js/screens/home.js').includes("PC.href('field-manual', 'register')"), '상황판 바로 가기');
    const form = context.ProjectCurseCommunityGuide?.guide?.sections?.find?.((section) => section.id === 'form');
    assert.equal(form?.link?.route?.join('/'), 'field-manual/register', '자캐 설정 안내의 등록 양식 연결');
  });

  // 복무 기록(2026-11-21 사용자 결정) — 전 소속은 안내 데이터, 계측값·자격은 교범 절에서 읽는다. 실제 부대는 전 소속으로만.
  check('register-service-record', () => {
    const guide = context.ProjectCurseCommunityGuide?.guide?.sections || [];
    const service = guide.find((section) => section.id === 'service');
    assert.equal(service?.groups?.length, 4, '전 소속 묶음 넷');
    const units = service.groups.flatMap((group) => group.items.map(([name]) => name));
    assert.equal(new Set(units).size, units.length, '전 소속 이름이 겹치지 않는다');
    assert.ok(!units.some((name) => /바그너|Wagner|스페츠나즈|Spetsnaz|IDF|이스라엘|러시아|우크라이나/.test(name)), '진행 중인 전쟁 부대·실제 PMC 없음');
    assert.ok(service.paragraphs.some((text) => text.includes('전 소속으로만')), '실명 부대 사용 규칙');
    const doc = context.ProjectCurseArchiveDocuments?.documents?.NHC_Manual_891219;
    const sec = doc?.sections?.find((item) => item.title === '복무 기록과 계측값');
    const skills = doc?.sections?.find((item) => item.title === '현장 자격과 특기');
    assert.equal(sec?.table?.rows?.length, 5, '계측값 다섯');
    assert.ok(sec.discharge?.length && sec.physical?.length === 3 && sec.laugh?.length, '고르는 칸 값');
    assert.equal(skills?.table?.rows?.length, 14, '자격 열넷');
    assert.ok(manual.includes("item.id === 'service'") && manual.includes("section('복무 기록과 계측값')") && manual.includes("rowsOf('현장 자격과 특기')"), '양식이 데이터에서 읽는다');
    assert.ok(manual.includes('picked >= 3') && manual.includes('.slice(0, 3)'), '자격은 셋까지');
    assert.ok(/n >= 90 \? '통과' : n >= 70 \? '재검사'/.test(manual), '일치율 경계값이 교범과 같다');
    assert.ok(card.includes('function drawService') && card.includes('[0.7, 0.9]') && card.includes('serviceFilename'), '복무 기록 그림');
  });
}
