const path = require('path'),
    userModel = require(path.resolve('.') + '/models').user,
    logger = require(path.resolve('.') + '/utils/logger');
    _ = require('lodash');



    
let Users = function () {
 this.createUser = (data, userObj) => {
    return this.getUser(data.email).then((result) => {
        logger.info('web | router | api | user | controller | createUser(function) | user found', result);
        if (!result) {
            return bcrypt.hash(data.password, saltRounds).then((hash) => {
                data.userid = data.email.toLowerCase();
                data.createdby = userObj.name;
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
}

this.getUser = (userid) => {
    return userModel.findOne({
        userid: userid,
        deleted: {
            $ne: true
        }
    }, {
        _id: 0,
        __v: 0
    });
}

module.exports = new Users()