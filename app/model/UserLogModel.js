Ext.define('ChartDev.model.UserLogModel', {
    extend: 'Ext.data.Model',
    
    config: {       
        fields: [
            {name: 'journalid', type: 'string'},
         //   {name: 'framework_id', type: 'string'},
         //   {name: 'frameworktitle', type: 'string'},
            {name: 'datetaught',     type: 'string'},
            {name: 'classid', type: 'string'},
            {name: 'classname', type: 'string'},
            {name: 'duration',    type: 'string'},
            //{name: 'activity', type: 'string'},
            {name: 'materialid', type: 'int'},
            //{name: 'materialname', type:'string'},
            {name: 'usermaterials', type: 'string'},
            {name: 'pages', type: 'string'},
            {name: 'background', type: 'string'},
            {name: 'notes', type:'string'},
            {name: 'activitycsv', type:'string'},
            {name: 'practicescsv', type:'string'},
            {name: 'activity'},
            {name: 'standards'},
            {name: 'math_practices'},
        ],
        hasMany:[{model:'ULActivityModel', name:'activity'},
                {model:'FrameworkModel1', name:'standards'},
                {model:'ULMathPracticesModel', name:'math_practices'}]
        
    }
});
