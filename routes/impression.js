'use strict';

const router = require('express').Router();
const NAS = require('mongoose').model('NAS');
const { queryAsset } = require('../lib/admanager');


router.get('/', (req, res, next) => {

    // query input comes from mikrotik/status.html
    const { identity, mac, username } = req.query;

    NAS.findOne({ id: identity }, (err, nas) => {
        if (err) { return next(err); }

        queryAsset(nas.organization, identity, mac, username,
            (err, httpRes) => {
                if (err) {
                    return next(err); }

                if (httpRes.statusCode !== 200) {
                    err = new Error(httpRes.statusMessage);
                    err.status = httpRes.statusCode;
                    return next(err);
                }

                let done = false;

                httpRes.body.every((asset) => {
                    if (asset.type !== 'board') {
                        return true;
                    }

                    res.render('impression', { asset });
                    done = true;

                    return false;
                });

                if (!done) {
                    next(new Error('No relevant ads found from system.'));
                }
            });
    });

});


module.exports = router;
