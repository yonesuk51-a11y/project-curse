#!/usr/bin/env node
// index.html이 부르는 로컬 스크립트·스타일 주소 끝에 내용 해시를 찍는다: ?v=<버전>-<해시 8자>.
// 내용이 바뀐 파일만 주소가 바뀌므로, 방문자 브라우저가 전에 받아 둔 옛 파일을 새 파일과 섞어 쓰지 않는다.
// GitHub Pages는 파일을 최대 10분 캐시하게 하므로 index.html 자체의 갱신 지연은 남는다.
// 해시는 줄바꿈을 LF로 맞춘 내용으로 계산한다(Windows 작업 트리와 GitHub의 결과가 같도록).
// 사용: node tools/stamp-assets.mjs          — index.html을 고쳐 쓴다
//       node tools/stamp-assets.mjs --check  — 고칠 곳을 STALE로 보고하고, 있으면 종료 코드 1
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const check = process.argv.includes('--check');
const html = readFileSync(ROOT + 'index.html', 'utf8');
const stale = [];

const stamped = html.replace(/((?:src|href)=")(assets\/[^"?#]+\.(?:js|css))(?:\?v=([0-9][0-9.]*)(?:-[0-9a-f]{8})?)?(")/g,
  (whole, before, file, version, after) => {
    // 없는 파일은 verify-app의 app-local-files-exist가 따로 잡는다.
    if (!existsSync(ROOT + file)) return whole;
    const text = readFileSync(ROOT + file, 'utf8').replace(/\r\n/g, '\n');
    const hash = createHash('sha256').update(text).digest('hex').slice(0, 8);
    const next = `${before}${file}?v=${version || '0'}-${hash}${after}`;
    if (next !== whole) stale.push(`STALE ${file}`);
    return next;
  });

if (check) {
  stale.forEach((line) => console.log(line));
  process.exit(stale.length ? 1 : 0);
}
if (stamped !== html) writeFileSync(ROOT + 'index.html', stamped);
console.log(stale.length ? `stamped ${stale.length} file(s)` : 'up to date');
