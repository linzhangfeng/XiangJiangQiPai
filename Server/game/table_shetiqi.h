#ifndef TABLE_SHETIQI_H
#define TABLE_SHETIQI_H

#include "table.h"
#include "boost/asio.hpp"
#include <unordered_map>

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
};

#endif