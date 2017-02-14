'use strict';

const Users = require('mongoose').model('Users');
const { API_TOKEN } = require('../config.js');
const { hashPassword } = require('./index.js');


const tokenValidation = (req, res, next) => {

    if (req.headers.authorization !== `Bearer ${API_TOKEN}`) {
        const err = new Error('Unauthorized');
        err.status = 401;
        return next(err);
    }

    next();
};

const formValidation = (req, res, next) => {

    const { username, password, organization } = req.body;

    if (!username || !password || !organization) {
        const err = new Error('username / password / organization does not exist.');
        err.status = 400;
        return next(err);
    }
    next();
};


/* Registration */

const registerUser = (req, res, next) => {

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

const registerActionLog = (req, res, next) => {
    /**
     * TODO this requires further discussion:
     * it's not implemented for App API yet because
     * admanager.action requires mac & nas_id which App doesn't have
     */
    next();
};

const registerResponse = (req, res) => {
    res.status(200).end();
};


/* Authentication */

const authenticateUser = (req, res, next) => {

    const { username, organization } = req.body;
    const password = req.hash.toString('hex');

    Users
        .findOne({ username, password, organization })
        .maxTime(10000)
        .exec()
        .then(user => {
            if (!user) {
                const err = new Error('Invalid username / password / organization.');
                err.status = 400;
                return next(err);
            }
            next();
        })
        .catch(next);
};

const authenticateResponse = (req, res) => {
    res.status(200).end();
};


module.exports = {
    tokenValidation,
    formValidation,
    hashPassword,
    registerUser,
    registerActionLog,
    registerResponse,
    authenticateUser,
    authenticateResponse
};
