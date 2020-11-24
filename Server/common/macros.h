#ifndef MACROS_H
#define MACROS_H

#include "log.h"

extern CLog g_log;

#define WB_FUNC(varType, varName, funName)\
protected: varType varName;\
public: varType Get##funName(void) const { return varName; }\
public: void Set##funName(varType var){ varName = var; }

#define WB_FUNC_INIT(varType, varName, varInitValue, funName)\
protected: varType varName=varInitValue;\
public: varType Get##funName(void) const { return varName; }\
public: void Set##funName(varType var){ varName = var; }

#define WB_FUNC_READ(varType, varName, funName)\
protected: varType varName;\
public: varType Get##funName(void) const { return varName; }\

#define __FILENAME__ (strrchr(__FILE__, '/') ? strrchr(__FILE__, '/') + 1 : __FILE__)

#define CHECK_CHARID(charid)\
if ( charid < 0 || charid >= m_game_player_num )\
{\
    g_log.info("m_cur_seatid:%d error", charid);\
    return;\
}

enum {
    G_GAME_NUM_2 = 2,
    G_GAME_NUM_3 = 3,
    G_GAME_NUM_4 = 4
};


#endif