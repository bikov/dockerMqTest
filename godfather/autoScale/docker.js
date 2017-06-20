/**
 * Created by bikov on 6/18/2017.
 */
let Docker = require('dockerode'),
    winston = require('winston');

function restartDocker(id, cb = ()=>{}) {
    return new Promise((resolve,reject)=> {
        let docker = new Docker(),
            container = docker.getContainer(id);
        winston.info(`restarting container with id ${id} !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        container.restart({t: 0}, (err, data)=>{
            if(err) {
                reject(err);
                return cb(err);
            }
            winston.info(`container with id ${id} restarted, data: ${data}`);
            resolve(data);
            cb(null, data);
        })
    });
}

module.exports = {
    "restartDocker": restartDocker
};