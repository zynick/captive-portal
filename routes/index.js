'use strict';

const express = require('express');
const router = express.Router();
const encodePassword = require('../utils/encodePassword');

/*  */
const UAM_SECRET = '';

/**
 * Get My Reference Here:
 * https://github.com/cloudtrax/docs/tree/master/captive_portal/splash_pages/external
 */

/* Login */
router.post('/', (req, res) => {
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


    const encPassword = encodePassword(password, challenge, UAM_SECRET);
    const uriUsername = encodeURIComponent(username);
    const uriPassword = encodeURIComponent(encPassword);

    console.log(`http://${uamip}:${uamport}/logon?username=${uriUsername}&password=${uriPassword}`);
    // &redir=${userurl}

    res.render('index', {
        title: 'GAODIM'
    });
});

router.all('/', (req, res) => {

    // console.log('KEYS:', Object.keys(req));
    console.log('HEADERS:', JSON.stringify(req.headers, null, 2));
    console.log('COOKIES:', JSON.stringify(req.cookies, null, 2));
    console.log('QUERY:', JSON.stringify(req.query, null, 2));
    // console.log('PARAMS:', JSON.stringify(req.params, null, 2));
    // console.log('BODY:', JSON.stringify(req.body, null, 2));
    // console.log('SECRET:', JSON.stringify(req.secret, null, 2));

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
            // case 'success':
            // case 'failed':
            // case 'logoff':
        default:
            res.render('index', {
                title: 'Express',
                res: _res
            });
            break;
    }

});

module.exports = router;
