#include "ws_server.h"
#include "ws_client.h"
#include "../common/common.h"
#include "../common/macros.h"
#include <functional>
#include "../common/log.h"

extern CLog g_log;
using namespace std;


CWsServer::CWsServer(boost::asio::io_context &_ioc, std::string _ip, int _listen_port)
        : m_ioc(_ioc),
          m_socket(_ioc),
          m_accept(_ioc, boost::asio::ip::tcp::endpoint(boost::asio::ip::make_address(_ip), _listen_port)),
          m_listen_port(_listen_port) {

}

void CWsServer::StartAccept() {
    g_log.info("tcp_StartAccept\n");
//    m_accept.listen();
    try {
        m_accept.async_accept(m_socket, bind(&CWsServer::DoAccept, this, placeholders::_1));
    } catch (std::exception const &e) {
        g_log.info("StartAccept error exception %s", e.what());
    }
}


void CWsServer::DoAccept(boost::system::error_code er) {
    if (er) {
        g_log.error("accept error :%s", er.message().data());
        return;
    }
    g_log.info("tcp_DoAccept\n");
    auto pws_client = make_shared<CWsClient>(m_ioc, move(m_socket));
    pws_client->Run();

    StartAccept();
}