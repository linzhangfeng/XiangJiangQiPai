#include "table_shetiqi.h"
#include "../common/common.h"
#include "../common/macros.h"
#include "../proto/proto.h"
#include "../common/protobuf2json.h"
#include "../common/log.h"
#include <random>
#include <chrono>

extern CLog g_log;
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
//    Table::GameStart();
    g_log.info("m_roomstate:%d\n", GetRoomState());
    if (GetRoomState() != ROOM_FREE)return;
    sendGameStart();
    SetGameState(GAME_PLAY);
    SetRoomState(ROOM_PLAY);
    m_curRobValue = 0;

    //从牌池发牌
    m_CardPool.InitPool();

    //发牌
    sendHandCard();

    //开始叫地主  从座位ID为0
    m_curSeatId = 0;
    SetRobState(ROB_STATE_PLAYING);
    sendRoblandlord(0, false);

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
    proto::landlord::LandlordScene msg;
    proto::game::GameScene *msg_public_scene = msg.mutable_public_scene();

    setProtoGameScene(msg_public_scene);

    //手牌信息
    for (int i = 0; i < GAME_PLAYER; i++) {
        proto::game::HandCards *msg_handcards = msg.add_hand_cards();
        setProtoHandCards(msg_handcards, m_HandCard[i]);
    }

    //底牌信息
    for (int i = 0; i < BOTTOM_CARD_MAX; i++) {
        msg.add_public_cards(m_bottomCards[i]);
    }

    //抢庄状态
    msg.set_roblandlord_state(GetRobState());

    msg.set_max_rod_score(m_curRobValue);
    //抢庄信息
    proto::landlord::RobLandlordInfo *roblandlord_info = msg.mutable_roblandlord_info();
    setProtoRobLandlord(roblandlord_info);

    //当前的操作用户
    msg.set_operator_id(m_curSeatId);

    unicast(charid, SERVER_SCENE_INFO_UC, msg);

    //Table::sendGameScene(charid);
}

void CTableSheTiQi::sendRoblandlord(int seatid, int robValue) {
    bool isFinish = isRobLandlordFinish(m_curRobValue);

    proto::landlord::RobLandlord msg;
    msg.set_seatid(seatid);
    msg.set_rod_score(robValue);

    proto::landlord::RobLandlordInfo *roblandlord_info = msg.mutable_roblandlord_info();
    setProtoRobLandlord(roblandlord_info);
    brocast(SERVER_ROBDISBAND_ACK, msg);
}

void CTableSheTiQi::sendRoblandlordResult() {
    proto::landlord::AckRobLandlordResult msg;
    msg.set_seatid(m_landlordId);
    msg.set_rod_value(m_curRobValue);

    m_CardPool.GetCard(m_bottomCards, BOTTOM_CARD_MAX);
    for (int i = 0; i < BOTTOM_CARD_MAX; i++) {
        msg.add_public_cards(m_bottomCards[i]);
    }

    brocast(SERVER_ROBDISBAND_RESULT, msg);
}

void CTableSheTiQi::handler_client_roblandlord_select(int charid, const char *data, int length) {
    proto::landlord::RobLandlord msg;
    if (!msg.ParseFromArray(data, length)) {
        g_log.info("parse error\n");
        return;
    }
    g_log.info("handler_client_roblandlord_select: %s\n", Protobuf2Json(msg).data());

    int rob_value = msg.rod_score();
    int seatid = msg.seatid();
    if (rob_value > m_curRobValue)m_curRobValue = rob_value;
    m_curSeatId = getNextSeadId();
    m_robLandlordValue[seatid] = rob_value;
    bool isFinish = isRobLandlordFinish(rob_value);
    sendRoblandlord(seatid, rob_value);
    if (isFinish) {
        m_landlordId = getLandlordId();
        sendRoblandlordResult();
        SetRobState(ROB_STATE_FINISH);
    }
}

int CTableSheTiQi::getLandlordId() {
    int landlordId = 0;
    int max = m_robLandlordValue[landlordId];

    for (int i = 1; i < GAME_PLAYER; i++) {
        if (m_robLandlordValue[i] > max) {
            max = m_robLandlordValue[i];
            landlordId = i;
        }
    }
    if (max == 0)landlordId = GAME_PLAYER - 1;
    return landlordId;
}

void CTableSheTiQi::reset() {
    for (int i = 0; i < GAME_PLAYER; i++) {
        m_robLandlordValue[i] = -1;
    }

    SetRobState(ROB_STATE_INIT);
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


void CTableSheTiQi::setProtoHandCards(proto::game::HandCards *msg, HandCards handcard) {
    msg->set_changeablecardslen(handcard.ChangeableCardsLen);
    for (int i = 0; i < handcard.ChangeableCardsLen; i++) {
        msg->add_changeablecards(handcard.ChangeableCards[i]);
    }
}

void CTableSheTiQi::setProtoRobLandlord(proto::landlord::RobLandlordInfo *msg) {
    bool isFinish = isRobLandlordFinish(m_curRobValue);
    msg->set_operatorid(m_curSeatId);
    msg->set_isfinish(isFinish);

    //地主可以抢的分数
    msg->add_can_rod_scores(ROB_VALUE_0);
    for (int i = m_curRobValue + 1; i <= ROB_VALUE_3; i++) {
        msg->add_can_rod_scores(i);
    }

    //所有玩家抢地主分数
    for (int i = 0; i < GAME_PLAYER; i++) {
        msg->add_rod_scores(m_robLandlordValue[i]);
    }
}