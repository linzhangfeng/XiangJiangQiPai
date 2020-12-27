var m_resultData = require('../../util/ResultDataUtils');
var m_db = require('../../util/db');
exports.getDicType = function(req, res) {
    //获取管理员用户ID
    var receiveData = req.query;
    var admin_id = receiveData['admin_id'];
    var sendData = {};
    m_db.find_GameGategory(null, function(data) {
        if (data) {
            console.log("lin=data=" + JSON.stringify(data));
            var arr = [];
            for (var i = 0; i < data.length; i++) {
                var obj = {};
                obj["dictype_id"] = data[i]["DT_ID"];
                obj["dictype_name"] = data[i]["DT_Name"];
                obj["dictype_createtime"] = data[i]["DT_CreateTime"];
                obj["dictype_updatetime"] = data[i]["DT_UpdateTime"];
                arr.push(obj);
            }
            sendData["list"] = arr;
        }
        var reusltData = m_resultData.init(100, "ok", "请求成功", JSON.stringify(sendData));
        res.send(reusltData.getDataStr());
    });
}

exports.operatorDicType = function(req, res) {
    var receiveData = req.query;
    var admin_id = receiveData['admin_id'];
    var type = receiveData['type'];
    var dictype_name = receiveData['dictype_name'];
    var dictype_id = receiveData['dictype_id'];
    var sendData = {};
    var sqlObject = {};
    sqlObject["DT_ID"] = receiveData["dictype_id"];
    sqlObject["DT_Name"] = receiveData["dictpe_name"];
    sqlObject["DT_UpdateTime"] = 'NOW()';
    if (type == 1) { //   添加
        sqlObject["DT_CreateTime"] = 'NOW()';
        m_db.add_GameGategory(sqlObject, function(data) {
            var code = -1;
            var status = 0;
            var message = "请求错误";
            if (data) {
                console.log("lin=data=" + JSON.stringify(data));
                code = 100;
                status = 1;
                message = "";
            }

            var reusltData = m_resultData.init(code, status, message, JSON.stringify(sendData));
            res.send(reusltData.getDataStr());
        });

    } else if (type == 2) { // 删除
        m_db.delate_GameGategory(sqlObject, function(data) {
            var code = -1;
            var status = 0;
            var message = "数据请求错误";
            if (data) {
                console.log("lin=data=" + JSON.stringify(data));
                code = 100;
                status = 1;
                message = "";
            }

            var reusltData = m_resultData.init(code, status, message, JSON.stringify(sendData));
            res.send(reusltData.getDataStr());
        });
    } else if (type == 3) { // 修改
        m_db.update_GameGategory(sqlObject, function(data) {
            var code = -1;
            var status = 0;
            var message = "数据请求错误";
            if (data) {
                console.log("lin=data=" + JSON.stringify(data));
                code = 100;
                status = 1;
                message = "操作成功";
            }

            var reusltData = m_resultData.init(code, status, message, JSON.stringify(sendData));
            res.send(reusltData.getDataStr());
        });
    }
}