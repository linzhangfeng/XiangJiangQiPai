/*jshint esversion:6*/
/*
注意此公共组件不为插件，组件类型直接拖拽使用不能设置为插件，为了方便调用所以放在这个位置
*/

cc.Class({
    extends: cc.Component,
    properties: {},

    // use this for initialization
    onLoad: function () {

        this.nodeName = cc.find("UserName", this.node);
        this.setNickName("");
        this.nodeScore = cc.find("UserScore", this.node);
        this.setScore("0");

        //标签标签
        this.nodeBankerFlag = cc.find("FlagNode/Banker", this.node);
        this.nodeBankerFlag.active = false;

        //准备标签
        this.nodeReadyFlag = cc.find("FlagNode/Ready", this.node);
        this.nodeReadyFlag.active = false;

        //托管标签
        this.nodeTuoGuanFlag = cc.find("FlagNode/TuoGuan", this.node);
        this.nodeTuoGuanFlag.active = false;

        //地主标签
        this.nodeLandlordIcon = cc.find("FlagNode/LandlordIcon", this.node);
        this.nodeLandlordIcon.active = false;

        this.nodeTime = cc.find("EffectNode/TimeDown", this.node);
    },

    init(pos) {
        this.viewID = pos;
        this.reset();
    },

    start: function () {

    },

    reset() {
        this.setNickName("");
        this.setBankerVis(false);
        this.setTimeDown(-1);
        this.setTuoGuanVis(false);
        this.setReadyVis(false);
        this.setLandlordIconVis(false);

    },
    login(playerData) {
        this.node.active = true;
        this.updateInfo(playerData);
    },
    logout() {
        this.node.active = false;
        this.reset();
    },
    //设置头像文理
    setHeadImage: function (cbIndexID, callback) {
        let strHeadUrl = strPathFace + cbIndexID;
        let self = this;
        cc.loader.loadRes(strHeadUrl, cc.SpriteFrame, function (err, spriteFrame) {
            if (!err) {
                if (self.spUserHead)
                    self.spUserHead.spriteFrame = spriteFrame;

                if (callback)
                    callback();
            }
        });
        let strHeadUrl1 = strPathFace1 + cbIndexID;

        cc.loader.loadRes(strHeadUrl1, cc.SpriteFrame, function (err, spriteFrame) {
            if (!err) {
                if (self.spUserHead1)
                    self.spUserHead1.spriteFrame = spriteFrame;

                if (callback)
                    callback();
            }
        });
    },

    //设置头像框纹理
    setHeadFrameImage: function (cbIndexID) {
        //头像框设置
        let strFaceFrameUrl;
        strFaceFrameUrl = strPathFaceFrame + cbIndexID;
        let self = this;
        cc.loader.loadRes(strFaceFrameUrl, cc.SpriteFrame, function (err, spriteFrame) {
            if (!err) {
                if (self.spFaceFrame)
                    self.spFaceFrame.spriteFrame = spriteFrame;
            }
        });
    },

    //设置准备
    setReadyVis: function (bActive) {
        if (this.nodeReadyFlag) {
            this.nodeReadyFlag.active = bActive;
        }
    },

    //设置地主
    setLandlordIconVis: function (bActive) {
        if (this.nodeLandlordIcon) {
            this.nodeLandlordIcon.active = bActive;
        }
    },

    //设置托管
    setTuoGuanVis: function (bActive) {
        if (this.nodeTuoGuanFlag) {
            this.nodeTuoGuanFlag.active = bActive;
        }
    },
    //设置断线
    SetOffLineActive: function (bActive) {
        if (this.nodeOffLine) {
            this.nodeOffLine.active = bActive;
        }
    },

    //设置庄家标记
    setBankerVis: function (bActive) {
        if (this.nodeBankerFlag) {
            this.nodeBankerFlag.active = bActive;
        }
    },

    //设置昵称
    setNickName: function (szNickName) {
        //节点数据赋值
        if (this.nodeName) {
            GUtils.setLabelText(this.nodeName, szNickName);
        }
    },

    setViewID: function (wViewID) {
        this.viewID = wViewID;
    },
    getViewID: function () {
        return this.viewID;
    },

    //刷新玩家信息
    updateInfo: function (playerData) {
        this.setNickName(playerData.uid);
        this.setScore(playerData.score);
        this.setReadyVis(playerData.ready);
    },

    //设置游戏分数
    setScore: function (score) {
        //节点数据赋值
        if (this.nodeScore) {
            GUtils.setLabelText(this.nodeScore, score);
        }
    },


    //设置头像和头像框
    setHeadSpriteFrame: function (jsUserItem, callback) {
        //头像设置
        let cbFaceID = jsUserItem.GetFaceID();
        this.setHeadImage(cbFaceID, callback);

        //头像框设置
        let cbFaceFrameID = jsUserItem.GetFaceFrameID();
        this.setHeadFrameImage(cbFaceFrameID);
    },


    //删除自己
    remove: function () {
        this.node.runAction(cc.sequence(cc.moveTo(0.2, this.node.x, this.node.y - this.node.height), cc.removeSelf()));
    },

    setTimeDown: function (nTime, callbackFinish) {
        if (!this.nodeTime) return;
        let timeSprite = this.nodeTime.getComponent(cc.Sprite);
        this.nodeTime.active = true;
        timeSprite.fillRange = 1;
        this.callbackFinish = null;
        if (callbackFinish) this.callbackFinish = callbackFinish;
        this.unscheduleAllCallbacks();
        if (nTime == -1) {
            this.nodeTime.active = false;
            return;
        }
        let self = this;
        let nTimeDown = nTime;

        //重置倒计时
        if (arguments.length == 1) timeSprite.fillRange = 1;

        let OnChangeTime = function () {
            nTimeDown = nTimeDown - 0.1;
            if (nTimeDown < 0) {
                if (self.callbackFinish != undefined) {
                    self.callbackFinish();
                    self.callbackFinish = undefined;
                }
                self.unschedule(OnChangeTime);
                self.nodeTime.active = false;
                timeSprite.fillRange = 1;
                return;
            }
            let fPercent = nTimeDown / nTime;
            timeSprite.fillRange = fPercent;
        };
        self.schedule(OnChangeTime, 0.1);
    },
});
