var m_resultData = require('../../util/ResultDataUtils');
var Utils = require('../../util/Utils');
var m_httpUtils = require('../../util/HttpUtils');
var fs = require('fs');
var fd = require("formidable"); //载入 formidable
var compressing = require('compressing');
var m_db = require('./DataBaseMgr');
var m_db_userInfo = require('../UserInfomation/DataBaseMgr');
var CodeConfig = require('../../util/CommonConfig');

//获取订单消费总额
exports.getOrderCostSumByDate = function(req, res) {
    if (req.url == '/getOrderCostSumByDate') {
        var tagName = "getOrderCostSumByDate";
        m_httpUtils.post_receive(req, function(recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;
            if (recvData['date']) sql_obj['CreateTime'] = Utils.toSqlString(recvData['date']);

            sql_obj['pageSize'] = 10;
            sql_obj['page'] = 1;
            if (recvData['limit']) sql_obj['pageSize'] = recvData['limit'];
            if (recvData['page']) sql_obj['page'] = recvData['page'];
            sql_obj['startRow'] = (sql_obj['page'] - 1) * sql_obj['pageSize'];
            m_db.find_consume_sum_count(sql_obj, function(countData) {
                var totalMoney = countData[0]['sum(UO_Money)'];
                res_data['totalMoney'] = totalMoney;
                packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            }, function() {
                packageData = m_resultData.create(CodeConfig.ErrorCode.FindSumCostError, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            })
        }, tagName);
    }
}

//查询用户总人数
exports.getUserSumByDate = function(req, res) {
    if (req.url == '/getUserSumByDate') {
        var tagName = "getUserSumByDate";
        m_httpUtils.post_receive(req, function(recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;
            if (recvData['date']) sql_obj['CreateTime'] = Utils.toSqlString(recvData['date']);

            sql_obj['pageSize'] = 10;
            sql_obj['page'] = 1;
            if (recvData['limit']) sql_obj['pageSize'] = recvData['limit'];
            if (recvData['page']) sql_obj['page'] = recvData['page'];
            sql_obj['startRow'] = (sql_obj['page'] - 1) * sql_obj['pageSize'];
            m_db.find_user_sum_count(sql_obj, function(countData) {
                var totalUser = countData[0]['count(*)'];
                res_data['totalUser'] = totalUser;
                packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            }, function() {
                packageData = m_resultData.create(CodeConfig.ErrorCode.FindSumCostError, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            })
        }, tagName);
    }
}