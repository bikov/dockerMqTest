let request = require('request'),
    winston = require('winston');


let count_url = "http://bikov:blat@127.0.0.1:8080/api/queues/%2f/rpc_queue";

request({
    url : count_url
}, function(error, response, body) {
    if (error) {
        winston.error("Unable to fetch Queued Msgs Count" + error);
        return;
    }
    else
    {
        var queueInfo = JSON.parse(body);

        if (queueInfo.hasOwnProperty("messages_unacknowledged")) {
            var unackedMessageCount = JSON.stringify(queueInfo.messages_unacknowledged);
            winston.info("message.messages_ready=" + unackedMessageCount);
        }else {
            winston.error(`queue info object hasn't property messages_unacknowledged, the queue info object is: '${queueInfo}' `);
        }
    }
});

function getUnackedmessages() {

}