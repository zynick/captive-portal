'use strict';

const router = require('express').Router();
const { NODE_ENV } = require('../config.js');
const controller = require('../controllers/index.js');

// const cambium = require('../controllers/cambium.js');
const ap = require('../controllers/ap/index.js');

const common = require('../controllers/common.js');
const connect = require('../controllers/connect.js');
const signup = require('../controllers/signup.js');
const guest = require('../controllers/guest.js');
const success = require('../controllers/success.js');


if (NODE_ENV !== 'production') {
  router.use(controller.debug);
}

router.get('/', controller.index);
router.use('/api', require('./api'));

// router.use('/cambium', parser.cambium, ...);

router.get('/connect',
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
  signup.emailValidation,
  signup.createMac,
  signup.actionLogPost,
  signup.redirect,
  signup.errorRender);

router.get('/guest',
  common.init,
  common.getNAS,
  guest.enabledValidation,
  common.getAds,
  guest.processAds,
  ap.generateUrl,
  guest.actionLog,
  guest.render);

router.get('/success',
  common.init,
  common.getNAS,
  success.macValidation,
  success.generateToken,
  common.getAds,
  success.actionLog,
  success.render);

router.use(controller.notFound);
router.use(controller.errorHandlerRender);


module.exports = router;
