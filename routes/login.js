'use strict';

const router = require('express').Router();
const NAS = require('mongoose').model('NAS');

/**
 * http://wiki.mikrotik.com/wiki/HotSpot_external_login_page
 */

router.get('/', (req, res, next) => {

    const data = req.query;

    NAS
        .findOne({ id: data.identity })
        .maxTime(10000)
        .exec()
        .then((nas) => {
            if (!nas) {
                const err = new Error('NAS does not exist.');
                err.status = 400;
                return next(err);
            }

            const { login, assets } = nas;

            login.guestEnabled = login.guest && data.trial === 'yes';

            const idx = req.url.indexOf('?');
            const queryString = idx === -1 ? '' : req.url.slice(idx);
            login.signupUrl = `/signup${queryString}`;

            res.render('login', { login, assets, data });
        })
        .catch(next);

});


module.exports = router;
