

/*
Ext.regStore('UserChartStore', {
    model: 'UserLogModel',
    proxy: {
        type: 'ajax',
        //url: 'userlog.json',        
        url: '../promse/journal?token=' + localStorage.getItem('token') + '&action=getuserlog&limit=1000',
        reader:{
            type:'json',
            root: 'userlog',            
        },
        
    },
    sorters: [
        {
            property: 'framework_id',
            direction: 'ASC',
        },
        
    ]
    
});
*/
