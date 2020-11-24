#include "config.h"
#include <fstream>
#include "log.h"

using namespace std;
extern CLog g_log;

Config& Config::GetInstance()
{
	static Config config;
	return config;
}

void Config::Init(std::string conf_file)
{
	Json::Value val;

	if (!CheckConfigFile(conf_file , val))
	{
        g_log.error("config file parse error");
		exit(0);
	}

	if (!CheckServerConfig(val))
	{
		exit(0);
	}

	if (!CheckHttpConfig(val) )
	{
		exit(0);
	}

	CheckLogFileConfig(val);

	CheckTaskThread(val);

	CheckOtherConfig(val);
}


bool Config::CheckConfigFile(string config_file, Json::Value &val)
{
	std::ifstream fins(config_file.c_str(), std::ifstream::binary);
	if (!fins)
	{
        g_log.error("init file no found.");
		return false;
	}

	Json::Reader reader;
	bool ret = reader.parse(fins, val);
	if (!ret)
	{
		fins.close();
        g_log.error("init file parser.");
		return false;
	}

	fins.close();

	return true;
}

bool Config::CheckServerConfig(Json::Value &val)
{
	if (val["server"].isNull())
	{
        g_log.error("no server config");
		return false;
	}

	if (val["server"]["ip"].isNull() || !val["server"]["ip"].isString())
	{
        g_log.error("server ip config error ");
		return false;
	}
	m_server_ip = val["server"]["ip"].asString();

	if (val["server"]["port"].isNull() || !val["server"]["port"].isInt())
	{
        g_log.error("server port config error ");
		return false;
	}
	m_server_port = val["server"]["port"].asInt();

	return true;
}

bool Config::CheckHttpConfig(Json::Value &val)
{
	if (val["http"].isNull())
	{
        g_log.error("no http config");
		return false;
	}

	if (val["http"]["domain"].isNull() || !val["http"]["domain"].isString())
	{
        g_log.error("http domain config error ");
		return false;
	}
	m_http_domain = val["http"]["domain"].asString();


	if (!val["http"]["port"].isNull() &&
		val["http"]["port"].isInt())
	{
		m_http_port = val["http"]["port"].asInt();
	}

	if ( !val["http"]["https"].isNull() && 
		val["http"]["https"].isInt())
	{
		m_http_https = val["http"]["https"].asInt();
	}

	if (!val["http"]["timeout"].isNull() &&
		val["http"]["timeout"].isInt())
	{
		m_http_timeout = val["http"]["timeout"].asInt();
	}

	if (val["http"]["login"].isNull() || !val["http"]["login"].isString())
	{
        g_log.error("http login config error ");
		return false;
	}
	m_http_login = val["http"]["login"].asString();

	if (val["http"]["update_socre"].isNull() || !val["http"]["update_socre"].isString())
	{
        g_log.error("http update_socre config error ");
		return false;
	}
	m_http_update_score = val["http"]["update_socre"].asString();


	if (val["http"]["update_user"].isNull() || !val["http"]["update_user"].isString())
	{
        g_log.error("http update_user config error ");
		return false;
	}
	m_http_update_user = val["http"]["update_user"].asString();

	return true;
}

void Config::CheckLogFileConfig(Json::Value &val)
{
	if (val["logfile"].isNull())
	{
        g_log.error("no logfile config");
	}

	if (!val["logfile"]["name"].isNull() &&
		val["logfile"]["name"].isString())
	{
		m_logfile_name = val["logfile"]["name"].asString();
	}

	if (!val["logfile"]["size"].isNull() &&
		val["logfile"]["size"].isInt())
	{
		m_logfile_size = val["logfile"]["size"].asInt();
	}
}

void Config::CheckTaskThread(Json::Value &val)
{
	if ( !val["task_thread"].isNull() && 
		val["task_thread"].isInt())
	{
		m_task_thread = val["task_thread"].asInt();
	}

	if ( m_task_thread < 2 )
	{
		m_task_thread = 2;
	}
}

void Config::CheckOtherConfig(Json::Value &val)
{
	if (!val["gameid"].isNull() &&
		val["gameid"].isInt())
	{
		m_gameid = val["gameid"].asInt();
	}
	else
	{
        g_log.error("not find gameid ");
		exit(0);
	}
}
