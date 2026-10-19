/**
 * Development utility: downloads the Pexels photo ids collected in
 * `scripts/pexels-ids.txt` into `public/images/pool` for visual curation.
 *
 * Not part of the runtime application.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "images", "pool");
const IDS_FILE = path.join(process.cwd(), "scripts", "pexels-ids.txt");
const MANIFEST = path.join(process.cwd(), "scripts", "pool-manifest.json");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const raw = await readFile(IDS_FILE, "utf8");
  const ids = raw
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter(Boolean);

  const saved = [];
  let index = 0;

  for (const id of ids) {
    index += 1;
    const name = `px-${String(index).padStart(3, "0")}.jpg`;
    const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`;
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
      if (!res.ok) {
        console.warn(`  ! ${id} -> ${res.status}`);
        continue;
      }
      const type = res.headers.get("content-type") ?? "";
      if (!type.startsWith("image/")) {
        console.warn(`  ! ${id} -> ${type}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 20_000) continue;
      await writeFile(path.join(OUT_DIR, name), buf);
      saved.push({ file: `/images/pool/${name}`, pexelsId: id, source: "pexels" });
      console.log(`  + ${name} (${id})`);
    } catch (err) {
      console.warn(`  ! ${id} -> ${err.message}`);
    }
    await sleep(120);
  }

  await writeFile(MANIFEST, JSON.stringify(saved, null, 2));
  console.log(`\nSaved ${saved.length} images.`);
}

main();
