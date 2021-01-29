module.exports = cc.Class({
    properties:{
        rootNode: null,
    },
    ctor() {
        console.log("DDZ_Table");
        this.jsDisband = null;
    },
    init: function (bindobj) {
        cc.ddz.Model.gametable = bindobj;
        cc.ddz.Model.init(this);
        cc.ddz.GUI.init(bindobj.node, this);
        GTcp.init(this.dispach_cmd.bind(this));
        if (true) {
            cc.ddz.Model.gametable.schedule(this.updateGame.bind(this), 0.0);
        } else {
            cc.ddz.Model.gametable.schedule(this.test, 1.0);
        }
    },
    release: function () {
        // cc.loader.release("prefab/shexingti");
        cc.ddz.Model.gametable = null;
        this.rootNode = null;
        GTcp.close();
    },
    test: function (dt) {

    },
    dispach_cmd: function (cmd, id, data) {
        cc.log("dispach_cmd cmd=" + cmd + " id=" + id + " data=" + data);
        if (cmd == TCPCMD.DISCONNECT_RES || cmd == TCPCMD.CONNECT_ERROR_RES || cmd == TCPCMD.SEND_DATA_ERROR_RES || cmd == TCPCMD.RECV_DATA_ERROR_RES) //关闭
        {
            GTcp.reConnect();
        } else if (cmd == window.TCPCMD.CONNECT_OK_RES) {
            GTcp.sendLogin({
                uid: cc.ddz.Model.uid,
                roomid: cc.ddz.Model.roomid,
                skey: cc.ddz.Model.skey,
                gameid: cc.ddz.Model.gameid
            });
        } else if (cmd == window.TCPCMD.RECV_DATA_OK_RES) {
            try {
                // let ok = this.handler_cmd(id, data, true);
                // if (!ok) {
                //解析协议
                console.log('%c' + ProtoName[id] + " cmd:" + id, 'color:red');
                let packet = ProtoTool.parsePacket(ProtoConfig[id], data);
                GTcp.pushData(id, packet);
                // }
            } catch (e) {

            }
        }
    },
    updateGame: function (dt) {
        if (cc.ddz.Model.isEnterWait) {
            return;
        }

        let response = GTcp.popData();
        if (response) {
            cc.log('%c' + "action:cmd=" + response.cmd + " data=" + JSON.stringify(response.data), 'color:violet');
            this.handler_cmd(response.cmd, response.data, false);
        }
    },
    handler_cmd: function (cmd, jpacket, canWait) {
        switch (cmd) {
            case  CMD.SERVER_SCENE_INFO_UC:
                this.handler_server_scene_info(jpacket);
                break;

            case  CMD.SERVER_LOGIN_ACK:
                this.handler_server_login_ack(jpacket);
                break;

            case  CMD.SERVER_GAME_END:
                if (canWait && GModel.isEnterWait) return false;
                this.handler_server_game_end(jpacket);
                break;

            case  CMD.SERVER_EMOJI:
                this.handler_server_emoji(jpacket);
                break;

            case  CMD.SERVER_EMOJI:
                this.handler_server_vioce(jpacket);
                break;
            case  CMD.SERVER_UPTABLE_ACK:
                this.handler_server_uptable_ack(jpacket);
                break;
            case  CMD.SERVER_DOWNTABLE_ACK:
                this.handler_server_downtable_ack(jpacket);
                break;
            case  CMD.SERVER_READY_ACK:
                this.handler_server_ready_ack(jpacket);
                break;
            case  CMD.SERVER_LOGOUT_ACK:
                this.handler_server_logout_ack(jpacket);
                break;
            case  CMD.SERVER_GAME_REQ_DISBAND:
                this.handler_server_req_disband(jpacket);
                break;
            case  CMD.SERVER_GAME_DISBAND_SELECT:
                this.handler_server_disband_select(jpacket);
                break;
            case  CMD.SERVER_GAME_DISBAND_RESUILT:
                this.handler_server_disband_result(jpacket);
                break;
            case  CMD.SERVER_GAME_START:
                this.handler_server_game_start(jpacket);
                break;
            case  CMD.SERVER_GAME_SEND_CARD:
                this.handler_server_send_card(jpacket);
                break;
            case  LANDLORD_CMD.SERVER_ROBDISBAND_ACK:
                this.handler_server_rob_landlord_ack(jpacket);
                break;
            case  LANDLORD_CMD.SERVER_ROBDISBAND_RESULT:
                this.handler_server_rob_landlord_result(jpacket);
                break;
        }
        return true;
    },
    handler_server_rob_landlord_result(data) {
        console.log('%c' + "handler_server_rob_landlord_result:", 'color:red');
        let seatid = data.seatid;
        let rod_value = data.rod_value;
        let public_cards = data.public_cards;
        let pos = cc.ddz.Model.getPosBySeatid(seatid);
        cc.ddz.Model.seatid = seatid;
        cc.ddz.Model.robScore = rod_value;

        cc.ddz.CardsMgr.setPublicCardsValue(public_cards);
        cc.ddz.CardsMgr.updatePublicCards(public_cards);

        let jsPlayer = cc.ddz.PlayerMgr.getJsPlayerByPos(pos);
        jsPlayer.setLandlordIconVis(true);
    },

    handler_server_rob_landlord_ack(data) {
        console.log('%c' + "handler_server_rob_landlord:", 'color:red');
        let seatid = data.seatid;
        let operatorid = data.operatorid;
        let rod_values = data.rod_values;
        let rod_value = data.rod_value;
        let isfinish = data.isfinish;
        let isFirst = (seatid == operatorid);
        let pos = cc.ddz.Model.getPosBySeatid(seatid);
        if (cc.ddz.Model.isMyPlayer(operatorid) && !isfinish) {
            cc.ddz.ActionMgr.setOperator(rod_values, isFirst);
        }
        if (!isFirst) cc.ddz.TipMgr.showRobScoreTxt(pos, rod_value, rod_values.length == 3);
    },
    handler_server_send_card(data) {
        console.log('%c' + "handler_server_send_card:", 'color:red');
        let changeableCardsLen = data.changeableCardsLen;
        let changeableCards = data.changeableCards;
        cc.ddz.CardsMgr.setHandCardsValue(changeableCards);
        cc.ddz.CardsMgr.updateHandcards(changeableCards);
    },

    handler_server_game_start(data) {
        console.log('%c' + "handler_server_game_start:", 'color:red');
        //修改房间状态
        cc.ddz.Model.roomState = RoomState.RoomPlaying;
        //修改r游戏状态
        cc.ddz.Model.gameState = GameState.GamePlaying;
    },

    handler_server_disband_result(data) {
        console.log('%c' + "handler_server_disband_result:", 'color:red');
        let result = data.result;
        if (this.jsDisband) {
            this.jsDisband.remove()
            this.jsDisband = null;
        }
        if (result == 1) {
            GUtils.showTxtTip("解散成功，3秒后自动退出房间");
        } else if (result == 2) {
            GUtils.showTxtTip("解散失败");
            cc.ddz.Model.resetDisbandData();
        }
    },

    handler_server_req_disband(data) {
        console.log('%c' + "handler_server_disband:", 'color:red');
        let disbandid = data.disband_id;
        let seatid = data.seatid;
        let state = data.state;
        let players = cc.ddz.Model.getPlayer(seatid);
        players.disband = state;
        if (disbandid == cc.ddz.Model.seatid) {
            GUtils.openPage(PrefabPath.Disband.path, function (err, nodePage) {
                this.jsDisband = nodePage.getComponent("Disband");
                this.jsDisband.updatePlayerInfo(cc.ddz.Model.getPlayer(), disbandid);
            }.bind(this), PrefabPath.Disband.bundle);
        } else {
            GUtils.openPage(PrefabPath.SystemAlert.path, function (err, nodePage) {
                let js = nodePage.getComponent("SystemAlert");
                js.init(disbandid + "当前玩家申请解散");
                js.setBtnVis(true, true);
                js.addListener(function (target) {
                    GTcp.sendDisbandSelect(cc.ddz.Model.seatid, 1);
                }, function (target) {
                    GTcp.sendDisbandSelect(cc.ddz.Model.seatid, 2);
                }, true)
            }, PrefabPath.Disband.bundle);
        }
    },


    handler_server_disband_select(data) {
        console.log('%c' + "handler_server_disband_select:", 'color:red');
        let disbandid = data.disband_id;
        let seatid = data.seatid;
        let state = data.state;
        let players = cc.ddz.Model.getPlayer(seatid);
        players.disband = state;

        if (cc.ddz.Model.isMyPlayer(seatid)) {
            cc.ddz.Model.isEnterWait = true;
            GUtils.openPage(PrefabPath.Disband.path, function (err, nodePage) {
                this.jsDisband = nodePage.getComponent("Disband");
                this.jsDisband.updatePlayerInfo(cc.ddz.Model.getPlayer(), disbandid);
                cc.ddz.Model.isEnterWait = false;
            }.bind(this), PrefabPath.Disband.bundle);
        } else {
            if (this.jsDisband) this.jsDisband.updatePlayerInfo(cc.ddz.Model.getPlayer(), disbandid);
        }
    },

    handler_server_ready_ack(data) {
        console.log('%c' + "handler_server_ready_ack:", 'color:red');
        let seatid = data.seatid;
        let isReady = data.isReady;
        cc.ddz.PlayerMgr.setReadyState(seatid, isReady);

        if (cc.ddz.Model.isMyPlayer(seatid)) {
            cc.ddz.PublicMgr.setBtnReadyVis(!isReady);
            cc.ddz.PublicMgr.setBtnNoReadyVis(isReady);
        }
    },

    handler_server_logout_ack(data) {
        console.log('%c' + "handler_server_exitout_room_ack:", 'color:red');
        let seatid = data.seatid;
        cc.ddz.PlayerMgr.downTable(seatid);
        if (seatid == cc.ddz.Model.seatid) {
            this.release()
            GPlatform.toHall();
        }
    },

    handler_server_login_ack: function (data) {
        console.log('%c' + "handler_server_login_ack:", 'color:red');
        cc.ddz.Model.gameStart = true;
    },

    handler_server_scene_info: function (data) {
        cc.ddz.Model.roomState = data.room_state;
        cc.ddz.Model.gameState = data.game_state;
        cc.ddz.Model.hostId = data.host_id;
        this.initPlayerData(data.player_info)

        if (cc.ddz.Model.roomState == RoomState.RoomFree) {
            let playerData = cc.ddz.Model.getPlayer(cc.ddz.Model.seatid);
            cc.ddz.PublicMgr.showPublicBtns(cc.ddz.Model.hostId == cc.ddz.Model.seatid, playerData.ready);
            return;
        }
    },

    handler_server_game_end: function (data) {
        cc.ddz.Model.gametable.unschedule(this.updateGame);
    },

    handler_server_emoji: function (data) {
        let packet = ProtoTool.parsePacket("proto.game.shetiqi.Emoji", data);
        let seatid = packet.seatid;
        let id = packet.id;
        // cc.ddz.TipMgr.showFace(seatid, id);
    },

    handler_server_vioce: function (data) {
        // let packet = ProtoTool.parsePacket("proto.game.shetiqi.Voice", data);
        // let seatid = packet.charid;
        // let state = packet.status;
        // return;
        // let player = GModel.players[seatid];
        // if (state == 1) {
        //     GUI.playerSoundOn(player.uid, true);
        // } else {
        //     GUI.playerSoundOff(player.uid, true);
        // }
    },
    handler_server_uptable_ack(data) {
        console.log('%c' + "handler_server_uptable_ack:", 'color:red');
        let seatId = data.seatid;
        let player = data.player;
        if (cc.ddz.Model.uid == player.uid) cc.ddz.Model.seatid = seatId;
        if (!cc.ddz.Model.isMyPlayer(seatId)) {
            cc.ddz.Model.initPlayer(seatId, player);
            let playerData = cc.ddz.Model.getPlayer(seatId);
            cc.ddz.PlayerMgr.upTable(playerData);
        }
    },
    handler_server_downtable_ack(data) {

    },

    initPlayerData: function (player_info) {
        for (let i = 0; i < player_info.length; i++) {
            let pinfo = player_info[i];
            let seatid = pinfo.seatid;
            let uid = pinfo.uid;
            if (cc.ddz.Model.uid == uid) {
                cc.ddz.Model.seatid = seatid;
            }
            cc.ddz.Model.initPlayer(seatid, pinfo);
            cc.ddz.PlayerMgr.upTable(pinfo);
        }
    },

});