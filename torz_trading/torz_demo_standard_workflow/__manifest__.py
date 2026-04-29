# -*- coding: utf-8 -*-
{
    "name": "Torz Trading — Phase 2 Demo Data",
    "summary": "Transactional demo data: customers, vehicles, opening stock, confirmed SOs with FSM tasks",
    "version": "19.0.1.0.0",
    "category": "Hidden",
    "license": "LGPL-3",
    "author": "Torz Trading / Bright Information",
    "depends": ["torz_phase1_workflow"],
    "data": [
        "data/res_partner_data.xml",
        "data/fleet_vehicle_data.xml",
        "data/stock_lot_data.xml",
        "data/sale_order_data.xml",
        "data/purchase_order_data.xml",
    ],
    "post_init_hook": "post_init_hook",
    "installable": True,
    "application": False,
}
