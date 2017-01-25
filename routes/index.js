'use strict';

const log = require('debug')('cp:routes:index');
const router = require('express').Router();
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
    router.all('/', (req, res) => {
        log('==========');
        log(`HEADERS: ${JSON.stringify(req.headers, null, 2)}`);
        log(`QUERY: ${JSON.stringify(req.query, null, 2)}`);
        log(`COOKIES: ${JSON.stringify(req.cookies, null, 2)}`);
        log(`PARAMS: ${JSON.stringify(req.params, null, 2)}`);
        log(`BODY: ${JSON.stringify(req.body, null, 2)}`);
        // res.setHeader('Access-Control-Allow-Credentials', 'true');
        // res.setHeader('Access-Control-Allow-Origin', '*');
        res.redirect('/login');
    });
}

router.get('/', (req, res) => res.redirect('/login'));
router.use('/api', require('./api'));
router.use('/login', require('./login'));
router.use('/impression', require('./impression'));


/* 404 & Error Handlers */
router.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

router.use((err, req, res, next) => {
    const { status = 500, message = 'Internal Server Error' } = err;
    const error = { status, message };
    // hide stacktrace in production, show otherwise
    if (!isProd) { error.stack = err.stack; }
    res
        .status(status)
        .render('error', { error });
});


module.exports = router;
