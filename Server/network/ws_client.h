#ifndef WS_CLIENT_H
#define WS_CLIENT_H


#include "../common/macros.h"
#include "../game/player.h"
#include <memory>
#include <boost/asio.hpp>
#include <boost/beast.hpp>
#include <string>
#include <list>
#include <unordered_map>
#include <stdint.h>
#include <google/protobuf/message.h>

class CWsClient:
	public std::enable_shared_from_this<CWsClient>
{
public:
	CWsClient(boost::asio::io_context &_ioc, boost::asio::ip::tcp::socket _socket);

	~CWsClient();

	void Run();

	void Close();

	void Send(std::string data);

	void Send(int cmd, google::protobuf::Message& msg);

	void SetRoomUser(std::unordered_map<int, std::shared_ptr<Player>> userinfo);

	void ClearRoomUser();

	const std::unordered_map<int, std::shared_ptr<Player>>& GetRoomUser();
	
	WB_FUNC_INIT(int, m_uid , -1, Uid);
	WB_FUNC(std::string, m_skey, Skey);
	WB_FUNC_INIT(int, m_roomid, -1, Roomid);
	WB_FUNC_INIT(int, m_gameid, -1, Gameid);
	WB_FUNC_INIT(bool, m_vocie, false ,Voice);
	WB_FUNC_INIT(bool, m_reconnect, false, ReConnect);
	

private:

	void NotifyClose();

	void DoSend();

	void DoClose();
	
	void StartRead();

	void HandleMsg(const std::string str);

	boost::beast::websocket::stream<boost::asio::ip::tcp::socket> m_socket;
	boost::beast::multi_buffer m_buffer;

	bool m_need_close;
	uint32_t m_id;
	std::string m_cur_send;
	std::list<std::string> m_list_send;

	std::unordered_map<int, std::shared_ptr<Player>> m_room_user;
};





#endif