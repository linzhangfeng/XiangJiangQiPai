var fs = require('fs');
var path = require('path');
var execCMD = require("child_process").execSync


var os = require('os');
var sysType = os.type();
console.log("os:"+sysType);
//是否是win系统
var  isWin = sysType == "Windows_NT";

var pathTexturePacker = isWin?"TexturePacker":"/Applications/TexturePacker.app/Contents/MacOS/TexturePacker";
/************工具函数**************/
var utils = {
    //安全的使用路径
    safePath:function(f)
    {
        if(isWin)
        {
            f = f.replace(/\\/g, '/');
        }
        return f;
    },
    //安全的CMD使用路径
    safeCMDPath:function(f)
    {
        if(isWin)
        {
            f = f.replace(/\//g, '\\');
            if(f[f.length-1] === '\\')
            {
                f=f.slice(0,f.length-1);
            }
        }
        else{
            f = f.replace(/\\/g, '/');
        }
        return f;
    },
//移除文件，f：文件/文件夹完整路径
    removeFile:function(f)
    {
        if(fs.existsSync(f) == false)
        {
            return;
        }
        var stat = fs.statSync(f);
        if (stat.isFile() || stat.isDirectory())
        {
            this.removeFileCMD(f);
        }

    },
//移除文件夹下所有文件，dir：文件夹完整路径，isAll是否文件夹也移除
    removeDirFile:function(dir,isAll)
    {
        if(fs.existsSync(dir) == false)
        {
            return;
        }
        var stat = fs.statSync(dir);
        if (!stat.isDirectory()) {
            return;
        }
        var subpaths = fs.readdirSync(dir), subpath;
        for (var i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            subpath = path.join(dir, subpaths[i]);
            stat = fs.statSync(subpath);
            if (stat.isDirectory()) {

                if(isAll)
                {
                    this.removeFileCMD(subpath);
                }
            }
            else if (stat.isFile()) {
                this.removeFileCMD(subpath);
            }
        }
    },
//执行dir文件夹路径下所有打包文件
    encodeTps:function(dir) {

        if(fs.existsSync(dir) == false)
        {
            return;
        }
        var stat = fs.statSync(dir);
        if (!stat.isDirectory()) {
            return;
        }
        var subpaths = fs.readdirSync(dir), subpath;
        for (var i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            subpath = path.join(dir, subpaths[i]);
            stat = fs.statSync(subpath);
            if (stat.isDirectory()) {

                this.encodeTps(subpath);
            }
            else if (stat.isFile()) {
                if(subpath.indexOf("encode.tps") !=-1 )
                {
                    this.exec(pathTexturePacker+" "+subpath);
                }
            }
        }
    },
//复制文件夹下所有，src:文件夹完整路径，dst文件夹完整路径
    copyDirTo:function(src,dst)
    {
        if(src[src.length-1] == "/")
        {
            if(fs.existsSync(src) == false)
            {
                console.log("copyDirTo error:"+src);
                return;
            }
        }
        if(fs.existsSync(dst) == false)
        {
            dst = this.safeCMDPath(dst);

            if (path.extname(dst) == "") {
                if (isWin) {
                    this.exec("mkdir " + dst);
                }
                else {
                    this.exec("mkdir -p " + dst);
                }
            }
        }
        src = this.safeCMDPath(src);
        dst = this.safeCMDPath(dst);
        if(isWin)
        {
            src = path.join(__dirname, src);
            dst = path.join(__dirname, dst);
            this.exec("xcopy /Y/I/S "+src+" "+dst);
        }
        else
        {
            this.exec("cp -r "+src+" "+dst);
        }
    },

//复制文件，src：原始文件完整路径，dst：目标文件完整路径
    copyFileTo:function(src,dst)
    {
        if(src[src.length-1] == "/")
        {
            if(fs.existsSync(src) == false)
            {
                console.log("copyFileTo error:"+src);
                return;
            }
        }
        if(fs.existsSync(dst) == false)
        {
            if (path.extname(dst) == "") {

                dst = this.safeCMDPath(dst);
                if(isWin)
                {
                    this.exec("mkdir "+dst);
                }
                else
                {
                    this.exec("mkdir -p "+dst);
                }
            }
        }
        src = this.safeCMDPath(src);
        dst = this.safeCMDPath(dst);
        if(isWin)
        {
            src = path.join(__dirname, src);
            dst = path.join(__dirname, dst);
            this.exec("xcopy /Y "+src+" "+dst);
        }
        else
        {
            var srcStat = fs.statSync(src);
            if(srcStat.isFile())
            {
                this.exec("cp -r "+src+" "+dst);
            }
            else if(srcStat.isDirectory())
            {
                var subpaths = fs.readdirSync(src), subpath;
                for (var i = 0; i < subpaths.length; ++i) {
                    if (subpaths[i][0] === '.') {
                        continue;
                    }
                    subpath = path.join(src, subpaths[i]);
                    var stat = fs.statSync(subpath);
                    if (stat.isFile()) {
                        this.exec("cp -r "+subpath+" "+path.join(dst, subpaths[i]));
                    }
                }
            }
        }
    },
    //批量处理有关文件路径的
    doPathFunc :function(ds,func,t)
    {
        if(!ds)
        {
            return;
        }
        for(var j in ds)
        {
            if(t)
            {
                console.log(t+ds[j]);
            }
            func(ds[j]);
        }
    },

    /******命令行处理********/
    exec :function(cmd)
    {
        console.log("lin=cmd:"+cmd);
        try
        {
            var str= execCMD(cmd,function(error)
            {
                if(error !== null)
                {
                    console.log("exec error:"+error);
                }
            });
            if(str && str !="")
            {
                console.log(str.toString("utf8"));
            }
        }
        catch (e){
            console.log("lin=exec:"+e);
        }
    },
    removeFileCMD :function(f)
    {
        f = this.safeCMDPath(f);
        console.log("移除："+f);

        if(isWin)
        {
            this.exec("del /Q "+f);
            this.exec("rd /Q/S "+f);
        }
        else
        {
            this.exec("rm -rf "+f);
        }
    }
};

var buildInfo = function(info,baseSrc,baseDst,isMain)
{
    var project = info.project;
    var scripts = info.scripts;
    var copys = info.copys;
    var laterCopys = info.laterCopys;
    var tps = info.tps;
    var version = info.version;
    var outProject = info.outProject;
    var deletes = info.deletes;
    if(!outProject)
    {
        outProject = project;
    }

    var getSrc = function()
    {
        if(baseSrc)
        {
            return "./"+baseSrc+"/"+project+"/";
        }
        return "../../"+project+"/";
    };

    var getDst = function()
    {
        if(baseDst)
        {
            return "../OutPut/"+baseDst+"/"+outProject+"/";
        }
        return "../OutPut/"+outProject+"/";
    };
    console.log("开始复制项目文件:"+project);
    if(copys)
    {
        for(var i in copys)
        {
            var dat = copys[i];
            utils.copyDirTo(getSrc()+dat["from"],getDst()+dat["to"]);
        }
    }

    console.log("开始编译项目js脚本:"+project);
    if(scripts)
    {
        for(var i in scripts)
        {
            var dat = scripts[i];
            var src =getSrc()+dat["from"];
            var dst =getDst()+dat["to"];
            src = utils.safePath(src);
            dst = utils.safePath(dst);
            if(dat["compile"])//设配旧麻将那边的复制后打包处理
            {
                utils.copyFileTo(src,dst);

                var from =getDst()+dat["to"];
                var compile =getDst()+dat["compile"];
                from = utils.safePath(from);
                compile = utils.safePath(compile);
                if(!isWin)
                {
                    utils.exec("find "+from+" -name \"*.svn\" | xargs rm -rf");
                }
                utils.exec("cocos jscompile -s "+from+" -d "+compile);
            }
            else
            {
                if(!isWin)
                {
                    utils.exec("find "+src+" -name \"*.svn\" | xargs rm -rf");
                }
                utils.exec("cocos jscompile -s "+src+" -d "+dst);
            }
        }
    }


    console.log("开始打包加密图片纹理:"+project);
    if(tps) {

        for(var i in tps)
        {
            var dat = tps[i];
            utils.removeDirFile(getDst()+dat["to"]);

            utils.encodeTps(getSrc()+dat["tps"]);
            utils.copyDirTo(getSrc()+dat["from"],getDst()+dat["to"]);
            utils.removeFile(getSrc()+dat["from"]);
        }
    }

    console.log("开始最终复制项目文件:"+project);
    if(laterCopys)
    {
        for(var i in laterCopys)
        {
            var dat = laterCopys[i];
            utils.copyDirTo(getSrc()+dat["from"],getDst()+dat["to"]);
        }
    }
    if(deletes&&!isMain)
    {
        console.log("开始移除不需要的文件:");
        for(var i in deletes)
        {
            utils.removeFileCMD(getDst()+"/"+deletes[i]);
        }
    }

};

/********开始编译流程*****/
var infoFile = utils.safePath(process.argv[2]);
console.log("infoFile:"+infoFile);
var curPath = process.argv[3];

//构建信息
var infoData = require(infoFile+"");

var version = infoData.version;
var project = infoData.project;
var ex = infoData.ex;
var deletes = infoData.deletes;
var modules = infoData.modules;
var outProject = infoData.outProject;
var lastCopys = infoData.lastCopys;
var exOuts = infoData.exOuts;

var isEncodePic = infoData.isEncodePic;

if(!outProject)
{
    outProject = project;
}

///***当前文件路径*//
console.log("开始打包:");
if(curPath)
{
    curPath=utils.safeCMDPath(curPath);
    utils.exec("cd "+curPath);
}

console.log("移除OutPut下主项目文件夹内容:");
utils.removeDirFile("../OutPut/"+outProject+"/",true);

buildInfo(infoData,null,null,true);

if(ex)
{
    console.log("开始处理额外包:");
    for(var i in ex)
    {
        var dat = ex[i];
        var pro = dat.project;
        var infoPath = "./"+pro+"/"+dat.info;
        var info  =  require(infoPath);
        var noVersion = info.noVersion;
        buildInfo(info,null,outProject);
        if(!noVersion)
        {
            utils.copyFileTo(infoPath,"./OutPut/"+outProject+"/"+info.project+"/"+dat.info);
        }
    }
}

if(lastCopys)
{
    console.log("主项目最后复制:");
    for(var i in lastCopys)
    {
        var dat = lastCopys[i];
        utils.copyDirTo("./"+project+"/"+dat["from"],"./OutPut/"+outProject+"/"+dat["to"]);
    }
}
if(deletes)
{
    console.log("开始移除不需要的文件:");
    for(var i in deletes)
    {
        utils.removeFileCMD("./OutPut/"+outProject+"/"+deletes[i]);
    }
}
console.log("开始过滤无用的隐藏文件夹");
if (isWin) {
    utils.exec("del /a /s /f /q "+utils.safeCMDPath("./OutPut/"+outProject+"/*.svn"));
    utils.exec("del /a /s /f /q "+utils.safeCMDPath("./OutPut/"+outProject+"/*.DS_Store"));
    utils.exec("del /a /s /f /q "+utils.safeCMDPath("./OutPut/"+outProject+"/*.idea"));
}
else
{
    utils.exec("find ./OutPut/"+outProject+" -name \"*.svn\" | xargs rm -rf");
    utils.exec("find ./OutPut/"+outProject+" -name \"*.DS_Store\" | xargs rm -rf");
    utils.exec("find ./OutPut/"+outProject+" -name \"*.idea\" | xargs rm -rf");
}


console.log("开始加密散图:");
if(isEncodePic)
{
    utils.exec("python EncryptRes.pyc OutPut/"+outProject+" OutPut/"+outProject);
}

console.log("开始编译版本文件:");

var srcDirs = outProject;
if(exOuts)
{
    for(var i in exOuts)
    {
        srcDirs +=","+exOuts[i];
    }
}
console.log("srcDirs:"+srcDirs);

utils.exec("node version_generator.js -s ../OutPut -d ../OutPut/"+outProject+"/version/ -sEx "+srcDirs+"/ -vEx "+outProject+"/version/  -v "+version);

console.log("开始打包zip:");
var needDirs = outProject;
if(exOuts)
{
    for(var i in exOuts)
    {
        needDirs +=" "+exOuts[i];
    }
}
console.log("needDirs:"+needDirs);
if(isWin)
{
    utils.exec("cd ../OutPut/ &&del /Q "+outProject+"_"+version+".zip &&zip -r "+outProject+"_"+version+".zip "+needDirs);
}
else{
    utils.exec("cd ../OutPut/ &&rm -rf "+outProject+"_"+version+".zip &&zip -r "+outProject+"_"+version+".zip "+needDirs);
}

console.log("编译完成:"+outProject+"_"+version+".zip");
