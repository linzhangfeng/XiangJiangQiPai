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
    extends: GBaseComponent,

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

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.setRootNode(this.node);
        this.initUI();
        this.initData();
    },
    initUI: function () {
        this.setBarPercent(0);
    },
    initData: function () {

    },
    start() {

    },

    update(dt) {

    },
    setBarPercent: function (precent) {
        var progressbar = this.findNode("ProgressBar");
        progressbar.progress = precent/100;
    },
    loadScene: function (scenePath) {
        var self = this;
        cc.director.preloadScene(scenePath,
            function (completedCount, totalCount, item) {
                var percent = (100 * completedCount / totalCount).toFixed(2);
                self.setBarPercent(percent);
                //改变显示
                // self.labBar_3002.string = percent + "%";
            },

            function (err, data) {
                setTimeout(function () {
                    GSceneMgr.runScene(scenePath);
                }, 500);
            }
        );
    },
});
