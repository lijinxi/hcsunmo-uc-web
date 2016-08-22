/**
 * Description: 供应商管理 view
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2016-2017
 * Company:     hcsunmo
 * author:      jinxi.li
 * Createdate:  2016年8月20日
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */

Ext.define('Hc_Framework.view.hc.HcSupplierManagementController', {
	extend : 'Hc_Common.view.BaseSimplePageController',

	alias : 'controller.hcsuppliermanagementcontroller',
	init: function () {
		var me = this;
		Ext.apply(me, {
			windowFlag:true
		})
		me.callParent();
	}
	
});