'use strict';

const router = require('express').Router();

const mikrotik = require('../controllers/mikrotik/index.js');
const connect = require('../controllers/mikrotik/connect.js');
const signup = require('../controllers/mikrotik/signup.js');
const guest = require('../controllers/mikrotik/guest.js');
const success = require('../controllers/mikrotik/success.js');


// TODO check where to put in action log?

router.use(mikrotik.init);
router.use(mikrotik.getNAS);

// TODO is it better to make the button to point to connect?
router.get('/connect',
  connect.connectCheckNewMac,
  connect.connectGenerateUrl,
  connect.connectRender);

router.get('/signup',
  signup.signupTypeFilter,
  signup.signupRender);

router.post('/signup',
  signup.signupTypeFilter,
  signup.signupEmailValidation,
  signup.signupCreateMac,
  signup.signupActionLog,
  signup.signupRedirect,
  signup.signupErrorRender);

router.get('/guest',
  guest.guestEnabledValidation,
  mikrotik.getAds,
  guest.guestRender);

router.get('/success',
  success.successMacValidation,
  success.successGenerateToken,
  mikrotik.getAds,
  success.successRender);


module.exports = router;
