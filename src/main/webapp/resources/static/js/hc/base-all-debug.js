/**
 * Description:
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.model.Base',{
   extend:'Ext.data.Model'
});

/**
 * Description: 物料尺码Model基类
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/4/16 0016
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */

Ext.define('Hc_Common.model.MaterialSize', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'f1',   allowNull: true},
        {name: 'f2',   allowNull: true},
        {name: 'f3',   allowNull: true},
        {name: 'f4',   allowNull: true},
        {name: 'f5',   allowNull: true},
        {name: 'f6',   allowNull: true},
        {name: 'f7',   allowNull: true},
        {name: 'f8',   allowNull: true},
        {name: 'f9',   allowNull: true},
        {name: 'f10',  allowNull: true},
        {name: 'f11',  allowNull: true},
        {name: 'f12',  allowNull: true},
        {name: 'f13',  allowNull: true},
        {name: 'f14',  allowNull: true},
        {name: 'f15',  allowNull: true},
        {name: 'f16',  allowNull: true},
        {name: 'f17',  allowNull: true},
        {name: 'f18',  allowNull: true},
        {name: 'f19',  allowNull: true},
        {name: 'f20',  allowNull: true}
    ]
});
/**
 * Description:
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.store.Base', {
    extend: 'Ext.data.Store',
    alias: 'store.basestore',

    buffered: false,
    autoLoad: false,
    remoteSort: true,
    remoteFilter: true,

    proxy: {
        type: 'ajax',
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalCount'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            rootProperty: 'items'
        },
        actionMethods: {
            create: "POST",
            read: "POST",
            update: "POST",
            destroy: "POST"
        },
        pageParam: 'pageNum',
        limitParam: 'pageSize',
        startParam: ''
    },
    listeners: {
        beforeload: function (store) {
            var sort = store.getSorters();
            if (sort && sort.items.length > 0) {
                var sortParam = [];
                Ext.Array.each(sort.items, function (item) {
                    sortParam.push(item.getProperty() + ' ' + item.getDirection().toLowerCase());
                });
                store.proxy.extraParams.sort = sortParam.join(',');
            } else {
                delete store.proxy.extraParams.sort
            }
        },
        load: function (store, records, state, opts) {
            if (opts.success) {
                var resp = opts.getResponse();
                if (!resp) {
                    Hc.alert('访问服务器异常,请与系统管理员联系');
                    return;
                }
                var result = resp.responseText;
                try {
                    result = JSON.parse(result);
                    if (result.result) {
                        if (result.result.resultCode != 0) {
                            Hc.alert(result.result.msg, function () {
                                if (result.result.resultCode == 'timeout') {
                                    location.href = Hc.basePath + 'logout.json';
                                }
                            });
                        }
                    }
                } catch (e) {
                    Hc.alert('服务器返回不是有效的JSON数据');
                }
            }else {
                try {
                    var d = JSON.parse(opts.error.response.responseText);
                    Hc.alert(d.result.msg);
                }catch (e){
                    console.dir(e);
                }
            }
        }
    }
});

/**
 * Description:精简的store,去掉了分页排序等参数 
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月31日下午2:11:06
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月31日     	yu.jh
 */
Ext.define('Hc_Common.store.ComBase',{
    extend: 'Hc_Common.store.Base',
    alias: 'store.combasestore',
    autoLoad: true,
    remoteSort: false,
    remoteFilter: false,
    proxy: {
        type: 'ajax',
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalCount'
        }
    }
});
/**
 * Description:使用同步方式的store,数据未加载完一直等待 
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年4月6日上午8:46:39
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年4月6日     	yu.jh
 */
Ext.define('Hc_Common.store.NoajaxComBase',{
    extend: 'Ext.data.Store',
    alias: 'store.noajaxstore',
    autoLoad: true,
    proxy: {
        type: 'ajax',
    },
    msgTip:null,
    constructor: function () {
        var me = this,
            data;
        me.callParent(arguments);
        var poy=Ext.create("Hc_Common.store.Noajax");
        poy.setUrl(me.getProxy().getUrl());
        this.setProxy(poy);
        me.getData().addObserver(this);
        data = me.inlineData;
        if (data) {
            delete me.inlineData;
            me.loadInlineData(data);
        }
    }
});

Ext.define('Hc_Common.store.Noajax', {
    extend: 'Ext.data.proxy.Ajax',
    requires: ['Ext.Ajax'],
    alias: 'store.noajax',
    async:false,
    reader: {
      type: 'json',
      rootProperty: 'list',
      totalProperty: 'totalCount'
    },
	sendRequest: function(request) {
		var me=this;
		var cfg=request.getCurrentConfig();
		cfg.async=me.async;
        request.setRawRequest(Ext.Ajax.request(cfg));
        this.lastRequest = request;
        return request;
    }
});

/**
 * Description:
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/3/9 0009
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Framework.store.TreeBase', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.treebase',

    autoLoad: true,
    buffered: false,
    proxy: {
        type: 'ajax',
        reader: {
            type: 'json',
            rootProperty: 'list'
        },
        actionMethods: {
            create: "POST",
            read: "POST",
            update: "POST",
            destroy: "POST"
        }
    },
    nodeParam:'id',
    parentProperty:'parentId',
    pageParam: 'pageNum',
    limitParam: 'pageSize',
    listeners: {
        beforeload: function (store,opt) {
            var sort = store.getSorters();
            if (sort && sort.items.length > 0) {
                var sortParam = [];
                Ext.Array.each(sort.items, function (item) {
                    sortParam.push(item.getProperty() + ' ' + item.getDirection().toLowerCase());
                });
                store.proxy.extraParams.sort = sortParam.join(',');
            } else {
                delete store.proxy.extraParams.sort
            }
            store.pageSize = 5000;
        }
    }
});
/**
 * Description: 品牌事业部下拉框-公用store All rights Reserved, Designed By Hc
 * Copyright: Copyright(C) 2014-2015 Company: Wonhigh. author: liutao
 * Createdate: 2015/4/29
 * 
 * Modification History: Date Author What
 * ------------------------------------------
 * 
 */
Ext.define('Hc_Common.store.CmnBrandRelation', {
	extend : 'Hc_Common.store.ComBase',
	alias : 'store.cmnbrandrelation',
	fields : [{
				name : 'brandNo',
				text : '品牌编号',
				type : 'string'
			}, {
				name : 'brandCode',
				text : '品牌编码',
				type : 'string'
			}, {
				name : 'brandEname',
				text : '品牌英文名',
				type : 'string'
			}, {
				name : 'brandCname',
				text : '品牌中文名',
				type : 'string'
			}, {
				name : 'divisionNo',
				text : '事业部编号',
				type : 'string'
			}, {
				name : 'divisionName',
				text : '事业部名称',
				type : 'string'
			}],
	autoLoad : true,
	proxy : {
		url : Hc.mdmPath
				+ 'bas_brand_relation/listvoAll.json?selectVoName=brdRltnSelectListByVoAll'
	}
});
/**
 * Description: 品牌下拉框-公用store
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      liutao
 * Createdate:  2015/4/29
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.store.CmnDict',{
    extend:'Hc_Common.store.ComBase',
    alias:'store.cmndict',
    fields: [
			{name: 'itemCode', text: '明细编码', type: 'string'},
			{name: 'itemName', text: '明细名称', type: 'string'},
			{name: 'displayName', text: '显示名称', type: 'string'}
         ], 
    proxy: {
        url: Hc.mdmPath+'bas_dict/listAll.json'
    }
});
/**
 * Description: 事业部下拉框-公用store
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      liutao
 * Createdate:  2015/4/29
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.store.CmnDivision',{
    extend:'Hc_Common.store.ComBase',
    alias:'store.cmndivision',
    fields: [
             {name: 'divisionNo', text: '事业部编号', type: 'string'},
             {name: 'divisionName', text: '事业部名称', type: 'string'}
         ],
    proxy: {
        url: Hc.mdmPath + 'bas_division/listAll.json'
    }
});



/**
 * Description: 事业部下拉框-公用store
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      liutao
 * Createdate:  2015/4/29
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.store.CmnFactory',{
    extend:'Hc_Common.store.ComBase',
    alias:'store.cmnfactory',
    fields: [
             {name: 'factoryNo', text: '厂区编号', type: 'string'},
             {name: 'factoryName', text: '厂区名称', type: 'string'}
         ],
    proxy: {
        url: Hc.mdmPath + 'bas_factory/listAll.json?enableFlag=1'
    }
});



/**
 * Description: 事业部下拉框-公用store
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      liutao
 * Createdate:  2015/4/29
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.store.CmnWarehouse',{
    extend:'Hc_Common.store.ComBase',
    alias:'store.cmnwarehouse',
    fields: [
             {name: 'storeNo', text: '仓库编号', type: 'string'},
             {name: 'storeName', text: '仓库名称', type: 'string'}
         ],
    proxy: {
        url: Hc.mdmPath + 'bas_store/listAll.json?enableFlag=1'
    }
});



/**
 * Description: 通用页面基类，所有模块最顶层基类
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BasePage', {
    extend: 'Ext.container.Container',

    controller: 'basepage',
    viewModel: {
        type: 'basepage'
    },
    referenceHolder: true,

    moduleId: '',
    moduleName: '',
    isReadOnly: false,
    pageSize: 25,
    isAutoLoad: false,

    editStatus: 0,
    auditStatus: 20,

    userCode: '',
    userName: '',
    pageType:'',

    moduleRight: 511,
    userRight: 511,

    initComponent: function () {
        this.callParent();
    }
});

/**
 * Description: 通用页面基类控制器，主要实现权限的解析及通用方法。
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BasePageController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.basepage',

    //权限值
    viewRight: 1,
    editRight: 2,
    addRight: 4,
    deleteRight: 8,
    RFRight: 16,
    printRight: 32,
    exportRight: 64,
    printSetupRight: 128,
    auditRight: 256,
    giveRight: 512,

    otherRight1: 1024,
    otherRight2: 2048,
    otherRight3: 4096,
    otherRight4: 8192,
    otherRight5: 16384,

    //当前正在编辑的控件
    editingList: null,

    //当前的活动控件
    workObject: null,

    //是否保存成功之后， 用于重新绑定数据
    _isAfterSave: false,

    //保存之后，回写ID,用于grid定位到编辑的行
    _idValue: '',

    init: function () {
        var me = this;
        console.info("Hc_Common.view.BasePageController---start");
        console.info(this);
        me.editingList = [];
        me._isAfterSave = false;
        me._idValue = '';
        console.info("Hc_Common.view.BasePageController---end");
        me.getRightKey();

        me.callParent();
        // me.view.on('beforedestroy','onBeforeDestroy',me);
    },

    //region  权限处理开始

    /**获取权限值*/
    getRightKey: function () {

    },

    /**检查权限*/
    hasRight: function (rightCode) {
        return (this.view.userRight & rightCode) == rightCode;
    },

    /**查看权限*/
    canView: function () {
        return this.hasRight(this.viewRight);
    },

    /**新增权限*/
    canAdd: function () {
        return this.hasRight(this.addRight);
    },

    /**编辑权限*/
    canEdit: function () {
        return this.hasRight(this.editRight);
    },

    /**删除权限*/
    canDelete: function () {
        return this.hasRight(this.deleteRight);
    },

    /**打印权限*/
    canPrint: function () {
        return this.hasRight(this.printRight);
    },

    /**导出权限*/
    canExport: function () {
        return this.hasRight(this.exportRight);
    },

    /**审批权限*/
    canAudit: function () {
        return this.hasRight(this.auditRight);
    },

    /**赋权权限*/
    canGiveRight: function () {
        return this.hasRight(this.giveRight);
    },


    getUserCode: function () {
        return this.view.userCode;
    },

    getUserName: function () {
        return this.view.userName;
    },


    //endregion 权限处理结束


    //region 统一与后端交互入口开始

    /* 实现 Ext.Ajax.request 方法 */
    callServer: function (options) {
        Ext.Ajax.request(options);
    },

    /*通用保存数据
     * options 属性说明
     * srcObj 源对象，必须指定, 如 tree, grid
     * data 数据对象, 必须指定
     * url 或 srcObj.batchUrl 必须指定,后端的服务地址
     * btn 触发保存事件的按钮,可选对象
     * isJson  当等于 false 时，用param 方式传递，否则用 jsonData方式传递
     * */
    saveData: function (options) {
        var me = this;

        if (!options.srcObj) {
            Hc.alert('没有指定源对象');
            return;
        }
        var url = options.url || options.srcObj.batchUrl;
        console.info(url);
        if (!url) {
            Hc.alert('没的指定后端服务URL');
            return;
        }
        if (!options.data) {
            Hc.alert('无数据需保存');
            return;
        }
        if (options.btn) {
            options.btn.setDisabled(true);
        }

        var param = {
            url: url,
            method: 'POST',
            success: function (response) {
                try {
                    var result = JSON.parse(response.responseText);
                    if (result.result.resultCode == '0') {
                        me.editingList = [];
                        me._isAfterSave = true;
                        if (result.masterId) {
                            me._idValue = result.masterId;
                        }
                    }
                    me.afterSave(result, options);
                } catch (e) {
                    Hc.show({
                        title: '错误提示',
                        msg: e,
                        height: 300,
                        width: 500
                    });
                }
            },
            failure: function (response) {
                Hc.show({
                    title: '错误提示',
                    msg: response.responseText,
                    height: 300,
                    width: 500
                });
                if (options.btn) {
                    options.btn.setDisabled(false);
                }
            }
        };

        if (options.isJson === false) {
            param.params = JSON.stringify(options.data);
        } else {
            param.jsonData = JSON.stringify(options.data);
        }
        me.callServer(param);
    },

    /*保存后处理方法*/
    afterSave: function (result, options) {
        if (options.btn) {
            options.btn.setDisabled(false);
        }
    },

    //endregion  统一与后端交互入口结束


    //region 获取需要保存的更改数据及数据验证开始

    /**获取网格中被更改的记录数据*/
    getGridDirtyData: function (obj) {
        var param = {}, store = obj.store,
            items = store.getModifiedRecords(),
            tabName = obj.modelName.substr(obj.modelName.lastIndexOf('.') + 1),
            
            flag = '', addItem = [], updateItem = [], delItem = [];
        console.info("tabName="+tabName);
        Ext.Array.each(items, function (item) {
            flag = item.get('_flag');
            if (flag == 'A') {
                addItem.push(item.data);
            } else if (flag == 'D') {
                delItem.push(item.data);
            } else {
                updateItem.push(item.data);
            }
        });
        param.customerName = tabName;
        if(obj.mSizeIdx>-1) {
            param.isSizeHorizontal = 1;
            param.qtyProperty = obj.mSizeQtyField
        }

        if(obj.convertToSize==1){
            param.type=1;
        }
        if (addItem.length > 0) param.insertList = addItem;
        if (delItem.length > 0) param.deleteList = delItem;
        if (updateItem.length > 0)param.updateList = updateItem;
        return param;
    },

    /**获取需要保存的数据*/
    getDataToSave: function (obj, isFormDel) {
        var me = this, param = {},
            subGrid = obj.subGrid || [];
         console.info("subGrid.length"+subGrid.length);
        if (!me.validData(obj)) return false;

        //单表模式获取数据
        if (subGrid.length == 0) {
            if (obj.is('form')) {
                var record = obj.getRecord();
                param.customerName = obj.modelName.substr(obj.modelName.lastIndexOf('.') + 1);
                console.info(isFormDel);
                if (isFormDel) {
                    param.deleteList = [record.data];
                } else {
                    if (record.phantom) {
                        param.insertList = [record.data];
                    } else {
                        param.updateList = [record.data];
                    }
                }
            } else {
                param = me.getGridDirtyData(obj);
            }
            return param;
        }

        //多表模式获取数据
        var idField = obj.primaryKey,
            customerListData = [],
            objlist = me.getObjList();

        //处理主表
        param.idFieldName = idField;
        if (obj.is('form')) {
            var record = obj.getRecord();
            if (isFormDel) {
                param.operateType = "deleted";
            } else {
                if (!obj.isDirty()) {
                    param.operateType = 'nochanged';
                } else {
                    if (record.phantom) {
                        param.operateType = 'inserted';
                    } else {
                        param.operateType = 'updated';
                    }
                }
            }
            param.masterJson = record.data;
        } else {
            var store = obj.store,
                items = store.getModifiedRecords();
            if (items.length < 1) {
                param.operateType = 'nochanged';
                items = obj.getSelection();
                if (items.length < 1) {
                    Hc.alert('操作异常!');
                    return false;
                }
                param.masterJson = items[0].data;
            } else {
                var item = items[0];
                var flag = item.get('_flag');
                if (flag == 'A') {
                    param.operateType = 'inserted';
                } else if (flag == 'D') {
                    param.operateType = 'deleted';
                } else {
                    param.operateType = 'updated';
                }
                param.masterJson = item.data;
            }

        }

        //处理从表
        for (var i = 0; i < subGrid.length; i++) {

            var gridobj = objlist[subGrid[i]];
            if (!gridobj) continue;

            if (param.operateType == 'deleted') {
                var delobj = {};
                delobj[idField] = param.masterJson[idField];
                customerListData.push({
                    customerName: gridobj.modelName.substr(gridobj.modelName.lastIndexOf('.') + 1),
                    deleteList: [delobj]
                });
            } else {
                if (gridobj.isUpdating) {
                    customerListData.push(me.getGridDirtyData(gridobj));
                }
            }
        }
        if (customerListData.length > 0) {
            param.customerListData = customerListData;
        }

        if (param.operateType == "updated" || param.operateType == 'nochanged') {
            me._idValue = param.masterJson[idField];
        }

        return param;
    },

    /**主键录入重复时处理*/
    keyValueError: function (e) {
        var error = function () {
            e.record.set(e.field, e.originalValue);
            if (e.grid.editModel == 'cell') {
                e.grid.editingPlugin.startEditByPosition({row: e.rowIdx, column: e.colIdx});
            } else {
                e.grid.editingPlugin.startEdit(e.rowIdx, e.colIdx);
            }
        };
        if (e.field == e.grid.primaryKey) {
            Hc.alert('新输入的主键【' + e.value + '】已存在', function () {
                error();
            });
        } else {
            var val = '', ukey = e.grid.unionKey.split(',');
            Ext.each(ukey, function (k) {
                val += ' 【' + (e.record.get(k) || '') + '】 ';
            });

            Hc.alert('唯一索引值' + val + '已存在', function () {
                error();
            });
        }
    },

    /**检查主键是否重复,优先检查本地录入，再检查服务器*/
    checkKeyValue: function (e) {

        var me = this, ukey = (e.grid.unionKey || '').split(',');

        if ((e.field == e.grid.primaryKey || ukey.indexOf(e.field) >= 0) && e.value != e.originalValue) {

            var idx = 0, param, store = e.grid.store;

            var checkdata = function (p) {
                me.callServer({
                    url: store.proxy.url,
                    method: 'POST',
                    params: {
                        queryCondition: JSON.stringify(p)
                    },
                    success: function (response) {
                        var result = JSON.parse(response.responseText);
                        if (result.list && result.list.length > 0) {
                            me.keyValueError(e);
                        }
                    }
                });
            };

            if (e.field == e.grid.primaryKey) {
                idx = store.findBy(function (item) {
                    return item.get(e.field) == e.value && item != e.record;
                });
                if (idx > -1) {
                    me.keyValueError(e);
                } else {
                    param = [{
                        property: e.field,
                        value: e.value,
                        operator: 10
                    }];
                    checkdata(param)
                }
            } else {

                var itemval, recordval;
                idx = store.findBy(function (item) {
                    itemval = [];
                    recordval = [];
                    Ext.each(ukey, function (k) {
                        itemval.push(item.get(k));
                        recordval.push(e.record.get(k));
                    });
                    return Ext.Array.equals(itemval, recordval) && item != e.record;
                });

                if (idx > -1) {
                    me.keyValueError(e);
                } else {
                    param = [];
                    Ext.each(ukey, function (k) {
                        param.push({
                            property: k,
                            value: e.record.get(k),
                            operator: 10
                        });
                    });
                    param.push({
                        property: e.grid.primaryKey,
                        value: e.record.get(e.grid.primaryKey),
                        operator: 16
                    });
                    checkdata(param)
                }
            }
        }
    },

    /**grid网格数据*/
    gridValidData: function (grid) {
        var columns = grid.columns, editor, i, isPass = true,
            list = grid.store.getModifiedRecords();

        if (Ext.isEmpty(list)) return true;
        for (i = 0; i < columns.length; i++) {
            editor = columns[i].getEditor && columns[i].getEditor();
            if (!editor) continue;
            if (editor.allowBlank === false) {
                if (Ext.Array.some(list, function (item) {
                        return Ext.isEmpty(item.get(columns[i].dataIndex)) && item.get('_flag') != 'D';
                    })) {
                    isPass = false;
                    Hc.alert('【' + columns[i].text + '】列数据不能为空');
                    break;
                }
            }
        }
        return isPass;
    },

    /**验证数据是否通过*/
    validData: function (obj) {
        var me = this, i, isPass = true, subobj,
            subGrid = obj.subGrid || [];

        if (Ext.isString(obj)) {
            obj = me.getObj(obj);
        }
        if (obj.is('form')) {
            isPass = obj.isValid();
        } else if (obj.is('grid')) {
            isPass = me.gridValidData(obj);
        }
        if (isPass && subGrid.length > 0) {
            for (i = 0; i < subGrid.length; i++) {
                subobj = me.getObj(subGrid[i]);
                if (!subobj || !subobj.is('grid')) continue;
                isPass = me.gridValidData(subobj);
                if (!isPass) break;
            }
        }
        return isPass;
    },

    //endregion 获取需要保存的更改数据及数据验证结束


    //region 网格辅助控制开始

    /**网格选择中时，控制按钮可用状态、控制从表加载、给viewModel绑定数据*/
    gridSelectionChange: function (sender, e) {
        var me = this, item = e[0],
            objList = me.getObjList(),
            grid = sender.view.grid,
            gridname = grid.reference;

        if (me.canDelete() && objList.btnDelete
            && grid.isCanDelete && !grid.isReadOnly) {
            objList.btnDelete.setDisabled(e.length === 0);
        }
        if (me.canPrint() && objList.btnPrint) {
            objList.btnPrint.setDisabled(e.length === 0)
        }

        if(me.canAudit() && objList.btnAudit){
            objList.btnAudit.setDisabled(e.length===0 && grid.isUpdating)
        }

        me.bindSubGrid(sender.view.grid);
        if (gridname == "mastergrid") {
            gridname = 'grid';
        }


        if (!item) {
            item = Ext.create(sender.view.grid.modelName);
        }
        me.getViewModel().set(gridname + 'Row', item);
    },

    /**网格数据更新事件，控制按钮可用状态、更新网络编辑状态、更新页面编辑对象列表*/
    gridDataChanged: function (store, grid) {

        var me = this, objList = me.getObjList();
        if (typeof grid == 'string') {
            grid = objList[grid];
        }

        if (grid.isReadOnly) return;

        var isDirty = me.getDirtyIndex(store) > -1;

        grid.isUpdating = isDirty;
        if (isDirty) {
            me._isAfterSave = false;
        }

        if (isDirty) {
            Ext.Array.include(me.editingList, grid.reference);
        } else {
            Ext.Array.remove(me.editingList, grid.reference);
        }

        if (objList.btnSave) {
            objList.btnSave.setDisabled(me.editingList.length == 0);
        }
        if (objList.btnCancel) {
            objList.btnCancel.setDisabled(me.editingList.length == 0);
        }
        if (objList.btnUndo) {
            objList.btnUndo.setDisabled(me.editingList.length == 0);
        }

        if(objList.btnAudit && isDirty){
            objList.btnAudit.setDisabled(true)
        }
        console.info("grid.view.refresh--之前");
        grid.view.refresh();
        console.info("grid.view.refresh--之后");
    },

    /**网格中控制不能更改主键*/
    gridCannotEditKeyField: function (e) {
        if(!this.canAdd() && !this.canEdit()) return false;
        if (e.grid.isReadOnly == true) return false;
        if (e.field == e.grid.primaryKey && !e.record.phantom) {
            return false;
        }
        if (!e.grid.isCanEdit && !e.record.phantom) return false;
    },

    /**绑定从表*/
    bindSubGrid: function (obj) {
        if (typeof obj == 'string') {
            obj = this.getObj(obj);
        }
        var subGrid = obj.subGrid || [];
        if (subGrid.length == 0) return

        var item, idValue = '',
            objs = this.getObjList(),
            idField = obj.primaryKey;
        if (obj.is('form')) {
            item = obj.getRecord();
        } else {
            item = obj.getSelection()[0];
        }
        if (item && !item.phantom) {
            idValue = item.get(idField);
        }
        for (var i = 0; i < subGrid.length; i++) {
            var store = objs[subGrid[i]].store;
            if (idValue) {
                store.proxy.extraParams[idField] = idValue;
                store.reload();
            } else {
                store.removeAll();
                store.commitChanges();
            }
        }
    },

    /**检查是否可以加载数据*/
    gridIsCanLoad: function (store, obj) {

        if (this._isAfterSave) {
            return true;
        }

        if (typeof obj == 'string') {
            obj = this.getObj(obj);
        }
        if (this.getDirtyIndex(store) > -1 || (obj.isMaster && this.editingList.length > 0)) {
            Hc.alert('您正在编辑数据,请先保存或取消后再进行此操作');
            return false;
        }
        var supGrid = obj.supGrid;
        if (supGrid) {
            var supObj = this.getObj(supGrid),
                idField = supObj.primaryKey,
                item = supObj.getSelection()[0];
            if (!item || item.phantom)return false;
            store.proxy.extraParams[idField] = item.get(idField);
        }
    },

    /**
     * 设置网格的表头样式
     * */
    gridHeadCls: function (grid) {
        var columns = grid.vcolumn,
            headers = grid.headerCt,
            c, editor, headitem, field;
           console.info("//////////////////////////");
           console.info(headers);
           console.info(grid.headerCt);
           console.info("//////////////////////////");
        for (c = 0; c < columns.length; c++) {
            editor = columns[c].editor;
            field = columns[c].dataIndex;
            if (!editor || !field) continue;
            headitem = Ext.Array.findBy(headers.items.items, function (item) {
                return item.dataIndex == field
            });
            console.info("//////////////////////////");
            console.info(field);
            console.info(headitem);
            console.info("//////////////////////////");
            if (!headitem) continue;
            if (editor.allowBlank === false) {
                headitem.addCls('notnull-field');
            } else {
                headitem.addCls('cannull-field');
            }

        }
    },

    //endregion 网格辅助控制结束


    //region 处理尺码横排，所有 grid 统一调用 开始

    /**在绑定数据时处理尺码横排*/
    setSizeColsOnLoad: function (grid, store, options) {
        var me = this;
        if (grid.mSizeIdx == -1) return;
        try {
            var result = JSON.parse(options.getResponse().responseText),
                _head = result['headlist'] || [],
                _use = result['usedlist'] || [];
            me.setGridHeadList(grid, _head, _use);
            me.setGridSizeCols(grid, store);
        } catch (e) {
            console.info("Error:", e);
        }
    },

    /**在录入物料编码时处理尺码横排*/
    setSizeColsOnEdit: function (grid, e) {

        if (e.field !== 'materialNo' || grid.mSizeIdx == -1) return;
        if (e.value == e.originalValue) return;

        if(grid.store.findBy(function(item){
               return item.get('materialNo') == e.value && item != e.record
            })>-1){
            Hc.alert('物料号【'+ e.value+'】已存在',function(){
                e.record.set('materialNo','');
            });
            return;
        }

        var me = this;
        if(me.setSizeFillFields(grid, e)){
            me.setGridSizeCols(grid, grid.store);
            return;
        }

        me.callServer({
            url: grid.mSizeUrl,
            params: {
                'materialNo': e.value
            },
            method: 'POST',
            success: function (d) {
                try {
                    var result = JSON.parse(d.responseText),
                        _head = result.headlist || [],
                        _use = result.usedlist || [];

                    if (Ext.isEmpty(_head)) {
                        Hc.alert('无法获取物料【' + e.value + '】的尺码信息', function () {
                            e.record.set('materialNo', '');
                        });
                        return;
                    }
                    me.setGridHeadList(grid,_head,_use);
                    me.setSizeFillFields(grid, e);
                    me.setGridSizeCols(grid, grid.store);
                } catch (err) {
                    console.info('通过物料读取尺码信息时出错:',err);
                    Hc.alert('获取物料【' + e.value + '】的尺码信息出错', function () {
                        e.record.set('materialNo', '');
                    });
                }

            },
            failure: function (d) {
                console.info('通过物料读取尺码信息访问后端出错:', d.responseText);
                Hc.alert('读取物料尺码出错! 错误信息:' + d.responseText, function () {
                    e.record.set('materialNo', '');
                });
            }
        });
    },

    /**尺码横排处理grid表头*/
    setGridSizeCols: function (grid, store) {

        var sIdx = grid.mSizeIdx;
        if (sIdx == -1) return;

        var me = this,
            head = Hc.clone(grid._headlist),
            gc = Hc.clone(grid.vcolumn),
            i, j, tmpHead, field;

        if(!head) return;

        for (i = 1; i < 21; i++) {
            field = 'f' + i;
            if (!Ext.Array.findBy(head, function (item) {
                    return item[field] != '0'
                })) {
                for (j = 0; j < head.length; j++) {
                    tmpHead = head[j];
                    delete tmpHead[field];
                }
            }
        }
        if (head.length == 0) {
            grid.reconfigure(store, gc);
            me.gridHeadCls(grid);
            return;
        }

        try {
            var sizeCols = [],
                mSizeCol = gc[sIdx],
                uselist = grid._uselist || [],
                sizeInpuTtype='numberfield';
            if(grid.sizeInputType!='number'){
                sizeInpuTtype = 'textfield';
            }

            var  getcol = function (_field, _text, _column) {
                    _text = _text == '0' ? '&nbsp;' : (_text || '&nbsp;');
                    if (_column) {
                        return {
                            text: _text,
                            columns: [_column]
                        }
                    }
                    return {
                        dataIndex: _field,
                        text: _text,
                        width: 50,
                        align:'center',
                        editor: {
                            xtype: sizeInpuTtype
                        },
                        renderer: function (val, obj, record) {
                            if (Ext.Array.findBy(uselist, function (item) {
                                    return item.materialNo == record.get('materialNo') && (item[_field] != '0')
                                })) {
                                obj.tdCls = 'x-grid-input-cell';
                            }
                            return val == 0 ? '' : val;
                        }
                    }
                };

            if (head.length == 1) {
                tmpHead = head[0];
                sizeCols.push({
                    text:tmpHead['sizeTypeNo'],
                    dataIndex:'sizetTypeNo',
                    align:'center',
                    width:'50'
                });
                for (i = 1; i < 21; i++) {
                    field = 'f' + i;
                    if (!tmpHead[field]) continue;
                    sizeCols.push(getcol(field, tmpHead[field]));
                }
            } else {
                var tmp,tmpType = {};
                for (i = 1; i < 21; i++) {
                    tmp = {};
                    field = 'f' + i;
                    for (j = 0; j < head.length; j++) {
                        tmpHead = head[j];
                        if(i==1){
                            if(j==0){
                                tmpType = {
                                    text:tmpHead['sizeTypeNo'],
                                    dataIndex:'sizeTypeNo',
                                    align:'center',
                                    width:'50'
                                }
                            }else{
                                tmpType = {
                                    text:tmpHead['sizeTypeNo'],
                                    columns:[tmpType]
                                }
                            }
                        }

                        if (!tmpHead[field]) continue;
                        if (j == 0) {
                            tmp = getcol(field, tmpHead[field]);
                        } else {
                            tmp = getcol(field, tmpHead[field], tmp);
                        }
                    }
                    if(i==1) sizeCols.push(tmpType);
                    if (Ext.Object.isEmpty(tmp)) continue;
                    sizeCols.push(tmp);
                }
            }
            Ext.Array.insert(gc, sIdx, sizeCols);
            Ext.Array.remove(gc, mSizeCol);
            grid.reconfigure(store, gc);
            me.gridHeadCls(grid);
        } catch (e) {
            console.info('创建物料的尺码表头时出错:',e);
            Hc.alert('创建物料的尺码表头时出错');
        }
    },

    /**设置物料只能编辑可用的尺码*/
    sizeFieldBeforeEdit: function (grid, e) {

        var uselist = grid._uselist;

        if (grid.mSizeIdx == -1)return;
        var fields = [];
        for (var i = 1; i < 21; i++) {
            fields.push('f' + i);
        }
        if (fields.indexOf(e.field) == -1)return;

        if(Ext.isEmpty(uselist)) return false;

        var materialNo = e.record.get('materialNo');
        if (Ext.isEmpty(materialNo)) return false;

        var usesize = Ext.Array.findBy(uselist, function (item) {
            return item.materialNo == materialNo;
        });
        if (!usesize || !usesize[e.field] || usesize[e.field] == "0") return false;
    },

    /**把取到的尺码信息存在grid属性中*/
    setGridHeadList:function(grid,newHeadList,newUseList) {
        var i = 0, tmp,
            headlist = Hc.clone(grid._headlist || []),
            usedlist = Hc.clone(grid._uselist || []);
        if (!Ext.isEmpty(newHeadList)) {
            for (i = 0; i < newHeadList.length; i++) {
                tmp = newHeadList[i];
                if (!tmp || !tmp['sizeTypeNo']) continue;
                if (Ext.Array.findBy(headlist, function (item) {
                        return item['sizeTypeNo'] == tmp['sizeTypeNo'];
                    })) continue;
                headlist.push(tmp);
            }
            grid._headlist = headlist;
        }

        if (!Ext.isEmpty(newUseList)) {
            for (i = 0; i < newUseList.length; i++) {
                tmp = newUseList[i];
                if (!tmp || !tmp['materialNo']) continue;
                if (Ext.Array.findBy(usedlist, function (item) {
                        return item['materialNo'] == tmp['materialNo'];
                    })) continue;
                usedlist.push(tmp);
            }
            grid._uselist = usedlist;
        }
    },

    /**输入物料时，带出尺码信息顺便填充其它列值*/
    setSizeFillFields:function(grid,e) {
        var headlist = grid._headlist || [],
            usedlist = grid._uselist || [],
            fields = grid.mSizeFillFields.split(','),
            useInfo = Ext.Array.findBy(usedlist, function (item) {
                return item.materialNo == e.value
            });

        if (useInfo && Ext.Array.findBy(headlist, function (item) {
                return item['sizeTypeNo'] == useInfo['sizeTypeNo']
            })) {
            var i = 0, fvalue = '';
            for (; i < fields.length; i++) {
                fvalue = useInfo[fields[i]];
                if (fvalue == null) fvalue = '';
                e.record.set(fields[i], fvalue)
            }
            return true;
        }
        return false;
    },

    //endregion 处理尺码横排，所有 grid 统一调用 结束


    //region其它辅助方法开始

    /**返回页面所有定义Reference属性的对象*/
    getObjList: function () {
        return this.getReferences();
    },

    /**
     * 通过reference返回对象*/
    getObj: function (RefKey) {
        return this.lookupReference(RefKey);
    },

    /**返回当前模块的高度百分比*/
    getBodyHeight:function(per) {
        var bodyh = window.innerHeight,
            appmain = this.view.up('app-main');
        if (appmain) {
            var toph = appmain.down('maintop').getHeight();
            bodyh = bodyh - toph - 25;
        }
        per = per || 1;
        return bodyh * per;
    },

    /**初始化网格行类样式*/
    initRowClass: function (record, index, rowParams, store) {
    	console.info("shenmeshihou++++++++++");
        var flag = record.get('_flag');
        if (flag == 'A') return 'x-grid-height-add';
        if (flag == 'D') return 'x-grid-height-delete';
        if (record.dirty && !flag) return 'x-grid-height-edit';
        return ''
    },

    /**自动获取面板的子对象*/
    getFormItems: function (columns, rowname) {
        var formItems = [], item, obj, i;
        if (columns.length == 0) return formItems;
        for (i = 0; i < columns.length; i++) {
            obj = columns[i];
            item = {
                name: obj.dataIndex,
                fieldLabel: obj.text || obj.header,
                xtype: 'textfield',
                bind: {value: '{' + rowname + "." + obj.dataIndex + "}"}
            };
            if (Ext.isObject(obj.editor)) {
                Ext.apply(item, columns[i].editor);
            }
            if (!obj.editor) {
                item.disabled = true;
            }
            formItems.push(item);
        }
        return formItems;
    },


    /**返回第一条被更改记录的index*/
    getDirtyIndex: function (store) {
        return store.findBy(function (a) {
            return a.dirty || a.phantom
        });
    },

    /**在主页面的tabpanel中打开模块
     *object中参数如下：
     * xtype 模块别名
     * title tab中显示的文本
     * moduleRight 模块权限
     * userRight 用户权限
     * */
    showInTab: function (object, isRefresh) {

        if (!Ext.isObject(object)) {
            Hc.alert('请正确传入参数,只接收对象参数!');
            return;
        }
        var widgetName = object.xtype,
            tabPanel = Ext.getCmp('maintabpanel');
        if (!Ext.ClassManager.getNameByAlias('widget.' + widgetName)) {
            Hc.alert('模块名【' + widgetName + '】不存在!');
            return;
        }

        if (!tabPanel) {
            var title = object.title;
            delete object.title;
            Ext.apply(object, {
                height: Ext.getBody().getHeight() * 0.8,
                width: Ext.getBody().getWidth() * 0.8
            })
            this.showInWin(object, {
                title: title,
                winName: object.itemId,
                showBbar: false
            });
            return;
        }

        var tabitem = tabPanel.getComponent(object.itemId);
        if (!tabitem) {
            var tab = {
                closable: true,
                reorderable: true,
                loadMask: '加载中...'
            };
            Ext.apply(tab, object)
            tabitem = tabPanel.add(tab);
        } else {
            Ext.apply(tabitem, object);
            if (isRefresh && tabitem.controller) {
                tabitem.controller.init();
            }
        }
        tabPanel.setActiveTab(tabitem);
    },

    /**在弹出框中显示
     * object 对象
     * options window参数
     * */
    showInWin: function (object, options) {
        if (!Ext.isObject(object)) {
            Hc.alert('请正确传入参数,第一个参数只接收对象!');
            return;
        }
        var widgetName = object.xtype,
            me = this;
        if (!Ext.ClassManager.getNameByAlias('widget.' + widgetName)) {
            Hc.alert('类名【' + widgetName + '】不存在!');
            return;
        }

        var winoptions = {
            closeAction: 'destroy',
            modal: true,
            constrain:true,
            items: [object],
            autoShow: true,
            bbar: ['->',
                {
                    xtype: 'button',
                    text: options.confirmText || '确认',
                    handler: me.onWinConfirmClick,
                    scope: me,
                    glyph: Hc.Icon.btnSave
                }, {
                    xtype: 'button',
                    text: options.cancelText || '取消',
                    handler: me.onWinClose,
                    scope: me,
                    glyph: Hc.Icon.btnCancel
                }]
        };
        Ext.apply(winoptions, options);
        if (options.showBbar === false) {
            delete winoptions.bbar;
        }
        var win = Ext.widget('window', winoptions);
        return win;
    },

    /**弹出框中的确认按钮事件*/
    onWinConfirmClick: function (btn) {
        btn.up('window').close();
    },

    /**弹出框中取消按钮事件*/
    onWinClose: function (btn) {
        btn.up('window').close();
    },


    //是否字段
    renderYesNo: function (val, metaData, model, row, col, store, gridview) {
        return val ? "是" : "否";
    },
    // 启用状态
    renderUseFlag: function (val, metaData, model, row, col, store, gridview) {
        return val ? "启用" : "禁用";
    },

    //endregion其它辅助方法结束

    onBeforeDestroy: function () {
        if (this.editingList.length > 0) {
            if (!confirm('正在编辑数据,是否退出？')) {
                return false;
            }
        }
    }

});
/**
 * Description: 通用页面基类viewModel
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BasePageModel',{
    extend:'Ext.app.ViewModel',
    alias:'viewmodel.basepage'
});
/**
 * Description: 单表模块基类，继承于 basepage
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BaseSimplePage', {
    extend: 'Hc_Common.view.BasePage',

    controller: 'basesimplepage',

    viewModel: {
        type: 'basesimplepage'
    },

    layout: 'border',

    //自定义布局   默认为系统自动布局
    customLayout: false,

    //其它对象清单，用于扩充
    otherItems: null,

    //form 中默认的列宽
    fieldWidth: '100%',
    labelWidth: 80,
    labelAlign: 'right',

    //region定义工具条开始
    toolbarRegion: 'north',
    toolbar: {
        xtype: 'toolbar',
        reference: 'commontoolbar',
        region: '',
        items: [{
            text: '查询',
            itemId: 'btnSearch',
            reference: 'btnSearch',
            handler: 'onBtnSearchClick',
            glyph: Hc.Icon.btnSearch

        }, {
            text: '重置',
            itemId: 'btnReset',
            reference: 'btnReset',
            handler: 'onBtnResetClick',
            glyph: Hc.Icon.btnReset

        },  {
            text: '过滤',
            icon: './resources/static/js/extjs/packages/ext-theme-classic/images/grid/filters/find.png',
            itemId: 'btnFilter',
            reference: 'btnFilter',
            xtype: 'splitbutton',
            menu: [{
                text: '本页',
                itemId: 'btnFilterLocal',
                reference: 'btnFilterLocal',
                handler: 'onSetFilterLocal'
            }, {
                text: '所有',
                itemId: 'btnServer',
                reference: 'btnFilterServer',
                handler: 'onSetFilterServer'
            },{
            	text: '关闭',
                itemId: 'btnFilterClose',
                reference: 'btnFilterClose',
                handler: 'onFilterClose'
            }]
        },{
            xtype: 'tbseparator',
            reference: 'commontoolsp1'
        }, {
            xtype: 'splitbutton',
            text: '新增',
            itemId: 'btnAdd',
            reference: 'btnAdd',
            handler: 'onBtnAddClick',
            glyph: Hc.Icon.btnAdd,
            menu: [{
                text: '批量导入',
                itemId: 'btnImport',
                reference: 'btnImport',
                handler: 'onBtnImportClick',
                glyph: Hc.Icon.btnImport
            }, {
                text: '复制记录',
                itemId: 'btnCopy',
                reference: 'btnCopy',
                handler: 'onBtnCopyClick',
                glyph: Hc.Icon.btnCopy
            }]
        }, {
            text: '编辑',
            itemId: 'btnEdit',
            reference: 'btnEdit',
            handler: 'onBtnEditClick',
            glyph: Hc.Icon.btnEdit,
            hidden: true
        }, {
            text: '删除',
            itemId: 'btnDelete',
            reference: 'btnDelete',
            handler: 'onBtnDeleteClick',
            glyph: Hc.Icon.btnDelete,
            disabled: true
        }, {
            xtype: 'tbseparator',
            reference: 'commontoolsp2'
        }, {
            text: '还原',
            itemId: 'btnUndo',
            reference: 'btnUndo',
            handler: 'onBtnUndoClick',
            glyph: Hc.Icon.btnUndo,
            disabled: true
        }, {
            text: '取消',
            itemId: 'btnCancel',
            reference: 'btnCancel',
            handler: 'onBtnCancelClick',
            glyph: Hc.Icon.btnCancel,
            disabled: true
        }, {
            xtype: 'tbseparator',
            reference: 'commontoolsp3'
        }, {
            text: '保存',
            itemId: 'btnSave',
            reference: 'btnSave',
            handler: 'onBtnSaveClick',
            glyph: Hc.Icon.btnSave,
            disabled: true
        }, {
            text: '审批',
            itemId: 'btnAudit',
            reference: 'btnAudit',
            handler: 'onBtnAuditClick',
            glyph: Hc.Icon.btnAudit,
            hidden: true,
            disabled: true
        }, {
            xtype: 'tbseparator',
            reference: 'commontoolsp4'
        }, {
            xtype: 'splitbutton',
            text: '导出',
            itemId: 'btnExport',
            reference: 'btnExport',
            handler: 'onBtnExportPageClick',
            glyph: Hc.Icon.btnExport,
            menu: [{
                text: '导出当前页',
                itemId: 'btnExportPage',
                reference: 'btnExportPage',
                handler: 'onBtnExportPageClick'
            }, {
                text: '导出全部',
                itemId: 'btnExportAll',
                reference: 'btnExportAll',
                handler: 'onBtnExportAllClick'
            }]
        }, {
            xtype: 'tbseparator',
            reference: 'commontoolsp5'
        }, {
            text: '打印',
            itemId: 'btnPrint',
            reference: 'btnPrint',
            handler: 'onBtnPrintClick',
            glyph: Hc.Icon.btnPrint,
            disabled: true
        }, {
            xtype: 'tbseparator',
            reference: 'commontoolsp6'
        }, {
            text: '更多',
            itemId: 'btnOther',
            reference: 'btnOther',
            xtype: 'splitbutton',
            glyph: Hc.Icon.btnOther,
            menu: [{
                text: '查看日志',
                itemId: 'btnViewLog',
                reference: 'btnViewLog',
                handler: 'onBtnViewLog'
            }, {
                text: '批量更改列值',
                itemId: 'btnBatchModify',
                reference: 'btnBatchModify',
                handler: 'onBtnBatchModifyClick'
            }]
        }, {
            text: '功能1',
            itemId: 'btnOther1',
            reference: 'btnOther1',
            handler: 'onBtnOther1',
            hidden: true
        }, {
            text: '功能2',
            itemId: 'btnOther2',
            reference: 'btnOther2',
            handler: 'onBtnOther2',
            hidden: true
        }, {
            text: '功能3',
            itemId: 'btnOther3',
            reference: 'btnOther3',
            handler: 'onBtnOther3',
            hidden: true
        }, {
            text: '功能4',
            itemId: 'btnOther4',
            reference: 'btnOther4',
            handler: 'onBtnOther4',
            hidden: true
        }, {
            text: '功能5',
            itemId: 'btnOther5',
            reference: 'btnOther5',
            handler: 'onBtnOther5',
            hidden: true
        }]
    },

    //endregion定义工具条结束

    billStatusUrl: '',
    billStatusKey: '',
    billStatusData: null,
    billNoText:'单据编号',
    billStatusText:'单据状态',
    gridHasOrderNo: true,

    //region定义通用查询面板开始

    searchItems: [],
    searchColumn: 4,
    searchNotNullField: '', //多个查询条件中必须输入一个条件的验证
    searchPanel: {
        xtype: 'form',
        region: 'north',
        reference: 'commonsearch',
        collapsible: true,
        collapseMode: 'undefined',
        title: '查询面板',
        layout: {
            type: 'table'
        },
        header: {
            height: 20,
            padding: 0
        },
        defaults: {},
        defaultType: 'textfield',
        bodyPadding: 3,
        autoScroll: true,
        items: []
    },

    //endregion定义通用查询面板结束

    //region 定义网格属性开始
    //row 行编辑，cell 单元格编辑，window 在弹出框中编辑, none不在网络中编辑
    gridModel: '',
    gridColumns: [],
    gridEditModel: 'cell',
    gridCanDrag: false,
    gridCanEdit: true,
    gridCanAdd: true,
    gridCanDelete: true,
    gridReadOnly: false,
    gridPrimaryKey: '',
    gridUnionKey: '',
    gridRegion: 'center',
    gridIsMaster: false,
    gridSupGrid: '',
    gridSubGrid: [],

    gridAuditUrl:'',

    //dwh 控制当前网格过滤状态
    gridFilterStatus: true, //是否启用过滤
    gridFilterType: true,  //类型  true 本页,  false 所有
    gridPlugins: [],
    // "SINGLE"/"SIMPLE"/"MULTI"/"checkboxmodel"
    gridSelModel: 'MULTI',
    gridCanDeSelect: true,

    gridLoadUrl: '',
    gridSaveUrl: '',
    gridExportUrl: '',
    gridImportUrl: '',
    gridTitle: '',

    //物料尺码
    gridMSizeIdx: -1,
    gridMSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    gridMSizeQtyField: 'sizeQty',
    gridMSizeFillField: 'materialName,sizeTypeNo',
    gridSizeInputType: 'number',
    gridMConvertSize: 0,

    //固定列开关设置
    gridHasMark: true,
    gridHasCreator: true,
    gridHasModifier: true,
    gridHasAuditor: false,

    grid: {
        xtype: 'grid',
        reference: 'mastergrid',
        columnLines: true,
        columns: [],
        region: '',
        layout: 'fit',
        bbar: {
            xtype: 'pagingtoolbar',
            displayInfo: true
        },
        viewConfig: {
            enableTextSelection: true
        },
        selModel: {}
    },

    //导入服务传输字段定义
    gridcolNames: '',
    gridmustArray: '',
    gridisValidateAll: '',
    gridmainKey: '',
    gridvalidationConditions: '',

    //导出服务
    gridfileName: 'grid.xls',
    gridfileType: '.xls',
    gridexportColumns: '',

    //endregion定义网格属性结束

    //region 定义编辑面板结束 当编辑模式改为 'window', editPanelColumn 默认等于 2
    gridEditColumn: 0,
    gridEditItems: [],
    gridEditHeight: -1,
    gridEditLayout: 'table',

    editPanel: {
        xtype: 'form',
        region: 'south',
        split: true,
        reference: 'commonedit',
        border: false,
        autoScroll: true,
        defaults: {},
        layout: {},
        bodyPadding: 3,
        items: []
    },

    pageType: 'simple',
    //endregion定义编辑面板结束

    /**查看日志属性**/
    gridLogWinTitle: '',	//日志弹窗标题
    gridLogLoadUrl: '',		//日志网格加载url

    initComponent: function () {
        var me = this;
       
        console.info("Hc_Common.view.BaseSimplePage---start");
        console.info(this);
        if (!me.gridModel) {
            Hc.alert('必须此定网格对应的数据模型gridModel属性');
            me.callParent();
            return;
        }
        console.info("Hc_Common.view.BaseSimplePage----end");
        me.toolbar.region = me.toolbarRegion;

        //region处理grid开始
        me.grid.region = me.gridRegion;

        if (me.gridReadOnly) {
            me.gridCanAdd = false;
            me.gridCanDelete = false;
            me.gridCanEdit = false;
        } else if (!me.gridCanAdd && !me.gridCanDelete && !me.gridCanEdit) {
            me.gridReadOnly = true;
        }

        //定义数据源store
        var store = Ext.create('Hc_Common.store.Base', {
            model: me.gridModel,
            autoLoad: me.isAutoLoad,
            pageSize: me.pageSize,
            proxy: {
                url: me.gridLoadUrl
            }
        });
        me.grid.store = store;
        me.grid.bbar.store = store;
        me.grid.bbar.plugins = Ext.create('Ext.ux.ComboPageSize', {defaultSize: me.pageSize});

        //处理固定列
        var gCols = Hc.clone(me.gridColumns);
     
        if (me.pageType == 'billList') {
            gCols = [{
                text: me.billStatusText,
                dataIndex: 'billStatus',
                width: 60,
                renderer: function (val) {
                    if (Ext.isEmpty(val)) return val;
                    var ddl = me.lookupReference('ddlBillStatus');
                    if (!ddl) return val;
                    var idx = ddl.store.findExact(ddl.valueField, val.toString());
                    return idx > -1 ? ddl.store.getAt(idx).get(ddl.displayField) : val;
                }
            }, {
                text: me.billNoText,
                dataIndex: 'billNo',
                width: 155
            }].concat(gCols);
        } else if (me.pageType == 'billDetail' && me.gridHasOrderNo) {
            gCols = [
                {text: '序号', dataIndex: 'orderNo', width: 50}
            ].concat(gCols);
        }

   if(me.allendflag){
	   if (me.gridHasMark) {
           var mCols = {text: '备注', dataIndex: 'remarks'};
           if (!me.gridReadOnly) mCols.editor = true;
           gCols.push(mCols)
       }


       if (me.gridHasCreator) {
           gCols = gCols.concat([
               {text: '创建人', dataIndex: 'creator', width: 80},
               {text: '创建时间', dataIndex: 'createTime', width: 140}
           ]);
       }


       if (me.gridHasModifier) {
           gCols = gCols.concat([
               {text: '修改人', dataIndex: 'modifier', width: 80},
               {text: '修改时间', dataIndex: 'modifyTime', width: 140}
           ]);
       }
}
     

        if (me.gridHasAuditor) {
            gCols = gCols.concat([
                {dataIndex: 'auditor', text: '审核人', width: 80},
                {dataIndex: 'auditTime', text: '审核时间', width: 140}
            ]);
        }

        //处理尺码预留列
        if (me.gridMSizeIdx > -1) {
            Ext.Array.insert(gCols, me.gridMSizeIdx, [{
                text: '物料尺码信息',
                mSizeCol: true
            }]);
        }

        Ext.apply(me.grid, {
            editModel: me.gridEditModel,
            isCanAdd: me.gridCanAdd,
            isCanEdit: me.gridCanEdit,
            isCanDelete: me.gridCanDelete,
            isMaster: me.gridIsMaster,
            isReadOnly: me.gridReadOnly,
            batchUrl: me.gridSaveUrl,
            exportUrl: me.gridExportUrl,
            importUrl: me.gridImportUrl,
            primaryKey: me.gridPrimaryKey,
            unionKey: me.gridUnionKey,
            columns: gCols,
            vcolumn: gCols,
            modelName: me.gridModel,
            supGrid: me.gridSupGrid,
            subGrid: me.gridSubGrid,
            hasOrderNo: me.gridHasOrderNo,
            mSizeIdx: me.gridMSizeIdx,
            mSizeUrl: me.gridMSizeUrl,
            mSizeQtyField: me.gridMSizeQtyField,
            mSizeFillFields: me.gridMSizeFillField,
            sizeInputType: me.gridSizeInputType,
            convertToSize: me.gridMConvertSize,


            //导入服务传输字段定义
            colNames: me.gridcolNames,
            mustArray: me.gridmustArray,
            isValidateAll: me.gridisValidateAll,
            mainKey: me.gridmainKey,
            validationConditions: me.gridvalidationConditions,

            auditUrl:me.gridAuditUrl,

            //过滤
            isFilter: me.gridFilterStatus,
            isLocal: me.gridFilterType,



            //导出服务
            fileName: me.gridfileName,
            fileType: me.gridfileType,
            exportColumns: me.gridexportColumns,

            /**查看日志属性**/
            logWinTitle: me.gridLogWinTitle,
            logLoadUrl: me.gridLogLoadUrl
        });

        if (me.gridTitle) {
            me.grid.title = me.gridTitle;
        } else {
            delete me.grid.title;
        }


        if (me.gridEditModel === "cell") {
            me.grid.plugins = [{
                ptype: 'cellediting',
                clicksToEdit: 1
            }];
        } else if (me.gridEditModel === 'row') {
            me.grid.plugins = [{
                ptype: 'rowediting',
                clicksToEdit: 2
            }];
        } else {
           delete me.grid.plugins;
        }

        if(me.grid.plugins) {
            me.grid.plugins.push("Hcheaderfilter");
        }else{
            me.grid.plugins =["Hcheaderfilter"];
        }


        if (me.gridCanDrag) {
            me.grid.viewConfig.plugins = [{
                ptype: 'gridviewdragdrop',
                ddGroup: 'dd_commongrid',
                enableDrop: true
            }];
        }
        if (me.gridSelModel == 'checkboxmodel') {
            me.grid.selModel.selType = 'checkboxmodel';
            me.grid.selModel.mode = 'MULTI';
            me.grid.selModel.allowDeselect = true;
        } else {
            me.grid.selModel.selType = 'rowmodel',
            me.grid.selModel.mode = me.gridSelModel;
            me.grid.selModel.allowDeselect = me.gridCanDeSelect;
        }

        //endregion处理grid结束

        //region 处理查询面板开始

        var sitem = Hc.clone(me.searchItems);
        if (me.pageType == 'billList') {

            me.billStatusUrl = me.billStatusUrl || '';
            if (!me.billStatusUrl && me.billStatusKey) {
                me.billStatusUrl = Hc.mdmPath + 'bas_dict/getbasdictcombo.json?dictCode=' + me.billStatusKey;
            }
            if (Ext.isEmpty(me.billStatusUrl) && Ext.isEmpty(me.billStatusData)) {
                me.billStatusUrl = Hc.mdmPath + 'bas_dict/getbasdictcombo.json?dictCode=bill_status';
            }
            var tday = new Date();

            sitem = [{
                fieldLabel: me.billStatusText,
                name: 'billStatus',
                reference: 'ddlBillStatus',
                xtype: 'ddlfield',
                editable: false,
                valueField: 'itemCode',
                displayField: 'itemName',
                async: true,
                localData: me.billStatusData,
                url: me.billStatusUrl
            }, {
                fieldLabel: me.billNoText,
                name: 'billNo'
            }, {
                fieldLabel: '创建人',
                name: 'creator'
            }, {
                fieldLabel: '审核人',
                name: 'auditor'
            }, {
                fieldLabel: '创建时间',
                xtype: 'datefield',
                name: 'createTime1',
                allowBlank: false,
                value: Ext.Date.format(Ext.Date.add(tday, 'd', -31), 'Y-m-d')
            }, {
                fieldLabel: '至',
                xtype: 'datefield',
                name: 'createTime2',
                allowBlank: false,
                value: Ext.Date.format(tday, 'Y-m-d'),
                vtype: 'compareTo',
                compareTo: 'createTime1',
                compareType: '>=',
                compareError: '创建时间开始不能大于结束'
            }, {
                fieldLabel: '审核时间',
                xtype: 'datefield',
                name: 'auditTime1'
            }, {
                fieldLabel: '至',
                xtype: 'datefield',
                name: 'auditTime2',
                vtype: 'compareTo',
                compareTo: 'auditTime1',
                compareType: '>=',
                compareError: '审核时间开始不能大于结束'
            }].concat(sitem);
        }

        me.searchPanel.layout.columns = me.searchColumn;
        me.searchPanel.defaults.width = me.fieldWidth;
        me.searchPanel.defaults.labelAlign = me.labelAlign;
        me.searchPanel.defaults.labelWidth = me.labelWidth;
        if (sitem.length > 3) {
            me.searchPanel.layout.type = 'table';
        } else if (sitem.length > 0) {
            me.searchPanel.layout.type = 'column';
            Ext.each(sitem, function (item) {
                item.columnWidth = item.columnWidth || "0.25";
            })
        }
        me.searchPanel.items = sitem;
        //endregion 处理查询面板结束

        //region 处理编辑面板开始
        me.editPanel.layout.type = me.gridEditLayout;

        me.editPanel.height = me.gridEditHeight == -1 ? me.controller.getBodyHeight(0.4) : me.gridEditHeight;

        if ((me.gridEditColumn > 0 && me.gridEditItems.length == 0) || me.gridEditModel == "window") {
            me.editPanel.items = me.controller.getFormItems(me.grid.columns, 'gridRow');
            if (me.gridEditColumn == 0) {
                me.gridEditColumn = 4;
            }
        } else {
            me.editPanel.items = me.gridEditItems;
        }
        if (me.gridEditLayout == 'table') {
            me.editPanel.layout.columns = me.gridEditColumn;
            me.editPanel.defaults.width = me.fieldWidth;
            me.editPanel.defaults.labelAlign = me.labelAlign;
            me.editPanel.defaults.labelWidth = me.labelWidth;
        }
        
        //endregion 处理编辑面板结束

        //region系统自动布局开始
        if (!me.customLayout) {
            me.items = [me.toolbar];
            if (me.searchPanel.items.length > 0) {
                me.items.push(me.searchPanel);
            }
            me.items.push(me.grid);
            if (me.editPanel.items.length > 0 && me.gridEditModel != 'window') {
                me.items.push(me.editPanel);
            }
            me.otherItems = me.otherItems || [];
            me.items = me.items.concat(me.otherItems);
        }
        //endregion系统自动布局结束

        try {
            me.callParent();
        } catch (e) {
            Hc.alert(e);
        }
    }
});

/**
 * Description: 单表模块基类控制器，主要实现通用功能安钮的事件处理及网格数据控制
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BaseSimplePageController', {
    extend: 'Hc_Common.view.BasePageController',

    alias: 'controller.basesimplepage',

    init: function () {
        var me = this,
            objList = me.getObjList();
         
        me.callParent(arguments);

        try {

            if (!objList) return;
            var grid = objList['mastergrid'];
            console.info("输出了没有");
            console.info(objList);
            if (!me.workObject && grid) {
            	console.info("输出了没有1");
                me.workObject = grid;
            }
            if (grid) {

                grid.on("beforeselect", me.onGridBeforeSelect, me);
                grid.on("selectionchange", me.onGridSelectionChange, me);

                grid.store.on('beforeload', me.onGridBeforeLoad, me);
                grid.store.on('load', me.onGridLoaded, me);


                grid.on('beforeedit', me.onGridBeforeEdit, me);
                grid.on('edit', me.onGridAfterEdit, me);

                grid.store.on('update', me.onGridDataChanged, me);
                grid.store.on('datachanged', me.onGridDataChanged, me);

                grid.on('rowdblclick', me.onGridRowDblClick, me);


                if (me.canAdd() && me.canDelete() && !grid.isReadOnly){
                	
                	 grid.view.getRowClass = me.initRowClass;
                }
                   
            }

            me.initToolbar(objList);
            me.setLabelCls();
            me.initGridCls(objList);
        } catch (e) {
        }
    },

    //region 工具条按钮事件开始
    /*查询按钮*/
    onBtnSearchClick: function (btn) {
        var me = this,
            store = me.workObject.store,
            searchPanel = me.getObj('commonsearch');
            console.info("store:");
            console.info(store);
            console.info(me);
        if (searchPanel) {
            var formValue = searchPanel.getValues();
            console.info(formValue);
            console.info("store:end");
            for (var field in formValue) {
                if (formValue[field] !== '') {
                    store.proxy.extraParams[field] = formValue[field];
                } else {
                    delete  store.proxy.extraParams[field]
                }
            }
        }
        if (me.beforeSearch(store) === false) return;
        store.currentPage = 1;
        store.loadPage(1);
    },

    keyToSearch: function (obj, e) {
        var me = this;
        if (e.ctrlKey && e.keyCode == e.ENTER) {
            me.onBtnSearchClick();
        } else if (e.keyCode == e.ESC) {
            me.onBtnResetClick();
        }
    },

    /*查询数据之前处理事项*/
    beforeSearch: function (store) {
        var me = this,
            fields = me.view.searchNotNullField;
        if (!fields)return true;

        var form = me.getObj('commonsearch'),
            flag = false,
            fArray = fields.split(','),
            txt, label = [];
        fArray.forEach(function (item) {
            txt = Hc.getField(form, item);
            if (txt) {
                if (!Ext.isEmpty(txt.getValue())) flag = true;
                label.push('【' + txt.labelField + '】');
            }
        });
        if (!flag) {
            Hc.alert('查询条件' + label.join('') + ',必须输入一组值')
        }
        return flag;
    },

    /*重置按钮*/
    onBtnResetClick: function (btn) {
        var me = this,
            form = me.getObj('commonsearch');
        if (form) {
            form.reset();
        }
    },

    /*新增按钮*/
    onBtnAddClick: function (btn) {
        var me = this,
            grid = me.workObject,
            store = grid.store,
            model = store.model,
            columns = grid.columns,
            cellIndex = -1,
            rowIndex = store.getCount();
          windowFlag=me.windowFlag;  
          if(windowFlag){ 
        	/*  var myStore = new Ext.data.JsonStore({  
        		    url: Hc.basePath+'json/provinces.json',  
        		    root: 'personInfoList',  
        		    autoLoad: true,  
        		    fields: [{name: 'id',   type: 'int'},  
        		        {name: 'name',  type: 'string'},  
        		        {name: 'age',  type: 'int'}]  
        		    }); */
        	  var myStore = new Ext.data.JsonStore({
        		    // store configs
        		    autoDestroy: true,
        		    storeId: 'myStore',
        		    autoLoad: true,
        		    proxy: {
        		        type: 'ajax',
        		        url: Hc.basePath +'hc_file_json_province_list/province.json',
        		        reader: {
        		            type: 'json',
        		            rootProperty: 'list',
        		            idProperty: 'provinceNo'
        		        }
        		    },

        		    //另外，可以配Ext.data.Model的名称(如 Ext.data.Store 中的例子)
        		    fields: [{name: 'id',   type: 'int'},  
             		        {name: 'provinceNo',  type: 'string'},  
             		        {name: 'provinceName',  type: 'string'}] 
        		});
        	  
        	  console.info(myStore);
        	  var win;
        	  win=new Ext.Window({
        	      title:'新增',
        	      width: window.screen.availWidth/2,
        	      height:(window.screen.availHeight/3)*2,
        	      layout:'fit',//设置窗口内部布局
        	      closeAction:'hide',
        	      plain:false,//true则主体背景透明，false则和主体背景有些差别
        	      collapsible:false,//是否可收缩
        	      modal:true,//是否为模式窗体
        	      items:new Ext.form.FormPanel({//窗体中中是一个一个TabPanel
        		  title:'--->供应商管理',
        		  deferredRender:false,
        		  bodyPadding: 0,
        		  layout: {
        		      type: 'form'
        		     // columns:3
        		  },
        		  header: {
        		      height: 20,
        		      padding: 0
        		  },
        	       
        		  collapsible: true,
        		
        		  bodyStyle: 'background:#dbdbe0; padding:0px;',
        		  scrollable:true,
        		  defaults:{
        			  border:false  ,
        			  bodyPadding: 0,
        		  },
        		  items:[{
        			
        			 layout : "column", //第一行
        			 defaults:{
        				 border:false ,
        				 bodyPadding: 0,
        				 labelWidth: 70,
        				 
        			 labelAlign: 'right',
        			 bodyStyle: 'background:#cbdbe0; padding:0px;'
        			 },
        			 itemCls:'margin:0px;',
        			 bodyStyle: 'background:#cbdbe0; padding:0px;border:0px',
        			 items:[
        										{

        										    layout : "form", 
        										    columnHeight:.9,
        											items: [
        												 {
        													   readOnly:true, 
        												   labelWidth:65, 
        												   xtype: 'textfield', 
        												   fieldLabel:'供应商编码', 
        												   name: 'supplierName'   
        											       }
        											   ]
        										 },
        										 {
        											    columnWidth : .92,             
        											    layout : "form",   
        												items: [
        												       {
        													   labelWidth:65,
        													   width:550,
        													   xtype: 'textfield', 
        													   fieldLabel:'供应商名称', 
        													   name: 'supplierName',
        													   allowBlank:false,
        													   maxLength:120,
        													   maxLengthText:'此框允许输入120个字符',
        													   listeners: {
        													       render: function(obj) {
        														     var font=document.createElement("font");
        														     font.setAttribute("color","red");
        														     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        														     font.appendChild(tips);
        														    obj.el.dom.appendChild(font);
        													     }

        													   }
        												       }
        												   ]
        											 }
        																		 
        									]
        		  },
        		  {
        			
        			 layout : "column", //第二行
        			 defaults:{
        				 border:false ,
        				 bodyPadding: 0,
        				 labelWidth: 70,
        			 labelAlign: 'right',
        			 bodyStyle: 'background:#cbdbe0; padding:0px;'
        			 },
        			
        			 bodyStyle: 'background:#cbdbe0; padding:0px;',
        			 items:[
        										{

        										    layout : "form", 
        										    columnWidth : .99,
        											items: [
        												 {
        													 
        												   labelWidth:65, 
        												   xtype: 'textfield', 
        												   fieldLabel:'供应商地址', 
        												   name: 'supplierName',
        												   allowBlank:false,
        												   maxLength:145,
        												   maxLengthText:'此框允许输入145个字符',
        												   listeners: {
        												       render: function(obj) {
        													     var font=document.createElement("font");
        													     font.setAttribute("color","red");
        													     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        													     font.appendChild(tips);
        													    obj.el.dom.appendChild(font);
        												     }

        												  }
        												       
        											       }
        											   ]
        										 }
        										]
        																		 
        		  },
        		 {

        			 layout : "column", //第三行
        			 defaults:{
        					 border:false ,
        					 bodyPadding: 0,
        					 labelWidth: 70,
        					 labelAlign: 'right',
        					 bodyStyle: 'background:#cbdbe0; padding:0px;'
        			 },

        			 bodyStyle: 'background:#cbdbe0; padding:0px;',

        			 items:[
        			 {

        			     layout : "form", 
        			     
        				items: [
        					  {
        						   labelWidth:65, 
        						   xtype: 'textfield', 
        						   fieldLabel:'公司电话', 
        						   name: 'supplierName',
        						   allowBlank:false,
        						   regex:/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$|(^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$)/,
        						   regexText:'正确的电话号码，\n\n如：0591-6487256，15005059587',
        						   listeners: {
        											       render: function(obj) {
        												     var font=document.createElement("font");
        												     font.setAttribute("color","red");
        												     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        												     font.appendChild(tips);
        												    obj.el.dom.appendChild(font);
        												    console.info("输出了美味哟------------");
       												   
       												     console.info(obj);
       												    console.info("输出了美味哟*************");
        											     }

        										      }
        				       },
        				       {
        						   labelWidth:65, 
        						   xtype: 'textfield', 
        						   fieldLabel:'公司网址', 
        						   name: 'supplierName' 
        					   }
        				   ]
        			  },
        			  {
        				    columnWidth : .4,             
        				    layout : "form",   
        					items: [
        					       {
        						   labelWidth:65,
        						   width:550,
        						   xtype: 'textfield', 
        						   fieldLabel:'公司传真', 
        						   name: 'supplierName',
        						   allowBlank:false,
        						   regex:/^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/,
        					       },
        				       {
        						   labelWidth:65, 
        						   xtype: 'textfield', 
        						   fieldLabel:'邮 &nbsp;&nbsp;&nbsp;&nbsp; 编', 
        						   name: 'supplierName',
        						   allowBlank:false,
        						       regex:/[1-9]{1}(\d+){5}/,
        						       listeners: {
        											       render: function(obj) {
        												     var font=document.createElement("font");
        												     font.setAttribute("color","red");
        												     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        												     font.appendChild(tips);
        												     console.info("输出了美味哟");
        												     obj.el.dom.appendChild(font);
        												     console.info(obj);
        											     }

        											  }
        					   }
        					   ]
        			  }
        			 ,
        			  {
        				    columnWidth : .5,             
        				    layout : "form",   
        					items: [
        					       {
        						   labelWidth:65,
        						   width:550,
        						   xtype: 'textfield', 
        						   fieldLabel:'电子邮件', 
        						   name: 'supplierName',
        						   allowBlank:false,
        						   regex:/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
        										   listeners: {
        											       render: function(obj) {
        												     var font=document.createElement("font");
        												     font.setAttribute("color","red");
        												     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        												     font.appendChild(tips);
        												    obj.el.dom.appendChild(font);
        											     }

        										      }
        					       },
        				       {
        						   labelWidth:65, 
        						   xtype: 'textfield', 
        						   fieldLabel:'国&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;家', 
        						   name: 'supplierName',
        						   allowBlank:false,
        						   maxLength:48,
        						   maxLengthText:'最大字符长度48字符',
        											   listeners: {
        												       render: function(obj) {
        													     var font=document.createElement("font");
        													     font.setAttribute("color","red");
        													     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        													     font.appendChild(tips);
        													    obj.el.dom.appendChild(font);
        												     }

        											      }
        					   }
        					   ]
        			  }
        											 
        			 ]								 
        			 },
        			 {
        			
        			 layout : "column", //第四行
        			 defaults:{
        				 border:false ,
        				 bodyPadding: 0,
        				 labelWidth: 70,
        				 labelAlign: 'right',
        				 bodyStyle: 'background:#cbdbe0; padding:0px;'
        			 },
        			
        			 bodyStyle: 'background:#cbdbe0; padding:0px;',
        			 items:[
        										{

        										    layout : "form", 
        										    columnWidth : .3,
        											items: [
        												 {
        													 
        												   labelWidth:65, 
        												   xtype: 'extcombox', 
        												   store:myStore,
        												   fieldLabel:'省&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份', 
        												   //name: 'supplierName',
        												   displaymember:'provinceName',
        														   valuemember:'provinceNo',
        												   allowBlank:false,
        												   blankText:'请选择省份',
        												   emptyText:'请选择省份',
        												   
        													   listeners: {
        													       render: function(obj) {
        														     var font=document.createElement("font");
        														     font.setAttribute("color","red");
        														     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        														     font.appendChild(tips);
        														     obj.el.dom.appendChild(font);
        														      
        													     }

        													   }
        											       }
        											   ]
        										 },
        										{
        									       
        										    layout : "form", 
        										    columnWidth : .3,
        											items: [
        												 {
        													 
        												   labelWidth:65, 
        												  
        												   fieldLabel:'城&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;市', 
        												   xtype:'extcombox',
	       									               store: myStore,
	       												   displaymember:'provinceName',
	       												   valuemember:'provinceNo',
        												 //  name: 'supplierName' ,
        												   allowBlank:false,
        													   blankText:'请选择城市',
        													   emptyText:'请选择城市',
        													   listeners: {
        													       render: function(obj) {
        														     var font=document.createElement("font");
        														     font.setAttribute("color","red");
        														     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        														     font.appendChild(tips);
        														     obj.el.dom.appendChild(font);
        														     
        														     console.info("什么对象");
        														     console.info(obj);
        													     }

        													  }
        											       }
        											   ]
        										 }
        										]
        																		 
        		  },
        		  
        		  
        		 {

        			 layout : "column", //第五行
        			 defaults:{
        					 border:false ,
        					 bodyPadding: 0,
        					 labelWidth: 70,
        					 labelAlign: 'right',
        					 bodyStyle: 'background:#cbdbe0; padding:0px;'
        			 },

        			 bodyStyle: 'background:#cbdbe0; padding:0px;',

        			 items:[
        			 {

        			     layout : "form", 
        			     
        				items: [
        					  {
        						   labelWidth:65, 
        						   xtype: 'textfield', 
        						   fieldLabel:'法人代表', 
        						   name: 'supplierName',
        											   listeners: {
        												       render: function(obj) {
        													     var font=document.createElement("font");
        													     font.setAttribute("color","red");
        													     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        													     font.appendChild(tips);
        													    obj.el.dom.appendChild(font);
        												     }

        											      } 
        				       },
        				       {
        						   labelWidth:65, 
        						   xtype: 'textfield', 
        						   fieldLabel:'注册资本', 
        						   name: 'supplierName',
        											   listeners: {
        												       render: function(obj) {
        													     var font=document.createElement("font");
        													     font.setAttribute("color","red");
        													     var tips=document.createTextNode('万元');//这个就是后面的文字提示信息
        													     font.appendChild(tips);
        													    obj.el.dom.appendChild(font);
        												     }

        											      }
        					   },
        				       {
        						   labelWidth:65, 
        						   xtype: 'textfield', 
        						   fieldLabel:'使用货币', 
        						   name: 'supplierName',
        											   listeners: {
        												       render: function(obj) {
        													     var font=document.createElement("font");
        													     font.setAttribute("color","red");
        													     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        													     font.appendChild(tips);
        													    obj.el.dom.appendChild(font);
        												     }

        											      } 
        					   },
        				       {
        						   labelWidth:65, 
        						   xtype: 'textfield', 
        						   fieldLabel:'年度收入', 
        						   name: 'supplierName',
        											   listeners: {
        												       render: function(obj) {
        													     var font=document.createElement("font");
        													     font.setAttribute("color","red");
        													     var tips=document.createTextNode('万元');//这个就是后面的文字提示信息
        													     font.appendChild(tips);
        													    obj.el.dom.appendChild(font);
        												     }

        											      } 
        					   }
        				   ]
        			  },
        			  {
        				    columnWidth : .4,             
        				    layout : "form",   
        					items: [
        					       {
        						   labelWidth:65,
        						   width:550,
        						   xtype: 'textfield', 
        						   fieldLabel:'组织形式', 
        						   name: 'supplierName',
        											   listeners: {
        												       render: function(obj) {
        													     var font=document.createElement("font");
        													     font.setAttribute("color","red");
        													     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        													     font.appendChild(tips);
        													    obj.el.dom.appendChild(font);
        												     }

        											      }
        					       },
        					       {
        							   labelWidth:65, 
        							   xtype: 'textfield', 
        							   fieldLabel:'营业执照', 
        							   name: 'supplierName' 
        						   },
        					       {
        							   labelWidth:65, 
        							   xtype: 'textfield', 
        							   fieldLabel:'联系人', 
        							   name: 'supplierName',
        												   listeners: {
        												       render: function(obj) {
        													     var font=document.createElement("font");
        													     font.setAttribute("color","red");
        													     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        													     font.appendChild(tips);
        													    obj.el.dom.appendChild(font);
        												     }

        											      } 
        						   },
        					       {
        							   labelWidth:65, 
        							   xtype: 'textfield', 
        							   fieldLabel:'跟单采购', 
        							   name: 'supplierName',
        												   listeners: {
        												       render: function(obj) {
        													     var font=document.createElement("font");
        													     font.setAttribute("color","red");
        													     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        													     font.appendChild(tips);
        													    obj.el.dom.appendChild(font);
        												     }

        											      } 
        						   }
        					   ]
        			  }
        			 ,
        			  {
        				    columnWidth : .5,             
        				    layout : "form",   
        					items: [
        					       {
        						   labelWidth:65,
        						   width:550,
        						   xtype: 'textfield', 
        						   fieldLabel:'供应商性质', 
        						   name: 'supplierName'
        					       },
        					       {
        							   labelWidth:65, 
        							   xtype: 'textfield', 
        							   fieldLabel:'行&nbsp;业&nbsp;类&nbsp;型', 
        							   name: 'supplierName' 
        						   },
        					       {
        							   labelWidth:65, 
        							   xtype: 'textfield', 
        							   fieldLabel:'供应商级别', 
        							   name: 'supplierName' 
        						   },
        					       {
        							   labelWidth:65, 
        							   xtype: 'textfield', 
        							   fieldLabel:'联系人手机', 
        							   name: 'supplierName',
        												   listeners: {
        												       render: function(obj) {
        													     var font=document.createElement("font");
        													     font.setAttribute("color","red");
        													     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        													     font.appendChild(tips);
        													    obj.el.dom.appendChild(font);
        												     }

        											      } 
        						   }
        					   ]
        			  }
        											 
        			 ]								 
        			 },
        			 
        			 
        			 {

        				 layout : "column", //第六行
        				 defaults:{
        						 border:false ,
        						 bodyPadding: 0,
        						 labelWidth: 70,
        						 labelAlign: 'right',
        						 bodyStyle: 'background:#cbdbe0; padding:0px;'
        				 },

        				 bodyStyle: 'background:#cbdbe0; padding:0px;',

        				 items:[
        				 {

        				     layout : "form", 
        				     
        					items: [
        						  {
        							   labelWidth:65, 
        							   xtype: 'textfield', 
        							   fieldLabel:'开户银行', 
        							   name: 'supplierName',
        												   listeners: {
        												       render: function(obj) {
        													     var font=document.createElement("font");
        													     font.setAttribute("color","red");
        													     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        													     font.appendChild(tips);
        													    obj.el.dom.appendChild(font);
        												     }

        												  } 
        					       },
        					       {
        							   labelWidth:65, 
        							   xtype: 'textfield', 
        							   fieldLabel:'付款方式', 
        							   name: 'supplierName',
        												   listeners: {
        												       render: function(obj) {
        													     var font=document.createElement("font");
        													     font.setAttribute("color","red");
        													     var tips=document.createTextNode('*');//这个就是后面的文字提示信息
        													     font.appendChild(tips);
        													    obj.el.dom.appendChild(font);
        												     }

        												  }
        					       }
        					   ]
        				  },
        				  {
        					    columnWidth : .4,             
        					    layout : "form",   
        						items: [
        						       {
        							   labelWidth:65,
        							   width:550,
        							   xtype: 'textfield', 
        							   fieldLabel:'银行账号', 
        							   name: 'supplierName'
        						       },
        					       {
        							   labelWidth:65, 
        							   xtype: 'textfield', 
        							   fieldLabel:'价值类别', 
        							   name: 'supplierName' 
        						   }
        						   ]
        				  }
        				 ,
        				  {
        					    columnWidth : .5,             
        					    layout : "form",   
        						items: [
        						       {
        							   labelWidth:65,
        							   width:550,
        							   xtype: 'textfield', 
        							   fieldLabel:'成立日期', 
        							   name: 'supplierName'
        						       },
        					       {
        							   labelWidth:65, 
        							   xtype: 'textfield', 
        							   fieldLabel:'是否共享', 
        							   name: 'supplierName' 
        						   }
        						   ]
        				  }
        												 
        				 ]								 
        				 },
        				 
        				 
        				 {

        				 layout : "column", //第七行
        				 defaults:{
        						 border:false ,
        						 bodyPadding: 0,
        						 labelWidth: 70,
        						 labelAlign: 'right',
        						 bodyStyle: 'background:#cbdbe0; padding:0px;'
        				 },

        				 bodyStyle: 'background:#cbdbe0; padding:0px;',

        				 items:[
        				 {

        				     layout : "form", 
        				     
        					items: [
        						  {
        							   labelWidth:65, 
        							   xtype: 'textfield', 
        							   fieldLabel:'创建用户', 
        							   name: 'supplierName' 
        					       },
        					       {
        							   labelWidth:65, 
        							   xtype: 'textfield', 
        							   fieldLabel:'所在部门', 
        							   name: 'supplierName' 
        						   }
        					   ]
        				  },
        				  {
        					    columnWidth : .4,             
        					    layout : "form",   
        						items: [
        						       {
        							   labelWidth:65,
        							   width:550,
        							   xtype: 'textfield', 
        							   fieldLabel:'修改用户', 
        							   name: 'supplierName'
        						       },
        						       {
        								   labelWidth:65, 
        								   xtype: 'textfield', 
        								   fieldLabel:'修改时间', 
        								   name: 'supplierName' 
        							   }
        						   ]
        				  }
        				 ,
        				  {
        					    columnWidth : .5,             
        					    layout : "form",   
        						items: [
        						       {
        							   labelWidth:65,
        							   width:550,
        							   xtype: 'textfield', 
        							   fieldLabel:'登录日期', 
        							   name: 'supplierName'
        						       }
        						   ]
        				  }
        												 
        				 ]								 
        				 },
        				 
        				 
        			 {
        					
        					 layout : "column", //第八行
        					 defaults:{
        						 border:false ,
        						 bodyPadding: 0,
        						 labelWidth: 70,
	        					 labelAlign: 'right',
	        					 height:4,
	        					 bodyStyle: 'background:#cbdbe0; padding:0px;'
        					 },
        					
        					 bodyStyle: 'background:#cbdbe0; padding:0px;',
        					 items:[
        												{

        												    layout : "form", 
        												    columnWidth : .88,
        													items: [
        														 {
        															 
        														   labelWidth:65, 
        														   xtype: 'textareafield', 
        														   fieldLabel:'公&nbsp;&nbsp;&nbsp;司&nbsp;&nbsp;&nbsp;规&nbsp;&nbsp;&nbsp;模', 
        														   name: 'supplierName' 
        													       },
        													      {
        															 
        														   labelWidth:65, 
        														   xtype: 'textareafield', 
        														   fieldLabel:'销&nbsp;&nbsp;&nbsp;售&nbsp;&nbsp;&nbsp;能&nbsp;&nbsp;&nbsp;力', 
        														   name: 'supplierName' 
        													       },
        													      {
        															 
        														   labelWidth:65, 
        														   xtype: 'textareafield', 
        														   fieldLabel:'质&nbsp;&nbsp;&nbsp;量&nbsp;&nbsp;&nbsp;控&nbsp;&nbsp;&nbsp;制', 
        														   name: 'supplierName' 
        													       },
        													      {
        															 
        														   labelWidth:65, 
        														   xtype: 'textareafield', 
        														   fieldLabel:'公&nbsp;&nbsp;&nbsp;司&nbsp;&nbsp;&nbsp;简&nbsp;&nbsp;&nbsp;介', 
        														   name: 'supplierName' 
        													       },
        													      {
        															 
        														   labelWidth:65, 
        														   xtype: 'textareafield', 
        														   fieldLabel:'生产/销售产品类别', 
        														   name: 'supplierName' 
        													       },
        													      {
        															 
        														   labelWidth:65, 
        														   xtype: 'textareafield', 
        														   fieldLabel:'合&nbsp;&nbsp;&nbsp;作&nbsp;&nbsp;&nbsp;机&nbsp;&nbsp;&nbsp;会', 
        														   name: 'supplierName' 
        													       },
        													      {
        														   height:6, 
        														   labelWidth:65, 
        														   xtype: 'textareafield', 
        														   fieldLabel:'备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注', 
        														   name: 'supplierName' 
        													       }
        													   ]
        												 }
        												]
        																				 
        				  }
        			 
        		  
        	       ]
        	      }),
        	      buttons:[
        	      {
        		  text:'保存',
        		  disabled:false//暂时设为不可用
        	      },
        	      {
        		  text:'取消',
        		  handler:function(){//点击时触发的事件
        		      win.hide();
        		  }
        	      }
        	      ]
        	  });
        	                             
        	                              win.show();//显示窗体
        	                     
          	return;
          }
        if (!grid.isCanAdd || grid.isReadOnly) {
            Hc.alert("此网络不可新增记录");
            return;
        }
        var newObj = model.create({_flag: 'A'});
        if (me.initAddData(newObj) === false) return;
        store.add(newObj);
        grid.getSelectionModel().select(rowIndex);

        if (grid.editModel != "cell" && grid.editModel != 'row') return;

        for (var i = 0; i < columns.length; i++) {
            if (columns[i].getEditor()) {
                cellIndex = i;
                break;
            }
        }
        if (cellIndex == -1) return;
        if (grid.editModel == 'cell') {
            grid.editingPlugin.startEditByPosition({row: rowIndex, column: cellIndex});
        } else {
            grid.editingPlugin.startEdit(rowIndex, cellIndex);
        }
    },
    /* 新增数据时，初始化数据对象*/
    initAddData: function (newObj) {

    },

    /**批量导入按钮*/
    //弹出导入选择文件框
    onBtnImportClick: function (btn) {
        var me = this,
            importErrorMsg = '',
            grid = me.workObject,
            supGrid = grid.supGrid,
            objJson = '';  //从表导入，设值主表主键值

        
        var win=new Hc_Common.ux.HcImport({
        	workObject:me.workObject
        });

        win.show();
        return;
        if (!grid.isCanAdd || grid.isReadOnly) {
            Hc.alert("此网络不可新增记录");
            return;
        }

        if (!grid.importUrl) {
            Hc.alert('此网格数据不支持批量导入功能');
            return;
        }

        if (supGrid && me.getObj(supGrid).getSelection().length < 1) {
            Hc.alert('主表没有选中记录时，从表不能导入');
            return false;
        }
        //导入服务后台参数
        if (grid.colNames == '') {
            importErrorMsg += '此网格没有指定导入列：colNames<br>';

        }
        if (grid.mustArray == '') {
            importErrorMsg += '此网格没有指定列的值是否为必填：mustArray<br>';

        }
        if (grid.isValidateAll == '') {
            importErrorMsg += '此网格没有指定是否要全部验证通过才导入：isValidateAll<br>';

        }
        if (grid.validationConditions == '') {
            importErrorMsg += '此网格没有指定公共验证条件：validationConditions<br>';

        }

        if (importErrorMsg != '') {
            Hc.alert(importErrorMsg);
            return;
        }

        if (grid.isMaster) {
            Hc.alert('当前网格为主表不能批量导入');
            return;
        } else if(supGrid) {
            var mainGrid = me.getObj(supGrid),
                mainGridprimaryKey = mainGrid.primaryKey,
                mainGridprimaryValue = mainGrid.getSelection()[0].get[mainGridprimaryKey];
            objJson = '{' + '"' + mainGridprimaryKey + '"' + ':' + mainGridprimaryValue + '}';
        }

        var uploadform = {
            xtype: 'form',
            grid: grid,
            isUpload: true,
            baseCls: 'x-plain',
            bodyPadding: 10,
            items: [{
                xtype: 'filefield',
                name: 'importFileValue',
                fieldLabel: '请选择文件(.xls,.xlsx)',
                labelWidth: 150,
                width: 280,
                msgTarget: 'side',
                allowBlank: false,
                anchor: '100%',
                buttonText: '选择...'
            }, {
                xtype: 'textfield',
                name: 'colNames',
                hidden: true,
                fieldLabel: '指定导入列的名字（多个列用逗号隔开）',
                labelWidth: 150,
                width: 280,
                value: grid.colNames

            }, {
                xtype: 'textfield',
                name: 'mustArray',
                hidden: true,
                fieldLabel: '是否必填（对应上面指定列的是否必填，多个用逗号隔开）',
                labelWidth: 150,
                width: 280,
                value: grid.mustArray

            }, {
                xtype: 'textfield',
                name: 'isValidateAll',
                hidden: true,
                fieldLabel: '是否要全部验证通过才导入（Y 或N）',
                labelWidth: 150,
                width: 280,
                value: grid.isValidateAll

            }, {
                xtype: 'textfield',
                name: 'mainKey',
                hidden: true,
                fieldLabel: '验证有重复(填写属性名，多个用逗号隔开)',
                labelWidth: 150,
                width: 280,
                value: grid.mainKey
            }, {
                xtype: 'textfield',
                name: 'validationConditions',
                hidden: true,
                fieldLabel: '公共验证条件(Json字符串数组)',
                labelWidth: 150,
                width: 280,
                value: grid.validationConditions
            }, {
                xtype: 'textfield',
                name: 'objJson',
                hidden: true,
                fieldLabel: '从表导入，设值主表主键值',
                labelWidth: 150,
                width: 280,
                value: objJson
            }]
        };
        me.showInWin(uploadform, {winName: 'importwin', title: '批量导入'});
    },

    //处理导入事件
    onWinConfirmClick: function (btn) {
        var win = btn.up('window');
        if (win.winName == "importwin") {
            var form = win.down('form'),
                formobj = form.getForm();
            if (!formobj.isValid()) return;
            formobj.submit({
                url: form.grid.importUrl,
                waitMsg: '正在导入...',
                success: function (obj, result) {
                    Hc.alert(result.result ? result.result.msg : '导入成功！');
                    form.grid.store.reload();
                    win.close();
                },
                failure: function (formobj, result) {
                    Ext.Msg.alert('导入提示', result.result.result.msg);
                    form.grid.store.reload();
                    if (result.result.result.msg == '导入成功') {
                        win.close();
                    }
                }
            });
        }
    },

    /**复制记录按钮 (复制选中的行)*/
    onBtnCopyClick: function (btn) {
        var me = this,
            grid = me.workObject,
            store = me.workObject.store,
            idField = me.workObject.primaryKey,
            selection = me.workObject.getSelection(),
            newObj;
        if (selection.length < 1)return;
        if (!grid.isCanAdd || grid.isReadOnly) {
            Hc.alert('此网格不允许新增数据');
            return;
        }
        if (grid.isMaster && this.editingList.length > 0) {
            Hc.alert('您有一笔数据正在处理，不能复制主表记录');
            return;
        }
        Ext.each(selection, function (item) {
            newObj = Ext.create(store.model);
            Ext.apply(newObj.data, item.data);
            newObj.set(idField, '');
            newObj.set('_flag', 'A');
            if (me.beforeCopy(newObj) !== false) {
                store.add(newObj);
            }
        });
    },

    beforeCopy:function(newObj){

    },

    /** 删除 如果是新增还没有保存的数据，直接删除，如果是已保存的数据，打上删除标识*/
    onBtnDeleteClick: function (btn) {
        var me = this,
            obj = this.workObject,
            store = obj.getStore(),
            delflag = false,
            items = obj.getSelection();

        if (items.length < 1) return;
        if (obj.isReadOnly || !obj.isCanDelete)return;
        if (this.checkDelete(items) === false) return;
        Ext.each(items, function (record) {
            var _flag = record.get('_flag'),
                auditflag = record.get('billStatus');
            if (_flag == 'A') {
                store.remove(record);
            } else {
                if(auditflag==null || auditflag < me.view.auditStatus) {
                    record.set('_flag', 'D');
                    delflag = true;
                }
            }
        });
        if (delflag) {
           // obj.view.refresh();
        }
    },

    /* 检查数据是否能删除,如果不能删除，返回false*/
    checkDelete: function (items) {

    },

    /**还原（还原选中行的所有操作）*/
    onBtnUndoClick: function (btn) {
        var grid = this.workObject,
            store = grid.store,
            items = grid.getSelectionModel().getSelection();

        Ext.each(items, function (record) {
            if (record.phantom) {
                store.remove(record);
            }
            else {
                record.reject();
            }
        });
    },

    /** 取消当前所有操作*/
    onBtnCancelClick: function (btn) {
        var grid = this.workObject,
            store = grid.getStore();
        store.rejectChanges();
        grid.view.refresh();
    },

    /**提交保存 (批量处理)*/
    onBtnSaveClick: function (btn) {
        var me = this,
            obj = me.workObject;

        if (!obj.isUpdating) return;

        var param = me.getDataToSave(obj);

        if (!param)return;

        if (me.beforeSave(param) === false)return;
        me.saveData({srcObj: obj, data: param, btn: btn});
    },

    /* 保存之前特殊处理 返回false 阻止保存*/
    beforeSave: function (data) {

    },

    /*从写保存之后方法（保存完后，如果成功重新加载数据，失败则提示错误消息）*/
    afterSave: function (result, options) {
        var me = this;
        me.callParent(arguments);
        if (result.result.resultCode == "0") {
            if (options.srcObj.is('grid')) {
                options.srcObj.store.reload();
            } else {
                me.afterSaveResetForm(result, options);
            }
        } else {
            Hc.alert(result.result.msg);
        }
    },

    afterSaveResetForm: function (result, options) {

    },

    /*导出当前页数据*/
    onBtnExportPageClick: function (btn) {
        var me = this,
            exportErrorMsg = '',
            grid = me.workObject,
            objs = me.getObjList(),
            exportUrl = grid.exportUrl,
            subgridExport = '',
            searchPanel = objs['commonsearch'];

        var win=new Hc_Common.ux.HcExport({
			gridColumns:me.workObject.columns,
			grid:me.workObject,
			objs:me.getObjList(),
			exportUrl:grid.exportUrl,
			searchPanel:objs.commonsearch,
			subgridExport:null,
			exportType:"page"
			
		});
		win.show();
        return;
        
//        var searchPanelValue = searchPanel.getValues('d');  //获取查询面板值
//        var fileName = grid.fileName;
//        var fileType = grid.fileType;
//        var exportColumns = grid.exportColumns;
//
//        if (!exportUrl) {
//            Hc.alert('此网格没有提供导出功能');
//            return;
//        }
//        if (exportColumns == '') {
//            exportErrorMsg += '此网格没有指定需要导出的列信息：exportColumns<br>';
//        }
//
//        if (exportErrorMsg != '') {
//            Ext.Msg.alert('导出提示', exportErrorMsg);
//            return;
//        }
//        if (grid.supGrid) {
//            var mainGrid = me.lookupReference(grid.supGrid),
//                mainGridprimaryKey = mainGrid.primaryKey,
//                mainGridprimaryValue = mainGrid.getSelection()[0].data[mainGridprimaryKey];
//            subgridExport = mainGridprimaryKey + '=' + mainGridprimaryValue;
//        }
//        window.location.href = exportUrl +
//        "?exportColumns=" + exportColumns +
//        '&fileName=' + fileName + '&fileType=' + fileType +
//        '&pageNum=' + grid.store.currentPage +
//        '&pageSize=' + grid.store.pageSize + '&' + searchPanelValue + '&' +
//        subgridExport;
        return false;
    },

    /*导出所有数据*/
    onBtnExportAllClick: function (btn) {
        var me = this,
            exportErrorMsg = '',
            grid = me.workObject,
            objs = me.getObjList(),
            exportUrl = grid.exportUrl,
            searchPanel = objs.commonsearch,
            subgridExport = '';

        var win=new Hc_Common.ux.HcExport({
			gridColumns:me.workObject.columns,
			grid:me.workObject,
			objs:me.getObjList(),
			exportUrl:grid.exportUrl,
			searchPanel:objs.commonsearch,
			subgridExport:null,
			exportType:"all"
			
		});
		win.show();
        return;

//        var searchPanelValue = searchPanel.getValues('d');  //获取查询面板值
//        var fileName = grid.fileName;
//        var fileType = grid.fileType;
//        var exportColumns = grid.exportColumns;
//
//
//        if (!exportUrl) {
//            Hc.alert('此网格没有提供导出功能');
//            return;
//        }
//        if (exportColumns == '') {
//            exportErrorMsg += '此网格没有指定需要导出的列信息：exportColumns<br>';
//        }
//
//        if (exportErrorMsg != '') {
//            Ext.Msg.alert('导出提示', exportErrorMsg);
//            return;
//        }
//        if (grid.supGrid) {
//            var mainGrid = me.lookupReference(grid.supGrid),
//                mainGridprimaryKey = mainGrid.primaryKey,
//                mainGridprimaryValue = mainGrid.getSelection()[0].data[mainGridprimaryKey];
//            subgridExport = mainGridprimaryKey + '=' + mainGridprimaryValue;
//        }
//        window.location.href = exportUrl +
//        "?exportColumns=" + exportColumns +
//        '&fileName=' + fileName + '&fileType=' + fileType +
//        '&' + searchPanelValue + '&' + subgridExport;
        return false;
    },

    /*打印（选中的记录）*/
    onBtnPrintClick: function (btn) {
        // 通过打印控件生成报表页面
    },

    /*查看日志*/
    onBtnViewLog: function (btn) {
        // 查看记录的操作日志
    },

    /**审批前接口*/
    beforeAudit:function(list){

    },

    /**审批功能*/
    onBtnAuditClick: function (btn) {

        var me = this,
            grid = me.workObject;

        //编辑状态不能审核
        if (grid.isUpdating)return;

        var items = grid.getSelection(),
            auditItems = [],
            params = {},
            auditFlag;

        items.each(function(item) {
            auditFlag = item.get('billStatus');
            if (auditFlag!=null && auditFlag < me.view.auditStatus) {
                item.set('billStatus',me.view.auditStatus);
                item.set('auditor',me.getUserName());
                item.set('auditTime',new Date());
                auditItems.push(item.data);
            }
        });

        var count = auditItems.length;

        if(count < 1){
            Hc.alert('没有需要审批的记录');
            return ;
        }

        if(me.beforeAudit(auditItems)===false)return;

        Hc.confirm('有'+count+'条记录可审批,确认审批',function(btnflag) {
            if(btnflag!='yes') return;
            params.updateList = auditItems;
            //提交请求配置
            var reqOption = {
                url: grid.auditUrl,
                method: 'POST',
                jsonData:JSON.stringify(params),
                success:function(response, options){
                    var resResult = JSON.parse(response.responseText);
                    if(resResult.result.resultCode=='0'){
                        grid.store.reload();
                    }else{
                        Hc.alert(resResult.result.msg)
                    }
                },
                failure: function (response) {
                    Hc.show({
                        title: '错误提示',
                        msg: response.responseText,
                        height: 300,
                        width: 500
                    });
                }
            };
            me.callServer(reqOption);

        });
    },

    onBtnBatchModifyClick: function(btn) {
        var me = this,
            grid = me.workObject,
            combodata = [],
            formpanel;

        if (grid.isReadOnly || !grid.isCanEdit
            || !me.canEdit()||grid.store.getCount()==0)return;

        Ext.each(grid.columns, function (col) {
            if (col.getEditor && col.getEditor() && col.dataIndex != grid.primaryKey) {
                var obj = {
                    'code': col.dataIndex,
                    'name': col.text
                };
                combodata.push(obj);
            }
        });
        formpanel = {
            xtype: 'form',
            bodyPadding: '20 10 10 10',
            baseCls: 'x-plain',
            items: [{
                xtype: 'combobox',
                width: 280,
                displayField: 'name',
                valueField: 'code',
                fieldLabel: '更改列',
                name: 'fieldName',
                allowBlank:false,
                store: {
                    fields: ['code', 'name'],
                    data: combodata
                }
            }, {
                name: 'fieldValue',
                xtype: 'textfield',
                fieldLabel: '更改值',
                width: 280
            }, {
                xtype: 'radiogroup',
                columns: 2,
                vertical: false,
                items: [{
                    boxLabel: '更改选中行',
                    name: 'changeType',
                    inputValue: '1',
                    checked:true,
                    width:140
                }, {
                    boxLabel: '更改所有行',
                    name: 'changeType',
                    inputValue: '2'
                }]
            }]
        };
        var fn = function (b) {
            var win = b.up('window'),
                form = win.down('form'),
                val = form.getValues(),
                records;

            if(!form.isValid()) return;

            if (!val.changeType) {
                return;
            }else if (val.changeType == 1) {
                records = grid.getSelection();
            } else {
                records = grid.store.data.items;
            }

            if(records.length<1){
                Hc.alert('没有需要更改的行');
                return;
            }

            Hc.confirm('确认批量更改此列的值？',function(flag){
                if(flag == 'yes'){
                    Ext.each(records, function (record) {
                        if (record.get('billStatus') == null) {
                            record.set(val.fieldName, val.fieldValue);
                        } else if (record.get('billStatus') < me.view.auditStatus) {
                            record.set(val.fieldName, val.fieldValue);
                        }
                    });
                }
            });
        };

        Ext.widget('window', {
            title: '批量更改',
            width:320,
            height: 200,
            constrain: true,
            closeAction: 'destroy',
            autoShow: true,
            items: [formpanel],
            bbar: ['->', {
                xtype: 'button',
                text: '确认',
                glyph: Hc.Icon.btnSave,
                handler: fn,
                scope: me
            }, {
                xtype: 'button',
                text: '退出',
                glyph: Hc.Icon.btnCancel,
                handler: function (b) {
                    b.up('window').close();
                }
            }]
        });
    },

    //dwh  切换过滤按钮显示
    onFilterClose: function (btn) {
    	var me=this,
    	 grid=me.workObject;
    	if(typeof(grid.setFilterStatus)=="function"){
    		grid.setFilterStatus(false);
    	
    		me._setBtnFilterText(btn.up("[itemId='btnFilter']"));
    	}
    },
    //dwh	当前页
    onSetFilterLocal:function(btn){
    	var me=this,
    	grid=me.workObject;
    	grid.isLocal=true;
    	if(typeof(grid.setFilterStatus)=="function"){
    		grid.setFilterStatus(true);
    	}
    	me._setBtnFilterText(btn.up("[itemId='btnFilter']"));
    },
    //所有
    onSetFilterServer:function(btn){
    	var me=this,
    	grid=me.workObject;
    	grid.isLocal=false;
    	if(typeof(grid.setFilterStatus)=="function"){
    		grid.setFilterStatus(true);
    	}
    	me._setBtnFilterText(btn.up("[itemId='btnFilter']"));
    },
    //显示文本
    _setBtnFilterText:function(btn){
    	var me=this,
    	 grid=me.workObject;
    	if(typeof(grid.setFilterStatus)!="function"){
    		btn.setText("请加入filter插件");
    		return;
    	}
    	
    	if(grid.getFilterStatus()){
    		text="过滤["+(grid.isLocal?"本页":"所有")+"]";
    	}
    	else{
    		text="过滤";
    	}
    	btn.setText(text);
    },
    
    onBtnOther2: function (btn) {

    },

    onBtnOther3: function (btn) {

    },

    onBtnOther4: function (btn) {

    },

    onBtnOther5: function (btn) {

    },

    //endregion 工具栏按钮事件结束

    //region网格事件控制开始

    /*选择行之前*/
    onGridBeforeSelect: function (sender, e, index, eOpts) {
             console.info("onGridBeforeSelect");
    },

    /*选择变化之后,重新绑定从表记录及更改按钮状态*/
    onGridSelectionChange: function (sender, e, index, eOpts) {
    	 console.info("onGridSelectionChange");
        this.gridSelectionChange(sender, e);
    },

    /*编辑之前，控制主键不可更改*/
    onGridBeforeEdit: function (sender, e) {
    	console.info("onGridBeforeEdit");
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('mastergrid'), e) === false) return false;
    },

    /*编辑之后*/
    onGridAfterEdit: function (editor, e) {
    	console.info("onGridAfterEdit");
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('mastergrid'), e);
    },

    /*数据更改之后*/
    onGridDataChanged: function (store) {
    	console.info("onGridDataChanged");
        this.gridDataChanged(store, 'mastergrid');
    },

    /*加载数据之前 判断是否可以加载数据，当有在编辑时，不能加载数据*/
    onGridBeforeLoad: function (store, opts) {
    	console.info("onGridBeforeLoad");
        var me = this,
         searchform = this.getObj('commonsearch');
        if (searchform && !searchform.isValid())  return false;
        if (me.gridIsCanLoad(store, 'mastergrid') === false) return false;
    },

    //加载数据之后(重新绑定从表)
    onGridLoaded: function (store, records, isOk, options) {
    	console.info("onGridLoaded");
        var me = this, idx, idValue = me._idValue,
            grid = me.getObj('mastergrid'),
            keyfield = grid.primaryKey;

        me.setSizeColsOnLoad(grid, store, options);

        if (idValue) {
            idx = Ext.Array.findBy(records, function (item) {
                return item.get(keyfield) == idValue;
            });
            me._idValue = '';
        }
        if (idx) {
            grid.getSelectionModel().select(idx);
        } else {
            me.bindSubGrid(grid);
        }
    },

    onGridRowDblClick: function (view, record, tr, rowIndex, e) {
    	console.info("onGridRowDblClick");

    },

    //设置当前对象为活动对象
    onGirdActivate: function (view, e) {
        this.workObject = view.grid;
    },

    /*初始化网格样式*/
    initGridCls: function (objlist) {
        var me = this,
            g, tmp = '';

        objlist = objlist || me.getObjList();
        console.info("*****************")
        console.info(this)
        console.info("*****************")
        for (g = 0; g < 10; g++) {
            if (g == 0) {
                tmp = 'mastergrid';
            } else {
                tmp = 'grid' + g;
            }
            if (!objlist[tmp]) continue;
            me.gridHeadCls(objlist[tmp]);
        }
    },

    //endregion网格事件控制结束

    /**初始化按钮*/
    initToolbar: function (objList) {
        var me = this,isShowFilter=true;
        if (objList.btnAdd) {
            objList.btnAdd.setVisible(me.canAdd());
        }

        if (objList.btnPrint) {
            objList.btnPrint.setVisible(me.canPrint());
        }

        if (objList.btnExport) {
            objList.btnExport.setVisible(me.canExport());
        }

        if (objList.btnDelete) {
           objList.btnDelete.setVisible(me.canDelete());
        }

        if (objList.commonsearch) {
            var list = objList.commonsearch.query('textfield,numberfield,datefield,combo');
            Ext.each(list, function (txt) {
                txt.on('specialkey', me.keyToSearch, me);
                txt.on('afterrender', function () {
                    if (txt.labelEl) {
                        txt.labelEl.on('dblclick', function () {
                            txt.setValue('');
                        });
                    }
                });
            });
        }
        if (!objList.commonsearch && objList.btnReset) {
        	
            objList.btnReset.setVisible(false);
        }
        me.initBtnAudit(objList);
        console.info("junqingjiema");
        objList.btnFilter.setVisible(isShowFilter);
       // objList.btnFilter.setDisabled(true);
        //关闭网格过滤
        me.workObject.setFilterStatus(false);
       // me.workObject.isFilter=false;
       // me.workObject.removeCls("grid-filter-hide");
       // me.workObject.addCls("grid-filter-hide");
        //初始化过滤文本
        me._setBtnFilterText(objList.btnFilter);
        
    },

    /**设置label样式，且双击清除数据*/
    setLabelCls: function () {
        var list = this.view.query('textfield,numberfield,datefield,combo');
        Ext.each(list, function (txt) {
            if (txt.fieldLabel) {
                txt.on('afterrender', function () {
                    if (txt.labelEl) {
                    	var form=this.up("form");
                    	
                        if (txt.allowBlank === false) {
                            txt.labelEl.addCls('notnull-field');
                        }
                      //判断是否为单据
                        else if(form&&form.reference==="commonbill"&&txt.canInput!=false){
                        	
                        	txt.labelEl.addCls('cannull-field');
                        }
                        else if(!form&&txt.canInput!=false&&txt.readOnly!=true){
                        	txt.labelEl.addCls('cannull-field');
                        }
                    }
                });
            }
        });
    },


    initBtnAudit:function(objlist) {
        var me = this,
            btnAudit = objlist['btnAudit'];

        if (!btnAudit)return;
        btnAudit.setVisible(false);
        if (!me.canAudit()) return;

        if (objlist['matergrid'] && objlist['matergrid'].auditUrl) {
            btnAudit.setVisible(true);
            return;
        }

        for (var i = 1; i < 10; i++) {
            if (objlist['grid' + i] && objlist['grid' + i].auditUrl) {
                btnAudit.setVisible(true);
                break;
            }
        }
    }

});

/**
 * Description: 单表模块基类ViewModel
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BaseSimplePageModel',{
    extend:'Hc_Common.view.BasePageModel',
    alias:'viewmodel.basesimplepage',

    data:{
        gridRow:null
    }

});

/**
 * Description: 多表基类，继承于单表
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BaseMultiPage', {
    extend: 'Hc_Common.view.BaseSimplePage',

    controller: 'basemultipage',

    viewModel: {
        type: 'basemultipage'
    },

    //是否自定义布局, 默认为系统自动布局
    customLayout1: false,

    gridSelModel: 'SINGLE',
    gridCanDeSelect: false,
    gridIsMaster: true,

    grid1Columns: [],
    grid1Model: '',
    grid1PrimaryKey: '',
    grid1UnionKey: '',

    grid1LoadUrl: '',
    grid1ExportUrl: '',
    grid1ImportUrl: '',

    /**查看日志属性**/
    grid1LogWinTitle: '',	//日志弹窗标题
    grid1LogLoadUrl: '',		//日志网格加载url

    grid1ReadOnly: false,
    grid1CanAdd: true,
    grid1CandDelete: true,
    grid1CanEdit: true,
    grid1EditModel: 'cell',
    grid1AutoLoad: false,
    grid1Title: '',
    grid1Region: 'center',
    grid1SupGrid: '',
    grid1SubGrid: [],
    grid1EditColumn: 0,
    grid1EditItems: [],

    //物料尺码
    grid1MSizeIdx: -1,
    grid1SizeInputType: 'number',

    grid1HasMark: true,
    grid1HasCreator: false,
    grid1HasModifier: false,
    grid1HasAuditor: false,

    grid1: {
        xtype: 'grid',
        reference: 'grid1'
    },


    grid2Columns: [],
    grid2Model: '',
    grid2PrimaryKey: '',
    grid2UnionKey: '',

    grid2LoadUrl: '',
    grid2ExportUrl: '',
    grid2ImportUrl: '',

    /**查看日志属性**/
    grid2LogWinTitle: '',	//日志弹窗标题
    grid2LogLoadUrl: '',		//日志网格加载url

    grid2ReadOnly: false,
    grid2CanAdd: true,
    grid2CandDelete: true,
    grid2CanEdit: true,
    grid2EditModel: 'cell',
    grid2Title: '',
    grid2Region: 'center',
    grid2SupGrid: '',
    grid2SubGrid: [],
    grid2EditColumn: 0,
    grid2EditItems: [],

    //物料尺码
    grid2MSizeIdx: -1,
    grid2SizeInputType: 'number',

    grid2HasMark: true,
    grid2HasCreator: false,
    grid2HasModifier: false,
    grid2HasAuditor: false,

    grid2: {
        xtype: 'grid',
        reference: 'grid2'
    },

    grid3Columns: [],
    grid3Model: '',
    grid3PrimaryKey: '',
    grid3UnionKey: '',

    grid3LoadUrl: '',
    grid3ExportUrl: '',
    grid3ImportUrl: '',

    /**查看日志属性**/
    grid3LogWinTitle: '',	//日志弹窗标题
    grid3LogLoadUrl: '',		//日志网格加载url

    grid3ReadOnly: false,
    grid3CanAdd: true,
    grid3CandDelete: true,
    grid3CanEdit: true,
    grid3EditModel: 'cell',
    grid3Title: '',
    grid3Region: 'center',
    grid3SupGrid: '',
    grid3SubGrid: [],
    grid3EditColumn: 0,
    grid3EditItems: [],

    //物料尺码
    grid3MSizeIdx: -1,
    grid3SizeInputType: 'number',

    grid3HasMark: true,
    grid3HasCreator: false,
    grid3HasModifier: false,
    grid3HasAuditor: false,

    grid3: {
        xtype: 'grid',
        reference: 'grid3'
    },

    grid4Columns: [],
    grid4Model: '',
    grid4PrimaryKey: '',
    grid4UnionKey: '',

    grid4LoadUrl: '',
    grid4ExportUrl: '',
    grid4ImportUrl: '',
    /**查看日志属性**/
    grid4LogWinTitle: '',	//日志弹窗标题
    grid4LogLoadUrl: '',		//日志网格加载url

    grid4ReadOnly: false,
    grid4CanAdd: true,
    grid4CandDelete: true,
    grid4CanEdit: true,
    grid4EditModel: 'cell',
    grid4Title: '',
    grid4Region: 'center',
    grid4SupGrid: '',
    grid4SubGrid: [],
    grid4EditColumn: 0,
    grid4EditItems: [],

    //物料尺码
    grid4MSizeIdx: -1,
    grid4SizeInputType: 'number',

    grid4HasMark: true,
    grid4HasCreator: false,
    grid4HasModifier: false,
    grid4HasAuditor: false,

    grid4: {
        xtype: 'grid',
        reference: 'grid4'
    },

    grid5Columns: [],
    grid5Model: '',
    grid5PrimaryKey: '',
    grid5UnionKey: '',

    grid5LoadUrl: '',
    grid5ExportUrl: '',
    grid5ImportUrl: '',
    /**查看日志属性**/
    grid5LogLoadUrl: '',	//日志弹窗标题
    grid5LogLoadUrl: '',		//日志网格加载url

    grid5ReadOnly: false,
    grid5CanAdd: true,
    grid5CandDelete: true,
    grid5CanEdit: true,
    grid5EditModel: 'cell',
    grid5Title: '',
    grid5Region: 'center',
    grid5SupGrid: '',
    grid5SubGrid: [],
    grid5EditColumn: 0,
    grid5EditItems: [],

    //物料尺码
    grid5MSizeIdx: -1,
    grid5SizeInputType: 'number',

    grid5HasMark: true,
    grid5HasCreator: false,
    grid5HasModifier: false,
    grid5HasAuditor: false,

    grid5: {
        xtype: 'grid',
        reference: 'grid5'
    },

    grid6Columns: [],
    grid6Model: '',
    grid6PrimaryKey: '',
    grid6UnionKey: '',

    grid6LoadUrl: '',
    grid6ExportUrl: '',
    grid6ImportUrl: '',
    /**查看日志属性**/
    grid6LogWinTitle: '',	//日志弹窗标题
    grid6LogLoadUrl: '',		//日志网格加载url

    grid6ReadOnly: false,
    grid6CanAdd: true,
    grid6CandDelete: true,
    grid6CanEdit: true,
    grid6EditModel: 'cell',
    grid6Title: '',
    grid6Region: 'center',
    grid6SupGrid: '',
    grid6SubGrid: [],
    grid6EditColumn: 0,
    grid6EditItems: [],

    //物料尺码
    grid6MSizeIdx: -1,
    grid6SizeInputType: 'number',

    grid6HasMark: true,
    grid6HasCreator: false,
    grid6HasModifier: false,
    grid6HasAuditor: false,

    grid6: {
        xtype: 'grid',
        reference: 'grid6'
    },

    grid7Columns: [],
    grid7Model: '',
    grid7PrimaryKey: '',
    grid7UnionKey: '',

    grid7LoadUrl: '',
    grid7ExportUrl: '',
    grid7ImportUrl: '',
    /**查看日志属性**/
    grid7LogWinTitle: '',	//日志弹窗标题
    grid7LogLoadUrl: '',		//日志网格加载url

    grid7ReadOnly: false,
    grid7CanAdd: true,
    grid7CandDelete: true,
    grid7CanEdit: true,
    grid7EditModel: 'cell',
    grid7Title: '',
    grid7Region: 'center',
    grid7SupGrid: '',
    grid7SubGrid: [],
    grid7EditColumn: 0,
    grid7EditItems: [],

    //物料尺码
    grid7MSizeIdx: -1,
    grid7SizeInputType: 'number',

    grid7HasMark: true,
    grid7HasCreator: false,
    grid7HasModifier: false,
    grid7HasAuditor: false,

    grid7: {
        xtype: 'grid',
        reference: 'grid7'
    },

    grid8Columns: [],
    grid8Model: '',
    grid8PrimaryKey: '',
    grid8UnionKey: '',

    grid8LoadUrl: '',
    grid8ExportUrl: '',
    grid8ImportUrl: '',
    /**查看日志属性**/
    gri8LogWinTitle: '',	//日志弹窗标题
    grid8LogLoadUrl: '',		//日志网格加载url

    grid8ReadOnly: false,
    grid8CanAdd: true,
    grid8CandDelete: true,
    grid8CanEdit: true,
    grid8EditModel: 'cell',
    grid8Title: '',
    grid8Region: 'center',
    grid8SupGrid: '',
    grid8SubGrid: [],
    grid8EditColumn: 0,
    grid8EditItems: [],

    //物料尺码
    grid8MSizeIdx: -1,
    grid8SizeInputType: 'number',

    grid8HasMark: true,
    grid8HasCreator: false,
    grid8HasModifier: false,
    grid8HasAuditor: false,

    grid8: {
        xtype: 'grid',
        reference: 'grid8'
    },

    grid9Columns: [],
    grid9Model: '',
    grid9PrimaryKey: '',
    grid9UnionKey: '',

    grid9LoadUrl: '',
    grid9ExportUrl: '',
    grid9ImportUrl: '',
    /**查看日志属性**/
    grid9LogWinTitle: '',	//日志弹窗标题
    grid9LogLoadUrl: '',		//日志网格加载url

    grid9ReadOnly: false,
    grid9CanAdd: true,
    grid9CandDelete: true,
    grid9CanEdit: true,
    grid9EditModel: 'cell',
    grid9Title: '',
    grid9Region: 'center',
    grid9SupGrid: '',
    grid9SubGrid: [],
    grid9EditColumn: 0,
    grid9EditItems: [],

    //物料尺码
    grid9MSizeIdx: -1,
    grid9SizeInputType: 'number',

    grid9HasMark: true,
    grid9HasCreator: false,
    grid9HasModifier: false,
    grid9HasAuditor: false,

    grid9: {
        xtype: 'grid',
        reference: 'grid9'
    },

    //导入导出开始

    //导入服务传输字段定义
    grid1colNames: '',
    grid1mustArray: '',
    grid1isValidateAll: '',
    grid1mainKey: '',
    grid1validationConditions: '',
    //导出服务
    grid1fileName: '',
    grid1fileType: '',
    grid1exportColumns: '',


    grid2colNames: '',
    grid2mustArray: '',
    grid2isValidateAll: '',
    grid2mainKey: '',
    grid2validationConditions: '',

    grid2fileName: '',
    grid2fileType: '',
    grid2exportColumns: '',


    grid3colNames: '',
    grid3mustArray: '',
    grid3isValidateAll: '',
    grid3mainKey: '',
    grid3validationConditions: '',

    grid3fileName: '',
    grid3fileType: '',
    grid3exportColumns: '',

    grid4colNames: '',
    grid4mustArray: '',
    grid4isValidateAll: '',
    grid4mainKey: '',
    grid4validationConditions: '',

    grid4fileName: '',
    grid4fileType: '',
    grid4exportColumns: '',

    grid5colNames: '',
    grid5mustArray: '',
    grid5isValidateAll: '',
    grid5mainKey: '',
    grid5validationConditions: '',

    grid5fileName: '',
    grid5fileType: '',
    grid5exportColumns: '',

    grid6colNames: '',
    grid6mustArray: '',
    grid6isValidateAll: '',
    grid6mainKey: '',
    grid6validationConditions: '',

    grid6fileName: '',
    grid6fileType: '',
    grid6exportColumns: '',

    grid7colNames: '',
    grid7mustArray: '',
    grid7isValidateAll: '',
    grid7mainKey: '',
    grid7validationConditions: '',

    grid7fileName: '',
    grid7fileType: '',
    grid7exportColumns: '',

    grid8colNames: '',
    grid8mustArray: '',
    grid8isValidateAll: '',
    grid8mainKey: '',
    grid8validationConditions: '',

    grid8fileName: '',
    grid8fileType: '',
    grid8exportColumns: '',

    grid9colNames: '',
    grid9mustArray: '',
    grid9isValidateAll: '',
    grid9mainKey: '',
    grid9validationConditions: '',

    grid9fileName: '',
    grid9fileType: '',
    grid9exportColumns: '',

    //导入导出结束

    //是否将SizeCode转为SizeNo
    grid1MConvertSize: 0,
    grid2MConvertSize: 0,
    grid3MConvertSize: 0,
    grid4MConvertSize: 0,
    grid5MConvertSize: 0,
    grid6MConvertSize: 0,
    grid7MConvertSize: 0,
    grid8MConvertSize: 0,
    grid9MConvertSize: 0,
    grid1HasOrderNo: true,
    grid2HasOrderNo: true,
    grid3HasOrderNo: true,
    grid4HasOrderNo: true,
    grid5HasOrderNo: true,
    grid6HasOrderNo: true,
    grid7HasOrderNo: true,
    grid8HasOrderNo: true,
    grid9HasOrderNo: true,

    grid1MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid1MSizeQtyField: 'sizeQty',
    grid1MSizeFillField: 'materialName,sizeTypeNo',

    grid2MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid2MSizeQtyField: 'sizeQty',
    grid2MSizeFillField: 'materialName,sizeTypeNo',

    grid3MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid3MSizeQtyField: 'sizeQty',
    grid3MSizeFillField: 'materialName,sizeTypeNo',

    grid4MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid4MSizeQtyField: 'sizeQty',
    grid4MSizeFillField: 'materialName,sizeTypeNo',

    grid5MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid5MSizeQtyField: 'sizeQty',
    grid5MSizeFillField: 'materialName,sizeTypeNo',

    grid6MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid6MSizeQtyField: 'sizeQty',
    grid6MSizeFillField: 'materialName,sizeTypeNo',

    grid7MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid7MSizeQtyField: 'sizeQty',
    grid7MSizeFillField: 'materialName,sizeTypeNo',

    grid8MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid8MSizeQtyField: 'sizeQty',
    grid8MSizeFillField: 'materialName,sizeTypeNo',

    grid9MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid9MSizeQtyField: 'sizeQty',
    grid9MSizeFillField: 'materialName,sizeTypeNo',


    initComponent: function () {
        var me = this,
            editp1 = {
                ptype: 'cellediting',
                clicksToEdit: 1
            }, editp2 = {
                ptype: 'rowediting',
                clicksToEdit: 2
            }, gridItems = [];

        me.customLayout = true;

        for (var i = 1; i < 10; i++) {
            if (me['grid' + i + 'Model']) {

                if (me['grid' + i + 'ReadOnly']) {
                    me['grid' + i + 'CanAdd'] = false;
                    me['grid' + i + 'CanDelete'] = false;
                    me['grid' + i + 'CanEdit'] = false;
                } else if (!me['grid' + i + 'CanAdd'] && !me['grid' + i + 'CanDelete'] && !me['grid' + i + 'CanEdit']) {
                    me['grid' + i + 'ReadOnly'] = true;
                }

                if (me['grid' + i + 'EditModel'] == "cell") {
                    me['grid' + i].plugins = editp1;
                } else if (me['grid' + i + 'EditModel'] == "row") {
                    me['grid' + i].plugins = editp2;
                } else {
                    delete me['grid' + i].plugins;
                }

                var gCols = Hc.clone(me['grid' + i + 'Columns']);

                if (me.pageType == 'billDetail' && me['grid' + i + 'HasOrderNo']) {
                    gCols = [
                        {text: '序号', dataIndex: 'orderNo'}
                    ].concat(gCols);
                }

                if (me['grid' + i + 'HasMark']) {
                    var mCols = {text: '备注', dataIndex: 'remarks'};
                    if (!me['grid' + i + 'ReadOnly']) mCols.editor = true;
                    gCols.push(mCols);
                }
                if (me['grid' + i + 'HasCreator']) {
                    gCols = gCols.concat([
                        {text: '创建人', dataIndex: 'creator', width: 80},
                        {text: '创建时间', dataIndex: 'createTime', width: 140}
                    ]);
                }
                if (me['grid' + i + 'HasModifier']) {
                    gCols = gCols.concat([
                        {text: '修改人', dataIndex: 'modifier', width: 80},
                        {text: '修改时间', dataIndex: 'modifyTime', width: 140}
                    ]);
                }
                if (me['grid' + i + 'HasAuditor']) {
                    gCols = gCols.concat([
                        {dataIndex: 'auditor', text: '审核人', width: 80},
                        {dataIndex: 'auditTime', text: '审核时间', width: 140}
                    ]);
                }

                if (me['grid' + i + 'MSizeIdx'] > -1) {
                    Ext.Array.insert(gCols, me['grid' + i + 'MSizeIdx'], [{
                        text: '物料尺码信息',
                        mSizeCol: true
                    }]);
                }

                var store = Ext.create('Hc_Common.store.Base', {
                    autoLoad: false,
                    pageSize: me.pageSize,
                    model: me["grid" + i + "Model"],
                    proxy: {
                        url: me["grid" + i + "LoadUrl"]
                    }
                });

                Ext.apply(me['grid' + i], {
                    columnLines: true,
                    columns: gCols,
                    vcolumn: gCols,
                    layout: 'fit',
                    store: store,
                    selModel: {
                        mode: 'MULTI',
                        allowDeselect: true
                    },
                    bbar: {
                        xtype: 'pagingtoolbar',
                        plugins: Ext.create('Ext.ux.ComboPageSize', {defaultSize: me.pageSize}),
                        displayInfo: true,
                        store: store
                    },
                    viewConfig: {
                        enableTextSelection: true
                    },
                    region: me['grid' + i + 'Region'],
                    modelName: me['grid' + i + 'Model'],
                    editModel: me["grid" + i + "EditModel"],
                    isCanAdd: me["grid" + i + "CanAdd"],
                    isCanEdit: me["grid" + i + "CanEdit"],
                    isCanDelete: me["grid" + i + "CandDelete"],
                    isReadOnly: me["grid" + i + "ReadOnly"],
                    exportUrl: me["grid" + i + "ExportUrl"],
                    importUrl: me["grid" + i + "ImportUrl"],
                    primaryKey: me["grid" + i + "PrimaryKey"],
                    unionKey: me["grid" + i + "UnionKey"],
                    supGrid: me['grid' + i + 'SupGrid'],
                    subGrid: me['grid' + i + 'SubGrid'],
                    hasOrderNo: me['grid' + i + 'HasOrderNo'],

                    mSizeIdx: me['grid' + i + 'MSizeIdx'],

                    mSizeUrl: me['grid' + i + 'MSizeUrl'],
                    mSizeQtyField: me['grid' + i + 'MSizeQtyField'],
                    mSizeFillFields: me['grid' + i + 'MSizeFillField'],

                    sizeInputType: me['grid' + i + 'SizeInputType'],
                    convertToSize: me["grid" + i + "MConvertSize"],

                    //导入服务传输字段定义
                    colNames: me['grid' + i + 'colNames'],
                    mustArray: me['grid' + i + 'mustArray'],
                    isValidateAll: me['grid' + i + 'isValidateAll'],
                    mainKey: me['grid' + i + 'mainKey'],
                    validationConditions: me['grid' + i + 'validationConditions'],

                    //导出服务
                    fileName: me['grid' + i + 'fileName'],
                    fileType: me['grid' + i + 'fileType'],
                    exportColumns: me['grid' + i + 'exportColumns'],

                    //查看日志
                    logWinTitle: me['grid' + i + 'LogWinTitle'],
                    logLoadUrl: me['grid' + i + 'LogLoadUrl']
                });

                if (me['grid' + i + 'Title']) {
                    me['grid' + i].title = me['grid' + i + 'Title'];
                } else {
                    delete me['grid' + i].title
                }
                gridItems.push(me['grid' + i]);
            }
        }
        me.bottomPanel = {
            xtype: "tabpanel",
            region: 'south',
            reference: 'commonbottompanel',
            height: me.controller.getBodyHeight(0.5),
            split: true,
            autoDestroy: true,
            tabPosition: 'top',
            border: false
        };
        if (!me.customLayout1) {
            me.items = [me.toolbar];
            if (me.searchItems.length > 0) {
                me.items.push(me.searchPanel);
            }
            me.items.push(me.grid);
            me.bottomPanel.items = gridItems;
            if (gridItems.length == 1) {
                me.bottomPanel.xtype = 'container';
                me.bottomPanel.layout = 'border';
                delete gridItems[0].title;
            }
            me.items.push(me.bottomPanel);
            me.otherItems = me.otherItems || [];
            me.items = me.items.concat(me.otherItems);
        }
        me.callParent(arguments);
    }
});

/**
 * Description: 多表基类控制器，主要控制当前活动的grid 及grid之前的联动、批量保存主从表
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BaseMultiPageController', {
    extend: 'Hc_Common.view.BaseSimplePageController',

    alias: 'controller.basemultipage',

    init: function () {
        var me = this,
            canEditData = this.canAdd() || this.canEdit() || this.canDelete(),
            objList = me.getReferences();

        me.callParent(arguments);

        try {

            if (!objList) return;

            objList.mastergrid.on('containerclick', me.onGirdActivate, me);
            objList.mastergrid.on('cellclick', me.onGirdActivate, me);
            objList.mastergrid.on('headerclick', me.onGirdActivate, me);

            for (var i = 1; i < 10; i++) {
                if (objList['grid' + i]) {

                    //绑定选择之前及选择之后
                    objList["grid" + i].on('beforeselect', me["onGrid" + i + "BeforeSelect"], me);
                    objList["grid" + i].on('selectionchange', me["onGrid" + i + "SelectionChange"], me);


                    //绑定活动（得到焦点）
                    objList["grid" + i].on('containerclick', me.onGirdActivate, me);
                    objList["grid" + i].on('cellclick', me.onGirdActivate, me);
                    objList["grid" + i].on('headerclick', me.onGirdActivate, me);

                    //绑定编辑之前之后
                    objList["grid" + i].on('beforeedit', me["onGrid" + i + "BeforeEdit"], me);
                    objList["grid" + i].on('edit', me["onGrid" + i + "AfterEdit"], me);


                    //绑定数据更新之后
                    objList["grid" + i].store.on('update', me["onGrid" + i + "DataChanged"], me);
                    objList["grid" + i].store.on('datachanged', me["onGrid" + i + "DataChanged"], me);

                    objList["grid" + i].store.on('beforeload', me["onGrid" + i + "BeforeLoad"], me);
                    objList["grid" + i].store.on('load', me["onGrid" + i + "Loaded"], me);
                    objList["grid" + i].on('dblclick', me["onGrid" + i + "RowDblClick"], me);

                    if (!objList['grid' + i].isReadOnly && canEditData) {
                        objList['grid' + i].view.getRowClass = this.initRowClass;
                    }
                }
            }
        } catch (e) {
        }
    },

    //region按钮事件开始

    initAddData: function (newObj) {
        var me = this,
            objlist = me.getObjList(),
            obj = me.workObject;

        if (obj.isMaster && me.editingList.length > 0) {
            Hc.alert('有一笔数据正在编辑，不能新增主表记录');
            return false;
        }
        if (obj.supGrid) {
            var item = objlist[obj.supGrid].getSelection()[0];
            if (!item) {
                Hc.alert('主表没有选中记录时，从表不能新增记录');
                return false;
            }
            if (!item.phantom) {
                var idField = objlist[obj.supGrid].primaryKey;
                newObj.set(idField, item.get(idField));
            }
        }
    },

    onBtnSearchClick: function (btn) {
        var me = this,
            objs = me.getObjList(),
            grid = objs.mastergrid,
            store = grid.store,
            searchPanel = objs.commonsearch;
        if (searchPanel) {
            var formValue = searchPanel.getValues();
            for (var field in formValue) {
                if (formValue[field] !== '') {
                    store.proxy.extraParams[field] = formValue[field];
                } else {
                    delete   store.proxy.extraParams[field]
                }
            }
        }
        if (me.beforeSearch(store) === false) return;
        store.currentPage = 1;
        store.loadPage(1);
    },

    onBtnSaveClick: function (btn) {
        var me = this, param = {},
            grid = me.getObj('mastergrid');

        if (me.editingList.length < 1)return;

        param = me.getDataToSave(grid);

        if (!param)return;

        if (me.beforeSave(param) === false)return;
        me.saveData({srcObj: grid, data: param, btn: btn});
    },

    //endregion按钮事件结束

    //region 主表grid控制开始
    /*主表在选择记录之前，先判断页面是否有更改，如有更改不能选择其它记录*/
    onGridBeforeSelect: function (sender, e, index, eOpts) {
        var me = this;
        if (sender.view.grid.isMaster && me.editingList.length > 0
            && !(e.phantom || e.dirty))
            return false;
        if (me.callParent(arguments) === false)return false;
    },

    onGridBeforeEdit: function (sender, e) {
        var me = this;
        if (me.callParent(arguments) === false)return false;
        if (e.grid.isMaster && this.editingList.length > 0
            && !e.grid.getSelectionModel().isSelected(e.rowIdx))
            return false;
    },

    //endregion  主表grid控制结束

    //region第1个从表控制开始


    //TODO 第1个从表选择之前
    onGrid1BeforeSelect: function (sender, e, index) {

    },
    //TODO 第1个从表选择变化时
    onGrid1SelectionChange: function (sender, e, index) {
        var me = this;
        me.gridSelectionChange(sender, e);
    },
    //TODO 第1个从表编辑之前
    onGrid1BeforeEdit: function (editor, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid1'), e) === false) return false;
    },
    //TODO 第1个从表编辑之前
    onGrid1AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid1'), e);
    },
    //TODO 第1个从表数据变更之后
    onGrid1DataChanged: function (store, records) {
        var me = this;
        me.gridDataChanged(store, 'grid1');
    },
    //TODO 第1个从表加载数据之前(判断是否能加载数据)
    onGrid1BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid1') === false) return false;

    },
    //TODO 第1个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid1Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid1');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第1个从表双击事件
    onGrid1RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第1个从表控制结束

    //region第2个从表控制开始
    //TODO 第2个从表选择之前
    onGrid2BeforeSelect: function (sender, e, index) {

    },
    //TODO 第2个从表选择变化时
    onGrid2SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第2个从表编辑之前
    onGrid2BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid2'), e) === false) return false;
    },
    //TODO 第2个从表编辑之前
    onGrid2AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid2'), e);
    },

    //TODO 第2个从表数据变更之后
    onGrid2DataChanged: function (store, records) {
        this.gridDataChanged(store, 'grid2');
    },
    //TODO 第2个从表加载数据之前(判断是否能加载数据)
    onGrid2BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid2') === false) return false;
    },
    //TODO 第2个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid2Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid2');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第2个从表双击事件
    onGrid2RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第2个从表控制结束

    //region第3个从表控制开始
    //TODO 第3个从表选择之前
    onGrid3BeforeSelect: function (sender, e, index) {

    },
    //TODO 第3个从表选择变化时
    onGrid3SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第3个从表编辑之前
    onGrid3BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid3'), e) === false) return false;
    },
    //TODO 第3个从表编辑之前
    onGrid3AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid3'), e);
    },

    //TODO 第3个从表数据变更之后
    onGrid3DataChanged: function (store, records) {
        this.gridDataChanged(store, 'grid3');
    },
    //TODO 第3个从表加载数据之前(判断是否能加载数据)
    onGrid3BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid3') === false) return false;
    },
    //TODO 第3个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid3Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid3');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第3个从表双击事件
    onGrid3RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第3个从表控制结束

    //region第4个从表控制开始
    //TODO 第4个从表选择之前
    onGrid4BeforeSelect: function (sender, e, index) {

    },
    //TODO 第4个从表选择变化时
    onGrid4SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第4个从表编辑之前
    onGrid4BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid4'), e) === false) return false;
    },
    //TODO 第4个从表编辑之前
    onGrid4AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid4'), e);
    },

    //TODO 第4个从表数据变更之后
    onGrid4DataChanged: function (store, records) {
        this.gridDataChanged(store, 'grid4');
    },
    //TODO 第4个从表加载数据之前(判断是否能加载数据)
    onGrid4BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid4') === false) return false;
    },
    //TODO 第4个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid4Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid4');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第4个从表双击事件
    onGrid4RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第4个从表控制结束

    //region第5个从表控制开始
    //TODO 第5个从表选择之前
    onGrid5BeforeSelect: function (sender, e, index) {

    },
    //TODO 第5个从表选择变化时
    onGrid5SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第5个从表编辑之前
    onGrid5BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid5'), e) === false) return false;
    },
    //TODO 第5个从表编辑之前
    onGrid5AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid5'), e);
    },

    //TODO 第5个从表数据变更之后
    onGrid5DataChanged: function (store, records) {
        var me = this;
        me.gridDataChanged(store, me.getObj('grid5'));
    },
    //TODO 第5个从表加载数据之前(判断是否能加载数据)
    onGrid5BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid5') === false) return false;
    },
    //TODO 第5个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid5Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid5');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第5个从表双击事件
    onGrid5RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第5个从表控制结束

    //region第6个从表控制开始
    //TODO 第6个从表选择之前
    onGrid6BeforeSelect: function (sender, e, index) {


    },
    //TODO 第6个从表选择变化时
    onGrid6SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第6个从表编辑之前
    onGrid6BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid6'), e) === false) return false;
    },
    //TODO 第6个从表编辑之前
    onGrid6AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid6'), e);
    },

    //TODO 第6个从表数据变更之后
    onGrid6DataChanged: function (store, records) {
        var me = this;
        me.gridDataChanged(store, me.getObj('grid6'));
    },
    //TODO 第6个从表加载数据之前(判断是否能加载数据)
    onGrid6BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid6') === false) return false;
    },
    //TODO 第6个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid6Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid6');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第6个从表双击事件
    onGrid6RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第6个从表控制结束

    //region第7个从表控制开始
    //TODO 第7个从表选择之前
    onGrid7BeforeSelect: function (sender, e, index) {

    },
    //TODO 第7个从表选择变化时
    onGrid7SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第7个从表编辑之前
    onGrid7BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid7'), e) === false) return false;
    },
    //TODO 第7个从表编辑之前
    onGrid7AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid7'), e);
    },

    //TODO 第7个从表数据变更之后
    onGrid7DataChanged: function (store, records) {
        var me = this;
        me.gridDataChanged(store, me.getObj('grid7'));
    },
    //TODO 第7个从表加载数据之前(判断是否能加载数据)
    onGrid7BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid7') === false)  return false;
    },
    //TODO 第7个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid7Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid7');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第7个从表双击事件
    onGrid7RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第7个从表控制结束

    //region第8个从表控制开始
    //TODO 第8个从表选择之前
    onGrid8BeforeSelect: function (sender, e, index) {

    },
    //TODO 第8个从表选择变化时
    onGrid8SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第8个从表编辑之前
    onGrid8BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid8'), e) === false) return false;
    },
    //TODO 第8个从表编辑之前
    onGrid8AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid8'), e);
    },

    //TODO 第8个从表数据变更之后
    onGrid8DataChanged: function (store, records) {
        this.gridDataChanged(store, 'grid8');
    },
    //TODO 第8个从表加载数据之前(判断是否能加载数据)
    onGrid8BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid8') === false) return false;
    },
    //TODO 第8个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid8Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid8');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第8个从表双击事件
    onGrid8RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第8个从表控制结束

    //region第9个从表控制开始
    //TODO 第9个从表选择之前
    onGrid9BeforeSelect: function (sender, e, index) {

    },
    //TODO 第9个从表选择变化时
    onGrid9SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第9个从表编辑之前
    onGrid9BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid9'), e) === false) return false;
    },
    //TODO 第9个从表编辑之前
    onGrid9AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid9'), e);
    },

    //TODO 第9个从表数据变更之后
    onGrid9DataChanged: function (store, records) {
        this.gridDataChanged(store, 'grid9');
    },
    //TODO 第9个从表加载数据之前(判断是否能加载数据)
    onGrid9BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid9') === false) return false;
    },
    //TODO 第9个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid9Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid9');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第9个从表双击事件
    onGrid9RowDblClick: function (view, record, tr, rowIndex, e) {

    }

    //endregion第9个从表控制结束

});

/**
 * Description: 多表基类ViewModel
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BaseMultiPageModel', {
    extend: 'Hc_Common.view.BaseSimplePageModel',
    alias: 'viewmodel.basemultipage',
    data: {
        grid1Row: null,
        grid2Row: null,
        grid3Row: null,
        grid4Row: null,
        grid5Row: null,
        grid6Row: null,
        grid7Row: null,
        grid8Row: null,
        grid9Row: null
    }
});

/**
 * Description:
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BaseTreePage', {
    extend: 'Hc_Common.view.BasePage',

    controller: 'basetreepage',

    viewModel: {
        type: 'basetreepage'
    },

    layout: 'border',


    toolbar: {
        xtype: 'toolbar',
        itemId: 'commontoolbar',
        reference: 'commontoolbar',
        region: 'north',
        items: [{
            text: '查询',
            itemId: 'btnSearch',
            handler: 'onBtnSearchClick',
            glyph: Hc.Icon.btnSearch

        }, {
            text: '重置',
            itemId: 'btnReset',
            handler: 'onBtnResetClick',
            glyph: Hc.Icon.btnReset

        },'-', {
            xtype: 'splitbutton',
            text: '新增',
            itemId: 'btnAdd',
            reference:'btnAdd',
            handler: 'onBtnAddClick',
            glyph: Hc.Icon.btnAdd,
            menu: [{
                text: '新增下级',
                itemId: 'btnAddChild',
                reference:'btnAddChild',
                handler: 'onAddChildClick'
            }]
        }, {
            text: '更改',
            itemId: 'btnEdit',
            reference:'btnEdit',
            handler: 'onBtnEditClick',
            glyph: Hc.Icon.btnEdit,
            disabled: true
        }, {
            text: '删除',
            itemId: 'btnDelete',
            reference:'btnDelete',
            handler: 'onBtnDeleteClick',
            glyph: Hc.Icon.btnDelete,
            disabled: true
        },'-', {
                text: '上移',
                itemId: 'btnMoveUp',
                reference:'btnMoveUp',
                handler: 'onBtnMoveUpClick',
                glyph: Hc.Icon.btnMoveUp,
                disabled: true
            }, {
                text: '下移',
                itemId: 'btnMoveDown',
                reference:'btnMoveDown',
                handler: 'onBtnMoveDownClick',
                glyph: Hc.Icon.btnMoveDown,
                disabled: true
            },

            '-', {
            text: '导出',
            itemId: 'btnExport',
            reference:'btnExport',
            handler: 'onBtnExportPageClick',
            glyph: Hc.Icon.btnExport
        }, '-', {
            text: '打印',
            itemId: 'btnPrint',
            reference:'btnPrint',
            handler: 'onBtnPrintClick',
            glyph: Hc.Icon.btnPrint,
            disabled: true
        }, '-', {
            text: '更多',
            itemId: 'btnOther',
            reference:'btnOther',
            xtype: 'splitbutton',
            glyph: Hc.Icon.btnOther,
            menu: [{
                text: '查看日志',
                itemId: 'btnViewLog',
                reference:'btnViewLog',
                handler: 'onBtnViewLogClick'
            }]
        }]
    },

    searchPanel: {
        xtype: 'form',
        region: 'north',
        itemId: 'commonsearch',
        reference: 'commonsearch',
        collapsible: true,
        collapseMode: 'undefined',
        title: '查询面板',
        layout: 'hbox',
        header: {
            height: 20,
            padding: 0
        },
        defaults: {
            labelAlign: 'right',
            labelWidth: 80,
            width: 200
        },
        bodyPadding: 3,
        items: []
    },

    tree: {
        xtype: 'treepanel',
        itemId: 'commontree',
        reference: 'commontree',
        rootVisible: false,
        lines: true,
        columns: [{
            text: '序'
        }],

        region: 'center',
        layout: 'fit',

        bind: {
            store: '{commonstore}'
        },

        listeners: {
            'selectionchange': 'onTreeSelectionChange'
        },

        batchUrl:''
    },

    workObject: null,
    otherItems:[],
    detailItem:[],

    initComponent: function () {
        var me = this;

        if(me.detailItem.length>0){
            me.detailWin = Ext.create('Ext.window.Window',{
                autoShow: false,
                closeAction: 'hide',
                modal: true,
                items: [{
                    xtype: 'form',
                    items: this.detailItem,
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    bodyPadding: 10
                }],
                title: '新增',
                bbar: ['->',
                    {
                        xtype: 'button',
                        text: '确认',
                        handler:function(btn){me.controller.onBtnSaveClick(btn,me);                    }
                    },
                    {
                        xtype: 'button',
                        text: '取消',
                        handler: function(btn){btn.up('window').close();}

                    }
                ]
            })
        }

        me.items = [me.toolbar];
        if (me.searchPanel.items.length > 0) {
            me.items.push(me.searchPanel);
        }
        me.items.push(me.tree);
        me.items = me.items.concat(me.otherItems);

        me.callParent();
        if (!me.workObject) {
            me.workObject = me.getComponent('commontree');
        }
    }
});

/**
 * Description:
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BaseTreePageController', {
    extend: 'Hc_Common.view.BasePageController',

    alias: 'controller.basetreepage',

    //初始化操作
    init:function() {
        var objlist = this.getReferences();
        if (!objlist) return;
        if(objlist.btnAdd){
            objlist.btnAdd.setDisabled(!this.canAdd());
        }
        if(objlist.btnExport){
            objlist.btnExport.setDisabled(!this.canExport());
        }
    },


    /*查询事件*/
    onBtnSearchClick: function (btn) {
        var me = this.getView(),
            store = me.workObject.getStore(),
            searchPanel = me.getComponent('commonsearch');
        if (searchPanel) {
            var formValue = searchPanel.getValues();
            for (var field in formValue) {
                if (formValue[field] !== '') {
                    store.proxy.extraParams[field] = formValue[field];
                }else{
                    delete	store.proxy.extraParams[field]
                }
            }
        }
        store.reload();
        me.workObject.view.refresh();
    },

    /*重置功能按钮*/
    onBtnResetClick:function() {
        var me = this,
            form = me.lookupComponent('commonsearch');
        if (form) {
            form.reset();
        }
    },

    /*新增*/
    onBtnAddClick:function() {
        var me = this,
            win= me.view.detailWin,
            tree = me.view.workObject,
            store = tree.store,
            newObj = Ext.create(store.model),
            parentObj= tree.selection;

        if(parentObj) {
            newObj.set(store.parentIdProperty, parentObj.id);
        }
        me.initAddData(newObj,parentObj,tree,store);
        win.show();
        win.down('form').loadRecord(newObj);
    },

    /*新增下级*/
    onAddChildClick:function(btn){

    },


    /* 删除*/
    onBtnDeleteClick: function (btn) {
        var me = this,
            obj = me.getView().workObject,
            items = obj.getSelectionModel().getSelection(),
            deleteList = [], deleteObj, param = {};

        if (items.length < 1) return;

        if (me.checkDelete(items) === false) return;

        Ext.Msg.confirm('系统提示', '真的要删除选择的行吗？', function (b) {
            if (b == 'yes') {
                Ext.Array.each(items, function (item) {
                    deleteObj = new Object();
                    deleteObj[item.idProperty] = item.id;
                    deleteList.push(deleteObj);
                });
                param.deleteList = deleteList;
                me.saveData(param, obj, btn);
            }
        });
    },

    /*编辑*/
    onBtnEditClick:function(btn){
        var me = this,
            win= me.getView().detailWin,
            item=me.view.workObject.selection;

        if(!item){return;}
        win.show();
        win.down('form').loadRecord(item);
    },

    onBtnMoveUpClick:function(btn){

    },

    onBtnMoveDownClick:function(btn){

    },

    /*亲增和编辑通用保存按钮功能（弹出框中的保存）*/
    onBtnSaveClick:function(btn) {
        var me = this,
            tree = me.view.workObject,
            form = btn.up('window').down('form'),
            record = form.getRecord(),
            data = form.getValues(),
            param = {};

        if (record.phantom) {
            param.insertList = [data];
        } else {
            param.updateList = [data];
        }
        me.saveData(param, tree, btn);
    },

    /*操作操作(与后端交互，包括新增，更改，删除)*/
    saveData: function (data,tree,btn) {

        var url = this.getView().tree.batchUrl;
        console.info("保存数据");
          console.info(url);    
        if(!url) return;

        if(btn) {
            btn.setDisabled(true);
        }

        Ext.Ajax.request({
            url: url,
            jsonData: JSON.stringify(data),
            method: 'POST',
            success: function (response) {
                var result = JSON.parse(response.responseText);
                if (result.result.resultCode=="0") {
                    tree.store.reload();
                    tree.view.refresh();
                } else {
                    Ext.MessageBox.alert("提示", result.result.msg);
                }
                btn.setDisabled(false);
            },
            failure: function (response, opts) {
                Ext.MessageBox.show({
                    title: '错误提示',
                    msg: response.responseText,
                    height: 300,
                    width: 400
                });
                btn.setDisabled(false);
            }
        });
    },

    //导出当前页数据
    onBtnExportPageClick: function (btn) {
        alert("【" + btn.text + '】处理中...');
    },

    //导出所有数据
    onBtnExportAllClick:function(btn){

    },

    //打印（选中的记录）
    onBtnPrintClick: function (btn) {

    },

    onBtnViewLog:function(btn){

    },

    //监听事件
    //grid 选择行
    onTreeSelectionChange: function (sm, selections) {
        var me = this,
            btns = this.getReferences(),
            btnDelete = me.lookupReference('btnDelete'),
            btnPrint = me.lookupReference("btnPrint"),
            btnEdit = me.lookupReference('btnEdit');

        if (this.canDelete() && btnDelete) {
            btnDelete.setDisabled(selections.length === 0);
        }
        if (this.canPrint() && btnPrint) {
            btnPrint.setDisabled(selections.length === 0);
        }
        if (this.canEdit()) {
            btnEdit.setDisabled(selections.length === 0);

        }

    },

    //是否字段
    renderYesNo: function (val, metaData, model, row, col, store, gridview) {
        return val ? "是" : "否";
    },
    // 启用状态
    renderUseFlag: function (val, metaData, model, row, col, store, gridview) {
        return val ? "启用" : "禁用";
    },

    //增强接口

    //预留增强 自定义过滤
    customFilter: function (store, filterData) {
        return true;
    },
    //预留增强 -- 初始化新增记录
    initAddData: function (newObj,parentObj ,tree,store) {
    },
    //预留增强 -- 检查数据是否能删除
    checkDelete: function (items) {}
});

/**
 * Description:
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BaseTreePageModel',{
    extend:'Hc_Common.view.BasePageModel',
    alias:'viewmodel.basetreepage',

    data:{
        theRow:null
    },

    stores: {
        commonstore: {
            type:'treebase'
        }
    }
});

/**
 * Description: 单据清单明细基类 view
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/2/11 0011
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */

Ext.define('Hc_Common.view.BaseBillDetailPage', {
    extend: 'Hc_Common.view.BaseMultiPage',

    controller: 'basebilldetailpage',
    viewModel: {
        type: 'basebilldetailpage'
    },

    //list页面类名
    listName: '',
    listStore: '',
    ddlBillStatus:null,

    //单据编号
    billNo: '',
    billType:'',

    //单据单元
    billItems: [],

    billLayout: 'table',
    billColumn: 4,
    billModel: '',
    billSaveUrl: '',
    billLoadUrl: '',
    billExportUrl: '',
    billAuditUrl: '',
    billSubGrid: ['mastergrid'],

    hasStatus2: false,

    gridHasMark: false,
    gridHasCreator: false,
    gridHasModifier: false,
    gridHasAuditor: false,

    grid1HasMark: false,
    grid1HasCreator: false,
    grid1HasModifier: false,
    grid1HasAuditor: false,

    grid2HasMark: false,
    grid2HasCreator: false,
    grid2HasModifier: false,
    grid2HasAuditor: false,

    grid3HasMark: false,
    grid3HasCreator: false,
    grid3HasModifier: false,
    grid3HasAuditor: false,

    grid4HasMark: false,
    grid4HasCreator: false,
    grid4HasModifier: false,
    grid4HasAuditor: false,

    grid5HasMark: false,
    grid5HasCreator: false,
    grid5HasModifier: false,
    grid5HasAuditor: false,

    grid6HasMark: false,
    grid6HasCreator: false,
    grid6HasModifier: false,
    grid6HasAuditor: false,

    grid7HasMark: false,
    grid7HasCreator: false,
    grid7HasModifier: false,
    grid7HasAuditor: false,

    grid8HasMark: false,
    grid8HasCreator: false,
    grid8HasModifier: false,
    grid8HasAuditor: false,

    grid9HasMark: false,
    grid9HasCreator: false,
    grid9HasModifier: false,
    grid9HasAuditor: false,

    //是否自定义布局, 默认为系统自动布局
    customLayout2: false,

    billPanel: {
        xtype: 'form',
        region: 'north',
        maxHeight: 400,
        autoScroll: true,
        reference: 'commonbill',
        defaults: {},
        bodyPadding: 3,
        primaryKey: 'billNo'
    },

    billtoolbar: {
        xtype: 'toolbar',
        reference: 'billtoolbar',
        region: 'north',
        items: [{
            text: '上单',
            itemId: 'btnBillPrev',
            reference: 'btnBillPrev',
            handler: 'onBtnBillPrevClick',
            glyph: Hc.Icon.btnPrev,
            canUse: false,
            disabled: true
        }, {
            text: '下单',
            itemId: 'btnBillNext',
            reference: 'btnBillNext',
            handler: 'onBtnBillNextClick',
            glyph: Hc.Icon.btnNext,
            canUse: false,
            disabled: true
        }, '-', {
            text: '新单',
            itemId: 'btnBillNew',
            reference: 'btnBillNew',
            handler: 'onBtnBillNewClick',
            glyph: Hc.Icon.btnAdd
        }, {
            text: '删单',
            itemId: 'btnBillDel',
            reference: 'btnBillDel',
            handler: 'onBtnBillDelClick',
            glyph: Hc.Icon.btnDelete
        }, {
            text: '保存',
            itemId: 'btnBillSave',
            reference: 'btnBillSave',
            handler: 'onBtnSaveClick',
            glyph: Hc.Icon.btnSave
        }, '-', {
            text: '导出',
            itemId: 'btnBillExport',
            reference: 'btnBillExport',
            handler: 'onBtnExportAllClick',
            glyph: Hc.Icon.btnExport
        }, {
            text: '打印',
            itemId: 'btnBillPrint',
            reference: 'btnBillPrint',
            handler: 'onBtnPrintClick',
            glyph: Hc.Icon.btnPrint
        }, '-', {
            text: '审核',
            itemId: 'btnBillAudit',
            reference: 'btnBillAudit',
            handler: 'onBtnBillAuditClick',
            glyph: Hc.Icon.btnAudit
        }, {
            text: '功能1',
            itemId: 'btnBillOther1',
            reference: 'btnBillOther1',
            handler: 'btnBillOther1Click',
            hidden:true
        }, {
            text: '功能2',
            itemId: 'btnBillOther2',
            reference: 'btnBillOther2',
            handler: 'btnBillOther2Click',
            hidden:true
        }, {
            text: '功能3',
            itemId: 'btnBillOther3',
            reference: 'btnBillOther3',
            handler: 'btnBillOther3Click',
            hidden:true
        }, {
            text: '功能4',
            itemId: 'btnBillOther4',
            reference: 'btnBillOther4',
            handler: 'btnBillOther4Click',
            hidden:true
        }, {
            text: '功能5',
            itemId: 'btnBillOther5',
            reference: 'btnBillOther5',
            handler: 'btnBillOther5Click',
            hidden:true
        }, '-', {
            text: '返回',
            itemId: 'btnBillBack',
            reference: 'btnBillBack',
            handler: 'onBtnBillBackClick',
            glyph: Hc.Icon.btnUndo
        }]
    },

    statusPanel: {
        xtype: 'form',
        reference: 'billstatus',
        region: 'south',
        layout: {
           type:'table'
        },
        height:22,
        minheight:20,
        baseCls: 'x-plain',
        defaults: {
            width: '100%',
            labelWidth: 60,
            labelAlign: 'right'
        },
        defaultType: 'displayfield'
    },

    pageType:'billDetail',

    initComponent: function () {

        var me = this,
            billFields=[{
                xtype: 'textfield',
                name: 'billNo',
                fieldLabel: me.billNoText,
                bind: {value: '{billRow.billNo}'},
                canInput:false
            }].concat(me.billItems);


        me.customLayout1 = true;
        me.gridSelModel = 'MULTI';
        me.gridCanDeSelect = true;
        me.gridIsMaster = false;

        Ext.apply(me.billPanel, {
            store: Ext.create('Hc_Common.store.Base', {
                type: 'basestore',
                model: me.billModel,
                proxy: {
                    url: me.billLoadUrl,
                    extraParams: {
                        billNo: me.billNo
                    }
                }
            }),
            items: billFields,
            layout: {
                type: me.billLayout
            },
            modelName: me.billModel,
            loadUrl: me.billLoadUrl,
            batchUrl:me.billSaveUrl,
            auditUrl: me.billAuditUrl,
            subGrid: me.billSubGrid || []
        });


        if (me.billLayout == "table") {
            me.billPanel.layout.columns = me.billColumn;
            me.billPanel.defaults.width = me.fieldWidth ;
            me.billPanel.defaults.labelWidth = me.labelWidth;
            me.billPanel.defaults.labelAlign = me.labelAlign;
        }

        me.statusPanel.items= [{name: 'creator', bind: {value: '{billRow.creator}'}, fieldLabel: '创建人'},
            {name: 'createTime', bind: {value: '{billRow.createTime}'}, fieldLabel: '创建时间', minWidth: 190},
            {name: 'auditor', bind: {value: '{billRow.auditor}'}, fieldLabel: '审核人'},
            {name: 'auditTime', bind: {value: '{billRow.auditTime}'}, fieldLabel: '审核时间', minWidth: 190},
            {name: 'billStatus', bind: {value: '{billStatusText}'}, fieldLabel: '状态'}
        ];
        me.statusPanel.layout.columns=5;

        if (me.hasStatus2) {
            me.statusPanel.items.push({
                name: 'billStatusMax',
                fieldLabel: '最高状态',
                bind:{value:'{billStatus2Text}'}
            });
            me.statusPanel.layout.columns=6;
        }

        if (!me.customLayout2) {
            me.items = [me.billtoolbar];
            me.items.push(me.billPanel);
            me.items.push(me.toolbar);
            if (me.grid1Model) {
                var tabpanel = {
                    xtype: "tabpanel",
                    region: 'center',
                    split: true,
                    autoDestroy: true,
                    tabPosition: 'top',
                    border: false,
                    layout:'fit',
                    items: [me.grid, me.grid1]
                };
                for (var i = 2; i < 10; i++) {
                    if (me['grid' + i + 'Model']) {
                        tabpanel.items.push(me['grid' + i]);
                    }
                }
                me.items.push(tabpanel);
            } else {
                me.items.push(me.grid);
            }
            me.items = me.items.concat(me.otherItems);
            me.items.push(me.statusPanel);
        }

        this.callParent();
    }
});

/**
 * Description: 单据清单明细基类 ViewController
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/2/11 0011
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BaseBillDetailPageController', {
    extend: 'Hc_Common.view.BaseMultiPageController',
    alias: 'controller.basebilldetailpage',

    init: function () {
        var me = this,
            objlist = me.getObjList();

        me.callParent(arguments);
        try {
            me.setCommonToobar(objlist);

            if (objlist['commonbill']) {
                objlist['commonbill'].store.on('update', me.onBillDataChange, me);
                objlist['commonbill'].store.on('datachanged', me.onBillDataChange, me);
            }
            me.onBindData(me.view.billNo);
        } catch (e) {
        }
    },

    /*更改通用工具条按钮状态*/
    setCommonToobar: function (objlist) {
        if (!objlist || objlist.length < 1)return;
        objlist.btnSearch.setVisible(false);
        objlist.btnExport.setVisible(false);
        objlist.btnPrint.setVisible(false);
        objlist.btnOther.setVisible(false);
        objlist.btnSave.setVisible(false);
        objlist.btnAdd.setText('增行');
        objlist.btnDelete.setText('删行');
        for (var i = 3; i < 7; i++) {
            var sp = objlist['commontoolsp' + i];
            if (sp) {
                sp.setVisible(false);
            }
        }
    },

    /*更改单据页面控件状态*/
    setPageStatus: function (objlist) {
        var me = this,
            form = me.getObj('commonbill'),
            status = me.editingList.length > 0,
            record = form.getRecord(),
            grid=me.workObject;

        objlist = objlist || me.getObjList();

        if (status) {
            objlist.btnBillPrev.setDisabled(true);
            objlist.btnBillNext.setDisabled(true);
            objlist.btnBillAudit.setDisabled(true);
        } else {
            me.billDirection(false);
        }
        objlist.btnBillNew.setDisabled(status);
        //dwh
        //已审核或者设置不允许删除时注销删除按钮
        objlist.btnBillDel.setDisabled(!grid.isCanDelete||form.isAudit);
        objlist.btnBillDel.setDisabled(status);
        objlist.btnBillPrint.setDisabled(status);
        objlist.btnBillExport.setDisabled(status);
        objlist.btnBillSave.setDisabled(!status);
        //dwh
        //已审核或者设置不允许删除时注销删除按钮
        objlist.btnDelete.setDisabled(!grid.isCanDelete||form.isAudit);
        
        if(!form.isAudit && !status && record && me.view.billNo){
            objlist.btnBillAudit.setDisabled(false);
        }
        
        //判断是否启用新增按钮  当isReadOnly=false或者canAdd()=false时设置不可新增
        objlist.btnAdd.setDisabled(!grid.isCanAdd || grid.isReadOnly);
    },

    checkAudit: function () {
        var me = this,
            objlist = me.getObjList(),
            form = objlist['commonbill'],
            record = form.getRecord();
        if (!record) return;
        var txt = form.query('textfield,numberfield,datefield,combo'),
            subGrid = form.subGrid || [],
            isAudit = record.get('billStatus') >= me.view.auditStatus;

        form.isAudit = isAudit;

        if (isAudit) {
            txt.forEach(function (item) {
                item.setReadOnly(true);
            });
            subGrid.forEach(function (g) {
                if (objlist[g]) {
                    objlist[g].isReadOnly = true;
                }
            });
        } else {
            txt.forEach(function (item) {
                item.setReadOnly(false);
                if (item.canInput === false) {
                    item.setReadOnly(true);
                }
            });
            subGrid.forEach(function (g) {
                if (objlist[g]) {
                    objlist[g].isReadOnly = false;
                }
            });
        }
        objlist.btnBillAudit.setDisabled(isAudit);
    },

    /*网格添加记录时,设置单据编号*/
    initAddData: function (newobj) {
        var me = this;
        if (!(me.getObj('commonbill').isValid())) return false;

        newobj.set('billNo', me.view.billNo);

        if (me.workObject.hasOrderNo) {
            var ds = me.workObject.store,
                orderNo = (ds.max('orderNo') || 0) + 1;
            newobj.set('orderNo', orderNo);
        }
    },

    initAddBill:function(obj){},

    setStatusText: function (record) {
        var me = this, vmodel = me.getViewModel(),
            ddl = me.view.ddlBillStatus,
            status = record.get('billStatus'),
            status2 = record.get('billStatusMax');

        me.checkAudit();

        if (ddl) {
            var idx = ddl.store.findExact(ddl.valueField, status.toString());
            if (idx > -1) status = ddl.store.getAt(idx).get(ddl.displayField);
            if (status2 == null) {
                status2 = ''
            } else {
                idx = ddl.store.findExact(ddl.valueField, status2.toString());
                if (idx > -1) status2 = ddl.store.getAt(idx).get(ddl.displayField);
            }
        }
        vmodel.set('billStatusText', status);
        vmodel.set('billStatus2Text', status2);
    },

    /*页面控制绑定数据*/
    onBindData: function (billNo) {
        var me = this,
            objlist = me.getObjList(),
            form = objlist.commonbill, //单据面板
            store = form.store,
            viewModel = me.getViewModel(),
            modelName = form.modelName,
            row;

        if (!modelName) {
            Hc.alert('没有指定单据的Model', function () {
                me.onClose(me.view);
            });
            return;
        }
        me.view.billNo = billNo;
        if (!billNo) {
            row = Ext.create(modelName, {
                billStatus: me.view.editStatus
            });
            store.removeAll();
            me.initAddBill(row);
            store.add(row);
            form.loadRecord(row);
            viewModel.set('billRow', row);
            me.setStatusText(row);
            me.bindSubGrid(form);
            me.setPageStatus(objlist);
            me.bindOtherCt(billNo);
            return;
        }
        store.proxy.extraParams.billNo = billNo;
        store.load({
            callback: function (records, operation, success) {
                row = records[0];
                if (row) {
                    form.loadRecord(row);
                    viewModel.set('billRow', row);
                    me.setStatusText(row);
                } else {
                    Hc.alert('单据编号不存在', function () {
                        me.onClose(me.view);
                    });
                    return;
                }
                me.bindSubGrid(form);
                me.setPageStatus(objlist);
                me.bindOtherCt(billNo);
            }
        });
    },

    /**绑定其它自定义组件*/
    bindOtherCt: function (billNo) {

    },

    /*面板更新数据时*/
    onBillDataChange: function (store) {
        var me = this,
            reference = 'commonbill',
            form = me.getObj(reference),
            idx = me.getDirtyIndex(store);
        if (idx > -1 &&  store.getAt(0).modified && !form.isAudit) {
            Ext.Array.include(me.editingList, reference);
        } else {
            Ext.Array.remove(me.editingList, reference);
        }
        me.setPageStatus();
    },

    /*网格更新数据时*/
    onGridDataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid1DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid2DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid3DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid4DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid5DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid6DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid7DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid8DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid9DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },

    /*重写网格，是否能加载数据*/
    gridIsCanLoad: function (store, opts, obj) {
        var me = this;
        if (me.callParent(arguments) === false)return false;
        if (!me.view.billNo)return false;
        store.proxy.extraParams.billNo = me.view.billNo;
    },

    /*上单*/
    onBtnBillPrevClick: function (btn) {
        this.billDirection(-1)
    },

    /*下单*/
    onBtnBillNextClick: function (btn) {
        this.billDirection(1)
    },

    billDirection: function (d) {
        var me = this, btnPrev = me.getObj('btnBillPrev'),
            btnNext = me.getObj('btnBillNext'),
            store = me.view.listStore;

        btnNext.setDisabled(true);
        btnPrev.setDisabled(true);

        if (!store || store.getCount() < 1) {
            return;
        }

        var billNo = me.view.billNo,
            billIdx = store.findExact('billNo', billNo),
            totalCount = store.getCount();

        if (billIdx == -1) {
            billIdx = 0;
        }
        if (d) {
            if (d == 1 && billIdx < totalCount - 1) {
                billIdx++;
            } else if (d == -1 && billIdx > 0) {
                billIdx--;
            }
            billNo = store.getAt(billIdx).get('billNo');
            if (billNo != me.view.billNo) {
                me.onBindData(billNo);
            }
        }
        if (billIdx + 1 < totalCount) {
            btnNext.setDisabled(false);
        }
        if (billIdx > 0) {
            btnPrev.setDisabled(false);
        }
    },

    /*新增单据*/
    onBtnBillNewClick: function (btn) {
        var me = this;
        me._idValue = '';
        me.view.billNo = me._idValue;
        me.onBindData(me._idValue);
    },

    /*删除单据*/
    onBtnBillDelClick: function (btn) {
        var me = this,
            form = me.getObj('commonbill');
        if (!me.view.billNo) {
            return;
        }
        if(form.isAudit) {
            Hc.alert('此单据已审批,不能删除');
            return
        }
        Hc.confirm('确认要删除此单', function (yn) {
            if (yn == 'yes') {
                var param = me.getDataToSave(form, true);
                me.saveData({srcObj: form, data: param, btn: btn});
            }
        });
    },

    /**审批单据*/
    onBtnBillAuditClick: function (btn) {

        var me = this,
            form = me.getObj('commonbill');

        //dwh 判断单据明细是否为空
        if(me.workObject.getStore().getCount()<=0){
    		Hc.alert("单据明细数据为空不允许审核");
    		return;
    	}
        
        Hc.confirm('确认审批此单据？',function(flag) {
            if(flag=='yes') {
                var param = {
                    auditModelList: [form.getRecord().data]
                };
                me._idValue = me.view.billNo;
                me.saveData({srcObj: form, data: param, btn: btn, url: form.auditUrl});
            }
        });
    },

    /**重写保存事件*/
    onBtnSaveClick: function (btn) {
        var me = this, param,
            obj = me.getObj('commonbill');

        if (me.editingList.length < 1)return;

        param = me.getDataToSave(obj);

        if (!param)return;

        param.billType = me.view.billType;
        param.masterJson.billTypeNo = me.view.billType;

        if (me.beforeSave(param) === false)return;

        me._idValue = me.view.billNo;
        me.saveData({srcObj: obj, data: param, btn: btn});
    },

    /*保存后重新绑定数据*/
    afterSaveResetForm: function (result, option) {
        var me = this;
        me.view.listStore.reload();
        if (option.btn && option.btn.reference == 'btnBillDel') {
            me.onClose(option.btn);
            return;
        }
        me.view.billNo = me._idValue;
        me.onBindData(me._idValue);
    },

    /*返回清单页面*/
    onBtnBillBackClick: function (btn) {
        var me = this;
        if (me.editingList.length > 0) {
            Hc.confirm('数据尚为保存，退出吗？', function (e) {
                if (e == 'yes') {
                    me.onClose(btn);
                }
            })
        } else {
            me.onClose(btn);
        }
    },

    onClose: function (btn) {
        var tabpanel = btn.up('tabpanel');
        if (tabpanel) {
            var actIdx = tabpanel.getActiveTab();
            tabpanel.setActiveTab(0);
            tabpanel.remove(actIdx);
        } else {
            var win = btn.up('window');
            if (win) {
                win.close();
            }
        }
    },

    btnBillOther1Click:function(btn){},

    btnBillOther2Click:function(btn){},

    btnBillOther3Click:function(btn){},

    btnBillOther4Click:function(btn){},

    btnBillOther5Click:function(btn){},
});
/**
 * Description: 单据清单明细基类ViewModel
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/2/11 0011
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */

Ext.define('Hc_Common.view.BaseBillDetailPageModel',{
    extend:'Hc_Common.view.BaseMultiPageModel',
    alias:'viewmodel.basebilldetialpage',
    data:{
        billRow:null,
        billStatusText:'',
        billStatus2Text:''
    }
});
/**
 * Description: 单据清单列表基类 view
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BaseBillListPage', {
    extend: 'Hc_Common.view.BaseSimplePage',
    controller: 'basebilllistpage',
    viewModel: {
        type: 'basebilllistpage'
    },

    listTitle: '单据清单',
    customLayout2: false,
    gridEditModel: 'none',
    gridReadOnly: true,

    gridHasMark: true,
    gridHasCreator: true,
    gridHasModifier: false,
    gridHasAuditor: true,

    //单据明细类别名
    dtlName: '',
    dtlTitle: '单据明细',

    //单显示方式。 maintab = 在主页面的 Tabpanel 中打开,
    //           selftab = 在当前页的 Tabpanel中打开,
    //           window =  以弹出框形式打开
    showModel: 'selftab',

    selftab: {
        xtype: 'tabpanel',
        reference: 'selftab',
        region: 'center',
        tabPosition: 'bottom',
        layout: 'border',
        tabBar: {
            hidden: true
        }
    },

    pageType:'billList',

    initComponent: function () {
        var me = this;
        if (!me.dtlName) {
            Hc.alert('没有指定单据的明细类');
        }

        me.customLayout = me.customLayout || me.customLayout2;
        if (me.showModel == 'selftab') {
            me.customLayout = true;
            var panel = {
                xtype: 'container',
                layout: 'border',
                title: me.listTitle,
                items: [me.toolbar]
            };
            if (me.searchItems.length > 0) {
                panel.items.push(me.searchPanel);
            }
            panel.items.push(me.grid);
            panel.items = panel.items.concat(me.otherItems);

            me.selftab.items = [panel];

            if (!me.customLayout2) {
                me.items = [me.selftab];
            }
        }
        me.callParent(arguments);
    }
});

/**
 * Description: 单据清单列表基类 viewControll
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BaseBillListPageController', {
    extend: 'Hc_Common.view.BaseSimplePageController',
    alias: 'controller.basebilllistpage',

    init: function () {
        var me = this;
        me.callParent(arguments);
    },

    onGridRowDblClick: function (view, record, tr, rowIndex, e) {
        var me = this;
        me.showDtlModule(record.get('billNo'));
    },

    onBtnAddClick: function () {
        var me = this;
        if (!me.canAdd()) {
            Hc.alert('你没有权限新增数据');
            return;
        }
        me.showDtlModule('');
    },

    showDtlModule: function (billno) {
        var me = this,
            status = (Ext.isEmpty(billno) ? 'new' : 'edit'),
            view = me.view,
            showmodel = view.showModel,
            dtlname = view.dtlName,
            itemid = view.dtlName + status,
            grid = me.workObject || {};

        if (!dtlname) {
            Hc.alert('没有指定明细的类名');
            return;
        }

        var ddlStatus = me.getObj('ddlBillStatus'),
            dtl = {
                xtype: dtlname,
                billNo: billno,
                pageStatus: status,
                itemId: itemid,
                closable: true,
                reorderable: true,
                loadMask: '加载中...',
                listName: view.xtype,
                listStore: grid.store,
                ddlBillStatus: ddlStatus,
                userRight: view.userRight,
                moduleRight: view.moduleRight,
                userCode: view.userCode,
                userName: view.userName
            };
        if (showmodel == 'window') {
            dtl.width = Ext.getBody().getWidth() * 0.8;
            dtl.height = Ext.getBody().getHeight() * 0.8;
            me.showInWin(dtl, {winName: itemid, title: view.dtlTitle, showBbar: false});
            return;
        }

        dtl.title = view.dtlTitle;

        if (showmodel == "selftab") {
            var tabpanel = me.getObj('selftab');
            if (!tabpanel) {
                Hc.alert('模块页面布局不正确');
                return;
            }
            var tab = tabpanel.getComponent(itemid);
            if (!tab) {
                tab = tabpanel.add(dtl);
            }
            tabpanel.setActiveTab(tab);
        } else if (showmodel == "maintab") {
            me.showInTab(dtl, true);
        }
    },

    onBtnEditClick: function (btn) {
        var me = this;
        if (!me.canEdit() && me.canAudit()) {
            Hc.alert('你没有权限编辑或审批数据');
            return;
        }
        var record = me.getObj('mastergrid').getSelection()[0];
        if (!record) {
            Hc.alert('没有选择记录');
            return;
        }
        me.showDtlModule(record.get('billNo'));
    },

    onGridSelectionChange: function (sm, selections) {
        var btnEdit = this.getObj('btnEdit');
        if (btnEdit) {
            btnEdit.setDisabled(selections == 0);
        }
        this.callParent(arguments);
    }

});

/**
 * Description: 单据清单列表基类 viewModel
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BaseBillListPageModel',{
    extend:'Hc_Common.view.BaseSimplePageModel',
    alias:'viewmodel.basebilllistpage'
});

