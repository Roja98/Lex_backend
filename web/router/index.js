'use strict';

const router = require('express').Router(),
    middleware = require('../middleware'),
    api = require('./api');


// Auth module APIs
router.post('/login', middleware.auth.login, api.auth.auth.login);
router.post('/logout', middleware.auth.logout, api.auth.auth.logout);


//role modules APIs
router.post('/create/role',api.role.roles.createRole);
router.get('/list/role', api.role.roles.listRole);

//user modules APIss
router.post('/create/user',api.user.user.createUser);
router.get('/list/user', api.user.user.listUsers);

// category modules APIss

router.post('/create/category', api.category.category.createCategory);
router.get('/list/category', api.category.category.listCategory);

// Faqs modules APIss

router.post('/create/faqs', api.faqs.faqs.createFaqs);
router.get('/list/faqs', api.faqs.faqs.listFaq);
router.put('/update/faqs', api.faqs.faqs.updateFaq);


module.exports = router;