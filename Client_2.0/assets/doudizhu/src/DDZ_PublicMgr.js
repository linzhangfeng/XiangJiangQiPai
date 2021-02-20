module.exports = cc.Class({
    rootNode: null,
    ctor() {
        this.btns = {};
    },

    init(rootNode) {
        this.rootNode = rootNode;
        this.rootNode.active = true;
        this.btns = {};
        let bt_layout = cc.find("bt_layout", this.rootNode);
        for (let i = 0; i < bt_layout.children.length; i++) {
            this.btns[bt_layout.children[i].name] = bt_layout.children[i];
        }

        this.bt_ready = cc.find("bt_layout/bt_ready", this.rootNode);
        GUtils.addBtnClick(this.bt_ready, function (event) {
            GTcp.sendReady(cc.ddz.Model.seatid, true);
        });

        this.bt_invite = cc.find("bt_layout/bt_invite", this.rootNode);
        GUtils.addBtnClick(this.bt_invite, function (event) {
            // GTcp.sendReady(true);
        });

        this.bt_exitout = cc.find("bt_layout/bt_exitout", this.rootNode);
        GUtils.addBtnClick(this.bt_exitout, function (event) {
            GTcp.sendLogout(cc.ddz.Model.seatid);
        });

        this.bt_disband = cc.find("bt_layout/bt_disband", this.rootNode);
        GUtils.addBtnClick(this.bt_disband, function (event) {
            GTcp.sendDisband(cc.ddz.Model.seatid);
        });

        this.bt_noready = cc.find("bt_layout/bt_noready", this.rootNode);
        GUtils.addBtnClick(this.bt_noready, function (event) {
            GTcp.sendReady(cc.ddz.Model.seatid, false);
        });

        this.bt_tohall = cc.find("bt_tohall", this.rootNode);
        GUtils.addBtnClick(this.bt_tohall, function (event) {
            cc.ddz.Model.table.release();
            GPlatform.toHall();
        });

        this.bt_tohall_top = cc.find("bt_disband", this.rootNode);
        GUtils.addBtnClick(this.bt_tohall_top, function (event) {
            GTcp.sendDisband(cc.ddz.Model.seatid);
        });
        cc.ddz.PublicMgr.hideAllBtns();
    },

    setBtnReadyVis(v) {
        if (this.bt_ready) this.bt_ready.active = v;
    },

    setBtnNoReadyVis(v) {
        if (this.bt_noready) this.bt_noready.active = v;
    },

    hideAllBtns() {
        for (let key in this.btns) {
            this.btns[key].active = false;
        }
    },
    showPublicBtns(isHost, isReady) {
        this.hideAllBtns();
        this.bt_exitout.active = !isHost;
        this.bt_disband.active = isHost;
        this.bt_noready.active = isReady;
        this.bt_invite.active = true;
        this.bt_ready.active = !isReady;
    },
});
