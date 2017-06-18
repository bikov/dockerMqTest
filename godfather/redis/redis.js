/**
 * Created by bikov on 6/11/2017.
 */
var redis = require('redis'),
    Promise = require('bluebird');


let client = {};
if(process.env.REDIS_URL){
    client = redis.createClient({host:process.env.REDIS_URL})
}else {
    client = redis.createClient();
}


client.on('error', function (err) {
    console.log(`Error ${err}`);
});

module.exports= {
    getJir : function getJir(version, cb = () => {}){
        return getScheme(version, 'jir', cb);
    },
    getGql : function getGql(version,cb = () => {}) {
        return getScheme(version, 'gql', cb);
    },

    setJir : function setJir(version, value, cb = () => {}){
        return setScheme(version, 'jir', value, cb);
    },

    setGql : function setGql(version, value, cb = () => {}){
        return setScheme(version, 'gql', value, cb);
    }
};

function setScheme(version, shemeType, value, cb){
    return new Promise((resolve, reject)=>{
        client.set(`${version}-${shemeType}`, value,(err,res) => {
            if(err){
                reject(err);
                return cb(err);
            }
            resolve(res);
            cb(null, res);
        })
    })
}

function getScheme(version, shemeType, cb){
    return new Promise((resolve,reject)=>{
        client.get(`${version}-${shemeType}`,(err,res) => {
            if(err){
                reject(err);
                return cb(err);
            }
            resolve(res);
            cb(null, res);
        })
    })
}