'use strict';

const router = require('express').Router();
const { NODE_ENV } = require('../config.js');

const ap = require('../controllers/ap/index.js');
const cambium = require('../controllers/ap/cambium.js');
const controller = require('../controllers/index.js');
const common = require('../controllers/common.js');
const connect = require('../controllers/connect.js');
const signup = require('../controllers/signup.js');
const guest = require('../controllers/guest.js');
const seamless = require('../controllers/seamless.js');
const success = require('../controllers/success.js');


if (NODE_ENV !== 'production') {
  router.use(controller.debug);
}

router.get('/', controller.index);

router.use('/api', require('./api'));
router.use('/worker', require('./worker'));

router.get('/cambium', cambium.parse);

// this is assuming user has already signed up.
// what if user haven't sign up yet?
router.get('/seamless',
  seamless.validate,
  common.init,
  common.getNAS,
  common.generateToken,
  ap.generateSuccessForm,
  seamless.json,
  controller.errorHandlerJSON);

router.get('/connect',
  connect.checkSeamless,
  common.init,
  common.getNAS,
  connect.checkNewMac,
  connect.generateUrl,
  connect.actionLog,
  connect.render);

router.get('/signup',
  common.init,
  common.getNAS,
  signup.typeFilter,
  signup.actionLogGet,
  signup.render);

router.post('/signup',
  common.init,
  common.getNAS,
  signup.typeFilter,
  signup.validate,
  signup.createMac,
  signup.actionLogPost,
  signup.redirect,
  signup.errorRender);

router.get('/guest',
  common.init,
  common.getNAS,
  guest.validate,
  common.getAds,
  common.processAds,
  ap.generateGuestForm,
  guest.actionLog,
  guest.render);

router.get('/success',
  common.init,
  common.getNAS,
  success.validate,
  common.generateToken,
  common.getAds,
  common.processAds,
  ap.generateSuccessForm,
  success.actionLog,
  success.render);

router.use(controller.notFound);
router.use(controller.errorHandlerRender);


module.exports = router;
