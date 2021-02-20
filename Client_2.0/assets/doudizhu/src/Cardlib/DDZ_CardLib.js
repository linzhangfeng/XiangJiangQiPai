const mask = {
    //数值掩码
    LOGIC_MASK_COLOR: 0xF0,                     //花色掩码
    LOGIC_MASK_VALUE: 0x0F,                     //数值掩码
};

window.DDZLogic = {
    CT_ERROR: 0,      //  错误类型
    CT_SINGLE: 1,      //  单牌
    CT_DOUBLE: 2,      //  对子
    CT_THREE: 3,      //  三条
    CT_SINGLE_LINE: 4,      //  顺子
    CT_DOUBLE_LINE: 5,      //  连对
    CT_THREE_TAKE_SINGLE: 6,      //  三带1
    CT_THREE_TAKE_DOUBLE: 7,       // 3带2
    CT_THREE_LINE: 8,      //  飞机：三顺 
    CT_THREE_LINE_TAKE_SINGLE: 9,      //  2连飞机带翅膀： 三顺+同数量一手牌。比如777888+3+6或444555666+33+77+88
    CT_THREE_LINE_TAKE_DOUBLE: 10,
    CT_THREE_THREE_LINE_TAKE: 10,     //  3连飞机带翅膀： 三顺+同数量一手牌。比如777888+3+6或444555666+33+77+88
    CT_FOUR_TAKE_SINGLE: 11,     //  四带二：四条+2手牌。比如AAAA+7+9或9999+33+55 
    CT_FOUR_TAKE_DOUBLE: 12,     //  四带二：四条+2手牌。比如AAAA+7+9或9999+33+55
    CT_BOMB: 13,     //  炸弹
    CT_ROCKET: 14,     // 火箭
}

module.exports = cc.Class({

    properties: {},

    // use this for initialization
    onLoad: function () {

    },

    //炸弹是否被拆了
    is_zha_chai: function (out, hand) {
        let result = this.analyseCard(hand)
        if (result.fourCount == 0)
            return false
        let d = result.fourCardData
        for (let i = 0; i < d.length / 4; i++) {
            let has_one_of = false //含有炸弹中的其中任意一张
            let has_all_of = true
            for (let j = 0; j < 4; j++) {
                if (out.contains(d[i * 4 + j]))
                    has_one_of = true
                else
                    has_all_of = false
            }
            // cc.log('one:'+has_one_of+' all:'+has_all_of)
            if (has_one_of) {
                if (!has_all_of)
                    return true
                else {
                    let type = this.getCardType(out)
                    if (type == DDZLogic.CT_THREE_TAKE_SINGLE || type == DDZLogic.CT_THREE_LINE_TAKE_SINGLE || type == DDZLogic.CT_THREE_THREE_LINE_TAKE)
                        return true
                }
            }
            if (has_one_of && !has_all_of) {
                return true
            }
        }
        return false
    },

    //获取牌数值
    getCardValue: function (bCardData) {
        return bCardData & mask.LOGIC_MASK_VALUE;
    },

    //获取花色
    getCardColor: function (bCardData) {
        return bCardData & mask.LOGIC_MASK_COLOR;
    },

    //获取逻辑数值 A 2 比3 大
    getLogicValue: function (card) {
        let value = this.getCardValue(card)
        let color = this.getCardColor(card);

        if (color == 0x40) {
            return value + 2;
        } else if (value <= 2) {
            return value + 13;
        } else {
            return value;
        }

        // if (value == 1)
        //     return value + 13
        // else if (value == 2)
        //     return value + 13
        // else
        //     return value

    },

    sortOutCard: function (cards, type) {
        if (type == undefined) {
            type = this.getCardType(cards);
        }
        switch (type) {
            case DDZLogic.CT_THREE_TAKE_SINGLE:
            case DDZLogic.CT_THREE_TAKE_DOUBLE:
                let analyse = this.analyseCard(cards, true);
                cards = analyse.threeCardData.slice(0);
                cards = cards.concat(analyse.doubleCardData.slice(0));
                cards = cards.concat(analyse.singleCardData.slice(0));
                break;
            case DDZLogic.CT_FOUR_TAKE_SINGLE:
            case DDZLogic.CT_FOUR_TAKE_DOUBLE: {
                let analyse = this.analyseCard(cards, true);
                cards = analyse.fourCardData.slice(0);
                cards = cards.concat(analyse.doubleCardData.slice(0));
                cards = cards.concat(analyse.singleCardData.slice(0));
            }
                break;
        }
        return cards;
    },

    sortCard: function (bCardData) {
        bCardData.sort(function (a, b) {
            return this.getLogicValue(b) - this.getLogicValue(a);
        }.bind(this))
        return bCardData
    },

    getCardType: function (data, result) {
        data = this.sortCard(data);
        let count = data.length

        if (count == 0)
            return DDZLogic.CT_ERROR
        else if (count == 1)
            return DDZLogic.CT_SINGLE
        else if (count == 2) {
            if (data[0] == 0x4f && data[1] == 0x4e) {
                return DDZLogic.CT_ROCKET;
            } else if (this.getLogicValue(data[0]) == this.getLogicValue(data[1]))
                return DDZLogic.CT_DOUBLE
            else
                return DDZLogic.CT_ERROR
        }

        if (!result)
            result = this.analyseCard(data, true);
        cc.log('get result:' + JSON.stringify(result))

        if (result.fourCount > 0) {
            // 炸弹
            if (result.fourCount == 1 && count == 4)
                return DDZLogic.CT_BOMB
            if (result.fourCount == 1 && result.singleCount == 2 && count == 6) {
                if (JSON.parse(cc.mgr.ll.roomInfo.params.four_single_two)) {
                    return DDZLogic.CT_FOUR_TAKE_SINGLE
                }

            }

            if (result.fourCount == 1 && result.doubleCount == 2 && count == 8) {
                if (JSON.parse(cc.mgr.ll.roomInfo.params.four_pair_two)) {
                    return DDZLogic.CT_FOUR_TAKE_DOUBLE
                }
            }


            return DDZLogic.CT_ERROR
        }
        if (result.threeCount > 0) {
            // 三条
            if (result.threeCount == 1 && count == 3) {
                return DDZLogic.CT_THREE;
            }
            // 三带一

            if (result.threeCount == 1 && result.singleCount == 1 && count == 4) {
                if (JSON.parse(cc.mgr.ll.roomInfo.params.three_one)) {
                    return DDZLogic.CT_THREE_TAKE_SINGLE;
                }

            }

            // 三带一对
            if (result.threeCount == 1 && result.doubleCount == 1 && count == 5) {
                if (JSON.parse(cc.mgr.ll.roomInfo.params.three_two)) {
                    return DDZLogic.CT_THREE_TAKE_DOUBLE;
                }

            }

            if (result.threeCount > 1) {
                let cardData = result.threeCardData[0]
                let firstLogicValue = this.getLogicValue(cardData)
                // 错误过滤
                if (firstLogicValue >= 15)
                    return DDZLogic.CT_ERROR

                // 连牌判断 
                for (let i = 1; i < result.threeCount; i++) {
                    let cardData = result.threeCardData[i * 3]
                    if (firstLogicValue != this.getLogicValue(cardData) + i)
                        return DDZLogic.CT_ERROR;
                }
            }
            // 飞机
            if (result.threeCount * 3 == count)
                return DDZLogic.CT_THREE_LINE;
            if (result.threeCount * 4 == count && result.threeCount == result.singleCount + result.doubleCount * 2) {
                if (JSON.parse(cc.mgr.ll.roomInfo.params.three_one)) {
                    return DDZLogic.CT_THREE_LINE_TAKE_SINGLE;
                }

            }
            if (result.threeCount * 5 == count && result.threeCount == result.doubleCount) {
                if (JSON.parse(cc.mgr.ll.roomInfo.params.three_two)) {
                    return DDZLogic.CT_THREE_LINE_TAKE_DOUBLE;
                }

            }

            return DDZLogic.CT_ERROR
        }
        if (result.doubleCount >= 3) {
            let first = this.getLogicValue(result.doubleCardData[1])
            if (first >= 15)
                return DDZLogic.CT_ERROR
            for (let i = 1; i < result.doubleCount; i++) {
                if (first != this.getLogicValue(result.doubleCardData[i * 2]) + i)
                    return DDZLogic.CT_ERROR
            }
            if (result.doubleCount * 2 == count)
                return DDZLogic.CT_DOUBLE_LINE
            else
                return DDZLogic.CT_ERROR
        }
        if (result.singleCount >= 5 && result.singleCount == count) {
            let first = this.getLogicValue(result.singleCardData[0])
            if (first >= 15)
                return DDZLogic.CT_ERROR
            for (let i = 1; i < result.singleCount; i++) {
                // cc.log('first:'+first+"  ::"+this.getLogicValue(result.singleCardData[i]) + "  i:"+i)
                if (first != this.getLogicValue(result.singleCardData[i]) + i)
                    return DDZLogic.CT_ERROR
            }
            return DDZLogic.CT_SINGLE_LINE
        }
        return DDZLogic.CT_ERROR
    },

    //如果filter为true，则每种类型，牌不会重复添加
    analyseCard: function (data, filter) {
        let result = {
            fourCount: 0,
            threeCount: 0,
            doubleCount: 0,
            singleCount: 0,
            fourCardData: [],
            threeCardData: [],
            doubleCardData: [],
            singleCardData: [],
        }
        let count = data.length

        let i = 0
        while (i < count) {
            let sameCount = 1
            let value = this.getLogicValue(data[i])
            //搜索相同牌
            for (let j = i + 1; j < count; j++) {
                if (this.getLogicValue(data[j]) != value)
                    break
                sameCount += 1
            }
            if (filter ? sameCount == 1 : sameCount >= 1) {
                result.singleCount += 1
                result.singleCardData.push(data[i])
            }
            if (filter ? sameCount == 2 : sameCount >= 2) {
                result.doubleCount += 1
                result.doubleCardData.push(data[i])
                result.doubleCardData.push(data[i + 1])
            }
            if (filter ? sameCount == 3 : sameCount >= 3) {
                result.threeCount += 1
                result.threeCardData.push(data[i])
                result.threeCardData.push(data[i + 1])
                result.threeCardData.push(data[i + 2])
            }
            if (filter ? sameCount == 4 : sameCount >= 4) {
                result.fourCount += 1
                result.fourCardData.push(data[i])
                result.fourCardData.push(data[i + 1])
                result.fourCardData.push(data[i + 2])
                result.fourCardData.push(data[i + 3])
            }

            i += sameCount
        }
        return result
    },
    /**
     * @param first 参照牌
     */
    compareCard: function (firstCards, nextCards, firstType, nextType) {
        if (!firstType)
            firstType = this.getCardType(firstCards);
        if (!nextType)
            nextType = this.getCardType(nextCards);

        if (nextType == DDZLogic.CT_ERROR)
            return false;

        // 火箭
        if (firstType == DDZLogic.CT_ROCKET)
            return false;
        if (nextType == DDZLogic.CT_ROCKET)
            return true;

        // 炸弹
        if (firstType != DDZLogic.CT_BOMB && nextType == DDZLogic.CT_BOMB)
            return true;
        if (firstType == DDZLogic.CT_BOMB && nextType != DDZLogic.CT_BOMB)
            return false;

        if (firstType != nextType || firstCards.length != nextCards.length)
            return false;

        // 比牌
        if (nextType == DDZLogic.CT_SINGLE ||
            nextType == DDZLogic.CT_DOUBLE ||
            nextType == DDZLogic.CT_THREE ||
            nextType == DDZLogic.CT_SINGLE_LINE ||
            nextType == DDZLogic.CT_DOUBLE_LINE ||
            nextType == DDZLogic.CT_THREE_LINE ||
            nextType == DDZLogic.CT_BOMB) {
            return this.getLogicValue(nextCards[0]) > this.getLogicValue(firstCards[0]);
        } else if (nextType == DDZLogic.CT_THREE_TAKE_SINGLE ||
            nextType == DDZLogic.CT_THREE_TAKE_DOUBLE ||
            nextType == DDZLogic.CT_THREE_LINE_TAKE_SINGLE ||
            nextType == DDZLogic.CT_THREE_LINE_TAKE_DOUBLE) {

            let firstResult = this.analyseCard(firstCards)
            let nextResult = this.analyseCard(nextCards)
            return this.getLogicValue(nextResult.threeCardData[0]) > this.getLogicValue(firstResult.threeCardData[0])
        } else if (nextType == DDZLogic.CT_FOUR_TAKE_SINGLE || nextType == DDZLogic.CT_FOUR_TAKE_DOUBLE) {
            let firstResult = this.analyseCard(firstCards)
            let nextResult = this.analyseCard(nextCards)
            return this.getLogicValue(nextResult.fourCardData[0]) > this.getLogicValue(firstResult.fourCardData[0])
        }
        return false;
    },

    //判断是否可以出牌，且牌型是否大于后者
    //next是参照牌
    checkOutCard: function (prev, next, prevType, nextType) {
        if (!prevType)
            prevType = this.getCardType(prev)
        if (!nextType)
            nextType = this.getCardType(next)

        if (nextType == DDZLogic.CT_ROCKET)
            return false;
        if (prevType == DDZLogic.CT_ROCKET)
            return true;

        if (prevType == DDZLogic.CT_BOMB) {
            if (nextType == DDZLogic.CT_BOMB)
                return this.getLogicValue(prev[0]) > this.getLogicValue(next[0])
            else
                return true
        }
        if (prev.length != next.length || prevType != nextType)
            return false

        if (nextType == DDZLogic.CT_THREE_TAKE_SINGLE ||
            nextType == DDZLogic.CT_THREE_LINE_TAKE_SINGLE ||
            nextType == DDZLogic.CT_THREE_THREE_LINE_TAKE) {
            let prevResult = this.analyseCard(prev)
            let nextResult = this.analyseCard(next)
            return this.getLogicValue(prevResult.threeCardData[0]) > this.getLogicValue(nextResult.threeCardData[0])
        } else {
            return this.getLogicValue(prev[0]) > this.getLogicValue(next[0])
        }
    },

    //自己出牌（不用和别人比较），检测是否为牌型
    checkOutHand: function (out, hand) {
        let result = this.analyseCard(out)
        let type = this.getCardType(out, result)
        if (type == DDZLogic.CT_ERROR)
            return false
        let cnt_out = out.length
        let cnt_hand = hand.length
        if (type == DDZLogic.CT_THREE_TAKE_SINGLE ||
            type == DDZLogic.CT_THREE_LINE_TAKE_SINGLE ||
            type == DDZLogic.CT_THREE_THREE_LINE_TAKE) { //3带2
            let index = 1
            if (type == DDZLogic.CT_THREE_LINE_TAKE_SINGLE)
                index = 2
            if (type == DDZLogic.CT_THREE_THREE_LINE_TAKE)
                index = 3
            if (cnt_hand >= 5 * index) {
                if (cnt_out < 5 * index)
                    return false
            } else if (cnt_out != cnt_hand) {
                return false
            }
        }
        return true
    },

    //将选的牌组成牌型(单顺)
    checkOutHandToType: function (out) {
        let result = this.analyseCard(out)
        // let type = this.getCardType(out,result)
        let temp = result.singleCardData
        if (temp.length >= 5) {
            let data = [temp[0]]
            let first = this.getLogicValue(temp[0])
            for (let i = 1; i < temp.length; i++) {
                if (this.getLogicValue(temp[i]) == first - i && this.getLogicValue(first) < 15) {
                    data.push(temp[i])
                } else
                    break
            }
            if (data.length >= 5)
                return data
        }
        return []
    },

    isBomb: function (data) {
        if (data.length != 4)
            return 0
        let value = this.getLogicValue(data[0])
        for (let i = 1; i < data.length; i++) {
            if (value != this.getLogicValue(data[i]))
                return 0
        }
        return value
    },

    ifContainsBobm: function (bomb, card) {
        for (let i = 0; i < bomb.length / 4; i++) {
            // cc.log('bomb:'+bomb[i*4]+ '  card:'+card+'  bomb logic:'+this.getLogicValue(bomb[i*4]) + '  card logic:'+this.getLogicValue(card))
            if (this.getLogicValue(bomb[i * 4]) == this.getLogicValue(card))
                return true
        }
        return false
    },

    //从手牌中搜寻符合条件的牌
    getCanOut: function (data, out, canZhaChai) {
        // console.log('getCanOut-》', JSON.stringify(data), '》》《《', JSON.stringify(out));
        data = this.sortCard(data)
        out = this.sortCard(out)
        let canOut = []
        let handResult = this.analyseCard(data)
        // cc.log('hand rsult:'+JSON.stringify(handResult))
        // let handType = this.getCardType(data,handResult)

        let outResult = this.analyseCard(out, true)
        let outType = this.getCardType(out, outResult)


        // cc.log('out type:::'+outType)
        if (outType == DDZLogic.CT_ROCKET) {
            return canOut;
        } else if (outType == DDZLogic.CT_BOMB) {
            let outValue = this.getLogicValue(outResult.fourCardData[0])
            let temp = handResult.fourCardData
            for (let i = 0; i < handResult.fourCount; i++) {
                if (this.getLogicValue(temp[i * 4]) > outValue)
                    canOut.push([temp[i * 4], temp[i * 4 + 1], temp[i * 4 + 2], temp[i * 4 + 3]])
            }
            // return canOut
        } else { //手牌炸弹
            let temp = handResult.fourCardData
            for (let i = 0; i < handResult.fourCount; i++) {
                canOut.push([temp[i * 4], temp[i * 4 + 1], temp[i * 4 + 2], temp[i * 4 + 3]])
            }
            // if(!canZhaChai && temp.length > 0)
            //     return canOut
        }

        // 搜索火箭
        if (outType != DDZLogic.CT_ROCKET) {
            if (data[0] == 0x4f && data[1] == 0x4e) {
                canOut.push([data[0], data[1]]);
            }
        }


        let handCount = data.length
        let outCount = out.length
        if (handCount < outCount) //手牌数据不足，要不起            
            return canOut

        if ((outType == DDZLogic.CT_THREE_TAKE_SINGLE ||
            outType == DDZLogic.CT_THREE_TAKE_DOUBLE ||
            outType == DDZLogic.CT_THREE_LINE_TAKE_SINGLE ||
            outType == DDZLogic.CT_THREE_LINE_TAKE_DOUBLE)) {
            //找到 出牌 中的第一个3张（即最大的三张）
            let outValue = this.getLogicValue(outResult.threeCardData[0])
            let outLine = outResult.threeCount //几连飞机
            let handValue = this.getLogicValue(handResult.threeCardData[0])
            let handLine = handResult.threeCount
            cc.log('come------------- lian type:' + outType + "  hand max:" + handValue + "   out max:" + outValue)
            if (outLine > handLine || outValue > handValue) //手牌最大三张 小于 出牌，要不起
                return canOut

            console.log('^^^', outLine)
            let cardData = handResult.threeCardData
            let temp = [] //提取3张列表
            for (let i = 0; i < handLine; i++) {
                if (canZhaChai || !this.ifContainsBobm(handResult.fourCardData, cardData[i * 3]))
                    temp.push(cardData[i * 3])
            }
            // cc.log('temp:---------'+JSON.stringify(temp))
            for (let i = 0; i < temp.length; i++) {
                let isValue = false
                let first = temp[i]
                let last = temp[i + outLine - 1]
                if (first && last && this.getLogicValue(first) > outValue) {
                    if (outLine == 1 || (outLine > 1 && this.getLogicValue(first) < 15)) {
                        first = this.getLogicValue(first)
                        isValue = true
                        for (let j = 1; j < outLine; j++) {
                            if (this.getLogicValue(temp[i + j]) != first - j) {
                                isValue = false
                                break
                            }
                        }
                    }
                }
                if (isValue) {
                    let dd = []
                    for (let k = i * 3; k < i * 3 + 3 * outLine; k++) {
                        dd.push(cardData[k])
                    }
                    // cc.log('hehe:'+JSON.stringify(dd))
                    let dd2 = this.getThreeGroup(data, dd, outCount - outLine * 3)
                    for (let k = 0; k < dd2.length; k++) {
                        canOut.unshift(dd.concat(dd2[k]))
                    }
                }
            }
            // cc.log("three line----------:::"+JSON.stringify(temp))
        }

        if ((outType == DDZLogic.CT_FOUR_TAKE_SINGLE || outType == DDZLogic.CT_FOUR_TAKE_DOUBLE)) {

            let outValue = this.getLogicValue(outResult.fourCardData[0])
            let handValue = this.getLogicValue(handResult.fourCardData[0])
            let handLine = handResult.threeCount
            cc.log('come------------- lian type:' + outType + "  hand max:" + handValue + "   out max:" + outValue)
            if (outValue > handValue) //手牌最大三张 小于 出牌，要不起
                return canOut


            let cardData = handResult.fourCardData
            let temp = [] //提取4张列表
            for (let i = 0; i < handResult.fourCount; i++) {
                temp.push(cardData[i * 4])
            }
            // cc.log('temp:---------'+JSON.stringify(temp))
            for (let i = 0; i < temp.length; i++) {
                let isValue = false
                let first = temp[i]
                let last = temp[i]
                if (first && last && this.getLogicValue(first) > outValue) {

                    first = this.getLogicValue(first)
                    isValue = true
                }
                if (isValue) {
                    let dd = []
                    for (let k = i * 4; k < i * 4 + 4; k++) {
                        dd.push(cardData[k])
                    }
                    // cc.log('hehe:'+JSON.stringify(dd))
                    let dd2 = this.getFourGroup(data, dd, outCount - 4)
                    for (let k = 0; k < dd2.length; k++) {
                        canOut.unshift(dd.concat(dd2[k]))
                    }
                }
            }
            // cc.log("three line----------:::"+JSON.stringify(temp))
        }

        if (outType == DDZLogic.CT_DOUBLE_LINE) {
            let outValue = this.getLogicValue(outResult.doubleCardData[0])
            let outLine = outResult.doubleCount
            let handValue = this.getLogicValue(handResult.doubleCardData[0])
            let handLine = handResult.doubleCount
            if (outLine > handLine || outValue > handValue)
                return canOut

            let cardData = handResult.doubleCardData
            let temp = [] //提取2张列表
            for (let i = 0; i < handLine; i++) {
                if (canZhaChai || !this.ifContainsBobm(handResult.fourCardData, cardData[i * 2]))
                    temp.push(cardData[i * 2])
            }
            for (let i = 0; i < temp.length; i++) {
                let isValue = false
                let first = temp[i]
                let last = temp[i + outLine - 1]
                if (first && last && this.getLogicValue(first) > outValue && this.getLogicValue(first) < 15) {
                    first = this.getLogicValue(first)
                    isValue = true
                    for (let j = 1; j < outLine; j++) {
                        // cc.log('vv::'+this.getLogicValue(temp[i+j]) + " first:"+first + "  j:"+j)
                        if (this.getLogicValue(temp[i + j]) != first - j) {
                            isValue = false
                            break
                        }
                    }
                }
                if (isValue) {
                    let dd = []
                    for (let k = i * 2; k < i * 2 + 2 * outLine; k++) {
                        dd.push(cardData[k])
                    }
                    canOut.unshift(dd)
                }
            }
        }

        // 三条
        if (outType == DDZLogic.CT_THREE) {
            let outValue = this.getLogicValue(outResult.threeCardData[0])
            let result = this.analyseCard(data, true)

            let temp = result.threeCardData;
            for (let i = result.threeCount; i > 0; i--) {
                if (this.getLogicValue(temp[i * 3 - 1]) > outValue) {
                    canOut.unshift([temp[i * 3 - 1], temp[i * 3 - 2], temp[i * 3 - 3]]);
                }
            }

            temp = result.fourCardData
            for (let i = result.fourCount; i > 0; i--) {
                if (this.getLogicValue(temp[i * 4 - 1]) > outValue) {
                    canOut.unshift([temp[i * 4 - 1], temp[i * 4 - 2], temp[i * 4 - 3]])
                }
            }

        }

        if (outType == DDZLogic.CT_DOUBLE) {
            let outValue = this.getLogicValue(outResult.doubleCardData[0])
            let result = this.analyseCard(data, true)

            let temp = result.doubleCardData
            let ret = [];
            for (let i = result.doubleCount; i > 0; i--) {
                if (this.getLogicValue(temp[i * 2 - 1]) > outValue) {
                    ret.push([temp[i * 2 - 1], temp[i * 2 - 2]])
                }
            }

            temp = result.threeCardData
            for (let i = result.threeCount; i > 0; i--) {
                console.log('222-', i)
                if (this.getLogicValue(temp[i * 3 - 1]) > outValue) {
                    canOut.push([temp[i * 3 - 1], temp[i * 3 - 2]])
                }
            }

            for (let i = ret.length - 1; i >= 0; i--) {
                console.log('33-', i)
                canOut.unshift(ret[i]);
            }

        }

        if (outType == DDZLogic.CT_SINGLE_LINE) {
            let outValue = this.getLogicValue(outResult.singleCardData[0])
            let outLine = outResult.singleCount
            let handValue = this.getLogicValue(handResult.singleCardData[0])
            let handLine = handResult.singleCount
            if (outLine > handLine || outValue > handValue)
                return canOut

            let cardData = handResult.singleCardData
            // let temp = cardData
            let temp = [] //提取1张列表
            for (let i = 0; i < handLine; i++) {
                if (canZhaChai || !this.ifContainsBobm(handResult.fourCardData, cardData[i]))
                    temp.push(cardData[i])
            }
            for (let i = 0; i < temp.length; i++) {
                let isValue = false
                let first = temp[i]
                let last = temp[i + outLine - 1]
                if (first && last && this.getLogicValue(first) > outValue && this.getLogicValue(first) < 15) {
                    first = this.getLogicValue(first)
                    isValue = true
                    for (let j = 1; j < outLine; j++) {
                        if (this.getLogicValue(temp[i + j]) != first - j) {
                            isValue = false
                            break
                        }
                    }
                }
                if (isValue) {
                    let dd = []
                    for (let k = i * 1; k < i * 1 + 1 * outLine; k++) {
                        dd.push(cardData[k])
                    }
                    canOut.unshift(dd)
                }
            }
        }

        if (outType == DDZLogic.CT_SINGLE) {
            let outValue = this.getLogicValue(out[0])
            if (this.getLogicValue(data[0]) > outValue) {
                let result = this.analyseCard(data, true)
                let temp = []
                for (let i = 0; i < result.threeCount; i++)
                    temp = temp.concat(result.threeCardData[i * 3])
                for (let i = 0; i < result.doubleCount; i++)
                    temp = temp.concat(result.doubleCardData[i * 2])
                temp = temp.concat(result.singleCardData)
                // temp = temp.concat(result.threeCardData,result.doubleCardData,result.singleCardData)
                for (let i = 0; i < temp.length; i++) {
                    if (this.getLogicValue(temp[i]) > outValue)
                        canOut.unshift([temp[i]])
                }
            }
        }

        // cc.log('canOut::::'+JSON.stringify(canOut))
        return canOut
    },

    getFourGroup: function (data, value, cnt) {
        // 带的牌是单还是双
        let singleOrDouble = cnt == 2 ? 1 : 2;
        cc.log('cnt:' + cnt)
        console.log('value', JSON.stringify(value))
        let temp = []
        for (let i = 0; i < data.length; i++) {
            let has
            for (let j = 0; j < value.length; j++) {
                if (data[i] == value[j]) {
                    has = true
                    break
                }
            }
            if (!has)
                temp.push(data[i])
        }
        let group = []
        // 带单
        if (singleOrDouble == 1) {
            let result = this.analyseCard(temp, true)
            temp = []
            temp = temp.concat(result.fourCardData, result.threeCardData, result.doubleCardData, result.singleCardData)
            // cc.log('temp result::'+JSON.stringify(temp))

            for (let i = 0; i < temp.length; i++) {
                let first = temp[i]
                let last = temp[i + cnt - 1]
                let d = []
                if (first && last) {
                    for (let j = 0; j < cnt; j++) {
                        d.push(temp[i + j])
                    }
                }
                // cc.log('-----dd::'+JSON.stringify(d))
                if (d.length > 0)
                    group.push(d)
                // if(group.length > 4) //不用太多组合吧，最多5种
                //     break
            }
        } else if (singleOrDouble == 2) {// 带双
            let result = this.analyseCard(temp, false)
            temp = result.doubleCardData;
            cc.log('temp result false::' + JSON.stringify(temp))
            for (let i = 0; i < temp.length; i += 2) {
                let first = temp[i]
                let last = temp[i + cnt - 1]
                let d = [];
                if (first && last) {
                    for (let j = 0; j < cnt; j++) {
                        d.push(temp[i + j]);
                    }
                }

                if (d.length > 0)
                    group.push(d)
            }

        }

        cc.log('group:::' + JSON.stringify(group))
        return group

    },
    //获取可能的三张 带牌组合  手牌|有效的三连|需要带几个牌
    //返回可带的牌的组合
    getThreeGroup: function (data, value, cnt) {

        // 带的牌是单还是双
        let singleOrDouble = cnt / (value.length / 3);
        cc.log('cnt:' + cnt)
        console.log('value', JSON.stringify(value))
        let temp = []
        for (let i = 0; i < data.length; i++) {
            let has
            for (let j = 0; j < value.length; j++) {
                if (data[i] == value[j]) {
                    has = true
                    break
                }
            }
            if (!has)
                temp.push(data[i])
        }
        let group = []
        // 带单
        if (singleOrDouble == 1) {
            let result = this.analyseCard(temp, true)
            temp = []
            temp = temp.concat(result.threeCardData, result.doubleCardData, result.singleCardData)
            // cc.log('temp result::'+JSON.stringify(temp))

            for (let i = 0; i < temp.length; i++) {
                let first = temp[i]
                let last = temp[i + cnt - 1]
                let d = []
                if (first && last) {
                    for (let j = 0; j < cnt; j++) {
                        d.push(temp[i + j])
                    }
                }
                // cc.log('-----dd::'+JSON.stringify(d))
                if (d.length > 0)
                    group.push(d)
                // if(group.length > 4) //不用太多组合吧，最多5种
                //     break
            }
        } else if (singleOrDouble == 2) {// 带双
            let result = this.analyseCard(temp, false)
            temp = result.doubleCardData;
            cc.log('temp result false::' + JSON.stringify(temp))
            for (let i = 0; i < temp.length; i += 2) {
                let first = temp[i]
                let last = temp[i + cnt - 1]
                let d = [];
                if (first && last) {
                    for (let j = 0; j < cnt; j++) {
                        d.push(temp[i + j]);
                    }
                }

                if (d.length > 0)
                    group.push(d)
            }

        }

        cc.log('group:::' + JSON.stringify(group))
        return group
    },

    removeCards: function (src, del) {
        if (typeof del == 'number') {
            del = [del];
        } else if (del instanceof Array) {
            del = del.slice(0);
        }

        for (let i = src.length - 1; i >= 0; i--) {
            for (let j = del.length - 1; j >= 0; j--) {
                if (del[j] == src[i]) {
                    del.splice(j, 1);
                    src.splice(i, 1);
                    break;
                }
            }
        }
    },

    //2检测是否有三飞机
    searchFeiJi(result, data) {
        let cardsNum = data.length;
        // let allArr = [];

        //把四张转移到三张
        let threeObj = {
            count: 0,
            cards: [],
        }

        //把一张放入数组
        this.putCards(threeObj, result.threeCardData, 3, 3);

        //把四张放入对子
        this.putCards(threeObj, result.fourCardData, 4, 3);

        threeObj.cards.sort(this.sortValue.bind(this));
        let allArr = this.getGruop(threeObj, 3);

        allArr.sort(this.sortBest);

        if (allArr.length > 0) {
            let bestCards = this.getOriCards(allArr[0], threeObj.cards);

            //判断单个数量
            if (cardsNum - bestCards.length >= allArr[0].length) {
                //在剩余的牌中随便拿几张
                let temp_allcards = data.slice();
                this.removeArrItem(temp_allcards, bestCards);
                temp_allcards.sort(this.sortValue.bind(this))
                for (let i = 0; i < temp_allcards.length; i++) {
                    if (i < allArr[0].length) {
                        bestCards.push(temp_allcards[i]);
                    }
                }
            }
            return bestCards;
        }
        return [];
    },

    //删掉数组中某个数组的元素
    removeArrItem(arr, removeArr) {
        for (let i = 0; i < removeArr.length; i++) {
            arr.splice(arr.indexOf(removeArr[i]), 1);
        }
    },
    sortBest(a, b) {
        return b.length - a.length;
    },
    sortValue(a, b) {
        return this.getLogicValue(a) - this.getLogicValue(b);
    },
    getOriCards: function (bestCards, allcards) {
        let newArr = [];
        for (let i = 0; i < allcards.length; i++) {
            if (bestCards.indexOf(this.getLogicValue(allcards[i])) != -1) {
                newArr.push(allcards[i]);
            }
        }
        return newArr;
    },
    //3检测是否有三代一
    searchSanDaiYi() {

    },

    //4检测是否有连对
    searchLianDui(result, data) {
        //
        let twoObject = {
            count: 0,
            cards: [],
        }

        //把一张放入数组
        this.putCards(twoObject, result.doubleCardData, 2, 2);

        this.putCards(twoObject, result.threeCardData, 3, 2);

        //把四张放入对子
        this.putCards(twoObject, result.fourCardData, 4, 2);


        twoObject.cards.sort(this.sortValue.bind(this));

        let allArr = this.getGruop(twoObject, 2);

        allArr.sort(this.sortBest);

        if (allArr.length > 0) {
            let bestCards = this.getOriCards(allArr[0], twoObject.cards);
            return bestCards;
        }
        return [];
    },

    putCards(object, data, cardTypeNum, maxNum) {
        for (let i = 0; i < data.length; i++) {
            if (i % cardTypeNum < maxNum) {
                object.count++;
                object.cards.push(data[i]);
            }
        }
    },

    getGruop(object, type) {
        let group = [];
        if (object.count > 3) {
            let arr = [];
            for (let i = type; i < object.count; i += type) {
                if (this.getLogicValue(object.cards[i]) - this.getLogicValue(object.cards[i - type]) == 1) {
                    if (i == type) arr.push(this.getLogicValue(object.cards[i - type]));
                    arr.push(this.getLogicValue(object.cards[i]));
                } else {
                    if (arr.length == 0) {
                        arr.push(this.getLogicValue(object.cards[i - type]));
                    }
                    group.push(arr.slice());
                    arr = [];
                    arr.push(this.getLogicValue(object.cards[i]));
                }
            }
            group.push(arr.slice());
        }
        if (type == 3 && object.count == 3) {
            let arr = [];
            arr.push(this.getLogicValue(object.cards[0]));
            group.push(arr.slice());
        }
        return group;
    },
    //5检测是否有顺子
    searchShunZi(result, data) {
        //
        let oneObject = {
            count: 0,
            cards: [],
        }

        //把一张放入数组
        this.putCards(oneObject, result.singleCardData, 1, 1);

        //把四张放入对子
        this.putCards(oneObject, result.fourCardData, 4, 1);

        //把三张放入对子
        this.putCards(oneObject, result.threeCardData, 3, 1);

        //把两张放入对子
        this.putCards(oneObject, result.doubleCardData, 2, 1);

        oneObject.cards.sort(this.sortValue.bind(this));

        let allArr = this.getGruop(oneObject, 1);

        allArr.sort(this.sortBest);

        if (allArr.length > 0 && allArr[0].length >= 5) {
            let bestCards = this.getOriCards(allArr[0], oneObject.cards);
            return bestCards;
        }
        return [];

    },
    searchBestCard(result, data) {
        let bestcards = [];

        let cardsFeiJi = this.searchFeiJi(result, data);
        if (cardsFeiJi.length > bestcards.length) bestcards = cardsFeiJi

        let cardsLianDui = this.searchLianDui(result, data);
        if (cardsLianDui.length > bestcards.length) bestcards = cardsLianDui

        let cardsShunZi = this.searchShunZi(result, data);
        if (cardsShunZi.length > bestcards.length) bestcards = cardsShunZi

        return bestcards;
    }
});
