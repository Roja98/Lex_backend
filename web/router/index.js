'use strict';

const router = require('express').Router(),
    middleware = require('../middleware'),
    api = require('./api');


// Auth module APIs
router.post('/login', middleware.auth.login, api.auth.auth.login);
router.post('/logout', middleware.auth.logout, api.auth.auth.logout);


//role modules APIs
router.post('/role',api.role.roles.createRole);

//user modules APIss
router.post('/user',api.user.user.createUser);

module.exports = router;