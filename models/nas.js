'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { NODE_ENV } = require('../config.js');
const Schema = mongoose.Schema;

const nasSchema = new Schema({

  id: {
    type: String,
    required: 'NAS Id is required.',
    index: true,
    unique: 'NAS Id already exists.'
  },

  organization: {
    type: String,
    required: 'Organization is required.',
    index: true
  },

  login: {
    email: {
      type: Boolean,
      required: 'Login is required.'
    },
    guest: Boolean,
    facebook: Boolean,
    google: Boolean
  },

  assets: {
    logo: {
      type: String,
      required: 'Assets is required.'
    },
    url: String,

    announcements: {
      sm: String,
      md: String,
      lg: String
    }
  },

  secret: String,
  lastseen: Date

}, {
  versionKey: false,
  collection: 'nas',
  autoIndex: NODE_ENV !== 'production'
});

nasSchema.plugin(uniqueValidator);

mongoose.model('NAS', nasSchema);
