var m_db = require('../../util/db');
var Utils = require('../../util/Utils');

//查询佣金信息
exports.find_commission_list = function(object, success, failure) {
    var sql = 'SELECT SQL_CALC_FOUND_ROWS commission_list.UC_ID,commission_list.UO_ID,commission_list.UL_Ratio,commission_list.UC_Type,';
    sql += ' commission_list.UI_ID,commission_list.UC_Commission,commission_list.UC_CostMoeny,';
    sql += ' commission_list.CreateTime,commission_list.UpdateTime,';
    sql += ' account.UA_Name userName ';
    sql += ' FROM User_Commission commission_list ';
    sql += ' Left JOIN User_Info userInfo ON userInfo.UI_ID = commission_list.UI_ID  ';
    sql += ' Left JOIN User_Account account ON userInfo.UA_ID = account.UA_ID  ';

    let w_sql_arr = [];
    if (object['UA_Name']) {
        var temp_sql = ' account.UA_Name = ' + object['UA_Name'];
        w_sql_arr.push(temp_sql);
    }

    if (object['UI_ID']) {
        var temp_sql = ' commission_list.UI_ID = ' + object['UI_ID'];
        w_sql_arr.push(temp_sql);
    }

    if (object['UO_ID']) {
        var temp_sql = ' commission_list.UO_ID = ' + object['UO_ID'];
        w_sql_arr.push(temp_sql);
    }

    if (object['UO_ID']) {
        var temp_sql = 'commission_list.UO_ID = ' + object['UO_ID'];
        w_sql_arr.push(temp_sql);
    }

    if (object['CreateTime']) {
        var temp_sql = 'date_format([commission_list.CreateTime],"%Y-%m-%d") = to_days(' + object['CreateTime'] + ') ';
        w_sql_arr.push(temp_sql);
    }

    sql += m_db.packageWhereSqlByArr(w_sql_arr);

    sql += ' ORDER BY commission_list.CreateTime DESC ';
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

//查询所有订单信息
exports.find_order_details = function(object, success, failure) {
    var sql = 'SELECT SQL_CALC_FOUND_ROWS order_list.UO_ID,order_list.UO_Money,order_list.UO_Price,order_list.UO_Number,';
    sql += ' order_list.CreateTime,order_list.UpdateTime,';
    sql += ' account.UA_Name userName,';
    sql += ' product.PL_Name productName';
    sql += ' FROM User_OrderDetails order_list ';
    sql += ' Left JOIN User_Info userInfo ON userInfo.UI_ID = order_list.UI_ID  ';
    sql += ' Left JOIN User_Account account ON userInfo.UA_ID = account.UA_ID  ';
    sql += ' Left JOIN Product_List product ON product.PL_ID = order_list.PL_ID  ';
    sql += ' where order_list.UO_State = 0 ';

    if (object['UA_Name']) {
        var temp_sql = ' and account.UA_Name = ' + object['UA_Name'];
        sql += temp_sql;
    }

    if (object['UO_ID']) {
        var temp_sql = ' and order_list.UO_ID = ' + object['UO_ID'];
        sql += temp_sql;
    }

    if (object['CreateTime']) {
        var temp_sql = ' and date_format([order_list.CreateTime],"%Y-%m-%d") = to_days(' + object['CreateTime'] + ') ';
        sql += temp_sql;
    }

    sql += ' ORDER BY order_list.CreateTime DESC ';
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

//查询订单条数
exports.find_order_details_count = function(object, success, failure) {
    var sql = 'SELECT count(*) ';
    sql += 'FROM User_OrderDetails,User_Info ';
    sql += 'where User_Info.UI_ID = User_OrderDetails.UI_ID and User_OrderDetails.UO_State = 0 ';
    m_db.query(sql, success, failure);
}

exports.find_user_info = function(objectArr, success, failure) {
    var sql = 'SELECT * FROM User_Account where ';
    sql += m_db.packageWhereSql(objectArr);
    m_db.query(sql, success, failure);
}

//新增订单信息
exports.add_order_details = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        let object = objectArr[i];
        var sql = 'INSERT INTO User_OrderDetails';

        if (object['UA_Name']) {
            var UI_ID = '('
            UI_ID += ' SELECT UI_ID FROM User_Info userInfo ';
            UI_ID += ' Left JOIN User_Account account ON userInfo.UA_ID = account.UA_ID ';
            UI_ID += ' where account.UA_Name= ' + object['UA_Name'];
            UI_ID += ')';
            object['UI_ID'] = UI_ID;
            object['UA_Name'] = null;
        }

        if (object['PL_Name']) {
            var UI_ID = '(SELECT PL_ID FROM Product_List where PL_Name=' + object['PL_Name'] + ')';
            object['PL_ID'] = UI_ID;
            object['PL_Name'] = null;
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

//添加订单佣金
exports.add_commission_order = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        let object = objectArr[i];
        var sql1 = 'INSERT INTO User_Commission';
        sql1 += m_db.packageInSertSql(objectArr[i]);
        sqls.push(sql1);

        var sql2 = 'UPDATE User_Info SET ';
        sql2 += ' UI_Gold = UI_Gold+' + object['UC_Commission'];
        sql2 += ' WHERE UI_ID=' + object["UI_ID"];
        sqls.push(sql2);
    }
    console.log("lin=add_commission_order:" + JSON.stringify(sqls));
    m_db.execute(sqls, success, failure);
}

//更新用户佣金
exports.update_user_commission = function(objectArr, success, failure) {
    var sqls = [];
    for (var i = 0; i < objectArr.length; i++) {
        var object = objectArr[i];
        var temp_object = Utils.copyObject(object);
        temp_object['UO_ID'] = null;
        var sql = 'UPDATE User_Info SET ';
        sql += ' UI_Gold = UI_Gold+' + temp_object['UC_Commission'];
        sql += ' WHERE UI_ID=' + object["UI_ID"];
        sqls.push(sql);
    }
    m_db.execute(sqls, success, failure);
}

//获取用户上两级信息
exports.find_parent_user = function(object, success, failure) {
    var sql = ' SELECT userInfo.UI_ParentID parentId,pUserInfo.UI_ParentID pparentId ';
    sql += ' FROM User_Info userInfo ';
    sql += ' LEFT JOIN User_Info pUserInfo ON pUserInfo.UI_ID = userInfo.UI_ParentID ';
    sql += ' where ';

    if (object['UA_Name']) {
        var UI_ID = '('
        UI_ID += ' SELECT UI_ID FROM User_Info userInfo ';
        UI_ID += ' Left JOIN User_Account account ON userInfo.UA_ID = account.UA_ID ';
        UI_ID += ' where account.UA_Name= ' + object['UA_Name'];
        UI_ID += ')';
        object['UI_ID'] = UI_ID;
        object['UA_Name'] = null;
        sql += 'userInfo.UI_ID = ' + UI_ID
    }

    m_db.query(sql, success, failure);
}

//获取商品信息
exports.find_product = function(objectr, success, failure) {
    var sql = 'SELECT * ';
    sql += ' FROM Product_List ';
    sql += ' where PL_Name = ' + objectr["PL_Name"];
    m_db.query(sql, success, failure);
}