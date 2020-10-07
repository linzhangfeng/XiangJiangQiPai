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
    },
    _btnCallBack: null,
    _btnTarget: null,
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.setRootNode(this.node);
        this.initUI();
        this.initData();
    },

    initUI: function () {
        this.addBtnClick(this.findNode("MenuList/MenuBg/SetBtn"));
        this.addBtnClick(this.findNode("MenuList/MenuBg/HelpBtn"));
        this.addBtnClick(this.findNode("MenuList/MenuBg/ExitBtn"));
        this.addBtnClick(this.findNode("MenuList"));

        this.addBtnClick(this.findNode("MenuBtn"));
        this.addBtnClick(this.findNode("BottomNode/SubBtn"));
        this.addBtnClick(this.findNode("BottomNode/AddBtn"));
        this.addBtnClick(this.findNode("BottomNode/StopBtn"));
        this.addBtnClick(this.findNode("BottomNode/StartBtn"));

        this.hideMenuList();
    },

    setBtnCallback: function (callback, target) {
        this._btnCallBack = callback;
        this._btnTarget = target;
    },

    btnCallback: function (event) {
        cc.log("btnCallback:", event.node.name);
        switch (event.node.name) {
            case  'SetBtn':

                break;
            case  'HelpBtn':
                HelpMgr.show();
                break;
            case  'ExitBtn':
                Platform.toHall();
                break;
            case  'MenuList':
                this.hideMenuList();
                break;
            case  'MenuBtn':
                this.showMenuList();
                break;
            default:
                if (this._btnCallBack) this._btnCallBack(event, this._btnTarget);
                break;
        }
    },

    initData: function () {

    },

    start() {

    },

    update(dt) {

    },

    showMenuList: function () {
        let menuList = this.findNode("MenuList");
        Utils.setNodeVis(menuList, true);
    },
    hideMenuList: function () {
        let menuList = this.findNode("MenuList");
        Utils.setNodeVis(menuList, false);
    },

    setScore: function (score) {
        var lableNode = this.findNode("BottomNode/bg_score/text");
        Utils.setLabelText(lableNode, score);
    },
    setWinScore: function (score) {
        var lableNode = this.findNode("BottomNode/bg_winscore/text");
        Utils.setLabelText(lableNode, score);
    },
    setStakeScore: function (score) {
        var lableNode = this.findNode("BottomNode/bg_stakescore/text");
        Utils.setLabelText(lableNode, score);
    },
});
