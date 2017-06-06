let express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    app = express(),
    mqReader = require('./MqReader');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

mqReader.read();


module.exports = app;
