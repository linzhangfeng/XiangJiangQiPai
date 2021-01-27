#include "table.h"
#include "../common/common.h"
#include "../common/macros.h"
#include "../common/protobuf2json.h"
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
    m_map_client_cmd[CLIENT_READY] = bind(&Table::handler_client_ready, this, placeholders::_1, placeholders::_2,
                                          placeholders::_3);
    m_map_client_cmd[CLIENT_REQ_DISBAND] = bind(&Table::handler_client_req_disband, this, placeholders::_1,
                                                placeholders::_2,
                                                placeholders::_3);
    m_map_client_cmd[CLIENT_DISBAND_SELECT] = bind(&Table::handler_client_disband_select, this, placeholders::_1,
                                                   placeholders::_2,
                                                   placeholders::_3);
    m_map_client_cmd[CLIENT_LOGIN] = bind(&Table::handler_client_login, this, placeholders::_1, placeholders::_2,
                                          placeholders::_3);
}


Table::~Table() {
    g_log.info("roomid:%d\n", m_roomid);
}

void Table::handler_client_msg(int uid, int cmd, const char *data, int length, std::shared_ptr <CWsClient> pclient) {
    if (m_map_player.find(uid) == m_map_player.end()) {
        g_log.info("not find uid:%d\n", uid);
        return;
    }

    m_map_player[uid]->UpdateLastTime();

    int seatid = m_map_player[uid]->GetSeatid();
    CHECK_CHARID(seatid);

    if (m_map_client_cmd.find(cmd) == m_map_client_cmd.end()) {
        g_log.info("not find cmd:%d\n", cmd);
        return;
    }
    m_map_client_cmd[cmd](seatid, data, length);
}

unordered_map<int, shared_ptr<Player>> &Table::getMapPlayer() {
    return m_map_player;
}

void Table::upTable(std::shared_ptr <Player> player) {
    sendUpTable(player);
    sendGameScene(player->GetSeatid());

    if (getCurRoomPlayerCount() == 3 && !m_has_start && isAllReady()) {
        GameStart();
    }
}

void Table::sendGameScene(int charid) {
    proto::game::GameScene msg;
    for (auto ele : m_vec_seatid) {
        proto::login::Player *p = msg.add_player_info();
        if (m_map_player.find(ele) != m_map_player.end()) {
            setProtoPLayerInfo(p, m_map_player[ele]);
        }
    }

    msg.set_host_id(GetHostid());
    msg.set_room_state(GetRoomState());
    msg.set_game_state(GetGameState());
    unicast(charid, SERVER_SCENE_INFO_UC, msg);
}

void Table::sendReady(int seatid, bool isReady) {
    proto::login::Ready msg;
    msg.set_seatid(seatid);
    msg.set_isready(isReady);
    brocast(SERVER_READY_ACK, msg);
}

void Table::sendLogout(int seatid, bool isbrocard) {
    proto::login::LogoutAck msg;
    msg.set_seatid(seatid);

    if (isbrocard) {
        brocast(SERVER_LOGOUT_ACK, msg);
    } else {
        unicast(seatid, SERVER_LOGOUT_ACK, msg);
    }
}

void Table::sendReqDisband(int seatid) {
    proto::game::GameDisband msg;
    msg.set_seatid(seatid);
    msg.set_disband_id(seatid);
    brocast(SERVER_GAME_REQ_DISBAND, msg);
}

void Table::sendDisbandSelect(int seatid, int state) {
    proto::game::GameDisband msg;
    msg.set_seatid(seatid);
    msg.set_state(state);
    msg.set_disband_id(GetDisbandid());
    brocast(SERVER_GAME_DISBAND_SELECT, msg);
}

void Table::sendDisbandResult(int result) {
    proto::game::GameDisbandResult msg;
    msg.set_result(result);
    brocast(SERVER_GAME_DISBAND_RESUILT, msg);
}

void Table::GameEnd() {

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

bool Table::isAllReady() {
    for (auto ele : m_map_player) {
        bool isReady = ele.second->GetReady();
        if (isReady == false)return false;
    }
    return true;
}

void Table::sendGameStart() {
    proto::game::GameStart msg;
    brocast(SERVER_GAME_START, msg);
}

void Table::sendGameEnd(std::vector<int> &vec) {
    proto::game::GameEnd msg;
    brocast(SERVER_GAME_END, msg);
}

void Table::sendUpTable(std::shared_ptr <Player> player) {
    proto::login::UpTable msg;
    proto::login::Player *msg_player = new proto::login::Player();
    setProtoPLayerInfo(msg_player, player);
    msg.set_seatid(player->GetSeatid());
    msg.set_allocated_player(msg_player);
    brocast(SERVER_UPTABLE_ACK, msg);
}

void Table::setProtoPLayerInfo(proto::login::Player *msg_player, std::shared_ptr <Player> player) {
    msg_player->set_uid(player->GetUid());
    msg_player->set_sex(player->GetSex());
    msg_player->set_avatar(player->GetAvatar());
    msg_player->set_name(player->GetName());
    msg_player->set_voice(player->GetVoice());
    msg_player->set_seatid(player->GetSeatid());
    msg_player->set_robot(player->GetRobot());
    msg_player->set_score(player->GetScore());
    msg_player->set_ready(player->GetReady());
    msg_player->set_disband(player->GetDisband());
}

void Table::sendDownTable() {
    proto::login::DownTable msg;
    brocast(SERVER_DOWNTABLE_ACK, msg);
}

void Table::GameStart() {
    g_log.info("m_roomid:%d", m_roomid);
    m_has_start = true;
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

void Table::handler_client_req_disband(int charid, const char *data, int length) {
    proto::game::GameDisband msg;
    if (!msg.ParseFromArray(data, length)) {
        g_log.info("parse error\n");
        return;
    }
    g_log.info("handler_client_req_disband: %s\n", Protobuf2Json(msg).data());
    shared_ptr <Player> player = m_map_player[m_vec_seatid[charid]];
    player->SetDisband(1);

    SetDisbandid(msg.disband_id());
    if (getCurRoomPlayerCount() == 1) {
        exitRoom(charid);
    } else {
        sendReqDisband(msg.disband_id());
    }
}

void Table::handler_client_disband_select(int charid, const char *data, int length) {
    proto::game::GameDisband msg;
    if (!msg.ParseFromArray(data, length)) {
        g_log.info("parse error\n");
        return;
    }
    g_log.info("handler_client_disband_select: %s\n", Protobuf2Json(msg).data());
    shared_ptr <Player> player = m_map_player[m_vec_seatid[charid]];
    player->SetDisband(msg.state());
    sendDisbandSelect(msg.seatid(), msg.state());
    auto result = getDisbandResult();
    g_log.info("getDisbandResult: %d\n", result);
    if (result == 1 || result == 2) {
        sendDisbandResult(result);
        if (result == 1) {
            //让玩家退出房间
            disbandRoom();
        } else if (result == 2) {
            resetDisbandData();
        }
        clearTable();
    } else {
        g_log.info("disband not all select\n");
    }
}

void Table::handler_client_ready(int charid, const char *data, int length) {
    proto::login::Ready msg;
    if (!msg.ParseFromArray(data, length)) {
        g_log.info("parse error\n");
        return;
    }
    g_log.info("handler_client_ready: %s\n", Protobuf2Json(msg).data());
    shared_ptr <Player> player = m_map_player[m_vec_seatid[charid]];
    player->SetReady(msg.isready());
    sendReady(charid, msg.isready());

    //判断是否全部被
    if (getCurRoomPlayerCount() == 3 && !m_has_start && isAllReady()) {
        GameStart();
    }
}

void Table::handler_client_logout(int charid, const char *data, int length) {
    auto player = GetPlayer(charid);
    int uid = m_vec_seatid[charid];
    std::unordered_map<int, std::shared_ptr<CWsClient>> map_client = Game::GetInstance().getMapClient();
    if (map_client.find(uid) == map_client.end()) {
        g_log.info("not find uid:%d\n", uid);
        return;
    }

    if (m_hostid == charid && getCurRoomPlayerCount() != 1) {
        disbandRoom();
        clearTable();
    } else {
        exitRoom(charid);
    }
}

int Table::getSeatid(int uid) {
    for (size_t i = 0; i < m_vec_seatid.size(); i++) {
        if (m_vec_seatid[i] == uid) return i;
    }
    return -1;
}

int Table::getDisbandResult() {
    int result = 1;
    for (auto ele : m_map_player) {
        shared_ptr <Player> player = ele.second;
        auto disbandState = player->GetDisband();
        g_log.info("disbandState:%d  uid:%d\n", disbandState, ele.first);
        if (disbandState == 2 && disbandState != 1) {
            result = 2;
        } else if (disbandState != 1 && disbandState != 2) {
            return 0;
        }
    }
    return result;
}

void Table::resetDisbandData() {
    for (auto ele : m_map_player) {
        ele.second->SetDisband(DISBAND_INIT);
    }
}

void Table::disbandRoom() {
    std::unordered_map<int, std::shared_ptr<CWsClient>> map_client = Game::GetInstance().getMapClient();
    for (auto ele : m_map_player) {
        int uid = ele.first;
        int seatid = getSeatid(uid);
        sendLogout(seatid, false);
        m_vec_seatid[seatid] = -1;
        map_client[uid]->Close();
        map_client.erase(uid);
    }
}

void Table::exitRoom(int seatId) {
    std::unordered_map<int, std::shared_ptr<CWsClient>> map_client = Game::GetInstance().getMapClient();
    sendLogout(seatId, true);
    int uid = m_vec_seatid[seatId];
    m_vec_seatid[seatId] = -1;
    map_client[uid]->Close();
    m_map_player.erase(uid);
    map_client.erase(uid);
}

//从vector中删除指定的某一个元素
void Table::removeVecUid(int uid) {
    for (vector<int>::iterator iter = m_vec_seatid.begin(); iter != m_vec_seatid.end(); iter++) {
        if (*iter == uid) {
            m_vec_seatid.erase(iter);
            break;
        }
    }
}

void Table::handler_client_voice(int charid, const char *data, int length) {

}

void Table::handler_client_login(int charid, const char *data, int length) {
    proto::login::Login msg;
    if (!msg.ParseFromArray(data, length)) {
        g_log.info("parse error\n");
        return;
    }
    g_log.info("login info: %s\n", Protobuf2Json(msg).data());
    //通知客户端登录成功
    shared_ptr <Player> player = m_map_player[m_vec_seatid[charid]];
    upTable(player);
}

void Table::setPlayer(int seatId, std::shared_ptr <CWsClient> pclient) {
    shared_ptr <Player> player = GetPlayer(seatId);
    if (!player) {
        //初始化用户数据
        auto p = make_shared<Player>();
        p->SetSeatid(seatId);
        p->SetUid(pclient->GetUid());
        p->SetSex(1);
        p->SetAvatar("");
        p->SetName("小萝卜头");
        p->SetRobot(false);
        m_map_player[p->GetUid()] = p;
    }

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

int Table::createSeatId(int uid) {
    if (!std::count(m_vec_seatid.begin(), m_vec_seatid.end(), uid)) {
        //初始化作为ID
        for (size_t i = 0; i < m_vec_seatid.size(); i++) {
            if (m_vec_seatid[i] == -1) {
                m_vec_seatid[i] = uid;
                return i;
            }
        }
        if (m_vec_seatid.size() < 3) {
            m_vec_seatid.push_back(uid);
            return (m_vec_seatid.size() - 1);
        }
    } else {
        for (size_t i = 0; i < m_vec_seatid.size(); i++) {
            if (m_vec_seatid[i] == uid) {
                return i;
            }
        }
    }
    //房间已满
    return -1;
}

int Table::getNextSeadId() {
    int seatid = (m_curSeatId + 1) % m_GAME_PLAYER;
    return seatid;
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
    m_map_player.clear();

    Game::GetInstance().deleteTable(m_roomid, vec);
}

void Table::unicast(int charid, int cmd, google::protobuf::Message &msg) {
    if (charid >= (int) m_vec_seatid.size() || charid < 0) {
        return;
    }

    int uid = m_vec_seatid[charid];

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