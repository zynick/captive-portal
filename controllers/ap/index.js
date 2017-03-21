'use strict';

const mikrotik = require('./mikrotik.js');
const cambium = require('./cambium.js');

const _getFunction = (fn) =>
  (req, res, next) => {
    const { type } = req.query;

    if (type === 'mikrotik') {
      mikrotik[fn](req, res, next);
    } else if (type === 'cambium') {
      cambium[fn](req, res, next);
    } else {
      const err = new Error('invalid type parameter');
      next(err);
    }
  };

module.exports = {
  generateUrl: _getFunction('generateUrl'),
  generateGuestForm: _getFunction('generateGuestForm'),
  generateSuccessForm: _getFunction('generateSuccessForm')
};
