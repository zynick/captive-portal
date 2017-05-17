'use strict';

const admanager = require('../../lib/admanager.js');


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

const validate = (req, res, next) => {
  const { trial } = req.bag.input;
  const { guest } = req.bag.nas.login;
  const isGuestEnabled = guest && trial === 'yes';

  if (!isGuestEnabled) {
    const err = new Error('Guest login is not allowed.');
    err.status = 400;
    return next(err);
  }

  next();
};

const actionLog = (req, res, next) => {
  const { organization, id: nasId } = req.bag.nas;
  const { mac } = req.bag.input;
  const action = 'page-guest';
  const payload = { source: 'Captive-Portal' };

  admanager.action(organization, nasId, mac, undefined, action, payload,
    _actionCallbackErrorHandler(req, next)
  );
};

const render = (req, res) => {
  const { logo } = req.bag.nas.assets;
  const { impressionImg, redirectForm, impressionForm } = req.bag;

  res.render('guest', {
    logo,
    impressionImg,
    redirectForm,
    impressionForm
  });
};


module.exports = {
  validate,
  actionLog,
  render
};
