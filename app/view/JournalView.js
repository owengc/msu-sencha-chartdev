Ext.define('app.view.JournalView', {
    extend: 'Ext.Panel',
    alias: 'widget.journalview',
    xtype: 'journalview',
    requires: [
	'Ext.form.Panel',
	'Ext.Container',
	'Ext.field.Number',
	'Ext.field.Text',
	'Ext.dataview.DataView',        
        'app.view.component.InputItem',
	'app.view.component.RangeSelector'
    ],    
    config: {
	itemId: 'journal',
	layout: 'vbox',
	items: [
	    {//this is the lesson duration field!
		xtype: 'numberfield',
		label: 'Lesson Duration',
		labelWidth: '115px',
		labelWrap: true,
		height: '60px',
		itemId: 'journal_duration',//make sure that this matches the 'durationFieldCmp' setting in InputItem
		minValue: 0,
		maxValue: 360,
		value: 0
	    },
	    {//this is the list!
		xtype: 'dataview',
		itemId: 'journal_inputList',//itemId can be whatever you wish, all other configs must stay the same though (unless you decide to alter the height)
		fullscreen: false,
		height: '200px',
		scrollable: 'vertical',
		store: null,
		useComponents: true,
		defaultType: 'inputitem',
		itemConfig: {
		    idPrefix: 'rs'
		}
	    },
	    /*{
		xtype: 'container',
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
				itemId: 'rs99_label',
				inputCls: 'o-blue-bold',
				docked: 'top',
				width: '140px',
				description: '',
				label: '',
				readOnly: true,
				cls: 'o-field-small',
				value: 'K.OA.3'
			    },
			    {
				xtype: 'textfield',
				itemId: 'rs99_percent',
				idSuffix: '_percent',
				label: '',
				readOnly: true,
				cls: 'o-field-small',
				inputCls: 'o-field-small',
				width: '70px',
			    },
			    {
				xtype: 'textfield',
				itemId: 'rs99_minutes',
				idSuffix: '_minutes',
				label: '',
				readOnly: true,
				cls: 'o-field-small',
				inputCls: 'o-field-small',
				width: '70px',
			    }
			]
		    },
		    {
			xtype: 'rangeselector',
			itemId: 'rs99',
			totalPercentCmp: 'rs99_percent',
			totalMinutesCmp: 'rs99_minutes',
			durationCmp: 'journal_duration',
			regions: '11110000001111111100',
			ready: true,
			flex: 1
		    }
		]
	    },*/
	    {
		xtype: 'button',
		text: 'Send',
		ui: 'confirm',
		handler: function(){
		    //this demonstrates how to collect and query the rangeselectors. 
		    //the rangeselector methods 'getRegions()' and 'getTotal()' return the
		    //values used for 'duration_mask' and 'percent', respectively 
		    var rangeSelectors=Ext.ComponentQuery.query('rangeselector'),
		    rangeSelectorCount=rangeSelectors.length,
		    rangeSelector,
		    outString='',
		    i=0;
		    for(;i<rangeSelectorCount;i++){
			rangeSelector=rangeSelectors[i];
			outString+=(
			    'RangeSelector #'+(i+1)+': '+'['+rangeSelector.getRegions()+'] ('+rangeSelector.getTotal()+'%)<br/>'
			);
		    }
		    Ext.Msg.alert(
			'Regions:',
			outString,
			Ext.emptyFn
		    );
		    //this.up('formpanel').submit();
		}
	    }
	]
    },
    initialize: function(){
	this.callParent(arguments);
    }
});
	
