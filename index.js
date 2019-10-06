'use strict';

const { init } = require('@xyqfer/init-leancloud-engine');
init();

const createApp = require('./server');

(async () => {
  const app = await createApp();

  // 端口一定要从环境变量 `LEANCLOUD_APP_PORT` 中获取。
  // LeanEngine 运行时会分配端口并赋值到该变量。
  const PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000);

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
