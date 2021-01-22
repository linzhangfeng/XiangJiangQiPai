var buildInfo = {
    //主项目名
    project: "bundle-update-main",
    outProject: "doudizhu",
    //版本号
    version: "1.0.26",
    //需要复制后编译到compile的
    scripts: [
        // {from: "/scripts/main.js", to: "/scripts1/", compile: "/scripts/"}
    ],
    //需要复制的的from当前项目路径下文件夹路径,输出路径下to当前项目路径下文件夹路径,可以通过这里先复制需要打包的文件，再从scripts里进行编译
    copys: [
        {from: "../../build/jsb-link/assets/bundle1/", to: "/bundle1/"},
    ],

    //编译后需额外移除的文件或文件夹
    deletes: ["/scripts1/"]

};

module.exports = buildInfo;