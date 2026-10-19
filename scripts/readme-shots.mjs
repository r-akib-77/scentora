/**
 * Development utility: captures the screenshots used in the project README.
 *
 * Usage: node scripts/readme-shots.mjs [baseUrl]
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2] ?? "https://scentora.pages.dev";
const OUT = path.join(process.cwd(), "docs");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const SHOTS = [
  { name: "home-hero", url: "/", width: 1440, height: 900, scroll: 0 },
  { name: "home-categories", url: "/", width: 1440, height: 900, anchor: "Shop by Category" },
  { name: "home-featured", url: "/", width: 1440, height: 900, anchor: "Featured Fragrances" },
  { name: "home-bestsellers", url: "/", width: 1440, height: 900, anchor: "Bestsellers" },
  { name: "home-bundles", url: "/", width: 1440, height: 900, anchor: "Better Together" },
  { name: "home-finder", url: "/", width: 1440, height: 900, anchor: "Not Sure Where to Start?" },
  { name: "home-brands", url: "/", width: 1440, height: 900, anchor: "The Houses We Carry" },
  { name: "home-testimonials", url: "/", width: 1440, height: 900, anchor: "Sample Testimonials" },
  { name: "shop", url: "/shop/", width: 1440, height: 980, scroll: 320 },
  { name: "product", url: "/product/dior-sauvage/", width: 1440, height: 980, scroll: 60 },
  { name: "brands", url: "/brands/", width: 1440, height: 900, scroll: 320 },
  { name: "combos", url: "/combos/", width: 1440, height: 900, scroll: 260 },
  { name: "finder", url: "/fragrance-guide/", width: 1440, height: 980, anchor: "Five questions, six matches" },
  { name: "about", url: "/about/", width: 1440, height: 900, scroll: 200 },
  { name: "mobile-home", url: "/", width: 390, height: 844, scroll: 0, mobile: true },
  { name: "mobile-shop", url: "/shop/", width: 390, height: 844, scroll: 300, mobile: true },
  { name: "mobile-product", url: "/product/creed-aventus/", width: 390, height: 844, scroll: 420, mobile: true },
  { name: "mobile-finder", url: "/fragrance-guide/", width: 390, height: 844, anchor: "Five questions, six matches", mobile: true },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"],
  });

  for (const shot of SHOTS) {
    const page = await browser.newPage();
    await page.setViewport({
      width: shot.width,
      height: shot.height,
      deviceScaleFactor: 2,
      isMobile: Boolean(shot.mobile),
      hasTouch: Boolean(shot.mobile),
    });
    await page.goto(`${BASE}${shot.url}`, { waitUntil: "load", timeout: 90000 });
    await wait(1500);
    if (shot.anchor) {
      await page.evaluate((text) => {
        const nodes = Array.from(document.querySelectorAll("h1, h2, h3, p"));
        const target = nodes.find((node) =>
          (node.textContent ?? "").trim().startsWith(text),
        );
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo(0, Math.max(0, top));
        }
      }, shot.anchor);
      await wait(1400);
    } else if (shot.scroll) {
      await page.evaluate((y) => window.scrollTo(0, y), shot.scroll);
      await wait(1300);
    }
    const file = path.join(OUT, `${shot.name}.jpg`);
    await page.screenshot({ path: file, type: "jpeg", quality: 82 });
    console.log(`  ${shot.name}.jpg`);
    await page.close();
  }

  await browser.close();
  console.log(`\nScreenshots written to ${OUT}`);
}

main();
