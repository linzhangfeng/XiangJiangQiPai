#ifndef TABLE_H
#define TABLE_H

#include "player.h"
#include "../network/ws_client.h"
#include "../common/macros.h"
#include "../proto/player.pb.h"
#include "user.h"
#include <memory>
#include <functional>
#include <vector>
#include <chrono>
#include <unordered_map>
#include <boost/asio.hpp>
#include <jsoncpp/json/json.h>
#include <unordered_map>
#include <unordered_map>

using namespace std;
#define GROOMLOGINFO(format, ...)\
LOG(INFO) << __FUNCTION__ << " " << "roomid:" << " " << m_roomid << " " << string_format(format, ##__VA_ARGS__) << std::endl;

#define GROOMLOGWARNING(format, ...)\
LOG(WARNING) << __FUNCTION__ << " " << "roomid:" << " " << m_roomid << " " << string_format(format, ##__VA_ARGS__) << std::endl;

#define GROOMLOGERROR(format, ...)\
LOG(ERROR) << __FUNCTION__ << " " << "roomid:" << " " << m_roomid << " " << string_format(format, ##__VA_ARGS__) << std::endl;

#define GROOMLOGFATAL(format, ...)\
LOG(FATAL) << __FUNCTION__ << " " << "roomid:" << " " << m_roomid << " " << string_format(format, ##__VA_ARGS__) << std::endl;


enum GAMEENDTYPE {
    GAME_END_NORMAL = 0,            //正常结束
    GAME_END_LOGOUT = 1,            //退出
    GAME_END_SURREND = 2,            //投降
    GAME_END_OUT_TIME = 3,            //操作超时
    GAME_END_START_TIME_OUT = 4,    //游戏开始超时
    GAME_END_RECONNECT_TIME_OUT = 5,//重连超时
    GAME_END_HEART_TIME_OUT = 6,    //心跳超时
    GAME_END_USER_AHEAD = 7,        //玩家提前结束
    //各自游戏从100开始
};


class Table : public std::enable_shared_from_this<Table> {
public:
    Table();

    virtual ~Table();

private:
    //通用消息处理
    virtual void handler_client_emoji(int charid, const char *data, int length);

    //心跳
    virtual void handler_client_heart(int charid, const char *data, int length);

    //用户退出
    virtual void handler_client_logout(int charid, const char *data, int length);

    //声音
    virtual void handler_client_voice(int charid, const char *data, int length);

    //接收客户端消息
    void handler_client_msg(int uid, int cmd, const char *data, int length);

protected:
    template<typename Derived>
    std::shared_ptr <Derived> shared_from_base() {
        return std::static_pointer_cast<Derived>(shared_from_this());
    }

    void Unicast(int charid, int cmd, google::protobuf::Message &msg);

    void Brocast(int cmd, google::protobuf::Message &msg);


WB_FUNC_INIT(int, m_roomid, -1, Roomid);
    std::unordered_map<int, std::function<void(int, const char *, int)>> m_map_client_cmd;
    unordered_map<int, shared_ptr<Player>> m_map_player;

    virtual void SendGameSence(int charid) = 0;

    virtual void SendGameStart() = 0;

    bool m_has_start{false};
    boost::asio::steady_timer m_time_start_timeout;
    boost::asio::steady_timer m_time_heart;
    int m_game_player_num = 2;
public:
    unordered_map<int, shared_ptr<Player>> &getMapPlayer();

    void upTable(shared_ptr <Player>);

    void downTable(shared_ptr <Player>);

    int getCurRoomPlayerCount();

    virtual void GameStart();
};


#endif