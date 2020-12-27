var m_db = require('../../util/db');

//查询用户数据
exports.find_user_data = function(object, success, failure) {
    var sql = 'SELECT * FROM Sys_Admin WHERE SA_Account=' + object["SA_Account"];
    m_db.query(sql, success, failure);
}

//查询所有操作日记
exports.find_log_operator = function(object, success, failure) {
    var sqls = [];
    var sql = 'SELECT * FROM Sys_OperateLog';
    sqls.push(sql);
    m_db.query(sqls, success, failure);
}

//新增操作日记
exports.add_log_operator = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        var sql = 'INSERT INTO Sys_OperateLog';
        sql = sql + m_db.packageInSertSql(object[i]);
        sqls.push(sql);
    }
    m_db.query(sqls, success, failure);
}

//删除操作日记
exports.delete_log_operator = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        var object = object[i];
        var sql = 'DELETE FROM Sys_OperateLog WHERE OL_ID=' + object["OL_ID"];
        sqls.push(sql);
    }
    m_db.query(sqls, success, failure);
}