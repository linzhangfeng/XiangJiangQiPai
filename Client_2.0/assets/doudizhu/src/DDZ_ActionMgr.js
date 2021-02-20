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
        for (let i = 0; i < this.lo_operator.children.length; i++) {
            let nodeChild = this.lo_operator.children[i];
            nodeChild.active = false;
            this.btns[nodeChild.name] = nodeChild;
            GUtils.addBtnClick(nodeChild, this.onBtnClick.bind(this));
        }
    },
    onBtnClick(event) {
        let name = event.node.name;
        switch (name) {
            case "bt_bujiao": {
                cc.ddz.Net.sendRobLandlord(cc.ddz.Model.seatid, 0);
                break;
            }
            case "bt_buqiang": {
                cc.ddz.Net.sendRobLandlord(cc.ddz.Model.seatid, 0);
                break;
            }
            case "bt_score_1": {
                cc.ddz.Net.sendRobLandlord(cc.ddz.Model.seatid, 1);
                break;
            }
            case "bt_score_2": {
                cc.ddz.Net.sendRobLandlord(cc.ddz.Model.seatid, 2);
                break;
            }
            case "bt_score_3": {
                cc.ddz.Net.sendRobLandlord(cc.ddz.Model.seatid, 3);
                break;
            }
        }
        this.hideAllBtns();
    },

    setOperator(values, isFirst) {
        if (isFirst == undefined) isFirst = false;
        this.hideAllBtns();
        this.btns["bt_bujiao"].active = isFirst;
        this.btns["bt_buqiang"].active = !isFirst;

        for (let key in this.btns) {
            let strs = key.split("_");
            if (strs.length > 2 && values.indexOf(parseInt(strs[2])) != -1) {
                this.btns[key].active = true;
            }
        }
    },
    hideAllBtns() {
        for (let key in this.btns) {
            this.btns[key].active = false;
        }
    }
});