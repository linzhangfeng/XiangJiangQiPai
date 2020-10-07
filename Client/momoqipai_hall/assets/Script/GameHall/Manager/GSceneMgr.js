window.GSceneMgr = {
    loadScenePath: "LoadScene",
    runScene: function (szSceneDesc, isShowLoad) {
        if (isShowLoad) {
            this.runLoadScene(function (scene) {
                let jsLoadScene = cc.find("Canvas",scene).getComponent("LoadScene");
                jsLoadScene.loadScene(szSceneDesc);
            });
        } else {
            cc.director.loadScene(szSceneDesc);
        }
    },

    runLoadScene: function (callback) {
        cc.director.loadScene(this.loadScenePath, function (err, scene) {
            //native 设置自动释放
            if (!err && cc.sys.isNative) {
                // if(window.mfConfig.CurScene != null)
                // {
                //     scene.autoReleaseAssets = true;
                //     window.mfConfig.CurScene = scene;
                // }
                // let tempScene = scene;

                // if( tempScene.name.search("GameScene")!=-1) {
                //     tempScene.autoReleaseAssets = true;
                // }
            }

            //回调
            if (callback && callback != undefined) {
                callback(scene, err);
            }
        });
    }
};