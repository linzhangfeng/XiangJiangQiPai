#include "ws_client.h"
#include "../common/common.h"
#include "../common/macros.h"
#include "../proto/msg_head.h"
#include "../game/game.h"
#include <functional>
#include "../common/log.h"

extern CLog g_log;
using namespace std;


CWsClient::CWsClient(boost::asio::io_context &_ioc, boost::asio::ip::tcp::socket _socket) :
        m_socket(move(_socket)),
        m_need_close(false),
        m_id(get_id()) {
    m_socket.binary(true);
    g_log.info("new client id:%d\n", m_id);
}

CWsClient::~CWsClient() {
    g_log.info("close client id:%d\n", m_id);
}

void CWsClient::Run() {
    auto self = shared_from_this();
    m_socket.async_accept(
            [this, self](boost::system::error_code er) {
                if (er) {
                    g_log.info("async_accept_cb	id:%d	error:%s\n", m_id, er.message().data());

                    NotifyClose();
                    return;
                }
                StartRead();
            }
    );
}

void CWsClient::Close() {
    g_log.info("%s	uid:%d	id:%d	m_list_send size:%d", __FUNCTION__, m_uid, m_id, m_list_send.size());

    if (m_need_close) {
        return;
    }

    m_need_close = true;

    if (m_list_send.empty()) {
        DoClose();
    }
}

void CWsClient::Send(std::string data) {
    if (m_list_send.empty()) {
        m_list_send.push_back(data);
        DoSend();
    } else {
        m_list_send.push_back(data);
    }
}

void CWsClient::Send(int cmd, google::protobuf::Message &msg) {
    MsgHead mhead;
    mhead.cmd = cmd;
    mhead.length = msg.ByteSize();
    string str((char *) &mhead, (char *) &mhead + sizeof(MsgHead));
    str.append(msg.SerializeAsString());

    Send(str);
}

void CWsClient::SetRoomUser(std::unordered_map<int, std::shared_ptr<Player>> userinfo) {
    m_room_user = userinfo;
}

void CWsClient::ClearRoomUser() {
    m_room_user.clear();
}

const std::unordered_map<int, std::shared_ptr<Player>> &CWsClient::GetRoomUser() {
    return m_room_user;
}


void CWsClient::NotifyClose() {
    g_log.info("%s	id:%d", __FUNCTION__, m_id);

    if (m_uid == -1) {
        return;
    }
//	Game::GetInstance().ClientClosed(m_uid);
}

void CWsClient::DoSend() {
    auto self = shared_from_this();

    m_cur_send = m_list_send.front();

    m_socket.async_write(boost::asio::buffer(m_cur_send),
                         [this, self](boost::system::error_code er, size_t length) {
                             if (er) {
                                 g_log.info("async_write_cb	id:%d	error:%s", m_id, er.message().data());

                                 NotifyClose();
                                 return;
                             }

                             //GLOGINFO("async_write_cb	id:%d	send_size:%d list_size:%d", m_id, length , m_list_send.size());


                             m_list_send.pop_front();

                             if (m_list_send.empty()) {
                                 if (m_need_close) {
                                     DoClose();
                                 }
                             } else {
                                 DoSend();
                             }
                         }
    );
}

void CWsClient::DoClose() {
    g_log.info(" id:%d", m_id);

    auto self = shared_from_this();

    m_socket.async_close(boost::beast::websocket::close_reason("------close"),
                         [this, self](boost::system::error_code er) {

                         });
}

void CWsClient::StartRead() {
    auto self = shared_from_this();
    m_socket.async_read(m_buffer, [this, self](boost::system::error_code er, size_t length) {
                            if (er == boost::beast::websocket::error::closed) {
                                g_log.info("async_read_cb	id:%d	error:%s", m_id, er.message().data());

                                NotifyClose();
                                return;
                            }

                            if (er) {
                                g_log.info("async_read_cb	id:%d	error:%s", m_id, er.message().data());

                                NotifyClose();
                                return;
                            }

                            if (m_need_close) {
                                g_log.info("async_read_cb	id:%d need close not recv packet ", m_id);
                                return;
                            }

                            string str_data = buffers_to_string(m_buffer.data());
                            g_log.info("recv:%s\n", str_data.data());
                            g_log.info("recv length:%d\n", length);

                            HandleMsg(str_data);

                            m_buffer.consume(m_buffer.size());

                            StartRead();
                        }
    );
}


void CWsClient::HandleMsg(const std::string str) {
    if (str.size() < sizeof(MsgHead)) {
        g_log.info("HandleMsg size error1\n");
        return;
    }
    MsgHead *phead = (MsgHead *) str.data();
    if (phead->length > 65535) {
        g_log.info("HandleMsg size error2\n");
        Close();
    }
    if (phead->length + sizeof(MsgHead) > str.size()) {
        return;
    }
    g_log.info("HandleMsg cmd:%d,length:%d\n", phead->cmd, phead->length);
	Game::GetInstance().HandleClientMsg( shared_from_this(), phead->cmd, str.data() + sizeof(MsgHead), phead->length);
}


