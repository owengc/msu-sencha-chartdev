Ext.define('app.model.ULModelR', {
    extend: 'Ext.data.Model',
    
    config: {       
        fields: [
            {name: 'journalid', type: 'string'},
            {name: 'datetaught', type: 'date', dateFormat: 'Y-m-d'},
            {name: 'classid', type: 'string'},
            {name: 'classname', type: 'string'},
            {name: 'duration', type: 'int'},
            {name: 'activity', type: 'string'},
            {name: 'materialid', type: 'int'},
            {name: 'materialname', type:'string'},
            {name: 'usermaterials', type: 'string'},
            {name: 'pages', type: 'string'},
            {name: 'background', type: 'string'},
            {name: 'notes', type:'string'},
            {name: 'activitycsv', type:'string'},
            {name: 'practicescsv', type:'string'},
            {name: 'activity'},
            {name: 'standards'},
            {name: 'math_practices'}
        ],
	hasMany: {
	    model: 'app.model.ULStandardModelR',
	    name: 'standards',
	    associationKey: 'standards'
	}
    }
});
