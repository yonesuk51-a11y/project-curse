import path from 'node:path';
import { WORK, ROOT, hash, now, readJson, writeAtomic, sleep, withLock } from './core.mjs';

export function approvedUrl(raw, source) {
  const url = new URL(raw);
  if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443') || !source.hosts.includes(url.hostname)) throw new Error('허용되지 않은 출처 주소입니다.');
  return url;
}

const plain = html => html.replace(/<[^>]*>/g, ' ').replace(/&(?:amp|#38);/g, '&').replace(/&(?:quot|#34);/g, '"').replace(/&(?:apos|#39|#x27);/gi, "'").replace(/&(?:nbsp|#160);/g, ' ').replace(/\s+/g, ' ').trim();

export function discover(html, base, source) {
  const title = plain(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] || source.name).slice(0, 240);
  const candidates = [];
  const main = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1] || html;
  for (const match of main.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    try {
      const url = approvedUrl(new URL(match[1], base).href, source);
      url.hash = '';
      const label = plain(match[2]).slice(0, 160);
      if (label.length < 8 || /^(?:skip to|the .* home|home|back to top)/i.test(label) || /privacy|sign in|login|subscribe|contact|cookie/i.test(label) || candidates.some(item => item.url === url.href)) continue;
      candidates.push({ title: label, url: url.href, status: 'discovered-not-reviewed' });
    } catch { /* External and unsafe links are never followed. */ }
    if (candidates.length === 20) break;
  }
  return { title, candidates };
}

export async function fetchSource(source, previous, fetcher = fetch) {
  let url = approvedUrl(source.url, source);
  const headers = { 'User-Agent': 'ProjectCurseResearch/1.0 (read-only personal reference collector)', Accept: 'text/html,application/xhtml+xml,text/plain' };
  if (previous?.etag) headers['If-None-Match'] = previous.etag;
  if (previous?.lastModified) headers['If-Modified-Since'] = previous.lastModified;
  let response;
  for (let redirect = 0; redirect <= 3; redirect++) {
    response = await fetcher(url, { headers, redirect: 'manual', signal: AbortSignal.timeout(15000) });
    if (response.status === 304 && previous) return { ...previous, checkedAt: now(), status: 'unchanged', error: null };
    if (response.status >= 300 && response.status < 400) {
      if (redirect === 3 || !response.headers.get('location')) throw new Error('리다이렉트 한도 또는 주소 오류');
      url = approvedUrl(new URL(response.headers.get('location'), url).href, source);
      await response.body?.cancel();
      continue;
    }
    break;
  }
  if (!response.ok) { await response.body?.cancel(); throw new Error(`HTTP ${response.status}`); }
  if (!/text\/html|application\/xhtml\+xml|text\/plain/i.test(response.headers.get('content-type') || '')) { await response.body?.cancel(); throw new Error('지원하지 않는 자료 형식'); }
  const reader = response.body.getReader();
  const chunks = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 768000) { await reader.cancel(); throw new Error('자료 크기 제한 초과'); }
    chunks.push(value);
  }
  const bytes = Buffer.concat(chunks);
  const found = discover(bytes.toString('utf8'), url, source);
  return { id: source.id, url: source.url, finalUrl: url.href, name: source.name, topics: source.topics, use: source.use, rights: source.rights,
    checkedAt: now(), status: previous?.contentHash === hash(bytes) ? 'unchanged' : 'fetched', contentHash: hash(bytes),
    etag: response.headers.get('etag'), lastModified: response.headers.get('last-modified'), ...found,
    factStatus: 'discovery-only', note: '접근·링크 발견만 확인했습니다. 사실·권리 검토와 창작 적용은 별도입니다.' };
}

export async function collectResearch({ work = WORK, force = false, fetcher = fetch } = {}) {
  return withLock('research', async () => {
    const definitions = await readJson(path.join(ROOT, 'tools/world-editor/sources.json'));
    const previous = await readJson(path.join(work, 'research.json'), { schema: 1, sources: [] });
    if (previous.schema !== 1 || !Array.isArray(previous.sources)) throw new Error('출처 저장소 형식 오류. 덮어쓰지 않습니다.');
    const results = [];
    for (const source of definitions.sources) {
      const last = previous.sources.find(item => item.id === source.id);
      if (!force && last && Date.now() - Date.parse(last.checkedAt) < 86400000) { results.push(last); continue; }
      try { results.push(await fetchSource(source, last, fetcher)); }
      catch (error) { results.push({ ...last, id: source.id, name: source.name, url: source.url, topics: source.topics, rights: source.rights, checkedAt: now(), status: 'failed', error: error.message, note: '이번 접근 실패. 이전 자료가 있어도 최신 확인으로 취급하지 않습니다.' }); }
      await sleep(500);
    }
    const result = { schema: 1, updatedAt: now(), sources: results };
    await writeAtomic('research.json', result, work);
    return result;
  }, work);
}
