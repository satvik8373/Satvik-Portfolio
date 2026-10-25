import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv.includes('--dist') ? path.join(import.meta.dirname,'dist') : import.meta.dirname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.gif': 'image/gif', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.ico': 'image/x-icon' };
const port = Number(process.env.PORT || 5260);
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  const file = path.resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  let target = file;
  try { if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html'); } catch { if (!path.extname(target)) target = path.join(target, 'index.html'); }
  fs.stat(target, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found'); return; }
    const headers = { 'Content-Type': types[path.extname(target).toLowerCase()] || 'application/octet-stream', 'Cache-Control': target.includes(path.sep + 'assets' + path.sep) ? 'public, max-age=86400' : 'no-cache', 'Accept-Ranges': 'bytes' };
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]); const end = Math.min(range[2] ? Number(range[2]) : stat.size - 1, stat.size - 1);
      if (start > end || start >= stat.size) { res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }).end(); return; }
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end - start + 1 });
      if (req.method === 'HEAD') res.end(); else fs.createReadStream(target, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { ...headers, 'Content-Length': stat.size });
      if (req.method === 'HEAD') res.end(); else fs.createReadStream(target).pipe(res);
    }
  });
}).listen(port, '0.0.0.0', () => console.log(`Two26 local reproduction: http://localhost:${port}`));
