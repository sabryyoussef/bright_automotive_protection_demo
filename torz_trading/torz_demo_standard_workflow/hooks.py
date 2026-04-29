import logging

_logger = logging.getLogger(__name__)

MOD = "torz_demo_standard_workflow"
P1 = "torz_phase1_workflow"


def post_init_hook(env):
    """
    Run after all XML data files are loaded:
      1. Set opening stock in Torz Main Warehouse (TMAIN).
      2. Confirm the 3 demo Sales Orders → auto-creates Field Service tasks.
      3. Move each task to its target stage for a realistic demo snapshot.
    """
    _set_opening_stock(env)
    _confirm_sale_orders(env)


# ── Opening stock ─────────────────────────────────────────────────────────────

def _set_opening_stock(env):
    main_wh = env.ref(f"{P1}.torz_warehouse_main", raise_if_not_found=False)
    if not main_wh:
        _logger.warning("torz_demo: TMAIN not found — skipping opening stock")
        return
    loc = main_wh.lot_stock_id

    SQ = env["stock.quant"]

    # PPF rolls — 3 lots × 2 rolls = 6 in TMAIN
    ppf = env.ref(f"{P1}.product_ppf_film_roll", raise_if_not_found=False)
    if ppf:
        for lot_id in ["demo_lot_ppf_001", "demo_lot_ppf_002", "demo_lot_ppf_003"]:
            lot = env.ref(f"{MOD}.{lot_id}", raise_if_not_found=False)
            if lot:
                SQ._update_available_quantity(ppf, loc, 2.0, lot_id=lot)
        _logger.info("torz_demo: PPF opening stock set (6 rolls, 3 lots)")

    # Tint rolls — 2 lots × 3 rolls = 6 in TMAIN
    tint = env.ref(f"{P1}.product_tint_film_roll", raise_if_not_found=False)
    if tint:
        for lot_id in ["demo_lot_tint_001", "demo_lot_tint_002"]:
            lot = env.ref(f"{MOD}.{lot_id}", raise_if_not_found=False)
            if lot:
                SQ._update_available_quantity(tint, loc, 3.0, lot_id=lot)
        _logger.info("torz_demo: Tint opening stock set (6 rolls, 2 lots)")

    # Ceramic bottles — 10 units, no lot tracking
    ceramic = env.ref(f"{P1}.product_ceramic_bottle", raise_if_not_found=False)
    if ceramic:
        SQ._update_available_quantity(ceramic, loc, 10.0)
        _logger.info("torz_demo: Ceramic opening stock set (10 bottles)")


# ── Confirm SOs + set task stages ─────────────────────────────────────────────

# (xml_id_of_SO, xml_id_of_target_stage)
_SO_STAGE_MAP = [
    ("demo_so_ahmed_ppf",        "torz_stage_vehicle_received"),
    ("demo_so_mohammed_ceramic", "torz_stage_in_progress"),
    ("demo_so_fahad_tint",       "torz_stage_new"),
]


def _confirm_sale_orders(env):
    Task = env["project.task"]
    for so_xmlid, stage_xmlid in _SO_STAGE_MAP:
        so = env.ref(f"{MOD}.{so_xmlid}", raise_if_not_found=False)
        if not so:
            _logger.warning("torz_demo: SO ref %s not found", so_xmlid)
            continue

        if so.state == "draft":
            so.action_confirm()
            _logger.info("torz_demo: confirmed SO %s (%s)", so.name, so_xmlid)

        stage = env.ref(f"{P1}.{stage_xmlid}", raise_if_not_found=False)
        if not stage:
            _logger.warning("torz_demo: stage %s not found", stage_xmlid)
            continue

        tasks = Task.search([("sale_line_id", "in", so.order_line.ids)])
        if tasks:
            tasks.write({"stage_id": stage.id})
            _logger.info(
                "torz_demo: %d task(s) for SO %s moved to stage '%s'",
                len(tasks), so.name, stage.name,
            )
        else:
            _logger.warning(
                "torz_demo: no FSM tasks found for SO %s — "
                "check that industry_fsm_sale is installed and service_tracking=task_global_project",
                so.name,
            )
