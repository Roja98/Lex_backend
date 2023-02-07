const path = require('path'),
    bcrypt = require('bcrypt'),
    userModel = require(path.resolve('.') + '/models').user,
    config = require(path.resolve('.') + '/config').environment,
    logger = require(path.resolve('.') + '/utils/logger');
_ = require('lodash');




let Users = function () {
    this.createUser = (data) => {
        return this.getUser(data.email).then((result) => {
            logger.info('web | router | api | user | controller | createUser(function) | user found', result);
            if (!result) {
                console.log('config---->', config);
                return bcrypt.hash(data.password, config.saltRounds).then((hash) => {
                    data.userid = data.email.toLowerCase();
                    // data.createdby = userObj.name;
                    data.password = hash;
                    let newUser = userModel(data);
                    return newUser.save();
                }).then(() => {
                    logger.info('web | router | api | user | createUser(function) | save user success');
                    return Promise.resolve({
                        message: 'User created successfully'
                    });
                }).catch((err) => {
                    logger.warn('web | router | api | user | createUser(function) | Error: ', err);
                    return Promise.reject({
                        message: err.message ? err.message : "Server error"
                    });
                });
            } else {
                logger.info('web | router | api | user | createUser(function) | user already exist');
                return Promise.reject({
                    message: 'User already exists',
                    code: 'user_exist'
                });
            }
        }).catch((err) => {
            logger.warn('web | router | api | user | createUser(function) | Error: ', err);
            return Promise.reject({
                message: err.message ? err.message : "Server error"
            });
        })
    }

    this.listUsers = () => {
        return userModel.find({}, {
            _id: 0,
            password: 0,
            __v: 0
        }).then((result) => {
            if (result) {
                logger.info('web | router | api | user | listUsers(function) | list user success', result);
                return Promise.resolve(result);
            } else {
                logger.info('web | router | api | user | listUsers(function) | list user failure');
                return Promise.reject({
                    message: "Users not found"
                });
            }
        }).catch((error) => {
            logger.warn('web | router | api | user | listUsers(function) | list user Error: ', error);
            return Promise.reject({
                message: error.message ? error.message : "Server error"
            });
        });
    }

    this.getUser = (email) => {
        return userModel.findOne({
            email: email,
            deleted : {
                $ne: true
            }
        }, {
            _id: 0,
            password: 0,
            __v: 0
        });
    }

}

module.exports = new Users()