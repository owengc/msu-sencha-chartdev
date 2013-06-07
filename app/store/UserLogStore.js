Ext.define("ChartDev.store.UserLogStore", {
    extend: "Ext.data.Store",
    requires: ['ChartDev.model.UserLogModel'],
    config: {
        model: 'ChartDev.model.UserLogModel',
	storeId: 'UserLogStore',
	autoLoad: false,
//	clearOnPageLoad: false,
//	remoteFilter: false,
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

/*
Ext.define('iPad2.store.UserLogStore', {
    extend: 'Ext.data.Store',
    //requires: 'iPad2.model.UserModel',
    
    config: {
        model: 'iPad2.model.UserLogModel',
        storeId:'UserLogStore',
        proxy: {
            type: 'ajax',
            url: '../promse/journal?action=getuserlog14',
            reader:{
                type:'json',
                rootProperty:'userlog'            
            }
        },
        autoLoad: false
    }   
});
*/
