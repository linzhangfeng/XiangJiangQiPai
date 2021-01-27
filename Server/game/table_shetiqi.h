#ifndef TABLE_SHETIQI_H
#define TABLE_SHETIQI_H

#include "table.h"
#include "boost/asio.hpp"
#include <unordered_map>
#include "../liblandlord/landlord_def.h"
#include "../liblandlord/landlord_cardpool.h"
#include "../liblandlord/landlord_cardtype.h"

enum LANDLORD_CMD {
    SERVER_ROBDISBAND_ACK = 20000,          //广播开始抢地主
    SERVER_ROBDISBAND_RESULT = 20001,       //广播开始抢地主

    CLIENT_ROBDISBAND_SELECT = 2000,        //玩家抢地主选择结果
};

enum ROB_LANDLORD_VALUE {
    ROB_VALUE_0 = 0,
    ROB_VALUE_1 = 1,
    ROB_VALUE_2 = 2,
    ROB_VALUE_3 = 3,
};

class CTableSheTiQi : public Table {
public:
    CTableSheTiQi();

    ~CTableSheTiQi();

private:
    boost::asio::steady_timer m_nex_msg_timer;
    boost::asio::steady_timer m_time_robot;
protected:

    virtual void GameStart() override;

    virtual void sendGameStart() override;

    virtual void sendGameScene(int charid) override;

    void sendHandCard();

    void sendRoblandlord(int seatid, int operatorId, int robValue, bool isFinish);

    void sendRoblandlordResult();

public:
    void handler_client_roblandlord_select(int charid, const char *data, int length);


public:
    _uint8 m_bottomCards[BOTTOM_CARD_MAX];                  //斗地主三张底牌
    HandCards m_HandCard[GAME_PLAYER];                      //玩家手牌
    LandlordCardPool m_CardPool;                                    //牌库
    int m_maxHandCardLen;                                   //最大手牌个数，默认14张，可修改17张、19张等。
    int m_maxBottomCardLen;                                 //最大手牌个数
    int m_curRobValue;                                      //当前座位id
    int m_robLandlordValue[GAME_PLAYER];                    //抢地主状态
    int m_landlordId;                                       //地主ID
public:
    void getRobValue();

    bool isRobLandlordFinish(int rob_value);

};

#endif