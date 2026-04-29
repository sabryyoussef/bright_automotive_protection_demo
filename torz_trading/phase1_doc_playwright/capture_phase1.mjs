/**
 * Torz Trading — Phase 1 workflow screenshots for cleaning_demo (Odoo 19).
 *
 * Env:
 *   ODOO_URL=http://127.0.0.1:8069   (default)
 *   ODOO_LOGIN=admin                  (default)
 *   ODOO_PASSWORD=required
 *   ODOO_DB=cleaning_demo             (default)
 *
 * Run:
 *   $env:ODOO_PASSWORD="admin"; npm run capture
 */

import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "phase1_workflow_docs", "screenshots");

const BASE = (process.env.ODOO_URL || "http://127.0.0.1:8069").replace(/\/$/, "");
const LOGIN = process.env.ODOO_LOGIN || "admin";
const PASSWORD = process.env.ODOO_PASSWORD || "";
const DB = process.env.ODOO_DB || "cleaning_demo";

const VIEWPORT = { width: 1920, height: 1080 };

// Odoo 19 URL paths (from ir.actions.act_window path field)
const PATHS = {
  fleet:          "/odoo/fleet",
  products:       "/odoo/sales/products",
  warehouse:      "/odoo/inventory",
  fsm:            "/odoo/field-service",
  fsmProjects:    "/odoo/field-service-projects",
  sales:          "/odoo/sales",
  worksheets:     "/odoo/field-service-worksheet-templates",
  contacts:       "/odoo/contacts",
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
    throw new Error("Login failed. Check ODOO_LOGIN / ODOO_PASSWORD.");
  }
  console.log("Logged in OK");
}

async function waitForShell(page, timeout = 90000) {
  await page.waitForFunction(() => document.body?.classList?.contains("o_web_client"), null, { timeout });
}

async function goto(page, urlPath) {
  await page.goto(`${BASE}${urlPath}`, { waitUntil: "load", timeout: 120000 });
  await waitForShell(page);
  await page.locator(".o_action_manager").waitFor({ state: "attached", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1200);
}

async function switchToList(page) {
  // Switch to list view if not already there
  const listBtn = page.locator(
    "button.o_list_button, .o_cp_switch_buttons .o_switch_view[data-type='list'], .o_cp_switch_buttons button[aria-label*='List'], .o_switch_view.o_list"
  ).first();
  const visible = await listBtn.isVisible().catch(() => false);
  if (visible) {
    await listBtn.click();
    await page.waitForTimeout(800);
  }
}

async function search(page, term) {
  // Odoo 19: search input is inside .o_searchview
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

async function openFirstRow(page) {
  const row = page.locator(".o_list_table tbody tr.o_data_row").first();
  await row.waitFor({ state: "visible", timeout: 20000 });
  await row.click();
  await waitForShell(page);
  await page.waitForTimeout(1000);
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

// ──────────────────────────────────────────────
async function main() {
  if (!PASSWORD) { console.error("Set ODOO_PASSWORD."); process.exit(1); }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
  const page = await context.newPage();

  await login(page);

  // ── STEP 1: Home after login ──────────────────────────────────────────────
  console.log("\n[1] Home / app menu");
  await goto(page, "/odoo");
  await snap(page, "01_home_after_login.png");

  // ── STEP 2–3: Fleet vehicle ───────────────────────────────────────────────
  console.log("\n[2] Fleet — vehicle list");
  await goto(page, PATHS.fleet);
  await switchToList(page);
  await search(page, "TORZ-DEMO");
  await snap(page, "02_fleet_vehicle_list_filtered.png");

  console.log("\n[3] Fleet — vehicle form");
  try {
    await openFirstRow(page);
    await snap(page, "03_fleet_vehicle_form.png");
  } catch {
    console.warn("  ⚠ no fleet row found — skipping form screenshot");
  }

  // ── STEP 4: Products (search Torz) ───────────────────────────────────────
  console.log("\n[4] Products — Torz service products");
  await goto(page, PATHS.products);
  await switchToList(page);
  await search(page, "Torz");
  await snap(page, "04_products_torz_search.png");

  // ── STEP 5: Inventory overview showing Torz warehouses ───────────────────
  console.log("\n[5] Inventory overview / Torz warehouses");
  await goto(page, PATHS.warehouse);
  await snap(page, "05_inventory_overview.png");

  // ── STEP 6: Field Service — All Tasks (Torz job cards) ───────────────────
  console.log("\n[6] Field Service — tasks list");
  await goto(page, PATHS.fsm);
  await switchToList(page);
  await search(page, "Torz");
  await snap(page, "06_fsm_tasks_torz_search.png");

  // ── STEP 7: Field Service — Projects list ────────────────────────────────
  console.log("\n[7] Field Service — projects");
  await goto(page, PATHS.fsmProjects);
  await switchToList(page);
  await search(page, "Torz Trading");
  await snap(page, "07_fsm_projects_torz_search.png");

  console.log("\n[7b] Field Service — project form");
  try {
    await openFirstRow(page);
    await snap(page, "07b_fsm_project_form.png");
  } catch {
    console.warn("  ⚠ no project row — skipping form");
  }

  // ── STEP 8: Sales orders list ─────────────────────────────────────────────
  console.log("\n[8] Sales orders list");
  await goto(page, PATHS.sales);
  await snap(page, "08_sales_orders_list.png");

  // ── STEP 9: Worksheet templates ───────────────────────────────────────────
  console.log("\n[9] Worksheet templates — Torz car receiving report");
  await goto(page, PATHS.worksheets);
  await switchToList(page);
  await search(page, "Torz");
  await snap(page, "09_worksheet_templates_torz.png");

  // ── STEP 10: Contacts — demo customer ─────────────────────────────────────
  console.log("\n[10] Contacts — Torz Demo Customer");
  await goto(page, PATHS.contacts);
  await switchToList(page);
  await search(page, "Torz Demo Customer");
  await snap(page, "10_contacts_torz_demo_customer.png");

  console.log("\n[10b] Contacts — demo customer form");
  try {
    await openFirstRow(page);
    await snap(page, "10b_contacts_torz_demo_customer_form.png");
  } catch {
    console.warn("  ⚠ no contact row — skipping form");
  }

  await browser.close();
  console.log(`\nAll screenshots saved → ${OUT_DIR}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
