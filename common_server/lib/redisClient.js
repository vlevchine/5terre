/* Returns an open, configured connection to our Redis database. */
'use strict';

var redis = require('redis'),
    bluebird = require('bluebird'),
    logger = require('./logger').getLogger();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

function createClient(redisConfig) {
    if (!redisConfig) {
        throw 'Redis config missing.'
    }
    var client = redis.createClient(redisConfig.port, redisConfig.host, redisConfig.options);

    client.on("error", function (err) {
        logger.info("Error " + err);
    });
    client.on('connect', function () {
        logger.info("Session cache: successfully connected to redis server");
    });

    // monkeypatch to make lpush accept an array

    var origLpush = client.lpush.bind(client);

    client.lpush = function(key, args, callback) {

        if (Array.isArray(args) && args.length > 0 && typeof callback === 'function') {
            args.unshift(key);
            this.send_command('lpush', args, function(err, result) {
                callback(err, result);
            });
        } else {
            origLpush.apply(client, arguments);
        }
    };

    return client;
}

module.exports = {
    createClient: createClient
};


