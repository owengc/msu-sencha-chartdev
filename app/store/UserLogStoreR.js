Ext.define("ChartDev.store.UserLogStoreR", {
    extend: "Ext.data.Store",
    requires: ['ChartDev.model.UserLogModelR'],
    config: {
        model: 'ChartDev.model.UserLogModelR',
	storeId: 'UserLogStore',
	autoLoad: false,
        proxy: {
	    type: 'ajax',
	    url: 'sample_user_log.json',
	    reader: {
		type: 'json',
		rootProperty: 'userlog'
	    }
	}
    }
});
