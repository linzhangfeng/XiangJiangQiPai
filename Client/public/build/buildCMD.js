var fs = require('fs');
var path = require('path');
var execCMD = require("child_process").execSync

var infoFile = process.argv[2];


if(!infoFile)
{
    infoFile = "buildInfo.js";
}

console.log("lin=infoFile:"+infoFile);
var infoData = require("./"+ infoFile);
var project = infoData.project;
console.log("node build.js "+__dirname+"/"+path.join(infoFile+"",""));
var str = execCMD("cd ../buildfiles/&&node build.js "+__dirname+"/"+path.join(infoFile+"",""),function(error)
{
    if(error !== null)
    {
        console.log("exec error:"+error);
    }
});
console.log("总日志信息:\n"+str.toString("utf8"));