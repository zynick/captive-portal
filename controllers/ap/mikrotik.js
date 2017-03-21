'use strict';

const md5 = require('md5');


const _octalStringToBinary = octalString => {
  let arr = octalString.substr(1).split('\\');
  arr = arr.map(octal => parseInt(octal, 8));
  return Buffer.from(arr).toString('binary');
}

const generateUrl = (req, res, next) => {
  const { loginUrl, mac, redirectUrl } = req.query;
  const { impressionUrl } = req.bag;

  req.bag.impressionUrl = `${loginUrl}?username=T-${mac}&dst=${impressionUrl}`;
  req.bag.redirectUrl = `${loginUrl}?username=T-${mac}&dst=${redirectUrl}`;

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
  generateUrl,
  generateSuccessForm
};
