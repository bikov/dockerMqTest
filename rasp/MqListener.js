/**
 * Created by bikov on 6/4/2017.
 */

let amqp = require('amqplib/callback_api'),
    winston = require('winston');

function listen() {
    let dockerid = process.env.HOSTNAME || 'unnable to find docker id';
    amqp.connect(process.env.MQ_URL || 'amqp://bikov:blat@localhost', function(err, conn) {
        if(err) return reconnectToMq(err);
        conn.on('close', function (reason) {
            return reconnectToMq(reason);
        });
        conn.on('error', (err) =>{
            winston.error(`rabbit mq connection error: ${err}`);
        });
        conn.createChannel(function (err, ch) {
            var q = 'rpc_queue';

            ch.assertQueue(q, {durable: false});
            ch.prefetch(1);
            winston.info('Listening to work');
            ch.consume(q, function reply(msg) {
                winston.info(`got message ${msg.content.toString()} with uuid: ${msg.properties.correlationId}`);
                ch.sendToQueue(msg.properties.replyTo,
                    new Buffer(dockerid),
                    {correlationId: msg.properties.correlationId});
                let timeOut = 0,
                    randomResponse = Math.random() >= 0.5;
                if(msg.content.toString().startsWith('blat')){
                    timeOut = 7000;
                    winston.wern(`message with uuid: ${msg.properties.correlationId} going to slip for ${timeOut}ms`);
                    randomResponse = 'failed'
                }
                setTimeout(()=> {
                    try {
                        ch.sendToQueue(msg.properties.replyTo,
                            new Buffer(randomResponse.toString()),
                            {correlationId: msg.properties.correlationId});
                        ch.ack(msg);
                    }catch(err) {
                        winston.error(`unnable to return answer for work: ${msg.properties.correlationId}`);
                    }
                },timeOut);
            });
        });
    });
}
function reconnectToMq(reason) {
    winston.warn(`Lost connection to RMQ because:${reason}.  Reconnecting in 3 seconds...`);
    return (setTimeout(listen, 3000));
}


module.exports = {
    "listen": listen
};