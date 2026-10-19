/**
 * Verification utility: checks that every image referenced by the catalogue
 * actually exists in `public/`, and that no referenced route is missing.
 *
 * Usage: node scripts/verify-assets.mjs
 */
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");

const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else files.push(full);
  }
}
await walk(PUBLIC);

const referenced = new Set();

// Products + galleries
const productsSrc = await readFile(path.join(ROOT, "src/data/products.ts"), "utf8");
for (const match of productsSrc.matchAll(/\/images\/[a-z0-9\-/.]+\.jpg/gi)) {
  referenced.add(match[0]);
}

// Bundles + categories
const bundlesSrc = await readFile(path.join(ROOT, "src/data/bundles.ts"), "utf8");
for (const match of bundlesSrc.matchAll(/\/images\/[a-z0-9\-/.]+\.jpg/gi)) {
  referenced.add(match[0]);
}

// Hero + any other hard-coded path
for (const file of ["src/app/page.tsx", "src/app/about/page.tsx", "src/components/home/hero-section.tsx"]) {
  const src = await readFile(path.join(ROOT, file), "utf8");
  for (const match of src.matchAll(/\/images\/[a-z0-9\-/.]+\.jpg/gi)) {
    referenced.add(match[0]);
  }
}

let missing = 0;
for (const ref of referenced) {
  const onDisk = path.join(PUBLIC, ref.replace(/^\//, ""));
  try {
    await stat(onDisk);
  } catch {
    console.log(`MISSING  ${ref}`);
    missing += 1;
  }
}

const orphanImages = files.filter(
  (f) => f.endsWith(".jpg") && !referenced.has("/" + path.relative(PUBLIC, f).split(path.sep).join("/")),
);

console.log(`\n${referenced.size} images referenced, ${missing} missing.`);
if (orphanImages.length) {
  console.log(`\n${orphanImages.length} image(s) on disk but not referenced:`);
  orphanImages.forEach((f) => console.log(`  ${path.relative(PUBLIC, f)}`));
}

if (missing > 0) process.exitCode = 1;
else console.log("All referenced images exist.");
