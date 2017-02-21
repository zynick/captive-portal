'use strict';

const router = require('express').Router();
const mikrotik = require('../controllers/mikrotik.js');


router.use(mikrotik.getNAS);

router.get('/welcome',
  mikrotik.welcomeCheckNewUser,
  mikrotik.welcomeRender);

router.get('/signup', mikrotik.signupRender);
router.post('/signup',
  mikrotik.signupValidation,
  mikrotik.signupCreateMAC,
  mikrotik.signupRedirect,
  mikrotik.signupErrorHandlerRender);

router.get('/guest',
  mikrotik.guestValidation,
  mikrotik.getAds,
  mikrotik.guestRender);

router.get('/success',
  mikrotik.successValidation,
  mikrotik.successGenerateToken,
  mikrotik.getAds,
  mikrotik.successRender);

module.exports = router;
