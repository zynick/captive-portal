'use strict';

const router = require('express').Router();
const controller = require('../controllers/index.js');

const ap = require('../controllers/portal/ap/index.js');
const common = require('../controllers/portal/common.js');
const seamless = require('../controllers/portal/seamless.js');


router.use(seamless.validate);

router.get('/',
  common.checkNewMac,
  seamless.redirectNewMac,
  common.generateToken,
  ap.generateSuccessForm,
  seamless.json);

router.get('/register',
  ap.generateBody,
  seamless.registerJSON);

router.post('/register',
  seamless.registerMac,
  seamless.actionLog,
  seamless.generateToken,
  ap.generateSuccessForm2,
  seamless.json);

router.use(controller.errorHandlerJSON);


module.exports = router;
