window.GTable = {
    init: function (bindobj) {
        // GModel.gametable = bindobj;
        // GUI.rootNode = bindobj.node;
        // GModel.init();
        // GUI.init();
        GTcp.init(this.dispach_cmd);
        // if (true) {
        //     GModel.gametable.schedule(this.updateGame, 0.0);
        // } else {
        //     GModel.gametable.schedule(this.test, 1.0);
        // }
    },
    release: function () {
        // cc.loader.release("prefab/shexingti");
        // GModel.gametable = null;
        // GUI.rootNode = null;
        // GUI.level_layer = null;
        // GUI.roles = null;
        // GUI.players = null;
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
            GTcp.sendLogin();
        } else if (cmd == window.TCPCMD.RECV_DATA_OK_RES) {
            try {
                var ok = GTable.handler_cmd(id, data, true);
                if (!ok) {
                    // cc.log("handler_cmd cmd=" + cmd + " id=" + id + " data=" + data);
                    GTcp.pushData(id, data);
                }
            } catch (e) {

            }
        }
    },
    updateGame: function (dt) {
        if (GModel.isEnterWait) {
            // cc.log(this, "isEnterWait");
            return;
        }

        var response = GTcp.popData();
        if (response) {
            cc.log("updateGame cmd=" + response.cmd + " data=" + response.data);
            GTable.handler_cmd(response.cmd, response.data, false);
        }
    },
    handler_cmd: function (cmd, jpacket, canWait) {
        switch (cmd) {
            case  CMD.server_scene_info_uc:
                this.handler_server_scene_info(jpacket);
                break;

            case  CMD.server_login_ack:
                this.handler_server_login_ack(jpacket);
                break;

            case  CMD.server_enter_yaoshaizi_bc:
                if (canWait && GModel.isEnterWait) return false;
                this.handler_server_ener_yaoshaizi(jpacket);
                break;

            case  CMD.server_yaoshaizi_bc:
                if (canWait && GModel.isEnterWait) return false;
                this.handler_server_yaoshaizi_result(jpacket);
                break;

            case  CMD.server_game_end:
                if (canWait && GModel.isEnterWait) return false;
                this.handler_server_game_end(jpacket);
                break;

            case  CMD.server_emoji:
                this.handler_server_emoji(jpacket);
                break;

            case  CMD.server_voice:
                this.handler_server_vioce(jpacket);
                break;
        }
        return true;
    },
    handler_server_login_ack: function (data) {
        var packet = ProtoTool.parsePacket("proto.game.shetiqi.LoginAck", data);
        if (packet.code == 404) {
            if (global && global.showGameEnd)global.showGameEnd(null,function(){
                GUI.rootNode.destroy();
            });
            return;
        }
        GModel.gameStart = true;
    },
    initPlayerData: function (player_info) {
        for (var i = 0; i < player_info.length; i++) {
            var pinfo = player_info[i];
            var seatid = pinfo.seatid;
            var uid = pinfo.uid;
            if (GModel.uid == uid) {
                GModel.seatid = seatid;
            }
            var player = GModel.players[seatid];
            player.uid = pinfo.uid;
            player.sex = pinfo.sex;
            player.name = pinfo.name;
            player.avatar = pinfo.avatar;
            GUI.playerLogin(seatid);
        }
    },
    handler_server_scene_info: function (data) {
        var packet = ProtoTool.parsePacket("proto.game.shetiqi.GameSence", data);
        var props = packet.prop_info;
        GUI.initLevel(props);
        this.initPlayerData(packet.player_info);
        for (var i = 0; i < packet.player_pos.length; i++) {
            GUI.setPlayerPos(i, packet.player_pos[i]);
        }
        for (var i = 0; i < packet.shaizi.length; i++) {
            GUI.initShaiziNums(i, packet.shaizi[i]);
        }
        GModel.cur_seat = packet.cur_seatid;
        if (GModel.cur_seat >= 0 && GModel.cur_seat < GModel.Play_num) {
            GUI.enterRunShaizi(GModel.cur_seat, packet.shaizi_time);
        }
        GUI.showReadyGo();
    },
    handler_server_ener_yaoshaizi: function (data) {
        var packet = ProtoTool.parsePacket("proto.game.shetiqi.enterShaiZi", data);
        var seatid = packet.seatid;
        GUI.enterRunShaizi(seatid, 15);
        if (packet.issix == 1) {
            GUI.showSixMoreTime(seatid);
        }
    },
    handler_server_yaoshaizi_result: function (data) {
        var packet = ProtoTool.parsePacket("proto.game.shetiqi.ShaiZiInfo", data);
        var seatid = packet.seatid;
        var sz_num = packet.shaizi;
        GModel.isEnterWait = true;
        GUI.runShaizi(seatid, sz_num);
        this.delayTime(1, function () {
            var mid2 = null;
            if (packet.props != null) {
                mid2 = packet.end_pos;
            }
            GUI.playerMove(seatid, sz_num, mid2);
        });
        if (packet.out_time) {
            GUI.showOutTime(seatid, packet.out_time);
        }
    },
    handler_server_game_end: function (data) {
        GModel.gametable.unschedule(this.updateGame);
        try {
            var packet = ProtoTool.parsePacket("proto.game.shetiqi.GameEnd", data);
            var gamedata = {};
            for (var i = 0; i < GModel.players.length; i++) {
                var uid = GModel.players[i].uid;
                var seatid = GModel.players[i].seatid;
                if (packet.seatid == seatid) {
                    gamedata[uid] = 1;
                } else {
                    gamedata[uid] = 0;
                }
            }
            if (global && global.showGameEnd) global.showGameEnd(gamedata, function () {
                GUI.rootNode.destroy();
            });
        } catch (e) {
            GUI.rootNode.destroy();
        }
    },

    handler_server_emoji: function (data) {
        var packet = ProtoTool.parsePacket("proto.game.shetiqi.Emoji", data);
        var seatid = packet.seatid;
        var id = packet.id;
        GUI.showPlayerFace(seatid, id);
    },

    handler_server_vioce: function (data) {
        var packet = ProtoTool.parsePacket("proto.game.shetiqi.Voice", data);
        var seatid = packet.charid;
        var state = packet.status;
        var player = GModel.players[seatid];
        if(state == 1){
            GUI.playerSoundOn(player.uid,true);
        } else {
            GUI.playerSoundOff(player.uid,true);
        }
    },

    delayTime: function (dl, cb) {
        if (GModel.gametable) GModel.gametable.scheduleOnce(function () {
            try {
                if (cb) cb();
            } catch (e) {
            }
        }, dl);
    },
};
