#!/usr/bin/env node
// Project Curse — 문장 흐름 개정 대조 검사.
// 사용: node tools/check-prose.mjs <기준 커밋> <데이터 파일...>
// 기준 커밋의 데이터와 작업 폴더의 데이터를 각각 불러와, 바뀐 문자열마다 아래를 원문과 대조한다.
//   실패(FAIL): 숫자·영문 약어·괄호 인용·판정 표현·고유명사가 빠졌거나 구조가 달라졌다.
//   확인(WARN): 빠졌을 수 있는 내용어, 부정 표현 감소, 길이 변화, 화자가 있는 글(증언·현장 기입·교단 상충 기록)의 변경. 사람이 읽고 판단한다.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { compareFacts, dictionary } from './prose-facts.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const [base, ...targets] = process.argv.slice(2);
if (!base || !targets.length) {
  console.error('사용: node tools/check-prose.mjs <기준 커밋> <데이터 파일...>');
  process.exit(2);
}
const normalize = (p) => p.replace(/\\/g, '/').replace(/^\.\//, '');
const targetSet = new Set(targets.map(normalize));

const app = readFileSync(ROOT + 'index.html', 'utf8');
const dataScripts = [...app.matchAll(/<script src="(assets\/js\/data\/[^"?]+)/g)].map((m) => m[1]);
for (const t of targetSet) if (!dataScripts.includes(t)) console.warn(`주의: ${t}는 index.html의 데이터 목록에 없다. 단독으로 불러온다.`);

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

/* ---------- 대조 기준 — tools/prose-facts.mjs ---------- */
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
    // 화자가 있는 글도 개정 대상이다. 다만 목소리를 살렸는지 사람이 읽고 확인하도록 알린다.
    const reason = frozen(pathKeys, parents);
    if (reason) warns.push([where, `화자가 있는 글(${reason}) — 말투·어휘·시각 형식을 살렸는지 확인`]);
    const result = compareFacts(oldValue, newValue, DICT);
    result.fails.forEach((message) => fails.push([where, message]));
    result.warns.forEach((message) => warns.push([where, `${message}: ${snippet(newValue)}`]));
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
