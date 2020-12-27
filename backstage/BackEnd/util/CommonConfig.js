var OperatorType = {
    Login: 1, //登录
    GetDictype: 2, //获取字典类型
    LogManager: 3, //获取日记类型
}

var ErrorCode = {
    Success: 20000,
    UsernameError: 300,
    PasswordError: 301,
    FindUserInfoError: 302,
    FindOrderDetailsError: 303,
    UserInfoNotFound: 304,
    UpdateDetailsError: 305,
    FindSumCostError: 306,
    UserNameHasExist: 307,
    AddProductError: 308,
    UpdateProductError: 309,
    DeleteProductError: 310,
    ProductNotFound: 311,
    ProductHasFound: 312,
    CommonError: 313,
}

var ErrorCodeMsg = {
    '20000': '处理成功',
    '300': '用户名输入错误',
    '301': '密码输入错误',
    '302': '用户信息查找错误',
    '303': '获取订单详情错误',
    '304': '用户信息不存在',
    '305': '更新订单失败',
    '306': '查询总消费金额失败',
    '307': '用户名已被注册',
    '308': '产品添加错误',
    '309': '产品更新错误',
    '310': '产品删除错误',
    '311': '产品未配置',
    '312': '产品已配置',
    '313': '未知错误',
}
exports.ErrorCodeMsg = ErrorCodeMsg;
exports.ErrorCode = ErrorCode;