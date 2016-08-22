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
            searchItems: [ 
            {
                xtype: 'textfield', 
                fieldLabel: '供应商名称', 
                name: 'supplierName'
            
            },{
                xtype: 'textfield', 
                fieldLabel: '联系人', 
                name: 'contactPerson'
            },{
                xtype: 'textfield', 
                fieldLabel: '产品类别', 
                name: 'productClass'
            }
            ],

            gridModel: 'Hc_Framework.model.HcSupplierManagementList',
            gridColumns: [
                          {
                          	header: '供应商编号', 
                          	dataIndex: 'companyNo', 
                          	editor: {
                          		allowBlank: false
                          	},
                          	width: '10%'
                          },
                          {
                          	header: '供应商名称', 
                          	dataIndex: 'companyName', 
                          	width: 250
                          },
                          {
                				dataIndex: 'companyTel',
                				header: '联系电话',
                				width: 150
                          },
                          {
                				dataIndex: 'supplierLevel',
                				header: '供应商级别',
                				width: 150
                          },
                          {
                				dataIndex: 'docPurchasing',
                				header: '跟单采购',
                				width: 150
                          },
                          {
                				dataIndex: 'accountPayable',
                				header: '应付款',
                				width: 150
                          },
                          {
                				dataIndex: 'overduePayment',
                				header: '逾期款',
                				width: '20%'
                          }
            ],
            allendflag:false,
            gridPrimaryKey: 'supplierNo',
            gridLoadUrl: Hc.basePath + 'hc_supplier_management_list/listAll.json',
            gridSaveUrl: Hc.basePath + 'hc_supplier_management_list/batchOperate.json',
            gridExportUrl: Hc.basePath + 'hc_supplier_management_list/do_export.json',
            gridImportUrl: Hc.basePath + ''
        });
        me.callParent();

    }
});