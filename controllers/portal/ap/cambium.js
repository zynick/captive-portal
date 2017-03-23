'use strict';

const parse = (req, res, next) => {

  const {
    ga_ap_mac,
    ga_nas_id,
    ga_srvr,
    ga_cmac,
    ga_Qv,
    ga_orig_url,
    ga_error_code
  } = req.query;

  const nas = ga_ap_mac.replace(/-/g, ':');
  const mac = ga_cmac.replace(/-/g, ':');
  const loginUrl = `https://${ga_srvr}:444/cgi-bin/hotspot_login.cgi`;

  const redirectUrl = ga_orig_url;
  const error =
    ga_error_code === 'timeout' ? 'Authentication server failed to respond, retry again in few minutes' :
    ga_error_code === 'reject' ? 'The username or password you entered is incorrect' :
    ga_error_code === 'not-found' ? 'The authentication server not available, contact network admin' : '';
  const p1 = ga_nas_id;
  const p2 = ga_srvr;
  const p3 = encodeURIComponent(ga_Qv);

  const url = `/portal/connect?nas=${nas}&mac=${mac}&loginUrl=${loginUrl}&redirectUrl=${redirectUrl}&error=${error}&p1=${p1}&p2=${p2}&p3=${p3}&type=cambium`;
  res.redirect(url);
};

const generateGuestForm = (req, res, next) => {
  next(new Error('Guest login is not supported by Cambium.'));
};

const generateSuccessForm = (req, res, next) => {

  const { loginUrl, nas, mac, p1, p2, p3, redirectUrl } = req.query;
  const { token, impressionUrl } = req.bag;

  const ga_ap_mac = nas.replace(/:/g, '-');
  const ga_nas_id = p1;
  const ga_srvr = p2;
  const ga_cmac = mac.replace(/:/g, '-');
  const ga_Qv = encodeURIComponent(p3);

  const redirectForm = {
    url: `${loginUrl}?ga_ap_mac=${ga_ap_mac}&ga_nas_id=${ga_nas_id}&ga_srvr=${ga_srvr}&ga_cmac=${ga_cmac}&ga_Qv=${ga_Qv}&ga_orig_url=${redirectUrl}`,
    method: 'POST',
    body: {
      ga_user: mac,
      ga_pass: token
    }
  };

  const impressionForm = {
    url: `${loginUrl}?ga_ap_mac=${ga_ap_mac}&ga_nas_id=${ga_nas_id}&ga_srvr=${ga_srvr}&ga_cmac=${ga_cmac}&ga_Qv=${ga_Qv}&ga_orig_url=${impressionUrl}`,
    method: 'POST',
    body: {
      ga_user: mac,
      ga_pass: token
    }
  };

  req.bag.redirectForm = redirectForm;
  req.bag.impressionForm = impressionForm;

  next();
};

module.exports = {
  parse,
  generateGuestForm,
  generateSuccessForm
};
