'use strict';

const router = require('express').Router();
const { url, impression } = require('../config.json').defaults;

router.get('/', (req, res, next) => {

    // TODO query ad from db (based on nas id / mac address?), and then loads here

    res.render('impression', {
        impression,
        url
    });
});


module.exports = router;
