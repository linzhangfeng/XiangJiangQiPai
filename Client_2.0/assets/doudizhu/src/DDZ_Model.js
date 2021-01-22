module.exports = cc.Class({
    ctor() {
        this.players = [];
        this.seatid = -1;
        this.hostId = -1;
        this.cur_seat = -1;
        this.Play_num = 3;
        this.isEnterWait = false;
        this.uid = -1;
        this.roomid = -1;
        this.skey = "";
        this.gameid = -1;
        this.gametable = null;
        this.roomData = null;
        this.gameStart = false;
        this.gameState = GameState.GameFree;
        this.roomState = RoomState.RoomFree;
        this.table = null;
    },
    init: function (target) {
        console.log('Model.init');
        this.table = target;
        this.gameStart = false;
        let CC_DEV = true;
        if (CC_DEV) {
            let roomData = {};
            roomData.user_info = {"uid": 197364103, "skey": "197364103_1574943019_a5y4vgbr"};
            roomData.room_info = {"roomid": 1111, "gameid": 1001};
            roomData.room_info.users = [];
            roomData.room_info.users.push({"id": 1, "sex": 1, "icon": 1, "name": "other", "robot": 1});
            roomData.room_info.users.push({"id": 197364103, "sex": 1, "icon": 1, "name": "self", "robot": 0});

            roomData.server_info = {
                "ip": "119.23.221.227",
                "dev_port": 9999,
                "image_url": "http://wbsog.ihuizhi.com/test/"
            };
            this.roomData = roomData;
        }


        GHttp.imageurl = this.roomData.server_info.image_url;

        cc.log("roomData:" + JSON.stringify(this.roomData));

        let userInfo = this.roomData["user_info"];
        this.uid = GModel.uid;
        this.skey = userInfo.skey;

        let serverInfo = this.roomData["server_info"];
        GTcp.setHostIp(serverInfo.ip, serverInfo.dev_port);

        let roomInfo = this.roomData["room_info"];
        this.roomid = roomInfo.roomid;
        this.gameid = roomInfo.gameid;

        for (let i = 0; i < this.Play_num; i++) {
            let player = {};
            player.seatid = i;
            this.players[i] = player;
        }
    },
    //该座位ID是否是我
    isMyPlayer: function (seatID) {
        return seatID == this.seatid;
    },
    isMyPos: function (pos) {
        if (pos == 0 && this.seatid != -1) return true;
        return false;
    },
    isMySeat: function (seatid) {
        return this.seatid != -1 && seatid == this.seatid;
    },
    //座位ID转换当前位置
    getPosBySeatid: function (seatid) {
        let rePos = 0;
        let index = seatid - this.seatid;
        if (index >= 0) {
            rePos = index;
        } else {
            rePos = index + this.Play_num;
        }
        return rePos;

    },
    //当前位置转换座位ID
    getSeatidByPos: function (pos) {
        let reSeatId = 0;
        let seatid = pos + this.seatid;
        if (seatid >= this.Play_num) {
            reSeatId = seatid - this.Play_num;
        } else {
            reSeatId = seatid;
        }
        return reSeatId;
    },
    getPosByUID: function (uid) {
        for (let i = 0; i < this.Play_num; i++) {
            let player = this.players[i];
            if (player.uid == uid) {
                return this.getPosBySeatid(i);
            }
        }
        return 0;
    },
    getPlayer(seatID) {
        if (seatID == undefined) return this.players;
        return this.players[seatID];
    },

    initPlayer(seadId, player) {
        let playerData = this.getPlayer(seadId);
        playerData.uid = player.uid;
        playerData.sex = player.sex;
        playerData.avatar = player.avatar;
        playerData.name = player.name;
        playerData.voice = player.voice;
        playerData.seatid = player.seatid;
        playerData.robot = player.robot;
        playerData.score = player.score;
        playerData.ready = player.ready;
    },
});