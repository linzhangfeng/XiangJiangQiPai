#ifndef PROTO_H
#define PROTO_H


enum ServerCMD {
    SERVER_LOGIN_ACK = 10000,        //登录广播
    SERVER_SCENE_INFO_UC = 10001,    //场景消息
    SERVER_GAME_END = 10002,         //游戏结束
    SERVER_EMOJI = 10003,            //表情广播
    SERVER_GAME_START = 10004,       //游戏开始
    SERVER_HEART = 10005,            //心跳
    SERVER_VOICE = 10012,            //声音广播
    SERVER_UPTABLE_ACK = 10013,      //上桌广播
    SERVER_DOWNTABLE_ACK = 10014,    //下桌广播
    SERVER_READY_ACK = 10015,        //准备状态广播
    SERVER_LOGOUT_ACK = 10016,       //准备状态广播
    SERVER_GAME_REQ_DISBAND = 10017,            //发起解散
    SERVER_GAME_DISBAND_SELECT = 10018,         //发起解散
    SERVER_GAME_DISBAND_RESUILT = 10019,        //解散结果
};


enum ClientCMD {
    CLIENT_LOGIN = 1001,            //客户端登录
    CLIENT_LOGOUT = 1002,           //玩家登出
    CLIENT_EMOJI = 1003,            //表情
    CLIENT_HEART = 1004,            //心跳

    CLIENT_VOICE = 1012,            //玩家voice状态
    CLIENT_READY = 1013,            //玩家准备
    CLIENT_REQ_DISBAND = 1014,          //玩家申请解散
    CLIENT_DISBAND_SELECT = 1015,          //玩家申请解散
};


#endif