/**
 * Created by bikov on 6/18/2017.
 */
let Docker = require('dockerode'),
    winston = require('winston');

function restartDocker(id, cb = ()=>{}) {
    return new Promise((resolve,reject)=> {
        winston.info(`restarting container with id  ${id}`);
        let docker = new Docker(),
            container = docker.getContainer(id);

        container.kill({t:0})
            .then(function (container) {
                return container.remove()
            }).then(function (data) {
            winston.info(`container by id ${id} killed and removed`)
        }).then(() => docker.createContainer({
            Image: 'bikov/rasp',
            Env:["MQ_URL=amqp://bikov:blat@mq","REDIS_URL=redis"],
            NetworkingConfig:{
                EndpointsConfig:{
                    dockermqtest_default:{
                        Links:["dockermqtest_rabbit_1:mq","dockermqtest_redis_1:redis"]
                    }
                }
            }
        }))
            .then((container) => {
                winston.info(`container by id ${container.id} started!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
                return container.start()
            })
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

function createRaspContainer(docker) {
    return docker.createContainer({
        Image: 'bikov/rasp',
        HostConfig:{
            Links: ["rabbit:mq","redis:redis"]
        }
    })
}

module.exports = {
    "restartDocker": restartDocker
};