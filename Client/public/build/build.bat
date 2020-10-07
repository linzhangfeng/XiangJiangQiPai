echo start check nodeJs version!
node -v

echo start build project
CocosCreator.exe --path ../../momoqipai_hall/ --build "platform=android;debug=true"

node buildCMD.js buildInfo.js




