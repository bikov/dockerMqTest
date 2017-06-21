/**
 * Created by bikov on 6/18/2017.
 */
let Docker = require('dockerode'),
    winston = require('winston'),
    docker = new Docker()

function restartRaspDocker(id, cb = ()=>{}) {
    return new Promise((resolve,reject)=> {
        winston.info(`restarting container with id  ${id}`);
        let container = docker.getContainer(id);

        container.kill({t:0})
            .then((container) => container.remove())
            .then((data) => winston.info(`container by id ${id} killed and removed`))
            .then(startNewRasp)
            .then((container) => {
                resolve(container);
                cb(null,container);
            })
            .catch((err) => {
                reject(err);
                cb(err);
            })
        });
}

function startNewRasp(cb = ()=>{}) {
    return new Promise(function (resolve, reject) {
        winston.info(`Starting Rasp container`);
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
            winston.info(`new rasp container started with id: ${container.id}`);
            resolve(container);
            cb(null, res);
        }).catch((err)=> {
            winston.error(`Unable to restart container with id ${container.id} because ${err}`);
            reject(err);
            return cb(err);
        })
    })
}

function getNumberOfRaspContainers(imageName, cb=()=>{}) {
    return new Promise((resolve, reject) => {
        docker.listContainers(function (err, containers) {
            if(err){
                reject(err);
                return cb(err);
            }
            let count = 0,
                itemProssesed = 0;
            containers.forEach(function (containerInfo) {
                itemProssesed++;
                if(containerInfo.Image.toString() === imageName){
                    count++;
                }
                if(itemProssesed === containers.length){
                    winston.info(`Now is ${count} Rasps running`);
                    resolve(count);
                    cb(null,count);
                }
            });
        });
    });
}

function increaseRaspsNumber(number) {
    winston.info(`increasing number of rasps by ${number}`);
    for(let i=0;i<number;i++){
        startNewRasp()
    }
}

module.exports = {
    "restartRaspDocker": restartRaspDocker,
    "getNumberOfRaspContainers":getNumberOfRaspContainers,
    "increaseRaspsNumber" : increaseRaspsNumber
};