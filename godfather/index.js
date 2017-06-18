let express = require('express'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    app = express(),
    mqPublisher = require('./MqPublisher'),
    redisCheck = require('./redis/redisCheck');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
mqPublisher.listen();


module.exports = app;
