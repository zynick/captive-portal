'use strict';

const mongoose = require('mongoose');
const router = require('express').Router();
const log = require('debug')('cp:routes:api');
const { apiToken } = require('../config.json');
const isProd = process.env.NODE_ENV === 'production';
const Companies = mongoose.model('Companies');


router.post('/type', (req, res, next) => {

    if (req.body.token !== apiToken) {
        const error = { status: 401, message: 'Unauthorized' };
        return res.status(error.status).json({ error });
    }

    const { company, login, assests } = req.body;

    if (!company || !login || !assests) {
        const error = { status: 400, message: 'missing company/login/assests parameter' };
        return res.status(error.status).json({ error });
    }

    Companies.findOne({ code: company }, (err, _company) => {
        if (err) {
            return next(err);
        }

        if (_company) {
            _company.login = login;
            _company.assests = assests;
        } else {
            _company = new Companies({ code: company, login, assests });
        }

        _company.save((err) => {
            if (err) {
                return next(err);
            }

            res.status(200).end();
        });
    });

});


/* 404 & Error Handlers */
router.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

router.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    const error = { status, message };
    // hide stacktrace in production, show otherwise
    if (!isProd) { error.stack = err.stack; }
    res
        .status(status)
        .json({ error });
});


module.exports = router;
