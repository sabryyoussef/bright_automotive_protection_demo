# Torz Trading — Lazy Implementation Plan

**Source docs:** `standard_odoo_workflow.md`, `chatgpt_arrangement.md`  
**Platform:** Odoo Enterprise v19 (Field Service, Worksheets, Studio = Enterprise)  
**Principle:** Standard workflow + demo data first; gaps later with config → Studio → Automated Actions → minimal custom module.

---

## What “lazy” means here

- Ship value in **thin slices**: prove the end-to-end standard flow on demo data before touching warranties, annotation, or automation complexity.
- **One demo-data module** scoped **only** to the native workflow (no gap-specific models/widgets yet).
- Defer gap solutions until the baseline is stable; pick options per gap using the matrix from the two MD files.

---

## Phase 0 — Preconditions (no code)

- Confirm **Odoo Enterprise** licensing and apps: Sales, Purchase, Inventory, Field Service, Field Service Worksheets, Accounting, Helpdesk, Studio, Documents (CRM optional).
- Project naming (from chat log): **Torz Trading Odoo Enterprise Implementation** / folder `torz_odoo_enterprise_implementation` for custom addons later.
- Agree on **vehicle storage** for standard demo: e.g. Studio model **Customer Vehicle** (recommended in arrangement doc) vs Fleet — pick one for demo consistency.

---

## Phase 1 — Standard Odoo workflow (configuration only, manual or CSV)

**Goal:** Run the full “happy path” without custom Python/JS.

**Implementation in repo:** installable module **`torz_phase1_workflow`**  
Path: `projects/bright_information/torz_trading/torz_phase1_workflow/`  
(Add that folder to `--addons-path`, then install **Torz Trading — Phase 1 Standard Workflow** after Odoo Enterprise apps are available.)

Aligned with **Part 1** of `standard_odoo_workflow.md`:

| Area | What to configure |
|------|-------------------|
| **Customer / vehicle** | Contact + vehicle record (Studio model or chosen alternative); fields for plate, VIN, brand, model, color, mileage. |
| **Sales & Field Service** | Service products; SO confirms → **Field Service task** (“job card”); stages e.g. New → Vehicle Received → In Progress → Quality Check → Ready for Delivery → Delivered → Closed. |
| **Car receiving report** | **Worksheet template** with checklist, photos, signatures, notes (Studio fields as needed). |
| **Inventory** | Main Warehouse → internal transfer → Cutting/Operations Warehouse; products for film/tint/ceramic/consumables; **lots** where it matters; daily **inventory adjustment** process for ops warehouse. |
| **Delivery & invoicing** | Complete task + worksheet + signature → invoice from SO → payment → use Accounting / inventory valuation for revenue vs material cost. |
| **After-sales (light)** | Helpdesk and/or activities only — **no** complex warranty automation yet. |

**Exit criteria:** One scripted walkthrough (internal) from quotation to paid invoice with stock moves and a signed worksheet.

---

## Phase 2 — Demo data module (standard workflow only)

**Goal:** A single installable module whose **only** purpose is to load **demo/master data** so the standard workflow is repeatable (training, UAT, demos).

### Module intent

- **Name (suggested):** e.g. `torz_demo_standard_workflow` (or under your repo naming convention).
- **Contains:** XML/CSV data — **not** business logic for gaps 1–3.
- **Typical seed data (adjust to your chosen vehicle approach):**

  - Companies / chart sanity check if needed  
  - Warehouses: Main + Cutting/Operations  
  - Product categories and **service products** (PPF, ceramic, tint, windshield, etc.)  
  - Field Service **project/stages** matching Phase 1  
  - **Worksheet template** shell (or references if templates are created manually once and exported)  
  - Sample **contacts** and **vehicles**  
  - Optional: sample vendor, pricelist, one internal transfer route  

- **Explicitly out of scope for this module:**  
  - Annotation widget (Gap 1)  
  - Warranty policy models / follow-up engine (Gaps 2–3)  
  - Extra computed fields beyond what Studio/config already provide  

**Exit criteria:** Fresh DB + module install → team can execute Phase 1 workflow without hand-entering master data.

---

## Phase 3 — Gap analysis freeze (use both MD files as checklist)

From **Part 2** / gap tables: three gaps. For each, the lazy plan is to **choose one track** only when Phase 2 is done.

### Gap 1 — Visual car inspection diagram

**Options (from both docs):**  
(1) Configuration — photos + text/checklist  
(2) Studio — per-view image fields (upload pre-marked images)  
(3) Documents app  
(4) External annotation tool → upload  
(5) Automated Actions — N/A for drawing  
(6) Minimal custom module — **JS widget** for drawing on diagram inside worksheet  

**Lazy order:** (1)+(2)+(4) → evaluate → (6) only if mandatory.

### Gap 2 — Warranty follow-up engine

**Options:**  
Manual activities → **Activity Plans** → **Helpdesk** → **Automated Actions** (read product/task fields) → **custom** `warranty.policy` / `customer.warranty` / follow-up records  

**Constraint (arrangement doc):** Prefer **product.template** (or `warranty.policy`) fields over **category-only** rules.

**Lazy order:** Studio fields on product + manual proof → Automated Actions → small custom module if rules explode.

### Gap 3 — Warranty status (Valid / Expiring Soon / Expired)

**Options:**  
Studio dates + manual status → scheduled **Automated Action** to refresh status → custom **computed** fields + reporting  

**Lazy order:** Studio MVP → scheduled automation → custom module for reliable computation and reports.

---

## Phase 4 — Fill gaps (three maturity levels)

Matches **Part 3** in `standard_odoo_workflow.md` and Levels 1–3 in `chatgpt_arrangement.md`:

| Level | Content | Effort (indicative from docs) |
|-------|---------|-------------------------------|
| **1 — No-code MVP** | Enterprise + Studio: worksheets, vehicle model, image uploads, manual warranty/follow-up | ~3–5 days |
| **2 — Semi-automated** | Automated Actions on task delivered/stage; warranty fields on product/task; activities or Helpdesk | ~5–8 days |
| **3 — Production custom** | Small module: e.g. `warranty.policy`, `customer.warranty`, follow-up records; optional `torz.inspection.annotation` / JS widget | ~2–4 weeks (widget-dependent) |

**Rule:** Do not start Level 3 until Level 1 workflow and demo data module are accepted.

---

## Phase 5 — Roadmap alignment (from Part 4 / both docs)

After demo data module:

1. **Studio worksheets + vehicle data** — extend only what Phase 2 left as manual.  
2. **Inventory** — tighten lots, cycle count discipline.  
3. **Warranty tracking** — fields and reporting baseline.  
4. **Follow-up automation** — per Gap 2 decision.  
5. **Reporting & dashboards** — revenue, cost, warranty expiring 30/60/90.  
6. **Testing & go-live** — scenarios from Part 5 deliverables (standard_odoo_workflow.md).

---

## Phase 6 — Deliverables to keep traceability

From **Part 5** / arrangement doc:

- Text workflow diagram (already sketched in arrangement doc).  
- List of **apps** and **Studio fields**.  
- List of **automated actions** (when Level 2+).  
- **Custom module** manifest only if Level 3 — module layout: `__manifest__.py`, models, views, security, `data/`, `static/` for JS if Gap 1 widget.  
- **Testing scenarios** and **client questions** before build (standard_odoo_workflow.md Part 5).

---

## Dependency graph (lazy view)

```text
Phase 0 Preconditions
        ↓
Phase 1 Standard workflow (config)
        ↓
Phase 2 Demo data module (standard only)
        ↓
Phase 3 Gap decisions (per gap: config → Studio → AA → custom)
        ↓
Phase 4 Levels 1 → 2 → 3 (as needed)
        ↓
Phase 5–6 Hardening, reporting, go-live
```

---

## Open decisions (capture before coding anything beyond Phase 2)

- Vehicle: **Studio Customer Vehicle** vs Fleet vs contact-only.  
- Whether **annotation** is mandatory inside Odoo or upload-only is acceptable.  
- Whether warranty rules must be **policy-driven** (separate model) from day one or can start on product fields.

---

*This file is a planning umbrella; detailed field lists and slide decks live in the source markdown files.*
