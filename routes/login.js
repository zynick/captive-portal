'use strict';

const async = require('async');
const mongoose = require('mongoose');
const router = require('express').Router();
const { defaults } = require('../config.json');
const Companies = mongoose.model('Companies');
const NAS = mongoose.model('NAS');

/**
 * http://wiki.mikrotik.com/wiki/HotSpot_external_login_page
 */

router.get('/', (req, res, next) => {

    async.waterfall([
        (next) => {
            NAS.findOne({ id: req.query.mac }, next);
        },
        (nas, next) => {
            if (!nas) {
                return next();
            }
            Companies.findOne({ id: nas.company }, next);
        }
    ], (err, company) => {
        if (err) {
            return next(err);
        }
        if (!company) {
            company = defaults;
        }

        const { login = {}, assets = {} } = company;
        const idx = req.url.indexOf('?');
        const queryString = idx === -1 ? '' : req.url.slice(idx);
        login.signupUrl = `/signup${queryString}`;

        res.render('login', {
            login,
            assets,
            query: req.query
        });
    });

});


module.exports = router;
