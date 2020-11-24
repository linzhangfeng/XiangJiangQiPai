#ifndef PROTOBUF2JSON_H
#define PROTOBUF2JSON_H

#include <string>
#include <google/protobuf/message.h>

std::string Protobuf2Json(const google::protobuf::Message& msg);


#endif