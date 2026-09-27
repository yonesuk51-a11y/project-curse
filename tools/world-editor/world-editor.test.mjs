import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { ROOT, WORK, within, snapshot, evidence, validateEvidence, hash } from './core.mjs';
import { ageRange } from './rules.mjs';
import { approvedUrl, discover, fetchSource } from './research.mjs';
import { audit, validateReview } from './engine.mjs';
import { verifyBackup, previewBackup } from './backup.mjs';
import { createReviewServer } from './server.mjs';
import { buildCatalog, buildRelations, loadData } from './catalog.mjs';
import { catalogHash, changedImpact, traceImpact } from './impact.mjs';

test('설정 변경 영향은 명시 연결과 이름 언급을 분리하고 중복 ID를 추정으로 메우지 않는다', () => {
  const source = file => ({ file, line: 1, quote: 'test', fileHash: 'a'.repeat(64) });
  const records = [
    { key: 'personnel:lead', kind: 'personnel', id: 'lead', title: '하린 요원', text: '하린 요원', hash: 'old', source: source('people.js'), value: { relationships: [{ target: 'shared', relation: '동료' }, { target: 'unknown', relation: '행방' }] } },
    { key: 'personnel:shared', kind: 'personnel', id: 'shared', title: '지안 요원', text: '지안 요원', hash: 'same', source: source('people.js'), value: {} },
    { key: 'region:shared', kind: 'region', id: 'shared', title: '공유 지역', text: '공유 지역', hash: 'same', source: source('map.js'), value: {} },
    { key: 'history:event', kind: 'history', id: 'event', title: '사건 기록', text: '하린 요원 목격', hash: 'same', source: source('history.js'), value: {} }
  ];
  const relations = buildRelations(records);
  const preview = traceImpact(records, relations, 'personnel:lead');
  assert.equal(preview.explicit.find(item => item.kind === '동료').key, 'personnel:shared');
  assert.equal(preview.unresolved.find(item => item.kind === '행방').resolution, 'missing');
  assert.equal(preview.mentions.find(item => item.key === 'history:event').direction, 'incoming');
  assert.match(preview.note, /관계·동맹·인과의 증거가 아니/);
  assert.equal(traceImpact(records, relations, 'personnel:absent'), null);
  const next = records.map(record => record.key === 'personnel:lead' ? { ...record, hash: 'new' } : record);
  const diff = changedImpact({ schema: 1, records, relations }, next, buildRelations(next));
  assert.equal(diff.entries.length, 1);
  assert.equal(diff.entries[0].status, 'modified');
  assert.equal(diff.toCatalogHash, catalogHash(next));
  assert.equal(changedImpact(null, records, relations), null);
});

test('경로 경계와 나이 범위는 보수적으로 판정한다', () => {
  assert.throws(() => within(ROOT, '../elsewhere'));
  assert.throws(() => within(ROOT, 'C:/Windows/system.ini'));
  assert.deepEqual(ageRange('1980.08.01', 2006), [25, 26]);
  assert.equal(ageRange('연대 미확정', 2006), null);
});

test('근거는 실제 원문 줄과 해시에 묶이고, 바뀐 인용은 거부한다', async () => {
  const snap = await snapshot();
  const ref = evidence(snap, 'WORLD_CANON_LEDGER.md', '가장 강한 자가 가장 신뢰받지 못하는 목격자다.');
  assert.equal(validateEvidence(snap, ref), true);
  assert.equal(validateEvidence(snap, { ...ref, quote: '존재하지 않는 문장' }), false);
  assert.equal(validateEvidence(snap, { ...ref, fileHash: '0'.repeat(64) }), false);
  const input = { schema: 1, fingerprint: snap.reviewFingerprint, findings: [], suggestions: [{
    id: 'example-supported-suggestion', category: 'creative-proposal', title: '시험 제안', explanation: '원문 연결 시험', recommendation: '공개하지 않는다',
    scene: '시험 장면', tradeoff: '정사 미확정', smallestChange: '한 문장', atmosphere: '연무와 광원', evidence: [ref]
  }] };
  assert.equal(validateReview(structuredClone(input), snap).suggestions.length, 1);
  assert.throws(() => validateReview({ ...input, fingerprint: '0'.repeat(64) }, snap));
  assert.throws(() => validateReview({ ...input, suggestions: [{ ...input.suggestions[0], evidence: [{ ...ref, line: ref.line + 1 }] }] }, snap));
});

test('자료 수집 주소는 허용 기관의 HTTPS로 제한하고 외부 리다이렉트를 막는다', async () => {
  const source = { id: 'test', name: '테스트 기관', url: 'https://example.org/index', hosts: ['example.org'] };
  assert.equal(approvedUrl(source.url, source).hostname, 'example.org');
  for (const url of ['http://example.org/index', 'https://example.org.evil.test/', 'https://user@example.org/', 'https://127.0.0.1/']) assert.throws(() => approvedUrl(url, source));
  const found = discover('<title>기관 자료</title><nav><a href="/navigation">Navigation Menu</a></nav><main><a href="/a">Useful report</a><a href="https://elsewhere.test/x">External source</a></main>', source.url, source);
  assert.deepEqual(found.candidates.map(item => item.url), ['https://example.org/a']);
  const redirected = async () => new Response(null, { status: 302, headers: { location: 'https://elsewhere.test/private' } });
  await assert.rejects(() => fetchSource(source, null, redirected), /허용되지 않은/);
  const oversized = async () => new Response('x'.repeat(768001), { status: 200, headers: { 'content-type': 'text/html' } });
  await assert.rejects(() => fetchSource(source, null, oversized), /크기 제한/);
});

test('손상된 백업은 해시 검사에서 탐지하고 원본에 복원하지 않는다', async () => {
  await fs.mkdir(WORK, { recursive: true });
  const work = await fs.mkdtemp(path.join(WORK, 'test-backup-'));
  try {
    const id = '20260928T000000Z-a1b2c3d4';
    const directory = path.join(work, 'backups', id);
    const file = path.join(directory, 'files', 'WORLD_CANON_LEDGER.md');
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, 'altered');
    await fs.writeFile(path.join(directory, 'manifest.json'), JSON.stringify({ schema: 1, id, files: { 'WORLD_CANON_LEDGER.md': { hash: hash('original'), bytes: 8 } }, omitted: [], note: 'test' }));
    const result = await verifyBackup(id, { work });
    assert.equal(result.valid, false);
    assert.deepEqual(result.mismatches, ['WORLD_CANON_LEDGER.md']);
    await fs.writeFile(file, 'restored');
    await fs.writeFile(path.join(directory, 'manifest.json'), JSON.stringify({ schema: 1, id, files: { 'WORLD_CANON_LEDGER.md': { hash: hash('restored'), bytes: 8 } }, omitted: [], note: 'test' }));
    const first = await previewBackup(id, { work });
    const second = await previewBackup(id, { work });
    assert.notEqual(first.path, second.path);
    assert.equal(await fs.readFile(path.join(first.path, 'WORLD_CANON_LEDGER.md'), 'utf8'), 'restored');
    assert.equal(await fs.readFile(path.join(second.path, 'WORLD_CANON_LEDGER.md'), 'utf8'), 'restored');
  } finally {
    const relative = path.relative(WORK, work);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('시험 폴더 경계 오류');
    await fs.rm(work, { recursive: true, force: false });
  }
});

test('검토 화면은 루프백 호스트·출처·CSRF 토큰을 요구한다', async () => {
  const port = 12987;
  const server = createReviewServer({ port });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  try {
    const url = `http://127.0.0.1:${port}`;
    const page = await fetch(url);
    assert.equal(page.status, 200);
    assert.match(page.headers.get('content-security-policy'), /default-src 'none'/);
    assert.match(await page.text(), /제작자 검토함/);
    const badHost = await new Promise((resolve, reject) => {
      const request = http.get({ hostname: '127.0.0.1', port, path: '/api/meta', headers: { Host: 'attacker.example' } }, response => { response.resume(); resolve(response.statusCode); });
      request.once('error', reject);
    });
    assert.equal(badHost, 403);
    const badOrigin = await fetch(url + '/api/feedback', { method: 'POST', headers: { Origin: 'https://attacker.example', 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(badOrigin.status, 403);
  } finally { await new Promise(resolve => server.close(resolve)); }
});

test('영향 미리보기 API는 정확한 기록 키만 열고 없는 키를 대체하지 않는다', async () => {
  await fs.mkdir(WORK, { recursive: true });
  const work = await fs.mkdtemp(path.join(WORK, 'test-impact-'));
  const port = 12988;
  const records = [{ key: 'region:forest', kind: 'region', id: 'forest', title: '검사 숲', text: '검사 숲', hash: 'one', source: null, value: {} }];
  await fs.writeFile(path.join(work, 'catalog.json'), JSON.stringify({ schema: 1, fingerprint: 'test', records, relations: [] }));
  const server = createReviewServer({ port, work });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  try {
    const origin = `http://127.0.0.1:${port}`;
    const known = await fetch(`${origin}/api/impact?key=region%3Aforest`);
    assert.equal(known.status, 200);
    assert.equal((await known.json()).title, '검사 숲');
    const absent = await fetch(`${origin}/api/impact?key=region%3Aabsent`);
    assert.equal(absent.status, 404);
    const latest = await fetch(`${origin}/api/impact-latest`);
    assert.equal((await latest.json()).recent, null);
  } finally {
    await new Promise(resolve => server.close(resolve));
    const relative = path.relative(WORK, work);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('시험 폴더 경계 오류');
    await fs.rm(work, { recursive: true, force: false });
  }
});

test('성공한 두 검사 사이의 기록 변경은 격리된 영향 보고서로 남긴다', async () => {
  await fs.mkdir(WORK, { recursive: true });
  const work = await fs.mkdtemp(path.join(WORK, 'test-audit-impact-'));
  try {
    const snap = await snapshot();
    const records = buildCatalog(snap, loadData(snap).context);
    const previous = structuredClone(records);
    previous[0].hash = '0'.repeat(64);
    await fs.writeFile(path.join(work, 'catalog.json'), JSON.stringify({ schema: 1, fingerprint: 'previous', records: previous, relations: buildRelations(previous) }));
    const report = await audit({ force: true, checks: false, work });
    assert.equal(report.changedRecordCount, 1);
    const impact = JSON.parse(await fs.readFile(path.join(work, 'impact.json'), 'utf8'));
    assert.equal(impact.entries.length, 1);
    assert.equal(impact.entries[0].key, records[0].key);
    assert.equal(impact.toCatalogHash, catalogHash(records));
  } finally {
    const relative = path.relative(WORK, work);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('시험 폴더 경계 오류');
    await fs.rm(work, { recursive: true, force: false });
  }
});
