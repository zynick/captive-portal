'use strict';

const mongoose = require('mongoose');
const querystring = require('querystring');
const uuidV4 = require('uuid/v4');

const NAS = mongoose.model('NAS');
const MAC = mongoose.model('MAC');
const Tokens = mongoose.model('Tokens');
const admanager = require('../lib/admanager.js');


// TODO jsonp... wtf how for BK

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
    _admanagerCallbackErrorHandler(req, next));
};


/* Connect */

const connectCheckNewMac = (req, res, next) => {
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

const connectCheckGuestEnabled = (req, res, next) => {
  const { login } = req.nas;
  const { trial } = req.query;
  req.bag.isGuestEnabled = login.guest && trial === 'yes';
  next();
}

const connectGenerateUrl = (req, res, next) => {
  const { query, bag } = req;
  const queryString = querystring.stringify(query);

  const page = bag.isNewUser ? 'signup' : 'success';
  bag.buttonUrl = `/mikrotik/${page}?${queryString}`;

  bag.guestUrl = `/mikrotik/guest?${queryString}`;
  next();
}

const connectRender = (req, res, next) => {
  const { logo, announcements } = req.nas.assets;
  const { message, error } = req.query;
  const { isNewUser, isGuestEnabled, buttonUrl, guestUrl } = req.bag;

  res.render('mikrotik/connect', {
    logo,
    message,
    error,
    announcements,
    isGuestEnabled,
    buttonUrl,
    guestUrl
  });
};


/* Signup */

const signupRender = (req, res, next) => {
  const { logo } = req.nas.assets;
  const isEmailEnabled = req.nas.login.email;
  const data = req.query;

  res.render('mikrotik/signup', {
    logo,
    isEmailEnabled,
    data
  });
};

const signupEmailValidation = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    const err = new Error('Please fill in email.');
    err.status = 499;
    return next(err);
  }

  next();
};

const signupCreateMac = (req, res, next) => {
  const { mac, email } = req.body;
  const { organization, id: createdFrom } = req.nas;

  new MAC({ mac, organization, email, createdFrom })
    .save()
    .then(mac => next())
    .catch(next);
};

const signupActionLog = (req, res, next) => {
  const { organization, id: nasId } = req.nas;
  const { mac } = req.body;
  const action = 'signup';
  const payload = { type: 'Captive-Portal' };

  // TODO query user id from db before posting to log
  admanager.action(organization, nasId, mac, undefined, action, payload,
    _admanagerCallbackErrorHandler(req, next)
  );
};

const signupRedirect = (req, res, next) => {
  const { email, loginUrl, mac, nas, chapId, chapChallenge, redirectUrl } = req.body;
  const message = 'You have signed up successfully.';
  const query = { email, loginUrl, mac, nas, chapId, chapChallenge, redirectUrl, message };
  const queryString = querystring.stringify(query);
  res.redirect(`/mikrotik/success?${queryString}`);
};

const signupErrorRender = (err, req, res, next) => {
  if (err.status !== 499 && err.name !== 'MongooseError' && err.name !== 'ValidationError') {
    return next(err);
  }

  const { logo } = req.nas.assets;
  const error = err.message;
  const isEmailEnabled = req.nas.login.email;
  const data = req.body;

  res.render('mikrotik/signup', {
    logo,
    error,
    isEmailEnabled,
    data
  });
};


/* Guest */

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



/* Success */

const successMacValidation = (req, res, next) => {
  const { organization } = req.nas;
  const { mac } = req.query;

  MAC
    .findOne({ organization, mac })
    .maxTime(10000)
    .exec()
    .then(doc => {
      if (!doc) {
        const err = new Error('Invalid MAC access.');
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
  const { message, loginUrl, mac, chapId, chapChallenge, redirectUrl } = req.query;
  const { token } = req.bag;

  let adsImg, adsUrl;
  req.admanager.every(asset => {
    if (asset.type !== 'board') {
      return true;
    }
    adsImg = asset.img;
    adsUrl = asset.url;
    return false;
  });

  res.render('mikrotik/success', {
    message,
    loginUrl,
    mac,
    token,
    chapId,
    chapChallenge,
    adsUrl,
    adsImg,
    redirectUrl
  });

};


module.exports = {
  init,
  getNAS,
  getAds,

  connectCheckNewMac,
  connectCheckGuestEnabled,
  connectGenerateUrl,
  connectRender,

  signupRender,

  signupEmailValidation,
  signupCreateMac,
  signupActionLog,
  signupRedirect,
  signupErrorRender,

  guestEnabledValidation,
  guestRender,

  // successActionLog,
  successMacValidation,
  successGenerateToken,
  successRender
};
