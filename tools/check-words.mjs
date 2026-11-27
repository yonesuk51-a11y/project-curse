#!/usr/bin/env node
// Project Curse — 걸리는 낱말 점검(2026-11-28 사용자 결정).
// 영어를 옮기다 생긴 낱말("세 축으로", "렌즈로 보면", "질문을 품다")을 찾아 알린다. 고치지는 않는다.
// 사람이 문맥을 보고 바꿀지 정한다. 기준은 WRITING_STYLE_GUIDE.md의 "걸리는 낱말" 절이다.
//
// 사용:
//   node tools/check-words.mjs                 사이트 데이터 전체, 바꿀 낱말(change)만
//   node tools/check-words.mjs --all           조건부 낱말(conditional)까지
//   node tools/check-words.mjs <데이터 파일...>  그 파일만
//   node tools/check-words.mjs --text <글 파일> 카카오스토리 초안 같은 일반 글
//   node tools/check-words.mjs --self-test     낱말 목록의 예문으로 정규식 확인
//
// 영상·녹취의 대사·해설·교신·시각(transcript)은 개정하지 않으므로 보지 않는다(2026-09-25 사용자 결정).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { AWKWARD_WORDS } from './lib/awkward-words.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const rest = args.filter((a) => !a.startsWith('--'));

const RULES = AWKWARD_WORDS.map((w) => ({
  ...w,
  re: new RegExp(w.detect, 'g'),
  ex: w.exclude ? new RegExp(w.exclude) : null
}));

// 문장 하나 안에서 찾는다. 제외어는 그 문장에 있으면 넘긴다(좌표축, 스마트폰 잠금 해제 같은 실제 뜻).
function sentences(text) {
  return text.split(/(?<=[.!?。])\s+|\n+/).filter(Boolean);
}
function findIn(text, includeConditional) {
  const hits = [];
  for (const sentence of sentences(text)) {
    for (const rule of RULES) {
      if (rule.tier !== 'change' && !includeConditional) continue;
      rule.re.lastIndex = 0;
      const m = rule.re.exec(sentence);
      if (!m) continue;
      if (rule.ex && rule.ex.test(sentence)) continue;
      hits.push({ rule, match: m[0].trim(), sentence });
    }
  }
  return hits;
}

if (flag('--self-test')) {
  let bad = 0;
  for (const rule of RULES) {
    const test = (s) => { rule.re.lastIndex = 0; return rule.re.test(s) && !(rule.ex && rule.ex.test(s)); };
    rule.pos.forEach((s) => { if (!test(s)) { bad += 1; console.log(`놓침  ${rule.id} ${rule.headword}: ${s}`); } });
    rule.neg.forEach((s) => { if (test(s)) { bad += 1; console.log(`잘못 잡음  ${rule.id} ${rule.headword}: ${s}`); } });
  }
  console.log(`낱말 ${RULES.length}개 예문 확인 — 어긋남 ${bad}`);
  process.exitCode = bad ? 1 : 0;
} else if (flag('--text')) {
  if (!rest.length) { console.error('사용: node tools/check-words.mjs --text <글 파일>'); process.exit(2); }
  let total = 0;
  for (const file of rest) {
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const hit of findIn(line, flag('--all'))) {
        total += 1;
        report(`${file}:${index + 1}`, hit);
      }
    });
  }
  console.log(`\n걸리는 낱말 ${total}곳`);
} else {
  const app = readFileSync(ROOT + 'index.html', 'utf8');
  const dataScripts = [...app.matchAll(/<script src="(assets\/js\/data\/[^"?]+)/g)].map((m) => m[1]);
  const targets = rest.length ? rest.map((p) => p.replace(/\\/g, '/').replace(/^\.\//, '')) : dataScripts;
  const context = { console };
  context.window = context;
  vm.createContext(context);
  for (const file of dataScripts) vm.runInContext(readFileSync(ROOT + file, 'utf8'), context, { filename: file });
  let total = 0;
  const byWord = new Map();
  for (const file of targets) {
    const source = readFileSync(ROOT + file, 'utf8');
    const names = [...new Set([...source.matchAll(/root\.(ProjectCurse[A-Za-z0-9_]+)\s*=/g)].map((m) => m[1]))];
    for (const name of names) walk(context[name], [name], (text, where) => {
      for (const hit of findIn(text, flag('--all'))) {
        total += 1;
        byWord.set(hit.rule.headword, (byWord.get(hit.rule.headword) || 0) + 1);
        report(where, hit);
      }
    });
  }
  console.log(`\n걸리는 낱말 ${total}곳 — 파일 ${targets.length}개`);
  [...byWord].sort((a, b) => b[1] - a[1]).forEach(([word, n]) => console.log(`  ${word} ${n}`));
}

function walk(value, path, visit, seen = new Set()) {
  if (path.includes('transcript')) return;
  if (typeof value === 'string') { visit(value, path.join('.')); return; }
  if (!value || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) value.forEach((item, i) => walk(item, [...path, i], visit, seen));
  else for (const [key, item] of Object.entries(value)) if (typeof item !== 'function') walk(item, [...path, key], visit, seen);
}

function report(where, { rule, match, sentence }) {
  const s = sentence.length > 100 ? `${sentence.slice(0, 98)}…` : sentence;
  console.log(`${rule.tier === 'change' ? '바꿈' : '조건'}  ${where}  [${rule.id} ${rule.headword}] "${match}"`);
  console.log(`      ${s}`);
  if (rule.how) console.log(`      → ${rule.how}`);
}
