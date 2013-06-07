Ext.define('iPad2.view.TopBar', {
    extend: 'Ext.Toolbar',
    alias: 'widget.topbar',

    requires: [
        'iPad2.view.LogoutBtn',
        'iPad2.view.RefreshBtn'
    ],

    config: {
        docked: 'top',
        items: [
            {
                xtype: 'spacer'
            },
            {
                xtype: 'logoutbtn'
            },
            {
                xtype: 'refreshbtn'
            }
        ]
    }

});
