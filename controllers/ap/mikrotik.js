'use strict';

// const log = require('debug')('portal:mikrotik');


// mikrotik dont need init, cause it's direct point to /connect
// const init = (req, res) => {
//   // nas=$(identity)
//   // mac=$(mac)
//   // loginUrl=$(link-login-only)
//   // redirectUrl=$(link-orig)
//   // chapId=$(chap-id)
//   // chapChallenge=$(chap-challenge)
//   // trial=$(trial)
//   // error=$(error)
//   const url = '/connect';
//   res.redirect(url);
// };

const generateUrl = (req, res, next) => {
  const { loginUrl, mac, redirectUrl } = req.query;
  const { impressionUrl } = req.bag;

  req.bag.impressionUrl = `${loginUrl}?username=T-${mac}&dst=${impressionUrl}`;
  req.bag.redirectUrl = `${loginUrl}?username=T-${mac}&dst=${redirectUrl}`;

  next();
};

module.exports = {
  // init
  generateUrl
};
