/**
 * Deploys the static export to Cloudflare Pages using the Pages Direct
 * Upload API.
 *
 * Usage:
 *   node scripts/deploy-pages.mjs <project-name> <out-dir> <token-file>
 *
 * The token file holds a short-lived Pages upload token (JWT) obtained from
 * `GET /accounts/{account_id}/pages/projects/{project_name}/upload-token`.
 * It is read from disk rather than passed on the command line and is never
 * written to any log.
 *
 * The flow mirrors the official Wrangler implementation:
 *   1. hash every file (blake3 of base64(content) + extension, 32 hex chars)
 *   2. ask the API which hashes are missing
 *   3. upload the missing blobs
 *   4. create the deployment with a path -> hash manifest
 */
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { blake3 } from "@noble/hashes/blake3.js";

const API = "https://api.cloudflare.com/client/v4";

const projectName = process.argv[2] ?? "scentora";
const outDir = path.resolve(process.argv[3] ?? path.join(process.cwd(), "out"));
const tokenFile = process.argv[4];
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

if (!tokenFile || !accountId) {
  console.error(
    "Usage: CLOUDFLARE_ACCOUNT_ID=... node scripts/deploy-pages.mjs <project> <outDir> <tokenFile>",
  );
  process.exit(1);
}

const token = (await readFile(tokenFile, "utf8")).trim();

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
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".map": "application/json; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

const IGNORE = new Set(["_worker.js", "_redirects", "_headers", "_routes.json", ".DS_Store"]);

async function walk(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (IGNORE.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full, base)));
    else out.push(path.relative(base, full).split(path.sep).join("/"));
  }
  return out;
}

function hashFile(buffer, extension) {
  const base64 = buffer.toString("base64");
  const digest = blake3(new TextEncoder().encode(base64 + extension));
  return Buffer.from(digest).toString("hex").slice(0, 32);
}

async function api(pathname, init) {
  const res = await fetch(`${API}${pathname}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init.headers ?? {}) },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`${pathname} -> HTTP ${res.status}\n${text.slice(0, 500)}`);
  }
  if (!res.ok || json.success === false) {
    throw new Error(
      `${pathname} -> HTTP ${res.status}: ${JSON.stringify(json.errors ?? json).slice(0, 500)}`,
    );
  }
  return json.result;
}

async function main() {
  const files = await walk(outDir);
  console.log(`Hashing ${files.length} files…`);

  const entries = [];
  for (const file of files) {
    const buffer = await readFile(path.join(outDir, file));
    const extension = path.extname(file).substring(1);
    entries.push({
      file,
      buffer,
      size: buffer.length,
      hash: hashFile(buffer, extension),
      contentType: MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream",
    });
  }

  const hashes = entries.map((entry) => entry.hash);
  let missing = hashes;
  try {
    missing = await api("/pages/assets/check-missing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hashes }),
    });
  } catch (error) {
    console.log(`  (check-missing unavailable: ${error.message.split("\n")[0]})`);
  }
  const missingSet = new Set(missing ?? []);
  const toUpload = entries.filter((entry) => missingSet.size === 0 || missingSet.has(entry.hash));
  console.log(`Uploading ${toUpload.length} of ${entries.length} assets…`);

  // Bucket the uploads so no single request is too large.
  const MAX_BUCKET_BYTES = 20 * 1024 * 1024;
  const MAX_BUCKET_FILES = 100;
  const buckets = [];
  let bucket = [];
  let bytes = 0;
  for (const entry of toUpload) {
    if (bucket.length > 0 && (bytes + entry.size > MAX_BUCKET_BYTES || bucket.length >= MAX_BUCKET_FILES)) {
      buckets.push(bucket);
      bucket = [];
      bytes = 0;
    }
    bucket.push(entry);
    bytes += entry.size;
  }
  if (bucket.length) buckets.push(bucket);

  let done = 0;
  for (const group of buckets) {
    const payload = group.map((entry) => ({
      key: entry.hash,
      value: entry.buffer.toString("base64"),
      metadata: { contentType: entry.contentType },
      base64: true,
    }));
    await api("/pages/assets/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    done += group.length;
    process.stdout.write(`  ${done}/${toUpload.length}\r`);
  }
  console.log(`\nUploaded ${done} assets.`);

  const manifest = {};
  // The Pages asset store is keyed by "/path" -> content hash.
  for (const entry of entries) manifest[`/${entry.file}`] = entry.hash;

  // Register the hashes as recently uploaded so future deployments can reuse them.
  try {
    await api("/pages/assets/upsert-hashes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hashes }),
    });
  } catch (error) {
    console.log(`  (upsert-hashes skipped: ${error.message.split("\n")[0]})`);
  }

  // Save the manifest so the deployment can be created by any client
  // (the Cloudflare MCP tool, for example) using account-level auth.
  const manifestPath = path.join(process.cwd(), "scripts", ".pages-manifest.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 0));
  console.log(`Manifest written to ${manifestPath}`);

  const form = new FormData();
  form.append("branch", "main");
  form.append("commit_message", "Scentora demo storefront — static export");
  form.append("commit_hash", process.env.GIT_COMMIT ?? "manual");
  form.append("commit_dirty", "false");
  form.append("project_name", projectName);
  form.append("manifest", JSON.stringify(manifest));

  const res = await fetch(
    `${API}/accounts/${accountId}/pages/projects/${projectName}/deployments`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    },
  );
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Deployment -> HTTP ${res.status}\n${text.slice(0, 600)}`);
  }
  if (!res.ok || json.success === false) {
    throw new Error(
      `Deployment -> HTTP ${res.status}: ${JSON.stringify(json.errors ?? json).slice(0, 800)}`,
    );
  }

  const result = json.result ?? {};
  console.log("\nDeployment created:");
  console.log(`  id:        ${result.id}`);
  console.log(`  url:       ${result.url}`);
  console.log(`  alias:     ${(result.aliases ?? []).join(", ")}`);
  console.log(`  env:       ${result.environment}`);

  await writeFile(
    path.join(process.cwd(), "scripts", ".last-deploy.json"),
    JSON.stringify(result, null, 2),
  );
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exit(1);
});
