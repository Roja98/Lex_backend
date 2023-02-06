"use strict";
let path = require('path'),
    logger = require(path.resolve('.') + '/utils/logger'),
    config = require(path.resolve('.') + '/config'),
    roleModel = require(path.resolve('.') + '/models').role,
    _ = require('lodash');

let Roles = function () {

    this.createRole = (data) => {
                let role = roleModel(data);
                return role.save().then((success) => {
                    if (success) {
                        logger.info('web | router | api | role | createRole(function) | create role success');
                        return Promise.resolve(true);
                    } else {
                        logger.info('web | router | api | role | createRole(function) | create role failure');
                        return Promise.reject({
                            message: "Could not create new role"
                        });
                    }
                }).catch((error) => {
                    logger.warn('web | router | api | role | createRole(function) | create role Error: ', error);
                    return Promise.reject({
                        message: error.message ? error.message : "Server error"
                    });
                });
            } 
        }


        module.exports = new Roles();