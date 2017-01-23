'use strict';

const log = require('debug')('cp:routes:login');
const router = require('express').Router();

/**
 * http://wiki.mikrotik.com/wiki/HotSpot_external_login_page
 *
 * NOTE: no way to use PAP auth in mikrotik because
 * can't find the decoding method online. Plus it's not secure
 * so better use CHAP instead.
 */

router.get('/', (req, res, next) => {

    // dev only
    req.body = req.query;

    const chapId = req.body['chap-id'];
    const isCHAP = chapId && chapId.length > 0 ? true : false;

    if (isCHAP) {
        res.render('login', { data: req.body });
    } else {
        const err = new Error('Only CHAP Authentication Protocol is allowed.');
        err.status = 500;
        next(err);
    }

});


module.exports = router;
