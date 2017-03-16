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
    next();
  }
};

module.exports = {
  generateUrl
};
