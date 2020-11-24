#include "sql_time.h"
#include <ctime>
#include <iomanip>      // std::put_time
#include <ctime>        // std::time_t, struct std::tm, std::localtime
#include <chrono>       // std::chrono::system_clock

using namespace std;
using namespace chrono;

//YYYY-MM-DD
string GetSqlDate(time_t _now )
{
	char buff[1024]{0};
	time_t tt = system_clock::to_time_t(system_clock::now());
	//return put_time(localtime(&tt), "%F");
	strftime(buff,1024, "%F", localtime(&tt));
	return string(buff);
}

//HH:MM:SS
string GetSqlTime(time_t _now)
{
	char buff[1024]{ 0 };
	time_t tt = system_clock::to_time_t(system_clock::now());
	//return put_time(localtime(&tt), "%F");
	strftime(buff, 1024, "%T", localtime(&tt));
	return string(buff);
}

//YYYY
string GetSqlYear(time_t _now)
{
	char buff[1024]{ 0 };
	time_t tt = system_clock::to_time_t(system_clock::now());
	//return put_time(localtime(&tt), "%F");
	strftime(buff, 1024, "%Y", localtime(&tt));
	return string(buff);
}

//YYYY-MM-DD HH:MM:SS	
string GetSqlDateTime(time_t _now)
{
	char buff[1024]{ 0 };
	time_t tt = _now;
	if ( _now == 0 )
	{
		tt = system_clock::to_time_t(system_clock::now());
	}
	//return put_time(localtime(&tt), "%F");
	strftime(buff, 1024, "%F %T", localtime(&tt));
	return string(buff);
}

//YYYYMMDD HHMMSS
string GetSqlTimestamp(time_t _now)
{
	time_t tt = system_clock::to_time_t(system_clock::now());
	return to_string(tt);
}