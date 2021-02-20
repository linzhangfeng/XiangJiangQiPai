module.exports = cc.Class({
    rootNode: null,
    properties: {
        lo_handcards: null,
        lo_publiccards: null,
        arr_handcards_value: [],
        arr_publiccards_value: [],
        arr_lo_outcards: [],
        pf_handcard: null,
        pf_publiccard: null,
        pf_outcard: null,
    },

    init(rootNode) {
        this.rootNode = rootNode;
        GArrayUtils.memset(this.arr_lo_outcards, 0, cc.ddz.Model.Play_num)

        this.lo_publiccards = cc.find("lo_publiccards", this.rootNode);
        this.pf_publiccard = this.lo_publiccards.children[0];
        this.lo_publiccards.removeAllChildren(false);

        this.lo_handcards = cc.find("lo_handcards", this.rootNode);
        this.pf_handcard = this.lo_handcards.children[0];
        this.pf_handcard.removeFromParent();
        this.lo_handcards.destroyAllChildren();
        this.lo_handcards.getComponent(cc.Layout).updateLayout();

        for (let i = 0; i < cc.ddz.Model.Play_num; i++) {
            let lo_outcards = cc.find("lo_outcards_" + i, this.rootNode);
            if (!this.pf_outcard) this.pf_outcard = lo_outcards.children[0];
            lo_outcards.removeAllChildren(false);
            this.arr_lo_outcards.push(lo_outcards);
        }

        this.initListener();
    },

    initListener() {
        this.lo_handcards.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.lo_handcards.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
        this.lo_handcards.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel.bind(this));
        this.lo_handcards.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
    },

    onTouchStart: function (event) {
        this.startPos = this.lo_handcards.convertToNodeSpaceAR(event.getLocation());
        this.curPos = this.startPos;
        this.preSelect();
    },

    onTouchEnd: function (event) {
        let lock = true
        let selectCards = [];
        this.lo_handcards.children.forEach(function (pk) {
            let poker = pk.getComponent('PKCard');
            if (pk.active && poker.getSelect()) {
                poker.setUp(!poker.getUp());
                // if (poker.getUp()) selectCards.push(pk);
                lock = false
            }
            poker.setSelect(false);
        }, this)
        // this.selectCanOutCards(selectCards);
        // if (!lock) cc.mgr.audioMgr.playSFX('landlord/select.mp3');
    },
    selectCanOutCards(selectCards) {
        this.selectCards();
    },
    onTouchCancel: function (event) {
        this.onTouchEnd(event);
    },

    onTouchMove: function (event) {
        let np = this.lo_handcards.convertToNodeSpaceAR(event.getLocation());
        if (np.y > this.lo_handcards.height) return;
        this.curPos = this.lo_handcards.convertToNodeSpaceAR(event.getLocation());
        this.preSelect();
    },

    preSelect: function () {
        let minx = Math.min(this.startPos.x, this.curPos.x);
        let maxx = Math.max(this.startPos.x, this.curPos.x);

        let lastBoxMinx = 9999;
        for (let i = this.lo_handcards.childrenCount - 1; i >= 0; i--) {
            let poker = this.lo_handcards.children[i].getComponent('PKCard');
            let bbox = poker.node.getBoundingBox();
            if (bbox.xMax > minx && bbox.xMin < maxx && minx < lastBoxMinx) {
                poker.setSelect(true);
                lastBoxMinx = bbox.xMin;
            } else {
                poker.setSelect(false);
            }
        }
    },

    selectCards: function (cards) {
        for (let i = 0; i < this.lo_handcards.childrenCount; i++) {
            let poker = this.lo_handcards.children[i].getComponent('PKCard');
            if (poker._selected) {
                poker.cancelSelect();
            }
        }

        for (let i = 0; i < cards.length; i++) {
            for (let j = 0; j < this.lo_handcards.childrenCount; j++) {
                let poker = this.lo_handcards.children[j].getComponent('PKCard');
                if (poker._selected == false && poker.face == cards[i]) {
                    poker.onSelect();
                    break;
                }
            }
        }

    },

    setHandCardsValue(cardData) {
        this.arr_handcards_value = cardData;
    },
    setPublicCardsValue(cardData) {
        this.arr_publiccards_value = cardData;
    },
    updateHandcards() {
        this.arr_handcards_value = cc.ddz.CardLib.sortCard(this.arr_handcards_value);
        let handcardsData = this.arr_handcards_value;
        this.lo_handcards.removeAllChildren(true);
        for (let i = 0; i < handcardsData.length; i++) {
            let nodeCard = cc.instantiate(this.pf_handcard);
            let jsCard = this.getJsCard(nodeCard);
            this.lo_handcards.addChild(nodeCard);
            jsCard.setCardData(nodeCard.scale, i, handcardsData[i]);
        }
        this.lo_handcards.getComponent(cc.Layout).updateLayout();
    },
    updatePublicCards(publicCardsData) {
        this.lo_publiccards.removeAllChildren(true);
        for (let i = 0; i < publicCardsData.length; i++) {
            let nodeCard = cc.instantiate(this.pf_publiccard);
            let jsCard = this.getJsCard(nodeCard);
            this.lo_publiccards.addChild(nodeCard);
            jsCard.setCardData(1.0, i, publicCardsData[i]);
        }
    },
    showPublicCards(){
        this.lo_publiccards.removeAllChildren(true);
        for (let i = 0; i < 3; i++) {
            let nodeCard = cc.instantiate(this.pf_publiccard);
            let jsCard = this.getJsCard(nodeCard);
            this.lo_publiccards.addChild(nodeCard);
            jsCard.setCardData(1.0, i, 0);
        }
    },
    getJsCard(nodeCard) {
        return nodeCard.getComponent("PKCard");
    }
});
