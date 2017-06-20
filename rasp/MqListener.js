/**
 * Created by bikov on 6/4/2017.
 */

let amqp = require('amqplib/callback_api'),
    winston = require('winston');

let dockerId = process.env.HOSTNAME || 'test';
function listen() {
    amqp.connect(process.env.MQ_URL || 'amqp://bikov:blat@localhost', function(err, conn) {
        if(err) return reconnectToMq(err);
        conn.on('close', function (reason) {
            return reconnectToMq(reason);
        });
        conn.createChannel(function (err, ch) {
            var q = 'rpc_queue';
            ch.assertQueue(q);
            ch.prefetch(1);
            winston.info('Listening to work');
            consumerTag = generateUuid();
            ch.consume(q, function reply(msg) {
                //ch.ack(msg);
                winston.info(`got message ${msg.content.toString()}`);
                let toAck = true;
                ch.sendToQueue(msg.properties.replyTo,
                    new Buffer(dockerId),
                    {correlationId: msg.properties.correlationId});
                let timeOut = 0,
                    randomResponse = Math.random() >= 0.5;
                if(msg.content.toString().startsWith("blat")){
                    timeOut = 3000;
                    toAck = false;
                    randomResponse = 'failed'
                }
                setTimeout(()=> {
                    if(toAck) {
                        winston.info(`sending response: ${randomResponse}`);
                        ch.sendToQueue(msg.properties.replyTo,
                            new Buffer(randomResponse.toString()),
                            {correlationId: msg.properties.correlationId});
                        ch.ack(msg);
                    }else{
                        winston.info('exiting without ackeing!!!!!!1')
                        ch.deleteQueue(q.queue);
                        ch.cancel(consumerTag);
                        conn.close();
                    }
                },timeOut);
            },{consumerTag: consumerTag});
        });
    });
}
function reconnectToMq(reason) {
    winston.warn(`Lost connection to RMQ because:${reason}.  Reconnecting in 3 seconds...`);
    return (setTimeout(listen, 3000));
}

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

module.exports = {
    "listen": listen
};