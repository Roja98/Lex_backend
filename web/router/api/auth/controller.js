const path = require('path'),
    config = require(path.resolve('.') + '/config'),
    logger = require(path.resolve('.') + '/utils/logger'),
    utils = require(path.resolve('.') + '/utils/utils'),
    redis = require(path.resolve('.') + '/utils/redisHelper');

let Auth = function () {
    // Function to login and logout

    this.login = (data) => {
        let userid = data.userid.trim().toLowerCase();
        let password = data.password;
        let platform = data.platform ? data.platform.toLowerCase() : '';
        return new Promise((resolve, reject) => {
            let token;
            let user;
            return isValidUser(userid, password, platform).then((result) => {
                if (!result) {
                    logger.info("web | router | api | user | login(function) | user's role is not supervisor", userid);
                    reject({
                        message: "Unauthorized User"
                    });
                }

                let filterData = config.environment.userClassesNotAllowedWebLogin.filter(x => x.toLowerCase() === result.userclass.toLowerCase());
                if (filterData.length > 0 && platform === 'web') {
                    reject({
                        message: "You're not allowed access web portal"
                    })
                }
                user = result;
                // If valid generate token for the user
                logger.info('web | router | api | user | login(function) | user valid', userid);
                // return logoutSessions(userid);
            }).then(() => {
                logger.info('web | router | api | user | login(function) | logout sessions success', userid);
                return utils.generateJWTToken(user)
            }).then((accessToken) => {
                token = accessToken;
                token['platform'] = platform;
                logger.info('web | router | api | user | login(function) | access token generated', userid);
                // Store the Token in Key Value store.
                // timeToLive in seconds  //24(hr) * 60(min) * 60(sec)--> for one day;
                let ttl = config.environment.passwordExpiry * 60;
                return redis.setex(token.token, token, ttl);
            }).then(() => {
                logger.info('web | router | api | user | login(function) | login success', userid);
                resolve(token);
                return;
            }).catch((err) => {
                logger.error('web | router | api | user | login(function) | login service error', err);
                reject({
                    message: err.message ? err.message : "Server error"
                });
                return;
            });
        })
    }

    this.logout = (token) => {
        return new Promise((resolve, reject) => {
            if (!token || token === '' || token === undefined || token === null) {
                logger.info('web | router | api | user | logOut(function) | Missing token')
                reject({
                    message: "No access token found"
                });
            }
            return utils.expireToken(token).then((success) => {
                if (success) {
                    logger.info('web | router | api | user | logOut(function) | logOut success')
                    resolve(success);
                } else {
                    logger.error('web | router | api | user | logOut(function) | Token could not expire ')
                    reject({
                        message: "Could not logout"
                    });
                }
            }).catch((err) => {
                logger.error('web | router | api | user | logOut(function) | error: ', err)
                reject({
                    message: err.message ? err.message : "Server error"
                });
            });
        })
    }

    let isValidUser = (userid, password, platform) => {
       console.log(userid, password, platform)
        return new Promise((resolve, reject) => {
            resolve({userid:'testing',userclass:""})
        });
    }
}

module.exports = new Auth()