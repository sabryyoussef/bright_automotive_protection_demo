# Torz Trading — Odoo 19 Enterprise Implementation

**Client:** Torz Trading — Automotive Protection & Tinting Center  
**Platform:** Odoo 19 Enterprise  
**Developer:** Bright Information  
**Repository:** https://github.com/sabryyoussef/bright_automotive_protection_demo

---

## What this project is

A phased Odoo Enterprise 19 implementation for an automotive protection and tinting center offering services including Paint Protection Film (PPF), Nano Ceramic Coating, Window Tinting, Windshield Protection, and Interior Protection.

The implementation follows a **lazy plan** — standard Odoo workflow first, demo data second, gap analysis third, then fill gaps with the simplest possible solution before escalating to custom code.

---

## Project structure

```
bright_information/
│
├── README.md                          ← this file
├── .gitignore
│
├── docs/                              ← source analysis documents
│   ├── standard_odoo_workflow.md      ← standard Odoo workflow analysis
│   ├── chatgpt_arrangement.md         ← gap analysis and solution options
│   └── planning/
│       └── lazy_implementation_plan.md ← master phased plan
│
└── torz_trading/                      ← all Odoo modules and tooling
    │
    ├── playwright/                    ← screenshot automation scripts
    ├── phase1_workflow_docs/          ← Phase 1 documentation
    ├── phase2_workflow_docs/          ← Phase 2 documentation
    │
    ├── torz_phase1_workflow/          ← Odoo module: Phase 1 master data
    ├── torz_demo_standard_workflow/   ← Odoo module: Phase 2 demo data
    └── torz_phase3_gap_analysis/      ← Odoo module: Phase 3 gap fills (in progress)
```

---

## Phases

### Phase 1 — Standard Workflow Configuration ✅ Done

**Module:** `torz_phase1_workflow`  
**Path:** `torz_trading/torz_phase1_workflow/`  
**Status:** Installed on `cleaning_demo` database

Seeds the master data needed to run the standard Odoo workflow without any custom code:

| Data | Detail |
|------|--------|
| FSM project | *Torz Trading — Field Service* |
| Job-card stages | New → Vehicle Received → In Progress → Quality Check → Ready for Delivery → Delivered → Closed |
| Service products | PPF, Nano Ceramic, Window Tinting, Windshield Protection, Interior Protection |
| Stock products | PPF Film Roll (lot), Tint Film Roll (lot), Ceramic Bottle, Shop Consumables |
| Warehouses | TMAIN (main stock) + TOPRS (cutting / operations) |
| Fleet | Demo brand + sedan model + 1 demo vehicle |
| Demo customer | Torz Demo Customer (person) |
| Worksheet template | Torz — Car Receiving Report |

**Install:**
```bash
py -3.12 odoo-bin -c odoo.conf -d <db> -i torz_phase1_workflow --stop-after-init
```

---

### Phase 2 — Demo Data Module ✅ Done

**Module:** `torz_demo_standard_workflow`  
**Path:** `torz_trading/torz_demo_standard_workflow/`  
**Status:** Installed on `cleaning_demo` database  
**Depends on:** `torz_phase1_workflow`

Seeds transactional demo data so the workflow is fully demonstrable in training and UAT:

| Data | Detail |
|------|--------|
| Customers | Ahmed Al-Rashidi, Mohammed Al-Zahrani, Fahad Al-Otaibi |
| Vendor | Gulf Auto Film Supplies Co. |
| Fleet vehicles | SAR-1001 Sedan, SAR-2002 SUV, SAR-3003 Pickup |
| Stock lots | PPF-ROLL-2024-001/2/3, TINT-ROLL-2024-001/2 |
| Opening stock | 6 PPF rolls, 6 tint rolls, 10 ceramic bottles in TMAIN |
| Sales Orders | 3 confirmed SOs — PPF, Ceramic, Tinting |
| FSM job cards | Auto-created, pre-staged: Vehicle Received / In Progress / New |
| Purchase Order | Draft PO to vendor for film materials |

A `post_init_hook` automatically applies opening stock, confirms SOs, and sets task stages on install.

**Install:**
```bash
py -3.12 odoo-bin -c odoo.conf -d <db> -i torz_demo_standard_workflow --stop-after-init
```

---

### Phase 3 — Gap Analysis & Fill 🔄 In Progress

**Module:** `torz_phase3_gap_analysis`  
**Path:** `torz_trading/torz_phase3_gap_analysis/`  
**Status:** Planning — awaiting client decisions  
**Depends on:** `torz_phase1_workflow`, `torz_demo_standard_workflow`

Three gaps identified that standard Odoo cannot handle natively:

| Gap | What is needed | Simplest solution | Full solution |
|-----|---------------|-------------------|---------------|
| **Gap 1** — Visual Car Inspection | Mark damage on car diagram inside job card | Studio image upload fields (1 hr) | Custom JS/OWL annotation widget (2–4 weeks) |
| **Gap 2** — Warranty Follow-up Engine | Auto-schedule follow-up activities per product warranty type (PPF: 5d/7d/yearly, Ceramic: yearly, Windshield: 3-monthly) | Automated Action on task delivery (1–2 days) | `warranty.policy` custom model (1–2 weeks) |
| **Gap 3** — Warranty Status Tracking | Show Valid / Expiring Soon / Expired badge; report warranties expiring in 30/60/90 days | Nightly cron Automated Action (1 day) | Computed fields + PDF certificate (5–7 days) |

**Key planning documents:**
- `torz_phase3_gap_analysis/PHASE3_GAP_ANALYSIS.md` — technical decision matrix per gap
- `torz_phase3_gap_analysis/CLIENT_QUESTIONS.md` — client questionnaire with effort/cost table

**Sub-folders (empty until decisions are confirmed):**
- `gap1_inspection/` — visual inspection solution
- `gap2_warranty_engine/` — warranty follow-up engine
- `gap3_warranty_status/` — warranty status badge + reporting

---

## Tooling

### Playwright screenshot scripts

**Path:** `torz_trading/playwright/`

Automated Playwright scripts that capture Odoo UI screenshots directly into each module's `static/description/` folder.

```
playwright/
├── capture_phase1.mjs    → writes to torz_phase1_workflow/static/description/
├── capture_phase2.mjs    → writes to torz_demo_standard_workflow/static/description/
└── package.json          → npm run capture-phase1 / capture-phase2
```

**Run:**
```powershell
cd torz_trading/playwright
npm install
$env:ODOO_PASSWORD="admin"
npm run capture-phase1    # or capture-phase2
```

---

### Documentation

| File / Folder | Purpose |
|---------------|---------|
| `docs/standard_odoo_workflow.md` | Standard Odoo workflow analysis for automotive protection centers |
| `docs/chatgpt_arrangement.md` | Full gap analysis with solution options for all 3 gaps |
| `docs/planning/lazy_implementation_plan.md` | Master phased implementation plan |
| `torz_trading/phase1_workflow_docs/` | Phase 1 walkthrough docs with screenshots |
| `torz_trading/phase2_workflow_docs/` | Phase 2 walkthrough doc (`PHASE2_DEMO_DATA.md`) |
| `torz_trading/torz_phase1_workflow/README.md` | Phase 1 module README (shown in Odoo Apps dashboard) |
| `torz_trading/torz_demo_standard_workflow/README.md` | Phase 2 module README (shown in Odoo Apps dashboard) |
| `torz_trading/torz_phase3_gap_analysis/PHASE3_GAP_ANALYSIS.md` | Gap technical decision plan |
| `torz_trading/torz_phase3_gap_analysis/CLIENT_QUESTIONS.md` | Client sign-off questionnaire |

---

## Odoo setup

**Database:** `cleaning_demo`  
**Port:** `8069`  
**Config:** `D:\odoo\odoo19\odoo_conf\odoo19.conf`  
**Python:** `py -3.12` (Odoo 19 requires Python 3.12)

**addons_path entry required:**
```
D:\odoo\odoo19\projects\bright_information\torz_trading
```

**Module install order:**
```
1. torz_phase1_workflow          (master data — install first)
2. torz_demo_standard_workflow   (demo data — requires phase 1)
3. torz_phase3_gap_analysis      (gap fills — installable=False until ready)
```

---

## Implementation roadmap

```
Phase 0  Preconditions (licensing, app list, vehicle model decision)   ✅
Phase 1  Standard workflow module (config + master data)               ✅
Phase 2  Demo data module (transactional data + hook)                  ✅
Phase 3  Gap analysis + client decisions                               🔄 In Progress
Phase 4  Fill gaps (Level 1 → 2 → 3 as needed)                        ⏳ Pending
Phase 5  Roadmap alignment (Studio, inventory, warranty, automation)   ⏳ Pending
Phase 6  Deliverables (reports, testing, go-live)                      ⏳ Pending
```
