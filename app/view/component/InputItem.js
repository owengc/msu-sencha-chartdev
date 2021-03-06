Ext.define('app.view.component.InputItem', {
    extend: 'Ext.dataview.component.DataItem',
    requires: ['app.view.component.RangeSelector', 'Ext.Container', 'Ext.field.Text'],
    xtype: 'inputitem',
    alias: 'widget.inputitem',
    config: {
 	idPrefix: '',
	data: null,
	layout: {
	    type: 'hbox',
	    pack: 'left'
	},
	cls: 'o-list-item',
	items: [
	    {
		xtype: 'container',
		layout: 'hbox',
		items: [
		    { 
			xtype: 'container',
			layout: {
			    type: 'vbox',
			    align: 'center',
			    pack: 'center'
			},
			cls: 'o-button-wrapper',
			items: [
			    {
				xtype: 'button',
				cls: 'o-delete-button',
				text: 'X',
				width: '25px',
				height: '25px',
				ui: 'plain-round',
				handler: function(){
				    var ii=this.up('inputitem');
				    Ext.Msg.confirm("Remove Standard", "Are you sure you want to remove <b>"+ii.getData().data.code+"</b>?", 
						    function(response){
							if(response=='yes'){
							    var store=Ext.getStore('ULStandardStoreR');
							    record=store.getById(ii.getData().id);
							    store.remove(record);
							}
						    });
				}
			    }
			]
		    },
		    {
			xtype: 'container',
			layout: 'hbox',
			items: [
			    {
				xtype: 'textfield',
				itemId: 'labelCmp',
				inputCls: 'o-blue-bold',
				docked: 'top',
				width: '140px',
				description: '',
				label: '',
				readOnly: true,
				cls: 'o-field-small'
			    },
			    {
				xtype: 'textfield',
				itemId: 'totalPercentCmp',
				label: '',
				readOnly: true,
				cls: 'o-field-small',
				inputCls: 'o-field-small',
				width: '70px'
			    },
			    {
				xtype: 'textfield',
				itemId: 'totalMinutesCmp',
				label: '',
				readOnly: true,
				cls: 'o-field-small',
				inputCls: 'o-field-small',
				width: '70px'
			    }
			],
			listeners: {
			    element: 'element',
			    'tap': function(){
				if(!this.infoPanel){
				    this.infoPanel=Ext.create('Ext.Panel', {modal: true, centered: true, width: 600, height: 150, styleHtmlContent: true, scrollable: 'vertical', hideOnMaskTap: true, fullscreen: false, hidden: true, zIndex: 30, items: []});
				    var data=this.up('inputitem').getData().data;
				    var outString=('<h2 style="font-weight:bold;float:left;text-align:left;display:inline;margin-bottom:0;">'+data.code+'</h2>');
				    outString+=('<div style="float:top;clear:both;width:100%;border-bottom:2px solid black;"></div>');
				    outString+=('<strong>Description:</strong> '+data.description);
				    this.infoPanel.setHtml(outString);
				    Ext.Viewport.add(this.infoPanel);
				}
				this.infoPanel.show();
			    }
			}
		    }
		]
	    }
	]
    },
    initialize: function(){
	this.setIdPrefix(this.config.idPrefix);
    },
    updateRecord: function(record){
	this.callParent(arguments);
	if(record){
	    console.log('inputlist record added:', record);
	    var labelCmp=this.down('#labelCmp'),
	    totalPercentCmp=this.down('#totalPercentCmp'),
	    totalMinutesCmp=this.down('#totalMinutesCmp'),
	    prefix=this.getIdPrefix(),
	    idNum=record.get('standard_id'),
	    rsConfig={};	
	    //console.log(idNum);

	    /*set up unique itemIds for all the components in this row*/
	    labelCmp.setValue(record.get('code'));
	    labelCmp.setItemId(prefix+idNum+'_label');
	    totalPercentCmp.setItemId(prefix+idNum+'_percent');
	    totalMinutesCmp.setItemId(prefix+idNum+'_minutes');

	    /*set up config object for new rangeselector, create rangeselector and add it to this row*/
	    rsConfig.regions=record.get('duration_mask');//RangeSelectors will default to '00000000000000000000' if .regions is not specified
	    //console.log(rsConfig.regions);
	    rsConfig.itemId=(prefix+idNum);
	    rsConfig.totalPercentCmp=totalPercentCmp.getItemId();
	    rsConfig.totalMinutesCmp=totalMinutesCmp.getItemId();
	    rsConfig.durationCmp=('duration');//IMPORTANT - make sure this is set to the itemId of the lesson duration numeric input field
	    rsConfig.flex=1;
	    this.add(Ext.create('app.view.component.RangeSelector', rsConfig));
	    this.setData(record);
	    this.setItemId('ii'+idNum);
	}	    
    }
});
