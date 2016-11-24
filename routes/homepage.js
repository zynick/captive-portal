'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {

    if (req.query.loginurl) {
        req.redirect(req.query.loginurl);
    } else {
        next(new Error('loginurl parameter does not exist.'));
    }

});

module.exports = router;
