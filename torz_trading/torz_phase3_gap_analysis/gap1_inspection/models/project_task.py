from odoo import models, fields

class ProjectTask(models.Model):
    _inherit = 'project.task'

    x_inspection_data = fields.Json(string='Inspection Diagram Data')
