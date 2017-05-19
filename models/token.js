'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { NODE_ENV } = require('../config.js');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({

  organization: {
    type: String,
    required: 'Organization is required.'
  },

  mac: {
    type: String,
    required: 'MAC is required.'
  },

  token: {
    type: String,
    required: 'Token is required.'
  }

}, {
  versionKey: false,
  collection: 'tokens',
  autoIndex: NODE_ENV !== 'production'
});

tokenSchema.index({ organization: 1, mac: 1 }, { unique: 'Token already exists' });
tokenSchema.plugin(uniqueValidator);

mongoose.model('Tokens', tokenSchema);
