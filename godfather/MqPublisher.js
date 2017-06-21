/**
 * Created by bikov on 6/4/2017.
 */

let amqp = require('amqplib/callback_api'),
    Promise = require('bluebird'),
    winston = require('winston'),
    dockerHelper = require('./autoScale/docker');

function publish(id) {
    amqp.connect(process.env.MQ_URL || 'amqp://bikov:blat@localhost', function(err, conn) {
        if(err) return reconnectToMq(err);
        conn.on('close', function (reason) {
            return reconnectToMq(reason);
        });
        conn.createChannel(function(err, ch) {
            if(err) throw err;
            setInterval(()=>sendMessages(ch,id),250);
        });
    });
}

function sendMessages(ch, id) {
    return new Promise(function (resolve) {
        ch.assertQueue('', {exclusive: true}, function (err, q) {
            if (err) throw err;
            let corr = generateUuid(),
                workingDockerId = null,
                gotMessage = false,
                consumerTag = generateUuid();
            winston.info(`sending message with uuid: ${corr} from id: ${id}`);
            ch.consume(q.queue, function (msg) {
                let message;
                if(msg && msg.properties.correlationId == corr)
                {
                    if(!workingDockerId){
                        winston.info(`working docker id is:${msg.content.toString()} for uuid: ${corr}`);
                        workingDockerId = msg.content.toString();
                        setTimeout(()=> {
                            if (!gotMessage) {
                                winston.warn(`time out rerached and not got message for uuid:${corr}`);
                                killDocker(workingDockerId, ch, q, consumerTag, resolve);
                            }
                        }, 5000)
                    }
                    else{
                        gotMessage = true;
                        winston.info(`Got :'${msg.content.toString()}' answer from worker. his id is: ${workingDockerId}`);
                        ch.deleteQueue(q.queue);
                        ch.cancel(consumerTag);
                        resolve();
                    }
                }
            }, {consumerTag: consumerTag,noAck: true});
            Math.random() >= 0.9 ? message = 'blat'+new Date().getTime() : message = '1234';
            ch.sendToQueue('rpc_queue', new Buffer(message + `id:${id}`), {correlationId: corr, replyTo: q.queue,expiration:3000},function () {
                winston.info('setting timeout!-------------------------------------------------------------------------------------------');
                setTimeout(()=>{
                    if(!workingDockerId)
                        winston.error(`message by uuid: ${corr} expired and lost!`)
                },300)
            });
        })
    });
}


function killDocker(workingDockerId, ch, q, consumerTag, resolve) {
    winston.warn(`5 seconds no response, cancelling consume to callback and killing docker with id: ${workingDockerId}`);
    ch.deleteQueue(q.queue);
    ch.cancel(consumerTag);
    dockerHelper.restartDocker(workingDockerId).then(resolve).catch(()=> {
        winston.error(`unnable to kill container with id ${workingDockerId}`);
        resolve();
    });
    //resolve();
}
function onMessage(msg, ch, q, consumerTag, resolve, corr, id) {

}

function reconnectToMq(reason) {
    winston.warn(`Lost connection to RMQ because:${reason}.  Reconnecting in 3 seconds...`);
    return (setTimeout(publish, 3000));
}

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

module.exports = {
    "listen": publish
};