'use strict';

const md5 = require('md5');


const _octalStringToBinary = octalString => {
  let arr = octalString.substr(1).split('\\');
  arr = arr.map(octal => parseInt(octal, 8));
  return Buffer.from(arr).toString('binary');
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

  let password = token;
  if (chapId) {
    const chapIdBin = _octalStringToBinary(chapId);
    const chapChallengeBin = _octalStringToBinary(chapChallenge);
    password = chapId ? md5(chapIdBin + token + chapChallengeBin) : token;
  }

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

const generateBody = (req, res, next) => {
  // TODO why not pass the whole req.query shit to body for BK?
  const { loginUrl, mac, redirectUrl, chapId, chapChallenge } = req.query;
  req.bag.body = { loginUrl, mac, redirectUrl, chapId, chapChallenge };
  next();
};

const generateSuccessForm2 = (req, res, next) => {

  const { loginUrl, mac, redirectUrl, chapId, chapChallenge } = req.body;
  const { token } = req.bag;

  let password = token;
  if (chapId) {
    const chapIdBin = _octalStringToBinary(chapId);
    const chapChallengeBin = _octalStringToBinary(chapChallenge);
    password = chapId ? md5(chapIdBin + token + chapChallengeBin) : token;
  }

  const seamlessForm = {
    url: loginUrl,
    method: 'POST',
    body: {
      username: mac,
      password: password,
      dst: redirectUrl
    }
  };

  // TODO name it to a generic form perhaps? this is fucking confusing but i'm doing this just for BK to test first
  req.bag.impressionForm = seamlessForm;

};

module.exports = {
  generateGuestForm,
  generateSuccessForm,
  generateBody,
  generateSuccessForm2
};
