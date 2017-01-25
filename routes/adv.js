'use strict';

const router = require('express').Router();
const { url: defaultURL, adv } = require('../config.json').default;

router.get('/', (req, res, next) => {

    // TODO query ad from db (based on nas id / mac address?), and then loads here

    const url = req.query['link-orig'] || defaultURL;

    res.render('adv', {
        adv,
        url
    });
});


module.exports = router;
