Ext.define('app.view.component.RangeSelectorButton', {
    extend: 'Ext.Button',
    alias: 'widget.rangeselectorbutton',
    xtype: 'rangeselectorbutton',
    config: {
	index: null,
	text: '&nbsp;',
	width: null,
	area: {},
	pressed: false
    },
    initialize: function(){
	this.callParent(arguments);
	this.setIndex(this.config.index);
	this.setText(this.config.text);
	this.setWidth(this.config.width);
	this.setArea(this.config.area);
	this.setPressed(this.config.pressed);
    }
});
