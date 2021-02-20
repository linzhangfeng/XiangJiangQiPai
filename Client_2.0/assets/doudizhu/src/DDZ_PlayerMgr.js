module.exports = cc.Class({
    ctor() {
        this.rootNode = null;
        this.arrNodePlayer = [];
    },
    init(rootNode) {
        this.rootNode = rootNode;
        this.arrNodePlayer = []

        for (let i = 0; i < cc.ddz.Model.Play_num; i++) {
            let nodePlayerParent = cc.find("Player_" + i, this.rootNode);
            nodePlayerParent.destroyAllChildren();
        }

        GModel.stopRecv = true;
        GUtils.loadBoundleRes(PrefabPath.Player.path, function (err, prefab) {
            for (let i = 0; i < cc.ddz.Model.Play_num; i++) {
                let nodePlayerParent = cc.find("Player_" + i, this.rootNode);
                let nodePlayer = cc.instantiate(prefab);
                nodePlayerParent.addChild(nodePlayer);
                this.arrNodePlayer[i] = nodePlayer;
                nodePlayer.active = false;
                let jsPlayer = this.getJsPlayer(nodePlayer);
                jsPlayer.init(i);
            }
            GModel.stopRecv = false;
        }.bind(this), PrefabPath.Player.bundle)
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

    getJsPlayerByPos(pos) {
        return this.getJsPlayer(this.arrNodePlayer[pos]);
    },

    setReadyState(seatid, state) {
        if (seatid == -1) {
            for (let i = 0; i < this.arrNodePlayer.length; i++) {
                let nodePlayer = this.arrNodePlayer[i];
                let jsPlayer = this.getJsPlayer(nodePlayer);
                jsPlayer.setReadyVis(state);
            }
            return;
        }
        let pos = cc.ddz.Model.getPosBySeatid(seatid);
        let jsPlayer = this.getJsPlayer(this.arrNodePlayer[pos]);
        jsPlayer.setReadyVis(state);
    },


});