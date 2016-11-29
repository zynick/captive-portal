'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {

    res.render('homepage', {
        loginurl: req.query.loginurl
    });

    // if (req.query.loginurl) {
    //     res.redirect(req.query.loginurl);
    // } else {
    //     next(new Error('loginurl parameter does not exist.'));
    // }

});

module.exports = router;
