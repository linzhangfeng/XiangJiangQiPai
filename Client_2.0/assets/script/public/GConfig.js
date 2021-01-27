window.CMD = {
    CLIENT_LOGIN: 1001,     //客户端登录
    CLIENT_LOGOUT: 1002,    //玩家登出
    CLIENT_EMOJI: 1003,     //表情
    CLIENT_HEART: 1004,     //心跳
    CLIENT_VOICE: 1012,     //玩家voice状态
    CLIENT_READY: 1013,     //玩家准备
    CLIENT_REQ_DISBAND: 1014,          //玩家申请解散
    CLIENT_DISBAND_SELECT: 1015,          //玩家申请解散

    SERVER_LOGIN_ACK: 10000,        //登录广播
    SERVER_SCENE_INFO_UC: 10001,    //场景消息
    SERVER_GAME_END: 10002,         //游戏结束
    SERVER_EMOJI: 10003,            //表情广播
    SERVER_GAME_START: 10004,       //游戏开始
    SERVER_HEARTBEAT: 10005,        //心跳
    SERVER_VOICE: 10012,            //声音广播
    SERVER_UPTABLE_ACK: 10013,      //上桌广播
    SERVER_DOWNTABLE_ACK: 10014,    //下桌广播
    SERVER_READY_ACK: 10015,        //准备状态广播
    SERVER_LOGOUT_ACK: 10016,       //准备登出广播
    SERVER_GAME_REQ_DISBAND: 10017,            //发起解散
    SERVER_GAME_DISBAND_SELECT: 10018,         //发起解散
    SERVER_GAME_DISBAND_RESUILT: 10019,        //解散结果
    //game
    SERVER_GAME_SEND_CARD: 10100,               //发牌消息
};

//----------------------------server---------------------------
window.ProtoConfig = {};
ProtoConfig[CMD.SERVER_LOGIN_ACK] = "proto.login.LoginAck";
ProtoConfig[CMD.SERVER_SCENE_INFO_UC] = "proto.game.GameScene";
ProtoConfig[CMD.SERVER_GAME_END] = "proto.game.GameEnd";
ProtoConfig[CMD.SERVER_EMOJI] = "proto.login.Emoji";
ProtoConfig[CMD.SERVER_VOICE] = "proto.login.Voice";
ProtoConfig[CMD.SERVER_UPTABLE_ACK] = "proto.login.UpTable";
ProtoConfig[CMD.SERVER_DOWNTABLE_ACK] = "proto.login.DownTable";
ProtoConfig[CMD.SERVER_READY_ACK] = "proto.login.Ready";
ProtoConfig[CMD.SERVER_GAME_START] = "proto.game.GameStart";
ProtoConfig[CMD.SERVER_LOGOUT_ACK] = "proto.login.Logout";
ProtoConfig[CMD.SERVER_GAME_REQ_DISBAND] = "proto.game.GameDisband";
ProtoConfig[CMD.SERVER_GAME_DISBAND_SELECT] = "proto.game.GameDisband";
ProtoConfig[CMD.SERVER_GAME_DISBAND_RESUILT] = "proto.game.GameDisbandResult";
ProtoConfig[CMD.SERVER_GAME_SEND_CARD] = "proto.game.HandCards";

//----------------------------clinet---------------------------
ProtoConfig[CMD.CLIENT_READY] = "proto.login.Ready";
ProtoConfig[CMD.CLIENT_LOGOUT] = "proto.login.LogoutAck";

//----------------------------server---------------------------
window.ProtoName = {};
ProtoName[CMD.SERVER_LOGIN_ACK] = "CMD.SERVER_LOGIN_ACK";
ProtoName[CMD.SERVER_SCENE_INFO_UC] = "CMD.SERVER_SCENE_INFO_UC";
ProtoName[CMD.SERVER_GAME_END] = "CMD.SERVER_GAME_END";
ProtoName[CMD.SERVER_EMOJI] = "CMD.SERVER_EMOJI";
ProtoName[CMD.SERVER_VOICE] = "CMD.SERVER_VOICE";
ProtoName[CMD.SERVER_UPTABLE_ACK] = "CMD.SERVER_UPTABLE_ACK";
ProtoName[CMD.SERVER_DOWNTABLE_ACK] = "CMD.SERVER_DOWNTABLE_ACK";
ProtoName[CMD.SERVER_READY_ACK] = "CMD.SERVER_READY_ACK";
ProtoName[CMD.SERVER_GAME_START] = "CMD.SERVER_GAME_START";
ProtoName[CMD.SERVER_LOGOUT_ACK] = "CMD.SERVER_LOGOUT_ACK";
ProtoName[CMD.SERVER_GAME_REQ_DISBAND] = "CMD.SERVER_GAME_REQ_DISBAND";
ProtoName[CMD.SERVER_GAME_DISBAND_SELECT] = "CMD.SERVER_GAME_DISBAND_SELECT";
ProtoName[CMD.SERVER_GAME_DISBAND_RESUILT] = "CMD.SERVER_GAME_DISBAND_RESUILT";
ProtoName[CMD.SERVER_GAME_SEND_CARD] = "CMD.SERVER_GAME_SEND_CARD";

//----------------------------clinet---------------------------
ProtoName[CMD.CLIENT_READY] = "CMD.CLIENT_READY";
ProtoName[CMD.CLIENT_LOGOUT] = "CMD.CLIENT_LOGOUT";

window.PrefabPath = {
    Disband: {
        path: "Disband/Disband",
        bundle: "Component",
    },
    SystemAlert: {
        path: "SystemAlert/SystemAlert",
        bundle: "Component",
    },
    SystemLabel: {
        path: "SystemLabel/SystemLabel",
        bundle: "Component",
    },
    Player: {
        path: "Player/Player",
        bundle: "Component",
    }
}

window.RoomState = {
    RoomFree: 0,
    RoomPlaying: 1,
    RoomEnd: 2,
}

window.GameState = {
    GameFree: 0,
    GamePlaying: 1,
    GameEnd: 2,
}