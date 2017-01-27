'use strict';

const router = require('express').Router();
const NAS = require('mongoose').model('NAS');

router.get('/', (req, res, next) => {

    NAS.findOne({ id: req.query.mac }, (err, nas) => {
        if (err) { return next(err); }

        const {
            login = {},
            assets = {}
        } = nas || {};

        login.guestEnabled = login.guest && req.query.trial === 'yes';

        const idx = req.url.indexOf('?');
        const queryString = idx === -1 ? '' : req.url.slice(idx);
        login.loginUrl = `/login${queryString}`;

        res.render('signup', {
            login,
            assets,
            query: req.query
        });

    });

});


module.exports = router;
