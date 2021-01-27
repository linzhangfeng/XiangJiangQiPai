#ifndef __TABLE_HELPER_H__
#define __TABLE_HELPER_H__

#include <vector>
#include <assert.h>
#include <string.h>
#include "../common/common.h"
#include "landlord_def.h"
using namespace std;
class LandlordCardPool {
public:
    LandlordCardPool(E_POOL_MODE iMode, int iSeedID = 0);

    ~LandlordCardPool();

    void Set(E_POOL_MODE iMode, int iSeedID = 0);

public:
    _uint8 operator[](_uint8 pos) const;

    _uint8 &operator[](_uint8 pos);

    void InitPool();

    _uint8 Find(_uint8 card) const;

public:
    _uint8 GetOneCard();

    _uint8 GetLast();

    int GetCard(_uint8 *pool, _uint8 size);

    int GetLastCard(_uint8 *pool, _uint8 size);

    _uint8 MaxCount() const { return m_MaxCount; }        //最大牌数
    _uint8 LastCard() const { return m_Pool[m_Last - 1]; }    //查看最后一张牌
    _uint8 CurCard() const { return m_Pool[m_Current]; }    //查看第一张牌
    _uint8 Count() const { return m_Count; }                //当前剩余牌数
    bool IsEmpty() const { return m_Count == 0; }        //是否没有牌了
    bool IsLastCard() const { return m_Count == 1; }        //是否最后一张牌
    _uint8 GetCardCount_FromBack() const { return m_MaxCount - m_Last; }

    _uint8 GetCardByIndex(_uint8 index) const;            //查看牌池第几张牌(索引从0开始，跟m_Current无关)
    _uint8 LastIndexCard(_uint8 index) const { return m_Pool[m_Last - index]; } //查看最后第几张
    int SomeLastCard(_uint8 *pool, _uint8 size);

    bool Exchange_Last_2_Card();

    _uint8 GangRefillCard();

public:
    bool Exchange_Cur_Next(_uint8 pos = -1);

    void ChangeCard(int first, int second);

    _uint8 GetLastSub1();

    _uint8 LastSub1Card();

    _uint8 GetRandCardFromLeft();

public:
    void FixCard(int);//测试用固定牌
    void FixCard_ReadJson();

    void FixCard_ReadJson2();

public:
    _uint8 Current() const { return m_Current; }

    _uint8 Last() const { return m_Last; }

    bool SwapCard(_uint8 index1, _uint8 index2);

private:
    void AddPool(const _uint8 *card, _uint8 size, _uint8 count = 4);

private:
    void InitAllCard();


public:
    void GetInfo(int &SeedID, E_POOL_MODE &Mode, _uint8 Pool[POOL_CARD_MAX], _uint8 &MaxCount,
                 _uint8 &Count, _uint8 &Current, _uint8 &Last, _uint8 &JokerCard, _uint8 &JokerCount) {
        SeedID = m_SeedID;
        Mode = m_Mode;
        memcpy(Pool, m_Pool, sizeof(_uint8) * POOL_CARD_MAX);
        MaxCount = m_MaxCount;
        Count = m_Count;
        Current = m_Current;
        Last = m_Last;
    }

    void SetInfo(int SeedID, E_POOL_MODE Mode, _uint8 Pool[POOL_CARD_MAX], _uint8 MaxCount,
                 _uint8 Count, _uint8 Current, _uint8 Last, _uint8 JokerCard, _uint8 JokerCount) {
        m_SeedID = SeedID;
        m_Mode = Mode;
        memcpy(m_Pool, Pool, sizeof(_uint8) * POOL_CARD_MAX);
        m_MaxCount = MaxCount;
        m_Count = Count;
        m_Current = Current;
        m_Last = Last;
    }


private:
    int m_SeedID;
    E_POOL_MODE m_Mode;
    _uint8 m_Pool[POOL_CARD_MAX];
    _uint8 m_MaxCount;
    _uint8 m_Count;
    _uint8 m_Current;    //当前牌位置
    _uint8 m_Last;        //最后一张牌的下一张
};


#endif
