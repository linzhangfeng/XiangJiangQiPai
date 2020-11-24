window.CMD = {
    client_login: 1001,
    client_logout: 1002,
    client_emoji: 1003,
    client_voice: 1012,
    client_shaizi_req: 5000,
    server_login_ack: 10000,
    server_scene_info_uc: 10001,
    server_enter_yaoshaizi_bc: 11001,
    server_yaoshaizi_bc: 11000,
    server_game_end: 10002,
    server_emoji: 10003,
    server_game_start: 10004,
    server_hearbeat: 10005,
    server_voice: 10012,
};

window.GTcp =
    {
        url: "",
        ip: "",
        port: 0,
        dispach_fun: null,
        temp_data_array: [],
        init: function (callfun) {
            var self = this;
            this.setHostIp("119.23.221.227", 9999);
            this.loadProto(function () {
                socket.set_dispach_fun(callfun);
                self.connect();
            });
        },
        loadProto: function (cb) {
            var protoFilesbfu = [
                {
                    files: 'shetiqi.proto',
                    package: 'proto.game.shetiqi'
                },
            ];
            ProtoTool.loadFiles(protoFilesbfu, cb);
        },
        setHostIp: function (ip, port) {
            this.url = "ws://" + ip + ":" + port;
        },
        connect: function () {
            this.temp_data_array = [];
            socket.connect(this.url);
        },
        sendData: function (cmd, data) {
            cc.log("cmd:" + cmd + "  sendData:" + JSON.stringify(data));
            socket.send(data, cmd);
        },
        reConnect: function () {
            this.temp_data_array = [];
            socket.connect(this.url);
        },
        close: function () {
            socket.close();
        },
        pushData: function (cmd, data) {
            this.temp_data_array.push({"cmd": cmd, "data": data});
        },
        popData: function () {
            // cc.log("temp_data_array l:" + this.temp_data_array.length);
            if (this.temp_data_array.length == 0) return null;
            var data = this.temp_data_array.shift();
            cc.log("popData:" + JSON.stringify(data));
            return data;
        },
        sendLogin: function () {
            var packet = ProtoTool.createPacket("proto.game.shetiqi.Login");
            packet.uid = 123456;
            packet.roomid = 123456;
            packet.skey = "123456";
            packet.gameid = 123456;
            packet.player_info = [];
            packet.reconnect = false;

            // var roomData = GModel.roomData;
            // var roomInfo = roomData["room_info"];
            // for (var i = 0; i < roomInfo.users.length; i++) {
            //     var playerData = roomInfo.users[i];
            //     var player = {};
            //     player.uid = playerData.id;
            //     player.sex = playerData.sex;
            //     player.avatar = playerData.icon;
            //     player.name = playerData.name;
            //     player.robot = playerData.robot;
            //     packet.player_info.push(player);
            // }
            this.sendData(CMD.client_login, packet);
        },
        sendLogout: function () {
            var packet = ProtoTool.createPacket("proto.game.shetiqi.Login");
            this.sendData(CMD.client_logout, packet);
        },
        runShuaiZi: function () {
            var packet = ProtoTool.createPacket("proto.game.shetiqi.GetShaiZi");
            this.sendData(CMD.client_shaizi_req, packet);
        },
        sendBigFace: function (id) {
            var packet = ProtoTool.createPacket("proto.game.shetiqi.Emoji");
            packet.seatid = GModel.seatid;
            packet.id = id;
            this.sendData(CMD.client_emoji, packet);
        },
        sendVoiceState: function (state) {
            var packet = ProtoTool.createPacket("proto.game.shetiqi.Voice");
            packet.charid = GModel.seatid;
            packet.status = state;
            this.sendData(CMD.client_voice, packet);
        },
    };

window.TCPCMD = {
    CONNECT_OK_RES: 0,
    CONNECT_ERROR_RES: 1,
    SEND_DATA_OK_RES: 2,
    SEND_DATA_ERROR_RES: 3,
    RECV_DATA_OK_RES: 4,
    RECV_DATA_ERROR_RES: 5,
    DISCONNECT_RES: 6
};

window.socket = {
    ws: null,                  //网络对像
    dispach_fun: null,
    set_dispach_fun: function (fun) {
        this.dispach_fun = fun;
    },
    /**
     * 开始Socket连接
     */
    connect: function (wsconnector) {
        if (this.ws) {
            if (WebSocket.CONNECTING == this.ws.readyState) {//正在链接中
                return;
            } else if (WebSocket.OPEN == this.ws.readyState) {//已经链接并且可以通讯
                return;
            } else if (WebSocket.CLOSING == this.ws.readyState) {//连接正在关闭
                return;
            } else if (WebSocket.CLOSED == this.ws.readyState) {//连接已关闭或者没有链接成功
            }
        }
        var self = this;
        var ws = new WebSocket(wsconnector);
        this.ws = ws;
        ws.binaryType = 'arraybuffer';
        ws.onopen = function (evt) {
            console.log('连接' + wsconnector + '服务器成功!');
            this.ws = null;
            self.connect();
            if (self.dispach_fun) {
                self.dispach_fun(TCPCMD.CONNECT_OK_RES, 0, "");
            }
        }

        ws.onmessage = function (evt) {
            var data = evt.data;
            var view_head = new Int32Array(data, 0, 2);
            var id = view_head[0];
            var bf = new ArrayBuffer(data.byteLength - 8);
            var view_bf = new Int8Array(bf);
            var view_data = new Int8Array(data);
            for (var i = 0, len = data.byteLength - 8; i < len; ++i) {
                view_bf[i] = view_data[i + 8];
            }
            if (self.dispach_fun) {
                self.dispach_fun(TCPCMD.RECV_DATA_OK_RES, id, bf);
            }
        }

        ws.onerror = function (evt) {
            console.error('-----------------网络异常');
            if (self.dispach_fun) {
                self.dispach_fun(TCPCMD.CONNECT_ERROR_RES, 0, "CONNECT_ERROR_RES");
            }
        }

        ws.onclose = function (evt) {
            console.error('-----------------网络关闭');
            if (this.dispach_fun) {
                this.dispach_fun(TCPCMD.CONNECT_ERROR_RES, 0, "CONNECT_ERROR_RES");
            }
        }
    },

    /**
     * 发送网络
     */
    send: function (protodata, id) {
        if (this.ws && WebSocket.OPEN == this.ws.readyState) {
            var databf = protodata.toArrayBuffer();
            var bf = new ArrayBuffer(databf.byteLength + 8);
            var view_head = new Int32Array(bf, 0, 2);
            view_head[0] = id;
            view_head[1] = databf.byteLength;
            var view_bf = new Int8Array(bf, 8);
            var view_data = new Int8Array(databf);
            for (let i = 0; i < databf.byteLength; ++i) {
                view_bf[i] = view_data[i];
            }
            cc.log("cmd:" + id + "  sendData bf:" +bf);
            this.ws.send(bf);
        } else {
            console.log('无法发送消息...');
            if (this.dispach_fun) {
                this.dispach_fun(TCPCMD.SEND_DATA_ERROR_RES, 0, "SEND_DATA_ERROR_RES");
            }
        }
    },

    /**
     * 关闭网络
     */
    close: function () {
        try {
            if (this.ws && WebSocket.OPEN == this.ws.readyState) {
                this.ws.close();
            }
            this.ws = null;
            this.dispach_fun = null;
        } catch (e) {

        }
    },
};
