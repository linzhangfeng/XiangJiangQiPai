//本地测试地址
http:/localhost:9000/operatorDicType?dictype_id=111111&type=2
http:/localhost:9000/operatorDicType?dictpe_name='我是王思聪'&type=1
http:/localhost:9000/operatorDicType?dictype_id=222222&dictpe_name='我是张学友大哥'&type=3
http:/localhost:9000/hotupdateUpLoad

http:/localhost:7766/getDicType
http:/localhost:6666/getOrderDetailList

//远程服务器测试地址
http://119.23.221.227:7777/operatorDicType?dictype_id=111111&type=2
http://119.23.221.227:7777/hotupdateCheck

//常用命令
netstat -nap | grep 7777
ps -ef | grep app

//shell脚本执行命令无效，在&后面加回车
nohup node ./server/app.js &