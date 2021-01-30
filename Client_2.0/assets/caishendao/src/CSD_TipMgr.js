module.exports = cc.Class({
    properties: {
        rootNode: null,
        arr_seat_tips: [],
    },
    ctor() {

    },
    init(rootNode) {
        this.rootNode = rootNode;
        GArrayUtils.memset(this.arr_seat_tips, null, cc.csd.Model.Play_num);

        for (let i = 0; i < cc.csd.Model.Play_num; i++) {
            let nodeSeat = cc.find("seat_" + i, this.rootNode);
            GUtils.hideAllChildren(nodeSeat);
            this.arr_seat_tips[i] = nodeSeat;
        }
    },

    showRobScoreTxt(pos, score, isFirst) {
        if (pos == -1) {
            for (let i = 0; i < this.arr_seat_tips.length; i++) {
                GUtils.hideAllChildren(this.arr_seat_tips[i]);
            }
            return;
        }

        let txt_tip = cc.find("txt_tip", this.arr_seat_tips[pos]);
        let txtStr = score + "分";
        if (score == 0) txtStr = (isFirst) ? "不叫" : "不抢";
        GUtils.setLabelText(txt_tip, txtStr);
    },

});
