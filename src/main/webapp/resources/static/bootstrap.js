/**
 * Description: 统一引用 css,js 资源文件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/22 0022
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */

var Hc = Hc || {};
console.info(Hc);
var hao=hao||{};
/*Extjs主题*/
Hc.theme = 'classic';

/*js、css版本*/
Hc.version = '20150203';


/*子系统路径初始化,会在mainController中更改（读取DB中的配置）*/
Hc.basePath = '/hc-uc-web/';
Hc.mdmPath = '/hc-mdm-web/';
Hc.mmsPath = '/hc-mm-web/';
Hc.sdsPath = '/hc-sd-web/';
Hc.ppsPath = '/hc-pp-web/';
Hc.fasPath = '/hc-fa-web/';
Hc.qmsPath = '/hc-qm-web/';
Hc.pdsPath = '/hc-pd-web/';
Hc.templatePath = '/hc-template-web/';

/*字体图标*/
Hc.Icon= {
    btnUser: 0xf007,
    btnSetting: 0xf013,
    btnHelp: 0xf059,
    btnExit: 0xf011,
    btnMsg: 0xf0e0,
    btnSearch: 0xf002,
    btnReset: 0xf079,
    btnRefresh:0xf021,
    btnAdd: 0xf15c,
    btnCopy: 0xf0c5,
    btnEdit: 0xf044,
    btnDelete: 0xf014,
    btnSave: 0xf0c7,
    btnUndo: 0xf0e2,
    btnCancel: 0xf112,
    btnImport: 0xf022,
    btnExport: 0xf022,
    btnPrint: 0xf02f,
    btnLock: 0xf023,
    btnUnLock: 0xf09c,
    btnHome: 0xf015,
    btnOther:0xf080,
    btnMoveUp:0xf062,
    btnMoveDown:0xf063,
    btnMoveLeft:0xf060,
    btnMoveRight:0xf061,
    btnPrev:0xf048,
    btnNext:0xf051,
    btnAudit:0xf14a,
    btnAddressList:0xf02d,
    btnGroup:0xf0c0
};


/*加载Js、Css函数
 * url  路径
 * isVersion 是否需要加版本号
 * hasDebug 是否存在Debug 文件 * 
 */
Hc.loadJsCss = function(url,isVersion,hasDebug) {
    var isLocal = location.href.indexOf('localhost') > -1||location.href.indexOf('127.0.0.1')>=-1,
        isJs = url.substr(url.length - 3) == ".js";
     console.info("执行了没有");
    if (hasDebug && isLocal && isJs) {
        url = url.substr(0, url.length - 3) + '-debug.js';
    }
    
    if(isVersion){
        url+="?"+Hc.version;
    }
    console.info("执行了没有55555："+url);
    if (isJs) {
        document.write('<script src="' + url + '" type="text/javascript"></' + 'script>');
    } else {
        document.write('<link type="text/css" rel="stylesheet" href="' + url + '"/>');
    }
};

(function() {
    Hc.loadJsCss('resources/static/js/extjs/packages/ext-theme-' + Hc.theme + '/my-custom-theme-all.css');
	Hc.loadJsCss('resources/static/css/font-awesome.min.css');
	Hc.loadJsCss('resources/static/css/hc-all.css', true);
	Hc.loadJsCss('resources/static/js/extjs/ext-all-debug.js', true);
	Hc.loadJsCss('resources/static/js/ext-ux/ext-ux-all-debug.js', true);
	Hc.loadJsCss('resources/static/js/hc/base-all.js', true, true);
	Hc.loadJsCss('resources/static/js/hc/hc-ux-all.js', true, true);
	Hc.loadJsCss('resources/static/js/extjs/packages/ext-locale/ext-locale-zh_CN.js');
	//Hc.loadJsCss('resources/static/js/open/security.js');
})();



