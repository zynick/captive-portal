'use strict';

const router = require('express').Router();

const mikrotik = require('../controllers/mikrotik/index.js');
const connect = require('../controllers/mikrotik/connect.js');
const signup = require('../controllers/mikrotik/signup.js');
const guest = require('../controllers/mikrotik/guest.js');
const success = require('../controllers/mikrotik/success.js');


router.use(mikrotik.init);
router.use(mikrotik.getNAS);

// TODO is it better to make the button on this page to point to /connect?
// i.e. only loads generateUrl when user click the button
router.get('/connect',
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
  signup.emailValidation,
  signup.createMac,
  signup.actionLogPost,
  signup.redirect,
  signup.errorRender);

router.get('/guest',
  guest.enabledValidation,
  mikrotik.getAds,
  guest.actionLog,
  guest.render);

router.get('/success',
  success.macValidation,
  success.generateToken,
  mikrotik.getAds,
  success.actionLog,
  success.render);


module.exports = router;
