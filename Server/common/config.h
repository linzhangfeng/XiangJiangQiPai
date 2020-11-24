#ifndef CONFIG_H
#define CONFIG_H
#include "macros.h"
//#include <json/json.h>
#include <string>
#include <jsoncpp/json/json.h>
class Config
{
public:
	static Config& GetInstance();

	void Init(std::string conf_file);

	WB_FUNC(std::string, m_server_ip, ServerIp);

	WB_FUNC_INIT(int, m_server_port, -1, ServerPort);

	WB_FUNC_INIT(int, m_task_thread, 2, TaskThread);

	WB_FUNC(std::string, m_http_domain, HttpDomain);

	WB_FUNC_INIT(int, m_http_port, 80, HttpPort);

	WB_FUNC_INIT(int, m_http_https, 0, HttpHttps);

	WB_FUNC(std::string, m_http_login, HttpLogin);

	WB_FUNC(std::string, m_http_update_score,  HttpUpdateScore);

	WB_FUNC(std::string, m_http_update_user, HttpUpdateUser);

	WB_FUNC_INIT(int, m_http_timeout, 3, HttpTimeout);

	WB_FUNC_INIT(std::string, m_logfile_name, "server" , LogfileName);

	WB_FUNC_INIT(int, m_logfile_size,100, LogfileSize);

	WB_FUNC_INIT(int, m_gameid, -1, Gameid);
private:
	Config() {};

	bool CheckConfigFile(std::string config_file , Json::Value &val);

	bool CheckServerConfig(Json::Value &val);

	bool CheckHttpConfig(Json::Value &val);

	void CheckLogFileConfig(Json::Value &val);

	void CheckTaskThread(Json::Value &val);

	void CheckOtherConfig(Json::Value &val);
};

#endif