#ifndef SQL_TIME_H
#define SQL_TIME_H

#include <string>

std::string GetSqlDate(time_t _now = 0);

std::string GetSqlTime(time_t _now = 0);

std::string GetSqlYear(time_t _now = 0);

std::string GetSqlDateTime(time_t _now = 0);

std::string GetSqlTimestamp(time_t _now = 0);

#endif