var m_resultData = require('../../util/ResultDataUtils');
var Utils = require('../../util/Utils');
var ErrorCodeConfig = require('../../util/CommonConfig');
var m_db = require('./DataBaseMgr');
var fs = require('fs');
var m_httpUtils = require('../../util/HttpUtils');
var fd = require("formidable"); //载入 formidable
var compressing = require('compressing');


//登陆请求
exports.manager_login = function(req, res) {
    if (req.url == '/manager_login') {
        var tagName = "manager_login";
        m_httpUtils.post_receive(req, function(recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            sql_obj['SA_Account'] = Utils.toSqlString(recvData['username']);
            m_db.find_user_data(sql_obj, function(userDataArr) {
                var sendData = null;
                var userData = userDataArr[0];
                if (userData && userData['SA_Password'] == recvData['password']) {
                    res_data['token'] = userData['SA_Token'];
                    sendData = m_resultData.create(ErrorCodeConfig.ErrorCode.Success, res_data);
                } else {
                    sendData = m_resultData.create(ErrorCodeConfig.ErrorCode.UsernameError, res_data);
                }
                m_httpUtils.post_response(res, sendData, tag);
            }, function() {
                sendData = m_resultData.create(ErrorCodeConfig.ErrorCode.FindUserInfoError, res_data);
                m_httpUtils.post_response(res, sendData, tag);
            });

        }, tagName);
    }
}

exports.manager_info = function(req, res) {
    //获取管理员用户ID
    var sql_obj = {};
    var res_data = {};
    var packageData = null;
    var tagName = "manager_info";
    m_httpUtils.get_receive(req, function(recvData, tag) {
        sql_obj['SA_Token'] = Utils.toSqlString(recvData['token']);

        // var userData = userDataArr[0];
        res_data['roles'] = ['admin', 'editor'];
        res_data['introduction'] = 'introduction';
        res_data['name'] = 'name';
        res_data['avatar'] = 'avatar';
        packageData = m_resultData.create(ErrorCodeConfig.ErrorCode.Success, res_data);
        m_httpUtils.get_response(res, packageData, tag);

        // m_db.find_user_data(sql_obj, function(userDataArr) {
        //     var userData = userDataArr[0];
        //     res_data['roles'] = ['admin', 'editor'];
        //     res_data['introduction'] = 'introduction';
        //     res_data['name'] = 'name';
        //     res_data['avatar'] = 'avatar';
        //     packageData = m_resultData.create(ErrorCodeConfig.ErrorCode.Success, res_data);
        //     m_httpUtils.get_response(res, packageData, tag);
        // }, function() {
        //     packageData = m_resultData.create(ErrorCodeConfig.ErrorCode.FindUserInfoError, res_data);
        //     m_httpUtils.get_response(res, packageData, tag);
        // });
    }, tagName);
}

//获取管理员信息
// exports.manager_info = function(req, res) {
//     if (req.url == '/manager_info') {
//         var tagName = "manager_info";
//         m_httpUtils.post_receive(req, function(recvData, tag) {
//             //验证用户
//             var sql_obj = {};
//             var res_data = {};
//             sql_obj['SA_Token'] = Utils.toSqlString(recvData['username']);
//             m_db.find_user_data(sql_obj, function(userDataArr) {
//                 var sendData = null;
//                 var userData = userDataArr[0];
//                 if (userData && userData['SA_Password'] == recvData['password']) {
//                     res_data['token'] = userData['SA_Token'];
//                     sendData = m_resultData.create(ErrorCodeConfig.ErrorCode.Success, res_data);
//                 } else {
//                     sendData = m_resultData.create(ErrorCodeConfig.ErrorCode.UsernameError, res_data);
//                 }
//                 m_httpUtils.post_response(res, sendData, tag);
//             }, function() {
//                 sendData = m_resultData.create(ErrorCodeConfig.ErrorCode.FindUserInfoError, res_data);
//                 m_httpUtils.post_response(res, sendData, tag);
//             });

//         }, tagName);
//     }
// }