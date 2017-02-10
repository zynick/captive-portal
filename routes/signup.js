'use strict';

const argon2 = require('argon2');
const mongoose = require('mongoose');
const router = require('express').Router();
const NAS = mongoose.model('NAS');
const Users = mongoose.model('Users');



router.use((req, res, next) => {
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

});

router.get('/', (req, res, next) => {

    const { login, assets } = req.nas;

    const data = req.query;
    const idx = req.url.indexOf('?');
    data.queryString = idx === -1 ? '' : req.url.slice(idx+1);
    data.loginUrl = `/login?${data.queryString}`;

    res.render('signup', { login, assets, data });

});

router.post('/', (req, res, next) => {

    setTimeout(() => {

    const { username, password, password2, queryString } = req.body;
    const { organization, id: nasId, login, assets } = req.nas;

    if (!username || !password || !password2) {
        const data = req.body;
        data.error = 'Please fill in email and passwords';
        return res.render('signup', { login, assets, data });
    }

    if (password !== password2) {
        const data = req.body;
        data.error = 'Passwords do not match';
        return res.render('signup', { login, assets, data });
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
                    res.redirect(`/login?message=${encodeURIComponent(message)}&${queryString}`);
                })
                .catch(next);

        })
        .catch(next);

    }, 3000);

});

module.exports = router;
