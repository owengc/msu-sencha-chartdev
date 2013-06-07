Ext.define('iPad2.view.LogoutBtn', {
    extend: 'Ext.Button',
    xtype: 'logoutbtn',

    config: {
        id: 'logoutBtn',
       // iconCls: 'action',                                                                                                                                                                             \
                                                                                                                                                                                                          
        iconMask: false,
        text: 'Logout',
        handler: function(button, event) {
           this.fireEvent('logoutCmd');
        }
    },



});
