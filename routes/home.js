'use strict';

const router = require('express').Router();

/*
 * This page is made for coova chilli cause it need to define home url
 * perhaps other AP that doesn't need this just point them to the login page will do
 */
router.get('/', (req, res, next) => {

    if (req.query.loginurl) {

        // res.redirect(req.query.loginurl);
        res.render('home', {
            loginurl: req.query.loginurl
        });

    } else {

        next(new Error('"loginurl" parameter does not exist.'));

    }

});

module.exports = router;
