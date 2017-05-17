'use strict';

const md5 = require('md5');


const _octalStringToBinary = octalString => {
  let arr = octalString.substr(1).split('\\');
  arr = arr.map(octal => parseInt(octal, 8));
  return Buffer.from(arr).toString('binary');
};

const _generatePassword = (token, chapId, chapChallenge) => {
  if (chapId) {
    const chapIdBin = _octalStringToBinary(chapId);
    const chapChallengeBin = _octalStringToBinary(chapChallenge);
    return chapId ? md5(chapIdBin + token + chapChallengeBin) : token;
  } else {
    return token;
  }
};


const generateGuestForm = (req, res, next) => {

  const { loginUrl, mac, redirectUrl } = req.bag.input;
  const { impressionUrl } = req.bag;

  const redirectForm = {
    url: loginUrl,
    method: 'GET',
    body: {
      username: `T-${mac}`,
      dst: redirectUrl
    }
  };

  const impressionForm = {
    url: loginUrl,
    method: 'GET',
    body: {
      username: `T-${mac}`,
      dst: impressionUrl
    }
  };

  req.bag.redirectForm = redirectForm;
  req.bag.impressionForm = impressionForm;

  next();
};

const generateSuccessForm = (req, res, next) => {

  const { loginUrl, mac, redirectUrl, chapId, chapChallenge } = req.bag.input;
  const { token, impressionUrl } = req.bag;
  const password = _generatePassword(token, chapId, chapChallenge);

  const redirectForm = {
    url: loginUrl,
    method: 'POST',
    body: {
      username: mac,
      password: password,
      dst: redirectUrl
    }
  };

  const impressionForm = {
    url: loginUrl,
    method: 'POST',
    body: {
      username: mac,
      password: password,
      dst: impressionUrl
    }
  };

  req.bag.redirectForm = redirectForm;
  req.bag.impressionForm = impressionForm;

  next();
};

const generateSeamlessForm = (req, res, next) => {

  const { loginUrl, mac, redirectUrl, chapId, chapChallenge } = req.bag.input;
  const { token } = req.bag;
  const password = _generatePassword(token, chapId, chapChallenge);

  const seamlessForm = {
    url: loginUrl,
    method: 'POST',
    body: {
      username: mac,
      password: password,
      dst: redirectUrl
    }
  };

  req.bag.seamlessForm = seamlessForm;

  next();
};


module.exports = {
  generateGuestForm,
  generateSuccessForm,
  generateSeamlessForm
};
