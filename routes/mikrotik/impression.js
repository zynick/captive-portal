'use strict';

const router = require('express').Router();
const NAS = require('mongoose').model('NAS');
const admanager = require('../../lib/admanager.js');


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
        .every(asset => {
            if (asset.type !== 'board') {
                return true;
            }

            res.render('mikrotik/impression', { asset });

            responded = true;
            return false;
        });

    if (!responded) {
        next(new Error('No relevant ads found from system.'));
    }
};

router.get('/',
    routeGetNAS,
    routeGetAsset,
    routeResponse
);

module.exports = router;
