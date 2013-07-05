//var parentBranch,sublist,item;
//var changedTo;
Ext.define('ChartDev.view.component.FilterDetailList', {
    extend: 'Ext.NestedList',
    alias: 'report_filter_detailList',
    xtype: 'filterdetaillist',
    name: 'filterDetailList',
    config: {
	itemId: 'report_filter_detailList',
	fullscreen: true,
	toolbar: {
	    docked: 'top',
	    ui: 'light',
	    inline: 'true',
	    items: [
		
		{
		    id: 'report_filter_detailListClearButton',
		    ui: 'decline',
		    text: 'Clear',
		    align: 'right'
		},
		{
		    xtype: 'spacer',
		    width: 30,
		    align: 'right'
		},
		{
		    id: 'report_filter_detailListDoneButton',
		    ui: 'confirm',
		    text: 'Done',
		    align: 'right'
		}
	    ]
	},
	displayField: 'description',
	store: 'CCStore',
	targetDepth: '',
	selectedItems: {},
	branchesWithSelections: {},
	branchId: null,
	branch: null,
	root: null,
	listeners: {
	    listchange: function(scope, list){
		list.setMode('MULTI');
		list.setDeselectOnContainerClick(false);
		this.limitDepth();
		var branchId=list.getStore().getData().items[0].parentNode.getId(),
		branchesWithSelections=this.getBranchesWithSelections();
		if(branchId){
		    if(branchesWithSelections[branchId]){
			var selections=branchesWithSelections[branchId],
			numSelections=selections.length,
			i=0;
			for(;i<numSelections;i++){
			    list.select(selections[i], true);
			}
		    }
		    this.setBranchId(branchId);	
		}
	    },
	    leafitemtap: function(scope, list, target, record){
		var selectedItems=this.getSelectedItems(),
		branchesWithSelections=this.getBranchesWithSelections(),
		branchId=this.getBranchId(),
		leaf=this.getActiveItem().getStore().getData().items[target],
		leafId=leaf.getId();
		
		if(selectedItems[leafId]){//deselecting
		    delete selectedItems[leafId];//remove record of selectedLeaf
		    var branchSelections=branchesWithSelections[branchId];
		    branchSelections.splice(branchSelections.indexOf(target), 1);
		    if(branchSelections.length==0){//remove record of branchWithSelection
			delete branchesWithSelections[branchId];
		    }
		}
		else{//selecting
		    selectedItems[leafId]=leaf;//add data for selectedLeaf

		    //add leaf index to branchWithSelection
		    if(branchesWithSelections[branchId]){//additional selection in branch
			branchesWithSelections[branchId].push(target);
		    }
		    else{//first selection in branch
			branchesWithSelections[branchId]=[target];
		    }
		}
		this.fireEvent('selectionchange', true);
	    }
	}
    },
    initialize: function(){
	this.callParent();

	this.setRoot();
	this.setSelectedItems({});
	this.setBranchesWithSelections({});
	this.setBranchId(null);
	this.setBranch(null);
	this.setTargetDepth(this.config.targetDepth || 2);//default to 'domain' for testing
    },
    limitDepth: function(){
	if(this.getActiveItem()){
	    var targetDepth=this.getTargetDepth();
	    if(targetDepth<4){
		var store=this.getActiveItem().getStore(),
		items=store.getData().items,
		numItems=items.length,
		i=0;
		for(;i<numItems;i++){
		    var data=items[i].getData();
		    if(data.depth==targetDepth){
			data.leaf=true;
			data.expandable=false;
		    }
		    else if(data.depth<targetDepth){
			data.leaf=false;
			data.expandable=true;
		    }
		    else{
			continue;
		    }
		    items[i].setData(data);
		}
	    }
	}
    },
    clearSelections: function(){
	this.goToNode(this.getStore().getRoot());
	this.setSelectedItems({});
	this.setBranchesWithSelections({});
	this.setBranchId(null);
	this.setBranch(null);
    }
});
