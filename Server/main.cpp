#ifndef _MAIN_C_
#define _MAIN_C_

#include <stdio.h>
#include <iostream>
#include <fstream>
#include <unistd.h>
#include "common/macros.h"
#include "common/config.h"
#include "common/log.h"
#include "task/task_thread.h"
#include <boost/asio/ssl.hpp>
#include "network/ws_client.h"
#include "network/ws_server.h"

#include "game/game.h"
using namespace std;

CLog g_log;
boost::asio::io_context g_ioc;
boost::asio::ssl::context g_ssl_ctx(boost::asio::ssl::context::tlsv12_client);

int main(int argc, char *argv[]) {
    printf("hello,world!\n");

    //初始化log
    g_log.start("log/tcptest.log",5,0,1,1073741824,50);

    int oc;
    bool is_daemonize = 0;
    string conf_file;

    while ((oc = getopt(argc, argv, "Df:")) != -1) {
        switch (oc) {
            case 'D':
                is_daemonize = 1;
                break;
            case 'f':
                conf_file = string(optarg);
                break;
            case '?':
                cout << "invalid \'%c\'" << endl;
                break;
            case ':':
                cout << "lack option arg" << endl;
                break;
        }
    }
    if (conf_file.empty()) {
        g_log.error("no config file\n");
        g_log.error("cmd:server -f conf/statistics.conf -D\n");
        exit(0);
    }
    g_log.info("read config file succes!\n");
    Config::GetInstance().Init(conf_file);
    try
    {
        StartTaskThread(Config::GetInstance().GetTaskThread());
        g_ssl_ctx.add_verify_path("conf/cacert.pem");
        g_ssl_ctx.set_verify_mode(boost::asio::ssl::verify_peer);

        Game::GetInstance().Init();

        string ip = Config::GetInstance().GetServerIp();
        int port = Config::GetInstance().GetServerPort();

        g_log.info("ip:%s	port:%d\n", ip.data(), port);

        CWsServer server(g_ioc, ip, port);

        server.StartAccept();

        g_ioc.run();

        g_log.info("normal end");
    }
    catch (std::exception const& e)
    {
        g_log.info("end exception %s", e.what());
        return EXIT_FAILURE;
    }
    return 0;
}

#endif
