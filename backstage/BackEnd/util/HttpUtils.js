var m_logUtils = require('./LogUtils');
require('./CommonConfig.js');
exports.receive = function(req, res, type) {
    //获取账户名
    //获取操作类型
    //获取操作内容
    if (type == OperatorType.Login) {
        m_logUtils.loginLog();
    } else {
        m_logUtils.operatorLog();
    }
}

exports.response = function(req, res, type) {
    if (type == OperatorType.Login) {
        m_logUtils.loginLog();
    } else {
        m_logUtils.operatorLog();
    }
}
exports.get_receive = function(req, callback, tag) {
    var data = req.query;
    var logStr = tag + "_get_receive：" + JSON.stringify(data);
    console.log(logStr);
    m_logUtils.operatorLog(1111, 0, logStr, tag);
    if (callback) callback(data, tag);
}

exports.get_response = function(res, data, tag) {
    res.send(JSON.stringify(data));
    var logStr = tag + "_get_response：" + JSON.stringify(data);
    m_logUtils.operatorLog(1111, 0, logStr, tag);
}

exports.post_receive = function(req, callback, tag) {
    var obj = '';
    req.on('data', function(data) { //数据较大，分多次接收
        obj += data;
    });

    req.on("end", function() { //接收完成后的操作
        var logStr = tag + "_post_receive：" + obj;
        console.log(logStr);
        m_logUtils.operatorLog(1111, 0, logStr, tag);
        let jsonData = JSON.parse(obj);
        if (callback) callback(jsonData, tag);
    });
}

exports.post_response = function(res, data, tag) {
    res.end(JSON.stringify(data));
    var logStr = tag + "_post_response：" + JSON.stringify(data);
    m_logUtils.operatorLog(1111, 0, logStr, tag);
}