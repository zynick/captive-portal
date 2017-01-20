'use strict';

const log = require('debug')('cp:routes:index');
const router = require('express').Router();
const api = require('./api');
const home = require('./home');
const login = require('./login');
const isProd = process.env.NODE_ENV === 'production';


router.get('/', (req, res) => {

    if (!isProd) {
        log('==========');
        // log(`KEYS: ${Object.keys(req)}`);
        log(`HEADERS: ${JSON.stringify(req.headers, null, 2)}`);
        log(`QUERY: ${JSON.stringify(req.query, null, 2)}`);
        log(`COOKIES: ${JSON.stringify(req.cookies, null, 2)}`);
        log(`PARAMS: ${JSON.stringify(req.params, null, 2)}`);
        log(`BODY: ${JSON.stringify(req.body, null, 2)}`);

        // for development only. remove later
        // res.setHeader('Access-Control-Allow-Credentials', 'true');
        // res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.render('index', { title: 'Index Page' });
});

router.use('/api', api);
router.use('/home', home);
router.use('/login', login);


/* 404 & Error Handlers */
router.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

router.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    const error = isProd ? {} : err; // only print stacktrace in development, hide in production
    res
        .status(status)
        .render('error', { message, error });
});


module.exports = router;
