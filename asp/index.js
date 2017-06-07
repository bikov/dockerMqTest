let express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    app = express(),
    mqReader = require('./MqReader'),
    readSchema = require('./graphql/schemaReader').readSchema;



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// let schema = readSchema("http://localhost:50159", "/?");
// mqReader.read(schema);

module.exports = app;
