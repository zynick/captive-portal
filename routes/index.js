var express = require('express');
var router = express.Router();

/* GET home page. */
router.all('/', function(req, res, next) {

    // console.log('KEYS:', Object.keys(req));
    console.log('HEADERS:', JSON.stringify(req.headers, null, 2));
    console.log('COOKIES:', JSON.stringify(req.cookies, null, 2));
    console.log('PARAMS:', JSON.stringify(req.params, null, 2));
    console.log('QUERY:', JSON.stringify(req.query, null, 2));
    console.log('BODY:', JSON.stringify(req.body, null, 2));
    console.log('SECRET:', JSON.stringify(req.secret, null, 2));

    res.render('index', {
        title: 'Express'
    });
});

module.exports = router;
