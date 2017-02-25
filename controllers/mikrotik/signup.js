'use strict';

const mongoose = require('mongoose');
const querystring = require('querystring');
const log = require('debug')('portal:mikrotik');
const MAC = mongoose.model('MAC');
const admanager = require('../../lib/admanager.js');


const _admanagerCallbackErrorHandler = (req, next) =>
  (err, httpRes) => {
    if (err) {
      return next(err);
    }

    if (httpRes.statusCode !== 200) {
      err = new Error(`Unable to connect to AD Server: ${httpRes.statusMessage}`);
      err.status = httpRes.statusCode;
      return next(err);
    }

    req.admanager = httpRes.body;
    next();
  };

const signupTypeFilter = (req, res, next) => {

  const { bag } = req;
  const {
    facebook = false,
    google = false,
    guest = false,
    email = false
  } = req.nas.login;

  bag.isFacebookEnabled = facebook;
  bag.isGoogleEnabled = google;
  bag.isGuestEnabled = guest && req.query.trial === 'yes';
  bag.isEmailEnabled = email;

  if (bag.isGuestEnabled) {
    const queryString = querystring.stringify(req.query);
    bag.guestUrl = `guest?${queryString}`;
  }

  next();
};

const signupRender = (req, res, next) => {
  const { logo } = req.nas.assets;
  const {
    isFacebookEnabled,
    isGoogleEnabled,
    isGuestEnabled,
    guestUrl,
    isEmailEnabled
  } = req.bag;
  const data = req.query;

  res.render('mikrotik/signup', {
    logo,
    isFacebookEnabled,
    isGoogleEnabled,
    isGuestEnabled,
    guestUrl,
    isEmailEnabled,
    data
  });
};

const signupEmailValidation = (req, res, next) => {
  const { email, mobile } = req.body;

  if (!email || !mobile) {
    const err = new Error('Please fill in email and mobile.');
    err.status = 499;
    return next(err);
  }

  next();
};

const signupCreateMac = (req, res, next) => {
  const { mac, email, mobile } = req.body;
  const { organization, id: createdFrom } = req.nas;

  new MAC({ mac, organization, email, mobile, createdFrom })
    .save()
    .then(mac => next())
    .catch(next);
};

const signupActionLog = (req, res, next) => {
  const { organization, id: nasId } = req.nas;
  const { mac, email, mobile } = req.body;
  const action = 'signup';
  const payload = { type: 'Captive-Portal', email, mobile };

  admanager.action(organization, nasId, mac, undefined, action, payload,
    _admanagerCallbackErrorHandler(req, next)
  );
};

const signupRedirect = (req, res, next) => {
  const { loginUrl, mac, nas, chapId, chapChallenge, redirectUrl } = req.body;
  const message = 'You have signed up successfully.';
  const query = { loginUrl, mac, nas, chapId, chapChallenge, redirectUrl, message };
  const queryString = querystring.stringify(query);
  res.redirect(`/mikrotik/success?${queryString}`);
};

const signupErrorRender = (err, req, res, next) => {
  if (err.status !== 499 && err.name !== 'MongooseError' && err.name !== 'ValidationError') {
    return next(err);
  }

  const { logo } = req.nas.assets;
  const {
    isFacebookEnabled,
    isGoogleEnabled,
    isGuestEnabled,
    guestUrl,
    isEmailEnabled
  } = req.bag;
  const formError = err.message;
  const data = req.body;

  res.render('mikrotik/signup', {
    logo,
    formError,
    isFacebookEnabled,
    isGoogleEnabled,
    isGuestEnabled,
    guestUrl,
    isEmailEnabled,
    data
  });
};


module.exports = {
  signupTypeFilter,
  signupRender,

  signupEmailValidation,
  signupCreateMac,
  signupActionLog,
  signupRedirect,
  signupErrorRender
};
