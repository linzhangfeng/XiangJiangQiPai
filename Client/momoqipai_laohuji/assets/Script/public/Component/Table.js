// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
let Config = require("Config");
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
        usersNodeArr: [],
        headNodePrefab: {
            default: null,
            type: cc.Prefab,
        }
    },

    // LIFE-CYCLE CALLBACKS:
    jsRoomPublic: null,

    onLoad() {
        this.setRootNode(this.node);
        this.initUI();
        this.initData();
    },

    initUI: function () {
        //初始化公共按钮layer
        let publicNode = this.findNode("PublicLayer");
        PublicMgr.init(publicNode);

        //初始化帮助layer
        let helpLayer = this.findNode("HelpLayer");
        HelpMgr.init(helpLayer);

        //初始化用户layer
        let userlayer = this.findNode("UserLayer");
        PlayerMgr.setPlayerPrefab(this.headNodePrefab); //先设置预制件，然后在初始化
        PlayerMgr.init(userlayer);
    },

    btnCallback: function (event, target) {
        var self = this;
        switch (event.node.name) {
            case  'LoginBtn':
                this.toGameHall();
                break;
            case  'HelpBtn':
                target.showHelpLayer();
                break;

        }
    },


    initData: function () {
        Model.packageName = "laohuji";
    },

    start() {

    },

    update(dt) {

    },

    showHelpLayer: function () {
        let helpLayer = this.findNode("HelpLayer");
        Utils.setNodeVis(helpLayer, true);

        this.jsRoomPublic.hideMenuList();
    },

    hideHelpLayer: function () {
        let helpLayer = this.findNode("HelpLayer");
        Utils.setNodeVis(helpLayer, false);
    },
});
