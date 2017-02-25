'use strict';

const mongoose = require('mongoose');
const querystring = require('querystring');
const log = require('debug')('portal:mikrotik');
const MAC = mongoose.model('MAC');


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

const connectGenerateUrl = (req, res, next) => {
  const { query, bag } = req;
  const queryString = querystring.stringify(query);

  const page = bag.isNewUser ? 'signup' : 'success';
  bag.buttonUrl = `/mikrotik/${page}?${queryString}`;

  // bag.guestUrl = `/mikrotik/guest?${queryString}`;
  next();
};

const connectRender = (req, res, next) => {
  const { logo, announcements } = req.nas.assets;
  const { error } = req.query;
  const { buttonUrl } = req.bag;

  res.render('mikrotik/connect', {
    logo,
    error,
    announcements,
    buttonUrl
  });
};


module.exports = {
  connectCheckNewMac,
  connectGenerateUrl,
  connectRender
};
