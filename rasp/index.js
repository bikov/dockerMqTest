let express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    app = express(),
    mqReader = require('./MqListener'),
    winston = require('winston');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

mqReader.listen();
winston.info(`running in docker, docker id:${process.env.HOSTNAME}`);

module.exports = app;
