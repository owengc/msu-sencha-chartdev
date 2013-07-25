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
		itemId: 'duration',//make sure that this matches the 'durationFieldCmp' setting in InputItem
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
		maxItemCache: 0,
		useComponents: true,
		defaultType: 'inputitem',
		itemConfig: {
		    idPrefix: 'rs'
		},
		disableSelection: true
	    },
	    {
		xtype: 'button',
		text: 'Add Standards',
		handler: function(){
		    var standards=[
			{
                            "framework_id" : "9368",
                            "frameworktitle" : "1. Count to 100 by ones and by tens.  ",
                            "fullcode" : "K.CC.1 ",
			    "levelname" : "Standard",
                            "leaf" : "true",
			},
			{
                            "framework_id" : "9369",
                            "frameworktitle" : "2. Count forward beginning from a given number within the known sequence (instead of having to begin at 1). ",
                            "fullcode" : "K.CC.2",
                            "levelname" : "Standard",
                            "leaf" : "true",
			},
			{
                            "framework_id" : "9370",
                            "frameworktitle" : "3. Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20 (with 0 representing a count of no objects). ",
                            "fullcode" : "K.CC.3",
                            "levelname" : "Standard",
                            "leaf" : "true",
			}
		    ],
		    index=Math.floor(Math.random()*3),
		    standard=standards[index],
		    store=Ext.getStore('ULStandardStoreR');
		    if(store){
			if(store.findRecord('framework_id', standard['framework_id'], 0, false, true, true)){
			    console.log('duplicate standard chosen');
			}
			else{
			    store.add(standard);
			}
			//console.log(store.findRecord('framework_id', standard['framework_id'], 0, false, true, true));
		    }
		}
	    },
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
	
