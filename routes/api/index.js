'use strict';

const router = require('express').Router();
const { version } = require('../../package.json');
const { API_TOKEN, NODE_ENV } = require('../../config.js');
const isProduction = NODE_ENV === 'production';

// TODO split this out from Captive Portal?

const routeTokenValidation = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization !== `Bearer ${API_TOKEN}`) {
        const err = new Error('Unauthorized');
        err.status = 401;
        return next(err);
    }
    next();
};

const routeBadRequest = (req, res, next) => {
    const err = new Error('Bad Request');
    err.status = 400;
    next(err);
};

const routeErrorHandlerJSON = (err, req, res, next) => {
    const { status = 500, message = 'Internal Server Error' } = err;
    const error = { status, message };
    // hide stacktrace in production, show otherwise
    if (!isProduction) { error.stack = err.stack; }
    res
        .status(status)
        .json({ error });
};


router.use(routeTokenValidation);
router.use('/authenticate', require('./authenticate'));
router.use('/registration', require('./registration'));
router.use(routeBadRequest);
router.use(routeErrorHandlerJSON);

module.exports = router;
