import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from './build.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root,'dist');
const base = '/' + (process.env.SITE_BASE ?? 'LuixArcade').replace(/^\/+|\/+$/g,'') + '/';
const port = Number(process.env.PORT || 4173);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.avif':'image/avif'};

await build();
const server = http.createServer(async (req,res)=>{
  const requestUrl = new URL(req.url || '/', 'http://localhost');
  if (requestUrl.pathname === '/') {res.writeHead(302,{Location:base});res.end();return;}
  try {
    const pathname = decodeURIComponent(requestUrl.pathname);
    if (!pathname.startsWith(base) || pathname.includes('\0')) throw new Error('Not found');
    let relative = pathname.slice(base.length);
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    const absolute = path.resolve(dir,relative);
    if (absolute !== dir && !absolute.startsWith(dir + path.sep)) throw new Error('Not found');
    const info = await stat(absolute);
    if (!info.isFile()) throw new Error('Not found');
    res.writeHead(200,{'Content-Type':mime[path.extname(absolute)] || 'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});
    res.end(await readFile(absolute));
  } catch {
    res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
    res.end(await readFile(path.join(dir,'404.html')));
  }
});
server.listen(port,()=>console.log('Luix Arcade → http://localhost:'+port+base));
