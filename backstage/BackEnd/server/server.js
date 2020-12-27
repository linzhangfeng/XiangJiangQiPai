var express = require('express');
var g_dictionaryCtl = require('./controller/DictionaryController');
var g_upLoadCtl = require('./controller/UpLoadController');
var g_userInfomation = require('./UserInfomation/UserInfomationController');
var g_logManager = require('./LogManager/LogManagerController');
var g_dashboradManager = require('./dashboard/DashBoardController');
var g_login = require('./login/LoginController');
var g_ordercommission = require('./OrderCommission/OrderCommissionController');
var g_productManager = require('./ProductManager/ProductManagerController');
var app = express();

var m_config = null;
exports.start = function name(config) {
    m_config = config;
    app.listen(m_config.CLIENT_PORT);
    console.log("client service is listening on port " + m_config.CLIENT_PORT);
}
app.all("*", function(req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type,Access-Token,x-token");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200); //让options尝试请求快速结束
    else
        next();
});
app.get('/getDicType', g_dictionaryCtl.getDicType);
app.get('/operatorDicType', g_dictionaryCtl.operatorDicType);

// app.post('/hotupdateUpLoad', g_upLoadCtl.hotupdateUpLoad);
// app.post('/hotupdateCheck', g_upLoadCtl.hotupdateCheck);

//login begin
app.post('/manager_login', g_login.manager_login);
app.get('/manager_info', g_login.manager_info);
//login end

//dashboard begin
app.post('/getOrderCostSumByDate', g_dashboradManager.getOrderCostSumByDate);
app.post('/getUserSumByDate', g_dashboradManager.getUserSumByDate);
//dashboard end


//userinformation begin
// app.post('/getOrderDetailList', g_userInfomation.getOrderDetailList);
// app.post('/addOrderDetail', g_userInfomation.addOrderDetail);
app.post('/updateOrderDetail', g_userInfomation.updateOrderDetail);
app.post('/deleteOrderDetail', g_userInfomation.deleteOrderDetail);
app.post('/getUserList', g_userInfomation.getUserList);
app.post('/updateUserInfo', g_userInfomation.updateUserInfo);
app.post('/addUser', g_userInfomation.addUser);
app.post('/getChildUserList', g_userInfomation.getChildUserList);
//userinformation end

//ordercommission begin
app.post('/getOrderDetailList', g_ordercommission.getOrderDetailList);
app.post('/addOrderDetail', g_ordercommission.addOrderDetail);
app.post('/getCommissionList', g_ordercommission.getCommissionList);
//ordercommission end

//product begin
app.post('/getProductList', g_productManager.getProductList);
app.post('/addProduct', g_productManager.addProduct);
app.post('/editProduct', g_productManager.editProduct);
app.post('/removeProduct', g_productManager.removeProduct);
app.post('/hotupdateUpLoad', g_productManager.hotupdateUpLoad);
//product end

//logmanager begin
app.post('/getLogOperatorList', g_logManager.getLogOperatorList);
//logmanager end
