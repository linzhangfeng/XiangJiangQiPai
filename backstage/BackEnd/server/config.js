var SERVER_PORT = 7766; //服务器端口
var SERVER_IP = "127.0.0.1"; //如果非本机访问，这里要变

exports.mysql = function() {
    return {
        HOST: '119.23.221.227',
        USER: 'root',
        PSWD: '123456', //如果连接失败，请检查这里
        DB: 'xiaoqiao', //如果连接失败，请检查这里
        PORT: 3306,
    }
}

exports.server = function() {
    return {
        CLIENT_PORT: SERVER_PORT,
        CLIENT_ID: SERVER_IP,
        VERSION: '20191023',
    }
}

//热更新文件路径
var HotUpdate_Debug_ZIP_URL = "F:/linzhangfeng/hotupdate/download/";
var HotUpdate_Release_ZIP_URL = "/var/www/html/hotupdatedownload/";

var HotUpdate_Debug_URL = "F:/linzhangfeng/hotupdate/GameVersion/";
var HotUpdate_Release_URL = "/var/www/html/hotupdate/";

exports.HotUpdate_Cur_URL = HotUpdate_Debug_URL;
exports.HotUpdate_Cur_ZIP_URL = HotUpdate_Debug_ZIP_URL;

// exports.HotUpdate_Cur_URL = HotUpdate_Release_ZIP_URL;
// exports.HotUpdate_Cur_ZIP_URL = HotUpdate_Release_URL;
