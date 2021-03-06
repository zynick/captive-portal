'use strict';

const bodyParser = require('body-parser');
const debug = require('debug');
const express = require('express');
const glob = require('glob');
const mongoose = require('mongoose');
const morgan = require('morgan');
// const favicon = require('serve-favicon');
const http = require('http');
const path = require('path');

const log = debug('portal');
const logError = debug('portal:error');
const { MONGO, PORT } = require('./config.js');


/* Initialize Database */
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${MONGO}`);
mongoose.connection.on('error', err => {
  logError(`unable to connect to database at ${MONGO}`);
  logError(err);
});
glob.sync('./models/*.js')
  .forEach(model => require(model));


/* Initialize Express */
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes'));

// normalize environment port into a number, string (named pipe), or false.
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) { return val; }
  if (port >= 0) { return port; }
  return false;
};
const port = normalizePort(PORT);
app.set('port', port);


/* Create HTTP server. */
const server = http.createServer(app);

server.listen(port);

server.on('error', err => {
  if (err.syscall !== 'listen') {
    throw err;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (err.code) {
    case 'EACCES':
      logError(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logError(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
});

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  log(`Listening on ${bind}`);
});
