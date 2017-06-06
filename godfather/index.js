let express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    app = express(),
    mqPublisher = require('./MqPublisher');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

mqPublisher.read();


module.exports = app;
