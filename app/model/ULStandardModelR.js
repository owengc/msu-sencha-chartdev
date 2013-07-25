Ext.define('app.model.ULStandardModelR', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'fullcode', type: 'string', 
	     convert: function(value, record){
		 var code=record.get('code');
		 if(code){
		     code=code.replace(/^\s+|\s+$/g, '');
		 }
		 var fullCode=value.replace(/^\s+|\s+$/g, '') || code;
		 return fullCode || 'Other';
	     }
	    },
	    {name: 'code', type: 'string',
	     convert: function(value, record){
		 var fullCode=record.get('fullcode');
		 return fullCode;
	     }
	    },
	    {name: 'frameworktitle', type: 'string',
	     convert: function(value, record){
		 var description=record.get('description');
		 if(description){
		     description=description.replace(/^\s+|\s+$/g, '');
		 }
		 var frameworkTitle=value.replace(/^\s+|\s+$/g, '') || description;
		 return frameworkTitle;
	     }
	    },
	    {name: 'description', type: 'string',
	     convert: function(value, record){
		 return record.get('frameworktitle');
	     }
	    },
	    {name: 'duration_mask', type: 'string'},
            {name: 'percent', type: 'int'},
            {name: 'framework_id', type: 'int'},
	    {name: 'standard_id', type: 'int',
	     convert: function(value, record){
		 return record.get('framework_id');
	     }
	    }
        ]
    }
});
