"use strict";

let path = require('path'),
	logger = require(path.resolve('.') + '/utils/logger'),
    controller = require('./controller');

let Roles = function () {

    this.createRole = (req, res) => {
		let data = {
			// user_id : req.userObj.userid,
			api_endpoint:'/role',
			action:'Create new role',
			activity:'created a new role',
			result:true
		}
        return controller.createRole(req.body).then((result) => {
			logger.info('web | router | api | role | createRole(function) | createRole success');

            res.status(200).json({
                success: true
            })
        }).catch((err) => {
			logger.warn('web | router | api | role | createRole(function) | Error: ', err)
            return res.status(400).json({
                success: false,
                error: {
                    message: err.message
                }
            });
        })
    }

    this.listRole = (req, res) => {
        return controller.listRole().then((result) => {
			logger.info('web | router | api | role | listRole(function) | listRole success');
            res.status(200).json({
                success: true,
                payload: result
            })
        }).catch((err) => {
			logger.warn('web | router | api | role | listRole(function) | Error: ', err)
            return res.status(400).json({
                success: false,
                error: {
                    message: err.message
                }
            });
        })
    }
}

module.exports = new Roles();
