{
    'name': 'Gap 1 Inspection',
    'version': '1.0',
    'category': 'Custom',
    'summary': 'Visual Car Inspection placeholder (Phase 3)',
    'depends': ['project'],
    'data': [
        'views/worksheet_inspection.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'torz_trading/torz_phase3_gap_analysis/gap1_inspection/static/src/js/car_inspection_widget.js',
            'torz_trading/torz_phase3_gap_analysis/gap1_inspection/static/src/xml/car_inspection_widget.xml',
        ],
    },
    'installable': True,
    'application': False,
}