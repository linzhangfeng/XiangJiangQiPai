window.GTcp = {
    url: "",
    ip: "",
    port: 0,
    dispach_fun: null,
    temp_data_array: [],
    init: function (callfun) {
        let self = this;
        this.loadProto(function () {
            socket.set_dispach_fun(callfun);
            self.connect();
        });
    },
    loadProto: function (cb) {
        let protoFilesbfu = [
            {
                files: 'login.proto',
                package: 'proto.login'
            }, {
                files: 'game.proto',
                package: 'proto.game'
            }, {
                files: 'landlord.proto',
                package: 'proto.landlord'
            }];
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
        console.log("%c" + ProtoName[cmd] + "  cmd:" + cmd, "color:red");
        console.log("%c" + "sendData:" + JSON.stringify(data), "color:green");
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
        let data = this.temp_data_array.shift();
        cc.log("popData:" + JSON.stringify(data));
        return data;
    },
    sendReady(seatid, isReady) {
        let packet = ProtoTool.createPacket("proto.login.Ready");
        packet.isReady = isReady;
        packet.seatid = seatid;
        this.sendData(CMD.CLIENT_READY, packet);
    },

    sendLogin: function (data) {
        if (!data) return;
        let packet = ProtoTool.createPacket("proto.login.Login");
        packet.uid = data.uid;
        packet.roomid = data.roomid;
        packet.skey = data.skey;
        packet.gameid = data.gameid;
        packet.reconnect = false;
        this.sendData(CMD.CLIENT_LOGIN, packet);
    },
    sendLogout: function (seatId) {
        let packet = ProtoTool.createPacket("proto.login.Logout");
        packet.set_seatid(seatId);
        this.sendData(CMD.CLIENT_LOGOUT, packet);
    },

    sendDisband: function (seatId) {
        let packet = ProtoTool.createPacket("proto.game.GameDisband");
        packet.disband_id = seatId;
        this.sendData(CMD.CLIENT_REQ_DISBAND, packet);
    },

    sendBigFace: function (id, seatId) {
        let packet = ProtoTool.createPacket("proto.login.Emoji");
        packet.seatid = seatId;
        packet.id = id;
        this.sendData(CMD.CLIENT_EMOJI, packet);
    },
    sendVoiceState: function (state, seatId) {
        let packet = ProtoTool.createPacket("proto.login.Voice");
        packet.charid = seatId;
        packet.status = state;
        this.sendData(CMD.CLIENT_VOICE, packet);
    },
    sendDisbandSelect(seatId, state) {
        let packet = ProtoTool.createPacket("proto.game.GameDisband");
        packet.seatid = seatId;
        packet.state = state;
        this.sendData(CMD.CLIENT_DISBAND_SELECT, packet);
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
        let self = this;
        let ws = new WebSocket(wsconnector);
        this.ws = ws;
        ws.binaryType = 'arraybuffer';
        ws.onopen = function (evt) {
            console.log('连接' + wsconnector + '服务器成功!');
            if (self.dispach_fun) {
                self.dispach_fun(TCPCMD.CONNECT_OK_RES, 0, "");
            }
        }

        ws.onmessage = function (evt) {
            let data = evt.data;
            let view_head = new Int32Array(data, 0, 2);
            let id = view_head[0];
            let bf = new ArrayBuffer(data.byteLength - 8);
            let view_bf = new Int8Array(bf);
            let view_data = new Int8Array(data);
            for (let i = 0, len = data.byteLength - 8; i < len; ++i) {
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
            let databf = protodata.toArrayBuffer();
            let bf = new ArrayBuffer(databf.byteLength + 8);
            let view_head = new Int32Array(bf, 0, 2);
            view_head[0] = id;
            view_head[1] = databf.byteLength;
            let view_bf = new Int8Array(bf, 8);
            let view_data = new Int8Array(databf);
            for (let i = 0; i < databf.byteLength; ++i) {
                view_bf[i] = view_data[i];
            }
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
