let amqp = require('amqplib/callback_api');
let queryValidator = require('./graphql/validator/requestValidator'),
    redis = require("../godfather/redis/redis");
winston = require('winston');


function listen() {
    amqp.connect(process.env.MQ_URL || 'amqp://bikov:blat@localhost', function (err, conn) {
        if (err) return reconnectToMq(err);
        conn.on('close', function (reason) {
            return reconnectToMq(reason);
        });
        conn.createChannel(function (err, ch) {
            let q = 'rpc_queue';

            ch.assertQueue(q, {durable: false});
            ch.prefetch(1);
            winston.info('Listening to work');
            ch.consume(q, (msg) => {
                validate(msg.content)
                    .then((validateResponse) =>{
                        ch.sendToQueue(msg.properties.replyTo,
                            new Buffer(validateResponse.toString()),
                            {correlationId: msg.properties.correlationId});
                        ch.ack(msg);
                    })
            });
        });
    });
}

function validate(request) {
    return redis.getGql(request['version'])
        .then((schema) => queryValidator.validateQuery(schema, request["query"]));
}

function reconnectToMq(reason) {
    winston.warn(`Lost connection to RMQ because:${reason}.  Reconnecting in 3 seconds...`);
    return (setTimeout(listen, 3000));
}


module.exports = {
    "listen": listen
};