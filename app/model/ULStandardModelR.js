Ext.define('app.model.ULStandardModelR', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'fullcode', type: 'string', 
	     convert: function(value, record){
		 if(value!=null){
		     var fullcode=value.replace(/^\s+|\s+$/g, '');
		     return fullcode || 'Other';
		 }
		 return '';
	     }
	    },
	    {name: 'code', type: 'string',
	     convert: function(value, record){
		 if(value!=null){
		     var code=value.replace(/^\s+|\s+$/g, '');
		     return code || 'Other';
		 }
		 return '';
	     }
	    },
	    {name: 'frameworktitle', type: 'string',
	     convert: function(value, record){
		 if(value!=null){
		     var frameworktitle=value.replace(/^\s+|\s+$/g, '');
		     return frameworktitle || 'No description.';
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
            {name: 'framework_id', type: 'int'},
	    {name: 'standard_id', type: 'int'}
        ]
    }
});
