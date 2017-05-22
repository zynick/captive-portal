'use strict';

const mongoose = require('mongoose');
const MAC = mongoose.model('MAC');
const admanager = require('../../lib/admanager.js');
const admanagerController = require('../admanager.js');


const validate = (req, res, next) => {
  const { organization } = req.bag.nas;
  const { mac } = req.bag.input;

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

const actionLog = (req, res, next) => {
  const { organization, id: nasId } = req.bag.nas;
  const { mac } = req.bag.input;
  const action = 'page-success';
  const payload = { source: 'Captive-Portal' };

  admanager.action(organization, nasId, mac, undefined, action, payload,
    admanagerController.generateCallbackErrorHandler(next)
  );
};

const render = (req, res) => {
  const { logo } = req.bag.nas.assets;
  const { message } = req.bag.input;
  const { impressionImg, redirectForm, impressionForm } = req.bag;

  res.render('success', {
    logo,
    message,
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
