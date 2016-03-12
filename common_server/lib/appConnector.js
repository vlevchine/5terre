/**
 * Messages are converted to objects which should contain 'sender' field
 * duplex messages should be checked by nonce
 */

var redisClient = require("./redisClient"),
    _ = require('lodash'),
    uuid = require('node-uuid'),
    security = require('./security');


function Channel(name, sender) {
    this.name =  name;
    this.sender = sender;
}

Channel.prototype.wrapMessage = function(msg) {
    var body = _.isString(msg) ? { message: msg } : msg;
    body.sender = this.sender;
    return body;
};

Channel.prototype.destroy = function() {
    this.cb = null;
};

Channel.prototype.handleWith = function(cb) {
    this.cb = cb;
    return this;
};

Channel.prototype.setNonce = function() {
    this.nonce = uuid.v1();

    return this;
};

Channel.prototype.clearNonce = function() {
    if (this.nonce) {
        this.nonce = null;
    }

    return this;
};

Channel.prototype.process = function(payload) {
    if (this.cb && this.payloadValid(payload)) {
        this.clearNonce();
        this.cb(payload);
    }
};

Channel.prototype.payloadValid = function(payload) {
    return payload.sender === this.sender && (
            !payload.nonce || (payload.nonce === this.nonce)
        );
};

Channel.prototype.publish = function(conn, msg, duplex) {
    var payload = this.wrapMessage(msg);
    if (duplex) { this.setNonce(); }
    return conn.publish(this.name, payload);
};


///////////////////
function AppConnector(clientId, options) {
    this.client = redisClient.createClient(options);
    this.clientId = clientId;
    this.channels = [];

    var self = this;
    this.client.on("message", function (channelName, message) {
        var channel = self.findChannel(channelName);
        if (channel) {
            channel.process(JSON.parse(message));
        }
    });
}

AppConnector.prototype.findChannel = function(name) {
    return this.channels.find(function(e) { return e.name === name; });
};

AppConnector.prototype.getChannel = function(name, duplex) {
    return this.findChannel(name) || new Channel(name, this.clientId, duplex);
};

AppConnector.prototype.close = function() {
    this.channels.forEach(function(e) { e.destroy(); });
    this.client.unsubscribe();
    this.client.quit();
    this.client = null;
};

//subscription to one-way messages
AppConnector.prototype.subscribeTo = function(channel, cb) {
    if (!channel || !cb) { throw 'App connector subscription paramemeter missing.'; }
    this.getChannel(channel).handleWith(this.client, cb);

    return this;
};

//send and forget
AppConnector.prototype.sendOneWay = function(channel, data) {
    return this.getChannel(channel).publish(this.client, data);
};

//send / expect response
AppConnector.prototype.sendDuplex = function(channelName, data, cb) {
    if (!channelName || !cb) { throw 'App connector subscription paramemeter missing.'; }

    this.getChannel(channelName)
        .handleWith(this.client, cb)
        .publish(this.client, data, true);
};

//setting up response for incoming messages to support duplex channels
AppConnector.prototype.respond = function(channelName, op) {
    var self = this,
        channel = this.getChannel(channelName).handleWith(respond);

    function respond(body) {
        var reply = op(body);
        channel.publish( _.assign(reply, {receivedFrom: body.sender, nonce: body.nonce}))
    }

    return this;
};


module.exports = AppConnector;



