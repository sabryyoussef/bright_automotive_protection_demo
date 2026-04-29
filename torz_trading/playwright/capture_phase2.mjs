/**
 * Torz Trading — Phase 2 demo data screenshots for cleaning_demo (Odoo 19).
 *
 * Captures: customers, fleet vehicles, opening stock, confirmed SOs,
 * FSM job cards at various stages, and the draft Purchase Order.
 *
 * Screenshots land directly in torz_demo_standard_workflow/static/description/
 *
 * Env:
 *   ODOO_URL=http://127.0.0.1:8069   (default)
 *   ODOO_LOGIN=admin                  (default)
 *   ODOO_PASSWORD=required
 *   ODOO_DB=cleaning_demo             (default)
 *
 * Run (from this folder):
 *   npm install
 *   $env:ODOO_PASSWORD="admin"; npm run capture-phase2
 */

import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "torz_demo_standard_workflow", "static", "description");

const BASE     = (process.env.ODOO_URL      || "http://127.0.0.1:8069").replace(/\/$/, "");
const LOGIN    = process.env.ODOO_LOGIN     || "admin";
const PASSWORD = process.env.ODOO_PASSWORD  || "";
const DB       = process.env.ODOO_DB        || "cleaning_demo";

const VIEWPORT = { width: 1920, height: 1080 };

const PATHS = {
  home:       "/odoo",
  contacts:   "/odoo/contacts",
  fleet:      "/odoo/fleet",
  inventory:  "/odoo/inventory",
  stockQuant: "/odoo/inventory/products",
  sales:      "/odoo/sales",
  fsm:        "/odoo/field-service",
  purchase:   "/odoo/purchase",
};

async function login(page) {
  const loginPath = DB ? `/web/login?db=${encodeURIComponent(DB)}` : "/web/login";
  await page.goto(`${BASE}${loginPath}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.setViewportSize(VIEWPORT);
  await page.locator("form.oe_login_form").waitFor({ state: "attached", timeout: 60000 });
  await page.evaluate(() => {
    const f = document.querySelector("form.oe_login_form");
    if (f?.classList.contains("d-none")) f.classList.remove("d-none");
  });
  await page.locator("#login").waitFor({ state: "visible", timeout: 60000 });
  await page.locator("#login").fill(LOGIN);
  await page.locator("#password").fill(PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL(/\/odoo/, { timeout: 120000 });
  await waitForShell(page);
  if (await page.locator("form.oe_login_form").isVisible().catch(() => false)) {
    throw new Error("Login failed — check ODOO_LOGIN / ODOO_PASSWORD.");
  }
  console.log("Logged in OK");
}

async function waitForShell(page, timeout = 90000) {
  await page.waitForFunction(
    () => document.body?.classList?.contains("o_web_client"),
    null,
    { timeout },
  );
}

async function goto(page, urlPath) {
  await page.goto(`${BASE}${urlPath}`, { waitUntil: "load", timeout: 120000 });
  await waitForShell(page);
  await page.locator(".o_action_manager").waitFor({ state: "attached", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1200);
}

async function switchToList(page) {
  const listBtn = page.locator(
    ".o_cp_switch_buttons .o_switch_view[data-type='list'], " +
    ".o_cp_switch_buttons button[aria-label*='List'], " +
    ".o_switch_view.o_list"
  ).first();
  const visible = await listBtn.isVisible().catch(() => false);
  if (visible) {
    await listBtn.click();
    await page.waitForTimeout(800);
  }
}

async function switchToKanban(page) {
  const btn = page.locator(
    ".o_cp_switch_buttons .o_switch_view[data-type='kanban'], " +
    ".o_cp_switch_buttons button[aria-label*='Kanban'], " +
    ".o_switch_view.o_kanban"
  ).first();
  const visible = await btn.isVisible().catch(() => false);
  if (visible) {
    await btn.click();
    await page.waitForTimeout(800);
  }
}

async function search(page, term) {
  const input = page.locator(".o_searchview input").first();
  try {
    await input.waitFor({ state: "visible", timeout: 10000 });
    await input.click();
    await input.fill(term);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1500);
    return true;
  } catch {
    console.warn(`  ⚠ search("${term}") skipped — input not found`);
    return false;
  }
}

async function clearSearch(page) {
  const closes = page.locator(".o_searchview .o_facet_remove, .o_searchview .o_delete");
  const count = await closes.count().catch(() => 0);
  for (let i = 0; i < count; i++) {
    await closes.first().click().catch(() => {});
    await page.waitForTimeout(400);
  }
}

async function openFirstRow(page) {
  const row = page.locator(".o_list_table tbody tr.o_data_row").first();
  await row.waitFor({ state: "visible", timeout: 20000 });
  await row.click();
  await waitForShell(page);
  await page.waitForTimeout(1000);
}

async function openRowContaining(page, text) {
  const row = page.locator(`.o_list_table tbody tr.o_data_row:has-text("${text}")`).first();
  try {
    await row.waitFor({ state: "visible", timeout: 15000 });
    await row.click();
    await waitForShell(page);
    await page.waitForTimeout(1000);
    return true;
  } catch {
    console.warn(`  ⚠ row containing "${text}" not found — skipping`);
    return false;
  }
}

async function dismissOverlays(page) {
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(300);
}

async function snap(page, name, opts = {}) {
  await dismissOverlays(page);
  const target = path.join(OUT_DIR, name);
  await page.screenshot({ path: target, fullPage: opts.fullPage ?? false });
  const kb = Math.round(fs.statSync(target).size / 1024);
  console.log(`  ✓ ${name} (${kb} KB)`);
}

async function main() {
  if (!PASSWORD) { console.error("Set ODOO_PASSWORD env var."); process.exit(1); }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
  const page    = await context.newPage();

  await login(page);

  console.log("\n[01] Home / app menu");
  await goto(page, PATHS.home);
  await snap(page, "01_home.png");

  console.log("\n[02] Contacts — demo customers list");
  await goto(page, PATHS.contacts);
  await switchToList(page);
  await search(page, "Al-Rashidi");
  await clearSearch(page);
  await search(page, "Al-");
  await snap(page, "02_contacts_demo_customers_list.png");

  console.log("\n[03] Contacts — Ahmed Al-Rashidi form");
  await clearSearch(page);
  await search(page, "Ahmed Al-Rashidi");
  try {
    await openFirstRow(page);
    await snap(page, "03_contact_ahmed_form.png");
  } catch { console.warn("  ⚠ Ahmed row not found — skipping"); }

  console.log("\n[04] Fleet — demo vehicles list (SAR-)");
  await goto(page, PATHS.fleet);
  await switchToList(page);
  await search(page, "SAR-");
  await snap(page, "04_fleet_demo_vehicles_list.png");

  console.log("\n[05] Fleet — SAR-1001 vehicle form");
  try {
    await openRowContaining(page, "SAR-1001");
    await snap(page, "05_fleet_sar1001_form.png");
  } catch { console.warn("  ⚠ SAR-1001 row not found — skipping"); }

  console.log("\n[06] Inventory overview (warehouses)");
  await goto(page, PATHS.inventory);
  await snap(page, "06_inventory_overview.png");

  console.log("\n[07] Inventory — on-hand quantities (Torz materials)");
  await goto(page, PATHS.stockQuant);
  await switchToList(page);
  await search(page, "PPF Film Roll");
  await clearSearch(page);
  await search(page, "Film Roll");
  await snap(page, "07_inventory_onhand_film_rolls.png");

  console.log("\n[08] Sales orders — all confirmed SOs");
  await goto(page, PATHS.sales);
  await switchToList(page);
  await snap(page, "08_sales_orders_list.png");

  console.log("\n[09] Sales order form — Ahmed PPF");
  try {
    await openRowContaining(page, "Ahmed");
    await snap(page, "09_so_ahmed_ppf_form.png", { fullPage: true });
  } catch { console.warn("  ⚠ Ahmed SO row not found — skipping"); }

  console.log("\n[10] Field Service — tasks kanban (3 job cards)");
  await goto(page, PATHS.fsm);
  await switchToKanban(page);
  await snap(page, "10_fsm_tasks_kanban.png");

  console.log("\n[11] Field Service — tasks list");
  await switchToList(page);
  await snap(page, "11_fsm_tasks_list.png");

  console.log("\n[12] FSM task — Ahmed (Vehicle Received)");
  try {
    await openRowContaining(page, "Ahmed");
    await snap(page, "12_fsm_task_ahmed_vehicle_received.png", { fullPage: true });
    await page.goBack();
    await waitForShell(page);
    await page.waitForTimeout(800);
  } catch { console.warn("  ⚠ Ahmed task not found — skipping"); }

  console.log("\n[13] FSM task — Mohammed (In Progress)");
  try {
    await openRowContaining(page, "Mohammed");
    await snap(page, "13_fsm_task_mohammed_in_progress.png", { fullPage: true });
    await page.goBack();
    await waitForShell(page);
    await page.waitForTimeout(800);
  } catch { console.warn("  ⚠ Mohammed task not found — skipping"); }

  console.log("\n[14] Purchase — draft PO to Gulf Auto Film Supplies");
  await goto(page, PATHS.purchase);
  await switchToList(page);
  await search(page, "Gulf Auto");
  await snap(page, "14_purchase_order_list.png");

  console.log("\n[14b] Purchase — PO form");
  try {
    await openFirstRow(page);
    await snap(page, "14b_purchase_order_form.png", { fullPage: true });
  } catch { console.warn("  ⚠ PO row not found — skipping"); }

  console.log("\n[15] Inventory — PPF lot numbers");
  await page.goto(`${BASE}/odoo/inventory/lots`, { waitUntil: "load", timeout: 120000 });
  await waitForShell(page);
  await page.waitForTimeout(1200);
  await switchToList(page);
  await search(page, "PPF-ROLL");
  await snap(page, "15_stock_lots_ppf.png");

  await browser.close();
  console.log(`\nAll screenshots saved → ${OUT_DIR}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
