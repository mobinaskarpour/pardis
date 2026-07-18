import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const BASE = "http://127.0.0.1:3001";
const OUT = "/root/pardis/docs/visual-qa/before";
mkdirSync(OUT, { recursive: true });

async function settle(page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(800);
}

async function shot(page, name) {
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true });
  console.log("saved", name);
}

async function nukeOverlays(page) {
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Escape").catch(() => {});
  }
  await page.evaluate(() => {
    document.querySelectorAll("body *").forEach((el) => {
      const s = getComputedStyle(el);
      if (
        s.position === "fixed" &&
        (el.className.includes("inset-0") ||
          el.className.includes("backdrop") ||
          el.getAttribute("role") === "dialog")
      ) {
        el.remove();
      }
    });
  });
  await page.waitForTimeout(150);
}

async function setTheme(page, mode) {
  await page.evaluate((m) => {
    localStorage.setItem(
      "pardis-theme",
      JSON.stringify({ state: { theme: m }, version: 0 })
    );
  }, mode);
  await page.reload({ waitUntil: "domcontentloaded" });
  await settle(page);
  await nukeOverlays(page);
}

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ locale: "fa-IR" })).newPage();

// finish desktop light extras
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
await settle(page);
await nukeOverlays(page);

const more = page.getByRole("button", { name: "بیشتر" });
if (await more.count()) {
  await more.click({ force: true });
  await page.waitForTimeout(500);
  await shot(page, "19-more-drawer-desktop-light");
  await nukeOverlays(page);
}

await page.goto(BASE + "/chat", { waitUntil: "domcontentloaded" });
await settle(page);
await nukeOverlays(page);
const input = page.locator("textarea").first();
if (await input.count()) {
  await input.fill("وضعیت امروز چطوره؟");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2500);
  await shot(page, "02b-chat-with-response-desktop-light");
}

await page.goto(BASE + "/imaging", { waitUntil: "domcontentloaded" });
await settle(page);
await nukeOverlays(page);
await shot(page, "05-imaging-desktop-light");

// dark samples
await setTheme(page, "dark");
for (const [n, p] of [
  ["01-home", "/"],
  ["02-chat", "/chat"],
  ["03-patients", "/patients"],
  ["04-doctors", "/doctors"],
  ["05-imaging", "/imaging"],
  ["06-workflows", "/workflows"],
  ["06c-workflow-studio", "/workflows/wf-mri-report-prep/studio"],
  ["07-integrations", "/integrations"],
  ["08-analytics", "/analytics"],
  ["09-appointments", "/appointments"],
  ["14-settings", "/settings"],
]) {
  await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
  await settle(page);
  await nukeOverlays(page);
  await shot(page, `${n}-desktop-dark`);
}

// tablet
await setTheme(page, "light");
await page.setViewportSize({ width: 768, height: 1024 });
for (const [n, p] of [
  ["01-home", "/"],
  ["02-chat", "/chat"],
  ["03-patients", "/patients"],
  ["05-imaging", "/imaging"],
  ["06-workflows", "/workflows"],
  ["07-integrations", "/integrations"],
]) {
  await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
  await settle(page);
  await nukeOverlays(page);
  await shot(page, `${n}-tablet-light`);
}

// mobile
await page.setViewportSize({ width: 390, height: 844 });
for (const [n, p] of [
  ["01-home", "/"],
  ["02-chat", "/chat"],
  ["03-patients", "/patients"],
  ["05-imaging", "/imaging"],
  ["06-workflows", "/workflows"],
  ["07-integrations", "/integrations"],
  ["08-analytics", "/analytics"],
]) {
  await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
  await settle(page);
  await nukeOverlays(page);
  await shot(page, `${n}-mobile-light`);
}

await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
await settle(page);
await nukeOverlays(page);
const m = page.getByRole("button", { name: "بیشتر" });
if (await m.count()) {
  await m.click({ force: true });
  await page.waitForTimeout(500);
}
await shot(page, "19-more-mobile-light");

await setTheme(page, "dark");
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
await settle(page);
await nukeOverlays(page);
await shot(page, "01-home-mobile-dark");
await page.goto(BASE + "/chat", { waitUntil: "domcontentloaded" });
await settle(page);
await nukeOverlays(page);
await shot(page, "02-chat-mobile-dark");
await page.goto(BASE + "/patients", { waitUntil: "domcontentloaded" });
await settle(page);
await nukeOverlays(page);
await shot(page, "03-patients-mobile-dark");

await browser.close();
console.log("done");
