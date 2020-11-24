#ifndef COMMON_H
#define COMMON_H


#include <string>

std::string string_format(const std::string fmt, ...);

uint32_t get_id();

uint32_t GetRomoid();

int GetRandom(int min, int max);

std::string RSASign(std::string message);


#endif