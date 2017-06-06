/**
 * Created by bikov on 6/4/2017.
 */

let amqp = require('amqplib/callback_api');

import {validateQuery} from './graphql/validator/requestValidator';



function read(schema) {
    amqp.connect('amqp://bikov:blat@localhost', function(err, conn) {
        if(err) throw err;
        conn.createChannel(function (err, ch) {
            let q = 'rpc_queue';

            ch.assertQueue(q, {durable: false});
            ch.prefetch(1);
            console.log(' [x] Awaiting RPC requests');
            ch.consume(q, function reply(query) {
                let validationResponse = validateQuery(schema, query);
                let timeOut = 0;
                setTimeout(()=> {
                    ch.sendToQueue(query.properties.replyTo,
                        new Buffer(validationResponse.toString()),
                        {correlationId: query.properties.correlationId});
                    ch.ack(query);
                },timeOut);
            });
        });
    });
}

module.exports = {
    "read": read
};