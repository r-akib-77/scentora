/**
 * A tiny static file server used to preview the exported site exactly the
 * way a static host (Cloudflare Pages, Netlify, nginx) would serve it.
 *
 * Usage: node scripts/serve-static.mjs [port] [dir]
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const PORT = Number(process.argv[2] ?? 3200);
const ROOT = path.resolve(process.argv[3] ?? path.join(process.cwd(), "out"));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".map": "application/json",
};

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const candidates = [
    path.join(ROOT, clean),
    path.join(ROOT, clean, "index.html"),
    path.join(ROOT, `${clean}.html`),
    path.join(ROOT, clean.replace(/\/$/, ""), "index.html"),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

const server = http.createServer((req, res) => {
  const file = resolveFile(req.url ?? "/");
  if (!file) {
    const notFound = path.join(ROOT, "404.html");
    if (existsSync(notFound)) {
      res.writeHead(404, { "Content-Type": MIME[".html"] });
      createReadStream(notFound).pipe(res);
      return;
    }
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
    return;
  }
  const type = MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream";
  const immutable = file.includes(`${path.sep}_next${path.sep}`) || file.includes(`${path.sep}images${path.sep}`);
  res.writeHead(200, {
    "Content-Type": type,
    "Cache-Control": immutable ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate",
  });
  createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Serving ${ROOT} on http://localhost:${PORT}`);
});
