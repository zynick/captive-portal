'use strict';

const mongoose = require('mongoose');
const querystring = require('querystring');
const MAC = mongoose.model('MAC');
const admanager = require('../../lib/admanager.js');


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

const typeFilter = (req, res, next) => {

  const { bag } = req;
  const {
    facebook = false,
    google = false,
    guest = false,
    email = false
  } = bag.nas.login;

  bag.isFacebookEnabled = facebook;
  bag.isGoogleEnabled = google;
  bag.isGuestEnabled = guest && bag.input.trial === 'yes';
  bag.isEmailEnabled = email;

  if (bag.isGuestEnabled) {
    const queryString = querystring.stringify(bag.input);
    bag.guestUrl = `/portal/guest?${queryString}`;
  }

  next();
};

const actionLogGet = (req, res, next) => {
  const { organization, id: nasId } = req.bag.nas;
  const { mac } = req.bag.input;
  const action = 'page-signup';
  const payload = { source: 'Captive-Portal' };

  admanager.action(organization, nasId, mac, undefined, action, payload,
    _actionCallbackErrorHandler(req, next)
  );
};

const render = (req, res) => {
  const { logo } = req.bag.nas.assets;
  const {
    isFacebookEnabled,
    isGoogleEnabled,
    isGuestEnabled,
    guestUrl,
    isEmailEnabled
  } = req.bag;
  const data = req.bag.input;

  res.render('signup', {
    logo,
    isFacebookEnabled,
    isGoogleEnabled,
    isGuestEnabled,
    guestUrl,
    isEmailEnabled,
    data
  });
};

const validate = (req, res, next) => {
  const { email, mobile } = req.bag.input;

  if (!email || !mobile) {
    const err = new Error('Please fill in email and mobile.');
    err.status = 499;
    return next(err);
  }

  next();
};

const createMac = (req, res, next) => {
  const { organization, id: createdFrom } = req.bag.nas;
  const { mac, email, mobile } = req.bag.input;

  new MAC({ organization, mac, email, mobile, createdFrom })
    .save()
    .then(() => next())
    .catch(next);
};

const actionLogPost = (req, res, next) => {
  const { organization, id: nasId } = req.bag.nas;
  const { mac, email, mobile } = req.bag.input;
  const action = 'user-signup';
  const payload = { source: 'Captive-Portal', email, mobile };

  admanager.action(organization, nasId, mac, undefined, action, payload,
    _actionCallbackErrorHandler(req, next)
  );
};

const redirect = (req, res) => {
  const { input } = req.bag;
  input.message = 'You have signed up successfully.';
  const queryString = querystring.stringify(input);
  res.redirect(`/portal/success?${queryString}`);
};

const errorRender = (err, req, res, next) => {
  if (err.status !== 499 && err.name !== 'MongooseError' && err.name !== 'ValidationError') {
    return next(err);
  }

  const { logo } = req.bag.nas.assets;
  const {
    isFacebookEnabled,
    isGoogleEnabled,
    isGuestEnabled,
    guestUrl,
    isEmailEnabled
  } = req.bag;
  const formError = err.message;
  const data = req.bag.input;

  res.render('signup', {
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
  typeFilter,
  actionLogGet,
  render,

  validate,
  createMac,
  actionLogPost,
  redirect,
  errorRender
};
