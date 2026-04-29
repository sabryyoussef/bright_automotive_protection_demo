# Torz Trading — Gap Solutions: Client Questions & Effort Estimates

**Purpose:** Before we implement any of the three gaps, we need your answers to the questions below.  
Each question is tied directly to a solution track. The simpler your answer, the faster and cheaper the delivery.  
Costs are left blank — your team fills them in based on agreed rates.

---

## How to read this document

Each gap has:
- A plain-language description of what we need to build.
- A set of **questions** with **two or more options** per question.
- A **track comparison table** showing how your choices affect implementation time.
- An **effort range** (in developer-days) for each possible combination.

> **Important:** Options are not better or worse in quality — they differ in flexibility, maintenance cost, and delivery speed. We always recommend the simplest option that meets your real business need.

---

---

# GAP 1 — Visual Car Inspection Diagram

## What this gap is about

When a technician receives a vehicle, they need to record visible damage (scratches, cracks, chips, rust, paint defects) on a diagram of the car — front, back, left side, right side, and top view — both **before** and **after** the job.

The standard Odoo Field Service Worksheet supports text fields, checklists, and notes. It does **not** support drawing on a car diagram out of the box. This gap asks: how do we get that car damage map into Odoo?

---

## Questions for Gap 1

---

### Q1-A — Where should the inspection record live?

> When the technician completes the car inspection, where should the result be stored?

| Option | Description | Notes |
|--------|-------------|-------|
| **A1 — Inside the Field Service job card** | The inspection form is part of the worksheet the technician fills in when they open the job. | Most integrated. Customer signature and inspection on the same screen. |
| **A2 — As a separate document/attachment on the job card** | The inspection is a separate file (PDF, image) attached to the task. The technician uploads it from their phone. | Simpler. No Odoo customization needed for the form itself. |
| **A3 — In a dedicated Inspection screen (separate menu)** | A standalone Odoo screen for inspections, linked to the job card but separate. | More overhead. Useful only if inspection team is different from the technician. |

**Your answer:** _______________

---

### Q1-B — How should the technician mark damage on the car diagram?

> This is the most important question for this gap. The answer drives 90% of the implementation effort.

| Option | Description | Effort | What the technician does |
|--------|-------------|--------|--------------------------|
| **B1 — Photo upload only** | The technician takes a photo of a printed car diagram with damage marked by hand (pen/marker), then uploads the image to the job card. | **Minimal** (Studio — 1 hour) | Print → mark → photograph → upload |
| **B2 — Upload a pre-annotated photo from phone** | Technician uses the phone's built-in photo editor or a free annotation app (e.g. Markup on iPhone, Samsung Notes) to draw on the car diagram image, then uploads it to Odoo. | **Minimal** (Studio — 1 hour) | Annotate on phone → upload |
| **B3 — Upload a PDF annotation** | Odoo Documents app holds a car diagram PDF. Technician opens it, uses the built-in PDF annotation tools (highlight, draw, comment), saves, and it auto-links to the job card. | **Low** (configuration — 1 day) | Open PDF in Odoo → annotate → save |
| **B4 — Draw directly inside Odoo (custom widget)** | A custom interactive car diagram is embedded inside the Odoo worksheet. Technician taps/clicks on the car view to place damage markers, selects damage type from a list, and saves — all inside Odoo on a tablet or PC. | **High** (custom JS development — 10–15 days) | Open job card → tap diagram → mark damage |

**Your answer:** _______________

---

### Q1-C — How many car views are required?

> Which views of the car must be shown in the inspection diagram?

| Option | Views included | Notes |
|--------|----------------|-------|
| **C1 — 4 views** | Front, Back, Left, Right | Standard for most auto shops |
| **C2 — 5 views** | Front, Back, Left, Right, Top | Adds roof/sunroof damage tracking |
| **C3 — 2 views** | Front + Back only (simplified) | Fastest to implement if only exterior panels matter |

**Your answer:** _______________

---

### Q1-D — Pre-wash and post-wash (two inspections per job)?

> Some shops require one inspection when the vehicle is received (pre-wash) and a second when it is delivered (post-wash/post-job) to document the condition before and after.

| Option | Description | Effort delta |
|--------|-------------|-------------|
| **D1 — One inspection per job** | Single inspection at vehicle receipt only | Baseline |
| **D2 — Two inspections per job** | Pre-job inspection + post-job inspection (double the fields/uploads) | +50% effort on top of Q1-B choice |

**Your answer:** _______________

---

### Q1-E — Does the customer sign off on the inspection?

| Option | Description |
|--------|-------------|
| **E1 — No signature needed** | Photo or marks are sufficient |
| **E2 — Customer signature on the worksheet** | Odoo Worksheet already supports electronic signatures — enable it in the template |
| **E3 — Customer receives a copy by email** | After signing, auto-send the signed worksheet as PDF to customer email — native Odoo capability |

**Your answer:** _______________

---

### Gap 1 — Effort summary based on your answers

| Q1-B choice | Q1-D choice | Total estimated effort |
|-------------|-------------|----------------------|
| B1 or B2 (photo upload) | D1 (one inspection) | **1 hour** (Studio only) |
| B1 or B2 (photo upload) | D2 (two inspections) | **2 hours** (Studio only) |
| B3 (PDF annotation) | D1 | **1 day** (Documents config) |
| B3 (PDF annotation) | D2 | **1.5 days** |
| B4 (custom widget) | D1 | **10–15 days** (custom JS module) |
| B4 (custom widget) | D2 | **12–18 days** |

**Estimated cost:** _______________  
**Decision date:** _______________  
**Approved by:** _______________

---

---

# GAP 2 — Warranty Follow-up Engine

## What this gap is about

After a job is delivered, the customer needs to be contacted according to a specific follow-up schedule that depends on the **service/product** they received. Standard Odoo does not know which product needs which follow-up schedule — that must be configured or coded.

The current warranty schedules (from your product profiles):

| Service | Warranty duration | Follow-up schedule |
|---------|-------------------|--------------------|
| Paint Protection Film (PPF) | 5 years | Contact at Day 5, Day 7, then every 1 year |
| Nano Ceramic Coating | 2 years | Every 1 year |
| Screen Protection | 2 years | Every 1 year |
| Windshield Protection | 1 year | Every 3 months |
| Panoramic Protection | 1 year | Every 3 months |
| Leather Protection | 1 year | Every 3 months |
| Plastic Protection | 1 year | Every 3 months |
| Interior Protection | 1 year | Every 3 months |

---

## Questions for Gap 2

---

### Q2-A — How should follow-ups be created in Odoo?

> When the job is delivered, what should Odoo generate for the customer service team?

| Option | Description | What staff sees | Effort |
|--------|-------------|-----------------|--------|
| **A1 — Scheduled Activities** | Odoo creates a to-do activity (like a reminder) on the customer's record for each follow-up date. Staff sees them in their activity list. | "Call Ahmed Al-Rashidi on 5-May for PPF 5-day check" | **Low** (1–2 days) |
| **A2 — Helpdesk Tickets** | Odoo creates a Helpdesk ticket for each follow-up date. Tickets can be assigned to a team, tracked, escalated. | A ticket in the After-Sales queue per follow-up | **Medium** (2–3 days) |
| **A3 — Sales activities on the SO** | Activities created on the original Sales Order for reference | Visible on the SO chatter | **Low** (1–2 days) |
| **A4 — Automated emails to customer** | Odoo sends scheduled emails directly to the customer at each follow-up date | Customer gets email; no internal task created | **Medium** (2–3 days — email templates + scheduler) |
| **A5 — All of the above (Activities + Helpdesk + Email)** | Comprehensive: internal activity + Helpdesk ticket + customer email | Full tracking at all levels | **High** (4–6 days) |

**Your answer:** _______________

---

### Q2-B — Should the follow-up schedule be hardcoded or configurable?

> This is the second most important question for this gap.

| Option | Description | Who can change it later | Effort |
|--------|-------------|------------------------|--------|
| **B1 — Hardcoded in the system** | The schedule for each product type is written into the code (PPF: 5d/7d/yearly, etc.). Changing it requires a developer. | Developer only | **Lower** (+0 days vs baseline) |
| **B2 — Configurable via Studio fields on the product** | Each product has fields: `Warranty Duration (months)` and `Follow-up Schedule` (dropdown: PPF / Ceramic / Windshield / None). Staff can reassign a product to a different schedule. | Any staff with product write access | **Low** (+0.5 days) |
| **B3 — Fully configurable via a Warranty Policy screen** | A dedicated screen in Odoo where staff create/edit warranty policies (name, duration, follow-up day list). Products link to a policy. Adding a new service type needs no developer. | Admin staff, no developer needed | **Medium** (+3–5 days — custom model) |

**Your answer:** _______________

---

### Q2-C — What triggers the follow-up creation?

| Option | Description | Notes |
|--------|-------------|-------|
| **C1 — When the job card stage changes to "Delivered"** | The moment a technician moves the task to "Delivered", the engine fires. | Recommended — real-time |
| **C2 — When the Sales Order invoice is confirmed** | Follow-ups created only after the customer pays. | Safer from a billing perspective |
| **C3 — Manual trigger (button on the job card)** | A "Generate Follow-ups" button that staff clicks after delivery. | Safe but requires human action; can be missed |

**Your answer:** _______________

---

### Q2-D — What happens if a job has multiple services?

> If a single Sales Order has both PPF and Nano Ceramic, should the system:

| Option | Description |
|--------|-------------|
| **D1 — Create follow-ups for each service independently** | Two separate follow-up chains: one for PPF (5d/7d/1yr) and one for Ceramic (1yr). |
| **D2 — Use only the longest warranty service on the order** | One follow-up chain based on the service with the longest warranty. Simpler, less noise. |
| **D3 — Let staff choose per job** | A checkbox per service line: "Include in warranty follow-up? Yes/No" |

**Your answer:** _______________

---

### Q2-E — What should happen when a follow-up is overdue and missed?

| Option | Description |
|--------|-------------|
| **E1 — Nothing (staff handles it manually)** | Overdue activities/tickets remain open; no escalation. |
| **E2 — Escalate to a manager activity after X days** | If a follow-up activity is not done within X days of its due date, a new activity is auto-created for the manager. |
| **E3 — Send a reminder email to the responsible user** | Odoo sends an internal email to the assigned staff member. |

**Your answer:** _______________

---

### Gap 2 — Effort summary based on your answers

| Q2-A | Q2-B | Trigger | Estimated effort |
|------|------|---------|-----------------|
| A1 Activities | B1 Hardcoded | C1 Stage | **1–2 days** |
| A1 Activities | B2 Studio fields | C1 Stage | **2 days** |
| A2 Helpdesk tickets | B2 Studio fields | C1 Stage | **2–3 days** |
| A4 Emails | B2 Studio fields | C1 Stage | **2–3 days** |
| A5 All | B2 Studio fields | C1 Stage | **4–5 days** |
| Any A | B3 Policy screen | Any C | **+3–5 days** on top of above |
| + D3 Per-line choice | | | **+1 day** |
| + E2 Escalation | | | **+1 day** |

**Estimated cost:** _______________  
**Decision date:** _______________  
**Approved by:** _______________

---

---

# GAP 3 — Warranty Status Tracking

## What this gap is about

Each delivered service has a warranty period. You need to see — at a glance — whether a customer's warranty is currently **Valid**, **Expiring Soon**, or **Expired**. This must be visible on the job card and ideally searchable/reportable (e.g. "show me all warranties expiring in the next 30 days").

Standard Odoo can store dates but does not compute a warranty status badge automatically.

---

## Questions for Gap 3

---

### Q3-A — Where should the warranty status badge appear?

| Option | Description | Effort |
|--------|-------------|--------|
| **A1 — On the Field Service job card** | A colored badge (green/orange/red) on the task form. Staff sees it when they open the job. | **Low** |
| **A2 — On the customer contact form** | The customer's record shows all their active warranties. Useful for front desk. | **Medium** (+1 day) |
| **A3 — On the Sales Order** | Badge visible on the original SO for billing/account teams. | **Medium** (+1 day) |
| **A4 — On a dedicated Warranty Register list** | A separate menu item "Warranties" showing all customer warranties in a list with filters. | **Medium–High** (+2–3 days — dedicated model or view) |
| **A5 — All of the above** | Badge everywhere — job card, contact, SO, and a warranty list. | **High** (+4–5 days) |

**Your answer:** _______________

---

### Q3-B — How precise must the status be?

| Option | Status values | Update frequency | Effort |
|--------|--------------|-----------------|--------|
| **B1 — Two states: Valid / Expired** | Simple binary — either under warranty or not. | Nightly (acceptable 24h delay) | **Lowest** |
| **B2 — Three states: Valid / Expiring Soon / Expired** | "Expiring Soon" triggers within the last 30 days of warranty. | Nightly | **Low** |
| **B3 — Three states + real-time** | Same as B2 but always live — computed the moment you open the record. | Real-time (every page load) | **Medium** (computed field, custom module) |

**Your answer:** _______________

---

### Q3-C — What is "Expiring Soon"?

> If you chose B2 or B3 above, define the warning window:

| Option | Warning starts |
|--------|---------------|
| **C1 — 30 days before expiry** | Standard |
| **C2 — 60 days before expiry** | More lead time for customer contact |
| **C3 — 90 days before expiry** | Maximum lead time |
| **C4 — Configurable (staff sets the threshold in settings)** | +0.5 days extra |

**Your answer:** _______________

---

### Q3-D — What reporting do you need on warranties?

| Option | Description | Effort |
|--------|-------------|--------|
| **D1 — No separate report** | Use standard list view filters ("Expiring this month") | Baseline |
| **D2 — Filtered list view** | Add saved filters: "Expiring in 30 days", "Expiring in 60 days", "Expired" | **Low** (+0.5 day) |
| **D3 — Dashboard widget** | A count tile on the Odoo dashboard: "12 warranties expiring this month" | **Medium** (+1–2 days) |
| **D4 — Scheduled report email** | Every Monday, send a manager an email listing warranties expiring in the next 30 days | **Medium** (+1 day) |
| **D5 — Full printable warranty certificate** | A PDF certificate per customer listing all their active warranties | **High** (+2–3 days — custom report template) |

**Your answer:** _______________

---

### Q3-E — Should the warranty clock start from delivery date or invoice date?

| Option | Description | Notes |
|--------|-------------|-------|
| **E1 — Field Service task delivery date** | Warranty starts when the technician marks the job Delivered | Most accurate operationally |
| **E2 — Sales Order invoice confirmation date** | Warranty starts when the customer pays | Aligns warranty with financial record |
| **E3 — Manual date entry** | Staff enters warranty start date by hand on the job card | Flexible but error-prone |

**Your answer:** _______________

---

### Gap 3 — Effort summary based on your answers

| Q3-A | Q3-B | Q3-D | Estimated effort |
|------|------|------|-----------------|
| A1 (task only) | B1 (2 states) | D1 (no report) | **0.5 day** (Studio + cron) |
| A1 (task only) | B2 (3 states, nightly) | D2 (filtered list) | **1 day** |
| A1 (task only) | B3 (3 states, real-time) | D2 | **1.5 days** (computed field) |
| A4 (warranty register) | B3 (real-time) | D4 (scheduled email) | **3–4 days** |
| A5 (everywhere) | B3 (real-time) | D5 (PDF certificate) | **5–7 days** |

**Estimated cost:** _______________  
**Decision date:** _______________  
**Approved by:** _______________

---

---

# Combined Summary — All 3 Gaps

## Minimum viable (fastest delivery)

Answer: B1/B2 for Gap 1, A1+B1+C1 for Gap 2, A1+B2+D2 for Gap 3.

| Gap | Track | Effort |
|-----|-------|--------|
| Gap 1 — Photo upload (Studio) | B1 | 1 hour |
| Gap 2 — Activities, hardcoded schedule (AA) | A1+B1+C1 | 1–2 days |
| Gap 3 — Status badge on task, nightly (cron) | A1+B2+D2 | 1 day |
| **Total MVP** | | **~3 days** |
| **Cost** | | ___________ |

---

## Recommended balanced (good for production)

Answer: B2 for Gap 1, A2+B2+C1 for Gap 2, A1+A4+B3+D4 for Gap 3.

| Gap | Track | Effort |
|-----|-------|--------|
| Gap 1 — Phone annotation upload (Studio) | B2 | 1 hour |
| Gap 2 — Helpdesk tickets, Studio fields, stage trigger | A2+B2+C1 | 2–3 days |
| Gap 3 — Badge on task + warranty list, real-time + email | A1+A4+B3+D4 | 3–4 days |
| **Total Balanced** | | **~6–7 days** |
| **Cost** | | ___________ |

---

## Full production (most flexible, most maintainable)

Answer: B4 for Gap 1, A5+B3+C1 for Gap 2, A5+B3+D5 for Gap 3.

| Gap | Track | Effort |
|-----|-------|--------|
| Gap 1 — Custom JS annotation widget inside worksheet | B4 | 10–15 days |
| Gap 2 — All channels + Warranty Policy model | A5+B3+C1 | 7–10 days |
| Gap 3 — Real-time badge everywhere + PDF certificate | A5+B3+D5 | 5–7 days |
| **Total Full** | | **~22–32 days** |
| **Cost** | | ___________ |

---

## Sign-off

Please fill in one answer per question, then return this document. We will not write any code until this sheet is completed and signed.

| | |
|---|---|
| **Client name** | _______________ |
| **Reviewed by (developer)** | _______________ |
| **Date** | _______________ |
| **Approved** | Yes / No |

---

*Document generated from: `PHASE3_GAP_ANALYSIS.md` — Torz Trading, Bright Information, Odoo 19 Enterprise*
