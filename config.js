'use strict';

const {
    AD_HOST = 'connect-dev-api.tideanalytics.com',
    AD_KEY = 'DuS6YR9aCMJc0345mPNAkAIzaSyCChtVm4UlxD4',
    API_TOKEN = 'T9C6CXztdVhOdAc2azRdBfZrNW1FrHOJ',
    MONGO = 'localhost:27017/radius',
    NODE_ENV = 'development',
    PORT = 3000
} = process.env;

/**
 * our argon2 salt is made of 'username + ARGON2_SALT_SUFFIX'
 * argon2 has a minimum of 8 bytes salt requirement, thus ARGON2_SALT_SUFFIX
 * ensures that is satisfied regardless of 'username' length & value.
 */
const ARGON2_SALT_SUFFIX = 'ace-tide';

module.exports = {
    AD_HOST,
    AD_KEY,
    API_TOKEN,
    ARGON2_SALT_SUFFIX,
    MONGO,
    NODE_ENV,
    PORT
};