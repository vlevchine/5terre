/**
 * Created by valev on 2016-03-11.
 */

var security = require('./lib/security'),
    config = require('./config/all'),
    logger = require('./lib/logger').getLogger();

var registedClients = {},
    REGISTER = 'register',
    connector;

function handleRequest(req) {

}

function register(payload) {
    logger.info('Register client: ' + payload.sender);
    if (config.clients.indexOf(payload.sender) === -1) { return; }

    var id = payload.sender + '-' + new Date().valueOf(),
        reqChannel = payload.sender + '.' + config.clientId,
        msg = {
            clientId: id,
            clientSecret: security.createDigest(id),
            redirect: payload.redirect,
            reqChannel: reqChannel,
            authEndpoint: config.authEndpoint,
            tokenEndpoint: config.tokenEndpoint
        };

    registedClients[payload.sender] = msg;
    connector.repond(reqChannel, handleRequest);
    return msg;
}

function manageRegistration(conn) {
    connector = conn;
    connector.respond(REGISTER, register)
}

module.exports = {
    manageRegistration: manageRegistration,
    register: register
};