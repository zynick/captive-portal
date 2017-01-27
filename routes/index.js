'use strict';

const log = require('debug')('cp:routes:index');
const router = require('express').Router();
const isProd = process.env.NODE_ENV === 'production';


const routeDebug = (req, res, next) => {
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

const routeNotFound = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
};

const routeErrorHandlerRender = (err, req, res, next) => {
    const { status = 500, message = 'Internal Server Error' } = err;
    const error = { status, message };
    // hide stacktrace in production, show otherwise
    if (!isProd) { error.stack = err.stack; }
    res
        .status(status)
        .render('error', { error });
};



if (!isProd) {
    router.use(routeDebug);
}
router.get('/', (req, res) => res.redirect('/login'));
router.use('/login', require('./login'));
router.use('/signup', require('./signup'));
router.use('/impression', require('./impression'));
router.use(routeNotFound);
router.use(routeErrorHandlerRender);


module.exports = router;
