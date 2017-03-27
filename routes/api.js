'use strict';

const router = require('express').Router();
const controller = require('../controllers/index.js');
const api = require('../controllers/api.js');


router.use(api.tokenValidation);

router.post('/authenticate',
  api.formValidation,
  api.hashPassword,
  api.authenticateUser,
  api.authenticateResponse);

router.post('/registration',
  api.formValidation,
  api.hashPassword,
  api.registerUser,
  api.registerActionLog,
  api.registerResponse);

router.use(controller.badRequest);
router.use(controller.errorHandlerJSON);


module.exports = router;
