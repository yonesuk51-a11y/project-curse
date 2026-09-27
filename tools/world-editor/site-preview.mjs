import http from 'node:http';
import path from 'node:path';
import { promises as fs, createReadStream } from 'node:fs';
import { ROOT, within, noLinks } from './core.mjs';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif', '.woff': 'font/woff', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.mp4': 'video/mp4', '.webm': 'video/webm', '.ico': 'image/x-icon' };
const allowed = relative => relative === 'index.html' || /^(?:assets|share|docs)\/[\w.\-/]+$/.test(relative);

export async function serveSite({ port = 8788 } = {}) {
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('포트 범위 오류');
  const server = http.createServer(async (request, response) => {
    try {
      if (request.method !== 'GET' && request.method !== 'HEAD' || request.headers.host !== `127.0.0.1:${port}`) { response.writeHead(403); response.end(); return; }
      const url = new URL(request.url, `http://127.0.0.1:${port}`);
      let relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      if (!relative || relative.endsWith('/')) relative += 'index.html';
      if (!allowed(relative) || !types[path.extname(relative)]) { response.writeHead(404); response.end(); return; }
      const file = within(ROOT, relative);
      await noLinks(ROOT, file);
      const stat = await fs.stat(file);
      if (!stat.isFile()) throw new Error('파일이 아닙니다.');
      response.writeHead(200, { 'Content-Type': types[path.extname(relative)], 'Content-Length': stat.size, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      if (request.method === 'HEAD') response.end(); else createReadStream(file).pipe(response);
    } catch { response.writeHead(404); response.end(); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  console.log(`읽기 전용 사이트 미리보기: http://127.0.0.1:${port}/`);
  return server;
}
