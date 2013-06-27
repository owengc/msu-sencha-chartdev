Ext.define("ChartDev.store.FrameworkStoreR", {
    extend: "Ext.data.TreeStore",
    requires: ['ChartDev.model.FrameworkModelR'],
    config: {
        model: 'ChartDev.model.FrameworkModelR',
	storeId: 'FrameworkStore',
	autoLoad: true,
        proxy: {
	    type: 'ajax',
	    url: 'framework.json',
	    reader: {
		type: 'json',
		//root: 'children'
	    },
	    rootProperty: 'children'
	}/*,
	groupField: 'classname',
	sorters: ['datetaught', 'duration'],*/
    },
});
