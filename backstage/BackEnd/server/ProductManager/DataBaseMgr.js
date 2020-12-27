var m_db = require('../../util/db');
var Utils = require('../../util/Utils');

//查找产品列表
exports.find_product_list = function(object, success, failure) {
    var sql = 'SELECT SQL_CALC_FOUND_ROWS * ';
    sql += 'FROM Product_List ';
    sql += 'where Product_List.PL_State = 0 ';
    sql += ' ORDER BY Product_List.CreateTime DESC ';
    sql += ' LIMIT ' + object['startRow'] + ',' + object['pageSize'];

    m_db.query(sql, function(data) {
        var resultData = {};
        resultData['list'] = data;
        m_db.queryCount(function(count) {
            resultData['count'] = count;
            if (success) success(resultData);
        }, failure)
    }, failure);
}

//添加产品
exports.add_product = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        let object = objectArr[i];
        var sql = 'INSERT INTO Product_List';
        sql += m_db.packageInSertSql(objectArr[i]);
        sqls.push(sql);
    }
    m_db.execute(sqls, success, failure);
}

//查询产品
exports.find_product = function(object, success, failure) {
    var sql = 'SELECT *';
    sql += 'FROM Product_List ';
    sql += 'where Product_List.PL_Name = ' + object["PL_Name"];
    m_db.query(sql, success, failure);
}


//更新产品
exports.update_product = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        var object = objectArr[i];
        var temp_object = Utils.copyObject(object);
        temp_object['PL_ID'] = null;
        var sql = 'UPDATE Product_List SET ';
        sql = sql + m_db.packageUpdateSql(temp_object);
        sql = sql + ' WHERE PL_ID=' + object["PL_ID"];
        sqls.push(sql);
    }
    m_db.execute(sqls, success, failure);
}

//查询版本名称
exports.find_versionName = function(object, success, failure) {
    var sql = 'SELECT *';
    sql += 'FROM Game_Version ';
    sql += 'where Game_Version.GV_VersionName = ' + object["GV_VersionName"];
    m_db.query(sql, success, failure);
}

//添加产品
exports.add_version = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        let object = objectArr[i];
        var sql = 'INSERT INTO Game_Version';
        sql += m_db.packageInSertSql(objectArr[i]);
        sqls.push(sql);
    }
    m_db.execute(sqls, success, failure);
}

//更新版本
exports.update_version = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        var object = objectArr[i];
        var temp_object = Utils.copyObject(object);
        temp_object['GV_ID'] = null;
        var sql = 'UPDATE Game_Version SET ';
        sql = sql + m_db.packageUpdateSql(temp_object);
        sql = sql + ' WHERE GV_ID=' + object["GV_ID"];
        sqls.push(sql);
    }
    m_db.execute(sqls, success, failure);
}

//添加产品
exports.add_version_history = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        let object = objectArr[i];
        var sql = 'INSERT INTO Game_Version_History';
        sql += m_db.packageInSertSql(objectArr[i]);
        sqls.push(sql);
    }
    m_db.execute(sqls, success, failure);
}
