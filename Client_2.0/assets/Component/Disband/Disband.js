cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function () {
        this.initData();

        this.nodeItem = cc.find("content/Player", this.node);
        this.nodeItem.removeFromParent(false);
        this.nodeContent = cc.find("content", this.node);
        this.txt_tip = cc.find("txt_tip", this.node);
    },

    initData: function () {

    },

    updatePlayerInfo(disbandData, disbandid) {
        let temp_data = disbandData.slice();
        this.nodeContent.removeAllChildren(true);
        for (let i = 0; i < temp_data.length; i++) {
            let playerData = temp_data[i];
            if (!playerData.uid) continue;
            let nodeItem = cc.instantiate(this.nodeItem);
            let node_txt_name = cc.find("txt_name", nodeItem);
            let zorder = 10;
            let txt = "";
            let state = playerData.disband;

            if (disbandid == temp_data[i].seatid) {
                zorder = 0;
                txt = "发起解散";
            } else if (state == 1) {
                if (txt == "") txt = "同意";
            } else if (state == 2) {
                if (txt == "") txt = "反对";
            } else {
                if (txt == "") txt = "等待中...";
            }

            this.nodeContent.addChild(nodeItem, zorder);
            let txt_state = cc.find("txt_state", nodeItem);
            GUtils.setLabelText(txt_state, txt);
            GUtils.setLabelText(node_txt_name, playerData.uid);
        }
    },


    setTimeDown: function (nTime, callbackFinish) {
        if (!this.txt_tip) return;
        this.callbackFinish = null;
        if (callbackFinish) this.callbackFinish = callbackFinish;
        this.unscheduleAllCallbacks();
        if (nTime == -1) {
            this.nodeTime.active = false;
            return;
        }
        let self = this;
        let nTimeDown = nTime;

        let OnChangeTime = function (f) {
            nTimeDown = nTimeDown - f;
            if (nTimeDown < 0) {
                if (self.callbackFinish != undefined) {
                    self.callbackFinish();
                    self.callbackFinish = undefined;
                }
                self.unschedule(OnChangeTime);
                GUtils.setLabelText(this.txt_tip, 0);
                return;
            }

            GUtils.setLabelText(this.txt_tip, parseInt(nTimeDown));
        };
        self.schedule(OnChangeTime.bind(this), 0.1);
    },

    remove(){
        this.node.destroy();
    }
});
