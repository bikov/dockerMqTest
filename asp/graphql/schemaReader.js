import {

    introspectionQuery,

    introspectionQuerySansSubscriptions,

} from 'introspectionQueries';


import {buildClientSchema} from 'graphql';
import * as http from "http";


export function readSchema(host) {
        sendIntro(introspectionQuerySansSubscriptions, host)
            .then((result) => buildClientSchema(result))
}


function sendIntro(introQuery, host) {
    return new Promise(function (resolve, reject) {
        const post_options = {
            host: host,
            port: '80',
            path: '/graphql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(introQuery)
            }
        };

        let post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                resolve(chunk);
            });
        });

        post_req.write(introQuery);
        post_req.end();
    })
}
