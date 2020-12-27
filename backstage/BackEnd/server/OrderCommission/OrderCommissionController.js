var m_resultData = require('../../util/ResultDataUtils');
var Utils = require('../../util/Utils');
var m_httpUtils = require('../../util/HttpUtils');
var fs = require('fs');
var fd = require("formidable"); //载入 formidable
var compressing = require('compressing');
var m_db = require('./DataBaseMgr');
var CodeConfig = require('../../util/CommonConfig');

//获得佣金列表
exports.getCommissionList = function(req, res) {
    if (req.url == '/getCommissionList') {
        var tagName = "getCommissionList";
        m_httpUtils.post_receive(req, function(recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;
            if (recvData['userName']) sql_obj['UA_Name'] = Utils.toSqlString(recvData['userName']);
            if (recvData['orderId']) sql_obj['UO_ID'] = recvData['orderId'];
            if (recvData['userId']) sql_obj['UI_ID'] = recvData['userId'];
            if (recvData['commissionId']) sql_obj['UO_ID'] = recvData['commissionId'];


            Utils.packageLimitPage(sql_obj, recvData);
            m_db.find_commission_list(sql_obj, function(data) {
                res_data = data;
                packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            }, function() {
                packageData = m_resultData.create(CodeConfig.ErrorCode.CommonError, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            });

        }, tagName);
    }
}

//获取订单列表
exports.getOrderDetailList = function(req, res) {
    if (req.url == '/getOrderDetailList') {
        var tagName = "getOrderDetailList";
        m_httpUtils.post_receive(req, function(recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;
            if (recvData['userName']) sql_obj['UA_Name'] = Utils.toSqlString(recvData['userName']);
            if (recvData['orderId']) sql_obj['UO_ID'] = recvData['orderId'];

            Utils.packageLimitPage(sql_obj, recvData);
            m_db.find_order_details(sql_obj, function(data) {
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
            if (recvData['userName']) sql_obj['UA_Name'] = Utils.toSqlString(recvData['userName']);

            //查询该用户是否存在
            m_db.find_user_info(sql_obj, function(data) {
                if (recvData['productName']) sql_obj['PL_Name'] = Utils.toSqlString(recvData['productName']);
                if (recvData['number']) sql_obj['UO_Number'] = recvData['number'];
                sql_obj["CreateTime"] = 'NOW()';
                sql_obj["UpdateTime"] = 'NOW()';
                if (data.length != 0) {
                    //获取商品信息
                    var product_sql = {};
                    if (recvData['productName']) product_sql['PL_Name'] = Utils.toSqlString(recvData['productName']);
                    m_db.find_product(product_sql, function(product_data) {
                        if (product_data.length != 0) {
                            //添加订单数据
                            var add_order_sql = {};
                            add_order_sql = Utils.copyObject(sql_obj);
                            add_order_sql["UO_Price"] = product_data[0]["PL_Price"];
                            add_order_sql["UO_Money"] = product_data[0]["PL_Price"] * parseInt(recvData['number']);
                            m_db.add_order_details([add_order_sql], function(order_data) {
                                res_data["orderId"] = order_data.insertId;
                                packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                                m_httpUtils.post_response(res, packageData, tag);

                                //获取用户的上两级
                                var parent_user_sql = {};
                                parent_user_sql = Utils.copyObject(sql_obj);
                                m_db.find_parent_user(parent_user_sql, function(parent_userdata) {
                                    if (parent_userdata.length > 0) {
                                        var commissionArr = [];
                                        var commissionMoney = parseInt(recvData['number']) * product_data[0]["PL_Price"];
                                        var public_parent_sql = {};
                                        public_parent_sql["UC_CostMoeny"] = commissionMoney;
                                        public_parent_sql["UO_ID"] = order_data.insertId;
                                        public_parent_sql["CreateTime"] = 'NOW()';
                                        public_parent_sql["UpdateTime"] = 'NOW()';

                                        if (parent_userdata[0].parentId) {
                                            var parent_sql_1 = Utils.copyObject(public_parent_sql);
                                            parent_sql_1["UI_ID"] = parent_userdata[0].parentId;
                                            parent_sql_1["UL_Ratio"] = product_data[0].PL_Ratio_One;
                                            parent_sql_1["UC_Type"] = 1;
                                            parent_sql_1["UC_Commission"] = commissionMoney * product_data[0].PL_Ratio_One / 100;
                                            commissionArr.push(parent_sql_1);
                                        }
                                        if (parent_userdata[0].pparentId) {
                                            var parent_sql_2 = Utils.copyObject(public_parent_sql);
                                            parent_sql_2["UI_ID"] = parent_userdata[0].pparentId;
                                            parent_sql_2["UL_Ratio"] = product_data[0].PL_Ratio_Two;
                                            parent_sql_2["UC_Type"] = 2;
                                            parent_sql_2["UC_Commission"] = commissionMoney * product_data[0].PL_Ratio_Two / 100;
                                            commissionArr.push(parent_sql_2);
                                        }

                                        m_db.add_commission_order(commissionArr, function() {

                                        });
                                    }
                                });
                            }, function() {
                                packageData = m_resultData.create(CodeConfig.ErrorCode.FindOrderDetailsError, res_data);
                                m_httpUtils.post_response(res, packageData, tag);
                            });
                        } else {
                            packageData = m_resultData.create(CodeConfig.ErrorCode.ProductNotFound, res_data);
                            m_httpUtils.post_response(res, packageData, tag);
                        }
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