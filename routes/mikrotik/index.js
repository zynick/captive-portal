'use strict';

const router = require('express').Router();

router.use('/login', require('./login'));
router.use('/signup', require('./signup'));
router.use('/impression', require('./impression'));

module.exports = router;
