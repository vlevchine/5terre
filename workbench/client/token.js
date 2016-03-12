'use strict';

var storage = window.localStorage,
    Token = function(key) {
        this.key = key;
    };

Token.prototype.setToken = function(token) {
    this.cache = token;
    if (!!token) {
        storage.setItem(this.key, token);
    }
};

Token.prototype.getToken = function(token) {
    if (!this.cache) {
        this.cache = storage.getItem(this.key);
    }
    return this.cache;
};

Token.prototype.removeToken = function() {
    this.cache = null;
    storage.removeItem(this.key);
};


module.exports = Token;