Ext.define('ChartDev.controller.Report', {
    extend: 'Ext.app.Controller',
    requires: [
        'ChartDev.store.UserLogStoreR',
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
	    content: '#report #report_content'
	},
	control: {
	    toolbar: {
		tap: 'toggleMenu'
	    },
	    toolbarButton: {
		tap: 'toggleMenu'
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
    updateContent: function(params){
	console.log('controller: updateContent');
        var report=this.getReport(),
	content=this.getContent(),
	store=Ext.getStore('UserLogStore');
	if(content){
	    report.remove(content, true);
	    store.clearFilter();
	}
	if(params.fromDate && params.toDate){
	    store.filterBy(function(rec, id){
		var date=rec.get('datetaught');
		if(date>=params.fromDate || date<=params.toDate){
		    return true;
		}
		else{
		    return false;
		}
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
		store: 'UserLogStore',
		itemTpl: ('<div style="float:top"><b>{datetaught:date("m/d/Y")}</b></div><div style="float:top">'+Ext.String.capitalize(params.tier)+': {'+params.tier+'}</div>'),
		itemHeight: 75,
		grouped: true,
		onItemDisclosure: true,
		listeners: {
		    disclose: function(scope, record, target, index){
			scope.select(record, false, false);
			var outString=(record.data.framework_id)?('<div style="float:top"><b>Frameword Id:</b> '+record.data.framework_id+'</div>'):'';
			outString+=(record.data.frameworktitle)?('<div style="float:top"><b>Frameword Title:</b> '+record.data.frameworktitle+'</div>'):'';
			outString+=(record.data.journalid)?('<div style="float:top"><b>Journal Id:</b> '+record.data.journalid+'</div>'):'';/*
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
			    title: ('<div>'+record.data.classname+' '+Ext.Date.format(record.data.datetaught, 'm/d/Y')+'</div>'), 
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
        else if(params.type==='dot' || params.type==='bar'){
	    if(params.type==='dot'){//dot
		var series=[
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
		];
		var xAxis={
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
		};
	    }
	    else{//bar
		var series=[
		    {
			type: 'bar',
			fill: true,
			xField: 'duration',
			yField: params.tier,
			style: {
			    fill: 'darkblue'
			}
		    }
		];
		var xAxis={
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
		    minimum: 0
		};
	    }
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
		flipXY: (params.type==='dot')?false:true,
                store: 'UserLogStore',
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
		    xAxis
                ],
		series: series,
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
		]
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


