"use strict";
let path = require('path'),
    logger = require(path.resolve('.') + '/utils/logger'),
    config = require(path.resolve('.') + '/config'),
    categoryModel = require(path.resolve('.') + '/models').category,
    _ = require('lodash');

let Category = function () {

    this.createCategory = (data) => {

        return this.getCategory(data.categoryName).then(async (result) => {
            if (!result) {
                let category = categoryModel(data);
                let saveCategory = await category.save();
                if (saveCategory) {
                    logger.info('web | router | api | category | createCategory(function) | create category success');
                    return Promise.resolve(true);
                } else {
                    logger.info('web | router | api | category | createCategory(function) | create category failure');
                    return Promise.reject({
                        message: "Could not create new category"
                    });
                }
            } else {
                logger.info('web | router | api | category | createCategory(function) | create category failure');
                return Promise.reject({
                    message: "Category already exists"
                });
            }

        }).catch((error) => {
            logger.warn('web | router | api | category | createCategory(function) | create category Error: ', error);
            return Promise.reject({
                message: error.message ? error.message : "Server error"
            });
        });
    }

    this.listCategory = () => {
        return categoryModel.find().then((result) => {
            if (result) {
                logger.info('web | router | api | category | listCategory(function) | list category success', result);
                return Promise.resolve(result);
            } else {
                logger.info('web | router | api | category | listCategory(function) | list category failure');
                return Promise.reject({
                    message: "category not found"
                });
            }
        }).catch((error) => {
            logger.warn('web | router | api | category | listCategory(function) | list category Error: ', error);
            return Promise.reject({
                message: error.message ? error.message : "Server error"
            });
        });
    }

    this.getCategory = (categoryName) => {
        return categoryModel.findOne({
            categoryName: categoryName,
            deleted: {
                $ne: true
            }
        }, {
            _id: 0,
            password: 0,
            __v: 0
        });
    }
}


module.exports = new Category();