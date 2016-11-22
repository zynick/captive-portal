'use strict';

const md5 = require('blueimp-md5');
const hex2bin = require('./hex2bin');
const bin2hex = require('./bin2hex');

/**
 * references:
 * https://github.com/cloudtrax/docs/tree/master/captive_portal/splash_pages/external
 * https://sourceforge.net/p/hotcakes/wiki/yfi_explain_uam/
 * https://help.ubuntu.com/community/WifiDocs/ChillispotHotspot
 */

module.exports = (plain, challenge = '', secret = '') => {
    if (challenge.length === 0 || (challenge.length % 2) !== 0) {
        return false;
    }

    const hexChallenge = hex2bin(challenge);
    if (hexChallenge === false) {
        return false;
    }

    let hash, length;
    if (secret.length > 0) {
        hash = md5(`${hexChallenge}${secret}`, null, true);
        length = 16;
    } else {
        hash = hexChallenge;
        length = hexChallenge.length;
    }

    // simulate C style \0 terminated string
    plain += '\0';
    let crypted = '';
    for (let i = 0; i < plain.length; i++) {
        crypted += plain[i] ^ hash[i % length];
    }

    // let extra_bytes = 0; //rand(0, 16);
    // for (let i = 0; i < extra_bytes; i++) {
    //     // crypted += chr(rand(0, 255));
    // }

    return bin2hex(crypted);
};
