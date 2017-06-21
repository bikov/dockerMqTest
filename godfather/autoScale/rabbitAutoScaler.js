/**
 * Created by bikov on 6/21/2017.
 */
let rabbitInspector = require('./rabbitInspector'),
    docker = require('./docker'),
    winston = require('winston'),
    config = require('../config.json');

let numberOfRasps;
function startRaspAutoScale() {
    docker.getNumberOfRaspContainers(config.raspImageName)
        .then((num) => numberOfRasps = num)
        .then(() => winston.info(`rasp number on start is: ${numberOfRasps}`))
        .then(() => setInterval(scale,config.scale.inspectInterval));
}

function scale() {
    rabbitInspector.getReadyMessagesCount(config.rabbitmq.work_q)
        .then((msgsCount) => {
            winston.info(`number of rasps now is ${numberOfRasps}`);
            return msgsCount;
        })
        .then((msgsCount) => getScaleNumber(msgsCount,numberOfRasps))
        .then((scaleNumber) => {
            winston.info(`before increaseRaspsNumber function, scale number is ${scaleNumber}`);
            docker.increaseRaspsNumber(scaleNumber);
            return scaleNumber;
        })
        .then((scaleNumber) => numberOfRasps += scaleNumber)
        .then(() => winston.info(`after scale number of rasps is${numberOfRasps}`))
        .catch((err) => winston.error(`cannot scale because ${err}`))
}

function getScaleNumber(mesagesCount, curRaspCount, cb = () => {}) {
    return new Promise((resolve) => {
        let result = ((parseInt(mesagesCount,10) + parseInt(config.scale.extraRaspsCount,10)) - parseInt(curRaspCount,10));
        if(result < 0){
            result = 0;
        }
        winston.info(`in getScaleNumber function, returning result of ${result}`);
        resolve(result);
        cb(result);
    })
}

module.exports = {
    "startAutoScale" : startRaspAutoScale
};
