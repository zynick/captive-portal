'use strict';

const mongoose = require('mongoose');
const querystring = require('querystring');
const uuidV4 = require('uuid/v4');
const NAS = mongoose.model('NAS');
const Users = mongoose.model('Users');
const MAC = mongoose.model('MAC');
const Tokens = mongoose.model('Tokens');
const admanager = require('../lib/admanager.js');


// TODO jsonp
// TODO do action log!


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
    (err, httpRes) => {
      if (err) {
        return next(err);
      }

      if (httpRes.statusCode !== 200) {
        err = new Error(`Unable to query content from AD Server: ${httpRes.statusMessage}`);
        err.status = httpRes.statusCode;
        return next(err);
      }

      req.ads = httpRes.body;
      next();
    });
};


/* Welcome */

const welcomeCheckNewUser = (req, res, next) => {
  const { mac } = req.query;
  const { organization } = req.nas;

  MAC
    .findOne({ mac, organization })
    .maxTime(10000)
    .exec()
    .then(mac => {
      req.isNewUser = !mac;
      // req.mac = mac;
      next();
    })
    .catch(next);
};

const welcomeRender = (req, res, next) => {

  const { isNewUser, query } = req;
  const { login, assets } = req.nas;
  const queryString = querystring.stringify(query);

  login.guest = login.guest && query.trial === 'yes';
  login.signupUrl = `/mikrotik/signup?${queryString}`;
  login.successUrl = `/mikrotik/success?${queryString}`;

  res.render('mikrotik/welcome', { isNewUser, query, login, assets });
};


/* Signup */

const signupRender = (req, res, next) => {
  const {
    query: data,
    nas: { login, assets }
  } = req;
  res.render('mikrotik/signup', { data, login, assets });
};

const signupValidation = (req, res, next) => {

  const { email } = req.body;

  if (!email) {
    const err = new Error('Please fill in email');
    err.status = 499;
    return next(err);
  }

  next();
};

const signupCreateMAC = (req, res, next) => {
  const { mac, email } = req.body;
  const { organization, id: createdFrom } = req.nas;

  new MAC({ mac, organization, email, createdFrom })
    .save()
    .then(mac => next())
    .catch(next);
};

const signupRedirect = (req, res, next) => {
  const { email, loginUrl, mac, nas, chapId, chapChallenge, redirectUrl } = req.body;
  const message = 'You have signed up successfully.';
  const data = { email, loginUrl, mac, nas, chapId, chapChallenge, redirectUrl, message };
  const queryString = querystring.stringify(data);
  res.redirect(`/mikrotik/success?${queryString}`);
};

const signupErrorHandlerRender = (err, req, res, next) => {

  if (err.status !== 499 && err.name !== 'MongooseError' && err.name !== 'ValidationError') {
    console.log(JSON.stringify(err));
    return next(err);
  }

  error = err.message;
  const data = req.body;
  const { login, assets } = req.nas;
  res.render('mikrotik/signup', { error, data, login, assets });
};


/* Guest */

const guestValidation = (req, res, next) => {

  const isGuest = req.nas.login.guest && req.query.trial === 'yes';

  if (!isGuest) {
    const err = new Error('Guest login not allowed');
    err.status = 400;
    return next(err);
  }

  next();
};

const guestRender = (req, res, next) => {

  const { message, loginUrl, mac, redirectUrl } = req.query;

  let impressionImg, impressionUrl;
  req.ads.every(asset => {
    if (asset.type !== 'board') {
      return true;
    }
    impressionImg = asset.img;
    impressionUrl = asset.url;
    return false;
  });

  res.render('mikrotik/guest', {
    message,
    impressionUrl: `${loginUrl}?username=T-${mac}&dst=${impressionUrl}`,
    impressionImg,
    redirectUrl: `${loginUrl}?username=T-${mac}&dst=${redirectUrl}`
  });

};



/* Success */

const successValidation = (req, res, next) => {

  const { organization } = req.nas;
  const { mac } = req.query;

  MAC
    .findOne({ organization, mac })
    .maxTime(10000)
    .exec()
    .then(doc => {
      if (!doc) {
        const err = new Error('Invalid NAS or MAC');
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
      req.token = token;
      next();
    })
    .catch(next);
};

const successRender = (req, res, next) => {

  const { message, loginUrl, mac, chapId, chapChallenge, redirectUrl } = req.query;
  const token = req.token;

  let impressionImg, impressionUrl;
  req.ads.every(asset => {
    if (asset.type !== 'board') {
      return true;
    }
    impressionImg = asset.img;
    impressionUrl = asset.url;
    return false;
  });

  res.render('mikrotik/success', {
    message,
    loginUrl,
    mac,
    token,
    chapId,
    chapChallenge,
    impressionUrl,
    impressionImg,
    redirectUrl
  });

};


module.exports = {
  getNAS,
  getAds,

  welcomeCheckNewUser,
  welcomeRender,

  signupRender,

  signupValidation,
  signupCreateMAC,
  signupRedirect,
  signupErrorHandlerRender,

  guestValidation,
  guestRender,

  // successActionLog,
  successValidation,
  successGenerateToken,
  successRender
};
