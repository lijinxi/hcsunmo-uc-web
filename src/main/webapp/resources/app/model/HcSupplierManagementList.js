/**
 * Description: 供应商管理 view
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2016-2017
 * Company:     hcsunmo
 * author:      jinxi.li
 * Createdate:  2016年8月21日
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Framework.model.HcSupplierManagementList', {
    extend: Ext.data.Model,

    alias: 'model.hcsuppliermanagementlist',

    fields: [
        {name: 'companyNo', text: '供应商编码'},
        {name: 'companyName', text: '供应商名称'},
        {name: 'companyTel', text: '联系电话'},
        {name: 'supplierLevel', text: '供应商级别'},
        {name: ' docPurchasing', text: '跟单采购'},
        {name: 'accountPayable', text: '应付款', type: 'int'},
        {name: 'overduePayment', text: '逾期款', type: 'int'}
    ],

    idProperty: 'companyNo'
});