//
//  HotUpdateModule.js
//  lsgame
//
//  Created by 李文龙 on 2018/8/24.
//
//
var MD5 = require('MD5');

cc.Class({
    extends: cc.Component,

    properties: {
        versionLabel: cc.Label,
        _updating: false,
        _canRetry: false,
        _storagePath: ''
    },

    onLoad() {

    },

    init(bundleName) {
        this.bundleName = bundleName;
        if (!cc.sys.isNative) {
            setTimeout(() => {
                this.hotUpdateFinish(true);
            }, 500);
            return;
        }
        cc.log("lin=init:HotUpdateModule000");

        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + ((bundleName == "hall") ? 'game-remote-asset/' : 'game-remote-asset/hall/assets/'));
        let manifestObj = {
            packageUrl: 'http://119.23.221.227/hotupdate/',
            remoteManifestUrl: 'http://localhost/tutorial-hot-update/remote-assets/project.manifest',
            remoteVersionUrl: 'http://localhost/tutorial-hot-update/remote-assets/version.manifest',
            version: '1.0.0',
            assets: {},
            searchPaths: []
        };
        manifestObj.remoteManifestUrl = manifestObj.packageUrl + this.bundleName + "/version/project.manifest";
        manifestObj.remoteVersionUrl = manifestObj.packageUrl + this.bundleName + "/version/version.manifest";

        cc.log("lin=init:HotUpdateModule111");
        let cachedManifest = this._storagePath + "publicproject.manifest";
        if (!jsb.fileUtils.isDirectoryExist(this._storagePath)) {
            jsb.fileUtils.createDirectory(this._storagePath);
        }
        jsb.fileUtils.writeStringToFile(JSON.stringify(manifestObj), cachedManifest);

        cc.log("lin=init:HotUpdateModule222");

        this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
        this._am.setVerifyCallback(this.verifyCB.bind(this));

        cc.log("lin=更新配置:" + JSON.stringify(manifestObj));
        let manifest = new jsb.Manifest(JSON.stringify(manifestObj), this._storagePath);
        cc.log("lin=更新配置:" + JSON.stringify(manifest));
        this._am.loadLocalManifest(manifest, this._storagePath);

        if (this.versionLabel) {
            this.versionLabel.string = `src:${this._am.getLocalManifest().getVersion()}`;
        }

        //初始化脚本版本信息
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            //一些安卓设备不支持同时下载文件过多
            this._am.setMaxConcurrentTask(2);
        } else {
            this._am.setMaxConcurrentTask(2);
        }
    },

    versionCompareHandle: function (versionA, versionB) {
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            } else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        } else {
            return 0;
        }
    },

    onDestroy: function () {
        if (this._am) {
            this._am.setEventCallback(null);
            this._am = null;
        }
    },

    showLog: function (msg) {
        cc.log('[HotUpdateModule][showLog]----' + msg);
    },

    retry: function () {
        if (!this._updating && this._canRetry) {
            this._canRetry = false;
            this._am.downloadFailedAssets();
        }
    },

    updateCallback: function (event) {
        var needRestart = false;
        var failed = false;
        console.log("lin=updateCallback:" + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.showLog("没有发现本地manifest文件，跳过了热更新.");
                failed = true;
                break;
            //更新进度
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                let percent = event.getPercent();
                if (isNaN(percent)) return;
                var msg = event.getMessage();
                this.disPatchRateEvent(percent, msg);
                this.showLog("updateCallback更新进度：" + percent + ', msg: ' + msg);
                break;

            //下载manifest文件失败，跳过热更新
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.showLog("下载manifest文件失败，跳过热更新.");
                failed = true;
                break;

            //已是最新版本
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.showLog("已是最新版本.");
                failed = true;
                break;
            //更新结束
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.showLog("更新结束." + event.getMessage());
                this.disPatchRateEvent(1);
                needRestart = true;
                break;
            //更新错误
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.showLog("更新错误." + event.getMessage());
                this._updating = false;
                this._canRetry = true;
                this._failCount++;
                this.retry();
                break;
            //更新过程中错误
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.showLog('更新过程中错误: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            //解压错误
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.showLog('解压错误');
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);
            this._updating = false;
        }

        if (needRestart) {
            this._am.setEventCallback(null);

            let newPath = this._storagePath + this.bundleName + "/"
            jsb.fileUtils.addSearchPath(newPath, true);

            let searchPaths = jsb.fileUtils.getSearchPaths();
            if (searchPaths.indexOf(newPath) == -1) searchPaths.unshift(newPath);
            // this.SetNotRepeatArray(searchPaths, newPaths, 1);
            jsb.fileUtils.setSearchPaths(searchPaths);
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            console.log("lin=searchPaths:" + JSON.stringify(searchPaths));

            cc.audioEngine.stopAll();
            setTimeout(() => {
                cc.game.restart();
            }, 100);
        }
    },
    SetNotRepeatArray: function (searchPaths, newPaths, index) {
        //code路径去重
        for (let i = index, len = searchPaths.length; i < len;) {
            if (searchPaths[i] == newPaths) {
                searchPaths.splice(i, 1);
                len--;
                continue;
            }
            i++;
        }
    },
    //校验回调
    verifyCB: function (filePath, asset) {
        cc.log("===========================filePath:", filePath);
        cc.log("===============asset_m:", asset.md5);
        cc.log("===============asset_p:", asset.path);
        cc.log("===============asset_c:", asset.compressed);
        cc.log("===============asset_d:", asset.downloadState);
        return true;
    },

    hotUpdate: function () {
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCallback.bind(this));
            this._failCount = 0;
            console.log("lin=start hotUpdate");
            this._am.update();
            this._updating = true;
        }
    },

    //检测更新状态
    checkCallback: function (event) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.showLog("没有发现本地manifest文件，跳过了热更新.");
                this.hotUpdateFinish(true);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.showLog("下载manifest文件失败，跳过热更新.");
                this.hotUpdateFinish(false);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.showLog("已更新.");
                this.hotUpdateFinish(true);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND: {
                //有新版本
                this.showLog("有新版本,需要更新");
                this._updating = false;
                this.hotUpdate();
                return;
            }
            case jsb.EventAssetsManager.UPDATE_PROGRESSION: {
                //有新版本
                let percent = event.getPercent();
                if (isNaN(percent)) return;
                var msg = event.getMessage();
                this.showLog("checkCallback更新进度：" + percent + ', msg: ' + msg);
                return;
            }
            default:
                console.log('event.getEventCode():' + event.getEventCode());
                return;
        }
        this._am.setEventCallback(null);
        this._updating = false;
    },

    checkUpdate: function () {
        if (!this._am) return;
        if (this._updating) {
            cc.log("检测更新中...");
            return;
        }

        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            this.showLog('加载manifest文件失败');
            return;
        }
        this._am.setEventCallback(this.checkCallback.bind(this));
        this._am.checkUpdate();
        this._updating = true;
        this.disPatchRateEvent(0.01);
    },

    //热更完成
    hotUpdateFinish: function (result) {
        cc.director.emit('HotUpdateFinish', [this.bundleName, result]);
    },

    disPatchRateEvent: function (percent) {
        if (percent > 1) {
            percent = 1;
        }
        cc.director.emit('HotUpdateRate', [this.bundleName, percent]);
    },
});
