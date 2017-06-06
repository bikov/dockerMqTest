/**
 * Created by bikov on 6/4/2017.
 */

let amqp = require('amqplib/callback_api');

function read() {
    amqp.connect('amqp://bikov:blat@mq', function(err, conn) {
        if(err) throw err;
        conn.createChannel(function (err, ch) {
            var q = 'rpc_queue';

            ch.assertQueue(q, {durable: false});
            ch.prefetch(1);
            console.log(' [x] Awaiting RPC requests');
            ch.consume(q, function reply(msg) {
                console.log(`got message ${msg.content.toString()}`);
                let timeOut = 0,
                    randomResponse = Math.random() >= 0.5;
                if(msg.content.toString() === 'blat'){
                    timeOut = 10000;
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

module.exports = {
    "read": read
};