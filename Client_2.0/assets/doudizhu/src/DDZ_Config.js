window.LANDLORD_CMD = {
    //--------------------server------------------
    SERVER_ROBDISBAND_ACK: 20000,          //广播开始抢地主
    SERVER_ROBDISBAND_RESULT: 20001,       //广播开始抢地主
    SERVER_SCENE_INFO_UC: 10001,           //场景消息
    //--------------------client------------------
    CLIENT_ROBDISBAND_SELECT: 2000,        //玩家抢地主选择结果
};

//----------------------------server---------------------------
window.LANDLORD_ProtoConfig = {};
LANDLORD_ProtoConfig[LANDLORD_CMD.SERVER_ROBDISBAND_ACK] = "proto.landlord.RobLandlord";
LANDLORD_ProtoConfig[LANDLORD_CMD.SERVER_ROBDISBAND_RESULT] = "proto.landlord.AckRobLandlordResult";
LANDLORD_ProtoConfig[LANDLORD_CMD.SERVER_SCENE_INFO_UC] = "proto.landlord.LandlordScene";


//----------------------------server---------------------------
window.LANDLORD_ProtoName = {};
LANDLORD_ProtoName[LANDLORD_CMD.SERVER_ROBDISBAND_ACK] = "LANDLORD_CMD.SERVER_ROBDISBAND_ACK";
LANDLORD_ProtoName[LANDLORD_CMD.SERVER_ROBDISBAND_RESULT] = "LANDLORD_CMD.SERVER_ROBDISBAND_RESULT";
LANDLORD_ProtoName[LANDLORD_CMD.SERVER_SCENE_INFO_UC] = "LANDLORD_CMD.SERVER_SCENE_INFO_UC";
