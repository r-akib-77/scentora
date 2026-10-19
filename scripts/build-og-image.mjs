/**
 * Development utility: renders the Open Graph share image for the storefront.
 *
 * Composites a product photograph with a branded typographic panel and writes
 * `public/og.jpg` (1200x630). The site references it from the root layout's
 * Open Graph metadata, so links to the demo render with a proper preview card
 * on LinkedIn, X, Slack and WhatsApp.
 *
 * Usage: node scripts/build-og-image.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PHOTO = path.join(ROOT, "public", "images", "products", "dior-sauvage-960.jpg");
const OUT = path.join(ROOT, "public", "og.jpg");

const W = 1200;
const H = 630;
const SPLIT = 640;

/** Colours mirror the default palette in src/config/site.ts. */
const COLORS = {
  ivory: "#FBF7F1",
  paper: "#F4EEE4",
  charcoal: "#1F1B16",
  muted: "#6E6558",
  gold: "#A8874F",
  line: "#E4DACB",
};

function overlay() {
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blend" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stop-color="${COLORS.charcoal}" stop-opacity="1"/>
        <stop offset="78%"  stop-color="${COLORS.charcoal}" stop-opacity="1"/>
        <stop offset="100%" stop-color="${COLORS.charcoal}" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="${COLORS.charcoal}" stop-opacity="0.32"/>
        <stop offset="45%"  stop-color="${COLORS.charcoal}" stop-opacity="0"/>
        <stop offset="100%" stop-color="${COLORS.charcoal}" stop-opacity="0.42"/>
      </linearGradient>
    </defs>

    <rect x="${SPLIT - 150}" y="0" width="150" height="${H}" fill="url(#blend)"/>
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#vignette)"/>

    <g transform="translate(72,70)">
      <rect x="0" y="0" width="42" height="42" fill="none" stroke="${COLORS.gold}" stroke-width="1.6"/>
      <g transform="translate(11,9)" fill="none" stroke="${COLORS.gold}" stroke-width="1.4" stroke-linejoin="round">
        <path d="M3 1h14v5l3 4v16a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V10l3-4V1Z"/>
        <path d="M0 14h20"/>
      </g>
      <text x="60" y="25" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="${COLORS.ivory}">Scentora</text>
      <text x="60" y="43" font-family="Helvetica, Arial, sans-serif" font-size="9.5" letter-spacing="4.2" fill="${COLORS.gold}">FRAGRANCE, CONSIDERED</text>
    </g>

    <text x="72" y="264" font-family="Helvetica, Arial, sans-serif" font-size="12" letter-spacing="4.6" fill="${COLORS.gold}">THE SIGNATURE EDIT</text>
    <text x="72" y="340" font-family="Georgia, 'Times New Roman', serif" font-size="66" fill="${COLORS.ivory}">Discover Your</text>
    <text x="72" y="412" font-family="Georgia, 'Times New Roman', serif" font-size="66" font-style="italic" fill="${COLORS.gold}">Signature Scent</text>
    <text x="72" y="466" font-family="Helvetica, Arial, sans-serif" font-size="16" fill="${COLORS.ivory}" opacity="0.78">Designer, niche and everyday fragrances — decanted from 3 ml.</text>

    <line x1="72" y1="510" x2="540" y2="510" stroke="${COLORS.line}" stroke-width="1" opacity="0.35"/>
    <text x="72" y="546" font-family="Helvetica, Arial, sans-serif" font-size="11.5" letter-spacing="2.4" fill="${COLORS.ivory}" opacity="0.62">34 FRAGRANCES · 25 HOUSES · 5 CURATED SETS</text>
    <text x="72" y="582" font-family="Helvetica, Arial, sans-serif" font-size="12" letter-spacing="2.4" fill="${COLORS.gold}">scentora.pages.dev</text>
  </svg>`;
}

async function main() {
  await mkdir(path.join(ROOT, "public"), { recursive: true });

  // Right-hand photo panel.
  const photo = await sharp(PHOTO)
    .resize(SPLIT, H, { fit: "cover", position: "centre" })
    .jpeg({ quality: 90 })
    .toBuffer();

  // Left-hand dark panel.
  const panel = await sharp({
    create: {
      width: SPLIT,
      height: H,
      channels: 3,
      background: { r: 0x1f, g: 0x1b, b: 0x16 },
    },
  })
    .jpeg({ quality: 92 })
    .toBuffer();

  const overlayPng = await sharp(Buffer.from(overlay())).png().toBuffer();

  await sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: { r: 0x1f, g: 0x1b, b: 0x16 },
    },
  })
    .composite([
      { input: photo, left: SPLIT, top: 0 },
      { input: panel, left: 0, top: 0 },
      { input: overlayPng, left: 0, top: 0 },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(OUT);

  console.log(`OG image written to ${OUT}`);
}

main();
