'use strict';

const mongoose = require('mongoose');
const querystring = require('querystring');
const { HOST } = require('../../config.js');
const admanager = require('../../lib/admanager.js');
const admanagerController = require('../admanager.js');
const MAC = mongoose.model('MAC');


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

const redirectNewMacToRegister = (req, res, next) => {

  if (req.bag.isNewMac) {
    const queryString = querystring.stringify(req.bag.input);
    return res.redirect(`/portal/seamless/register?${queryString}`);
  }

  next();
};

const json = (req, res) => {
  res.json(req.bag.seamlessForm);
};

const registerJSON = (req, res) => {

  const url = `${HOST}/portal/seamless/register`;

  const body = req.bag.input;
  body.nas = req.bag.nas.id;

  const json = {
    url,
    method: 'POST',
    body,
    register: true,
  };

  res.json(json);
};

const registerMac = (req, res, next) => {
  const {
    mac,
    email = '',
    mobile = '',
    userId = '',
    nas: createdFrom
  } = req.bag.input;
  const { organization } = req.bag.nas;

  new MAC({ mac, organization, email, mobile, userId, createdFrom })
    .save()
    .then(() => next())
    .catch(next);
};

const actionLog = (req, res, next) => {
  const {
    mac,
    email = '',
    mobile = '',
    userId = '',
    nas
  } = req.bag.input;
  const { organization } = req.bag.nas;

  const action = 'user-signup';
  const payload = { source: 'Captive-Portal', email, mobile };

  admanager.action(organization, nas, mac, userId, action, payload,
    admanagerController.generateCallbackErrorHandler(next)
  );
};


module.exports = {
  validate,
  redirectNewMacToRegister,
  json,
  registerJSON,

  registerMac,
  actionLog
};
