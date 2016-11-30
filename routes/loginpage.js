'use strict';

const express = require('express');
const router = express.Router();
const encodePassword = require('../utils/encodePassword');

const UAM_SECRET = '';

/**
 * https://github.com/cloudtrax/docs/tree/master/captive_portal/splash_pages/external
 */

router.get('/', (req, res) => {

    console.log('\nHEADERS:', JSON.stringify(req.headers, null, 2));
    console.log('QUERY:', JSON.stringify(req.query, null, 2));

    const _res = req.query.res;
    // optional: uamhttps, sessionid, q
    const {
        uamip,
        uamport,
        challenge,
        mac,
        ip,
        ssid,
        called,
        nasid,
        userurl,
        md
    } = req.query;

    switch (_res) {
        case 'notyet':
            res.render('login', {
                uamip,
                uamport,
                challenge,
                mac,
                ip,
                ssid,
                called,
                nasid,
                userurl,
                md
            });
            break;
        case 'success':
            res.render('success', {
                userurl
            });
            break;
            // case 'failed':
            // case 'logoff':
        default:
            res.render('index', {
                title: 'Index Page',
                res: _res
            });
            break;
    }

});


router.post('/', (req, res, next) => {

    console.log('\nHEADERS:', JSON.stringify(req.headers, null, 2));
    console.log('BODY:', JSON.stringify(req.body, null, 2));

    const {
        username,
        password,
        uamip,
        uamport,
        challenge,
        mac,
        ip,
        ssid,
        called,
        nasid,
        userurl,
        md
    } = req.body;

    console.log('### challenge: ' + challenge + ' - ' + challenge.length);

    if (challenge && challenge.length > 0) {
        /* encode password, but it didn't work because couldn't find the right password encoding mechanism */
        // const encPassword = encodePassword(password, challenge, UAM_SECRET);
        // const uriUsername = encodeURIComponent(username);
        // const uriPassword = encodeURIComponent(encPassword);
        next(new Error('Ops CHAP - this is not implemented yet.'));
    } else {
        res.redirect(`http://${uamip}:${uamport}/logon?username=${username}&password=${password}`);
    }
});

module.exports = router;
