
// C2S_DDZ_CREATE_ROOM 		 : "4100",
// S2C_DDZ_CREATE_ROOM 		 : "4101",
// C2S_DDZ_JOIN_ROOM 		 : "4102",
// S2C_DDZ_JOIN_ROOM 		 : "4103",
// C2S_DDZ_JOIN_ROOM_AGAIN	 : "4104",
// S2C_DDZ_JOIN_ROOM_AGAIN	 : "4105",
// C2S_DDZ_CALL_SCORE  : "4106",
// C2S_DDZ_OUT_CARD  : "4107",
// C2S_DDZ_CALL_HOST   : "4108",
// C2S_DDZ_QIANG_HOST   : "4109",
// S2C_DDZ_CALL_HOST   : "4110",
// S2C_DDZ_QIANG_HOST   : "4111",
// S2C_DDZ_SHOW_BANKER  : "4112",
// S2C_DDZ_TABLE_USER_INFO   : "4113",
// S2C_DDZ_RESULT   : "4114",
// S2C_DDZ_GAME_START   : "4115",
// S2C_DDZ_CALL_SCORE   : "4116",
// S2C_DDZ_OUT_CARD   : "4117",
// S2C_DDZ_OUT_CARD   : "4118",

let LlCalculate = require('LlCalculate');

module.exports = cc.Class({
    properties: {
        name: 'LandlordLogic',
        view: null,

        roomInfo: null,
        usermap: null,

        myIndex: 0,

        mycards: [],
        turncards: [],// 当前回合出出来的牌
        turnIndex: 0, // 当前回合最新一次出牌的玩家
        searchResult: [],
        result:null,
    },

    // use this for initialization
    ctor: function () {
        this.usermap = new Map();

        this.calc = new LlCalculate();

        let self = this;
        let net = cc.mgr.net;

        net.on(NetId.S2C_READY, (event)=> {
            if(cc.mgr.hallLogic.gameLogic != self)
                return
            let msg = event.detail.msg;
            let info = this.usermap.get(msg.index);
            if (typeof (info) != 'undefined') {
                info.score = msg.score;
                info.ready = 1;
            }
            if (this.view) {
                this.view.onReady(msg);
                cc.mgr.audioMgr.playSFX('comm/sound_eff_in.mp3')
            }
        }, this)

        // net.on(NetId.S2C_DDZ_REDOUBLE,(event)=>{
        //     cc.log(">>>>>>>>>>>>");
        //     cc.log(event.detail.msg);
        // },this)

        net.on(NetId.S2C_DDZ_TABLE_USER_INFO, (event)=> {
            let msg = event.detail.msg;
            cc.log('新玩家加入' + msg.name)
            this.onNewPlayerJoinRoom(msg);
        }, this)

        net.on(NetId.S2C_DDZ_GAME_START, function (event) {
            let msg = event.detail.msg;
            this.roomInfo.status = msg.status;
            this.roomInfo.host_id = msg.host_id;
            this.cur_user = msg.cur_user;
            this.roomInfo.call_score = msg.call_score
            this.roomInfo.cur_ju = msg.cur_ju;
            this.roomInfo.total_ju = msg.total_ju;

            this.mycards = this.calc.sortCard(msg.cards); // 我的牌

            this.turncards = [];
            this.turnIndex = 0;

            this.finalJiesuan_ = null

            if (this.view) {
                this.view.onStarted(msg);
            }
        }, this)


        /** 叫分返回
         * {
         *  index,当前谁叫的
         *  score,当前叫的分
         *  cur_score,当前叫的最大分
        *  next_index,下一个该谁叫分
         * }
         */
        net.on(NetId.S2C_DDZ_CALL_SCORE, function (event) {
            let msg = event.detail.msg;
            
            if (this.view) {
                this.view.onUserCallScore(msg);
            }
            this.roomInfo.cur_score = msg.cur_score;
        }, this)
        //加倍
        net.on(NetId.S2C_DDZ_REDOUBLE, function (event) {
            let msg = event.detail.msg;
            if (this.view) {
                this.view.onUserCallDouble(msg);
            }
           
        }, this)
        // 出牌
        net.on(NetId.S2C_DDZ_OUT_CARD, function (event) {
            let msg = event.detail.msg;
            cc.log(JSON.stringify(msg));
            if (!msg.out_card_data) {
                msg.out_card_data = [];
            }

            if (msg.out_card_data.length > 0) {
                // msg.out_card_data = this.calc.sortOutCardList(msg.out_card_data);
                this.turncards = msg.out_card_data;
                this.turnIndex = msg.index;
            }

            this.roomInfo.cur_user = msg.cur_user;
            this.roomInfo.cur_score = msg.cur_score;

            if (msg.index == this.myIndex) {
                this.calc.removeCards(this.mycards, msg.out_card_data);
            }

            if (this.view) {
                this.view.onUserChupai(msg);
            }
        }, this)

        /**广播地主
         * {
         *      host_id,
                bank_card,
                index
         * }
         */
        net.on(NetId.S2C_DDZ_SHOW_BANKER, function (event) {
            cc.log(">>>>>");
            let msg = event.detail.msg;
            cc.log(msg);
            this.roomInfo.host_id = msg.host_id;
            this.roomInfo.cur_user = msg.host_id;
            if (this.view) {
                this.view.onShowBanker(msg);
            }
        }, this)

        // 结束
        net.on(NetId.S2C_DDZ_RESULT, function (event) {
            let msg = event.detail.msg;

            cc.mgr.ll.usermap.forEach((user, key) => {
                user.ready = 0;
            })

            if (this.view) {
                this.view.onRoundOver(event.detail.msg);
            }

            if (msg.results) {
                this.finalJiesuan_ = msg.results;
                if (this.view) {
                    if (!this.view.roundOver.node.active) {
                        this.onGameResult()
                    }
                }
            }
            this.mycards = [];
        }, this)


        // net.on(NetId.S2C_AUTO_OPERATE, function (event) {
        //     if (this.view) {
        //         this.view.onUserAutoOpt(event.detail.msg);
        //     }
        // }, this)

        net.on(NetId.S2C_SHUFFLE, (event) => {
            let msg = event.detail.msg;
            if (this.view) {
                this.view.onShuffle(msg);
            }
        })

        net.on(NetId.S2C_DDZ_CALL_HOST, (event) => {
            let msg = event.detail.msg;
            if (this.view) {
                this.view.onUserCallHost(msg);
            }
        })

        net.on(NetId.S2C_DDZ_QIANG_HOST, (event) => {
            let msg = event.detail.msg;
            if (this.view) {
                this.view.onUserQiangHost(msg);
            }
        })

        net.on(NetId.S2C_DDZ_TIMER, (event) => {
            if (this.view) {
                this.view.S2C_DDZ_TIMER(event.detail.msg);
            }
        })
    },


    getUserInfo: function (index) {
        return this.usermap.get(index);
    },

    /* msg参考
    {
        "beishu": 0,
        "index": 1,
        "code": "ok",
        "msg": "重新加入成功",
        "cmd": "4105",
        "difen": 1,
        "total_ju": 8,
        "status": 0,
        "host_type": 1,
        "player_info": {
            "lon": 0,
            "index": 1,
            "head": "",
            "lat": 0,
            "ip": "10.0.0.29",
            "uid": 51208,
            "name": "ssssss ",
            "sex": 1,
            "left_num": 0,
            "score": 0,
            "hand": {},
            "ready": false
        },
        "left_show": 0,
        "cur_ju": 1,
        "max_zhai": 0,
        "qiang_cishu": 0,
        "count": 1,
        "call_score": 0,
        "people_num": 3,
        "last_out_card": {},
        "other": {},
        "host_id": 0
        }
     */
    onEnterRoom: function (msg, isRejoin) {
        this.roomInfo = msg;
        this.roomInfo.params = JSON.parse(msg.params);
        
        cc.log('onEnterRoom->', JSON.stringify(msg));

        let othersInfo = msg.other;
        this.usermap.clear();
        this.usermap.set(msg.player_info.index, msg.player_info);

        this.myIndex = msg.player_info.index;
        this.distance_warnning = msg.distance_warnning;

        if (msg.player_info.hand && msg.player_info.hand.length > 0) {
            console.log('hand->',JSON.stringify(msg.player_info.hand))
            this.mycards = this.calc.sortCard(msg.player_info.hand);
            console.log('mycards->',JSON.stringify(this.mycards))
        }

        if (msg.last_out_card && msg.last_out_card.length > 0) {
            this.turncards = this.calc.sortOutCard(msg.last_out_card);
        }
        else {
            this.turncards = [];
        }

        if (msg.last_id) {
            this.turnIndex = msg.last_id;
        }
        else {
            this.turnIndex = 0;
        }
        
        for (let i = 0; i < othersInfo.length; i++) {
            this.usermap.set(othersInfo[i].index, othersInfo[i]);
        }
        this.checkClubRoom()

        if (isRejoin) {
            cc.director.loadScene('landlord', () => {
                if (this.view) {
                    this.view.onRejoinRoom(msg);
                }
            });
        }
        else {
            cc.director.loadScene('landlord', () => {
                if (this.view) {
                    this.view.onJoinRoom();
                }
            });
        }
    },

    onChat: function (msg) {
        if (this.view) {
            this.view.onChat(msg);
        }
    },

    onNewPlayerJoinRoom: function (userinfo) {
        this.usermap.set(userinfo.index, userinfo);
        if (this.view) {
            this.view.onNewPlayer(userinfo);
        }
    },

    c2sReady: function () {
        cc.mgr.net.send(NetId.C2S_READY, { niu: 0 });
    },

    onLeaveRoom: function (msg) {
        cc.log('onLeaveRoom..')
        this.deleteUser(msg.index);
        if (this.view) {
            this.view.onLeaveRoom(msg);
        }
        else {
            cc.log('MahjongLogic.629');
        }
    },

    c2sDismiss: function () {
        cc.mgr.net.send(NetId.C2S_APPLY_JIESAN);
    },


    // val:1挂机，0取消
    c2sAuto: function (val) {
        cc.mgr.net.send(NetId.C2S_AUTO_OPERATE, { status: val });
    },

    c2sCallScore: function (val) {
        cc.mgr.net.send(NetId.C2S_DDZ_CALL_SCORE, { score: val });
    },

    c2sShotCards: function (cards) {
        cc.mgr.net.send(NetId.C2S_DDZ_OUT_CARD, { card_data: cards });
    },

    getParams: function() {
        if(this.roomInfo.params && this.roomInfo.params != '')  
            return this.roomInfo.params
    },
    //--------------------------------------------------------------------

    showPlayerDetail: function (index, avatar) {
        let user = this.usermap.get(index);
        if (!user) {
            return;
        }

        cc.showPlayerDetail(user.name, user.uid, user.ip, avatar);
    },


    iamHost: function () {
        return this.myIndex == this.roomInfo.host_id;
    },

    isHost: function (index) {
        return index == this.roomInfo.host_id;
    },

    isRoomOwner: function () {
        return this.myIndex == 1;
    },

    deleteUser: function (index) {
        this.usermap.delete(index);
    },

    clear: function () {
        this.roomInfo = null;

        this.myIndex = 0;
        this.usermap.clear();
        this.mycards = [];
        this.turncards = [];
        this.result = null;
    },

    /**
     *  重新加入还没结束的房间
     */
    rejoinRoom: function (msg) {
        this.result = msg.result_packet;
        this.onEnterRoom(msg, true);
    },

    onJiesan: function (msg) {
        this.clear();
    },

    //结算
    onGameResult: function (msg) {
        //cc.log("onGameResult:" + this.finalJiesuan_ + " view:" + this.view);

        // if (this.finalJiesuan_ && this.view) {
        //     cc.delayedCall(this.view.node, 2, () => {
        //         let bill = cc.find('Canvas/UI/bill').getComponent('LlBill');
        //         bill.onJiesuan(this.finalJiesuan_);
        //         this.finalJiesuan_ = null;
        //     })
        // }
    },

    isFinalRound: function () {
        return this.roomInfo.total_ju == this.roomInfo.cur_ju;
    },

    isFangzhu: function (index) {
        return index == 1;
    },

    search: function (cards) {
        let temp_cards = cards;
        if(cards == undefined)temp_cards = this.mycards;
        console.log('befor mycards',JSON.stringify(temp_cards))
        this.searchResult = this.calc.getCanOut(temp_cards, this.turncards.slice(0), true);
        console.log('after mycards',JSON.stringify(temp_cards))
        console.log('result->', JSON.stringify(this.searchResult));
        return this.searchResult;
    },

    myInfo: function () {
        return this.getUserInfo(this.myIndex);
    },

    addDipai:function (dipai) {
        this.mycards = this.calc.sortCard(this.mycards.concat(dipai));
    },

    leaveRoom:function () {
        if (this.isRoomOwner()) {
            cc.mgr.net.send(NetId.C2S_JIESAN);
        }
        else {
            cc.mgr.net.send(NetId.C2S_LEAVE_ROOM);
        }
    },

    dismiss: function () {
        cc.mgr.net.send(NetId.C2S_APPLY_JIESAN);
    },

    shuffle: function () {
        cc.mgr.net.send(NetId.C2S_SHUFFLE);
    },

    // 是不是金币场
    isGoldRoom: function () {
        return this.roomInfo.room_type != null && this.roomInfo.room_type != 0;
    },

    checkClubRoom: function(){
        if(!this.roomInfo.params)
            return
        let id = this.roomInfo.params.club_id
        if(id && id > 0)
            cc.sys.localStorage.setItem('need_rejoin_club',id)
    },

});
