#include "game.h"
#include "../common/macros.h"
#include "../common/common.h"
#include "../common/protobuf2json.h"
#include "../proto/proto.h"
#include "../proto/login.pb.h"
#include "../proto/msg_head.h"
#include "../network/ws_client.h"
#include "../network/chttp.h"
#include "../common/config.h"

#include <jsoncpp/json/json.h>
#include "../common/log.h"

using namespace std;
extern CLog g_log;
extern boost::asio::io_context g_ioc;


Game::Game() :
        m_ptable_factory(new TableFactory),
        m_time_up_users(g_ioc) {
}

Game &Game::GetInstance() {
    static Game game;
    return game;
}

void Game::Init() {

}


void Game::send(int uid, int cmd, google::protobuf::Message &msg) {
    if (m_map_client.find(uid) == m_map_client.end()) {
        g_log.info("uid:%d not find ", uid);
        return;
    }

    MsgHead mhead;
    mhead.cmd = cmd;
    mhead.length = msg.ByteSize();
    string str((char *) &mhead, (char *) &mhead + sizeof(MsgHead));
    str.append(msg.SerializeAsString());

    if (cmd != SERVER_HEART) {
        g_log.info("uid:%d cmd:%d %s", uid, cmd, Protobuf2Json(msg).data());
    }
    m_map_client[uid]->Send(str);
}


void Game::hand_client_login(std::shared_ptr <CWsClient> pclient, const char *data, int length) {
    proto::login::Login msg;
    if (!msg.ParseFromArray(data, length)) {
        g_log.info("parse error\n");
        return;
    }
    g_log.info("login info: %s", Protobuf2Json(msg).data());
    if (!msg.has_skey() ||
        !msg.has_uid() ||
        !msg.has_gameid() ||
        !msg.has_roomid()) {
        g_log.error("proto::login::Login illegal data");
        pclient->Close();
        return;
    }

    int gameid = msg.gameid();
    if (gameid != Config::GetInstance().GetGameid()) {
        g_log.error("server gameid:%d	recv gameid:%d", Config::GetInstance().GetGameid(), gameid);
        return;
    }
    pclient->SetUid(msg.uid());
    pclient->SetSkey(msg.skey());
    pclient->SetGameid(msg.gameid());
    pclient->SetRoomid(msg.roomid());
    if (msg.has_voice()) pclient->SetVoice(msg.voice());
    if (msg.has_reconnect())pclient->SetReConnect(msg.reconnect());

    //登录成功
    proto::login::LoginAck ack;
    ack.set_code(1);
    pclient->Send(SERVER_LOGIN_ACK, ack);

    int roomid = pclient->GetRoomid();
    if (m_map_table.find(roomid) == m_map_table.end()) {
        g_log.info("create new roomid:%d\n", roomid);
        auto ptable = m_ptable_factory->CreateTable(pclient->GetGameid());
        if (!ptable) {
            g_log.error("ptable is null\n");
            return;
        }
        ptable->SetRoomid(roomid);
        m_map_table[roomid] = ptable;
    }
    m_map_table[roomid]->handler_client_msg(pclient->GetUid(), CLIENT_LOGIN, data, length, pclient);
}

void Game::hand_client_heart(std::shared_ptr <CWsClient> pclient, const char *data, int length) {

}

void Game::HandleClientMsg(std::shared_ptr <CWsClient> pclient, int cmd, const char *data, int length) {
    if (cmd == CLIENT_LOGIN) {
        hand_client_login(pclient, data, length);
        return;
    }
    if (cmd == CLIENT_HEART) {
        hand_client_heart(pclient, data, length);
        return;
    }

    g_log.info("cmd:%d uid:%d\n", cmd, pclient->GetUid());

//    int uid = pclient->GetUid();
//    auto puser = GetUser(uid);
//    if (!puser) {
//        g_log.info("not find uid:%d\n", uid);
//        return;
//    }

    int roomid = pclient->GetRoomid();
    if (m_map_table.find(roomid) == m_map_table.end()) {
        g_log.warn("not find roomid:%d\n", roomid);
        return;
    }

//    m_map_table[roomid]->HandleClientMsg(uid, cmd, data, length);
}