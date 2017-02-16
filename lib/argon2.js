'use strict';

const argon2 = require('argon2');
const { ARGON2_SALT_SUFFIX } = require('../config.js');

const hashPassword = (username, password, next) => {
    argon2
        .hash(password, new Buffer(username + ARGON2_SALT_SUFFIX), {
            type: argon2.argon2d,
            timeCost: 2,
            memoryCost: 8,
            parallelism: 1,
            raw: true
        })
        .then(hash => next(null, hash.toString('hex')))
        .catch(next);
};

module.exports = { hashPassword };