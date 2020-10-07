//热更新任务结构体
let SubGameAssetsType = {
    CheckUpdate: 1,
    UpdateDownLoad: 2,
};
/*
ERROR_NO_LOCAL_MANIFEST = 0;
ERROR_DOWNLOAD_MANIFEST = 1;
ERROR_PARSE_MANIFEST = 2;
NEW_VERSION_FOUND = 3;
ALREADY_UP_TO_DATE = 4;
UPDATE_PROGRESSION = 5;
ASSET_UPDATED = 6;
ERROR_UPDATING = 7;
UPDATE_FINISHED = 8;
UPDATE_FAILED = 9;
ERROR_DECOMPRESS = 10;
*/

let SubGameManager = {
    _storagePath: [],
    _hotupdateTask: [],
    _downloadCallback: null,
    _finishCallback: null,
    _assetsManager: null,
    _gameName: null,
    //检测回调
    checkCallBack: function (event) {
        let update = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log('No local manifest file found, hot update skipped.');
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log('Fail to download manifest file, hot update skipped.');
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('Already up to date with the latest remote version.');
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                console.log('New version found, please try to update.');
                update = true;
                break;
            default:
                return;
        }

        this._assetsManager.setEventCallback(null);
        if (this._downloadCallback) this._downloadCallback(update);

    },

    //更新回调
    updateCallBack: function (event) {
        let finished = false;
        let failed = false;
        cc.log('lin=======================有更新回调. code=' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log('No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                let percentByFile = event.getPercentByFile();
                cc.log('=======================UPDATE_PROGRESSION.' + percentByFile);
                cc.log('=======================UPDATE_PROGRESSION.' + event.getMessage());

                if (isNaN(percentByFile)) {
                    percentByFile = 0;
                }

                let fPercent = (percentByFile * 100).toFixed(0);
                if (fPercent > 0) {
                    if (this._downloadCallback) this._downloadCallback(percentByFile);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                console.log('ERROR_DOWNLOAD_MANIFEST');
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('Already up to date with the latest remote version.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log('Update finished. ' + event.getMessage());
                finished = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                console.log('Update failed. ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                console.log("ERROR_DECOMPRESS");
                console.log(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            this._assetsManager.setEventCallback(null);
            if (this._finishCallback) this._finishCallback(false);
        }

        if (finished) {
            this._assetsManager.setEventCallback(null);
            if (this._finishCallback) this._finishCallback(true);

        }
    },

    /**
     * 下载子游戏
     * @param {string} name - 游戏名
     * @param type - 1:发现新的更新   2:下载子游戏   3:检测游戏是否需要更新
     * @param downloadCallback - 下载回调
     * @note finishCallback 下载完成回调
     */

    _getfiles: function (name, type, downloadCallback, finishCallback) {
        this._storagePath[name] = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'ALLGame/' + name);
        this._downloadCallback = downloadCallback;
        this._finishCallback = finishCallback;
        this._gameName = name;

        /// 替换该地址
        let UIRLFILE = "http://119.23.221.227:80/hotupdate/" + name;

        let customManifestStr = JSON.stringify({
            'packageUrl': UIRLFILE + "/",
            'remoteManifestUrl': UIRLFILE + '/project.manifest',
            'remoteVersionUrl': UIRLFILE + '/version.manifest',
            'version': '0.0.1',
            'assets': {},
            'searchPaths': []
        });

        let cachedManifest = this._storagePath[name] + "/project.manifest";
        if (!jsb.fileUtils.isDirectoryExist(this._storagePath[name])) {
            jsb.fileUtils.createDirectory(this._storagePath[name]);
        }
        jsb.fileUtils.writeStringToFile(customManifestStr, cachedManifest);

        cc.log("lin=更新配置:" + customManifestStr);
        let assetsManager = new jsb.AssetsManager("", this._storagePath[name]);
        assetsManager.setMaxConcurrentTask(3);
        assetsManager.setVerifyCallback(this.verifyCB.bind(this));
        cc.log("lin=更新配置:" + customManifestStr);
        let manifest = new jsb.Manifest(customManifestStr, this._storagePath[name]);
        cc.log("lin=更新配置:" + JSON.stringify(manifest));
        assetsManager.loadLocalManifest(manifest, this._storagePath[name]);
        this._assetsManager = assetsManager;
        if (type == SubGameAssetsType.CheckUpdate) {
            assetsManager.setEventCallback(this.checkCallBack.bind(this));
            assetsManager.checkUpdate();
        } else if (type == SubGameAssetsType.UpdateDownLoad) {
            assetsManager.setEventCallback(this.updateCallBack.bind(this));
            assetsManager.update();
            cc.log("lin=开始更新");
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

    /**
     * 下载子游戏
     * @param {string} name - 游戏名
     * @param progress - 下载进度回调
     * @param finish - 完成回调
     * @note finish 返回true表示下载成功，false表示下载失败
     */
    downloadSubGame: function (name, progress, finish) {
        this._getfiles(name, 2, progress, finish);
    },

    /**
     * 进入子游戏
     * @param {string} name - 游戏名
     */
    enterSubgame: function (name) {
        if (!this._storagePath[name]) {
            this.downloadSubGame(name);
            return;
        }
        let path = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'ALLGame/';
        if (jsb && jsb.fileUtils) jsb.fileUtils.addSearchPath(path, true);
        cc.log("lin=mainJS=path:" + this._storagePath[name] + '/src/main.js');
        require("./JsTest");
        require("./JsTest.js");
        // require(this.name + '/src/main.js');
        window.require( (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'ALLGame/laohuji' + '/src/main.js');

    },

    /**
     * 判断子游戏是否已经下载
     * @param {string} name - 游戏名
     */
    isSubGameDownLoad: function (name) {
        let file = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'ALLGame/' + name + '/project.manifest';
        if (jsb.fileUtils.isFileExist(file)) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * 判断子游戏是否需要更新
     * @param {string} name - 游戏名
     * @param isUpdateCallback - 是否需要更新回调
     * @param failCallback - 错误回调
     * @note isUpdateCallback 返回true表示需要更新，false表示不需要更新
     */
    checkSubGameUpdate: function (name, isUpdateCallback) {
        this._getfiles(name, SubGameAssetsType.CheckUpdate, isUpdateCallback, null);
    },

    startDownLoadSubGame: function (name, loadCallback, finishCallback) {
        this._getfiles(name, SubGameAssetsType.UpdateDownLoad, loadCallback, finishCallback);
    },
};

module.exports = SubGameManager;