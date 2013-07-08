Ext.define('ChartDev.controller.Report', {
    extend: 'Ext.app.Controller',
    requires: [
        'ChartDev.store.ULStoreR',
	'ChartDev.view.component.MultiSelectNestedList',
	'Ext.data.Store',
	'Ext.List',
        'Ext.draw.Color',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Bar',
        'Ext.chart.interactions.PanZoom',
        'Ext.chart.interactions.CrossZoom',
        'Ext.chart.interactions.ItemInfo',
	'Ext.chart.interactions.ItemHighlight',
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Scatter',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Time',
        'Ext.chart.Legend',
        'Ext.Anim',
	'Ext.Spacer'
    ],
    config: {
	models: ['ULModelR', 'CCModelR'],
	stores: ['ULStoreR', 'CCStoreR'],
	views: ['Main', 'Report'],
	refs: {
	    report: '#report',
	    toolbar: '#report #report_toolbar',
	    toolbarButton: '#report_toolbar #report_toolbarButton',
	    menu: '#report #report_menu',
	    filter: '#report_menu #report_filter',
	    filterSwitch: '#report_menu #report_filterSwitch',
	    filterType: '#report_menu #report_filter_type',
	    filterTier: '#report_menu #report_filter_tier',
	    filterDetail: '#report_menu #report_filter_detail',
	    filterDetailList: '#report_filter_detailList',
	    filterDetailListClearButton: '#report_filter_detailList #report_filter_detailListClearButton',
	    filterDetailListDoneButton: '#report_filter_detailList #report_filter_detailListDoneButton',
	    content: '#report #report_content',
	    panZoomButton: '#report_toolbar #report_panZoomButton'
	},
	control: {
	    toolbarButton: {
		tap: 'toggleMenu'
	    },
	    toolbarSubmitButton: {
		tap: 'submitMenu'
	    },
	    filterSwitch: {
		change: 'toggleFilter'
	    },
	    filterTier: {
		change: 'updateFilterDetailListDepth'
	    },
	    filterDetail: {
		'tap': 'showFilterDetailList',
		'swipe': 'clearFilterDetailList'
	    },
	    filterDetailListClearButton: {
		tap:'clearFilterDetailList'
	    },
	    filterDetailListDoneButton: {
		tap: 'hideFilterDetailList'
	    },
	    content: {
		doubletap: 'resetPanZoom'
	    }
	}
    },
    toggleMenu: function(e){
	var menu=this.getMenu(),
        toolbarButton=this.getToolbarButton(),
	content=this.getContent(),
	panZoomButton=this.getPanZoomButton();
	if(menu.isHidden()){
	    if(content){
		content.hide();
		if(panZoomButton){
		    panZoomButton.hide();
		}
		setTimeout(function(){menu.show();}, 250);
		setTimeout(function(){
		    toolbarButton.setIconCls('arrow_up');
		    toolbarButton.setText('View Report');
		    toolbarButton.setUi('confirm');
		}, 500);
	    }
	    else{
		menu.show();
		setTimeout(function(){
		    toolbarButton.setIconCls('arrow_up');
		    toolbarButton.setText('View Report');
		    toolbarButton.setUi('confirm');
		}, 250);
	    }
        }
        else{
	    if(this.submitMenu()==true){
		menu.hide();		
		setTimeout(function(){
		    toolbarButton.setIconCls('arrow_down');
		    toolbarButton.setText('View Menu');
		    toolbarButton.setUi('normal');
		}, 500);
		if(content){
		    setTimeout(function(){content.show();}, 250);
		    if(panZoomButton){
			setTimeout(function(){panZoomButton.show();}, 500);
		    }
		}
	    }
        }
    },
    submitMenu: function(){
        var values=this.getMenu().getValues(true, true);
      	if(this.validateMenuForm(values)){
	    var report=this.getReport();
	    if(JSON.stringify(values)!=JSON.stringify(report.getMenuState())){
		this.updateContent(values);
		report.setMenuState(values);
            }
	    return true;
	}
	else{
	    return false;
	}
    },
    validateMenuForm: function(values){
        for(value in values){
            if(values[value]===null){
                Ext.Msg.alert("Oops!", "Please make selections for all menu items to generate report.", Ext.emptyFn);
                return false;
            }
        }
	if(values.fromDate && values.toDate){
	    if(values.fromDate>values.toDate){
		Ext.Msg.alert("Oops!", "Please make sure the From Date is not later than the To Date", Ext.emptyFn);
		return false;
	    }
	}
        return true;
    },
    toggleFilter: function(scope, s, t, newValue, oldValue){
	var filter=this.getFilter();
	if(newValue==1){
	    filter.enable();
	    filter.show();
	}
	else{
	    filter.disable();
	    filter.hide();
	}
    },
    showFilterDetailList: function(){
	var report=this.getReport(),
	filterTier=this.getFilterTier(),
	filterDetailList=this.getFilterDetailList() || null;
	if(filterDetailList===null){
	    Ext.Viewport.add(Ext.create('ChartDev.view.component.MultiSelectNestedList', {
		store: 'CCStore',
		itemId: 'report_filter_detailList',
		title: 'Filter Selection',
		displayField: 'description',
		targetDepth: filterTier.getValue()[0]
	    }));
	    filterDetailList=this.getFilterDetailList();
	}
	Ext.Viewport.animateActiveItem('#report_filter_detailList', {type: 'fade', duration: 250});
    },
    hideFilterDetailList: function(){
	var filterDetail=this.getFilterDetail(),
	filterDetailList=this.getFilterDetailList(),
	selections=filterDetailList.getSelectedItems(),
	option={value: null},
	text='',
	value={};
	for(item in selections){
	    if(text!=''){
		text+=' or ';
	    }
	    var data=selections[item].getData(),
	    code=data.code;
	    text+=code;
	    value[code]=data;
	}
	if(text!=''){
	    option.text=text;
	    option.value=value;
	    filterDetail.setOptions([option]);
	}
	Ext.Viewport.animateActiveItem('#report', {type: 'fade', duration: 250});
    },
    clearFilterDetailList: function(){
	if(this.getFilterDetailList()){
	    this.updateFilterDetailListDepth();
	    Ext.Viewport.animateActiveItem('#report', {type: 'fade', duration: 250});
	}
    },
    updateFilterDetailListDepth: function(){
	var filterTier=this.getFilterTier(),
	filterDetail=this.getFilterDetail(),
	filterDetailList=this.getFilterDetailList();
	filterDetail.setOptions([{text:'', value: null}]);
	if(filterDetailList){
	    filterDetailList.clearSelections();
	    filterDetailList.setTargetDepth(filterTier.getValue()[0]);
	}
    },
    updateContent: function(params){
        var report=this.getReport(),
	content=this.getContent(),
	userLogStore=Ext.getStore('ULStore');
	if(content){
	    report.remove(content, true);
	    userLogStore.clearFilter();
	}
	if(params.fromDate && params.toDate){
	    userLogStore.filterBy(function(rec, id){
		var date=rec.get('datetaught');
		if(date>=params.fromDate && date<=params.toDate){
		    return true;
		}
		else{
		    return false;
		}
	    });
	}
	var framework=Ext.getStore('CCStore');
	framework=framework.getRoot();
	var tier=params.tier, 
	reportFields = [
	    {name: 'journal_id', type: 'string'},
	    {name: 'class_name', type: 'string'},
	    {name: 'date_taught', type: 'date', dateFormat: 'Y-m-d'},
	    {name: 'activities'},
	    {name: 'materials', type: 'string'},
	    {name: 'pages', type: 'string'},
	    {name: 'notes', type: 'string'},

	    {name: 'time_spent', type: 'int'},

	    {name: 'grade'},
	    {name: 'domains'},
	    {name: 'clusters'},
	    {name: 'standards'},

	    {name: 'code', type: 'string'},
	    {name: 'description', type: 'string'},
	],
	reportData=[],
	logs=userLogStore.getData().items,
	numLogs=logs.length,
	i=0;
	for(;i<numLogs;i++){
	    var ulData=logs[i].getData(),
	    itemHash={},
	    itemKey,
	    standards=logs[i].standardsStore.getData().items,
	    numStandards=standards.length,
	    j=0;
	    for(;j<numStandards;j++){
		var ulStandardData=standards[j].getData();
		var record=framework.findChild('standard_id', ulStandardData.framework_id, true);
		if(record){
		    var standard=record.getData(),
		    cluster=record.parentNode.getData(),
		    domain=record.parentNode.parentNode.getData(),
		    grade=record.parentNode.parentNode.parentNode.getData();
		    itemKey=(tier+'_id');
		    targetTier=(tier==='standard')?standard:(tier==='cluster')?cluster:domain;
		    if(!itemHash[itemKey]){//hash table: keys are domain/cluster/framework_ids, values are objects representing data points
			itemHash[itemKey]={
			    journal_id: ulData.journalid,
			    class_name: ulData.classname,
			    date_taught: ulData.datetaught,
			    activities: ulData.activity,
			    materials: ulData.materialname,
			    pages: ulData.pages,
			    notes: ulData.notes,

			    time_spent: Math.round(ulData.duration*(ulStandardData.percent/100)),//time spent on this standard/cluster/domain in the lesson

			    grade: grade.code,
			    domains:[{code: domain.code, description: domain.description}],
			    clusters: [{code: cluster.code, description: cluster.description}],
			    standards: [{code: standard.code, description: standard.description}],

			    code: targetTier.code,
			    description: targetTier.description
			};
		    }
		    else{
			var item=itemHash[itemKey],
			tiers={
			    'standards': {code: standard.code, description: standard.description},
			    'clusters': {code: cluster.code, description: cluster.description},
			    'domains': {code: domain.code, description: domain.description}
			};
			for(tier in tiers){
			    var newEntry=true,
			    tierArray=item[tier],
			    count=tierArray.length,
			    i=0;
			    for(;i<count;i++){
				if(JSON.stringify(tierArray[i])==JSON.stringify(tiers[tier])){
				    newEntry=false;
				}
			    }
			    if(newEntry){
				tierArray.push(tiers[tier]);
			    }

			}
			item.time_spent+=Math.round(ulData.duration*(ulStandardData.percent/100));
		    }
		}
	    }
	    for(item in itemHash){
		reportData.push(itemHash[item]);
	    }
	}
	Ext.define('ReportModel', {
	    extend: 'Ext.data.Model',
	    config: {
		fields: reportFields
	    }
	});
	
	var reportStore=Ext.create('Ext.data.Store', {
	    storeId: 'ReportStore',
	    model: 'ReportModel',
	    data: reportData,
	    groupField: 'code',
	    sorters: ['code', 'date_taught']
	});
	reportStore.load();

	var settings=this.getMenu().getValues(true, true);
	if(settings.filterSwitch==1){
	    var filterType=settings.filterType,
	    filterTier=settings.filterTier[1], 
	    filterDetails=settings.filterDetail;
	    reportStore.filterBy(function(rec, id){
		var tierArray=rec.get(filterTier+'s'),
		numItems=tierArray.length,
		i=0;
		for(;i<numItems;i++){
		    if(filterType=='include'){
			if(filterDetails[tierArray[i].code]){
			    return true;
			}
		    }
		    else{
			if(filterDetails[tierArray[i].code]){
			    return false;
			}
		    }
		}
		return (filterType=='include')?false:true;
	    });
	}
	if(params.type==='list'){
	    content=Ext.create('Ext.List', {
		itemId: 'report_content',
		height: '100%',
		animate: true,
		hidden: true,
		showAnimation: {type: 'slideIn', direction: 'up', duration: 250},
                hideAnimation: {type: 'slideOut', direction: 'down', duration: 250},
		store: 'ReportStore',
		itemTpl: ('<div style="float:top"><b>{class_name}<br>{date_taught:date("m/d/Y")}</b></div><div style="float:top">'+Ext.String.capitalize(params.tier)+': {code}</div>'),
		itemHeight: 75,
		grouped: true,
		onItemDisclosure: true,
		listeners: {
		    disclose: function(scope, record, target, index){
			scope.select(record, false, false);
			var panel=Ext.create('Ext.Panel', {modal: true, centered: true, width: 600, height: 300, styleHtmlContent: true, scrollable: 'vertical', hideOnMaskTap: true, fullscreen: false, hidden: true, zIndex: 30, items: []}),
			outString=(record.data.class_name)?('<h2 style="font-weight:bold;float:left;text-align:left;display:inline">'+record.data.class_name+'</h2>'):'';
			outString+=(record.data.date_taught)?('<h3 style="float:right;text-align:right;display:inline">'+Ext.Date.format(record.data.date_taught, 'm/d/Y')+'</h3>'):'';
			outString+=(outString!='')?('<div style="float:top;clear:both;width:100%;border-bottom:2px solid black;"></div>'):'';
			outString+=(record.data.code)?('<h4 style="font-weight:bold;display:inline">'+Ext.String.capitalize(params.tier)+':</h4> '+record.data.code+'<br/>'):'';
			outString+=(record.data.description)?('<h4 style="font-weight:bold;display:inline">Description:</h4> '+record.data.description+'<br/>'):'';
			outString+=(record.data.time_spent)?('<h4 style="font-weight:bold;display:inline">Time Spent:</h4> '+record.data.time_spent+' minutes<br/>'):'';

			var materials=record.data.materials,
			pages=record.data.pages,
			activities=record.data.activities;
			outString+=(materials)?('<h4 style="font-weight:bold;display:inline">Lesson Materials:</h4> '+materials):'';
			if(materials && pages){
			    outString+=(isNaN(record.data.pages))?(' (pages '+pages+')'):(' (page '+pages+')');
			}
			outString+=(materials)?'<br/>':'';
			if(activities.length>0){
			    var listString='';
			    outString+='<h4 style="font-weight:bold;display:inline">Lesson Activities:</h4> ';
			    for(index in activities){
				listString+=(listString!='')?', ':'';
				listString+=activities[index].activity_name;
			    }
			    outString+=(listString+'<br/>');
			}
			outString+=(record.data.notes)?'<h4 style="font-weight:bold;display:inline">Notes:</h4> '+record.data.notes+'<br/>':'';
			panel.setHtml(outString);
			panel.show();
		    }
		}
	    });
        }
        else if(params.type==='dot'){
	    content=Ext.create('Ext.chart.CartesianChart', {
		itemId: 'report_content',
		height: '100%',
		animate: true,
		hidden: true,
		showAnimation: {type: 'slideIn', direction: 'up', duration: 250},
                hideAnimation: {type: 'slideOut', direction: 'down', duration: 250},
		innerPadding: {
		    top: 40,
		    left: 40,
		    right: 40,
		    bottom: 40
		},
                store: 'ReportStore',
                axes: [
                    {
                        type: 'category',
                        position: 'left',
                        fields: [
                            'code'
                        ],
                        title: {
                            text: Ext.String.capitalize(params.tier),
                            fontSize: 14
                        },
                        grid: true
		    },
		    {
			type: 'time',
			position: 'bottom',
			fields: [
                            'date_taught'
			],
			fromDate: params.fromDate,
			toDate: params.toDate,
			title: {
                            text: ('Log entries by '+params.tier+' between '+Ext.Date.format(params.fromDate, 'F j, Y')+' and '+Ext.Date.format(params.toDate, 'F j, Y')),
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
			fill: true,
			xField: 'date_taught',
			yField: 'code',
			marker: {
			    type: 'circle',
			    fillStyle: '#1e93e4',
			    strokeStyle: '#11598c',
			    radius: 10,
			    lineWidth: 1
			},
			highlightCfg: {
			    type: 'circle',
			    fillStyle: '#75e41e',
			    strokeStyle: '#428c11',
			    radius: 20,
			    lineWidth: 2
			}
		    }
		],
		interactions: [
		    {
			type: 'panzoom',
			axes: {
			    left: {
				minZoom: 1,
				maxZoom: 100,
				allowPan: true
			    },
			    bottom: {
				minZoom: 1,
				maxZoom: 100,
				allowPan: true
			    }
			},
			modeToggleButton: {
			    cls: ['x-panzoom-toggle', 'x-zooming'], iconCls: 'expand'
			}
		    },
		    {
			type: 'iteminfo',
			panel: {width: 600, height: 300, items: []},
			listeners: {
			    show: function(scope, item, panel){
				panel.removeAt(0);//get rid of default toolbar
				var outString=(item.record.get('class_name'))?('<h2 style="font-weight:bold;float:left;text-align:left;display:inline">'+item.record.get('class_name')+'</h2>'):'';
				outString+=(item.record.get('date_taught'))?('<h3 style="float:right;text-align:right;display:inline">'+Ext.Date.format(item.record.get('date_taught'), 'm/d/Y')+'</h3>'):'';
				outString+=(outString!='')?('<div style="float:top;clear:both;width:100%;border-bottom:2px solid black;"></div>'):'';
				outString+=(item.record.get('code'))?('<h4 style="font-weight:bold;display:inline">'+Ext.String.capitalize(params.tier)+':</h4> '+item.record.get('code')+'<br/>'):'';
				outString+=(item.record.get('description'))?('<h4 style="font-weight:bold;display:inline">Description:</h4> '+item.record.get('description')+'<br/>'):'';
				outString+=(item.record.get('time_spent'))?('<h4 style="font-weight:bold;display:inline">Time Spent:</h4> '+item.record.get('time_spent')+' minutes<br/>'):'';

				var materials=item.record.get('materials'),
				pages=item.record.get('pages'),
				activities=item.record.get('activities');
				outString+=(materials)?('<h4 style="font-weight:bold;display:inline">Lesson Materials:</h4> '+materials):'';
				if(materials && pages){
				    outString+=(isNaN(pages))?(' (pages '+pages+')'):(' (page '+pages+')');
				}
				outString+=(materials)?'<br/>':'';
				if(activities.length>0){
				    var listString='';
				    outString+='<h4 style="font-weight:bold;display:inline">Lesson Activities:</h4> ';
				    for(i in activities){
					listString+=(listString!='')?', ':'';
					listString+=activities[i].activity_name;
				    }
				    outString+=(listString+'<br/>');
				}
				outString+=(item.record.get('notes'))?'<h4 style="font-weight:bold;display:inline">Notes:</h4> '+item.record.get('notes')+'<br/>':'';
				panel.setHtml(outString);
			    }
			}
		    },
		    {
			type: 'itemhighlight'
		    }
		],
		listeners: {
		    initialize:  this.initPanZoom,
		    doubletap: this.resetPanZoom
		}/*,
		   painted: function(){
		   console.log('set grid');
		   var grid=this.getAxes()[0].gridSurface;
		   grid.setTop(50);
		   grid.setZIndex(2);
		   }*/
	    });
	}
	else if(params.type==='bar'){//must manually sum values
	    var totalReportTime=reportStore.sum('time_spent');
	    barChartFields = [
		{name: 'journals'},
		{name: 'total_time', type: 'int'},
		{name: 'code', type: 'string'},
		{name: 'description', type: 'string'},
	    ],
	    barChartData=[],
	    itemHash={},
	    items=reportStore.getData().items,
	    numItems=items.length,
	    i=0;
	    for(;i<numItems;i++){
		var record=reportStore.getAt(i);
		recordData=record.getData(),
		itemKey=recordData.code;
		if(itemHash[itemKey]){
		    var item=itemHash[itemKey];
		    item.journals.push(recordData);
		    item.total_time+=recordData.time_spent;
		}
		else{
		    itemHash[itemKey]={
			journals: [recordData],
			total_time: recordData.time_spent,
			code: recordData.code,
			description: recordData.description
		    };
		}
	    }
	    for(item in itemHash){
		barChartData.push(itemHash[item]);
	    }

	    Ext.define('BarChartModel', {
		extend: 'Ext.data.Model',
		config: {
		    fields: barChartFields
		}
	    });
	    var barChartStore=Ext.create('Ext.data.Store', {
		storeId: 'BarChartStore',
		model: 'BarChartModel',
		data: barChartData,
		groupField: 'code',
		sorters: ['total_time', 'code']
	    });
	    barChartStore.load();
	    
	    content=Ext.create('Ext.chart.CartesianChart', {
		itemId: 'report_content',
		height: '100%',
		animate: true,
		hidden: true,
		showAnimation: {type: 'slideIn', direction: 'up', duration: 250},
		hideAnimation: {type: 'slideOut', direction: 'down', duration: 250},
		innerPadding: {
		    top: 40,
		    left: 0,
		    right: 40,
		    bottom: 40
		},
		stacked: true,
		flipXY: true,
		store: 'BarChartStore',
		axes: [
		    {
			type: 'numeric',
			position: 'bottom',
			fields: [
                            'total_time'
			],
			title: {
                            text: ('Time spent (in minutes) by '+params.tier+' between '+Ext.Date.format(params.fromDate, 'F j, Y')+' and '+Ext.Date.format(params.toDate, 'F j, Y')),
			},
			minimum: 0
		    },
		    {
			type: 'category',
			position: 'left',
			fields: [
                            'code'
			],
			title: {
                            text: Ext.String.capitalize(params.tier),
                            fontSize: 14
			},
			grid: true
                    }
		],
		series: [
		    {
			type: 'bar',
			xField: 'code',
			yField: 'total_time',
			style: {
			    fill: '#1e93e4',
			    stroke: '#11598c',
			    lineWidth: 1
			},
			highlightCfg: {
			    fill: '#75e41e',
			    stroke: '#428c11',
			    lineWidth: 2
			}
		    }
		],
		interactions: [
		    {
			type: 'panzoom',
			axes: {
			    left: {
				minZoom: 1,
				maxZoom: 100,
				allowPan: true
			    },
			    bottom: {
				minZoom: 1,
				maxZoom: 100,
				allowPan: true
			    }
			},
			modeToggleButton: {
			    cls: ['x-panzoom-toggle', 'x-zooming'], iconCls: 'expand'
			}
		    },
		    {
			type: 'iteminfo',
			panel: {width: 600, height: 300, items: []},
			listeners: {
			    show: function(scope, item, panel){
				panel.removeAt(0);//get rid of default toolbar
				var outString=(item.record.get('code'))?('<h2 style="font-weight:bold;display:inline">'+Ext.String.capitalize(params.tier)+': '+item.record.get('code')+'</h2><br/>'):'';
				outString+=(outString!='')?('<div style="float:top;clear:both;width:100%;border-bottom:3px solid black;"></div>'):'';
				outString+=(item.record.get('description'))?('<h4 style="font-weight:bold;display:inline">Description:</h4> '+item.record.get('description')+'<br/>'):'';
				outString+=(item.record.get('total_time'))?('<h4 style="font-weight:bold;display:inline">Total Time Spent:</h4> '+item.record.get('total_time')+' minutes<br/>'):'';
				var journals=item.record.get('journals')
				if(journals.length>0){
				    outString+='<br/><h3 style="font-weight:bold;display:inline">Journal Entries:</h3><br/>';
				    outString+='<div style="float:top;clear:both;width:100%;border-bottom:2px solid black;"></div><br/>';
				    for(j in journals){
					outString+='<div style="border-bottom: 1px solid lightgrey">';
					outString+=(journals[j].class_name)?('<span style="font-size:18px;font-weight:bold;float:left;text-align:left;display:inline">'+journals[j].class_name+'</span>'):'';
					outString+=(journals[j].date_taught)?('<span style="font-size:16px;float:right;text-align:right;display:inline">'+Ext.Date.format(journals[j].date_taught, 'm/d/Y')+'</span>'):'';
					outString+=(journals[j].class_name || journals[j].date_taught)?('<div style="float:top;clear:both;width:100%;border-bottom:1px solid black;"></div>'):'';
					outString+=(journals[j].time_spent)?('<span style="font-weight:bold;display:inline">Time Spent on '+item.record.get('code')+':</span> '+journals[j].time_spent+' minutes<br/>'):'';
					var materials=journals[j].materials,
					pages=journals[j].pages,
					activities=journals[j].activities;
					outString+=(materials)?('<span style="font-weight:bold;display:inline">Lesson Materials:</span> '+materials):'';
					if(materials && pages){
					    outString+=(isNaN(pages))?(' (pages '+pages+')'):(' (page '+pages+')');
					}
					outString+=(materials)?'<br/>':'';
					if(activities.length>0){
					    var listString='';
					    outString+='<span style="font-weight:bold;display:inline">Lesson Activities:</span> ';
					    for(i in activities){
						listString+=(listString!='')?', ':'';
						listString+=activities[i].activity_name;
					    }
					    outString+=(listString+'<br/>');
					}
					outString+=(journals[j].notes)?'<span style="font-weight:bold;display:inline">Notes:</span> '+journals[j].notes+'<br/>':'';
					outString+='<br/></div><br/>';
				    }
				}
				panel.setHtml(outString);
			    }
			}
		    },
		    {
			type: 'itemhighlight'
		    }
		],
		listeners: {
		    initialize: this.initPanZoom,
		    doubletap: this.resetPanZoom
		}
            });
	}
	else{
            console.log('invalid report type');
	    return false;
	}
	report.add(content);
	content.show();	
    },
    initPanZoom: function(){
	if(Ext.os.deviceType=='Desktop'){
	    var panzoom=Ext.ComponentQuery.query('#report_content')[0].getInteractions()[0],
	    modeToggleButton=panzoom.getModeToggleButton(),
	    toolbar=Ext.ComponentQuery.query('#report_toolbar')[0],
	    spacer=Ext.create('Ext.Spacer', {
		flex: 1
	    });
	    modeToggleButton.setItemId('report_panZoomButton');
	    toolbar.add(spacer);
	    toolbar.add(modeToggleButton);
	    panzoom.setZoomOnPanGesture(true);
	}
    },
    resetPanZoom: function(){
	var chart=Ext.ComponentQuery.query('#report_content')[0];
	var axes=chart.getAxes(),
	panzoom=chart.getInteractions()[0];
	panzoom.transformAxesBy(axes, 0, 0, 0, 0);
	panzoom.setZoomOnPanGesture(true);
	chart.redraw();
    }
});


