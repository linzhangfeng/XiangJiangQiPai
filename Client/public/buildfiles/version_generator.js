var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var manifest = {
    packageUrl: '',
    remoteManifestUrl: 'http://localhost/tutorial-hot-update/remote-assets/project.manifest',
    remoteVersionUrl: 'http://localhost/tutorial-hot-update/remote-assets/version.manifest',
    version: '1.0.0',
    assets: {},
    searchPaths: []
};

var dest = './remote-assets/';
var src = './jsb/';
var versionEx = '';
var srcEx = [];
// Parse arguments
var i = 2;
while ( i < process.argv.length) {
    var arg = process.argv[i];

    switch (arg) {
    case '--url' :
    case '-u' :
        var url = process.argv[i+1];
        manifest.packageUrl = url;
        i += 2;
        break;
    case '--version' :
    case '-v' :
        manifest.version = process.argv[i+1];
        i += 2;
        break;
    case '--versionEx' :
    case '-vEx' :
        versionEx = process.argv[i+1];
        i += 2;
        break;
    case '--src' :
    case '-s' :
        src = process.argv[i+1];
        i += 2;
        break;

    case '--srcEx' :
    case '-sEx' :
        srcEx = process.argv[i+1].split(",");
        i += 2;
        break;
    case '--dest' :
    case '-d' :
        dest = process.argv[i+1];
        i += 2;
        break;
    default :
        i++;
        break;
    }
}


manifest.remoteManifestUrl = manifest.packageUrl +versionEx+ 'project.manifest';
manifest.remoteVersionUrl = manifest.packageUrl+ versionEx+'version.manifest';

function readDir (dir, obj) {
    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }
    var subpaths = fs.readdirSync(dir), subpath, md5, relative ,size;
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = path.join(dir, subpaths[i]);
        stat = fs.statSync(subpath);
        if (stat.isDirectory()) {

            readDir(subpath, obj);
        }
        else if (stat.isFile()) {
        	if(subpath.indexOf(manifest.remoteManifestUrl) >=0 ||subpath.indexOf(manifest.remoteVersionUrl) >=0 )
        	{
        		continue;
        	}
            size = stat['size'];
            md5 = crypto.createHash('md5').update(fs.readFileSync(subpath)).digest('hex');
            relative = path.relative(src, subpath);
            if (process.platform === "win32") {
                // 适配win环境，替换路径间隔符
                relative = relative.replace(/\\/g, '/');
            }
            relative = encodeURI(relative);
            obj[relative] = {'md5' : md5,'size' : size ,'verify' : true};
        }
    }
}

var mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
    }
}

// Iterate res and src folder

for(var j in srcEx)
{
    readDir(path.join(src, srcEx[j]), manifest.assets);
}

var destManifest = path.join(dest, 'project.manifest');
var destVersion = path.join(dest, 'version.manifest');

mkdirSync(dest);

fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
  if (err) throw err;
  console.log('Manifest successfully generated');
});

delete manifest.assets;
delete manifest.searchPaths;
fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
  if (err) throw err;
  console.log('Version successfully generated');
});
