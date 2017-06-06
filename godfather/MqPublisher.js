/**
 * Created by bikov on 6/4/2017.
 */

let amqp = require('amqplib/callback_api'),
    Promise = require('bluebird'),
    promiseWhile = require('promise-while')(Promise);

function sendMessages(ch) {
    return new Promise(function (resolve) {
        ch.assertQueue('', {exclusive: true}, function (err, q) {
            if (err) throw err;
            let corr = generateUuid();
            console.log(`sending message with uuid: ${corr}`);

            ch.consume(q.queue, function (msg) {
                if (msg.properties.correlationId == corr) {
                    console.log(' [.] Got %s', msg.content.toString());
                    resolve();
                }
            }, {noAck: true});
            let message;
            Math.random() >= 0.9 ? message = 'blat' : message = '1234';
            ch.sendToQueue('rpc_queue', new Buffer(message), {correlationId: corr, replyTo: q.queue});
        })
    });
}
function send() {
    amqp.connect('amqp://bikov:blat@mq', function(err, conn) {
        if(err) throw err;
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

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

module.exports = {
    "read": send
};