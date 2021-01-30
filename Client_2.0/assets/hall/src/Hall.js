// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        labelTips: {
            default: null,
            type: cc.Label,
        },
        nodeBundle1: {
            default: null,
            type: cc.Node,
        },
        nodeBundle2: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad() {
        cc.director.on('HotUpdateFinish', this.onBundleUpdateFinish, this);
        cc.director.on('HotUpdateRate', this.onBundletUpdateRate, this);


        GUtils.loadBoundleRes(PrefabPath.Player.path, function (err, prefab) {
            let nodePlayer = cc.find("Player", this.node);
            this.nodePlayer = cc.instantiate(prefab);
            this.nodePlayer.setPosition(nodePlayer.getPosition());
            nodePlayer.parent.addChild(this.nodePlayer);

        }.bind(this), PrefabPath.Player.bundle);
        let bt_uid_0 = cc.find("UID_0", this.node);
        GUtils.addBtnClick(bt_uid_0, function () {
            GModel.uid = 999999999;
            this.updatePlayerInfo();
        }.bind(this));

        let bt_uid_1 = cc.find("UID_1", this.node);
        GUtils.addBtnClick(bt_uid_1, function () {
            GModel.uid = 88888888;
            this.updatePlayerInfo();
        }.bind(this));

        let bt_uid_2 = cc.find("UID_2", this.node);
        GUtils.addBtnClick(bt_uid_2, function () {
            GModel.uid = 77777777;
            this.updatePlayerInfo();
        }.bind(this));
    },
    updatePlayerInfo() {
        let jsPlayer = this.getJsPlayer();
        jsPlayer.setNickName(GModel.uid + "");
    },
    getJsPlayer() {
        let jsPlayer = this.nodePlayer.getComponent("Player");
        return jsPlayer;
    },

    onDestroy() {
        cc.director.off('HotUpdateFinish', this.onBundleUpdateFinish, this);
        cc.director.off('HotUpdateRate', this.onBundletUpdateRate, this);
    },

    onBundleUpdateFinish: function (params) {
        let bundleName = params[0];
        let result = params[1];
        let text = `${bundleName}热更完成，热更result：${result}`;
        console.log(text);
        this.labelTips.string = text;
        if (result) {
            this.loadBundle(bundleName);
        }
    },

    onBundletUpdateRate: function (params) {
        let bundleName = params[0];
        let rate = params[1];
        let text = `${bundleName}热更进度：${rate}`;
        console.log(text);
        this.labelTips.string = text;
    },

    loadBundle: function (bundleName) {
        var sceneName = {};
        sceneName['doudizhu'] = 'DouDiZhu';
        sceneName['caishendao'] = 'CaiShenDao';
        cc.assetManager.loadBundle(bundleName, null, (err, bundle) => {
            //这里存一下bundle，在bundle场景销毁的时候释放，保证下次bundle热更之后引用的资源都是最新的
            bundle.loadScene(sceneName[bundleName], (err, sceneAsset) => {
                cc.director.runScene(sceneAsset);
            });
        });
    },

    onBtnLoadBundle1: function () {
        //这里检查一下是否已经加载过bundle，如果加载过就先释放，否则会造成更新之后用老的资源
        let bundle = window['bundle1'];
        if (bundle) {
            bundle.releaseAll();
            cc.assetManager.removeBundle(bundle);
        }
        window['bundle1'] = null;
        let BundleUpdateModule = this.nodeBundle1.getComponent('HotUpdate');
        BundleUpdateModule.init("doudizhu");
        BundleUpdateModule.checkUpdate();
    },

    onBtnLoadBundle2: function () {
        this.loadBundle("caishendao");
    },

    onBtnReturnLogin: function () {
        cc.director.loadScene('LoginScene');
    },

});
