'use strict';

function base64Encode(str) {
    return new Buffer(str).toString('base64');
}

function base64Decode(str) {
    return new Buffer(str, 'base64').toString();
}

function sign(str, key) {
    return crypto.createHmac('sha256', key).update(str).digest('base64');
}

function verify(raw, secret, signature) {
    return signature === sign(raw, secret);
}

var crypto = require('crypto'),
    bcrypt = require('bcrypt-nodejs'),
    defaultCryptoConf = {
        bcyptSeed: 10,
        workFactor: 5000,
        keyLength: 32,
        randomSize: 128
    },
    createSalt = function(bytes) {
        return crypto.randomBytes(bytes || defaultCryptoConf.randomSize).toString('base64');
        //return new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    },

//instance method for hashing a password
    hashPassword = function(salt, password, config) {
        var conf = config || defaultCryptoConf;
        return !salt ? password :
            crypto.pbkdf2Sync(password, salt, conf.workFactor, conf.keyLength).toString('base64');
    },

    hashPasswordSha = function(salt, password) {
        return !salt ? password :
            crypto.createHmac('sha1', salt).update(password).digest('hex');
    },

    hashPasswordBcrypt = function(user, seed) {
        return bcrypt.getSalt(seed || defaultCryptoConf.bcyptSeed, function(err, salt) {
            if(err) { return next(err); }
            user.salt = salt;
            bcrypt.hash(user.password, user.salt, null, function(err, hash) {
                if(err) { return next(err); }
                user.password = hash;
                next();
            });
        });
    },

    encodeToken = function(payload, secret) {
        var header = {typ: 'JWT', alg: 'HS256'},
            jwt = base64Encode(JSON.stringify(header))+ '.' + base64Encode(JSON.stringify(payload));
        return jwt + '.' + sign(jwt, secret);
    },

    decodeToken = function(token, secret) {
        var toks = token.split('.');

        if (toks.length !== 3) { throw new Error('Token format incorrect')}
        var header = JSON.parse(base64Decode(toks[0])),
            payload = JSON.parse(base64Decode(toks[1])),
            rawSignature = toks[0] + '.' + toks[1];
        if (!verify(rawSignature, secret, toks[2])) { throw new Error('Token verification failed')}

        return payload;
    },

    encryptAesSha256 = function(salt, textToEncrypt) {
        var cipher = crypto.createCipher('aes-256-cbc', salt);
        var crypted = cipher.update(textToEncrypt, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    };

//Auth
function authenticate(req, res, next) {
    passport.authenticate('local', function(err, user) {
        if(err) {return next(err);}
        if(!user) { res.send({success:false})}
        req.logIn(user, function(err) {
            if(err) {return next(err);}
            res.redirect('/');//.send({success:true, user: user});
        })
    })(req, res, next);
};

function requiresApiLogin(req, res, next) {
    //req.headers['x-access-token']
    //if (decoded.exp <= Date.now()) {
    //    res.end('Access token has expired', 400);
    //}
    if(!req.isAuthenticated()) {//TBD: authorized
        res.status(403);
        res.end();
    } else {
        next();
    }
};

function requiresRole(role) {
    return function(req, res, next) {
        if(!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
            res.status(403);
            res.end();
        } else {
            next();
        }
    }
}

module.exports = {
    base64Encode: base64Encode,
    base64Decode: base64Decode,
    createSalt: createSalt,
    hashPasswordStrong: hashPassword,
    hashPasswordSha: hashPasswordSha,
    hashPasswordBcrypt: hashPasswordBcrypt,
    encodeToken: encodeToken,
    decodeToken: decodeToken,
    authenticate: authenticate,
    requiresApiLogin: requiresApiLogin,
    requiresRole: requiresRole
};