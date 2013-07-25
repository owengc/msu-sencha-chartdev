Ext.define('app.model.ULStandardModelR', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'fullcode', type: 'string', 
	     convert: function(value, record){
		 var fullcode, code;
		 if(value){
		     fullcode=value.replace(/^\s+|\s+$/g, '') || code;
		 }
		 else{
		     code=record.get('code');
		     if(code){
			 code=code.replace(/^\s+|\s+$/g, '');
		     }
		 }
		 return fullcode || code || 'Other';
	     }
	    },
	    {name: 'code', type: 'string',
	     convert: function(value, record){
		 var code, fullcode;
		 if(value){
		     code=value.replace(/^\s+|\s+$/g, '');
		 }
		 else{
		     fullcode=record.get('fullcode');
		 }
		 return code || fullcode || 'Other';
	     }
	    },
	    {name: 'frameworktitle', type: 'string',
	     convert: function(value, record){
		 var frameworktitle, description;
		 if(value){
		     frameworkTitle=value.replace(/^\s+|\s+$/g, '');
		 }
		 else{
		     description=record.get('description');
		     if(description){
			 description=description.replace(/^\s+|\s+$/g, '');
		     }
		 }
		 return frameworktitle || description || 'No description.';
	     }
	    },
	    {name: 'description', type: 'string',
	     convert: function(value, record){
		 var description, frameworktitle;
		 if(value){
		     description=value.replace(/^\s+|\s+$/g, '');
		 }
		 else{
		     frameworktitle=record.get('frameworktitle');
		     if(frameworktitle){
			 frameworktitle=frameworktitle.replace(/^\s+|\s+$/g, '');
		     }
		 }
		 return description || frameworktitle || 'No description.';
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
