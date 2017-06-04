/**
 * Created by bikov on 6/4/2017.
 */

let amqp = require('amqplib/callback_api');

function sandMessages(ch, conn) {
    ch.assertQueue('', {exclusive: true}, function (err, q) {
        if (err) throw err;
        let corr = generateUuid();
        console.log(`sending message with uuid: ${corr}`);

        ch.consume(q.queue, function (msg) {
            if (msg.properties.correlationId == corr) {
                console.log(' [.] Got %s', msg.content.toString());
                setTimeout(function () {
                    console.log('closing');
                    conn.close();
                    process.exit(0)
                }, 5);
            }
        }, {noAck: true});
        let message;
        Math.random() >= 0.8 ? message = 'blat' : message = '1234';
        ch.sendToQueue('rpc_queue', new Buffer(message), {correlationId: corr, replyTo: q.queue});
    });
}
function send() {
    amqp.connect('amqp://bikov:blat@localhost', function(err, conn) {
        if(err) throw err;
        conn.createChannel(function(err, ch) {
            if(err) throw err;
            sandMessages(ch, conn);
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