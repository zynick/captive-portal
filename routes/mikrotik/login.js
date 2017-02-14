'use strict';

const router = require('express').Router();
const NAS = require('mongoose').model('NAS');
const admanager = require('../../lib/admanager.js');
const { ARGON2_SALT_SUFFIX } = require('../../config.js');

/**
 * http://wiki.mikrotik.com/wiki/HotSpot_external_login_page
 */

const routeGetNAS = (req, res, next) => {

    const id = req.query.identity || req.body.identity;

    NAS
        .findOne({ id })
        .maxTime(10000)
        .exec()
        .then(nas => {
            if (!nas) {
                const err = new Error('NAS does not exist.');
                err.status = 400;
                return next(err);
            }

            req.nas = nas;
            next();
        })
        .catch(next);
};

const routeJsonp = (req, res, next) => {
    // for app's seamless connection
    if (req.headers.accept === 'application/javascript') {
        return res.jsonp({
            query: req.query,
            salt: ARGON2_SALT_SUFFIX
        });
    }

    next();
}

const routeGetAsset = (req, res, next) => {

    const { organization } = req.nas;
    const { identity, mac, username } = req.query;

    admanager.asset(organization, identity, mac, username,
        (err, httpRes) => {
            if (err) {
                return next(err);
            }

            if (httpRes.statusCode !== 200) {
                err = new Error(`Unable to query content from AD Server: ${httpRes.statusMessage}`);
                err.status = httpRes.statusCode;
                return next(err);
            }

            req.httpRes = httpRes;
            next();
        });

};

const routeResponse = (req, res, next) => {

    let responded = false;

    req.httpRes.body
        .every(ad => {
            if (ad.type !== 'board') {
                return true;
            }

            const { query, nas: { login, assets } } = req;

            login.guestEnabled = login.guest && query.trial === 'yes';

            const idx = req.url.indexOf('?');
            const queryString = idx === -1 ? '' : req.url.slice(idx);
            login.signupUrl = `/mikrotik/signup${queryString}`;

            res.render('mikrotik/login', { login, assets, query, ad, ARGON2_SALT_SUFFIX });

            responded = true;
            return false;
        });

    if (!responded) {
        next(new Error('No relevant ads found from system.'));
    }
};

router.get('/', 
    routeGetNAS,
    routeJsonp,
    routeGetAsset,
    routeResponse
);

module.exports = router;
