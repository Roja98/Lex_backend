const path = require('path'),
    logger = require(path.resolve('.') + '/utils/logger'),
    controller = require('./controller');

let Users = function () {

    this.createUser = (req, res) => {
        let data = {
            // user_id: req.userObj.userid,
            api_endpoint: '/user',
            action: 'create user',
            activity: 'created user',
            result: true
        }
        console.log("req.body--------->", req.body);
        return controller.createUser(req.body).then((result) => {
            logger.info('web | router | api | user | createUser(function) | create user success');
            res.status(200).json({
                success: true,
                message: result.message ? result.message : ""
            })
        }).catch((err) => {
            logger.warn('web | router | api | user | createUser(function) | Error: ', err)
            return res.status(400).json({
                success: false,
                error: {
                    message: err.message
                }
            });
        })
    }

    this.listUsers = (req, res) => {
        return controller.listUsers().then((result) => {
			logger.info('web | router | api | role | listUsers(function) | listUsers success');
            res.status(200).json({
                success: true,
                payload: result
            })
        }).catch((err) => {
			logger.warn('web | router | api | role | listUsers(function) | Error: ', err)
            return res.status(400).json({
                success: false,
                error: {
                    message: err.message
                }
            });
        })
    }


}

module.exports = new Users()