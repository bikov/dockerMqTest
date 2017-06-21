/**
 * Created by bikov on 6/21/2017.
 */
let request = require('request'),
    config = require('../config.json'),
    winston = require('winston');

function getReadyMessagesCount(queueName, cb = ()=> {}) {
    return new Promise(function (resolve, reject) {
        let count_url = `http://${config.rabbitmq.user}:${config.rabbitmq.password}@${config.rabbitmq.url}:15672/api/queues/%2f/${queueName}`;
        request({
            url : count_url
        }, function(err, response, body) {
            if (err) {
                winston.error(`Unable to fetch Queued Message Count because: ${err}`);
                reject(err);
                return cb(err);
            }
            else {
                let message = JSON.parse(body);

                if (message.hasOwnProperty("messages_ready")) {
                    // this DOES NOT COUNT UnAck msgs
                    let msg_ready = JSON.stringify(message.messages_ready);
                    winston.info(`ready messages count on rabbit is :${msg_ready}`);
                    resolve(msg_ready);
                    return cb(null, msg_ready);
                }
                // if (message.hasOwnProperty("messages")) {
                //     // _messages_ total messages i.e including unAck
                //     var msg = JSON.stringify(message.messages);
                //     console.log("message.messages=" + msg);
                // }
            }
        })
    })
}

module.exports = {
    "getReadyMessagesCount":getReadyMessagesCount
};