/**
 * Created by bikov on 6/4/2017.
 */

let amqp = require('amqplib/callback_api'),
    Promise = require('bluebird'),
    promiseWhile = require('promise-while')(Promise),
    winston = require('winston');

function publish() {
    amqp.connect('amqp://bikov:blat@mq', function(err, conn) {
        if(err) return reconnectToMq(err);
        conn.on('close', function (reason) {
            return reconnectToMq(reason);
        });
        conn.createChannel(function(err, ch) {
            if(err) throw err;
            promiseWhile(
                function() {
                    return true; // infinite loop
                },
                function() {
                    return sendMessages(ch);
                }
            );
        });
    });
}
function sendMessages(ch) {
    return new Promise(function (resolve) {
        ch.assertQueue('', {exclusive: true}, function (err, q) {
            if (err) throw err;
            let corr = generateUuid(),
                consumerTag = generateUuid(),
                gotMessage = false;
            winston.info(`sending message with uuid: ${corr}`);

            ch.consume(q.queue, function (msg) {
                if (msg != null && msg.properties.correlationId == corr) {
                    gotMessage=true;
                    winston.info(`Got :'${msg.content.toString()}' answer from worker`);
                    resolve();
                }
            }, {consumerTag: consumerTag,noAck: true});
            let message;
            Math.random() >= 0.9 ? message = 'blat' : message = '1234';
            ch.sendToQueue('rpc_queue', new Buffer(message), {correlationId: corr, replyTo: q.queue});

            setTimeout(()=>{
                if(!gotMessage) {
                    winston.warn(`5 seconds no response, cancelling consume to callback`);
                    ch.cancel(consumerTag);
                    resolve();
                }
            },5000)
        })
    });
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