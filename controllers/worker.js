'use strict';

const Worker = require('mongoose').model('Worker');

const addWorker = (req, res, next) => {

  const {type, identifier} = req.body;

  new Worker({type, identifier})
    .save((err) => {
      if (err) { return next(err); }
      setTimeout(() => { res.status(200).end(); }, 1000);
    });

};

const listWorkers = (req, res, next) => {

  Worker
    .find()
    .exec((err, workers) => {
      if (err) { return next(err); }
      return res.jsonp(workers);
    });

};

const getEarliestActivated = (req, res, next) => {

  Worker
    .find()
    .sort('lastActivated')
    .limit(1)
    .exec( (err, workers) => {
      if (err) { return next(err); }
      return res.jsonp(workers[0]);
    });

};

const pong = (req, res) => {
  res.jsonp('pong');
};

module.exports = {
  addWorker, listWorkers, getEarliestActivated, pong
};
