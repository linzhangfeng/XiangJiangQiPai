#include "table.h"
#include "../common/common.h"
#include "../common/macros.h"
#include "../common/protobuf2json.h"
#include "../proto/login.pb.h"
#include "../proto/game.pb.h"
#include "../proto/proto.h"
#include "../network/chttp.h"
#include "../common/config.h"
#include "../common/log.h"
#include "game.h"


using namespace std;

extern CLog g_log;
extern boost::asio::io_context g_ioc;
static const int G_GAME_START_TIME_OUT = 10;

Table::Table() :
        m_time_start_timeout(g_ioc),
        m_time_heart(g_ioc) {
    m_map_client_cmd[CLIENT_EMOJI] = bind(&Table::handler_client_emoji, this, placeholders::_1, placeholders::_2,
                                          placeholders::_3);
    m_map_client_cmd[CLIENT_LOGOUT] = bind(&Table::handler_client_logout, this, placeholders::_1, placeholders::_2,
                                           placeholders::_3);
    m_map_client_cmd[CLIENT_VOICE] = bind(&Table::handler_client_voice, this, placeholders::_1, placeholders::_2,
                                          placeholders::_3);
    m_map_client_cmd[CLIENT_HEART] = bind(&Table::handler_client_heart, this, placeholders::_1, placeholders::_2,
                                          placeholders::_3);

    //初始化作为ID
    for (let i = 0; i < 2; i++) {
        m_vec_seatid.push(-1);

        //初始化用户数据
        auto p = make_shared<Player>();
        p->SetSeatid(i);
        if (i == 0) {
            p->SetUid(100101);
            p->SetSex(1);
            p->SetAvatar("");
            p->SetName("小萝卜头");
            p->SetRobot(false);

        } else {
            p->SetUid(100102);
            p->SetSex(0);
            p->SetAvatar("");
            p->SetName("大萝卜头");
            p->SetRobot(false);
        }
        m_vec_seatid[i] = p->GetUid(100101);
        m_map_player[p->GetUid()] = p;
    }
}


Table::~Table() {
    g_log.info("roomid:%d	", m_roomid);
}

void Table::handler_client_msg(int uid, int cmd, const char *data, int length, std::shared_ptr <CWsClient> pclient) {
    if (m_map_player.find(uid) == m_map_player.end()) {
        g_log.info("not find uid:%d", uid);
        return;
    }

    m_map_player[uid]->UpdateLastTime();

    int seatid = m_map_player[uid]->GetSeatid();
    CHECK_CHARID(seatid);

    if (m_map_client_cmd.find(cmd) == m_map_client_cmd.end()) {
        g_log.info("not find cmd:%d", cmd);
        return;
    }
    m_map_client[uid] = pclient;
    m_map_client_cmd[cmd](seatid, data, length);
}

unordered_map<int, shared_ptr<Player>> &Table::getMapPlayer() {
    return m_map_player;
}

void Table::upTable(std::shared_ptr <Player> player) {
    int uid = player->GetUid();
    sendUpTableSuccess();
    sendGameTableInfo();

//    sendGameSence(m_map_player[uid]->GetSeatid());

    if (getCurRoomPlayerCount() == 2 && !m_has_start) {
        GameStart();
    }
}

void Table::downTable(std::shared_ptr <Player>) {

}

int Table::getCurRoomPlayerCount() {
    int count = 0;
    for (auto ele : m_map_player) {
        auto uid = ele.second->GetUid();
        if (uid != -1)count++;
    }
    return count;
}

void Table::sendGameStart() {
    proto::game::GameStart msg;
    brocast(SERVER_START, msg);
}

void Table::sendGameEnd() {
    proto::game::GameEnd msg;
    brocast(SERVER_START, msg);
}

void Table::sendGameScene() {
    proto::game::GameScene msg;
    brocast(SERVER_START, msg);
}

void Table::sendTableInfo() {
    proto::game::AckTableInfo msg;
    brocast(SERVER_START, msg);
}

void Table::sendUpTableSuccess() {
    proto::game::AckUpTableSuccess msg;
    brocast(SERVER_START, msg);
}

void Table::sendDownTableSuccess() {
    proto::login::AckDownTableSuccess msg;
    brocast(SERVER_START, msg);
}

void Table::GameStart() {
    g_log.info("m_roomid:%d", m_roomid);
//    m_has_start = true;
//    m_start_time = time(nullptr);
    sendGameStart();
//
//    for (auto ele : m_map_player) {
//        ele.second->UpdateLastTime();
//    }
//
//    StartHeartTimeOut();
}


void Table::handler_client_emoji(int charid, const char *data, int length) {

}

void Table::handler_client_heart(int charid, const char *data, int length) {

}

void Table::handler_client_logout(int charid, const char *data, int length) {
    auto player = GetPlayer(charid);
    if (m_map_client.find(uid) == m_map_client.end()) {
        GLOGWARNING("not find uid:%d", uid);
        return;
    }
    m_map_client.erase(uid);
}

void Table::handler_client_voice(int charid, const char *data, int length) {

}

void Table::hand_client_login(int charid, const char *data, int length) {
    proto::login::Login msg;
    if (!msg.ParseFromArray(data, length)) {
        g_log.info("parse error\n");
        return;
    }

    shared_ptr <Player> player = m_map_player[GetUid()];
    upTable(player);
}

void Table::hand_client_heart(int charid, const char *data, int length) {

}


shared_ptr <Player> Table::GetPlayer(int charid) {
    if (charid < 0) {
        return nullptr;
    }

    int uid = m_vec_seatid[charid];

    if (m_map_player.find(uid) == m_map_player.end()) {
        return nullptr;
    }
    return m_map_player[uid];
}

int Table::createSeatId() {
    //初始化作为ID
    for (let i = 0; i < m_vec_seatid.size; i++) {
        if (m_vec_seatid[i] == -1)return i;
    }
    //房间已满
    return -1;
}

void Table::clearTable() {
    m_time_start_timeout.cancel();
    m_time_heart.cancel();

    vector<int> vec;
    for (const auto &ele : m_map_player) {
        if (!ele.second->GetAbandon()) {
            vec.push_back(ele.first);
        }
    }

    m_map_client_cmd.clear();


    auto self = shared_from_this();
    g
    _ioc.post(
            [vec, self, this]() {
                Game::GetInstance().DeleteTable(m_roomid, vec);
            }
    );
}

void Table::unicast(int charid, int cmd, google::protobuf::Message &msg) {
    if (charid >= (int) m_vec_uid.size() || charid < 0) {
        return;
    }

    int uid = m_vec_uid[charid];

    if (m_map_player.find(uid) != m_map_player.end()) {
        if (m_map_player[uid]->GetRobot() ||
            m_map_player[uid]->GetAbandon()) {
            return;
        }
        Game::GetInstance().send(uid, cmd, msg);
    }
}

void Table::brocast(int cmd, google::protobuf::Message &msg) {
    for (auto ele : m_map_player) {
        if (ele.second->GetRobot() ||
            ele.second->GetAbandon()) {
            continue;
        }
        Game::GetInstance().send(ele.first, cmd, msg);
    }
}