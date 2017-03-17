'use strict';

const mongoose   = require('mongoose');
const {NODE_ENV} = require('../config.js');
const Schema     = mongoose.Schema;

const workerSchema = new Schema({

  token: {
    type:     String,
    required: 'token is required.',
    index:    true
  },

  type:          String,
  created:       {type: Date, default: Date.now},
  lastActivated: {type: Date, default: Date.now}

}, {
  versionKey: false,
  collection: 'worker',
  autoIndex:  NODE_ENV !== 'production'
});


mongoose.model('worker', workerSchema);
