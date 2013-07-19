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
		layout: 'hbox',
		items: [
		    {
			xtype: 'textfield',
			itemId: 'fullcodeCmp',
			idSuffix: '_label',
			inputCls: 'o-blue-bold',
			docked: 'top',
			width: '140px',
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
			width: '70px',
		    },
		    {
			xtype: 'textfield',
			itemId: 'totalMinutesCmp',
			idSuffix: '_minutes',
			label: '',
			readOnly: true,
			cls: 'o-field-small',
			inputCls: 'o-field-small',
			width: '70px',
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
	console.log('rec', record);
	var fullCodeCmp=this.down('#fullcodeCmp'),
	totalPercentCmp=this.down('#totalPercentCmp'),
	totalMinutesCmp=this.down('#totalMinutesCmp'),
	prefix=this.getIdPrefix(),
	idNum=record.get('id').match(/\d+/g)[0],
	rsConfig={};
	
	fullCodeCmp.setValue(record.get('fullcode'));
	fullCodeCmp.setItemId(prefix+idNum+fullCodeCmp.idSuffix);
	fullCodeCmp.description=record.get('frameworktitle');
	totalPercentCmp.setItemId(prefix+idNum+totalPercentCmp.idSuffix);
	totalMinutesCmp.setItemId(prefix+idNum+totalMinutesCmp.idSuffix);


	rsConfig.regions=record.get('duration_mask');
	console.log(rsConfig.regions);
	rsConfig.itemId=(prefix+idNum);
	rsConfig.totalPercentCmp=totalPercentCmp.getItemId();
	rsConfig.totalMinutesCmp=totalMinutesCmp.getItemId();
	rsConfig.durationCmp=('journal_duration');
	rsConfig.flex=1;
	this.add(Ext.create('app.view.component.RangeSelector', rsConfig));
	this.callParent(arguments);
    }
});
