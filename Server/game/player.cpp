#include "player.h"
#include "../proto/msg_head.h"
#include "../common/common.h"
#include "../common/macros.h"
#include "../common/protobuf2json.h"
#include "game.h"
#include "../common/log.h"

using namespace std;
extern CLog g_log;
static const int G_PLAYER_HEART_TIME_OUT = 15;

Player::Player() {

}

//void Player::SendData(int cmd, google::protobuf::Message &msg) {
//    if (m_robot) {
//        return;
//    }
//
//    if (m_uid == -1) {
//        g_log.info("uid:%d	illage", m_uid);
//        return;
//    }
//
//    g_log.info("send uid:%d ", m_uid);
//
//    Game::GetInstance().Send2Client(m_uid, cmd, msg);
//}


void Player::UpdateLastTime() {
    m_last_time = time(nullptr);
}

bool Player::Expired() {
    if (time(nullptr) - m_last_time > G_PLAYER_HEART_TIME_OUT) {
        return true;
    }
    return false;
}