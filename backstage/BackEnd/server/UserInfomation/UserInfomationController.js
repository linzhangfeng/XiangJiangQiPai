var m_resultData = require('../../util/ResultDataUtils');
var Utils = require('../../util/Utils');
var m_httpUtils = require('../../util/HttpUtils');
var fs = require('fs');
var fd = require("formidable"); //载入 formidable
var compressing = require('compressing');
var m_db = require('./DataBaseMgr');
var CodeConfig = require('../../util/CommonConfig');

//获取订单列表
exports.getOrderDetailList = function(req, res) {
    if (req.url == '/getOrderDetailList') {
        var tagName = "getOrderDetailList";
        m_httpUtils.post_receive(req, function(recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;
            if (recvData['userName']) sql_obj['UI_NickName'] = Utils.toSqlString(recvData['userName']);
            if (recvData['orderId']) sql_obj['UO_ID'] = recvData['orderId'];

            sql_obj['pageSize'] = 20;
            sql_obj['page'] = 1;
            if (recvData['limit']) sql_obj['pageSize'] = recvData['limit'];
            if (recvData['page']) sql_obj['page'] = recvData['page'];
            sql_obj['startRow'] = (sql_obj['page'] - 1) * sql_obj['pageSize'];
            m_db.find_order_details_count(sql_obj, function(countData) {
                var totalCount = countData[0]['count(*)'];
                m_db.find_order_details(sql_obj, function(data) {
                    res_data['list'] = data;
                    res_data['totalCount'] = totalCount;
                    packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                    m_httpUtils.post_response(res, packageData, tag);
                }, function() {
                    packageData = m_resultData.create(CodeConfig.ErrorCode.FindOrderDetailsError, res_data);
                    m_httpUtils.post_response(res, packageData, tag);
                });
            })
        }, tagName);
    }
}

//订单修改
exports.updateOrderDetail = function(req, res) {
    var tagName = "updateOrderDetail";
    if (req.url == '/updateOrderDetail') {
        m_httpUtils.post_receive(req, function(recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;
            if (recvData['money']) sql_obj['UO_Money'] = recvData['money'];
            if (recvData['orderId']) sql_obj['UO_ID'] = recvData['orderId'];
            sql_obj['UpdateTime'] = 'NOW()';
            m_db.update_order_details([sql_obj], function(data) {
                res_data = data;
                packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            }, function() {
                packageData = m_resultData.create(CodeConfig.ErrorCode.FindOrderDetailsError, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            });
        }, tagName);
    }
}

//订单新增
exports.addOrderDetail = function(req, res) {
    if (req.url == '/addOrderDetail') {
        var tagName = "addOrderDetail";
        m_httpUtils.post_receive(req, function(recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;
            if (recvData['userName']) sql_obj['UI_NickName'] = Utils.toSqlString(recvData['userName']);

            //查询该用户是否存在
            m_db.find_user_info(sql_obj, function(data) {
                if (recvData['money']) sql_obj['UO_Money'] = recvData['money'];
                sql_obj["CreateTime"] = 'NOW()';
                sql_obj["UpdateTime"] = 'NOW()';
                if (data.length != 0) {
                    //添加订单数据
                    m_db.add_order_details([sql_obj], function(data) {
                        res_data = data;
                        packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                        m_httpUtils.post_response(res, packageData, tag);
                    }, function() {
                        packageData = m_resultData.create(CodeConfig.ErrorCode.FindOrderDetailsError, res_data);
                        m_httpUtils.post_response(res, packageData, tag);
                    });
                } else {
                    res_data['error'] = recvData['userName'] + "不存在";
                    packageData = m_resultData.create(CodeConfig.ErrorCode.UserInfoNotFound, res_data);
                    m_httpUtils.post_response(res, packageData, tag);
                }
            }, function() {
                packageData = m_resultData.create(CodeConfig.ErrorCode.UpdateDetailsError, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            });
        }, tagName);
    }
}

//删除订单
exports.deleteOrderDetail = function(req, res) {
    if (req.url == '/deleteOrderDetail') {
        var tagName = "deleteOrderDetail";
        m_httpUtils.post_receive(req, function(recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;
            if (recvData['orderId']) sql_obj['UO_ID'] = recvData['orderId'];
            sql_obj['UpdateTime'] = 'NOW()';
            sql_obj['UO_State'] = 1;
            m_db.update_order_details([sql_obj], function(data) {
                res_data = data;
                packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            }, function() {
                packageData = m_resultData.create(CodeConfig.ErrorCode.UpdateDetailsError, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            });
        }, tagName);
    }
}

//获取用户列表
exports.getUserList = function(req, res) {
    if (req.url == '/getUserList') {
        var tagName = "getUserList";
        m_httpUtils.post_receive(req, function(recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;
            if (recvData['userName']) sql_obj['UI_NickName'] = Utils.toSqlString(recvData['userName']);
            if (recvData['userId']) sql_obj['UI_ID'] = recvData['userId'];
            if (recvData['phone']) sql_obj['UI_Phone'] = recvData['phone'];
            if (recvData['userAccount']) sql_obj['UA_Name'] = recvData['userAccount'];
            if (recvData['childType'] == 1) {
                sql_obj['UI_ID'] = null;
                if (recvData['userId']) sql_obj['UI_ParentID'] = recvData['userId'];
            } else if (recvData['childType'] == 2) {
                sql_obj['UI_ID'] = null;
                if (recvData['userId']) sql_obj['UI_PParentID'] = recvData['userId'];
            }

            sql_obj['pageSize'] = 20;
            sql_obj['page'] = 1;
            if (recvData['limit']) sql_obj['pageSize'] = recvData['limit'];
            if (recvData['page']) sql_obj['page'] = recvData['page'];
            sql_obj['startRow'] = (sql_obj['page'] - 1) * sql_obj['pageSize'];
            m_db.find_user_info(sql_obj, function(data) {
                res_data = data;
                packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            }, function() {
                packageData = m_resultData.create(CodeConfig.ErrorCode.FindOrderDetailsError, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            });
        }, tagName);
    }
}

//用户修改
exports.updateUserInfo = function(req, res) {
    var tagName = "updateUserInfo";
    if (req.url == '/updateUserInfo') {
        m_httpUtils.post_receive(req, function(recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;
            if (recvData['userId']) sql_obj['UI_ID'] = recvData['userId'];
            if (recvData['parentUserName']) sql_obj['UA_Name'] = Utils.toSqlString(recvData['parentUserName']);
            if (recvData['phone']) sql_obj['UI_Phone'] = Utils.toSqlString(recvData['phone']);
            if (recvData['nickName']) sql_obj['UI_NickName'] = Utils.toSqlString(recvData['nickName']);
            if (recvData['money']) sql_obj['UI_Gold'] = recvData['money'];

            sql_obj['UpdateTime'] = 'NOW()';
            m_db.update_user_info([sql_obj], function(data) {
                res_data = data;
                packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            }, function() {
                packageData = m_resultData.create(CodeConfig.ErrorCode.FindOrderDetailsError, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            });
        }, tagName);
    }
}

//用户修改
exports.addUser = function(req, res) {
    var tagName = "addUser";
    if (req.url == '/addUser') {
        m_httpUtils.post_receive(req, function(recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;

            if (recvData['username']) sql_obj['UA_Name'] = Utils.toSqlString(recvData['username']);
            if (recvData['password']) sql_obj['UA_Password'] = Utils.toSqlString(recvData['password']);

            //检测用户名是否被注册
            m_db.find_user_info(sql_obj, function(data) {
                if (data.length > 0) {
                    packageData = m_resultData.create(CodeConfig.ErrorCode.UserNameHasExist, res_data);
                    m_httpUtils.post_response(res, packageData, tag);
                } else {
                    //添加账户信息
                    var temp_account_object = Utils.copyObject(sql_obj);
                    temp_account_object['CreateTime'] = 'NOW()';
                    temp_account_object['UpdateTime'] = 'NOW()';
                    m_db.add_account([temp_account_object], function(accountData) {
                        //添加用户信息
                        var temp_user_object = Utils.copyObject(sql_obj);
                        if (temp_user_object['UA_Password']) temp_user_object['UA_Password'] = null;
                        if (temp_user_object['UA_Name']) {
                            temp_user_object['UI_NickName'] = temp_user_object['UA_Name'];
                            temp_user_object['UA_Name'] = null;
                        }
                        temp_user_object['UA_ID'] = accountData.insertId

                        m_db.add_user_info([temp_user_object], function(userInfoData) {
                            packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                            m_httpUtils.post_response(res, packageData, tag);
                        });
                    })
                }
            });
        }, tagName);
    }
}

//查询二级用户
exports.getChildUserList = function(req, res) {
    if (req.url == '/getChildUserList') {
        var tagName = "getChildUserList";
        m_httpUtils.post_receive(req, function(recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;
            if (recvData['userName']) sql_obj['UI_NickName'] = Utils.toSqlString(recvData['userName']);

            if (recvData['childType'] == 1) {
                if (recvData['userId']) sql_obj['UI_ParentID'] = recvData['userId'];
            } else if (recvData['childType'] == 2) {
                if (recvData['userId']) sql_obj['UI_PParentID'] = recvData['userId'];
            } else {
                if (recvData['userId']) sql_obj['UI_ID'] = recvData['userId'];
            }

            if (recvData['phone']) sql_obj['UI_Phone'] = recvData['phone'];
            if (recvData['userAccount']) sql_obj['UA_Name'] = recvData['userAccount'];

            sql_obj['pageSize'] = 20;
            sql_obj['page'] = 1;
            if (recvData['limit']) sql_obj['pageSize'] = recvData['limit'];
            if (recvData['page']) sql_obj['page'] = recvData['page'];
            sql_obj['startRow'] = (sql_obj['page'] - 1) * sql_obj['pageSize'];

            m_db.find_user_two_child_list(sql_obj, function(data) {
                res_data = data;
                packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            }, function() {
                packageData = m_resultData.create(CodeConfig.ErrorCode.FindOrderDetailsError, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            });
        }, tagName);
    }
}