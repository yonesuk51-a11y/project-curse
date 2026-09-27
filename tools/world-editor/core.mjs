import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const WORK = path.join(ROOT, 'output/world-editor');
export const VERSION = '1.0.0';
export const runFile = promisify(execFile);
export const hash = value => createHash('sha256').update(value).digest('hex');
export const posix = value => value.split(path.sep).join('/');
export const now = () => new Date().toISOString();
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export function within(root, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || relative.includes('\0') || relative.includes(':')) throw new Error('상대 경로가 필요합니다.');
  const target = path.resolve(root, relative);
  const result = path.relative(path.resolve(root), target);
  if (!result || result === '..' || result.startsWith(`..${path.sep}`) || path.isAbsolute(result)) throw new Error('허용 폴더 밖의 경로입니다.');
  return target;
}

export async function noLinks(root, target) {
  const rootPath = path.resolve(root);
  const relative = path.relative(rootPath, path.resolve(target));
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('허용 폴더 밖입니다.');
  let current = rootPath;
  for (const part of ['', ...relative.split(path.sep).filter(Boolean)]) {
    if (part) current = path.join(current, part);
    try {
      if ((await fs.lstat(current)).isSymbolicLink()) throw new Error(`연결 경로는 사용하지 않습니다: ${current}`);
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
}

export async function readJson(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); }
  catch (error) {
    if (error.code === 'ENOENT' && fallback !== undefined) return structuredClone(fallback);
    throw new Error(`JSON을 읽지 못했습니다. 원본을 보존합니다: ${file}: ${error.message}`);
  }
}

export async function writeAtomic(relative, value, work = WORK) {
  const target = within(work, relative);
  await noLinks(ROOT, target);
  await fs.mkdir(path.dirname(target), { recursive: true });
  const temp = `${target}.${randomUUID()}.tmp`;
  const text = typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`;
  await fs.writeFile(temp, text, { flag: 'wx' });
  try { await fs.rename(temp, target); }
  catch (error) { await fs.unlink(temp).catch(() => {}); throw error; }
  return target;
}

export async function withLock(name, action, work = WORK) {
  const file = within(work, `locks/${name}.json`);
  await noLinks(ROOT, file);
  await fs.mkdir(path.dirname(file), { recursive: true });
  const token = randomUUID();
  let handle;
  for (let attempt = 0; attempt < 2; attempt++) {
    try { handle = await fs.open(file, 'wx'); break; }
    catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const previous = await readJson(file);
      if (!Number.isSafeInteger(previous.pid) || previous.pid <= 0) throw new Error('잘못된 잠금 파일입니다. 수동 확인이 필요합니다.');
      let active = true;
      try { process.kill(previous.pid, 0); } catch (e) { if (e.code === 'ESRCH') active = false; }
      if (active) throw new Error(`이미 실행 중입니다 (${name}, PID ${previous.pid}).`);
      await fs.unlink(file);
    }
  }
  if (!handle) throw new Error('잠금 획득 실패');
  await handle.writeFile(JSON.stringify({ pid: process.pid, token, startedAt: now() }));
  await handle.close();
  try { return await action(); }
  finally {
    const current = await readJson(file, null);
    if (current?.token === token) await fs.unlink(file);
  }
}

export async function walk(directory, root = ROOT) {
  const full = within(root, directory);
  await noLinks(root, full);
  if (!existsSync(full)) return [];
  const files = [];
  for (const entry of await fs.readdir(full, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw new Error(`연결 경로 발견: ${entry.name}`);
    const relative = posix(path.join(directory, entry.name));
    if (entry.isDirectory()) files.push(...await walk(relative, root));
    else files.push(relative);
  }
  return files.sort();
}

export async function snapshot(root = ROOT) {
  const fixed = ['index.html', 'AGENTS.md', 'WORLD_CANON_LEDGER.md', 'WRITING_STYLE_GUIDE.md', 'PROJECT_CURSE_ART_DIRECTION_GUIDE.md', 'PROJECT_CURSE_APP_SPEC.md', 'ASSET_POLICY.md', 'MEDIA_CREDITS.md'];
  const files = [...fixed, ...await walk('assets/js/data', root), ...await walk('assets/app', root), ...await walk('canon/originals', root), ...await walk('tools', root), ...await walk('.github', root)];
  const sources = {};
  for (const file of [...new Set(files)].sort()) {
    if (!/\.(?:js|mjs|json|html|css|md|ps1|yml|yaml)$/.test(file) || file.includes('/node_modules/')) continue;
    const target = within(root, file);
    await noLinks(root, target);
    if (!existsSync(target)) throw new Error(`검사 대상이 없습니다: ${file}`);
    const bytes = await fs.readFile(target);
    sources[file] = { text: bytes.toString('utf8'), hash: hash(bytes), bytes: bytes.length };
  }
  const fingerprint = hash(JSON.stringify(Object.entries(sources).map(([file, value]) => [file, value.hash])));
  const reviewFiles = Object.entries(sources).filter(([file]) => file.startsWith('assets/js/data/') || ['WORLD_CANON_LEDGER.md', 'WRITING_STYLE_GUIDE.md', 'PROJECT_CURSE_ART_DIRECTION_GUIDE.md', 'PROJECT_CURSE_APP_SPEC.md', 'tools/world-editor/catalog.mjs', 'tools/world-editor/canon-decisions.json', 'tools/world-editor/review-lenses.json', 'tools/world-editor/art-direction.json', 'tools/world-editor/editorial-seeds.json'].includes(file));
  const dataScripts = [...sources['index.html'].text.matchAll(/<script\s+src="(assets\/js\/data\/[^"?]+)/g)].map(match => match[1]);
  const reviewFingerprint = hash(JSON.stringify([...reviewFiles.map(([file, value]) => [file, value.hash]), ['loadedData', dataScripts]]));
  return { version: VERSION, fingerprint, reviewFingerprint, sources };
}

export function evidence(snap, file, needle) {
  const source = snap.sources[file];
  if (!source) throw new Error(`근거 파일 없음: ${file}`);
  const lines = source.text.split(/\r?\n/);
  const index = lines.findIndex(line => line.includes(needle));
  if (index < 0) throw new Error(`근거 문장을 찾지 못했습니다: ${file}: ${needle}`);
  return { file, line: index + 1, quote: lines[index].trim().slice(0, 1200), fileHash: source.hash };
}

export function validateEvidence(snap, item) {
  const source = snap.sources[item.file];
  if (!source || source.hash !== item.fileHash || !Number.isInteger(item.line) || item.line < 1 || !item.quote?.trim()) return false;
  const line = source.text.split(/\r?\n/)[item.line - 1];
  return Boolean(line?.includes(item.quote));
}

export function locate(snap, needle, preferred = []) {
  for (const file of [...new Set([...preferred, ...Object.keys(snap.sources).filter(name => name.startsWith('assets/js/data/'))])]) {
    if (snap.sources[file]?.text.includes(needle)) return evidence(snap, file, needle);
  }
  return null;
}

export async function gitInfo(root = ROOT) {
  const options = { cwd: root, encoding: 'utf8', windowsHide: true, timeout: 15000 };
  const [commit, branch, status] = await Promise.all([
    runFile('git', ['rev-parse', 'HEAD'], options), runFile('git', ['branch', '--show-current'], options), runFile('git', ['status', '--porcelain=v1'], options)
  ]);
  return { commit: commit.stdout.trim(), branch: branch.stdout.trim(), dirty: Boolean(status.stdout.trim()) };
}

export function changedFiles(before, after) {
  const oldFiles = before?.files || {};
  return [...new Set([...Object.keys(oldFiles), ...Object.keys(after.sources)])].filter(file => oldFiles[file] !== after.sources[file]?.hash).sort();
}
