Ext.define("app.store.CCStoreR", {
    extend: "Ext.data.TreeStore",
    requires: ['app.model.CCModelR'],
    config: {
        model: 'app.model.CCModelR',
	storeId: 'CCStoreR',
	defaultRootProperty: 'children',
	autoLoad: true,
        proxy: {
	    type: 'ajax',
	    url: 'framework.json'
	}
    }
});
