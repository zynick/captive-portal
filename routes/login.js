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

const oct2hex = (octalString) => {
    // input: "\001\002\377" output: "0102FF"
    let hex = '';
    octalString
        .substr(1)
        .split('\\')
        .forEach((str) => {
            let _hex = parseInt(str, 8).toString(16);
            hex += _hex.length > 1 ? _hex : '0' + _hex;
        });
    return hex;
};

router.post('/', (req, res, next) => {

    // chap-id not important it's MikroTik's proprietary attribute
    let chapId = req.body['chap-id'];
    let chapChallenge = req.body['chap-challenge'];

    if (!challenge || challenge.length !== 64) {
        const err = new Error('Only CHAP Authentication Protocol is allowed.');
        err.status = 400;
        next(err);
    }

    chapId = oct2hex(chapId);
    chapChallenge = oct2hex(chapChallenge);

    res.render('login', { data: req.body, chapId, chapChallenge });
});


module.exports = router;
