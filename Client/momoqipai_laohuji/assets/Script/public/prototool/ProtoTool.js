// var ProtoBuf = require("./protobuf/protobuf");
// require("./protobuf/protobuf");
// requireJs();
// var ByteBuffer = require("bytebuffer");
// var ProtoBuf = require("protobufjs");
// var ProtoBuf = require("protobuf");
var exp = {};
window.ProtoTool = exp;
//////////////////////////////////////////////////////////////
//接口数据
//////////////////////////////////////////////////////////////
var protoinfo = {
    mProtoFrom:{},              //
    mPackage : {},              //brotobuf包集
};
window.protoinfo = protoinfo;

cc.loader.getProtoRes = function(url){
    console.log('-----------url1----------'+url);
    var vr = url.split('/');
    if (0<vr.length){
        url = 'proto/'+vr[vr.length-1];
    }
    // if (-1!=url.indexOf('loginproto.proto'))url = 'proto/loginproto.proto';
    // else if (-1!=url.indexOf('guizhougameproto.proto'))url = 'proto/guizhougameproto.proto';
    // else if (-1!=url.indexOf('hunangameproto.proto'))url = 'proto/hunangameproto.proto';
    // else if (-1!=url.indexOf('yuanjianggameproto.proto'))url = 'proto/yuanjianggameproto.proto';
    // else if (-1!=url.indexOf('gameproto.proto'))url = 'proto/gameproto.proto';
    console.log('-----------url2----------'+url);
    return cc.loader.getRes(url);
}

//////////////////////////////////////////////////////////////
//网络接口
//////////////////////////////////////////////////////////////
exp.loadFiles = function(protoFilesbfu,cb){
    
    var ProtoBuf = window.ProtoBuf;
    var builder = ProtoBuf.newBuilder();
    var protoFiles = [];
    for (var i = 0,len = protoFilesbfu.length; i < len; ++i){
        protoFiles.push(protoFilesbfu[i].files);
    }
    var builder = ProtoBuf.newBuilder();
    var loadFile = function(path) {
        if (typeof cc !== 'undefined') {
            console.log('cc.sys.isNative  '+cc.sys.isNative);
            var isNative = cc.sys.isNative;
            console.log('isNative  '+isNative)
            path = isNative ? cc.url.raw(path) : `res/raw-assets/${path}`;
            ProtoBuf.Util.IS_NODE = isNative;
            cc.log('>>>>>>>>' + path);
        }

        var count = 0;
        builder.importRoot = path;
        protoFiles.forEach(function (fileName) {
            let filePath = 'proto/'+fileName;
            var contents = cc.loader.getProtoRes(filePath);
            ProtoBuf.loadProto(contents, builder, filePath);

            for (var i = 0,len = protoFilesbfu.length; i < len; ++i){
                if (fileName==protoFilesbfu[i].files){
                    var packagename = protoFilesbfu[i].package;
                    protoinfo.mProtoFrom[packagename] = builder.build(packagename);
                    break;
                }
            }
            if (++count==protoFilesbfu.length&&!!cb)cb();
        });
    }
    var preload = function(_cb) {
        //运行时动态修改ProtoBuf.Util.fetch为cc.loader.getRes
        ProtoBuf.Util.fetch = cc.loader.getRes.bind(cc.loader);
        //使用cc.loader.loadResDir加载resources/pb目录所有文件
        cc.loader.loadResDir('proto', (error, data) => {
            //通知调用都，预加载完毕
            _cb();
        });
    }
    
    preload(function () {
        loadFile('resources/proto');
    });
}

//得到包模型
exp.packetModel = function(cmdstr){
    var _getModelfun = function (_package,_message) {
        if (!!protoinfo.mProtoFrom[_package] && !!protoinfo.mProtoFrom[_package][_message]){
            return protoinfo.mProtoFrom[_package][_message];
        }
        return null;
    }

    if ('string'==typeof cmdstr){
        var vr = cmdstr.split('.');
        var _message = vr[vr.length-1];
        var _package = '';
        for (var i = 0,len = vr.length-1; i < len; ++i){
            _package += vr[i];
            if (i!=len-1)_package += '.';
        }
        return _getModelfun(_package,_message);
    }
    return null;
}

exp.parsePacket = function(cmdstr, data){
    var model = ProtoTool.packetModel(cmdstr);
    // if (model) cc.log("parsePacket:" + "[" + JSON.stringify(model) + "]");
    var objpacket = model.decode(data);
    if (objpacket) cc.log("parsePacket:" + "[" + JSON.stringify(objpacket) + "]");
    if (objpacket) return objpacket;
    return null;
}

//创建数据包
exp.createPacket = function(cmdstr){
    var model = ProtoTool.packetModel(cmdstr);
    if (model)return new model();
    return null;
}