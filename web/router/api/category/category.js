"use strict";

let path = require('path'),
	logger = require(path.resolve('.') + '/utils/logger'),
    controller = require('./controller');

let Category = function () {

    this.createCategory = (req, res) => {
		let data = {
			api_endpoint:'/category',
			action:'Create new category',
			activity:'created a new category',
			result:true
		}
        return controller.createCategory(req.body).then((result) => {
			logger.info('web | router | api | category | createCategory(function) | createCategory success');
            res.status(200).json({
                success: true,
                message: 'Category created successfully'
            })
        }).catch((err) => {
			logger.warn('web | router | api | category | createCategory(function) | Error: ', err)
            return res.status(400).json({
                success: false,
                error: {
                    message: err.message
                }
            });
        })
    }

    this.listCategory = (req, res) => {
        return controller.listCategory().then((result) => {
			logger.info('web | router | api | category | listCategory(function) | listCategory success');
            res.status(200).json({
                success: true,
                payload: result
            })
        }).catch((err) => {
			logger.warn('web | router | api | category | listCategory(function) | Error: ', err)
            return res.status(400).json({
                success: false,
                error: {
                    message: err.message
                }
            });
        })
    }
}

module.exports = new Category();
