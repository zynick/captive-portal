'use strict';

const router     = require('express').Router();
const controller = require('../controllers/index.js');
const worker     = require('../controllers/worker.js');


router.use(api.tokenValidation);

router.post('/add', api.addWorker);

router.use(controller.badRequest);
router.use(controller.errorHandlerJSON);

module.exports = router;
