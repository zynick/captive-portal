'use strict';


const generateUrl = (req, res, next) => {
  const { loginUrl, mac, redirectUrl } = req.query;
  const { impressionUrl } = req.bag;

  req.bag.impressionUrl = `${loginUrl}?username=T-${mac}&dst=${impressionUrl}`;
  req.bag.redirectUrl = `${loginUrl}?username=T-${mac}&dst=${redirectUrl}`;

  next();
};

const generateSuccessForm = (req, res, next) => {

  // prepare the form properly
  const { loginUrl, mac, redirectUrl } = req.query;
  const { token, impressionUrl } = req.bag;

  // TODO do chap challenge properly
  // form.password.value = md5('#{chapId}'+password+'#{chapChallenge}');

  const redirectForm = {
    url: loginUrl,
    method: 'POST',
    body: {
      username: mac,
      password: token,
      dst: redirectUrl
    }
  };

  const impressionForm = {
    url: loginUrl,
    method: 'POST',
    body: {
      username: mac,
      password: token,
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
