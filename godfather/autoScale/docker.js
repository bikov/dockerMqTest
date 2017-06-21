/**
 * Created by bikov on 6/18/2017.
 */
let Docker = require('dockerode'),
    winston = require('winston');

function restartRaspDocker(id, cb = ()=>{}) {
    return new Promise((resolve,reject)=> {
        winston.info(`restarting container with id  ${id}`);
        let docker = new Docker(),
            container = docker.getContainer(id);

        container.kill({t:0})
            .then(function (container) {
                return container.remove()
            }).then(function (data) {
                winston.info(`container by id ${id} killed and removed`)
            }).then(() => startNewRasp(docker))
            .then((container) => {
                winston.info(`container with id ${container.id} started`);
                resolve(container);
                cb(null,container);
            })
            .catch((err) => {
                winston.error(`Unable to restart container with id ${container.id} because ${err}`);
                reject(err);
                cb(err);
            })
        });
}

function startNewRasp(docker, cb = ()=>{}) {
    return new Promise(function (resolve, reject) {
        docker.createContainer({
            Image: 'bikov/rasp',
            Env: ["MQ_URL=amqp://bikov:blat@mq", "REDIS_URL=redis"],
            NetworkingConfig: {
                EndpointsConfig: {
                    dockermqtest_default: {
                        Links: ["dockermqtest_rabbit_1:mq", "dockermqtest_redis_1:redis"]
                    }
                }
            }
        }).then((container) => {
            return container.start()
        }).then((container) => {
            resolve(container);
            cb(null, res);
        }).catch((err)=> {
            reject(err);
            return cb(err);
        })
    })
}

module.exports = {
    "restartRaspDocker": restartRaspDocker
};