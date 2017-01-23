'use strict';

const log = require('debug')('cp:routes:login');
const router = require('express').Router();
// const encodePassword = require('../utils/encodePassword');

// const UAM_SECRET = '';

/**
 * https://github.com/cloudtrax/docs/tree/master/captive_portal/splash_pages/external
 */

router.get('/', (req, res, next) => {

    log('==========');
    log('HEADERS:', JSON.stringify(req.headers, null, 2));
    log('QUERY:', JSON.stringify(req.query, null, 2));

    const _res = req.query.res;

    // for notyet response
    // optional: uamhttps, sessionid, q
    const query = req.query;
    // const uamip = query.uamip || '';
    // const uamport = query.uamport || '';
    // const challenge = query.challenge || '';
    // const mac = query.mac || '';
    // const ip = query.ip || '';
    // const ssid = query.ssid || '';
    // const called = query.called || '';
    // const nasid = query.nasid || '';
    const { userurl = '' } = query;
    // const md = query.md || '';

    // for failed response
    // const reason = query.reason || '';
    // const sessionid = query.sessionid || '';

    switch (_res) {
        case 'notyet':
            return res.render('login', query);

        case 'success':
            return res.render('success', { userurl });

        case 'failed':
            query.failed = true;
            return res.render('login', query);

        case 'logoff':
            return res.render('logoff');

        default:
            const err = new Error('"res" parameter unknown or does not exist.');
            err.status = 400;
            return next(err);
    }

});


router.post('/', (req, res, next) => {

    log('\n');
    log('HEADERS:', JSON.stringify(req.headers, null, 2));
    log('BODY:', JSON.stringify(req.body, null, 2));

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

    log(`### challenge: ${challenge} - ${challenge.length}`);

    if (challenge && challenge.length > 0) {
        /* encode password, but it didn't work because couldn't find the right password encoding mechanism */
        // const encPassword = encodePassword(password, challenge, UAM_SECRET);
        // const uriUsername = encodeURIComponent(username);
        // const uriPassword = encodeURIComponent(encPassword);
        const err = new Error('Ops CHAP - this is not implemented yet.');
        err.status = 500;
        next(err);
    } else {
        res.redirect(`http://${uamip}:${uamport}/logon?username=${username}&password=${password}`);
    }
});

module.exports = router;
