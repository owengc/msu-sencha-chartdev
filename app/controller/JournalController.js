Ext.define('app.controller.JournalController', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.MessageBox',
        'Ext.data.Store',
    ],
    config: {
	models: ['ULModelR', 'ULStandardModelR', 'CCModelR'],
	stores: ['ULStoreR', 'CCStoreR'],
	views: ['JournalView'],
	refs: {
	    durationField: '[itemId=journal_duration]',//mysterious. in all my other controller refs, using # with itemId works perfectly. not so with this one
	    inputList: '#journal_inputList'
	},
	control: {
	    durationField: {
		keyup: 'updateDuration',
		change: 'updateDuration'
	    }
	},
    },
    loadUserLog: function(){
        var userLog = Ext.getStore('ULStoreR'),
	token=app.app.token || null,
	me=this;
	if(token){//this is here so my store will know to load local sample data or server data
	    var proxy=userLog.getProxy();
            proxy.setExtraParam('token', token);
	    proxy.setUrl('../promse/journal?action=getuserlog14');
	}
	Ext.Viewport.setMasked({xtype:'loadmask',message:'Loading user logs...'});
        userLog.load({
	    callback: function(records, operations, success){
		var userLogStore=Ext.getStore('ULStoreR');
		//console.log(userLogStore.getData().items);
		var log=userLogStore.getData().items[7],//hard coding an arbitrary selection from the ULdata..
		duration=log.getData().duration || 0,
		standards=log.getData().standards || [];
		//console.log('dur:', duration, 'stan:', standards);
		

		/*This store must be created for use in the dataview component which stores the 
		  list of InputItems (rangeselectors)*/
		var standardStore=Ext.create('Ext.data.Store', {
		    storeId: 'ULStandardStoreR',
		    model: 'app.model.ULStandardModelR',
		    data: standards,
		});
		standardStore.load();
		var durationField=me.getDurationField(),
		inputList=me.getInputList();
		durationField.setValue(duration);
		inputList.setStore(standardStore);//Important: setting the store on the list can't be done until the data is loaded, that's why it's in this callback.
		Ext.Viewport.setMasked(false);
	    }
	});
    },	
    updateDuration: function(){
        var rangeSelectors=Ext.ComponentQuery.query('rangeselector'),
        rangeSelectorCount=rangeSelectors.length,
        i=0;
        for(;i<rangeSelectorCount;i++){
            rangeSelectors[i].displayTotalMinutes();
        }
        //console.log('duration changed');
    }
});
