'use strict';

const { initCloudEngine } = require('@xyqfer/init-leancloud-engine');
initCloudEngine();

const getPort = require('@xyqfer/get-port');
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
