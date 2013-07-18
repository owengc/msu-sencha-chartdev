Ext.define('iPad2.view.component.InputItem', {
    extend: 'Ext.dataview.component.DataItem',
    requires: ['iPad2.view.component.RangeSelector', 'Ext.Container', 'Ext.field.Text'],
    xtype: 'inputitem',
    alias: 'widget.inputitem',
    config: {
	layout: 'fit',/*layout: {
	    type: 'hbox',
	    align: 'stretch'
	},*/
	style: 'border-bottom:solid 1px lightgrey',
	idPrefix: '',
	items: [
	    /*{
		xtype: 'container',
		layout: {
		    type: 'hbox',
		    align: 'stretch'
		},
		items: [*/
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
			width: '50px'
		    },
		    {
			xtype: 'textfield',
			itemId: 'totalMinutesCmp',
			idSuffix: '_minutes',
			label: '',
			readOnly: true,
			cls: 'o-field-small',
			inputCls: 'o-field-small',
			width: '50px'
		    },/*
		]
	    },*/
	    {
		xtype: 'rangeselector',
		itemId: 'rangeSelector',
		totalPercentCmp: '_percent',
		totalMinutesCmp: '_minutes',
		durationCmp: 'duration',
		regions: '00000000000000000000',
		ready: false,
		flex: 1
	    }
	]
    },
    initialize: function(){
	this.callParent();
	this.setIdPrefix(this.config.prefix);
    },
    updateRecord: function(record){
//	myrec=record;
	console.log('rec:', record);
	var rangeSelector=this.down('#rangeSelector'),
	fullCodeCmp=this.down('#fullcodeCmp'),
	totalPercentCmp=this.down('#totalPercentCmp'),
	totalMinutesCmp=this.down('#totalMinutesCmp'),
	prefix=this.getIdPrefix(),
	idNum=record.get('id').match(/\d+/g)[0],
	rsConfig=rangeSelector.getInitialConfig();
	
	fullCodeCmp.setValue(record.get('fullcode'));
	fullCodeCmp.description=record.get('frameworktitle');
//	fullCodeCmp.
	totalPercentCmp.setItemId(prefix+idNum+totalPercentCmp.idSuffix);
	totalMinutesCmp.setItemId(prefix+idNum+totalMinutesCmp.idSuffix);
	
	rsConfig.regions=record.get('duration_mask');
	rsConfig.itemId=(prefix+idNum);
	rsConfig.totalPercentCmp=totalPercentCmp.getItemId();
	rsConfig.totalMinutesCmp=totalMinutesCmp.getItemId();
	rsConfig.ready=true;
	rangeSelector.config=rsConfig;
	rangeSelector.initialize();
	this.callParent(arguments);
    }
});
