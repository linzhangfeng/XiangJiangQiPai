window.GUtils = {
    //转换16进制
    toHex2: function (num) {
        if (!num) return "00";
        if (num < 16) {
            return "0" + num.toString(16);
        }
        return num.toString(16);
    },
    to2d: function (num) {
        if (num < 10) {
            return "0" + num.toString(10);
        }
        return num.toString(10);
    },
    scaleToSize: function (node, w, h) {
        node.setScaleX(w / node.getContentSize().width);
        node.setScaleY(h / node.getContentSize().height);
    },
    parseName: function (max, name) {
        try {
            let l = name.length;
            let blen = 0;
            let len = [];
            let n = 0;
            for (let i = 0; i < l; i++) {
                n = 0;
                if ((name.charCodeAt(i) & 0xff00) != 0) {
                    blen++;
                    n++;
                }
                blen++;
                n++;
                len[i] = n;
            }
            if (blen > max) {
                n = 0;
                for (let i = 0; i < l; i++) {
                    n += len[i];
                    if (n >= max) {
                        n = i + 1;
                        break;
                    }
                }
                return name.substr(0, n) + "..";
            }
            return name;
        } catch (e) {
            return "";
        }
    },
    getAvatarURI: function (uid, avatar) {
        if (avatar < 1000000) {
            return "user_head/" + avatar + ".png";
        }
        return "user_head/" + uid + "/" + avatar + ".png";
    },
    getSavePath: function () {
        return jsb.fileUtils.getWritablePath() + "Assets/";
    },
    getImageSavePath: function (fileUrl) {
        if (!fileUrl) {
            return;
        }
        let findFlag = "/chess_img/";
        let cutPos = fileUrl.indexOf(findFlag);
        if (cutPos < 0) {
            findFlag = "https://";
            cutPos = fileUrl.indexOf(findFlag);
            if (cutPos < 0) {
                findFlag = "http://";
                cutPos = fileUrl.indexOf(findFlag);
            }
            if (cutPos < 0) {
                return this.getSavePath() + "images/" + fileUrl;
            } else {
                fileUrl = fileUrl.slice(cutPos + findFlag.length);
                findFlag = "/";
                cutPos = fileUrl.indexOf(findFlag);
                let localPath = fileUrl.slice(cutPos + findFlag.length);
                return this.getSavePath() + "images/" + localPath;
            }
            return this.getSavePath() + "images/" + fileUrl;
        } else {
            let localPath = fileUrl.slice(cutPos + findFlag.length);
            return this.getSavePath() + "images/" + localPath;
        }
    },
    hasImageFile: function (f) {
        return jsb.fileUtils.isFileExist(this.getImageSavePath(f));
    },
    format: function (string) {
        let args = arguments;
        let pattern = new RegExp("%([0-9]+)", "g");
        return String(string).replace(pattern
            , function (match, index) {
                if (index == 0 || index >= args.length)
                    throw "Invalid index in format string";
                return args[index];
            });
    },
    Random: function (start, end) {
        return Math.floor(Math.random() * (end - start + 1)) + start;
    },
    randomf: function (start, end) {
        return Math.random() * (end - start) + start;
    },

    pad: function (num, n) {
        let len = num.toString().length;
        while (len < n) {
            num = "0" + num;
            len++;
        }
        return num + "";
    },

    setSpriteFrame: function (node, url) {
        let spriteFrame = cc.loader.getRes(url, cc.SpriteFrame);
        if (spriteFrame) {
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        } else {
            cc.loader.loadRes(url, cc.SpriteFrame, (err, spriteFrame) => {
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
    },
    createSprite: function (url) {
        let node = new cc.Node();
        node.addComponent(cc.Sprite);
        this.setSpriteFrame(node, url);
        return node;
    },
    createSprteByURL: function (url, size) {
        cc.log("createSprteByURL:" + url);
        let node = new cc.Node();
        node.addComponent(cc.Sprite);
        if (cc.sys.isNative) {
            let savePath = this.getImageSavePath(url);
            if (this.hasImageFile(savePath)) {
                cc.loader.load(savePath, function (err, img) {
                    if (img) {
                        try {
                            let spriteFrame = new cc.SpriteFrame(img);
                            spriteFrame.name = savePath;
                            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                            node.width = size.width;
                            node.height = size.height;
                        } catch (e) {

                        }
                    }
                });
            } else {
                GHttp.sendHttpImage(url, savePath, function () {
                    cc.loader.load(savePath, function (err, img) {
                        if (img) {
                            try {
                                let spriteFrame = new cc.SpriteFrame(img);
                                spriteFrame.name = savePath;
                                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                                node.width = size.width;
                                node.height = size.height;
                            } catch (e) {

                            }
                        }
                    });
                });
            }
        } else {
            cc.loader.load(url, function (err, img) {
                if (err) {
                    console.log('loadHeadSpriteFrame--------- 0');
                    console.log(err);
                } else {
                    if (img) {
                        try {
                            console.log('loadHeadSpriteFrame--------- 1');
                            let spriteFrame = new cc.SpriteFrame(img);
                            spriteFrame.name = url;
                            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                            node.width = size.width;
                            node.height = size.height;
                        } catch (e) {

                        }
                    } else {
                        console.log('loadHeadSpriteFrame--------- 2');
                    }
                }
            });
        }
        return node;
    },
    createLabel: function (txt, fontSize, color, horizontalAlign, verticalAlign) {
        color = undefined == color ? new cc.Color(255, 255, 255) : color;
        let node = new cc.Node();
        let label = node.addComponent(cc.Label);
        label.string = txt;
        label.fontSize = fontSize;
        label.lineHeight = fontSize;
        node.color = color;
        if (undefined != horizontalAlign) {
            label.horizontalAlign = horizontalAlign;
        }
        if (undefined != verticalAlign) {
            label.verticalAlign = verticalAlign;
        }
        return node;
    },
    createSpriteButton: function (noreFrame, pressFrame) {
        let node = new cc.Node();
        node.addComponent(cc.Sprite);
        let btn = node.addComponent(cc.Button);
        btn.transition = cc.Button.Transition.SPRITE;
        btn.name = name;
        cc.loader.loadRes(noreFrame, cc.SpriteFrame, function (err, spriteFrame) {
            btn.normalSprite = spriteFrame;
        });

        cc.loader.loadRes(pressFrame, cc.SpriteFrame, function (err, spriteFrame) {
            btn.pressedSprite = spriteFrame;
        });

        return node;
    },
    setLabelText: function (node, text) {
        let tf = node.getComponent(cc.Label);
        if (tf) tf.string = text;
    },
    setNodeVis: function (node, v) {
        if (node) node.active = v;
    },
    setCmpVis: function (cmp, v) {
        if (cmp) cmp.node.active = v;
    },
    getNodeVis: function (node) {
        if (node) return node.active;
        return false;
    },
    setNodeEnable: function (node, v) {
        if (node) node.getComponent(cc.Button).interactable = v;
    },
    playAnimation: function (node, an) {
        let ani = node.getComponent(cc.Animation);
        if (ani) ani.play(an);
    },
    playAnimationWithDragon: function (node, an, n) {
        let ani = node.getComponent(dragonBones.ArmatureDisplay);
        if (ani) ani.playAnimation(an, n);
    },
    createArray: function (max, value) {
        let arr = [];
        for (let i = 0; i < max; i++) {
            arr.push(value);
        }
        return arr;
    },
    getSex: function (id) {
        if (id == 1) return "man";
        return "female";
    },
    createPrefabNode: function (prefabPath, p, parent, isNeedLoad, callback) {
        if (isNeedLoad) {
            cc.loader.loadRes(prefabPath, cc.Prefab, function (error, prefab) {
                cc.log("lin=createCard:" + error);
                let nodepr = cc.instantiate(prefab);
                if (nodepr) {
                    if (p) nodepr.setPosition(p);
                    if (parent) nodepr.parent = parent;
                    if (callback) callback(nodepr);
                }
            })
        } else {
            let nodepr = cc.instantiate(prefabPath);
            if (nodepr) {
                nodepr.setPosition(p);
                nodepr.parent = parent;
                if (callback) callback(nodepr);
            }
        }
    },

    addBtnClick: function (btn, callback) {
        let self = this;
        btn.on('click', callback, this);
    },
    openPage(prefabPath, callback, boundleName) {
        // cc.loader.loadRes(prefabPath, cc.Prefab, function (err, prefab) {
        //     if (prefab && !err) {
        //         //实例化预制组件
        //         let nodePrefab = cc.instantiate(prefab);
        //         let nodeCanvas = cc.director.getScene().getChildByName('Canvas');
        //         nodeCanvas.addChild(nodePrefab);
        //
        //         //回调
        //         if (callback && callback != undefined) {
        //             callback(err, nodePrefab);
        //         }
        //         console.log("%c" + "openPage:" + prefabPath, "color:green");
        //     } else {
        //         //回调
        //         if (callback && callback != undefined) {
        //             callback(err, prefab);
        //         }
        //     }
        // });

        cc.assetManager.loadBundle(boundleName, null, (err, bundle) => {
            //这里存一下bundle，在bundle场景销毁的时候释放，保证下次bundle热更之后引用的资源都是最新的
            bundle.load(prefabPath, (err, sceneAsset) => {
                if (sceneAsset && !err) {
                    console.log("组件加载完成");
                    //实例化预制组件
                    let nodePrefab = cc.instantiate(sceneAsset);
                    let nodeCanvas = cc.director.getScene().getChildByName('Canvas');
                    nodeCanvas.addChild(nodePrefab);

                    //回调
                    if (callback && callback != undefined) {
                        callback(err, nodePrefab);
                    }
                    console.log("%c" + "openPage:" + prefabPath, "color:green");
                } else {
                    //回调
                    if (callback && callback != undefined) {
                        callback(err, sceneAsset);
                    }
                }
            });
        });
    },
    showTxtTip(txt) {
        this.openPage(PrefabPath.SystemLabel.path, function (err, nodePrefab) {
            let js = nodePrefab.getComponent("SystemLabel");
            js.showTxtTip(txt);
        }, PrefabPath.SystemLabel.bundle);
    }
};
