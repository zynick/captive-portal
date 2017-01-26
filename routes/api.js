'use strict';

const mongoose = require('mongoose');
const router = require('express').Router();
const log = require('debug')('cp:routes:api');
const { apiToken } = require('../config.json');
const isProd = process.env.NODE_ENV === 'production';
const Companies = mongoose.model('Companies');


function routeTokenValidation(req, res, next) {
    const { authorization } = req.headers;
    if (authorization !== `Bearer ${apiToken}`) {
        const err = new Error('Unauthorized');
        err.status = 401;
        return next(err);
    }
    next();
}

function routeType(req, res, next) {
    const { id } = req.body;

    if (!id) {
        const err = new Error('"id" parameter does not exist');
        err.status = 400;
        return next(err);
    }

    Companies.findOneAndUpdate(
        { id },
        req.body,
        { upsert: true },
        (err, doc) => {
            if (err) { return next(err); }
            res.status(200).end();
        });
}

function routeNotFound(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
}

function routeErrorHandlerJSON(err, req, res, next) {
    const { status = 500, message = 'Internal Server Error' } = err;
    const error = { status, message };
    // hide stacktrace in production, show otherwise
    if (!isProd) { error.stack = err.stack; }
    res
        .status(status)
        .json({ error });
}



router.use(routeTokenValidation);
router.post('/company/type', routeType);
router.use(routeNotFound);
router.use(routeErrorHandlerJSON);


module.exports = router;
