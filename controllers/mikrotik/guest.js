'use strict';

const log = require('debug')('portal:mikrotik');


const guestEnabledValidation = (req, res, next) => {
  const isGuestEnabled = req.nas.login.guest && req.query.trial === 'yes';

  if (!isGuestEnabled) {
    const err = new Error('Guest login is not allowed.');
    err.status = 400;
    return next(err);
  }

  next();
};

const guestRender = (req, res, next) => {
  const { logo } = req.nas.assets;
  const { message, loginUrl, mac } = req.query;

  let adsImg, adsUrl;
  req.admanager.every(asset => {
    if (asset.type !== 'board') {
      return true;
    }
    adsImg = asset.img;
    adsUrl = asset.url;
    return false;
  });
  adsUrl = `${loginUrl}?username=T-${mac}&dst=${adsUrl}`;

  let { redirectUrl } = req.query;
  redirectUrl = `${loginUrl}?username=T-${mac}&dst=${redirectUrl}`;

  res.render('mikrotik/guest', {
    logo,
    message,
    adsImg,
    adsUrl,
    redirectUrl
  });
};


module.exports = {
  guestEnabledValidation,
  guestRender
};
