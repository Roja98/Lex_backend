"use strict";

let path = require('path'),
	logger = require(path.resolve('.') + '/utils/logger'),
    controller = require('./controller');

let Faqs = function () {

    this.createFaqs = (req, res) => {
        return controller.createFaqs(req.body).then((result) => {
			logger.info('web | router | api | faq | createFaq(function) | createFaq success', result);
            res.status(200).json({
                success: true,
                message: 'Faq created successfully'
            })
        }).catch((err) => {
			logger.warn('web | router | api | faq | createFaq(function) | Error: ', err)
            return res.status(400).json({
                success: false,
                error: {
                    message: err.message
                }
            });
        })
    }

    this.listFaq = (req, res) => {
        return controller.listFaqById().then((result) => {
			logger.info('web | router | api | faq | listFaq(function) | listFaq success');
            res.status(200).json({
                success: true,
                payload: result
            })
        }).catch((err) => {
			logger.warn('web | router | api | faq | listFaq(function) | Error: ', err)
            return res.status(400).json({
                success: false,
                error: {
                    message: err.message
                }
            });
        })
    }

    this.updateFaq = (req, res) => {
        return controller.updateFaqs(req.body).then((result) => {
			logger.info('web | router | api | faq | updateFaq(function) | updateFaq success');
            res.status(200).json({
                success: true,
                payload: result
            })
        }).catch((err) => {
			logger.warn('web | router | api | faq | updateFaq(function) | Error: ', err)
            return res.status(400).json({
                success: false,
                error: {
                    message: err.message
                }
            });
        })
    }
}

module.exports = new Faqs();
