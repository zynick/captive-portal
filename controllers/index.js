'use strict';

const log = require('debug')('portal:controllers');
const { NODE_ENV } = require('../config.js');
const { version } = require('../package.json');


const debug = (req, res, next) => {
  log('==========');
  log(`METHOD: ${JSON.stringify(req.method, null, 2)}`);
  log(`HEADERS: ${JSON.stringify(req.headers, null, 2)}`);
  log(`QUERY: ${JSON.stringify(req.query, null, 2)}`);
  log(`PARAMS: ${JSON.stringify(req.params, null, 2)}`);
  log(`BODY: ${JSON.stringify(req.body, null, 2)}`);
  // res.setHeader('Access-Control-Allow-Credentials', 'true');
  // res.setHeader('Access-Control-Allow-Origin', '*');
  next();
};

const index = (req, res) => {
  res.json(`ACE-TIDE Captive Portal v${version}`);
};

const badRequest = (req, res, next) => {
  const err = new Error('Bad Request');
  err.status = 400;
  next(err);
};

const notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

const mongooseHandlerJSON = (err, req, res, next) => { /* jshint unused: false */
  if(err.name !== 'ValidationError') {
    return next(err);
  }

  const { status = 400 } = err;
  const key = Object.keys(err.errors)[0];
  const { message = 'Validation Error' } = err.errors[key];
  const error = { status, message };
  if (NODE_ENV !== 'production') { error.stack = err.stack; }
  res
    .status(status)
    .json({ error });
};

const mongooseHandlerRender = (err, req, res, next) => { /* jshint unused: false */
  if(err.name !== 'ValidationError') {
    return next(err);
  }

  const { status = 400 } = err;
  const key = Object.keys(err.errors)[0];
  const { message = 'Validation Error' } = err.errors[key];
  const error = { status, message };
  if (NODE_ENV !== 'production') { error.stack = err.stack; }
  res
    .status(status)
    .render('error', { error });
};

const errorHandlerJSON = (err, req, res, next) => { /* jshint unused: false */
  const { status = 500, message = 'Internal Server Error' } = err;
  const error = { status, message };
  if (NODE_ENV !== 'production') { error.stack = err.stack; }
  res
    .status(status)
    .json({ error });
};

const errorHandlerRender = (err, req, res, next) => { /* jshint unused: false */
  const { status = 500, message = 'Internal Server Error' } = err;
  const error = { status, message };
  if (NODE_ENV !== 'production') { error.stack = err.stack; }
  res
    .status(status)
    .render('error', { error });
};


module.exports = {
  debug,
  index,
  badRequest,
  notFound,
  mongooseHandlerJSON,
  mongooseHandlerRender,
  errorHandlerJSON,
  errorHandlerRender
};
