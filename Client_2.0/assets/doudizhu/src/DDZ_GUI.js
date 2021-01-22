module.exports = cc.Class({
    rootNode: null,
    ctor(){

    },
    init(rootNode) {
        this.rootNode = rootNode;

        let layer_roominfo = cc.find("layer_roominfo", this.rootNode);

        let layer_player = cc.find("layer_player", this.rootNode);
        cc.ddz.PlayerMgr.init(layer_player);

        let layer_action = cc.find("layer_action", this.rootNode);
        cc.ddz.ActionMgr.init(layer_action);

        let layer_cards = cc.find("layer_cards", this.rootNode);
        cc.ddz.CardsMgr.init(layer_cards);

        let layer_tip = cc.find("layer_tip", this.rootNode);
        cc.ddz.TipMgr.init(layer_tip);

        let layer_public = cc.find("layer_public", this.rootNode);
        cc.ddz.PublicMgr.init(layer_public);
    }
});