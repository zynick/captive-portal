'use strict';

const router = require('express').Router();
const { url } = reuqire('../config.json');

router.get('/', (req, res, next) => {

    // TODO query ad from db (based on nas id / mac address?), and then loads here

    res.render('success', {
        ad: {
            image: '/img/ad.jpg',
            url: 'http://starbucks.com.my'
        },
        url
    });
});


module.exports = router;
