'use strict';

const router = require('express').Router();
const NAS = require('mongoose').model('NAS');

/**
 * http://wiki.mikrotik.com/wiki/HotSpot_external_login_page
 */

router.get('/', (req, res, next) => {

    NAS.findOne({ id: req.query.identity }, (err, nas) => {
        if (err) { return next(err); }

        const {
            login = {},
            assets = {}
        } = nas || {};

        login.guestEnabled = login.guest && req.query.trial === 'yes';

        const idx = req.url.indexOf('?');
        const queryString = idx === -1 ? '' : req.url.slice(idx);
        login.signupUrl = `/signup${queryString}`;

        res.render('login', {
            login,
            assets,
            data: req.query
        });

    });

});


module.exports = router;
