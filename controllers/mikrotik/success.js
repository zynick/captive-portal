'use strict';

const mongoose = require('mongoose');
const uuidV4 = require('uuid/v4');
const log = require('debug')('portal:mikrotik');
const MAC = mongoose.model('MAC');
const Tokens = mongoose.model('Tokens');


const successMacValidation = (req, res, next) => {
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

const successGenerateToken = (req, res, next) => {
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

const successRender = (req, res, next) => {
  const { logo } = req.nas.assets;
  const { message, loginUrl, mac, chapId, chapChallenge, redirectUrl } = req.query;
  const { token } = req.bag;

  // TODO remove dev only
  req.admanager.push({
    type: 'board-sm',
    img: '../img/impression-sm.jpg'
  });
  req.admanager.push({
    type: 'board-md',
    img: '../img/impression-md.jpg'
  });
  req.admanager.push({
    type: 'board-lg',
    img: '../img/impression-lg.jpg'
  });
  req.admanager.push({
    type: 'url',
    url: 'https://app.tideanalytics.com'
  });

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
  successMacValidation,
  successGenerateToken,
  successRender
};
