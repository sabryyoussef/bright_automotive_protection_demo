/**
 * Minimal Odoo JS widget for drawing simple lines on a canvas.
 * This is a placeholder for the real car inspection widget.
 */
odoo.define('gap1_inspection.CarInspectionWidget', function (require) {
    "use strict";
    var AbstractField = require('web.AbstractField');
    var fieldRegistry = require('web.field_registry');

    var CarInspectionWidget = AbstractField.extend({
        template: 'CarInspectionWidgetTemplate',
        events: {
            'mousedown canvas': '_onMouseDown',
            'mousemove canvas': '_onMouseMove',
            'mouseup canvas': '_onMouseUp',
            'mouseleave canvas': '_onMouseUp',
        },
        start: function () {
            this._super.apply(this, arguments);
            this._drawing = false;
            this._lastPos = null;
            this.canvas = this.$('canvas')[0];
            this.ctx = this.canvas.getContext('2d');
        },
        _onMouseDown: function (ev) {
            this._drawing = true;
            this._lastPos = this._getPos(ev);
        },
        _onMouseMove: function (ev) {
            if (!this._drawing) return;
            var pos = this._getPos(ev);
            this.ctx.beginPath();
            this.ctx.moveTo(this._lastPos.x, this._lastPos.y);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.stroke();
            this._lastPos = pos;
        },
        _onMouseUp: function () {
            this._drawing = false;
        },
        _getPos: function (ev) {
            var rect = this.canvas.getBoundingClientRect();
            return {
                x: ev.originalEvent.clientX - rect.left,
                y: ev.originalEvent.clientY - rect.top
            };
        },
    });

    fieldRegistry.add('car_inspection_widget', CarInspectionWidget);
    return CarInspectionWidget;
});
