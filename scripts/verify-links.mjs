/**
 * Verification utility: crawls the running site and checks that every
 * internal link and navigation target resolves.
 *
 * Usage: node scripts/verify-links.mjs [baseUrl]
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2] ?? "http://localhost:3100";

const routes = [
  "/",
  "/shop",
  "/brands",
  "/combos",
  "/fragrance-guide",
  "/about",
  "/contact",
  "/privacy",
  "/shipping",
  "/returns",
  "/product/dior-sauvage",
  "/product/creed-aventus",
  "/product/midnight-oud",
];

const seen = new Set();
const broken = [];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });

for (const route of routes) {
  const res = await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 60000 });
  if (!res || res.status() >= 400) {
    broken.push(`${route} -> ${res ? res.status() : "no response"}`);
    continue;
  }

  const links = await page.$$eval("a[href]", (els) =>
    els.map((el) => el.getAttribute("href") ?? ""),
  );

  for (const href of links) {
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const [pathname] = href.split("#");
    if (!pathname || pathname === "/") continue;
    if (seen.has(pathname)) continue;
    seen.add(pathname);
  }
}

// Verify each discovered internal path resolves.
for (const pathname of seen) {
  const res = await page.goto(`${BASE}${pathname}`, { waitUntil: "load", timeout: 60000 });
  const status = res ? res.status() : 0;
  if (status >= 400) broken.push(`${pathname} -> ${status}`);
}

await browser.close();

console.log(`Checked ${routes.length} routes and ${seen.size} discovered internal paths.`);
if (broken.length) {
  console.log("\nBroken links:");
  broken.forEach((b) => console.log(`  ${b}`));
  process.exitCode = 1;
} else {
  console.log("No broken internal links.");
}
