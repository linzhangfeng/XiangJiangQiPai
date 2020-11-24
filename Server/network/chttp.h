#ifndef CHTTP_H
#define CHTTP_H

#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/beast/version.hpp>
#include <boost/asio/strand.hpp>
#include <boost/beast/ssl.hpp>
#include <cstdlib>
#include <functional>
#include <iostream>
#include <memory>
#include <string>

class CHttp : public std::enable_shared_from_this<CHttp>
{
public:
	CHttp();

	void Get(const std::string& host, const std::string& hort, const std::string &target, std::function<void(std::string)> cb, bool ssl);
	void Post(const std::string& host, const std::string& hort, const std::string &target, const std::string &post_data, std::function<void(std::string)> cb, bool ssl = false);
protected:
	void OnResolve(boost::system::error_code er, boost::asio::ip::tcp::resolver::results_type results);
	void OnConnect(boost::system::error_code er, boost::asio::ip::tcp::resolver::results_type::endpoint_type);
	void HandShake(boost::system::error_code er);
	void OnWrite(boost::system::error_code er, std::size_t bytes_transferred);
	void OnRead(boost::system::error_code er, std::size_t bytes_transferred);
private:
	boost::asio::ip::tcp::resolver m_resolver;
	boost::beast::tcp_stream m_stream;
	boost::beast::ssl_stream<boost::beast::tcp_stream> m_ssl_stream;
	boost::beast::flat_buffer m_buffer; // (Must persist between reads)
	boost::beast::http::request<boost::beast::http::string_body> m_req;
	//boost::beast::http::request<boost::beast::http::string_body> m_req_post;
	boost::beast::http::response<boost::beast::http::string_body> m_res;

	bool m_is_ssl{ false };
	std::function<void(std::string)> m_callback;
};


#endif