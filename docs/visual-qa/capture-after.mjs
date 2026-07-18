import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const BASE = "http://127.0.0.1:3001";
const OUT = "/root/pardis/docs/visual-qa/after";
mkdirSync(OUT, { recursive: true });

async function settle(page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(900);
}

async function shot(page, name) {
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true });
  console.log("saved", name);
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
}

async function nukeOverlays(page) {
  for (let i = 0; i < 2; i++) await page.keyboard.press("Escape").catch(() => {});
  await page.evaluate(() => {
    document.querySelectorAll("body *").forEach((el) => {
      const s = getComputedStyle(el);
      if (s.position === "fixed" && el.className.includes("inset-0")) el.remove();
    });
  });
}

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ locale: "fa-IR" })).newPage();
await page.setViewportSize({ width: 1440, height: 900 });

for (const [n, p] of [
  ["01-home", "/"],
  ["02-chat", "/chat"],
  ["03-patients", "/patients"],
  ["04-doctors", "/doctors"],
  ["05-imaging", "/imaging"],
  ["06-workflows", "/workflows"],
  ["07-integrations", "/integrations"],
  ["09-appointments", "/appointments"],
]) {
  await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
  await settle(page);
  await nukeOverlays(page);
  await shot(page, `${n}-desktop-light`);
}

await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
await settle(page);
await page.keyboard.press("Control+k");
await page.waitForTimeout(400);
await shot(page, "18-command-palette-desktop-light");
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
// verify palette closed
const blocked = await page.evaluate(() => {
  const el = document.elementFromPoint(200, 400);
  return el?.className?.includes?.("inset-0") ?? false;
});
console.log("palette-backdrop-blocking", blocked);

await setTheme(page, "dark");
for (const [n, p] of [
  ["01-home", "/"],
  ["02-chat", "/chat"],
  ["03-patients", "/patients"],
  ["04-doctors", "/doctors"],
  ["05-imaging", "/imaging"],
  ["06-workflows", "/workflows"],
]) {
  await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
  await settle(page);
  await nukeOverlays(page);
  await shot(page, `${n}-desktop-dark`);
}

await setTheme(page, "light");
await page.setViewportSize({ width: 390, height: 844 });
for (const [n, p] of [
  ["01-home", "/"],
  ["02-chat", "/chat"],
  ["03-patients", "/patients"],
]) {
  await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
  await settle(page);
  await nukeOverlays(page);
  await shot(page, `${n}-mobile-light`);
}

await browser.close();
console.log("done");
