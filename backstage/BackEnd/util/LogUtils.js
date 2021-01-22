class LoginLogModel {
    //构造函数
    constructor(userId, status, createTime) {
        this.m_userId = userId;
        this.m_status = status;
        this.m_createTime = status;
        if (userId == undefined) this.m_userId = -1;
        if (status == undefined) this.m_status = "";
        if (createTime == undefined) this.m_createTime = "";
    }

    getData() {
        var json = {
            code: this.m_code,
            status: this.m_status,
            message: this.m_message
        };
        return JSON.stringify(json);
    }

    setUserId(userId) {
        this.m_userId = userId;
    }
    getUserId() {
        return this.m_code;
    }

    setStatus(status) {
        this.m_status = status;
    }
    getStatus() {
        return this.m_status;
    }

    setCreateTime(createTime) {
        this.m_createTime = createTime;
    }
    getCreateTime() {
        return this.m_createTime;
    }
}

class OperatorLogModel {
    //构造函数
    constructor(userId, opType, content, createTime) {
        this.m_userId = userId;
        this.m_opType = opType;
        this.m_content = content;
        this.m_createTime = createTime;
        if (this.m_userId == undefined) this.m_userId = -1;
        if (this.m_opType == undefined) this.m_opType = -1;
        if (this.m_content == undefined) this.m_content = "";
        if (this.m_createTime == undefined) this.m_createTime = "";
    }

    getData() {
        var json = {
            code: this.m_code,
            status: this.m_status,
            message: this.m_message
        };
        return JSON.stringify(json);
    }
    setUserId(userId) {
        this.m_userId = userId;
    }
    getUserId() {
        return this.m_code;
    }

    setStatus(status) {
        this.m_status = status;
    }
    getStatus() {
        return this.m_status;
    }

    getContent(content) {
        this.m_content = content;
    }
    setContent() {
        return this.m_content;
    }

    setCreateTime(createTime) {
        this.m_createTime = createTime;
    }
    getCreateTime() {
        return this.m_createTime;
    }
}
var m_dbLog = require('../server/LogManager/DataBaseMgr');
var Utils = require('../util/Utils');
exports.operatorLog = function(adminId, opType, content, tag) {
    adminId = 871150;
    //包装数据
    var objectData = {};
    objectData["OL_Type"] = opType;
    objectData["OL_Content"] = Utils.toSqlString(content);
    objectData["CreateTime"] = 'NOW()';
    objectData["SA_ID"] = adminId;
    objectData["OL_TagName"] = Utils.toSqlString(tag);
    m_dbLog.add_log_operator([objectData]);
}

exports.loginLog = function(req, res) {
    var resultData = new LoginLogModel();
    return resultData;
}