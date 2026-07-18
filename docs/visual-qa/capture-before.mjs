import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const BASE = "http://127.0.0.1:3001";
const OUT = "/root/pardis/docs/visual-qa/before";
mkdirSync(OUT, { recursive: true });

const routes = [
  ["01-home", "/"],
  ["02-chat", "/chat"],
  ["03-patients", "/patients"],
  ["03b-patient-214", "/patients/214"],
  ["04-doctors", "/doctors"],
  ["04b-doctor-rezaei", "/doctors/dr-rezaei"],
  ["05-imaging", "/imaging"],
  ["06-workflows", "/workflows"],
  ["06b-workflow-detail", "/workflows/wf-mri-report-prep"],
  ["06c-workflow-studio", "/workflows/wf-mri-report-prep/studio"],
  ["07-integrations", "/integrations"],
  ["08-analytics", "/analytics"],
  ["08b-analytics-metric", "/analytics/revenue"],
  ["09-appointments", "/appointments"],
  ["10-reports", "/reports"],
  ["11-financial", "/financial"],
  ["12-knowledge", "/knowledge"],
  ["13-notifications", "/notifications"],
  ["14-settings", "/settings"],
  ["15-users", "/users"],
  ["16-roles", "/roles"],
  ["17-automation", "/automation"],
];

const viewports = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

async function settle(page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(900);
}

async function shot(page, name) {
  const path = join(OUT, `${name}.png`);
  await page.screenshot({ path, fullPage: true });
  console.log("saved", name);
}

async function setTheme(page, mode) {
  // cycle via theme button until data-theme matches, or set localStorage
  await page.evaluate((m) => {
    localStorage.setItem(
      "pardis-theme",
      JSON.stringify({ state: { theme: m }, version: 0 })
    );
    document.documentElement.dataset.theme = m === "system" ? "light" : m;
    document.documentElement.classList.toggle("dark", m === "dark");
  }, mode);
  await page.reload({ waitUntil: "domcontentloaded" });
  await settle(page);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: "fa-IR",
    colorScheme: "light",
  });
  const page = await context.newPage();

  // Desktop light — all routes
  await page.setViewportSize(viewports.desktop);
  for (const [name, path] of routes) {
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    await settle(page);
    await shot(page, `${name}-desktop-light`);
  }

  // Overlays on home
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await settle(page);

  // Command palette
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(500);
  await shot(page, "18-command-palette-desktop-light");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  // Force-dismiss any leftover overlay
  await page.evaluate(() => {
    document.querySelectorAll(".fixed.inset-0.z-50").forEach((el) => el.remove());
  });
  await page.waitForTimeout(200);

  // More drawer
  const more = page.getByRole("button", { name: "بیشتر" });
  if (await more.count()) {
    await more.click({ force: true });
    await page.waitForTimeout(600);
    await shot(page, "19-more-drawer-desktop-light");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    await page.evaluate(() => {
      document.querySelectorAll(".fixed.inset-0.z-50").forEach((el) => el.remove());
    });
  }

  // Chat with message / canvas
  await page.goto(BASE + "/chat", { waitUntil: "domcontentloaded" });
  await settle(page);
  const input = page.locator("textarea, [contenteditable=true], input[type=text]").first();
  if (await input.count()) {
    await input.click();
    await input.fill("وضعیت امروز چطوره؟");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);
    await shot(page, "02b-chat-with-response-desktop-light");
  }

  // Imaging interactions if tabs exist
  await page.goto(BASE + "/imaging", { waitUntil: "domcontentloaded" });
  await settle(page);
  const tabs = page.locator('[role="tab"]');
  const tabCount = await tabs.count();
  for (let i = 0; i < Math.min(tabCount, 4); i++) {
    await tabs.nth(i).click();
    await page.waitForTimeout(400);
    await shot(page, `05b-imaging-tab-${i}-desktop-light`);
  }

  // Workflows tabs/filters
  await page.goto(BASE + "/workflows", { waitUntil: "domcontentloaded" });
  await settle(page);
  const wfTabs = page.locator('button, [role="tab"]').filter({ hasText: /فعال|پیشنهاد|آرشیو|همه/ });
  const wfCount = await wfTabs.count();
  for (let i = 0; i < Math.min(wfCount, 4); i++) {
    await wfTabs.nth(i).click();
    await page.waitForTimeout(400);
    await shot(page, `06d-workflows-filter-${i}-desktop-light`);
  }

  // Dark mode sample set
  await setTheme(page, "dark");
  const darkSample = [
    ["01-home", "/"],
    ["02-chat", "/chat"],
    ["03-patients", "/patients"],
    ["05-imaging", "/imaging"],
    ["06-workflows", "/workflows"],
    ["07-integrations", "/integrations"],
    ["08-analytics", "/analytics"],
    ["14-settings", "/settings"],
  ];
  for (const [name, path] of darkSample) {
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    await settle(page);
    await shot(page, `${name}-desktop-dark`);
  }

  // Tablet light sample
  await setTheme(page, "light");
  await page.setViewportSize(viewports.tablet);
  for (const [name, path] of [
    ["01-home", "/"],
    ["02-chat", "/chat"],
    ["03-patients", "/patients"],
    ["05-imaging", "/imaging"],
    ["06-workflows", "/workflows"],
  ]) {
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    await settle(page);
    await shot(page, `${name}-tablet-light`);
  }

  // Mobile light sample
  await page.setViewportSize(viewports.mobile);
  for (const [name, path] of [
    ["01-home", "/"],
    ["02-chat", "/chat"],
    ["03-patients", "/patients"],
    ["05-imaging", "/imaging"],
    ["06-workflows", "/workflows"],
    ["07-integrations", "/integrations"],
    ["19-more", "/"],
  ]) {
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    await settle(page);
    if (name === "19-more") {
      const m = page.getByRole("button", { name: "بیشتر" });
      if (await m.count()) {
        await m.click();
        await page.waitForTimeout(500);
      }
    }
    await shot(page, `${name}-mobile-light`);
  }

  // Mobile dark home
  await setTheme(page, "dark");
  await page.setViewportSize(viewports.mobile);
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await settle(page);
  await shot(page, "01-home-mobile-dark");

  await browser.close();
  console.log("done");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
