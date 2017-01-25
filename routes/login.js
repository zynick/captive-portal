'use strict';

const router = require('express').Router();
const { url, logo, slogan } = require('../config.json').default;

/**
 * http://wiki.mikrotik.com/wiki/HotSpot_external_login_page
 */

router.get('/', (req, res, next) => {

    // TODO query company info from db (based on nas id / mac address?), and then loads here

    // TODO prepare succss redirect link
    const rawQuery = req.url.substr(req.url.indexOf('?'));
    const successRedirect = `/success${rawQuery}`;

    res.render('login', {
        data: req.query,
        url,
        logo,
        slogan,
        successRedirect
    });
});


module.exports = router;
