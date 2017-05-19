'use strict';

const router = require('express').Router();
const { NODE_ENV } = require('../config.js');
const controller = require('../controllers/index.js');


if (NODE_ENV !== 'production') {
  router.use(controller.debug);
}

router.get('/', controller.index);

router.use('/portal', require('./portal'));

router.use(
  controller.notFound,
  controller.mongooseHandlerRender,
  controller.errorHandlerRender);


module.exports = router;
