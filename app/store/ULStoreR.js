Ext.define("app.store.ULStoreR", {
    extend: "Ext.data.Store",
    requires: ['app.model.ULModelR', 'app.model.ULStandardModelR'],
    config: {
        model: 'app.model.ULModelR',
	storeId: 'ULStoreR',
	autoLoad: false,
        proxy: {
	    type: 'ajax',
	    url: 'sample_user_log.json',//gets changed automatically in live deployment
	    reader: {
		type: 'json',
		rootProperty: 'userlog'
	    }
	},
	groupField: 'classname',
	sorters: ['datetaught', 'duration']
    }
});
