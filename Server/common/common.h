#ifndef COMMON_H
#define COMMON_H


#include <string>

//数据类型定义
typedef char _tint8;                    //有符号 1 字节
typedef unsigned char _uint8;           //无符号 1 字节
typedef short _tint16;                  //有符号 2 字节
typedef unsigned short _uint16;         //无符号 2 字节
typedef int _tint32;                    //有符号 4 字节
typedef unsigned int _uint32;           //无符号 4 字节
typedef long long _tint64;              //有符号 8 字节
typedef unsigned long long _uint64;     //无符号 8 字节

std::string string_format(const std::string fmt, ...);

uint32_t get_id();

uint32_t GetRomoid();

int GetRandom(int min, int max);

std::string RSASign(std::string message);

template<typename TYPE>
const TYPE &MAX(const TYPE &lhs, const TYPE &rhs) {
    return lhs > rhs ? lhs : rhs;
}

template<typename TYPE>
const TYPE &MIN(const TYPE &lhs, const TYPE &rhs) {
    return lhs < rhs ? lhs : rhs;
}

#endif