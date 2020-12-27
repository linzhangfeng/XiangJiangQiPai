var m_resultData = require('../../util/ResultDataUtils');
var m_db = require('../../util/db');
var fs = require('fs');
var m_httpUtils = require('../../util/HttpUtils');
var fd = require("formidable"); //载入 formidable
var compressing = require('compressing');


//查看操作日记
exports.getLogOperatorList = function(req, res) {
    if (req.url == '/getLogOperatorList') {
        var tagName = "getLogOperatorList";
        m_httpUtils.post_receive(req, function(data, tag) {

            m_httpUtils.post_response(res, data, tag);
        }, tagName);
    }
}