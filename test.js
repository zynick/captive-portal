'use strict';

const argon2 = require('argon2');

argon2.hash('password', new Buffer('somesalt'), {
    type: argon2.argon2d,
    timeCost: 3,
    memoryCost: 11,
    parallelism: 1,
    raw: true
}).then((hash) => {
    console.log(hash.toString('hex'));
}).catch((err) => {
    console.error(err);
});
