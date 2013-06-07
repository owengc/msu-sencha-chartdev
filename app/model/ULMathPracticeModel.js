Ext.define('ChartDev.model.ULMathPracticesModel', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: 'math_practice_id', type: 'string'},
            {name: 'math_practice_name', type: 'string'},        
        ],
     //   belongsTo: 'iPad2.model.UserLogModel'

    }
});
