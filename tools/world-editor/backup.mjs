import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { ROOT, WORK, snapshot, readJson, within, noLinks, hash, now, withLock } from './core.mjs';

const extras = ['output/world-editor/feedback.json', 'output/world-editor/reviews.json', 'output/world-editor/research.json', 'output/20260928-site-automation-plan/MASTERPLAN.md'];
const validId = id => typeof id === 'string' && /^\d{8}T\d{6}Z-[a-f0-9]{8}$/.test(id);

export async function createBackup({ work = WORK, root = ROOT } = {}) {
  return withLock('backup', async () => {
    const backups = within(work, 'backups');
    await noLinks(root, backups);
    const existing = await fs.readdir(backups, { withFileTypes: true }).catch(error => error.code === 'ENOENT' ? [] : Promise.reject(error));
    if (existing.filter(item => item.isDirectory() && validId(item.name)).length >= 52) throw new Error('백업이 52개에 도달했습니다. 외부 저장소 복사·보관 정책을 검토한 뒤 수동 정리해 주세요. 기존 파일은 삭제하지 않습니다.');
    const snap = await snapshot(root);
    const id = `${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}-${randomUUID().slice(0, 8)}`;
    const staging = within(work, `backups/${id}.partial`);
    const final = within(work, `backups/${id}`);
    await noLinks(root, staging);
    await fs.mkdir(staging, { recursive: true });
    const fileList = [...new Set([...Object.keys(snap.sources), ...extras])].sort();
    const manifest = { schema: 1, id, createdAt: now(), fingerprint: snap.fingerprint, files: {}, omitted: ['output/imagegen/* — 1GB 이상 후보 그림은 이 기본 백업에 포함하지 않습니다.', 'Git 이력·시스템 설정·브라우저 개인 데이터는 포함하지 않습니다.'], note: '같은 PC와 동기화 폴더 안의 복사본입니다. 별도 디스크 백업을 대신하지 않습니다.' };
    for (const file of fileList) {
      const source = within(root, file);
      await noLinks(root, source);
      let bytes;
      try { bytes = await fs.readFile(source); }
      catch (error) { if (error.code === 'ENOENT' && extras.includes(file)) continue; throw error; }
      if (snap.sources[file] && hash(bytes) !== snap.sources[file].hash) throw new Error(`백업 중 원본이 바뀌었습니다: ${file}. 부분 복사본은 검사 전까지 사용하지 마세요.`);
      const target = within(staging, `files/${file}`);
      await noLinks(root, target);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, bytes, { flag: 'wx' });
      manifest.files[file] = { hash: hash(bytes), bytes: bytes.length };
    }
    const finalSnapshot = await snapshot(root);
    if (finalSnapshot.fingerprint !== snap.fingerprint) throw new Error('백업 중 입력 파일이 바뀌었습니다. 부분 복사본을 보존하고 완료로 표시하지 않습니다.');
    await fs.writeFile(within(staging, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
    await fs.rename(staging, final);
    return { id, path: final, files: Object.keys(manifest.files).length, bytes: Object.values(manifest.files).reduce((sum, item) => sum + item.bytes, 0), omitted: manifest.omitted, note: manifest.note };
  }, work);
}

async function checkedManifest(id, work) {
  if (!validId(id)) throw new Error('잘못된 백업 ID입니다.');
  const directory = within(work, `backups/${id}`);
  await noLinks(ROOT, directory);
  const manifest = await readJson(within(directory, 'manifest.json'));
  if (manifest.schema !== 1 || manifest.id !== id || !manifest.files || Array.isArray(manifest.files)) throw new Error('백업 목록 형식 오류');
  return { directory, manifest };
}

export async function verifyBackup(id, { work = WORK } = {}) {
  const { directory, manifest } = await checkedManifest(id, work);
  const mismatches = [];
  let bytes = 0;
  for (const [file, expected] of Object.entries(manifest.files)) {
    const target = within(directory, `files/${file}`);
    await noLinks(ROOT, target);
    try {
      const contents = await fs.readFile(target);
      bytes += contents.length;
      if (hash(contents) !== expected.hash || contents.length !== expected.bytes) mismatches.push(file);
    } catch (error) { if (error.code === 'ENOENT') mismatches.push(file); else throw error; }
  }
  return { id, valid: mismatches.length === 0, files: Object.keys(manifest.files).length, bytes, mismatches, omitted: manifest.omitted, note: manifest.note };
}

export async function previewBackup(id, { work = WORK } = {}) {
  const checked = await verifyBackup(id, { work });
  if (!checked.valid) throw new Error(`손상된 백업입니다: ${checked.mismatches.join(', ')}`);
  const { directory, manifest } = await checkedManifest(id, work);
  const preview = within(work, `restore-preview/${id}-${randomUUID().slice(0, 8)}`);
  await noLinks(ROOT, preview);
  // A preview is intentionally isolated from source files; never overwrites the site.
  await fs.mkdir(preview, { recursive: true });
  for (const file of Object.keys(manifest.files)) {
    const source = within(directory, `files/${file}`);
    const target = within(preview, file);
    await noLinks(ROOT, target);
    await fs.mkdir(path.dirname(target), { recursive: true });
    const contents = await fs.readFile(source);
    await fs.writeFile(target, contents, { flag: 'wx' });
    if (hash(await fs.readFile(target)) !== manifest.files[file].hash) throw new Error(`복원 연습 실패: ${file}`);
  }
  return { id, path: preview, verifiedFiles: Object.keys(manifest.files).length, message: '격리된 폴더에 모든 파일을 다시 읽어 복원했습니다. 실제 사이트 파일은 건드리지 않았습니다.' };
}
