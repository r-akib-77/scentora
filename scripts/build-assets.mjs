/**
 * Development utility: copies the curated pool images into their final
 * locations inside `public/` and re-encodes them at sensible web sizes.
 *
 * Not part of the runtime application.
 */
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const POOL = path.join(ROOT, "public", "images", "pool");
const PRODUCTS = path.join(ROOT, "public", "images", "products");
const CATEGORIES = path.join(ROOT, "public", "images", "categories");
const BUNDLES = path.join(ROOT, "public", "images", "bundles");
const HERO = path.join(ROOT, "public", "images", "hero");

/** slug -> pool file (without extension) */
const PRODUCT_MAP = {
  "dior-sauvage": "px-053",
  "dior-sauvage-2": "px-026",
  "bleu-de-chanel": "px-054",
  "bleu-de-chanel-2": "px-041",
  "versace-eros": "px-079",
  "ysl-y": "px-093",
  "afnan-9pm": "px-045",
  "lattafa-khamrah": "px-003",
  "rasasi-hawas": "px-007",
  "creed-aventus": "px-066",
  "creed-aventus-2": "px-090",
  "tom-ford-noir-extreme": "px-059",
  "baccarat-rouge-540": "px-057",
  "baccarat-rouge-540-2": "px-076",
  "versace-dylan-blue": "px-085",
  "ysl-black-opium": "px-052",
  "dior-jadore": "px-104",
  "chanel-coco-mademoiselle": "px-081",
  "gucci-eco": "px-035",
  "valentino-eros": "px-040",
  "prada-paradoxe": "px-012",
  "armani-acqua-di-gio": "px-047",
  "armani-code": "px-071",
  "carolina-herrera-good-girl": "px-114",
  "montblanc-explorer": "px-024",
  "jo-malone-lime-basel-neroli": "px-073",
  "byredo-baltea": "px-120",
  "le-labo-santal-33": "px-099",
  "al-haramain-ambre-oud": "px-117",
  "swiss-arabian-shaghaf-oud": "px-110",
  "davidoff-cool-water": "px-098",
  "hugo-boss-bottled": "px-089",
  "lattafa-ramis": "px-031",
  "afnan-bleeding-roses": "px-065",
  "rasasi-la-vie": "px-064",
  "ysl-libre": "px-033",
  "narciso-rodriguez-for-her": "px-108",
  "midnight-oud": "px-109",
  "midnight-oud-2": "px-112",
};

/** Extra pool images that are only used by categories / bundles / hero. */
const SUPPORT_MAP = {
  categories: {
    men: "px-095",
    women: "px-116",
    unisex: "px-049",
    luxury: "px-037",
    fresh: "px-105",
    woody: "px-118",
  },
  bundles: {
    "everyday-collection": "px-027",
    "office-essentials": "px-087",
    "luxury-discovery-set": "px-111",
    "date-night-collection": "px-029",
    "fresh-fragrance-set": "px-072",
  },
  hero: { hero: "px-006" },
};

async function optimise(src, dest, width) {
  await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(dest);
}

async function main() {
  await mkdir(PRODUCTS, { recursive: true });
  await mkdir(CATEGORIES, { recursive: true });
  await mkdir(BUNDLES, { recursive: true });
  await mkdir(HERO, { recursive: true });

  for (const [slug, poolFile] of Object.entries(PRODUCT_MAP)) {
    const src = path.join(POOL, `${poolFile}.jpg`);
    const dest = path.join(PRODUCTS, `${slug}.jpg`);
    try {
      await optimise(src, dest, 1100);
    } catch (err) {
      console.warn(`  ! product ${slug} <- ${poolFile}: ${err.message}`);
    }
  }

  for (const [name, poolFile] of Object.entries(SUPPORT_MAP.categories)) {
    await optimise(path.join(POOL, `${poolFile}.jpg`), path.join(CATEGORIES, `${name}.jpg`), 1100);
  }

  for (const [name, poolFile] of Object.entries(SUPPORT_MAP.bundles)) {
    await optimise(path.join(POOL, `${poolFile}.jpg`), path.join(BUNDLES, `${name}.jpg`), 1100);
  }

  for (const [name, poolFile] of Object.entries(SUPPORT_MAP.hero)) {
    await optimise(path.join(POOL, `${poolFile}.jpg`), path.join(HERO, `${name}.jpg`), 1800);
  }

  // Keep an attribution record for the Pexels imagery used in this demo.
  const manifest = JSON.parse(
    await readFile(path.join(ROOT, "scripts", "pool-manifest.json"), "utf8"),
  );
  const byFile = new Map(manifest.map((entry) => [entry.file.split("/").pop(), entry]));
  const used = new Set([
    ...Object.values(PRODUCT_MAP),
    ...Object.values(SUPPORT_MAP.categories),
    ...Object.values(SUPPORT_MAP.bundles),
    ...Object.values(SUPPORT_MAP.hero),
  ]);
  const attribution = Array.from(used)
    .map((file) => byFile.get(`${file}.jpg`))
    .filter(Boolean)
    .map((entry) => ({
      pexelsId: entry.pexelsId,
      source: "https://www.pexels.com/photo/" + entry.pexelsId,
    }));
  await writeFile(
    path.join(ROOT, "public", "images", "ATTRIBUTION.json"),
    JSON.stringify(attribution, null, 2),
  );

  console.log("Assets written.");
}

main();
