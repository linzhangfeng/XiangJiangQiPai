/**
 *
 * 所有跟数组相关的辅助处理函数
 *
 */

window.GArrayUtils = {
    isArray: function (ob) {
        if (typeof ob == "object" && typeof ob.length == "number")
            return true;
        return false;
    },

    //清理数组 pDstArray wDstLen
    zeroArray: function (pDstArray, wDstLen) {
        //参数校验
        cc.assert(arguments.length == 2, "ErrorArgumentsLength.ZeroArray.");
        //设置
        for (var i = 0; i < wDstLen; i++) {
            pDstArray[i] = 0;
        }
    },

    //数组拷贝
    copyArray: function (srcArray) {
        cc.assert(arguments.length == 1);
        let newByteAry = [];
        newByteAry = newByteAry.concat(srcArray);
        return newByteAry;
    },

    memset: function () {
        //不是数组
        if (!GArrayUtils.isArray(arguments[0])) {
            return;
        }

        //初始化一维数组
        if (arguments.length == 3) {
            //一维结构体
            if (typeof arguments[2] == "number") {
                //常规一维数组处理
                for (var i = 0; i < arguments[2]; i++) {
                    arguments[0][i] = arguments[1];
                }
                return;
            } else {
                ZeroArrayStruct(arguments[0], arguments[1], arguments[2]);
            }
        }

        //初始化清理二维数组
        if (arguments.length == 4) {
            if (typeof arguments[3] == "number") {
                memset2(arguments[0], arguments[1], arguments[2], arguments[3]);
            } else {
                ZeroArrayStruct2(arguments[0], arguments[1], arguments[2], arguments[3]);
            }
            return;
        }
    },
};

//数组帮助函数列表
//设置数组 szString utf8编码（自动转换为unicode码）
window.SetArrayFormUtf8 = function (pDstArray, szSrcString) {
    cc.assert(arguments.length == 2);

    //编码转换
    var pCodeAry = ToUnicode(szSrcString);

    //设置数组
    SetArray(pDstArray, pCodeAry);
};

//设置数组 值拷贝 若不传入长度，默认为来源长度
window.SetArray = function (pDstArray, pSrcArray, wSrcLength) {
    cc.assert(arguments.length >= 2);

    //编码转换
    var wMaxLen = pDstArray.length;
    var wCurLen = arguments.length == 3 ? wSrcLength : pSrcArray.length;

    //最大长度
    if (wCurLen > wMaxLen) {
        cc.assert(wCurLen < wMaxLen, "ErrorArray.SetArray.CurLen:" + wCurLen + ",MaxLen:" + wMaxLen);
    }

    //设置
    for (var i = 0; i < wCurLen; i++) {
        pDstArray[i] = pSrcArray[i];
    }
};

//清理数组 pDstArray wDstLen
window.ZeroArray = function (pDstArray, wDstLen) {
    //参数校验
    cc.assert(arguments.length == 2, "ErrorArgumentsLength.ZeroArray.");

    //设置
    for (var i = 0; i < wDstLen; i++) {
        pDstArray[i] = 0;
    }
};

//@param 0: aryDst value wDstLen
//@param 1: aryDst wDstLen struct
//@param 2: aryDst value wDstLen0 wDstLen1
//@param 3: aryDst wDstLen0 wDstLen1 struct
/* 
使用示例  
memset([], 0, len)
memset([], len, struct)
memset([], 0, len0, len1)
memset([], len0, len1, struct)
 */
window.memset = function () {
    //不是数组
    if (!IsArray(arguments[0])) {
        YQYAssertAlert(false, "memset.arguments.aryDst is not array");
        return;
    }

    //初始化一维数组
    if (arguments.length == 3) {
        //一维结构体
        if (typeof arguments[2] == "number") {
            //常规一维数组处理
            for (var i = 0; i < arguments[2]; i++) {
                arguments[0][i] = arguments[1];
            }
            return;
        } else {
            ZeroArrayStruct(arguments[0], arguments[1], arguments[2]);
        }
    }

    //初始化清理二维数组
    if (arguments.length == 4) {
        if (typeof arguments[3] == "number") {
            memset2(arguments[0], arguments[1], arguments[2], arguments[3]);
        } else {
            ZeroArrayStruct2(arguments[0], arguments[1], arguments[2], arguments[3]);
        }
        return;
    }
};


//清理二维数组 pDstArray wDstLen
window.memset2 = function (aryDst, value, wDstLen0, wDstLen1) {
    if (aryDst == undefined || value == undefined || wDstLen0 == undefined || wDstLen1 == undefined) {
        cc.assert(false, "arguments.undefined");
        return false;
    }

    //设置
    for (var i = 0; i < wDstLen0; i++) {
        aryDst[i] = [];
        for (var j = 0; j < wDstLen1; j++) {
            aryDst[i][j] = value;
        }
    }
};

//清理三维数组 pDstArray wDstLen
window.memset3 = function (aryDst, value, wDstLen0, wDstLen1, wDstLen2) {
    if (aryDst == undefined || value == undefined || wDstLen0 == undefined || wDstLen1 == undefined || wDstLen2 == undefined) {
        cc.assert(false, "arguments.undefined");
        return false;
    }

    for (var i = 0; i < wDstLen0; i++) {
        aryDst[i] = [];
        for (var j = 0; j < wDstLen1; j++) {
            aryDst[i][j] = [];
            for (var k = 0; k < wDstLen2; k++) {
                aryDst[i][j][k] = value;
            }
        }
    }
};

//清理数组 pDstArray wDstLen
window.ZeroArray2 = function (pDstArray, wArrayCount, wDstLen) {
    //参数校验
    if (pDstArray == undefined || wArrayCount == undefined || wDstLen == undefined) {
        cc.assert(false, "arguments.undefined");
        return false;
    }
    //参数校验
    cc.assert(arguments.length == 3, "ErrorArgumentsLength.ZeroArray.");

    //设置
    for (var i = 0; i < wArrayCount; i++) {
        pDstArray[i] = [];
        for (var j = 0; j < wDstLen; j++) {
            pDstArray[i][j] = 0;
        }
    }
};

//清理数组结构 pDstArray wDstLen
window.ZeroArrayStruct = function (pDstArray, wDstLen, pDstObject) {
    //校验数值
    if (wDstLen == undefined || pDstObject == undefined || pDstArray == undefined) {
        cc.assert(false, "arguments.undefined");
        return false;
    }

    if (YQYAssertAlert(pDstObject)) return false;
    if (YQYAssertAlert(arguments.length == 3)) return false;

    //设置
    for (var i = 0; i < wDstLen; i++) {
        pDstArray[i] = new pDstObject();
    }
};

//清理数组结构 pDstArray wDstLen
window.ZeroArrayStruct2 = function (pDstArray, wArrayCount, wDstLen, pDstObject) {
    //参数校验
    if (pDstArray == undefined || wArrayCount == undefined || wDstLen == undefined || pDstObject == undefined) {
        cc.assert(false, "arguments.undefined");
        return false;
    }
    if (YQYAssertAlert(pDstObject)) return false;
    if (YQYAssertAlert(arguments.length == 4)) return false;

    //设置
    for (var i = 0; i < wArrayCount; i++) {
        pDstArray[i] = [];
        for (var j = 0; j < wDstLen; j++) {
            pDstArray[i][j] = new pDstObject();
        }
    }
};

//数组拷贝
window.CopyArray = function (srcArray) {
    cc.assert(arguments.length == 1);

    var newByteAry = [];
    newByteAry = newByteAry.concat(srcArray);
    return newByteAry;
};

//二维数组拷贝
window.CopyArray2 = function (srcArray) {
    cc.assert(arguments.length == 1);

    var newByteAry = [];
    for (var i = 0; i < srcArray.length; i++) {
        newByteAry[i] = CopyArray(srcArray[i]);
    }
    // newByteAry = newByteAry.concat(srcArray);
    return newByteAry;
};


window.CopyObject = function (srcObject, objectType) {
    cc.assert(arguments.length == 2);

    var pNewObject = new objectType();
    var pProperty = Object.getOwnPropertyNames(srcObject);
    for (var i = 0; i < pProperty; i++) {
        pNewObject[pProperty[i]] = srcObject[pProperty[i]];
    }
    return pNewObject;
};

window.CopyArrayObject = function (srcObjectArray, objectType) {
    cc.assert(arguments.length == 2);

    var srcCount = srcObjectArray.length;
    var newArray = [];
    for (var i = 0; i < srcCount; i++) {
        newArray[i] = CopyObject(srcObjectArray[i], objectType);
    }

    return newArray;
};

//数据拷贝
window.CopyArrayValue = function (dstArray, srcArray) {
    cc.assert(srcArray.length <= dstArray.length);

    for (var i = 0; i < srcArray.length; i++) {
        dstArray[i] = srcArray[i];
    }
};

//数组连接 参数为可变参数
window.ConcatArray = function () {
    //字符连接拷贝
    var newAry = [];
    for (var i = 0; i < arguments.length; i++) {
        newAry = newAry.concat(arguments[i]);
    }

    return newAry;
};

//数组拷贝 弹出
window.ShiftArray = function (srcArray, start, srcLen) {
    //弹出数组一部分
    var newByteAry = srcArray.splice(start, srcLen);
    return newByteAry;
};

//数组拷贝 弹出
window.SliceArray = function (srcArray, start, srcLen) {
    //弹出数组一部分
    var newByteAry = srcArray.slice(start, start + srcLen);
    return newByteAry;
};

//数组元素包含 查找到返回索引 未找到-1
window.ContainValue = function (srcArray, value) {
    for (var i = 0; i < srcArray.length; i++)
        if (srcArray[i] == value)
            return i;
    return -1;
};

//查询索引
window.FindArrayValue = function (srcArray, value) {
    for (var i = 0; i < srcArray.length; i++)
        if (srcArray[i] == value)
            return i;
    return -1;
};
window.YQLogicArrayCount = function (srcArray) {
    var wCount = 0;
    for (var i = 0; i < srcArray.length; i++)
        if (srcArray[i] != 0)
            wCount++;
    return wCount;
};

//找到true 找不到 false
window.IsFindArrayValue = function (srcArray, value) {
    for (var i = 0; i < srcArray.length; i++)
        if (srcArray[i] == value)
            return true;
    return false;
};
//key for in遍历
window.IsKeyArrayValue = function (srcArray, value) {
    for (var key in srcArray)
        if (srcArray[key] == value)
            return true;
    return false;
};

//删除元素
window.DeleteObject = function (srcArray, pObject) {
    for (var i = 0; i < srcArray.length; i++) {
        if (srcArray[i] == pObject) {
            srcArray.splice(i, 1);
            return true;
        }
    }
    return false;
};
//删除元素
window.ArrayDeleteObject = function (srcArray, pObject) {
    for (var i = 0; i < srcArray.length; i++) {
        if (srcArray[i] == pObject) {
            srcArray.splice(i, 1);
            return true;
        }
    }
    return false;
};

//结构大小
window.sizeof = function (obj) {
    var pObject = new obj();
    return TStruct.GetDataSize(pObject);
};

//转码Unicode
window.ToUnicode = function (str) {
    var codes = [];
    var len = str.length;

    for (var i = 0; i < len; i++) {
        cc.assert(typeof str[i] == 'string', "CMD_Value.Conver.Error.str is not string");
        codes[i] = str.charCodeAt(i);
    }

    return codes;
};

//转码utf8
window.ToUtf8 = function (array) {
    var tempArray = "";
    for (var i = 0; i < array.length; i++) {
        if (array[i] == 0) break;

        if (typeof array[i] == 'number') {
            tempArray += String.fromCharCode(array[i]);
        }
    }

    return tempArray;
};


/**************************************************************************************************************************/
//数组辅助 ArrayHelp = AH
//添加数组
window.AH_SetItemByKey = function (jsArray, key, tItemData) {
    jsArray[key] = tItemData;
};
//获取元素
window.AH_GetItemByKey = function (jsArray, key) {
    return jsArray[key];
};
//生成数组对象
window.AH_AddArrayItem = function (jsArray, key, tItemData) {
    if (jsArray[key] == undefined)
        jsArray[key] = [];
    jsArray[key].push(tItemData);
};

//删除元素
window.AH_DeleteItemByKey = function (jsArray, key) {
    jsArray[key] = undefined;
    return null;
};

//数组对象
window.ArrayToggle = cc.Class({
    name: "ArrayToggle",
    properties:
        {
            array: [cc.Toggle],
        },
});

window.ArrayNode = cc.Class({
    name: "ArrayNode",
    properties:
        {
            array: [cc.Node],
        },
});

window.ArrayLabel = cc.Class({
    name: "ArrayLabel",
    properties:
        {
            array: [cc.Label],
        },
});

//按大小插入 小的在前
window.InsertObject = function (array, value) {
    if (array.length == 0) {
        array.push(value);
        return;
    }
    var isInsert = false;
    for (var i = 0; i < array.length; i++) {
        if (array[i] > value) {
            array.splice(i, 0, value);
            isInsert = true;
            return;
        }
    }

    if (!isInsert) {
        array.push(value);
        return;
    }
};

//输入是否为数字 strlen为str所需长度
window.IsNumber = function (str, strlen) {
    var n = Number(str);
    if (isNaN(n) || str.length == 0) {
        return false;
    }
    if (arguments.length == 2) {
        if (str.length != strlen) {
            return false;
        }
    }

    return true;
};


//获取数组中有效元素个数
window.GetArrInvalidNum = function (ary, data, length) {
    var num = 0;
    for (var i = 0; i < length; i++) {
        if (ary[i] != data) {
            num++;
        }
    }
    return num;
};