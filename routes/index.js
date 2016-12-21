'use strict';

const express = require('express');
const router = express.Router();

router.all('/', (req, res, next) => {

    /* Logging */

    console.log('\n');
    // console.log(`KEYS: ${Object.keys(req)}`);
    console.log(`HEADERS: ${JSON.stringify(req.headers, null, 2)}`);
    console.log(`QUERY: ${JSON.stringify(req.query, null, 2)}`);
    console.log(`COOKIES: ${JSON.stringify(req.cookies, null, 2)}`);
    console.log(`PARAMS: ${JSON.stringify(req.params, null, 2)}`);
    console.log(`BODY: ${JSON.stringify(req.body, null, 2)}`);

    // for development only. remove later
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.render('index', {
        title: 'Index Page'
    });

});

module.exports = router;
