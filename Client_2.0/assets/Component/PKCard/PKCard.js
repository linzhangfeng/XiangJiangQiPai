/*jshint esversion:6*/
let PK_TEX = require("HandCardTexture");
let g_pCardArray = [];
const focusColor = new cc.Color(150, 150, 150);

//扑克操作数据
let g_cbMaskValue = 0x0F;                  //牌值掩码
let g_cbMaskColor = 0xF0;                  //花色掩码
let g_cbCardBack = 0x43;                   //空牌值

//弹起高度
let g_SELECT_H = 25;
let g_OUTCARD_HEIGHT = 206;

let CARDSTATE = {
    NONE: 0,  //闲置
    SELECT_UPSPRING: 1,  //选中弹起
    SELECT_DOWN: 2,  //选中落下
    SELECT_DISABLE: 3,  //禁止选择
};


cc.Class({
    extends: cc.Component,

    properties: {
        isCanTouch: true,
        isSelect: false,
    },


    // use this for initialization
    onLoad: function () {
        this.initData();
        // this.initListener();

        this.nodeCard = cc.find("Card", this.node);
        this.nodeCard.active = false;

        this.nodeCardBack = cc.find("CardBack", this.node);
        this.nodeCardBack.active = true;

        this.nodeStoreColor = cc.find("StoreColor", this.node);
        this.nodeStoreColor.active = false;

        this.nodeBanker = cc.find("FlagNode/Banker", this.node);
        this.nodeBanker.active = false;

        this.nodeLaiZi = cc.find("FlagNode/LaiZi", this.node);
        this.nodeLaiZi.active = false;
    },
    initListener: function () {
        //touch事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan.bind(this), this);
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved.bind(this), this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded.bind(this), this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel.bind(this), this);
    },


    initData: function () {
        this.cardData = 0;              //扑克数据
        this.cardValue = 0;             //牌值
        this.cardColor = 0;             //牌色
        this.isUp = false;
    },

    setSelect: function (select) {
        if (this.isSelect != select) {
            this.isSelect = select;
            this.nodeStoreColor.active = select;
        }
    },

    getSelect() {
        return this.isSelect;
    },
    setBankerVis: function (v) {
        if (this.nodeBanker) this.nodeBanker.active = false;
    },

    setLaiZiVis: function (v) {
        if (this.nodeLaiZi) this.nodeLaiZi.active = v;
    },

    setStoreColorVis: function (v) {
        if (this.nodeStoreColor) this.nodeStoreColor.active = v;
    },

    setCardVis: function (v) {
        if (this.nodeCard) this.nodeCard.active = v;
    },
    setCardBackVis: function (v) {
        if (this.nodeCardBack) this.nodeCardBack.active = v;
    },
    //获取牌值
    getCardValue: function (cbCardData) {
        let cbValue = cbCardData & g_cbMaskValue;
        return cbValue;
    },
    //获取花色
    getCardColor: function (cbCardData) {
        let cbColor = cbCardData & g_cbMaskColor;
        return cbColor;
    },

    setCardData: function (multiple, index, cbCardData) {
        if (cbCardData == 0 || cbCardData == 255) return;
        //牌值与花色
        let cbColor = this.getCardColor(cbCardData) >> 4;
        let cbValue = ((cbCardData == 0x4E) || (cbCardData == 0x4F)) ? this.getCardValue(cbCardData) % 14 : this.getCardValue(cbCardData) - 1;
        let pSprite = this.nodeCard.getComponent(cc.Sprite);
        pSprite.spriteFrame = PK_TEX.GetPkFrame(cbCardData);
        this.cardData = cbCardData;
        this.cardValue = cbValue;
        this.cardColor = cbColor;
        this.node.setScale(multiple, multiple);

        this.setCardBackVis(false);
        this.setCardVis(true);
    },
    //获取数据
    getCardData: function () {
        return this.cardData;
    },

    //重置默认数据
    reset: function () {
        this.cardData = 0;              //扑克数据
        this.cardValue = 0;             //牌值
        this.cardColor = 0;             //牌色
        this.isUp = false;

        this.setBankerVis(false);
        this.setStoreColorVis(false);
        this.setLaiZiVis(false);
    },

    //点击事件
    OnCardClickBegin: null,
    OnCardClickEnded: null,
    OnCardClickMoved: null,
    //按钮事件
    onCardButtonEvent: function () {
        // if (this.OnCardClickEnded && this.OnCardClickEnded(this))
        //     return;
        if (!this.isCanTouch) return;
        if (this.getUp()) {
            this.setUp(false);
        } else {
            this.setUp(true);
        }
        if (this.OnCardClickEnded) {
            this.OnCardClickEnded(this.node, false, true);
        }
    },

    //弹起响应
    setUp: function (v) {
        if (v && !this.isUp) {
            this.isUp = true;
            this.node.y = this.node.y + g_SELECT_H;

        } else if (!v && this.isUp) {
            this.isUp = false;
            this.node.y = 0;
        }
    },

    getUp() {
        return this.isUp;
    },

    //touch事件
    onTouchBegan: function (event) {
        if (!this.isCanTouch) return false;
        this.bMoved = false;
        let touches = event.getTouches();
        let touch = touches[0];
        this.touchBenginPos = touch.getLocation();
        //若有处理，忽略后面处理
        if ((this.OnCardClickBegin && !this.OnCardClickBegin(this))) {
            this.bMoved = false;

        }
        console.log("lin=onTouchBegan:" + this.getCardData());
        //处理结果
        this.onCardButtonEvent(event);
        return true;
    },

    onTouchMoved: function (event) {
        if (!this.isCanTouch) return false;
        let self = this;
        let touches = event.getTouches();
        let touch = touches[0];
        let touchLocMove = touch.getLocation();
        //未移动不算move
        if (!self.bMoved) {
            if (Math.abs(touchLocMove.y - this.touchBenginPos.y) > 50 || Math.abs(touchLocMove.x - this.touchBenginPos.x) > 50) {
                self.bMoved = true;

                self.setUp(false);
            }
        }

        if (self.bMoved && !self.getUp()) {
            let moveToPos = self.node.parent.convertToNodeSpaceAR(touchLocMove);
            self.bMoved = true;
            self.node.x = moveToPos.x;
            self.node.y = moveToPos.y;

            if (this.OnCardClickMoved) this.OnCardClickMoved(self.node);
        }
    },

    onTouchEnded: function (event) {
        if (!this.isCanTouch) return false;
        let self = this;
        if (self.OnCardClickEnded) self.OnCardClickEnded(self.node, true);
        console.log("lin=onTouchEnded:" + this.getCardData());
    },

    onTouchCancel: function (event) {

    },

    setTouchEnble: function (v) {
        this.isCanTouch = v
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
