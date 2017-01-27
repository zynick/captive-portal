'use strict';

const router = require('express').Router();
const { url, logo, slogan } = require('../config.json').defaults;

router.get('/', (req, res, next) => {

    const idx = req.url.indexOf('?');
    const queryString = idx === -1 ? '' : req.url.slice(idx);

    res.render('signup', {
        url,
        logo,
        slogan,
        loginUrl: `/login${queryString}`,
        data: req.query
    });
});


module.exports = router;
