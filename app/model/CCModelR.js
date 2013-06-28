Ext.define('ChartDev.model.CCModelR', {
    extend: 'Ext.data.Model',
    config: {
	idProperty: 'id',
        fields: [
	    {name: 'id', type: 'int'},
            {name: 'fullcode', type: 'string'},
	    {name: 'grade_id', type: 'string'},
	    {name: 'domain_id', type: 'string'},
	    {name: 'cluster_id', type: 'string'},
	    {name: 'framework_id', type: 'string'},
	    {name: 'text', type: 'string'},
            {name: 'description', type: 'string'},
            {name: 'levelname', type: 'string'},
            {name: 'code', type: 'string'}
	    //{name: 'children'}
        ]/*,
	hasMany: {
            model: 'ChartDev.model.CCGradeModelR',
            name: 'children',
            associationKey: 'grade_id'
	}*/
    }
});
