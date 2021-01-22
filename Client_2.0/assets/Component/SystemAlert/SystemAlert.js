/* jshint esversion:6 */
window.BTN_CANCEL = 0;
window.BTN_CLOSE = 1;
cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function () {
        this.initData();

        this.nodeTitle = cc.find("box_bg/txt_title", this.node);
        this.bt_cancel = cc.find("bt_layout/bt_cancel", this.node);
        GUtils.addBtnClick(this.bt_cancel, function () {
            if (this.m_canle_listener) {
                this.m_canle_listener(this);
                if (!this.m_isDestory) return;
            }
            this.node.destroy();
        }.bind(this));

        this.bt_ok = cc.find("bt_layout/bt_ok", this.node);
        GUtils.addBtnClick(this.bt_ok, function () {
            if (this.m_ok_listener) {
                this.m_ok_listener(this);
                if (!this.m_isDestory) return;
            }
            this.node.destroy();
        }.bind(this));

        this.node_msg = cc.find("txt_msg", this.node);
    },

    initData() {
        this.m_canle_listener = null;
        this.m_ok_listener = null;
        this.m_isDestory = false;
    },

    setMessage(msg) {
        GUtils.setLabelText(this.node_msg, msg);
    },

    setBtnTxt(txt_ok, txt_cancel) {
        if (txt_ok) {
            GUtils.setLabelText(cc.find("txt", this.bt_ok), txt_ok);
        }
        if (txt_cancel) {
            GUtils.setLabelText(cc.find("txt", this.bt_cancel), txt_cancel);
        }
    },

    addListener(ok_listener, cancle_listener, isDestory) {
        this.m_isDestory = isDestory;
        if (ok_listener) this.m_ok_listener = ok_listener;
        if (cancle_listener) this.m_canle_listener = cancle_listener;
    },

    setBtnVis(ok_v, cancel_v) {
        this.bt_cancel.active = cancel_v;
        this.bt_ok.active = ok_v;
    },

    init: function (szMessage) {
        this.setMessage(szMessage);
    },
});
