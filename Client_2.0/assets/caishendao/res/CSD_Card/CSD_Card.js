/*jshint esversion:6*/

let scatterIndex = 1; //第几个scatter 用于音效控制
//滚动框相关
//一共有15个滚动框
cc.Class({
    extends: cc.Component,

    properties: {
        sp_top: { //start代码绑定   sp_mid滚动上面的一个和sp_mid，轮换实现滚动效果
            default: null,
            type: cc.Node,
        },
        sp_mid: { //start代码绑定
            default: null,
            type: cc.Node,
        },
        sp_anim: { //start代码绑定 负责播放动画sprite
            default: null,
            type: cc.Node,
        },
        icons: { //可以变换的图片集合
            default: [],
            type: cc.SpriteFrame,
        },
        icons_mofu: { //模糊
            default: [],
            type: cc.SpriteFrame,
        },
        b_stop: {  //控制旋转
            default: false,
        },
        b_stoped: {  //控制旋转是否开始停止过程
            default: false,
        },
        i_icon: { //显示的结果
            default: 1,
        },
        i_rollHeight: 153.00,// 滚动框高度，也是icon高度
    },
    onLoad() {
        this.border = cc.find("border", this.node);
        this.nodeScore = cc.find("score", this.node);
        if (this.nodeScore) this.nodeScore.active = false;
        this.border.active = false;
    },
    //播放动画
    playAnim() {
        //显示动画组建
        // this.sp_anim.getComponent(cc.Sprite).spriteFrame = this.icons[this.i_icon];
        // this.sp_anim.opacity = 255;
        // this.sp_top.opacity = 0;
        // this.sp_mid.opacity = 0;
        // var anim = this.sp_anim.getComponent(cc.Animation);
        // anim.play("icon" + this.i_icon, 0.0);
        this.border.stopAllActions();
        this.border.active = true;
        this.border.runAction(cc.repeatForever(cc.blink(0.5, 1)));
    },
    playScoreAnim(score) {
        if (this.nodeScore) this.nodeScore.active = true;
        GUtils.setLabelText(this.nodeScore, score);
    },
    stopScoreAnim() {
        if (this.nodeScore) this.nodeScore.active = false;
    },
    //播放发发发变换前动画
    playAnimWin() {
        //显示动画组建
        this.sp_anim.getComponent(cc.Sprite).spriteFrame = this.icons[this.i_icon];
        this.sp_anim.opacity = 255;
        this.sp_top.opacity = 0;
        this.sp_mid.opacity = 0;
        var anim = this.sp_anim.getComponent(cc.Animation);
        anim.play("iconwin", 0.0);
    },
    //停止播放动画
    stopAnim() {
        //显示动画组建
        // this.sp_anim.opacity = 0;
        // this.sp_top.opacity = 255;
        // this.sp_mid.opacity = 255;
        this.border.active = false;
    },
    //设置图标
    setIcon(_i_icon, isMohu) {
        this.i_icon = _i_icon;
        if (isMohu) {
            this.sp_mid.getComponent(cc.Sprite).spriteFrame = this.icons_mofu[this.i_icon];
        } else {
            this.sp_mid.getComponent(cc.Sprite).spriteFrame = this.icons[this.i_icon];
        }
    },
    getIcon() {
        return this.i_icon;
    },

    //直接停止
    quickstop(icon) {
        this.sp_top.stopAllActions();
        this.sp_mid.stopAllActions();
        //设置位置
        this.sp_top.setPosition(0, this.i_rollHeight);
        this.sp_mid.setPosition(0, 0);
        //cc.log("########################"+icon);
        this.setIcon(icon);
    },
    //停止旋转
    stopRoll(icon) {
        this.i_icon = icon;
        this.b_stop = true;
    },
    //游戏引擎第一次调用
    start() {

    },

    // update (dt) {},
});
