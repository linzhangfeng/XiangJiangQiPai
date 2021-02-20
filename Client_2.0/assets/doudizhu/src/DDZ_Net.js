module.exports = cc.Class({
    properties: {},
    sendRobLandlord(seadid, value) {
        let packet = ProtoTool.createPacket("proto.landlord.RobLandlord");
        packet.seatid = seadid;
        packet.operatorid = seadid;
        packet.rod_value = value;
        GTcp.sendData(LANDLORD_CMD.CLIENT_ROBDISBAND_SELECT, packet);
    }
});