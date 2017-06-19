/**
 * Created by bikov on 6/11/2017.
 */
let winston = require('winston'),
    daily = require('winston-daily-rotate-file');

module.exports = function(){
    winston.add(winston.transports.DailyRotateFile, {
        filename:'../logs/rasp.log',
        datePattern: 'yyyy-MM-dd.',
        prepend: true,
        level: process.env.ENV === 'development' ? 'debug' : 'info'
    });

    winston.cli();
};