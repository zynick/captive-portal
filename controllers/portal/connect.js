'use strict';

const querystring = require('querystring');
const admanager = require('../../lib/admanager.js');


// TODO refactor this code. put it somewhere that other controllers can share the code.
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

const checkSeamless = (req, res, next) => {
  const { 'user-agent': userAgent, accept } = req.headers;

  // redirect if request coming from app
  const isFromApp = userAgent === 'ACE Mobile App' && accept === 'application/json';
  if (isFromApp) {
    const queryString = querystring.stringify(req.query);
    return res.redirect(`/portal/seamless?${queryString}`);
  }

  next();
};

const generateUrl = (req, res, next) => {
  const { query, bag } = req;
  const queryString = querystring.stringify(query);

  const page = bag.isNewUser ? 'signup' : 'success';
  bag.buttonUrl = `/portal/${page}?${queryString}`;

  next();
};

const actionLog = (req, res, next) => {
  const { organization, id: nasId } = req.nas;
  const { mac } = req.query;
  const action = 'page-connect';
  const payload = { source: 'Captive-Portal' };

  admanager.action(organization, nasId, mac, undefined, action, payload,
    _actionCallbackErrorHandler(req, next)
  );
};

const render = (req, res, next) => {
  const { logo, announcements } = req.nas.assets;
  const { error } = req.query;
  const { buttonUrl } = req.bag;

  res.render('connect', {
    logo,
    error,
    announcements,
    buttonUrl
  });
};


module.exports = {
  checkSeamless,
  generateUrl,
  actionLog,
  render
};
