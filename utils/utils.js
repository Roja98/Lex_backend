"use strict";

/*jslint node:true*/
const crypto = require('crypto'),
    redis = require('./redisHelper'),
    logger = require('./logger'),
    jwt = require('jwt-simple'),
    moment = require("moment"),
    path = require('path'),
    config = require(path.resolve('.') + '/config'),
    _ = require('lodash');

let Utils = function () {
    // Funcation to generate the access token
    const SECRETKEY = 'S3CR#TK#YEwuHX#.I!O>dM*a'
    this.generateJWTToken = (user) => {
        return new Promise((resolve, reject) => {
            try {
                // To generate token
                let expires = expiresIn(config.environment.passwordExpiry);
                let token = jwt.encode({
                    exp: expires
                }, SECRETKEY);

                let genToken = {
                    token: token,
                    tokenType: "JWT",
                    expires: expires,
                    user: user
                }
                logger.info('[utils] [utils] [generateJWTToken] token generate success')
                resolve(genToken);
            }
            catch (err) {
                logger.error('[utils] [utils] [generateJWTToken] error: ', err)
                reject({ "status": "500", "reason": err });
            }
        });
    }

    this.generateChangePasswordToken = (user) => {
        return new Promise((resolve, reject) => {
            try {
                // To generate token
                let expires = expiresIn(config.environment.changePasswordExpiry);
                let token = jwt.encode({
                    exp: expires
                }, SECRETKEY);

                let genToken = {
                    token: token,
                    tokenType: "JWT",
                    expires: expires,
                    user: user
                }
                logger.info('[utils] [utils] [generateChangePasswordToken] token generate success')
                resolve(genToken);
            }
            catch (err) {
                logger.error('[utils] [utils] [generateChangePasswordToken] error: ', err)
                reject(err);
            }
        });
    }

    function expiresIn(minutes) {
        let dateObj = new Date();
        return dateObj.setMinutes(dateObj.getMinutes() + minutes);
    }

    // Function to remove the token from key value store
    this.expireToken = (authHeader) => {
        logger.info('web | router | api | user | expireToken(function) | called');
        return new Promise((resolve, reject) => {
            let token;
            if (authHeader) {
                authHeader = authHeader.split(" ");
                token = authHeader[1];
                if (!authHeader[0] || authHeader[0] === undefined) {
                    logger.error('web | router | api | user | expireToken(function) | Unknown token type');
                    reject(new Error("Unknown token type"));
                }
                if (!token) {
                    logger.error('web | router | api | user | expireToken(function) | Missing token in header');
                    reject(new Error("Missing token in header"));
                }
                return redis.del(token).then((success) => {
                    logger.info('web | router | api | user | expireToken(function) | success');
                    resolve(success);
                }).catch((error) => {
                    logger.error('web | router | api | user | expireToken(function) | failed.', error);
                    reject(error);
                });
            } else {
                logger.info('web | router | api | user | expireToken(function) | failed | Missing authorization in header');
                reject(new Error("Missing authorization in header"));
            }
        });
    }

    // Function to verify the Token
    this.verifyActiveToken = (authHeader) => {
        return new Promise((resolve, reject) => {
            let token;
            if (authHeader) {
                authHeader = authHeader.split(" ");
                token = authHeader[1];
                if (!token) {
                    reject(new Error("Missing token in header"));
                    return;
                }
                redis.get(token).then((result) => {
                    if (result && result.token && result.token === token) {
                        let ttl = config.environment.passwordExpiry * 60;
                            redis.setex(token, result, ttl).then((success) => {
                                resolve(result);
                            }).catch((err) => {
                                reject(err);
                            });
                    } else {
                        reject(new Error('Token not found'));
                    }
                }).catch((error) => {
                    reject(error);
                });
            } else {
                reject(new Error("Missing authorization"));
            }
        });
    }

    this.getTokenDetail = (authHeader) => {
        return new Promise((resolve, reject) => {
            let token;
            if (authHeader) {
                authHeader = authHeader.split(" ");
                token = authHeader[1];
                if (!token) {
                    reject(new Error("Missing token in header"));
                    return;
                }
                redis.get(token).then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(false);
                    }
                }).catch((error) => {
                    reject(error);
                });
            } else {
                reject(new Error("Missing authorization"));
            }
        });
    }

    // Function to create hash from passwd
    this.createHash = (value, type) => {
        type = type || "sha256";
        if (type === "md5") {
            return crypto.createHash(type).update(value).digest("hex");
        }
        return crypto.createHash(type).update(value, "utf8").digest("base64");
    }

    this.getDateRange = (date) => {
        let start = new Date(moment(date).format("YYYY-MM-DD"));
        let end = new Date(moment(date).add(1, 'days').format("YYYY-MM-DD"));

        return {
            start,
            end
        }
    }

    this.getDateRange = (date) => {
        let start = new Date(moment(date).format("YYYY-MM-DD"));
        let end = new Date(moment(date).add(1, 'days').format("YYYY-MM-DD"));

        return {
            start,
            end
        }
    }

    this.validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    this.validateCSV = (data) => {
        let keys = Object.keys(data);
        let values = Object.values(data);
        return _.isEqual(keys, values);
    }

    this.validateDeviceID = (deviceID) => {
        var re = /\W|_/g;
        return re.test(String(deviceID).toLowerCase());
    }

    this.toCapitalCase = (valueString) => {
        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        return valueString.capitalize();
    }

    this.getISODate = (date) => {
        if (!Date.prototype.toISODate) {
            Date.prototype.toISODate = function () {
                return this.getFullYear() + '-' +
                    ('0' + (this.getMonth() + 1)).slice(-2) + '-' +
                    ('0' + this.getDate()).slice(-2);
            };
        }
        var scan_date = new Date(date);
        var date = scan_date.toISODate();
        var time = scan_date.toLocaleTimeString();
        return date + ' ' + time;
    }
}

module.exports = new Utils();
