'use strict';

const log = require('debug')('cp:routes:login');
const router = require('express').Router();

/**
 * http://wiki.mikrotik.com/wiki/HotSpot_external_login_page
 */

router.post('/', (req, res) => {
    res.render('login', { data: req.body });
});



module.exports = router;
