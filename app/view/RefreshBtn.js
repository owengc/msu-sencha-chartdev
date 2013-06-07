Ext.define('iPad2.view.RefreshBtn', {
    extend: 'Ext.Button',
    xtype: 'refreshbtn',

    config: {
        iconCls: 'refresh',
        iconMask: true,
        handler: function(button, event) {
            location.reload(true);
        }
    },



});
