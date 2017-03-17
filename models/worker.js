'use strict';

const mongoose        = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema          = mongoose.Schema;

const workerSchema = new Schema({

  type:          {type: String, index: true},
  lastActivated: {type: Date, index: true, default: Date.now},

  identifier: {
    type:     String,
    required: "this is required",
    index:    true,
    unique:   "already exist"
  },

});

workerSchema.plugin(uniqueValidator);

const errorHandler = (err, doc, next) => {

  err.originalMessage = err.message;

  const keys = Object.keys(err.errors);
  err.message = keys[0] ? err.errors[keys[0]].message : err.message;
  err.status = 400;

  next(err);
};

workerSchema.post('save',   errorHandler);
workerSchema.post('update', errorHandler);

mongoose.model('Worker', workerSchema);
