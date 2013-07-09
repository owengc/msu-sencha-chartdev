Ext.define('ChartDev.model.ULStandardModelR', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'fullcode', type: 'string', 
	     convert: function(value, record){
		 var fullCode=value.replace(/^\s+|\s+$/g, '');
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
		 var frameworkTitle=value.replace(/^\s+|\s+$/g, '');
		 return frameworkTitle;
	     }
	    },
	    {name: 'description', type: 'string',
	     convert: function(value, record){
		 return record.get('frameworktitle');
	     }
	    },
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
