'use strict';

const log = require('debug')('portal:mikrotik');
const admanager = require('../../lib/admanager.js');


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
    _admanagerCallbackErrorHandler(req, next)
  );
};

const render = (req, res, next) => {
  const { logo } = req.nas.assets;
  const { loginUrl, mac } = req.query;

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
  impressionUrl = `${loginUrl}?username=T-${mac}&dst=${impressionUrl}`;

  let { redirectUrl } = req.query;
  redirectUrl = `${loginUrl}?username=T-${mac}&dst=${redirectUrl}`;

  res.render('mikrotik/guest', {
    logo,

    impressionImg,
    impressionUrl,
    redirectUrl
  });
};


module.exports = {
  enabledValidation,
  actionLog,
  render
};
