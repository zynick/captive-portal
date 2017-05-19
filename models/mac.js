'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { NODE_ENV } = require('../config.js');
const Schema = mongoose.Schema;

const macSchema = new Schema({

  mac: {
    type: String,
    required: 'MAC is required.',
    index: true
  },

  organization: {
    type: String,
    required: 'Organization is required.'
  },

  email: String,
  mobile: String,
  userId: String,

  createdFrom: String, // created from which nasId or API
  created: {
    type: Date,
    default: Date.now
  }

}, {
  versionKey: false,
  collection: 'mac',
  autoIndex: NODE_ENV !== 'production'
});

macSchema.index({ organization: 1, mac: 1 }, { unique: 'MAC already exists.' });
macSchema.plugin(uniqueValidator);

mongoose.model('MAC', macSchema);
