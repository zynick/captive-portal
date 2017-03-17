'use strict';

const Worker = require('mongoose').model('Worker');

const addWorker = (req, res) => {

  const {type, identifier} = req.body;

  new Worker({type, identifier})
    .save(() => {
      setTimeout(() => {
        res.status(200).end();
      }, 1000);
    });

};

module.exports = {
  addWorker
};
