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
  } = req.nas.login;

  bag.isFacebookEnabled = facebook;
  bag.isGoogleEnabled = google;
  bag.isGuestEnabled = guest && req.query.trial === 'yes';
  bag.isEmailEnabled = email;

  if (bag.isGuestEnabled) {
    const queryString = querystring.stringify(req.query);
    bag.guestUrl = `/portal/guest?${queryString}`;
  }

  next();
};

const actionLogGet = (req, res, next) => {
  const { organization, id: nasId } = req.nas;
  const { mac } = req.query;
  const action = 'page-signup';
  const payload = { source: 'Captive-Portal' };

  admanager.action(organization, nasId, mac, undefined, action, payload,
    _actionCallbackErrorHandler(req, next)
  );
};

const render = (req, res, next) => {
  const { logo } = req.nas.assets;
  const {
    isFacebookEnabled,
    isGoogleEnabled,
    isGuestEnabled,
    guestUrl,
    isEmailEnabled
  } = req.bag;
  const data = req.query;

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
  const { email, mobile } = req.body;

  if (!email || !mobile) {
    const err = new Error('Please fill in email and mobile.');
    err.status = 499;
    return next(err);
  }

  next();
};

const createMac = (req, res, next) => {
  const { mac, email, mobile } = req.body;
  const { organization, id: createdFrom } = req.nas;

  new MAC({ mac, organization, email, mobile, createdFrom })
    .save()
    .then(mac => next())
    .catch(next);
};

const actionLogPost = (req, res, next) => {
  const { organization, id: nasId } = req.nas;
  const { mac, email, mobile } = req.body;
  const action = 'user-signup';
  const payload = { source: 'Captive-Portal', email, mobile };

  admanager.action(organization, nasId, mac, undefined, action, payload,
    _actionCallbackErrorHandler(req, next)
  );
};

const redirect = (req, res, next) => {
  let query = req.body;
  query.message = 'You have signed up successfully.';
  const queryString = querystring.stringify(query);
  res.redirect(`/portal/success?${queryString}`);
};

const errorRender = (err, req, res, next) => {
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
