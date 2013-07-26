Ext.define('app.model.ULStandardModelR', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
	    {name: 'code', type: 'string',
	     convert: function(value, record){
		 if(value!=null){
		     var code=value.replace(/^\s+|\s+$/g, '');
		     return code || 'Other';
		 }
		 return '';
	     }
	    },
	    {name: 'description', type: 'string',
	     convert: function(value, record){
		 if(value!=null){
		     var description=value.replace(/^\s+|\s+$/g, '');
		     return description || 'No description.';
		 }
		 return '';
	     }
	    },
	    {name: 'duration_mask', type: 'string'},
            {name: 'percent', type: 'int'},
	    {name: 'standard_id', type: 'int'}
        ]
    }
});
