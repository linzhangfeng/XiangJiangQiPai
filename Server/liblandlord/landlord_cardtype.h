/********************************************************************
    created:	2013/5/02
    filename: 	landlord_cardtype.h
    author:		
    
    purpose:	斗地主牌型定义
*********************************************************************/
#ifndef __LANDLORD_CARDTYPE_H__
#define __LANDLORD_CARDTYPE_H__

#include "../common/common.h"

#define  BIAN_DAN    3
#define  DUI_ZI        2
#define  BIAN_KAN    1
#define  SINGLE        0
//游戏定时器
#define TIMER_WAIT_READY        10                  //等待准备定时器
#define TIMER_DICE              20                  //骰子时器
#define TIMER_LACKCARD          30                  //定缺牌定时器
#define TIMER_OUT_CARD          40                  //出牌定时器
#define TIMER_OPERATE           50                  //操作定时器
#define TIMER_DELAY_OUT_CARD    60                  //延迟出牌定时器
#define TIMER_GET_CARD          70                  //发第14张牌定时器
#define TIMER_MULTIOPERATE      80                  //多操作时钟
#define TIMER_DELAY_GET_CARD    90                  //自摸延迟定时器
#define TIMER_DELAY_WRITE_SCORE 100                 //延迟写分
#define TIMER_CHANGE_TIME       110                 //换牌时间
#define TIMER_AUTO_OUT_CARD     120                 //系统自动出牌定时器

#define LOOPNUM   5


/**
 * 番类型ID定义
 */
enum Landlord_CardType {
    CT_ERROR = 0,                   //  错误类型
    CT_SINGLE = 1,                  //  单牌
    CT_DOUBLE = 2,                  //  对子
    CT_THREE = 3,                   //  三条
    CT_SINGLE_LINE = 4,             //  顺子
    CT_DOUBLE_LINE = 5,             //  连对
    CT_THREE_TAKE_SINGLE = 6,       //  三带1
    CT_THREE_TAKE_DOUBLE = 7,       // 3带2
    CT_THREE_LINE = 8,              //  飞机：三顺
    CT_THREE_LINE_TAKE_SINGLE = 9,      //  2连飞机带翅膀： 三顺+同数量一手牌。比如777888+3+6或444555666+33+77+88
    CT_THREE_LINE_TAKE_DOUBLE = 10,
    CT_THREE_THREE_LINE_TAKE = 10,      //  3连飞机带翅膀： 三顺+同数量一手牌。比如777888+3+6或444555666+33+77+88
    CT_FOUR_TAKE_SINGLE = 11,   //  四带二：四条+2手牌。比如AAAA+7+9或9999+33+55
    CT_FOUR_TAKE_DOUBLE = 12,   //  四带二：四条+2手牌。比如AAAA+7+9或9999+33+55
    CT_BOMB = 13,               //  炸弹
    CT_ROCKET = 14,             //  火箭
    CT_THREE_BOMB = 15,         //  三炸
    CT_Four_BOMB = 16,          //  四炸
    CT_KING_BOMB = 17,          //  王炸
    CT_SMALL_KING_BOMB = 18,    //--  癞子配小王
    CT_BIG_KING_BOMB = 19,      //--  癞子配大王
    CT_SOFT_FOUR_BOMB = 20,     //--  软四炸
    CT_HARD_FOUR_BOMB = 21,     //--  硬四炸
};

#endif
