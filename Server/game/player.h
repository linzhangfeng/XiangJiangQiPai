#ifndef PLAYER_H
#define PLAYER_H

#include "../common/common.h"
#include "../common/macros.h"
#include <google/protobuf/message.h>
#include <string>


class Player {
public:
    Player();

WB_FUNC_INIT(int, m_uid, -1, Uid);
WB_FUNC_INIT(int, m_sex, -1, Sex);
WB_FUNC_INIT(int, m_score, -1, Score);
WB_FUNC(std::string, m_avatar, Avatar);
WB_FUNC(std::string, m_name, Name);
WB_FUNC_INIT(bool, m_voice, false, Voice);
WB_FUNC_INIT(int, m_seatid, -1, Seatid);
WB_FUNC_INIT(bool, m_ready, false, Ready);
WB_FUNC_INIT(bool, m_robot, false, Robot);
WB_FUNC_INIT(bool, m_abandon, false, Abandon);
WB_FUNC_INIT(int, m_disband, 0, Disband);
    void SetEndType(int types) { m_end_type = types; }

    int GetEndType() const {
        if (m_end_type == 6) {
            return 5;
        }
        return m_end_type;
    }

    void UpdateLastTime();

    bool Expired();

private:
    int m_last_time{-1};
    int m_end_type{0};
public:
//	void SendData(int cmd, google::protobuf::Message& msg);

};


#endif