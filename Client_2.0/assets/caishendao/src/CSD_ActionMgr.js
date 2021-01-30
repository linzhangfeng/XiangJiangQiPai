module.exports = cc.Class({
    properties: {
        rootNode: null,
        lo_operator: null,
    },
    ctor() {
        this.btns = {}
    },
    init(rootNode) {
        this.rootNode = rootNode;
        this.lo_operator = cc.find("lo_operator", this.rootNode);
        this.bt_start = cc.find("bt_start", this.lo_operator);
        GUtils.addBtnClick(this.bt_start, function () {
            cc.csd.CardsMgr.startRoll(cc.csd.Logic.TextData, function () {
                //开始计算线条
                let arrLine = cc.csd.Logic.GameLogic._calculateGlow(cc.csd.Logic.TextData);
                //开始播放中奖动画 ,开始播放循环动画
                if (arrLine.length > 0) {
                    cc.csd.CardsMgr.playWinLineAnimate(arrLine, function () {
                        cc.csd.CardsMgr.playLoopLineAnimate(arrLine);
                    });
                }
                //判断是否为大赢家

                //开始循环播放其他中奖动画

            }.bind(this));
        });
        // for (let i = 0; i < this.lo_operator.children.length; i++) {
        //     let nodeChild = this.lo_operator.children[i];
        //     nodeChild.active = false;
        //     this.btns[nodeChild.name] = nodeChild;
        //     GUtils.addBtnClick(nodeChild, this.onBtnClick.bind(this));
        // }
    },
    onBtnClick(event) {
        let name = event.node.name;
        switch (name) {
            case "bt_bujiao": {
                cc.csd.Net.sendRobLandlord(cc.csd.Model.seatid, 0);
                break;
            }
            case "bt_buqiang": {
                cc.csd.Net.sendRobLandlord(cc.csd.Model.seatid, 0);
                break;
            }
            case "bt_score_1": {
                cc.csd.Net.sendRobLandlord(cc.csd.Model.seatid, 1);
                break;
            }
            case "bt_score_2": {
                cc.csd.Net.sendRobLandlord(cc.csd.Model.seatid, 2);
                break;
            }
            case "bt_score_3": {
                cc.csd.Net.sendRobLandlord(cc.csd.Model.seatid, 3);
                break;
            }
        }
    },

    setOperator(values, isFirst) {
        if (isFirst == undefined) isFirst = false;
        this.hideAllBtns();
        this.btns["bt_bujiao"].active = isFirst;
        this.btns["bt_buqiang"].active = !isFirst;

        for (let key in this.btns) {
            let strs = key.split("_");
            if (strs.length > 2 && values.indexOf(strs[2]) != -1) {
                btns[key].active = true;
            }
        }
    },
    hideAllBtns() {
        for (let key in this.btns) {
            this.btns[key].active = false;
        }
    }
});
