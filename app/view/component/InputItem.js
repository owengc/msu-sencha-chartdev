Ext.define('app.view.component.InputItem', {
    extend: 'Ext.dataview.component.DataItem',
    requires: ['app.view.component.RangeSelector', 'Ext.Container', 'Ext.field.Text'],
    xtype: 'inputitem',
    alias: 'widget.inputitem',
    config: {
 	idPrefix: '',
	layout: {
	    type: 'hbox'
	},
	items: [
	    {
		xtype: 'container',
		cls: 'o-list-item-label',
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
			listeners: {
			    element: 'element',
			    'tap': function(){
				this.infoPanel=Ext.create('Ext.Panel', {modal: true, centered: true, width: 600, height: 150, styleHtmlContent: true, scrollable: 'vertical', hideOnMaskTap: true, fullscreen: false, hidden: true, zIndex: 30, items: []});
				var outString=('<h2 style="font-weight:bold;float:left;text-align:left;display:inline;margin-bottom:0;">'+this.getValue()+'</h2>');
				outString+=('<div style="float:top;clear:both;width:100%;border-bottom:2px solid black;"></div>');
				outString+=('<strong>Description:</strong> '+this.description);
				this.infoPanel.setHtml(outString);
				Ext.Viewport.add(this.infoPanel);
				this.infoPanel.show();
			    }
			}
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
	this.callParent(arguments);
	this.setIdPrefix(this.config.prefix);
    },
    updateRecord: function(record){
	var fullcodeCmp=this.down('#fullcodeCmp'),
	totalPercentCmp=this.down('#totalPercentCmp'),
	totalMinutesCmp=this.down('#totalMinutesCmp'),
	prefix=this.getIdPrefix(),
	idNum=record.get('framework_id'),
	rsConfig={};	
	//console.log(idNum);

	/*set up unique itemIds for all the components in this row*/
	fullcodeCmp.setValue(record.get('fullcode'));
	fullcodeCmp.setItemId(prefix+idNum+fullcodeCmp.idSuffix);
	fullcodeCmp.description=record.get('frameworktitle');
	totalPercentCmp.setItemId(prefix+idNum+totalPercentCmp.idSuffix);
	totalMinutesCmp.setItemId(prefix+idNum+totalMinutesCmp.idSuffix);

	/*set up config object for new rangeselector, create rangeselector and add it to this row*/
	rsConfig.regions=record.get('duration_mask');//RangeSelectors will default to '00000000000000000000' if .regions is not specified
	//console.log(rsConfig.regions);
	rsConfig.itemId=(prefix+idNum);
	rsConfig.totalPercentCmp=totalPercentCmp.getItemId();
	rsConfig.totalMinutesCmp=totalMinutesCmp.getItemId();
	rsConfig.durationCmp=('journal_duration');//IMPORTANT - make sure this is set to the itemId of the lesson duration numeric input field
	rsConfig.flex=1;
	this.add(Ext.create('app.view.component.RangeSelector', rsConfig));
	this.callParent(arguments);
    }
});
