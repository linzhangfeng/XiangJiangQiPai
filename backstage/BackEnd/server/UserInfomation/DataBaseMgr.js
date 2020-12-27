var m_db = require('../../util/db');
var Utils = require('../../util/Utils');
//查询所有订单信息
exports.find_order_details = function(object, success, failure) {
    var sql = 'SELECT User_OrderDetails.UO_ID,User_OrderDetails.UO_Money,User_OrderDetails.CreateTime,User_OrderDetails.UpdateTime,User_Info.UI_NickName ';
    sql += 'FROM User_OrderDetails,User_Info ';
    sql += 'where User_Info.UI_ID = User_OrderDetails.UI_ID and User_OrderDetails.UO_State = 0 ';
    if (object['UO_ID'] || object['UI_NickName'] || object['CreateTime']) {

        if (object['UI_NickName']) {
            var temp_sql = ' and User_Info.UI_NickName = ' + object['UI_NickName'];
            sql += temp_sql;
        }

        if (object['UO_ID']) {
            var temp_sql = ' and User_OrderDetails.UO_ID = ' + object['UO_ID'];
            sql += temp_sql;
        }

        if (object['CreateTime']) {
            var temp_sql = ' and date_format([CreateTime],"%Y-%m-%d") = to_days(' + object['CreateTime'] + ') ';
            sql += temp_sql;
        }
    }
    sql += ' ORDER BY User_OrderDetails.CreateTime DESC ';
    sql += ' LIMIT ' + object['startRow'] + ',' + object['pageSize'];
    m_db.query(sql, success, failure);
}

//查询订单条数
exports.find_order_details_count = function(object, success, failure) {
    var sql = 'SELECT count(*) ';
    sql += 'FROM User_OrderDetails,User_Info ';
    sql += 'where User_Info.UI_ID = User_OrderDetails.UI_ID and User_OrderDetails.UO_State = 0 ';
    m_db.query(sql, success, failure);
}

exports.find_user_info = function(objectArr, success, failure) {
    var sql = 'SELECT * FROM User_Info where ';
    sql += m_db.packageWhereSql(objectArr);
    m_db.query(sql, success, failure);
}

//新增订单信息
exports.add_order_details = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        let object = objectArr[i];
        var sql = 'INSERT INTO User_OrderDetails';

        if (object['UI_NickName']) {
            var UI_ID = '(SELECT UI_ID FROM User_Info where UI_NickName=' + object['UI_NickName'] + ')';
            object['UI_ID'] = UI_ID;
            object['UI_NickName'] = null;
        }
        sql += m_db.packageInSertSql(objectArr[i]);
        sqls.push(sql);
    }
    m_db.execute(sqls, success, failure);
}

//编辑订单信息,删除订单信息
exports.update_order_details = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        var object = objectArr[i];
        var temp_object = Utils.copyObject(object);
        temp_object['UO_ID'] = null;
        var sql = 'UPDATE User_OrderDetails SET ';
        sql = sql + m_db.packageUpdateSql(temp_object);
        sql = sql + ' WHERE UO_ID=' + object["UO_ID"];
        sqls.push(sql);
    }
    m_db.execute(sqls, success, failure);
}


//查询用户信息
exports.find_user_info = function(object, success, failure) {
    var sql = 'SELECT child.UI_Gold,child.UI_ID,User_Account.UA_Name,child.UI_Phone,child.CreateTime,child.UpdateTime,child.UI_NickName,parent.UI_NickName AS Parent_NickName,account.UA_Name AS Parent_UserName ';
    sql += 'FROM User_Account,User_Info child ';
    sql += 'Left JOIN User_Info parent ON parent.UI_ID = child.UI_ParentID ';
    if (object['UI_PParentID']) sql += 'Left JOIN User_Info pparent ON pparent.UI_ID = parent.UI_ParentID '
    sql += 'Left JOIN User_Account account ON parent.UA_ID = account.UA_ID ';
    sql += 'where User_Account.UA_ID = child.UA_ID and child.UI_State = 0 ';
    if (object['UI_ID'] || object['UI_NickName'] || object['UI_Phone'] || object['UA_Name'] || object['CreateTime'] || object['UI_ParentID'] || object['UI_PParentID']) {
        if (object['UI_NickName']) {
            var temp_sql = ' and child.UI_NickName = ' + object['UI_NickName'];
            sql += temp_sql;
        }

        if (object['UI_Phone']) {
            var temp_sql = ' and child.UI_Phone = ' + object['UI_Phone'];
            sql += temp_sql;
        }

        if (object['UI_ID']) {
            var temp_sql = ' and child.UI_ID = ' + object['UI_ID'];
            sql += temp_sql;
        }

        if (object['UA_Name']) {
            var temp_sql = ' and User_Account.UA_Name = ' + object['UA_Name'];
            sql += temp_sql;
        }


        if (object['CreateTime']) {
            var temp_sql = ' and date_format([child.CreateTime],"%Y-%m-%d") = to_days(' + object['CreateTime'] + ') ';
            sql += temp_sql;
        }

        if (object['UI_ParentID']) {
            var temp_sql = ' and parent.UI_ID = ' + object['UI_ParentID'];
            sql += temp_sql;
        }

        if (object['UI_PParentID']) {
            var temp_sql = ' and pparent.UI_ID = ' + object['UI_PParentID'];
            sql += temp_sql;
        }
    }
    if (object['startRow'] && object['pageSize']) {
        sql += ' ORDER BY child.CreateTime DESC ';
        sql += 'LIMIT ' + object['startRow'] + ',' + object['pageSize'];
    }

    m_db.query(sql, function(data) {
        var resultData = {};
        resultData['list'] = data;
        m_db.queryCount(function(count) {
            resultData['count'] = count;
            if (success) success(resultData);
        }, failure)
    }, failure);
}

exports.update_user_info = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        var object = objectArr[i];
        var temp_object = Utils.copyObject(object);
        temp_object['UI_ID'] = null;
        //通过上级用户名获取上级用户ID
        if (temp_object['UA_Name']) {
            temp_object['UI_ParentID'] = '(SELECT User_Info.UI_ID FROM (SELECT User_Info.UI_ID FROM User_Info,User_Account where User_Account.UA_ID = User_Info.UA_ID and  User_Account.UA_Name = ' + temp_object['UA_Name'] + ') t1) ';
            temp_object['UA_Name'] = null;
        }
        var sql = 'UPDATE User_Info SET ';
        sql = sql + m_db.packageUpdateSql(temp_object);
        sql = sql + ' WHERE UI_ID=' + object["UI_ID"];
        sqls.push(sql);
    }
    m_db.execute(sqls, success, failure);
}

//查询用户数量
exports.find_user_count = function(object, success, failure) {
    var sql = 'SELECT count(*) ';
    sql += 'FROM User_Account,User_Info ';
    sql += 'where User_Account.UA_ID = User_Info.UA_ID and User_Info.UI_State = 0 ';
    m_db.query(sql, success, failure);
}

//添加账户信息
exports.add_account = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        let object = objectArr[i];
        var sql = 'INSERT INTO User_Account';
        sql += m_db.packageInSertSql(object);
        sqls.push(sql);
    }
    m_db.execute(sqls, success, failure);
}

//添加用户信息
exports.add_user_info = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        let object = objectArr[i];
        var sql = 'INSERT INTO User_Info';
        sql += m_db.packageInSertSql(object);
        sqls.push(sql);
    }
    m_db.execute(sqls, success, failure);
}


//查询一级子节点
exports.find_user_child_list = function(object, success, failure) {
        var sql = 'SELECT child.UI_Gold,child.UI_ID,User_Account.UA_Name,child.UI_Phone,child.CreateTime,child.UpdateTime,child.UI_NickName,parent.UI_NickName AS Parent_NickName,account.UA_Name AS Parent_UserName ';
        sql += 'FROM User_Account,User_Info child Left JOIN User_Info parent ON parent.UI_ID = child.UI_ParentID Left JOIN User_Account account ON parent.UA_ID = account.UA_ID ';
        sql += 'where User_Account.UA_ID = child.UA_ID and child.UI_State = 0 ';
        if (object['UI_ID'] || object['UI_NickName'] || object['UI_Phone'] || object['UA_Name'] || object['CreateTime']) {
            if (object['UI_NickName']) {
                var temp_sql = ' and child.UI_NickName = ' + object['UI_NickName'];
                sql += temp_sql;
            }

            if (object['UI_Phone']) {
                var temp_sql = ' and child.UI_Phone = ' + object['UI_Phone'];
                sql += temp_sql;
            }

            if (object['UI_ID']) {
                var temp_sql = ' and child.UI_ID = ' + object['UI_ID'];
                sql += temp_sql;
            }

            if (object['UA_Name']) {
                var temp_sql = ' and User_Account.UA_Name = ' + object['UA_Name'];
                sql += temp_sql;
            }

            if (object['UI_ParentID']) {
                var temp_sql = ' and child.UI_ParentID = ' + object['UI_ParentID'];
                sql += temp_sql;
            }

            if (object['CreateTime']) {
                var temp_sql = ' and date_format([child.CreateTime],"%Y-%m-%d") = to_days(' + object['CreateTime'] + ') ';
                sql += temp_sql;
            }
        }
        if (object['startRow'] && object['pageSize']) {
            sql += ' ORDER BY child.CreateTime DESC ';
            sql += 'LIMIT ' + object['startRow'] + ',' + object['pageSize'];
        }

        m_db.query(sql, success, failure);
    }
    //查询二级子节点个数
exports.find_user_two_child_count = function(object, success, failure) {
    var sql = 'SELECT count(*)';
    sql += 'FROM User_Account,User_Info child '
    sql += 'Left JOIN User_Info parent ON parent.UI_ID = child.UI_ParentID  '
    sql += 'Left JOIN User_Info pparent ON pparent.UI_ID = parent.UI_ParentID  '
    sql += 'Left JOIN User_Account account ON parent.UA_ID = account.UA_ID ';
    sql += 'where User_Account.UA_ID = child.UA_ID and child.UI_State = 0 ';
    if (object['UI_ParentID']) {
        if (object['UI_ParentID']) {
            var temp_sql = ' and pparent.UI_ParentID = ' + object['UI_ParentID'];
            sql += temp_sql;
        }
    }

    m_db.query(sql, success, failure);
}

//查询二级子节点
exports.find_user_two_child_list = function(object, success, failure) {
    var sql = 'SELECT SQL_CALC_FOUND_ROWS child.UI_Gold,child.UI_ID,User_Account.UA_Name,child.UI_Phone,child.CreateTime,child.UpdateTime,child.UI_NickName,parent.UI_NickName AS Parent_NickName,account.UA_Name AS Parent_UserName ';
    sql += 'FROM User_Account,User_Info child '
    sql += 'Left JOIN User_Info parent ON parent.UI_ID = child.UI_ParentID  '
    if (object['UI_PParentID']) sql += 'Left JOIN User_Info pparent ON pparent.UI_ID = parent.UI_ParentID '
    sql += 'Left JOIN User_Account account ON parent.UA_ID = account.UA_ID ';
    sql += 'where User_Account.UA_ID = child.UA_ID and child.UI_State = 0 ';
    if (object['UI_ID'] || object['UI_NickName'] || object['UI_Phone'] || object['UA_Name'] || object['CreateTime'] || object['UI_ParentID'] || object['UI_PParentID']) {
        if (object['UI_NickName']) {
            var temp_sql = ' and child.UI_NickName = ' + object['UI_NickName'];
            sql += temp_sql;
        }

        if (object['UI_Phone']) {
            var temp_sql = ' and child.UI_Phone = ' + object['UI_Phone'];
            sql += temp_sql;
        }

        if (object['UI_ID']) {
            var temp_sql = ' and child.UI_ID = ' + object['UI_ID'];
            sql += temp_sql;
        }

        if (object['UA_Name']) {
            var temp_sql = ' and User_Account.UA_Name = ' + object['UA_Name'];
            sql += temp_sql;
        }

        if (object['UI_ParentID']) {
            var temp_sql = ' and parent.UI_ID = ' + object['UI_ParentID'];
            sql += temp_sql;
        }

        if (object['UI_PParentID']) {
            var temp_sql = ' and pparent.UI_ID = ' + object['UI_PParentID'];
            sql += temp_sql;
        }

        if (object['CreateTime']) {
            var temp_sql = ' and date_format([child.CreateTime],"%Y-%m-%d") = to_days(' + object['CreateTime'] + ') ';
            sql += temp_sql;
        }
    }
    if (object['startRow'] && object['pageSize']) {
        sql += ' ORDER BY child.CreateTime DESC ';
        sql += 'LIMIT ' + object['startRow'] + ',' + object['pageSize'];
    }

    m_db.query(sql, function(data) {
        var resultData = {};
        resultData['list'] = data;
        m_db.queryCount(function(count) {
            resultData['count'] = count;
            if (success) success(resultData);
        }, failure)
    }, failure);
}