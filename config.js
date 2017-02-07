'use strict';

const {
    AD_HOST = 'connect-dev-api.tideanalytics.com',
    AD_KEY = 'DuS6YR9aCMJc0345mPNAkAIzaSyCChtVm4UlxD4',
    MONGO = 'localhost:27017/radius',
    NODE_ENV = 'development',
    PORT = 3000
} = process.env;

module.exports = {
    AD_HOST,
    AD_KEY,
    MONGO,
    NODE_ENV,
    PORT
};