'use strict';

const router = require('express').Router();
const { url, logo, slogan } = require('../config.json').default;

/**
 * http://wiki.mikrotik.com/wiki/HotSpot_external_login_page
 */

router.get('/', (req, res, next) => {

    // TODO query company info from db (based on nas id / mac address?), and then loads here

    res.render('login', {
        url,
        logo,
        slogan,
        data: req.query
    });
});


module.exports = router;
