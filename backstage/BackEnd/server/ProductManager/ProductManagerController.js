var m_resultData = require('../../util/ResultDataUtils');
var Utils = require('../../util/Utils');
var m_httpUtils = require('../../util/HttpUtils');
var fs = require('fs');
var fd = require("formidable"); //载入 formidable
var compressing = require('compressing');
var m_db = require('./DataBaseMgr');
var CodeConfig = require('../../util/CommonConfig');
var g_config = require("../config.js");
//查询产品列表
exports.getProductList = function (req, res) {
    if (req.url == '/getProductList') {
        var tagName = "getProductList";
        m_httpUtils.post_receive(req, function (recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;
            if (recvData['productName']) sql_obj['PL_Name'] = Utils.toSqlString(recvData['productName']);
            if (recvData['productId']) sql_obj['PL_ID'] = recvData['productId'];

            Utils.packageLimitPage(sql_obj, recvData);

            m_db.find_product_list(sql_obj, function (productList) {
                res_data = productList;
                packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            })
        }, tagName);
    }
}

//添加新产品
exports.addProduct = function (req, res) {
    if (req.url == '/addProduct') {
        var tagName = "addProduct";
        m_httpUtils.post_receive(req, function (recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;

            sql_obj["CreateTime"] = 'NOW()';
            sql_obj["UpdateTime"] = 'NOW()';

            if (recvData['productName']) sql_obj['PL_Name'] = Utils.toSqlString(recvData['productName']);
            if (recvData['productPrice']) sql_obj['PL_Price'] = recvData['productPrice'] * 100;
            if (recvData['twoRatio']) sql_obj['PL_Ratio_Two'] = recvData['twoRatio'];
            if (recvData['oneRatio']) sql_obj['PL_Ratio_One'] = recvData['oneRatio'];

            //判断该产品是否已经添加
            m_db.find_product(sql_obj, function (productData) {
                if (productData.length == 0) {
                    m_db.add_product([sql_obj], function (data) {
                        packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                        m_httpUtils.post_response(res, packageData, tag);

                    }, function () {
                        packageData = m_resultData.create(CodeConfig.ErrorCode.AddProductError, res_data);
                        m_httpUtils.post_response(res, packageData, tag);
                    });
                } else {
                    packageData = m_resultData.create(CodeConfig.ErrorCode.AddProductError, res_data);
                    m_httpUtils.post_response(res, packageData, tag);
                }
            });

        }, tagName);
    }
}


//添加版本
exports.addVersion = function (req, res) {
    if (req.url == '/addVersion') {
        var tagName = "addVersion";
        m_httpUtils.post_receive(req, function (recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;

            sql_obj["CreateTime"] = 'NOW()';
            sql_obj["UpdateTime"] = 'NOW()';

            if (recvData['versionName']) sql_obj['GV_VersionName'] = Utils.toSqlString(recvData['versionName']);
            if (recvData['versionNumber']) sql_obj['GV_VersionNumber'] = recvData['versionNumber'];
            if (recvData['zipUrl']) sql_obj['GV_ZipUrl'] = Utils.toSqlString(recvData['zipUrl']);
            if (recvData['entrance']) sql_obj['GV_Entrance'] = Utils.toSqlString(recvData['entrance']);

            //判断该产品是否已经添加
            m_db.find_versionName(sql_obj, function (productData) {
                if (productData.length == 0) {
                    m_db.add_version([sql_obj], function (version_data) {
                        packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                        m_httpUtils.post_response(res, packageData, tag);

                        //添加到历史版本中
                        var sql_obj_history = Utils.copyObject(sql_obj);
                        sql_obj_history['GV_VersionName'] = null;
                        res_data["GVH_ID"] = version_data.insertId;
                        m_db.add_version_history([sql_obj_history]);
                    }, function () {
                        packageData = m_resultData.create(CodeConfig.ErrorCode.CommonError, res_data);
                        m_httpUtils.post_response(res, packageData, tag);
                    });
                } else {
                    packageData = m_resultData.create(CodeConfig.ErrorCode.CommonError, res_data);
                    m_httpUtils.post_response(res, packageData, tag);
                }
            });

        }, tagName);
    }
}


//更新版本
exports.updateVersion = function (req, res) {
    if (req.url == '/updateVersion') {
        var tagName = "updateVersion";
        m_httpUtils.post_receive(req, function (recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;

            sql_obj["UpdateTime"] = 'NOW()';

            if (recvData['versionName']) sql_obj['GV_VersionName'] = Utils.toSqlString(recvData['versionName']);
            if (recvData['versionNumber']) sql_obj['GV_VersionNumber'] = recvData['versionNumber'];
            if (recvData['zipUrl']) sql_obj['GV_ZipUrl'] = Utils.toSqlString(recvData['zipUrl']);
            if (recvData['entrance']) sql_obj['GV_Entrance'] = Utils.toSqlString(recvData['entrance']);
            if (recvData['versionId']) sql_obj['GV_ID'] = recvData['versionId'];
            //判断该产品是否已经添加
            m_db.update_product(sql_obj, function (productData) {
                if (productData.length == 0) {
                    m_db.add_version([sql_obj], function (data) {
                        packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                        m_httpUtils.post_response(res, packageData, tag);

                    }, function () {
                        packageData = m_resultData.create(CodeConfig.ErrorCode.CommonError, res_data);
                        m_httpUtils.post_response(res, packageData, tag);
                    });
                } else {
                    packageData = m_resultData.create(CodeConfig.ErrorCode.CommonError, res_data);
                    m_httpUtils.post_response(res, packageData, tag);
                }
            });

        }, tagName);
    }
}

//修改产品信息
exports.editProduct = function (req, res) {
    if (req.url == '/editProduct') {
        var tagName = "editProduct";
        m_httpUtils.post_receive(req, function (recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;
            sql_obj["UpdateTime"] = 'NOW()';

            if (recvData['productName']) sql_obj['PL_Name'] = Utils.toSqlString(recvData['productName']);
            if (recvData['productPrice']) sql_obj['PL_Price'] = recvData['productPrice'] * 100;
            if (recvData['twoRatio']) sql_obj['PL_Ratio_Two'] = recvData['twoRatio'];
            if (recvData['oneRatio']) sql_obj['PL_Ratio_One'] = recvData['oneRatio'];
            if (recvData['productId']) sql_obj['PL_ID'] = recvData['productId'];
            //查询该用户是否存在
            m_db.update_product([sql_obj], function (data) {
                packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                m_httpUtils.post_response(res, packageData, tag);

            }, function () {
                packageData = m_resultData.create(CodeConfig.ErrorCode.UpdateProductError, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            });
        }, tagName);
    }
}

//移除产品功能
exports.removeProduct = function (req, res) {
    if (req.url == '/removeProduct') {
        var tagName = "removeProduct";
        m_httpUtils.post_receive(req, function (recvData, tag) {
            //验证用户
            var sql_obj = {};
            var res_data = {};
            var packageData = null;
            sql_obj["UpdateTime"] = 'NOW()';
            if (recvData['productId']) sql_obj['PL_ID'] = recvData['productId'];
            sql_obj['PL_State'] = 1;
            //查询该用户是否存在
            m_db.update_product([sql_obj], function (data) {
                packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            }, function () {
                packageData = m_resultData.create(CodeConfig.ErrorCode.DeleteProductError, res_data);
                m_httpUtils.post_response(res, packageData, tag);
            });
        }, tagName);
    }
}

//添加版本控制

//更新产品版本
exports.hotupdateUpLoad = function (req, res) {
    if (req.url == '/hotupdateUpLoad') {
        var form = new fd.IncomingForm();
        // 如果文件移动跨盘符依然需要提前设置上传文件的路径，默认在c盘
        var downloadPath = g_config.HotUpdate_Cur_ZIP_URL;
        var compressingPath = g_config.HotUpdate_Cur_URL;
        form.uploadDir = downloadPath;
        var res_data = {};
        var packageData = null;
        var tagName = "hotupdateUpLoad";
        form.parse(req, function (err, fields, files) {
            // console.log(filds); //表单数据
            // console.log(files); //上传文件的数据
            // 需要将上传后的文件移动到指定目录
            console.log("下载文件成功");
            var oldPath = files.file.path;
            var newPath = downloadPath + files.file.name;
            fs.rename(oldPath, newPath, function (err) {
                console.log("移动文件成功");
                // 压缩成zip
                // compressing.zip.compressDir('nodejs-compressing-demo', 'nodejs-compressing-demo.zip')
                //     .then(() => {
                //         console.log('success');
                //     })
                //     .catch(err => {
                //         console.error(err);
                //     });

                // 解压缩
                compressing.zip.uncompress(newPath, compressingPath)
                    .then(() => {
                        console.log('success');
                        packageData = m_resultData.create(CodeConfig.ErrorCode.Success, res_data);
                        m_httpUtils.post_response(res, packageData, tagName);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });
        });
    }
}
