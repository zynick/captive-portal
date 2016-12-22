'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {

    if (req.query.loginurl) {

        // res.redirect(req.query.loginurl);
        res.render('homepage', {
            loginurl: req.query.loginurl
        });

    } else {

        next(new Error('"loginurl" parameter does not exist.'));

    }

});

module.exports = router;
