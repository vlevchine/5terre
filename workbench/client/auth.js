'use strict';

var _ = require('lodash'),
    Token = require('./token');

var auth = {
    tokenKeys: {id: 'id_token', access: 'access_token', refresh: 'refresh_token'},
    tokens: {},
    init() {
        var url = window.location.origin + '/apps',
            token = this.getAccessToken();

        axios.get(url, { transformRequest: [
                function (data, headers) {
                    headers.common['Authorization'] ='Bearer ' + token;
                    return data;
                }]
            })
            .then(this.onDataReady.bind(this));
    },
    onDataReady(response) {
        var keys = _.values(this.tokenKeys);
        Object.keys(response.data).forEach(k => {
            if (keys.indexOf(k) > -1) {
                this.processToken(k, response.data[k]);
            }
        });
    },
    processToken(id, token) {
        var raw = (token || '').split('.');
        if (raw.length === 3) {
            this.tokens[id].setToken(window.atob(raw[1]));
        }
    },
    setTokens: function(hash) {
        var keys = _.values(this.tokenKeys);
        keys.forEach(k => {
            if (!this.tokens[k]) { this.tokens[k] = new Token(k); }
        });

        hash.split('&').forEach(e => {//e= 'id_token=*****' or 'access_token=***'
            var vals = e.split('=');
            if (vals.length === 2 && keys.indexOf(vals[0]) > -1) {
                var raw = vals[1].split('.');
                if (raw.length === 3) {
                    this.tokens[vals[0]].setToken(window.atob(raw[1]));
                }
            }
        }, this);
    },

    clearTokens: function() {
        var id = this.getIdToken(),
            access = this.getAccessToken();
        if (id) { id.removeToken(); }
        if (access) { access.removeToken(); }
    },

    getToken: function(key) {
        var tokenKey = this.tokenKeys[key],
            token = this.tokens[tokenKey];
        return token ? JSON.parse(token.getToken()) : '' ;
    },
    getIdToken: function() {
        return this.getToken('id');
    },
    getAccessToken: function() {
        return this.getToken('access');
    },

    tokenValidFor(key) {
        var token = this.getToken(key);
        return token.exp ? token.exp - new Date().valueOf() : token.exp;
    },

    isAuthenticated() {
        return this.tokenValidFor('id') > 0;
    }
};

module.exports = auth;