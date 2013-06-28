Ext.define('ChartDev.model.CCGradeModelR', {
    extend: 'Ext.data.Model',
    config: {
	idProperty: 'grade_id',
        fields: [
            {name: 'grade_id', type: 'int'},
	    {name: 'text', type: 'string'},
            {name: 'description', type: 'string'},
            {name: 'levelname', type: 'string'},
            {name: 'code', type: 'string'},
            {name: 'children'}
        ]/*,
        hasMany: {
            model: 'ChartDev.model.CCDomainModelR',
            name: 'children',
            associationKey: 'children'
        }*/
    }
});

