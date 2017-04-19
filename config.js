'use strict';

const {
  AD_HOST = 'manager-api-dev.tideanalytics.com',
  AD_KEY = 'DuS6YR9aCMJc0345mPNAkAIzaSyCChtVm4UlxD4',
  HOST = 'https://captive-portal-dev.tideanalytics.com',
  MONGO = 'localhost:27017/radius-dev',
  NODE_ENV = 'development',
  PORT = 3000
} = process.env;

module.exports = {
  AD_HOST,
  AD_KEY,
  HOST,
  MONGO,
  NODE_ENV,
  PORT
};
