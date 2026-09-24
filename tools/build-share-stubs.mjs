#!/usr/bin/env node
// Project Curse 6 — 인물·기록별 링크 미리보기용 공유 주소(share/<종류>/<id>/index.html)를 만든다. 2026-09-25 사용자 결정.
// 새 단말은 주소의 # 뒤로 화면을 고르는데, 카카오스토리 같은 링크 미리보기는 # 뒤를 읽지 않는다.
// 그래서 인물·세계 기록·세력·기록보관소 상세마다 제목·설명·그림을 담은 정적 페이지를 두고, 열면 단말의 해당 화면으로 보낸다.
// 그림은 그 인물의 사진, 그 기록·세력의 그림(이미 채택·편입된 것)이 있으면 그것을, 없으면 로고(assets/brand/og-image.png)를 쓴다.
// 링크 복사 단추(PCApp.copyLink)는 share-index-data.js를 보고 공유 주소를 복사한다.
// 사용: node tools/build-share-stubs.mjs          (share/ 아래를 다시 쓰고 share-index-data.js를 만든다)
//       node tools/build-share-stubs.mjs --check  (다시 쓰지 않고 현재 파일이 생성 결과와 같은지만 본다)
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SITE = 'https://yonesuk51-a11y.github.io/project-curse/';
const LOGO = 'assets/brand/og-image.png';
const LOGO_ALT = '가운데가 붉게 갈라진 흰 봉인 옆에 PROJECT CURSE 글자가 있는 로고';
const check = process.argv.includes('--check');

// 단말이 부르는 순서대로 데이터 파일을 읽는다
const context = { console, URLSearchParams };
context.window = context;
context.document = { addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, readyState: 'complete' };
context.location = { hash: '', search: '', pathname: '/' };
vm.createContext(context);
const app = readFileSync(ROOT + 'index.html', 'utf8');
for (const match of app.matchAll(/<script src="(assets\/js\/data\/[^"?]+)/g)) {
  if (match[1].endsWith('share-index-data.js')) continue;
  try {
    vm.runInContext(readFileSync(ROOT + match[1], 'utf8'), context, { filename: match[1] });
  } catch (_error) { /* 브라우저 전용 파일은 건너뛴다 */ }
}

const escape = (value) => String(value ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clean = (src) => String(src || '').replace(/^(\.\.\/)+/, '');
const firstSentence = (value, limit = 140) => {
  const text = (Array.isArray(value) ? value.find(Boolean) : value) || '';
  const sentence = String(text).replace(/\s+/g, ' ').trim().split(/(?<=[.다])\s/)[0] || '';
  return sentence.length > limit ? sentence.slice(0, limit - 1) + '…' : sentence;
};
// 그림은 실제 파일이 있을 때만(PNG·JPG 원본 — 미리보기는 WebP를 못 읽는 곳이 있다)
const imageOf = (visual) => {
  const src = clean(visual?.src);
  return src && /\.(png|jpe?g)$/i.test(src) && existsSync(ROOT + src) ? { src, alt: visual.alt || visual.caption || '' } : null;
};

// 종류: 경로 조각, 단말 주소, 목록
const KINDS = {
  p: { route: 'personnel', items: () => Object.values(context.ProjectCursePersonnel?.byId || {}).map((record) => ({
    id: record.id,
    title: `${record.name} — 인물 기록`,
    desc: firstSentence(record.overview || record.affiliationSummary || record.role),
    image: imageOf(record.visual)
  })) },
  // 세계 기록 화면(history.js records())과 같은 순서로 모은다: 고대 기록, 핵심 기록, 기술 기록, 2006년 이후 기록
  h: { route: 'history', items: () => {
    const chron = context.ProjectCurseWorldHistoryData || {};
    const pros = context.ProjectCurseWorldHistoryProse || {};
    const merged = (record) => ({ ...record, ...(chron.getRecord?.(record.id) || {}), ...(pros.getRecord?.(record.id) || {}) });
    const list = [
      ...(chron.deepHistoryRecords || []).map((record) => ({ ...record, visual: pros.recordVisuals?.[record.id] || record.visual })),
      ...(context.ProjectCurseWorldHistoryCore?.records || []).map(merged),
      ...(context.ProjectCurseJapanTechnology?.records || []),
      ...(chron.post2006Records || []).map((record) => ({ ...record, ...(pros.getRecord?.(record.id) || {}) }))
    ];
    return list.map((record) => ({
      id: record.id,
      title: `${record.date ? `${record.date} ` : ''}${record.title} — 세계 기록`,
      desc: firstSentence(record.summary || record.paragraphs || record.fragments?.map((fragment) => fragment.text)),
      image: imageOf(record.visual || pros.recordVisuals?.[record.id])
    }));
  } },
  f: { route: 'faction-info', items: () => Object.entries(context.ProjectCurseFactionAnalysis?.factions || {}).map(([id, faction]) => ({
    id,
    title: `${faction.name}${faction.roleLabel ? ` ${faction.roleLabel}` : ''} — 세력 분석`,
    desc: firstSentence(faction.lead || faction.overview),
    image: imageOf(faction.visual)
  })) },
  a: { route: 'archive-entry', items: () => (context.ProjectCurseArchive?.publicRecords || []).map((record) => ({
    id: record.id,
    title: `${record.title} — 기록보관소`,
    desc: firstSentence(record.summary),
    image: null
  })) }
};

function page(kind, item) {
  const target = `../../../index.html#${KINDS[kind].route}/${encodeURIComponent(item.id)}`;
  const image = item.image || { src: LOGO, alt: LOGO_ALT };
  const title = `${item.title} | U.A.C 합동작전 단말`;
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,follow">
<title>${escape(item.title)}</title>
<meta name="description" content="${escape(item.desc)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Project Curse">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(item.desc)}">
<meta property="og:url" content="${SITE}share/${kind}/${encodeURIComponent(item.id)}/">
<meta property="og:image" content="${SITE}${encodeURI(image.src)}">
<meta property="og:image:alt" content="${escape(image.alt)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../../../assets/brand/favicon-32.png" type="image/png">
<meta http-equiv="refresh" content="0; url=${target}">
<style>body{margin:0;padding:24px;background:#070606;color:#e2dcd6;font:16px/1.7 system-ui,sans-serif}a{color:#e0706f}</style>
</head>
<body>
<p>합동작전 단말로 이동합니다.</p>
<p><a href="${target}">${escape(item.title)} 열기</a></p>
<script>location.replace(${JSON.stringify(target)});</script>
</body>
</html>
`;
}

const index = {};
const expected = new Map();
for (const [kind, spec] of Object.entries(KINDS)) {
  const items = spec.items().filter((item) => item.id && /^[\w-]+$/.test(item.id));
  index[spec.route] = { kind, ids: items.map((item) => item.id).sort() };
  items.forEach((item) => expected.set(`share/${kind}/${item.id}/index.html`, page(kind, item)));
}
const indexFile = 'assets/js/data/share-index-data.js';
const indexSource = `// Project Curse 6 — 공유 주소 목록. tools/build-share-stubs.mjs가 만든다. 손으로 고치지 않는다.
// PCApp.copyLink가 인물·세계 기록·세력·기록보관소 상세에서 이 목록에 있는 id면 share/<종류>/<id>/ 주소를 복사한다.
(function (root) {
  'use strict';
  const routes = ${JSON.stringify(index)};
  root.ProjectCurseShareIndex = Object.freeze({
    routes,
    resolve(route, parts) {
      const entry = routes[route];
      const id = parts && parts[0];
      return entry && id && entry.ids.includes(id) ? \`share/\${entry.kind}/\${encodeURIComponent(id)}/\` : null;
    }
  });
})(window);
`;
expected.set(indexFile, indexSource);

let problems = 0;
if (check) {
  for (const [file, html] of expected) {
    const same = existsSync(ROOT + file) && readFileSync(ROOT + file, 'utf8').replace(/\r\n/g, '\n') === html;
    if (!same) {
      console.log(`STALE ${file}`);
      problems++;
    }
  }
  // 남은 옛 공유 페이지(목록에서 빠진 id)
  if (existsSync(ROOT + 'share')) {
    for (const kind of readdirSync(ROOT + 'share')) {
      for (const id of readdirSync(`${ROOT}share/${kind}`)) {
        if (!expected.has(`share/${kind}/${id}/index.html`)) {
          console.log(`EXTRA share/${kind}/${id}`);
          problems++;
        }
      }
    }
  }
  console.log(problems ? `${problems} problem(s)` : `ok ${expected.size - 1} pages`);
} else {
  if (existsSync(ROOT + 'share')) rmSync(ROOT + 'share', { recursive: true, force: true });
  for (const [file, html] of expected) {
    mkdirSync(ROOT + file.replace(/[^/]+$/, ''), { recursive: true });
    writeFileSync(ROOT + file, html);
  }
  console.log(`wrote ${expected.size - 1} pages and ${indexFile}`);
}
process.exitCode = problems ? 1 : 0;
