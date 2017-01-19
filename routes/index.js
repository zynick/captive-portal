'use strict';

const router = require('express').Router();
const home = require('./home');
const login = require('./login');
const isProd = process.env.NODE_ENV === 'production';

router.all('/', (req, res) => {

    if (!isProd) {
        console.log('\n');
        // console.log(`KEYS: ${Object.keys(req)}`);
        console.log(`HEADERS: ${JSON.stringify(req.headers, null, 2)}`);
        console.log(`QUERY: ${JSON.stringify(req.query, null, 2)}`);
        console.log(`COOKIES: ${JSON.stringify(req.cookies, null, 2)}`);
        console.log(`PARAMS: ${JSON.stringify(req.params, null, 2)}`);
        console.log(`BODY: ${JSON.stringify(req.body, null, 2)}`);

        // for development only. remove later
        // res.setHeader('Access-Control-Allow-Credentials', 'true');
        // res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.render('index', { title: 'Index Page' });
});

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
