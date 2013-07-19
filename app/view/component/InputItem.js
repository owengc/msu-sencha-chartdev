Ext.define('app.view.component.InputItem', {
    extend: 'Ext.dataview.component.DataItem',
    requires: ['app.view.component.RangeSelector', 'Ext.Container', 'Ext.field.Text'],
    xtype: 'inputitem',
    alias: 'widget.inputitem',
    config: {
	style: 'border-bottom:solid 1px lightgrey',
 	idPrefix: '',
	layout: {
	    type: 'hbox'
	},
	items: [
	    {
		xtype: 'container',
		items: [
		    {
			xtype: 'textfield',
			itemId: 'fullcodeCmp',
			inputCls: 'o-blue-bold',
			docked: 'top',
			width: '100px',
			description: '',
			label: '',
			readOnly: true,
			cls: 'o-field-small',
		    },
		    {
			xtype: 'textfield',
			itemId: 'totalPercentCmp',
			idSuffix: '_percent',
			label: '',
			readOnly: true,
			cls: 'o-field-small',
			inputCls: 'o-field-small',
			width: '50px',
		    },
		    {
			xtype: 'textfield',
			itemId: 'totalMinutesCmp',
			idSuffix: '_minutes',
			label: '',
			readOnly: true,
			cls: 'o-field-small',
			inputCls: 'o-field-small',
			width: '50px',
		    }
		]
	    }
	]
    },
    initialize: function(){
	this.callParent();
	this.setIdPrefix(this.config.prefix);
    },
    updateRecord: function(record){
	var fullCodeCmp=this.down('#fullcodeCmp'),
	totalPercentCmp=this.down('#totalPercentCmp'),
	totalMinutesCmp=this.down('#totalMinutesCmp'),
	prefix=this.getIdPrefix(),
	idNum=record.get('id').match(/\d+/g)[0],
	rsConfig={};
	
	fullCodeCmp.setValue(record.get('fullcode'));
	fullCodeCmp.setItemId(prefix+idNum+'_label');
	fullCodeCmp.description=record.get('frameworktitle');
	totalPercentCmp.setItemId(prefix+idNum+totalPercentCmp.idSuffix);
	totalMinutesCmp.setItemId(prefix+idNum+totalMinutesCmp.idSuffix);

	rsConfig.regions=record.get('duration_mask');
	rsConfig.itemId=(prefix+idNum);
	rsConfig.totalPercentCmp=totalPercentCmp.getItemId();
	rsConfig.totalMinutesCmp=totalMinutesCmp.getItemId();
	rsConfig.durationCmp=('journal_duration');
	rsConfig.flex=1;
	this.add(Ext.create('app.view.component.RangeSelector', rsConfig));
	this.callParent(arguments);
    }
});
