Ext.define('ChartDev.model.ULStandardModelR', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'fullcode', type: 'string', 
	     convert: function(value, record){
		 var fullCode=value.replace(/^\s+|\s+$/g, '');
		 return fullCode;
	     }
	    },
            {name: 'frameworktitle', type: 'string', 
	     convert: function(value, record){
		 var title=value.replace(/^\s+|\s+$/g, '');
		 return title;
	     }
	    },
            {name: 'percent', type: 'int'},
	    //            {name: 'duration_mask', type: 'string'},
            {name: 'framework_id', type: 'int'},
	    {name: 'grade', type: 'string',
	     convert: function(value, record){
		 var fullCode=record.get('fullcode'),
		 splits=fullCode.split('.'),
		 grade;
		 if(splits.length<=2){
		     grade='NA';
		 }
		 else{
		      grade=splits[0];
		 }
		 return grade;
	     }
	    },
	    {name: 'domain', type: 'string',
	     convert: function(value, record){
		 var fullCode=record.get('fullcode'),
		 splits=fullCode.split('.'),
		 domain;
		 if(splits.length==1){
		     domain='Other';
		 }
		 else if(splits.length==2){
		     domain=splits[0];
		 }
		 else{
		     domain=splits[1];
		 }
		 return domain;
	     }
	    },
	    {name: 'cluster', type: 'string',
	     convert: function(value, record){
		 return '';
	     }
	    },
	    {name: 'standard', type: 'string',
	     convert: function(value, record){
		 var fullCode=record.get('fullcode'),
		 splits=fullCode.split('.'),
		 standard;
		 if(splits.length==1){
		     standard='Other';
		 }
		 else if(splits.length==4){
		     standard=splits[2]+'.'+splits[3];
		 }
		 else if(splits.length==3){
		     standard=splits[2];
		 }
		 else{
		     standard=splits[1];
		 }
		 return standard;
	     }
	    }
        ]
    }
});
