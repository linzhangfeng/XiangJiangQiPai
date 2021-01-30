let MAX_CELL_INROW = 12 * 1.5;
let CELL_WIDTH = 152;
let CELL_HEIGHT = 152;
let CELL_TIME = 0.05;
module.exports = cc.Class({
    rootNode: null,
    properties: {
        arr_lo_group: [],
    },

    init(rootNode) {
        this.rootNode = rootNode;
        this.initData();
        for (let i = 0; i < 5; i++) {
            let lo_group = cc.find("bg_cards_image/node_group_" + i + "/lo_group", this.rootNode);
            if (i == 0) this.pfCard = lo_group.children[i];
            this.pfCard.removeFromParent(false);
            lo_group.destroyAllChildren();
            lo_group.getComponent(cc.Layout).updateLayout();
            this.arr_lo_group[i] = lo_group;

        }
        this.initCard();
        this.initCardData(cc.csd.Logic.TextData);
        this.initListener();
    },

    initCard() {
        for (let i = 0; i < 5; i++) {
            let lo_group = this.arr_lo_group[i];
            for (let k = 0; k < MAX_CELL_INROW + i * 3; k++) {
                let nodeCard = cc.instantiate(this.pfCard);
                let jsCard = this.getJsCard(nodeCard);
                let iconIndex = Math.ceil(Math.random() % 14 * 10);
                jsCard.setIcon(iconIndex);
                lo_group.addChild(nodeCard);
            }
            lo_group.getComponent(cc.Layout).updateLayout();
            lo_group.y = -(lo_group.height - CELL_HEIGHT * 3);
        }
    },
    initCardData(TextData) {
// 滚动开始
        for (let i = 0; i < this.arr_lo_group.length; i++) {
            let lo_group = this.arr_lo_group[i];

            //设置开奖数
            let card1 = lo_group.children[2];
            let card2 = lo_group.children[1];
            let card3 = lo_group.children[0];
            this.getJsCard(card1).setIcon(TextData[i][0]);
            this.getJsCard(card2).setIcon(TextData[i][1]);
            this.getJsCard(card3).setIcon(TextData[i][2]);

            for (let row = lo_group.childrenCount - 4; row > 0; row--) {
                let nodeCard = lo_group.children[row];
                this.getJsCard(nodeCard).setIcon(Math.ceil(Math.random() % 14 * 10), true);
            }
        }
    },
    startRoll(TextData, finishCB) {
        //隐藏动画
        this.hideCardsEffect();
        this.rootNode.stopAllActions();

        // 滚动开始
        for (let i = 0; i < this.arr_lo_group.length; i++) {
            let lo_group = this.arr_lo_group[i];
            lo_group.gIndex = i;
            //设置开奖数
            let card1 = lo_group.children[2];
            let card2 = lo_group.children[1];
            let card3 = lo_group.children[0];
            this.getJsCard(card1).setIcon(TextData[i][0]);
            this.getJsCard(card2).setIcon(TextData[i][1]);
            this.getJsCard(card3).setIcon(TextData[i][2]);

            //做动画
            let move1 = cc.moveTo((CELL_TIME * lo_group.children.length + CELL_TIME * i * 3), cc.v2(0, -CELL_HEIGHT * 0.685));
            let move2 = cc.moveTo((CELL_TIME) / this.speedFactor, cc.v2(0, -CELL_HEIGHT));
            let cal1 = cc.callFunc(function (sender) {
                let carda = sender.children[lo_group.childrenCount - 1];
                let cardb = sender.children[lo_group.childrenCount - 2];
                let cardc = sender.children[lo_group.childrenCount - 3];

                let card1 = sender.children[2];
                let card2 = sender.children[1];
                let card3 = sender.children[0];
                this.getJsCard(carda).setIcon(this.getJsCard(card1).getIcon());
                this.getJsCard(cardb).setIcon(this.getJsCard(card2).getIcon());
                this.getJsCard(cardc).setIcon(this.getJsCard(card3).getIcon());
                sender.y = -(sender.height - CELL_HEIGHT * 3);
            }.bind(this));
            let move3 = cc.moveTo((CELL_TIME) / this.speedFactor, cc.v2(0, -(lo_group.height - CELL_HEIGHT * 3)));
            let cal2 = cc.callFunc(function (sender) {
                for (let row = sender.childrenCount - 4; row > 0; row--) {
                    let nodeCard = sender.children[i];
                    this.getJsCard(nodeCard).setIcon(Math.ceil(Math.random() % 14 * 10), true);
                }
                if (finishCB && (sender.gIndex == this.arr_lo_group.length - 1)) finishCB();
            }.bind(this));
            lo_group.stopAllActions();
            lo_group.runAction(cc.sequence(move1, move2, cal1, cal2));
            // lo_group.runAction(cc.sequence(move3, cal2));
            // lo_group.setPosition(cc.v2(0, -(lo_group.height - CELL_HEIGHT * 3)));
        }
    },
    hideCardsEffect() {
        for (let i = 0; i < this.arr_lo_group.length; i++) {
            let lo_group = this.arr_lo_group[i];
            for (let k = 0; k < lo_group.children.length; k++) {
                let nodeCard = lo_group.children[k];
                this.getJsCard(nodeCard).stopAnim();
                this.getJsCard(nodeCard).stopScoreAnim();
            }
        }
    },
    playWinLineAnimate(arrAllLine, finishCB) {

        let bestLine = this.getBestLine(arrAllLine);
        for (let i = 0; i < arrAllLine.length; i++) {
            this.playSingleLineAnimate(arrAllLine[i], false)
        }
        setTimeout(function () {
            if (finishCB) finishCB();
        }, 4000);
    },
    playSingleLineAnimate(Line, isShowScore, finishCB) {
        let curIndex = -1;
        for (let i = 0; i < Line.length; i++) {
            let cardPos = Line[i];
            let len = this.arr_lo_group[cardPos.x].children.length;
            let nodeCard = this.arr_lo_group[cardPos.x].children[len - cardPos.y - 1];
            let cellIdx = this.getJsCard(nodeCard).getIcon();
            if (cellIdx < cc.csd.Logic.GameCSDDef.ELE_CT_CAISHENDAO) curIndex = cellIdx;
            this.getJsCard(nodeCard).playAnim();
            if (i == Line.length - 1 && isShowScore) {
                let peiLvData = cc.csd.Logic.PeiLv[curIndex];
                let peiLv = peiLvData[Line.length];
                let peiScore = peiLv * cc.csd.Model.curBetScore;
                this.getJsCard(nodeCard).playScoreAnim(peiScore);
            }
        }
    },
    playLoopLineAnimate(arrAllLine) {
        this.hideCardsEffect();
        arrAllLine.sort(this.sortBest);
        this.curLineIndex = arrAllLine.length - 1;

        let cal = cc.callFunc(function () {
            this.hideCardsEffect();
            this.playSingleLineAnimate(arrAllLine[this.curLineIndex], true);
            this.curLineIndex--;
            if (this.curLineIndex < 0) this.curLineIndex = arrAllLine.length - 1;
        }.bind(this));
        this.rootNode.stopAllActions();
        this.rootNode.runAction(cc.repeatForever(cc.sequence(cal, cc.delayTime(2.0))))
    },
    getBestLine(arrAllLine) {
        arrAllLine.sort(this.sortLine);
        return arrAllLine[0];
    },
    sortLine(a, b) {
        return b.length - a.length;
    },
    initData() {
        this.speedFactor = 1.0;
        this.curLineIndex = 0;
        GArrayUtils.memset(this.arr_lo_group, null, 5);
    },

    initListener() {

    },

    getJsCard(nodeCard) {
        return nodeCard.getComponent("CSD_Card");
    }
});
