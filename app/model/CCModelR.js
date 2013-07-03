Ext.define('ChartDev.model.CCModelR', {
    extend: 'Ext.data.Model',
    config: {
	idProperty: 'id',
        fields: [
            {name: 'fullcode', type: 'string'},
	    {name: 'grade_id', type: 'string'},
	    {name: 'domain_id', type: 'string'},
	    {name: 'cluster_id', type: 'string'},
	    {name: 'framework_id', type: 'string'},
            
            {name: 'levelname', type: 'string'},
            {name: 'description', type: 'string'},
	    {name: 'text', type: 'string'},
	    {name: 'code', type: 'string',
	     convert: function(value, record){
		 if(record.get('levelname')=='Standard'){
		     return record.get('fullcode');
		 }
		 else{
		     return value;
		 }
	     }
	    }
        ]
    }
});
