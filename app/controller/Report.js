Ext.define('ChartDev.controller.Report', {
    extend: 'Ext.app.Controller',
    requires: [
        'ChartDev.store.ULStoreR',
	'ChartDev.view.component.FilterDetailList',
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
	    filterDetailListClearButton: '#report_filter_detailListClearButton',
	    filterDetailListDoneButton: '#report_filter_detailListDoneButton',
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
	    Ext.Viewport.add(Ext.create('ChartDev.view.component.FilterDetailList', {
		title: 'Filter Selection',
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
	    {name: 'datetaught', type: 'date', dateFormat: 'Y-m-d'},
	    {name: 'materials', type: 'string'},
	    {name: 'pages', type: 'string'},

	    {name: 'timespent', type: 'int'},

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
			    datetaught: ulData.datetaught,
			    materials: ulData.materials,
			    pages: ulData.pages,

			    timespent: Math.round(ulData.duration*(ulStandardData.percent/100)),//time spent on this standard/cluster/domain in the lesson

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
			item.timespent+=Math.round(ulData.duration*(ulStandardData.percent/100));
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
	    sorters: ['code', 'datetaught']
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
		itemTpl: ('<div style="float:top"><b>{class_name}<br>{datetaught:date("m/d/Y")}</b></div><div style="float:top">'+Ext.String.capitalize(params.tier)+': {code}</div>'),
		itemHeight: 75,
		grouped: true,
		onItemDisclosure: true,
		listeners: {
		    disclose: function(scope, record, target, index){
			scope.select(record, false, false);
			var outString=(record.data.code)?('<div style="float:top"><b>Code:</b> '+record.data.code+'</div>'):'';
			outString+=(record.data.description)?('<div style="float:top"><b>Description:</b> '+record.data.description+'</div>'):'';
			outString+=(record.data.journal_id)?('<div style="float:top"><b>Journal Id:</b> '+record.data.journal_id+'</div>'):'';/*
																		{name: 'framework_id', type: 'string'},
																		{name: 'datetaught', type: 'date', dateFormat: 'Y-m-d'},
																		{name: 'classid', type: 'string'},
																		{name: 'classname', type: 'string'},
																		{name: 'duration',    type: 'string'},
																		{name: 'activity', type: 'string'},
																		{name: 'materialid', type: 'int'},
																		{name: 'materialname', type:'string'},
																		{name: 'usermaterials', type: 'string'},
																		{name: 'pages', type: 'string'},
																		{name: 'background', type: 'string'},
																		{name: 'notes', type:'string'},
																		{name: 'activitycsv', type:'string'},
																		{name: 'practicescsv', type:'string'},
																		{name: 'activity'},
																		{name: 'standards'},
																		{name: 'math_practices'},*/
			Ext.Msg.show({
			    title: ('<div>'+record.data.class_name+' '+Ext.Date.format(record.data.datetaught, 'm/d/Y')+'</div>'), 
			    message: outString, 
			    scrollable: {
				direction: 'vertical',
				directionLock: true
			    },
			    width: '100%',
			    height: '100%',
			    hideOnMaskTap: true,
			    fn: Ext.emptyFn
			});
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
                            'datetaught'
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
			xField: 'datetaught',
			yField: 'code',
			marker: {
			    type: 'circle',
			    fillStyle: '#1e93e4',
			    strokeStyle: '#11598c',
			    radius: 10,
			    lineWidth: 0
			},
			highlightCfg: {
			    type: 'circle',
			    fillStyle: '#75e41e',
			    strokeStyle: '#428c11',
			    radius: 15,
			    lineWidth: 1
			},
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
			listeners: {
			    show: function(scope, item, panel){
				var outString=('<div><h3>'+item.record.get('class_name')+' '+Ext.Date.format(item.record.get('datetaught'), 'm/d/Y')+'</h3></div>');
				outString+=(item.record.get('code'))?('<div style="float:top"><b>'+params.tier+':</b> '+item.record.get('code')+'</div>'):'';
				outString+=(item.record.get('description'))?('<div style="float:top"><b>Description:</b> '+item.record.get('description')+'</div>'):'';
				outString+=(item.record.get('journal_id'))?('<div style="float:top"><b>Journal Id:</b> '+item.record.get('journal_id')+'</div>'):'';
				panel.setHtml(outString);
			    }
			}
		    },
		    {
			type: 'itemhighlight'
		    }
		],
		listeners: {
		    initialize: function(){
			if(Ext.os.deviceType=='Desktop'){
			    var panzoom=this.getInteractions()[0],
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
		    doubletap: function(){//not sure why 'this' does not refer to the chart with this event
			var chart=Ext.ComponentQuery.query('#report_content')[0];
//			this.fireEvent('doubletap');
			var axes=chart.getAxes(),
			panzoom=chart.getInteractions()[0];
			panzoom.transformAxesBy(axes, 0, 0, 0, 0);
			chart.redraw();
		    }
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
	    var totalReportTime=reportStore.sum('timespent');
	    barChartFields = [
		{name: 'journals'},
		{name: 'totaltime', type: 'int'},
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
		    item.totaltime+=recordData.timespent;
		}
		else{
		    itemHash[itemKey]={
			journals: [recordData],
			totaltime: recordData.timespent,
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
		sorters: ['totaltime', 'code']
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
                            'totaltime'
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
			fill: true,
			xField: 'code',
			yField: 'totaltime',
			style: {
			    fill: '#1e93e4',
			    stroke: '#11598c'
			}
		    }
		],/*,
		   interactions: [
		   {
		   type: 'panzoom',
		   axes: {
		   bottom: {
		   maxZoom: 5,
		   allowPan: true
		   },
		   left: false
		   }
		   },
		   {
		   type: 'iteminfo',
		   listeners: {
		   show: function(scope, item, panel){
		   var outString=('<div><h3>'+item.record.get('classname')+' '+Ext.Date.format(item.record.get('datetaught'), 'm/d/Y')+'</h3></div>');
		   outString+=(item.record.get('framework_id'))?('<div style="float:top"><b>Frameword Id:</b> '+item.record.get('framework_id')+'</div>'):'';
		   outString+=(item.record.get('frameworktitle'))?('<div style="float:top"><b>Frameword Title:</b> '+item.record.get('frameworktitle')+'</div>'):'';
		   outString+=(item.record.get('journalid'))?('<div style="float:top"><b>Journal Id:</b> '+item.record.get('journalid')+'</div>'):'';
		   panel.setHtml(outString);
		   }
		   }
		   },
		   {
		   type: 'itemhighlight'
		   }
		   ]*/

		listeners: {
		    initialize: function(){
			if(Ext.os.deviceType=='Desktop'){
			    var panzoom=this.getInteractions()[0],
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
		    doubletap: function(){//not sure why 'this' does not refer to the chart with this event
			var chart=Ext.ComponentQuery.query('#report_content')[0];
//			this.fireEvent('doubletap');
			var axes=chart.getAxes(),
			panzoom=chart.getInteractions()[0];
			panzoom.transformAxesBy(axes, 0, 0, 0, 0);
			chart.redraw();
		    }
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
    resetPanZoom: function(){
	var chart=this.getContent();
	if(chart.isXType('chart')){
	    var axes=chart.getAxes(),
	    panzoom=chart.getInteractions()[0];
	    panzoom.transformAxesBy(axes, 0, 0, 0, 0);
	    chart.redraw();
	}
    }
});


