#!/usr/bin/env node
// Project Curse — 문장 흐름 개정 대조 검사.
// 사용: node tools/check-prose.mjs <기준 커밋> <데이터 파일...>
// 기준 커밋의 데이터와 작업 폴더의 데이터를 각각 불러와, 바뀐 문자열마다 아래를 원문과 대조한다.
//   실패(FAIL): 숫자·영문 약어·괄호 인용·판정 표현·고유명사가 빠졌거나, 손대지 않는 글(증언·현장 기입·교단 상충 기록)이 바뀌었거나, 구조가 달라졌다.
//   확인(WARN): 부정 표현 수가 줄었거나 길이가 크게 달라졌다. 사람이 읽고 판단한다.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const [base, ...targets] = process.argv.slice(2);
if (!base || !targets.length) {
  console.error('사용: node tools/check-prose.mjs <기준 커밋> <데이터 파일...>');
  process.exit(2);
}
const normalize = (p) => p.replace(/\\/g, '/').replace(/^\.\//, '');
const targetSet = new Set(targets.map(normalize));

const app = readFileSync(ROOT + 'app.html', 'utf8');
const dataScripts = [...app.matchAll(/<script src="(assets\/js\/data\/[^"?]+)/g)].map((m) => m[1]);
for (const t of targetSet) if (!dataScripts.includes(t)) console.warn(`주의: ${t}는 app.html의 데이터 목록에 없다. 단독으로 불러온다.`);

function oldSource(file) {
  try {
    return execFileSync('git', ['show', `${base}:${file}`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  } catch (_error) {
    return null;
  }
}

function load(useOld) {
  const context = { console };
  context.window = context;
  vm.createContext(context);
  const order = [...dataScripts, ...[...targetSet].filter((t) => !dataScripts.includes(t))];
  for (const file of order) {
    const source = useOld && targetSet.has(file) ? oldSource(file) : readFileSync(ROOT + file, 'utf8');
    if (source == null) throw new Error(`${base}에 ${file}가 없다`);
    vm.runInContext(source, context, { filename: file });
  }
  return context;
}

const before = load(true);
const after = load(false);

// 이 파일들이 만든 전역만 비교한다.
function globalsOf(file) {
  const source = readFileSync(ROOT + file, 'utf8');
  return [...new Set([...source.matchAll(/root\.(ProjectCurse[A-Za-z0-9_]+)\s*=/g)].map((m) => m[1]))];
}

/* ---------- 대조 기준 ---------- */
const MARKERS = ['확인되지', '확인하지', '확인된 적', '미확인', '추정', '가능성', '정황', '주장', '알려지지', '알 수 없', '불명', '판정되지', '공개되지', '밝혀지지', '의혹', '의심', '보인다', '보였다', '보이는', '듯', '모른다', '미상', '결정 대기', '상충'];
const NEGATION = /않|없|못|아니/g;
// 숫자는 종류만 대조한다. 겹친 문단을 합치면 같은 숫자의 등장 횟수는 줄어들 수 있다.
const numbers = (s) => [...new Set(s.match(/\d+(?:[.,:·]\d+)*/g) || [])].sort();
const latin = (s) => [...new Set(s.match(/[A-Za-z][A-Za-z0-9.\-']*[A-Za-z0-9]|[A-Za-z]/g) || [])];
const quoted = (s) => [...new Set(s.match(/「[^」]*」|『[^』]*』|“[^”]*”|‘[^’]*’|"[^"]*"/g) || [])];
const count = (s, re) => (s.match(re) || []).length;

// 내용어 — 형태소 분석 없이 조사를 떼어 낸 명사 줄기만 비교한다. 동사·어미로 끝나는 말은 건너뛴다.
// 표현을 바꾸면 소음이 생기므로 실패가 아니라 확인(WARN)으로 알린다.
const PARTICLES = ['에서부터', '으로부터', '에게서', '에서는', '에서도', '으로는', '으로도', '까지는', '부터는', '에서', '으로', '에게', '한테', '처럼', '보다', '까지', '부터', '마다', '조차', '이나', '이며', '이고', '에는', '에도', '와', '과', '은', '는', '이', '가', '을', '를', '의', '에', '로', '도', '만', '나'];
const VERBISH = /(다|고|며|면|서|지|게|니|어|아|했|였|된|한|는|은|을|던|할|될|인|적|록|듯|며|자|요)$/;
function stems(s) {
  const out = new Set();
  for (const word of s.match(/[가-힣]{2,}/g) || []) {
    let stem = word;
    for (const particle of PARTICLES) {
      if (stem.length > particle.length + 1 && stem.endsWith(particle)) {
        stem = stem.slice(0, -particle.length);
        break;
      }
    }
    if (stem.length >= 2 && !VERBISH.test(stem)) out.add(stem);
  }
  return [...out];
}

// 고유명사 사전 — 세력 이름, 인물 이름, 지명
function dictionary(ctx) {
  const words = new Set(['대흑림', '데드존', '피의 호수', '순례 회랑', '북해', '검문소', '성채', '리버스', '괴이', '타락자', '능력자', '방랑자', '위버멘시', '레드울프', '우시노다교', '아마리온', '제6계측계획']);
  Object.values(ctx.ProjectCurseCanon?.factions || {}).forEach((f) => f?.name && words.add(f.name));
  const walk = (value, depth) => {
    if (!value || depth > 6) return;
    if (Array.isArray(value)) return value.forEach((item) => walk(item, depth + 1));
    if (typeof value === 'object') {
      for (const [key, item] of Object.entries(value)) {
        if ((key === 'name' || key === 'koreanName' || key === 'nameKo') && typeof item === 'string' && item.length >= 2 && item.length <= 16) words.add(item.trim());
        else walk(item, depth + 1);
      }
    }
  };
  walk(ctx.ProjectCursePersonnel, 0);
  walk(ctx.ProjectCursePersonnelProfiles, 0);
  return [...words].filter((w) => w.length >= 2);
}
const DICT = dictionary(before);

/* ---------- 손대지 않는 글 ---------- */
function frozen(pathKeys, parents) {
  if (pathKeys.includes('counterRecord')) return '교단 상충 기록';
  const owner = parents[parents.length - 1];
  if (owner && typeof owner === 'object' && (owner.kind === 'quote' || owner.kind === 'log')) return owner.kind === 'quote' ? '증언·인용' : '현장 기입';
  return '';
}

const fails = [];
const warns = [];
let changed = 0;

function snippet(s) {
  return s.length > 90 ? `${s.slice(0, 88)}…` : s;
}

function compare(oldValue, newValue, pathKeys, parents) {
  const where = pathKeys.join('.');
  if (typeof oldValue === 'function' || typeof newValue === 'function') return;
  if (typeof oldValue === 'string' || typeof newValue === 'string') {
    if (typeof oldValue !== 'string' || typeof newValue !== 'string') {
      fails.push([where, '문자열이 다른 형식으로 바뀌었다']);
      return;
    }
    if (oldValue === newValue) return;
    changed += 1;
    const reason = frozen(pathKeys, parents);
    if (reason) {
      fails.push([where, `손대지 않는 글(${reason})이 바뀌었다`]);
      return;
    }
    const n0 = numbers(oldValue).join(' ');
    const n1 = numbers(newValue).join(' ');
    if (n0 !== n1) fails.push([where, `숫자가 다르다: [${n0}] → [${n1}]`]);
    const lostLatin = latin(oldValue).filter((t) => !newValue.includes(t));
    if (lostLatin.length) fails.push([where, `영문 약어·이름이 빠졌다: ${lostLatin.join(', ')}`]);
    const lostQuoted = quoted(oldValue).filter((q) => !newValue.includes(q));
    if (lostQuoted.length) fails.push([where, `괄호 인용이 빠졌다: ${lostQuoted.join(', ')}`]);
    const lostMarkers = MARKERS.filter((m) => oldValue.includes(m) && !newValue.includes(m));
    if (lostMarkers.length) fails.push([where, `판정 표현이 빠졌다: ${lostMarkers.join(', ')}`]);
    const lostNames = DICT.filter((w) => oldValue.includes(w) && !newValue.includes(w));
    if (lostNames.length) fails.push([where, `고유명사가 빠졌다: ${lostNames.join(', ')}`]);
    const lostStems = stems(oldValue).filter((stem) => !newValue.includes(stem));
    if (lostStems.length) warns.push([where, `빠졌을 수 있는 말: ${lostStems.join(', ')}`]);
    const neg0 = count(oldValue, NEGATION);
    const neg1 = count(newValue, NEGATION);
    if (neg1 < neg0) warns.push([where, `부정 표현이 ${neg0} → ${neg1}개로 줄었다: ${snippet(newValue)}`]);
    const ratio = newValue.length / oldValue.length;
    if (oldValue.length > 40 && (ratio < 0.7 || ratio > 1.3)) warns.push([where, `길이가 ${Math.round(ratio * 100)}%로 달라졌다: ${snippet(newValue)}`]);
    return;
  }
  // 문단 배열 — 문장을 문단 사이로 옮기거나 겹친 문단을 합칠 수 있으므로, 문단 목록은 늘 전체를 이어 대조한다.
  const isTextList = (value) => Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string');
  if (isTextList(oldValue) && isTextList(newValue) && oldValue.join('\n') !== newValue.join('\n')) {
    compare(oldValue.join('\n'), newValue.join('\n'), [...pathKeys, '*'], parents);
    return;
  }
  if (Array.isArray(oldValue) || Array.isArray(newValue)) {
    if (!Array.isArray(oldValue) || !Array.isArray(newValue) || oldValue.length !== newValue.length) {
      fails.push([where, `배열 길이가 달라졌다: ${Array.isArray(oldValue) ? oldValue.length : '-'} → ${Array.isArray(newValue) ? newValue.length : '-'}`]);
      return;
    }
    oldValue.forEach((item, index) => compare(item, newValue[index], [...pathKeys, index], [...parents, oldValue]));
    return;
  }
  if (oldValue && typeof oldValue === 'object') {
    if (!newValue || typeof newValue !== 'object') {
      fails.push([where, '객체가 사라졌다']);
      return;
    }
    const keys = new Set([...Object.keys(oldValue), ...Object.keys(newValue)]);
    for (const key of keys) {
      if (!(key in newValue)) fails.push([`${where}.${key}`, '키가 사라졌다']);
      else if (!(key in oldValue)) fails.push([`${where}.${key}`, '키가 새로 생겼다']);
      else compare(oldValue[key], newValue[key], [...pathKeys, key], [...parents, oldValue]);
    }
    return;
  }
  if (oldValue !== newValue) fails.push([where, `값이 바뀌었다: ${oldValue} → ${newValue}`]);
}

for (const file of targetSet) {
  for (const name of globalsOf(file)) compare(before[name], after[name], [name], []);
}

console.log(`문장 흐름 대조 — 기준 ${base}, 파일 ${targetSet.size}개, 바뀐 문자열 ${changed}개, 고유명사 사전 ${DICT.length}개`);
fails.forEach(([where, message]) => console.log(`FAIL  ${where}  ${message}`));
warns.forEach(([where, message]) => console.log(`WARN  ${where}  ${message}`));
console.log(`\n실패 ${fails.length} / 확인 ${warns.length}`);
if (fails.length) process.exitCode = 1;
