var m_resultData = require('../../util/ResultDataUtils');
var m_db = require('../../util/db');
var fs = require('fs');
var fd = require("formidable"); //载入 formidable
var compressing = require('compressing');

exports.hotupdateUpLoad = function (req, res) {
    if (req.url == '/hotupdateUpLoad') {
        var form = new fd.IncomingForm();
        // 如果文件移动跨盘符依然需要提前设置上传文件的路径，默认在c盘
        var downloadPath = "/var/www/html/hotupdatedownload/"
        var compressingPath = "/var/www/html/hotupdate/"
        form.uploadDir = downloadPath;
        let data = {};
        data["update"] = false;
        form.parse(req, function (err, fields, files) {
            // console.log(filds); //表单数据
            // console.log(files); //上传文件的数据
            // 需要将上传后的文件移动到指定目录
            console.log("下载文件成功");
            var oldPath = files.file.path;
            var newPath = downloadPath + files.file.name;
            fs.rename(oldPath, newPath, function (err) {
                console.log("移动文件成功");

                // 解压缩
                compressing.zip.uncompress(newPath, compressingPath)
                    .then(() => {
                        console.log('success');
                        data["update"] = true;
                        res.end(JSON.stringify(data));
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });
        });
    }
}
exports.hotupdateCheck = function (req, res) {
    if (req.url == '/hotupdateCheck') {
        var obj = "";
        req.on('data', function (data1) { //数据较大，分多次接收
            obj += data1;
        })


        req.on("end", function () { //接收完成后的操作
            console.log("接收到客户端数据：" + obj);
            let json = JSON.parse(obj);
            let data = {};
            data["update"] = false;
            if (json.version != "1.0.19") {
                data["update"] = true;
            }
            data["wgtUrl"] = "http://119.23.221.227/hotupdate/qianghongbao/__UNI__B4E8852.wgt";
            console.log("返回到客户端数据：" + JSON.stringify(data));
            res.end(JSON.stringify(data));
        })
    }
}
