let amqp = require('amqplib/callback_api');
let queryValidator = require('./graphql/validator/requestValidator'),
    winston = require('winston');

function listen(schema) {
    amqp.connect(process.env.MQ_URL || 'amqp://bikov:blat@localhost', function(err, conn) {
        if(err) return reconnectToMq(err);
        conn.on('close', function (reason) {
            return reconnectToMq(reason);
        });
        conn.createChannel(function (err, ch) {
            let q = 'rpc_queue';

            ch.assertQueue(q, {durable: false});
            ch.prefetch(1);
            winston.info('Listening to work');
            ch.consume(q, function reply(msg) {
                let validationResponse = queryValidator.validateQuery(schema, query);
                let timeOut = 0;
                setTimeout(()=> {
                    ch.sendToQueue(query.properties.replyTo,
                        new Buffer(validationResponse.toString()),
                        {correlationId: query.properties.correlationId});
                    ch.ack(query);
                }, timeOut);
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