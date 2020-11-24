#ifndef _LOG_H_
#define _LOG_H_

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

#ifdef POSIX_PTHREAD
	#include <pthread.h>
#endif

#include <iostream>
#include <fstream>
#include <string>

using namespace std;

enum LEVEL {
    LEVEL_PANIC = 0,
    LEVEL_FATAL,
    LEVEL_ERROR,
    LEVEL_WARN,
    LEVEL_INFO,
    LEVEL_DEBUG,
};

enum CONSOLE {
	CONSOLE_OFF = 0,
	CONSOLE_ON,
};

enum ROTATE {
	ROTATE_OFF = 0,
	ROTATE_ON,
};

class CLog {
public:
    CLog();
    virtual ~CLog();
    void start(string log_file, int level, int console, int rotate, int64_t max_size, int max_file);
    void stop();
	void panic(const char *fmt, ...);
	void fatal(const char *fmt, ...);
	void error(const char *fmt, ...);
	void warn(const char *fmt, ...);
    void info(const char *fmt, ...);
	void debug(const char *fmt, ...);
	
private:
    void output(char *buf, int cnt);
	void rotate();	
	bool check_day_changed();
	void rotate_day();

private:
	string				_log_file;
    int					_level;
    int					_fd;
    int					_console;
    int					_rotate;
    int64_t				_max_size;
    int64_t				_current_size;
	int					_max_file;
	struct tm       *_curr_day;
	int _year;
	int _month;
	int _day;
#ifdef POSIX_PTHREAD
	pthread_mutex_t		_mutex;
#endif
};

#endif
