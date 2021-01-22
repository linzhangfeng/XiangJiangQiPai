var OrderStruct = {
  orderId: 0, // 订单Id
  userName: '', // 用户名称
  createtime: '', // 创建时间
  updatetime: '', // 更新时间
  money: 0 // 消费
}

var UserInfoStruct = {
  userId: 0, // 订单Id
  userName: '', // 用户名称
  userAccount: '', // 用户账号
  phone: '', // 用户金额
  createtime: '', // 创建时间
  updatetime: '', // 更新时间
  money: 0 // 消费
}

//拷贝结构体
function copyObject(obj) {
    var newobj = {};
    for (var attr in obj) {
        newobj[attr] = obj[attr];
    }
    return newobj;
}

export function packageOrderDetailsData(data) {
  var orderDetailsArr = []
  for (var i = 0; i < data.length; i++) {
    var obj = data[i]
    var packageData = copyObject(OrderStruct)
    packageData.orderId = obj['UO_ID']
    packageData.userName = obj['UI_Name']
    packageData.money = obj['UO_Money']
    packageData.updatetime = new Date(obj['UpdateTime'])
    packageData.createtime = new Date(obj['CreateTime'])
    console.log('lin=packageOrderDetailsData:', packageData.createtime)
    orderDetailsArr.push(packageData)
  }
  return orderDetailsArr
}

export function packageUserInfoData(data) {
  var userInfoArr = []
  for (var i = 0; i < data.length; i++) {
    var obj = data[i]
    var packageData = copyObject(UserInfoStruct)
    packageData.userId = obj['UI_ID']
    packageData.userName = obj['UI_Name']
    packageData.money = obj['UI_Gold']
    packageData.userAccount = obj['UA_Name']
    packageData.updatetime = new Date(obj['UpdateTime'])
    packageData.createtime = new Date(obj['CreateTime'])
    console.log('lin=packageOrderDetailsData:', packageData.createtime)
    userInfoArr.push(packageData)
  }
  return userInfoArr
}
