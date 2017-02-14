'use strict';

const router = require('express').Router();
const mikrotik = require('../controllers/mikrotik.js');


router.use(mikrotik.getNAS);

router.get('/signup', mikrotik.signupRender);

router.post('/signup',
    mikrotik.signupValidation,
    mikrotik.hashPassword,
    mikrotik.signupCreateUser,
    mikrotik.signupActionLog,
    mikrotik.signupRedirect,
    mikrotik.signupErrorHandlerRender);

// http://wiki.mikrotik.com/wiki/HotSpot_external_login_page
router.get('/login',
    mikrotik.loginJsonp,
    mikrotik.getAsset,
    mikrotik.loginRender
);

router.get('/impression',
    mikrotik.getAsset,
    mikrotik.impressionRender
);


module.exports = router;
