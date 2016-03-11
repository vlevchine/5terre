//Here we collect all the properties defined in common location (both dev and prod) in a config folder above Gateway root
//plus app-specific properties defined here in files development.js and production.js

var common = require('../config_common/all'),
    all = require('./all'),
    env = specific = require('./' +(process.env.NODE_ENV || 'development') ) || {},
    _ = require('lodash');

var overall = _.extend({
        root: './bin',
        clientId: 'workbench',
        serverName: 'identityServer',
        title: "Workbench",
        version: '1.0.0',
        anonimousAccess: true,
        claims: {
            wells: 1,
            well: 2,
            projects: 4,
            project: 8,
            notifications: 16
        },
        templateEngine: 'ejs',
        crypto: {
            workFactor: 5000,
            keyLength: 32,
            randomSize: 256
        },
        passwordSecret: 'secret',
        apiSecret: 'apisecret',
        loginURL: '/login',
        sessionValid: {days: 0, hours: 0, mins: 5},
        refreshTokenLifeRatio: 3,
        sessionSecret: 'MeanSecret',
        sessionCollection: 'sessions',
    }, common.all, all, env);

overall.port = env.port || '3000';
overall.host = 'http://' + overall.baseURL + ':' + overall.port;

module.exports = overall;