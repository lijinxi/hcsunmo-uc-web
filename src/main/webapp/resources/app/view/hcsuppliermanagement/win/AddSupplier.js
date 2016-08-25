/**
 * Description: 供应商管理 view
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     hc.
 * author:      jinxi.li
 * Createdate:  2016/01/26
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define("Hc_Framework.view.hc.HcSupplierManagement", {
    extend: "Hc_Common.view.BaseSimplePage",

    alias: 'widget.hcsuppliermanagement',

    requires: [
        'Hc_Framework.model.HcSupplierManagementList',
        'Hc_Framework.view.hc.HcSupplierManagementController',
        'Hc_Framework.view.hc.HcSupplierManagementModel'
    ],

    controller: "hcsuppliermanagementcontroller",

    viewModel: {
        type: "hcsuppliermanagementmodel"
    },

    initComponent: function () {
        var me = this;
        
       /// var projectStore = Ext.create('Hc_Framework.store.ItgProject');

        Ext.apply(me, {
            gridLoadUrl: Hc.basePath + 'hc_supplier_management_list/listAll.json',
            gridSaveUrl: Hc.basePath + 'hc_supplier_management_list/batchOperate.json',
            gridExportUrl: Hc.basePath + 'hc_supplier_management_list/do_export.json',
            gridImportUrl: Hc.basePath + ''
        });
        me.callParent();

    }
});