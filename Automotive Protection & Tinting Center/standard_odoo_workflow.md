Act as a Senior Odoo v19 Enterprise Functional Consultant and Solution Architect.

I need an Odoo Enterprise solution analysis for an automotive protection and tinting center called Torz Trading.

Important:
- Focus first on normal Odoo Enterprise workflow without custom code.
- Then identify only the real gaps.
- For every gap, show all possible ways to fill it:
  1) Configuration only
  2) Odoo Studio
  3) Automated Actions
  4) Minimal custom module
- Do not jump directly to custom code.
- Prefer standard Odoo Enterprise modules: Sales, Inventory, Purchase, Field Service, Worksheets, Helpdesk, Accounting, Studio, Documents, CRM if needed.
- Keep the solution upgrade-safe and simple.

Part 1 — Standard Odoo Workflow

Explain the recommended standard workflow for:

1. Customer / Vehicle Registration
- How to register customer.
- How to register vehicle details.
- Best model to use: contact custom fields, equipment, asset, fleet vehicle, or custom Studio model.
- Explain pros and cons.

2. Sales & Service Booking
- Create quotation for automotive services.
- Confirm Sales Order.
- Auto-create Field Service Task / Job Card from service product.
- Use Field Service stages: New, Received, In Progress, Quality Check, Delivered, Closed.

3. Car Receiving Report
- Use Field Service Worksheet Template.
- Add fields for:
  - Plate number
  - VIN / chassis number
  - Brand
  - Model
  - Color
  - Mileage
  - Exterior checklist
  - Interior checklist
  - Accessories received
  - Customer signature
  - Technician notes
- Explain what can be done by standard Worksheet + Studio.

4. Inventory & Material Flow
- Purchase raw materials into Main Warehouse.
- Internal transfer from Main Warehouse to Cutting / Operations Warehouse.
- Track rolls, film, tint, ceramic, consumables.
- Explain whether to use lot/serial tracking.
- Explain daily cycle count in Operations Warehouse.
- Explain how material consumption can be recorded from Field Service Task using Products on Tasks or inventory moves.

5. Delivery & Invoicing
- Complete Field Service Task.
- Customer signs worksheet.
- Invoice from Sales Order / delivered services.
- Record payment in Accounting.
- Produce revenue and cost reports.

6. After-Sales / Warranty
- Use Helpdesk / Activities / CRM for follow-up.
- Explain what standard Odoo can do without code.
- Explain limitations.

Part 2 — Gap Analysis

Create a table with columns:
- Requirement
- Can Odoo Enterprise handle it natively?
- Best no-code option
- Studio option
- Automated Action option
- Custom code option
- Recommendation

Analyze these gaps:

Gap 1: Visual Car Inspection Diagram
Need to mark scratches, cracks, chips, rust, and paint defects on car diagrams: front, back, left, right, top.

Explain options:
- Upload marked images manually as attachments.
- Use Worksheet image fields.
- Use Documents app.
- Use Studio fields.
- Use external image annotation tool.
- Use custom JS widget inside worksheet.

Recommend the simplest production option first, and only then mention custom JS.

Gap 2: Warranty Follow-up Engine
Different products require different follow-up schedules:
- Paint Protection Film: after 5 days, after 7 days, then yearly.
- Windshield / Panoramic / Leather / Plastic: every 3 months until warranty expiry.
- Nano Ceramic / Screen Protection: yearly until warranty expiry.

Explain options:
- Manual scheduled activities.
- Activity Plans.
- Helpdesk tickets.
- Automated Actions.
- Custom warranty policy model.

Recommend the best scalable approach.

Gap 3: Warranty Status Tracking
Need warranty status: Valid / Expired / Expiring Soon.
Warranty duration can be 3 months to 10 years depending on service/product.

Explain options:
- Studio fields on product and task.
- Computed fields using Automated Actions.
- Custom model: warranty.policy and customer.warranty.
- Reporting for warranties expiring in next 30/60/90 days.

Part 3 — Recommended Final Design

Give me the recommended solution in 3 levels:

Level 1: No-code MVP using Odoo Enterprise + Studio only.
Level 2: Semi-automated solution using Automated Actions.
Level 3: Clean production solution using a small custom module.

For each level, provide:
- Apps needed
- Setup steps
- Data model
- Workflow
- Limitations
- Estimated development effort

Part 4 — Implementation Roadmap

Give me a step-by-step implementation plan:
Phase 1: Standard configuration
Phase 2: Studio worksheets and vehicle data
Phase 3: Inventory and warehouse setup
Phase 4: Warranty tracking
Phase 5: Follow-up automation
Phase 6: Reporting and dashboard
Phase 7: Testing and go-live

Part 5 — Deliverables

Provide:
- Final workflow diagram in text format
- Required Odoo apps
- Required Studio fields
- Required automated actions
- Required custom module only if needed
- Testing scenarios
- Questions to ask the client before implementation