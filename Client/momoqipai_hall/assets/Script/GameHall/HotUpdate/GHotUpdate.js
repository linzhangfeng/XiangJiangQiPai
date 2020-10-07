let SubGameManager = require('GHotUpdateMgr');

cc.Class({
    extends: GBaseComponent,

    properties: {
        downloadBtn: {
            default: null,
            type: cc.Node
        },
        downloadLabel: {
            default: null,
            type: cc.Label
        },
    },

    onLoad: function () {
        this.initData();
        this.initUI();

        this.checkDownLoad();
    },

    checkDownLoad: function () {
        if (!cc.sys.isNative) {
            return;
        }
        let name = this.name;
        //判断子游戏有没有下载
        cc.log('lin=判断子游戏是否下载?');
        if (SubGameManager.isSubGameDownLoad(name)) {
            //已下载，判断是否需要更新
            cc.log('lin=判断子游戏已下载，检测子游戏是否需要更新');
            SubGameManager.checkSubGameUpdate(name, (success) => {
                if (success) {
                    cc.log('lin=子游戏需要更新');
                    this.downloadLabel.string = "子游戏需要更新";
                } else {
                    cc.log('lin=子游戏不需要更新');
                    this.downloadLabel.string = "子游戏不需要更新";
                }
            });
        } else {
            cc.log('lin=子游戏未下载!');
            this.downloadLabel.string = "子游戏未下载";
        }
    },
    initUI: function () {
        let downloadBtn = cc.find("DownBtn", this.node);
        this.addBtnClick(downloadBtn);


        if (!cc.sys.isNative) {
            GUtils.setNodeVis(this.downloadBtn, false);
            GUtils.setCmpVis(this.downloadLabel, false);
            return;
        }
    },


    initData: function () {
        this.name = "laohuji";
    },

    btnCallback: function (event) {
        cc.log("btnCallback:", event.node.name);
        switch (event.node.name) {
            case  'DownBtn':
                this.onBtnDownLaod();
                break;
        }
    },
    onBtnDownLaod: function () {
        //下载子游戏/更新子游戏
        let name = this.name;
        let self = this;
        SubGameManager.startDownLoadSubGame(name, (progress) => {
            if (isNaN(progress)) {
                progress = 0;
            }
            this.downloadLabel.string = "资源下载中   " + parseInt(progress * 100) + "%";
        }, function (success) {
            if (success) {
                SubGameManager.enterSubgame(name);
                cc.log("lin=下载完成");
            } else {
                cc.log('lin=下载失败');
            }
        });
    },
});