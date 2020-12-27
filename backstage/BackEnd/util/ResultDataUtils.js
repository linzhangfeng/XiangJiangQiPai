var ResultDataModel = {
    code: -1,
    message: '',
    data: '',
    getDataStr() {
        var json = {
            code: this.code,
            message: this.message,
            data: this.data
        };
        console.log("lin=ResultDataModel=" + JSON.stringify(json));
        return JSON.stringify(json);
    }
}

var Utils = require('../util/Utils');
var CommonConfig = require('../util/CommonConfig');
exports.create = function(code, data) {
    let result = Utils.copyObject(ResultDataModel);
    result.code = code;
    result.message = CommonConfig.ErrorCodeMsg[code + ''];
    result.data = data;
    return result;
}