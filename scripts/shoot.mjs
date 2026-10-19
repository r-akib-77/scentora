/**
 * Development utility: captures screenshots of the running site so the
 * layout can be reviewed at several viewport widths.
 *
 * Usage: node scripts/shoot.mjs <baseUrl> [outDir]
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = process.argv[3] ?? path.join(process.cwd(), "scripts", "shots");

const PAGES = [
  { name: "home", path: "/", full: true },
  { name: "shop", path: "/shop", full: true },
  { name: "product", path: "/product/dior-sauvage", full: true },
  { name: "brands", path: "/brands", full: true },
  { name: "combos", path: "/combos", full: true },
  { name: "guide", path: "/fragrance-guide", full: true },
  { name: "about", path: "/about", full: true },
  { name: "contact", path: "/contact", full: true },
  { name: "shipping", path: "/shipping", full: true },
  { name: "notfound", path: "/does-not-exist", full: false },
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"],
  });

  const only = process.env.ONLY ? process.env.ONLY.split(",") : null;
  const viewports = process.env.VIEWPORTS
    ? VIEWPORTS.filter((v) => process.env.VIEWPORTS.split(",").includes(v.name))
    : VIEWPORTS;
  const pages = only ? PAGES.filter((p) => only.includes(p.name)) : PAGES;

  for (const viewport of viewports) {
    const page = await browser.newPage();
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
    });

    for (const target of pages) {
      const url = `${BASE}${target.path}`;
      try {
        await page.goto(url, { waitUntil: "load", timeout: 90000 });
        await page.evaluate(() =>
          Promise.all(
            Array.from(document.images)
              .filter((img) => !img.complete)
              .map(
                (img) =>
                  new Promise((resolve) => {
                    img.addEventListener("load", resolve, { once: true });
                    img.addEventListener("error", resolve, { once: true });
                    setTimeout(resolve, 8000);
                  }),
              ),
          ),
        );
      } catch (err) {
        console.warn(`  ! ${url} -> ${err.message}`);
        continue;
      }
      // Let entrance animations settle.
      await new Promise((r) => setTimeout(r, 1200));
      if (target.full) {
        await page.evaluate(async () => {
          const step = Math.round(window.innerHeight * 0.7);
          const max = document.body.scrollHeight;
          for (let y = 0; y <= max; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 220));
          }
          window.scrollTo(0, max);
          await new Promise((r) => setTimeout(r, 700));
          window.scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 300));
        });
        await new Promise((r) => setTimeout(r, 1200));
      }
      const file = path.join(OUT, `${target.name}-${viewport.name}.jpg`);
      await page.screenshot({ path: file, fullPage: target.full, type: "jpeg", quality: 72 });
      console.log(`  -> ${file}`);
    }
    await page.close();
  }

  await browser.close();
  console.log("Done.");
}

main();
