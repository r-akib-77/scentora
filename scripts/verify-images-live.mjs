/**
 * Verification utility: visits every route and confirms that every image the
 * page requests loads successfully (no 404s, no 500s, no broken images).
 *
 * Usage: node scripts/verify-images-live.mjs [baseUrl]
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2] ?? "http://localhost:3100";

const ROUTES = [
  "/",
  "/shop/",
  "/brands/",
  "/combos/",
  "/fragrance-guide/",
  "/about/",
  "/contact/",
  "/privacy/",
  "/shipping/",
  "/returns/",
  "/product/dior-sauvage/",
  "/product/creed-aventus/",
  "/product/baccarat-rouge-540/",
  "/product/ysl-libre/",
  "/product/midnight-oud/",
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });

const failures = [];
const seen = new Set();
page.on("response", (res) => {
  if (res.status() >= 400) failures.push(`${res.status()} ${res.url()}`);
});
page.on("requestfailed", (req) => {
  failures.push(`FAILED ${req.url()} (${req.failure()?.errorText})`);
});

for (const route of ROUTES) {
  await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 90000 });
  // Scroll through so lazy images load.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 1200));

  const broken = await page.$$eval("img", (imgs) =>
    imgs
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src),
  );
  for (const src of broken) failures.push(`BROKEN <img> ${src}`);

  const loaded = await page.$$eval("img", (imgs) =>
    imgs.filter((img) => img.complete && img.naturalWidth > 0).map((img) => img.currentSrc),
  );
  loaded.forEach((src) => seen.add(src));
  console.log(`  ${route} — ${loaded.length} images loaded`);
}

await browser.close();

console.log(`\n${seen.size} distinct images requested across ${ROUTES.length} routes.`);
if (failures.length) {
  console.log(`\n${failures.length} FAILURES:`);
  [...new Set(failures)].forEach((f) => console.log(`  ${f}`));
  process.exitCode = 1;
} else {
  console.log("No broken images and no failed requests.");
}
