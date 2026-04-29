# Torz Trading — Phase 3: Gap Analysis & Decision Plan

**Module:** `torz_phase3_gap_analysis`  
**Depends on:** `torz_phase1_workflow`, `torz_demo_standard_workflow`  
**Status:** PLANNING — review decisions below before implementing anything  
**Principle:** Lazy — choose the simplest track that works; escalate only if needed.

---

## The 3 Gaps (from source docs)

| # | Gap | Business need | Odoo native? |
|---|-----|---------------|-------------|
| 1 | Visual Car Inspection | Mark scratches/cracks on car diagram (front, back, sides, top) | No — worksheets are text/checklist only |
| 2 | Warranty Follow-up Engine | Auto-schedule staggered reminders per product (PPF: 5d, 7d, yearly; Ceramic: yearly; Windshield: 3-monthly) | No — no product-specific multi-stage scheduler |
| 3 | Warranty Status Tracking | Show Valid / Expiring Soon / Expired badge on task/SO; report warranties due in 30/60/90 days | Partial — Studio can store dates but not compute dynamic status |

---

## Gap 1 — Visual Car Inspection Diagram

### Business requirement
Technician opens the job card worksheet and marks damage locations (Scratch, Crack, Chip, Rust, Paint Defect) on a 4-view car diagram (front, back, left, right + optionally top) before and after the job.

### Option matrix

| Track | Approach | Effort | Limitations |
|-------|----------|--------|-------------|
| **A — Config only** | Attach photos of pre-marked printed form as task attachments | 0 dev | Not digital, no structure, hard to report |
| **B — Studio fields** | Add 5 × Image fields to worksheet template (one per car view); technician uploads a pre-marked photo | 1 hr Studio | Upload-only, no in-app drawing |
| **C — External tool** | Technician uses phone annotation app (e.g. Markup, Adobe) → uploads result image | 0 dev | Friction, separate tool, no Odoo data |
| **D — Documents app** | Store car diagrams as Documents → annotate with built-in PDF annotation → link to task | 0 dev | Enterprise Documents required; limited to PDF annotations |
| **E — Custom JS widget** | OWL widget inside worksheet: SVG car diagram, click/drag to place damage markers, saves JSON to task field | 2–4 weeks | Full custom; hard to maintain; highest value |

### Lazy recommendation — **Track B first → Track E if mandatory**

**Start with Track B (Studio image fields):**
1. Open the `Torz — Car Receiving Report` worksheet template in Studio.
2. Add 5 × Binary/Image fields: `x_inspection_front`, `x_inspection_back`, `x_inspection_left`, `x_inspection_right`, `x_inspection_top`.
3. Technician photographs a pre-printed diagram with damage marked in pen → uploads each view.
4. Live in production within a day.

**Escalate to Track E (Custom JS widget) only if:**
- Client explicitly requires in-app drawing (not upload).
- After Track B is validated in UAT and found insufficient.

### Decision needed from client
> **Q1:** Is uploading a photographed/annotated diagram image acceptable, or is drawing directly inside Odoo mandatory?

### Files to create (Track B — Studio only, no code)
- None in this module — done entirely in Odoo Studio UI.

### Files to create (Track E — custom widget)
```
gap1_inspection/
├── __init__.py
├── models/
│   └── project_task.py          # adds x_inspection_data (Json field)
├── views/
│   └── worksheet_inspection.xml # inherits worksheet, adds widget
└── static/src/
    ├── js/
    │   └── car_inspection_widget.js   # OWL component
    └── xml/
        └── car_inspection_widget.xml  # template
```

---

## Gap 2 — Warranty Follow-up Engine

### Business requirement
When a job card is **Delivered** (task stage = Delivered/Closed), automatically create a series of scheduled activities or Helpdesk tickets based on the **product's warranty schedule**:

| Product group | Warranty period | Follow-up schedule |
|---|---|---|
| PPF (Paint Protection Film) | 5 years | Day 5, Day 7, then every 1 year |
| Nano Ceramic / Screen Protection | 2 years | Every 1 year |
| Windshield / Panoramic / Leather / Plastic | 1 year | Every 3 months |

### Option matrix

| Track | Approach | Effort | Scalability |
|-------|----------|--------|-------------|
| **A — Manual activities** | Technician/admin creates next-activity by hand after delivery | 0 dev | Not scalable |
| **B — Activity Plans** | Studio Activity Plans attached to task; manually triggered | 1 hr config | Partially automated; manual trigger |
| **C — Helpdesk tickets** | Manual Helpdesk ticket creation per delivered job | 0 dev | Hard to manage at volume |
| **D — Automated Action** | Python Automated Action fires when task stage = Delivered; reads `x_warranty_schedule` on product; creates `mail.activity` records | 1–2 days | Good for up to ~3 schedule types |
| **E — Custom warranty.policy model** | `warranty.policy` model linked to product; `customer.warranty` records per delivery; engine creates follow-ups from policy | 1–2 weeks | Production-grade; fully configurable |

### Lazy recommendation — **Track D first → Track E if rules grow**

**Track D (Automated Action):**
1. Add fields to `product.template` via Studio:
   - `x_warranty_months` (Integer) — warranty duration in months
   - `x_warranty_schedule` (Selection) — `ppf` / `ceramic` / `windshield` / `none`
2. Write an **Automated Action** on `project.task` (trigger: stage changes to *Delivered*):
   - Reads `x_warranty_schedule` from each sale line's product.
   - Creates `mail.activity` records on the partner for each follow-up date.
3. No custom model needed — uses native `mail.activity`.

**Escalate to Track E only if:**
- More than 3 distinct warranty schedules exist.
- Client needs a warranty register report (list all warranties, expiry, customer).
- Follow-up rules change frequently and must be configurable by staff.

### Warranty schedule data (from source docs)

```python
WARRANTY_SCHEDULES = {
    "ppf": {
        "duration_months": 60,   # 5 years
        "followup_days": [5, 7, 365, 730, 1095, 1460, 1825],
    },
    "ceramic": {
        "duration_months": 24,   # 2 years
        "followup_days": [365, 730],
    },
    "windshield": {
        "duration_months": 12,   # 1 year
        "followup_days": [90, 180, 270, 365],
    },
}
```

### Decision needed from client
> **Q2:** Should follow-up schedules be hardcoded (simpler) or configurable by staff from a UI without developer access (more complex)?  
> **Q3:** Should follow-ups create **Activities** (internal tasks for staff) or **Helpdesk tickets** (trackable, customer-visible)?

### Files to create (Track D — Automated Action)
```
gap2_warranty_engine/
├── __init__.py
├── models/
│   └── project_task.py          # _onchange / override write() to fire on stage change
├── data/
│   ├── warranty_product_fields.xml   # Studio-equivalent fields via ir.model.fields
│   └── warranty_automated_action.xml # ir.actions.server record
└── security/
    └── ir.model.access.csv
```

### Files to create (Track E — warranty.policy model)
```
gap2_warranty_engine/
├── models/
│   ├── warranty_policy.py       # warranty.policy model
│   ├── customer_warranty.py     # customer.warranty model (per delivery)
│   └── project_task.py          # hook on task delivery
├── views/
│   ├── warranty_policy_views.xml
│   └── customer_warranty_views.xml
├── data/
│   └── warranty_policy_data.xml # seed policies for PPF, Ceramic, Windshield
└── security/
    └── ir.model.access.csv
```

---

## Gap 3 — Warranty Status Tracking

### Business requirement
- Each delivered service record must show: **Valid** / **Expiring Soon** (within 30 days) / **Expired**.
- Manager needs a report of warranties expiring in 30 / 60 / 90 days.

### Option matrix

| Track | Approach | Effort | Limitations |
|-------|----------|--------|-------------|
| **A — Studio date fields** | Add `x_warranty_start` and `x_warranty_end` to task; staff reads them manually | 1 hr Studio | No computed badge; manual maintenance |
| **B — Automated Action (scheduled)** | Nightly cron: sets `x_warranty_status` (Char) on task by comparing today vs `x_warranty_end` | 1 day | Status is a day stale max; no real-time |
| **C — Custom computed field** | `warranty_status` = `@api.depends('x_warranty_end')` on task model; always live | 1 day Python | Requires custom module |
| **D — Full warranty register** | `customer.warranty` model with computed `status`; list view with expiry filters | 2–3 days | Most maintainable |

### Lazy recommendation — **Track B first → Track C/D alongside Gap 2 Track E**

**Track B (Automated Action):**
1. Studio: add `x_warranty_end` (Date) and `x_warranty_status` (Selection: valid/expiring/expired) to `project.task`.
2. Automated Action (time-based, daily at 06:00): loop all tasks with warranty; compare `x_warranty_end` to today; write `x_warranty_status`.
3. List view filter: *Expiring in 30 days* → `x_warranty_end <= today+30 AND x_warranty_status = valid`.

**Escalate to Track C/D when Gap 2 Track E is chosen** (they share the `customer.warranty` model).

### Decision needed from client
> **Q4:** Should warranty status be on the **Field Service Task** or on a dedicated **Warranty Register** (separate list)?  
> **Q5:** Is a nightly refresh acceptable or does the badge need to be real-time?

### Files to create (Track B — Automated Action)
```
gap3_warranty_status/
├── data/
│   ├── warranty_status_fields.xml      # ir.model.fields: x_warranty_end, x_warranty_status
│   └── warranty_status_cron.xml        # ir.cron (daily) + ir.actions.server
```

### Files to create (Track C — computed field)
```
gap3_warranty_status/
├── __init__.py
├── models/
│   └── project_task.py   # inherits project.task, adds warranty_status computed field
└── views/
    └── task_warranty_view.xml  # adds badge to task form + list
```

---

## Summary decision table

| Gap | Recommended start track | Escalation trigger | Estimated effort (start) |
|-----|------------------------|--------------------|--------------------------|
| Gap 1 — Inspection diagram | **B** Studio image upload fields | Client needs in-app drawing | 1 hr (Studio) |
| Gap 2 — Warranty follow-up | **D** Automated Action on task stage | >3 schedule types / warranty register needed | 1–2 days |
| Gap 3 — Warranty status | **B** Nightly Automated Action cron | Real-time badge needed | 1 day |

---

## Open questions for client (resolve before coding)

| # | Question | Impact on track choice |
|---|----------|------------------------|
| Q1 | Upload-only inspection diagram or must draw inside Odoo? | Gap 1: Studio vs JS widget |
| Q2 | Warranty schedules hardcoded or configurable by staff? | Gap 2: AA vs Policy model |
| Q3 | Follow-ups as Activities or Helpdesk tickets? | Gap 2: model choice |
| Q4 | Warranty status on Task form or separate Warranty Register? | Gap 3: field location |
| Q5 | Nightly status refresh acceptable or real-time badge needed? | Gap 3: cron vs computed |

---

## Execution order (once decisions are made)

```
Phase 3 execution order
─────────────────────────────────────
Step 1: Gap 3 Track B  (Studio fields + cron)      ← simplest, standalone
Step 2: Gap 1 Track B  (Studio image fields)       ← Studio, no code
Step 3: Gap 2 Track D  (Automated Action)          ← first Python
─────────────────────────────────────
Escalation path (if needed):
Step 4: Gap 2 Track E  (warranty.policy model)     ← replaces Step 3
Step 5: Gap 3 Track D  (customer.warranty + status) ← shares Step 4 model
Step 6: Gap 1 Track E  (JS annotation widget)      ← last, most expensive
```

---

## Module structure (current state — skeleton only)

```
torz_phase3_gap_analysis/
├── __init__.py
├── __manifest__.py            (installable=False until first gap ships)
├── PHASE3_GAP_ANALYSIS.md     ← this file
├── gap1_inspection/           (empty — waiting for Q1 decision)
├── gap2_warranty_engine/      (empty — waiting for Q2/Q3 decision)
└── gap3_warranty_status/      (empty — waiting for Q4/Q5 decision)
```
