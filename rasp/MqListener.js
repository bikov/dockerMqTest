/**
 * Created by bikov on 6/4/2017.
 */

let amqp = require('amqplib/callback_api'),
    winston = require('winston');

function listen() {
    amqp.connect('amqp://bikov:blat@mq', function(err, conn) {
        if(err) return reconnectToMq(err);
        conn.on('close', function (reason) {
            return reconnectToMq(reason);
        });
        conn.createChannel(function (err, ch) {
            var q = 'rpc_queue';

            ch.assertQueue(q, {durable: false});
            ch.prefetch(1);
            winston.info('Listening to work');
            ch.consume(q, function reply(msg) {
                winston.log(`got message ${msg.content.toString()}`);
                let timeOut = 0,
                    randomResponse = Math.random() >= 0.5;
                if(msg.content.toString() === 'blat'){
                    timeOut = 7000;
                    randomResponse = 'failed'
                }
                setTimeout(()=> {
                    ch.sendToQueue(msg.properties.replyTo,
                        new Buffer(randomResponse.toString()),
                        {correlationId: msg.properties.correlationId});
                    ch.ack(msg);
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