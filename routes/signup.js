'use strict';

const argon2 = require('argon2');
const mongoose = require('mongoose');
const router = require('express').Router();
const NAS = mongoose.model('NAS');
const Users = mongoose.model('Users');


const routeGetNAS = (req, res, next) => {
    const id = req.query.identity || req.body.identity;

    NAS
        .findOne({ id })
        .maxTime(10000)
        .exec()
        .then((nas) => {
            if (!nas) {
                // should not reach here unless user modify the input data
                return next(new Error('Missing Identity Parameter.'));
            }
            req.nas = nas;
            next();
        })
        .catch(next);
};

const routeGet = (req, res, next) => {

    const { login, assets } = req.nas;

    const data = req.query;
    const idx = req.url.indexOf('?');
    data.queryString = idx === -1 ? '' : req.url.slice(idx+1);
    data.loginUrl = `/login?${data.queryString}`;

    res.render('signup', { login, assets, data });
};

const routePost = (req, res,  next) => {

    const { username, password, password2, queryString } = req.body;
    const { organization, id: nasId, login, assets } = req.nas;

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

    argon2
        .hash(password, new Buffer(username + 'ace-tide'), {
            type: argon2.argon2d,
            timeCost: 3,
            memoryCost: 11,
            parallelism: 1,
            raw: true
        })
        .then(hash => {

            const hashPass = hash.toString('hex');

            new Users({ username, password: hashPass, organization, nasId })
                .save()
                .then(user => {
                    const message = 'You have signed up successfully.';
                    res.redirect(`/login?username=${encodeURIComponent(username)}&message=${encodeURIComponent(message)}&${queryString}`);
                })
                .catch(next);

        })
        .catch(next);
};

const routePostErrorHandler = (err, req, res, next) => {

    if (err.status !== 499 && err.name !== 'MongooseError') {
        return next(err, req, res);
    }

    const { login, assets } = req.nas;
    const data = req.body;
    data.error = err.message;
    res.render('signup', { login, assets, data });
};


router.use(routeGetNAS);
router.get('/', routeGet);
router.post('/', routePost, routePostErrorHandler);

module.exports = router;
