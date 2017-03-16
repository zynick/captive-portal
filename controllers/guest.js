'use strict';

const log = require('debug')('portal:guest');
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

const enabledValidation = (req, res, next) => {
  const isGuestEnabled = req.nas.login.guest && req.query.trial === 'yes';

  if (!isGuestEnabled) {
    const err = new Error('Guest login is not allowed.');
    err.status = 400;
    return next(err);
  }

  next();
};

const actionLog = (req, res, next) => {
  const { organization, id: nasId } = req.nas;
  const { mac } = req.query;
  const action = 'page-guest';
  const payload = { source: 'Captive-Portal' };

  admanager.action(organization, nasId, mac, undefined, action, payload,
    _actionCallbackErrorHandler(req, next)
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
}

const render = (req, res, next) => {
  const { logo } = req.nas.assets;
  const { impressionImg, impressionUrl, redirectUrl } = req.bag;

  res.render('guest', {
    logo,
    impressionImg,
    impressionUrl,
    redirectUrl
  });
};


module.exports = {
  enabledValidation,
  actionLog,
  processAds,
  render
};
