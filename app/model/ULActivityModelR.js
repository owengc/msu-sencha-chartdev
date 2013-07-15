Ext.define('app.model.ULActivityModelR', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'activity_id', type: 'int'},
	    {name: 'activity_name', type: 'string'}
        ]
    }
});
