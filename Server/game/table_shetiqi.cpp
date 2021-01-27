#include "table_shetiqi.h"
#include "../common/common.h"
#include "../common/macros.h"
#include "../proto/proto.h"
#include "../proto/landlord.pb.h"
#include "../proto/game.pb.h"
#include "../common/protobuf2json.h"
#include <random>
#include <chrono>

using namespace std;
extern boost::asio::io_context g_ioc;

CTableSheTiQi::CTableSheTiQi() :
        m_CardPool(CARD_POOL_ALL, 0),
        m_nex_msg_timer(g_ioc),
        m_time_robot(g_ioc) {
//    Table::Table();
    m_GAME_PLAYER = 3;
    m_maxHandCardLen = 20;
    m_maxBottomCardLen = 3;
    m_map_client_cmd[CLIENT_ROBDISBAND_SELECT] = bind(&CTableSheTiQi::handler_client_roblandlord_select, this,
                                                      placeholders::_1,
                                                      placeholders::_2,
                                                      placeholders::_3);
    for (int i = 0; i < GAME_PLAYER; i++) {
        m_robLandlordValue[i] = -1;
    }
}

CTableSheTiQi::~CTableSheTiQi() {
//    Table::~Table();
}


void CTableSheTiQi::GameStart() {
    Table::GameStart();

    sendGameStart();

    //从牌池发牌
    m_CardPool.InitPool();

    //发牌
    sendHandCard();

    //开始叫地主  从座位ID为0
    sendRoblandlord(0, 0, 0, false);

}


void CTableSheTiQi::sendGameStart() {
    proto::game::GameStart msg;
    brocast(SERVER_GAME_START, msg);
}

void CTableSheTiQi::sendHandCard() {
    //发牌
    for (int i = 0; i < m_GAME_PLAYER; i++) {
        HandCards handcard = m_HandCard[i];
        m_HandCard[i].ChangeableCardsLen = m_maxHandCardLen - m_maxBottomCardLen;
        m_CardPool.GetCard(m_HandCard[i].ChangeableCards, m_HandCard[i].ChangeableCardsLen);

        proto::game::HandCards msg;
        msg.set_changeablecardslen(handcard.ChangeableCardsLen);
        for (int k = 0; k < m_HandCard[i].ChangeableCardsLen; k++) {
            msg.add_changeablecards(m_HandCard[i].ChangeableCards[k]);
        }
        unicast(i, SERVER_GAME_SEND_CARD, msg);
    }
}

void CTableSheTiQi::sendGameScene(int charid) {
    Table::sendGameScene(charid);
}

void CTableSheTiQi::sendRoblandlord(int seatid, int operatorId, int robValue, bool isFinish) {
    proto::landlord::RobLandlord msg;
    msg.set_seatid(m_curSeatId);
    msg.set_operatorid(operatorId);
    msg.set_rod_value(robValue);
    msg.set_isfinish(isFinish);
    msg.add_rod_values(ROB_VALUE_0);
    for (int i = m_curRobValue + 1; i <= ROB_VALUE_3; i++) {
        msg.add_rod_values(i);
    }
    brocast(SERVER_ROBDISBAND_ACK, msg);
}

void CTableSheTiQi::sendRoblandlordResult() {
    proto::landlord::AckRobLandlordResult msg;
    msg.set_seatid(m_landlordId);
    msg.set_rod_value(m_curRobValue);
    brocast(SERVER_ROBDISBAND_RESULT, msg);
}

void CTableSheTiQi::handler_client_roblandlord_select(int charid, const char *data, int length) {
    proto::landlord::RobLandlord msg;
    if (!msg.ParseFromArray(data, length)) {
        g_log.info("parse error\n");
        return;
    }
    g_log.info("handler_client_roblandlord_select: %s\n", Protobuf2Json(msg).data());

    int next_opertorId = getNextSeadId();
    int rob_value = msg.rod_value();
    int seatid = msg.seatid();
    m_curRobValue = rob_value;
    m_curSeatId = getNextSeadId();
    m_robLandlordValue[seatid] = rob_value;
    bool isFinish = isRobLandlordFinish(rob_value);
    sendRoblandlord(seatid, m_curSeatId, m_curRobValue, isFinish);
    if (isFinish) {
        m_landlordId = seatid;
        sendRoblandlordResult();
    }
}

bool CTableSheTiQi::isRobLandlordFinish(int rob_value) {
    if (rob_value == ROB_VALUE_3) {
        return true;
    }
    for (int i = 0; i < GAME_PLAYER; i++) {
        if (m_robLandlordValue[i] == -1)return false;
    }
    return true;
}
