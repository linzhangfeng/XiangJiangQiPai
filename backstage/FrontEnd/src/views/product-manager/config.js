var ProductStruct = {
    page: 1,
    limit: 20,
    productId: undefined, //订单Id
    productName: undefined, //产品名称
    productPrice: undefined, //产品价格
    oneRatio: undefined, //1级佣金提成
    twoRatio: undefined, //2级佣金提成 
    createtime: undefined, //创建时间
    updatetime: undefined, //更新时间
}

//拷贝结构体
function copyObject(obj) {
    var newobj = {};
    for (var attr in obj) {
        newobj[attr] = obj[attr];
    }
    return newobj;
}

export function getListData() {
    return listData;
}

export function getProductStruct() {
    return copyObject(ProductStruct);
}

export function packageProductData(data) {
    var orderDetailsArr = [];
    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        var packageData = copyObject(ProductStruct);
        packageData.productId = obj['PL_ID'];
        packageData.productName = obj['PL_Name'];
        packageData.productPrice = obj['PL_Price'] / 100;
        packageData.oneRatio = obj['PL_Ratio_One'];
        packageData.twoRatio = obj['PL_Ratio_Two'];
        packageData.updatetime = new Date(obj['UpdateTime']);
        packageData.createtime = new Date(obj['CreateTime']);
        orderDetailsArr.push(packageData);
    }
    return orderDetailsArr;
}