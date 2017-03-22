'use strict';

const mongoose = require('mongoose');
const log = require('debug')('portal:common');
const NAS = mongoose.model('NAS');
const admanager = require('../lib/admanager.js');


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

    req.ads = httpRes.body;
    next();
  };


const init = (req, res, next) => {
  req.bag = {};
  next();
};

const getNAS = (req, res, next) => {
  const id = req.query.nas || req.body.nas;

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

      req.nas = nas;
      next();
    })
    .catch(next);
};

const getAds = (req, res, next) => {
  const { organization, id: nasId } = req.nas;
  const { mac, email } = req.query;

  admanager.asset(organization, nasId, mac, email,
    _assetCallbackErrorHandler(req, next)
  );
};

const processAds = (req, res, next) => {

  let impressionImg = {}, impressionUrl;
  req.ads.forEach(asset => {
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
  processAds
};
