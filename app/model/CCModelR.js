Ext.define('app.model.CCModelR', {
    extend: 'Ext.data.Model',
    config: {
	idProperty: 'id',
        fields: [
	    {name: 'grade_id', type: 'string'},
	    {name: 'domain_id', type: 'string'},
	    {name: 'cluster_id', type: 'string'},
	    {name: 'standard_id', type: 'string'},
            
            {name: 'levelname', type: 'string'},
            {name: 'description', type: 'string',
             convert: function(value, record){
		 if(value){
                     return value.replace(/^\s+|\s+$/g, '');
		 }
             }
	    },
	    {name: 'code', type: 'string',
             convert: function(value, record){
		 if(value){
                     return value.replace(/^\s+|\s+$/g, '');
		 }
             }
	    }
        ]
    }
});
