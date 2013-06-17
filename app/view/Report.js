var UserLogStore = Ext.create('ChartDev.store.UserLogStoreR');
UserLogStore.load();

Ext.define('ChartDev.view.Report', {
    extend: 'Ext.Panel',
    alias: 'widget.reportview',

    requires: [
	'ChartDev.store.UserLogStoreR',
        'Ext.data.Store',
        'Ext.MessageBox',
	'Ext.form.Panel',
	'Ext.form.FieldSet',
	'Ext.field.Select',
	'Ext.field.DatePicker',
        'Ext.draw.Color',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Area',
        'Ext.chart.interactions.PanZoom',
        'Ext.chart.interactions.ItemInfo',
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Scatter',
        'Ext.chart.axis.Numeric',
	'Ext.chart.axis.Time',
        'Ext.chart.Legend',
	'Ext.Anim'
    ],
    config: {
	fullscreen: true,
	layout: 'vbox',
	items: [
	    { 
		xtype: 'toolbar',
		id: 'report_toolbar',
		title: 'Reports',
		docked: 'top',
		items: [
		    {
			xtype: 'button',
			id: 'report_menuButton',
			iconCls: 'arrow_up'
		    }
		],
		initialize: function(){
		    this.relayEvents(this.element, ['tap']);
		}
	    },
	    {
		xtype: 'formpanel',
		id: 'report_menu',
		height: '100%',
		layout: 'vbox',
		showAnimation: {type: 'slideIn', direction: 'down'},
		hideAnimation: {type: 'slideOut', direction: 'up'},
		items: [
		    {
			xtype: 'fieldset',
			defaults: {
			    labelWidth: '15%',
			    flex: 1
			},
			items: [			    
			    {
				xtype: 'selectfield',
				id: 'report_type',
				label: 'Report Type:',
				usePicker: true,
				options: [
				    {text: 'List', value: 0},
				    {text: 'Dot Plot', value: 1},
				    {text: 'Bar Graph', value: 2}
				]
			    },
			    {
				xtype: 'selectfield',
				id: 'report_filterY',
				label: 'View By:',
				usePicker: true,
				options: [
				    {text: 'Domain', value: 0},
				    {text: 'Cluster', value: 1},
				    {text: 'Topic', value: 2}
				]
			    },
			    {
				xtype: 'datepickerfield',
				id: 'report_filterXStart',
				label: 'Start Date:',
				value: new Date(),
				picker: {
				    yearFrom: 2010
				}
			    },
			    {
				xtype: 'datepickerfield',
				id: 'report_filterXEnd',
				label: 'End Date:',
				value: new Date(),
				picker: {
				    yearFrom: 2010
				}
			    }
			]
		    }
		]
	    },
	    {
		xtype: 'chart',
		id: 'report_chart',
		height: '90%',
		animate: true,
		innerPadding: {
		    top: 40,
		    bottom: 40
		},
		insetPadding: {
		    right: 20
		},
		store: UserLogStore,
		axes: [
		    {
			type: 'category',
			position: 'left',
			fields: [
			    'framework_id'
			],
			title: {
			    text: 'Framework Id',
			    fontSize: 14
			},
			grid: true
		    },
		    {
			type: 'time',
			position: 'bottom',
			fields: [
			    'datetaught'
			],
			fromDate: new Date('Apr 1 2013'),
			toDate: new Date(),
			title: {
			    text: '',
			},
			style: {
			    
			},
			label: {
			    rotate: 45
			},
			dateFormat: 'M d'
		    }
		],
		series: [
		    {
			type: 'scatter',
			highlight: {
			    size: 7,
			    radius: 7
			},
			fill: true,
			xField: 'datetaught',
			yField: 'framework_id',
			marker: {
			    type: 'circle',
			    fillStyle: 'blue',
			    radius: 10,
			    lineWidth: 0
			}
		    }
		],
		interactions: [
		    {
			type: 'panzoom'
		    }
		]
	    }
	]
    },
    initialize: function(){
	this.callParent(); 
    }
});

/*
VPDApp.views.ChartView = Ext.extend(Ext.Panel, {
    fullscreen: true,    
    title: 'Chart',
    layout:'fit',
    bodyMargin: '0 20 0 0',
    dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                title: 'Line Chart'
                
            }],
            
    listeners:{
        activate: function(){
            Ext.dispatch({
                controller: VPDApp.controllers.notesController,
                action: 'loadchart',
                //favorite: favorite
            });
        },
    },
    
    initComponent: function () {    
        this.store =new Ext.data.JsonStore({
            fields: ['datetaught','framework_id1','framework_id2','framework_id3','framework_id4','framework_id5' ],
            
        });  
        
        
        
        //this.items = this.items||[];
        //this.items.unshift(this.chartPanel);
        
        VPDApp.views.ChartView.superclass.initComponent.call(this);
    },
    
    createChart:function(min, max, idStore, chartStore, data){
        console.log('idStore', {min:min,max:max, id:idStore});
        var step = idStore.length;
        
        this.chart= new Ext.chart.Chart({ 
            id: 'userchart',
            animate: true,  
            //scroll: true,
            store:this.store, 
            interactions: [{
                type: 'panzoom',
                axes: {
                    bottom: {
                        maxZoom: 4
                    },
                    right: {
                        //minZoom: 0.5,
                        maxZoom: 4,
                       // allowPan: false
                    }
                }
                },
                {
                type: 'iteminfo',
                listeners: {
                      show: function(me, item, panel) {
			   console.log("x"+me+item+panel)
                        console.log('click', this.item.value);  
                       // console.log(chartStore.findRecord('journalid', data[this.item.value[0]]['id'+this.item.value[1]]));
                        //panel.update('Topic' + item.value.get(''));
                        var framework_id = idStore[this.item.value[1]];
                        var datetaught = data[this.item.value[0]].data.datetaught;
                        console.log(framework_id, datetaught);
                        panel.setSize(300, 200);
                        //panel.setTitle('Detail');
			  //panel.title('Detail');
                        chartStore.each(function(record){
                            
                            if(record.data.datetaught == datetaught.toString() && record.data.framework_id == framework_id){ 
                                console.log(record.data);
				if (record.data.duration > 0 ){
				     panel.update(record.data.frameworktitle + '</br>'
                                            + 'Date: ' + record.data.datetaught.toDateString() + '</br>'
                                            + 'Class: ' + record.data.classname + '</br>'
                                            + 'Time: ' + record.data.duration + ' minutes');
				    } else {
					 panel.update(record.data.frameworktitle + '</br>'
                                            + 'Date: ' + record.data.datetaught.toDateString() + '</br>'
                                            + 'Class: ' + record.data.classname + '</br>'
                                           );}
                                
                            }
                        });
                    }
                }
            }],            
            axes: [
                {
                    type: 'Numeric',
                    position: 'left',
                    scale: 'logarithmic',
                    fields: ['framework_id1', 'framework_id2','framework_id3','framework_id4','framework_id5'],
                    grid:true,
                    title: 'CCSS ID', 
                    majorTickSteps: step,
                    minimum: min-1,
                    maximum: max + 1,
                    //adjustMinimumByMajorUnit: 0,
                    label: {
                        renderer:function(val){
                            console.log("val", val);
                            return idStore[val];
                        }
                    }
                    
                },
                {
                    type: 'Time',
                    position: 'bottom',
                    fields: ['datetaught'],
                    title: 'Date',
                    //grid: true,                    
                    dateFormat: ' M d ',
                    //constrain: false,
                    fromDate: new Date('6/6/2011'),
                    toDate: new Date('7/6/2012'),
                    label: {
                        rotate: {
                            degrees: 45
                        }
                    }
                } ],
            series: [{
                type: 'line',
                showLegend: false,
                showMarkers: true,
                markerConfig: {
                    //type: 'cross',
                    radius: 7,
                    size: 7,
                    fill: '#f00',
                    
                },
                style:{
                    opacity: 0
                },
                axis: 'left',
                xField: 'datetaught',
                yField: 'framework_id1',
                
            },
            {
                type: 'line',
                showMarkers: true,
                markerConfig: {
                    radius:7,
                    size: 7,
                    fill: '#f00',
                    
                },
                style:{
                    opacity: 0
                },
                axis: 'left',
                xField: 'datetaught',
                yField: 'framework_id2'
                
                
            },
            {
                type: 'line',
                showMarkers: true,
                markerConfig: {
                    radius: 7,
                    size: 7,
                    fill: '#f00',
                    
                },
                style:{
                    opacity: 0
                },
                axis: 'left',
                xField: 'datetaught',
                yField: 'framework_id3'
                
                
            },
            {
                type: 'line',
                showMarkers: true,
                markerConfig: {
                    radius: 7,
                    size: 7,
                    fill: '#f00',
                    
                },
                style:{
                    opacity: 0
                },
                axis: 'left',
                xField: 'datetaught',
                yField: 'framework_id4'
            },
            {
                type: 'line',
                showMarkers: true,
                markerConfig: {
                    radius: 7,
                    size: 7,
                    fill: '#f00',
                    
                },
                style:{
                    opacity: 0
                },
                axis: 'left',
                xField: 'datetaught',
                yField: 'framework_id5'
                
                
            }]
        });
        return this.chart;
    },
    
    refineStore:function(chartStore){
        chartStore.sort();
        var id, data = [], obj, aggStore = {}, key, strings, idStore = [], index =0, idKey, framework_id;        
        var min =10000000, max=0;
        idStore[0] = ' ';
        chartStore.each(function(record){            
            var strings = record.data.datetaught.split("-");
            id = record.data.journalid;
            datetaught = new Date(strings[0], strings[1] -1, strings[2]);
            record.data.datetaught = datetaught;
            key = datetaught.toDateString();
            //framework_id = record.data.framework_id;
            idKey = record.data.framework_id;
            //console.log('idKey', idKey);
            if(idStore.indexOf(idKey)==-1){
                idStore.push(idKey);
            }
            framework_id = idStore.indexOf(idKey);
            
            //console.log('frameworkid-----', framework_id);
            if(min >= framework_id){
                min = framework_id;
            }
            if(max <= framework_id){
                max = framework_id;
            }
            if(key in aggStore){
                obj = aggStore[key];
                if(!obj.framework_id2){
                    obj.framework_id2 = framework_id;
                    obj.id2 = id;
                }else if(!obj.framework_id3){
                    obj.framework_id3 = framework_id;
                    obj.id3 = id;
                }else if(!obj.framework_id4){
                    obj.framework_id4 = framework_id;
                    obj.id4 = id;
                }else {
                    obj.framework_id5 = framework_id;
                    obj.id5 = id;
                }
            }else {
                obj = { datetaught: datetaught, framework_id1: framework_id, id1:id}; 
                aggStore[key] = obj;
            }
            index++;
        });
        idStore[idStore.length] = ' ';
        var today = new Date(),
        before = today.add(Date.DAY, -570), currentDate = before, dateStr;
        for(i=0;i<300;i++){
            currentDate = currentDate.add(Date.DAY, 1);
            dateStr = currentDate.toDateString();
            if(dateStr in aggStore){
                obj = aggStore[dateStr];
                data.push(obj);
            }
            else {
                obj = {datetaught: currentDate,}
                data.push(obj);
            }
        }
        this.store.loadData(data); 
        
        //reset min, max
        //min = idStore[0];
        //max = idStore[idStore.length-1];
        console.log("user chart store refined", this.store);
        var old = Ext.getCmp('userchart');
        if(old){
            old.destroy();
        }
        var chart = this.createChart(min,max,idStore, chartStore, data);
        this.items = this.items||[];
        this.add(this.chart);
        this.doLayout();
    }
    
  
});
*/
