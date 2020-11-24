#include "chttp.h"
#include "../common/common.h"
#include "../common/macros.h"
#include "../common/config.h"
#include "../common/log.h"
extern CLog g_log;
using namespace std;

extern boost::asio::io_context g_ioc;
extern boost::asio::ssl::context g_ssl_ctx;

CHttp::CHttp():
	m_resolver(g_ioc),
	m_stream(g_ioc),
	m_ssl_stream(g_ioc , g_ssl_ctx)
	
{

}

void CHttp::Get(const std::string& host, const std::string& port, const std::string &target, std::function<void(std::string)> cb, bool ssl)
{
	m_is_ssl = ssl;
	m_callback = cb;

	m_req.version(11);
	m_req.method(boost::beast::http::verb::get);
	m_req.target(target);
	m_req.set(boost::beast::http::field::host, host);
	//m_req.set(http::field::user_agent, BOOST_BEAST_VERSION_STRING);

	m_resolver.async_resolve(host,port,
		bind(&CHttp::OnResolve,shared_from_this() , placeholders::_1 , placeholders::_2));

}

void CHttp::Post(const std::string& host, const std::string& port, const std::string &target, const std::string &post_data, std::function<void(std::string)> cb, bool ssl)
{
	m_is_ssl = ssl;
	m_callback = cb;

	m_req.version(11);
	m_req.method(boost::beast::http::verb::post);
	m_req.target(target);
	m_req.set(boost::beast::http::field::host, host);
	m_req.set(boost::beast::http::field::content_type, "application/x-www-form-urlencoded");
	m_req.body() = post_data;
	m_req.prepare_payload();
	//m_req.set(http::field::user_agent, BOOST_BEAST_VERSION_STRING);

    g_log.info("post data target:%s	post:%s",target.data() , post_data.data());

	m_resolver.async_resolve(host, port,
		bind(&CHttp::OnResolve, shared_from_this(), placeholders::_1, placeholders::_2));
}


void CHttp::OnResolve(boost::system::error_code er,boost::asio::ip::tcp::resolver::results_type results)
{
	if (er)
	{
        g_log.info("er:%d	",er.message().data());
		return;
	}

	if (m_is_ssl)
	{
		boost::beast::get_lowest_layer(m_ssl_stream).expires_after(std::chrono::seconds(Config::GetInstance().GetHttpTimeout()));
		boost::beast::get_lowest_layer(m_ssl_stream).async_connect(results, bind(&CHttp::OnConnect, shared_from_this(), placeholders::_1, placeholders::_2));
		return;
	}

	// Set a timeout on the operation
	m_stream.expires_after(std::chrono::seconds(Config::GetInstance().GetHttpTimeout()));

	// Make the connection on the IP address we get from a lookup
	m_stream.async_connect(results,bind(&CHttp::OnConnect,shared_from_this() , placeholders::_1 ,placeholders::_2));
}

void CHttp::HandShake(boost::system::error_code er)
{
	if (er)
	{
        g_log.info("er:%s	", er.message().data());
		return;
	}

	boost::beast::get_lowest_layer(m_ssl_stream).expires_after(std::chrono::seconds(Config::GetInstance().GetHttpTimeout()));
	boost::beast::http::async_write(m_ssl_stream, m_req,
		bind(&CHttp::OnWrite, shared_from_this(), placeholders::_1, placeholders::_2));
}

void CHttp::OnConnect(boost::system::error_code er, boost::asio::ip::tcp::resolver::results_type::endpoint_type)
{
	if (er)
	{
        g_log.info("er:%s	", er.message().data());
		return;
	}

	if ( m_is_ssl )
	{
		m_ssl_stream.async_handshake(boost::asio::ssl::stream_base::client,
			bind(&CHttp::HandShake, shared_from_this(), placeholders::_1));
		return;
	}


	// Set a timeout on the operation
	m_stream.expires_after(std::chrono::seconds(Config::GetInstance().GetHttpTimeout()));

	// Send the HTTP request to the remote host
	boost::beast::http::async_write(m_stream, m_req,
		bind(&CHttp::OnWrite,shared_from_this() , placeholders::_1 ,placeholders::_2));
}

void CHttp::OnWrite(boost::system::error_code er,std::size_t bytes_transferred)
{
	boost::ignore_unused(bytes_transferred);

	if (er)
	{
        g_log.info("er:%s	", er.message().data());
		return;
	}

	if ( m_is_ssl )
	{
		boost::beast::http::async_read( m_ssl_stream , m_buffer , m_res, 
			bind(&CHttp::OnRead, shared_from_this(), placeholders::_1, placeholders::_2));
		return;
	}

	// Receive the HTTP response
	boost::beast::http::async_read(m_stream, m_buffer, m_res,
		bind(&CHttp::OnRead,shared_from_this() ,placeholders::_1 , placeholders::_2));
}

void CHttp::OnRead(boost::system::error_code er,std::size_t bytes_transferred)
{
	boost::ignore_unused(bytes_transferred);

	if (er)
	{
        g_log.info("er:%s	", er.message().data());
		return;
	}

	// Write the message to standard out
	//std::cout << m_res << std::endl;
	//GLOGINFO("http recv:%s	", m_res.body().data());

	if ( m_callback )
	{
		m_callback(m_res.body());
	}

// 	// Gracefully close the socket
// 	m_stream.socket().shutdown(tcp::socket::shutdown_both, ec);
// 
// 	// not_connected happens sometimes so don't bother reporting it.
// 	if (ec && ec != beast::errc::not_connected)
// 		return fail(ec, "shutdown");

	// If we get here then the connection is closed gracefully
}

