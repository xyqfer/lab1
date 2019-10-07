const express = require('express');
const timeout = require('connect-timeout');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const AV = require('leanengine');

const app = express();

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

module.exports = app;
