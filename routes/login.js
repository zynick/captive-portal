'use strict';

const router = require('express').Router();
const NAS = require('mongoose').model('NAS');
const admanager = require('../lib/admanager.js');

/**
 * http://wiki.mikrotik.com/wiki/HotSpot_external_login_page
 */

router.get('/', (req, res, next) => {

    const data = req.query;
    const { identity, mac, username, trial } = data;

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

            const { organization, login, assets } = nas;

            admanager.asset(organization, identity, mac, username,
                (err, httpRes) => {
                    if (err) { return next(err); }

                    if (httpRes.statusCode !== 200) {
                        err = new Error(`Unable to query content from AD Server: ${httpRes.statusMessage}`);
                        err.status = httpRes.statusCode;
                        return next(err);
                    }

                    let done = false;
                    httpRes.body
                        .every(ad => {
                            if (ad.type !== 'board') {
                                return true;
                            }

                            login.guestEnabled = login.guest && trial === 'yes';

                            const idx = req.url.indexOf('?');
                            const queryString = idx === -1 ? '' : req.url.slice(idx);
                            login.signupUrl = `/signup${queryString}`;

                            res.render('login', { login, assets, data, ad });

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
