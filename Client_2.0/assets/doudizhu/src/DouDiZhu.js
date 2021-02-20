cc.Class({
    extends: cc.Component,

    properties: {
        labelTips: {
            default: null,
            type: cc.Label,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.labelTips.string = '这是斗地主1.0.1';
        cc.ddz = {};

        let ActionMgr = require("DDZ_ActionMgr");
        cc.ddz.ActionMgr = new ActionMgr();

        let CardsMgr = require("DDZ_CardsMgr");
        cc.ddz.CardsMgr = new CardsMgr();

        let PlayerMgr = require("DDZ_PlayerMgr");
        cc.ddz.PlayerMgr = new PlayerMgr();

        let PublicMgr = require("DDZ_PublicMgr");
        cc.ddz.PublicMgr = new PublicMgr();

        let TipMgr = require("DDZ_TipMgr");
        cc.ddz.TipMgr = new TipMgr();

        let Table = require("DDZ_Table");
        cc.ddz.Table = new Table();

        let GUI = require("DDZ_GUI");
        cc.ddz.GUI = new GUI();

        let Model = require("DDZ_Model");
        cc.ddz.Model = new Model();

        let Net = require("DDZ_Net");
        cc.ddz.Net = new Net();

        let CardLib = require("./Cardlib/DDZ_CardLib");
        cc.ddz.CardLib = new CardLib();
    },
    start() {
        cc.ddz.Table.init(this);
    },
    onDestroy() {

    },

    onBtnExit: function () {
        cc.director.loadScene('Hall');
    },

    // update (dt) {},
});
