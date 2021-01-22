var m_pool = null;
var m_mysql = require("mysql");
var Utils = require("./Utils");
exports.init = function(config) {
    m_pool = m_mysql.createPool({
        host: config.HOST,
        user: config.USER,
        password: config.PSWD,
        database: config.DB,
        port: config.PORT,
        multipleStatements: true
    });
};

function generateId() {
    var Id = "";
    for (var i = 0; i < 6; ++i) {
        if (i > 0) {
            Id += Math.floor(Math.random() * 10);
        } else {
            Id += Math.floor(Math.random() * 9) + 1;
        }
    }
    return Id;
}

exports.execute = function(sqls, success, failure) {
    var sql = Utils.formatSql(sqls);
    console.log("lin=execute=sql:" + sql);
    if (sqls.length == 0) return;
    m_pool.getConnection(function(err, conn) {
        if (err) {
            if (err) {
                if (failure) failure(err, fields);
                throw err;
            }
        } else {
            conn.query(sql, function(qerr, vals, fields) {
                //释放连接  
                conn.release();
                //事件驱动回调  
                if (qerr) {
                    if (failure) failure(null, fields);
                    throw qerr;
                }
                if (success) success(vals, fields);
            });
        }
    });
};


exports.query = function(sql, success, failure) {
    console.log("lin=query=sql:", sql);
    m_pool.getConnection(function(err, conn) {
        if (err) {
            if (err) {
                if (failure) failure(err);
                throw err;
            }
        } else {
            conn.query(sql, function(qerr, vals, fields) {
                //释放连接  
                conn.release();
                //事件驱动回调  
                if (qerr) {
                    if (failure) failure(null, fields);
                    throw qerr;
                }
                if (success) success(vals, fields);
            });
        }
    });
};

exports.queryCount = function(success, failure) {
    var sql = 'Select FOUND_ROWS()';
    this.query(sql, function(data) {
        var count = data[0]['FOUND_ROWS()'];
        if (success) success(count);
    }, failure);
}

exports.packageInSertSql = function(object) {
    var keyStr = '(';
    var valueStr = '(';

    for (var key in object) {
        if (object[key]) {
            keyStr += key + ",";
            valueStr += object[key] + ",";
        }
    }
    keyStr = keyStr.substring(0, keyStr.lastIndexOf(','));
    valueStr = valueStr.substring(0, valueStr.lastIndexOf(','));
    var str = keyStr + ') VALUES' + valueStr + ')';
    return str;
};

exports.packageWhereSql = function(object) {
    let sql = "";
    for (var key in object) {
        if (object[key]) {
            if (sql != "") {
                sql += "and " + (key + "=" + object[key] + " ");
            } else {
                sql += (key + "=" + object[key] + " ");
            }
        }
    }
    return sql;
};

exports.packageWhereSqlByArr = function(arr) {
    let sql = "";
    if (arr.length > 0) sql += ' where '
    for (var i = 0; i < arr.length; i++) {
        if (i != 0) sql += "and";
        sql += ' ' + arr[i] + ' ';
    }
    return sql;
};

exports.packageUpdateSql = function(object) {
    let sql = "";
    for (var key in object) {
        if (object[key]) {
            sql += (key + "=" + object[key] + ",");
        }
    }
    sql = sql.substring(0, sql.lastIndexOf(','));
    return sql;
};

//数据库的所有接口只支持增删改查操作，不进行任何逻辑判读 find add update delate
exports.find_GameGategory = function(object, callback) {
    var sql = 'SELECT * FROM Sys_DicType';
    query(sql, function(rows, fields) {
        callback(rows);
    });
}

//删除 只通过ID删除
exports.delate_GameGategory = function(object, callback) {
    var DT_ID = object["DT_ID"];
    var sql = 'DELETE FROM Sys_DicType WHERE DT_ID=' + DT_ID;
    query(sql, function(rows, fields) {
        callback(rows);
    });
}

exports.update_GameGategory = function(object, callback) {
    var DT_ID = object["DT_ID"];
    var sql = "UPDATE Sys_DicType SET ";
    for (var key in object) {
        if (object[key]) {
            sql += (key + "=" + object[key] + ",");
        }
    }
    sql = sql.substring(0, sql.lastIndexOf(','));
    sql = sql + ' WHERE DT_ID=' + DT_ID;
    query(sql, function(rows, fields) {
        callback(rows);
    });
}

exports.add_GameGategory = function(object, callback) {
    var DT_ID = generateId();
    object["DT_ID"] = DT_ID;
    var sql = 'INSERT INTO Sys_DicType';
    var keyStr = '(';
    var valueStr = '(';

    for (var key in object) {
        if (object[key]) {
            keyStr += key + ",";
            valueStr += object[key] + ",";
        }
    }
    keyStr = keyStr.substring(0, keyStr.lastIndexOf(','));
    valueStr = valueStr.substring(0, valueStr.lastIndexOf(','));

    sql = sql + keyStr + ') VALUES' + valueStr + ')';
    query(sql, function(rows, fields) {
        callback(rows);
    });
}