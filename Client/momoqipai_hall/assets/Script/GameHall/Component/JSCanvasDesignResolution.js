/* jshint esversion:6 */
cc.Class({
    extends: cc.Component,

    properties: 
    {
        //设计尺寸
        nodeContent : cc.Node, //内容总节点

        wGameWidth:0,
        wGameHeight:0,

        //屏幕方向
        wScreenDir: cc.macro.ORIENTATION_LANDSCAPE,
    },

    // use this for initialization
    onLoad: function () 
    {
        //设置适配
       // setDesignResolutionSize( this.wGameWidth, this.wGameHeight , this.node);

        //不是PC web
        if( cc.sys.isBrowser && cc.sys.os !="Windows" && cc.sys.os !="OS X" )
        {
            if((this.wGameHeight > this.wGameWidth)) {
                cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            }
            else {
                cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            }
            cc.view._orientationChange();
        }
        else if ( cc.sys.browserType == "wechatgame" )
        {
            this.OnRotationFrame();

            if((this.wGameHeight > this.wGameWidth)) {
                cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            }
            else {
                cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            }
            cc.view._orientationChange();
        }
    },

    onDestroy ()
    {

    },
});
