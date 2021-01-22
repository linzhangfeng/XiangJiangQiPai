cc.Class({
    extends: cc.Component,

    properties:
        {
            nodeTipContent: cc.Node,
            pfLabelTip: cc.Prefab,
        },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node_txt_tip = cc.find("txt_tip", this.node);
    },

    showTxtTip(txt) {
        GUtils.setLabelText(this.node_txt_tip, txt);
        this.node_txt_tip.runAction(cc.sequence(cc.delayTime(2.0), cc.callFunc(function () {
            this.node.destroy();
        }.bind(this))));
    },

    // update (dt) {},
});
