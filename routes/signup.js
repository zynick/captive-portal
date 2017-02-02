'use strict';

const mongoose = require('mongoose');
const router = require('express').Router();
const NAS = mongoose.model('NAS');
const Users = mongoose.model('Users');
mongoose.Promise = global.Promise;

router.use((req, res, next) => {
    const id = req.query.identity || req.body.identity;

    NAS.findOne({ id }, (err, nas) => {
        if (err) {
            return next(err);
        }

        if (!nas) {
            // should not reach here unless user modify the input data
            return next(new Error('Missing Identity Parameter'));
        }

        req.nas = nas;
        next();
    });
});

router.get('/', (req, res, next) => {

    const { login, assets } = req.nas;

    const data = req.query;
    const idx = req.url.indexOf('?');
    data.queryString = idx === -1 ? '' : req.url.slice(idx+1);
    data.loginUrl = `/login?${data.queryString}`;

    res.render('signup', {
        login,
        assets,
        data
    });

});

router.post('/', (req, res, next) => {

    const { username, password, password2, queryString } = req.body;
    const {
        organization,
        id: nas,
        login = {},
        assets = {}
    } = req.nas;

    if (!username || !password || !password2) {
        return next(new Error('Please fill in email and passwords'));
    }

    if (password !== password2) {
        return next(new Error('Passwords do not match'));
    }

    new Users({
            username,
            password,
            organization,
            nas
        })
        .save()
        .then((user) => {
            const message = 'You have signed up successfully.';
            res.redirect(`/login?message=${encodeURIComponent(message)}&${queryString}`);
        })
        .catch((err) => {
            next(err);
        });

}, (err, req, res, next) => {
    const {
        login = {},
        assets = {}
    } = req.nas;

    const data = req.body;
    data.error = err.message;

    res.render('signup', {
        login,
        assets,
        data
    });
});

module.exports = router;
