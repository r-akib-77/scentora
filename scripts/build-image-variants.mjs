/**
 * Generates the responsive image variants used by the custom Next.js image
 * loader (`src/lib/image-loader.ts`).
 *
 * For every image in `public/images` a set of widths is written next to the
 * original as `<name>-<width>.jpg`. The loader then serves the closest
 * pre-generated file, so the site never needs a server-side image optimiser
 * and behaves identically in dev, in a Node server and in a static export.
 *
 * Usage: node scripts/build-image-variants.mjs
 */
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMAGES = path.join(ROOT, "public", "images");

/** Widths generated for every photograph. */
export const WIDTHS = [320, 640, 960, 1280, 1920];

/** The widths the loader is allowed to request. */
const ALLOWED = new Set(WIDTHS);

/** Images that should not be resized (icons, logos, the attribution file). */
const SKIP = new Set(["ATTRIBUTION.json"]);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/** Escape a string for safe use inside a RegExp. */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function main() {
  const all = await walk(IMAGES);
  // Only process originals — never a previously generated variant.
  const files = all.filter((f) => {
    if (!/\.jpe?g$/i.test(f)) return false;
    if (SKIP.has(path.basename(f))) return false;
    const match = path.basename(f).match(/-(\d{3,4})\.jpe?g$/i);
    if (match && WIDTHS.includes(Number(match[1]))) return false;
    return true;
  });

  let written = 0;
  for (const file of files) {
    const dir = path.dirname(file);
    const ext = path.extname(file);
    const base = path.basename(file, ext);

    // Remove any previous variants for this file. Only the exact widths we
    // generate are removed, so originals such as "dior-sauvage-2.jpg" are
    // never mistaken for a variant of "dior-sauvage.jpg".
    for (const entry of await readdir(dir)) {
      const match = entry.match(new RegExp(`^${escapeRegExp(base)}-(\\d+)${escapeRegExp(ext)}$`));
      if (match && WIDTHS.includes(Number(match[1]))) {
        await rm(path.join(dir, entry));
      }
    }

    const meta = await sharp(file).metadata();
    const sourceWidth = meta.width ?? 1920;

    for (const width of WIDTHS) {
      if (width > sourceWidth * 1.05) continue;
      const out = path.join(dir, `${base}-${width}${ext}`);
      await sharp(file)
        .resize({ width, withoutEnlargement: true })
        .jpeg({ quality: 79, mozjpeg: true })
        .toFile(out);
      written += 1;
    }
  }

  // A manifest the loader can consult at runtime.
  const manifest = {};
  for (const file of files) {
    const rel = "/" + path.relative(path.join(ROOT, "public"), file).split(path.sep).join("/");
    const dir = path.dirname(file);
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const available = [];
    for (const entry of await readdir(dir)) {
      const match = entry.match(
        new RegExp(`^${escapeRegExp(base)}-(\\d+)${escapeRegExp(ext)}$`),
      );
      if (match && WIDTHS.includes(Number(match[1]))) available.push(Number(match[1]));
    }
    manifest[rel] = available.sort((a, b) => a - b);
  }
  await writeFile(
    path.join(ROOT, "src", "lib", "image-manifest.json"),
    JSON.stringify(manifest, null, 0),
  );

  const total = files.length;
  console.log(`Generated ${written} variants across ${total} original images.`);
}

main();
