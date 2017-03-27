'use strict';

const mongoose = require('mongoose');
const uuidV4 = require('uuid/v4');
const Tokens = mongoose.model('Tokens');
const MAC = mongoose.model('MAC');
const { HOST } = require('../../config.js');


const _actionCallbackErrorHandler = (req, next) =>
  (err, httpRes) => {
    if (err) {
      return next(err);
    }

    if (httpRes.statusCode !== 200) {
      err = new Error(`Unable to connect to AD Server: ${httpRes.statusMessage}`);
      err.status = httpRes.statusCode;
      return next(err);
    }

    next();
  };

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

const redirectNewMac = (req, res, next) => {
  if (req.bag.isNewUser) {
    return res.redirect('/portal/seamless/register');
  }

  next();
};

const json = (req, res, next) => {
  res.json(req.bag.impressionForm); // TODO name it to a generic form perhaps?
};

const registerJSON = (req, res, next) => {

  const url = `${HOST}/portal/seamless/register`;

  const { body } = req.bag;
  body.mac = req.query.mac;
  body.nasId = req.nas.id;

  const json = {
    url,
    method: 'POST',
    body,
    register: true,
  }

  res.json(json);
};

// TODO rename
const signupMac = (req, res, next) => {
  const {
    mac,
    organization = 'unknown',
    email = '',
    mobile = '',
    userId = '',
    nasId: createdFrom
  } = req.body;

  new MAC({ mac, organization, email, mobile, userId, createdFrom })
    .save()
    .then(mac => next())
    .catch(next);
};

const actionLog = (req, res, next) => {
  const {
    mac,
    organization = 'unknown',
    email = '',
    mobile = '',
    userId = '',
    nasId
  } = req.body;

  const action = 'user-signup';
  const payload = { source: 'Captive-Portal', email, mobile };

  admanager.action(organization, nasId, mac, userId, action, payload,
    _actionCallbackErrorHandler(req, next)
  );
};

const generateToken = (req, res, next) => {
  const { organization, mac } = req.body;
  // const { organization } = req.nas;
  // const { mac } = req.query;

  Tokens
    .findOne({ organization, mac })
    .maxTime(10000)
    .exec()
    .then(doc => {

      if (doc) {
        req.bag.token = doc.token;
        return next();
      }

      const token = uuidV4().replace(/-/g, '');

      new Tokens({ organization, mac, token })
        .save()
        .then(doc => {
          req.bag.token = token;
          return next();
        })
        .catch(next);

    })
    .catch(next);
};

module.exports = {
  validate,
  redirectNewMac,
  json,
  registerJSON,

  signupMac,
  actionLog,
  generateToken
};
