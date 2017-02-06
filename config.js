'use strict';

const {
    AD_HOST = 'connect-dev-api.tideanalytics.com',
    AD_KEY = 'DuS6YR9aCMJc0345mPNAkAIzaSyCChtVm4UlxD4',
    MONGO_HOST = 'localhost',
    MONGO_PORT = 27017,
    MONGO_DATABASE = 'radius',
    NODE_ENV = 'development',
    PORT = 3000
} = process.env;

module.exports = {
    AD_HOST,
    AD_KEY,
    MONGO_HOST,
    MONGO_PORT,
    MONGO_DATABASE,
    NODE_ENV,
    PORT
};