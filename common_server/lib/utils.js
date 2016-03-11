/**
 * Created by Vlad on 2015-03-21.
 */
'use strict';

//var Q = require('Q');
//
//function asPromise(query) {
//    var deferred = Q.defer();
//    query(function (err, data) {
//        if (err) deferred.reject(err) // rejects the promise with `er` as the reason
//        else deferred.resolve(data) // fulfills the promise with `data` as the value
//    })
//    return deferred.promise; // the promise is returned
//}

function getErrorMessage(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].
                message;
        }
    } else {
        return 'Unknown server error';
    }
}

function sendJSON(res, code, data) {
    res.set('Content-Type', 'application/json');
    res.status(code)
        .send(data);
}

function reply(res, err, data, options) {
    if (err) {
		res.status(options.status || 400).send({ message: getErrorMessage(err) });
    } else if (!data) {
        sendJSON(res, options.noDataMsg || 'no data found', options.status || 404);
    }
    res.status(options.status || 200).send(data);
}

function base64Encode(str) {
    return new Buffer(str).toString('base64');
}

function base64Decode(str) {
    return new Buffer(str, 'base64').toString('ascii');
}

function randomString(length) {
    "use strict";
    var ln = length || 12,
        chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        result = '';
    for (var i = 0; i < ln; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        result += chars.substring(rnum, rnum+1)
    }

    return result;
}

function toMinutes(span) {
    return (span.days || 0) * 1440 + (span.hours || 0) * 60 + (span.mins || 0);
}

module.exports = {
 //   asPromise: asPromise,
    sendJSON: sendJSON,
    reply: reply,
    randomString: randomString,
    toMinutes: toMinutes
};