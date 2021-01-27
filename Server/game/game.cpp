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
        m_time_up_users(g_ioc),
        m_ptable_factory(new TableFactory)
        {
}

Game &Game::GetInstance() {
    static Game game;
    return game;
}

void Game::Init() {

}


void Game::send(int uid, int cmd, google::protobuf::Message &msg) {
    if (m_map_client.find(uid) == m_map_client.end()) {
        g_log.info("uid:%d not find \n", uid);
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


void Game::handler_client_login(std::shared_ptr <CWsClient> pclient, const char *data, int length) {
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
        g_log.error("proto::login::Login illegal data\n");
        pclient->Close();
        return;
    }

    int gameid = msg.gameid();
    if (gameid != Config::GetInstance().GetGameid()) {
        g_log.error("server gameid:%d	recv gameid:%d\n", Config::GetInstance().GetGameid(), gameid);
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


    int roomid = pclient->GetRoomid();
    bool isHost = false;
    if (m_map_table.find(roomid) == m_map_table.end()) {
        g_log.info("create new roomid:%d\n", roomid);
        auto ptable = m_ptable_factory->CreateTable(pclient->GetGameid());
        if (!ptable) {
            g_log.error("ptable is null\n");
            return;
        }
        ptable->SetRoomid(roomid);
        m_map_table[roomid] = ptable;
        isHost = true;
    }

    //创建座位ID
    int seatId = m_map_table[roomid]->createSeatId(pclient->GetUid());
    if (seatId == -1) {
        g_log.error("The room is full\n");
        //发送登录失败消息
        ack.set_code(-1);
        pclient->Send(SERVER_LOGIN_ACK, ack);
        pclient->Close();
        return;
    }

    if (isHost) m_map_table[roomid]->SetHostid(seatId);

    //添加用户数据
    if (m_map_client[pclient->GetUid()])m_map_client[pclient->GetUid()]->Close();
    m_map_client[pclient->GetUid()] = pclient;

    m_map_table[roomid]->setPlayer(seatId, pclient);

    ack.set_code(1);
    pclient->Send(SERVER_LOGIN_ACK, ack);

    m_map_table[roomid]->handler_client_msg(pclient->GetUid(), CLIENT_LOGIN, data, length, pclient);
}

void Game::handler_client_heart(std::shared_ptr <CWsClient> pclient, const char *data, int length) {

}

void Game::HandleClientMsg(std::shared_ptr <CWsClient> pclient, int cmd, const char *data, int length) {
    if (cmd == CLIENT_LOGIN) {
        handler_client_login(pclient, data, length);
        return;
    }
    if (cmd == CLIENT_HEART) {
        handler_client_heart(pclient, data, length);
        return;
    }

    g_log.info("cmd:%d uid:%d\n", cmd, pclient->GetUid());

    int uid = pclient->GetUid();
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

    m_map_table[roomid]->handler_client_msg(uid, cmd, data, length, pclient);
}

std::unordered_map<int, std::shared_ptr<CWsClient>> Game::getMapClient() {
    return m_map_client;
}

void Game::deleteTable(int roomid, std::vector<int> vec) {
    m_map_table.erase(roomid);
    g_log.info("left table_size:%d\n", m_map_table.size());
    for (const auto &ele : m_map_table) {
        g_log.info("roomid:%d\n", ele.first);
    }

//    for (auto ele : vec) {
//        m_map_client.erase(ele);
//    }
    g_log.info("left user_size:%d	\n", m_map_client.size());
}
