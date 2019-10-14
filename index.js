'use strict';

const getPort = require('@xyqfer/get-port');
const AV = require('leanengine');

if (process.env.NODE_ENV === 'production') {
  AV.init({
    appId: process.env.LEANCLOUD_APP_ID,
    appKey: process.env.LEANCLOUD_APP_KEY,
    masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
  });
  
  // 如果不希望使用 masterKey 权限，可以将下面一行删除
  AV.Cloud.useMasterKey();
}

const createApp = require('./server');

(async () => {
  const app = await createApp();
  const PORT = await getPort();

  app.listen(PORT, function (err) {
    console.log('Node app is running on port:', PORT);

    // 注册全局未捕获异常处理器
    process.on('uncaughtException', function(err) {
      console.error('Caught exception:', err.stack);
    });
    process.on('unhandledRejection', function(reason, p) {
      console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack);
    });
  });
})();
