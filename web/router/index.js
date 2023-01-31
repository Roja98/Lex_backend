'use strict';

const router = require('express').Router(),
    middleware = require('../middleware'),
    api = require('./api');


// Auth module APIs
router.post('/login', middleware.auth.login, api.auth.auth.login);
router.post('/logout', middleware.auth.logout, api.auth.auth.logout);


module.exports = router;