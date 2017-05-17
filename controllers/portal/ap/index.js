'use strict';

const mikrotik = require('./mikrotik.js');
const cambium = require('./cambium.js');

const _getFunction = fn =>
  (req, res, next) => {
    const type = req.query.type || req.body.type;

    if (type === 'mikrotik') {
      mikrotik[fn](req, res, next);
    } else if (type === 'cambium') {
      cambium[fn](req, res, next);
    } else {
      const err = new Error('Invalid type parameter.');
      next(err);
    }
  };

module.exports = {
  generateBody: _getFunction('generateBody'),
  generateGuestForm: _getFunction('generateGuestForm'),
  generateSuccessForm: _getFunction('generateSuccessForm'),
  generateSeamlessForm: _getFunction('generateSeamlessForm'),
  generateSeamlessFormFromBody: _getFunction('generateSeamlessFormFromBody')
};
