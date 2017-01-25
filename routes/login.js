'use strict';

const router = require('express').Router();

/**
 * http://wiki.mikrotik.com/wiki/HotSpot_external_login_page
 */

router.get('/', (req, res, next) => {
    res.render('login', { data: req.query });
});

router.post('/', (req, res, next) => {
    res.render('login', { data: req.body });
});


module.exports = router;
