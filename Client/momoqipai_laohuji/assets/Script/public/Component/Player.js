// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: BaseComponent,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        pid: -1,
        chairId: -1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.setRootNode(this.node);
        this.initUI();
        this.initData();
    },

    init:function(pid){
        this.pid = pid;
        Utils.setNodeVis(this.node, false);
    },

    initUI: function () {

    },

    initData: function () {

    },

    start() {

    },

    update(dt) {

    },

    reset: function () {

    },

    login: function (chairId) {
        this.chairId = chairId;

        Utils.setNodeVis(this.node,true);
    },

    logout: function () {

    },

    updateInfo: function () {

    },

    setUserName: function (strName) {
        let userNameLabel = this.findNode("username");
        Utils.setLabelText(userNameLabel, strName);
    },

    setUserHead: function () {
        let userFrameNode = this.findNode("headhead");
        Utils.setSpriteFrame(userFrameNode, path);
    },

    setUserHeadFrame: function (path) {
        let userFrameNode = this.findNode("headframe");
        Utils.setSpriteFrame(userFrameNode, path);
    },
});
