'use strict';

const router = require('express').Router();
const NAS = require('mongoose').model('NAS');
const admanager = require('../lib/admanager.js');


router.get('/', (req, res, next) => {

    // query input comes from mikrotik/status.html
    const { identity, mac, username } = req.query;

    NAS
        .findOne({ id: identity })
        .maxTime(10000)
        .exec()
        .then(nas => {
            if (!nas) {
                const err = new Error('NAS does not exist.');
                err.status = 400;
                return next(err);
            }

            admanager.asset(nas.organization, identity, mac, username,
                (err, httpRes) => {
                    if (err) { return next(err); }

                    if (httpRes.statusCode !== 200) {
                        err = new Error(`Unable to query content from AD Server: ${httpRes.statusMessage}`);
                        err.status = httpRes.statusCode;
                        return next(err);
                    }

                    let done = false;
                    httpRes.body
                        .every(asset => {
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

        })
        .catch(next);

});


module.exports = router;
