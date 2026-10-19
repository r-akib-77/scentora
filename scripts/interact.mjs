/**
 * Functional test: drives the storefront in a real browser and exercises
 * every major interaction — size selection, add to bag, cart maths, search,
 * filters, the quiz, bundles and the mobile navigation.
 *
 * Usage: node scripts/interact.mjs [baseUrl]
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = path.join(process.cwd(), "scripts", "shots");

const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Wait for a selector to appear (dev server compiles routes on demand). */
async function waitFor(page, selector, timeout = 30000) {
  try {
    await page.waitForSelector(selector, { timeout, visible: false });
    return true;
  } catch {
    return false;
  }
}

async function textOf(page, selector) {
  return page.$eval(selector, (el) => el.textContent?.trim() ?? "").catch(() => "");
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });

  const consoleErrors = [];
  let currentUrl = "";
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(`[${currentUrl}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(`[${currentUrl}] pageerror: ${err.message}`);
    if (process.env.DEBUG_ERRORS) console.log("STACK>>>", err.stack);
  });
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) currentUrl = frame.url();
  });
  page.on("response", (res) => {
    if (res.status() >= 400) {
      console.log(`  HTTP ${res.status()} -> ${res.url()}`);
    }
  });

  /* ---------------------------------------------------------------- shop */
  await page.goto(`${BASE}/shop`, { waitUntil: "load", timeout: 90000 });
  await waitFor(page, "#collection-sort");
  await wait(1800);

  const countText = await textOf(page, "main .page-shell p.text-\\[12px\\].uppercase");
  check("Shop renders a product count", /\d+\s+of\s+\d+/.test(countText), countText);

  const initialCards = await page.$$eval("article", (els) => els.length);
  check("Shop renders product cards", initialCards > 20, `${initialCards} cards`);

  /* ------------------------------------------------- size + price update */
  const firstCard = (await page.$$("article"))[0];
  const beforePrice = await firstCard.$eval(".price", (el) => el.textContent.trim());
  const sizeButtons = await firstCard.$$('[role="radio"]');
  check("Product card shows size options", sizeButtons.length >= 2, `${sizeButtons.length} sizes`);
  await sizeButtons[sizeButtons.length - 1].click();
  await wait(500);
  const afterPrice = await firstCard.$eval(".price", (el) => el.textContent.trim());
  check(
    "Selecting a size updates the displayed price",
    beforePrice !== afterPrice,
    `${beforePrice} -> ${afterPrice}`,
  );

  /* ------------------------------------------------------- add to bag */
  await firstCard.$eval("button", () => {});
  const addBtn = await firstCard.$$eval("button", (els) => {
    const idx = els.findIndex((el) => el.textContent?.toLowerCase().includes("add to bag"));
    return idx;
  });
  if (addBtn >= 0) {
    const buttons = await firstCard.$$("button");
    await buttons[addBtn].click();
    await wait(900);
    const drawerVisible = await page.$('[role="dialog"][aria-label="Your Bag"]');
    check("Add to Bag opens the cart drawer", Boolean(drawerVisible));
    await page.screenshot({ path: path.join(OUT, "cart-drawer-desktop.jpg"), type: "jpeg", quality: 80 });

    const lineText = await textOf(page, '[role="dialog"] ul li');
    check("Cart line shows the selected size", /\d+\s*ml/i.test(lineText), lineText.slice(0, 80));

    /* -------------------------------------------------- quantity maths */
    const subtotalBefore = await page.$eval(
      '[role="dialog"] footer span.font-serif',
      (el) => el.textContent.trim(),
    );
    const incBtn = await page.$$('[role="dialog"] ul li button[aria-label^="Increase"]');
    await incBtn[0].click();
    await wait(500);
    const subtotalAfter = await page.$eval(
      '[role="dialog"] footer span.font-serif',
      (el) => el.textContent.trim(),
    );
    const num = (s) => Number(s.replace(/[^\d]/g, ""));
    check(
      "Increasing quantity updates the subtotal",
      num(subtotalAfter) === num(subtotalBefore) * 2,
      `${subtotalBefore} -> ${subtotalAfter}`,
    );

    /* ------------------------------------------------------- persistence */
    await page.reload({ waitUntil: "load" });
    await wait(3000);
    const bagState = await page.evaluate(() => ({
      storage: window.localStorage.getItem("scentora.cart.v1"),
      label:
        document
          .querySelector("header button[aria-label^='Open shopping bag']")
          ?.getAttribute("aria-label") ?? "none",
      badge:
        document
          .querySelector("header button[aria-label^='Open shopping bag'] span")
          ?.textContent ?? "none",
    }));
    check(
      "Bag persists after a page reload",
      bagState.badge === "2",
      `badge=${bagState.badge} label=${bagState.label} storage=${String(bagState.storage).slice(0, 90)}`,
    );

    /* ---------------------------------------------------------- removal */
    await page.click("header button[aria-label^='Open shopping bag']");
    await wait(900);
    const removeButtons = await page.$$('[role="dialog"] li button');
    let removed = false;
    for (const btn of removeButtons) {
      const label = await btn.evaluate((el) => el.textContent?.trim() ?? "");
      if (label.toLowerCase().includes("remove")) {
        await btn.click();
        removed = true;
        break;
      }
    }
    await wait(700);
    const emptyText = await page
      .$eval('[role="dialog"]', (el) => el.textContent ?? "")
      .catch(() => "");
    check(
      "Removing an item empties the bag",
      removed && /Your bag is empty/i.test(emptyText),
      emptyText.slice(0, 60),
    );
    await page.screenshot({ path: path.join(OUT, "cart-empty-desktop.jpg"), type: "jpeg", quality: 80 });
  } else {
    check("Add to Bag button present in card", false);
  }

  /* ------------------------------------------------------------ search */
  await page.evaluate(() => {
    document.querySelectorAll('[role="dialog"] button[aria-label="Close panel"]').forEach((b) => b.click());
  });
  await wait(700);
  await page.evaluate(() => {
    document.querySelector("header button[aria-label='Search fragrances']")?.click();
  });
  await wait(1000);
  const searchInput = await page.$('[role="dialog"] input[type="search"]');
  check("Search overlay opens with an input", Boolean(searchInput));
  if (searchInput) {
    await searchInput.type("oud");
    await wait(1000);
    const resultLinks = await page.$$('[role="dialog"] a[href^="/product/"]');
    check("Search returns live results", resultLinks.length > 0, `${resultLinks.length} results`);
    await page.screenshot({ path: path.join(OUT, "search-overlay-desktop.jpg"), type: "jpeg", quality: 80 });
  }
  await page.keyboard.press("Escape");
  await wait(600);

  /* ----------------------------------------------------------- filters */
  await page.goto(`${BASE}/shop`, { waitUntil: "load", timeout: 90000 });
  await waitFor(page, "#collection-sort");
  await wait(1500);
  const genderChip = await page.$$("aside button");
  let clicked = false;
  for (const chip of genderChip) {
    const label = await chip.evaluate((el) => el.textContent?.trim() ?? "");
    if (label === "Men") {
      await chip.click();
      clicked = true;
      break;
    }
  }
  await wait(900);
  const filteredCount = await page.$$eval("article", (els) => els.length);
  check(
    "Gender filter reduces the result set",
    clicked && filteredCount > 0 && filteredCount < initialCards,
    `${filteredCount} of ${initialCards}`,
  );
  const chipCount = await page.$$eval("main .page-shell .flex-wrap .inline-flex", (els) => els.length);
  check("Active filter chips are shown", chipCount > 0, `${chipCount} chips`);

  /* ------------------------------------------------------------ search */
  await page.type("#collection-search", "vanilla");
  await wait(1200);
  const searchFiltered = await page.$$eval("article", (els) => els.length);
  check(
    "Search field filters the catalogue",
    searchFiltered > 0 && searchFiltered < filteredCount,
    `${searchFiltered} results`,
  );

  /* ------------------------------------------------------------- empty */
  await page.evaluate(() => {
    const input = document.querySelector("#collection-search");
    if (!input) return;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;
    setter?.call(input, "zzzznotathing");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await wait(1400);
  const emptyVisible = await page.$eval("main", (el) => el.textContent?.includes("Nothing found") ?? false);
  check("Empty state appears when nothing matches", emptyVisible);
  await page.screenshot({ path: path.join(OUT, "shop-empty-desktop.jpg"), type: "jpeg", quality: 80 });

  /* -------------------------------------------------------------- sort */
  await page.goto(`${BASE}/shop`, { waitUntil: "load", timeout: 90000 });
  await waitFor(page, "#collection-sort");
  await wait(1500);
  await page.select("#collection-sort", "price-asc");
  await wait(2500);
  const prices = await page.$$eval("article .price", (els) =>
    els.map((el) => Number(el.textContent.replace(/[^\d]/g, ""))),
  );
  const ascending = prices.every((p, i) => i === 0 || prices[i - 1] <= p);
  check("Price sorting is applied", ascending, prices.slice(0, 6).join(", "));

  /* -------------------------------------------------------------- quiz */
  await page.goto(`${BASE}/fragrance-guide#finder`, { waitUntil: "load", timeout: 90000 });
  await waitFor(page, '[role="radiogroup"]');
  await wait(1500);
  const answers = ["Daily Wear", "Summer", "Fresh", "Affordable", "Subtle"];
  for (let i = 0; i < answers.length; i += 1) {
    const ok = await page.evaluate((label) => {
      const btn = Array.from(document.querySelectorAll('[role="radio"]')).find(
        (el) => el.textContent?.trim().startsWith(label),
      );
      if (!btn) return false;
      btn.click();
      return true;
    }, answers[i]);
    if (!ok) {
      check(`Quiz answer "${answers[i]}" selectable`, false);
      break;
    }
    await wait(450);
    await page.evaluate(() => {
      const next = Array.from(document.querySelectorAll("button")).find((el) =>
        /^(Next|See my matches)$/.test(el.textContent?.trim() ?? ""),
      );
      next?.click();
    });
    await wait(700);
  }
  await wait(1200);
  const matchText = await page.$eval("main", (el) => el.textContent ?? "");
  check(
    "Fragrance finder produces explained matches",
    /match/i.test(matchText) && /Six fragrances|results/i.test(matchText),
  );
  await page.screenshot({ path: path.join(OUT, "finder-results-desktop.jpg"), type: "jpeg", quality: 80 });

  /* ------------------------------------------------------------ bundle */
  await page.goto(`${BASE}/combos`, { waitUntil: "load", timeout: 90000 });
  await waitFor(page, "article button");
  await wait(1500);
  const bundleClicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("article button")).find((el) =>
      (el.textContent ?? "").includes("Add Bundle"),
    );
    if (!btn) return false;
    btn.scrollIntoView({ block: "center" });
    btn.click();
    return true;
  });
  await wait(2200);
  const bundleState = await page.evaluate(() => ({
    dialogs: document.querySelectorAll('[role="dialog"]').length,
    lines: document.querySelectorAll('[role="dialog"] ul li').length,
    storage: (window.localStorage.getItem("scentora.cart.v1") ?? "").length,
    toasts: document.querySelectorAll('[role="status"]').length,
  }));
  const bundleSubtotal = await page
    .$eval('[role="dialog"] footer span.font-serif', (el) => el.textContent?.trim() ?? "")
    .catch(() => "");
  check(
    "Add Bundle expands the set into the bag",
    bundleClicked && bundleState.lines >= 3,
    `${bundleState.lines} lines, subtotal ${bundleSubtotal}, storage ${bundleState.storage}B, dialogs ${bundleState.dialogs}`,
  );
  await page.screenshot({ path: path.join(OUT, "bundle-cart-desktop.jpg"), type: "jpeg", quality: 80 });

  /* ------------------------------------------------------ mobile nav */
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 90000 });
  await waitFor(page, "header button[aria-label='Open menu']");
  await wait(1500);
  await page.evaluate(() => {
    document.querySelector("header button[aria-label='Open menu']")?.click();
  });
  await wait(1000);
  const navVisible = await page.$eval("aside[aria-label='Mobile navigation']", (el) => {
    const style = getComputedStyle(el);
    return style.transform === "none" || style.transform.includes("matrix(1, 0, 0, 1, 0, 0)");
  }).catch(() => false);
  check("Mobile navigation drawer opens", navVisible);
  await page.screenshot({ path: path.join(OUT, "mobile-nav.jpg"), type: "jpeg", quality: 80 });
  await page.evaluate(() => {
    document.querySelector("aside[aria-label='Mobile navigation'] button[aria-label='Close menu']")?.click();
  });
  await wait(800);
  const navClosed = await page
    .$eval("aside[aria-label='Mobile navigation']", (el) => {
      const style = getComputedStyle(el);
      return `${style.transform} | aria-hidden=${el.getAttribute("aria-hidden")}`;
    })
    .catch(() => "missing");
  check(
    "Mobile navigation drawer closes",
    /aria-hidden=true/.test(navClosed) || /-\d/.test(navClosed),
    navClosed,
  );

  /* --------------------------------------------------- horizontal overflow */
  for (const [name, url] of [
    ["home", "/"],
    ["shop", "/shop"],
    ["product", "/product/dior-sauvage"],
    ["guide", "/fragrance-guide"],
    ["combos", "/combos"],
  ]) {
    await page.goto(`${BASE}${url}`, { waitUntil: "load", timeout: 90000 });
    await wait(1600);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    check(`No horizontal overflow on ${name} (390px)`, overflow <= 1, `${overflow}px`);
  }

  /* ------------------------------------------------------------ 404 */
  const resp = await page.goto(`${BASE}/this-page-does-not-exist`, { waitUntil: "load", timeout: 90000 });
  check("Custom 404 page is served", resp.status() === 404, `status ${resp.status()}`);

  check(
    "No console errors during the run",
    consoleErrors.filter((e) => !e.includes("404 (Not Found)") && !e.includes("this-page-does-not-exist")).length === 0,
    consoleErrors.slice(0, 4).join(" | "),
  );

  await browser.close();

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length) {
    console.log("Failures:");
    failed.forEach((f) => console.log(` - ${f.name}: ${f.detail}`));
    process.exitCode = 1;
  }
}

main();
