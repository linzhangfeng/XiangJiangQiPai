window.GHttp = {
    apiurl:"",
    imageurl:"",
    sendHttp:function (url,msg,cb,timeout) {
        var furl = url;
        if (furl.indexOf("http") == -1) furl = this.apiurl + furl;
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", furl, true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.setRequestHeader("charset",'utf-8');
        xhr.setRequestHeader("X-PkgName",'pkgName=com.wbyl.wbdp');
        xhr.setRequestHeader("UserKey",GModel.userKey);
        xhr.setRequestHeader("agentKey",GModel.userKey);
        xhr.setRequestHeader("X-App",'vname=2.8.0;vcode=20060');
        xhr.setRequestHeader("X-Channel",'cid=86011079');
        xhr.setRequestHeader("X-Device",'imsi=AA71BB9F-9FC8-465F-8601-4A644918D58D;imei=AA71BB9F-9FC8-465F-8601-4A644918D58D;did=AA71BB9F-9FC8-465F-8601-4A644918D58D;dname=iPhone Simulator;os=ios;osver=12.0');
        xhr.setRequestHeader("X-User",'uid='+GModel.id);
        xhr.setRequestHeader("fromType",'1');
        var body = '';
        for (var key in msg){body += key+'='+msg[key]+'&';}
        xhr.send(body);

        var time = false;//是否超时
        var timer = setTimeout(function(){
            time = true;
            request.abort();//请求中止
            if (!!cb)cb(null);
        },timeout);

        xhr.onreadystatechange = function () {
            if(time) return;
            clearTimeout(timer);
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 207)) {
                var data = JSON.parse(xhr.responseText);
                if (!!cb)cb(data);
            }
        };
    },
    sendHttpImage:function (url,filename,cb) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.responseType = "arraybuffer";
        var furl = url;
        if (furl.indexOf("http") == -1) furl = this.imageurl + furl;
        cc.log("sendHttpImage:" + furl);
        xhr.open("GET", furl, true);
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.response && cc.sys.isNative) {
                    var u8a = new Uint8Array(xhr.response);
                    var cutPos = filename.lastIndexOf("/");
                    var localPath = filename.slice(0,cutPos);
                    if (!jsb.fileUtils.isDirectoryExist(localPath))jsb.fileUtils.createDirectory(localPath);
                    jsb.fileUtils.writeDataToFile(u8a, filename);
                    if (!!cb)cb();
                }
            }
        };
    },
};