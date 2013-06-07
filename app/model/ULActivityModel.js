Ext.define('ChartDev.model.ULActivityModel', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: 'activity_id', type: 'string'},
            {name: 'activity_name', type: 'string'},        

        ],
      //  belongsTo: 'iPad2.model.UserLogModel'
    }
});
