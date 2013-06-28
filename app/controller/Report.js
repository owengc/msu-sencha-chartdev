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
        'Ext.chart.interactions.ItemInfo',
	'Ext.chart.interactions.ItemHighlight',
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Scatter',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Time',
        'Ext.chart.Legend',
        'Ext.Anim'

    ],
    config: {
	refs: {
	    report: '#report',
	    toolbar: '#report #report_toolbar',
	    toolbarButton: '#report_toolbar #report_toolbarButton',
	    menu: '#report #report_menu',
	    filter: '#report_menu #report_filter',
	    filterSwitch: '#report_menu #report_filterSwitch',
//	    filterType: '#report_
	    filterDetail: '#report_menu #report_filter_detail',
	    filterDetailList: '#report_filter_detailList',
	    filterDetailListButton: '#report_filter_detailListButton',
	    content: '#report #report_content'
	},
	control: {
	    toolbar: {
		tap: 'toggleMenu'
	    },
	    toolbarButton: {
		tap: 'toggleMenu'
	    },
	    filterSwitch: {
		change: 'toggleFilter'
	    },
	    filterDetail: {
		'tap': 'showFilterDetailList'
	    },
	    filterDetailListButton: {
		tap: 'hideFilterDetailList'
	    }
	}
    },
    toggleMenu: function(e){
	var menu=this.getMenu(),
        toolbarButton=this.getToolbarButton(),
	content=this.getContent();
	if(menu.isHidden()){
	    if(content){
		content.hide();
		setTimeout(function(){menu.show();}, 250);
		setTimeout(function(){toolbarButton.setIconCls('arrow_up');}, 500);
		console.log('chart hidden')
	    }
	    else{
		menu.show();
		setTimeout(function(){toolbarButton.setIconCls('arrow_up');}, 250);
	    }
        }
        else{
	    if(this.submitMenu()==true){
		menu.hide();		
		setTimeout(function(){toolbarButton.setIconCls('arrow_down');}, 500);
		if(content){
		    setTimeout(function(){content.show();}, 250);
		}
	    }
        }
    },
    submitMenu: function(){
	console.log('controller: menu submitted');
        var values=this.getMenu().getValues(true, true);
      	if(this.validateMenuForm(values)){
	    console.log('controller: menu validated');
	    var report=this.getReport();
	    if(JSON.stringify(values)!=JSON.stringify(report.getMenuState())){
		console.log('view: menu changed');
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
            if(values[value]==null){
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
	filterDetailList=this.getFilterDetailList() || null;
	if(filterDetailList===null){
	    Ext.Viewport.add(Ext.create('ChartDev.view.component.FilterDetailList', {
		targetDepth: 2
	    }));
	    filterDetailList=this.getFilterDetailList();
	}
	else{
	    console.log('found detailList');
	}
	Ext.Viewport.animateActiveItem('#report_filter_detailList', {type: 'fade', duration: 250});
    },
    hideFilterDetailList: function(){
	var filterDetail=this.getFilterDetail(),
	filterDetailList=this.getFilterDetailList(),
	selections=filterDetailList.getSelectedItems(),
	option={},
	text='';
	for(item in selections){
	    if(text!=''){
		text+=' or ';
	    }
	    data=selections[item].getData();
	    text+=(data.levelname=='Domain')?data.domain_id:(data.levelname=='Cluster')?data.cluster_id:(data.levelname=='Standard')?data.fullcode:null;
	}
	option.text=text;
	filterDetail.setOptions([option]);
	Ext.Viewport.animateActiveItem('#report', {type: 'fade', duration: 250});
    },
    updateContent: function(params){
	console.log('controller: updateContent');
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
		if(date>=params.fromDate || date<=params.toDate){
		    return true;
		}
		else{
		    return false;
		}
	    });
	}
	var genericFields = [
	    {name: 'journal_id', type: 'string'},
	    {name: 'framework_id', type: 'string'},
	    {name: 'class_name', type: 'string'},
	    {name: 'grade', type: 'string'},
	    {name: 'duration', type: 'int'},
	    {name: 'datetaught', type: 'date', dateFormat: 'Y-m-d'},
	],
	reportData=[],
	logs=userLogStore.getData().items,
	numLogs=logs.length,
	i=0;
	//	    framework=Ext.getStore(';
	if(params.tier==='standard'){
	    var reportFields=genericFields.concat([
		{name: 'standard', type: 'string'},
		{name: 'standard_title', type: 'string'},
		{name: 'standard_desc', type: 'string'}
	    ]);
	    for(;i<numLogs;i++){
		var logData=logs[i].getData(),
		standards=logs[i].standardsStore.getData().items,
		numStandards=standards.length,
		j=0;
		for(;j<numStandards;j++){
		    var standardData=standards[j].getData();
		    reportData.push({
			journal_id: logData.journalid,
			framework_id: standardData.framework_id,
			class_name: logData.classname,
			grade: standardData.grade,
			duration: logData.duration,//this needs to change
			datetaught: logData.datetaught,
			standard: standardData.fullcode,
			standard_title: standardData.frameworktitle,
			//standard_desc: 
		    });
		}
	    }
	}
	else if(params.tier==='cluster'){
	    var reportFields=genericFields.concat([
		{name: 'cluster_id', type: 'string'},
		{name: 'cluster_title', type: 'string'},
		{name: 'cluster_desc', type: 'string'}
	    ]);
	}
	else if(params.tier==='domain'){
	    var reportFields=genericFields.concat([
		{name: 'domain_id', type: 'string'},
		{name: 'domain', type: 'string'},
		{name: 'domain_title', type: 'string'},
		{name: 'domain_desc', type: 'string'}
	    ]);
	    for(;i<numLogs;i++){
		var logData=logs[i].getData(),
		domainMemo={},
		standards=logs[i].standardsStore.getData().items,
		numStandards=standards.length,
		j=0;
		for(;j<numStandards;j++){
		    var standardData=standards[j].getData();
		    if(!domainMemo[standardData.domain]){
			domainMemo[standardData.domain]={
			    journal_id: logData.journalid,
			    framework_id: [standardData.framework_id],
			    class_name: logData.classname,
			    grade: standardData.grade,
			    duration: logData.duration,//this needs to change
			    datetaught: logData.datetaught,
			    domain: standardData.domain,
			    duration: logData.duration
			}
		    }
		    else{
			domainMemo[standardData.domain].duration+=logData.duration;//this needs to change
			domainMemo[standardData.domain].framework_id.push(standardData.framework_id);
		    }
		}
		for(uniqueDomainRecord in domainMemo){
		    domainMemo[uniqueDomainRecord].framework_id=domainMemo[uniqueDomainRecord].framework_id.toString();
		    reportData.push(domainMemo[uniqueDomainRecord]);
		}
	    }
	}
	Ext.define('ReportModel', {
	    extend: 'Ext.data.Model',
	    config: {
		fields: reportFields
	    }
	});
	console.log(reportData);
	var reportStore=Ext.create('Ext.data.Store', {
	    storeId: 'ReportStore',
	    model: 'ReportModel',
	    data: reportData,
	    groupField: 'class_name',
	    sorters: ['datetaught', params.tier]
	});

	if(params.type==='list'){
	    content=Ext.create('Ext.List', {
		itemId: 'report_content',
		height: '100%',
		animate: true,
		hidden: true,
		showAnimation: {type: 'slideIn', direction: 'up', duration: 250},
                hideAnimation: {type: 'slideOut', direction: 'down', duration: 250},
		store: 'ReportStore',
		itemTpl: ('<div style="float:top"><b>{datetaught:date("m/d/Y")}</b></div><div style="float:top">'+Ext.String.capitalize(params.tier)+': {'+params.tier+'}</div>'),
		itemHeight: 75,
		grouped: true,
		onItemDisclosure: true,
		listeners: {
		    disclose: function(scope, record, target, index){
			scope.select(record, false, false);
			var outString=(record.data.standard)?('<div style="float:top"><b>Fullcode:</b> '+record.data.standard+'</div>'):'';
			outString+=(record.data.standard_title)?('<div style="float:top"><b>Standard Title:</b> '+record.data.standard_title+'</div>'):'';
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
                            params.tier
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
			fill: true,
			xField: 'datetaught',
			yField: params.tier,
			marker: {
			    type: 'circle',
			    fillStyle: 'darkblue',
			    strokeStyle: 'blue',
			    radius: 10,
			    lineWidth: 0
			},
			highlightCfg: {
			    type: 'circle',
			    fillStyle: 'green',
			    strokeStyle: 'yellowgreen',
			    radius: 15,
			    lineWidth: 1
			}
		    }
		],
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
				var outString=('<div><h3>'+item.record.get('class_name')+' '+Ext.Date.format(item.record.get('datetaught'), 'm/d/Y')+'</h3></div>');
				outString+=(item.record.get('framework_id'))?('<div style="float:top"><b>Frameword Id:</b> '+item.record.get('framework_id')+'</div>'):'';
				outString+=(item.record.get('standard_title'))?('<div style="float:top"><b>Frameword Title:</b> '+item.record.get('standard_title')+'</div>'):'';
				outString+=(item.record.get('journal_id'))?('<div style="float:top"><b>Journal Id:</b> '+item.record.get('journal_id')+'</div>'):'';
				panel.setHtml(outString);
			    }
			}
		    },
		    {
			type: 'itemhighlight'
		    }
		]
            });
        }
	else if(params.type==='bar'){
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
		flipXY: true,
                store: 'ULStore',
                axes: [
		    {
			type: 'numeric',
			position: 'bottom',
			fields: [
                            'duration'
			],
			title: {
                            text: 'Time Spent (min)',
			},
			style: {

			},
			minimum: 0,
		    },
		    {
                        type: 'category',
                        position: 'left',
                        fields: [
                            params.tier
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
			xField: params.tier,
			yField: 'duration',
			style: {
			    fill: 'blue'
			}
		    }
		]/*,
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
            });
	}
	else{
            console.log('invalid report type');
	    return false;
        }
	report.add(content);
	content.show();
    },
    updateChartX: function(me, The, slot, eOpts){
	console.log(me.id, ' picked (X-axis)');
    },
    updateChartY: function(me, The, slot, eOpts){
	console.log(me.id, ' picked (Y-axis)');
    }
});


