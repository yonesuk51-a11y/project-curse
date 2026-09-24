#!/usr/bin/env node
// Project Curse 6 — 옛 독립 문서 페이지(docs/<ID>/index.html)를 새 단말의 기록보관소로 보내는 안내 페이지로 만든다.
// 이미 공유된 주소가 끊기지 않게 하고, 카카오스토리 같은 링크 미리보기가 읽는 제목·설명·그림을 남긴다.
// 제목과 설명은 archive-registry.js의 공개 기록 값을 그대로 쓴다. <title>은 옛 페이지처럼 기록 제목만 쓰고,
// 미리보기 제목(og:title)에만 단말 이름을 붙인다. 본문은 새 단말에만 있다.
// 사용: node tools/build-docs-stubs.mjs          (docs/ 아래 기존 문서 폴더를 모두 다시 쓴다)
//       node tools/build-docs-stubs.mjs --check  (다시 쓰지 않고 현재 파일이 생성 결과와 같은지만 본다)
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SITE = 'https://yonesuk51-a11y.github.io/project-curse/';
const IMAGE = `${SITE}assets/resources/derived/project-curse-world-keyart-concept-v1.png`;
const IMAGE_ALT = '폐쇄 관제실의 화면에 대흑림 성채와 데드존 도로가 표시된 Project Curse 편집 키아트';

const context = { console };
context.window = context;
vm.createContext(context);
vm.runInContext(readFileSync(ROOT + 'assets/js/data/archive-registry.js', 'utf8'), context);
const records = new Map((context.ProjectCurseArchive?.publicRecords || []).map((record) => [record.id, record]));

const escape = (value) => String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function stub(id, record) {
  const title = `${record.title} | U.A.C 합동작전 단말`;
  const target = `../../index.html#archive-entry/${id}`;
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,follow">
<title>${escape(record.title)}</title>
<meta name="description" content="${escape(record.summary)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Project Curse">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(record.summary)}">
<meta property="og:url" content="${SITE}docs/${id}/">
<meta property="og:image" content="${IMAGE}">
<meta property="og:image:alt" content="${escape(IMAGE_ALT)}">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0; url=${target}">
<style>body{margin:0;padding:24px;background:#0a0c0b;color:#d8d6cc;font:16px/1.7 system-ui,sans-serif}a{color:#d39a45}</style>
</head>
<body>
<p>이 기록은 합동작전 단말의 기록보관소로 옮겨졌습니다.</p>
<p><a href="${target}">${escape(record.title)} 열기</a></p>
<script>location.replace(${JSON.stringify(target)});</script>
</body>
</html>
`;
}

const ids = readdirSync(ROOT + 'docs', { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
const check = process.argv.includes('--check');
let problems = 0;
for (const id of ids) {
  const record = records.get(id);
  const file = `${ROOT}docs/${id}/index.html`;
  if (!record) {
    console.error(`MISSING RECORD ${id} — archive-registry.js에 공개 기록이 없다`);
    problems++;
    continue;
  }
  const html = stub(id, record);
  if (check) {
    const same = existsSync(file) && readFileSync(file, 'utf8').replace(/\r\n/g, '\n') === html;
    console.log(`${same ? 'OK   ' : 'STALE'} docs/${id}/index.html`);
    if (!same) problems++;
  } else {
    writeFileSync(file, html);
    console.log(`WROTE docs/${id}/index.html`);
  }
}
process.exitCode = problems ? 1 : 0;
