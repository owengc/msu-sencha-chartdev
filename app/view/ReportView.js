Ext.define('app.view.ReportView', {
    extend: 'Ext.Panel',
    alias: 'widget.reportview',
    xtype: 'reportview',
    requires: [
	'Ext.Toolbar',
	'Ext.form.Panel',
	'Ext.form.FieldSet',
	'Ext.field.Select',
	'Ext.field.DatePicker',
	'Ext.field.Toggle',
	'Ext.dataview.NestedList'
    ],    
    config: {
	itemId: 'report',
	layout: 'vbox',
	initialized: false,
	menuState: {},
	items: [
	    { 
		xtype: 'toolbar',
		itemId: 'report_toolbar',
		docked: 'top',
		height: 50,
		title: 'Reports',
		items: [
		    {
			xtype: 'button',
			id: 'report_toolbarButton',
			text: 'View Report',
			margin: '0 5',
			width: 175,
			style: {
			    'font-size': '1.25em'
			},
			ui: 'confirm',
			iconCls: 'arrow_up'
		    }
		]
	    },
	    {
		xtype: 'formpanel',
		itemId: 'report_menu',
		height: '100%',
		showAnimation: {type: 'slideIn', direction: 'down', duration: 250},
		hideAnimation: {type: 'slideOut', direction: 'up', duration: 250},
		items: [
		    {
			xtype: 'fieldset',
			title: 'Configure Report:',
			defaults: {
			    minHeight: 60,
			    labelWidth: '15%'
			},	
			items: [			    
			    {
				xtype: 'selectfield',
				itemId: 'report_type',
				name: 'type',
				label: 'Report Type:',
				usePicker: true,
				options: [
				    {text: 'List', value: 'list'},
				    {text: 'Dot Plot', value: 'dot'},
				    {text: 'Bar Graph', value: 'bar'}
				],
				defaultPhonePickerConfig: {
				    usePicker: true,
				    hideOnMaskTap: true,
				    stretchY: true,
				    showAnimation: {type: 'fadeIn', duration: 250},
				    hideAnimation: {type: 'fadeOut', duration: 250},
				    height: '300px',
				    toolbar: {
					title: 'Select Report Type:',
					height: 75
				    },
				    cancelButton: false/*{
					margin: '0 5',
					height: 60,
					width: 150,
					style: {
					    'font-size': '1.5em'
					},
					//ui: 'decline'
				    }*/,
				    doneButton: {
					margin: '0 5',
					height: 60,
					width: 150,
					style: {
					    'font-size': '1.5em'
					},
					ui: 'confirm'
				    }
				},
				listeners: {
				    change: function(me, newValue, oldValue, eOpts){
					var groupField=me.getParent().down('#report_groupField');
					if(newValue=='list'){
					    groupOptions=groupField.getOptions();
					    if(groupOptions[2].text=='Code'){
						groupOptions[2].text=Ext.String.capitalize(me.getParent().down('#report_tier').getValue());
						groupField.updateOptions(groupOptions);
					    }
					    groupField.setDisabled(false);
					    groupField.show();
					}
					else{
					    groupField.setDisabled(true);
					    groupField.hide();
					}
				    }
				}
			    },
			    {
				xtype: 'selectfield',
				itemId: 'report_tier',
				name: 'tier',
				label: 'Present By:',
				usePicker: true,
				options: [
				    {text: 'Standard', value: 'standard'},
				    {text: 'Cluster', value: 'cluster'},
				    {text: 'Domain', value: 'domain'}
				],
				defaultPhonePickerConfig: {
				    usePicker: true,
				    hideOnMaskTap: true,
				    stretchY: true,
				    showAnimation: {type: 'fadeIn', duration: 250},
				    hideAnimation: {type: 'fadeOut', duration: 250},
				    height: '300px',
				    toolbar: {
					title: 'Select Report Presentation Tier:',
					height: 75
				    },
				    cancelButton: false/*{
					margin: '0 5',
					height: 60,
					width: 150,
					style: {
					    'font-size': '1.5em'
					},
					//ui: 'decline'
				    }*/,
				    doneButton: {
					margin: '0 5',
					height: 60,
					width: 150,
					style: {
					    'font-size': '1.5em'
					},
					ui: 'confirm'
				    }
				},
				listeners: {
				    change: function(me, newValue, oldValue, eOpts){
					var groupField=me.getParent().down('#report_groupField'),
					groupOptions=groupField.getOptions();
					groupOptions[2].text=Ext.String.capitalize(newValue);
					groupField.updateOptions(groupOptions);
				    }
				}
			    },
			    {
				xtype: 'selectfield',
				itemId: 'report_groupField',
				name: 'groupField',
				label: 'Group By:',
				usePicker: true,
				hidden: true,
				disabled: true,
				options: [
				    {text: 'Course', value: 'class_name'},
				    {text: 'Date', value: 'date_taught'},
				    {text: 'Code', value: 'code'}
				],
				defaultPhonePickerConfig: {
				    usePicker: true,
				    hideOnMaskTap: true,
				    stretchY: true,
				    showAnimation: {type: 'fadeIn', duration: 250},
				    hideAnimation: {type: 'fadeOut', duration: 250},
				    height: '300px',
				    toolbar: {
					title: 'Select Grouping Parameter:',
					height: 75
				    },
				    cancelButton: false/*{
					margin: '0 5',
					height: 60,
					width: 150,
					style: {
					    'font-size': '1.5em'
					},
					//ui: 'decline'
				    }*/,
				    doneButton: {
					margin: '0 5',
					height: 60,
					width: 150,
					style: {
					    'font-size': '1.5em'
					},
					ui: 'confirm'
				    }
				}
			    },
			    {
				xtype: 'datepickerfield',
				itemId: 'report_fromDate',
				name: 'fromDate',
				label: 'From:',
				placeHolder: '-select-',
				dateFormat: 'F j, Y',
				picker: {
				    yearFrom: 2010,
				    hideOnMaskTap: true,
				    stretchY: true,
				    showAnimation: {type: 'fadeIn', duration: 250},
				    hideAnimation: {type: 'fadeOut', duration: 250},
				    height: '300px',
				    toolbar: {
					title: 'Select Report Start Date:',
					height: 75
				    },
				    cancelButton: false/*{
					margin: '0 5',
					height: 60,
					width: 150,
					style: {
					    'font-size': '1.5em'
					},
					//ui: 'decline'
				    }*/,
				    doneButton: {
					margin: '0 5',
					height: 60,
					width: 150,
					style: {
					    'font-size': '1.5em'
					},
					ui: 'confirm'
				    }
				}
			    },
			    {
				xtype: 'datepickerfield',
				itemId: 'report_toDate',
				name: 'toDate',
				label: 'To:',
				placeHolder: '-select-',
				dateFormat: 'F j, Y',
				picker: {
				    yearFrom: 2010,
				    hideOnMaskTap: true,
				    stretchY: true,
				    showAnimation: {type: 'fadeIn', duration: 250},
				    hideAnimation: {type: 'fadeOut', duration: 250},
				    height: '300px',
				    toolbar: {
					title: 'Select Report End Date:',
					height: 75
				    },
				    cancelButton: false/*{
					margin: '0 5',
					height: 60,
					width: 150,
					style: {
					    'font-size': '1.5em'
					},
					//ui: 'decline'
				    }*/,
				    doneButton: {
					margin: '0 5',
					height: 60,
					width: 150,
					style: {
					    'font-size': '1.5em'
					},
					ui: 'confirm'
				    }
				}
			    },
			    {
				xtype: 'togglefield',
				itemId: 'report_filterSwitch',
				name: 'filterSwitch',
				label: 'Filter:',
				value: 0,
			    }
			]
		    },
		    {
			xtype: 'fieldset',
			title: 'Configure Filter:',
			itemId: 'report_filter',
			hidden: true,
			showAnimation: {type: 'slideIn', direction: 'up', duration: 250},
			hideAnimation: {type: 'slideOut', direction: 'down', duration: 250},
			defaults: {
			    minHeight: 60,
			    labelWidth: '15%',
			    disabled: true
			},	
			items: [			    
			    {
				xtype: 'selectfield',
				itemId: 'report_filter_type',
				name: 'filterType',
				label: 'Filter Type:',
				usePicker: true,
				options: [
				    {text: 'Include records', value: 'include'},
				    {text: 'Exclude records', value: 'exclude'}
				],
				defaultPhonePickerConfig: {
				    usePicker: true,
				    hideOnMaskTap: true,
				    stretchY: true,
				    showAnimation: {type: 'fadeIn', duration: 250},
				    hideAnimation: {type: 'fadeOut', duration: 250},
				    height: '300px',
				    toolbar: {
					title: 'Select Filter Type:',
					height: 75
				    },
				    cancelButton: false/*{
					margin: '0 5',
					height: 60,
					width: 150,
					style: {
					    'font-size': '1.5em'
					},
					//ui: 'decline'
				    }*/,
				    doneButton: {
					margin: '0 5',
					height: 60,
					width: 150,
					style: {
					    'font-size': '1.5em'
					},
					ui: 'confirm'
				    }
				}
			    },
			    {
				xtype: 'selectfield',
				itemId: 'report_filter_tier',
				name: 'filterTier',
				label: 'where',
				usePicker: true,
				options: [
				    {text: 'Standard', value: [4, 'standard']},
				    {text: 'Cluster', value: [3, 'cluster']},
				    {text: 'Domain', value: [2, 'domain']}
				],
				defaultPhonePickerConfig: {
				    usePicker: true,
				    hideOnMaskTap: true,
				    stretchY: true,
				    showAnimation: {type: 'fadeIn', duration: 250},
				    hideAnimation: {type: 'fadeOut', duration: 250},
				    height: '300px',
				    toolbar: {
					title: 'Select Filter Tier:',
					height: 75
				    },
				    cancelButton: false/*{
					margin: '0 5',
					height: 60,
					width: 150,
					style: {
					    'font-size': '1.5em'
					},
					//ui: 'decline'
				    }*/,
				    doneButton: {
					margin: '0 5',
					height: 60,
					width: 150,
					style: {
					    'font-size': '1.5em'
					},
					ui: 'confirm'
				    }
				}
			    },
			    {
				xtype: 'selectfield',
				itemId: 'report_filter_detail',
				name: 'filterDetail',
				label: 'is',
				readOnly: true,
				listeners: {
				    element: 'element',
				    tap: function(){
					this.fireEvent('tap');
				    },
				    swipe: function(){
					this.fireEvent('swipe');
				    }
				}
			    }
			]
		    }
		]
	    }//...report_menu
	]
    },//report
    initialize: function(){
	this.callParent(); 
	this.setInitialized(true);
	
	
	//for testing:
	Ext.ComponentQuery.query('#report_menu')[0].setValues({
            type: 'dot',
            tier: 'standard',
            fromDate: new Date('Apr 1 2010'),
            toDate: new Date('Jun 1 2013')
        });
    }
    
});
