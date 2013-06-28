Ext.define("ChartDev.store.ULStoreR", {
    extend: "Ext.data.Store",
    requires: ['ChartDev.model.ULModelR', 'ChartDev.model.ULStandardModelR'],
    config: {
        model: 'ChartDev.model.ULModelR',
	storeId: 'ULStore',
	autoLoad: true,
        proxy: {
	    type: 'ajax',
	    url: 'sample_user_log.json',
	    reader: {
		type: 'json',
		rootProperty: 'userlog'
	    }
	},
	groupField: 'classname',
	sorters: ['datetaught', 'duration'],
    },
});
