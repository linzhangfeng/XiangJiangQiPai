window.LANDLORD_CMD =
    {
        //--------------------server------------------
        SERVER_ROBDISBAND_ACK: 20000,          //广播开始抢地主
        SERVER_ROBDISBAND_RESULT: 20001,       //广播开始抢地主

        //--------------------client------------------
        CLIENT_ROBDISBAND_SELECT: 2000,        //玩家抢地主选择结果
    }
;

module.exports = cc.Class({
    rootNode: null,
    init(rootNode) {

    },
});
