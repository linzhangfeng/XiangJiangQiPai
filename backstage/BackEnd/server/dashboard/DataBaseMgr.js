var m_db = require('../../util/db');
var Utils = require('../../util/Utils');

//今日新增总数
exports.find_user_today_add_count = function(object, success, failure) {
    var sql = 'SELECT count(*) ';
    sql += 'FROM User_Info ';
    sql += 'where User_Info.CreateTime = to_days(now()) ';
    m_db.query(sql, success, failure);
}

//今日新增数据
exports.find_userlist_today = function(object, success, failure) {
    var sql = 'SELECT count(*) ';
    sql += 'FROM User_Info ';
    sql += 'where User_Info.CreateTime = to_days(now()) ';
    m_db.query(sql, success, failure);
}


//今日消费总额
exports.find_consume_today_add_count = function(object, success, failure) {
    var sql = 'SELECT  sum(UO_Money) ';
    sql += 'FROM User_OrderDetails ';
    sql += 'where User_OrderDetails.CreateTime = to_days(now()) and User_OrderDetails.UO_State = 0 ';
    m_db.query(sql, success, failure);
}

//今日消费订单数据
exports.find_orderlist_today = function(object, success, failure) {
    var sql = 'SELECT  sum(UO_Money) ';
    sql += 'FROM User_OrderDetails ';
    sql += 'where User_OrderDetails.CreateTime = to_days(now()) and User_OrderDetails.UO_State = 0 ';
    m_db.query(sql, success, failure);
}

//用户总数量
exports.find_user_sum_count = function(object, success, failure) {
    var sql = 'SELECT count(*) ';
    sql += 'FROM User_Info ';
    if (object['CreateTime']) {
        var temp_sql = ' where to_days(CreateTime) = to_days(' + object['CreateTime'] + ') ';
        sql += temp_sql;
    }
    m_db.query(sql, success, failure);
}

//用户总消费
exports.find_consume_sum_count = function(object, success, failure) {
    var sql = 'SELECT sum(UO_Money) ';
    sql += 'FROM User_OrderDetails ';
    sql += 'where User_OrderDetails.UO_State = 0 ';
    if (object['CreateTime']) {
        var temp_sql = ' and to_days(CreateTime) = to_days(' + object['CreateTime'] + ') ';
        sql += temp_sql;
    }
    m_db.query(sql, success, failure);
}