Ext.define('ChartDev.controller.Report', {
    extend: 'Ext.app.Controller',
    config: {
	refs: {
	    reportToolbar: '#report_toolbar',
	    reportMenu: '#report_menu',
	    reportMenuButton: '#report_menuButton',
	    chart: '#report_chart',
	    list: '#report_list'
	},
	control: {
	    reportToolbar: {
		tap: 'toggleReportMenu'
	    },
	    reportMenuButton: {
		///tap: 'toggleReportMenu'
	    }
	}
    },
    toggleReportMenu: function(e){
	console.log('controller detected ', e, ' on menuButton');
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
    },
    initialize: function(){
	var UserLogStore = Ext.create('ChartDev.store.UserLogStoreR');
	UserLogStore.load();
    }
});


