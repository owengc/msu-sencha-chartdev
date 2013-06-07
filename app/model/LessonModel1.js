Ext.define('ChartDev.model.LessonModel1', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
            {name: 'datetaught',     type: 'string'},
            {name: 'classid', type: 'string'},
            {name: 'duration',    type: 'int'},
            {name: 'activity', type: 'string'},
            {name: 'materialid', type: 'string'},
            {name: 'pages', type: 'string'},
            {name: 'background', type: 'string'},
            {name: 'notes', type:'string'},
            {name: 'math', type: 'string'},
            {name: 'action', type: 'string'},
            {name: 'startinglist', type: 'string'},
            {name: 'journalid', type: 'string'}
        ],
        hasMany: {
            model: 'ChartDev.model.FrameworkModel1'
        }
    }
});
