Ext.define('ChartDev.model.ULStandardModelR', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'fullcode', type: 'string', 
	     convert: function(value, record){
		 var fullCode=value.replace(/^\s+|\s+$/g, '');
		 return fullCode || record.get('frameworktitle') || 'Other';
	     }
	    },
	    {name: 'code', type: 'string',
		convert: function(value, record){
		    var fullCode=record.get('fullcode');
		    return fullCode;
		}
	    },
            {name: 'percent', type: 'int'},
            {name: 'framework_id', type: 'int'}
        ]
    }
});
