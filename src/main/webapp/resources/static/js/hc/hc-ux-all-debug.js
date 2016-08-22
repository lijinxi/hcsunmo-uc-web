/**
 * Description: comobox扩展控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月18日上午8:39:50
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月18日     	yu.jh
 * 2015年3月28日 		liutao	因联动下拉框修改 只有在联动的时候才会传入store 其他都以url方式请求处理
 * 		建议使用时务必指定valuemember/displaymember
 */
Ext.define('Hc_Common.ux.ComboCustom',{
    extend:'Ext.form.field.ComboBox',
    alias:'widget.extcombox',
	queryMode:'local',
	displayField:null,
	displaymember:null,
	valueField:null,
	valuemember:null,
	store:null,
	displayvalue:null,
	emptyText:"请选择",
    forceSelection:true,
    initComponent:function(){
    	var tt=[];
		var sstore=null;
		if (this.store==null){
			if (this.valuemember==null){
				this.valueField="num";
				this.displayField="name";
				var s=this.displayvalue.split(":");
				for (var i=0;i<s.length;i++){
					var v=s[i].split("=");
					var obj={};
					var s1=v[0];
					var s2=v[1];
					obj.num = s1;
					obj.name= s2;
					tt.push(obj);
				}
				sstore = Ext.create('Ext.data.Store', {
				    fields: [this.valueField, this.displayField],
				    data : tt
				});
			}
			else{
				this.valueField=this.valuemember;
				this.displayField=this.displaymember;
				sstore = Ext.create('Hc_Common.store.Base', {
				    fields: [this.valueField, this.displayField],
	                proxy:{
	                    url:this.displayvalue
	                }
				});
			}
			sstore.reload();
			this.store=sstore;
		}
		else{
			this.valueField=this.valuemember;
			this.displayField=this.displaymember;
		}
		this.callParent();
    }
});
/**
 * Description: 启用状态
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/28 0028
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.ux.ComboUseFlag',{
    extend:'Ext.form.field.ComboBox',

    alias:'widget.combouseflag',
    store: [['',''],[1, '启用'], [0, '禁用']],
    editable:false,

    initComponent:function(){
        this.callParent();
    }
});
/**
 * Description: 是否选择控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/23 0023
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.ux.ComboYesNo',{
    extend:'Ext.form.field.ComboBox',

    alias:'widget.comboyesno',
    store: [['',''],[1, '是'], [0, '否']],
    editable:false,

    initComponent:function(){
        this.callParent();
    }
});
/**
 * Description: 日期时间表单扩展控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月30日下午2:54:57
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月30日     	yu.jh
 *  * 查询面板日期时间用法：
 * {
		xtype: 'bldatetime',
		fieldLabel: '建档时间',
		name: 'createFromTime'
		value: new Date((new Date()).setDate(new Date().getDay()-5))
	},{
		xtype: 'bldatetime',
		fieldLabel: '   到     ',
		contype:"datetime", //若查询值为日期时间型设置datetime,默认查询值为日期型
		name: 'createToTime'
	}
 */
Ext.define('Hc_Common.ux.DateTimeField', {
	  extend: 'Ext.form.field.Date',
	  alias: 'widget.bldatetime',
	  readOnly:false,
	  contype:"date",
	  initComponent: function() {
		  this.format = this.format ;
		  this.afterMethod('afterRender',function(){            
			  this.getEl().applyStyles('top:0');        
		  });
		  this.callParent();
	  },
	  createPicker: function() {
	        var me = this,format = Ext.String.format;
	        // Create floating Picker BoundList. It will acquire a floatParent by looking up
	        // its ancestor hierarchy (Pickers use their pickerField property as an upward link)
	        // for a floating component.
	        if (this.contype=="datetime"){
	        	if (this.format=="Y-m-d"||this.format==null){
	        		this.format="Y-m-d H:i:s";
	        	}
	        	return new Hc_Common.ux.DateTimePicker({
		            pickerField: me,
		            ownerCt: me.ownerCt,
		            floating: true,
		            focusable: true, // Key events are listened from the input field which is never blurred
		            hidden: true,
		            minDate: me.minValue,
		            maxDate: me.maxValue,
		            disabledDatesRE: me.disabledDatesRE,
		            disabledDatesText: me.disabledDatesText,
		            disabledDays: me.disabledDays,
		            disabledDaysText: me.disabledDaysText,
		            format: me.format,
		            showToday: me.showToday,
		            startDay: me.startDay,
		            minText: format(me.minText, me.formatDate(me.minValue)),
		            maxText: format(me.maxText, me.formatDate(me.maxValue)),
		            listeners: {
		                scope: me,
		                select: me.onSelect
		            },
		            keyNavConfig: {
		                esc: function() {
		                    me.collapse();
		                }
		            }
		        });
	        }
	        else if(this.contype=="date"){
	        	if (this.format==null){
	        		this.format="Y-m-d";
	        	}
	        	return new Ext.picker.Date({
		            pickerField: me,
		            ownerCt: me.ownerCt,
		            floating: true,
		            focusable: true, // Key events are listened from the input field which is never blurred
		            hidden: true,
		            minDate: me.minValue,
		            maxDate: me.maxValue,
		            disabledDatesRE: me.disabledDatesRE,
		            disabledDatesText: me.disabledDatesText,
		            disabledDays: me.disabledDays,
		            disabledDaysText: me.disabledDaysText,
		            format: me.format,
		            showToday: me.showToday,
		            startDay: me.startDay,
		            minText: format(me.minText, me.formatDate(me.minValue)),
		            maxText: format(me.maxText, me.formatDate(me.maxValue)),
		            listeners: {
		                scope: me,
		                select: me.onSelect
		            },
		            keyNavConfig: {
		                esc: function() {
		                    me.collapse();
		                }
		            }
		        });
	        }
	        
	    }
  });

/**
 * Description: 日期时间扩展控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月30日下午2:54:57
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月30日     	yu.jh
 */
Ext.define('Hc_Common.ux.DateTimePicker', {
	  extend: 'Ext.picker.Date',
	  alias: 'widget.datetimepicker',
	  todayText: '确认',
	  timeLabel: '时间',
	  anchor: '100%',
	  onRender: function(container, position) {
	        var me = this;
	        if(!this.h) { 
				  this.h = Ext.create('Ext.form.field.Number', {
					    fieldLabel: this.timeLabel,
					    labelWidth: 40,
					    value: this.value.getHours(),
					    minValue: 0,
					    maxValue: 23,
					    style: 'float:left',
					    width:90,
					    baseCls:"inputh",
					    selectOnFocus:true
				    });
				  this.m = Ext.create('Ext.form.field.Number', {
					    value: this.value.getMinutes(),
					    minValue: 0,
					    maxValue: 59,
					    style: 'float:left',
					    inputType: 'text',
					    width:40,
					    baseCls:"inputm",
					    selectOnFocus:true
				    });
				  this.s = Ext.create('Ext.form.field.Number', {
					    value: this.value.getSeconds(),
					    minValue: 0,
					    maxValue: 59,
					    style: 'float:left',
					    inputType: 'text',
					    width:40,
					    baseCls:"inputs",
					    selectOnFocus:true
				    });
			}
	        this.h.ownerCt = this;
	        this.m.ownerCt = this;
	        this.s.ownerCt = this;
	        this.h.on('change', this.htimeChange, this);
	        this.m.on('change', this.mtimeChange, this);
	        this.s.on('change', this.stimeChange, this);
	        
	        me.callParent(arguments);
	        me.todayBtn.tooltip="";
	        var table = Ext.get(Ext.DomQuery.selectNode('table', this.el.dom));
	        var tfEl = Ext.core.DomHelper.insertAfter(table.last(), {
	        	tag: 'tr',
	        	style: 'border:0px;',
	        	children: [{
	        		tag: 'td',
	        		colspan:'7',
	        		cls: 'x-datepicker-footer ux-timefield'
	        	}]
	        }, true);
	        this.h.render(this.el.child('div tr td.ux-timefield'));
	        this.m.render(this.el.child('div tr td.ux-timefield'));
	        this.s.render(this.el.child('div tr td.ux-timefield'));
	        this.ht=Ext.get(Ext.DomQuery.selectNode('div.inputh input', this.el.dom));
	        this.ht.on("click",this.htclick,this);
	        this.mt=Ext.get(Ext.DomQuery.selectNode('div.inputm input', this.el.dom));
	        this.mt.on("click",this.mtclick,this);
	        this.st=Ext.get(Ext.DomQuery.selectNode('div.inputs input', this.el.dom));
	        this.st.on("click",this.stclick,this);
	    },
	    htclick:function(){
	    	this.ht.focus();
	    },
	    mtclick:function(){
	    	this.mt.focus();
	    },
	    stclick:function(){
	    	this.st.focus();
	    },
	    /**
	     * Respond to a date being clicked in the picker
	     * @private
	     * @param {Ext.event.Event} e
	     * @param {HTMLElement} t
	     */
	    handleDateClick: function(e, t) {
	        var me = this,
	            handler = me.handler;
	        e.stopEvent();
	        if(!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)){
	        	me.setValue(this.fillDateTime(new Date(t.dateValue)));
	            //me.fireEvent('select', me, me.value);
	            if (handler) {
	                handler.call(me.scope || me, me, me.value);
	            }
	            me.onSelect();
	        }
	    },
	    /**
	     * Sets the value of the date field
	     * @param {Date} value The date to set
	     * @return {Ext.picker.Date} this
	     */
	    setValue: function(value){
	        // If passed a null value just pass in a new date object.
	    	this.value = value;
			this.changeTimeFiledValue(value);
			return this.update(Ext.Date.clearTime(this.value || new Date(), true));
	    },
	    // @private
		changeTimeFiledValue: function(value) {
			this.h.un('change', this.htimeChange, this);
			this.m.un('change', this.mtimeChange, this);
			this.s.un('change', this.stimeChange, this);
			this.h.setValue(value.getHours());
			this.m.setValue(value.getMinutes());
			this.s.setValue(value.getSeconds());
			
			this.h.on('change', this.htimeChange, this);
			this.m.on('change', this.mtimeChange, this);
			this.s.on('change', this.stimeChange, this);
		 },
		// listener 时间修改
	    htimeChange: function(tf, time, rawtime) {
	    	this.value = this.fillDateTime(this.value);
	    },
	    mtimeChange: function(tf, time, rawtime) {
	    	this.value = this.fillDateTime(this.value);
	    },
	    stimeChange: function(tf, time, rawtime) {
	    	this.value = this.fillDateTime(this.value);
	    },
	    // @private
		fillDateTime: function(value) {
			 if(this.h) {
				 var h=this.h.value;
				 var m=this.m.value;
				 var s=this.s.value;
				 value.setHours(h);
				 value.setMinutes(m);
				 value.setSeconds(s);
			 }
			 return value;
		 },
	    /**
	     * Gets the current selected value of the date field
	     * @return {Date} The selected date
	     */
	    getValue: function(){
	    	return this.fillDateTime(this.value);
	    },
	    selectToday: function() {
	    	var me = this,
            btn = me.todayBtn,
            handler = me.handler;
	        if (btn && !btn.disabled) {
	            me.setValue(this.fillDateTime(new Date(me.activeDate)));
	            me.fireEvent('select', me, me.value);
	            if (handler) {
	                handler.call(me.scope || me, me, me.value);
	            }
	            me.onSelect();
	        }
	        return me;
	    }
});



/**
 * Description: 下拉框控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/4/22 0022
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.ux.DropdownList', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.ddlfield',
    queryMode: 'local',
    displayField: 'textField',
    valueField: 'idField',
    localData: null,
    url: '',
    fromFields: '',
    async:true,

    //读取过滤条件
    getFilters:function() {
        var me = this, params = [];

        if (!me.fromFields) return params;

        var fields = me.fromFields.split(','),
            context = me.up().context, val,
            form = me.up('form');
        if (context || form) {
            var record = context&&context.record|| form.getRecord();
            Ext.each(fields, function (f) {
                if (record) {
                    val = record.get(f);
                }
                if (!val && !form) {
                    var txt = Hc.getField(form, f);
                    if (txt) {
                        val = txt.getValue();
                    }
                }
                params.push({
                    property: f,
                    value: val || '',
                    operator: 10
                })
            });
        }
        return params;
    },

    //加载数据后处理事件
    afterLoad:function(){},

    //绑定数据
    reload: function () {
        var me = this;

        me.store.removeAll();

        if (me.localData) {
            me.store.loadData(me.localData);
            me.afterLoad();
        } else if (me.url) {
            var param = me.getFilters(),
                options = {
                    url: me.url,
                    method: 'POST',
                    async:me.async,
                    success: function (d) {
                        try {
                            d = JSON.parse(d.responseText);
                            if(d.list){
                                me.store.loadData(d.list);
                            }else {
                                me.store.loadData(d);
                            }
                            me.afterLoad();
                        }
                        catch (e) {
                            Hc.alert('无法加载【' + me.fieldLabel + '】,服务端返回无效数据');
                        }
                    },
                    failure: function () {
                        Hc.alert('无法加载【' + me.fieldLabel + '】,请求服务器出错');
                    }
                };
            if (!Ext.isEmpty(param)) {
                options.params = {
                    queryCondition: JSON.stringify(param)
                }
            }
            Hc.callServer(options);
        }
    },

    initComponent: function () {
        var me = this;
        if(!me.store) {
            me.store = Ext.create('Ext.data.JsonStore', {
                fields: [me.displayField, me.valueField]
            });
            me.reload();
        }
        me.callParent(arguments);
    }
});
/**
 * Description: 通用的一些方法
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/4/8 0008
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */

var Hc=Hc||{};



Hc.getField=function(form,fieldName) {
    return form.getForm().getFields().findBy(function (item) {
        return item.name == fieldName
    })
};

/* alert 提示框
 * msg 提示内容
 * [fn] 点击按钮时执行的函数
 * [scope] 作用域
 * */
Hc.alert = function(msg,fn,scope){
    var title = '系统提示';
    Ext.Msg.alert(title,msg,fn,scope);
};


/* confirm 确认框
 * msg 提示内容
 * [fn] 点击按钮时执行的函数
 * [scope] 作用域
 * */
Hc.confirm = function(msg,fn,scope){
    var title = '系统提示';
    Ext.Msg.confirm(title,msg,fn,scope);
};
/**弹出框*/
Hc.show = function(options){
    Ext.Msg.show(options);
};
/**深度复制对象*/
Hc.clone = function (obj) {
    var result;
    if (Ext.isArray(obj)) {
        result = [];
    } else if (Ext.isObject(obj)) {
        result = {};
    } else {
        return obj;
    }
    for (var key in obj) {
        var copy = obj[key];
        if ((Ext.isObject(copy) && copy.constructor.name=='Object') || Ext.isArray(copy)) {
            result[key] = arguments.callee(copy);//递归调用
        } else {
            result[key] = obj[key];
        }
    }
    return result;
};

Hc.openUrl=function(url,title,w,h) {
    title = title || '弹出窗口';
    w = w || 1024;
    h = h || 500;
    if(url.indexOf('?')>0){
        url+='&_dc=';
    }else{
        url+='?_dc=';
    }
    url+=new Date().getTime();
    Ext.widget('window', {
        closeAction: 'destroy',
        modal: true,
        width:w,
        height:h,
        title:title,
        html: '<iframe frameborder=0 width="100%" height="100%" src="' + url + '"></iframe>',
        autoShow: true
    });
};

Hc.callServer=function(options){
    Ext.Ajax.request(options);
};

/*小于10补0*/
function fillzeno(n) {
    return n < 10 ? '0' + n : n;
}

/*重写Js 标准的 toJSON方法，返回 yyyy-MM-dd HH:mm:ss*/
Date.prototype.toJSON = function() {
    return isFinite(this.valueOf()) ?
    this.getFullYear() + '-' +
    fillzeno(this.getMonth() + 1) + '-' +
    fillzeno(this.getDate()) + ' ' +
    fillzeno(this.getHours()) + ':' +
    fillzeno(this.getMinutes()) + ':' +
    fillzeno(this.getSeconds()) : null;
};

Ext.onReady(function() {
    //验证 比较form中两个控件输入的值是否符合规则
    Ext.apply(Ext.form.VTypes, {
        compareTo: function (val, field) {
            this.compareToText = field.compareError || '两次输入的值不一致';
            var form = field.up('form');
            var opt = field.compareType || '=';
            if (field.compareTo && form) {
                var val2 = form.getValues()[field.compareTo];
                if (opt == '>') {
                    return (val > val2);
                } else if (opt == '>=') {
                    return (val >= val2);
                } else if (opt == '<') {
                    return (val < val2);
                } else if (opt == '<=') {
                    return (val <= val2);
                } else {
                    return (val == val2);
                }
            }
            return true;
        }
    });
});



/**
 * Description:
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/5/7 0007
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */

Ext.grid.plugin.CellEditing.override({
    onSpecialKey: function(ed, field, e) {
        var sm;
        if (e.getKey() === e.TAB){
            e.stopEvent();
            if (ed) {


                ed.onEditorTab(e);
            }
            sm = ed.getRefOwner().getSelectionModel();
            return sm.onEditorTab(ed.editingPlugin, e);
        }else if(e.getKey()=== e.ENTER){
            e.stopEvent();
            if(!(ed.editingPlugin.grid.mSizeIdx>-1 && field.column.dataIndex =='materialNo')){
                if (ed) {
                    ed.onEditorTab(e);
                }
                sm = ed.getRefOwner().getSelectionModel();
                return sm.onEditorTab(ed.editingPlugin, e);
            }else{
                this.completeEdit();
            }
        }
    }
});

Ext.view.View.override({
    handleEvent: function(e) {
        var me = this,
            isKeyEvent = me.keyEventRe.test(e.type),
            nm = me.getNavigationModel();
        e.view = me;
        if (isKeyEvent) {
            e.item = nm.getItem();
            e.record = nm.getRecord();
        }


        if (!e.item) {
            e.item = e.getTarget(me.itemSelector);
        }
        if (e.item && !e.record) {
            e.record = me.getRecord(e.item);
        }
        if (me.processUIEvent(e) !== false) {
            me.processSpecialEvent(e);
        }

        //denny.wu 2015.4.9 grid cell中不能输入特殊字符

        //if (isKeyEvent && ((e.getKey() === e.SPACE && !Ext.fly(e.target).isInputField()) || e.isNavKeyPress(true))) {
        //
        //    /* e.preventDefault();*/
        //}
    }
});

Ext.Editor.override({
    completeOnEnter:false
});


//dwh   解决表头输入框回车事件异常
Ext.grid.header.Container.override({
	
    privates: {
        onHeaderActivate: function(e) {
            var column = this.getFocusableFromEvent(e)
            //添加当前触发选择判断
            if (column&&column.HcfilterEl) {
                
                
                if (column.sortable && this.sortOnClick) {
                    column.toggleSortState();
                }
                
                this.onHeaderClick(column, e, column.el);
            }
        }
    }
});
//重载点击表头事件使其支持点击输入框
Ext.grid.column.Column.override( {
    onTitleElClick: function(e, t) {
        var me = this,
            activeHeader,
            prevSibling,
	    HcfilterEl;

        // Tap on the resize zone triggers the menu
        if (Ext.supports.Touch) {
            prevSibling = me.previousSibling(':not([hidden])');

            // Tap on right edge, activate this header
            if (!me.menuDisabled && me.isOnRightEdge(e, parseInt(me.triggerEl.getStyle('width')))) {
                if (!me.menuDisabled) {
                    activeHeader = me;
                }
            }

            // Tap on left edge, activate previous header
            else if (prevSibling && !prevSibling.menuDisabled && me.isOnLeftEdge(e)) {
                activeHeader = prevSibling;
            }
        }
        else {
            // Firefox doesn't check the current target in a within check.
            // Therefore we check the target directly and then within (ancestors)
            activeHeader = me.triggerEl && (e.target === me.triggerEl.dom || t === me.triggerEl.dom || e.within(me.triggerEl)) ? me : null;

	    HcfilterEl = me.HcfilterEl && (e.target === me.HcfilterEl.dom || t === me.HcfilterEl.dom || e.within(me.HcfilterEl)) ? me : null;        
	}

        // If it's not a click on the trigger or extreme edges. Or if we are called from a key handler, sort this column.
        if (!HcfilterEl &&!activeHeader && !me.isOnLeftEdge(e) && !me.isOnRightEdge(e) || e.getKey()) {
            me.toggleSortState();
        }
        return activeHeader;
    }
 });

//复制数组
Array.prototype.HcCopy=function(){
	var newArr=[];
	if(this.length<=0) return newArr;
	for(var i=0;i<this.length;i++){
		var newObj=new Object();
		newObj[i]=this[i];
		newArr.push(newObj[i]);
	}
	return newArr
}

Ext.define('Hc_Common.ux.HcExport', {
    extend:'Ext.window.Window',
    alias: 'widget.Hcexport',
    constructor:function(config){
    	var me=this;
    	
    	Ext.apply(me,config);
    	me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.fileType=me.fileType||"xls";  //文件类型
        me.fieldType=me.fieldType||"all"; //字段
        
        if(me.exportType=="page"){
        	me.title="导出当前页";
        }
        else{
        	me.title="导出全部";
        }
        me.items=[me._createForm()];
        me.bbar= ['->', {
        	glyph: Hc.Icon.btnSave,
        	text:"确定",
        	itemId:me.id+"_exportOk",
        	handler:me._exportOk
        }, {
        	glyph: Hc.Icon.btnCancel,
        	text:"退出",
        	itemId:me.id+"_exportCanel",
        	handler:me._exportCanel
        }];
       
        me.callParent(arguments);
    },
    title:"数据导出",
    modal:true,
    resizable:false,
    ATTRS:{
    	btns:{},
    	fields:{}
    },
    initEvents:function(){
    	//注册事件
    	var me=this;
        
        me.ATTRS.btns.btnAllField.on("click",function(){
        	me.fieldType="all";
        	me._allfield();
    	});
    	me.ATTRS.btns.btnCustomField.on("click",function(){
    		me.fieldType="custom";
    		me._customField();
		});
    	
    	me.ATTRS.btns.btnSelectAll.on("click",function(){
    		me._selectAll();
    	});
    	me.ATTRS.btns.btnUnSelectAll.on("click",function(){
    		me._unSelectAll();
    	});
    	
    	Ext.each(me.ATTRS.btns.btnFileTypes.items.items,function(item){
    		item.on("click",function(){
        		me._selectFileType(this.value);
    		});
    	});
    },
    _createForm:function(){
    	//创建表单
    	var me=this,
    	form,
    	exportFiels=me.gridColumns||[],
    	fields=[];
    	
    	//生成导出列
    	Ext.each(exportFiels,function(item){
    		var field={
				text:item.text,
				value:item.dataIndex,
				handler:me._addOrDelFields,
				isSelect:false
    		};
    		fields.push(field);
    	});
    	
    	form=new Ext.form.Panel({
    		border:false,
    		defaults:{
				style:'margin:5px 10px 5px 5px;',
			},
    		items:[{
				xtype: 'fieldcontainer',
				fieldLabel : '导出文件',
				labelWidth:70,
				layout: 'hbox',
				defaults:{
					xtype:"button",
					style:'margin:5px 10px 5px 0px;',
					cls:"Hc-export",
				},
				itemId:me.id+"_fileTypes",
				items:[{
	    				text  : 'Excel(.xls)',
	    				itemId        : me.id+'_xls',
	    				iconCls:me.fileType=="xls"? "Hc-export-select":"",
	    				value:"xls"
		    		},
		    		{
		    			text  : 'Excel(.xlsx)',
		                itemId        : me.id+'_xlsx',
		                iconCls:me.fileType=="xlsx"? "Hc-export-select":"",
		                value:"xlsx"
		    		}]
        	},
        	{
        		xtype: 'fieldcontainer',
				fieldLabel : '文件名称',
				layout: 'vbox',
				labelWidth:70,
				defaults:{
					style:'margin:5px 10px 5px 0px;'
				},
        		items:[{
            		xtype:"textfield",
            		emptyText :"请输入导出文件名称",
            		value:me.fileName||"导出文件",
            		allowBlank:false,
            		itemId:me.id+"_exportFileName"
            	}]
        	},
        	{
				xtype: 'fieldcontainer',
				fieldLabel : '导出字段',
				layout: 'vbox',
				labelWidth:70,
				items:[{
						border:false,
						layout: 'hbox',
						defaults:{
							xtype:"button",
							style:'margin:5px 10px 5px 0px;',
							cls:"Hc-export"
						},
						items:[{
			    				text:'所有',
			    				itemId: me.id+'_allfield',
			    				iconCls:me.fieldType=="all"? "Hc-export-select":"",
				    		},
				    		{
			    				iconCls:me.fieldType!="all"? "Hc-export-select":"",
			    				text:'自定义',
			    				itemId: me.id+'_Customfield'
				    		}]
				},
				{
					border:false,
					hidden:true,
					itemId:me.id+"_btnExport",
					layout: 'hbox',
					defaults:{
						style:'margin:5px 10px 5px 0px;',
						xtype:"button",
						cls:"Hc-export"
					},
					items:[{
	    				text  : '全选',
	    				itemId        : me.id+'_selectAll',
		    		},
		    		{
		    			text  : '反选',
		                itemId        : me.id+'_unselectAll'
		    		}]
				},
				{
					border:false,
					layout: 'column',
					labelWidth:70,
					width:600,
					hidden:true,
					itemId:me.id+"_exportFiels",
					defaults:{
						style:'margin:5px 5px 5px 0px;',
						xtype:"button",
						cls:"Hc-export",
						columnWidth:0.25,
					},
					items:fields
				}
				]
        	}]
    	});
    	
    	//获取控件
    	
    	me.ATTRS.fields.exportFiels=form.down('[itemId='+me.id+'_exportFiels]');
    	me.ATTRS.fields.exportFileName=form.down('[itemId='+me.id+'_exportFileName]');
    	me.ATTRS.fields.btnExport=form.down('[itemId='+me.id+'_btnExport]');
    	
    	//文件类型
    	me.ATTRS.btns.btnFileTypes=form.down('[itemId='+me.id+'_fileTypes]');
    	
    	me.ATTRS.btns.btnSelectAll=form.down('[itemId='+me.id+'_selectAll]');
    	me.ATTRS.btns.btnUnSelectAll=form.down('[itemId='+me.id+'_unselectAll]');
    	
    	me.ATTRS.btns.btnAllField=form.down('[itemId='+me.id+'_allfield]');
    	me.ATTRS.btns.btnCustomField=form.down('[itemId='+me.id+'_Customfield]');
    	
    	return form;
    },
    //全选
    _selectAll:function(){
    	var me=this,
    	exportFiels=me.ATTRS.fields.exportFiels.items.items;
    	
    	me.ATTRS.btns.btnSelectAll.setIconCls("Hc-export-select");
    	me.ATTRS.btns.btnUnSelectAll.setIconCls("");
    	
    	Ext.each(exportFiels,function(item){
    		item.isSelect=true;
    		item.setIconCls("Hc-export-select");
    	});
    	
    },
    //反选
    _unSelectAll:function(){
    	var me=this,
    	exportFiels=me.ATTRS.fields.exportFiels.items.items;
    	
    	me.ATTRS.btns.btnSelectAll.setIconCls("");
    	me.ATTRS.btns.btnUnSelectAll.setIconCls("Hc-export-select");
    	
    	Ext.each(exportFiels,function(item){
    		item.isSelect=!item.isSelect;
    		if(item.isSelect){
    			item.setIconCls("Hc-export-select");
    		}
    		else{
    			item.setIconCls("");
    		}
    	});
    },
    _selectFileType:function(type){
    	var me=this;
    	files=me.ATTRS.btns.btnFileTypes.items.items;
    	Ext.each(files,function(item){
    		item.setIconCls(item.value==type?"Hc-export-select":"");
    	});
    	
    	me.fileType=type;
    },
    //点击选择或取消
    _addOrDelFields:function(){
    	var me=this;
    	me.isSelect=!me.isSelect;
    	
    	if(me.isSelect){
    		me.setIconCls("Hc-export-select");
    	}
    	else{
    		me.setIconCls("");
    	}
    },
    //导出所有字段
    _allfield:function(){
    	var me=this,
    	oddWidth=me.getWidth(),
    	oddHeight=me.getHeight(),
    	newWidth,
    	newHeight,
    	winXY=me.getXY();
    	
    	me.ATTRS.btns.btnAllField.setIconCls("Hc-export-select");
    	me.ATTRS.btns.btnCustomField.setIconCls("");
    	
    	me.ATTRS.fields.exportFiels.setVisible(false);
    	me.ATTRS.fields.btnExport.setVisible(false);
    	
    	newWidth=me.getWidth();
    	newHeight=me.getHeight();
    	
    	winXY[0]-=(newWidth-oddWidth)*0.5;
    	winXY[1]-=(newHeight-oddHeight)*0.5;
    	me.setXY(winXY);
    },
    //自定义
    _customField:function(){
    	var me=this,
    	oddWidth=me.getWidth(),
    	oddHeight=me.getHeight(),
    	newWidth,
    	newHeight,
    	winXY=me.getXY();
    	
    	me.ATTRS.btns.btnAllField.setIconCls("");
    	me.ATTRS.btns.btnCustomField.setIconCls("Hc-export-select");
    	
    	me.ATTRS.fields.exportFiels.setVisible(true);
    	me.ATTRS.fields.btnExport.setVisible(true);
    	
    	newWidth=me.getWidth();
    	newHeight=me.getHeight();
    	
    	winXY[0]-=(newWidth-oddWidth)*0.5;
    	winXY[1]-=(newHeight-oddHeight)*0.5;
    	me.setXY(winXY);
    	
    },
    //点击确定
    _exportOk:function(){
    	var me=this,
    	winPanel=me.up("window"),
    	form=winPanel.down("form");
    	if(!form.isValid()) return;
    	
    	winPanel._export();
    },
    //导出
    _export:function(){
        var me = this,
        exportErrorMsg = '',
        grid = me.grid,
        objs = me.objs,
        exportUrl = grid.exportUrl,
        searchPanel = objs.commonsearch,
        subgridExport = '',
        fileName = me.ATTRS.fields.exportFileName.getValue(),
        fileType = me.fileType,
        exportColumns = [],
        searchPanelValue = searchPanel.getValues('d');
        //获取导出字段
        if(me.fieldType==="all"){
        	Ext.each(me.gridColumns,function(item){
        		exportColumns.push({
        			field:item.dataIndex,
        			title:item.text
        		});
        	});
        	
        }
        else{
        	var exportFiels=me.ATTRS.fields.exportFiels.items.items;
        	Ext.each(exportFiels,function(item){
        		if(item.isSelect===true){
        			exportColumns.push({
            			field:item.value,
            			title:item.text
            		});
        		}
        	});
        }
        
	    if (!exportUrl) {
	        Hc.alert('此网格没有提供导出功能');
	        return;
	    }
	    if (exportColumns.length<=0) {
	        exportErrorMsg += '请选择导出的列';
	    }
	
	    if (exportErrorMsg != '') {
	        Ext.Msg.alert('导出提示', exportErrorMsg);
	        return;
	    }
	    if (grid.supGrid) {
	        var mainGrid = me.lookupReference(grid.supGrid),
	            mainGridprimaryKey = mainGrid.primaryKey,
	            mainGridprimaryValue = mainGrid.getSelection()[0].data[mainGridprimaryKey];
	        subgridExport = mainGridprimaryKey + '=' + mainGridprimaryValue;
	    }
	    
	    me.mask("数据导出中...");
	    //导出所有
	    if(me.exportType=="all"){
	    	window.location.href = exportUrl +
		    "?exportColumns=" + Ext.encode(exportColumns) +
		    '&fileName=' + fileName + '&fileType=' + fileType +
		    '&' + searchPanelValue + '&' + subgridExport;
	    }
	    else{
	    	 window.location.href = exportUrl +
	         "?exportColumns=" + Ext.encode(exportColumns) +
	         '&fileName=' + fileName + '&fileType=' + fileType +
	         '&pageNum=' + grid.store.currentPage +
	         '&pageSize=' + grid.store.pageSize + '&' + searchPanelValue + '&' +
	         subgridExport;
	    }
	    me.unmask();
	   
	    return false;
    },
    _exportCanel:function(){
    	var me=this;
    	Hc.confirm("是否关闭？",function(flag){
    		if(flag!="yes"){
    			return;
    		}
    		me.up("window").close();
    	});
    }
});
Ext.define('Hc_Common.ux.HcFilter', {
    extend:'Ext.form.field.Text',
    alias: 'widget.Hcfilter',
    requires: [
        'Ext.menu.Menu'
    ],
    emptyText:"请输入查找内容...",
    _filterCls:"Hc-common-filter",
    filterType:"like",
    initComponent: function () {
        var me = this;

        me.callParent(arguments);
		me.createMenu();
        //设置默认选中类型
        me.setFilterType(me.filterType);
		//隐藏
	    me.getTrigger('Hcfilter').hide();

		if(me.menu){
        	me.menu.on("mouseover",function(){
        		me._menuMouseMove();
        	});
        	me.menu.on("mouseleave",function(){
        		me._menuMouseLeave();
        	});
        }
    },
    initEvents:function(){
    	var me=this;
        me.callParent(arguments);

        me.on("change",me._change);
        me.on("blur",me._blur);
        me.on("focus",me._focus);
        me.el.on("keyup",me._keyup);
    },
    triggers:{
		Hcfilter:{
			cls:"Hc-common-triggers-filter",
			handler:function(txtfield,filter,page){
				var me=this,
				x=me.el.dom.offsetWidth-61;
				me.menu.showBy(me,"tl-bl?",[x,0]);

			}
    	}
    },
    createMenu:function(){
		//
		var me=this;
			if(!me.menu){
			    me.menu=new Ext.menu.Menu({
				scope:me,
				maxWidth:100,
				minWidth:50,
				//activeItem:0,
				items:[{
					icon:"./resources/static/js/extjs/packages/ext-theme-classic/images/grid/filters/find.png",
					text:"like",
					value:"like",
					operator:"15",
					pressed: true,
					handler:function(item){
					    //设置选定的类型
					    me.setFilterType(this.text);
					    //传递参数给事件
					    me.fireEvent("onSelectFilter",me.getValue(),me.filterType,item.operator,me);
					}
				},
				{
					icon:"./resources/static/js/extjs/packages/ext-theme-classic/images/grid/filters/equals.png",
					text:"=",
					value:"equal",
					operator:"10",
					handler:function(item){
					    me.setFilterType(this.text);
					    me.fireEvent("onSelectFilter",me.getValue(),me.filterType,item.operator,me);
					}
				},
				{
					icon:"./resources/static/js/extjs/packages/ext-theme-classic/images/grid/filters/greater_than.png",
					text:">",
					value:"more",
					operator:"11",
					handler:function(item){
						me.setFilterType(this.text);
						me.fireEvent("onSelectFilter",me.getValue(),me.filterType,item.operator,me);
					}
				},
				{
					icon:"./resources/static/js/extjs/packages/ext-theme-classic/images/grid/filters/less_than.png",
					text:"<",
					value:"less",
					operator:"12",
					handler:function(item){
						me.setFilterType(this.text);
						me.fireEvent("onSelectFilter",me.getValue(),me.filterType,item.operator,me);
					}
				}]
		    });
		}
		return me.menu;
    },
    //获取当前选中的过滤类型
    getFilterType:function(){
    	return this.filterType;
    },
    //设置过滤类型 index,value,text,operator
    setFilterType:function(val){
    	var me=this,
    	items=me.menu.items.items,
    	item;
    	Ext.each(items,function(it,index){
    		if(val===index){
    			item=it;
    			return false;
			}
			if(it.value===val||it.operator===val||it.text===val){
				item=it;
				return false;
			}
		}); 
	
    	if(!item) return;
	

    	//切换css
    	me._setFilterCls(me._oddCls||item.value,item.value);
    	me.filterType=val;
    	me.operator=item.operator;
    },
    _menuMouseLeave:function(){
    	var me=this;
    	me.isSelect=false;
    },
    _menuMouseMove:function(){
    	var me=this;
    	me.isSelect=true;
    	me.getTrigger("Hcfilter").show();
    },
    _keyup:function(event){
    	var me=this,
    	field=me.component;
		field.fireEvent("onHcFilterKeyup",field.getValue(),field.filterType,field.operator,field,event);
    },
    _change:function(field,event){
		field.fireEvent("onHcFilterChange",field.getValue(),field.filterType,field.operator,field,event);
	
    },
    _focus:function(field,event){
    	field.getTrigger('Hcfilter').show();
    },
    _blur:function(field,event){
    	var me=this;
		if(!field.getValue()){
		    field.getTrigger('Hcfilter').hide();
		}
		
		if(me.menu&&!me.isSelect){
			
			me.menu.hide();
		}
    },
    _setFilterCls:function(oddCls,newCls){
    	var me=this;
		if(!oddCls){
		    oddCls=newCls;
		}
		me._oddCls=newCls;
		me.addCls(me._filterCls+'-'+newCls);
	
		if(oddCls!=newCls){
		    me.removeCls(me._filterCls+'-'+oddCls);
    	}
    }
});
Ext.define('Hc_Common.ux.HcHeaderFilter', {
    extend: 'Ext.plugin.Abstract',
    requires: [
        'Ext.grid.column.Column',
        'Ext.form.Text',
        'Ext.menu.Menu',
        'Hc_Common.ux.HcFilter'
    ],
    childEls: [
        'titleEl',
        'triggerEl',
        'textEl',
        'HcfilterEl'
    ],
    headerTpl: [
        '<div id="{id}-titleEl" data-ref="titleEl" {tipMarkup}class="', Ext.baseCSSPrefix, 'column-header-inner',
            '<tpl if="empty"> ', Ext.baseCSSPrefix, 'column-header-inner-empty</tpl>">',
            '<span id="{id}-textEl" data-ref="textEl" class="', Ext.baseCSSPrefix, 'column-header-text',
                '{childElCls}">',
                '{text}',
            '</span>',
            '<tpl if="!menuDisabled">',
                '<div id="{id}-triggerEl" data-ref="triggerEl" role="presentation" class="', Ext.baseCSSPrefix, 'column-header-trigger',
                '{childElCls}" style="{triggerStyle}"></div>',
            '</tpl>',
        '</div>',
	'<div id="{id}-HcfilterEl" data-ref="HcfilterEl" class="Hcfilter-common-body"></div>',
        '{%this.renderContainer(out,values)%}'
    ],

    alias: 'plugin.Hcheaderfilter',
    constructor: function(config) {
    	var me = this;
    	me.callParent(arguments);
    },
    init:function(grid){
		var me = this,
		columns=grid.columns;
		console.info(this);
		me.grid=grid;
		console.info("--------lijinxistart-------------");
		console.info(this);
		console.info(grid);
		Ext.each(columns,function(column){
			console.info("--------lijinxi-------------");
			console.info(me.headerTpl);
			column.renderTpl=me.headerTpl;
			var els=column.getChildEls();
			
			els.HcfilterEl={
					itemId:"HcfilterEl",
					name:"HcfilterEl"}
			;
			//column.setChildEls(els);
	
			column.on("afterrender",function(col){
				console.info("--------lijinxi33333333333333333333333-------------");
				console.info(col);
				console.info("--------lijinxi3444444444444444444444444444-------------");
				me.createHeaderEl(this);
			});
	
		});
		console.info("--------lijinxiend-------------");
		//添加方法
		me.initGridMethods(grid);
		
		//监听事件
		me.initStoreEvents(grid);
		
		me.callParent(arguments);
	
    },
    initStoreEvents:function(grid){
    	var me=this;
    	var store=grid.getStore();
    	
    	store.on("load",function(){
			//数据加载后缓存当前数据
			store.oddData=store.getData().items.HcCopy();
		}); 
    	
    	//初始化请求参数
    	store.on("beforeload",function(){
    		//me.initExtraParams();
		}); 
    	
    	
    },
    createHeaderEl:function(col){
		var me=this,
		grid=me.grid,
		operator;
		//判断是否为字段
		if(!col.dataIndex) return;
		//2014-4-28 dwh
		//获取过滤组件
		var HcfilterEl=col.HcfilterEl;
		if(HcfilterEl&&!col.HcfilterObj){
			//默认属性
			var config={
				width:"100%",
				renderTo:HcfilterEl.dom,
				property:col.dataIndex
			};
			
			if(!col.HcFilter){
				//默认显示扩展控件
				col.HcFilter={xtype:'Hcfilter'};
			}
			else if(!col.HcFilter.xtype){
				col.HcFilter.xtype="Hcfilter";
			}
			//默认类型
			if(!col.HcFilter.filterType){
				col.HcFilter.filterType="like";
			}
			
			switch(col.HcFilter.filterType){
				case "like":
					operator="15";
					break;
				case "=":
					operator="10";
					break;
				case ">":
					operator="11";
					break;
				case "<":
					operator="12";
					break;
				default:
					operator="10";
					break;
			}
			col.HcFilter.operator=operator;
			col.HcFilter.hidden=col.HcFilter.isOpen==false?true:false;
			
			Ext.applyIf(config,col.HcFilter);
			col.HcfilterObj=Ext.widget(config);
			
			//判断是否为扩展控件
			if(col.HcFilter.xtype==="Hcfilter"){
				
				col.HcfilterObj.on("onSelectFilter",function(val,type,operator,el){
					var isReadOnly=true;
					//更改类型
					this.operator=operator;
					
					me._changeValueFilter(grid.getFilterLocal(), isReadOnly);

				});
				//过滤所有
				col.HcfilterObj.on("onHcFilterKeyup",function(val,type,operator,el,event){
					var isLocal=grid.getFilterLocal(),
					keyCode=event.keyCode;
					
					me._keyFilter(isLocal, keyCode);
					
				});
				//过滤本地数据
				col.HcfilterObj.on("onHcFilterChange",function(val,type,operator,el,event){
					var isLocal=grid.getFilterLocal(),
					isReadOnly=false;
					
					me._changeValueFilter(isLocal, isReadOnly);
				});
			}
			else{
				col.HcfilterObj.el.on("keyup",function(field,event){
					var field=this.component,
					isLocal=grid.getFilterLocal(),
					keyCode=event.keyCode;
					
					me._keyFilter(isLocal, keyCode);
					
				});
				
				col.HcfilterObj.on("change",function(field,event){
					var isLocal=grid.getFilterLocal(),
					isReadOnly=field.inputEl.dom.readOnly;
					
					me._changeValueFilter(isLocal, isReadOnly);
				});
			}
			
		}
    },
    //按下回车时过滤方式
    _keyFilter:function(isLocal,keyCode){
    	var me=this;
		if(!isLocal){
			if(keyCode!=13) return;
			me._filterServer();
		}
		else{
			me._filterLocal();
		}
    },
    //输入数据时过滤方式
    _changeValueFilter:function(isLocal,isReadOnly){
    	var me=this;
		if(!isLocal){
			//解决drop控件无法触发keyup事件
			if(isReadOnly){
				me._filterServer();
			}
		}
		else{
			me._filterLocal();
		}
    },
    initExtraParams:function(){
    	var me=this,
		 grid = me.grid,
		 store=grid.getStore(),
		 extraParams=store.getProxy().extraParams,
		 filters=me._getFilters()||[];

    	if(grid.otherfilter){
    		filters=filters.concat(grid.otherfilter);
    	}
    	
    	//开启过滤所有状态时设置请求参数
    	if(grid.getFilterStatus()==true&&!grid.getFilterLocal()){
    		
			extraParams.queryCondition=Ext.encode(filters);
		}
		else{
			if(grid.otherfilter){
				extraParams.queryCondition=Ext.encode(grid.otherfilter);
			}
			else{
				
			
				delete extraParams.queryCondition;
			}
		}
    	
    	
    },
    _getFilters:function(){
		var me=this,
		 grid = me.grid,
		 columns=grid.columns,
		 filters=[];
		 
		 Ext.each(columns,function(item){
			 var obj=item.HcfilterObj,
			  filter={},
			  val;
			 if(obj&&!obj.isReadOnly&&!obj.hidden){
				 val=obj.getValue();
				 if(!Ext.isEmpty(val)){
					 filter={value:obj.getValue(),operator:obj.operator,property:obj.property};
					 filters.push(filter);
				 }
			 }
		 });
		return filters;
    },
    _filterLocal:function(){
    	var me=this,
		 grid = me.grid,
		 store=grid.getStore(),
		 HcFilters=me._getFilters();
    	
    	if(!store.oddData) return;
		var filterData=[];
		filterData=store.oddData.filter(function(item){
			var isFilter=true;
			Ext.each(HcFilters,function(filter){
				var property=item.data[filter.property];
				if(Ext.isEmpty(property)){
					
					property="";
				}
				if(Ext.isEmpty(filter.value))
				{
					filter.value="";
				}
				//其中一个条件不满足时跳出
				switch(filter.operator){
					//like
					case '15':
						//支持不区分大小写
						if(typeof(property)!="string"){
							isFilter= property.toString().toLowerCase().indexOf(filter.value.toLowerCase())>=0;
						}
						else{
							isFilter=  property.toLowerCase().indexOf(filter.value.toLowerCase())>=0;
						}
						
					break;
					//==
					case '10':
						isFilter= property==filter.value;
					break;
					case '12':
						var valType=typeof(property);
						switch(valType){
							case"number":
								isFilter=  property<parseInt(filter.value);
								break;
							case"string":
								isFilter=me._comparisonDateValue(property,filter.value);
		
								break;
							default:
								isFilter=false;
								break;
						}
					break;
					case '11':
						var valType=typeof(property);
						switch(valType){
							case"number":
								isFilter=  property>parseInt(filter.value);
								break;
							case"string":
								isFilter=!me._comparisonDateValue(property,filter.value);
		
								break;
							default:
								isFilter=false;
								break;
						}
					break;
				}
				//不满足当前条件时退出筛选
				if(!isFilter){
					return false;
				}
			});
			return isFilter;
		});
		me.initExtraParams();
		store.loadData(filterData);
    },
    //判断val1是否大于val2
    _comparisonDateValue:function(val1,val2){
    	var v1=Ext.Date.parse(val1, "Y-m-d H:i:s")||Ext.Date.parse(val1, "Y-m-d");
		var v2=Ext.Date.parse(val2, "Y-m-d H:i:s")||Ext.Date.parse(val2, "Y-m-d");
		
		if(v1&&v2){
			return v1.getTime()<v2.getTime();
		}
		else{
			return false;
		}
    },
    _filterServer:function(){
    	var me=this,
		 grid = me.grid,
		 store=grid.getStore();
    	
    	me.initExtraParams();
    	
		store.loadPage(1);
    },
    //过滤数据
    initGridMethods:function(grid){
    	var me=this;
		grid.getFilterStatus=function(){
			return grid.isFilter;
    	};
    	grid.setFilterStatus=function(status){
			
			var store=grid.getStore();
			if(status){
				grid.isFilter=true;
				grid.removeCls("grid-filter-hide");
			}
			else{
				grid.isFilter=false;
				grid.addCls("grid-filter-hide");
			}
			//grid.fireEvent("onFilterStatusChange",grid.isLocal,grid.isFilter,grid);
			me.initExtraParams();
    	};
    	
    	grid.getFilterLocal=function(){
			return grid.isLocal;
    	};
    	
    	grid.setFilterLocal=function(val){
    		grid.isLocal=val;
    		me.initExtraParams();
    		grid.fireEvent("onFilterLocalChange",me.isLocal,me.isFilter,me);
    		
    		if(val){
    			Ext.each(grid.columns,function(item){
    				item.HcfilterObj.show();
    			});
    		}
    		else{
    			Ext.each(grid.columns,function(item){
    				if(item.HcfilterObj.isOpen==false){
    					item.HcfilterObj.hide();
    				}
    				
    			});
    		}
    	};
    	//
    	grid.setOtherFilters=function(filters){
    		grid.otherfilter=filters;
    		me.initExtraParams();
    		
    	};
    }
});

Ext.define('Hc_Common.ux.HcImport', {
    extend:'Ext.window.Window',
    alias: 'widget.Hcimport',
    constructor:function(config){
    	var me=this;
    	
    	Ext.apply(me,config);
    	me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.items=[me._createHeader(),me._createForm()];

        me.bbar= ['->', {
        	glyph: Hc.Icon.btnSave,
        	text:"确定",
        	itemId:me.id+"_ok",
        	handler:me._ok
        }, {
        	glyph: Hc.Icon.btnCancel,
        	text:"退出",
        	itemId:me.id+"_canel",
        	handler:me._canel
        }];
       
        me.callParent(arguments);
    },
    layout:"vbox",
    title:"数据导入",
    modal:true,
    resizable:false,
    _gridHeight:300,
    ATTRS:{
    	btns:{},
    	fields:{},
    	grids:{}
    },
    initEvents:function(){
    	//注册事件
    	var me=this; 
    	me.ATTRS.grids.leftGrid.on("celldblclick",function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts){
    		if(record.get("isReadOnly")){
				return;
			}
			
			var store=me.ATTRS.grids.rightGrid.getStore();
			store.add(record.data);
			
			grid.getStore().remove(record);
    	});
    	me.ATTRS.grids.rightGrid.on("celldblclick",function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts){
    		
			
			var store=me.ATTRS.grids.leftGrid.getStore();
			store.add(record.data);
			
			grid.getStore().remove(record);
    	});
    	
    	me.ATTRS.btns.btnAdd.on("click",function(){
    		me._add();
    	});
    	me.ATTRS.btns.btnRemove.on("click",function(){
    		me._remove();
    	});
    	me.ATTRS.btns.btnUp.on("click",function(){
    		me._up();
    	});
    	me.ATTRS.btns.btnDown.on("click",function(){
    		me._down();
    	});
    	
    },
    _fields:[ 'dataIndex', 'header','isReadOnly','allowBlank','mainKey'],
    _createHeader:function(){
    	var me=this;
    	var desc="明导入说明导入说明导入说明导入说明";
    	var header=Ext.create('Ext.Component',{
    				itemId:me.id+"_header",
    				html:"<div class='Hc-import-des'>"+desc+"</div>"
    			});
    	return header
    },
    _createLeftGrid:function(){
    	//创建表单
    	var me=this,
    	columns=me.workObject.columns||[],
    	grid,
    	store,
    	data=[];
    	//生成行数据
    	Ext.each(columns,function(item){
    		var header=item.text,
    		allowBlank=true,
    		isReadOnly=item.hidden,
    		editor=item.editor;
    		
    		if(editor){
    			isReadOnly=false;
    			if(editor.allowBlank==false){
    				allowBlank=false;
    			}
    			else{
    				allowBlank=true;
    			}
    		}
    		else{
    			isReadOnly=true;
    		}
    		
    		var dataItem={
				header:header,
				dataIndex:item.dataIndex,
				isReadOnly:isReadOnly,
				allowBlank:allowBlank,
				mainKey:true
    		};
    		if(!item.hidden){
    			data.push(dataItem);
    		}
    		
    	});
    	
    	store=new Ext.data.Store({
    		fields:me._fields,
    		data:data
    	});
    	
    	grid=new Ext.create('Ext.grid.Panel',{
    		columnWidth:0.3,
    		
    		height:me._gridHeight,
    		selModel:Ext.create('Ext.selection.RowModel',{mode:"SIMPLE"}),//支持多选
    		//hideHeaders:true,
    		columns:[{
    			header:"数据列",
    			dataIndex:"isReadOnly",
    			width:"100%",
    			editor:{},
    			renderer:function(val,mateData,record,rowIndex,celindex,store,grid){
    				var text=record.get("header");
    				if(record.get("isReadOnly")){
    					
    					text+="<span style='color:red;'>[只读]</span>";
    				}
    				
    				return text;
    			}
    		}],
    		store:store
    	});
    	store.loadData(data);
    	me.ATTRS.grids.leftGrid=grid;
    	return grid;
    	
    },
    _createRightGrid:function(){
    	//创建表单
    	var me=this,
    	grid,
    	store;
    	
    	store=new Ext.data.Store({
    		fields:me._fields
    	});
    	
    	grid=new Ext.create('Ext.grid.Panel',{
    		columnWidth:0.5,
    		height:me._gridHeight,
    		selModel:Ext.create('Ext.selection.RowModel',{mode:"SIMPLE"}),//支持多选
    		viewConfig: {
    	        plugins: {
    	            ptype: 'gridviewdragdrop',
    	            dragText: '拖动行排序'
    	        }
    	    },
    		//hideHeaders:true,
    		columns:[{
    			header:"Excel列",
    			dataIndex:"header",
    			width:"49.5%",
    			renderer:function(val,mate){
    				
    				return val;
    			}
    		},
    		{
    			header:"字段类型",
    			dataIndex:"allowBlank",
    			width:"25%",
    			editor: {allowBlank: false},
				xtype:'bllookupedit',
				estore: new Ext.data.Store({
					fields:["text","value"],
					data:[{
						text:"必填",
						value:false
					},
					{
						text:"非必填",
						value:true
					}]
				}),
				gstore: store,
				displaymember:'text',
				valuemember:'value',
				renderer:function(val,mate){
					mate.style="color:blue;";
					if(!val){
						return '必填';
					}
					else{
						return '非必填';
					}
				}
    		},
    		{
    			header:"验证方式",
    			dataIndex:"mainKey",
    			width:"25%",
    			xtype:'bllookupedit',
				estore: new Ext.data.Store({
					fields:["text","value"],
					data:[{
						text:"不允许重复",
						value:true
					},
					{
						text:"允许重复",
						value:false
					}],
				}),
				gstore: store,
				displaymember:'text',
				valuemember:'value',
				renderer:function(val,mate){
					mate.style="color:blue;";
					if(val){
						return '不允许重复';
					}
					else{
						return '允许重复';
					}
				}
    		}],
    		plugins: {
    	        ptype: 'cellediting',
    	        clicksToEdit: 1
    	    },
    		store:store
    	});
    	
    	me.ATTRS.grids.rightGrid=grid;
    	return grid;
    	
    },
    _createForm:function(){
    	//创建表单
    	var me=this,
    	form;
    	
    	form=new Ext.form.Panel({
    		border:false,
    		width:600,
    		defaults:{
				style:'margin:5px 0px 5px 5px;',
			},
    		items:[{
    			border:false,
    			layout:"column",
    			items:[me._createLeftGrid(),
    			       {
    					border:true,
    					height:me._gridHeight,
    					columnWidth:0.2,
    					layout: {
    				        align: 'middle',
    				        pack: 'center',
    				        type: 'vbox'
    					},
    					defaults:{
    						xtype:"button",
    						width:80,
    						height:30,
    						cls:"Hc-export"
    					},
    					items:[
				       {
    						text:"添加",
    						iconCls:"Hc-btn-icon-right",
    						style:"margin-bottom:20px;",
    						itemId:me.id+"_add"
    					},{
    						text:"删除",
    						iconCls:"Hc-btn-icon-left",
    						style:"margin-bottom:20px;",
    						itemId:me.id+"_remove"
    					},{
    						text:"上",
    						iconCls:"Hc-btn-icon-up",
    						style:"margin-bottom:20px;margin-top:20px;",
    						itemId:me.id+"_up"
    					},{
    						text:"下",
    						iconCls:"Hc-btn-icon-down",
    						itemId:me.id+"_down"
    					}]
			       },
			       me._createRightGrid()
	       ]},
        	{
	    	   layout:"column",
  				xtype:'fieldset',
  				title:"高级设置",
  				collapsible: true,
  				defaults:{
  					labelWidth: 180,
  					columnWidth:1
  				},
	       		items:[
   		       {
   		    	   itemId:me.id+"_isValidData",
   		    	   fieldLabel:"是否全部验证通过才导入",
   		    	   layout: 'hbox',
   		    	   style:"margin-top:5px;",
   		    	   xtype:"radiogroup",
   		    	   defaults:{
   		    		   style:"margin-left:10px;"
   		    	   },
   		    	   items:[{
   		    		   	checked: true,
   		    		   	inputValue:true,
						name:"validStatus",
						boxLabel  : '是(Y)',
						itemId :me.id+ 'checkboxY'
   		    	   },
   		    	   {
   		    		   inputValue:false,
   		    		   name:"validStatus",
   		    		   boxLabel  : '否(N)',
   		    		   itemId :me.id+ 'checkboxN'
  		    	   }]
	       			
               },
	       		{
            	   hidden:true,
            	   fieldLabel: '公共验证条件(Json字符串数组)',
            	   xtype:"textareafield",
            	   itemId:me.id+"validText",
            	   style:"margin-bottom:5px;margin-top:10px;"
	       		}]
        	}]
    	});
    	
    	//获取控件
    	me.ATTRS.btns.btnAdd=form.down('[itemId='+me.id+'_add]');
    	me.ATTRS.btns.btnRemove=form.down('[itemId='+me.id+'_remove]');
    	me.ATTRS.btns.btnUp=form.down('[itemId='+me.id+'_up]');
    	me.ATTRS.btns.btnDown=form.down('[itemId='+me.id+'_down]');
    	
    	me.ATTRS.fields.isValidData=form.down('[itemId='+me.id+'_isValidData]');
    	
    	return form;
    },
    _add:function(){
    	var me=this,
    	grid=me.ATTRS.grids.leftGrid,
    	store=grid.getStore(),
    	sel=grid.getSelection();
    	
    	if(!sel||sel.length<=0){
    		Hc.alert("请选择左边数据列");
    		return;
    	}
    	
    	Ext.each(sel,function(item){
    		if(!item.data.isReadOnly){
    			me.ATTRS.grids.rightGrid.getStore().add(item.data);
        		store.remove(item);
    		}
    		
    	});
    	
    },
    _remove:function(){
    	var me=this,
    	grid=me.ATTRS.grids.rightGrid,
    	store=grid.getStore(),
    	sel=grid.getSelection();
    	
    	if(!sel||sel.length<=0){
    		Hc.alert("请选择右边Excel列");
    		return;
    	}
    	
    	Ext.each(sel,function(item){
    		me.ATTRS.grids.leftGrid.getStore().add(item.data);
    		store.remove(item);
    	});
    },
    _up:function(){
    	var me=this;
    },
    _down:function(){
    	var me=this;
    },
    //点击确定
    _ok:function(){
    	var me=this,
    	winPanel=me.up("window"),
    	form=winPanel.down("form");
    	if(!form.isValid()) return;
    	
    	winPanel._export();
    },
    
    _canel:function(){
    	var me=this;
    	Hc.confirm("是否关闭？",function(flag){
    		if(flag!="yes"){
    			return;
    		}
    		me.up("window").close();
    	});
    }
});
/**
 * Description: 数据精灵
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/4/10 0010
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.ux.SearchHelpField', {
    extend: 'Ext.form.field.Text',
    xtype: 'searchhelpfield',
    enableKeyEvents: true,

    //指定后端取数据的URL
    url: '',

    //指定弹出窗中的 grid 列
    gridColumns: null,

    //指定弹出窗中的查询条件
    searchItems: null,
    searchColumn:4,
    fieldWidth:'100%',

    winTitle: '选择器',
    winHeight:500,
    winWidth:700,
    isAutoLoad:true,

    //返回值写入其它的列（如有多个，用逗号分隔）
    otherFields: '',

    //通过哪个列的值去过滤(如有多个，用逗号分隔)
    fromFields: '',

    //字段映射对照，即当页面的字段名跟精灵中的字段名不同时，做一个对照表，如("id=dictId,text=dictName")
    fieldMap:'',

    listeners: {
        keydown: 'onKeyDown',
        keypress:'onKeyPress',
        blur:'onBlur',
        afterrender:'onrendered',
        change:'onChange',
        scope: 'this'
    },

    triggers:{
        search: {
            cls: 'x-form-search-trigger',
            weight: 1,
            handler: 'showSelectWin',
            scope: 'this'
        }
    },

    needCall:false,
    checkValue:true,

    initComponent: function () {
        var me = this;
        me.needCall = false;
        me.enableKeyEvents = true;
        me.callParent(arguments);
        me.oldValue = me.getValue();

        if(!me.gridColumns){
            me.getTrigger('search').hide();
        }
    },
    onrendered:function(){
        var me = this;
        if(me.inputEl) {
            me.inputEl.on('dblclick', function () {
                me.showSelectWin();
            },me);
        }
    },

    onChange:function(){
        var me = this;
        if(Ext.isEmpty(me.getValue())){
            me.needCall = false;
            me.oldValue = '';
            if(me.up('grid')) return;
            me.setOtherFieldsVal();
        }
    },

    /**弹出选择框*/
    showSelectWin: function () {
        var me = this;
        if (!me.gridColumns || !me.url || me.readOnly || me.disabled)return;
        var fields = [];
        Ext.each(me.gridColumns, function (column) {
            fields.push(column.dataIndex);
            
            //判断是否查询表单已存在
            Ext.each(me.searchItems, function (scolumn) {
            	if(column.dataIndex==scolumn.name){
            		if(!column.HcFilter){
            			column.HcFilter={};
            		}
            		//关闭当前过滤字段
            		column.HcFilter.isOpen=false;
            	}
            });
            
        });
        var store = Ext.create('Hc_Common.store.Base', {
            fields: fields,
            autoLoad: false,
            proxy: {
                url: me.url
            }
        });

        var params = me.getFromFieldsVal();
        
        
        var items = [{
            xtype: 'grid',
            border: false,
            region: 'center',
            columns: me.gridColumns,
            plugins:["Hcheaderfilter"],
            columnLines: true,
            selMode: {
                mode: 'SIMPLE'
            },
            store: store,
            bbar: {
                xtype: 'pagingtoolbar',
                plugins: Ext.create('Ext.ux.ComboPageSize'),
                store: store
            },
            listeners: {
                itemdblclick: function (obj, record) {
                    me.needCall = false;
                    me.setOtherFieldsVal(record.data);
                    obj.up('window').close();
                }
            }
        }];

        var fn=function () {
            var form = win.down('form'),
                s = [].concat(params);
            if (!form.isValid()) return;
            var val = form.getValues();
            for (var field in val) {
                if (!Ext.isEmpty(val[field])) {
                    s.push({
                        property: field,
                        value: val[field],
                        operator: 15
                    });
                }
            }
            //dwh
            //设置过滤参数
            if(win.down('grid').setOtherFilters){
            	win.down('grid').setOtherFilters(s);
            }
            //store.proxy.extraParams.queryCondition = JSON.stringify(s);
            store.reload();
        };

        if (me.searchItems) {
            var sitems = [].concat(me.searchItems);
            items.push({
            	border:false,
                xtype: 'form',
                region: 'north',
                bodyPadding: 3,
                items: [{
                		border:false,
	                	defaultType: 'textfield',
	                	layout: {
	                        type:'table',
	                        columns:me.searchColumn
	                    },
	                    defaults: {
	                        labelAlign: 'right',
	                        labelWidth: 80,
	                        width: me.fieldWidth
	                    },
	                	itemId:"searchfields",
	                	items:sitems
            	}],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items:['->',{
                            	xtype: 'button',
                                text: '查询',
                                width: 60,
                                margin: '0 0 0 5',
                                glyph: Hc.Icon.btnSearch,
                                handler: fn
                            },
                            {
                                xtype: 'button',
                                text: '确认',
                                glyph: Hc.Icon.btnSave,
                                handler: 'onReturnValue',
                                scope: me
                            }, {
                                xtype: 'button',
                                text: '取消',
                                glyph: Hc.Icon.btnCancel,
                                handler: function (btn) {
                                    btn.up('window').close();
                                }
                            },  {
                                text: '过滤',
                                icon: './resources/static/js/extjs/packages/ext-theme-classic/images/grid/filters/find.png',
                                itemId: me.id+'btnFilter',
                                reference: 'btnFilter',
                                xtype: 'splitbutton',
                                menu: [{
                                    text: '本页',
                                    itemId: me.id+'btnFilterLocal',
                                    reference: 'btnFilterLocal',
                                    handler: function(btn){
                                    	me.onSetFilterLocal(btn);
                                    } 
                                }, {
                                    text: '所有',
                                    itemId: me.id+'btnServer',
                                    reference: 'btnFilterServer',
                                    handler: function(btn){
                                    	me.onSetFilterServer(btn);
                                    } 
                                },{
                                	text: '关闭',
                                    itemId: me.id+'btnFilterClose',
                                    reference: 'btnFilterClose',
                                    handler: function(btn){
                                    	me.onFilterClose(btn);
                                    } 
                                }]
                            }]
                }]
            });
        }

        var win = Ext.widget('window', {
            title: me.winTitle,
            width: me.winWidth,
            height: me.winHeight,
            modal: true,
            constrain:true,
            layout: 'border',
            closeAction: 'destroy',
            autoShow: true,
            items: items
        });

        var searchform = win.down('form'),
            objs = searchform && searchform.query('textfield,combo,datefield,numberfield');
        if(objs){
            Ext.each(objs,function(txt){
                txt.on('specialkey',function(obj,e){
                    if(e.ctrlKey && e.getKey()=== e.ENTER){
                        fn(obj);
                    }
                });
                
                //dwh 添加双击清空数据
                txt.labelEl.on('dblclick',function(obj,e){
                	
                	//dwh
                	//判断当前组件是否可用
                	if(txt.readOnly||txt.canInput==false||txt.isDisabled()==true){
                		return;
                	}
                	txt.setValue("");
                });
            });
        }
        
        //dwh 放在过滤之前
        win.searchField=me;
        
        var grid=win.down('grid');
    	
        
        //dwh 
        if (!Ext.isEmpty(params)) {
        	//设置grid过滤参数
        	if(grid.setOtherFilters){
        		grid.setOtherFilters(params);
        	}
        }
        //是否默认加载
        if (me.isAutoLoad) {
            store.load();
        }
        
      //关闭网格过滤
        if(grid.setFilterStatus){
        	grid.setFilterStatus(false);
        }
        
        //初始化过滤文本
        me._setBtnFilterText(win.down('form').down('[itemId='+me.id+'btnFilter]'));
        
    },
    getSearchItems:function(){
    	
    },
  //dwh  切换过滤按钮显示
    onFilterClose: function (btn) {
    	var me = this, win = btn.up('window'),
        grid = win.down('grid');
    	if(typeof(grid.setFilterStatus)=="function"){
    		grid.setFilterStatus(false);
    	
    		me._setBtnFilterText(btn.up("[itemId='"+me.id+"btnFilter']"));
    	}
    },
    //dwh	当前页
    onSetFilterLocal:function(btn){
    	var me = this, win = btn.up('window'),
        grid = win.down('grid');
    	grid.isLocal=true;
    	if(typeof(grid.setFilterStatus)=="function"){
    		grid.setFilterStatus(true);
    	}
    	me._setBtnFilterText(btn.up("[itemId='"+me.id+"btnFilter']"));
    },
    //所有
    onSetFilterServer:function(btn){
    	var me = this, win = btn.up('window'),
        grid = win.down('grid');
    	grid.isLocal=false;
    	if(typeof(grid.setFilterStatus)=="function"){
    		grid.setFilterStatus(true);
    	}
    	me._setBtnFilterText(btn.up("[itemId='"+me.id+"btnFilter']"));
    },
    //显示文本
    _setBtnFilterText:function(btn){
    	var me = this, win = btn.up('window'),
        grid = win.down('grid');
    	
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
    /**弹出框返回值*/
    onReturnValue: function (btn) {
        var me = this, win = btn.up('window'),
            grid = win.down('grid'),
            items = grid.getSelection();
        if (items.length < 1) {
            Hc.alert('必须选择一条记录');
            return;
        }
        me.needCall = false;
        me.setOtherFieldsVal(items[0].data);
        win.close();
    },

    /**数据发生变化时*/
    onBlur:function() {
        this.sendToServer();
    },

    /**按下回车键时*/
    onKeyDown: function (e) {
        var me = this;
        if (e.getKey() === e.ENTER || e.getKey() === e.TAB) {
            me.sendToServer();
        } else if (e.getKey() === e.F4) {
            me.showSelectWin();
        } else if (e.getKey() === e.BACKSPACE|| (e.ctrlKey && e.getKey()== e.V)) {
            me.needCall = true;
        }
    },

    onKeyPress:function(e){
        this.needCall = true;
    },

    getFieldMap:function(){
        var map=[],
            me = this;
        if(!me.fieldMap) return map;
        var list = me.fieldMap.split(',');
        Ext.each(list, function (item) {
            var keys = item.split('=');
            if(keys.length==2){
                var obj ={
                    s:keys[0],
                    t:keys[1]
                };
                map.push(obj)
            }
        });
        return map;
    },

    /**获取过滤条件*/
    getFromFieldsVal:function() {

        var me = this, params = [];

        if (!me.fromFields) return params;

        var fields = me.fromFields.split(','),
            context = me.up().context, val,
            form = me.up('form'),
            fieldmap = me.getFieldMap();
        if (context || form) {
            Ext.each(fields, function (f) {
                val='';
                if (context) {
                    val = context.record.get(f);
                }
                if (!val && form) {
                    var txt = Hc.getField(form, f);
                    if (txt) {
                        val = txt.getValue();
                    }
                }
                var map = Ext.Array.findBy(fieldmap, function (fm) {
                    return fm.s == f;
                });
                params.push({
                    property: (map && map.t) || f,
                    value: val || '',
                    operator: 10
                })
            });
        }

        return params;
    },

    /**提交后端，返回对应的记录*/
    sendToServer:function() {
        var me = this;
        if(!me.needCall || !me.checkValue) return;
        me.needCall = false;

        if (!me.url || Ext.isEmpty(me.getValue())) {
            me.setOtherFieldsVal();
            return;
        }

        var params = me.getFromFieldsVal(),
            val = me.getValue(),
            map = Ext.Array.findBy(me.getFieldMap(),function(fm){
                return fm.s == me.name;
            }),
            fname = map && map.t || me.name;

        params.push({
            property: fname,
            value: val,
            operator: 10
        });

        var options = {
            url: me.url,
            params: {
                queryCondition: JSON.stringify(params)
            },
            method: 'POST',
            success: function (d) {
                try {
                    var result = JSON.parse(d.responseText);
                    if (!result.list || result.list.length == 0) {
                        Hc.alert('输入【'+val+'】是无效的值', function () {
                            me.setOtherFieldsVal();
                        });

                    } else {
                        me.setOtherFieldsVal(result.list[0]);
                    }
                } catch (e) {
                    Hc.alert('输入值【'+val+'】后端验证失败', function () {
                        me.setOtherFieldsVal();
                    });

                }
            },
            failure: function () {
                Hc.alert('数据精灵验证失败，请联系管理员', function () {
                    me.setOtherFieldsVal();
                });
            }
        };
        Hc.callServer(options);
    },

    /**设置相关控件的值*/
    setOtherFieldsVal: function (itemInfo) {

        var me = this,
            form = me.up('form'),
            grid = me.up('grid'),
            context = me.up().context,
            record,
            fieldmap = me.getFieldMap();

        itemInfo = itemInfo || {};

        if (context) {
            record = context.record;
        } else if (form) {
            record = form.getRecord();
        }

        if(grid && context){
            grid.editingPlugin.startEdit(record,context.column);
        }

        if (me.afterCall(me, itemInfo, record, context) === false) return;

        var map = Ext.Array.findBy(fieldmap, function (fm) {
            return fm.s == me.name;
        }),
            fname = map &&map.t||me.name,
            selfValue = itemInfo[fname];

        if(selfValue==null) selfValue = me.oldValue;


        me.setValue(selfValue);
        if (context) {
            record.set(me.name, selfValue);
        }

        me.oldValue = me.getValue();

        if (!me.otherFields) return;

        var fields = me.otherFields.split(',');
        Ext.each(fields, function (field) {
            map = Ext.Array.findBy(fieldmap, function (fm) {
                return fm.s == field;
            });
            fname = map && map.t || field;
            if (context) {
                record.set(field, itemInfo[fname] || '');
            } else {
                var txt = Hc.getField(form, field);
                if (txt) {
                    txt.setValue(itemInfo[fname] || '');
                }
                if (record) {
                    record.set(field, itemInfo[fname] || '');
                }
            }
        });
    },
    /**返回值之后处理接口，由开发人员处理
     * txtobj ， 控件本身
     * newdata,  返回的记录值
     * record,   原记录值即 form，或　grid 绑定的行
     * context, 网格中编辑事件对应的 context
     * */
    afterCall:function(txtobj, newdata,record,context) {
    }
});
/**
 * Description: 扩展网格列类,包装comobox控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月18日上午8:40:55
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月18日     	yu.jh
 * 2015年3月28日     	liutao	bllookupedit一级联动修改 若需联动column需绑定一额外store 不能直接使用editor中的store
 * 		若不绑定，则会出现下拉框值有部分数据无法正常展示
 */
Ext.define('Hc_Common.ux.extGridComoboxColumn',{
    extend:'Ext.grid.column.Column',
    alias:'widget.bllookupedit',
    estore: null,		//Editor的store
    gstore: null,		//自身store
    readOnly: false,	//是否只读 在只读情况下不可以进行选择 没有必要创建下拉选择框
    editable:true,
	initComponent:function() {
		var me = this;
		me.type = "0";	//默认为0 只有当未指定valuemember的时候才置为1
		if (me.readOnly) {
			//me.editor = false;
			if (me.gstore == null) {
				var sstore = null;
				if (me.valuemember == null) {
					me.valuemember = "num";
					me.displaymember = "name";
					var tt = tt || [];
					var s = me.displayvalue.split(":");
					for (var i = 0; i < s.length; i++) {
						var v = s[i].split("=");
						var obj = {};
						var s1 = v[0];
						var s2 = v[1];
						obj.num = s1;
						obj.name = s2;
						tt.push(obj);
					}
					sstore = Ext.create('Ext.data.Store', {
						fields: [me.valuemember, me.displaymember],
						data: tt
					});
					me.type = "1";
				}
				else {
					sstore = Ext.create('Hc_Common.store.Base', {
						fields: [me.valuemember, me.displaymember],
						proxy: {
							url: me.displayvalue
						}
					});
				}
				sstore.reload();
				me.store = sstore;
			} else {
				me.store = me.gstore;
			}
		} else {

			var allowBlank = me.editor && me.editor.allowBlank;

			me.editor = Ext.create("Hc_Common.ux.ComboCustom", {
				displaymember: me.displaymember,
				valuemember: me.valuemember,
				displayvalue: me.displayvalue,
				store: me.estore,
				editable:this.editable
			});

			if (allowBlank === false) {
				me.editor.allowBlank = false;
			}

			//是否存入字段名 字段名称
			if (me.valuemember == null) {
				me.valuemember = "num";
				me.displaymember = "name";
				me.type = "1";
			}
			if (me.gstore == null) {
				me.store = me.editor.store;
			} else {
				me.store = me.gstore;
			}
		}
		try {
			me.callParent();
		} catch (e) {
			Hc.alert(e);
		}
	},
    defaultRenderer: function(value){
    	var me = this,
    		index = index || {};
    	if (value==null) return;
		if (me.type=="0"){
				index= me.store.findExact(me.valuemember, value);
	    	}
	    	else{
	    		index= me.store.findExact(me.valuemember, value.toString());
	    	}
	    	return index > -1 ? me.store.getAt(index).data[me.displaymember]: value;
	    }
});

/**
 * Description: 日期网格扩展控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月30日下午3:48:10
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月30日     	yu.jh
 */
Ext.define('Hc_Common.ux.extGridDateColumn',{
    extend:'Ext.grid.column.Date',
    alias:'widget.blgriddate',
    format:"Y-m-d",
    readOnly:false,
	editable : false,
    initComponent:function(){
    	if (!this.readOnly){
			var allowBlank = this.editor && this.editor.allowBlank;
    		this.editor=Ext.create("Hc_Common.ux.DateTimeField",{
    			format:this.format,
    			readOnly:this.readOnly,
    			value:this.value,
    			contype:"date",
    			editable:this.editable
    		});
			if (allowBlank === false) {
				this.editor.allowBlank = false;
			}
    	}
        this.callParent();
    }
});
/**
 * Description: 日期时间网格扩展控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月30日下午2:53:29
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月30日     	yu.jh
 * 用法： {dataIndex: 'modifyTime', text: '修改时间',xtype: 'blgriddatetime'}
 * 默认可编辑，若只读，请设置readOnly:true
 */
Ext.define('Hc_Common.ux.extGridDateTimeColumn',{
    extend:'Ext.grid.column.Date',
    alias:'widget.blgriddatetime',
    format:"Y-m-d H:i:s",
    readOnly:false,
    initComponent:function(){
    	if (!this.readOnly){
			var allowBlank = this.editor && this.editor.allowBlank;
    		this.editor=Ext.create("Hc_Common.ux.DateTimeField",{
    			format:this.format,
    			readOnly:this.readOnly,
    			value:this.value,
    			contype:"datetime"
    		});
			if (allowBlank === false) {
				this.editor.allowBlank = false;
			}
    	}
        this.callParent();
    }
});
/**
 * Description:启用状态网格列控件 
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月18日上午8:52:49
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月18日     	yu.jh
 */
Ext.define('Hc_Common.ux.gridComboUseFlag',{
    extend:'Hc_Common.ux.extGridComoboxColumn',

    alias:'widget.gridcombouseflag',
    displayvalue:"1=启用:0=禁用",
    editable:false,

    initComponent:function(){
    	
        this.callParent();
    }
});
/**
 * Description:是否选择网格列控件 
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月18日上午8:51:07
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月18日     	yu.jh
 */
Ext.define('Hc_Common.ux.gridComboYesNo',{
    extend:'Hc_Common.ux.extGridComoboxColumn',

    alias:'widget.gridcomboyesno',
    displayvalue:"1=是:0=否",
    editable:false,

    initComponent:function(){
    	
        this.callParent();
    }
});
