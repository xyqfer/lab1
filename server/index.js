const express = require('express');
const timeout = require('connect-timeout');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const AV = require('leanengine');
const { Nuxt, Builder } = require('nuxt');

const app = express();

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');
config.dev = process.env.NODE_ENV !== 'production';

// 设置默认超时时间
app.use(timeout('600s'));

// 加载云引擎中间件
app.use(AV.express());

app.enable('trust proxy');
// 需要重定向到 HTTPS
app.use(AV.Cloud.HttpsRedirect());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use(cookieParser());

app.use(cors({
    origin: '*',
}));

app.use((req, res, next) => {
    const ipAddress = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`${req.originalUrl}, user IP: ${ipAddress}`);
    next();
});

app.post('/api/deploy', require('../api/deploy'));
app.get('/api/wake', require('../api/wake'));

module.exports = async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await require('@nuxt/cli').run('build');
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  return app;
}
