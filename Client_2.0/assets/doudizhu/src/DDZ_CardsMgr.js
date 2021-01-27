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
        this.lo_handcards.removeAllChildren(false);

        for (let i = 0; i < cc.ddz.Model.Play_num; i++) {
            let lo_outcards = cc.find("lo_outcards_" + i, this.rootNode);
            if (!this.pf_outcard) this.pf_outcard = lo_outcards.children[0];
            lo_outcards.removeAllChildren(false);
            this.arr_lo_outcards.push(lo_outcards);
        }
    },
    setHandCardsValue(cardData) {
        this.arr_handcards_value = cardData;
    },
    setPublicCardsValue(cardData) {
        this.arr_publiccards_value = cardData;
    },
    updateHandcards(handcardsData) {
        this.lo_handcards.removeAllChildren(true);
        for (let i = 0; i < handcardsData.length; i++) {
            let nodeCard = cc.instantiate(this.pf_handcard);
            let jsCard = this.getJsCard(nodeCard);
            this.lo_handcards.addChild(nodeCard);
            jsCard.setCardData(1.0, i, handcardsData[i]);
        }
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

    getJsCard(nodeCard) {
        return nodeCard.getComponent("PKCard");
    }
});
