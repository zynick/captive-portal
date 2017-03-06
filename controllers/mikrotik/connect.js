'use strict';

const mongoose = require('mongoose');
const querystring = require('querystring');
const log = require('debug')('portal:mikrotik');
const MAC = mongoose.model('MAC');
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

const checkNewMac = (req, res, next) => {
  const { mac } = req.query;
  const { organization } = req.nas;

  MAC
    .findOne({ mac, organization })
    .maxTime(10000)
    .exec()
    .then(mac => {
      req.bag.isNewUser = !mac;
      next();
    })
    .catch(next);
};

const generateUrl = (req, res, next) => {
  const { query, bag } = req;
  const queryString = querystring.stringify(query);

  const page = bag.isNewUser ? 'signup' : 'success';
  bag.buttonUrl = `/mikrotik/${page}?${queryString}`;

  // bag.guestUrl = `/mikrotik/guest?${queryString}`;
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

  res.render('mikrotik/connect', {
    logo,
    error,
    announcements,
    buttonUrl
  });
};


module.exports = {
  checkNewMac,
  generateUrl,
  actionLog,
  render
};
