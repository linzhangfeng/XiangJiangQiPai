module.exports = cc.Class({
    ctor() {
        this.rootNode = null;
        this.arrNodePlayer = [];
    },
    init(rootNode) {
        this.rootNode = rootNode;
        this.arrNodePlayer = []

        for (let i = 0; i < cc.ddz.Model.Play_num; i++) {
            let nodePlayer = cc.find("Player_" + i, this.rootNode);
            this.arrNodePlayer[i] = nodePlayer;
            let jsPlayer = this.getJsPlayer(nodePlayer);
            jsPlayer.initData(i);
            nodePlayer.active = false;
        }
    },

    upTable(playerData) {
        let pos = cc.ddz.Model.getPosBySeatid(playerData.seatid);
        let jsPlayer = this.getJsPlayer(this.arrNodePlayer[pos]);
        jsPlayer.login(playerData);
    },

    downTable(seatId) {
        let pos = cc.ddz.Model.getPosBySeatid(seatId);
        let jsPlayer = this.getJsPlayer(this.arrNodePlayer[pos]);
        jsPlayer.logout();
    },

    getJsPlayer(nodePlayer) {
        let jsPlayer = nodePlayer.getComponent("Player");
        return jsPlayer;
    },

    setReadyState(seatid, state) {
        let pos = cc.ddz.Model.getPosBySeatid(seatid);
        let jsPlayer = this.getJsPlayer(this.arrNodePlayer[pos]);
        jsPlayer.setReadyVis(state);
    },
});