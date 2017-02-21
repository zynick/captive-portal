'use strict';

const mongoose = require('mongoose');
const querystring = require('querystring');
const NAS = mongoose.model('NAS');
const Users = mongoose.model('Users');
const { ARGON2_SALT_SUFFIX } = require('../config.js');
const admanager = require('../lib/admanager.js');
const argon2 = require('../lib/argon2.js');


const getNAS = (req, res, next) => {

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

const getAsset = (req, res, next) => {

    const { organization } = req.nas;
    const { identity, mac, username } = req.query;

    admanager.asset(organization, identity, mac, username,
        (err, httpRes) => {
            if (err) {
                return next(err);
            }

            if (httpRes.statusCode !== 200) {
                err = new Error(`Unable to query content from AD Server: ${httpRes.statusMessage}`);
                err.status = httpRes.statusCode;
                return next(err);
            }

            req.httpRes = httpRes;
            next();
        });
};

const hashPassword = (req, res, next) => {

    const { username, password } = req.body;

    argon2.hashPassword(username, password,
        (err, hash) => {
            req.hash = hash;
            next(err);
        });
};


/* Signup */

const signupRender = (req, res, next) => {

    const { login, assets } = req.nas;

    let data = req.query;
    delete data.message;
    delete data.error;

    data.queryString = querystring.stringify(data);
    data.loginUrl = `/mikrotik/login?${data.queryString}`;

    res.render('mikrotik/signup', { login, assets, data });
};

const signupValidation = (req, res, next) => {

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

const signupCreateUser = (req, res, next) => {

    const { username } = req.body;
    const password = req.hash;
    const { organization, id: nasId } = req.nas;

    new Users({ username, password, organization, nasId })
        .save()
        .then(user => {
            req.user = user;
            next();
        })
        .catch(next);
};

const signupActionLog = (req, res, next) => {

    const { organization, id: nas_id } = req.nas;
    const { mac, username: id } = req.body;
    const payload = {
        type: 'Captive-Portal',
        action: 'signup'
    };
    admanager.action(organization, nas_id, mac, id, payload,
        (err, httpRes) => {
            if (err) {
                return next(err);
            }

            if (httpRes.statusCode !== 200) {
                const err = new Error(`Unable to communicate with AD Server: ${httpRes.statusMessage}`);
                err.status = httpRes.statusCode;
                return next(err);
            }

            next();
        });
};

const signupRedirect = (req, res, next) => {

    let query = querystring.parse(req.body.queryString);
    query.username = req.user.username;
    query.message = 'You have signed up successfully.';
    const qs = querystring.stringify(query);

    res.redirect(`/mikrotik/login?${qs}`);
};

const signupErrorHandlerRender = (err, req, res, next) => {

    if (err.status !== 499 && err.name !== 'MongooseError' && err.name !== 'ValidationError') {
        console.log(JSON.stringify(err));
        return next(err);
    }

    const { login, assets } = req.nas;
    const data = req.body;
    data.error = err.message;
    res.render('mikrotik/signup', { login, assets, data });
};


/* Login */

const loginJsonp = (req, res, next) => {
    // for app's seamless connection
    if (req.headers.accept === 'application/javascript') {
        return res.jsonp({
            query: req.query,
            salt: ARGON2_SALT_SUFFIX
        });
    }
    next();
}

const loginRender = (req, res, next) => {

    let responded = false;

    req.httpRes.body
        .every(ad => {
            if (ad.type !== 'board') {
                return true;
            }

            const { query, nas: { login, assets } } = req;

            login.guestEnabled = login.guest && query.trial === 'yes';

            const idx = req.url.indexOf('?');
            const queryString = idx === -1 ? '' : req.url.slice(idx);
            login.signupUrl = `/mikrotik/signup${queryString}`;

            res.render('mikrotik/login', { login, assets, query, ad, ARGON2_SALT_SUFFIX });

            responded = true;
            return false;
        });

    if (!responded) {
        next(new Error('No relevant ads found from system.'));
    }
};


/* Impression */

const impressionRender = (req, res, next) => {

    let responded = false;

    req.httpRes.body
        .every(asset => {
            if (asset.type !== 'board') {
                return true;
            }

            res.render('mikrotik/impression', { asset });

            responded = true;
            return false;
        });

    if (!responded) {
        next(new Error('No relevant ads found from system.'));
    }
};


module.exports = {
    getNAS,
    getAsset,
    hashPassword,
    signupRender,
    signupValidation,
    signupCreateUser,
    signupActionLog,
    signupRedirect,
    signupErrorHandlerRender,
    loginJsonp,
    loginRender,
    impressionRender
};
