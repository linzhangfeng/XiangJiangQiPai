var buildInfo = {
    //主项目名
    project: "bundle-update-main",
    outProject: "hall",
    remoteUrl: "http://119.23.221.227/hotupdate/",
    //版本号
    version: "1.0.29",
    //需要复制后编译到compile的
    scripts: [
        // {from: "/scripts/main.js", to: "/scripts1/", compile: "/scripts/"}
    ],
    //需要复制的的from当前项目路径下文件夹路径,输出路径下to当前项目路径下文件夹路径,可以通过这里先复制需要打包的文件，再从scripts里进行编译
    copys: [
        {from: "../../build/jsb-link/assets/internal/", to: "/assets/internal/"},
        {from: "../../build/jsb-link/assets/resources/", to: "/assets/resources/"},
        {from: "../../build/jsb-link/assets/main/", to: "/assets/main/"},
        {from: "../../build/jsb-link/src/", to: "/src/"}
    ],

    //编译后需额外移除的文件或文件夹
    deletes: ["/scripts1/"]

};

module.exports = buildInfo;