// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

window.GBaseComponent = cc.Class({
    extends: cc.Component,

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
    },
    rootNode: null,

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {

    },

    update(dt) {

    },
    setRootNode: function (rootNode) {
        this.rootNode = rootNode;
    },
    addBtnClick: function (btn) {
        let self = this;
        if (btn.name == "help") {
            btn.on('touchstart', function () {
                GUtils.setNodeVis(cc.find("helptip", self.rootNode), true);
            }, this);
            btn.on('touchend', function () {
                GUtils.setNodeVis(cc.find("helptip", self.rootNode), false);
            }, this);
            btn.on('touchcancel', function () {
                GUtils.setNodeVis(cc.find("helptip", self.rootNode), false);
            }, this);
        } else {
            btn.on('click', this.btnCallback, this);
        }
    },
    btnCallback: function (event) {
        // cc.log("btnCallback:", event.node.name);
        // switch (event.node.name) {
        //     case  'BtnGameExit':
        //         break;
        // }
    },
    findNode: function (path) {
        if (!this.rootNode) {
            cc.log("please set base rootNode");
            return null;
        }
        let node = cc.find(path, this.rootNode);
        if (!node) {
            cc.log("find node url:" + path + " fail");
        }
        return node;
    },

    hide() {
        GUtils.setNodeVis(this.node, false);
    },

    show() {
        GUtils.setNodeVis(this.node, true);
    }
});