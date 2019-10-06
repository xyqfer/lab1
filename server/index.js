const express = require('express');
const timeout = require('connect-timeout');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Nuxt, Builder } = require('nuxt');
const ip = require('ip');
const deployMiddleware = require('@xyqfer/deploy-middleware');

const app = express();

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');
config.dev = process.env.NODE_ENV !== 'production';

// 设置默认超时时间
app.use(timeout('600s'));

app.enable('trust proxy');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use(cookieParser());

app.use(cors({
    origin: '*',
}));

app.use((req, res, next) => {
    const ipAddress = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (!ip.isPrivate(ipAddress)) {
      console.log(`${req.originalUrl}, user IP: ${ipAddress}`);
    }
    next();
});

app.use(deployMiddleware({
  branch: 'f7-dev',
}));

app.get('/', (req, res) => {
  res.send('this is home page');
});

module.exports = async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)
  return app;
}
