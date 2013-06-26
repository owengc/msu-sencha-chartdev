Ext.define('ChartDev.model.ActivityModelR', {
    extend: 'Ext.data.Model',
    config: {
	idProperty: 'activity_id',
	fields:[
            {name: 'activity_id', type:'int'},
            {name: 'activity_name', type: 'string'}
        ]
    }
});
