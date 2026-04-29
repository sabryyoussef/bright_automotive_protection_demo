# -*- coding: utf-8 -*-
{
    "name": "Torz Trading — Phase 3 Gap Analysis",
    "summary": "Fills the three gaps: visual inspection, warranty follow-up engine, warranty status tracking",
    "version": "19.0.1.0.0",
    "category": "Services/Field Service",
    "license": "LGPL-3",
    "author": "Torz Trading / Bright Information",
    "depends": [
        "torz_phase1_workflow",
        "torz_demo_standard_workflow",
        # Gap-specific dependencies added below as each gap is implemented:
        # "helpdesk",          # Gap 2 — warranty follow-up via Helpdesk
        # "web",               # Gap 1 — custom JS annotation widget
    ],
    "data": [
        # Data files added per gap:
        # "gap1_inspection/data/worksheet_inspection_data.xml",
        # "gap2_warranty_engine/data/warranty_policy_data.xml",
        # "gap3_warranty_status/data/warranty_status_data.xml",
    ],
    "installable": False,   # set True when first gap is ready to ship
    "application": False,
}
