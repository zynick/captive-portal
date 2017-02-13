'use strict';

const argon2 = require('argon2');
const mongoose = require('mongoose');
const querystring = require('querystring');
const router = require('express').Router();
const Users = mongoose.model('Users');
const { ARGON2_SALT_SUFFIX } = require('../../config.js');


const routePostValidation = (req, res, next) => {

    const { username, password, organization } = req.body;

    if (!username || !password || !organization) {
        const err = new Error('username / password / organization does not exist.');
        err.status = 400;
        return next(err);
    }

    next();
};

const routePostHashPassword = (req, res, next) => {

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

const routePostCreateUser = (req, res, next) => {

    const { username, organization } = req.body;
    const password = req.hash.toString('hex');

    new Users({ username, password, organization, createdFrom: 'API' })
        .save()
        .then(user => {
            req.user = user;
            next();
        })
        .catch(next);
};

const routePostActionLog = (req, res, next) => {

    // TODO this requires further discussion:
    // it's not implemented for App API yet because
    // admanager.action requires mac & nas_id which App doesn't have

    next();
};

const routePostResponse = (req, res) => {
    res.status(200).end();
};


router.post('/',
    routePostValidation,
    routePostHashPassword,
    routePostCreateUser,
    routePostActionLog,
    routePostResponse);

module.exports = router;
