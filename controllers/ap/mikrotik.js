'use strict';

const md5 = require('md5');


const _octalStringToBinary = octalString => {
  let arr = octalString.substr(1).split('\\');
  arr = arr.map(octal => parseInt(octal, 8));
  return Buffer.from(arr).toString('binary');
}

// TODO 2: add a function to process bk's API
// TODO 2: add a function to process bk's API
// TODO 2: add a function to process bk's API

const generateGuestForm = (req, res, next) => {

  const { loginUrl, mac, redirectUrl } = req.query;
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

  const { loginUrl, mac, redirectUrl, chapId, chapChallenge } = req.query;
  const { token, impressionUrl } = req.bag;

  const chapIdBin = _octalStringToBinary(chapId);
  const chapChallengeBin = _octalStringToBinary(chapChallenge);
  const password = chapId ? md5(chapIdBin + token + chapChallengeBin) : token;

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

module.exports = {
  generateGuestForm,
  generateSuccessForm
};
