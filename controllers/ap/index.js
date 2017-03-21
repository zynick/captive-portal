'use strict';

const mikrotik = require('./mikrotik.js');
const cambium = require('./cambium.js');


const generateUrl = (req, res, next) => {
  const { type } = req.query;

  if (type === 'mikrotik') {
    mikrotik.generateUrl(req, res, next);
  } else if (type === 'cambium') {
    cambium.generateUrl(req, res, next);
  } else {
    const err = new Error('invalid type parameter');
    next(err);
  }
};

const generateSuccessForm = (req, res, next) => {
  const { type } = req.query;

  if (type === 'mikrotik') {
    mikrotik.generateSuccessForm(req, res, next);
  } else if (type === 'cambium') {
    cambium.generateSuccessForm(req, res, next);
  } else {
    const err = new Error('invalid type parameter');
    next(err);
  }
};

module.exports = {
  generateUrl,
  generateSuccessForm
};
