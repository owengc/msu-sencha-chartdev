Ext.define('ChartDev.model.FrameworkModelR', {
    extend: 'Ext.data.Model',
    config: {
	idProperty: 'framework_id',
        fields: [
            {name: 'fullcode', type: 'string'},
            {name: 'frameworktitle', type: 'string'},
            {name: 'percent', type: 'int'},
            {name: 'duration_mask', type: 'string'},
            {name: 'framework_id', type: 'int'}
        ]
    }
});
