Ext.define('app.controller.ReportController', {
    extend: 'Ext.app.Controller',
    requires: [
        'app.store.ULStoreR',
	'app.view.component.MultiSelectNestedList',
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
	views: ['Main', 'ReportView'],
	refs: {
	    report: '#report',
	    toolbar: '#report #report_toolbar',
	    menuButton: '#report_toolbar #report_menuButton',
	    exportButton: '#report_toolbar #report_exportButton',
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
	    menuButton: {
		tap: 'toggleMenu'
	    },
	    exportButton: {
		tap: 'exportReport'
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
	},
	env: ''
    },
    loadUserLog:function(){
        var userLog = Ext.getStore('ULStoreR'),
	token=app.app.token || null,
	me=this;
	if(token){
	    var proxy=userLog.getProxy();
            proxy.setExtraParam('token', token);
	    proxy.setUrl('../promse/journal?action=getuserlog14');
	}
	Ext.Viewport.setMasked({xtype:'loadmask',message:'Loading user logs...'});
        userLog.load({
	    callback: function(records, operations, success){
		Ext.Viewport.setMasked(false);
		me.setEnv((token)?'server':'local');
            }
	});
    },	
    toggleMenu: function(){
	var menu=this.getMenu(),
        menuButton=this.getMenuButton(),
	exportButton=this.getExportButton(),
	content=this.getContent(),
	panZoomButton=this.getPanZoomButton();
	if(menu.isHidden()){
	    if(content){
		content.hide();
		if(panZoomButton){
		    panZoomButton.hide();
		}
		setTimeout(function(){
		    exportButton.setUi('normal');
		    exportButton.hide();
		    menu.show();
		}, 250);
		setTimeout(function(){
		    menuButton.setIconCls('arrow_up');
		    menuButton.setText('View Report');
		    menuButton.setUi('confirm');
		}, 500);
	    }
	    else{
		menu.show();
		setTimeout(function(){
		    menuButton.setIconCls('arrow_up');
		    menuButton.setText('View Report');
		    menuButton.setUi('confirm');
		}, 250);
	    }
        }
        else{
	    if(this.submitMenu()){
		menu.hide();		
		setTimeout(function(){
		    menuButton.setIconCls('arrow_down');
		    menuButton.setText('View Menu');
		    menuButton.setUi('normal');
		}, 500);
		content=this.getContent();
		if(content){
		    setTimeout(function(){
			content.show();
			exportButton.setUi('confirm');
			exportButton.show();
		    }, 250);
		    if(panZoomButton){
			setTimeout(function(){panZoomButton.show();}, 500);
		    }
		}
	    }
        }
    },
    submitMenu: function(){
        var settings=this.getMenu().getValues(true, false);
      	if(this.validateMenuForm(settings)){
	    var report=this.getReport();
	    if(this.settingsChanged(settings, report.getSettings())){
		report.setSettings(settings);
		if(this.updateContent(settings)){
		    return true;
		}
		else{
		    Ext.Msg.alert("Oops!", "Those settings resulted in an empty report. Please adjust the settings and try again.", Ext.emptyFn);
		    report.setSettings({});
                    return false;
		}
	    }
	    else{
		return true;
	    }
	}
	else{
	    return false;
	}
    },
    validateMenuForm: function(settings){
        for(i in settings){
            if(settings[i]===null){
                Ext.Msg.alert("Oops!", "Please make selections for all menu items to generate report.", Ext.emptyFn);
                return false;
            }
        }
	if(settings.fromDate && settings.toDate){
	    if(settings.fromDate>settings.toDate){
		Ext.Msg.alert("Oops!", "Please make sure the From Date is not later than the To Date", Ext.emptyFn);
		return false;
	    }
	}
        return true;
    },
    settingsChanged: function(obj1, obj2){
        for(p in obj1){//by no means a robust object comparison operator, but should do the trick in this context 
            if(!obj2.hasOwnProperty(p) || obj1[p].toString()!=obj2[p].toString()){
                return true;
            }
        }
        return false;
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
	    Ext.Viewport.add(Ext.create('app.view.component.MultiSelectNestedList', {
		store: 'CCStoreR',
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
	var target=(this.getEnv()=='local')?'#report':'#main';
	Ext.Viewport.animateActiveItem(target, {type: 'fade', duration: 250});
    },
    clearFilterDetailList: function(){
	if(this.getFilterDetailList()){
	    this.updateFilterDetailListDepth();
	    var target=(this.getEnv()=='local')?'#report':'#main';
	    Ext.Viewport.animateActiveItem(target, {type: 'fade', duration: 250});
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
    updateContent: function(settings){
        var report=this.getReport(),
	content=this.getContent(),
	userLogStore=Ext.getStore('ULStoreR');
	userLogStore.clearFilter(true);
	if(content){
	    report.remove(content, true);
	}
	if(settings.fromDate && settings.toDate){
	    userLogStore.filterBy(function(rec, id){
		var date=rec.get('datetaught');
		if(date>=settings.fromDate && date<=settings.toDate){
		    return true;
		}
		else{
		    return false;
		}
	    });
	}

	var framework=Ext.getStore('CCStoreR');
	framework=framework.getRoot();
	var tier=settings.tier, 
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
	if(numLogs==0){
	    return false;
	}
	for(;i<numLogs;i++){
	    var ulData=logs[i].getData(),
	    itemHash={},
	    itemKey,
	    standards=logs[i].standardsStore.getData().items,
	    numStandards=standards.length,
	    j=0;
	    for(;j<numStandards;j++){
		var ulStandardData=standards[j].getData();
		var record=framework.findChild('standard_id', ulStandardData.standard_id, true);
		if(record){
		    var standard=record.getData(),
		    cluster=record.parentNode.getData(),
		    domain=record.parentNode.parentNode.getData(),
		    grade=record.parentNode.parentNode.parentNode.getData();
		}
		else{
		    var standard={standard_id: ulStandardData.standard_id, code: ulStandardData.code, description: ulStandardData.description},
		    cluster={cluster_id: -1, code: 'Other', description: 'NA'},
		    domain={domain_id: -1, code: 'Other', description: 'NA'},
		    grade={grade_id: -1, code: 'Other'};
		}
		targetTier=(tier==='standard')?standard:(tier==='cluster')?cluster:domain;
		itemKey=targetTier[(tier+'_id')];
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
	    for(item in itemHash){
		reportData.push(itemHash[item]);
	    }
	}

	Ext.define('ReportModelR', {
	    extend: 'Ext.data.Model',
	    config: {
		fields: reportFields
	    }
	});
	var reportStore=Ext.create('Ext.data.Store', {
	    storeId: 'ReportStoreR',
	    model: 'ReportModelR',
	    data: reportData,
	    sorters: (settings.type=='list')?['date_taught']:['code']
	});
	reportStore.load();
	reportStore.sort();
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
	    if(reportStore.getData().items.length==0){
		return false;
	    }
	}

	if(settings.type==='list'){
	    reportStore.setGroupField(settings.groupField);
	    if(settings.groupField=='date_taught'){
		reportStore.setGrouper({
		    sortProperty: 'date_taught',
		    groupFn: function(record){
			if(record && record.data.date_taught){
			    return Ext.Date.format(record.data.date_taught, 'D M j, Y');
			}
			else{
			    return '';
			}
		    }});
	    }
	    content=Ext.create('Ext.List', {
		itemId: 'report_content',
		height: '100%',
		animate: true,
		hidden: true,
		showAnimation: {type: 'slideIn', direction: 'up', duration: 250},
                hideAnimation: {type: 'slideOut', direction: 'down', duration: 250},
		store: 'ReportStoreR',
		grouped: true,
		itemTpl: ('<div style="float:top"><h4 style="font-weight:bold;display:inline">{class_name}&nbsp;{date_taught:date("n/j/Y")}</h4></div><div style="float:top">'+Ext.String.capitalize(settings.tier)+': {code}</div>'),
		itemHeight: 50,
		pinHeader: true,
		listeners: {
		    itemtap: function(list, index, target, record, e, eOpts){
			var panel=Ext.create('Ext.Panel', {modal: true, centered: true, width: 600, height: 300, styleHtmlContent: true, scrollable: 'vertical', hideOnMaskTap: true, fullscreen: false, hidden: true, zIndex: 30, items: [], listeners: {hide: function(){list.deselect(record);}}}),
			outString=(record.data.class_name)?('<h2 style="font-weight:bold;float:left;text-align:left;display:inline;margin-bottom:0;">'+record.data.class_name+'</h2>'):'';
			outString+=(record.data.date_taught)?('<h3 style="float:right;text-align:right;display:inline;margin-bottom:0;">'+Ext.Date.format(record.data.date_taught, 'n/j/Y')+'</h3>'):'';
			outString+=(outString!='')?('<div style="float:top;clear:both;width:100%;border-bottom:2px solid black;"></div>'):'';
			outString+='<p style="font-size:larger;">';
			outString+=(record.data.code)?('<strong>'+Ext.String.capitalize(settings.tier)+':</strong> '+record.data.code+'<br/>'):'';
			outString+=(record.data.description)?('<strong>Description:</strong> '+record.data.description+'<br/>'):'';
			outString+=(record.data.time_spent)?('<strong>Time Spent:</strong> '+record.data.time_spent+' minutes<br/>'):'';

			var materials=record.data.materials,
			pages=record.data.pages,
			activities=record.data.activities;
			outString+=(materials)?('<strong>Lesson Materials:</strong> '+materials):'';
			if(materials && pages){
			    outString+=(isNaN(record.data.pages))?(' (pages '+pages+')'):(' (page '+pages+')');
			}
			outString+=(materials)?'<br/>':'';
			if(activities.length>0){
			    var listString='';
			    outString+='<strong>Lesson Activities:</strong> ';
			    for(index in activities){
				listString+=(listString!='')?', ':'';
				listString+=activities[index].activity_name;
			    }
			    outString+=(listString+'<br/>');
			}
			outString+=(record.data.notes)?'<strong>Notes:</strong> '+record.data.notes+'<br/>':'';
			outString+='</p>';
			panel.setHtml(outString);
			Ext.Viewport.add(panel);
			panel.show();
		    }
		}
	    });
        }
        else if(settings.type==='dot'){
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
                store: 'ReportStoreR',
                axes: [
                    {
                        type: 'category',
                        position: 'left',
                        fields: [
                            'code'
                        ],
                        title: {
                            text: Ext.String.capitalize(settings.tier),
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
			fromDate: settings.fromDate,
			toDate: settings.toDate,
			title: {
                            text: ('Log entries by '+settings.tier+' between '+Ext.Date.format(settings.fromDate, 'F j, Y')+' and '+Ext.Date.format(settings.toDate, 'F j, Y')),
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
			    radius: 15,
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
				var outString=(item.record.get('class_name'))?('<h2 style="font-weight:bold;float:left;text-align:left;display:inline;margin-bottom:0;">'+item.record.get('class_name')+'</h2>'):'';
				outString+=(item.record.get('date_taught'))?('<h3 style="float:right;text-align:right;display:inline;margin-bottom:0;">'+Ext.Date.format(item.record.get('date_taught'), 'n/j/Y')+'</h3>'):'';
				outString+=(outString!='')?('<div style="float:top;clear:both;width:100%;border-bottom:2px solid black;"></div>'):'';
				outString+='<p style="font-size:larger;">';
				outString+=(item.record.get('code'))?('<strong>'+Ext.String.capitalize(settings.tier)+':</strong> '+item.record.get('code')+'<br/>'):'';
				outString+=(item.record.get('description'))?('<strong>Description:</strong> '+item.record.get('description')+'<br/>'):'';
				outString+=(item.record.get('time_spent'))?('<strong>Time Spent:</strong> '+item.record.get('time_spent')+' minutes<br/>'):'';

				var materials=item.record.get('materials'),
				pages=item.record.get('pages'),
				activities=item.record.get('activities');
				outString+=(materials)?('<strong>Lesson Materials:</strong> '+materials):'';
				if(materials && pages){
				    outString+=(isNaN(pages))?(' (pages '+pages+')'):(' (page '+pages+')');
				}
				outString+=(materials)?'<br/>':'';
				if(activities.length>0){
				    var listString='';
				    outString+='<strong>Lesson Activities:</strong> ';
				    for(i in activities){
					listString+=(listString!='')?', ':'';
					listString+=activities[i].activity_name;
				    }
				    outString+=(listString+'<br/>');
				}
				outString+=(item.record.get('notes'))?'<strong>Notes:</strong> '+item.record.get('notes')+'<br/>':'';
				outString+='</p>';
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
	else if(settings.type==='bar'){//must manually sum values
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

	    Ext.define('BarChartModelR', {
		extend: 'Ext.data.Model',
		config: {
		    fields: barChartFields
		}
	    });
	    var barChartStore=Ext.create('Ext.data.Store', {
		storeId: 'BarChartStoreR',
		model: 'BarChartModelR',
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
		store: 'BarChartStoreR',
		axes: [
		    {
			type: 'numeric',
			position: 'bottom',
			fields: [
                            'total_time'
			],
			title: {
                            text: ('Time spent (in minutes) by '+settings.tier+' between '+Ext.Date.format(settings.fromDate, 'F j, Y')+' and '+Ext.Date.format(settings.toDate, 'F j, Y')),
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
                            text: Ext.String.capitalize(settings.tier),
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
				var outString=(item.record.get('code'))?('<h2 style="font-weight:bold;display:inline">'+Ext.String.capitalize(settings.tier)+': '+item.record.get('code')+'</h2><br/>'):'';
				outString+=(outString!='')?('<div style="float:top;clear:both;width:100%;border-bottom:3px solid black;"></div>'):'';
				outString+='<p style="font-size:larger;">';
				outString+=(item.record.get('description'))?('<strong>Description:</strong> '+item.record.get('description')+'<br/>'):'';
				outString+=(item.record.get('total_time'))?('<strong>Total Time Spent:</strong> '+item.record.get('total_time')+' minutes<br/>'):'';
				outString+='</p>';
				var journals=item.record.get('journals')
				if(journals.length>0){
				    outString+='<h3 style="font-weight:bold;display:inline">Journal Entries:</h3><br/>';
				    outString+='<div style="float:top;clear:both;width:100%;border-bottom:2px solid black;"></div><br/>';
				    for(j in journals){
					outString+='<div style="border-bottom: 1px solid lightgrey">';
					outString+=(journals[j].class_name)?('<h4 style="font-weight:bold;float:left;text-align:left;display:inline;margin-bottom:0;">'+journals[j].class_name+'</h4>'):'';
					outString+=(journals[j].date_taught)?('<h5 style="font-weight:normal;float:right;text-align:right;display:inline;margin-bottom:0;">'+Ext.Date.format(journals[j].date_taught, 'n/j/Y')+'</h5>'):'';
					outString+=(journals[j].class_name || journals[j].date_taught)?('<div style="float:top;clear:both;width:100%;border-bottom:1px solid black;"></div>'):'';
					outString+='<p>';
					outString+=(journals[j].time_spent)?('<strong>Time Spent on '+item.record.get('code')+':</strong> '+journals[j].time_spent+' minutes<br/>'):'';
					var materials=journals[j].materials,
					pages=journals[j].pages,
					activities=journals[j].activities;
					outString+=(materials)?('<strong>Lesson Materials:</strong> '+materials):'';
					if(materials && pages){
					    outString+=(isNaN(pages))?(' (pages '+pages+')'):(' (page '+pages+')');
					}
					outString+=(materials)?'<br/>':'';
					if(activities.length>0){
					    var listString='';
					    outString+='<strong>Lesson Activities:</strong> ';
					    for(i in activities){
						listString+=(listString!='')?', ':'';
						listString+=activities[i].activity_name;
					    }
					    outString+=(listString+'<br/>');
					}
					outString+=(journals[j].notes)?'<strong>Notes:</strong> '+journals[j].notes+'<br/>':'';
					outString+='</p>';
					outString+='</div><br/>';				    
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
	return true;
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
    },
    exportReport: function(){
	//TODO:prepare HTML for export depending on report type, use jsPDF to generate PDF. then find a way to email it
	var settings=this.getReport().getSettings(),
        menu=this.getMenu(),
	me=this;
	Ext.Viewport.setMasked({xtype:'loadmask',message:'Generating report...'});
        menu.submit({
            url: '../promse/journal?token=8fbbd6f7c065e7176f47518922b38be0;action=generatereport;_dc=1372874005200;limit=25',
            method: 'POST',
	    success: function(form, response){
                console.log(response);
		Ext.Viewport.setMasked(false);
		Ext.Msg.alert("Success!", "Successfully generated report. Please check your email to retrieve your PDF.", Ext.emptyFn)
	    },
            failure: function(form, response){
                console.log(response);
		Ext.Viewport.setMasked(false);
		Ext.Msg.alert("Oops!", "Failed to generate report. Please try again later or contact the system administrator for assistance.", Ext.emptyFn)
            },
	    scope: me
        });

	//html=('<!doctype><html><head><title>Report for '+Ext.Date.format(settings.fromDate, 'n/j/Y')+'-'+Ext.Date.format(settings.toDate, 'n/j/Y')+'</title></head><body>'); 
	if(settings.type=='list'){
            /*var reportStore=Ext.getStore('ReportStoreR'), 
            groups=reportStore.getGroups(),
            records, record, item='';
            for(var g in groups){
		records=groups[g].children;
		html+=('<h2 style="border-bottom:5px solid black;width:100%">'+groups[g].name+'</h2>');
		for(var r in records){
		    record=records[r];
		    item=(record.data.class_name)?('<h3 style="border-bottom:2px solid black;">'+record.data.class_name+'</h3>'):'';
		    item+=(record.data.date_taught)?('<strong>Date:</strong> '+Ext.Date.format(record.data.date_taught, 'n/j/Y')+'<br/>'):'';
		    item+=(record.data.code)?('<strong>'+Ext.String.capitalize(settings.tier)+':</strong> '+record.data.code+'<br/>'):'';
		    item+=(record.data.description)?('<strong>Description:</strong> '+record.data.description+'<br/>'):'';
		    item+=(record.data.time_spent)?('<strong>Time Spent:</strong> '+record.data.time_spent+' minutes<br/>'):'';

		    var materials=record.data.materials,
		    pages=record.data.pages,
		    activities=record.data.activities;
		    item+=(materials)?('<strong>Lesson Materials:</strong> '+materials):'';
		    if(materials && pages){
			item+=(isNaN(record.data.pages))?(' (pages '+pages+')'):(' (page '+pages+')');
		    }
		    item+=(materials)?'<br/>':''; 
		    if(activities.length>0){                                                                                                                                                         
			var listString='';
			item+='<strong>Lesson Activities:</strong> ';
			for(index in activities){
                            listString+=(listString!='')?', ':'';
                            listString+=activities[index].activity_name;
			}
                        item+=(listString+'<br/>');
		    }
		    item+=(record.data.notes)?('<strong>Notes:</strong> '+record.data.notes+'<br/>'):'';
                    html+=item;
                    html+='<br/>';
                }
                html+='<br/>';
            }
	    html+='</body></html>';
	    var newwindow=window.open();
	    newwindow.document.write(html);*/
	}
	else{
	    
	}
    }
});
