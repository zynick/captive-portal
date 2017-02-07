'use strict';

const {
    AD_HOST = 'connect-dev-api.tideanalytics.com',
    AD_KEY = 'DuS6YR9aCMJc0345mPNAkAIzaSyCChtVm4UlxD4',
    MONGO_USER = 'radius-user',
    MONGO_PASS = 'radius-punya-password',
    MONGO_HOST = 'localhost',
    MONGO_PORT = 27017,
    MONGO_DB = 'radius',
    NODE_ENV = 'development',
    PORT = 3000
} = process.env;

module.exports = {
    AD_HOST,
    AD_KEY,
    MONGO_USER,
    MONGO_PASS,
    MONGO_HOST,
    MONGO_PORT,
    MONGO_DB,
    NODE_ENV,
    PORT
};