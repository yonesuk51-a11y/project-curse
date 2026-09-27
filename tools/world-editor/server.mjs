import http from 'node:http';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { WORK, ROOT, readJson, noLinks } from './core.mjs';
import { audit, feedback, setDecision, decorate } from './engine.mjs';
import { collectResearch } from './research.mjs';
import { searchCatalog } from './catalog.mjs';
import { createBackup, verifyBackup } from './backup.mjs';
import { stopWatch } from './watch.mjs';

const assets = { '/': ['ui/index.html', 'text/html; charset=utf-8'], '/style.css': ['ui/style.css', 'text/css; charset=utf-8'], '/app.js': ['ui/app.js', 'text/javascript; charset=utf-8'] };
const policy = "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

function json(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': policy });
  response.end(JSON.stringify(body));
}

async function bodyJson(request) {
  if (!/^application\/json(?:;|$)/i.test(request.headers['content-type'] || '')) throw new Error('JSON 요청만 허용합니다.');
  let size = 0;
  const parts = [];
  for await (const part of request) {
    size += part.length;
    if (size > 20000) throw new Error('입력 크기 제한 초과');
    parts.push(part);
  }
  return JSON.parse(Buffer.concat(parts).toString('utf8'));
}

export function createReviewServer({ port = 8787, work = WORK } = {}) {
  const token = randomBytes(24).toString('hex');
  const origin = `http://127.0.0.1:${port}`;
  return http.createServer(async (request, response) => {
    try {
      if (request.headers.host !== `127.0.0.1:${port}`) { json(response, 403, { error: '로컬 주소로만 접속할 수 있습니다.' }); return; }
      const url = new URL(request.url, origin);
      if (url.origin !== origin) { json(response, 403, { error: '로컬 요청만 허용합니다.' }); return; }
      if (request.method === 'GET' && assets[url.pathname]) {
        const [relative, type] = assets[url.pathname];
        const file = path.join(ROOT, 'tools/world-editor', relative);
        await noLinks(ROOT, file);
        response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': policy });
        response.end(await fs.readFile(file));
        return;
      }
      if (request.method === 'GET' && url.pathname === '/api/meta') { json(response, 200, { token, version: 1 }); return; }
      if (request.method === 'GET' && url.pathname === '/api/status') {
        const [report, state, research, worker] = await Promise.all([readJson(path.join(work, 'latest.json'), null), feedback(work), readJson(path.join(work, 'research.json'), null), readJson(path.join(work, 'worker-state.json'), null)]);
        json(response, 200, { report: report ? { createdAt: report.createdAt, branch: report.git.branch, fingerprint: report.fingerprint, recordCount: report.recordCount, findings: report.findings.length, suggestions: report.suggestions.length, checks: report.checks.map(item => ({ command: item.command, status: item.status })), limits: report.limits } : null, feedback: { revision: state.revision, counts: Object.values(state.decisions).reduce((all, item) => (all[item.status] = (all[item.status] || 0) + 1, all), {}) }, research: research ? { updatedAt: research.updatedAt, sources: research.sources.map(item => ({ id: item.id, status: item.status, error: item.error })) } : null, worker });
        return;
      }
      if (request.method === 'GET' && url.pathname === '/api/review') {
        const [report, state] = await Promise.all([readJson(path.join(work, 'latest.json'), null), feedback(work)]);
        json(response, 200, report ? { createdAt: report.createdAt, revision: state.revision, findings: decorate(report.findings, state), suggestions: decorate(report.suggestions, state), opportunities: report.opportunities, staleReviewBatches: report.staleReviewBatches } : { createdAt: null, revision: state.revision, findings: [], suggestions: [], opportunities: [] });
        return;
      }
      if (request.method === 'GET' && url.pathname === '/api/research') { json(response, 200, await readJson(path.join(work, 'research.json'), { schema: 1, sources: [] })); return; }
      if (request.method === 'GET' && url.pathname === '/api/search') {
        const query = url.searchParams.get('q') || '';
        if (query.length > 100) throw new Error('검색어가 너무 깁니다.');
        const catalog = await readJson(path.join(work, 'catalog.json'), null);
        json(response, 200, { query, fingerprint: catalog?.fingerprint || null, results: catalog ? searchCatalog(catalog.records, query) : [] });
        return;
      }
      if (request.method !== 'POST') { json(response, 404, { error: '요청을 찾지 못했습니다.' }); return; }
      if (request.headers.origin !== origin || request.headers['x-pc-token'] !== token) { json(response, 403, { error: '검토 화면에서 보낸 요청만 허용합니다.' }); return; }
      const input = await bodyJson(request);
      if (url.pathname === '/api/audit') {
        const report = await audit({ force: true, checks: true, work });
        json(response, 200, { createdAt: report.createdAt, findings: report.findings.length, checks: report.checks.map(item => ({ command: item.command, status: item.status })) });
      } else if (url.pathname === '/api/research-run') {
        const result = await collectResearch({ work, force: Boolean(input.force) });
        json(response, 200, { updatedAt: result.updatedAt, sources: result.sources.map(item => ({ id: item.id, status: item.status, error: item.error || null })) });
      } else if (url.pathname === '/api/feedback') {
        const state = await setDecision({ id: input.id, status: input.status, reason: input.reason || '', revision: input.revision }, work);
        json(response, 200, { revision: state.revision, decision: state.decisions[input.id] });
      } else if (url.pathname === '/api/stop-worker') {
        json(response, 200, await stopWatch(work));
      } else if (url.pathname === '/api/backup') {
        const result = await createBackup({ work });
        json(response, 200, { ...result, verification: await verifyBackup(result.id, { work }) });
      } else json(response, 404, { error: '요청을 찾지 못했습니다.' });
    } catch (error) {
      json(response, /입력|형식|없|크기|버전|경로|제한|필요/.test(error.message) ? 400 : 500, { error: error.message });
    }
  });
}

export async function serve({ port = 8787, work = WORK } = {}) {
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('포트 범위 오류');
  const server = createReviewServer({ port, work });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  console.log(`Project Curse 제작자 검토함: http://127.0.0.1:${port}\n로컬 PC 전용. 종료: Ctrl+C`);
  return server;
}
