'use strict';

// version 3.2.1-r6
// "ga_ssid": "ACE E400",
// "ga_ap_mac": "00-04-56-AC-B3-AA",
// "ga_nas_id": "E400-ACB3AA",
// "ga_srvr": "192.168.0.70",
// "ga_cmac": "70-56-81-C2-9C-23",
// "ga_rssi": "56",
// "ga_Qv": "eUROBR86HBgAGDEEVgQGBRtPFwsdFzc-DkRaR0A3Vk9AJkxaUUNeVGRERFwVBB8mDw..",
// "ga_orig_url": "http://init-s01st.push.apple.com/bag"
// "ga_error_code": "timeout | reject | not-found"

// version 3.1-b17
// "ga_ssid": "ACE E400",
// "ga_ap_mac": "00-04-56-AC-B3-AA",
// "ga_nas_id": "E400-ACB3AA",
// "ga_srvr": "192.168.0.70",
// "ga_cmac": "C0-EE-FB-D5-C9-B4",
// "ga_Qv": "yDN\u0005\u001f:\u001c\u0018\u0000\u00181\u0004V\u0004\u0006\u0005\u001bO\u0017\u000b\u001d\u00177>\u000eD]7@M,OG!L)/C-$dD0\\\u0015\u0004\u001f&\u000f",
// "ga_orig_url": "http://www.tideanalytics.com/"

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
  const loginUrl = `${ga_srvr}:880/cgi-bin/hotspot_login.cgi`;  // body: ga_user=xxx&ga_pass=xxx
  const redirectUrl = ga_orig_url;
  const trial = 'yes';
  const error =
    ga_error_code === 'timeout' ? 'Authentication server failed to respond, retry again in few minutes' :
    ga_error_code === 'reject' ? 'The username or password you entered is incorrect' :
    ga_error_code === 'not-found' ? 'The authentication server not available, contact network admin' : '';
  const p1 = encodeURIComponent(ga_Qv);
  const p2 = ga_nas_id; // we may not need this

  const url = `/connect?nas=${nas}&mac=${mac}&loginUrl=${loginUrl}&redirectUrl=${redirectUrl}&trial=${trial}&error=${error}&p1=${p1}&p2=${p2}&type=cambium`;
  res.redirect(url);
};

const generateUrl = (req, res, next) => {

  const { loginUrl, mac, redirectUrl } = req.query;
  const { impressionUrl } = req.bag;

  req.bag.impressionUrl = `${loginUrl}?username=T-${mac}&dst=${impressionUrl}`;
  req.bag.redirectUrl = `${loginUrl}?username=T-${mac}&dst=${redirectUrl}`;

  next();
};

module.exports = {
  parse,
  generateUrl
};