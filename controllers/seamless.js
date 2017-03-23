'use strict';


const validate = (req, res, next) => {
  const { 'user-agent': userAgent, accept } = req.headers;

  const isFromApp = userAgent === 'ACE Mobile App' && accept === 'application/json';
  if (!isFromApp) {
    const err = new Error('Invalid access onto this page.');
    err.status = 400;
    return next(err);
  }

  next();
};

const json = (req, res, next) => {
  res.json(req.bag.impressionForm);
};


module.exports = {
  validate,
  json
};
