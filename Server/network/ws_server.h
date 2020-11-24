#ifndef WS_SERVER_H
#define WS_SERVER_H

#include <boost/beast.hpp>
#include <boost/asio.hpp>


class CWsServer
{
public:
	CWsServer( boost::asio::io_context &_ioc , std::string _ip ,int _listen_port );

	
	void StartAccept();

private:
	

	void DoAccept(boost::system::error_code code);


	boost::asio::io_context &m_ioc;
	boost::asio::ip::tcp::socket m_socket;
	boost::asio::ip::tcp::acceptor m_accept;

	int m_listen_port;


};






#endif