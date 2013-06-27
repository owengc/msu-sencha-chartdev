Ext.define("ChartDev.store.FrameworkStoreR", {
    extend: "Ext.data.TreeStore",
    requires: ['ChartDev.model.FrameworkModelR'],
    config: {
        model: 'ChartDev.model.FrameworkR',
	storeId: 'FrameworkStore',
	autoLoad: true,
        proxy: {
	    type: 'ajax',
	    url: 'framework.json',
	    reader: {
		type: 'tree',
		root: 'children'
	    }
	}/*,
	groupField: 'classname',
	sorters: ['datetaught', 'duration'],*/
    },
});
