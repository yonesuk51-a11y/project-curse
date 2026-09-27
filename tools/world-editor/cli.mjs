#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, WORK, readJson, within, noLinks } from './core.mjs';
import { audit, feedback, importReview, setDecision } from './engine.mjs';
import { collectResearch } from './research.mjs';
import { searchCatalog } from './catalog.mjs';
import { createBackup, verifyBackup, previewBackup } from './backup.mjs';
import { watch, stopWatch } from './watch.mjs';
import { serve } from './server.mjs';
import { serveSite } from './site-preview.mjs';

const help = `Project Curse 제작자용 로컬 도구

  node tools/world-editor/cli.mjs audit [--force] [--no-checks]
  node tools/world-editor/cli.mjs research [--force]
  node tools/world-editor/cli.mjs status
  node tools/world-editor/cli.mjs search <검색어>
  node tools/world-editor/cli.mjs review import <저장소 안 JSON 경로>
  node tools/world-editor/cli.mjs feedback <항목 ID> <selected|deferred|rejected|resolved|pending> [사유]
  node tools/world-editor/cli.mjs backup create|verify <백업 ID>|preview <백업 ID>
  node tools/world-editor/cli.mjs watch [--interval=초]|stop
  node tools/world-editor/cli.mjs serve [--port=8787]
  node tools/world-editor/cli.mjs preview [--port=8788]

모든 결과는 공개 사이트가 아닌 output/world-editor/에 저장됩니다.
검토 선택은 정사 확정·그림 채택·게시 승인이 아닙니다.`;

function flagNumber(args, name, fallback, min, max) {
  const item = args.find(value => value.startsWith(`--${name}=`));
  if (!item) return fallback;
  const value = Number(item.slice(name.length + 3));
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name}은 ${min}~${max} 정수여야 합니다.`);
  return value;
}

export async function main(args = process.argv.slice(2)) {
  const [command, ...rest] = args;
  if (!command || command === 'help' || command === '--help') { console.log(help); return; }
  if (command === 'audit') {
    const report = await audit({ force: rest.includes('--force'), checks: !rest.includes('--no-checks') });
    console.log(JSON.stringify({ createdAt: report.createdAt, cached: Boolean(report.cached), fingerprint: report.fingerprint, recordCount: report.recordCount, findings: report.findings.length, suggestions: report.suggestions.length, checks: report.checks.map(item => ({ command: item.command, status: item.status })), report: 'output/world-editor/latest.md' }, null, 2));
    if (report.checks.some(item => item.status !== 'passed')) process.exitCode = 2;
    return;
  }
  if (command === 'research') {
    const result = await collectResearch({ force: rest.includes('--force') });
    console.log(JSON.stringify({ updatedAt: result.updatedAt, sources: result.sources.map(item => ({ id: item.id, status: item.status, candidates: item.candidates?.length || 0, error: item.error || null })), report: 'output/world-editor/research.json' }, null, 2));
    if (result.sources.every(item => item.status === 'failed')) process.exitCode = 2;
    return;
  }
  if (command === 'status') {
    const [report, state, research] = await Promise.all([readJson(path.join(WORK, 'latest.json'), null), feedback(), readJson(path.join(WORK, 'research.json'), null)]);
    console.log(JSON.stringify({ report: report ? { createdAt: report.createdAt, fingerprint: report.fingerprint, findings: report.findings.length, suggestions: report.suggestions.length, checks: report.checks.map(item => item.status) } : null, feedback: { revision: state.revision, decisions: Object.values(state.decisions).reduce((out, item) => (out[item.status] = (out[item.status] || 0) + 1, out), {}) }, research: research ? { updatedAt: research.updatedAt, fetched: research.sources.filter(item => item.status === 'fetched').length, failed: research.sources.filter(item => item.status === 'failed').length } : null }, null, 2));
    return;
  }
  if (command === 'search') {
    const query = rest.join(' ').trim();
    if (!query) throw new Error('검색어가 필요합니다.');
    const report = await audit({ checks: false });
    const catalog = await readJson(path.join(WORK, 'catalog.json'));
    if (catalog.fingerprint !== report.fingerprint) throw new Error('목록과 보고서의 입력 버전이 다릅니다.');
    console.log(JSON.stringify(searchCatalog(catalog.records, query), null, 2));
    return;
  }
  if (command === 'review' && rest[0] === 'import') {
    if (!rest[1]) throw new Error('저장소 안 JSON 경로가 필요합니다.');
    const file = within(ROOT, rest[1]);
    await noLinks(ROOT, file);
    const result = await importReview(await readJson(file));
    await audit({ force: true, checks: false });
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  if (command === 'feedback') {
    const [id, status, ...words] = rest;
    const state = await feedback();
    const result = await setDecision({ id, status, reason: words.join(' '), revision: state.revision });
    console.log(JSON.stringify({ revision: result.revision, decision: result.decisions[id] }, null, 2));
    return;
  }
  if (command === 'backup') {
    if (rest[0] === 'create') console.log(JSON.stringify(await createBackup(), null, 2));
    else if (rest[0] === 'verify') console.log(JSON.stringify(await verifyBackup(rest[1]), null, 2));
    else if (rest[0] === 'preview') console.log(JSON.stringify(await previewBackup(rest[1]), null, 2));
    else throw new Error('backup create|verify <ID>|preview <ID> 중 하나를 선택하세요.');
    return;
  }
  if (command === 'watch') { if (rest[0] === 'stop') console.log(JSON.stringify(await stopWatch(), null, 2)); else await watch({ intervalMs: flagNumber(rest, 'interval', 60, 15, 3600) * 1000 }); return; }
  if (command === 'serve') { await serve({ port: flagNumber(rest, 'port', 8787, 1024, 65535) }); return; }
  if (command === 'preview') { await serveSite({ port: flagNumber(rest, 'port', 8788, 1024, 65535) }); return; }
  throw new Error(`알 수 없는 명령입니다.\n\n${help}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(`실행 중단: ${error.message}`); process.exitCode = 1; });
}
