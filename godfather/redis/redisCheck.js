/**
 * Created by bikov on 6/11/2017.
 */
let redis = require('./redis'),
    winston = require('winston');

// redis.setGql('1.5', 'test set and get gql')
//     .then(()=> winston.info('gql set to redis'))
//     .then(()=> redis.getGql('1.5'))
//     .then((val) => winston.info(`got gql from redis: ${val}`));
//
// redis.setJir('1.5', 'test set and get jir')
//     .then(()=> winston.info('jir set to redis'))
//     .then(()=> redis.getJir('1.5'))
//     .then((val) => winston.info(`got jir from redis ${val}`));

redis.getGql('1515151')
    .then((val)=>winston.info(val));