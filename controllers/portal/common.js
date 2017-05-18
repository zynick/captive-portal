'use strict';

const mongoose = require('mongoose');
const uuidV4 = require('uuid/v4');
const MAC = mongoose.model('MAC');
const NAS = mongoose.model('NAS');
const Tokens = mongoose.model('Tokens');
const admanager = require('../../lib/admanager.js');


const _assetCallbackErrorHandler = (req, next) =>
  (err, httpRes) => {
    if (err) {
      return next(err);
    }

    if (httpRes.statusCode !== 200) {
      err = new Error(`Unable to connect to AD Server: ${httpRes.statusMessage}`);
      err.status = httpRes.statusCode;
      return next(err);
    }

    req.bag.ads = httpRes.body;
    next();
  };

const init = (req, res, next) => {
  req.bag = {};

  // move req.body / req.query to req.bag.input
  req.bag.input = Object.keys(req.body).length ? req.body : req.query;

  next();
};

const getNAS = (req, res, next) => {
  const id = req.bag.input.nas;

  NAS
    .findOne({ id })
    .maxTime(10000)
    .exec()
    .then(nas => {
      if (!nas) {
        const err = new Error('NAS does not exist.');
        err.status = 400;
        return next(err);
      }

      req.bag.nas = nas;
      next();
    })
    .catch(next);
};

const checkNewMac = (req, res, next) => {
  const { organization } = req.bag.nas;
  const { mac } = req.bag.input;

  MAC
    .findOne({ mac, organization })
    .maxTime(10000)
    .exec()
    .then(mac => {
      req.bag.isNewMac = !mac;
      next();
    })
    .catch(next);
};

const generateToken = (req, res, next) => {
  const { organization } = req.bag.nas;
  const { mac } = req.bag.input;

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
        .then(() => {
          req.bag.token = token;
          return next();
        })
        .catch(next);

    })
    .catch(next);
};

const getAds = (req, res, next) => {
  const { organization, id: nasId } = req.bag.nas;
  const { mac, email } = req.bag.input;

  admanager.asset(organization, nasId, mac, email,
    _assetCallbackErrorHandler(req, next)
  );
};

const processAds = (req, res, next) => {

  let impressionImg = {};
  let impressionUrl;

  req.bag.ads.forEach(asset => {
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

  req.bag.impressionImg = impressionImg;
  req.bag.impressionUrl = impressionUrl;

  next();
};

module.exports = {
  init,
  getNAS,
  getAds,
  generateToken,
  checkNewMac,
  processAds
};
