Ext.define('ChartDev.model.FrameworkModel1', {
    extend: 'Ext.data.Model',
    
    config: {
       
        fields: [
            {name: 'fullcode', type: 'string'},
            {name: 'framework_id', type:'string'},
            {name: 'code', type: 'string'},        
            {name: 'text', type: 'string'},
            {name: 'frameworktitle', type: 'string'},
            {name: 'levelname', type: 'string'},
            {name: 'description', type: 'string'},
            {name: 'percent', type: 'string'}
        ],
        belongsTo: 'ChartDev.model.LessonModel1'
    }
});
