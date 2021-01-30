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
        if (this.labelTips) this.labelTips.string = '这是斗地主1.0.1';
        cc.csd = {};

        let ActionMgr = require("CSD_ActionMgr");
        cc.csd.ActionMgr = new ActionMgr();

        let CardsMgr = require("CSD_CardsMgr");
        cc.csd.CardsMgr = new CardsMgr();

        let PlayerMgr = require("CSD_PlayerMgr");
        cc.csd.PlayerMgr = new PlayerMgr();

        let PublicMgr = require("CSD_PublicMgr");
        cc.csd.PublicMgr = new PublicMgr();

        let TipMgr = require("CSD_TipMgr");
        cc.csd.TipMgr = new TipMgr();

        let Table = require("CSD_Table");
        cc.csd.Table = new Table();

        let GUI = require("CSD_GUI");
        cc.csd.GUI = new GUI();

        let Model = require("CSD_Model");
        cc.csd.Model = new Model();

        let Net = require("CSD_Net");
        cc.csd.Net = new Net();

        let Logic = require("CSD_Calculate");
        cc.csd.Logic = Logic;
    },
    start() {
        cc.csd.Table.init(this);
    },
    onDestroy() {

    },

    onBtnExit: function () {
        cc.director.loadScene('Hall');
    },

    // update (dt) {},
});
