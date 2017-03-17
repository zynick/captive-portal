'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const workerSchema = new Schema({

  type:          {type: String, index: true},
  lastActivated: {type: Date, index: true, default: Date.now}
  identifier:    String,

}, {collection: 'worker'});

mongoose.model('worker', workerSchema);
