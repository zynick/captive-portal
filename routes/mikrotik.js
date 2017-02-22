'use strict';

const router = require('express').Router();
const mikrotik = require('../controllers/mikrotik.js');


router.use(mikrotik.init);
router.use(mikrotik.getNAS);

router.get('/connect',
  mikrotik.connectCheckNewMac,
  mikrotik.connectCheckGuestEnabled,
  mikrotik.connectGenerateUrl,
  mikrotik.connectRender);

router.get('/signup',
  mikrotik.signupRender);
router.post('/signup',
  mikrotik.signupEmailValidation,
  mikrotik.signupCreateMac,
  mikrotik.signupActionLog,
  mikrotik.signupRedirect,
  mikrotik.signupErrorRender);

router.get('/guest',
  mikrotik.guestEnabledValidation,
  mikrotik.getAds,
  mikrotik.guestRender);

router.get('/success',
  mikrotik.successMacValidation,
  mikrotik.successGenerateToken,
  mikrotik.getAds,
  mikrotik.successRender);


module.exports = router;
