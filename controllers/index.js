'use strict';

const argon2 = require('argon2');
const log = require('debug')('portal:routes');
const { ARGON2_SALT_SUFFIX, NODE_ENV } = require('../config.js');
const { version } = require('../package.json');


const debug = (req, res, next) => {
    log('==========');
    log(`HEADERS: ${JSON.stringify(req.headers, null, 2)}`);
    log(`QUERY: ${JSON.stringify(req.query, null, 2)}`);
    log(`COOKIES: ${JSON.stringify(req.cookies, null, 2)}`);
    log(`PARAMS: ${JSON.stringify(req.params, null, 2)}`);
    log(`BODY: ${JSON.stringify(req.body, null, 2)}`);
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    // res.setHeader('Access-Control-Allow-Origin', '*');
    next();
};

const index = (req, res) => {
    res.json(`ACE-TIDE Captive Portal v${version}`);
}

const hashPassword = (req, res, next) => {
    const { username, password } = req.body;
    argon2
        .hash(password, new Buffer(username + ARGON2_SALT_SUFFIX), {
            type: argon2.argon2d,
            timeCost: 3,
            memoryCost: 11,
            parallelism: 1,
            raw: true
        })
        .then(hash => {
            req.hash = hash;
            next();
        })
        .catch(next);
};

const badRequest = (req, res, next) => {
    const err = new Error('Bad Request');
    err.status = 400;
    next(err);
};

const notFound = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
};

const errorHandlerJSON = (err, req, res, next) => {
    const { status = 500, message = 'Internal Server Error' } = err;
    const error = { status, message };
    // hide stacktrace in production, show otherwise
    if (NODE_ENV !== 'production') { error.stack = err.stack; }
    res
        .status(status)
        .json({ error });
};

const errorHandlerRender = (err, req, res, next) => {
    const { status = 500, message = 'Internal Server Error' } = err;
    const error = { status, message };
    // hide stacktrace in production, show otherwise
    if (NODE_ENV !== 'production') { error.stack = err.stack; }
    res
        .status(status)
        .render('error', { error });
};


module.exports = {
    debug,
    index,
    hashPassword,
    badRequest,
    notFound,
    errorHandlerJSON,
    errorHandlerRender
};