'use strict';

const argon2 = require('argon2');
const mongoose = require('mongoose');
const querystring = require('querystring');
const router = require('express').Router();
const NAS = mongoose.model('NAS');
const Users = mongoose.model('Users');


const routeGetNAS = (req, res, next) => {

    const id = req.query.identity || req.body.identity;

    NAS
        .findOne({ id })
        .maxTime(10000)
        .exec()
        .then(nas => {
            if (!nas) {
                const err = new Error('NAS does not exist.');
                err.status = 400;
                return next(err);
            }

            req.nas = nas;
            next();
        })
        .catch(next);
};

const routeGet = (req, res, next) => {

    const { login, assets } = req.nas;

    let data = req.query;
    delete data.message;
    delete data.error;

    data.queryString = querystring.stringify(data);
    data.loginUrl = `/mikrotik/login?${data.queryString}`;

    res.render('mikrotik/signup', { login, assets, data });
};

const routePostValidation = (req, res, next) => {

    const { username, password, password2 } = req.body;

    if (!username || !password || !password2) {
        const err = new Error('Please fill in email and passwords');
        err.status = 499;
        return next(err);
    }

    if (password !== password2) {
        const err = new Error('Passwords do not match.');
        err.status = 499;
        return next(err);
    }

    next();
};

const routePostHashPassword = (req, res, next) => {

    const { username, password } = req.body;

    argon2
        .hash(password, new Buffer(username + 'ace-tide'), {
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

    const { username } = req.body;
    const password = req.hash.toString('hex');
    const { organization, id: nasId } = req.nas;

    new Users({ username, password, organization, nasId })
        .save()
        .then(user => {
            req.user = user;
            next();
        })
        .catch(next);
};

const routePostResponse = (req, res, next) => {

    let query = querystring.parse(req.body.queryString);
    query.username = req.user.username;
    query.message = 'You have signed up successfully.';
    const qs = querystring.stringify(query);

    res.redirect(`/mikrotik/login?${qs}`);
};

const routePostErrorHandler = (err, req, res, next) => {

    if (err.status !== 499 && err.name !== 'MongooseError' && err.name !== 'ValidationError') {
        console.log(JSON.stringify(err));
        return next(err);
    }

    const { login, assets } = req.nas;
    const data = req.body;
    data.error = err.message;
    res.render('mikrotik/signup', { login, assets, data });
};


router.use(routeGetNAS);
router.get('/', routeGet);
router.post('/',
    routePostValidation,
    routePostHashPassword,
    routePostCreateUser,
    routePostResponse,
    routePostErrorHandler);

module.exports = router;
