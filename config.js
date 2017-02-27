'use strict';

const {
  AD_HOST = 'manager-api-dev.tideanalytics.com',
  AD_KEY = 'DuS6YR9aCMJc0345mPNAkAIzaSyCChtVm4UlxD4',
  API_TOKEN = 'T9C6CXztdVhOdAc2azRdBfZrNW1FrHOJ',
  MONGO = 'localhost:27017/radius',
  NODE_ENV = 'development',
  PORT = 3000
} = process.env;

module.exports = {
  AD_HOST,
  AD_KEY,
  API_TOKEN,
  MONGO,
  NODE_ENV,
  PORT
};
