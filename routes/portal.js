'use strict';

const router = require('express').Router();
const controller = require('../controllers/index.js');

const ap = require('../controllers/portal/ap/index.js');
const cambium = require('../controllers/portal/ap/cambium.js');
const common = require('../controllers/portal/common.js');
const connect = require('../controllers/portal/connect.js');
const signup = require('../controllers/portal/signup.js');
const guest = require('../controllers/portal/guest.js');
const seamless = require('../controllers/portal/seamless.js');
const success = require('../controllers/portal/success.js');



router.get('/cambium', cambium.parse);

router.use(common.init);
router.use(common.getNAS);

// this is assuming user has already signed up.
// what if user haven't sign up yet?
router.get('/seamless',
  seamless.validate,
  common.generateToken,
  ap.generateSuccessForm,
  seamless.json,
  controller.errorHandlerJSON);

router.get('/connect',
  connect.checkSeamless,
  connect.checkNewMac,
  connect.generateUrl,
  connect.actionLog,
  connect.render);

router.get('/signup',
  signup.typeFilter,
  signup.actionLogGet,
  signup.render);

router.post('/signup',
  signup.typeFilter,
  signup.validate,
  signup.createMac,
  signup.actionLogPost,
  signup.redirect,
  signup.errorRender);

router.get('/guest',
  guest.validate,
  common.getAds,
  common.processAds,
  ap.generateGuestForm,
  guest.actionLog,
  guest.render);

router.get('/success',
  success.validate,
  common.getAds,
  common.processAds,
  common.generateToken,
  ap.generateSuccessForm,
  success.actionLog,
  success.render);

module.exports = router;
