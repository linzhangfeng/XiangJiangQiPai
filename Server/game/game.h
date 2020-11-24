#ifndef GAME_H
#define GAME_H

#include "table_factory.h"

#include <unordered_map>
#include <unordered_map>
#include <memory>

class Game {
public:

    static Game &GetInstance();

    void Init();

    void HandleClientMsg(std::shared_ptr <CWsClient> pclient, int cmd, const char *data, int length);

    //客户端登陆
    void hand_client_login(std::shared_ptr <CWsClient> pclient, const char *data, int length);

    //客户端心跳
    void hand_client_heart(std::shared_ptr <CWsClient> pclient, const char *data, int length);

private:
    Game();

    boost::asio::steady_timer m_time_up_users;
    std::unique_ptr <TableFactory> m_ptable_factory;
    std::unordered_map<int, std::shared_ptr<CWsClient>> m_map_client;        //uid -> client
    std::unordered_map<int, std::shared_ptr<Table>> m_map_table;            //roomid -> table
};


#endif