# -*- coding: utf-8 -*-
{
    "name": "Torz Trading — Phase 1 Standard Workflow",
    "summary": "Master data for Sales → Field Service → Inventory baseline (Torz Trading)",
    "version": "19.0.1.0.0",
    "category": "Services/Field Service",
    "license": "LGPL-3",
    "author": "Torz Trading / Bright Information",
    "depends": [
        "sale_management",
        "purchase",
        "stock",
        "account",
        "fleet",
        "industry_fsm_sale",
        "industry_fsm_report",
    ],
    "data": [
        "data/project_fsm_data.xml",
        "data/stock_warehouse_data.xml",
        "data/product_data.xml",
        "data/res_partner_data.xml",
        "data/fleet_vehicle_data.xml",
        "data/worksheet_template_data.xml",
    ],
    "installable": True,
    "application": False,
}
