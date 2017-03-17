'use strict';

const router     = require('express').Router();
const controller = require('../controllers/index.js');
const worker     = require('../controllers/worker.js');

router.get('/ping',     worker.pong);
router.get('/list',     worker.listWorkers);
router.get('/earliest', worker.getEarliestActivated);
router.post('/add',     worker.addWorker);

router.use(controller.badRequest);
router.use(controller.errorHandlerJSON);

module.exports = router;
