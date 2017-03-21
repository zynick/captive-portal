'use strict';

const mikrotik = require('./mikrotik.js');
const cambium = require('./cambium.js');


const _getFunction = (fn) => {
  return (req, res, next) => {
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
}

const generateUrl = _getFunction('generateUrl');
const generateGuestForm = _getFunction('generateGuestForm');
const generateSuccessForm = _getFunction('generateSuccessForm');


module.exports = {
  generateUrl,
  generateGuestForm,
  generateSuccessForm
};
