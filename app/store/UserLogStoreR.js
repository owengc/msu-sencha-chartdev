Ext.define("ChartDev.store.UserLogStoreR", {
    extend: "Ext.data.Store",
    requires: ['ChartDev.model.UserLogModelR'],
    config: {
        model: 'ChartDev.model.UserLogModelR',
	storeId: 'UserLogStore',
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
