#include "table.h"
#include "../common/common.h"
#include "../common/macros.h"
#include "../common/protobuf2json.h"
#include "../proto/login.pb.h"
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
}

Table::~Table() {
    g_log.info("roomid:%d	", m_roomid);
}

void Table::handler_client_msg(int uid, int cmd, const char *data, int length) {
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
    m_map_client_cmd[cmd](seatid, data, length);
}

unordered_map<int, shared_ptr<Player>> &Table::getMapPlayer() {
    return m_map_player;
}

void Table::upTable(std::shared_ptr <Player> player) {
    int uid = player->GetUid();

    SendGameSence(m_map_player[uid]->GetSeatid());

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

void Table::GameStart() {
    g_log.info("m_roomid:%d", m_roomid);
//    m_has_start = true;
//    m_start_time = time(nullptr);
//    SendGameStart();
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

}

void Table::handler_client_voice(int charid, const char *data, int length) {

}


void Table::Unicast(int charid, int cmd, google::protobuf::Message &msg) {
//    if (charid >= (int) m_vec_uid.size() || charid < 0) {
//        return;
//    }
//
//    int uid = m_vec_uid[charid];
//
//    if (m_map_player.find(uid) != m_map_player.end()) {
//        if (m_map_player[uid]->GetRobot() ||
//            m_map_player[uid]->GetAbandon()) {
//            return;
//        }
//        Game::GetInstance().Send2Client(uid, cmd, msg);
//    }
}

void Table::Brocast(int cmd, google::protobuf::Message &msg) {
    /* for (auto ele : m_map_player) {
         if (ele.second->GetRobot() ||
             ele.second->GetAbandon()) {
             continue;
         }
         Game::GetInstance().Send2Client(ele.first, cmd, msg);
     }*/
}