"use strict";
var _ = require('lodash');

//if error is string
var GeneralError = function(message, code, error) {
        this.error = error;
        this.name = "GeneralError";
        this.message = message || this.error.message;
        this.code = !code ? "400" : code.toString();
        this.isError = true;
    },
    NotFoundError = function NotFoundError(message, error) {
        GeneralError.call(this, message, 404, error);
        this.name = "NotFoundError";
        this.status = 404;
    },
    UnauthorizedAccessError = function( message, error) {
        GeneralError.call(this, message, 401, error);
        this.name = "UnauthorizedAccessError";
        this.status = 401;
    };

NotFoundError.prototype = Object.create(GeneralError.prototype);
NotFoundError.prototype.constructor = NotFoundError;

UnauthorizedAccessError.prototype = Object.create(GeneralError.prototype);
UnauthorizedAccessError.prototype.constructor = UnauthorizedAccessError;

module.exports = {
    NotFoundError: NotFoundError,
    UnauthorizedAccessError: UnauthorizedAccessError,
    GeneralError: GeneralError
};