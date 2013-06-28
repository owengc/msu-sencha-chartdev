Ext.define("ChartDev.store.CCStoreR", {
    extend: "Ext.data.TreeStore",
    requires: ['ChartDev.model.CCModelR'],
    config: {
        model: 'ChartDev.model.CCModelR',
	storeId: 'CCStore',
	defaultRootProperty: 'children',
	autoLoad: true,
        proxy: {
	    type: 'ajax',
	    url: 'framework.json',
	    /*reader: {
		type: 'json',
		//root: 'children'
	    },*/
	    //rootProperty: 'children'
	}/*,
	groupField: 'classname',
	sorters: ['datetaught', 'duration'],*/
    },
});
