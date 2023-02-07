"use strict";
let path = require('path'),
    logger = require(path.resolve('.') + '/utils/logger'),
    config = require(path.resolve('.') + '/config'),
    faqModel = require(path.resolve('.') + '/models').faq,
    _ = require('lodash');

let Faqs = function () {

    this.createFaqs = (data) => {
        let faqData = faqModel(data);
        return faqData.save().then((result) => {
            if (result) {
                logger.info('web | router | api | faqs | createFaqs(function) | create faqs success');
                return Promise.resolve(true);
            } else {
                logger.info('web | router | api | faqs | createFaqs(function) | create faqs failure');
                return Promise.reject({
                    message: "Could not create new faqs"
                });
            }
        }).catch((error) => {
            logger.warn('web | router | api | faqs | createFaqs(function) | create faqs Error: ', error);
            return Promise.reject({
                message: error.message ? error.message : "Server error"
            });
        });
    }

    this.updateFaqs = (data) => {
        return this.getFaqs(data.faqId).then(async (result) => {
            if (result) {
                try {
                    logger.info('web | router | api | faqs | updateFaqs(function) | get faqs success', result);
                    await faqModel.updateOne({ _id: data.faqId}, { $set: { faqs: data.faqs } })
                    return Promise.resolve(true);
                } catch (error) {
                    logger.info('web | router | api | faqs | updateFaqs(function) | update faqs failure', error);
                    return Promise.reject({
                        message: "Could not update new faqs"
                    });
                }

            } else {
                logger.info('web | router | api | faqs | updateFaqs(function) | faqs not found');
                return Promise.reject({
                    message: "No faqs Found"
                });
            }
        }).catch((error) => {
            logger.warn('web | router | api | faqs | updateFaqs(function) | update faqs Error: ', error);
            return Promise.reject({
                message: error.message ? error.message : "Server error"
            });
        });
    }

    this.listFaqs = () => {
        return faqModel.find().then((result) => {
            if (result) {
                logger.info('web | router | api | faqs | listFaqs(function) | list faqs success', result);
                return Promise.resolve(result);
            } else {
                logger.info('web | router | api | faqs | listFaqs(function) | list faqs failure');
                return Promise.reject({
                    message: "faqs not found"
                });
            }
        }).catch((error) => {
            logger.warn('web | router | api | faqs | listFaqs(function) | list faqs Error: ', error);
            return Promise.reject({
                message: error.message ? error.message : "Server error"
            });
        });
    }

    this.getFaqs = (faqId) => {
        console.log('control here----->', faqId);
        return faqModel.findOne({
            _id: faqId,
            deleted: {
                $ne: true
            }
        }, {
            _id: 0,
            __v: 0
        });
    }
}


module.exports = new Faqs();