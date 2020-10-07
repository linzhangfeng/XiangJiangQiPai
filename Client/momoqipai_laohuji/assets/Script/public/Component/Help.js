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
        test111: 1,           //是否自动
    },
    _pageCurrentIndex: 0,
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.initData();
        this.setRootNode(this.node);
        this.initUI();

    },
    initData: function () {
        this._pageCurrentIndex = 0;
    },
    initUI: function () {
        this.addBtnClick(this.findNode("CloseBtn"));
        this.addBtnClick(this.findNode("LeftBtn"));
        this.addBtnClick(this.findNode("RightBtn"));
    },
    btnCallback: function (event) {
        cc.log("btnCallback:", event.node.name);
        switch (event.node.name) {
            case  'LeftBtn':
                this._pageCurrentIndex--;
                if (this._pageCurrentIndex < 0) this._pageCurrentIndex = 0;
                this.setPageByIndex(this._pageCurrentIndex);
                break;
            case  'RightBtn':
                this._pageCurrentIndex++;
                if (this._pageCurrentIndex > 2) this._pageCurrentIndex = 2;
                this.setPageByIndex(this._pageCurrentIndex);
                break;
            case  'CloseBtn':
                this.hide();
                break;
            case  'TestBtn':
                this.hide();
                break;
        }
    },

    start() {

    },

    update(dt) {

    },

    setPageByIndex: function (index) {
        let pageNode = this.findNode("PageView");
        let pageView = pageNode.getComponent(cc.PageView);
        pageView.scrollToPage(index, 0.1);
    },

    hide: function () {
        Utils.setNodeVis(this.node, false);
    },
});
