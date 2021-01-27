
const mask = {
    //数值掩码
    LOGIC_MASK_COLOR: 0xF0,                     //花色掩码
    LOGIC_MASK_VALUE: 0x0F,                     //数值掩码
};

window.DDZLogic = {
    CT_ERROR: 0, //  错误类型
    CT_SINGLE: 1, //  单牌
    CT_DOUBLE: 2, //  对子
    CT_THREE: 3, //  三条
    CT_SINGLE_LINE: 4, //  顺子
    CT_DOUBLE_LINE: 5, //  连对
    CT_THREE_TAKE_SINGLE: 6, //  三带1
    CT_THREE_TAKE_DOUBLE: 7, // 3带2
    CT_THREE_LINE: 8, //  飞机：三顺 
    CT_THREE_LINE_TAKE_SINGLE: 9, //  2连飞机带翅膀： 三顺+同数量一手牌。比如777888+3+6或444555666+33+77+88
    CT_THREE_LINE_TAKE_DOUBLE: 10,
    CT_THREE_THREE_LINE_TAKE: 10, //  3连飞机带翅膀： 三顺+同数量一手牌。比如777888+3+6或444555666+33+77+88
    CT_FOUR_TAKE_SINGLE: 11, //  四带二：四条+2手牌。比如AAAA+7+9或9999+33+55 
    CT_FOUR_TAKE_DOUBLE: 12, //  四带二：四条+2手牌。比如AAAA+7+9或9999+33+55
    CT_BOMB: 13, //  炸弹
    CT_ROCKET: 14, // 火箭
    CT_THREE_BOMB: 15, //三炸
    CT_Four_BOMB: 16, //四炸
    CT_KING_BOMB: 17, //王炸
    CT_SMALL_KING_BOMB: 18, //        --  癞子配小王
    CT_BIG_KING_BOMB: 19, //       --  癞子配大王
    CT_SOFT_FOUR_BOMB: 20, //       --  软四炸
    CT_HARD_FOUR_BOMB: 21, //      --  硬四炸
}

module.exports = cc.Class({

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {

    },

    getPokerAudio: function(type,card){
        if(type == DDZLogic.CT_BOMB)
            return 'poker_bomb'
        else if(type == DDZLogic.CT_THREE_LINE_TAKE_SINGLE || type == DDZLogic.CT_THREE_THREE_LINE_TAKE)
            return 'poker_three_line'
        else if(type == DDZLogic.CT_THREE_TAKE_SINGLE)
            return 'poker_three_two'
        else if(type == DDZLogic.CT_DOUBLE_LINE)
            return 'poker_double_line'
        else if(type == DDZLogic.CT_DOUBLE){
            let value = this.getLogicValue(card[0])
            return 'poker_double_' + value
        }
        else if(type == DDZLogic.CT_SINGLE_LINE)
            return 'poker_single_line'
        else if(type == DDZLogic.CT_SINGLE){
            let value = this.getLogicValue(card[0])
            return 'poker_single_' + value
        }
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
        }
        else if (value <= 2) {
            return value + 13;
        }
        else {
            return value;
        }
    },

    sortCard: function(bCardData){
        if(cc.mgr.ddzlc.getRoomType()==2)
            return bCardData
        bCardData.sort(function(a,b){
            return this.getLogicValue(b) - this.getLogicValue(a)
        }.bind(this))
        return bCardData
        //==========================================
        var bLogicValue = new Array()
        for(var i=0;i<bCardData.length;i++){
            bLogicValue[i] = this.getLogicValue(bCardData[i])
        }

        var bSorted = true;
        var bTempData;
        var bLast = bCardData.length - 1;

        do {
            bSorted = true;
            for (let i = 0; i < bLast; i++) {
                if ((bLogicValue[i] < bLogicValue[i + 1]) ||
                    ((bLogicValue[i] == bLogicValue[i + 1]) && (bCardData[i] < bCardData[i + 1]))) {
                    //交换位置
                    bTempData = bCardData[i];
                    bCardData[i] = bCardData[i + 1];
                    bCardData[i + 1] = bTempData;
                    bTempData = bLogicValue[i];
                    bLogicValue[i] = bLogicValue[i + 1];
                    bLogicValue[i + 1] = bTempData;
                    bSorted = false;
                }
            }
            bLast--;
        } while (bSorted == false);

        return bCardData
    },

    getCardType: function (data, result) {
        //data = this.sortCard(data);
        let count = data.length

        if (count == 0)
            return DDZLogic.CT_ERROR
        else if (count == 1)
            return DDZLogic.CT_SINGLE
        else if (count == 2) {
            if (data[0] == 0x4f && data[1] == 0x4e) {
                return DDZLogic.CT_ROCKET;
            }
            else if (this.getLogicValue(data[0]) == this.getLogicValue(data[1]))
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
            if (result.fourCount == 1 && result.singleCount == 2 && count == 6)
                return DDZLogic.CT_FOUR_TAKE_SINGLE
            if (result.fourCount == 1 && result.doubleCount == 2 && count == 8)
                return DDZLogic.CT_FOUR_TAKE_DOUBLE

            return DDZLogic.CT_ERROR
        }
        if (result.threeCount > 0) {
            // 三条
            if (result.threeCount == 1 && count == 3) {
                return DDZLogic.CT_THREE;
            }
            // 三带一
            if (result.threeCount == 1 && result.singleCount == 1 && count == 4) {
                return DDZLogic.CT_THREE_TAKE_SINGLE;
            }

            // 三带一对
            if (result.threeCount == 1 && result.doubleCount == 1 && count == 5) {
                return DDZLogic.CT_THREE_TAKE_DOUBLE;
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
                return DDZLogic.CT_THREE_LINE_TAKE_SINGLE;
            }
            if (result.threeCount * 5 == count && result.threeCount == result.doubleCount) {
                return DDZLogic.CT_THREE_LINE_TAKE_DOUBLE;
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

    getCardType_lichuan: function (data) {
        //data = this.sortCard(data);
        let count = data.length
        let result = this.analyseCard(data, true);
        if (count == 0)
            return DDZLogic.CT_ERROR
        else if (count == 1)
            return DDZLogic.CT_SINGLE
        else if (count == 2) {
            if (data[0] == 0x4f && data[1] == 0x4e) {
                return DDZLogic.CT_KING_BOMB;
            }
            else if (this.getlaizi_count(data)==1 && data[1] == 0x4e) {
                return DDZLogic.CT_SMALL_KING_BOMB;
            }
            else if (this.getlaizi_count(data)==1 && data[1] == 0x4f) {
                return DDZLogic.CT_BIG_KING_BOMB;
            }
            else
                return DDZLogic.CT_DOUBLE
        }
        else if(count==3){
            if(result.threeCount>0)
                return DDZLogic.CT_THREE_BOMB
            else
                return DDZLogic.CT_SINGLE_LINE 
        }
        else if(count==4){
            if(result.fourCount>0){
                if(cc.mgr.ddzlc.roomInfo.params.soft_hard_bomb){
                    if(this.getlaizi_count(data)>0)
                       return DDZLogic.CT_SOFT_FOUR_BOMB
                    else
                       return DDZLogic.CT_HARD_FOUR_BOMB
                }
                return DDZLogic.CT_Four_BOMB
            }    
            else if(this.checkTypeLine(data))
                return DDZLogic.CT_DOUBLE_LINE
            else
                return DDZLogic.CT_SINGLE_LINE 
        }
        else if(this.checkTypeLine(data))
            return DDZLogic.CT_DOUBLE_LINE
        else 
            return DDZLogic.CT_SINGLE_LINE 
    },
    
    checkTypeLine:function(data){
        for(let i=0;i<data.length-1;i++){
            if(this.getLogicValue(data[i]) != cc.mgr.ddzlc.lai_zi_card&&data[i]!=0x5e){
                if(this.getLogicValue(data[i]) == this.getLogicValue(data[i+1]))
                   return true
            }
        }
        return false
    },
    
    //如果filter为true，则每种类型，牌不会重复添加
    analyseCard: function(data,filter){
        let result = {
            fourCount       : 0,
            threeCount      : 0,
            doubleCount     : 0,
            singleCount     : 0,
            fourCardData    : [],
            threeCardData   : [],
            doubleCardData  : [],
            singleCardData  : [],
        }
        let count = data.length

        let i=0
        while(i<count){
            let sameCount = 1
            let value = this.getLogicValue(data[i])
            if(value==cc.mgr.ddzlc.lai_zi_card||data[i]==0x5e){
                i++
                continue
            }
                    
            //搜索相同牌
            for(let j=i+1;j<count;j++){
                // cc.log('-----value:'+value + '  data[j]:'+this.getLogicValue(data[j]) +  '   j:'+j)
                if(this.getLogicValue(data[j]) != value)
                    break
                sameCount += 1
            }
            if(filter?sameCount == 1 : sameCount >= 1){
                result.singleCount += 1
                result.singleCardData.push(data[i])
            }
            if(filter?sameCount == 2 : sameCount >= 2){
                result.doubleCount += 1
                result.doubleCardData.push(data[i])
                result.doubleCardData.push(data[i+1])
            }
            if(filter?sameCount == 3 : sameCount >= 3){
                result.threeCount += 1
                result.threeCardData.push(data[i])
                result.threeCardData.push(data[i+1])
                result.threeCardData.push(data[i+2])
            }
            if(filter?sameCount == 4 : sameCount >= 4){
                result.fourCount += 1
                result.fourCardData.push(data[i])
                result.fourCardData.push(data[i+1])
                result.fourCardData.push(data[i+2])
                result.fourCardData.push(data[i+3])
            }

            i += sameCount
        }
        if(cc.mgr.ddzlc.getRoomType()==2){
            let laizi_cards=[]
            for(let i=0;i<data.length;i++){
                if(this.getLogicValue(data[i]) == cc.mgr.ddzlc.lai_zi_card||data[i]==0x5e){
                    laizi_cards.push(data[i])
                }
            }
            if(laizi_cards.length>0){
                let temp = result.threeCardData
                for (let i = 0; i < result.threeCount; i++) {
                    result.fourCount += 1
                    result.fourCardData.push(temp[i * 3])
                    result.fourCardData.push(temp[i * 3 + 1])
                    result.fourCardData.push(temp[i * 3 + 2])
                    result.fourCardData.push(laizi_cards[0])
                }
                temp = result.doubleCardData
                for (let i = 0; i < result.doubleCount; i++) {
                    result.threeCount += 1
                    result.threeCardData.push(temp[i * 2])
                    result.threeCardData.push(temp[i * 2 + 1])
                    result.threeCardData.push(laizi_cards[0])
                }
                temp = result.singleCardData
                for (let i = 0; i < result.singleCount; i++) {
                    if(temp[i*1]!=0x4f&&temp[i*1]!=0x4e){
                        result.doubleCount += 1
                        result.doubleCardData.push(temp[i * 1])
                        result.doubleCardData.push(laizi_cards[0])
                    }
                }
                if(laizi_cards.length>1){
                    temp = result.doubleCardData
                    for (let i = 0; i < result.doubleCount; i++) {
                        if(temp[i * 2 + 1]!=laizi_cards[0]){
                            result.fourCount += 1
                            result.fourCardData.push(temp[i * 2])
                            result.fourCardData.push(temp[i * 2 + 1])
                            result.fourCardData.push(laizi_cards[0])
                            result.fourCardData.push(laizi_cards[1])
                        }
                    }
                    temp = result.singleCardData
                    for (let i = 0; i < result.singleCount; i++) {
                        if(temp[i*1]!=0x4f&&temp[i*1]!=0x4e){
                            result.threeCount += 1
                            result.threeCardData.push(temp[i * 1])
                            result.threeCardData.push(laizi_cards[0])
                            result.threeCardData.push(laizi_cards[1])
                        }
                    }
                    if(laizi_cards.length>2){
                        temp = result.singleCardData
                        for (let i = 0; i < result.singleCount; i++) {
                            if(temp[i*1]!=0x4f&&temp[i*1]!=0x4e){
                                result.fourCount += 1
                                result.fourCardData.push(temp[i * 1])
                                result.fourCardData.push(laizi_cards[0])
                                result.fourCardData.push(laizi_cards[1])
                                result.fourCardData.push(laizi_cards[2])
                            }
                        }
                    }
                }
            }
        }

        return result
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
        }
        else {
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
            }
            else if (cnt_out != cnt_hand) {
                return false
            }
        }
        return true
    },

    //将选的牌组成牌型(单顺)
    checkOutHandToType: function(out){
        let result = this.analyseCard(out)
        // let type = this.getCardType(out,result)
        let temp = result.singleCardData
        if(temp.length >= 5){
            let data = [temp[0]]
            let first = this.getLogicValue(temp[0])
            for(let i=1;i<temp.length;i++){
                if(this.getLogicValue(temp[i]) == first - i && this.getLogicValue(first) < 15){
                    data.push(temp[i])
                }
                else
                    break
            }
            if(data.length >= 5)
                return data
        }
        return []
    },

    isBomb: function(data){
        if(data.length != 4)
            return 0
        let value = this.getLogicValue(data[0])
        for(let i=1;i<data.length;i++){
            if(value != this.getLogicValue(data[i]))
                return 0
        }
        return value
    },

    ifContainsBobm: function(bomb,card){
        for(let i=0;i<bomb.length/4;i++){
            // cc.log('bomb:'+bomb[i*4]+ '  card:'+card+'  bomb logic:'+this.getLogicValue(bomb[i*4]) + '  card logic:'+this.getLogicValue(card))
            if(this.getLogicValue(bomb[i*4]) == this.getLogicValue(card))
                return true
        }
        return false
    },

    //利川斗地主从手牌中搜寻符合条件的牌
    getCanOut_lichuan: function (data,out,turn_type) {

        let canOut = []
        let outBomb = []
        let kingBomb=[]
        let handResult = this.analyseCard(data)
        let outResult = out
        //let outResult = this.analyseCard(out, true)
        let outType = this.getCardType_lichuan(out)
        if(turn_type&&turn_type!=outType)
            outType=turn_type
        let laizi_cards=[]
        for(let i=0;i<data.length;i++){
            if(this.getLogicValue(data[i]) == cc.mgr.ddzlc.lai_zi_card||data[i]==0x5e){
                laizi_cards.push(data[i])
            }
        }
        // cc.log('out type:::'+outType)
        if (outType == DDZLogic.CT_KING_BOMB) {
            return canOut;
        }
        else if (outType == DDZLogic.CT_Four_BOMB||outType == DDZLogic.CT_SOFT_FOUR_BOMB||outType == DDZLogic.CT_HARD_FOUR_BOMB) {
            let outValue = this.getLogicValue(out[out.length-1])
            let temp = handResult.fourCardData
            for (let i = 0; i < handResult.fourCount; i++) {
                let t_cards=[temp[i * 4], temp[i * 4 + 1], temp[i * 4 + 2], temp[i * 4 + 3]]
                if (outType == DDZLogic.CT_Four_BOMB&&this.getLogicValue(temp[i * 4]) > outValue)
                    outBomb.push(t_cards)
                else if(outType == DDZLogic.CT_SOFT_FOUR_BOMB&&((this.getlaizi_count(out)>0&&this.getLogicValue(temp[i * 4]) > outValue)||(this.getlaizi_count(t_cards)==0)))
                    outBomb.push(t_cards)
                else if(outType == DDZLogic.CT_HARD_FOUR_BOMB&&(this.getlaizi_count(t_cards)==0&&this.getLogicValue(temp[i * 4]) > outValue))
                    outBomb.push(t_cards)
            }
        }
        else if (outType == DDZLogic.CT_BIG_KING_BOMB) {
            let temp = handResult.fourCardData
            for (let i = 0; i < handResult.fourCount; i++) {
                outBomb.push([temp[i * 4], temp[i * 4 + 1], temp[i * 4 + 2], temp[i * 4 + 3]])
            }
        }
        else if (outType == DDZLogic.CT_SMALL_KING_BOMB) {
            let outValue = this.getLogicValue(out[out.length-1])
            let temp = handResult.fourCardData
            for (let i = 0; i < handResult.fourCount; i++) {
                outBomb.push([temp[i * 4], temp[i * 4 + 1], temp[i * 4 + 2], temp[i * 4 + 3]])
            }
            if(laizi_cards.length>0){
                temp = handResult.singleCardData
                for (let i = 0; i < handResult.singleCount; i++) {
                    if(temp[i]== 0x4f)
                        outBomb.push([temp[i],laizi_cards[0]])
                }
            }
        }
        else if (outType == DDZLogic.CT_THREE_BOMB) {
            let outValue = this.getLogicValue(out[out.length-1])
            let temp = handResult.threeCardData
            for (let i = 0; i < handResult.threeCount; i++) {
                if (this.getLogicValue(temp[i * 3]) > outValue)
                    outBomb.push([temp[i * 3], temp[i * 3 + 1], temp[i * 3 + 2]])
            }
            temp = handResult.fourCardData
            for (let i = 0; i < handResult.fourCount; i++) {
                outBomb.push([temp[i * 4], temp[i * 4 + 1], temp[i * 4 + 2], temp[i * 4 + 3]])
            }
            
            if(cc.mgr.ddzlc.roomInfo.params.lai_and_king&&laizi_cards.length>0){
                temp = handResult.singleCardData
                for (let i = 0; i < handResult.singleCount; i++) {
                    if(temp[i]== 0x4e||temp[i]== 0x4f)
                    outBomb.push([temp[i],laizi_cards[0]])
                }
            }
        }
        else { //手牌炸弹
            let temp = handResult.threeCardData
            for (let i = 0; i < handResult.threeCount; i++) {
                outBomb.push([temp[i * 3], temp[i * 3 + 1], temp[i * 3 + 2]])
            }
            temp = handResult.fourCardData
            for (let i = 0; i < handResult.fourCount; i++) {
                outBomb.push([temp[i * 4], temp[i * 4 + 1], temp[i * 4 + 2], temp[i * 4 + 3]])
            }

            if(cc.mgr.ddzlc.roomInfo.params.lai_and_king&&laizi_cards.length>0){
                temp = handResult.singleCardData
                for (let i = 0; i < handResult.singleCount; i++) {
                    if(temp[i]== 0x4e||temp[i]== 0x4f)
                    outBomb.push([temp[i],laizi_cards[0]])
                }
            }
        }
        // 搜索火箭
        if (outType != DDZLogic.CT_KING_BOMB) {
            for(let i=0;i<data.length;i++){
                if (data[i] == 0x4f && data[i+1] == 0x4e) {
                    kingBomb.push([data[i], data[i+1]]);
                }
            }
        }

        let handCount = data.length
        let outCount = out.length
        if (handCount < outCount) //手牌数据不足，要不起            
            return outBomb.concat(kingBomb)
        if (outType == DDZLogic.CT_DOUBLE_LINE) {
            let outValue = this.getLogicValue(out[out.length-1])
            for(let i=data.length-1;i>0;i--){
                let value=this.getLogicValue(data[i])
                if(value>outValue&&value!=15&&outValue+out.length/2<15&&value != cc.mgr.ddzlc.lai_zi_card&&data[i] != 0x5e&&data[i] != 0x4f && data[i] != 0x4e){
                    let ret=[]
                    for(let j=0;j<outCount/2;j++){
                        let ele_n=0
                        data.forEach(ele => {
                            let value_e=this.getLogicValue(ele)  
                            if(value_e==value+j&&value_e!=15&&ele_n<2&&value_e != cc.mgr.ddzlc.lai_zi_card && ele!= 0x5e&& ele!= 0x4f && ele!= 0x4e){
                                ret.push(ele)
                                ele_n++
                            }
                        })
                    }
                    if(ret.length+laizi_cards.length>=outCount){
                        if(ret.length==outCount)
                            canOut.push(ret)
                        else
                            canOut.push(ret.concat(laizi_cards.slice(0,outCount-ret.length)))
                    }   
                }
            }
        }

        if (outType == DDZLogic.CT_DOUBLE) {
            let outValue = this.getLogicValue(out[out.length-1])
            let result = this.analyseCard(data,true)

            let temp = result.doubleCardData
            let ret = [];
            for (let i = 0; i < result.doubleCount; i++) {
                if (this.getLogicValue(temp[i * 2]) > outValue) {
                    canOut.unshift([temp[i * 2], temp[i * 2 +1]])
                }
            }
        }

        if (outType == DDZLogic.CT_SINGLE_LINE) {
            let outValue = this.getLogicValue(out[out.length-1])
            for(let i=data.length-1;i>0;i--){
                let value=this.getLogicValue(data[i])
                if(value>outValue&&value!=15&&outValue+out.length<15&&value != cc.mgr.ddzlc.lai_zi_card&&data[i] != 0x5e&&data[i] != 0x4f && data[i] != 0x4e){
                    let ret=[]
                    for(let j=0;j<outCount;j++){
                        let ele_n=0
                        data.forEach(ele => {
                            let value_e=this.getLogicValue(ele) 
                            if(value_e==value+j&&value_e!=15&&ele_n<1&&value_e != cc.mgr.ddzlc.lai_zi_card && ele!= 0x5e&& ele!= 0x4f && ele!= 0x4e){
                                ret.push(ele)
                                ele_n++
                            }
                        })
                    }
                    if(ret.length+laizi_cards.length>=outCount&&ret.length>1){
                        if(ret.length==outCount)
                            canOut.push(ret)
                        else
                            canOut.push(ret.concat(laizi_cards.slice(0,outCount-ret.length)))
                    }   
                }
            }
        }
        let single=[]
        if (outType == DDZLogic.CT_SINGLE) {
            let outValue = this.getLogicValue(out[0])
            let result = this.analyseCard(data, true)
            let temp = []
            for (let i = 0; i < result.singleCardData.length; i++) {
                if (this.getLogicValue(result.singleCardData[i]) > outValue)
                    single.unshift([result.singleCardData[i]])
            }
            for (let i = 0; i < result.doubleCount; i++)
                temp = temp.concat(result.doubleCardData[i * 2])
            for (let i = 0; i < temp.length; i++) {
                if (this.getLogicValue(temp[i]) > outValue)
                    canOut.unshift([temp[i]])
            }    
        }

        canOut=this.getHashArr(canOut)
        outBomb=this.getHashArr(outBomb)
        for(var i=0;i<canOut.length-1;i++){  
            for(var j=i+1;j<canOut.length;j++){
                let xi= this.getlaizi_count(canOut[i])
                let xj=this.getlaizi_count(canOut[j])
                if(xi>xj){ 
                    var temp=canOut[i];  
                    canOut[i]=canOut[j];  
                    canOut[j]=temp;  
                }
                else if(xi==xj){
                    if(this.getLogicValue(canOut[i][0])>this.getLogicValue(canOut[j][0])){
                        var temp=canOut[i];  
                        canOut[i]=canOut[j];  
                        canOut[j]=temp;  
                    }
                }  
            }  
        }
        outBomb.reverse()
        for(var i=0;i<outBomb.length-1;i++){ 
            for(var j=i+1;j<outBomb.length;j++){  
                let xi= this.getlaizi_count(outBomb[i])
                let xj=this.getlaizi_count(outBomb[j])
                if(xi>xj){
                    var temp=outBomb[i];  
                    outBomb[i]=outBomb[j];  
                    outBomb[j]=temp;  
                }  
                else if(xi==xj){
                    if(this.getLogicValue(outBomb[i][0])>this.getLogicValue(outBomb[j][0])&&outBomb[i].length==outBomb[j].length){
                        var temp=outBomb[i];  
                        outBomb[i]=outBomb[j];  
                        outBomb[j]=temp;  
                    }
                    else if(outBomb[i].length>outBomb[j].length){
                        var temp=outBomb[i];  
                        outBomb[i]=outBomb[j];  
                        outBomb[j]=temp; 
                    }
                }  
            }  
        } 

        for(var i=0;i<canOut.length-1;i++){
            outBomb.every(ele => {
                if(canOut[i].toString()==ele.toString()){
                    canOut.splice(i,1)
                    i--
                    return false
                }
                return true
            });
        }

        for(var i=0;i<outBomb.length;i++){
            if(outBomb[i].length==3&&this.getlaizi_count(outBomb[i])==0){
                outBomb.every(ele => {
                    if(ele.length==4&&this.getlaizi_count(ele)==0&&this.getLogicValue(ele[0])==this.getLogicValue(outBomb[i][0])){
                        outBomb.splice(i,1)
                        i--
                        return false
                    }
                    return true
                })
            }
        }

        let res_temp=canOut.concat(outBomb)
        let res=[]
        for(let i = 0; i < res_temp.length; i++){  
            if(this.removeCards(data,res_temp[i],kingBomb.length))
               res.push(res_temp[i])
        }
        res=this.getHashArr(single.concat(res))
        if (kingBomb.length && !cc.mgr.ddzlc.roomInfo.params.single_king) {
            for (let i = 0; i < res.length; i++) {
                if (res[i].indexOf(0x4e) != -1 || res[i].indexOf(0x4f) != -1) {
                    res.splice(i, 1)
                    i--
                }
            }
        }
        return res.concat(kingBomb)
    },

    getlaizi_count:function(cards){
        let count=0
        for(let i = 0;i<cards.length; i++){  
            if(this.getLogicValue(cards[i]) == cc.mgr.ddzlc.lai_zi_card || cards[i]== 0x5e){  
                count++
            }
        }
        return count
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
        }

        else if (singleOrDouble == 2) {// 带双
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
        }
        else if (singleOrDouble == 2) {// 带双
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
    sortOutCard: function (cards, type) {
        if(cc.mgr.ddzlc.getRoomType()==2){
            return cards
        }
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
            case DDZLogic.CT_FOUR_TAKE_DOUBLE:
                {
                    let analyse = this.analyseCard(cards, true);
                    cards = analyse.fourCardData.slice(0);
                    cards = cards.concat(analyse.doubleCardData.slice(0));
                    cards = cards.concat(analyse.singleCardData.slice(0));
                }
                break;
        }

        return cards;
    },

    removeCards: function (hands, del,iskingbomn) {
        let res = hands.filter(function (elem) {
            return del.indexOf(elem) == -1
        })
        let count=0
        let kingcout=0
        res.forEach(ele => {
            if(this.getLogicValue(ele) == cc.mgr.ddzlc.lai_zi_card || ele== 0x5e){  
                count++
            }
            if((ele== 0x4e||ele== 0x4f)&&!cc.mgr.ddzlc.roomInfo.params.lai_and_king){  
                kingcout++
            }
        })
        if(res.length==count+kingcout&&count>0&&res.length!=0)
            return false
        return true
    },

    getHashArr:function(arr){
        let hash = {} 
        let result_out = []
        for(let i = 0; i < arr.length; i++){
            if(!hash[arr[i]]){  
                result_out.push(arr[i]);  
                hash[arr[i]] = true;  
            }
        }
        return result_out
    }

});
