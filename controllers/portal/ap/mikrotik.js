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


const generateBody = (req, res, next) => {
  req.bag.body = req.query; // TODO change it to req.bag.data?
  next();
};

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

  const { loginUrl, mac, redirectUrl, chapId, chapChallenge } = req.query;
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

const generateSeamlessFormFromBody = (req, res, next) => {

  // the below line is the only difference between generateSeamlessForm. refactor?
  const { loginUrl, mac, redirectUrl, chapId, chapChallenge } = req.body;
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

  req.bag.seamless = seamlessForm;

  next();
};

module.exports = {
  generateBody,
  generateGuestForm,
  generateSuccessForm,
  generateSeamlessForm,
  generateSeamlessFormFromBody
};
