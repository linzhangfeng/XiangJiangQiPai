
var buildInfo = {
    //主项目名
    project:"mj_jianlizfb",
    outProject:"jianlimjzfb",
    //版本号
    version:"1.0.26",
    //需要复制后编译到compile的
    scripts:[{from:"/scripts/main.js",to:"/scripts1/",compile:"/scripts/"}
    ],
    //需要复制的的from当前项目路径下文件夹路径,输出路径下to当前项目路径下文件夹路径,可以通过这里先复制需要打包的文件，再从scripts里进行编译
    copys:[{from:"/scripts/Base64.js",to:"/scripts1/"}
        ,{from:"/scripts/ex.js",to:"/scripts1/"}
        ,{from:"/scripts/LoadTable.js",to:"/scripts1/"}
        ,{from:"/scripts/Log.js",to:"/scripts1/"}
        ,{from:"/scripts/MatchPlug.js",to:"/scripts1/"}
        ,{from:"/scripts/md5.js",to:"/scripts1/"}
        ,{from:"/scripts/MJAction.js",to:"/scripts1/"}
        ,{from:"/scripts/MJCards.js",to:"/scripts1/"}
        ,{from:"/scripts/MJConfig.js",to:"/scripts1/"}
        ,{from:"/scripts/MJDialogs.js",to:"/scripts1/"}
        ,{from:"/scripts/MJInfo.js",to:"/scripts1/"}
        ,{from:"/scripts/MJLogic.js",to:"/scripts1/"}
        ,{from:"/scripts/MJModel.js",to:"/scripts1/"}
        ,{from:"/scripts/MJPlayer.js",to:"/scripts1/"}
        ,{from:"/scripts/MJPublic.js",to:"/scripts1/"}
        ,{from:"/scripts/MJScene.js",to:"/scripts1/"}
        ,{from:"/scripts/MJTable.js",to:"/scripts1/"}
        ,{from:"/scripts/MJTips.js",to:"/scripts1/"}
        ,{from:"/scripts/MJVideo.js",to:"/scripts1/"}
        ,{from:"/scripts/proto.js",to:"/scripts1/"}
        ,{from:"/scripts/utils.js",to:"/scripts1/"}
        ,{from:"/scripts/MJResult.js",to:"/scripts1/"}
        ,{from:"/scripts/MJ_Test.js",to:"/scripts1/"}
        ,{from:"/scripts/protobuf/",to:"/scripts1/protobuf/"}
        ,{from:"/scripts/proto/loginproto.proto",to:"/scripts/proto/"}
        ,{from:"/scripts/proto/gameproto.proto",to:"/scripts/proto/"}

        ,{from:"/scripts/proto/jianligameproto.proto",to:"/scripts/proto/"}
        ,{from:"/scripts/MJ_JianLiZFB.js",to:"/scripts1/"}

        ,{from:"/res/RoomMJ/",to:"/res/RoomMJ/"}
        ,{from:"/res/MJ2.5/",to:"/res/MJ2.5/"}
        ,{from:"/res/jianlizfb/",to:"/res/jianlizfb/"}
    ],

    //编译后需额外移除的文件或文件夹
    deletes:["/scripts1/"]

};

module.exports = buildInfo;