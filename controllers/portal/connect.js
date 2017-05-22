'use strict';

const querystring = require('querystring');
const admanager = require('../../lib/admanager.js');
const admanagerController = require('../admanager.js');


const checkSeamless = (req, res, next) => {
  const { 'user-agent': userAgent, accept } = req.headers;

  // redirect if request coming from app
  const isFromApp = userAgent === 'ACE Mobile App' && accept === 'application/json';
  if (isFromApp) {
    const queryString = querystring.stringify(req.bag.input);
    return res.redirect(`/portal/seamless?${queryString}`);
  }

  next();
};

const generateUrl = (req, res, next) => {
  const queryString = querystring.stringify(req.bag.input);

  const page = req.bag.isNewMac ? 'signup' : 'success';
  req.bag.buttonUrl = `/portal/${page}?${queryString}`;

  next();
};

const actionLog = (req, res, next) => {
  const { organization, id: nasId } = req.bag.nas;
  const { mac } = req.bag.input;
  const action = 'page-connect';
  const payload = { source: 'Captive-Portal' };

  admanager.action(organization, nasId, mac, undefined, action, payload,
    admanagerController.generateCallbackErrorHandler(next)
  );
};

const render = (req, res) => {
  const { error } = req.bag.input;
  const { logo, announcements } = req.bag.nas.assets;
  const { buttonUrl } = req.bag;

  res.render('connect', {
    logo,
    error,
    announcements,
    buttonUrl
  });
};


module.exports = {
  checkSeamless,
  generateUrl,
  actionLog,
  render
};
