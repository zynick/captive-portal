'use strict';

const router = require('express').Router();
const { url, ad } = require('../config.json').default;

router.get('/', (req, res, next) => {

    // TODO query ad from db (based on nas id / mac address?), and then loads here

    res.render('success', {
        ad,
        url
    });
});


module.exports = router;
