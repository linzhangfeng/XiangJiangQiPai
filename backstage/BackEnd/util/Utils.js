//单独处理聊天数据

exports.copyObject = function(obj) {
    var newobj = {};
    for (var attr in obj) {
        newobj[attr] = obj[attr];
    }
    return newobj;
}

exports.toSqlString = function(str) {
    var sqlStr = "'" + str + "'";
    return sqlStr;
}

//包装分页功能
exports.packageLimitPage = function(sql_obj, recvData) {
    sql_obj['pageSize'] = 20;
    sql_obj['page'] = 1;
    if (recvData['limit']) sql_obj['pageSize'] = recvData['limit'];
    if (recvData['page']) sql_obj['page'] = recvData['page'];
    sql_obj['startRow'] = (sql_obj['page'] - 1) * sql_obj['pageSize'];
}

exports.formatSql = function(sqlArr) {
    var sql = '';
    for (var i = 0; i < sqlArr.length; i++) {
        sql += sqlArr[i] + ';';
    }
    return sql;
}