'use strict';

const router = require('express').Router();

const index = require('../controllers/mikrotik/index.js');
const connect = require('../controllers/mikrotik/connect.js');
const signup = require('../controllers/mikrotik/signup.js');
const guest = require('../controllers/mikrotik/guest.js');
const success = require('../controllers/mikrotik/success.js');


// TODO check action log

router.use(index.init);
router.use(index.getNAS);

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
  index.getAds,
  guest.guestRender);

router.get('/success',
  success.successMacValidation,
  success.successGenerateToken,
  index.getAds,
  success.successRender);


module.exports = router;
