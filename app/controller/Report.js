Ext.define('ChartDev.controller.Report', {
    extend: 'Ext.app.Controller',
    config: {
	refs: {
	    reportMenu: '#report_menu',
	    reportMenuButton: '#report_menuButton',
	    chart: '#report_chart',
	    list: '#report_list'
	},
	control: {
	    reportMenuButton: {
		tap: 'toggleReportMenu'
	    }
	}
    },
    toggleReportMenu: function(){
	console.log('controller detected tap on menuButton');
	var menu=this.getReportMenu(),
        menuButton=this.getReportMenuButton();
	if(menu.isHidden()){
	    menu.show();
	    menuButton.setIconCls('arrow_up');
        }
        else{
	    menu.hide();
	    menuButton.setIconCls('arrow_down');
        }
    },
    updateChartX: function(me, The, slot, eOpts){
	console.log(me.id, ' picked (X-axis)');
    },
    updateChartY: function(me, The, slot, eOpts){
	console.log(me.id, ' picked (Y-axis)');
    }
});


