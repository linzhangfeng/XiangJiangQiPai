// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

window.PlayerMgr = {
    rootNode: null,
    jsRootNode: null,
    _playerPrefab: null,
    _playerNodeArr: [],
    _jsPlayerNodeArr: [],

    init: function (rootNode) {
        this.rootNode = rootNode;
        this.jsRootNode = rootNode.getComponent("Player");

        //获取头像节点
        ArrayUtils.memset(this._playerNodeArr, null, Model.gamePlayer);
        ArrayUtils.memset(this._jsPlayerNodeArr, null, Model.gamePlayer);
        for (let i = 0; i < Model.gamePlayer; i++) {
            let parent = cc.find("HeadBg" + i, this.rootNode);
            parent.removeAllChildren(true);

            let p = cc.p(0, 18);
            let nodepr = cc.instantiate(this._playerPrefab);
            let jsUser = nodepr.getComponent("Player");
            jsUser.init(i);
            if (nodepr) {
                if (p) nodepr.setPosition(p);
                if (parent) nodepr.parent = parent;
            }
            this._playerNodeArr[i] = nodepr;
            this._jsPlayerNodeArr[i] = jsUser;
        }
    },

    setPlayerPrefab: function (playerPrefab) {
        this._playerPrefab = playerPrefab;
    },

    upTable: function (userData) {
        let chairId = userData.chairId;
        let pos = this.getPosByCharId(chairId);
        this.jsUsersNodeArr[pos].login(pos);
    },

    downTable: function (userData) {
        let chairId = userData.chairId;
        let pos = this.getPosByCharId(chairId);
        this.jsUsersNodeArr[pos].logout();
    },

    getPosByCharId: function (charid) {

    },

    getChairIdByPos: function (pos) {

    },

    getUserNodeByPos: function (pos) {

    },
};