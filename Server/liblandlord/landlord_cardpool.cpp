#include "landlord_cardpool.h"
#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <iostream>
#include <algorithm>

void RandomCard(_uint8 *pool, _uint8 size, int seed) {
    static int Xseed = 0;
    srand(int(time(0)) + seed + Xseed++);

    for (int i = size - 1; i > 0; i--) {
        int index = rand() % i;
        if (i != index) {
            _uint8 tmp = pool[i];
            pool[i] = pool[index];
            pool[index] = tmp;
        }
    }
    for (int i = 0; i < size - 1; i++) {
        int index = rand() % (size - i) + i;
        if (i != index) {
            _uint8 tmp = pool[i];
            pool[i] = pool[index];
            pool[index] = tmp;
        }
    }
}

LandlordCardPool::LandlordCardPool(E_POOL_MODE iMode, int iSeedID) {
    Set(iMode, iSeedID);
}

LandlordCardPool::~LandlordCardPool() {

}

void LandlordCardPool::Set(E_POOL_MODE iMode, int iSeedID) {
    srand(int(time(0)));
    m_Mode = iMode;
    m_SeedID = iSeedID + rand();
}


void LandlordCardPool::InitPool() {
    m_MaxCount = 0;
    InitAllCard();
    m_Count = m_MaxCount;
    m_Current = 0;
    m_Last = m_MaxCount;

    RandomCard(m_Pool, m_MaxCount, m_SeedID);
}

const _uint8 pool_common[] = {
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,   //方块
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d,   //梅花
        0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d,   //红桃
        0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x3b, 0x3c, 0x3d,   //黑桃
        0x4e, 0x4f//大小王
};

void LandlordCardPool::InitAllCard()
{
    AddPool(pool_common, sizeof(pool_common) , 1);
}


void LandlordCardPool::AddPool(const _uint8 *card, _uint8 size, _uint8 count) {
    assert(m_MaxCount + size * count <= (int) sizeof(m_Pool));
    for (int i = 0; i < count; i++) {
        memcpy(m_Pool + m_MaxCount, card, size);
        m_MaxCount += size;
    }
}

_uint8 LandlordCardPool::Find(_uint8 card) const {
    int iCount = 0;
    for (_uint8 i = m_Current; i < m_Last; i++) {
        if (m_Pool[i] == card)
            iCount++;
    }
    return iCount;
}

_uint8 LandlordCardPool::operator[](_uint8 pos) const {
    assert(pos + m_Current < m_Last);
    return m_Pool[pos + m_Current];
}

_uint8 &LandlordCardPool::operator[](_uint8 pos) {
    assert(pos + m_Current < m_Last);
    return m_Pool[pos + m_Current];
}

_uint8 LandlordCardPool::GetOneCard() {
    if (m_Current < m_Last) {
        m_Count--;
        return m_Pool[m_Current++];
    }
    throw ("Pool has no cards");
}

_uint8 LandlordCardPool::GetLast() {
    if (m_Current < m_Last) {
        m_Count--;
        return m_Pool[--m_Last];
    }
    throw ("Pool has no cards");
}

int LandlordCardPool::GetCard(_uint8 *pool, _uint8 size) {
    if (m_Count != 0 && size != 0) {
        _uint8 iCount = MIN(size, m_Count);
        memcpy(pool, &m_Pool[m_Current], iCount);
        m_Current += iCount;
        m_Count -= iCount;
        return iCount;
    }
    return 0;
}

int LandlordCardPool::GetLastCard(_uint8 *pool, _uint8 size) {
    if (m_Count != 0 && size != 0) {
        _uint8 iCount = MIN(size, m_Count);
        m_Last -= iCount;
        memcpy(pool, &m_Pool[m_Last], iCount);
        m_Count -= iCount;
        return iCount;
    }
    return 0;
}

_uint8 LandlordCardPool::GetCardByIndex(_uint8 index) const {
    if (index >= m_MaxCount) return INVALID_CARD;

    return m_Pool[index];
}

int LandlordCardPool::SomeLastCard(_uint8 *pool, _uint8 size) {
    if (m_Count != 0 && size != 0) {
        _uint8 iCount = MIN(size, m_Count);
        _uint8 iLast = m_Last;
        iLast -= iCount;
        memcpy(pool, &m_Pool[iLast], iCount);
        return iCount;
    }
    return 0;
}

_uint8 LandlordCardPool::GetLastSub1() {
    if (m_Current + 1 < m_Last) {
        _uint8 lastSub1Card = m_Pool[m_Last - 2];
        m_Pool[m_Last - 2] = m_Pool[m_Last - 1];
        m_Last--;
        m_Count--;
        return lastSub1Card;
    }
    throw ("Pool has no cards");
}


