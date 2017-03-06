'use strict';

const mongoose = require('mongoose');
const uuidV4 = require('uuid/v4');
const log = require('debug')('portal:mikrotik');
const MAC = mongoose.model('MAC');
const Tokens = mongoose.model('Tokens');


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
  const token = uuidV4().replace(/-/g, '');

  Tokens
    .findOneAndUpdate({ organization, mac }, { organization, mac, token }, { upsert: true })
    .maxTime(10000)
    .exec()
    .then(doc => {
      req.bag.token = token;
      next();
    })
    .catch(next);
};

const actionLog = (req, res, next) => {
  const { organization, id: nasId } = req.nas;
  const { mac } = req.query;
  const action = 'page-success';
  const payload = { source: 'Captive-Portal' };

  admanager.action(organization, nasId, mac, undefined, action, payload,
    _admanagerCallbackErrorHandler(req, next)
  );
};

const render = (req, res, next) => {
  const { logo } = req.nas.assets;
  const { message, loginUrl, mac, chapId, chapChallenge, redirectUrl } = req.query;
  const { token } = req.bag;

  let impressionImg = {}, impressionUrl;
  req.admanager.forEach(asset => {
    switch (asset.type) {
      case 'board-sm':
        impressionImg.sm = asset.img;
        break;
      case 'board-md':
        impressionImg.md = asset.img;
        break;
      case 'board-lg':
        impressionImg.lg = asset.img;
        break;
      case 'url':
        impressionUrl = asset.url;
        break;
    }
  });

  res.render('mikrotik/success', {
    logo,

    message,
    loginUrl,
    mac,
    token,
    chapId,
    chapChallenge,

    impressionImg,
    impressionUrl,
    redirectUrl
  });

};


module.exports = {
  macValidation,
  generateToken,
  actionLog,
  render
};
