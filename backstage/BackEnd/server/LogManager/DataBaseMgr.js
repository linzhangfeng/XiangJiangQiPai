var m_db = require('../../util/db');

//查询所有操作日记
exports.find_log_operator = function(object, success, failure) {
    var sql = 'SELECT * FROM Sys_OperateLog';
    m_db.query(sql, success, failure);
}

//新增操作日记
exports.add_log_operator = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        var sql = 'INSERT INTO Sys_OperateLog';
        sql = sql + m_db.packageInSertSql(objectArr[i]);
        sqls.push(sql);
    }
    m_db.execute(sqls, success, failure);
}

//删除操作日记
exports.delete_log_operator = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        var object = object[i];
        var sql = 'DELETE FROM Sys_OperateLog WHERE OL_ID=' + object["OL_ID"];
        sqls.push(sql);
    }
    m_db.execute(sqls, success, failure);
}