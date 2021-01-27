/********************************************************************
    created:	2013/5/02
    filename: 	landlord_cardtype.h
    author:		
    
    purpose:	斗地主牌型定义
*********************************************************************/
#include <string.h>
using namespace std;
#ifndef __LANDLORD_DEF_H__
#define __LANDLORD_DEF_H__



#define GAME_PLAYER					3				    //游戏人数
#define INVALID_CARD                0xFF                //无效牌
#define POOL_CARD_MAX               54                  //最大牌数目
#define BOTTOM_CARD_MAX             3                   //最大底牌张数
#define HAND_CARD_SIZE_MAX          20                  //最大手牌张数
//
//#define  BIAN_DAN    3
//#define  DUI_ZI        2
//#define  BIAN_KAN    1
//#define  SINGLE        0
////游戏定时器
//#define TIMER_WAIT_READY        10                  //等待准备定时器
//#define TIMER_DICE              20                  //骰子时器
//#define TIMER_LACKCARD          30                  //定缺牌定时器
//#define TIMER_OUT_CARD          40                  //出牌定时器
//#define TIMER_OPERATE           50                  //操作定时器
//#define TIMER_DELAY_OUT_CARD    60                  //延迟出牌定时器
//#define TIMER_GET_CARD          70                  //发第14张牌定时器
//#define TIMER_MULTIOPERATE      80                  //多操作时钟
//#define TIMER_DELAY_GET_CARD    90                  //自摸延迟定时器
//#define TIMER_DELAY_WRITE_SCORE 100                 //延迟写分
//#define TIMER_CHANGE_TIME       110                 //换牌时间
//#define TIMER_AUTO_OUT_CARD     120                 //系统自动出牌定时器
//
//#define LOOPNUM   5


/**
 * 每位玩家手中牌记录
 *
 * @deprecated ChangeableCards 可换牌
 *             ChangeableCardsLen 可换牌个数
 *             FixedCards 固定牌
 *             FixedCardsLen 固定牌组数
 */
struct HandCards {
    _uint8 ChangeableCardsLen;
    _uint8 ChangeableCards[HAND_CARD_SIZE_MAX];

    HandCards() {
        ChangeableCardsLen = 0;
        memset(ChangeableCards, INVALID_CARD, sizeof(ChangeableCards));
    }
};

enum E_POOL_MODE
{
    CARD_POOL_ALL,			//所有牌
};

#endif
