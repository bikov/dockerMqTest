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
        .then((msgsCount) => getScaleNumber(msgsCount,numberOfRasps))
        .then((scaleNumber) => docker.increaseRaspsNumber(scaleNumber))
        .catch((err) => winston.error(`cannot scale because ${err}`))
}

function getScaleNumber(mesagesCount, curRaspCount, cb = () => {}) {
    return new Promise((resolve) => {
        let result = ((mesagesCount + config.scale.extraRaspsCount) - curRaspCount);
        if(result < 0){
            result = 0;
        }
        resolve(result);
        cb(result);
    })
}

module.exports = {
    "startAutoScale" : startRaspAutoScale
};
