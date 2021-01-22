#include "table_shetiqi.h"
#include "../common/common.h"
#include "../common/macros.h"
#include "../proto/proto.h"
#include <random>
#include <chrono>

using namespace std;
extern boost::asio::io_context g_ioc;

CTableSheTiQi::CTableSheTiQi() :
        m_nex_msg_timer(g_ioc),
        m_time_robot(g_ioc) {

}

CTableSheTiQi::~CTableSheTiQi() {

}


void CTableSheTiQi::GameStart() {
    Table::GameStart();
}

void CTableSheTiQi::sendGameStart() {

}

void CTableSheTiQi::sendGameScene(int charid) {
    Table::sendGameScene(charid);
}

