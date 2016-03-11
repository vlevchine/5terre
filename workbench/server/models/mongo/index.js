"use strict";

var manager = require('../../lib/mongoConnectionManager'),
    logger = require('../../lib/logger').getLogger(),
    config = require('../../config/all'),
    CompanySchema = require('./company'),
    UserSchema = require('./user');

var User,
    companies,
    seedUsers =  function() {
        var date = new Date(), key;
        Company.find({}).exec(function(err, companies) {
            if(companies.length === 0) {
                logger.debug('No records found in Clients collection - creating 2 clients');
                Company.create({name: 'topGear', title: 'Top Gear', image: 'Jeremy-Clarkson.jpg', email: 'admin@topgear.com', apps: ['wellExplorer'], updated: date});
                Company.create({name: 'bigBangTheory', title: 'The Big Bang Theory', image: 'Jeremy-Clarkson.jpg', email: 'admin@bbtheory.com', apps: ['wellExplorer'], updated: date});
            } else {
                logger.debug("Companies defined: ", companies.length );
                config.companies = companies;
                var tg = companies.find(function(e) { return e.name === 'topGear'});
                //User.remove({}, function (err,t) { var r = err;});
                User.find({}).exec(function(err, users) {
                   if(users.length === 0) {
                        logger.debug('No records found in Users collection - creating 3 Top Gear users');
                        User.create({firstName:'Jeremy', lastName:'Clarkson', nick: 'Jezza', company: tg, title: 'Co-host', image: 'Jeremy-Clarkson.jpg', username:'clarkson', email: 'clarkson@topgear.com', password: 'jeremy', provider: 'local', apps: [{appId: 'wellExplorer', roles: ['admin'], groups: ['hosts'], claims: 63}], updated: date});
                        User.create({firstName:'Richard', lastName:'Hammond', nick: 'Hampster', company: tg, title: 'Co-host', image: 'Richard-Hammond.jpg', username:'hammond', email: 'hammond@topgear.com', password: 'richard', provider: 'local', apps: [{appId: 'wellExplorer', roles: ['powerUser'], groups: ['hosts'], claims: 63}], updated: date});
                        User.create({firstName:'James', lastName:'May', nick: 'Captain Slow', company: tg, title: 'Co-host', image: 'James-May.jpg', username:'may', email: 'may@topgear.com', password: 'james', provider: 'local', apps: [{appId: 'wellExplorer', roles: ['user'], groups: ['hosts'], claims: 63}], updated: date});
                    } else {
                        logger.debug("Users defined: ", users.length );
                    }
                });
            }
        });
    };
    var conn = manager.init(config.userStorage.connString, null, seedUsers),
    User = conn.model('User', UserSchema, 'user'),
    Company = conn.model('Company', CompanySchema, 'company');

module.exports= {
    User: User,
    Company: Company,
    companies: companies
}