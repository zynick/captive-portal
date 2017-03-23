'use strict';

const mongoose = require('mongoose');
const uuidV4 = require('uuid/v4');
const log = require('debug')('portal:success');
const MAC = mongoose.model('MAC');
const Tokens = mongoose.model('Tokens');
const admanager = require('../lib/admanager.js');


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

const macValidation = (req, res, next) => {
  const { organization } = req.nas;
  const { mac } = req.query;

  MAC
    .findOne({ organization, mac })
    .maxTime(10000)
    .exec()
    .then(doc => {
      if (!doc) {
        const err = new Error('Invalid device access onto this page.');
        err.status = 400;
        return next(err);
      }
      next();
    })
    .catch(next);
};

const generateToken = (req, res, next) => {
  const { organization } = req.nas;
  const { mac } = req.query;

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

const actionLog = (req, res, next) => {
  const { organization, id: nasId } = req.nas;
  const { mac } = req.query;
  const action = 'page-success';
  const payload = { source: 'Captive-Portal' };

  admanager.action(organization, nasId, mac, undefined, action, payload,
    _actionCallbackErrorHandler(req, next)
  );
};

const render = (req, res, next) => {
  const { logo } = req.nas.assets;
  const { message } = req.query;
  const { impressionImg, redirectForm, impressionForm } = req.bag;

  res.render('success', {
    logo,
    message,
    impressionImg,
    redirectForm,
    impressionForm
  });

};


module.exports = {
  macValidation,
  generateToken,
  actionLog,
  render
};
